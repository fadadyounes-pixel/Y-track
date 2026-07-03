"use client";

import { COLORS, JURY_GRID } from "../lib/constants";
import { t } from "../lib/i18n";
import { ComplianceReport, Lang } from "../lib/types";
import * as ui from "../lib/ui";

const JURY_LABEL_KEY: Record<string, string> = {
  impact: "jury_impact",
  viability: "jury_viability",
  relevance: "jury_relevance",
  management: "jury_management",
  sustainability: "jury_sustainability",
  innovation: "jury_innovation",
};

export default function StepCompliance({
  lang,
  comp,
  onContinue,
}: {
  lang: Lang;
  comp: ComplianceReport;
  onContinue: () => void;
}) {
  const tr = (k: string) => t(lang, k);

  return (
    <div>
      <div style={ui.eyebrow}>{tr("complianceEyebrow")}</div>
      <h1 style={ui.h1}>{tr("complianceTitle")}</h1>

      <div style={ui.card}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 28, flexWrap: "wrap" }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              background: `conic-gradient(${COLORS.primaryDark} ${comp.score * 3.6}deg, ${COLORS.border} 0deg)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: "50%",
                background: COLORS.surface,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 800,
                color: COLORS.onSurface,
              }}
            >
              {comp.score}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.onSurfaceVariant, textTransform: "uppercase" }}>
              {tr("complianceScore")}
            </div>
            <div
              style={{
                marginTop: 6,
                display: "inline-block",
                padding: "6px 14px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 700,
                background: comp.eligible ? "#d1fae5" : COLORS.redContainer,
                color: comp.eligible ? "#065f46" : COLORS.red,
              }}
            >
              {comp.eligible ? tr("complianceEligible") : tr("complianceNotEligible")}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.onSurfaceVariant, textTransform: "uppercase", marginBottom: 12 }}>
            {tr("complianceJury")}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
            {JURY_GRID.map(({ key, points }) => {
              const value = comp.juryScore[key as keyof typeof comp.juryScore];
              return (
                <div key={key} style={{ background: COLORS.surfaceContainerLow, borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 11, color: COLORS.onSurfaceVariant, fontWeight: 700, marginBottom: 4 }}>
                    {tr(JURY_LABEL_KEY[key])}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.onSurface }}>
                    {value} <span style={{ fontSize: 12, fontWeight: 500, color: COLORS.onSurfaceVariant }}>/ {points}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.onSurfaceVariant, textTransform: "uppercase", marginBottom: 8 }}>
              {tr("complianceStrengths")}
            </div>
            <ul style={{ margin: 0, paddingInlineStart: 20, fontSize: 14, lineHeight: 1.8 }}>
              {comp.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.onSurfaceVariant, textTransform: "uppercase", marginBottom: 8 }}>
              {tr("complianceWeaknesses")}
            </div>
            <ul style={{ margin: 0, paddingInlineStart: 20, fontSize: 14, lineHeight: 1.8 }}>
              {comp.weaknesses.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.onSurfaceVariant, textTransform: "uppercase", marginBottom: 8 }}>
              {tr("complianceRecommendations")}
            </div>
            <ul style={{ margin: 0, paddingInlineStart: 20, fontSize: 14, lineHeight: 1.8 }}>
              {comp.recommendations.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ marginTop: 28, textAlign: "right" }}>
          <button onClick={onContinue} style={ui.btnPrimary}>
            {tr("complianceContinue")} →
          </button>
        </div>
      </div>
    </div>
  );
}
