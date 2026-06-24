import type { Metadata } from "next";
import { SectionHeader } from "@/components/layout/SectionHeader";

export const metadata: Metadata = {
  title: "Acerca de",
  description:
    "Metodología, criterios de selección y propósito pedagógico de ¡LEE!, antología digital comentada de literatura en español.",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-8 border-b border-line last:border-b-0">
      <h2 className="font-display text-2xl italic font-bold text-accent mb-4">
        {title}
      </h2>
      <div className="prose-reading max-w-none text-ink leading-relaxed space-y-4">
        {children}
      </div>
    </section>
  );
}

export default function AcercaDePage() {
  return (
    <div>
      <div className="mx-auto max-w-3xl px-4 pt-10 pb-4">
        <SectionHeader
          href="/acerca-de"
          title="Acerca de"
          description="Metodología y propósito de la antología"
        />
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-24">
        <Section title="Qué es ¡LEE!">
          <p>
            ¡LEE! es una antología digital comentada de literatura en español:
            una selección de fragmentos, de las jarchas mozárabes a la poesía
            del siglo XX, anotados para su lectura en el aula. No pretende
            sustituir el libro de texto, sino abrir una vía de entrada distinta
            a los mismos contenidos: la del texto mismo, acompañado de las
            herramientas necesarias para leerlo con atención.
          </p>
          <p>
            El nombre resume el propósito: <em>nombrar el mundo</em> —entender
            qué dice cada texto y por qué lo dice así— para poder{" "}
            <em>transformarlo</em>, que es lo que hace la literatura cuando
            de verdad se lee.
          </p>
        </Section>

        <Section title="Las capas de lectura">
          <p>
            Cada fragmento puede leerse en cuatro niveles, que el lector activa
            o desactiva según lo que necesite:
          </p>
          <ul className="list-none space-y-2 pl-0">
            <li>
              <strong className="text-ink">Significado.</strong> Glosas de
              palabras y expresiones que han cambiado de sentido o han caído
              en desuso.
            </li>
            <li>
              <strong className="text-ink">Contexto.</strong> Datos
              históricos, biográficos o culturales necesarios para entender
              por qué se escribió ese texto, en ese momento, de esa manera.
            </li>
            <li>
              <strong className="text-ink">Estilo.</strong> Figuras retóricas,
              tópicos y recursos formales señalados directamente sobre el
              texto, con su explicación.
            </li>
            <li>
              <strong className="text-ink">Conexiones.</strong> Vínculos con
              otros textos de la antología —mismo tema, mismo tópico, misma
              constelación de motivos— para leer la literatura como una
              conversación entre siglos, no como una lista cerrada de obras.
            </li>
          </ul>
        </Section>

        <Section title="Criterios de selección">
          <p>
            Los fragmentos se eligieron buscando representatividad por
            época, diversidad de autoría —incluyendo voces femeninas
            históricamente menos antologadas, como María de Zayas, Ana Caro
            de Mallén o Florencia Pinar— y, sobre todo, capacidad de generar
            preguntas: cada texto incluido permite al menos una lectura
            literal, una interpretativa y una valorativa, las tres recogidas
            como preguntas explícitas en el propio fragmento.
          </p>
          <p>
            Los <em>itinerarios</em> agrupan fragmentos de épocas distintas
            alrededor de un mismo asunto —el amor, el valor, el miedo, la
            ausencia— para que el alumnado pueda recorrer la antología
            temáticamente además de cronológicamente.
          </p>
        </Section>

        <Section title="Cómo navegar la antología">
          <p>
            Además del recorrido por obras y autoras y autores, la antología
            puede explorarse por época, por personaje, por lugar citado en
            los textos, por tópico literario o por figura retórica —un
            índice transversal de los más de 390 recursos de estilo
            señalados en los textos—. Cada eje de entrada lleva, en último
            término, al mismo lugar: el fragmento anotado.
          </p>
        </Section>

        <Section title="El proyecto">
          <p>
            ¡LEE! es un trabajo de Asier Lorenzo García, desarrollado en el
            IES Agra do Orzán (A Coruña) como herramienta para la enseñanza
            de Lengua Castellana y Literatura. El contenido se actualiza de
            forma continua: nuevos fragmentos, anotaciones e itinerarios se
            incorporan a medida que el proyecto crece.
          </p>
        </Section>
      </div>
    </div>
  );
}
