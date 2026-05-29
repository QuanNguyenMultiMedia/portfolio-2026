import { IMAGES } from "./images";

export interface FreebieItem {
  id: string;
  slug: string;
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
    slug: "editorial-typeface-specimen",
    title: "Editorial Typeface Specimen",
    description:
      "A 48-page high-fidelity PDF specimen dissecting the intersection of brutalist architecture and modern serif typography.\n\nEach spread pairs structural photography with type system breakdowns, including variable font axis mappings, kerning tables, and grid overlay references.\n\nOptimized for both print (300 DPI, CMYK) and high-res digital display (Retina, sRGB). Perfect for type designers and editorial architects.",
    category: "TYPOGRAPHY",
    image: IMAGES.GIRL_WITH_PEARL_EARRING,
    downloadUrl: "#",
    colors: ["#001219", "#005f73", "#0a9396"],
  },
  {
    id: "02",
    slug: "liquid-gradient-pack",
    title: "Liquid Gradient Pack",
    description:
      "A curated set of 12 high-resolution grainient textures engineered for experimental web backgrounds and editorial overlays.\n\nEach texture features multi-layered grain structure with subtle color bleed, rendered at 4096x4096px.\n\nFormats include lossless .webp (optimized for web delivery), .png (for compositing), and an accompanying .css file with pre-configured backdrop-filter blend modes. Ideal for adding organic warmth to otherwise sterile digital surfaces.",
    category: "TEXTURES",
    image: IMAGES.THE_KISS,
    downloadUrl: "#",
    colors: ["#9d4edd", "#c77dff", "#e0aaff"],
  },
  {
    id: "03",
    slug: "minimalist-mockups-vol-1",
    title: "Minimalist Mockups // Vol 1",
    description:
      "Five photorealistic device mockups conceived around negative space and architectural lighting.\n\nEach mockup includes multi-angle perspectives (front, isometric, detail crop) with realistic environmental reflections and drop shadows.\n\nLayered PSDs with smart-object swap slots, pre-configured 3D light rigs, and color-grading LUTs included. The set covers laptop, tablet, phone, monitor, and a display configuration for hero section presentations.",
    category: "MOCKUPS",
    image: IMAGES.AMERICAN_GOTHIC,
    downloadUrl: "#",
    colors: ["#ee9b00", "#ca6702", "#bb3e03"],
  },
  {
    id: "04",
    slug: "motion-design-presets",
    title: "Motion Design Presets",
    description:
      "A signature After Effects preset pack engineered for the 'tech-luxe' animation aesthetic — where elastic eases meet mechanical precision.\n\nIncludes 24 animation presets (entry, exit, emphasis, and looping), 8 custom expression controllers, and a comprehensive easing curve library mapped to cubic-bezier values for direct translation to web frameworks.\n\nEach preset is documented with reference FPS targets and GPU utilization notes.",
    category: "MOTION",
    image: IMAGES.LIBERTY_LEADING,
    downloadUrl: "#",
    colors: ["#ae2012", "#9b2226", "#001219"],
  },
  {
    id: "05",
    slug: "noise-texture-toolkit",
    title: "Noise Texture Toolkit",
    description:
      "A procedural noise texture toolkit designed for 3D shader work and digital painting.\n\nContains 16 seamless 4K resolution maps spanning Perlin, Simplex, Voronoi, Fractal Brownian Motion, and custom hybrid noise types.\n\nEach map available in 8-bit and 16-bit depth, with EXR float-format variants for HDR rendering pipelines. Accompanied by a GLSL snippet library for real-time shader implementation.",
    category: "TEXTURES",
    image: IMAGES.THE_SCREAM,
    downloadUrl: "#",
    colors: ["#005f73", "#0a9396", "#94d2bd"],
  },
];
