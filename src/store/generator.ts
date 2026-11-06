"use client";

/**
 * Generator state (Zustand). One store per game page.
 * Slot positions live here: locked members keep their slot when regenerating;
 * the generator only fills the free slots (specs/03).
 * The URL carries the whole team (D-019): the local history changes the
 * weights, so a seed alone would not reproduce a team on another device.
 */

import { createStore } from "zustand/vanilla";
import { computeDifficulty } from "@/lib/analysis/difficulty";
import { difficultyDataOf } from "@/lib/analysis/difficulty-data";
import type { ClientGame } from "@/lib/game-data";
import { createContext, entryKey, type GeneratorContext } from "@/lib/generator/context";
import { generateTeam, rerollSlot } from "@/lib/generator/generate";
import { DEFAULT_OPTIONS, normalizeOptions } from "@/lib/generator/options";
import { newSeed, type Seed } from "@/lib/rng";
import type { GeneratorOptions, PoolEntry, Typing } from "@/lib/types";
import { decodeUrlState, encodeUrlState } from "@/lib/url-state";

export type Slot = { entry: PoolEntry; locked: boolean };

export type GeneratorState = {
  ready: boolean;
  options: GeneratorOptions;
  seed: Seed | null;
  slots: Slot[];
  error: string | null;
  notice: string | null;
  rerolls: number;
};

export type GeneratorActions = {
  hydrate: (search: string) => void;
  generate: () => void;
  toggleLock: (slot: number) => void;
  reroll: (slot: number) => void;
  setOptions: (patch: Partial<GeneratorOptions>) => void;
  query: () => string;
};

export type GeneratorStore = ReturnType<typeof createGeneratorStore>;

const HISTORY_SIZE = 20;

/** localStorage helpers: the page works without them (private mode, blocked storage). */
function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeLocal(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function createGeneratorStore(game: ClientGame) {
  const typings = new Map<number, Typing>(Object.values(game.species).map((s) => [s.id, s.typing]));
  const difficultyData = difficultyDataOf(game);
  const ctx: GeneratorContext = createContext(game, typings, game.name, (team) => computeDifficulty(team, difficultyData).level);
  const byFinal = new Map(game.pool.map((e) => [entryKey(e), e]));
  const historyKey = `oddteam:history:${game.slug}`;
  const excludedKey = `oddteam:excluded:${game.slug}`;

  const recent = (): number[] => readLocal<number[][]>(historyKey, []).flat();
  const remember = (team: readonly PoolEntry[]) => {
    const history = readLocal<number[][]>(historyKey, []);
    writeLocal(historyKey, [team.map(entryKey), ...history].slice(0, HISTORY_SIZE));
  };

  return createStore<GeneratorState & GeneratorActions>()((set, get) => {
    /** Run the generator and place new members in the free slots. */
    const run = (seed: Seed, lockedSlots: (number | null)[], options: GeneratorOptions) => {
      const locked = lockedSlots.filter((x): x is number => x !== null);
      const result = generateTeam({ ctx, options, seed, locked, recent: recent() });
      if (!result.ok) {
        set({ error: result.message, ready: true });
        return;
      }
      const fresh = result.team.filter((e) => !locked.includes(entryKey(e)));
      const slots: Slot[] = [];
      for (let i = 0; i < options.size; i++) {
        const lockedId = lockedSlots[i];
        const entry = lockedId != null ? byFinal.get(lockedId) : fresh.shift();
        if (entry) slots.push({ entry, locked: lockedId != null });
      }
      remember(slots.map((s) => s.entry));
      set({ seed, slots, error: null, ready: true });
    };

    const lockedLayout = (size: number): (number | null)[] => {
      const { slots } = get();
      const layout = Array.from({ length: size }, (_, i) => {
        const s = slots[i];
        return s?.locked ? entryKey(s.entry) : null;
      });
      // Locked members beyond the new size are dropped.
      return layout;
    };

    return {
      ready: false,
      options: DEFAULT_OPTIONS,
      seed: null,
      slots: [],
      error: null,
      notice: null,
      rerolls: 0,

      hydrate: (search) => {
        const decoded = decodeUrlState(new URLSearchParams(search));
        const savedExcluded = readLocal<number[]>(excludedKey, []);
        if (!decoded.ok) {
          const options = normalizeOptions({ ...DEFAULT_OPTIONS, excluded: savedExcluded });
          set({ options, notice: `${decoded.reason} Se ha generado un equipo nuevo.` });
          run(newSeed(), Array(options.size).fill(null), options);
          return;
        }
        const { state } = decoded;
        const fromUrl = new URLSearchParams(search).has("o");
        const options = normalizeOptions(fromUrl ? state.options : { ...state.options, excluded: savedExcluded });
        const notice =
          state.dataVersion && state.dataVersion !== game.dataVersion
            ? "Este enlace se creó con datos anteriores; el equipo puede variar."
            : null;
        set({ options, notice });
        const team = state.locked ?? [];
        const known = team.filter((id) => byFinal.has(id));
        const missing = team.length - known.length;
        set({
          notice:
            notice ??
            (missing > 0 ? "Algún Pokémon del enlace ya no está en los datos; se ha completado el equipo." : null),
        });
        const layout: (number | null)[] = [...known, ...Array(Math.max(0, options.size - known.length)).fill(null)];
        run(state.seed ?? newSeed(), layout.slice(0, options.size), options);
        // Members coming from the link are shown unlocked.
        set((s) => ({ slots: s.slots.map((x) => ({ ...x, locked: false })) }));
      },

      generate: () => {
        const { options } = get();
        run(newSeed(), lockedLayout(options.size), options);
      },

      toggleLock: (slot) => {
        set((s) => ({
          slots: s.slots.map((x, i) => (i === slot ? { ...x, locked: !x.locked } : x)),
        }));
      },

      reroll: (slot) => {
        const { options, seed, slots, rerolls } = get();
        if (seed === null) return;
        const team = slots.map((s) => s.entry);
        const { seed: derived, result } = rerollSlot({
          ctx,
          options,
          seed,
          team,
          slot,
          counter: rerolls + 1,
          recent: recent(),
        });
        if (!result.ok) {
          set({ error: result.message, rerolls: rerolls + 1 });
          return;
        }
        const kept = new Set(team.filter((_, i) => i !== slot).map(entryKey));
        const replacement = result.team.find((e) => !kept.has(entryKey(e)));
        if (!replacement) return;
        const next = slots.map((s, i) => (i === slot ? { entry: replacement, locked: false } : s));
        remember(next.map((s) => s.entry));
        set({ seed: derived, slots: next, error: null, rerolls: rerolls + 1 });
      },

      setOptions: (patch) => {
        const options = normalizeOptions({ ...get().options, ...patch });
        if (patch.excluded) writeLocal(excludedKey, options.excluded);
        set({ options });
      },

      query: () => {
        const { seed, options, slots } = get();
        if (seed === null) return "";
        const team = slots.map((x) => entryKey(x.entry));
        return encodeUrlState({ seed, options, locked: team, dataVersion: game.dataVersion }).toString();
      },
    };
  });
}
