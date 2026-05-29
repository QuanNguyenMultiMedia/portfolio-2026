import { IMAGES } from "./images";

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
      "Diving into custom GLSL shaders, GPU pipeline architecture, and the discipline required to achieve 120 FPS in the browser.",
    topic: "WEBGL",
    colors: ["#ef4444", "#3b82f6", "#8b5cf6"],
    image: IMAGES.WANDERER,
    content:
      "WebGL represents the rawest form of web graphics, stripping away the comfort of higher-level abstractions. When we write custom GLSL shaders, we're not just drawing pixels; we're orchestrating the GPU at a fundamental level. \n\nThe architecture of a custom rendering pipeline requires strict discipline: managing vertex attributes, organizing uniform data, and optimizing draw calls. It's an environment where mathematical precision directly translates to visual fidelity.\n\nOne critical insight I've gathered through iterative profiling is that the bottleneck is almost never the fragment shader — it's the vertex count and the number of draw calls. Instanced rendering, frustum culling, and LOD stratification are not optional optimizations; they're foundational architectural decisions. A scene that runs at 18 FPS without culling can easily hit 120 FPS once you respect the hardware's memory hierarchy.",
  },
  {
    title: "ThreeJS: Abstraction vs Control",
    slug: "threejs-abstraction-control",
    date: "May 2026",
    excerpt:
      "Finding the sweet spot between Three.js ergonomics and raw WebGL control for production-grade 3D experiences.",
    topic: "THREEJS",
    colors: ["#10b981", "#3b82f6", "#06b6d4"],
    image: IMAGES.STARRY_NIGHT,
    content:
      "Three.js is a marvel of software engineering, providing a robust scene graph that shields developers from the complexities of raw WebGL. However, true mastery of the library involves knowing when to break out of that abstraction.\n\nWhether it's writing custom ShaderMaterials, instanced rendering for particle systems, or managing geometry disposal to prevent memory leaks, the sweet spot lies at the intersection of high-level ease and low-level control.\n\nThe default renderer pipeline in Three.js is generously feature-rich, but it comes at a cost. For a recent particle-heavy project, switching from MeshStandardMaterial to a custom ShaderMaterial with manual UV management reduced draw calls by 60% and dropped frame-time variance from 14ms to a stable 4ms. The abstraction tax is real, and knowing when to bypass it separates production-quality work from prototypes.",
  },
  {
    title: "The Canvas as a Canvas",
    slug: "html-on-canvas",
    date: "April 2026",
    excerpt:
      "Revisiting the HTML5 Canvas API as an immediacy-driven tool for generative art and pixel-level manipulation.",
    topic: "CANVAS",
    colors: ["#f59e0b", "#f97316", "#ef4444"],
    image: IMAGES.GREAT_WAVE,
    content:
      "Before WebGL became ubiquitous, the HTML5 2D Canvas was the primary playground for web experimentation. Even today, its sheer simplicity and immediate mode rendering model make it incredibly powerful for certain types of visual work.\n\nBy manipulating pixel arrays directly (ImageData), we can achieve classic demoscene effects, custom cellular automata, or intricate generative art without the overhead of a 3D context.\n\nWhat fascinates me about the Canvas API is its brutally procedural nature. There is no scene graph, no retained mode, no automatic dirty-checking. You issue drawing commands, the pixels render, and the buffer is cleared. This forces a mindset of explicit state management — every stroke, fill, and transformation must be re-issued each frame. It's akin to working with a physical sketchpad: the immediacy is both the constraint and the liberation.",
  },
  {
    title: "Retype: The Art of Digital Typography",
    slug: "retype-digital-typography",
    date: "March 2026",
    excerpt:
      "Kinetic typography as an architectural discipline — where letterforms become structural and pacing becomes narrative.",
    topic: "RETYPE",
    colors: ["#171717", "#737373", "#e5e5e5"],
    image: IMAGES.TOWER_OF_BABEL,
    content:
      "Typography in the digital realm is no longer static. It breathes, reacts, and shifts. Kinetic typography isn't merely about adding motion; it's about adding meaning through pacing, weight shifts, and structural transitions.\n\nWhen we treat letters as architectural elements rather than just semantic vessels, the entire interface transforms from a readable document into an experiential space.\n\nA well-designed kinetic type system considers three axes: temporal hierarchy (when does each element enter?), spatial anchoring (where does it sit in the Z-layout?), and weight dynamics (how does font-weight map to emphasis over time?). I've found that mapping CSS font-variation-settings to scroll progress creates some of the most tasteful transitions — a variable font that moves from Hairline (100) to Black (900) as the user descends a narrative feels less like animation and more like reading depth.",
  },
  {
    title: "Motion Systems with Cavalry",
    slug: "motion-design-cavalry",
    date: "February 2026",
    excerpt:
      "Node-based procedural animation workflows that bridge the gap between motion design and production code.",
    topic: "CAVALRY",
    colors: ["#ec4899", "#d946ef", "#8b5cf6"],
    image: IMAGES.COMPOSITION_8,
    content:
      "Cavalry represents a paradigm shift in 2D motion design, moving away from purely linear timelines towards procedural, node-based systems. This approach aligns perfectly with how developers think about UI architecture.\n\nBy building reusable animation rigs and data-driven behaviors, we can bridge the gap between motion prototypes and actual implementation, ensuring that the final coded interface faithfully replicates the original design intent.\n\nThe real power of Cavalry lies in its data-binding capabilities. Instead of hand-animating each state, you wire your geometry to CSV exports, JSON schemas, or live APIs. For a recent data-visualization project, I piped real-time analytics into Cavalry's node graph, which drove 200+ individual shape layers without a single keyframe. The output was then exported as a Lottie JSON and rendered in-browser via react-lottie — a fully procedural pipeline from data to pixel.",
  },
  {
    title: "The Architecture of Motion",
    slug: "architecture-of-motion",
    date: "January 2026",
    excerpt:
      "How the physics of transition design shapes user perception in premium digital experiences.",
    topic: "MOTION",
    colors: ["#eab308", "#14b8a6", "#f43f5e"],
    image: IMAGES.NIGHT_WATCH,
    content:
      "Movement is not merely the displacement of matter through space; it is the dialogue between stability and intent. In the realm of digital orchestration, every transition carries the weight of structural logic.\n\nWhen we build interfaces that feel premium, we are essentially building environments that respect the laws of physics, even if those physics are simulated. The way a menu slides into view or a 3D asset responds to scroll is a testament to the architecture of that digital space.\n\nI've spent considerable time refining spring-based animation systems — specifically the relationship between damping, stiffness, and mass in a critically-damped versus under-damped system. A subtle 5% overshoot on a button press communicates tactile feedback without crossing into cartoonish territory. The difference between an ease-out that feels \"right\" and one that feels \"close\" often comes down to a single decimal point in the spring constant. Motion design at this level is indistinguishable from engineering.",
  },
];
