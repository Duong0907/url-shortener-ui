import type { LinkResponse } from "@/features/shorten/api";

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

// Rows arrive newest first, so equal days sit next to each other.
export function byDay(links: LinkResponse[]) {
  const groups: { day: string; links: LinkResponse[] }[] = [];
  for (const link of links) {
    const day = new Date(link.createdAt).toDateString();
    const last = groups.at(-1);

    if (last?.day === day) last.links.push(link);
    else groups.push({ day, links: [link] });
  }
  return groups;
}

export function dayLabel(day: string) {
  const today = new Date();

  if (day === today.toDateString()) return "Today";
  today.setDate(today.getDate() - 1);

  if (day === today.toDateString()) return "Yesterday";
  return fmtDate(day);
}

// "https://www.site.com/a?b" -> ["site.com", "/a?b"]. Unparsable URLs show whole.
export function splitTarget(url: string) {
  try {
    const u = new URL(url);
    const rest = u.pathname + u.search + u.hash;

    return [u.host.replace(/^www\./, ""), rest === "/" ? "" : rest];
  } catch {
    return [url, ""];
  }
}
