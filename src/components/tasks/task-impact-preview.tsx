import { cn, formatCurrency } from "@/lib/utils";
import type { TaskImpact } from "@/types/task-impact";

interface TaskImpactPreviewProps {
  impact: TaskImpact;
  compact?: boolean;
  className?: string;
}

function DeltaValue({
  delta,
  suffix = "",
  invert = false,
}: {
  delta: number | null;
  suffix?: string;
  invert?: boolean;
}) {
  if (delta === null || delta === 0) {
    return <span className="text-muted">—</span>;
  }

  const effective = invert ? -delta : delta;
  const positive = effective > 0;
  const negative = effective < 0;

  return (
    <span
      className={cn(
        "font-medium",
        positive && "text-emerald-400",
        negative && "text-red-400"
      )}
    >
      {positive ? "+" : ""}
      {effective}
      {suffix}
    </span>
  );
}

function MetricRow({
  label,
  current,
  projected,
  format = "text",
}: {
  label: string;
  current: string | number | null;
  projected: string | number | null;
  format?: "text" | "currency" | "months";
}) {
  const formatValue = (value: string | number | null) => {
    if (value === null) return "—";
    if (format === "currency") return formatCurrency(Number(value));
    if (format === "months") return `${value} мес`;
    return String(value);
  };

  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="text-muted shrink-0">{label}</span>
      <span className="text-right">
        {formatValue(current)} → {formatValue(projected)}
      </span>
    </div>
  );
}

export function TaskImpactPreview({
  impact,
  compact = false,
  className,
}: TaskImpactPreviewProps) {
  const indexDelta =
    impact.current_index !== null && impact.projected_index !== null
      ? impact.projected_index - impact.current_index
      : null;
  const cashflowDelta =
    Number(impact.projected_cashflow) - Number(impact.current_cashflow);
  const goalMonthsDelta =
    impact.current_goal_months !== null &&
    impact.projected_goal_months !== null
      ? impact.current_goal_months - impact.projected_goal_months
      : null;

  const lowConfidence = impact.confidence < 55;

  if (compact) {
    return (
      <div className={cn("space-y-1.5 text-xs", className)}>
        <p className="text-muted">После выполнения:</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {indexDelta !== null && indexDelta !== 0 && (
            <span>
              <DeltaValue delta={indexDelta} suffix=" к индексу" />
            </span>
          )}
          {cashflowDelta !== 0 && (
            <span className="text-emerald-400 font-medium">
              {cashflowDelta > 0 ? "+" : ""}
              {formatCurrency(cashflowDelta)} к чистому потоку
            </span>
          )}
          {goalMonthsDelta !== null && goalMonthsDelta !== 0 && (
            <span>
              <DeltaValue delta={goalMonthsDelta} suffix=" мес до цели" invert />
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-border/60 bg-surface-hover/20 p-3 space-y-2",
        className
      )}
    >
      <p className="text-xs font-medium text-foreground">Ожидаемый эффект</p>

      <MetricRow
        label="Финансовый индекс"
        current={impact.current_index}
        projected={impact.projected_index}
      />
      <MetricRow
        label="Чистый поток"
        current={impact.current_cashflow}
        projected={impact.projected_cashflow}
        format="currency"
      />
      {(impact.current_goal_months !== null ||
        impact.projected_goal_months !== null) && (
        <MetricRow
          label="Достижение цели"
          current={impact.current_goal_months}
          projected={impact.projected_goal_months}
          format="months"
        />
      )}

      <div className="flex items-center justify-between pt-1 text-sm border-t border-border/40">
        <span className="text-muted">Вероятность результата</span>
        <span
          className={cn(
            "font-medium",
            lowConfidence ? "text-yellow-400" : "text-emerald-400"
          )}
        >
          {impact.confidence}%
        </span>
      </div>
    </div>
  );
}
