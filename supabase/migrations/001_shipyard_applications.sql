-- Run in Supabase SQL editor (or via CLI) before accepting live applications.
-- Service role (used by Vercel /api only) bypasses RLS.

create table if not exists public.shipyard_applications (
  id uuid primary key default gen_random_uuid (),
  created_at timestamptz not null default now(),
  payload jsonb not null
);

create index if not exists shipyard_applications_created_at_idx
  on public.shipyard_applications (created_at desc);

alter table public.shipyard_applications enable row level security;

-- No policies: anon/authenticated clients cannot read or write via Supabase client keys.
-- Inserts happen only from Vercel with SUPABASE_SERVICE_ROLE_KEY.

comment on table public.shipyard_applications is 'Project Shipyard apply form submissions (payload JSON)';
