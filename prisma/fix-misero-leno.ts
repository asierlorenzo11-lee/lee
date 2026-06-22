import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

const NUEVO_COMENTARIO = `Más conocido como dramaturgo —es el autor del célebre drama romántico Don Álvaro o la fuerza del sino—, el cordobés Ángel de Saavedra y Ramírez de Baquedano, Duque de Rivas (1791-1865), fue muchas otras cosas: historiador, pintor, militar, político… Y poeta, de los más relevantes de su tiempo.

Luchó muy joven contra los franceses en la Guerra de la Independencia, y llegó al grado de capitán. Liberal exaltado (la rama más progresista del liberalismo por entonces), participó en el pronunciamiento militar de Rafael del Riego de 1820 que puso fin al absolutismo de Fernando VII y abrió el llamado Trienio Liberal, periodo en el que se restableció la Constitución de Cádiz, la Pepa, y se pusieron en marcha las reformas políticas que esta había dictado. Una contrarrevolución alentada por el rey, con la ayuda de los llamados Cien Mil Hijos de San Luis —un contingente del ejército francés enviado a España para «liberar» al monarca del constitucionalismo y del liberalismo—, acabó con el periodo y con los liberales: unos, entre ellos Riego, fueron ejecutados; muchos otros acabaron en el exilio.

El Duque de Rivas, que fue condenado a muerte y a la confiscación de sus bienes, huyó a Inglaterra. Vivió allí, y en Malta, y en París, hasta que tras la muerte de Fernando VII, en 1833, fue amnistiado y regresó a España. Fue después senador, embajador en Nápoles y en París, ministro… y hasta presidente del Consejo de Ministros durante dos días (sic) de 1854.

Su Don Álvaro…, de 1835, fue el primer gran éxito teatral del romanticismo español, y tuvo impacto más allá de nuestras fronteras: en él se basa el libreto que Francesco Maria Piave hizo para La forza del destino, la ópera de Giuseppe Verdi. El drama de Rivas tiene todos los elementos típicos del romanticismo: pesimismo, fatalidad, rebeldía. El protagonista se ve arrastrado a la desgracia por la fuerza del destino, de un designio superior a él contra el que nada puede hacer.

Su obra poética se plasma sobre todo en romances, muchos de ellos con aires que recuerdan los del romancero viejo, los del paso de la Edad Media al Renacimiento. Fue también un excelente sonetista. Dudé si traeros el soneto que os traigo o si este otro, que representa una parte de su obra menos conocida, la de la sátira política. Se titula Receta segura, podría aplicarse hoy mismo a nuestra vida pública y dice así: «Estudia poco o nada, y la carrera / acaba de abogado en estudiante, / vete, imberbe, a Madrid, y, petulante, / charla sin dique, estafa sin barrera. // Escribe en un periódico cualquiera; / de opiniones extremas sé el Atlante / y ensaya tu elocuencia relevante / en el café o en junta patriotera. // Primero concejal, y diputado / procura luego ser, que se consigue / tocando con destreza un buen registro; // no tengas fe ninguna, y ponte al lado / que esperanza mejor de éxito abrigue, / y pronto te verás primer ministro».

El Mísero leño finalmente elegido es, como veis, una reflexión bien armada y bien rimada sobre la fugacidad de la vida y especialmente sobre las vanas pretensiones y los sueños indebidos de la soberbia.`;

const NUEVA_CAPTION =
  "Géricault pintó la desesperación de los náufragos que se aferran a un mísero leño en medio del océano: la misma imagen con que el Duque de Rivas cierra su soneto sobre la existencia humana a la deriva de pasiones que no gobernamos.";

async function main() {
  const frag = await prisma.fragment.findUniqueOrThrow({
    where: { slug: "misero-leno-soneto" },
    include: { annotations: { where: { type: "pregunta" } } },
  });

  // 1. Corregir artworkCaption
  await prisma.fragment.update({
    where: { id: frag.id },
    data: { artworkCaption: NUEVA_CAPTION },
  });
  console.log("✓ artworkCaption corregida");

  // 2. Actualizar anotación pregunta (Comentario)
  const pregunta = frag.annotations[0];
  if (!pregunta) {
    console.error("✗ No se encontró anotación tipo pregunta");
    return;
  }
  await prisma.annotation.update({
    where: { id: pregunta.id },
    data: { content: NUEVO_COMENTARIO },
  });
  console.log("✓ Comentario actualizado");

  console.log("\nListo.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
