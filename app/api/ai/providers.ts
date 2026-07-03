import Anthropic from "@anthropic-ai/sdk";

/**
 * Rafiq — IdeaMap's AI engine.
 *
 * Rafiq ("companion" / "guide" in Arabic) is not a single model: it's a small
 * router that sends each call to whichever free-tier provider is best suited
 * to the task, and automatically falls back to the next one if a provider is
 * unavailable, unconfigured, or rate-limited. That way a single provider's
 * daily quota never blocks a holder mid-dossier.
 *
 * - "json" tasks (profile, business plan, budget, compliance) prefer Gemini,
 *   which supports a native structured-output mode.
 * - "chat" tasks (the short dialogue questions) prefer Groq, which is fast
 *   and free with no structured-output need.
 * - Claude is tried whenever ANTHROPIC_API_KEY is configured (best quality
 *   we've measured), ahead of the free fallbacks.
 */

export type RafiqMode = "chat" | "json";

export interface RafiqMessage {
  role: "user" | "assistant";
  content: string;
}

interface NormalizedResponse {
  content: { type: "text"; text: string }[];
}

type ProviderName = "claude" | "gemini" | "groq";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
// claude-sonnet-4-20250514 reached end-of-life June 15, 2026 — keep this current.
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-5";

function providerOrder(mode: RafiqMode): ProviderName[] {
  const order: ProviderName[] = mode === "json" ? ["claude", "gemini", "groq"] : ["claude", "groq", "gemini"];
  return order.filter((p) => isConfigured(p));
}

function isConfigured(provider: ProviderName): boolean {
  if (provider === "claude") return !!process.env.ANTHROPIC_API_KEY;
  if (provider === "gemini") return !!process.env.GEMINI_API_KEY;
  return !!process.env.GROQ_API_KEY;
}

async function callClaude(
  messages: RafiqMessage[],
  system: string,
  max_tokens: number
): Promise<NormalizedResponse> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const response = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens,
    system,
    messages,
  });
  const text = response.content.map((b) => (b.type === "text" ? b.text : "")).join("");
  return { content: [{ type: "text", text }] };
}

async function callGemini(
  messages: RafiqMessage[],
  system: string,
  max_tokens: number,
  mode: RafiqMode
): Promise<NormalizedResponse> {
  const model = GEMINI_MODEL;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const body = {
    systemInstruction: { parts: [{ text: system }] },
    contents: messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    generationConfig: {
      maxOutputTokens: max_tokens,
      ...(mode === "json" ? { responseMimeType: "application/json" } : {}),
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Gemini request failed (${res.status}): ${await res.text()}`);
  const data = await res.json();
  const text: string = data.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || "").join("") || "";
  if (!text) throw new Error("Gemini returned no content");
  return { content: [{ type: "text", text }] };
}

async function callGroq(messages: RafiqMessage[], system: string, max_tokens: number): Promise<NormalizedResponse> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      max_tokens,
      messages: [{ role: "system", content: system }, ...messages],
    }),
  });
  if (!res.ok) throw new Error(`Groq request failed (${res.status}): ${await res.text()}`);
  const data = await res.json();
  const text: string = data.choices?.[0]?.message?.content || "";
  if (!text) throw new Error("Groq returned no content");
  return { content: [{ type: "text", text }] };
}

async function callProvider(
  provider: ProviderName,
  messages: RafiqMessage[],
  system: string,
  max_tokens: number,
  mode: RafiqMode
): Promise<NormalizedResponse> {
  if (provider === "claude") return callClaude(messages, system, max_tokens);
  if (provider === "gemini") return callGemini(messages, system, max_tokens, mode);
  return callGroq(messages, system, max_tokens);
}

export async function askRafiq(
  mode: RafiqMode,
  messages: RafiqMessage[],
  system: string,
  max_tokens: number
): Promise<NormalizedResponse> {
  const order = providerOrder(mode);
  if (order.length === 0) {
    throw new Error(
      "No AI provider configured. Set ANTHROPIC_API_KEY, GEMINI_API_KEY, or GROQ_API_KEY."
    );
  }

  let lastError: unknown;
  for (const provider of order) {
    try {
      return await callProvider(provider, messages, system, max_tokens, mode);
    } catch (err) {
      console.error(`Rafiq: ${provider} failed, trying next provider.`, err);
      lastError = err;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("All Rafiq providers failed");
}
