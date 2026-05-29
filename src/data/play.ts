import { IMAGES } from "./images";

export interface PlayItem {
  title: string;
  slug: string;
  description: string;
  src: string; // Placeholder image
  url: string; // Actual experience URL
  colors: string[];
  tech: string[];
}

export const playItems: PlayItem[] = [
  {
    title: "Disaster Map - Viet Nam",
    slug: "disaster-map-viet-nam",
    description: "An interactive map of disaster events in Vietnam based on open source data",
    src: IMAGES.SUNDAY_ON_LA_GRANDE_JATTE,
    url: "/play-static/tourmaline-cat-a86db8/index.html",
    colors: ["#9d4edd", "#c77dff", "#e0aaff"],
    tech: ["D3", "Map"],
  },
  {
    title: "Medal Graph",
    slug: "medal-graph",
    description: "Comparative graph of medals won per sports among HCMC athletes.",
    src: IMAGES.WATER_LILIES,
    url: "/play-static/coruscating-donut-a699dd/index.html",
    colors: ["#ff9e00", "#ff6d00", "#ff5400"],
    tech: ["D3", "Chart"],
  },
  {
    title: "Migration Graph",
    slug: "migration-graph",
    description: "Interactive Bubble Graph exploring relationships between Vietnam's provincial migration rates and their average income.",
    src: IMAGES.BIRTH_OF_VENUS,
    url: "/play-static/melodic-concha-df128c/index.html",
    colors: ["#48bfe3", "#56cfe1", "#64dfdf"],
    tech: ["D3", "Bubble"],
  },
  {
    title: "Sugar Analyzer",
    slug: "sugar-analyzer",
    description: "Analysis of sugar contents in popular snacks",
    src: IMAGES.SCHOOL_OF_ATHENS,
    url: "/play-static/enchanting-kashata-0f75b9/index.html",
    colors: ["#06d6a0", "#118ab2", "#073b4c"],
    tech: ["Data", "Nutrition"],
  },
];
