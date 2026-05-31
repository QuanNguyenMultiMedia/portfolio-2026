import { redirect } from "next/navigation";
import { freebies } from "@/data/freebies";

export async function generateStaticParams() {
  return freebies.map((f) => ({
    slug: f.slug,
  }));
}

export default function FreebiesDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  redirect("/freebies");
}
