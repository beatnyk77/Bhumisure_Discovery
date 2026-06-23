-- Search function for listings
-- Supports filtering by locality, property_type (BHK), rent range, and furnishing

CREATE OR REPLACE FUNCTION search_listings(
  p_locality_slugs text[] DEFAULT NULL,
  p_property_type text DEFAULT NULL,
  p_min_rent integer DEFAULT NULL,
  p_max_rent integer DEFAULT NULL,
  p_furnishing_types text[] DEFAULT NULL,
  p_tenant_type text DEFAULT NULL,
  p_sort_by text DEFAULT 'newest'
)
RETURNS TABLE (
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
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.id,
    (l.property_type::text || ' in ' || loc.name) AS title,
    l.rent_monthly,
    l.property_type::text,
    l.locality_id,
    loc.name AS locality_name,
    loc.slug AS locality_slug,
    l.furnishing::text,
    l.available_from,
    l.thumbnail_url,
    l.reel_url,
    l.broker_id,
    l.broker_name,
    l.created_at,
    COUNT(*) OVER() AS total_count
  FROM listings l
  JOIN localities loc ON l.locality_id = loc.id
  WHERE
    l.status IN ('active', 'expiring_soon')
    AND (p_locality_slugs IS NULL OR loc.slug = ANY(p_locality_slugs))
    AND (p_property_type IS NULL OR l.property_type::text = p_property_type)
    AND (p_min_rent IS NULL OR l.rent_monthly >= p_min_rent)
    AND (p_max_rent IS NULL OR l.rent_monthly <= p_max_rent)
    AND (p_furnishing_types IS NULL OR l.furnishing::text = ANY(p_furnishing_types))
    AND (p_tenant_type IS NULL OR l.preferred_tenant::text = p_tenant_type)
  ORDER BY
    CASE WHEN p_sort_by = 'rent_asc' THEN l.rent_monthly END ASC,
    CASE WHEN p_sort_by = 'rent_desc' THEN l.rent_monthly END DESC,
    CASE WHEN p_sort_by = 'newest' THEN l.created_at END DESC
  LIMIT 20;
END;
$$;