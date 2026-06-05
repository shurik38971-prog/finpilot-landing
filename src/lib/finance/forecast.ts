import { addMonths, format } from "date-fns";
import { ru } from "date-fns/locale";
import type { CashFlowForecast, Debt, Expense, Income } from "@/types/database";
import {
  monthlyDebtPayments,
  monthlyExpenseTotal,
  monthlyIncomeTotal,
} from "@/lib/finance/index";

export function forecastCashFlow(
  incomes: Income[],
  expenses: Expense[],
  debts: Debt[],
  months = 3
): CashFlowForecast[] {
  const baseIncome = monthlyIncomeTotal(incomes);
  const baseExpenses = monthlyExpenseTotal(expenses);
  const debtPayments = monthlyDebtPayments(debts);

  // Adjust for recent one-time items (last 30 days avg vs recurring)
  const recentIncome = incomes
    .filter((i) => !i.is_recurring)
    .reduce((s, i) => s + i.amount, 0);
  const adjustedIncome = baseIncome * 0.7 + (recentIncome / 3) * 0.3;

  const forecast: CashFlowForecast[] = [];
  let cumulative = 0;
  const now = new Date();

  for (let m = 0; m < months; m++) {
    const monthDate = addMonths(now, m);
    const monthLabel = format(monthDate, "LLL yyyy", { locale: ru });

    // Slight decay for self-employed uncertainty
    const uncertaintyFactor = 1 - m * 0.03;
    const income = Math.round(adjustedIncome * uncertaintyFactor);
    const expenseTotal = Math.round(baseExpenses);
    const net = income - expenseTotal - debtPayments;
    cumulative += net;

    forecast.push({
      month: monthLabel,
      income,
      expenses: expenseTotal,
      debtPayments,
      net,
      cumulative,
    });
  }

  return forecast;
}
