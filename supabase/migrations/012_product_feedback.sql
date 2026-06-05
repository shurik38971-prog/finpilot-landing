-- Опрос после анализа и сообщения обратной связи

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  usefulness_score integer check (usefulness_score between 1 and 10),
  most_useful_features text[] default '{}',
  confusion_text text,
  disappearance_score text,
  created_at timestamptz not null default now()
);

create unique index if not exists feedback_user_id_unique_idx
  on public.feedback(user_id);

create index if not exists feedback_created_at_idx
  on public.feedback(created_at desc);

create table if not exists public.feedback_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('idea', 'bug', 'confusion')),
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists feedback_messages_created_at_idx
  on public.feedback_messages(created_at desc);

create index if not exists feedback_messages_user_id_idx
  on public.feedback_messages(user_id);

alter table public.feedback enable row level security;
alter table public.feedback_messages enable row level security;

drop policy if exists "Users manage own product feedback" on public.feedback;
create policy "Users manage own product feedback"
  on public.feedback for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Admins read product feedback" on public.feedback;
create policy "Admins read product feedback"
  on public.feedback for select
  to authenticated
  using (public.is_finpilot_admin());

drop policy if exists "Users manage own feedback messages" on public.feedback_messages;
create policy "Users manage own feedback messages"
  on public.feedback_messages for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Admins read feedback messages" on public.feedback_messages;
create policy "Admins read feedback messages"
  on public.feedback_messages for select
  to authenticated
  using (public.is_finpilot_admin());
