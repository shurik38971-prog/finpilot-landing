import type { AnalysisRecord } from "@/types/analysis";

export function computeIndexDelta(
  current: number | null,
  previous: number | null
): number | null {
  if (current === null || previous === null) return null;
  return current - previous;
}

export function buildFallbackComparison(
  current: Pick<
    AnalysisRecord,
    "financial_index" | "main_problem" | "main_problem_short"
  >,
  previous: Pick<
    AnalysisRecord,
    "financial_index" | "main_problem" | "main_problem_short"
  >,
  delta: number | null
): string {
  const currentLabel = current.main_problem_short ?? current.main_problem;
  const previousLabel = previous.main_problem_short ?? previous.main_problem;

  if (delta === null) {
    return "Недостаточно данных для сравнения оценок.";
  }
  if (delta === 0) {
    return `Оценка денег не изменилась (${current.financial_index}). Главная проблема: «${currentLabel}».`;
  }
  if (delta < 0) {
    return `С деньгами стало сложнее на ${Math.abs(delta)} балла (с ${previous.financial_index} до ${current.financial_index}). Ранее: «${previousLabel}», сейчас: «${currentLabel}».`;
  }
  return `С деньгами стало легче на ${delta} балла (с ${previous.financial_index} до ${current.financial_index}). Ранее: «${previousLabel}», сейчас: «${currentLabel}».`;
}
