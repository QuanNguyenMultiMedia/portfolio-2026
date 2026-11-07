import { notFound } from "next/navigation";
import BuilderClient from "./BuilderClient";

// Dev-only route: the server guard 404s it in production before any client code renders.
export default function WorksBuilderPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return <BuilderClient />;
}
