const UA = "LEE-app/1.0 (educational project; contact asierlorenzo11@gmail.com)";
async function getThumb(title: string) {
  const encoded = encodeURIComponent("File:" + title);
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encoded}&prop=imageinfo&iiprop=url|thumburl&iiurlwidth=640&format=json&formatversion=2`;
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  const d = await r.json() as any;
  const page = d?.query?.pages?.[0];
  if (page?.missing) return null;
  return page?.imageinfo?.[0]?.thumburl ?? null;
}
async function search(q: string) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent("File:" + q)}&srnamespace=6&srlimit=4&format=json&formatversion=2`;
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  const d = await r.json() as any;
  console.log(`\n[${q}]`);
  (d?.query?.search ?? []).forEach((x: any) => console.log(`  ${x.title}`));
  await new Promise(r => setTimeout(r, 200));
}
async function main() {
  // Check if Amadis 1508 exists
  const amadis = await getThumb("Amadís de Gaula (Zaragoza, 1508).jpg");
  console.log("Amadis URL:", amadis);
  await new Promise(r => setTimeout(r, 200));
  // Search for more options
  await search("Cancionero General 1511");
  await search("medieval troubadour miniature illuminated");
  await search("Codex Manesse minnesingers singing");
  await search("minnesinger lyric medieval poem");
}
main().catch(console.error);
