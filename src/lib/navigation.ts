export const NAV_ITEMS = [
  { name: "Home", path: "/" },
  { name: "Works", path: "/works" },
  { name: "Takes", path: "/takes" },
  { name: "Play", path: "/play" },
  { name: "Freebies", path: "/freebies" },
  { name: "Contacts", path: "/contacts" },
];

export function getBreadcrumb(pathname: string): { directory: string; title: string } {
  const directory = "MINHQUAN";
  let title = "HOME";

  if (pathname === "/") {
    title = "HOME";
  } else {
    const activeItem = NAV_ITEMS.find(
      (item) => item.path !== "/" && pathname.startsWith(item.path)
    );
    if (activeItem) {
      const section = activeItem.name.toUpperCase();
      const segments = pathname.split("/").filter(Boolean);
      if (segments.length > 1) {
        const slug = segments[1].toUpperCase().replace(/-/g, "_");
        title = `${section} // ${slug}`;
      } else {
        title = section;
      }
    }
  }

  return { directory, title };
}

export interface PathColors {
  colors: string[];
  topic: string;
}

export function getPathColors(pathname: string): PathColors {
  const segments = pathname.split("/").filter(Boolean);
  const defaults: PathColors = { colors: ["#005f73", "#0a9396", "#94d2bd"], topic: "" };

  if (pathname === "/") return { colors: ["#1e3a8a", "#1e40af", "#3b82f6"], topic: "HOME" };
  if (segments[0] === "works") return { colors: ["#ca6702", "#ee9b00", "#e9d8a6"], topic: "WORKS" };
  if (segments[0] === "takes") return { colors: ["#4c1d95", "#6d28d9", "#8b5cf6"], topic: "TAKES" };
  if (segments[0] === "freebies") return { colors: ["#005f73", "#0a9396", "#94d2bd"], topic: "FREEBIES" };
  if (segments[0] === "play") return { colors: ["#ca6702", "#bb3e03", "#ae2012"], topic: "PLAY" };
  if (segments[0] === "contacts") return { colors: ["#333333", "#444444", "#555555"], topic: "CONTACTS" };

  return defaults;
}
