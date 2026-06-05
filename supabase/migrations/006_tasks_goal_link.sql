alter table public.financial_tasks
add column if not exists goal_id uuid references public.financial_goals(id) on delete set null;

alter table public.financial_tasks
add column if not exists goal_progress_amount numeric(12, 2);

create index if not exists financial_tasks_goal_id_idx
on public.financial_tasks(goal_id);
