"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import { COLORS, RE_COORD } from "../lib/constants";
import { t, dir, fontFamily, pillarLabel } from "../lib/i18n";
import { Lang } from "../lib/types";
import { addCoordinator, listCoordinators, listHolders } from "../lib/storage";
import { readinessPercent } from "../lib/utils";
import * as ui from "../lib/ui";

function StatCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ ...ui.card, padding: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.onSurfaceVariant, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.onSurface }}>{value}</div>
    </div>
  );
}

export default function AdminDashboard({
  lang,
  setLang,
  onLogout,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  onLogout: () => void;
}) {
  const tr = (k: string) => t(lang, k);
  const [holders, setHolders] = useState(() => listHolders());
  const [coordinators, setCoordinators] = useState(() => listCoordinators());
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setHolders(listHolders());
    setCoordinators(listCoordinators());
  }, []);

  const avgReadiness = holders.length
    ? Math.round(holders.reduce((s, h) => s + readinessPercent(h), 0) / holders.length)
    : 0;
  const eligibleCount = holders.filter((h) => h.comp?.eligible).length;

  function handleAddCoordinator(e: React.FormEvent) {
    e.preventDefault();
    const code = newCode.trim();
    if (!RE_COORD.test(code)) {
      setFormError(tr("authError"));
      return;
    }
    addCoordinator(code, newName.trim());
    setCoordinators(listCoordinators());
    setNewCode("");
    setNewName("");
    setFormError(null);
  }

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
          <div style={{ fontWeight: 800, fontSize: 16, color: COLORS.onSurface }}>{tr("adminTitle")}</div>
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

      <div style={{ padding: 32, maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ ...ui.subtitle, marginBottom: 24 }}>{tr("adminSubtitle")}</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
          <StatCard label={tr("adminTotalHolders")} value={holders.length} />
          <StatCard label={tr("adminTotalCoordinators")} value={coordinators.length} />
          <StatCard label={tr("adminAvgReadiness")} value={`${avgReadiness}%`} />
          <StatCard label={tr("adminEligible")} value={eligibleCount} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, alignItems: "start" }}>
          <div style={{ ...ui.card, padding: 0 }}>
            <div style={{ padding: "16px 24px", borderBottom: `1px solid ${COLORS.border}`, fontWeight: 700, fontSize: 14 }}>
              {tr("adminProjects")} ({holders.length})
            </div>
            {holders.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: COLORS.onSurfaceVariant, fontSize: 14 }}>
                {tr("adminNoProjects")}
              </div>
            ) : (
              holders.map((h) => (
                <div
                  key={h.cin}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "14px 24px",
                    borderBottom: `1px solid ${COLORS.border}`,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ minWidth: 160 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{h.proj?.projectName || h.name || h.cin}</div>
                    <div style={{ fontSize: 12, color: COLORS.onSurfaceVariant }}>{h.cin}</div>
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.onSurfaceVariant }}>
                    {h.proj ? pillarLabel(lang, h.proj.pillar) : "—"}
                  </div>
                  <div
                    style={{
                      marginInlineStart: "auto",
                      fontSize: 12,
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: 999,
                      background: h.comp?.eligible ? "#d1fae5" : COLORS.surfaceContainerLow,
                      color: h.comp?.eligible ? "#065f46" : COLORS.onSurfaceVariant,
                    }}
                  >
                    {h.comp ? (h.comp.eligible ? tr("complianceEligible") : tr("complianceNotEligible")) : "—"}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.primaryDark, minWidth: 50, textAlign: "right" }}>
                    {readinessPercent(h)}%
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ ...ui.card }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>{tr("adminCoordinators")}</div>
            {coordinators.map((c) => (
              <div
                key={c.code}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom: `1px solid ${COLORS.border}`,
                  fontSize: 13,
                }}
              >
                <span style={{ fontWeight: 600 }}>{c.name || "—"}</span>
                <span style={{ color: COLORS.onSurfaceVariant }}>{c.code}</span>
              </div>
            ))}

            <form onSubmit={handleAddCoordinator} style={{ marginTop: 16 }}>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={tr("authNameLabel")}
                style={{ ...ui.input, marginBottom: 8 }}
              />
              <input
                value={newCode}
                onChange={(e) => {
                  setNewCode(e.target.value);
                  setFormError(null);
                }}
                placeholder="@NAMECOD"
                style={{ ...ui.input, marginBottom: 8 }}
              />
              {formError && (
                <div style={{ fontSize: 12, color: COLORS.red, marginBottom: 8 }}>{formError}</div>
              )}
              <button type="submit" style={{ ...ui.btnPrimary, width: "100%", justifyContent: "center" }}>
                {tr("adminAddCoordinator")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
