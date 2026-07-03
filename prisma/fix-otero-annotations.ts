import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

function anchor(text: string, needle: string) {
  const i = text.indexOf(needle);
  if (i === -1) throw new Error(`Anchor not found: "${needle}"`);
  return { anchorStart: i, anchorEnd: i + needle.length };
}

async function main() {
  const f = await prisma.fragment.findUniqueOrThrow({
    where: { slug: "otero-tumulo-de-gasoil" },
    select: { id: true, text: true },
  });

  await prisma.annotation.deleteMany({ where: { fragmentId: f.id } });
  console.log("Anotaciones antiguas borradas.");

  const t = f.text;

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: f.id,
        type: "intertextualidad",
        order: 1,
        ...anchor(t, "Hojas sueltas, decidme, qué se hicieron\nlos Infantes de Aragón"),
        content: "Otero abre el poema citando casi literalmente las *Coplas* de Manrique: «¿Qué se fizo el rey don Johan? / Los Infantes de Aragón, ¿qué se ficieron?». Pero inserta a **Manuel Granero** (torero muerto en el ruedo en 1922) junto a los nobles medievales, y añade la «pavana para una infanta» (Ravel, 1899). El *ubi sunt* medieval —¿adónde fueron los grandes?— se convierte en elegía urbana y popular: los muertos de Otero no son caballeros, son la España de principios del siglo XX.",
        externalCitation: `Jorge Manrique, *Coplas* (1476): «¿Qué se fizo el rey don Johan? / Los Infantes de Aragón, / ¿qué se ficieron? / ¿Qué fue de tanto galán, / qué de tanta invinción / que truxeron?»`,
      },
      {
        fragmentId: f.id,
        type: "figura",
        order: 2,
        ...anchor(t, "hojas sueltas, caídas\ncomo cristo contra el empedrado"),
        content: "**Símil blasfemo y político**: las hojas sueltas —metáfora de las vidas humanas, tomada de Manrique («nuestras vidas son los ríos»)— caen «como Cristo contra el empedrado». El golpe de Cristo contra el suelo es la imagen de la muerte violenta, la de los fusilados y represaliados del franquismo que Otero no puede nombrar directamente. El ángulo sagrado convierte la crítica política en lamento universal.",
      },
      {
        fragmentId: f.id,
        type: "glosa",
        order: 3,
        ...anchor(t, "microsurco"),
        content: "El **microsurco** es el disco de vinilo de larga duración (LP), inventado en 1948. Otero acumula objetos de la cultura de masas de los años 60 —el microsurco, las sandalias de purpurina, los senos de Honolulú (imagen exótica de los anuncios)— para mostrar que la España franquista ha pasado del ascetismo religioso al consumismo de importación sin resolver ninguno de sus problemas históricos.",
      },
      {
        fragmentId: f.id,
        type: "pregunta",
        order: 4,
        ...anchor(t, "quién empezó eso de cesar, pasar, morir"),
        content: "Otero imita la pregunta retórica del *ubi sunt* manriqueño, pero ya no la dirige a Dios ni a la Providencia: la lanza al vacío, sin destinatario. ¿A quién le pregunta Otero quién «inventó» la muerte? ¿Qué diferencia hay entre la aceptación cristiana de la muerte en Manrique y la protesta secular de Otero?",
      },
      {
        fragmentId: f.id,
        type: "contexto",
        order: 5,
        ...anchor(t, "ciudad donde Jorge Manrique acabaría por jodernos a todos"),
        content: "El poema pertenece al libro *Hojas de Madrid con La galerna* (1970), escrito durante el franquismo pero publicado póstumamente. Otero vive en el Madrid que nombra: Mesonero Romanos, Lope de Vega, Galdós, Quevedo son sus vecinos literarios. La aparición de Jorge Manrique en este catálogo urbano es irónica y afectuosa a la vez: el poeta medieval sobrevive entre el gasoil y los yanquis, pero su peso moral —«las graves estrofas que nos quiebran los huesos»— sigue siendo aplastante, incómodo, imposible de sacudir.",
      },
    ],
  });

  console.log("✅ 5 anotaciones limpias creadas para otero-tumulo-de-gasoil.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
