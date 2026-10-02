$sourceRoot = $PSScriptRoot + "\.."
$destZip = "$sourceRoot\public\byeads-source-bundle.zip"
$tempZip = "$env:TEMP\byeads-source-bundle.zip"

if (Test-Path $tempZip) { Remove-Item $tempZip -Force }
if (Test-Path $destZip) { Remove-Item $destZip -Force }

$items = Get-ChildItem -Path $sourceRoot | Where-Object {
    $_.Name -notin @('node_modules', 'dist', '.git', '.tempmediaStorage', 'public')
}

Compress-Archive -Path $items.FullName -DestinationPath $tempZip -CompressionLevel Optimal
Move-Item -Path $tempZip -Destination $destZip -Force
Write-Host "Packaged full source code bundle to public\byeads-source-bundle.zip"
