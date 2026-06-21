import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

function anchor(text: string, needle: string): { anchorStart: number; anchorEnd: number } {
  const anchorStart = text.indexOf(needle);
  if (anchorStart === -1) throw new Error(`No se encontró el ancla "${needle}"`);
  return { anchorStart, anchorEnd: anchorStart + needle.length };
}

async function getFragmentId(slug: string): Promise<{ id: string; text: string }> {
  const f = await prisma.fragment.findUniqueOrThrow({ where: { slug }, select: { id: true, text: true } });
  return f;
}

async function main() {
  console.log("Añadiendo capas de lectura a fragmentos de Don Juan Tenorio y Don Álvaro…\n");

  // ── 1. DON-JUAN-CONVITE-APUESTA ──────────────────────────────────────────
  {
    const { id, text } = await getFragmentId("don-juan-convite-apuesta");
    await prisma.annotation.createMany({
      data: [
        // Glosas
        { fragmentId: id, type: "glosa", ...anchor(text, "veinticuatro burladas"), order: 1,
          content: "Mujeres seducidas y abandonadas. El verbo *burlar* en el teatro áureo y romántico designa tanto el engaño sentimental como la deshonra: don Juan hace de ello materia contable, convirtiendo la conquista en estadística." },
        { fragmentId: id, type: "glosa", ...anchor(text, "treinta y dos muertes honradas"), order: 2,
          content: "Muertes en duelo, consideradas «honradas» porque el duelo era el mecanismo legalmente reconocido por el código de honor para dirimir agravios entre caballeros. No son crímenes: son victorias." },
        { fragmentId: id, type: "glosa", ...anchor(text, "novicia"), order: 3,
          content: "Mujer que se halla en período de formación antes de profesar votos religiosos definitivos. Conquistar a una novicia supone un doble ultraje: al padre y a Dios. Por eso don Luis la llama «infame»." },
        // Contexto
        { fragmentId: id, type: "contexto", ...anchor(text, "Soy lo que el mundo me hizo"), order: 1,
          content: "La frase encierra una de las claves del personaje romántico: la responsabilidad del individuo sobre sus actos se transfiere a la sociedad que lo modeló. Don Juan no es el gran pecador medieval; es también una víctima de su entorno, lo que lo hace moralmente ambiguo y, por eso, fascinante para el público del XIX." },
        { fragmentId: id, type: "contexto", ...anchor(text, "la hija del Comendador"), order: 2,
          content: "El Comendador (don Gonzalo de Ulloa) remite a la tradición de las Órdenes Militares, con gran peso simbólico en el teatro del Siglo de Oro y el Romanticismo. Enamorarse de su hija es la apuesta más alta posible: don Juan desafía a la vez el honor paterno y la Iglesia." },
        // Figuras
        { fragmentId: id, type: "figura", category: "sintaxis", ...anchor(text, "veinticuatro burladas"), order: 1,
          content: "**Enumeración y climax**: la lista de fechorías se presenta en crescendo —veinticuatro burladas, treinta y dos muertes, una novicia—, de las víctimas femeninas (lo más grave socialmente) a los duelos (lo más peligroso) y culmina con «una monja», el colmo simbólico que supera todos los tabúes anteriores." },
        { fragmentId: id, type: "figura", category: "tropo", ...anchor(text, "Sois un monstruo de impiedad"), order: 2,
          content: "**Metáfora hiperbólica**: «monstruo» (del latín *monstrum*, prodigio o señal de lo sobrenatural) refuerza la dimensión mítica del personaje: don Juan excede la medida humana y se convierte en algo fascinante y peligroso a la vez." },
        // Preguntas
        { fragmentId: id, type: "pregunta", questionGroup: "literal", order: 1,
          content: "¿Cuáles son los tres tipos de hazañas que don Juan incluye en su lista y cuál de ellas provoca la mayor indignación de don Luis? ¿Por qué?" },
        { fragmentId: id, type: "pregunta", questionGroup: "interpretativo", order: 1,
          content: "Don Juan dice «Soy lo que el mundo me hizo». ¿Qué implica esta frase sobre la responsabilidad moral del personaje? ¿Es una excusa, una reflexión genuina o una declaración de principios?" },
        { fragmentId: id, type: "pregunta", questionGroup: "valorativo", order: 1,
          content: "La escena convierte las conquistas amorosas y los duelos en una competición con tabla de puntos. ¿Qué visión del honor y del amor refleja esta «aritmética del libertinaje»? ¿Crees que Zorrilla la critica o la celebra?" },
        // Intertextualidad
        { fragmentId: id, type: "intertextualidad", ...anchor(text, "la hija del Comendador"), order: 1, linkType: "external",
          externalCitation: "Tirso de Molina, *El burlador de Sevilla* (c. 1630): el mismo don Juan que inventó Tirso hace la misma apuesta, pero el del Siglo de Oro muere sin redención. Zorrilla reescribe aquí el mito, cambiando su final.",
          content: "El origen literario del personaje está en el *Burlador* de Tirso. La apuesta de don Juan es el mismo punto de partida, pero Zorrilla añade la posibilidad de la salvación a través del amor de doña Inés, lo que convierte la comedia de gracejo barroco en drama romántico de redención." },
      ],
    });
    console.log("  OK: don-juan-convite-apuesta");
  }

  // ── 2. DONA-INES-LEE-LA-CARTA ────────────────────────────────────────────
  {
    const { id, text } = await getFragmentId("dona-ines-lee-la-carta");
    await prisma.annotation.createMany({
      data: [
        // Glosas
        { fragmentId: id, type: "glosa", ...anchor(text, "turbada"), order: 1,
          content: "Alterada emocionalmente, perturbada. En la lengua romántica, *turbación* es el signo físico inequívoco del amor naciente: las sienes arden, las manos tiemblan. Doña Inés vive el amor antes de comprenderlo." },
        { fragmentId: id, type: "glosa", ...anchor(text, "dueña"), order: 1,
          content: "Brígida es la *dueña* o acompañante —criada de confianza— de doña Inés. En el teatro barroco y romántico, la dueña es cómplice indispensable de los amores prohibidos, el personaje que hace circular las cartas entre los enamorados." },
        { fragmentId: id, type: "glosa", ...anchor(text, "fantasía"), order: 1,
          content: "En el vocabulario romántico, *fantasía* no significa ilusión vacía sino imaginación activa: la capacidad del alma de proyectarse hacia lo que todavía no existe. El amor enciende la fantasía de Inés y la transforma en un ser nuevo." },
        // Contexto
        { fragmentId: id, type: "contexto", ...anchor(text, "locutorio del convento"), order: 1,
          content: "Los conventos femeninos del siglo XIX eran, para muchas familias nobles, el destino habitual de las hijas no primogénitas. El locutorio —sala de visitas separada por una reja— era el único contacto permitido con el exterior. Brígida actúa aquí como mensajera clandestina, en una transgresión grave del orden conventual." },
        { fragmentId: id, type: "contexto", ...anchor(text, "luz de donde el sol la toma"), order: 1,
          content: "La carta de don Juan usa las convenciones del petrarquismo más retórico: la mujer como fuente de luz, el sol que toma su brillo de ella. Pero la novedad romántica es que el seductor confiesa que *ella* lo ha cambiado («quisieras / ser mejor de lo que era»), lo que anuncia que el engaño puede convertirse en amor genuino." },
        // Figuras
        { fragmentId: id, type: "figura", category: "tropo", ...anchor(text, "¿Un ángel o un maldecido?"), order: 1,
          content: "**Antítesis**: la pregunta de Inés condensa el dilema central del drama: don Juan es las dos cosas a la vez, ángel para quien ama y demonio para quien destruye. La antítesis, figura favorita del Romanticismo, expresa la contradicción que el personaje encarna." },
        { fragmentId: id, type: "figura", category: "sintaxis", ...anchor(text, "Cada sílaba que leo"), order: 1,
          content: "**Hipérbole gradativa**: la intensidad del efecto crece con cada unidad mínima de lectura (la sílaba). El hipérbaton romántico —verbo al final, separado del sujeto— ralentiza el verso y mimetiza la respiración agitada de quien lee." },
        // Preguntas
        { fragmentId: id, type: "pregunta", questionGroup: "literal", order: 1,
          content: "¿Qué síntomas físicos experimenta doña Inés mientras lee la carta? Localízalos en el texto y explica qué significan para la construcción del personaje." },
        { fragmentId: id, type: "pregunta", questionGroup: "interpretativo", order: 1,
          content: "Doña Inés pregunta «¿Un ángel o un maldecido?». ¿Qué revela esta pregunta sobre su percepción de don Juan y sobre su propio estado interior? ¿Por qué no puede responderla?" },
        { fragmentId: id, type: "pregunta", questionGroup: "valorativo", order: 1,
          content: "La carta de don Juan usa convenciones poéticas muy elaboradas (hipérboles petrarquistas, declaraciones de cambio interior). ¿Crees que doña Inés debería haber desconfiado de ese lenguaje? ¿La inocencia que siente la hace más vulnerable o más auténtica?" },
        // Intertextualidad
        { fragmentId: id, type: "intertextualidad", ...anchor(text, "¡Solo sé que el alma mía"), order: 1, linkType: "external",
          externalCitation: "Rousseau, *La Nueva Eloísa* (1761): la correspondencia entre Julie y Saint-Preux convirtió la carta de amor en género sentimental que transforma a quien la lee. Doña Inés experimenta esa misma revelación.",
          content: "La escena pertenece a la tradición de la novela epistolar sentimental del XVIII: el texto leído produce un efecto físico y anímico en quien lo recibe. Doña Inés es una lectora romántica que descubre el amor a través de las palabras escritas, antes de vivirlo." },
      ],
    });
    console.log("  OK: dona-ines-lee-la-carta");
  }

  // ── 3. DON-JUAN-JARDIN-ANGEL-DE-AMOR ────────────────────────────────────
  {
    const { id, text } = await getFragmentId("don-juan-jardin-angel-de-amor");
    await prisma.annotation.createMany({
      data: [
        // Glosas
        { fragmentId: id, type: "glosa", ...anchor(text, "aura"), order: 1,
          content: "Brisa suave. La palabra, de origen latino (*aura*, soplo), tenía en el Romanticismo un valor casi sagrado: el aura es el aliento de la naturaleza, el soplo que comunica lo visible con lo invisible. Don Juan la convoca para hacer del jardín un espacio de revelación." },
        { fragmentId: id, type: "glosa", ...anchor(text, "arrebol"), order: 1,
          content: "Coloración rosada o rojiza del cielo al amanecer o al atardecer, y por extensión el color encendido de las mejillas. «¿Qué ángel os puso el arrebol?»: don Juan pregunta quién pintó esa belleza en doña Inés, como si fuera una obra divina." },
        { fragmentId: id, type: "glosa", ...anchor(text, "planta arrogante"), order: 1,
          content: "*Planta* en sentido figurado es la pisada, la huella del paso. «De hombre la planta arrogante»: el orgullo varonil que don Juan proyecta en cada paso que da. Reconocer que ha perdido esa arrogancia «bajo la huella» del amor es la mayor confesión de vulnerabilidad." },
        // Contexto
        { fragmentId: id, type: "contexto", ...anchor(text, "Jardín de la quinta de don Juan, a orillas del Guadalquivir"), order: 1,
          content: "El jardín nocturno con luna llena es el *locus amoenus* por excelencia del teatro romántico: un espacio fuera del tiempo social donde las convenciones se suspenden y el sentimiento habla libremente. Sevilla, el Guadalquivir y la luna son los elementos del paisaje andaluz que el Romanticismo europeo había convertido en escenario del amor apasionado." },
        { fragmentId: id, type: "contexto", ...anchor(text, "Yo he visto el rayo caer"), order: 1,
          content: "La enumeración de peligros ante los que don Juan no tembló (el rayo, el huracán, el mar, la espada) es la convención del héroe byroneano: el hombre de acción que ha desafiado las fuerzas de la naturaleza. Su rendición ante Inés cobra así una dimensión extraordinaria: lo que el mundo no pudo, lo pudo ella." },
        // Figuras
        { fragmentId: id, type: "figura", category: "tropo", ...anchor(text, "¿No es verdad, ángel de amor"), order: 1,
          content: "**Metáfora apelativa**: llamar a doña Inés «ángel de amor» combina la imagen celestial (pureza) con la del Eros clásico (poder). Don Juan no la llama solo hermosa: la inviste de una fuerza sobrenatural que explica que él, invencible ante todo, haya caído ante ella." },
        { fragmentId: id, type: "figura", category: "sintaxis", ...anchor(text, "¿no es verdad, paloma mía"), order: 1,
          content: "**Personificación + pregunta retórica**: el paisaje «respira amor» porque don Juan lo convierte en testigo de su sentimiento. La pregunta retórica no espera respuesta: es una declaración disfrazada de interrogación, que obliga a Inés a participar del mundo que él ha construido." },
        // Preguntas
        { fragmentId: id, type: "pregunta", questionGroup: "literal", order: 1,
          content: "¿Qué elementos del paisaje describe don Juan en sus primeras estrofas y cómo los relaciona con el amor? ¿Qué dice haber sentido desde el momento en que vio a doña Inés?" },
        { fragmentId: id, type: "pregunta", questionGroup: "interpretativo", order: 1,
          content: "Don Juan enumera situaciones de peligro extremo ante las que no sintió miedo, y las contrasta con su rendición ante Inés. ¿Qué función dramática cumple esta comparación? ¿La convierte en una declaración más creíble o más sospechosa?" },
        { fragmentId: id, type: "pregunta", questionGroup: "valorativo", order: 1,
          content: "Doña Inés responde «Tengo miedo y tengo fe». ¿Qué significan esas dos palabras en boca de una novicia enamorada por primera vez? ¿Es su respuesta una rendición o una resistencia?" },
        // Intertextualidad
        { fragmentId: id, type: "intertextualidad", ...anchor(text, "están respirando amor"), order: 1, linkType: "external",
          externalCitation: "Lope de Vega, *Arte nuevo de hacer comedias* (1609): «el amor y la honra son los mejores sujetos». La escena del jardín es el corazón sentimental que el teatro romántico hereda del barroco, pero despojado del enredo y convertido en pura efusión lírica.",
          content: "La escena del jardín enlaza con una larga tradición de encuentros nocturnos entre amantes: desde el jardín de Julieta en Shakespeare hasta el locus amoenus de la poesía pastoril. Zorrilla la convierte en el punto de inflexión moral del drama: el momento en que el seductor empieza a ser sincero." },
      ],
    });
    console.log("  OK: don-juan-jardin-angel-de-amor");
  }

  // ── 4. DON-JUAN-CEMENTERIO-CONVITE ──────────────────────────────────────
  {
    const { id, text } = await getFragmentId("don-juan-cementerio-convite");
    await prisma.annotation.createMany({
      data: [
        // Glosas
        { fragmentId: id, type: "glosa", ...anchor(text, "Mausoleos"), order: 1,
          content: "Sepulcros monumentales, del nombre del rey Mausolo de Caria (siglo IV a.C.), cuya tumba fue una de las Siete Maravillas del mundo antiguo. En la obra, los mausoleos representan el pasado que don Juan creía haber dejado atrás y que ahora lo rodea por todas partes." },
        { fragmentId: id, type: "glosa", ...anchor(text, "á tus conciertos"), order: 1,
          content: "«Conciertos» en el sentido de acuerdos, planes, citas concertadas. La estatua le dice que esta noche tiene una cita fijada (la cena que él mismo ha convocado) pero que habrá luego otra a la que él tendrá que ir: la del juicio de sus actos." },
        { fragmentId: id, type: "glosa", ...anchor(text, "manto de caballero"), order: 1,
          content: "Las estatuas funerarias de los caballeros de las órdenes militares se representaban con el manto de su orden (Calatrava, Santiago, Alcántara). Don Gonzalo de Ulloa lleva el manto de Calatrava, símbolo del honor que don Juan le arrebató al matarlo." },
        // Contexto
        { fragmentId: id, type: "contexto", ...anchor(text, "La muerte es muda y el mármol frío"), order: 1,
          content: "El motivo del «convite de piedra» o «convidado de piedra» tiene raíces medievales y aparece ya en el *Burlador de Sevilla* de Tirso de Molina (c. 1630). En la tradición barroca, la estatua que acepta la invitación a cenar es el instrumento de la justicia divina que castiga la soberbia del pecador. Zorrilla mantiene el motivo pero lo reorienta hacia la redención." },
        { fragmentId: id, type: "contexto", ...anchor(text, "¡Don Juan Tenorio no huye!"), order: 1,
          content: "La soberbia de don Juan ante la estatua es la misma que ha mostrado ante todos los obstáculos humanos. Pero aquí el interlocutor ya no es humano: es la Muerte. El Romanticismo ve en este duelo entre el héroe y la muerte sobrenatural la expresión más alta del individualismo que no acepta límites." },
        // Figuras
        { fragmentId: id, type: "figura", category: "tropo", ...anchor(text, "en piedra como en vida duro"), order: 1,
          content: "**Símil**: la piedra del mármol y la dureza del Comendador en vida se fusionan en una sola imagen. El símil no es solo ornamental: sugiere que la muerte no ha cambiado nada en don Gonzalo, que sigue siendo el mismo obstáculo inconmovible." },
        { fragmentId: id, type: "figura", category: "sintaxis", ...anchor(text, "La muerte es muda y el mármol frío"), order: 1,
          content: "**Zeugma + personificación**: el verso une en una sola estructura «la muerte» (abstracta) y «el mármol» (concreto), atribuyéndole a la primera el silencio y al segundo el frío. La personificación de la muerte como muda hace que su posterior movimiento (la estatua que asiente) sea más inesperado y sobrecogedor." },
        // Preguntas
        { fragmentId: id, type: "pregunta", questionGroup: "literal", order: 1,
          content: "¿Qué desafío lanza don Juan a la estatua del Comendador y cuál es la respuesta que recibe? ¿Qué promete la estatua que ocurrirá esa noche?" },
        { fragmentId: id, type: "pregunta", questionGroup: "interpretativo", order: 1,
          content: "Don Juan dice «La muerte es muda y el mármol frío. / No hay más mundo que este mío». ¿Qué cosmovisión refleja esta afirmación? ¿Cómo cambia cuando la estatua se mueve?" },
        { fragmentId: id, type: "pregunta", questionGroup: "valorativo", order: 1,
          content: "Don Juan desafía a la estatua en lugar de huir. ¿Te parece esa actitud valiente o insensata? ¿Crees que su fanfarronería ante la muerte es genuina o una máscara que esconde algo?" },
        // Intertextualidad
        { fragmentId: id, type: "intertextualidad", ...anchor(text, "yo os convido esta noche a hablar"), order: 1, linkType: "external",
          externalCitation: "Mozart / Da Ponte, *Don Giovanni* (ópera, 1787): la misma escena del cementerio y la estatua que acepta la invitación a cenar. La versión de Mozart, anterior a Zorrilla, convirtió el mito en ópera europea y lo hizo conocido en toda Europa antes de que el español lo reescribiera.",
          content: "El motivo del «convidado de piedra» había recorrido toda Europa antes de llegar a Zorrilla: Tirso lo inventó, Molière lo adaptó, Mozart lo convirtió en ópera. Zorrilla lo conocía perfectamente y eligió mantenerlo porque es el eje sobrenatural que distingue a don Juan de cualquier otro seductor: él es el único que se atreve a retar a la muerte." },
      ],
    });
    console.log("  OK: don-juan-cementerio-convite");
  }

  // ── 5. DON-JUAN-SALVACION-FINAL ─────────────────────────────────────────
  {
    const { id, text } = await getFragmentId("don-juan-salvacion-final");
    await prisma.annotation.createMany({
      data: [
        // Glosas
        { fragmentId: id, type: "glosa", ...anchor(text, "súplicas voladoras"), order: 1,
          content: "Las plegarias de Inés son «voladoras» porque van directamente de la tierra al cielo, sin intermediarios. El adjetivo da a los rezos la levedad y la velocidad de los ángeles, convirtiendo la oración en acción sobrenatural." },
        { fragmentId: id, type: "glosa", ...anchor(text, "me postré"), order: 1,
          content: "Arrodillarse, postrarse en señal de sumisión o adoración. Don Juan, que «nunca se postró» ante rey, juez ni Dios, se arrodilla ahora ante Inés. Es el gesto más radical posible para un personaje cuya identidad se ha definido por la soberbia erecta." },
        { fragmentId: id, type: "glosa", ...anchor(text, "¡Ya me entrego!"), order: 1,
          content: "Rendirse, abandonar la resistencia. La palabra *entrega* condensa toda la transformación: don Juan, que nunca entregó nada —ni su corazón ni su libertad—, se entrega ahora a Dios a través del amor de Inés. La rendición voluntaria es la forma más alta de libertad en el Romanticismo." },
        // Contexto
        { fragmentId: id, type: "contexto", ...anchor(text, "Don Juan, Dios me ha permitido"), order: 1,
          content: "La intercesión femenina como vehículo de la gracia divina tiene raíces en la teología mariológica: la Virgen intercede ante Dios por los pecadores. Zorrilla traslada ese esquema a doña Inés, convirtiendo a la novicia en una figura mariana laica. Es la gran innovación del *Don Juan Tenorio* frente al *Burlador* de Tirso, donde don Juan muere sin redención." },
        { fragmentId: id, type: "contexto", ...anchor(text, "Yo que nunca me postré"), order: 1,
          content: "El Romanticismo heredó del Siglo de Oro la idea del arrepentimiento de última hora (*contrición in articulo mortis*): el pecador que se confiesa en el lecho de muerte puede ser salvado. Pero Zorrilla va más lejos: no es el miedo a la muerte lo que convierte a don Juan, sino el amor puro de Inés, lo que es mucho más romántico." },
        // Figuras
        { fragmentId: id, type: "figura", category: "sintaxis", ...anchor(text, "Yo que nunca me postré"), order: 1,
          content: "**Anáfora + paralelismo**: la triple repetición de «yo que nunca» construye un catálogo de orgullo para hacerlo caer con más fuerza. El paralelismo entre «frente» (simboliza el pensamiento, la voluntad) y «rodilla» (el cuerpo, la sumisión física) une el orgullo intelectual y el corporal en la misma rendición." },
        { fragmentId: id, type: "figura", category: "tropo", ...anchor(text, "DON JUAN expira"), order: 1,
          content: "**Símbolo**: las flores que caen del cielo mientras el alma de don Juan asciende son el signo visual de la gracia divina concedida. Es una convención del teatro barroco de los autos sacramentales, donde los efectos escénicos (tramoyas, flores, luces) materializaban lo sobrenatural." },
        // Preguntas
        { fragmentId: id, type: "pregunta", questionGroup: "literal", order: 1,
          content: "¿Qué ha hecho doña Inés para conseguir la salvación de don Juan? ¿Qué le dice Dios según sus palabras? ¿Qué hace don Juan al final de la escena?" },
        { fragmentId: id, type: "pregunta", questionGroup: "interpretativo", order: 1,
          content: "Don Juan dice «¡Dios existe! ¡Y esa es / su mayor obra: la tuya, Inés!». ¿Qué convierte a Inés en «la mayor obra de Dios» para don Juan? ¿Qué dice esto sobre la visión del amor en el drama romántico?" },
        { fragmentId: id, type: "pregunta", questionGroup: "valorativo", order: 1,
          content: "En *El burlador de Sevilla* de Tirso, don Juan muere condenado. En Zorrilla, se salva. ¿Cuál de los dos finales te parece más justo? ¿Crees que el amor de una persona puede salvar a alguien que ha hecho mucho daño?" },
        // Intertextualidad
        { fragmentId: id, type: "intertextualidad", ...anchor(text, "súplicas voladoras"), order: 1, linkType: "external",
          externalCitation: "Dante Alighieri, *Divina Comedia*, *Paraíso* (c. 1320): Beatriz guía a Dante hasta Dios, mediando entre el pecador y la gracia divina. Doña Inés cumple la misma función que Beatriz: la mujer amada como vía de acceso a lo divino.",
          content: "La figura de la mujer-intercesora remite a la tradición medieval del *dolce stil novo* y de Dante: la dama no es solo objeto del deseo sino guía espiritual. Zorrilla convierte a doña Inés en una Beatriz romántica que lleva a don Juan, no ya a través del Paraíso, sino directamente al perdón de Dios." },
      ],
    });
    console.log("  OK: don-juan-salvacion-final");
  }

  // ── 6. DON-ALVARO-MISTERIO-Y-AMOR ───────────────────────────────────────
  {
    const { id, text } = await getFragmentId("don-alvaro-misterio-y-amor");
    await prisma.annotation.createMany({
      data: [
        // Glosas
        { fragmentId: id, type: "glosa", ...anchor(text, "alcurnia"), order: 1,
          content: "Linaje, estirpe, abolengo. En la sociedad estamental del Antiguo Régimen, la *alcurnia* determinaba el lugar que un individuo podía ocupar en la jerarquía social. Don Álvaro tiene valor y presencia pero su alcurnia «es oscura»: sin linaje claro, ninguna nobleza puede reconocerle." },
        { fragmentId: id, type: "glosa", ...anchor(text, "sino"), order: 1,
          content: "Destino, fuerza fatídica que determina la vida de una persona. En el Romanticismo español, el *sino* (relacionado con los astros, con el *signum* latino) no es solo la providencia cristiana sino una fuerza ciega e irracional que aplasta al individuo sin atender a su mérito. El título de la obra lo proclama desde el principio: *la fuerza del sino*." },
        { fragmentId: id, type: "glosa", ...anchor(text, "vulgo"), order: 1,
          content: "El pueblo llano, la gente común. El Canónigo usa la palabra con cierto desprecio: son «el vulgo» quienes repiten los rumores sobre el origen indiano de don Álvaro. El contraste entre la fiabilidad del rumor popular y la gravedad de sus consecuencias es uno de los resortes de la tragedia." },
        // Contexto
        { fragmentId: id, type: "contexto", ...anchor(text, "princesa del Perú"), order: 1,
          content: "El origen americano e híbrido de don Álvaro (padre español noble, madre indígena peruana) lo sitúa en la condición de los *criollos* o mestizos de la colonia: personas de alta cuna pero de estatuto ambiguo en la metrópoli. El Romanticismo convirtió al mestizo americano en símbolo del individuo que no encaja en ningún orden establecido." },
        { fragmentId: id, type: "contexto", ...anchor(text, "huele a sangre y a males"), order: 1,
          content: "La noción de un sino individual que marca a la persona desde el nacimiento entronca con la tradición griega de la tragedia (el *moira*, el destino) y con el pensamiento astrológico del Barroco. El Romanticismo la reactualiza: el héroe romántico está marcado por algo que no eligió —un nacimiento, un secreto, una maldición— y que ningún esfuerzo puede revertir." },
        // Figuras
        { fragmentId: id, type: "figura", category: "tropo", ...anchor(text, "flor de Sevilla, honor de honor"), order: 1,
          content: "**Metáfora + reduplicación intensiva**: «flor de Sevilla» convierte a Leonor en la encarnación de la belleza de la ciudad. «Honor de honor» es una reduplicación que eleva el sustantivo a su grado máximo: no cualquier honra, sino la más pura y perfecta. La fórmula tiene resonancias del Cantar de los Cantares («rey de reyes», «señor de señores»)." },
        { fragmentId: id, type: "figura", category: "tropo", ...anchor(text, "huele a sangre y a males"), order: 1,
          content: "**Sinestesia + presagio**: «oler» (sentido olfativo) se aplica a «sangre» y «males» (realidades abstractas o visuales). La sinestesia crea un presagio físico, como si el destino de don Álvaro tuviera un olor reconocible, algo que el cuerpo percibe antes de que la razón lo comprenda." },
        // Preguntas
        { fragmentId: id, type: "pregunta", questionGroup: "literal", order: 1,
          content: "¿Qué dicen el Oficial y el Canónigo sobre el origen de don Álvaro? ¿Qué actitud adoptan los sevillanos cuando el protagonista cruza la plaza?" },
        { fragmentId: id, type: "pregunta", questionGroup: "interpretativo", order: 1,
          content: "El protagonista aparece en escena pero no habla: se limita a cruzar en silencio, «absorto en sus pensamientos». ¿Qué efecto dramático produce esta presentación indirecta del héroe a través de los comentarios de otros personajes?" },
        { fragmentId: id, type: "pregunta", questionGroup: "valorativo", order: 1,
          content: "El Canónigo afirma que «nada bueno puede venir de amores tan desiguales». ¿Te parece que el prejuicio social contra don Álvaro está justificado en el contexto de la obra o es la causa injusta de toda la tragedia que seguirá?" },
        // Intertextualidad
        { fragmentId: id, type: "intertextualidad", ...anchor(text, "todos lo temen y lo admiran"), order: 1, linkType: "external",
          externalCitation: "Lord Byron, *Lara* (poema narrativo, 1814): el héroe byroniano —de pasado oscuro, origen misterioso y presencia magnética— es el modelo directo de don Álvaro. El duque de Rivas convierte el *Lara* de Byron en héroe de tragedia romántica española.",
          content: "Don Álvaro es el arquetipo del héroe byroniano trasplantado a España: misterioso, de origen dudoso, admirado y temido, marcado por una culpa que no es completamente suya. El duque de Rivas había vivido el exilio en Inglaterra y Malta, donde conoció la obra de Byron directamente." },
      ],
    });
    console.log("  OK: don-alvaro-misterio-y-amor");
  }

  // ── 7. DON-ALVARO-FUGA-FATAL ─────────────────────────────────────────────
  {
    const { id, text } = await getFragmentId("don-alvaro-fuga-fatal");
    await prisma.annotation.createMany({
      data: [
        // Glosas
        { fragmentId: id, type: "glosa", ...anchor(text, "Seductor"), order: 1,
          content: "La acusación del Marqués resume la perspectiva del honor aristocrático: don Álvaro no es un pretendiente legítimo sino alguien que ha actuado a espaldas del padre, lo que automáticamente lo convierte en «seductor» aunque sus intenciones fueran honorables." },
        { fragmentId: id, type: "glosa", ...anchor(text, "¡O mando que os prenda!"), order: 1,
          content: "Hacer prender a alguien: arrestarle por orden de la autoridad. El Marqués amenaza con usar el poder nobiliario y judicial que tiene como padre y como grande de España. La pistola que don Álvaro arroja es una rendición ante esa autoridad, no un gesto de violencia." },
        { fragmentId: id, type: "glosa", ...anchor(text, "el azar"), order: 1,
          content: "El azar —lo imprevisible, lo que ocurre sin que nadie lo haya querido— es uno de los conceptos filosóficos clave del drama romántico. A diferencia del destino (que tiene una lógica, aunque oscura), el azar es pura contingencia. Don Álvaro insiste en la diferencia: no fue el sino lo que mató al Marqués, fue el azar. Pero el resultado es el mismo." },
        // Contexto
        { fragmentId: id, type: "contexto", ...anchor(text, "¡Matadme, pues! Aquí tenéis mi arma"), order: 1,
          content: "El gesto de arrojar el arma es el de quien se entrega sin condiciones: un acto de rendición simbólica que demuestra que don Álvaro no ha venido a luchar sino a pedir. Es un gesto dramáticamente perfecto precisamente porque su consecuencia involuntaria es lo contrario: el arma se dispara y mata al Marqués." },
        { fragmentId: id, type: "contexto", ...anchor(text, "¡Ha sido el destino! ¡El sino!"), order: 1,
          content: "La diferencia entre el «destino» y el «sino» en la obra es más enfática que semántica: ambas palabras designan la misma fuerza fatal, pero don Álvaro las pronuncia seguidas, como si buscara a tientas la palabra exacta para nombrar lo que acaba de ocurrir sin que él lo quisiera. La redundancia expresa el estupor del personaje ante lo incomprensible." },
        // Figuras
        { fragmentId: id, type: "figura", category: "sintaxis", ...anchor(text, "¡Maldita seas, Leonor!"), order: 1,
          content: "**Anáfora imprecatoria**: el Marqués moribundo maldice en tres golpes paralelos («¡Maldita seas...! ¡Maldito el día...! ¡Y maldito el miserable...!»), haciendo de su último acto un conjuro. La maldición paterna es el arranque formal de la cadena de desgracias que constituye la trama." },
        { fragmentId: id, type: "figura", category: "tropo", ...anchor(text, "¡Ha sido el destino! ¡El sino!"), order: 1,
          content: "**Exclamación + sinonimia intensiva**: «destino» y «sino» significan lo mismo pero juntos, en exclamación, crean el efecto de una realidad que aplasta con su peso inmenso. Es la primera vez que el título de la obra («la fuerza del sino») resuena dentro del texto dramático." },
        // Preguntas
        { fragmentId: id, type: "pregunta", questionGroup: "literal", order: 1,
          content: "¿Qué hace don Álvaro con su pistola y cuál es la consecuencia involuntaria de ese gesto? ¿Qué dicen Leonor, don Álvaro y el Marqués moribundo en ese momento?" },
        { fragmentId: id, type: "pregunta", questionGroup: "interpretativo", order: 1,
          content: "Don Álvaro grita «¡Ha sido el destino! ¡El sino!» y luego «¡Ha sido el azar!». ¿Por qué usa primero «destino/sino» y luego «azar»? ¿Son lo mismo para él? ¿Cuál de los dos conceptos explica mejor lo que ha ocurrido?" },
        { fragmentId: id, type: "pregunta", questionGroup: "valorativo", order: 1,
          content: "El Marqués maldice a su hija Leonor con sus últimas palabras. ¿Te parece esta reacción comprensible o injusta? ¿Hasta qué punto es Leonor responsable de lo que ha ocurrido?" },
        // Intertextualidad
        { fragmentId: id, type: "intertextualidad", ...anchor(text, "¡Maldita seas, Leonor!"), order: 1, linkType: "external",
          externalCitation: "Sófocles, *Edipo Rey* (c. 429 a.C.): el padre muere a manos del hijo sin que ninguno de los dos lo haya querido. La maldición familiar que se transmite de generación en generación es el motor de la tragedia griega y regresa aquí con toda su fuerza.",
          content: "La escena del pistolatazo accidental activa la estructura de la tragedia griega: el héroe mata sin querer a quien no debía matar, y esa muerte involuntaria desencadena una cadena de consecuencias que nadie puede detener. Como Edipo, don Álvaro es culpable sin serlo; como en Sófocles, la maldición del padre (aquí del Marqués moribundo) perseguirá a los descendientes." },
      ],
    });
    console.log("  OK: don-alvaro-fuga-fatal");
  }

  // ── 8. DON-ALVARO-SOLDADO-DE-FORTUNA ────────────────────────────────────
  {
    const { id, text } = await getFragmentId("don-alvaro-soldado-de-fortuna");
    await prisma.annotation.createMany({
      data: [
        // Glosas
        { fragmentId: id, type: "glosa", ...anchor(text, "don Fadrique de Herreros"), order: 1,
          content: "El nombre falso que usa don Álvaro en el exilio. *Fadrique* es la versión española de Federico, nombre de raigambre germánica; *Herreros* es un apellido artesanal sin pretensiones nobiliarias. Don Álvaro ha borrado su identidad para sobrevivir, pero no puede borrar su destino." },
        { fragmentId: id, type: "glosa", ...anchor(text, "aciago"), order: 1,
          content: "Infausto, de mal agüero, marcado por la desgracia. Viene del árabe *al-zakī* (el funesto). Don Álvaro describe «una sola noche aciaga» que lo perdió todo: la noche del pistolatazo, que en su memoria ha concentrado toda la catástrofe de su vida." },
        { fragmentId: id, type: "glosa", ...anchor(text, "Bravura"), order: 1,
          content: "Valentía ostentosa, coraje llevado a sus extremos. Don Carlos alaba la bravura de don Álvaro/Fadrique en el campo de batalla. Pero para don Álvaro, la bravura es «una palabra hueca»: no compensa el «peso que no se ve» que lleva dentro." },
        // Contexto
        { fragmentId: id, type: "contexto", ...anchor(text, "Italia. Veletri, 1744"), order: 1,
          content: "Veletri (Lacio, Italia) fue escenario de la batalla de 1744 entre las tropas borbónicas hispano-napolitanas y los austriacos, en el contexto de la Guerra de Sucesión Austriaca. El duque de Rivas sitúa a don Álvaro en guerras reales de la España del siglo XVIII, dando a la ficción una pátina de veracidad histórica que conecta con el drama histórico romántico." },
        { fragmentId: id, type: "contexto", ...anchor(text, "el oficio de matar"), order: 1,
          content: "La identificación del oficio militar con «matar» es una de las desmitificaciones que el Romanticismo hace de la guerra: frente al heroísmo épico, la guerra es también muerte, rutina y pérdida de la identidad. Don Álvaro no glorifica su vida de soldado; la aguanta porque no tiene otra. Es el exiliado que ha convertido el dolor en destreza." },
        // Figuras
        { fragmentId: id, type: "figura", category: "sintaxis", ...anchor(text, "Tuve patria, tuve nombre"), order: 1,
          content: "**Anáfora + gradación descendente**: la triple repetición de «tuve» construye un inventario de lo perdido. El orden (patria → nombre → amor) va de lo colectivo a lo íntimo: primero se pierde el lugar de pertenencia, luego la identidad social, y finalmente lo que más importa, el amor. La cadena desciende hacia lo más íntimo y doloroso." },
        { fragmentId: id, type: "figura", category: "tropo", ...anchor(text, "un peso que no se ve"), order: 1,
          content: "**Metáfora de la culpa interior**: «un peso» hace tangible —convierte en sensación física— algo que no tiene cuerpo: el sentimiento de culpa, el recuerdo de lo perdido, la conciencia de ser perseguido por el destino. El «que no se ve» lo distingue de las heridas del cuerpo: es la herida del alma, invisible pero constante." },
        // Preguntas
        { fragmentId: id, type: "pregunta", questionGroup: "literal", order: 1,
          content: "¿Qué nombre usa don Álvaro en Italia y qué le ha pasado antes de que comience la escena? ¿Cómo describe su situación anímica a don Carlos?" },
        { fragmentId: id, type: "pregunta", questionGroup: "interpretativo", order: 1,
          content: "Don Carlos alaba a don Álvaro como el más valiente del campo de batalla. Pero don Álvaro responde que la «bravura» es «una palabra hueca». ¿Qué nos dice esto sobre la relación del personaje con su propia vida? ¿Por qué alguien tan valeroso no puede valorar su propio valor?" },
        { fragmentId: id, type: "pregunta", questionGroup: "valorativo", order: 1,
          content: "Don Álvaro menciona a Leonor en un aparte que don Carlos no escucha. ¿Por qué crees que el autor usa el aparte aquí? ¿Qué efecto produce en el espectador saber que los dos hombres que se hacen amigos tienen un secreto que los unirá trágicamente?" },
        // Intertextualidad
        { fragmentId: id, type: "intertextualidad", ...anchor(text, "Tuve patria, tuve nombre"), order: 1, linkType: "external",
          externalCitation: "Lord Byron, *El corsario* (1814): el héroe exiliado que ha perdido todo y sobrevive a través de la acción violenta es el modelo más cercano a don Álvaro en su etapa italiana. La postura del soldado sin patria y sin nombre es uno de los grandes tópicos del Romanticismo europeo.",
          content: "El topos del exiliado que lucha en guerras ajenas como única forma de mantener viva la existencia aparece en Byron, en el *Manfredo*, en *Lara*. El duque de Rivas, él mismo exiliado durante años en Malta e Inglaterra, conocía esa experiencia desde dentro y la volcó en don Álvaro." },
      ],
    });
    console.log("  OK: don-alvaro-soldado-de-fortuna");
  }

  // ── 9. DON-ALVARO-GRAN-MONÓLOGO ─────────────────────────────────────────
  {
    const { id, text } = await getFragmentId("don-alvaro-gran-monólogo");
    await prisma.annotation.createMany({
      data: [
        // Glosas
        { fragmentId: id, type: "glosa", ...anchor(text, "saña"), order: 1,
          content: "Ira violenta y prolongada. Don Álvaro se dirige a Dios preguntándole por qué lo persigue con su «saña»: la palabra implica que Dios actúa con rabia desproporcionada contra alguien que no lo merece. Es una acusación blasfema que define la posición del héroe romántico ante la providencia." },
        { fragmentId: id, type: "glosa", ...anchor(text, "estirpe oscura"), order: 1,
          content: "*Estirpe*: linaje, raza, origen. «Oscura» aquí no solo significa desconocida sino también manchada: el origen mestizo e ilegítimo de don Álvaro es la causa primera de que la sociedad lo rechace. El protagonista interioriza esa condena y se pregunta si su origen es también la causa del destino que le aplasta." },
        { fragmentId: id, type: "glosa", ...anchor(text, "¡Siempre el maldito sino!"), order: 1,
          content: "La palabra *sino* —ya analizada en escenas anteriores— aparece aquí en su momento de máxima intensidad dramática: don Álvaro ha matado al segundo hermano de Leonor, igual que mató al primero, igual que mató involuntariamente al padre. La repetición hace del sino una presencia acumulativa, una fuerza que se ensaña." },
        // Contexto
        { fragmentId: id, type: "contexto", ...anchor(text, "¡Dios omnipotente! ¿Qué te he hecho yo"), order: 1,
          content: "El monólogo de don Álvaro pertenece a la tradición de la *querella a Dios*, presente desde el libro de Job en la Biblia hasta el Romanticismo europeo. El héroe romántico no acepta la providencia en silencio: la interpela, la desafía, le exige una explicación que nunca llega. Esta actitud habría resultado escandalosa en el teatro barroco pero es constitutiva del drama romántico." },
        { fragmentId: id, type: "contexto", ...anchor(text, "¡Maldita sea la hora en que nací!"), order: 1,
          content: "La imprecación contra el propio nacimiento es uno de los gestos más extremos de la tradición trágica: Job («¡Maldito el día en que nací!», Job 3:3), Jeremías, Macbeth. El Romanticismo la retoma porque expresa la sensación de ser arrojado al mundo sin haberlo pedido y de no encajar en él. Don Álvaro maldice no solo su suerte sino su existencia." },
        // Figuras
        { fragmentId: id, type: "figura", category: "sintaxis", ...anchor(text, "¡Maldita sea la hora en que nací!"), order: 1,
          content: "**Anáfora + gradación**: la cuádruple repetición de «¡Maldita(o)...!» construye una letanía al revés, una oración negativa que invierte la forma de los rezos o bendiciones. La gradación va de lo temporal (la hora del nacimiento) a lo cósmico (el sino que lo formó), ampliando la maldición hasta abarcar toda la existencia." },
        { fragmentId: id, type: "figura", category: "sintaxis", ...anchor(text, "¡Siempre sangre! ¡Y siempre inocente!"), order: 1,
          content: "**Epífora + exclamación**: las dos exclamaciones terminan con la misma afirmación de inocencia («¡Y siempre inocente!»). La sangre que derrama don Álvaro es siempre sangre de inocentes —y él mismo, que la derrama, es también inocente. La epífora refuerza esa paradoja que está en el centro de la tragedia." },
        // Preguntas
        { fragmentId: id, type: "pregunta", questionGroup: "literal", order: 1,
          content: "¿Qué acaba de ocurrir antes de que don Álvaro pronuncie este monólogo? ¿Quién era don Alfonso de Vargas y qué descubre don Álvaro al verle muerto?" },
        { fragmentId: id, type: "pregunta", questionGroup: "interpretativo", order: 1,
          content: "Don Álvaro pregunta a Dios «¿Qué culpa es la mía si nací / en tierra maldita y de estirpe oscura?». ¿Está don Álvaro acusando a Dios de injusticia? ¿Qué visión de la providencia divina expresa este monólogo?" },
        { fragmentId: id, type: "pregunta", questionGroup: "valorativo", order: 1,
          content: "Don Álvaro lleva toda la obra insistiendo en que no es culpable de lo que le ocurre. ¿Crees que su insistencia en la inocencia es convincente? ¿O hay algún momento en la obra en que podría haber actuado de otra manera y evitado las tragedias?" },
        // Intertextualidad
        { fragmentId: id, type: "intertextualidad", ...anchor(text, "¡Dios omnipotente! ¿Qué te he hecho yo"), order: 1, linkType: "external",
          externalCitation: "Libro de Job, capítulo 3 (Biblia): «Perezca el día en que nací... ¿Por qué no morí al salir del vientre?». El lamento de Job ante Dios es el modelo más antiguo de la *querella*, el diálogo entre el hombre inocente y un Dios que no responde.",
          content: "El monólogo de don Álvaro es la versión romántica española de la *querella* bíblica: Job, Jeremías, los salmos de la desolación. El Romanticismo europeo (Byron, Vigny, Hugo) revitalizó esta tradición de la protesta ante Dios, y el duque de Rivas la incorpora con toda su fuerza al drama español." },
      ],
    });
    console.log("  OK: don-alvaro-gran-monólogo");
  }

  // ── 10. DON-ALVARO-PRECIPICIO-FINAL ─────────────────────────────────────
  {
    const { id, text } = await getFragmentId("don-alvaro-precipicio-final");
    await prisma.annotation.createMany({
      data: [
        // Glosas
        { fragmentId: id, type: "glosa", ...anchor(text, "ermitaña"), order: 1,
          content: "Persona que vive en soledad y penitencia, generalmente en un paraje apartado. Doña Leonor, creyéndose el origen de todas las desgracias, ha elegido la vida eremítica como forma de expiación. La ermita en la sierra de Córdoba es el contrapunto absoluto de la vida mundana de don Álvaro: los dos llevan años huyendo del mundo por razones distintas." },
        { fragmentId: id, type: "glosa", ...anchor(text, "ministros del cielo"), order: 1,
          content: "Los frailes del convento de los Ángeles. Don Álvaro los llama «ministros del cielo» con ironía amarga: representan a Dios, pero él ya no cree que Dios pueda hacer nada por él. El gesto de huir de ellos antes de lanzarse al precipicio es la forma más extrema del rechazo a la redención." },
        { fragmentId: id, type: "glosa", ...anchor(text, "¡Soy la ira de Dios sobre la tierra!"), order: 1,
          content: "En el Antiguo Testamento, la *ira de Dios* (*ira Dei*) es el instrumento con que la providencia castiga al pueblo que se ha desviado. Don Álvaro invierte el concepto: no es el objeto del castigo divino sino su instrumento. Se ve a sí mismo como una fuerza destructora enviada por Dios, sin voluntad propia." },
        // Contexto
        { fragmentId: id, type: "contexto", ...anchor(text, "El borde de un precipicio junto al convento de los Ángeles"), order: 1,
          content: "El paisaje del desenlace —sierra, convento en ruinas, precipicio, noche tormentosa— es el escenario sublime por excelencia del drama romántico. Burke y Kant habían teorizado lo *sublime* como aquello que aplasta al individuo por su desmesura. El Romanticismo lo convirtió en decorado: la naturaleza salvaje expresa visualmente la catástrofe interior del héroe." },
        { fragmentId: id, type: "contexto", ...anchor(text, "¡No hay redención para el que soy!"), order: 1,
          content: "La contraposición entre el final de *Don Álvaro* y el de *Don Juan Tenorio* (ambas de 1835 y 1844) es una de las grandes disyuntivas del drama romántico español: Zorrilla salva a su héroe mediante el amor; el duque de Rivas condena al suyo sin apelación. Rivas elige la tragedia pura: sin intercesora, sin gracia, solo el abismo." },
        // Figuras
        { fragmentId: id, type: "figura", category: "tropo", ...anchor(text, "¡Soy la ira de Dios sobre la tierra!"), order: 1,
          content: "**Metáfora bíblica de la autopercepción trágica**: don Álvaro deja de verse como víctima y se convierte, a sus propios ojos, en instrumento destructor de Dios. La megalomanía de la desesperación es un rasgo característico del héroe romántico en el límite: cuando ya no puede ser nada, lo es todo, aunque sea en sentido negativo." },
        { fragmentId: id, type: "figura", category: "sintaxis", ...anchor(text, "¡Misericordia, Señor!"), order: 1,
          content: "**Epífora + ruego**: las últimas palabras de la obra las pronuncian los frailes, no el protagonista. La repetición de «¡Misericordia!» es un cierre que don Álvaro ya no puede escuchar. La misericordia llega demasiado tarde o para el que equivocado: la tragedia concluye con un ruego que el abismo ya no puede atender." },
        // Preguntas
        { fragmentId: id, type: "pregunta", questionGroup: "literal", order: 1,
          content: "¿Cómo muere Leonor? ¿Qué papel tiene don Alfonso en su muerte? ¿Qué hace don Álvaro cuando ve morir a Leonor?" },
        { fragmentId: id, type: "pregunta", questionGroup: "interpretativo", order: 1,
          content: "Don Álvaro grita «¡No hay redención para el que soy!» y se arroja al precipicio. ¿Por qué rechaza la ayuda del Padre Guardián? ¿Es su suicidio un acto de desesperación, de orgullo, o de algo más?" },
        { fragmentId: id, type: "pregunta", questionGroup: "valorativo", order: 1,
          content: "Don Juan Tenorio, publicado dos años después, tiene un final opuesto: el seductor es salvado por el amor de Inés. Compara los dos finales: ¿cuál te parece más honesto con la lógica de sus respectivos personajes? ¿Es el amor una fuerza capaz de redimir cualquier cosa, o hay situaciones para las que no hay redención posible?" },
        // Intertextualidad
        { fragmentId: id, type: "intertextualidad", ...anchor(text, "Se lanza al precipicio"), order: 1, linkType: "external",
          externalCitation: "Goethe, *Las penas del joven Werther* (1774): la novela que convirtió el suicidio romántico en gesto literario con imitadores en toda Europa. Don Álvaro no se dispara como Werther, pero el precipicio es el equivalente: la negativa a seguir viviendo en un mundo que no tiene lugar para él.",
          content: "El suicidio como acto final del héroe romántico es una constante que va de Werther a Manfredo (Byron), pasando por Chatterton (Vigny) y Larra (en la vida real, 1837). El duque de Rivas elige el precipicio porque en él la naturaleza y la muerte se funden: don Álvaro no muere en un espacio humano sino en el vacío, que es lo que mejor representa su situación." },
      ],
    });
    console.log("  OK: don-alvaro-precipicio-final");
  }

  console.log("\nListo. 10 fragmentos con capas de lectura completas.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
