"use client";

import { useState } from "react";
import { COLORS } from "../lib/constants";
import { t } from "../lib/i18n";
import { Lang } from "../lib/types";
import * as ui from "../lib/ui";

export default function StepIdea({
  lang,
  initialIdea,
  onSubmit,
}: {
  lang: Lang;
  initialIdea: string;
  onSubmit: (idea: string) => void;
}) {
  const [idea, setIdea] = useState(initialIdea);
  const tr = (k: string) => t(lang, k);

  return (
    <div>
      <div style={ui.eyebrow}>{tr("ideaEyebrow")}</div>
      <h1 style={ui.h1}>{tr("ideaTitle")}</h1>
      <p style={{ ...ui.subtitle, marginBottom: 32 }}>{tr("ideaSubtitle")}</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (idea.trim()) onSubmit(idea.trim());
        }}
        style={ui.card}
      >
        <label style={ui.label} htmlFor="idea">
          {tr("ideaLabel")}
        </label>
        <p style={{ fontSize: 13, color: COLORS.onSurfaceVariant, marginTop: 0, marginBottom: 16 }}>
          {tr("ideaHelp")}
        </p>
        <textarea
          id="idea"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder={tr("ideaPlaceholder")}
          rows={7}
          style={ui.textarea}
          required
        />
        <div
          style={{
            marginTop: 24,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              color: COLORS.onSurfaceVariant,
              background: COLORS.surfaceContainerLow,
              padding: "8px 14px",
              borderRadius: 8,
            }}
          >
            🔒 {tr("ideaEncrypted")}
          </div>
          <button type="submit" style={ui.btnPrimary} disabled={!idea.trim()}>
            {tr("ideaSubmit")} →
          </button>
        </div>
      </form>
    </div>
  );
}
