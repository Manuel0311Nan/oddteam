/**
 * pnpm data:featured [--game=emerald]
 * Recomputes the featured teams from data/generated (specs/05).
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { GeneratedGameListEntry } from "@/lib/generated-types";
import { buildFeatured, summary } from "./build";

async function main() {
  const only = process.argv.find((a) => a.startsWith("--game="))?.slice("--game=".length);
  const games = JSON.parse(readFileSync(join(process.cwd(), "data", "generated", "games.json"), "utf8")) as GeneratedGameListEntry[];
  for (const g of games) {
    if (only && g.slug !== only) continue;
    const started = Date.now();
    const file = await buildFeatured(g.slug);
    console.log(`· ${g.slug}: ${summary(file)} · ${((Date.now() - started) / 1000).toFixed(1)} s`);
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
