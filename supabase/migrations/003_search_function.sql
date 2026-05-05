-- Search function for listings
-- Supports filtering by locality, property_type (BHK), rent range, and furnishing

create or replace function search_listings(
  p_locality_slugs text[] default null,
  p_property_type text default null,
  p_min_rent integer default null,
  p_max_rent integer default null,
  p_furnishing_types text[] default null,
  p_tenant_type text default null,
  p_sort_by text default 'newest'
)
returns table (
  id uuid,
  title text,
  rent_monthly integer,
  property_type text,
  locality_id uuid,
  locality_name text,
  locality_slug text,
  furnishing text,
  available_from date,
  thumbnail_url text,
  reel_url text,
  broker_id uuid,
  broker_name text,
  created_at timestamptz,
  total_count bigint
) 
language plpgsql
as $$
begin
  return query
  select 
    l.id,
    l.title,
    l.rent_monthly,
    l.property_type,
    l.locality_id,
    loc.name as locality_name,
    loc.slug as locality_slug,
    l.furnishing,
    l.available_from,
    l.thumbnail_url,
    l.reel_url,
    l.broker_id,
    b.name as broker_name,
    l.created_at,
    count(*) over() as total_count
  from listings l
  join localities loc on l.locality_id = loc.id
  left join brokers b on l.broker_id = b.id
  where 
    l.status = 'active'
    and (p_locality_slugs is null or loc.slug = any(p_locality_slugs))
    and (p_property_type is null or l.property_type = p_property_type)
    and (p_min_rent is null or l.rent_monthly >= p_min_rent)
    and (p_max_rent is null or l.rent_monthly <= p_max_rent)
    and (p_furnishing_types is null or l.furnishing = any(p_furnishing_types))
    and (p_tenant_type is null or l.preferred_tenant = p_tenant_type)
  order by
    case when p_sort_by = 'rent_asc' then l.rent_monthly end asc,
    case when p_sort_by = 'rent_desc' then l.rent_monthly end desc,
    case when p_sort_by = 'newest' then l.created_at end desc
  limit 20;
end;
$$;
