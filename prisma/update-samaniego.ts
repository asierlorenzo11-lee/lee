import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

function anchor(
  text: string,
  needle: string,
): { anchorStart: number | null; anchorEnd: number | null } {
  const anchorStart = text.indexOf(needle);
  if (anchorStart === -1) {
    console.warn(`  ⚠ ancla no encontrada: «${needle.substring(0, 50)}»`);
    return { anchorStart: null, anchorEnd: null };
  }
  return { anchorStart, anchorEnd: anchorStart + needle.length };
}

async function main() {
  const frag = await prisma.fragment.findFirstOrThrow({
    where: { slug: "la-vieja-y-el-gato" },
  });
  const text = frag.text;
  console.log(`Fragmento: ${frag.slug} (id ${frag.id})`);

  // Borrar todas las anotaciones existentes
  const deleted = await prisma.annotation.deleteMany({ where: { fragmentId: frag.id } });
  console.log(`  Eliminadas ${deleted.count} anotaciones antiguas.`);

  // Crear nuevas anotaciones
  await prisma.annotation.createMany({
    data: [
      // ── Glosas ────────────────────────────────────────────────────────────
      {
        fragmentId: frag.id,
        type: "glosa",
        ...anchor(text, "en cuclillas"),
        order: 1,
        content: `«En cuclillas»: en posición baja, con las rodillas dobladas y el peso sobre los talones. La imagen es deliberadamente prosaica y doméstica: la vieja no está en ningún lugar romántico, sino acuclillada junto a la lumbre, en camisa, calentándose antes de acostarse.`,
      },
      {
        fragmentId: frag.id,
        type: "glosa",
        ...anchor(text, "a la lumbre"),
        order: 2,
        content: `«Lumbre»: fuego vivo, llama del hogar. En el siglo XVIII, calentarse junto a la lumbre antes de acostarse era la rutina habitual en las casas sin calefacción. El detalle costumbrista sitúa el poema en un interior humilde y cotidiano, muy alejado de cualquier escenario poético convencional.`,
      },
      {
        fragmentId: frag.id,
        type: "glosa",
        ...anchor(text, "la enarbola"),
        order: 3,
        content: `«Enarbolar»: levantar, erguir, agitar (como una bandera en un asta). Aquí se refiere a que el gato levanta la cola —gesto habitual en los gatos cuando se frotan contra algo—. El verbo tiene un claro doble sentido fálico que es la clave del poema: Samaniego nombra el gesto sin nombrarlo.`,
      },
      {
        fragmentId: frag.id,
        type: "glosa",
        ...anchor(text, "cuitada"),
        order: 4,
        content: `«Cuitada»: desgraciada, pobre mujer (de «cuita», pena o afflicción). El adjetivo mezcla lástima e ironía: la vieja «es digna de lástima» porque está sola y se conforma con el roce accidental de un gato, pero al mismo tiempo su «¡Peor es nada!» revela una resignación tan satisfecha que casi hace innecesaria la lástima.`,
      },
      {
        fragmentId: frag.id,
        type: "glosa",
        ...anchor(text, "Peor es nada"),
        order: 5,
        content: `«Peor es nada»: expresión coloquial equivalente a «algo es algo» o «más vale esto que nada». Es el remate del poema y toda su gracia. La vieja no lamenta lo que no tiene; acepta lo que llega con una filosofía práctica y resignada que es, a la vez, cómica y melancólica.`,
      },

      // ── Contexto ──────────────────────────────────────────────────────────
      {
        fragmentId: frag.id,
        type: "contexto",
        ...anchor(text, "Tenía cierta vieja de costumbre"),
        order: 1,
        content: `Félix María de Samaniego (Laguardia, Álava, 1745 – 1801) cultivó dos obras paralelas y casi secretas entre sí. La pública y celebrada: sus 158 Fábulas morales (1781), protagonizadas por animales que encarnan vicios y virtudes humanas, inspiradas en Esopo, Fedro y La Fontaine. La privada y clandestina: una abundante producción de poesía erótico-jocosa, anticlerical y satírica, escrita para sí mismo y para sus amigos ilustrados de la Sociedad Bascongada de Amigos del País. Este poema pertenece a la segunda veta: más delicado que muchos otros del mismo género, pero perfectamente representativo de su tono.`,
      },
      {
        fragmentId: frag.id,
        type: "contexto",
        ...anchor(text, "manso gato"),
        order: 2,
        content: `La Inquisición llegó a conocer algunos de estos poemas eróticos y anticlericales de Samaniego y trató de confinarlo en un convento, acusándolo de «licencioso y anticlerical». Sus amigos influyentes —muchos de ellos en las mismas instituciones que él frecuentaba— lo salvaron del castigo. Toda esta obra permaneció inédita durante más de un siglo, hasta que en 1921 el periodista y experto en literatura erótica Joaquín López Barbadillo la recopiló bajo el título El jardín de Venus. En sucesivas ediciones se han retirado algunos poemas al demostrarse que no eran de Samaniego, y añadido otros al comprobarse que sí lo eran.`,
      },

      // ── Figuras ───────────────────────────────────────────────────────────
      {
        fragmentId: frag.id,
        type: "figura",
        category: "tropo",
        ...anchor(text, "Y como en tales casos la enarbola,\ntocaba en cierta parte con la cola."),
        order: 1,
        content: `**Eufemismo sostenido**: todo el poema narra una escena erótica sin nombrar nada directamente. El gato es el agente de una acción que jamás se dice; «la enarbola» y «tocaba en cierta parte» son circunloquios perfectamente calculados. El efecto cómico depende de que el lector entienda inmediatamente lo que el texto nunca dice: la gracia está en el hueco entre el significado literal y el significado real.`,
      },
      {
        fragmentId: frag.id,
        type: "figura",
        category: "sonoro",
        ...anchor(text, "Tenía cierta vieja de costumbre,"),
        order: 2,
        content: `**Silva**: combinación libre de endecasílabos (11 sílabas) y heptasílabos (7 sílabas) con rima consonante variable. Es la forma métrica habitual de los poemas de tono mixto —ni épico ni lírico puro— en el siglo XVIII. Su flexibilidad permite a Samaniego alternar versos breves (chispeantes, rápidos) con versos más largos (descriptivos), creando un ritmo que imita el avance gradual hacia el remate cómico.`,
      },
      {
        fragmentId: frag.id,
        type: "figura",
        category: "tropo",
        ...anchor(text, "muy contenta decía: —Peor es nada"),
        order: 3,
        content: `**Anticlímax y sentencia popular**: el poema construye expectativa a través del eufemismo y la descripción gradual, para resolverse en la frase más seca y coloquial posible. «¡Peor es nada!» es la sentencia de quien no tiene grandes aspiraciones y agradece lo poco que tiene. Su vulgaridad deliberada después de toda la finura eufemística anterior es el golpe de efecto que convierte un texto picante en una pequeña obra de arte.`,
      },

      // ── Intertextualidad ─────────────────────────────────────────────────
      {
        fragmentId: frag.id,
        type: "intertextualidad",
        anchorStart: null,
        anchorEnd: null,
        order: 1,
        content: `La poesía erótico-festiva tiene una larga tradición: los epigramas de Marcial (Roma, s. I d.C.), los cuentos del Decamerón de Boccaccio (s. XIV) y la poesía burlesca de Quevedo (s. XVII) son sus grandes hitos. Samaniego la cultiva en el XVIII desde una posición ilustrada: no es la procacidad del pueblo llano ni la sátira moral del predicador, sino el humor de un aristócrata formado en Francia que lee a los enciclopedistas y ríe con elegancia.\n\nEl otro gran fabulista español del XVIII era Tomás de Iriarte. Cuando Iriarte publicó sus Fábulas literarias en 1782 —un año después de las de Samaniego— y se jactó de ser el pionero del género en español, estalló entre ambos una de las mayores enemistades literarias de nuestra historia. Samaniego le atacó en verso: «Tus obras, Tomás, no son / ni buscadas ni aun leídas, / ni tendrán estimación / aunque sean prohibidas / por la santa Inquisición».`,
      },

      // ── Preguntas ─────────────────────────────────────────────────────────
      {
        fragmentId: frag.id,
        type: "pregunta",
        questionGroup: "literal",
        anchorStart: null,
        anchorEnd: null,
        order: 1,
        content: `Describe lo que ocurre en el poema: ¿quién es la protagonista, dónde está, qué hace, y cuál es el papel del gato? ¿Qué dice la vieja al final y por qué?`,
      },
      {
        fragmentId: frag.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        anchorStart: null,
        anchorEnd: null,
        order: 2,
        content: `El poema narra una escena erótica sin nombrar directamente nada. ¿Qué palabras o frases usa Samaniego para sugerir sin decir? ¿Por qué crees que ese rodeo hace el poema más gracioso que si lo dijera directamente?`,
      },
      {
        fragmentId: frag.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        anchorStart: null,
        anchorEnd: null,
        order: 3,
        content: `Samaniego publicó sus fábulas morales —los textos que le dieron fama— y guardó para sí y sus amigos íntimos sus poemas eróticos. ¿Qué dice eso sobre las diferencias entre la literatura «de consumo público» y la «de consumo privado» en el siglo XVIII? ¿Existe hoy una diferencia similar entre lo que se crea para el gran público y lo que circula entre grupos cerrados?`,
      },
      {
        fragmentId: frag.id,
        type: "pregunta",
        questionGroup: "valorativo",
        anchorStart: null,
        anchorEnd: null,
        order: 4,
        content: `La Inquisición persiguió a Samaniego por sus poemas eróticos y anticlericales. Sus amigos influyentes lo salvaron. ¿Qué opinas de que la institución encargada de vigilar la moralidad pública persiga a un escritor por lo que escribe en privado? ¿Tiene el Estado o alguna institución el derecho de controlar lo que se escribe o se dice en ámbitos privados?`,
      },
    ],
  });

  console.log("✓ Anotaciones de «La vieja y el gato» actualizadas.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
