/**
 * Featured teams per game (specs/05). Deterministic: same data → same file.
 * Writes data/generated/featured/{game}.json. Run by `pnpm data:featured` and
 * at the end of `pnpm data:build` (D-021), so it never lags behind the data.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { computeDifficulty } from "@/lib/analysis/difficulty";
import { difficultyDataOf } from "@/lib/analysis/difficulty-data";
import { FEATURED_SAMPLES, type FeaturedFile, type ScoredTeam, selectFeatured } from "@/lib/analysis/featured";
import { loadClientGame } from "@/lib/game-data";
import { createContext } from "@/lib/generator/context";
import { generateTeam } from "@/lib/generator/generate";
import { DEFAULT_OPTIONS } from "@/lib/generator/options";
import { deriveSeed } from "@/lib/rng";
import { DIFFICULTIES } from "@/lib/types";
import { encodeOptions } from "@/lib/url-state";

/** Base seed of the featured run. Changing it changes every featured team. */
const FEATURED_SEED = 0x0dd7ea;

const OUT_DIR = join(process.cwd(), "data", "generated", "featured");

export async function buildFeatured(slug: string, samples = FEATURED_SAMPLES): Promise<FeaturedFile> {
  const game = loadClientGame(slug);
  if (!game) throw new Error(`data:featured: no hay datos generados de ${slug}`);
  const ctx = createContext(game, new Map(Object.values(game.species).map((s) => [s.id, s.typing])), game.name);
  const dd = difficultyDataOf(game);

  const candidates: ScoredTeam[] = [];
  for (let i = 0; i < samples; i++) {
    const seed = deriveSeed(FEATURED_SEED, slug, i);
    const r = generateTeam({ ctx, options: DEFAULT_OPTIONS, seed });
    if (!r.ok) continue;
    const d = computeDifficulty(r.team, dd);
    candidates.push({
      seed,
      starter: r.team.find((m) => m.flags.starter)?.finalFormId,
      team: r.team.map((m) => m.finalFormId), score: d.score, level: d.level, components: d.components });
  }

  const picked = selectFeatured(candidates);
  const levels = Object.fromEntries(
    DIFFICULTIES.map((level) => [
      level,
      // The link keeps the level as filter, so "Regenerar" stays in it.
      picked[level].map((t) => ({ ...t, options: encodeOptions({ ...DEFAULT_OPTIONS, difficulty: level }) })),
    ]),
  ) as FeaturedFile["levels"];

  const file: FeaturedFile = { game: slug, dataVersion: game.dataVersion, samples, levels };
  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(join(OUT_DIR, `${slug}.json`), `${JSON.stringify(file, null, 2)}\n`);
  return file;
}

export function summary(file: FeaturedFile): string {
  return DIFFICULTIES.map((d) => `${d} ${file.levels[d].length}`).join(" · ");
}
