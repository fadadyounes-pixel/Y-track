import { COLORS, RADIUS } from "./constants";
import { CSSProperties } from "react";

export const card: CSSProperties = {
  background: COLORS.surface,
  border: `1px solid ${COLORS.border}`,
  borderRadius: RADIUS.lg,
  padding: 32,
};

export const eyebrow: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 1.5,
  textTransform: "uppercase",
  color: COLORS.primaryDark,
  marginBottom: 8,
};

export const h1: CSSProperties = {
  fontSize: 32,
  fontWeight: 800,
  color: COLORS.onSurface,
  lineHeight: 1.2,
  margin: "0 0 12px",
};

export const subtitle: CSSProperties = {
  fontSize: 15,
  color: COLORS.onSurfaceVariant,
  lineHeight: 1.6,
  maxWidth: 640,
  margin: 0,
};

export const label: CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 700,
  color: COLORS.onSurface,
  marginBottom: 8,
};

export const textarea: CSSProperties = {
  width: "100%",
  background: COLORS.surfaceContainerLow,
  border: `1px solid ${COLORS.border}`,
  borderRadius: RADIUS.md,
  padding: 16,
  fontSize: 14,
  fontFamily: "inherit",
  outline: "none",
  resize: "vertical",
  boxSizing: "border-box",
};

export const input: CSSProperties = {
  width: "100%",
  background: COLORS.surface,
  border: `1px solid ${COLORS.border}`,
  borderRadius: RADIUS.md,
  padding: "12px 14px",
  fontSize: 14,
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
};

export const btnPrimary: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  background: COLORS.primaryDark,
  color: "white",
  border: "none",
  borderRadius: RADIUS.md,
  padding: "13px 24px",
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
};

export const btnSecondary: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  background: "transparent",
  color: COLORS.onSurface,
  border: `1.5px solid ${COLORS.border}`,
  borderRadius: RADIUS.md,
  padding: "13px 24px",
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
};

export const disabled: CSSProperties = { opacity: 0.55, cursor: "default" };

export const badge = (bg: string, fg: string): CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "4px 10px",
  borderRadius: RADIUS.full,
  fontSize: 12,
  fontWeight: 700,
  background: bg,
  color: fg,
});
