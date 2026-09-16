$b64 = Get-Content -Raw -Path "d:\SIH\SCHOLARSHIP\FRONTEND\src\pages\official\verifier_code.b64"
$bytes = [System.Convert]::FromBase64String($b64)
[System.IO.File]::WriteAllBytes("d:\SIH\SCHOLARSHIP\FRONTEND\src\pages\official\VerifierDashboard.jsx", $bytes)
Remove-Item "d:\SIH\SCHOLARSHIP\FRONTEND\src\pages\official\verifier_code.b64"
