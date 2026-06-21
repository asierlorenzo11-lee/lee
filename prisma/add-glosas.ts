import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

function anchor(text: string, needle: string) {
  const anchorStart = text.indexOf(needle);
  if (anchorStart === -1) throw new Error(`Ancla no encontrada: "${needle}"`);
  return { anchorStart, anchorEnd: anchorStart + needle.length };
}

// Glosas: [slug, [[needle, content], ...]]
const GLOSAS: [string, [string, string][]][] = [
  ["romance-de-la-loba-parda", [
    ["cayada", "Bastón curvo propio del pastor, con el extremo superior doblado en forma de gancho."],
    ["majada", "Lugar donde se recoge el ganado durante la noche; aprisco o redil."],
    ["cañada", "Paso estrecho entre montañas por donde transitaban los rebaños trashumantes."],
  ]],
  ["romance-de-la-gentil-dama-y-el-rustico-pastor", [
    ["vergel", "Jardín florido y frondoso, huerto con flores y árboles; imagen del paraíso terrenal."],
    ["gran saña", "Enojo violento, ira intensa; sentimiento de indignación."],
    ["tomar posada", "Hospedarse, alojarse en un lugar; la expresión tiene aquí connotación erótica velada."],
  ]],
  ["el-infante-arnaldos", [
    ["falcón cebar", "Dar de comer al halcón de caza para adiestrarlo; la cetrería era deporte noble."],
    ["jarcia de oro torzal", "Jarcia: conjunto de cuerdas y cables del velero. Torzal: cordón trenzado, aquí imaginado de oro fino."],
    ["hacer amainar", "Disminuir la fuerza del viento o de las olas; calmar la tempestad."],
  ]],
  ["romance-del-enamorado-y-la-muerte", [
    ["celosías", "Celosía: enrejado de listones que cubre una ventana permitiendo ver sin ser visto."],
    ["rigurosa", "Cruel, implacable; aplicado a la Muerte personificada, subraya su inflexibilidad."],
    ["soñito", "Diminutivo afectivo de «sueño»; el sufijo -ito añade ternura a la visión que el amante relata."],
  ]],
  ["romance-del-rey-don-sancho", [
    ["guarte", "Forma arcaica de «guárdate» (protégete, ten cuidado); imperativo de guardar con apócope."],
    ["alevoso", "Traidor, que actúa con alevosía: aprovechando la confianza o la indefensión ajena."],
    ["el real", "Campamento militar; el conjunto de tiendas del ejército durante un asedio."],
  ]],
  ["romance-de-la-jura-de-santa-gadea", [
    ["hijosdalgo", "Plural de «hidalgo»: hombre de linaje noble, aunque de rango inferior a los grandes señores."],
    ["ballesta de palo", "Arma de tiro compuesta de un arco montado sobre una caja de madera; aquí es símbolo del juramento laico frente al religioso."],
    ["villanos te maten", "Maldición ritual: que te maten hombres del pueblo, sin honor, no caballeros."],
  ]],
  ["a-una-mujer-que-se-afeitaba-y-estaba-hermosa", [
    ["se afeitaba", "En el siglo XVII «afeitar» significaba embellecer el rostro con afeites (polvos, coloretes); no alude a afeitarse el vello."],
    ["beldad de su mentira", "La hermosura conseguida artificialmente; paradoja: la mentira cosmética es más bella que la verdad natural."],
    ["engaña así Naturaleza", "Referencia estoica: la Naturaleza también nos engaña dándonos una apariencia que no refleja la esencia."],
  ]],
  ["a-ines-que-se-tenia-las-canas-de-rubio", [
    ["sobredorados", "Dorados por encima, chapados en oro; aquí, canas (plata) teñidas de rubio (oro)."],
    ["vender gato por liebre", "Refrán: dar algo de menor valor haciéndolo pasar por mejor; aquí invertido con ironía."],
  ]],
  ["soneto-antiesclavista", [
    ["mancilla", "Mancha, deshonra; «libres de su mancilla» alude a la culpa de la esclavitud."],
    ["acaudilla", "Capitanea, lidera; la libertad personificada como caudillo de la lucha."],
    ["Antilla", "Las Antillas, archipiélago del Caribe; Cuba era colonia española en el siglo XIX."],
  ]],
  ["soneto-dentro-del-soneto", [
    ["¡Sus!", "Interjección de ánimo, equivalente a «¡vamos!», «¡adelante!»; el poeta se exhorta a sí mismo."],
    ["cuarteto", "Primera o segunda estrofa de cuatro versos de un soneto; el poema se comenta a sí mismo al construirse."],
    ["trago", "Momento difícil, trance penoso; coloquialmente, «tragarse» algo implica sufrirlo."],
  ]],
  ["pastora-si-mal-me-quieres", [
    ["antojos", "Caprichos, deseos irracionales; también, en la época, lentes o anteojos. Aquí: el capricho de los ojos de la pastora."],
    ["afición", "Amor, inclinación afectiva; «poner la afición» equivale a enamorarse."],
    ["para en desesperación", "Acaba, termina en desesperación; «parar en» significa desembocar en algo."],
  ]],
  ["la-guitarra-poema-cante-jondo", [
    ["copas de la madrugada", "Imagen surrealista: las horas de la madrugada como frágiles copas que se rompen cuando empieza el llanto de la guitarra."],
    ["cante jondo", "Modalidad flamenca de canto profundo y dramático, con raíces en el folclore andaluz y gitano."],
    ["flecha sin blanco", "Metáfora del dolor sin objeto definido; el llanto de la guitarra no apunta a ninguna diana concreta."],
  ]],
  ["romance-de-la-luna-luna", [
    ["polisón de nardos", "Polisón: armazón que las mujeres del siglo XIX llevaban bajo la falda para abultarla por detrás. Nardos: flores blancas y perfumadas. La luna viste de flores."],
    ["lúbrica", "Lasciva, sensual, resbaladiza; el adjetivo crea tensión entre la pureza («pura») y la sensualidad de la luna."],
    ["yunque", "Bloque de hierro sobre el que se trabaja el metal a martillazos; imagen de la muerte del niño gitano."],
  ]],
  ["la-casada-infiel", [
    ["enagua", "Falda interior que las mujeres llevaban bajo la ropa exterior; la mención del almidón acentúa el erotismo de la escena."],
    ["almidón", "Sustancia con la que se aprestaba (endurecía) la ropa para que mantuviera la forma."],
    ["jacintos", "Flores de bulbo con racimos perfumados; símbolo de belleza y juventud."],
  ]],
  ["prendimiento-de-antonito-el-camborio", [
    ["empavonados bucles", "Empavonado: ennegrecido o azulado por el procedimiento del pavonado, propio del metal tratado. Bucles: rizos. Los rizos de Antonio brillan oscuros como el acero."],
    ["vara de mimbre", "Rama flexible del sauce mimbre; rasgo de inocencia y naturaleza frente a la violencia de la guardia civil."],
    ["codo con codo", "Maniatado, con los codos atados juntos; imagen del prendimiento policial."],
  ]],
  ["el-amor-ha-tales-manas", [
    ["mañas", "Hábitos, tretas; aquí, los engaños y artificios con que el Amor atrapa a sus víctimas."],
    ["querellas", "Quejas, lamentos; también, en lenguaje jurídico, denuncias formales."],
    ["entrañas", "Vísceras, interior del cuerpo; metafóricamente, lo más hondo del ser: el corazón."],
  ]],
  ["poderoso-caballero-es-don-dinero", [
    ["anda amarillo", "El amante pale y enferma de amor; el oro es amarillo, y el enamorado de él también."],
    ["doblón o sencillo", "Doblón: moneda de oro de alto valor. Sencillo: moneda de poco valor. El dinero todo lo puede, sea mucho o poco."],
    ["en Génova enterrado", "Los banqueros genoveses financiaban a la Corona española; el dinero de América acababa en los cofres genoveses."],
  ]],
  ["a-un-hombre-de-gran-nariz", [
    ["alquitara", "Alambique, aparato de destilación; la nariz es tan grande que parece un aparato de laboratorio."],
    ["sayón y escriba", "Sayón: verdugo, ejecutor de sentencias. Escriba: letrado judío. La nariz personifica tipos de la tradición bíblica y el teatro medieval."],
    ["frisón archinariz", "Frisón: caballo de tiro de gran tamaño, de origen flamenco. El prefijo «archi-» intensifica: una nariz descomunal como un caballo de carga."],
  ]],
  ["no-he-de-callar-epistola-fragmento", [
    ["sentir lo que se dice", "Expresar lo que de verdad se piensa; Quevedo denuncia la hipocresía de callar la opinión propia por miedo."],
    ["por más que con el dedo", "Aunque me mandes silencio con gestos; el poeta se rebela contra la censura implícita del poder."],
  ]],
  ["vida-retirada-oh-monte-oh-fuente-oh-rio", [
    ["mundanal ruido", "El bullicio, la agitación y los conflictos del mundo social; sintagma que viene de Horacio."],
    ["no cura", "No le importa, no se preocupa; «curar» en el sentido de «ocuparse de», «prestar atención»."],
    ["pregonera", "Que pregona, que proclama en voz alta; la fama pública que el sabio retirado desprecia."],
  ]],
  ["la-vieja-y-el-gato", [
    ["en cuclillas", "Posición en la que se doblan las rodillas y se apoya el peso sobre los talones, en posición baja."],
    ["lumbre", "Fuego vivo o ascuas; la llama del hogar donde la vieja se calienta."],
    ["cuitada", "Desgraciada, pobre de espíritu; adjetivo que expresa lástima mezclada con ironía cómica."],
  ]],
  ["egloga-i-queja-de-salicio", [
    ["desamparado", "Abandonado, sin amparo ni protección; Salicio se siente solo sin el amor de Galatea."],
    ["corro", "Me avergüenzo, me ruborizo; «correrse» en el siglo XVI significaba sentir vergüenza."],
    ["desdeñas ser señora", "Rechazas gobernar; Galatea se niega a ser dueña del alma que la ama."],
  ]],
  ["soneto-v", [
    ["gesto", "Rostro, semblante; en el castellano del siglo XVI «gesto» podía referirse a la cara entera."],
    ["tomando ya la fe por presupuesto", "Aceptando de antemano la fe como punto de partida; la amada trasciende lo comprensible y solo puede creerse."],
  ]],
  ["soneto-x", [
    ["prendas", "Objetos queridos, recuerdos; también, en sentido más amplio, cualidades o dones de la persona amada."],
    ["conjuradas", "Confabuladas, unidas en conspiración; la memoria y la muerte parecen aliarse contra el poeta."],
    ["me vía", "Forma arcaica de «me veía»; el imperfecto de «ver» sin diptongo era habitual en la poesía renacentista."],
  ]],
  ["al-partir-soneto", [
    ["chusma diligente", "Tripulación del barco, aquí activa y apresurada; «chusma» (del italiano «ciurma») no tenía aún el sentido peyorativo moderno."],
    ["hado", "Destino, fatalidad; término de origen latino (fatum) que designa la fuerza inexorable que rige la vida."],
    ["iza", "Levanta las velas o banderas tirando de los cabos; la nave zarpa y la poeta parte al exilio."],
  ]],
  ["las-contradicciones-soneto", [
    ["préndeme la tierra", "La tierra me sujeta, me retiene; la poeta no puede escapar de las limitaciones terrenales aunque aspire al cielo."],
    ["imploro", "Suplico con urgencia; el soneto traduce el Soneto CXXXIV de Petrarca, adaptando sus paradojas al castellano."],
  ]],
  ["quiero-fer-una-prosa", [
    ["fer", "Hacer; forma arcaica del español medieval procedente del latín «facere»."],
    ["román paladino", "Castellano llano y accesible, la lengua romance hablada por el pueblo; contrasta con el latín culto."],
    ["ca non so tan letrado", "Porque no soy tan docto; «ca» vale «porque» y «so» es forma arcaica de «soy»."],
  ]],
  ["el-prado-alegorico", [
    ["román paladino", "Castellano llano accesible al pueblo; Berceo usa el mismo término en su prólogo a los Milagros."],
    ["sovejo", "En abundancia, con exceso; adverbio arcaico castellano del siglo XIII."],
    ["cobdiçiaduero", "Deseable, apetecible; forma arcaica de «codiciable», de «codiciar»."],
  ]],
  ["rima-vii", [
    ["de su dueña tal vez olvidada", "«Dueña» en el sentido de propietaria o ama; el arpa ha sido abandonada por quien la tocaba."],
    ["mano de nieve", "Metáfora sinestésica: la mano del artista, blanca y delicada, que al tocar las cuerdas despierta la música dormida."],
  ]],
  ["rima-xiii", [
    ["pupila", "La pupila del ojo, pero también el ojo entero por sinécdoque; Bécquer convierte los ojos de la amada en el universo del poema."],
    ["trémulo fulgor", "Resplandor tembloroso, luz que vibra; imagen del reflejo de la mañana en el mar."],
  ]],
  ["rima-xxi", [
    ["mientras clavas / en mi pupila tu pupila azul", "«Clavar la mirada» significa mirar fijamente; el contacto visual de los dos amantes es el núcleo de la pregunta."],
  ]],
  ["rima-xxiii", [
    ["qué te diera por un beso", "Construcción condicional con imperfecto de subjuntivo: «¿qué te daría yo a cambio de un beso?»; la indefinición subraya el valor infinito del beso."],
  ]],
  ["ojos-claros-serenos", [
    ["airados", "Airado: lleno de ira, enojado; los ojos de la amada miran con enojo, no con piedad."],
    ["piadosos", "Llenos de piedad, compasivos; si los ojos fueran clementes serían más bellos."],
    ["tormentos rabiosos", "Sufrimientos furiosos, dolores intensos; la exclamación resume la contradicción del amante."],
  ]],
  ["sin-dios-sin-vos-y-sin-mi", [
    ["só", "Soy; forma arcaica de primera persona del presente de indicativo del verbo «ser»."],
    ["de coro", "De memoria, de sobra; sabido por todos, ya consabido."],
    ["conoscí", "Conocí; forma arcaica de «conocer», con la consonante «sc» aún no simplificada."],
  ]],
  ["cancion-del-pirata", [
    ["bergantín", "Embarcación velera de dos palos; el bergantín del pirata esproncediano es símbolo de libertad y rebeldía."],
    ["riela", "Rielar: brillar con luz trémula y ondulante; la luna se refleja en el mar con ese efecto."],
    ["confín", "Límite extremo, frontera; «del uno al otro confín» significa de extremo a extremo del mundo."],
  ]],
  ["soneto-del-olvido-imposible", [
    ["aviva la memoria", "La memoria cobra vida más intensa; en la tradición petrarquista la ausencia no olvida sino que agudiza el recuerdo."],
    ["cuidado", "Preocupación, pena amorosa; término técnico del amor cortés para designar el sufrimiento del amante."],
  ]],
  ["soneto-cxxix-a-la-muerte-de-garcilaso", [
    ["bajeza", "Lugar bajo, tierra; la vida mortal es «bajeza» frente a la altura a la que Garcilaso ha ascendido tras morir."],
    ["enteramente le alcanzaste", "Lograste la perfección de manera completa; Boscán elogia la excelencia poética de su amigo muerto."],
  ]],
  ["retrato-de-la-dama-ideal", [
    ["lozana", "Fresca, lozana, llena de vigor y belleza juvenil; el adjetivo es clave en los retratos femeninos medievales."],
    ["villana", "Mujer de condición humilde, del pueblo llano (villa); en el código cortés, el amor con una villana era considerado sin valor."],
    ["palurda y chabacana", "Tosca, sin modales, sin educación; el Arcipreste reproduce los prejuicios sociales del amor cortés con ironía."],
  ]],
  ["la-chata-de-malangosto", [
    ["rebata", "Encuentro repentino, emboscada; el arcipreste se ve sorprendido en la cima del puerto de montaña."],
    ["portazgo", "Impuesto cobrado por el paso de personas y mercancías por determinados caminos o puertos; la Chata lo cobra a su modo."],
    ["Sant Meder", "San Emeterio; el 3 de marzo se celebraba su festividad. La fecha sitúa la escena en pleno invierno."],
  ]],
  ["procesion-satirica-a-felipe-iv", [
    ["sin un cuarto", "Sin dinero; «cuarto» era moneda de escaso valor. España se había declarado en bancarrota bajo Felipe IV."],
    ["privados", "Validos, ministros favoritos del rey con gran poder político; alusión al conde-duque de Olivares."],
    ["padrón", "Lista o registro oficial; aquí, el poeta ironiza: el rey hace un «padrón» de ladrones."],
  ]],
  ["decima-anonima-sobre-la-muerte-de-villamediana", [
    ["mentidero de Madrid", "Lugar público donde la gente se reunía a chismorrear; el más famoso estaba frente a San Felipe el Real."],
    ["lozano", "Arrogante, orgulloso, hermoso; en la décima alude a la altivez del conde que lo habría llevado a la muerte."],
    ["impulso soberano", "Orden del rey; la décima insinúa que Felipe IV mandó asesinar al conde."],
  ]],
  ["ni-se-si-muero", [
    ["cuido de buscarme", "Me preocupo por buscarme; «cuidar» en el sentido clásico de «ocuparse de», «prestar atención»."],
    ["desabrida", "Sin sabor, desagradable, insípida; la poeta se siente incapaz de encontrar placer en nada."],
    ["vestida", "Cubierta, envuelta; «vestida de pena y dolor» convierte la emoción en una segunda piel."],
  ]],
  ["dineros-son-calidad", [
    ["cruzados, escudos, ducados", "Monedas de distintos reinos: el cruzado portugués, el escudo español, el ducado italiano. Góngora juega con sus nombres para denunciar que el dinero compra nobleza."],
    ["tahúres", "Jugadores de naipes o dados, especialmente los tramposos; aquí ganan condados con los dados."],
    ["promesas de Marfira", "Marfira es un nombre poético convencional para la amada falsa; sus promesas son mentira."],
  ]],
  ["redondilla-contra-quevedo-y-lope", [
    ["Baco", "Dios romano del vino; la amistad entre Quevedo y Lope se debe a la bebida, no a las Musas."],
    ["Febo", "Apolo, dios de la poesía y las artes; Góngora ironiza: los dos rivales no se reconcilian por amor a la poesía."],
    ["Quebebo / Beba", "Juego de palabras: «Que-vedo» → «que-bebó» (que bebió); «Lo-pe» → «lo-pe-dibeba» → «Beba». Góngora los convierte en bebedores."],
  ]],
  ["castilla-el-cid-cabalga", [
    ["petos y espaldares", "Peto: pieza de la armadura que protege el pecho. Espaldar: la pieza que protege la espalda."],
    ["postigo", "Puerta pequeña secundaria, o ventana que se abre en una puerta grande; símbolo del rechazo de los burgaleses al Cid."],
    ["cuento de las picas", "Extremo inferior de la lanza o pica, rematado en hierro; se golpeaba con él para llamar."],
  ]],
  ["amar-el-dia-aborrecer-el-dia", [
    ["osadía", "Atrevimiento, audacia; en la tradición petrarquista, el amante es a la vez temeroso y audaz."],
    ["trance", "Momento crítico, situación difícil de la que cuesta salir."],
    ["libre osadía", "Valentía sin restricciones; la paradoja resume la condición del enamorado: razón atada, impulso libre."],
  ]],
  ["que-muera-yo-liseo-por-tus-ojos", [
    ["despojos", "Trofeos, botín de guerra; aquí metafórica: el amante ofrece sus propios ojos como despojo de la batalla amorosa."],
    ["abrojos", "Plantas espinosas; metafórica del dolor y las penas de amor."],
  ]],
  ["epigrama-del-palillo-de-dientes", [
    ["palillo de dientes", "Mondadientes; el poema satiriza a quien simula haber comido usando un palillo sin haber probado bocado."],
    ["picarte", "Picarte, pincharte; el hambre «come» y «pica» al protagonista, igual que el palillo rascaría entre los dientes."],
  ]],
  ["cantico-espiritual-la-busqueda", [
    ["si por ventura vierdes", "Si acaso veis, si llegáis a ver; forma del subjuntivo futuro («vierdes», de «ver»), arcaica pero usada en la época para peticiones solemnes."],
    ["adolezco", "Adolezco: padezco, estoy enfermo; en San Juan, el alma enferma de amor divino."],
    ["majadas al otero", "Majadas: aprisco, lugar donde pernocta el ganado. Otero: colina pequeña. Paisaje pastoril alegórico del alma en busca de Dios."],
  ]],
  ["tras-de-un-amoroso-lance", [
    ["lance", "Momento crucial, trance de caza o de amor; aquí la unión mística con Dios es a la vez caza y vuelo."],
    ["deslumbróseme la vista", "Me cegó la luz, quedé sin vista; el éxtasis místico se describe como deslumbramiento."],
    ["trance", "Momento límite entre la vida y la muerte, el sueño y la vigilia; en la mística, el instante de la unión con Dios."],
  ]],
  ["vivo-sin-vivir-en-mi-villancico-completo", [
    ["villancico", "Composición poética de tema religioso con estribillo, de origen popular; género cultivado por Teresa de Jesús y San Juan de la Cruz."],
    ["cautivo", "Prisionero, capturado; la paradoja mística: Dios queda «cautivo» del amor del alma que le entrega el corazón."],
    ["muero porque no muero", "Estribillo paradójico: el alma desea la muerte física para unirse definitivamente con Dios; «vida» y «muerte» se invierten."],
  ]],
  ["hombres-necios-que-acusais", [
    ["necios", "Ignorantes, tontos, faltos de razón; Sor Juana dirige el apóstrofe a los hombres que culpan a la mujer de lo que ellos provocan."],
    ["solicitáis su desdén", "Buscáis su rechazo, la incitáis a ser desdeñosa; la mujer actúa de modo que el hombre la ha condicionado."],
  ]],
  ["al-que-ingrato-me-deja", [
    ["pundonor", "Punto de honor, dignidad susceptible que impide ciertas acciones; aquí, la poeta no puede ceder a quien la suplica por orgullo."],
    ["diamante", "Símbolo de dureza e insensibilidad; ser «diamante» equivale a mostrarse frío e impenetrable."],
  ]],
  ["este-que-ves-engano-colorido", [
    ["silogismos de colores", "Argumentos visuales engañosos; los colores del retrato «razonan» falsamente que la mujer pintada es joven."],
    ["lisonja", "Halago, adulación; la pintura adula a su modelo ocultando los estragos del tiempo."],
    ["hado", "Destino, fatalidad; el hado es la muerte que ningún retrato puede detener."],
  ]],
  ["misero-leno-soneto", [
    ["leño", "Trozo de madera; aquí, el barco reducido a sus tablas destrozadas, símbolo del hombre arruinado por sus ambiciones."],
    ["ábrego y noto", "Ábrego: viento de poniente o suroeste. Noto: viento del sur. Los dos vientos destruyeron la nave."],
    ["floresta umbrosa", "Bosque frondoso que da sombra; contrasta con la desolación de la playa donde yace el leño naufragado."],
  ]],
];

async function main() {
  console.log(`Procesando ${GLOSAS.length} fragmentos...`);

  for (const [slug, glosaList] of GLOSAS) {
    const fragment = await prisma.fragment.findFirst({
      where: { slug },
      select: { id: true, text: true },
    });
    if (!fragment) {
      console.warn(`  ⚠ No encontrado: ${slug}`);
      continue;
    }

    // Get current max order for this fragment
    const maxOrder = await prisma.annotation.aggregate({
      where: { fragmentId: fragment.id },
      _max: { order: true },
    });
    let order = (maxOrder._max.order ?? 0) + 1;

    let added = 0;
    for (const [needle, content] of glosaList) {
      try {
        const { anchorStart, anchorEnd } = anchor(fragment.text, needle);
        await prisma.annotation.create({
          data: {
            fragmentId: fragment.id,
            type: "glosa",
            anchorStart,
            anchorEnd,
            content,
            order: order++,
          },
        });
        added++;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        console.warn(`  ⚠ [${slug}] ${msg}`);
      }
    }
    console.log(`  ✓ ${slug}: +${added} glosa(s)`);
  }

  console.log("\nHecho.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
