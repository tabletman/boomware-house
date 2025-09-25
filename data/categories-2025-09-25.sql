-- Categories SQL Script
-- Generated on 2025-09-25T12:57:53.664Z


INSERT INTO categories (name, slug, description, sort_order, is_active)
VALUES (
  'Used Computers',
  'used-computers',
  'Refurbished desktop computers, laptops, and workstations',
  1,
  TRUE
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();
INSERT INTO categories (name, slug, description, sort_order, is_active)
VALUES (
  'Electronics',
  'electronics',
  'Consumer electronics, tablets, monitors, and accessories',
  2,
  TRUE
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();
INSERT INTO categories (name, slug, description, sort_order, is_active)
VALUES (
  'Small Refrigerators',
  'small-refrigerators',
  'Compact and mini refrigerators for dorms and offices',
  3,
  TRUE
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();
INSERT INTO categories (name, slug, description, sort_order, is_active)
VALUES (
  'Appliances',
  'appliances',
  'Kitchen appliances, vacuum cleaners, and household items',
  4,
  TRUE
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();
