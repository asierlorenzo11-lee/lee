import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const p = new PrismaClient({ adapter });

function anchor(text: string, needle: string): { anchorStart: number; anchorEnd: number } | null {
  const s = text.indexOf(needle);
  if (s === -1) { console.warn(`  ⚠ anchor not found: "${needle.substring(0, 40)}"`); return null; }
  return { anchorStart: s, anchorEnd: s + needle.length };
}

type AnnInput = { type: string; needle?: string; content: string };

function makeAnnotations(text: string, anns: AnnInput[]) {
  return anns.map((a, i) => {
    const pos = a.needle ? anchor(text, a.needle) : null;
    return {
      type: a.type,
      anchorStart: pos?.anchorStart ?? null,
      anchorEnd: pos?.anchorEnd ?? null,
      content: a.content,
      order: i,
    };
  });
}

async function main() {
  // ── ROMANCERO VIEJO: 3 nuevos fragmentos ──────────────────────────────────
  const romWork = await p.work.findUniqueOrThrow({ where: { slug: "romancero-viejo" } });
  const maxOrd = await p.fragment.aggregate({ where: { workId: romWork.id }, _max: { order: true } });
  let ord = (maxOrd._max.order ?? 0) + 1;

  // 1. Romance del rey moro que perdió Alhama ────────────────────────────────
  const txtReyMoro = "Paseábase el rey moro\npor la ciudad de Granada,\ndesde la puerta de Elvira\nhasta la de Vivarambla.\n—¡Ay de mi Alhama!\nCartas le fueron venidas\nque Alhama era ganada.\nLas cartas echó en el fuego,\ny al mensajero matara.\n—¡Ay de mi Alhama!\nDescabalga de una mula\ny en un caballo cabalga,\npor el Zacatín arriba\nsubido se había al Alhambra.\n—¡Ay de mi Alhama!\nComo en el Alhambra estuvo,\nal mismo punto mandaba\nque se toquen sus trompetas,\nsus añafiles de plata.\n—¡Ay de mi Alhama! (…)";
  if (!await p.fragment.findUnique({ where: { slug: "romance-del-rey-moro-alhama" } })) {
    const annsReyMoro: AnnInput[] = [
      { type: "glosa", needle: "añafiles de plata", content: "Añafil: trompeta morisca de origen árabe, de tubo metálico recto y largo. El sonido de los añafiles marcaba los momentos más solemnes en la corte nazarí de Granada. Su mención subraya el esplendor de la civilización que el rey presiente irremediablemente perdida." },
      { type: "glosa", needle: "Zacatín", content: "El Zacatín era la calle principal del mercado de Granada (del árabe saqqa' al-tin, 'vendedor de ropa'). Era el corazón comercial y popular de la ciudad nazarí. El rey lo recorre en estado de angustia, lo que contrasta con la vitalidad cotidiana del lugar." },
      { type: "contexto", content: "El romance histórico-fronterizo narra la caída de Alhama en 1482, cuando las tropas de Fernando el Católico tomaron por sorpresa esta ciudad estratégica al sureste de Granada. Para el rey nazarí y los musulmanes de Al-Ándalus, la pérdida de Alhama fue una señal del fin del reino de Granada, que culminó con la Reconquista en 1492. Los romances fronterizos reflejan la convivencia tensa y fascinada entre dos culturas en la frontera." },
      { type: "figura", needle: "¡Ay de mi Alhama!", content: "Estribillo y anáfora: el verso «¡Ay de mi Alhama!» se repite después de cada cuarteto como un lamento que actúa a modo de coro trágico. La reiteración acumula el dolor de cada nueva mala noticia: la lectura de las cartas, la quema de las cartas, la subida al Alhambra. Cuanto más avanza el poema, más pesado se vuelve el estribillo." },
      { type: "figura", needle: "Las cartas echó en el fuego,", content: "Parataxis dramática: la sucesión de acciones sin conectores explicativos (arrojar las cartas al fuego, matar al mensajero) reproduce la rabia impotente del rey. El mensajero de malas noticias paga con su vida, imagen arcaica del monarca absoluto que confunde al portador con el mensaje." },
      { type: "pregunta", content: "¿Qué efecto produce la repetición del estribillo «¡Ay de mi Alhama!»? ¿Cómo cambia su significado emocional cada vez que aparece dentro del poema?" },
      { type: "pregunta", content: "Este romance narra la derrota desde el punto de vista del bando perdedor (el rey moro). ¿Qué perspectiva ofrece esto frente a los romances que celebran las victorias cristianas de la Reconquista?" },
      { type: "pregunta", content: "¿Qué acciones del rey revelan su estado emocional? ¿Cómo el cambio de mula a caballo y la subida al Alhambra construyen su figura como rey herido pero aún solemne?" },
      { type: "intertextualidad", content: "El poeta romántico inglés Lord Byron (1788-1824) escribió una versión de este romance titulada 'A very mournful ballad on the Siege and Conquest of Alhama' (1829), en la que traduce y amplifica el lamento del rey moro. Esto ilustra la capacidad del Romancero viejo para trascender fronteras culturales y cronológicas: un poema anónimo medieval castellano inspiró a uno de los grandes poetas románticos europeos." },
    ];
    const frag = await p.fragment.create({ data: {
      slug: "romance-del-rey-moro-alhama",
      title: "Romance del rey moro que perdió Alhama",
      headline: "¡Ay de mi Alhama!",
      location: "Romancero viejo · Romance fronterizo",
      text: txtReyMoro,
      order: ord++, status: "published", workId: romWork.id, artworkImageUrl: null,
    }});
    for (const ann of makeAnnotations(txtReyMoro, annsReyMoro)) {
      await p.annotation.create({ data: { ...ann, fragmentId: frag.id } });
    }
    console.log("✓ romance-del-rey-moro-alhama");
  } else { console.log("skip romance-del-rey-moro-alhama"); }

  // 2. Romance del prisionero ────────────────────────────────────────────────
  const txtPrisionero = "Que por mayo era, por mayo,\ncuando hace la calor,\ncuando los trigos encañan\ny están los campos en flor,\ncuando canta la calandria\ny responde el ruiseñor,\ncuando los enamorados\nvan a servir al amor;\nsino yo, triste, cuitado,\nque vivo en esta prisión,\nque ni sé cuándo es de día\nni cuándo las noches son,\nsino por una avecilla\nque me cantaba al albor;\nmatómela un ballestero;\ndéle Dios mal galardón.";
  if (!await p.fragment.findUnique({ where: { slug: "romance-del-prisionero" } })) {
    const annsPrisionero: AnnInput[] = [
      { type: "glosa", needle: "encañan", content: "Encañar: los trigos encañan cuando el tallo crece y forma el internudo o caña durante la primavera, señal de que la cosecha avanza. Es una imagen agrícola concreta que sitúa el poema en el mes de mayo florido, símbolo de plenitud vital en la lírica medieval." },
      { type: "glosa", needle: "cuitado", content: "Cuitado: forma arcaica de 'angustiado' o 'desgraciado', del latín cogitatus. En la poesía medieval, la 'cuita' es el dolor interior, la carga que aplasta al corazón. El término define al hablante como víctima de su destino, excluido del mundo dichoso que lo rodea." },
      { type: "contexto", content: "El romance lírico del prisionero enfrenta dos realidades opuestas: la naturaleza exuberante y alegre del mes de mayo y la existencia paralizada del yo encerrado. Es uno de los romances más intensamente líricos del Romancero viejo. El mes de mayo tiene en la lírica medieval un valor simbólico de amor y renovación, lo que convierte la primavera en el contraste más cruel posible para quien no puede participar de ella." },
      { type: "figura", needle: "cuando canta la calandria", content: "Paralelismo y correlación binaria: el canto de la calandria y la respuesta del ruiseñor representan el diálogo amoroso de dos voces en armonía, que contrasta con la soledad radical del prisionero. Este paralelismo de voces recuerda a las cantigas de amigo gallego-portuguesas, donde la naturaleza actúa como coro del sentimiento humano." },
      { type: "figura", needle: "Que por mayo era, por mayo,", content: "Reduplicación inicial y anáfora de 'cuando': la repetición de 'por mayo' en el verso inicial y la cadena de 'cuando' a lo largo del poema crean una acumulación hipnótica. Cada 'cuando' añade un nuevo motivo de alegría universal del que el prisionero queda excluido, haciendo que la lista de lo vedado crezca estrofa a estrofa." },
      { type: "pregunta", content: "El romance enfrenta la belleza de mayo con la oscuridad de la prisión. ¿Cómo usa el poema la naturaleza para amplificar el sufrimiento del prisionero en lugar de consolarlo?" },
      { type: "pregunta", content: "¿Qué tiene en común este romance con las jarchas y las cantigas de amigo en cuanto al uso del entorno natural como espejo del estado emocional del hablante?" },
      { type: "pregunta", content: "El prisionero tenía una avecilla que le cantaba al alba; un ballestero la mató. ¿Qué representa este último detalle? ¿Cómo cambia el tono del poema después de este evento?" },
      { type: "intertextualidad", content: "El romance usa el tópico del locus amoenus (lugar delicioso: prado, agua, canto de pájaros) de forma invertida: el espacio fértil de mayo no libera, sino que subraya la angustia del encierro. Este contraste entre naturaleza bella y vida negada reaparece en la poesía existencial moderna y en el cante jondo, donde el paisaje amplifica el dolor interior." },
    ];
    const frag = await p.fragment.create({ data: {
      slug: "romance-del-prisionero",
      title: "Romance del prisionero",
      headline: "Que por mayo era, por mayo",
      location: "Romancero viejo · Romance lírico",
      text: txtPrisionero,
      order: ord++, status: "published", workId: romWork.id, artworkImageUrl: null,
    }});
    for (const ann of makeAnnotations(txtPrisionero, annsPrisionero)) {
      await p.annotation.create({ data: { ...ann, fragmentId: frag.id } });
    }
    console.log("✓ romance-del-prisionero");
  } else { console.log("skip romance-del-prisionero"); }

  // 3. Romance de Bernardo del Carpio ───────────────────────────────────────
  const txtBernardo = "Por las riberas de Arlanza\nBernardo el Carpio cabalga,\nen un caballo morcillo\nenjaezado de grana;\ngruesa lanza en la mano,\narmado de todas armas.\nToda la gente de Burgos\nle mira como espantada,\nporque no se suele armar\nsino a cosa señalada.\nTambién lo miraba el rey\nque fuera vuela una garza;\ndiciendo estaba a los suyos:\n—Esta es una buena lanza;\nsi no es Bernardo del Carpio,\neste es Muza el de Granada.\nEllos estando en aquesto,\nBernardo que allí llegaba;\nya sosegando el caballo,\nno quiso dejar la lanza. (…)";
  if (!await p.fragment.findUnique({ where: { slug: "romance-de-bernardo-del-carpio" } })) {
    const annsBernardo: AnnInput[] = [
      { type: "glosa", needle: "morcillo", content: "Morcillo: caballo de pelaje completamente negro, del latín mauricellus. En los romances épicos medievales, el caballo negro del caballero es símbolo de poder, misterio y valor guerrero excepcional. El Cid montaba a Babieca; Bernardo monta un caballo morcillo que ya anuncia su categoría heroica antes de que abra la boca." },
      { type: "glosa", needle: "enjaezado de grana", content: "Enjaezado: provisto de jaeces, es decir, de arneses decorativos (bridas, mantillas, estribos dorados). La grana es un rojo vivo y brillante, el color del poder y la realeza en la Edad Media. El contraste negro del caballo y rojo del jaez define visualmente a Bernardo como figura de magnificencia antes de cualquier acción." },
      { type: "contexto", content: "Bernardo del Carpio es un héroe épico legendario castellano, supuesto sobrino del rey Alfonso II de Asturias. Aunque probablemente ficticio, los romances lo presentan como paladín que defiende la independencia española frente a Carlomagno. Los romances épicos de Bernardo proceden de los antiguos cantares de gesta castellanos y forman parte del Romancero viejo. Burgos, capital del Condado de Castilla, es el escenario que subraya su dimensión heroica castellana." },
      { type: "figura", needle: "Toda la gente de Burgos", content: "Hipérbole colectiva: que 'toda la gente de Burgos' quede paralizada por la visión del caballero amplifica su presencia hasta convertirla en un fenómeno casi sobrenatural. La hipérbole épica es el recurso habitual del mester de juglaría para magnificar al héroe: el auditorio espera que la figura que todos contemplan sea capaz de hazañas extraordinarias." },
      { type: "figura", needle: "si no es Bernardo del Carpio,", content: "Comparación antonomástica por dilema: el rey solo puede explicar la magnificencia del jinete comparándolo con los dos nombres de máxima excelencia guerrera que conoce. Esta técnica —'si no es X, solo puede ser Y'— eleva al héroe por encima de toda comparación ordinaria. Significativamente, uno de los dos nombres es el de un guerrero moro, lo que refleja el respeto épico por el adversario." },
      { type: "pregunta", content: "¿Qué elementos descriptivos del romance construyen la imagen heroica de Bernardo? ¿Cómo el caballo, los colores, las armas y la reacción de la gente contribuyen a su caracterización épica?" },
      { type: "pregunta", content: "El rey compara al caballero con 'Muza el de Granada'. ¿Qué nos dice esta comparación sobre los valores guerreros en los romances fronterizos, donde el adversario también puede ser fuente de admiración?" },
      { type: "pregunta", content: "Este romance no narra ninguna batalla concreta: solo la aparición del caballero armado. ¿Cómo consigue crear tensión y expectativa con una sola imagen visual? ¿Qué técnicas usa para que sintamos que algo importante está a punto de ocurrir?" },
      { type: "intertextualidad", content: "Bernardo del Carpio es el equivalente castellano de los grandes héroes épicos europeos: como Roldán en la Chanson de Roland francesa o los caballeros artúricos en la tradición bretona. La rivalidad legendaria entre Bernardo y Roldán —que culmina en la Batalla de Roncesvalles— refleja el deseo de la épica castellana de crear héroes propios capaces de rivalizar con los franceses." },
    ];
    const frag = await p.fragment.create({ data: {
      slug: "romance-de-bernardo-del-carpio",
      title: "Romance de Bernardo del Carpio",
      headline: "Por las riberas de Arlanza / Bernardo el Carpio cabalga",
      location: "Romancero viejo · Romance épico",
      text: txtBernardo,
      order: ord++, status: "published", workId: romWork.id, artworkImageUrl: null,
    }});
    for (const ann of makeAnnotations(txtBernardo, annsBernardo)) {
      await p.annotation.create({ data: { ...ann, fragmentId: frag.id } });
    }
    console.log("✓ romance-de-bernardo-del-carpio");
  } else { console.log("skip romance-de-bernardo-del-carpio"); }

  // ── DANZA GENERAL DE LA MUERTE ────────────────────────────────────────────
  let danzaAuthor = await p.author.findUnique({ where: { slug: "anonimo-danza-de-la-muerte" } });
  if (!danzaAuthor) {
    danzaAuthor = await p.author.create({ data: {
      slug: "anonimo-danza-de-la-muerte",
      name: "Anónimo (Danza de la muerte)",
      bio: "La Danza general de la muerte es un poema alegórico anónimo castellano del siglo XV. Forma parte de la tradición europea de la Danse macabre, surgida en Francia y Alemania tras las grandes epidemias de Peste Negra del siglo XIV, que mató entre un tercio y la mitad de la población europea. En la obra, la Muerte personificada invita a bailar a representantes de todos los estamentos sociales, desde el papa y el rey hasta el campesino y el niño.",
      portraitUrl: null, birthYear: null, deathYear: null, country: "España", era: "Edad Media",
    }});
    console.log("✓ anonimo-danza-de-la-muerte author");
  } else { console.log("skip anonimo-danza-de-la-muerte author"); }

  let danzaWork = await p.work.findUnique({ where: { slug: "danza-general-de-la-muerte" } });
  if (!danzaWork) {
    danzaWork = await p.work.create({ data: {
      slug: "danza-general-de-la-muerte",
      title: "Danza general de la muerte",
      authorId: danzaAuthor.id,
      year: 1400,
      era: "Edad Media",
      genre: "poesía alegórica",
      synopsis: "Poema alegórico anónimo del siglo XV en el que la Muerte personificada invita a bailar a personajes de todos los estamentos sociales, desde el papa y el rey hasta el campesino y el niño. Su mensaje central es la igualdad de todos los seres humanos ante la muerte, reflexión marcada por las grandes epidemias de Peste Negra que asolaron Europa en el siglo XIV.",
    }});
    console.log("✓ danza-general-de-la-muerte work");
  } else { console.log("skip danza-general-de-la-muerte work"); }

  const txtDanza = "Yo soy la Muerte cierta a todas criaturas,\nque no vivo segura en ciudad ni en villas;\npor ende, de vos quiero tener las venturas,\ny por mí serán iguales las altas y las baxillas.";
  if (!await p.fragment.findUnique({ where: { slug: "yo-soy-la-muerte-cierta" } })) {
    const annsDanza: AnnInput[] = [
      { type: "glosa", needle: "altas y las baxillas", content: "Altas y bajas: la Muerte declara que igualará a todas las clases sociales, las 'altas' (nobles, reyes, obispos) y las 'bajas' (campesinos, pobres). La forma 'baxillas' es un arcaísmo ortográfico medieval. Esta igualdad universal ante la muerte es el mensaje central de toda la tradición de la Danza macabra como género literario y artístico." },
      { type: "glosa", needle: "que no vivo segura en ciudad ni en villas", content: "Paradoja de la Muerte: la Muerte dice que no vive 'segura', como si ella misma estuviera sometida a una inquietud permanente. Es una humanización irónica que convierte la certeza más absoluta del mundo medieval —que todos moriremos— en un poder errante e insaciable que no descansa ni en las ciudades ni en los pueblos." },
      { type: "contexto", content: "La Danza general de la muerte es un poema alegórico anónimo castellano del siglo XV, heredero de la tradición europea de la Danse macabre. Esta tradición surgió en Francia y Alemania tras las grandes epidemias de Peste Negra del siglo XIV (1347-1353), que mató entre un tercio y la mitad de la población de Europa. En la obra completa, la Muerte invita a bailar a representantes de todos los estamentos: el papa, el rey, el arzobispo, el noble, el mercader, el labrador, el niño..." },
      { type: "figura", needle: "Yo soy la Muerte cierta", content: "Prosopopeya (personificación): la Muerte habla en primera persona, se presenta y declara su poder absoluto. Esta voz directa de la Muerte —que adquiere identidad, voluntad y palabra— es el recurso central de toda la Danza macabra. El adjetivo 'cierta' (= inevitable, segura) condensa en una sola palabra la certeza que ningún ser humano puede eludir." },
      { type: "figura", needle: "serán iguales las altas y las baxillas", content: "Igualación social como subversión del orden estamental: la igualdad ante la muerte subvierte el sistema de la sociedad medieval, donde nobles y clérigos eran considerados superiores al pueblo. En la Danza, todos bailan juntos: el papa y el labrador, el rey y el mendigo. Es una crítica implícita —velada por el contexto religioso— a la desigualdad del mundo medieval." },
      { type: "pregunta", content: "La Muerte se dirige al lector directamente: «de vos quiero tener las venturas». ¿Por qué el texto usa la segunda persona? ¿Qué efecto produce sobre el lector medieval y sobre el lector actual?" },
      { type: "pregunta", content: "Las Danzas macabras surgen después de las grandes epidemias de Peste Negra en el siglo XIV. ¿Qué relación ves entre ese contexto histórico de muerte masiva e imprevisible y la obsesión de la Edad Media tardía por la muerte como tema literario y artístico?" },
      { type: "pregunta", content: "La Muerte dice que igualará a las 'altas y las bajas'. ¿En qué sentido puede ser este mensaje tanto un consuelo para los humildes como un aviso terrible para los poderosos? ¿Cómo funciona esa doble lectura?" },
      { type: "intertextualidad", content: "El tema de la muerte igualadora conecta con las Coplas a la muerte de su padre de Jorge Manrique (1479), donde los ríos de la vida desembocan en el mar de la muerte igualando a reyes y plebeyos. En pintura, la Danza macabra de Bernt Notke (Tallinn, 1463) y los grabados de Hans Holbein el Joven (1538) son sus equivalentes visuales más famosos en Europa. La imagen del esqueleto danzando con el poderoso reaparece también en el Día de los Muertos mexicano." },
    ];
    const frag = await p.fragment.create({ data: {
      slug: "yo-soy-la-muerte-cierta",
      title: "Invocación de la Muerte",
      headline: "Yo soy la Muerte cierta a todas criaturas",
      location: "Danza general de la muerte · Estrofa I",
      text: txtDanza,
      order: 1, status: "published", workId: danzaWork!.id, artworkImageUrl: null,
    }});
    for (const ann of makeAnnotations(txtDanza, annsDanza)) {
      await p.annotation.create({ data: { ...ann, fragmentId: frag.id } });
    }
    console.log("✓ yo-soy-la-muerte-cierta");
  } else { console.log("skip yo-soy-la-muerte-cierta"); }
}

main().catch(console.error).finally(() => p.$disconnect());
