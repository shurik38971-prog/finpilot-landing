import type { Debt, DebtPayoffPlan, DebtPayoffStep } from "@/types/database";

interface DebtState {
  id: string;
  title: string;
  remaining: number;
  rate: number;
  minimum: number;
}

function sortDebts(debts: DebtState[], strategy: "avalanche" | "snowball"): DebtState[] {
  return [...debts].sort((a, b) => {
    if (strategy === "avalanche") return b.rate - a.rate;
    return a.remaining - b.remaining;
  });
}

function applyMonthlyInterest(debt: DebtState): number {
  const interest = debt.remaining * (debt.rate / 100 / 12);
  debt.remaining += interest;
  return interest;
}

export function calculateDebtPayoff(
  debts: Debt[],
  extraPayment: number,
  strategy: "avalanche" | "snowball"
): DebtPayoffPlan {
  if (debts.length === 0) {
    return { strategy, monthsToFreedom: 0, totalInterest: 0, steps: [] };
  }

  const states: DebtState[] = debts.map((d) => ({
    id: d.id,
    title: d.title,
    remaining: d.remaining_amount,
    rate: d.interest_rate,
    minimum: d.minimum_payment,
  }));

  const steps: DebtPayoffStep[] = [];
  let month = 0;
  let totalInterest = 0;
  const maxMonths = 600;

  while (states.some((s) => s.remaining > 0.01) && month < maxMonths) {
    month++;
    let budget = extraPayment;

    for (const debt of states) {
      if (debt.remaining <= 0) continue;
      const interest = applyMonthlyInterest(debt);
      totalInterest += interest;

      const minPay = Math.min(debt.minimum, debt.remaining);
      debt.remaining -= minPay;
      steps.push({
        month,
        debtTitle: debt.title,
        payment: minPay,
        remaining: Math.max(0, debt.remaining),
        interestPaid: interest,
      });
    }

    const active = sortDebts(
      states.filter((s) => s.remaining > 0.01),
      strategy
    );

    for (const debt of active) {
      if (budget <= 0) break;
      const pay = Math.min(budget, debt.remaining);
      debt.remaining -= pay;
      budget -= pay;
      steps.push({
        month,
        debtTitle: debt.title,
        payment: pay,
        remaining: Math.max(0, debt.remaining),
        interestPaid: 0,
      });
    }
  }

  return {
    strategy,
    monthsToFreedom: month,
    totalInterest: Math.round(totalInterest),
    steps,
  };
}

export function strategyLabel(strategy: "avalanche" | "snowball"): string {
  return strategy === "avalanche"
    ? "Лавина (высокая ставка)"
    : "Снежный ком (малый долг)";
}
