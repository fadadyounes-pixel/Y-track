"use client";

import { COLORS } from "../lib/constants";
import { t, pillarLabel } from "../lib/i18n";
import { Lang, ProjectProfile } from "../lib/types";
import { formatMAD } from "../lib/utils";
import * as ui from "../lib/ui";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.onSurfaceVariant, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.onSurface }}>{value}</div>
    </div>
  );
}

export default function StepProfile({
  lang,
  proj,
  busy,
  onConfirm,
}: {
  lang: Lang;
  proj: ProjectProfile;
  busy: boolean;
  onConfirm: () => void;
}) {
  const tr = (k: string) => t(lang, k);

  return (
    <div>
      <div style={ui.eyebrow}>{tr("profileEyebrow")}</div>
      <h1 style={ui.h1}>{proj.projectName || tr("profileTitle")}</h1>
      <p style={{ ...ui.subtitle, marginBottom: 24 }}>{tr("profileSubtitle")}</p>

      <div style={ui.card}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 24, marginBottom: 24 }}>
          <Field label={tr("profileSector")} value={proj.sector} />
          <Field label={tr("profileLegal")} value={proj.legalStructure} />
          <Field label={tr("profileLocation")} value={proj.location} />
          <Field label={tr("profileBeneficiaries")} value={proj.beneficiaries} />
          <Field label={tr("profilePillar")} value={pillarLabel(lang, proj.pillar)} />
          <Field label={tr("profileBudget")} value={formatMAD(proj.estimatedBudget)} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.onSurfaceVariant, textTransform: "uppercase", marginBottom: 8 }}>
              {tr("profileActivities")}
            </div>
            <ul style={{ margin: 0, paddingInlineStart: 20, fontSize: 14, color: COLORS.onSurface, lineHeight: 1.8 }}>
              {proj.activities.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.onSurfaceVariant, textTransform: "uppercase", marginBottom: 8 }}>
              {tr("profileStrengths")}
            </div>
            <ul style={{ margin: 0, paddingInlineStart: 20, fontSize: 14, color: COLORS.onSurface, lineHeight: 1.8 }}>
              {proj.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ marginTop: 28, textAlign: "right" }}>
          <button onClick={onConfirm} disabled={busy} style={{ ...ui.btnPrimary, ...(busy ? ui.disabled : {}) }}>
            {busy ? tr("loading") : tr("profileConfirm")} →
          </button>
        </div>
      </div>
    </div>
  );
}
