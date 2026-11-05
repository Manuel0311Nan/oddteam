import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("joins classes and drops falsy values", () => {
    expect(cn("a", false, undefined, "b")).toBe("a b");
  });

  it("lets the last conflicting Tailwind class win", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});
