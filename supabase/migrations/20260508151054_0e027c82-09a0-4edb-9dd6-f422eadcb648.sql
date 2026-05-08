
-- Private schema for internal secrets
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.webhook_secrets (
  id text primary key,
  secret text not null,
  created_at timestamptz not null default now()
);
revoke all on private.webhook_secrets from public, anon, authenticated;

insert into private.webhook_secrets (id, secret)
values ('telegram', encode(gen_random_bytes(32), 'hex'))
on conflict (id) do nothing;

-- Helper to fetch secret (security definer so triggers can read it)
create or replace function private.get_webhook_secret(_id text)
returns text
language sql
stable
security definer
set search_path = private
as $$
  select secret from private.webhook_secrets where id = _id;
$$;
revoke all on function private.get_webhook_secret(text) from public, anon, authenticated;

-- Update notify_telegram_event to include secret header
create or replace function public.notify_telegram_event()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  payload jsonb;
  fn_url text := 'https://fhqkwabwvcqsilfieabj.supabase.co/functions/v1/telegram-event';
  secret text := private.get_webhook_secret('telegram');
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
    headers := jsonb_build_object(
      'Content-Type','application/json',
      'x-webhook-secret', secret
    )
  );

  return NEW;
end;
$$;
revoke all on function public.notify_telegram_event() from public, anon, authenticated;

-- Update notify_telegram_order to include secret header
create or replace function public.notify_telegram_order()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  payload jsonb;
  fn_url text := 'https://fhqkwabwvcqsilfieabj.supabase.co/functions/v1/telegram-notify-order';
  secret text := private.get_webhook_secret('telegram');
begin
  if (tg_op = 'INSERT') then
    payload := jsonb_build_object('event', 'created', 'order', to_jsonb(NEW));
  elsif (tg_op = 'UPDATE' and NEW.status is distinct from OLD.status) then
    payload := jsonb_build_object('event', 'status_changed',
      'old_status', OLD.status, 'new_status', NEW.status, 'order', to_jsonb(NEW));
  else
    return NEW;
  end if;

  perform extensions.http_post(
    url := fn_url,
    body := payload,
    headers := jsonb_build_object(
      'Content-Type','application/json',
      'x-webhook-secret', secret
    )
  );

  return NEW;
end;
$$;
revoke all on function public.notify_telegram_order() from public, anon, authenticated;

-- Restrict public bucket listing on media (keep individual file reads public)
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Public read media" on storage.objects;
drop policy if exists "media_public_select" on storage.objects;

-- Note: we don't re-add a broad SELECT policy. Files in public buckets remain
-- accessible via direct URL, but listing is no longer permitted.
