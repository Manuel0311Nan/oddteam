/**
 * Minimal PokéAPI client for the build pipeline.
 *
 * Two sources with the same data:
 *  - "pokeapi": the live REST API (https://pokeapi.co).
 *  - "github":  the official static dump (PokeAPI/api-data), addressed by id.
 *
 * Every response is cached on disk under .cache/pokeapi/<source>/, so repeated
 * builds do not hit the network. `fresh` ignores the cache.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

export type Source = "pokeapi" | "github";

export type ClientOptions = {
  source: Source;
  cacheDir: string;
  fresh: boolean;
  concurrency: number;
  onRequest?: (path: string, fromCache: boolean) => void;
};

/** A path like "/api/v2/pokemon/286/" (trailing slash optional). */
export type ApiPath = string;

const BASES: Record<Source, string> = {
  pokeapi: "https://pokeapi.co",
  github: "https://raw.githubusercontent.com/PokeAPI/api-data/master/data",
};

/** "/api/v2/pokemon/286/" or a full URL → "/api/v2/pokemon/286/". */
export function toApiPath(urlOrPath: string): ApiPath {
  const match = /\/api\/v2\/[^?#]*/.exec(urlOrPath);
  if (!match) throw new Error(`Not a PokéAPI resource: ${urlOrPath}`);
  const path = match[0];
  return path.endsWith("/") ? path : `${path}/`;
}

/** Numeric id at the end of a resource URL. */
export function idFromUrl(url: string): number {
  const match = /\/(\d+)\/?$/.exec(url);
  if (!match) throw new Error(`No id in URL: ${url}`);
  return Number(match[1]);
}

export function resourceUrl(source: Source, path: ApiPath): string {
  const clean = toApiPath(path);
  if (source === "github") return `${BASES.github}${clean}index.json`;
  return `${BASES.pokeapi}${clean}`;
}

function cacheFile(cacheDir: string, source: Source, path: ApiPath): string {
  return join(cacheDir, source, `${toApiPath(path).replace(/\/$/, "")}.json`);
}

/** Tiny concurrency limiter. */
function limiter(max: number) {
  let active = 0;
  const queue: (() => void)[] = [];
  const release = () => {
    active--;
    queue.shift()?.();
  };
  return async <T>(task: () => Promise<T>): Promise<T> => {
    if (active >= max) await new Promise<void>((resolve) => queue.push(resolve));
    active++;
    try {
      return await task();
    } finally {
      release();
    }
  };
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type PokeApiClient = {
  get<T>(urlOrPath: string): Promise<T>;
  /** All results of a list endpoint, e.g. list("version"). */
  list(resource: string): Promise<{ name: string; url: string }[]>;
  stats(): { network: number; cache: number };
};

export function createClient(options: ClientOptions): PokeApiClient {
  const limit = limiter(options.concurrency);
  const inflight = new Map<string, Promise<unknown>>();
  let network = 0;
  let cache = 0;

  async function fetchJson(path: ApiPath): Promise<unknown> {
    const file = cacheFile(options.cacheDir, options.source, path);
    if (!options.fresh) {
      try {
        const text = await readFile(file, "utf8");
        cache++;
        options.onRequest?.(path, true);
        return JSON.parse(text);
      } catch {
        // not cached
      }
    }
    const url = resourceUrl(options.source, path);
    let lastError: unknown;
    for (let attempt = 1; attempt <= 4; attempt++) {
      try {
        const res = await limit(() =>
          fetch(url, { headers: { "User-Agent": "oddteam-build-data" } }),
        );
        if (res.status === 404) throw new Error(`404 Not Found: ${url}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
        const text = await res.text();
        const data: unknown = JSON.parse(text);
        await mkdir(dirname(file), { recursive: true });
        await writeFile(file, text);
        network++;
        options.onRequest?.(path, false);
        return data;
      } catch (error) {
        lastError = error;
        if (error instanceof Error && error.message.startsWith("404")) break;
        await sleep(500 * attempt);
      }
    }
    throw lastError instanceof Error ? lastError : new Error(String(lastError));
  }

  return {
    get<T>(urlOrPath: string): Promise<T> {
      const path = toApiPath(urlOrPath);
      let promise = inflight.get(path);
      if (!promise) {
        promise = fetchJson(path);
        inflight.set(path, promise);
      }
      return promise as Promise<T>;
    },
    async list(resource: string) {
      // The live API paginates; the static dump returns everything at once.
      const path =
        options.source === "pokeapi"
          ? `/api/v2/${resource}/?limit=100000`
          : `/api/v2/${resource}/`;
      if (options.source === "pokeapi") {
        const url = `${BASES.pokeapi}${path}`;
        const res = await limit(() => fetch(url));
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
        network++;
        const data = (await res.json()) as { results: { name: string; url: string }[] };
        return data.results;
      }
      const data = await this.get<{ results: { name: string; url: string }[] }>(path);
      return data.results;
    },
    stats: () => ({ network, cache }),
  };
}
