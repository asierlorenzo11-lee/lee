import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const p = new PrismaClient({ adapter });

function anchor(text: string, needle: string) {
  const s = text.indexOf(needle);
  if (s === -1) { console.warn(`  ⚠ anchor not found: "${needle.substring(0, 40)}"`); return null; }
  return { anchorStart: s, anchorEnd: s + needle.length };
}
type AnnInput = { type: string; needle?: string; content: string };
function makeAnns(text: string, anns: AnnInput[]) {
  return anns.map((a, i) => {
    const pos = a.needle ? anchor(text, a.needle) : null;
    return { type: a.type, anchorStart: pos?.anchorStart ?? null, anchorEnd: pos?.anchorEnd ?? null, content: a.content, order: i };
  });
}

async function addFrag(workId: number, data: {
  slug: string; title: string; headline: string; location: string; text: string; order: number;
}, anns: AnnInput[]) {
  const exists = await p.fragment.findFirst({ where: { slug: data.slug } });
  if (exists) { console.log(`  skip ${data.slug}`); return exists; }
  const f = await p.fragment.create({ data: { ...data, status: "published", workId, artworkImageUrl: null } });
  for (const ann of makeAnns(data.text, anns)) {
    await p.annotation.create({ data: { ...ann, fragmentId: f.id } });
  }
  console.log(`  ✓ ${data.slug}`);
  return f;
}

async function getWork(slug: string) {
  const w = await p.work.findFirst({ where: { slug }, select: { id: true, fragments: { select: { order: true }, orderBy: { order: "desc" }, take: 1 } } });
  if (!w) throw new Error(`Work not found: ${slug}`);
  return { id: w.id, nextOrder: (w.fragments[0]?.order ?? -1) + 1 };
}

async function main() {
  // ── 1. LOPE: nuevos sonetos en Rimas humanas ─────────────────────────────
  console.log("\n=== Lope de Vega – Rimas humanas ===");
  const lRimas = await getWork("rimas-humanas");

  const txt_ir_y_quedarse = `Ir y quedarse, y con quedar partirse,
partir sin alma, e ir con alma ajena,
oír la dulce voz de una sirena
y no poder del árbol desasirse;

arder como la vela y consumirse,
haciendo torres sobre tierra arena;
caer de un cielo, y ser demonio en pena,
y de serlo jamás arrepentirse;

hablar entre las mudas soledades,
pedir prestada sobre fe paciencia,
y lo que es temporal llamar eterno;

creer sospechas y negar verdades,
es lo que llaman en el mundo ausencia,
fuego en el alma, y en la vida infierno.`;
  await addFrag(lRimas.id, {
    slug: "ir-y-quedarse-soneto-ausencia",
    title: "Soneto de la ausencia",
    headline: "Fuego en el alma, y en la vida infierno",
    location: "Rimas humanas · Soneto",
    text: txt_ir_y_quedarse,
    order: lRimas.nextOrder,
  }, [
    { type: "glosa", needle: "partir sin alma, e ir con alma ajena", content: "Paradoja del amante que se marcha pero deja el alma con la amada: la ausencia rompe la unidad del ser." },
    { type: "glosa", needle: "fuego en el alma, y en la vida infierno", content: "Los dos últimos versos son la definición conclusiva de la ausencia: no ya una situación externa, sino un estado interno de sufrimiento total." },
    { type: "contexto", content: "Soneto de Lope de Vega incluido en las Rimas humanas (1602). Desarrolla el tema de la ausencia amorosa como una experiencia paradójica y contradictoria, típica del Barroco." },
    { type: "figura", needle: "caer de un cielo, y ser demonio en pena", content: "Antítesis: el amante pasa del cielo (la presencia amada) al infierno (la ausencia). La imagen religiosa intensifica el dolor." },
    { type: "figura", needle: "oír la dulce voz de una sirena\ny no poder del árbol desasirse", content: "Alusión mitológica: Ulises atado al mástil para no sucumbir al canto de las sirenas. El amante tampoco puede resistir ni huir del amor." },
    { type: "figura", needle: "haciendo torres sobre tierra arena", content: "Imagen del castillo de arena: símbolo de la vanidad y la fragilidad de cualquier construcción sin fundamento sólido." },
    { type: "pregunta", content: "¿Qué recursos retóricos contradictorios emplea Lope para describir la ausencia en los dos cuartetos?" },
    { type: "pregunta", needle: "creer sospechas y negar verdades", content: "¿Cómo refleja este verso la irracionalidad del enamorado? ¿Qué tiene que ver con el tema de la ausencia?" },
    { type: "intertextualidad", content: "Compara este soneto con 'Desmayarse, atreverse, estar furioso' del mismo autor. Ambos emplean la acumulación de paradojas para definir el amor: ¿hay diferencias en el tono o el enfoque?" },
  ]);

  const txt_sauces = `Estos los sauces son y esta la fuente,
los montes estos, y esta la ribera
donde vi de mi sol la vez primera
los bellos ojos, la serena frente.

Este es el río humilde y la corriente,
y esta la cuarta y verde primavera
que esmalta el campo alegre y reverbera
en el dorado Toro el sol ardiente.

Árboles, ya mudó su fe constante…
Mas, ¡oh gran desvarío!, que este llano,
entonces monte le dejé sin duda.

Luego no será justo que me espante,
que mude parecer el pecho humano,
pasando el tiempo que los montes muda.`;
  await addFrag(lRimas.id, {
    slug: "estos-los-sauces-son",
    title: "Soneto de la naturaleza",
    headline: "El tiempo que los montes muda",
    location: "Rimas humanas · Soneto",
    text: txt_sauces,
    order: lRimas.nextOrder + 1,
  }, [
    { type: "glosa", needle: "Estos los sauces son y esta la fuente", content: "Apertura anafórica que sitúa al poeta en el mismo paisaje del encuentro amoroso: la naturaleza como escenario de la memoria." },
    { type: "glosa", needle: "pasando el tiempo que los montes muda", content: "Verso conclusivo: si el tiempo puede mudar hasta los montes, no debe sorprender que mude también el corazón humano." },
    { type: "contexto", content: "Soneto incluido en Rimas humanas (1602). El poeta regresa al lugar donde conoció a su amada y descubre que la naturaleza misma ha cambiado, lo que le sirve como reflexión sobre la mutabilidad del amor y del tiempo." },
    { type: "figura", needle: "vi de mi sol la vez primera", content: "Metáfora petrarquista: la amada como 'sol' que ilumina al poeta. Convención del amor cortés que Lope emplea con naturalidad." },
    { type: "figura", needle: "esmalta el campo alegre y reverbera\nen el dorado Toro el sol ardiente", content: "Referencia astrológica: el sol está en la constelación de Tauro (Toro), lo que indica primavera. El adjetivo 'dorado' une al sol con la amada." },
    { type: "pregunta", content: "¿Qué elementos del locus amoenus (lugar ameno) describe Lope en los cuartetos? ¿Cuál es su función en el poema?" },
    { type: "pregunta", needle: "Árboles, ya mudó su fe constante", content: "El poeta reprocha a los árboles haber cambiado. ¿Qué ironía hay en este reproche? ¿Qué descubrimiento le provoca?" },
    { type: "intertextualidad", content: "Compara el uso de la naturaleza en este soneto con los sonetos de Garcilaso de la Vega. ¿Qué diferencias hay en el tratamiento del paisaje entre el Renacimiento y el Barroco?" },
  ]);

  const txt_juanilla = `Muérome por llamar Juanilla a Juana,
que son de tierno amor afectos vivos,
y la cruel, con ojos fugitivos,
hace papel de yegua galiciana.

Pues Juana, agora que eres flor temprana
admite los requiebros primitivos,
porque no vienen bien diminutivos
después que una persona se avellana.

Para advertir tu condición extraña,
más de alguna Juanaza de la villa
del engaño en que estás te desengaña.

Créeme, Juana, y llámate Juanilla;
mira que la mejor parte de España
pudiendo Casta se llamó Castilla.`;
  await addFrag(lRimas.id, {
    slug: "muerome-por-llamar-juanilla",
    title: "Soneto a Juanilla",
    headline: "Muérome por llamar Juanilla a Juana",
    location: "Rimas humanas · Soneto burlesco",
    text: txt_juanilla,
    order: lRimas.nextOrder + 2,
  }, [
    { type: "glosa", needle: "admite los requiebros primitivos", content: "El poeta aconseja a Juana que acepte los piropos ahora que es joven ('flor temprana'), pues el tiempo de la belleza es fugaz." },
    { type: "glosa", needle: "pudiendo Casta se llamó Castilla", content: "Juego de palabras final: Castilla eligió ese nombre siendo 'Casta', igual que Juana debería elegir llamarse Juanilla para parecer más joven y coqueta." },
    { type: "contexto", content: "Soneto humorístico de Lope de Vega que desarrolla el tópico del carpe diem con tono burlesco y popular. El poeta aconseja a la altiva Juana que aproveche su juventud." },
    { type: "figura", needle: "hace papel de yegua galiciana", content: "Comparación cómica y degradante: la yegua gallega era conocida por ser difícil y poco dócil. Lope compara a la esquiva Juana con ella para burlarse de su altivez." },
    { type: "figura", needle: "después que una persona se avellana", content: "Metáfora burlesca: 'avellanarse' significa arrugarse y envejecer, como una avellana que se seca. El tono cómico desmitifica el carpe diem serio." },
    { type: "pregunta", content: "¿Qué tópico literario desarrolla Lope en este poema? ¿Cómo lo transforma con el tono humorístico?" },
    { type: "intertextualidad", content: "Compara el tratamiento del carpe diem en este soneto con el de Góngora en 'Mientras por competir con tu cabello'. ¿Cuál es más serio? ¿Cuál más efectivo?" },
  ]);

  // ── 2. GÓNGORA: nuevos sonetos ──────────────────────────────────────────
  console.log("\n=== Góngora – Sonetos ===");
  const gSon = await getWork("sonetos-gongora");

  const txt_templo_sagrado = `De pura honestidad templo sagrado,
cuyo bello cimiento y gentil muro
de blanco nácar y alabastro duro
fue por divina mano fabricado;

pequeña puerta de coral preciado,
claras lumbreras de mirar seguro,
que a la esmeralda fina el verde puro
habéis para viriles usurpado;

soberbio techo, cuyas cimbrias de oro
al claro sol, en cuanto en torno gira,
ornan de luz, coronan de belleza;

ídolo bello, a quien humilde adoro.
oye piadoso al que por ti suspira,
tus himnos canta, y tus virtudes reza.`;
  await addFrag(gSon.id, {
    slug: "de-pura-honestidad-templo-sagrado",
    title: "Soneto de la descriptio puellae",
    headline: "De pura honestidad templo sagrado",
    location: "Sonetos · Descriptio puellae",
    text: txt_templo_sagrado,
    order: gSon.nextOrder,
  }, [
    { type: "glosa", needle: "De pura honestidad templo sagrado", content: "Metáfora estructurante: el cuerpo de la amada se presenta como un templo, símbolo de pureza y sacralidad. Toda la descriptio puellae se organiza como una arquitectura religiosa." },
    { type: "glosa", needle: "ídolo bello, a quien humilde adoro", content: "El segundo terceto revela la actitud del poeta: adoración cuasi-religiosa ante la belleza. El término 'ídolo' implica que el amor ha sustituido a la fe en algo más elevado." },
    { type: "contexto", content: "Soneto de Luis de Góngora que desarrolla la descriptio puellae —descripción tópica de la belleza femenina— mediante una extensa metáfora arquitectónica y religiosa. Cada parte del cuerpo de la amada se corresponde con un elemento del templo." },
    { type: "figura", needle: "pequeña puerta de coral preciado", content: "Metáfora: la boca es la 'pequeña puerta de coral'; los labios rojos = coral. Parte del sistema metafórico que equipara el cuerpo con materiales preciosos (nácar, alabastro, esmeralda, oro)." },
    { type: "figura", needle: "claras lumbreras de mirar seguro", content: "Los ojos son las 'lumbreras' (ventanas) del templo. La expresión 'de mirar seguro' alude a su claridad y honestidad: no son ojos peligrosos sino tranquilizadores." },
    { type: "figura", needle: "soberbio techo, cuyas cimbrias de oro", content: "El cabello rubio es el 'techo' con 'cimbrias de oro'. Esta traslación de lo corporal a lo arquitectónico es el núcleo estilístico del poema." },
    { type: "pregunta", content: "Identifica en el poema las distintas partes del cuerpo de la amada y las metáforas arquitectónicas que Góngora usa para describirlas." },
    { type: "pregunta", needle: "oye piadoso al que por ti suspira,\ntus himnos canta, y tus virtudes reza", content: "¿Por qué resulta chocante que el poeta 'rece' a la amada? ¿Qué dice esto sobre la actitud barroca ante el amor y la belleza?" },
    { type: "intertextualidad", content: "Compara esta descriptio puellae con la del soneto XXIII de Garcilaso ('En tanto que de rosa y azucena'). ¿En qué se diferencia el tratamiento gongorino de la belleza femenina?" },
  ]);

  const txt_dulce_boca = `La dulce boca que a gustar convida
un humor entre perlas destilado,
y a no envidiar aquel licor sagrado
que a Júpiter ministra el garzón de Ida,

amantes, no toquéis, si queréis vida,
porque entre un labio y otro colorado
Amor está, de su veneno armado,
cual entre flor y flor sierpe escondida.

Nos os engañen las rosas que a la Aurora
diréis que, aljofaradas y olorosas
se le cayeron del purpúreo seno;

manzanas son de Tántalo y no rosas,
que después huyen del que incitan ahora,
y sólo del Amor queda el veneno.`;
  await addFrag(gSon.id, {
    slug: "la-dulce-boca-que-a-gustar-convida",
    title: "Consejo a los amantes",
    headline: "La dulce boca que a gustar convida",
    location: "Sonetos · Amor y engaño",
    text: txt_dulce_boca,
    order: gSon.nextOrder + 1,
  }, [
    { type: "glosa", needle: "amantes, no toquéis, si queréis vida", content: "Vuelta del tópico: en vez del habitual carpe diem ('goza mientras puedas'), Góngora invierte el consejo: no toques los labios de la amada porque el amor es veneno." },
    { type: "glosa", needle: "manzanas son de Tántalo y no rosas", content: "Referencia al mito de Tántalo, condenado a ver y no alcanzar lo que desea. La belleza de la amada, como las manzanas de Tántalo, es inasequible o engañosa." },
    { type: "contexto", content: "Soneto de Góngora que invierte el tópico del carpe diem: en vez de animar al goce de la belleza, advierte del peligro oculto en la dulce boca de la amada. La hermosura se convierte en trampa." },
    { type: "figura", needle: "Amor está, de su veneno armado,\ncual entre flor y flor sierpe escondida", content: "Imagen de la serpiente oculta entre flores: metáfora del engaño amoroso. Lo bello esconde el peligro, como la belleza de la amada oculta el dolor del amor." },
    { type: "figura", needle: "el garzón de Ida", content: "Referencia mitológica a Ganimedes, el joven pastor del monte Ida raptado por Zeus para ser copero de los dioses. Sus labios servirían néctar a Júpiter, igual que los de la amada." },
    { type: "pregunta", content: "¿En qué consiste la paradoja central del poema? ¿Por qué Góngora aconseja NO tocar la boca de la amada?" },
    { type: "pregunta", needle: "y sólo del Amor queda el veneno", content: "¿Cuál es la visión final del amor que propone el último verso? ¿Es pesimista o realista?" },
    { type: "intertextualidad", content: "Este soneto puede leerse como una inversión del carpe diem. Compáralo con el de Góngora 'Mientras por competir con tu cabello'. ¿Qué diferente actitud tiene el poeta ante la belleza en cada uno?" },
  ]);

  // ── 3. GÓNGORA: soneto burlesco en Sátiras ──────────────────────────────
  console.log("\n=== Góngora – Sátiras ===");
  const gSat = await getWork("satiras-gongora");

  const txt_bermejazo = `Bermejazo platero de las cumbres,
a cuya luz se espulga la canalla,
la ninfa Dafne, que se afufa y calla,
si la quieres gozar, paga y no alumbres.

Si quieres ahorrar de pesadumbres,
ojos del cielo, trata de compralla:
en confites gastó Marte la malla
y la espada en pasteles y en azumbres.

Volvióse en bolsa Júpiter severo;
levantóse las faldas la doncella
por recogerle en lluvia de dinero.

Astucia fue de alguna dueña estrella
que de estrella sin dueña no lo infiero:
Febo, pues eres sol, sírvete de ella.`;
  await addFrag(gSat.id, {
    slug: "bermejazo-platero-de-las-cumbres",
    title: "Soneto burlesco a Apolo y Dafne",
    headline: "Bermejazo platero de las cumbres",
    location: "Sátiras · Soneto burlesco",
    text: txt_bermejazo,
    order: gSat.nextOrder,
  }, [
    { type: "glosa", needle: "Bermejazo platero de las cumbres", content: "Apelativo burlesco para Apolo: 'bermejazo' (rojizo, por el cabello rubio del dios) y 'platero de las cumbres' (el sol que da brillo a los montes). El tono degradante es inmediato." },
    { type: "glosa", needle: "Febo, pues eres sol, sírvete de ella", content: "Consejo final: si Apolo es el sol, que use su poder económico para conseguir a Dafne. La mitología queda reducida a una transacción mercantil." },
    { type: "contexto", content: "Soneto burlesco de Góngora basado en el mito de Apolo y Dafne: el dios persigue a la ninfa, que huye y es transformada en laurel. Góngora lo transforma en una sátira misógina sobre el poder del dinero en las relaciones." },
    { type: "figura", needle: "Volvióse en bolsa Júpiter severo;\nlevantóse las faldas la doncella\npor recogerle en lluvia de dinero", content: "Alusión al mito de Dánae: Zeus se convirtió en lluvia de oro para yacer con ella. Góngora lo usa para sugerir que cualquier mujer cede ante el dinero." },
    { type: "figura", needle: "la ninfa Dafne, que se afufa y calla", content: "Dafne huye en silencio ('se afufa' = huye en germanía picaresca). La jerga popular degrada el mito clásico hasta el nivel de la calle." },
    { type: "pregunta", content: "¿Qué mitos clásicos aparecen en el poema además del de Apolo y Dafne? ¿Cómo los usa Góngora para construir su argumento?" },
    { type: "pregunta", content: "¿Cuál es el tono general del poema? ¿Con qué palabras y recursos consigue Góngora ese efecto burlesco?" },
    { type: "intertextualidad", content: "Compara este tratamiento burlesco de la mitología con el uso serio que hace Góngora en la Fábula de Polifemo y Galatea. ¿Qué dice esa diferencia sobre la versatilidad del Barroco?" },
  ]);

  // ── 4. QUEVEDO: nuevos sonetos en El Parnaso español ────────────────────
  console.log("\n=== Quevedo – El Parnaso español ===");
  const qPar = await getWork("el-parnaso-espanol");

  const txt_fue_sueno = `¡Fue sueño ayer: mañana será tierra!
¡Poco antes, nada; y poco después, humo!
¡Y destino ambiciones, y presumo
apenas punto al cerco que me cierra!

Breve combate de importuna guerra,
en mi defensa, soy peligro sumo;
y mientras con mis armas me consumo,
menos me hospeda el cuerpo, que me entierra.

Ya no es ayer; mañana no ha llegado;
hoy pasa, y es, y fue, con movimiento
que a la muerte me lleva despeñado.

Azadas son la hora y el momento
que, a jornal de mi pena y mi cuidado,
cavan en mi vivir mi monumento.`;
  await addFrag(qPar.id, {
    slug: "fue-sueno-ayer-manana-sera-tierra",
    title: "Soneto del tempus fugit",
    headline: "¡Fue sueño ayer: mañana será tierra!",
    location: "El Parnaso español · Poemas morales",
    text: txt_fue_sueno,
    order: qPar.nextOrder,
  }, [
    { type: "glosa", needle: "¡Fue sueño ayer: mañana será tierra!", content: "Verso sentencioso que condensa toda la meditación sobre el tiempo: el pasado fue ilusión, el futuro será muerte. La exclamación transmite la intensidad de la conciencia de la finitud." },
    { type: "glosa", needle: "cavan en mi vivir mi monumento", content: "Imagen potente: la hora y el momento son 'azadas' que cavan la tumba en el propio vivir. El tiempo no pasa, excava." },
    { type: "contexto", content: "Soneto moral de Quevedo sobre el tempus fugit: la brevedad de la vida y la cercanía de la muerte. Forma parte del conjunto de poemas filosóficos que reflexionan sobre la condición humana desde el desengaño barroco." },
    { type: "figura", needle: "¡Poco antes, nada; y poco después, humo!", content: "Gradación descendente: nada → sueño → tierra → humo. La vida es apenas un instante entre dos nadas." },
    { type: "figura", needle: "menos me hospeda el cuerpo, que me entierra", content: "Paradoja terrible: el propio cuerpo no 'hospeda' (acoge, da vida) sino que ya 'entierra' al yo poético. El cuerpo es también sepulcro." },
    { type: "figura", needle: "hoy pasa, y es, y fue, con movimiento\nque a la muerte me lleva despeñado", content: "Los tres tiempos verbales (pasa, es, fue) se funden en un solo movimiento que conduce a la muerte. El tiempo no tiene pausas: despeña." },
    { type: "pregunta", content: "¿Qué antítesis aparecen en el primer cuarteto? ¿Qué idea transmiten sobre la naturaleza del tiempo?" },
    { type: "pregunta", content: "¿Cómo refleja el primer terceto el tópico del tempus fugit mediante el uso de los verbos y los adverbios de tiempo?" },
    { type: "intertextualidad", content: "Compara este soneto con las Coplas de Jorge Manrique ('Nuestras vidas son los ríos...'). ¿Cómo difiere el tratamiento del paso del tiempo entre el siglo XV y el Barroco?" },
  ]);

  const txt_ah_de_la_vida = `"¡Ah de la vida!" ¿Nadie me responde?
¡Aquí de los antaños que he vivido!
La Fortuna mis tiempos ha mordido,
las Horas mi locura las esconde.

¡Que sin poder saber cómo ni adónde
la Salud y la Edad se hayan huido!
Falta la vida, asiste lo vivido,
y no hay calamidad que no me ronde.

Ayer se fue; Mañana no ha llegado;
Hoy se está yendo sin parar un punto;
soy un fue, y un seré, y un es cansado.

En el Hoy y Mañana y Ayer, junto
pañales y mortaja, y he quedado
presentes sucesiones de difunto.`;
  await addFrag(qPar.id, {
    slug: "ah-de-la-vida-nadie-me-responde",
    title: "¡Ah de la vida!",
    headline: "¡Ah de la vida! ¿Nadie me responde?",
    location: "El Parnaso español · Poemas morales",
    text: txt_ah_de_la_vida,
    order: qPar.nextOrder + 1,
  }, [
    { type: "glosa", needle: "soy un fue, y un seré, y un es cansado", content: "El yo poético se identifica con los tres tiempos: 'fue' (pasado), 'seré' (futuro) y 'es' (presente cansado). La vida no es sino sucesión de tiempos que se agota." },
    { type: "glosa", needle: "pañales y mortaja, y he quedado\npresentes sucesiones de difunto", content: "Imagen de radical condensación: el nacimiento (pañales) y la muerte (mortaja) se unen en el presente. El poeta ya es una 'sucesión de difuntos': cada etapa de su vida ha muerto." },
    { type: "contexto", content: "Soneto filosófico de Quevedo sobre la fugacidad del tiempo. El poeta se pregunta por el sentido de la vida y constata que el tiempo se escapa sin que podamos asirlo. Relacionado con una carta a su amigo en que afirma: 'Mi infancia murió irrevocablemente; murió mi niñez, murió mi juventud...'." },
    { type: "figura", needle: "La Fortuna mis tiempos ha mordido", content: "Personificación: la Fortuna 'muerde' el tiempo del poeta. El tiempo no simplemente pasa: es devorado por una fuerza hostil." },
    { type: "figura", needle: "Ayer se fue; Mañana no ha llegado", content: "Quiasmo temporal y antítesis: el ayer ya no existe, el mañana aún no existe. Solo queda el hoy, que también se va." },
    { type: "pregunta", content: "¿A quién dirige Quevedo su saludo inicial ('¡Ah de la vida!')?  ¿Cuál es la respuesta que recibe?" },
    { type: "pregunta", content: "¿Qué cuatro elementos personificados aparecen en el primer cuarteto? ¿Qué dice Quevedo de cada uno?" },
    { type: "intertextualidad", content: "Este soneto es un ejemplo del desengaño barroco. ¿Cómo se relaciona con el concepto de 'vanitas vanitatum' del Eclesiastés bíblico? ¿Qué añade Quevedo a esa tradición?" },
  ]);

  const txt_muros_patria = `¡Miré los muros de la patria mía,
si un tiempo fuertes, ya desmoronados,
de la carrera de la edad cansados
por quien caduca ya su valentía.

Salíme al campo, vi que el sol bebía
los arroyos, del hielo desatados,
y del monte quejosos los ganados,
que con sombras hurtó su luz al día.

Entré en mi casa; vi que, amancillada,
de anciana habitación era despojos;
mi báculo, más corvo y menos fuerte;

vencida de la edad sentí mi espada.
Y no hallé cosa en que poner los ojos
que no fuese recuerdo de la muerte.`;
  await addFrag(qPar.id, {
    slug: "mire-los-muros-de-la-patria-mia",
    title: "Miré los muros de la patria mía",
    headline: "No hallé cosa en que poner los ojos / que no fuese recuerdo de la muerte",
    location: "El Parnaso español · Poemas morales",
    text: txt_muros_patria,
    order: qPar.nextOrder + 2,
  }, [
    { type: "glosa", needle: "Y no hallé cosa en que poner los ojos\nque no fuese recuerdo de la muerte", content: "Verso conclusivo de gran fuerza: todo cuanto mira el poeta —los muros, el campo, su casa— se convierte en símbolo de la muerte. La mirada se vuelve memento mori." },
    { type: "glosa", needle: "¡Miré los muros de la patria mía,\nsi un tiempo fuertes, ya desmoronados", content: "El poema comienza con la mirada: los muros derruidos de España son la primera imagen del tiempo que destruye todo lo que fue fuerte." },
    { type: "contexto", content: "Soneto de Quevedo que introduce el 'tema de España' en la poesía española: la reflexión sobre la decadencia del país. Pero al mismo tiempo es un poema intimista sobre el envejecimiento personal, en el que el mundo exterior refleja el estado interior del poeta." },
    { type: "figura", needle: "vencida de la edad sentí mi espada", content: "Hipálage sutil: no es el poeta quien está 'vencido' sino la espada. La derrota del tiempo se proyecta sobre los objetos del poeta." },
    { type: "figura", needle: "vi que el sol bebía / los arroyos, del hielo desatados", content: "El sol que 'bebe' los arroyos: imagen del tiempo como devorador universal. El agua que fluye (símbolo del tiempo en Manrique) es absorbida por el calor." },
    { type: "pregunta", content: "El poema recorre tres espacios: los muros de la patria, el campo y la casa. ¿Qué encuentra Quevedo en cada uno? ¿Qué tienen en común?" },
    { type: "pregunta", content: "¿Cuál es la relación entre la decadencia de España y el envejecimiento personal del poeta? ¿Son lo mismo o son paralelos?" },
    { type: "intertextualidad", content: "Compara este soneto con las Coplas a la muerte de su padre de Jorge Manrique. ¿Qué semejanzas y diferencias hay en la forma de abordar el paso del tiempo y la muerte?" },
  ]);

  // ── 5. QUEVEDO: nuevos poemas en Obras poéticas ─────────────────────────
  console.log("\n=== Quevedo – Obras poéticas ===");
  const qObras = await getWork("obras-poeticas-quevedo");

  const txt_hielo_abrasador = `Es hielo abrasador, es fuego helado,
es herida que duele y no se siente,
es un soñado bien, un mal presente,
es un breve descanso muy cansado,

es un descuido que nos da cuidado,
un cobarde con nombre de valiente,
un andar solitario entre la gente,
un amar solamente ser amado,

es una libertad encadenada
que dura hasta el postrero paroxismo,
enfermedad que crece si es curada.

Este es el niño Amor, este es su abismo:
¡mirad cuál amistad tendrá con nada
el que en todo es contrario de sí mismo!`;
  await addFrag(qObras.id, {
    slug: "es-hielo-abrasador-es-fuego-helado",
    title: "Definición del amor (Quevedo)",
    headline: "Es hielo abrasador, es fuego helado",
    location: "Obras poéticas · Soneto",
    text: txt_hielo_abrasador,
    order: qObras.nextOrder,
  }, [
    { type: "glosa", needle: "Es hielo abrasador, es fuego helado", content: "El primer verso es una antítesis perfecta que resume toda la lógica del poema: el amor es paradoja pura. El oxímoron 'hielo abrasador / fuego helado' condensa la experiencia contradictoria del amor." },
    { type: "glosa", needle: "Este es el niño Amor, este es su abismo:\n¡mirad cuál amistad tendrá con nada\nel que en todo es contrario de sí mismo!", content: "Conclusión brillante: el Amor es 'contrario de sí mismo' porque en él todo se contradice. La pregunta retórica final cierra el poema con un matiz filosófico sobre la naturaleza del amor." },
    { type: "contexto", content: "Soneto de Quevedo que, como Lope de Vega, intenta definir el amor a través de paradojas y antítesis. Es uno de los grandes ejemplos del conceptismo barroco: el ingenio al servicio de la reflexión sobre los sentimientos." },
    { type: "figura", needle: "un cobarde con nombre de valiente", content: "Paradoja sobre el amante: se llama valiente pero es cobarde ante el amor. Las máscaras sociales ocultan la realidad del sentimiento." },
    { type: "figura", needle: "enfermedad que crece si es curada", content: "Paradoja médica: el amor es una enfermedad que empeora con el remedio. Puede referirse a que la correspondencia amorosa —su 'cura'— intensifica el sufrimiento en vez de aliviarlo." },
    { type: "pregunta", content: "¿Qué recursos retóricos usa Quevedo para mostrar el carácter contradictorio del amor? Identifica al menos tres antítesis o paradojas y explícalas." },
    { type: "pregunta", content: "Compara este soneto con el de Lope 'Desmayarse, atreverse, estar furioso'. ¿Cuál te parece más conceptista? ¿Por qué?" },
    { type: "intertextualidad", content: "La definición del amor mediante paradojas viene de Petrarca. ¿Qué diferencias percibes entre el tratamiento petrarquista (siglo XIV) y el barroco de Quevedo de este tópico?" },
  ]);

  const txt_vida_lagrimas = `La vida empieza entre lágrimas y caca,
luego viene la mu, con mama y coco,
síguense las viruelas, baba y moco,
y luego llega el trompo y la matraca.

En creciendo, la amiga y la sonsaca,
con ella embiste el apetito loco;
en subiendo a mancebo, todo es poco,
y después la intención peca en bellaca.

Llega a ser hombre y todo lo trabuca,
soltero sigue toda perendeca,
casado se convierte en mala cuca.

Viejo encanece, arrúgase y se seca:
llega la muerte, y todo lo bazuca,
y lo que deja paga, y lo que peca.`;
  await addFrag(qObras.id, {
    slug: "la-vida-empieza-entre-lagrimas-y-caca",
    title: "El sentido de la vida (sátira)",
    headline: "La vida empieza entre lágrimas y caca",
    location: "Obras poéticas · Soneto satírico",
    text: txt_vida_lagrimas,
    order: qObras.nextOrder + 1,
  }, [
    { type: "glosa", needle: "La vida empieza entre lágrimas y caca", content: "Comienzo deliberadamente procaz que rompe con la dignidad poética habitual. Quevedo degrada el nacimiento al nivel más bajo para dar tono burlesco a toda la reflexión sobre el ciclo vital." },
    { type: "glosa", needle: "llega la muerte, y todo lo bazuca,\ny lo que deja paga, y lo que peca", content: "La muerte aparece como el gran igualador final: 'bazucar' (remover, revolver) sugiere que la muerte desordena todo lo acumulado en vida. El último verso introduce una nota moral: se paga en el más allá." },
    { type: "contexto", content: "Soneto satírico de Quevedo que recorre las etapas de la vida desde el nacimiento hasta la muerte con tono burlesco e irreverente. Es una versión degradada del tema de las edades del hombre." },
    { type: "figura", needle: "síguense las viruelas, baba y moco", content: "Enumeración caótica de elementos desagradables de la infancia: el humor negro de Quevedo no respeta ningún período de la vida, ni siquiera la inocente infancia." },
    { type: "figura", needle: "Viejo encanece, arrúgase y se seca", content: "Gradación de la vejez en tres verbos: encanece → arrúgase → se seca. La vida se va consumiendo como un objeto que se deteriora, sin ninguna dignidad." },
    { type: "pregunta", content: "Quevedo va describiendo las etapas de la vida. ¿En qué aspectos negativos de cada etapa se centra? ¿Qué visión de la existencia humana transmite?" },
    { type: "pregunta", content: "¿Cuál es la conclusión moral del poema? ¿Hay alguna etapa de la vida que Quevedo presente positivamente?" },
    { type: "intertextualidad", content: "Compara esta visión de las etapas de la vida con el discurso de Jaques en 'Como gustéis' de Shakespeare ('All the world's a stage'). ¿Qué diferencias de tono y perspectiva observas?" },
  ]);

  // ── 6. CALDERÓN: monólogo de la torre ────────────────────────────────────
  console.log("\n=== Calderón – La vida es sueño ===");
  const cVida = await getWork("la-vida-es-sueno");

  const txt_ay_misero = `¡Ay mísero de mí! ¡Y ay infelice!
Apurar, cielos, pretendo
ya que me tratáis así,
qué delito cometí
contra vosotros naciendo;
aunque si nací, ya entiendo
qué delito he cometido.
Bastante causa ha tenido
vuestra justicia y rigor;
pues el delito mayor
del hombre es haber nacido.

Sólo quisiera saber
para ayudar mis desvelos,
(dejando a una parte, cielos,
el delito de nacer)
qué más os pude ofender,
para castigarme más.
¿No nacieron los demás?
Pues si los demás nacieron,
¿qué privilegios tuvieron
que yo no gocé jamás?

Nace el ave, y con las alas
que le dan belleza suma,
apenas es flor de pluma,
o ramillete con alas,
cuando las etéreas salas
corta con velocidad,
negándose a la piedad
del nido que deja en calma:
¿y teniendo yo más alma,
tengo menos libertad?

Nace el bruto, y con la piel
que dibujan manchas bellas,
apenas signo es de estrellas,
gracias al docto pincel,
cuando, atrevido y crüel,
la humana necesidad
le enseña a tener crueldad,
monstruo de su laberinto:
¿y yo con mejor distinto
tengo menos libertad?

Nace el pez, que no respira,
aborto de ovas y lamas,
y apenas bajel de escamas
sobre las ondas se mira,
cuando a todas parte gira,
midiendo la inmensidad
de tanta capacidad
como le da el centro frío:
¿y yo con más albedrío
tengo menos libertad?

Nace el arroyo, culebra
que entre flores se desata,
y apenas, sierpe de plata,
entre las flores se quiebra,
cuando músico celebra
de las flores la piedad
que le dan la majestad,
el campo abierto a su ida:
¿y teniendo yo más vida
tengo menos libertad?

En llegando a esta pasión,
un volcán, un Etna hecho,
quisiera sacar del pecho
pedazos del corazón.
¿Qué ley, justicia o razón
negar a los hombres sabe
privilegio tan süave,
excepción tan principal,
que Dios le ha dado a un cristal,
a un pez, a un bruto y a un ave?`;
  await addFrag(cVida.id, {
    slug: "ay-misero-de-mi-monologotorre",
    title: "Monólogo de la torre",
    headline: "¡Ay mísero de mí! ¿Qué delito cometí contra vosotros naciendo?",
    location: "La vida es sueño · Acto I, escena II",
    text: txt_ay_misero,
    order: cVida.nextOrder,
  }, [
    { type: "glosa", needle: "pues el delito mayor\ndel hombre es haber nacido", content: "Verso clave del monólogo y del teatro barroco: la paradoja de que el mayor crimen sea existir. Segismundo ha nacido y por eso está encerrado. La culpa y la existencia se identifican." },
    { type: "glosa", needle: "¿y teniendo yo más alma,\ntengo menos libertad?", content: "Estribillo estructurante: cada comparación con un ser vivo (ave, bruto, pez, arroyo) termina con esta pregunta retórica. El hombre, con más alma, tiene menos libertad que los seres irracionales." },
    { type: "contexto", content: "Monólogo del primer acto de La vida es sueño (1635) de Calderón de la Barca. El príncipe Segismundo, encadenado en una torre desde su nacimiento por el horóscopo de su padre Basilio, se lamenta de su condición y pregunta a los cielos qué crimen cometió al nacer. Es uno de los grandes monólogos del teatro universal." },
    { type: "figura", needle: "Nace el ave, y con las alas\nque le dan belleza suma", content: "Estructuralmente, las estrofas centrales funcionan por anáfora ('Nace el ave... Nace el bruto... Nace el pez... Nace el arroyo'): cada ser nace libre mientras Segismundo, con más alma, permanece encadenado." },
    { type: "figura", needle: "y apenas, sierpe de plata,\nentre las flores se quiebra", content: "El arroyo como 'sierpe de plata' es una metáfora visual barroca: la sinuosidad del agua serpentea como una culebra entre las flores. La naturaleza tiene libertad de movimiento que al hombre le está negada." },
    { type: "figura", needle: "un volcán, un Etna hecho", content: "Al llegar al límite de su razonamiento, Segismundo explota como un volcán. La imagen del Etna (volcán siciliano) es típica del Barroco para expresar la ira o el dolor desbordado." },
    { type: "pregunta", content: "¿Cuál es la estructura del monólogo? Identifica las diferentes partes y el papel que cumple la pregunta '¿tengo menos libertad?' al final de cada estrofa." },
    { type: "pregunta", content: "Calderón asocia cada ser natural con uno de los cuatro elementos clásicos (aire, agua, tierra, fuego). ¿Cuál corresponde a cada uno? ¿Qué efecto produce esta distribución?" },
    { type: "intertextualidad", content: "Compara este monólogo con el soliloquio de Hamlet ('To be or not to be'). Ambos personajes se preguntan sobre la justicia de la existencia. ¿Qué diferencias filosóficas y culturales hay entre los dos planteamientos?" },
  ]);

  // ── 7. MARÍA DE ZAYAS: La fuerza del amor ────────────────────────────────
  console.log("\n=== María de Zayas – La fuerza del amor ===");
  const mZayas = await getWork("obras-poeticas-maria-de-zayas");

  const txt_fuerza_amor = `¿Dónde se hallará un hombre verdadero? ¿En cuál dura la voluntad de un día, y más si se ven queridos?, que parece que al paso que conocen el amor, crece su libertad y aborrecimiento. ¡Mal haya la mujer que en ellos cree, pues al cabo hallará el pago de su amor, como yo le hallo! ¿Quién es la necia que desea casarse, viendo tan lastimosos ejemplos?, pues la que más piensa que acierta, más yerra.

Mas, ¡ay, que tengo amor, y en lo uno temo perderle, y en lo otro enojarle! ¿Por qué, vanos legisladores del mundo, atáis nuestras manos para las venganzas, imposibilitando nuestras fuerzas con vuestras falsas opiniones, pues nos negáis letras y armas? ¿El alma no es la misma que la de los hombres? Pues si ella es la que da valor al cuerpo, ¿quién obliga a los nuestros a tanta cobardía?

Yo aseguro que si entendierais que también había en nosotras valor y fortaleza, no os burlarais como os burláis; y así, por tenernos sujetas desde que nacemos, vais enflaqueciendo nuestras fuerzas con los temores de la honra, y el entendimiento con el recato de la vergüenza, dándonos por espadas ruecas, y por libros almohadillas.`;
  await addFrag(mZayas.id, {
    slug: "donde-se-hallara-un-hombre-verdadero",
    title: "La fuerza del amor — Laura habla",
    headline: "Por libros almohadillas, por espadas ruecas",
    location: "Novelas amorosas y ejemplares · La fuerza del amor",
    text: txt_fuerza_amor,
    order: mZayas.nextOrder,
  }, [
    { type: "glosa", needle: "dándonos por espadas ruecas, y por libros almohadillas", content: "Imagen-símbolo de la opresión de género: en vez de armas y libros (símbolos del poder y el saber), a las mujeres les dan ruecas (para hilar) y almohadillas (para bordar). La condena es a la domesticidad, no a la ignorancia." },
    { type: "glosa", needle: "¿Por qué, vanos legisladores del mundo, atáis nuestras manos para las venganzas", content: "Invectiva directa contra los 'legisladores del mundo': los hombres que han creado leyes para impedir que las mujeres se defiendan. El tono combativo es excepcional para la época." },
    { type: "contexto", content: "Fragmento de La fuerza del amor (1637), novela corta de María de Zayas y Sotomayor incluida en sus Novelas amorosas y ejemplares. En este parlamento, Laura reflexiona sobre el abandono de su amante y sobre la injusticia que sufren las mujeres en una sociedad dominada por los hombres." },
    { type: "figura", needle: "¿El alma no es la misma que la de los hombres?", content: "Argumento filosófico-teológico: si el alma de la mujer es igual a la del hombre, ¿por qué se le niega el acceso a las letras y las armas? María de Zayas usa el discurso cristiano para cuestionar la desigualdad de género." },
    { type: "figura", needle: "al paso que conocen el amor, crece su libertad y aborrecimiento", content: "Paradoja irónica: cuanto más quiere una mujer a un hombre, más libre y desdeñoso se vuelve él. El amor femenino es desventaja en las relaciones de poder." },
    { type: "pregunta", content: "¿Qué argumentos usa Laura para defender la igualdad entre hombres y mujeres? ¿A qué conclusión llega sobre la causa de la 'cobardía' femenina?" },
    { type: "pregunta", needle: "¿Quién es la necia que desea casarse", content: "¿Cuál es la posición de Laura respecto al matrimonio? ¿Qué dice esto sobre la visión del matrimonio en el siglo XVII?" },
    { type: "intertextualidad", content: "Compara este texto de María de Zayas con los poemas de Ana Caro de Mallén y Sor Juana Inés de la Cruz sobre la condición de la mujer. ¿Hay un 'feminismo barroco'? ¿Qué tienen en común estas escritoras?" },
  ]);

  // ── 8. NUEVA OBRA: Peribáñez y el comendador de Ocaña ───────────────────
  console.log("\n=== NUEVA OBRA: Peribáñez y el comendador de Ocaña ===");
  const lopeAuthor = await p.author.findFirst({ where: { slug: "lope-de-vega" }, select: { id: true } });
  if (!lopeAuthor) throw new Error("Lope de Vega not found");

  let peribañez = await p.work.findFirst({ where: { slug: "peribañez-y-el-comendador-de-ocana" } });
  if (!peribañez) {
    peribañez = await p.work.create({ data: {
      slug: "peribañez-y-el-comendador-de-ocana",
      title: "Peribáñez y el comendador de Ocaña",
      authorId: lopeAuthor.id,
      year: 1614,
      era: "Barroco",
      genre: "comedia de honor",
      synopsis: "Drama del honor que enfrenta al labrador Peribáñez con el comendador Fadrique, señor de Ocaña, que ha puesto sus ojos en Casilda, esposa del labrador. Cuando el comendador intenta forzar a Casilda en ausencia de su marido, Peribáñez regresa, lo mata y se presenta ante los Reyes Católicos a justificar su acción.",
    }});
    console.log("  ✓ obra creada: peribañez-y-el-comendador-de-ocana");
  } else { console.log("  skip obra: peribañez"); }

  const txt_casilda = `Casilda, mientras no puedas
excederme en afición,
no con palabras me excedas.
Toda esta villa de Ocaña,
poner quisiera a tus pies,
y aun todo aquello que baña
Tajo hasta ser portugués,
entrando en el mar de España.
El olivar más cargado
de aceitunas me parece
menos hermoso, y el prado
que por el mayo florece,
sólo del alba pisado.
No hay camuesa que se afeite
que no te rinda ventaja,
ni rubio y dorado aceite
conservado en la tinaja
que me cause más deleite.
Ni el vino blanco imagino
de cuarenta años tan fino
como tu boca olorosa,
que, como al señor la rosa,
le huele al villano el vino.
Contigo, Casilda, tengo
cuanto puedo desear,
y sólo el pecho prevengo,
en él te he dado lugar,
ya que a merecerte vengo.
Vive en él; que si un villano
por la paz del alma, es rey,
que tú eres reina está llano,
ya porque es divina ley
y ya por derecho humano.`;
  await addFrag(peribañez.id, {
    slug: "casilda-mientras-no-puedas",
    title: "Canto nupcial de Peribáñez",
    headline: "Toda esta villa de Ocaña poner quisiera a tus pies",
    location: "Peribáñez y el comendador de Ocaña · Acto I",
    text: txt_casilda,
    order: 0,
  }, [
    { type: "glosa", needle: "que, como al señor la rosa,\nle huele al villano el vino", content: "Comparación que resume la poética del personaje: Peribáñez no compara a su amada con perlas ni soles petrarquistas, sino con los aromas del campo y la bodega. Su amor es tan sincero como el del villano ante el vino." },
    { type: "glosa", needle: "si un villano\npor la paz del alma, es rey,\nque tú eres reina está llano", content: "Paradoja del honor villano: Peribáñez proclama que, en la paz del alma, un labrador puede ser rey, y por tanto su mujer es reina. Es la dignidad moral del hombre sencillo frente a la nobleza corrupta." },
    { type: "contexto", content: "Peribáñez recita estos versos a Casilda el día de su boda. La estrofa empleada —décimas o quintillas— contrasta con el lenguaje culto de los nobles y refleja el habla popular y campesina del personaje. La descripción de la amada se aleja deliberadamente de los tópicos petrarquistas." },
    { type: "figura", needle: "El olivar más cargado\nde aceitunas me parece\nmenos hermoso", content: "Comparación rústica: no usa el sol de oro ni el alabastro clásico, sino el olivar, el campo, la aceite, el vino. La belleza de Casilda supera incluso la abundancia de la naturaleza rural." },
    { type: "figura", needle: "poner quisiera a tus pies,\ny aun todo aquello que baña\nTajo hasta ser portugués", content: "Hipérbole del amor: querría poner el río Tajo —desde Castilla hasta Portugal— a los pies de Casilda. La geografía concreta da verosimilitud campesina a la exageración." },
    { type: "pregunta", content: "¿Qué estrofa usa Lope en este fragmento? ¿Qué características tiene?" },
    { type: "pregunta", content: "¿En qué se diferencia la forma en que Peribáñez describe a Casilda de la descriptio puellae de Góngora o Garcilaso? ¿Qué dice eso sobre el personaje?" },
    { type: "intertextualidad", content: "Compara el amor que profesa Peribáñez a Casilda con el que expresa el Marqués de Santillana en la Serranilla de la Finojosa. ¿Qué diferencias hay entre el trato hacia la mujer del pueblo en ambas obras?" },
  ]);

  const txt_peribañez_reyes = `Yo soy un hombre,
aunque de villana casta,
limpio de sangre, y jamás
de hebrea o mora manchada.
Fui el mejor de mis iguales,
y en cuantas cosas trataban
me dieron primero voto,
y truje seis años vara.
Caséme con la que ves,
también limpia, aunque villana,
virtuosa, si la ha visto
la envidia asida a la fama.
El Comendador Fadrique
de nuestra villa de Ocaña
señor y Comendador,
dio, como mozo, en amarla.
Fingiendo que por servicios,
honró mis humildes casas
de unos reposteros, que eran
cubiertas de tales cargas.
Con esto intentó una noche
que ausente de Ocaña estaba,
forzar mi mujer, mas fuese
con la esperanza burlada.
Hallé mis puertas rompidas
y mi mujer destocada
como corderilla simple
que está del lobo en las garras.
Dio voces, llegué, saqué
la misma daga y espada
que ceñí para servirte
no para tan triste hazaña.
Paséle el pecho, y entonces
dejó la cordera blanca,
porque yo, como pastor,
supe del lobo quitarla.

REY: ¡Cosa extraña!
¡Que un labrador tan humilde
estime tanto su fama!
¡Vive Dios, que no es razón
matarle! Yo le hago gracia
de la vida.`;
  await addFrag(peribañez.id, {
    slug: "yo-soy-un-hombre-villana-casta",
    title: "Peribáñez ante los Reyes Católicos",
    headline: "Yo soy un hombre, aunque de villana casta, limpio de sangre",
    location: "Peribáñez y el comendador de Ocaña · Acto III",
    text: txt_peribañez_reyes,
    order: 1,
  }, [
    { type: "glosa", needle: "Paséle el pecho, y entonces\ndejó la cordera blanca,\nporque yo, como pastor,\nsupe del lobo quitarla", content: "Metáfora pastoril al culminar el relato: Peribáñez se presenta como pastor que defiende a su oveja ('cordera blanca' = Casilda) del lobo (el comendador). La imagen bíblica del Buen Pastor avala moralmente el crimen." },
    { type: "glosa", needle: "¡Que un labrador tan humilde\nestime tanto su fama!", content: "El Rey expresa su asombro: un villano que defiende su honor era algo inesperado para la nobleza. El honor no es patrimonio exclusivo de los aristócratas: esta es la tesis de la obra." },
    { type: "contexto", content: "Clímax del drama: Peribáñez se entrega voluntariamente al Rey, asumiendo su culpa pero explicando la causa. El monarca, conmovido, le perdona. La obra plantea que el honor no es exclusivo de la nobleza y que el crimen del comendador justifica la respuesta del villano." },
    { type: "figura", needle: "limpio de sangre, y jamás\nde hebrea o mora manchada", content: "El primer dato que da Peribáñez es la limpieza de sangre: el máximo valor social de la España de los siglos XVI-XVII. Ser cristiano viejo sin antepasados judíos o moros era la base de la honra." },
    { type: "figura", needle: "y como vi que de noche\nera mi deshonra clara", content: "Oxímoron notable: la deshonra (algo oscuro) es 'clara' de noche. El juego conceptista ilumina el tema del honor: lo que debería estar oculto se ha hecho evidente." },
    { type: "pregunta", content: "¿Por qué lo primero que Peribáñez hace constar ante el Rey es su limpieza de sangre? ¿Qué importancia tiene este dato en la sociedad de la época?" },
    { type: "pregunta", content: "¿Qué estrategia retórica usa Peribáñez para ganarse la simpatía del Rey? ¿Cómo organiza su relato?" },
    { type: "intertextualidad", content: "Compara este parlamento con el de Laurencia en Fuenteovejuna ('¿Conocéisme?'). En ambas obras el pueblo se alza contra la nobleza abusadora. ¿Qué diferencias hay en el personaje que reivindica el honor?" },
  ]);

  // ── 9. NUEVA OBRA: El Buscón ─────────────────────────────────────────────
  console.log("\n=== NUEVA OBRA: El Buscón ===");
  const quevedoAuthor = await p.author.findFirst({ where: { slug: "francisco-de-quevedo" }, select: { id: true } });
  if (!quevedoAuthor) throw new Error("Quevedo not found");

  let buscon = await p.work.findFirst({ where: { slug: "el-buscon" } });
  if (!buscon) {
    buscon = await p.work.create({ data: {
      slug: "el-buscon",
      title: "Historia de la vida del Buscón",
      authorId: quevedoAuthor.id,
      year: 1626,
      era: "Barroco",
      genre: "novela picaresca",
      synopsis: "Novela picaresca de Quevedo que narra la vida de don Pablos de Segovia, hijo de un barbero ladrón y una bruja alcahueta, en su ascenso social frustrado. A diferencia del Lazarillo, el protagonista nunca logra escapar de sus orígenes y la obra tiene una dimensión más satírica y cruel.",
    }});
    console.log("  ✓ obra creada: el-buscon");
  } else { console.log("  skip obra: el-buscon"); }

  const txt_buscon = `Yo, señor, soy de Segovia. Mi padre se llamó Clemente Pablo, natural del mismo pueblo; Dios le tenga en el cielo. Fue, tal como todos dicen, de oficio barbero; aunque eran tan altos sus pensamientos, que se corría que le llamasen así, diciendo que él era tundidor de mejillas y sastre de barbas. Dicen que era de muy buena cepa, y, según él bebía, es cosa para creer.

Estuvo casado con Aldonza de San Pedro, hija de Diego de San Juan y nieta de Andrés de San Cristóbal. Sospechábase en el pueblo que no era castellana vieja, aunque ella, por los nombres y sobrenombres de sus pasados, quiso esforzar que era descendiente de la letanía. Tuvo muy buen parecer, y fue tan celebrada, que, en el tiempo que ella vivió, casi todos los copleros de España hacían cosas sobre ella.

Padeció grandes trabajos recién casada, y aun después, porque malas lenguas daban en decir que mi padre metía el dos de bastos para sacar el as de oros. Probósele que, a todos los que hacía la barba a navaja, mientras les daba con el agua, levantándoles la cara para el lavatorio, un mi hermanico de siete años les sacaba muy a su salvo los tuétanos de las faldriqueras. Murió el angelico de unos azotes que le dieron en la cárcel.

Mi madre, pues, no tuvo calamidades. Un día, alabándomela una vieja que me crió, decía que era tal su agrado, que hechizaba a cuantos la trataban. Unos la llamaban zurcidora de gustos; otros, algebrista de voluntades desconcertadas, y por mal nombre alcahueta. Para unos era tercera, primera para otros, y flux para los dineros de todos.`;
  await addFrag(buscon.id, {
    slug: "yo-senor-soy-de-segovia",
    title: "Inicio de El Buscón",
    headline: "Mi padre se llamó Clemente Pablo, sastre de barbas",
    location: "Historia de la vida del Buscón · Capítulo I",
    text: txt_buscon,
    order: 0,
  }, [
    { type: "glosa", needle: "él era tundidor de mejillas y sastre de barbas", content: "Perífrasis eufemística burlesca: el barbero se niega a llamarse barbero y usa circunloquios grandiosos. 'Sastre de barbas' tiene además doble sentido: 'sastre' era jerga germanesca para ladrón." },
    { type: "glosa", needle: "Unos la llamaban zurcidora de gustos; otros, algebrista de voluntades desconcertadas, y por mal nombre alcahueta", content: "Gradación irónica de los eufemismos para 'alcahueta': de la perífrasis más suave ('zurcidora de gustos') a la más técnica ('algebrista de voluntades') al nombre directo. El humor negro de Quevedo revela la identidad real a través de la acumulación." },
    { type: "contexto", content: "Inicio de El Buscón (escrito hacia 1604, publicado en 1626), novela picaresca de Quevedo. El protagonista, don Pablos, relata su 'genealogía vil': padre barbero-ladrón y madre alcahueta-bruja. A diferencia del Lazarillo, el tono es despiadadamente satírico y el protagonista nunca logra redimirse ni ascender socialmente." },
    { type: "figura", needle: "Dicen que era de muy buena cepa, y, según él bebía, es cosa para creer", content: "Dilogía: 'buena cepa' significa linaje noble, pero también 'cepa de vid' (la vid de la que sale el vino). Como el padre bebía mucho, la expresión resulta irónica: su única 'buena cepa' es la vinícola." },
    { type: "figura", needle: "metía el dos de bastos para sacar el as de oros", content: "Metáfora de naipes para el robo: 'entrar con la sota' y 'salir con el as de oros' era jerga de tahúres. El padre usaba la navaja de barbero para distraer mientras su hermanico robaba." },
    { type: "pregunta", content: "¿Qué aspectos del Lazarillo de Tormes aparecen también en El Buscón? ¿Qué elementos diferencian la 'genealogía vil' de Pablos de la de Lázaro?" },
    { type: "pregunta", content: "¿Cómo refleja el texto la obsesión de la época por la 'limpieza de sangre'? ¿Qué insinúa el apellido 'San Pedro, San Juan, San Cristóbal' de la madre?" },
    { type: "intertextualidad", content: "Compara el comienzo de El Buscón con el del Lazarillo. ¿En qué se parecen y en qué difieren el tono, el narrador y la relación entre el protagonista y sus padres?" },
  ]);

  // ── 10. NUEVA OBRA: Fábula de Polifemo y Galatea ─────────────────────────
  console.log("\n=== NUEVA OBRA: Fábula de Polifemo y Galatea ===");
  const gongoraAuthor = await p.author.findFirst({ where: { slug: "luis-de-gongora" }, select: { id: true } });
  if (!gongoraAuthor) throw new Error("Góngora not found");

  let polifemo = await p.work.findFirst({ where: { slug: "fabula-de-polifemo-y-galatea" } });
  if (!polifemo) {
    polifemo = await p.work.create({ data: {
      slug: "fabula-de-polifemo-y-galatea",
      title: "Fábula de Polifemo y Galatea",
      authorId: gongoraAuthor.id,
      year: 1613,
      era: "Barroco",
      genre: "poema mitológico culterano",
      synopsis: "Poema en octavas reales que narra el mito del cíclope Polifemo, enamorado de la ninfa Galatea, quien a su vez ama al pastor Acis. El gigante, furioso por los amores de los dos jóvenes, aplasta a Acis con una roca; los dioses lo transforman en río. Es la cumbre del culteranismo gongorino.",
    }});
    console.log("  ✓ obra creada: fabula-de-polifemo-y-galatea");
  } else { console.log("  skip obra: fabula-de-polifemo-y-galatea"); }

  const txt_polifemo = `Purpúreas rosas sobre Galatea
la Alba entre lirios cándidos deshoja:
duda el Amor cuál más su color sea,
púrpura nevada, o nieve roja.
De su frente la perla es, eritrea,
émula vana. El ciego dios se enoja,
y, condenando su esplendor, la deja
pender en oro al nácar de su oreja.

Salamandria del Sol, vestido estrellas,
latiendo el Can del cielo estaba cuando
—polvo el cabello, húmidas centellas,
si no ardientes aljófares sudando—
llegó Acis; y de ambas luces bellas
dulce Occidente viendo al sueño blando,
su boca dio, y sus ojos cuanto pudo,
al sonoro cristal, al cristal mudo.

No a las palomas concedió Cupido
juntar de los dos picos los rubíes,
cuando al clavel el joven atrevido
las dos hojas le chupa carmesíes.
Cuantas produce Pafo, engendra Gnido,
negras víolas, blancos alhelíes,
llueven sobre el que Amor quiere que sea
tálamo de Acis ya y de Galatea.`;
  await addFrag(polifemo.id, {
    slug: "purpureas-rosas-sobre-galatea",
    title: "Galatea dormida y el primer beso de Acis",
    headline: "Púrpura nevada, o nieve roja",
    location: "Fábula de Polifemo y Galatea · Estrofas XII-XIV",
    text: txt_polifemo,
    order: 0,
  }, [
    { type: "glosa", needle: "duda el Amor cuál más su color sea,\npúrpura nevada, o nieve roja", content: "Oxímoron perfecto: 'púrpura nevada' (el rojo del amanecer mezclado con el blanco de Galatea) y 'nieve roja' (la blancura de la ninfa teñida de rosa). El Amor no puede decidir qué color domina: es la indistinción de los contrarios en la belleza perfecta." },
    { type: "glosa", needle: "al sonoro cristal, al cristal mudo", content: "Antítesis final de la segunda octava: Acis acerca sus labios al agua que suena ('sonoro cristal' = el río) y sus ojos a los labios de Galatea ('cristal mudo' = el agua quieta de la boca dormida). La imagen es de una belleza erótica y silenciosa." },
    { type: "contexto", content: "Góngora escribió la Fábula de Polifemo y Galatea en 1612 (publicada en 1613). Es la cumbre del culteranismo: lengua latinizada, hipérbaton extremo, metáforas densísimas. Las tres octavas aquí presentadas muestran primero la belleza de Galatea dormida al amanecer y luego la llegada de Acis, que la contempla y le da el primer beso entre una lluvia de flores." },
    { type: "figura", needle: "Salamandria del Sol, vestido estrellas", content: "Perífrasis culterana para el verano: la salamandria es un animal que vive en el fuego, así que 'salamandria del Sol' = el sol ardiente del estío. 'Vestido estrellas' describe el cielo nocturno previo al amanecer." },
    { type: "figura", needle: "llueven sobre el que Amor quiere que sea\ntálamo de Acis ya y de Galatea", content: "Las flores que llueven sobre los amantes en el momento del primer beso son el lecho nupcial ('tálamo'). Pafo y Gnido son islas consagradas a Venus/Afrodita. La imagen es una explosión de belleza y erotismo contenido." },
    { type: "pregunta", content: "¿En qué estrofa está escrita la Fábula? ¿Cuántos versos tiene y cuál es su estructura rimática?" },
    { type: "pregunta", content: "En la primera octava, Góngora describe a Galatea dormida al amanecer mediante los colores blanco y rojo. ¿Qué elementos naturales usa para cada color? ¿Por qué 'duda el Amor'?" },
    { type: "intertextualidad", content: "Compara la descripción de Galatea con la de la amada en los sonetos de Góngora ('De pura honestidad templo sagrado', 'Mientras por competir con tu cabello'). ¿Cómo difiere el tratamiento de la belleza femenina entre el soneto y la octava real?" },
  ]);

  // ── 11. NUEVA OBRA: Soledades ────────────────────────────────────────────
  console.log("\n=== NUEVA OBRA: Soledades ===");
  let soledades = await p.work.findFirst({ where: { slug: "soledades" } });
  if (!soledades) {
    soledades = await p.work.create({ data: {
      slug: "soledades",
      title: "Soledades",
      authorId: gongoraAuthor.id,
      year: 1613,
      era: "Barroco",
      genre: "silva culterana",
      synopsis: "Poema extenso en silvas que narra el viaje de un náufrago desdeñado de amor a través de un mundo idealizado de pastores y pescadores. Inacabado, es junto con la Fábula de Polifemo el máximo exponente del culteranismo gongorino y generó la famosa polémica conceptismo-culteranismo.",
    }});
    console.log("  ✓ obra creada: soledades");
  } else { console.log("  skip obra: soledades"); }

  const txt_soledades = `Era del año la estación florida
en que el mentido robador de Europa
—media luna las armas de su frente,
y el Sol todos los rayos de su pelo—,
luciente honor del cielo,
en campos de zafiro pace estrellas;
cuando el que ministrar podía la copa
a Júpiter mejor que el garzón de Ida
—náufrago y desdeñado, sobre ausente—,
lagrimosas de amor dulces querellas
da al mar; que condolido,
fue a las ondas, fue al viento
el mísero gemido,
segundo de Arión dulce instrumento.`;
  await addFrag(soledades.id, {
    slug: "era-del-anno-la-estacion-florida",
    title: "Apertura de las Soledades",
    headline: "Era del año la estación florida",
    location: "Soledades · Dedicatoria / Soledad primera, vv. 1-14",
    text: txt_soledades,
    order: 0,
  }, [
    { type: "glosa", needle: "el mentido robador de Europa", content: "Perífrasis culterana para Tauro (el toro): Zeus se convirtió en toro ('mentido' = disfrazado) para raptar a Europa. Decir 'el Sol está en Tauro' significa que es primavera. El lector debe descifrar la alusión mitológica." },
    { type: "glosa", needle: "náufrago y desdeñado, sobre ausente", content: "Tres adjetivos acumulados que definen al protagonista: ha sufrido un naufragio físico (náufrago), ha sido rechazado en amor (desdeñado) y está lejos de su tierra (ausente). La triple desgracia se condensa en una sola línea." },
    { type: "contexto", content: "Primeros versos de las Soledades (1613) de Góngora, escritas en silva (combinación libre de heptasílabos y endecasílabos). Estos versos introducen la situación del protagonista —un joven náufrago desdeñado de amor— y la época del año (primavera). La densidad de referencias mitológicas y la sintaxis latinizada son la marca del culteranismo." },
    { type: "figura", needle: "en campos de zafiro pace estrellas", content: "El cielo nocturno como un prado de zafiro (azul) donde el toro-Zeus 'pace' las estrellas como si fuesen hierba. La imagen es sinestésica y visual: el azul del cielo, las estrellas como puntos brillantes, el toro pastando." },
    { type: "figura", needle: "segundo de Arión dulce instrumento", content: "Arión fue un poeta griego que, arrojado al mar, fue salvado por un delfín atraído por su música. El náufrago, como Arión, entona sus lamentos al mar. La comparación mitológica eleva la figura del desdichado a la de un artista." },
    { type: "pregunta", content: "¿En qué estrofa están escritas las Soledades? ¿Qué la diferencia del soneto y de la octava real?" },
    { type: "pregunta", content: "¿A qué se refiere Góngora con 'el mentido robador de Europa'? Explica la alusión mitológica y su función en el poema." },
    { type: "intertextualidad", content: "Las Soledades fueron atacadas por Quevedo y Lope por su oscuridad. ¿Crees que la dificultad del texto añade o resta valor literario? ¿Qué diferencia hay entre la oscuridad de Góngora y el conceptismo de Quevedo?" },
  ]);

  console.log("\n✅ Todos los fragmentos añadidos.");
}

main().catch(console.error).finally(() => p.$disconnect());
