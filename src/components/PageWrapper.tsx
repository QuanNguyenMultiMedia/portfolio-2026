"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

export interface PageWrapperProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "hero" | "full";
}

export default function PageWrapper({ 
  children, 
  className = "", 
  variant = "default" 
}: PageWrapperProps) {
  
  // variant "hero" is for the non-scrolling home page
  // variant "default" is for standard content pages
  // variant "full" is for edge-to-edge content
  
  const baseStyles = variant === "hero" 
    ? "h-screen w-full overflow-hidden relative" 
    : "min-h-screen relative";
    
  const paddingStyles = variant === "default" 
    ? "pt-32 md:pt-40 pb-32 px-8 md:px-24 max-w-screen-2xl mx-auto" 
    : variant === "full" 
      ? "pt-32 md:pt-40 pb-32 px-0"
      : "p-0"; // Hero handles its own internal layout usually

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
      className={`${baseStyles} ${className}`}
    >
      <div className={paddingStyles}>
        {children}
      </div>
    </motion.main>
  );
}
