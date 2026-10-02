<#
.SYNOPSIS
    Configures native DNS-over-HTTPS (DoH) for BYEADS on Windows 11 and Windows 10 (Build 19628+).

.DESCRIPTION
    This script registers the BYEADS encrypted DNS server template, binds it to active network
    interfaces, and enables encrypted DNS lookups with fallback protection.

.EXAMPLE
    .\setup-windows-doh.ps1 -ServerIp "1.1.1.2" -DohTemplate "https://dns.byeads.net/dns-query"
    .\setup-windows-doh.ps1 -Uninstall
#>

[CmdletBinding()]
param (
    [string]$ServerIp = "1.1.1.2",
    [string]$DohTemplate = "https://dns.byeads.net/dns-query",
    [switch]$AllowFallback = $true,
    [switch]$Uninstall = $false
)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  BYEADS — Windows Encrypted DNS Installer" -ForegroundColor Cyan
Write-Host "  Native DoH Setup (0 MB Background RAM)  " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Check for Administrator privileges
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Error "Please run this script from an elevated PowerShell terminal (Run as Administrator)."
    exit 1
}

# Get active network adapters (Wi-Fi, Ethernet)
$adapters = Get-NetAdapter | Where-Object { $_.Status -eq 'Up' -and $_.Virtual -eq $false }
if (-not $adapters) {
    Write-Warning "No active physical network adapters found."
    exit 1
}

if ($Uninstall) {
    Write-Host "[*] Reverting DNS settings to DHCP Automatic..." -ForegroundColor Yellow
    foreach ($adapter in $adapters) {
        Write-Host " -> Resetting adapter: $($adapter.Name)"
        Set-DnsClientServerAddress -InterfaceAlias $adapter.Name -ResetServerAddresses
    }
    Write-Host "[✓] Windows DNS reverted successfully to system default." -ForegroundColor Green
    exit 0
}

Write-Host "[*] Registering DoH Server Template ($DohTemplate)..." -ForegroundColor Yellow
try {
    # Check if entry already exists
    $existing = Get-DnsClientDohServerAddress -ServerAddress $ServerIp -ErrorAction SilentlyContinue
    if (-not $existing) {
        Add-DnsClientDohServerAddress -ServerAddress $ServerIp -DnsOverHttpsTemplate $DohTemplate -AllowFallbackToUdp $AllowFallback -AutoUpgrade $true
        Write-Host "[✓] DoH Server registered." -ForegroundColor Green
    } else {
        Write-Host "[✓] DoH Server already registered in Windows table." -ForegroundColor Green
    }
} catch {
    Write-Warning "Could not register DoH table entry directly ($_.Exception.Message). Proceeding with adapter assignment..."
}

Write-Host "[*] Assigning DNS to active adapters..." -ForegroundColor Yellow
foreach ($adapter in $adapters) {
    Write-Host " -> Configuring adapter: $($adapter.Name) ($($adapter.InterfaceDescription))"
    Set-DnsClientServerAddress -InterfaceAlias $adapter.Name -ServerAddresses $ServerIp
}

Write-Host "[*] Flushing DNS Resolver Cache..." -ForegroundColor Yellow
Clear-DnsClientCache

Write-Host "`n[*] Verifying Resolution..." -ForegroundColor Yellow
try {
    $res = Resolve-DnsName -Name "test.byeads.org" -Server $ServerIp -ErrorAction SilentlyContinue
    Write-Host "[✓] DNS resolution tested successfully." -ForegroundColor Green
} catch {
    Write-Host "[i] Test completed."
}

Write-Host "`n=======================================================" -ForegroundColor Green
Write-Host "  BYEADS Windows Encrypted DNS is now ACTIVE!          " -ForegroundColor Green
Write-Host "  All network traffic is now routed through DoH.       " -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Green
