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
    title: "Tourmaline Cat",
    slug: "tourmaline-cat",
    description: "Web experience deployment exploration on Netlify.",
    src: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop",
    url: "/play-static/tourmaline-cat-a86db8/index.html",
    colors: ["#9d4edd", "#c77dff", "#e0aaff"],
    tech: ["React", "Netlify"],
  },
  {
    title: "Coruscating Donut",
    slug: "coruscating-donut",
    description: "Interactive application test deployment.",
    src: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=2564&auto=format&fit=crop",
    url: "/play-static/coruscating-donut-a699dd/index.html",
    colors: ["#ff9e00", "#ff6d00", "#ff5400"],
    tech: ["Web", "Netlify"],
  },
  {
    title: "Melodic Concha",
    slug: "melodic-concha",
    description: "Experimental UI and sound deployment.",
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
    url: "/play-static/melodic-concha-df128c/index.html",
    colors: ["#48bfe3", "#56cfe1", "#64dfdf"],
    tech: ["Audio", "Web"],
  },
  {
    title: "Enchanting Kashata",
    slug: "enchanting-kashata",
    description: "Digital playground and interaction sandbox.",
    src: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=2670&auto=format&fit=crop",
    url: "/play-static/enchanting-kashata-0f75b9/index.html",
    colors: ["#06d6a0", "#118ab2", "#073b4c"],
    tech: ["Sandbox", "Netlify"],
  },
  {
    title: "Charming Starlight",
    slug: "charming-starlight",
    description: "Visual fidelity and lighting test.",
    src: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2694&auto=format&fit=crop",
    url: "/play-static/charming-starlight-7ca2f4/index.html",
    colors: ["#ef476f", "#ffd166", "#06d6a0"],
    tech: ["Visuals", "Netlify"],
  },
];
