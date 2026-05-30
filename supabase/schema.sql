
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  reporter_name text default 'Anonymous User',

  title text not null,
  description text not null,
  category text not null default 'BANJIR',
  severity text not null default 'SEDANG',

  latitude double precision not null,
  longitude double precision not null,
  location_name text,

  status text not null default 'pending',
  confidence_score numeric default 0,
  tags text[] default '{}',

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists report_media (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references reports(id) on delete cascade,
  media_url text not null,
  media_type text default 'image',
  storage_path text,
  created_at timestamptz default now()
);

create table if not exists report_verifications (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references reports(id) on delete cascade,
  admin_id text,
  decision text not null,
  reason text,
  admin_notes text,
  created_at timestamptz default now()
);

create table if not exists broadcast_alerts (
  id uuid primary key default gen_random_uuid(),
  admin_id text,
  title text not null,
  message text not null,
  severity text not null default 'warning',
  target_location text,
  latitude double precision,
  longitude double precision,
  radius_m integer default 3000,
  created_at timestamptz default now()
);

create table if not exists risk_snapshots (
  id uuid primary key default gen_random_uuid(),
  latitude double precision not null,
  longitude double precision not null,
  kelurahan text,
  kecamatan text,
  kota_administrasi text,
  final_score numeric,
  probability_percent numeric,
  risk_level text,
  trend text,
  weather_score numeric,
  water_score numeric,
  baseline_score numeric,
  historical_score numeric,
  data_freshness_warning text,
  created_at timestamptz default now()
);

create table if not exists saved_locations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  address text not null,
  latitude double precision,
  longitude double precision,
  status text not null default 'clear',
  radius integer not null default 3,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Notification preferences.
-- Flood Risk Alert intentionally is NOT included as switch because it is a critical safety alert.
create table if not exists notification_preferences (
  user_id uuid primary key,
  approved_report boolean not null default true,
  rejected_report boolean not null default true,
  nearby_reports boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- If you previously created flood_risk_alert column, this removes it safely.
alter table notification_preferences
  drop column if exists flood_risk_alert;

-- Add coordinates columns if saved_locations already exists.
alter table saved_locations add column if not exists latitude double precision;
alter table saved_locations add column if not exists longitude double precision;

-- Helpful indexes.
create index if not exists reports_status_created_idx on reports(status, created_at desc);
create index if not exists reports_location_idx on reports(latitude, longitude);
create index if not exists report_media_report_id_idx on report_media(report_id);
create index if not exists report_verifications_report_id_idx on report_verifications(report_id);
create index if not exists saved_locations_user_id_idx on saved_locations(user_id, created_at desc);
create index if not exists notification_preferences_user_id_idx on notification_preferences(user_id);

-- Storage bucket for evidence images/videos.
-- If this fails because the bucket already exists, it is safe to ignore.
insert into storage.buckets (id, name, public)
values ('report-media', 'report-media', true)
on conflict (id) do update set public = true;

-- Public read policy for uploaded report evidence.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public read report media'
  ) then
    create policy "Public read report media"
    on storage.objects for select
    using (bucket_id = 'report-media');
  end if;
end $$;

-- Because uploads are handled by the FastAPI backend using service role key,
-- no public insert policy is required for storage.objects.

-- Optional RLS for notification_preferences if accessed directly through Supabase client.
-- If all access goes through FastAPI service role, RLS will not block service-role calls.
alter table notification_preferences enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'notification_preferences'
      and policyname = 'Users can read own notification preferences'
  ) then
    create policy "Users can read own notification preferences"
    on notification_preferences
    for select
    using (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'notification_preferences'
      and policyname = 'Users can insert own notification preferences'
  ) then
    create policy "Users can insert own notification preferences"
    on notification_preferences
    for insert
    with check (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'notification_preferences'
      and policyname = 'Users can update own notification preferences'
  ) then
    create policy "Users can update own notification preferences"
    on notification_preferences
    for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
  end if;
end $$;