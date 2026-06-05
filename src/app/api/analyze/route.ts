import { getAnalysisContext } from "@/lib/actions/finance";
import { createClient } from "@/lib/supabase/server";
import type { AiAnalysisResult } from "@/types/analysis";
import { NextResponse } from "next/server";

function getGptunnelConfig():
  | { ok: true; apiKey: string; baseUrl: string; model: string }
  | { ok: false; error: string } {
  const apiKey = process.env.GPTUNNEL_API_KEY;
  const baseUrl = process.env.GPTUNNEL_BASE_URL;
  const model = process.env.GPTUNNEL_MODEL;

  if (!apiKey) {
    return { ok: false, error: "GPTUNNEL_API_KEY не настроен" };
  }

  if (!baseUrl) {
    return { ok: false, error: "GPTUNNEL_BASE_URL не настроен" };
  }

  if (!model) {
    return { ok: false, error: "GPTUNNEL_MODEL не настроен" };
  }

  return {
    ok: true,
    apiKey,
    baseUrl: baseUrl.replace(/\/$/, ""),
    model,
  };
}

function extractJsonFromText(text: string) {
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start === -1 || end === -1 || end <= start) {
      throw new Error("ИИ вернул ответ без JSON");
    }

    return JSON.parse(cleaned.slice(start, end + 1));
  }
}

function buildAnalysisPrompt(context: Awaited<ReturnType<typeof getAnalysisContext>>) {
  return `
Проанализируй финансовые данные самозанятого:
${JSON.stringify(context, null, 2)}

Ответь строго в JSON формате:
{
  "summary": "краткая диагностика текущего положения",
  "health_status": "good | bad | critical",
  "health_explanation": "если положение хорошее — объясни почему; если плохое — прямо и без смягчения",
  "main_threat": "главная угроза для финансов",
  "money_leaks": ["утечка денег 1", "утечка денег 2"],
  "cash_gap_risk": {
    "level": "high | medium | low",
    "description": "риск кассового разрыва и его причины",
    "months_until_gap": 0
  },
  "plan_7_days": [
    { "action": "конкретное действие", "why": "зачем это срочно" }
  ],
  "plan_30_days": [
    { "action": "конкретное действие", "why": "ожидаемый эффект" }
  ],
  "plan_90_days": [
    { "action": "конкретное действие", "why": "стратегический эффект" }
  ]
}

Не добавляй markdown. Не добавляй пояснения вне JSON. Верни только JSON.
`;
}

export async function GET() {
  return NextResponse.json({ ok: true, route: "/api/analyze" });
}

export async function POST(_req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const config = getGptunnelConfig();

    if (!config.ok) {
      return NextResponse.json({ error: config.error }, { status: 500 });
    }

    const context = await getAnalysisContext();
    const prompt = buildAnalysisPrompt(context);
    const apiUrl = `${config.baseUrl}/chat/completions`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: "system",
            content: `Ты не консультант. Ты финансовый директор самозанятого с нестабильным доходом и долгами.
Твоя задача:
- найти главную угрозу;
- найти утечки денег;
- определить риск кассового разрыва;
- дать план на 7 дней;
- дать план на 30 дней;
- дать план на 90 дней.
Если финансовое положение хорошее — объясни почему.
Если плохое — не смягчай формулировки.
Отвечай только валидным JSON без markdown.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error("GPTunnel error:", response.status, errorText);

      return NextResponse.json(
        {
          error: "Ошибка GPTunnel API",
          status: response.status,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "Пустой ответ от ИИ", raw: data },
        { status: 500 }
      );
    }

    const parsed = extractJsonFromText(content) as AiAnalysisResult;
    console.log("Model used:", config.model);

    const mainProblem =
      parsed.main_threat?.trim() || parsed.summary?.trim() || "Не определена";

    const { error: saveError } = await supabase.from("analyses").insert({
      user_id: user.id,
      financial_index: context.financialIndex,
      main_problem: mainProblem,
      recommendations: parsed,
      model_used: config.model,
    });

    if (saveError) {
      console.error("Failed to save analysis:", saveError);
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Analyze error:", error);

    return NextResponse.json(
      {
        error: "Не удалось выполнить анализ",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
