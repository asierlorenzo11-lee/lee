import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

function anchor(text: string, needle: string) {
  const anchorStart = text.indexOf(needle);
  if (anchorStart === -1)
    throw new Error(`Ancla no encontrada: "${needle.slice(0, 60)}"`);
  return { anchorStart, anchorEnd: anchorStart + needle.length };
}

async function main() {
  const consCriticaSocial = await prisma.constellation.findFirstOrThrow({ where: { slug: "critica-social" } });

  // ════════════════════════════════════════════════════════════
  // TOMÁS DE IRIARTE — autor nuevo
  // ════════════════════════════════════════════════════════════
  console.log("Creando autor Tomás de Iriarte...");
  const iriarte = await prisma.author.create({
    data: {
      slug: "tomas-de-iriarte",
      name: "Tomás de Iriarte",
      birthYear: 1750,
      deathYear: 1791,
      country: "España",
      era: "Ilustración",
      bio: `Tomás de Iriarte (Puerto de la Cruz, Tenerife, 1750 – Madrid, 1791). Poeta y dramaturgo neoclásico, traductor y bibliotecario de la Secretaría de Estado. Sus *Fábulas literarias* (1782), escritas en muy variados metros, no enseñan moral general como las de Esopo, sino reglas concretas del buen escribir: cada fábula esconde una crítica a un vicio literario —la pedantería, la improvisación, el plagio, la falta de método— bajo la anécdota de un animal. Mantuvo una sonada rivalidad pública con Félix María de Samaniego, el otro gran fabulista de su tiempo, sobre cuál de los dos escribía mejores fábulas.`,
      portraitUrl: null,
    },
  });

  console.log("Creando obra Fábulas literarias (Iriarte)...");
  const fabulasIriarte = await prisma.work.create({
    data: {
      slug: "fabulas-literarias-iriarte",
      title: "Fábulas literarias",
      year: 1782,
      era: "Ilustración",
      genre: "Fábula",
      synopsis: `Colección de 76 fábulas en las que Iriarte, bajo la anécdota tradicional de animales que hablan, censura vicios concretos de la práctica literaria de su época: la disputa estéril, la presunción sin fundamento, el acierto fruto del azar y no del método. Compuestas en una notable variedad métrica, alternan el tono didáctico con una ironía mordaz.`,
      authorId: iriarte.id,
    },
  });

  const conejosText = `Por entre unas matas,
seguido de perros,
no diré corría,
volaba un conejo.

De su madriguera
salió un compañero
y le dijo: «Tente,
amigo, ¿qué es esto?»

«¿Qué ha de ser?», responde;
«sin aliento llego…;
dos pícaros galgos
me vienen siguiendo».

«Sí», replica el otro,
«por allí los veo,
pero no son galgos».
«¿Pues qué son?» «Podencos.»

«¿Qué? ¿podencos dices?
Sí, como mi abuelo.
Galgos y muy galgos;
bien vistos los tengo.»

«Son podencos, vaya,
que no entiendes de eso.»
«Son galgos, te digo.»
«Digo que podencos.»

En esta disputa
llegando los perros,
pillan descuidados
a mis dos conejos.

Los que por cuestiones
de poco momento
dejan lo que importa,
llévense este ejemplo.`;

  console.log("Creando Los dos conejos...");
  const fragConejos = await prisma.fragment.create({
    data: {
      slug: "los-dos-conejos",
      title: "Los dos conejos",
      location: "Fábulas literarias",
      headline: "«Son galgos, te digo» — «Digo que podencos»",
      text: conejosText,
      order: 1,
      status: "published",
      workId: fabulasIriarte.id,
      constellations: { connect: [{ id: consCriticaSocial.id }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragConejos.id,
        type: "glosa",
        ...anchor(conejosText, "Podencos"),
        order: 1,
        content: `El podenco y el galgo son dos razas de perro de caza distintas pero fácilmente confundibles a la carrera; la disputa de los conejos es, literalmente, sobre una diferencia que en ese momento no les afecta en nada: van a ser cazados por cualquiera de los dos.`,
      },
      {
        fragmentId: fragConejos.id,
        type: "contexto",
        ...anchor(conejosText, "Los que por cuestiones"),
        order: 1,
        content: `La moraleja final, explícita y separada de la anécdota, es típica de la fábula neoclásica: el relato existe para ilustrar una regla de conducta que se enuncia después, sin dejarla a la interpretación del lector.`,
      },
      {
        fragmentId: fragConejos.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(conejosText, "«Son podencos, vaya,\nque no entiendes de eso.»\n«Son galgos, te digo.»\n«Digo que podencos.»"),
        order: 1,
        content: `**Diálogo en estilo directo con paralelismo especular**: las dos últimas réplicas repiten exactamente la misma estructura intercambiando solo el sustantivo en disputa, dando al verso la cadencia de una discusión real que da vueltas sobre sí misma sin avanzar.`,
      },
      {
        fragmentId: fragConejos.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `¿Conoces alguna discusión —entre amigos, en clase, en redes sociales— en la que la gente se enfrasca tanto en un detalle que pierde de vista el problema real?`,
      },
    ],
  });

  const burroText = `Cerca de unos prados
que hay en mi lugar,
pasaba un borrico
por casualidad.

Una flauta en ellos
halló, que un zagal
se dejó olvidada
por casualidad.

Acercóse a olerla
el dicho animal,
y dio un resoplido
por casualidad.

En la flauta el aire
se hubo de colar,
y sonó la flauta
por casualidad.

«¡Oh!, dijo el borrico,
qué bien sé tocar!
¿Y dirán que es mala
la música asnal?»

Sin reglas del arte
borriquitos hay
que una vez aciertan
por casualidad.`;

  console.log("Creando El burro flautista...");
  const fragBurro = await prisma.fragment.create({
    data: {
      slug: "el-burro-flautista",
      title: "El burro flautista",
      location: "Fábulas literarias",
      headline: "«¿Y dirán que es mala la música asnal?»",
      text: burroText,
      order: 2,
      status: "published",
      workId: fabulasIriarte.id,
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragBurro.id,
        type: "contexto",
        ...anchor(burroText, "Sin reglas del arte"),
        order: 1,
        content: `La fábula satiriza a quien confunde un acierto casual con talento o método: el burro no sabe música, solo respiró sobre una flauta en el momento y el ángulo justos. Iriarte, defensor del estudio y las reglas frente a la improvisación, dirige esta crítica contra escritores de su tiempo que alardeaban de éxitos que debían más a la suerte que al oficio.`,
      },
      {
        fragmentId: fragBurro.id,
        type: "figura",
        category: "sonoro",
        ...anchor(burroText, "por casualidad"),
        order: 1,
        content: `**Estribillo (epífora)**: la repetición de «por casualidad» al final de cada estrofa convierte la frase en un recordatorio insistente —casi una correctura— de que ningún elemento de lo ocurrido fue mérito del burro.`,
      },
      {
        fragmentId: fragBurro.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `¿Por qué crees que Iriarte necesita repetir cuatro veces "por casualidad" en una fábula tan breve? ¿Qué efecto produce esa insistencia?`,
      },
    ],
  });

  console.log("✓ Tomás de Iriarte: autor + obra + 2 fragmentos creados.");

  // ════════════════════════════════════════════════════════════
  // SAMANIEGO — nueva obra "Fábulas"
  // ════════════════════════════════════════════════════════════
  const samaniego = await prisma.author.findFirstOrThrow({ where: { slug: "felix-maria-de-samaniego" } });

  console.log("Creando obra Fábulas (Samaniego)...");
  const fabulasSamaniego = await prisma.work.create({
    data: {
      slug: "fabulas-samaniego",
      title: "Fábulas en verso castellano",
      year: 1781,
      era: "Ilustración",
      genre: "Fábula",
      synopsis: `Encargadas por el conde de Peñaflorida para uso escolar de los Caballeritos de Azcoitia, estas fábulas —muchas de raíz esópica o de La Fontaine— enseñan virtudes prácticas (prudencia, sinceridad, desconfianza de la lisonja) con una gracia y ligereza que las convirtió de inmediato en lectura escolar obligada, y que siguen siéndolo hoy.`,
      authorId: samaniego.id,
    },
  });

  const cuervoText = `En la rama de un árbol,
bien ufano y contento,
con un queso en el pico,
estaba el señor Cuervo.

Del olor atraído,
un Zorro muy maestro
le dijo estas palabras
un poco más o menos:

«¡Tenga usted buenos días,
señor Cuervo, mi dueño!
¡Vaya que estáis donoso,
mono, lindo en extremo!

Yo no gasto lisonjas,
y digo lo que siento;
que si a tu bella traza
corresponde el gorjeo,

juro a la diosa Ceres,
siendo testigo el cielo,
que tú serás el Fénix
de sus vastos imperios».

Al oír un discurso
tan dulce y halagüeño,
de vanidad llevado,
quiso cantar el Cuervo.

Abrió su negro pico,
dejó caer el queso.
El muy astuto Zorro,
después de haberle preso,

le dijo: «Señor bobo,
pues sin otro alimento,
quedáis con alabanzas
tan hinchado y repleto,

digerid las lisonjas
mientras yo digiero el queso».`;

  console.log("Creando El Zorro y el Cuervo...");
  const fragCuervo = await prisma.fragment.create({
    data: {
      slug: "el-zorro-y-el-cuervo",
      title: "El Zorro y el Cuervo",
      location: "Fábulas en verso castellano",
      headline: "«Digerid las lisonjas mientras yo digiero el queso»",
      text: cuervoText,
      order: 1,
      status: "published",
      workId: fabulasSamaniego.id,
      constellations: { connect: [{ id: consCriticaSocial.id }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragCuervo.id,
        type: "glosa",
        ...anchor(cuervoText, "Yo no gasto lisonjas"),
        order: 1,
        content: `«Lisonja»: alabanza interesada, no sincera. La ironía es máxima: el Zorro afirma no usar lisonjas en el mismo instante en que pronuncia la lisonja más exagerada de toda la fábula.`,
      },
      {
        fragmentId: fragCuervo.id,
        type: "contexto",
        ...anchor(cuervoText, "juro a la diosa Ceres"),
        order: 1,
        content: `Esta fábula, de origen esópico y transmitida también por La Fontaine, es una de las más universales de la tradición occidental: la vanidad ante el halago propio convierte a cualquiera —por sabio o poderoso que se crea— en presa fácil de quien sabe adularle con un fin oculto.`,
      },
      {
        fragmentId: fragCuervo.id,
        type: "figura",
        category: "tropo",
        ...anchor(cuervoText, "serás el Fénix\nde sus vastos imperios"),
        order: 1,
        content: `**Hipérbole**: comparar el canto del cuervo —ave proverbialmente desafinada— con el Fénix, ave única y prodigiosa, lleva la lisonja a un extremo tan desmesurado que debería resultar sospechoso; precisamente esa desmesura es lo que ciega al Cuervo.`,
      },
      {
        fragmentId: fragCuervo.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `¿Por qué crees que esta fábula, escrita para enseñar a niños del siglo XVIII, sigue siendo relevante? ¿Reconoces situaciones actuales donde alguien usa el halago para conseguir algo?`,
      },
    ],
  });

  console.log("✓ Samaniego: nueva obra + fragmento creados.");

  // ════════════════════════════════════════════════════════════
  // JOVELLANOS — nueva obra sobre los espectáculos públicos
  // ════════════════════════════════════════════════════════════
  const jovellanos = await prisma.author.findFirstOrThrow({ where: { name: { contains: "Jovellanos" } } });

  console.log("Creando obra Memoria para el arreglo de la policía de los espectáculos...");
  const memoriaEspectaculos = await prisma.work.create({
    data: {
      slug: "memoria-espectaculos-publicos",
      title: "Memoria para el arreglo de la policía de los espectáculos y diversiones públicas, y sobre su origen en España",
      year: 1790,
      era: "Ilustración",
      genre: "Ensayo (informe)",
      synopsis: `Informe encargado por el Consejo de Castilla en el que Jovellanos analiza el estado de los espectáculos públicos en España —teatro, toros, fiestas populares— y propone su reforma como instrumento de mejora de las costumbres. El fragmento sobre los toros defiende, con argumentos de utilidad pública y humanidad, la prohibición que Carlos III había decretado sobre las corridas.`,
      authorId: jovellanos.id,
    },
  });

  const torosText = `Así corrió la suerte de este espectáculo, más o menos asistido o celebrado según su aparato, y también según el gusto y genio de las provincias que le adoptaron, sin que los mayores aplausos bastasen a librarle de alguna censura eclesiástica, y menos de aquella con que la razón y la humanidad se reunieron para condenarle. Pero el clamor de sus censores, lejos de templar, irritó la afición de sus apasionados, y parecía empeñarlos más y más en sostenerle, cuando el celo ilustrado del piadoso Carlos III lo proscribió generalmente, con tanto consuelo de los buenos espíritus como sentimiento de los que juzgan las cosas por meras apariencias.

Es por cierto muy digno de admiración que este punto se haya presentado a la discusión como un problema difícil de resolver. La lucha de toros no ha sido jamás una diversión, ni cotidiana, ni muy frecuentada, ni de todos los pueblos de España, ni generalmente buscada y aplaudida. En muchas provincias no se conoció jamás; en otras se circunscribió a las capitales, y dondequiera que fueron celebrados lo fue solamente a largos periodos y concurriendo a verla el pueblo de las capitales y tal cual aldea circunvecina. Se puede, por tanto, calcular que de todo el pueblo de España, apenas la centésima parte habrá visto alguna vez este espectáculo. ¿Cómo, pues, se ha pretendido darle el título de diversión nacional?

Sin embargo, creer que el arrojo y destreza de una docena de hombres, criados desde su niñez en este oficio, familiarizados con sus riesgos y que al cabo perecen o salen estropeados de él, se puede presentar a la misma Europa como un argumento de valor y bizarría española, es un absurdo.`;

  console.log("Creando Los toros...");
  const fragToros = await prisma.fragment.create({
    data: {
      slug: "jovellanos-los-toros",
      title: "Los toros",
      location: "Memoria para el arreglo de la policía de los espectáculos y diversiones públicas",
      headline: "«Se ha pretendido darle el título de diversión nacional»",
      text: torosText,
      order: 1,
      status: "published",
      workId: memoriaEspectaculos.id,
      constellations: { connect: [{ id: consCriticaSocial.id }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragToros.id,
        type: "glosa",
        ...anchor(torosText, "lo proscribió generalmente"),
        order: 1,
        content: `Carlos III prohibió las corridas de toros por real decreto en 1785, dentro de su política de reformas ilustradas. Jovellanos defiende y celebra aquí esa prohibición como un acto de «celo ilustrado».`,
      },
      {
        fragmentId: fragToros.id,
        type: "contexto",
        ...anchor(torosText, "apenas la centésima parte habrá visto alguna vez este espectáculo"),
        order: 1,
        content: `El argumento central de Jovellanos es estadístico antes que moral: refuta la idea de que los toros sean una «diversión nacional» mostrando que, de hecho, la mayoría de los españoles nunca los había presenciado. Solo después de desmontar ese argumento entra en la condena ética del espectáculo.`,
      },
      {
        fragmentId: fragToros.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(torosText, "ni cotidiana, ni muy frecuentada, ni de todos los pueblos de España, ni generalmente buscada y aplaudida"),
        order: 1,
        content: `**Polisíndeton (repetición de "ni")**: la acumulación de negaciones refuerza, una tras otra, la tesis de que los toros no merecen el estatus de costumbre verdaderamente nacional y extendida.`,
      },
      {
        fragmentId: fragToros.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `Jovellanos escribía esto en 1790. ¿Qué paralelismos encuentras con los debates actuales sobre las corridas de toros en España?`,
      },
    ],
  });

  console.log("✓ Jovellanos: nueva obra + fragmento creados.");

  // ════════════════════════════════════════════════════════════
  // CADALSO — Carta XXXV (Cartas marruecas) + nueva obra Los eruditos a la violeta
  // ════════════════════════════════════════════════════════════
  const cadalso = await prisma.author.findFirstOrThrow({ where: { name: { contains: "Cadalso" } } });
  const cartasMarruecas = await prisma.work.findFirstOrThrow({ where: { slug: "cartas-marruecas" } });

  console.log("Reordenando Cartas marruecas...");
  await prisma.fragment.update({ where: { slug: "carta-vii-cadalso" }, data: { order: 1 } });
  await prisma.fragment.update({ where: { slug: "carta-xii-cadalso" }, data: { order: 2 } });
  await prisma.fragment.update({ where: { slug: "carta-xiii-cadalso" }, data: { order: 3 } });
  await prisma.fragment.update({ where: { slug: "carta-xli-cadalso" }, data: { order: 5 } });

  const carta35Text = `En España, como en todas partes, el lenguaje se muda al mismo paso que las costumbres; y es que, como las voces son invenciones para representar las ideas, es preciso que se inventen palabras para explicar la impresión que hacen las costumbres nuevamente introducidas.

[...]

—Amigo, ¿qué sé yo si leyéndotela te revelaré flaquezas de mi hermana y secretos de mi familia? Quédame el consuelo que no lo entenderás. Dice así:

«Hoy no ha sido día en mi apartamiento hasta medio día y medio. Tomé dos tazas de té. Púseme un desabillé y bonete de noche. Hice un tour en mi jardín, y leí cerca de ocho versos del segundo acto de la Zaira. Vino Mr. Lavanda; empecé mi toaleta. No estuvo el abate. Mandé pagar mi modista. Pasé a la sala de compañía. Me sequé toda sola. Entró un poco de mundo; jugué una partida de mediator; tiré las cartas; jugué al piquete. El maitre d'hotel avisó. Mi nuevo jefe de cocina es divino; él viene de arribar de París. La crapaudina, mi plato favorito, estaba delicioso. Tomé café y licor. Otra partida de quince; perdí mi todo. Fui al espectáculo [...] Salí al tercer acto, y me volví de allí a casa. Tomé de la limonada. Entré en mi gabinete para escribirte ésta, porque soy tu veritable amiga».

Acabó Nuño de leer, diciéndome: —¿Qué has sacado en limpio de todo esto? Por mi parte, te aseguro que [...] yo mismo no entendí la mitad de lo que contenía.

[...]

Ya se ve —prosiguió Nuño— cómo había de entender esta carta el conde Fernán Gonzalo, si en su tiempo no había té, ni deshabillé, ni bonete de noche, ni había Zaira, ni Mr. Vanda, ni toaletas, ni los cocineros eran divinos, ni se conocían crapaudinas ni café, ni más licores que el agua y el vino.`;

  console.log("Creando Carta XXXV...");
  const fragCarta35 = await prisma.fragment.create({
    data: {
      slug: "carta-xxxv-cadalso",
      title: "Carta XXXV",
      location: "Cartas marruecas, Carta XXXV",
      headline: "«Yo mismo no entendí la mitad de lo que contenía»",
      text: carta35Text,
      order: 4,
      status: "published",
      workId: cartasMarruecas.id,
      constellations: { connect: [{ id: consCriticaSocial.id }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragCarta35.id,
        type: "glosa",
        ...anchor(carta35Text, "desabillé"),
        order: 1,
        content: `Galicismo (del francés *déshabillé*) para una bata o vestido de casa informal. Junto a «toaleta» (toilette), «modista» en sentido afrancesado o «maitre d'hotel», forma parte del alud de palabras importadas de Francia que satiriza la carta.`,
      },
      {
        fragmentId: fragCarta35.id,
        type: "contexto",
        ...anchor(carta35Text, "Hoy no ha sido día en mi apartamiento hasta medio día y medio"),
        order: 1,
        content: `La «carta» que Nuño lee es una parodia: una jornada vacía —té, juegos de cartas, comedia, cena— narrada en una jerga afrancesada y vacua que ni siquiera Nuño, español culto, consigue descifrar sin ayuda de su sobrino de veinte años. Cadalso convierte el lenguaje de moda en síntoma de una sociedad superficial.`,
      },
      {
        fragmentId: fragCarta35.id,
        type: "figura",
        category: "tropo",
        ...anchor(carta35Text, "no entendí la mitad de lo que contenía"),
        order: 1,
        content: `**Ironía**: que un español adulto, instruido y curioso del idioma no entienda una carta escrita en su propia lengua por su propia sobrina es la prueba cómica —y alarmante— de hasta qué punto la moda ha sustituido al idioma común por una jerga de iniciados.`,
      },
      {
        fragmentId: fragCarta35.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `¿Qué crítica hace Cadalso a la sociedad española de su tiempo a través de esta carta llena de palabras extranjeras incomprensibles?`,
      },
      {
        fragmentId: fragCarta35.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 2,
        content: `¿Se te ocurre algún equivalente actual de esta jerga "de moda" —anglicismos, lenguaje de redes sociales— que resulte igual de incomprensible para alguien ajeno a ese círculo?`,
      },
    ],
  });

  console.log("Creando obra Los eruditos a la violeta...");
  const eruditosViolet = await prisma.work.create({
    data: {
      slug: "los-eruditos-a-la-violeta",
      title: "Los eruditos a la violeta",
      year: 1772,
      era: "Ilustración",
      genre: "Sátira",
      synopsis: `Bajo la forma de un curso de siete lecciones (una por día de la semana) dictado por un maestro a un grupo de discípulos vanidosos, Cadalso satiriza a los «pseudoeruditos»: quienes aparentan saberlo todo sin haber estudiado nada en profundidad, y a quienes solo les importa la ciencia como adorno social para lucirse en tertulias y paseos.`,
      authorId: cadalso.id,
    },
  });

  const eruditosText = `En todos los siglos y países del mundo han pretendido introducirse en la república literaria unos hombres ineptos, que fundan su pretensión en cierto aparato artificioso de literatura. Este exterior de sabios puede alucinar a los que no saben lo arduo que es poseer una ciencia, lo difícil que es entender varias a un tiempo, lo imposible que es abrazarlas todas, y lo ridículo que es tratarlas con magisterio, satisfacción propia, y deseo de ser tenido por sabio universal.

Ni nuestra era, ni nuestra patria está libre de estos pseudoeruditos, (si se me permite esta voz). A ellos va dirigido este papel irónico, con el fin de que los ignorantes no los confundan con los verdaderos sabios.

[...]

¡Siglo feliz! ¡Edad incomparable en los anales del tiempo! [...] Brotan torrentes de ciencia desde ambos polos del mundo. Huyen veloces las tinieblas de la ignorancia [...] ilustrado todo el orbe por un número asombroso de profundísimos doctores de veinte y cinco a treinta años de edad.

[...]

Si oímos a los hombres graves hablar de las ciencias, nos dirán que [...] el objeto común de todas ellas, y la utilidad que han prestado a los hombres se divide en dos: una es obtener un menos imperfecto conocimiento del Ente Supremo [...] y la otra es hacerse los hombres más sociables [...]

Muy santo y bueno será todo esto; y yo no me quiero meter ahora en disputarlo: pero yo y vosotros mis discípulos, hemos de considerar las ciencias con otro objeto muy diferente.

Las ciencias no han de servir más que para lucir en los estrados, paseos, luneta de las comedias, tertulias, antesalas de poderosos, y cafés, y para ensoberbecernos, llenarnos de orgullo, hacernos intratables, e infundirnos un sumo desprecio para con todos los que no nos admiren. Este es su objeto, su naturaleza, su principio y su fin.`;

  console.log("Creando Los eruditos a la violeta (fragmento)...");
  const fragEruditos = await prisma.fragment.create({
    data: {
      slug: "los-eruditos-a-la-violeta-leccion",
      title: "Oración del lunes",
      location: "Los eruditos a la violeta, Lección del lunes",
      headline: "«Las ciencias no han de servir más que para lucir»",
      text: eruditosText,
      order: 1,
      status: "published",
      workId: eruditosViolet.id,
      constellations: { connect: [{ id: consCriticaSocial.id }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragEruditos.id,
        type: "glosa",
        ...anchor(eruditosText, "pseudoeruditos"),
        order: 1,
        content: `Neologismo que el propio Cadalso señala como tal («si se me permite esta voz»): persona que aparenta erudición sin poseerla realmente. Toda la obra es una falsa lección dictada a estos personajes, llevando su superficialidad al absurdo.`,
      },
      {
        fragmentId: fragEruditos.id,
        type: "contexto",
        ...anchor(eruditosText, "el objeto común de todas ellas"),
        order: 1,
        content: `El «maestro» plantea primero, con seriedad, el fin verdadero de las ciencias —conocer a Dios y comunicarse entre los hombres—, solo para descartarlo de inmediato («pero yo y vosotros... hemos de considerar las ciencias con otro objeto muy diferente») y sustituirlo por la vanidad social. Esa inversión deliberada es el mecanismo satírico central de la obra.`,
      },
      {
        fragmentId: fragEruditos.id,
        type: "figura",
        category: "tropo",
        ...anchor(eruditosText, "¡Siglo feliz! ¡Edad incomparable en los anales del tiempo!"),
        order: 1,
        content: `**Hipérbole acumulativa e ironía**: la exaltación grandilocuente del propio tiempo como cumbre de toda la historia del saber resulta absurda por su misma desmesura, y prepara al lector para entender que todo lo que sigue es una burla del orgullo intelectual vacío.`,
      },
      {
        fragmentId: fragEruditos.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `¿En qué consiste la inversión irónica que hace el "maestro" entre lo que debería ser el fin de las ciencias y lo que él propone como su verdadero objeto?`,
      },
      {
        fragmentId: fragEruditos.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 2,
        content: `¿Reconoces hoy alguna forma de "erudición a la violeta": personas que aparentan saber mucho de algo (cine, música, política, redes) sin haber profundizado realmente?`,
      },
    ],
  });

  console.log("✓ Cadalso: Carta XXXV + nueva obra con fragmento creados.");

  // ════════════════════════════════════════════════════════════
  // MORATÍN — nueva obra La comedia nueva o El café
  // ════════════════════════════════════════════════════════════
  const moratin = await prisma.author.findFirstOrThrow({ where: { name: { contains: "Moratín" } } });

  console.log("Creando obra La comedia nueva o El café...");
  const comediaNueva = await prisma.work.create({
    data: {
      slug: "la-comedia-nueva-o-el-cafe",
      title: "La comedia nueva o El café",
      year: 1792,
      era: "Ilustración",
      genre: "Comedia neoclásica",
      synopsis: `Comedia metateatral: don Eleuterio, autor sin formación ni talento, estrena una disparatada comedia de capa y espada que es un fracaso estrepitoso. Don Pedro, espectador de gusto neoclásico, ejerce de crítico despiadado pero honesto, mientras don Hermógenes, falso erudito, defiende la obra con citas pomposas e inútiles. Moratín ataca así, desde dentro del propio teatro, la mala comedia comercial de su época y reclama una reforma basada en el estudio y las reglas.`,
      authorId: moratin.id,
    },
  });

  const cafeText = `DON PEDRO.- Vamos; no hay quien pueda sufrir tanto disparate. (Se levanta impaciente, en ademán de irse.)

DON ELEUTERIO.- ¿Disparates los llama usted?

DON PEDRO.- ¿Pues no?

DON ELEUTERIO.- ¡Vaya, que es también demasiado! ¡Disparates! ¡Pues no, no los llaman disparates los hombres inteligentes que han leído la comedia! Cierto que me ha chocado. ¡Disparates! Y no se ve otra cosa en el teatro todos los días, y siempre gusta, y siempre lo aplauden a rabiar.

DON PEDRO.- ¿Y esto se representa en una nación culta?

[...]

DON PEDRO.- A mí me lastima, en verdad, la suerte de estos escritores, que entontecen al vulgo con obras desatinadas y monstruosas, dictadas más que por el ingenio por la necesidad o la presunción. Yo no conozco al autor de esa comedia ni sé quién es; pero si ustedes, como parece, son amigos suyos, díganle en caridad que se deje de escribir tales desvaríos; que aún está a tiempo, puesto que es la primera obra que publica; que no le engañe el mal ejemplo de los que deliran a destajo; que siga otra carrera, en que por medio de un trabajo honesto podrá socorrer sus necesidades y asistir a su familia, si la tiene.

[...]

DON HERMÓGENES.- Bien dice Séneca en su epístola dieciocho que...

DON PEDRO.- Séneca dice en todas sus epístolas que usted es un pedantón ridículo a quien yo no puedo aguantar. Adiós, señores.`;

  console.log("Creando fragmento de La comedia nueva...");
  const fragCafe = await prisma.fragment.create({
    data: {
      slug: "la-comedia-nueva-disparates",
      title: "¿Disparates los llama usted?",
      location: "La comedia nueva o El café, Acto I, Escena III y V",
      headline: "«Séneca dice en todas sus epístolas que usted es un pedantón ridículo»",
      text: cafeText,
      order: 1,
      status: "published",
      workId: comediaNueva.id,
      constellations: { connect: [{ id: consCriticaSocial.id }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragCafe.id,
        type: "glosa",
        ...anchor(cafeText, "pedantón"),
        order: 1,
        content: `Aumentativo despectivo de «pedante»: persona que hace ostentación de erudición vana, citando autores y fuentes sin venir a cuento ni aportar argumento real, como hace don Hermógenes invocando a Séneca.`,
      },
      {
        fragmentId: fragCafe.id,
        type: "contexto",
        ...anchor(cafeText, "que no le engañe el mal ejemplo de los que deliran a destajo"),
        order: 1,
        content: `Don Pedro representa el ideal neoclásico de crítica: severa pero compasiva, dirigida a corregir, no solo a humillar. Su consejo a don Eleuterio —que abandone la escritura y «socorra sus necesidades» con un oficio honesto— es exactamente lo que sucede al final de la obra, cuando el propio autor, arrepentido, quema su comedia.`,
      },
      {
        fragmentId: fragCafe.id,
        type: "figura",
        category: "tropo",
        ...anchor(cafeText, "Séneca dice en todas sus epístolas que usted es un pedantón ridículo"),
        order: 1,
        content: `**Ironía**: don Pedro retoma literalmente la fórmula de autoridad de don Hermógenes («Bien dice Séneca...») para invertirla y dirigirla contra él mismo, dejando en evidencia que citar a un clásico no es, por sí solo, un argumento.`,
      },
      {
        fragmentId: fragCafe.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Qué dos posturas distintas representan don Pedro y don Hermógenes ante la comedia de don Eleuterio?`,
      },
      {
        fragmentId: fragCafe.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 2,
        content: `Moratín plantea aquí qué es la crítica honesta frente a la adulación interesada. ¿Crees que la crítica severa de don Pedro está justificada, o te parece excesiva?`,
      },
    ],
  });

  console.log("✓ Moratín: nueva obra + fragmento creados.");

  console.log("\n✓ TOTAL: 6 fragmentos nuevos, 5 obras nuevas, 1 autor nuevo (Iriarte).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
