// Framer's full feature set (animation, gestures, drag, layout), split off the first load: LazyMotion
// (ThemeProvider) fetches it after hydration, and the `m` components animate once it lands.
export { domMax as default } from "framer-motion";
