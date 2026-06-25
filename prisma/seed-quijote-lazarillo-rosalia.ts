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
  const quijote = await prisma.work.findFirstOrThrow({ where: { slug: "don-quijote-de-la-mancha" } });
  const lazarillo = await prisma.work.findFirstOrThrow({ where: { slug: "lazarillo-de-tormes" } });
  const rosaliaAuthor = await prisma.author.findFirstOrThrow({ where: { slug: "rosalia-de-castro" } });
  const consCriticaSocial = await prisma.constellation.findFirstOrThrow({ where: { slug: "critica-social" } });
  const consHonorValor = await prisma.constellation.findFirstOrThrow({ where: { slug: "honor-y-valor" } });

  // ──────────────────────────────────────────────────────────────
  // REORDER existing Quijote fragments (orden narrativo por capítulo)
  // ──────────────────────────────────────────────────────────────
  console.log("Reordenando fragmentos del Quijote...");
  await prisma.fragment.update({ where: { slug: "en-un-lugar-de-la-mancha" }, data: { order: 1 } });
  await prisma.fragment.update({ where: { slug: "los-molinos-de-viento" }, data: { order: 4 } });
  await prisma.fragment.update({ where: { slug: "la-aventura-de-los-batanes" }, data: { order: 7 } });
  await prisma.fragment.update({ where: { slug: "consejos-a-sancho-linaje-y-justicia" }, data: { order: 9 } });
  await prisma.fragment.update({ where: { slug: "consejos-a-sancho-aseo-y-modales" }, data: { order: 10 } });
  await prisma.fragment.update({ where: { slug: "la-muerte-de-don-quijote" }, data: { order: 12 } });

  // ──────────────────────────────────────────────────────────────
  // QUIJOTE 1/6 — Yo sé quién soy (1ª parte, cap. V) — orden 2
  // ──────────────────────────────────────────────────────────────
  const yoSeText = `—Mire vuestra merced, señor, pecador de mí, que yo no soy don Rodrigo de Narváez, ni el marqués de Mantua, sino Pedro Alonso, su vecino; ni vuestra merced es Valdovinos, ni Abindarráez, sino el honrado hidalgo del señor Quijana.

—Yo sé quién soy —respondió don Quijote—, y sé que puedo ser, no solo los que he dicho, sino todos los Doce Pares de Francia, y aun todos los nueve de la Fama, pues a todas las hazañas que ellos todos juntos y cada uno por sí hicieron se aventajarán las mías.`;

  console.log("Creando Yo sé quién soy...");
  const fragYoSe = await prisma.fragment.create({
    data: {
      slug: "yo-se-quien-soy",
      title: "Yo sé quién soy",
      location: "El ingenioso hidalgo don Quijote de la Mancha, 1ª parte, cap. V",
      headline: "«Yo sé quién soy, y sé que puedo ser»",
      text: yoSeText,
      order: 2,
      status: "published",
      workId: quijote.id,
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragYoSe.id,
        type: "glosa",
        ...anchor(yoSeText, "marqués de Mantua"),
        order: 1,
        content: `Personaje del *Romancero* y de los libros de caballerías. Junto con Valdovinos y Abindarráez, forma parte del repertorio de figuras heroicas que don Quijote, recién apaleado, confunde con su propia identidad.`,
      },
      {
        fragmentId: fragYoSe.id,
        type: "glosa",
        ...anchor(yoSeText, "los nueve de la Fama"),
        order: 2,
        content: `Los «Nueve de la Fama» (Nine Worthies) eran un grupo canónico de nueve héroes —tres paganos, tres judíos, tres cristianos— modelo de virtud caballeresca en la tradición medieval, junto a los Doce Pares de Francia.`,
      },
      {
        fragmentId: fragYoSe.id,
        type: "contexto",
        ...anchor(yoSeText, "pecador de mí"),
        order: 1,
        content: `Pedro Alonso, el labrador vecino que encuentra a don Quijote malherido tras la paliza de los mercaderes, intenta devolverlo a la cordura nombrando su identidad real («el honrado hidalgo del señor Quijana»). La respuesta de don Quijote no niega ese nombre: lo trasciende.`,
      },
      {
        fragmentId: fragYoSe.id,
        type: "figura",
        category: "topos",
        ...anchor(yoSeText, "Yo sé quién soy"),
        order: 1,
        content: `Esta breve réplica es uno de los pasajes más comentados del *Quijote*: condensa el tema central de la novela —la construcción voluntaria de la propia identidad frente a la identidad que el mundo atribuye— en solo cuatro palabras.`,
      },
      {
        fragmentId: fragYoSe.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Qué nombres le da el labrador a don Quijote, y con qué nombre lo corrige?`,
      },
      {
        fragmentId: fragYoSe.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 2,
        content: `Don Quijote no dice «yo soy Alonso Quijano», sino «yo sé quién soy». ¿Qué diferencia hay entre afirmar una identidad heredada y afirmar una identidad elegida? ¿Te parece una locura o una forma de libertad?`,
      },
    ],
  });

  // ──────────────────────────────────────────────────────────────
  // QUIJOTE 2/6 — La quema de la biblioteca (1ª parte, cap. VI) — orden 3
  // ──────────────────────────────────────────────────────────────
  const quemaText = `Pidió las llaves a la sobrina del aposento donde estaban los libros autores del daño, y ella se las dio de muy buena gana. Entraron dentro todos, y la ama con ellos, y hallaron más de cien cuerpos de libros grandes, muy bien encuadernados, y otros pequeños; y, así como el ama los vio, volvióse a salir del aposento con gran priesa, y tornó luego con una escudilla de agua bendita y un hisopo, y dijo:

—Tome vuestra merced, señor licenciado; rocíe este aposento, no esté aquí algún encantador de los muchos que tienen estos libros, y nos encanten, en pena de las que les queremos dar echándolos del mundo.

Causó risa al licenciado la simplicidad del ama, y mandó al barbero que le fuese dando de aquellos libros uno a uno, para ver de qué trataban, pues podía ser hallar algunos que no mereciesen castigo de fuego.

—No —dijo la sobrina—, no hay para qué perdonar a ninguno, porque todos han sido los dañadores: mejor será arrojallos por las ventanas al patio y hacer un rimero dellos y pegarles fuego; y, si no, llevarlos al corral, y allí se hará la hoguera, y no ofenderá el humo.

Lo mismo dijo el ama: tal era la gana que las dos tenían de la muerte de aquellos inocentes; mas el cura no vino en ello sin primero leer siquiera los títulos. Y el primero que maese Nicolás le dio en las manos fue Los cuatro de Amadís de Gaula, y dijo el cura:

—Parece cosa de misterio esta, porque, según he oído decir, este libro fue el primero de caballerías que se imprimió en España, y todos los demás han tomado principio y origen deste; y, así, me parece que, como a dogmatizador de una secta tan mala, le debemos sin escusa alguna condenar al fuego.

—No, señor —dijo el barbero—, que también he oído decir que es el mejor de todos los libros que de este género se han compuesto; y así, como a único en su arte, se debe perdonar.

—Así es verdad —dijo el cura—, y por esa razón se le otorga la vida por ahora.

[...]

Abrióse otro libro y vieron que tenía por título El caballero de la Cruz.

—Por nombre tan santo como este libro tiene, se podía perdonar su ignorancia; mas también se suele decir «tras la cruz está el diablo». Vaya al fuego.`;

  console.log("Creando La quema de la biblioteca...");
  const fragQuema = await prisma.fragment.create({
    data: {
      slug: "quema-de-la-biblioteca",
      title: "La quema de la biblioteca",
      location: "El ingenioso hidalgo don Quijote de la Mancha, 1ª parte, cap. VI",
      headline: "«Tras la cruz está el diablo. Vaya al fuego»",
      text: quemaText,
      order: 3,
      status: "published",
      workId: quijote.id,
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragQuema.id,
        type: "glosa",
        ...anchor(quemaText, "rimero"),
        order: 1,
        content: `«Montón» o «pila». La sobrina propone amontonar los libros en el patio para quemarlos todos juntos, sin más trámite.`,
      },
      {
        fragmentId: fragQuema.id,
        type: "glosa",
        ...anchor(quemaText, "tras la cruz está el diablo"),
        order: 2,
        content: `Refrán castellano: bajo la apariencia más santa puede ocultarse lo peor. El cura lo usa como sentencia final, sin más argumento, para condenar un libro cuyo único defecto comprobado es el título.`,
      },
      {
        fragmentId: fragQuema.id,
        type: "contexto",
        ...anchor(quemaText, "no vino en ello sin primero leer siquiera los títulos"),
        order: 1,
        content: `La escena parodia un auto de fe inquisitorial: hay acusación, examen, sentencia y hoguera, pero el «tribunal» son un cura, un barbero, un ama y una sobrina, y el criterio de condena cambia caprichosamente de un libro a otro —a veces el estilo, a veces el título, a veces solo el azar de estar «junto a» un libro ya condenado.`,
      },
      {
        fragmentId: fragQuema.id,
        type: "figura",
        category: "tropo",
        ...anchor(quemaText, "no esté aquí algún encantador"),
        order: 1,
        content: `**Ironía**: el ama, supersticiosa, pide rociar la habitación con agua bendita por temor a los «encantadores» de los libros de caballerías, sin notar que ella misma vive dentro del mismo régimen de creencias fantásticas que censura.`,
      },
      {
        fragmentId: fragQuema.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El criterio del cura para salvar o condenar cada libro cambia constantemente —unas veces es el estilo, otras la fama, otras pura arbitrariedad—. ¿Qué crítica esconde Cervantes sobre quién decide qué se puede leer y qué no?`,
      },
      {
        fragmentId: fragQuema.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 2,
        content: `¿Te parece que esta escena sigue teniendo algo que decir hoy, en debates sobre censura de libros o de contenidos?`,
      },
    ],
  });

  // ──────────────────────────────────────────────────────────────
  // QUIJOTE 3/6 — Discurso de la Edad de Oro (1ª parte, cap. XI) — orden 5
  // ──────────────────────────────────────────────────────────────
  const edadOroText = `—Dichosa edad y siglos dichosos aquellos a quien los antiguos pusieron nombre de dorados, y no porque en ellos el oro, que en esta nuestra edad de hierro tanto se estima, se alcanzase en aquella venturosa sin fatiga alguna, sino porque entonces los que en ella vivían ignoraban estas dos palabras de tuyo y mío. Eran en aquella santa edad todas las cosas comunes: a nadie le era necesario para alcanzar su ordinario sustento tomar otro trabajo que alzar la mano y alcanzarle de las robustas encinas, que liberalmente les estaban convidando con su dulce y sazonado fruto.

[...]

Todo era paz entonces, todo amistad, todo concordia: aún no se había atrevido la pesada reja del corvo arado a abrir ni visitar las entrañas piadosas de nuestra primera madre; que ella sin ser forzada ofrecía, por todas las partes de su fértil y espacioso seno, lo que pudiese hartar, sustentar y deleitar a los hijos que entonces la poseían.

[...]

No había la fraude, el engaño ni la malicia mezcládose con la verdad y llaneza. La justicia se estaba en sus proprios términos, sin que la osasen turbar ni ofender los del favor y los del interese, que tanto ahora la menoscaban, turban y persiguen.`;

  console.log("Creando Discurso de la Edad de Oro...");
  const fragEdadOro = await prisma.fragment.create({
    data: {
      slug: "discurso-edad-de-oro",
      title: "Discurso de la Edad de Oro",
      location: "El ingenioso hidalgo don Quijote de la Mancha, 1ª parte, cap. XI",
      headline: "«Ignoraban estas dos palabras de tuyo y mío»",
      text: edadOroText,
      order: 5,
      status: "published",
      workId: quijote.id,
      topics: { connect: [{ slug: "beatus-ille" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragEdadOro.id,
        type: "glosa",
        ...anchor(edadOroText, "tuyo y mío"),
        order: 1,
        content: `Don Quijote sitúa el origen de todos los males sociales en la aparición de la propiedad privada: cuando se empezó a distinguir «lo tuyo» de «lo mío», terminó la armonía primitiva.`,
      },
      {
        fragmentId: fragEdadOro.id,
        type: "contexto",
        ...anchor(edadOroText, "Dichosa edad y siglos dichosos"),
        order: 1,
        content: `Don Quijote pronuncia este discurso ante unos cabreros, mientras come bellotas con ellos, en plena naturaleza. La situación —comida sencilla, compañía rústica, paisaje no cultivado— sirve de pretexto para evocar el mito clásico de la Edad de Oro, presente en Hesíodo, Ovidio y la tradición pastoril renacentista.`,
      },
      {
        fragmentId: fragEdadOro.id,
        type: "figura",
        category: "topos",
        ...anchor(edadOroText, "Eran en aquella santa edad todas las cosas comunes"),
        order: 1,
        content: `**Edad de Oro**: tópico clásico que imagina un pasado remoto sin propiedad, sin trabajo forzado y sin injusticia. Aquí se combina con el *locus amoenus* —encinas, fuentes, ríos— para construir un contraste con la «edad de hierro» presente, corrompida por el interés.`,
      },
      {
        fragmentId: fragEdadOro.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(edadOroText, "Todo era paz entonces, todo amistad, todo concordia"),
        order: 2,
        content: `**Anáfora y asíndeton**: la repetición de «todo» sin conjunciones acumula los valores de la Edad de Oro en una enumeración vertiginosa, imitando con el ritmo la idea de abundancia sin esfuerzo que describe.`,
      },
      {
        fragmentId: fragEdadOro.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `¿Por qué don Quijote, un personaje obsesionado con las novelas de caballerías, pronuncia aquí un discurso que no tiene nada de disparatado y que muchos lectores consideran lúcido?`,
      },
    ],
  });

  // ──────────────────────────────────────────────────────────────
  // QUIJOTE 4/6 — Discurso de Marcela (1ª parte, cap. XIV) — orden 6
  // ──────────────────────────────────────────────────────────────
  const marcelaText = `—No vengo, ¡oh Ambrosio!, a ninguna cosa de las que has dicho —respondió Marcela—, sino a volver por mí misma y a dar a entender cuán fuera de razón van todos aquellos que de sus penas y de la muerte de Grisóstomo me culpan.

[...]

Yo nací libre, y para poder vivir libre escogí la soledad de los campos: los árboles destas montañas son mi compañía; las claras aguas destos arroyos, mis espejos; con los árboles y con las aguas comunico mis pensamientos y hermosura. Fuego soy apartado y espada puesta lejos. A los que he enamorado con la vista he desengañado con las palabras; y si los deseos se sustentan con esperanzas, no habiendo yo dado alguna a Grisóstomo, ni a otro alguno el fin de ninguno dellos, bien se puede decir que antes le mató su porfía que mi crueldad.

[...]

Porfió desengañado, desesperó sin ser aborrecido: ¡mirad ahora si será razón que de su pena se me dé a mí la culpa!`;

  console.log("Creando Discurso de Marcela...");
  const fragMarcela = await prisma.fragment.create({
    data: {
      slug: "discurso-de-marcela",
      title: "Discurso de Marcela",
      location: "El ingenioso hidalgo don Quijote de la Mancha, 1ª parte, cap. XIV",
      headline: "«Yo nací libre, y para poder vivir libre escogí la soledad de los campos»",
      text: marcelaText,
      order: 6,
      status: "published",
      workId: quijote.id,
      constellations: { connect: [{ id: consHonorValor.id }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragMarcela.id,
        type: "glosa",
        ...anchor(marcelaText, "Porfió desengañado"),
        order: 1,
        content: `«Porfiar» es insistir obstinadamente; «desengañado» significa aquí que Grisóstomo sabía perfectamente que Marcela no le amaba y, aun así, persistió en amarla hasta morir de pena.`,
      },
      {
        fragmentId: fragMarcela.id,
        type: "contexto",
        ...anchor(marcelaText, "cuán fuera de razón van todos aquellos que de sus penas y de la muerte de Grisóstomo me culpan"),
        order: 1,
        content: `Marcela aparece junto a la tumba del pastor Grisóstomo, que ha muerto de amor no correspondido por ella, y ante un grupo que la culpa de esa muerte. En vez de defenderse con disculpas, pronuncia un discurso de autoafirmación que invierte la acusación.`,
      },
      {
        fragmentId: fragMarcela.id,
        type: "figura",
        category: "topos",
        ...anchor(marcelaText, "Yo nací libre, y para poder vivir libre escogí la soledad de los campos"),
        order: 1,
        content: `Marcela reformula el tópico pastoril del *beatus ille* —la vida sencilla alejada del mundo— no como huida de un fracaso, sino como ejercicio activo de libertad personal: ella elige la soledad, no la sufre.`,
      },
      {
        fragmentId: fragMarcela.id,
        type: "figura",
        category: "tropo",
        ...anchor(marcelaText, "Fuego soy apartado y espada puesta lejos"),
        order: 2,
        content: `**Metáfora**: Marcela se compara con un fuego que no quema a quien no se acerca y una espada que no corta a quien no la empuña —su belleza solo hiere a quien decide perseguirla, no por voluntad propia.`,
      },
      {
        fragmentId: fragMarcela.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `Este discurso se ha leído como una de las primeras defensas literarias de la autonomía femenina en español. ¿Qué argumentos da Marcela contra la idea de que ser amada obliga a amar?`,
      },
    ],
  });

  // ──────────────────────────────────────────────────────────────
  // QUIJOTE 5/6 — Discurso de las armas y las letras (1ª parte, cap. XXXVII-XXXVIII) — orden 8
  // ──────────────────────────────────────────────────────────────
  const armasLetrasText = `Y a veces suele ser su desnudez tanta, que un coleto acuchillado le sirve de gala y de camisa, y en la mitad del invierno se suele reparar de las inclemencias del cielo, estando en la campaña rasa, con solo el aliento de su boca, que, como sale de lugar vacío, tengo por averiguado que debe de salir frío, contra toda naturaleza.

[...]

Lléguese, pues, a todo esto, el día y la hora de recebir el grado de su ejercicio: lléguese un día de batalla, que allí le pondrán la borla en la cabeza, hecha de hilas, para curarle algún balazo que quizá le habrá pasado las sienes o le dejará estropeado de brazo o pierna. Y cuando esto no suceda, sino que el cielo piadoso le guarde y conserve sano y vivo, podrá ser que se quede en la mesma pobreza que antes estaba [...] Pero, decidme, señores, si habéis mirado en ello: ¿cuán menos son los premiados por la guerra que los que han perecido en ella?

[...]

Dicen las letras que sin ellas no se podrían sustentar las armas, porque la guerra también tiene sus leyes y está sujeta a ellas, y que las leyes caen debajo de lo que son letras y letrados. A esto responden las armas que las leyes no se podrán sustentar sin ellas, porque con las armas se defienden las repúblicas, se conservan los reinos, se guardan las ciudades, se aseguran los caminos, se despejan los mares de cosarios.`;

  console.log("Creando Discurso de las armas y las letras...");
  const fragArmasLetras = await prisma.fragment.create({
    data: {
      slug: "discurso-armas-y-letras",
      title: "Discurso de las armas y las letras",
      location: "El ingenioso hidalgo don Quijote de la Mancha, 1ª parte, cap. XXXVII-XXXVIII",
      headline: "«¿Cuán menos son los premiados por la guerra que los que han perecido en ella?»",
      text: armasLetrasText,
      order: 8,
      status: "published",
      workId: quijote.id,
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragArmasLetras.id,
        type: "glosa",
        ...anchor(armasLetrasText, "coleto acuchillado"),
        order: 1,
        content: `Prenda de cuero ajustada al cuerpo, aquí ya cortada y deteriorada por el uso. El soldado la lleva como única ropa, «de gala y de camisa», por no tener otra cosa que ponerse.`,
      },
      {
        fragmentId: fragArmasLetras.id,
        type: "glosa",
        ...anchor(armasLetrasText, "la borla en la cabeza, hecha de hilas"),
        order: 2,
        content: `Juego de palabras amargo: la «borla» era el símbolo del grado universitario (doctor); aquí, al soldado herido le «ponen la borla» con hilas (vendas), es decir, su único «título» es la herida de guerra.`,
      },
      {
        fragmentId: fragArmasLetras.id,
        type: "contexto",
        ...anchor(armasLetrasText, "los premiados por la guerra que los que han perecido en ella"),
        order: 1,
        content: `Don Quijote pronuncia este discurso durante una cena, ante oyentes cultos que esperan oír sus delirios caballerescos y en cambio reciben una disertación coherente y bien argumentada sobre la superioridad de las armas frente a las letras —uno de los pasajes donde la cordura de don Quijote sorprende incluso a quien lo cree loco.`,
      },
      {
        fragmentId: fragArmasLetras.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(armasLetrasText, "se defienden las repúblicas, se conservan los reinos, se guardan las ciudades, se aseguran los caminos, se despejan los mares de cosarios"),
        order: 1,
        content: `**Paralelismo y gradación**: la enumeración de verbos en pasiva refleja («se defienden... se conservan... se guardan... se aseguran... se despejan») construye, mediante estructuras idénticas, la acumulación de razones a favor de las armas.`,
      },
      {
        fragmentId: fragArmasLetras.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Qué argumento da don Quijote para sostener que el soldado sufre más pobreza que el estudiante?`,
      },
      {
        fragmentId: fragArmasLetras.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 2,
        content: `¿Qué profesiones de nuestra época podrían ocupar hoy el lugar de las «armas» y las «letras» en un debate similar sobre mérito y reconocimiento social?`,
      },
    ],
  });

  // ──────────────────────────────────────────────────────────────
  // QUIJOTE 6/6 — Discurso de la libertad (2ª parte, cap. LVIII) — orden 11
  // ──────────────────────────────────────────────────────────────
  const libertadText = `—La libertad, Sancho, es uno de los más preciosos dones que a los hombres dieron los cielos; con ella no pueden igualarse los tesoros que encierra la tierra ni el mar encubre; por la libertad así como por la honra se puede y debe aventurar la vida, y, por el contrario, el cautiverio es el mayor mal que puede venir a los hombres. Digo esto, Sancho, porque bien has visto el regalo, la abundancia que en este castillo que dejamos hemos tenido; pues en mitad de aquellos banquetes sazonados y de aquellas bebidas de nieve me parecía a mí que estaba metido entre las estrechezas de la hambre, porque no lo gozaba con la libertad que lo gozara si fueran míos, que las obligaciones de las recompensas de los beneficios y mercedes recebidas son ataduras que no dejan campear al ánimo libre. ¡Venturoso aquel a quien el cielo dio un pedazo de pan sin que le quede obligación de agradecerlo a otro que al mismo cielo!`;

  console.log("Creando Discurso de la libertad...");
  const fragLibertad = await prisma.fragment.create({
    data: {
      slug: "discurso-de-la-libertad",
      title: "Discurso de la libertad",
      location: "El ingenioso hidalgo don Quijote de la Mancha, 2ª parte, cap. LVIII",
      headline: "«La libertad, Sancho, es uno de los más preciosos dones»",
      text: libertadText,
      order: 11,
      status: "published",
      workId: quijote.id,
      constellations: { connect: [{ id: consHonorValor.id }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragLibertad.id,
        type: "glosa",
        ...anchor(libertadText, "campear al ánimo libre"),
        order: 1,
        content: `«Campear» significa aquí desenvolverse o lucirse libremente, como en campo abierto. Las obligaciones de gratitud, dice don Quijote, son «ataduras» que impiden que el espíritu libre se mueva a su gusto.`,
      },
      {
        fragmentId: fragLibertad.id,
        type: "contexto",
        ...anchor(libertadText, "el regalo, la abundancia que en este castillo que dejamos hemos tenido"),
        order: 1,
        content: `Don Quijote y Sancho acaban de abandonar el castillo de los Duques, donde fueron agasajados con lujo a cambio de servir de entretenimiento para las burlas de sus anfitriones. El discurso revela que don Quijote, pese a la comodidad, sintió esa hospitalidad como una forma sutil de cautiverio.`,
      },
      {
        fragmentId: fragLibertad.id,
        type: "figura",
        category: "tropo",
        ...anchor(libertadText, "con ella no pueden igualarse los tesoros que encierra la tierra ni el mar encubre"),
        order: 1,
        content: `**Hipérbole**: ningún tesoro de la tierra ni del mar —es decir, ninguna riqueza imaginable— puede compararse al valor de la libertad. La desmesura subraya el carácter absoluto del bien que se está ponderando.`,
      },
      {
        fragmentId: fragLibertad.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `¿Por qué la generosidad de los Duques puede sentirse, según don Quijote, como una forma de «atadura» en vez de un regalo sin condiciones?`,
      },
    ],
  });

  console.log("✓ Quijote: 6 fragmentos nuevos creados.");

  // ════════════════════════════════════════════════════════════
  // LAZARILLO
  // ════════════════════════════════════════════════════════════
  console.log("Reordenando fragmentos del Lazarillo...");
  await prisma.fragment.update({ where: { slug: "el-toro-de-salamanca" }, data: { order: 2 } });
  await prisma.fragment.update({ where: { slug: "el-jarro-de-vino" }, data: { order: 3 } });
  await prisma.fragment.update({ where: { slug: "el-racimo-de-uvas" }, data: { order: 4 } });

  // ──────────────────────────────────────────────────────────────
  // LAZARILLO 1/4 — Prólogo: la honra cría las artes — orden 1
  // ──────────────────────────────────────────────────────────────
  const prologoText = `Yo por bien tengo que cosas tan señaladas y por ventura nunca oídas ni vistas vengan a noticia de muchos y no se entierren en la sepultura del olvido, pues podría ser que alguno que las lea halle algo que le agrade y a los que no ahondaren tanto los deleite.

[...]

Porque si así no fuese, muy pocos escribirían para uno solo, pues no se hace sin trabajo, y quieren, ya que lo pasan, ser recompensados, no con dineros, mas con que vean y lean sus obras y, si hay de qué, se las alaben. Y a este propósito dice Tulio: «La honra cría las artes.»

¿Quién piensa que el soldado, que es primero del escala, tiene más aborrecido el vivir? No por cierto; mas el deseo de alabanza le hace ponerse al peligro; y así, en las artes y letras es lo mismo. Predica muy bien el presentado y es hombre que desea mucho el provecho de las ánimas; mas pregunten a su merced si le pesa cuando le dicen: «¡Oh qué maravillosamente lo ha hecho vuestra reverencia!» Justó muy ruinmente el señor don Fulano, y dio el sayete de armas al truhán porque le loaba de haber llevado muy buenas lanzas: ¿qué hiciera si fuera verdad?`;

  console.log("Creando Prólogo (la honra cría las artes)...");
  const fragPrologo = await prisma.fragment.create({
    data: {
      slug: "prologo-honra-cria-las-artes",
      title: "Prólogo",
      location: "La vida de Lazarillo de Tormes, Prólogo",
      headline: "«La honra cría las artes»",
      text: prologoText,
      order: 1,
      status: "published",
      workId: lazarillo.id,
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragPrologo.id,
        type: "glosa",
        ...anchor(prologoText, "Tulio"),
        order: 1,
        content: `Nombre con el que se conocía a Marco Tulio Cicerón, orador y filósofo romano, citado aquí como autoridad clásica para justificar que la fama y la alabanza —no solo el dinero— mueven a los hombres a crear.`,
      },
      {
        fragmentId: fragPrologo.id,
        type: "glosa",
        ...anchor(prologoText, "el sayete de armas al truhán"),
        order: 2,
        content: `Un caballero que ha justado («combatido a caballo») torpemente regala su propia prenda de armas a un truhán (bufón) por el simple hecho de que este le ha dicho, falsamente, que lo hizo muy bien. El ejemplo ridiculiza la sed de alabanza, aunque sea inmerecida.`,
      },
      {
        fragmentId: fragPrologo.id,
        type: "contexto",
        ...anchor(prologoText, "no se entierren en la sepultura del olvido"),
        order: 1,
        content: `El prólogo cumple la función retórica clásica de captar el favor del lector (*captatio benevolentiae*) justificando por qué merece la pena contar una vida tan humilde como la de Lázaro. El autor anónimo se ampara en la autoridad de Plinio y Cicerón para defender su derecho a publicar.`,
      },
      {
        fragmentId: fragPrologo.id,
        type: "figura",
        category: "topos",
        ...anchor(prologoText, "La honra cría las artes"),
        order: 1,
        content: `Sentencia que resume la tesis del prólogo: no es el provecho material, sino el deseo de honra y reconocimiento, lo que empuja tanto al soldado a arriesgar la vida como al escritor a publicar su obra.`,
      },
      {
        fragmentId: fragPrologo.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El narrador justifica contar "su vida tan baja" apelando a la honra y al deseo de ser leído. ¿Qué tiene de irónico que sea precisamente un pícaro —alguien sin honra social— quien reivindique este argumento?`,
      },
    ],
  });

  // ──────────────────────────────────────────────────────────────
  // LAZARILLO 2/4 — El arca del pan (Tratado segundo) — orden 5
  // ──────────────────────────────────────────────────────────────
  const arcaText = `Escapé del trueno y di en el relámpago, porque era el ciego para con éste un Alejandro Magno, con ser la mesma avaricia, como he contado. No digo más sino que toda la laceria del mundo estaba encerrada en éste. No sé si de su cosecha era, o lo había anexado con el hábito de clerecia.

Él tenía un arcaz viejo y cerrado con su llave, la cual traía atada con un agujeta del paletoque. Y en viniendo el bodigo de la iglesia, por su mano era luego allí lanzado, y tornada a cerrar el arca. Y en toda la casa no había ninguna cosa de comer, como suele estar en otras: algún tocino colgado al humero, algún queso puesto en alguna tabla o en el armario, algún canastillo con algunos pedazos de pan que de la mesa sobran. Que me parece a mí que aunque dello no me aprovechara, con la vista dello me consolara.

Solamente había una horca de cebollas, y tras la llave en una cámara en lo alto de la casa. Déstas tenía yo de ración una para cada cuatro días; y cuando le pedía la llave para ir por ella, si alguno estaba presente, echaba mano al falsopecto y con gran continencia la desataba y me la daba diciendo: «Toma, y vuélvela luego, y no hagáis sino golosinar.»`;

  console.log("Creando El arca del pan...");
  const fragArca = await prisma.fragment.create({
    data: {
      slug: "el-arca-del-pan",
      title: "El arca del pan",
      location: "La vida de Lazarillo de Tormes, Tratado segundo",
      headline: "«Escapé del trueno y di en el relámpago»",
      text: arcaText,
      order: 5,
      status: "published",
      workId: lazarillo.id,
      constellations: { connect: [{ id: consCriticaSocial.id }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragArca.id,
        type: "glosa",
        ...anchor(arcaText, "laceria"),
        order: 1,
        content: `«Lacería» o «laceria»: miseria, escasez extrema. Lázaro dice que toda la miseria del mundo estaba «encerrada» en este clérigo, jugando con el doble sentido de encerrar —tanto la avaricia del amo como el pan que guarda bajo llave.`,
      },
      {
        fragmentId: fragArca.id,
        type: "glosa",
        ...anchor(arcaText, "bodigo"),
        order: 2,
        content: `Panecillo que los fieles ofrecían en la iglesia como ofrenda. El clérigo lo requisa para sí en cuanto llega, sin compartirlo con Lázaro.`,
      },
      {
        fragmentId: fragArca.id,
        type: "contexto",
        ...anchor(arcaText, "porque era el ciego para con éste un Alejandro Magno"),
        order: 1,
        content: `Lázaro compara a su primer amo, el ciego avaro, con Alejandro Magno —sinónimo de generosidad sin límites— frente a la mezquindad del clérigo de Maqueda, su segundo amo. La estructura de la novela picaresca avanza así de mal en peor: cada nuevo amo supera en miseria al anterior.`,
      },
      {
        fragmentId: fragArca.id,
        type: "figura",
        category: "tropo",
        ...anchor(arcaText, "Escapé del trueno y di en el relámpago"),
        order: 1,
        content: `**Metáfora proverbial**: huir de un mal para caer en otro peor, como quien escapa del estruendo del trueno solo para recibir el relámpago. Resume en seis palabras la estructura entera del tratado.`,
      },
      {
        fragmentId: fragArca.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Qué hace el clérigo con la llave del arca cada vez que llega comida a la casa?`,
      },
      {
        fragmentId: fragArca.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 2,
        content: `El clérigo es un representante de la Iglesia, institución que predicaba la caridad. ¿Qué efecto produce ese contraste entre lo que debería representar y cómo se comporta?`,
      },
    ],
  });

  // ──────────────────────────────────────────────────────────────
  // LAZARILLO 3/4 — La negra honra (Tratado tercero) — orden 6
  // ──────────────────────────────────────────────────────────────
  const negraHonraText = `¡Bendito seáis vos, Señor —quedé yo diciendo—, que dais la enfermedad y ponéis el remedio! ¿Quién encontrará a aquel mi señor que no piense, según el contento de sí lleva, haber anoche bien cenado y dormido en buena cama, y aun agora es de mañana, no le cuenten por muy bien almorzado? ¡Grandes secretos son, Señor, los que vos hacéis y las gentes ignoran! [...] ¡Oh Señor, y cuántos de aquéstos debéis vos tener por el mundo derramados, que padecen por la negra que llaman honra lo que por vos no sufrirían!

[...]

Y verle venir a mediodía la calle abajo con estirado cuerpo, más largo que galgo de buena casta! Y por lo que toca a su negra que dicen honra, tomaba una paja de las que aun asaz no había en casa, y salía a la puerta escarbando los dientes que nada entre sí tenían, quejándose todavía de aquel mal solar diciendo:

—Malo está de ver, que la desdicha desta vivienda lo hace. Como ves, es lóbrega, triste, oscura. Mientras aquí estuviéremos, hemos de padecer. Ya deseo que se acabe este mes por salir de ella.`;

  console.log("Creando La negra honra...");
  const fragNegraHonra = await prisma.fragment.create({
    data: {
      slug: "la-negra-honra",
      title: "La negra honra",
      location: "La vida de Lazarillo de Tormes, Tratado tercero",
      headline: "«Padecen por la negra que llaman honra»",
      text: negraHonraText,
      order: 6,
      status: "published",
      workId: lazarillo.id,
      constellations: { connect: [{ id: consCriticaSocial.id }, { id: consHonorValor.id }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragNegraHonra.id,
        type: "glosa",
        ...anchor(negraHonraText, "escarbando los dientes que nada entre sí tenían"),
        order: 1,
        content: `El escudero se hurga los dientes con una paja a la puerta de su casa, fingiendo ante los vecinos que acaba de comer copiosamente, cuando en realidad no tiene nada que llevarse a la boca.`,
      },
      {
        fragmentId: fragNegraHonra.id,
        type: "glosa",
        ...anchor(negraHonraText, "estirado cuerpo, más largo que galgo de buena casta"),
        order: 2,
        content: `El hambre da al escudero una figura artificialmente erguida y estirada —se compara, con humor cruel, a la silueta esbelta de un galgo de raza— que él convierte en gesto de distinción aristocrática.`,
      },
      {
        fragmentId: fragNegraHonra.id,
        type: "contexto",
        ...anchor(negraHonraText, "la negra que llaman honra"),
        order: 1,
        content: `El escudero es un hidalgo pobre que prefiere pasar hambre antes que servir, mendigar o trabajar, porque cualquiera de esas opciones mancharía su «honra» de nacimiento. Esta misma crítica a la honra como apariencia vacía reaparece en la Carta XIII de Cadalso, casi dos siglos después: la denuncia de un mérito basado en el nacimiento y no en los hechos atraviesa la literatura española del Lazarillo a la Ilustración.`,
      },
      {
        fragmentId: fragNegraHonra.id,
        type: "figura",
        category: "tropo",
        ...anchor(negraHonraText, "la negra que llaman honra"),
        order: 1,
        content: `**Epíteto irónico**: calificar la honra de «negra» —es decir, funesta, aciaga— invierte su valor social positivo. Lo que debería ser motivo de orgullo se convierte en la causa directa del hambre y el sufrimiento del escudero.`,
      },
      {
        fragmentId: fragNegraHonra.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `¿Por qué Lázaro siente más lástima por el escudero, que lo mata de hambre, que por el clérigo del tratado anterior?`,
      },
      {
        fragmentId: fragNegraHonra.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 2,
        content: `¿Conoces alguna situación actual en la que alguien prefiera mantener una apariencia social antes que admitir una dificultad real?`,
      },
    ],
  });

  // ──────────────────────────────────────────────────────────────
  // LAZARILLO 4/4 — Lázaro pregonero (Tratado séptimo) — orden 7
  // ──────────────────────────────────────────────────────────────
  const pregoneroText = `Y pensando en qué modo de vivir haría mi asiento por tener descanso y ganar algo para la vejez, quiso Dios alumbrarme y ponerme en camino y manera provechosa. [...] Que fue un oficio real, viendo que no hay nadie que medre sino los que le tienen.

[...]

En este tiempo, viendo mi habilidad y buen vivir, teniendo noticia de mi persona el señor arcipreste de San Salvador, mi señor, y servidor y amigo de vuestra merced, porque le pregonaba sus vinos, procuró casarme con una criada suya.

[...]

Mas malas lenguas, que nunca faltaron ni faltarán, no nos dejan vivir, diciendo no sé qué, y sí sé qué, de que venía mi mujer irle a hacer la cama y guisalle de comer. Y mejor les ayude Dios que ellos dicen la verdad.

[...]

—Lázaro de Tormes, quien ha de mirar a dichos de malas lenguas, nunca medrará. Digo esto porque no me maravillaría alguno, viendo entrar en mi casa a tu mujer y salir de ella... Ella entra muy a tu honra y suya. Y esto te lo prometo. Por tanto, no mires a lo que pueden decir, sino a lo que te toca, digo a tu provecho.

[...]

Pues en este tiempo estaba en mi prosperidad y en la cumbre de toda buena fortuna.`;

  console.log("Creando Lázaro pregonero...");
  const fragPregonero = await prisma.fragment.create({
    data: {
      slug: "lazaro-pregonero",
      title: "Lázaro pregonero",
      location: "La vida de Lazarillo de Tormes, Tratado séptimo",
      headline: "«Estaba en mi prosperidad y en la cumbre de toda buena fortuna»",
      text: pregoneroText,
      order: 7,
      status: "published",
      workId: lazarillo.id,
      constellations: { connect: [{ id: consCriticaSocial.id }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragPregonero.id,
        type: "glosa",
        ...anchor(pregoneroText, "oficio real"),
        order: 1,
        content: `Pregonero al servicio del Ayuntamiento: anuncia en voz alta ventas, almonedas y sentencias judiciales. Es el primer empleo estable de Lázaro tras una vida entera sirviendo a amos particulares.`,
      },
      {
        fragmentId: fragPregonero.id,
        type: "glosa",
        ...anchor(pregoneroText, "medrará"),
        order: 2,
        content: `«Medrar»: mejorar de posición o fortuna. El arcipreste aconseja a Lázaro que ignore los rumores y se concentre en su propio provecho —un consejo que resume la moral práctica, no heroica, de toda la novela picaresca.`,
      },
      {
        fragmentId: fragPregonero.id,
        type: "contexto",
        ...anchor(pregoneroText, "no nos dejan vivir, diciendo no sé qué, y sí sé qué"),
        order: 1,
        content: `El arcipreste de San Salvador casa a Lázaro con una criada suya con la que, según los rumores del pueblo, mantiene una relación. Lázaro, que ha alcanzado por fin estabilidad económica, decide no indagar y aceptar el arreglo —un final abierto y profundamente ambiguo sobre qué precio paga por su «prosperidad».`,
      },
      {
        fragmentId: fragPregonero.id,
        type: "figura",
        category: "tropo",
        ...anchor(pregoneroText, "en la cumbre de toda buena fortuna"),
        order: 1,
        content: `**Ironía**: la novela entera ha mostrado a Lázaro hambriento y humillado por amos miserables; llamar «cumbre de toda buena fortuna» a un matrimonio basado en mirar hacia otro lado revela hasta qué punto sus ambiciones se han rebajado.`,
      },
      {
        fragmentId: fragPregonero.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `Lázaro llama a este momento «la cumbre de toda buena fortuna». ¿Estás de acuerdo en que esto representa realmente un final feliz? ¿Qué ha tenido que aceptar Lázaro para llegar hasta aquí?`,
      },
    ],
  });

  console.log("✓ Lazarillo: 4 fragmentos nuevos creados.");

  // ════════════════════════════════════════════════════════════
  // ROSALÍA DE CASTRO — 3 obras nuevas
  // ════════════════════════════════════════════════════════════

  // ──────────────────────────────────────────────────────────────
  // Obra: Cantares gallegos (1863) — "Adiós ríos, adiós fontes"
  // ──────────────────────────────────────────────────────────────
  console.log("Creando obra Cantares gallegos...");
  const cantaresGallegos = await prisma.work.create({
    data: {
      slug: "cantares-gallegos",
      title: "Cantares gallegos",
      year: 1863,
      era: "Romanticismo",
      genre: "Poesía lírica",
      synopsis: `Primer gran poemario en lengua gallega de Rosalía de Castro, y obra fundacional del *Rexurdimento*. «Adiós ríos, adiós fontes», su poema más conocido, pone voz al dolor de la emigración: una despedida de la tierra natal que recorre uno por uno los elementos del paisaje amado —ríos, fuentes, caminos, campanas— antes de partir hacia un destino incierto.`,
      authorId: rosaliaAuthor.id,
    },
  });

  const adiosRiosText = `Adios rios, adios fontes,
adios regatos pequenos,
adios vista dos meus ollos,
non sei cando nos veremos.

Miña terra, miña terra,
terra donde m'eu criey,
hortiña que quero tanto,
figueiriñas que prantey,

prados, rios, arboredas,
pinares que move ó vento,
paxariños piadores,
casiña dó meu contento,

muiño dos castañares,
noites craras de luar,
campaniñas trimbadoras
da igrexiña dó lugar,

amoriñas das silveiras
que eu lle dab'ó meu amor,
camiñiños antr'ó millo,
adios, para sempre adios!

Adios gloria! Adios contento!
Deixo á casa onde nacin,
deixo á aldea que conoço,
por un mundo que non vin!

Deixo amigos por extraños,
deixo á veiga polo mar,
deixo, en fin, canto ben quero...
¡Quen pudera non deixar!...`;

  console.log("Creando Adiós ríos, adiós fontes...");
  const fragAdiosRios = await prisma.fragment.create({
    data: {
      slug: "adios-rios-adios-fontes",
      title: "Adiós ríos, adiós fontes",
      location: "Cantares gallegos",
      headline: "«Adiós ríos, adiós fontes, adiós vista dos meus ollos»",
      text: adiosRiosText,
      order: 1,
      status: "published",
      workId: cantaresGallegos.id,
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragAdiosRios.id,
        type: "glosa",
        ...anchor(adiosRiosText, "regatos"),
        order: 1,
        content: `«Regato»: arroyo pequeño. Rosalía enumera el paisaje gallego de mayor a menor escala —ríos, fuentes, arroyos— como quien repasa con la vista, por última vez, todo lo que va a dejar atrás.`,
      },
      {
        fragmentId: fragAdiosRios.id,
        type: "glosa",
        ...anchor(adiosRiosText, "trimbadoras"),
        order: 2,
        content: `Del verbo gallego *trimbar*, tañer o repicar: las campanas «trimbadoras» de la iglesia del lugar son uno de los sonidos cotidianos que la voz poética se despide de escuchar.`,
      },
      {
        fragmentId: fragAdiosRios.id,
        type: "contexto",
        ...anchor(adiosRiosText, "por un mundo que non vin"),
        order: 1,
        content: `El poema da voz a la experiencia de la emigración gallega del siglo XIX, que llevaba a miles de personas hacia América huyendo de la pobreza rural. Rosalía escribe en gallego, lengua entonces excluida de la literatura «culta», precisamente para que ese dolor colectivo se nombrase en la lengua en que se vivía.`,
      },
      {
        fragmentId: fragAdiosRios.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(adiosRiosText, "Adios rios, adios fontes"),
        order: 1,
        content: `**Anáfora**: la repetición de «adiós» al inicio de casi cada verso convierte la despedida en una letanía que se extiende y se demora, como si nombrar una a una las cosas queridas pudiera retrasar la partida.`,
      },
      {
        fragmentId: fragAdiosRios.id,
        type: "figura",
        category: "tropo",
        ...anchor(adiosRiosText, "Deixo amigos por extraños"),
        order: 2,
        content: `**Antítesis**: el contraste entre lo conocido («amigos», «aldea», «casa onde nacín») y lo desconocido («extraños», «un mundo que non vin») estructura todo el poema como un balance doloroso entre lo que se pierde y lo incierto que se gana.`,
      },
      {
        fragmentId: fragAdiosRios.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `El poema nombra elementos muy concretos y pequeños —una huerta, unas higueras, un molino— en lugar de hablar de «la patria» en abstracto. ¿Qué efecto produce esa acumulación de detalles diminutos?`,
      },
    ],
  });

  // ──────────────────────────────────────────────────────────────
  // Obra: En las orillas del Sar (1884) — "Yo no sé lo que busco eternamente"
  // ──────────────────────────────────────────────────────────────
  console.log("Creando obra En las orillas del Sar...");
  const orillasDelSar = await prisma.work.create({
    data: {
      slug: "en-las-orillas-del-sar",
      title: "En las orillas del Sar",
      year: 1884,
      era: "Romanticismo",
      genre: "Poesía lírica",
      synopsis: `Último gran poemario de Rosalía de Castro, escrito en castellano y publicado un año antes de su muerte. Frente al colorido paisaje gallego de sus libros anteriores, estos poemas se adentran en una introspección desnuda y melancólica que anticipa la sensibilidad simbolista; su influencia en Antonio Machado y Juan Ramón Jiménez fue decisiva.`,
      authorId: rosaliaAuthor.id,
    },
  });

  const yoNoSeText = `Yo no sé lo que busco eternamente
en la tierra, en el aire y en el cielo;
yo no sé lo que busco; pero es algo
que perdí no sé cuándo y que no encuentro,
aun cuando sueñe que invisible habita
en todo cuanto toco y cuanto veo.

Felicidad, no he de volver a hallarte
en la tierra, en el aire, ni en el cielo,
¡aun cuando sé que existes
y no eres vano sueño!`;

  console.log("Creando Yo no sé lo que busco eternamente...");
  const fragYoNoSe = await prisma.fragment.create({
    data: {
      slug: "yo-no-se-lo-que-busco",
      title: "Yo no sé lo que busco eternamente",
      location: "En las orillas del Sar",
      headline: "«Yo no sé lo que busco eternamente»",
      text: yoNoSeText,
      order: 1,
      status: "published",
      workId: orillasDelSar.id,
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragYoNoSe.id,
        type: "contexto",
        ...anchor(yoNoSeText, "Felicidad, no he de volver a hallarte"),
        order: 1,
        content: `Frente a la melancolía gallega de *Follas novas*, ligada a un paisaje y una lengua concretos, este poema en castellano universaliza la pérdida: ya no se llora una tierra, sino una felicidad sin nombre ni objeto reconocible, puramente interior.`,
      },
      {
        fragmentId: fragYoNoSe.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(yoNoSeText, "en la tierra, en el aire y en el cielo"),
        order: 1,
        content: `**Enumeración**: los tres elementos —tierra, aire, cielo— se repiten al principio y al final del poema, abarcando todo el espacio posible, para subrayar que esa «felicidad» buscada no está en ningún lugar del mundo.`,
      },
      {
        fragmentId: fragYoNoSe.id,
        type: "figura",
        category: "tropo",
        ...anchor(yoNoSeText, "que perdí no sé cuándo y que no encuentro"),
        order: 2,
        content: `**Paradoja**: la voz poética busca algo que no puede nombrar ni ubicar, y que sin embargo siente «habitar invisible» en todo lo que toca y ve. La imposibilidad de definir el objeto del deseo es, precisamente, el tema del poema.`,
      },
      {
        fragmentId: fragYoNoSe.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `¿Te parece que esta sensación de buscar "algo" indefinible es una experiencia reconocible, más allá de la época en que se escribió el poema?`,
      },
    ],
  });

  // ──────────────────────────────────────────────────────────────
  // Obra: Las literatas. Carta a Eduarda (1866) — ensayo en prosa
  // ──────────────────────────────────────────────────────────────
  console.log("Creando obra Las literatas...");
  const lasLiteratas = await prisma.work.create({
    data: {
      slug: "las-literatas",
      title: "Las literatas. Carta a Eduarda",
      year: 1866,
      era: "Romanticismo",
      genre: "Ensayo (carta ficticia)",
      synopsis: `Publicado en 1866 en el *Almanaque de Galicia*, este artículo en forma de carta ficticia —firmada por una tal Nicanora y dirigida a su amiga Eduarda— es uno de los primeros textos en español que reflexiona, desde dentro, sobre la hostilidad social hacia las mujeres que escriben. Bajo el disfraz de un consejo («no publiques nada»), Rosalía de Castro construye una sátira mordaz sobre el mundo literario y los prejuicios contra las «literatas».`,
      authorId: rosaliaAuthor.id,
    },
  });

  const literatasText = `No, mil veces no, Eduarda; aleja de ti tan fatal tentación, no publiques nada y guarda para ti sola tus versos y tu prosa, tus novelas y tus dramas: que ése sea un secreto entre el cielo, tú y yo. ¿No ves que el mundo está lleno de esas cosas? Todos escriben y de todo. Las musas se han desencadenado. Hay más libros que arenas tiene el mar, más genios que estrellas tiene el cielo y más críticos que hierbas hay en los campos.

[...]

Pero es el caso, Eduarda, que los hombres miran a las literatas peor que mirarían al diablo, y éste es un nuevo escollo que debes temer tú que no tienes dote. Únicamente alguno de verdadero talento pudiera, estimándote en lo que vales, despreciar necias y aun erradas preocupaciones; pero... ¡ay de ti entonces!, ya nada de cuanto escribes es tuyo, se acabó tu numen, tu marido es el que escribe y tú la que firmas.

Yo, a quien sin duda un mal genio ha querido llevar por el perverso camino de las musas, sé harto bien la senda que en tal peregrinación recorremos. Por lo que a mí respecta, se dice muy corrientemente que mi marido trabaja sin cesar para hacerme inmortal. Versos, prosa, bueno o malo, todo es suyo.`;

  console.log("Creando Las literatas (fragmento)...");
  const fragLiteratas = await prisma.fragment.create({
    data: {
      slug: "las-literatas-carta-a-eduarda",
      title: "Las literatas",
      location: "Las literatas. Carta a Eduarda",
      headline: "«Los hombres miran a las literatas peor que mirarían al diablo»",
      text: literatasText,
      order: 1,
      status: "published",
      workId: lasLiteratas.id,
      constellations: { connect: [{ id: consCriticaSocial.id }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragLiteratas.id,
        type: "glosa",
        ...anchor(literatasText, "numen"),
        order: 1,
        content: `Inspiración o talento creador. Decir que «se acabó tu numen» significa que, según los rumores que describe la carta, ya no se reconoce a la escritora ningún mérito propio: todo pasa a atribuirse a su marido.`,
      },
      {
        fragmentId: fragLiteratas.id,
        type: "contexto",
        ...anchor(literatasText, "No, mil veces no, Eduarda"),
        order: 1,
        content: `El texto está firmado por «Nicanora», un nombre ficticio que permite a Rosalía de Castro hablar de la condición de escritora en tercera persona aparente. Es, en realidad, un disfraz: bajo el consejo de no publicar se esconde una denuncia irónica de la presión social que empuja a las mujeres a no escribir.`,
      },
      {
        fragmentId: fragLiteratas.id,
        type: "figura",
        category: "tropo",
        ...anchor(literatasText, "los hombres miran a las literatas peor que mirarían al diablo"),
        order: 1,
        content: `**Hipérbole irónica**: la comparación con el diablo exagera deliberadamente el rechazo social hacia las mujeres escritoras, para hacer visible —mediante la desmesura— lo absurdo de ese rechazo.`,
      },
      {
        fragmentId: fragLiteratas.id,
        type: "figura",
        category: "tropo",
        ...anchor(literatasText, "tu marido es el que escribe y tú la que firmas"),
        order: 2,
        content: `**Ironía**: la frase resume, con sequedad demoledora, el mecanismo social descrito en toda la carta: a una mujer que escribe bien no se le concede el mérito de su propio talento, sino que se le atribuye a la autoría masculina de su entorno.`,
      },
      {
        fragmentId: fragLiteratas.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `Toda la carta aconseja a Eduarda que no publique nada, pero el texto que leemos es precisamente una reflexión escrita y publicada por la propia Rosalía de Castro sobre por qué las mujeres no deberían escribir. ¿Qué efecto produce esa contradicción entre lo que el texto dice y lo que el texto es?`,
      },
      {
        fragmentId: fragLiteratas.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 2,
        content: `¿Qué paralelismos encuentras entre la situación que describe Rosalía de Castro en 1866 y la presencia de mujeres autoras en el canon literario que has estudiado hasta ahora?`,
      },
    ],
  });

  console.log("✓ Rosalía de Castro: 3 fragmentos nuevos (3 obras nuevas) creados.");
  console.log("\n✓ TOTAL: 13 fragmentos nuevos añadidos.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
