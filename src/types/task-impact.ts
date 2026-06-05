export interface TaskImpact {
  id: string;
  task_id: string;
  current_index: number | null;
  projected_index: number | null;
  current_cashflow: number;
  projected_cashflow: number;
  current_goal_months: number | null;
  projected_goal_months: number | null;
  confidence: number;
  created_at: string;
}

export interface TaskImpactSimulation {
  currentFinancialIndex: number | null;
  projectedFinancialIndex: number | null;
  currentCashflow: number;
  projectedCashflow: number;
  currentDebtLoad: number;
  projectedDebtLoad: number;
  currentGoalMonths: number | null;
  projectedGoalMonths: number | null;
  confidence: number;
}

export interface CurrentFinanceState {
  financialIndex: number | null;
  netCashFlow: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  debtPayments: number;
  totalDebt: number;
}
