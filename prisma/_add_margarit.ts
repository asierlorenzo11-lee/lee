import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  ...(process.env.TURSO_AUTH_TOKEN ? { authToken: process.env.TURSO_AUTH_TOKEN } : {}),
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Crear autor
  const author = await prisma.author.upsert({
    where: { slug: "joan-margarit" },
    update: {},
    create: {
      slug: "joan-margarit",
      name: "Joan Margarit",
      birthYear: 1938,
      deathYear: 2021,
      country: "España",
      era: "Siglo XX",
      bio: "Poeta catalán y español (Sanaüja, 1938 – Sant Cugat del Vallès, 2021). Arquitecto de formación, escribió en catalán y castellano una poesía de madurez lúcida, anclada en la experiencia vivida y en la memoria histórica. Premio Cervantes 2019, considerado uno de los grandes poetas de la lengua española del siglo XX.",
      portraitUrl: null,
    },
  });
  console.log("Autor:", author.slug);

  // Crear obra
  const work = await prisma.work.upsert({
    where: { slug: "poesia-joan-margarit" },
    update: {},
    create: {
      slug: "poesia-joan-margarit",
      title: "Poesía",
      year: 2019,
      era: "Siglo XX",
      genre: "Poesía",
      synopsis:
        "Poesía reunida de Joan Margarit, poeta del Premio Cervantes 2019, que recorre la memoria personal y colectiva —la transición, la vejez, la libertad— desde una voz desnuda y sin concesiones.",
      authorId: author.id,
    },
  });
  console.log("Obra:", work.slug);

  // Crear fragmento
  const fragment = await prisma.fragment.upsert({
    where: { slug: "la-libertad-margarit" },
    update: {},
    create: {
      slug: "la-libertad-margarit",
      title: "La libertad",
      location: "Poema",
      headline: "La libertad es una librería",
      text: `Es la razón de nuestra vida,
dijimos, estudiantes soñadores.
La razón de los viejos, matizamos ahora,
su única y escéptica esperanza.
La libertad es un extraño viaje.
Son las plazas de toros con las sillas
sobre la arena en las primeras elecciones.
Es el peligro que, de madrugada,
nos acecha en el metro,
son los periódicos al fin de la jornada.
La libertad es hacer el amor en los parques.
Es el alba de un día de huelga general.
Es morir libre. Son las guerras médicas.
Las palabras República y Civil.
Un rey saliendo en tren hacia el exilio.
La libertad es una librería.
Ir indocumentado.
Las canciones prohibidas.
Una forma de amor, la libertad.`,
      order: 1,
      status: "published",
      workId: work.id,
    },
  });
  console.log("Fragmento:", fragment.slug);
}

main().catch(console.error).finally(() => prisma.$disconnect());
