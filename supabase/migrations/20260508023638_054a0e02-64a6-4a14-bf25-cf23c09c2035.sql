-- Log de alertas enviados (dedupe)
create table public.telegram_alerts_log (
  id uuid primary key default gen_random_uuid(),
  alert_key text not null unique,
  sent_at timestamptz not null default now()
);

alter table public.telegram_alerts_log enable row level security;

create policy "Admins read telegram_alerts_log"
  on public.telegram_alerts_log for select
  to authenticated
  using (has_role(auth.uid(), 'admin'::app_role));

-- Função genérica para chamar telegram-event
create or replace function public.notify_telegram_event()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  payload jsonb;
  fn_url text := 'https://fhqkwabwvcqsilfieabj.supabase.co/functions/v1/telegram-event';
begin
  if (tg_table_name = 'reviews') then
    payload := jsonb_build_object('event','new_review','data', to_jsonb(NEW));
  elsif (tg_table_name = 'profiles') then
    payload := jsonb_build_object('event','new_signup','data', to_jsonb(NEW));
  else
    return NEW;
  end if;

  perform extensions.http_post(
    url := fn_url,
    body := payload,
    headers := jsonb_build_object('Content-Type','application/json')
  );

  return NEW;
end;
$$;

revoke all on function public.notify_telegram_event() from public, anon, authenticated;

create trigger trg_telegram_new_review
after insert on public.reviews
for each row execute function public.notify_telegram_event();

create trigger trg_telegram_new_signup
after insert on public.profiles
for each row execute function public.notify_telegram_event();