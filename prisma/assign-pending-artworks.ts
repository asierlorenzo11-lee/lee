import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

const ARTWORKS: Array<{
  slug: string;
  artworkImageUrl: string;
  artworkTitle: string;
  artworkAuthor: string;
  artworkCaption: string;
}> = [
  // ── CADALSO ──────────────────────────────────────────────────
  {
    slug: "carta-xxxv-cadalso",
    artworkImageUrl: "/images/artworks/cadalso-cochero-noble.jpg",
    artworkTitle: "El paseo de Andalucía (La maja y los embozados)",
    artworkAuthor: "Francisco de Goya, h. 1777",
    artworkCaption:
      "Una maja y dos embozados —figuras del Madrid popular— pasean en esta escena de Goya contemporánea a las Cartas marruecas. El cochero que en la Carta XXXV lleva en volandas al señorito es otra versión del mismo mundo: una España de jerarquías absurdas donde el rango del amo lo lleva sobre sus espaldas el criado.",
  },
  {
    slug: "los-eruditos-a-la-violeta-leccion",
    artworkImageUrl: "/images/artworks/cadalso-noble-inutil.jpg",
    artworkTitle: "Hasta su abuelo",
    artworkAuthor: "Francisco de Goya, Caprichos n.º 39, 1799",
    artworkCaption:
      "En el Capricho 39, Goya satiriza la obsesión nobiliaria por el árbol genealógico: un mono examina complacido el retrato de sus antepasados. Cadalso había anticipado esta crítica en los «eruditos a la violeta»: personas que presumen de saber en una tarde lo que otros estudian años, porque su apellido —como el árbol del Capricho— hace todo el trabajo.",
  },

  // ── JOVELLANOS ───────────────────────────────────────────────
  {
    slug: "jovellanos-los-toros",
    artworkImageUrl: "/images/artworks/goya-la-novillada.jpg",
    artworkTitle: "La novillada",
    artworkAuthor: "Francisco de Goya, 1779-1780",
    artworkCaption:
      "Goya y Jovellanos fueron contemporáneos y compartieron el mismo Madrid ilustrado. Esta escena de novillada —un espectáculo popular de masas— es exactamente lo que Jovellanos somete a crítica en su Informe sobre el expediente de la Ley Agraria: no la tauromaquia en sí, sino el hecho de que distraiga al pueblo de actividades productivas y lo habitúe a la violencia.",
  },

  // ── TIRSO DE MOLINA ──────────────────────────────────────────
  {
    slug: "que-largo-me-lo-fiais",
    artworkImageUrl: "/images/artworks/goya-maja-embozados.jpg",
    artworkTitle: "La maja y los embozados",
    artworkAuthor: "Francisco de Goya, 1777",
    artworkCaption:
      "El embozado —el hombre que oculta su identidad bajo la capa— es la figura que abre El burlador de Sevilla: don Juan entra en el palacio de Nápoles de noche, fingiendo ser el duque Octavio. Esta escena de Goya, donde el disfraz y la oscalidad crean la atmósfera de la seducción, anticipa plásticamente el primer engaño de un personaje cuya identidad siempre está oculta.",
  },
  {
    slug: "el-convite-de-piedra",
    artworkImageUrl: "/images/artworks/don-juan-cementerio-convite.jpg",
    artworkTitle: "Don Juan y el Convidado de Piedra",
    artworkAuthor: "Alexandre-Évariste Fragonard, h. 1830",
    artworkCaption:
      "La escena más célebre del teatro barroco español: don Juan invita burlonamente a cenar a la estatua del Comendador en su sepulcro, y la estatua acepta. El artista romantico recoge exactamente la escenografía que Tirso inventó: el cementerio, la estatua de piedra y el gesto desafiante de un don Juan que nunca creyó que sus burlas tuvieran consecuencias.",
  },

  // ── IRIARTE ──────────────────────────────────────────────────
  {
    slug: "los-dos-conejos",
    artworkImageUrl: "/images/artworks/liebres-cobardes.jpg",
    artworkTitle: "Las liebres cobardes",
    artworkAuthor: "Jean-Baptiste Oudry, h. 1732",
    artworkCaption:
      "Jean-Baptiste Oudry fue el gran ilustrador de las fábulas de La Fontaine —la misma tradición que Iriarte recoge y adapta para criticar los vicios literarios de su época. Esta escena de liebres huyendo en tropel captura el mismo espíritu de las fábulas de Iriarte: el ridículo de quien actúa sin pensar, confundiendo las cosas tal como los espectadores del poema confunden conejos con podencos y galgos.",
  },
  {
    slug: "el-burro-flautista",
    artworkImageUrl: "/images/artworks/oudry-lobo.jpg",
    artworkTitle: "El lobo y el perro (ilustración de fábula)",
    artworkAuthor: "Jean-Baptiste Oudry, h. 1729",
    artworkCaption:
      "Oudry ilustró las fábulas de La Fontaine con un naturalismo animal que Iriarte admiraba: la misma tradición de poner en escena a los animales para hablar de los hombres. El burro que en la fábula de Iriarte hace sonar la flauta por accidente —y cree haber descubierto su talento musical— pertenece a esta larga genealogía de animales que actúan como espejos de la estupidez humana.",
  },

  // ── SAMANIEGO ────────────────────────────────────────────────
  {
    slug: "el-zorro-y-el-cuervo",
    artworkImageUrl: "/images/artworks/hondecoeter-zorra-con-gallo.jpg",
    artworkTitle: "Zorra con un gallo",
    artworkAuthor: "Melchior de Hondecoeter, h. 1680",
    artworkCaption:
      "En esta escena de Hondecoeter —pintor especializado en aves y animales de corral— la zorra acecha a un gallo con la misma astucia y lisonja que en la fábula de Samaniego usa para arrebatarle el queso al cuervo. La moraleja es la misma: la adulación es un arma, y quien la recibe sin crítica pierde siempre algo.",
  },

  // ── MORATÍN ──────────────────────────────────────────────────
  {
    slug: "la-comedia-nueva-disparates",
    artworkImageUrl: "/images/artworks/paret-la-tienda.jpg",
    artworkTitle: "La tienda del anticuario (o Un interior con figuras)",
    artworkAuthor: "Luis Paret y Alcázar, h. 1772",
    artworkCaption:
      "Luis Paret y Alcázar es el pintor del XVIII español más próximo al universo de Moratín: salones, tertulias, espacios cerrados donde la conversación y el juicio de las personas revelan su carácter. Esta escena interior, con figuras charlando y gesticulando, evoca el ambiente de la sala de teatro donde don Eleuterio estrena su desastre y el público le hace ver la diferencia entre el arte verdadero y los «disparates».",
  },
];

async function main() {
  for (const art of ARTWORKS) {
    const updated = await prisma.fragment.update({
      where: { slug: art.slug },
      data: {
        artworkImageUrl: art.artworkImageUrl,
        artworkTitle: art.artworkTitle,
        artworkAuthor: art.artworkAuthor,
        artworkCaption: art.artworkCaption,
      },
      select: { slug: true, artworkTitle: true },
    });
    console.log(`✓ [${updated.slug}] → "${updated.artworkTitle}"`);
  }
  console.log(`\n✅ ${ARTWORKS.length} artworks asignados.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
