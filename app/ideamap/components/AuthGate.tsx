"use client";

import { useState } from "react";
import Logo from "./Logo";
import { COLORS, RADIUS, RE_HOLDER, RE_COORD, ADMIN_CODE } from "../lib/constants";
import { t, dir, fontFamily } from "../lib/i18n";
import { Lang, Role } from "../lib/types";
import { coordinatorExists, loadHolder, newHolderState, saveHolder } from "../lib/storage";

export interface AuthResult {
  role: Role;
  cin?: string;
  coordCode?: string;
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
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(circle at 15% 15%, ${COLORS.primaryContainer} 0%, ${COLORS.background} 45%)`,
        fontFamily: fontFamily(lang),
        padding: 20,
      }}
    >
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div
          style={{
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: RADIUS.xl,
            boxShadow: "0 2px 2px rgba(26,28,30,0.04), 0 20px 40px rgba(26,28,30,0.06)",
            padding: "40px 36px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <Logo size={64} />
          </div>
          <h1
            style={{
              textAlign: "center",
              fontSize: 24,
              fontWeight: 800,
              color: COLORS.primaryDark,
              margin: "0 0 4px",
            }}
          >
            {needsSignup ? tr("authNewHolder") : tr("authTitle")}
          </h1>
          <p style={{ textAlign: "center", fontSize: 13, color: COLORS.onSurfaceVariant, margin: "0 0 28px" }}>
            {tr("authSubtitle")}
          </p>

          <form onSubmit={handleSubmit}>
            {!needsSignup && (
              <div style={{ marginBottom: 18 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 700,
                    color: COLORS.primaryDark,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    marginBottom: 8,
                  }}
                >
                  {tr("authCodeLabel")}
                </label>
                <input
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError(null);
                  }}
                  placeholder={tr("authCodePlaceholder")}
                  required
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: RADIUS.md,
                    border: `1.5px solid ${error ? COLORS.red : COLORS.border}`,
                    fontSize: 15,
                    fontWeight: 600,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <p style={{ fontSize: 12, color: COLORS.onSurfaceVariant, marginTop: 8 }}>
                  {tr("authCodeHint")}
                </p>
              </div>
            )}

            {needsSignup && (
              <div style={{ marginBottom: 18 }}>
                <div
                  style={{
                    background: COLORS.surfaceContainerLow,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: RADIUS.md,
                    padding: "10px 14px",
                    fontSize: 13,
                    fontWeight: 700,
                    color: COLORS.primaryDark,
                    marginBottom: 16,
                  }}
                >
                  CIN: {code.trim().toUpperCase()}
                </div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 700,
                    color: COLORS.primaryDark,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    marginBottom: 8,
                  }}
                >
                  {tr("authNameLabel")}
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={tr("authNamePlaceholder")}
                  required
                  autoFocus
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: RADIUS.md,
                    border: `1.5px solid ${COLORS.border}`,
                    fontSize: 15,
                    fontWeight: 600,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            )}

            {error && (
              <div
                style={{
                  background: COLORS.redContainer,
                  color: COLORS.red,
                  borderRadius: RADIUS.md,
                  padding: "10px 14px",
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 16,
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                background: COLORS.primaryDark,
                color: "white",
                border: "none",
                borderRadius: RADIUS.md,
                padding: "14px 16px",
                fontSize: 15,
                fontWeight: 700,
                cursor: submitting ? "default" : "pointer",
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? tr("loading") : needsSignup ? tr("authCreateAccount") : tr("authSubmit")}
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
                  color: COLORS.onSurfaceVariant,
                  border: "none",
                  padding: "12px 0 0",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                {tr("authBackToLogin")}
              </button>
            )}
          </form>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 24 }}>
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
        <p
          style={{
            textAlign: "center",
            fontSize: 11,
            color: COLORS.gray,
            textTransform: "uppercase",
            letterSpacing: 1.5,
            marginTop: 20,
          }}
        >
          {tr("authOfficialPortal")}
        </p>
      </div>
    </main>
  );
}
