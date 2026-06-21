Set-Location C:\Users\user\LEE
$artDir = "public\images\artworks"
$ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"

# Solo las que faltan en disco (thumb URLs ya verificadas)
$images = @(
  [pscustomobject]@{local="vermeer-woman-blue-reading-letter.jpg"; url="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Johannes_Vermeer_-_Woman_in_Blue_Reading_a_Letter_-_WGA24657.jpg/1280px-Johannes_Vermeer_-_Woman_in_Blue_Reading_a_Letter_-_WGA24657.jpg"},
  [pscustomobject]@{local="ruisdael-three-great-trees.jpg";        url="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Jacob_van_Ruisdael_-_Three_Great_Trees_in_a_Mountainous_Landscape_with_a_River.png/800px-Jacob_van_Ruisdael_-_Three_Great_Trees_in_a_Mountainous_Landscape_with_a_River.png"},
  [pscustomobject]@{local="jan-steen-merry-family.jpg";            url="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Jan_Steen_005.jpg/1280px-Jan_Steen_005.jpg"},
  [pscustomobject]@{local="rubens-chapeau-de-paille.jpg";          url="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Le_Chapeau_de_Paille_by_Peter_Paul_Rubens.jpg/1280px-Le_Chapeau_de_Paille_by_Peter_Paul_Rubens.jpg"},
  [pscustomobject]@{local="waterhouse-hylas-nymphs.jpg";           url="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Waterhouse_Hylas_and_the_Nymphs_Manchester_Art_Gallery_1896.15.jpg/1280px-Waterhouse_Hylas_and_the_Nymphs_Manchester_Art_Gallery_1896.15.jpg"},
  [pscustomobject]@{local="pollaiolo-apollo-daphne.jpg";           url="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Antonio_del_Pollaiolo_-_Apollo_and_Daphne_-_WGA18028.jpg/640px-Antonio_del_Pollaiolo_-_Apollo_and_Daphne_-_WGA18028.jpg"},
  [pscustomobject]@{local="pieter-claesz-vanitas.jpg";             url="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Pieter_Claesz_-_Vanitas_Still_Life_-_943_-_Mauritshuis.jpg/1280px-Pieter_Claesz_-_Vanitas_Still_Life_-_943_-_Mauritshuis.jpg"},
  [pscustomobject]@{local="david-bailly-vanitas.jpg";              url="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/David_Bailly_Vanitas1651.jpg/640px-David_Bailly_Vanitas1651.jpg"},
  [pscustomobject]@{local="hubert-robert-grand-galerie.jpg";       url="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Hubert_Robert_-_Die_Grand_Galerie_des_Louvre.jpg/1280px-Hubert_Robert_-_Die_Grand_Galerie_des_Louvre.jpg"},
  [pscustomobject]@{local="bruegel-misanthrope.jpg";               url="https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Pieter_Bruegel_the_Elder_-_The_Misanthrope_-_WGA3521.jpg/640px-Pieter_Bruegel_the_Elder_-_The_Misanthrope_-_WGA3521.jpg"},
  [pscustomobject]@{local="piranesi-round-tower.jpg";              url="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/The_Round_Tower%2C_from_%27Carceri_d%27invenzione%27_%28Imaginary_Prisons%29_MET_DP828191.jpg/1280px-The_Round_Tower%2C_from_%27Carceri_d%27invenzione%27_%28Imaginary_Prisons%29_MET_DP828191.jpg"},
  [pscustomobject]@{local="vermeer-lady-writing-letter-maid.jpg";  url="https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Johannes_Vermeer_-_Lady_Writing_a_Letter_with_Her_Maid_-_WGA24696.jpg/640px-Johannes_Vermeer_-_Lady_Writing_a_Letter_with_Her_Maid_-_WGA24696.jpg"},
  [pscustomobject]@{local="murillo-joven-mendigo.jpg";             url="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Bartolom%C3%A9_Esteban_Murillo_-_Joven_mendigo_%281645-50%29.jpg/1280px-Bartolom%C3%A9_Esteban_Murillo_-_Joven_mendigo_%281645-50%29.jpg"},
  [pscustomobject]@{local="raffael-triumph-galatea.jpg";           url="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Raffael_012.jpg/1280px-Raffael_012.jpg"}
)

$ok = 0; $fail = 0

foreach ($img in $images) {
  $dest = Join-Path $artDir $img.local
  if (Test-Path $dest) {
    $sz = (Get-Item $dest).Length
    if ($sz -gt 10000) { Write-Host "skip: $($img.local)"; continue }
    Remove-Item $dest -Force
  }

  Write-Host "dl $($img.local)"
  try {
    Invoke-WebRequest -Uri $img.url -OutFile $dest -UseBasicParsing -UserAgent $ua -ErrorAction Stop
    $size = (Get-Item $dest).Length
    Write-Host "  OK $('{0:N0}' -f $size) bytes"
    $ok++
  } catch {
    Write-Host "  ERR $($_.Exception.Message.Substring(0, [math]::Min(80, $_.Exception.Message.Length)))"
    if (Test-Path $dest) { Remove-Item $dest -Force }
    $fail++
  }
  Start-Sleep -Seconds 10
}

Write-Host "Resultado: $ok OK, $fail fallos"
