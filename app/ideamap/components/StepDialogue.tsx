"use client";

import { useState } from "react";
import { COLORS } from "../lib/constants";
import { t } from "../lib/i18n";
import { ChatMessage, Lang } from "../lib/types";
import * as ui from "../lib/ui";

export default function StepDialogue({
  lang,
  msgs,
  qN,
  busy,
  onSend,
}: {
  lang: Lang;
  msgs: ChatMessage[];
  qN: number;
  busy: boolean;
  onSend: (answer: string) => void;
}) {
  const [answer, setAnswer] = useState("");
  const tr = (k: string) => t(lang, k);

  return (
    <div>
      <div style={ui.eyebrow}>{tr("dialogueEyebrow")}</div>
      <h1 style={ui.h1}>{tr("dialogueTitle")}</h1>
      <p style={{ ...ui.subtitle, marginBottom: 24 }}>{tr("dialogueSubtitle")}</p>

      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            style={{
              flex: 1,
              height: 6,
              borderRadius: 999,
              background: n <= qN ? COLORS.primaryDark : COLORS.border,
            }}
          />
        ))}
      </div>

      <div style={{ ...ui.card, padding: 0, display: "flex", flexDirection: "column", minHeight: 420 }}>
        <div style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          {msgs.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf: m.role === "assistant" ? "flex-start" : "flex-end",
                maxWidth: "80%",
                background: m.role === "assistant" ? COLORS.surfaceContainerLow : COLORS.primaryDark,
                color: m.role === "assistant" ? COLORS.onSurface : "white",
                padding: "12px 16px",
                borderRadius: 14,
                fontSize: 14,
                lineHeight: 1.5,
                whiteSpace: "pre-wrap",
              }}
            >
              {m.content}
            </div>
          ))}
          {busy && (
            <div
              style={{
                alignSelf: "flex-start",
                color: COLORS.onSurfaceVariant,
                fontSize: 13,
                fontStyle: "italic",
              }}
            >
              {tr("loading")}
            </div>
          )}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (answer.trim() && !busy) {
              onSend(answer.trim());
              setAnswer("");
            }
          }}
          style={{
            display: "flex",
            gap: 12,
            padding: 16,
            borderTop: `1px solid ${COLORS.border}`,
          }}
        >
          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={tr("dialoguePlaceholder")}
            disabled={busy}
            style={{ ...ui.input, flex: 1 }}
          />
          <button type="submit" style={ui.btnPrimary} disabled={busy || !answer.trim()}>
            {tr("dialogueSend")}
          </button>
        </form>
      </div>
    </div>
  );
}
