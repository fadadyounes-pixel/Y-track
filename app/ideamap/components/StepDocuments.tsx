"use client";

import { COLORS, REQUIRED_DOCUMENTS } from "../lib/constants";
import { t } from "../lib/i18n";
import { DocumentsState, Lang } from "../lib/types";
import { docsCompletion } from "../lib/utils";
import * as ui from "../lib/ui";

function DocRow({
  label,
  required,
  checked,
  onToggle,
  lang,
}: {
  label: string;
  required: boolean;
  checked: boolean;
  onToggle: () => void;
  lang: Lang;
}) {
  const tr = (k: string) => t(lang, k);
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 16px",
        borderBottom: `1px solid ${COLORS.border}`,
        cursor: "pointer",
      }}
    >
      <input type="checkbox" checked={checked} onChange={onToggle} style={{ width: 18, height: 18, accentColor: COLORS.primaryDark }} />
      <span style={{ flex: 1, fontSize: 14, color: COLORS.onSurface, fontWeight: 600 }}>{label}</span>
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          padding: "3px 10px",
          borderRadius: 999,
          background: required ? "#fef3c7" : COLORS.surfaceContainerLow,
          color: required ? "#92400e" : COLORS.onSurfaceVariant,
        }}
      >
        {required ? tr("documentsRequired") : tr("documentsOptional")}
      </span>
    </label>
  );
}

export default function StepDocuments({
  lang,
  docs,
  onToggle,
  onContinue,
}: {
  lang: Lang;
  docs: DocumentsState;
  onToggle: (id: string) => void;
  onContinue: () => void;
}) {
  const tr = (k: string) => t(lang, k);
  const { done, total } = docsCompletion(docs);

  return (
    <div>
      <div style={ui.eyebrow}>{tr("documentsEyebrow")}</div>
      <h1 style={ui.h1}>{tr("documentsTitle")}</h1>
      <p style={{ ...ui.subtitle, marginBottom: 16 }}>{tr("documentsSubtitle")}</p>

      <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ flex: 1, height: 8, borderRadius: 999, background: COLORS.border, overflow: "hidden" }}>
          <div
            style={{
              width: `${(done / total) * 100}%`,
              height: "100%",
              background: COLORS.primaryDark,
              transition: "width .3s",
            }}
          />
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.onSurface, whiteSpace: "nowrap" }}>
          {done}/{total}
        </div>
      </div>

      <div style={{ ...ui.card, padding: 0 }}>
        {REQUIRED_DOCUMENTS.map((d) => (
          <DocRow
            key={d.id}
            label={tr(`doc_${d.id}`)}
            required={d.required}
            checked={!!docs[d.id]}
            onToggle={() => onToggle(d.id)}
            lang={lang}
          />
        ))}
      </div>

      <div style={{ marginTop: 24, textAlign: "right" }}>
        <button onClick={onContinue} style={ui.btnPrimary}>
          {tr("documentsContinue")} →
        </button>
      </div>
    </div>
  );
}
