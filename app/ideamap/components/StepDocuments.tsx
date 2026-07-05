"use client";

import { useState } from "react";
import { COLORS, REQUIRED_DOCUMENTS } from "../lib/constants";
import { t } from "../lib/i18n";
import { DocumentsState, Lang, UploadsState } from "../lib/types";
import { docsCompletion } from "../lib/utils";
import * as ui from "../lib/ui";

function DocRow({
  id,
  label,
  required,
  checked,
  upload,
  onToggle,
  onUpload,
  onRemoveUpload,
  lang,
}: {
  id: string;
  label: string;
  required: boolean;
  checked: boolean;
  upload?: UploadsState[string];
  onToggle: () => void;
  onUpload: (file: File) => Promise<string | null>;
  onRemoveUpload: () => void;
  lang: Lang;
}) {
  const tr = (k: string) => t(lang, k);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const inputId = `upload-${id}`;

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setError(await onUpload(file));
    setBusy(false);
  }

  return (
    <div style={{ borderBottom: `1px solid ${COLORS.border}` }}>
      <label style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          style={{ width: 18, height: 18, accentColor: COLORS.primaryDark }}
        />
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
      <div style={{ padding: "0 16px 14px 48px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        {upload ? (
          <>
            <span style={{ fontSize: 12.5, color: COLORS.onSurfaceVariant, wordBreak: "break-all" }}>
              📎 {upload.fileName}
            </span>
            <label htmlFor={inputId} style={{ fontSize: 12, fontWeight: 600, color: COLORS.primaryDark, cursor: "pointer" }}>
              {tr("documentsReplace")}
            </label>
            <button
              type="button"
              onClick={onRemoveUpload}
              style={{ fontSize: 12, fontWeight: 600, color: COLORS.red, background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              {tr("documentsRemove")}
            </button>
          </>
        ) : (
          <label htmlFor={inputId} style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.primaryDark, cursor: "pointer" }}>
            {busy ? tr("loading") : `📎 ${tr("documentsUpload")}`}
          </label>
        )}
        <input id={inputId} type="file" accept="image/*,application/pdf" onChange={handleFile} style={{ display: "none" }} />
        {error && <span style={{ fontSize: 11.5, color: COLORS.red }}>{error}</span>}
      </div>
    </div>
  );
}

export default function StepDocuments({
  lang,
  docs,
  uploads,
  onToggle,
  onUpload,
  onRemoveUpload,
  onContinue,
}: {
  lang: Lang;
  docs: DocumentsState;
  uploads: UploadsState;
  onToggle: (id: string) => void;
  onUpload: (id: string, file: File) => Promise<string | null>;
  onRemoveUpload: (id: string) => void;
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
            id={d.id}
            label={tr(`doc_${d.id}`)}
            required={d.required}
            checked={!!docs[d.id]}
            upload={uploads[d.id]}
            onToggle={() => onToggle(d.id)}
            onUpload={(file) => onUpload(d.id, file)}
            onRemoveUpload={() => onRemoveUpload(d.id)}
            lang={lang}
          />
        ))}
      </div>
      <p style={{ fontSize: 12, color: COLORS.onSurfaceVariant, marginTop: 10 }}>{tr("documentsUploadNote")}</p>

      <div style={{ marginTop: 24, textAlign: "right" }}>
        <button onClick={onContinue} style={ui.btnPrimary}>
          {tr("documentsContinue")} →
        </button>
      </div>
    </div>
  );
}
