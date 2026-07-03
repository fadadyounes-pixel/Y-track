import { Lang } from "./types";

export interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

export async function ai(messages: AIMessage[], system: string, max_tokens = 1200): Promise<string> {
  const r = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, system, max_tokens }),
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

export function dialogueSystemPrompt(lang: Lang, idea: string, questionNumber: number): string {
  if (questionNumber < 5) {
    return `You are IdeaMap, an assistant helping a Moroccan citizen structure an INDH (Initiative Nationale pour le Développement Humain) funding application.
The citizen's initial idea: "${idea}"
This is question ${questionNumber} of 5. Ask exactly ONE short, targeted question to gather the missing information needed to build a business plan (sector, legal structure, location, number of beneficiaries, budget range, key activities, strengths, INDH pillar fit).
Do not repeat a question already asked. Keep it under 30 words. ${langInstruction(lang)}
Reply with plain text only — the question itself, nothing else.`;
  }
  return `You are IdeaMap. Based on the full conversation about this INDH project idea, summarize it into structured project data.
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
"pillar" must be one of: "Infrastructure and basic services", "Social inclusion of vulnerable people", "Economic inclusion of youth", "Human capital development".`;
}

export function businessPlanSystemPrompt(lang: Lang): string {
  return `You are IdeaMap. Write a full INDH business plan for the given project profile.
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
}`;
}

export function budgetSystemPrompt(lang: Lang): string {
  return `You are IdeaMap. Produce an itemised budget for the given INDH project profile. The total must not exceed 100,000 MAD, split 85% INDH contribution / 15% holder contribution.
${langInstruction(lang)}
Respond with ONLY a JSON object (no markdown, no commentary) matching exactly this shape:
{
  "items": [ { "category": string, "item": string, "quantity": number, "unitPrice": number, "total": number } ],
  "indhContribution": number,
  "beneficiaryContribution": number
}`;
}

export function complianceSystemPrompt(lang: Lang): string {
  return `You are IdeaMap. Score the given INDH project against INDH Phase 3 eligibility and jury criteria (impact 25, viability 20, relevance 20, management 15, sustainability 10, innovation 10 — total 100).
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
}`;
}
