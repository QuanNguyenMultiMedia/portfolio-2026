"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Works", path: "/works" },
  { name: "Takes", path: "/takes" },
  { name: "Play", path: "/play" },
  { name: "Freebies", path: "/freebies" },
  { name: "Contacts", path: "/contacts" },
];

export default function Navbar() {
  const pathname = usePathname();

  // Determine current directory and title for the HUD Notch
  let directory = "DIRECTORY_INDEX";
  let title = "HOME";

  if (pathname === "/") {
    title = "HOME";
  } else {
    const activeItem = navItems.find(item => item.path !== "/" && pathname.startsWith(item.path));
    if (activeItem) {
      title = activeItem.name.toUpperCase();
      
      // Special handling for dynamic routes or specific sections
      if (pathname.startsWith("/takes/")) {
        directory = "ESSAYS";
        title = pathname.split("/").pop()?.toUpperCase().replace(/-/g, "_") || title;
      } else if (pathname.startsWith("/works/")) {
        directory = "ARCHIVE";
        title = pathname.split("/").pop()?.toUpperCase().replace(/-/g, "_") || title;
      }
    }
  }

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-end w-max">
      {/* Physical HUD Notch */}
      <motion.div 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        key={pathname}
        className="bg-surface/40 backdrop-blur-md border border-primary/10 border-b-0 px-4 py-1 -mb-[1px] relative z-0 origin-bottom"
      >
        <div className="tech-label text-[7px] opacity-40 tracking-[0.4em] whitespace-nowrap">
          {directory} // {title}
        </div>
      </motion.div>

      {/* Main Navigation Bar */}
      <nav className="relative z-10 flex items-center gap-1 p-1 bg-background/95 backdrop-blur-2xl border border-primary/10 rounded-none shadow-[0_-8px_20px_-10px_rgba(0,0,0,0.15)]">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`relative px-5 py-2 text-[10px] font-mono tracking-[0.2em] uppercase transition-colors ${
                isActive ? "text-background" : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-tech-blue rounded-none -z-10"
                  transition={{ type: "tween", ease: "circOut", duration: 0.3 }}
                />
              )}
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
