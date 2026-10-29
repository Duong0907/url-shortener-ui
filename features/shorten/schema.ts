import { z } from "zod";

// Same rule as the API: 3-32 letters, numbers, - or _.
const SLUG = /^[A-Za-z0-9_-]{3,32}$/;

export const urlSchema = z
  .object({
    url: z
      .string()
      .trim()
      .pipe(
        z.url({
          protocol: /^https?$/,
          error: "Enter a full URL starting with http:// or https://",
        }),
      ),
    custom: z.boolean().optional(),
    slug: z.string().trim().optional(),
  })
  .superRefine(({ custom, slug }, ctx) => {
    if (!custom) return;

    if (!slug) {
      ctx.addIssue({
        code: "custom",
        path: ["slug"],
        message: "Enter a custom link or turn this off",
      });
    } else if (!SLUG.test(slug)) {
      ctx.addIssue({ code: "custom", path: ["slug"], message: "3-32 letters, numbers, - or _" });
    }
  });
