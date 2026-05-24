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
      "A 48-page high-fidelity PDF specimen dissecting the intersection of brutalist architecture and modern serif typography. Each spread pairs structural photography with type system breakdowns, including variable font axis mappings, kerning tables, and grid overlay references. Optimized for both print (300 DPI, CMYK) and high-res digital display (Retina, sRGB). Perfect for type designers and editorial architects.",
    category: "TYPOGRAPHY",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/960px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
    downloadUrl: "#",
    colors: ["#001219", "#005f73", "#0a9396"],
  },
  {
    id: "02",
    title: "Liquid Gradient Pack",
    description:
      "A curated set of 12 high-resolution grainient textures engineered for experimental web backgrounds and editorial overlays. Each texture features multi-layered grain structure with subtle color bleed, rendered at 4096x4096px. Formats include lossless .webp (optimized for web delivery), .png (for compositing), and an accompanying .css file with pre-configured backdrop-filter blend modes. Ideal for adding organic warmth to otherwise sterile digital surfaces.",
    category: "TEXTURES",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Eug%C3%A8ne_Delacroix_-_Le_28_Juillet._La_Libert%C3%A9_guidant_le_peuple.jpg/960px-Eug%C3%A8ne_Delacroix_-_Le_28_Juillet._La_Libert%C3%A9_guidant_le_peuple.jpg",
    downloadUrl: "#",
    colors: ["#9d4edd", "#c77dff", "#e0aaff"],
  },
  {
    id: "03",
    title: "Minimalist Mockups // Vol 1",
    description:
      "Five photorealistic device mockups conceived around negative space and architectural lighting. Each mockup includes multi-angle perspectives (front, isometric, detail crop) with realistic environmental reflections and drop shadows. Layered PSDs with smart-object swap slots, pre-configured 3D light rigs, and color-grading LUTs included. The set covers laptop, tablet, phone, monitor, and a hero display configuration for hero section presentations.",
    category: "MOCKUPS",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/The_Nightwatch_by_Rembrandt_-_Rijksmuseum.jpg/960px-The_Nightwatch_by_Rembrandt_-_Rijksmuseum.jpg",
    downloadUrl: "#",
    colors: ["#ee9b00", "#ca6702", "#bb3e03"],
  },
  {
    id: "04",
    title: "Motion Design Presets",
    description:
      "A signature After Effects preset pack engineered for the 'tech-luxe' animation aesthetic — where elastic eases meet mechanical precision. Includes 24 animation presets (entry, exit, emphasis, and looping), 8 custom expression controllers for procedural variation, and a comprehensive easing curve library mapped to cubic-bezier values for direct translation to web frameworks (Framer Motion, GSAP). Each preset is documented with reference FPS targets and GPU utilization notes.",
    category: "MOTION",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/%C3%9Altima_Cena_-_Da_Vinci_5.jpg/960px-%C3%9Altima_Cena_-_Da_Vinci_5.jpg",
    downloadUrl: "#",
    colors: ["#ae2012", "#9b2226", "#001219"],
  },
  {
    id: "05",
    title: "Noise Texture Toolkit",
    description:
      "A procedural noise texture toolkit designed for 3D shader work and digital painting. Contains 16 seamless 4K resolution maps spanning Perlin, Simplex, Voronoi, Fractal Brownian Motion, and custom hybrid noise types. Each map available in 8-bit and 16-bit depth, with EXR float-format variants for HDR rendering pipelines. Accompanied by a GLSL snippet library for real-time shader implementation, including normal-map generation and displacement mapping utilities.",
    category: "TEXTURES",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Van_Gogh_-_Terrasse_des_Caf%C3%A9s_an_der_Place_du_Forum_in_Arles_am_Abend1.jpeg/960px-Van_Gogh_-_Terrasse_des_Caf%C3%A9s_an_der_Place_du_Forum_in_Arles_am_Abend1.jpeg",
    downloadUrl: "#",
    colors: ["#005f73", "#0a9396", "#94d2bd"],
  },
];
