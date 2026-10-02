# ===== PACKAGE EXTENSIONS SCRIPT =====
# Packages apps/extension-chromium and apps/extension-firefox into public ZIP archives

$sourceRoot = $PSScriptRoot + "\.."
$chromiumDir = "$sourceRoot\apps\extension-chromium"
$firefoxDir = "$sourceRoot\apps\extension-firefox"
$publicDir = "$sourceRoot\public"

$chromiumZip = "$publicDir\byeads-extension-chromium.zip"
$firefoxZip = "$publicDir\byeads-extension-firefox.zip"

if (Test-Path $chromiumZip) { Remove-Item $chromiumZip -Force }
if (Test-Path $firefoxZip) { Remove-Item $firefoxZip -Force }

Compress-Archive -Path "$chromiumDir\*" -DestinationPath $chromiumZip -CompressionLevel Optimal
Write-Host "Created $chromiumZip"

Compress-Archive -Path "$firefoxDir\*" -DestinationPath $firefoxZip -CompressionLevel Optimal
Write-Host "Created $firefoxZip"
