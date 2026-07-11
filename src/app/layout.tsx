import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";

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
import Portal from "@/components/Portal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});


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
  alternates: {
    canonical: "https://minhquan.works",
  },
  openGraph: {
    title: "Minh Quan | Motion Design & Creative Engineering",
    description:
      "Cinematic motion, 3D engineering, and editorial design portfolio.",
    url: "https://minhquan.works",
    siteName: "Minh Quan Portfolio",
    type: "website",
  },
  icons: {
    icon: "/assets/favicon white.png",
    apple: "/assets/favicon white.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Nguyen Minh Quan",
  "alternateName": "Minh Quan",
  "url": "https://minhquan.works",
  "image": "https://minhquan.works/assets/portrait_sitting.jpg",
  "jobTitle": "Motion Designer & Creative Engineer",
  "knowsAbout": [
    "Motion Design",
    "WebGL",
    "Three.js",
    "Creative Developer",
    "UI Animation",
    "Branding",
    "Interaction Design"
  ],
  "sameAs": [
    "https://www.linkedin.com/in/quannguyenhere/",
    "https://github.com/quannguyenhere"
  ],
  "worksFor": {
    "@type": "Organization",
    "name": "Herond Labs"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full antialiased`} suppressHydrationWarning>
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
              </div>
            </SmoothScroll>
            <Portal>
              <MobileTopBar />
              <Navbar />
              <MobileNavbar />
            </Portal>
        </ThemeProvider>
      </body>
    </html>
  );
}
