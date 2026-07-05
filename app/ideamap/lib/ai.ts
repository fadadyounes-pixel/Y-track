import { Lang, LOGO_ICONS } from "./types";
import { PILLARS, SECTORS, JURY_GRID, REQUIRED_DOCUMENTS, MAX_GRANT_MAD } from "./constants";

export interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

/** "chat" = short conversational text (routed to Groq first). "json" = a structured
 * object IdeaMap needs to parse (routed to Gemini first, which supports native
 * structured output). See app/api/ai/providers.ts ("Rafiq") for the full routing. */
export type AIMode = "chat" | "json";

export async function ai(messages: AIMessage[], system: string, max_tokens = 1200, mode: AIMode = "chat"): Promise<string> {
  const r = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, system, max_tokens, mode }),
  });
  if (!r.ok) throw new Error(`AI request failed (${r.status})`);
  const d = await r.json();
  return d.content?.[0]?.text || "";
}

/** Pulls the first JSON object/array out of a model response, tolerating markdown fences. */
export function parseJSON<T>(text: string): T {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  const start = raw.search(/[{[]/);
  const candidate = start >= 0 ? raw.slice(start) : raw;
  return JSON.parse(candidate) as T;
}

const languageName: Record<Lang, string> = {
  fr: "French",
  ar: "Arabic",
  en: "English",
};

export function langInstruction(lang: Lang): string {
  return `Respond only in ${languageName[lang]}.`;
}

/**
 * Grounds every Rafiq call in the same INDH Phase 3 facts, regardless of which
 * free provider answers it. General-purpose open models don't reliably know
 * Moroccan program specifics on their own — this block gives all of them the
 * same authoritative baseline instead of leaving it to what each model
 * happened to pick up from training data.
 */
export function indhContext(): string {
  const docNames = [
    "CIN (national ID)",
    "legal entity statutes",
    "constitutive general assembly minutes",
    "registration receipt",
    "proof of residence",
    "detailed cost estimate",
    "project site photos (5+)",
    "business plan",
    "holder CVs (optional)",
    "motivation letter (optional)",
    "Rokhsa.ma authorization (optional)",
    "partnership agreement (optional)",
  ];
  return `INDH (Initiative Nationale pour le Développement Humain) Phase 3 — program facts to apply exactly, not approximate:
- Maximum grant per project: ${MAX_GRANT_MAD.toLocaleString("en-US")} MAD, split 85% INDH contribution / 15% holder contribution (the holder's share may be in-kind: land, labor, materials).
- The 4 official strategic axes — every project must be placed under exactly one: ${PILLARS.join(" · ")}.
- 10 eligible sectors: ${SECTORS.join(" · ")}.
- Jury scoring grid, 100 points total: ${JURY_GRID.map((j) => `${j.key} (${j.points} pts)`).join(", ")}. Score bands: 80-100 excellent, 60-79 eligible, below 60 needs improvement.
- ${REQUIRED_DOCUMENTS.filter((d) => d.required).length} required + ${REQUIRED_DOCUMENTS.filter((d) => !d.required).length} optional supporting documents: ${docNames.join(", ")}.
- Submission path: the holder files with the Division de l'Action Sociale (DAS) of their province, which is reviewed by the Comité Provincial de Développement Humain (CPDH).
Ground every answer in these real figures and categories — never invent different axis names, percentages, or point values.`;
}

export function dialogueSystemPrompt(lang: Lang, idea: string, questionNumber: number): string {
  if (questionNumber < 5) {
    return `You are IdeaMap, an assistant helping a Moroccan citizen structure an INDH funding application.
${indhContext()}

The citizen's initial idea: "${idea}"
This is question ${questionNumber} of 5. Ask exactly ONE short, targeted question to gather the missing information needed to build a business plan (sector, legal structure, location, number of beneficiaries, budget range, key activities, strengths, which of the 4 axes it fits).
Do not repeat a question already asked. Keep it under 30 words. ${langInstruction(lang)}
Reply with plain text only — the question itself, nothing else.`;
  }
  return `You are IdeaMap. Based on the full conversation about this INDH project idea, summarize it into structured project data.
${indhContext()}
${langInstruction(lang)}
Respond with ONLY a JSON object (no markdown, no commentary) matching exactly this shape:
{
  "projectName": string,
  "sector": string,
  "legalStructure": string,
  "location": string,
  "beneficiaries": number,
  "activities": string[],
  "strengths": string[],
  "estimatedBudget": number,
  "pillar": string
}
"pillar" must be exactly one of: ${PILLARS.map((p) => `"${p}"`).join(", ")}.`;
}

export function businessPlanSystemPrompt(lang: Lang): string {
  return `You are IdeaMap. Write a full INDH business plan for the given project profile.
${indhContext()}
${langInstruction(lang)}
Respond with ONLY a JSON object (no markdown, no commentary) matching exactly this shape:
{
  "executiveSummary": string,
  "problemStatement": string,
  "solution": string,
  "marketAnalysis": string,
  "businessModel": string,
  "socialImpact": string,
  "operationalPlan": string,
  "indh_alignment": string,
  "risks": string[],
  "projections": { "year1": number, "year2": number, "year3": number }
}
"indh_alignment" must explicitly name the one strategic axis this project serves and explain why.`;
}

export function budgetSystemPrompt(lang: Lang): string {
  return `You are IdeaMap. Produce an itemised budget for the given INDH project profile.
${indhContext()}
${langInstruction(lang)}
Respond with ONLY a JSON object (no markdown, no commentary) matching exactly this shape:
{
  "items": [ { "category": string, "item": string, "quantity": number, "unitPrice": number, "total": number } ],
  "indhContribution": number,
  "beneficiaryContribution": number
}
The items must sum to no more than ${MAX_GRANT_MAD.toLocaleString("en-US")} MAD, and indhContribution/beneficiaryContribution must reflect the real 85/15 split of that total.`;
}

export function complianceSystemPrompt(lang: Lang): string {
  return `You are IdeaMap. Score the given INDH project against Phase 3 eligibility and the real jury criteria.
${indhContext()}
${langInstruction(lang)}
Respond with ONLY a JSON object (no markdown, no commentary) matching exactly this shape:
{
  "eligible": boolean,
  "score": number,
  "pillar": string,
  "strengths": string[],
  "weaknesses": string[],
  "recommendations": string[],
  "juryScore": { "impact": number, "viability": number, "relevance": number, "management": number, "sustainability": number, "innovation": number }
}
Each juryScore field must not exceed its grid maximum, and "score" must equal their sum.`;
}

export function logoConceptSystemPrompt(lang: Lang): string {
  return `You are IdeaMap. Design a simple monogram logo concept for the given INDH project profile — for a holder who has no logo of their own yet.
${langInstruction(lang)}
Respond with ONLY a JSON object (no markdown, no commentary) matching exactly this shape:
{
  "initials": string,
  "primaryColor": string,
  "secondaryColor": string,
  "icon": string,
  "tagline": string
}
"initials" must be 1-3 uppercase letters drawn from the project name.
"primaryColor" and "secondaryColor" must be hex colors (e.g. "#1F4D3E") that suit the project's sector — pick two that work well together, not pure black/white.
"icon" must be exactly one of: ${LOGO_ICONS.join(", ")} — whichever best matches the project's sector or activity.
"tagline" must be a short 3-6 word phrase in the requested language, evocative of the project, suitable to print under a logo.`;
}
