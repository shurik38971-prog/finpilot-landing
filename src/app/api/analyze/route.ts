import { getAnalysisContext } from "@/lib/actions/finance";
import {
  computeIndexDelta,
  generateComparisonComment,
} from "@/lib/ai/generate-comparison";
import { getGptunnelConfig, gptunnelChat } from "@/lib/ai/gptunnel";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { AiAnalysisResult, AnalysisRecord } from "@/types/analysis";
import { NextResponse } from "next/server";

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

    const chatResult = await gptunnelChat(
      [
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
        { role: "user", content: prompt },
      ],
      0.3
    );

    if (!chatResult.ok) {
      console.error("GPTunnel error:", chatResult.status, chatResult.details);
      return NextResponse.json(
        {
          error: chatResult.error,
          status: chatResult.status,
          details: chatResult.details,
        },
        { status: chatResult.status ?? 500 }
      );
    }

    const parsed = extractJsonFromText(chatResult.content) as AiAnalysisResult;
    console.log("Model used:", chatResult.model);

    const mainProblem =
      parsed.main_threat?.trim() || parsed.summary?.trim() || "Не определена";

    const { data: previousAnalysis } = await supabase
      .from("analyses")
      .select(
        "id, user_id, financial_index, main_problem, recommendations, model_used, index_delta, comparison_comment, created_at"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const indexDelta = previousAnalysis
      ? computeIndexDelta(
          context.financialIndex,
          previousAnalysis.financial_index
        )
      : null;

    let comparisonComment: string | null = null;

    const { data: saved, error: saveError } = await supabase
      .from("analyses")
      .insert({
        user_id: user.id,
        financial_index: context.financialIndex,
        main_problem: mainProblem,
        recommendations: parsed,
        model_used: chatResult.model,
        index_delta: indexDelta,
      })
      .select(
        "id, user_id, financial_index, main_problem, recommendations, model_used, index_delta, comparison_comment, created_at"
      )
      .single();

    if (saveError) {
      console.error("Failed to save analysis:", saveError);
    } else if (previousAnalysis && saved) {
      comparisonComment = await generateComparisonComment(
        saved as AnalysisRecord,
        previousAnalysis as AnalysisRecord
      );

      await supabase
        .from("analyses")
        .update({ comparison_comment: comparisonComment })
        .eq("id", saved.id);
    }

    revalidatePath("/history");

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
