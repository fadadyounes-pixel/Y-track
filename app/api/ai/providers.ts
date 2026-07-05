/**
 * Rafiq — IdeaMap's AI engine.
 *
 * Rafiq ("companion" / "guide" in Arabic) is not a single model: it's a small
 * router that sends each call to whichever free provider is best suited to
 * the task, and automatically falls back to the next one if a provider is
 * unavailable, unconfigured, rate-limited, or fails. That way a single
 * provider's daily quota never blocks a holder mid-dossier.
 *
 * IdeaMap is a free tool for Moroccan youth and project holders, so Rafiq
 * only ever talks to genuinely free, no-card-required providers — there is
 * no paid provider in this codebase to fall back to, on purpose.
 *
 * - "json" tasks (profile, business plan, budget, compliance) prefer Gemini,
 *   which supports a native structured-output mode.
 * - "chat" tasks (the short dialogue questions) prefer Groq, which is fast.
 * - OpenRouter (Qwen3 235B) is the third free option for both — a strong,
 *   free, natively multilingual model that reads French and Arabic well.
 */

export type RafiqMode = "chat" | "json";

export interface RafiqMessage {
  role: "user" | "assistant";
  content: string;
}

interface NormalizedResponse {
  content: { type: "text"; text: string }[];
}

type ProviderName = "gemini" | "groq" | "openrouter";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "qwen/qwen3-235b-a22b:free";

function providerOrder(mode: RafiqMode): ProviderName[] {
  const order: ProviderName[] = mode === "json" ? ["gemini", "openrouter", "groq"] : ["groq", "gemini", "openrouter"];
  return order.filter((p) => isConfigured(p));
}

function isConfigured(provider: ProviderName): boolean {
  if (provider === "gemini") return !!process.env.GEMINI_API_KEY;
  if (provider === "openrouter") return !!process.env.OPENROUTER_API_KEY;
  return !!process.env.GROQ_API_KEY;
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

async function callOpenRouter(
  messages: RafiqMessage[],
  system: string,
  max_tokens: number
): Promise<NormalizedResponse> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      max_tokens,
      messages: [{ role: "system", content: system }, ...messages],
    }),
  });
  if (!res.ok) throw new Error(`OpenRouter request failed (${res.status}): ${await res.text()}`);
  const data = await res.json();
  const text: string = data.choices?.[0]?.message?.content || "";
  if (!text) throw new Error("OpenRouter returned no content");
  return { content: [{ type: "text", text }] };
}

async function callProvider(
  provider: ProviderName,
  messages: RafiqMessage[],
  system: string,
  max_tokens: number,
  mode: RafiqMode
): Promise<NormalizedResponse> {
  if (provider === "gemini") return callGemini(messages, system, max_tokens, mode);
  if (provider === "groq") return callGroq(messages, system, max_tokens);
  return callOpenRouter(messages, system, max_tokens);
}

export async function askRafiq(
  mode: RafiqMode,
  messages: RafiqMessage[],
  system: string,
  max_tokens: number
): Promise<NormalizedResponse> {
  const order = providerOrder(mode);
  if (order.length === 0) {
    throw new Error("No AI provider configured. Set GEMINI_API_KEY, GROQ_API_KEY, or OPENROUTER_API_KEY.");
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
