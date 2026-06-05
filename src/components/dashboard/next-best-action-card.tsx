"use client";

import { completeTask } from "@/lib/actions/tasks";
import { TaskImpactPreview } from "@/components/tasks/task-impact-preview";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { cn, formatCurrency, formatHistoryDate } from "@/lib/utils";
import { GOAL_TYPE_LABELS } from "@/types/goals";
import type { NextBestActionResult } from "@/types/tasks";
import {
  CheckCircle2,
  HelpCircle,
  Loader2,
  Sparkles,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface NextBestActionCardProps {
  action: NextBestActionResult | null;
}

export function NextBestActionCard({ action }: NextBestActionCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);

  if (!action) {
    return (
      <Card className="border-accent/30 bg-gradient-to-br from-accent/10 to-transparent">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            Следующее лучшее действие
          </CardTitle>
          <CardDescription>
            FinPilot выберет одно действие с максимальным эффектом. Запустите
            ИИ-анализ или создайте цель.
          </CardDescription>
        </CardHeader>
        <div className="px-5 pb-5 flex gap-2">
          <Link href="/analyze">
            <Button size="sm">ИИ-анализ</Button>
          </Link>
          <Link href="/actions">
            <Button variant="secondary" size="sm">
              Все действия
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  const { motivation, reasons, impact } = action;

  async function handleComplete() {
    setLoading(true);
    try {
      await completeTask(action!.id);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Card className="border-accent/40 bg-gradient-to-br from-accent/15 via-accent/5 to-transparent shadow-lg shadow-accent/5">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-accent mb-1">
                Следующее лучшее действие
              </p>
              <CardTitle className="text-xl md:text-2xl leading-tight">
                {action.title}
              </CardTitle>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="danger" className="text-xs">
                Приоритет {action.priority_score}/100
              </Badge>
              {action.financial_impact > 0 && (
                <Badge variant="success" className="text-xs">
                  +{formatCurrency(action.financial_impact)}/мес
                </Badge>
              )}
            </div>
          </div>

          {action.description && (
            <CardDescription className="text-sm leading-relaxed mt-2">
              {action.description}
            </CardDescription>
          )}

          {action.goal && (
            <div className="mt-3 inline-flex items-center gap-1 text-xs text-muted">
              <Target className="h-3.5 w-3.5" />
              {action.goal.title} · {GOAL_TYPE_LABELS[action.goal.type]}
            </div>
          )}
        </CardHeader>

        <div className="px-5 pb-5 space-y-4">
          {impact && <TaskImpactPreview impact={impact} />}

          {(motivation.indexFrom !== null ||
            motivation.goalMonthsFaster !== null ||
            motivation.monthlySavings !== null) && (
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
              <p className="text-xs font-medium text-emerald-400">
                Если выполнить это действие:
              </p>
              <ul className="text-sm space-y-1">
                {motivation.indexFrom !== null && motivation.indexTo !== null && (
                  <li>
                    Индекс:{" "}
                    <span className="text-muted">{motivation.indexFrom}</span>
                    {" → "}
                    <span className="text-emerald-400 font-medium">
                      {motivation.indexTo}
                    </span>
                  </li>
                )}
                {motivation.goalMonthsFaster !== null &&
                  motivation.goalMonthsFaster > 0 && (
                    <li className="text-emerald-400">
                      Цель: на {motivation.goalMonthsFaster} мес быстрее
                    </li>
                  )}
                {motivation.monthlySavings !== null &&
                  motivation.monthlySavings > 0 && (
                    <li className="text-emerald-400">
                      Экономия: {formatCurrency(motivation.monthlySavings)}/мес
                    </li>
                  )}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <span>Эффект: {action.impact_score}/100</span>
            {action.due_date && (
              <span>· до {formatHistoryDate(action.due_date)}</span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <Button onClick={handleComplete} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              Выполнено
            </Button>
            <Button
              variant="secondary"
              onClick={() => setWhyOpen(true)}
              disabled={loading}
            >
              <HelpCircle className="h-4 w-4" />
              Почему это важно?
            </Button>
            <Link href="/actions">
              <Button variant="ghost" size="sm">
                Все задачи
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      <Modal
        open={whyOpen}
        onClose={() => setWhyOpen(false)}
        title="Почему это важно?"
      >
        <p className="text-sm text-muted mb-4">
          Эта задача выбрана потому что:
        </p>
        <ul className="space-y-2">
          {reasons.map((reason) => (
            <li
              key={reason}
              className={cn(
                "flex items-start gap-2 text-sm rounded-lg border border-border/50 px-3 py-2",
                "bg-surface-hover/30"
              )}
            >
              <span className="text-accent mt-0.5">•</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-border/50 text-xs text-muted">
          FinPilot сравнивает все активные задачи и показывает ту, что даст
          максимальный финансовый эффект прямо сейчас (приоритет{" "}
          {action.priority_score}/100).
        </div>
      </Modal>
    </>
  );
}
