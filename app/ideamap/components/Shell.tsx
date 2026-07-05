"use client";

import Logo from "./Logo";
import { COLORS, STEP_ORDER } from "../lib/constants";
import { t, dir, fontFamily } from "../lib/i18n";
import { Lang, StepId } from "../lib/types";

const STEP_ICON: Record<StepId, string> = {
  info: "🪪",
  idea: "💡",
  dialogue: "💬",
  profile: "🪪",
  plan: "🗺️",
  budget: "💰",
  logo: "🎨",
  compliance: "🛡️",
  documents: "📎",
  export: "📤",
};

const STEP_NAV_KEY: Record<StepId, string> = {
  info: "navInfo",
  idea: "navIdea",
  dialogue: "navDialogue",
  profile: "navProfile",
  plan: "navPlan",
  budget: "navBudget",
  logo: "navLogo",
  compliance: "navCompliance",
  documents: "navDocuments",
  export: "navExport",
};

export default function Shell({
  lang,
  setLang,
  step,
  furthestStepIndex,
  onStepClick,
  onLogout,
  title,
  children,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  step: StepId;
  furthestStepIndex: number;
  onStepClick: (s: StepId) => void;
  onLogout: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const tr = (k: string) => t(lang, k);
  const activeIdx = STEP_ORDER.indexOf(step);
  const isRTL = dir(lang) === "rtl";

  return (
    <div dir={dir(lang)} style={{ minHeight: "100vh", background: COLORS.background, fontFamily: fontFamily(lang) }}>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <aside
          style={{
            width: 260,
            flexShrink: 0,
            background: COLORS.inverseSurface,
            color: COLORS.inverseOnSurface,
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            [isRTL ? "right" : "left"]: 0,
            top: 0,
            height: "100vh",
          }}
        >
          <div style={{ padding: "24px 20px", display: "flex", alignItems: "center", gap: 12 }}>
            <Logo size={36} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>{tr("appName")}</div>
              <div style={{ fontSize: 10, opacity: 0.6, textTransform: "uppercase", letterSpacing: 1 }}>
                {tr("navWorkflow")}
              </div>
            </div>
          </div>
          <nav style={{ flex: 1, padding: "8px 12px", overflowY: "auto" }}>
            {STEP_ORDER.map((s, idx) => {
              const active = s === step;
              const reachable = idx <= furthestStepIndex;
              return (
                <button
                  key={s}
                  onClick={() => reachable && onStepClick(s)}
                  disabled={!reachable}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 14px",
                    marginBottom: 4,
                    borderRadius: 8,
                    border: "none",
                    textAlign: isRTL ? "right" : "left",
                    background: active ? "rgba(255,255,255,0.08)" : "transparent",
                    color: active ? "white" : reachable ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.3)",
                    fontWeight: active ? 700 : 500,
                    fontSize: 13,
                    cursor: reachable ? "pointer" : "default",
                    boxShadow: active ? `inset ${isRTL ? "-3px" : "3px"} 0 0 ${COLORS.primary}` : "none",
                  }}
                >
                  <span style={{ fontSize: 15 }}>{STEP_ICON[s]}</span>
                  <span style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>{tr(STEP_NAV_KEY[s])}</span>
                  {idx < furthestStepIndex && <span style={{ marginInlineStart: "auto", color: COLORS.primary }}>✓</span>}
                </button>
              );
            })}
          </nav>
          <div style={{ padding: 16, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <button
              onClick={onLogout}
              style={{
                width: "100%",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 8,
                color: "rgba(255,255,255,0.8)",
                padding: "10px 12px",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {tr("logout")}
            </button>
          </div>
        </aside>

        <main style={{ flex: 1, [isRTL ? "marginRight" : "marginLeft"]: 260, display: "flex", flexDirection: "column" }}>
          <header
            style={{
              height: 64,
              background: COLORS.surface,
              borderBottom: `1px solid ${COLORS.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 28px",
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 18, color: COLORS.onSurface }}>{title}</div>
            <div style={{ display: "flex", gap: 12 }}>
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
            </div>
          </header>
          <div style={{ flex: 1, padding: 28 }}>
            <div style={{ maxWidth: 920, margin: "0 auto" }}>{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
