export type EraMeta = {
  label: string;
  dateRange: string;
  slug: string;
  /** Overrides the dynamic DB coverImage when set. */
  overrideImage?: string;
};

export const ERA_META: EraMeta[] = [
  {
    label: "Al-Ándalus",
    dateRange: "s. VIII–XV",
    slug: "al-andalus",
  },
  {
    label: "Edad Media",
    dateRange: "s. XI–XV",
    slug: "edad-media",
    overrideImage: "/images/artworks/beato-liebana.jpg",
  },
  {
    label: "Prerrenacimiento",
    dateRange: "s. XV",
    slug: "prerrenacimiento",
  },
  {
    label: "Renacimiento",
    dateRange: "s. XVI",
    slug: "renacimiento",
  },
  {
    label: "Barroco",
    dateRange: "s. XVII",
    slug: "barroco",
  },
  {
    label: "Ilustración",
    dateRange: "s. XVIII",
    slug: "ilustracion",
  },
  {
    label: "Romanticismo",
    dateRange: "s. XIX",
    slug: "romanticismo",
  },
  {
    label: "Modernismo",
    dateRange: "fin s. XIX",
    slug: "modernismo",
    overrideImage: "/images/artworks/klimt-el-beso.jpg",
  },
  {
    label: "Generación del 27",
    dateRange: "s. XX",
    slug: "generacion-del-27",
    overrideImage: "/images/artworks/van-gogh-noche-estrellada.jpg",
  },
];

export function getEraMeta(era: string): EraMeta | undefined {
  return ERA_META.find((e) => e.label === era);
}
