"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";

interface AnalysisResult {
  summary: string;
  risks: string[];
  recommendations: string[];
  actionPlan: string[];
}

export function AnalyzePageClient() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  async function handleAnalyze() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/analyze", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ошибка анализа");
        return;
      }

      setResult(data);
    } catch {
      setError("Не удалось выполнить анализ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="ИИ-анализ"
        description="Персональные рекомендации от финансового директора"
        action={
          <Button onClick={handleAnalyze} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {loading ? "Анализ..." : "Запустить анализ"}
          </Button>
        }
      />

      {error && (
        <Card className="mb-6 border-danger/30">
          <p className="text-red-400 text-sm">{error}</p>
        </Card>
      )}

      {!result && !loading && !error && (
        <Card>
          <CardHeader>
            <CardTitle>Финансовый директор на базе ИИ</CardTitle>
            <CardDescription>
              Нажмите «Запустить анализ», чтобы получить персональную оценку
              вашего финансового состояния, рисков и план действий
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {result && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Общая оценка</CardTitle>
            </CardHeader>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {result.summary}
            </p>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-red-400">Риски</CardTitle>
              </CardHeader>
              <ul className="space-y-2 text-sm">
                {result.risks.map((risk, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-red-400 shrink-0">•</span>
                    {risk}
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base text-emerald-400">
                  Рекомендации
                </CardTitle>
              </CardHeader>
              <ul className="space-y-2 text-sm">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-emerald-400 shrink-0">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">План действий</CardTitle>
            </CardHeader>
            <ol className="space-y-2 text-sm list-decimal list-inside">
              {result.actionPlan.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </Card>
        </div>
      )}
    </div>
  );
}
