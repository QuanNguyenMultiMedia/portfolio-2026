import type { Metadata } from "next";

// Styles
import "./globals.css";

// Internal Components
import GlobalSideBar from "@/components/GlobalSideBar";
import LoadingScreen from "@/components/LoadingScreen";
import LogoMark from "@/components/LogoMark";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Minh Quan | Motion Design & Creative Engineering",
  description:
    "Portfolio of Minh Quan — Midweight Motion Designer exploring the intersection of cinematic motion, 3D engineering, and editorial design. Ho Chi Minh City based, globally available.",
  keywords: [
    "Motion Design",
    "WebGL",
    "Three.js",
    "Creative Developer",
    "UI Animation",
    "Branding",
    "Minh Quan",
  ],
  openGraph: {
    title: "Minh Quan | Motion Design & Creative Engineering",
    description:
      "Cinematic motion, 3D engineering, and editorial design portfolio.",
    url: "https://portfolio-2026.vercel.app",
    siteName: "Minh Quan Portfolio",
    type: "website",
  },
  icons: {
    icon: "/assets/favicon white.png",
    apple: "/assets/favicon white.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var m = localStorage.getItem('next-themes') || 'system';
                var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (m === 'dark' || (m === 'system' && d)) {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            })();
          `,
        }} />
      </head>
      <body
        className="bg-background text-foreground min-h-full"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <LoadingScreen />
          <SmoothScroll>
            <div className="relative">
              <LogoMark />
              <GlobalSideBar />
              {children}
              <Navbar />
            </div>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
