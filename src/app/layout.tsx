import type { Metadata } from "next";

// Styles
import "./globals.css";

// Internal Components
import GlobalSideBar from "@/components/GlobalSideBar";
import LoadingScreen from "@/components/LoadingScreen";
import LogoMark from "@/components/LogoMark";
import Navbar from "@/components/Navbar";
import MobileNavbar from "@/components/MobileNavbar";
import MobileTopBar from "@/components/MobileTopBar";
import SmoothScroll from "@/components/SmoothScroll";
import { ThemeProvider } from "@/components/ThemeProvider";

// Analytics
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Minh Quan | Motion Design & Creative Engineering",
  description:
    "I'm Nguyen Minh Quan, a mid-level motion designer who loves to move things around. I work at the intersection of interaction design, creative engineering, and motion design. HCMC based, globally available.",
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
        <link
          rel="preload"
          href="/assets/portrait_sitting.jpg"
          as="image"
          type="image/jpeg"
        />
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
              <MobileTopBar />
              <div className="pt-9 md:pt-0">
                {children}
              </div>
              <Navbar />
              <MobileNavbar />
            </div>
          </SmoothScroll>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
