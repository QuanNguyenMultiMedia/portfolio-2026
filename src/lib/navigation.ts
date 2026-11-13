export const NAV_ITEMS = [
  { name: "Home", path: "/" },
  { name: "Works", path: "/works" },
  { name: "Garden", path: "/garden" },
  { name: "Contacts", path: "/contacts" },
];

/** The route's label, set in italic on the sidebar's ink block (and the phone strip). */
export function routeTopic(pathname: string): string {
  const seg = pathname.split("/").filter(Boolean)[0];
  if (!seg) return "HOME";
  return NAV_ITEMS.some((n) => n.path === `/${seg}`) ? seg.toUpperCase() : "";
}
