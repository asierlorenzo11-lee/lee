import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

/** Ancla una anotación a la primera aparición de `needle` dentro de `text`. */
function anchor(text: string, needle: string): { anchorStart: number; anchorEnd: number } {
  const anchorStart = text.indexOf(needle);
  if (anchorStart === -1) {
    throw new Error(`No se encontró el ancla "${needle}"`);
  }
  return { anchorStart, anchorEnd: anchorStart + needle.length };
}

async function main() {
  console.log("Limpiando datos existentes...");
  await prisma.annotation.deleteMany();
  await prisma.itineraryFragment.deleteMany();
  await prisma.itinerary.deleteMany();
  await prisma.fragment.deleteMany();
  await prisma.work.deleteMany();
  await prisma.author.deleteMany();
  await prisma.constellation.deleteMany();
  await prisma.character.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.place.deleteMany();

  // ---------------------------------------------------------------------
  // Constelaciones, personajes, tópicos literarios y lugares
  // ---------------------------------------------------------------------
  console.log("Creando taxonomías...");

  await prisma.constellation.createMany({
    data: [
      { slug: "amor", name: "Amor" },
      { slug: "muerte", name: "Muerte" },
      { slug: "poder", name: "Poder" },
      { slug: "honor-y-destierro", name: "Honor y destierro" },
      { slug: "paso-del-tiempo", name: "El paso del tiempo" },
      { slug: "honor-y-valor", name: "Honor y valor" },
      { slug: "fe", name: "Fe y religiosidad" },
      { slug: "critica-social", name: "Crítica social" },
    ],
  });

  await prisma.character.createMany({
    data: [
      { slug: "celestina", name: "Celestina" },
      { slug: "calisto", name: "Calisto" },
      { slug: "melibea", name: "Melibea" },
      { slug: "pleberio", name: "Pleberio" },
      { slug: "sempronio", name: "Sempronio" },
      { slug: "parmeno", name: "Pármeno" },
      { slug: "elicia", name: "Elicia" },
      { slug: "el-cid", name: "Rodrigo Díaz de Vivar (el Cid)" },
      { slug: "jimena", name: "Doña Jimena" },
      { slug: "hijas-del-cid", name: "Doña Elvira y doña Sol (hijas del Cid)" },
      { slug: "infantes-de-carrion", name: "Los infantes de Carrión" },
      { slug: "lazaro-de-tormes", name: "Lázaro de Tormes" },
      { slug: "don-quijote", name: "Don Quijote de la Mancha" },
      { slug: "sancho-panza", name: "Sancho Panza" },
      { slug: "leonor-de-ribera", name: "Leonor de Ribera (disfrazada de don Leonardo Ponce de León)" },
      { slug: "segismundo", name: "Segismundo" },
      { slug: "laurencia", name: "Laurencia" },
      { slug: "frondoso", name: "Frondoso" },
      { slug: "fernan-gomez", name: "Fernán Gómez (el comendador)" },
      { slug: "esteban", name: "Esteban (alcalde de Fuente Ovejuna)" },
      { slug: "virgen-maria", name: "La Virgen María" },
      { slug: "arcipreste-de-hita", name: "El Arcipreste (Juan Ruiz)" },
      { slug: "amor-personificado", name: "El Amor (personificación)" },
      { slug: "trotaconventos", name: "Trotaconventos" },
      { slug: "conde-lucanor", name: "El conde Lucanor" },
      { slug: "patronio", name: "Patronio" },
      { slug: "conde-fernan-gonzalez", name: "El conde Fernán González" },
      { slug: "gazel", name: "Gazel" },
      { slug: "ben-beley", name: "Ben-Beley" },
      { slug: "nuno-nunez", name: "Nuño Núñez" },
      { slug: "don-diego", name: "Don Diego" },
      { slug: "dona-francisca", name: "Doña Francisca (Paquita)" },
      { slug: "don-carlos", name: "Don Carlos" },
      { slug: "dona-irene", name: "Doña Irene" },
      { slug: "rita", name: "Rita" },
      { slug: "don-felix-de-montemar", name: "Don Félix de Montemar" },
      { slug: "elvira-de-pastrana", name: "Elvira" },
      { slug: "don-diego-de-pastrana", name: "Don Diego de Pastrana" },
      { slug: "figaro", name: "Fígaro (Mariano José de Larra)" },
      { slug: "braulio", name: "Braulio" },
      { slug: "monsieur-sans-delai", name: "Monsieur Sans-délai" },
    ],
  });

  await prisma.topic.createMany({
    data: [
      {
        slug: "carpe-diem",
        name: "Carpe diem",
        description:
          "Del latín «aprovecha el día» (Horacio, Odas I, 11). Tópico que invita a gozar del presente —la juventud, la belleza, el placer— frente a la certeza de su fin. Muy frecuente en la poesía renacentista y barroca.",
      },
      {
        slug: "ubi-sunt",
        name: "Ubi sunt",
        description:
          "Del latín «¿dónde están?». Fórmula retórica que enumera personas, glorias o bienes desaparecidos para subrayar la fugacidad de la vida y la vanidad de lo mundano. Presente desde la poesía bíblica hasta Jorge Manrique.",
      },
      {
        slug: "contemptus-mundi",
        name: "Contemptus mundi",
        description:
          "«Desprecio del mundo»: tópico medieval que invita a despreciar los bienes y placeres terrenales, vanos y pasajeros, en favor de los valores eternos. Tiene su origen en tratados ascéticos como el «De contemptu mundi».",
      },
      {
        slug: "beatus-ille",
        name: "Beatus ille",
        description:
          "Del latín «dichoso aquel» (Horacio, Épodo II). Tópico que alaba la vida sencilla y retirada en el campo, lejos de la ambición, el lujo y el ruido de la ciudad, como ideal de paz y libertad interior. Muy desarrollado por la poesía moral y religiosa del Renacimiento.",
      },
      {
        slug: "tempus-fugit",
        name: "Tempus fugit",
        description:
          "«El tiempo huye». Tópico que expresa la conciencia del paso irreversible del tiempo y de la propia mortalidad; suele aparecer junto al carpe diem, como su reverso amenazante.",
      },
      {
        slug: "locus-amoenus",
        name: "Locus amoenus",
        description:
          "«Lugar ameno»: paisaje idealizado —prado, arboleda, fuente, brisa suave— que sirve de marco apacible para el amor, la poesía o la reflexión, heredado de la tradición bucólica clásica.",
      },
      {
        slug: "amor-cortes",
        name: "Amor cortés",
        description:
          "Código poético de origen trovadoresco que representa el amor como vasallaje: el amante sirve, sufre y permanece fiel a una dama (o a un amado) idealizado, a menudo ausente o inalcanzable. Atraviesa la lírica medieval, el petrarquismo renacentista y la poesía barroca.",
      },
      {
        slug: "mistica",
        name: "Mística",
        description:
          "Poesía que describe la unión del alma con Dios mediante el lenguaje del amor humano —deseo, ausencia, noche, esposo—, propia de autores como San Juan de la Cruz y Santa Teresa de Jesús en el siglo XVI.",
      },
      {
        slug: "desengano",
        name: "Desengaño",
        description:
          "Tópico central del Barroco español: la conciencia de que las apariencias —la riqueza, el poder, la gloria, incluso la propia vida— son ilusorias o efímeras, y de que solo el despertar a esa verdad permite ver el mundo «como es». De ahí fórmulas como «la vida es sueño» o la distinción entre lo que algo parece y lo que realmente es.",
      },
    ],
  });

  await prisma.place.createMany({
    data: [
      {
        slug: "salamanca",
        name: "Salamanca",
        lat: 40.9701,
        lng: -5.6635,
        description:
          "Ciudad universitaria castellana donde Fernando de Rojas, autor de La Celestina, cursó estudios de Derecho. Aunque la acción de la obra no se localiza expresamente, buena parte de la crítica ha situado su ambiente urbano en Salamanca. Fue también la ciudad donde fray Luis de León enseñó teología y Biblia durante décadas en su universidad, con un largo paréntesis forzoso cuando la Inquisición lo procesó y encarceló.",
      },
      {
        slug: "vivar-del-cid",
        name: "Vivar del Cid (Burgos)",
        lat: 42.3875,
        lng: -3.6906,
        description:
          "Pequeña localidad cercana a Burgos, solar originario de Rodrigo Díaz de Vivar. El Cantar de Mio Cid arranca precisamente con la marcha del héroe desde esta casa, camino del destierro.",
      },
      {
        slug: "toledo",
        name: "Toledo",
        lat: 39.8628,
        lng: -4.0273,
        description:
          "Ciudad natal de Garcilaso de la Vega (1501), una de las cortes más activas culturalmente de la España del siglo XVI.",
      },
      {
        slug: "sevilla",
        name: "Sevilla",
        lat: 37.3886,
        lng: -5.9823,
        description:
          "Ciudad natal de Gustavo Adolfo Bécquer (1836), cuya obra, sin embargo, se desarrolló y se publicó principalmente en Madrid.",
      },
      {
        slug: "vigo",
        name: "Vigo",
        lat: 42.2406,
        lng: -8.7207,
        description:
          "Ciudad portuaria gallega que da nombre a la ría a la que se dirige la voz femenina de las cantigas de amigo de Martín Codax, esperando el regreso de su amado por mar.",
      },
      {
        slug: "fontiveros",
        name: "Fontiveros (Ávila)",
        lat: 40.9436,
        lng: -4.9763,
        description:
          "Pequeña localidad abulense donde nació San Juan de la Cruz en 1542, en el seno de una familia humilde de tejedores.",
      },
      {
        slug: "avila",
        name: "Ávila",
        lat: 40.6566,
        lng: -4.6818,
        description:
          "Ciudad amurallada castellana donde Santa Teresa de Jesús nació, profesó como carmelita e inició la reforma de la orden que la llevaría a fundar conventos por toda España.",
      },
      {
        slug: "granada",
        name: "Granada",
        lat: 37.1773,
        lng: -3.5986,
        description:
          "Último reino musulmán de la península, conquistado por los Reyes Católicos en 1492. Su Alhambra, descrita como una dama cortejada por el rey cristiano, protagoniza el diálogo alegórico del Romance de Abenámar.",
      },
      {
        slug: "madrid",
        name: "Madrid",
        lat: 40.4168,
        lng: -3.7038,
        description:
          "Capital de la Monarquía Hispánica desde 1561 y sede de la corte de los Austrias, donde Calderón de la Barca estrenó La vida es sueño en 1635 ante Felipe IV, en el recién inaugurado Palacio del Buen Retiro.",
      },
      {
        slug: "fuenteovejuna",
        name: "Fuente Obejuna (Córdoba)",
        lat: 38.2667,
        lng: -5.4167,
        description:
          "Villa cordobesa donde, según la crónica, los vecinos dieron muerte en 1476 al comendador Fernán Gómez de Guzmán por sus abusos. Lope de Vega convirtió el suceso en una de las grandes tragedias del honor colectivo del teatro español.",
      },
      {
        slug: "campo-de-criptana",
        name: "Campo de Criptana (Ciudad Real)",
        lat: 39.4097,
        lng: -3.1211,
        description:
          "Localidad manchega célebre por sus molinos de viento sobre el cerro de la Paz, identificados tradicionalmente con los «gigantes» que don Quijote embiste en el capítulo VIII de la primera parte.",
      },
      {
        slug: "cadiz",
        name: "Cádiz",
        lat: 36.5298,
        lng: -6.2926,
        description:
          "Ciudad natal de José de Cadalso (1741), plaza militar y puerta marítima de Andalucía hacia América, en cuyas inmediaciones sitúa Nuño el lance del «caballerete» que relata en la Carta VII de las Cartas marruecas.",
      },
      {
        slug: "alcala-de-henares",
        name: "Alcalá de Henares",
        lat: 40.4818,
        lng: -3.3650,
        description:
          "Ciudad universitaria a pocas leguas de Madrid, célebre por su antigua universidad fundada por Cisneros. En una posada de Alcalá transcurre, a lo largo de una sola noche, la acción de El sí de las niñas de Moratín.",
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Autores y obras
  // ---------------------------------------------------------------------
  console.log("Creando autores y obras...");

  const rojas = await prisma.author.create({
    data: {
      slug: "fernando-de-rojas",
      name: "Fernando de Rojas",
      birthYear: 1465,
      deathYear: 1541,
      country: "España",
      era: "Tránsito a la Edad Moderna",
      bio: `Jurista de origen converso, nacido hacia 1465 en La Puebla de Montalbán (Toledo). La tradición crítica le atribuye la redacción de la mayor parte de *La Celestina*, publicada por primera vez como *Comedia de Calisto y Melibea* en 1499 y ampliada poco después como *Tragicomedia*. Ejerció la abogacía en Talavera de la Reina, de la que llegó a ser alcalde, y no se le conoce ninguna otra obra literaria.`,
      portraitUrl: "/images/authors/fernando-de-rojas.jpg",
    },
  });

  const anonimoCid = await prisma.author.create({
    data: {
      slug: "anonimo-cantar-de-mio-cid",
      name: "Anónimo",
      country: "España",
      era: "Edad Media",
      bio: `Autor o autores desconocidos del poema que la crítica conoce como *Cantar de Mio Cid*, la obra cumbre de la épica medieval en castellano. El manuscrito conservado fue copiado por Per Abbat en 1207, aunque el poema —compuesto para ser recitado por juglares— es probablemente anterior. Narra, con notable libertad respecto a los hechos históricos documentados, el destierro y la posterior restitución del honor del caballero Rodrigo Díaz de Vivar.`,
      portraitUrl: "/images/authors/anonimo-cantar-de-mio-cid.jpg",
    },
  });

  const garcilaso = await prisma.author.create({
    data: {
      slug: "garcilaso-de-la-vega",
      name: "Garcilaso de la Vega",
      birthYear: 1501,
      deathYear: 1536,
      country: "España",
      era: "Renacimiento",
      bio: `Poeta y soldado toledano (1501-1536). Introdujo en la lírica castellana las formas y los temas del petrarquismo italiano —el endecasílabo, el soneto, la égloga— en buena medida gracias a su amistad con el humanista catalán Juan Boscán. Murió en campaña, en Niza, a los treinta y cinco años. Su obra, breve, se publicó póstumamente en 1543 y se convirtió en modelo de la poesía española durante generaciones.`,
      portraitUrl: "/images/authors/garcilaso-de-la-vega.jpg",
    },
  });

  const becquer = await prisma.author.create({
    data: {
      slug: "gustavo-adolfo-becquer",
      name: "Gustavo Adolfo Bécquer",
      birthYear: 1836,
      deathYear: 1870,
      country: "España",
      era: "Romanticismo",
      bio: `Poeta y narrador sevillano (1836-1870), figura clave en el tránsito del Romanticismo hacia una lírica más íntima y depurada. Sus *Rimas*, reconstruidas por sus amigos tras la pérdida de un primer manuscrito durante los disturbios de 1868 y publicadas póstumamente en 1871, ejercieron una influencia decisiva sobre la poesía española e hispanoamericana posterior, de Rubén Darío a Antonio Machado.`,
      portraitUrl: "/images/authors/gustavo-adolfo-becquer.jpg",
    },
  });

  const laCelestina = await prisma.work.create({
    data: {
      slug: "la-celestina",
      title: "La Celestina",
      translatedTitle: "Tragicomedia de Calisto y Melibea",
      year: 1499,
      era: "Tránsito a la Edad Moderna",
      genre: "Novela dialogada",
      synopsis: `Calisto se enamora a primera vista de Melibea y recurre a la vieja alcahueta Celestina para conquistarla. Lo que empieza como una intriga amorosa, alimentada por la codicia de Celestina y de los criados de Calisto, desencadena una cadena de muertes que culmina en la de los propios protagonistas y en el desconsolado lamento final del padre de Melibea, Pleberio.`,
      authorId: rojas.id,
    },
  });

  const cantarDeMioCid = await prisma.work.create({
    data: {
      slug: "cantar-de-mio-cid",
      title: "Cantar de Mio Cid",
      year: 1207,
      era: "Edad Media",
      genre: "Cantar de gesta (poesía épica)",
      synopsis: `El rey Alfonso VI destierra a Rodrigo Díaz de Vivar, el Cid, acusado injustamente por sus enemigos. A lo largo del poema, el héroe recupera su honor mediante victorias militares, casa a sus hijas con los infantes de Carrión —que resultarán ser cobardes y traidores— y, tras la afrenta de Corpes, obtiene justicia real y un nuevo y mejor matrimonio para sus hijas.`,
      authorId: anonimoCid.id,
    },
  });

  const sonetos = await prisma.work.create({
    data: {
      slug: "sonetos-garcilaso",
      title: "Sonetos",
      year: 1543,
      era: "Renacimiento",
      genre: "Poesía lírica (soneto)",
      synopsis: `Colección de treinta y ocho sonetos de tema mayoritariamente amoroso, escritos siguiendo el modelo petrarquista y publicados póstumamente junto a la obra de Juan Boscán. El soneto XXIII, uno de los más conocidos, desarrolla el tópico del carpe diem a partir de la descripción de la belleza femenina.`,
      authorId: garcilaso.id,
    },
  });

  const egloga3 = await prisma.work.create({
    data: {
      slug: "egloga-iii",
      title: "Égloga III",
      year: 1536,
      era: "Renacimiento",
      genre: "Poesía bucólica (égloga)",
      synopsis: `Cuatro ninfas del Tajo bordan, a la sombra de una espesura, tapices que narran historias de amores desgraciados —Orfeo y Eurídice, Venus y Adonis— hasta llegar a la muerte de la ninfa Elisa, trasunto de Isabel Freyre, la amada de Garcilaso. Al caer la tarde, dos pastores, Tirreno y Alcino, cantan alternativamente sus amores, uno feliz y otro desdichado, antes de que las ninfas regresen al río.`,
      authorId: garcilaso.id,
    },
  });

  const rimas = await prisma.work.create({
    data: {
      slug: "rimas",
      title: "Rimas",
      year: 1871,
      era: "Romanticismo",
      genre: "Poesía lírica",
      synopsis: `Conjunto de poemas breves de tema amoroso y existencial, reconstruidos por los amigos de Bécquer y publicados póstumamente en 1871. La Rima LIII, «Volverán las oscuras golondrinas», es una de las más célebres y desarrolla el contraste entre los ciclos de la naturaleza y la irrepetibilidad de una historia de amor.`,
      authorId: becquer.id,
    },
  });

  // ---------------------------------------------------------------------
  // Fragmentos
  // ---------------------------------------------------------------------
  console.log("Creando fragmentos...");

  const rechazoText = `CALISTO. En esto veo, Melibea, la grandeza de Dios.

MELIBEA. ¿En qué, Calisto?

CALISTO. En dar poder a natura que de tan perfecta hermosura te dotase, y hacer a mí, inmérito, tanta merced que verte alcanzase, y en tan conveniente lugar, que mi secreto dolor manifestarte pudiese. Sin duda, incomparablemente es mayor tal galardón que el servicio, sacrificio, devoción y obras pías que, por este lugar alcanzar, yo tengo a Dios ofrecido. ¿Quién vido en esta vida cuerpo glorificado de ningún hombre como agora el mío? Por cierto, los gloriosos santos que se deleitan en la visión divina no gozan más que yo agora en el acatamiento tuyo. Mas, ¡oh triste!, que en esto deferimos, que ellos puramente se glorifican sin temor de caer de tal bienaventuranza, y yo, mixto, me alegro con recelo del esquivo tormento, que tu ausencia me ha de causar.

MELIBEA. ¿Por gran premio tienes este, Calisto?

CALISTO. Téngolo por tanto, en verdad, que si Dios me diese en el cielo la silla sobre sus santos, no lo ternía por tanta felicidad.

MELIBEA. Pues aun más igual galardón te daré yo, si perseveras.

CALISTO. ¡Oh bienaventuradas orejas mías que indignamente tan gran palabra habéis oído!

MELIBEA. Mas desventuradas de que me acabes de oír, porque la paga será tan fiera cual merece tu loco atrevimiento.`;

  const fragRechazo = await prisma.fragment.create({
    data: {
      slug: "calisto-es-rechazado-por-melibea",
      title: "Calisto es rechazado por Melibea",
      location: "Acto I",
      headline: "En esto veo, Melibea, la grandeza de Dios",
      text: rechazoText,
      order: 1,
      status: "published",
      featured: false,
      workId: laCelestina.id,
      constellations: { connect: [{ slug: "amor" }] },
      topics: { connect: [{ slug: "amor-cortes" }] },
      characters: { connect: [{ slug: "calisto" }, { slug: "melibea" }] },
      places: { connect: [{ slug: "salamanca" }] },
      artworkImageUrl: "/images/artworks/gerome-pigmalion-y-galatea.jpg",
      artworkTitle: "Pigmalión y Galatea",
      artworkAuthor: "Jean-Léon Gérôme, 1890",
      artworkCaption:
        "La adoración de Calisto por Melibea —convertida en ídolo y objeto de culto religioso más que en persona real— tiene su equivalente pictórico perfecto en el mito de Pigmalión: el hombre que ama una imagen que él mismo ha fabricado, incapaz de ver a la mujer real detrás de la figura que proyecta sobre ella.",
    },
  });

  const conjuroText = `Conjúrote, triste Plutón, señor de la profundidad infernal, emperador de la corte dañada, capitán soberbio de los condenados ángeles, señor de los sulfúreos fuegos que los hirvientes montes de Etna manan, gobernador y veedor de los tormentos y atormentadores de las almas que pecaron, regidor de las tres Furias, Tesífone, Megera y Aletón, administrador de todas las cosas negras del reino de Estigia y Dite, con todas sus lagunas y sombras infernales, litigioso caos, mantenedor de las volantes harpías, con toda la otra compañía de espantables y espantosas hidras.

Yo, Celestina, tu más conocida clientela, te conjuro por la virtud y fuerza destas bermejas letras; por la sangre de aquella nocturna ave con que están escritas; por la gravedad de aquestos nombres y signos que en este papel se contienen; por la áspera ponzoña de las víboras de que este aceite fue hecho, con el cual unto este hilado.

Vengas sin tardanza a obedecer mi voluntad, y en ello te envuelvas, y con ello estés sin un momento te partir, hasta que Melibea, con aparejada oportunidad que haya, lo compre, y con ello de tal manera quede enredada que, cuanto más lo mirare, tanto más su corazón se ablande a conceder mi petición y se le abras y lastimes del crudo y fuerte amor de Calisto.

Si no lo hicieres, ten por entendido que tendrás de mí enojo, y que con otras palabras más duras que estas te apremiaré. Pero, confiando en tu mucho poder, doy fin a mi conjuro.`;

  const fragConjuro = await prisma.fragment.create({
    data: {
      slug: "conjuro-a-pluton",
      title: "Conjuro a Plutón",
      location: "Acto III",
      headline: "Brujería para principiantes",
      text: conjuroText,
      order: 2,
      status: "published",
      featured: true,
      featuredDate: new Date(),
      workId: laCelestina.id,
      constellations: { connect: [{ slug: "amor" }, { slug: "poder" }] },
      characters: {
        connect: [{ slug: "celestina" }, { slug: "calisto" }, { slug: "melibea" }],
      },
      places: { connect: [{ slug: "salamanca" }] },
      artworkImageUrl:
        "/images/artworks/goya-el-aquelarre.jpg",
      artworkTitle: "El aquelarre (Las brujas)",
      artworkAuthor: "Francisco de Goya, 1797-1798",
      artworkCaption:
        "Uno de los seis «cuadros de gabinete» sobre brujería que Goya pintó para los duques de Osuna. La escena —un aquelarre presidido por un macho cabrío— pertenece al mismo imaginario de hechicería popular e infernal que Celestina invoca en su conjuro.",
    },
  });

  const plantoText = `¡Oh mundo, mundo! Muchos mucho de ti dijeron, muchos en tus cualidades metieron la mano, a diversas cosas por oírte fueron comparados; yo por más decir de ti, no hallo cosa más propia que la comparación.

¿Para quién trabajé? ¿Para quién planté árboles? ¿Para quién fabriqué navíos? ¡Oh fortuna variable, ministra y mayordoma de los temporales bienes! ¿Por qué no ejecutaste tu cruel ira, tus mudables ondas, en aquello que a ti es subjeto? ¿Por qué no destruiste mi patrimonio? ¿Por qué no asolaste mis grandes heredamientos?

Dejárasme aquella flor, que faltando, todos los otros bienes me quedaban sin fruto. ¡Oh mi compañera buena! ¡Oh mi hija despedazada! ¿Por qué no quisiste que estorbase tu muerte? ¿Por qué no hubiste compasión de tu querida y amada madre? ¿Por qué me dejaste penado y solo in hac lacrymarum valle?

Del mundo me quejo, porque en sí me crió, porque no dándome vida no engendrara en él a Melibea; no naciendo, no amara; no amando, cesara mi quejosa y desconsolada postrimería. ¡Oh amor, amor! No pensé que tenías fuerza ni poder de matar a tus sujetos. Herida fue de ti mi juventud; por medio de tus brasas pasó mi mocedad, ¿y ahora, en mi vejez, me alcanza tu fuego?`;

  const fragPlanto = await prisma.fragment.create({
    data: {
      slug: "planto-de-pleberio",
      title: "Planto de Pleberio",
      location: "Acto XXI",
      headline: "Lo que queda cuando todo cae",
      text: plantoText,
      order: 6,
      status: "published",
      featured: false,
      workId: laCelestina.id,
      constellations: { connect: [{ slug: "muerte" }, { slug: "amor" }] },
      characters: { connect: [{ slug: "pleberio" }, { slug: "melibea" }] },
      topics: { connect: [{ slug: "ubi-sunt" }, { slug: "contemptus-mundi" }] },
      places: { connect: [{ slug: "salamanca" }] },
      artworkImageUrl:
        "/images/artworks/pereda-sueno-del-caballero.jpg",
      artworkTitle: "El sueño del caballero",
      artworkAuthor: "Antonio de Pereda, h. 1655",
      artworkCaption:
        "Vanitas barroca: un caballero duerme rodeado de símbolos de la fugacidad de los bienes, los honores y la propia vida —el mismo «ubi sunt» que articula el lamento de Pleberio sobre lo que el tiempo y la muerte se llevan.",
    },
  });

  const alcahuetaText = `CELESTINA. Bien ternás, señora, noticia en esta ciudad de un caballero mancebo, gentilhombre de clara sangre, que llaman Calisto.

MELIBEA. Ya, ya, ya, buena vieja, no me digas más. No pases adelante. ¿Ese es el doliente por quien has hecho tantas premisas en tu demanda, por quien has venido a buscar la muerte para ti, por quien has dado tan dañosos pasos? Desvergonzada barbuda, ¿qué siente ese perdido, que con tanta pasión vienes? De locura será su mal. ¿Qué te parece? Si me hallaras sin sospecha dese loco, ¿con qué palabras me entrabas? No se dice en vano que el más empecible miembro del mal hombre o mujer es la lengua. ¡Quemada seas, alcahueta falsa, hechicera, enemiga de honestidad, causadora de secretos yerros! ¡Jesú, Jesú! [...]`;

  const fragAlcahueta = await prisma.fragment.create({
    data: {
      slug: "la-alcahueta-celestina-y-su-mediacion",
      title: "La alcahueta Celestina y su mediación",
      location: "Acto IV",
      headline: "¡Quemada seas, alcahueta falsa, hechicera!",
      text: alcahuetaText,
      order: 3,
      status: "published",
      featured: false,
      workId: laCelestina.id,
      constellations: { connect: [{ slug: "amor" }, { slug: "poder" }] },
      characters: { connect: [{ slug: "celestina" }, { slug: "melibea" }] },
      places: { connect: [{ slug: "salamanca" }] },
      artworkImageUrl: "/images/artworks/van-honthorst-la-alcahueta.jpg",
      artworkTitle: "La alcahueta",
      artworkAuthor: "Gerard van Honthorst, 1625",
      artworkCaption:
        "Una vieja sostiene una vela mientras observa, con expresión cómplice, a dos jóvenes que conversan en la penumbra: la misma escena de mediación clandestina que Celestina pone en marcha al entrar en casa de Melibea con el pretexto de venderle unas mercancías.",
    },
  });

  const melibeaReconoceText = `MELIBEA. Tantas veces me nombrarás ese tu caballero, que ni mi promesa baste, ni la fe que te di, a sufrir tus dichos. ¿De qué ha de quedar pagado? ¿Qué le debo yo a él? ¿Qué le soy en cargo? ¿Qué ha hecho por mí? ¿Qué necesario es él aquí para el propósito de mi mal? Más agradable me sería que rasgases mis carnes y sacases mi corazón, que no traer esas palabras aquí.

CELESTINA. Sin te romper las vistiduras se lanzó en tu pecho el amor; no rasgaré yo tus carnes para le curar.

MELIBEA. ¿Cómo dices que llaman a este mi dolor, que así se ha enseñoreado en lo mejor de mi cuerpo?

CELESTINA. Amor dulce.

MELIBEA. Esto me declara qué es, que en solo oírlo me alegro.

CELESTINA. Es un huego escondido, una agradable llaga, un sabroso veneno, una dulce amargura, una delectable dolencia, un alegre tormento, una dulce y fiera herida, una blanda muerte.`;

  const fragMelibeaReconoce = await prisma.fragment.create({
    data: {
      slug: "melibea-reconoce-su-amor-por-calisto",
      title: "Melibea reconoce su amor por Calisto",
      location: "Acto IV",
      headline: "Una dulce y fiera herida, una blanda muerte",
      text: melibeaReconoceText,
      order: 4,
      status: "published",
      featured: false,
      workId: laCelestina.id,
      constellations: { connect: [{ slug: "amor" }] },
      topics: { connect: [{ slug: "amor-cortes" }] },
      characters: { connect: [{ slug: "celestina" }, { slug: "melibea" }] },
      places: { connect: [{ slug: "salamanca" }] },
      artworkImageUrl: "/images/artworks/titian-amor-sacro-y-amor-profano.jpg",
      artworkTitle: "El amor sagrado y el amor profano",
      artworkAuthor: "Tiziano, h. 1514",
      artworkCaption:
        "Las dos figuras femeninas que protagonizan este cuadro —una vestida y recatada, otra desnuda y libre— encarnan con exactitud la tensión interior de Melibea: el combate entre la honra que la obliga a resistir y el deseo que Celestina va desvelando capa a capa hasta que la joven reconoce lo que ya no puede negar.",
    },
  });

  const muerteCelestinaText = `SEMPRONIO. ¡Oh vieja avarienta, garganta muerta de sed por dinero! ¡No serás contenta con la tercia parte de lo ganado?

CELESTINA. ¿Qué tercia parte? ¡Vete con Dios de mi casa tú, y esotro no dé voces, no allegue la vecindad! No me hagáis salir de seso, no queráis que salgan a plaza las cosas de Calisto y vuestras.

SEMPRONIO. ¡Da voces o gritos, que tú complirás lo que prometiste o complirás hoy tus días!

ELICIA. ¡Mete, por Dios, el espada! ¡Tenle, Pármeno, tenle! ¡No la mate ese desvariado!

CELESTINA. ¡Justicia, justicia, señores vecinos; justicia, que me matan en mi casa estos rufianes!

SEMPRONIO. ¿Rufianes o qué? Esperad, doña hechicera, que yo te haré ir al infierno con cartas.

CELESTINA. ¡Ay, que me ha muerto, ay, ay! ¡Confesión, confesión!

PÁRMENO. ¡Dale, dale; acábala, pues comenzaste! ¡Que nos sentirán! ¡Muera, muera; de los enemigos, los menos!`;

  const fragMuerteCelestina = await prisma.fragment.create({
    data: {
      slug: "muerte-de-celestina",
      title: "Muerte de Celestina",
      location: "Acto XII",
      headline: "¡Justicia, justicia, señores vecinos!",
      text: muerteCelestinaText,
      order: 5,
      status: "published",
      featured: false,
      workId: laCelestina.id,
      constellations: { connect: [{ slug: "muerte" }, { slug: "poder" }] },
      characters: {
        connect: [
          { slug: "celestina" },
          { slug: "sempronio" },
          { slug: "parmeno" },
          { slug: "elicia" },
        ],
      },
      places: { connect: [{ slug: "salamanca" }] },
      artworkImageUrl: "/images/artworks/gentileschi-judith-decapitando-a-holofernes.jpg",
      artworkTitle: "Judith decapitando a Holofernes",
      artworkAuthor: "Artemisia Gentileschi, 1614-1620",
      artworkCaption:
        "La violencia súbita, doméstica y sin grandeza épica que mata a Celestina —una anciana asesinada por sus propios cómplices en una disputa de dinero— tiene su paralelo más perturbador en Gentileschi: una muerte ejecutada a sangre fría, sin distancia heroica, con toda la brutalidad física que la literatura renacentista pocas veces nombra tan directamente.",
    },
  });

  const cidText = `De los sos ojos tan fuertemiente llorando,
tornaba la cabeça e estábalos catando.
Vio puertas abiertas e uços sin cañados,
alcándaras vázias, sin pielles e sin mantos,
e sin falcones e sin adtores mudados.
Sospiró mio Çid, ca mucho avíe grandes cuidados.
Fabló mio Çid bien e tan mesurado:
«¡Grado a ti, señor, padre que estás en alto!
¡Esto me an buolto mios enemigos malos!»

Allí pienssan de aguijar, allí sueltan las riendas;
a la exida de Bivar ovieron la corneja diestra,
e entrando a Burgos ovieron la siniestra.
Meció mio Çid los ombros e engrameó la tiesta:
«¡Albricia, Álbar Fáñez, ca echados somos de tierra!»`;

  const fragCid = await prisma.fragment.create({
    data: {
      slug: "destierro-del-cid",
      title: "El destierro del Cid",
      location: "Cantar I, vv. 1-15",
      headline: "El día que hasta los halcones huyeron",
      text: cidText,
      order: 1,
      status: "published",
      featured: false,
      workId: cantarDeMioCid.id,
      constellations: { connect: [{ slug: "honor-y-destierro" }, { slug: "poder" }] },
      characters: { connect: [{ slug: "el-cid" }] },
      places: { connect: [{ slug: "vivar-del-cid" }] },
      artworkImageUrl:
        "/images/artworks/jura-de-santa-gadea.jpg",
      artworkTitle: "Jura de Santa Gadea",
      artworkAuthor: "Marcos Hiráldez Acosta, 1864",
      artworkCaption:
        "Pintura histórica del siglo XIX que recrea el episodio legendario en el que el Cid obliga al rey Alfonso VI a jurar que no participó en la muerte de su hermano. Pertenece al mismo ciclo de leyendas que arranca con el destierro narrado en este fragmento.",
    },
  });

  const burgosText = `El Campeador, entonces, se dirigió a su posada;
así que llegó a la puerta, encontrósela cerrada;
por temor al rey Alfonso acordaron de cerrarla,
tal que si no la rompiesen, no se abriría por nada.
Los que van con mio Cid con grandes voces llamaban,
mas los que dentro vivían no respondían palabra.
Aguijó, entonces mio Cid, hasta la puerta llegaba;
sacó el pie de la estribera y en la puerta golpeaba,
mas no se abría la puerta que estaba muy bien cerrada.
Una niña de nueve años frente a mio Cid se para:
«Cid Campeador, que en buena hora ceñisteis la espada,
sabed que el rey lo ha vedado, anoche llegó su carta
con severas prevenciones y fuertemente sellada.
No nos atrevemos a daros asilo por nada,
porque si no perderíamos nuestras haciendas y casas,
y hasta podía costarnos los ojos de nuestras caras.
¡Oh buen Cid!, en nuestro mal no habíais de ganar nada;
esto la niña le dijo y se volvió hacia su casa.
Ya vio el Cid que de su rey no podía esperar gracia.
Partió de la puerta, entonces, por la ciudad aguijaba,
llega hasta Santa María, y a su puerta descabalga;
las rodillas hincó en tierra y de corazón rezaba.
Cuando acaba su oración, de nuevo mio Cid cabalga;
salió luego por la puerta y el río Armazón cruzaba.`;

  const fragBurgos = await prisma.fragment.create({
    data: {
      slug: "la-nina-de-burgos",
      title: "Cantar del destierro",
      location: "Cantar I (Burgos)",
      headline: "Una niña se atreve a hablar con el Cid",
      text: burgosText,
      order: 2,
      status: "published",
      featured: false,
      workId: cantarDeMioCid.id,
      constellations: { connect: [{ slug: "honor-y-destierro" }, { slug: "poder" }] },
      characters: { connect: [{ slug: "el-cid" }] },
      artworkImageUrl: "/images/artworks/cid-arcas-de-arena-burgos.jpg",
      artworkTitle: "Las arcas de arena",
      artworkAuthor: "Stories from the Chronicle of the Cid (Mary Wright Plummer), 1910",
      artworkCaption:
        "Grabado de una edición infantil inglesa de las leyendas del Cid: el Campeador, sin más garantía que su palabra, deja en prenda dos arcas llenas de arena —no de oro— para reunir dinero antes de partir al destierro. La misma Burgos que le cierra las puertas y le niega ayuda, como hace la niña de este fragmento, es el escenario de este otro episodio de necesidad y astucia.",
    },
  });

  const reencuentroText = `Cuando acabó la corrida, el Campeador descabalga,
y se va hacia su mujer y hacia sus hijas amadas;
al verlo doña Jimena, a los pies se le arrojaba:
«¡Merced, Campeador, que en buen hora ceñisteis la espada!
Sacado me habéis, al fin, de muchas vergüenzas malas;
aquí me tenéis, señor, a mí y a estas hijas ambas,
para Dios y para vos son buenas y bien criadas».
A la madre y a las hijas el Cid con amor abraza,
y del gozo que sentía sus ojos solo lloraban.
Todas las gentes del Cid con júbilo los miraban,
Las armas iban jugando, los tablados derribaban.
Oíd lo que dijo el Cid, que en buen hora ciñó espada:
«Vos, doña Jimena mía, mujer querida y honrada,
y mis dos hijas, que son mi corazón y mi alma,
entrad conmigo en Valencia que ella ha de ser vuestra casa,
es la heredad que yo quise para vosotras ganarla».
La madre con las dos hijas las manos del Cid besaban.
Y en medio de grande pompa todos en Valencia entraban.`;

  const fragReencuentro = await prisma.fragment.create({
    data: {
      slug: "el-reencuentro-en-valencia",
      title: "Cantar de las bodas",
      location: "Cantar II (reencuentro)",
      headline: "Valencia, vuestra casa",
      text: reencuentroText,
      order: 3,
      status: "published",
      featured: false,
      workId: cantarDeMioCid.id,
      constellations: { connect: [{ slug: "amor" }, { slug: "honor-y-valor" }] },
      characters: { connect: [{ slug: "el-cid" }, { slug: "jimena" }, { slug: "hijas-del-cid" }] },
      artworkImageUrl: "/images/artworks/el-cid-y-jimena-en-valencia.jpg",
      artworkTitle: "Reencuentro en las puertas de Valencia",
      artworkAuthor: "Stories from the Chronicle of the Cid (Mary Wright Plummer), 1910",
      artworkCaption:
        "Ilustración de una edición inglesa de las leyendas del Cid: el Campeador, acompañado de su séquito, recibe a una dama a las puertas de la ciudad conquistada. La escena evoca el momento en que Jimena y sus hijas entran en Valencia y la encuentran, por fin, convertida en su casa.",
    },
  });

  const bodasInfantesText = `Mi mujer, doña Jimena, roguemos al Creador.
A vos os digo, hijas mías, doña Elvira y doña Sol:
con estas bodas propuestas ganaremos en honor;
pero sabed en verdad que no las inicié yo:
os ha pedido y rogado don Alfonso, mi señor,
y lo hizo tan firmemente y de todo corazón,
que a ninguna cosa suya, supe decirle que no.
Os puse, pues, en sus manos, hijas mías, a las dos;
Creedme como os lo digo: él os casa, que no yo.`;

  const fragBodasInfantes = await prisma.fragment.create({
    data: {
      slug: "las-bodas-de-las-hijas-del-cid",
      title: "Cantar de las bodas",
      location: "Cantar II (bodas)",
      headline: "Él os casa, que no yo",
      text: bodasInfantesText,
      order: 4,
      status: "published",
      featured: false,
      workId: cantarDeMioCid.id,
      constellations: { connect: [{ slug: "honor-y-valor" }, { slug: "poder" }] },
      characters: {
        connect: [{ slug: "el-cid" }, { slug: "jimena" }, { slug: "hijas-del-cid" }, { slug: "infantes-de-carrion" }],
      },
      artworkImageUrl: "/images/artworks/cantar-de-mio-cid-folio-bodas.jpg",
      artworkTitle: "Cantar de mio Cid (folio del códice)",
      artworkAuthor: "Manuscrito de Per Abbat, 1207, Biblioteca Nacional de España",
      artworkCaption:
        "Reproducción de un folio del único códice conservado del Cantar de mio Cid, que recoge precisamente los versos en que un mensajero del rey Alfonso comunica al Cid la petición de casar a sus hijas con los infantes de Carrión. El propio manuscrito medieval es, así, el testigo material de las palabras que pronuncia el Cid en este fragmento.",
    },
  });

  const leonText = `En Valencia estaba el Cid y con él los suyos son,
y también ambos sus yernos los infantes de Carrión.
Acostado en su escaño dormía el Campeador.
Sabed la mala sorpresa que a todos aconteció;
escapose de la jaula, desatándose, un león.
Al saberlo, por la corte un grande miedo cundió.
Embrazan sus mantos las gentes del Campeador
y rodean el escaño donde duerme su señor.
Pero Fernán González, un infante de Carrión,
no encontró donde esconderse ni sala ni torre halló;
metiose bajo el escaño, tanto era su pavor.
El otro, Diego González, por la puerta se salió
gritando con grandes voces: «No volveré a ver Carrión».
Tras la viga de un lagar metiose con gran terror,
de donde manto y brial todo sucio lo sacó.
En esto, despertó el Cid, el que en buen hora nació,
viendo cercado su escaño de su servicio mejor:
«¿Qué es esto, decid, mesnadas? ¿Qué hacéis a mi alrededor?».
«Señor honrado, le dicen, gran susto nos dio el león».
Mio Cid hincó su codo y presto se levantó,
el manto colgado al cuello, se dirigió hacia el león.
Cuando el león le hubo visto, intimidado quedó,
y frente al Cid la cabeza bajando, el hocico hincó.
Mio Cid Rodrigo Díaz por el cuello lo cogió
y llevándolo adiestrado en la jaula lo metió.`;

  const fragLeon = await prisma.fragment.create({
    data: {
      slug: "el-cid-y-el-leon",
      title: "Cantar de la afrenta de Corpes",
      location: "Cantar III (el león)",
      headline: "El Cid doma al león; sus yernos huyen",
      text: leonText,
      order: 5,
      status: "published",
      featured: false,
      workId: cantarDeMioCid.id,
      constellations: { connect: [{ slug: "honor-y-valor" }, { slug: "poder" }] },
      characters: { connect: [{ slug: "el-cid" }, { slug: "infantes-de-carrion" }] },
      artworkImageUrl: "/images/artworks/el-cid-amansa-al-leon.jpg",
      artworkTitle: "El Cid amansa al león",
      artworkAuthor: "Stories from the Chronicle of the Cid (Mary Wright Plummer), 1910",
      artworkCaption:
        "Grabado de una edición infantil inglesa de las leyendas del Cid que ilustra exactamente esta escena: mientras los infantes de Carrión huyen aterrados —uno escondido bajo el escaño, el otro tras la viga de un lagar—, el Cid se acerca al león escapado y lo somete con un gesto tranquilo, ante la mirada atónita de su mesnada.",
    },
  });

  const corpesText = `Mucho rogaban las damas, mas de nada les sirvió.
Entonces las comenzaron a azotar los de Carrión,
con las cinchas corredizas, golpeando a su sabor,
con las espuelas agudas donde les da más dolor,
rompiéndoles las camisas y las carnes a las dos;
limpia salía la sangre sobre el roto ciclatón.
Y ellas la sienten hervir dentro de su corazón.
¡Qué gran ventura sería, si pluguiese al Creador,
que asomarse ahora pudiera mio Cid Campeador!`;

  const fragCorpes = await prisma.fragment.create({
    data: {
      slug: "la-afrenta-de-corpes",
      title: "Cantar de la afrenta de Corpes",
      location: "Cantar III (afrenta de Corpes)",
      headline: "¡Quién pudiera ahora ver al Cid!",
      text: corpesText,
      order: 6,
      status: "published",
      featured: false,
      workId: cantarDeMioCid.id,
      constellations: { connect: [{ slug: "honor-y-destierro" }, { slug: "honor-y-valor" }] },
      characters: { connect: [{ slug: "hijas-del-cid" }, { slug: "infantes-de-carrion" }] },
      artworkImageUrl: "/images/artworks/las-hijas-del-cid-pinazo.jpg",
      artworkTitle: "Las hijas del Cid",
      artworkAuthor: "Ignacio Pinazo Camarlench, 1879",
      artworkCaption:
        "Pintura de historia del siglo XIX que representa a doña Elvira y doña Sol maniatadas y abandonadas en el robledal de Corpes, tras ser azotadas por sus propios maridos. Pinazo capta el instante de mayor desamparo de las hijas del Cid, justo el que este fragmento describe.",
    },
  });

  const finalCidText = `«¡¡Gracias al Rey de los cielos, mis hijas vengadas son!
¡Ahora si que tendrán libres sus herencias de Carrión!
Pese a quien pese, ya puedo casarlas a gran honor.»
Ya comenzaron los tratos con Navarra y Aragón,
y celebraron su junta con Alfonso el de León.
Hicieron sus casamientos doña Elvira y doña Sol;
si los de antes buenos fueron, estos aún lo son mejor;
con mayor honra la casa que otro tiempo las casó.
Ved cómo aumenta la honra por el que en buena nació.
Dejó este siglo mio Cid, que fue en Valencia señor,
día de Pentecostés: ¡de Cristo alcance el perdón!
¡Así hagamos nosotros, el justo y el pecador!
Estas fueron las hazañas de mio Cid Campeador;
En llegando a este lugar se termina esta canción.`;

  const fragFinalCid = await prisma.fragment.create({
    data: {
      slug: "final-del-cantar-de-mio-cid",
      title: "Cantar de la afrenta de Corpes",
      location: "Cantar III (final)",
      headline: "Aumenta la honra por el que en buena nació",
      text: finalCidText,
      order: 7,
      status: "published",
      featured: false,
      workId: cantarDeMioCid.id,
      constellations: { connect: [{ slug: "honor-y-valor" }, { slug: "muerte" }] },
      characters: { connect: [{ slug: "el-cid" }, { slug: "hijas-del-cid" }] },
      artworkImageUrl: "/images/artworks/tumba-del-cid-burgos.jpg",
      artworkTitle: "La tumba del Cid en el monasterio de Burgos",
      artworkAuthor: "Stories from the Chronicle of the Cid (Mary Wright Plummer), 1910",
      artworkCaption:
        "Grabado de una edición infantil inglesa de las leyendas del Cid que muestra su sepulcro en el monasterio de Cardeña, junto a Burgos. La imagen del descanso final del héroe acompaña el cierre del Cantar, que resume sus hazañas y proclama que su honra «aumenta» incluso después de la muerte.",
    },
  });

  const sonetoText = `En tanto que de rosa y azucena
se muestra la color en vuestro gesto,
y que vuestro mirar ardiente, honesto,
enciende al corazón y lo refrena;

y en tanto que el cabello, que en la vena
del oro se escogió, con vuelo presto
por el hermoso cuello blanco, enhiesto,
el viento mueve, esparce y desordena:

coged de vuestra alegre primavera
el dulce fruto, antes que el tiempo airado
cubra de nieve la hermosa cumbre.

Marchitará la rosa el viento helado,
todo lo mudará la edad ligera
por no hacer mudanza en su costumbre.`;

  const fragSoneto = await prisma.fragment.create({
    data: {
      slug: "soneto-xxiii",
      title: "Soneto XXIII",
      location: "Sonetos, XXIII",
      headline: "Date prisa, que el invierno acecha",
      text: sonetoText,
      order: 1,
      status: "published",
      featured: false,
      workId: sonetos.id,
      constellations: { connect: [{ slug: "amor" }, { slug: "paso-del-tiempo" }] },
      topics: { connect: [{ slug: "carpe-diem" }, { slug: "tempus-fugit" }] },
      places: { connect: [{ slug: "toledo" }] },
      artworkImageUrl:
        "/images/artworks/titian-flora.jpg",
      artworkTitle: "Flora",
      artworkAuthor: "Tiziano, h. 1515-1517",
      artworkCaption:
        "Una joven sostiene flores de primavera en un retrato que, como el soneto de Garcilaso, asocia la belleza femenina con la fragilidad de las flores: bella, real y, por ello mismo, efímera.",
    },
  });

  const rimaText = `Volverán las oscuras golondrinas
en tu balcón sus nidos a colgar,
y otra vez con el ala a sus cristales
jugando llamarán.

Pero aquellas que el vuelo refrenaban
tu hermosura y mi dicha al contemplar,
aquellas que aprendieron nuestros nombres...
esas... ¡no volverán!

Volverán las tupidas madreselvas
de tu jardín las tapias a escalar,
y otra vez a la tarde aún más hermosas
sus flores se abrirán.

Pero aquellas, cuajadas de rocío
cuyas gotas mirábamos temblar
y caer como lágrimas del día...
esas... ¡no volverán!

Volverán del amor en tus oídos
las palabras ardientes a sonar;
tu corazón de su profundo sueño
tal vez despertará.

Pero mudo y absorto y de rodillas,
como se adora a Dios ante su altar,
como yo te he querido..., desengáñate,
¡así no te querrán!`;

  const fragRima = await prisma.fragment.create({
    data: {
      slug: "rima-liii",
      title: "Rima LIII",
      location: "Rimas, LIII",
      headline: "Las golondrinas vuelven; tú, no",
      text: rimaText,
      order: 4,
      status: "published",
      featured: false,
      workId: rimas.id,
      constellations: { connect: [{ slug: "amor" }, { slug: "paso-del-tiempo" }] },
      topics: { connect: [{ slug: "tempus-fugit" }] },
      places: { connect: [{ slug: "sevilla" }] },
      artworkImageUrl:
        "/images/artworks/goya-majas-on-balcony.jpg",
      artworkTitle: "Majas al balcón",
      artworkAuthor: "Francisco de Goya (atribuido), h. 1800-1814",
      artworkCaption:
        "Dos mujeres conversan en un balcón, el mismo escenario doméstico —«en tu balcón sus nidos a colgar»— que Bécquer convierte en símbolo del amor compartido que ya no volverá.",
    },
  });

  // ---------------------------------------------------------------------
  // Fragmentos — Égloga III (Garcilaso de la Vega)
  // ---------------------------------------------------------------------
  console.log("Creando fragmentos de la «Égloga III»...");

  const tajoText = `Cerca del Tajo, en soledad amena,
de verdes sauces hay una espesura
toda de hiedra revestida y llena,
que por el tronco va hasta el altura
y así la teje arriba y encadena
que el sol no halla paso a la verdura;
el agua baña el prado con sonido,
alegrando la hierba y el oído.

Con tanta mansedumbre el cristalino
Tajo en aquella parte caminaba
que pudieran los ojos el camino
determinar apenas que llevaba.
Peinando sus cabellos de oro fino,
una ninfa del agua do moraba
la cabeza sacó, y el prado ameno
vido de flores y de sombra lleno.

Moviola el sitio umbroso, el manso viento,
el suave olor de aquel florido suelo;
las aves en el fresco apartamiento
vio descansar del trabajoso vuelo;
secaba entonces el terreno aliento
el sol, subido en la mitad del cielo;
en el silencio solo se escuchaba
un susurro de abejas que sonaba.

Habiendo contemplado una gran pieza
atentamente aquel lugar sombrío,
somorgujó de nuevo su cabeza
y al fondo se dejó calar del río;
a sus hermanas a contar empieza
del verde sitio el agradable frío,
y que vayan, les ruega y amonesta,
allí con su labor a estar la siesta.`;

  const fragTajo = await prisma.fragment.create({
    data: {
      slug: "cerca-del-tajo",
      title: "Las ninfas del Tajo",
      location: "Égloga III (las ninfas del Tajo)",
      headline: "Cerca del Tajo, en soledad amena",
      text: tajoText,
      order: 1,
      status: "published",
      featured: false,
      workId: egloga3.id,
      constellations: { connect: [{ slug: "amor" }] },
      topics: { connect: [{ slug: "locus-amoenus" }] },
      places: { connect: [{ slug: "toledo" }] },
      artworkImageUrl:
        "/images/artworks/botticelli-nacimiento-de-venus.jpg",
      artworkTitle: "El nacimiento de Venus",
      artworkAuthor: "Sandro Botticelli, 1484-1486",
      artworkCaption:
        "La ninfa que emerge del agua del Tajo para contemplar el prado florido antes de sumergirse de nuevo encuentra su correlato pictórico más directo en esta Venus que surge del mar: la misma gracia renacentista, el mismo instante de belleza que se revela y vuelve a ocultarse.",
    },
  });

  const orfeoText = `Estaba figurada la hermosa
Eurídice, en el blanco pie mordida
de la pequeña sierpe ponzoñosa,
entre la hierba y flores escondida;
descolorida estaba como rosa
que ha sido fuera de sazón cogida,
y el ánima, los ojos ya volviendo,
de la hermosa carne despidiendo.

Figurado se vía extensamente
el osado marido, que bajaba
al triste reino de la escura gente
y la mujer perdida recobraba;
y cómo después desto él, impaciente
por miralla de nuevo, la tornaba
a perder otra vez, y del tirano
se queja al monte solitario en vano.`;

  const fragOrfeo = await prisma.fragment.create({
    data: {
      slug: "el-tapiz-de-orfeo-y-euridice",
      title: "El tapiz de Orfeo y Eurídice",
      location: "Égloga III (el tapiz de Filódoce)",
      headline: "Estaba figurada la hermosa Eurídice",
      text: orfeoText,
      order: 2,
      status: "published",
      featured: false,
      workId: egloga3.id,
      constellations: { connect: [{ slug: "amor" }, { slug: "muerte" }] },
      artworkImageUrl:
        "/images/artworks/corot-orfeo-y-euridice.jpg",
      artworkTitle: "Orfeo conduciendo a Eurídice desde el inframundo",
      artworkAuthor: "Jean-Baptiste-Camille Corot, 1861",
      artworkCaption:
        "El instante exacto que describe Garcilaso —Orfeo que se vuelve y pierde a Eurídice para siempre— encuentra en este cuadro su traducción más melancólica: la pareja separada por la luz y la sombra de un mismo paisaje, con el gesto del músico congelado en el momento de la pérdida irreversible.",
    },
  });

  const venusAdonisText = `Tras esto, el puerco allí se vía herido
de aquel mancebo, por su mal valiente
y el mozo en tierra estaba ya tendido,
abierto el pecho del rabioso diente,
con el cabello de oro desparcido
barriendo el suelo miserablemente;
las rosas blancas por allí sembradas
tornaban con su sangre coloradas.

Adonis este se mostraba que era,
según se muestra Venus dolorida,
que, viendo la herida abierta y fiera,
sobre él estaba casi amortecida;
boca con boca coge la postrera
parte del aire que solía dar vida
al cuerpo por quien ella en este suelo
aborrecido tuvo tanto al cielo.`;

  const fragVenusAdonis = await prisma.fragment.create({
    data: {
      slug: "el-tapiz-de-venus-y-adonis",
      title: "El tapiz de Venus y Adonis",
      location: "Égloga III (el tapiz de Climene)",
      headline: "Boca con boca coge la postrera parte del aire que solía dar vida",
      text: venusAdonisText,
      order: 3,
      status: "published",
      featured: false,
      workId: egloga3.id,
      constellations: { connect: [{ slug: "amor" }, { slug: "muerte" }] },
      artworkImageUrl:
        "/images/artworks/titian-venus-y-adonis.jpg",
      artworkTitle: "Venus y Adonis",
      artworkAuthor: "Tiziano, 1554",
      artworkCaption:
        "Tiziano pintó esta misma escena —Venus que intenta retener a Adonis antes de la cacería fatal— con la misma tensión entre la belleza del cuerpo y la cercanía de la muerte que despliega esta octava, contemporánea del cuadro y del mismo clima cultural renacentista.",
    },
  });

  const elisaText = `En la hermosa tela se veían,
entretejidas, las silvestres diosas
salir de la espesura, y que venían
todas a la ribera presurosas,
en el semblante tristes, y traían
cestillos blancos de purpúreas rosas,
las cuales esparciendo, derramaban
sobre una ninfa muerta que lloraban.

Todas con el cabello desparcido
lloraban una ninfa delicada,
cuya vida mostraba que había sido
antes de tiempo y casi en flor cortada;
cerca del agua, en un lugar florido,
estaba entre las hierbas degollada,
cual queda el blanco cisne cuando pierde
la dulce vida entre la hierba verde.`;

  const fragElisa = await prisma.fragment.create({
    data: {
      slug: "la-muerte-de-elisa",
      title: "La muerte de Elisa",
      location: "Égloga III (el tapiz de Nise)",
      headline: "Antes de tiempo y casi en flor cortada",
      text: elisaText,
      order: 4,
      status: "published",
      featured: false,
      workId: egloga3.id,
      constellations: { connect: [{ slug: "muerte" }, { slug: "amor" }] },
      artworkImageUrl:
        "/images/artworks/millais-ofelia.jpg",
      artworkTitle: "Ofelia",
      artworkAuthor: "John Everett Millais, 1851-1852",
      artworkCaption:
        "La ninfa muerta entre flores y agua, «casi en flor cortada», tiene su imagen más perdurable en esta Ofelia tendida entre las hierbas del río: la misma mezcla de belleza y muerte prematura que convierte el llanto de las diosas en una de las elegías más perfectas de la lírica renacentista.",
    },
  });

  const pastoresText = `Más claro cada vez el son se oía
de dos pastores que venían cantando
tras el ganado, que también venía
por aquel verde soto caminando,
y a la majada, ya pasado el día,
recogido le llevan, alegrando
las verdes selvas con el son süave,
haciendo su trabajo menos grave. [...]

TIRRENO.

Cual suele, acompañada de su bando,
aparecer la dulce primavera,
cuando Favonio y Céfiro, soplando,
al campo tornan su beldad primera
y van artificiosos esmaltando
de rojo, azul y blanco la ribera:
en tal manera, a mí Flérida mía
viniendo, reverdece mi alegría.

ALCINO.

¿Ves el furor del animoso viento,
embravecido en la fragosa sierra,
que los antiguos robles ciento a ciento
y los pinos altísimos atierra,
y de tanto destrozo aún no contento,
al espantoso mar mueve la guerra?
Pequeña es esta furia, comparada
a la de Filis, con Alcino airada. [...]

Esto cantó Tirreno, y esto Alcino
le respondió; y habiendo ya acabado
el dulce son, siguieron su camino
con paso un poco más apresurado;
siendo a las ninfas ya el rumor vecino,
juntas se arrojan por el agua a nado,
y de la blanca espuma que movieron
las cristalinas ondas se cubrieron.`;

  const fragPastores = await prisma.fragment.create({
    data: {
      slug: "el-canto-de-tirreno-y-alcino",
      title: "El canto de Tirreno y Alcino",
      location: "Égloga III (Tirreno y Alcino)",
      headline: "A mí Flérida mía viniendo, reverdece mi alegría",
      text: pastoresText,
      order: 5,
      status: "published",
      featured: false,
      workId: egloga3.id,
      constellations: { connect: [{ slug: "amor" }] },
      topics: { connect: [{ slug: "amor-cortes" }, { slug: "locus-amoenus" }] },
      places: { connect: [{ slug: "toledo" }] },
      artworkImageUrl:
        "/images/artworks/poussin-pastores-de-arcadia.jpg",
      artworkTitle: "Los pastores de Arcadia (Et in Arcadia ego)",
      artworkAuthor: "Nicolas Poussin, h. 1637-1638",
      artworkCaption:
        "El mundo pastoril idealizado donde pastores y ninfas conviven con la naturaleza, y donde el amor se celebra o se lamenta con la misma dulzura, tiene en Poussin su pintor definitivo: una Arcadia serena y melancólica donde la belleza y la muerte conviven sin violencia, igual que en esta égloga.",
    },
  });

  // ---------------------------------------------------------------------
  // Itinerario: «Amor y muerte»
  // ---------------------------------------------------------------------
  console.log("Creando itinerario...");

  const itinerario = await prisma.itinerary.create({
    data: {
      slug: "amor-y-muerte",
      title: "Amor y muerte",
      description: `Un recorrido por cuatro siglos de literatura española a través de un mismo binomio: el amor que se desborda y la muerte —propia o ajena— que lo corona o lo castiga. De la magia amorosa de Celestina al carpe diem de Garcilaso, pasando por la melancolía de Bécquer, hasta el llanto final de Pleberio.`,
    },
  });

  await prisma.itineraryFragment.createMany({
    data: [
      { itineraryId: itinerario.id, fragmentId: fragConjuro.id, order: 1 },
      { itineraryId: itinerario.id, fragmentId: fragSoneto.id, order: 2 },
      { itineraryId: itinerario.id, fragmentId: fragRima.id, order: 3 },
      { itineraryId: itinerario.id, fragmentId: fragPlanto.id, order: 4 },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Conjuro a Plutón
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Conjuro a Plutón»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragConjuro.id,
        type: "glosa",
        ...anchor(conjuroText, "Plutón"),
        order: 1,
        content: `En la mitología clásica, dios del inframundo (equivalente al Hades griego). Rojas lo convierte aquí en una suerte de demonio al que Celestina invoca con fórmulas de raíz pagana y cristiana a la vez.`,
      },
      {
        fragmentId: fragConjuro.id,
        type: "glosa",
        ...anchor(conjuroText, "Tesífone, Megera y Aletón"),
        order: 2,
        content: `Las tres Furias (Erinias) de la mitología grecolatina, espíritus vengadores que castigaban especialmente los crímenes contra los vínculos familiares.`,
      },
      {
        fragmentId: fragConjuro.id,
        type: "glosa",
        ...anchor(conjuroText, "Estigia y Dite"),
        order: 3,
        content: `Estigia es el río que separa el mundo de los vivos del de los muertos; Dite (otro nombre de Plutón/Hades) da nombre también a su reino. Ambas son referencias clásicas al inframundo.`,
      },
      {
        fragmentId: fragConjuro.id,
        type: "glosa",
        ...anchor(conjuroText, "hilado"),
        order: 4,
        content: `Madeja de hilo. En la magia amorosa tradicional, el hilo untado con aceites y «conjurado» servía como objeto de ligamento: se hacía llegar a la persona que se quería atar amorosamente.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragConjuro.id,
        type: "contexto",
        ...anchor(conjuroText, "Yo, Celestina, tu más conocida clientela"),
        order: 1,
        content: `Las acusaciones de hechicería contra mujeres como Celestina —curanderas, parteras, alcahuetas— eran frecuentes en la Castilla de finales del siglo XV. La literatura recoge un imaginario de la «hechicera» que mezcla saberes populares, restos de cultos paganos y un naciente discurso inquisitorial sobre la brujería, que se intensificaría en los siglos siguientes.`,
      },
      {
        fragmentId: fragConjuro.id,
        type: "contexto",
        ...anchor(conjuroText, "Conjúrote, triste Plutón, señor de la profundidad infernal"),
        order: 2,
        content: `La acumulación de epítetos y títulos grandilocuentes con que se invoca a Plutón —«señor de...», «emperador de...», «capitán de...»— responde a la retórica de la *amplificatio* aprendida en las escuelas humanistas, y dota al conjuro de una solemnidad casi litúrgica que contrasta, irónicamente, con su finalidad: una intriga amorosa entre vecinos.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragConjuro.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(
          conjuroText,
          "señor de la profundidad infernal, emperador de la corte dañada, capitán soberbio de los condenados ángeles"
        ),
        order: 1,
        content: `**Enumeración / acumulación**: una larga cadena de aposiciones multiplica los títulos de Plutón. Este recurso, propio de la retórica clásica, convierte la invocación en un crescendo solemne y casi cómico por su desmesura.`,
      },
      {
        fragmentId: fragConjuro.id,
        type: "figura",
        category: "tropo",
        ...anchor(conjuroText, "cuanto más lo mirare, tanto más su corazón se ablande"),
        order: 2,
        content: `**Correlación hiperbólica**: la estructura «cuanto más... tanto más» intensifica hasta el extremo el efecto que se desea provocar en Melibea, anticipando la desmesura de la pasión que el conjuro pretende encender.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragConjuro.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Qué objeto material emplea Celestina para realizar el conjuro y qué relación tiene con el efecto que busca producir en Melibea?`,
      },
      {
        fragmentId: fragConjuro.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El conjuro mezcla referencias mitológicas paganas (Plutón, las Furias, Estigia) con un tono y una estructura propios de la oración litúrgica cristiana. ¿Qué efecto produce esta mezcla en el lector y qué dice sobre la cultura de la época?`,
      },
      {
        fragmentId: fragConjuro.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `Celestina actúa movida por el dinero que le pagará Calisto. ¿Crees que esto convierte la magia en un fraude consciente, o el personaje cree realmente en sus poderes? Argumenta tu respuesta con detalles del texto.`,
      },

      // Intertextualidad
      {
        fragmentId: fragConjuro.id,
        type: "intertextualidad",
        ...anchor(conjuroText, "Melibea"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragPlanto.id,
        content: `Este conjuro pone en marcha la cadena de pasiones que desembocará en la muerte de Melibea y, con ella, en el desconsolado planto de su padre Pleberio al final de la obra.`,
      },
      {
        fragmentId: fragConjuro.id,
        type: "intertextualidad",
        ...anchor(conjuroText, "Conjúrote"),
        order: 2,
        linkType: "external",
        externalCitation: `Lucano, Farsalia, libro VI: la nigromante Eritón invoca a las potencias infernales en términos muy similares —un modelo retórico que la literatura española medieval y renacentista reelabora en escenas de hechicería como esta.`,
        content: `La tradición clásica ofrecía ya modelos de «conjuros» literarios a las potencias infernales, que autores como Rojas conocían y reelaboraban.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Planto de Pleberio
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Planto de Pleberio»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragPlanto.id,
        type: "glosa",
        ...anchor(plantoText, "in hac lacrymarum valle"),
        order: 1,
        content: `Expresión latina, «en este valle de lágrimas», tomada de la oración mariana *Salve Regina*. Pleberio convierte una fórmula de consuelo religioso en la expresión de su desesperación, vaciándola de esperanza trascendente.`,
      },
      {
        fragmentId: fragPlanto.id,
        type: "glosa",
        ...anchor(plantoText, "heredamientos"),
        order: 2,
        content: `Bienes y propiedades que se transmiten por herencia.`,
      },
      {
        fragmentId: fragPlanto.id,
        type: "glosa",
        ...anchor(plantoText, "mayordoma"),
        order: 3,
        content: `Encargada de administrar una casa o hacienda; aquí, personificación de la Fortuna como gestora de los bienes materiales.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragPlanto.id,
        type: "contexto",
        ...anchor(plantoText, "¡Oh mundo, mundo!"),
        order: 1,
        content: `El planto (lamento fúnebre) es un género de larga tradición medieval, presente también en las *Coplas a la muerte de su padre* de Jorge Manrique (h. 1476), escritas apenas dos décadas antes de *La Celestina*. Frente al consuelo cristiano de Manrique, el de Pleberio no encuentra ninguna salida trascendente: es un lamento sin consuelo.`,
      },
      {
        fragmentId: fragPlanto.id,
        type: "contexto",
        ...anchor(plantoText, "Del mundo me quejo"),
        order: 2,
        content: `El *contemptus mundi* (desprecio del mundo) era un tópico habitual en la literatura moral medieval, que recordaba la vanidad de los bienes terrenales frente a la vida eterna. Pleberio invierte el tópico: no desprecia el mundo por amor a Dios, sino por el dolor desnudo de la pérdida, sin que se vislumbre ningún más allá que lo consuele.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragPlanto.id,
        type: "figura",
        category: "topos",
        ...anchor(
          plantoText,
          "¿Para quién trabajé? ¿Para quién planté árboles? ¿Para quién fabriqué navíos?"
        ),
        order: 1,
        content: `**Ubi sunt**: variación del tópico clásico «¿dónde están?». La pregunta retórica encadenada subraya lo absurdo de haber acumulado bienes y esfuerzo para alguien que ya no existe. Jorge Manrique había usado una estructura semejante («¿qué se hizo...?») pocos años antes.`,
      },
      {
        fragmentId: fragPlanto.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(
          plantoText,
          "¿Por qué no destruiste mi patrimonio? ¿Por qué no asolaste mis grandes heredamientos?"
        ),
        order: 2,
        content: `**Anáfora**: la repetición de «¿Por qué...?» multiplica los reproches de Pleberio contra la Fortuna y, después, contra el mundo, el amor y la propia vida. La sintaxis reproduce el desbordamiento emocional del personaje.`,
      },
      {
        fragmentId: fragPlanto.id,
        type: "figura",
        category: "tropo",
        ...anchor(plantoText, "¡Oh amor, amor!"),
        order: 3,
        content: `**Apóstrofe**: Pleberio se dirige directamente a entidades abstractas —el mundo, la fortuna, el amor— como si pudieran responderle. Esta acumulación de apóstrofes recorre todo el planto y dramatiza su soledad: no hay nadie, humano o divino, a quien dirigir el dolor.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragPlanto.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Qué reproches dirige Pleberio, sucesivamente, al mundo, a la fortuna y al amor?`,
      },
      {
        fragmentId: fragPlanto.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El planto de Pleberio cierra una obra que comenzó como una comedia de enredos amorosos. ¿Qué efecto produce este contraste tonal en el sentido último de *La Celestina*?`,
      },
      {
        fragmentId: fragPlanto.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `Pleberio nunca menciona a Dios ni a una vida después de la muerte como consuelo, algo inusual en la literatura medieval. ¿Qué crees que aporta esta ausencia al retrato del dolor humano? ¿Te parece un lamento todavía reconocible hoy?`,
      },

      // Intertextualidad
      {
        fragmentId: fragPlanto.id,
        type: "intertextualidad",
        ...anchor(plantoText, "Melibea"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragConjuro.id,
        content: `El dolor de Pleberio es la consecuencia directa de la trama que Celestina puso en marcha con su conjuro a Plutón: la magia que debía «atar» a Melibea al amor de Calisto desencadena, al final, su muerte.`,
      },
      {
        fragmentId: fragPlanto.id,
        type: "intertextualidad",
        ...anchor(plantoText, "¿Para quién trabajé? ¿Para quién planté árboles?"),
        order: 2,
        linkType: "external",
        externalCitation: `Jorge Manrique, Coplas a la muerte de su padre (h. 1476): «¿Qué se hizo el rey don Juan? / Los infantes de Aragón / ¿qué se hizo?...» — la misma estructura interrogativa del tópico ubi sunt, escrita apenas veinte años antes.`,
        content: `El recurso a la pregunta retórica encadenada para lamentar lo perdido tiene en las *Coplas* de Manrique su antecedente más célebre en castellano.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Calisto es rechazado por Melibea
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Calisto es rechazado por Melibea»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragRechazo.id,
        type: "glosa",
        ...anchor(rechazoText, "inmérito"),
        order: 1,
        content: `«Sin merecerlo». Calisto se presenta como alguien que no merece la dicha de ver a Melibea, en un gesto de falsa humildad que es, en realidad, parte del propio cortejo.`,
      },
      {
        fragmentId: fragRechazo.id,
        type: "glosa",
        ...anchor(rechazoText, "esquivo tormento"),
        order: 2,
        content: `«Esquivo»: terrible, cruel. El «esquivo tormento» que la ausencia de Melibea ha de causarle es, para Calisto, el único punto en que su dicha actual queda por debajo de la de los santos en el cielo.`,
      },
      {
        fragmentId: fragRechazo.id,
        type: "glosa",
        ...anchor(rechazoText, "ternía"),
        order: 3,
        content: `Forma antigua del condicional «tendría». Calisto compara el premio que espera de Melibea con la silla que Dios podría darle «sobre sus santos» en el cielo.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragRechazo.id,
        type: "contexto",
        ...anchor(rechazoText, "En esto veo, Melibea, la grandeza de Dios"),
        order: 1,
        content: `La narración que precede a este diálogo cuenta que Calisto, antes de hablar con Melibea, ha dicho de ella: «Melibeo soy, y a Melibea adoro, y en Melibea creo, y a Melibea amo». La equiparación entre el amor humano y la devoción religiosa, aquí llevada al extremo, es un rasgo característico de la lírica cortesana y petrarquista de los siglos XV y XVI.`,
      },
      {
        fragmentId: fragRechazo.id,
        type: "contexto",
        ...anchor(rechazoText, "tu loco atrevimiento"),
        order: 2,
        content: `El código del honor exigía a una mujer noble rechazar públicamente cualquier insinuación amorosa, con independencia de lo que sintiera en privado. La dureza de la respuesta de Melibea —que más adelante resultará no ser su última palabra— responde, al menos en parte, a esa exigencia social.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragRechazo.id,
        type: "figura",
        category: "tropo",
        ...anchor(
          rechazoText,
          "si Dios me diese en el cielo la silla sobre sus santos, no lo ternía por tanta felicidad",
        ),
        order: 1,
        content: `**Hipérbole blasfema**: Calisto antepone el favor de Melibea al que Dios podría concederle en el cielo. La desmesura de la comparación —que un público del siglo XV podía percibir como cercana a la blasfemia— mide la magnitud de su obsesión.`,
      },
      {
        fragmentId: fragRechazo.id,
        type: "figura",
        category: "topos",
        ...anchor(rechazoText, "el servicio, sacrificio, devoción y obras pías"),
        order: 2,
        content: `**Servicio de amor**: la tradición del amor cortés concebía el enamoramiento como una forma de vasallaje, casi de culto religioso, hacia la dama. Calisto literaliza este tópico al comparar directamente el «servicio» amoroso con las «obras pías» ofrecidas a Dios.`,
      },
      {
        fragmentId: fragRechazo.id,
        type: "figura",
        category: "tropo",
        ...anchor(
          rechazoText,
          "¡Oh bienaventuradas orejas mías que indignamente tan gran palabra habéis oído!\n\nMELIBEA. Mas desventuradas de que me acabes de oír",
        ),
        order: 3,
        content: `**Antítesis**: Calisto llama «bienaventuradas» a sus oídos por haber escuchado a Melibea; ella responde llamándolos «desventuradas» por lo que están a punto de oír. El contraste entre ambos adjetivos anticipa, en una sola palabra, el giro completo de la respuesta.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragRechazo.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Con qué compara Calisto la dicha de ver y oír a Melibea? ¿En qué único punto reconoce que su situación es inferior a la de esa comparación?`,
      },
      {
        fragmentId: fragRechazo.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `Calisto convierte a Melibea en un objeto de devoción casi religiosa antes incluso de conocerla. ¿Qué efecto produce esta idealización sobre la propia Melibea, a juzgar por su respuesta?`,
      },
      {
        fragmentId: fragRechazo.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `Melibea llama «loco atrevimiento» a las palabras de Calisto y le promete una «paga... tan fiera». ¿Te parece una respuesta proporcionada, una simple convención social, o ambas cosas a la vez? ¿Cambia tu valoración al saber que, más adelante, ella también confesará estar enamorada?`,
      },

      // Intertextualidad
      {
        fragmentId: fragRechazo.id,
        type: "intertextualidad",
        ...anchor(rechazoText, "tu loco atrevimiento"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragConjuro.id,
        content: `Es precisamente este rechazo —y la desesperación de Calisto ante él— lo que lleva a su criado Sempronio a proponerle el recurso a Celestina, cuyo conjuro a Plutón abrirá el camino hacia el amor de Melibea por una vía muy distinta del «servicio» religioso que Calisto invoca aquí.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — La alcahueta Celestina y su mediación
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «La alcahueta Celestina y su mediación»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragAlcahueta.id,
        type: "glosa",
        ...anchor(alcahuetaText, "ternás"),
        order: 1,
        content: `Forma antigua de «tendrás». Celestina se dirige a Melibea con un cortés «bien tendrás noticia...», el inicio calculado de su mediación.`,
      },
      {
        fragmentId: fragAlcahueta.id,
        type: "glosa",
        ...anchor(alcahuetaText, "premisas"),
        order: 2,
        content: `«Rodeos». Melibea acusa a Celestina de dar muchas vueltas antes de llegar al asunto que de verdad le interesa.`,
      },
      {
        fragmentId: fragAlcahueta.id,
        type: "glosa",
        ...anchor(alcahuetaText, "empecible"),
        order: 3,
        content: `«Dañino». Melibea convierte un refrán sobre el peligro de la lengua en una acusación directa contra Celestina, cuyas palabras —dirá— son su arma más peligrosa.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragAlcahueta.id,
        type: "contexto",
        ...anchor(alcahuetaText, "un caballero mancebo, gentilhombre de clara sangre"),
        order: 1,
        content: `«Gentilhombre de clara sangre»: caballero y cristiano viejo, es decir, sin antepasados judíos o musulmanes conocidos. La «limpieza de sangre» era, en la Castilla de finales del siglo XV, un criterio social de primer orden —y Celestina lo invoca de inmediato para presentar a Calisto como un buen partido.`,
      },
      {
        fragmentId: fragAlcahueta.id,
        type: "contexto",
        ...anchor(alcahuetaText, "Quemada seas, alcahueta falsa, hechicera"),
        order: 2,
        content: `La amenaza de la hoguera no es retórica vacía: las acusaciones de hechicería podían acarrear, en la época, procesos reales con ese desenlace. Pocos años después, la furia verbal de Melibea encontrará un eco trágico en la propia muerte violenta de Celestina.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragAlcahueta.id,
        type: "figura",
        category: "tropo",
        ...anchor(alcahuetaText, "el más empecible miembro del mal hombre o mujer es la lengua"),
        order: 1,
        content: `**Sinécdoque**: «la lengua» representa aquí la totalidad del discurso engañoso de Celestina. Resulta irónico que sea precisamente esa lengua —la palabra de Celestina— la que, líneas después, consiga lo que Melibea ahora rechaza con tanta vehemencia.`,
      },
      {
        fragmentId: fragAlcahueta.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(
          alcahuetaText,
          "¿Ese es el doliente por quien has hecho tantas premisas en tu demanda, por quien has venido a buscar la muerte para ti, por quien has dado tan dañosos pasos?",
        ),
        order: 2,
        content: `**Anáfora**: la repetición de «por quien...» en una sola pregunta acumula, sin dar tregua, las acusaciones de Melibea contra Celestina, antes incluso de que esta haya podido explicarse.`,
      },
      {
        fragmentId: fragAlcahueta.id,
        type: "figura",
        category: "topos",
        ...anchor(
          alcahuetaText,
          "¡Quemada seas, alcahueta falsa, hechicera, enemiga de honestidad, causadora de secretos yerros!",
        ),
        order: 3,
        content: `**Invectiva acumulativa**: la sucesión de insultos —«alcahueta falsa», «hechicera», «enemiga de honestidad», «causadora de secretos yerros»— es un recurso retórico habitual para la denigración de un personaje, aquí puesto, con toda su fuerza, en boca de quien terminará cediendo a los argumentos de la persona insultada.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragAlcahueta.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Con qué pretexto entra Celestina en casa de Melibea, y qué nombre menciona apenas comienza a hablar?`,
      },
      {
        fragmentId: fragAlcahueta.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `Melibea interrumpe a Celestina antes de que esta pueda terminar su frase y la cubre de insultos. ¿Qué nos dice esta reacción tan inmediata y violenta sobre lo que Melibea ya sospecha o teme?`,
      },
      {
        fragmentId: fragAlcahueta.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `Celestina apenas ha dicho dos frases cuando ya recibe los peores insultos que Melibea es capaz de pronunciar. ¿Te parece una reacción exagerada? ¿Qué efecto produce en el espectador, que sabe —o sospechará pronto— que esa furia esconde otra cosa?`,
      },

      // Intertextualidad
      {
        fragmentId: fragAlcahueta.id,
        type: "intertextualidad",
        ...anchor(alcahuetaText, "¡Jesú, Jesú!"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragMelibeaReconoce.id,
        content: `La furia de Melibea contra Celestina en este pasaje es solo la primera reacción de la escena. Apenas unas líneas después, en el mismo encuentro, Melibea pasará de querer «rasgar las carnes» de Celestina a preguntarle, intrigada, cómo se llama el «dolor» que siente: la misma conversación contiene el rechazo y la confesión.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Melibea reconoce su amor por Calisto
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Melibea reconoce su amor por Calisto»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragMelibeaReconoce.id,
        type: "glosa",
        ...anchor(melibeaReconoceText, "vistiduras"),
        order: 1,
        content: `Forma antigua de «vestiduras». Celestina juega con la imagen de Melibea «rasgando» sus propias ropas y carnes: el amor, dice, ya entró sin necesidad de rasgar nada.`,
      },
      {
        fragmentId: fragMelibeaReconoce.id,
        type: "glosa",
        ...anchor(melibeaReconoceText, "huego"),
        order: 2,
        content: `Forma antigua de «fuego». Es la primera de la larga serie de imágenes con que Celestina define el amor en este pasaje.`,
      },
      {
        fragmentId: fragMelibeaReconoce.id,
        type: "glosa",
        ...anchor(melibeaReconoceText, "delectable"),
        order: 3,
        content: `«Deleitable», es decir, placentera. Celestina describe el amor como una «delectable dolencia»: una enfermedad que, paradójicamente, produce placer.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragMelibeaReconoce.id,
        type: "contexto",
        ...anchor(melibeaReconoceText, "¿Qué le debo yo a él? ¿Qué le soy en cargo?"),
        order: 1,
        content: `Melibea sigue, en apariencia, resistiéndose: pregunta qué obligación tiene con un hombre al que apenas conoce. Pero el hecho mismo de seguir hablando de él —y de preguntar, a continuación, cómo se llama lo que siente— ya es, para Celestina, la señal de que la resistencia está cediendo.`,
      },
      {
        fragmentId: fragMelibeaReconoce.id,
        type: "contexto",
        ...anchor(melibeaReconoceText, "Es un huego escondido, una agradable llaga, un sabroso veneno"),
        order: 2,
        content: `Definir el amor mediante una cadena de contrarios —dulce y dañino, placentero y doloroso— era un procedimiento retórico de larga tradición, que la lírica española del Siglo de Oro llevaría a su culminación más célebre en el soneto de Lope de Vega «Desmayarse, atreverse, estar furioso».`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragMelibeaReconoce.id,
        type: "figura",
        category: "tropo",
        ...anchor(melibeaReconoceText, "un alegre tormento, una dulce y fiera herida, una blanda muerte"),
        order: 1,
        content: `**Oxímoron**: cada una de estas expresiones combina dos términos de sentido opuesto —«alegre»/«tormento», «dulce»/«fiera», «blanda»/«muerte»— para apuntar a una experiencia que no se deja describir con una sola palabra.`,
      },
      {
        fragmentId: fragMelibeaReconoce.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(
          melibeaReconoceText,
          "Es un huego escondido, una agradable llaga, un sabroso veneno, una dulce amargura, una delectable dolencia, un alegre tormento, una dulce y fiera herida, una blanda muerte.",
        ),
        order: 2,
        content: `**Enumeración**: ocho expresiones encadenadas, todas con la misma estructura («un/una + adjetivo + sustantivo»), definen el amor por acumulación, como si ninguna fórmula aislada bastara para abarcarlo.`,
      },
      {
        fragmentId: fragMelibeaReconoce.id,
        type: "figura",
        category: "topos",
        ...anchor(
          melibeaReconoceText,
          "Sin te romper las vistiduras se lanzó en tu pecho el amor; no rasgaré yo tus carnes para le curar.",
        ),
        order: 3,
        content: `**El amor como herida**: el «mal» de Melibea se describe en términos de una herida o enfermedad que ha penetrado en su cuerpo sin dejar marca exterior. Este tópico —el amor que entra como un dardo o un fuego y enferma por dentro— recorre toda la lírica amorosa medieval y renacentista.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragMelibeaReconoce.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Qué nombre da Celestina al «dolor» de Melibea, y con qué ocho expresiones lo describe a continuación?`,
      },
      {
        fragmentId: fragMelibeaReconoce.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `Compara el tono de Melibea en este fragmento con el de «La alcahueta Celestina y su mediación». ¿En qué momento exacto crees que cambia su actitud, y qué la hace cambiar?`,
      },
      {
        fragmentId: fragMelibeaReconoce.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `Celestina logra que Melibea hable de su «mal» sin haber dicho una sola palabra a favor de Calisto: solo ha hecho preguntas y ha dado nombre a un sentimiento. ¿Qué te parece esta forma de persuasión, comparada con un argumento directo?`,
      },

      // Intertextualidad
      {
        fragmentId: fragMelibeaReconoce.id,
        type: "intertextualidad",
        ...anchor(melibeaReconoceText, "un sabroso veneno"),
        order: 1,
        linkType: "external",
        externalCitation: `Lope de Vega, «Desmayarse, atreverse, estar furioso»: «huir el rostro al claro desengaño, / beber veneno por licor süave, / olvidar el provecho, amar el daño».`,
        content: `Más de un siglo después de *La Celestina*, Lope construirá un soneto entero —una de las composiciones más populares de la lírica española— acumulando definiciones contradictorias del amor, igual que Celestina hace aquí en miniatura: el «sabroso veneno» de Celestina es el «licor süave» que se bebe «por veneno» en Lope.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Muerte de Celestina
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Muerte de Celestina»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragMuerteCelestina.id,
        type: "glosa",
        ...anchor(muerteCelestinaText, "allegue"),
        order: 1,
        content: `«Atraiga». Celestina pide a Sempronio que no grite, para que el ruido no «atraiga» a los vecinos —ironía cruel, porque será precisamente esa palabra, «justicia», la que ella misma grite después.`,
      },
      {
        fragmentId: fragMuerteCelestina.id,
        type: "glosa",
        ...anchor(muerteCelestinaText, "salir de seso"),
        order: 2,
        content: `«Perder los nervios», enloquecer. Celestina pide calma justo antes de que la situación se vuelva irreversible.`,
      },
      {
        fragmentId: fragMuerteCelestina.id,
        type: "glosa",
        ...anchor(muerteCelestinaText, "con cartas"),
        order: 3,
        content: `«Con recomendación». Sempronio convierte una fórmula cortés —enviar a alguien «con cartas» de recomendación— en una amenaza macabra: enviará a Celestina al infierno «recomendada».`,
      },

      // Contextualización histórica
      {
        fragmentId: fragMuerteCelestina.id,
        type: "contexto",
        ...anchor(muerteCelestinaText, "¡Oh vieja avarienta, garganta muerta de sed por dinero!"),
        order: 1,
        content: `La alianza entre Celestina y los criados de Calisto, Sempronio y Pármeno, se había sostenido durante toda la obra sobre un interés común: repartirse las ganancias de la mediación amorosa. En cuanto Celestina se niega a compartir la cadena de oro que Calisto le ha regalado, esa alianza se rompe de inmediato y con violencia.`,
      },
      {
        fragmentId: fragMuerteCelestina.id,
        type: "contexto",
        ...anchor(
          muerteCelestinaText,
          "¡Justicia, justicia, señores vecinos; justicia, que me matan en mi casa estos rufianes!",
        ),
        order: 2,
        content: `Celestina apela a la justicia vecinal —los gritos que podían reunir a los vecinos de la calle— como único recurso ante una agresión dentro de su propia casa. Pármeno y Sempronio serán, en efecto, detenidos y ejecutados por este crimen, aunque ya demasiado tarde para ella.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragMuerteCelestina.id,
        type: "figura",
        category: "tropo",
        ...anchor(muerteCelestinaText, "garganta muerta de sed por dinero"),
        order: 1,
        content: `**Hipérbole**: la avaricia de Celestina se convierte en una sed física e insaciable, una «garganta muerta» que nunca llega a apagarse. La imagen corporal anticipa, de forma siniestra, la propia muerte del personaje pocas líneas después.`,
      },
      {
        fragmentId: fragMuerteCelestina.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(
          muerteCelestinaText,
          "¡Dale, dale; acábala, pues comenzaste! ¡Que nos sentirán! ¡Muera, muera; de los enemigos, los menos!",
        ),
        order: 2,
        content: `**Repetición y asíndeton**: las órdenes de Pármeno se acumulan sin conjunciones, en frases brevísimas —«dale, dale», «muera, muera»—, reproduciendo la urgencia y el descontrol del momento.`,
      },
      {
        fragmentId: fragMuerteCelestina.id,
        type: "figura",
        category: "topos",
        ...anchor(muerteCelestinaText, "que yo te haré ir al infierno con cartas"),
        order: 3,
        content: `**Ironía macabra**: Sempronio convierte la amenaza de muerte en una broma cruel sobre la condena eterna de Celestina, mezclando el registro cotidiano («cartas» de recomendación) con el más solemne (el infierno). Esta mezcla de tonos —cómico y trágico a la vez— es uno de los rasgos más característicos de la obra.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragMuerteCelestina.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Qué piden Sempronio y Pármeno a Celestina, y qué hace ella para negárselo?`,
      },
      {
        fragmentId: fragMuerteCelestina.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `Durante casi toda la obra, Celestina, Sempronio y Pármeno han actuado como aliados. ¿Qué revela esta escena sobre la verdadera naturaleza de esa alianza?`,
      },
      {
        fragmentId: fragMuerteCelestina.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `Celestina muere a manos de quienes se habían beneficiado de su trabajo durante toda la obra, en una disputa por dinero. ¿Te parece un final coherente con el personaje, o un castigo desproporcionado? Razona tu respuesta.`,
      },

      // Intertextualidad
      {
        fragmentId: fragMuerteCelestina.id,
        type: "intertextualidad",
        ...anchor(muerteCelestinaText, "¡Ay, que me ha muerto, ay, ay! ¡Confesión, confesión!"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragPlanto.id,
        content: `La muerte de Celestina es solo el primer eslabón de la cadena que culminará en el «Planto de Pleberio»: Pármeno y Sempronio morirán ajusticiados por este crimen, Calisto morirá poco después por accidente, y Melibea se suicidará. Pleberio recordará expresamente a «la falsa alcahueta Celestina», muerta «a manos de los más fieles compañeros» que su oficio jamás tuvo.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — El destierro del Cid
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «El destierro del Cid»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragCid.id,
        type: "glosa",
        ...anchor(cidText, "uços"),
        order: 1,
        content: `«Uços»: puertas (del latín *ostium*). «Uços sin cañados» = puertas sin candados, es decir, abandonadas y abiertas de par en par: la casa ha sido vaciada.`,
      },
      {
        fragmentId: fragCid.id,
        type: "glosa",
        ...anchor(cidText, "alcándaras"),
        order: 2,
        content: `Perchas o varas donde se colocaban las aves de cetrería y las prendas de vestir. Que estén «vázias» (vacías) indica que todo ha sido confiscado.`,
      },
      {
        fragmentId: fragCid.id,
        type: "glosa",
        ...anchor(cidText, "adtores mudados"),
        order: 3,
        content: `Azores que han mudado la pluma, muy valorados para la caza. Su ausencia subraya la riqueza que el Cid pierde al ser desterrado.`,
      },
      {
        fragmentId: fragCid.id,
        type: "glosa",
        ...anchor(cidText, "Álbar Fáñez"),
        order: 4,
        content: `Álvar Fáñez Minaya, sobrino y principal lugarteniente del Cid a lo largo de todo el Cantar.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragCid.id,
        type: "contexto",
        ...anchor(cidText, "De los sos ojos tan fuertemiente llorando"),
        order: 1,
        content: `El *Cantar de Mio Cid* narra el destierro de Rodrigo Díaz de Vivar, ordenado por el rey Alfonso VI hacia 1081 por motivos que la historia documenta solo parcialmente. El poema, compuesto hacia los siglos XII-XIII y copiado por Per Abbat en 1207, convierte un episodio histórico en un relato ejemplar sobre la lealtad, el honor y su recuperación.`,
      },
      {
        fragmentId: fragCid.id,
        type: "contexto",
        ...anchor(cidText, "ovieron la corneja diestra"),
        order: 2,
        content: `La mención de la corneja a la derecha (buen agüero) y a la izquierda (mal agüero) refleja creencias de adivinación por el vuelo de las aves, de raíz prerromana y clásica, todavía vivas en la cultura popular medieval.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragCid.id,
        type: "figura",
        category: "topos",
        ...anchor(cidText, "¡Esto me an buolto mios enemigos malos!"),
        order: 1,
        content: `**Honor mancillado y recuperado**: el motivo del honor injustamente perdido por la calumnia de unos «enemigos malos» —los infantes de Carrión y sus aliados, que aparecerán más adelante— y que el héroe deberá recuperar con sus actos es el eje argumental de todo el Cantar.`,
      },
      {
        fragmentId: fragCid.id,
        type: "figura",
        category: "sonoro",
        ...anchor(cidText, "mio Çid"),
        order: 2,
        content: `**Epíteto épico**: «mio Çid» («mi señor», del árabe *sidi*) acompaña casi siempre al nombre del héroe, un recurso formulario propio de la poesía de transmisión oral, que facilitaba su recitación por los juglares.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragCid.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Qué señales encuentra el Cid al volver la vista hacia su casa de Vivar, y qué le indican sobre su situación?`,
      },
      {
        fragmentId: fragCid.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El Cid llora, pero inmediatamente «fabló [...] tan mesurado» (habla con mucha mesura). ¿Qué nos dice este contraste sobre el ideal de comportamiento heroico que propone el poema?`,
      },
      {
        fragmentId: fragCid.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `El destierro se presenta como una injusticia causada por la envidia de «enemigos malos». ¿Te parece un recurso narrativo eficaz para ganarse la simpatía del público desde el primer verso? ¿Por qué?`,
      },

      // Intertextualidad
      {
        fragmentId: fragCid.id,
        type: "intertextualidad",
        ...anchor(cidText, "¡Albricia, Álbar Fáñez, ca echados somos de tierra!"),
        order: 1,
        linkType: "external",
        externalCitation: `Guillén de Castro, Las mocedades del Cid (1605-1612), origen a su vez del Cid de Pierre Corneille (1637): el motivo del destierro inmerecido y la fórmula «mio Çid» reaparecen, siglos después, en el teatro del Siglo de Oro y en el clasicismo francés.`,
        content: `La figura del Cid desterrado, fiel pese a la injusticia, se convirtió en uno de los motivos más reescritos de la literatura europea.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — La niña de Burgos
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «La niña de Burgos»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragBurgos.id,
        type: "glosa",
        ...anchor(burgosText, "Aguijó"),
        order: 1,
        content: `«Aguijó»: espoleó al caballo, se apresuró. El mismo gesto se repite, con otra forma del verbo, al final del fragmento («por la ciudad aguijaba»), enmarcando toda la escena entre dos golpes de espuela.`,
      },
      {
        fragmentId: fragBurgos.id,
        type: "glosa",
        ...anchor(burgosText, "la estribera"),
        order: 2,
        content: `«Estribera»: estribo, la pieza donde el jinete apoya el pie al cabalgar. Que el Cid golpee la puerta con el pie, sin desmontar siquiera, transmite la urgencia y la indignidad de la escena: el héroe llama a una puerta como un cualquiera al que no se quiere abrir.`,
      },
      {
        fragmentId: fragBurgos.id,
        type: "glosa",
        ...anchor(burgosText, "que en buena hora ceñisteis la espada"),
        order: 3,
        content: `Fórmula épica que acompaña constantemente al Cid a lo largo del poema («el que en buena hora nació», «el que en buen hora ciñó espada»...). Resulta significativo que sea precisamente una niña quien se la dirija: incluso quien no puede ayudarlo reconoce su valor.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragBurgos.id,
        type: "contexto",
        ...anchor(burgosText, "por temor al rey Alfonso acordaron de cerrarla"),
        order: 1,
        content: `Alfonso VI no solo destierra al Cid, sino que extiende un edicto —una «carta... fuertemente sellada»— que prohíbe a sus súbditos darle cobijo, bajo pena de perder «las casas» e incluso «los ojos de las caras». El destierro convierte así al héroe en una figura intocable para todo el reino, aunque el pueblo, como muestra este episodio, simpatice con él.`,
      },
      {
        fragmentId: fragBurgos.id,
        type: "contexto",
        ...anchor(burgosText, "llega hasta Santa María"),
        order: 2,
        content: `Antes de abandonar Burgos, el Cid se detiene a rezar en la iglesia de Santa María, precedente de la actual catedral. Este gesto —encomendarse a Dios antes de una empresa incierta— es habitual en la épica medieval: frente al rechazo de los hombres, el héroe solo puede confiar en la providencia divina.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragBurgos.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(burgosText, "Los que van con mio Cid con grandes voces llamaban"),
        order: 1,
        content: `**Paralelismo del silencio**: «llamaban» / «no respondían», «golpeaba» / «no se abría». La simetría sintáctica de estos versos construye, mediante la repetición, la sensación de un muro infranqueable: toda Burgos responde al Cid con el mismo silencio cerrado.`,
      },
      {
        fragmentId: fragBurgos.id,
        type: "figura",
        category: "topos",
        ...anchor(burgosText, "Una niña de nueve años frente a mio Cid se para"),
        order: 2,
        content: `**La voz inocente que dice la verdad**: frente al silencio cobarde de los adultos, es una niña quien se atreve a hablar con el héroe. Este contraste humaniza tanto al pueblo de Burgos —que compadece al Cid pese a la prohibición— como al propio Cid, que escucha la explicación sin reproche alguno.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragBurgos.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Por qué nadie en Burgos se atreve a abrir la puerta al Cid? ¿Quién es la única persona que le explica la situación, y qué razones le da?`,
      },
      {
        fragmentId: fragBurgos.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `La niña le asegura al Cid que «en nuestro mal no habíais de ganar nada». ¿Qué quiere decir con esto? ¿Cómo refleja esta frase la relación entre el pueblo de Burgos y el Cid, pese a la prohibición real?`,
      },

      // Intertextualidad
      {
        fragmentId: fragBurgos.id,
        type: "intertextualidad",
        ...anchor(burgosText, "Ya vio el Cid que de su rey no podía esperar gracia"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragCid.id,
        content: `Esta escena ocurre justo después de la salida de Vivar narrada en «El destierro del Cid»: el héroe que allí encontraba su propia casa vacía y «sin cañados» encuentra ahora, en Burgos, todas las puertas cerradas. La soledad del destierro se confirma y se extiende a toda una ciudad.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — El reencuentro en Valencia
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «El reencuentro en Valencia»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragReencuentro.id,
        type: "glosa",
        ...anchor(reencuentroText, "la corrida"),
        order: 1,
        content: `«Corrida»: aquí, cabalgada o recorrido festivo con que los hombres del Cid celebran la llegada de la familia —no una corrida de toros. Forma parte de los festejos de bienvenida, junto con el juego de armas y los tablados.`,
      },
      {
        fragmentId: fragReencuentro.id,
        type: "glosa",
        ...anchor(reencuentroText, "los tablados derribaban"),
        order: 2,
        content: `Juego ecuestre que consistía en derribar a lanzazos unos tablados de madera, habitual en celebraciones cortesanas y militares: una demostración festiva de destreza guerrera, no un combate real.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragReencuentro.id,
        type: "contexto",
        ...anchor(reencuentroText, "Sacado me habéis, al fin, de muchas vergüenzas malas"),
        order: 1,
        content: `Doña Jimena y sus hijas habían quedado en Castilla, dependientes de la caridad de un monasterio, mientras el Cid combatía en el exilio. Su «vergüenza» no es una culpa propia, sino la deshonra heredada del destierro de su esposo: la reunión en Valencia repara, para toda la familia, lo que el edicto real les había arrebatado.`,
      },
      {
        fragmentId: fragReencuentro.id,
        type: "contexto",
        ...anchor(reencuentroText, "entrad conmigo en Valencia que ella ha de ser vuestra casa"),
        order: 2,
        content: `La conquista de Valencia (1094) representa el punto culminante de la trayectoria del Cid como guerrero: ya no depende de las tierras ni del favor de Alfonso VI, sino que ha ganado por sus propias armas un señorío que ahora puede ofrecer a su familia como «heredad».`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragReencuentro.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(reencuentroText, "Vos, doña Jimena mía, mujer querida y honrada"),
        order: 1,
        content: `**Paralelismo de apelativos afectivos**: el Cid encadena aposiciones cariñosas —«mujer querida y honrada», «mi corazón y mi alma»— que rara vez se permite el héroe, siempre comedido. Este despliegue emocional, excepcional en su mesura habitual, marca la intensidad del reencuentro.`,
      },
      {
        fragmentId: fragReencuentro.id,
        type: "figura",
        category: "topos",
        ...anchor(reencuentroText, "que en buen hora ciñó espada"),
        order: 2,
        content: `**Epíteto épico**: la fórmula que identifica al Cid en todo el poema («el que en buen hora nació/ciñó espada») se repite aquí dos veces en pocos versos, como si el propio lenguaje formulario celebrase, junto con los personajes, la fortuna recuperada del héroe.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragReencuentro.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Cómo recibe doña Jimena al Cid? ¿Qué les ofrece el Cid a su mujer e hijas al final del fragmento?`,
      },
      {
        fragmentId: fragReencuentro.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El Cid invita a su familia a vivir en Valencia, una ciudad conquistada por él mismo, en lugar de regresar a sus tierras de Castilla. ¿Qué crees que significa este gesto para su relación con el rey Alfonso y para su propia identidad como señor?`,
      },

      // Intertextualidad
      {
        fragmentId: fragReencuentro.id,
        type: "intertextualidad",
        ...anchor(reencuentroText, "Cuando acabó la corrida, el Campeador descabalga"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragBurgos.id,
        content: `Este reencuentro es el reverso exacto de la escena de Burgos («La niña de Burgos»): si allí el Cid encontraba puertas cerradas y debía marchar solo, dejando atrás una ciudad entera que no se atrevía a recibirlo, aquí entra triunfante en su propia ciudad, con su familia reunida y «en medio de grande pompa».`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Las bodas de las hijas del Cid
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Las bodas de las hijas del Cid»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragBodasInfantes.id,
        type: "glosa",
        ...anchor(bodasInfantesText, "roguemos al Creador"),
        order: 1,
        content: `«El Creador»: Dios, nombrado mediante esta perífrasis frecuente en el poema. El discurso del Cid se abre con una invocación religiosa, como corresponde a un acto solemne —el anuncio de un matrimonio concertado— pronunciado en público ante toda la familia.`,
      },
      {
        fragmentId: fragBodasInfantes.id,
        type: "glosa",
        ...anchor(bodasInfantesText, "doña Elvira y doña Sol"),
        order: 2,
        content: `Nombres que el poema da a las hijas del Cid (la onomástica histórica de las hijas reales de Rodrigo Díaz era distinta). A partir de este momento son ellas —y no su padre— quienes sufrirán las consecuencias de esta decisión.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragBodasInfantes.id,
        type: "contexto",
        ...anchor(bodasInfantesText, "os ha pedido y rogado don Alfonso, mi señor"),
        order: 1,
        content: `Los infantes de Carrión pertenecían a la alta nobleza leonesa, muy superior en rango a un caballero como el Cid. El propio rey Alfonso VI propone el enlace como gesto de reconciliación y honra hacia su antiguo vasallo desterrado, pero el lector del poema, que ya conoce la cobardía de los infantes ante el león, sospecha que esta «honra» encierra una amenaza.`,
      },
      {
        fragmentId: fragBodasInfantes.id,
        type: "contexto",
        ...anchor(bodasInfantesText, "que a ninguna cosa suya, supe decirle que no"),
        order: 2,
        content: `En el sistema feudal, un vasallo no puede negarse fácilmente a una petición de su señor, ni siquiera en un asunto tan íntimo como el matrimonio de sus hijas. El Cid obedece, pero el poema deja constancia explícita de que la iniciativa no fue suya: una precaución que, ante las cortes de Toledo, resultará decisiva.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragBodasInfantes.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(bodasInfantesText, "Os puse, pues, en sus manos, hijas mías, a las dos"),
        order: 1,
        content: `**Discurso ritual y público**: la repetición de «hijas mías» y el tono solemne de la alocución convierten este pasaje en una declaración casi notarial, dirigida tanto a Jimena y sus hijas como, indirectamente, a cualquiera que pudiera en el futuro reclamar responsabilidades por esta boda.`,
      },
      {
        fragmentId: fragBodasInfantes.id,
        type: "figura",
        category: "topos",
        ...anchor(bodasInfantesText, "él os casa, que no yo"),
        order: 2,
        content: `**Anticipación dramática**: la insistencia del Cid en deslindar su responsabilidad —«no las inicié yo», «él os casa, que no yo»— funciona como una ironía dramática para el público del poema, que sabe que esta boda terminará en la afrenta de Corpes. El héroe, sin saberlo, se está ya defendiendo de una deshonra futura.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragBodasInfantes.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `Según las palabras del Cid, ¿de quién es la idea de casar a sus hijas con los infantes de Carrión? ¿Cómo justifica el Cid su aceptación?`,
      },
      {
        fragmentId: fragBodasInfantes.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `El Cid repite varias veces que la decisión «no la inicié yo» y que «él os casa, que no yo». ¿Por qué crees que insiste tanto en este punto? ¿Qué relación tiene esta insistencia con el concepto de honra que recorre todo el poema?`,
      },

      // Intertextualidad
      {
        fragmentId: fragBodasInfantes.id,
        type: "intertextualidad",
        ...anchor(bodasInfantesText, "Mi mujer, doña Jimena, roguemos al Creador"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragReencuentro.id,
        content: `Este discurso se pronuncia justo después del feliz reencuentro narrado en «El reencuentro en Valencia»: la alegría de la familia recién reunida queda inmediatamente ensombrecida por una decisión de la que el Cid se desentiende explícitamente, y que el lector —anticipando la afrenta de Corpes— sabe que acabará mal.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — El Cid y el león
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «El Cid y el león»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragLeon.id,
        type: "glosa",
        ...anchor(leonText, "su escaño"),
        order: 1,
        content: `«Escaño»: banco. El Cid descansa en un banco, no en una cámara cerrada, lo que explica que toda la corte pueda rodearlo en un instante cuando se desata la alarma.`,
      },
      {
        fragmentId: fragLeon.id,
        type: "glosa",
        ...anchor(leonText, "Embrazan sus mantos"),
        order: 2,
        content: `«Embrazar los mantos»: enrollarlos en el brazo a modo de escudo improvisado. Es la única «arma» que la corte tiene a mano frente al león: un gesto de defensa más simbólico que efectivo.`,
      },
      {
        fragmentId: fragLeon.id,
        type: "glosa",
        ...anchor(leonText, "manto y brial"),
        order: 3,
        content: `«Brial»: túnica. Junto con el manto, es la vestimenta que Diego González saca «todo sucio» de su escondite tras la viga del lagar: un detalle físico que convierte la vergüenza en algo literalmente visible y maloliente.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragLeon.id,
        type: "contexto",
        ...anchor(leonText, "y también ambos sus yernos los infantes de Carrión"),
        order: 1,
        content: `Tras el doble matrimonio narrado en «Las bodas de las hijas del Cid», los infantes de Carrión viven ya en la corte valenciana como yernos del Campeador. Esta escena es la primera vez que el poema los muestra en acción, y lo hace para revelar, ante toda la corte, su carácter.`,
      },
      {
        fragmentId: fragLeon.id,
        type: "contexto",
        ...anchor(leonText, "Mio Cid Rodrigo Díaz por el cuello lo cogió"),
        order: 2,
        content: `El dominio del león por parte del Cid, a mano limpia y recién despertado, frente al pánico generalizado de la corte, funciona como una demostración pública de la superioridad del héroe sobre sus nuevos yernos: una superioridad que los infantes no perdonarán.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragLeon.id,
        type: "figura",
        category: "tropo",
        ...anchor(leonText, "metiose bajo el escaño, tanto era su pavor"),
        order: 1,
        content: `**Registro cómico dentro de la épica**: la imagen de un noble escondido bajo un banco y otro emboscado, sucio, tras una viga de lagar introduce un tono casi burlesco, infrecuente en la épica heroica. Este contraste entre la grandeza del género y la pequeñez ridícula de los infantes anticipa, mediante la comicidad, su próxima caída moral.`,
      },
      {
        fragmentId: fragLeon.id,
        type: "figura",
        category: "topos",
        ...anchor(leonText, "el que en buen hora nació"),
        order: 2,
        content: `**Epíteto épico**: la fórmula que acompaña al Cid a lo largo de todo el poema reaparece justo en el momento en que el héroe, recién despertado y sin armas, somete al león con absoluta naturalidad, reforzando la identificación entre el personaje y su buena fortuna providencial.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragLeon.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Cómo reaccionan los infantes de Carrión ante la huida del león? ¿Y cómo reacciona el Cid?`,
      },
      {
        fragmentId: fragLeon.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El poema dedica varios versos a describir, con detalle casi cómico, los escondites de los dos infantes. ¿Qué función cumple esta escena dentro del relato? ¿Por qué crees que el poeta quiere que toda la corte sea testigo de su cobardía?`,
      },

      // Intertextualidad
      {
        fragmentId: fragLeon.id,
        type: "intertextualidad",
        ...anchor(leonText, "Pero Fernán González, un infante de Carrión"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragBodasInfantes.id,
        content: `Los mismos infantes cuyo matrimonio con las hijas del Cid se anunciaba, no sin reticencias, en «Las bodas de las hijas del Cid» aparecen aquí, por primera vez en acción, demostrando ante toda la corte la cobardía que —humillados y resentidos— intentarán vengar más adelante sobre quienes menos culpa tienen.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — La afrenta de Corpes
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «La afrenta de Corpes»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragCorpes.id,
        type: "glosa",
        ...anchor(corpesText, "ciclatón"),
        order: 1,
        content: `«Ciclatón»: vestidura de lujo usada en la Edad Media. Que quede «roto» y manchado de sangre convierte una prenda de honor y rango en símbolo físico de la deshonra que se está cometiendo.`,
      },
      {
        fragmentId: fragCorpes.id,
        type: "glosa",
        ...anchor(corpesText, "cinchas corredizas"),
        order: 2,
        content: `Correas de cuero que normalmente sujetan la silla de montar al caballo, aquí convertidas en instrumento de tortura: los infantes desnaturalizan objetos cotidianos del mundo caballeresco para infligir dolor.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragCorpes.id,
        type: "contexto",
        ...anchor(corpesText, "Entonces las comenzaron a azotar los de Carrión"),
        order: 1,
        content: `El robledal de Corpes, donde los infantes abandonan y azotan a las hijas del Cid tras alejarlas con el pretexto de un viaje a sus tierras, da nombre a este último cantar: la «afrenta» es la deshonra máxima que sufre la familia del Cid, y motivará la demanda de justicia ante las cortes de Toledo.`,
      },
      {
        fragmentId: fragCorpes.id,
        type: "contexto",
        ...anchor(corpesText, "Y ellas la sienten hervir dentro de su corazón"),
        order: 2,
        content: `La afrenta no es solo física: en la sociedad medieval, el ultraje a las hijas constituye una deshonra que recae sobre todo el linaje del Cid. Por eso el desenlace del poema no se limitará a curar las heridas, sino que exigirá una reparación pública —devolución de bienes, duelo judicial y nuevas bodas— que restituya el honor familiar ante toda la corte.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragCorpes.id,
        type: "figura",
        category: "tropo",
        ...anchor(corpesText, "limpia salía la sangre sobre el roto ciclatón"),
        order: 1,
        content: `**Patetismo**: el poema no elude el detalle físico de la violencia —la sangre, las camisas rotas, las carnes heridas— para que se sienta con crudeza la injusticia del ultraje, en contraste con la dignidad («ciclatón», vestido de lujo) de quienes lo sufren.`,
      },
      {
        fragmentId: fragCorpes.id,
        type: "figura",
        category: "sonoro",
        ...anchor(corpesText, "que asomarse ahora pudiera mio Cid Campeador"),
        order: 2,
        content: `**Apóstrofe**: el fragmento se cierra con una exclamación que invoca al héroe ausente, dirigida tanto a Dios («si pluguiese al Creador») como, implícitamente, al público que escucha el poema. Esta llamada a una presencia que no llega intensifica el dramatismo y prepara, por contraste, la futura venganza.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragCorpes.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Qué les hacen los infantes de Carrión a las hijas del Cid en el robledal de Corpes? ¿Con qué objetos las golpean?`,
      },
      {
        fragmentId: fragCorpes.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `El fragmento termina deseando que el Cid pudiera estar presente para defender a sus hijas. ¿Qué efecto produce en el lector esta ausencia del héroe en el momento de mayor peligro? ¿Cómo crees que se restaurará el honor perdido?`,
      },

      // Intertextualidad
      {
        fragmentId: fragCorpes.id,
        type: "intertextualidad",
        ...anchor(corpesText, "Mucho rogaban las damas, mas de nada les sirvió"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragLeon.id,
        content: `Los mismos infantes que en «El Cid y el león» habían quedado en ridículo ante toda la corte —uno escondido bajo un banco, el otro tras una viga, ambos sucios de miedo— se vengan aquí de su humillación pública sobre quienes menos culpa tienen: las hijas del hombre que los avergonzó.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Final del Cantar de Mio Cid
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Final del Cantar de Mio Cid»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragFinalCid.id,
        type: "glosa",
        ...anchor(finalCidText, "Pentecostés"),
        order: 1,
        content: `Fiesta cristiana celebrada cincuenta días después de la Pascua de Resurrección. El poema fecha simbólicamente la muerte del Cid en una festividad asociada a la plenitud y al Espíritu Santo, no a la tristeza.`,
      },
      {
        fragmentId: fragFinalCid.id,
        type: "glosa",
        ...anchor(finalCidText, "Alfonso el de León"),
        order: 2,
        content: `Alfonso VI, el mismo rey que había desterrado al Cid al principio del poema y que había propuesto el primer matrimonio de sus hijas con los infantes de Carrión.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragFinalCid.id,
        type: "contexto",
        ...anchor(finalCidText, "Ya comenzaron los tratos con Navarra y Aragón"),
        order: 1,
        content: `Tras el juicio de las cortes de Toledo —no incluido en estos fragmentos—, en el que los infantes de Carrión son derrotados y deshonrados, las hijas del Cid contraen nuevos matrimonios con los herederos de Navarra y Aragón. Las hijas históricas de Rodrigo Díaz emparentaron realmente con las casas reales de Navarra y Barcelona, lo que ha llevado a la crítica a señalar este final como uno de los puntos de mayor verosimilitud histórica del poema.`,
      },
      {
        fragmentId: fragFinalCid.id,
        type: "contexto",
        ...anchor(finalCidText, "En llegando a este lugar se termina esta canción"),
        order: 2,
        content: `Esta fórmula de cierre —anunciar explícitamente el final de la obra— es habitual en los cantares de gesta, compuestos para la recitación oral: el juglar necesita marcar con claridad ante su público el término de la actuación, igual que al principio anunciaba su comienzo.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragFinalCid.id,
        type: "figura",
        category: "topos",
        ...anchor(finalCidText, "Ved cómo aumenta la honra por el que en buena nació"),
        order: 1,
        content: `**Tesis del poema**: este verso resume el sentido de todo el Cantar. La honra del Cid no solo se restituye tras el destierro y la afrenta de Corpes, sino que aumenta respecto a la situación inicial: un ejemplo de justicia poética que recorre la obra de principio a fin.`,
      },
      {
        fragmentId: fragFinalCid.id,
        type: "figura",
        category: "sonoro",
        ...anchor(finalCidText, "el justo y el pecador"),
        order: 2,
        content: `**Fórmula de cierre religioso**: la invocación final —«¡de Cristo alcance el perdón! ¡Así hagamos nosotros, el justo y el pecador!»— extiende el destino individual del Cid a todo el público que escucha el poema, dotando a la narración heroica de una dimensión espiritual compartida.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragFinalCid.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Con quién se casan finalmente doña Elvira y doña Sol? ¿Cómo se comparan estos matrimonios con los anteriores, con los infantes de Carrión?`,
      },
      {
        fragmentId: fragFinalCid.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `El verso «Ved cómo aumenta la honra por el que en buena nació» resume el sentido del poema. A partir de los fragmentos que has leído —el destierro, la afrenta de Corpes y este final—, ¿cómo se cumple esta idea en la historia del Cid?`,
      },

      // Intertextualidad
      {
        fragmentId: fragFinalCid.id,
        type: "intertextualidad",
        ...anchor(finalCidText, "Hicieron sus casamientos doña Elvira y doña Sol"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragCid.id,
        content: `El poema cierra el círculo abierto en «El destierro del Cid»: el héroe que salía de Vivar entre lágrimas, «echado de tierra» por la calumnia de sus enemigos, termina sus días como señor de Valencia, con sus hijas mejor casadas que con los infantes que las deshonraron. La honra perdida en el primer verso del poema queda, en el último, no solo recuperada, sino multiplicada.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Soneto XXIII
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Soneto XXIII»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragSoneto.id,
        type: "glosa",
        ...anchor(sonetoText, "azucena"),
        order: 1,
        content: `Flor blanca (lirio), símbolo tradicional de pureza y blancura. Junto con la rosa, forma el tópico clásico de la *descriptio puellae* (descripción de la belleza femenina mediante flores y metales preciosos).`,
      },
      {
        fragmentId: fragSoneto.id,
        type: "glosa",
        ...anchor(sonetoText, "enhiesto"),
        order: 2,
        content: `Erguido, levantado. Describe el cuello de la dama, recto y airoso.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragSoneto.id,
        type: "contexto",
        ...anchor(sonetoText, "En tanto que de rosa y azucena"),
        order: 1,
        content: `Garcilaso introduce en la poesía castellana el endecasílabo y las formas italianas (soneto, lira) siguiendo el modelo de Petrarca, gracias en parte a su amistad con el humanista Juan Boscán. Este soneto es uno de los ejemplos más célebres de esa asimilación del petrarquismo en español.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragSoneto.id,
        type: "figura",
        category: "topos",
        ...anchor(sonetoText, "coged de vuestra alegre primavera"),
        order: 1,
        content: `**Carpe diem**: tópico horaciano («aprovecha el día») que invita a gozar de la juventud y la belleza antes de que el tiempo las destruya. «Coged» es prácticamente una traducción del «carpe» de Horacio.`,
      },
      {
        fragmentId: fragSoneto.id,
        type: "figura",
        category: "topos",
        ...anchor(sonetoText, "Marchitará la rosa el viento helado"),
        order: 2,
        content: `**Collige, virgo, rosas** (Ausonio) / tempus fugit: la flor que se marchita simboliza el paso inexorable del tiempo sobre la belleza humana, reforzando la llamada al disfrute del presente.`,
      },
      {
        fragmentId: fragSoneto.id,
        type: "figura",
        category: "tropo",
        ...anchor(sonetoText, "de rosa y azucena"),
        order: 3,
        content: `**Metáfora floral**: el rostro de la dama se describe mediante flores (rosa = mejillas encendidas, azucena = blancura de la piel), procedimiento típico de la *descriptio puellae* petrarquista.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragSoneto.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Qué elementos de la belleza de la dama se describen en los dos primeros cuartetos?`,
      },
      {
        fragmentId: fragSoneto.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `¿Cómo se relacionan los dos tercetos con los dos cuartetos? ¿Qué cambio de tono se produce?`,
      },
      {
        fragmentId: fragSoneto.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `El poema advierte a la dama de que su belleza se marchitará. ¿Te parece una forma de elogio, una amenaza velada, o ambas cosas a la vez? Razona tu respuesta.`,
      },

      // Intertextualidad
      {
        fragmentId: fragSoneto.id,
        type: "intertextualidad",
        ...anchor(sonetoText, "coged de vuestra alegre primavera"),
        order: 1,
        linkType: "external",
        externalCitation: `Horacio, Odas I, 11: «carpe diem, quam minimum credula postero» («aprovecha el día, no confíes en el de mañana»). El tópico llega a Garcilaso a través de la tradición petrarquista italiana.`,
        content: `La invitación a «coger» el fruto del presente traduce casi literalmente la fórmula horaciana que dio nombre al tópico.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Rima LIII
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Rima LIII»...");

  await prisma.annotation.createMany({
    data: [
      // Glosa léxica
      {
        fragmentId: fragRima.id,
        type: "glosa",
        ...anchor(rimaText, "madreselvas"),
        order: 1,
        content: `Planta trepadora de flores muy aromáticas, frecuente en jardines y tapias; aquí, parte del paisaje doméstico compartido por los amantes.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragRima.id,
        type: "contexto",
        ...anchor(rimaText, "Volverán las oscuras golondrinas"),
        order: 1,
        content: `Las *Rimas* de Bécquer, publicadas póstumamente en 1871, marcan la transición entre el Romanticismo grandilocuente y una poesía más íntima y de apariencia sencilla, muy influida por Heine, que anticipa a Machado y Juan Ramón Jiménez.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragRima.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(rimaText, "Volverán las oscuras golondrinas"),
        order: 1,
        content: `**Paralelismo anafórico**: cada estrofa par contrapone, mediante «Volverán...» / «Pero aquellas... no volverán», lo que se repite en la naturaleza frente a lo irrepetible de la experiencia amorosa vivida. Esta estructura organiza el poema entero.`,
      },
      {
        fragmentId: fragRima.id,
        type: "figura",
        category: "tropo",
        ...anchor(rimaText, "como se adora a Dios ante su altar"),
        order: 2,
        content: `**Símil**: la entrega amorosa del yo poético se compara con la devoción religiosa, intensificando hasta el límite la idea de un amor que no podrá repetirse con nadie más.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragRima.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Qué elementos de la naturaleza menciona el poema que «volverán», y qué es lo único que «no volverá»?`,
      },
      {
        fragmentId: fragRima.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `¿Por qué crees que el poeta elige elementos naturales cíclicos (golondrinas, madreselvas) para contrastarlos con la experiencia amorosa?`,
      },
      {
        fragmentId: fragRima.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `El poema termina con una afirmación tajante: «¡así no te querrán!». ¿Te parece una declaración de amor, un reproche, o las dos cosas? ¿Cómo te suena hoy ese tono?`,
      },

      // Intertextualidad
      {
        fragmentId: fragRima.id,
        type: "intertextualidad",
        ...anchor(rimaText, "no volverán"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragSoneto.id,
        content: `Como el soneto de Garcilaso, esta rima utiliza el paso del tiempo —aquí irreversible, allí amenazante— para intensificar la experiencia amorosa, aunque con un tono íntimo y melancólico muy distinto del petrarquismo renacentista.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Las ninfas del Tajo
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Las ninfas del Tajo»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragTajo.id,
        type: "glosa",
        ...anchor(tajoText, "amena"),
        order: 1,
        content: `Agradable, apacible. El adjetivo abre la fórmula del *locus amoenus* («lugar ameno»): el paisaje idealizado —sombra, agua, brisa— propio de la poesía bucólica.`,
      },
      {
        fragmentId: fragTajo.id,
        type: "glosa",
        ...anchor(tajoText, "do moraba"),
        order: 2,
        content: `«Do» es forma arcaica de «donde». «Do moraba»: donde vivía.`,
      },
      {
        fragmentId: fragTajo.id,
        type: "glosa",
        ...anchor(tajoText, "somorgujó"),
        order: 3,
        content: `Sumergió. Verbo de origen dialectal, hoy en desuso, que describe el gesto de la ninfa al volver a hundir la cabeza bajo el agua.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragTajo.id,
        type: "contexto",
        ...anchor(tajoText, "Cerca del Tajo, en soledad amena"),
        order: 1,
        content: `La Égloga III, probablemente la última obra de Garcilaso, sitúa su acción a orillas del Tajo, cerca de Toledo. El poeta adapta al castellano el género bucólico de Virgilio (Bucólicas) y de Sannazaro, construyendo un paisaje idealizado que servirá de marco a las historias que se cuentan a continuación.`,
      },
      {
        fragmentId: fragTajo.id,
        type: "contexto",
        ...anchor(tajoText, "una ninfa del agua do moraba"),
        order: 2,
        content: `Esta ninfa es la primera de las cuatro habitantes del Tajo —Filódoce, Dinámene, Climene y Nise— que, según se cuenta a continuación, se reúnen a bordar tapices con historias de amores desgraciados.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragTajo.id,
        type: "figura",
        category: "tropo",
        ...anchor(tajoText, "Tajo en aquella parte caminaba"),
        order: 1,
        content: `**Personificación**: el río «camina» con mansedumbre, como si fuera un ser vivo que se desplaza despacio por el paisaje.`,
      },
      {
        fragmentId: fragTajo.id,
        type: "figura",
        category: "sonoro",
        ...anchor(tajoText, "un susurro de abejas que sonaba"),
        order: 2,
        content: `**Aliteración / onomatopeya**: la repetición de los sonidos sibilantes («susurro», «sonaba») imita acústicamente el zumbido de las abejas en el silencio del mediodía.`,
      },
      {
        fragmentId: fragTajo.id,
        type: "figura",
        category: "topos",
        ...anchor(tajoText, "el agua baña el prado con sonido,\nalegrando la hierba y el oído"),
        order: 3,
        content: `**Locus amoenus**: el catálogo de elementos —sombra, agua, brisa, canto de aves— compone el «lugar ameno» de la tradición bucólica clásica, escenario apacible que contrastará con las historias de amor y muerte que se tejerán después.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragTajo.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Qué elementos del paisaje rodean a la ninfa que sale del agua?`,
      },
      {
        fragmentId: fragTajo.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `¿Por qué crees que Garcilaso abre la égloga con esta descripción detallada de un lugar idílico, antes de que las ninfas tejan sus historias de amores trágicos?`,
      },
      {
        fragmentId: fragTajo.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `¿Te parece que esta minuciosa descripción del paisaje conserva hoy su atractivo, o resulta excesiva para un lector actual?`,
      },

      // Intertextualidad
      {
        fragmentId: fragTajo.id,
        type: "intertextualidad",
        ...anchor(tajoText, "Cerca del Tajo, en soledad amena"),
        order: 1,
        linkType: "external",
        externalCitation: `Virgilio, Bucólicas, Égloga I: «Tityre, tu patulae recubans sub tegmine fagi» («Títiro, tú, recostado bajo la sombra de una frondosa haya»).`,
        content: `Garcilaso traslada al Tajo el *locus amoenus* virgiliano: cambia el haya por los sauces y la hiedra, pero conserva la misma fórmula —un lugar sombreado junto al agua, propicio al descanso y al relato— con la que se abre la tradición bucólica europea.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — El tapiz de Orfeo y Eurídice
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «El tapiz de Orfeo y Eurídice»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragOrfeo.id,
        type: "glosa",
        ...anchor(orfeoText, "sierpe"),
        order: 1,
        content: `Serpiente. La «pequeña sierpe ponzoñosa» es la víbora cuya mordedura provoca, según el mito, la muerte de Eurídice.`,
      },
      {
        fragmentId: fragOrfeo.id,
        type: "glosa",
        ...anchor(orfeoText, "la escura gente"),
        order: 2,
        content: `Los muertos, los habitantes del inframundo. «Escura» es forma antigua de «oscura».`,
      },
      {
        fragmentId: fragOrfeo.id,
        type: "glosa",
        ...anchor(orfeoText, "miralla"),
        order: 3,
        content: `Mirarla. La asimilación del pronombre enclítico («mirar» + «la» = «miralla») es habitual en la poesía castellana de los siglos XV y XVI.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragOrfeo.id,
        type: "contexto",
        ...anchor(orfeoText, "Estaba figurada la hermosa"),
        order: 1,
        content: `El tapiz que teje la ninfa Filódoce representa el mito de Orfeo y Eurídice (Ovidio, Metamorfosis X; Virgilio, Geórgicas IV): Orfeo desciende al inframundo para rescatar a su esposa, muerta por la mordedura de una serpiente, pero la pierde de nuevo al volverse a mirarla antes de salir, incumpliendo la condición impuesta por Plutón.`,
      },
      {
        fragmentId: fragOrfeo.id,
        type: "contexto",
        ...anchor(orfeoText, "del tirano"),
        order: 2,
        content: `«El tirano» es Plutón, dios del inframundo. Este tapiz inaugura una serie de tres —seguirán los de Climene (Venus y Adonis) y de Nise (la muerte de Elisa)— que funcionan como un catálogo de amores desgraciados, antesala de la elegía final por la amada del propio Garcilaso.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragOrfeo.id,
        type: "figura",
        category: "tropo",
        ...anchor(orfeoText, "descolorida estaba como rosa\nque ha sido fuera de sazón cogida"),
        order: 1,
        content: `**Símil**: la palidez de Eurídice muerta se compara con una rosa cortada antes de tiempo, anticipando la imagen floral que volverá a aparecer en el tapiz de Nise dedicado a Elisa.`,
      },
      {
        fragmentId: fragOrfeo.id,
        type: "figura",
        category: "topos",
        ...anchor(orfeoText, "al triste reino de la escura gente"),
        order: 2,
        content: `**Descensus ad inferos**: el descenso del héroe al reino de los muertos para rescatar a un ser querido es un tópico de raíz clásica que recorre la épica y la lírica desde Orfeo y Eneas hasta la tradición cristiana del descenso de Cristo a los infiernos.`,
      },
      {
        fragmentId: fragOrfeo.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(orfeoText, "la tornaba\na perder otra vez"),
        order: 3,
        content: `**Encabalgamiento**: el verbo «tornaba» queda en suspenso al final del verso y su complemento («a perder otra vez») cae en el siguiente, reproduciendo con el ritmo de la lectura el instante de la pérdida.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragOrfeo.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Qué le ocurre primero a Eurídice, y qué hace después Orfeo?`,
      },
      {
        fragmentId: fragOrfeo.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `¿Por qué crees que Garcilaso elige este mito en concreto para abrir la serie de tapices que tejen las ninfas?`,
      },
      {
        fragmentId: fragOrfeo.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `La «impaciencia» de Orfeo por volver a mirar a Eurídice le hace perderla para siempre. ¿Te parece un defecto humano comprensible o un castigo desproporcionado?`,
      },

      // Intertextualidad
      {
        fragmentId: fragOrfeo.id,
        type: "intertextualidad",
        ...anchor(orfeoText, "del tirano"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragVenusAdonis.id,
        content: `El tapiz de Filódoce abre una serie: el siguiente, tejido por Climene, mostrará la muerte de Adonis. Ambos forman un catálogo de amores desgraciados que prepara, por contraste y acumulación, la elegía final por Elisa.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — El tapiz de Venus y Adonis
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «El tapiz de Venus y Adonis»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragVenusAdonis.id,
        type: "glosa",
        ...anchor(venusAdonisText, "se vía herido"),
        order: 1,
        content: `«Se vía» es forma arcaica de «se veía». La construcción se repite en los tres tapices: el verbo «ver» subraya que se trata de una escena representada, tejida, no vivida.`,
      },
      {
        fragmentId: fragVenusAdonis.id,
        type: "glosa",
        ...anchor(venusAdonisText, "desparcido"),
        order: 2,
        content: `Esparcido, despeinado, en desorden. Describe el cabello dorado de Adonis, tendido por el suelo.`,
      },
      {
        fragmentId: fragVenusAdonis.id,
        type: "glosa",
        ...anchor(venusAdonisText, "amortecida"),
        order: 3,
        content: `Desmayada, casi sin sentido. Describe el estado de Venus al ver a Adonis herido de muerte.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragVenusAdonis.id,
        type: "contexto",
        ...anchor(venusAdonisText, "Adonis este se mostraba que era"),
        order: 1,
        content: `El tapiz de Climene representa el mito de Venus y Adonis (Ovidio, Metamorfosis X): el joven, pese a las advertencias de la diosa, muere corneado por un jabalí durante una cacería, y Venus llega solo a tiempo de recoger su último aliento.`,
      },
      {
        fragmentId: fragVenusAdonis.id,
        type: "contexto",
        ...anchor(venusAdonisText, "las rosas blancas por allí sembradas\ntornaban con su sangre coloradas"),
        order: 2,
        content: `Mito etiológico: la tradición clásica explica el origen de las rosas rojas a partir de la sangre de Adonis (o, en otras versiones, de las lágrimas de Venus mezcladas con ella), tiñendo de rojo las rosas blancas que antes existían.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragVenusAdonis.id,
        type: "figura",
        category: "tropo",
        ...anchor(venusAdonisText, "boca con boca coge la postrera\nparte del aire que solía dar vida"),
        order: 1,
        content: `**Metáfora**: el último beso de Venus se describe como el gesto de «recoger» el último aliento de Adonis, convirtiendo un acto físico en una imagen casi táctil de la vida que se escapa.`,
      },
      {
        fragmentId: fragVenusAdonis.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(venusAdonisText, "Tras esto, el puerco allí se vía herido\nde aquel mancebo, por su mal valiente"),
        order: 2,
        content: `**Hiperbaton**: el orden de los elementos —sujeto («el puerco»), agente («de aquel mancebo») y el adverbio «por su mal»— se distribuye a lo largo del verso de forma poco natural en prosa, recurso habitual de la sintaxis renacentista para ajustar el verso al endecasílabo.`,
      },
      {
        fragmentId: fragVenusAdonis.id,
        type: "figura",
        category: "topos",
        ...anchor(venusAdonisText, "el mozo en tierra estaba ya tendido"),
        order: 3,
        content: `**Et in Arcadia ego**: la muerte irrumpe en el paisaje idealizado —el «mozo» yace «en tierra», entre flores y hierba— recordando que ni siquiera el mundo bucólico está a salvo de la mortalidad.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragVenusAdonis.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Cómo se describe la herida de Adonis y la reacción de Venus al encontrarlo?`,
      },
      {
        fragmentId: fragVenusAdonis.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `¿Qué efecto produce el gesto final de Venus —«boca con boca»— en la forma en que percibimos la muerte de Adonis?`,
      },
      {
        fragmentId: fragVenusAdonis.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `Compara este tapiz con el de Orfeo y Eurídice. ¿Cuál de las dos escenas te parece más trágica, y por qué?`,
      },

      // Intertextualidad
      {
        fragmentId: fragVenusAdonis.id,
        type: "intertextualidad",
        ...anchor(venusAdonisText, "el mozo en tierra estaba ya tendido"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragElisa.id,
        content: `La muerte de Adonis, «en tierra... tendido» entre flores, anticipa la imagen de Elisa, «entre las hierbas degollada»: ambas escenas convierten el lugar ameno en escenario de una muerte prematura que interrumpe la belleza en su plenitud.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — La muerte de Elisa
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «La muerte de Elisa»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragElisa.id,
        type: "glosa",
        ...anchor(elisaText, "purpúreas rosas"),
        order: 1,
        content: `De color rojo violáceo intenso. Las diosas derraman estas rosas sobre el cuerpo de la ninfa muerta.`,
      },
      {
        fragmentId: fragElisa.id,
        type: "glosa",
        ...anchor(elisaText, "desparcido"),
        order: 2,
        content: `Esparcido, despeinado, en señal de duelo: el cabello suelto y revuelto era gesto tradicional de luto.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragElisa.id,
        type: "contexto",
        ...anchor(elisaText, "En la hermosa tela se veían"),
        order: 1,
        content: `Este tercer tapiz, tejido por la ninfa Nise, rompe con los dos anteriores: ya no narra un mito antiguo, sino un suceso situado en el presente, junto al Tajo. Elisa es el nombre bucólico bajo el que Garcilaso llora a Isabel Freyre, dama portuguesa de quien estuvo enamorado y que murió joven.`,
      },
      {
        fragmentId: fragElisa.id,
        type: "contexto",
        ...anchor(elisaText, "estaba entre las hierbas degollada"),
        order: 2,
        content: `La violencia de «degollada» resulta sorprendente en el marco apacible del *locus amoenus*: la muerte real de la amada irrumpe en el paisaje idealizado con una crudeza que los mitos anteriores —pese a sus propias muertes— no habían mostrado.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragElisa.id,
        type: "figura",
        category: "topos",
        ...anchor(elisaText, "antes de tiempo y casi en flor cortada"),
        order: 1,
        content: `**Flos succisus** («flor cortada»): la muerte temprana se figura como una flor cortada antes de su plenitud, variante del tópico *tempus fugit* aplicado no ya a la belleza que se marchitará, sino a una vida truncada de golpe.`,
      },
      {
        fragmentId: fragElisa.id,
        type: "figura",
        category: "tropo",
        ...anchor(elisaText, "cual queda el blanco cisne cuando pierde\nla dulce vida entre la hierba verde"),
        order: 2,
        content: `**Símil**: la muerte de Elisa se compara con la de un cisne blanco que expira sobre la hierba verde, en un contraste cromático (blanco/verde) que embellece la imagen de la muerte sin atenuar su tristeza.`,
      },
      {
        fragmentId: fragElisa.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(elisaText, "Todas con el cabello desparcido\nlloraban una ninfa delicada"),
        order: 3,
        content: `**Repetición**: el verbo «lloraban», que cierra la primera octava («sobre una ninfa muerta que lloraban»), se repite al abrir la segunda, encadenando las dos estrofas y subrayando el llanto colectivo de las diosas.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragElisa.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Qué hacen las diosas silvestres en este tapiz, y cómo se describe a la ninfa muerta?`,
      },
      {
        fragmentId: fragElisa.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `Garcilaso convierte la muerte de su amada Isabel Freyre en la figura mitológica de Elisa, llorada por diosas silvestres. ¿Qué efecto produce este distanciamiento entre el dolor real y su representación poética?`,
      },
      {
        fragmentId: fragElisa.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `¿Te parece que comparar la muerte con una flor cortada o un cisne moribundo es una forma adecuada de hablar del dolor, o un recurso que lo embellece en exceso?`,
      },

      // Intertextualidad
      {
        fragmentId: fragElisa.id,
        type: "intertextualidad",
        ...anchor(elisaText, "antes de tiempo y casi en flor cortada"),
        order: 1,
        linkType: "external",
        externalCitation: `Jorge Manrique, Coplas por la muerte de su padre: «Nuestras vidas son los ríos / que van a dar en la mar, / que es el morir».`,
        content: `La imagen de una vida «cortada» antes de tiempo enlaza con la meditación de Manrique sobre el «ubi sunt»: toda vida, por joven o hermosa que sea, desemboca igualmente en la muerte; Garcilaso convierte esa verdad general en elegía particular por Elisa.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — El canto de Tirreno y Alcino
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «El canto de Tirreno y Alcino»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragPastores.id,
        type: "glosa",
        ...anchor(pastoresText, "majada"),
        order: 1,
        content: `Refugio para los pastores y el ganado. El rebaño es conducido allí al caer la tarde.`,
      },
      {
        fragmentId: fragPastores.id,
        type: "glosa",
        ...anchor(pastoresText, "fragosa sierra"),
        order: 2,
        content: `«Fragosa»: áspera, intrincada, llena de obstáculos. Describe la sierra donde el viento desarraiga los árboles.`,
      },
      {
        fragmentId: fragPastores.id,
        type: "glosa",
        ...anchor(pastoresText, "atierra"),
        order: 3,
        content: `Derriba, echa por tierra. El viento «atierra» los robles y los pinos más altos.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragPastores.id,
        type: "contexto",
        ...anchor(pastoresText, "TIRRENO."),
        order: 1,
        content: `Tirreno y Alcino cantan en forma de «canto amebeo»: composiciones alternadas en las que dos pastores responden uno al otro, convención bucólica que se remonta a Teócrito y a las Bucólicas de Virgilio. Flérida y Filis son nombres pastoriles convencionales, no personajes históricos identificables.`,
      },
      {
        fragmentId: fragPastores.id,
        type: "contexto",
        ...anchor(pastoresText, "Esto cantó Tirreno, y esto Alcino"),
        order: 2,
        content: `Con este canto y el regreso de las ninfas al agua se cierra la Égloga III: la última obra que se conserva de Garcilaso termina, significativamente, sin resolver ni la dicha de Tirreno ni la pena de Alcino, dejando ambas en suspenso, una junto a la otra.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragPastores.id,
        type: "figura",
        category: "sonoro",
        ...anchor(pastoresText, "süave"),
        order: 1,
        content: `**Diéresis métrica**: la crema sobre la «u» (süave) indica que las vocales «u» y «a», que normalmente formarían un diptongo, deben pronunciarse en sílabas distintas para completar las once sílabas del endecasílabo.`,
      },
      {
        fragmentId: fragPastores.id,
        type: "figura",
        category: "tropo",
        ...anchor(pastoresText, "Cual suele, acompañada de su bando,\naparecer la dulce primavera"),
        order: 2,
        content: `**Símil correlativo**: Tirreno compara la llegada de su amada Flérida con la llegada de la primavera —ambas traen consigo color y alegría—, estructurando la octava entera («Cual suele... / ... en tal manera...») como una comparación extendida.`,
      },
      {
        fragmentId: fragPastores.id,
        type: "figura",
        category: "tropo",
        ...anchor(pastoresText, "Pequeña es esta furia, comparada\na la de Filis, con Alcino airada"),
        order: 3,
        content: `**Hipérbole**: Alcino describe primero una tormenta capaz de arrasar bosques y desafiar al mar, solo para concluir que esa furia es «pequeña» comparada con el enfado de Filis, exagerando por contraste la magnitud de su desdicha amorosa.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragPastores.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿En qué se diferencian el canto de Tirreno y el de Alcino?`,
      },
      {
        fragmentId: fragPastores.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `¿Cómo se relaciona este canto final —un amor feliz junto a uno desdichado— con los tapices que las ninfas acaban de tejer?`,
      },
      {
        fragmentId: fragPastores.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `La égloga termina sin resolver ni la alegría de Tirreno ni la pena de Alcino: las ninfas simplemente regresan al agua. ¿Qué efecto te produce este final abierto?`,
      },

      // Intertextualidad
      {
        fragmentId: fragPastores.id,
        type: "intertextualidad",
        ...anchor(pastoresText, "juntas se arrojan por el agua a nado"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragTajo.id,
        content: `La égloga se cierra como se abrió: si al principio una ninfa sacaba la cabeza del agua para contemplar el lugar, ahora las cuatro se arrojan de nuevo a ella, devolviendo el paisaje a su quietud inicial tras el desfile de amores y muertes que han tejido y cantado.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Jarchas mozárabes
  // ---------------------------------------------------------------------
  console.log("Creando autor y obra de las jarchas mozárabes...");

  const anonimoJarchas = await prisma.author.create({
    data: {
      slug: "anonimo-jarchas-mozarabes",
      name: "Anónimo (jarchas mozárabes)",
      country: "Al-Ándalus",
      era: "Al-Ándalus",
      bio: `Las jarchas son las composiciones líricas más antiguas conservadas en una lengua romance de la península ibérica. Escritas en mozárabe —el romance que hablaban cristianos, judíos y musulmanes de Al-Ándalus— y a menudo entreveradas de palabras árabes, cerraban a modo de remate (jarcha significa «salida») los poemas cultos en árabe o hebreo llamados moaxajas. Su autoría es anónima: recogían, probablemente, fragmentos de canciones populares de tradición oral que poetas cultos como Yosef al-Katib o Yehuda ha-Leví incorporaban a sus composiciones. Datadas entre los siglos XI y XII, son anteriores a la lírica de los trovadores occitanos y constituyen el testimonio más temprano de poesía amorosa en una lengua hispánica.`,
      portraitUrl: "/images/authors/anonimo-jarchas-mozarabes.jpg",
    },
  });

  const jarchas = await prisma.work.create({
    data: {
      slug: "jarchas-mozarabes",
      title: "Jarchas mozárabes",
      year: 1050,
      era: "Al-Ándalus",
      genre: "Poesía lírica (jarcha)",
      synopsis: `Selección de jarchas —breves estribillos en lengua romance mozárabe— rescatadas de moaxajas árabes y hebreas de los siglos XI y XII. Puestas casi siempre en boca de una voz femenina, hablan del amor como ausencia, espera y enfermedad, y confían su pena a una madre, unas hermanas o el propio amado. Son el testimonio más antiguo de lírica amorosa conservado en una lengua romance peninsular.`,
      authorId: anonimoJarchas.id,
    },
  });

  console.log("Creando fragmentos de las jarchas...");

  const jarchaCorazonText = `Vaise meu corachón de mib.
¿Ya Rab, si se me tornarad?
¡Tan mal me dóled li-l-habib!
Enfermo yed, ¿cuánd sanarad?

Mio sidi Ibrahim,
ya nuemne dolche,
vente mib
de nohte.
In non, si non queris,
yireym a tib,
gar-me a ob
legarte.`;

  const fragJarchaCorazon = await prisma.fragment.create({
    data: {
      slug: "jarcha-vaise-meu-corachon",
      title: "Vaise meu corachón de mib",
      location: "Jarchas, selección I",
      headline: "El corazón se va antes que tú",
      text: jarchaCorazonText,
      order: 1,
      status: "published",
      featured: false,
      workId: jarchas.id,
      constellations: { connect: [{ slug: "amor" }] },
      artworkImageUrl:
        "/images/artworks/fortuny-patio-en-granada.jpg",
      artworkTitle: "Patio en Granada",
      artworkAuthor: "Marià Fortuny, 1872",
      artworkCaption:
        "Un patio andalusí bañado de sol y silencio: el mismo espacio íntimo y cotidiano, ajeno a las cortes y a sus poetas en árabe o hebreo, desde el que parece hablar esta jarcha escrita en la lengua romance que se oía en las casas de Al-Ándalus.",
    },
  });

  const jarchaHermanasText = `Garid vos, ay yermanelas,
¿com contenir-é mio mal?
Sin el-habib non vivreyo:
¿ad ob l'irey demandar?

Tant' amare, tant' amare,
habib, tant' amare,
enfermeron olios gaios,
e dolen tan male.`;

  const fragJarchaHermanas = await prisma.fragment.create({
    data: {
      slug: "jarcha-garid-vos",
      title: "Garid vos, ay yermanelas",
      location: "Jarchas, selección II",
      headline: "Mil años de mal de amores",
      text: jarchaHermanasText,
      order: 2,
      status: "published",
      featured: false,
      workId: jarchas.id,
      constellations: { connect: [{ slug: "amor" }] },
      artworkImageUrl:
        "/images/artworks/cantigas-de-santa-maria.jpg",
      artworkTitle: "Cantigas de Santa María (Códice de los músicos), f. 201v",
      artworkAuthor: "Taller real de Alfonso X el Sabio, h. 1280",
      artworkCaption:
        "Las jarchas no se leían: se cantaban, como remate musical de la moaxaja. Esta página de las Cantigas de Santa María, con músicos tocando instrumentos de raíz andalusí, evoca la dimensión sonora y compartida que tuvo originalmente esta poesía.",
    },
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Vaise meu corachón de mib
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Vaise meu corachón de mib»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragJarchaCorazon.id,
        type: "glosa",
        ...anchor(jarchaCorazonText, "corachón"),
        order: 1,
        content: `Forma mozárabe de «corazón» (del latín *cor, cordis*), con el sufijo romance *-ón*. Esta grafía muestra la evolución del romance hispánico varios siglos antes de que el castellano se fijara como lengua escrita.`,
      },
      {
        fragmentId: fragJarchaCorazon.id,
        type: "glosa",
        ...anchor(jarchaCorazonText, "Ya Rab"),
        order: 2,
        content: `Del árabe *yā Rabb*, «¡oh, Señor!» (invocación a Dios). En el mismo verso se mezclan esta interjección árabe y morfología verbal romance (*tornarad*, «volverá»): un testimonio directo del bilingüismo de Al-Ándalus.`,
      },
      {
        fragmentId: fragJarchaCorazon.id,
        type: "glosa",
        ...anchor(jarchaCorazonText, "li-l-habib"),
        order: 3,
        content: `Del árabe *al-habib*, «el amado», con la preposición árabe *li-* («para»). *Al-habib* es la palabra clave de casi todas las jarchas: nombra siempre al amado ausente o indiferente.`,
      },
      {
        fragmentId: fragJarchaCorazon.id,
        type: "glosa",
        ...anchor(jarchaCorazonText, "sidi"),
        order: 4,
        content: `Del árabe *sayyidī*, «mi señor». Es la misma raíz de la que deriva el título «Cid» con el que se conoce a Rodrigo Díaz de Vivar.`,
      },
      {
        fragmentId: fragJarchaCorazon.id,
        type: "glosa",
        ...anchor(jarchaCorazonText, "nuemne dolche"),
        order: 5,
        content: `«Nombre dulce»: *nuemne* (del latín *nomine*) y *dolche* (del latín *dulce*), con la palatalización típica del romance mozárabe.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragJarchaCorazon.id,
        type: "contexto",
        ...anchor(jarchaCorazonText, "Vaise meu corachón de mib"),
        order: 1,
        content: `Las jarchas son las estrofas finales —en mozárabe, a veces con palabras árabes— de poemas cultos en árabe o hebreo llamados moaxajas (ss. XI-XII). Suelen poner en boca de una voz femenina, o dirigida a un amado varón como aquí, el lamento por una ausencia. Son el testimonio más antiguo de lírica amorosa en una lengua romance peninsular, anterior a los trovadores occitanos.`,
      },
      {
        fragmentId: fragJarchaCorazon.id,
        type: "contexto",
        ...anchor(jarchaCorazonText, "Mio sidi Ibrahim"),
        order: 2,
        content: `Esta jarcha cierra una moaxaja escrita en hebreo. El nombre «Ibrahim» (Abraham) ha llevado a algunos estudiosos a buscarle una identidad histórica, aunque la crítica actual prefiere leerla como una llamada amorosa de raíz popular, reutilizada por el poeta culto.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragJarchaCorazon.id,
        type: "figura",
        category: "sonoro",
        ...anchor(jarchaCorazonText, "¿Ya Rab, si se me tornarad?"),
        order: 1,
        content: `**Alternancia de lenguas**: en un mismo verso se combinan una interjección árabe (*Ya Rab*) y morfología verbal romance (*tornarad*). Este vaivén entre lenguas, natural en la sociedad multilingüe de Al-Ándalus, es uno de los rasgos más estudiados de las jarchas.`,
      },
      {
        fragmentId: fragJarchaCorazon.id,
        type: "figura",
        category: "tropo",
        ...anchor(jarchaCorazonText, "Vaise meu corachón de mib"),
        order: 2,
        content: `**Personificación**: el corazón se separa del cuerpo y «se va» por su cuenta, como si tuviera voluntad propia. Esta imagen del corazón que parte o que queda en otra parte reaparecerá, mil años después, en toda la lírica amorosa española.`,
      },
      {
        fragmentId: fragJarchaCorazon.id,
        type: "figura",
        category: "topos",
        ...anchor(jarchaCorazonText, "Enfermo yed, ¿cuánd sanarad?"),
        order: 3,
        content: `**Amor como enfermedad**: el amante «enferma» de amor y pregunta cuándo «sanará». Es uno de los tópicos más persistentes de la poesía amorosa, desde estas jarchas hasta el «mal de amores» de la canción popular actual.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragJarchaCorazon.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Qué le pide la voz poética a «Ya Rab» en la primera jarcha, y qué le pide al «sidi Ibrahim» en la segunda?`,
      },
      {
        fragmentId: fragJarchaCorazon.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `Estas jarchas fueron escritas —o reescritas— por poetas que sabían árabe y hebreo, pero las pusieron en la lengua romance que hablaba la gente común de Al-Ándalus. ¿Qué nos dice esto sobre las relaciones entre las comunidades árabe, hebrea y cristiana de la época?`,
      },
      {
        fragmentId: fragJarchaCorazon.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `Estas dos jarchas tienen casi mil años y están escritas en una lengua que ya no se habla. Aun así, ¿te resulta reconocible la emoción que expresan? ¿Qué crees que explica que un sentimiento como este viaje tan bien a través del tiempo?`,
      },

      // Intertextualidad
      {
        fragmentId: fragJarchaCorazon.id,
        type: "intertextualidad",
        ...anchor(jarchaCorazonText, "sidi"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragCid.id,
        content: `El título «Cid» con el que se conoce a Rodrigo Díaz de Vivar viene de esta misma palabra árabe, *sidi* / *sayyid* («mi señor»), con la que aquí se llama al amado. Un mismo préstamo del árabe nombra, en dos textos muy distintos, a un héroe épico y a un amante.`,
      },
      {
        fragmentId: fragJarchaCorazon.id,
        type: "intertextualidad",
        ...anchor(jarchaCorazonText, "yireym a tib"),
        order: 2,
        linkType: "external",
        externalCitation: `S. M. Stern, «Les vers finaux en espagnol dans les muwashshahs hispano-hébraïques», Al-Andalus, 13 (1948).`,
        content: `El arabista Samuel M. Stern publicó en 1948 las primeras jarchas con su transcripción romance, un hallazgo que obligó a reescribir la historia de los orígenes de la lírica peninsular: estos versos son anteriores a las primeras canciones conservadas de los trovadores occitanos (siglo XII).`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Garid vos, ay yermanelas
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Garid vos, ay yermanelas»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragJarchaHermanas.id,
        type: "glosa",
        ...anchor(jarchaHermanasText, "yermanelas"),
        order: 1,
        content: `Diminutivo afectivo de «hermanas» (mozárabe *germanas* + sufijo *-elas*). Las hermanas o amigas confidentes son una figura habitual en la lírica popular de tema amoroso, presente también en las cantigas de amigo gallego-portuguesas.`,
      },
      {
        fragmentId: fragJarchaHermanas.id,
        type: "glosa",
        ...anchor(jarchaHermanasText, "el-habib"),
        order: 2,
        content: `«El amado», del árabe *al-habib*. La fórmula «sin el-habib non vivreyo» («sin el amado no viviré») expresa de forma directa la dependencia total de la voz poética respecto del amado ausente.`,
      },
      {
        fragmentId: fragJarchaHermanas.id,
        type: "glosa",
        ...anchor(jarchaHermanasText, "Tant' amare"),
        order: 3,
        content: `«De tanto amar» (mozárabe *tant'* < latín *tantum*; *amare* < latín *amare*, usado aquí casi como un sustantivo). La repetición intensifica la idea de un amor desmedido.`,
      },
      {
        fragmentId: fragJarchaHermanas.id,
        type: "glosa",
        ...anchor(jarchaHermanasText, "olios gaios"),
        order: 4,
        content: `«Ojos alegres»: *olios* (del latín *oculos*) y *gaios* (del latín *gaudium*, «alegría»; cf. el provenzal *gai*). Unos ojos antes alegres que ahora «enferman» de amor.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragJarchaHermanas.id,
        type: "contexto",
        ...anchor(jarchaHermanasText, "Garid vos, ay yermanelas"),
        order: 1,
        content: `La confidencia a unas hermanas, amigas o a la madre es una de las estructuras más repetidas en las jarchas: la voz femenina rara vez se dirige al amado directamente, sino a un círculo de mujeres cercanas que escuchan su pena. Esta misma estructura reaparecerá en la cantiga de amigo gallego-portuguesa de los siglos XIII-XIV.`,
      },
      {
        fragmentId: fragJarchaHermanas.id,
        type: "contexto",
        ...anchor(jarchaHermanasText, "Tant' amare, tant' amare"),
        order: 2,
        content: `Esta es una de las jarchas más citadas por la crítica: su brevedad y su musicalidad, casi de estribillo popular, la convirtieron en el ejemplo más repetido para ilustrar el descubrimiento de la lírica mozárabe en el siglo XX.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragJarchaHermanas.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(jarchaHermanasText, "Tant' amare, tant' amare"),
        order: 1,
        content: `**Repetición / anáfora**: «tant' amare» se repite tres veces en dos versos. La insistencia convierte la causa —amar demasiado— en una letanía, y prepara el giro hacia la consecuencia: los ojos que enferman.`,
      },
      {
        fragmentId: fragJarchaHermanas.id,
        type: "figura",
        category: "topos",
        ...anchor(jarchaHermanasText, "enfermeron olios gaios"),
        order: 2,
        content: `**Amor como enfermedad**, de nuevo: aquí la enfermedad de amor se concreta en el cuerpo —los ojos, antes alegres, ahora enfermos y doloridos— en lugar de quedar en una idea abstracta.`,
      },
      {
        fragmentId: fragJarchaHermanas.id,
        type: "figura",
        category: "sonoro",
        ...anchor(jarchaHermanasText, "ay yermanelas"),
        order: 3,
        content: `**Interjección y diminutivo afectivos** («ay», «-elas»): crean un tono cantado, casi de nana o estribillo, coherente con el origen musical de estas piezas, pensadas para cerrar cantando la moaxaja.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragJarchaHermanas.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿A quién pide ayuda la voz poética en la primera jarcha, y qué les ha pasado a sus ojos en la segunda?`,
      },
      {
        fragmentId: fragJarchaHermanas.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `En ambas jarchas el amor se describe con vocabulario de enfermedad («mal», «enfermeron», «dolen»). ¿Qué efecto produce hablar del amor en estos términos, en lugar de, por ejemplo, en términos de felicidad?`,
      },
      {
        fragmentId: fragJarchaHermanas.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `Pedir consejo a las amigas sobre un problema de amor sigue siendo hoy algo muy habitual. ¿Crees que esta jarcha, con mil años de antigüedad, podría funcionar como la letra de una canción actual? Justifica tu respuesta.`,
      },

      // Intertextualidad
      {
        fragmentId: fragJarchaHermanas.id,
        type: "intertextualidad",
        ...anchor(jarchaHermanasText, "Sin el-habib non vivreyo"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragJarchaCorazon.id,
        content: `Como «Vaise meu corachón de mib», esta jarcha gira en torno a *al-habib* (el amado) y al amor entendido como una falta o una enfermedad. Ambas comparten el vocabulario y los tópicos básicos del género, aunque procedan de moaxajas distintas.`,
      },
      {
        fragmentId: fragJarchaHermanas.id,
        type: "intertextualidad",
        ...anchor(jarchaHermanasText, "Tant' amare, tant' amare"),
        order: 2,
        linkType: "external",
        externalCitation: `Cantigas de amigo (tradición gallego-portuguesa, ss. XIII-XIV); p. ej. Martín Códax, «Ondas do mar de Vigo».`,
        content: `La confidencia femenina a un grupo de amigas o hermanas, y el lamento por un amor doloroso, son también el núcleo de la cantiga de amigo gallego-portuguesa. Las jarchas mozárabes son, probablemente, un antecedente de este tipo de poesía en otra lengua romance peninsular.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Itinerario «Nombrar el amor»: autores, obras y fragmentos nuevos
  // ---------------------------------------------------------------------
  console.log("Creando autores, obras y fragmentos de «Nombrar el amor»...");

  const martinCodax = await prisma.author.create({
    data: {
      slug: "martin-codax",
      name: "Martín Codax",
      country: "España",
      era: "Edad Media",
      bio: `Trovador (xograr) gallego de la primera mitad del siglo XIII, del que apenas se conoce más que el nombre. Sus siete cantigas de amigo se conservan casi en su totalidad en el Pergamiño Vindel, un rollo de pergamino descubierto en 1914 que incluye, además del texto, la notación musical original de seis de ellas: un caso excepcional en la lírica medieval peninsular, que normalmente perdió su música.`,
      portraitUrl: "/images/authors/martin-codax.png",
    },
  });

  const cantigasCodax = await prisma.work.create({
    data: {
      slug: "cantigas-de-amigo-codax",
      title: "Cantigas de amigo",
      year: 1240,
      era: "Edad Media",
      genre: "Poesía lírica (cantiga de amigo)",
      synopsis: `Conjunto de siete cantigas de amigo —el género gallego-portugués en que una voz femenina lamenta la ausencia de su amado— centradas en la ría de Vigo, hacia la que la protagonista dirige sus preguntas sobre el regreso de su amigo por mar. Conservadas en el Pergamiño Vindel junto con su música original, son uno de los testimonios más valiosos de la lírica medieval en lengua romance.`,
      authorId: martinCodax.id,
    },
  });

  const ondasText = `Ondas do mar de Vigo,
se vistes meu amigo?
E ai Deus, se verrá cedo?

Ondas do mar levado,
se vistes meu amado?
E ai Deus, se verrá cedo?

Se vistes meu amigo,
o por que eu sospiro?
E ai Deus, se verrá cedo?

Se vistes meu amado,
por que ei gran cuidado?
E ai Deus, se verrá cedo?`;

  const fragOndas = await prisma.fragment.create({
    data: {
      slug: "ondas-do-mar-de-vigo",
      title: "Ondas do mar de Vigo",
      location: "Pergamiño Vindel, cantiga I",
      headline: "Todo lo que sabe el mar de Vigo",
      text: ondasText,
      order: 1,
      status: "published",
      featured: false,
      workId: cantigasCodax.id,
      constellations: { connect: [{ slug: "amor" }] },
      places: { connect: [{ slug: "vigo" }] },
      artworkImageUrl:
        "/images/artworks/ria-de-vigo.jpg",
      artworkTitle: "Galicia (Ría de Vigo)",
      artworkAuthor: "Joaquín Sorolla, h. 1899-1900",
      artworkCaption:
        "Sorolla pintó esta ría gallega seis siglos después de que Martín Codax compusiera sus cantigas, pero el paisaje —el mar abierto, la luz, el horizonte— es el mismo al que esta voz femenina dirige, una y otra vez, sus preguntas sobre el regreso de su amigo.",
    },
  });

  const jorgeManrique = await prisma.author.create({
    data: {
      slug: "jorge-manrique",
      name: "Jorge Manrique",
      birthYear: 1440,
      deathYear: 1479,
      country: "España",
      era: "Edad Media",
      bio: `Poeta y caballero castellano, sobrino del también poeta Gómez Manrique, perteneciente a una familia muy implicada en las luchas políticas del reinado de Enrique IV y en la sucesión de los Reyes Católicos. Murió en 1479, en combate, defendiendo los derechos al trono de Isabel la Católica. Su fama descansa casi por completo en una sola obra, escrita a la muerte de su padre, don Rodrigo Manrique, maestre de la Orden de Santiago, en 1476.`,
      portraitUrl: "/images/authors/jorge-manrique.jpg",
    },
  });

  const coplas = await prisma.work.create({
    data: {
      slug: "coplas-a-la-muerte-de-su-padre",
      title: "Coplas a la muerte de su padre",
      year: 1476,
      era: "Edad Media",
      genre: "Elegía (copla de pie quebrado)",
      synopsis: `Elegía de cuarenta coplas de pie quebrado compuesta a la muerte de don Rodrigo Manrique. Parte de una reflexión general sobre la fugacidad de la vida y la igualdad de todos los hombres ante la muerte —los tópicos del *ubi sunt* y el *tempus fugit*— para llegar, en su tramo final, al elogio de don Rodrigo y al relato de una muerte ejemplar, serena y cristiana.`,
      authorId: jorgeManrique.id,
    },
  });

  const coplasText = `Nuestras vidas son los ríos
que van a dar en la mar,
que es el morir;
allí van los señoríos
derechos a se acabar
e consumir;
allí los ríos caudales,
allí los otros medianos
e más chicos,
allegados, son iguales
los que viven por sus manos
e los ricos`;

  const fragCoplas = await prisma.fragment.create({
    data: {
      slug: "nuestras-vidas-son-los-rios",
      title: "Coplas a la muerte de su padre",
      location: "Coplas, estrofa III",
      headline: "Todos los ríos van al mismo mar",
      text: coplasText,
      order: 2,
      status: "published",
      featured: false,
      workId: coplas.id,
      constellations: { connect: [{ slug: "muerte" }, { slug: "paso-del-tiempo" }] },
      topics: { connect: [{ slug: "ubi-sunt" }, { slug: "tempus-fugit" }] },
      artworkImageUrl:
        "/images/artworks/el-greco-vista-de-toledo.jpg",
      artworkTitle: "Vista de Toledo",
      artworkAuthor: "El Greco, h. 1596-1600",
      artworkCaption:
        "El Greco pintó este paisaje castellano más de un siglo después de las Coplas, pero el río que lo recorre —como todos los ríos— sigue yendo a dar en la mar: la misma imagen con la que Manrique iguala, ante la muerte, a los señoríos poderosos y a los más humildes.",
    },
  });

  const coplaIText = `Recuerde el alma dormida,
avive el seso y despierte,
contemplando
cómo se pasa la vida,
cómo se viene la muerte
tan callando;
cuán presto se va el placer,
cómo después, de acordado,
da dolor;
cómo, a nuestro parescer,
cualquiera tiempo pasado
fue mejor.`;

  const fragCoplaI = await prisma.fragment.create({
    data: {
      slug: "la-fugacidad-de-la-vida",
      title: "La fugacidad de la vida",
      location: "Coplas, estrofa I",
      headline: "Recuerde el alma dormida",
      text: coplaIText,
      order: 1,
      status: "published",
      featured: false,
      workId: coplas.id,
      constellations: { connect: [{ slug: "muerte" }, { slug: "paso-del-tiempo" }] },
      topics: { connect: [{ slug: "tempus-fugit" }] },
      artworkImageUrl: "/images/artworks/claesz-vanitas.jpg",
      artworkTitle: "Vanitas",
      artworkAuthor: "Pieter Claesz, 1630",
      artworkCaption:
        "El cráneo, el reloj de arena y la vela a punto de apagarse que protagonizan este cuadro son los emblemas visuales exactos del «memento mori» con el que arrancan las Coplas: la llamada a un alma «dormida» que necesita despertar para darse cuenta de algo que tiene delante todo el tiempo —que la vida se acaba— y que, sin embargo, no ve.",
    },
  });

  const anoranzaText = `¿Qué se hizo el rey don Juan?
Los Infantes de Aragón,
¿qué se hicieron?
¿Qué fue de tanto galán?
¿Qué fue de tanta invención
como trujieron?
Las justas y los torneos,
paramentos, bordaduras
y cimeras,
¿fueron sino devaneos?,
¿qué fueron sino verduras
de las eras?

¿Qué se hicieron las damas,
sus tocados, sus vestidos,
sus olores?
¿Qué se hicieron las llamas
de los fuegos encendidos
de amadores?
¿Qué se hizo aquel trovar,
las músicas acordadas
que tañían?
¿Qué se hizo aquel danzar,
aquellas ropas chapadas
que traían?`;

  const fragAnoranza = await prisma.fragment.create({
    data: {
      slug: "anoranza-de-los-tiempos-pasados",
      title: "Añoranza de los tiempos pasados",
      location: "Coplas, estrofas XVI-XVII",
      headline: "¿Qué se hizo el rey don Juan?",
      text: anoranzaText,
      order: 3,
      status: "published",
      featured: false,
      workId: coplas.id,
      constellations: { connect: [{ slug: "muerte" }, { slug: "paso-del-tiempo" }] },
      topics: { connect: [{ slug: "ubi-sunt" }, { slug: "tempus-fugit" }] },
      artworkImageUrl: "/images/artworks/bosco-jardin-de-las-delicias.jpg",
      artworkTitle: "El jardín de las delicias (panel central)",
      artworkAuthor: "El Bosco, h. 1490-1510",
      artworkCaption:
        "El desfile de placeres mundanos que Manrique evoca para mostrar su vanidad —las músicas, los amores, los lujos de la corte— tiene su equivalente más inquietante en este paraíso de goces efímeros que el Bosco pintó en torno a las mismas fechas, con la misma conciencia de que todo ese esplendor conduce inevitablemente al panel derecho del tríptico: el infierno.",
    },
  });

  // ---------------------------------------------------------------------
  // Anotaciones — La fugacidad de la vida
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «La fugacidad de la vida»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragCoplaI.id,
        type: "glosa",
        ...anchor(coplaIText, "Recuerde el alma dormida"),
        order: 1,
        content: `«Recuerde»: del verbo «recordar» en su sentido antiguo de «despertar, volver en sí» —no «traer algo a la memoria», como hoy—. El verso no pide al alma que recuerde algo en concreto, sino que despierte de un sueño en el que ha perdido la noción del tiempo.`,
      },
      {
        fragmentId: fragCoplaI.id,
        type: "glosa",
        ...anchor(coplaIText, "avive el seso y despierte"),
        order: 2,
        content: `«Seso»: sentido, entendimiento, juicio. «Avivar el seso» es agudizar la capacidad de comprender algo que, en realidad, ya debería resultar evidente: que la vida se pasa y la muerte se acerca «tan callando».`,
      },
      {
        fragmentId: fragCoplaI.id,
        type: "glosa",
        ...anchor(coplaIText, "cómo después, de acordado"),
        order: 3,
        content: `«De acordado»: al recordarlo, al pensar de nuevo en ello después de haber pasado. Mientras dura, el placer parece no tener fin; recordado «después», duele precisamente por su brevedad y por lo que ya no se puede recuperar.`,
      },
      {
        fragmentId: fragCoplaI.id,
        type: "glosa",
        ...anchor(coplaIText, "cómo, a nuestro parescer"),
        order: 4,
        content: `«Parescer»: forma antigua de «parecer». La precisión no es casual: lo que sigue —«cualquier tiempo pasado fue mejor»— se presenta explícitamente como una impresión subjetiva («a nuestro parecer»), no como un hecho objetivo.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragCoplaI.id,
        type: "contexto",
        ...anchor(coplaIText, "Recuerde el alma dormida,\navive el seso y despierte"),
        order: 1,
        content: `Las Coplas no se abren con el lamento personal por la muerte de don Rodrigo Manrique —que llegará mucho después, hacia el final del poema—, sino con una exhortación general dirigida a cualquier lector: antes de hablar de su padre, Jorge Manrique quiere que todos «despertemos» a una verdad que afecta a todo el mundo por igual.`,
      },
      {
        fragmentId: fragCoplaI.id,
        type: "contexto",
        ...anchor(coplaIText, "cuán presto se va el placer"),
        order: 2,
        content: `Esta estrofa inaugura los dos grandes tópicos que dominan la primera parte del poema: la fugacidad del tiempo (tempus fugit), presente ya aquí, y la pregunta por lo desaparecido (ubi sunt), que unas estrofas más adelante se concretará en personajes y lujos de la corte.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragCoplaI.id,
        type: "figura",
        category: "sonoro",
        ...anchor(coplaIText, "contemplando"),
        order: 1,
        content: `**Pie quebrado**: frente a los versos octosílabos que dominan la estrofa, este verso de cuatro sílabas —y los demás «pies quebrados» del poema— interrumpen brevemente el ritmo, como una pausa para la reflexión. Esta combinación de octosílabos y tetrasílabos en grupos de seis versos es la llamada «estrofa manriqueña» o «copla de pie quebrado», tan célebre que terminó dando nombre a esta forma métrica.`,
      },
      {
        fragmentId: fragCoplaI.id,
        type: "figura",
        category: "tropo",
        ...anchor(coplaIText, "Recuerde el alma dormida"),
        order: 2,
        content: `**Personificación**: el alma «duerme» y puede «despertar», como si fuera un cuerpo. La imagen del sueño para describir la falta de conciencia ante la propia mortalidad tendrá una larga vida en la literatura española —piénsese en «la vida es sueño»—.`,
      },
      {
        fragmentId: fragCoplaI.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(coplaIText, "cómo se pasa la vida,\ncómo se viene la muerte"),
        order: 3,
        content: `**Anáfora**: la repetición de «cómo» al principio de varios versos —cuatro veces en esta sola estrofa— convierte la reflexión en una letanía, casi una oración, apropiada para una meditación que se presenta como universal y no como un lamento privado.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragCoplaI.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `Según esta estrofa, ¿en qué se diferencia el placer mientras se está viviendo y el mismo placer recordado después?`,
      },
      {
        fragmentId: fragCoplaI.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `¿Por qué crees que Manrique elige empezar su elegía con una reflexión general sobre la vida y la muerte, en lugar de hablar directamente de su padre?`,
      },
      {
        fragmentId: fragCoplaI.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `«Cualquier tiempo pasado fue mejor» se ha convertido en una frase proverbial. ¿Te parece que describe una verdad sobre el pasado, o más bien algo sobre cómo funciona nuestra memoria? Razona tu respuesta.`,
      },

      // Intertextualidad
      {
        fragmentId: fragCoplaI.id,
        type: "intertextualidad",
        ...anchor(coplaIText, "cómo se viene la muerte\ntan callando"),
        order: 1,
        linkType: "external",
        externalCitation: `Salmo 90 (89), 4-6: «Mil años, para ti, son como el día de ayer, que ya pasó [...] Por la mañana florece [el hombre] como la hierba; al atardecer se marchita y se seca».`,
        content: `La imagen de una muerte que llega «callando», sin avisar, mientras la vida se consume sin que nos demos cuenta, tiene un antecedente muy directo en este salmo bíblico, una de las fuentes más influyentes de la meditación medieval sobre la fugacidad del tiempo.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Añoranza de los tiempos pasados
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Añoranza de los tiempos pasados»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragAnoranza.id,
        type: "glosa",
        ...anchor(anoranzaText, "como trujieron"),
        order: 1,
        content: `«Trujieron»: forma antigua de «trajeron». Manrique no se pregunta solo qué pasó con las personas —el rey, los infantes, los galanes—, sino con todo lo que «trajeron» consigo: sus invenciones, su lujo, su ingenio.`,
      },
      {
        fragmentId: fragAnoranza.id,
        type: "glosa",
        ...anchor(anoranzaText, "paramentos, bordaduras\ny cimeras"),
        order: 2,
        content: `«Paramentos» (adornos de los caballos) y «cimeras» (adornos de plumas en los yelmos), junto con las «bordaduras», forman el vocabulario del torneo caballeresco: un espectáculo tan visual y vistoso como efímero, de ahí que dos versos más abajo se compare con «verduras de las eras».`,
      },
      {
        fragmentId: fragAnoranza.id,
        type: "glosa",
        ...anchor(anoranzaText, "aquellas ropas chapadas"),
        order: 3,
        content: `«Chapadas»: bordadas de oro y plata. Cierra la enumeración de lujos —tocados, olores, músicas, danzas— con la imagen más material y brillante de todas: telas literalmente cubiertas de metales preciosos que tampoco sobrevivieron al paso del tiempo.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragAnoranza.id,
        type: "contexto",
        ...anchor(anoranzaText, "¿Qué se hizo el rey don Juan?\nLos Infantes de Aragón"),
        order: 1,
        content: `El «rey don Juan» es Juan II de Castilla (1405-1454), padre de Enrique IV e Isabel la Católica; los «Infantes de Aragón» son don Enrique y don Juan, hijos de Fernando de Antequera, protagonistas de décadas de luchas por el poder en la corte castellana. Para los primeros lectores de Manrique no eran figuras lejanas, sino personajes de la generación de sus padres: el «ubi sunt» se vuelve, de repente, muy concreto.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragAnoranza.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(anoranzaText, "¿Qué se hizo el rey don Juan?"),
        order: 1,
        content: `**Anáfora interrogativa**: «¿Qué se hizo...?», «¿Qué fue de...?», «¿Qué se hicieron...?» se repiten, con variaciones, al principio de casi todos los versos impares de las dos estrofas. La acumulación de preguntas —que el poema nunca responde— es lo que produce el efecto de vacío: todo lo nombrado ha desaparecido sin dejar rastro.`,
      },
      {
        fragmentId: fragAnoranza.id,
        type: "figura",
        category: "tropo",
        ...anchor(anoranzaText, "qué fueron sino verduras\nde las eras"),
        order: 2,
        content: `**Metáfora vegetal**: las justas, los torneos, todo el esplendor de la corte, no fueron «sino verduras de las eras» —la hierba que crece en los campos de cultivo, verde un día y seca al siguiente—. La imagen reduce el lujo cortesano a algo tan común y tan perecedero como la hierba.`,
      },
      {
        fragmentId: fragAnoranza.id,
        type: "figura",
        category: "topos",
        ...anchor(anoranzaText, "¿Qué se hicieron las damas"),
        order: 3,
        content: `**Ubi sunt** («¿dónde están?»): el tópico que da nombre a estas estrofas consiste en preguntar retóricamente por personas, glorias o bienes desaparecidos. De origen bíblico y muy extendido en la poesía latina medieval, alcanza en estas dos coplas su formulación más célebre en lengua castellana.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragAnoranza.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `Haz una lista de todo lo que Manrique menciona en estas dos estrofas y que ya ha desaparecido. ¿Qué tienen en común todos estos elementos?`,
      },
      {
        fragmentId: fragAnoranza.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `Estas estrofas no mencionan a don Rodrigo Manrique, el padre del poeta, ni hablan todavía de su muerte. ¿Qué función cumplen entonces dentro de la elegía?`,
      },
      {
        fragmentId: fragAnoranza.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `Piensa en alguna moda, espectáculo o forma de diversión que fuera muy popular hace una generación y que hoy haya desaparecido casi por completo. ¿Qué sentirías si tuvieras que escribir sobre ella unos versos al estilo de Manrique?`,
      },

      // Intertextualidad
      {
        fragmentId: fragAnoranza.id,
        type: "intertextualidad",
        ...anchor(anoranzaText, "¿Qué se hicieron las damas,\nsus tocados, sus vestidos,\nsus olores?"),
        order: 1,
        linkType: "external",
        externalCitation: `François Villon, Ballade des dames du temps jadis («Balada de las damas de antaño», h. 1461): «Mais où sont les neiges d'antan?» («¿Pero dónde están las nieves de antaño?»), estribillo que cierra cada estrofa preguntando por mujeres célebres del pasado.`,
        content: `Apenas unos años antes que Manrique, el poeta francés François Villon recurre a la misma fórmula —una enumeración de figuras del pasado seguida de la pregunta «¿dónde están?»— para llegar a una conclusión idéntica: nada de lo que fue espléndido permanece, ni siquiera el recuerdo exacto de su esplendor.`,
      },
    ],
  });

  const santaTeresa = await prisma.author.create({
    data: {
      slug: "santa-teresa-de-jesus",
      name: "Santa Teresa de Jesús",
      birthYear: 1515,
      deathYear: 1582,
      country: "España",
      era: "Renacimiento",
      bio: `Teresa de Cepeda y Ahumada, nacida en Ávila en 1515, ingresó en el convento carmelita de la Encarnación de su ciudad en 1535. A partir de 1562 emprendió, junto a San Juan de la Cruz, la reforma de la orden —fundando numerosos conventos de la rama «descalza»— y escribió una extensa obra en prosa, autobiográfica y doctrinal, además de un conjunto más breve de poesías de tema místico. Murió en Alba de Tormes en 1582 y fue canonizada en 1622.`,
      portraitUrl: "/images/authors/santa-teresa-de-jesus.jpg",
    },
  });

  const poesiasTeresa = await prisma.work.create({
    data: {
      slug: "poesias-santa-teresa",
      title: "Poesías",
      year: 1571,
      era: "Renacimiento",
      genre: "Poesía mística (glosa)",
      synopsis: `Conjunto breve de poesías de tema religioso, escritas en su mayoría como glosas de versos o refranes preexistentes. «Vivo sin vivir en mí» glosa el estribillo popular «que muero porque no muero» y convierte el lenguaje del amor humano —vivir, morir, prisión, cautiverio— en expresión de la unión del alma con Dios.`,
      authorId: santaTeresa.id,
    },
  });

  const vivoSinVivirText = `Vivo sin vivir en mí,
y de tal manera espero,
que muero porque no muero.

Vivo ya fuera de mí,
después que muero de amor;
porque vivo en el Señor,
que me quiso para sí:
cuando el corazón le di
puso en él este letrero,
que muero porque no muero.

Esta divina prisión,
del amor con que yo vivo,
ha hecho a Dios mi cautivo,
y libre mi corazón;
y causa en mí tal pasión
ver a Dios mi prisionero,
que muero porque no muero.`;

  const fragVivoSinVivir = await prisma.fragment.create({
    data: {
      slug: "vivo-sin-vivir-en-mi",
      title: "Vivo sin vivir en mí",
      location: "Poesías, glosa sobre «que muero porque no muero»",
      headline: "Morir de no poder morir",
      text: vivoSinVivirText,
      order: 1,
      status: "published",
      featured: false,
      workId: poesiasTeresa.id,
      constellations: { connect: [{ slug: "amor" }, { slug: "muerte" }] },
      topics: { connect: [{ slug: "mistica" }] },
      places: { connect: [{ slug: "avila" }] },
      artworkImageUrl:
        "/images/artworks/teresa-de-jesus.jpg",
      artworkTitle: "Retrato de Santa Teresa de Jesús",
      artworkAuthor: "Fray Juan de la Miseria, 1576",
      artworkCaption:
        "Único retrato de Santa Teresa pintado en vida, por encargo y a su pesar —se dice que al verlo terminado exclamó que la habían pintado «fea y legañosa». Una imagen sin idealizar, bien distinta de la intensidad casi extática de sus versos.",
    },
  });

  const sanJuanDeLaCruz = await prisma.author.create({
    data: {
      slug: "san-juan-de-la-cruz",
      name: "San Juan de la Cruz",
      birthYear: 1542,
      deathYear: 1591,
      country: "España",
      era: "Renacimiento",
      bio: `Juan de Yepes Álvarez nació en 1542 en Fontiveros (Ávila), en una familia de tejedores empobrecida tras la muerte temprana del padre. Ingresó en la orden del Carmen en 1563 y, poco después, se unió a la reforma emprendida por Santa Teresa de Jesús. En 1577 fue encarcelado varios meses por los carmelitas no reformados en un convento de Toledo; allí, según la tradición, compuso buena parte de su poesía, incluida «Noche oscura». Murió en 1591 y fue canonizado en 1726.`,
      portraitUrl: "/images/authors/san-juan-de-la-cruz.jpg",
    },
  });

  const nocheOscuraWork = await prisma.work.create({
    data: {
      slug: "noche-oscura",
      title: "Noche oscura",
      year: 1578,
      era: "Renacimiento",
      genre: "Poesía mística (lira)",
      synopsis: `Poema breve en liras que describe, mediante la alegoría de una dama que sale de noche, en secreto, al encuentro de su amado, el camino del alma hacia la unión con Dios a través del despojamiento de los sentidos y del entendimiento: la «noche oscura». El propio autor escribió después un extenso comentario en prosa con el mismo título para explicar su sentido.`,
      authorId: sanJuanDeLaCruz.id,
    },
  });

  const nocheOscuraText = `En una noche oscura,
con ansias, en amores inflamada,
¡oh dichosa ventura!,
salí sin ser notada,
estando ya mi casa sosegada.

A oscuras y segura,
por la secreta escala disfrazada,
¡oh dichosa ventura!,
a oscuras y en celada,
estando ya mi casa sosegada.

En la noche dichosa,
en secreto, que nadie me veía,
ni yo miraba cosa,
sin otra luz ni guía
sino la que en el corazón ardía.

Aquesta me guiaba
más cierto que la luz del mediodía,
adonde me esperaba
quien yo bien me sabía,
en parte donde nadie aparecía.`;

  const fragNocheOscura = await prisma.fragment.create({
    data: {
      slug: "noche-oscura-del-alma",
      title: "Noche oscura",
      location: "Noche oscura, canciones 1-4",
      headline: "Una cita a oscuras con Dios",
      text: nocheOscuraText,
      order: 1,
      status: "published",
      featured: false,
      workId: nocheOscuraWork.id,
      constellations: { connect: [{ slug: "amor" }] },
      topics: { connect: [{ slug: "mistica" }] },
      places: { connect: [{ slug: "fontiveros" }] },
      artworkImageUrl:
        "/images/artworks/zurbaran-san-juan-de-la-cruz.jpg",
      artworkTitle: "Retrato de San Juan de la Cruz",
      artworkAuthor: "Atribuido a Francisco de Zurbarán, 1656",
      artworkCaption:
        "Retrato sobrio, casi sin atributos, de un fraile menudo y discreto: la imagen que la tradición conserva de un poeta capaz de escribir algunos de los versos más intensos de la lengua española durante los meses que pasó encarcelado por sus propios hermanos de orden.",
    },
  });

  // ---------------------------------------------------------------------
  // San Juan de la Cruz — «Poesía» (Cántico espiritual y Llama de amor viva)
  // ---------------------------------------------------------------------
  console.log("Creando obra «Poesía» de San Juan de la Cruz...");

  const poesiaSanJuanDeLaCruz = await prisma.work.create({
    data: {
      slug: "poesia-san-juan-de-la-cruz",
      title: "Poesía",
      year: 1618,
      era: "Renacimiento",
      genre: "Poesía mística (canción / lira)",
      synopsis: `Junto a «Noche oscura», San Juan de la Cruz dejó otras dos grandes composiciones líricas: el «Cántico espiritual», un diálogo amoroso en forma de églogas entre el alma —la esposa— y Dios —el Esposo—, que recorre la búsqueda, el diálogo con la naturaleza y la unión final de los amantes; y «Llama de amor viva», una exclamación breve y densísima que celebra, con el lenguaje de la herida y el fuego, la experiencia de la unión ya consumada. El propio autor comentó ambos poemas en extensos tratados en prosa que llevan el mismo título, donde explica su sentido como descripción del camino del alma hacia Dios.`,
      authorId: sanJuanDeLaCruz.id,
    },
  });

  // Fragmentos — Poesía (San Juan de la Cruz)
  console.log("Creando fragmentos de «Poesía» de San Juan de la Cruz...");

  const canticoText = `Mi Amado las montañas,
los valles solitarios nemorosos,
las ínsulas extrañas,
los ríos sonorosos,
el silbo de los aires amorosos;

la noche sosegada
en par de los levantes del aurora,
la música callada,
la soledad sonora,
la cena que recrea y enamora. [...]

Entrado se ha la esposa
en el ameno huerto deseado,
y a su sabor reposa
el cuello reclinado
sobre los dulces brazos del Amado. [...]`;

  const fragCanticoEspiritual = await prisma.fragment.create({
    data: {
      slug: "cantico-espiritual-la-union",
      title: "Cántico espiritual",
      location: "Cántico espiritual, estrofas de la unión",
      headline: "La música callada, la soledad sonora",
      text: canticoText,
      order: 1,
      status: "published",
      featured: false,
      workId: poesiaSanJuanDeLaCruz.id,
      constellations: { connect: [{ slug: "amor" }] },
      topics: { connect: [{ slug: "mistica" }] },
      places: { connect: [{ slug: "fontiveros" }] },
      artworkImageUrl: "/images/artworks/klimt-el-beso.jpg",
      artworkTitle: "El beso",
      artworkAuthor: "Gustav Klimt, 1907-1908 (Österreichische Galerie Belvedere, Viena)",
      artworkCaption:
        "La unión mística entre el alma y Dios que San Juan expresa con el lenguaje del amor conyugal —dos seres que se funden hasta ser uno solo, rodeados de una naturaleza dorada y ornamental que los envuelve y consagra— tiene en Klimt su equivalente visual más poderoso: el abrazo total donde los cuerpos desaparecen en el ornamento y solo queda la fusión.",
    },
  });

  const llamaAmorVivaText = `¡Oh llama de amor viva
que tiernamente hieres
de mi alma el más profundo centro!,
pues ya no eres esquiva,
acaba ya si quieres,
rompe la tela de este dulce encuentro.

¡Oh cauterio suave!,
¡oh regalada llaga!
¡oh mano blanda!, ¡oh toque delicado
que a vida eterna sabe,
y toda deuda paga!
Matando, muerte en vida la has trocado.

¡Oh lámpara de fuego,
en cuyos resplandores
las profundas cavernas del sentido,
que estaba oscuro y ciego,
con extraños primores
calor y luz dan junto a su querido!

¡Cuán manso y amoroso
recuerdas en mi seno,
donde secretamente solo moras;
y en tu aspirar sabroso,
de bien y gloria lleno,
cuán delicadamente me enamoras!`;

  const fragLlamaAmorViva = await prisma.fragment.create({
    data: {
      slug: "llama-de-amor-viva",
      title: "Llama de amor viva",
      location: "Llama de amor viva, poema completo",
      headline: "¡Oh llama de amor viva que tiernamente hieres!",
      text: llamaAmorVivaText,
      order: 2,
      status: "published",
      featured: false,
      workId: poesiaSanJuanDeLaCruz.id,
      constellations: { connect: [{ slug: "amor" }, { slug: "fe" }] },
      topics: { connect: [{ slug: "mistica" }] },
      places: { connect: [{ slug: "fontiveros" }] },
      artworkImageUrl: "/images/artworks/bernini-extasis-santa-teresa.jpg",
      artworkTitle: "Éxtasis de santa Teresa",
      artworkAuthor:
        "Gian Lorenzo Bernini, 1647-1652 (Santa Maria della Vittoria, Roma)",
      artworkCaption:
        "Aunque es escultura, la obra de Bernini es el referente visual inevitable para la experiencia que describe este poema: la llaga dulce, el toque que hiere y da vida a un tiempo, el cuerpo que se abandona a una fuerza que lo supera y lo transforma. Santa Teresa y San Juan de la Cruz son contemporáneos y comparten el mismo lenguaje del amor que duele y redime.",
    },
  });

  // ---------------------------------------------------------------------
  // Fray Luis de León — «Poesía»
  // ---------------------------------------------------------------------
  console.log("Creando autor y obra de fray Luis de León...");

  const frayLuisDeLeon = await prisma.author.create({
    data: {
      slug: "fray-luis-de-leon",
      name: "Fray Luis de León",
      birthYear: 1527,
      deathYear: 1591,
      country: "España",
      era: "Renacimiento",
      bio: `Nacido en Belmonte (Cuenca) en 1527, ingresó muy joven en la Orden de San Agustín y se formó en la Universidad de Salamanca, donde llegaría a ocupar varias cátedras de teología y de Biblia. Humanista y helenista, tradujo al castellano libros bíblicos —entre ellos el Cantar de los cantares— y obras de Horacio y Virgilio. En 1572 fue denunciado ante la Inquisición, en parte por esas traducciones, y pasó casi cinco años encarcelado en Valladolid antes de ser absuelto y restituido a su cátedra. Murió en 1591, poco después de ser elegido provincial de su orden. Su poesía, de tono horaciano y cristiano a la vez, circuló en copias manuscritas y no se publicó hasta 1631, cuarenta años después de su muerte, en una edición preparada por Quevedo.`,
      portraitUrl: "/images/authors/fray-luis-de-leon.jpg",
    },
  });

  const poesiaFrayLuis = await prisma.work.create({
    data: {
      slug: "poesia-fray-luis-de-leon",
      title: "Poesía",
      year: 1631,
      era: "Renacimiento",
      genre: "Poesía lírica (oda)",
      synopsis: `Conjunto breve de odas en liras, de difusión manuscrita en vida del autor y publicadas solo cuarenta años después de su muerte, en las que fray Luis de León funde el ideal horaciano del «beatus ille» —la vida retirada, lejos de la ambición y el ruido del mundo— con la aspiración cristiana a la patria eterna del alma. La contemplación de la naturaleza y del cielo nocturno, el rechazo de la fama y la experiencia personal del encierro —sufrió varios años de prisión por la Inquisición— atraviesan unos poemas que cuentan entre los más altos de la lírica española del Siglo de Oro.`,
      authorId: frayLuisDeLeon.id,
    },
  });

  // Fragmentos — Poesía (fray Luis de León)
  console.log("Creando fragmentos de «Poesía» de fray Luis de León...");

  const vidaRetiradaText = `¡Qué descansada vida
la del que huye el mundanal rüido
y sigue la escondida
senda, por donde han ido
los pocos sabios que en el mundo han sido;

que no le enturbia el pecho
de los soberbios grandes el estado,
ni del dorado techo
se admira, fabricado
del sabio moro, en jaspes sustentado!

No cura si la fama
canta con voz su nombre pregonera,
ni cura si encarama
la lengua lisonjera
lo que condena la verdad sincera.

¿Qué presta a mi contento,
si soy del vano dedo señalado;
si, en busca deste viento,
ando desalentado,
con ansias vivas, con mortal cuidado?`;

  const fragVidaRetirada = await prisma.fragment.create({
    data: {
      slug: "la-vida-retirada",
      title: "La vida retirada",
      location: "Oda «A la vida retirada», estrofas 1-4",
      headline: "¡Qué descansada vida la del que huye el mundanal rüido!",
      text: vidaRetiradaText,
      order: 1,
      status: "published",
      featured: false,
      workId: poesiaFrayLuis.id,
      constellations: { connect: [{ slug: "poder" }] },
      topics: {
        connect: [{ slug: "beatus-ille" }, { slug: "contemptus-mundi" }],
      },
      places: { connect: [{ slug: "salamanca" }] },
      artworkImageUrl: "/images/artworks/rubens-jardin-del-eden.jpg",
      artworkTitle: "El jardín del paraíso terrenal",
      artworkAuthor:
        "Jan Brueghel el Viejo y Peter Paul Rubens, h. 1615 (Museo del Prado, Madrid)",
      artworkCaption:
        "Un jardín exuberante y ordenado, donde el agua corre, los árboles dan fruto y los animales conviven en paz: la traducción pictórica más cumplida del huerto que fray Luis imagina como «un no rompido sueño», la vida retirada como estado de gracia, lejos del ruido del mundo.",
    },
  });

  const ascensionText = `¡Y dejas Pastor santo,
tu grey en este valle hondo, escuro,
con soledad y llanto!
Y tú, rompiendo el puro
aire, ¿te vas al inmortal seguro?

Los antes bienhadados,
y los agora tristes y afligidos,
a tus pechos criados,
de ti desposeídos,
¿a dó convertirán ya sus sentidos?

¿Qué mirarán los ojos
que vieron de tu rostro la hermosura,
que no les sea enojos?
Quien oyó tu dulzura,
¿qué no tendrá por sordo y desventura?

Aqueste mar turbado,
¿quién le pondrá freno? ¿Quién concierto
al viento fiero, airado?
Estando tú encubierto,
¿qué norte guiará la nave al puerto?

¡Ay!, nube, envidiosa
aun de este breve gozo, ¿qué te aquejas?
¿Dó vuelas presurosa?
¡Cuán rica tú te alejas!
¡Cuán pobres y cuán ciegos, ay, nos dejas!`;

  const fragAscension = await prisma.fragment.create({
    data: {
      slug: "en-la-ascension",
      title: "En la Ascensión",
      location: "Oda «En la Ascensión», completa",
      headline: "¡Y dejas, Pastor santo, tu grey en este valle hondo, escuro!",
      text: ascensionText,
      order: 2,
      status: "published",
      featured: false,
      workId: poesiaFrayLuis.id,
      constellations: { connect: [{ slug: "fe" }] },
      topics: { connect: [{ slug: "mistica" }] },
      places: { connect: [{ slug: "salamanca" }] },
      artworkImageUrl: "/images/artworks/alcaniz-ascension-de-cristo.jpg",
      artworkTitle: "La Ascensión de Cristo",
      artworkAuthor:
        "Miguel Alcañiz el Viejo, primera mitad del siglo XV (Hispanic Society of America, Nueva York)",
      artworkCaption:
        "Cristo se eleva hacia el cielo mientras los apóstoles, abajo, levantan los ojos con gestos de asombro y desamparo: la misma escena —el «valle hondo, escuro» que se queda sin su «Pastor santo»— que fray Luis convierte en un torrente de preguntas sin respuesta.",
    },
  });

  const nocheSerenaText = `Cuando contemplo el cielo
de innumerables luces adornado,
y miro hacia el suelo,
de noche rodeado,
en sueño y en olvido sepultado,

el amor y la pena
despiertan en mi pecho un ansia ardiente;
despiden larga vena
los ojos hechos fuente;
la lengua dice al fin con voz doliente:

«Morada de grandeza,
templo de claridad y de hermosura:
mi alma que a tu alteza
nació, ¡qué desventura
la tiene en esta cárcel, baja, oscura! [...]`;

  const fragNocheSerena = await prisma.fragment.create({
    data: {
      slug: "noche-serena",
      title: "Noche serena",
      location: "Oda «Noche serena», estrofas 1-3",
      headline: "Cuando contemplo el cielo de innumerables luces adornado",
      text: nocheSerenaText,
      order: 3,
      status: "published",
      featured: false,
      workId: poesiaFrayLuis.id,
      constellations: { connect: [{ slug: "fe" }] },
      topics: {
        connect: [{ slug: "contemptus-mundi" }, { slug: "mistica" }],
      },
      places: { connect: [{ slug: "salamanca" }] },
      artworkImageUrl: "/images/artworks/van-gogh-noche-estrellada.jpg",
      artworkTitle: "La noche estrellada",
      artworkAuthor: "Vincent van Gogh, 1889 (MoMA, Nueva York)",
      artworkCaption:
        "Un cielo nocturno desbordante de luz y movimiento sobre un pueblo dormido y oscuro: el contraste exacto que articula el poema de fray Luis entre la «inmensa hermosura» del cielo contemplado y la pequeñez de «esta cárcel, baja, oscura» donde el alma se siente presa.",
    },
  });

  const carcelText = `Aquí la envidia y mentira
me tuvieron encerrado.
Dichoso el humilde estado
del sabio que se retira
de aqueste mundo malvado,
y con pobre mesa y casa
en el campo deleitoso
con solo Dios se compasa
y a solas su vida pasa,
ni envidiado ni envidioso.`;

  const fragSalidaCarcel = await prisma.fragment.create({
    data: {
      slug: "a-la-salida-de-la-carcel",
      title: "A la salida de la cárcel",
      location: "«A la salida de la cárcel», poema completo",
      headline: "Dichoso el humilde estado del sabio que se retira",
      text: carcelText,
      order: 4,
      status: "published",
      featured: false,
      workId: poesiaFrayLuis.id,
      constellations: { connect: [{ slug: "poder" }] },
      topics: { connect: [{ slug: "contemptus-mundi" }] },
      places: { connect: [{ slug: "salamanca" }] },
      artworkImageUrl: "/images/artworks/burgkmair-san-juan-en-patmos.jpg",
      artworkTitle: "San Juan en Patmos",
      artworkAuthor:
        "Hans Burgkmair el Viejo, 1518 (Alte Pinakothek, Múnich)",
      artworkCaption:
        "El evangelista escribe en soledad, desterrado en una isla, sostenido solo por su fe y su pluma: la imagen del sabio que, como fray Luis tras su proceso inquisitorial, convierte el confinamiento impuesto por sus enemigos en una forma de libertad interior que no silencia, sino que libera, la palabra.",
    },
  });

  const gongora = await prisma.author.create({
    data: {
      slug: "luis-de-gongora",
      name: "Luis de Góngora y Argote",
      birthYear: 1561,
      deathYear: 1627,
      country: "España",
      era: "Barroco",
      bio: `Poeta y clérigo cordobés (1561-1627), una de las figuras centrales del Barroco español. Su poesía culta y exigente —el llamado culteranismo, de sintaxis latinizante, cultismos y metáforas en cadena— le valió tanto admiradores como una agria polémica literaria con Quevedo, que llegó a los insultos personales en numerosos sonetos satíricos cruzados entre ambos. Escribió tanto poesía «culta» (*Soledades*, *Fábula de Polifemo y Galatea*) como letrillas y romances de tono popular.`,
      portraitUrl: "/images/authors/luis-de-gongora.jpg",
    },
  });

  const sonetosGongora = await prisma.work.create({
    data: {
      slug: "sonetos-gongora",
      title: "Sonetos",
      year: 1582,
      era: "Barroco",
      genre: "Poesía lírica (soneto)",
      synopsis: `Sonetos de Góngora sobre temas amorosos, morales y de circunstancias, escritos a lo largo de su vida y publicados, como el resto de su obra, de forma póstuma y dispersa. «Mientras por competir con tu cabello» retoma de forma explícita el soneto XXIII de Garcilaso —y, a través de él, el tópico horaciano del carpe diem— para llevarlo a una conclusión mucho más sombría.`,
      authorId: gongora.id,
    },
  });

  const gongoraText = `Mientras por competir con tu cabello,
oro bruñido al sol relumbra en vano;
mientras con menosprecio en medio el llano
mira tu blanca frente el lilio bello;

mientras a cada labio, por cogello,
siguen más ojos que al clavel temprano,
y mientras triunfa con desdén lozano
del luciente cristal tu gentil cuello;

goza cuello, cabello, labio y frente,
antes que lo que fue en tu edad dorada
oro, lilio, clavel, cristal luciente,

no sólo en plata o vïola troncada
se vuelva, mas tú y ello juntamente
en tierra, en humo, en polvo, en sombra, en nada.`;

  const fragGongora = await prisma.fragment.create({
    data: {
      slug: "mientras-por-competir-con-tu-cabello",
      title: "Mientras por competir con tu cabello",
      location: "Sonetos",
      headline: "De cabello de oro a humo y nada",
      text: gongoraText,
      order: 1,
      status: "published",
      featured: false,
      workId: sonetosGongora.id,
      constellations: { connect: [{ slug: "amor" }, { slug: "paso-del-tiempo" }] },
      topics: { connect: [{ slug: "carpe-diem" }, { slug: "tempus-fugit" }] },
      artworkImageUrl:
        "/images/artworks/velazquez-luis-de-gongora.jpg",
      artworkTitle: "Retrato de don Luis de Góngora y Argote",
      artworkAuthor: "Diego Velázquez, 1622",
      artworkCaption:
        "Velázquez retrató a Góngora hacia el final de su vida, con un gesto adusto y nada favorecedor: bien distinto de la «edad dorada» que el propio poeta pide aprovechar en este soneto, antes de que todo se convierta «en tierra, en humo, en polvo, en sombra, en nada».",
    },
  });

  const lopeDeVega = await prisma.author.create({
    data: {
      slug: "lope-de-vega",
      name: "Lope de Vega",
      birthYear: 1562,
      deathYear: 1635,
      country: "España",
      era: "Barroco",
      bio: `Dramaturgo y poeta madrileño (1562-1635), apodado «el Fénix de los Ingenios» por su asombrosa productividad: se le atribuyen varios centenares de comedias, además de una extensa obra poética y narrativa. Renovó el teatro español con la fórmula de la «comedia nueva» —mezcla de lo trágico y lo cómico, ruptura de las unidades clásicas— que dominaría la escena durante todo el Barroco. Su vida sentimental, intensa y agitada, dejó huella directa en buena parte de su poesía lírica.`,
      portraitUrl: "/images/authors/lope-de-vega.jpg",
    },
  });

  const rimasHumanas = await prisma.work.create({
    data: {
      slug: "rimas-humanas",
      title: "Rimas humanas",
      year: 1602,
      era: "Barroco",
      genre: "Poesía lírica (soneto)",
      synopsis: `Colección de sonetos de tema mayoritariamente amoroso publicada por Lope en 1602. El soneto 126, «Desmayarse, atreverse, estar furioso», construido como una larga enumeración de definiciones contradictorias del amor, sigue el modelo del soneto 134 de Petrarca y se convirtió en una de las composiciones más populares de toda la lírica española.`,
      authorId: lopeDeVega.id,
    },
  });

  const desmayarseText = `Desmayarse, atreverse, estar furioso,
áspero, tierno, liberal, esquivo,
alentado, mortal, difunto, vivo,
leal, traidor, cobarde y animoso;

no hallar fuera del bien centro y reposo,
mostrarse alegre, triste, humilde, altivo,
enojado, valiente, fugitivo,
satisfecho, ofendido, receloso;

huir el rostro al claro desengaño,
beber veneno por licor süave,
olvidar el provecho, amar el daño;

creer que un cielo en un infierno cabe,
dar la vida y el alma a un desengaño;
esto es amor, quien lo probó lo sabe.`;

  const fragDesmayarse = await prisma.fragment.create({
    data: {
      slug: "desmayarse-atreverse-estar-furioso",
      title: "Desmayarse, atreverse, estar furioso",
      location: "Rimas humanas, soneto 126",
      headline: "El amor, definido en catorce contrarios",
      text: desmayarseText,
      order: 1,
      status: "published",
      featured: false,
      workId: rimasHumanas.id,
      constellations: { connect: [{ slug: "amor" }] },
      topics: { connect: [{ slug: "amor-cortes" }] },
      artworkImageUrl:
        "/images/artworks/lope-de-vega.jpg",
      artworkTitle: "Retrato de Lope de Vega",
      artworkAuthor: "Atribuido a Eugenio Cajés, h. 1627",
      artworkCaption:
        "Retrato oficial y serenísimo del dramaturgo, vestido con el hábito y la cruz de la orden de San Juan: una imagen bien distinta del torbellino de pasiones contradictorias —«desmayarse, atreverse, estar furioso»— que Lope atribuye al amor en este soneto.",
    },
  });

  const quevedo = await prisma.author.create({
    data: {
      slug: "francisco-de-quevedo",
      name: "Francisco de Quevedo",
      birthYear: 1580,
      deathYear: 1645,
      country: "España",
      era: "Barroco",
      bio: `Poeta, narrador y pensador madrileño (1580-1645), una de las figuras centrales del conceptismo barroco —un estilo basado en la agudeza y el juego de ideas, frente al ornamento sensorial del culteranismo gongorino—. Autor de una obra inmensa y variada: poesía amorosa, satírica, moral y religiosa, tratados filosóficos y la novela picaresca *El Buscón*. Mantuvo con Góngora una rivalidad literaria y personal feroz, plasmada en decenas de sonetos satíricos mutuos.`,
      portraitUrl: "/images/authors/francisco-de-quevedo.jpg",
    },
  });

  const parnasoEspanol = await prisma.work.create({
    data: {
      slug: "el-parnaso-espanol",
      title: "El Parnaso español",
      year: 1648,
      era: "Barroco",
      genre: "Poesía lírica (soneto)",
      synopsis: `Recopilación póstuma (1648) de la poesía de Quevedo, ordenada por su editor en nueve «musas» según el tema. «Amor constante más allá de la muerte» pertenece al grupo de sonetos amorosos «metafísicos», en los que el amor se concibe como una fuerza capaz de sobrevivir incluso a la disolución del cuerpo.`,
      authorId: quevedo.id,
    },
  });

  const amorConstanteText = `Cerrar podrá mis ojos la postrera
sombra que me llevare el blanco día,
y podrá desatar esta alma mía
hora a su afán ansioso lisonjera;

mas no, de esotra parte, en la ribera,
dejará la memoria, en donde ardía:
nadar sabe mi llama la agua fría,
y perder el respeto a ley severa.

Alma a quien todo un dios prisión ha sido,
venas que humor a tanto fuego han dado,
medulas que han gloriosamente ardido,

su cuerpo dejará, no su cuidado;
serán ceniza, mas tendrá sentido;
polvo serán, mas polvo enamorado.`;

  const fragAmorConstante = await prisma.fragment.create({
    data: {
      slug: "amor-constante-mas-alla-de-la-muerte",
      title: "Amor constante más allá de la muerte",
      location: "El Parnaso español",
      headline: "Polvo serán, mas polvo enamorado",
      text: amorConstanteText,
      order: 1,
      status: "published",
      featured: false,
      workId: parnasoEspanol.id,
      constellations: { connect: [{ slug: "amor" }, { slug: "muerte" }] },
      artworkImageUrl:
        "/images/artworks/valdes-leal-in-ictu-oculi.jpg",
      artworkTitle: "In Ictu Oculi (En un abrir y cerrar de ojos)",
      artworkAuthor: "Juan de Valdés Leal, h. 1670-1672",
      artworkCaption:
        "Vanitas barroca: un esqueleto apaga de un soplo la vela de la vida humana, rodeado de símbolos del poder y el saber que de nada sirven ante la muerte. Frente a este «memento mori» implacable, el soneto de Quevedo opone una idea casi provocadora: hay algo que la muerte no logrará apagar del todo.",
    },
  });

  const espronceda = await prisma.author.create({
    data: {
      slug: "jose-de-espronceda",
      name: "José de Espronceda",
      birthYear: 1808,
      deathYear: 1842,
      country: "España",
      era: "Romanticismo",
      bio: `Poeta extremeño (1808-1842), figura central del Romanticismo español. Su vida fue políticamente agitada —conspiraciones y exilios en Lisboa, Londres y París— y sentimentalmente turbulenta: su relación con Teresa Mancha, de la que tuvo una hija y de la que se separó poco antes de la temprana muerte de ella en 1839, inspiró el «Canto a Teresa», interpolado dos años después en su poema narrativo más ambicioso, *El diablo mundo*.`,
      portraitUrl: "/images/authors/jose-de-espronceda.jpg",
    },
  });

  const elDiabloMundo = await prisma.work.create({
    data: {
      slug: "el-diablo-mundo",
      title: "El diablo mundo",
      year: 1841,
      era: "Romanticismo",
      genre: "Poema narrativo (canto lírico)",
      synopsis: `Extenso poema narrativo e inacabado, de carácter filosófico y simbólico, que sigue las peripecias de un anciano convertido mágicamente en un joven sin memoria del bien y del mal. El Canto II, conocido independientemente como «Canto a Teresa», interrumpe la narración con una elegía personal y autobiográfica a la muerte de Teresa Mancha, antigua amante del poeta.`,
      authorId: espronceda.id,
    },
  });

  const cantoTeresaText = `¿Por qué volvéis a la memoria mía,
tristes recuerdos del placer perdido,
a aumentar la ansiedad y la agonía
de este desierto corazón herido?
¡Ay!, que de aquellas horas de alegría
le quedó al corazón sólo un gemido,
y el llanto que al dolor los ojos niegan
lágrimas son de hiel que el alma anegan.

¿Dónde volaron, ¡ay!, aquellas horas
de juventud, de amor y de ventura,
regaladas de músicas sonoras,
adornadas de luz y de hermosura?
Imágenes de oro bullidoras,
sus alas de carmín y nieve pura,
al son de mi esperanza desplegando,
pasaban, ¡ay!, a mí alrededor cantando.`;

  const fragCantoTeresa = await prisma.fragment.create({
    data: {
      slug: "canto-a-teresa",
      title: "Canto a Teresa",
      location: "El diablo mundo, Canto II (Canto a Teresa), octavas 1-2",
      headline: "Recuerdos que no dejan vivir",
      text: cantoTeresaText,
      order: 1,
      status: "published",
      featured: false,
      workId: elDiabloMundo.id,
      constellations: {
        connect: [{ slug: "amor" }, { slug: "muerte" }, { slug: "paso-del-tiempo" }],
      },
      artworkImageUrl:
        "/images/artworks/jose-de-espronceda.jpg",
      artworkTitle: "El escritor José de Espronceda",
      artworkAuthor: "Antonio María Esquivel, 1842",
      artworkCaption:
        "Retrato pintado el mismo año de la muerte de Espronceda, a los treinta y cuatro años: el rostro de un poeta que, como deja ver el «Canto a Teresa», vivió su breve vida entre la pasión y la pérdida.",
    },
  });

  const rosalia = await prisma.author.create({
    data: {
      slug: "rosalia-de-castro",
      name: "Rosalía de Castro",
      birthYear: 1837,
      deathYear: 1885,
      country: "España",
      era: "Romanticismo",
      bio: `Poeta y novelista gallega (1837-1885), figura fundamental del Rexurdimento, el movimiento de recuperación de la literatura en lengua gallega en el siglo XIX. Sus poemarios en gallego *Cantares gallegos* (1863) y, sobre todo, *Follas novas* (1880) —donde aparece «Negra sombra»— renovaron la lírica en esa lengua; más tarde, ya en castellano, publicaría *En las orillas del Sar* (1884). Su poesía, marcada por la melancolía y por la conciencia de una presencia que lo invade todo, influiría decisivamente en poetas posteriores como Antonio Machado o Juan Ramón Jiménez.`,
      portraitUrl: "/images/authors/rosalia-de-castro.jpg",
    },
  });

  const follasNovas = await prisma.work.create({
    data: {
      slug: "follas-novas",
      title: "Follas novas",
      translatedTitle: "Hojas nuevas",
      year: 1880,
      era: "Romanticismo",
      genre: "Poesía lírica",
      synopsis: `Segundo gran poemario en gallego de Rosalía de Castro, de tono más íntimo y sombrío que *Cantares gallegos*. «Negra sombra», su poema más conocido y versionado musicalmente, describe una presencia oscura e inseparable de la voz poética —¿la melancolía?, ¿la muerte?, ¿un amor perdido?— que está en todo lo que la rodea y de la que nunca podrá librarse.`,
      authorId: rosalia.id,
    },
  });

  const negraSombraText = `Cando penso que te fuches,
negra sombra que me asombras,
ó pé dos meus cabezais
tornas facéndome mofa.

Cando maxino que es ida,
no mesmo sol te me amostras,
i eres a estrela que brila,
i eres o vento que zoa.

Si cantan, es ti que cantas,
si choran, es ti que choras,
i es o marmurio do río
i es a noite e es a aurora.

En todo estás e ti es todo,
pra min e en min mesma moras,
nin me deixarás nunca,
sombra que sempre me asombras.`;

  const fragNegraSombra = await prisma.fragment.create({
    data: {
      slug: "negra-sombra",
      title: "Negra sombra",
      location: "Follas novas",
      headline: "Una sombra que está en todo",
      text: negraSombraText,
      order: 1,
      status: "published",
      featured: false,
      workId: follasNovas.id,
      constellations: { connect: [{ slug: "amor" }, { slug: "muerte" }] },
      artworkImageUrl:
        "/images/artworks/rosalia-de-castro.jpg",
      artworkTitle: "Retrato de Rosalía de Castro",
      artworkAuthor: "Máximo Ramos, 1914",
      artworkCaption:
        "Retrato pintado casi treinta años después de la muerte de la poeta, a partir de fotografías y testimonios: la imagen con la que Galicia recordaría a la autora de «Negra sombra», un poema desde entonces versionado en todo tipo de estilos musicales.",
    },
  });

  // ---------------------------------------------------------------------
  // Itinerario: «Nombrar el amor»
  // ---------------------------------------------------------------------
  console.log("Creando itinerario «Nombrar el amor»...");

  const itinerarioAmor = await prisma.itinerary.create({
    data: {
      slug: "nombrar-el-amor",
      title: "Nombrar el amor",
      description: `Trece textos, de las jarchas mozárabes a Rosalía de Castro, que ponen distintas palabras —y distintas lenguas— al mismo impulso: nombrar el amor. Una espera junto al mar, un corazón que se va antes que el cuerpo, una pasión que se invoca con magia, un amor que sobrevive a la muerte convertido en polvo, una unión mística contada como un encuentro de amantes, y una sombra de la que nunca se puede escapar.`,
    },
  });

  await prisma.itineraryFragment.createMany({
    data: [
      { itineraryId: itinerarioAmor.id, fragmentId: fragJarchaCorazon.id, order: 1 },
      { itineraryId: itinerarioAmor.id, fragmentId: fragJarchaHermanas.id, order: 2 },
      { itineraryId: itinerarioAmor.id, fragmentId: fragOndas.id, order: 3 },
      { itineraryId: itinerarioAmor.id, fragmentId: fragCoplas.id, order: 4 },
      { itineraryId: itinerarioAmor.id, fragmentId: fragConjuro.id, order: 5 },
      { itineraryId: itinerarioAmor.id, fragmentId: fragPlanto.id, order: 6 },
      { itineraryId: itinerarioAmor.id, fragmentId: fragVivoSinVivir.id, order: 7 },
      { itineraryId: itinerarioAmor.id, fragmentId: fragNocheOscura.id, order: 8 },
      { itineraryId: itinerarioAmor.id, fragmentId: fragGongora.id, order: 9 },
      { itineraryId: itinerarioAmor.id, fragmentId: fragDesmayarse.id, order: 10 },
      { itineraryId: itinerarioAmor.id, fragmentId: fragAmorConstante.id, order: 11 },
      { itineraryId: itinerarioAmor.id, fragmentId: fragCantoTeresa.id, order: 12 },
      { itineraryId: itinerarioAmor.id, fragmentId: fragNegraSombra.id, order: 13 },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Ondas do mar de Vigo
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Ondas do mar de Vigo»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragOndas.id,
        type: "glosa",
        ...anchor(ondasText, "amigo"),
        order: 1,
        content: `En las cantigas de amigo, «amigo» no significa «amistad»: designa al amante o al amado. Es la palabra clave del género, que toma su nombre precisamente de ella.`,
      },
      {
        fragmentId: fragOndas.id,
        type: "glosa",
        ...anchor(ondasText, "cedo"),
        order: 2,
        content: `Adverbio que significa «pronto», «en breve». La pregunta «se verrá cedo?» —¿volverá pronto?— se repite, sin respuesta, al final de cada estrofa.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragOndas.id,
        type: "contexto",
        ...anchor(ondasText, "Ondas do mar de Vigo"),
        order: 1,
        content: `Esta cantiga pertenece al Pergamiño Vindel, un rollo de pergamino del siglo XIII descubierto en 1914 que conserva siete cantigas de amigo de Martín Codax junto con su notación musical original: uno de los pocos testimonios sonoros que han llegado de la lírica medieval gallego-portuguesa.`,
      },
      {
        fragmentId: fragOndas.id,
        type: "contexto",
        ...anchor(ondasText, "Ondas do mar levado"),
        order: 2,
        content: `Las cantigas de amigo suelen poner la voz femenina a hablar con elementos de la naturaleza —el mar, las olas, las flores, una fuente— como únicos confidentes posibles de su pena. Aquí, las propias olas del mar son las interrogadas sobre el paradero del amigo.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragOndas.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(ondasText, "Ondas do mar de Vigo,\nse vistes meu amigo?"),
        order: 1,
        content: `**Paralelismo con variación (leixa-pren)**: la primera estrofa se repite en la segunda casi palabra por palabra, cambiando solo «de Vigo» por «levado» y «amigo» por «amado». Esta técnica, característica de la cantiga de amigo, construye el poema por oleadas, como el propio mar que nombra.`,
      },
      {
        fragmentId: fragOndas.id,
        type: "figura",
        category: "sonoro",
        ...anchor(ondasText, "E ai Deus, se verrá cedo?"),
        order: 2,
        content: `**Estribillo**: este verso se repite, idéntico, al final de las cuatro estrofas. Pensado para el canto —la cantiga conserva su música original—, el estribillo convierte la espera en un estribillo musical que vuelve una y otra vez, sin que la pregunta obtenga nunca respuesta.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragOndas.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿A quién o a qué se dirige la voz que habla en esta cantiga? ¿Qué le pregunta, y obtiene alguna respuesta a lo largo del poema?`,
      },
      {
        fragmentId: fragOndas.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `La pregunta «¿se verrá cedo?» se repite cuatro veces, siempre sin respuesta. ¿Qué efecto produce esta repetición sobre la sensación de espera, y por qué crees que la voz poética elige preguntar al mar en vez de a una persona?`,
      },

      // Intertextualidad
      {
        fragmentId: fragOndas.id,
        type: "intertextualidad",
        ...anchor(ondasText, "se vistes meu amigo"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragJarchaCorazon.id,
        content: `Casi dos siglos antes, en otra lengua romance, las jarchas mozárabes ya ponían en boca de una voz femenina la angustia por la ausencia del «habib» (el amado) y la pregunta por su regreso. Dos lenguas distintas, un mismo gesto: nombrar el amor como espera.`,
      },
      {
        fragmentId: fragOndas.id,
        type: "intertextualidad",
        ...anchor(ondasText, "ai Deus"),
        order: 2,
        linkType: "internal",
        linkTargetFragmentId: fragNegraSombra.id,
        content: `Seis siglos después, otra voz gallega —la de Rosalía de Castro en «Negra sombra»— invocará también una presencia que no acaba de revelarse. Pero frente a esta espera, que confía en un regreso, la sombra de Rosalía nunca se va: ha pasado de la ausencia que se espera a la presencia de la que no se puede escapar.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Nuestras vidas son los ríos
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Nuestras vidas son los ríos»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragCoplas.id,
        type: "glosa",
        ...anchor(coplasText, "señoríos"),
        order: 1,
        content: `Territorios, rentas y privilegios bajo la jurisdicción de un señor feudal: la forma más visible del poder y la riqueza de la nobleza medieval.`,
      },
      {
        fragmentId: fragCoplas.id,
        type: "glosa",
        ...anchor(coplasText, "allegados"),
        order: 2,
        content: `«Llegados», del verbo «allegar». Al llegar a la mar —la muerte—, todos los ríos, grandes y pequeños, quedan igualados.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragCoplas.id,
        type: "contexto",
        ...anchor(coplasText, "Nuestras vidas son los ríos"),
        order: 1,
        content: `Las *Coplas* están escritas en «copla de pie quebrado»: dos versos octosílabos seguidos de uno tetrasílabo (8-8-4), repetidos tres veces por estrofa. Esta estrofa, breve y de ritmo marcado, se convirtió en una de las formas más reconocibles de la poesía castellana del siglo XV.`,
      },
      {
        fragmentId: fragCoplas.id,
        type: "contexto",
        ...anchor(coplasText, "e los ricos"),
        order: 2,
        content: `La idea de que la muerte iguala a todos —poderosos y humildes, ricos y pobres— remite a la tradición medieval de la «danza de la muerte», un motivo iconográfico y literario muy difundido en la Europa de los siglos XIV y XV.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragCoplas.id,
        type: "figura",
        category: "tropo",
        ...anchor(coplasText, "Nuestras vidas son los ríos"),
        order: 1,
        content: `**Metáfora**: la vida humana se identifica con el curso de un río que desemboca en el mar, y el mar con la muerte. Es una de las metáforas más célebres de toda la poesía española, y organiza el resto de la estrofa.`,
      },
      {
        fragmentId: fragCoplas.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(coplasText, "allí los ríos caudales,\nallí los otros medianos\ne más chicos"),
        order: 2,
        content: `**Anáfora y gradación**: la repetición de «allí» y el descenso de los ríos «caudales» a los «medianos» y «más chicos» recorren, de mayor a menor, toda la escala social, antes de que el verso siguiente —«allegados, son iguales»— la borre por completo.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragCoplas.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `Según esta estrofa, ¿qué les ocurre a los «señoríos» —los territorios y privilegios de la nobleza— cuando «se acaban»? ¿Qué tienen en común, al final, los ríos «caudales» y los «más chicos»?`,
      },
      {
        fragmentId: fragCoplas.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `La metáfora del río y el mar presenta la muerte como algo natural —lo que les pasa a todos los ríos— y no como un castigo. ¿Qué efecto tiene esta idea sobre el tono de la estrofa? ¿Te parece una imagen consoladora o, más bien, resignada?`,
      },

      // Intertextualidad
      {
        fragmentId: fragCoplas.id,
        type: "intertextualidad",
        ...anchor(coplasText, "que es el morir"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragPlanto.id,
        content: `Pocos años después de las *Coplas*, Fernando de Rojas hará pronunciar a Pleberio, en *La Celestina*, un lamento ante la muerte de su hija que no encuentra ningún consuelo trascendente. Manrique, en cambio, convierte la igualdad de todos ante la muerte —«que es el morir»— en argumento para la resignación cristiana.`,
      },
      {
        fragmentId: fragCoplas.id,
        type: "intertextualidad",
        ...anchor(coplasText, "allegados, son iguales"),
        order: 2,
        linkType: "external",
        externalCitation: `François Villon, «Balada de las damas de antaño» (h. 1461): «Mas, ¿dónde están las nieves de antaño?».`,
        content: `La idea de que el tiempo y la muerte igualan a todo lo que antes parecía grande recorre la poesía europea medieval bajo la fórmula del *ubi sunt* («¿dónde están?»). Pocos años después de las *Coplas*, el poeta francés François Villon preguntaría, con el mismo espíritu, dónde están «las nieves de antaño».`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Vivo sin vivir en mí
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Vivo sin vivir en mí»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragVivoSinVivir.id,
        type: "glosa",
        ...anchor(vivoSinVivirText, "letrero"),
        order: 1,
        content: `Inscripción, lema. Aquí, la frase que el amor de Dios «escribe» sobre el corazón de la voz poética en el momento mismo de entregárselo, como una marca que queda grabada para siempre.`,
      },
      {
        fragmentId: fragVivoSinVivir.id,
        type: "glosa",
        ...anchor(vivoSinVivirText, "cautivo"),
        order: 2,
        content: `Prisionero. El poema invierte los papeles habituales: no es el alma la que queda cautiva de Dios, sino Dios el que queda «cautivo» del amor del alma.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragVivoSinVivir.id,
        type: "contexto",
        ...anchor(vivoSinVivirText, "que muero porque no muero"),
        order: 1,
        content: `Este verso —«que muero porque no muero»— procede de un villancico popular anterior. Santa Teresa, como otros poetas religiosos del siglo XVI, toma un estribillo de tradición oral y lo convierte en punto de partida de una glosa de tema místico.`,
      },
      {
        fragmentId: fragVivoSinVivir.id,
        type: "contexto",
        ...anchor(vivoSinVivirText, "Esta divina prisión"),
        order: 2,
        content: `En el siglo XVI, místicos como Santa Teresa y San Juan de la Cruz —compañeros en la reforma del Carmelo— desarrollaron un lenguaje poético propio para describir la unión del alma con Dios, tomando prestadas las imágenes y el vocabulario de la poesía amorosa de su época.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragVivoSinVivir.id,
        type: "figura",
        category: "tropo",
        ...anchor(vivoSinVivirText, "que muero porque no muero"),
        order: 1,
        content: `**Paradoja**: el verso afirma y niega la muerte a la vez. Esta contradicción aparente —morir de no poder morir— es el recurso central de la poesía mística, que necesita expresar una experiencia que excede el lenguaje ordinario.`,
      },
      {
        fragmentId: fragVivoSinVivir.id,
        type: "figura",
        category: "tropo",
        ...anchor(vivoSinVivirText, "ha hecho a Dios mi cautivo,\ny libre mi corazón"),
        order: 2,
        content: `**Antítesis**: «cautivo» y «libre» se oponen y, a la vez, se invierten respecto a sus papeles habituales. En la poesía amorosa cortés, el amante suele ser el «cautivo» de su dama; aquí es Dios quien queda «cautivo», mientras el corazón humano se siente, paradójicamente, libre.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragVivoSinVivir.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `Según la segunda estrofa, ¿qué ocurre cuando la voz poética entrega su corazón al Señor? ¿Qué «escribe» Dios en él?`,
      },
      {
        fragmentId: fragVivoSinVivir.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El verso «que muero porque no muero» se repite al final de cada estrofa. ¿Qué tipo de «vida» y de «muerte» describe en realidad Santa Teresa? ¿Por qué crees que elige expresarlo mediante una paradoja en lugar de explicarlo de forma directa?`,
      },

      // Intertextualidad
      {
        fragmentId: fragVivoSinVivir.id,
        type: "intertextualidad",
        ...anchor(vivoSinVivirText, "muero porque no muero"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragNocheOscura.id,
        content: `San Juan de la Cruz, compañero de Santa Teresa en la reforma del Carmelo, recurre también a la paradoja para describir la unión mística, aunque su poema más conocido organiza esa experiencia alrededor de la noche y la luz, no de la vida y la muerte.`,
      },
      {
        fragmentId: fragVivoSinVivir.id,
        type: "intertextualidad",
        ...anchor(vivoSinVivirText, "amor"),
        order: 2,
        linkType: "external",
        externalCitation: `Cantar de los Cantares (Antiguo Testamento), leído desde la Antigüedad como una alegoría del amor entre Dios y el alma.`,
        content: `El lenguaje del amor humano —deseo, entrega, unión, prisión— como vía para hablar de la relación entre el alma y Dios tiene su modelo más influyente en el Cantar de los Cantares, un poema de amor del Antiguo Testamento que la tradición cristiana interpretó como alegoría espiritual.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Noche oscura
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Noche oscura»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragNocheOscura.id,
        type: "glosa",
        ...anchor(nocheOscuraText, "celada"),
        order: 1,
        content: `Oculta, disfrazada (de «encelar», esconder). No tiene relación con la celada como pieza de armadura: aquí significa que la voz poética sale de su casa escondida, sin ser vista por nadie.`,
      },
      {
        fragmentId: fragNocheOscura.id,
        type: "glosa",
        ...anchor(nocheOscuraText, "Aquesta"),
        order: 2,
        content: `Forma arcaica de «esta», muy habitual en la poesía de los siglos XVI y XVII.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragNocheOscura.id,
        type: "contexto",
        ...anchor(nocheOscuraText, "En una noche oscura"),
        order: 1,
        content: `Según la tradición, San Juan de la Cruz compuso buena parte de su poesía durante los meses de 1577-1578 en que estuvo encarcelado, en condiciones muy duras, por los carmelitas no reformados en un convento de Toledo. El poema está escrito en liras, la estrofa que Garcilaso de la Vega había introducido en la poesía castellana décadas antes.`,
      },
      {
        fragmentId: fragNocheOscura.id,
        type: "contexto",
        ...anchor(nocheOscuraText, "quien yo bien me sabía"),
        order: 2,
        content: `El propio San Juan de la Cruz escribió después un extenso comentario en prosa, también titulado *Noche oscura*, donde explica que el poema describe en clave amorosa el camino del alma («ella», la que sale de noche) hacia la unión con Dios («Aquel que bien sabía», su amado).`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragNocheOscura.id,
        type: "figura",
        category: "tropo",
        ...anchor(nocheOscuraText, "¡oh dichosa ventura!"),
        order: 1,
        content: `**Apóstrofe / exclamación**: esta exclamación, repetida en la primera y segunda estrofas, marca el momento de mayor intensidad emocional —la salida hacia el encuentro— y dota al poema de un tono de júbilo contenido en medio de la oscuridad.`,
      },
      {
        fragmentId: fragNocheOscura.id,
        type: "figura",
        category: "tropo",
        ...anchor(nocheOscuraText, "sino la que en el corazón ardía"),
        order: 2,
        content: `**Paradoja de la luz interior**: la voz poética camina «sin otra luz ni guía» y, sin embargo, encuentra su camino gracias a una luz que arde dentro de ella. La oscuridad exterior y la luz interior se oponen y se complementan a la vez.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragNocheOscura.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿En qué momento del día sale la voz poética de su casa, y qué es lo único que la guía en la oscuridad?`,
      },
      {
        fragmentId: fragNocheOscura.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `San Juan de la Cruz explicó que este poema describe, en clave amorosa, el camino del alma hacia Dios. Sabiendo esto, ¿qué sentido adquieren palabras como «secreta», «disfrazada», «a oscuras» o «quien yo bien me sabía»?`,
      },

      // Intertextualidad
      {
        fragmentId: fragNocheOscura.id,
        type: "intertextualidad",
        ...anchor(nocheOscuraText, "amores inflamada"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragVivoSinVivir.id,
        content: `Santa Teresa de Jesús, que impulsó junto con San Juan la reforma del Carmelo, recurre también al lenguaje del amor —«vivo sin vivir en mí», «que muero porque no muero»— para describir el mismo proceso de unión con Dios, aunque organiza su poema en torno a la vida y la muerte, no a la noche y la luz.`,
      },
      {
        fragmentId: fragNocheOscura.id,
        type: "intertextualidad",
        ...anchor(nocheOscuraText, "salí sin ser notada"),
        order: 2,
        linkType: "external",
        externalCitation: `Cantar de los Cantares 3, 1-4: una mujer se levanta de noche, en secreto, a buscar por la ciudad a su amado.`,
        content: `El Cantar de los Cantares describe a una mujer que se levanta de noche, en secreto, a buscar a su amado por la ciudad. San Juan de la Cruz, gran conocedor de la tradición bíblica y de su lectura alegórica, recoge esa misma escena nocturna como punto de partida de su poema.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Cántico espiritual
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Cántico espiritual»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragCanticoEspiritual.id,
        type: "glosa",
        ...anchor(canticoText, "nemorosos"),
        order: 1,
        content: `Frondosos, llenos de árboles. San Juan acumula adjetivos cultos y poco usuales —«nemorosos», «sonorosos»— para describir un paisaje que es, a la vez, real y simbólico.`,
      },
      {
        fragmentId: fragCanticoEspiritual.id,
        type: "glosa",
        ...anchor(canticoText, "en par de los levantes del aurora"),
        order: 2,
        content: `Al amanecer: «los levantes del aurora» son los primeros resplandores con que el sol nace cada día.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragCanticoEspiritual.id,
        type: "contexto",
        ...anchor(canticoText, "Mi Amado las montañas"),
        order: 1,
        content: `El «Cántico espiritual» está concebido como una égloga pastoril en forma de diálogo amoroso entre la esposa (el alma) y el Esposo (Dios), inspirada en el Cantar de los Cantares bíblico. Está escrito, como «Noche oscura», en liras. San Juan escribió después un extenso comentario en prosa, también titulado «Cántico espiritual», para explicar su sentido estrofa por estrofa.`,
      },
      {
        fragmentId: fragCanticoEspiritual.id,
        type: "contexto",
        ...anchor(canticoText, "Entrado se ha la esposa\nen el ameno huerto deseado"),
        order: 2,
        content: `Estas estrofas corresponden al momento culminante del poema: tras una larga búsqueda —llena de preguntas al «Amado» y a la naturaleza—, la esposa encuentra por fin a su Esposo y se produce la unión, descrita aquí como un descanso en un «huerto deseado».`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragCanticoEspiritual.id,
        type: "figura",
        category: "tropo",
        ...anchor(
          canticoText,
          "Mi Amado las montañas,\nlos valles solitarios nemorosos,\nlas ínsulas extrañas,\nlos ríos sonorosos,\nel silbo de los aires amorosos"
        ),
        order: 1,
        content: `**Identificación metafórica**: el Amado (Dios) no se compara con la naturaleza, sino que «es» —según la enumeración— las montañas, los valles, las islas, los ríos, el aire. Toda la creación se convierte en un modo de nombrar la presencia divina.`,
      },
      {
        fragmentId: fragCanticoEspiritual.id,
        type: "figura",
        category: "tropo",
        ...anchor(canticoText, "la música callada,\nla soledad sonora"),
        order: 2,
        content: `**Oxímoron**: «música callada» y «soledad sonora» unen dos términos contradictorios. La experiencia de la unión con Dios desborda el lenguaje ordinario, y solo estas paradojas —un silencio que suena, una soledad que es compañía— logran apuntar hacia ella.`,
      },
      {
        fragmentId: fragCanticoEspiritual.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(canticoText, "Entrado se ha la esposa"),
        order: 3,
        content: `**Cambio de voz**: las estrofas anteriores hablaban en primera persona, desde el «yo» de la esposa («Mi Amado...»). En el momento mismo de la unión, esa voz se disuelve y un narrador describe desde fuera a «la esposa» reclinada en los brazos del Amado, como si la identidad individual se hubiera fundido en el encuentro.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragCanticoEspiritual.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `En la primera estrofa, ¿con qué elementos de la naturaleza se identifica al Amado? Haz una lista.`,
      },
      {
        fragmentId: fragCanticoEspiritual.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `Expresiones como «la música callada» o «la soledad sonora» combinan dos palabras de sentido contrario. ¿Qué tratan de expresar sobre una experiencia que el lenguaje habitual no basta para describir?`,
      },

      // Intertextualidad
      {
        fragmentId: fragCanticoEspiritual.id,
        type: "intertextualidad",
        ...anchor(canticoText, "la noche sosegada\nen par de los levantes del aurora"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragNocheOscura.id,
        content: `La «noche sosegada» del «Cántico espiritual» y la «noche oscura» del otro gran poema de San Juan comparten el mismo escenario —la noche como tiempo del encuentro amoroso con Dios—, aunque aquí la unión ya se ha consumado y la noche se vive como plenitud, no como camino.`,
      },
      {
        fragmentId: fragCanticoEspiritual.id,
        type: "intertextualidad",
        ...anchor(canticoText, "Mi Amado las montañas"),
        order: 2,
        linkType: "external",
        externalCitation: `Cantar de los Cantares 2, 8-9: "La voz de mi amado... semejante es el amado mío al gamo, o al cabrito de los ciervos: he aquí, está tras nuestra pared, mirando por las ventanas".`,
        content: `El diálogo entre la esposa y el Esposo, así como la identificación del amado con elementos del paisaje —montes, valles, aguas—, procede directamente del Cantar de los Cantares, el libro bíblico que San Juan de la Cruz tenía como modelo más cercano.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Llama de amor viva
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Llama de amor viva»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragLlamaAmorViva.id,
        type: "glosa",
        ...anchor(llamaAmorVivaText, "¡Oh cauterio suave!"),
        order: 1,
        content: `El cauterio es el instrumento que, en la medicina antigua, quemaba y cerraba las heridas. Llamarlo «suave» es ya una paradoja: el dolor que cura, el fuego que sana.`,
      },
      {
        fragmentId: fragLlamaAmorViva.id,
        type: "glosa",
        ...anchor(llamaAmorVivaText, "recuerdas en mi seno"),
        order: 2,
        content: `«Recordar» en su sentido antiguo de «despertar»: es Dios quien, «manso y amoroso», despierta en lo más íntimo del alma.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragLlamaAmorViva.id,
        type: "contexto",
        ...anchor(llamaAmorVivaText, "¡Oh llama de amor viva"),
        order: 1,
        content: `San Juan de la Cruz escribió un extenso comentario en prosa de este poema, también titulado «Llama de amor viva», donde explica que describe el grado más alto de la unión del alma con Dios: un estado en el que la acción divina se siente como una llama que ya no hiere desde fuera, sino que arde dentro, transformando el alma en sí misma.`,
      },
      {
        fragmentId: fragLlamaAmorViva.id,
        type: "contexto",
        ...anchor(llamaAmorVivaText, "Matando, muerte en vida la has trocado"),
        order: 2,
        content: `La paradoja de la «muerte que da vida» recorre toda la poesía mística española del siglo XVI: morir a la propia voluntad, a los sentidos, al yo, para acceder a una vida más plena. San Juan la condensa aquí en un solo verso.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragLlamaAmorViva.id,
        type: "figura",
        category: "tropo",
        ...anchor(
          llamaAmorVivaText,
          "¡Oh cauterio suave!,\n¡oh regalada llaga!\n¡oh mano blanda!, ¡oh toque delicado"
        ),
        order: 1,
        content: `**Red de metáforas del fuego y la herida**: «llama», «cauterio», «llaga», «lámpara de fuego», «calor y luz» configuran un campo semántico único que funde el dolor y el placer, la herida y la curación, para hablar de la acción de Dios en el alma.`,
      },
      {
        fragmentId: fragLlamaAmorViva.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(llamaAmorVivaText, "¡Oh llama de amor viva"),
        order: 2,
        content: `**Apóstrofe acumulativo**: casi todas las estrofas se abren con una o varias exclamaciones «¡Oh...!» dirigidas a la llama, al cauterio, a la llaga, a la lámpara. Esta acumulación de invocaciones traduce, en la forma misma del poema, el desbordamiento emocional que describe.`,
      },
      {
        fragmentId: fragLlamaAmorViva.id,
        type: "figura",
        category: "tropo",
        ...anchor(llamaAmorVivaText, "las profundas cavernas del sentido"),
        order: 3,
        content: `**Metáfora espacial**: el interior del alma se imagina como unas «cavernas» profundas y oscuras que la «lámpara de fuego» —la acción de Dios— ilumina y calienta, una imagen de hondura que recuerda los espacios subterráneos de «Noche oscura».`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragLlamaAmorViva.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `Busca en el poema al menos cuatro palabras relacionadas con el fuego o el calor, y otras dos relacionadas con la herida. ¿Qué efecto produce mezclar ambos campos?`,
      },
      {
        fragmentId: fragLlamaAmorViva.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El verso «Matando, muerte en vida la has trocado» es una paradoja. ¿Qué «muerte» y qué «vida» están en juego: la del cuerpo, o alguna otra?`,
      },

      // Intertextualidad
      {
        fragmentId: fragLlamaAmorViva.id,
        type: "intertextualidad",
        ...anchor(llamaAmorVivaText, "Matando, muerte en vida la has trocado"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragVivoSinVivir.id,
        content: `Santa Teresa de Jesús construye todo un poema sobre la misma paradoja —«vivo sin vivir en mí... que muero porque no muero»—. Ambos místicos recurren a la fórmula de la muerte que da vida para describir el mismo estado de unión con Dios.`,
      },
      {
        fragmentId: fragLlamaAmorViva.id,
        type: "intertextualidad",
        ...anchor(llamaAmorVivaText, "donde secretamente solo moras"),
        order: 2,
        linkType: "internal",
        linkTargetFragmentId: fragNocheOscura.id,
        content: `«Llama de amor viva» describe el estado posterior a la unión que «Noche oscura» relata como un camino: si en aquel poema el alma salía «en secreto» a buscar a su Amado, aquí ya no hay salida ni búsqueda, sino una presencia que «secretamente solo mora» en el interior del alma.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — La vida retirada
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «La vida retirada»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragVidaRetirada.id,
        type: "glosa",
        ...anchor(vidaRetiradaText, "sabio moro"),
        order: 1,
        content: `Alude a la maestría de los arquitectos árabes en la construcción de techumbres ricamente decoradas: fray Luis evoca el lujo de los techos artesonados de tradición mudéjar, frecuentes en palacios y casas nobles de la España del siglo XVI, para describir lo que rechaza.`,
      },
      {
        fragmentId: fragVidaRetirada.id,
        type: "glosa",
        ...anchor(vidaRetiradaText, "deste viento"),
        order: 2,
        content: `«Este viento» se refiere a la fama: algo intangible, mudable y, en el fondo, vacío —todo lo contrario de la solidez y la paz que el poeta busca en la vida retirada.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragVidaRetirada.id,
        type: "contexto",
        ...anchor(vidaRetiradaText, "Qué descansada vida"),
        order: 1,
        content: `El poema desarrolla el tópico clásico del «beatus ille» («dichoso aquel»), formulado por Horacio en su Épodo II: la alabanza de quien vive alejado de los negocios y ambiciones de la ciudad. Fray Luis, fraile agustino y catedrático en la Universidad de Salamanca, adapta este ideal pagano a un anhelo de recogimiento y vida interior cristianos.`,
      },
      {
        fragmentId: fragVidaRetirada.id,
        type: "contexto",
        ...anchor(vidaRetiradaText, "los pocos sabios que en el mundo han sido"),
        order: 2,
        content: `Fray Luis escribió estos versos antes de su proceso inquisitorial, pero el rechazo de la fama y de «la lengua lisonjera» —que aquí podría parecer un simple tópico literario— resultaría premonitorio: pocos años después fue denunciado y pasó casi cinco años encarcelado en Valladolid.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragVidaRetirada.id,
        type: "figura",
        category: "sonoro",
        ...anchor(vidaRetiradaText, "rüido"),
        order: 1,
        content: `**Diéresis**: «rüido» se pronuncia aquí en tres sílabas (ru-í-do) en lugar de dos, deshaciendo el diptongo para ajustar el verso a su medida. Es un recurso métrico habitual en la poesía del Siglo de Oro.`,
      },
      {
        fragmentId: fragVidaRetirada.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(
          vidaRetiradaText,
          "No cura si la fama\ncanta con voz su nombre pregonera,\nni cura si encarama\nla lengua lisonjera\nlo que condena la verdad sincera."
        ),
        order: 2,
        content: `**Anáfora y paralelismo**: la estrofa se construye repitiendo el verbo «curar» en sentido negativo («No cura»... «ni cura»...), y el poema entero encadena así, estrofa a estrofa, todo aquello de lo que el poeta declara no depender: la fama, la opinión, el juicio ajeno.`,
      },
      {
        fragmentId: fragVidaRetirada.id,
        type: "figura",
        category: "tropo",
        ...anchor(vidaRetiradaText, "del vano dedo señalado"),
        order: 3,
        content: `**Sinécdoque**: «el vano dedo» representa, por la parte, a quienes señalan y juzgan socialmente —la opinión pública, la fama— de la que el poeta quiere desligarse.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragVidaRetirada.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `Según estas estrofas, ¿qué cosas no le importan ni le preocupan a la voz poética? Cita al menos tres ejemplos del texto.`,
      },
      {
        fragmentId: fragVidaRetirada.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El poema desarrolla el tópico del «beatus ille», de origen pagano (Horacio), pero fray Luis era un fraile agustino. ¿Cómo se concilian aquí el ideal clásico de retiro campestre y la espiritualidad cristiana?`,
      },

      // Intertextualidad
      {
        fragmentId: fragVidaRetirada.id,
        type: "intertextualidad",
        ...anchor(vidaRetiradaText, "huye el mundanal rüido"),
        order: 1,
        linkType: "external",
        externalCitation: `Horacio, Epodo II, v. 1: "Beatus ille qui procul negotiis..." ("Dichoso aquel que, lejos de los negocios...").`,
        content: `El tópico del «beatus ille» procede del Épodo II de Horacio, ampliamente traducido e imitado en el Renacimiento. Fray Luis no traduce literalmente a Horacio, pero parte de la misma oposición entre la vida ambiciosa de la ciudad y la paz del campo.`,
      },
      {
        fragmentId: fragVidaRetirada.id,
        type: "intertextualidad",
        ...anchor(vidaRetiradaText, "con ansias vivas, con mortal cuidado"),
        order: 2,
        linkType: "internal",
        linkTargetFragmentId: fragSalidaCarcel.id,
        content: `Años más tarde, ya liberado de la cárcel inquisitorial, fray Luis volvería sobre esta misma idea —vivir ajeno al juicio de los demás— en un poema breve donde formula, en clave autobiográfica, lo que aquí se plantea como ideal: «ni envidiado ni envidioso».`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — En la Ascensión
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «En la Ascensión»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragAscension.id,
        type: "glosa",
        ...anchor(ascensionText, "tu grey"),
        order: 1,
        content: `«Grey» significa rebaño: fray Luis se refiere metafóricamente a los hombres, los fieles, que Cristo —el «Pastor santo»— deja huérfanos al ascender a los cielos.`,
      },
      {
        fragmentId: fragAscension.id,
        type: "glosa",
        ...anchor(ascensionText, "¿a dó convertirán"),
        order: 2,
        content: `«Dó» es forma apocopada de «adónde», muy frecuente en la poesía del Siglo de Oro.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragAscension.id,
        type: "contexto",
        ...anchor(ascensionText, "Pastor santo"),
        order: 1,
        content: `La Ascensión —la subida de Cristo al cielo, cuarenta días después de la Resurrección— es una de las grandes fiestas del calendario cristiano. Fray Luis la convierte aquí en una despedida dolorosa, recurriendo a la imagen bíblica del Buen Pastor que abandona a su rebaño.`,
      },
      {
        fragmentId: fragAscension.id,
        type: "contexto",
        ...anchor(ascensionText, "¿qué norte guiará la nave al puerto?"),
        order: 2,
        content: `«Norte» significa aquí estrella polar, el punto de referencia que orienta a los navegantes. Sin la guía de Cristo, la humanidad queda como una nave que ha perdido su norte: la imagen recoge una larga tradición de la navegación como metáfora de la vida y de la fe.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragAscension.id,
        type: "figura",
        category: "tropo",
        ...anchor(ascensionText, "Pastor santo,\ntu grey"),
        order: 1,
        content: `**Metáfora pastoril**: Cristo como Pastor y los creyentes como rebaño («grey») es una de las imágenes bíblicas más extendidas (Salmo 23, parábola del Buen Pastor). Fray Luis la recupera para expresar el desamparo de quienes quedan «sin pastor».`,
      },
      {
        fragmentId: fragAscension.id,
        type: "figura",
        category: "tropo",
        ...anchor(ascensionText, "Aqueste mar turbado"),
        order: 2,
        content: `**Alegoría náutica**: la vida humana sin la guía de Cristo se representa como una nave perdida en un mar agitado («mar turbado», «viento fiero, airado»), sin «norte» que la conduzca a puerto.`,
      },
      {
        fragmentId: fragAscension.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(
          ascensionText,
          "¿quién le pondrá freno? ¿Quién concierto\nal viento fiero, airado?"
        ),
        order: 3,
        content: `**Interrogación retórica**: el poema entero se construye mediante preguntas que no esperan respuesta, sino que expresan, por acumulación, el desconcierto y el desamparo de quienes quedan «en este valle hondo, escuro» sin la guía de Cristo.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragAscension.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Qué dos campos de imágenes —uno pastoril y otro marinero— utiliza el poeta para describir la situación de los hombres tras la marcha de Cristo? Señala al menos un ejemplo de cada uno.`,
      },
      {
        fragmentId: fragAscension.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `La última estrofa se dirige a una nube y la acusa, casi con celos, de «robar» a Cristo de la vista de los hombres. ¿Te parece eficaz este recurso para expresar el dolor de la ausencia? ¿Por qué?`,
      },

      // Intertextualidad
      {
        fragmentId: fragAscension.id,
        type: "intertextualidad",
        ...anchor(ascensionText, "con soledad y llanto"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragNocheOscura.id,
        content: `San Juan de la Cruz también escribe sobre la noche y la soledad, pero en su poema esa noche es deseada: un camino hacia el encuentro con Dios. En «En la Ascensión», en cambio, la soledad y el «valle hondo, escuro» son consecuencia de una pérdida: la marcha de Cristo deja a los hombres sin guía.`,
      },
      {
        fragmentId: fragAscension.id,
        type: "intertextualidad",
        ...anchor(
          ascensionText,
          "¡Ay!, nube, envidiosa\naun de este breve gozo, ¿qué te aquejas?"
        ),
        order: 2,
        linkType: "external",
        externalCitation: `Hechos de los Apóstoles 1, 9: "Y dicho esto, fue alzado a los cielos viéndolo ellos, y una nube le ocultó de sus ojos."`,
        content: `El relato bíblico de la Ascensión menciona que una nube ocultó a Cristo de la vista de los apóstoles. Fray Luis recoge ese detalle y lo convierte en el destinatario de un reproche casi celoso: la nube «envidiosa» que se lleva, ella sola, la última visión de Cristo.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Noche serena
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Noche serena»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragNocheSerena.id,
        type: "glosa",
        ...anchor(nocheSerenaText, "despiden larga vena"),
        order: 1,
        content: `«Vena» se usa aquí en sentido metafórico: el llanto, como un caudal de agua que brota de unos ojos convertidos en fuente.`,
      },
      {
        fragmentId: fragNocheSerena.id,
        type: "glosa",
        ...anchor(nocheSerenaText, "mi alma que a tu alteza"),
        order: 2,
        content: `«Alteza» significa aquí grandeza, condición elevada: el alma reconoce haber nacido para una grandeza —la del cielo al que se dirige— muy superior a la miseria en que se encuentra en la tierra.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragNocheSerena.id,
        type: "contexto",
        ...anchor(nocheSerenaText, "Cuando contemplo el cielo"),
        order: 1,
        content: `«Noche serena» pertenece al género de la poesía contemplativa: la observación del cielo nocturno —su orden, su inmensidad— como punto de partida para una reflexión sobre el lugar del alma en el mundo. Fray Luis dedicó este poema a un amigo, el músico Diego Bernal de Olarte.`,
      },
      {
        fragmentId: fragNocheSerena.id,
        type: "contexto",
        ...anchor(nocheSerenaText, "esta cárcel, baja, oscura"),
        order: 2,
        content: `La imagen del cuerpo y del mundo como una «cárcel» del alma tiene una larga tradición: aparece ya en Platón, que comparaba el cuerpo con una tumba, y en san Pablo, que hablaba de liberarse «de este cuerpo de muerte». Fray Luis la hace suya para expresar el contraste entre la patria celeste del alma y su morada terrenal.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragNocheSerena.id,
        type: "figura",
        category: "tropo",
        ...anchor(
          nocheSerenaText,
          "«Morada de grandeza,\ntemplo de claridad y de hermosura:\nmi alma que a tu alteza\nnació, ¡qué desventura\nla tiene en esta cárcel, baja, oscura!"
        ),
        order: 1,
        content: `**Antítesis**: el «templo de claridad y hermosura» al que el alma «nació» se opone punto por punto a la «cárcel, baja, oscura» en que vive. Toda la estrofa se construye sobre este contraste entre la patria celeste y la prisión terrenal.`,
      },
      {
        fragmentId: fragNocheSerena.id,
        type: "figura",
        category: "sonoro",
        ...anchor(
          nocheSerenaText,
          "Cuando contemplo el cielo\nde innumerables luces adornado"
        ),
        order: 2,
        content: `**La lira**: el poema está escrito, como «Noche oscura» de San Juan de la Cruz, en liras —estrofas de cinco versos (7, 11, 7, 7 y 11 sílabas) con rima aBabB—, una forma introducida por Garcilaso de la Vega que se convirtió en el molde preferido de la poesía contemplativa y mística del siglo XVI.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragNocheSerena.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `En la primera estrofa, ¿qué dos lugares contempla la voz poética, y en qué orden los mira?`,
      },
      {
        fragmentId: fragNocheSerena.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El alma llama al cielo «morada de grandeza» y se lamenta de estar «en esta cárcel, baja, oscura». ¿A qué dos realidades se refieren, respectivamente, el «cielo» y la «cárcel» en este poema?`,
      },

      // Intertextualidad
      {
        fragmentId: fragNocheSerena.id,
        type: "intertextualidad",
        ...anchor(nocheSerenaText, "en sueño y en olvido sepultado"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragVivoSinVivir.id,
        content: `Santa Teresa de Jesús expresa una nostalgia semejante de la patria verdadera mediante la paradoja «vivo sin vivir en mí... que muero porque no muero»: en ambos poemas, la vida terrenal se vive como una forma de muerte o de sueño, y solo la unión con Dios —la «morada de grandeza»— se siente como vida plena.`,
      },
      {
        fragmentId: fragNocheSerena.id,
        type: "intertextualidad",
        ...anchor(
          nocheSerenaText,
          "el amor y la pena\ndespiertan en mi pecho un ansia ardiente"
        ),
        order: 2,
        linkType: "internal",
        linkTargetFragmentId: fragVidaRetirada.id,
        content: `La misma voz que aquí anhela escapar de «esta cárcel, baja, oscura» había imaginado, en «La vida retirada», un huerto apartado «a vuestro almo reposo»: dos maneras —una terrena, otra celeste— de huir «de aqueste mar tempestuoso» del mundo.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — A la salida de la cárcel
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «A la salida de la cárcel»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragSalidaCarcel.id,
        type: "glosa",
        ...anchor(carcelText, "con solo Dios se compasa"),
        order: 1,
        content: `«Compasarse» es ajustarse, medirse, como con un compás: el sabio retirado solo se atiene a la voluntad de Dios, sin otra medida ni autoridad.`,
      },
      {
        fragmentId: fragSalidaCarcel.id,
        type: "glosa",
        ...anchor(carcelText, "de aqueste mundo malvado"),
        order: 2,
        content: `«Aqueste» es forma arcaica de «este», muy frecuente en la poesía del Siglo de Oro (cf. «Aquesta», en «Noche oscura» de San Juan de la Cruz).`,
      },

      // Contextualización histórica
      {
        fragmentId: fragSalidaCarcel.id,
        type: "contexto",
        ...anchor(carcelText, "Aquí la envidia y mentira\nme tuvieron encerrado."),
        order: 1,
        content: `Los enemigos de fray Luis lo acusaron ante la Inquisición de haber traducido el Cantar de los cantares, infringiendo la prohibición de traducir la Biblia al castellano. Estas acusaciones le costaron casi cinco años de cárcel en Valladolid, aunque al final quedó absuelto.`,
      },
      {
        fragmentId: fragSalidaCarcel.id,
        type: "contexto",
        ...anchor(carcelText, "y a solas su vida pasa"),
        order: 2,
        content: `Frente a la extensión y la elaboración de odas como «La vida retirada» o «Noche serena», este poema breve, de versos octosílabos, tiene un tono más directo y personal: parece una declaración escrita de un solo trazo, a la salida misma de la prisión.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragSalidaCarcel.id,
        type: "figura",
        category: "tropo",
        ...anchor(carcelText, "la envidia y mentira\nme tuvieron encerrado"),
        order: 1,
        content: `**Personificación**: no son los jueces ni la Inquisición, sino dos vicios abstractos —«la envidia y mentira»— los que «tuvieron encerrado» al poeta. La culpa se traslada así de las personas concretas a las pasiones que las mueven.`,
      },
      {
        fragmentId: fragSalidaCarcel.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(carcelText, "ni envidiado ni envidioso"),
        order: 2,
        content: `**Políptoton**: «envidiado» y «envidioso» comparten raíz pero invierten el papel —quien sufre la envidia frente a quien la siente—, y la negación doble («ni... ni...») cierra el poema con la imagen de una vida completamente ajena a esa pasión, en cualquiera de sus dos direcciones.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragSalidaCarcel.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `Según el poema, ¿quiénes son los verdaderos responsables del encierro del poeta? ¿Coincide esto con lo que sabes de su biografía?`,
      },
      {
        fragmentId: fragSalidaCarcel.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `El poema convierte una experiencia dolorosa —casi cinco años de cárcel injusta— en una declaración serena sobre la vida retirada, sin rastro de rencor explícito. ¿Qué efecto produce en ti este tono?`,
      },

      // Intertextualidad
      {
        fragmentId: fragSalidaCarcel.id,
        type: "intertextualidad",
        ...anchor(carcelText, "Aquí la envidia y mentira"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragNocheSerena.id,
        content: `La «cárcel» de este poema es literal —la prisión de la Inquisición—, pero fray Luis usa la misma palabra en sentido figurado en «Noche serena» para describir el cuerpo y el mundo como «cárcel, baja, oscura» del alma. La experiencia personal y la imagen mística se iluminan mutuamente.`,
      },
      {
        fragmentId: fragSalidaCarcel.id,
        type: "intertextualidad",
        ...anchor(carcelText, "Dichoso el humilde estado\ndel sabio que se retira"),
        order: 2,
        linkType: "external",
        externalCitation: `Boecio, De consolatione philosophiae (s. VI): tratado filosófico escrito en prisión, mientras su autor esperaba ser ejecutado.`,
        content: `Fray Luis se suma a una larga tradición de sabios que escriben sus reflexiones más serenas precisamente desde la cárcel, como Boecio en su «Consolación de la filosofía»: la prisión del cuerpo no impide, e incluso parece favorecer, la libertad del pensamiento.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Mientras por competir con tu cabello
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Mientras por competir con tu cabello»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragGongora.id,
        type: "glosa",
        ...anchor(gongoraText, "lilio"),
        order: 1,
        content: `Lirio o azucena, flor blanca; cultismo (del latín *lilium*) habitual en la poesía petrarquista para describir la blancura de la piel o de la frente femeninas.`,
      },
      {
        fragmentId: fragGongora.id,
        type: "glosa",
        ...anchor(gongoraText, "vïola troncada"),
        order: 2,
        content: `«Violeta cortada». La diéresis marcada sobre la «ï» (vï-o-la) indica que la palabra debe pronunciarse en tres sílabas, no en dos, para que el verso mantenga sus once sílabas.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragGongora.id,
        type: "contexto",
        ...anchor(gongoraText, "Mientras por competir con tu cabello"),
        order: 1,
        content: `Este soneto reescribe, casi verso a verso, el soneto XXIII de Garcilaso de la Vega («En tanto que de rosa y de azucena...»). Góngora toma su estructura —una serie de comparaciones florales y minerales seguida de una invitación a gozar de la juventud— y la lleva a una conclusión mucho más sombría.`,
      },
      {
        fragmentId: fragGongora.id,
        type: "contexto",
        ...anchor(gongoraText, "en tierra, en humo, en polvo, en sombra, en nada"),
        order: 2,
        content: `Este verso final es uno de los más citados de toda la poesía barroca española como expresión del «desengaño»: la conciencia de que la belleza, los bienes y la propia vida son enteramente pasajeros.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragGongora.id,
        type: "figura",
        category: "tropo",
        ...anchor(gongoraText, "oro, lilio, clavel, cristal luciente"),
        order: 1,
        content: `**Correlación**: cada elemento de esta lista corresponde, en el mismo orden, a un rasgo físico mencionado antes —el cabello (oro), la frente (lilio), los labios (clavel) y el cuello (cristal)—. La correlación es una de las figuras predilectas del culteranismo gongorino.`,
      },
      {
        fragmentId: fragGongora.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(gongoraText, "en tierra, en humo, en polvo, en sombra, en nada"),
        order: 2,
        content: `**Gradación y asíndeton**: cinco términos sin conjunciones, cada vez más inmateriales —de la tierra a la nada—, aceleran el verso hacia su desaparición final. La falta de conjunciones imita la rapidez con que, según el poema, todo se desvanece.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragGongora.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Con qué elementos de la naturaleza se compara el cabello, la frente, los labios y el cuello de la persona a la que se dirige el soneto? ¿Qué pide el poema que se haga con ellos «mientras» dure esa «edad dorada»?`,
      },
      {
        fragmentId: fragGongora.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El soneto XXIII de Garcilaso, que este poema reescribe, termina pidiendo que se goce la juventud «antes que... la edad la cubra de nieve». Góngora termina con «en tierra, en humo, en polvo, en sombra, en nada». ¿Qué diferencia hay entre estos dos finales, y qué efecto produce cada uno?`,
      },

      // Intertextualidad
      {
        fragmentId: fragGongora.id,
        type: "intertextualidad",
        ...anchor(gongoraText, "goza cuello, cabello, labio y frente"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragSoneto.id,
        content: `Este verso retoma casi literalmente el «coged de vuestra alegre primavera» del soneto XXIII de Garcilaso, que da nombre al tópico del *carpe diem*. Góngora comparte con Garcilaso la invitación a gozar del presente, pero no su esperanza: aquí no hay «dulce fruto» que recoger, solo la nada que se avecina.`,
      },
      {
        fragmentId: fragGongora.id,
        type: "intertextualidad",
        ...anchor(gongoraText, "en polvo"),
        order: 2,
        linkType: "internal",
        linkTargetFragmentId: fragAmorConstante.id,
        content: `Pocas décadas después, Quevedo —rival declarado de Góngora— recurrirá también al «polvo» para describir el final del cuerpo amado, pero le dará la vuelta: si para Góngora todo termina «en tierra, en humo, en polvo, en sombra, en nada», para Quevedo ese polvo seguirá «enamorado».`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Desmayarse, atreverse, estar furioso
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Desmayarse, atreverse, estar furioso»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragDesmayarse.id,
        type: "glosa",
        ...anchor(desmayarseText, "esquivo"),
        order: 1,
        content: `Huidizo, que evita el trato con los demás. Es una de las muchas contradicciones que el soneto atribuye al amor: en el mismo verso, «áspero» y «tierno», «liberal» y «esquivo».`,
      },
      {
        fragmentId: fragDesmayarse.id,
        type: "glosa",
        ...anchor(desmayarseText, "desengaño"),
        order: 2,
        content: `Pérdida de una ilusión; descubrimiento de que algo en lo que se creía no era real. Concepto central de la mentalidad barroca, que aquí se aplica también a las propias promesas del amor.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragDesmayarse.id,
        type: "contexto",
        ...anchor(desmayarseText, "Desmayarse, atreverse, estar furioso"),
        order: 1,
        content: `Definir el amor mediante una larga lista de estados contradictorios era un procedimiento muy extendido en la poesía petrarquista europea, con un modelo especialmente influyente: el soneto 134 de Petrarca, «Pace non trovo, e non ò da far guerra» («No hallo paz, y no tengo por qué hacer la guerra»).`,
      },
      {
        fragmentId: fragDesmayarse.id,
        type: "contexto",
        ...anchor(desmayarseText, "esto es amor, quien lo probó lo sabe"),
        order: 2,
        content: `El último verso funciona como una sentencia o moraleja que cierra de golpe toda la enumeración anterior: tras catorce versos de contradicciones, la única «definición» que se ofrece es que el amor solo se entiende viviéndolo.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragDesmayarse.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(desmayarseText, "Desmayarse, atreverse, estar furioso,\náspero, tierno, liberal, esquivo"),
        order: 1,
        content: `**Enumeración caótica y asíndeton**: una larga lista de infinitivos y adjetivos contradictorios se acumula sin apenas conjunciones, verso tras verso, hasta ocupar casi todo el soneto. La falta de orden lógico imita el desorden que el propio amor produce.`,
      },
      {
        fragmentId: fragDesmayarse.id,
        type: "figura",
        category: "tropo",
        ...anchor(desmayarseText, "creer que un cielo en un infierno cabe"),
        order: 2,
        content: `**Paradoja / oxímoron**: un «cielo» dentro de un «infierno» es, literalmente, imposible. El verso resume en una sola imagen la idea central del soneto: el amor hace creer cosas que la razón no puede aceptar.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragDesmayarse.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Cuántos estados de ánimo o actitudes distintas se atribuyen al amor en este soneto? ¿Qué tienen en común casi todos ellos entre sí?`,
      },
      {
        fragmentId: fragDesmayarse.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El soneto no ofrece ninguna definición «positiva» del amor hasta el último verso. ¿Qué efecto produce esa larga acumulación de contrarios, y por qué crees que Lope reserva la única afirmación clara —«esto es amor»— para el final?`,
      },

      // Intertextualidad
      {
        fragmentId: fragDesmayarse.id,
        type: "intertextualidad",
        ...anchor(desmayarseText, "atreverse"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragConjuro.id,
        content: `El «atreverse» de este soneto recuerda al atrevimiento de Calisto en *La Celestina*: es su osadía al enamorarse de Melibea, y al recurrir a la hechicería para conseguirla, lo que pone en marcha toda la tragedia. Lope convierte en definición general del amor lo que en *La Celestina* era el motor concreto de una trama.`,
      },
      {
        fragmentId: fragDesmayarse.id,
        type: "intertextualidad",
        ...anchor(desmayarseText, "no hallar fuera del bien centro y reposo"),
        order: 2,
        linkType: "external",
        externalCitation: `Petrarca, Rerum vulgarium fragmenta, soneto 134: «Pace non trovo, e non ò da far guerra...».`,
        content: `El modelo de este soneto es el 134 de Petrarca, que enumera de forma muy parecida una serie de estados contradictorios provocados por el amor —«no hallo paz... ardo y soy de hielo»—. La fórmula tuvo una enorme fortuna en toda la lírica petrarquista europea, de la que Lope es uno de los herederos más célebres en español.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Amor constante más allá de la muerte
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Amor constante más allá de la muerte»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragAmorConstante.id,
        type: "glosa",
        ...anchor(amorConstanteText, "esotra parte"),
        order: 1,
        content: `Contracción de «esa otra parte»: la otra orilla, el más allá de la muerte.`,
      },
      {
        fragmentId: fragAmorConstante.id,
        type: "glosa",
        ...anchor(amorConstanteText, "medulas"),
        order: 2,
        content: `Médulas: lo más íntimo, profundo y esencial de un ser, más allá de la carne y los huesos.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragAmorConstante.id,
        type: "contexto",
        ...anchor(amorConstanteText, "Cerrar podrá mis ojos la postrera"),
        order: 1,
        content: `Este soneto pertenece al grupo de poemas amorosos «metafísicos» de Quevedo, publicados de forma póstuma en *El Parnaso español* (1648), en los que el amor se piensa como una fuerza capaz de resistir incluso a la disolución del cuerpo.`,
      },
      {
        fragmentId: fragAmorConstante.id,
        type: "contexto",
        ...anchor(amorConstanteText, "polvo serán, mas polvo enamorado"),
        order: 2,
        content: `Es el verso más citado de Quevedo y uno de los más célebres de la poesía española. Frente al tópico barroco del «memento mori» —recuerda que vas a morir, y que todo acaba en polvo—, este final no niega la muerte, pero le opone algo que, según el poema, sobrevivirá a ella.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragAmorConstante.id,
        type: "figura",
        category: "tropo",
        ...anchor(amorConstanteText, "nadar sabe mi llama la agua fría"),
        order: 1,
        content: `**Paradoja**: una llama —que el agua debería apagar— «sabe nadar» en agua fría. La imagen condensa la idea central del soneto: el amor (el fuego) sobrevive precisamente en el elemento que debería destruirlo (el agua de la muerte).`,
      },
      {
        fragmentId: fragAmorConstante.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(amorConstanteText, "serán ceniza, mas tendrá sentido;\npolvo serán, mas polvo enamorado"),
        order: 2,
        content: `**Estructura bimembre con «mas»**: los dos últimos versos repiten el mismo esquema —una afirmación sobre lo que «será» el cuerpo, seguida de «mas» y una matización que lo desmiente en parte—. Esta simetría final concentra todo el argumento del soneto en dos versos casi idénticos en su construcción.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragAmorConstante.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `Según el primer cuarteto, ¿qué es lo único que la muerte («la postrera / sombra») podrá hacerle a la voz poética? Según el resto del soneto, ¿qué es lo que la muerte no podrá llevarse?`,
      },
      {
        fragmentId: fragAmorConstante.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El último verso combina dos palabras que normalmente no van juntas: «polvo» (lo que queda del cuerpo tras la muerte) y «enamorado» (un sentimiento, algo vivo). ¿Qué consigue Quevedo con esta combinación, y qué dice sobre la relación entre el cuerpo, el alma y el amor?`,
      },

      // Intertextualidad
      {
        fragmentId: fragAmorConstante.id,
        type: "intertextualidad",
        ...anchor(amorConstanteText, "polvo"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragGongora.id,
        content: `Góngora, rival literario de Quevedo, usa también la palabra «polvo» para describir el destino final de la belleza, pero como parte de una secuencia que termina «en nada». Dos poetas enfrentados llegan a la misma imagen del cuerpo deshecho —el polvo— y le dan sentidos casi opuestos.`,
      },
      {
        fragmentId: fragAmorConstante.id,
        type: "intertextualidad",
        ...anchor(amorConstanteText, "su cuerpo dejará, no su cuidado"),
        order: 2,
        linkType: "external",
        externalCitation: `Propercio, Elegías, I, 19: incluso convertido en cenizas, el poeta seguirá sintiendo el «ardor» de su amor.`,
        content: `La idea de un amor que sobrevive a la propia muerte tiene un precedente clásico en la elegía romana: el poeta Propercio escribió que, ya convertido en cenizas, seguiría sintiendo el ardor de su amor. Quevedo, gran lector de los clásicos, recoge y lleva al límite esa misma idea.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Canto a Teresa
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Canto a Teresa»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragCantoTeresa.id,
        type: "glosa",
        ...anchor(cantoTeresaText, "hiel"),
        order: 1,
        content: `Sustancia amarga (la bilis); en sentido figurado, amargura o resentimiento profundos, sin alivio.`,
      },
      {
        fragmentId: fragCantoTeresa.id,
        type: "glosa",
        ...anchor(cantoTeresaText, "anegan"),
        order: 2,
        content: `Inundan, ahogan por completo (del verbo «anegar»). Las lágrimas no consuelan: sumergen.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragCantoTeresa.id,
        type: "contexto",
        ...anchor(cantoTeresaText, "¿Por qué volvéis a la memoria mía"),
        order: 1,
        content: `El «Canto a Teresa» interrumpe la narración de *El diablo mundo* para dar paso a una elegía autobiográfica: Espronceda evoca aquí a Teresa Mancha, su antigua amante, fallecida poco antes de que escribiera estos versos.`,
      },
      {
        fragmentId: fragCantoTeresa.id,
        type: "contexto",
        ...anchor(cantoTeresaText, "Imágenes de oro bullidoras"),
        order: 2,
        content: `El contraste entre un pasado idealizado —descrito con imágenes de luz, música y oro— y un presente de angustia y vacío es uno de los esquemas más característicos de la elegía romántica, que Espronceda despliega aquí en toda su intensidad.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragCantoTeresa.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(cantoTeresaText, "¿Por qué volvéis a la memoria mía"),
        order: 1,
        content: `**Pregunta retórica apostrófica**: el poema se abre dirigiéndose directamente a los «recuerdos», como si pudieran responder. Esta apóstrofe inicial marca el tono elegíaco de todo el fragmento.`,
      },
      {
        fragmentId: fragCantoTeresa.id,
        type: "figura",
        category: "tropo",
        ...anchor(cantoTeresaText, "Imágenes de oro bullidoras,\nsus alas de carmín y nieve pura"),
        order: 2,
        content: `**Personificación**: los recuerdos felices se convierten en figuras aladas, doradas, que «pasaban cantando» alrededor del poeta. El pasado se representa como una presencia casi física que ahora ha desaparecido.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragCantoTeresa.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿A quién o a qué se dirige la voz poética al principio de este fragmento? ¿Qué sentimientos le provoca el recuerdo de aquellas horas pasadas?`,
      },
      {
        fragmentId: fragCantoTeresa.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `Estas dos octavas contraponen un pasado descrito con imágenes de luz, música y oro a un presente de «ansiedad», «agonía» y «llanto». ¿Qué efecto produce este contraste, y qué rasgos del Romanticismo reconoces en él?`,
      },

      // Intertextualidad
      {
        fragmentId: fragCantoTeresa.id,
        type: "intertextualidad",
        ...anchor(cantoTeresaText, "aquellas horas"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragRima.id,
        content: `Unas décadas después, Bécquer abrirá su Rima LIII con una pregunta de estructura muy parecida —las golondrinas y las madreselvas «volverán», pero «esas... ¡no volverán!»— para lamentar también la irrepetibilidad de un amor pasado. Ambos poemas comparten esa mirada hacia un tiempo feliz que ya no puede regresar.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Negra sombra
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Negra sombra»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragNegraSombra.id,
        type: "glosa",
        ...anchor(negraSombraText, "asombras"),
        order: 1,
        content: `Del gallego «asombrar»: dar sombra, pero también asustar. El doble sentido —sombra física y miedo— recorre todo el poema, desde su primer hasta su último verso.`,
      },
      {
        fragmentId: fragNegraSombra.id,
        type: "glosa",
        ...anchor(negraSombraText, "moras"),
        order: 2,
        content: `Del verbo «morar»: habitar, vivir en un lugar. La sombra no está fuera: «mora», vive, dentro de la propia voz poética.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragNegraSombra.id,
        type: "contexto",
        ...anchor(negraSombraText, "Cando penso que te fuches"),
        order: 1,
        content: `«Negra sombra» pertenece a *Follas novas* (1880), el segundo gran poemario en gallego de Rosalía de Castro y una de las obras centrales del Rexurdimento, el movimiento de recuperación de la literatura en esa lengua durante el siglo XIX.`,
      },
      {
        fragmentId: fragNegraSombra.id,
        type: "contexto",
        ...anchor(negraSombraText, "i eres a estrela que brila"),
        order: 2,
        content: `«Negra sombra» es uno de los poemas más versionados musicalmente de toda la lírica gallega, desde adaptaciones corales del siglo XX hasta versiones de grupos de folk y rock contemporáneos, lo que ha convertido sus versos en parte del imaginario cultural de Galicia.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragNegraSombra.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(negraSombraText, "Si cantan, es ti que cantas,\nsi choran, es ti que choras"),
        order: 1,
        content: `**Paralelismo y anáfora**: la misma estructura («si... es ti que...») se repite con términos opuestos —cantar/llorar—, y se extiende en la estrofa siguiente a otros pares (río/noche, noche/aurora). La sombra se identifica con todo, incluso con los contrarios.`,
      },
      {
        fragmentId: fragNegraSombra.id,
        type: "figura",
        category: "tropo",
        ...anchor(negraSombraText, "En todo estás e ti es todo"),
        order: 2,
        content: `**Paradoja / quiasmo**: el verso invierte sus propios términos —«estás en todo» / «eres todo»— para decir, en realidad, lo mismo dos veces. La sombra no es una parte del mundo de la voz poética: es indistinguible de él.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragNegraSombra.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `Según la última estrofa, ¿dónde está la sombra y dónde «mora»? ¿Puede la voz poética separarse de ella en algún momento?`,
      },
      {
        fragmentId: fragNegraSombra.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El poema nunca dice explícitamente qué es la «negra sombra»: ¿un recuerdo, una persona perdida, la propia muerte, la melancolía misma? ¿Qué efecto produce esta falta de explicación, y qué interpretación te parece más convincente?`,
      },

      // Intertextualidad
      {
        fragmentId: fragNegraSombra.id,
        type: "intertextualidad",
        ...anchor(negraSombraText, "Cando penso que te fuches"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragOndas.id,
        content: `El itinerario que empezó con las preguntas de una voz gallega medieval —«Ondas do mar de Vigo, ¿se vistes meu amigo?»— termina con otra voz gallega, seis siglos después, que ya no espera ningún regreso: la «negra sombra» no se va nunca, está «en todo». De la ausencia que se espera a la presencia de la que no se puede escapar.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Itinerario «Nombrar el valor» — nuevos autores, obras y fragmentos
  // ---------------------------------------------------------------------
  console.log("Creando autores y obras de «Nombrar el valor»...");

  const anonimoRomancero = await prisma.author.create({
    data: {
      slug: "anonimo-romancero-viejo",
      name: "Anónimo (Romancero viejo)",
      country: "España",
      era: "Edad Media",
      bio: `El Romancero viejo agrupa los romances anónimos —poemas narrativos de versos octosílabos con rima asonante en los pares— que circularon oralmente, cantados por juglares y ciegos, desde la Baja Edad Media hasta su recopilación impresa en cancioneros y pliegos sueltos del siglo XVI. Los romances fronterizos, como el de Abenámar, dramatizan episodios de las últimas décadas de la Reconquista, cuando el reino nazarí de Granada era el único territorio musulmán que quedaba en la península.`,
      portraitUrl: "/images/authors/anonimo-romancero-viejo.png",
    },
  });

  const romancero = await prisma.work.create({
    data: {
      slug: "romancero-viejo",
      title: "Romancero viejo",
      year: 1450,
      era: "Edad Media",
      genre: "Poesía narrativa (romance)",
      synopsis: `Colección de romances anónimos de tradición oral, transmitidos de generación en generación y fijados por escrito solo a partir del siglo XVI. El «Romance de Abenámar» pertenece al grupo de los romances fronterizos: presenta un diálogo entre el rey castellano Juan II y un príncipe granadino que describe, uno a uno, los palacios de la Alhambra, y termina con la negativa de Granada —personificada como una dama casada— a aceptar la propuesta de matrimonio del rey.`,
      authorId: anonimoRomancero.id,
    },
  });

  console.log("Creando fragmentos de «Nombrar el valor»...");

  const abenamarText = `—¡Abenámar, Abenámar,
moro de la morería,
el día que tú naciste
grandes señales había!
Estaba la mar en calma,
la luna estaba crecida,
moro que en tal signo nace
no debe decir mentira.
Allí respondiera el moro,
bien oiréis lo que diría:
—Yo te la diré, señor,
aunque me cueste la vida,
porque soy hijo de un moro
y una cristiana cautiva;
siendo yo niño y muchacho
mi madre me lo decía
que mentira no dijese,
que era grande villanía;
por tanto pregunta, rey,
que la verdad te diría.
—Yo te agradezco, Abenámar,
aquesa tu cortesía.
¿Qué castillos son aquellos?
¡Altos son y relucían!
—El Alhambra era, señor,
y la otra la mezquita,
los otros los Alixares,
labrados a maravilla.
El moro que los labraba
cien doblas ganaba al día,
y el día que no los labra,
otras tantas se perdía.
El otro es Generalife,
huerta que par no tenía,
el otro Torres Bermejas,
castillo de gran valla.
Allí habló el rey don Juan,
bien oiréis lo que decía.
—Si tú quisieses, Granada,
contigo me casaría;
darete en arras y dote
a Córdoba y a Sevilla.
—Casada soy, rey don Juan,
casada soy, que no viuda;
el moro que a mí me tiene
muy grande bien me quería.`;

  const fragAbenamar = await prisma.fragment.create({
    data: {
      slug: "romance-de-abenamar",
      title: "Romance de Abenámar",
      location: "Romancero viejo (romances fronterizos)",
      headline: "Una ciudad que ya tiene marido",
      text: abenamarText,
      order: 1,
      status: "published",
      featured: false,
      workId: romancero.id,
      constellations: { connect: [{ slug: "honor-y-valor" }, { slug: "poder" }] },
      places: { connect: [{ slug: "granada" }] },
      artworkImageUrl:
        "/images/artworks/pradilla-rendicion-de-granada.jpg",
      artworkTitle: "La rendición de Granada",
      artworkAuthor: "Francisco Pradilla, 1882",
      artworkCaption:
        "El instante en que los Reyes Católicos reciben las llaves de Granada en 1492: la ciudad como objeto de deseo y de negociación entre dos mundos, la misma tensión —entre la conquista y la dignidad del vencido— que recorre el diálogo de este romance entre el rey don Juan y una Granada que responde con su propia voz.",
    },
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Romance de Abenámar
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones del «Romance de Abenámar»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragAbenamar.id,
        type: "glosa",
        ...anchor(abenamarText, "morería"),
        order: 1,
        content: `«Morería»: barrio o territorio habitado por musulmanes. Aquí, en sentido amplio, designa el reino nazarí de Granada, el último territorio musulmán de la península ibérica en el siglo XV.`,
      },
      {
        fragmentId: fragAbenamar.id,
        type: "glosa",
        ...anchor(abenamarText, "cien doblas"),
        order: 2,
        content: `«Doblas»: monedas de oro castellanas. El dato —lo que se gana o se pierde cada día según se trabaje o no en los palacios— da una idea del lujo y la riqueza que rodean a la Granada que describe Abenámar.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragAbenamar.id,
        type: "contexto",
        ...anchor(abenamarText, "—¡Abenámar, Abenámar,"),
        order: 1,
        content: `Este romance pertenece al grupo de los «romances fronterizos», anónimos, transmitidos oralmente y fijados por escrito solo en cancioneros del siglo XVI. Dramatizan episodios de las últimas décadas de la Reconquista: aquí, un encuentro —probablemente ficticio— entre el rey Juan II de Castilla (1406-1454) y un príncipe granadino llamado Abenámar.`,
      },
      {
        fragmentId: fragAbenamar.id,
        type: "contexto",
        ...anchor(abenamarText, "El Alhambra era, señor,"),
        order: 2,
        content: `La Alhambra, la mezquita, los Alixares, el Generalife y las Torres Bermejas son edificios reales del Granada nazarí, varios de ellos aún en pie. El romance convierte la respuesta de Abenámar en un recorrido casi turístico por la ciudad, antes de que el diálogo se desplace del paisaje a la política.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragAbenamar.id,
        type: "figura",
        category: "tropo",
        ...anchor(abenamarText, "Casada soy, rey don Juan,\ncasada soy, que no viuda"),
        order: 1,
        content: `**Prosopopeya (personificación)**: Granada deja de ser un lugar y se convierte en una mujer que habla en primera persona. Como una dama cortejada, responde que ya tiene marido y que le es fiel: la negociación entre dos reinos se cuenta como una negociación matrimonial.`,
      },
      {
        fragmentId: fragAbenamar.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(abenamarText, "Allí respondiera el moro,\nbien oiréis lo que diría"),
        order: 2,
        content: `**Fórmulas de transición dialogada**: variantes de «bien oiréis lo que diría/decía» introducen cada nueva intervención. Son marcas propias del romance oral, pensado para ser cantado y escuchado, no leído: el verso se dirige directamente a quien lo oye.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragAbenamar.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Qué le ofrece el rey don Juan a Granada si acepta casarse con él? ¿Qué responde ella, y con qué argumento?`,
      },
      {
        fragmentId: fragAbenamar.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `Granada responde como respondería una mujer casada y fiel ante una nueva proposición de matrimonio. ¿Qué efecto produce representar así a un reino o una ciudad? ¿Qué dice realmente esta respuesta sobre la relación entre los dos territorios?`,
      },

      // Intertextualidad
      {
        fragmentId: fragAbenamar.id,
        type: "intertextualidad",
        ...anchor(abenamarText, "Yo te la diré, señor,\naunque me cueste la vida"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragCid.id,
        content: `Abenámar jura decir la verdad «aunque me cueste la vida», fiel a lo que le enseñó su madre. Esa misma fidelidad a un código de honor, sostenida frente a quien tiene poder sobre la propia vida, es la que mueve al Cid del primer fragmento de este itinerario: decir la verdad, o mantenerse leal, cuando hacerlo no compensa.`,
      },
    ],
  });

  const anonimoLazarillo = await prisma.author.create({
    data: {
      slug: "anonimo-lazarillo-de-tormes",
      name: "Anónimo (Lazarillo de Tormes)",
      country: "España",
      era: "Renacimiento",
      bio: `«La vida de Lazarillo de Tormes y de sus fortunas y adversidades» se publicó en 1554, sin nombre de autor, en al menos tres ciudades a la vez (Burgos, Alcalá de Henares y Amberes). Desde entonces se ha atribuido a varios escritores —Diego Hurtado de Mendoza, fray Juan de Ortega, incluso Lope de Rueda— sin que ninguna atribución se haya impuesto: el anonimato pudo ser, además, una forma de protección frente a la dura crítica social y religiosa que contiene la obra. Está narrada en primera persona por el propio Lázaro, que cuenta su vida a un destinatario al que llama «Vuestra Merced», y funda con ella el molde de la novela picaresca.`,
      portraitUrl: "/images/authors/anonimo-lazarillo-de-tormes.png",
    },
  });

  const lazarillo = await prisma.work.create({
    data: {
      slug: "lazarillo-de-tormes",
      title: "La vida de Lazarillo de Tormes y de sus fortunas y adversidades",
      year: 1554,
      era: "Renacimiento",
      genre: "Novela picaresca",
      synopsis: `Lázaro, nacido junto al río Tormes en el seno de una familia muy pobre, narra en primera persona su infancia y juventud al servicio de una serie de amos —un ciego avariento, un clérigo mezquino, un escudero arruinado— que lo matan de hambre mientras presumen de honra. Frente al ideal heroico de la épica o la novela de caballerías, Lázaro sobrevive gracias a la «industria»: el ingenio, la picardía y la capacidad de leer (y engañar) a quienes tienen poder sobre él.`,
      authorId: anonimoLazarillo.id,
    },
  });

  console.log("Creando fragmentos de «Nombrar el valor» (continuación)...");

  const racimoText = `Acaeció que, llegando a un lugar que llaman Almorox, al tiempo que cogían las uvas, un vendimiador le dio un racimo de ellas en limosna. Y como suelen ir los cestos maltratados, y también que la uva en aquel tiempo está muy madura, desgranábasele el racimo en la mano; para echarlo en el fardel tornábase mosto, y lo que a él se llegaba. Acordó de hacer un banquete, así por no poderlo llevar como por contentarme, que aquel día me había dado muchos rodillazos y golpes. Sentámonos en una valladar y dijo:

—Agora quiero yo usar contigo de una liberalidad; y es que ambos comamos este racimo de uvas, y que hayas dél tanta parte como yo. Partirlo hemos desta manera: tú picarás una vez, y yo otra; con tal que me prometas no tomar cada vez más de una uva. Yo haré lo mismo hasta que lo acabemos, y desta suerte no habrá engaño.

Hecho así el concierto, comenzamos; mas luego al segundo lance, el traidor mudó de propósito, y comenzó a tomar de dos en dos, considerando que yo debría hacer lo mismo. Como vi que él quebraba la postura, no me contenté ir a la par con él; mas aún pasaba adelante: dos a dos, y tres a tres, y como podía las comía.

Acabado el racimo, estuvo un poco con el escobajo en la mano, y, meneando la cabeza, dijo:

—Lázaro, engañado me has; juraré yo a Dios que has tú comido las uvas tres a tres.

—No comí —dije yo—; mas, ¿por qué sospecháis eso?

Respondió el sagacísimo ciego:

—¿Sabes en qué veo que las comiste tres a tres? En que comía yo dos a dos, y callabas.`;

  const fragRacimo = await prisma.fragment.create({
    data: {
      slug: "el-racimo-de-uvas",
      title: "El racimo de uvas",
      location: "Lazarillo de Tormes, Tratado primero",
      headline: "El ciego que veía con los dientes",
      text: racimoText,
      order: 1,
      status: "published",
      featured: false,
      workId: lazarillo.id,
      constellations: { connect: [{ slug: "honor-y-valor" }] },
      topics: { connect: [{ slug: "desengano" }] },
      characters: { connect: [{ slug: "lazaro-de-tormes" }] },
      places: { connect: [{ slug: "toledo" }] },
      artworkImageUrl:
        "/images/artworks/murillo-muchachos-comiendo.jpg",
      artworkTitle: "Niños comiendo uvas y melón",
      artworkAuthor: "Bartolomé Esteban Murillo, h. 1645-1646",
      artworkCaption:
        "Dos niños de Sevilla devoran fruta —probablemente robada— con una naturalidad que no esconde miseria ni vergüenza. Murillo pinta el hambre infantil sin patetismo, casi con ternura, igual que el Lazarillo la cuenta: como algo cotidiano, que se resuelve con ingenio antes que con lástima.",
    },
  });

  // ---------------------------------------------------------------------
  // Anotaciones — El racimo de uvas
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «El racimo de uvas»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragRacimo.id,
        type: "glosa",
        ...anchor(racimoText, "vendimiador"),
        order: 1,
        content: `«Vendimiador»: persona que trabaja en la vendimia, es decir, en la recogida de la uva. El racimo que recibe el ciego es una limosna, no una compra: todo en este episodio depende de lo que otros dan o dejan de dar.`,
      },
      {
        fragmentId: fragRacimo.id,
        type: "glosa",
        ...anchor(racimoText, "valladar"),
        order: 2,
        content: `«Valladar»: vallado o ribazo de tierra que delimita un camino o una finca. Es el «comedor» improvisado donde el ciego y Lázaro se sientan a celebrar su «banquete» de un solo racimo.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragRacimo.id,
        type: "contexto",
        ...anchor(racimoText, "Acaeció que, llegando a un lugar que llaman Almorox,"),
        order: 1,
        content: `El «Lazarillo» se publicó sin nombre de autor en 1554 y está narrado en primera persona, como una larga carta dirigida a un «Vuestra Merced» que ha pedido a Lázaro que cuente su vida «desde su niñez». El hambre —no el honor ni la guerra— es el motor de la acción: cada episodio es una pequeña batalla por la comida.`,
      },
      {
        fragmentId: fragRacimo.id,
        type: "contexto",
        ...anchor(racimoText, "Respondió el sagacísimo ciego:"),
        order: 2,
        content: `El ciego es el primero de una serie de amos de los que Lázaro aprenderá, a su pesar, una lección distinta de supervivencia. Frente al «valor» entendido como heroísmo o lealtad —el que veíamos en el Cid o en Abenámar—, aquí «valor» empieza a significar otra cosa: la «industria», el ingenio para no morir de hambre.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragRacimo.id,
        type: "figura",
        category: "tropo",
        ...anchor(racimoText, "¿Sabes en qué veo que las comiste tres a tres? En que comía yo dos a dos, y callabas."),
        order: 1,
        content: `**Paradoja / ironía**: un ciego «ve» lo que ha hecho un niño que ve perfectamente. El verbo «ver» se usa en sentido figurado —deducir, comprender— y esa misma deducción deja al descubierto, de paso, que el ciego también hacía trampas: los dos mentían a la vez.`,
      },
      {
        fragmentId: fragRacimo.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(racimoText, "dos a dos, y tres a tres, y como podía las comía"),
        order: 2,
        content: `**Gradación**: la serie «dos a dos, y tres a tres, y como podía» imita con el ritmo de la frase la propia escalada de la avaricia de Lázaro, cada vez más rápida y descontrolada, hasta que ya ni siquiera cuenta las uvas que se lleva a la boca.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragRacimo.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿En qué consiste el acuerdo que propone el ciego para repartir el racimo de uvas? ¿Cómo lo incumple cada uno de los dos, y de qué manera distinta?`,
      },
      {
        fragmentId: fragRacimo.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El ciego no se enfada ni castiga a Lázaro: se limita a explicarle cómo lo ha descubierto. ¿Qué tipo de relación —y de aprendizaje— se establece entre los dos personajes a través de este episodio?`,
      },

      // Intertextualidad
      {
        fragmentId: fragRacimo.id,
        type: "intertextualidad",
        ...anchor(racimoText, "—No comí —dije yo—; mas, ¿por qué sospecháis eso?"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragAbenamar.id,
        content: `Frente al «Yo te la diré, señor, aunque me cueste la vida» de Abenámar —que jura no mentir nunca, pase lo que pase—, Lázaro miente sin dudarlo en cuanto se siente acorralado. Dos maneras opuestas de entender el valor frente al poder: la fidelidad a la verdad como código de honor, o la mentira como herramienta de quien solo cuenta con su ingenio para sobrevivir.`,
      },
    ],
  });

  const cervantes = await prisma.author.create({
    data: {
      slug: "miguel-de-cervantes",
      name: "Miguel de Cervantes Saavedra",
      birthYear: 1547,
      deathYear: 1616,
      country: "España",
      era: "Barroco",
      bio: `Nacido en Alcalá de Henares, Cervantes llevó una vida de soldado, cautivo y funcionario antes de hacerse escritor: perdió el movimiento de la mano izquierda en la batalla de Lepanto (1571) y pasó cinco años cautivo en Argel. Publicó la primera parte de «El ingenioso hidalgo don Quijote de la Mancha» en 1605 y la segunda en 1615, un año antes de morir —el mismo año, según la tradición, que Shakespeare—. Con ella creó, casi sin pretenderlo, la novela moderna.`,
      portraitUrl: "/images/authors/miguel-de-cervantes.jpg",
    },
  });

  const donQuijote = await prisma.work.create({
    data: {
      slug: "don-quijote-de-la-mancha",
      title: "El ingenioso hidalgo don Quijote de la Mancha",
      year: 1605,
      era: "Barroco",
      genre: "Novela (parodia de los libros de caballerías)",
      synopsis: `Alonso Quijano, un hidalgo manchego de mediana edad, pierde el juicio leyendo libros de caballerías y decide hacerse caballero andante con el nombre de don Quijote. Recluta como escudero a su vecino Sancho Panza y sale a recorrer los caminos de España en busca de aventuras, ofreciendo sus victorias a una dama imaginaria, Dulcinea del Toboso. Una y otra vez, el mundo que don Quijote ve —gigantes, ejércitos, encantamientos— choca con el mundo que ve Sancho, y de ese choque nace tanto la comedia como una de las reflexiones más hondas de la literatura sobre la realidad y la imaginación.`,
      authorId: cervantes.id,
    },
  });

  console.log("Creando fragmentos de «Nombrar el valor» (continuación)...");

  const molinosText = `En esto, descubrieron treinta o cuarenta molinos de viento que hay en aquel campo, y así como don Quijote los vio, dijo a su escudero:

—La ventura va guiando nuestras cosas mejor de lo que acertáramos a desear; porque ves allí, amigo Sancho Panza, donde se descubren treinta, o pocos más, desaforados gigantes, con quien pienso hacer batalla y quitarles a todos las vidas, con cuyos despojos comenzaremos a enriquecer; que esta es buena guerra, y es gran servicio de Dios quitar tan mala simiente de sobre la faz de la tierra.

—¿Qué gigantes? —dijo Sancho Panza.

—Aquellos que allí ves —respondió su amo— de los brazos largos, que los suelen tener algunos de casi dos leguas.

—Mire vuestra merced —respondió Sancho— que aquellos que allí se parecen no son gigantes, sino molinos de viento, y lo que en ellos parecen brazos son las aspas, que, volteadas del viento, hacen andar la piedra del molino.

—Bien parece —respondió don Quijote— que no estás cursado en esto de las aventuras: ellos son gigantes; y si tienes miedo, quítate de ahí, y ponte en oración en el espacio que yo voy a entrar con ellos en fiera y desigual batalla.

Y, diciendo esto, dio de espuelas a su caballo Rocinante, sin atender a las voces que su escudero Sancho le daba, advirtiéndole que, sin duda alguna, eran molinos de viento, y no gigantes, aquellos que iba a acometer. Pero él iba tan puesto en que eran gigantes, que ni oía las voces de su escudero Sancho, ni echaba de ver, aunque estaba ya bien cerca, lo que eran; antes iba diciendo en voces altas:

—Non fuyades, cobardes y viles criaturas, que un solo caballero es el que os acomete.

Levantóse en esto un poco de viento, y las grandes aspas comenzaron a moverse, lo cual visto por don Quijote, dijo:

—Pues aunque mováis más brazos que los del gigante Briareo, me lo habéis de pagar.

Y, en diciendo esto, y encomendándose de todo corazón a su señora Dulcinea, pidiéndole que en tal trance le socorriese, bien cubierto de su rodela, con la lanza en el ristre, arremetió a todo el galope de Rocinante y embistió con el primero molino que estaba delante; y, dándole una lanzada en el aspa, la volvió el viento con tanta furia, que hizo la lanza pedazos, llevándose tras sí al caballo y al caballero, que fue rodando muy maltrecho por el campo.

Acudió Sancho Panza a socorrerle, a todo el correr de su asno, y cuando llegó halló que no se podía menear: tal fue el golpe que dio con él Rocinante.

—¡Válame Dios! —dijo Sancho—. ¿No le dije yo a vuestra merced que mirase bien lo que hacía, que no eran sino molinos de viento, y no lo podía ignorar sino quien llevase otros tales en la cabeza?

—Calla, amigo Sancho —respondió don Quijote—, que las cosas de la guerra, más que otras, están sujetas a continua mudanza; cuanto más, que yo pienso, y es así verdad, que aquel sabio Frestón que me robó el aposento y los libros ha vuelto estos gigantes en molinos, por quitarme la gloria de su vencimiento: tal es la enemistad que me tiene; mas al cabo, al cabo, han de poder poco sus malas artes contra la bondad de mi espada.`;

  const fragMolinos = await prisma.fragment.create({
    data: {
      slug: "los-molinos-de-viento",
      title: "Los molinos de viento",
      location: "Don Quijote de la Mancha, Primera parte, capítulo VIII",
      headline: "Cuando los gigantes eran de aspas",
      text: molinosText,
      order: 1,
      status: "published",
      featured: false,
      workId: donQuijote.id,
      constellations: { connect: [{ slug: "honor-y-valor" }] },
      topics: { connect: [{ slug: "desengano" }] },
      characters: { connect: [{ slug: "don-quijote" }, { slug: "sancho-panza" }] },
      places: { connect: [{ slug: "campo-de-criptana" }] },
      artworkImageUrl:
        "/images/artworks/adventure-with-windmills.jpg",
      artworkTitle: "Aventura de los molinos de viento",
      artworkAuthor: "Gustave Doré, 1863",
      artworkCaption:
        "Doré dibuja a don Quijote en el instante exacto de la colisión: lanza en ristre, suspendido en el aire, todavía caballero de novela de caballerías una fracción de segundo antes de convertirse en un cuerpo que cae. Ningún grabado ha fijado mejor el momento en que la imaginación choca con el mundo.",
    },
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Los molinos de viento
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Los molinos de viento»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragMolinos.id,
        type: "glosa",
        ...anchor(molinosText, "desaforados"),
        order: 1,
        content: `«Desaforados»: descomunales, fuera de toda medida. Don Quijote no ve simplemente «gigantes», sino gigantes que exceden cualquier proporción humana: el adjetivo ya anuncia que estamos en el terreno de la exageración caballeresca.`,
      },
      {
        fragmentId: fragMolinos.id,
        type: "glosa",
        ...anchor(molinosText, "Briareo"),
        order: 2,
        content: `Briareo: gigante de cien brazos de la mitología griega, hijo de Urano y Gea. Don Quijote, fiel a su erudición libresca, hasta en plena carga encuentra tiempo para una referencia clásica.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragMolinos.id,
        type: "contexto",
        ...anchor(molinosText, "En esto, descubrieron treinta o cuarenta molinos de viento que hay en aquel campo,"),
        order: 1,
        content: `Publicada en 1605, la primera parte del «Quijote» nace como parodia de los libros de caballerías, entonces un género de enorme éxito popular. Esta es la aventura más célebre de toda la novela —y probablemente de la literatura española—: de ella viene la palabra «quijotesco» para describir a quien lucha por ideales que el mundo ya no comparte.`,
      },
      {
        fragmentId: fragMolinos.id,
        type: "contexto",
        ...anchor(molinosText, "aquel sabio Frestón que me robó el aposento y los libros ha vuelto estos gigantes en molinos"),
        order: 2,
        content: `Frestón es un encantador inventado por don Quijote: a lo largo de la novela, cada vez que la realidad contradice su visión caballeresca, recurre a la idea de que algún mago hostil ha «transformado» lo que ve para arrebatarle la gloria. Es su manera de no aceptar nunca el desengaño.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragMolinos.id,
        type: "figura",
        category: "tropo",
        ...anchor(molinosText, "que aquellos que allí se parecen no son gigantes, sino molinos de viento"),
        order: 1,
        content: `**El símbolo central de la novela**: la distancia entre lo que don Quijote nombra (gigantes) y lo que Sancho —y el lector— ve (molinos). Toda la obra se sostiene sobre esta doble mirada: una misma realidad, leída por la imaginación y por el sentido común, sin que ninguna de las dos la agote por completo.`,
      },
      {
        fragmentId: fragMolinos.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(molinosText, "Non fuyades, cobardes y viles criaturas, que un solo caballero es el que os acomete."),
        order: 2,
        content: `Cervantes pone en boca de don Quijote un castellano arcaico («Non fuyades» = «no huyáis»), el mismo registro solemne de los libros de caballerías y los romances medievales. El contraste entre esa lengua de héroe y unos molinos de viento es, en sí mismo, la broma.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragMolinos.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Qué le dice don Quijote a Sancho que son los molinos de viento? ¿Cómo intenta Sancho hacerle ver la realidad, y qué hace don Quijote a pesar de su advertencia?`,
      },
      {
        fragmentId: fragMolinos.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `Tras la caída, don Quijote no admite haberse equivocado: prefiere creer que un encantador ha transformado a los gigantes en molinos. ¿Te parece una actitud admirable, ridícula, o las dos cosas a la vez? Razona tu respuesta.`,
      },

      // Intertextualidad
      {
        fragmentId: fragMolinos.id,
        type: "intertextualidad",
        ...anchor(molinosText, "desaforados gigantes, con quien pienso hacer batalla y quitarles a todos las vidas, con cuyos despojos comenzaremos a enriquecer"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragCid.id,
        content: `«Hacer batalla», «despojos», «enriquecer»: el vocabulario de don Quijote es, palabra por palabra, el de la épica medieval que contábamos al principio de este itinerario con el destierro del Cid. Pero cinco siglos después, ese mismo lenguaje aplicado a unos molinos de viento revela hasta qué punto el ideal heroico se ha quedado sin un mundo real al que aplicarse. De ahí nace la risa, pero también una extraña ternura hacia quien se empeña en seguir creyendo en él.`,
      },
    ],
  });

  console.log("Creando fragmentos de «Nombrar el valor» (continuación)...");

  const anaCaro = await prisma.author.create({
    data: {
      slug: "ana-caro-de-mallen",
      name: "Ana Caro de Mallén",
      birthYear: 1590,
      deathYear: 1646,
      country: "España",
      era: "Barroco",
      bio: `Nacida en Sevilla hacia 1590, Ana Caro de Mallén fue una de las pocas mujeres que vivieron de su pluma en el Siglo de Oro: escribió relaciones y loas para fiestas oficiales de Sevilla y Madrid —por las que llegó a cobrar de los cabildos, como un autor más— y mantuvo amistad con otra escritora, María de Zayas, que la elogió en sus «Novelas amorosas y ejemplares». Solo se conservan completas dos comedias suyas, «El Conde Partinuplés» y «Valor, agravio y mujer», ambas protagonizadas por mujeres que toman las riendas de su propia historia.`,
      portraitUrl: "/images/authors/ana-caro-de-mallen.jpg",
    },
  });

  const valorAgravioYMujer = await prisma.work.create({
    data: {
      slug: "valor-agravio-y-mujer",
      title: "Valor, agravio y mujer",
      year: 1630,
      era: "Barroco",
      genre: "Comedia (teatro barroco)",
      synopsis: `Don Juan de Córdoba seduce a doña Leonor en Sevilla con promesa de matrimonio y la abandona para marchar a Flandes. Leonor se viste de hombre, adopta el nombre de don Leonardo Ponce de León y viaja hasta allí para recuperar su honor. Sin que la reconozca, gana la confianza de su propio hermano —al servicio de la corte de la condesa Estela— y se enreda en los líos amorosos de palacio, hasta lograr que don Juan repare su agravio.`,
      authorId: anaCaro.id,
    },
  });

  const valorText = `LEONOR:
En este traje podré
cobrar mi perdido honor.

RIBETE:
Pareces el dios de amor.
¡Qué talle, qué pierna y pie!
Notable resolución
fue la tuya, mujer tierna
y noble.

LEONOR:
Cuando gobierna
la fuerza de la pasión,
no hay discurso cuerdo o sabio
en quien ama; pero yo,
mi razón, que mi amor no,
consultada con mi agravio,
voy siguiendo en las violencias
de mi forzoso destino,
porque al primer desatino
se rindieron las potencias.
Supe que a Flandes venía
este ingrato que ha ofendido
tanto amor con tanto olvido,
tal fe con tal tiranía.
Fingí en el más recoleto
monasterio mi retiro,
y sólo ocultarme aspiro
de mis deudos; en efecto
no tengo quién me visite
si no es mi hermana, y está
del caso avisada ya,
para que me solicite
y vaya a ver con engaño,
de suerte que, aunque terrible
mi locura, es imposible
que se averigüe su engaño.
Ya, pues, me determiné,
y atrevida pasé el mar.
O he de morir o acabar
la empresa que comencé.
¡Oh, a todos los cielos juro
que, nueva amazona, intente,
o Camila más valiente,
vengarme de aquel perjuro
aleve!

RIBETE:
Oyéndote estoy,
y ¡por Cristo! que he pensado
que el nuevo traje te ha dado
alientos.

LEONOR:
¡Yo soy quien soy!
Engáñaste si imaginas,
Ribete, que soy mujer.
Mi agravio mudó mi ser.

RIBETE:
Impresiones peregrinas
suele hacer un agravio.`;

  const fragValor = await prisma.fragment.create({
    data: {
      slug: "mi-agravio-mudo-mi-ser",
      title: "Valor, agravio y mujer",
      location: "Valor, agravio y mujer, Jornada primera",
      headline: "El nombre que ella misma se da",
      text: valorText,
      order: 1,
      status: "published",
      featured: false,
      workId: valorAgravioYMujer.id,
      constellations: { connect: [{ slug: "honor-y-valor" }] },
      characters: { connect: [{ slug: "leonor-de-ribera" }] },
      places: { connect: [{ slug: "sevilla" }] },
      artworkImageUrl:
        "/images/artworks/catalina-de-erauso.jpg",
      artworkTitle: "Retrato de doña Catalina de Erauso, la Monja Alférez",
      artworkAuthor: "Atribuido a Juan van der Hamen y León, h. 1625",
      artworkCaption:
        "Catalina de Erauso (1592-1650) huyó de un convento donostiarra vestida de hombre y combatió durante años en América con nombres masculinos, hasta que su historia llegó a Roma y Madrid: el Papa y Felipe IV le permitieron seguir vistiendo de soldado el resto de su vida. Una mujer real, contemporánea de Ana Caro, que —como Leonor— cambió de traje y de nombre para que su valor contara.",
    },
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Valor, agravio y mujer
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Valor, agravio y mujer»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragValor.id,
        type: "glosa",
        ...anchor(valorText, "amazona"),
        order: 1,
        content: `«Amazona»: en la mitología griega, las amazonas eran un pueblo de mujeres guerreras que vivían sin hombres y combatían como o mejor que ellos. Invocarlas como modelo —«nueva amazona»— es reclamar para sí un valor que la época consideraba, por definición, masculino.`,
      },
      {
        fragmentId: fragValor.id,
        type: "glosa",
        ...anchor(valorText, "Camila"),
        order: 2,
        content: `Camila: guerrera volsca de la «Eneida» de Virgilio, criada para la caza y la guerra, célebre por su destreza con las armas y su muerte heroica en combate. Junto a las amazonas, es uno de los pocos modelos clásicos de mujer que se mide en valor con los hombres.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragValor.id,
        type: "contexto",
        ...anchor(valorText, "En este traje podré"),
        order: 1,
        content: `Ana Caro de Mallén fue una de las muy pocas mujeres que pudieron vivir de la escritura en el Siglo de Oro. En «Valor, agravio y mujer», la «mujer vestida de hombre» —un recurso muy frecuente en la comedia barroca, también en Lope o Calderón— deja de ser solo un disfraz para la intriga: es la manera en que Leonor, deshonrada por don Juan, decide tomar en sus propias manos la reparación de su honor.`,
      },
      {
        fragmentId: fragValor.id,
        type: "contexto",
        ...anchor(valorText, "Supe que a Flandes venía"),
        order: 2,
        content: `Flandes —los actuales Países Bajos y Bélgica, entonces bajo dominio de la Monarquía Hispánica— era a comienzos del siglo XVII destino habitual de soldados y nobles españoles. Hasta allí ha huido don Juan tras abandonar a Leonor en Sevilla, y hasta allí lo sigue ella: el escenario flamenco aleja la acción de España, pero el «agravio» que la mueve es muy castizo.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragValor.id,
        type: "figura",
        category: "tropo",
        ...anchor(valorText, "Mi agravio mudó mi ser."),
        order: 1,
        content: `**Metáfora identitaria**: «mi agravio mudó mi ser» convierte la afrenta sufrida en una fuerza casi física, capaz de transformar literalmente lo que Leonor «es». Justo antes, «¡Yo soy quien soy!» recuerda la fórmula con la que la divinidad se nombra a sí misma en el Éxodo («Yo soy el que soy»): Leonor se apropia de esa autodefinición absoluta para negarse a ser solo «mujer» o solo «Leonor».`,
      },
      {
        fragmentId: fragValor.id,
        type: "figura",
        category: "topos",
        ...anchor(valorText, "nueva amazona, intente,\no Camila más valiente,"),
        order: 2,
        content: `**La mujer varonil**: tipo recurrente del teatro barroco —mujeres que visten de hombre, manejan la espada y reclaman venganza— al que Leonor se suma citando expresamente sus modelos clásicos (amazonas, Camila). La paradoja es significativa: para que su valor sea reconocido como tal, Leonor necesita compararse con mujeres que ya eran, ellas mismas, una excepción «masculina».`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragValor.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Qué nombre adopta Leonor al vestirse de hombre? Según lo que cuenta en su monólogo, ¿qué dos objetivos persigue al llegar a Flandes: uno relacionado con su hermano y otro con don Juan?`,
      },
      {
        fragmentId: fragValor.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `Leonor dice a Ribete «engáñaste si imaginas... que soy mujer» y añade «mi agravio mudó mi ser». ¿En qué sentido esto es literalmente cierto (su disfraz) y en qué sentido es, además, una afirmación sobre qué tipo de persona —con qué tipo de valor— puede actuar y cuál no?`,
      },
      {
        fragmentId: fragValor.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `Para recuperar su honor, Leonor necesita vestirse y comportarse «como un hombre», y se compara con amazonas y con Camila —mujeres excepcionales, casi sobrehumanas—. ¿Te parece que el personaje cuestiona la idea de que el valor sea «cosa de hombres», o más bien la confirma al presentar a una mujer valerosa como una rareza que necesita justificarse? Razona tu respuesta.`,
      },

      // Intertextualidad
      {
        fragmentId: fragValor.id,
        type: "intertextualidad",
        ...anchor(valorText, "¡Yo soy quien soy!"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragMolinos.id,
        content: `«¡Yo soy quien soy!», declara Leonor justo antes de explicar que su agravio le ha dado un nuevo nombre y un nuevo «ser». Don Quijote hace algo parecido al rebautizarse: Alonso Quijano decide «ser» don Quijote para que su mundo se ajuste a sus libros de caballerías. Los dos personajes se nombran a sí mismos para reclamar un valor que, de otro modo, nadie les reconocería —aunque a Leonor la mueva un agravio real, y a don Quijote, una fantasía literaria.`,
      },
    ],
  });

  console.log("Creando fragmentos de «Nombrar el valor» (continuación)...");

  const calderon = await prisma.author.create({
    data: {
      slug: "pedro-calderon-de-la-barca",
      name: "Pedro Calderón de la Barca",
      birthYear: 1600,
      deathYear: 1681,
      country: "España",
      era: "Barroco",
      bio: `Nacido en Madrid en 1600 y muerto en la misma ciudad en 1681, Pedro Calderón de la Barca fue, tras la muerte de Lope de Vega, el gran dramaturgo de la corte de Felipe IV: escribió comedias, dramas de honor y, ya ordenado sacerdote en 1651, los autos sacramentales que se representaban cada Corpus Christi en las calles de Madrid. «La vida es sueño» (1635) es su obra más conocida: une la intriga palaciega con una reflexión filosófica sobre la libertad, el destino y la naturaleza de la realidad.`,
      portraitUrl: "/images/authors/pedro-calderon-de-la-barca.jpg",
    },
  });

  const laVidaEsSueno = await prisma.work.create({
    data: {
      slug: "la-vida-es-sueno",
      title: "La vida es sueño",
      year: 1635,
      era: "Barroco",
      genre: "Drama filosófico (teatro barroco)",
      synopsis: `Basilio, rey de Polonia, encierra a su hijo Segismundo desde su nacimiento en una torre, convencido por una profecía de que será un príncipe cruel y tirano. Para comprobarlo, lo hace llevar dormido a palacio y proclamarlo rey por un día: al despertar, Segismundo actúa con la violencia que la profecía anunciaba, y es devuelto a la torre haciéndole creer que todo ha sido un sueño. A partir de esa confusión entre sueño y realidad, la obra sigue el aprendizaje de Segismundo hasta una segunda oportunidad en la que deberá decidir cómo actuar.`,
      authorId: calderon.id,
    },
  });

  const suenosText = `Es verdad; pues reprimamos
esta fiera condición,
esta furia, esta ambición,
por si alguna vez soñamos.
Y sí haremos, pues estamos
en mundo tan singular,
que el vivir solo es soñar;
y la experiencia me enseña
que el hombre que vive, sueña
lo que es, hasta despertar.

Sueña el rey que es rey, y vive
con este engaño mandando,
disponiendo y gobernando;
y este aplauso, que recibe
prestado, en el viento escribe,
y en cenizas le convierte
la muerte: ¡desdicha fuerte!
¡Que hay quien intente reinar,
viendo que ha de despertar
en el sueño de la muerte!

Sueña el rico en su riqueza,
que más cuidados le ofrece;
sueña el pobre que padece
su miseria y su pobreza;
sueña el que a medrar empieza,
sueña el que afana y pretende,
sueña el que agravia y ofende,
y en el mundo, en conclusión,
todos sueñan lo que son,
aunque ninguno lo entiende.

Yo sueño que estoy aquí
destas prisiones cargado,
y soñé que en otro estado
más lisonjero me vi.
¿Qué es la vida? Un frenesí.
¿Qué es la vida? Una ilusión,
una sombra, una ficción,
y el mayor bien es pequeño;
que toda la vida es sueño,
y los sueños, sueños son.`;

  const fragSuenos = await prisma.fragment.create({
    data: {
      slug: "los-suenos-suenos-son",
      title: "La vida es sueño",
      location: "La vida es sueño, Jornada segunda",
      headline: "Despertar para seguir soñando",
      text: suenosText,
      order: 1,
      status: "published",
      featured: false,
      workId: laVidaEsSueno.id,
      constellations: { connect: [{ slug: "honor-y-valor" }] },
      topics: { connect: [{ slug: "desengano" }] },
      characters: { connect: [{ slug: "segismundo" }] },
      places: { connect: [{ slug: "madrid" }] },
      artworkImageUrl:
        "/images/artworks/valdes-leal-finis-gloriae-mundi.jpg",
      artworkTitle: "Finis Gloriae Mundi",
      artworkAuthor: "Juan de Valdés Leal, 1672",
      artworkCaption:
        "Bajo la mitra de un obispo y la armadura de un caballero —símbolos del poder eclesiástico y militar—, Valdés Leal pinta dos cadáveres que se descomponen sin que nadie repare ya en sus cruces, báculos o espadas. «Finis gloriae mundi» —el fin de la gloria del mundo— ilustra al pie de la letra el verso de Segismundo: el rey, también él, sueña que es rey, y la muerte convierte en cenizas ese aplauso prestado.",
    },
  });

  // ---------------------------------------------------------------------
  // Anotaciones — La vida es sueño
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «La vida es sueño»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragSuenos.id,
        type: "glosa",
        ...anchor(suenosText, "medrar"),
        order: 1,
        content: `«Medrar»: mejorar de posición social o económica, prosperar. En la lista de quienes «sueñan» —el rey, el rico, el pobre—, Segismundo incluye también a quien solo aspira a subir un escalón: ni siquiera la ambición modesta escapa al sueño general.`,
      },
      {
        fragmentId: fragSuenos.id,
        type: "glosa",
        ...anchor(suenosText, "lisonjero"),
        order: 2,
        content: `«Lisonjero»: halagüeño, que agrada o satisface. Segismundo recuerda su breve paso por el poder en palacio como un estado «más lisonjero» que la prisión en la que despierta, aunque uno y otro le parezcan ya, por igual, un sueño.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragSuenos.id,
        type: "contexto",
        ...anchor(suenosText, "Es verdad; pues reprimamos"),
        order: 1,
        content: `El rey Basilio de Polonia ha mantenido encerrado a su hijo Segismundo desde que nació, por temor a una profecía que lo anuncia como un príncipe violento. Para probarla, lo lleva dormido a palacio y lo proclama rey por un día: Segismundo reacciona con la furia anunciada, y al despertar de nuevo en la torre le hacen creer que todo ha sido un sueño. Este monólogo, que cierra la segunda jornada, es su primera reflexión tras ese segundo despertar.`,
      },
      {
        fragmentId: fragSuenos.id,
        type: "contexto",
        ...anchor(suenosText, "Sueña el rey que es rey"),
        order: 2,
        content: `Estrenada en 1635 ante Felipe IV, «La vida es sueño» convirtió esta imagen —la vida como sueño del que se despierta solo con la muerte— en una de las fórmulas más repetidas del desengaño barroco, hasta el punto de pasar al habla común como proverbio.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragSuenos.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(
          suenosText,
          "Sueña el rico en su riqueza,\nque más cuidados le ofrece;\nsueña el pobre que padece\nsu miseria y su pobreza;\nsueña el que a medrar empieza,\nsueña el que afana y pretende,\nsueña el que agravia y ofende,",
        ),
        order: 1,
        content: `**Anáfora y enumeración**: «sueña» se repite al inicio de siete versos seguidos, recorriendo todas las posiciones sociales —rey, rico, pobre, ambicioso, ofensor— hasta agotar, en apariencia, todas las posibilidades. La forma misma del verso convierte el sueño en una condición universal, sin excepciones.`,
      },
      {
        fragmentId: fragSuenos.id,
        type: "figura",
        category: "tropo",
        ...anchor(suenosText, "que toda la vida es sueño,\ny los sueños, sueños son."),
        order: 2,
        content: `**Metáfora y tautología**: «la vida es sueño» identifica dos términos que deberían ser opuestos; pero el verso siguiente da una vuelta de tuerca más, «los sueños, sueños son», una tautología que no añade información lógica y, sin embargo, cierra el poema con un golpe de certeza: ni siquiera el sueño es ya un punto de referencia estable.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragSuenos.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `Según Segismundo, ¿qué sueña el rey, qué sueña el rico y qué sueña el pobre? A pesar de sus diferencias, ¿qué tienen en común los tres según el monólogo?`,
      },
      {
        fragmentId: fragSuenos.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El monólogo no termina afirmando solo que «la vida es sueño», sino que, además, «los sueños, sueños son». ¿Qué añade esta segunda afirmación a la primera? ¿Por qué puede resultar todavía más inquietante?`,
      },
      {
        fragmentId: fragSuenos.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `Si el poder, la riqueza y la propia vida pueden ser solo un sueño, ¿tiene aún sentido hablar de «honor» o de «valor»? ¿Qué tipo de valor, si alguno, le queda todavía a alguien que piensa así? Razona tu respuesta.`,
      },

      // Intertextualidad
      {
        fragmentId: fragSuenos.id,
        type: "intertextualidad",
        ...anchor(suenosText, "todos sueñan lo que son"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragMolinos.id,
        content: `Don Quijote y Segismundo viven la misma sospecha barroca —que las apariencias engañan— pero reaccionan en direcciones opuestas. Don Quijote se aferra a su versión de la realidad incluso después del golpe: prefiere creer en encantadores antes que aceptar que eran molinos. Segismundo hace el desengaño radical: ni siquiera haber sido rey, ni siquiera estar despierto ahora, le parece ya seguro. Entre los dos queda planteada la pregunta que recorre este itinerario: si todo puede ser sueño o ficción, ¿dónde se sostiene el valor de cada uno?`,
      },
    ],
  });

  console.log("Creando fragmentos de «Nombrar el valor» (continuación)...");

  const fuenteovejunaWork = await prisma.work.create({
    data: {
      slug: "fuenteovejuna",
      title: "Fuenteovejuna",
      year: 1614,
      era: "Barroco",
      genre: "Comedia (teatro barroco, drama de honor colectivo)",
      synopsis: `En 1476, los vecinos de la villa cordobesa de Fuente Obejuna se alzan contra su comendador, Fernán Gómez de Guzmán, que ha abusado repetidamente de su poder sobre el pueblo y, en particular, sobre sus mujeres. El día de su boda con Frondoso, Laurencia es raptada por el comendador; cuando logra escapar, irrumpe en el concejo —reunido sin atreverse a decidir nada— y arenga a los hombres hasta empujarlos a tomar las armas. La obra, basada en una crónica real, termina con la muerte del comendador a manos de todo el pueblo y con los Reyes Católicos absolviendo a Fuente Obejuna del crimen colectivo.`,
      authorId: lopeDeVega.id,
    },
  });

  const opresionText = `COMENDADOR. No es malo venir siguiendo un corcillo temeroso y topar tan bella gama.

LAURENCIA. Aquí descansaba un poco de haber lavado unos paños; y así, al arroyo me torno, si manda su señoría.

COMENDADOR. Aquesos desdenes toscos afrentan, bella Laurencia, las gracias que el poderoso cielo te dio, de tal suerte que vienes a ser un monstruo. Mas, si otras veces pudiste huir mi ruego amoroso, agora no quiere el campo, amigo secreto y solo; que tú sola no has de ser tan soberbia, que tu rostro huyas al señor que tienes, teniéndome a mí en tan poco. [...]

LAURENCIA. [...] ¡Id con Dios tras vuestro corzo!, que, a no veros con la Cruz, os tuviera por demonio, pues tanto me perseguís.

COMENDADOR. ¡Qué estilo tan enfadoso! Pongo la ballesta en tierra, y a la prática de manos reduzgo melindres.

LAURENCIA. ¡Cómo! ¿Eso hacéis? ¿Estáis en vos?

COMENDADOR. No te defiendas.

FRONDOSO. Si tomo la ballesta, ¡vive el cielo, que no la ponga en el hombro...!

COMENDADOR. Acaba, ríndete.

LAURENCIA. ¡Cielos, ayudadme agora!

COMENDADOR. Solos estamos; no tengas miedo.

FRONDOSO. Comendador generoso, dejad la moza o creed que de mi agravio y enojo será blanco vuestro pecho, aunque la Cruz me da asombro.

COMENDADOR. ¡Perro villano!

FRONDOSO. No hay perro. ¡Huye, Laurencia!

LAURENCIA. ¡Frondoso, mira lo que haces!

FRONDOSO. Vete.`;

  const fragOpresion = await prisma.fragment.create({
    data: {
      slug: "la-opresion-del-comendador",
      title: "La opresión del comendador",
      location: "Fuenteovejuna, Acto primero",
      headline: "Comendador generoso, dejad la moza",
      text: opresionText,
      order: 1,
      status: "published",
      featured: false,
      workId: fuenteovejunaWork.id,
      constellations: { connect: [{ slug: "poder" }, { slug: "honor-y-valor" }] },
      characters: {
        connect: [{ slug: "laurencia" }, { slug: "frondoso" }, { slug: "fernan-gomez" }],
      },
      places: { connect: [{ slug: "fuenteovejuna" }] },
      artworkImageUrl: "/images/artworks/goya-maja-embozados.jpg",
      artworkTitle: "La maja y los embozados",
      artworkAuthor: "Francisco de Goya, 1777",
      artworkCaption:
        "Goya pinta a una maja seguida de cerca por dos hombres embozados, que le ocultan el rostro bajo la capa, mientras otra figura masculina observa la escena desde un segundo plano sin intervenir. La amenaza de unos hombres cuyas intenciones no se declaran abiertamente, y la presencia de un testigo que puede mirar sin actuar, son los mismos elementos que pone en juego esta escena: el comendador disfraza su acoso de encuentro casual de cazador, y solo la decisión de Frondoso de no quedarse mirando cambia lo que iba a pasar.",
    },
  });

  const injusticiaText = `ESTEBAN. Supuesto que el disculparle ya puede tocar a un suegro, no es mucho que en causas tales se descomponga con vos un hombre, en efeto, amante; porque si vos pretendéis su propia mujer quitarle, ¿qué mucho que la defienda?

COMENDADOR. ¡Majadero sois, alcalde!

ESTEBAN. ¡Por vuestra virtud, señor!

COMENDADOR. Nunca yo quise quitarle su mujer, pues no lo era.

ESTEBAN. ¡Sí quisistes...! Y esto baste, que Reyes hay en Castilla, que nuevas órdenes hacen, con que desórdenes quitan. Y harán mal, cuando descansen de las guerras, en sufrir en sus villas y lugares a hombres tan poderosos por traer cruces tan grandes. Póngasela el Rey al pecho, que para pechos reales es esa insignia, y no más.

COMENDADOR. ¡Hola! ¡La vara quitalde!

ESTEBAN. Tomad, señor, norabuena.

COMENDADOR. Pues con ella quiero dalle, como a caballo brioso.

ESTEBAN. Por señor os sufro. Dadme.

PASCUALA. ¡A un viejo de palos das!

LAURENCIA. Si le das porque es mi padre, ¿qué vengas en él de mí?

COMENDADOR. Llevadla, y haced que guarden su persona diez soldados.

ESTEBAN. ¡Justicia del cielo baje!`;

  const fragInjusticia = await prisma.fragment.create({
    data: {
      slug: "las-victimas-de-la-injusticia",
      title: "Las víctimas de la injusticia",
      location: "Fuenteovejuna, Acto segundo",
      headline: "¡A un viejo de palos das!",
      text: injusticiaText,
      order: 2,
      status: "published",
      featured: false,
      workId: fuenteovejunaWork.id,
      constellations: { connect: [{ slug: "poder" }, { slug: "honor-y-valor" }] },
      characters: {
        connect: [{ slug: "esteban" }, { slug: "fernan-gomez" }, { slug: "laurencia" }],
      },
      places: { connect: [{ slug: "fuenteovejuna" }] },
      artworkImageUrl: "/images/artworks/goya-albanil-herido.jpg",
      artworkTitle: "El albañil herido",
      artworkAuthor: "Francisco de Goya, h. 1786-1787",
      artworkCaption:
        "Goya pintó a este albañil herido, sostenido por dos compañeros tras una caída, para el comedor de un palacio real: una mirada inusualmente compasiva hacia el cuerpo dañado de un trabajador corriente. La misma desproporción entre el daño sufrido y la indiferencia de quien lo causa recorre esta escena, en la que el comendador convierte la vara de la justicia —el bastón que distingue al alcalde como representante del rey— en el palo con el que golpea a un anciano ante su propia familia.",
    },
  });

  const fuenteovejunaText = `¿Vosotros sois hombres nobles?
¿Vosotros padres y deudos?
¿Vosotros, que no se os rompen
las entrañas de dolor,
de verme en tantos dolores?
Ovejas sois, bien lo dice
de Fuente Ovejuna el nombre.
Liebres cobardes nacisteis;
bárbaros sois, no españoles.
Gallinas, ¡vuestras mujeres
sufrís que otros hombres gocen!
Poneos ruecas en la cinta.
¿Para qué os ceñís estoques?
¡Vive Dios, que he de trazar
que solas mujeres cobren
la honra de estos tiranos,
la sangre de estos traidores,
y que os han de tirar piedras,
hilanderas, maricones,
amujerados, cobardes,
y que mañana os adornen
nuestras tocas y basquiñas,
solimanes y colores!`;

  const fragFuenteovejuna = await prisma.fragment.create({
    data: {
      slug: "liebres-cobardes-nacisteis",
      title: "Fuenteovejuna",
      location: "Fuenteovejuna, Acto tercero",
      headline: "Vergüenza convertida en valor",
      text: fuenteovejunaText,
      order: 3,
      status: "published",
      featured: false,
      workId: fuenteovejunaWork.id,
      constellations: { connect: [{ slug: "honor-y-valor" }] },
      characters: { connect: [{ slug: "laurencia" }] },
      places: { connect: [{ slug: "fuenteovejuna" }] },
      artworkImageUrl:
        "/images/artworks/velazquez-las-hilanderas.jpg",
      artworkTitle: "Las hilanderas (La fábula de Aracne)",
      artworkAuthor: "Diego Velázquez, h. 1657",
      artworkCaption:
        "Velázquez retrató a estas mujeres trabajando en un taller real de tapices, devanando lana e hilando con rueca y huso: el oficio que da título al cuadro. Laurencia convierte ese mismo gesto, propio de mujeres, en el insulto más grave que puede dirigir a los hombres del concejo: «poneos ruecas en la cinta [...] hilanderas, maricones». Donde Velázquez retrata con dignidad el trabajo de hilar, Laurencia lo usa como rasero del valor: quien no actúe como ella exige debería, según su arenga, vestir y trabajar como mujer.",
    },
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Fuenteovejuna
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Fuenteovejuna»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragFuenteovejuna.id,
        type: "glosa",
        ...anchor(fuenteovejunaText, "deudos"),
        order: 1,
        content: `«Deudos»: parientes, familiares por sangre o por alianza. Laurencia no interpela a unos «hombres» abstractos, sino a quienes deberían sentirse llamados por vínculos de familia —padres, hermanos, primos— a defender a las mujeres del pueblo.`,
      },
      {
        fragmentId: fragFuenteovejuna.id,
        type: "glosa",
        ...anchor(fuenteovejunaText, "solimanes"),
        order: 2,
        content: `«Solimanes»: afeites, cosméticos blancos que las mujeres usaban para emblanquecer el rostro. En el último verso, Laurencia imagina a los hombres del concejo vestidos y maquillados como mujeres —«tocas y basquiñas, / solimanes y colores»— si no recuperan con las armas lo que ella entiende por hombría.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragFuenteovejuna.id,
        type: "contexto",
        ...anchor(fuenteovejunaText, "¿Vosotros sois hombres nobles?"),
        order: 1,
        content: `Laurencia acaba de escapar de Fernán Gómez, el comendador, que la ha raptado el mismo día de su boda con Frondoso. Irrumpe en el concejo, donde los hombres del pueblo llevan toda la escena discutiendo qué hacer sin decidirse a actuar, y en vez de pedir consuelo empieza a interrogarlos uno por uno.`,
      },
      {
        fragmentId: fragFuenteovejuna.id,
        type: "contexto",
        ...anchor(fuenteovejunaText, "Ovejas sois, bien lo dice\nde Fuente Ovejuna el nombre."),
        order: 2,
        content: `«Fuenteovejuna» dramatiza un episodio real: en 1476, los vecinos de esta villa cordobesa dieron muerte a su comendador, Fernán Gómez de Guzmán, tras años de abusos, y los Reyes Católicos absolvieron al pueblo entero del crimen, al no poder señalar a un culpable individual. Lope escribió la obra hacia 1612-1614, más de un siglo después de los hechos.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragFuenteovejuna.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(
          fuenteovejunaText,
          "¿Vosotros sois hombres nobles?\n¿Vosotros padres y deudos?\n¿Vosotros, que no se os rompen\nlas entrañas de dolor,\nde verme en tantos dolores?",
        ),
        order: 1,
        content: `**Anáfora interrogativa**: Laurencia abre su parlamento con tres preguntas que arrancan igual —«¿Vosotros sois...? ¿Vosotros...? ¿Vosotros, que...?»—, dirigidas a los mismos hombres que acaba de ver indecisos. No esperan respuesta: avanzan por etapas, poniendo en duda primero su nobleza, después su parentesco y, por último, su capacidad de compadecerse de ella.`,
      },
      {
        fragmentId: fragFuenteovejuna.id,
        type: "figura",
        category: "tropo",
        ...anchor(
          fuenteovejunaText,
          "Ovejas sois, bien lo dice\nde Fuente Ovejuna el nombre.\nLiebres cobardes nacisteis;\nbárbaros sois, no españoles.\nGallinas, ¡vuestras mujeres\nsufrís que otros hombres gocen!",
        ),
        order: 2,
        content: `**Cadena de metáforas degradantes**: en pocos versos, Laurencia convierte a los hombres del concejo en ovejas, liebres y gallinas —animales proverbialmente mansos o asustadizos—, y juega con el propio nombre del pueblo, «Fuente Ovejuna», como si ya fuera una sentencia. Cada animal añade un matiz distinto de cobardía, hasta culminar en la acusación más grave: ni siquiera son «españoles».`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragFuenteovejuna.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Qué les reprocha exactamente Laurencia a los hombres del concejo? Según el fragmento, ¿qué deberían hacer ellos, y qué amenaza con hacer ella misma —junto a «solas mujeres»— si no actúan?`,
      },
      {
        fragmentId: fragFuenteovejuna.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `Laurencia no apela solo a la justicia o a la venganza, sino a la vergüenza: llama a los hombres ovejas, liebres, gallinas e «hilanderas». ¿Por qué puede ser la vergüenza, y no solo el agravio sufrido, lo que finalmente los empuje a actuar? ¿Qué dice esto sobre cómo se medía entonces el «valor» de un hombre?`,
      },
      {
        fragmentId: fragFuenteovejuna.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `Laurencia mide el valor de los hombres por su disposición a tomar las armas, y amenaza con ocupar ella misma ese lugar —«que solas mujeres cobren / la honra»— si ellos no lo hacen. ¿Te parece que esta forma de entender el valor sigue vigente hoy? ¿Conoces otras formas de entender el valor que no dependan de la violencia?`,
      },

      // Intertextualidad
      {
        fragmentId: fragFuenteovejuna.id,
        type: "intertextualidad",
        ...anchor(fuenteovejunaText, "que solas mujeres cobren\nla honra de estos tiranos,"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragValor.id,
        content: `Leonor, en «Valor, agravio y mujer», y Laurencia, en «Fuenteovejuna», responden de forma opuesta al mismo problema: un agravio que los hombres de su entorno no han sabido o no han querido vengar. Leonor se viste de hombre para «cobrar» su honor ella misma, en singular y en secreto; Laurencia, sin disfrazarse, amenaza con que sean «solas mujeres» —en plural y a la vista de todos— quienes «cobren la honra» que los hombres del pueblo no han sabido defender. En ambos casos, recuperar el honor obliga a las mujeres a ocupar un lugar reservado, en principio, a los hombres.`,
      },
    ],
  });

  const rebelionText = `JUEZ. Decid, ¿quién mató a Fernando?

ESTEBAN. Fuente Ovejuna lo hizo.

LAURENCIA. Tu nombre, padre, eternizo.

FRONDOSO. ¡Bravo caso!

JUEZ. ¡Bravo caso! ¡Ese muchacho! ¡Aprieta, perro! Yo sé que lo sabes. ¡Di quién fue! ¿Callas? ¡Aprieta, borracho!

NIÑO. Fuente Ovejuna, señor.

JUEZ. ¡Por vida del Rey, villanos, que os ahorque con mis manos! ¿Quién mató al comendador?

FRONDOSO. ¡Que a un niño le den tormento, y niegue de aquesta suerte!

LAURENCIA. ¡Bravo pueblo!

FRONDOSO. ¡Bravo pueblo! Bravo y fuerte.

JUEZ. ¡Esa mujer! Al momento en ese potro tened. Dale esa mancuerda luego.

LAURENCIA. Ya está de cólera ciego.

JUEZ. ¡Que os he de matar, creed, en este potro, villanos! ¿Quién mató al comendador?

PASCUALA. Fuente Ovejuna, señor.`;

  const fragRebelion = await prisma.fragment.create({
    data: {
      slug: "fuente-ovejuna-lo-hizo",
      title: "La rebelión popular",
      location: "Fuenteovejuna, Acto tercero",
      headline: "Fuente Ovejuna lo hizo",
      text: rebelionText,
      order: 4,
      status: "published",
      featured: false,
      workId: fuenteovejunaWork.id,
      constellations: { connect: [{ slug: "poder" }, { slug: "honor-y-valor" }] },
      characters: {
        connect: [{ slug: "esteban" }, { slug: "laurencia" }, { slug: "frondoso" }],
      },
      places: { connect: [{ slug: "fuenteovejuna" }] },
      artworkImageUrl: "/images/artworks/pradilla-rendicion-de-granada.jpg",
      artworkTitle: "La rendición de Granada",
      artworkAuthor: "Francisco Pradilla, 1882",
      artworkCaption:
        "Pradilla pintó este lienzo para celebrar a los Reyes Católicos como garantes de un orden nuevo tras siglos de conflicto. Son esos mismos monarcas —invocados aquí por el juez («¡Por vida del Rey!») y antes por Esteban, que confiaba en que pondrían coto a comendadores como Fernán Gómez— quienes, según la crónica que inspira la obra, terminarán absolviendo a todo el pueblo de Fuente Ovejuna, incapaces de señalar un culpable individual entre tantas voces que responden lo mismo.",
    },
  });

  // ---------------------------------------------------------------------
  // Anotaciones — La opresión del comendador
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «La opresión del comendador»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragOpresion.id,
        type: "glosa",
        ...anchor(opresionText, "siguiendo un corcillo temeroso y topar tan bella gama"),
        order: 1,
        content: `«Corcillo»: diminutivo de «corzo» (un ciervo pequeño); «gama»: hembra del gamo. El comendador presenta su encuentro con Laurencia con el vocabulario de la caza, como si se hubiera topado con ella «por casualidad» mientras cazaba —y como si ella fuera, igual que el corzo, una pieza que se puede cobrar.`,
      },
      {
        fragmentId: fragOpresion.id,
        type: "glosa",
        ...anchor(opresionText, "a no veros con la Cruz"),
        order: 2,
        content: `«Cruz»: la cruz de la Orden de Calatrava, que el comendador lleva como caballero de esa orden militar y religiosa. Solo el respeto a ese hábito —dice Laurencia— le impide llamarlo directamente «demonio».`,
      },

      // Contextualización histórica
      {
        fragmentId: fragOpresion.id,
        type: "contexto",
        ...anchor(opresionText, "Pongo la ballesta en tierra, y a la prática de manos reduzgo melindres."),
        order: 1,
        content: `El comendador abandona aquí la retórica del «ruego amoroso» y el arma con la que ha llegado —la ballesta de cazador— para pasar a la agresión directa con las manos. La escena dramatiza, en pocas líneas, el paso de la insinuación al ataque.`,
      },
      {
        fragmentId: fragOpresion.id,
        type: "contexto",
        ...anchor(opresionText, "Si tomo la ballesta, ¡vive el cielo, que no la ponga en el hombro...!"),
        order: 2,
        content: `Esta es la primera intervención de Frondoso en la obra, y no podría ser más arriesgada: un vasallo se dispone a tomar el arma de su señor —el comendador— y a usarla contra él. En el orden social que retrata la comedia, este gesto es tan transgresor como el propio acoso que viene a impedir.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragOpresion.id,
        type: "figura",
        category: "tropo",
        ...anchor(opresionText, "siguiendo un corcillo temeroso y topar tan bella gama"),
        order: 1,
        content: `**Metáfora cinegética**: desde su primera línea, el comendador traduce el deseo en términos de caza —«corcillo», «gama»—, reduciendo a Laurencia a una pieza con la que se ha «topado». El lenguaje de la cortesía amorosa («ruego amoroso», unas líneas más abajo) convive con esta imagen que la convierte, de entrada, en presa.`,
      },
      {
        fragmentId: fragOpresion.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(
          opresionText,
          "COMENDADOR. No te defiendas.\n\nFRONDOSO. Si tomo la ballesta, ¡vive el cielo, que no la ponga en el hombro...!\n\nCOMENDADOR. Acaba, ríndete.\n\nLAURENCIA. ¡Cielos, ayudadme agora!\n\nCOMENDADOR. Solos estamos; no tengas miedo.",
        ),
        order: 2,
        content: `**Esticomitia**: las intervenciones se acortan hasta convertirse en frases de una sola línea que se suceden sin pausa, alternando entre los tres personajes. Este ritmo entrecortado —típico de los momentos de máxima tensión en el teatro del Siglo de Oro— precipita la llegada de Frondoso justo cuando el comendador se cree ya a solas con Laurencia.`,
      },
      {
        fragmentId: fragOpresion.id,
        type: "figura",
        category: "topos",
        ...anchor(
          opresionText,
          "Comendador generoso, dejad la moza o creed que de mi agravio y enojo será blanco vuestro pecho, aunque la Cruz me da asombro.",
        ),
        order: 3,
        content: `**El rescate de la doncella**: un hombre se interpone entre una mujer y quien la agrede, asumiendo el riesgo en su lugar. Lo que distingue esta escena de la fórmula habitual de la comedia de capa y espada es la desigualdad real entre los contendientes: no son dos caballeros equiparables, sino un labrador y el señor feudal de su pueblo.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragOpresion.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿De quién es originalmente la ballesta que aparece en esta escena, y quién la empuña al final? ¿Qué le dice esa persona al comendador?`,
      },
      {
        fragmentId: fragOpresion.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `Esta es la primera escena de la obra en la que aparecen Laurencia y Frondoso. ¿Qué efecto produce que el público los conozca así, en una situación de peligro, antes de saber nada más sobre ellos?`,
      },
      {
        fragmentId: fragOpresion.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `Frondoso arriesga su vida —y no solo la suya— al levantar un arma contra su señor. ¿Te parece un acto de valor, de imprudencia, o ambas cosas a la vez? ¿Habría tenido otras opciones?`,
      },

      // Intertextualidad
      {
        fragmentId: fragOpresion.id,
        type: "intertextualidad",
        ...anchor(opresionText, "¡Huye, Laurencia!"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragFuenteovejuna.id,
        content: `Aquí Frondoso actúa solo, sin esperar a que nadie más se decida: toma un arma y se enfrenta al comendador para que Laurencia pueda huir. Más adelante, cuando el comendador vuelva a atacar a Laurencia —el día de su boda con este mismo Frondoso— y los hombres del concejo no se atrevan a actuar, ella les exigirá precisamente eso: que hagan, todos juntos, lo que Frondoso hizo aquí en solitario.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Las víctimas de la injusticia
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Las víctimas de la injusticia»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragInjusticia.id,
        type: "glosa",
        ...anchor(injusticiaText, "¡Sí quisistes...!"),
        order: 1,
        content: `«Quisistes»: forma antigua de «quisisteis» (2.ª persona del plural). Esteban corrige sin rodeos al comendador, que acaba de negar algo que todo el pueblo sabe que es falso.`,
      },
      {
        fragmentId: fragInjusticia.id,
        type: "glosa",
        ...anchor(injusticiaText, "¡La vara quitalde!"),
        order: 2,
        content: `«Quitalde» = quitadle, y más adelante «dalle» = darle: formas en las que el pronombre átono se pospone al verbo y se asimila a él, normales en el castellano del Siglo de Oro. El comendador ordena, literalmente, «quitadle [la vara]» y luego «dadle [con ella]».`,
      },

      // Contextualización histórica
      {
        fragmentId: fragInjusticia.id,
        type: "contexto",
        ...anchor(
          injusticiaText,
          "¡Hola! ¡La vara quitalde!\n\nESTEBAN. Tomad, señor, norabuena.\n\nCOMENDADOR. Pues con ella quiero dalle, como a caballo brioso.",
        ),
        order: 1,
        content: `La «vara» era el bastón que distinguía a los alcaldes como representantes de la justicia del rey en sus villas. Al arrebatársela a Esteban y usarla para golpearlo, el comendador no solo lo agrede a él: degrada, ante todo el pueblo, el símbolo mismo de la autoridad real al nivel de un palo cualquiera.`,
      },
      {
        fragmentId: fragInjusticia.id,
        type: "contexto",
        ...anchor(injusticiaText, "que Reyes hay en Castilla, que nuevas órdenes hacen, con que desórdenes quitan."),
        order: 2,
        content: `Esteban se refiere a la política de los Reyes Católicos de sometar a su autoridad a las órdenes militares —como la de Calatrava, a la que pertenece el comendador— que durante el siglo XV habían actuado casi como pequeños reinos independientes. Es precisamente esa autoridad real, todavía una amenaza lejana aquí, la que al final de la obra decidirá sobre Fuente Ovejuna.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragInjusticia.id,
        type: "figura",
        category: "tropo",
        ...anchor(injusticiaText, "Pues con ella quiero dalle, como a caballo brioso."),
        order: 1,
        content: `**Comparación degradante**: el comendador compara a Esteban —un anciano, alcalde de la villa— con un «caballo brioso» al que hay que domar a golpes. La imagen reduce a una autoridad humana al estatus de un animal que se gobierna con el palo.`,
      },
      {
        fragmentId: fragInjusticia.id,
        type: "figura",
        category: "sonoro",
        ...anchor(injusticiaText, "que nuevas órdenes hacen, con que desórdenes quitan."),
        order: 2,
        content: `**Paronomasia**: «órdenes» y «desórdenes» comparten raíz, y Esteban juega con sus dos sentidos —las órdenes militares y religiosas (como la de Calatrava) y los mandatos reales que podrían frenar sus abusos («desórdenes»)—. El parecido sonoro entre ambas palabras subraya la ironía: una «orden» puede ser, ella misma, la fuente del «desorden».`,
      },
      {
        fragmentId: fragInjusticia.id,
        type: "figura",
        category: "topos",
        ...anchor(injusticiaText, "¡A un viejo de palos das!"),
        order: 3,
        content: `**La afrenta al anciano**: golpear a quien, por edad y por cargo, debería recibir el mayor respeto de la comunidad es una de las formas más elocuentes de mostrar que el poder del comendador no reconoce límite alguno —ni de autoridad, ni de edad, ni de parentesco con quienes él mismo ha agraviado antes.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragInjusticia.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Qué le ordena el comendador a Esteban que le entregue, y qué hace con ese objeto a continuación?`,
      },
      {
        fragmentId: fragInjusticia.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `Esteban habla de «órdenes» y «desórdenes» casi como si fueran la misma palabra. ¿A qué dos cosas distintas se refiere con cada una, y por qué el parecido entre ambas resulta irónico en su boca?`,
      },
      {
        fragmentId: fragInjusticia.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `El comendador convierte el símbolo de la justicia local —la vara del alcalde— en el arma con la que comete una injusticia. ¿Conoces ejemplos, antiguos o actuales, en los que un símbolo o una institución de autoridad se haya usado para hacer precisamente lo contrario de lo que representa?`,
      },

      // Intertextualidad
      {
        fragmentId: fragInjusticia.id,
        type: "intertextualidad",
        ...anchor(injusticiaText, "¡Justicia del cielo baje!"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragRebelion.id,
        content: `Esteban pide aquí una justicia que no llega del cielo, sino —mucho después, y solo cuando el pueblo entero se decide a actuar— de la propia gente de Fuente Ovejuna y, finalmente, de los mismos Reyes a los que se refería unas líneas antes. Su súplica encuentra respuesta, aunque no de la forma que él esperaba, en el interrogatorio que sigue al final de la obra.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — La rebelión popular
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «La rebelión popular»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragRebelion.id,
        type: "glosa",
        ...anchor(rebelionText, "¡Aprieta, perro!"),
        order: 1,
        content: `«Aprieta»: orden dirigida al verdugo para que apriete los instrumentos de tormento. Los insultos —«perro», «borracho»— que el juez dirige a un niño muestran hasta qué punto está dispuesto a llegar para obtener un nombre.`,
      },
      {
        fragmentId: fragRebelion.id,
        type: "glosa",
        ...anchor(rebelionText, "en ese potro tened. Dale esa mancuerda luego."),
        order: 2,
        content: `«Potro» y «mancuerda»: instrumentos de tormento judicial usados para arrancar confesiones; «luego» significa «al instante», no «más tarde». El juez ordena aplicarlos a una mujer sin ninguna otra formalidad.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragRebelion.id,
        type: "contexto",
        ...anchor(rebelionText, "Decid, ¿quién mató a Fernando?"),
        order: 1,
        content: `«Fernando» es Fernán Gómez de Guzmán, el comendador muerto —no el rey—. Un juez enviado por los Reyes Católicos llega a Fuente Ovejuna para investigar su muerte y, conforme a la ley de la época, recurre al tormento para obtener confesiones de los testigos.`,
      },
      {
        fragmentId: fragRebelion.id,
        type: "contexto",
        ...anchor(rebelionText, "¡Que a un niño le den tormento, y niegue de aquesta suerte!"),
        order: 2,
        content: `El tormento judicial era, en la época, un procedimiento legal para obtener confesiones, aplicado sin distinción de edad o sexo. Lope no oculta esa crueldad institucional: la dramatiza para que el espectador la juzgue, igual que ha juzgado antes la del comendador.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragRebelion.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(rebelionText, "Fuente Ovejuna lo hizo."),
        order: 1,
        content: `**Estribillo**: a la pregunta «¿quién mató al comendador?», un hombre, un niño y una mujer responden, por separado y bajo tormento, exactamente lo mismo —«Fuente Ovejuna lo hizo» / «Fuente Ovejuna, señor»—. La repetición convierte la respuesta individual en un único coro: no hay un culpable que señalar, porque todos responden con la misma voz.`,
      },
      {
        fragmentId: fragRebelion.id,
        type: "figura",
        category: "tropo",
        ...anchor(rebelionText, "¡Bravo pueblo!\n\nFRONDOSO. ¡Bravo pueblo! Bravo y fuerte."),
        order: 2,
        content: `**El pueblo como un solo cuerpo**: Laurencia y Frondoso repiten la misma exclamación —«¡Bravo pueblo!»— como si «el pueblo» fuera, ya, un único sujeto con una sola voz, igual que un momento después responderá un solo nombre —«Fuente Ovejuna»— a la pregunta del juez.`,
      },
      {
        fragmentId: fragRebelion.id,
        type: "figura",
        category: "topos",
        ...anchor(rebelionText, "Ya está de cólera ciego."),
        order: 3,
        content: `**Martirio colectivo**: hombre, niño y mujer soportan el tormento sin delatar a nadie, como mártires que protegen a la comunidad con su silencio. El tópico, habitual en relatos hagiográficos, se traslada aquí a un contexto político: lo que se protege no es la fe, sino la justicia que el pueblo se ha tomado por su mano.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragRebelion.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Cuántas personas son interrogadas en este fragmento, quiénes son, y qué responde cada una a la pregunta del juez?`,
      },
      {
        fragmentId: fragRebelion.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `¿Qué consigue Lope al hacer que un hombre, un niño y una mujer —bajo tormento y por separado— respondan exactamente lo mismo? ¿Cómo cambiaría la escena si solo uno de ellos hablara así y los otros confesaran un nombre?`,
      },
      {
        fragmentId: fragRebelion.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `«Fuente Ovejuna lo hizo» se ha convertido en una expresión proverbial para describir una responsabilidad asumida colectivamente, sin que se pueda (o se quiera) señalar a un culpable individual. ¿Te parece una forma legítima de hacer justicia? ¿Conoces situaciones, históricas o actuales, en las que ocurra algo parecido?`,
      },

      // Intertextualidad
      {
        fragmentId: fragRebelion.id,
        type: "intertextualidad",
        ...anchor(rebelionText, "Tu nombre, padre, eternizo."),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragFuenteovejuna.id,
        content: `Esta escena es la consecuencia directa de la arenga de Laurencia a los hombres del concejo: avergonzados por ella, se levantaron contra el comendador, y ahora Esteban —el padre al que el comendador había humillado con su propia vara— responde al juez sin vacilar. El verso de Laurencia, «tu nombre, padre, eternizo», cierra el círculo que ella misma abrió.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Itinerario: «Nombrar el valor»
  // ---------------------------------------------------------------------
  console.log("Creando itinerario «Nombrar el valor»...");

  const itinerarioValor = await prisma.itinerary.create({
    data: {
      slug: "nombrar-el-valor",
      title: "Nombrar el valor",
      description: `Siete textos, del destierro del Cid a los sueños de Segismundo, que ponen a prueba una misma palabra: valor. El valor del guerrero desterrado y el del rey moro que elige la lealtad, el del pícaro que sobrevive a costa del hambre y el ingenio, el del caballero que carga contra molinos creyéndolos gigantes, el de un pueblo entero que se levanta contra su señor, el de una mujer que se viste de hombre para recobrar su honra, y el de un príncipe que descubre que también el poder —y quizá el valor mismo— puede ser solo un sueño.`,
    },
  });

  await prisma.itineraryFragment.createMany({
    data: [
      { itineraryId: itinerarioValor.id, fragmentId: fragCid.id, order: 1 },
      { itineraryId: itinerarioValor.id, fragmentId: fragAbenamar.id, order: 2 },
      { itineraryId: itinerarioValor.id, fragmentId: fragRacimo.id, order: 3 },
      { itineraryId: itinerarioValor.id, fragmentId: fragMolinos.id, order: 4 },
      { itineraryId: itinerarioValor.id, fragmentId: fragFuenteovejuna.id, order: 5 },
      { itineraryId: itinerarioValor.id, fragmentId: fragValor.id, order: 6 },
      { itineraryId: itinerarioValor.id, fragmentId: fragSuenos.id, order: 7 },
    ],
  });

  // ---------------------------------------------------------------------
  // Autor y obra: Gonzalo de Berceo — Milagros de Nuestra Señora
  // ---------------------------------------------------------------------
  console.log("Creando obra «Milagros de Nuestra Señora» (Berceo)...");

  const berceo = await prisma.author.create({
    data: {
      slug: "gonzalo-de-berceo",
      name: "Gonzalo de Berceo",
      birthYear: 1196,
      deathYear: 1264,
      country: "España",
      era: "Edad Media",
      bio: `Gonzalo de Berceo (h. 1196 - después de 1264) es el primer poeta castellano de nombre conocido. Clérigo secular vinculado al monasterio de San Millán de la Cogolla, en La Rioja, perteneció al mester de clerecía: clérigos cultos que, a diferencia de los juglares de la épica, componían en cuaderna vía —series de cuatro versos alejandrinos monorrimos— con una finalidad didáctica y religiosa, dirigida sin embargo a un público popular y oral. Su obra más conocida, los Milagros de Nuestra Señora, traduce y amplifica relatos marianos de origen latino, acercando la figura de la Virgen al lenguaje, los objetos y las preocupaciones de la vida cotidiana medieval.`,
      portraitUrl: "/images/authors/gonzalo-de-berceo.jpg",
    },
  });

  const milagros = await prisma.work.create({
    data: {
      slug: "milagros-de-nuestra-senora",
      title: "Milagros de Nuestra Señora",
      year: 1260,
      era: "Edad Media",
      genre: "Poesía narrativa (mester de clerecía)",
      synopsis: `Colección de veinticinco relatos breves en cuaderna vía que exaltan la figura de la Virgen mediante una religiosidad cercana al pueblo. Los relatos presentan a diversos personajes que caen en el pecado o se enfrentan a la muerte; la Virgen interviene de forma milagrosa para salvar sus almas o sus vidas, mostrando un rostro que oscila entre la madre protectora y la esposa exigente.`,
      authorId: berceo.id,
    },
  });

  const canonigoCaidaText = `En la ciudad de Pisa, ciudad bien cabecera
que en puerto de mar yace, rica de gran manera,
un canónigo había de muy buena alcavera:
llamaban San Casiano donde el canónigo era [...]

No usaba en ese tiempo aún la clerecía
recitarte las horas a ti, Virgo María,
pero él las decía siempre, a cada día,
de ello tenía la Virgen gran sabor y alegría.

Sus parientes tenían este hijo señero;
cuando ellos finasen sería buen heredero:
dejábanle de mueble asaz rico cillero,
que tenían casamiento bastante deseadero.

Cuando el padre y la madre fueron ambos finados,
vinieron los parientes tristes y desolados:
decíanle que casara y tuviera hijos criados,
que no quedasen yermos lugares tan preciados.

Cambiose de propósito, dejó el que antes tenía,
cedió a la ley del siglo, y dijo que lo haría.
Buscáronle la esposa tal cual le convenía,
y fijaron el día que las bodas haría.

Cuando llegó el día de las bodas correr
iba con sus parientes a buscar su mujer;
ahora a la Gloriosa no podía atender
como bien lo solía en otro tiempo hacer.`;

  const fragCanonigoCaida = await prisma.fragment.create({
    data: {
      slug: "la-caida-del-canonigo",
      title: "El canónigo de Pisa",
      location: "Milagros de Nuestra Señora (I)",
      headline: "Cambiose de propósito, dejó el que antes tenía",
      text: canonigoCaidaText,
      order: 1,
      status: "published",
      featured: false,
      workId: milagros.id,
      constellations: { connect: [{ slug: "fe" }] },
      characters: { connect: [{ slug: "virgen-maria" }] },
      artworkImageUrl: "/images/artworks/fra-angelico-anunciacion.jpg",
      artworkTitle: "La Anunciación",
      artworkAuthor: "Fra Angelico, h. 1440-1445",
      artworkCaption:
        "La devoción mariana y la tensión entre lo mundano y lo sagrado que atraviesa este milagro encuentran su equivalente pictórico en esta tabla, donde la Virgen aparece serena e inaccesible frente a quien la abandona por los placeres del mundo.",
    },
  });

  const canonigoVirgenText = `Yendo por el camino a cumplir su concierto
se acordó de la Virgen a quien hacía este tuerto;
se tuvo por errado y se tuvo por muerto,
y pensó que esta cosa llegaría a mal puerto. [...]

Entrose de la iglesia al último rincón,
inclinó sus hinojos, hacía su oración;
vino a él la Gloriosa plena de bendición,
y como con gran saña díjole esta razón:

«Don bobo, desgraciado, torpe y enloquecido,
¿en qué ruidos te andas, y en qué cosa has caído?
Pareces herbolado que has las hierbas bebido
y que eres del báculo de San Martín tañido.

Asaz eras varón bien casado conmigo,
yo mucho te quería como a buen amigo;
pero tú andas buscando mejor que pan de trigo:
no valdrás más, por eso, de cuanto vale un higo.

Si tú a mí me quisieras creer bien y escuchar,
de la vida primera no te habrías de apartar,
y no me dejarías para otra tomar:
si no, la leña a cuestas la tendrás que llevar.»`;

  const fragCanonigoVirgen = await prisma.fragment.create({
    data: {
      slug: "el-reproche-de-la-virgen",
      title: "El canónigo de Pisa",
      location: "Milagros de Nuestra Señora (II)",
      headline: "Asaz eras varón bien casado conmigo",
      text: canonigoVirgenText,
      order: 2,
      status: "published",
      featured: false,
      workId: milagros.id,
      constellations: { connect: [{ slug: "fe" }, { slug: "amor" }] },
      characters: { connect: [{ slug: "virgen-maria" }] },
      topics: { connect: [{ slug: "amor-cortes" }] },
      artworkImageUrl: "/images/artworks/piero-della-francesca-virgen-misericordia.jpg",
      artworkTitle: "La Virgen de la Misericordia",
      artworkAuthor: "Piero della Francesca, 1445-1462",
      artworkCaption:
        "La Virgen como figura protectora pero también exigente —que cobija a los suyos bajo su manto pero castiga a quienes la abandonan— halla su imagen más poderosa en esta tabla, donde María extiende su manto sobre una comunidad de fieles con una presencia a la vez maternal y severa.",
    },
  });

  const canonigoSalvacionText = `Dejó mujer hermosa y muy gran posesión,
lo que harían bien pocos de los que ahora son;
nunca entender pudieron adónde cayó o non:
quien por Dios tanto hace, tenga Su bendición.

Creemos y pensamos que este buen barón
buscó algún buen lugar de grande religión
y estuvo allí escondido, viviendo en oración,
por donde ganó su alma de Dios buen galardón.

Bien debemos creer que la Madre Gloriosa,
por quien hizo este hombre esta tamaña cosa,
no sabría olvidarlo, siendo como es piadosa,
y bien lo haría posar allá donde Ella posa.`;

  const fragCanonigoSalvacion = await prisma.fragment.create({
    data: {
      slug: "la-salvacion-del-canonigo",
      title: "El canónigo de Pisa",
      location: "Milagros de Nuestra Señora (III)",
      headline: "Quien por Dios tanto hace, tenga Su bendición",
      text: canonigoSalvacionText,
      order: 3,
      status: "published",
      featured: false,
      workId: milagros.id,
      constellations: { connect: [{ slug: "fe" }] },
      characters: { connect: [{ slug: "virgen-maria" }] },
      topics: { connect: [{ slug: "contemptus-mundi" }] },
      artworkImageUrl: "/images/artworks/el-greco-san-jeronimo-penitente.jpg",
      artworkTitle: "San Jerónimo penitente",
      artworkAuthor: "El Greco, h. 1600",
      artworkCaption:
        "La renuncia al mundo y la entrega a la vida ascética y orante que protagoniza el canónigo al final del milagro tienen su mejor eco pictórico en esta imagen del santo retirado en el desierto, con la expresión vuelta hacia lo divino y la carne macilenta por la penitencia.",
    },
  });

  const partoMaravillosoText = `Cerca de una marisma que Tumba era llamada,
hacíase una isla a tierra aproximada;
hacia la mar por ella su salida y su tornada
dos veces en el día, o tres a la vegada.

En medio de la isla, por las ondas cercada,
había una capilla a San Miguel sagrada:
era celda preciosa, de virtud bien probada,
pero era no poco arriesgada su entrada.

Cuando quería el mar hacia fuera salir
salía a fiera prisa, no se sabría sufrir:
aunque ligero, nadie le podría huir
por no haber salido antes, debía allí morir [...]

Un día por ventura con la otra mesnada
metiose una mujer debilucha y preñada;
no supo regularse muy bien a la tornada,
y estaba arrepentida de haber hecho esa entrada [...]

Sin poder hacer más, todos con aflicción
«¡Santa María, válgasle!» decían de corazón.
La preñada mezquina, llena de desazón
quedose entre las ondas en fiera situación.

Los que habían salido, como no veían nada
cuidaban sin duda que había muerto ahogada;
decían: «Esta mezquina fue desaventurada;
¡sus pecados tendiéronle una mala celada».

Estándome yo en esto vino Santa María,
cubriome con la manga de su rica almejía:
ya no sentí el peligro más que cuando dormía;
si estuviera en un baño, más leda no estaría.

Sin cuitas y sin pena, y sin ningún dolor
parí este pequeñuelo, loado sea el Criador:
tuve buena madrina, no podría mejor;
me hizo misericordia la Madre del Señor.`;

  const fragPartoMaravilloso = await prisma.fragment.create({
    data: {
      slug: "un-parto-maravilloso",
      title: "Un parto maravilloso",
      location: "Milagros de Nuestra Señora",
      headline: "Estándome yo en esto vino Santa María",
      text: partoMaravillosoText,
      order: 4,
      status: "published",
      featured: false,
      workId: milagros.id,
      constellations: { connect: [{ slug: "fe" }, { slug: "muerte" }] },
      characters: { connect: [{ slug: "virgen-maria" }] },
      artworkImageUrl: "/images/artworks/gentileschi-nacimiento-san-juan-bautista.jpg",
      artworkTitle: "El nacimiento de san Juan Bautista",
      artworkAuthor: "Artemisia Gentileschi, h. 1635",
      artworkCaption:
        "El parto milagroso rodeado de agua y la presencia divina que ampara a la madre tienen una réplica pictórica en esta escena de nacimiento presidida por una figura femenina poderosa, iluminada por una luz sobrenatural que transforma el dolor en gracia.",
    },
  });

  // ---------------------------------------------------------------------
  // Anotaciones — El canónigo de Pisa (I): La caída
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «El canónigo de Pisa (I)»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragCanonigoCaida.id,
        type: "glosa",
        ...anchor(canonigoCaidaText, "de muy buena alcavera"),
        order: 1,
        content: `«Alcavera»: familia, linaje. Desde el primer verso, Berceo señala el buen origen social del protagonista: su caída no se debe a la necesidad ni a la ignorancia, sino a una elección.`,
      },
      {
        fragmentId: fragCanonigoCaida.id,
        type: "glosa",
        ...anchor(canonigoCaidaText, "recitarte las horas a ti, Virgo María"),
        order: 2,
        content: `«Las horas»: el rezo diario de las Horas de Santa María (un conjunto de oraciones marianas), práctica devocional poco extendida entre el clero de la época. Que el canónigo la cumpliera «siempre, a cada día» establece, antes del relato, su mérito especial ante la Virgen.`,
      },
      {
        fragmentId: fragCanonigoCaida.id,
        type: "glosa",
        ...anchor(canonigoCaidaText, "asaz rico cillero"),
        order: 3,
        content: `«Asaz»: muy. «Cillero»: despensa, conjunto de bienes y provisiones. La herencia que recibe el canónigo —«asaz rico cillero»— es, junto con su buena «alcavera», lo que hace tan tentadora la propuesta de boda de sus parientes.`,
      },
      {
        fragmentId: fragCanonigoCaida.id,
        type: "glosa",
        ...anchor(canonigoCaidaText, "cedió a la ley del siglo"),
        order: 4,
        content: `«Siglo»: la vida mundana, en oposición a la vida religiosa o «de Dios». «Ceder a la ley del siglo» significa abandonar la devoción cotidiana por las obligaciones y placeres del mundo —el matrimonio, la hacienda, la familia.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragCanonigoCaida.id,
        type: "contexto",
        ...anchor(canonigoCaidaText, "En la ciudad de Pisa, ciudad bien cabecera"),
        order: 1,
        content: `Berceo escribe en cuaderna vía: estrofas de cuatro versos alejandrinos (catorce sílabas) con una sola rima, propias del mester de clerecía. Es una forma culta, aprendida en latín, pero puesta al servicio de relatos sencillos y morales, pensados para ser recitados ante un público que no sabía leer.`,
      },
      {
        fragmentId: fragCanonigoCaida.id,
        type: "contexto",
        ...anchor(canonigoCaidaText, "que no quedasen yermos lugares tan preciados"),
        order: 2,
        content: `La presión de los parientes para que el huérfano se case y tenga descendencia responde a una lógica muy extendida en la sociedad medieval: la continuidad del linaje y de su patrimonio («lugares tan preciados») se considera una obligación que prevalece sobre la vocación religiosa individual.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragCanonigoCaida.id,
        type: "figura",
        category: "sonoro",
        ...anchor(canonigoCaidaText, "cuando ellos finasen sería buen heredero"),
        order: 1,
        content: `**Derivación**: «finasen» (muriesen) anticipa, dos versos más adelante, «fueron ambos finados» (murieron). La repetición de la misma raíz verbal subraya que la muerte de los padres es la bisagra que hace girar toda la historia: solo a partir de ella se desencadena la tentación.`,
      },
      {
        fragmentId: fragCanonigoCaida.id,
        type: "figura",
        category: "topos",
        ...anchor(canonigoCaidaText, "Cambiose de propósito, dejó el que antes tenía"),
        order: 2,
        content: `**Tópico de la mudanza**: este verso, colocado al inicio de su estrofa, funciona como bisagra narrativa: resume en seis palabras el giro moral de todo el relato, del mismo modo que en otros milagros un solo verso marca el instante exacto de la caída en el pecado.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragCanonigoCaida.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Qué hacía el canónigo cada día antes de la muerte de sus padres? ¿Qué deciden sus parientes después, y cómo responde él?`,
      },
      {
        fragmentId: fragCanonigoCaida.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El poema insiste en que el canónigo recitaba sus oraciones a la Virgen «siempre, a cada día» y que «de ello tenía la Virgen gran sabor y alegría». ¿Por qué crees que Berceo subraya esta devoción constante justo antes de narrar su abandono? ¿Qué efecto produce este contraste en el desarrollo del milagro?`,
      },

      // Intertextualidad
      {
        fragmentId: fragCanonigoCaida.id,
        type: "intertextualidad",
        ...anchor(canonigoCaidaText, "ahora a la Gloriosa no podía atender\ncomo bien lo solía en otro tiempo hacer"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragCanonigoVirgen.id,
        content: `Este último verso —el devoto que ya «no podía atender» a la Virgen— es la falta que la propia Virgen vendrá a reprocharle, con palabras muy distintas a las habituales en su iconografía, en el fragmento siguiente, «El reproche de la Virgen».`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — El canónigo de Pisa (II): El reproche de la Virgen
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «El canónigo de Pisa (II)»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragCanonigoVirgen.id,
        type: "glosa",
        ...anchor(canonigoVirgenText, "a quien hacía este tuerto"),
        order: 1,
        content: `«Tuerto»: agravio, ofensa. El propio canónigo, camino de su boda, reconoce que está cometiendo una injusticia contra la Virgen —antes de que sea ella quien se lo reproche en persona.`,
      },
      {
        fragmentId: fragCanonigoVirgen.id,
        type: "glosa",
        ...anchor(canonigoVirgenText, "inclinó sus hinojos"),
        order: 2,
        content: `«Hinojos»: rodillas. El canónigo se arrodilla a rezar, como hacía «siempre, a cada día» en el fragmento anterior: es justo en ese gesto de devoción recuperada cuando se le aparece la Virgen.`,
      },
      {
        fragmentId: fragCanonigoVirgen.id,
        type: "glosa",
        ...anchor(canonigoVirgenText, "Pareces herbolado que has las hierbas bebido\ny que eres del báculo de San Martín tañido"),
        order: 3,
        content: `«Herbolado»: envenenado con hierbas, es decir, fuera de juicio. «Del báculo de San Martín tañido»: borracho —a San Martín se le consideraba patrón de los bebedores—. La Virgen acumula dos imágenes de embriaguez y locura para describir la decisión del canónigo: solo alguien que no está en su sano juicio renunciaría a ella.`,
      },
      {
        fragmentId: fragCanonigoVirgen.id,
        type: "glosa",
        ...anchor(canonigoVirgenText, "la leña a cuestas la tendrás que llevar"),
        order: 4,
        content: `Esta expresión —cargar con leña a la espalda— equivale a «pasarás penalidades». La amenaza cierra el discurso de la Virgen con una imagen muy física y cotidiana, alejada del lenguaje solemne que cabría esperar de una aparición divina.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragCanonigoVirgen.id,
        type: "contexto",
        ...anchor(canonigoVirgenText, "vino a él la Gloriosa plena de bendición"),
        order: 1,
        content: `Las apariciones marianas que intervienen directamente en la vida de los devotos —para premiar, advertir o castigar— son el mecanismo central de todo el libro de Berceo: a diferencia de Dios, lejano y abstracto, la Virgen actúa como una presencia cercana, casi doméstica, que conoce a cada uno de sus fieles por su nombre y su historia.`,
      },
      {
        fragmentId: fragCanonigoVirgen.id,
        type: "contexto",
        ...anchor(canonigoVirgenText, "Asaz eras varón bien casado conmigo"),
        order: 2,
        content: `Berceo recurre al vocabulario del matrimonio y del vasallaje —«bien casado conmigo», «para otra tomar»— para describir la relación entre el devoto y la Virgen. Es el mismo lenguaje que, por esos años, la poesía cortesana emplea para hablar del amor entre el caballero y su dama: el «amor cortés» presta su gramática incluso a la devoción religiosa.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragCanonigoVirgen.id,
        type: "figura",
        category: "tropo",
        ...anchor(canonigoVirgenText, "no valdrás más, por eso, de cuanto vale un higo"),
        order: 1,
        content: `**Comparación degradante**: frente a la grandeza del personaje que habla —la propia Virgen María—, esta imagen, sacada del lenguaje cotidiano y casi del insulto popular, introduce un registro cómico que acerca lo divino al público llano al que se dirige Berceo.`,
      },
      {
        fragmentId: fragCanonigoVirgen.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(canonigoVirgenText, "«Don bobo, desgraciado, torpe y enloquecido,\n¿en qué ruidos te andas, y en qué cosa has caído?"),
        order: 2,
        content: `**Acumulación e interrogación retórica**: la Virgen abre su discurso con una serie de cuatro insultos seguidos de dos preguntas que no esperan respuesta. Este arranque, más propio de una riña doméstica que de una aparición celestial, marca el tono de todo el reproche que sigue.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragCanonigoVirgen.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Dónde y en qué momento se le aparece la Virgen al canónigo? ¿Qué le pide que haga, y qué le ocurrirá si no le hace caso?`,
      },
      {
        fragmentId: fragCanonigoVirgen.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `La Virgen que habla en este fragmento —que insulta, amenaza y reclama exclusividad— es muy distinta de la imagen serena y maternal que suele representarse en la pintura religiosa. ¿Qué efecto te produce este retrato? ¿Por qué crees que Berceo elige mostrarla así ante un público popular?`,
      },

      // Intertextualidad
      {
        fragmentId: fragCanonigoVirgen.id,
        type: "intertextualidad",
        ...anchor(canonigoVirgenText, "Yendo por el camino a cumplir su concierto"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragCanonigoCaida.id,
        content: `Este fragmento retoma directamente la situación final de «El canónigo de Pisa (I)»: el devoto que, camino de su boda, ya «no podía atender» a la Virgen, se encuentra ahora cara a cara con ella, que viene a reclamarle precisamente ese abandono.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — El canónigo de Pisa (III): La salvación
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «El canónigo de Pisa (III)»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragCanonigoSalvacion.id,
        type: "glosa",
        ...anchor(canonigoSalvacionText, "este buen barón"),
        order: 1,
        content: `«Barón»: hombre, varón —sin la connotación nobiliaria que el término tendría más tarde—. El narrador empieza a llamar «buen barón» al canónigo justo en el momento en que este abandona los bienes y la boda que antes había aceptado.`,
      },
      {
        fragmentId: fragCanonigoSalvacion.id,
        type: "glosa",
        ...anchor(canonigoSalvacionText, "ganó su alma de Dios buen galardón"),
        order: 2,
        content: `«Galardón»: premio, recompensa. El vocabulario es el mismo que usaría un caballero al hablar de las ganancias obtenidas en una batalla o una empresa: aquí, la «ganancia» del canónigo es de naturaleza espiritual.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragCanonigoSalvacion.id,
        type: "contexto",
        ...anchor(canonigoSalvacionText, "Dejó mujer hermosa y muy gran posesión"),
        order: 1,
        content: `La renuncia voluntaria a una mujer hermosa y a una gran fortuna —justo lo que sus parientes le habían procurado— es la prueba que demuestra la sinceridad de la conversión del canónigo. Este esquema, abandonar los bienes del mundo para entregarse a la vida religiosa, es uno de los más repetidos en la literatura hagiográfica medieval.`,
      },
      {
        fragmentId: fragCanonigoSalvacion.id,
        type: "contexto",
        ...anchor(canonigoSalvacionText, "nunca entender pudieron adónde cayó o non"),
        order: 2,
        content: `El relato no explica adónde fue el canónigo ni qué fue exactamente de él: la propia comunidad que lo conocía se queda sin respuesta. Este final abierto, lejos de ser un defecto, refuerza el carácter misterioso y milagroso de lo sucedido: lo importante no es el destino concreto del hombre, sino la certeza de que la Virgen veló por él.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragCanonigoSalvacion.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(canonigoSalvacionText, "Creemos y pensamos que este buen barón"),
        order: 1,
        content: `**Voz colectiva del narrador**: Berceo no narra ya como un testigo que conoce los hechos, sino como portavoz de una comunidad que «cree y piensa» —sin poder afirmarlo con certeza— qué fue del canónigo. Esta primera persona del plural acerca al juglar-narrador y a su público, que comparten la misma fe en el desenlace, aunque no lo hayan visto.`,
      },
      {
        fragmentId: fragCanonigoSalvacion.id,
        type: "figura",
        category: "topos",
        ...anchor(canonigoSalvacionText, "no sabría olvidarlo, siendo como es piadosa"),
        order: 2,
        content: `**Tópico de la intercesión mariana**: la idea de que la Virgen «no sabría olvidar» a quienes la han servido, y que vela por su destino incluso después de un episodio de reproche y enfado, resume la lógica de todo el libro: el pecado se castiga, pero la devoción anterior nunca queda sin recompensa.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragCanonigoSalvacion.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `Según el narrador, ¿qué hace el canónigo después de abandonar a su prometida? ¿Llega la gente a saber con certeza qué pasó con él?`,
      },
      {
        fragmentId: fragCanonigoSalvacion.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `A lo largo de las tres partes de este milagro, la Virgen pasa de ser alguien a quien el canónigo «no podía atender», a una figura que lo insulta y amenaza, y finalmente a una «Madre Gloriosa» que «no sabría olvidarlo». ¿Cómo describirías esta evolución? ¿Qué idea de la relación entre el creyente y la divinidad transmite?`,
      },

      // Intertextualidad
      {
        fragmentId: fragCanonigoSalvacion.id,
        type: "intertextualidad",
        ...anchor(canonigoSalvacionText, "Dejó mujer hermosa y muy gran posesión"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragCanonigoVirgen.id,
        content: `La renuncia del canónigo a «mujer hermosa y muy gran posesión» es la respuesta directa a la amenaza que la Virgen le había dirigido en «El reproche de la Virgen»: el milagro se cierra cuando el devoto elige, definitivamente, no «buscar mejor que pan de trigo».`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Un parto maravilloso
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Un parto maravilloso»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragPartoMaravilloso.id,
        type: "glosa",
        ...anchor(partoMaravillosoText, "que Tumba era llamada"),
        order: 1,
        content: `«Tumba»: nombre por el que se conocía San Miguel de la Tumba, en el célebre Mont Saint Michel (Francia), uno de los grandes centros de peregrinación de la Edad Media. Berceo traslada al castellano un milagro de origen y ambientación francesas.`,
      },
      {
        fragmentId: fragPartoMaravilloso.id,
        type: "glosa",
        ...anchor(partoMaravillosoText, "cubriome con la manga de su rica almejía"),
        order: 2,
        content: `«Almejía»: manto. El gesto de la Virgen —cubrir a la mujer con su propio manto— es una de las imágenes marianas más extendidas de la Edad Media, la misma que representa el cuadro recomendado para este fragmento.`,
      },
      {
        fragmentId: fragPartoMaravilloso.id,
        type: "glosa",
        ...anchor(partoMaravillosoText, "más leda no estaría"),
        order: 3,
        content: `«Leda»: feliz, contenta. La mujer compara su estado bajo el manto de la Virgen con el de quien estuviera «en un baño»: del peligro mortal del agua del mar pasa, sin transición, al bienestar de otra agua, doméstica y placentera.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragPartoMaravilloso.id,
        type: "contexto",
        ...anchor(partoMaravillosoText, "había una capilla a San Miguel sagrada"),
        order: 1,
        content: `El Mont Saint Michel, donde se sitúa este milagro, es un islote que la marea aísla por completo de la costa dos o tres veces al día —tal como describen los primeros versos—. Llegar hasta su capilla suponía un peligro real para los peregrinos medievales, lo que convertía cada visita en una prueba de fe.`,
      },
      {
        fragmentId: fragPartoMaravilloso.id,
        type: "contexto",
        ...anchor(partoMaravillosoText, "metiose una mujer debilucha y preñada"),
        order: 2,
        content: `El embarazo y el parto eran, en la Edad Media, situaciones de riesgo mortal real para las mujeres. Que esta peregrina, «debilucha y preñada», se arriesgue a cruzar un paso que «debía allí morir» quien quedara atrapado, multiplica el peligro y, con él, el valor del milagro que sigue.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragPartoMaravilloso.id,
        type: "figura",
        category: "tropo",
        ...anchor(partoMaravillosoText, "Cuando quería el mar hacia fuera salir\nsalía a fiera prisa, no se sabría sufrir"),
        order: 1,
        content: `**Personificación**: el mar «quiere salir» y lo hace «a fiera prisa», como una criatura voraz e implacable —«nadie le podría huir»—. La marea se convierte así en un antagonista casi vivo, tan peligroso como cualquier monstruo de la épica o el romance.`,
      },
      {
        fragmentId: fragPartoMaravilloso.id,
        type: "figura",
        category: "sonoro",
        ...anchor(partoMaravillosoText, "«¡Santa María, válgasle!» decían de corazón"),
        order: 2,
        content: `**Apóstrofe colectiva**: ante la mujer perdida entre las olas, todo el grupo de peregrinos exclama a una sola voz el nombre de la Virgen. Esta invocación coral, breve y directa, reproduce el tipo de oración popular y oral que el propio poema de Berceo está destinado a fomentar entre su público.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragPartoMaravilloso.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Qué le ocurre a la mujer embarazada cuando sube la marea? ¿Qué cree la gente que le ha pasado, y qué sucede en realidad?`,
      },
      {
        fragmentId: fragPartoMaravilloso.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `En «El canónigo de Pisa» la Virgen se presenta como una esposa exigente que reprocha y amenaza; aquí, en cambio, aparece como una madre que protege y socorre sin pedir nada a cambio. ¿Qué relación encuentras entre estos dos retratos de un mismo personaje? ¿Crees que responden a necesidades distintas de quienes escuchaban estos relatos?`,
      },

      // Intertextualidad
      {
        fragmentId: fragPartoMaravilloso.id,
        type: "intertextualidad",
        ...anchor(partoMaravillosoText, "Estándome yo en esto vino Santa María"),
        order: 1,
        linkType: "external",
        externalCitation: `Alfonso X el Sabio, Cantigas de Santa María (s. XIII)`,
        content: `Apenas una generación después de Berceo, Alfonso X reúne en gallego-portugués más de cuatrocientas «cantigas» que narran milagros marianos muy similares a este —incluidos varios partos milagrosos y salvamentos en el mar—, con el mismo propósito devocional y popular: mostrar a la Virgen como una madre que interviene en lo cotidiano para socorrer a quienes la invocan «de corazón».`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Autor y obra: Juan Ruiz, Arcipreste de Hita — Libro de buen amor
  // ---------------------------------------------------------------------
  console.log("Creando obra «Libro de buen amor» (Arcipreste de Hita)...");

  const arcipreste = await prisma.author.create({
    data: {
      slug: "arcipreste-de-hita",
      name: "Juan Ruiz, Arcipreste de Hita",
      birthYear: 1283,
      deathYear: 1350,
      country: "España",
      era: "Edad Media",
      bio: `Juan Ruiz, Arcipreste de Hita (h. 1283 - h. 1350), es uno de los grandes nombres de la literatura medieval castellana, aunque apenas se conocen datos seguros de su vida más allá de los que él mismo ofrece, no siempre fiables, en su obra. Su Libro de buen amor, compuesto hacia 1330 y revisado en 1343, se presenta como una autobiografía ficticia en la que el propio autor narra, en primera persona, sus fracasados intentos amorosos, entremezclando fábulas, exempla morales, parodias y digresiones de todo tipo. Escrito en cuaderna vía —la misma estrofa de Gonzalo de Berceo— pero con un tono radicalmente distinto, irónico y ambiguo, el libro oscila constantemente entre la advertencia moral y la celebración del placer, sin que el lector pueda estar nunca seguro de cuál de los dos planos predomina.`,
      portraitUrl: "/images/authors/arcipreste-de-hita.jpg",
    },
  });

  const libroBuenAmor = await prisma.work.create({
    data: {
      slug: "libro-de-buen-amor",
      title: "Libro de buen amor",
      year: 1330,
      era: "Edad Media",
      genre: "Narrativa autobiográfica en verso (mester de clerecía)",
      synopsis: `El Libro de buen amor es la autobiografía ficticia de Juan Ruiz, Arcipreste de Hita. El autor narra sus aventuras amorosas, entremezcladas constantemente con reflexiones didácticas, cuentos, poemas burlescos y fábulas, en una obra cuya intención moral resulta tan explícita como ambigua.`,
      authorId: arcipreste.id,
    },
  });

  const intencionText = `«Así yo, en mi poquilla ciencia y mucha y gran rudeza, comprendiendo cuántos bienes hace perder el loco amor del mundo al alma y al cuerpo y los muchos males que les apareja y trae, hice esta chica escritura en memoria de bien, escogiendo y deseando con buena voluntad la salvación y gloria del Paraíso para mi alma, y compuse este nuevo libro en que van escritas algunas maneras y maestrías y sutilezas engañosas del loco amor del mundo, usadas por algunos para pecar. Leyéndolas y oyéndolas, el hombre o la mujer de buen entendimiento que se quiera salvar, escogerá su conducta [...].

No obstante, puesto que es humana cosa el pecar, si algunos quisieran (no se lo aconsejo) usar del loco amor, aquí hallarán algunas maneras para ello.»`;

  const fragIntencion = await prisma.fragment.create({
    data: {
      slug: "la-intencion-de-la-obra",
      title: "La intención de la obra",
      location: "Libro de buen amor (prólogo)",
      headline: "Aquí hallarán algunas maneras para ello",
      text: intencionText,
      order: 1,
      status: "published",
      featured: false,
      workId: libroBuenAmor.id,
      constellations: { connect: [{ slug: "amor" }, { slug: "fe" }] },
      characters: { connect: [{ slug: "arcipreste-de-hita" }] },
      artworkImageUrl: "/images/artworks/titian-alegoria-de-la-prudencia.jpg",
      artworkTitle: "Alegoría de la Prudencia",
      artworkAuthor: "Tiziano, h. 1565-1570",
      artworkCaption:
        "La ambigüedad moral que define el prólogo del Arcipreste —que dice querer apartar del vicio y, al mismo tiempo, enseña a practicarlo— tiene su correlato pictórico en esta obra, donde tres edades del hombre comparten el marco con tres animales que simbolizan las facultades del juicio: la prudencia como tensión irresuelta entre el conocimiento del mal y la elección del bien.",
    },
  });

  const alegatoAmorText = `Una noche sostuve combate peregrino:
pensaba yo en mi suerte, furioso (y no de vino),
cuando un hombre alto, hermoso, cortésmente a mi vino.
Le pregunté quién era; dijo: «Amor, tu vecino».

Con enojo muy grande le empecé a denostar;
le dije: «Si Amor eres, no puedes aquí estar,
eres falso, maestrero y ducho en engañar;
salvar no puedes uno, puedes cien mil matar.

Con engaños, lisonjas y sutiles mentiras
emponzoñas las lenguas, envenenas tus viras,
hiere a quien más te sirve tu flecha cuando tiras;
separas de las damas a los hombres, por iras. [...]

Eres padre del fuego, pariente de la llama,
más arde y más se quema aquel que más te ama;
Amor, a quien te sigue le quemas cuerpo y alma,
destrúyeslo del todo como el fuego a la rama [...].»`;

  const fragAlegatoAmor = await prisma.fragment.create({
    data: {
      slug: "alegato-contra-el-amor",
      title: "Alegato del Arcipreste contra el Amor",
      location: "Libro de buen amor",
      headline: "Eres padre del fuego, pariente de la llama",
      text: alegatoAmorText,
      order: 2,
      status: "published",
      featured: false,
      workId: libroBuenAmor.id,
      constellations: { connect: [{ slug: "amor" }] },
      characters: { connect: [{ slug: "arcipreste-de-hita" }, { slug: "amor-personificado" }] },
      topics: { connect: [{ slug: "amor-cortes" }] },
      artworkImageUrl: "/images/artworks/caravaggio-amor-vincit-omnia.jpg",
      artworkTitle: "Cupido vendado",
      artworkAuthor: "Caravaggio, h. 1601-1602",
      artworkCaption:
        "El Amor que el Arcipreste increpa —poderoso, caprichoso, ciego a la razón y destructor— cobra forma visual perfecta en este Cupido oscuro y corpulento de Caravaggio, que nada tiene de la gracia alegórica renacentista y todo de una fuerza irracional y amenazante.",
    },
  });

  const respuestaAmorText = `El Amor con mesura diome respuesta luego:
«Arcipreste, enojado no estés, yo te lo ruego:
no hables mal del Amor ni en serio ni por juego
porque a veces poca agua hace bajar gran fuego. [...]

Si quieres amar dueñas o a cualquier mujer,
muchas cosas tendrás primero que aprender
para que ella te quiera en amor acoger.
Primeramente, mira qué mujer escoger.

Busca mujer hermosa, atractiva y lozana,
que no sea muy alta, pero tampoco enana;
si pudieres, no quieras amar mujer villana,
pues de amor nada sabe, palurda y chabacana. [...]

Procura mensajera de esas negras pacatas
que tratan mucho a frailes, a monjas y beatas,
son grandes andariegas, merecen sus zapatas:
esas trotaconventos hacen muchas contratas.

Donde están tales viejas todo se ha de alegrar,
pocas mujeres pueden a su influjo escapar;
para que no te mientan las debes halagar,
pues tal encanto usan que saben engañar [...].»`;

  const fragRespuestaAmor = await prisma.fragment.create({
    data: {
      slug: "respuesta-del-amor",
      title: "Respuesta del Amor",
      location: "Libro de buen amor",
      headline: "Busca mujer hermosa, atractiva y lozana",
      text: respuestaAmorText,
      order: 3,
      status: "published",
      featured: false,
      workId: libroBuenAmor.id,
      constellations: { connect: [{ slug: "amor" }] },
      characters: { connect: [{ slug: "arcipreste-de-hita" }, { slug: "amor-personificado" }] },
      topics: { connect: [{ slug: "amor-cortes" }] },
      artworkImageUrl: "/images/artworks/van-honthorst-la-alcahueta.jpg",
      artworkTitle: "La alcahueta",
      artworkAuthor: "Gerard van Honthorst, 1625",
      artworkCaption:
        "La figura de la vieja trotaconventos que el Amor recomienda al Arcipreste —intermediaria imprescindible, astuta y de vida oscura— tiene su equivalente pictórico en esta escena nocturna, donde una anciana de expresión cómplice hace las veces de celestina entre dos jóvenes, con la vela como único testigo.",
    },
  });

  const trotaconventosText = `Busqué trotaconventos, cual me mandó el Amor,
de entre las más ladinas escogí la mejor.
¡Dios y la mi ventura guiaron mi labor!
Acerté con la tienda del sabio vendedor. [...]

La buhona con su cesto va tañendo cascabeles
y revolviendo sus joyas, sus sortijas y alfileres.
Decía: «¡Llevo toallas! ¡Compradme aquestos manteles!».
Cuando la oyó doña Endrina, dijo: «Entrad, no receledes».

Una vez la vieja en casa le dijo: «Señora hija,
para esa mano bendita aceptad esta sortija
y si no me descubríis, os contaré la pastija
que esta noche imaginé». Poco a poco, así la aguija.

«Hija, a toda hora estáis en casa, tan encerrada
que así, sola, envejecéis; debéis ser más animada,
salir, andar por la plaza, pues vuestra beldad loada
aquí, entre estas paredes, no os aprovechará nada [...]»`;

  const fragTrotaconventos = await prisma.fragment.create({
    data: {
      slug: "trotaconventos",
      title: "Trotaconventos",
      location: "Libro de buen amor",
      headline: "De entre las más ladinas escogí la mejor",
      text: trotaconventosText,
      order: 4,
      status: "published",
      featured: false,
      workId: libroBuenAmor.id,
      constellations: { connect: [{ slug: "amor" }] },
      characters: { connect: [{ slug: "arcipreste-de-hita" }, { slug: "trotaconventos" }] },
      artworkImageUrl: "/images/artworks/goya-las-viejas.jpg",
      artworkTitle: "Las viejas (El tiempo)",
      artworkAuthor: "Francisco de Goya, h. 1808-1812",
      artworkCaption:
        "La vieja astuta que seduce con palabras y engaños, mezclando halago y amenaza velada, tiene en Goya a su pintor definitivo: esta anciana de expresión ambigua y sonrisa oblicua encarna la misma mezcla de complicidad y peligro que hace de Trotaconventos uno de los personajes más vivos de la literatura medieval.",
    },
  });

  const batallaCarnalText = `El primero de todos que hirió a don Carnal
fue el puerco cuelliblanco, y dejolo muy mal,
le obligó a escupir flema; esta fue la señal.
Pensó doña Cuaresma que era suyo el real.

Vino luego en su ayuda la salada sardina,
que hirió muy reciamente a la gruesa gallina,
se atravesó en su pico ahogándola aína;
después, a don Carnal quebró la capellina.

Vinieron muchas mielgas en esta delantera,
los verdeles y jibias son, del flanco, barrera;
dura está la pelea, de muy mala manera,
caía en cada bando mucha buena mollera.`;

  const fragBatallaCarnal = await prisma.fragment.create({
    data: {
      slug: "la-batalla-de-don-carnal-y-dona-cuaresma",
      title: "La batalla de don Carnal y doña Cuaresma",
      location: "Libro de buen amor",
      headline: "Dura está la pelea, de muy mala manera",
      text: batallaCarnalText,
      order: 5,
      status: "published",
      featured: false,
      workId: libroBuenAmor.id,
      constellations: { connect: [{ slug: "fe" }] },
      artworkImageUrl: "/images/artworks/brueghel-carnaval-y-cuaresma.jpg",
      artworkTitle: "El combate entre don Carnaval y doña Cuaresma",
      artworkAuthor: "Pieter Brueghel el Viejo, 1559",
      artworkCaption:
        "Es el referente pictórico directo e inevitable: Brueghel representa exactamente la misma alegoría que el Arcipreste —el enfrentamiento entre la gula festiva y la abstinencia penitencial— con idéntica mezcla de humor popular, inventario de alimentos y sentido moral subyacente.",
    },
  });

  const muerteTrotaconventosText = `Así fue, ¡qué desgracia!, que mi vieja ya es muerta,
¡grande es mi desconsuelo!, ¡murió mi vieja experta!
No sé decir mi pena, mas mucha buena puerta
que me ha sido cerrada, para mí estaba abierta.

¡Ay muerte! ¡Muerta seas, bien muerta y malandante!
¡Mataste a la mi vieja! ¡Matases a mí antes!
¡Enemiga del mundo, no tienes semejante!
De tu amarga memoria no hay quien no se espante.`;

  const fragMuerteTrotaconventos = await prisma.fragment.create({
    data: {
      slug: "la-muerte-de-trotaconventos",
      title: "La muerte de Trotaconventos",
      location: "Libro de buen amor",
      headline: "¡Ay muerte! ¡Muerta seas, bien muerta y malandante!",
      text: muerteTrotaconventosText,
      order: 6,
      status: "published",
      featured: false,
      workId: libroBuenAmor.id,
      constellations: { connect: [{ slug: "muerte" }, { slug: "amor" }] },
      characters: { connect: [{ slug: "arcipreste-de-hita" }, { slug: "trotaconventos" }] },
      artworkImageUrl: "/images/artworks/brueghel-triunfo-de-la-muerte.jpg",
      artworkTitle: "El triunfo de la Muerte",
      artworkAuthor: "Pieter Brueghel el Viejo, h. 1562",
      artworkCaption:
        "La muerte que arrasa sin distinción de personas —la misma que el Arcipreste increpa con rabia impotente— está representada en esta obra con una energía apocalíptica y popular muy afín al tono del Libro de buen amor: la muerte como fuerza cómica y terrible a un tiempo, que no respeta rango ni virtud.",
    },
  });

  // ---------------------------------------------------------------------
  // Anotaciones — La intención de la obra
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «La intención de la obra»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragIntencion.id,
        type: "glosa",
        ...anchor(intencionText, "hice esta chica escritura en memoria de bien"),
        order: 1,
        content: `«Chica escritura»: pequeña obra. Esta fórmula de humildad —presentar la propia obra como algo modesto— es un tópico habitual con el que los autores medievales abren sus textos, aunque en este caso introduce un libro de varios miles de versos.`,
      },
      {
        fragmentId: fragIntencion.id,
        type: "glosa",
        ...anchor(intencionText, "el hombre o la mujer de buen entendimiento que se quiera salvar"),
        order: 2,
        content: `El Arcipreste se dirige a un doble destinatario —«el hombre o la mujer»— y a una doble vía de recepción —«leyéndolas y oyéndolas»—, lo habitual en una época en que un mismo texto podía circular tanto por lectura individual como por recitación ante un grupo.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragIntencion.id,
        type: "contexto",
        ...anchor(intencionText, "comprendiendo cuántos bienes hace perder el loco amor del mundo al alma y al cuerpo y los muchos males que les apareja y trae"),
        order: 1,
        content: `Justificar una obra literaria como advertencia contra el pecado es un recurso muy extendido en la literatura didáctica medieval: el propio Berceo presenta sus Milagros como un aviso sobre las consecuencias del pecado y la importancia de la devoción. El Arcipreste recurre al mismo argumento, pero para introducir un libro centrado precisamente en las aventuras de ese «loco amor» que dice condenar.`,
      },
      {
        fragmentId: fragIntencion.id,
        type: "contexto",
        ...anchor(intencionText, "No obstante, puesto que es humana cosa el pecar"),
        order: 2,
        content: `La idea de que el pecado es «cosa humana» —es decir, inevitable, parte de la naturaleza caída del hombre— es un lugar común de la teología medieval. El Arcipreste la utiliza aquí no para excusar al pecador, sino para justificar que su libro incluya, además del aviso moral, el propio «manual» del pecado.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragIntencion.id,
        type: "figura",
        category: "tropo",
        ...anchor(intencionText, "si algunos quisieran (no se lo aconsejo) usar del loco amor, aquí hallarán algunas maneras para ello"),
        order: 1,
        content: `**Ironía**: el inciso «no se lo aconsejo» funciona como una advertencia que, en la práctica, es también una promesa: el libro «contiene» lo que dice desaconsejar. Esta declaración, lejos de cerrar el tema, es la que abre la puerta a todo lo que sigue.`,
      },
      {
        fragmentId: fragIntencion.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(intencionText, "Leyéndolas y oyéndolas, el hombre o la mujer de buen entendimiento"),
        order: 2,
        content: `**Construcción bimembre**: los dos gerundios («leyéndolas, oyéndolas») y los dos sujetos posibles («el hombre o la mujer») amplían deliberadamente el círculo de destinatarios del libro, como si el autor quisiera cubrirse frente a cualquier lector, sea quien sea y reciba el texto como lo reciba.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragIntencion.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `Según el Arcipreste, ¿para qué escribe su libro? ¿Qué dice a continuación que parece ir en sentido contrario?`,
      },
      {
        fragmentId: fragIntencion.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `Muchos críticos consideran este prólogo deliberadamente ambiguo: ¿es posible advertir del peligro de algo —el «loco amor»— mientras al mismo tiempo se enseña cómo practicarlo? ¿Crees que el Arcipreste resuelve esta tensión, o la deja abierta a propósito?`,
      },
      {
        fragmentId: fragIntencion.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `¿Qué efecto produce en el lector que el propio autor reconozca esta ambigüedad desde el principio, en lugar de ocultarla o disimularla?`,
      },

      // Intertextualidad
      {
        fragmentId: fragIntencion.id,
        type: "intertextualidad",
        ...anchor(intencionText, "compuse este nuevo libro en que van escritas algunas maneras y maestrías y sutilezas engañosas del loco amor del mundo"),
        order: 1,
        linkType: "external",
        externalCitation: `Ovidio, Ars amatoria y Remedia amoris (s. I a. C.)`,
        content: `El propio Ovidio escribió un «arte de amar» y, años después, un «remedio del amor» que decía corregirlo, sin que ninguno de los dos textos deje de ser, en el fondo, un tratado sobre la seducción. El Libro de buen amor se inscribe en esta misma tradición de literatura erótico-didáctica de doble fondo, donde la frontera entre enseñar a evitar el amor y enseñar a practicarlo es, a propósito, borrosa.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Alegato del Arcipreste contra el Amor
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Alegato del Arcipreste contra el Amor»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragAlegatoAmor.id,
        type: "glosa",
        ...anchor(alegatoAmorText, "le empecé a denostar"),
        order: 1,
        content: `«Denostar»: injuriar, insultar. El Arcipreste no se limita a quejarse del Amor: lo recibe con una sarta de acusaciones directas, en un tono más propio de una riña que de un encuentro alegórico.`,
      },
      {
        fragmentId: fragAlegatoAmor.id,
        type: "glosa",
        ...anchor(alegatoAmorText, "Con engaños, lisonjas y sutiles mentiras"),
        order: 2,
        content: `«Lisonjas»: alabanzas, halagos interesados. El Arcipreste describe las armas del Amor como un repertorio de manipulación verbal —engaños, halagos, mentiras— antes incluso de mencionar sus armas «físicas», las flechas.`,
      },
      {
        fragmentId: fragAlegatoAmor.id,
        type: "glosa",
        ...anchor(alegatoAmorText, "emponzoñas las lenguas, envenenas tus viras"),
        order: 3,
        content: `«Emponzoñas»: envenenas. «Viras»: saetas, flechas. El Amor envenena dos cosas a la vez: las palabras de quienes hablan de él y las flechas con que hiere, como si la mentira y el daño físico fueran un mismo veneno.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragAlegatoAmor.id,
        type: "contexto",
        ...anchor(alegatoAmorText, "cuando un hombre alto, hermoso, cortésmente a mi vino"),
        order: 1,
        content: `La aparición de una figura alegórica —en este caso, el Amor personificado en forma humana— que entabla un diálogo con el protagonista es un recurso característico de la literatura alegórica medieval, emparentado con las visiones oníricas de obras como el Roman de la Rose, donde Amor también se presenta como un personaje con el que se puede discutir, reprochar o pactar.`,
      },
      {
        fragmentId: fragAlegatoAmor.id,
        type: "contexto",
        ...anchor(alegatoAmorText, "Eres padre del fuego, pariente de la llama"),
        order: 2,
        content: `Identificar el amor con el fuego es uno de los tópicos más antiguos y persistentes de la poesía amorosa, presente ya en Ovidio y en la lírica trovadoresca, y que llegará hasta el petrarquismo renacentista. El Arcipreste lo retoma aquí, pero no para celebrar esa pasión ardiente, sino para acusar al Amor de ser su origen y su «pariente».`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragAlegatoAmor.id,
        type: "figura",
        category: "tropo",
        ...anchor(alegatoAmorText, "más arde y más se quema aquel que más te ama"),
        order: 1,
        content: `**Paradoja**: cuanto mayor es el amor que alguien siente, mayor es el daño que recibe. La metáfora del fuego —que da luz y calor pero también consume— permite expresar esta contradicción: lo mismo que parece un don es, en realidad, una condena.`,
      },
      {
        fragmentId: fragAlegatoAmor.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(alegatoAmorText, "Con engaños, lisonjas y sutiles mentiras\nemponzoñas las lenguas, envenenas tus viras,\nhiere a quien más te sirve tu flecha cuando tiras"),
        order: 2,
        content: `**Acumulación acusatoria**: tres versos seguidos, cada uno con un verbo en segunda persona dirigido directamente al Amor («emponzoñas», «envenenas», «hiere»), construyen una verdadera letanía de cargos, como en un juicio en el que el Arcipreste actúa de fiscal.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragAlegatoAmor.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Quién se le aparece al Arcipreste una noche, y cómo reacciona este al saber de quién se trata?`,
      },
      {
        fragmentId: fragAlegatoAmor.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El Arcipreste acusa al Amor de matar precisamente a quienes más le sirven. Teniendo en cuenta que él mismo es, según su propio relato, alguien que ha buscado el amor sin demasiado éxito, ¿qué relación encuentras entre esta acusación general y su experiencia personal?`,
      },

      // Intertextualidad
      {
        fragmentId: fragAlegatoAmor.id,
        type: "intertextualidad",
        ...anchor(alegatoAmorText, "Le pregunté quién era; dijo: «Amor, tu vecino»"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragRespuestaAmor.id,
        content: `El Amor, presentado aquí como «vecino» del Arcipreste, no se queda callado ante este alegato: en el fragmento siguiente, «Respuesta del Amor», replica «con mesura» a cada una de estas acusaciones y termina convirtiéndose, él mismo, en consejero del protagonista.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Respuesta del Amor
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Respuesta del Amor»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragRespuestaAmor.id,
        type: "glosa",
        ...anchor(respuestaAmorText, "Si quieres amar dueñas o a cualquier mujer"),
        order: 1,
        content: `«Dueñas»: señoras, mujeres de cierta posición. El Amor empieza su discurso clasificando a las mujeres por categorías, como primer paso de lo que será, en el fondo, un manual práctico de conquista.`,
      },
      {
        fragmentId: fragRespuestaAmor.id,
        type: "glosa",
        ...anchor(respuestaAmorText, "pues de amor nada sabe, palurda y chabacana"),
        order: 2,
        content: `«Chabacana»: grosera, de mal gusto. El Amor descarta a la «mujer villana» no por razones morales, sino porque, según él, no sabría apreciar ni corresponder al amor: un argumento clasista disfrazado de consejo amoroso.`,
      },
      {
        fragmentId: fragRespuestaAmor.id,
        type: "glosa",
        ...anchor(respuestaAmorText, "Procura mensajera de esas negras pacatas"),
        order: 3,
        content: `«Pacatas»: apocadas, tímidas. El adjetivo resulta irónico, porque las mujeres que el Amor describe a continuación —«grandes andariegas» que «hacen muchas contratas»— son justamente lo contrario de tímidas: el término parece elegido más por su sonido despectivo que por su sentido literal.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragRespuestaAmor.id,
        type: "contexto",
        ...anchor(respuestaAmorText, "porque a veces poca agua hace bajar gran fuego"),
        order: 1,
        content: `Este proverbio de sabor popular, puesto en boca de una figura alegórica como el Amor, ejemplifica el contraste de registros que recorre todo el libro: la materia —una disputa entre el Arcipreste y el Amor personificado— pertenece a la tradición culta, pero el lenguaje con que se resuelve es el de la conversación cotidiana.`,
      },
      {
        fragmentId: fragRespuestaAmor.id,
        type: "contexto",
        ...anchor(respuestaAmorText, "esas trotaconventos hacen muchas contratas"),
        order: 2,
        content: `Esta es la primera mención, en plural y como tipo social, de las «trotaconventos»: mujeres mayores, de vida itinerante y vinculadas al mundo religioso (frailes, monjas, beatas), que actuaban como intermediarias en asuntos amorosos. El Amor presenta aquí, casi como un catálogo de personal, a la figura que enseguida tendrá nombre propio en el libro.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragRespuestaAmor.id,
        type: "figura",
        category: "topos",
        ...anchor(respuestaAmorText, "Busca mujer hermosa, atractiva y lozana,\nque no sea muy alta, pero tampoco enana"),
        order: 1,
        content: `**Preceptiva amorosa**: el Amor enumera, como si fuera un manual, las cualidades físicas que debe tener la mujer elegida. Este catálogo de requisitos, heredado de los tratados clásicos sobre el arte de amar, convierte el discurso amoroso en una lista de instrucciones prácticas, alejada de cualquier idealización.`,
      },
      {
        fragmentId: fragRespuestaAmor.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(respuestaAmorText, "Donde están tales viejas todo se ha de alegrar,\npocas mujeres pueden a su influjo escapar"),
        order: 2,
        content: `**Generalización hiperbólica**: el Amor afirma que «pocas mujeres» pueden resistirse a la influencia de estas intermediarias. Esta exageración no es solo retórica: prepara y justifica, de antemano, el éxito que tendrá Trotaconventos en el fragmento siguiente.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragRespuestaAmor.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `Según los consejos del Amor, ¿qué tipo de mujer conviene buscar? ¿Qué tipo de persona recomienda como intermediaria?`,
      },
      {
        fragmentId: fragRespuestaAmor.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `El Amor da consejos muy prácticos y nada idealizados sobre cómo conquistar a una mujer, incluido el uso de intermediarias que «saben engañar». ¿Qué visión del amor transmite este discurso? ¿Coincide con la imagen idealizada y «cortés» que suele asociarse al amor en la literatura medieval?`,
      },

      // Intertextualidad
      {
        fragmentId: fragRespuestaAmor.id,
        type: "intertextualidad",
        ...anchor(respuestaAmorText, "El Amor con mesura diome respuesta luego"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragAlegatoAmor.id,
        content: `Frente al tono airado y acusatorio del Arcipreste en el fragmento anterior, el Amor responde «con mesura»: no niega su poder destructivo, pero lo reorienta hacia un terreno práctico, ofreciendo consejos que el propio Arcipreste pondrá en marcha de inmediato, contratando a Trotaconventos.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Trotaconventos
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Trotaconventos»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragTrotaconventos.id,
        type: "glosa",
        ...anchor(trotaconventosText, "de entre las más ladinas escogí la mejor"),
        order: 1,
        content: `«Ladinas»: astutas, hábiles. El Arcipreste presenta su elección de mensajera como una selección entre profesionales, igual que se elegiría al mejor artesano para un encargo.`,
      },
      {
        fragmentId: fragTrotaconventos.id,
        type: "glosa",
        ...anchor(trotaconventosText, "La buhona con su cesto va tañendo cascabeles"),
        order: 2,
        content: `«Buhona»: vendedora ambulante. Trotaconventos se disfraza de mercader callejera, con cestos, joyas y cascabeles, para poder entrar sin levantar sospechas en casa de las mujeres a las que quiere abordar.`,
      },
      {
        fragmentId: fragTrotaconventos.id,
        type: "glosa",
        ...anchor(trotaconventosText, "dijo: «Entrad, no receledes»"),
        order: 3,
        content: `«Receledes»: receléis, desconfiéis. Doña Endrina invita a entrar a la vendedora sin ningún recelo: es precisamente esa confianza inicial, ganada con el disfraz de buhona, lo que Trotaconventos necesita para empezar su verdadero trabajo.`,
      },
      {
        fragmentId: fragTrotaconventos.id,
        type: "glosa",
        ...anchor(trotaconventosText, "os contaré la pastija"),
        order: 4,
        content: `«Pastija»: historia, cuento, patraña. Trotaconventos pasa, en pocos versos, de vender «toallas» y «manteles» a ofrecer regalos y prometer un relato a medida: cada paso acerca un poco más a doña Endrina hacia la conversación que de verdad le interesa.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragTrotaconventos.id,
        type: "contexto",
        ...anchor(trotaconventosText, "Acerté con la tienda del sabio vendedor"),
        order: 1,
        content: `Este fragmento es la puesta en práctica directa de los consejos que el Amor había dado en «Respuesta del Amor»: el Arcipreste «busca trotaconventos, cual me mandó el Amor» y la encuentra de inmediato. La narración avanza así de la teoría —el discurso del Amor— a la acción concreta.`,
      },
      {
        fragmentId: fragTrotaconventos.id,
        type: "contexto",
        ...anchor(trotaconventosText, "pues vuestra beldad loada\naquí, entre estas paredes, no os aprovechará nada"),
        order: 2,
        content: `La vida de muchas mujeres en la sociedad medieval transcurría, en gran medida, dentro del espacio doméstico. Personajes como Trotaconventos —vendedoras, mensajeras, mujeres de vida itinerante con acceso a muchas casas— funcionaban como uno de los pocos puentes posibles entre ese espacio cerrado y el mundo exterior, para bien o para mal.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragTrotaconventos.id,
        type: "figura",
        category: "tropo",
        ...anchor(trotaconventosText, "La buhona con su cesto va tañendo cascabeles\ny revolviendo sus joyas, sus sortijas y alfileres"),
        order: 1,
        content: `**Disfraz como estrategia**: el cesto de mercancías de Trotaconventos es, a la vez, literal —vende objetos de verdad— y un pretexto: el verdadero «producto» que ofrece es el acceso a doña Endrina. La mercancía visible esconde la mercancía real, del mismo modo que sus palabras esconden su auténtica intención.`,
      },
      {
        fragmentId: fragTrotaconventos.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(trotaconventosText, "«Hija, a toda hora estáis en casa, tan encerrada\nque así, sola, envejecéis; debéis ser más animada"),
        order: 2,
        content: `**Discurso de la persuasión**: Trotaconventos se dirige a doña Endrina como «hija», con un tono afectuoso y cercano, y construye su argumento en forma de consejo bienintencionado («debéis ser más animada»), cuando en realidad está preparando el terreno para sus propios fines.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragTrotaconventos.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Cómo logra Trotaconventos entrar en casa de doña Endrina? ¿Qué hace una vez dentro para ganarse su confianza?`,
      },
      {
        fragmentId: fragTrotaconventos.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `Compara los consejos que el Amor daba en el fragmento anterior con lo que hace Trotaconventos en este: ¿hasta qué punto sigue ella, paso a paso, ese «manual» teórico? ¿Qué efecto produce ver la teoría convertida en práctica tan rápidamente?`,
      },

      // Intertextualidad
      {
        fragmentId: fragTrotaconventos.id,
        type: "intertextualidad",
        ...anchor(trotaconventosText, "Busqué trotaconventos, cual me mandó el Amor"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragRespuestaAmor.id,
        content: `El primer verso de este fragmento remite explícitamente a los consejos del Amor en «Respuesta del Amor»: Trotaconventos no es una ocurrencia improvisada del Arcipreste, sino la aplicación literal de la recomendación de buscar «mensajera de esas negras pacatas» que «hacen muchas contratas».`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — La batalla de don Carnal y doña Cuaresma
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «La batalla de don Carnal y doña Cuaresma»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragBatallaCarnal.id,
        type: "glosa",
        ...anchor(batallaCarnalText, "Pensó doña Cuaresma que era suyo el real"),
        order: 1,
        content: `«Que era suyo el real»: que había vencido, que el campo de batalla («real») era ya suyo. Apenas comenzado el combate, doña Cuaresma ya se cree victoriosa: el poema juega desde el principio con las expectativas de un desenlace que tardará en llegar.`,
      },
      {
        fragmentId: fragBatallaCarnal.id,
        type: "glosa",
        ...anchor(batallaCarnalText, "se atravesó en su pico ahogándola aína"),
        order: 2,
        content: `«Aína»: fácilmente, rápidamente. La sardina «ahoga» a la gallina atravesándose en su pico con toda facilidad: una imagen culinaria —el pescado como relleno o guarnición— convertida en golpe mortal de guerra.`,
      },
      {
        fragmentId: fragBatallaCarnal.id,
        type: "glosa",
        ...anchor(batallaCarnalText, "después, a don Carnal quebró la capellina"),
        order: 3,
        content: `«Capellina»: pieza de la armadura que cubre la parte superior de la cabeza. Que un pescado salado sea capaz de «quebrar» una pieza de armadura es uno de los muchos detalles que subrayan el contraste cómico entre el vocabulario épico y los combatientes reales.`,
      },
      {
        fragmentId: fragBatallaCarnal.id,
        type: "glosa",
        ...anchor(batallaCarnalText, "Vinieron muchas mielgas en esta delantera,\nlos verdeles y jibias son, del flanco, barrera"),
        order: 4,
        content: `«Mielgas»: peces emparentados con los tiburones. «Verdeles»: caballas. «Jibias»: sepias. Todo un repertorio de pescado —propio de la dieta de Cuaresma— se organiza en «delantera» y «flanco», como tropas de un ejército regular.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragBatallaCarnal.id,
        type: "contexto",
        ...anchor(batallaCarnalText, "fue el puerco cuelliblanco, y dejolo muy mal"),
        order: 1,
        content: `La oposición entre don Carnal y doña Cuaresma traduce, en clave alegórica, el calendario litúrgico cristiano: los días de carne, propios del Carnaval, frente a los cuarenta días de abstinencia y ayuno de la Cuaresma, en los que el pescado sustituye a la carne en la dieta. La «batalla» entre ambos personajes es, literalmente, una batalla entre alimentos.`,
      },
      {
        fragmentId: fragBatallaCarnal.id,
        type: "contexto",
        ...anchor(batallaCarnalText, "Vinieron muchas mielgas en esta delantera"),
        order: 2,
        content: `La enumeración de combatientes organizados en «delantera» y «flanco» recuerda a los catálogos de tropas habituales en la épica clásica y medieval, donde el narrador presenta, uno a uno, a los grandes guerreros y sus huestes antes de la batalla. Aquí, el catálogo épico se llena de pescado.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragBatallaCarnal.id,
        type: "figura",
        category: "tropo",
        ...anchor(batallaCarnalText, "El primero de todos que hirió a don Carnal\nfue el puerco cuelliblanco"),
        order: 1,
        content: `**Personificación y alegoría**: los alimentos —el cerdo, la sardina, la gallina— se convierten en combatientes con iniciativa propia, capaces de «herir» y «ahogar». La metáfora alimentaria del enfrentamiento entre Carnaval y Cuaresma se literaliza hasta sus últimas consecuencias.`,
      },
      {
        fragmentId: fragBatallaCarnal.id,
        type: "figura",
        category: "sonoro",
        ...anchor(batallaCarnalText, "caía en cada bando mucha buena mollera"),
        order: 2,
        content: `**Parodia del registro épico**: palabras como «hirió», «el real», «delantera», «capellina» o «mollera» pertenecen al vocabulario solemne de la batalla caballeresca. Aplicado a un combate entre un cerdo y una sardina, este vocabulario produce un efecto deliberadamente cómico: la forma es noble, la materia es trivial.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragBatallaCarnal.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Quiénes son don Carnal y doña Cuaresma, y de qué tipo de «soldados» se componen sus respectivos ejércitos?`,
      },
      {
        fragmentId: fragBatallaCarnal.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El poema describe esta «batalla» con el mismo lenguaje —heridas, capellinas, «el real», «delantera»— que usaría para narrar un combate entre caballeros. ¿Qué efecto produce esta mezcla entre un vocabulario solemne y unos combatientes tan poco solemnes? ¿Por qué crees que el Arcipreste interrumpe sus aventuras amorosas con un episodio como este?`,
      },

      // Intertextualidad
      {
        fragmentId: fragBatallaCarnal.id,
        type: "intertextualidad",
        ...anchor(batallaCarnalText, "caía en cada bando mucha buena mollera"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragLeon.id,
        content: `El contraste entre un vocabulario épico y una situación que no lo merece también aparece, de forma muy distinta, en el episodio de «El Cid y el león»: allí el desconcierto cómico de los infantes de Carrión convive con el tono heroico habitual del Cantar. En ambos casos, un registro «alto» se aplica a una escena que lo rebaja, aunque aquí el Arcipreste lo lleve mucho más lejos, hasta la pura parodia.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — La muerte de Trotaconventos
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «La muerte de Trotaconventos»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragMuerteTrotaconventos.id,
        type: "glosa",
        ...anchor(muerteTrotaconventosText, "¡Muerta seas, bien muerta y malandante!"),
        order: 1,
        content: `«Malandante»: de mala fortuna, desgraciada. El Arcipreste no se conforma con lamentar la muerte de su «vieja»: maldice a la propia Muerte, deseándole a ella la misma «mala andanza» que acaba de causarle.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragMuerteTrotaconventos.id,
        type: "contexto",
        ...anchor(muerteTrotaconventosText, "mas mucha buena puerta\nque me ha sido cerrada, para mí estaba abierta"),
        order: 1,
        content: `Más allá del afecto personal, la muerte de Trotaconventos tiene para el Arcipreste una consecuencia muy práctica: pierde a su intermediaria con el mundo exterior, a la persona que le abría «puertas» —literal y figuradamente— que ahora quedan «cerradas». El dolor sentimental y la pérdida de un recurso social se mezclan en un mismo lamento.`,
      },
      {
        fragmentId: fragMuerteTrotaconventos.id,
        type: "contexto",
        ...anchor(muerteTrotaconventosText, "¡Enemiga del mundo, no tienes semejante!"),
        order: 2,
        content: `El apóstrofe directo a la Muerte, personificada como una «enemiga» a la que se increpa y maldice, es un recurso muy extendido en la literatura medieval y se repetirá, con otro tono, en textos como las Coplas de Jorge Manrique o el Planto de Pleberio en La Celestina: la muerte como interlocutora a la que se puede —aunque inútilmente— reprochar su acción.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragMuerteTrotaconventos.id,
        type: "figura",
        category: "sonoro",
        ...anchor(muerteTrotaconventosText, "¡Ay muerte! ¡Muerta seas, bien muerta y malandante!"),
        order: 1,
        content: `**Apóstrofe y paronomasia**: la repetición de la raíz «muert-» («muerte», «muerta», «muerta») en un mismo verso convierte el lamento en una suerte de maldición ritual, casi un conjuro, dirigido directamente contra la propia Muerte.`,
      },
      {
        fragmentId: fragMuerteTrotaconventos.id,
        type: "figura",
        category: "tropo",
        ...anchor(muerteTrotaconventosText, "mas mucha buena puerta\nque me ha sido cerrada, para mí estaba abierta"),
        order: 2,
        content: `**Metáfora de la puerta**: las «puertas» que Trotaconventos mantenía abiertas para el Arcipreste —el acceso a las mujeres que cortejaba— se cierran de golpe con su muerte. La imagen condensa, en un solo objeto cotidiano, tanto la pérdida afectiva como la pérdida práctica.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragMuerteTrotaconventos.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Qué le ha ocurrido a la «vieja» del Arcipreste? ¿Cómo reacciona él ante la noticia?`,
      },
      {
        fragmentId: fragMuerteTrotaconventos.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `El Arcipreste llama a Trotaconventos «mi vieja experta» y maldice a la Muerte por haberla matado «antes» que a él. ¿Qué tipo de relación parece tener con ella? ¿Te parece un lamento sincero, interesado, o ambas cosas a la vez? Razona tu respuesta.`,
      },

      // Intertextualidad
      {
        fragmentId: fragMuerteTrotaconventos.id,
        type: "intertextualidad",
        ...anchor(muerteTrotaconventosText, "¡Ay muerte! ¡Muerta seas, bien muerta y malandante!"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragPlanto.id,
        content: `Este apóstrofe airado a la Muerte anticipa, con un tono mucho más popular y desgarrado, el procedimiento del «Planto de Pleberio» en La Celestina: en ambos casos, un hombre que ha perdido a alguien fundamental en su vida se dirige directamente a una fuerza abstracta —la Muerte, el Mundo, la Fortuna— para increparla por un dolor que sabe, de antemano, que ningún reproche puede remediar.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // El Conde Lucanor (don Juan Manuel)
  // ---------------------------------------------------------------------
  console.log("Creando «El Conde Lucanor»...");

  const donJuanManuel = await prisma.author.create({
    data: {
      slug: "don-juan-manuel",
      name: "Don Juan Manuel",
      birthYear: 1282,
      deathYear: 1348,
      country: "España",
      era: "Edad Media",
      bio: `Don Juan Manuel (1282-1348) fue nieto de Fernando III y sobrino de Alfonso X, y uno de los nobles más poderosos —y más conflictivos— de la Castilla de su tiempo: heredó extensos señoríos, ejerció como adelantado mayor de la frontera con Granada y participó en numerosas luchas por el poder durante las minorías de Fernando IV y Alfonso XI. Fue también el primer escritor en lengua castellana plenamente consciente de su condición de autor: revisó y ordenó personalmente sus obras para que no se corrompieran en la copia, y dispuso que se conservaran en el monasterio de Peñafiel. De su producción, en gran parte perdida, se conserva sobre todo El Conde Lucanor (1335), su obra maestra.`,
      portraitUrl: "/images/authors/don-juan-manuel.jpg",
    },
  });

  const condeLucanor = await prisma.work.create({
    data: {
      slug: "el-conde-lucanor",
      title: "El Conde Lucanor",
      year: 1335,
      era: "Edad Media",
      genre: "Prosa didáctica (colección de exempla)",
      synopsis: `El Conde Lucanor —cuyo título completo es Libro de los enxiemplos del conde Lucanor et de Patronio— reúne cincuenta y un relatos breves organizados según un mismo esquema: el conde Lucanor plantea a su consejero Patronio un problema o una duda, y este le responde con un cuento —procedente a menudo de la tradición oriental, clásica o folclórica— del que se desprende una enseñanza práctica, resumida al final en dos versos. Tras cada ejemplo, don Juan Manuel interviene en primera persona para certificar que, en su opinión, el cuento es bueno y ha decidido incluirlo en el libro.`,
      authorId: donJuanManuel.id,
    },
  });

  const piedrasText = `Un día dijo el conde a Patronio que tenía muchas ganas de quedarse en un sitio en el que le habían de dar mucho dinero, lo que le suponía un beneficio grande, pero que tenía mucho miedo de que, si se quedaba, correría peligro su vida; por lo cual le rogaba que le aconsejara qué debía hacer.

—Señor conde —respondió Patronio—, para que hagáis lo que yo creo que os conviene más, me gustaría que supierais lo que sucedió a un hombre que llevaba encima grandes riquezas y cruzaba un río. [...]

Sucedió que tuvo que pasar por un río y como llevaba una carga tan grande se hundía mucho más que si no la llevara. [...] Un hombre que estaba en la orilla le comenzó entonces a dar voces y a decirle que si no soltaba aquella carga se ahogaría. Aquel majadero no se dio cuenta de que, si se ahogaba, perdería las riquezas junto con la vida, y, si las soltaba, perdería las riquezas, pero no la vida. Por no perder las piedras preciosas que traía consigo no quiso soltarlas y murió en el río.

A vos, señor conde Lucanor, aunque no dudo que os vendría muy bien recibir el dinero y cualquier otra cosa que os quieran dar, os aconsejo que si hay peligro en quedaros allí no lo hagáis por afán de riquezas. También os aconsejo que nunca aventuréis vuestra vida sino en defensa de vuestra honra o por alguna cosa a que estéis obligado, pues el que poco se precia y arriesga su vida por codicia o frivolidad es aquel que no aspira a hacer grandes cosas; por el contrario, el que se precia mucho ha de obrar de modo que le precien también los otros, ya que el hombre no es preciado porque él se precie, sino por hacer obras que le ganen la estimación de los demás [...].

Al conde gustó mucho la moraleja, obró según ella y le fue muy bien. Viendo don Juan que este cuento era bueno, lo hizo poner en este libro y escribió unos versos que dicen así:

A quien por codicia la vida aventura,
las más de las veces el bien poco dura.`;

  const fragPiedras = await prisma.fragment.create({
    data: {
      slug: "el-hombre-cargado-de-piedras-preciosas",
      title: "El hombre cargado de piedras preciosas",
      location: "El Conde Lucanor",
      headline: "A quien por codicia la vida aventura",
      text: piedrasText,
      order: 1,
      status: "published",
      featured: false,
      workId: condeLucanor.id,
      constellations: { connect: [{ slug: "muerte" }] },
      topics: { connect: [{ slug: "contemptus-mundi" }] },
      characters: { connect: [{ slug: "conde-lucanor" }, { slug: "patronio" }] },
      artworkImageUrl: "/images/artworks/reymerswaele-el-cambista-y-su-mujer.jpg",
      artworkTitle: "El cambista y su mujer",
      artworkAuthor: "Marinus van Reymerswaele, 1539",
      artworkCaption:
        "Marinus van Reymerswaele, heredero de la tradición flamenca del avaro, pintó a esta pareja absorta en pesar y contar sus monedas. La misma codicia que en el cuento de Patronio impide al hombre soltar sus riquezas —aunque le cueste la vida— anima a esta pareja: figuras que acumulan con ansiedad bienes que ya no podrán disfrutar, ciegas a todo lo que no sea el brillo de lo que aprietan entre las manos.",
    },
  });

  const zorraGalloText = `[...] —Señor conde —dijo Patronio—, había un hombre honrado que tenía una casa en el monte y que, entre otros animales, criaba muchas gallinas y muchos gallos. Pasó que uno de aquellos gallos paseaba un día descuidadamente por el campo, lejos de la casa, y que le vio la zorra y se vino a él para cogerle sin que la viera. Pero el gallo se apercibió de su presencia y se subió a un árbol, que estaba un poco separado de los demás. Cuando la zorra le vio en salvo, lo sintió mucho y se puso a pensar cómo podría cogerle. Entonces se dirigió al árbol y empezó a decirle muchas lisonjas y a pedirle que bajara a andar por el campo, como hacía antes; pero el gallo no quiso. Al ver la zorra que no le engañaba con sus halagos, comenzó a amenazarle, diciéndole que se arrepentiría de no haberse fiado de ella. El gallo, que estaba en salvo, no hacía caso alguno de sus seguridades ni sus amenazas.

Cuando la zorra comprendió que de esta manera no podía engañarle, se dirigió al árbol y empezó a roer el tronco con los dientes y a dar en él golpes con la cola. El pobre gallo se asustó mucho, sin darse cuenta de que nada de esto le era peligroso; el miedo, sin embargo, le llevó a huir a los otros árboles, con el deseo de estar más seguro, y, sin poder llegar a los que estaban juntos, voló a otro árbol. Al ver la zorra que sin motivo estaba asustado, se fue tras él y le fue llevando de árbol en árbol hasta lograr cogerlo y comérselo [...]`;

  const fragZorraGallo = await prisma.fragment.create({
    data: {
      slug: "la-zorra-y-el-gallo",
      title: "La zorra y el gallo",
      location: "El Conde Lucanor",
      headline: "Le fue llevando de árbol en árbol",
      text: zorraGalloText,
      order: 2,
      status: "published",
      featured: false,
      workId: condeLucanor.id,
      constellations: { connect: [{ slug: "poder" }] },
      topics: { connect: [{ slug: "desengano" }] },
      characters: { connect: [{ slug: "conde-lucanor" }, { slug: "patronio" }] },
      artworkImageUrl: "/images/artworks/hondecoeter-zorra-con-gallo.jpg",
      artworkTitle: "Zorra con gallo muerto en un corral",
      artworkAuthor: "Melchior d'Hondecoeter, 1678",
      artworkCaption:
        "La tradición de pintar animales que encarnan vicios y virtudes humanas —la astucia frente al miedo— culmina en este lienzo con el desenlace mismo de la fábula de Patronio: Hondecoeter pinta a la zorra que por fin ha atrapado al gallo, la presa que el miedo, y no el peligro real, puso a su alcance.",
    },
  });

  const fernanGonzalezText = `—Patronio, como bien sabéis, yo ya no soy joven y, además, he pasado muchos trabajos y dificultades en mi vida. Sinceramente os digo que ahora querría descansar y dedicarme a la caza, olvidándome de preocupaciones y tareas más pesadas; como sé que siempre me habéis aconsejado con mucho acierto, os ruego que me digáis lo que más me conviene hacer.

—Señor conde —dijo Patronio—, el conde Fernán González vivía en Burgos, después de haber luchado muy duramente por defender su tierra. Una vez que estaba allí más sosegado y en paz, le dijo Nuño Laínez que ya le convenía alejarse de tantas disputas y contiendas, para descanso suyo y de sus gentes.

Le respondió el conde que nadie del mundo desearía tanto como él descansar y disfrutar de la paz si pudiera, pero bien sabía don Nuño que estaban en guerra con los moros, con los leoneses y con los navarros, por lo que, si ellos se dedicaban al ocio, sus contrarios les atacarían en seguida, y si se marcharan de caza con buenas aves de cetrería, siguiendo el cauce del Arlanzón, montados en buenas mulas gordas, sin mantener la defensa de sus tierras, bien lo podrían hacer, pero les sucedería como dice el antiguo refrán: «Murió el hombre y murió su nombre». Mas si, por el contrario, queremos olvidar las comodidades y nos esforzamos por defender este joven reino y acrecentar nuestra honra, dirán cuando muramos: «Murió el hombre, pero no murió su nombre». Y como hemos de morir, felices o desgraciados, no me parece que sea bueno dejar de hacer, por preferir el descanso y los placeres, lo que después de muertos mantiene viva la buena fama de nuestros hechos y gestas.

A vos, señor conde, pues sabéis que habéis de morir, nunca podré aconsejaros que, por buscar placeres y descanso, dejéis de hacer lo que corresponde a vuestro estado, para que así, una vez muerto vos, viva siempre la fama de vuestras grandes empresas.

Al conde le gustó mucho este consejo de Patronio, lo siguió y le fue muy bien.`;

  const fragFernanGonzalez = await prisma.fragment.create({
    data: {
      slug: "el-deber-del-conde-fernan-gonzalez",
      title: "El deber del conde Fernán González",
      location: "El Conde Lucanor",
      headline: "«Murió el hombre, pero no murió su nombre»",
      text: fernanGonzalezText,
      order: 3,
      status: "published",
      featured: false,
      workId: condeLucanor.id,
      constellations: { connect: [{ slug: "honor-y-valor" }, { slug: "muerte" }] },
      topics: { connect: [{ slug: "tempus-fugit" }] },
      characters: {
        connect: [{ slug: "conde-lucanor" }, { slug: "patronio" }, { slug: "conde-fernan-gonzalez" }],
      },
      artworkImageUrl: "/images/artworks/pereda-el-sueno-del-caballero.jpg",
      artworkTitle: "El sueño del caballero",
      artworkAuthor: "Antonio de Pereda, h. 1655",
      artworkCaption:
        "Un caballero duerme entre armas, joyas, libros y demás emblemas de las comodidades del mundo, mientras un ángel le señala una leyenda que advierte de lo breve que es la vida. La misma disyuntiva que Patronio plantea al conde Fernán González entre el descanso y la fama que sobrevive a la muerte encuentra aquí su traducción visual: de poco sirve poseer todo esto si, al final, no queda de ello más que un sueño.",
    },
  });

  const filosofoText = `—Patronio, vos sabéis que una de las cosas de este mundo por la que más debemos esforzarnos es por alcanzar buena fama y conservarla intacta [...] os ruego que me digáis cómo podré acrecentar y guardar mi fama. [...]

—Señor conde —dijo Patronio—, un gran filósofo, que vivía en una ciudad del reino de Marruecos, padecía una molesta enfermedad, pues solo podía evacuar con dolor, con pena y muy despacio.

Para librarlo de las molestias que padecía, le habían mandado los médicos que, siempre que lo necesitara, evacuase en seguida, sin dejarlo para más tarde, pues pensaban que, cuanto más lo dejase, las heces se pondrían más secas y duras, con el consiguiente daño y perjuicio para su salud. [...]

Sucedió que un día, yendo por una calle de aquella ciudad, en la que tenía muchos discípulos que seguían sus enseñanzas, le vinieron ganas de evacuar como os he contado. Para hacer lo que sus médicos le aconsejaban y que tan buenos resultados le daba, se metió en una callejuela para hacer lo excusado.

Dio la casualidad de que en aquella calleja vivían las mujeres de vida pública, que si hacen daño a su cuerpo también deshonran su alma. Pero el filósofo nada sabía de que aquellas mujeres vivieran allí. Por la clase de enfermedad que padecía, por el tiempo que permaneció en aquel lugar y por el aspecto que ofrecía al salir de la calleja, aunque ignoraba quiénes vivían allí, todos pensaron que había ido allí para hacer algo impropio de lo que debe hacerse y de lo que hasta entonces había hecho [...]

Vos, conde Lucanor, si queréis mantener y acrecentar vuestra fama y honra, debéis hacer tres cosas: la primera, muy buenas obras que complazcan a Dios [...].
La segunda cosa es rogar a Dios para que os ilumine en la conservación y aumento de vuestra fama [...].
La tercera cosa es que ni de palabra ni de obra hagáis nada por lo que las gentes pongan en duda vuestra fama, que siempre debéis guardar por encima de todo, pues muchas veces los hombres hacen buenas acciones, pero, como levantan sospechas y parecen malas, ante la opinión de las gentes quedan como realmente malas. Tened presente siempre que en asuntos tocantes a la fama tanto aprovecha o perjudica lo que opinan las gentes como la propia verdad, aunque para Dios y para el alma solo cuentan las obras que el hombre hace, así como la intención que guarda. [...]`;

  const fragFilosofo = await prisma.fragment.create({
    data: {
      slug: "la-honra-del-filosofo",
      title: "La honra del filósofo",
      location: "El Conde Lucanor",
      headline: "Todos pensaron que había ido allí",
      text: filosofoText,
      order: 4,
      status: "published",
      featured: false,
      workId: condeLucanor.id,
      constellations: { connect: [{ slug: "honor-y-valor" }, { slug: "fe" }] },
      topics: { connect: [{ slug: "desengano" }] },
      characters: { connect: [{ slug: "conde-lucanor" }, { slug: "patronio" }] },
      artworkImageUrl: "/images/artworks/rembrandt-el-filosofo.jpg",
      artworkTitle: "Filósofo en meditación",
      artworkAuthor: "Rembrandt van Rijn, 1632",
      artworkCaption:
        "Un anciano absorto en sus pensamientos, recluido en un interior que la luz apenas roza: la imagen misma del sabio que pone en juego el cuento de Patronio, un hombre cuya vida interior —su ciencia, su virtud, su intención— no le protege de ser juzgado por lo que de él ven, o creen ver, los demás.",
    },
  });

  // ---------------------------------------------------------------------
  // Anotaciones — El hombre cargado de piedras preciosas
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «El hombre cargado de piedras preciosas»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragPiedras.id,
        type: "glosa",
        ...anchor(piedrasText, "Aquel majadero no se dio cuenta"),
        order: 1,
        content: `«Majadero»: necio, torpe, falto de sensatez. El narrador no se anda con rodeos a la hora de calificar a un hombre capaz de morir antes que soltar un peso del que depende su vida.`,
      },
      {
        fragmentId: fragPiedras.id,
        type: "glosa",
        ...anchor(piedrasText, "el que poco se precia y arriesga su vida"),
        order: 2,
        content: `«Preciarse»: valorarse, estimarse a sí mismo. Don Juan Manuel juega con los dos sentidos de «precio»: el aprecio que alguien tiene de sí mismo y el valor —en oro— de las piedras preciosas que el hombre del cuento no quiere soltar ni a costa de la vida.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragPiedras.id,
        type: "contexto",
        ...anchor(piedrasText, "tenía mucho miedo de que, si se quedaba, correría peligro su vida"),
        order: 1,
        content: `El conde Lucanor no pregunta por un dilema abstracto, sino por una decisión muy concreta: ¿merece la pena arriesgar la vida por una ganancia económica? Esta clase de preguntas —prácticas, casi de gestión de un señorío— son el punto de partida habitual de los cincuenta y un exempla del libro, y reflejan las preocupaciones de la nobleza castellana del siglo XIV a la que don Juan Manuel pertenecía.`,
      },
      {
        fragmentId: fragPiedras.id,
        type: "contexto",
        ...anchor(piedrasText, "escribió unos versos que dicen así"),
        order: 2,
        content: `Esta intervención final de «don Juan» —que se nombra a sí mismo en tercera persona como autor del libro— es la firma característica de cada exemplum: tras el relato de Patronio, el autor confirma que el cuento le ha parecido bueno y lo resume en un pareado. Es un gesto de autoconciencia literaria poco frecuente en la prosa castellana de la época.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragPiedras.id,
        type: "figura",
        category: "topos",
        ...anchor(piedrasText, "me gustaría que supierais lo que sucedió a un hombre que llevaba encima grandes riquezas"),
        order: 1,
        content: `**El exemplum o apólogo**: Patronio no responde directamente a la duda del conde, sino que cuenta una historia de la que se desprende, por analogía, la respuesta. Esta estructura de «relato + moraleja» —de probable origen oriental— es el molde que se repite, con variaciones, en los cincuenta y un capítulos de la obra.`,
      },
      {
        fragmentId: fragPiedras.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(piedrasText, "si se ahogaba, perdería las riquezas junto con la vida, y, si las soltaba, perdería las riquezas, pero no la vida"),
        order: 2,
        content: `**Paralelismo antitético**: las dos cláusulas, casi idénticas en su construcción («si se ahogaba, perdería...» / «si las soltaba, perdería...»), solo se diferencian en su desenlace. Esa simetría hace más evidente —y más absurda— la elección del hombre, que escoge la opción que repite la palabra «vida» en su forma negativa.`,
      },
      {
        fragmentId: fragPiedras.id,
        type: "figura",
        category: "sonoro",
        ...anchor(piedrasText, "A quien por codicia la vida aventura,\nlas más de las veces el bien poco dura."),
        order: 3,
        content: `**Pareado final**: los dos versos que cierran el ejemplo riman «aventura» con «dura», resumiendo en una fórmula breve y memorizable —casi un proverbio— la moraleja de todo el relato. Es el cierre habitual de cada exemplum del libro.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragPiedras.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Por qué muere el hombre del cuento? ¿Qué le grita el hombre de la orilla, y por qué no le hace caso?`,
      },
      {
        fragmentId: fragPiedras.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `¿Qué relación hay entre la duda del conde Lucanor —quedarse o no en un lugar peligroso por dinero— y la historia que le cuenta Patronio? ¿En qué se parece el conde al hombre del río, y en qué se diferencia?`,
      },
      {
        fragmentId: fragPiedras.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `Patronio distingue entre arriesgar la vida «por afán de riquezas» y arriesgarla «en defensa de la honra o por alguna cosa a que estéis obligado». ¿Te parece una distinción razonable? ¿Se te ocurren ejemplos actuales de una y otra cosa?`,
      },

      // Intertextualidad
      {
        fragmentId: fragPiedras.id,
        type: "intertextualidad",
        ...anchor(piedrasText, "Por no perder las piedras preciosas que traía consigo no quiso soltarlas y murió en el río."),
        order: 1,
        linkType: "external",
        externalCitation: `Evangelio de Lucas, 12, 16-21 (parábola del rico insensato): un hombre amontona el grano en graneros cada vez más grandes, seguro de poder «descansar, comer, beber, y darse a la buena vida», hasta que se le dice: «Esta noche te van a reclamar la vida; y todo lo que has amontonado, ¿para quién será?».`,
        content: `El cuento de Patronio comparte con esta parábola evangélica la misma ironía trágica: un hombre confunde la posesión de bienes con la seguridad, y es precisamente esa confusión la que le cuesta la vida. En ambos casos, la riqueza que debía garantizar el bienestar termina siendo la causa directa de la ruina.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — La zorra y el gallo
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «La zorra y el gallo»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragZorraGallo.id,
        type: "glosa",
        ...anchor(zorraGalloText, "el gallo se apercibió de su presencia"),
        order: 1,
        content: `«Apercibirse»: darse cuenta, percatarse. Es la primera reacción acertada del gallo —ponerse a salvo en el árbol— frente a la que, más adelante, será su perdición: dejarse llevar por el miedo.`,
      },
      {
        fragmentId: fragZorraGallo.id,
        type: "glosa",
        ...anchor(zorraGalloText, "empezó a decirle muchas lisonjas"),
        order: 2,
        content: `«Lisonjas»: halagos interesados, alabanzas con que se busca ganar la voluntad de alguien para un fin propio. La zorra prueba primero la persuasión antes de recurrir a la amenaza y, por último, al engaño.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragZorraGallo.id,
        type: "contexto",
        ...anchor(zorraGalloText, "criaba muchas gallinas y muchos gallos"),
        order: 1,
        content: `La fábula de animales —zorras astutas, gallos vanidosos o asustadizos, lobos, corderos— es uno de los repertorios narrativos más antiguos y más reutilizados de la literatura didáctica, desde Esopo hasta las colecciones orientales (Calila e Dimna, Sendebar) que don Juan Manuel y sus contemporáneos conocían a través de las traducciones promovidas por Alfonso X en el siglo XIII.`,
      },
      {
        fragmentId: fragZorraGallo.id,
        type: "contexto",
        ...anchor(zorraGalloText, "comenzó a amenazarle, diciéndole que se arrepentiría de no haberse fiado de ella"),
        order: 2,
        content: `Este ejemplo responde a una pregunta del conde sobre el miedo que le inspiran sus enemigos: igual que la zorra, estos pueden recurrir a halagos y amenazas para hacer salir al conde de una posición segura. Patronio le advierte, a través de la fábula, de que la peor amenaza no siempre es la más ruidosa.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragZorraGallo.id,
        type: "figura",
        category: "topos",
        ...anchor(zorraGalloText, "le vio la zorra y se vino a él para cogerle sin que la viera"),
        order: 1,
        content: `**El apólogo animal**: zorra y gallo no son solo animales, sino encarnaciones de comportamientos humanos —la astucia calculadora frente al miedo que no sabe distinguir el peligro real del imaginario—. El lector está invitado a reconocerse en uno de los dos papeles.`,
      },
      {
        fragmentId: fragZorraGallo.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(zorraGalloText, "le fue llevando de árbol en árbol hasta lograr cogerlo"),
        order: 2,
        content: `**Gradación**: el relato avanza «de árbol en árbol», repitiendo el mismo patrón —miedo, huida, nuevo árbol— hasta el desenlace. Esa repetición casi mecánica convierte la persecución en algo casi previsible: el lector ve venir el final antes que el propio gallo.`,
      },
      {
        fragmentId: fragZorraGallo.id,
        type: "figura",
        category: "tropo",
        ...anchor(zorraGalloText, "empezó a roer el tronco con los dientes y a dar en él golpes con la cola"),
        order: 3,
        content: `**La zorra como símbolo de la astucia**: roer el tronco y golpearlo con la cola no pone al gallo en peligro real —el árbol no va a caer—, pero produce el efecto deseado: el miedo. La zorra no ataca; fabrica una amenaza con la que el gallo, él solo, se pondrá en peligro.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragZorraGallo.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Cómo intenta la zorra hacer bajar al gallo del árbol? Enumera, por orden, las distintas estrategias que prueba.`,
      },
      {
        fragmentId: fragZorraGallo.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El gallo estaba a salvo en el primer árbol. ¿Qué es, exactamente, lo que acaba poniéndolo en peligro: la zorra, o su propia reacción ante ella?`,
      },
      {
        fragmentId: fragZorraGallo.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `¿Conoces situaciones —personales, sociales o políticas— en las que el miedo a una amenaza, más que la amenaza misma, sea lo que termina causando el daño? Pon un ejemplo y explica el paralelismo con la fábula.`,
      },

      // Intertextualidad
      {
        fragmentId: fragZorraGallo.id,
        type: "intertextualidad",
        ...anchor(zorraGalloText, "el miedo, sin embargo, le llevó a huir a los otros árboles"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragPiedras.id,
        content: `Como en «El hombre cargado de piedras preciosas», Patronio vuelve a responder a una duda del conde con la historia de un personaje que se pierde por no saber valorar correctamente un riesgo: allí, el hombre confunde unas piedras con la vida; aquí, el gallo confunde un ruido con un peligro. En ambos casos, el error no está en el mundo, sino en la cabeza de quien lo sufre.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — El deber del conde Fernán González
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «El deber del conde Fernán González»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragFernanGonzalez.id,
        type: "glosa",
        ...anchor(fernanGonzalezText, "buenas aves de cetrería"),
        order: 1,
        content: `«Cetrería»: arte de cazar con aves rapaces —halcones, azores— adiestradas para ese fin. Era uno de los pasatiempos aristocráticos por excelencia, y aquí representa precisamente lo que el conde Fernán González decide no permitirse mientras su tierra siga en peligro.`,
      },
      {
        fragmentId: fragFernanGonzalez.id,
        type: "glosa",
        ...anchor(fernanGonzalezText, "Una vez que estaba allí más sosegado y en paz"),
        order: 2,
        content: `«Sosegado»: tranquilo, en calma, sin agitación. La paz que ha alcanzado el conde tras «luchar muy duramente» es precisamente lo que pone a prueba su determinación: ¿qué hacer cuando, por fin, se puede descansar?`,
      },

      // Contextualización histórica
      {
        fragmentId: fragFernanGonzalez.id,
        type: "contexto",
        ...anchor(fernanGonzalezText, "el conde Fernán González vivía en Burgos"),
        order: 1,
        content: `Fernán González (siglo X) fue el primer conde de Castilla en lograr una independencia de hecho respecto al reino de León, y se convirtió en una figura semilegendaria de la épica y la historiografía castellanas —protagonista, décadas más tarde, de un extenso poema narrativo en su honor—. Don Juan Manuel lo recupera aquí como modelo de gobernante que nunca se permite el descanso mientras su pueblo está en peligro.`,
      },
      {
        fragmentId: fragFernanGonzalez.id,
        type: "contexto",
        ...anchor(fernanGonzalezText, "estaban en guerra con los moros, con los leoneses y con los navarros"),
        order: 2,
        content: `La Castilla naciente del siglo X estaba rodeada de fronteras activas en todas direcciones —con Al-Ándalus al sur, con León al oeste, con Navarra al este—. Esa sensación de estar permanentemente «cercados» explica la lógica de Patronio: bajar la guardia, aunque sea un instante, no es solo un descanso, sino una invitación al ataque.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragFernanGonzalez.id,
        type: "figura",
        category: "tropo",
        ...anchor(fernanGonzalezText, "«Murió el hombre, pero no murió su nombre»"),
        order: 1,
        content: `**El refrán como argumento**: Patronio no inventa una razón abstracta, sino que recurre a un dicho popular —y a su variante invertida— para condensar toda su argumentación en una fórmula memorable. La antítesis entre «hombre» y «nombre», casi idénticos en la forma, marca la diferencia entre la vida biológica, que se acaba, y la fama, que puede perdurar.`,
      },
      {
        fragmentId: fragFernanGonzalez.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(fernanGonzalezText, "Mas si, por el contrario, queremos olvidar las comodidades y nos esforzamos por defender este joven reino y acrecentar nuestra honra"),
        order: 2,
        content: `**Estructura disyuntiva**: todo el razonamiento de Patronio se construye sobre dos ramas paralelas —«si nos dedicamos al ocio... pero si, por el contrario, nos esforzamos...»—, cada una con su propio refrán como conclusión. El conde Fernán González (y, con él, el conde Lucanor) no elige entre dos acciones, sino entre dos destinos posibles para su nombre.`,
      },
      {
        fragmentId: fragFernanGonzalez.id,
        type: "figura",
        category: "topos",
        ...anchor(fernanGonzalezText, "viva siempre la fama de vuestras grandes empresas"),
        order: 3,
        content: `**La fama como segunda vida**: frente a la vida biológica, breve e igual para todos («como hemos de morir, felices o desgraciados»), la fama de las propias obras se presenta como una forma de pervivencia que cada uno se gana —o no— en vida. Es un tópico que la literatura castellana retomará una y otra vez en las décadas siguientes.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragFernanGonzalez.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Qué le propone Nuño Laínez al conde Fernán González? ¿Por qué no acepta este la propuesta?`,
      },
      {
        fragmentId: fragFernanGonzalez.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `Patronio resume su consejo en dos versiones casi idénticas de un mismo refrán: «Murió el hombre y murió su nombre» frente a «Murió el hombre, pero no murió su nombre». ¿Qué cambia entre una versión y otra, y de qué depende ese cambio?`,
      },
      {
        fragmentId: fragFernanGonzalez.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `El conde Lucanor pedía, al principio, poder «descansar» y «olvidarse de preocupaciones». ¿Te parece el consejo final de Patronio —no descansar nunca, por la fama— un ideal admirable o, más bien, agotador? Razona tu respuesta.`,
      },

      // Intertextualidad
      {
        fragmentId: fragFernanGonzalez.id,
        type: "intertextualidad",
        ...anchor(fernanGonzalezText, "lo que después de muertos mantiene viva la buena fama de nuestros hechos y gestas"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragCoplas.id,
        content: `La idea de que la fama es una forma de vida que sobrevive a la muerte del cuerpo, apenas esbozada aquí por Patronio, será sistematizada poco después por Jorge Manrique en sus Coplas, donde distingue explícitamente entre la vida que se acaba con la muerte y «la de la fama», que puede prolongarse mucho más allá. «Nuestras vidas son los ríos» pone en verso lírico lo que aquí es todavía un argumento práctico de consejero a señor.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — La honra del filósofo
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «La honra del filósofo»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragFilosofo.id,
        type: "glosa",
        ...anchor(filosofoText, "se metió en una callejuela para hacer lo excusado"),
        order: 1,
        content: `«Hacer lo excusado»: eufemismo medieval para referirse a satisfacer una necesidad corporal. El filósofo busca, precisamente, discreción —apartarse, no ser visto—, lo que hace aún más irónico que sea ese gesto de prudencia el que termine arruinando su reputación.`,
      },
      {
        fragmentId: fragFilosofo.id,
        type: "glosa",
        ...anchor(filosofoText, "vivían las mujeres de vida pública"),
        order: 2,
        content: `«Mujeres de vida pública»: eufemismo habitual para referirse a las prostitutas. El filósofo ignora por completo quiénes viven en aquella calleja: su «culpa» no es ningún acto, sino encontrarse, por azar, en el lugar equivocado en el momento equivocado.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragFilosofo.id,
        type: "contexto",
        ...anchor(filosofoText, "una de las cosas de este mundo por la que más debemos esforzarnos es por alcanzar buena fama"),
        order: 1,
        content: `La «fama» —el modo en que los demás juzgan y recuerdan a alguien— era, para la nobleza medieval, un capital tan real como las tierras o las rentas: de ella dependían alianzas, matrimonios y lealtades. La pregunta del conde Lucanor no es vanidosa, sino estrictamente práctica.`,
      },
      {
        fragmentId: fragFilosofo.id,
        type: "contexto",
        ...anchor(filosofoText, "rogar a Dios para que os ilumine en la conservación y aumento de vuestra fama"),
        order: 2,
        content: `Es característico de don Juan Manuel —y de la prosa didáctica medieval en general— no separar del todo lo religioso y lo mundano: cuidar la propia fama ante los hombres y obrar bien ante Dios aparecen aquí como dos caras de una misma conducta, no como objetivos en conflicto.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragFilosofo.id,
        type: "figura",
        category: "topos",
        ...anchor(filosofoText, "le vinieron ganas de evacuar como os he contado"),
        order: 1,
        content: `**El ejemplo «bajo» al servicio de una enseñanza «alta»**: don Juan Manuel no rehúye lo escatológico ni lo cómico cuando le sirve para ilustrar una idea grave. El contraste entre la trivialidad del incidente y la seriedad de la lección sobre la fama es, en sí mismo, parte del argumento: la reputación puede destruirse por el motivo más nimio e inocente.`,
      },
      {
        fragmentId: fragFilosofo.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(filosofoText, "la primera, muy buenas obras que complazcan a Dios"),
        order: 2,
        content: `**Enumeración ternaria**: «la primera cosa... la segunda cosa... la tercera cosa...» es una estructura típica del discurso didáctico medieval, que organiza el consejo en pasos numerados, fáciles de recordar y de aplicar —como una lista de instrucciones.`,
      },
      {
        fragmentId: fragFilosofo.id,
        type: "figura",
        category: "tropo",
        ...anchor(filosofoText, "tanto aprovecha o perjudica lo que opinan las gentes como la propia verdad"),
        order: 3,
        content: `**Antítesis entre apariencia y verdad**: Patronio coloca, una junto a otra y con el mismo peso, «lo que opinan las gentes» y «la propia verdad». No son lo mismo —y de hecho dependen de cosas distintas—, pero ambas, advierte, «aprovechan o perjudican» igual a la fama de una persona.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragFilosofo.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Por qué entra el filósofo en la callejuela? ¿Por qué piensan los vecinos que ha hecho algo deshonesto?`,
      },
      {
        fragmentId: fragFilosofo.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `Enumera las tres cosas que, según Patronio, hay que hacer para mantener la fama. ¿Cuál de las tres depende por completo de uno mismo, y cuál depende de cómo lo vean los demás?`,
      },
      {
        fragmentId: fragFilosofo.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `Patronio afirma que, para la fama, «tanto aprovecha o perjudica lo que opinan las gentes como la propia verdad». ¿Sigue siendo así en la época de las redes sociales? ¿Te parece justo que sea así?`,
      },

      // Intertextualidad
      {
        fragmentId: fragFilosofo.id,
        type: "intertextualidad",
        ...anchor(filosofoText, "todos pensaron que había ido allí para hacer algo impropio"),
        order: 1,
        linkType: "external",
        externalCitation: `Atribuido a Julio César, recogido por Plutarco (Vidas paralelas, «Vida de César», 9-10): al repudiar a su esposa Pompeya por un escándalo del que no había pruebas, César declaró que los suyos debían estar «libres no solo de toda culpa, sino también de toda sospecha».`,
        content: `La máxima atribuida a César —según la cual no basta con ser inocente, sino que hay que parecerlo— es exactamente el principio que ilustra el cuento del filósofo: su comportamiento era intachable, pero las apariencias bastaron para arruinar, al menos por un tiempo, lo que tanto le había costado construir.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Autor y obra — José de Cadalso
  // ---------------------------------------------------------------------
  console.log("Creando «Cartas marruecas» de José de Cadalso...");

  const cadalso = await prisma.author.create({
    data: {
      slug: "jose-de-cadalso",
      name: "José de Cadalso",
      birthYear: 1741,
      deathYear: 1782,
      country: "España",
      era: "Ilustración",
      bio: `José de Cadalso nació en Cádiz en 1741, hijo de una familia de comerciantes enriquecidos. Estudió en colegios de varios países europeos y, de vuelta en España, ingresó en el ejército, donde llegó a coronel de caballería. Hombre de mundo y de vastas lecturas, frecuentó las tertulias ilustradas de Madrid y la Sevilla del asistente Olavide, y cultivó la poesía amorosa, el teatro y la prosa de ideas. Murió en 1782 durante el sitio de Gibraltar, alcanzado por la metralla de una bomba. Sus dos obras mayores, las «Cartas marruecas» y las «Noches lúgubres», se publicaron después de su muerte.`,
      portraitUrl: "/images/authors/jose-de-cadalso.jpg",
    },
  });

  const cartasMarruecas = await prisma.work.create({
    data: {
      slug: "cartas-marruecas",
      title: "Cartas marruecas",
      year: 1789,
      era: "Ilustración",
      genre: "Novela epistolar / ensayo de costumbres",
      synopsis: `Conjunto de noventa cartas, escrito hacia 1774 y publicado póstumamente en 1789, que cruzan tres corresponsales: Gazel, un joven marroquí que viaja por España; Ben-Beley, su maestro, que permanece en Marruecos; y Nuño Núñez, un español ilustrado, amigo de Gazel. El recurso del observador extranjero —tomado de Montesquieu— permite a Cadalso examinar con distancia crítica las costumbres, la educación, la historia y los prejuicios de la España del siglo XVIII.`,
      authorId: cadalso.id,
    },
  });

  // ---------------------------------------------------------------------
  // Fragmentos — Cartas marruecas (Cadalso)
  // ---------------------------------------------------------------------
  console.log("Creando fragmentos de «Cartas marruecas»...");

  const carta7Text = `Pero me acuerdo que yendo a Cádiz, donde se hallaba mi regimiento de guarnición, me extravié y me perdí en un monte. Iba anocheciendo, cuando me encontré con un caballerete de hasta 22 años, de buen porte y presencia. Llevaba un arrogante caballo, sus dos pistolas primorosas, calzón y ajustador de ante con muchas docenas de botones de plata, el pelo dentro de una redecilla blanca, capa de verano caída sobre el anca del caballo, sombrero blanco finísimo y pañuelo de seda morado al cuello. Nos saludamos, como es regular, y preguntándole por el camino de tal parte, me respondió que estaba lejos de allí; que la noche ya estaba encima y dispuesta a tronar; que el monte no era muy seguro; que mi caballo estaba cansado; y que, en vista de todo esto, me aconsejaba y suplicaba que fuese con él a un cortijo de su abuelo, que estaba a media legua corta. Lo dijo todo con tanta franqueza y agasajo, y lo instó con tanto empeño, que acepté la oferta. La conversación cayó, según costumbre, sobre el tiempo y cosas semejantes; pero en ella manifestaba el mozo una luz natural clarísima con varias salidas de viveza y feliz penetración, lo cual, junto con una voz muy agradable y gusto muy proporcionado, mostraba en él todos los requisitos naturales de un perfecto orador; pero de los artificiales, esto es, de los que enseña el arte por medio del estudio, no se hallaba uno siquiera. Salimos ya del monte cuando, no pudiendo menos de notar lo hermoso de los troncos que acabábamos de ver, le pregunté si cortaban de aquella madera para construcción de navíos.

—¿Qué sé yo de eso? —me respondió con presteza—. Para eso, mi tío el comendador. En todo el día no habla sino de navíos, brulotes, fragatas y galeras. ¡Válgame Dios, y qué pesado está el buen caballero! ¡Poquitas veces hemos oído de su boca, algo trémula por sobra de años y falta de dientes, la batalla de Tolón, la toma de los navíos La Princesa y El Glorioso, la colocación de los navíos de Leso en Cartagena! Tengo la cabeza llena de almirantes holandeses e ingleses. Por cuanto hay en el mundo dejará de rezar todas las noches a San Telmo por los navegantes; y luego entra un gran parladillo sobre los peligros de la mar al que se sigue otro sobre la pérdida de toda una flota entera, no sé qué año, en que se escapó el buen señor nadando, y luego una digresión muy natural y bien traída sobre lo útil que es el saber nadar. Desde que tengo uso de razón no lo he visto corresponderse por escrito con otro que con el marqués de la Victoria, ni le he conocido más pesadumbre que la que tuvo cuando supo la muerte de don Jorge Juan. El otro día estábamos muy descuidados comiendo, y, al dar el reloj las tres, dio una gran palmada en la mesa, que hubo de romperla o romperse las manos, y dijo, no sin muchísima cólera: —A esta hora fue cuando se llegó a nosotros, que íbamos en el navío La Princesa, el tercer navío inglés; y a fe que era muy hermoso: era de noventa cañones. ¡Y qué velero! De eso no he visto. Lo mandaba un señor oficial. Si no por él, los otros dos no hubiéramos contado el lance. Pero, ¿qué se ha de hacer? ¡Tantos a uno!—. Y en esto le asaltó la gota que padece días ha, y que nos valió un poco de descanso, porque si no, tenía traza de irnos contando de uno en uno todos los lances de mar que ha habido en el mundo desde el arca de Noé.

Cesó por un rato el mozalbete la murmuración contra un tío tan venerable, según lo que él mismo contaba; y al entrar en un campo muy llano, con dos lugarcitos que se descubrían a corta distancia el uno del otro: —¡Bravo campo —dije yo— para disponer setenta mil hombres en batalla!—. Con ésas a mi primo el cadete de Guardias —respondió el otro con igual desembarazo—. Sabe cuántas batallas se han dado desde que los ángeles buenos derrotaron a los malos. Y no es lo más eso, sino que sabe también las que se perdieron, por qué se perdieron; las que se ganaron, por qué se ganaron; y por qué quedaron indecisas las que ni se ganaron ni se perdieron. Ya lleva gastados no sé cuántos doblones en instrumentos de matemáticas, y tiene un baúl lleno de unos planos, que él llama, y son unas estampas feas que ni tienen caras ni cuerpos.

Procuré no hablarle más de ejército que de marina, y sólo le dije: —No será lejos de aquí la batalla que se dio en tiempo de don Rodrigo y fue tan costosa como nos dice la historia.

—¡Historia! —dijo—. Me alegrara que estuviera aquí mi hermano el canónigo de Sevilla; yo no la he aprendido, porque Dios me ha dado en él una biblioteca viva de todas las historias del mundo. Es mozo que sabe de qué color era el vestido que llevaba puesto el rey don Fernando cuando tomó a Sevilla.

Llegábamos ya cerca del cortijo, sin que el caballero me hubiese contestado a materia alguna de cuantas le toqué. Mi natural sinceridad me llevó a preguntarle cómo le habían educado, y me respondió: —A mi gusto, al de mi madre y al de mi abuelo, que era un señor muy anciano que me quería como a las niñas de sus ojos. Murió de cerca de cien años de edad. Había sido capitán de Lanzas de Carlos II, en cuyo palacio se había criado. Mi padre bien quería que yo estudiase, pero tuvo poca vida y autoridad para conseguirlo. Murió sin tener el gusto de verme escribir. Ya me había buscado un ayo, y la cosa iba de veras, cuando cierto accidentillo lo descompuso todo.

—¿Cuáles fueron sus primeras lecciones? —preguntéle yo. —Ninguna —respondió el muchacho—; ya sabía yo leer un romance y tocar unas seguidillas; ¿para qué necesita más un caballero? Mi dómine bien quiso meterme en honduras, pero le fue muy mal y hubo de irle mucho peor. El caso fue que había yo concurrido con otros amigos a un encierro. Súpolo, y vino tras mí a oponerse a mi voluntad. Llegó precisamente a tiempo que los vaqueros me andaban enseñando cómo se toma la vara. No pudo traerle su desgracia a peor ocasión. A la segunda palabra que quiso hablar, le di un varazo tan fuerte en medio de la cabeza, que se la abrí en más cascos que una naranja; y gracias a que me contuve, porque mi primer pensamiento fue ponerle una vara lo mismo que a un toro de diez años; pero, por primera vez, me contenté con lo dicho. Todos gritaban: ¡Viva el señorito! Y hasta el tío Gregorio, que es hombre de pocas palabras, exclamó: —¡Lo ha hecho uzía como un ángel del cielo!

—¿Quién es ese tío Gregorio? —preguntéle, atónito de que aprobase tal insolencia; y me respondió: —El tío Gregorio es un carnicero de la ciudad que suele acompañarnos a comer, fumar y jugar. ¡Poquito le queremos todos los caballeros de por acá! Con ocasión de irse mi primo Jaime María a Granada y yo a Sevilla, hubimos de sacar la espada sobre quién lo había de llevar; y en esto hubiera parado la cosa, si en aquel tiempo mismo no le hubiera prendido la justicia por no sé qué puñaladillas que dio en la feria y otras frioleras semejantes, que todo ello se compuso al mes de cárcel.

Dándome cuenta del carácter del tío Gregorio y otros iguales personajes, llegamos al cortijo. Presentome a los que allí se hallaban, que eran amigos o parientes suyos de la misma edad, clase y crianza; se habían juntado para ir a una cacería; y esperando la hora competente, pasaban la noche jugando, cenando, cantando y hablando; para todo lo cual se hallaban muy bien provistos, porque habían concurrido algunas gitanas con sus venerables padres, dignos esposos y preciosos hijos. Allí tuve la dicha de conocer al señor tío Gregorio. A su voz ronca y hueca, patilla larga, vientre redondo, modales ásperas, frecuentes juramentos y trato familiar, se distinguía entre todos. Su oficio era hacer cigarros, dándolos ya encendidos de su boca a los caballeritos, atizar los velones, decir el nombre y mérito de cada gitana, llevar el compás con las palmas de las manos cuando bailaba alguno de sus más apasionados protectores, y brindar a sus saludes con medios cántaros de vino. Conociendo que venía cansado, me hicieron cenar luego y me llevaron a un cuarto algo apartado para dormir, destinando un mozo del cortijo que me llamase y condujese al camino. Contarte los dichos y hechos de aquella academia fuera imposible, o tal vez indecente; sólo diré que el humo de los cigarros, los gritos y palmadas del tío Gregorio, la bulla de todas las voces, el ruido de las castañuelas, lo destemplado de la guitarra, el chillido de las gitanas sobre cuál había de tocar el polo para que lo bailase Preciosilla, el ladrido de los perros y el desentono de los que cantaban, no me dejaron pegar los ojos en toda la noche. Llegada la hora de marchar, monté a caballo, diciéndome a mí mismo en voz baja: ¡Así se cría una juventud que pudiera ser tan útil si fuera la educación igual al talento! Y un hombre serio, que al parecer estaba de mal humor con aquel género de vida, oyéndome, me dijo con lágrimas en los ojos: —Sí, señor.`;

  const fragCartaVII = await prisma.fragment.create({
    data: {
      slug: "carta-vii-cadalso",
      title: "Carta VII",
      location: "Cartas marruecas, Carta VII",
      headline: "«Lo ha hecho uzía como un ángel del cielo»",
      text: carta7Text,
      order: 1,
      status: "published",
      featured: false,
      workId: cartasMarruecas.id,
      constellations: { connect: [{ slug: "critica-social" }] },
      places: { connect: [{ slug: "cadiz" }] },
      characters: { connect: [{ slug: "gazel" }, { slug: "nuno-nunez" }] },
      artworkImageUrl:
        "/images/artworks/goya-la-novillada.jpg",
      artworkTitle: "La novillada",
      artworkAuthor: "Francisco de Goya, h. 1780",
      artworkCaption:
        "Un grupo de jóvenes acomodados se entretiene toreando ante un público de aficionados: el mismo mundo de cortijos, becerradas y caballeritos ociosos en el que Nuño sitúa su anécdota sobre la educación de la nobleza rural.",
    },
  });

  const carta41Text = `El poderoso de este siglo (hablo del acaudalado, cuyo dinero físico es el objeto del lujo) ¿en qué gasta sus rentas? Despiértanle dos ayudas de cámara primorosamente peinados y vestidos; toma café de Moca exquisito en taza traída de la China por Londres; pónese una camisa finísima de Holanda, luego una bata de mucho gusto tejida en León de Francia; lee un libro encuadernado en París; viste a la dirección de un sastre y peluquero francés; sale con un coche que se ha pintado donde el libro se encuadernó; va a comer en vajilla labrada en París o Londres las viandas calientes, y en platos de Sajonia o China las frutas y dulces; paga a un maestro de música y otro de baile, ambos extranjeros; asiste a una ópera italiana, bien o mal representada, o a una tragedia francesa, bien o mal traducida; y al tiempo de acostarse, puede decir esta oración: «Doy gracias al cielo de que todas mis operaciones de hoy han salido dirigidas a echar fuera de mi patria cuanto oro y plata ha estado en mi poder».

Hasta aquí he hablado con relación a la política, pues considerando sobre las costumbres, esto es, hablando no como estadista, sino como filósofo, «todo lujo es dañoso, porque multiplica las necesidades de la vida, emplea el entendimiento humano en cosas frívolas y, dorando los vicios, hace despreciable la virtud, siendo ésta la única que produce los verdaderos bienes y gustos».`;

  const fragCartaXLI = await prisma.fragment.create({
    data: {
      slug: "carta-xli-cadalso",
      title: "Carta XLI",
      location: "Cartas marruecas, Carta XLI",
      headline: "«Cuanto oro y plata ha estado en mi poder»",
      text: carta41Text,
      order: 2,
      status: "published",
      featured: false,
      workId: cartasMarruecas.id,
      constellations: { connect: [{ slug: "critica-social" }] },
      places: { connect: [{ slug: "madrid" }] },
      characters: { connect: [{ slug: "gazel" }, { slug: "ben-beley" }] },
      artworkImageUrl:
        "/images/artworks/paret-la-tienda.jpg",
      artworkTitle: "La tienda",
      artworkAuthor: "Luis Paret y Alcázar, h. 1772",
      artworkCaption:
        "El interior de una tienda de lujo madrileña, con porcelanas, telas, espejos y biombos llegados de medio mundo, y una clientela aristocrática que los examina como si fueran lo más natural: el mismo «comercio de lo superfluo» que Gazel retrata en la rutina diaria del «poderoso de este siglo».",
    },
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Carta VII (Cadalso)
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Carta VII»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragCartaVII.id,
        type: "glosa",
        ...anchor(carta7Text, "mi tío el comendador"),
        order: 1,
        content: `«Comendador»: caballero de una orden militar (Santiago, Calatrava, Malta...) que gobierna una «encomienda», sus rentas y territorios. Para un militar retirado, era a menudo un título honorífico más que un cargo activo: de ahí que este comendador tenga todo el tiempo del mundo para repetir, una y otra vez, las batallas navales de su juventud.`,
      },
      {
        fragmentId: fragCartaVII.id,
        type: "glosa",
        ...anchor(carta7Text, "Mi dómine bien quiso meterme en honduras"),
        order: 2,
        content: `«Dómine» (del latín *dominus*, «señor»): nombre, a menudo algo burlón, que se daba al maestro particular —normalmente un clérigo— encargado de enseñar latín y primeras letras a los hijos de una familia noble. «Meterse en honduras» significa adentrarse en asuntos difíciles: el dómine quiso, sin éxito, enseñarle algo más que «leer un romance y tocar unas seguidillas».`,
      },
      {
        fragmentId: fragCartaVII.id,
        type: "glosa",
        ...anchor(carta7Text, "uzía"),
        order: 3,
        content: `«Uzía»: forma popular y deformada de «usía», contracción a su vez de «vuestra señoría». Es un tratamiento de respeto que tío Gregorio —un carnicero— dirige al «señorito» precisamente para aplaudir el golpe que este ha dado a su tutor: la fórmula de cortesía sirve aquí para premiar la violencia.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragCartaVII.id,
        type: "contexto",
        ...anchor(carta7Text, "Pero me acuerdo que yendo a Cádiz, donde se hallaba mi regimiento de guarnición, me extravié y me perdí en un monte."),
        order: 1,
        content: `Esta anécdota es la respuesta de Nuño a una reflexión más amplia de Gazel sobre la educación en Europa: a diferencia de Marruecos, donde «todos somos igualmente despreciables» ante el poder absoluto, en Europa la nobleza se divide en clases cuyos hijos —desde muy jóvenes— habrán de «gobernar sus estados», «mandar cuerpos militares» y «concurrir con los embajadores». Según esa teoría, la educación debería ser allí «objeto de la primera importancia». Lo que sigue es la prueba, con nombres y apellidos, de hasta qué punto esa teoría falla en la práctica española del siglo XVIII.`,
      },
      {
        fragmentId: fragCartaVII.id,
        type: "contexto",
        ...anchor(carta7Text, "Llegó precisamente a tiempo que los vaqueros me andaban enseñando cómo se toma la vara."),
        order: 2,
        content: `«Tomar la vara» —ejercitarse en el manejo de la garrocha para acosar o picar reses bravas— era, en los cortijos andaluces, una destreza tan valorada entre los jóvenes hacendados como las armas o la equitación. Es, junto con los «encierros», el único «aprendizaje» en el que el caballerete destaca: la educación que recibe es exclusivamente la del campo y la fiesta, nunca la del aula.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragCartaVII.id,
        type: "figura",
        category: "tropo",
        ...anchor(carta7Text, "—¡Lo ha hecho uzía como un ángel del cielo!"),
        order: 1,
        content: `**Ironía**: comparar con «un ángel del cielo» el golpe que abre la cabeza de un tutor «en más cascos que una naranja» invierte por completo la escala moral del lector. La exclamación de tío Gregorio no es absurda dentro de ese mundo —es la reacción esperada—, y por eso resulta tan eficaz como crítica: revela un sistema de valores ya descompuesto.`,
      },
      {
        fragmentId: fragCartaVII.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(carta7Text, "Llevaba un arrogante caballo, sus dos pistolas primorosas, calzón y ajustador de ante con muchas docenas de botones de plata, el pelo dentro de una redecilla blanca, capa de verano caída sobre el anca del caballo, sombrero blanco finísimo y pañuelo de seda morado al cuello."),
        order: 2,
        content: `**Enumeración descriptiva**: antes de que el caballerete pronuncie una sola palabra, Nuño lo construye por completo a partir de sus posesiones —caballo, pistolas, botones de plata, redecilla, capa, sombrero, pañuelo—. Esa misma acumulación de objetos, sin una sola referencia a su persona o su carácter, anticipa lo que el relato confirmará: que en este personaje la apariencia lo es todo.`,
      },
      {
        fragmentId: fragCartaVII.id,
        type: "figura",
        category: "topos",
        ...anchor(carta7Text, "mostraba en él todos los requisitos naturales de un perfecto orador; pero de los artificiales, esto es, de los que enseña el arte por medio del estudio, no se hallaba uno siquiera"),
        order: 3,
        content: `**El talento natural malgastado**: tópico muy querido por los ilustrados —Cadalso, Jovellanos, Feijoo— según el cual España no carece de ingenios, sino de instituciones capaces de cultivarlos. La «luz natural clarísima» del caballerete existe; lo que falta es todo lo demás.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragCartaVII.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `Haz una lista de las cosas que el caballerete sabe hacer (montar, lidiar reses, vestir a la moda...) y otra de las cosas que no sabe o que le aburren (historia, geografía, navegación...). ¿Qué hizo exactamente para merecer la exclamación de tío Gregorio?`,
      },
      {
        fragmentId: fragCartaVII.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `Nuño cuenta esta historia para responder a una reflexión sobre la educación de la nobleza europea. ¿Por qué un relato con personajes y diálogos —en lugar de un razonamiento abstracto— puede resultar más convincente para denunciar ese problema?`,
      },
      {
        fragmentId: fragCartaVII.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `Al final, un hombre sin nombre confirma con lágrimas, en voz baja, lo que Nuño se decía a sí mismo. ¿Qué añade esa reacción muda a la crítica? ¿Conoces hoy entornos —familiares, escolares, sociales— en los que se aplauda o se consienta algo que, en realidad, perjudica a la persona aplaudida?`,
      },

      // Intertextualidad
      {
        fragmentId: fragCartaVII.id,
        type: "intertextualidad",
        ...anchor(carta7Text, "¡Así se cría una juventud que pudiera ser tan útil si fuera la educación igual al talento!"),
        order: 1,
        linkType: "external",
        externalCitation: `Jean-Jacques Rousseau, Emilio, o De la educación (1762), libro I: «Todo está bien tal como sale de las manos del Autor de las cosas; todo degenera en las manos del hombre».`,
        content: `Rousseau y Cadalso parten de la misma idea: la naturaleza entrega al ser humano disposiciones valiosas —aquí, la «luz natural clarísima» del caballerete— que la sociedad puede malograr. Pero mientras Rousseau propone alejar al niño de la corrupción social para que esa naturaleza se desarrolle libre, Nuño constata el resultado contrario: dejada «a mi gusto, al de mi madre y al de mi abuelo», esa misma naturaleza ha quedado en manos de la peor escuela posible, la del cortijo y el tío Gregorio.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Carta XLI (Cadalso)
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Carta XLI»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas léxicas
      {
        fragmentId: fragCartaXLI.id,
        type: "glosa",
        ...anchor(carta41Text, "café de Moca exquisito en taza traída de la China por Londres"),
        order: 1,
        content: `El «café de Moca» procedía del puerto de Mokha, en el actual Yemen, y era una de las variedades más cotizadas de Europa. En una sola frase, antes incluso de levantarse de la cama, el «poderoso» ya ha reunido un grano de Arabia y una taza de porcelana china, comprados ambos a través del mercado de Londres.`,
      },
      {
        fragmentId: fragCartaXLI.id,
        type: "glosa",
        ...anchor(carta41Text, "platos de Sajonia o China las frutas y dulces"),
        order: 2,
        content: `«Sajonia» remite a la porcelana de Meissen, la primera fábrica europea de porcelana (fundada en 1710) y, durante todo el siglo XVIII, uno de los artículos de lujo más codiciados, capaz de rivalizar con las piezas importadas directamente de China.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragCartaXLI.id,
        type: "contexto",
        ...anchor(carta41Text, "echar fuera de mi patria cuanto oro y plata ha estado en mi poder"),
        order: 1,
        content: `Una de las grandes preocupaciones de los economistas ilustrados españoles —Campomanes, Jovellanos— era la salida constante de oro y plata americanos hacia Francia e Inglaterra para pagar manufacturas de lujo, en una balanza comercial donde España exportaba materias primas y compraba productos elaborados. Esta misma carta, unas líneas antes de este fragmento, había expuesto el problema a escala nacional; aquí Gazel lo reduce a la escala de un solo aristócrata, cuyo día entero resulta ser, en miniatura, una fuga de riqueza hacia el extranjero.`,
      },
      {
        fragmentId: fragCartaXLI.id,
        type: "contexto",
        ...anchor(carta41Text, "todo lujo es dañoso, porque multiplica las necesidades de la vida, emplea el entendimiento humano en cosas frívolas y, dorando los vicios, hace despreciable la virtud, siendo ésta la única que produce los verdaderos bienes y gustos"),
        order: 2,
        content: `La «querella del lujo» —si el consumo suntuario de los ricos es perjudicial o, por el contrario, beneficia a toda la sociedad al hacer circular el dinero— fue uno de los grandes debates económicos y morales del siglo XVIII europeo. Cadalso, que unas líneas antes había razonado «como estadista» sobre las ventajas de un «lujo nacional», cierra la carta tomando partido «como filósofo» por la condena moral.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragCartaXLI.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(carta41Text, "Despiértanle dos ayudas de cámara primorosamente peinados y vestidos; toma café de Moca exquisito en taza traída de la China por Londres; pónese una camisa finísima de Holanda, luego una bata de mucho gusto tejida en León de Francia; lee un libro encuadernado en París; viste a la dirección de un sastre y peluquero francés; sale con un coche que se ha pintado donde el libro se encuadernó; va a comer en vajilla labrada en París o Londres las viandas calientes, y en platos de Sajonia o China las frutas y dulces; paga a un maestro de música y otro de baile, ambos extranjeros; asiste a una ópera italiana, bien o mal representada, o a una tragedia francesa, bien o mal traducida"),
        order: 1,
        content: `**Enumeración acumulativa**: la jornada del «poderoso» se construye como una cadena de cláusulas breves, cada una con su procedencia extranjera —Moca, China, Londres, Holanda, Francia, París, Sajonia, Italia—. La pura acumulación, sin un solo comentario explícito, ya demuestra lo que Gazel dirá después con la «oración» final: nada de lo que toca es español.`,
      },
      {
        fragmentId: fragCartaXLI.id,
        type: "figura",
        category: "tropo",
        ...anchor(carta41Text, "«Doy gracias al cielo de que todas mis operaciones de hoy han salido dirigidas a echar fuera de mi patria cuanto oro y plata ha estado en mi poder»"),
        order: 2,
        content: `**Ironía**: Gazel pone en boca del «poderoso» una oración de acción de gracias —forma religiosa, solemne— para expresar, sin que el propio aristócrata se dé cuenta, una confesión devastadora: ha dedicado el día entero a sacar riqueza de su propio país.`,
      },
      {
        fragmentId: fragCartaXLI.id,
        type: "figura",
        category: "tropo",
        ...anchor(carta41Text, "dorando los vicios"),
        order: 3,
        content: `**Metáfora**: «dorar» —cubrir de oro— convierte el lujo en un barniz que embellece por fuera lo que sigue siendo defectuoso por dentro. La imagen recoge, en clave moral, el mismo material —el oro— que antes servía para medir la riqueza que el lujo hace salir de España.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragCartaXLI.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `Haz una lista de todos los lugares de origen que aparecen en el retrato del «poderoso de este siglo» (Moca, China, Londres, Holanda, Francia...). ¿Queda algo español en su rutina de un día?`,
      },
      {
        fragmentId: fragCartaXLI.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `Cadalso distingue entre hablar «como estadista» y hablar «como filósofo». Según el texto, ¿qué problema señala cada uno de los dos puntos de vista sobre el lujo? ¿Por qué crees que Cadalso necesita los dos para cerrar su argumento?`,
      },
      {
        fragmentId: fragCartaXLI.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `La «oración» del poderoso es una broma, pero descansa en una idea seria: que nuestro consumo cotidiano tiene consecuencias económicas que no percibimos. ¿Se te ocurre algún producto o servicio actual de uso diario cuyo «oro y plata» —en sentido amplio— acabe sobre todo en otro país?`,
      },

      // Intertextualidad
      {
        fragmentId: fragCartaXLI.id,
        type: "intertextualidad",
        ...anchor(carta41Text, "todo lujo es dañoso, porque multiplica las necesidades de la vida, emplea el entendimiento humano en cosas frívolas y, dorando los vicios, hace despreciable la virtud, siendo ésta la única que produce los verdaderos bienes y gustos"),
        order: 1,
        linkType: "external",
        externalCitation: `Bernard Mandeville, La fábula de las abejas (1714), subtitulada «Vicios privados, beneficios públicos»: defendía que el lujo, la vanidad y el gasto superfluo de los ricos, lejos de ser un vicio que deba combatirse, son el motor que da trabajo a los artesanos y hace prosperar a las naciones.`,
        content: `La condena final de Cadalso —«todo lujo es dañoso»— es justo la tesis que Mandeville había defendido, provocadoramente, unas décadas antes. Lo curioso es que el propio Cadalso, líneas más arriba, había razonado «como estadista» casi en términos mandevillianos: un «lujo nacional» bien orientado «derrama» el dinero de los ricos entre artesanos y pobres. Solo al final, al hablar «como filósofo», invierte el argumento. La carta contiene, sin nombrarlo, las dos caras de un debate que recorrió toda la Ilustración europea.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Leandro Fernández de Moratín — El sí de las niñas
  // ---------------------------------------------------------------------
  console.log("Creando a Leandro Fernández de Moratín...");

  const moratin = await prisma.author.create({
    data: {
      slug: "leandro-fernandez-de-moratin",
      name: "Leandro Fernández de Moratín",
      birthYear: 1760,
      deathYear: 1828,
      country: "España",
      era: "Ilustración",
      bio: `Nació en Madrid en 1760, hijo del también escritor Nicolás Fernández de Moratín, en cuya tertulia se formó desde niño. Trabajó algún tiempo como joyero antes de que la protección de Jovellanos y, después, de Godoy le permitieran viajar por Francia, Inglaterra e Italia y dedicarse por entero al teatro. Defensor convencido de las reglas neoclásicas —verosimilitud y unidad de acción, tiempo y lugar—, escribió algunas de las comedias más representadas de su época, entre ellas *La comedia nueva o el café* (1792) y *El sí de las niñas*, terminada en 1801 y estrenada con gran éxito en 1806. Su colaboración con la administración de José Bonaparte durante la ocupación francesa le valió la condena de «afrancesado»; restaurado Fernando VII, se exilió en Francia, donde murió, casi ciego, en 1828.`,
      portraitUrl: "/images/authors/leandro-fernandez-de-moratin.jpg",
    },
  });

  const elSiDeLasNinas = await prisma.work.create({
    data: {
      slug: "el-si-de-las-ninas",
      title: "El sí de las niñas",
      year: 1806,
      era: "Ilustración",
      genre: "Comedia neoclásica",
      synopsis: `Don Diego, un hombre acomodado de cincuenta y nueve años, ha concertado con Doña Irene el matrimonio de su hija Doña Francisca, de dieciséis, educada hasta entonces en un convento de Guadalajara. La acción —concentrada, según el precepto neoclásico, en una sola noche y en una posada de Alcalá de Henares— revela que Doña Francisca está secretamente enamorada de «Don Félix de Toledo», un oficial al que conoció antes de concertarse la boda y al que ha prometido fidelidad por carta. Cuando Don Diego descubre que ese pretendiente no es otro que su propio sobrino, Don Carlos, se enfrenta a elegir entre hacer valer el acuerdo con Doña Irene o renunciar a una boda fundada en la obediencia y no en el afecto.`,
      authorId: moratin.id,
    },
  });

  const educacionText = `DON DIEGO. ¿Usted no habrá dormido bien esta noche?

DOÑA FRANCISCA. No, señor. ¿Y usted?

DON DIEGO. Tampoco.

DOÑA FRANCISCA. Ha hecho demasiado calor.

DON DIEGO. ¿Está usted desazonada?

DOÑA FRANCISCA. Alguna cosa.

DON DIEGO. ¿Qué siente usted? (Siéntase junto a DOÑA FRANCISCA.)

DOÑA FRANCISCA. No es nada… Así un poco de… Nada… no tengo nada.

DON DIEGO. Algo será, porque la veo a usted muy abatida, llorosa, inquieta… ¿Qué tiene usted, Paquita? ¿No sabe usted que la quiero tanto?

DOÑA FRANCISCA. Sí, señor.

DON DIEGO. Pues ¿por qué no hace usted más confianza de mí? ¿Piensa usted que no tendré yo mucho gusto en hallar ocasiones de complacerla?

DOÑA FRANCISCA. Ya lo sé.

DON DIEGO. ¿Pues cómo, sabiendo que tiene usted un amigo, no desahoga con él su corazón?

DOÑA FRANCISCA. Porque eso mismo me obliga a callar.

DON DIEGO. Eso quiere decir que tal vez soy yo la causa de su pesadumbre de usted.

DOÑA FRANCISCA. No, señor; usted en nada me ha ofendido… No es de usted de quien yo me debo quejar.

DON DIEGO. Pues ¿de quién, hija mía?… Venga usted acá… (Acércase más.) Hablemos siquiera una vez sin rodeos ni disimulación… Dígame usted: ¿no es cierto que usted mira con algo de repugnancia este casamiento que se la propone? ¿Cuánto va que si la dejasen a usted entera libertad para la elección no se casaría conmigo?

DOÑA FRANCISCA. Ni con otro.

DON DIEGO. ¿Será posible que usted no conozca otro más amable que yo, que la quiera bien, y que la corresponda como usted merece?

DOÑA FRANCISCA. No, señor; no, señor.

DON DIEGO. Mírelo usted bien.

DOÑA FRANCISCA. ¿No le digo a usted que no?

DON DIEGO. ¿Y he de creer, por dicha, que conserve usted tal inclinación al retiro en que se ha criado, que prefiera la austeridad del convento a una vida más…?

DOÑA FRANCISCA. Tampoco; no señor… Nunca he pensado así.

DON DIEGO. No tengo empeño de saber más… Pero de todo lo que acabo de oír resulta una gravísima contradicción. Usted no se halla inclinada al estado religioso, según parece. Usted me asegura que no tiene queja ninguna de mí, que está persuadida de lo mucho que la estimo, que no piensa casarse con otro, ni debo recelar que nadie dispute su mano… Pues ¿qué llanto es ése? ¿De dónde nace esa tristeza profunda, que en tan poco tiempo ha alterado su semblante de usted, en términos que apenas le reconozco? ¿Son éstas las señales de quererme exclusivamente a mí, de casarse gustosa conmigo dentro de pocos días? ¿Se anuncian así la alegría y el amor? (Vase iluminando lentamente la escena, suponiendo que viene la luz del día.)

DOÑA FRANCISCA. Y ¿qué motivos le he dado a usted para tales desconfianzas?

DON DIEGO. ¿Pues qué? Si yo prescindo de estas consideraciones, si apresuro las diligencias de nuestra unión, si su madre de usted sigue aprobándola y llega el caso de…

DOÑA FRANCISCA. Haré lo que mi madre me manda, y me casaré con usted.

DON DIEGO. ¿Y después, Paquita?

DOÑA FRANCISCA. Después… y mientras me dure la vida, seré mujer de bien.

DON DIEGO. Eso no lo puedo yo dudar… Pero si usted me considera como el que ha de ser hasta la muerte su compañero y su amigo, dígame usted: estos títulos ¿no me dan algún derecho para merecer de usted mayor confianza? ¿No he de lograr que usted me diga la causa de su dolor? Y no para satisfacer una impertinente curiosidad, sino para emplearme todo en su consuelo, en mejorar su suerte, en hacerla dichosa, si mi conato y mis diligencias pudiesen tanto.

DOÑA FRANCISCA. ¡Dichas para mí!… Ya se acabaron.

DON DIEGO. ¿Por qué?

DOÑA FRANCISCA. Nunca diré por qué.

DON DIEGO. Pero ¡qué obstinado, qué imprudente silencio!… Cuando usted misma debe presumir que no estoy ignorante de lo que hay.

DOÑA FRANCISCA. Si usted lo ignora, señor Don Diego, por Dios no finja que lo sabe; y si en efecto lo sabe usted, no me lo pregunte.

DON DIEGO. Bien está. Una vez que no hay nada que decir, que esa aflicción y esas lágrimas son voluntarias, hoy llegaremos a Madrid, y dentro de ocho días será usted mi mujer.

DOÑA FRANCISCA. Y daré gusto a mi madre.

DON DIEGO. Y vivirá usted infeliz.

DOÑA FRANCISCA. Ya lo sé.

DON DIEGO. Ve aquí los frutos de la educación. Esto es lo que se llama criar bien a una niña: enseñarla a que desmienta y oculte las pasiones más inocentes con una pérfida disimulación. Las juzgan honestas luego que las ven instruidas en el arte de callar y mentir. Se obstinan en que el temperamento, la edad ni el genio no han de tener influencia alguna en sus inclinaciones, o en que su voluntad ha de torcerse al capricho de quien las gobierna. Todo se las permite, menos la sinceridad. Con tal que no digan lo que sienten, con tal que finjan aborrecer lo que más desean, con tal que se presten a pronunciar, cuando se lo mandan, un sí perjuro, sacrílego, origen de tantos escándalos, ya están bien criadas, y se llama excelente educación la que inspira en ellas el temor, la astucia y el silencio de un esclavo.

DOÑA FRANCISCA. Es verdad… Todo eso es cierto… Eso exigen de nosotras, eso aprendemos en la escuela que se nos da… Pero el motivo de mi aflicción es mucho más grande.`;

  const fragEducacion = await prisma.fragment.create({
    data: {
      slug: "el-si-de-las-ninas-educacion",
      title: "Los frutos de la educación",
      location: "El sí de las niñas, Acto III, Escena VIII",
      headline: "«Ve aquí los frutos de la educación»",
      text: educacionText,
      order: 1,
      status: "published",
      featured: false,
      workId: elSiDeLasNinas.id,
      constellations: { connect: [{ slug: "critica-social" }, { slug: "amor" }] },
      characters: { connect: [{ slug: "don-diego" }, { slug: "dona-francisca" }] },
      places: { connect: [{ slug: "alcala-de-henares" }] },
      artworkImageUrl: "/images/artworks/goya-caprichos-el-si-pronuncian.jpg",
      artworkTitle: "«El sí pronuncian y la mano alargan al primero que llega» (Capricho n.º 2)",
      artworkAuthor: "Francisco de Goya, Los caprichos, 1799",
      artworkCaption:
        "Una novia vestida de blanco, con los ojos como velados, es conducida del brazo hacia un anciano pretendiente de rostro grotesco, mientras una multitud de máscaras y rostros deformados observa y comenta la escena. El título que Goya dio a la estampa —«El sí pronuncian y la mano alargan al primero que llega»— juega con la misma palabra, «sí», que da nombre a la comedia de Moratín: en ambos casos, el «sí» que se exige a una joven no nace de su voluntad, sino del acuerdo entre quienes la rodean.",
    },
  });

  const desenlaceText = `RITA. Señora.

DOÑA FRANCISCA. ¿Me llamaba usted?

DOÑA IRENE. Sí, hija; porque el señor Don Diego nos trata de un modo que ya no se puede aguantar. ¿Qué amores tienes, niña? ¿A quién has dado palabra de matrimonio? ¿Qué enredos son éstos?… Y tú, picarona… Pues tú también lo has de saber… Por fuerza lo sabes… ¿Quién ha escrito este papel? ¿Qué dice? (Presentando el papel abierto a DOÑA FRANCISCA.)

RITA. (Aparte a DOÑA FRANCISCA.) Su letra es.

DOÑA FRANCISCA. ¡Qué maldad!… Señor Don Diego, ¿así cumple usted su palabra?

DON DIEGO. Bien sabe Dios que no tengo la culpa… Venga usted aquí. (Tomando de una mano a DOÑA FRANCISCA, la pone a su lado.) No hay que temer… Y usted, señora, escuche y calle, y no me ponga en términos de hacer un desatino… Deme usted ese papel… (Quitándole el papel.) Paquita, ya se acuerda usted de las tres palmadas de esta noche.

DOÑA FRANCISCA. Mientras viva me acordaré.

DON DIEGO. Pues éste es el papel que tiraron a la ventana… No hay que asustarse, ya lo he dicho. (Lee.) «Bien mío: si no consigo hablar con usted, haré lo posible para que llegue a sus manos esta carta. Apenas me separé de usted, encontré en la posada al que yo llamaba mi enemigo, y al verle no sé cómo no expiré de dolor. Me mandó que saliera inmediatamente de la ciudad, y fue preciso obedecerle. Yo me llamo Don Carlos, no Don Félix. Don Diego es mi tío. Viva usted dichosa y olvide para siempre a su infeliz amigo. Carlos de Urbina.»

DOÑA IRENE. ¿Conque hay eso?

DOÑA FRANCISCA. ¡Triste de mí!

DOÑA IRENE. ¿Conque es verdad lo que decía el señor, grandísima picarona? Te has de acordar de mí. (Se encamina hacia DOÑA FRANCISCA, muy colérica, y en ademán de querer maltratarla. RITA y DON DIEGO lo estorban.)

DOÑA FRANCISCA. ¡Madre!… ¡Perdón!

DOÑA IRENE. No, señor; que la he de matar.

DON DIEGO. ¿Qué locura es ésta?

DOÑA IRENE. He de matarla.

DON CARLOS. (Sale precipitadamente, coge de un brazo a DOÑA FRANCISCA y se pone delante de ella para defenderla; DOÑA IRENE se asusta y se retira.) Eso no… Delante de mí nadie ha de ofenderla.

DOÑA FRANCISCA. ¡Carlos!

DON CARLOS. (A DON DIEGO.) Disimule usted mi atrevimiento… He visto que la insultaban y no me he sabido contener.

DOÑA IRENE. ¿Qué es lo que me sucede, Dios mío? ¿Quién es usted?… ¿Qué acciones son éstas?… ¡Qué escándalo!

DON DIEGO. Aquí no hay escándalos… Ése es de quien su hija de usted está enamorada… Separarlos y matarlos viene a ser lo mismo… Carlos… No importa… Abraza a tu mujer. (Se abrazan DON CARLOS y DOÑA FRANCISCA, y después se arrodillan a los pies de DON DIEGO.)

DOÑA IRENE. ¿Conque su sobrino de usted?…

DON DIEGO. Sí, señora; mi sobrino, que con sus palmadas, y su música, y su papel me ha dado la noche más terrible que he tenido en mi vida… ¿Qué es esto, hijos míos, qué es esto?

DOÑA FRANCISCA. ¿Conque usted nos perdona y nos hace felices?

DON DIEGO. Sí, prendas de mi alma… Sí. (Los hace levantar con expresión de ternura.)

DOÑA IRENE. ¿Y es posible que usted se determina a hacer un sacrificio?…

DON DIEGO. Yo pude separarlos para siempre y gozar tranquilamente la posesión de esta niña amable, pero mi conciencia no lo sufre… ¡Carlos!… ¡Paquita!… ¡Qué dolorosa impresión me deja en el alma el esfuerzo que acabo de hacer!… Porque, al fin, soy hombre miserable y débil.

DON CARLOS. (Besándole las manos.) Si nuestro amor, si nuestro agradecimiento pueden bastar a consolar a usted en tanta pérdida…

DOÑA IRENE. ¡Conque el bueno de Don Carlos! Vaya que…

DON DIEGO. Él y su hija de usted estaban locos de amor, mientras que usted y las tías fundaban castillos en el aire, y me llenaban la cabeza de ilusiones, que han desaparecido como un sueño… Esto resulta del abuso de autoridad, de la opresión que la juventud padece; éstas son las seguridades que dan los padres y los tutores, y esto es lo que se debe fiar en el sí de las niñas… Por una casualidad he sabido a tiempo el error en que estaba… ¡Ay de aquellos que lo saben tarde!

DOÑA IRENE. En fin, Dios los haga buenos, y que por muchos años se gocen… Venga usted acá, señor; venga usted, que quiero abrazarle. (Abrazando a DON CARLOS, DOÑA FRANCISCA se arrodilla y besa la mano de su madre.) Hija, Francisquita. ¡Vaya! Buena elección has tenido… Cierto que es un mozo muy galán… Morenillo, pero tiene un mirar de ojos muy hechicero.

RITA. Sí, dígaselo usted, que no lo ha reparado la niña… señorita, un millón de besos. (Se besan DOÑA FRANCISCA y RITA.)

DOÑA FRANCISCA. Pero ¿ves qué alegría tan grande?… ¡Y tú, como me quieres tanto!… Siempre, siempre serás mi amiga.

DON DIEGO. Paquita hermosa (Abraza a DOÑA FRANCISCA.), recibe los primeros abrazos de tu nuevo padre… No temo ya la soledad terrible que amenazaba a mi vejez… Vosotros (Asiendo de las manos a DOÑA FRANCISCA y a DON CARLOS.) seréis la delicia de mi corazón; el primer fruto de vuestro amor… sí, hijos, aquél… no hay remedio, aquél es para mí. Y cuando le acaricie en mis brazos, podré decir: a mí me debe su existencia este niño inocente; si sus padres viven, si son felices, yo he sido la causa.

DON CARLOS. ¡Bendita sea tanta bondad!

DON DIEGO. Hijos, bendita sea la de Dios.`;

  const fragDesenlace = await prisma.fragment.create({
    data: {
      slug: "el-si-de-las-ninas-desenlace",
      title: "La renuncia de Don Diego",
      location: "El sí de las niñas, Acto III, Escenas XII-XIII",
      headline: "«Esto es lo que se debe fiar en el sí de las niñas»",
      text: desenlaceText,
      order: 2,
      status: "published",
      featured: false,
      workId: elSiDeLasNinas.id,
      constellations: { connect: [{ slug: "amor" }, { slug: "critica-social" }] },
      characters: {
        connect: [
          { slug: "don-diego" },
          { slug: "dona-francisca" },
          { slug: "don-carlos" },
          { slug: "dona-irene" },
          { slug: "rita" },
        ],
      },
      places: { connect: [{ slug: "alcala-de-henares" }] },
      artworkImageUrl: "/images/artworks/goya-la-boda.jpg",
      artworkTitle: "La boda",
      artworkAuthor: "Francisco de Goya, h. 1791-1792",
      artworkCaption:
        "Bajo el arco de un puente, un cortejo nupcial avanza hacia el espectador: la novia, ricamente vestida, camina junto a un novio mucho mayor que ella, ridículamente engalanado, mientras familiares y curiosos —incluidos varios niños que juegan ajenos a todo— acompañan la comitiva. Goya pintó varias veces esta escena de la «boda desigual», el matrimonio de una joven con un hombre rico y de edad muy superior concertado por las familias: el mismo desenlace que Don Diego, en el último momento, decide no protagonizar.",
    },
  });

  // ---------------------------------------------------------------------
  // Anotaciones — El sí de las niñas (Moratín)
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «El sí de las niñas»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas — Los frutos de la educación
      {
        fragmentId: fragEducacion.id,
        type: "glosa",
        ...anchor(educacionText, "conato"),
        order: 1,
        content: `«Conato» es un cultismo que en el español del siglo XVIII significaba «esfuerzo, empeño dirigido a un fin», sin la connotación de «intento fallido» que ha terminado por imponerse en el uso actual (como en «conato de incendio»). Don Diego no habla de un esfuerzo frustrado, sino de la entrega total —«mi conato y mis diligencias»— que está dispuesto a poner al servicio de la felicidad de Paquita.`,
      },
      {
        fragmentId: fragEducacion.id,
        type: "glosa",
        ...anchor(educacionText, "Paquita"),
        order: 2,
        content: `«Paquita» es el diminutivo cariñoso de Francisca, la forma con la que todos —Don Diego, su madre, Rita— se dirigen a la protagonista a lo largo de la obra. El propio título, *El sí de las niñas*, recoge ese mismo registro: «niñas» no son aquí menores de edad en sentido literal, sino jóvenes en edad de casarse a las que la familia sigue tratando, en las decisiones que más les importan, como si lo fueran.`,
      },
      {
        fragmentId: fragEducacion.id,
        type: "glosa",
        ...anchor(educacionText, "Dichas para mí"),
        order: 3,
        content: `«Dichas», aquí sustantivo plural de «dicha» (felicidad, buena suerte), no el participio del verbo «decir». Doña Francisca lamenta que sus «dichas» —sus posibilidades de ser feliz— «ya se acabaron», justo antes de que Don Diego, sin saberlo todavía, le anuncie la fecha de la boda que ella vive como una condena.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragEducacion.id,
        type: "contexto",
        ...anchor(educacionText, "(Vase iluminando lentamente la escena, suponiendo que viene la luz del día.)"),
        order: 1,
        content: `Moratín respeta con rigor la regla neoclásica de las tres unidades —defendida en España sobre todo por Ignacio de Luzán en su *Poética* (1737)—: toda la comedia transcurre en menos de veinticuatro horas, en un único espacio (la posada de Alcalá de Henares) y en torno a una sola acción, la boda de Paquita. Esta acotación, que indica el amanecer progresivo sobre el escenario, no es solo un detalle realista: marca el final de la noche en la que se han desencadenado todos los enredos y anuncia que el desenlace está a punto de llegar.`,
      },
      {
        fragmentId: fragEducacion.id,
        type: "contexto",
        ...anchor(educacionText, "este casamiento que se la propone"),
        order: 2,
        content: `En la España del siglo XVIII, el matrimonio de una hija dependía en gran medida de la voluntad de los padres o tutores: la propia Pragmática Sanción de 1776, promovida por Carlos III, reforzó la necesidad del consentimiento paterno para evitar los llamados «matrimonios desiguales». Moratín no cuestiona aquí la autoridad paterna en abstracto —Don Diego es, de hecho, un tutor afectuoso—, sino el resultado concreto de ejercerla sin atender a la voluntad de la propia interesada: un «casamiento que se propone», con la hija como sujeto pasivo de una decisión ajena.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragEducacion.id,
        type: "figura",
        category: "tropo",
        ...anchor(educacionText, "el temor, la astucia y el silencio de un esclavo"),
        order: 1,
        content: `**Metáfora**: el parlamento se cierra con una equivalencia deliberadamente escandalosa. La «excelente educación» que reciben las jóvenes produce en ellas las mismas virtudes que se exigen a quien vive bajo dominio ajeno —temor, astucia, silencio—. Al comparar la formación de las «niñas» con la de un esclavo, Don Diego convierte un ideal social, la doncella «bien criada», en una forma de servidumbre.`,
      },
      {
        fragmentId: fragEducacion.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(educacionText, "Con tal que no digan lo que sienten, con tal que finjan aborrecer lo que más desean, con tal que se presten a pronunciar, cuando se lo mandan, un sí perjuro, sacrílego, origen de tantos escándalos"),
        order: 2,
        content: `**Anáfora y gradación**: la triple repetición de «con tal que…», en una estructura paralelística que crece en intensidad —no decir lo que se siente, fingir aborrecer lo que se desea, pronunciar un «sí» perjuro—, construye con la sintaxis misma la idea de acumulación. Cada cláusula añade una nueva renuncia a la sinceridad, hasta desembocar en el «sí» del título, presentado como la culminación de todo un sistema de disimulo.`,
      },
      {
        fragmentId: fragEducacion.id,
        type: "figura",
        category: "topos",
        ...anchor(educacionText, "Ve aquí los frutos de la educación"),
        order: 3,
        content: `**Los frutos de la educación**: «frutos» es una metáfora agrícola muy del gusto ilustrado, que concibe la educación como un cultivo cuyo resultado —bueno o malo— se juzga, como el de una cosecha, por lo que produce. El tópico, habitual en los tratados pedagógicos de la época (y que recorre también la Carta VII de Cadalso, sobre la educación de la nobleza), permite a Don Diego trasladar la responsabilidad de la angustia de Paquita desde la persona hasta el sistema que la ha formado.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragEducacion.id,
        type: "pregunta",
        questionGroup: "literal",
        ...anchor(educacionText, "Eso exigen de nosotras, eso aprendemos en la escuela que se nos da"),
        order: 1,
        content: `Según las propias palabras de Doña Francisca al final de este fragmento, ¿qué es exactamente lo que «exigen» de las mujeres y lo que «se aprende en la escuela que se nos da»?`,
      },
      {
        fragmentId: fragEducacion.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        ...anchor(educacionText, "Ve aquí los frutos de la educación"),
        order: 1,
        content: `Don Diego dedica todo un parlamento a explicar que la tristeza de Paquita es «el fruto de la educación» recibida, y no, por ejemplo, falta de cariño hacia él o un capricho de la muchacha. ¿Qué consigue Moratín, dramáticamente, al hacer que sea el propio pretendiente —y no un personaje neutral— quien formule esta crítica?`,
      },
      {
        fragmentId: fragEducacion.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `Don Diego describe una educación que premia el silencio, la astucia y el disimulo, y castiga la sinceridad. ¿Crees que esa descripción sigue siendo reconocible hoy, en algún ámbito familiar, escolar o social? Argumenta tu respuesta con ejemplos concretos.`,
      },

      // Intertextualidad
      {
        fragmentId: fragEducacion.id,
        type: "intertextualidad",
        ...anchor(educacionText, "Ve aquí los frutos de la educación"),
        order: 1,
        linkType: "external",
        externalCitation: `Mary Wollstonecraft, Vindicación de los derechos de la mujer (A Vindication of the Rights of Woman, 1792): denuncia que la educación dada a las mujeres, orientada a complacer antes que a razonar, produce artificialmente los rasgos —vanidad, debilidad de carácter, falta de sinceridad— que después se les reprochan como defectos «naturales».`,
        content: `Pocos años antes de que Moratín terminara esta comedia, la escritora británica Mary Wollstonecraft había sostenido un argumento muy similar: los defectos que se atribuían «por naturaleza» a las mujeres eran en realidad el resultado previsible de una educación pensada para hacerlas agradables, no razonables. Don Diego, sin citarla, llega a la misma conclusión por el camino del teatro: lo que parece «carácter» de Paquita es, en realidad, el «fruto» de cómo ha sido educada.`,
      },

      // Glosas — La renuncia de Don Diego
      {
        fragmentId: fragDesenlace.id,
        type: "glosa",
        ...anchor(desenlaceText, "picarona"),
        order: 1,
        content: `«Picarona», de «pícaro», es aquí un reproche cariñoso más que una acusación grave: Doña Irene llama así a Rita —cómplice de los amores secretos de su hija— a la vez que se indigna y, en el fondo, no puede evitar cierto tono casi festivo, coherente con el desenlace feliz que se avecina.`,
      },
      {
        fragmentId: fragDesenlace.id,
        type: "glosa",
        ...anchor(desenlaceText, "prendas de mi alma"),
        order: 2,
        content: `«Prenda» significa aquí, en sentido figurado, «persona muy querida»: «prendas de mi alma» es una fórmula de cariño habitual en el español de la época, equivalente a «tesoros» o «seres queridos». Don Diego la emplea justo cuando empieza a hablar no como pretendiente despechado, sino como protector de los dos jóvenes.`,
      },
      {
        fragmentId: fragDesenlace.id,
        type: "glosa",
        ...anchor(desenlaceText, "Morenillo, pero tiene un mirar de ojos muy hechicero"),
        order: 3,
        content: `«Morenillo», diminutivo de «moreno», alude al color de piel y cabello de Don Carlos. En una época en que la piel clara se consideraba el ideal de belleza aristocrático, el comentario de Doña Irene —«morenillo, pero tiene un mirar de ojos muy hechicero»— deja ver, de paso, ese prejuicio estético, superado aquí por la simpatía que el joven acaba de ganarse.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragDesenlace.id,
        type: "contexto",
        ...anchor(desenlaceText, "tres palmadas"),
        order: 1,
        content: `Las «tres palmadas» son la seña secreta que Don Carlos y Doña Francisca han usado durante meses para comunicarse de noche, desde una ventana que daba al corral del convento, según cuenta él mismo en una escena anterior. Este breve recordatorio —«ya se acuerda usted de las tres palmadas de esta noche»— resume en dos palabras toda una historia de amor sostenida en la clandestinidad, la única forma de relación posible para una joven educada en un convento.`,
      },
      {
        fragmentId: fragDesenlace.id,
        type: "contexto",
        ...anchor(desenlaceText, "Esto resulta del abuso de autoridad, de la opresión que la juventud padece"),
        order: 2,
        content: `Esta frase es, en buena medida, la moraleja explícita que Moratín quiso dar a su comedia: no es una crítica al matrimonio concertado en sí, sino a la «opresión» que sufre la juventud cuando su voluntad no cuenta para nada en una decisión que les afecta de por vida. La Pragmática Sanción de 1776 había intentado limitar los «matrimonios desiguales» concertados sin contar con los hijos; la obra de Moratín dramatiza, desde dentro, lo que ocurre cuando esa voluntad silenciada por fin se hace oír —por una casualidad, como reconoce el propio Don Diego, y no por ningún cambio en las reglas.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragDesenlace.id,
        type: "figura",
        category: "tropo",
        ...anchor(desenlaceText, "han desaparecido como un sueño"),
        order: 1,
        content: `**Símil**: compara las expectativas de Don Diego —fundadas, dice, en «castillos en el aire»— con un sueño del que se despierta de golpe. La imagen, muy convencional, adquiere aquí un matiz agridulce: lo que se desvanece no es una ilusión cualquiera, sino la posibilidad de una vejez acompañada que Don Diego, un momento después, decide buscar de otra manera.`,
      },
      {
        fragmentId: fragDesenlace.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(desenlaceText, "¡Carlos!… ¡Paquita!… ¡Qué dolorosa impresión me deja en el alma el esfuerzo que acabo de hacer!… Porque, al fin, soy hombre miserable y débil."),
        order: 2,
        content: `**Fragmentación exclamativa**: la sintaxis se quiebra en una serie de exclamaciones y puntos suspensivos antes de que Don Diego logre formular una idea completa. Esta fragmentación, muy distinta de la elocuencia ordenada con la que el personaje ha hablado hasta ahora, traduce en el ritmo de la frase el esfuerzo real —«el esfuerzo que acabo de hacer»— que le cuesta renunciar a su propia felicidad en favor de la de los dos jóvenes.`,
      },
      {
        fragmentId: fragDesenlace.id,
        type: "figura",
        category: "sonoro",
        ...anchor(desenlaceText, "Siempre, siempre serás mi amiga"),
        order: 3,
        content: `**Repetición (epizeuxis)**: la repetición inmediata de «siempre, siempre» —sin conjunción ni pausa más que la coma— acelera el ritmo de la frase y subraya, con un recurso casi infantil, la efusividad de Doña Francisca en el momento de mayor felicidad de toda la obra. El mismo procedimiento que en la educación recibida se castigaba como falta de mesura aparece aquí como expresión legítima y espontánea del afecto.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragDesenlace.id,
        type: "pregunta",
        questionGroup: "literal",
        ...anchor(desenlaceText, "Yo me llamo Don Carlos, no Don Félix. Don Diego es mi tío."),
        order: 1,
        content: `Según el papel que Don Diego lee en voz alta, ¿quién es realmente el oficial al que Doña Francisca conocía como «Don Félix de Toledo»?`,
      },
      {
        fragmentId: fragDesenlace.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        ...anchor(desenlaceText, "Yo pude separarlos para siempre y gozar tranquilamente la posesión de esta niña amable, pero mi conciencia no lo sufre"),
        order: 1,
        content: `Don Diego dice que «pudo separarlos para siempre y gozar tranquilamente la posesión» de Doña Francisca, pero que «su conciencia no lo sufre». ¿Qué revela esta frase sobre cómo entiende él, hasta este momento, su relación con Paquita, y por qué crees que decide cambiarla?`,
      },
      {
        fragmentId: fragDesenlace.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `Don Diego resume lo ocurrido diciendo que todo «resulta del abuso de autoridad, de la opresión que la juventud padece» por parte de «los padres y los tutores». ¿Te parece una explicación completa de lo sucedido en la obra, o crees que hay otras causas —por ejemplo, el propio engaño de Don Carlos— que también deberían tenerse en cuenta?`,
      },

      // Intertextualidad
      {
        fragmentId: fragDesenlace.id,
        type: "intertextualidad",
        ...anchor(desenlaceText, "el primer fruto de vuestro amor"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragEducacion.id,
        content: `Esta imagen —«el primer fruto de vuestro amor»— retoma, para darle la vuelta, la metáfora agrícola de «los frutos de la educación» con la que Don Diego diagnosticaba, unas horas antes, la desgracia de Paquita. Allí, «los frutos» eran el resultado amargo de una educación basada en el disimulo; aquí, «el fruto» es la promesa de algo que nace del amor sincero entre Carlos y Paquita, y que Don Diego, sin hijos propios, adopta como suyo. La misma palabra mide la distancia entre el diagnóstico y el desenlace de la obra.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // José de Espronceda — El estudiante de Salamanca
  // ---------------------------------------------------------------------
  console.log("Creando «El estudiante de Salamanca» de Espronceda...");

  const elEstudianteDeSalamanca = await prisma.work.create({
    data: {
      slug: "el-estudiante-de-salamanca",
      title: "El estudiante de Salamanca",
      year: 1840,
      era: "Romanticismo",
      genre: "Poema narrativo (leyenda en verso)",
      synopsis: `Extenso poema narrativo en cuatro partes y métrica variadísima, ambientado en la Salamanca universitaria. Don Félix de Montemar, «segundo don Juan Tenorio», ha seducido y abandonado a Elvira, que muere de dolor; esa misma noche mata en duelo a don Diego de Pastrana, hermano de Elvira, que había salido a vengarla. Mientras la ciudad duerme, Don Félix sigue por sus calles a una misteriosa dama enlutada hasta un palacio deshabitado, donde un cortejo de espectros —entre ellos los de Elvira y don Diego— le ofrece una macabra boda con la propia muerte. Fiel a su naturaleza hasta el final, Don Félix la acepta sin miedo ni arrepentimiento, y la noche entera, concentrada en un solo arco temporal, se cierra con su perdición.`,
      authorId: espronceda.id,
    },
  });

  const nocheText = `Era más de media noche,
antiguas historias cuentan,
cuando en sueño y en silencio
lóbrego envuelta la tierra,
los vivos muertos parecen,
los muertos la tumba dejan.

Era la hora en que acaso
temerosas voces suenan
informes, en que se escuchan
tácitas pisadas huecas,
y pavorosas fantasmas
entre las densas tinieblas
vagan, y aúllan los perros
amedrentados al verlas:
En que tal vez la campana
de alguna arruinada iglesia
da misteriosos sonidos
de maldición y anatema,
que los sábados convoca
a las brujas a su fiesta.

El cielo estaba sombrío,
no vislumbraba una estrella,
silbaba lúgubre el viento,
y allá en el aire, cual negras
fantasmas, se dibujaban
las torres de las iglesias,
y del gótico castillo
las altísimas almenas,
donde canta o reza acaso
temeroso el centinela.

Todo en fin a media noche
reposaba, y tumba era
de sus dormidos vivientes
la antigua ciudad que riega
el Tormes, fecundo río,
nombrado de los poetas,
la famosa Salamanca,
insigne en armas y letras,
patria de ilustres varones,
noble archivo de las ciencias.

Súbito rumor de espadas
cruje y un ¡ay! se escuchó;
un ay moribundo, un ay
que penetra el corazón,
que hasta los tuétanos hiela
y da al que lo oyó temblor.
Un ¡ay! de alguno que al mundo
pronuncia el último adiós.`;

  const fragNoche = await prisma.fragment.create({
    data: {
      slug: "el-estudiante-de-salamanca-noche",
      title: "Era más de media noche",
      location: "El estudiante de Salamanca, Parte primera",
      headline: "«Los vivos muertos parecen, los muertos la tumba dejan»",
      text: nocheText,
      order: 1,
      status: "published",
      featured: false,
      workId: elEstudianteDeSalamanca.id,
      constellations: { connect: [{ slug: "muerte" }, { slug: "fe" }] },
      places: { connect: [{ slug: "salamanca" }] },
      artworkImageUrl: "/images/artworks/friedrich-abadia-en-el-robledal.jpg",
      artworkTitle: "Abadía en el robledal (Abtei im Eichwald)",
      artworkAuthor: "Caspar David Friedrich, h. 1809-1810",
      artworkCaption:
        "Entre robles desnudos y sin hojas, las ruinas góticas de una iglesia se recortan contra un cielo crepuscular mientras una procesión funeral avanza hacia ellas. Friedrich pintó esta «abadía en el robledal» como una meditación sobre la muerte y lo sagrado en ruinas: el mismo paisaje nocturno de torres que «cual negras fantasmas» se dibujan en el aire y campanas que «convocan a las brujas» con el que Espronceda abre su poema.",
    },
  });

  const retratoText = `Segundo don Juan Tenorio,
alma fiera e insolente,
irreligioso y valiente,
altanero y reñidor:
Siempre el insulto en los ojos,
en los labios la ironía,
nada teme y toda fía
de su espada y su valor.

Corazón gastado, mofa
de la mujer que corteja,
y, hoy despreciándola, deja
la que ayer se le rindió.
Ni el porvenir temió nunca,
ni recuerda en lo pasado
la mujer que ha abandonado,
ni el dinero que perdió.

Ni vio el fantasma entre sueños
del que mató en desafío,
ni turbó jamás su brío
recelosa previsión.
Siempre en lances y en amores,
siempre en báquicas orgías,
mezcla en palabras impías
un chiste y una maldición.

En Salamanca famoso
por su vida y buen talante,
al atrevido estudiante
le señalan entre mil;
fuero le da su osadía,
le disculpa su riqueza,
su generosa nobleza,
su hermosura varonil.

Que en su arrogancia y sus vicios,
caballeresca apostura,
agilidad y bravura
ninguno alcanza a igualar:
Que hasta en sus crímenes mismos,
en su impiedad y altiveza,
pone un sello de grandeza
don Félix de Montemar.

Bella y más segura que el azul del cielo
con dulces ojos lánguidos y hermosos,
donde acaso el amor brilló entre el velo
del pudor que los cubre candorosos;
tímida estrella que refleja al suelo
rayos de luz brillantes y dudosos,
ángel puro de amor que amor inspira,
fue la inocente y desdichada Elvira.`;

  const fragRetrato = await prisma.fragment.create({
    data: {
      slug: "el-estudiante-de-salamanca-retrato",
      title: "Segundo don Juan Tenorio",
      location: "El estudiante de Salamanca, Parte primera",
      headline: "«Pone un sello de grandeza, don Félix de Montemar»",
      text: retratoText,
      order: 2,
      status: "published",
      featured: false,
      workId: elEstudianteDeSalamanca.id,
      constellations: { connect: [{ slug: "honor-y-valor" }, { slug: "amor" }, { slug: "critica-social" }] },
      characters: { connect: [{ slug: "don-felix-de-montemar" }, { slug: "elvira-de-pastrana" }] },
      places: { connect: [{ slug: "salamanca" }] },
      artworkImageUrl: "/images/artworks/byron-traje-albanes.jpg",
      artworkTitle: "Lord Byron con traje albanés",
      artworkAuthor: "Thomas Phillips, 1813",
      artworkCaption:
        "Byron se hizo retratar con traje albanés a su regreso de un viaje por los Balcanes: la pose orgullosa, la mano en la cintura y la mirada desafiante construyen la imagen del dandi rebelde, bello y peligroso, que el propio Byron encarnó en vida y en sus poemas. Es el modelo —el «héroe byroniano»— sobre el que Espronceda recorta a su «segundo don Juan Tenorio».",
    },
  });

  const desenlaceEstudianteText = `Y de pronto en horrendo estampido
desquiciarse la estancia sintió,
y al tremendo tartáreo rüido
cien espectros alzarse miró:
de sus ojos los huecos fijaron
y sus dedos enjutos en él;
y después entre sí se miraron,
y a mostrarle tornaron después;
y enlazadas las manos siniestras,
con dudoso, espantado ademán
contemplando, y tendidas sus diestras
con asombro al osado mortal,
se acercaron despacio y la seca
calavera, mostrando temor,
con inmóvil, irónica mueca
inclinaron, formando enredor.

Y entonces la visión del blanco velo
al fiero Montemar tendió una mano,
y era su tacto de crispante hielo,
y resistirlo audaz intentó en vano:
galvánica, cruel, nerviosa y fría,
histérica y horrible sensación,
toda la sangre coagulada envía
agolpada y helada al corazón...

Y a su despecho y maldiciendo al cielo,
de ella apartó su mano Montemar,
y temerario alzándola a su velo,
tirando de él la descubrió la faz.

¡Es su esposo!, los ecos retumbaron,
¡La esposa al fin que su consorte halló!
Los espectros con júbilo gritaron:
¡Es el esposo de su eterno amor!

Y ella entonces gritó: ¡Mi esposo! Y era
(¡desengaño fatal!, ¡triste verdad!)
una sórdida, horrible calavera,
la blanca dama del gallardo andar...

Luego un caballero de espuela dorada,
airoso, aunque el rostro con mortal color,
traspasado el pecho de fiera estocada,
aún brotando sangre de su corazón,
se acerca y le dice, su diestra tendida,
que impávido estrecha también Montemar:
-Al fin la palabra que disteis, cumplida;
doña Elvira, vedla, vuestra esposa es ya.

-Mi muerte os perdono. Por cierto, don Diego,
repuso don Félix tranquilo a su vez,
me alegro de veros con tanto sosiego,
que a fe no esperaba volveros a ver.
En cuanto a ese espectro que decís mi esposa,
raro casamiento venísme a ofrecer:
su faz no es por cierto ni amable ni hermosa,
mas no se os figure que os quiera ofender.
Por mujer la tomo, porque es cosa cierta,
y espero no salga fallido mi plan,
que en caso tan raro y mi esposa muerta,
tanto como viva no me cansará.
Mas antes decidme si Dios o el demonio
me trajo a este sitio, que quisiera ver
al uno o al otro, y en mi matrimonio
tener por padrino siquiera a Luzbel:
Cualquiera o entrambos con su corte toda,
estando estos nobles espectros aquí,
no perdiera mucho viniendo a mi boda...
Hermano don Diego, ¿no pensáis así?

Tal dijo don Félix con fruncido ceño,
en torno arrojando con fiero ademán
miradas audaces de altivo desdeño,
al Dios por quien jura capaz de arrostrar.

[...]

Y si, lector, dijerdes ser comento,
como me lo contaron, te lo cuento.`;

  const fragDesenlaceEstudiante = await prisma.fragment.create({
    data: {
      slug: "el-estudiante-de-salamanca-desenlace",
      title: "La boda con la muerte",
      location: "El estudiante de Salamanca, Parte cuarta",
      headline: "«¡Es el esposo de su eterno amor!»",
      text: desenlaceEstudianteText,
      order: 3,
      status: "published",
      featured: false,
      workId: elEstudianteDeSalamanca.id,
      constellations: { connect: [{ slug: "muerte" }, { slug: "amor" }, { slug: "fe" }] },
      characters: {
        connect: [
          { slug: "don-felix-de-montemar" },
          { slug: "elvira-de-pastrana" },
          { slug: "don-diego-de-pastrana" },
        ],
      },
      places: { connect: [{ slug: "salamanca" }] },
      artworkImageUrl: "/images/artworks/chaise-dieu-danza-macabra.jpg",
      artworkTitle: "La danza macabra de la abadía de La Chaise-Dieu",
      artworkAuthor: "Anónimo, fresco del siglo XV",
      artworkCaption:
        "En este fresco gótico, esqueletos amortajados toman de la mano y arrastran a su danza a hombres y mujeres de toda condición —aquí, un joven elegantemente vestido—, sin que nadie pueda negarse. La «danza macabra» medieval, que recordaba a los vivos que la muerte llega para todos por igual, anticipa en imágenes la «aérea fantástica danza» de los «cien espectros» que arrastran a Don Félix de Montemar en el desenlace del poema.",
    },
  });

  // ---------------------------------------------------------------------
  // Anotaciones — El estudiante de Salamanca (Espronceda)
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «El estudiante de Salamanca»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas — Era más de media noche
      {
        fragmentId: fragNoche.id,
        type: "glosa",
        ...anchor(nocheText, "lóbrego"),
        order: 1,
        content: `«Lóbrego» significa oscuro, tenebroso, cargado de tristeza: un adjetivo predilecto del vocabulario romántico, que aquí se aplica a la tierra entera envuelta en la noche, dando el tono de todo el poema desde su segunda estrofa.`,
      },
      {
        fragmentId: fragNoche.id,
        type: "glosa",
        ...anchor(nocheText, "anatema"),
        order: 2,
        content: `«Anatema» es la fórmula de excomunión o maldición solemne pronunciada por la Iglesia. Que sea precisamente la campana de «alguna arruinada iglesia» la que emite estos «sonidos de maldición y anatema» invierte su función habitual: en vez de convocar a los fieles, convoca a las brujas.`,
      },
      {
        fragmentId: fragNoche.id,
        type: "glosa",
        ...anchor(nocheText, "almenas"),
        order: 3,
        content: `Las «almenas» son los remates en forma de prisma que coronan los muros de un castillo o fortaleza, característicos de la arquitectura militar medieval. Junto a las «torres de las iglesias», dibujan en la noche la silueta gótica que el Romanticismo prefería a la armonía clásica de columnas y frontones.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragNoche.id,
        type: "contexto",
        ...anchor(nocheText, "la famosa Salamanca,\ninsigne en armas y letras"),
        order: 1,
        content: `Salamanca, sede de una de las universidades más antiguas de Europa (1218), era en la literatura española sinónimo de vida estudiantil, ingenio y picardía —el escenario, por ejemplo, del Lazarillo de Tormes—. Espronceda invoca esa fama diurna, «insigne en armas y letras», justo para mostrar cómo a «media noche» la misma ciudad se transforma en un escenario completamente distinto: el de los fantasmas, las brujas y los duelos.`,
      },
      {
        fragmentId: fragNoche.id,
        type: "contexto",
        ...anchor(nocheText, "a las brujas a su fiesta"),
        order: 2,
        content: `El «aquelarre» o aforo de brujas en sábado era una creencia popular muy arraigada en la España de los siglos XVIII y XIX, que Goya retrató en pinturas como *El aforo* o *Vuelo de brujas*. Mientras que los ilustrados —como Cadalso o Moratín— tendían a presentar estas creencias como supersticiones propias de una educación deficiente, el Romanticismo las recupera como material literario legítimo: no para creer en ellas, sino para construir con ellas la atmósfera de lo sobrenatural.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragNoche.id,
        type: "figura",
        category: "tropo",
        ...anchor(nocheText, "los vivos muertos parecen,\nlos muertos la tumba dejan"),
        order: 1,
        content: `**Quiasmo y antítesis**: los términos «vivos» y «muertos» se cruzan e invierten entre los dos versos —los vivos parecen muertos, los muertos abandonan la tumba—, borrando desde el principio del poema la frontera entre ambos estados. Este verso, uno de los más citados de la poesía romántica española, anuncia ya el desenlace sobrenatural de la obra.`,
      },
      {
        fragmentId: fragNoche.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(nocheText, "un ay moribundo, un ay\nque penetra el corazón,\nque hasta los tuétanos hiela\ny da al que lo oyó temblor."),
        order: 2,
        content: `**Anáfora y políptoton**: la palabra «ay» se repite tres veces en pocos versos, y la conjunción «que» encadena después dos subordinadas («que penetra... que hasta los tuétanos hiela...») en una misma estructura insistente. El propio sonido del lamento queda así inscrito en el ritmo del verso.`,
      },
      {
        fragmentId: fragNoche.id,
        type: "figura",
        category: "sonoro",
        ...anchor(nocheText, "silbaba lúgubre el viento"),
        order: 3,
        content: `**Aliteración onomatopéyica**: la repetición de los sonidos sibilantes de «silbaba» y «lúgubre» reproduce acústicamente el silbido del viento que el verso describe, un recurso muy del gusto romántico para hacer que la forma del verso «suene» como su contenido.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragNoche.id,
        type: "pregunta",
        questionGroup: "literal",
        ...anchor(nocheText, "la famosa Salamanca"),
        order: 1,
        content: `¿Qué ciudad describe el poema como una «tumba... de sus dormidos vivientes» a esta hora de la noche?`,
      },
      {
        fragmentId: fragNoche.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        ...anchor(nocheText, "los vivos muertos parecen,\nlos muertos la tumba dejan"),
        order: 1,
        content: `El poema empieza con un verso que confunde deliberadamente a los vivos con los muertos. Teniendo en cuenta cómo termina la historia de Don Félix de Montemar, ¿qué función cumple esta imagen al abrir el relato?`,
      },
      {
        fragmentId: fragNoche.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `Espronceda dedica cincuenta versos a describir la noche y la ciudad antes de que ocurra ninguna acción. ¿Te parece un comienzo eficaz, o crees que un relato actual debería entrar antes en la acción? Razona tu respuesta.`,
      },

      // Intertextualidad
      {
        fragmentId: fragNoche.id,
        type: "intertextualidad",
        ...anchor(nocheText, "a las brujas a su fiesta"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragDesenlaceEstudiante.id,
        content: `Esta convocatoria nocturna de «las brujas a su fiesta» anuncia, ya en los primeros versos del poema, la otra reunión sobrenatural que cerrará la historia: el cortejo de «cien espectros» que rodea a Don Félix de Montemar en el desenlace. El poema enmarca así toda la acción de una sola noche entre dos convocatorias del más allá: la que se anuncia al principio y la que se cumple al final.`,
      },

      // Glosas — Segundo don Juan Tenorio
      {
        fragmentId: fragRetrato.id,
        type: "glosa",
        ...anchor(retratoText, "báquicas orgías"),
        order: 1,
        content: `«Báquico» remite a Baco, dios romano del vino: una «orgía báquica» es una fiesta de bebida y desenfreno. La expresión resume, en dos palabras, el tipo de vida nocturna —juego, vino, duelos, mujeres— que define a Don Félix de Montemar.`,
      },
      {
        fragmentId: fragRetrato.id,
        type: "glosa",
        ...anchor(retratoText, "fuero"),
        order: 2,
        content: `Un «fuero» es, en sentido propio, un privilegio o exención legal otorgado a una persona o un grupo. Aquí el término se usa en sentido figurado: la propia «osadía» de Don Félix actúa como un fuero, una especie de licencia social que le permite hacer lo que a otros les sería reprochado.`,
      },
      {
        fragmentId: fragRetrato.id,
        type: "glosa",
        ...anchor(retratoText, "candorosos"),
        order: 3,
        content: `«Candoroso», de «candor» (pureza, inocencia), describe los ojos de Elvira como ingenuos y sin malicia. El adjetivo prepara por contraste la tragedia que sigue: esa misma inocencia será lo que el «fingido amador» —Don Félix— explote y destruya.`,
      },

      // Contextualización histórica
      {
        fragmentId: fragRetrato.id,
        type: "contexto",
        ...anchor(retratoText, "Segundo don Juan Tenorio"),
        order: 1,
        content: `Don Juan es uno de los mitos literarios españoles más fecundos, creado por Tirso de Molina en *El burlador de Sevilla* (h. 1630): el seductor que desafía a la sociedad, a las mujeres y a Dios mismo, y que recibe al final un castigo sobrenatural. Espronceda llama a Don Félix «segundo don Juan Tenorio» cuatro años antes de que José Zorrilla popularizara definitivamente ese mismo título para su propio Don Juan en 1844: ambos poetas heredan y reescriben, cada uno a su manera, el mismo mito.`,
      },
      {
        fragmentId: fragRetrato.id,
        type: "contexto",
        ...anchor(retratoText, "fuero le da su osadía,\nle disculpa su riqueza,\nsu generosa nobleza"),
        order: 2,
        content: `Estos versos señalan, sin necesidad de un tratado, una realidad social muy concreta de la España del XIX: la riqueza y el linaje de un joven noble le garantizaban una impunidad de hecho ante abusos, deudas de juego o duelos que a cualquier otro le habrían costado la cárcel o el deshonor. Esa misma «crítica social» a los privilegios de cuna será, pocos años después, uno de los blancos favoritos de los artículos de Mariano José de Larra.`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragRetrato.id,
        type: "figura",
        category: "tropo",
        ...anchor(retratoText, "Corazón gastado"),
        order: 1,
        content: `**Metáfora**: el corazón de Don Félix se describe como un objeto «gastado», desgastado por el uso, igual que una moneda o una herramienta que ha perdido su filo. La imagen convierte el cinismo sentimental del personaje en un desgaste material, casi mecánico.`,
      },
      {
        fragmentId: fragRetrato.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(retratoText, "Siempre el insulto en los ojos,\nen los labios la ironía,\nnada teme y toda fía"),
        order: 2,
        content: `**Anáfora**: el adverbio «siempre» encabeza este verso y reaparece después, idéntico, al comienzo de «siempre en lances y en amores, / siempre en báquicas orgías». La repetición convierte el retrato en un catálogo de costumbres invariables, un carácter ya fijado para siempre antes de que la acción empiece.`,
      },
      {
        fragmentId: fragRetrato.id,
        type: "figura",
        category: "topos",
        ...anchor(retratoText, "pone un sello de grandeza\ndon Félix de Montemar"),
        order: 3,
        content: `**El héroe romántico (oxímoron de grandeza y crimen)**: el retrato concluye haciendo coincidir «sus crímenes», «su impiedad» y «su altiveza» con un «sello de grandeza». Esta fusión de lo execrable y lo admirable —imposible para el ideal neoclásico de virtud razonable que encarnaba, por ejemplo, el Don Diego de Moratín— es precisamente lo que define al héroe romántico: grande no a pesar de sus vicios, sino a través de ellos.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragRetrato.id,
        type: "pregunta",
        questionGroup: "literal",
        ...anchor(retratoText, "fuero le da su osadía"),
        order: 1,
        content: `Según el retrato, ¿qué tres cosas —además de su propia osadía— hacen que la sociedad de Salamanca «disculpe» a Don Félix sus vicios?`,
      },
      {
        fragmentId: fragRetrato.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        ...anchor(retratoText, "pone un sello de grandeza\ndon Félix de Montemar"),
        order: 1,
        content: `El narrador afirma que hasta en sus crímenes Don Félix pone «un sello de grandeza». ¿Es esto un elogio, una condena o ambas cosas a la vez? ¿Cómo se relaciona esta ambigüedad con el destino que le espera al final del poema?`,
      },
      {
        fragmentId: fragRetrato.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `Personajes seductores, cínicos y sin remordimientos como Don Félix de Montemar siguen siendo habituales en el cine y las series actuales. ¿Por qué crees que este tipo de personaje resulta atractivo para el público, a pesar de —o quizá gracias a— su falta de escrúpulos?`,
      },

      // Intertextualidad
      {
        fragmentId: fragRetrato.id,
        type: "intertextualidad",
        ...anchor(retratoText, "alma fiera e insolente"),
        order: 1,
        linkType: "external",
        externalCitation: `Thomas Phillips, retrato de Lord Byron con traje albanés (1813); Lord Byron, Childe Harold's Pilgrimage (1812-1818).`,
        content: `El «héroe byroniano» —orgulloso, atractivo, transgresor y marcado por un pasado oscuro que nunca explica del todo— fue uno de los modelos literarios más influyentes del Romanticismo europeo. Espronceda, que vivió varios años exiliado en Londres, conocía bien la obra de Byron: su Don Félix de Montemar, «alma fiera e insolente», es una versión española y descaradamente española de ese mismo tipo.`,
      },

      // Glosas — La boda con la muerte
      {
        fragmentId: fragDesenlaceEstudiante.id,
        type: "glosa",
        ...anchor(desenlaceEstudianteText, "tartáreo"),
        order: 1,
        content: `«Tartáreo» es un cultismo derivado del Tártaro, la región más profunda del inframundo en la mitología grecolatina: equivale a «infernal». El «tartáreo rüido» que sacude la estancia es, literalmente, un estruendo del otro mundo.`,
      },
      {
        fragmentId: fragDesenlaceEstudiante.id,
        type: "glosa",
        ...anchor(desenlaceEstudianteText, "Luzbel"),
        order: 2,
        content: `«Luzbel» (de «Lucifer», portador de luz) es otro nombre del diablo. Que Don Félix proponga, en tono de chanza, tenerlo «por padrino» de su boda con la muerte muestra hasta qué punto su desafío a lo sagrado no cede ni en el momento de su propia perdición.`,
      },
      {
        fragmentId: fragDesenlaceEstudiante.id,
        type: "glosa",
        ...anchor(desenlaceEstudianteText, "comento"),
        order: 3,
        content: `«Comento», forma antigua emparentada con «cuento» y «comentario», significa aquí «invención, relato fabuloso». El narrador cierra el poema admitiendo que el lector puede tomar todo lo contado por pura fantasía: «como me lo contaron, te lo cuento».`,
      },

      // Contextualización histórica
      {
        fragmentId: fragDesenlaceEstudiante.id,
        type: "contexto",
        ...anchor(desenlaceEstudianteText, "cien espectros alzarse miró"),
        order: 1,
        content: `La irrupción masiva de «cien espectros» en una estancia cerrada pertenece al repertorio de la novela y la poesía gótica europea (Walpole, Radcliffe, los primeros relatos de E. T. A. Hoffmann), que el Romanticismo español incorpora como reacción frente al racionalismo ilustrado. Donde un Cadalso o un Moratín habrían explicado estos fenómenos como supersticiones o engaños, Espronceda los presenta sin ironía explicativa, como una realidad última que se impone al protagonista.`,
      },
      {
        fragmentId: fragDesenlaceEstudiante.id,
        type: "contexto",
        ...anchor(desenlaceEstudianteText, "Y si, lector, dijerdes ser comento,\ncomo me lo contaron, te lo cuento."),
        order: 2,
        content: `Este dístico final practica lo que la crítica llama «ironía romántica»: tras el clímax más solemne y terrorífico del poema, el narrador se dirige de pronto al «lector» y le da permiso para no creer nada de lo que ha contado. Es el mismo gesto de distanciamiento que Byron cultiva en *Don Juan*, y que Espronceda traslada aquí al desenlace de su propio «segundo don Juan Tenorio».`,
      },

      // Figuras y tópicos
      {
        fragmentId: fragDesenlaceEstudiante.id,
        type: "figura",
        category: "tropo",
        ...anchor(desenlaceEstudianteText, "una sórdida, horrible calavera,\nla blanca dama del gallardo andar"),
        order: 1,
        content: `**Símbolo (vanitas)**: la elegante «blanca dama del gallardo andar» que Don Félix ha seguido toda la noche se revela como «una sórdida, horrible calavera». La imagen recoge el tópico barroco de la *vanitas* —la belleza que oculta la muerte— y lo lleva a su extremo más literal: bajo el velo no hay otra mujer, sino la Muerte misma.`,
      },
      {
        fragmentId: fragDesenlaceEstudiante.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(desenlaceEstudianteText, "¡Es su esposo!, los ecos retumbaron,\n¡La esposa al fin que su consorte halló!\nLos espectros con júbilo gritaron:\n¡Es el esposo de su eterno amor!"),
        order: 2,
        content: `**Paralelismo y exclamación retórica**: las cuatro exclamaciones se reparten en dos parejas paralelas —lo que «retumban los ecos» y lo que «gritan los espectros»—, como un coro que repite y amplifica la misma noticia. La boda de Don Félix se proclama así con la solemnidad coral de una ceremonia.`,
      },
      {
        fragmentId: fragDesenlaceEstudiante.id,
        type: "figura",
        category: "sonoro",
        ...anchor(desenlaceEstudianteText, "Y de pronto en horrendo estampido\ndesquiciarse la estancia sintió,\ny al tremendo tartáreo rüido"),
        order: 3,
        content: `**Aliteración**: la abundancia de oclusivas y vibrantes —«horrendo estampido», «desquiciarse», «tremendo tartáreo rüido»— recarga estos versos de un sonido áspero y violento, que imita en la propia textura de las palabras el «estampido» y el «ruido» que describen.`,
      },

      // Preguntas de comentario
      {
        fragmentId: fragDesenlaceEstudiante.id,
        type: "pregunta",
        questionGroup: "literal",
        ...anchor(desenlaceEstudianteText, "la blanca dama del gallardo andar"),
        order: 1,
        content: `Cuando Don Félix le quita el velo a la «blanca dama» que ha seguido toda la noche, ¿qué encuentra debajo?`,
      },
      {
        fragmentId: fragDesenlaceEstudiante.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        ...anchor(desenlaceEstudianteText, "Mi muerte os perdono"),
        order: 1,
        content: `Frente al espectro de don Diego, a quien él mismo mató, y ante su propia boda con un esqueleto, Don Félix responde con sarcasmo y aplomo, no con miedo. ¿Qué tipo de «castigo» supone esto para un personaje que, como vimos, «nada teme»? ¿Es esta actitud su perdición o, en cierto modo, su triunfo final?`,
      },
      {
        fragmentId: fragDesenlaceEstudiante.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `Tras describir con todo detalle la danza de los espectros y la muerte de Don Félix, el poema termina diciéndole al lector que, si quiere, puede considerarlo todo un «comento» (una invención). ¿Esta broma final refuerza o debilita, en tu opinión, el sentido de justicia poética que parece tener el desenlace?`,
      },

      // Intertextualidad
      {
        fragmentId: fragDesenlaceEstudiante.id,
        type: "intertextualidad",
        ...anchor(desenlaceEstudianteText, "Tal dijo don Félix con fruncido ceño,\nen torno arrojando con fiero ademán\nmiradas audaces de altivo desdeño"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragRetrato.id,
        content: `Este último gesto de Don Félix —el «fruncido ceño», las «miradas audaces de altivo desdeño», el desafío lanzado al propio Dios— repite, casi palabra por palabra, los rasgos con los que el poema lo había presentado al principio: «alma fiera e insolente... siempre el insulto en los ojos... nada teme». Don Félix no cambia ni se arrepiente ni siquiera ante la muerte: muere exactamente como vivió.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Gustavo Adolfo Bécquer — nuevas Rimas
  // ---------------------------------------------------------------------
  console.log("Creando nuevas Rimas de Bécquer...");

  const rimaIText = `Yo sé un himno gigante y extraño
que anuncia en la noche del alma una aurora,
y estas páginas son de ese himno
cadencias que el aire dilata en las sombras.

Yo quisiera escribirlo, del hombre
domando el rebelde, mezquino idioma,
con palabras que fuesen a un tiempo
suspiros y risas, colores y notas.

Pero en vano es luchar; que no hay cifra
capaz de encerrarlo, y apenas, ¡oh hermosa!,
si, teniendo en mis manos las tuyas,
pudiera, al oído, cantártelo a solas.`;

  const fragRimaI = await prisma.fragment.create({
    data: {
      slug: "rima-i",
      title: "Rima I",
      location: "Rimas, I",
      headline: "«Yo sé un himno gigante y extraño»",
      text: rimaIText,
      order: 1,
      status: "published",
      featured: false,
      workId: rimas.id,
      constellations: { connect: [{ slug: "amor" }] },
      places: { connect: [{ slug: "sevilla" }] },
      artworkImageUrl: "/images/artworks/turner-norham-castle.jpg",
      artworkTitle: "Norham Castle, amanecer (Norham Castle, Sunrise)",
      artworkAuthor: "J. M. W. Turner, h. 1845",
      artworkCaption:
        "Las formas del castillo, el río y el ganado apenas se distinguen, disueltas en la luz dorada del amanecer: Turner lleva la pintura al límite de lo reconocible, igual que Bécquer lleva el lenguaje al límite de lo expresable al describir un «himno gigante y extraño» que «anuncia... una aurora» y que ningún idioma humano basta para encerrar.",
    },
  });

  const rimaXIText = `—Yo soy ardiente, yo soy morena,
yo soy el símbolo de la pasión,
de ansia de goces mi alma está llena.
¿A mí me buscas? —No es a ti, no.

—Mi frente es pálida, mis trenzas de oro,
puedo brindarte dichas sin fin,
yo de ternura guardo un tesoro.
¿A mí me llamas? —No, no es a ti.

—Yo soy un sueño, un imposible,
vano fantasma de niebla y luz;
soy incorpórea, soy intangible:
no puedo amarte. —¡Oh, ven; ven tú!`;

  const fragRimaXI = await prisma.fragment.create({
    data: {
      slug: "rima-xi",
      title: "Rima XI",
      location: "Rimas, XI",
      headline: "«¡Oh, ven; ven tú!»",
      text: rimaXIText,
      order: 2,
      status: "published",
      featured: false,
      workId: rimas.id,
      constellations: { connect: [{ slug: "amor" }] },
      topics: { connect: [{ slug: "amor-cortes" }] },
      places: { connect: [{ slug: "sevilla" }] },
      artworkImageUrl: "/images/artworks/friedrich-mujer-sol.jpg",
      artworkTitle: "Mujer ante el sol poniente (Frau vor der untergehenden Sonne)",
      artworkAuthor: "Caspar David Friedrich, h. 1818",
      artworkCaption:
        "Una mujer sola, de espaldas, tiende los brazos hacia un horizonte disuelto en niebla y luz dorada: la misma materia —«niebla y luz»— con la que Bécquer construye, al final de esta rima, a la única de las tres mujeres que el yo poético elige seguir, precisamente porque es inalcanzable.",
    },
  });

  const rimaLIIText = `Olas gigantes que os rompéis bramando
en las playas desiertas y remotas,
envuelto entre la sábana de espumas,
¡llevadme con vosotras!

Ráfagas de huracán que arrebatáis
del alto bosque las marchitas hojas,
arrastrado en el ciego torbellino,
¡llevadme con vosotras!

Nubes de tempestad que rompe el rayo
y en fuego ornáis las desprendidas orlas,
arrebatado entre la niebla oscura,
¡llevadme con vosotras!

Llevadme, por piedad, adonde el vértigo
con la razón me arranque la memoria.
¡Por piedad! ¡Tengo miedo de quedarme
con mi dolor a solas!`;

  const fragRimaLII = await prisma.fragment.create({
    data: {
      slug: "rima-lii",
      title: "Rima LII",
      location: "Rimas, LII",
      headline: "«¡Llevadme con vosotras!»",
      text: rimaLIIText,
      order: 3,
      status: "published",
      featured: false,
      workId: rimas.id,
      constellations: { connect: [{ slug: "muerte" }, { slug: "amor" }] },
      topics: { connect: [{ slug: "desengano" }] },
      places: { connect: [{ slug: "sevilla" }] },
      artworkImageUrl: "/images/artworks/aivazovsky-novena-ola.jpg",
      artworkTitle: "La novena ola (The Ninth Wave)",
      artworkAuthor: "Iván Aivazovski, 1850",
      artworkCaption:
        "Unos náufragos se aferran a los restos de un mástil ante olas descomunales que rompen bramando bajo un cielo encendido por el amanecer: la misma fuerza arrolladora —«olas gigantes», «ráfagas de huracán», «nubes de tempestad»— a la que el yo poético de esta rima suplica, una y otra vez, que se lo lleve.",
    },
  });

  // ---------------------------------------------------------------------
  // Anotaciones — nuevas Rimas (Bécquer)
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de las nuevas Rimas...");

  await prisma.annotation.createMany({
    data: [
      // Glosas — Rima I
      {
        fragmentId: fragRimaI.id,
        type: "glosa",
        ...anchor(rimaIText, "no hay cifra"),
        order: 1,
        content: `«Cifra» significa aquí fórmula, clave o compendio capaz de resumir y contener algo. El poeta afirma que no existe ningún sistema de signos —ni siquiera el lenguaje— capaz de «encerrar» el himno que dice conocer.`,
      },
      {
        fragmentId: fragRimaI.id,
        type: "glosa",
        ...anchor(rimaIText, "el aire dilata en las sombras"),
        order: 2,
        content: `«Dilatar» es extender, expandir algo más allá de sus límites. Las «cadencias» del himno se propagan, como ondas sonoras, en la oscuridad: una imagen casi física de la poesía como vibración que se difunde en el silencio.`,
      },
      {
        fragmentId: fragRimaI.id,
        type: "glosa",
        ...anchor(rimaIText, "rebelde, mezquino idioma"),
        order: 3,
        content: `«Mezquino» es pobre, escaso, insuficiente. El poeta llama así al lenguaje humano —«rebelde» porque no se doblega a su voluntad— frente a la grandeza de lo que querría expresar.`,
      },

      // Contextualización histórica — Rima I
      {
        fragmentId: fragRimaI.id,
        type: "contexto",
        ...anchor(rimaIText, "Yo sé un himno gigante y extraño"),
        order: 1,
        content: `En muchas ediciones de las *Rimas*, este poema abre la colección: antes de cualquier poema de amor, Bécquer plantea una declaración de poética —una reflexión sobre los límites del lenguaje y la imposibilidad de capturar por completo la experiencia interior—, en sintonía con la estética romántica de lo sublime e inefable.`,
      },
      {
        fragmentId: fragRimaI.id,
        type: "contexto",
        ...anchor(rimaIText, "la noche del alma"),
        order: 2,
        content: `La expresión «noche del alma» recoge, de forma secularizada, el vocabulario de la mística española del Siglo de Oro —piénsese en la «noche oscura» de San Juan de la Cruz—. Donde el místico atravesaba esa noche para unirse a Dios, el poeta romántico la atraviesa para alcanzar la poesía y el amor humano: el mismo lenguaje de la experiencia límite se pone al servicio de una experiencia ya no religiosa, sino estética y amorosa.`,
      },

      // Figuras y tópicos — Rima I
      {
        fragmentId: fragRimaI.id,
        type: "figura",
        category: "tropo",
        ...anchor(rimaIText, "la noche del alma"),
        order: 1,
        content: `**Metáfora**: la «noche» figura un territorio interior, oscuro e incierto, del que surge el «himno» como una «aurora». Desde el primer verso, la poesía se presenta como una luz que nace de la propia oscuridad del poeta.`,
      },
      {
        fragmentId: fragRimaI.id,
        type: "figura",
        category: "tropo",
        ...anchor(rimaIText, "suspiros y risas, colores y notas"),
        order: 2,
        content: `**Sinestesia**: la enumeración mezcla sensaciones de distinto orden —sonido («suspiros», «notas»), emoción («risas»), vista («colores»)— en una sola serie, sugiriendo un lenguaje «total» capaz de fundir todos los sentidos: precisamente el lenguaje que el poeta confiesa no poder alcanzar.`,
      },
      {
        fragmentId: fragRimaI.id,
        type: "figura",
        category: "sonoro",
        ...anchor(rimaIText, "cadencias que el aire dilata en las sombras"),
        order: 3,
        content: `**Aliteración**: la abundancia de consonantes líquidas y sibilantes (d, l, s) da al verso una textura suave y prolongada, que imita en su propio sonido la idea de algo que se expande y se desvanece en el silencio.`,
      },

      // Preguntas de comentario — Rima I
      {
        fragmentId: fragRimaI.id,
        type: "pregunta",
        questionGroup: "literal",
        ...anchor(rimaIText, "Yo quisiera escribirlo"),
        order: 1,
        content: `¿Qué le impide al poeta escribir el «himno gigante y extraño» que dice conocer?`,
      },
      {
        fragmentId: fragRimaI.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        ...anchor(rimaIText, "pudiera, al oído, cantártelo a solas"),
        order: 1,
        content: `El poema termina sugiriendo que, si algo de ese himno pudiera transmitirse, sería solo «al oído» y «a solas» a la persona amada. ¿Por qué crees que la poesía más profunda, según este poema, no puede compartirse con todo el mundo del mismo modo?`,
      },
      {
        fragmentId: fragRimaI.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `¿Te parece que el arte (la poesía, la música, la pintura...) puede realmente «encerrar» experiencias profundas, o crees, como Bécquer, que siempre queda algo inexpresable? Pon un ejemplo de tu experiencia.`,
      },

      // Intertextualidad — Rima I
      {
        fragmentId: fragRimaI.id,
        type: "intertextualidad",
        ...anchor(rimaIText, "la noche del alma"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragNocheOscura.id,
        content: `La «noche del alma» de Bécquer remite directamente a la «noche oscura» de San Juan de la Cruz. Bécquer hereda esa imagen de la tradición mística, pero la traslada a un terreno secular: ya no describe el camino del alma hacia Dios, sino el tránsito interior del poeta hacia la propia creación y hacia el amor.`,
      },

      // Glosas — Rima XI
      {
        fragmentId: fragRimaXI.id,
        type: "glosa",
        ...anchor(rimaXIText, "de ansia de goces mi alma está llena"),
        order: 1,
        content: `«Ansia de goces» es un deseo intenso de placeres y disfrute. Esta primera voz se define por completo a partir del deseo físico y la pasión, frente a las otras dos figuras del poema.`,
      },
      {
        fragmentId: fragRimaXI.id,
        type: "glosa",
        ...anchor(rimaXIText, "mis trenzas de oro"),
        order: 2,
        content: `Las «trenzas» son mechones de cabello entrelazados. El cabello «de oro» asocia a esta segunda mujer con una belleza dulce y luminosa, distinta de la pasión «morena» de la primera.`,
      },
      {
        fragmentId: fragRimaXI.id,
        type: "glosa",
        ...anchor(rimaXIText, "soy incorpórea, soy intangible"),
        order: 3,
        content: `«Incorpórea» significa sin cuerpo; «intangible», que no puede tocarse. Esta tercera figura no es una mujer real, sino una idea o un sueño: por eso mismo no puede «amar» con un cuerpo que no tiene.`,
      },

      // Contextualización histórica — Rima XI
      {
        fragmentId: fragRimaXI.id,
        type: "contexto",
        ...anchor(rimaXIText, "—Yo soy ardiente, yo soy morena"),
        order: 1,
        content: `Bécquer conoció, probablemente a través de traducciones francesas, la poesía de Heinrich Heine, célebre por sus breves composiciones líricas de tono íntimo e irónico. Los amigos que reconstruyeron las *Rimas* tras su muerte llamaron al manuscrito «Libro de los gorriones», en eco del «Libro de las canciones» (*Buch der Lieder*) de Heine: la influencia de esa poesía breve, despojada y de gran intensidad emocional es perceptible en composiciones como esta.`,
      },
      {
        fragmentId: fragRimaXI.id,
        type: "contexto",
        ...anchor(rimaXIText, "Yo soy un sueño, un imposible"),
        order: 2,
        content: `El ideal de un amor inalcanzable porque no pertenece al mundo material retoma, de forma secular, la figura de la dama idealizada de la lírica cortés y petrarquista —pero llevada a un extremo: ya no se trata de una dama lejana o casada, sino de un «fantasma» que ni siquiera tiene cuerpo.`,
      },

      // Figuras y tópicos — Rima XI
      {
        fragmentId: fragRimaXI.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(rimaXIText, "¿A mí me buscas? —No es a ti, no."),
        order: 1,
        content: `**Paralelismo dialogado**: las tres estrofas repiten la misma estructura —autopresentación de una figura femenina, pregunta retórica y respuesta del yo poético—, construyendo un esquema ternario que solo se resuelve, de forma afirmativa, en el último verso.`,
      },
      {
        fragmentId: fragRimaXI.id,
        type: "figura",
        category: "tropo",
        ...anchor(rimaXIText, "vano fantasma de niebla y luz"),
        order: 2,
        content: `**Metáfora**: la tercera figura se define mediante dos materiales sin consistencia —niebla y luz—, visualizando la idea de un amor que no puede tocarse ni poseerse, solo intuirse o desearse.`,
      },
      {
        fragmentId: fragRimaXI.id,
        type: "figura",
        category: "topos",
        ...anchor(rimaXIText, "Yo soy un sueño, un imposible"),
        order: 3,
        content: `**El amor imposible**: el yo poético rechaza tanto la pasión física como la ternura tangible para entregarse a lo único que «no puede amarle». El deseo se dirige así, paradójicamente, hacia lo inalcanzable: una variante romántica del tópico del amor cortés, en la que la distancia ya no es social, sino ontológica.`,
      },

      // Preguntas de comentario — Rima XI
      {
        fragmentId: fragRimaXI.id,
        type: "pregunta",
        questionGroup: "literal",
        ...anchor(rimaXIText, "Mi frente es pálida, mis trenzas de oro"),
        order: 1,
        content: `¿Qué ofrece cada una de las tres figuras que hablan en el poema?`,
      },
      {
        fragmentId: fragRimaXI.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        ...anchor(rimaXIText, "—¡Oh, ven; ven tú!"),
        order: 1,
        content: `De las tres figuras, el yo poético solo responde afirmativamente a la que le dice «no puedo amarte». ¿Qué dice esto sobre lo que busca realmente en el amor?`,
      },
      {
        fragmentId: fragRimaXI.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `¿Crees que preferir lo «imposible» a lo real es un rasgo propio del Romanticismo, o sigue presente hoy en cómo entendemos el amor —en canciones, películas o redes sociales—? Justifica tu respuesta con un ejemplo.`,
      },

      // Intertextualidad — Rima XI
      {
        fragmentId: fragRimaXI.id,
        type: "intertextualidad",
        ...anchor(rimaXIText, "soy incorpórea, soy intangible"),
        order: 1,
        linkType: "external",
        externalCitation: `Heinrich Heine, Buch der Lieder (Libro de las canciones, 1827).`,
        content: `La brevedad, la estructura en miniaturas casi narrativas y el contraste entre un amor real y otro idealizado e inalcanzable son rasgos centrales de la poesía de Heine, que Bécquer conoció y admiró. La «Rima XI» comprime en doce versos un esquema muy heineano: la elección irónica, casi absurda, de lo que «no puede amarte» frente a lo que sí podría hacerlo.`,
      },

      // Glosas — Rima LII
      {
        fragmentId: fragRimaLII.id,
        type: "glosa",
        ...anchor(rimaLIIText, "que os rompéis bramando"),
        order: 1,
        content: `«Bramar» es emitir un sonido fuerte y prolongado, como el de ciertos animales o el de un mar embravecido. El verbo describe el rugido de las «olas gigantes» que abren el poema.`,
      },
      {
        fragmentId: fragRimaLII.id,
        type: "glosa",
        ...anchor(rimaLIIText, "en el ciego torbellino"),
        order: 2,
        content: `Un «torbellino» es un remolino de viento (o de cualquier cosa) que gira velozmente, arrastrando todo lo que encuentra. El adjetivo «ciego» subraya su carácter incontrolable y sin dirección.`,
      },
      {
        fragmentId: fragRimaLII.id,
        type: "glosa",
        ...anchor(rimaLIIText, "las desprendidas orlas"),
        order: 3,
        content: `Una «orla» es un borde o franja, a menudo decorativa. Aquí designa los bordes deshilachados de las nubes de tormenta, que el rayo «orna» de fuego al romperlas.`,
      },

      // Contextualización histórica — Rima LII
      {
        fragmentId: fragRimaLII.id,
        type: "contexto",
        ...anchor(rimaLIIText, "Olas gigantes que os rompéis bramando"),
        order: 1,
        content: `Las tres primeras estrofas se dirigen, una tras otra, a fuerzas naturales desbocadas —olas, huracán, nubes de tormenta— y se cierran con el mismo grito: «¡llevadme con vosotras!». Esta repetición construye un crescendo cuya razón solo se desvela en la estrofa final.`,
      },
      {
        fragmentId: fragRimaLII.id,
        type: "contexto",
        ...anchor(rimaLIIText, "Tengo miedo de quedarme\ncon mi dolor a solas"),
        order: 2,
        content: `Esta rima pertenece al grupo final de las *Rimas*, conocido como «rimas del dolor» o «de la desesperanza», de tono mucho más sombrío que las composiciones amorosas iniciales y a menudo relacionado con la crisis personal de Bécquer en sus últimos años.`,
      },

      // Figuras y tópicos — Rima LII
      {
        fragmentId: fragRimaLII.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(rimaLIIText, "¡llevadme con vosotras!"),
        order: 1,
        content: `**Anáfora (estribillo)**: el mismo verso cierra las tres primeras estrofas, dirigido cada vez a una fuerza natural distinta —olas, huracán, nubes—, como una súplica que se repite y crece en intensidad hasta la explicación final.`,
      },
      {
        fragmentId: fragRimaLII.id,
        type: "figura",
        category: "tropo",
        ...anchor(rimaLIIText, "envuelto entre la sábana de espumas"),
        order: 2,
        content: `**Metáfora**: la espuma del mar se convierte en una «sábana», palabra que en español también designa el lienzo que envuelve a los muertos. Bajo la imagen de dejarse arrastrar por el mar se insinúa ya, desde el principio, el deseo de desaparecer.`,
      },
      {
        fragmentId: fragRimaLII.id,
        type: "figura",
        category: "sonoro",
        ...anchor(rimaLIIText, "Olas gigantes que os rompéis bramando"),
        order: 3,
        content: `**Aliteración**: la repetición de sonidos vibrantes y la propia palabra onomatopéyica «bramando» reproducen acústicamente el rugido del mar que describe el verso.`,
      },

      // Preguntas de comentario — Rima LII
      {
        fragmentId: fragRimaLII.id,
        type: "pregunta",
        questionGroup: "literal",
        ...anchor(rimaLIIText, "Llevadme, por piedad, adonde el vértigo\ncon la razón me arranque la memoria."),
        order: 1,
        content: `Según la última estrofa, ¿qué es exactamente lo que el yo poético pide que le «arranquen»?`,
      },
      {
        fragmentId: fragRimaLII.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        ...anchor(rimaLIIText, "¡Por piedad! ¡Tengo miedo de quedarme\ncon mi dolor a solas!"),
        order: 1,
        content: `Las tres primeras estrofas parecen pedir ser arrastrado por fuerzas de la naturaleza; solo la última revela el verdadero motivo. ¿Cómo cambia este final la lectura de todo el poema?`,
      },
      {
        fragmentId: fragRimaLII.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `Pedir «perder la memoria» para no sufrir es una idea que también aparece hoy en el deseo de «desconectar» o en tratamientos médicos reales. ¿Te parece un deseo comprensible, peligroso, o ambas cosas?`,
      },

      // Intertextualidad — Rima LII
      {
        fragmentId: fragRimaLII.id,
        type: "intertextualidad",
        ...anchor(rimaLIIText, "con mi dolor a solas"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragRima.id,
        content: `Ambas rimas terminan con el yo poético solo, sin la persona amada. La Rima LIII acepta esa soledad con resignación melancólica («así no te querrán»); la Rima LII desvela la angustia que hay detrás de esa resignación, hasta el punto de desear desaparecer para no sentirla. Leídas juntas, trazan un recorrido desde el desengaño amoroso hasta la desesperación existencial.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Autor y obra — Mariano José de Larra
  // ---------------------------------------------------------------------
  console.log("Creando «Artículos de costumbres» de Larra...");

  const larra = await prisma.author.create({
    data: {
      slug: "mariano-jose-de-larra",
      name: "Mariano José de Larra",
      birthYear: 1809,
      deathYear: 1837,
      country: "España",
      era: "Romanticismo",
      bio: `Mariano José de Larra (Madrid, 1809-1837) es el periodista y prosista más influyente del Romanticismo español. Bajo seudónimos como «Fígaro» o «El Pobrecito Hablador», publicó en la prensa de Madrid varios cientos de artículos —de costumbres, de crítica literaria y de crítica política— en los que la observación satírica de la vida cotidiana se convierte en diagnóstico del atraso, la pereza y la hipocresía de la España de su tiempo. Su vida personal, marcada por un matrimonio fracasado y una relación tormentosa con Dolores Armijo, terminó con su suicidio en Madrid el 13 de febrero de 1837, a los veintisiete años, apenas tres meses después de escribir «El día de difuntos de 1836».`,
      portraitUrl: "/images/authors/mariano-jose-de-larra.jpg",
    },
  });

  const articulosDeCostumbres = await prisma.work.create({
    data: {
      slug: "articulos-de-costumbres",
      title: "Artículos de costumbres",
      year: 1832,
      era: "Romanticismo",
      genre: "Artículo periodístico / sátira de costumbres",
      synopsis: `Bajo los seudónimos de «Fígaro» y «El Pobrecito Hablador», Larra publicó entre 1832 y 1837 una serie de artículos en los que la observación de las costumbres cotidianas —una comida entre amigos, una gestión administrativa, un paseo por el cementerio— se convierte en diagnóstico de los males de España: la pereza, la incultura, el atraso y la hipocresía social. Esta selección reúne tres momentos de ese proyecto: el humor costumbrista de «El castellano viejo» (1832), la sátira de la administración en «Vuelva usted mañana» (1833) y la desolación final de «El día de difuntos de 1836», publicado apenas tres meses antes del suicidio de su autor.`,
      authorId: larra.id,
    },
  });

  // ---------------------------------------------------------------------
  // Fragmentos — Artículos de costumbres (Larra)
  // ---------------------------------------------------------------------
  console.log("Creando fragmentos de «Artículos de costumbres»...");

  const castellanoViejoText = `A todo esto, el niño que a mi izquierda tenía hacía saltar las aceitunas a un plato de magras con tomate, y una vino a parar a uno de mis ojos, que no volvió a ver claro en todo el día; y el señor gordo de mi derecha había tenido la precaución de ir dejando en el mantel, al lado de mi pan, los huesos de las suyas, y los de las aves que había roído; el convidado de enfrente, que se preciaba de trinchador, se había encargado de hacer la autopsia de un capón, o sea gallo, que esto nunca se supo; fuese por la edad avanzada de la víctima, fuese por los ningunos conocimientos anatómicos del victimario, jamás parecieron las coyunturas. —Este capón no tiene coyunturas —exclamaba el infeliz, sudando y forcejeando, más como quien cava que como quien trincha. ¡Cosa más rara! En una de las embestidas resbaló el tenedor sobre el animal como si tuviera escama, y el capón, violentamente despedido, pareció querer tomar su vuelo como en sus tiempos más felices, y se posó en el mantel tranquilamente como pudiera en un palo de un gallinero.

El susto fue general y la alarma llegó a su colmo cuando un surtidor de caldo, impulsado por el animal furioso, saltó a inundar mi limpísima camisa: levántase rápidamente a este punto el trinchador con ánimo de cazar el ave prófuga, y al precipitarse sobre ella, una botella que tiene a la derecha, con la que tropieza su brazo, abandonando su posición perpendicular, derrama un abundante caño de Valdepeñas sobre el capón y el mantel; corre el vino, auméntase la algazara, llueve la sal sobre el vino para salvar el mantel; para salvar la mesa se ingiere por debajo de él una servilleta; una eminencia se levanta sobre el teatro de tantas ruinas. Una criada toda azorada retira el capón en el plato de su salsa; al pasar sobre mí hace una pequeña inclinación, y una lluvia maléfica de grasa desciende, como el rocío sobre los prados, a dejar eternas huellas en mi pantalón color de perla; la angustia y el aturdimiento de la criada no conocen término; retírase atolondrada sin acertar con las excusas; al volverse tropieza con el criado que traía una docena de platos limpios y una salvilla con las copas para los vinos generosos, y toda aquella máquina viene al suelo con el más horroroso estruendo y confusión. —¡Por San Pedro! —exclama dando una voz Braulio, difundida ya sobre sus facciones una palidez mortal, al paso que brota fuego el rostro de su esposa—. Pero sigamos, señores, no ha sido nada —añade volviendo en sí.`;

  const fragCastellanoViejo = await prisma.fragment.create({
    data: {
      slug: "el-castellano-viejo",
      title: "El castellano viejo",
      location: "Artículos de costumbres, «El castellano viejo» (1832)",
      headline: "«Este capón no tiene coyunturas»",
      text: castellanoViejoText,
      order: 1,
      status: "published",
      featured: false,
      workId: articulosDeCostumbres.id,
      constellations: { connect: [{ slug: "critica-social" }] },
      characters: { connect: [{ slug: "figaro" }, { slug: "braulio" }] },
      artworkImageUrl: "/images/artworks/goya-la-boda.jpg",
      artworkTitle: "La boda (The Wedding)",
      artworkAuthor: "Francisco de Goya, h. 1791-1792",
      artworkCaption:
        "Una pareja de novios desproporcionadamente vanidosa avanza bajo un arco, rodeada de una comitiva estridente de parientes vestidos de gala: la misma mezcla de ostentación, ruido y desastre menudo que convierte la comida de cumpleaños de Braulio —pensada para «quedar bien»— en una sucesión de pequeñas catástrofes.",
    },
  });

  const vuelvaUstedMananaText = `Conocí que no estaba el señor de Sans-délai muy dispuesto a dejarse convencer sino por la experiencia, y callé por entonces, bien seguro de que no tardarían mucho los hechos en hablar por mí. Amaneció el día siguiente, y salimos entrambos a buscar un genealogista, lo cual sólo se pudo hacer preguntando de amigo en amigo y de conocido en conocido: encontrámosle por fin, y el buen señor, aturdido de ver nuestra precipitación, declaró francamente que necesitaba tomarse algún tiempo; instósele, y por mucho favor nos dijo definitivamente que nos diéramos una vuelta por allí dentro de unos días. Sonreíme y marchámonos. Pasaron tres días: fuimos.

—Vuelva usted mañana —nos respondió la criada—, porque el señor no se ha levantado todavía.

—Vuelva usted mañana —nos dijo al siguiente día—, porque el amo acaba de salir.

—Vuelva usted mañana —nos respondió el otro—, porque el amo está durmiendo la siesta.

—Vuelva usted mañana —nos respondió el lunes siguiente—, porque hoy ha ido a los toros.

—¿Qué día, a qué hora se ve a un español?

Vímosle por fin, y —Vuelva usted mañana —nos dijo—, porque se me ha olvidado. Vuelva usted mañana, porque no está en limpio.

A los quince días ya estuvo; pero mi amigo le había pedido una noticia del apellido Díez, y él había entendido Díaz, y la noticia no servía. Esperando nuevas pruebas, nada dije a mi amigo, desesperado ya de dar jamás con sus abuelos.`;

  const fragVuelvaUstedManana = await prisma.fragment.create({
    data: {
      slug: "vuelva-usted-manana",
      title: "Vuelva usted mañana",
      location: "Artículos de costumbres, «Vuelva usted mañana» (1833)",
      headline: "«Vuelva usted mañana»",
      text: vuelvaUstedMananaText,
      order: 2,
      status: "published",
      featured: false,
      workId: articulosDeCostumbres.id,
      constellations: { connect: [{ slug: "critica-social" }, { slug: "paso-del-tiempo" }] },
      characters: { connect: [{ slug: "figaro" }, { slug: "monsieur-sans-delai" }] },
      artworkImageUrl: "/images/artworks/goya-ya-es-hora.jpg",
      artworkTitle: "Ya es hora (Capricho n.º 80)",
      artworkAuthor: "Francisco de Goya, 1799",
      artworkCaption:
        "Una figura fantasmal alza los brazos como si por fin se decidiera a actuar, mientras otras, envueltas en sus sayas, siguen bostezando donde estaban: el «ya es hora» que da título al grabado es, exactamente, la hora que nunca llega para el genealogista —ni para nadie— en «Vuelva usted mañana».",
    },
  });

  const diaDeDifuntosText = `Pero ya anochecía, y también era hora de retiro para mí. Tendí una última ojeada sobre el vasto cementerio. Olía a muerte próxima. Los perros ladraban con aquel aullido prolongado, intérprete de su instinto agorero; el gran coloso, la inmensa capital, toda ella se removía como un moribundo que tantea la ropa; entonces no vi más que un gran sepulcro; una inmensa lápida se disponía a cubrirle como una ancha tumba.

No había «aquí yace» todavía; el escultor no quería mentir; pero los nombres del difunto saltaban a la vista ya distintamente delineados.

¡Fuera, exclamé, la horrible pesadilla, fuera! ¡Libertad! ¡Constitución! ¡Tres veces! ¡Opinión nacional! ¡Emigración! ¡Vergüenza! ¡Discordia! Todas estas palabras parecían repetirme a un tiempo los últimos ecos del clamor general de las campanas del día de Difuntos de 1836.

Una nube sombría lo envolvió todo. Era la noche. El frío de la noche helaba mis venas. Quise salir violentamente del horrible cementerio. Quise refugiarme en mi propio corazón, lleno no ha mucho de vida, de ilusiones, de deseos.

¡Santo cielo! También otro cementerio. Mi corazón no es más que otro sepulcro. ¿Qué dice? Leamos.

¿Quién ha muerto en él? ¡Espantoso letrero! ¡Aquí yace la esperanza!

¡Silencio, silencio!`;

  const fragDiaDeDifuntos = await prisma.fragment.create({
    data: {
      slug: "el-dia-de-difuntos-de-1836",
      title: "El día de difuntos de 1836",
      location: "Artículos de costumbres, «El día de difuntos de 1836» (1836)",
      headline: "«Aquí yace la esperanza»",
      text: diaDeDifuntosText,
      order: 3,
      status: "published",
      featured: false,
      workId: articulosDeCostumbres.id,
      constellations: { connect: [{ slug: "muerte" }, { slug: "critica-social" }] },
      topics: { connect: [{ slug: "ubi-sunt" }] },
      characters: { connect: [{ slug: "figaro" }] },
      artworkImageUrl: "/images/artworks/goya-perro-semihundido.jpg",
      artworkTitle: "El perro (Pinturas negras)",
      artworkAuthor: "Francisco de Goya, h. 1819-1823",
      artworkCaption:
        "Solo en medio de una extensión ocre que lo engulle casi por completo, un perro asoma la cabeza hacia un vacío que no responde: la misma soledad sin horizonte que Fígaro encuentra, al final de su paseo por el «cementerio» de Madrid, dentro de su propio corazón.",
    },
  });

  // ---------------------------------------------------------------------
  // Anotaciones — Artículos de costumbres (Larra)
  // ---------------------------------------------------------------------
  console.log("Creando anotaciones de «Artículos de costumbres»...");

  await prisma.annotation.createMany({
    data: [
      // Glosas — El castellano viejo
      {
        fragmentId: fragCastellanoViejo.id,
        type: "glosa",
        ...anchor(castellanoViejoText, "trinchador"),
        order: 1,
        content: `El «trinchador» es el comensal que se encarga de cortar y repartir la carne en la mesa, un papel de lucimiento social que el convidado de enfrente asume voluntariamente —y que aquí se convierte en su ruina.`,
      },
      {
        fragmentId: fragCastellanoViejo.id,
        type: "glosa",
        ...anchor(castellanoViejoText, "coyunturas"),
        order: 2,
        content: `Las «coyunturas» son las articulaciones, los puntos donde se unen los huesos de un animal y por donde debe cortarse para trincharlo con limpieza. Que el capón «no tenga coyunturas» es, por supuesto, imposible: lo que falla no es el ave, sino la pericia del trinchador.`,
      },
      {
        fragmentId: fragCastellanoViejo.id,
        type: "glosa",
        ...anchor(castellanoViejoText, "salvilla"),
        order: 3,
        content: `Una «salvilla» es una bandeja con encajes o huecos pensada para transportar copas o vasos sin que se vuelquen. Su mención subraya lo aparatoso del segundo desastre: no cae un solo plato, sino toda una bandeja cargada de cristalería.`,
      },

      // Contextualización histórica — El castellano viejo
      {
        fragmentId: fragCastellanoViejo.id,
        type: "contexto",
        ...anchor(castellanoViejoText, "el convidado de enfrente, que se preciaba de trinchador"),
        order: 1,
        content: `«El castellano viejo» se publicó en 1832 en «El Pobrecito Hablador», la primera publicación periódica que Larra dirigió bajo seudónimo. Pertenece al género costumbrista: artículos breves que retratan tipos y escenas de la vida social madrileña para extraer de ellos, con humor, una crítica de fondo —en este caso, la obsesión de la nueva clase media por aparentar un «buen tono» que no domina.`,
      },
      {
        fragmentId: fragCastellanoViejo.id,
        type: "contexto",
        ...anchor(castellanoViejoText, "Braulio"),
        order: 2,
        content: `Braulio, el anfitrión de este convite, representa para Larra el «patriotismo mal entendido»: un hombre que rechaza cualquier forma o delicadeza como «cumplido» extranjero y reivindica la «franqueza» española, pero cuya hospitalidad —ruidosa, desordenada y agobiante— termina siendo un castigo para sus invitados.`,
      },

      // Figuras y tópicos — El castellano viejo
      {
        fragmentId: fragCastellanoViejo.id,
        type: "figura",
        category: "tropo",
        ...anchor(castellanoViejoText, "una eminencia se levanta sobre el teatro de tantas ruinas"),
        order: 1,
        content: `**Metáfora**: la mesa volcada, manchada de vino y cubierta de servilletas se describe con el vocabulario de una batalla o un derrumbe —«ruinas», «eminencia»—, elevando un incidente doméstico al tono de una catástrofe épica.`,
      },
      {
        fragmentId: fragCastellanoViejo.id,
        type: "figura",
        category: "tropo",
        ...anchor(castellanoViejoText, "como el rocío sobre los prados"),
        order: 2,
        content: `**Comparación**: la grasa que cae sobre el narrador se compara con el rocío que humedece los prados, una imagen bucólica y delicada aplicada, con ironía, a una mancha de grasa en un pantalón «color de perla».`,
      },
      {
        fragmentId: fragCastellanoViejo.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(castellanoViejoText, "corre el vino, auméntase la algazara, llueve la sal sobre el vino"),
        order: 3,
        content: `**Gradación (enumeración acumulativa)**: una serie de acciones encadenadas sin apenas conectores —corre el vino, aumenta el ruido, llueve la sal, se mete una servilleta— reproduce, en el ritmo mismo de la frase, la rapidez con que un pequeño accidente se convierte en un caos generalizado.`,
      },

      // Preguntas de comentario — El castellano viejo
      {
        fragmentId: fragCastellanoViejo.id,
        type: "pregunta",
        questionGroup: "literal",
        ...anchor(castellanoViejoText, "el convidado de enfrente, que se preciaba de trinchador"),
        order: 1,
        content: `¿Qué tarea se atribuye el «convidado de enfrente» y qué ocurre, paso a paso, cuando intenta llevarla a cabo?`,
      },
      {
        fragmentId: fragCastellanoViejo.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        ...anchor(castellanoViejoText, "El susto fue general y la alarma llegó a su colmo"),
        order: 1,
        content: `Larra describe un capón que se escapa y un poco de grasa derramada con palabras como «susto», «alarma», «furioso» o «estruendo». ¿Qué efecto produce aplicar ese vocabulario, propio de una emergencia real, a un incidente tan pequeño?`,
      },
      {
        fragmentId: fragCastellanoViejo.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `Braulio organiza una comida especial «para quedar bien» y el resultado es justo lo contrario de lo que buscaba. ¿Conoces situaciones parecidas —comidas, fiestas, celebraciones— en las que el exceso de ganas de impresionar acaba arruinando la ocasión?`,
      },

      // Intertextualidad — El castellano viejo
      {
        fragmentId: fragCastellanoViejo.id,
        type: "intertextualidad",
        ...anchor(castellanoViejoText, "Braulio"),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragVuelvaUstedManana.id,
        content: `«El castellano viejo» y «Vuelva usted mañana» comparten al mismo narrador —Fígaro— y un mismo procedimiento: observar una escena cotidiana hasta que, por pura acumulación de detalles absurdos, se convierte en denuncia. Aquí el blanco es la falsa hospitalidad; en el artículo siguiente, la pereza convertida en sistema.`,
      },

      // Glosas — Vuelva usted mañana
      {
        fragmentId: fragVuelvaUstedManana.id,
        type: "glosa",
        ...anchor(vuelvaUstedMananaText, "genealogista"),
        order: 1,
        content: `Un «genealogista» es un profesional que investiga linajes y ascendencias familiares, a menudo para tramitar herencias, títulos o pruebas de nobleza. Que monsieur Sans-délai necesite uno para «resolver sus asuntos de familia» en quince días da la medida de su optimismo.`,
      },
      {
        fragmentId: fragVuelvaUstedManana.id,
        type: "glosa",
        ...anchor(vuelvaUstedMananaText, "instósele"),
        order: 2,
        content: `«Instósele» es una forma antigua y muy compacta de decir «se le instó»: se le insistió, se le presionó. Esta construcción, hoy en desuso, era habitual en la prosa culta del XIX.`,
      },
      {
        fragmentId: fragVuelvaUstedManana.id,
        type: "glosa",
        ...anchor(vuelvaUstedMananaText, "no está en limpio"),
        order: 3,
        content: `«Estar en limpio» significa estar copiado en su forma definitiva, sin borrones ni tachaduras. Es la última de las excusas: ni siquiera hace falta que el trabajo esté mal hecho, basta con que no se haya pasado a limpio todavía.`,
      },

      // Contextualización histórica — Vuelva usted mañana
      {
        fragmentId: fragVuelvaUstedManana.id,
        type: "contexto",
        ...anchor(vuelvaUstedMananaText, "—Vuelva usted mañana —nos respondió la criada—, porque el señor no se ha levantado todavía."),
        order: 1,
        content: `La frase «Vuelva usted mañana» se hizo tan célebre tras este artículo que pasó al habla común como sinónimo de la desidia administrativa española: la promesa de que algo se resolverá «mañana», un mañana que se repite indefinidamente sin llegar nunca.`,
      },
      {
        fragmentId: fragVuelvaUstedManana.id,
        type: "contexto",
        ...anchor(vuelvaUstedMananaText, "Sans-délai"),
        order: 2,
        content: `El nombre «monsieur Sans-délai» —«sin demora», en francés— es un nombre parlante: convierte a este personaje en la encarnación de todo lo que España, según Larra, no es. Usar a un extranjero como espejo para mostrar los defectos propios es el mismo recurso que Cadalso había empleado medio siglo antes con Gazel y Ben-Beley en las «Cartas marruecas».`,
      },

      // Figuras y tópicos — Vuelva usted mañana
      {
        fragmentId: fragVuelvaUstedManana.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(vuelvaUstedMananaText, "—Vuelva usted mañana —nos respondió la criada—, porque el señor no se ha levantado todavía."),
        order: 1,
        content: `**Anáfora**: la misma fórmula —«Vuelva usted mañana»— se repite al comienzo de cinco respuestas sucesivas, cada vez con una excusa distinta. La repetición convierte una frase de cortesía en un estribillo cómico y, después, exasperante.`,
      },
      {
        fragmentId: fragVuelvaUstedManana.id,
        type: "figura",
        category: "tropo",
        ...anchor(vuelvaUstedMananaText, "desesperado ya de dar jamás con sus abuelos"),
        order: 2,
        content: `**Ironía**: tras quince días de espera, todo el esfuerzo se pierde por la diferencia entre «Díez» y «Díaz», una errata mínima. El tono distante y casi notarial con que se cuenta el desastre —sin indignación, como algo previsible— es lo que produce el efecto irónico.`,
      },
      {
        fragmentId: fragVuelvaUstedManana.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(vuelvaUstedMananaText, "porque hoy ha ido a los toros"),
        order: 3,
        content: `**Gradación**: las excusas no se repiten idénticas, sino que progresan —«no se ha levantado», «acaba de salir», «duerme la siesta», «ha ido a los toros», «se me ha olvidado»—, cada una más reveladora que la anterior de que el trabajo, sencillamente, no importa.`,
      },

      // Preguntas de comentario — Vuelva usted mañana
      {
        fragmentId: fragVuelvaUstedManana.id,
        type: "pregunta",
        questionGroup: "literal",
        ...anchor(vuelvaUstedMananaText, "una noticia del apellido Díez, y él había entendido Díaz"),
        order: 1,
        content: `Después de quince días de espera, ¿qué error concreto hace que la información obtenida no le sirva de nada a monsieur Sans-délai?`,
      },
      {
        fragmentId: fragVuelvaUstedManana.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        ...anchor(vuelvaUstedMananaText, "—¿Qué día, a qué hora se ve a un español?"),
        order: 1,
        content: `Esta pregunta interrumpe la serie de respuestas de la criada y del amo. ¿A quién parece dirigirse realmente —a monsieur Sans-délai, al lector, o a ambos— y qué da a entender sobre la opinión de Fígaro sobre sus compatriotas?`,
      },
      {
        fragmentId: fragVuelvaUstedManana.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `«Vuelva usted mañana» sigue usándose hoy para describir trámites que se aplazan una y otra vez. ¿Te parece que esta crítica de Larra sigue siendo válida, ha cambiado, o se ha trasladado a otro tipo de gestiones (líneas de atención al cliente, citas online, etc.)?`,
      },

      // Intertextualidad — Vuelva usted mañana
      {
        fragmentId: fragVuelvaUstedManana.id,
        type: "intertextualidad",
        ...anchor(vuelvaUstedMananaText, "Vuelva usted mañana —nos dijo al siguiente día—, porque el amo acaba de salir."),
        order: 1,
        linkType: "internal",
        linkTargetFragmentId: fragDiaDeDifuntos.id,
        content: `En «Vuelva usted mañana», el «mañana» que nunca llega es motivo de comedia. Tres años después, en «El día de difuntos de 1836», ese mismo aplazamiento perpetuo —de la reforma, de la felicidad, de la esperanza— deja de ser cómico: Larra, que moriría pocos meses después, ya no espera ningún mañana.`,
      },

      // Glosas — El día de difuntos de 1836
      {
        fragmentId: fragDiaDeDifuntos.id,
        type: "glosa",
        ...anchor(diaDeDifuntosText, "agorero"),
        order: 1,
        content: `«Agorero» significa que anuncia o presagia algo, casi siempre una desgracia. El aullido de los perros se interpreta como un anuncio de muerte, reforzando el ambiente fúnebre del paseo.`,
      },
      {
        fragmentId: fragDiaDeDifuntos.id,
        type: "glosa",
        ...anchor(diaDeDifuntosText, "lápida"),
        order: 2,
        content: `Una «lápida» es la losa de piedra, generalmente con una inscripción, que cubre o señala una sepultura. Aquí se convierte en la imagen central: una lápida inmensa, lista para cubrir a toda la capital.`,
      },
      {
        fragmentId: fragDiaDeDifuntos.id,
        type: "glosa",
        ...anchor(diaDeDifuntosText, "día de Difuntos de 1836"),
        order: 3,
        content: `El «Día de Difuntos» (2 de noviembre) es la festividad católica en la que se visita a los muertos en el cementerio. Larra construye todo el artículo sobre esa costumbre, pero invierte su sentido: en vez de visitar a los muertos, descubre que los vivos —y Madrid entero— ya están muertos.`,
      },

      // Contextualización histórica — El día de difuntos de 1836
      {
        fragmentId: fragDiaDeDifuntos.id,
        type: "contexto",
        ...anchor(diaDeDifuntosText, "día de Difuntos de 1836"),
        order: 1,
        content: `Este artículo se publicó el 2 de noviembre de 1836. Apenas tres meses y medio después, el 13 de febrero de 1837, Larra se quitó la vida en Madrid. Leído con esa fecha en mente, el paseo por el «cementerio» y el hallazgo final dentro del propio corazón del narrador adquieren un valor casi de confesión.`,
      },
      {
        fragmentId: fragDiaDeDifuntos.id,
        type: "contexto",
        ...anchor(diaDeDifuntosText, "¡Libertad! ¡Constitución! ¡Tres veces! ¡Opinión nacional! ¡Emigración! ¡Vergüenza! ¡Discordia!"),
        order: 2,
        content: `1836 fue un año de crisis política aguda —motín de La Granja, restauración de la Constitución de 1812, guerra carlista en marcha—. Larra, liberal comprometido, había puesto sus esperanzas en esas mismas palabras —«Libertad», «Constitución», «Opinión nacional»—; aquí aparecen como una letanía de cosas ya enterradas.`,
      },

      // Figuras y tópicos — El día de difuntos de 1836
      {
        fragmentId: fragDiaDeDifuntos.id,
        type: "figura",
        category: "tropo",
        ...anchor(diaDeDifuntosText, "Mi corazón no es más que otro sepulcro"),
        order: 1,
        content: `**Metáfora**: el cementerio que el narrador recorre por fuera —la ciudad de Madrid— se traslada, en la última línea, al interior: el propio corazón es «otro sepulcro», con su propio epitafio.`,
      },
      {
        fragmentId: fragDiaDeDifuntos.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(diaDeDifuntosText, "¡Libertad! ¡Constitución! ¡Tres veces! ¡Opinión nacional! ¡Emigración! ¡Vergüenza! ¡Discordia!"),
        order: 2,
        content: `**Enumeración (asíndeton)**: siete palabras —ideales, hechos y sentimientos políticos— se acumulan sin conjunciones, a golpes, como si fueran nombres leídos uno tras otro en una hilera de tumbas.`,
      },
      {
        fragmentId: fragDiaDeDifuntos.id,
        type: "figura",
        category: "tropo",
        ...anchor(diaDeDifuntosText, "como un moribundo que tantea la ropa"),
        order: 3,
        content: `**Comparación**: Madrid entero —«el gran coloso, la inmensa capital»— se compara con un moribundo que palpa las sábanas de su cama, gesto típico de la agonía. La ciudad entera queda personificada como un cuerpo a punto de morir.`,
      },

      // Preguntas de comentario — El día de difuntos de 1836
      {
        fragmentId: fragDiaDeDifuntos.id,
        type: "pregunta",
        questionGroup: "literal",
        ...anchor(diaDeDifuntosText, "¿Quién ha muerto en él? ¡Espantoso letrero! ¡Aquí yace la esperanza!"),
        order: 1,
        content: `Cuando el narrador busca refugio en su propio corazón, ¿qué encuentra escrito en él?`,
      },
      {
        fragmentId: fragDiaDeDifuntos.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        ...anchor(diaDeDifuntosText, "No había «aquí yace» todavía; el escultor no quería mentir"),
        order: 1,
        content: `El narrador dice que la lápida de la ciudad todavía no tiene escrito «aquí yace», pero que los nombres del difunto «ya saltaban a la vista». ¿Qué quiere decir con esto sobre el momento histórico que está viviendo?`,
      },
      {
        fragmentId: fragDiaDeDifuntos.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `Sabiendo que Larra se suicidó pocos meses después de escribir este artículo, ¿crees que esa información cambia la forma de leerlo? ¿Es legítimo leer un texto literario a la luz de la biografía de su autor, o eso distorsiona su sentido?`,
      },

      // Intertextualidad — El día de difuntos de 1836
      {
        fragmentId: fragDiaDeDifuntos.id,
        type: "intertextualidad",
        ...anchor(diaDeDifuntosText, "¡Aquí yace la esperanza!"),
        order: 1,
        linkType: "external",
        externalCitation: `Jorge Manrique, Coplas por la muerte de su padre (h. 1476), estrofas del «ubi sunt» («¿Qué se hizo el rey don Juan?...»).`,
        content: `El catálogo de epitafios —«aquí yace el trono», «aquí yace la Inquisición», «aquí yace la esperanza»— actualiza, tres siglos y medio después, el tópico medieval del «ubi sunt» de Manrique: la pregunta por dónde han ido a parar las glorias pasadas. Pero Larra invierte el procedimiento: no pregunta qué fue de un pasado glorioso, sino que certifica la muerte del presente.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Edad Media (1/12): El prado alegórico (Berceo, Milagros)
  // ---------------------------------------------------------------------
  console.log("Creando fragmento «El prado alegórico» (Berceo, Milagros)...");

  const pradoAlegoricoText = `Yo maestro Gonçalvo de Verceo nomnado,
yendo en romería caeçí en un prado,
verde e bien sençido, de flores bien poblado,
logar cobdiçiaduero pora omne cansado.

Davan olor sovejo las flores bien olientes,
refrescavan en omne las [carnes] e las mientes,
manavan cada canto fuentes claras corrientes,
en verano bien frías, en ivierno calientes.

Avién y grand abondo de buenas arboledas,
milgranos e figueras, peros e mazanedas,
e muchas otras fructas de diversas monedas,
mas no avié ningunas podridas [nin] azedas.

La verdura del prado, la odor de las flores,
las sombras de los árbores de temprados savores,
refrescáronme todo e perdí los sudores:
podrié vevir el omne con aquellos olores.`;

  const fragPradoAlegorico = await prisma.fragment.create({
    data: {
      slug: "el-prado-alegorico",
      title: "El prado alegórico",
      location: "Milagros de Nuestra Señora (introducción)",
      headline: "Logar cobdiçiaduero pora omne cansado",
      text: pradoAlegoricoText,
      order: 5,
      status: "published",
      featured: false,
      workId: milagros.id,
      constellations: { connect: [{ slug: "fe" }] },
      characters: { connect: [{ slug: "virgen-maria" }] },
      topics: { connect: [{ slug: "locus-amoenus" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragPradoAlegorico.id,
        type: "contexto",
        order: 1,
        content: `El mester de clerecía, corriente poética culta del siglo XIII, se opone al mester de juglaría (oral, anónimo, irregular) con una exigencia técnica nueva: la cuaderna vía o tetrástrofo monorrimo. Berceo es su primer gran representante. El culto mariano alcanzaba en su época su mayor auge en la historia de la Iglesia, y los monasterios competían ferozmente por atraer peregrinos y donaciones mediante la producción literaria y la gestión de reliquias y milagros.`,
      },
      {
        fragmentId: fragPradoAlegorico.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Cuaderna vía (tetrástrofo monorrimo): series de cuatro versos alejandrinos (14 sílabas, con cesura en la séptima) que riman en consonante todos ellos. La rima cambia de estrofa en estrofa. Es la estrofa estelar del mester de clerecía.`,
      },
      {
        fragmentId: fragPradoAlegorico.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Captatio benevolentiae inicial: el poeta se presenta como humilde peregrino que descansa. Descripción del locus amoenus (el prado alegórico) con enumeración sensorial de olores, colores y sabores. Diminutivos afectivos de sabor popular. Acumulación de frutos y flores como recurso de deleite sensorial.`,
      },
      {
        fragmentId: fragPradoAlegorico.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `La introducción a los Milagros presenta el prado alegórico como figura de la Virgen: sus flores son sus virtudes, sus árboles sus milagros, sus frutos su intercesión. El poeta peregrino que descansa es toda la humanidad que halla refugio en María. Bajo el tono popular y festivo se esconde una alegoría teológica sofisticada.`,
      },
      {
        fragmentId: fragPradoAlegorico.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `Los Milagros son contemporáneos de las Cantigas de Santa María de Alfonso X el Sabio (en gallego). El prado alegórico conecta con el hortus conclusus del Cantar de los Cantares. La estrategia de Berceo —hablar en romance para llegar al pueblo— anticipa en dos siglos el debate que Juan de Valdés planteará en el Diálogo de la lengua (1535).`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Edad Media (2/12): Vida de Santo Domingo de Silos (Berceo)
  // ---------------------------------------------------------------------
  console.log("Creando obra «Vida de Santo Domingo de Silos» (Berceo)...");

  const vidaSantoDomingo = await prisma.work.create({
    data: {
      slug: "vida-de-santo-domingo-de-silos",
      title: "Vida de Santo Domingo de Silos",
      year: 1236,
      era: "Edad Media",
      genre: "Poesía hagiográfica (mester de clerecía)",
      synopsis: `Vida en cuaderna vía de Santo Domingo de Silos, abad benedictino del siglo XI, escrita por Gonzalo de Berceo a partir de una fuente latina anterior. Como en los Milagros de Nuestra Señora, el poeta se presenta a sí mismo y declara su programa literario: contar en «román paladino» —la lengua del pueblo— la vida y los milagros del santo.`,
      authorId: berceo.id,
    },
  });

  const quieroFerUnaProsaText = `Quiero fer una prosa en román paladino,
en la cual suele el pueblo fablar a su vecino;
ca no so tan letrado por fer otro latino.
Bien valdrá, como creo, un vaso de bon vino.`;

  const fragQuieroFerUnaProsa = await prisma.fragment.create({
    data: {
      slug: "quiero-fer-una-prosa",
      title: "El prólogo: «Quiero fer una prosa»",
      location: "Vida de Santo Domingo de Silos (prólogo)",
      headline: "Bien valdrá, como creo, un vaso de bon vino",
      text: quieroFerUnaProsaText,
      order: 1,
      status: "published",
      featured: false,
      workId: vidaSantoDomingo.id,
      constellations: { connect: [{ slug: "fe" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragQuieroFerUnaProsa.id,
        type: "contexto",
        order: 1,
        content: `El castellano (el «román paladino») era ya en el siglo XIII la lengua más extendida en la península, pero la lengua de la cultura y de la Iglesia seguía siendo el latín. Berceo es uno de los primeros en reivindicar el romance como lengua literaria digna, aunque lo hace con fingida modestia: probablemente dominaba el latín a la perfección.`,
      },
      {
        fragmentId: fragQuieroFerUnaProsa.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Cuaderna vía con rima en -ino/-ano. Ejemplo perfecto del esquema alejandrino 7+7 con cesura central. Los cuatro versos riman todos en consonante.`,
      },
      {
        fragmentId: fragQuieroFerUnaProsa.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Captatio benevolentiae llevada al extremo: el poeta finge ignorancia del latín para ganarse al público. El último verso —«un vaso de bon vino»— es una petición de recompensa humorística que crea complicidad inmediata con el oyente. La modestia es técnica retórica, no sinceridad.`,
      },
      {
        fragmentId: fragQuieroFerUnaProsa.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `Poética implícita: el poema declara su propio programa literario. La elección del romance no es ingenuidad sino estrategia de comunicación. El vino final convierte la transacción cultural en un gesto festivo y popular que estrecha el vínculo con el lector.`,
      },
      {
        fragmentId: fragQuieroFerUnaProsa.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `La reivindicación del romance como lengua literaria anticipa en dos siglos el debate de Nebrija, Valdés y el humanismo. El gesto de fingida modestia reaparecerá en Cervantes (prólogo del Quijote) y en Quevedo.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Edad Media (3/12): Retrato de la dama ideal (Arcipreste, Libro de buen amor)
  // ---------------------------------------------------------------------
  console.log("Creando fragmento «Retrato de la dama ideal» (Arcipreste)...");

  const retratoDamaIdealText = `Si quieres amar dueñas o a cualquiera mujer
muchas cosas tendrás primero que aprender
para que ella te quiera en amor acoger.
Primeramente, mira qué mujer escoger.

Busca mujer hermosa, atractiva y lozana,
que no sea muy alta pero tampoco enana;
si pudieras, no quieras amar mujer villana,
pues de amor nada sabe, palurda y chabacana.

Busca mujer esbelta, de cabeza pequeña,
cabellos amarillos no teñidos de alheña;
las cejas apartadas, largas, altas, en peña;
ancheta de caderas, ésta es talla de dueña.`;

  const fragRetratoDamaIdeal = await prisma.fragment.create({
    data: {
      slug: "retrato-de-la-dama-ideal",
      title: "Consejos para el amor y retrato de la dama ideal",
      location: "Libro de buen amor (adaptación)",
      headline: "Busca mujer esbelta, de cabeza pequeña",
      text: retratoDamaIdealText,
      order: 7,
      status: "published",
      featured: false,
      workId: libroBuenAmor.id,
      constellations: { connect: [{ slug: "amor" }] },
      characters: { connect: [{ slug: "arcipreste-de-hita" }, { slug: "amor-personificado" }] },
      topics: { connect: [{ slug: "amor-cortes" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragRetratoDamaIdeal.id,
        type: "contexto",
        order: 1,
        content: `El siglo XIV es el de la consolidación del mester de clerecía y también el de su apertura a registros populares y heterodoxos. El Libro de buen amor dialoga con el Ars Amandi de Ovidio, los fabliaux franceses y la lírica galaico-portuguesa, integrando todo en un prodigio de hibridez genérica. La adaptación al castellano actual es del prof. Alberto Montaner Frutos.`,
      },
      {
        fragmentId: fragRetratoDamaIdeal.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Cuaderna vía (tetrástrofo monorrimo alejandrino). En esta versión modernizada se mantiene el esquema de cuatro versos con rima consonante por estrofa.`,
      },
      {
        fragmentId: fragRetratoDamaIdeal.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Enumeración descriptiva del retrato femenino ideal (descriptio puellae), de raíz ovidiana. Mezcla de registro culto y popular. Ironía permanente: el narrador da consejos amorosos mientras finge censurarlos. El clasismo social aflora («no quieras amar mujer villana»).`,
      },
      {
        fragmentId: fragRetratoDamaIdeal.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El Libro de buen amor juega permanentemente con la ambigüedad entre «buen amor» (divino) y «loco amor» (carnal). Los consejos para seducir aparecen simultáneamente como denuncia y como manual. El lector debe elegir su propia lectura: ésa es la trampa y la modernidad del libro.`,
      },
      {
        fragmentId: fragRetratoDamaIdeal.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `El retrato de la dama sigue los moldes del Ars Amandi de Ovidio. El episodio de la Chata de Malangosto conecta con la pastorela provenzal. El Arcipreste anticipa el perspectivismo cervantino: narrateur non fiable avant la lettre.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Edad Media (4/12): La Chata de Malangosto (Arcipreste, Libro de buen amor)
  // ---------------------------------------------------------------------
  console.log("Creando fragmento «La Chata de Malangosto» (Arcipreste)...");

  const chataMalangostoText = `El mes era de março, día de Sant Meder,
pasado el puerto Loçoya fui camino prender
de nieve e de graniso non ove do me absconder:
quien busca lo que non pierde, lo que tien debe perder.

En la cima del puerto, me vi en una rebata;
encontré una vaquera al lado de una mata.
Preguntele quién era, respondiome: «¡La Chata!»
Yo soy la Chata recia, la que a los hombres ata.

Yo guardo este portazgo y su peaje cojo;
al que paga de grado, nunca le causo enojo;
al que pagar no quiere, bien pronto lo despojo.
Págame tú o verás cómo trillan rastrojo.`;

  const fragChataMalangosto = await prisma.fragment.create({
    data: {
      slug: "la-chata-de-malangosto",
      title: "El episodio de la Chata de Malangosto",
      location: "Libro de buen amor",
      headline: "Yo soy la Chata recia, la que a los hombres ata",
      text: chataMalangostoText,
      order: 8,
      status: "published",
      featured: false,
      workId: libroBuenAmor.id,
      constellations: { connect: [{ slug: "amor" }] },
      characters: { connect: [{ slug: "arcipreste-de-hita" }] },
      topics: { connect: [{ slug: "amor-cortes" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragChataMalangosto.id,
        type: "contexto",
        order: 1,
        content: `El episodio de la Chata se sitúa en el puerto de Navafría (Lozoya, Guadarrama), paso obligado entre Castilla y el sur. Las serranas o «chatas» son personajes de la tradición de la pastorela provenzal, pero Ruiz las convierte en figuras cómicas y aterradoras que invierten los roles: son ellas quienes acosan al viajero masculino.`,
      },
      {
        fragmentId: fragChataMalangosto.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Cuaderna vía. Versos alejandrinos de 14 sílabas con cesura en la séptima y rima consonante variable por estrofa. Este fragmento está en versión modernizada.`,
      },
      {
        fragmentId: fragChataMalangosto.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Parodia de la pastorela cortés: la dama idealizada se convierte en una vaquera brutal que cobra peaje. Humor grotesco. Descripción hiperbólica de la fiereza femenina. Diálogo directo para la dramatización.`,
      },
      {
        fragmentId: fragChataMalangosto.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `La Chata representa la inversión carnavalesca: la naturaleza indómita, la mujer que cobra peaje físico, el viajero que debe pagar con su cuerpo o su dinero. La sierra es un espacio de transgresión donde el orden social se suspende y los roles de género se invierten.`,
      },
      {
        fragmentId: fragChataMalangosto.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `El puerto de Navafría reaparecerá siglos después en poemas de García de Tassara, Baroja y Machado sobre el Guadarrama (también en esta compilación). La serrana grotesca anticipa figuras de la comedia lopesca y del esperpento de Valle-Inclán.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Edad Media (5/12): Florencia Pinar — Cancionero General
  // ---------------------------------------------------------------------
  console.log("Creando autora «Florencia Pinar» y obra «Cancionero General»...");

  const florenciaPinar = await prisma.author.create({
    data: {
      slug: "florencia-pinar",
      name: "Florencia Pinar",
      birthYear: 1470,
      deathYear: 1530,
      country: "España",
      era: "Edad Media",
      bio: `Florencia Pinar (h. 1470–h. 1530) es la primera mujer escritora con nombre y apellido de la historia del castellano. Queda constancia documental de ello por su participación en las justas poéticas de su tiempo y por la inclusión de varios poemas suyos en el Cancionero General de Hernando del Castillo (1511). Era de clase social elevada y fue dama de la corte de Isabel la Católica, probablemente miembro de las llamadas Puellae Doctae («niñas sabias»), grupo de mujeres cultas y humanistas cercanas a la reina. Florencia Pinar no solo merece atención por ser mujer y pionera, sino también por la calidad y altura de sus poemas.`,
    },
  });

  const cancioneroGeneral = await prisma.work.create({
    data: {
      slug: "cancionero-general",
      title: "Cancionero General",
      year: 1511,
      era: "Edad Media",
      genre: "Poesía cancioneril",
      synopsis: `Antología lírica recopilada a partir de 1490 y editada por primera vez en 1511 por el poeta y librero segoviano Hernando del Castillo. Reúne la poesía de corte de los Reyes Católicos: amor cortés, juegos conceptuales y, entre voces casi exclusivamente masculinas, los poemas de Florencia Pinar, una de las pocas mujeres que figuran en él con nombre propio.`,
      authorId: florenciaPinar.id,
    },
  });

  const amorTalesManasText = `El amor ha tales mañas
que quien no se guarda dellas,
si se l'entra en las entrañas,
no puede salir sin ellas.

El amor es un gusano
bien mirada su figura,
es un cáncer de natura
que come todo lo sano.

Por sus burlas, por sus sañas,
dél se dan tales querellas
que si s'entra en las entrañas,
no puede salir sin ellas.

Es de diversas colores,
críase de mil antojos;
da fatiga, da dolores,
rige grandes y menores,
ciega muchos claros ojos;
y aquellos, desque cegados,
no quieren verse en clarura;
hállanse tanto quebrados,
que dicen los desdichados
es un cáncer de natura,
a quien somos sojuzgados.

Éntranos por las axillellas
cuándo quedo, cuándo apriesa,
con sospechas, con rencillas;
y al contar destas mancillas
tal se burla que s'confiesa,
y aun las más defendidas
señoras del ser humano
cuando déste son heridas,
si saben y son garridas,
y a ellas come lo sano
y a nosotros nuestras vidas.`;

  const fragAmorTalesManas = await prisma.fragment.create({
    data: {
      slug: "el-amor-ha-tales-manas",
      title: "El amor ha tales mañas",
      location: "Cancionero General (1511)",
      headline: "Es un cáncer de natura que come todo lo sano",
      text: amorTalesManasText,
      order: 1,
      status: "published",
      featured: false,
      workId: cancioneroGeneral.id,
      constellations: { connect: [{ slug: "amor" }] },
      topics: { connect: [{ slug: "amor-cortes" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragAmorTalesManas.id,
        type: "contexto",
        order: 1,
        content: `El Cancionero General fue una antología lírica recopilada a partir de 1490 y editada por primera vez en 1511 por el poeta y librero segoviano Hernando del Castillo. Fue un éxito de ventas durante décadas. La poesía cancioneril del siglo XV es poesía de corte, de amor cortés y juegos conceptuales. Que una mujer publicara en él con nombre propio era un acto de visibilidad extraordinario en su tiempo.`,
      },
      {
        fragmentId: fragAmorTalesManas.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Redondillas (abba) encadenadas con estribillo, más quintillas. Versos octosílabos. Estructura de canción con vuelta al estribillo inicial: la forma musical refuerza el carácter obsesivo del amor descrito.`,
      },
      {
        fragmentId: fragAmorTalesManas.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Metáfora sostenida del amor como enfermedad física: gusano primero, luego cáncer. Antítesis entre lo sano y lo corroído. Enumeración de efectos del amor. El estribillo actúa como conclusión moral que se repite. Anáfora de «es un cáncer de natura».`,
      },
      {
        fragmentId: fragAmorTalesManas.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El amor no como idealización cortés sino como parásito que destruye desde dentro. La voz poética femenina desmonta la convención del amor como gozo para mostrar su cara destructiva y adictiva. Es un poema de lúcida amargura que anticipa en varios rasgos el Renacimiento y el Barroco.`,
      },
      {
        fragmentId: fragAmorTalesManas.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `Anticipa la imagen del amor-enfermedad que desarrollarán Quevedo y sor Juana Inés de la Cruz. Su otro poema famoso (sobre las perdices) es considerado uno de los primeros con alusiones sexuales explícitas en nuestra literatura. Emilia Pardo Bazán reivindicó su figura siglos después.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Edad Media (6/12): Poemas menores (Jorge Manrique)
  // ---------------------------------------------------------------------
  console.log("Creando obra «Poemas menores» (Jorge Manrique)...");

  const poemasMenoresManrique = await prisma.work.create({
    data: {
      slug: "poemas-menores",
      title: "Poemas menores",
      year: 1470,
      era: "Edad Media",
      genre: "Poesía cancioneril (amor cortés)",
      synopsis: `Jorge Manrique, conocido sobre todo por las Coplas a la muerte de su padre, fue también autor de cerca de medio centenar de poemas amorosos de corte cancioneril, escritos según el código del amor cortés y el conceptismo de la poesía del siglo XV. Estos poemas menores muestran la otra cara de su obra: la del amante rendido que juega con las ideas de ausencia, olvido y muerte.`,
      authorId: jorgeManrique.id,
    },
  });

  const sinDiosSinVosSinMiText = `Yo soy quien libre me vi,
yo, quien pudiera olvidaros;
yo só el que, por amaros,
estoy, desque os conoscí,
«sin Dios, y sin vos, y mí».

Sin Dios, porque en vos adoro,
sin vos, pues no me queréis;
pues sin mí ya está de coro
que vos sois quien me tenéis.

Así que triste nascí,
pues que pudiera olvidaros.
Yo so el que, por amaros,
estó, desque os conoscí,
sin Dios, y sin vos, y mí».`;

  const fragSinDiosSinVosSinMi = await prisma.fragment.create({
    data: {
      slug: "sin-dios-sin-vos-y-sin-mi",
      title: "Sin Dios, sin vos y sin mí",
      location: "Poemas menores",
      headline: "«sin Dios, y sin vos, y mí»",
      text: sinDiosSinVosSinMiText,
      order: 1,
      status: "published",
      featured: false,
      workId: poemasMenoresManrique.id,
      constellations: { connect: [{ slug: "amor" }] },
      topics: { connect: [{ slug: "amor-cortes" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragSinDiosSinVosSinMi.id,
        type: "contexto",
        order: 1,
        content: `La poesía cancioneril del siglo XV cultivaba el amor cortés: el poeta como servidor rendido de una dama inalcanzable. El conceptismo amoroso —juegos de ingenio con las ideas de ausencia, olvido, muerte— era su principal recurso. Manrique domina la forma pero la carga de una emoción que trasciende el convencionalismo.`,
      },
      {
        fragmentId: fragSinDiosSinVosSinMi.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Coplas de pie quebrado (manriqueñas): combinación de versos octosílabos y tetrasílabos (8-8-4 / 8-8-4). Rima consonante. La estrofa corta el aliento y subraya la fragilidad del estado amoroso descrito.`,
      },
      {
        fragmentId: fragSinDiosSinVosSinMi.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Anáfora de «Yo soy quien». Gradación descendente de las tres ausencias: sin Dios, sin vos, sin mí. El estribillo concentra en cinco palabras toda la soledad del amante. El juego de pronombres (yo/vos/mí) crea un triángulo de identidades rotas.`,
      },
      {
        fragmentId: fragSinDiosSinVosSinMi.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El amor como triple vaciamiento existencial: de Dios (porque adora a la amada en lugar de a Dios), de la amada (porque no le corresponde) y de sí mismo (porque se ha entregado del todo). Una de las más perfectas formulaciones del amor-muerte en la lírica medieval castellana.`,
      },
      {
        fragmentId: fragSinDiosSinVosSinMi.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `La fórmula «sin Dios, sin vos y sin mí» reaparece en Bernardo de Balbuena y en Francisco de Figueroa (siglo XVI), prueba de su enorme influencia. Las Coplas a la muerte de su padre son la gran elegía medieval española; este pequeño poema muestra la otra cara de Manrique.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Edad Media (7/12): Romance de la loba parda (Romancero viejo)
  // ---------------------------------------------------------------------
  console.log("Creando fragmento «Romance de la loba parda»...");

  const lobaPardaText = `Estando yo en la mi choza
pintando la mi cayada,
las cabrillas altas iban
y la luna rebajada;
mal barruntan las ovejas,
no paran en la majada.
Vide venir siete lobos
por una oscura cañada.
Venían echando suertes
cuál entrará a la majada;
le tocó a una loba vieja,
patituerta, cana y parda,
que tenía los colmillos
como punta de navaja.
Dio tres vueltas al redil
y no pudo sacar nada;
a la otra vuelta que dio,
sacó la borrega blanca,
hija de la oveja churra,
nieta de la orejisana,
la que tenían mis amos
para el domingo de Pascua.
—¡Aquí, mis siete cachorros,
aquí, perra trujillana,
aquí, perro el de los hierros,
a correr la loba parda!
Si me cobráis la borrega,
cenaréis leche y hogaza;
y si no me la cobráis,
cenaréis de mi cayada.
Los perros tras de la loba
las uñas se esmigajaban;
siete leguas la corrieron
por unas sierras muy agrias.
Al subir un cotarrito
la loba ya va cansada:
—Tomad, perros, la borrega,
sana y buena como estaba.
—No queremos la borrega,
de tu boca alobadada,
que queremos tu pelleja
pa' el pastor una zamarra;
el rabo para correas,
para atacarse las bragas;
de la cabeza un zurrón,
para meter las cucharas;
las tripas para vihuelas
para que bailen las damas.`;

  const fragLobaParda = await prisma.fragment.create({
    data: {
      slug: "romance-de-la-loba-parda",
      title: "Romance de la loba parda",
      location: "Romancero viejo (romances pastoriles)",
      headline: "Que queremos tu pelleja pa' el pastor una zamarra",
      text: lobaPardaText,
      order: 2,
      status: "published",
      featured: false,
      workId: romancero.id,
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragLobaParda.id,
        type: "contexto",
        order: 1,
        content: `El romancero es el género más genuinamente popular de nuestra literatura medieval. Los pastores trashumantes extremeños llevaron este romance a ambas Castillas y a León. Su transmisión oral durante siglos explica las variantes y la riqueza léxica pastoril que conserva: cayada, majada, borrega churra, orejisana.`,
      },
      {
        fragmentId: fragLobaParda.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Serie de versos octosílabos en la que los versos pares riman en asonante (-ada). Los impares quedan libres. Estructura típica del romancero viejo.`,
      },
      {
        fragmentId: fragLobaParda.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Narración en primera persona del pastor. Retrato grotesco y preciso de la loba («patituerta, cana y parda», «colmillos como punta de navaja»). Diálogo dramático. Enumeración final de los usos del cuerpo de la loba: humor negro de una eficacia brutal.`,
      },
      {
        fragmentId: fragLobaParda.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El robo del ganado, la persecución y la justicia ruda del mundo rural. La loba que ofrece devolver el botín recibe una sentencia implacable: sus partes servirán al pastor. Es un canto a la justicia natural del mundo campesino, sin misericordia ni ceremonias.`,
      },
      {
        fragmentId: fragLobaParda.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `La tradición pastoril extremeña conecta con las églogas renacentistas de Garcilaso. El género del romance influirá directamente en el Romancero gitano de Lorca (1928), también en esta compilación.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Edad Media (8/12): Romance de la gentil dama y el rústico pastor
  // ---------------------------------------------------------------------
  console.log("Creando fragmento «Romance de la gentil dama y el rústico pastor»...");

  const gentilDamaPastorText = `Estáse la gentil dama
paseando en su vergel;
los pies tenía descalzos,
que era maravilla ver;
hablárame desde lexos,
no le quise responder.
Respondíle con gran saña:
—¿Qué mandáys, gentil mujer?
Con una voz amorosa
comenzó de responder:
—Ven acá, el pastorcico,
si quieres tomar placer;
siesta es de medio día,
y ya es hora de comer;
si querrás tomar posada
todo es a tu placer.
—No era tiempo, señora,
que me haya de detener,
que tengo mujer e hijos,
y casa de mantener,
y mi ganado en la sierra
que se me iba a perder,
y aquellos que lo guardan
no tenían qué comer.
—Vete con Dios, pastorcillo,
no te sabes entender;
hermosuras de mi cuerpo
yo te las hiciera ver:
delgadita en la cintura,
blanca so como el papel;
la color tengo mezclada
como rosa en el rosel;
las teticas agudicas,
que el brial quieras hender;
el cuello tengo de garza,
los ojos de un esparver;
pues lo que tengo encubierto
maravilla es de lo ver.
—Ni aunque más tengáis, señora,
no me puedo detener.`;

  const fragGentilDamaPastor = await prisma.fragment.create({
    data: {
      slug: "romance-de-la-gentil-dama-y-el-rustico-pastor",
      title: "Romance de la gentil dama y el rústico pastor",
      location: "Romancero viejo (pastorela)",
      headline: "Ni aunque más tengáis, señora, no me puedo detener",
      text: gentilDamaPastorText,
      order: 3,
      status: "published",
      featured: false,
      workId: romancero.id,
      constellations: { connect: [{ slug: "amor" }] },
      topics: { connect: [{ slug: "amor-cortes" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragGentilDamaPastor.id,
        type: "contexto",
        order: 1,
        content: `La pastorela era un género muy cultivado en la lírica provenzal: un caballero encuentra a una pastora y la requiebra. Aquí Anónimo invierte los roles con humor e ironía: la dama se autodescribe con lujo de detalles físicos mientras el pastor responde con argumentos económicos y familiares.`,
      },
      {
        fragmentId: fragGentilDamaPastor.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Octosílabos con rima asonante en los pares en -e. La rima sostenida en una sola vocal a lo largo de todo el poema es característica de los romances más arcaicos.`,
      },
      {
        fragmentId: fragGentilDamaPastor.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Diálogo dramático. Autopresentación física de la dama (descriptio puellae invertida: ella misma se describe para seducir). Anáfora de la negativa del pastor. Contraste entre el lujo sensual de la dama y la austeridad laboral del pastor: dos mundos que se rozan sin entenderse.`,
      },
      {
        fragmentId: fragGentilDamaPastor.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `La fidelidad conyugal y la responsabilidad laboral como valores supremos frente a la tentación aristocrática. El pastor honrado que resiste la seducción de la nobleza ociosa. El romance funciona como elogio implícito del trabajo y la vida rural frente a la frivolidad cortesana.`,
      },
      {
        fragmentId: fragGentilDamaPastor.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `Conecta con la pastorela occitana y con el Libro de buen amor (el Arcipreste también rechaza a las serranas). La dama que se describe a sí misma anticipa la retórica seductora del teatro barroco y de la novela picaresca.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Edad Media (9/12): El infante Arnaldos (Romancero viejo)
  // ---------------------------------------------------------------------
  console.log("Creando fragmento «El infante Arnaldos»...");

  const infanteArnaldosText = `¡Quién hubiera tal ventura
sobre las aguas del mar
como hubo el infante Arnaldos
la mañana de San Juan!
Andando a buscar la caza
para su falcón cebar,
vio venir una galera
que a tierra quiere llegar;
las velas trae de seda,
la jarcia de oro torzal,
áncoras tiene de plata,
tablas de fino coral.
Marinero que la guía,
diciendo viene un cantar,
que la mar ponía en calma,
los vientos hace amainar;
los peces que andan al hondo,
arriba los hace andar;
las aves que van volando,
al mástil vienen posar.
Allí habló el infante Arnaldos,
bien oiréis lo que dirá:
—Por mi vida, el marinero,
dígasme ora ese cantar.
Respondióle el marinero,
tal respuesta le fue a dar:
—Yo no digo mi canción
sino a quien conmigo va.`;

  const fragInfanteArnaldos = await prisma.fragment.create({
    data: {
      slug: "el-infante-arnaldos",
      title: "El infante Arnaldos",
      location: "Romancero viejo (romances novelescos)",
      headline: "Yo no digo mi canción sino a quien conmigo va",
      text: infanteArnaldosText,
      order: 4,
      status: "published",
      featured: false,
      workId: romancero.id,
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragInfanteArnaldos.id,
        type: "contexto",
        order: 1,
        content: `La versión conservada es probablemente un fragmento de un romance más extenso. El elemento de la mañana de San Juan conecta con la tradición de los romances de magia: en esa noche se abren los mundos y suceden cosas extraordinarias.`,
      },
      {
        fragmentId: fragInfanteArnaldos.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Octosílabos con rima asonante en los pares en -ar. Serie muy regular y sostenida que contribuye al efecto hipnótico y misterioso del poema.`,
      },
      {
        fragmentId: fragInfanteArnaldos.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Acumulación de materiales preciosos (seda, oro, plata, coral): la galera como objeto de deseo y misterio absoluto. Enumeración de los efectos mágicos del canto (calma el mar, atrae los peces, detiene las aves). Final abierto e irresuelto: el misterio nunca se desvela.`,
      },
      {
        fragmentId: fragInfanteArnaldos.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El poema es sobre el misterio de lo inaccesible: el canto que solo se comparte con quien se embarca. Borges vio en él un ejemplo de «la poesía de lo inminente»: algo está a punto de ocurrir, pero el poema termina antes. Su fuerza reside en lo que no dice.`,
      },
      {
        fragmentId: fragInfanteArnaldos.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `Borges escribió sobre este romance como paradigma de la sugerencia poética. García Lorca y Alberti reivindicaron el romancero como fuente de su propia poesía. El motivo del canto mágico conecta con el Orfeo clásico.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Edad Media (10/12): Romance del enamorado y la muerte
  // ---------------------------------------------------------------------
  console.log("Creando fragmento «Romance del enamorado y la muerte»...");

  const enamoradoMuerteText = `Un sueño soñaba anoche,
soñito del alma mía,
soñaba con mis amores,
que en mis brazos los tenía.
Vi entrar señora tan blanca,
muy más que la nieve fría.
—¿Por dónde has entrado, amor?
¿Cómo has entrado, mi vida?
Las puertas están cerradas,
ventanas y celosías.
—No soy el amor, amante:
la Muerte que Dios te envía.
—¡Ay, Muerte tan rigurosa,
déjame vivir un día!
—Un día no puede ser,
una hora tienes de vida.
Muy deprisa se calzaba,
más deprisa se vestía;
ya se va para la calle,
en donde su amor vivía.
—¡Ábreme la puerta, blanca,
ábreme la puerta, niña!
—¿Cómo te podré yo abrir
si la ocasión no es venida?
Mi padre no fue al palacio,
mi madre no está dormida.
—Si no me abres esta noche,
ya no me abrirás, querida;
la Muerte me está buscando,
junto a ti vida sería.
—Vete bajo la ventana
donde labraba y cosía,
te echaré cordón de seda
para que subas arriba,
y si el cordón no alcanzare,
mis trenzas añadiría.
La fina seda se rompe;
la Muerte que allí venía:
—Vamos, el enamorado,
que la hora ya está cumplida.`;

  const fragEnamoradoMuerte = await prisma.fragment.create({
    data: {
      slug: "romance-del-enamorado-y-la-muerte",
      title: "Romance del enamorado y la muerte",
      location: "Romancero viejo (romances líricos)",
      headline: "La Muerte que Dios te envía",
      text: enamoradoMuerteText,
      order: 5,
      status: "published",
      featured: false,
      workId: romancero.id,
      constellations: { connect: [{ slug: "amor" }, { slug: "muerte" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragEnamoradoMuerte.id,
        type: "contexto",
        order: 1,
        content: `El Romance del enamorado y la muerte junta dos de las grandes pulsiones humanas: el ansia de amor y el miedo a la muerte. Es uno de los más perfectos de todo el romancero: la economía narrativa, el suspense y la imagen final son de una eficacia devastadora.`,
      },
      {
        fragmentId: fragEnamoradoMuerte.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Octosílabos con rima asonante en los pares en -ía. La regularidad métrica contrasta con la urgencia dramática del contenido.`,
      },
      {
        fragmentId: fragEnamoradoMuerte.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `El sueño como marco que introduce la muerte. La muerte personificada como figura blanca y femenina (inversión del tópico: no es oscura sino «blanca, muy más que la nieve fría»). Diálogo en tres tiempos: con la muerte, con la amada. La seda que se rompe como imagen de la vida que se corta.`,
      },
      {
        fragmentId: fragEnamoradoMuerte.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El amor y la muerte como fuerzas simultáneas e irreconciliables. El enamorado, sabiendo que va a morir, corre hacia su amada: no para salvarse, sino para despedirse. La amada no puede abrir (el honor, los padres). El cordón de seda que se rompe cierra el poema con una imagen devastadora de impotencia.`,
      },
      {
        fragmentId: fragEnamoradoMuerte.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `La muerte blanca y femenina anticipa la Luna del Romancero gitano de Lorca. El motivo de la muerte que llega disfrazada de amor conecta con la balada romántica europea. El romance se conservó en la tradición sefardí de Grecia y Marruecos.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Edad Media (11/12): Romance del rey don Sancho (ciclo cidiano)
  // ---------------------------------------------------------------------
  console.log("Creando fragmento «Romance del rey don Sancho»...");

  const reyDonSanchoText = `—Guarte, guarte, rey don Sancho,
no digas que no te aviso,
que de dentro de Zamora
un alevoso ha salido:
llámase Bellido Dolfos,
hijo de Dolfos Bellido,
cuatro traiciones ha hecho
y con esta serán cinco;
si gran traidor fuera el padre,
mayor traidor es el hijo.
Gritos dan en el real:
que a don Sancho han mal herido.
Muerto le ha Bellido Dolfos,
gran traición ha cometido.
Desque le tuviera muerto,
metiose por un postigo;
por las calles de Zamora
va dando voces y gritos:
—Tiempo era, doña Urraca,
de cumplir lo prometido.`;

  const fragReyDonSancho = await prisma.fragment.create({
    data: {
      slug: "romance-del-rey-don-sancho",
      title: "Romance del rey don Sancho",
      location: "Romancero viejo (ciclo cidiano)",
      headline: "Tiempo era, doña Urraca, de cumplir lo prometido",
      text: reyDonSanchoText,
      order: 6,
      status: "published",
      featured: false,
      workId: romancero.id,
      constellations: { connect: [{ slug: "poder" }, { slug: "honor-y-destierro" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragReyDonSancho.id,
        type: "contexto",
        order: 1,
        content: `Los romances históricos del ciclo cidiano narran episodios de las guerras civiles del siglo XI con libertad legendaria. La figura de Bellido Dolfos se convirtió en sinónimo de traidor en la cultura popular española, con una permanencia de casi mil años.`,
      },
      {
        fragmentId: fragReyDonSancho.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Octosílabos con rima asonante en los pares en -ido. La brevedad del romance —veinte versos— y su concentración dramática son características del mejor romancero.`,
      },
      {
        fragmentId: fragReyDonSancho.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Advertencia inicial que el rey ignora (ironía trágica: el oyente sabe lo que va a pasar). Narración rapidísima de los hechos. El grito de Bellido a Urraca en el desenlace —«Tiempo era, doña Urraca, / de cumplir lo prometido»— revela de golpe toda la conspiración.`,
      },
      {
        fragmentId: fragReyDonSancho.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `La traición y sus consecuencias. El aviso ignorado como motor del drama. La muerte del rey como resultado de una conjura familiar. El romance comprime en veinte versos un drama político complejo con todos los ingredientes de la tragedia.`,
      },
      {
        fragmentId: fragReyDonSancho.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `La décima anónima sobre la muerte del conde de Villamediana (siglo XVII, también en esta compilación) retomará el nombre de «Bellido» para aludir a un posible crimen de Estado: prueba de la permanencia cultural del personaje durante siglos.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Edad Media (12/12): Romance de la jura de santa Gadea (ciclo cidiano)
  // ---------------------------------------------------------------------
  console.log("Creando fragmento «Romance de la jura de santa Gadea»...");

  const juraSantaGadeaText = `En santa Águeda de Burgos,
do juran los hijosdalgo,
le toman la jura a Alfonso
por la muerte de su hermano;
tomábasela el buen Cid,
ese buen Cid castellano,
sobre un cerrojo de hierro
y una ballesta de palo
y con unos evangelios
y un crucifijo en la mano.
Las palabras son tan fuertes
que al buen rey ponen espanto.
—Villanos te maten, Alfonso;
villanos, que no hidalgos;
de las Asturias de Oviedo,
que no sean castellanos;
mátente con aguijadas,
no con lanzas ni con dardos;
con cuchillos cachicuernos,
no con puñales dorados;
abarcas traigan calzadas,
que no zapatos con lazo;
capas traigan aguaderas,
no de contray ni frisado;
con camisones de estopa,
no de holanda ni labrados;
caballeros vengan en burras,
que no en mulas ni en caballos;
frenos traigan de cordel,
que no cueros fogueados.
Mátente por las aradas,
que no en villas ni en poblado,
y sáquente el corazón
por el siniestro costado,
si no dijeres la verdad
de lo que te es preguntado:
si fuiste o consentiste
en la muerte de tu hermano.
—Muy mal me conjuras, Cid;
Cid, muy mal me has conjurado;
mas hoy me tomas la jura,
mañana me besarás la mano.
—Por besar mano de rey
no me tengo por honrado,
porque la besó mi padre
me tengo por afrentado.
—Vete de mis tierras, Cid,
mal caballero probado.
—Pláceme, dijo el buen Cid;
pláceme, dijo, de grado,
por ser la primera cosa
que mandas en tu reinado.
Tú me destierras por uno,
yo me destierro por cuatro.`;

  const fragJuraSantaGadea = await prisma.fragment.create({
    data: {
      slug: "romance-de-la-jura-de-santa-gadea",
      title: "Romance de la jura de santa Gadea",
      location: "Romancero viejo (ciclo cidiano)",
      headline: "Tú me destierras por uno, yo me destierro por cuatro",
      text: juraSantaGadeaText,
      order: 7,
      status: "published",
      featured: false,
      workId: romancero.id,
      constellations: { connect: [{ slug: "honor-y-destierro" }, { slug: "poder" }] },
      characters: { connect: [{ slug: "el-cid" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragJuraSantaGadea.id,
        type: "contexto",
        order: 1,
        content: `El romance convierte una hipótesis histórica en un símbolo universal: el vasallo honrado que pide cuentas al rey ilegítimo, sabiendo que ello le traerá la ruina. Es uno de los textos fundacionales de la idea castellana de la dignidad personal frente al poder.`,
      },
      {
        fragmentId: fragJuraSantaGadea.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Octosílabos con rima asonante en los pares en -ado. La regularidad métrica da solemnidad y peso rítmico a la imprecación del Cid. La serie de antítesis (lanza/aguijada, dorado/cachicuerno) crea un martilleo de deseos de muerte humillante.`,
      },
      {
        fragmentId: fragJuraSantaGadea.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `La imprecación del Cid es una obra maestra de la gradación descendente: muerte a manos de villanos, con herramientas humildes, en lugar inhóspito. Cada antítesis rebaja la dignidad de la muerte posible del rey. El diálogo final es de una concisión demoledora: seis versos que condensan toda la tragedia del vasallo honrado.`,
      },
      {
        fragmentId: fragJuraSantaGadea.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El vasallo leal que se rebela contra el rey ilegítimo, sabiendo que le costará el destierro. La honra como valor supremo que no se vende ni al rey. El último intercambio —«tú me destierras por uno, yo me destierro por cuatro»— es el gesto más altivo de toda la épica castellana: el Cid convierte el castigo en acto voluntario.`,
      },
      {
        fragmentId: fragJuraSantaGadea.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `El motivo del «impulso soberano» detrás de un crimen de Estado reaparece en la décima anónima sobre la muerte del conde de Villamediana (s. XVII). Lope de Vega y Guillén de Castro dramatizaron el ciclo cidiano; Las Mocedades del Cid de Guillén de Castro inspiró El Cid de Corneille (1636).`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Renacimiento (1/14): Juan Boscán — Rimas
  // ---------------------------------------------------------------------
  console.log("Creando autor «Juan Boscán» y obra «Rimas»...");

  const boscan = await prisma.author.create({
    data: {
      slug: "juan-boscan",
      name: "Juan Boscán",
      birthYear: 1487,
      deathYear: 1542,
      country: "España",
      era: "Renacimiento",
      bio: `Juan Boscán (Barcelona, h. 1487-1542) es una de las figuras más importantes —e injustamente opacadas— de la historia de la literatura española. Catalanohablante de origen, se formó en la corte de los Reyes Católicos bajo la tutela del humanista Lucio Marineo Sículo. Por sugerencia del embajador veneciano Andrea Navagero, inició la introducción de los metros italianos en la poesía castellana, arrastrando consigo a su amigo Garcilaso. Sin Boscán, la historia de nuestra poesía habría sido radicalmente diferente. Fue también el primer traductor al castellano de «El cortesano» de Castiglione.`,
    },
  });

  const rimasBoscan = await prisma.work.create({
    data: {
      slug: "rimas-boscan",
      title: "Rimas",
      year: 1543,
      era: "Renacimiento",
      genre: "Poesía lírica (soneto)",
      synopsis: `Publicadas póstumamente en 1543 junto a la obra de su amigo Garcilaso de la Vega, las Rimas de Boscán introdujeron en castellano el soneto, la octava real y el verso endecasílabo siguiendo el modelo de Petrarca. Sin esta empresa conjunta, emprendida por sugerencia del embajador veneciano Andrea Navagero, la historia de la poesía española habría sido radicalmente distinta.`,
      authorId: boscan.id,
    },
  });

  const olvidoImposibleText = `Quien dice que la ausencia causa olvido
merece ser de todos olvidado.
El verdadero y firme enamorado
está, cuando está ausente, más perdido.
Aviva la memoria su sentido;
la soledad levanta su cuidado;
hallarse de su bien tan apartado
hace su desear más encendido.
No sanan las heridas en él dadas,
aunque cese el mirar que las causó,
si quedan en el alma confirmadas,
que si uno está con muchas cuchilladas,
porque huya de quien lo acuchilló
no por eso serán mejor curadas.`;

  const fragOlvidoImposible = await prisma.fragment.create({
    data: {
      slug: "soneto-del-olvido-imposible",
      title: "Soneto del olvido imposible",
      location: "Rimas",
      headline: "Lejos de los ojos, más cerca del corazón",
      text: olvidoImposibleText,
      order: 1,
      status: "published",
      featured: false,
      workId: rimasBoscan.id,
      constellations: { connect: [{ slug: "amor" }] },
      topics: { connect: [{ slug: "amor-cortes" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragOlvidoImposible.id,
        type: "contexto",
        order: 1,
        content: `El Renacimiento llega a la poesía española de la mano de los poetas soldados: Boscán, Garcilaso, Cetina, Hurtado de Mendoza. El contacto con Italia —a través de viajes, guerras y diplomacia— les pone en contacto con Petrarca, Ariosto, Bembo. El soneto, la lira, la octava real y el endecasílabo son sus principales importaciones.`,
      },
      {
        fragmentId: fragOlvidoImposible.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Soneto italiano (petrarquista): dos cuartetos y dos tercetos en endecasílabos. Rima ABBA ABBA CDC DCD. El último terceto introduce el símil de las cuchilladas: el argumento concreto que cierra el argumento abstracto.`,
      },
      {
        fragmentId: fragOlvidoImposible.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Sentencia inicial demoledora como primer verso. Gradación ascendente de los efectos de la ausencia: aviva la memoria, levanta el cuidado, enciende el deseo. Símil final de las cuchilladas: el amor es una herida que no cura con la distancia, sino todo lo contrario.`,
      },
      {
        fragmentId: fragOlvidoImposible.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `Contra el tópico «ojos que no ven, corazón que no siente»: Boscán demuestra exactamente lo contrario. La ausencia no cura el amor sino que lo intensifica. El soneto es una demostración lógica más que una efusión lírica: la razón al servicio de la pasión.`,
      },
      {
        fragmentId: fragOlvidoImposible.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `Fue Boscán quien publicó póstumamente la obra de Garcilaso en 1543, lanzándolo al estrellato. Su soneto CXXIX, también en esta compilación, es una elegía a Garcilaso muerto. Los sonetos de Boscán influyeron directamente en Lope, Góngora y Quevedo.`,
      },
    ],
  });

  const sonetoCXXIXText = `Garcilaso, que al bien siempre aspiraste
y siempre con tal fuerza le seguiste,
que a pocos pasos que tras él corriste,
en todo enteramente le alcanzaste,
dime: ¿por qué tras ti no me llevaste
cuando de esta mortal tierra partiste?,
¿por qué, al subir a lo alto que subiste,
acá en esta bajeza me dejaste?
Bien pienso yo que, si poder tuvieras
de mudar algo lo que está ordenado,
en tal caso de mí no te olvidaras:
que o quisieras honrarme con tu lado
o a lo menos de mí te despidieras;
o, si esto no, después por mí tornaras.`;

  const fragSonetoCXXIX = await prisma.fragment.create({
    data: {
      slug: "soneto-cxxix-a-la-muerte-de-garcilaso",
      title: "Soneto CXXIX (a la muerte de Garcilaso)",
      location: "Rimas, CXXIX",
      headline: "¿Por qué tras ti no me llevaste?",
      text: sonetoCXXIXText,
      order: 2,
      status: "published",
      featured: false,
      workId: rimasBoscan.id,
      constellations: { connect: [{ slug: "muerte" }, { slug: "amor" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragSonetoCXXIX.id,
        type: "contexto",
        order: 1,
        content: `La amistad entre Boscán y Garcilaso es uno de los grandes episodios de la historia de la literatura española: dos poetas que se influyen mutuamente, que comparten el proyecto de renovar la lírica castellana, y cuya relación trasciende lo literario para convertirse en afecto personal profundo.`,
      },
      {
        fragmentId: fragSonetoCXXIX.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Soneto italiano en endecasílabos. Rima ABBA ABBA CDE DCE. La disposición de los tercetos crea una acumulación de condiciones hipotéticas: «o quisieras… o a lo menos… o, si esto no».`,
      },
      {
        fragmentId: fragSonetoCXXIX.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Apóstrofe al difunto. Pregunta retórica doble (¿por qué no me llevaste? ¿por qué me dejaste?). La triple condición final expresa con ingenio afectuoso la imposibilidad de la muerte: si hubieras podido, habrías hecho una de tres cosas.`,
      },
      {
        fragmentId: fragSonetoCXXIX.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `Elegía de amistad, no de duelo convencional. No es un llanto sino un reproche cariñoso: ¿cómo te has marchado sin mí? La admiración («en todo enteramente le alcanzaste») convive con la queja afectuosa. Un poema de amistad más que de duelo.`,
      },
      {
        fragmentId: fragSonetoCXXIX.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `Boscán fue el editor póstumo de Garcilaso: sin él, la obra del toledano podría haberse perdido. Este soneto es el testimonio más íntimo de esa relación. Fernando de Herrera escribirá años después una elegía a Garcilaso muy diferente en tono: más grandilocuente, menos personal.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Renacimiento (2/14): Garcilaso de la Vega — nuevos sonetos y Égloga I
  // ---------------------------------------------------------------------
  console.log("Creando nuevos fragmentos de Garcilaso de la Vega...");

  const sonetoVText = `Escrito está en mi alma vuestro gesto,
y cuanto yo escribir de vos deseo;
vos sola lo escribisteis, yo lo leo
tan solo, que aun de vos me guardo en esto.
En esto estoy y estaré siempre puesto;
que aunque no cabe en mí cuanto en vos veo,
de tanto bien lo que no entiendo creo,
tomando ya la fe por presupuesto.
Yo no nací sino para quereros;
mi alma os ha cortado a su medida;
por hábito del alma mismo os quiero.
Cuanto tengo confieso yo deberos;
por vos nací, por vos tengo la vida,
por vos he de morir, y por vos muero.`;

  const fragSonetoV = await prisma.fragment.create({
    data: {
      slug: "soneto-v",
      title: "Soneto V",
      location: "Sonetos, V",
      headline: "Escrito está en mi alma vuestro gesto",
      text: sonetoVText,
      order: 2,
      status: "published",
      featured: false,
      workId: sonetos.id,
      constellations: { connect: [{ slug: "amor" }] },
      topics: { connect: [{ slug: "amor-cortes" }] },
      places: { connect: [{ slug: "toledo" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragSonetoV.id,
        type: "contexto",
        order: 1,
        content: `Garcilaso, con Boscán, introdujo en castellano el soneto, la lira, la octava real y el endecasílabo. Su obra breve —menos de cincuenta sonetos, cinco canciones, una oda, dos elegías, una epístola, tres églogas— es de una perfección técnica y emotiva sin precedentes. Los expertos creen que la destinataria de este soneto era Isabel Freyre o Guiomar Carrillo.`,
      },
      {
        fragmentId: fragSonetoV.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Soneto italiano en endecasílabos. Rima ABBA ABBA CDC DCD. El último terceto acumula cuatro proposiciones paralelas con anáfora de «por vos» que culminan en la paradoja final: morir en presente y futuro a la vez.`,
      },
      {
        fragmentId: fragSonetoV.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Metáfora del alma como libro en el que la amada ha escrito. Paradoja del amor como fe («de tanto bien lo que no entiendo creo»). Anáfora en los tercetos («por vos nací, por vos…»). El último verso conjuga futuro y presente en una muerte continua.`,
      },
      {
        fragmentId: fragSonetoV.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El amor como destino absoluto, inseparable de la identidad. El alma «cortada a la medida» de la amada: no hay yo sin ella. La fe amorosa como equivalente de la fe religiosa: creo lo que no entiendo. Un soneto de entrega total y absoluta.`,
      },
      {
        fragmentId: fragSonetoV.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `La imagen del alma como libro escrito por la amada influirá en sor Juana Inés y en Quevedo. El «por vos muero» es la culminación castellana del amor-muerte petrarquista. Garcilaso fue el maestro indiscutible de todos los grandes sonetistas del Siglo de Oro.`,
      },
    ],
  });

  const sonetoXText = `¡Oh dulces prendas, por mí mal halladas,
dulces y alegres cuando Dios quería,
juntas estáis en la memoria mía,
y con ella en mi muerte conjuradas!
¿Quién me dijera, cuando las pasadas
horas que en tanto bien por vos me vía,
que me habiáis de ser en algún día
con tan grave dolor representadas?
Pues en una hora junto me llevastes
todo el bien que por términos me distes,
lleváme junto el mal que me dejastes;
si no, sospecharé que me pusistes
en tantos bienes, porque deseastes
verme morir entre memorias tristes.`;

  const fragSonetoX = await prisma.fragment.create({
    data: {
      slug: "soneto-x",
      title: "Soneto X",
      location: "Sonetos, X",
      headline: "¡Oh dulces prendas, por mí mal halladas!",
      text: sonetoXText,
      order: 3,
      status: "published",
      featured: false,
      workId: sonetos.id,
      constellations: { connect: [{ slug: "amor" }, { slug: "muerte" }] },
      topics: { connect: [{ slug: "ubi-sunt" }] },
      places: { connect: [{ slug: "toledo" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragSonetoX.id,
        type: "contexto",
        order: 1,
        content: `El Soneto X es quizás el más célebre de Garcilaso y uno de los más intensos poemas de amor perdido de toda la literatura española. Su primera palabra —«Oh»— es una exclamación de dolor tan directa que atraviesa cinco siglos. El epígrafe en latín de la Eneida de Virgilio («Dulces exuviae») es la fuente confesa.`,
      },
      {
        fragmentId: fragSonetoX.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Soneto italiano en endecasílabos. Rima ABBA ABBA CDC DCD. La disposición de los tercetos crea una lógica implacable: si me quitasteis el bien de golpe, quitadme también el mal de golpe.`,
      },
      {
        fragmentId: fragSonetoX.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Apóstrofe a las «prendas» (recuerdos, objetos de la amada). Paradoja: lo dulce y alegre que se convierte en instrumento de muerte. La «memoria» como cómplice del dolor. La lógica implacable del último terceto: la sospecha de que la amada lo puso en bienes para verle morir.`,
      },
      {
        fragmentId: fragSonetoX.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `La memoria como verdugo. Los recuerdos felices, lejos de consolar, intensifican el dolor de la pérdida. La felicidad pasada no es refugio sino condena. Un poema sobre la crueldad del tiempo que hace durar el dolor precisamente porque conserva el recuerdo del placer.`,
      },
      {
        fragmentId: fragSonetoX.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `Virgilio, Eneida IV: «Dulces exuviae» (dulces prendas). Garcilaso traduce y supera el modelo latino. Quevedo retomará el motivo del amor más allá de la muerte en su célebre soneto «Amor constante más allá de la muerte».`,
      },
    ],
  });

  const eglogaI = await prisma.work.create({
    data: {
      slug: "egloga-i",
      title: "Égloga I",
      year: 1534,
      era: "Renacimiento",
      genre: "Poesía bucólica (égloga)",
      synopsis: `Dos pastores, Salicio y Nemoroso, lamentan alternativamente sus amores desdichados a orillas del Tajo: Salicio, el desdén de Galatea; Nemoroso, la muerte de Elisa. Considerada la obra maestra de Garcilaso, la Égloga I funde el modelo bucólico de Virgilio y Sannazaro con una intensidad emocional que la tradición ha leído como trasunto autobiográfico de los amores del poeta por Isabel Freyre.`,
      authorId: garcilaso.id,
    },
  });

  const quejaSalicioText = `¡Oh más dura que mármol a mis quejas,
y al encendido fuego en que me quemo
más helada que nieve, Galatea!,
estoy muriendo, y aún la vida temo;
témola con razón, pues tú me dejas,
que no hay, sin ti, el vivir para qué sea.
Vergüenza he que me vea
ninguno en tal estado,
de ti desamparado,
y de mí mismo yo me corro ahora.
¿De un alma te desdeñas ser señora,
donde siempre moraste, no pudiendo
de ella salir una hora?
Salid sin duelo, lágrimas, corriendo.`;

  const fragQuejaSalicio = await prisma.fragment.create({
    data: {
      slug: "egloga-i-queja-de-salicio",
      title: "Égloga I — Queja de Salicio a Galatea",
      location: "Égloga I",
      headline: "Salid sin duelo, lágrimas, corriendo",
      text: quejaSalicioText,
      order: 1,
      status: "published",
      featured: false,
      workId: eglogaI.id,
      constellations: { connect: [{ slug: "amor" }] },
      topics: { connect: [{ slug: "locus-amoenus" }, { slug: "amor-cortes" }] },
      places: { connect: [{ slug: "toledo" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragQuejaSalicio.id,
        type: "contexto",
        order: 1,
        content: `La égloga es una composición lírica en la que uno o varios pastores monologan o dialogan sobre sus amores en una naturaleza idealizada (el locus amoenus). Garcilaso toma el modelo de Virgilio (Bucólicas) y de Sannazaro (Arcadia) y lo supera con su intensidad personal. El verso final —«Salid sin duelo, lágrimas, corriendo»— es uno de los más famosos de toda la poesía española.`,
      },
      {
        fragmentId: fragQuejaSalicio.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Estancia: combinación libre de endecasílabos y heptasílabos con esquema de rima propio para cada poema. Garcilaso usa aquí la combinación 11-11-11-11-11-11-7-7-7-11-11-11-7-11.`,
      },
      {
        fragmentId: fragQuejaSalicio.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Oxímoron inicial: «más dura que mármol» y «más helada que nieve» caracterizan la frialdad de Galatea. Paradoja: «estoy muriendo, y aún la vida temo». El alma de la amada como morada permanente del amante. Personificación de las lágrimas en el verso final.`,
      },
      {
        fragmentId: fragQuejaSalicio.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `La queja amorosa como género: el amante desesperado ante la indiferencia de la amada. En Garcilaso la convención petrarquista se carga de emoción personal auténtica. El verso final —«Salid sin duelo, lágrimas, corriendo»— es un permiso y una rendición simultáneos: el poeta se abandona al dolor.`,
      },
      {
        fragmentId: fragQuejaSalicio.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `Diego Hurtado de Mendoza imita este verso en su soneto «Salid, lágrimas mías, ya cansadas», también en esta compilación. El modelo pastoril de Garcilaso influirá en toda la novela y el teatro del Siglo de Oro.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Renacimiento (3/14): Gutierre de Cetina — Obras poéticas
  // ---------------------------------------------------------------------
  console.log("Creando autor «Gutierre de Cetina» y obra «Obras poéticas»...");

  const cetina = await prisma.author.create({
    data: {
      slug: "gutierre-de-cetina",
      name: "Gutierre de Cetina",
      birthYear: 1520,
      deathYear: 1557,
      country: "España",
      era: "Renacimiento",
      bio: `Gutierre de Cetina (Sevilla, h. 1520 – México, h. 1557). Gran poeta soldado del Renacimiento español. Viajó por Italia —donde bebió de Petrarca, Ariosto y Bembo— y por Alemania como soldado del emperador. Fue el primer poeta en llevar los metros italianos a Nueva España (México). Murió en Puebla, al parecer apuñalado al pie de la ventana de Leonor de Osuna por un rival que cortejaba a la misma dama. Los ojos claros, serenos y airados del poema son los de la condesa Laura Gonzaga, a quien Cetina dedicó parte de su obra.`,
    },
  });

  const obrasPoeticasCetina = await prisma.work.create({
    data: {
      slug: "obras-poeticas-cetina",
      title: "Obras poéticas",
      year: 1895,
      era: "Renacimiento",
      genre: "Poesía lírica (madrigal)",
      synopsis: `Edición póstuma de la obra de Gutierre de Cetina, poeta soldado que llevó los metros italianos hasta Nueva España. El madrigal «Ojos claros, serenos», dedicado a la condesa Laura Gonzaga, es posiblemente el más perfecto del género en castellano.`,
      authorId: cetina.id,
    },
  });

  const ojosClarosText = `Ojos claros, serenos,
si de un dulce mirar sois alabados,
¿por qué, si me miráis, miráis airados?
Si cuanto más piadosos,
más bellos parecéis a aquel que os mira,
no me miréis con ira,
porque no parezcáis menos hermosos.
¡Ay tormentos rabiosos!
Ojos claros, serenos,
ya que así me miráis, miradme al menos.`;

  const fragOjosClaros = await prisma.fragment.create({
    data: {
      slug: "ojos-claros-serenos",
      title: "Ojos claros, serenos",
      location: "Obras poéticas (madrigal)",
      headline: "Miradme con ira, pero miradme",
      text: ojosClarosText,
      order: 1,
      status: "published",
      featured: false,
      workId: obrasPoeticasCetina.id,
      constellations: { connect: [{ slug: "amor" }] },
      topics: { connect: [{ slug: "amor-cortes" }] },
      places: { connect: [{ slug: "sevilla" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragOjosClaros.id,
        type: "contexto",
        order: 1,
        content: `El madrigal italiano —composición de versos heptasílabos y endecasílabos de tema amoroso— fue importado por los poetas soldados del Renacimiento español. Este madrigal de Cetina es posiblemente el más perfecto del género en castellano. Si no supiéramos que tiene casi cinco siglos, pensaríamos que es contemporáneo.`,
      },
      {
        fragmentId: fragOjosClaros.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Madrigal: mezcla libre de heptasílabos y endecasílabos. No tiene número fijo de versos ni esquema de rima fijo. La brevedad y la concentración son rasgos esenciales del género.`,
      },
      {
        fragmentId: fragOjosClaros.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Argumentación elegante y casi jurídica: si sois alabados por dulce mirar, ¿por qué miráis airados? Si miráis con piedad parecéis más bellos, luego mirad con piedad para parecer más hermosos. La lógica del elogio convertida en argumento de seducción. Apóstrofe a los ojos.`,
      },
      {
        fragmentId: fragOjosClaros.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `La mirada airada de la amada como paradoja que el poeta intenta resolver con razonamiento. La petición final —«miradme al menos»— es una súplica de mínimos tras el argumento elegante: basta con que me miréis, aunque sea con ira.`,
      },
      {
        fragmentId: fragOjosClaros.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `Es el poema más citado de la tradición española de los ojos como motivo poético. Conecta con el Cantar de mío Cid («de los sus ojos llorando»), con Bécquer (Rima XXIII) y con Diego Hurtado de Mendoza (Canción), también en esta compilación.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Renacimiento (4/14): Diego Hurtado de Mendoza — Obras poéticas
  // ---------------------------------------------------------------------
  console.log("Creando autor «Diego Hurtado de Mendoza» y obra «Obras poéticas»...");

  const hurtadoDeMendoza = await prisma.author.create({
    data: {
      slug: "diego-hurtado-de-mendoza",
      name: "Diego Hurtado de Mendoza",
      birthYear: 1503,
      deathYear: 1575,
      country: "España",
      era: "Renacimiento",
      bio: `Diego Hurtado de Mendoza (Granada, h. 1503-1575). Poeta, diplomático, historiador y bibliófilo. Habló latín, griego, árabe y hebreo. Fue embajador en la Inglaterra de Enrique VIII, en Venecia y en Roma, y representó a Carlos I en el Concilio de Trento. Reunió una biblioteca excepcional que legó a Felipe II. Lope de Vega dijo de él: «¿Qué cosa aventaja a una redondilla de don Diego Hurtado de Mendoza?». Es el presunto autor del Lazarillo de Tormes, aunque la prueba definitiva no ha aparecido.`,
    },
  });

  const obrasPoeticasHurtadoDeMendoza = await prisma.work.create({
    data: {
      slug: "obras-poeticas-hurtado-de-mendoza",
      title: "Obras poéticas",
      year: 1610,
      era: "Renacimiento",
      genre: "Poesía lírica (soneto y canción)",
      synopsis: `Edición póstuma de la obra poética de Diego Hurtado de Mendoza, diplomático, historiador y bibliófilo. Su «Soneto dentro del soneto» —que narra su propia composición verso a verso— es una invención metapoética casi un siglo anterior al célebre soneto de Lope «Un soneto me manda hacer Violante».`,
      authorId: hurtadoDeMendoza.id,
    },
  });

  const sonetoDentroSonetoText = `Pedís, Reina, un soneto y os lo hago.
Ya el primer verso y el segundo es hecho;
si el tercero me sale de provecho,
con otro más en un cuarteto os pago.
El quinto alcanzo: ¡España! ¡Santïago
cierra! Y entro en el sexto: ¡Sus, buen pecho!
Si el séptimo libro, gran derecho
tengo a salir con vida de este trago.
Ya tenemos a un cabo los cuartetos:
¿Qué me decís, señora? ¿No ando bravo?
Mas sabe Dios si temo los tercetos.
¡Ay! Si con bien este segundo acabo,
¡nunca en toda mi vida más sonetos!
Más deste, gloria a Dios, ya he visto el cabo.`;

  const fragSonetoDentroSoneto = await prisma.fragment.create({
    data: {
      slug: "soneto-dentro-del-soneto",
      title: "Soneto dentro del soneto (Pedís, Reina, un soneto)",
      location: "Obras poéticas",
      headline: "Un soneto que se escribe a sí mismo",
      text: sonetoDentroSonetoText,
      order: 1,
      status: "published",
      featured: false,
      workId: obrasPoeticasHurtadoDeMendoza.id,
      constellations: { connect: [{ slug: "amor" }] },
      places: { connect: [{ slug: "granada" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragSonetoDentroSoneto.id,
        type: "contexto",
        order: 1,
        content: `El soneto dentro del soneto es una invención de Hurtado de Mendoza casi un siglo antes de que Lope lo hiciera famoso con «Un soneto me manda hacer Violante». El juego metapoético —el poema que habla de sí mismo mientras se escribe— es un rasgo de modernidad extraordinaria para el siglo XVI.`,
      },
      {
        fragmentId: fragSonetoDentroSoneto.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Soneto italiano en endecasílabos. El poema narra su propia construcción verso a verso: el poeta va contando los versos que lleva escritos. El humor surge del contraste entre la solemnidad de la forma y la angustia cómica del proceso.`,
      },
      {
        fragmentId: fragSonetoDentroSoneto.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Metapoesía: el soneto habla de su propia composición. Las exclamaciones bélicas («¡España! ¡Santiago cierra!») como recurso humorístico para afrontar el verso difícil. La promesa de no volver a escribir sonetos... en el último verso de un soneto.`,
      },
      {
        fragmentId: fragSonetoDentroSoneto.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El arte de hacer sonetos como empresa heroica y agotadora. La dificultad técnica convertida en fuente de humor. La metaliteratura avant la lettre.`,
      },
      {
        fragmentId: fragSonetoDentroSoneto.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `Anticipa directamente el famosísimo soneto de Lope («Un soneto me manda hacer Violante»). El juego metapoético reaparece en Cervantes (prólogo del Quijote) y en la poesía contemporánea de corte irónico.`,
      },
    ],
  });

  const pastoraSiMalMeQuieresText = `Pastora, si mal me quieres
y deseas apartarme,
bien lo muestras con mirarme.
Contigo tienes testigos,
señora, de estos antojos,
que el corazón y los ojos
nunca fueron enemigos.
Huyan de ti tus amigos
y tú huye de mirarme,
que yo no puedo apartarme.
Nadie ponga el afición
en voluntad ocupada,
que al cabo de la jornada
para en desesperación.
Yo busco mi perdición
y tú quieres ayudarme,
pastora, con mal mirarme.
Doblada lleva la queja
el pastor que por ti muere,
si quieres a quien te deja
y dejas a quien te quiere.
Vaya amor adonde fuere
que, aunque quieras apartarme,
no podrás con no mirarme.`;

  const fragPastoraSiMalMeQuieres = await prisma.fragment.create({
    data: {
      slug: "pastora-si-mal-me-quieres",
      title: "Canción (Pastora, si mal me quieres)",
      location: "Obras poéticas",
      headline: "Quieres a quien te deja, dejas a quien te quiere",
      text: pastoraSiMalMeQuieresText,
      order: 2,
      status: "published",
      featured: false,
      workId: obrasPoeticasHurtadoDeMendoza.id,
      constellations: { connect: [{ slug: "amor" }] },
      topics: { connect: [{ slug: "amor-cortes" }] },
      places: { connect: [{ slug: "granada" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragPastoraSiMalMeQuieres.id,
        type: "contexto",
        order: 1,
        content: `Esta Canción entra en la tradición de los poemas sobre la mirada como origen del amor y del desamor. El tópico de la mirada que mata o enamora recorre toda la poesía española, desde el Cantar de mío Cid hasta Bécquer. Su sentencia «si quieres a quien te deja / y dejas a quien te quiere» anticipa directamente a sor Juana Inés de la Cruz.`,
      },
      {
        fragmentId: fragPastoraSiMalMeQuieres.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Coplas de arte menor (octosílabos) con estribillo. Estructura de glosa con vuelta al estribillo. Rima consonante. La canción tiene estructura de copla con variaciones del estribillo inicial.`,
      },
      {
        fragmentId: fragPastoraSiMalMeQuieres.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Paradoja central: «bien lo muestras con mirarme» (el mal querer se muestra mirando). Sentencia gnómica («el corazón y los ojos nunca fueron enemigos»). La paradoja del amor no correspondido: «si quieres a quien te deja / y dejas a quien te quiere».`,
      },
      {
        fragmentId: fragPastoraSiMalMeQuieres.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El amor imposible como estructura permanente del deseo: siempre se desea lo que no se tiene y se rechaza lo que se ofrece. El pastor que busca su propia perdición es un tópico de la lírica de cancionero llevado aquí a su expresión más lúcida.`,
      },
      {
        fragmentId: fragPastoraSiMalMeQuieres.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `La paradoja «quieres a quien te deja / dejas a quien te quiere» anticipa directamente el primer cuarteto del soneto más famoso de sor Juana Inés de la Cruz («Al que ingrato me deja, busco amante»), también en esta compilación. La tradición de la mirada conecta con Cetina y con Bécquer.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Renacimiento (5/14): Fray Luis de León — nuevo fragmento
  // de «La vida retirada» (estrofas 1-3 y final, naufragio)
  // ---------------------------------------------------------------------
  console.log("Creando fragmento «La vida retirada (¡Oh monte, oh fuente, oh río!)»...");

  const vidaRetiradaNaufragioText = `¡Qué descansada vida
la del que huye del mundanal ruïdo,
y sigue la escondida
senda, por donde han ido
los pocos sabios que en el mundo han sido;
que no le enturbia el pecho
de los soberbios grandes el estado,
ni del dorado techo
se admira, fabricado
del sabio Moro, en jaspe sustentado!
No cura si la fama
canta con voz su nombre pregonera,
ni cura si encarama
la lengua lisonjera
lo que condena la verdad sincera.
¡Oh monte, oh fuente, oh río,!
¡Oh secreto seguro, deleitoso!
Roto casi el navío,
a vuestro almo reposo
huyo de aqueste mar tempestuoso.`;

  const fragVidaRetiradaNaufragio = await prisma.fragment.create({
    data: {
      slug: "vida-retirada-oh-monte-oh-fuente-oh-rio",
      title: "La vida retirada (¡Oh monte, oh fuente, oh río!)",
      location: "Oda «A la vida retirada», estrofas 1-3 y 17 (final)",
      headline: "Roto casi el navío, huyo de aqueste mar tempestuoso",
      text: vidaRetiradaNaufragioText,
      order: 5,
      status: "published",
      featured: false,
      workId: poesiaFrayLuis.id,
      constellations: { connect: [{ slug: "poder" }] },
      topics: {
        connect: [{ slug: "beatus-ille" }, { slug: "contemptus-mundi" }],
      },
      places: { connect: [{ slug: "salamanca" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragVidaRetiradaNaufragio.id,
        type: "contexto",
        order: 1,
        content: `El ascetismo es una doctrina filosófica que busca purificar el espíritu mediante la abstinencia y la renuncia a los placeres materiales para acercarse a Dios. La Vida retirada es la oda ascética más famosa de la literatura española: el elogio de la soledad, el campo y el retiro frente al ruido del mundo. Tiene 17 liras en total; esta selección reúne las tres primeras —que abren el poema— con la última, la decimoséptima, donde el poeta llega por fin al puerto de su retiro «roto casi el navío».`,
      },
      {
        fragmentId: fragVidaRetiradaNaufragio.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Lira: estrofa de cinco versos (7a-11B-7a-7b-11B), importada de Italia por Garcilaso. Fray Luis fue el gran cultivador de la lira después de Garcilaso. La Oda a Salinas, la Oda En la ascensión y esta Vida retirada son sus obras maestras en liras.`,
      },
      {
        fragmentId: fragVidaRetiradaNaufragio.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Exclamatio inicial («¡Qué descansada vida...!») y final («¡Oh monte, oh fuente, oh río!»): el poema se abre y se cierra con dos exclamaciones que enmarcan todo el recorrido. La metáfora del «mundanal ruido» procede de Horacio (Beatus ille). El naufragio como metáfora de la vida activa: el poeta llega a la orilla del retiro «roto casi el navío», tras «aqueste mar tempestuoso». Contraste entre los «dorados techos» del poderoso y la sencillez del retiro.`,
      },
      {
        fragmentId: fragVidaRetiradaNaufragio.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El ideal humanista-estoico de la vida retirada: lejos de la ambición, la fama y el ruido. La naturaleza —monte, fuente, río— como espacio de la verdad y el sosiego, y como destino último de un viaje que el poeta describe con la imagen de un naufragio del que apenas se salva. Una oda que es también un programa de vida y, en el contexto biográfico de fray Luis —preso varios años por la Inquisición—, un diagnóstico doloroso del mundo del que huye.`,
      },
      {
        fragmentId: fragVidaRetiradaNaufragio.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `La oda imita el Beatus ille de Horacio (Epodo II). El ideal del retiro conecta con el De vita solitaria de Petrarca. «A la salida de la cárcel» —la décima de la celda inquisitorial, incluida en esta misma colección— es la versión más concentrada y autobiográfica de este mismo ideal: el retiro ya no elegido, sino impuesto por la celda.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Renacimiento (6/14): Santa Teresa — villancico completo
  // «Vivo sin vivir en mí»
  // ---------------------------------------------------------------------
  console.log("Creando fragmento «Vivo sin vivir en mí (villancico completo)»...");

  const vivoSinVivirCompletoText = `Vivo sin vivir en mí,
y tan alta vida espero,
que muero porque no muero.

Vivo ya fuera de mí,
después que muero de amor;
porque vivo en el Señor,
que me quiso para sí:
cuando el corazón le di
puso en él este letrero,
que muero porque no muero.

Esta divina prisión,
del amor en que yo vivo,
ha hecho a Dios mi cautivo,
y libre mi corazón;
y causa en mí tal pasión
ver a Dios mi prisionero,
que muero porque no muero.

¡Ay, qué larga es esta vida!
¡Qué duros estos destierros,
esta cárcel, estos hierros
en que el alma está metida!
Sólo esperar la salida
me causa dolor tan fiero,
que muero porque no muero.

¡Ay, qué vida tan amarga
do no se goza el Señor!
Porque si es dulce el amor,
no lo es la esperanza larga:
quíteme Dios esta carga,
más pesada que el acero,
que muero porque no muero.`;

  const fragVivoSinVivirCompleto = await prisma.fragment.create({
    data: {
      slug: "vivo-sin-vivir-en-mi-villancico-completo",
      title: "Vivo sin vivir en mí (villancico completo)",
      location: "Poesías, villancico completo (5 estrofas)",
      headline: "Que muero porque no muero",
      text: vivoSinVivirCompletoText,
      order: 2,
      status: "published",
      featured: false,
      workId: poesiasTeresa.id,
      constellations: { connect: [{ slug: "amor" }, { slug: "muerte" }] },
      topics: { connect: [{ slug: "mistica" }] },
      places: { connect: [{ slug: "avila" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragVivoSinVivirCompleto.id,
        type: "contexto",
        order: 1,
        content: `La mística cristiana busca la unión del alma con Dios durante la vida terrenal. En Teresa, esa unión se expresa con un lenguaje de paradoja y contradicción: vivir sin vivir, morir sin morir, ser libre siendo prisionera. El villancico «Vivo sin vivir en mí» es uno de los más conocidos de la literatura mística española y su estribillo ha pasado al acervo popular. Esta versión recoge el poema completo, con las dos estrofas finales —«¡Ay, qué larga es esta vida!» y «¡Ay, qué vida tan amarga»— que no figuran en la selección breve de esta colección.`,
      },
      {
        fragmentId: fragVivoSinVivirCompleto.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Villancico: composición con estribillo («que muero porque no muero») que se repite al final de cada estrofa. Versos octosílabos. El estribillo —siete sílabas que concentran toda la paradoja mística— es el corazón del poema y se repite cinco veces.`,
      },
      {
        fragmentId: fragVivoSinVivirCompleto.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Paradoja central y sostenida durante todo el poema: vivir/morir, libre/prisionera, Dios cautivo/alma libre. El oxímoron como forma de expresar lo inexpresable de la experiencia mística. La cárcel y los hierros de las dos últimas estrofas extreman la imagen de la prisión que ya estaba presente desde el principio.`,
      },
      {
        fragmentId: fragVivoSinVivirCompleto.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `La vida terrena como muerte y la muerte como vida: la gran paradoja mística. El alma que ya no vive en sí misma porque vive en Dios. Las dos estrofas finales añaden una nota de queja explícita —«¡qué larga es esta vida!», «¡qué vida tan amarga!»— que hace más palpable el anhelo: la muerte como única forma de alcanzar la vida verdadera.`,
      },
      {
        fragmentId: fragVivoSinVivirCompleto.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `San Juan de la Cruz desarrollará los mismos temas con mayor complejidad en el Cántico espiritual y la Noche oscura. El estribillo «muero porque no muero» ha pervivido en el habla popular española durante cuatro siglos. Carolina Coronado escribirá su propio poema sobre el «amor de los amores» inspirada en este modelo.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Renacimiento (7/14): San Juan de la Cruz
  // Cántico espiritual (fragmento inicial, estrofas 1-4, búsqueda del Amado)
  // ---------------------------------------------------------------------
  console.log("Creando fragmento «Cántico espiritual (búsqueda)» de San Juan de la Cruz...");

  const canticoBusquedaText = `¿Adónde te escondiste,
Amado, y me dexaste con gemido?
Como el ciervo huyste
haviéndome herido;
salí tras ti clamando, y eras ydo.

Pastores, los que fuerdes
allá por las majadas al otero,
si por ventura vierdes
aquél que yo más quiero,
decilde que adolezco, peno y muero.

Buscando mis amores,
yré por esos montes y riberas;
ni cogeré las flores,
ni temeré las fieras,
y passaré los fuertes y fronteras.

¡O bosques y espesuras,
plantadas por la mano del Amado!,
¡o prado de verduras,
de flores esmaltado!,
dezid si por vosotros ha passado.`;

  const fragCanticoBusqueda = await prisma.fragment.create({
    data: {
      slug: "cantico-espiritual-la-busqueda",
      title: "Cántico espiritual (fragmento inicial)",
      location: "Cántico espiritual, estrofas 1-4",
      headline: "¿Adónde te escondiste, Amado?",
      text: canticoBusquedaText,
      order: 3,
      status: "published",
      featured: false,
      workId: poesiaSanJuanDeLaCruz.id,
      constellations: { connect: [{ slug: "amor" }] },
      topics: { connect: [{ slug: "mistica" }, { slug: "locus-amoenus" }] },
      places: { connect: [{ slug: "fontiveros" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragCanticoBusqueda.id,
        type: "contexto",
        order: 1,
        content: `En Juan de la Cruz confluyen tres grandes corrientes líricas: la tradición bíblica del Cantar de los Cantares, la lírica popular castellana del primer Renacimiento y la corriente culta italianizante. Sus poemas son breves pero se cuentan entre los más perfectos de toda la literatura española. Este fragmento recoge las cuatro primeras liras del Cántico espiritual —la búsqueda del Amado ausente—, distintas de las estrofas de la unión («Mi Amado las montañas...») recogidas en otra entrada de esta colección.`,
      },
      {
        fragmentId: fragCanticoBusqueda.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Liras (estrofas de cinco versos, 7a-11B-7a-7b-11B). El Cántico espiritual tiene 40 liras en total. La lira fue traída del italiano por Garcilaso y usada magistralmente por fray Luis de León; Juan de la Cruz la eleva a su máxima expresión mística.`,
      },
      {
        fragmentId: fragCanticoBusqueda.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `El Cántico sigue el modelo del Cantar de los Cantares: la esposa (el alma) que busca al esposo ausente (Dios). Pregunta retórica inicial («¿Adónde te escondiste?») que atraviesa el poema entero. La naturaleza —bosques, prado, montes, riberas— interpelada como testigo del amor ausente. La ortografía arcaica del original («dexaste», «huyste», «passaré», «dezid») es signo de que el poema circuló en copias manuscritas desde el cautiverio del poeta.`,
      },
      {
        fragmentId: fragCanticoBusqueda.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El alma que busca a Dios después de que este se ha «escondido». La búsqueda mística como experiencia de dolor, urgencia y anhelo. La naturaleza como espacio de esa búsqueda. El poema es también profundamente sensual: la mística y el erotismo se funden indisolublemente en la tradición del Cantar de los Cantares.`,
      },
      {
        fragmentId: fragCanticoBusqueda.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `El Cántico bebe directamente del Cantar de los Cantares bíblico. Carolina Coronado escribió su «amor de los amores» en homenaje explícito a este modelo. Rubén Darío y los modernistas hispanoamericanos reivindicaron a san Juan como maestro de la musicalidad poética.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Renacimiento (8/14): San Juan de la Cruz
  // «Tras de un amoroso lance»
  // ---------------------------------------------------------------------
  console.log("Creando fragmento «Tras de un amoroso lance» de San Juan de la Cruz...");

  const trasAmorosoLanceText = `Tras de un amoroso lance
y no de esperanza falto
volé tan alto tan alto
que le di a la caza alcance.

Para que yo alcance diese
a aqueste lance divino
tanto volar me convino
que de vista me perdiese;
y con todo, en este trance,
en el vuelo quedé falto;
mas el amor fue tan alto,
que le di a la caza alcance.

Cuanto más alto subía,
deslumbróseme la vista;
y la más fuerte conquista
en oscuro se hacía;
mas, por ser de amor el lance,
di un ciego y oscuro salto
y fui tan alto, tan alto,
que le di a la caza alcance.

Cuanto más alto llegaba
de este lance tan subido
tanto más bajo y rendido
y abatido me hallaba.
Dije: No habrá quien alcance.
Abatíme tanto, tanto,
que fui tan alto, tan alto,
que le di a la caza alcance.

Por una extraña manera
mil vuelos pasé de un vuelo,
porque esperanza de cielo
tanto alcanza cuanto espera;
esperé solo este lance,
y en esperar no fui falto,
pues fui tan alto, tan alto,
que le di a la caza alcance.`;

  const fragTrasAmorosoLance = await prisma.fragment.create({
    data: {
      slug: "tras-de-un-amoroso-lance",
      title: "Tras de un amoroso lance",
      location: "Poesías",
      headline: "Volé tan alto, tan alto",
      text: trasAmorosoLanceText,
      order: 4,
      status: "published",
      featured: false,
      workId: poesiaSanJuanDeLaCruz.id,
      constellations: { connect: [{ slug: "amor" }, { slug: "fe" }] },
      topics: { connect: [{ slug: "mistica" }] },
      places: { connect: [{ slug: "fontiveros" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragTrasAmorosoLance.id,
        type: "contexto",
        order: 1,
        content: `Este poema usa la metáfora de la cetrería (el vuelo del halcón tras la presa) para describir el vuelo del alma hacia Dios. Es uno de los más excelsos de san Juan de la Cruz y uno de los más perfectos de toda la poesía española en la expresión de la paradoja mística.`,
      },
      {
        fragmentId: fragTrasAmorosoLance.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Redondillas (abba) con estribillo variable. Versos octosílabos. La regularidad métrica contrasta con la profundidad paradójica del contenido. El estribillo («que le di a la caza alcance») se repite al final de cada estrofa con leves variaciones («que le di…», «mas el amor fue tan alto, / que le di…», «y fui tan alto…», «pues fui tan alto…»).`,
      },
      {
        fragmentId: fragTrasAmorosoLance.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Metáfora de la cetrería: el alma como halcón que caza a Dios. La paradoja del vuelo inverso: cuanto más alto, más bajo; cuanto más se rinde, más conquista. El estribillo acumulativo crea un efecto de ascensión sostenida. «Abatíme tanto, tanto, / que fui tan alto, tan alto»: quiasmo de la rendición y el éxito místicos.`,
      },
      {
        fragmentId: fragTrasAmorosoLance.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `La paradoja mística en su forma más pura: el alma alcanza a Dios no mediante el esfuerzo sino mediante la rendición total. Esta es la síntesis de toda la teología mística sanjuanista: la vía del anonadamiento. El «vuelo ciego» —«di un ciego y oscuro salto»— es la imagen exacta de la fe sin apoyo racional.`,
      },
      {
        fragmentId: fragTrasAmorosoLance.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `La metáfora de la cetrería mística conecta con la tradición medieval de la caza del amor. El motivo del vuelo ciego hacia lo alto reaparecerá en poetas como Quevedo y en los místicos contemporáneos. San Juan es la culminación de la corriente mística española del siglo XVI.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Barroco (1/15): María de Zayas — Obras poéticas
  // ---------------------------------------------------------------------
  console.log("Creando autora «María de Zayas» y obra «Obras poéticas»...");

  const mariaDeZayas = await prisma.author.create({
    data: {
      slug: "maria-de-zayas",
      name: "María de Zayas y Sotomayor",
      birthYear: 1590,
      deathYear: 1661,
      country: "España",
      era: "Barroco",
      bio: `María de Zayas y Sotomayor (Madrid, 1590–h. 1661). Novelista, autora teatral y poeta. Sus Novelas ejemplares y amorosas (1637) y sus Desengaños amorosos (1647) contienen reivindicaciones feministas y pinceladas eróticas infrecuentes en la época. Fueron muy celebradas por el público femenino y plagiadas en Francia. Emilia Pardo Bazán las recuperó siglos después. Tan poco se sabe de su vida que algún experto llegó a dudar de su existencia, tesis hoy descartada.`,
    },
  });

  const obrasPoeticasZayas = await prisma.work.create({
    data: {
      slug: "obras-poeticas-maria-de-zayas",
      title: "Obras poéticas",
      year: 1621,
      era: "Barroco",
      genre: "Poesía lírica (soneto)",
      synopsis: `Poesías de María de Zayas, la escritora más notable del Barroco español junto a sor Juana Inés de la Cruz. Sus dos sonetos de tema amoroso reunidos aquí son complementarios: el primero define el amor como suma de contradicciones siguiendo el modelo de Lope; el segundo convierte los ojos en motivo obsesivo, siguiendo la tradición de Cetina.`,
      authorId: mariaDeZayas.id,
    },
  });

  const amarElDiaText = `Amar el día, aborrecer el día,
llamar la noche y despreciarla luego,
temer el fuego y acercarse al fuego,
tener a un tiempo pena y alegría.
Estar juntos valor y cobardía,
el desprecio cruel y el blando ruego,
tener valiente entendimiento ciego,
atada la razón, libre osadía.
Buscar lugar en que aliviar los males
y no querer del mal hacer mudanza,
desear sin saber qué se desea.
Tener el gusto y el disgusto iguales,
y todo el bien librado en la esperanza,
si aquesto no es amor, no sé qué sea.`;

  const fragAmarElDia = await prisma.fragment.create({
    data: {
      slug: "amar-el-dia-aborrecer-el-dia",
      title: "Amar el día, aborrecer el día",
      location: "Obras poéticas (soneto)",
      headline: "Si aquesto no es amor, no sé qué sea",
      text: amarElDiaText,
      order: 1,
      status: "published",
      featured: false,
      workId: obrasPoeticasZayas.id,
      constellations: { connect: [{ slug: "amor" }] },
      topics: { connect: [{ slug: "amor-cortes" }] },
      places: { connect: [{ slug: "madrid" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragAmarElDia.id,
        type: "contexto",
        order: 1,
        content: `El «soneto de definición de amor» es un subgénero del Barroco: Lope («Desmayarse, atreverse, estar furioso»), Villamediana, y María de Zayas lo practican. Todos coinciden en que el amor es una suma de contradicciones. Zayas añade su propio énfasis: la razón atada, la osadía libre.`,
      },
      {
        fragmentId: fragAmarElDia.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Soneto italiano en endecasílabos. Rima ABBA ABBA CDE DEC. El último verso —«si aquesto no es amor, no sé qué sea»— cierra el catálogo de contradicciones con una sentencia dubitativa que es en realidad la mayor de las afirmaciones.`,
      },
      {
        fragmentId: fragAmarElDia.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Enumeración de antítesis (amar/aborrecer, valor/cobardía). Oxímoron acumulado. El «valiente entendimiento ciego» es una de las paradojas más memorables del Barroco español.`,
      },
      {
        fragmentId: fragAmarElDia.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El amor como estado de incomprensión total: la razón no sirve, el deseo no sabe lo que desea, el bien y el mal se igualan. Una definición del amor como permanente irracionalidad.`,
      },
      {
        fragmentId: fragAmarElDia.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `El soneto forma parte de la tradición que inaugura Lope de Vega y que continúan Villamediana y sor Juana. El soneto «Que muera yo, Liseo» de la misma Zayas, también en esta colección, muestra su otra voz: más directamente erótica.`,
      },
    ],
  });

  const queMueraMeLiseoText = `Que muera yo, Liseo, por tus ojos,
y que gusten tus ojos de matarme;
que quiera con tus ojos alegrarme,
y tus ojos me den cien mil enojos.
Que rinda yo a tus ojos por despojos
mis ojos, y ellos en lugar de amarme
pudiendo con sus rayos alumbrarme,
las flores me convierten en abrojos.
Que me maten tus ojos con desdenes,
con rigores, con celo, con tibieza,
cuando mis ojos por tus ojos mueren.
¡Ay, dulce ingrato! que en los ojos tienes
tan grande deslealtad como belleza,
para unos ojos que a tus ojos quieren.`;

  const fragQueMueraMeLiseo = await prisma.fragment.create({
    data: {
      slug: "que-muera-yo-liseo-por-tus-ojos",
      title: "Que muera yo, Liseo, por tus ojos",
      location: "Obras poéticas (soneto)",
      headline: "En los ojos tienes tan grande deslealtad como belleza",
      text: queMueraMeLiseoText,
      order: 2,
      status: "published",
      featured: false,
      workId: obrasPoeticasZayas.id,
      constellations: { connect: [{ slug: "amor" }] },
      topics: { connect: [{ slug: "amor-cortes" }] },
      places: { connect: [{ slug: "madrid" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragQueMueraMeLiseo.id,
        type: "contexto",
        order: 1,
        content: `Este soneto forma parte de la tradición española de los ojos como motivo poético, que recorre toda la literatura desde el Cantar de mío Cid hasta Bécquer, pasando por Cetina, Hurtado de Mendoza y Lorca. Zayas aporta aquí su voz más directamente erótica.`,
      },
      {
        fragmentId: fragQueMueraMeLiseo.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Soneto italiano en endecasílabos. El poema está construido sobre la repetición de la palabra «ojos» en casi todos los versos: un tour de force técnico que convierte el motivo visual en obsesión.`,
      },
      {
        fragmentId: fragQueMueraMeLiseo.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Políptoton de «ojos» como motivo unificador. Anáfora de «que» en la primera parte. El contraste entre la mirada que ama y la mirada que destruye. La acumulación de sinónimos del maltrato amoroso (desdenes, rigores, celo, tibieza).`,
      },
      {
        fragmentId: fragQueMueraMeLiseo.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El amor como castigo recibido a través de la mirada. Los ojos del amado que matan mientras los de la amante mueren por ellos. La paradoja del amor no correspondido expresada a través del único canal que tienen: los ojos.`,
      },
      {
        fragmentId: fragQueMueraMeLiseo.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `Conecta directamente con Cetina («Ojos claros, serenos») y con las Rimas de Bécquer (Rima XIII, «Tu pupila es azul»), ambas en esta colección. La tradición de los ojos como agentes del amor y de la muerte atraviesa cinco siglos de poesía española.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Barroco (2/15): Leonor de la Cueva y Silva — Manuscrito poético
  // ---------------------------------------------------------------------
  console.log("Creando autora «Leonor de la Cueva y Silva» y obra «Manuscrito poético»...");

  const leonorDeLaCueva = await prisma.author.create({
    data: {
      slug: "leonor-de-la-cueva-y-silva",
      name: "Leonor de la Cueva y Silva",
      birthYear: 1611,
      deathYear: 1705,
      country: "España",
      era: "Barroco",
      bio: `Leonor de la Cueva y Silva (Medina del Campo, h. 1611–h. 1705). Poetisa y dramaturga vallisoletana de longevidad asombrosa. Era hija de una familia burguesa de la próspera Medina del Campo. Fue su hermano canónigo, Jerónimo, quien recopiló sus composiciones poéticas en un manuscrito. Escribió sonetos, octavas reales, liras, sextillas, romances y obras teatrales. Los dos primeros versos del primer terceto de este soneto son, en palabras del crítico José Ramón Fernández de Cano, «dignos de cualquiera de los poetas mayores de nuestros Siglos de Oro».`,
    },
  });

  const manuscritoPoético = await prisma.work.create({
    data: {
      slug: "manuscrito-poetico-leonor-de-la-cueva",
      title: "Manuscrito poético",
      year: 1635,
      era: "Barroco",
      genre: "Poesía lírica (soneto)",
      synopsis: `Recopilación manuscrita de poemas de Leonor de la Cueva y Silva realizada por su hermano Jerónimo. La poetisa permaneció casi desconocida durante siglos hasta la recuperación de las escritoras del Barroco español. Su soneto «Ni sé si muero» es una de las mejores piezas de la lógica negativa barroca.`,
      authorId: leonorDeLaCueva.id,
    },
  });

  const niSeSiMueroText = `Ni sé si muero ni si tengo vida,
ni estoy en mí ni fuera puedo hallarme;
ni en tanto olvido cuido de buscarme,
que estoy de pena y de dolor vestida.
Dame pesar el verme aborrecida,
y si me quieren doy en disgustarme;
ninguna cosa puede contentarme:
toda me enfada y deja desabrida.
Ni aborrezco, ni quiero, ni desamo;
ni desamo, ni quiero, ni aborrezco;
ni vivo confiada ni celosa.
Lo que desprecio a un tiempo adoro y amo:
¡vario portento en condición parezco!,
pues que me cansa toda humana cosa.`;

  const fragNiSeSiMuero = await prisma.fragment.create({
    data: {
      slug: "ni-se-si-muero",
      title: "Ni sé si muero",
      location: "Manuscrito poético (soneto)",
      headline: "Ni vivo confiada ni celosa",
      text: niSeSiMueroText,
      order: 1,
      status: "published",
      featured: false,
      workId: manuscritoPoético.id,
      constellations: { connect: [{ slug: "amor" }] },
      topics: { connect: [{ slug: "desengano" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragNiSeSiMuero.id,
        type: "contexto",
        order: 1,
        content: `Los dos primeros versos del primer terceto —«Ni aborrezco, ni quiero, ni desamo; / ni desamo, ni quiero, ni aborrezco»— son, en palabras del crítico José Ramón Fernández de Cano, «dignos de cualquiera de los poetas mayores de nuestros Siglos de Oro». Es uno de los grandes poemas desconocidos del Barroco español.`,
      },
      {
        fragmentId: fragNiSeSiMuero.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Soneto italiano en endecasílabos. Rima ABBA ABBA CDC DCD. El soneto es un ejemplo perfecto de la lógica negativa barroca: todo se define por lo que no es.`,
      },
      {
        fragmentId: fragNiSeSiMuero.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Anáfora de la negación («Ni… ni… ni»). El quiasmo perfecto del primer terceto: «Ni aborrezco, ni quiero, ni desamo; / ni desamo, ni quiero, ni aborrezco». La acumulación de estados contradictorios que se anulan mutuamente. El último verso como sentencia que engloba todo: «me cansa toda humana cosa».`,
      },
      {
        fragmentId: fragNiSeSiMuero.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `La inestabilidad del yo amoroso llevada al paroxismo: no sé si muero, no sé si vivo, no sé si amo, no sé si aborrezco. Un soneto sobre la incapacidad de sentir con claridad, sobre la fatiga existencial ante el amor y el mundo.`,
      },
      {
        fragmentId: fragNiSeSiMuero.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `El último verso —«pues que me cansa toda humana cosa»— evoca al mejor Quevedo filósofo y moral. «Lo que desprecio a un tiempo adoro y amo» anticipa la dialéctica de sor Juana Inés de la Cruz. Es uno de los grandes poemas desconocidos del Barroco español.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Barroco (3/15): Góngora — Letrillas y Sátiras
  // ---------------------------------------------------------------------
  console.log("Creando obras «Letrillas» y «Sátiras» de Góngora...");

  const letrillasGongora = await prisma.work.create({
    data: {
      slug: "letrillas-gongora",
      title: "Letrillas",
      year: 1601,
      era: "Barroco",
      genre: "Poesía lírica (letrilla satírica)",
      synopsis: `Letrillas satíricas de Góngora que muestran al autor en su vena más popular y corrosiva, bien distante de la oscuridad culterana de sus poemas mayores. «Dineros son calidad» es la más incisiva de sus sátiras sociales.`,
      authorId: gongora.id,
    },
  });

  const dinerosSonCalidadText = `Dinero son calidad
¡Verdad!
Más ama quien más suspira
¡Mentira!
Cruzados hacen cruzados,
escudos pintan escudos,
y tahúres muy desnudos
con dados ganan condados;
ducados dejan ducados,
y coronas majestad,
¡Verdad!
Pensar que uno sólo es dueño
de puerta de muchas llaves,
y afirmar que penas graves
las paga un mirar risueño,
y entender que no son sueño
las promesas de Marfira,
¡Mentira!
Todo se vende este día,
todo el dinero lo iguala;
la corte vende su gala,
la guerra su valentía;
hasta la sabiduría
vende la Universidad,
¡Verdad!`;

  const fragDinerosSonCalidad = await prisma.fragment.create({
    data: {
      slug: "dineros-son-calidad",
      title: "Dineros son calidad",
      location: "Letrillas (1601)",
      headline: "Todo se vende este día, todo el dinero lo iguala",
      text: dinerosSonCalidadText,
      order: 1,
      status: "published",
      featured: false,
      workId: letrillasGongora.id,
      constellations: { connect: [{ slug: "poder" }, { slug: "critica-social" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragDinerosSonCalidad.id,
        type: "contexto",
        order: 1,
        content: `Hay dos Góngoras: el de los poemas mayores (Soledades, Polifemo), complejos y oscuros, y el de los poemas menores (romances, letrillas, sonetos), accesibles y brillantes. Esta letrilla de 1601 pertenece al segundo grupo: sátira social corrosiva con estructura binaria de ¡Verdad! / ¡Mentira!`,
      },
      {
        fragmentId: fragDinerosSonCalidad.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Letrilla: composición en estrofas de arte menor (octosílabos) con estribillo alternante (¡Verdad! / ¡Mentira!). La estructura binaria permite la alternancia entre lo que es verdad (el poder del dinero) y lo que es mentira (el amor idealizado).`,
      },
      {
        fragmentId: fragDinerosSonCalidad.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Políptoton del dinero: cruzados, escudos, ducados, coronas —cada moneda con doble significado (dinero y símbolo de poder). La acumulación de ventas en la tercera estrofa es el clímax de la denuncia. El estribillo como veredicto moral.`,
      },
      {
        fragmentId: fragDinerosSonCalidad.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El dinero como único valor real en la España de la decadencia imperial. Todo se vende: la nobleza, la guerra, la sabiduría. La letrilla es el gran poema satírico del Barroco sobre la venalidad universal.`,
      },
      {
        fragmentId: fragDinerosSonCalidad.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `La letrilla de Góngora y la de Quevedo («Poderoso caballero es don Dinero») son los dos grandes poemas satíricos del Barroco sobre el dinero. La redondilla de Góngora contra Quevedo y Lope, también en esta colección, muestra su faceta más mordaz.`,
      },
    ],
  });

  const satirasGongora = await prisma.work.create({
    data: {
      slug: "satiras-gongora",
      title: "Sátiras",
      year: 1622,
      era: "Barroco",
      genre: "Poesía satírica (redondilla)",
      synopsis: `Sátiras de Góngora, muchas de ellas escritas como respuesta a sus rivales literarios. Su redondilla contra Quevedo y Lope es una de las piezas más ingeniosas de la polémica literaria del Barroco español.`,
      authorId: gongora.id,
    },
  });

  const redondillaContraQuevedoText = `Hoy hacen amistad nueva
más por Baco que por Febo
don Francisco de Quebebo
y Félix Lope de Beba.`;

  const fragRedondillaContraQuevedo = await prisma.fragment.create({
    data: {
      slug: "redondilla-contra-quevedo-y-lope",
      title: "Redondilla contra Quevedo y Lope",
      location: "Sátiras",
      headline: "Más por Baco que por Febo",
      text: redondillaContraQuevedoText,
      order: 1,
      status: "published",
      featured: false,
      workId: satirasGongora.id,
      constellations: { connect: [{ slug: "critica-social" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragRedondillaContraQuevedo.id,
        type: "contexto",
        order: 1,
        content: `La enemistad literaria entre Góngora, Quevedo y Lope es uno de los episodios más ricos y divertidos de la historia de la literatura española. Se intercambiaron pullas durante décadas. Góngora llama «Quebebo» a Quevedo (borracho) y «Lope de Beba» a Lope (también borracho), insinuando que su amistad se basa más en el vino que en la poesía.`,
      },
      {
        fragmentId: fragRedondillaContraQuevedo.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Redondilla: cuatro versos octosílabos con rima consonante abba.`,
      },
      {
        fragmentId: fragRedondillaContraQuevedo.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Juego de palabras con los nombres propios: Quevedo → Quebebo (de «beber»), Lope → Lope de Beba (de «beber» también). Alusión mitológica (Baco vs. Febo) que contrasta taberna con poesía.`,
      },
      {
        fragmentId: fragRedondillaContraQuevedo.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `La sátira personal como arma literaria. La enemistad literaria del Barroco expresada con humor e ingenio en cuatro versos.`,
      },
      {
        fragmentId: fragRedondillaContraQuevedo.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `Esta redondilla es la respuesta de Góngora a la coalición de sus dos grandes rivales. La enemistad Góngora-Quevedo produjo algunos de los mejores poemas satíricos del Siglo de Oro.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Barroco (4/15): Quevedo — Obras poéticas
  // ---------------------------------------------------------------------
  console.log("Creando obra «Obras poéticas» de Quevedo...");

  const obrasPoeticasQuevedo = await prisma.work.create({
    data: {
      slug: "obras-poeticas-quevedo",
      title: "Obras poéticas",
      year: 1648,
      era: "Barroco",
      genre: "Poesía lírica (letrilla y soneto)",
      synopsis: `Conjunto de poemas satíricos, burlescos y morales de Quevedo que completa el retrato del autor: la letrilla «Poderoso caballero es don Dinero» es su diagnóstico económico del Imperio; el soneto «A un hombre de gran nariz», su arma humorística contra un rival; la «Epístola satírico-censoria», su gesto de libertad cívica más audaz.`,
      authorId: quevedo.id,
    },
  });

  const poderosoCaballeroText = `Madre, yo al oro me humillo,
él es mi amante y mi amado,
pues de puro enamorado
de continuo anda amarillo.
Que pues doblón o sencillo
hace todo cuanto quiero,
poderoso caballero
es don Dinero.
Nace en las Indias honrado,
donde el mundo le acompaña;
viene a morir en España
y es en Génova enterrado.
Y pues quien le trae al lado
es hermoso, aunque sea fiero,
poderoso caballero
es don Dinero.
Es Galán y es como un oro,
tiene quebrado el color;
persona de gran valor
tan cristiano como moro;
pues que da y quita el decoro
y quebranta cualquier fuero,
poderoso caballero
es don Dinero.
Son sus padres principales,
y es de nobles descendiente,
pues que en las venas de Oriente
todas las sangres son reales.
Y pues es quien hace iguales
al duque y al ganadero,
poderoso caballero
es don Dinero.`;

  const fragPoderosoText = await prisma.fragment.create({
    data: {
      slug: "poderoso-caballero-es-don-dinero",
      title: "Poderoso caballero es don Dinero",
      location: "Obras poéticas (letrilla satírica)",
      headline: "Poderoso caballero es don Dinero",
      text: poderosoCaballeroText,
      order: 1,
      status: "published",
      featured: false,
      workId: obrasPoeticasQuevedo.id,
      constellations: { connect: [{ slug: "poder" }, { slug: "critica-social" }] },
      places: { connect: [{ slug: "madrid" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragPoderosoText.id,
        type: "contexto",
        order: 1,
        content: `Esta es una de las composiciones satíricas más célebres no solo de Quevedo sino de la literatura en español en general. El estribillo «poderoso caballero es don Dinero» ha pasado al acervo popular de uso común para millones de hispanohablantes durante más de cuatro siglos.`,
      },
      {
        fragmentId: fragPoderosoText.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Letrilla: octosílabos con estribillo de dos versos fijo al final de cada estrofa. El estribillo condensa el mensaje moral: el dinero es un caballero más poderoso que cualquier noble.`,
      },
      {
        fragmentId: fragPoderosoText.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Personificación del dinero como galán enamorado (amarillo de amor). Ironía sostenida: el dinero recibe el tratamiento del amor cortés. Historia biográfica del oro: nace en las Indias, muere en España, se entierra en Génova (los banqueros genoveses controlaban las finanzas del Imperio).`,
      },
      {
        fragmentId: fragPoderosoText.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El dinero como único valor real en la España imperial en decadencia. El oro americano que llega a España y acaba en manos de los banqueros genoveses: la radiografía económica del Imperio en cuatro estrofas. El dinero iguala al duque y al ganadero.`,
      },
      {
        fragmentId: fragPoderosoText.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `La letrilla de Góngora «Dineros son calidad» es su contraparte. Ambas son el gran diagnóstico poético de la economía española del siglo XVII. El «poderoso caballero es don Dinero» sigue usándose hoy como proverbio.`,
      },
    ],
  });

  const granNarizText = `Érase un hombre a una nariz pegado,
érase una nariz superlativa,
érase una alquitara medio viva,
érase un peje espada mal barbado;
Era un reloj de sol mal encarado.
Érase un elefante boca arriba,
érase una nariz sayón y escriba,
un Ovidio Nasón mal narigado.
Érase el espolón de una galera,
érase una pirámide de Egito,
las doce tribus de narices era;
érase un naricísimo infinito,
frisón archinariz, caratulera,
sabañón garrafal morado y frito.`;

  const fragGranNariz = await prisma.fragment.create({
    data: {
      slug: "a-un-hombre-de-gran-nariz",
      title: "A un hombre de gran nariz",
      location: "Obras poéticas (soneto burlesco)",
      headline: "Érase un naricísimo infinito",
      text: granNarizText,
      order: 2,
      status: "published",
      featured: false,
      workId: obrasPoeticasQuevedo.id,
      constellations: { connect: [{ slug: "critica-social" }] },
      places: { connect: [{ slug: "madrid" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragGranNariz.id,
        type: "contexto",
        order: 1,
        content: `El soneto burlesco sobre defectos físicos es un género que viene de los epigramas latinos de Marcial. Quevedo fue su maestro indiscutible en castellano. Hay quien cree que el narigudo al que Quevedo fustigaba era Góngora, con quien mantuvo una famosa enemistad literaria.`,
      },
      {
        fragmentId: fragGranNariz.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Soneto italiano en endecasílabos. El recurso de la anáfora («Érase… érase…») convierte el soneto en una acumulación de comparaciones hiperbólicas que no cesa.`,
      },
      {
        fragmentId: fragGranNariz.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Anáfora de «érase». Acumulación de metáforas hiperbólicas que van de lo técnico (alquitara, espolón) a lo monumental (pirámide de Egipto) pasando por lo mítico (Ovidio Nasón). El neologismo «naricísimo» como cumbre del proceso.`,
      },
      {
        fragmentId: fragGranNariz.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `La hipérbole burlesca llevada al absurdo: la nariz que supera cualquier medida conocida. El humor grotesco quevedesco en su máxima expresión.`,
      },
      {
        fragmentId: fragGranNariz.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `El soneto influyó en Cyrano de Bergerac de Rostand (1897). La tradición del retrato grotesco conecta con los Caprichos de Goya y con el esperpento de Valle-Inclán.`,
      },
    ],
  });

  const epistolaSatiricoText = `No he de callar, por más que con el dedo,
ya tocando la boca, ya la frente,
silencio avises o amenaces miedo.
¿No ha de haber un espíritu valiente?
¿Siempre se ha de sentir lo que se dice?
¿Nunca se ha de decir lo que se siente?`;

  const fragEpistolaSatirico = await prisma.fragment.create({
    data: {
      slug: "no-he-de-callar-epistola-fragmento",
      title: "Epístola satírico-censoria al conde-duque (fragmento inicial)",
      location: "Obras poéticas (epístola en tercetos)",
      headline: "¿Nunca se ha de decir lo que se siente?",
      text: epistolaSatiricoText,
      order: 3,
      status: "published",
      featured: false,
      workId: obrasPoeticasQuevedo.id,
      constellations: { connect: [{ slug: "poder" }, { slug: "critica-social" }] },
      places: { connect: [{ slug: "madrid" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragEpistolaSatirico.id,
        type: "contexto",
        order: 1,
        content: `Los tres versos iniciales han pasado al acervo popular como símbolo de la libertad de expresión y la valentía cívica. Son quizás los versos más políticos de toda la literatura española. La Epístola está dirigida al conde-duque de Olivares, valido de Felipe IV; se cree que le costó a Quevedo el encarcelamiento en San Marcos de León (1639–1643).`,
      },
      {
        fragmentId: fragEpistolaSatirico.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Tercetos encadenados (terza rima): estrofas de tres endecasílabos con rima ABA BCB CDC... El encadenamiento crea un flujo continuo e imparable que refuerza la denuncia.`,
      },
      {
        fragmentId: fragEpistolaSatirico.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Apóstrofe implícito al poder que impone silencio. La triple pregunta retórica con quiasmo: «sentir lo que se dice / decir lo que se siente». La valentía como argumento poético.`,
      },
      {
        fragmentId: fragEpistolaSatirico.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `La libertad de expresión como deber moral. El poeta como conciencia crítica de su tiempo. Quevedo pagó con la cárcel su valentía.`,
      },
      {
        fragmentId: fragEpistolaSatirico.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `El gesto de señalar con el dedo para imponer silencio reaparece en los Caprichos de Goya. El conde de Villamediana, en sus sátiras también incluidas en esta colección, ejerció la misma valentía con consecuencias aún más graves: la muerte.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Barroco (5/15): Sor Juana Inés de la Cruz
  // ---------------------------------------------------------------------
  console.log("Creando autora «Sor Juana Inés de la Cruz» y obras...");

  const sorJuana = await prisma.author.create({
    data: {
      slug: "sor-juana-ines-de-la-cruz",
      name: "Sor Juana Inés de la Cruz",
      birthYear: 1648,
      deathYear: 1695,
      country: "México",
      era: "Barroco",
      bio: `Juana Inés de Asbaje Ramírez de Santillana (Nueva España [México], h. 1648 o 1651–1695). La mayor poeta de la lengua española del siglo XVII. Niña prodigio: ganó un premio literario a los ocho años. Se hizo monja jerónima para ser más libre. En su celda reunió 4.000 libros, instrumentos musicales, mapas y aparatos científicos. Murió de epidemia a los 44 años, dos años después de dejar de escribir, quizás por presión eclesiástica.`,
    },
  });

  const redondillasWork = await prisma.work.create({
    data: {
      slug: "redondillas-sor-juana",
      title: "Redondillas",
      year: 1689,
      era: "Barroco",
      genre: "Poesía lírica (redondillas)",
      synopsis: `Las redondillas «Hombres necios que acusáis» son el poema feminista más famoso de la literatura en español. Escritas en el siglo XVII, su desmontaje de la doble moral masculina con una lógica impecable las hace parecer contemporáneas.`,
      authorId: sorJuana.id,
    },
  });

  const hombresNeciosText = `Hombres necios que acusáis
a la mujer sin razón,
sin ver que sois la ocasión
de lo mismo que culpáis:
si con ansia sin igual
solicitáis su desdén,
¿por qué queréis que obren bien
si las incitáis al mal?`;

  const fragHombresNecios = await prisma.fragment.create({
    data: {
      slug: "hombres-necios-que-acusais",
      title: "Hombres necios que acusáis (fragmento)",
      location: "Redondillas, estrofas 1-2",
      headline: "Sin ver que sois la ocasión de lo mismo que culpáis",
      text: hombresNeciosText,
      order: 1,
      status: "published",
      featured: false,
      workId: redondillasWork.id,
      constellations: { connect: [{ slug: "poder" }, { slug: "critica-social" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragHombresNecios.id,
        type: "contexto",
        order: 1,
        content: `Las redondillas «Hombres necios» son el poema feminista más famoso de la literatura en español. Fueron escritas en el siglo XVII pero parecen escritas hoy. Sor Juana desmonta la doble moral masculina con una lógica impecable. El poema completo tiene 16 redondillas; este fragmento recoge las dos primeras.`,
      },
      {
        fragmentId: fragHombresNecios.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Redondillas: cuatro versos octosílabos con rima abba. El poema completo tiene 16 redondillas. La sencillez métrica contrasta con la agudeza argumentativa.`,
      },
      {
        fragmentId: fragHombresNecios.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Argumento lógico sostenido con ironía. La pregunta retórica como arma principal. El paralelismo entre acusación y causa: «la ocasión de lo mismo que culpáis».`,
      },
      {
        fragmentId: fragHombresNecios.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `La doble moral de género: los hombres culpan a las mujeres de lo que ellos mismos provocan. Un argumento feminista del siglo XVII de una modernidad asombrosa.`,
      },
      {
        fragmentId: fragHombresNecios.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `Florencia Pinar (siglo XV) y Carolina Coronado (siglo XIX), ambas en esta colección, son los otros dos grandes hitos de la reivindicación femenina en nuestra poesía.`,
      },
    ],
  });

  const sonetosSorJuanaWork = await prisma.work.create({
    data: {
      slug: "sonetos-sor-juana",
      title: "Sonetos",
      year: 1689,
      era: "Barroco",
      genre: "Poesía lírica (soneto)",
      synopsis: `Sonetos de sor Juana Inés de la Cruz, la mayor sonetista de la lengua española del siglo XVII. «Al que ingrato me deja» lleva la paradoja del amor a la perfección arquitectónica; «Este que ves, engaño colorido» convierte su propio retrato en una meditación sobre la vanitas.`,
      authorId: sorJuana.id,
    },
  });

  const alQueIngratoText = `Al que ingrato me deja, busco amante;
al que amante me sigue, dejo ingrata;
constante adoro a quien mi amor maltrata;
maltrato a quien mi amor busca constante.
Al que trato de amor, hallo diamante,
y soy diamante al que de amor me trata;
triunfante quiero ver al que me mata,
y mato al que me quiere ver triunfante.
Si a éste pago, padece mi deseo;
si ruego a aquél, mi pundonor enojo:
de entrambos modos infeliz me veo.
Pero yo, por mejor partido, escojo
de quien no quiero, ser violento empleo,
que, de quien no me quiere, vil despojo.`;

  const fragAlQueIngrato = await prisma.fragment.create({
    data: {
      slug: "al-que-ingrato-me-deja",
      title: "Al que ingrato me deja",
      location: "Sonetos",
      headline: "Prefiero ser violento empleo que vil despojo",
      text: alQueIngratoText,
      order: 1,
      status: "published",
      featured: false,
      workId: sonetosSorJuanaWork.id,
      constellations: { connect: [{ slug: "amor" }] },
      topics: { connect: [{ slug: "desengano" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragAlQueIngrato.id,
        type: "contexto",
        order: 1,
        content: `Este es uno de los sonetos más perfectos de sor Juana y de toda la poesía barroca. Plantea la paradoja del amor no correspondido con una lógica tan precisa que parece un teorema matemático. Toma el modelo de Lope de Vega y lo lleva a su máxima perfección.`,
      },
      {
        fragmentId: fragAlQueIngrato.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Soneto italiano en endecasílabos. Los dos cuartetos son un sistema de espejos: cada verso tiene su imagen invertida en el siguiente.`,
      },
      {
        fragmentId: fragAlQueIngrato.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Quiasmo sostenido durante dos cuartetos: «busco amante / dejo ingrata», «constante adoro / maltrato». Antítesis perfecta. El diamante como metáfora de la dureza mutua. La resolución pragmática del último terceto.`,
      },
      {
        fragmentId: fragAlQueIngrato.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `La paradoja del deseo: siempre se desea lo que no se tiene y se rechaza lo que se ofrece. La resolución final —prefiero ser «violento empleo» de quien no quiero que «vil despojo» de quien no me quiere— es una afirmación de la dignidad.`,
      },
      {
        fragmentId: fragAlQueIngrato.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `Diego Hurtado de Mendoza había anticipado la paradoja en su Canción («si quieres a quien te deja / y dejas a quien te quiere»). Sor Juana la convierte en arquitectura perfecta. El soneto influyó en toda la poesía amorosa hispanoamericana.`,
      },
    ],
  });

  const esteQueVesText = `Este que ves, engaño colorido,
que, del arte ostentando los primores,
con falsos silogismos de colores
es cauteloso engaño del sentido;
éste, en quien la lisonja ha pretendido
excusar de los años los horrores,
y venciendo del tiempo los rigores
triunfar de la vejez y del olvido,
es un vano artificio del cuidado,
es una flor al viento delicada,
es un resguardo inútil para el hado:
es una necia diligencia errada,
es un afán caduco y, bien mirado,
es cadáver, es polvo, es sombra, es nada.`;

  const fragEsteQueVes = await prisma.fragment.create({
    data: {
      slug: "este-que-ves-engano-colorido",
      title: "Este que ves, engaño colorido",
      location: "Sonetos",
      headline: "Es cadáver, es polvo, es sombra, es nada",
      text: esteQueVesText,
      order: 2,
      status: "published",
      featured: false,
      workId: sonetosSorJuanaWork.id,
      constellations: { connect: [{ slug: "muerte" }, { slug: "paso-del-tiempo" }] },
      topics: { connect: [{ slug: "contemptus-mundi" }, { slug: "desengano" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragEsteQueVes.id,
        type: "contexto",
        order: 1,
        content: `El soneto al retrato propio es un subgénero barroco que reflexiona sobre la ilusión de la pintura. Sor Juana usa su propio retrato como pretexto para una reflexión sobre la vanitas: la belleza pintada es tan efímera como la real.`,
      },
      {
        fragmentId: fragEsteQueVes.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Soneto italiano en endecasílabos. La acumulación de «es un…» en los dos tercetos crea un crescendo de negaciones que culmina en el cuádruple «es cadáver, es polvo, es sombra, es nada»: el verso más célebre de sor Juana.`,
      },
      {
        fragmentId: fragEsteQueVes.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Enumeración descendente: vano artificio → flor al viento → resguardo inútil → necia diligencia → afán caduco → cadáver → polvo → sombra → nada. Cuatro grados de negación en un solo verso final.`,
      },
      {
        fragmentId: fragEsteQueVes.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `La vanitas barroca en su forma más perfecta: la belleza, el arte, el retrato son ilusiones que no pueden vencer al tiempo. «Es cadáver, es polvo, es sombra, es nada» es la síntesis más poderosa de la filosofía del desengaño.`,
      },
      {
        fragmentId: fragEsteQueVes.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `El último verso dialoga directamente con el soneto de Góngora sobre la caducidad («en tierra, en humo, en polvo, en sombra, en nada»). Conecta también con Las Meninas de Velázquez: el cuadro que reflexiona sobre la representación.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Barroco (6/15): Conde de Villamediana — Sátiras
  // ---------------------------------------------------------------------
  console.log("Creando autor «Conde de Villamediana» y obra «Sátiras»...");

  const villamediana = await prisma.author.create({
    data: {
      slug: "conde-de-villamediana",
      name: "Juan de Tassis, conde de Villamediana",
      birthYear: 1582,
      deathYear: 1622,
      country: "España",
      era: "Barroco",
      bio: `Juan de Tassis y Peralta, conde de Villamediana (Lisboa, 1582–Madrid, 1622). Noble de rancio abolengo, correo mayor del reino, poeta culterano discípulo de Góngora, pendenciero y dandy. Murió asesinado a cuchilladas en la calle Mayor de Madrid cuando regresaba de palacio. Nadie fue juzgado. Se sospechó del rey, de sus acreedores y de los maridos burlados. Es considerado el creador de la sátira política española.`,
    },
  });

  const satirasVillamediana = await prisma.work.create({
    data: {
      slug: "satiras-villamediana",
      title: "Sátiras",
      year: 1634,
      era: "Barroco",
      genre: "Poesía satírica (letrilla y décima)",
      synopsis: `Sátiras del conde de Villamediana, considerado el creador de la sátira política española. Sus versos señalan con nombre y apellido: la «Procesión» lleva en cortejo público a los corruptos de la Corte de Felipe IV. La décima anónima sobre su propia muerte, escrita por otro, cierra el ciclo con el humor negro de quien sabe que el poeta satírico paga con la vida.`,
      authorId: villamediana.id,
    },
  });

  const procesionText = `¡Dilín, dilón,
que pasa la procesión!
No será sin gran concierto,
viendo hurtar tan excesivo,
remedie Felipe el vivo
lo que no remedió el muerto.
Todos tengan por muy cierto
que no ha de quedar ladrón
que no salga en el padrón
que hoy hace Felipe cuarto,
viéndose así, sin un cuarto,
y otros con casa y torreón.
¡Dilín, dilón!
La procesión se comienza
de privados alevosos,
de ministros codiciosos
y hombres de poca conciencia.
No hay sino prestar paciencia:
todo falsario y ladrón
a destierro y privación.
Con tan enormes delitos
no es mucho todos den gritos.
Obedecer, y chitón.
¡Dilín, dilón!`;

  const fragProcesion = await prisma.fragment.create({
    data: {
      slug: "procesion-satirica-a-felipe-iv",
      title: "Procesión",
      location: "Sátiras",
      headline: "¡Dilín, dilón, que pasa la procesión!",
      text: procesionText,
      order: 1,
      status: "published",
      featured: false,
      workId: satirasVillamediana.id,
      constellations: { connect: [{ slug: "poder" }, { slug: "critica-social" }] },
      places: { connect: [{ slug: "madrid" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragProcesion.id,
        type: "contexto",
        order: 1,
        content: `Villamediana es considerado el creador de la sátira política española. Sus versos no insinúan: señalan con nombre y apellido. Los versos le costaron varios destierros y, según algunos, la vida.`,
      },
      {
        fragmentId: fragProcesion.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Letrilla con estribillo onomatopéyico (¡Dilín, dilón!). El son de campanas como ritmo de procesión burlesca. Décimas con estribillo.`,
      },
      {
        fragmentId: fragProcesion.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `El estribillo onomatopéyico de campanas convierte la sátira política en procesión de penitentes. La lista de ladrones como procesión pública. El juego de palabras: «sin un cuarto» (sin dinero) referido al rey Felipe «cuarto».`,
      },
      {
        fragmentId: fragProcesion.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `La corrupción sistémica de la Corte española al inicio del reinado de Felipe IV. El poeta le pide al nuevo rey que remedie lo que el muerto (Felipe III) no remedió. Una procesión de ladrones que desfilan ante el rey.`,
      },
      {
        fragmentId: fragProcesion.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `La tradición de la sátira política en verso que inaugura Villamediana continuará con los esperpentes de Valle-Inclán y con la copla política. La décima anónima sobre su propia muerte, también en esta colección, muestra cómo la Corte veía el crimen.`,
      },
    ],
  });

  const decimaAnonimaText = `—Mentidero de Madrid,
decidnos, ¿quién mató al Conde?
—Ni se sabe ni se esconde:
sin discurso discurrid.
—¿Dicen que lo mató el Cid
por ser el Conde lozano?
—¡Disparate chabacano!
La verdad del caso ha sido
que el matador fue Bellido
y el impulso soberano.`;

  const fragDecimaAnonima = await prisma.fragment.create({
    data: {
      slug: "decima-anonima-sobre-la-muerte-de-villamediana",
      title: "Décima anónima sobre la muerte del Conde de Villamediana",
      location: "Anónimo (circuló en la corte de Felipe IV)",
      headline: "El matador fue Bellido y el impulso soberano",
      text: decimaAnonimaText,
      order: 2,
      status: "published",
      featured: false,
      workId: satirasVillamediana.id,
      constellations: { connect: [{ slug: "poder" }, { slug: "critica-social" }] },
      places: { connect: [{ slug: "madrid" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragDecimaAnonima.id,
        type: "contexto",
        order: 1,
        content: `La décima circuló anónima por la corte de Felipe IV tras el asesinato del conde de Villamediana, el 21 de agosto de 1622. El crimen nunca fue resuelto. El «Mentidero de Madrid» era la plaza donde se difundían los rumores de la Corte.`,
      },
      {
        fragmentId: fragDecimaAnonima.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Décima o espinela: diez versos octosílabos. La forma es perfecta para la agilidad dialogística.`,
      },
      {
        fragmentId: fragDecimaAnonima.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Diálogo entre el «Mentidero» y una voz interrogadora. Los dos últimos versos son la clave: «el matador fue Bellido / y el impulso soberano» — alusión a Bellido Dolfos, el asesino del rey Sancho II por encargo (supuesto) de Alfonso VI.`,
      },
      {
        fragmentId: fragDecimaAnonima.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `La especulación sobre un crimen de Estado. El humor negro de la Corte que especula sobre quién mató al poeta satírico. La insinuación de que fue el rey («el impulso soberano») sin nombrarlo.`,
      },
      {
        fragmentId: fragDecimaAnonima.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `El nombre de «Bellido» conecta directamente con el Romance del rey don Sancho, donde Bellido Dolfos mata al rey Sancho II. La alusión es intencionada y peligrosa.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Barroco (7/15): Baltasar del Alcázar — Obras poéticas
  // ---------------------------------------------------------------------
  console.log("Creando autor «Baltasar del Alcázar» y obra «Obras poéticas»...");

  const baltasarDelAlcazar = await prisma.author.create({
    data: {
      slug: "baltasar-del-alcazar",
      name: "Baltasar del Alcázar",
      birthYear: 1530,
      deathYear: 1606,
      country: "España",
      era: "Barroco",
      bio: `Baltasar del Alcázar (Sevilla, 1530–Ronda, 1606). Soldado de larga trayectoria y poeta inédito en vida. Un manuscrito con sus poemas confeccionado por su amigo el pintor Francisco Pacheco —maestro y suegro de Velázquez— lo lanzó a un estrellato póstumo. Lo alabaron Cervantes, Gracián, Quevedo, Lope y Góngora. El gran poeta del epigrama festivo y hedonista del Siglo de Oro.`,
    },
  });

  const obrasPoeticasAlcazar = await prisma.work.create({
    data: {
      slug: "obras-poeticas-alcazar",
      title: "Obras poéticas",
      year: 1606,
      era: "Barroco",
      genre: "Poesía lírica (epigrama festivo)",
      synopsis: `Obra póstuma de Baltasar del Alcázar, el gran maestro del epigrama festivo en castellano. Sus epigramas sobre el teñido del cabello, la comida, la bebida y las costumbres forman un cuadro costumbrista de enorme riqueza, en la tradición de Marcial.`,
      authorId: baltasarDelAlcazar.id,
    },
  });

  const aInesText = `Tus cabellos, estimados
por oro contra razón,
ya se sabe, Inés, que son
de plata sobredorados.
Pues ¿querrás que se celebre
por verdad lo que no es?
Dar plata por oro, Inés,
es vender gato por liebre.`;

  const fragAInes = await prisma.fragment.create({
    data: {
      slug: "a-ines-que-se-tenia-las-canas-de-rubio",
      title: "A Inés, que se teñía las canas de rubio",
      location: "Obras poéticas (epigrama)",
      headline: "Dar plata por oro es vender gato por liebre",
      text: aInesText,
      order: 1,
      status: "published",
      featured: false,
      workId: obrasPoeticasAlcazar.id,
      constellations: { connect: [{ slug: "critica-social" }] },
      places: { connect: [{ slug: "sevilla" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragAInes.id,
        type: "contexto",
        order: 1,
        content: `El epigrama es una composición poética muy breve que expresa un solo pensamiento ingenioso o satírico con gran precisión y agudeza. Baltasar del Alcázar fue su maestro en el Siglo de Oro, siguiendo la tradición de Marcial.`,
      },
      {
        fragmentId: fragAInes.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Dos redondillas (abba / cddc). Ocho versos octosílabos. La brevedad es esencial: el epigrama debe decirlo todo en el mínimo espacio.`,
      },
      {
        fragmentId: fragAInes.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Juego de palabras entre oro/plata (metales nobles) y oro/plata (colores del cabello). El refrán final («vender gato por liebre») como sentencia popular que cierra el argumento con humor.`,
      },
      {
        fragmentId: fragAInes.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `La vanidad del afeite (del maquillaje y la tintura) como engaño. La crítica a la mujer que disimula su edad con el tinte. Un tema eterno tratado con humor ligero y sin crueldad.`,
      },
      {
        fragmentId: fragAInes.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `El poema de los Argensola «A una mujer que se afeitaba y estaba hermosa» trata el mismo tema con mayor complejidad filosófica. Samaniego, en el siglo siguiente, cultivará también el epigrama festivo.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Barroco (8/15): Argensola — Rimas
  // ---------------------------------------------------------------------
  console.log("Creando autor «Argensola» y obra «Rimas»...");

  const argensola = await prisma.author.create({
    data: {
      slug: "argensola",
      name: "Argensola (atrib.)",
      birthYear: 1561,
      deathYear: 1631,
      country: "España",
      era: "Barroco",
      bio: `Lupercio Leonardo de Argensola (1559–1613) y Bartolomé Leonardo de Argensola (1561–1631), hermanos aragoneses de Barbastro. Ambos fueron empleados cortesanos, admiradores de Horacio y Marcial, y sonetistas técnicamente perfectos. El soneto «A una mujer que se afeitaba» es atribuido a uno de los dos —la mayoría de expertos lo da a Bartolomé—, publicado junto en 1634 sin indicar la autoría.`,
    },
  });

  const rimasArgensola = await prisma.work.create({
    data: {
      slug: "rimas-argensola",
      title: "Rimas (Gabriel Leonardo)",
      year: 1634,
      era: "Barroco",
      genre: "Poesía lírica (soneto)",
      synopsis: `Edición de las rimas de los hermanos Argensola publicada por el hijo de Lupercio, Gabriel Leonardo, en 1634. Incluye el célebre soneto «A una mujer que se afeitaba y estaba hermosa», cuya autoría sigue siendo disputada.`,
      authorId: argensola.id,
    },
  });

  const aUnaMujerText = `Yo os quiero confesar, don Juan, primero,
que aquel blanco y color de doña Elvira
no tiene de ella más, si bien se mira,
que el haberle costado su dinero.
Pero tras eso confesaros quiero
que es tanta la beldad de su mentira,
que en vano a competir con ella aspira
belleza igual de rostro verdadero.
Mas ¿qué mucho que yo perdido ande
por un engaño tal, pues que sabemos
que nos engaña así Naturaleza?
Porque ese cielo azul que todos vemos,
ni es cielo ni es azul. ¡Lástima grande
que no sea verdad tanta belleza!`;

  const fragAUnaMujer = await prisma.fragment.create({
    data: {
      slug: "a-una-mujer-que-se-afeitaba-y-estaba-hermosa",
      title: "A una mujer que se afeitaba y estaba hermosa",
      location: "Rimas (Gabriel Leonardo, 1634)",
      headline: "Lástima grande que no sea verdad tanta belleza",
      text: aUnaMujerText,
      order: 1,
      status: "published",
      featured: false,
      workId: rimasArgensola.id,
      constellations: { connect: [{ slug: "paso-del-tiempo" }] },
      topics: { connect: [{ slug: "contemptus-mundi" }, { slug: "desengano" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragAUnaMujer.id,
        type: "contexto",
        order: 1,
        content: `El soneto es una pieza magistral que toca algunos de los principales temas de su tiempo —las apariencias, la belleza fingida, el poder del dinero— con los más genuinos aromas del Barroco. La autoría es disputada entre los dos hermanos Argensola.`,
      },
      {
        fragmentId: fragAUnaMujer.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Soneto italiano en endecasílabos. Rima ABBA ABBA CDE ECD.`,
      },
      {
        fragmentId: fragAUnaMujer.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Confesión fingida al interlocutor (don Juan). La paradoja central: la belleza artificial supera a la natural. El giro filosófico: la propia naturaleza nos engaña (el cielo no es azul, es solo luz). La exclamación final como culminación.`,
      },
      {
        fragmentId: fragAUnaMujer.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El engaño de las apariencias como tema filosófico barroco: no solo los afeites engañan, la propia naturaleza es un engaño. «Ese cielo azul que todos vemos, / ni es cielo ni es azul» anticipa, tres siglos antes, la fenomenología moderna.`,
      },
      {
        fragmentId: fragAUnaMujer.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `«Lástima grande / que no sea verdad tanta belleza» ha pasado al habla común. Baltasar del Alcázar trata el mismo tema del afeite con mucho menos profundidad filosófica. Borges admiraba este soneto.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Barroco (9/15): Polo de Medina — El buen humor en las musas
  // ---------------------------------------------------------------------
  console.log("Creando autor «Polo de Medina» y obra «El buen humor en las musas»...");

  const poloDeMedina = await prisma.author.create({
    data: {
      slug: "polo-de-medina",
      name: "Salvador Jacinto Polo de Medina",
      birthYear: 1603,
      deathYear: 1676,
      country: "España",
      era: "Barroco",
      bio: `Salvador Jacinto Polo de Medina (Murcia, 1603–1676). Especialista en el epigrama barroco. Escribió El buen humor en las musas (1637). Se ordenó sacerdote y desempeñó diversos empleos con obispos y nobles. Sigue, glosa e imita a Quevedo y a Góngora en su obra.`,
    },
  });

  const buenHumorEnLasMusas = await prisma.work.create({
    data: {
      slug: "buen-humor-en-las-musas",
      title: "El buen humor en las musas",
      year: 1637,
      era: "Barroco",
      genre: "Poesía lírica (epigrama satírico)",
      synopsis: `Colección de epigramas y poemas festivos de Salvador Jacinto Polo de Medina, discípulo de Quevedo y Góngora. Sus epigramas actualizan la tradición de Marcial con los tipos y costumbres de la España del Siglo de Oro.`,
      authorId: poloDeMedina.id,
    },
  });

  const palilloDeDientesText = `¿Tú piensas que nos desmientes
con el palillo pulido
con que, sin haber comido,
Tristán, te limpias los dientes?
No tal, el hambre cruel
da en comerte y en picarte,
de suerte, que no es limpiarte
sino rascarte con él.`;

  const fragPalilloDeDientes = await prisma.fragment.create({
    data: {
      slug: "epigrama-del-palillo-de-dientes",
      title: "Epigrama del palillo de dientes",
      location: "El buen humor en las musas (1637)",
      headline: "Sin haber comido, Tristán, te limpias los dientes",
      text: palilloDeDientesText,
      order: 1,
      status: "published",
      featured: false,
      workId: buenHumorEnLasMusas.id,
      constellations: { connect: [{ slug: "critica-social" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragPalilloDeDientes.id,
        type: "contexto",
        order: 1,
        content: `El motivo del hidalgo pobre que finge haber comido aparece ya en el Lazarillo de Tormes: el escudero que sale a la calle con palillo de dientes para aparentar que ha comido. Polo de Medina actualiza el motivo con eficacia epigramática.`,
      },
      {
        fragmentId: fragPalilloDeDientes.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Dos redondillas (abba cddc). Ocho versos octosílabos. La economía del epigrama: decirlo todo en el mínimo espacio.`,
      },
      {
        fragmentId: fragPalilloDeDientes.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `El argumento lógico-irónico: el palillo no limpia los dientes sino que rasca el hambre que los roe. El final sorpresivo transforma el gesto del personaje en su contrario exacto.`,
      },
      {
        fragmentId: fragPalilloDeDientes.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `La miseria disfrazada de dignidad. El hidalgo sin recursos que mantiene las apariencias. Un motivo literario que viene del Lazarillo y que conecta con la crítica social del Barroco.`,
      },
      {
        fragmentId: fragPalilloDeDientes.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `El motivo del palillo de dientes como signo de haber comido (cuando no se ha comido) procede directamente del Lazarillo de Tormes. Quevedo también trató la miseria disfrazada en sus sátiras.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Barroco (10/15): Samaniego — El jardín de Venus
  // ---------------------------------------------------------------------
  console.log("Creando autor «Samaniego» y obra «El jardín de Venus»...");

  const samaniego = await prisma.author.create({
    data: {
      slug: "felix-maria-de-samaniego",
      name: "Félix María de Samaniego",
      birthYear: 1745,
      deathYear: 1801,
      country: "España",
      era: "Ilustración",
      bio: `Félix María de Samaniego (Laguardia, Álava, 1745–1801). El fabulista más popular del siglo XVIII español. Sus 158 fábulas moralizantes —La zorra y las uvas, La cigarra y la hormiga, El cuervo y el zorro, La lechera— son clásicos de la literatura infantil. Pero en privado escribía poesía erótico-jocosa recopilada en 1921 bajo el título El jardín de Venus. La Inquisición le persiguió por sus versos anticlericales, pero sus influyentes amigos le salvaron.`,
    },
  });

  const jardinDeVenus = await prisma.work.create({
    data: {
      slug: "jardin-de-venus-samaniego",
      title: "El jardín de Venus",
      year: 1921,
      era: "Ilustración",
      genre: "Poesía erótico-festiva (silva)",
      synopsis: `Recopilación póstuma (1921) de la obra erótico-festiva de Samaniego, escrita en privado mientras publicaba sus célebres fábulas morales. La cara oculta del gran pedagogo del siglo XVIII.`,
      authorId: samaniego.id,
    },
  });

  const viejaYElGatoText = `Tenía cierta vieja de costumbre,
al meterse en la cama,
arrimarse en cuclillas a la lumbre,
en camisa, las manos a la llama.
En este breve rato,
le hacía un manso gato
dos mil caricias tiernas: pasaba y repasaba entre sus piernas.
Y como en tales casos la enarbola,
tocaba en cierta parte con la cola.
Y la vieja cuitada
muy contenta decía: —Peor es nada.`;

  const fragViejaYElGato = await prisma.fragment.create({
    data: {
      slug: "la-vieja-y-el-gato",
      title: "La vieja y el gato",
      location: "El jardín de Venus (póstumo, 1921)",
      headline: "Peor es nada",
      text: viejaYElGatoText,
      order: 1,
      status: "published",
      featured: false,
      workId: jardinDeVenus.id,
      constellations: { connect: [{ slug: "critica-social" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragViejaYElGato.id,
        type: "contexto",
        order: 1,
        content: `Al tiempo que sus fábulas morales, Samaniego escribía para sí mismo y sus amigos ilustrados multitud de piezas de poesía erótico-jocosa. Esta que se presenta es de las más delicadas y elegantes del género.`,
      },
      {
        fragmentId: fragViejaYElGato.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Silva: combinación libre de endecasílabos y heptasílabos con rima variable. El poema es breve, con un ritmo ligero y un remate cómico en el último verso.`,
      },
      {
        fragmentId: fragViejaYElGato.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Eufemismo sostenido: todo se dice sin decirse. La cola del gato como elemento cómico. El remate —«Peor es nada»— es la perla del poema: una sentencia popular de resignación satisfecha que sintetiza todo.`,
      },
      {
        fragmentId: fragViejaYElGato.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El humor erótico-festivo como válvula de escape de la cultura ilustrada. La soledad de la vejez compensada por el contacto accidental del gato. El humor negro y la resignación.`,
      },
      {
        fragmentId: fragViejaYElGato.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `La tradición del epigrama erótico-festivo viene de Marcial y Boccaccio y llega a Quevedo. Samaniego la cultiva en el siglo XVIII con elegancia. Su enemistad con Tomás de Iriarte —el otro gran fabulista de la época— es uno de los grandes episodios de la literatura española del XVIII.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Romanticismo (1/9): Duque de Rivas
  // ---------------------------------------------------------------------
  console.log("Creando autor «Duque de Rivas» y obra «Obras poéticas»...");

  const duqueDeRivas = await prisma.author.create({
    data: {
      slug: "angel-de-saavedra-duque-de-rivas",
      name: "Ángel de Saavedra, Duque de Rivas",
      birthYear: 1791,
      deathYear: 1865,
      country: "España",
      era: "Romanticismo",
      bio: `Ángel de Saavedra y Ramírez de Baquedano, Duque de Rivas (Córdoba, 1791–Madrid, 1865). Más conocido como dramaturgo —es el autor del célebre drama romántico Don Álvaro o la fuerza del sino—, el cordobés fue también historiador, pintor, militar, político… y poeta, de los más relevantes de su tiempo. Liberal exaltado, participó en el pronunciamiento de Riego de 1820. Condenado a muerte y exiliado cuando Fernando VII restauró el absolutismo, vivió en Inglaterra, Malta y París. Su Don Álvaro (1835) fue el primer gran éxito del Romanticismo español y sirvió de base al libreto de La forza del destino de Verdi.`,
    },
  });

  const obrasPoeticasRivas = await prisma.work.create({
    data: {
      slug: "obras-poeticas-rivas",
      title: "Obras poéticas",
      year: 1820,
      era: "Romanticismo",
      genre: "Poesía lírica (soneto)",
      synopsis: `Poesía de Ángel de Saavedra, Duque de Rivas, cultivada paralelamente a su obra teatral. Sus sonetos reflexivos sobre la vanitas y el destino humano son los más destacados de la poesía romántica española.`,
      authorId: duqueDeRivas.id,
    },
  });

  const miseroLenoText = `Mísero leño, destrozado y roto,
que en la arenosa playa escarmentado
yaces del marinero abandonado,
despojo vil del ábrego y del noto.

¡Cuánto mejor estabas en el soto,
de aves y ramas y verdor poblado,
antes que, envanecido y deslumbrado,
fueras del mundo al término remoto!

Perdiste la pomposa lozanía,
la dulce paz de la floresta umbrosa,
donde burlabas los sonoros vientos.

¿Qué tu orgulloso afán se prometía?
¿También burlarlos en la mar furiosa?
He aquí el fruto de altivos pensamientos.`;

  const fragMiseroLeno = await prisma.fragment.create({
    data: {
      slug: "misero-leno-soneto",
      title: "Mísero leño (soneto)",
      location: "Obras poéticas",
      headline: "He aquí el fruto de altivos pensamientos",
      text: miseroLenoText,
      order: 1,
      status: "published",
      featured: false,
      workId: obrasPoeticasRivas.id,
      constellations: { connect: [{ slug: "paso-del-tiempo" }, { slug: "poder" }] },
      topics: { connect: [{ slug: "contemptus-mundi" }, { slug: "desengano" }] },
      places: { connect: [{ slug: "madrid" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragMiseroLeno.id,
        type: "contexto",
        order: 1,
        content: `Más conocido como dramaturgo, el Duque de Rivas fue también un excelente sonetista. El Mísero leño es una reflexión sobre la fugacidad de la vida y especialmente sobre las vanas pretensiones y los sueños indebidos de la soberbia.`,
      },
      {
        fragmentId: fragMiseroLeno.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Soneto italiano en endecasílabos. Rima ABBA ABBA CDC DCD. El soneto sigue la forma clásica renacentista pero el contenido es plenamente romántico.`,
      },
      {
        fragmentId: fragMiseroLeno.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Alegoría sostenida: el leño naufragado = el ser humano arrastrado por la ambición. Apóstrofe al leño. Pregunta retórica final. La contraposición entre el soto (origen, paz, modestia) y el mar (ambición, soberbia, ruina).`,
      },
      {
        fragmentId: fragMiseroLeno.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `La soberbia y su castigo: el árbol que quiso ser barco y acabó leño naufragado. Una reflexión sobre la vanitas y la desmedida ambición. Es también, implícitamente, una autobiografía del exilio político del propio Rivas.`,
      },
      {
        fragmentId: fragMiseroLeno.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `El leño naufragado conecta con la tradición del naufragio como metáfora vital (fray Luis: «roto casi el navío»). La imagen del árbol-barco-leño tiene precedentes en Horacio y en la emblemática renacentista.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Romanticismo (2/9): Espronceda — Canción del pirata
  // ---------------------------------------------------------------------
  console.log("Creando obra «Poesías líricas» y fragmento «Canción del pirata»...");

  const poesiasLiricasEspronceda = await prisma.work.create({
    data: {
      slug: "poesias-liricas-espronceda",
      title: "Poesías líricas",
      year: 1840,
      era: "Romanticismo",
      genre: "Poesía lírica (oda polimétrica)",
      synopsis: `Recopilación de la poesía lírica de Espronceda, que incluye la Canción del pirata —el poema más famoso del Romanticismo español—, el Canto a Jarifa y otras composiciones de intenso lirismo romántico.`,
      authorId: espronceda.id,
    },
  });

  const cancionDelPirataText = `Con diez cañones por banda,
viento en popa a toda vela,
no corta el mar, sino vuela
un velero bergantín;
bajel pirata que llaman,
por su bravura, el Temido,
en todo mar conocido
del uno al otro confín.

La luna en el mar riela,
en la lona gime el viento
y alza en blando movimiento
olas de plata y azul;
y va el capitán pirata,
cantando alegre en la popa,
Asia a un lado, al otro Europa,
y allá a su frente Estambul.

«Navega velero mío,
sin temor,
que ni enemigo navío,
ni tormenta, ni bonanza,
tu rumbo a torcer alcanza,
ni a sujetar tu valor.

Veinte presas
hemos hecho
a despecho,
del inglés,
y han rendido
sus pendones
cien naciones
a mis pies.

Que es mi barco mi tesoro,
que es mi dios la libertad,
mi ley, la fuerza y el viento,
mi única patria la mar.»`;

  const fragCancionDelPirata = await prisma.fragment.create({
    data: {
      slug: "cancion-del-pirata",
      title: "Canción del pirata",
      location: "Poesías líricas (1840)",
      headline: "Que es mi dios la libertad",
      text: cancionDelPirataText,
      order: 1,
      status: "published",
      featured: false,
      workId: poesiasLiricasEspronceda.id,
      constellations: { connect: [{ slug: "honor-y-valor" }, { slug: "poder" }] },
      places: { connect: [{ slug: "madrid" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragCancionDelPirata.id,
        type: "contexto",
        order: 1,
        content: `La Canción del pirata (1835) es el poema más famoso del Romanticismo español. El pirata como antihéroe: libre de toda ley, de toda patria, de todo dios excepto la libertad. La encarnación del individuo romántico que se rebela contra toda convención.`,
      },
      {
        fragmentId: fragCancionDelPirata.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Prodigio técnico: combinación de octosílabos, tetrasílabos y hexasílabos. Los cambios súbitos de métrica crean el ritmo del barco en el mar. El estribillo («Que es mi barco mi tesoro…») se repite cinco veces con leves variaciones.`,
      },
      {
        fragmentId: fragCancionDelPirata.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Narración en tercera persona que da paso al monólogo del pirata. Enumeración de hazañas. El estribillo como himno de libertad. Las imágenes náuticas como correlato de la libertad total.`,
      },
      {
        fragmentId: fragCancionDelPirata.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `La libertad absoluta como valor supremo: sin patria, sin ley, sin dios excepto la libertad. El pirata como símbolo del yo romántico que rechaza toda autoridad. La figura del antihéroe es característica de Espronceda.`,
      },
      {
        fragmentId: fragCancionDelPirata.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `El pirata romántico conecta con el Corsario de Byron y con el Don Juan de Zorrilla. La libertad como valor supremo reaparece en el anarquismo literario del siglo XX. El poema ha sido musicado innumerables veces.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Romanticismo (3-6/9): Bécquer Rimas VII, XIII, XXI, XXIII
  // (Rima I, LII, LIII ya existen — SKIP)
  // ---------------------------------------------------------------------
  console.log("Creando nuevas Rimas de Bécquer (VII, XIII, XXI, XXIII)...");

  const rimaVIIText = `Del salón en el ángulo oscuro,
de su dueña tal vez olvidada,
silenciosa y cubierta de polvo,
veíase el arpa.

¡Cuánta nota dormía en sus cuerdas,
como el pájaro duerme en las ramas,
esperando la mano de nieve
que sabe arrancarlas!

¡Ay!, pensé; ¡cuántas veces el genio
así duerme en el fondo del alma,
y una voz como Lázaro espera
que le diga «Levántate y anda»!`;

  const fragRimaVII = await prisma.fragment.create({
    data: {
      slug: "rima-vii",
      title: "Rima VII",
      location: "Rimas, VII",
      headline: "«Del salón en el ángulo oscuro»",
      text: rimaVIIText,
      order: 5,
      status: "published",
      featured: false,
      workId: rimas.id,
      constellations: { connect: [{ slug: "amor" }] },
      places: { connect: [{ slug: "sevilla" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragRimaVII.id,
        type: "contexto",
        order: 1,
        content: `El arpa olvidada es una de las imágenes más famosas de la poesía romántica española. Bécquer la usa como metáfora del poeta o del genio dormido que espera la voz que lo despierte.`,
      },
      {
        fragmentId: fragRimaVII.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Combinación de endecasílabos y heptasílabos con rima asonante en los pares (-amas). La irregularidad métrica crea el ritmo del polvo y el silencio.`,
      },
      {
        fragmentId: fragRimaVII.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Descripción del arpa olvidada con detalle sensorial (polvo, silencio, oscuridad). Símil del pájaro en la rama. La referencia bíblica a Lázaro como culminación: el genio necesita una voz divina para despertar.`,
      },
      {
        fragmentId: fragRimaVII.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El genio dormido en el alma que espera ser despertado. La poesía como latencia, no como realidad permanente. La imagen del arpa es también la del poeta mismo: instrumento que espera la mano que lo haga sonar.`,
      },
      {
        fragmentId: fragRimaVII.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `El arpa como instrumento poético por excelencia es un tópico romántico europeo (Espronceda, Byron, Shelley). La alusión a Lázaro introduce la dimensión religiosa y milagrosa del despertar poético.`,
      },
    ],
  });

  const rimaXIIIText = `Tu pupila es azul y, cuando ríes,
su claridad süave me recuerda
el trémulo fulgor de la mañana
que en el mar se refleja.

Tu pupila es azul y, cuando lloras,
las transparentes lágrimas en ella
se me figuran gotas de rocío
sobre una vïoleta.

Tu pupila es azul, y si en su fondo
como un punto de luz radia una idea,
me parece en el cielo de la tarde
una perdida estrella.`;

  const fragRimaXIII = await prisma.fragment.create({
    data: {
      slug: "rima-xiii",
      title: "Rima XIII",
      location: "Rimas, XIII",
      headline: "«Tu pupila es azul»",
      text: rimaXIIIText,
      order: 6,
      status: "published",
      featured: false,
      workId: rimas.id,
      constellations: { connect: [{ slug: "amor" }] },
      topics: { connect: [{ slug: "amor-cortes" }] },
      places: { connect: [{ slug: "sevilla" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragRimaXIII.id,
        type: "contexto",
        order: 1,
        content: `La Rima XIII forma parte de la serie de rimas sobre los ojos de la amada. Bécquer hace variar el estado de ánimo de la amada —risa, llanto, pensamiento— y en cada caso los ojos azules producen una imagen diferente de la naturaleza.`,
      },
      {
        fragmentId: fragRimaXIII.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Tres estrofas de cuatro versos (endecasílabos y heptasílabos) con rima asonante en los pares. La anáfora «Tu pupila es azul» como eje estructural.`,
      },
      {
        fragmentId: fragRimaXIII.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Anáfora de «Tu pupila es azul». Triple variación: alegría (el mar al amanecer), llanto (rocío sobre violeta), pensamiento (estrella perdida en el cielo). Símiles sensoriales de gran delicadeza.`,
      },
      {
        fragmentId: fragRimaXIII.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `Los ojos como espejo del alma y de la naturaleza. La amada cuya mirada cambia el mundo: cuando ríe el mar brilla, cuando llora hay rocío, cuando piensa hay una estrella. La naturaleza como correlato del estado anímico.`,
      },
      {
        fragmentId: fragRimaXIII.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `Conecta con Cetina («Ojos claros, serenos»), con la Rima XII («Porque son, niña, tus ojos verdes»), también en esta compilación, y con toda la tradición española de los ojos como motivo poético.`,
      },
    ],
  });

  const rimaXXIText = `¿Qué es poesía?, dices, mientras clavas
en mi pupila tu pupila azul,
¡Qué es poesía! ¿Y tú me lo preguntas?
Poesía… eres tú.`;

  const fragRimaXXI = await prisma.fragment.create({
    data: {
      slug: "rima-xxi",
      title: "Rima XXI",
      location: "Rimas, XXI",
      headline: "«Poesía… eres tú»",
      text: rimaXXIText,
      order: 7,
      status: "published",
      featured: false,
      workId: rimas.id,
      constellations: { connect: [{ slug: "amor" }] },
      places: { connect: [{ slug: "sevilla" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragRimaXXI.id,
        type: "contexto",
        order: 1,
        content: `La Rima XXI es una de las más breves y más famosas de Bécquer. La pregunta «¿qué es poesía?» y la respuesta «eres tú» han pasado al acervo popular y han sido citadas, parodiadas e imitadas innumerables veces.`,
      },
      {
        fragmentId: fragRimaXXI.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Cuatro versos de métrica mixta. La brevedad es la esencia: cuatro versos que definen la poesía en dos palabras.`,
      },
      {
        fragmentId: fragRimaXXI.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Pregunta retórica que se responde a sí misma. La mirada de la amada que mira al poeta mientras pregunta sobre la poesía: la respuesta está en el acto mismo de mirar.`,
      },
      {
        fragmentId: fragRimaXXI.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `La poesía como experiencia del otro: la amada es la poesía porque la poesía es lo que nos hace sentir con intensidad. Una poética en cuatro versos.`,
      },
      {
        fragmentId: fragRimaXXI.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `La pregunta «¿qué es poesía?» conecta con la tradición de las artes poéticas (Horacio, Boileau, Wordsworth). La respuesta de Bécquer es la más romántica posible: la poesía no es una forma sino una experiencia vivida.`,
      },
    ],
  });

  const rimaXXIIIText = `Por una mirada, un mundo;
por una sonrisa, un cielo;
por un beso… yo no sé
qué te diera por un beso.`;

  const fragRimaXXIII = await prisma.fragment.create({
    data: {
      slug: "rima-xxiii",
      title: "Rima XXIII",
      location: "Rimas, XXIII",
      headline: "«Por una mirada, un mundo»",
      text: rimaXXIIIText,
      order: 8,
      status: "published",
      featured: false,
      workId: rimas.id,
      constellations: { connect: [{ slug: "amor" }] },
      topics: { connect: [{ slug: "amor-cortes" }] },
      places: { connect: [{ slug: "sevilla" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragRimaXXIII.id,
        type: "contexto",
        order: 1,
        content: `La Rima XXIII es la más breve del poemario y posiblemente la más reproducida. La gradación ascendente —mirada, sonrisa, beso— crea un efecto de intensidad creciente que culmina en el silencio del último verso.`,
      },
      {
        fragmentId: fragRimaXXIII.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Cuatro versos octosílabos con rima asonante en los pares (-elo). La brevedad perfecta.`,
      },
      {
        fragmentId: fragRimaXXIII.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Gradación ascendente de los gestos amorosos. El silencio del verso final como la mayor elocuencia: no hay palabras para expresar lo que daría por un beso.`,
      },
      {
        fragmentId: fragRimaXXIII.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El amor como economía del deseo: cada gesto tiene un precio, y el precio sube con la intensidad. El último verso reconoce la insuficiencia del lenguaje ante el amor.`,
      },
      {
        fragmentId: fragRimaXXIII.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `La tradición de los ojos como inicio del amor conecta con Cetina, Hurtado de Mendoza y Bécquer mismo en otras rimas. La gradación mirada/sonrisa/beso reaparece en la poesía popular y la canción.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Romanticismo (7/9): Carolina Coronado
  // ---------------------------------------------------------------------
  console.log("Creando autor «Carolina Coronado» y obra «Obras poéticas»...");

  const carolinaCoronado = await prisma.author.create({
    data: {
      slug: "carolina-coronado",
      name: "Carolina Coronado",
      birthYear: 1820,
      deathYear: 1911,
      country: "España",
      era: "Romanticismo",
      bio: `Carolina Coronado (Almendralejo, 1820–Lisboa, 1911). La última romántica, según la llamó su sobrino nieto Ramón Gómez de la Serna. Una de las primeras feministas de las letras españolas. Autodidacta (aprendió sola francés e italiano para leer a sus autores favoritos). Padecía catalepsia. Se casó con un diplomático estadounidense y convirtió su palacete madrileño en centro de la vida literaria y política. Fundó la Hermandad lírica. Fue directiva, con Concepción Arenal, de la Sociedad Abolicionista Española.`,
    },
  });

  const obrasPoeticasCoronado = await prisma.work.create({
    data: {
      slug: "obras-poeticas-carolina-coronado",
      title: "Obras poéticas",
      year: 1868,
      era: "Romanticismo",
      genre: "Poesía lírica (soneto)",
      synopsis: `Poesía de Carolina Coronado, que abarca desde el intimismo romántico hasta el compromiso político abolicionista. Su voz, radicalmente femenina, denuncia la esclavitud y reivindica la coherencia entre libertad proclamada y libertad real.`,
      authorId: carolinaCoronado.id,
    },
  });

  const sonetoAntiesclavText = `Si libres hizo ya de su mancilla
el águila inmortal los africanos,
¿por qué han de ser esclavos los hermanos
que vecinos tenéis en esa Antilla?

¿Qué derecho tendrás, noble Castilla,
para dejar cadenas en sus manos,
cuando rompes los cetros soberanos
al son de libertad que te acaudilla?

No, no es así: al mundo no se engaña.
Sonó la libertad, ¡bendita sea!
Pero después de la triunfal pelea,

no puede haber esclavos en España.
¡O borras el baldón que horror inspira,
o esa tu libertad, pueblo, es mentira!`;

  const fragSonetoAntiesclav = await prisma.fragment.create({
    data: {
      slug: "soneto-antiesclavista",
      title: "Soneto antiesclavista",
      location: "Obras poéticas (1868)",
      headline: "O esa tu libertad, pueblo, es mentira",
      text: sonetoAntiesclavText,
      order: 1,
      status: "published",
      featured: false,
      workId: obrasPoeticasCoronado.id,
      constellations: { connect: [{ slug: "critica-social" }, { slug: "poder" }] },
      places: { connect: [{ slug: "madrid" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragSonetoAntiesclav.id,
        type: "contexto",
        order: 1,
        content: `El soneto es de octubre de 1868, justo después de la Gloriosa, la revolución que derrocó a Isabel II y abrió el Sexenio Democrático. Coronado recuerda con contundencia que la libertad proclamada es incompleta mientras Cuba y Puerto Rico mantengan la esclavitud.`,
      },
      {
        fragmentId: fragSonetoAntiesclav.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Soneto en endecasílabos. Rima ABBA ABBA CDC DCD. Los dos últimos versos son el ultimátum político más contundente del poema.`,
      },
      {
        fragmentId: fragSonetoAntiesclav.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Pregunta retórica doble. Contradicción señalada: ¿cómo puedes proclamar la libertad y mantener esclavos? El «águila inmortal» (Estados Unidos, que abolió la esclavitud en 1865) como referente. Los dos últimos versos como disyuntiva implacable.`,
      },
      {
        fragmentId: fragSonetoAntiesclav.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `La coherencia entre principios y hechos como exigencia democrática. Si España proclama la libertad, debe abolir la esclavitud en sus colonias. Un texto de extraordinaria modernidad política.`,
      },
      {
        fragmentId: fragSonetoAntiesclav.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `Gertrudis Gómez de Avellaneda publicó en 1841 Sab, la primera novela antiesclavista de la historia. Coronado continúa esa tradición. La Sociedad Abolicionista Española logró finalmente la abolición en Cuba en 1886.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Romanticismo (8-9/9): Gertrudis Gómez de Avellaneda
  // ---------------------------------------------------------------------
  console.log("Creando autor «Avellaneda» y obra «Poesías»...");

  const avellaneda = await prisma.author.create({
    data: {
      slug: "gertrudis-gomez-de-avellaneda",
      name: "Gertrudis Gómez de Avellaneda",
      birthYear: 1814,
      deathYear: 1873,
      country: "Cuba",
      era: "Romanticismo",
      bio: `Gertrudis Gómez de Avellaneda (Camagüey, Cuba, 1814–Madrid, 1873). Hija de padre español y madre cubana. Fue considerada la mujer más importante de Madrid de su época, solo superada por la reina Isabel II. Vivió en La Coruña (donde tuvo su primer novio, que no quería que escribiera), Sevilla (donde amó a Ignacio de Cepeda, amor no correspondido que marcó su obra) y Madrid. Se casó dos veces. Intentó entrar en la Real Academia Española; le dijeron que el reglamento no contemplaba la presencia de mujeres.`,
    },
  });

  const poesiasAvellaneda = await prisma.work.create({
    data: {
      slug: "poesias-avellaneda",
      title: "Poesías",
      year: 1841,
      era: "Romanticismo",
      genre: "Poesía lírica (soneto)",
      synopsis: `Poesía lírica de Gertrudis Gómez de Avellaneda, que abarca desde la elegía de la patria perdida hasta el análisis de las contradicciones del amor. Su voz, a caballo entre Cuba y España, inaugura la tradición lírica hispanoamericana femenina.`,
      authorId: avellaneda.id,
    },
  });

  const alPartirText = `¡Perla del mar! ¡Estrella de occidente!
¡Hermosa Cuba! Tu brillante cielo
la noche cubre con su opaco velo,
como cubre el dolor mi triste frente.

¡Voy a partir!… La chusma diligente,
para arrancarme del nativo suelo
las velas iza, y pronta a su desvelo
la brisa acude de tu zona ardiente.

¡Adiós, patria feliz, edén querido!
¡Doquier que el hado en su furor me impela,
tu dulce nombre halagará mi oído!

¡Adiós!… Ya cruje la turgente vela…
el ancla se alza… el buque, estremecido,
las olas corta y silencioso vuela.`;

  const fragAlPartir = await prisma.fragment.create({
    data: {
      slug: "al-partir-soneto",
      title: "Al partir (soneto)",
      location: "Poesías",
      headline: "¡Perla del mar! ¡Estrella de occidente!",
      text: alPartirText,
      order: 1,
      status: "published",
      featured: false,
      workId: poesiasAvellaneda.id,
      constellations: { connect: [{ slug: "amor" }, { slug: "paso-del-tiempo" }] },
      places: { connect: [{ slug: "sevilla" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragAlPartir.id,
        type: "contexto",
        order: 1,
        content: `El soneto fue escrito en el barco que llevaba a Gertrudis de Cuba a España en 1836. Tenía 22 años. La imagen de la isla que se aleja es uno de los grandes temas de la poesía hispanoamericana del siglo XIX.`,
      },
      {
        fragmentId: fragAlPartir.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Soneto en endecasílabos. Rima ABBA ABBA CDC DCD. La sucesión de exclamaciones y los puntos suspensivos crean el ritmo entrecortado de la partida.`,
      },
      {
        fragmentId: fragAlPartir.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Apóstrofe a Cuba como ser amado (perla, estrella, patria feliz, edén). Las exclamaciones imitan la emoción del adiós. La escena del barco que parte en tiempo real: las velas se izan, el ancla se alza, el buque vuela.`,
      },
      {
        fragmentId: fragAlPartir.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `La nostalgia de la patria perdida. La identidad cubana de una escritora que vivirá entre dos mundos. El adiós no definitivo: «tu dulce nombre halagará mi oído».`,
      },
      {
        fragmentId: fragAlPartir.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `El exilio y la identidad cubana son también temas de José Martí. Gertrudis es la mayor figura de la literatura cubana del siglo XIX. Su novela Sab (1841) es la primera novela antiesclavista de la historia.`,
      },
    ],
  });

  const lasContradiccionesText = `No encuentro paz, ni me permiten guerra;
de fuego devorado, sufro el frío;
abrazo un mundo, y quédome vacío;
me lanzo al cielo, y préndeme la tierra.

Ni libre soy, ni la prisión me encierra;
veo sin luz, sin voz hablar ansío;
temo sin esperar, sin placer río;
nada me da valor, nada me aterra.

Busco el peligro cuando auxilio imploro;
al sentirme morir me encuentro fuerte;
valiente pienso ser, y débil lloro.

Cúmplese así mi extraordinaria suerte;
siempre a los pies de la beldad que adoro,
y no quiere mi vida ni mi muerte.`;

  const fragLasContradicciones = await prisma.fragment.create({
    data: {
      slug: "las-contradicciones-soneto",
      title: "Las contradicciones (soneto)",
      location: "Poesías",
      headline: "No encuentro paz, ni me permiten guerra",
      text: lasContradiccionesText,
      order: 2,
      status: "published",
      featured: false,
      workId: poesiasAvellaneda.id,
      constellations: { connect: [{ slug: "amor" }] },
      topics: { connect: [{ slug: "desengano" }] },
      places: { connect: [{ slug: "madrid" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragLasContradicciones.id,
        type: "contexto",
        order: 1,
        content: `El soneto recrea la tradición del «soneto de definición del amor» barroco (Lope, Villamediana, sor Juana, María de Zayas), todos en esta compilación, pero desde la perspectiva del Romanticismo: el yo que se contradice a sí mismo.`,
      },
      {
        fragmentId: fragLasContradicciones.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Soneto en endecasílabos. Rima ABBA ABBA CDC DCD. Cada verso es una paradoja: no encuentro paz / ni me permiten guerra.`,
      },
      {
        fragmentId: fragLasContradicciones.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Enumeración de antítesis en cada verso. La estructura es la misma que en los sonetos barrocos de definición del amor, pero el tono es más personal y desesperado.`,
      },
      {
        fragmentId: fragLasContradicciones.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El amor como estado de contradicción absoluta. Conecta con la tradición barroca pero añade la angustia romántica del yo que no puede resolverse.`,
      },
      {
        fragmentId: fragLasContradicciones.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `Este soneto dialoga directamente con «Amar el día, aborrecer el día» de María de Zayas y con «Desmayarse, atreverse» de Lope, ambos en esta compilación. La tradición del amor como suma de contrarios atraviesa cuatro siglos.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Finales XIX / Siglo XX (1/5): Manuel Machado
  // ---------------------------------------------------------------------
  console.log("Creando autor «Manuel Machado» y obra «Alma»...");

  const manuelMachado = await prisma.author.create({
    data: {
      slug: "manuel-machado",
      name: "Manuel Machado",
      birthYear: 1874,
      deathYear: 1947,
      country: "España",
      era: "Modernismo",
      bio: `Manuel Machado (Sevilla, 1874–Madrid, 1947). Hermano mayor de Antonio Machado, con quien comparte el origen sevillano y la Generación del 98. Poeta de gran musicalidad y sensualidad, cultivó el Modernismo y el costumbrismo andaluz. Su libro Alma (1902) es su gran obra. Sus trayectorias políticas divergieron radicalmente: Manuel apoyó al franquismo.`,
    },
  });

  const almaManuelMachado = await prisma.work.create({
    data: {
      slug: "alma-manuel-machado",
      title: "Alma",
      year: 1902,
      era: "Modernismo",
      genre: "Poesía lírica (romance modernista)",
      synopsis: `El libro fundamental de Manuel Machado, que recoge su poesía modernista y costumbrista andaluza. Castilla, el poema más célebre, convierte un episodio del Cantar de mío Cid en una de las recreaciones medievales más poderosas del siglo XX.`,
      authorId: manuelMachado.id,
    },
  });

  const castillaText = `El ciego sol se estrella
en las duras aristas de las armas,
llaga de luz los petos y espaldares
y flamea en las puntas de las lanzas.

El ciego sol, la sed y la fatiga.
Por la terrible estepa castellana,
al destierro, con doce de los suyos
—polvo, sudor y hierro— el Cid cabalga.

Cerrado está el mesón a piedra y lodo.
Nadie responde… Al pomo de la espada
y al cuento de las picas el postigo
va a ceder ¡Quema el sol, el aire abrasa!

A los terribles golpes
de eco ronco, una voz pura, de plata
y de cristal, responde… Hay una niña
muy débil y muy blanca
en el umbral. Es toda
ojos azules, y en los ojos, lágrimas.

Oro pálido nimba
su carita curiosa y asustada.
Buen Cid, pasad. El rey nos dará muerte,
arruinará la casa
y sembrará de sal el pobre campo
que mi padre trabaja…

Idos. El cielo os colme de venturas…
¡En nuestro mal, oh Cid, no ganáis nada!

Calla la niña y llora sin gemido…
Un sollozo infantil cruza la escuadra
de feroces guerreros,
y una voz inflexible grita: ¡En marcha!

El ciego sol, la sed y la fatiga…
Por la terrible estepa castellana,
al destierro, con doce de los suyos
—polvo, sudor y hierro— el Cid cabalga.`;

  const fragCastilla = await prisma.fragment.create({
    data: {
      slug: "castilla-el-cid-cabalga",
      title: "Castilla",
      location: "Alma (1902)",
      headline: "—polvo, sudor y hierro— el Cid cabalga",
      text: castillaText,
      order: 1,
      status: "published",
      featured: false,
      workId: almaManuelMachado.id,
      constellations: { connect: [{ slug: "honor-y-destierro" }, { slug: "honor-y-valor" }] },
      places: { connect: [{ slug: "vivar-del-cid" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragCastilla.id,
        type: "contexto",
        order: 1,
        content: `El poema convierte un pequeño episodio del Cantar de mío Cid —la niña de nueve años que impide al Cid entrar en Burgos— en una de las más bellas recreaciones del poema medieval. Manuel Machado toma el episodio medieval y lo transforma con sensibilidad modernista.`,
      },
      {
        fragmentId: fragCastilla.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Romance peculiar: mezcla de heptasílabos y endecasílabos con rima asonante muy leve. El ritmo imita el avance pesado de la caballería: «polvo, sudor y hierro». La estructura circular —la primera estrofa se repite al final— crea el efecto del paso imparable del tiempo.`,
      },
      {
        fragmentId: fragCastilla.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `El contraste entre la brutalidad del ejército (el sol ciego, el hierro) y la delicadeza de la niña (ojos azules, voz de plata y cristal). La aliteración de «polvo, sudor y hierro». El sollozo infantil que atraviesa la escuadra.`,
      },
      {
        fragmentId: fragCastilla.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `La dignidad frente al poder y el exilio. La niña que se niega a abrir por miedo al rey pero que llora: la impotencia del pueblo ante la injusticia. El Cid que sigue de largo porque así debe ser.`,
      },
      {
        fragmentId: fragCastilla.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `Manuel Machado toma el episodio del Cantar de mío Cid (también en esta compilación) y lo transforma en un poema modernista. La niña de nueve años del Cantar se convierte aquí en una figura de extraordinaria ternura.`,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Antología ¡LEE! — Siglo XX (2-5/5): Federico García Lorca
  // ---------------------------------------------------------------------
  console.log("Creando autor «Lorca» y obras «Poema del Cante Jondo» y «Romancero gitano»...");

  const lorca = await prisma.author.create({
    data: {
      slug: "federico-garcia-lorca",
      name: "Federico García Lorca",
      birthYear: 1898,
      deathYear: 1936,
      country: "España",
      era: "Generación del 27",
      bio: `Federico García Lorca (Fuente Vaqueros, Granada, 1898–Víznar, 1936). El poeta más popular e influyente del siglo XX español. Dramaturgo innovador (Bodas de sangre, Yerma, La casa de Bernarda Alba). Miembro fundador de la Generación del 27. Homosexual, asesinado al inicio de la Guerra Civil española por fuerzas franquistas. Hoy es el autor español más representado en el mundo.`,
    },
  });

  const poemaDelCanteJondo = await prisma.work.create({
    data: {
      slug: "poema-del-cante-jondo",
      title: "Poema del Cante Jondo",
      year: 1931,
      era: "Generación del 27",
      genre: "Poesía lírica (verso libre)",
      synopsis: `Conjunto de poemas escritos en 1921 como prólogo poético al Concurso de Cante Jondo organizado por Manuel de Falla en Granada, y publicados en 1931. El poemario explora el duende, la pena honda y el alma andaluza a través de la guitarra, la siguiriya y otros palos flamencos.`,
      authorId: lorca.id,
    },
  });

  const laGuitarraText = `Empieza el llanto
de la guitarra.
Se rompen las copas
de la madrugada.
Empieza el llanto
de la guitarra.
Es inútil
callarla.
Es imposible
callarla.
Llora monótona
como llora el agua,
como llora el viento
sobre la nevada.
Es imposible
callarla.
Llora por cosas
lejanas.
Arena del Sur caliente
que pide camelias blancas.
Llora flecha sin blanco,
la tarde sin mañana,
y el primer pájaro muerto
sobre la rama.
¡Oh, guitarra!
Corazón malherido
por cinco espadas.`;

  const fragLaGuitarra = await prisma.fragment.create({
    data: {
      slug: "la-guitarra-poema-cante-jondo",
      title: "La guitarra",
      location: "Poema del Cante Jondo (1931)",
      headline: "Corazón malherido por cinco espadas",
      text: laGuitarraText,
      order: 1,
      status: "published",
      featured: false,
      workId: poemaDelCanteJondo.id,
      constellations: { connect: [{ slug: "muerte" }] },
      places: { connect: [{ slug: "granada" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragLaGuitarra.id,
        type: "contexto",
        order: 1,
        content: `El Poema del Cante Jondo fue escrito en 1921 como prólogo poético a un Concurso de Cante Jondo que Manuel de Falla organizó en Granada. Lorca dijo: «La guitarra ha construido el cante jondo. Ha labrado, profundizado, la oscura musa oriental judía y árabe antiquísima.»`,
      },
      {
        fragmentId: fragLaGuitarra.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Verso libre con predominio de versos cortos (bisílabos, tetrasílabos, heptasílabos). La irregularidad métrica imita el ritmo sincopado de la guitarra flamenca.`,
      },
      {
        fragmentId: fragLaGuitarra.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `La guitarra personificada que llora. Anáfora de «empieza el llanto / es imposible». Comparaciones del llanto con el agua y el viento. El final metafórico: «Corazón malherido / por cinco espadas» (las cinco cuerdas de la guitarra).`,
      },
      {
        fragmentId: fragLaGuitarra.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El «duende» lorquiano: la pena honda, el llanto sin consuelo, la tradición andaluza del dolor convertido en arte. La guitarra llora «por cosas lejanas»: el dolor ancestral, la pérdida original.`,
      },
      {
        fragmentId: fragLaGuitarra.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `El Romancero gitano (1928), también en esta compilación, desarrollará los mismos temas con más complejidad. La guitarra como símbolo del alma andaluza conecta con Falla, con el flamenco y con la tradición árabe-andaluza.`,
      },
    ],
  });

  const romanceroGitano = await prisma.work.create({
    data: {
      slug: "romancero-gitano",
      title: "Romancero gitano",
      year: 1928,
      era: "Generación del 27",
      genre: "Poesía lírica (romance)",
      synopsis: `Los 18 romances del Romancero gitano convirtieron a Lorca en el poeta más popular de España en vida. El gitano como figura mítica de Andalucía. La luna, la noche, la guardia civil y la muerte son sus motivos dominantes.`,
      authorId: lorca.id,
    },
  });

  const romanceLunaLunaText = `La luna vino a la fragua
con su polisón de nardos.
El niño la mira mira.
El niño la está mirando.
En el aire conmovido
mueve la luna sus brazos
y enseña, lúbrica y pura,
sus senos de duro estaño.
Huye luna, luna, luna.
Si vinieran los gitanos,
harían con tu corazón
collares y anillos blancos.
Niño, déjame que baile.
Cuando vengan los gitanos,
te encontrarán sobre el yunque
con los ojillos cerrados.
Huye luna, luna, luna,
que ya siento sus caballos.
Niño, déjame, no pises
mi blancor almidonado.
El jinete se acercaba
tocando el tambor del llano.
Dentro de la fragua el niño,
tiene los ojos cerrados.
Por el olivar venían,
bronce y sueño, los gitanos.
Las cabezas levantadas
y los ojos entornados.
Cómo canta la zumaya,
¡ay cómo canta en el árbol!
Por el cielo va la luna
con un niño de la mano.
Dentro de la fragua lloran,
dando gritos, los gitanos.
El aire la vela, vela.
El aire la está velando.`;

  const fragRomanceLunaLuna = await prisma.fragment.create({
    data: {
      slug: "romance-de-la-luna-luna",
      title: "Romance de la luna, luna",
      location: "Romancero gitano (1928)",
      headline: "Por el cielo va la luna / con un niño de la mano",
      text: romanceLunaLunaText,
      order: 1,
      status: "published",
      featured: false,
      workId: romanceroGitano.id,
      constellations: { connect: [{ slug: "muerte" }] },
      places: { connect: [{ slug: "granada" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragRomanceLunaLuna.id,
        type: "contexto",
        order: 1,
        content: `El Romancero gitano convirtió a Lorca en el poeta más popular de España en vida. Los 18 romances del libro convirtieron al gitano en figura mítica —no sociológica— de la cultura andaluza. La luna, la noche, la muerte y la pena son sus motivos dominantes.`,
      },
      {
        fragmentId: fragRomanceLunaLuna.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Romance: octosílabos con rima asonante en los pares en -ado. La forma clásica del romancero viejo —también en esta compilación— al servicio de una poética absolutamente moderna.`,
      },
      {
        fragmentId: fragRomanceLunaLuna.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `La luna personificada como figura femenina ambivalente: sensual («lúbrica y pura») y mortal. El paralelismo entre la advertencia al niño y su cumplimiento. La imagen final —la luna que «lleva un niño de la mano» por el cielo— es una de las más poderosas de toda la poesía española.`,
      },
      {
        fragmentId: fragRomanceLunaLuna.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `La luna como Muerte que viene a buscar al niño gitano. La naturaleza como fuerza fatal. El niño que no puede resistir la atracción de la luna. Un romance mítico que transforma el género popular en alta poesía.`,
      },
      {
        fragmentId: fragRomanceLunaLuna.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `Conecta con el Romance del enamorado y la muerte (Romancero viejo) por el motivo de la muerte que llega disfrazada de algo hermoso. Lorca renueva la forma del romance medieval con sensibilidad surrealista.`,
      },
    ],
  });

  const casadaInfielText = `Y que yo me la llevé al río
creyendo que era mozuela,
pero tenía marido.
Fue la noche de Santiago
y casi por compromiso.
Se apagaron los faroles
y se encendieron los grillos.
En las últimas esquinas
toqué sus pechos dormidos,
y se me abrieron de pronto
como ramos de jacintos.
El almidón de su enagua
me sonaba en el oído,
como una pieza de seda
rasgada por diez cuchillos.
Pasadas las zarzamoras,
los juncos y los espinos,
bajo su mata de pelo
hice un hoyo sobre el limo.
Me porté como quien soy.
Como un gitano legítimo.
La regalé un costurero
grande de raso pajizo,
y no quise enamorarme
porque teniendo marido
me dijo que era mozuela
cuando la llevaba al río.`;

  const fragCasadaInfiel = await prisma.fragment.create({
    data: {
      slug: "la-casada-infiel",
      title: "La casada infiel",
      location: "Romancero gitano (1928)",
      headline: "Me porté como quien soy. / Como un gitano legítimo.",
      text: casadaInfielText,
      order: 2,
      status: "published",
      featured: false,
      workId: romanceroGitano.id,
      constellations: { connect: [{ slug: "amor" }, { slug: "honor-y-valor" }] },
      places: { connect: [{ slug: "granada" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragCasadaInfiel.id,
        type: "contexto",
        order: 1,
        content: `La casada infiel es el romance más sensual del Romancero gitano. Narra en primera persona la voz de un gitano que tiene un encuentro sexual con una mujer casada que le mintió diciéndole que era soltera. El honor gitano —«me porté como quien soy»— no radica en rechazar la aventura sino en no enamorarse de una casada.`,
      },
      {
        fragmentId: fragCasadaInfiel.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Octosílabos con rima asonante en los pares en -ido. La regularidad del romance contrasta con la intensidad erótica del contenido.`,
      },
      {
        fragmentId: fragCasadaInfiel.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Narración en primera persona masculina. Las imágenes eróticas en clave metafórica (pechos como ramos de jacintos, la seda rasgada por diez cuchillos). La ironía final: el gitano no se enamora porque ella le mintió.`,
      },
      {
        fragmentId: fragCasadaInfiel.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El honor gitano como código propio: el gitano se porta bien según su propio código moral, no el convencional. La sensualidad de la naturaleza nocturna. La mujer que miente y el hombre que la castiga no enamorándose.`,
      },
      {
        fragmentId: fragCasadaInfiel.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `El romance conecta con la tradición de los romances de amor (gentil dama y rústico pastor) pero desde una perspectiva radicalmente nueva: el gitano como sujeto moral autónomo.`,
      },
    ],
  });

  const antonitoElCamborioText = `Antonio Torres Heredia,
hijo y nieto de Camborios,
con una vara de mimbre
va a Sevilla a ver los toros.
Moreno de verde luna,
anda despacio y garboso.
Sus empavonados bucles
le brillan entre los ojos.
A la mitad del camino
cortó limones redondos,
y los fue tirando al agua
hasta que la puso de oro.
Y a la mitad del camino,
bajo las ramas de un olmo,
guardia civil caminera
lo llevó codo con codo.
El día se va despacio,
la tarde colgada a un hombro,
dando una larga torera
sobre el mar y los arroyos.
Las aceitunas aguardan
la noche de Capricornio,
y una corta brisa, ecuestre,
salta los montes de plomo.
Antonio Torres Heredia,
hijo y nieto de Camborios,
viene sin vara de mimbre
entre los cinco tricornios.
—Antonio, ¿quién eres tú?
Si te llamaras Camborio,
hubieras hecho una fuente
de sangre con cinco chorros.
Ni tú eres hijo de nadie,
ni legítimo Camborio.
¡Se acabaron los gitanos
que iban por el monte solos!
Están los viejos cuchillos
tiritando bajo el polvo.
A las nueve de la noche
lo llevan al calabozo,
mientras los guardias civiles
beben limonada todos.
Y a las nueve de la noche
le cierran el calabozo,
mientras el cielo reluce
como la grupa de un potro.`;

  const fragAntonitoElCamborio = await prisma.fragment.create({
    data: {
      slug: "prendimiento-de-antonito-el-camborio",
      title: "Prendimiento de Antoñito el Camborio",
      location: "Romancero gitano (1928)",
      headline: "¡Se acabaron los gitanos / que iban por el monte solos!",
      text: antonitoElCamborioText,
      order: 3,
      status: "published",
      featured: false,
      workId: romanceroGitano.id,
      constellations: { connect: [{ slug: "honor-y-valor" }, { slug: "poder" }] },
      places: { connect: [{ slug: "sevilla" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragAntonitoElCamborio.id,
        type: "contexto",
        order: 1,
        content: `El poema fue dedicado a Margarita Xirgu, la actriz amiga de Lorca que estrenó Mariana Pineda y Bodas de sangre. La guardia civil como antagonista del gitano es uno de los motivos más recurrentes del Romancero gitano.`,
      },
      {
        fragmentId: fragAntonitoElCamborio.id,
        type: "figura",
        category: "sonoro",
        order: 1,
        content: `Octosílabos con rima asonante en los pares en -os. La regularidad del romance como forma de la tradición que Lorca renueva desde dentro.`,
      },
      {
        fragmentId: fragAntonitoElCamborio.id,
        type: "figura",
        category: "tropo",
        order: 2,
        content: `Retrato inicial del gitano con detalles precisos y poéticos (moreno de verde luna, bucles empavonados). El contraste entre la elegancia del gitano y la brutalidad de la detención. El reproche del gitano a sí mismo en el tercer bloque.`,
      },
      {
        fragmentId: fragAntonitoElCamborio.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El gitano como figura mítica de la dignidad. La guardia civil como fuerza represora del mundo gitano. El lamento de que ya no quedan gitanos valientes que vayan «por el monte solos».`,
      },
      {
        fragmentId: fragAntonitoElCamborio.id,
        type: "intertextualidad",
        linkType: "external",
        order: 1,
        content: `El nombre de Antoñito el Camborio aparece también en el poema Sorpresa (Poema del Cante Jondo), también en esta compilación. La guardia civil como fuerza represora es un tema que Lorca desarrollará en otros poemas del Romancero.`,
      },
    ],
  });

  console.log("Listo.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
