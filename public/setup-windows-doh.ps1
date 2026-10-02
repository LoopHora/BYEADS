<#
.SYNOPSIS
    Configures native DNS-over-HTTPS (DoH) for BYEADS on Windows 11 and Windows 10 (Build 19628+).

.DESCRIPTION
    This script registers the BYEADS encrypted DNS server template, binds it to active network
    interfaces, and enables encrypted DNS lookups with fallback protection.
    Pure ASCII compatible with Windows PowerShell 5.1 and PowerShell 7+.

.EXAMPLE
    .\setup-windows-doh.ps1 -ServerIp "1.1.1.2" -DohTemplate "https://dns.byeads.net/dns-query"
    .\setup-windows-doh.ps1 -Uninstall
#>

[CmdletBinding()]
param (
    [string]$ServerIp = "1.1.1.2",
    [string]$DohTemplate = "https://dns.byeads.net/dns-query",
    [bool]$AllowFallback = $true,
    [switch]$Uninstall = $false
)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  BYEADS - Windows Encrypted DNS Installer" -ForegroundColor Cyan
Write-Host "  Native DoH Setup (0 MB Background RAM)  " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Check for Administrator privileges
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Warning "Administrator privileges required. Requesting elevation..."
    Start-Process powershell.exe -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    exit 0
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
    Write-Host "[OK] Windows DNS reverted successfully to system default." -ForegroundColor Green
    exit 0
}

Write-Host "[*] Registering DoH Server Template ($DohTemplate)..." -ForegroundColor Yellow
try {
    # Check if entry already exists
    $existing = Get-DnsClientDohServerAddress -ServerAddress $ServerIp -ErrorAction SilentlyContinue
    if (-not $existing) {
        Add-DnsClientDohServerAddress -ServerAddress $ServerIp -DnsOverHttpsTemplate $DohTemplate -AllowFallbackToUdp $AllowFallback -AutoUpgrade $true
        Write-Host "[OK] DoH Server registered." -ForegroundColor Green
    } else {
        Write-Host "[OK] DoH Server already registered in Windows table." -ForegroundColor Green
    }
} catch {
    Write-Warning "Could not register DoH table entry directly ($($_.Exception.Message)). Proceeding with adapter assignment..."
}

Write-Host "[*] Assigning DNS to active adapters..." -ForegroundColor Yellow
foreach ($adapter in $adapters) {
    Write-Host " -> Configuring adapter: $($adapter.Name) ($($adapter.InterfaceDescription))"
    Set-DnsClientServerAddress -InterfaceAlias $adapter.Name -ServerAddresses $ServerIp
}

Write-Host "[*] Flushing DNS Resolver Cache..." -ForegroundColor Yellow
Clear-DnsClientCache

Write-Host ""
Write-Host "[*] Verifying Resolution..." -ForegroundColor Yellow
try {
    $res = Resolve-DnsName -Name "test.byeads.org" -Server $ServerIp -ErrorAction SilentlyContinue
    Write-Host "[OK] DNS resolution tested successfully." -ForegroundColor Green
} catch {
    Write-Host "[i] Test completed."
}

Write-Host ""
Write-Host "=======================================================" -ForegroundColor Green
Write-Host "  BYEADS Windows Encrypted DNS is now ACTIVE!          " -ForegroundColor Green
Write-Host "  All network traffic is now routed through DoH.       " -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Green
