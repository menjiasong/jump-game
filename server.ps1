$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8080/")
$listener.Start()
Write-Output "Server running at http://localhost:8080/"
Write-Output "Press Ctrl+C to stop"

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".js"   = "application/javascript"
    ".css"  = "text/css"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".wasm" = "application/wasm"
}

$root = "d:\w\jump-game"

while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $resp = $ctx.Response

    $path = $req.Url.LocalPath
    if ($path -eq "/") { $path = "/index.html" }

    $filePath = Join-Path $root $path.TrimStart("/")

    if (Test-Path $filePath -PathType Leaf) {
        $ext = [IO.Path]::GetExtension($filePath)
        $mime = $mimeTypes[$ext]
        if (-not $mime) { $mime = "application/octet-stream" }
        $resp.ContentType = $mime
        $bytes = [IO.File]::ReadAllBytes($filePath)
        $resp.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $resp.StatusCode = 404
        $msg = [Text.Encoding]::UTF8.GetBytes("404 Not Found")
        $resp.OutputStream.Write($msg, 0, $msg.Length)
    }
    $resp.Close()
}
