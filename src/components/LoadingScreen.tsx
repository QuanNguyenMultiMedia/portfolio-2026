"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const statusMessages = [
    "Loading",
    "Preparing",
    "Almost There",
    "Ready",
  ];

  const currentStatus = statusMessages[Math.min(Math.floor(progress / 18), statusMessages.length - 1)];

  useEffect(() => {
    // Artificial progress to simulate loading
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 800);
          return 100;
        }
        return prev + Math.floor(Math.random() * 10) + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Central Logo Aura */}
          <div className="relative">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative w-20 h-20 z-10"
            >
              <Image
                src="/assets/Logo_Icon_Only.svg"
                alt="Logo"
                fill
                priority
                className="object-contain"
              />
            </motion.div>

            {/* Geometric Orbits */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-primary/5 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-primary/[0.03] rounded-full"
            />
          </div>

          {/* HUD Metadata & Progress */}
          <div className="absolute bottom-24 w-full max-w-[300px] px-8 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[8px] font-mono tracking-[0.3em] uppercase opacity-40">
                  {currentStatus}
                </span>
                <span className="text-[11px] font-mono text-primary font-bold">
                  {progress}%
                </span>
              </div>
              <div className="h-[1px] w-full bg-primary/10 relative overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
