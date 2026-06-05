import type { AnalysisRecord } from "@/types/analysis";

export function computeIndexDelta(
  current: number | null,
  previous: number | null
): number | null {
  if (current === null || previous === null) return null;
  return current - previous;
}

export function buildFallbackComparison(
  current: Pick<AnalysisRecord, "financial_index" | "main_problem">,
  previous: Pick<AnalysisRecord, "financial_index" | "main_problem">,
  delta: number | null
): string {
  if (delta === null) {
    return "Недостаточно данных для сравнения индексов.";
  }
  if (delta === 0) {
    return `Финансовый индекс не изменился (${current.financial_index}). Главная проблема: «${current.main_problem}».`;
  }
  if (delta < 0) {
    return `Финансовое положение ухудшилось на ${Math.abs(delta)} пункта (с ${previous.financial_index} до ${current.financial_index}). Ранее: «${previous.main_problem}», сейчас: «${current.main_problem}».`;
  }
  return `Финансовое положение улучшилось на ${delta} пункта (с ${previous.financial_index} до ${current.financial_index}). Ранее: «${previous.main_problem}», сейчас: «${current.main_problem}».`;
}
