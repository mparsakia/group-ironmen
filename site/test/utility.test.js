import { describe, expect, it, vi } from "vitest";
import { utility } from "../src/utility";

describe("utility", () => {
  it("formats quantities with K/M/B suffixes", () => {
    expect(utility.formatShortQuantity(99999)).toBe(99999);
    expect(utility.formatShortQuantity(100000)).toBe("100K");
    expect(utility.formatShortQuantity(10000000)).toBe("10M");
    expect(utility.formatShortQuantity(1000000000)).toBe("1B");
  });

  it("formats very short quantity for small thousands", () => {
    expect(utility.formatVeryShortQuantity(999)).toBe(999);
    expect(utility.formatVeryShortQuantity(4200)).toBe("4K");
    expect(utility.formatVeryShortQuantity(250000)).toBe("250K");
  });

  it("removes leading article", () => {
    expect(utility.removeArticles("the abyssal whip")).toBe("abyssal whip");
    expect(utility.removeArticles("A dragon scimitar")).toBe("dragon scimitar");
    expect(utility.removeArticles("rune platebody")).toBe("rune platebody");
  });

  it("throttles function calls by interval", () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const throttled = utility.throttle(fn, 100);

    throttled();
    throttled();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);

    throttled();
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("removes html tags", () => {
    expect(utility.removeTags("<b>Rune</b> scimitar")).toBe("Rune scimitar");
    expect(utility.removeTags(undefined)).toBeUndefined();
  });
});
