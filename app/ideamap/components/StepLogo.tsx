"use client";

import { useState } from "react";
import { COLORS } from "../lib/constants";
import { t } from "../lib/i18n";
import { renderLogoSvg } from "../lib/logo";
import { Lang, LogoState } from "../lib/types";
import * as ui from "../lib/ui";

function LogoPreview({ logo, size = 120 }: { logo: LogoState; size?: number }) {
  if (logo.source === "uploaded" && logo.imageDataUrl) {
    return (
      <img
        src={logo.imageDataUrl}
        alt="Logo"
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          borderRadius: "50%",
          border: `1px solid ${COLORS.border}`,
          background: COLORS.surface,
        }}
      />
    );
  }
  if (logo.source === "generated" && logo.concept) {
    return <div style={{ width: size, height: size }} dangerouslySetInnerHTML={{ __html: renderLogoSvg(logo.concept, size) }} />;
  }
  return null;
}

export default function StepLogo({
  lang,
  logo,
  busy,
  onGenerate,
  onUpload,
  onRemove,
  onContinue,
}: {
  lang: Lang;
  logo: LogoState | null;
  busy: boolean;
  onGenerate: () => void;
  onUpload: (file: File) => Promise<string | null>;
  onRemove: () => void;
  onContinue: () => void;
}) {
  const tr = (k: string) => t(lang, k);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError(await onUpload(file));
    setUploading(false);
  }

  return (
    <div>
      <div style={ui.eyebrow}>{tr("logoEyebrow")}</div>
      <h1 style={ui.h1}>{tr("logoTitle")}</h1>
      <p style={{ ...ui.subtitle, marginBottom: 24 }}>{tr("logoSubtitle")}</p>

      <div style={ui.card}>
        {logo ? (
          <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            <LogoPreview logo={logo} />
            <div style={{ flex: 1, minWidth: 200 }}>
              {logo.source === "generated" && logo.concept && (
                <p style={{ fontSize: 14, color: COLORS.onSurface, fontStyle: "italic", margin: "0 0 12px" }}>
                  “{logo.concept.tagline}”
                </p>
              )}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {logo.source === "generated" && (
                  <button onClick={onGenerate} disabled={busy} style={{ ...ui.btnSecondary, ...(busy ? ui.disabled : {}) }}>
                    {busy ? tr("loading") : `🔄 ${tr("logoRegenerate")}`}
                  </button>
                )}
                <label htmlFor="logo-upload" style={{ ...ui.btnSecondary, cursor: "pointer" }}>
                  {uploading ? tr("loading") : `📎 ${tr("logoReplace")}`}
                </label>
                <button onClick={onRemove} style={{ ...ui.btnSecondary, color: COLORS.red, borderColor: COLORS.red }}>
                  {tr("documentsRemove")}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <div
              style={{
                border: `1.5px dashed ${COLORS.border}`,
                borderRadius: 10,
                padding: 24,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 10 }}>📎</div>
              <p style={{ fontSize: 13, color: COLORS.onSurfaceVariant, margin: "0 0 14px" }}>{tr("logoHaveOne")}</p>
              <label htmlFor="logo-upload" style={{ ...ui.btnPrimary, cursor: "pointer", display: "inline-flex" }}>
                {uploading ? tr("loading") : tr("logoUploadCta")}
              </label>
            </div>
            <div
              style={{
                border: `1.5px dashed ${COLORS.border}`,
                borderRadius: 10,
                padding: 24,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 10 }}>🎨</div>
              <p style={{ fontSize: 13, color: COLORS.onSurfaceVariant, margin: "0 0 14px" }}>{tr("logoNoneYet")}</p>
              <button onClick={onGenerate} disabled={busy} style={{ ...ui.btnPrimary, ...(busy ? ui.disabled : {}) }}>
                {busy ? tr("loading") : tr("logoGenerateCta")}
              </button>
            </div>
          </div>
        )}
        <input id="logo-upload" type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
        {error && <p style={{ fontSize: 12.5, color: COLORS.red, marginTop: 14 }}>{error}</p>}
      </div>

      <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end", gap: 12 }}>
        {!logo && (
          <button onClick={onContinue} style={ui.btnSecondary}>
            {tr("logoSkip")}
          </button>
        )}
        <button onClick={onContinue} style={ui.btnPrimary}>
          {tr("next")} →
        </button>
      </div>
    </div>
  );
}
