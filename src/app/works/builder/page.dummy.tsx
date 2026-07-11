import { notFound } from "next/navigation";

export default function WorksBuilderPage() {
  // Always return not found in production
  notFound();
  return null;
}
