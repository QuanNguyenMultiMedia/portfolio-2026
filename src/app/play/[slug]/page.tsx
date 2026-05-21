"use client";

import { use, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import WaveGradientBar from "@/components/WaveGradientBar";
import { playItems } from "@/data/play";
import { notFound } from "next/navigation";

export default function PlayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [isHovered, setIsHovered] = useState(false);
  
  const project = playItems.find(p => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="bg-background h-screen w-full overflow-hidden relative flex items-center justify-center font-serif text-foreground selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      
      {/* Back Button */}
      <div className="absolute top-16 left-16 md:top-24 md:left-24 z-50 pointer-events-auto">
        <Link 
          href="/play"
          className="group flex items-center gap-4 py-2"
        >
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 border border-foreground/20 group-hover:border-foreground/60 transition-colors" />
            <span className="text-[10px] font-sans group-hover:-translate-x-1 transition-transform">←</span>
          </div>
          <span className="text-[10px] font-sans tracking-[0.4em] uppercase opacity-40 group-hover:opacity-100 transition-opacity">
            Return_Archive
          </span>
        </Link>
      </div>

      <WaveGradientBar colors={project.colors} topic="PLAY" />

      {/* Main Screen Area - Reduced size to clear logo */}
      <div 
        className="relative w-[70vw] h-[70vh] mt-16 md:mt-12 flex flex-col z-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        
        {/* Top Right Notch - Animates down (recedes) on hover */}
        <motion.div 
          initial={false}
          animate={{ 
            y: isHovered ? 40 : 0,
            opacity: isHovered ? 0 : 1
          }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="absolute bottom-full right-0 border-t border-l border-r border-foreground/20 px-4 py-2 bg-background flex items-center justify-center z-0 translate-y-[1px]"
        >
          <span className="text-[9px] md:text-[10px] font-sans tracking-[0.2em] uppercase opacity-80">
            {project.title}
          </span>
        </motion.div>
        
        {/* Frame Content - The "Playing" area */}
        <div className="relative w-full h-full bg-background overflow-hidden border border-foreground/20 z-10 group">
          <iframe 
            src={project.url}
            title={project.title}
            className="absolute inset-0 w-full h-full border-0 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 z-10"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          {/* Fallback Placeholder during load */}
          <img 
            src={project.src} 
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-20 z-0"
          />
        </div>
        
      </div>


    </div>
  );
}
