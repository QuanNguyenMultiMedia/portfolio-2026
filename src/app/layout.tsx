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
  title: "Portfolio 2026 | Minimalist Luxury",
  description: "Personal branding space for motion, 3D, and design assets.",
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
      <body className="bg-background text-foreground min-h-full" suppressHydrationWarning>
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
