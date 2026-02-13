-- ============================================================================
-- Pauling Reporting — Historic Data (from Excel)
-- ============================================================================
-- Generated from: The Bowery Income statement (Jan–Nov 2025), January and December Report (Dec 2025, Jan 2026)
-- Includes: Revenue, COGS, Expenses, and CAPEX for all 13 months (Jan 2025–Jan 2026).
-- Replace created_by with a real auth.users id after creating users.
-- ============================================================================

-- ============================================================================
-- WEEKLY ENTRIES (one representative week per month with monthly totals)
-- ============================================================================
INSERT INTO weekly_entries (
  week_start_date, week_end_date, year, week_number, created_by, status,
  bowery_cafe_revenue, hotel_revenue, car_hire_revenue,
  meats, liquor, beverages_and_mixes, dairy_products, condiments,
  vegetables_and_fruits, starches_and_grains, cereal_and_nuts,
  baking_ingredients, booking_com_commission
) VALUES
('2024-12-30', '2025-01-05', 2025, 1, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 'submitted',
 58000, 5600, 0,
 11833.5, 3622.5, 1932, 1340, 483,
 1977, 724.5, 0,
 0, 0),
('2025-01-27', '2025-02-02', 2025, 5, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 'submitted',
 49800, 5100, 0,
 10922.32, 2789.33, 1487.64, 1031.8, 371.91,
 1522.29, 557.87, 0,
 0, 0),
('2025-02-24', '2025-03-02', 2025, 9, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 'submitted',
 30800, 7500, 0,
 10616.5, 2711.22, 1445.99, 1002.91, 361.5,
 1479.67, 542.24, 0,
 0, 0),
('2025-03-31', '2025-04-06', 2025, 14, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 'submitted',
 44727, 33500, 0,
 10722.66, 4800, 1460.45, 1012.94, 365.11,
 1494.46, 547.67, 0,
 0, 0),
('2025-04-28', '2025-05-04', 2025, 18, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 'submitted',
 38343, 7500, 0,
 8082.52, 2064.1, 1100.85, 763.53, 275.21,
 1126.49, 412.82, 0,
 0, 0),
('2025-05-26', '2025-06-01', 2025, 22, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 'submitted',
 34000, 15896, 0,
 7140, 5400, 680, 680, 340,
 1020, 340, 0,
 0, 0),
('2025-06-30', '2025-07-06', 2025, 27, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 'submitted',
 37027, 6339, 0,
 4000, 5300, 740.54, 740.54, 370.27,
 1110.81, 370.27, 0,
 0, 0),
('2025-07-28', '2025-08-03', 2025, 31, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 'submitted',
 38385, 5761, 0,
 4300, 5500, 767.7, 767.7, 383.85,
 1151.55, 383.85, 0,
 0, 0),
('2025-09-01', '2025-09-07', 2025, 36, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 'submitted',
 31471, 15300, 0,
 5700, 6100, 854.61, 629.42, 314.71,
 944.13, 314.71, 0,
 0, 0),
('2025-09-29', '2025-10-05', 2025, 40, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 'submitted',
 40278.91, 6405, 0,
 5836.8, 6246.4, 875.12, 644.53, 322.26,
 966.79, 322.26, 0,
 0, 0),
('2025-10-27', '2025-11-02', 2025, 44, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 'submitted',
 36962.17, 9504, 0,
 5976.88, 6396.31, 896.12, 659.99, 330,
 989.99, 330, 0,
 0, 0),
('2025-12-01', '2025-12-07', 2025, 49, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 'submitted',
 74358, 13017.94, 0,
 15517.54, 910.1, 3368.67, 2781.54, 2076.05,
 4500.8, 1081.92, 262.09,
 969.69, 1500),
('2025-12-29', '2026-01-04', 2026, 1, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 'submitted',
 44947, 9882.02, 3500,
 10800, 510, 1511.38, 1677.96, 1471.7,
 2404.52, 614.88, 109.29,
 395.16, 1020)
ON CONFLICT (year, week_number) DO UPDATE SET
  week_start_date = EXCLUDED.week_start_date,
  week_end_date = EXCLUDED.week_end_date,
  bowery_cafe_revenue = EXCLUDED.bowery_cafe_revenue,
  hotel_revenue = EXCLUDED.hotel_revenue,
  car_hire_revenue = EXCLUDED.car_hire_revenue,
  meats = EXCLUDED.meats, liquor = EXCLUDED.liquor, beverages_and_mixes = EXCLUDED.beverages_and_mixes,
  dairy_products = EXCLUDED.dairy_products, condiments = EXCLUDED.condiments,
  vegetables_and_fruits = EXCLUDED.vegetables_and_fruits, starches_and_grains = EXCLUDED.starches_and_grains,
  cereal_and_nuts = EXCLUDED.cereal_and_nuts, baking_ingredients = EXCLUDED.baking_ingredients,
  booking_com_commission = EXCLUDED.booking_com_commission;

-- ============================================================================
-- MONTHLY ENTRIES (expenses from Excel)
-- ============================================================================
INSERT INTO monthly_entries (
  month, year, created_by, wages_cafe, wages_hotel, gas, fuel_vehicles_generator, council_rates_water, electricity_zesa,
  payee, vat_zimra, packaging, detergents_cleaning, stationery, marketing, staff_expenses, vehicle_maintenance, sundry_expenses
) VALUES
(1, 2025, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 8800, 7100, 1200, 1530, 0, 1214, 0, 0, 0, 317, 188, 320, 364, 0, 188),
(2, 2025, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 8800, 6900, 1171.2, 1493.28, 0, 1184.86, 0, 0, 0, 283.4, 168.07, 286.08, 325.42, 568, 168.07),
(3, 2025, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 7900, 6500, 1042.37, 1329.02, 0, 1054.53, 0, 0, 0, 269.23, 159.67, 1115, 309.15, 2800, 159.67),
(4, 2025, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 7900, 6500, 1212, 1545.3, 0, 1226.14, 1200, 2900, 0, 396.25, 235, 1400, 1600, 0, 235),
(5, 2025, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 6200, 5400, 1102.92, 1406.22, 0, 1115.79, 1200, 2300, 0, 237.75, 141, 240, 273, 0, 141),
(6, 2025, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 6200, 5400, 1003.66, 1279.66, 0, 300, 1092, 1200, 0, 216.35, 128.31, 218.4, 248.43, 1700, 189),
(7, 2025, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 6696, 5800, 1083.95, 1382.04, 0, 300, 1179.36, 1200, 0, 233.66, 138.57, 235.87, 268.3, 0, 204.12),
(8, 2025, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 6700, 5800, 1203.18, 1534.06, 0, 300, 1309.09, 1332, 0, 259.36, 153.82, 261.82, 297.82, 1200, 226.57),
(9, 2025, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 6700, 6200, 1100, 1450, 0, 250, 1350, 2000, 0, 287.89, 170.74, 290.62, 330.58, 0, 251.5),
(10, 2025, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 7500, 7000, 1538.9, 2028.55, 0, 350, 1350, 800, 0, 316.11, 187.47, 319.1, 362.97, 0, 276.14),
(11, 2025, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 7500, 7000, 1554.29, 1030, 0, 455, 1350, 0, 0, 347.09, 205.84, 350.37, 398.55, 0, 303.2),
(12, 2025, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 7500, 7100, 1200, 1530, 1000, 1214, 0, 0, 504.93, 452.22, 44.95, 31, 158.8, 10, 914.3),
(1, 2026, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 7500, 7100, 1171.2, 1493.28, 223, 1184.86, 2500, 3900, 482.6, 229, 337.2, 0, 27.3, 180, 791.6)
ON CONFLICT (year, month) DO UPDATE SET
  wages_cafe = EXCLUDED.wages_cafe, wages_hotel = EXCLUDED.wages_hotel,
  gas = EXCLUDED.gas, fuel_vehicles_generator = EXCLUDED.fuel_vehicles_generator,
  council_rates_water = EXCLUDED.council_rates_water, electricity_zesa = EXCLUDED.electricity_zesa,
  payee = EXCLUDED.payee, vat_zimra = EXCLUDED.vat_zimra,
  packaging = EXCLUDED.packaging, detergents_cleaning = EXCLUDED.detergents_cleaning,
  stationery = EXCLUDED.stationery, marketing = EXCLUDED.marketing,
  staff_expenses = EXCLUDED.staff_expenses, vehicle_maintenance = EXCLUDED.vehicle_maintenance,
  sundry_expenses = EXCLUDED.sundry_expenses;

-- ============================================================================
-- CAPEX ENTRIES (from Excel)
-- ============================================================================
INSERT INTO capex_entries (
  month, year, created_by, icombi_ovens, seating_area_expansion, aluminium_patio_seating, airconditioning, art_soft_furnishings, landscaping_plants,
  training_consulting, cold_chain_facilities, refrigerators, building_improvements, outstanding_creditors, st_faiths, wood_furniture_replacements, legal_retainer, licensing,
  curtains, bathroom_stalls
) VALUES
(1, 2025, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 0, 0, 0, 0, 0, 3800, 5700, 3000, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(2, 2025, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 0, 5600, 0, 4900, 0, 0, 3600, 9800, 1300, 0, 0, 0, 0, 0, 0, 0, 0),
(3, 2025, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 0, 3200, 13800, 0, 0, 1500, 0, 0, 0, 3900, 0, 0, 0, 0, 0, 0, 0),
(4, 2025, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 0, 0, 3800, 0, 5300, 0, 0, 0, 800, 800, 5700, 0, 0, 0, 3980, 0, 0),
(5, 2025, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(6, 2025, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7800, 0, 0, 0, 0, 0),
(7, 2025, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1200, 0, 0, 0, 0, 0),
(8, 2025, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 0, 0, 0, 0, 0, 1000, 0, 0, 0, 0, 0, 1200, 0, 0, 0, 0, 0),
(9, 2025, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1200, 3500, 5000, 0, 0, 0),
(10, 2025, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 0, 0, 0, 0, 0, 0, 1500, 0, 0, 0, 0, 0, 0, 1200, 0, 0, 6800),
(11, 2025, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 0, 900, 0, 0, 0, 0, 1500, 0, 0, 0, 0, 0, 620, 1200, 800, 3200, 0),
(12, 2025, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 42000, 1800, 0, 0, 0, 350, 0, 0, 0, 2800, 0, 0, 0, 3000, 0, 0, 0),
(1, 2026, 'f12e7e02-d383-4e93-b779-9bd2924cd53e', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
ON CONFLICT (year, month) DO UPDATE SET
  icombi_ovens = EXCLUDED.icombi_ovens,
  seating_area_expansion = EXCLUDED.seating_area_expansion,
  aluminium_patio_seating = EXCLUDED.aluminium_patio_seating,
  airconditioning = EXCLUDED.airconditioning,
  art_soft_furnishings = EXCLUDED.art_soft_furnishings,
  landscaping_plants = EXCLUDED.landscaping_plants,
  training_consulting = EXCLUDED.training_consulting,
  cold_chain_facilities = EXCLUDED.cold_chain_facilities,
  refrigerators = EXCLUDED.refrigerators,
  building_improvements = EXCLUDED.building_improvements,
  outstanding_creditors = EXCLUDED.outstanding_creditors,
  st_faiths = EXCLUDED.st_faiths,
  wood_furniture_replacements = EXCLUDED.wood_furniture_replacements,
  legal_retainer = EXCLUDED.legal_retainer,
  licensing = EXCLUDED.licensing,
  curtains = EXCLUDED.curtains,
  bathroom_stalls = EXCLUDED.bathroom_stalls;

-- ============================================================================
-- RECOMPUTE MONTHLY SUMMARY
-- ============================================================================
SELECT recompute_monthly_summary(1, 2025);
SELECT recompute_monthly_summary(2, 2025);
SELECT recompute_monthly_summary(3, 2025);
SELECT recompute_monthly_summary(4, 2025);
SELECT recompute_monthly_summary(5, 2025);
SELECT recompute_monthly_summary(6, 2025);
SELECT recompute_monthly_summary(7, 2025);
SELECT recompute_monthly_summary(8, 2025);
SELECT recompute_monthly_summary(9, 2025);
SELECT recompute_monthly_summary(10, 2025);
SELECT recompute_monthly_summary(11, 2025);
SELECT recompute_monthly_summary(12, 2025);
SELECT recompute_monthly_summary(1, 2026);
