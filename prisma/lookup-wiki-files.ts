/** Look up Wikimedia file IDs to find correct titles */
const UA = "LEE-app/1.0 (educational project; contact asierlorenzo11@gmail.com)";

async function searchFile(query: string): Promise<void> {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent("File:" + query)}&srnamespace=6&srlimit=3&format=json&formatversion=2`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  const data = await res.json() as any;
  const results = data?.query?.search ?? [];
  console.log(`\n[${query}]`);
  for (const r of results) {
    console.log(`  "${r.title}"`);
  }
}

async function main() {
  const searches = [
    "Alhambra Court Lions",
    "Mezquita Cordoba arcos",
    "Pergamino Vindel Codax",
    "Tres riches heures",
    "Avila murallas",
    "Olive field Jaen",
    "Alfonso X Cantigas",
    "Kalila Dimna scholars",
    "Barn swallow Hirundo",
    "Pieter Aertsen cook",
    "Gaston Febus chasse perdrix",
    "Murillo boys dice",
  ];
  for (const q of searches) {
    await searchFile(q);
    await new Promise(r => setTimeout(r, 200));
  }
}
main().catch(console.error);
