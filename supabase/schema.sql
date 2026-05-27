-- BanSos / SIAGA Supabase schema
-- Run this in Supabase SQL Editor.

-- Optional cleanup while developing. Uncomment only if you want to reset tables.
-- drop table if exists report_verifications cascade;
-- drop table if exists report_media cascade;
-- drop table if exists reports cascade;
-- drop table if exists broadcast_alerts cascade;
-- drop table if exists risk_snapshots cascade;

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

-- Helpful indexes.
create index if not exists reports_status_created_idx on reports(status, created_at desc);
create index if not exists reports_location_idx on reports(latitude, longitude);
create index if not exists report_media_report_id_idx on report_media(report_id);
create index if not exists report_verifications_report_id_idx on report_verifications(report_id);
