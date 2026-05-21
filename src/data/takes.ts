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
    image: "/projects/gom-men.png",
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
    image: "/projects/mo-lam-ma.png",
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
    image: "/projects/squarepeg.png",
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
    image: "/projects/vietnam-forest-1.jpg",
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
    image: "/projects/gom-men.png",
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
    image: "/projects/mo-lam-ma.png",
    content:
      "Movement is not merely the displacement of matter through space; it is the dialogue between stability and intent. In the realm of digital orchestration, every transition carries the weight of structural logic.\n\nWhen we build interfaces that feel premium, we are essentially building environments that respect the laws of physics, even if those physics are simulated. The way a menu slides into view or a 3D asset responds to scroll is a testament to the architecture of that digital space.",
  },
];
