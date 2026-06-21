import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // ── Actualizar retrato del autor (ya existe en DB) ─────────────────────────
  const autor = await prisma.author.update({
    where: { slug: "angel-de-saavedra-duque-de-rivas" },
    data: { portraitUrl: "/images/authors/angel-de-saavedra-duque-de-rivas.jpg" },
  });
  console.log("Autor actualizado:", autor.slug);

  // ── Obra ───────────────────────────────────────────────────────────────────
  const obra = await prisma.work.upsert({
    where: { slug: "don-alvaro-o-la-fuerza-del-sino" },
    update: {},
    create: {
      slug: "don-alvaro-o-la-fuerza-del-sino",
      title: "Don Álvaro o la fuerza del sino",
      year: 1835,
      genre: "Drama romántico en cinco jornadas, en prosa y verso",
      era: "Romanticismo",
      synopsis: "Don Álvaro, noble de origen misterioso —se rumorea hijo de un prócer español y una princesa inca—, ama a doña Leonor de Vargas y proyectan fugarse juntos. Sorprendidos por el Marqués de Calatrava, padre de Leonor, don Álvaro arroja su pistola como señal de rendición; el arma se dispara sola y mata al Marqués. Comienza entonces una cadena de desgracias imparable: huidas, duelos, muertes y encuentros fatales que desemboca en un final catastrófico en la sierra de Córdoba, junto al convento de los Ángeles. La obra, que sirvió de base al libreto de La forza del destino de Verdi (1862), convirtió al destino en protagonista absoluto del teatro romántico español.",
      authorId: autor.id,
    },
  });
  console.log("Obra:", obra.slug);

  // ── Fragmentos ─────────────────────────────────────────────────────────────
  const fragmentos = [
    {
      slug: "don-alvaro-misterio-y-amor",
      title: "El misterioso don Álvaro",
      location: "Jornada I, Escenas I y II",
      headline:
        "Los sevillanos murmuran de don Álvaro: nadie sabe de dónde viene, pero todos saben que ama a doña Leonor como si fuese su destino.",
      text: `(Plaza de Sevilla, cerca de la iglesia de San Juan de Dios. Atardecer. Un oficial, un canónigo y varios transeúntes comentan la figura del misterioso forastero.)

OFICIAL:
 ¿Quién es ese don Álvaro?
 ¿De dónde viene? ¿Quién es su padre?
 Nadie lo sabe, y sin embargo
 todos lo temen y lo admiran.

CANÓNIGO:
 Corre la voz de que es hijo
 de un grande de España y de una
 princesa del Perú... ¡Embrollo
 novelesco y de ninguna
 credibilidad! Pero el vulgo
 lo repite, y algo hay de cierto
 en que su alcurnia es oscura
 y en que su valor es cierto.

OFICIAL:
 Sea quien fuere, ha puesto sus ojos
 —y su corazón, que es lo peor—
 en doña Leonor de Vargas,
 flor de Sevilla, honor de honor.
 Y el señor Marqués de Calatrava,
 que es su padre y la tiene en guarda,
 no habrá de verlo con buenos ojos.

CANÓNIGO:
 Nada bueno puede venir
 de amores tan desiguales.
 Que el sino que ese mozo trae
 huele a sangre y a males.

(Don Álvaro cruza la plaza sin mirar a nadie, absorto en sus pensamientos, envuelto en su capa.)

VOZ EN LA MULTITUD:
 ¡Allí va! ¡Don Álvaro!

(Nadie se acerca. La figura se aleja sola hacia la casa de Vargas.)`,
      order: 1,
      status: "published" as const,
      artworkImageUrl: "/images/artworks/goya-el-aquelarre.jpg",
      artworkTitle: "El aquelarre",
      artworkAuthor: "Francisco de Goya (1821–1823)",
      artworkCaption:
        "El aquelarre de Goya evoca esa atmósfera de fatalismo y poder oscuro que rodea la figura de don Álvaro: un ser dominado por fuerzas que escapan a su voluntad y a la comprensión de quienes le rodean.",
    },
    {
      slug: "don-alvaro-fuga-fatal",
      title: "La fuga fatal: el pistolatazo que lo cambió todo",
      location: "Jornada I, Escena IX",
      headline:
        "La pistola de don Álvaro cae al suelo por accidente y mata al Marqués de Calatrava: el inicio de una cadena de desdichas imparable.",
      text: `(Cámara del Marqués de Calatrava. Noche. DON ÁLVARO ha venido a buscar a DOÑA LEONOR para la fuga. El MARQUÉS DE CALATRAVA los sorprende.)

MARQUÉS DE CALATRAVA:
 ¡Infame! ¡Seductor! ¿Qué hacéis aquí?
 ¡Salid de esta casa, miserable!
 ¡Leonor, hija sin vergüenza!

DON ÁLVARO:
 Señor Marqués, no alteréis así
 vuestra sangre noble. Doña Leonor
 nada ha hecho de lo que no sea
 digno de su nombre. Toda la culpa
 es mía: yo la he solicitado
 y he venido a pediros vuestra hija
 con toda la honra que le debo.

MARQUÉS:
 ¡Salid, digo! ¡O mando que os prenda!

DON ÁLVARO (arrojando al suelo su pistola):
 ¡Matadme, pues! Aquí tenéis mi arma.
 Vuestra hija es inocente;
 atravesadme el pecho con ella
 si creéis que merezco la muerte.
 ¡Pero no toquéis a Leonor!

(La pistola golpea el suelo con violencia y se dispara. El MARQUÉS cae herido.)

LEONOR:
 ¡Padre mío! ¡Dios mío!

DON ÁLVARO:
 ¡Qué es esto! ¡Cielos! ¡Yo no he sido!
 ¡Ha sido el destino! ¡El sino!

MARQUÉS (moribundo):
 ¡Maldita seas, Leonor!
 ¡Maldito el día en que naciste!
 ¡Y maldito el miserable
 que mi sangre aquí vertiste!
(Muere.)

DON ÁLVARO:
 ¡No, yo no lo he hecho! ¡Ha sido el azar!
 ¡Leonor, Leonor! ¿Qué hemos de hacer?
 ¡El destino nos persigue!
 ¡Huye, que van a prender!`,
      order: 2,
      status: "published" as const,
      artworkImageUrl: "/images/artworks/goya-albanil-herido.jpg",
      artworkTitle: "El albañil herido",
      artworkAuthor: "Francisco de Goya (1786–1787)",
      artworkCaption:
        "Goya pintó la fragilidad del cuerpo humano ante el accidente involuntario. En la tragedia de don Álvaro, la muerte del Marqués no es asesinato sino accidente catastrófico: el sino que actúa a través de los objetos más inofensivos.",
    },
    {
      slug: "don-alvaro-soldado-de-fortuna",
      title: "El soldado de fortuna en Italia",
      location: "Jornada III, Escena VI",
      headline:
        "Don Álvaro se ha rehecho como valeroso soldado en Italia y ha encontrado en don Carlos un amigo leal —sin saber que es el hermano de Leonor.",
      text: `(Italia. Veletri, 1744. Campo de batalla. DON ÁLVARO —que aquí se llama don Fadrique de Herreros— yace herido. DON CARLOS DE VARGAS le socorre, sin saber quién es.)

DON CARLOS:
 Sosteneos, amigo. La herida
 no parece mortal. ¡Hola! ¡Socorros!

DON ÁLVARO:
 Dejadme morir... no importa.
 ¿Qué tengo yo que conservar
 en esta vida maldita?

DON CARLOS:
 Habláis como hombre desesperado.
 La vida aún puede deparar
 muchos bienes a quien es joven
 y valiente como vos.

DON ÁLVARO:
 ¡Bienes! ¡Sí! Los conocí...
 Tuve patria, tuve nombre,
 tuve amor... Y todo ello
 se lo llevó el destino
 en una sola noche aciago.
 Hoy solo tengo este acero
 y el oficio de matar.

DON CARLOS:
 Pues ese oficio lo ejercéis
 con honra, don Fadrique. En el campo
 no hay quien os iguale en bravura.

DON ÁLVARO:
 Bravura... ¡Qué palabra tan hueca
 para quien lleva dentro
 un peso que no se ve!
 (Aparte) ¡Leonor! ¡Leonor! ¿Dónde estás,
 luz de mis ojos perdida?
 ¿Vives aún, o acaso el cielo
 te llamó antes que a mí?

DON CARLOS:
 ¿Qué murmurás, amigo?

DON ÁLVARO:
 Nada. Que agradezco
 vuestra amistad, don Carlos.
 Es lo único que me queda.`,
      order: 3,
      status: "published" as const,
      artworkImageUrl: "/images/artworks/pradilla-rendicion-de-granada.jpg",
      artworkTitle: "La rendición de Granada",
      artworkAuthor: "Francisco Pradilla Ortiz (1882)",
      artworkCaption:
        "El cuadro de Pradilla muestra el peso de la derrota sobre el vencido: la misma melancolía que arrastra don Álvaro por los campos de batalla de Europa, disfrazado de otro nombre, incapaz de escapar de su pasado.",
    },
    {
      slug: "don-alvaro-gran-monólogo",
      title: "¡Maldita sea la existencia!",
      location: "Jornada V, Escena VII",
      headline:
        "Don Álvaro, acorralado por el destino tras matar sin querer al segundo hermano de Leonor, se abandona al furor de la desesperación.",
      text: `(La sierra de Córdoba. Las ruinas de un convento en la noche. DON ÁLVARO acaba de herir mortalmente a DON ALFONSO DE VARGAS en duelo, creyendo vengar su honor. Al ver al muerto, descubre que es el último hermano de Leonor.)

DON ÁLVARO:
 ¡Miserable de mí! ¡Otra vez sangre!
 ¡Siempre sangre! ¡Y siempre inocente!
 ¡Dios omnipotente! ¿Qué te he hecho yo
 para que así me persiga tu saña?
 ¿Qué culpa es la mía si nací
 en tierra maldita y de estirpe oscura?
 ¿Por qué ha de pagar el inocente
 los pecados que el azar me hizo?

 ¡Leonor! ¡Leonor! ¡Sombra de Leonor!
 ¿Dónde estás? Acude a consolarme,
 que ya no tengo fuerzas para más.
 ¡He matado a tu hermano! ¡Al segundo!
 ¡Como al primero! ¡Sin quererlo!
 ¡Siempre el maldito sino!
 ¡Siempre la fuerza del destino
 haciendo de mí un instrumento
 de muerte y de ruina!

 ¡Maldita sea la hora en que nací!
 ¡Maldita la luz que me alumbró!
 ¡Maldita la mano que me crió!
 ¡Y maldito el sino que me hizo así!

 ¡Dios! ¡Si existes, escúchame!
 ¿No es suficiente ya el castigo?
 ¿No basta tanta sangre derramada?
 ¿Qué más quieres de un hombre
 que ya no tiene nada?`,
      order: 4,
      status: "published" as const,
      artworkImageUrl: "/images/artworks/goya-perro-semihundido.jpg",
      artworkTitle: "Perro semihundido",
      artworkAuthor: "Francisco de Goya (c. 1819–1823)",
      artworkCaption:
        "El perro de Goya, hundiéndose en la nada, mira al vacío sin que nadie le tienda la mano. Esa imagen de abandono absoluto ante una fuerza que aplasta sin explicación es la que da forma al gran monólogo de don Álvaro.",
    },
    {
      slug: "don-alvaro-precipicio-final",
      title: "El precipicio: el fin de don Álvaro",
      location: "Jornada V, Escena última",
      headline:
        "Leonor muere en brazos de su hermano; don Álvaro, que lo ha matado sin saberlo, se arroja al abismo mientras los frailes claman misericordia.",
      text: `(La sierra de Córdoba. El borde de un precipicio junto al convento de los Ángeles. Noche tormentosa. DON ÁLVARO ha herido mortalmente a DON ALFONSO. DOÑA LEONOR, que vivía retirada como ermitaña en la sierra, oye los gritos y sale a socorrer al herido. DON ALFONSO, al verla, la clava con su puñal en un último arranque de desesperación antes de morir.)

LEONOR (cayendo):
 ¡Dios mío! ¡Misericordia!

DON ÁLVARO:
 ¡Leonor! ¡Leonor! ¿Eres tú?
 ¿Estás viva? ¡Habla! ¡Contesta!
 ¡No, no! ¡Dios! ¡Otra vez! ¡Siempre!
 ¡Siempre la muerte a mi lado!

LEONOR (expirando):
 Don Álvaro... que Dios...
 te perdone...
(Muere.)

DON ÁLVARO (fuera de sí):
 ¡Ha muerto! ¡Ha muerto! ¡Yo la he matado!
 ¡Yo maté a su padre, a sus hermanos,
 y ahora a ella! ¡Soy un monstruo!
 ¡Soy el enviado del infierno!
 ¡Soy la ira de Dios sobre la tierra!
 ¡Huid de mí, ministros del cielo!
 ¡No hay redención para el que soy!

(Se acercan FRAILES con antorchas desde el convento.)

PADRE GUARDIÁN:
 ¡Hijo! ¡Deteneos! ¡En nombre de Dios!

DON ÁLVARO:
 ¡Dios! ¡Llamáis a Dios! ¡No hay Dios
 para el que está maldito desde el vientre!
 ¡Misericordia pedís para mí!
 ¡Pedidla para vosotros!
 ¡El infierno me reclama, y yo voy!

(Se lanza al precipicio.)

FRAILES:
 ¡Misericordia, Señor!
 ¡Misericordia!`,
      order: 5,
      status: "published" as const,
      artworkImageUrl: "/images/artworks/aivazovsky-novena-ola.jpg",
      artworkTitle: "La novena ola",
      artworkAuthor: "Iván Aivazovsky (1850)",
      artworkCaption:
        "La tormenta de Aivazovsky es el equivalente pictórico del desenlace de Don Álvaro: la naturaleza desatada, los seres humanos insignificantes ante fuerzas que no controlaron ni comprendieron, y la única salida es el abismo.",
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
