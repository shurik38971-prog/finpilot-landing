"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buildFallbackComparison } from "@/lib/finance/analysis-comparison";
import { formatHistoryDate } from "@/lib/utils";
import type { AnalysisComparison, AnalysisRecord } from "@/types/analysis";
import { ArrowDown, ArrowUp, History, Minus } from "lucide-react";
import Link from "next/link";

function buildComparison(analyses: AnalysisRecord[]): AnalysisComparison | null {
  if (analyses.length < 2) return null;

  const current = analyses[0];
  const previous = analyses[1];
  const indexDelta =
    current.index_delta ??
    (current.financial_index !== null && previous.financial_index !== null
      ? current.financial_index - previous.financial_index
      : null);

  const comment =
    current.comparison_comment ??
    buildFallbackComparison(current, previous, indexDelta);

  return {
    current,
    previous,
    indexDelta,
    comment,
  };
}

function IndexBadge({ index }: { index: number | null }) {
  if (index === null) {
    return <span className="text-muted">—</span>;
  }
  return <span className="font-semibold">{index}</span>;
}

function DeltaBadge({ delta }: { delta: number | null }) {
  if (delta === null) return null;

  if (delta === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-sm text-muted">
        <Minus className="h-4 w-4" />
        без изменений
      </span>
    );
  }

  const isUp = delta > 0;

  return (
    <span
      className={`inline-flex items-center gap-1 text-sm font-medium ${
        isUp ? "text-emerald-400" : "text-red-400"
      }`}
    >
      {isUp ? (
        <ArrowUp className="h-4 w-4" />
      ) : (
        <ArrowDown className="h-4 w-4" />
      )}
      {isUp ? "+" : ""}
      {delta} {Math.abs(delta) === 1 ? "пункт" : "пункта"}
    </span>
  );
}

interface HistoryPageClientProps {
  analyses: AnalysisRecord[];
}

export function HistoryPageClient({ analyses }: HistoryPageClientProps) {
  const comparison = buildComparison(analyses);

  return (
    <div>
      <PageHeader
        title="История анализов"
        description="Динамика финансового состояния и сравнение с предыдущим анализом"
      />

      {comparison && (
        <Card className="mb-6 border-accent/30">
          <CardHeader>
            <CardTitle className="text-base">Сравнение с предыдущим анализом</CardTitle>
            <CardDescription>
              {formatHistoryDate(comparison.current.created_at)} vs{" "}
              {formatHistoryDate(comparison.previous.created_at)}
            </CardDescription>
          </CardHeader>
          <div className="px-5 pb-5 space-y-4">
            <div>
              <p className="text-sm text-muted mb-2">Финансовый индекс</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="rounded-lg bg-surface-hover/50 p-3">
                  <p className="text-muted text-xs mb-1">Текущий</p>
                  <p className="text-2xl font-bold">
                    {comparison.current.financial_index ?? "—"}
                  </p>
                </div>
                <div className="rounded-lg bg-surface-hover/50 p-3">
                  <p className="text-muted text-xs mb-1">Предыдущий</p>
                  <p className="text-2xl font-bold">
                    {comparison.previous.financial_index ?? "—"}
                  </p>
                </div>
                <div className="rounded-lg bg-surface-hover/50 p-3 flex flex-col justify-center">
                  <p className="text-muted text-xs mb-1">Изменение</p>
                  <DeltaBadge delta={comparison.indexDelta} />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-surface-hover/30 p-4">
              <p className="text-xs text-muted mb-2">
                {comparison.current.comparison_comment
                  ? "Комментарий ИИ"
                  : "Сравнение"}
              </p>
              <p className="text-sm leading-relaxed">{comparison.comment}</p>
            </div>
          </div>
        </Card>
      )}

      {analyses.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center py-16 text-center px-6">
            <div className="rounded-full bg-surface-hover p-4 mb-4">
              <History className="h-8 w-8 text-muted" />
            </div>
            <h3 className="text-lg font-medium mb-1">История пуста</h3>
            <p className="text-sm text-muted max-w-sm mb-4">
              Запустите ИИ-анализ — результаты будут сохраняться здесь автоматически.
            </p>
            <Link
              href="/analyze"
              className="text-sm text-accent hover:underline"
            >
              Перейти к ИИ-анализу →
            </Link>
          </div>
        </Card>
      ) : (
        <div className="glass overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-border text-muted">
                <th className="px-4 py-3 text-left font-medium">Дата</th>
                <th className="px-4 py-3 text-left font-medium">Индекс</th>
                <th className="px-4 py-3 text-left font-medium">Δ</th>
                <th className="px-4 py-3 text-left font-medium">Главная проблема</th>
              </tr>
            </thead>
            <tbody>
              {analyses.map((row, i) => (
                <tr
                  key={row.id}
                  className="border-b border-border/50 hover:bg-surface-hover/50 transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    {formatHistoryDate(row.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <IndexBadge index={row.financial_index} />
                  </td>
                  <td className="px-4 py-3">
                    {i === 0 && row.index_delta !== null ? (
                      <Badge
                        variant={
                          row.index_delta > 0
                            ? "success"
                            : row.index_delta < 0
                              ? "danger"
                              : "default"
                        }
                      >
                        {row.index_delta > 0 ? "+" : ""}
                        {row.index_delta}
                      </Badge>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{row.main_problem}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
