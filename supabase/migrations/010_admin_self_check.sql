-- Пользователь может проверить, есть ли его email в admin_users (для входа в /admin)

drop policy if exists "Users check own admin row" on public.admin_users;
create policy "Users check own admin row"
  on public.admin_users for select
  to authenticated
  using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

grant execute on function public.is_finpilot_admin() to authenticated;
