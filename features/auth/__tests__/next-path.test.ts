import { safeNext, saveNext, takeNext } from "@/features/auth/next-path";

afterEach(() => {
  jest.restoreAllMocks();
  sessionStorage.clear();
});

describe("safeNext", () => {
  it.each(["/app", "/app/links", "/app/links?page=2", "/app?x=1"])("accepts %s", (value) =>
    expect(safeNext(value)).toBe(value),
  );

  it.each(["https://evil.com", "//evil.com", "/login", "/apples", "", undefined, ["/app"]])(
    "rejects %p",
    (value) => expect(safeNext(value)).toBeUndefined(),
  );
});

describe("saveNext and takeNext", () => {
  it("round-trips and clears", () => {
    saveNext("/app/links");
    expect(takeNext()).toBe("/app/links");
    expect(takeNext()).toBeUndefined();
  });

  it("drops an unsafe stored value", () => {
    sessionStorage.setItem("auth:next", "https://evil.com");
    expect(takeNext()).toBeUndefined();
  });

  it("clears a saved value when saving nothing", () => {
    saveNext("/app/links");
    saveNext(undefined);
    expect(takeNext()).toBeUndefined();
  });

  it("survives storage that throws", () => {
    const fail = () => {
      throw new Error("blocked");
    };
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(fail);
    jest.spyOn(Storage.prototype, "setItem").mockImplementation(fail);
    jest.spyOn(Storage.prototype, "removeItem").mockImplementation(fail);
    expect(() => saveNext("/app/links")).not.toThrow();
    expect(takeNext()).toBeUndefined();
  });
});
