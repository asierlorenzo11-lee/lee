export const revalidate = 3600;

import type { Metadata } from "next";
import { getEras } from "@/lib/queries";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { BookshelfClient, type ShelfBook, type ShelfGroup } from "@/components/obras/BookshelfClient";

export const metadata: Metadata = {
  title: "Obras",
  description: "Las obras de la antología de literatura española, organizadas por época: del Cantar de Mio Cid al siglo XX.",
};

type SpineStyle = { bg: string; text: string; accent: string; decoration: string };

const SPINE_STYLES: SpineStyle[] = [
  { bg: "#3B9E97", text: "#FFFFFF",  accent: "#FFFFFF",  decoration: "stripes"         },
  { bg: "#F2C340", text: "#1A1A18",  accent: "#1A1A18",  decoration: "plain"           },
  { bg: "#8E9FD0", text: "#FFFFFF",  accent: "#D0DAFF",  decoration: "border"          },
  { bg: "#EDE4C8", text: "#3A2C1A",  accent: "#B89A6A",  decoration: "ornament"        },
  { bg: "#DC5128", text: "#FFFFFF",  accent: "#FFFFFF",  decoration: "x-cross"         },
  { bg: "#1E1E2A", text: "#F0F0F8",  accent: "#50505F",  decoration: "plain"           },
  { bg: "#CAD636", text: "#1A1A18",  accent: "#3B9E97",  decoration: "band"            },
  { bg: "#F4AAAA", text: "#1A1A18",  accent: "#1A1A18",  decoration: "dashes"          },
  { bg: "#5574BC", text: "#FFFFFF",  accent: "#AABEFF",  decoration: "zigzag"          },
  { bg: "#C47350", text: "#FFFFFF",  accent: "#FFD8B0",  decoration: "ornament"        },
  { bg: "#8A6DAF", text: "#FFFFFF",  accent: "#D4C4F4",  decoration: "corner-brackets" },
  { bg: "#5A9E62", text: "#FFFFFF",  accent: "#B8EFCC",  decoration: "x-cross"         },
  { bg: "#8B2252", text: "#FFFFFF",  accent: "#FFB0CC",  decoration: "stripes"         },
  { bg: "#1A3A6B", text: "#FFFFFF",  accent: "#A0C0FF",  decoration: "dots"            },
  { bg: "#E83E6C", text: "#FFFFFF",  accent: "#FFFFFF",  decoration: "zigzag"          },
  { bg: "#D88A20", text: "#FFFFFF",  accent: "#FFF0B0",  decoration: "diamond"         },
  { bg: "#A06880", text: "#FFFFFF",  accent: "#FFD0E4",  decoration: "border"          },
  { bg: "#3A4A7A", text: "#F0F0FF",  accent: "#B8C8FF",  decoration: "dots"            },
];

const SPINE_HEIGHTS = [232, 268, 208, 284, 244, 220, 256, 236];
const SPINE_WIDTHS  = [86, 100, 78, 96, 108, 82, 92];

export default async function ObrasPage() {
  const eras = await getEras();

  let nextIdx = 0;
  const groups: ShelfGroup[] = eras.map((group) => ({
    era: group.era,
    books: group.works.map((work): ShelfBook => {
      const i = nextIdx++;
      const style = SPINE_STYLES[i % SPINE_STYLES.length];
      return {
        id: work.id,
        slug: work.slug,
        title: work.title,
        authorName: work.author.name,
        era: group.era,
        ...style,
        height: SPINE_HEIGHTS[i % SPINE_HEIGHTS.length],
        width:  SPINE_WIDTHS[i % SPINE_WIDTHS.length],
      };
    }),
  }));

  const eraNames = eras.map((g) => g.era);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <SectionHeader
        href="/obras"
        description="Las obras de la antología, agrupadas por época."
      />
      <div className="mt-10">
        <BookshelfClient groups={groups} eras={eraNames} />
      </div>
    </div>
  );
}
