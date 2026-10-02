@echo off
:: ========================================================
:: BYEADS — 1-Click Windows Encrypted DNS Installer
:: Native Windows 11/10 DNS-over-HTTPS (0 MB Background RAM)
:: ========================================================

:: Check for Administrative privileges
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Requesting Administrator privileges...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

title BYEADS Windows DNS Shield Installer
color 0A
cls
echo ========================================================
echo   BYEADS -- 1-Click Windows Encrypted DNS Setup
echo   Zero-Bloat Native DoH (No .EXE or background daemons)
echo ========================================================
echo.
echo [1] Enable BYEADS Ad, Tracker & Malware Shield (Recommended: dns.byeads.net)
echo [2] Enable BYEADS Malware & Threat Shield Only (security.byeads.net)
echo [3] Revert to Windows Default DNS (Automatic DHCP)
echo [4] Exit
echo.
set /p choice="Select an option [1-4]: "

if "%choice%"=="1" goto INSTALL_MAIN
if "%choice%"=="2" goto INSTALL_SECURITY
if "%choice%"=="3" goto UNINSTALL
if "%choice%"=="4" goto EXIT
goto INVALID

:INSTALL_MAIN
echo.
echo [*] Applying BYEADS Anycast Encrypted DNS...
powershell -NoProfile -ExecutionPolicy Bypass -Command "irm https://raw.githubusercontent.com/AzeemS24/BYEADS/main/platforms/windows/setup-windows-doh.ps1 | iex"
goto FINISH

:INSTALL_SECURITY
echo.
echo [*] Applying BYEADS Malware Shield...
powershell -NoProfile -ExecutionPolicy Bypass -Command "& { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $s = irm https://raw.githubusercontent.com/AzeemS24/BYEADS/main/platforms/windows/setup-windows-doh.ps1; Invoke-Expression ($s + ' -DohTemplate https://security.cloudflare-dns.com/dns-query') }"
goto FINISH

:UNINSTALL
echo.
echo [*] Reverting network adapters to Automatic DHCP...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-NetAdapter | Where-Object { $_.Status -eq 'Up' -and -not $_.Virtual } | ForEach-Object { Set-DnsClientServerAddress -InterfaceAlias $_.Name -ResetServerAddresses }; Clear-DnsClientCache; Write-Host '[✓] DNS restored to default.' -ForegroundColor Green"
goto FINISH

:INVALID
echo [!] Invalid selection. Please enter 1, 2, 3, or 4.
pause
goto EXIT

:FINISH
echo.
echo ========================================================
echo   Setup completed successfully!
echo   All Windows apps are now protected via encrypted DoH.
echo ========================================================
echo.
pause

:EXIT
exit /b 0
