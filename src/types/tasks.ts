export type TaskStatus = "pending" | "done" | "postponed";

export interface FinancialTask {
  id: string;
  user_id: string;
  analysis_id: string | null;
  title: string;
  description: string | null;
  impact_score: number;
  impact_label: string | null;
  status: TaskStatus;
  due_date: string | null;
  created_at: string;
  completed_at: string | null;
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Активна",
  done: "Выполнена",
  postponed: "Отложена",
};
