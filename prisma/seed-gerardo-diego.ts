import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

function anchor(text: string, needle: string) {
  const anchorStart = text.indexOf(needle);
  if (anchorStart === -1)
    throw new Error(
      `Anchor not found: "${needle}" in text starting "${text.slice(0, 80)}"`
    );
  return { anchorStart, anchorEnd: anchorStart + needle.length };
}

// ─────────────────────────────────────────────────────────────
// TEXTO
// Fuente: Gerardo Diego, Poesía de creación, Seix Barral, 1974, pp. 199-200
// (recogida de Poemas adrede, 1926-1943)
// ─────────────────────────────────────────────────────────────

const diegoText = `Delicada criatura
que entre las rocas floreces
del ayer
no juzgues a desventura
si la luz paga con creces
tu crecer

Bueno es que el sol te interprete
mejor que narre la luna
tu conciencia
si el cierzo no compromete
tu mecer tierno entre cuna
y entre ausencia

Cuando gimen de las olas
a puro volar de espumas
los amores
no es para que en las consolas
se estrellen nácares plumas
y rubores

mas no importa porque el hombre
que del caracol aprende
laberinto
sin que ya nada le asombre
tuerce por tu alma y hiende
su recinto

Es porque te reconocen
y te aman y porque saben
que en tu almohada
por cada surco que gocen
peces irán que te claven
con su espada.

Linda hipótesis de llama
realidad de alta hermosura
mi imposible
pues que la luna que te ama
te limita de locura
indivisible

Puedes al cielo negar
y te es lícita la duda
de mujer
y hasta puedes ignorar
esa flor que se desnuda
de placer

Abrasa mi hilo-memoria
con las chispas que solías
Te lo pido
por más merecer la gloria
de las altas alegrías
de Cupido`;

async function main() {
  console.log("Creando autor Gerardo Diego...");
  const gerardoDiego = await prisma.author.create({
    data: {
      slug: "gerardo-diego",
      name: "Gerardo Diego",
      birthYear: 1896,
      deathYear: 1987,
      era: "Siglo XX",
      country: "España",
      bio: `Poeta y crítico musical santanderino, miembro de la Generación del 27. Su obra transita entre la tradición clásica española —el romance, la décima, la glosa— y las vanguardias europeas del ultraísmo y el creacionismo. Premio Nacional de Literatura (1925) y Premio Cervantes (1979), fue el único poeta del 27 que se quedó en España tras la Guerra Civil sin renunciar a su estética. Su libro *Poemas adrede* (1932) recoge composiciones de 1926 a 1943 que dialogan con los clásicos: la «Glosa a Manrique» es uno de sus ejercicios más delicados de memoria literaria.`,
      portraitUrl: null,
    },
  });

  const poemasAdrede = await prisma.work.create({
    data: {
      slug: "poemas-adrede",
      title: "Poemas adrede",
      year: 1932,
      genre: "Poesía",
      synopsis: `Libro de Gerardo Diego publicado en 1932, que recoge poemas escritos entre 1926 y 1943. Es uno de los libros más singulares del 27: combina el rigor formal de la tradición clásica española —décimas, glosas, romances— con la libertad expresiva de las vanguardias. La «Glosa a Manrique» es un ejercicio de homenaje y actualización: Diego toma un mote del propio Jorge Manrique y lo desarrolla según las reglas del género, adaptando la forma medieval al mundo sensorial de la poesía moderna.`,
      authorId: gerardoDiego.id,
    },
  });

  const fragDiego = await prisma.fragment.create({
    data: {
      slug: "diego-glosa-a-manrique",
      title: "Glosa a Manrique",
      location: "Poemas adrede (1932); Poesía de creación, Seix Barral, 1974, pp. 199-200",
      headline: "Por más merecer la gloria de las altas alegrías de Cupido",
      text: diegoText,
      order: 1,
      status: "published",
      featured: false,
      workId: poemasAdrede.id,
      topics: {
        connect: [
          { slug: "amor-cortes" },
          { slug: "omnia-vincit-amor" },
        ],
      },
      constellations: {
        connect: [
          { slug: "escritura-y-creacion" },
        ],
      },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragDiego.id,
        type: "contexto",
        ...anchor(diegoText, "Delicada criatura"),
        order: 1,
        content: `La «glosa» es una de las formas más elaboradas de la poesía española medieval y renacentista: consiste en tomar unos versos ajenos —el «mote» o «cabeza»— y desarrollarlos en estrofas propias, de modo que el último verso de cada estrofa recoja una línea del mote. Gerardo Diego recupera esta forma culta para rendir homenaje a Manrique desde las coordenadas poéticas de la Generación del 27.`,
      },
      {
        fragmentId: fragDiego.id,
        type: "intertextualidad",
        ...anchor(diegoText, "por más merecer la gloria\nde las altas alegrías\nde Cupido"),
        order: 2,
        content: `El mote —las tres líneas del mote de Manrique que cierran el poema— procede de su poesía amorosa cortesana, no de las *Coplas a la muerte de su padre*. Manrique, además de elegíaco, fue un poeta del amor cortés: este verso celebra el amor («las altas alegrías de Cupido») como la mayor de las glorias humanas. Diego lo convierte en el eje de un poema sensorial y luminoso.`,
        externalCitation: `Jorge Manrique, *Cancionero*: «Por más merescer la gloria / de las altas alegrías / de Cupido». Mote con el que Diego encabeza y cierra su glosa.`,
      },
      {
        fragmentId: fragDiego.id,
        type: "figura",
        ...anchor(diegoText, "Linda hipótesis de llama\nrealidad de alta hermosura\nmi imposible"),
        order: 3,
        content: `**Oxímoron** e **imagen creacionista**: «Linda hipótesis de llama» fusiona el lenguaje científico («hipótesis») con la imagen poética del fuego amoroso. Es el modo de escritura característico del Diego vanguardista: la tradición clásica —el fuego como metáfora de amor— pasa por el filtro del creacionismo, que crea imágenes autónomas, inéditas, que no «imitan» la realidad sino que la inventan.`,
      },
      {
        fragmentId: fragDiego.id,
        type: "contexto",
        ...anchor(diegoText, "Abrasa mi hilo-memoria\ncon las chispas que solías"),
        order: 4,
        content: `El penúltimo dístico introduce el tema de la memoria («hilo-memoria») que conecta con el gran tema manriqueño. Donde Manrique medita sobre el olvido de los muertos, Diego habla de la memoria amorosa: las «chispas» que la amada dejó en el recuerdo del poeta. La glosa hace que el tema de la muerte y el amor cortés —inseparables en Manrique— vuelvan a encontrarse.`,
      },
    ],
  });

  console.log("✓ Gerardo Diego creado.");
  console.log("  → Autor: gerardo-diego");
  console.log("  → Obra: poemas-adrede");
  console.log("  → Fragmento: diego-glosa-a-manrique (4 anotaciones)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
