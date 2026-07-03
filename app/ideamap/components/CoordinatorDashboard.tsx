"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import { COLORS, STEP_ORDER } from "../lib/constants";
import { t, dir, fontFamily } from "../lib/i18n";
import { Lang } from "../lib/types";
import { listHolders } from "../lib/storage";
import { readinessPercent, stepProgressPercent } from "../lib/utils";
import * as ui from "../lib/ui";

const STEP_LABEL_KEY: Record<string, string> = {
  idea: "navIdea",
  dialogue: "navDialogue",
  profile: "navProfile",
  plan: "navPlan",
  budget: "navBudget",
  compliance: "navCompliance",
  documents: "navDocuments",
  export: "navExport",
};

export default function CoordinatorDashboard({
  lang,
  setLang,
  coordCode,
  onLogout,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  coordCode: string;
  onLogout: () => void;
}) {
  const tr = (k: string) => t(lang, k);
  const [holders, setHolders] = useState(() => listHolders());

  useEffect(() => {
    setHolders(listHolders());
  }, []);

  return (
    <div dir={dir(lang)} style={{ minHeight: "100vh", background: COLORS.background, fontFamily: fontFamily(lang) }}>
      <header
        style={{
          background: COLORS.surface,
          borderBottom: `1px solid ${COLORS.border}`,
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Logo size={32} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: COLORS.onSurface }}>{tr("coordTitle")}</div>
            <div style={{ fontSize: 12, color: COLORS.onSurfaceVariant }}>{coordCode}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {(["fr", "ar", "en"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: l === lang ? 800 : 500,
                color: l === lang ? COLORS.primaryDark : COLORS.onSurfaceVariant,
              }}
            >
              {t(l, "langName")}
            </button>
          ))}
          <button onClick={onLogout} style={{ ...ui.btnSecondary, padding: "8px 16px", fontSize: 13 }}>
            {tr("logout")}
          </button>
        </div>
      </header>

      <div style={{ padding: 32, maxWidth: 1040, margin: "0 auto" }}>
        <p style={{ ...ui.subtitle, marginBottom: 24 }}>{tr("coordSubtitle")}</p>

        <div style={{ ...ui.card, padding: 0 }}>
          <div
            style={{
              padding: "16px 24px",
              borderBottom: `1px solid ${COLORS.border}`,
              fontWeight: 700,
              fontSize: 14,
              color: COLORS.onSurface,
            }}
          >
            {tr("coordHolders")} ({holders.length})
          </div>
          {holders.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: COLORS.onSurfaceVariant, fontSize: 14 }}>
              {tr("coordNoHolders")}
            </div>
          ) : (
            holders.map((h) => {
              const readiness = readinessPercent(h);
              const progress = stepProgressPercent(h);
              return (
                <div
                  key={h.cin}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    padding: "16px 24px",
                    borderBottom: `1px solid ${COLORS.border}`,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ minWidth: 160 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.onSurface }}>
                      {h.name || h.cin}
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.onSurfaceVariant }}>{h.cin}</div>
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.onSurfaceVariant, minWidth: 140 }}>
                    {tr("coordStep")}: <strong style={{ color: COLORS.onSurface }}>{tr(STEP_LABEL_KEY[h.step])}</strong>
                  </div>
                  <div style={{ flex: 1, minWidth: 140 }}>
                    <div style={{ fontSize: 11, color: COLORS.onSurfaceVariant, marginBottom: 4 }}>
                      {tr("coordProgress")} ({STEP_ORDER.indexOf(h.step) + 1}/{STEP_ORDER.length})
                    </div>
                    <div style={{ height: 6, borderRadius: 999, background: COLORS.border }}>
                      <div
                        style={{
                          width: `${progress}%`,
                          height: "100%",
                          borderRadius: 999,
                          background: COLORS.primaryDark,
                        }}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: COLORS.primaryDark,
                      minWidth: 60,
                      textAlign: "right",
                    }}
                  >
                    {readiness}%
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
