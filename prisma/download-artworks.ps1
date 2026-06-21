Set-Location "C:\Users\user\LEE"
$artDir = "public\images\artworks"
$headers = @{ "User-Agent" = "LEE-Educational/1.0" }

$images = @(
  @{ file = "alhambra-patio-leones.jpg"; url = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Alhambra_p3.jpg/640px-Alhambra_p3.jpg" },
  @{ file = "mezquita-cordoba-arcos.jpg"; url = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Mezquita_de_C%C3%B3rdoba_%28Espa%C3%B1a%29_02.jpg/640px-Mezquita_de_C%C3%B3rdoba_%28Espa%C3%B1a%29_02.jpg" },
  @{ file = "mar-galicia-ondas.jpg"; url = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Aivazovsky_-_The_Black_Sea.jpg/640px-Aivazovsky_-_The_Black_Sea.jpg" },
  @{ file = "libro-de-horas-alba.jpg"; url = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Les_Tres_Riches_Heures_du_duc_de_Berry_janvier.jpg/640px-Les_Tres_Riches_Heures_du_duc_de_Berry_janvier.jpg" },
  @{ file = "murallas-de-avila.jpg"; url = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Avila-murallas.jpg/640px-Avila-murallas.jpg" },
  @{ file = "olivar-andalucia.jpg"; url = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Olive_field_in_Jaen_Spain.jpg/640px-Olive_field_in_Jaen_Spain.jpg" },
  @{ file = "alfonso-x-scriptorium.jpg"; url = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Alfonso_X_el_Sabio_-_Cantigas_de_Santa_Mar%C3%ADa_%28c.1280%2C_El_Escorial%29.jpg/440px-Alfonso_X_el_Sabio_-_Cantigas_de_Santa_Mar%C3%ADa_%28c.1280%2C_El_Escorial%29.jpg" },
  @{ file = "lapidario-miniatura.jpg"; url = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Codex_Manesse_Heinrich_von_Breslau.jpg/640px-Codex_Manesse_Heinrich_von_Breslau.jpg" },
  @{ file = "uccello-san-jorge-dragon.jpg"; url = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Paolo_Uccello_042.jpg/640px-Paolo_Uccello_042.jpg" },
  @{ file = "golondrina-cielo.jpg"; url = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Barn_swallow_kobayashi.jpg/640px-Barn_swallow_kobayashi.jpg" },
  @{ file = "mujer-mercado-aertsen.jpg"; url = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Pieter_Aertsen_-_The_Cook.jpg/640px-Pieter_Aertsen_-_The_Cook.jpg" },
  @{ file = "caza-perdices-medieval.jpg"; url = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Gaston_Phebus_Livre_de_chasse_bird_hunting.jpg/640px-Gaston_Phebus_Livre_de_chasse_bird_hunting.jpg" }
)

$ok = 0; $fail = 0
foreach ($img in $images) {
  $dest = Join-Path $artDir $img.file
  if (Test-Path $dest) {
    Write-Host "  (ya existe) $($img.file)"
    $ok++
    continue
  }
  try {
    Invoke-WebRequest -Uri $img.url -OutFile $dest -Headers $headers -TimeoutSec 20
    $sz = (Get-Item $dest).Length
    if ($sz -lt 5000) {
      Remove-Item $dest -ErrorAction SilentlyContinue
      Write-Host "  [too small] $($img.file) ($sz bytes)"
      $fail++
    } else {
      Write-Host "  OK $($img.file) ($([int]($sz/1024)) KB)"
      $ok++
    }
  } catch {
    Write-Host "  FAIL $($img.file)"
    $fail++
  }
}
Write-Host "OK: $ok  FAIL: $fail"
