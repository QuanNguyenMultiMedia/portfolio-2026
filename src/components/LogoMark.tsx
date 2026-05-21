"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface LogoMarkProps {
  variant?: "default" | "inverted" | "auto";
  className?: string;
}

export default function LogoMark({
  variant = "auto",
  className = "",
}: LogoMarkProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine logo source
  // auto: reacts to theme
  // default: forced light mode (black logo)
  // inverted: forced dark mode (white logo)

  let logoSrc = "/assets/Logo_Full_LightMode.svg";

  if (mounted) {
    if (variant === "auto") {
      logoSrc =
        resolvedTheme === "dark"
          ? "/assets/Logo_Full_DarkMode.svg"
          : "/assets/Logo_Full_LightMode.svg";
    } else if (variant === "inverted") {
      logoSrc = "/assets/Logo_Full_DarkMode.svg";
    } else {
      logoSrc = "/assets/Logo_Full_LightMode.svg";
    }
  }

  const isDefault = variant === "default" || variant === "auto";

  return (
    <motion.div
      initial={isDefault ? { opacity: 0, y: -10 } : false}
      animate={isDefault ? { opacity: 1, y: 0 } : false}
      transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
      className={`fixed top-16 right-16 md:top-24 md:right-24 z-[60] hidden md:block ${className}`}
    >
      <Link href="/" className="group flex items-center">
        <div className="relative w-32 h-16 overflow-hidden">
          <Image
            src={logoSrc}
            alt="Minh Quan Logo"
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-700"
          />
        </div>
      </Link>
    </motion.div>
  );
}
