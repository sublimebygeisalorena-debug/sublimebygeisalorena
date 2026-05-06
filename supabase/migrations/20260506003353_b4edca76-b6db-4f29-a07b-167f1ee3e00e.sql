
-- Promote admin
insert into public.user_roles (user_id, role)
values ('5c77646e-bdce-4911-8c9f-9fc262ea3b83', 'admin')
on conflict do nothing;

-- Editable site content blocks
create table public.site_content (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;
create policy "Public read site_content" on public.site_content for select using (true);
create policy "Admins write site_content" on public.site_content
  for all to authenticated using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));
create trigger site_content_updated_at before update on public.site_content
  for each row execute function public.touch_updated_at();

-- Articles
create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  category text,
  reading_time text,
  cover_url text,
  content text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.articles enable row level security;
create policy "Public read published articles" on public.articles
  for select using (published = true);
create policy "Admins read all articles" on public.articles
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins manage articles" on public.articles
  for all to authenticated using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));
create trigger articles_updated_at before update on public.articles
  for each row execute function public.touch_updated_at();

-- Storage bucket
insert into storage.buckets (id, name, public) values ('media', 'media', true)
  on conflict (id) do nothing;

create policy "Public read media" on storage.objects for select using (bucket_id = 'media');
create policy "Admins upload media" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));
create policy "Admins update media" on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));
create policy "Admins delete media" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));
