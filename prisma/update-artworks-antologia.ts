import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

const artworkUpdates: Array<{
  slug: string;
  artworkImageUrl: string;
  artworkTitle: string;
  artworkAuthor: string;
  artworkCaption: string;
}> = [
  // ─── EDAD MEDIA ──────────────────────────────────────────────────────────────
  {
    slug: "el-prado-alegorico",
    artworkImageUrl: "/images/artworks/cantigas-de-santa-maria.jpg",
    artworkTitle: "Cantigas de Santa María (iluminación)",
    artworkAuthor: "Taller de Alfonso X el Sabio (s. XIII)",
    artworkCaption:
      "Iluminación medieval del códice de las Cantigas de Santa María (c. 1280), contemporáneo de Berceo, que reúne la devoción mariana de la época.",
  },
  {
    slug: "quiero-fer-una-prosa",
    artworkImageUrl: "/images/artworks/fra-angelico-anunciacion.jpg",
    artworkTitle: "La Anunciación",
    artworkAuthor: "Fra Angelico (c. 1426)",
    artworkCaption:
      "Fra Angelico pintó en el convento de San Marcos de Florencia el mismo ideal de humildad y gracia que Berceo buscó al escribir «en román paladino».",
  },
  {
    slug: "retrato-de-la-dama-ideal",
    artworkImageUrl: "/images/artworks/titian-flora.jpg",
    artworkTitle: "Flora",
    artworkAuthor: "Tiziano (c. 1515)",
    artworkCaption:
      "El retrato de Flora de Tiziano es la versión pictórica del ideal femenino que el Arcipreste enumeraba en cuaderna vía: cabellos, cejas, talle y anchura de caderas.",
  },
  {
    slug: "la-chata-de-malangosto",
    artworkImageUrl: "/images/artworks/brueghel-carnaval-y-cuaresma.jpg",
    artworkTitle: "El combate entre el Carnaval y la Cuaresma",
    artworkAuthor: "Pieter Brueghel el Viejo (1559)",
    artworkCaption:
      "El mundo grotesco y popular que Brueghel pinta en sus tablas es el mismo que el Arcipreste habitó: la serrana que cobra peaje, el viajero sorprendido, el cuerpo como escenario.",
  },
  {
    slug: "el-amor-ha-tales-manas",
    artworkImageUrl: "/images/artworks/caravaggio-amor-vincit-omnia.jpg",
    artworkTitle: "Amor vincit omnia",
    artworkAuthor: "Caravaggio (1601–1602)",
    artworkCaption:
      "El Amor triunfante de Caravaggio, que ríe sobre los símbolos del saber y el poder, es el mismo gusano-cáncer que Florencia Pinar veía entrar «por las axillellas».",
  },
  {
    slug: "sin-dios-sin-vos-y-sin-mi",
    artworkImageUrl: "/images/artworks/titian-amor-sacro-y-amor-profano.jpg",
    artworkTitle: "Amor sacro y amor profano",
    artworkAuthor: "Tiziano (c. 1514)",
    artworkCaption:
      "Las dos figuras de Tiziano —el amor divino y el terreno— encarnan el triple vaciamiento de Manrique: sin Dios, sin la amada, sin sí mismo.",
  },
  {
    slug: "romance-de-la-loba-parda",
    artworkImageUrl: "/images/artworks/hondecoeter-zorra-con-gallo.jpg",
    artworkTitle: "Zorra con gallo y otras aves",
    artworkAuthor: "Melchior d'Hondecoeter (c. 1680)",
    artworkCaption:
      "El depredador y sus presas: Hondecoeter pinta la misma lógica brutal que el Romance de la loba parda resuelve sin piedad ni ceremonia.",
  },
  {
    slug: "romance-de-la-gentil-dama-y-el-rustico-pastor",
    artworkImageUrl: "/images/artworks/poussin-pastores-de-arcadia.jpg",
    artworkTitle: "Los pastores de la Arcadia (Et in Arcadia ego)",
    artworkAuthor: "Nicolas Poussin (c. 1637–1638)",
    artworkCaption:
      "El ideal pastoril que Poussin dibuja en la Arcadia tiene su reverso cómico en el romance: la dama que se autoescribe y el pastor que no puede detenerse.",
  },
  {
    slug: "el-infante-arnaldos",
    artworkImageUrl: "/images/artworks/turner-norham-castle.jpg",
    artworkTitle: "Norham Castle, Sunrise",
    artworkAuthor: "J. M. W. Turner (c. 1845)",
    artworkCaption:
      "Turner pinta el misterio del amanecer sobre el agua —luz, niebla, inminencia— como el romance del infante Arnaldos: algo está a punto de ocurrir, y el poema termina antes.",
  },
  {
    slug: "romance-del-enamorado-y-la-muerte",
    artworkImageUrl: "/images/artworks/millais-ofelia.jpg",
    artworkTitle: "Ofelia",
    artworkAuthor: "John Everett Millais (1851–1852)",
    artworkCaption:
      "La figura blanca y flotante de Ophelia —belleza y muerte confundidas— es la imagen exacta de la Muerte que llega como dama al romance: «vi entrar señora tan blanca, / muy más que la nieve fría».",
  },
  {
    slug: "romance-del-rey-don-sancho",
    artworkImageUrl: "/images/artworks/cid-arcas-de-arena-burgos.jpg",
    artworkTitle: "El Cid y las arcas de arena (recreación)",
    artworkAuthor: "Ilustración histórica (s. XIX)",
    artworkCaption:
      "El ciclo cidiano del Romancero sitúa la traición de Bellido Dolfos en el corazón del conflicto entre el Cid y el rey Alfonso: lealtad, honor y poder en Castilla.",
  },
  {
    slug: "romance-de-la-jura-de-santa-gadea",
    artworkImageUrl: "/images/artworks/jura-de-santa-gadea.jpg",
    artworkTitle: "La jura de Santa Gadea",
    artworkAuthor: "Marcos Hiráldez Acosta (1864)",
    artworkCaption:
      "Hiráldez Acosta pinta el momento exacto del romance: el Cid, ante el altar de Santa Águeda de Burgos, toma juramento al rey Alfonso de no haber participado en la muerte de su hermano.",
  },

  // ─── RENACIMIENTO ────────────────────────────────────────────────────────────
  {
    slug: "soneto-del-olvido-imposible",
    artworkImageUrl: "/images/artworks/vermeer-la-carta.jpg",
    artworkTitle: "La carta de amor",
    artworkAuthor: "Johannes Vermeer (c. 1669–1670)",
    artworkCaption:
      "La carta que Vermeer ilumina es el instrumento de la ausencia: la misma que Boscán desmontó en su soneto —la distancia no cura el amor sino que lo aviva.",
  },
  {
    slug: "soneto-cxxix-a-la-muerte-de-garcilaso",
    artworkImageUrl: "/images/artworks/corot-orfeo-y-euridice.jpg",
    artworkTitle: "Orfeo guiando a Eurídice",
    artworkAuthor: "Jean-Baptiste-Camille Corot (1861)",
    artworkCaption:
      "Boscán, como Orfeo, mira atrás hacia su amigo muerto: el poeta que le enseñó a llegar «en todo enteramente» al bien y que partió sin llevárselo consigo.",
  },
  {
    slug: "soneto-v",
    artworkImageUrl: "/images/artworks/botticelli-nacimiento-de-venus.jpg",
    artworkTitle: "El nacimiento de Venus",
    artworkAuthor: "Sandro Botticelli (c. 1484–1486)",
    artworkCaption:
      "Botticelli pinta el amor como origen y destino absolutos. Garcilaso lo escribe: «yo no nací sino para quereros; / mi alma os ha cortado a su medida».",
  },
  {
    slug: "soneto-x",
    artworkImageUrl: "/images/artworks/titian-venus-y-adonis.jpg",
    artworkTitle: "Venus y Adonis",
    artworkAuthor: "Tiziano (c. 1554)",
    artworkCaption:
      "Las «dulces prendas» que Garcilaso llora son como Venus lamentando a Adonis: el bien perdido de golpe que no cura su ausencia, sino que aviva el dolor.",
  },
  {
    slug: "egloga-i-queja-de-salicio",
    artworkImageUrl: "/images/artworks/rubens-jardin-del-eden.jpg",
    artworkTitle: "El jardín del Edén con la caída del hombre",
    artworkAuthor: "Peter Paul Rubens y Jan Brueghel el Viejo (c. 1615)",
    artworkCaption:
      "El locus amoenus de Garcilaso —naturaleza plena, armonía y dolor— tiene su reverso paradisíaco en este jardín: la perfección que hace más insoportable la pérdida.",
  },
  {
    slug: "ojos-claros-serenos",
    artworkImageUrl: "/images/artworks/gerome-pigmalion-y-galatea.jpg",
    artworkTitle: "Pigmalión y Galatea",
    artworkAuthor: "Jean-Léon Gérôme (c. 1890)",
    artworkCaption:
      "La mirada como origen del amor: Cetina ruega a los ojos que miren —aunque sea airados—, como Pigmalión pide a su obra que responda a su contemplación.",
  },
  {
    slug: "soneto-dentro-del-soneto",
    artworkImageUrl: "/images/artworks/velazquez-las-hilanderas.jpg",
    artworkTitle: "Las hilanderas (La fábula de Aracne)",
    artworkAuthor: "Diego Velázquez (c. 1655–1660)",
    artworkCaption:
      "Velázquez pinta un cuadro sobre el proceso de tejer, dentro del cual hay otro cuadro. Hurtado de Mendoza escribe un soneto sobre el proceso de escribir un soneto.",
  },
  {
    slug: "pastora-si-mal-me-quieres",
    artworkImageUrl: "/images/artworks/poussin-pastores-de-arcadia.jpg",
    artworkTitle: "Los pastores de la Arcadia (Et in Arcadia ego)",
    artworkAuthor: "Nicolas Poussin (c. 1637–1638)",
    artworkCaption:
      "El pastor de Hurtado de Mendoza —que busca su propia perdición— habita el mismo paisaje bucólico de Poussin donde la muerte convive con la belleza.",
  },
  {
    slug: "vida-retirada-oh-monte-oh-fuente-oh-rio",
    artworkImageUrl: "/images/artworks/el-greco-vista-de-toledo.jpg",
    artworkTitle: "Vista de Toledo",
    artworkAuthor: "El Greco (c. 1596–1600)",
    artworkCaption:
      "El paisaje tormentoso de El Greco —cielo inquieto, tierra austera, ciudad que resiste— es el reverso del «almo reposo» al que Fray Luis huye «roto casi el navío».",
  },
  {
    slug: "vivo-sin-vivir-en-mi-villancico-completo",
    artworkImageUrl: "/images/artworks/bernini-extasis-santa-teresa.jpg",
    artworkTitle: "El éxtasis de santa Teresa",
    artworkAuthor: "Gian Lorenzo Bernini (1647–1652)",
    artworkCaption:
      "Bernini esculpe el instante exacto que Santa Teresa describe en su villancico: el alma que muere porque no puede morir, suspendida entre el cuerpo y Dios.",
  },
  {
    slug: "cantico-espiritual-la-busqueda",
    artworkImageUrl: "/images/artworks/el-greco-san-jeronimo-penitente.jpg",
    artworkTitle: "San Jerónimo penitente",
    artworkAuthor: "El Greco (c. 1600)",
    artworkCaption:
      "El penitente de El Greco —solo en la oscuridad, con el libro sagrado— encarna la búsqueda mística de San Juan: «¿adónde te escondiste, Amado?».",
  },
  {
    slug: "tras-de-un-amoroso-lance",
    artworkImageUrl: "/images/artworks/zurbaran-san-juan-de-la-cruz.jpg",
    artworkTitle: "San Juan de la Cruz",
    artworkAuthor: "Francisco de Zurbarán (c. 1656)",
    artworkCaption:
      "Zurbarán retrata al poeta del vuelo ciego hacia Dios: el mismo San Juan que describió «abatirme tanto, tanto, / que fui tan alto, tan alto».",
  },

  // ─── BARROCO ────────────────────────────────────────────────────────────────
  {
    slug: "amar-el-dia-aborrecer-el-dia",
    artworkImageUrl: "/images/artworks/goya-majas-on-balcony.jpg",
    artworkTitle: "Majas en el balcón",
    artworkAuthor: "Francisco de Goya (c. 1800–1814)",
    artworkCaption:
      "Las majas de Goya —en su ambigüedad de deseo y distancia— encarnan las antítesis del soneto de Zayas: amar y aborrecer, deseo e indiferencia, todo en la misma mirada.",
  },
  {
    slug: "que-muera-yo-liseo-por-tus-ojos",
    artworkImageUrl: "/images/artworks/goya-maja-embozados.jpg",
    artworkTitle: "Maja y celestina al balcón",
    artworkAuthor: "Francisco de Goya (c. 1808–1812)",
    artworkCaption:
      "La figura embozada que mira y la que es mirada: la obsesión de Zayas con los ojos —«que muera yo por tus ojos»— concentrada en un instante de intriga urbana madrileña.",
  },
  {
    slug: "ni-se-si-muero",
    artworkImageUrl: "/images/artworks/pereda-sueno-del-caballero.jpg",
    artworkTitle: "El sueño del caballero",
    artworkAuthor: "Antonio de Pereda (c. 1655)",
    artworkCaption:
      "El caballero de Pereda duerme sin saber si vive o sueña, rodeado de vanitas. Leonor de la Cueva escribe el mismo estado: «ni sé si muero ni si tengo vida».",
  },
  {
    slug: "dineros-son-calidad",
    artworkImageUrl: "/images/artworks/reymerswaele-el-cambista-y-su-mujer.jpg",
    artworkTitle: "El cambista y su mujer",
    artworkAuthor: "Marinus van Reymerswale (1539)",
    artworkCaption:
      "El cambista que pesa monedas y registra cuentas es el protagonista silencioso de la letrilla de Góngora: «dineros son calidad», «todo se vende este día».",
  },
  {
    slug: "redondilla-contra-quevedo-y-lope",
    artworkImageUrl: "/images/artworks/velazquez-luis-de-gongora.jpg",
    artworkTitle: "Retrato de Luis de Góngora",
    artworkAuthor: "Diego Velázquez (1622)",
    artworkCaption:
      "Velázquez pintó este retrato el mismo año que Góngora escribió la redondilla burlesca contra Quevedo y Lope. El poeta cordobés mira con la misma ironía que destila su verso.",
  },
  {
    slug: "poderoso-caballero-es-don-dinero",
    artworkImageUrl: "/images/artworks/goya-caprichos-el-si-pronuncian.jpg",
    artworkTitle: "Los Caprichos: «El sí pronuncian y la mano alargan»",
    artworkAuthor: "Francisco de Goya (1799)",
    artworkCaption:
      "Goya sigue a Quevedo en la sátira del matrimonio por dinero: el mismo «poderoso caballero» que hace a las novias pronunciar el sí sin importar a quién.",
  },
  {
    slug: "a-un-hombre-de-gran-nariz",
    artworkImageUrl: "/images/artworks/bosco-jardin-de-las-delicias.jpg",
    artworkTitle: "El jardín de las delicias (panel derecho, detalle)",
    artworkAuthor: "Hieronymus Bosch (c. 1490–1510)",
    artworkCaption:
      "El Bosco inventó el mismo arsenal de figuras grotescas e hiperbólicas que Quevedo convocó en su soneto: nariz de pirámide, de galera, de Ovidio Nasón mal narigado.",
  },
  {
    slug: "no-he-de-callar-epistola-fragmento",
    artworkImageUrl: "/images/artworks/goya-ya-es-hora.jpg",
    artworkTitle: "¡Ya es hora!",
    artworkAuthor: "Francisco de Goya (c. 1797–1799)",
    artworkCaption:
      "El grabado de Goya clama lo mismo que los versos de Quevedo: «¿Nunca se ha de decir lo que se siente?». Tres siglos de poesía cívica entre los dos gritos.",
  },
  {
    slug: "hombres-necios-que-acusais",
    artworkImageUrl: "/images/artworks/gentileschi-judith-decapitando-a-holofernes.jpg",
    artworkTitle: "Judit decapitando a Holofernes",
    artworkAuthor: "Artemisia Gentileschi (c. 1614–1620)",
    artworkCaption:
      "Gentileschi —que sufrió la misma doble moral que sor Juana denunció— pinta la fuerza femenina que actúa sin pedir permiso. «Sin ver que sois la ocasión / de lo mismo que culpáis.»",
  },
  {
    slug: "al-que-ingrato-me-deja",
    artworkImageUrl: "/images/artworks/titian-amor-sacro-y-amor-profano.jpg",
    artworkTitle: "Amor sacro y amor profano",
    artworkAuthor: "Tiziano (c. 1514)",
    artworkCaption:
      "Las dos figuras de Tiziano —el amor que se ofrece y el que se resiste— ilustran la paradoja de sor Juana: «al que ingrato me deja, busco amante; / al que amante me sigue, dejo ingrata».",
  },
  {
    slug: "este-que-ves-engano-colorido",
    artworkImageUrl: "/images/artworks/valdes-leal-in-ictu-oculi.jpg",
    artworkTitle: "In ictu oculi",
    artworkAuthor: "Juan de Valdés Leal (1672)",
    artworkCaption:
      "Valdés Leal pinta en el Hospital de la Caridad la misma meditación que sor Juana: «es cadáver, es polvo, es sombra, es nada». La Muerte apaga la llama de la vida en un parpadeo.",
  },
  {
    slug: "procesion-satirica-a-felipe-iv",
    artworkImageUrl: "/images/artworks/brueghel-triunfo-de-la-muerte.jpg",
    artworkTitle: "El triunfo de la Muerte",
    artworkAuthor: "Pieter Brueghel el Viejo (c. 1562)",
    artworkCaption:
      "La procesión de cadáveres y esqueletos de Brueghel es la versión apocalíptica de la «Procesión» satírica de Villamediana: «todo falsario y ladrón / a destierro y privación».",
  },
  {
    slug: "decima-anonima-sobre-la-muerte-de-villamediana",
    artworkImageUrl: "/images/artworks/valdes-leal-finis-gloriae-mundi.jpg",
    artworkTitle: "Finis gloriae mundi",
    artworkAuthor: "Juan de Valdés Leal (1672)",
    artworkCaption:
      "«El matador fue Bellido / y el impulso soberano.» Valdés Leal pinta el mismo mensaje: toda gloria mundana —la del poeta satírico incluida— acaba en podredumbre.",
  },
  {
    slug: "a-ines-que-se-tenia-las-canas-de-rubio",
    artworkImageUrl: "/images/artworks/goya-las-viejas.jpg",
    artworkTitle: "Las viejas (El tiempo)",
    artworkAuthor: "Francisco de Goya (1808–1812)",
    artworkCaption:
      "Las viejas de Goya con sus afeites y su espejo son las «Inés» de Alcázar: «dar plata por oro es vender gato por liebre». El tiempo que todo lo revela.",
  },
  {
    slug: "a-una-mujer-que-se-afeitaba-y-estaba-hermosa",
    artworkImageUrl: "/images/artworks/claesz-vanitas.jpg",
    artworkTitle: "Vanitas",
    artworkAuthor: "Pieter Claesz (1630)",
    artworkCaption:
      "Claesz pinta la belleza como engaño de los sentidos: el cráneo, la vela, el reloj de arena. Argensola llega más lejos: «ese cielo azul que todos vemos, / ni es cielo ni es azul».",
  },
  {
    slug: "epigrama-del-palillo-de-dientes",
    artworkImageUrl: "/images/artworks/murillo-muchachos-comiendo.jpg",
    artworkTitle: "Niños comiendo uvas y melón",
    artworkAuthor: "Bartolomé Esteban Murillo (c. 1645–1646)",
    artworkCaption:
      "Murillo pinta la alegría de comer cuando se puede. Polo de Medina pinta lo contrario: el que usa palillo sin haber comido, «rascándose» el hambre ante los demás.",
  },
  {
    slug: "la-vieja-y-el-gato",
    artworkImageUrl: "/images/artworks/van-honthorst-la-alcahueta.jpg",
    artworkTitle: "La alcahueta",
    artworkAuthor: "Gerrit van Honthorst (1625)",
    artworkCaption:
      "Van Honthorst captura la intriga y el humor de la vida íntima nocturna. El epigrama de Samaniego —«Peor es nada»— habita el mismo universo de medias luces y sobreentendidos.",
  },

  // ─── ROMANTICISMO ────────────────────────────────────────────────────────────
  {
    slug: "misero-leno-soneto",
    artworkImageUrl: "/images/artworks/friedrich-abadia-en-el-robledal.jpg",
    artworkTitle: "Abadía en el robledal",
    artworkAuthor: "Caspar David Friedrich (1809–1810)",
    artworkCaption:
      "Friedrich pinta ruinas de grandeza pasada en un paisaje invernal: el mismo «mísero leño destrozado y roto» del Duque de Rivas —el árbol que quiso ser barco y acabó naufragado.",
  },
  {
    slug: "cancion-del-pirata",
    artworkImageUrl: "/images/artworks/aivazovsky-novena-ola.jpg",
    artworkTitle: "La novena ola",
    artworkAuthor: "Iván Aivazovsky (1850)",
    artworkCaption:
      "Aivazovsky pinta el mar que el pirata de Espronceda proclama como única patria: «viento en popa a toda vela», sin temor a olas, tormentas ni enemigos.",
  },
  {
    slug: "rima-vii",
    artworkImageUrl: "/images/artworks/rembrandt-el-filosofo.jpg",
    artworkTitle: "Filósofo en meditación",
    artworkAuthor: "Rembrandt van Rijn (1632)",
    artworkCaption:
      "El filósofo de Rembrandt espera en la penumbra —como el arpa olvidada en el ángulo oscuro— que llegue la luz que lo despierte: «cuántas veces el genio / así duerme en el fondo del alma».",
  },
  {
    slug: "rima-xiii",
    artworkImageUrl: "/images/artworks/millais-ofelia.jpg",
    artworkTitle: "Ofelia",
    artworkAuthor: "John Everett Millais (1851–1852)",
    artworkCaption:
      "Los ojos azules de la amada que ríe, llora y sueña —el tema de la Rima XIII— encuentran su imagen más poderosa en Ophelia: la mirada que abre mundos y lleva al abismo.",
  },
  {
    slug: "rima-xxi",
    artworkImageUrl: "/images/artworks/titian-flora.jpg",
    artworkTitle: "Flora",
    artworkAuthor: "Tiziano (c. 1515)",
    artworkCaption:
      "Flora mira al pintor con la misma pregunta que la amada hace a Bécquer: «¿Qué es poesía?». La respuesta está en el acto mismo de mirar: «Poesía… eres tú».",
  },
  {
    slug: "rima-xxiii",
    artworkImageUrl: "/images/artworks/klimt-el-beso.jpg",
    artworkTitle: "El beso",
    artworkAuthor: "Gustav Klimt (1907–1908)",
    artworkCaption:
      "Klimt pinta el beso como fusión total, el acto que la Rima XXIII deja sin nombre: «por un beso… yo no sé / qué te diera por un beso».",
  },
  {
    slug: "soneto-antiesclavista",
    artworkImageUrl: "/images/artworks/goya-albanil-herido.jpg",
    artworkTitle: "El albañil herido",
    artworkAuthor: "Francisco de Goya (1786–1787)",
    artworkCaption:
      "Goya pinta la injusticia social con la misma claridad que Carolina Coronado exige en su soneto: «no puede haber esclavos en España / o esa tu libertad, pueblo, es mentira».",
  },
  {
    slug: "al-partir-soneto",
    artworkImageUrl: "/images/artworks/ria-de-vigo.jpg",
    artworkTitle: "Ría de Vigo",
    artworkAuthor: "Obra anónima (s. XIX)",
    artworkCaption:
      "El barco que se aleja del puerto, las velas que se izan, el ancla que se alza: la escena que Avellaneda vivió en 1836 al dejar Cuba camino de España.",
  },
  {
    slug: "las-contradicciones-soneto",
    artworkImageUrl: "/images/artworks/goya-perro-semihundido.jpg",
    artworkTitle: "Perro semihundido",
    artworkAuthor: "Francisco de Goya (c. 1819–1823)",
    artworkCaption:
      "El perro de Goya —atrapado entre lo visible y lo que lo traga— es la imagen exacta de las contradicciones de Avellaneda: «me lanzo al cielo, y préndeme la tierra».",
  },

  // ─── SIGLO XX ────────────────────────────────────────────────────────────────
  {
    slug: "castilla-el-cid-cabalga",
    artworkImageUrl: "/images/artworks/el-cid-amansa-al-leon.jpg",
    artworkTitle: "El Cid amansando al león",
    artworkAuthor: "Ilustración histórica (s. XIX)",
    artworkCaption:
      "El Cid guerrero que Manuel Machado recrea en «polvo, sudor y hierro»: el mismo héroe que amansa fieras y que, al destierro, no puede detenerse ante el llanto de una niña.",
  },
  {
    slug: "la-guitarra-poema-cante-jondo",
    artworkImageUrl: "/images/artworks/fortuny-patio-en-granada.jpg",
    artworkTitle: "Patio de la Alhambra",
    artworkAuthor: "Mariano Fortuny (1871)",
    artworkCaption:
      "El alma de Granada que Fortuny captura en el patio de la Alhambra es la misma que llora en la guitarra de Lorca: «arena del Sur caliente / que pide camelias blancas».",
  },
  {
    slug: "romance-de-la-luna-luna",
    artworkImageUrl: "/images/artworks/van-gogh-noche-estrellada.jpg",
    artworkTitle: "La noche estrellada",
    artworkAuthor: "Vincent van Gogh (1889)",
    artworkCaption:
      "Van Gogh pinta la luna como fuerza viva que gira sobre el pueblo dormido. Lorca la convierte en muerte: «por el cielo va la luna / con un niño de la mano».",
  },
  {
    slug: "la-casada-infiel",
    artworkImageUrl: "/images/artworks/goya-la-boda.jpg",
    artworkTitle: "La boda",
    artworkAuthor: "Francisco de Goya (1791–1792)",
    artworkCaption:
      "Goya pinta el matrimonio de conveniencia como carnaval. La casada infiel de Lorca vive al margen de esa convención: mintió que era soltera, y el gitano se portó «como quien soy».",
  },
  {
    slug: "prendimiento-de-antonito-el-camborio",
    artworkImageUrl: "/images/artworks/goya-la-novillada.jpg",
    artworkTitle: "La novillada",
    artworkAuthor: "Francisco de Goya (1779–1780)",
    artworkCaption:
      "La guardia civil del romance de Lorca tiene la misma presencia aplastante que el toro de Goya: poder bruto que se lleva al gitano «codo con codo» camino de Sevilla.",
  },
];

async function main() {
  console.log(`Actualizando artworks para ${artworkUpdates.length} fragmentos de la antología…`);

  let updated = 0;
  let notFound = 0;

  for (const item of artworkUpdates) {
    const fragment = await prisma.fragment.findUnique({ where: { slug: item.slug } });
    if (!fragment) {
      console.warn(`  ⚠  No encontrado: ${item.slug}`);
      notFound++;
      continue;
    }

    await prisma.fragment.update({
      where: { slug: item.slug },
      data: {
        artworkImageUrl: item.artworkImageUrl,
        artworkTitle: item.artworkTitle,
        artworkAuthor: item.artworkAuthor,
        artworkCaption: item.artworkCaption,
      },
    });

    console.log(`  ✓  ${item.slug}`);
    updated++;
  }

  console.log(`\nListo. Actualizados: ${updated} | No encontrados: ${notFound}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
