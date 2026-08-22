import type { View } from "./types";

/** Maps each app view to its real route, and back — single source of truth for navigation. */
export const VIEW_PATH: Record<View, string> = {
  dashboard: "/",
  map: "/mapa",
  catalog: "/catalogo",
  practice: "/practicar",
  architectures: "/arquitecturas",
};

export function viewFromPathname(pathname: string): View {
  if (pathname.startsWith("/mapa")) return "map";
  if (pathname.startsWith("/catalogo")) return "catalog";
  if (pathname.startsWith("/practicar")) return "practice";
  if (pathname.startsWith("/arquitecturas")) return "architectures";
  return "dashboard";
}
