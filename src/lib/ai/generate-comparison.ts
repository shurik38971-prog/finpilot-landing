import { gptunnelChat } from "@/lib/ai/gptunnel";
import {
  buildFallbackComparison,
  computeIndexDelta,
} from "@/lib/finance/analysis-comparison";
import { formatHistoryDate } from "@/lib/utils";
import type { AnalysisRecord } from "@/types/analysis";

export { computeIndexDelta };

export async function generateComparisonComment(
  current: AnalysisRecord,
  previous: AnalysisRecord
): Promise<string> {
  const delta = computeIndexDelta(
    current.financial_index,
    previous.financial_index
  );

  const prompt = `
Сравни два последовательных финансовых анализа самозанятого.

Предыдущий анализ (${formatHistoryDate(previous.created_at)}):
- финансовый индекс: ${previous.financial_index ?? "нет данных"}
- главная проблема: ${previous.main_problem}

Текущий анализ (${formatHistoryDate(current.created_at)}):
- финансовый индекс: ${current.financial_index ?? "нет данных"}
- главная проблема: ${current.main_problem}

Изменение индекса: ${delta === null ? "невозможно вычислить" : `${delta > 0 ? "+" : ""}${delta} пунктов`}

Напиши 1–2 предложения: что изменилось и почему.
Если положение ухудшилось — не смягчай формулировки.
Верни только текст, без JSON и markdown.
`;

  const result = await gptunnelChat(
    [
      {
        role: "system",
        content:
          "Ты финансовый директор. Кратко объясняй динамику между двумя анализами.",
      },
      { role: "user", content: prompt },
    ],
    0.2
  );

  if (!result.ok) {
    console.error("Comparison AI error:", result.error, result.details);
    return buildFallbackComparison(current, previous, delta);
  }

  return result.content.trim();
}
