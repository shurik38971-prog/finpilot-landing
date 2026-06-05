"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  calculateDebtPayoff,
  strategyLabel,
} from "@/lib/finance/debt-strategies";
import { formatCurrency } from "@/lib/utils";
import type { Debt } from "@/types/database";
import { useMemo, useState } from "react";

export function CrisisPageClient({ debts }: { debts: Debt[] }) {
  const [extraPayment, setExtraPayment] = useState(5000);

  const avalanche = useMemo(
    () => calculateDebtPayoff(debts, extraPayment, "avalanche"),
    [debts, extraPayment]
  );

  const snowball = useMemo(
    () => calculateDebtPayoff(debts, extraPayment, "snowball"),
    [debts, extraPayment]
  );

  const better =
    avalanche.totalInterest <= snowball.totalInterest ? "avalanche" : "snowball";

  return (
    <div>
      <PageHeader
        title="Антикризисный режим"
        description="Стратегии погашения долгов: лавина и снежный ком"
      />

      <div className="mb-6 max-w-xs">
        <Input
          id="extra"
          label="Дополнительный платёж в месяц (₽)"
          type="number"
          min="0"
          value={extraPayment}
          onChange={(e) => setExtraPayment(Number(e.target.value))}
        />
      </div>

      {debts.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Нет долгов</CardTitle>
            <CardDescription>
              Добавьте долги на странице «Долги», чтобы увидеть план погашения
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {([avalanche, snowball] as const).map((plan) => (
            <Card key={plan.strategy}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{strategyLabel(plan.strategy)}</CardTitle>
                  {plan.strategy === better && (
                    <Badge variant="success">Выгоднее</Badge>
                  )}
                </div>
                <CardDescription>
                  Метод{" "}
                  {plan.strategy === "avalanche"
                    ? "— сначала долг с наивысшей ставкой"
                    : "— сначала самый маленький долг"}
                </CardDescription>
              </CardHeader>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted">Срок погашения</p>
                  <p className="text-xl font-bold">
                    {plan.monthsToFreedom} мес.
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted">Всего процентов</p>
                  <p className="text-xl font-bold text-red-400">
                    {formatCurrency(plan.totalInterest)}
                  </p>
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-1 text-sm">
                {plan.steps
                  .filter((s) => s.interestPaid > 0 || s.payment > s.remaining)
                  .slice(0, 20)
                  .map((step, i) => (
                    <div
                      key={i}
                      className="flex justify-between py-1.5 border-b border-border/30"
                    >
                      <span className="text-muted">
                        Мес. {step.month} — {step.debtTitle}
                      </span>
                      <span>{formatCurrency(step.payment)}</span>
                    </div>
                  ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
