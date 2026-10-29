import { urlSchema } from "@/features/shorten/schema";

describe("urlSchema", () => {
  it.each([" https://example.com ", "http://localhost:8080/x", "https://a.co/b?c=1"])(
    "accepts %j",
    (url) => {
      expect(urlSchema.safeParse({ url }).success).toBe(true);
    },
  );

  it.each(["example.com", "ftp://x.com", "", "   "])("rejects %j", (url) => {
    const result = urlSchema.safeParse({ url });
    expect(result.error?.issues[0].message).toBe(
      "Enter a full URL starting with http:// or https://",
    );
  });
});
