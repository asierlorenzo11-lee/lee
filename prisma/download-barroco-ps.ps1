Set-Location C:\Users\user\LEE

$artDir = "public\images\artworks"
if (-not (Test-Path $artDir)) { New-Item -ItemType Directory -Force $artDir | Out-Null }

$images = @(
  [pscustomobject]@{slug="ir-y-quedarse-soneto-ausencia"; url="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Johannes_Vermeer_-_Woman_in_Blue_Reading_a_Letter_-_WGA24657.jpg/1280px-Johannes_Vermeer_-_Woman_in_Blue_Reading_a_Letter_-_WGA24657.jpg"; local="vermeer-woman-blue-reading-letter.jpg"},
  [pscustomobject]@{slug="estos-los-sauces-son"; url="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Jacob_van_Ruisdael_-_Three_Great_Trees_in_a_Mountainous_Landscape_with_a_River.png/800px-Jacob_van_Ruisdael_-_Three_Great_Trees_in_a_Mountainous_Landscape_with_a_River.png"; local="ruisdael-three-great-trees.jpg"},
  [pscustomobject]@{slug="muerome-por-llamar-juanilla"; url="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Jan_Steen_005.jpg/1280px-Jan_Steen_005.jpg"; local="jan-steen-merry-family.jpg"},
  [pscustomobject]@{slug="de-pura-honestidad-templo-sagrado"; url="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Le_Chapeau_de_Paille_by_Peter_Paul_Rubens.jpg/1280px-Le_Chapeau_de_Paille_by_Peter_Paul_Rubens.jpg"; local="rubens-chapeau-de-paille.jpg"},
  [pscustomobject]@{slug="la-dulce-boca-que-a-gustar-convida"; url="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Waterhouse_Hylas_and_the_Nymphs_Manchester_Art_Gallery_1896.15.jpg/1280px-Waterhouse_Hylas_and_the_Nymphs_Manchester_Art_Gallery_1896.15.jpg"; local="waterhouse-hylas-nymphs.jpg"},
  [pscustomobject]@{slug="bermejazo-platero-de-las-cumbres"; url="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Antonio_del_Pollaiolo_-_Apollo_and_Daphne_-_WGA18028.jpg/640px-Antonio_del_Pollaiolo_-_Apollo_and_Daphne_-_WGA18028.jpg"; local="pollaiolo-apollo-daphne.jpg"},
  [pscustomobject]@{slug="fue-sueno-ayer-manana-sera-tierra"; url="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Pieter_Claesz_-_Vanitas_Still_Life_-_943_-_Mauritshuis.jpg/1280px-Pieter_Claesz_-_Vanitas_Still_Life_-_943_-_Mauritshuis.jpg"; local="pieter-claesz-vanitas.jpg"},
  [pscustomobject]@{slug="ah-de-la-vida-nadie-me-responde"; url="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/David_Bailly_Vanitas1651.jpg/640px-David_Bailly_Vanitas1651.jpg"; local="david-bailly-vanitas.jpg"},
  [pscustomobject]@{slug="mire-los-muros-de-la-patria-mia"; url="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Hubert_Robert_-_Die_Grand_Galerie_des_Louvre.jpg/1280px-Hubert_Robert_-_Die_Grand_Galerie_des_Louvre.jpg"; local="hubert-robert-grand-galerie.jpg"},
  [pscustomobject]@{slug="es-hielo-abrasador-es-fuego-helado"; url="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Angelo_Bronzino_-_Venus%2C_Cupid%2C_Folly_and_Time_-_National_Gallery%2C_London.jpg/1280px-Angelo_Bronzino_-_Venus%2C_Cupid%2C_Folly_and_Time_-_National_Gallery%2C_London.jpg"; local="bronzino-venus-cupid-folly-time.jpg"},
  [pscustomobject]@{slug="la-vida-empieza-entre-lagrimas-y-caca"; url="https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Pieter_Bruegel_the_Elder_-_The_Misanthrope_-_WGA3521.jpg/640px-Pieter_Bruegel_the_Elder_-_The_Misanthrope_-_WGA3521.jpg"; local="bruegel-misanthrope.jpg"},
  [pscustomobject]@{slug="ay-misero-de-mi-monologotorre"; url="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/The_Round_Tower%2C_from_%27Carceri_d%27invenzione%27_%28Imaginary_Prisons%29_MET_DP828191.jpg/1280px-The_Round_Tower%2C_from_%27Carceri_d%27invenzione%27_%28Imaginary_Prisons%29_MET_DP828191.jpg"; local="piranesi-round-tower.jpg"},
  [pscustomobject]@{slug="donde-se-hallara-un-hombre-verdadero"; url="https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Johannes_Vermeer_-_Lady_Writing_a_Letter_with_Her_Maid_-_WGA24696.jpg/640px-Johannes_Vermeer_-_Lady_Writing_a_Letter_with_Her_Maid_-_WGA24696.jpg"; local="vermeer-lady-writing-letter-maid.jpg"},
  [pscustomobject]@{slug="casilda-mientras-no-puedas"; url="https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Pieter_Bruegel_the_Elder_-_Peasant_Wedding_-_Google_Art_Project.jpg/1280px-Pieter_Bruegel_the_Elder_-_Peasant_Wedding_-_Google_Art_Project.jpg"; local="bruegel-peasant-wedding.jpg"},
  [pscustomobject]@{slug="yo-soy-un-hombre-villana-casta"; url="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Velazquez-The_Surrender_of_Breda.jpg/1280px-Velazquez-The_Surrender_of_Breda.jpg"; local="velazquez-surrender-breda.jpg"},
  [pscustomobject]@{slug="yo-senor-soy-de-segovia"; url="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Bartolom%C3%A9_Esteban_Murillo_-_Joven_mendigo_%281645-50%29.jpg/1280px-Bartolom%C3%A9_Esteban_Murillo_-_Joven_mendigo_%281645-50%29.jpg"; local="murillo-joven-mendigo.jpg"},
  [pscustomobject]@{slug="purpureas-rosas-sobre-galatea"; url="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Raffael_012.jpg/1280px-Raffael_012.jpg"; local="raffael-triumph-galatea.jpg"},
  [pscustomobject]@{slug="era-del-anno-la-estacion-florida"; url="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Botticelli-primavera.jpg/1280px-Botticelli-primavera.jpg"; local="botticelli-primavera.jpg"}
)

$ok = 0; $fail = 0
$ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"

foreach ($img in $images) {
  $dest = Join-Path $artDir $img.local
  if (Test-Path $dest) {
    $sz = (Get-Item $dest).Length
    if ($sz -gt 10000) { Write-Host "  skip: $($img.local) ($([math]::Round($sz/1KB,0)) KB)"; continue }
    Remove-Item $dest -Force
  }

  Write-Host "  dl $($img.slug)"
  try {
    Invoke-WebRequest -Uri $img.url -OutFile $dest -UseBasicParsing -UserAgent $ua -ErrorAction Stop
    $size = (Get-Item $dest).Length
    Write-Host "    OK $($img.local) ($([math]::Round($size/1KB,0)) KB)"
    $ok++
  } catch {
    Write-Host "    ERR $($_.Exception.Message)"
    if (Test-Path $dest) { Remove-Item $dest -Force }
    $fail++
  }
  Start-Sleep -Seconds 3
}

Write-Host "`nResultado: $ok OK, $fail fallos"
Get-ChildItem $artDir -File | Sort-Object Name | Select-Object Name, @{N="KB";E={[math]::Round($_.Length/1KB,0)}} | Format-Table -AutoSize
