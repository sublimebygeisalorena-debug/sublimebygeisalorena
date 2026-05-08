
create or replace function public.get_telegram_webhook_secret()
returns text
language sql
stable
security definer
set search_path = private, public
as $$
  select secret from private.webhook_secrets where id = 'telegram';
$$;
revoke all on function public.get_telegram_webhook_secret() from public, anon, authenticated;
grant execute on function public.get_telegram_webhook_secret() to service_role;
