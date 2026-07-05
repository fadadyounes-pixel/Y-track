import { emptyDocsState } from "./constants";
import { HolderState } from "./types";

const HOLDER_KEY = (cin: string) => `ideamap:holder:${cin.toUpperCase()}`;
const HOLDERS_INDEX_KEY = "ideamap:holders";
const COORDINATORS_KEY = "ideamap:coordinators";

export interface CoordinatorRecord {
  code: string;
  name: string;
  createdAt: string;
}

const isBrowser = () => typeof window !== "undefined";

function readJSON<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function newHolderState(cin: string, name: string, coordinatorCode?: string): HolderState {
  return {
    cin: cin.toUpperCase(),
    name,
    createdAt: new Date().toISOString(),
    step: "idea",
    idea: "",
    msgs: [],
    qN: 0,
    proj: null,
    plan: null,
    budget: null,
    comp: null,
    docs: emptyDocsState(),
    uploads: {},
    logo: null,
    coordinatorCode,
  };
}

export function loadHolder(cin: string): HolderState | null {
  const state = readJSON<Partial<HolderState> | null>(HOLDER_KEY(cin), null);
  if (!state) return null;
  // Backfills fields added after some holders were already saved, so older
  // records don't crash newer code that expects them to exist.
  return { uploads: {}, logo: null, ...state } as HolderState;
}

export function saveHolder(state: HolderState) {
  writeJSON(HOLDER_KEY(state.cin), state);
  const index = readJSON<string[]>(HOLDERS_INDEX_KEY, []);
  if (!index.includes(state.cin)) {
    writeJSON(HOLDERS_INDEX_KEY, [...index, state.cin]);
  }
}

export function listHolders(): HolderState[] {
  const index = readJSON<string[]>(HOLDERS_INDEX_KEY, []);
  return index
    .map((cin) => loadHolder(cin))
    .filter((h): h is HolderState => h !== null);
}

export function listCoordinators(): CoordinatorRecord[] {
  return readJSON<CoordinatorRecord[]>(COORDINATORS_KEY, []);
}

export function addCoordinator(code: string, name: string) {
  const list = listCoordinators();
  if (list.some((c) => c.code.toLowerCase() === code.toLowerCase())) return;
  writeJSON(COORDINATORS_KEY, [
    ...list,
    { code, name, createdAt: new Date().toISOString() },
  ]);
}

export function coordinatorExists(code: string): boolean {
  return listCoordinators().some((c) => c.code.toLowerCase() === code.toLowerCase());
}
