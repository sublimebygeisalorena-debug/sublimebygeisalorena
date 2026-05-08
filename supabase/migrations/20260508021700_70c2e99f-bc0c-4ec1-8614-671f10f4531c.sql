
-- Table of telegram chat_ids that should receive notifications
create table if not exists public.telegram_subscribers (
  id uuid primary key default gen_random_uuid(),
  chat_id bigint not null unique,
  label text,
  created_at timestamptz not null default now()
);

alter table public.telegram_subscribers enable row level security;

create policy "Admins manage telegram_subscribers"
on public.telegram_subscribers for all to authenticated
using (has_role(auth.uid(), 'admin'::app_role))
with check (has_role(auth.uid(), 'admin'::app_role));

-- Enable pg_net for HTTP calls from triggers
create extension if not exists pg_net with schema extensions;

-- Trigger function: notify edge function on order insert/status change
create or replace function public.notify_telegram_order()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  payload jsonb;
  fn_url text;
begin
  if (tg_op = 'INSERT') then
    payload := jsonb_build_object('event', 'created', 'order', to_jsonb(NEW));
  elsif (tg_op = 'UPDATE' and NEW.status is distinct from OLD.status) then
    payload := jsonb_build_object('event', 'status_changed',
      'old_status', OLD.status, 'new_status', NEW.status, 'order', to_jsonb(NEW));
  else
    return NEW;
  end if;

  fn_url := 'https://fhqkwabwvcqsilfieabj.supabase.co/functions/v1/telegram-notify-order';

  perform extensions.http_post(
    url := fn_url,
    body := payload,
    headers := jsonb_build_object('Content-Type','application/json')
  );

  return NEW;
end;
$$;

drop trigger if exists trg_notify_telegram_order on public.orders;
create trigger trg_notify_telegram_order
after insert or update on public.orders
for each row execute function public.notify_telegram_order();
