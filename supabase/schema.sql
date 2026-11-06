-- Reference schema for a future Supabase project; not applied by this mock.
-- Row-level security starts closed. Add family membership policies before connecting a client.
create table public.adventures (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text not null default '',
  city text not null,
  country text not null,
  continent text not null default '',
  date date not null,
  end_date date not null,
  notes text not null default '',
  story text[] not null default '{}',
  travelers text[] not null default '{}',
  longitude double precision check (longitude between -180 and 180),
  latitude double precision check (latitude between -90 and 90),
  cover_photo text not null,
  cover_alt text not null default '',
  accent text not null default '#8056d9',
  check (end_date >= date),
  check ((longitude is null) = (latitude is null))
);
create table public.photos (
  id uuid primary key default gen_random_uuid(),
  adventure_id uuid not null references public.adventures(id) on delete cascade,
  title text not null,
  src text not null,
  alt text not null default '',
  caption text not null default '',
  location text not null default '',
  position integer not null default 0 check (position >= 0)
);
create index photos_adventure_order_idx on public.photos(adventure_id, position);
create table public.itinerary_stops (
  id uuid primary key default gen_random_uuid(),
  adventure_id uuid not null references public.adventures(id) on delete cascade,
  day text not null,
  title text not null,
  description text not null default '',
  position integer not null default 0 check (position >= 0)
);
create index itinerary_adventure_order_idx on public.itinerary_stops(adventure_id, position);
alter table public.adventures enable row level security;
alter table public.photos enable row level security;
alter table public.itinerary_stops enable row level security;
