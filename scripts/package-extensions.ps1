# ===== PACKAGE EXTENSIONS SCRIPT =====
# Packages apps/extension-chromium, apps/extension-firefox, and apps/extension-safari into public ZIP archives

$sourceRoot = $PSScriptRoot + "\.."
$chromiumDir = "$sourceRoot\apps\extension-chromium"
$firefoxDir = "$sourceRoot\apps\extension-firefox"
$safariDir = "$sourceRoot\apps\extension-safari"
$publicDir = "$sourceRoot\public"

$chromiumZip = "$publicDir\byeads-extension-chromium.zip"
$firefoxZip = "$publicDir\byeads-extension-firefox.zip"
$safariZip = "$publicDir\byeads-extension-safari.zip"

if (Test-Path $chromiumZip) { Remove-Item $chromiumZip -Force }
if (Test-Path $firefoxZip) { Remove-Item $firefoxZip -Force }
if (Test-Path $safariZip) { Remove-Item $safariZip -Force }

Compress-Archive -Path "$chromiumDir\*" -DestinationPath $chromiumZip -CompressionLevel Optimal
Write-Host "Created $chromiumZip"

Compress-Archive -Path "$firefoxDir\*" -DestinationPath $firefoxZip -CompressionLevel Optimal
Write-Host "Created $firefoxZip"

Compress-Archive -Path "$safariDir\*" -DestinationPath $safariZip -CompressionLevel Optimal
Write-Host "Created $safariZip"
