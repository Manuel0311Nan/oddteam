import { describe, expect, it } from "vitest";
import type { GeneratedGameListEntry } from "@/lib/generated-types";
import { mergeGameList } from "./games";

const entry = (slug: string, dataVersion = "aaaa0000"): GeneratedGameListEntry => ({
  slug,
  name: slug,
  family: slug,
  region: "r",
  generation: 3,
  publishable: false,
  dataVersion,
});

describe("mergeGameList (D-026)", () => {
  it("keeps games built earlier when only one is rebuilt", () => {
    const out = mergeGameList([entry("emerald", "11111111")], [entry("platinum", "22222222")]);
    expect(out.map((g) => g.slug)).toEqual(["emerald", "platinum"]);
  });

  it("replaces the rebuilt game", () => {
    const out = mergeGameList([entry("emerald", "11111111")], [entry("emerald", "33333333")]);
    expect(out).toEqual([entry("emerald", "33333333")]);
  });

  it("drops unknown games and entries from before per-game versions", () => {
    const old = { ...entry("emerald"), dataVersion: undefined } as unknown as GeneratedGameListEntry;
    expect(mergeGameList([old, entry("crystal")], [])).toEqual([]);
  });
});
