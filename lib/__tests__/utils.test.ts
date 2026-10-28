import { cn, withViewTransition } from "@/lib/utils";

describe("cn", () => {
  it("joins class names and drops falsy values", () => {
    expect(cn("a", false && "b", "c")).toBe("a c");
  });
});

describe("withViewTransition", () => {
  const doc = document as unknown as { startViewTransition?: (cb: () => void) => void };
  const setReducedMotion = (matches: boolean) => {
    window.matchMedia = jest
      .fn()
      .mockReturnValue({ matches }) as unknown as typeof window.matchMedia;
  };

  afterEach(() => {
    doc.startViewTransition = undefined;
  });

  it("runs the update directly when the API is missing", () => {
    const update = jest.fn();
    withViewTransition(update);
    expect(update).toHaveBeenCalledTimes(1);
  });

  it("runs the update inside a view transition", () => {
    const start = jest.fn((cb: () => void) => cb());
    doc.startViewTransition = start;
    setReducedMotion(false);
    const update = jest.fn();
    withViewTransition(update);
    expect(start).toHaveBeenCalledWith(update);
    expect(update).toHaveBeenCalledTimes(1);
  });

  it("skips the transition under reduced motion", () => {
    const start = jest.fn();
    doc.startViewTransition = start;
    setReducedMotion(true);
    const update = jest.fn();
    withViewTransition(update);
    expect(start).not.toHaveBeenCalled();
    expect(update).toHaveBeenCalledTimes(1);
  });
});
