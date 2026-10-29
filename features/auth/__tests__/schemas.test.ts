import { loginSchema, registerSchema, resendSchema } from "@/features/auth/schemas";

const messages = (result: { success: boolean; error?: { issues: { message: string }[] } }) =>
  result.error?.issues.map((i) => i.message) ?? [];

describe("loginSchema", () => {
  it("accepts a trimmed email and any password", () => {
    expect(loginSchema.safeParse({ email: " a@b.co ", password: "pw", confirm: "" }).success).toBe(
      true,
    );
  });

  it("rejects a bad email and an empty password", () => {
    const result = loginSchema.safeParse({ email: "nope", password: "", confirm: "" });
    expect(messages(result)).toEqual(["Enter a valid email", "Enter your password"]);
  });
});

describe("registerSchema", () => {
  const valid = { email: "a@b.co", password: "password123", confirm: "password123" };

  it("accepts a valid form", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a short password", () => {
    const result = registerSchema.safeParse({ ...valid, password: "short", confirm: "short" });
    expect(messages(result)).toEqual(["Password needs at least 8 characters"]);
  });

  it("rejects a password over 72 characters", () => {
    const long = "a".repeat(73);
    const result = registerSchema.safeParse({ ...valid, password: long, confirm: long });
    expect(messages(result)).toEqual(["Password can have at most 72 characters"]);
  });

  it("rejects mismatched passwords on the confirm field", () => {
    const result = registerSchema.safeParse({ ...valid, confirm: "password124" });
    expect(result.error?.issues).toEqual([
      expect.objectContaining({ message: "Passwords don't match", path: ["confirm"] }),
    ]);
  });
});

describe("resendSchema", () => {
  it("rejects an empty email", () => {
    expect(messages(resendSchema.safeParse({ email: "" }))).toEqual(["Enter a valid email"]);
  });

  it("accepts a valid email", () => {
    expect(resendSchema.safeParse({ email: "a@b.co" }).success).toBe(true);
  });
});
