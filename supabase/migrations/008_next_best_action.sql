-- Next Best Action Engine: приоритет и финансовый эффект задач

alter table public.financial_tasks
add column if not exists priority_score integer default 0;

alter table public.financial_tasks
add column if not exists financial_impact integer default 0;

create index if not exists financial_tasks_priority_score_idx
on public.financial_tasks(priority_score desc);
