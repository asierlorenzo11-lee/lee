const UA = "LEE-app/1.0 (educational project; contact asierlorenzo11@gmail.com)";
async function search(q: string) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent("File:" + q)}&srnamespace=6&srlimit=4&format=json&formatversion=2`;
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  const d = await r.json() as any;
  console.log(`\n[${q}]`);
  (d?.query?.search ?? []).forEach((x: any) => console.log(`  ${x.title}`));
  await new Promise(r => setTimeout(r, 200));
}
async function getThumb(title: string) {
  const encoded = encodeURIComponent("File:" + title);
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encoded}&prop=imageinfo&iiprop=url|thumburl&iiurlwidth=640&format=json&formatversion=2`;
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  const d = await r.json() as any;
  const page = d?.query?.pages?.[0];
  return page?.missing ? "MISSING" : (page?.imageinfo?.[0]?.thumburl ?? "NO_THUMB");
}
async function main() {
  await search("Alfonso X el Sabio retrato miniatura");
  await search("Alfonso X Sabio portrait king medieval");
  // Also test Amadis and Cancionero URLs
  const a = await getThumb("Cancionero general.jpg");
  console.log("\nCancionero general URL:", a);
}
main().catch(console.error);
