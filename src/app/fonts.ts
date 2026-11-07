import localFont from "next/font/local";

// Riso Run type (docs/design.md §3). Display face: Junicode 2 variable (SIL OFL, src/fonts/Junicode-OFL.txt),
// from open-foundry.com/fonts/junicode. wght 300–700, full Latin incl. Vietnamese, true italic.
export const display = localFont({
  src: [
    { path: "../fonts/JunicodeVF-Roman.woff2", weight: "300 700", style: "normal" },
    { path: "../fonts/JunicodeVF-Italic.woff2", weight: "300 700", style: "italic" },
  ],
  variable: "--font-display-face",
  display: "swap",
});

export const productSans = localFont({
  src: [
    { path: "../fonts/ProductSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/ProductSans-Italic.ttf", weight: "400", style: "italic" },
    { path: "../fonts/ProductSans-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-product",
  display: "swap",
});
