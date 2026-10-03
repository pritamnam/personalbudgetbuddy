-- Run once in your Supabase project: SQL Editor -> New query -> paste -> Run.
-- Safe to re-run.

-- 1) transactions (expenses)
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  amount numeric not null,
  category text not null,
  note text,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.transactions to authenticated;
alter table public.transactions enable row level security;
drop policy if exists "own tx select" on public.transactions;
drop policy if exists "own tx insert" on public.transactions;
drop policy if exists "own tx update" on public.transactions;
drop policy if exists "own tx delete" on public.transactions;
create policy "own tx select" on public.transactions for select to authenticated using (auth.uid() = user_id);
create policy "own tx insert" on public.transactions for insert to authenticated with check (auth.uid() = user_id);
create policy "own tx update" on public.transactions for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own tx delete" on public.transactions for delete to authenticated using (auth.uid() = user_id);

-- 2) profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
alter table public.profiles enable row level security;
drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles for all to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- 3) budgets, goals, tasks
create table if not exists public.finance_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  budgets jsonb not null default '[]'::jsonb,
  goals jsonb not null default '[]'::jsonb,
  tasks jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.finance_data to authenticated;
alter table public.finance_data enable row level security;
drop policy if exists "own finance" on public.finance_data;
create policy "own finance" on public.finance_data for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 4) auto-create a profile on sign-up
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();
