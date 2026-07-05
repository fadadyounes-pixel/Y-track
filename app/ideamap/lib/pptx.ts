import type PptxGenJSType from "pptxgenjs";
import { COLORS, JURY_GRID } from "./constants";
import { getLogoPngDataUrl } from "./logo";
import { pillarLabel, t } from "./i18n";
import { formatMAD } from "./utils";
import { Budget, BusinessPlan, HolderState, Lang, LogoState, ProjectProfile } from "./types";

const ACCENT = COLORS.primaryDark.replace("#", "");
const INK = "1A1C1E";
const MUTED = "6C7A76";

/** Loads pptxgenjs dynamically (client-only, fairly large) and sets up the
 * shared deck layout + a slide header helper both builders below reuse. */
async function createDeck(align: "left" | "right") {
  const PptxGenJSModule = await import("pptxgenjs");
  const PptxGenJS = PptxGenJSModule.default;
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "IDEAMAP", width: 10, height: 5.63 });
  pptx.layout = "IDEAMAP";

  function header(slide: PptxGenJSType.Slide, title: string) {
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.75, fill: { color: ACCENT } });
    slide.addText(title, {
      x: 0.4,
      y: 0,
      w: 9.2,
      h: 0.75,
      fontSize: 22,
      bold: true,
      color: "FFFFFF",
      valign: "middle",
      align,
      fontFace: "Georgia",
    });
  }

  return { pptx, header };
}

async function addTitleSlide(
  pptx: PptxGenJSType,
  opts: { logo: LogoState | null; projectName: string; subtitle: string; footerTitle: string; holderLine: string }
) {
  const logoPng = await getLogoPngDataUrl(opts.logo, 400).catch(() => null);
  const s1 = pptx.addSlide();
  s1.background = { color: "FFFFFF" };
  if (logoPng) s1.addImage({ data: logoPng, x: 4.25, y: 0.5, w: 1.5, h: 1.5 });
  s1.addText(opts.projectName, {
    x: 0.5,
    y: 2.2,
    w: 9,
    h: 0.9,
    fontSize: 32,
    bold: true,
    color: INK,
    align: "center",
    fontFace: "Georgia",
  });
  s1.addText(opts.subtitle, { x: 0.5, y: 3.05, w: 9, h: 0.5, fontSize: 16, italic: true, color: MUTED, align: "center" });
  s1.addText(opts.footerTitle, {
    x: 0.5,
    y: 4.6,
    w: 9,
    h: 0.4,
    fontSize: 12,
    color: MUTED,
    align: "center",
    fontFace: "Courier New",
  });
  s1.addText(opts.holderLine, { x: 0.5, y: 5.0, w: 9, h: 0.4, fontSize: 11, color: MUTED, align: "center" });
}

function addPlanSlides(pptx: PptxGenJSType, header: (s: PptxGenJSType.Slide, t: string) => void, plan: BusinessPlan, lang: Lang, align: "left" | "right") {
  const tr = (k: string) => t(lang, k);

  const s2 = pptx.addSlide();
  header(s2, tr("planSummary"));
  s2.addText(plan.executiveSummary, { x: 0.4, y: 1.0, w: 9.2, h: 1.9, fontSize: 14, color: INK, align });
  s2.addText(tr("planProblem"), { x: 0.4, y: 3.0, w: 9.2, h: 0.4, fontSize: 15, bold: true, color: ACCENT, align });
  s2.addText(plan.problemStatement, { x: 0.4, y: 3.45, w: 9.2, h: 1.8, fontSize: 14, color: INK, align });

  const s3 = pptx.addSlide();
  header(s3, tr("planSolution"));
  s3.addText(plan.solution, { x: 0.4, y: 1.0, w: 9.2, h: 1.9, fontSize: 14, color: INK, align });
  s3.addText(tr("planModel"), { x: 0.4, y: 3.0, w: 9.2, h: 0.4, fontSize: 15, bold: true, color: ACCENT, align });
  s3.addText(plan.businessModel, { x: 0.4, y: 3.45, w: 9.2, h: 1.8, fontSize: 14, color: INK, align });

  const s4 = pptx.addSlide();
  header(s4, tr("planImpact"));
  s4.addText(plan.socialImpact, { x: 0.4, y: 1.0, w: 9.2, h: 1.9, fontSize: 14, color: INK, align });
  s4.addText(tr("planAlignment"), { x: 0.4, y: 3.0, w: 9.2, h: 0.4, fontSize: 15, bold: true, color: ACCENT, align });
  s4.addText(plan.indh_alignment, { x: 0.4, y: 3.45, w: 9.2, h: 1.8, fontSize: 14, color: INK, align });
}

function addBudgetSlide(pptx: PptxGenJSType, header: (s: PptxGenJSType.Slide, t: string) => void, budget: Budget, lang: Lang) {
  const tr = (k: string) => t(lang, k);
  const s5 = pptx.addSlide();
  header(s5, tr("budgetTitle"));
  const budgetRows = [
    [tr("budgetCategory"), tr("budgetItem"), tr("budgetQty"), tr("budgetUnit"), tr("budgetTotal")].map((txt) => ({
      text: txt,
      options: { bold: true, color: "FFFFFF", fill: { color: ACCENT }, fontSize: 11 },
    })),
    ...budget.items.map((it) => [
      { text: it.category, options: { fontSize: 11 } },
      { text: it.item, options: { fontSize: 11 } },
      { text: String(it.quantity), options: { fontSize: 11, align: "right" as const } },
      { text: formatMAD(it.unitPrice), options: { fontSize: 11, align: "right" as const } },
      { text: formatMAD(it.total), options: { fontSize: 11, align: "right" as const } },
    ]),
  ];
  s5.addTable(budgetRows, { x: 0.4, y: 1.0, w: 9.2, colW: [2.1, 3.3, 0.9, 1.4, 1.5], border: { type: "solid", color: "E2E8F0", pt: 0.5 } });
  const total = budget.items.reduce((sum, it) => sum + it.total, 0);
  s5.addText(
    `${tr("budgetIndh")}: ${formatMAD(budget.indhContribution)}    ·    ${tr("budgetHolder")}: ${formatMAD(
      budget.beneficiaryContribution
    )}    ·    ${tr("budgetGrandTotal")}: ${formatMAD(total)}`,
    { x: 0.4, y: 1.0 + 0.35 * (budgetRows.length + 1), w: 9.2, h: 0.5, fontSize: 12, bold: true, color: INK, align: "center" }
  );
}

export interface PitchInput {
  proj: ProjectProfile;
  plan: BusinessPlan;
  budget: Budget;
  logo: LogoState | null;
  holderLabel: string;
}

/** The early pitch deck — available as soon as plan + budget exist (i.e. at
 * the Logo step), well before compliance is scored or documents are
 * gathered. A holder can use this to pitch their project informally before
 * doing any of the paperwork. */
export async function buildPitchPptx(input: PitchInput, lang: Lang): Promise<Blob> {
  const { proj, plan, budget, logo, holderLabel } = input;

  const align: "left" | "right" = lang === "ar" ? "right" : "left";
  const tr = (k: string) => t(lang, k);
  const { pptx, header } = await createDeck(align);

  await addTitleSlide(pptx, {
    logo,
    projectName: proj.projectName,
    subtitle: logo?.concept?.tagline || `${proj.sector} · ${pillarLabel(lang, proj.pillar)}`,
    footerTitle: tr("logoPitchPptTitle"),
    holderLine: `${holderLabel} — ${new Date().toLocaleDateString(lang === "ar" ? "ar-MA" : lang)}`,
  });
  addPlanSlides(pptx, header, plan, lang, align);
  addBudgetSlide(pptx, header, budget, lang);

  return (await pptx.write({ outputType: "blob" })) as Blob;
}

/** Builds the full jury-ready presentation as a real .pptx Blob — everything
 * the pitch deck has, plus compliance and the document/submission status. */
export async function buildJuryPptx(state: HolderState, lang: Lang): Promise<Blob> {
  const { proj, plan, budget, comp, docs, logo } = state;
  if (!proj || !plan || !budget || !comp) throw new Error("Missing project data for the presentation");

  const align: "left" | "right" = lang === "ar" ? "right" : "left";
  const tr = (k: string) => t(lang, k);
  const { pptx, header } = await createDeck(align);

  await addTitleSlide(pptx, {
    logo,
    projectName: proj.projectName,
    subtitle: logo?.concept?.tagline || `${proj.sector} · ${pillarLabel(lang, proj.pillar)}`,
    footerTitle: tr("exportJuryPptTitle"),
    holderLine: `${state.name || state.cin} — ${new Date().toLocaleDateString(lang === "ar" ? "ar-MA" : lang)}`,
  });
  addPlanSlides(pptx, header, plan, lang, align);
  addBudgetSlide(pptx, header, budget, lang);

  // --- Compliance ---
  const s6 = pptx.addSlide();
  header(s6, tr("complianceTitle"));
  s6.addText(`${comp.score} / 100`, { x: 0.4, y: 1.0, w: 2.5, h: 1, fontSize: 40, bold: true, color: ACCENT, align: "center" });
  s6.addText(comp.eligible ? tr("complianceEligible") : tr("complianceNotEligible"), {
    x: 0.4,
    y: 1.85,
    w: 2.5,
    h: 0.4,
    fontSize: 12,
    bold: true,
    color: comp.eligible ? "0F766E" : "B91C1C",
    align: "center",
  });
  const juryRows = [
    [tr("complianceJury"), ""].map((txt) => ({ text: txt, options: { bold: true, color: "FFFFFF", fill: { color: ACCENT }, fontSize: 11 } })),
    ...JURY_GRID.map(({ key, points }) => [
      { text: t(lang, `jury_${key}`), options: { fontSize: 11 } },
      { text: `${comp.juryScore[key as keyof typeof comp.juryScore]} / ${points}`, options: { fontSize: 11, align: "right" as const } },
    ]),
  ];
  s6.addTable(juryRows, { x: 3.2, y: 1.0, w: 6.4, colW: [4.4, 2.0], border: { type: "solid", color: "E2E8F0", pt: 0.5 } });
  s6.addText(tr("complianceRecommendations"), { x: 0.4, y: 3.1, w: 9.2, h: 0.35, fontSize: 13, bold: true, color: ACCENT, align });
  s6.addText(comp.recommendations.map((r) => `• ${r}`).join("\n"), { x: 0.4, y: 3.5, w: 9.2, h: 1.6, fontSize: 12, color: INK, align });

  // --- Documents & next steps ---
  const s7 = pptx.addSlide();
  header(s7, tr("documentsTitle"));
  const docEntries = Object.entries(docs);
  const doneCount = docEntries.filter(([, v]) => v).length;
  s7.addText(`${tr("navDocuments")}: ${doneCount} / ${docEntries.length}`, {
    x: 0.4,
    y: 1.0,
    w: 9.2,
    h: 0.4,
    fontSize: 15,
    bold: true,
    color: INK,
    align,
  });
  s7.addText(`${tr("exportReadiness")}`, { x: 0.4, y: 1.6, w: 9.2, h: 0.35, fontSize: 13, bold: true, color: ACCENT, align });
  s7.addText(
    [
      "1. Rassemblez les documents requis.",
      "2. Faites viser le dossier par le président de la structure porteuse.",
      "3. Déposez le dossier auprès de la Division de l'Action Sociale (DAS) de votre province.",
      "4. La DAS instruit le dossier et le transmet au CPDH.",
      "5. Le CPDH évalue le projet et notifie sa décision.",
      "6. En cas d'avis favorable, la convention de financement est signée avant le premier versement.",
    ].join("\n"),
    { x: 0.4, y: 2.0, w: 9.2, h: 2.8, fontSize: 12, color: INK, align }
  );

  return (await pptx.write({ outputType: "blob" })) as Blob;
}
