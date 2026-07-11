"use client";

import { useEffect, useRef } from "react";
import { MotionValue, useMotionValueEvent } from "framer-motion";
import { useTheme } from "next-themes";

interface StarFieldProps {
  zWorld: MotionValue<number>;
  translateX: MotionValue<number>;
  translateY: MotionValue<number>;
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  className?: string;
}

interface Star {
  x: number;
  y: number;
  z: number;
  isCyan: boolean;
  prevX?: number;
  prevY?: number;
}

export default function StarField({
  zWorld,
  translateX,
  translateY,
  rotateX,
  rotateY,
  className = "",
}: StarFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Track dimensions
    let width = 0;
    let height = 0;
    let centerX = 0;
    let centerY = 0;
    let dpr = 2;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      centerX = width / 2;
      centerY = height / 2;
      dpr = Math.min(window.devicePixelRatio || 2, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      // Pre-fill background immediately after resize to prevent flashing
      ctx.fillStyle = isDark ? "#0a0a0a" : "#f5f5f5";
      ctx.fillRect(0, 0, width, height);
    };

    window.addEventListener("resize", resize);
    resize();

    // Initialize 200 sparse stars distributed along Z axis
    const numStars = 200;
    const stars: Star[] = [];
    for (let i = 0; i < numStars; i++) {
      stars.push({
        // Spread stars widely in X and Y
        x: (Math.random() - 0.5) * 4000,
        y: (Math.random() - 0.5) * 4000,
        // Distribute uniformly along the active Z depth
        z: Math.random() * 11500 - 11000, // Range: -11000 to +500
        isCyan: Math.random() < 0.2, // 20% accent tech-blue stars
        prevX: undefined,
        prevY: undefined,
      });
    }

    let isIntersecting = false;
    let isVisible = true;
    let animationFrameId: number;

    const render = () => {
      if (!isIntersecting || !isVisible) return;

      // Direct high-performance polling of MotionValues via .get() to bypass React diffing
      const zVal = zWorld.get();
      const tX = translateX.get();
      const tY = translateY.get();
      const rX = rotateX.get();
      const rY = rotateY.get();

      // Convert rotation from degrees to radians
      const radX = (rX * Math.PI) / 180;
      const radY = (rY * Math.PI) / 180;

      const cosX = Math.cos(radX);
      const sinX = Math.sin(radX);
      const cosY = Math.cos(radY);
      const sinY = Math.sin(radY);

      // Apply semi-transparent clear overlay for cinematic motion trail/blur
      ctx.fillStyle = isDark ? "rgba(10, 10, 10, 0.18)" : "rgba(245, 245, 245, 0.18)";
      ctx.fillRect(0, 0, width, height);

      // Render all stars
      const focus = 1000;

      for (let i = 0; i < numStars; i++) {
        const star = stars[i];

        // 1. Calculate relative positions (applying camera translations)
        const rx = star.x + tX;
        const ry = star.y + tY;
        let rz = star.z + zVal;

        let wrapped = false;
        // Z-axis infinite wrapping
        if (rz > 200) {
          star.z = -11000 - zVal;
          rz = -11000;
          wrapped = true;
        } else if (rz < -11000) {
          star.z = 200 - zVal;
          rz = 200;
          wrapped = true;
        }

        // 2. Rotate coordinates to match camera tilt (around center origin)
        // Rotate around Y axis
        const xY = rx * cosY + rz * sinY;
        const zY = -rx * sinY + rz * cosY;

        // Rotate around X axis
        const yX = ry * cosX - zY * sinX;
        const zX = ry * sinX + zY * cosX;

        // Camera is looking down negative Z-axis, so zX should be negative
        if (zX >= 0) {
          star.prevX = undefined;
          star.prevY = undefined;
          continue;
        }

        // 3. Perspective Projection
        const scale = focus / -zX;
        const xProj = xY * scale + centerX;
        const yProj = yX * scale + centerY;

        // Skip if way off screen
        const padding = 100;
        if (xProj < -padding || xProj > width + padding || yProj < -padding || yProj > height + padding) {
          star.prevX = undefined;
          star.prevY = undefined;
          continue;
        }

        // 4. Calculate Depth-Based Scaling
        const size = Math.max(0.3, Math.min(2.5, 1.2 * scale));

        // Fade out at far depths (fog)
        const distFactor = 1 - -zX / 11000;
        // Fade out when very close to camera to avoid sudden clipping pop-outs
        const nearFade = Math.max(0, Math.min(1, (-zX - 50) / 150));
        
        const opacity = Math.max(0, Math.min(0.4, 0.45 * distFactor * nearFade));

        if (opacity <= 0.01) {
          star.prevX = undefined;
          star.prevY = undefined;
          continue;
        }

        // Get Star Color
        let colorStr = "";
        if (isDark) {
          colorStr = star.isCyan
            ? `rgba(0, 160, 255, ${opacity * 1.2})` // slightly brighter cyan
            : `rgba(255, 255, 255, ${opacity})`;
        } else {
          colorStr = star.isCyan
            ? `rgba(0, 41, 255, ${opacity * 1.2})` // tech-blue in light mode
            : `rgba(17, 17, 17, ${opacity * 0.8})`; // soft gray
        }

        // 5. Draw: Use line connection for continuous trails if moving fast, or dot if wrapped/first-frame
        let drawLine = false;
        if (star.prevX !== undefined && star.prevY !== undefined && !wrapped) {
          const dx = xProj - star.prevX;
          const dy = yProj - star.prevY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 300) {
            drawLine = true;
          }
        }

        if (drawLine && star.prevX !== undefined && star.prevY !== undefined) {
          ctx.beginPath();
          ctx.moveTo(star.prevX, star.prevY);
          ctx.lineTo(xProj, yProj);
          ctx.strokeStyle = colorStr;
          ctx.lineWidth = size * 2;
          ctx.lineCap = "round";
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(xProj, yProj, size, 0, Math.PI * 2);
          ctx.fillStyle = colorStr;
          ctx.fill();
        }

        // Cache current positions
        star.prevX = xProj;
        star.prevY = yProj;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === "visible";
      if (isVisible && isIntersecting) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasIntersecting = isIntersecting;
        isIntersecting = entry.isIntersecting;
        if (isIntersecting && !wasIntersecting && isVisible) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.01 }
    );
    observer.observe(canvas);

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark, zWorld, translateX, translateY, rotateX, rotateY]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ mixBlendMode: "normal" }}
    />
  );
}
