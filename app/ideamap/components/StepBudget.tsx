"use client";

import { COLORS } from "../lib/constants";
import { t } from "../lib/i18n";
import { Budget, Lang } from "../lib/types";
import { formatMAD } from "../lib/utils";
import * as ui from "../lib/ui";

export default function StepBudget({
  lang,
  budget,
  onContinue,
}: {
  lang: Lang;
  budget: Budget;
  onContinue: () => void;
}) {
  const tr = (k: string) => t(lang, k);
  const total = budget.items.reduce((s, it) => s + it.total, 0);

  return (
    <div>
      <div style={ui.eyebrow}>{tr("budgetEyebrow")}</div>
      <h1 style={ui.h1}>{tr("budgetTitle")}</h1>
      <p style={{ ...ui.subtitle, marginBottom: 24 }}>{tr("budgetSubtitle")}</p>

      <div style={{ ...ui.card, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr>
                {[tr("budgetCategory"), tr("budgetItem"), tr("budgetQty"), tr("budgetUnit"), tr("budgetTotal")].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "12px 16px",
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        color: COLORS.onSurfaceVariant,
                        background: COLORS.surfaceContainerLow,
                        borderBottom: `1px solid ${COLORS.border}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {budget.items.map((it, i) => (
                <tr key={i}>
                  <td style={{ padding: "12px 16px", borderBottom: `1px solid ${COLORS.border}` }}>{it.category}</td>
                  <td style={{ padding: "12px 16px", borderBottom: `1px solid ${COLORS.border}` }}>{it.item}</td>
                  <td style={{ padding: "12px 16px", borderBottom: `1px solid ${COLORS.border}` }}>{it.quantity}</td>
                  <td style={{ padding: "12px 16px", borderBottom: `1px solid ${COLORS.border}` }}>
                    {formatMAD(it.unitPrice)}
                  </td>
                  <td style={{ padding: "12px 16px", borderBottom: `1px solid ${COLORS.border}`, fontWeight: 700 }}>
                    {formatMAD(it.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ padding: 24, display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "flex-end" }}>
          <div
            style={{
              background: COLORS.surfaceContainerLow,
              borderRadius: 10,
              padding: "12px 20px",
              textAlign: "right",
            }}
          >
            <div style={{ fontSize: 11, color: COLORS.onSurfaceVariant, fontWeight: 700 }}>{tr("budgetIndh")}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.primaryDark }}>
              {formatMAD(budget.indhContribution)}
            </div>
          </div>
          <div
            style={{
              background: COLORS.surfaceContainerLow,
              borderRadius: 10,
              padding: "12px 20px",
              textAlign: "right",
            }}
          >
            <div style={{ fontSize: 11, color: COLORS.onSurfaceVariant, fontWeight: 700 }}>{tr("budgetHolder")}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.onSurface }}>
              {formatMAD(budget.beneficiaryContribution)}
            </div>
          </div>
          <div style={{ background: COLORS.primaryDark, borderRadius: 10, padding: "12px 20px", textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", fontWeight: 700 }}>
              {tr("budgetGrandTotal")}
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "white" }}>{formatMAD(total)}</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24, textAlign: "right" }}>
        <button onClick={onContinue} style={ui.btnPrimary}>
          {tr("budgetContinue")} →
        </button>
      </div>
    </div>
  );
}
