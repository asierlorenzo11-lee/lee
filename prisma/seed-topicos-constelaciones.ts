import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function connectTopic(topicId: string, slugs: string[]) {
  for (const slug of slugs) {
    await prisma.fragment.update({
      where: { slug },
      data: { topics: { connect: { id: topicId } } },
    });
  }
}

async function connectConstellation(constellationId: string, slugs: string[]) {
  for (const slug of slugs) {
    await prisma.fragment.update({
      where: { slug },
      data: { constellations: { connect: { id: constellationId } } },
    });
  }
}

async function main() {
  // ──────────────────────────────────────────────────────────────
  // TÓPICOS NUEVOS
  // ──────────────────────────────────────────────────────────────
  console.log("Creando tópico Fortuna mutabilis...");
  const fortuna = await prisma.topic.create({
    data: {
      slug: "fortuna-mutabilis",
      name: "Fortuna mutabilis",
      description: `La rueda de la Fortuna: la idea, de raíz clásica y muy desarrollada en la Edad Media, de que el destino humano sube y baja sin aviso ni mérito, encumbrando y derribando a los hombres según un capricho que escapa a su control. Tópico central del teatro romántico español, donde el «sino» o el «destino» sustituyen a la providencia.`,
    },
  });
  await connectTopic(fortuna.id, [
    "misero-leno-soneto",
    "don-alvaro-soldado-de-fortuna",
    "don-alvaro-gran-monólogo",
    "don-alvaro-precipicio-final",
    "destierro-del-cid",
  ]);

  console.log("Creando tópico Theatrum mundi...");
  const theatrum = await prisma.topic.create({
    data: {
      slug: "theatrum-mundi",
      name: "Theatrum mundi",
      description: `«El mundo es un teatro»: tópico barroco que concibe la vida humana como una representación —un sueño, una comedia— de la que la muerte es el único desenlace cierto. En España alcanza su formulación más célebre en «La vida es sueño» de Calderón.`,
    },
  });
  await connectTopic(theatrum.id, [
    "los-suenos-suenos-son",
    "fue-sueno-ayer-manana-sera-tierra",
  ]);

  console.log("Creando tópico Omnia vincit amor...");
  const omniaVincit = await prisma.topic.create({
    data: {
      slug: "omnia-vincit-amor",
      name: "Omnia vincit amor",
      description: `Del latín «el amor todo lo vence» (Virgilio, Églogas X). Tópico que afirma la victoria del amor incluso sobre la muerte: el cuerpo puede deshacerse en polvo o ceniza, pero el sentimiento amoroso —o, en su versión mística, la unión con Dios— permanece o se intensifica más allá del límite de la vida.`,
    },
  });
  await connectTopic(omniaVincit.id, [
    "amor-constante-mas-alla-de-la-muerte",
    "vivo-sin-vivir-en-mi",
    "vivo-sin-vivir-en-mi-villancico-completo",
  ]);

  console.log("✓ 3 tópicos nuevos creados y conectados.");

  // ──────────────────────────────────────────────────────────────
  // CONSTELACIONES NUEVAS
  // ──────────────────────────────────────────────────────────────
  console.log("Creando constelación Libertad...");
  const libertad = await prisma.constellation.create({
    data: { slug: "libertad", name: "Libertad" },
  });
  await connectConstellation(libertad.id, [
    "discurso-de-la-libertad",
    "discurso-de-marcela",
    "cancion-del-pirata",
    "soneto-antiesclavista",
  ]);

  console.log("Creando constelación Voz femenina...");
  const vozFemenina = await prisma.constellation.create({
    data: { slug: "voz-femenina", name: "Voz femenina" },
  });
  await connectConstellation(vozFemenina.id, [
    "las-literatas-carta-a-eduarda",
    "donde-se-hallara-un-hombre-verdadero",
    "mi-agravio-mudo-mi-ser",
    "hombres-necios-que-acusais",
    "discurso-de-marcela",
  ]);

  console.log("Creando constelación Escritura y creación...");
  const escritura = await prisma.constellation.create({
    data: { slug: "escritura-y-creacion", name: "Escritura y creación" },
  });
  await connectConstellation(escritura.id, [
    "quema-de-la-biblioteca",
    "los-eruditos-a-la-violeta-leccion",
    "carta-xxxv-cadalso",
    "la-comedia-nueva-disparates",
    "prologo-honra-cria-las-artes",
    "las-literatas-carta-a-eduarda",
  ]);

  console.log("✓ 3 constelaciones nuevas creadas y conectadas.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
