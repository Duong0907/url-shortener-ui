import { byDay, dayLabel, fmtDate, splitTarget } from "@/features/links/services";
import type { LinkResponse } from "@/features/shorten/api";

const link = (id: string, createdAt: string) => ({ id, createdAt }) as LinkResponse;

describe("fmtDate", () => {
  it("prints month, day and year", () => {
    expect(fmtDate("2026-10-10T12:00:00Z")).toBe("Oct 10, 2026");
  });
});

describe("byDay", () => {
  it("groups neighbouring links from the same day", () => {
    const groups = byDay([
      link("a", "2026-10-29T12:00:00Z"),
      link("b", "2026-10-29T09:00:00Z"),
      link("c", "2026-10-12T12:00:00Z"),
    ]);
    expect(groups.map((g) => g.links.map((l) => l.id))).toEqual([["a", "b"], ["c"]]);
    expect(groups[0].day).toBe(new Date("2026-10-29T12:00:00Z").toDateString());
  });

  it("returns no groups for no links", () => {
    expect(byDay([])).toEqual([]);
  });
});

describe("dayLabel", () => {
  beforeAll(() => jest.useFakeTimers({ now: new Date(2026, 9, 29, 12) }));
  afterAll(() => jest.useRealTimers());

  it.each([
    [new Date(2026, 9, 29), "Today"],
    [new Date(2026, 9, 28), "Yesterday"],
    [new Date(2026, 9, 12), "Oct 12, 2026"],
  ])("labels %s as %s", (date, label) => {
    expect(dayLabel(date.toDateString())).toBe(label);
  });
});

describe("splitTarget", () => {
  it.each([
    ["https://www.site.com/a?b=1#c", ["site.com", "/a?b=1#c"]],
    ["https://site.com/", ["site.com", ""]],
    ["http://localhost:8080/x", ["localhost:8080", "/x"]],
    ["not a url", ["not a url", ""]],
  ])("splits %s", (url, parts) => {
    expect(splitTarget(url)).toEqual(parts);
  });
});
