"use client";

import { motion } from "framer-motion";
import HUDLabel from "./HUDLabel";
import { t } from "@/lib/designSystem";

interface SectionHeaderProps {
  directory: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionHeader({
  directory,
  title,
  subtitle,
  className = "",
}: SectionHeaderProps) {
  return (
    <header className={`mb-20 md:mb-28 3xl:mb-36 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col gap-4"
      >
        <HUDLabel text={directory} />
        <h1 className={t.h1}>
          {title}
          {subtitle && (
            <>
              <br />
              <span className="italic opacity-30">{subtitle}</span>
            </>
          )}
        </h1>
      </motion.div>
    </header>
  );
}
