"use client";

import { useMemo, useState } from "react";
import IdeaMapMark from "./IdeaMapMark";
import { RE_HOLDER, RE_COORD, ADMIN_CODE } from "../lib/constants";
import { t, dir, fontFamily } from "../lib/i18n";
import { Lang, Role } from "../lib/types";
import { coordinatorExists, loadHolder, newHolderState, saveHolder } from "../lib/storage";

export interface AuthResult {
  role: Role;
  cin?: string;
  coordCode?: string;
}

// Navy / white / blue theme for the auth screen only — built around the
// IdeaMap brain+pin mark. Blue is reserved for the logo artwork itself; the
// rest of the page chrome stays strictly navy/white (plus the error color).
const AUTH_COLORS = {
  navy: "#0A0F2C",
  navySecondary: "#141B45",
  white: "#FFFFFF",
  ink: "#10132A",
  muted: "#5B6178",
  inputFill: "#F5F6F8",
  inputBorder: "#DDE0E8",
  error: "#C0632F",
};

type LiveRole = "holder" | "coordinator" | "admin" | "unknown" | "empty";

function detectRole(raw: string): LiveRole {
  const value = raw.trim();
  if (!value) return "empty";
  if (value === ADMIN_CODE) return "admin";
  if (RE_COORD.test(value)) return "coordinator";
  if (RE_HOLDER.test(value.toUpperCase())) return "holder";
  return "unknown";
}

const ROLE_META: Record<Exclude<LiveRole, "empty">, { icon: string; labelKey: string }> = {
  holder: { icon: "🎓", labelKey: "authRoleHolder" },
  coordinator: { icon: "👔", labelKey: "authRoleCoordinator" },
  admin: { icon: "⚙️", labelKey: "authRoleAdmin" },
  unknown: { icon: "❌", labelKey: "authRoleUnknown" },
};

// Holder CINs are typed in uppercase; coordinator (@NAMECOD) and admin
// (@adminINDH) codes are case-sensitive, so anything starting with "@" is
// left completely untouched.
function normalizeCodeInput(raw: string): string {
  return raw.startsWith("@") ? raw : raw.toUpperCase();
}

export default function AuthGate({
  lang,
  setLang,
  onAuth,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  onAuth: (r: AuthResult) => void;
}) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [needsSignup, setNeedsSignup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [hoveringSubmit, setHoveringSubmit] = useState(false);

  const tr = (k: string) => t(lang, k);
  const isRTL = dir(lang) === "rtl";
  const liveRole = useMemo(() => detectRole(code), [code]);
  const roleMeta = liveRole === "empty" ? null : ROLE_META[liveRole];
  const inputBorderColor = error ? AUTH_COLORS.error : AUTH_COLORS.inputBorder;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const value = code.trim();
    const upper = value.toUpperCase();

    if (needsSignup) {
      if (!name.trim()) return;
      const state = newHolderState(upper, name.trim());
      saveHolder(state);
      onAuth({ role: "holder", cin: state.cin });
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      // Holder CINs are case-insensitive (2 letters + digits); coordinator codes
      // and the admin code are case-sensitive, so only the CIN branch normalizes case.
      if (RE_HOLDER.test(upper)) {
        const existing = loadHolder(upper);
        if (existing) {
          onAuth({ role: "holder", cin: existing.cin });
        } else {
          setNeedsSignup(true);
        }
        return;
      }
      if (RE_COORD.test(value)) {
        if (coordinatorExists(value)) {
          onAuth({ role: "coordinator", coordCode: value });
        } else {
          setError(tr("authError"));
        }
        return;
      }
      if (value === ADMIN_CODE) {
        onAuth({ role: "admin" });
        return;
      }
      setError(tr("authError"));
    }, 350);
  }

  return (
    <main
      dir={dir(lang)}
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: AUTH_COLORS.navy,
        fontFamily: fontFamily(lang),
        padding: "20px 20px 32px",
        overflow: "hidden",
      }}
    >
      {/* Decorative network/line motif, echoing the logo's map imagery */}
      <svg
        aria-hidden
        width="420"
        height="420"
        viewBox="0 0 420 420"
        style={{ position: "absolute", top: -60, [isRTL ? "right" : "left"]: -80, opacity: 0.08 }}
      >
        <g stroke={AUTH_COLORS.white} strokeWidth="1.5" fill={AUTH_COLORS.white}>
          <line x1="30" y1="60" x2="120" y2="30" />
          <line x1="120" y1="30" x2="210" y2="90" />
          <line x1="210" y1="90" x2="180" y2="180" />
          <line x1="180" y1="180" x2="80" y2="200" />
          <line x1="80" y1="200" x2="30" y2="60" />
          <line x1="210" y1="90" x2="300" y2="60" />
          <circle cx="30" cy="60" r="5" />
          <circle cx="120" cy="30" r="5" />
          <circle cx="210" cy="90" r="5" />
          <circle cx="180" cy="180" r="5" />
          <circle cx="80" cy="200" r="5" />
          <circle cx="300" cy="60" r="5" />
        </g>
      </svg>
      <svg
        aria-hidden
        width="520"
        height="520"
        viewBox="0 0 520 520"
        style={{ position: "absolute", bottom: -140, [isRTL ? "left" : "right"]: -160, opacity: 0.06 }}
      >
        <circle cx="260" cy="260" r="200" fill="none" stroke={AUTH_COLORS.white} strokeWidth="1.5" />
        <circle cx="260" cy="260" r="140" fill="none" stroke={AUTH_COLORS.white} strokeWidth="1.5" />
      </svg>

      <div style={{ position: "fixed", top: 20, [isRTL ? "left" : "right"]: 24, display: "flex", gap: 14, zIndex: 2 }}>
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
              color: l === lang ? AUTH_COLORS.white : AUTH_COLORS.muted,
            }}
          >
            {t(l, "langName")}
          </button>
        ))}
      </div>

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: 400 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
          <IdeaMapMark size={92} />
          <div
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: AUTH_COLORS.white,
              marginTop: 16,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Idea<span style={{ color: "#2B5CFF" }}>Map</span>
          </div>
        </div>

        <div
          style={{
            width: "100%",
            background: AUTH_COLORS.white,
            borderRadius: 16,
            padding: "36px 32px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: AUTH_COLORS.ink }}>{tr("authTitle")}</div>
            <p style={{ fontSize: 13.5, color: AUTH_COLORS.muted, marginTop: 6 }}>
              {needsSignup ? tr("authNewHolder") : tr("authSubtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {!needsSignup && (
              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: AUTH_COLORS.muted,
                    textTransform: "uppercase",
                    letterSpacing: 0.6,
                    marginBottom: 8,
                  }}
                >
                  {tr("authCodeLabel")}
                </label>
                <input
                  value={code}
                  onChange={(e) => {
                    setCode(normalizeCodeInput(e.target.value));
                    setError(null);
                  }}
                  placeholder={tr("authCodePlaceholder")}
                  required
                  autoFocus
                  style={{
                    width: "100%",
                    padding: "13px 14px",
                    border: `1.5px solid ${inputBorderColor}`,
                    borderRadius: 10,
                    background: AUTH_COLORS.inputFill,
                    fontFamily: "'Courier New', monospace",
                    fontSize: 16,
                    fontWeight: 700,
                    letterSpacing: 1,
                    color: AUTH_COLORS.ink,
                    outline: "none",
                    boxSizing: "border-box",
                    textAlign: "center",
                    transition: "border-color .15s",
                  }}
                />
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 10, minHeight: 20 }}>
                  {roleMeta && (
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: AUTH_COLORS.ink, display: "flex", alignItems: "center", gap: 6 }}>
                      <span>{roleMeta.icon}</span>
                      {tr(roleMeta.labelKey)}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 11, color: AUTH_COLORS.muted, marginTop: 4, textAlign: "center" }}>{tr("authCodeHint")}</p>
              </div>
            )}

            {needsSignup && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: AUTH_COLORS.muted, textAlign: "center", marginBottom: 16 }}>
                  {code.trim().toUpperCase()}
                </div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={tr("authNamePlaceholder")}
                  required
                  autoFocus
                  style={{
                    width: "100%",
                    padding: "13px 14px",
                    border: `1.5px solid ${AUTH_COLORS.inputBorder}`,
                    borderRadius: 10,
                    background: AUTH_COLORS.inputFill,
                    fontSize: 15,
                    fontWeight: 600,
                    color: AUTH_COLORS.ink,
                    outline: "none",
                    boxSizing: "border-box",
                    textAlign: "center",
                  }}
                />
              </div>
            )}

            {error && (
              <p style={{ color: AUTH_COLORS.error, fontSize: 12.5, fontWeight: 600, textAlign: "center", marginBottom: 16 }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              onMouseEnter={() => setHoveringSubmit(true)}
              onMouseLeave={() => setHoveringSubmit(false)}
              style={{
                width: "100%",
                background: AUTH_COLORS.navy,
                color: AUTH_COLORS.white,
                border: "none",
                borderRadius: 10,
                padding: "13px 16px",
                fontSize: 15,
                fontWeight: 700,
                cursor: submitting ? "default" : "pointer",
                opacity: submitting ? 0.7 : 1,
                transform: hoveringSubmit && !submitting ? "translateY(-2px)" : "none",
                boxShadow: hoveringSubmit && !submitting ? "0 8px 20px rgba(10,15,44,0.35)" : "none",
                transition: "transform .15s, box-shadow .15s",
              }}
            >
              {submitting ? tr("loading") : needsSignup ? tr("authCreateAccount") : `${tr("authSubmit")} →`}
            </button>

            {needsSignup && (
              <button
                type="button"
                onClick={() => {
                  setNeedsSignup(false);
                  setName("");
                }}
                style={{
                  width: "100%",
                  background: "transparent",
                  color: AUTH_COLORS.muted,
                  border: "none",
                  padding: "14px 0 0",
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {tr("authBackToLogin")}
              </button>
            )}
          </form>
        </div>

        <p
          style={{
            fontSize: 10.5,
            color: AUTH_COLORS.muted,
            textTransform: "uppercase",
            letterSpacing: 1.5,
            marginTop: 28,
          }}
        >
          {tr("authOfficialPortal")}
        </p>
      </div>
    </main>
  );
}
