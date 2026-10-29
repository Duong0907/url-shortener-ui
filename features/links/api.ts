import { authedFetch } from "@/features/auth/authed-fetch";
import type { LinkResponse } from "@/features/shorten/api";

export type LinkList = { items: LinkResponse[]; nextCursor: string | null };

export const PAGE_SIZE = 10;

// Newest first. Pass the previous nextCursor to get the links after it.
export async function listLinks(cursor?: string): Promise<LinkList> {
  const params = new URLSearchParams({ limit: String(PAGE_SIZE) });
  if (cursor) params.set("cursor", cursor);

  let res: Response;
  try {
    res = await authedFetch(`/api/links?${params}`);
  } catch {
    throw new Error("Can't reach server");
  }

  if (!res.ok) throw new Error("Something went wrong. Try again");
  return res.json();
}
