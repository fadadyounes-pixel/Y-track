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
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: COLORS.background,
        fontFamily: fontFamily(lang),
        padding: "20px 20px 32px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 340 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 40 }}>
          <Logo size={52} />
          <div style={{ fontSize: 19, fontWeight: 800, color: COLORS.onSurface, marginTop: 14 }}>
            {tr("appName")}
          </div>
          <p style={{ fontSize: 13.5, color: COLORS.onSurfaceVariant, marginTop: 6, textAlign: "center" }}>
            {needsSignup ? tr("authNewHolder") : tr("authSubtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {!needsSignup && (
            <div style={{ marginBottom: 20 }}>
              <input
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError(null);
                }}
                placeholder={tr("authCodePlaceholder")}
                required
                autoFocus
                style={{
                  width: "100%",
                  padding: "12px 2px",
                  border: "none",
                  borderBottom: `1.5px solid ${error ? COLORS.red : COLORS.border}`,
                  background: "transparent",
                  fontSize: 16,
                  fontWeight: 600,
                  color: COLORS.onSurface,
                  outline: "none",
                  boxSizing: "border-box",
                  textAlign: "center",
                }}
              />
              <p style={{ fontSize: 11.5, color: COLORS.onSurfaceVariant, marginTop: 10, textAlign: "center" }}>
                {tr("authCodeHint")}
              </p>
            </div>
          )}

          {needsSignup && (
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: COLORS.onSurfaceVariant,
                  textAlign: "center",
                  marginBottom: 16,
                }}
              >
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
                  padding: "12px 2px",
                  border: "none",
                  borderBottom: `1.5px solid ${COLORS.border}`,
                  background: "transparent",
                  fontSize: 16,
                  fontWeight: 600,
                  color: COLORS.onSurface,
                  outline: "none",
                  boxSizing: "border-box",
                  textAlign: "center",
                }}
              />
            </div>
          )}

          {error && (
            <p style={{ color: COLORS.red, fontSize: 12.5, fontWeight: 600, textAlign: "center", marginBottom: 16 }}>
              {error}
            </p>
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
              padding: "13px 16px",
              fontSize: 14.5,
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

        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 36 }}>
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
      </div>
      <p
        style={{
          fontSize: 10.5,
          color: COLORS.gray,
          textTransform: "uppercase",
          letterSpacing: 1.5,
          marginTop: 40,
        }}
      >
        {tr("authOfficialPortal")}
      </p>
    </main>
  );
}
