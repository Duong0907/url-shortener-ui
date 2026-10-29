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

  describe("custom link", () => {
    const parse = (slug?: string, custom = true) =>
      urlSchema.safeParse({ url: "https://example.com", custom, slug });

    it.each(["abc", "my-link_1", "a".repeat(32), " my-link "])("accepts %j", (slug) => {
      expect(parse(slug).success).toBe(true);
    });

    it("trims the slug", () => {
      expect(parse(" my-link ").data?.slug).toBe("my-link");
    });

    it.each(["ab", "my link", "über", "a/b", "a".repeat(33)])("rejects %j", (slug) => {
      const result = parse(slug);
      expect(result.error?.issues[0].message).toBe("3-32 letters, numbers, - or _");
      expect(result.error?.issues[0].path).toEqual(["slug"]);
    });

    it.each([undefined, "", "  "])("asks for a slug when on and given %j", (slug) => {
      const result = parse(slug);
      expect(result.error?.issues[0].message).toBe("Enter a custom link or turn this off");
      expect(result.error?.issues[0].path).toEqual(["slug"]);
    });

    it.each([undefined, "", "ab", "my link"])("ignores slug %j when off", (slug) => {
      expect(parse(slug, false).success).toBe(true);
    });
  });
});
