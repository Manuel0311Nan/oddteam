import { describe, expect, it } from "vitest";
import { DEFAULT_OPTIONS, normalizeOptions } from "@/lib/generator/options";
import type { GeneratorOptions } from "@/lib/types";
import {
  decodeOptions,
  decodeUrlState,
  encodeOptions,
  encodeUrlState,
} from "@/lib/url-state";

const custom: GeneratorOptions = {
  size: 4,
  starter: { mode: "pick", speciesId: 258 },
  typeRule: { mode: "mono", type: "water" },
  balancedProgression: false,
  allowTradeEvolutions: true,
  allowLegendaries: true,
  difficulty: "challenge",
  rarity: "easy-only",
  excluded: [286, 264, 286],
};

describe("encodeOptions / decodeOptions", () => {
  it("encodes the defaults compactly", () => {
    expect(encodeOptions(DEFAULT_OPTIONS)).toBe("1-6-r-u-100-a-v-");
  });

  it("round-trips the defaults", () => {
    expect(decodeOptions(encodeOptions(DEFAULT_OPTIONS))).toEqual(DEFAULT_OPTIONS);
  });

  it("round-trips non-default options, normalizing excluded ids", () => {
    const encoded = encodeOptions(custom);
    expect(encoded).toBe("1-4-p258-owater-011-c-e-264.286");
    expect(decodeOptions(encoded)).toEqual(normalizeOptions(custom));
  });

  it("round-trips every type rule and starter mode", () => {
    const variants: Partial<GeneratorOptions>[] = [
      { typeRule: { mode: "unique" } },
      { typeRule: { mode: "max-two" } },
      { typeRule: { mode: "free" } },
      { typeRule: { mode: "mono", type: "fairy" } },
      { starter: { mode: "none" } },
      { starter: { mode: "random" } },
      { starter: { mode: "pick", speciesId: 1 } },
    ];
    for (const v of variants) {
      const options = { ...DEFAULT_OPTIONS, ...v };
      expect(decodeOptions(encodeOptions(options))).toEqual(options);
    }
  });

  it("rejects malformed or unknown versions", () => {
    for (const bad of [
      "",
      "2-6-r-u-100-a-v-",
      "1-7-r-u-100-a-v-",
      "1-0-r-u-100-a-v-",
      "1-6-x-u-100-a-v-",
      "1-6-r-otrueno-100-a-v-",
      "1-6-r-u-1000-a-v-",
      "1-6-r-u-100-z-v-",
      "1-6-r-u-100-a-v-12.abc",
      "1-6-r-u-100-a-v",
    ]) {
      expect(decodeOptions(bad), bad).toBeNull();
    }
  });
});

describe("encodeUrlState / decodeUrlState", () => {
  it("round-trips a full state", () => {
    const params = encodeUrlState({
      seed: 0x7f3a91c2,
      options: custom,
      locked: [258, 280],
      dataVersion: "ab12cd34",
    });
    expect(params.toString()).toBe(
      "s=7F3A91C2&o=1-4-p258-owater-011-c-e-264.286&l=258.280&d=ab12cd34",
    );
    const decoded = decodeUrlState(new URLSearchParams(params.toString()));
    expect(decoded).toEqual({
      ok: true,
      state: {
        seed: 0x7f3a91c2,
        options: normalizeOptions(custom),
        locked: [258, 280],
        dataVersion: "ab12cd34",
      },
    });
  });

  it("omits empty locked and dataVersion", () => {
    const params = encodeUrlState({ seed: 1, options: DEFAULT_OPTIONS, locked: [] });
    expect(params.has("l")).toBe(false);
    expect(params.has("d")).toBe(false);
  });

  it("falls back to defaults when parameters are missing", () => {
    expect(decodeUrlState(new URLSearchParams())).toEqual({
      ok: true,
      state: { options: DEFAULT_OPTIONS },
    });
  });

  it("reports malformed parameters instead of guessing", () => {
    for (const query of [
      "s=nope",
      "o=1-6-r-u",
      "l=1.x",
      "l=1.1",
      "o=1-2-r-u-100-a-v-&l=1.2.3",
      "d=has spaces",
    ]) {
      const result = decodeUrlState(new URLSearchParams(query));
      expect(result.ok, query).toBe(false);
    }
  });
});
