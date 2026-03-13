
UPDATE fleet_vehicles SET image_url = CASE
  WHEN category = 'sedan' AND model = 'E-Class' THEN 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=600&h=400&fit=crop'
  WHEN category = 'van' AND model = 'V-Class' THEN 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=600&h=400&fit=crop'
  WHEN category = 'bus' THEN 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop'
  WHEN category = 'suv' THEN 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&h=400&fit=crop'
  WHEN category = 'luxury' AND model = 'S-Class' THEN 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop'
  WHEN category = 'minibus' AND model ILIKE '%Sprinter%' THEN 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&h=400&fit=crop'
  WHEN model = 'Proace Verso' THEN 'https://images.unsplash.com/photo-1549317661-bd32c8ce0b40?w=600&h=400&fit=crop'
  ELSE image_url
END
WHERE image_url IS NULL;
