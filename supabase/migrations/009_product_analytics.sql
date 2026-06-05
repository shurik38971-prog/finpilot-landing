-- Продуктовая аналитика: клики, страницы, вопросы

create table if not exists public.product_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  session_id text not null,
  event_name text not null,
  page_path text,
  element_id text,
  properties jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists product_events_created_at_idx
on public.product_events(created_at desc);

create index if not exists product_events_event_name_idx
on public.product_events(event_name);

create index if not exists product_events_user_id_idx
on public.product_events(user_id);

create index if not exists product_events_session_id_idx
on public.product_events(session_id);

create table if not exists public.user_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  feedback_type text not null check (feedback_type in ('question', 'confusion', 'idea')),
  message text not null,
  page_path text,
  created_at timestamptz not null default now()
);

create index if not exists user_feedback_created_at_idx
on public.user_feedback(created_at desc);

create table if not exists public.admin_users (
  email text primary key
);

alter table public.product_events enable row level security;
alter table public.user_feedback enable row level security;
alter table public.admin_users enable row level security;

create or replace function public.is_finpilot_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

drop policy if exists "Users insert own product events" on public.product_events;
create policy "Users insert own product events"
  on public.product_events for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Admins read all product events" on public.product_events;
create policy "Admins read all product events"
  on public.product_events for select
  to authenticated
  using (public.is_finpilot_admin());

drop policy if exists "Users manage own feedback" on public.user_feedback;
create policy "Users manage own feedback"
  on public.user_feedback for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Admins read all feedback" on public.user_feedback;
create policy "Admins read all feedback"
  on public.user_feedback for select
  to authenticated
  using (public.is_finpilot_admin());

drop policy if exists "Admins read admin list" on public.admin_users;
create policy "Admins read admin list"
  on public.admin_users for select
  to authenticated
  using (public.is_finpilot_admin());
