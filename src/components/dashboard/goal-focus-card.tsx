import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency, formatHistoryDate } from "@/lib/utils";
import { HintTooltip } from "@/components/ui/hint-tooltip";
import { benefitLabel, HINTS } from "@/lib/copy/ui";
import { GOAL_TYPE_LABELS } from "@/types/goals";
import type { PrimaryGoalFocus } from "@/types/tasks";
import { TaskImpactPreview } from "@/components/tasks/task-impact-preview";
import { CheckCircle2, Target } from "lucide-react";
import Link from "next/link";

function impactVariant(score: number): "danger" | "warning" | "success" | "default" {
  if (score >= 70) return "danger";
  if (score >= 45) return "warning";
  return "default";
}

interface GoalFocusCardProps {
  focus: PrimaryGoalFocus | null;
}

export function GoalFocusCard({ focus }: GoalFocusCardProps) {
  if (!focus) {
    return (
      <Card className="border-accent/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-accent" />
            Цель
            <HintTooltip hint={HINTS.goal} />
          </CardTitle>
          <CardDescription>
            Задайте цель и запустите ИИ-разбор — FinPilot свяжет дела с путём
            к результату.
          </CardDescription>
        </CardHeader>
        <div className="px-5 pb-5 flex gap-2">
          <Link href="/goals">
            <Button variant="secondary" size="sm">
              Создать цель
            </Button>
          </Link>
          <Link href="/actions">
            <Button size="sm">К действиям</Button>
          </Link>
        </div>
      </Card>
    );
  }

  const { goal, task, remaining, progressPercent, taskImpact } = focus;

  return (
    <Card className="border-accent/30 bg-accent/5">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted mb-1">
              {GOAL_TYPE_LABELS[goal.type]}
            </p>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-accent" />
              <span>Цель</span>
              <HintTooltip hint={HINTS.goal} />
              <span className="text-muted font-normal">·</span>
              <span className="truncate">{goal.title}</span>
            </CardTitle>
          </div>
          <Badge variant="default">{progressPercent}%</Badge>
        </div>
        <CardDescription>
          Осталось: {formatCurrency(remaining)} из {formatCurrency(goal.target_amount)}
        </CardDescription>
      </CardHeader>

      <div className="px-5 pb-5 space-y-4">
        <div className="h-2 rounded-full bg-surface-hover overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              progressPercent >= 100 ? "bg-emerald-400" : "bg-accent"
            )}
            style={{ width: `${Math.min(100, progressPercent)}%` }}
          />
        </div>

        {task ? (
          <div className="rounded-lg border border-border bg-surface-hover/30 p-4 space-y-2">
            <p className="text-xs text-muted flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Главное действие для цели
            </p>
            <p className="text-sm font-medium">{task.title}</p>
            {task.description && (
              <p className="text-sm text-muted leading-relaxed">{task.description}</p>
            )}
            <div className="flex flex-wrap gap-2 text-xs text-muted">
              <Badge variant={impactVariant(task.impact_score)}>
                {benefitLabel(task.impact_score, task.impact_label)}
              </Badge>
              {task.due_date && (
                <span>до {formatHistoryDate(task.due_date)}</span>
              )}
            </div>
            {(taskImpact ?? task.impact) && (
              <TaskImpactPreview
                impact={(taskImpact ?? task.impact)!}
                compact
              />
            )}
          </div>
        ) : (
          <p className="text-sm text-muted">
            Нет активных задач для этой цели. Запустите ИИ-анализ.
          </p>
        )}

        <div className="flex gap-2">
          <Link href="/goals">
            <Button variant="secondary" size="sm">
              Все цели
            </Button>
          </Link>
          <Link href="/actions">
            <Button size="sm">Что делать</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
