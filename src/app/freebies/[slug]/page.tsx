import { redirect } from "next/navigation";

export default function FreebiesDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  redirect("/freebies");
}
