import { notFound } from "next/navigation";
import DesignSystemVisualizer from "./visualizer";

// Dev-only route: the server guard 404s it in production before any client code renders.
export default function DesignSystemPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return <DesignSystemVisualizer />;
}
