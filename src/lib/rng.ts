/**
 * Seeded randomness. All domain randomness goes through here (no Math.random).
 * Same seed + same calls = same results, in every environment.
 */

export type Seed = number; // unsigned 32-bit integer

export type Rng = {
  /** Float in [0, 1). */
  next(): number;
  /** Integer in [min, max], both inclusive. */
  int(min: number, max: number): number;
  /** Uniform pick. Throws on an empty array. */
  pick<T>(items: readonly T[]): T;
  /** Weighted pick; items with weight <= 0 are never chosen. Throws if no weight is positive. */
  weightedPick<T>(items: readonly T[], weight: (item: T) => number): T;
  /** New shuffled copy (Fisher–Yates). */
  shuffle<T>(items: readonly T[]): T[];
};

const UINT32 = 0x1_0000_0000;

function toUint32(n: number): number {
  return n >>> 0;
}

/** mulberry32: small, fast, good enough for games. */
export function createRng(seed: Seed): Rng {
  let state = toUint32(seed);

  const next = (): number => {
    state = toUint32(state + 0x6d2b79f5);
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return toUint32(t ^ (t >>> 14)) / UINT32;
  };

  const int = (min: number, max: number): number => {
    if (!Number.isInteger(min) || !Number.isInteger(max) || max < min) {
      throw new RangeError(`Invalid range [${min}, ${max}]`);
    }
    return min + Math.floor(next() * (max - min + 1));
  };

  const pick = <T>(items: readonly T[]): T => {
    if (items.length === 0) throw new RangeError("Cannot pick from an empty array");
    return items[int(0, items.length - 1)] as T;
  };

  const weightedPick = <T>(items: readonly T[], weight: (item: T) => number): T => {
    const weights = items.map((item) => Math.max(0, weight(item)));
    const total = weights.reduce((sum, w) => sum + w, 0);
    if (total <= 0) throw new RangeError("No item has a positive weight");
    let target = next() * total;
    for (let i = 0; i < items.length; i++) {
      target -= weights[i] as number;
      if (target < 0 && (weights[i] as number) > 0) return items[i] as T;
    }
    // Floating point edge: return the last positive-weight item.
    for (let i = items.length - 1; i >= 0; i--) {
      if ((weights[i] as number) > 0) return items[i] as T;
    }
    throw new RangeError("No item has a positive weight");
  };

  const shuffle = <T>(items: readonly T[]): T[] => {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = int(0, i);
      [copy[i], copy[j]] = [copy[j] as T, copy[i] as T];
    }
    return copy;
  };

  return { next, int, pick, weightedPick, shuffle };
}

/**
 * Derive an independent seed from a parent seed and labels
 * (e.g. deriveSeed(seed, "slot", 3) for "Cambiar" on slot 3).
 * FNV-1a over the labels, mixed with the parent, then a murmur3 finalizer.
 */
export function deriveSeed(parent: Seed, ...labels: readonly (string | number)[]): Seed {
  let h = toUint32(parent) ^ 0x811c9dc5;
  for (const label of labels) {
    const text = `|${String(label)}`;
    for (let i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return toUint32(h);
}

/** New random seed for a fresh generation. Uses the platform CSPRNG, not Math.random. */
export function newSeed(): Seed {
  const buffer = new Uint32Array(1);
  globalThis.crypto.getRandomValues(buffer);
  return toUint32(buffer[0] as number);
}

const SEED_PATTERN = /^[0-9a-f]{4}-?[0-9a-f]{4}$/i;

/** Display format: "7F3A-91C2". */
export function formatSeed(seed: Seed): string {
  const hex = toUint32(seed).toString(16).toUpperCase().padStart(8, "0");
  return `${hex.slice(0, 4)}-${hex.slice(4)}`;
}

/** URL format: "7F3A91C2". */
export function seedToParam(seed: Seed): string {
  return toUint32(seed).toString(16).toUpperCase().padStart(8, "0");
}

/** Accepts "7F3A-91C2", "7f3a91c2"… Returns null if the text is not a seed. */
export function parseSeed(text: string): Seed | null {
  const trimmed = text.trim();
  if (!SEED_PATTERN.test(trimmed)) return null;
  return toUint32(Number.parseInt(trimmed.replace("-", ""), 16));
}
