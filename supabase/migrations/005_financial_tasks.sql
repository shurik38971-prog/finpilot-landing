-- Action Engine: финансовые задачи из ИИ-анализа

create table if not exists public.financial_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  analysis_id uuid references public.analyses(id) on delete set null,
  title text not null,
  description text,
  impact_score integer not null default 0,
  impact_label text,
  status text not null default 'pending',
  due_date date,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists financial_tasks_user_id_idx
on public.financial_tasks(user_id);

create index if not exists financial_tasks_status_idx
on public.financial_tasks(status);

create index if not exists financial_tasks_created_at_idx
on public.financial_tasks(created_at desc);

alter table public.financial_tasks enable row level security;

drop policy if exists "Users manage own financial tasks" on public.financial_tasks;

create policy "Users manage own financial tasks"
  on public.financial_tasks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
