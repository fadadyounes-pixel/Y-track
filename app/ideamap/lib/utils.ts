import { STEP_ORDER, REQUIRED_DOCUMENTS } from "./constants";
import { HolderState } from "./types";

export function docsCompletion(docs: HolderState["docs"]): { done: number; total: number } {
  const total = REQUIRED_DOCUMENTS.length;
  const done = REQUIRED_DOCUMENTS.filter((d) => docs[d.id]).length;
  return { done, total };
}

/** Readiness % = (compliance score × 0.5) + (docs done/total × 50) */
export function readinessPercent(state: HolderState): number {
  const compScore = state.comp?.score ?? 0;
  const { done, total } = docsCompletion(state.docs);
  const docsPct = total > 0 ? (done / total) * 50 : 0;
  return Math.round(compScore * 0.5 + docsPct);
}

export function stepProgressPercent(state: HolderState): number {
  const idx = STEP_ORDER.indexOf(state.step);
  return Math.round(((idx + 1) / STEP_ORDER.length) * 100);
}

export function formatMAD(n: number): string {
  return `${new Intl.NumberFormat("fr-FR").format(Math.round(n))} MAD`;
}
