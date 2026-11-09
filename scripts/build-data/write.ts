/** Deterministic output: same input data → byte-identical files and dataVersion. */

import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value as Record<string, unknown>)
        .sort()
        .map((k) => [k, sortKeys((value as Record<string, unknown>)[k])]),
    );
  }
  return value;
}

/** Pretty JSON with sorted object keys and a trailing newline. */
export function stableJson(value: unknown): string {
  return `${JSON.stringify(sortKeys(value), null, 2)}\n`;
}

/** Short content hash over files, independent of insertion order. */
export function dataVersionOf(files: ReadonlyMap<string, string>): string {
  const hash = createHash("sha256");
  for (const path of [...files.keys()].sort()) {
    hash.update(path);
    hash.update("\0");
    hash.update(files.get(path) as string);
    hash.update("\0");
  }
  return hash.digest("hex").slice(0, 8);
}

/** Collects output files in memory and writes them in one go. */
export class OutputSet {
  private readonly files = new Map<string, string>();

  json(path: string, value: unknown): void {
    this.files.set(path, stableJson(value));
  }

  text(path: string, content: string): void {
    this.files.set(path, content.endsWith("\n") ? content : `${content}\n`);
  }

  /** Hash of the data files only (reports and meta excluded), optionally restricted to some paths. */
  dataVersion(include: (path: string) => boolean = () => true): string {
    const data = new Map(
      [...this.files].filter(([p]) => p.endsWith(".json") && !p.endsWith("meta.json") && include(p)),
    );
    return dataVersionOf(data);
  }

  async writeTo(root: string): Promise<string[]> {
    const written: string[] = [];
    for (const [path, content] of this.files) {
      const target = join(root, path);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, content);
      written.push(path);
    }
    return written.sort();
  }
}
