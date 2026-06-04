import { notFound } from "next/navigation";

export default function DesignSystemPage() {
  // Always return not found in production
  notFound();
  return null;
}
