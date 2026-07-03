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
  // ─── Constellations ───────────────────────────────────────────
  const consAmor     = await prisma.constellation.findFirstOrThrow({ where: { slug: "amor"             } });
  const consMuerte   = await prisma.constellation.findFirstOrThrow({ where: { slug: "muerte"           } });
  const consPaso     = await prisma.constellation.findFirstOrThrow({ where: { slug: "paso-del-tiempo"  } });
  const consLibertad = await prisma.constellation.findFirstOrThrow({ where: { slug: "libertad"         } });
  const consCritica  = await prisma.constellation.findFirstOrThrow({ where: { slug: "critica-social"   } });
  const consFe       = await prisma.constellation.findFirstOrThrow({ where: { slug: "fe"               } });
  const consVoz      = await prisma.constellation.findFirstOrThrow({ where: { slug: "voz-femenina"     } });

  // ══════════════════════════════════════════════════════════════
  // 1. GARCILASO — Égloga I: Nemoroso llora a Elisa
  // ══════════════════════════════════════════════════════════════
  const eglogaI = await prisma.work.findFirstOrThrow({ where: { slug: "egloga-i" } });

  const nemoroso = `¡Oh dulces prendas por mi mal halladas,
dulces y alegres cuando Dios quería,
juntas estáis en la memoria mía,
y con ella en mi muerte conjuradas!

¿Quién me dijera, Elisa, vida mía,
cuando en aqueste valle al fresco viento
andábamos cogiendo tiernas flores,
que había de ver con largo apartamiento
venir el triste y solitario día
que diese amargo fin a mis amores?

El cielo en mis dolores
cargó la mano tanto
que a sempiterno llanto
y a triste soledad me ha condenado.

[...]

Divina Elisa, pues agora el cielo
con inmortales pies pisas y mides,
y su mudanza ves, estando queda,
¿por qué de mí te olvidas y no pides
que se apresure el tiempo en que este velo
rompa del cuerpo, y verme libre pueda,
y en la tercera rueda,
contigo, mano a mano,
busquemos otro llano,
busquemos otros montes y otros ríos,
otros valles floridos y sombríos
donde descanse y siempre pueda verte
ante los ojos míos,
sin miedo y sobresalto de perderte?`;

  console.log("Creando fragmento: Nemoroso llora a Elisa…");
  const fragNemoroso = await prisma.fragment.create({
    data: {
      slug:     "egloga-i-nemoroso-elisa",
      title:    "El llanto de Nemoroso",
      location: "Égloga I, vv. 211–337 (fragmento)",
      headline: "¡Oh dulces prendas por mi mal halladas!",
      text:     nemoroso,
      order:    2,
      status:   "published",
      workId:   eglogaI.id,
      constellations: { connect: [{ id: consAmor.id }, { id: consMuerte.id }, { id: consPaso.id }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragNemoroso.id,
        type:  "figura",
        order: 1,
        ...anchor(nemoroso, "juntas estáis en la memoria mía,\ny con ella en mi muerte conjuradas"),
        content:
          "**Apostrofe y prosopopeya**: Nemoroso se dirige a los objetos de Elisa como si tuviesen vida propia. El poeta renacentista —influido por Petrarca— transforma el dolor en liturgia: las «prendas» (pañuelo, guante, carta) son reliquias de la amada muerta. La paradoja de «dulces» / «mi mal» encapsula el *dolce stil novo*: el amor bello que produce sufrimiento inacabable.",
      },
      {
        fragmentId: fragNemoroso.id,
        type:  "contexto",
        order: 2,
        ...anchor(nemoroso, "andábamos cogiendo tiernas flores"),
        content:
          "Se suele identificar a Elisa con **Isabel Freire**, dama de la corte portuguesa que murió de parto en 1533. Garcilaso la había cortejado sin éxito y el duelo aquí no es solo literario. La imagen del «valle al fresco viento» es el locus amoenus clásico convertido ahora en espacio de memoria dolorosa: el mismo lugar idílico donde el pastor pastaba con ella se vuelve escenario de ausencia.",
      },
      {
        fragmentId: fragNemoroso.id,
        type:  "intertextualidad",
        order: 3,
        ...anchor(nemoroso, "Divina Elisa, pues agora el cielo\ncon inmortales pies pisas y mides"),
        content:
          "El motivo de la amada muerta que mora en el cielo y puede interceder procede de **Petrarca** (*Canzoniere*, canciones *In vita* / *In morte* de Laura) y más atrás de la *Vita nuova* de Dante (Beatriz glorificada). Garcilaso asimila la tradición italiana para crear el primer gran lamento elegíaco de la poesía castellana.",
        externalCitation: `Petrarca, *Canzoniere*, CCCXXXVI: «Tornami a mente, anzi v'è dentro, quella / ch'indi per mio ben tolta, et sì ch'io veggia / sua forma con la mente ov'io la veggia».`,
      },
      {
        fragmentId: fragNemoroso.id,
        type:  "glosa",
        order: 4,
        ...anchor(nemoroso, "en la tercera rueda"),
        content:
          "La «**tercera rueda**» o tercer cielo (Ptolemeo) es la esfera de Venus en la cosmología geocéntrica medieval-renacentista. Nemoroso promete a Elisa que, cuando muera, buscarán juntos otro mundo parecido a la Arcadia que compartieron —pero ya inmortal y sin pérdida. El sueño de reunión en el más allá es el reverso esperanzador del *ubi sunt* manriqueño: en lugar de preguntar «¿adónde fueron?», Garcilaso responde «allí te encontraré».",
      },
    ],
  });
  console.log("✅ Nemoroso llora a Elisa");

  // ══════════════════════════════════════════════════════════════
  // 2. QUEVEDO — El Buscón: el dómine Cabra
  // ══════════════════════════════════════════════════════════════
  const elBuscon = await prisma.work.findFirstOrThrow({ where: { slug: "el-buscon" } });

  const cabraText = `Era un clérigo cerbatana, largo sólo en el talle, una cabeza pequeña, pelo bermejo (no hay más que decir para quien sabe el refrán), los ojos avecindados en el cogote, que parecía que miraba por cuévanos, tan hundidos y oscuros que era buen sitio el suyo para tiendas de mercaderes; la nariz, entre Roma y Francia, porque se le había muerto de frío y no llegó a entera. Las barbas descoloridas de miedo de la boca vecina, que, de pura hambre, parecía que amenazaba a comérselas. Los dientes le faltaban no sé cuántos, y pienso que por holgazanes y vagabundos se los habían desterrado. El gaznate largo como de avestruz, con una nuez tan salida que parecía que se le quería ir a buscar de comer forzada de la necesidad. Los brazos secos; las manos como un manojo de sarmientos cada una. Mirado de medio abajo, parecía tenedor o compás, con dos piernas largas y flacas.

Comenzamos a comer un poco; y avié­ronme con tan poco, que más me obligó la misericordia que la hartura. Trájeron caldo en unas escudillas de madera, tan claro que, en comer una dellas, pudiera Narciso mirarse mejor que en la fuente. Noté que todos los que con él comían lo hacían con tanta parsimonia y tan poca sustancia, que parecía que lamían el hambre en lugar de satisfacerla.`;

  console.log("Creando fragmento: el dómine Cabra…");
  const fragCabra = await prisma.fragment.create({
    data: {
      slug:     "el-buscon-domine-cabra",
      title:    "El dómine Cabra",
      location: "Historia de la vida del Buscón, Libro I, capítulo III",
      headline: "Un clérigo tan seco que parecía tenedor",
      text:     cabraText,
      order:    2,
      status:   "published",
      workId:   elBuscon.id,
      constellations: { connect: [{ id: consCritica.id }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragCabra.id,
        type:  "figura",
        order: 1,
        ...anchor(cabraText, "pelo bermejo (no hay más que decir para quien sabe el refrán)"),
        content:
          "**Elusión satírica**: el refrán que Quevedo omite es «No hay ningún secretario con pelo bermejo que sea leal», y más aún la asociación popular entre el pelo rojo y el origen judío (la Biblia llama bermejo a Esaú; Judas suele pintarse con cabello rojo). Quevedo no lo dice, pero lo dice todo: la mención basta para que el lector del Siglo de Oro active inmediatamente el prejuicio antisemita. Es el insulto con máxima economía verbal.",
      },
      {
        fragmentId: fragCabra.id,
        type:  "figura",
        order: 2,
        ...anchor(cabraText, "parecía que miraba por cuévanos"),
        content:
          "**Caricatura acumulativa**: Quevedo utiliza la técnica del retrato burlesco (*prosopografía cómica*) en la que cada parte del cuerpo se compara con algo absurdo o repugnante. Los ojos «avecindados en el cogote» (casi en la nuca) y que «miraban por cuévanos» (cestos de mimbre agujereados) son imágenes de vaciamiento: Cabra no tiene casi presencia física porque literalmente se está consumiendo de inanición —y hace lo mismo con sus pupilos.",
      },
      {
        fragmentId: fragCabra.id,
        type:  "glosa",
        order: 3,
        ...anchor(cabraText, "la nariz, entre Roma y Francia"),
        content:
          "«Entre Roma y Francia»: la nariz destruida —rota, incompleta— era señal inequívoca de **sífilis** en el Siglo de Oro. Francia porque se llamaba entonces «mal francés» o «mal gálico»; Roma porque era la capital del vicio. Quevedo añade «porque se le había muerto de frío», que literalmente aludiría al ascetismo, pero el público entendía la segunda lectura. El clérigo hambre es, encima, vicioso.",
      },
      {
        fragmentId: fragCabra.id,
        type:  "figura",
        order: 4,
        ...anchor(cabraText, "pudiera Narciso mirarse mejor que en la fuente"),
        content:
          "**Hipérbole absurda**: el caldo es tan transparente que en él Narciso se vería mejor que en la fuente mítica donde se enamoró de su propio reflejo (Ovidio, *Metamorfosis* III). El humor opera por contraste: la aspiración noble del mito se aplica a un caldo miserable. Esta técnica —mezcla de cultura clásica y realidad ruin— es característica del **conceptismo** quevedesco.",
        externalCitation: `Ovidio, *Metamorfosis* III, 407–412: «videt in liquidis translucere gurgitibus ora / Narcissus / dumque bibit, visae correptus imagine formae / spem sine corpore amat».`,
      },
    ],
  });
  console.log("✅ El dómine Cabra");

  // ══════════════════════════════════════════════════════════════
  // 3. GÓNGORA — Letrillas: «Ándeme yo caliente»
  // ══════════════════════════════════════════════════════════════
  const letrillas = await prisma.work.findFirstOrThrow({ where: { slug: "letrillas-gongora" } });

  const andemeText = `Ándeme yo caliente,
y ríase la gente.

Traten otros del gobierno
del mundo y sus monarquías,
mientras gobiernan mis días
mantequillas y pan tierno,
y las mañanas de invierno
naranjada y aguardiente,
y ríase la gente.

Coma en dorada vajilla
el príncipe mil cuidados,
como píldoras dorados;
que yo en mi pobre mesilla
quiero más una morcilla
que en el asador reviente,
y ríase la gente.

Cuando cubra las montañas
de blanca nieve el enero,
tenga yo lleno el brasero
de bellotas y castañas,
y quien las dulces patrañas
del amor cuente y no cuente,
y ríase la gente.

Busque muy en hora buena
el mercader nuevos soles;
yo conchas y caracoles
entre la menuda arena,
escuchando a Filomena
sobre el chopo de la fuente,
y ríase la gente.`;

  console.log("Creando fragmento: Ándeme yo caliente…");
  const fragAndeme = await prisma.fragment.create({
    data: {
      slug:     "gongora-andeme-yo-caliente",
      title:    "«Ándeme yo caliente»",
      location: "Letrillas, letrilla burlesca (1581)",
      headline: "Ándeme yo caliente, y ríase la gente",
      text:     andemeText,
      order:    2,
      status:   "published",
      workId:   letrillas.id,
      constellations: { connect: [{ id: consCritica.id }, { id: consLibertad.id }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragAndeme.id,
        type:  "contexto",
        order: 1,
        ...anchor(andemeText, "Ándeme yo caliente,\ny ríase la gente"),
        content:
          "La **letrilla** es una composición de origen popular que alterna estrofas con un estribillo (*estribillo* o *vuelta*). Góngora tiene dos tipos: las satíricas («Ándeme yo caliente», 1581) y las sacras. Esta de 1581 es la más temprana y más celebrada de sus letrillas burlesanas: el estribillo condensa toda su filosofía carpe diem en clave carnavalesca y antiheroica. No hay aquí la complejidad culterana de las *Soledades*; Góngora muestra que dominaba igualmente el registro popular.",
      },
      {
        fragmentId: fragAndeme.id,
        type:  "figura",
        order: 2,
        ...anchor(andemeText, "Coma en dorada vajilla\nel príncipe mil cuidados,\ncomo píldoras dorados"),
        content:
          "**Antítesis y paradoja social**: la «dorada vajilla» contrasta con la «pobre mesilla» del hablante. El príncipe come «cuidados» —sus preocupaciones de Estado— «dorados» como píldoras: la imagen implica que el poder es una medicina amarga disfrazada. El hablante prefiere la morcilla que «reviente» —imagen grotesca y festiva— al lujo vacío del gobernante. Góngora invierte la jerarquía social: el pobre es el libre.",
      },
      {
        fragmentId: fragAndeme.id,
        type:  "intertextualidad",
        order: 3,
        ...anchor(andemeText, "escuchando a Filomena\nsobre el chopo de la fuente"),
        content:
          "**Filomena** es el ruiseñor mitológico (Ovidio, *Metamorfosis* VI): la princesa ateniense convertida en pájaro tras la violación de Tereo. Góngora la incluye en una lista de placeres cotidianos —conchas, caracoles, brasa— equiparando lo mítico con lo humilde. Es el mismo procedimiento que usará en el *Polifemo* y las *Soledades*, pero aquí con tono burlesco: la mitología clásica baja al nivel del picnic.",
        externalCitation: `Ovidio, *Metamorfosis* VI, 667–670: «Inde tremens alis posita in Filomela figura / nunc nemorum ponas, nunc montium rupe resedit / inde tuis pennis miserum testatur amorem».`,
      },
    ],
  });
  console.log("✅ Ándeme yo caliente");

  // ══════════════════════════════════════════════════════════════
  // 4. CALDERÓN — La vida es sueño: Jornada III (vencer al destino)
  // ══════════════════════════════════════════════════════════════
  const vidas = await prisma.work.findFirstOrThrow({ where: { slug: "la-vida-es-sueno" } });

  const segismundoText = `SEGISMUNDO: Cielos, si es verdad que sueño,
             suspendedme la memoria,
             que no es posible que quepan
             en un sueño tantas cosas.
             ¡Válgame Dios! ¿Quién supiera,
             o saber o ignorar, cómo
             se deshace entre las sombras
             lo que entre luces se goza!

             Pues si es sueño, si es mentira,
             ¿quién por vanagloria humana
             pierde una divina gracia?
             ¿Qué pasada bien no es sueño?
             ¿Qué dicha tuvo, que al fin
             no fuese humo, polvo y viento?

             A reinar, fortuna, vamos;
             no me despiertes si duermo,
             y si es verdad, no me aduermas.
             Mas sea verdad o sueño,
             obrar bien es lo que importa;
             si fuere verdad, por serlo;
             si no, por ganar amigos
             para cuando despertemos.`;

  console.log("Creando fragmento: Segismundo, vencer al destino…");
  const fragSegismundo3 = await prisma.fragment.create({
    data: {
      slug:     "la-vida-es-sueno-obrar-bien",
      title:    "Obrar bien, aunque sea sueño",
      location: "La vida es sueño, Jornada III",
      headline: "Obrar bien es lo que importa, si fuere verdad, por serlo",
      text:     segismundoText,
      order:    3,
      status:   "published",
      workId:   vidas.id,
      constellations: { connect: [{ id: consLibertad.id }, { id: consMuerte.id }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragSegismundo3.id,
        type:  "contexto",
        order: 1,
        ...anchor(segismundoText, "¿Quién supiera,\n             o saber o ignorar, cómo\n             se deshace entre las sombras\n             lo que entre luces se goza"),
        content:
          "Al principio de la Jornada III, Segismundo acaba de ser devuelto a la torre creyendo que su día de libertad fue un sueño. Pero ahora los soldados vienen a liberarlo de nuevo para que reine. Ante esta nueva oportunidad, Segismundo ya no actúa impulsivamente como en la Jornada II: ha aprendido que, sea real o ilusorio, el bien obrado tiene valor permanente. Es el momento de mayor madurez del personaje.",
      },
      {
        fragmentId: fragSegismundo3.id,
        type:  "figura",
        order: 2,
        ...anchor(segismundoText, "¿Qué pasada bien no es sueño?\n             ¿Qué dicha tuvo, que al fin\n             no fuese humo, polvo y viento"),
        content:
          "**Acumulación de metáforas de la fugacidad**: «humo, polvo y viento» retoman la cadena del *ubi sunt* manriqueño («¿qué fue sino lustre de prado?»). Calderón dialoga con toda la tradición del *tempus fugit* medieval y renacentista, pero lleva el argumento más lejos: si todo es ilusorio, la única respuesta racional es actuar bien. La ética barroca es pragmática respecto al valor metafísico pero exigente respecto al deber moral.",
      },
      {
        fragmentId: fragSegismundo3.id,
        type:  "pregunta",
        order: 3,
        ...anchor(segismundoText, "obrar bien es lo que importa;\n             si fuere verdad, por serlo;\n             si no, por ganar amigos\n             para cuando despertemos"),
        content:
          "Segismundo formula una **apuesta ética** que anticipa la apuesta de Pascal (*Pens&eacute;es*, 1670): si Dios existe, conviene creer; si no, no se pierde nada creyendo. De modo análogo, si la vida es real, obrar bien tiene valor intrínseco; si es sueño, obrar bien genera al menos la confianza de los demás «para cuando despertemos». ¿Es ésta una solución satisfactoria al problema de la libertad que plantea la obra, o es solo una huida pragmática?",
      },
    ],
  });
  console.log("✅ Obrar bien aunque sea sueño");

  // ══════════════════════════════════════════════════════════════
  // 5. DANZA GENERAL DE LA MUERTE — La muerte llama al Papa y al Emperador
  // ══════════════════════════════════════════════════════════════
  const danza = await prisma.work.findFirstOrThrow({ where: { slug: "danza-general-de-la-muerte" } });

  const papaTiempo = `LA MUERTE: Papa muy santo, padre spiritual,
             que en la silla de Pedro asentado,
             las llaves del cielo te fueron dadas
             para absolver los pecados del mundo:
             ya no hay más papa, ya no hay más mundo;
             conviene que vengas a facer la mi dança.

EL PAPA: Ay, Muerte cruel, mucho me coyta
             tu viença, que me faze quexa e llanto,
             ca nunca fallé aun fasta agora
             ninguno que mi carga pudiese levar.
             Yo era en la silla de grand apostura,
             con grandes honores, por hombre temido;
             a priesas me traxes; ya non sé qué sea
             mi vida pasada: en polvo tornida.

LA MUERTE: Señor Enperador, rey de christianos,
             que muchos reynos tenía so vos,
             ya los dexad todos que son temporales;
             venid a mi dança que es ley general.

EL ENPERADOR: ¡Ay! Muerte, la muerte. A ti me querello,
             que vienes a mí muy sin sazón,
             que era en silla de grande valía,
             entendiendo en guerras e en grandes fechos.
             Llaméme señor de muchas naciones,
             obe grandes reinos, castillos e villas:
             agora me llamas a las tus canciones,
             adonde non valen coronas nin sillas.`;

  console.log("Creando fragmento: La Muerte llama al Papa y al Emperador…");
  const fragDanza2 = await prisma.fragment.create({
    data: {
      slug:     "danza-muerte-papa-emperador",
      title:    "La Muerte llama al Papa y al Emperador",
      location: "Danza general de la muerte (s. XV), estrofas 3–10 (fragmento)",
      headline: "Yo era en la silla de grand apostura; en polvo tornida",
      text:     papaTiempo,
      order:    2,
      status:   "published",
      workId:   danza.id,
      constellations: { connect: [{ id: consMuerte.id }, { id: consPaso.id }, { id: consCritica.id }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragDanza2.id,
        type:  "contexto",
        order: 1,
        ...anchor(papaTiempo, "las llaves del cielo te fueron dadas"),
        content:
          "La **Danza de la Muerte** (o *Totentanz*) es un género alegórico europeo del siglo XIV-XV: la Muerte personificada invita a bailar a personas de todos los estamentos, del Papa al villano, sin excepciones. En la versión castellana (c. 1400-1450), los convocados suelen responder con quejas y resistencia, pero nadie puede negarse. La alusión a las «llaves del cielo» (Mateo 16,19, donde Cristo entrega a Pedro el poder de atar y desatar) subraya la suprema ironía: incluso el vicario de Cristo en la tierra no puede escapar de la Muerte.",
      },
      {
        fragmentId: fragDanza2.id,
        type:  "figura",
        order: 2,
        ...anchor(papaTiempo, "mi vida pasada: en polvo tornida"),
        content:
          "**Ubi sunt implícito y *memento mori***: la frase «en polvo tornida» condensa Génesis 3,19 («polvo eres y al polvo volverás») y el tópico de *contemptus mundi* (desprecio del mundo). No se pregunta «¿adónde fue?» como en el *ubi sunt* explícito de Manrique; aquí el Papa ya sabe adónde fue: a la nada. Es la versión dramática y dialogada del mismo motivo que Manrique desarrollará en las *Coplas* décadas después.",
      },
      {
        fragmentId: fragDanza2.id,
        type:  "figura",
        order: 3,
        ...anchor(papaTiempo, "adonde non valen coronas nin sillas"),
        content:
          "**Ironía y igualdad de la muerte**: el Emperador enumera con orgullo sus posesiones —reinos, castillos, villas— para subrayar que de nada le sirven. La Muerte no distingue entre el más poderoso (el Emperador, cabeza temporal de la Cristiandad) y el más humilde: ese igualitarismo macabro es el mensaje político central del género. Compárese con el *«¿Qué se fizo el rey don Joan? / Los Infantes de Aragón, / ¿qué se ficieron?»* de Manrique.",
      },
      {
        fragmentId: fragDanza2.id,
        type:  "glosa",
        order: 4,
        ...anchor(papaTiempo, "dança que es ley general"),
        content:
          "La «**danza**» es metáfora de la muerte inevitable que arrastra a todos. El término *ley general* subraya que no hay excepción posible: no es castigo por pecados, sino condición universal. El género de la Danza de la Muerte surge en Europa tras las grandes epidemias de **peste negra** (1347-1353), que mataron a un tercio de la población europea y demolieron la idea de que el rango social o la virtud podían proteger de la muerte.",
      },
    ],
  });
  console.log("✅ La Muerte llama al Papa y al Emperador");

  // ──── Resumen ─────────────────────────────────────────────────
  console.log("\n✅ 5 nuevos fragmentos añadidos:");
  console.log("  1. egloga-i-nemoroso-elisa");
  console.log("  2. el-buscon-domine-cabra");
  console.log("  3. gongora-andeme-yo-caliente");
  console.log("  4. la-vida-es-sueno-obrar-bien");
  console.log("  5. danza-muerte-papa-emperador");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
