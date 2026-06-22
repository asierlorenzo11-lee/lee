export const revalidate = 3600;

import Link from "next/link";
import type { Metadata } from "next";
import { getFigurasIndex } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Figuras retóricas",
  description:
    "Índice de figuras retóricas, tópicos literarios y recursos de estilo presentes en la antología ¡LEE! Con ejemplos directos de los textos.",
};

// Category display config
const CATEGORIES = [
  {
    key: "tropo",
    label: "Tropos",
    desc: "Metáforas, comparaciones, hipérboles, ironías y otras imágenes",
    bg: "bg-[#f5c4b2]/30",
    border: "border-[#d88a6e]",
    dot: "bg-[#d88a6e]",
    text: "text-[#7a2331]",
  },
  {
    key: "topos",
    label: "Tópicos literarios",
    desc: "Lugares comunes que atraviesan la tradición occidental",
    bg: "bg-[#c4dfb8]/30",
    border: "border-[#5a9e4e]",
    dot: "bg-[#5a9e4e]",
    text: "text-[#2d5a27]",
  },
  {
    key: "sintaxis",
    label: "Recursos sintácticos",
    desc: "Anáforas, paralelismos, hipérbaton, quiasmos y estructuras especulares",
    bg: "bg-[#c4d4ec]/30",
    border: "border-[#4a6fa8]",
    dot: "bg-[#4a6fa8]",
    text: "text-[#1a3a6b]",
  },
  {
    key: "sonoro",
    label: "Recursos sonoros",
    desc: "Aliteración, paronomasia, rima interna y juegos fónicos",
    bg: "bg-[#dcd4ec]/30",
    border: "border-[#7a5ea8]",
    dot: "bg-[#7a5ea8]",
    text: "text-[#4a2d7a]",
  },
] as const;

/** Generic definitions for the most common rhetorical figures */
const FIGURA_DEFS: Record<string, string> = {
  // Tropos
  "Metáfora": "Identificación de un término real con uno imaginario que comparte alguna cualidad.",
  "Símil": "Comparación explícita entre dos realidades mediante un nexo comparativo («como», «tal»).",
  "Comparación": "Comparación explícita entre dos realidades mediante un nexo comparativo («como», «tal»).",
  "Alegoría": "Metáfora sostenida a lo largo de un texto que construye un significado simbólico global.",
  "Metonimia": "Sustitución de un término por otro con el que guarda una relación de contigüidad o causalidad.",
  "Sinécdoque": "Designación de la parte por el todo, o del todo por la parte.",
  "Ironía": "Afirmación de lo contrario a lo que se piensa, con intención crítica o humorística.",
  "Ironía dramática": "El lector sabe más que el personaje, lo que genera distancia crítica o tensión.",
  "Ironía socrática": "Fingimiento de ignorancia para revelar la inconsistencia del interlocutor.",
  "Sarcasmo": "Ironía punzante y mordaz, con intención ofensiva o hiriente.",
  "Hipérbole": "Exageración desmesurada con fin expresivo o intensificador.",
  "Litotes": "Afirmación de algo mediante la negación de su contrario, atenuando el enunciado.",
  "Eufemismo": "Sustitución de un término tabú o desagradable por una expresión más suave.",
  "Personificación": "Atribución de cualidades o acciones humanas a seres inanimados, animales o conceptos abstractos.",
  "Prosopopeya": "Atribución de cualidades o acciones humanas a seres inanimados, animales o conceptos abstractos.",
  "Oxímoron": "Unión de dos términos de significado contradictorio en una misma expresión.",
  "Paradoja": "Afirmación aparentemente absurda o contradictoria que encierra una verdad profunda.",
  "Antítesis": "Contraposición de dos ideas o términos de significado opuesto para realzar su contraste.",
  "Epíteto": "Adjetivo que expresa una cualidad inherente del sustantivo, más ornamental que informativa.",
  "Perífrasis": "Rodeo de palabras para expresar un concepto en lugar de nombrarlo directamente.",
  "Sinestesia": "Mezcla de sensaciones pertenecientes a sentidos distintos en una sola expresión.",
  "Catácresis": "Uso de una palabra en sentido figurado por no existir término propio para el concepto.",
  "Alusión": "Referencia implícita a un texto, personaje, hecho histórico o cultural conocido.",
  // Tópicos literarios
  "Beatus ille": "El elogio de la vida sencilla en el campo, alejada de las ambiciones de la ciudad y la corte.",
  "Carpe diem": "Invitación a aprovechar el momento presente ante la brevedad de la vida.",
  "Ubi sunt?": "Lamentación por la desaparición de personas o cosas que en su tiempo fueron poderosas.",
  "Locus amoenus": "Descripción idealizada de un paisaje placentero —prado, fuente, árbol— como marco del amor o la reflexión.",
  "Tempus fugit": "Constatación del paso implacable del tiempo y la fugacidad de la existencia.",
  "Omnia vincit amor": "El amor como fuerza superior que vence todos los obstáculos.",
  "Militia est vita hominis": "Concepción de la vida como lucha o combate continuo.",
  "Fortuna mutabilis": "La rueda de la Fortuna: la inconstancia del destino que eleva y derriba a los poderosos.",
  "Navigatio vitae": "La vida comparada con un viaje en barco por aguas inciertas.",
  "El mundo al revés": "Inversión de valores o del orden natural como crítica o sátira social.",
  "Puer senex": "Joven que posee la sabiduría o la seriedad de un anciano.",
  "Theatrum mundi": "El mundo entendido como un teatro en el que los hombres son actores de un papel efímero.",
  "Descriptio puellae": "Descripción pormenorizada de la belleza femenina siguiendo un canon idealizado.",
  "Contemptus mundi": "Desprecio o desengaño del mundo material en favor de lo espiritual o eterno.",
  "Vanitas vanitatum": "Reflexión sobre la vanidad y futilidad de los bienes y placeres terrenales.",
  // Sintaxis
  "Anáfora": "Repetición de una o varias palabras al comienzo de frases o versos consecutivos.",
  "Epífora": "Repetición de una o varias palabras al final de frases o versos consecutivos.",
  "Anadiplosis": "Repetición de la última palabra (o grupo) de un verso o frase al inicio del siguiente.",
  "Epanadiplosis": "Comienzo y final del verso o frase con la misma palabra.",
  "Paralelismo": "Repetición de la misma estructura sintáctica en dos o más enunciados.",
  "Quiasmo": "Inversión especular de los elementos en dos frases paralelas (ABBA).",
  "Hipérbaton": "Alteración del orden sintáctico habitual de los elementos de la frase.",
  "Elipsis": "Omisión de elementos gramaticalmente esperados pero sobreentendidos por el contexto.",
  "Polisíndeton": "Repetición de conjunciones coordinantes para dar énfasis o ritmo acumulativo.",
  "Asíndeton": "Supresión de conjunciones para dar rapidez, dinamismo o intensidad.",
  "Enumeración": "Serie sucesiva de elementos relacionados, con o sin conjunción.",
  "Acumulación": "Serie sucesiva de elementos relacionados, con o sin conjunción.",
  "Gradación": "Ordenación progresiva de términos en escala ascendente o descendente de intensidad.",
  "Clímax": "Ordenación progresiva de términos en escala ascendente de intensidad.",
  "Interrogación retórica": "Pregunta que no espera respuesta, utilizada para afirmar, enfatizar o implicar al lector.",
  "Exclamación retórica": "Enunciado exclamativo que expresa emoción intensa o interpela al lector.",
  "Apóstrofe": "Interpelación directa a una persona, objeto o abstracción como si pudieran escuchar.",
  "Etopeya": "Descripción de los rasgos morales o psicológicos de un personaje.",
  "Prosopografía": "Descripción de los rasgos físicos de un personaje.",
  "Retrato": "Descripción combinada de rasgos físicos y morales de un personaje.",
  "Máxima": "Sentencia breve que condensa una verdad moral, filosófica o de experiencia.",
  "Sentencia": "Sentencia breve que condensa una verdad moral, filosófica o de experiencia.",
  "Diáfora": "Repetición de una misma palabra con distinto significado o función en el mismo enunciado.",
  "Pleonasmo": "Adición de palabras innecesarias que refuerzan o intensifican el significado.",
  "Concatenación": "Enlace en cadena de versos o frases, donde cada uno retoma el final del anterior.",
  // Sonoros
  "Aliteración": "Repetición de un mismo sonido o grupo de sonidos para crear un efecto fónico expresivo.",
  "Paronomasia": "Juego de palabras entre términos de sonido similar pero significado distinto.",
  "Calambur": "Reagrupación de las sílabas de una o varias palabras para crear un significado distinto.",
  "Onomatopeya": "Palabra que imita el sonido del objeto o acción que designa.",
  "Rima interna": "Coincidencia de sonidos entre palabras situadas en el interior del verso.",
  "Homeotéleuton": "Similitud de terminaciones en palabras próximas, creando un efecto de eco.",
  "Ritmo": "Distribución regular de acentos, pausas o sílabas para crear cadencia musical.",
  "Anáfora fónica": "Repetición de sonidos iniciales en palabras o versos consecutivos.",
};

/** Extracts name and generic definition from annotation content */
function parseFigura(content: string): { name: string; definition: string } {
  const match = content.match(/^\*\*([^*]+)\*\*:?\s*/);
  if (match) {
    const name = match[1].replace(/:$/, "").trim();
    // Use generic definition from lookup if available
    const knownDef = FIGURA_DEFS[name];
    if (knownDef) return { name, definition: knownDef };
    // Fallback: first sentence of annotation content (strip markdown bold)
    const rest = content.slice(match[0].length).replace(/\*\*/g, "").trim();
    const dot = rest.indexOf(".");
    const sentence = dot !== -1 && dot < 160 ? rest.slice(0, dot + 1) : rest.slice(0, 140) + "…";
    return { name, definition: sentence };
  }
  // No bold name — first sentence of the full content
  const plain = content.replace(/\*\*/g, "").trim();
  const dot = plain.indexOf(".");
  const sentence = dot !== -1 && dot < 160 ? plain.slice(0, dot + 1) : plain.slice(0, 140) + "…";
  return { name: "", definition: sentence };
}

export default async function FigurasPage() {
  const annotations = await getFigurasIndex();

  const totalFigs = annotations.length;
  const byCategory = new Map<string, typeof annotations>(
    CATEGORIES.map((c) => [c.key, []]),
  );
  for (const ann of annotations) {
    byCategory.get(ann.category ?? "")?.push(ann);
  }

  return (
    <div>
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="border-b-2 border-accent px-6 pb-10 pt-16 sm:px-12 animate-portada-fade-up">
        <div className="mx-auto flex max-w-4xl items-end justify-between gap-8">
          <div>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-accent mb-3">
              recursos de estilo · {totalFigs} anotaciones
            </p>
            <h1
              className="font-display font-black text-ink leading-[0.9] tracking-tight"
              style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)", letterSpacing: "-0.03em" }}
            >
              Figuras
            </h1>
          </div>
          <p
            className="hidden sm:block font-serif italic font-light text-ink-soft text-right max-w-xs leading-relaxed self-end pb-1"
            style={{ fontSize: "clamp(0.85rem, 1.4vw, 1rem)" }}
          >
            Tropos, tópicos, recursos sintácticos y sonoros identificados en los textos de la antología.
          </p>
        </div>
      </div>

      {/* ── Legend ───────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-4xl px-6 sm:px-12 pt-8 pb-2 flex flex-wrap gap-4">
        {CATEGORIES.map((cat) => (
          <a
            key={cat.key}
            href={`#${cat.key}`}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1 text-xs hover:border-accent hover:text-accent transition-colors"
          >
            <span className={`size-2.5 rounded-full ${cat.dot}`} aria-hidden />
            {cat.label}
            <span className="text-ink-soft">
              ({byCategory.get(cat.key)?.length ?? 0})
            </span>
          </a>
        ))}
      </div>

      {/* ── Category sections ────────────────────────────────────────────── */}
      <div className="mx-auto max-w-4xl px-6 sm:px-12 pb-24 space-y-16 pt-8">
        {CATEGORIES.map((cat) => {
          const items = byCategory.get(cat.key) ?? [];
          if (items.length === 0) return null;

          return (
            <section key={cat.key} id={cat.key}>
              {/* Section header */}
              <div className={`rounded-lg border-l-4 ${cat.border} ${cat.bg} px-5 py-4 mb-6`}>
                <div className="flex items-baseline gap-3">
                  <h2 className={`font-display text-2xl font-bold italic ${cat.text}`}>
                    {cat.label}
                  </h2>
                  <span className="text-sm text-ink-soft">
                    {items.length} {items.length === 1 ? "ejemplo" : "ejemplos"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-ink-soft">{cat.desc}</p>
              </div>

              {/* Annotation list */}
              <ul className="divide-y divide-line">
                {items.map((ann) => {
                  const { name, definition } = parseFigura(ann.content);
                  return (
                    <li key={ann.id} className="py-4 group">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          {name && (
                            <span
                              className={`inline-block font-display font-bold italic text-base mr-2 ${cat.text}`}
                            >
                              {name}
                            </span>
                          )}
                          {definition && (
                            <span className="text-sm text-ink leading-relaxed">
                              {definition}
                            </span>
                          )}
                        </div>
                        <Link
                          href={`/fragmentos/${ann.fragment.slug}`}
                          className="shrink-0 self-start sm:self-center text-xs text-ink-soft border border-line rounded-full px-3 py-1 hover:border-accent hover:text-accent transition-colors whitespace-nowrap"
                          title={`${ann.fragment.headline} — ${ann.fragment.work.title}, ${ann.fragment.work.author.name}`}
                        >
                          {ann.fragment.headline.length > 32
                            ? ann.fragment.headline.slice(0, 30) + "…"
                            : ann.fragment.headline}
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
