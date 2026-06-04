import { notFound } from "next/navigation";
import DesignSystemVisualizer from "./visualizer";

export default function DesignSystemPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return <DesignSystemVisualizer />;
}
