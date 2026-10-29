import { z } from "zod";

export const urlSchema = z.object({
  url: z
    .string()
    .trim()
    .pipe(
      z.url({
        protocol: /^https?$/,
        error: "Enter a full URL starting with http:// or https://",
      }),
    ),
});
