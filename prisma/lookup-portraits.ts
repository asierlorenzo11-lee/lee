const UA = "LEE-app/1.0 (educational project; contact asierlorenzo11@gmail.com)";
async function search(q: string) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent("File:" + q)}&srnamespace=6&srlimit=3&format=json&formatversion=2`;
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  const d = await r.json() as any;
  console.log(`\n[${q}]`);
  (d?.query?.search ?? []).forEach((x: any) => console.log(`  ${x.title}`));
  await new Promise(r => setTimeout(r, 200));
}
async function main() {
  await search("Amadis de Gaula woodcut illustration");
  await search("Amadis de Gaula 1533 miniature");
  await search("Cancionero Baena miniatura medieval");
  await search("Cancionero medieval trovador iluminado");
  await search("Alfonso X retrato miniatura Cantigas");
}
main().catch(console.error);
