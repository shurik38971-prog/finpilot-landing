-- Прогноз эффекта действий: симуляция влияния задач на финансы

create table if not exists public.task_impacts (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.financial_tasks(id) on delete cascade,
  current_index integer,
  projected_index integer,
  current_cashflow numeric,
  projected_cashflow numeric,
  current_goal_months integer,
  projected_goal_months integer,
  confidence integer,
  created_at timestamptz default now()
);

create unique index if not exists task_impacts_task_id_unique
on public.task_impacts(task_id);

create index if not exists task_impacts_task_id_idx
on public.task_impacts(task_id);

alter table public.task_impacts enable row level security;

drop policy if exists "Users manage own task impacts" on public.task_impacts;

create policy "Users manage own task impacts"
  on public.task_impacts for all
  using (
    exists (
      select 1 from public.financial_tasks t
      where t.id = task_id and t.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.financial_tasks t
      where t.id = task_id and t.user_id = auth.uid()
    )
  );
