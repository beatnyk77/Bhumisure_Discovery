ALTER TABLE localities
  ADD COLUMN IF NOT EXISTS lat DECIMAL(9, 6),
  ADD COLUMN IF NOT EXISTS lng DECIMAL(9, 6);

UPDATE localities SET lat = 22.7534, lng = 75.8937 WHERE slug = 'vijay_nagar';
UPDATE localities SET lat = 22.7642, lng = 75.9095 WHERE slug = 'scheme_54';
UPDATE localities SET lat = 22.7489, lng = 75.9178 WHERE slug = 'scheme_78';
UPDATE localities SET lat = 22.7456, lng = 75.8933 WHERE slug = 'ab_road';
UPDATE localities SET lat = 22.6856, lng = 75.8633 WHERE slug = 'bhawarkua';
UPDATE localities SET lat = 22.7256, lng = 75.8883 WHERE slug = 'palasia';
UPDATE localities SET lat = 22.7196, lng = 75.8756 WHERE slug = 'mg_road';
UPDATE localities SET lat = 22.7176, lng = 75.8542 WHERE slug = 'rajwada';
UPDATE localities SET lat = 22.7189, lng = 75.8531 WHERE slug = 'sarafa';
UPDATE localities SET lat = 22.7123, lng = 75.8423 WHERE slug = 'chhawni';
UPDATE localities SET lat = 22.6312, lng = 75.8012 WHERE slug = 'rau';
UPDATE localities SET lat = 22.6745, lng = 75.8312 WHERE slug = 'tejaji_nagar';
UPDATE localities SET lat = 22.6512, lng = 75.8123 WHERE slug = 'kanadiya';
UPDATE localities SET lat = 22.6890, lng = 75.8456 WHERE slug = 'lig_colony';
UPDATE localities SET lat = 22.6589, lng = 75.8234 WHERE slug = 'lasudia';
UPDATE localities SET lat = 22.7289, lng = 75.8678 WHERE slug = 'sindhi_colony';
UPDATE localities SET lat = 22.7345, lng = 75.8789 WHERE slug = 'bengali_square';
UPDATE localities SET lat = 22.7012, lng = 75.8234 WHERE slug = 'mhow_naka';
UPDATE localities SET lat = 22.7456, lng = 75.8123 WHERE slug = 'dewas_naka';
UPDATE localities SET lat = 22.7789, lng = 75.9123 WHERE slug = 'nipania';
UPDATE localities SET lat = 22.7212, lng = 75.8012 WHERE slug = 'aerodrome';
UPDATE localities SET lat = 22.7523, lng = 75.9345 WHERE slug = 'bicholi_mardana';
UPDATE localities SET lat = 22.7612, lng = 75.9234 WHERE slug = 'pardesipura';
UPDATE localities SET lat = 22.8012, lng = 75.9234 WHERE slug = 'super_corridor';
UPDATE localities SET lat = 22.7234, lng = 75.8123 WHERE slug = 'iim_road';
UPDATE localities SET lat = 22.7456, lng = 75.9234 WHERE slug = 'bypass_road';
UPDATE localities SET lat = 22.7123, lng = 75.9123 WHERE slug = 'ring_road';

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS lat DECIMAL(9, 6),
  ADD COLUMN IF NOT EXISTS lng DECIMAL(9, 6);

-- Backfill listing coords from locality centroids
UPDATE listings l
SET lat = loc.lat, lng = loc.lng
FROM localities loc
WHERE l.locality_id = loc.id
  AND l.lat IS NULL
  AND loc.lat IS NOT NULL;