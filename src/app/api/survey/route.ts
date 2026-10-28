import { NextResponse } from "next/server";
import { validateSurveyPayload } from "@/lib/survey";

export const runtime = "nodejs";
const endpoint = process.env.GOOGLE_SHEETS_WEB_APP_URL;
const sharedToken = process.env.GOOGLE_SHEETS_WEB_APP_TOKEN;

export async function POST(request: Request) {
  const started = Date.now();
  let payload: unknown;
  try { payload = await request.json(); } catch {
    console.warn("[api/survey] fail", { action: "submit", reason: "invalid_json", ms: Date.now() - started });
    return NextResponse.json({ error: "无效的提交内容" }, { status: 400 });
  }
  const answerCount = payload && typeof payload === "object" && "answers" in payload && payload.answers && typeof payload.answers === "object" ? Object.keys(payload.answers).length : 0;
  console.info("[api/survey] enter", { action: "submit", answerCount });
  if (!validateSurveyPayload(payload)) {
    console.warn("[api/survey] fail", { action: "submit", answerCount, reason: "validation_failed", ms: Date.now() - started });
    return NextResponse.json({ error: "请完成必答题并检查选项" }, { status: 400 });
  }
  if (payload.honeypot) {
    console.info("[api/survey] success", { action: "submit", result: "bot_filtered", ms: Date.now() - started });
    return NextResponse.json({ ok: true });
  }
  if (!endpoint || !sharedToken) {
    console.warn("[api/survey] fail", { action: "submit", answerCount, reason: "sheets_not_configured", ms: Date.now() - started });
    return NextResponse.json({ error: "Google Sheets 尚未连接" }, { status: 503 });
  }
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "submit", token: sharedToken, answers: payload.answers }),
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) throw new Error(`upstream_status_${response.status}`);
    const result = await response.json() as { ok?: boolean };
    if (!result.ok) throw new Error("upstream_rejected_submission");
    console.info("[api/survey] success", { action: "submit", answerCount, ms: Date.now() - started });
    return NextResponse.json({ ok: true });
  } catch (reason) {
    const message = reason instanceof Error ? reason.message : "unknown";
    console.error("[api/survey] fail", { action: "submit", answerCount, reason: message.slice(0, 120), ms: Date.now() - started });
    return NextResponse.json({ error: "写入数据表失败" }, { status: 502 });
  }
}

export async function GET() {
  const started = Date.now();
  console.info("[api/survey] enter", { action: "analysis" });
  if (!endpoint || !sharedToken) {
    console.warn("[api/survey] fail", { action: "analysis", reason: "sheets_not_configured", ms: Date.now() - started });
    return NextResponse.json({ error: "Google Sheets 尚未连接", configured: false }, { status: 503 });
  }
  try {
    const response = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "analysis", token: sharedToken }), cache: "no-store", signal: AbortSignal.timeout(12_000) });
    if (!response.ok) throw new Error(`upstream_status_${response.status}`);
    const result = await response.json() as { ok?: boolean; [key: string]: unknown };
    if (!result.ok) throw new Error("upstream_rejected_analysis");
    console.info("[api/survey] success", { action: "analysis", ms: Date.now() - started });
    return NextResponse.json({ ...result, configured: true });
  } catch (reason) {
    const message = reason instanceof Error ? reason.message : "unknown";
    console.error("[api/survey] fail", { action: "analysis", reason: message.slice(0, 120), ms: Date.now() - started });
    return NextResponse.json({ error: "暂时无法读取分析数据", configured: true }, { status: 502 });
  }
}
