import { authedFetch } from "@/features/auth/authed-fetch";

export type LinkResponse = {
  id: string;
  slug: string;
  shortUrl: string;
  targetUrl: string;
  active: boolean;
  expiresAt?: string | null;
  createdAt: string;
};

export async function createLink(targetUrl: string): Promise<LinkResponse> {
  let res: Response;
  try {
    res = await authedFetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUrl }),
    });
  } catch {
    throw new Error("Can't reach server");
  }

  if (res.status === 400) throw new Error("That URL isn't valid");

  if (!res.ok) throw new Error("Something went wrong. Try again");

  return res.json();
}
