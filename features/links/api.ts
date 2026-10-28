import { authedFetch } from "@/features/auth/authed-fetch";
import type { LinkResponse } from "@/features/shorten/api";

export type LinkPage = {
  content: LinkResponse[];
  page: { size: number; number: number; totalElements: number; totalPages: number };
};

export const PAGE_SIZE = 10;

// page counts from 0, as the API does. The API sorts newest first.
export async function listLinks(page: number): Promise<LinkPage> {
  let res: Response;
  try {
    res = await authedFetch(`/api/links?page=${page}&size=${PAGE_SIZE}`);
  } catch {
    throw new Error("Can't reach server");
  }

  if (!res.ok) throw new Error("Something went wrong. Try again");
  return res.json();
}
