
create type public.order_status as enum ('pending','paid','shipped','delivered','cancelled');

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  shopify_cart_id text,
  checkout_url text,
  total numeric(12,2) not null default 0,
  currency text not null default 'BRL',
  item_count int not null default 0,
  status public.order_status not null default 'pending',
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_user_id_idx on public.orders(user_id, created_at desc);

alter table public.orders enable row level security;

create policy "Users view own orders" on public.orders
  for select to authenticated using (auth.uid() = user_id);
create policy "Users create own orders" on public.orders
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Admins view all orders" on public.orders
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins update orders" on public.orders
  for update to authenticated using (public.has_role(auth.uid(), 'admin'));

create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.touch_updated_at();
