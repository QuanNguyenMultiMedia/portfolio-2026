import type { Metadata } from "next";
import { ViewTransition } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Styles
import "./globals.css";
import "../styles/riso.css";
import { display, productSans } from "./fonts";
import Fountain from "@/components/riso/Fountain";
import BlurMap from "@/components/riso/BlurMap";

// Internal Components
import GlobalSideBar from "@/components/GlobalSideBar";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import MobileNavbar from "@/components/MobileNavbar";
import MobileTopBar from "@/components/MobileTopBar";
import SmoothScroll from "@/components/SmoothScroll";
import { ThemeProvider } from "@/components/ThemeProvider";
import Portal from "@/components/Portal";
import ExitChoreographer from "@/components/ExitChoreographer";



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
    <html lang="en" className={`${display.variable} ${productSans.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="riso-paper min-h-full"
        suppressHydrationWarning
      >
        <Fountain className="page-plate" />
        <ThemeProvider>
          <LoadingScreen />
          <ExitChoreographer />
          <SmoothScroll>
              {/* isolate: inks multiply on each other, never on the page fountain (that tinted every element) */}
              <div className="relative isolate">
                <GlobalSideBar />
                <ViewTransition default="sheet">{children}</ViewTransition>
              </div>
            </SmoothScroll>
            <Portal>
              <MobileTopBar />
              <Navbar />
              <MobileNavbar />
            </Portal>
            <div className="riso-tooth" aria-hidden />
            <div className="riso-grain" aria-hidden />
            {/* display-type print stack (MainTitle.aep): Roughen Edges → Compound Blur on the BlurMap */}
            <BlurMap />
            <Analytics />
            <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
