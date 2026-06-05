-- Онбординг: прогресс нового пользователя

create table if not exists public.onboarding_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  income_done boolean not null default false,
  expenses_done boolean not null default false,
  debts_done boolean not null default false,
  goal_done boolean not null default false,
  analysis_done boolean not null default false,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onboarding_progress_user_id_idx
  on public.onboarding_progress(user_id);

alter table public.onboarding_progress enable row level security;

drop policy if exists "Users manage own onboarding progress" on public.onboarding_progress;
create policy "Users manage own onboarding progress"
  on public.onboarding_progress for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
