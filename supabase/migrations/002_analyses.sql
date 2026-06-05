-- История ИИ-анализов

create table public.analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  financial_index integer,
  main_problem text not null,
  recommendations jsonb not null default '{}',
  model_used text,
  created_at timestamptz not null default now()
);

create index analyses_user_id_idx on public.analyses(user_id);
create index analyses_created_at_idx on public.analyses(created_at desc);

alter table public.analyses enable row level security;

create policy "Users manage own analyses"
  on public.analyses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
