/**
 * fix-intertextualidad-bulk.ts
 *
 * Adds missing "intertextualidad" annotations to ~33 fragments:
 * - Cervantes / Don Quijote (10 fragments)
 * - Tirso de Molina (que-largo-me-lo-fiais)
 * - Lazarillo de Tormes (6 fragments)
 * - Cadalso (4 fragments)
 * - Feijoo (2 fragments)
 * - Jovellanos (3 fragments)
 * - Iriarte (2 fragments)
 * - Samaniego (1 fragment)
 * - Moratín (1 fragment)
 * - Arroyal (1 fragment)
 * - Rosalía de Castro (3 fragments)
 */

import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

let ok = 0, fail = 0;

async function addInter(
  fragSlug: string,
  fragText: string,
  fragId: string,
  needle: string,
  content: string,
  externalCitation?: string,
) {
  try {
    const i = fragText.indexOf(needle);
    if (i === -1) throw new Error(`Anchor not found: "${needle.slice(0, 40)}"`);
    await prisma.annotation.create({
      data: {
        fragmentId: fragId,
        type: "intertextualidad",
        anchorStart: i,
        anchorEnd: i + needle.length,
        order: 10,
        content,
        ...(externalCitation ? { externalCitation } : {}),
      },
    });
    ok++;
  } catch (e: any) {
    fail++;
    console.error(`  ✗ ${fragSlug} → ${e.message}`);
  }
}

// helper: extract the first usable line as anchor
function firstLine(text: string, max = 40): string {
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (t.length >= 5) return t.slice(0, max);
  }
  return text.slice(0, max);
}

type Entry = {
  slug: string;
  content: string;
  externalCitation?: string;
};

const ENTRIES: Entry[] = [
  // ── CERVANTES / DON QUIJOTE ────────────────────────────────────────────────
  {
    slug: "en-un-lugar-de-la-mancha",
    content: `La apertura del *Quijote* —«de cuyo nombre no quiero acordarme»— prolonga la tradición de los narradores dudosos que inaugura el *Lazarillo de Tormes* (1554). Ambos textos usan la primera persona para contar una historia que el narrador no domina del todo: Lázaro escribe a petición de alguien que ya conoce el final; Cervantes finge no saber ni el nombre del pueblo. En ambos casos, la *fiabilidad* del narrador está en entredicho, y esa duda es parte del juego literario.`,
    externalCitation: `Anónimo, *Lazarillo de Tormes* (1554): «Pues sepa Vuestra Merced, ante todas cosas, que a mí llaman Lázaro de Tormes, hijo de Tomé González y de Antona Pérez, naturales de Tejares, aldea de Salamanca.»`,
  },
  {
    slug: "discurso-edad-de-oro",
    content: `La *Edad de Oro* que Don Quijote describe —sin propiedad privada, sin engaño, sin necesidad de justicia— viene de la tradición clásica (Hesíodo, Ovidio) que Garcilaso de la Vega había recreado en sus églogas para el lector renacentista. La diferencia es reveladora: en Garcilaso, la Edad de Oro es el espacio pastoral de los pastores que cantan de amor; en Cervantes, es un mundo sin armas que justifica la existencia de los caballeros que las portan. El *locus amoenus* se convierte en argumento para el *miles gloriosus*.`,
    externalCitation: `Garcilaso de la Vega, *Égloga I* (h. 1534): «¡Oh dulces prendas por mi mal halladas, / dulces y alegres cuando Dios quería!» — la naturaleza como espacio del amor y del ideal.`,
  },
  {
    slug: "discurso-de-marcela",
    content: `Marcela es el primer gran discurso de autodéfensa femenina de la literatura española: «Yo nací libre, y para poder vivir libre escogí la soledad de los campos.» Ana Caro de Mallén, dramaturga barroca, escribirá décadas después personajes femeninos que reivindican la misma libertad en el teatro —la condesa de *El conde Partinuplés*, por ejemplo—. Tanto Marcela como los personajes de Ana Caro rechazan que la feminidad equivalga a disponibilidad amorosa.`,
    externalCitation: `Ana Caro de Mallén, *El conde Partinuplés* (h. 1653): personajes femeninos que ejercen poder político y rechazan la sujeción sentimental.`,
  },
  {
    slug: "yo-se-quien-soy",
    content: `«—Yo sé quién soy», responde Don Quijote a quien le llama por su nombre real. La identidad es, en el *Quijote*, algo que se *declara*, no algo que se *hereda*: uno es quien decide ser. Tirso de Molina, contemporáneo de Cervantes, construirá a Don Juan Tenorio exactamente sobre el principio contrario: Don Juan también declara quién es («Soy el diablo»), pero para escapar de toda responsabilidad. Ambos son personajes que hacen de la identidad una actuación, no una realidad fija.`,
    externalCitation: `Tirso de Molina, *El burlador de Sevilla* (h. 1630): «—¿Quién eres? / —¿Quién ha de ser? / Un hombre sin nombre.»`,
  },
  {
    slug: "discurso-armas-y-letras",
    content: `El dilema *armas vs. letras* tiene en Cervantes una resonancia autobiográfica: el propio autor fue soldado en Lepanto (1571) y perdió el uso de la mano izquierda en combate, antes de dedicarse a escribir. Garcilaso de la Vega, el poeta renacentista más admirado en el *Quijote*, fue también soldado: murió en combate en 1536. La elegía implícita en el discurso de Don Quijote es que, en el mundo del siglo XVII, las armas ya no dan la gloria que prometían —la quijada del autor lo sabe bien.`,
    externalCitation: `Garcilaso de la Vega (1498/1503-1536): poeta y soldado, murió durante el asedio de Le Muy (Francia). Sus sonetos combinan la experiencia bélica y el amor petrarquista.`,
  },
  {
    slug: "discurso-de-la-libertad",
    content: `Don Quijote proclama: «La libertad, Sancho, es uno de los más preciosos dones que a los hombres dieron los cielos.» Dos siglos después, el Romanticismo convertiría esta idea en su bandera: Espronceda pone en boca del Pirata exactamente esa misma declaración de libertad absoluta —«que es mi barco mi tesoro, / que es mi Dios la libertad»—. La diferencia es el tono: en Cervantes, la libertad es un bien natural y racional; en Espronceda, es una rebeldía romántica y apasionada.`,
    externalCitation: `José de Espronceda, *Canción del pirata* (1835): «Que es mi barco mi tesoro, / que es mi Dios la libertad; / mi ley, la fuerza y el viento; / mi única patria, la mar.»`,
  },
  {
    slug: "la-aventura-de-los-batanes",
    content: `Don Quijote avanza hacia el ruido terrible de los batanes sin vacilar; Sancho tiembla de miedo. La escena dialoga con el tema del valor y la cobardía que Tirso desarrolla en el *Burlador de Sevilla*: Don Juan tampoco tiene miedo a nada —ni a la Muerte, ni al Comendador de piedra—. Pero hay una diferencia fundamental: el valor de Don Quijote nace del *ideal* (cree estar haciendo el bien); el de Don Juan, del *nihilismo* (no cree que haya consecuencias para sus actos).`,
    externalCitation: `Tirso de Molina, *El burlador de Sevilla* (h. 1630): «¡Qué largo me lo fiáis!» — Don Juan aplaza el arrepentimiento porque no teme la muerte.`,
  },
  {
    slug: "consejos-a-sancho-aseo-y-modales",
    content: `Los consejos de Don Quijote a Sancho sobre aseo, modales y educación anticipan el programa ilustrado de Jovellanos y Feijoo: la idea de que el pueblo puede —y debe— educarse para cumplir mejor sus funciones. La diferencia es el contexto: Cervantes sitúa esa educación en boca de un loco que instruye a un ignorante, como parodia de los espejos de príncipes medievales. Feijoo y Jovellanos, un siglo después, dirán lo mismo en serio, desde el poder y con ambición política.`,
    externalCitation: `Gaspar Melchor de Jovellanos, *Informe sobre el expediente de la Ley Agraria* (1787): la educación como condición para el progreso económico y social.`,
  },
  {
    slug: "consejos-a-sancho-linaje-y-justicia",
    content: `La advertencia de Don Quijote a Sancho —que la nobleza de sangre no sirve si no va acompañada de virtud— es exactamente la crítica que Cadalso desarrollará en las *Cartas marruecas* (1789): el noble español de sangre que presume de abolengo sin mérito propio. Ambos textos denuncian el mismo vicio: la creencia de que el nacimiento sustituye al esfuerzo. Cadalso, heredero de Cervantes, convierte esta crítica en sátira ilustrada.`,
    externalCitation: `José de Cadalso, *Cartas marruecas* (1789), Carta XII: la crítica del noble que presume de linaje y no de virtud.`,
  },
  {
    slug: "la-muerte-de-don-quijote",
    content: `Don Quijote muere lúcido, repudiando sus propias locuras: una muerte que no es un triunfo romántico sino una tragedia cómica. El Romanticismo, sin embargo, prefirió quedarse con el Don Quijote *vivo* —el que lucha, el que sueña— e ignorar esta muerte. Bécquer, en sus *Rimas*, recoge el idealismo del caballero sin su sátira: la búsqueda de lo imposible como única forma de vida. El Quijote muerto que Cervantes escribe es exactamente lo que el Romanticismo no quiere leer.`,
    externalCitation: `Gustavo Adolfo Bécquer, *Rima IV*: «No digáis que agotado su tesoro, / de asuntos falta, enmudeció la lira; / podrá no haber poetas, pero siempre / habrá poesía.» — el idealismo que sobrevive a cualquier desilusión.`,
  },

  // ── TIRSO ──────────────────────────────────────────────────────────────────
  {
    slug: "que-largo-me-lo-fiais",
    content: `«¡Qué largo me lo fiáis!» es la frase con que Don Juan responde a cualquier amenaza de castigo: siempre queda tiempo para arrepentirse. Dos siglos después, José Zorrilla retomará exactamente este personaje en *Don Juan Tenorio* (1844), pero le dará un final distinto: el don Juan de Zorrilla sí se arrepiente, salvado por el amor de doña Inés. Tirso castiga al burlador sin redención; Zorrilla lo salva por el amor romántico. Los dos don Juanes son el mismo personaje, con dos visiones del hombre y de la gracia divina.`,
    externalCitation: `José Zorrilla, *Don Juan Tenorio* (1844): «¡Cuán gritan esos malditos! / Pero mal rayo me parta / si en concluyendo la carta / no pagan caros sus gritos.» — el mismo fanfarrón, pero que acabará salvándose.`,
  },

  // ── LAZARILLO DE TORMES ────────────────────────────────────────────────────
  {
    slug: "prologo-honra-cria-las-artes",
    content: `El prólogo del *Lazarillo* es una declaración de poetología revolucionaria: cualquier texto merece atención si está bien escrito, aunque lo escriba un pícaro. Medio siglo después, Cervantes recogió exactamente esta idea al abrir el *Quijote* sin prólogo convencional, burlándose de los prologuistas que se inventan la autoridad de sus obras. Lázaro y Cervantes comparten la misma sospecha: los textos deben justificarse por sí solos, no por el nombre del autor ni por la aprobación de los poderosos.`,
    externalCitation: `Miguel de Cervantes, *Don Quijote*, Prólogo al lector (1605): «Desocupado lector: sin juramento me podrás creer que quisiera que este libro, como hijo del entendimiento, fuera el más hermoso, el más gallardo y más discreto que pudiera imaginarse.»`,
  },
  {
    slug: "el-toro-de-salamanca",
    content: `El episodio del toro de Salamanca es el primero de la educación de Lázaro: aprende que la astucia es necesaria para sobrevivir en un mundo que no tiene compasión de los ignorantes. Este mismo principio —la inteligencia como única arma de quien no tiene dinero ni linaje— es lo que Sancho Panza aprende de Don Quijote, aunque en sentido contrario: Sancho aprende que la lealtad y el sentido común valen más que la malicia. El pícaro y el escudero son los dos grandes tipos del criado español del Siglo de Oro.`,
    externalCitation: `Miguel de Cervantes, *Don Quijote*, II, 43: los consejos de Don Quijote a Sancho para gobernar la ínsula — el criado también puede educarse.`,
  },
  {
    slug: "el-jarro-de-vino",
    content: `El ciego engaña a Lázaro con el jarro de vino; Lázaro vengará la humillación dejando que el ciego choque contra el poste. La dinámica del amo que engaña y el criado que devuelve la trampa con otra más elaborada es característica de la comedia barroca: Lope de Vega y sus continuadores construyeron cientos de obras sobre este mismo esquema del *gracioso* (criado astuto) que supera en ingenio al señor. El *Lazarillo* es la novela que explica cómo nació ese tipo teatral.`,
    externalCitation: `Lope de Vega, *Fuenteovejuna* (h. 1612-1614): Mengo, el labrador cómico, usa el humor y la astucia para sobrevivir en el conflicto entre el poder señorial y el pueblo.`,
  },
  {
    slug: "el-arca-del-pan",
    content: `El episodio del arca del pan muestra a Lázaro y al clérigo en una guerra de astucias por la comida: el clérigo cierra el arca con llave, Lázaro la abre con una serpiente-llave robada. Este microcosmos de la lucha por la subsistencia anticipa la crítica social ilustrada: Jovellanos y Feijoo denunciarán que el hambre y la miseria del pueblo son consecuencia de una organización económica injusta, no de la pereza o la maldad de los pobres. Lázaro roba el pan porque no tiene otro modo de sobrevivir.`,
    externalCitation: `Gaspar Melchor de Jovellanos, *Informe sobre el expediente de la Ley Agraria* (1787): el problema no es la holgazanería del labrador sino el sistema que le impide trabajar la tierra.`,
  },
  {
    slug: "la-negra-honra",
    content: `El escudero que muere de hambre pero cuida su apariencia es la crítica más feroz del *Lazarillo* al concepto español de *honra*: preferir parecer noble a ser útil. Cadalso repetirá esta crítica en la *Carta XXXV* de las *Cartas marruecas*, donde un cochero lleva en brazos al señorito para que no se manche los zapatos. La honra exterior sin mérito interior es la obsesión de la cultura española que tanto irrita a los ilustrados del siglo XVIII.`,
    externalCitation: `José de Cadalso, *Cartas marruecas* (1789), Carta XXXV: el señorito que no puede caminar solo porque su rango se lo impide —la misma farsa que el escudero del *Lazarillo*.`,
  },
  {
    slug: "lazaro-pregonero",
    content: `Lázaro termina como pregonero —el oficio más bajo de la ciudad— y narrador de su propia historia. La distancia irónica entre el narrador adulto y el niño que fue es la misma que usa Cervantes en el *Quijote*: el que escribe conoce el final y puede reírse (o llorar) de lo que vivió. Ambas novelas son también autobiografías ficticias que preguntan: ¿quién tiene derecho a contar su propia historia? La respuesta, en ambos casos, es radical: cualquiera, incluso un pícaro sin nombre.`,
    externalCitation: `Miguel de Cervantes, *Don Quijote*, I, 1: «En un lugar de la Mancha, de cuyo nombre no quiero acordarme...» — el narrador que borra sus propias huellas, como Lázaro que oculta su deshonra conyugal.`,
  },

  // ── CADALSO ───────────────────────────────────────────────────────────────
  {
    slug: "carta-xii-cadalso",
    content: `La *Carta XII* pertenece al proyecto ilustrado de diagnóstico del «atraso» español, que comparte con Feijoo y Jovellanos: España tiene los recursos para progresar, pero las costumbres, los prejuicios y el peso de la tradición lo impiden. Feijoo lo planteará desde la crítica al pensamiento escolástico; Jovellanos, desde la economía y la educación; Cadalso, desde el retrato satírico de tipos sociales que encarnan esos obstáculos. Los tres son ilustrados; los tres escriben desde la misma frustración.`,
    externalCitation: `Benito Jerónimo Feijoo, *Teatro crítico universal* (1726-1740): la crítica a las «disputas de escuelas» como obstáculo al progreso científico en España.`,
  },
  {
    slug: "carta-xiii-cadalso",
    content: `Las *Cartas marruecas* dialogan con el género epistolar europeo: Montesquieu (*Lettres persanes*, 1721) y Goldsmith (*Citizen of the World*, 1762) ya habían usado el «extranjero que observa» para criticar la sociedad europea. Cadalso adapta el género a España: su moro Gazel mira con extrañeza las mismas cosas que los españoles dan por naturales. En paralelo, Jovellanos analiza los mismos problemas —educación, economía, tradición— pero desde dentro del sistema, en informes destinados al gobierno.`,
    externalCitation: `Gaspar Melchor de Jovellanos, *Memoria sobre educación pública* (1802): la reforma educativa como condición para el progreso de España.`,
  },
  {
    slug: "carta-xxxv-cadalso",
    content: `La escena del cochero que lleva al señorito en volandas para que no se ensucie los zapatos es la misma crítica que Mariano José de Larra —heredero literario directo de Cadalso— hará décadas después en sus artículos costumbristas: «¿Quién es el amo, el que manda o el que obedece?». Larra usa el humor y la indignación moral de la misma manera que Cadalso: el ridículo de la escena es el argumento. La diferencia es el tono: Cadalso es más frío, más ilustrado; Larra, más apasionado, más romántico.`,
    externalCitation: `Mariano José de Larra, *Vuelva usted mañana* (1833): la crítica a la burocracia española usando el contraste entre la eficiencia extranjera y la desidia nacional.`,
  },
  {
    slug: "los-eruditos-a-la-violeta-leccion",
    content: `Los «eruditos a la violeta» —los que presumen de saber en una tarde lo que otros estudian años— son la versión española de los *pedants* que Moratín satirizará en *La comedia nueva* (1792): el señor Eleuterio que cree haber escrito una obra de teatro en una semana. Cadalso y Moratín son ilustrados que comparten el mismo enemigo: la presunción de saber sin esfuerzo. La diferencia es el género: Cadalso satiriza en prosa la sociedad de salón; Moratín, en teatro, el mundo del espectáculo.`,
    externalCitation: `Leandro Fernández de Moratín, *La comedia nueva o El café* (1792): don Eleuterio, el dramaturgo aficionado que estrena su obra sin talento ni formación.`,
  },

  // ── FEIJOO ────────────────────────────────────────────────────────────────
  {
    slug: "feijoo-atraso-cientifico",
    content: `El diagnóstico de Feijoo sobre el atraso científico español —causado por el peso de la tradición escolástica y la desconfianza a lo nuevo— es el punto de partida del proyecto ilustrado que Jovellanos llevará a la práctica: la creación del Real Instituto Asturiano de Náutica y Mineralogía (1794). Feijoo abre el debate; Jovellanos construye instituciones. Cadalso, desde la sátira, muestra por qué los «eruditos a la violeta» resisten tanto la renovación: el conocimiento sin esfuerzo parece más atractivo que el conocimiento verdadero.`,
    externalCitation: `Gaspar Melchor de Jovellanos, *Memoria sobre educación pública* (1802): las instituciones educativas como instrumento para superar el atraso científico que Feijoo había descrito.`,
  },
  {
    slug: "feijoo-dictados-aulas",
    content: `La crítica de Feijoo al sistema universitario español —que enseña a repetir en lugar de a pensar— prefigura exactamente la alternativa pedagógica que Jovellanos propondrá: aprender de la naturaleza y la experiencia, no solo de los libros. Jovellanos enviará a sus alumnos del Instituto Asturiano a las minas para aprender minería in situ, no en el aula. Tanto Feijoo como Jovellanos pertenecen a la misma tradición empirista de Bacon y Locke que llega a España con retraso pero con fuerza.`,
    externalCitation: `Gaspar Melchor de Jovellanos, *Oración inaugural del Real Instituto Asturiano* (1794): la enseñanza práctica de la minería y la navegación como alternativa a la escolástica universitaria.`,
  },

  // ── JOVELLANOS ────────────────────────────────────────────────────────────
  {
    slug: "jovellanos-instruccion-publica",
    content: `El programa educativo de Jovellanos —instrucción pública, ciencias útiles, formación del ciudadano— dialoga directamente con Feijoo, quien había diagnosticado el mismo problema desde la filosofía. Pero Jovellanos da un paso más: no solo describe el atraso, sino que diseña instituciones para superarlo. El Real Instituto Asturiano (1794) es la respuesta práctica a las críticas que Feijoo había hecho medio siglo antes. Los ilustrados españoles leen a los mismos europeos (Locke, Rousseau, Condillac) y llegan a las mismas conclusiones.`,
    externalCitation: `Benito Jerónimo Feijoo, *Teatro crítico universal*, vol. I (1726): «Que hay en España hombres de gran talento es innegable; que no producen tanto como pudieran, también.»`,
  },
  {
    slug: "jovellanos-los-toros",
    content: `La crítica de Jovellanos a las corridas de toros como «diversiones bárbaras» que distraen al pueblo del trabajo productivo es paralela a la de Cadalso en las *Cartas marruecas*: la España que malgasta el tiempo en fiestas y espectáculos en lugar de trabajar y reformarse. Ambos ilustrados comparten el mismo diagnóstico, aunque Jovellanos lo formula desde la economía política y Cadalso desde la sátira social. El toro de Jovellanos y el cochero de Cadalso son dos imágenes del mismo problema.`,
    externalCitation: `José de Cadalso, *Cartas marruecas* (1789), Carta XXXV: el noble que prefiere el paseo al trabajo como imagen del improductivo sistema de valores español.`,
  },
  {
    slug: "jovellanos-rios-circulacion",
    content: `La metáfora económica de Jovellanos —los ríos como sistema circulatorio de la riqueza nacional— conecta con el pensamiento fisiocrático europeo (Quesnay, Turgot) que imagina la economía como un organismo vivo. Pero también dialoga con León de Arroyal, funcionario ilustrado que escribe *Pan y toros* (1793-1796) para denunciar que el gobierno prefiere dar espectáculos al pueblo en lugar de reformas. Jovellanos quiere construir canales; Arroyal quiere reformar el Estado. Los dos son ilustrados frustrados por el mismo absolutismo.`,
    externalCitation: `León de Arroyal, *Pan y toros* (1793-1796): la denuncia de que el gobierno español usa el entretenimiento popular para mantener al pueblo ignorante y dócil.`,
  },

  // ── IRIARTE ───────────────────────────────────────────────────────────────
  {
    slug: "el-burro-flautista",
    content: `La fábula del Burro Flautista es la respuesta directa de Iriarte a su rival Félix María de Samaniego: los dos fabulistas españoles más importantes del siglo XVIII protagonizaron una polémica literaria feroz sobre quién escribía mejores fábulas, cuál era más original y quién plagiaría a quién. Samaniego acusó a Iriarte de copiar a La Fontaine; Iriarte defendió su originalidad. El burro que toca la flauta por accidente puede ser leído como caricatura de quien escribe fábulas sin talento verdadero: una apuesta en la polémica entre los dos fabulistas.`,
    externalCitation: `Félix María de Samaniego, *Fábulas morales* (1781): rival literario de Iriarte, cuyas fábulas dialogan y compiten con las *Fábulas literarias* (1782).`,
  },
  {
    slug: "los-dos-conejos",
    content: `La fábula de los Dos Conejos critica al espectador que confunde los objetos de la disputa: ve perros cuando hay galgos, oye una discusión sobre conejos cuando se debate sobre liebres. Es exactamente la crítica que Iriarte lanza contra el público literario de su tiempo —el mismo público que Samaniego satirizaba en sus fábulas—: un público que no distingue lo bueno de lo malo, que confunde el verdadero arte con la imitación. Iriarte y Samaniego, rivales en la práctica, comparten el mismo diagnóstico sobre el gusto del público español.`,
    externalCitation: `Félix María de Samaniego, *Fábulas morales* (1781): la fábula como instrumento para educar el gusto y la moral del lector español.`,
  },

  // ── SAMANIEGO ─────────────────────────────────────────────────────────────
  {
    slug: "el-zorro-y-el-cuervo",
    content: `La fábula del Zorro y el Cuervo viene directamente de La Fontaine (II, 13), que a su vez la tomó de Esopo. Samaniego la adapta al español con una moraleja clara: la adulación es el arma del débil astuto contra el poderoso vanidoso. Iriarte, su rival literario, también adapta fábulas con moraleja literaria —criticando a los malos escritores—; Samaniego prefiere las moralejas morales. Los dos fabulistas del siglo XVIII español son los dos polos del género: Iriarte el crítico literario, Samaniego el moralista social.`,
    externalCitation: `Tomás de Iriarte, *Fábulas literarias* (1782): «El burro flautista» — la crítica a quien produce arte por accidente, no por talento. Rival y complemento de Samaniego.`,
  },

  // ── MORATÍN ───────────────────────────────────────────────────────────────
  {
    slug: "la-comedia-nueva-disparates",
    content: `La crítica de Moratín al teatro barroco en *La comedia nueva* apunta directamente a la herencia de Lope de Vega: el teatro que mezcla géneros, ignora las unidades clásicas y busca el aplauso fácil del vulgo antes que la verdad artística. Lope de Vega había proclamado en su *Arte nuevo de hacer comedias* (1609) que rompía las normas clásicas a propósito para dar al público lo que pedía. Moratín, ilustrado, responde que eso no es arte sino comercio: el buen teatro educa, no solo entretiene.`,
    externalCitation: `Lope de Vega, *Arte nuevo de hacer comedias en este tiempo* (1609): «Cuando he de escribir una comedia, / encierro los preceptos con seis llaves» — la declaración de independencia del teatro barroco respecto a las reglas clásicas que Moratín querría restaurar.`,
  },

  // ── ARROYAL ───────────────────────────────────────────────────────────────
  {
    slug: "arroyal-casa-vieja",
    content: `La metáfora de Arroyal —España como «casa vieja» que no puede reformarse sin tirarse abajo— es la más radical de todas las propuestas ilustradas: ni Feijoo, ni Jovellanos, ni Cadalso llegaron a plantear que la reforma era imposible sin destrucción previa. Arroyal anticipa la sensibilidad prerrevolucionaria que culminará en la crisis de 1808: el Antiguo Régimen no se puede reformar desde dentro. Jovellanos sería prisionero de la Inquisición en 1801; Cadalso había muerto en 1782 en el sitio de Gibraltar. La ilustración española termina mal.`,
    externalCitation: `Gaspar Melchor de Jovellanos, preso en el castillo de Bellver (Mallorca, 1801-1808) por orden del valido Godoy: el ilustrado que quiso reformar el sistema desde dentro, destruido por ese mismo sistema.`,
  },

  // ── ROSALÍA DE CASTRO ─────────────────────────────────────────────────────
  {
    slug: "adios-rios-adios-fontes",
    content: `El poema de despedida de Rosalía dialoga en sordina con la Rima LIII de Bécquer: «Volverán las oscuras golondrinas / en tu balcón sus nidos a colgar, / [...] / pero aquellas que el vuelo refrenaban / tu hermosura y mi dicha al contemplar, / aquéllas no volverán». Bécquer lamenta lo que no volverá; Rosalía lamenta lo que ella abandona. La diferencia es fundamental: en Bécquer el sujeto es masculino y lamenta la pérdida del amor; en Rosalía el sujeto es femenino y lamenta el exilio de la tierra. El paisaje es el amor para Rosalía.`,
    externalCitation: `Gustavo Adolfo Bécquer, *Rima LIII* (1871): «Volverán las oscuras golondrinas / en tu balcón sus nidos a colgar...» — la vuelta de la naturaleza que contrasta con la pérdida irreversible del amor.`,
  },
  {
    slug: "las-literatas-carta-a-eduarda",
    content: `Rosalía de Castro reivindica en este texto el derecho de la mujer a escribir y ser reconocida como escritora, en la misma línea que Ana Caro de Mallén dos siglos antes: «Sola y sin maestro me aventuré a hacer comedias». Ambas escritoras —una barroca, otra romántica— comparten la misma experiencia de un mundo literario que excluye a las mujeres y las obliga a justificar su existencia como autoras. María de Zayas también reclamó ese espacio en sus novelas: la tradición de la mujer escritora española es más larga y combativa de lo que suele reconocerse.`,
    externalCitation: `Ana Caro de Mallén, *Contexto de las reales fiestas...* (1637): «Yo, que me puse a escribir esto por mandado ajeno...» — la autora que escribe pero se excusa de haberlo hecho, como Rosalía tres siglos después.`,
  },
  {
    slug: "yo-no-se-lo-que-busco",
    content: `La búsqueda de un objeto indefinido e inalcanzable —«algo que no sé lo que es» — conecta a Rosalía con Bécquer en la misma corriente del Romanticismo tardío español. Bécquer escribió: «¿Qué es poesía? Y tú me lo preguntas. / Poesía eres tú.» La respuesta de Bécquer es personal y concreta (la amada); la de Rosalía es abstracta e irresoluble (algo sin nombre). Ambos son poetas del deseo sin objeto, del anhelo sin destino —pero Rosalía convierte esa indefinición en programa existencial, no en halago sentimental.`,
    externalCitation: `Gustavo Adolfo Bécquer, *Rima XXI* (1871): «¿Qué es poesía?, dices mientras clavas / en mi pupila tu pupila azul; / ¡Qué es poesía! ¿Y tú me lo preguntas? / Poesía... eres tú.»`,
  },
];

async function main() {
  const slugs = ENTRIES.map(e => e.slug);
  const frags = await prisma.fragment.findMany({
    where: { slug: { in: slugs } },
    select: { id: true, slug: true, text: true },
  });
  const bySlug = Object.fromEntries(frags.map(f => [f.slug, f]));

  for (const entry of ENTRIES) {
    const f = bySlug[entry.slug];
    if (!f) {
      console.error(`  ✗ slug no encontrado: ${entry.slug}`);
      fail++;
      continue;
    }
    const needle = firstLine(f.text);
    await addInter(f.slug, f.text, f.id, needle, entry.content, entry.externalCitation);
    if (ok > 0 && fail === 0) process.stdout.write(`  ✓ ${entry.slug}\n`);
    else if (fail > 0) console.log(`  ✗ ${entry.slug} (fallo ${fail})`);
  }

  console.log(`\n✅ intertextualidad: ${ok} creadas, ${fail} fallos.`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
