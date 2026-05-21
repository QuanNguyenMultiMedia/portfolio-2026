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
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
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
      "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=2564&auto=format&fit=crop",
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
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop",
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
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2574&auto=format&fit=crop",
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
      "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=2574&auto=format&fit=crop",
    downloadUrl: "#",
    colors: ["#005f73", "#0a9396", "#94d2bd"],
  },
];
