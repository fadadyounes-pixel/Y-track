"use client";

import { useState } from "react";
import { COLORS, REQUIRED_DOCUMENTS } from "../lib/constants";
import { t } from "../lib/i18n";
import { HolderState, Lang } from "../lib/types";
import { docsCompletion, formatMAD, readinessPercent } from "../lib/utils";
import * as ui from "../lib/ui";

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function download(filename: string, content: string) {
  downloadBlob(filename, new Blob([content], { type: "text/plain;charset=utf-8" }));
}

function planText(state: HolderState): string {
  const { plan, proj } = state;
  if (!plan || !proj) return "";
  return [
    `BUSINESS PLAN — ${proj.projectName}`,
    "=".repeat(40),
    `Executive summary: ${plan.executiveSummary}`,
    `Problem statement: ${plan.problemStatement}`,
    `Solution: ${plan.solution}`,
    `Market analysis: ${plan.marketAnalysis}`,
    `Business model: ${plan.businessModel}`,
    `Social impact: ${plan.socialImpact}`,
    `Operational plan: ${plan.operationalPlan}`,
    `INDH alignment: ${plan.indh_alignment}`,
    `Risks: ${plan.risks.join("; ")}`,
    `Projections (MAD): Year1 ${plan.projections.year1}, Year2 ${plan.projections.year2}, Year3 ${plan.projections.year3}`,
  ].join("\n\n");
}

function budgetText(state: HolderState): string {
  const { budget, proj } = state;
  if (!budget || !proj) return "";
  const lines = budget.items.map(
    (it) => `${it.category} — ${it.item} × ${it.quantity} @ ${it.unitPrice} MAD = ${it.total} MAD`
  );
  return [
    `BUDGET — ${proj.projectName}`,
    "=".repeat(40),
    ...lines,
    "",
    `INDH contribution: ${budget.indhContribution} MAD`,
    `Holder contribution: ${budget.beneficiaryContribution} MAD`,
  ].join("\n");
}

function documentsChecklistText(state: HolderState, lang: Lang): string {
  const { proj, docs } = state;
  const lines = REQUIRED_DOCUMENTS.map((d) => {
    const label = t(lang, `doc_${d.id}`);
    const tag = d.required ? t(lang, "documentsRequired") : t(lang, "documentsOptional");
    const mark = docs[d.id] ? "[x]" : "[ ]";
    return `${mark} ${label} — ${tag}`;
  });
  return [`CHECKLIST — ${proj?.projectName ?? state.cin}`, "=".repeat(40), ...lines].join("\n");
}

function submissionGuideText(state: HolderState, lang: Lang): string {
  const { proj } = state;
  return [
    `GUIDE DE SOUMISSION — ${proj?.projectName ?? state.cin}`,
    "=".repeat(40),
    "1. Rassemblez les 8 documents obligatoires (voir checklist).",
    "2. Faites viser le dossier par le président de la structure porteuse.",
    "3. Déposez le dossier auprès de la Division de l'Action Sociale (DAS) de votre province.",
    "4. La DAS instruit le dossier et le transmet au Comité Provincial de Développement Humain (CPDH).",
    "5. Le CPDH évalue le projet selon la grille du jury (100 pts) et notifie sa décision.",
    "6. En cas d'avis favorable, la convention de financement est signée avant le premier versement.",
    "",
    `Score de conformité au moment de l'export : ${state.comp?.score ?? "—"}/100.`,
    "Contacts utiles : Division de l'Action Sociale de votre province, coordinateur INDH régional.",
  ].join("\n");
}

function complianceText(state: HolderState): string {
  const { comp, proj } = state;
  if (!comp || !proj) return "";
  return [
    `COMPLIANCE REPORT — ${proj.projectName}`,
    "=".repeat(40),
    `Eligible: ${comp.eligible ? "yes" : "no"}`,
    `Score: ${comp.score}/100`,
    `Strengths: ${comp.strengths.join("; ")}`,
    `Weaknesses: ${comp.weaknesses.join("; ")}`,
    `Recommendations: ${comp.recommendations.join("; ")}`,
    `Jury score: ${JSON.stringify(comp.juryScore)}`,
  ].join("\n\n");
}

export default function StepExport({ lang, state, onRestart }: { lang: Lang; state: HolderState; onRestart: () => void }) {
  const tr = (k: string) => t(lang, k);
  const readiness = readinessPercent(state);
  const { done, total } = docsCompletion(state.docs);
  const [buildingPpt, setBuildingPpt] = useState(false);
  const [pptError, setPptError] = useState<string | null>(null);

  async function handleJuryPpt() {
    setBuildingPpt(true);
    setPptError(null);
    try {
      const { buildJuryPptx } = await import("../lib/pptx");
      const blob = await buildJuryPptx(state, lang);
      downloadBlob(`${state.cin}-presentation-jury.pptx`, blob);
    } catch (err) {
      console.error(err);
      setPptError(tr("exportPptError"));
    } finally {
      setBuildingPpt(false);
    }
  }

  return (
    <div>
      <div style={ui.eyebrow}>{tr("exportEyebrow")}</div>
      <h1 style={ui.h1}>{tr("exportTitle")}</h1>
      <p style={{ ...ui.subtitle, marginBottom: 24 }}>{tr("exportSubtitle")}</p>

      <div style={{ ...ui.card, marginBottom: 24, display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap" }}>
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: `conic-gradient(${COLORS.primaryDark} ${readiness * 3.6}deg, ${COLORS.border} 0deg)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              background: COLORS.surface,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 800,
              color: COLORS.onSurface,
            }}
          >
            {readiness}%
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.onSurfaceVariant, textTransform: "uppercase", marginBottom: 8 }}>
            {tr("exportReadiness")}
          </div>
          <div style={{ fontSize: 14, color: COLORS.onSurface }}>
            {tr("complianceScore")}: {state.comp?.score ?? 0}/100 · {tr("navDocuments")}: {done}/{total}
          </div>
          {state.proj && (
            <div style={{ fontSize: 14, color: COLORS.onSurface, marginTop: 4 }}>
              {tr("profileBudget")}: {formatMAD(state.proj.estimatedBudget)}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
        <button style={ui.btnSecondary} onClick={() => download(`${state.cin}-business-plan.txt`, planText(state))}>
          📄 {tr("exportDownloadPlan")}
        </button>
        <button style={ui.btnSecondary} onClick={() => download(`${state.cin}-budget.txt`, budgetText(state))}>
          💰 {tr("exportDownloadBudget")}
        </button>
        <button style={ui.btnSecondary} onClick={() => download(`${state.cin}-compliance.txt`, complianceText(state))}>
          🛡️ {tr("exportDownloadCompliance")}
        </button>
        <button
          style={ui.btnSecondary}
          onClick={() => download(`${state.cin}-checklist.txt`, documentsChecklistText(state, lang))}
        >
          📎 {tr("exportDownloadDocuments")}
        </button>
        <button
          style={ui.btnSecondary}
          onClick={() => download(`${state.cin}-guide-soumission.txt`, submissionGuideText(state, lang))}
        >
          📖 {tr("exportDownloadGuide")}
        </button>
        <button style={{ ...ui.btnSecondary, ...(buildingPpt ? ui.disabled : {}) }} onClick={handleJuryPpt} disabled={buildingPpt}>
          🎯 {buildingPpt ? tr("loading") : tr("exportDownloadJuryPpt")}
        </button>
      </div>
      {pptError && <p style={{ color: COLORS.red, fontSize: 12.5, marginTop: -12, marginBottom: 24 }}>{pptError}</p>}

      <div style={{ textAlign: "right", display: "flex", justifyContent: "flex-end", gap: 12 }}>
        <button style={ui.btnSecondary} onClick={onRestart}>
          {tr("exportNewProject")}
        </button>
        <button
          style={ui.btnPrimary}
          onClick={() =>
            download(
              `${state.cin}-dossier-complet.txt`,
              [
                planText(state),
                budgetText(state),
                complianceText(state),
                documentsChecklistText(state, lang),
                submissionGuideText(state, lang),
              ].join("\n\n" + "=".repeat(60) + "\n\n")
            )
          }
        >
          ⬇ {tr("exportDownloadAll")}
        </button>
      </div>
    </div>
  );
}
