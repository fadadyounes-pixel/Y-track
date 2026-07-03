import { NextRequest, NextResponse } from "next/server";
import { askRafiq, RafiqMode } from "./providers";

export async function POST(request: NextRequest) {
  const { messages, system, max_tokens = 1200, mode = "chat" } = await request.json();

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages is required" }, { status: 400 });
  }

  try {
    const response = await askRafiq(mode as RafiqMode, messages, system, max_tokens);
    return NextResponse.json(response);
  } catch (err) {
    console.error("Rafiq proxy error:", err);
    return NextResponse.json({ error: "AI request failed" }, { status: 502 });
  }
}
