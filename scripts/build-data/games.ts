import type { GeneratedGameListEntry } from "@/lib/generated-types";
import { GAME_CONFIGS } from "./config";

/**
 * games.json after a build: the games just built plus those built earlier that
 * are still configured, in GAME_CONFIGS order. `--game=x` no longer drops the rest.
 */
export function mergeGameList(
  previous: readonly GeneratedGameListEntry[],
  built: readonly GeneratedGameListEntry[],
): GeneratedGameListEntry[] {
  const bySlug = new Map(previous.map((g) => [g.slug, g]));
  for (const g of built) bySlug.set(g.slug, g);
  return GAME_CONFIGS.map((c) => bySlug.get(c.slug)).filter((g): g is GeneratedGameListEntry => !!g && !!g.dataVersion);
}
