import { DocumentsState, PersonalInfo } from "./types";

// Design tokens — from the IdeaMap "Modern Architectural" design system
// (Vibrant Teal on Cool Gray / Deep Charcoal).
export const COLORS = {
  background: "#F5F7F9",
  surface: "#FFFFFF",
  surfaceContainerLow: "#F2F4F6",
  surfaceContainer: "#ECEEF0",
  border: "#E2E8F0",
  onSurface: "#1A1C1E",
  onSurfaceVariant: "#3C4A46",
  primary: "#00BFA5",
  primaryDark: "#006B5C",
  onPrimary: "#FFFFFF",
  primaryContainer: "#E5F8F4",
  inverseSurface: "#1A1C1E",
  inverseOnSurface: "#EFF1F3",
  gold: "#F59E0B",
  red: "#BA1A1A",
  redContainer: "#FFDAD6",
  green: "#10B981",
  gray: "#6C7A76",
};

export const RADIUS = { sm: 4, md: 8, lg: 12, xl: 16, full: 999 };

export const MAX_GRANT_MAD = 100000;
export const INDH_SHARE = 0.85;
export const HOLDER_SHARE = 0.15;

// The 4 official INDH Phase 3 strategic axes.
export const PILLARS = [
  "Infrastructure and basic services",
  "Social inclusion of vulnerable people",
  "Economic inclusion of youth",
  "Human capital development",
] as const;

export const SECTORS = [
  "Agriculture / Élevage",
  "Artisanat",
  "Commerce / Services",
  "Agro-alimentaire",
  "Tourisme rural",
  "Numérique / TIC",
  "Textile / Couture",
  "BTP",
  "Éducation / Formation",
  "Pêche",
] as const;

export const JURY_GRID = [
  { key: "impact", points: 25 },
  { key: "viability", points: 20 },
  { key: "relevance", points: 20 },
  { key: "management", points: 15 },
  { key: "sustainability", points: 10 },
  { key: "innovation", points: 10 },
] as const;

export interface DocDef {
  id: string;
  required: boolean;
}

export const REQUIRED_DOCUMENTS: DocDef[] = [
  { id: "cin", required: true },
  { id: "statuts", required: true },
  { id: "pvAg", required: true },
  { id: "recepisse", required: true },
  { id: "residence", required: true },
  { id: "devis", required: true },
  { id: "photos", required: true },
  { id: "businessPlan", required: true },
  { id: "cvMembers", required: false },
  { id: "motivation", required: false },
  { id: "rokhsa", required: false },
  { id: "partnership", required: false },
];

export const emptyDocsState = (): DocumentsState =>
  Object.fromEntries(REQUIRED_DOCUMENTS.map((d) => [d.id, false]));

// The 12 Moroccan administrative regions, plus the prefectures shown only
// when Region = Casablanca-Settat (mirrors the reference profile form).
export const MOROCCAN_REGIONS = [
  "Tanger-Tétouan-Al Hoceïma",
  "Oriental",
  "Fès-Meknès",
  "Rabat-Salé-Kénitra",
  "Béni Mellal-Khénifra",
  "Casablanca-Settat",
  "Marrakech-Safi",
  "Drâa-Tafilalet",
  "Souss-Massa",
  "Guelmim-Oued Noun",
  "Laâyoune-Sakia El Hamra",
  "Dakhla-Oued Ed-Dahab",
] as const;

export const CASABLANCA_PREFECTURES = [
  "Casablanca",
  "Mohammedia",
  "El Jadida",
  "Settat",
  "Berrechid",
  "Nouaceur",
  "Médiouna",
  "Benslimane",
  "Sidi Bennour",
] as const;

export const AGE_GROUPS = ["15-17", "18-20", "21-24", "25-30", "31-40", "40+"] as const;

export const emptyPersonalInfo = (): PersonalInfo => ({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  ageGroup: "",
  gender: "",
  educationLevel: "",
  occupationStatus: "",
  region: "",
  prefecture: "",
  photoDataUrl: "",
});

export const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const RE_PHONE = /^[+]?[\d\s\-().]{8,15}$/;

// Info comes first — the personal profile is collected once, before the
// holder ever starts describing their project, then skipped on every return
// visit since `step` has already moved past it.
// Logo comes right after plan + budget — by then there's enough substance
// (the business model, the numbers) to inform a good logo and presentation,
// and it still comes well before the paperwork-heavy documents step.
export const STEP_ORDER = [
  "info",
  "idea",
  "dialogue",
  "profile",
  "plan",
  "budget",
  "logo",
  "compliance",
  "documents",
  "export",
] as const;

// Keeps uploaded files (stored as data URLs in localStorage) from silently
// blowing the browser's per-origin storage quota.
export const MAX_UPLOAD_BYTES = 1_500_000;

export const RE_HOLDER = /^[A-Z]{2}\d{3,}$/;
export const RE_COORD = /^@[A-Za-z]{2,}COD$/i;
export const ADMIN_CODE = "@adminINDH";
