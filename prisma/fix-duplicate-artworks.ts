import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

// Each entry: [slug, newArtworkImageUrl, newArtworkTitle, newArtworkAuthor, newArtworkCaption]
// The fragment at `slug` will receive the new image.
// For the fragment that KEEPS the original image, no change is needed.
const updates: [string, string, string, string, string][] = [
  // ── aivazovsky (keep: don-alvaro-precipicio-final) ─────────────────────────
  [
    "cancion-del-pirata",
    "/images/artworks/turner-fighting-temeraire.jpg",
    "El Fighting Temeraire",
    "J.M.W. Turner (1839)",
    "Turner pintó el último viaje del navío de guerra HMS Temeraire hacia el desguace: la misma melancolía épica que Espronceda infunde a la vida libre e irrefrenable del pirata, que prefiere el mar a cualquier cadena.",
  ],
  [
    "rima-lii",
    "/images/artworks/friedrich-caminante-niebla.jpg",
    "El caminante sobre el mar de niebla",
    "Caspar David Friedrich (c. 1818)",
    "Friedrich pintó la soledad sublime del hombre que mira al vacío desde la cima: la misma imagen del yo romántico que Bécquer evoca en «Volverán las oscuras golondrinas» mientras contempla una dicha que no volverá.",
  ],

  // ── bernini (keep: llama-de-amor-viva) ─────────────────────────────────────
  [
    "vivo-sin-vivir-en-mi-villancico-completo",
    "/images/artworks/zurbaran-santa-teresa.jpg",
    "Santa Teresa de Jesús",
    "Francisco de Zurbarán (c. 1638)",
    "Zurbarán retrató a Santa Teresa con la mirada elevada hacia lo divino, en ese instante de éxtasis entre la vida y la muerte que la propia Teresa cantó: «Vivo sin vivir en mí, / y tan alta vida espero, / que muero porque no muero.»",
  ],
  [
    "don-juan-salvacion-final",
    "/images/artworks/murillo-inmaculada.jpg",
    "La Inmaculada Concepción",
    "Bartolomé Esteban Murillo (c. 1678)",
    "Murillo pintó a la Virgen rodeada de luz y ángeles, imagen de la gracia redentora que en el Don Juan de Zorrilla desciende sobre el seductor: doña Inés intercede desde el cielo y salva el alma de don Juan en el umbral de la muerte.",
  ],

  // ── bosco (keep: a-un-hombre-de-gran-nariz) ────────────────────────────────
  [
    "anoranza-de-los-tiempos-pasados",
    "/images/artworks/madrazo-pelayo-en-covadonga.jpg",
    "Pelayo en Covadonga",
    "José de Madrazo (1818)",
    "Madrazo pintó el momento fundacional de la Reconquista: la misma añoranza épica de los tiempos gloriosos que recorre este poema, donde el poeta mira hacia un pasado que percibe como irrecuperable.",
  ],

  // ── botticelli (keep: soneto-v) ─────────────────────────────────────────────
  [
    "cerca-del-tajo",
    "/images/artworks/constable-haywain.jpg",
    "El carro de heno (The Hay Wain)",
    "John Constable (1821)",
    "Constable inventó la pintura del paisaje vivido desde dentro: la misma celebración del río, el árbol y la luz que Garcilaso eleva en esta oda a la ribera del Tajo, el paisaje natal como forma de la felicidad.",
  ],

  // ── brueghel-carnaval (keep: la-batalla-de-don-carnal) ─────────────────────
  [
    "la-chata-de-malangosto",
    "/images/artworks/steen-mescolanza.jpg",
    "Escena de taberna",
    "Jan Steen (c. 1660–1670)",
    "Jan Steen fue el maestro de la algarabía popular: la misma atmósfera de exceso, juerga y desorden que el Arcipreste de Hita pone en boca de la Chata de Malangosto, guardiana feroz del paso de montaña.",
  ],

  // ── brueghel-triunfo (keep: la-muerte-de-trotaconventos) ───────────────────
  [
    "procesion-satirica-a-felipe-iv",
    "/images/artworks/goya-sueno-razon.jpg",
    "El sueño de la razón produce monstruos (Capricho n.º 43)",
    "Francisco de Goya (1799)",
    "Goya dibujó lo que surge cuando la razón duerme: los mismos monstruos que el poeta satírico invoca contra la corte de Felipe IV, un mundo donde la sinrazón y la hipocresía han ocupado el lugar de la virtud.",
  ],

  // ── byron (keep: el-estudiante-de-salamanca-retrato) ───────────────────────
  [
    "don-juan-convite-apuesta",
    "/images/artworks/velazquez-borrachos.jpg",
    "El triunfo de Baco (Los borrachos)",
    "Diego Velázquez (1628–1629)",
    "Velázquez retrató a Baco entre soldados y juerguistas: la misma atmósfera de festín, fanfarronería y apuesta que preside la escena de la hostería donde don Juan reta a don Luis Mejía y pone precio a su conquista de doña Inés.",
  ],

  // ── cantigas (keep: jarcha-garid-vos) ──────────────────────────────────────
  [
    "el-prado-alegorico",
    "/images/artworks/beato-liebana.jpg",
    "Mapa del mundo (Beato de Liébana, siglo X)",
    "Manuscrito iluminado (c. 970–975)",
    "Los mapas del Beato de Liébana representan el mundo medieval con la Jerusalén celestial en el centro: la misma visión alegórica del prado como jardín del alma que Gonzalo de Berceo construye en su Introducción a los Milagros.",
  ],

  // ── caravaggio (keep: el-amor-ha-tales-manas) ──────────────────────────────
  [
    "alegato-contra-el-amor",
    "/images/artworks/durer-melancolia.jpg",
    "Melancolía I",
    "Alberto Durero (1514)",
    "Durero grabó la melancolía como el estado del genio encadenado por lo que no puede alcanzar: la misma disposición de quien, como el poeta, ha meditado largo tiempo sobre el amor y ha concluido que es pura trampa.",
  ],

  // ── cid-arcas (keep: la-nina-de-burgos) ────────────────────────────────────
  [
    "romance-del-rey-don-sancho",
    "/images/artworks/bocklin-isla-muertos.jpg",
    "La isla de los muertos",
    "Arnold Böcklin (1880)",
    "Böcklin pintó el silencio final de los muertos: la misma atmósfera de destino inevitable que rodea al rey don Sancho, muerto por la traición de Bellido Dolfos ante los muros de Zamora, mientras el Cid jura vengarle.",
  ],

  // ── claesz (keep: la-fugacidad-de-la-vida) ─────────────────────────────────
  [
    "a-una-mujer-que-se-afeitaba-y-estaba-hermosa",
    "/images/artworks/steenwijck-vanitas.jpg",
    "Vanitas (naturaleza muerta alegórica)",
    "Harmen Steenwijck (c. 1640)",
    "Steenwijck puso en una sola mesa el cráneo, la vela y los libros: los mismos símbolos que Quevedo convoca cuando ve a una mujer que se tiñe el cabello, recordándonos que la hermosura que el tiempo borra no era nuestra.",
  ],

  // ── corot (keep: el-tapiz-de-orfeo-y-euridice) ─────────────────────────────
  [
    "soneto-cxxix-a-la-muerte-de-garcilaso",
    "/images/artworks/morales-piedad.jpg",
    "La Piedad",
    "Luis de Morales «El Divino» (c. 1560–1570)",
    "Morales pintó el llanto sobre el cuerpo de Cristo con la misma ternura doliente con que Boscán llora la muerte temprana de Garcilaso: el genio arrebatado antes de tiempo, el cuerpo inerte que el amor no puede devolver.",
  ],

  // ── el-cid-amansa (keep: el-cid-y-el-leon) ────────────────────────────────
  [
    "castilla-el-cid-cabalga",
    "/images/artworks/goya-dos-de-mayo.jpg",
    "El dos de mayo de 1808 en Madrid (La carga de los mamelucos)",
    "Francisco de Goya (1814)",
    "Goya pintó el ímpetu del pueblo español en combate: la misma energía épica que el romance evoca cuando describe a Rodrigo Díaz cabalgando por Castilla, convirtiendo la derrota en amenaza y el exilio en leyenda.",
  ],

  // ── el-greco-san-jeronimo (keep: la-salvacion-del-canonigo) ────────────────
  [
    "cantico-espiritual-la-busqueda",
    "/images/artworks/el-greco-san-francisco.jpg",
    "San Francisco de Asís en éxtasis",
    "El Greco y taller (c. 1577–1580)",
    "El Greco pintó al santo en el momento de la visión mística, cuando el mundo exterior desaparece y solo existe la búsqueda del Amado: el mismo estado de la esposa del Cántico que sale de sí misma para encontrar a Dios en la oscuridad.",
  ],

  // ── el-greco-vista-toledo (keep: nuestras-vidas-son-los-rios) ───────────────
  [
    "vida-retirada-oh-monte-oh-fuente-oh-rio",
    "/images/artworks/claude-lorrain-pastoral.jpg",
    "La campiña romana",
    "Claude Lorrain (1639)",
    "Lorrain pintó el campo romano bañado en luz dorada: la misma visión de la naturaleza como lugar de paz y verdad que Fray Luis de León canta en su Oda a la vida retirada, lejos del ruido y la ambición de la corte.",
  ],

  // ── fortuny (keep: la-guitarra-poema-cante-jondo) ──────────────────────────
  [
    "jarcha-vaise-meu-corachon",
    "/images/artworks/delacroix-femmes-alger.jpg",
    "Mujeres de Argel en su apartamento",
    "Eugène Delacroix (1834)",
    "Delacroix pintó el mundo interior del al-Ándalus con la mirada del viajero que siente que hay una belleza irrecuperable: la misma nostalgia de la jarcha mozárabe, donde el corazón parte hacia el ser amado en la lengua mezclada de dos civilizaciones.",
  ],

  // ── fra-angelico (keep: la-caida-del-canonigo) ─────────────────────────────
  [
    "quiero-fer-una-prosa",
    "/images/artworks/simone-martini-virgilio.jpg",
    "Frontispicio del Virgilio de Petrarca",
    "Simone Martini (1336)",
    "Simone Martini iluminó el manuscrito de Virgilio para Petrarca: el mismo arte de unir imagen y palabra que Gonzalo de Berceo practica en el primer verso de sus Milagros, donde querer «fer una prosa» es también querer pintar.",
  ],

  // ── friedrich-abadia (keep: el-estudiante-de-salamanca-noche) ───────────────
  [
    "misero-leno-soneto",
    "/images/artworks/gericault-balsa-medusa.jpg",
    "La balsa de la Medusa",
    "Théodore Géricault (1818–1819)",
    "Géricault pintó la desesperación de los náufragos que se aferran a un mísero leño en medio del océano: la misma imagen con que el Duque de Rivas cierra su soneto sobre la existencia humana a la deriva de pasiones que no gobernamos.",
  ],
  [
    "don-juan-cementerio-convite",
    "/images/artworks/goya-saturno.jpg",
    "Saturno devorando a su hijo",
    "Francisco de Goya (1819–1823)",
    "Goya pintó la muerte como un dios que devora lo que él mismo engendró: la misma imagen de terror y transgresión sobrenatural que preside la escena del cementerio en el Don Juan Tenorio, cuando los muertos se levantan a cenar con el vivo.",
  ],

  // ── gentileschi-judith (keep: muerte-de-celestina) ─────────────────────────
  [
    "hombres-necios-que-acusais",
    "/images/artworks/gentileschi-autorretrato.jpg",
    "Autorretrato como alegoría de la Pintura",
    "Artemisia Gentileschi (c. 1638–1639)",
    "Artemisia Gentileschi, pintora excepcional en un mundo de hombres, se retrató como la propia Pintura: la misma afirmación de la inteligencia femenina frente al doble rasero masculino que Sor Juana denuncia en su célebre redondilla.",
  ],

  // ── gerome-pigmalion (keep: calisto-es-rechazado) ──────────────────────────
  [
    "ojos-claros-serenos",
    "/images/artworks/raphael-fornarina.jpg",
    "La Fornarina",
    "Rafael Sanzio (c. 1519–1520)",
    "Rafael pintó a su amante con la ternura de quien mira y es mirado: la misma paradoja de Gutierre de Cetina, que pide a unos ojos claros y serenos que si son tranquilos para quienes los miran, no sean crueles con quien los adora.",
  ],

  // ── goya-albanil (keep: las-victimas-de-la-injusticia) ──────────────────────
  [
    "soneto-antiesclavista",
    "/images/artworks/goya-tres-de-mayo.jpg",
    "El tres de mayo de 1808 en Madrid",
    "Francisco de Goya (1814)",
    "Goya pintó la barbarie del poder sobre el cuerpo indefenso: la misma denuncia que Blanco White dirige contra la esclavitud en su soneto, donde la crueldad de los hombres sobre otros hombres es el escándalo que ninguna razón puede justificar.",
  ],
  [
    "don-alvaro-fuga-fatal",
    "/images/artworks/goya-duelo-garrotes.jpg",
    "Duelo a garrotazos",
    "Francisco de Goya (1820–1823)",
    "Goya pintó el duelo más absurdo: dos hombres hundiéndose en el barro mientras se golpean sin poder escapar. Es la imagen perfecta de don Álvaro y los hermanos de Leonor: atrapados en un círculo de honor y venganza que solo puede terminar en muerte.",
  ],

  // ── goya-caprichos-si (keep: el-si-de-las-ninas-educacion) ─────────────────
  [
    "poderoso-caballero-es-don-dinero",
    "/images/artworks/bruegel-danza-campesinos.jpg",
    "La danza campesina",
    "Pieter Bruegel el Viejo (c. 1568)",
    "Bruegel pintó la energía bruta del pueblo entregado a la fiesta: la misma fuerza democrática e irresistible que Quevedo ve en el dinero, que iguala al poderoso caballero con el más humilde labriego en la danza universal de la codicia.",
  ],

  // ── goya-el-aquelarre (keep: conjuro-a-pluton) ──────────────────────────────
  [
    "don-alvaro-misterio-y-amor",
    "/images/artworks/fuseli-pesadilla.jpg",
    "La pesadilla",
    "Henry Fuseli (1781)",
    "Fuseli pintó el poder de lo oscuro sobre el cuerpo dormido: la misma atmósfera de presencia amenazante e inexplicable que rodea a don Álvaro en Sevilla, ese extranjero de origen misterioso que todos temen sin saber por qué.",
  ],

  // ── goya-la-boda (keep: el-si-de-las-ninas-desenlace) ───────────────────────
  [
    "el-castellano-viejo",
    "/images/artworks/goya-pelele.jpg",
    "El pelele",
    "Francisco de Goya (1791–1792)",
    "Goya pintó a un pelele manejado por cuatro mujeres: la misma sensación de ridículo social que sufre el narrador de Larra en su visita al castellano viejo, zarandeado por las convenciones de una hospitalidad que devora en lugar de acoger.",
  ],
  [
    "la-casada-infiel",
    "/images/artworks/klimt-danae.jpg",
    "Dánae",
    "Gustav Klimt (c. 1907–1908)",
    "Klimt pintó el abandono al deseo con una sensualidad que borra los límites entre el sueño y la vigilia: la misma fusión de cuerpos y secreto que García Lorca evoca en «La casada infiel», donde el encuentro nocturno a la orilla del río es único e irrepetible.",
  ],

  // ── goya-la-novillada (keep: prendimiento-de-antonito) ──────────────────────
  [
    "carta-vii-cadalso",
    "/images/artworks/mengs-carlos-iii.jpg",
    "Carlos III de España",
    "Retrato real (s. XVIII)",
    "El retrato de Carlos III preside la España ilustrada en la que Cadalso sitúa sus Cartas marruecas: el siglo de las reformas, de la razón como programa político, y también de la distancia irónica entre lo que se proclama y lo que se practica.",
  ],

  // ── goya-las-viejas (keep: a-ines-que-se-tenia-las-canas) ───────────────────
  [
    "trotaconventos",
    "/images/artworks/velazquez-vieja-friendo.jpg",
    "Vieja friendo huevos",
    "Diego Velázquez (1618)",
    "Velázquez pintó a una anciana en su oficio con toda la dignidad de lo cotidiano: la misma vejez activa y sin pudores que el Arcipreste de Hita da a Trotaconventos, la mensajera que mueve el mundo con sus artes.",
  ],

  // ── goya-maja-embozados (keep: que-muera-yo-liseo) ──────────────────────────
  [
    "la-opresion-del-comendador",
    "/images/artworks/david-juramento-horacios.jpg",
    "El juramento de los Horacios",
    "Jacques-Louis David (1784)",
    "David pintó el juramento colectivo ante la injusticia del tirano: la misma determinación que mueve a los vecinos de Fuente Ovejuna cuando el Comendador viola el honor del pueblo y estos deciden actuar unidos bajo el grito «¡Fuente Ovejuna lo hizo!»",
  ],

  // ── goya-majas-on-balcony (keep: amar-el-dia) ───────────────────────────────
  [
    "rima-liii",
    "/images/artworks/waterhouse-miranda.jpg",
    "Miranda (La Tempestad)",
    "John William Waterhouse (1916)",
    "Waterhouse pintó a Miranda mirando el mar desde el que nunca llega quien la rescate: la misma soledad de quien espera en Bécquer, rima LIII, sabiendo que hay quien habla de amor y hay quien lo vive, y que los dos caminos no convergen.",
  ],

  // ── goya-perro (keep: el-dia-de-difuntos-de-1836) ───────────────────────────
  [
    "las-contradicciones-soneto",
    "/images/artworks/goya-la-romeria.jpg",
    "La romería de San Isidro",
    "Francisco de Goya (c. 1821–1823)",
    "Goya pintó la procesión de San Isidro como un cortejo de sombras: la multitud que avanza sin saber a dónde, mezcla de devoción y delirio. Es la imagen perfecta del soneto de las contradicciones, donde todo el mundo siente y nadie comprende.",
  ],
  [
    "don-alvaro-gran-monólogo",
    "/images/artworks/delacroix-sardanapalo.jpg",
    "La muerte de Sardanápalo",
    "Eugène Delacroix (1827)",
    "Delacroix pintó la destrucción grandiosa de quien decide llevarse consigo al abismo todo cuanto amó: el mismo gesto de don Álvaro al lanzarse al precipicio, convencido de que no hay redención posible para quien ha sembrado tanta muerte sin quererlo.",
  ],

  // ── goya-ya-es-hora (keep: vuelva-usted-manana) ─────────────────────────────
  [
    "no-he-de-callar-epistola-fragmento",
    "/images/artworks/goya-inquisicion.jpg",
    "Escena de Inquisición (Auto de fe)",
    "Francisco de Goya (c. 1812–1819)",
    "Goya pintó el tribunal eclesiástico con una mirada que mezcla el espanto y la sátira: la misma valentía de Quevedo en su epístola «No he de callar», donde se enfrenta a los poderosos sabiendo que le costará el destierro.",
  ],

  // ── hondecoeter (keep: la-zorra-y-el-gallo) ────────────────────────────────
  [
    "romance-de-la-loba-parda",
    "/images/artworks/oudry-lobo.jpg",
    "Lobo muerto",
    "Jean-Baptiste Oudry (1721)",
    "Oudry pintó al lobo como la amenaza real del mundo pastoral: la misma loba parda del romance que baja de la sierra a diezmar el rebaño del pastor, convirtiendo una anécdota rural en la más pura expresión del miedo y la pérdida.",
  ],

  // ── jura-de-santa-gadea (keep: romance-de-la-jura) ─────────────────────────
  [
    "destierro-del-cid",
    "/images/artworks/velazquez-menipo.jpg",
    "Menipo (filósofo cínico)",
    "Diego Velázquez (c. 1639–1641)",
    "Velázquez pintó al filósofo mendicante con la dignidad del que nada posee y nada teme: la misma grandeza del Cid en el momento de su destierro, cuando sale de Burgos sin rencor, con solo su espada y su honor intactos.",
  ],

  // ── klimt-beso (keep: rima-xxiii) ────────────────────────────────────────────
  [
    "cantico-espiritual-la-union",
    "/images/artworks/bernini-apolo-dafne.jpg",
    "Apolo y Dafne",
    "Gian Lorenzo Bernini (1622–1625)",
    "Bernini esculpió el instante de la transformación: el cuerpo que se convierte en otra cosa en el momento del abrazo. Es la imagen de la unión mística de San Juan, donde el alma se transforma en el Amado cuando por fin le alcanza.",
  ],
  [
    "don-juan-jardin-angel-de-amor",
    "/images/artworks/fragonard-columpio.jpg",
    "El columpio",
    "Jean-Honoré Fragonard (1767)",
    "Fragonard pintó el jardín como escenario del galanteo: la misma atmósfera de ligereza y seducción que envuelve la escena del jardín en el Don Juan Tenorio, donde don Juan le habla a doña Inés de amor entre flores y sombras cómplices.",
  ],

  // ── millais-ofelia (keep: la-muerte-de-elisa) ────────────────────────────────
  [
    "romance-del-enamorado-y-la-muerte",
    "/images/artworks/waterhouse-dama-shalott.jpg",
    "La dama de Shalott",
    "John William Waterhouse (1888)",
    "Waterhouse pintó a la dama que muere navegando hacia el amor que la maldición le prohíbe: la misma lógica del romance medieval donde el enamorado acepta la muerte como precio de un amor que no cabe en la vida.",
  ],
  [
    "rima-xiii",
    "/images/artworks/rossetti-beata-beatrix.jpg",
    "Beata Beatrix",
    "Dante Gabriel Rossetti (1864–1870)",
    "Rossetti pintó a Beatrice Portinari en el momento de su tránsito entre la vida y la muerte, bañada en luz: la misma mujer etérea y lejana que Bécquer describe en la Rima XIII, dorada, morena o negra de cabello, siempre fuera del alcance.",
  ],

  // ── murillo-muchachos (keep: el-racimo-de-uvas) ─────────────────────────────
  [
    "epigrama-del-palillo-de-dientes",
    "/images/artworks/snyders-bodegon-frutas.jpg",
    "Bodegón con frutas, verduras y caza",
    "Frans Snyders (c. 1614)",
    "Snyders pintó la abundancia de la mesa con una generosidad desmesurada: la misma abundancia de la que el palillo de dientes es el signo más elocuente, el objeto que solo existe después de un banquete digno de tal nombre.",
  ],

  // ── pereda-sueno (keep: ni-se-si-muero) ─────────────────────────────────────
  [
    "planto-de-pleberio",
    "/images/artworks/memling-juicio-final.jpg",
    "El Juicio Final",
    "Hans Memling (c. 1467–1471)",
    "Memling pintó el balance último de todo lo vivido, el momento en que el mundo cierra sus cuentas: la misma desesperanza de Pleberio ante el cuerpo de su hija Melibea, su lamento final contra el amor, el mundo y la fortuna que lo arrebató todo.",
  ],

  // ── poussin-pastores (keep: el-canto-de-tirreno-y-alcino) ───────────────────
  [
    "romance-de-la-gentil-dama-y-el-rustico-pastor",
    "/images/artworks/watteau-citerea.jpg",
    "Peregrinación a la isla de Citerea",
    "Antoine Watteau (1717)",
    "Watteau pintó la elegancia del galanteo cortesano convertida en viaje hacia el reino del amor: la misma distancia irreconciliable entre la dama refinada y el rudo pastor que el romance medieval pone en escena con ternura y cierta crueldad.",
  ],
  [
    "pastora-si-mal-me-quieres",
    "/images/artworks/boucher-pastoral.jpg",
    "Pastora descansando con su pastor",
    "François Boucher (c. 1761)",
    "Boucher pintó el idilio pastoral como un sueño de belleza y suavidad: el mismo universo de pastores y pastoras en que Lope de Vega sitúa este villancico donde el amor es un juego de esquiveces y rendiciones.",
  ],

  // ── pradilla-rendicion (keep: romance-de-abenamar) ──────────────────────────
  [
    "fuente-ovejuna-lo-hizo",
    "/images/artworks/delacroix-libertad.jpg",
    "La Libertad guiando al pueblo",
    "Eugène Delacroix (1830)",
    "Delacroix pintó el momento en que el pueblo entero toma la calle y la historia cambia: la misma energía colectiva que Lope de Vega captura en el grito de Fuente Ovejuna, donde nadie actuó solo y todos fueron responsables.",
  ],
  [
    "don-alvaro-soldado-de-fortuna",
    "/images/artworks/velazquez-rendicion-breda.jpg",
    "La rendición de Breda (Las lanzas)",
    "Diego Velázquez (1634–1635)",
    "Velázquez pintó la generosidad del vencedor y la dignidad del vencido: la misma ambigüedad de don Álvaro en el campo de batalla italiano, soldado brillante cuya victoria no puede deshacer el peso del destino que lo persigue.",
  ],

  // ── rembrandt-filosofo (keep: la-honra-del-filosofo) ────────────────────────
  [
    "rima-vii",
    "/images/artworks/vermeer-chica-perla.jpg",
    "La joven de la perla",
    "Johannes Vermeer (c. 1665)",
    "Vermeer pintó una mirada que se vuelve hacia nosotros con una pregunta que no termina de formularse: la misma luz y misterio que Bécquer evoca en la Rima VII, «Del salón en el ángulo oscuro», donde el alma de la guitarra espera que la mano que la despierte.",
  ],

  // ── reymerswaele (keep: el-hombre-cargado-de-piedras) ───────────────────────
  [
    "dineros-son-calidad",
    "/images/artworks/metsys-prestamista.jpg",
    "El prestamista y su mujer",
    "Quentin Metsys (c. 1514)",
    "Metsys pintó el mundo del dinero contado sobre la mesa: la misma crítica que Quevedo dirige a una sociedad donde «dineros son calidad» y la nobleza de sangre pierde ante el poder de la moneda.",
  ],

  // ── ria-de-vigo (keep: ondas-do-mar-de-vigo) ────────────────────────────────
  [
    "al-partir-soneto",
    "/images/artworks/turner-lluvia-vapores.jpg",
    "Lluvia, vapor y velocidad",
    "J.M.W. Turner (1844)",
    "Turner pintó el poder de la máquina y la velocidad como metáfora del destino que arrastra: la misma sensación de partir sin poder detenerse que Gertrudis Gómez de Avellaneda expresa al abandonar Cuba, su tierra natal, hacia una España desconocida.",
  ],

  // ── rubens-jardin (keep: la-vida-retirada) ──────────────────────────────────
  [
    "egloga-i-queja-de-salicio",
    "/images/artworks/ruisdael-molino.jpg",
    "El molino de Wijk bij Duurstede",
    "Jacob van Ruisdael (c. 1668–1670)",
    "Ruisdael pintó el paisaje holandés con una presencia casi humana, donde el cielo y el agua dominan lo que el hombre construyó: la misma grandeza melancólica de la naturaleza que Garcilaso pone como testigo del desamor de Galatea en su Égloga I.",
  ],

  // ── titian-amor-sacro (keep: melibea-reconoce-su-amor) ──────────────────────
  [
    "sin-dios-sin-vos-y-sin-mi",
    "/images/artworks/el-greco-san-martin.jpg",
    "San Martín y el mendigo",
    "El Greco (c. 1597–1599)",
    "El Greco pintó el gesto de la caridad como forma suprema del amor: la misma teología del amor trinitario que Santa Teresa despliega en este poema, donde el alma solo puede ser completa en presencia de Dios, del amado y de sí misma.",
  ],
  [
    "al-que-ingrato-me-deja",
    "/images/artworks/judith-leyster-autorretrato.jpg",
    "Autorretrato",
    "Judith Leyster (1630)",
    "Judith Leyster se pintó a sí misma sonriendo ante su caballete, afirmando con ese gesto su lugar en un mundo de pintores varones: la misma autoafirmación intelectual que Sor Juana despliega en este poema, donde da la vuelta al tópico del amor traicionado.",
  ],

  // ── titian-flora (keep: soneto-xxiii) ───────────────────────────────────────
  [
    "retrato-de-la-dama-ideal",
    "/images/artworks/ghirlandaio-giovanna.jpg",
    "Retrato de Giovanna Tornabuoni",
    "Domenico Ghirlandaio (1489–1490)",
    "Ghirlandaio retrató a Giovanna Tornabuoni con la perfección ideal del Renacimiento: la misma dama de cabellos de oro y tez de nieve que Petrarca convirtió en canon de belleza y que los poetas del Siglo de Oro imitaron en sus sonetos de retrato.",
  ],
  [
    "rima-xxi",
    "/images/artworks/leighton-flaming-june.jpg",
    "Flaming June",
    "Frederic Lord Leighton (1895)",
    "Leighton pintó a una mujer dormida envuelta en telas naranjas, entre el sueño y la vida: la misma belleza que Bécquer convoca en la Rima XXI, «¿Qué es poesía?», una pregunta que el poeta responde señalando a la mujer que le pregunta.",
  ],

  // ── titian-venus-adonis (keep: el-tapiz-de-venus-y-adonis) ──────────────────
  [
    "soneto-x",
    "/images/artworks/pontormo-hallebardero.jpg",
    "Retrato de un alabardero",
    "Jacopo Pontormo (c. 1528–1530)",
    "Pontormo pintó a un joven soldado con una belleza tensa y contenida: la misma juventud dorada e irrepetible que Garcilaso celebra en el Soneto X, donde los ojos de la amada son descritos como un tesoro que el tiempo acabará por llevarse.",
  ],

  // ── turner-norham (keep: rima-i) ─────────────────────────────────────────────
  [
    "el-infante-arnaldos",
    "/images/artworks/aivazovsky-brig-mercury.jpg",
    "El bergantín Merkuri atacado por dos buques turcos",
    "Iván Aivazovsky (1892)",
    "Aivazovsky pintó el encuentro entre la pequeña nave y el poder del mar y del enemigo: la misma atmósfera de prodigio y misterio que rodea al barco desconocido del romance, cuyo marinero canta una canción que solo puede escuchar quien abandona el mundo.",
  ],

  // ── valdes-leal-finis (keep: los-suenos-suenos-son) ─────────────────────────
  [
    "decima-anonima-sobre-la-muerte-de-villamediana",
    "/images/artworks/holbein-embajadores.jpg",
    "Los embajadores",
    "Hans Holbein el Joven (1533)",
    "Holbein pintó el poder y el saber humanos junto a un cráneo distorsionado que los anula: la misma meditación de vanidades que esta décima anónima dedica al Conde de Villamediana, muerto en la cima de su gloria, víctima de la envidia y la fortuna.",
  ],

  // ── valdes-leal-in-ictu (keep: amor-constante-mas-alla-de-la-muerte) ─────────
  [
    "este-que-ves-engano-colorido",
    "/images/artworks/velazquez-meninas.jpg",
    "Las Meninas",
    "Diego Velázquez (1656)",
    "Velázquez pintó el cuadro más filosófico de la historia: el pintor que se pinta pintando mientras el cuadro nos mira. Es la imagen perfecta del soneto de Sor Juana sobre su retrato: la tela que promete eternidad y no es sino polvo, sombra y nada.",
  ],

  // ── van-gogh-noche (keep: romance-de-la-luna-luna) ──────────────────────────
  [
    "noche-serena",
    "/images/artworks/adam-elsheimer-huida.jpg",
    "La huida a Egipto",
    "Adam Elsheimer (1609)",
    "Elsheimer pintó la primera noche estrellada científicamente exacta de la historia del arte, con la Vía Láctea visible sobre los fugitivos: la misma noche que Fray Luis de León contempla en su «Noche serena», maravillado ante el esplendor del cielo que contrasta con la miseria del mundo.",
  ],

  // ── van-honthorst (keep: la-alcahueta-celestina-y-su-mediacion) ─────────────
  [
    "respuesta-del-amor",
    "/images/artworks/raphael-triunfo-galatea.jpg",
    "El triunfo de Galatea",
    "Rafael Sanzio (c. 1511–1514)",
    "Rafael pintó a Galatea triunfando sobre el mar y los amores no correspondidos: la misma alegría de quien ha encontrado la respuesta del amor en el poema, donde el dios Cupido por fin hace blanco y la ninfa ya no huye.",
  ],
  [
    "la-vieja-y-el-gato",
    "/images/artworks/chardin-raya.jpg",
    "La raya",
    "Jean-Baptiste-Siméon Chardin (c. 1728)",
    "Chardin pintó una cocina donde un gato acecha entre los pescados: el mismo universo doméstico de animales y viejas que Lope de Vega caricaturiza en este poema, donde la anciana y el gato comparten la misma voracidad.",
  ],

  // ── velazquez-hilanderas (keep: soneto-dentro-del-soneto) ───────────────────
  [
    "liebres-cobardes-nacisteis",
    "/images/artworks/velazquez-marte.jpg",
    "Marte",
    "Diego Velázquez (c. 1639–1641)",
    "Velázquez pintó al dios de la guerra en actitud pensativa y cansada, desmitificando al héroe marcial: el mismo contraste que Quevedo explota al hablar de «liebres cobardes», animales que no merecen el heroísmo que el amor les exige.",
  ],

  // ── velazquez-gongora (keep: mientras-por-competir) ─────────────────────────
  [
    "redondilla-contra-quevedo-y-lope",
    "/images/artworks/rubens-tres-gracias.jpg",
    "Las tres Gracias",
    "Pedro Pablo Rubens (c. 1630–1635)",
    "Rubens pintó la elegancia y la sensualidad unidas en perfecta armonía: la misma aspiración poética de quienes cultivan el arte literario, aunque Góngora, en su redondilla satírica, se ría de quienes lo hacen con menos gracia que las diosas.",
  ],

  // ── vermeer-carta (keep: soneto-del-olvido-imposible) ───────────────────────
  [
    "dona-ines-lee-la-carta",
    "/images/artworks/metsu-mujer-leyendo-carta.jpg",
    "Mujer leyendo una carta",
    "Gabriel Metsu (c. 1664–1666)",
    "Metsu pintó el momento íntimo de la lectura de una carta de amor: exactamente la escena que Zorrilla pone en escena cuando doña Inés lee en su celda la carta de don Juan, y descubre que el amor existe aunque nunca lo hubiera vivido antes.",
  ],

  // ── zurbaran-san-juan (keep: noche-oscura-del-alma) ─────────────────────────
  [
    "tras-de-un-amoroso-lance",
    "/images/artworks/el-greco-pentecostes.jpg",
    "Pentecostés",
    "El Greco (c. 1600)",
    "El Greco pintó el momento en que el fuego del Espíritu desciende sobre los apóstoles y los transforma: la misma llama que San Juan de la Cruz invoca en este poema, donde el alma persigue al amor divino «sin otra luz y guía / sino la que en el corazón ardía».",
  ],
];

async function main() {
  console.log(`Actualizando ${updates.length} fragmentos…\n`);
  let ok = 0;
  let err = 0;

  for (const [slug, url, title, author, caption] of updates) {
    try {
      const result = await prisma.fragment.updateMany({
        where: { slug },
        data: {
          artworkImageUrl: url,
          artworkTitle: title,
          artworkAuthor: author,
          artworkCaption: caption,
        },
      });
      if (result.count === 0) {
        console.warn(`  WARN: no fragment found for slug "${slug}"`);
        err++;
      } else {
        console.log(`  OK: ${slug}`);
        ok++;
      }
    } catch (e) {
      console.error(`  ERROR: ${slug} — ${e}`);
      err++;
    }
  }

  console.log(`\nTotal: ${ok} OK, ${err} errores`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
