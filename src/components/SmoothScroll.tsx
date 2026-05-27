"use client";

import useLenis from "@/hooks/useLenis";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useLenis({ scrollToTopOnRouteChange: true });

  return <>{children}</>;
}
