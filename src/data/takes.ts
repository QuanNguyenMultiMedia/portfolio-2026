export interface Take {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  topic: string;
  colors: string[];
  image: string;
  content: string;
}

export const takes: Take[] = [
  {
    title: "Mastering the WebGL Pipeline",
    slug: "mastering-webgl-pipeline",
    date: "June 2026",
    excerpt:
      "Diving deep into custom shaders and rendering pipelines for high-performance web graphics.",
    topic: "WEBGL",
    colors: ["#ef4444", "#3b82f6", "#8b5cf6"], // Red, Blue, Purple
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1024px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
    content:
      "WebGL represents the rawest form of web graphics, stripping away the comfort of higher-level abstractions. When we write custom GLSL shaders, we're not just drawing pixels; we're orchestrating the GPU at a fundamental level. \n\nThe architecture of a custom rendering pipeline requires strict discipline: managing vertex attributes, organizing uniform data, and optimizing draw calls. It's an environment where mathematical precision directly translates to visual fidelity.",
  },
  {
    title: "ThreeJS: Abstraction vs Control",
    slug: "threejs-abstraction-control",
    date: "May 2026",
    excerpt:
      "Balancing the ease of Three.js abstractions with the need for low-level performance tuning.",
    topic: "THREEJS",
    colors: ["#10b981", "#3b82f6", "#06b6d4"], // Green, Blue, Cyan
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/The_Great_Wave_off_Kanagawa.jpg/1024px-The_Great_Wave_off_Kanagawa.jpg",
    content:
      "Three.js is a marvel of software engineering, providing a robust scene graph that shields developers from the complexities of raw WebGL. However, true mastery of the library involves knowing when to break out of that abstraction.\n\nWhether it's writing custom ShaderMaterials, instanced rendering for particle systems, or managing geometry disposal to prevent memory leaks, the sweet spot lies at the intersection of high-level ease and low-level control.",
  },
  {
    title: "The Canvas as a Canvas",
    slug: "html-on-canvas",
    date: "April 2026",
    excerpt:
      "Pushing the boundaries of the 2D HTML Canvas API for performant visual experiments.",
    topic: "CANVAS",
    colors: ["#f59e0b", "#f97316", "#ef4444"], // Yellow, Orange, Red
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg/1024px-Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg",
    content:
      "Before WebGL became ubiquitous, the HTML5 2D Canvas was the primary playground for web experimentation. Even today, its sheer simplicity and immediate mode rendering model make it incredibly powerful for certain types of visual work.\n\nBy manipulating pixel arrays directly (ImageData), we can achieve classic demoscene effects, custom cellular automata, or intricate generative art without the overhead of a 3D context.",
  },
  {
    title: "Retype: The Art of Digital Typography",
    slug: "retype-digital-typography",
    date: "March 2026",
    excerpt:
      "Analyzing the structural importance of kinetic typography in modern editorial design.",
    topic: "RETYPE",
    colors: ["#171717", "#737373", "#e5e5e5"], // Black, Gray, Light Gray
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/1024px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg",
    content:
      "Typography in the digital realm is no longer static. It breathes, reacts, and shifts. Kinetic typography isn't merely about adding motion; it's about adding meaning through pacing, weight shifts, and structural transitions.\n\nWhen we treat letters as architectural elements rather than just semantic vessels, the entire interface transforms from a readable document into an experiential space.",
  },
  {
    title: "Motion Systems with Cavalry",
    slug: "motion-design-cavalry",
    date: "February 2026",
    excerpt:
      "Procedural animation and node-based motion design workflows for scalable UI patterns.",
    topic: "CAVALRY",
    colors: ["#ec4899", "#d946ef", "#8b5cf6"], // Pink, Fuchsia, Purple
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Vassily_Kandinsky%2C_1923_-_Composition_8%2C_huile_sur_toile%2C_140_cm_x_201_cm%2C_Mus%C3%A9e_Guggenheim%2C_New_York.jpg/1024px-Vassily_Kandinsky%2C_1923_-_Composition_8%2C_huile_sur_toile%2C_140_cm_x_201_cm%2C_Mus%C3%A9e_Guggenheim%2C_New_York.jpg",
    content:
      "Cavalry represents a paradigm shift in 2D motion design, moving away from purely linear timelines towards procedural, node-based systems. This approach aligns perfectly with how developers think about UI architecture.\n\nBy building reusable animation rigs and data-driven behaviors, we can bridge the gap between motion prototypes and actual implementation, ensuring that the final coded interface faithfully replicates the original design intent.",
  },
  {
    title: "The Architecture of Motion",
    slug: "architecture-of-motion",
    date: "January 2026",
    excerpt:
      "Exploring the silent relationship between structural stability and dynamic movement.",
    topic: "MOTION",
    colors: ["#eab308", "#14b8a6", "#f43f5e"], // Yellow, Teal, Rose
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Monet_-_Impression%2C_Sunrise.jpg/1024px-Monet_-_Impression%2C_Sunrise.jpg",
    content:
      "Movement is not merely the displacement of matter through space; it is the dialogue between stability and intent. In the realm of digital orchestration, every transition carries the weight of structural logic.\n\nWhen we build interfaces that feel premium, we are essentially building environments that respect the laws of physics, even if those physics are simulated. The way a menu slides into view or a 3D asset responds to scroll is a testament to the architecture of that digital space.",
  },
];
