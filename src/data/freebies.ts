export interface FreebieItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  downloadUrl: string;
  colors: string[];
}

export const freebies: FreebieItem[] = [
  {
    id: "01",
    title: "Editorial Typeface Specimen",
    description:
      "A high-fidelity PDF specimen exploring the intersection of brutalist architecture and serif typography. Optimized for print and high-res digital display.",
    category: "TYPOGRAPHY",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/687px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
    downloadUrl: "#",
    colors: ["#001219", "#005f73", "#0a9396"],
  },
  {
    id: "02",
    title: "Liquid Gradient Pack",
    description:
      "12 high-resolution grainient textures for experimental web backgrounds. Available in .webp and .png formats.",
    category: "TEXTURES",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Eug%C3%A8ne_Delacroix_-_Le_28_Juillet._La_Libert%C3%A9_guidant_le_peuple.jpg/1024px-Eug%C3%A8ne_Delacroix_-_Le_28_Juillet._La_Libert%C3%A9_guidant_le_peuple.jpg",
    downloadUrl: "#",
    colors: ["#9d4edd", "#c77dff", "#e0aaff"],
  },
  {
    id: "03",
    title: "Minimalist Mockups // Vol 1",
    description:
      "A collection of 5 photorealistic device mockups with a focus on negative space and architectural lighting.",
    category: "MOCKUPS",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/The_Nightwatch_by_Rembrandt_-_Rijksmuseum.jpg/1024px-The_Nightwatch_by_Rembrandt_-_Rijksmuseum.jpg",
    downloadUrl: "#",
    colors: ["#ee9b00", "#ca6702", "#bb3e03"],
  },
  {
    id: "04",
    title: "Motion Design Presets",
    description:
      "After Effects presets for creating the signature 'tech-luxe' animation feel. Focuses on elastic eases and mechanical precision.",
    category: "MOTION",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Ultima_Cena_-_Da_Vinci_5.jpg/1024px-Ultima_Cena_-_Da_Vinci_5.jpg",
    downloadUrl: "#",
    colors: ["#ae2012", "#9b2226", "#001219"],
  },
  {
    id: "05",
    title: "Noise Texture Toolkit",
    description:
      "Procedural noise maps for 3D shaders and digital painting. Includes 4k resolution heightmaps.",
    category: "TEXTURES",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Van_Gogh_-_Terrasse_des_Caf%C3%A9s_an_der_Place_du_Forum_in_Arles_am_Abend1.jpeg/1024px-Van_Gogh_-_Terrasse_des_Caf%C3%A9s_an_der_Place_du_Forum_in_Arles_am_Abend1.jpeg",
    downloadUrl: "#",
    colors: ["#005f73", "#0a9396", "#94d2bd"],
  },
];
