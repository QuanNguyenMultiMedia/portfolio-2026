"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

interface LogoMarkProps {
  variant?: "default" | "inverted" | "auto";
  className?: string;
  animate?: boolean;
  fixed?: boolean;
}

export default function LogoMark({
  variant = "auto",
  className = "",
  animate = true,
  fixed = true,
}: LogoMarkProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDefault = variant === "default" || variant === "auto";
  const shouldAnimate = animate && isDefault;

  const logoSrc =
    variant === "auto"
      ? mounted && resolvedTheme === "dark"
        ? "/assets/Logo_Full_DarkMode.svg"
        : "/assets/Logo_Full_LightMode.svg"
      : variant === "inverted"
        ? "/assets/Logo_Full_DarkMode.svg"
        : "/assets/Logo_Full_LightMode.svg";

  const content = (
    <Link href="/" className="group flex items-center w-full h-full">
      <div className="relative w-full h-full min-w-[60px] overflow-hidden">
        {mounted ? (
          <Image
            src={logoSrc}
            alt="Minh Quan Logo"
            fill
            priority
            className="object-contain group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full" />
        )}
      </div>
    </Link>
  );

  const containerClasses = fixed
    ? `fixed top-16 right-16 md:top-24 md:right-24 z-[60] hidden md:block ${className}`
    : className;

  if (!animate) {
    return (
      <div className={containerClasses}>
        {content}
      </div>
    );
  }

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
      animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
      className={containerClasses}
    >
      {content}
    </motion.div>
  );
}
