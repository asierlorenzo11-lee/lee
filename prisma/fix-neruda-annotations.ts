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
    where: { slug: "neruda-oda-manrique" },
    select: { id: true, text: true },
  });

  // Borrar todas las anotaciones actuales (están mal distribuidas y se solapan)
  await prisma.annotation.deleteMany({ where: { fragmentId: f.id } });
  console.log("Anotaciones antiguas borradas.");

  const t = f.text;

  // 5 anclas no solapadas, distribuidas por todo el poema
  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: f.id,
        type: "contexto",
        order: 1,
        ...anchor(t, "el buen caballero\nde la muerte"),
        content: "Neruda escribe la *Oda a don Jorge Manrique* en 1957 para su libro *Tercer libro de las odas*. El poeta chileno imagina que Manrique —el caballero medieval que domesticó poéticamente la muerte— aparece a visitarlo. La imagen del «buen caballero de la muerte» invierte el terror medieval: la muerte ya no es enemiga, sino un visitante casi doméstico que el poeta puede mirar de frente.",
      },
      {
        fragmentId: f.id,
        type: "figura",
        order: 2,
        ...anchor(t, "Era de plata verde\nsu armadura\ny sus ojos\neran\ncomo el agua marina"),
        content: "**Símil cromático** y sinestesia: la armadura es «de plata verde» —combinación imposible y onírica, como el brillo del agua bajo la luna— y los ojos son «como el agua marina». Neruda convierte al caballero medieval en una figura casi vegetal, líquida: el guerrero de Manrique se ha disuelto en la naturaleza que rodea al poeta latinoamericano. El acero se hace agua.",
      },
      {
        fragmentId: f.id,
        type: "glosa",
        order: 3,
        ...anchor(t, "no puedo\noponer sino el aire\na tus estrofas"),
        content: "Neruda confiesa que solo puede responder a los versos de Manrique con «el aire»: con algo intangible, opuesto a «el hierro y la sombra» y los «diamantes oscuros» de las estrofas medievales. Es una declaración de humildad poética: las *Coplas* son duras, talladas en piedra; la poesía de Neruda es eléctrica, cambiante, aérea. No puede imitarlas, solo recibirlas.",
      },
      {
        fragmentId: f.id,
        type: "pregunta",
        order: 4,
        ...anchor(t, "Habla, le dije, caballero\nJorge"),
        content: "El poema convierte a Manrique en un interlocutor vivo: Neruda le da la palabra. ¿Qué significa que un poeta del siglo XX «dialogue» con un poeta muerto hace cinco siglos? ¿Qué dice este gesto sobre la idea de que la literatura crea una comunidad entre los vivos y los muertos?",
      },
      {
        fragmentId: f.id,
        type: "intertextualidad",
        order: 5,
        ...anchor(t, "Y volví a mi deber de pueblo y canto"),
        content: "El cierre del poema muestra la diferencia radical entre Manrique y Neruda: donde el poeta medieval buscaba la *fama* individual —«la vida de la honra»—, Neruda regresa a su «deber de pueblo y canto», una poesía comprometida con lo colectivo. El homenaje es también una despedida: Neruda aprende de Manrique que la vida tiene sentido más allá de la muerte, pero su respuesta es política, no religiosa.",
        externalCitation: `Jorge Manrique, *Coplas* (1476): «y pues vos, claro varón, / tanta sangre derramastes / de la vuestra, / no perdáis tan buen galardón / como en este mundo ganar / meresçistes.»`,
      },
    ],
  });

  console.log("✅ 5 anotaciones limpias creadas (sin solapamientos).");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
