"use client";
// Marks every [data-reg] element `.is-in` when it reaches the viewport, so its plates
// settle into register (CSS in styles/riso.css). One observer for the page.
import { useEffect } from "react";

export default function RegisterObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    document.querySelectorAll("[data-reg]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
