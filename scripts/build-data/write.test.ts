import { describe, expect, it } from "vitest";
import { dataVersionOf, OutputSet, stableJson } from "./write";

describe("stableJson", () => {
  it("sorts keys deeply and keeps array order", () => {
    expect(stableJson({ b: 1, a: { d: [3, 1], c: 2 } })).toBe(
      '{\n  "a": {\n    "c": 2,\n    "d": [\n      3,\n      1\n    ]\n  },\n  "b": 1\n}\n',
    );
  });
});

describe("dataVersion", () => {
  it("does not depend on insertion order", () => {
    const a = new Map([
      ["x.json", "1"],
      ["y.json", "2"],
    ]);
    const b = new Map([
      ["y.json", "2"],
      ["x.json", "1"],
    ]);
    expect(dataVersionOf(a)).toBe(dataVersionOf(b));
    expect(dataVersionOf(a)).toMatch(/^[0-9a-f]{8}$/);
  });

  it("changes when content changes", () => {
    expect(dataVersionOf(new Map([["x.json", "1"]]))).not.toBe(
      dataVersionOf(new Map([["x.json", "2"]])),
    );
  });

  it("ignores meta.json and reports", () => {
    const one = new OutputSet();
    one.json("emerald/pokeapi/species.json", { a: 1 });
    const two = new OutputSet();
    two.json("emerald/pokeapi/species.json", { a: 1 });
    two.json("meta.json", { dataVersion: "x" });
    two.text("emerald/report.md", "# hi");
    expect(two.dataVersion()).toBe(one.dataVersion());
  });
});
