import { ReactNode } from "react";

// Page shell: the <main> landmark, the page's padding variant, and its entrance. The entrance is CSS (riso.css
// .page-in / .page-in-fade, the house curve over 850ms), so a page paints and reads on first frame without waiting
// for hydration; it stays a Server Component and adds no client JS.
export interface PageWrapperProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "hero" | "full" | "story";
}

export default function PageWrapper({
  children,
  className = "",
  variant = "default",
}: PageWrapperProps) {
  // variant "hero" is for the non-scrolling home page
  // variant "default" is for standard content pages
  // variant "full" is for edge-to-edge content
  // variant "story" is for the scroll-based storytelling homepage

  const baseStyles =
    variant === "hero"
      ? "h-screen w-full overflow-hidden relative"
      : "min-h-screen relative";

  const paddingStyles =
    variant === "default"
      ? "pt-28 pb-32 px-6 md:pt-36 md:pb-28 md:px-16 max-w-screen-xl 3xl:max-w-[1500px] 3xl:px-24 4xl:max-w-[1800px] 4xl:px-32 mx-auto"
      : variant === "full"
        ? "pt-28 pb-32 px-0 md:pt-36 md:pb-28"
        : "p-0"; // Hero and Story handle their own internal layout/padding

  const entrance = variant === "story" ? "page-in-fade" : "page-in";

  return (
    <main className={`${baseStyles} ${entrance} ${className}`}>
      <div className={paddingStyles}>
        {children}
      </div>
    </main>
  );
}
