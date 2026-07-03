"use client";

import { COLORS } from "../lib/constants";
import { t } from "../lib/i18n";
import { BusinessPlan, Lang } from "../lib/types";
import { formatMAD } from "../lib/utils";
import * as ui from "../lib/ui";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.onSurfaceVariant, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ fontSize: 14, color: COLORS.onSurface, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

export default function StepPlan({
  lang,
  plan,
  onContinue,
}: {
  lang: Lang;
  plan: BusinessPlan;
  onContinue: () => void;
}) {
  const tr = (k: string) => t(lang, k);

  return (
    <div>
      <div style={ui.eyebrow}>{tr("planEyebrow")}</div>
      <h1 style={ui.h1}>{tr("planTitle")}</h1>

      <div style={ui.card}>
        <Section title={tr("planSummary")}>{plan.executiveSummary}</Section>
        <Section title={tr("planProblem")}>{plan.problemStatement}</Section>
        <Section title={tr("planSolution")}>{plan.solution}</Section>
        <Section title={tr("planMarket")}>{plan.marketAnalysis}</Section>
        <Section title={tr("planModel")}>{plan.businessModel}</Section>
        <Section title={tr("planImpact")}>{plan.socialImpact}</Section>
        <Section title={tr("planOps")}>{plan.operationalPlan}</Section>
        <Section title={tr("planAlignment")}>{plan.indh_alignment}</Section>

        <Section title={tr("planRisks")}>
          <ul style={{ margin: 0, paddingInlineStart: 20 }}>
            {plan.risks.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </Section>

        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.onSurfaceVariant, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
            {tr("planProjections")}
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {(["year1", "year2", "year3"] as const).map((y, i) => (
              <div
                key={y}
                style={{
                  flex: 1,
                  background: COLORS.surfaceContainerLow,
                  borderRadius: 10,
                  padding: 16,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 11, color: COLORS.onSurfaceVariant, fontWeight: 700, marginBottom: 4 }}>
                  {`Année ${i + 1}`}
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.primaryDark }}>
                  {formatMAD(plan.projections[y])}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 28, textAlign: "right" }}>
          <button onClick={onContinue} style={ui.btnPrimary}>
            {tr("planContinue")} →
          </button>
        </div>
      </div>
    </div>
  );
}
