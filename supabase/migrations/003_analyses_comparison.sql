alter table public.analyses
add column if not exists index_delta integer;

alter table public.analyses
add column if not exists comparison_comment text;
