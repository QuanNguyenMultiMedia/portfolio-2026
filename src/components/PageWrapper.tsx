"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

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
      ? "pt-32 md:pt-40 pb-32 px-8 md:px-24 max-w-screen-2xl 3xl:max-w-[1720px] 3xl:px-32 4xl:max-w-[2200px] 4xl:px-48 mx-auto"
      : variant === "full"
        ? "pt-32 md:pt-40 pb-32 px-0"
        : "p-0"; // Hero and Story handle their own internal layout/padding

  const isStory = variant === "story";

  const perspectiveStyle = !isStory ? { perspective: "1200px" as const, transformStyle: "preserve-3d" as const } : {};

  const contentStyle = !isStory ? { transform: "translateZ(-200px)" as const } : {};

  const initialProps = isStory
    ? { opacity: 0 }
    : { opacity: 0, y: 16, scale: 0.99, filter: "blur(8px)" };

  const animateProps = isStory
    ? { opacity: 1 }
    : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" };

  const styleProps = isStory
    ? { willChange: "opacity" }
    : { willChange: "transform, opacity, filter" };

  return (
    <motion.main
      initial={initialProps}
      animate={animateProps}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      style={{ ...styleProps, ...perspectiveStyle }}
      className={`${baseStyles} ${className}`}
    >
      <div className={paddingStyles} style={contentStyle}>{children}</div>
    </motion.main>
  );
}
