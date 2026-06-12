-- ── Players table (leaderboard) ─────────────────────────────────
create table if not exists public.players (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  score       integer not null default 0,
  mohalla     text not null,
  timestamp   bigint not null default extract(epoch from now())::bigint * 1000,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ── Registrations table ──────────────────────────────────────────
create table if not exists public.registrations (
  id              text primary key,
  name            text not null,
  nickname        text not null,
  mohalla         text not null,
  contact_number  text not null,
  batting_style   text not null,
  payment_method  text default 'Traditional',
  payment_status  text default 'Pending',
  registered_at   text,
  created_at      timestamptz default now()
);

-- ── Payments table ───────────────────────────────────────────────
create table if not exists public.payments (
  id               text primary key,
  registration_id  text references public.registrations(id) on delete cascade,
  amount           integer not null,
  currency         text not null default 'PKR',
  method           text not null,
  status           text not null default 'Pending',
  tx_hash          text,
  payment_date     text,
  created_at       timestamptz default now()
);

-- ── User profiles (for admin role) ──────────────────────────────
create table if not exists public.profiles (
  id      uuid primary key references auth.users(id) on delete cascade,
  email   text,
  role    text not null default 'user',   -- 'user' | 'admin'
  created_at timestamptz default now()
);

-- Auto-create profile on new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Row Level Security ───────────────────────────────────────────

alter table public.players enable row level security;
alter table public.registrations enable row level security;
alter table public.payments enable row level security;
alter table public.profiles enable row level security;

-- Players: public read, admin write
create policy "Public can read players"
  on public.players for select using (true);

create policy "Admins can insert players"
  on public.players for insert
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update players"
  on public.players for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete players"
  on public.players for delete
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Registrations: public can insert (tournament signup), admin full access
create policy "Anyone can register"
  on public.registrations for insert
  with check (true);

create policy "Public can read registrations"
  on public.registrations for select using (true);

create policy "Admins can update registrations"
  on public.registrations for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete registrations"
  on public.registrations for delete
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Payments: public can insert, admin full access
create policy "Anyone can insert payments"
  on public.payments for insert
  with check (true);

create policy "Public can read payments"
  on public.payments for select using (true);

create policy "Admins can update payments"
  on public.payments for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete payments"
  on public.payments for delete
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Profiles: users see their own
create policy "Users can read own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Admins can read all profiles"
  on public.profiles for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ── Seed sample players ──────────────────────────────────────────
insert into public.players (name, score, mohalla) values
  ('Ahmed Khan',     892, 'Saddar'),
  ('Usman Ali',      845, 'Defence'),
  ('Bilal Hussain',  798, 'Gulberg'),
  ('Faisal Iqbal',   756, 'Clifton'),
  ('Hamza Raza',     712, 'Nazimabad'),
  ('Saad Malik',     689, 'F-6 Islamabad'),
  ('Omar Shah',      654, 'Hayatabad'),
  ('Zain Aslam',     621, 'Model Town'),
  ('Kamran Yousuf',  598, 'Walled City')
on conflict do nothing;
