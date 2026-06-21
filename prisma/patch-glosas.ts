import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

function anchor(text: string, needle: string) {
  const anchorStart = text.indexOf(needle);
  if (anchorStart === -1) throw new Error(`Ancla no encontrada: "${needle}"`);
  return { anchorStart, anchorEnd: anchorStart + needle.length };
}

// Corrections for failed anchors
const PATCH: [string, [string, string][]][] = [
  ["rima-xxi", [
    ["mientras clavas", "Clavar la mirada: fijar los ojos con intensidad; el contacto visual de los dos amantes sostiene toda la pregunta del poema."],
  ]],
  ["la-guitarra-poema-cante-jondo", [
    ["Se rompen las copas", "Imagen surrealista: las horas de la madrugada son copas frágiles que se quiebran cuando comienza el llanto de la guitarra."],
    ["corazón malherido", "Metáfora central: la caja de la guitarra es un corazón herido por las cinco cuerdas, que son las cinco espadas del dolor."],
  ]],
  ["vida-retirada-oh-monte-oh-fuente-oh-rio", [
    ["mundanal ruïdo", "La trifulca y el bullicio del mundo social; «mundanal» (del lat. mundanus) y la diéresis en «ruïdo» indican pronunciación con hiato, habitual en la poesía del siglo XVI."],
    ["No cura", "No le importa, no se preocupa; «curar» en el español clásico significaba «ocuparse de» o «hacer caso de»."],
  ]],
  ["epigrama-del-palillo-de-dientes", [
    ["palillo pulido", "Mondadientes muy cuidado; la pulcritud del palillo contrasta irónicamente con el estómago vacío que el protagonista intenta disimular."],
  ]],
  ["decima-anonima-sobre-la-muerte-de-villamediana", [
    ["Mentidero", "Lugar público de Madrid —frente a San Felipe el Real— donde la gente se reunía a chismorrear; «mentidero» porque se decían mentiras y rumores."],
  ]],
  ["soneto-del-olvido-imposible", [
    ["Aviva la memoria", "La ausencia agudiza el recuerdo en lugar de borrarlo; inversión del tópico clásico «ausencia, causa de olvido»."],
  ]],
  ["dineros-son-calidad", [
    ["Cruzados hacen cruzados", "El «cruzado» era moneda portuguesa de oro; el juego de palabras juega con la homofonía: los cruzados (monedas) producen cruzados (caballeros de órdenes militares, es decir, nobleza)."],
  ]],
  ["redondilla-contra-quevedo-y-lope", [
    ["Quebebo", "Calambur sobre «Quevedo»: «Que-ve-do» → «Que-bebó» (que bebió); Góngora convierte el apellido de su rival en imagen de borrachera."],
  ]],
  ["amar-el-dia-aborrecer-el-dia", [
    ["atada la razón", "La razón del amante queda prisionera mientras la audacia (osadía) actúa libremente: imagen de la contradicción irresoluble del amor."],
  ]],
  ["misero-leno-soneto", [
    ["del ábrego y del noto", "Ábrego: viento del suroeste, húmedo y borrascoso. Noto: viento del sur. Los dos vientos tempestuosos destruyeron la nave, símbolo del hombre ambicioso."],
  ]],
  ["vivo-sin-vivir-en-mi-villancico-completo", [
    ["este letrero", "Inscripción, lema grabado; Teresa imagina que Dios, al recibir su corazón, escribió en él la paradoja mística como un letrero."],
  ]],
];

async function main() {
  console.log(`Parchando ${PATCH.length} fragmentos...`);

  for (const [slug, glosaList] of PATCH) {
    const fragment = await prisma.fragment.findFirst({
      where: { slug },
      select: { id: true, text: true },
    });
    if (!fragment) { console.warn(`  ⚠ No encontrado: ${slug}`); continue; }

    const maxOrder = await prisma.annotation.aggregate({
      where: { fragmentId: fragment.id },
      _max: { order: true },
    });
    let order = (maxOrder._max.order ?? 0) + 1;

    let added = 0;
    for (const [needle, content] of glosaList) {
      try {
        const { anchorStart, anchorEnd } = anchor(fragment.text, needle);
        await prisma.annotation.create({
          data: { fragmentId: fragment.id, type: "glosa", anchorStart, anchorEnd, content, order: order++ },
        });
        added++;
      } catch (e: unknown) {
        console.warn(`  ⚠ [${slug}] ${e instanceof Error ? e.message : e}`);
      }
    }
    console.log(`  ✓ ${slug}: +${added}`);
  }

  console.log("\nHecho.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
