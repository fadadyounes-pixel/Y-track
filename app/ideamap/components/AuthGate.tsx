"use client";

import { useMemo, useState } from "react";
import Logo from "./Logo";
import { RADIUS, RE_HOLDER, RE_COORD, ADMIN_CODE } from "../lib/constants";
import { t, dir, fontFamily } from "../lib/i18n";
import { Lang, Role } from "../lib/types";
import { coordinatorExists, loadHolder, newHolderState, saveHolder } from "../lib/storage";

export interface AuthResult {
  role: Role;
  cin?: string;
  coordCode?: string;
}

// Dark theme for the auth screen only — the rest of the app stays on the
// light `COLORS` palette from lib/constants.ts.
const AUTH_COLORS = {
  bg: "#06111f",
  card: "#0f2540",
  border: "#1a3a55",
  white: "#f0f4f8",
  muted: "#6b8aaa",
  mutedBright: "#8fadc8",
  body: "#c8daf0",
  teal: "#1aabaa",
  purple: "#9050d0",
  green: "#1db87a",
  red: "#dc4c3c",
  gold: "#e8b84b",
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

const ROLE_META: Record<Exclude<LiveRole, "empty">, { color: string; icon: string; labelKey: string }> = {
  holder: { color: AUTH_COLORS.teal, icon: "🎓", labelKey: "authRoleHolder" },
  coordinator: { color: AUTH_COLORS.purple, icon: "👔", labelKey: "authRoleCoordinator" },
  admin: { color: AUTH_COLORS.green, icon: "⚙️", labelKey: "authRoleAdmin" },
  unknown: { color: AUTH_COLORS.red, icon: "❌", labelKey: "authRoleUnknown" },
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

  const tr = (k: string) => t(lang, k);
  const isRTL = dir(lang) === "rtl";
  const liveRole = useMemo(() => detectRole(code), [code]);
  const roleMeta = liveRole === "empty" ? null : ROLE_META[liveRole];
  const accentColor = error ? AUTH_COLORS.red : roleMeta?.color ?? AUTH_COLORS.teal;

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
        background: AUTH_COLORS.bg,
        fontFamily: fontFamily(lang),
        padding: "20px 20px 32px",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -120,
          [isRTL ? "right" : "left"]: -120,
          width: 340,
          height: 340,
          borderRadius: "50%",
          background: AUTH_COLORS.gold,
          opacity: 0.18,
          filter: "blur(90px)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -140,
          [isRTL ? "left" : "right"]: -140,
          width: 380,
          height: 380,
          borderRadius: "50%",
          background: AUTH_COLORS.teal,
          opacity: 0.18,
          filter: "blur(100px)",
        }}
      />

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

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 400,
          background: AUTH_COLORS.card,
          border: `1px solid ${AUTH_COLORS.border}`,
          borderRadius: 22,
          padding: "36px 32px",
          zIndex: 1,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32 }}>
          <Logo size={72} markColor={AUTH_COLORS.white} />
          <div style={{ fontSize: 21, fontWeight: 800, color: AUTH_COLORS.white, marginTop: 14 }}>
            Idea<span style={{ color: AUTH_COLORS.teal }}>Map</span>
          </div>
          <p style={{ fontSize: 13, color: AUTH_COLORS.mutedBright, marginTop: 6, textAlign: "center", maxWidth: 300 }}>
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
                  color: AUTH_COLORS.mutedBright,
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
                  border: `1.5px solid ${accentColor}`,
                  borderRadius: RADIUS.md,
                  background: "rgba(255,255,255,0.03)",
                  fontFamily: "'Courier New', monospace",
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: 1,
                  color: AUTH_COLORS.white,
                  outline: "none",
                  boxSizing: "border-box",
                  textAlign: "center",
                  transition: "border-color .15s",
                }}
              />
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 10, minHeight: 20 }}>
                {roleMeta && (
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: roleMeta.color, display: "flex", alignItems: "center", gap: 6 }}>
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
              <div style={{ fontSize: 12.5, fontWeight: 700, color: AUTH_COLORS.mutedBright, textAlign: "center", marginBottom: 16 }}>
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
                  border: `1.5px solid ${AUTH_COLORS.border}`,
                  borderRadius: RADIUS.md,
                  background: "rgba(255,255,255,0.03)",
                  fontSize: 15,
                  fontWeight: 600,
                  color: AUTH_COLORS.white,
                  outline: "none",
                  boxSizing: "border-box",
                  textAlign: "center",
                }}
              />
            </div>
          )}

          {error && (
            <p style={{ color: AUTH_COLORS.red, fontSize: 12.5, fontWeight: 600, textAlign: "center", marginBottom: 16 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              background: accentColor,
              color: "#06111f",
              border: "none",
              borderRadius: RADIUS.md,
              padding: "13px 16px",
              fontSize: 14.5,
              fontWeight: 800,
              cursor: submitting ? "default" : "pointer",
              opacity: submitting ? 0.7 : 1,
              transition: "background-color .15s",
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
                color: AUTH_COLORS.mutedBright,
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
          position: "relative",
          fontSize: 10.5,
          color: AUTH_COLORS.muted,
          textTransform: "uppercase",
          letterSpacing: 1.5,
          marginTop: 32,
          zIndex: 1,
        }}
      >
        {tr("authOfficialPortal")}
      </p>
    </main>
  );
}
