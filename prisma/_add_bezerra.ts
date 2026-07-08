import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  ...(process.env.TURSO_AUTH_TOKEN ? { authToken: process.env.TURSO_AUTH_TOKEN } : {}),
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const author = await prisma.author.upsert({
    where: { slug: "paco-bezerra" },
    update: {},
    create: {
      slug: "paco-bezerra",
      name: "Paco Bezerra",
      birthYear: 1977,
      deathYear: null,
      country: "España",
      era: "Siglo XX",
      bio: `Dramaturgo español nacido en Fuerteventura (1977). Autor de teatro de vocación política y feminista, su escritura mezcla tradición literaria e ironía contemporánea. «Muero porque no muero» (Centro Dramático Nacional, 2015) resucita a Santa Teresa de Jesús para cuestionar la situación de las escritoras españolas a través de los siglos.`,
      portraitUrl: null,
    },
  });
  console.log("Autor:", author.slug);

  const work = await prisma.work.upsert({
    where: { slug: "muero-porque-no-muero" },
    update: {},
    create: {
      slug: "muero-porque-no-muero",
      title: "Muero porque no muero",
      year: 2015,
      era: "Siglo XX",
      genre: "Teatro",
      synopsis: `Obra teatral que resucita a Santa Teresa de Jesús en el siglo XXI para investigar la situación de las escritoras españolas a lo largo de la historia. El título remite al verso más célebre de la propia Teresa: «muero porque no muero». Estrenada en el Centro Dramático Nacional en 2015.`,
      authorId: author.id,
    },
  });
  console.log("Obra:", work.slug);

  const fragment = await prisma.fragment.upsert({
    where: { slug: "bezerra-teresa-escribir-en-espana" },
    update: {},
    create: {
      slug: "bezerra-teresa-escribir-en-espana",
      title: "Teresa en el siglo XXI",
      location: "Escena central",
      headline: "Escribir en España no es llorar, es morir",
      text: `Me pongo a investigar acerca de la situación de los autores en España y descubro lo siguiente: Solo un cinco por ciento de las escritoras españolas consigue vivir de la literatura. Pero lo más escandaloso no es eso, lo más escandaloso es que descubro que nunca antes la cifra había sido tan favorable: y que, en toda la historia de este país, es la primera vez que un número tan elevado de mujeres consigue vivir de las letras.

¿Cuánto ha evolucionado la calidad de vida de las escritoras españolas desde que llevo muerta? La respuesta es abrumadora: un uno por ciento por cada siglo. Y ahí es cuando recuerdo una frase que había leído recientemente, de un escritor de apellido Larra: «Escribir en España es llorar». A lo que otro escritor de apellido Cernuda añadiría años después: «Escribir en España no es llorar, escribir en España es morir».

Y pienso: «Teresa, toda superheroína necesita un traje en el que enfundarse, y tú ya conseguiste el tuyo; ahora solo te falta una misión, que bien podría ser esta que se te acaba de presentar». Salgo disparada a El Corte Inglés y robo un bote de espray para, a continuación, dirigirme hasta el órgano constitucional que representa a todos los españoles: el Congreso de los Diputados. Espray en mano, pinto en la fachada: «Escribir en España no es llorar, escribir en España es morir». Firmado: «Larra y Cernuda».

Acto seguido, me subo a lomos de uno de los leones que custodian la entrada del Congreso y comienzo a gritar, uno por uno, los nombres y apellidos de todas y cada una de las autoras olvidadas de este país: Ana Caro, María de Zayas, Juliana Morell, Marcela del Carpio, María Rosa de Gálvez, Gertrudis Gómez de Avellaneda, Carolina Coronado...`,
      order: 1,
      status: "published",
      workId: work.id,
    },
  });
  console.log("Fragmento:", fragment.slug);
}

main().catch(console.error).finally(() => prisma.$disconnect());
