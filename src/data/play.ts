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
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.jpg/1280px-A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.jpg",
    url: "/play-static/tourmaline-cat-a86db8/index.html",
    colors: ["#9d4edd", "#c77dff", "#e0aaff"],
    tech: ["React", "Netlify"],
  },
  {
    title: "Coruscating Donut",
    slug: "coruscating-donut",
    description: "Interactive application test deployment.",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Claude_Monet_-_Water_Lilies_-_Google_Art_Project1.jpg/1280px-Claude_Monet_-_Water_Lilies_-_Google_Art_Project1.jpg",
    url: "/play-static/coruscating-donut-a699dd/index.html",
    colors: ["#ff9e00", "#ff6d00", "#ff5400"],
    tech: ["Web", "Netlify"],
  },
  {
    title: "Melodic Concha",
    slug: "melodic-concha",
    description: "Experimental UI and sound deployment.",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project.jpg/1280px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project.jpg",
    url: "/play-static/melodic-concha-df128c/index.html",
    colors: ["#48bfe3", "#56cfe1", "#64dfdf"],
    tech: ["Audio", "Web"],
  },
  {
    title: "Enchanting Kashata",
    slug: "enchanting-kashata",
    description: "Digital playground and interaction sandbox.",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg/1280px-%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg",
    url: "/play-static/enchanting-kashata-0f75b9/index.html",
    colors: ["#06d6a0", "#118ab2", "#073b4c"],
    tech: ["Sandbox", "Netlify"],
  },
  {
    title: "Charming Starlight",
    slug: "charming-starlight",
    description: "Visual fidelity and lighting test.",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg/1280px-Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg",
    url: "/play-static/charming-starlight-7ca2f4/index.html",
    colors: ["#ef476f", "#ffd166", "#06d6a0"],
    tech: ["Visuals", "Netlify"],
  },
];
