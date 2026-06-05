export type AnalysisLevel = "high" | "medium" | "low";
export type HealthStatus = "good" | "bad" | "critical";

export interface AnalysisPlanItem {
  action: string;
  why: string;
}

export interface CashGapRisk {
  level: AnalysisLevel;
  description: string;
  months_until_gap?: number | null;
}

export interface AiAnalysisResult {
  summary: string;
  health_status: HealthStatus;
  health_explanation: string;
  main_threat: string;
  money_leaks: string[];
  cash_gap_risk: CashGapRisk;
  plan_7_days: AnalysisPlanItem[];
  plan_30_days: AnalysisPlanItem[];
  plan_90_days: AnalysisPlanItem[];
}

export interface AnalysisRecord {
  id: string;
  user_id: string;
  financial_index: number | null;
  main_problem: string;
  recommendations: AiAnalysisResult;
  model_used: string | null;
  created_at: string;
}
