"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface TechButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
}

export default function TechButton({
  children,
  onClick,
  href,
  className = "",
  variant = "primary",
}: TechButtonProps) {
  const baseStyles =
    "relative flex items-center justify-center py-6 px-12 border overflow-hidden transition-all duration-500 font-mono text-[10px] tracking-[0.4em] uppercase font-bold group";

  const variants = {
    primary: "border-primary text-foreground hover:text-background",
    secondary:
      "border-primary/20 text-foreground/60 hover:border-primary hover:text-foreground",
    ghost: "border-transparent text-foreground/40 hover:text-foreground",
  };

  const content = (
    <>
      <div
        className={`absolute inset-0 transition-transform duration-500 ease-out translate-y-full group-hover:translate-y-0 -z-10 ${variant === "primary" ? "bg-foreground" : "bg-primary/5"}`}
      />
      <span className="relative z-10">{children}</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={`${baseStyles} ${variants[variant]} ${className}`}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {content}
    </button>
  );
}
