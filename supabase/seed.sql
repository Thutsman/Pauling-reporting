-- ============================================================================
-- Pauling Reporting — Seed Data
-- ============================================================================
-- NOTE: After creating users via Supabase Auth dashboard or API,
-- replace the UUIDs below with real user IDs.

-- Placeholder UUIDs (replace after creating auth users)
-- Branch Manager: 00000000-0000-0000-0000-000000000001
-- Business Owner: 00000000-0000-0000-0000-000000000002

-- ============================================================================
-- USER ROLES
-- ============================================================================
INSERT INTO user_roles (user_id, role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'branch_manager'),
  ('00000000-0000-0000-0000-000000000002', 'business_owner')
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================================
-- WEEKLY ENTRIES — January 2026 (4 weeks)
-- ============================================================================
INSERT INTO weekly_entries (
  week_start_date, week_end_date, year, week_number, created_by, status,
  bowery_cafe_revenue, hotel_revenue, car_hire_revenue,
  meats, liquor, beverages_and_mixes, dairy_products, condiments,
  vegetables_and_fruits, starches_and_grains, cereal_and_nuts,
  baking_ingredients, booking_com_commission
) VALUES
-- Week 1: Jan 5-11
('2026-01-05', '2026-01-11', 2026, 1, '00000000-0000-0000-0000-000000000001', 'submitted',
 8500.00, 12000.00, 3200.00,
 1200.00, 800.00, 450.00, 350.00, 120.00,
 680.00, 290.00, 150.00, 200.00, 3600.00),
-- Week 2: Jan 12-18
('2026-01-12', '2026-01-18', 2026, 2, '00000000-0000-0000-0000-000000000001', 'submitted',
 9200.00, 13500.00, 2800.00,
 1350.00, 920.00, 480.00, 380.00, 135.00,
 720.00, 310.00, 165.00, 220.00, 4050.00),
-- Week 3: Jan 19-25
('2026-01-19', '2026-01-25', 2026, 3, '00000000-0000-0000-0000-000000000001', 'submitted',
 7800.00, 11200.00, 3500.00,
 1100.00, 750.00, 420.00, 320.00, 110.00,
 650.00, 270.00, 140.00, 190.00, 3360.00),
-- Week 4: Jan 26-31
('2026-01-26', '2026-01-31', 2026, 4, '00000000-0000-0000-0000-000000000001', 'submitted',
 8900.00, 12800.00, 3100.00,
 1280.00, 870.00, 460.00, 360.00, 125.00,
 700.00, 300.00, 155.00, 210.00, 3840.00);

-- ============================================================================
-- MONTHLY ENTRIES — January 2026
-- ============================================================================
INSERT INTO monthly_entries (
  month, year, created_by,
  wages_cafe, wages_hotel,
  gas, fuel_vehicles_generator, council_rates_water, electricity_zesa,
  payee, vat_zimra,
  packaging, detergents_cleaning, stationery, marketing,
  staff_expenses, vehicle_maintenance, sundry_expenses
) VALUES (
  1, 2026, '00000000-0000-0000-0000-000000000001',
  4500.00, 6200.00,
  800.00, 1200.00, 650.00, 1800.00,
  2100.00, 3500.00,
  350.00, 280.00, 120.00, 1500.00,
  450.00, 680.00, 320.00
);

-- ============================================================================
-- CAPEX ENTRIES — January 2026
-- ============================================================================
INSERT INTO capex_entries (
  month, year, created_by,
  icombi_ovens, seating_area_expansion, aluminium_patio_seating,
  airconditioning, art_soft_furnishings, landscaping_plants,
  training_consulting, cold_chain_facilities, refrigerators,
  building_improvements, outstanding_creditors, st_faiths,
  wood_furniture_replacements, legal_retainer, licensing
) VALUES (
  1, 2026, '00000000-0000-0000-0000-000000000001',
  0.00, 2500.00, 1800.00,
  0.00, 450.00, 300.00,
  800.00, 0.00, 1200.00,
  3500.00, 1500.00, 0.00,
  650.00, 500.00, 350.00
);

-- ============================================================================
-- RECOMPUTE MONTHLY SUMMARY
-- ============================================================================
SELECT recompute_monthly_summary(1, 2026);
