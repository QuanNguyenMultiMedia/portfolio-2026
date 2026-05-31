"use client";

import React from "react";
import { motion, MotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientTextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps> {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
}

export function GradientText({
  className,
  children,
  as: Component = "span",
  ...props
}: GradientTextProps) {
  const MotionComponent = motion.create(Component);

  return (
    <MotionComponent
      className={cn(
        "relative inline-block text-transparent bg-clip-text bg-[linear-gradient(90deg,var(--tech-blue),#3b82f6,#1d4ed8,var(--tech-blue))] bg-[length:200%_auto] animate-[gradient-shift_5s_linear_infinite] font-bold",
        className
      )}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}
