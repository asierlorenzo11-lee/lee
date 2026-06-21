import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // ── Autor ──────────────────────────────────────────────────────────────────
  const autor = await prisma.author.upsert({
    where: { slug: "jose-zorrilla" },
    update: {},
    create: {
      slug: "jose-zorrilla",
      name: "José Zorrilla",
      bio: "Poeta y dramaturgo romántico español (Valladolid, 1817 – Madrid, 1893), coronado poeta nacional en Granada en 1889. Su obra cumbre, Don Juan Tenorio (1844), refundición del mito del seductor impenitente en clave romántica, le otorgó fama imperecedera. A diferencia del Don Juan de Tirso, el de Zorrilla halla la redención a través del amor de doña Inés. También cultivó la leyenda poética y el teatro histórico, género en el que destaca Traidor, inconfeso y mártir (1849).",
      birthYear: 1817,
      deathYear: 1893,
      era: "Romanticismo",
      portraitUrl: "/images/authors/jose-zorrilla.jpg",
    },
  });
  console.log("Autor:", autor.slug);

  // ── Obra ───────────────────────────────────────────────────────────────────
  const obra = await prisma.work.upsert({
    where: { slug: "don-juan-tenorio" },
    update: {},
    create: {
      slug: "don-juan-tenorio",
      title: "Don Juan Tenorio",
      year: 1844,
      genre: "Drama romántico en dos partes y siete actos, en verso",
      era: "Romanticismo",
      synopsis: "Don Juan Tenorio, el seductor más célebre de Sevilla, hace una apuesta infame con don Luis Mejía: ¿quién cometerá más fechorías en un año? Entre sus objetivos figura la novicia doña Inés, hija del Comendador. Pero la pureza de Inés despierta en don Juan un amor auténtico y desconocido. El Comendador muere a manos de don Juan; Inés muere de pena. Años después, don Juan visita el panteón de sus víctimas y convida a cenar a la estatua del Comendador. Los muertos acuden. Solo el amor de doña Inés, que intercede ante Dios, puede salvar su alma impenitente.",
      authorId: autor.id,
    },
  });
  console.log("Obra:", obra.slug);

  // ── Fragmentos ─────────────────────────────────────────────────────────────
  const fragmentos = [
    {
      slug: "don-juan-convite-apuesta",
      title: "La apuesta: el catálogo de vicios",
      location: "Parte I, Acto I, Escena XII",
      headline:
        "Don Juan y don Luis ajustan sus cuentas de un año de libertinismo ante testigos en la posada del Laurel.",
      text: `(Sevilla, 1545. Una hostería. DON JUAN TENORIO y DON LUIS MEJÍA se han citado para rendir cuentas de la apuesta contraída un año atrás: ¿quién habrá cometido más fechorías?)

DON LUIS:
 Hoy mismo cumple el plazo, y ya
 veo que sois el mismo don Juan.

DON JUAN:
 ¡Don Luis, el tiempo se va!
 ¡Mas tal como soy aquí estoy,
 y aquí mi lista está!
(Saca un papel sellado)

DON LUIS:
 Pues bien: la mía es igual.
(Saca el suyo)

(Leen en voz alta, por turno, sus listas de mujeres burladas, hombres muertos en duelo y otras hazañas. La de Don Juan supera con creces a la de Don Luis.)

DON JUAN:
 Ahí mi lista completa está,
 Don Luis: veinticuatro burladas,
 treinta y dos muertes honradas,
 y una monja... ¡y vámonos ya!

DON LUIS:
 ¡Una novicia! ¡Eso es infame!

DON JUAN:
 ¡Eso es valor! Y siendo así,
 concededme que soy yo
 quien más proezas logró;
 soy el primero, y lo fui.
 Mi nombre en toda Sevilla
 suena a reto y a jactancia,
 y en Nápoles, y en Francia,
 y en Italia... ¡mi cuadrilla!
 ¿Quién de vosotros osara
 hablar ante mí sin miedo,
 si á cuantos veo y recedo
 mi sola voz les acobarda?

DON LUIS:
 ¡Basta! Os conozco, don Juan.
 Sois un monstruo de impiedad.

DON JUAN:
 Soy lo que el mundo me hizo, aún.
 Y antes de que un año acabe
 añadiré á mi inventario
 lo que ahora el adversario
 no tiene ni sabe:
 la hija del Comendador.`,
      order: 1,
      status: "published" as const,
      artworkImageUrl: "/images/artworks/byron-traje-albanes.jpg",
      artworkTitle: "Lord Byron en traje albanés",
      artworkAuthor: "Thomas Phillips (1835)",
      artworkCaption:
        "El retrato de Byron captura el espíritu del héroe byroniano que inspiró al Don Juan romántico de Zorrilla: apuesto, transgresor y fatalmente fascinante.",
    },
    {
      slug: "dona-ines-lee-la-carta",
      title: "Doña Inés lee la carta de don Juan",
      location: "Parte I, Acto II, Escena IV",
      headline:
        "Recluida en el convento, doña Inés lee la carta que el libertino le ha enviado y siente por primera vez el poder del amor.",
      text: `(Un locutorio del convento de la Encarnación. DOÑA INÉS, novicia, tiene en las manos un pliego perfumado que le ha traído Brígida, su dueña. Lo rompe el sello y lee.)

DOÑA INÉS (leyendo):
 «Doña Inés del alma mía,
  luz de donde el sol la toma,
  hermosa como la paloma
  que anuncia la luz del día;
  si existe la dicha entera
  en el amor de mujer,
  yo te amo, Inés, y quisiera
  ser mejor de lo que era
  solo por merecer.»

(Deja de leer, turbada)

DOÑA INÉS:
 ¡Ay! ¡Dios mío! ¡Cuánta agitación
 me causa este papel! ¡Las sienes
 me arden... las manos me tienen
 un no sé qué de ilusión!
 Cada sílaba que leo
 me enciende más la fantasía;
 mi corazón se extravía
 y un sueño extraño me veo.
 Nunca sentí tal manera
 de latir dentro del pecho...
 ¿Qué me habrá este hombre hecho?
 ¿Qué es esto? ¿Qué es lo que espera?

(Vuelve a leer, sin poder contenerse)

DOÑA INÉS:
 «Yo soy don Juan. Mi vida entera
  fue un desafío sin fin;
  mas hoy, Inés, en tu jardín
  hallé lo que no creía:
  que hay algo más que la lid,
  algo más que el vino y la espada...
  ¡Y ese algo eres tú, amada,
  única luz en Madrid!»

 ¡Oh! ¡No puedo más! Me turba
 este papel de tal manera...
 ¡Que aunque me digan que muera,
 yo no sé si me perturba
 el miedo o la fantasía!
 ¡Brígida! ¿Qué me has traído?
 ¿Un ángel o un maldecido?
 ¡Solo sé que el alma mía
 ya no es la misma de hoy!`,
      order: 2,
      status: "published" as const,
      artworkImageUrl: "/images/artworks/vermeer-la-carta.jpg",
      artworkTitle: "La carta de amor",
      artworkAuthor: "Johannes Vermeer (c. 1669–1670)",
      artworkCaption:
        "Vermeer retrató el instante en que una carta transforma el estado anímico de quien la recibe. Como doña Inés, la figura de Vermeer sostiene el papel con una mezcla de turbación y secreto deleite.",
    },
    {
      slug: "don-juan-jardin-angel-de-amor",
      title: "El jardín: ¿No es verdad, ángel de amor?",
      location: "Parte I, Acto III, Escena III",
      headline:
        "Don Juan conduce a doña Inés al jardín de su quinta y le declara un amor que él mismo no esperaba sentir.",
      text: `(Jardín de la quinta de don Juan, a orillas del Guadalquivir. Noche. La luna llena. DON JUAN y DOÑA INÉS, solos por primera vez.)

DON JUAN:
 ¡Ah! ¿No es verdad, ángel de amor,
 que en esta apartada orilla
 más pura la luna brilla
 y se respira mejor?
 Esta aura que vaga, llena
 de los sencillos olores
 de las campesinas flores
 que brota esa orilla amena;
 esa agua limpia y serena
 que atraviesa sin temor
 la barca del pescador
 que espera cantando el día;
 ¿no es verdad, paloma mía,
 que están respirando amor?

 Y ese es el amor que siento
 por vos, doña Inés: suave,
 nuevo para mí... ¡quien sabe
 si dura más que un momento!
 Mas ¡ay! que desde el instante
 en que os vi, doña Inés bella,
 perdí de amor bajo su huella
 de hombre la planta arrogante.

 Yo he visto el rayo caer,
 yo he visto el huracán batir
 con sus alas al mar rugir
 sin temblar ni palidecer.
 He llevado en frente y pecho
 hierro y muerte sin pavor...
 ¡Mas ante vos, por mi honor,
 siento que el alma se ha deshecho!

 ¿Qué tenéis vos que no tenga
 la luz, el aire y el sol?
 ¿Qué ángel os puso el arrebol
 para que el alma os prevenga?
 No lo sé, Inés... solo sé
 que os amo, y que desde hoy
 —lo juro— otro hombre soy:
 el que con vos siempre estaré.

DOÑA INÉS:
 Don Juan... no sé qué deciros.
 Tengo miedo y tengo fe.
 Si es verdad lo que yo sé,
 ¿cómo podré resistiros?`,
      order: 3,
      status: "published" as const,
      artworkImageUrl: "/images/artworks/klimt-el-beso.jpg",
      artworkTitle: "El beso",
      artworkAuthor: "Gustav Klimt (1907–1908)",
      artworkCaption:
        "El abrazo de Klimt captura la rendición absoluta que la escena del jardín dramatiza: el instante en que dos almas ceden, juntas, a la fuerza del amor.",
    },
    {
      slug: "don-juan-cementerio-convite",
      title: "El cementerio: el convite de piedra",
      location: "Parte II, Acto I, Escena III",
      headline:
        "Don Juan visita el panteón de sus víctimas y, en un rapto de soberbia, invita a cenar a la estatua del Comendador.",
      text: `(Cementerio familiar de los Tenorio. Mausoleos, estatuas y epitafios. DON JUAN entra con antorcha. Reconoce el sepulcro de DON GONZALO DE ULLOA, el Comendador a quien mató, y las tumbas de otros caídos por su mano. Ante la estatua de mármol del Comendador, se detiene.)

DON JUAN:
 Aquí está. ¡El viejo austero
 en piedra como en vida duro!
 ¡Qué bien te sienta, te auguro,
 ese manto de caballero!
 Pues bien, Don Gonzalo, aquí
 os traigo mi desafío:
 si es verdad que el poder mío
 llega hasta el más allá de aquí,
 decidme desde ese mármol
 si me oís o si no podéis,
 que si es cierto que vivís
 en algún mundo más noble,
 yo os convido esta noche a hablar
 conmigo en mi mesa franca.
 ¡La muerte os ponga la manta
 y venga a cenar, si es capaz!

(Pausa. Silencio)

DON JUAN:
 ¡Nada! ¡Como era de esperar!
 ¡La muerte es muda y el mármol frío!
 ¡No hay más mundo que este mío,
 ni más vida que el danzar
 bajo el sol mientras se vive!

(La estatua mueve la cabeza lentamente. DON JUAN retrocede un paso.)

ESTATUA (con voz de piedra):
 Don Juan, Dios no consiente
 que te burles de los muertos.
 Esta noche, á tus conciertos
 irás tú: que yo no miente.
 A cenar contigo iré;
 mas luego, á la cita dada,
 tendrás tú que ir á otra entrada
 donde yo te esperaré.

DON JUAN (reponiéndose):
 ¡Sea! Que si Dios existe
 y su justicia es tan clara,
 venga pues, que yo la enfrenta:
 ¡Don Juan Tenorio no huye!`,
      order: 4,
      status: "published" as const,
      artworkImageUrl: "/images/artworks/friedrich-abadia-en-el-robledal.jpg",
      artworkTitle: "Abadía en el robledal",
      artworkAuthor: "Caspar David Friedrich (1809–1810)",
      artworkCaption:
        "Las ruinas nocturnas de Friedrich evocan la atmósfera de muerte y trascendencia que envuelve la escena del cementerio: la naturaleza como escenario donde el más allá irrumpe en la vida.",
    },
    {
      slug: "don-juan-salvacion-final",
      title: "La salvación de don Juan",
      location: "Parte II, Acto III, Escena última",
      headline:
        "En el momento de morir, el alma de doña Inés intercede ante Dios y arrastra consigo al pecador más grande de Sevilla hacia la luz.",
      text: `(La misma estancia de antes. DON JUAN, herido de muerte por don Rafael de Avellaneda, cae al suelo. La sombra de DOÑA INÉS aparece envuelta en luz.)

DON JUAN:
 ¡Doña Inés! ¡Sombra querida!
 ¿Eres tú? ¿Puedo creer
 que en este instante de muerte
 me das tú luz en que ver?

DOÑA INÉS (extendiendo los brazos):
 Don Juan, Dios me ha permitido,
 por el amor que te tuve,
 que al cielo en que yo ya estuve
 te lleve, si has merecido.
 Toda mi sangre vertí
 en rezos, todas mis horas
 en súplicas voladoras
 para que Él te perdone á ti.
 Y Él, que es misericordioso,
 me ha dicho: «Inés, si lo amas,
 llévale.» ¡Y yo aquí te llamas
 con mi amor y con su gozo!

DON JUAN (tendiendo la mano):
 ¡Inés! ¡Inés de mi vida!
 Yo que nunca me postré,
 yo que nunca doblegué
 la frente ni la rodilla,
 ante ti, que eres mi luz,
 la doblo... ¡y ya no me pesa!
 ¡Dios existe! ¡Y esa es
 su mayor obra: la tuya, Inés!
 ¡Gracias, Señor! ¡Ya me entrego!

(DON JUAN expira. Flores caen del cielo. El alma de DON JUAN asciende junto a la de DOÑA INÉS.)

(Cae el telón.)`,
      order: 5,
      status: "published" as const,
      artworkImageUrl: "/images/artworks/bernini-extasis-santa-teresa.jpg",
      artworkTitle: "El éxtasis de santa Teresa",
      artworkAuthor: "Gian Lorenzo Bernini (1647–1652)",
      artworkCaption:
        "Bernini esculpió el instante en que lo divino toca lo humano. El final de Don Juan Tenorio vive ese mismo milagro: la gracia celestial, vehiculada por el amor de Inés, transforma al pecador.",
    },
  ];

  let creados = 0;
  for (const frag of fragmentos) {
    await prisma.fragment.upsert({
      where: { slug: frag.slug },
      update: {},
      create: {
        slug: frag.slug,
        title: frag.title,
        location: frag.location,
        headline: frag.headline,
        text: frag.text,
        order: frag.order,
        status: frag.status,
        workId: obra.id,
        artworkImageUrl: frag.artworkImageUrl,
        artworkTitle: frag.artworkTitle,
        artworkAuthor: frag.artworkAuthor,
        artworkCaption: frag.artworkCaption,
      },
    });
    creados++;
    console.log(`  fragmento: ${frag.slug}`);
  }

  console.log(`\nListo. Fragmentos creados: ${creados}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
