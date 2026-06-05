-- FinPilot initial schema

create table public.incomes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  amount numeric(12, 2) not null check (amount >= 0),
  category text not null default 'other',
  date date not null default current_date,
  is_recurring boolean not null default false,
  frequency text check (frequency in ('weekly', 'monthly', 'quarterly', 'yearly')),
  created_at timestamptz not null default now()
);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  amount numeric(12, 2) not null check (amount >= 0),
  category text not null default 'other',
  date date not null default current_date,
  is_recurring boolean not null default false,
  frequency text check (frequency in ('weekly', 'monthly', 'quarterly', 'yearly')),
  is_essential boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.debts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  total_amount numeric(12, 2) not null check (total_amount >= 0),
  remaining_amount numeric(12, 2) not null check (remaining_amount >= 0),
  interest_rate numeric(5, 2) not null default 0 check (interest_rate >= 0),
  minimum_payment numeric(12, 2) not null default 0 check (minimum_payment >= 0),
  due_day integer check (due_day between 1 and 31),
  priority integer not null default 0,
  created_at timestamptz not null default now()
);

create index incomes_user_id_idx on public.incomes(user_id);
create index expenses_user_id_idx on public.expenses(user_id);
create index debts_user_id_idx on public.debts(user_id);

alter table public.incomes enable row level security;
alter table public.expenses enable row level security;
alter table public.debts enable row level security;

create policy "Users manage own incomes"
  on public.incomes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own expenses"
  on public.expenses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own debts"
  on public.debts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
