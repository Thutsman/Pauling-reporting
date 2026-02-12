/**
 * Reads both Excel files and generates SQL for historic data.
 * Run: node scripts/excel-to-sql.js
 * Output: supabase/seed-historic.sql (and logs to console).
 */
import XLSX from 'xlsx';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const CREATED_BY_PLACEHOLDER = '00000000-0000-0000-0000-000000000001';

// ISO week: get Monday of week containing first day of month, then that week's start/end
function getFirstWeekOfMonth(year, month) {
  const first = new Date(year, month - 1, 1);
  const day = first.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(year, month - 1, 1 + mondayOffset);
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  const weekNum = getISOWeek(monday);
  return {
    week_start: formatYMD(monday),
    week_end: formatYMD(sunday),
    year,
    week_number: weekNum,
  };
}
function getISOWeek(d) {
  const d2 = new Date(d);
  d2.setHours(0, 0, 0, 0);
  d2.setDate(d2.getDate() + 4 - (d2.getDay() || 7));
  const y = d2.getFullYear();
  const start = new Date(y, 0, 1);
  return Math.ceil((((d2 - start) / 86400000) + 1) / 7);
}
function formatYMD(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function num(v) {
  if (v === null || v === undefined || v === '') return 0;
  const n = Number(v);
  return isNaN(n) ? 0 : Math.round(n * 100) / 100;
}

// ---- The Bowery Income statement: Jan 2025 (col 1) through Nov 2025 (col 11) ----
// Row indices from actual file: 4=Cafe, 5=Hotel, 6=Car Hire; 10=Meats, 11=Liquor, 12=Beverages, 13=Dairy, 14=Condiments, 15=Veg, 16=Starches (no Cereal/Baking/Booking rows)
const BOWERY_SHEET = 'The Bowery Income Statement ';
const BOWERY_MONTHS = [
  { col: 1, month: 1, year: 2025 },
  { col: 2, month: 2, year: 2025 },
  { col: 3, month: 3, year: 2025 },
  { col: 4, month: 4, year: 2025 },
  { col: 5, month: 5, year: 2025 },
  { col: 6, month: 6, year: 2025 },
  { col: 7, month: 7, year: 2025 },
  { col: 8, month: 8, year: 2025 },
  { col: 9, month: 9, year: 2025 },
  { col: 10, month: 10, year: 2025 },
  { col: 11, month: 11, year: 2025 },
];

function parseBowery(data) {
  const months = [];
  for (const { col, month, year } of BOWERY_MONTHS) {
    const cafe = num(data[4]?.[col]);
    const hotel = num(data[5]?.[col]);
    const carHire = num(data[6]?.[col]);
    const meats = num(data[10]?.[col]);
    const liquor = num(data[11]?.[col]);
    const beverages = num(data[12]?.[col]);
    const dairy = num(data[13]?.[col]);
    const condiments = num(data[14]?.[col]);
    const veg = num(data[15]?.[col]);
    const starches = num(data[16]?.[col]);
    
    // Expenses
    const wages_cafe = num(data[25]?.[col]);
    const wages_hotel = num(data[26]?.[col]);
    const gas = num(data[29]?.[col]);
    const fuel = num(data[30]?.[col]);
    const council_rates = num(data[31]?.[col]);
    const electricity = num(data[32]?.[col]);
    const payee = num(data[34]?.[col]);
    const vat = num(data[35]?.[col]);
    const detergents = num(data[37]?.[col]);
    const stationery = num(data[38]?.[col]);
    const marketing = num(data[39]?.[col]);
    const staff_expenses = num(data[40]?.[col]);
    const vehicle_maintenance = num(data[41]?.[col]);
    const sundry = num(data[42]?.[col]);
    
    // CAPEX
    const seating_expansion = num(data[48]?.[col]);
    const aluminium_patio = num(data[49]?.[col]);
    const aircon = num(data[50]?.[col]);
    const art_furnishings = num(data[51]?.[col]);
    const landscaping = num(data[52]?.[col]);
    const training = num(data[53]?.[col]);
    const cold_chain = num(data[54]?.[col]);
    const refrigerators = num(data[55]?.[col]);
    const building_improvements = num(data[56]?.[col]);
    const creditors = num(data[57]?.[col]);
    const st_faiths = num(data[58]?.[col]);
    const wood_furniture = num(data[59]?.[col]);
    const legal_retainer = num(data[60]?.[col]);
    const licensing = num(data[63]?.[col]);
    
    months.push({
      month,
      year,
      // Revenue & COGS
      bowery_cafe_revenue: cafe,
      hotel_revenue: hotel,
      car_hire_revenue: carHire,
      meats,
      liquor,
      beverages_and_mixes: beverages,
      dairy_products: dairy,
      condiments,
      vegetables_and_fruits: veg,
      starches_and_grains: starches,
      cereal_and_nuts: 0,
      baking_ingredients: 0,
      booking_com_commission: 0,
      // Expenses
      wages_cafe,
      wages_hotel,
      gas,
      fuel_vehicles_generator: fuel,
      council_rates_water: council_rates,
      electricity_zesa: electricity,
      payee,
      vat_zimra: vat,
      packaging: 0, // not in Bowery sheet
      detergents_cleaning: detergents,
      stationery,
      marketing,
      staff_expenses,
      vehicle_maintenance,
      sundry_expenses: sundry,
      // CAPEX
      icombi_ovens: 0, // not in Bowery sheet
      seating_area_expansion: seating_expansion,
      aluminium_patio_seating: aluminium_patio,
      airconditioning: aircon,
      art_soft_furnishings: art_furnishings,
      landscaping_plants: landscaping,
      training_consulting: training,
      cold_chain_facilities: cold_chain,
      refrigerators,
      building_improvements,
      outstanding_creditors: creditors,
      st_faiths,
      wood_furniture_replacements: wood_furniture,
      legal_retainer,
      licensing,
    });
  }
  return months;
}

// ---- January and December Report: col 1 = Dec 2025, col 2 = Jan 2026 ----
const DECJAN_SHEET = 'Income statement January 2026 ';
function parseDecJan(data) {
  const months = [];
  const specs = [
    { col: 1, month: 12, year: 2025 },
    { col: 2, month: 1, year: 2026 },
  ];
  for (const { col, month, year } of specs) {
    months.push({
      month,
      year,
      // Revenue & COGS
      bowery_cafe_revenue: num(data[4]?.[col]),
      hotel_revenue: num(data[5]?.[col]),
      car_hire_revenue: num(data[6]?.[col]),
      meats: num(data[10]?.[col]),
      liquor: num(data[11]?.[col]),
      beverages_and_mixes: num(data[12]?.[col]),
      dairy_products: num(data[13]?.[col]),
      condiments: num(data[14]?.[col]),
      vegetables_and_fruits: num(data[15]?.[col]),
      starches_and_grains: num(data[16]?.[col]),
      cereal_and_nuts: num(data[17]?.[col]),
      baking_ingredients: num(data[18]?.[col]),
      booking_com_commission: num(data[19]?.[col]),
      // Expenses
      wages_cafe: num(data[28]?.[col]),
      wages_hotel: num(data[29]?.[col]),
      gas: num(data[32]?.[col]),
      fuel_vehicles_generator: num(data[33]?.[col]),
      council_rates_water: num(data[34]?.[col]),
      electricity_zesa: num(data[35]?.[col]),
      payee: num(data[37]?.[col]),
      vat_zimra: num(data[38]?.[col]),
      packaging: num(data[40]?.[col]),
      detergents_cleaning: num(data[41]?.[col]),
      stationery: num(data[42]?.[col]),
      marketing: num(data[43]?.[col]),
      staff_expenses: num(data[44]?.[col]),
      vehicle_maintenance: num(data[45]?.[col]),
      sundry_expenses: num(data[46]?.[col]),
      // CAPEX
      icombi_ovens: num(data[54]?.[col]),
      seating_area_expansion: num(data[55]?.[col]),
      aluminium_patio_seating: num(data[56]?.[col]),
      airconditioning: num(data[57]?.[col]),
      art_soft_furnishings: num(data[58]?.[col]),
      landscaping_plants: num(data[59]?.[col]),
      training_consulting: num(data[60]?.[col]),
      cold_chain_facilities: num(data[61]?.[col]),
      refrigerators: num(data[62]?.[col]),
      building_improvements: num(data[63]?.[col]),
      outstanding_creditors: num(data[64]?.[col]),
      st_faiths: num(data[65]?.[col]),
      wood_furniture_replacements: num(data[66]?.[col]),
      legal_retainer: num(data[67]?.[col]),
      licensing: num(data[68]?.[col]),
    });
  }
  return months;
}

function main() {
  const allMonthly = [];

  // File 1: The Bowery Income statement
  const path1 = join(root, 'The Bowery Income statement  Confidential.xlsx');
  const wb1 = XLSX.read(readFileSync(path1), { type: 'buffer' });
  const ws1 = wb1.Sheets[BOWERY_SHEET];
  if (ws1) {
    const data1 = XLSX.utils.sheet_to_json(ws1, { header: 1, defval: null });
    // Bowery sheet: row 0-1 headers, 4=Cafe, 5=Hotel, 6=Car Hire, 12=Meats..18=Starches (0-based)
    const parsed1 = parseBowery(data1);
    allMonthly.push(...parsed1);
    console.log('Parsed Bowery file:', parsed1.length, 'months');
  }

  // File 2: January and December Report
  const path2 = join(root, 'January and December Report AUDITED.xlsx');
  const wb2 = XLSX.read(readFileSync(path2), { type: 'buffer' });
  const ws2 = wb2.Sheets[DECJAN_SHEET];
  if (ws2) {
    const data2 = XLSX.utils.sheet_to_json(ws2, { header: 1, defval: null });
    const parsed2 = parseDecJan(data2);
    allMonthly.push(...parsed2);
    console.log('Parsed Dec/Jan file:', parsed2.length, 'months');
  }

  // Sort by year, month
  allMonthly.sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month);

  const lines = [];
  lines.push('-- ============================================================================');
  lines.push('-- Pauling Reporting — Historic Data (from Excel)');
  lines.push('-- ============================================================================');
  lines.push('-- Generated from: The Bowery Income statement (Jan–Nov 2025), January and December Report (Dec 2025, Jan 2026)');
  lines.push('-- Includes: Revenue, COGS, Expenses, and CAPEX for all 13 months (Jan 2025–Jan 2026).');
  lines.push('-- Replace created_by with a real auth.users id after creating users.');
  lines.push('-- ============================================================================\n');

  // Weekly entries: one per month (representative week for that month’s totals)
  lines.push('-- ============================================================================');
  lines.push('-- WEEKLY ENTRIES (one representative week per month with monthly totals)');
  lines.push('-- ============================================================================');
  const weeklyValues = [];
  for (const m of allMonthly) {
    const w = getFirstWeekOfMonth(m.year, m.month);
    weeklyValues.push(
      `('${w.week_start}', '${w.week_end}', ${w.year}, ${w.week_number}, '${CREATED_BY_PLACEHOLDER}', 'submitted',\n` +
      ` ${m.bowery_cafe_revenue}, ${m.hotel_revenue}, ${m.car_hire_revenue},\n` +
      ` ${m.meats}, ${m.liquor}, ${m.beverages_and_mixes}, ${m.dairy_products}, ${m.condiments},\n` +
      ` ${m.vegetables_and_fruits}, ${m.starches_and_grains}, ${m.cereal_and_nuts},\n` +
      ` ${m.baking_ingredients}, ${m.booking_com_commission})`
    );
  }
  lines.push('INSERT INTO weekly_entries (');
  lines.push('  week_start_date, week_end_date, year, week_number, created_by, status,');
  lines.push('  bowery_cafe_revenue, hotel_revenue, car_hire_revenue,');
  lines.push('  meats, liquor, beverages_and_mixes, dairy_products, condiments,');
  lines.push('  vegetables_and_fruits, starches_and_grains, cereal_and_nuts,');
  lines.push('  baking_ingredients, booking_com_commission');
  lines.push(') VALUES');
  lines.push(weeklyValues.join(',\n'));
  lines.push('ON CONFLICT (year, week_number) DO UPDATE SET');
  lines.push('  week_start_date = EXCLUDED.week_start_date,');
  lines.push('  week_end_date = EXCLUDED.week_end_date,');
  lines.push('  bowery_cafe_revenue = EXCLUDED.bowery_cafe_revenue,');
  lines.push('  hotel_revenue = EXCLUDED.hotel_revenue,');
  lines.push('  car_hire_revenue = EXCLUDED.car_hire_revenue,');
  lines.push('  meats = EXCLUDED.meats, liquor = EXCLUDED.liquor, beverages_and_mixes = EXCLUDED.beverages_and_mixes,');
  lines.push('  dairy_products = EXCLUDED.dairy_products, condiments = EXCLUDED.condiments,');
  lines.push('  vegetables_and_fruits = EXCLUDED.vegetables_and_fruits, starches_and_grains = EXCLUDED.starches_and_grains,');
  lines.push('  cereal_and_nuts = EXCLUDED.cereal_and_nuts, baking_ingredients = EXCLUDED.baking_ingredients,');
  lines.push('  booking_com_commission = EXCLUDED.booking_com_commission;');
  lines.push('');

  // Monthly entries: actual expenses from Excel
  lines.push('-- ============================================================================');
  lines.push('-- MONTHLY ENTRIES (expenses from Excel)');
  lines.push('-- ============================================================================');
  const monthlyValues = allMonthly.map(m =>
    `(${m.month}, ${m.year}, '${CREATED_BY_PLACEHOLDER}', ` +
    `${m.wages_cafe}, ${m.wages_hotel}, ${m.gas}, ${m.fuel_vehicles_generator}, ${m.council_rates_water}, ${m.electricity_zesa}, ` +
    `${m.payee}, ${m.vat_zimra}, ${m.packaging}, ${m.detergents_cleaning}, ${m.stationery}, ${m.marketing}, ` +
    `${m.staff_expenses}, ${m.vehicle_maintenance}, ${m.sundry_expenses})`
  );
  lines.push('INSERT INTO monthly_entries (');
  lines.push('  month, year, created_by, wages_cafe, wages_hotel, gas, fuel_vehicles_generator, council_rates_water, electricity_zesa,');
  lines.push('  payee, vat_zimra, packaging, detergents_cleaning, stationery, marketing, staff_expenses, vehicle_maintenance, sundry_expenses');
  lines.push(') VALUES');
  lines.push(monthlyValues.join(',\n'));
  lines.push('ON CONFLICT (year, month) DO NOTHING;');
  lines.push('');

  // CAPEX: actual CAPEX from Excel
  lines.push('-- ============================================================================');
  lines.push('-- CAPEX ENTRIES (from Excel)');
  lines.push('-- ============================================================================');
  const capexValues = allMonthly.map(m =>
    `(${m.month}, ${m.year}, '${CREATED_BY_PLACEHOLDER}', ` +
    `${m.icombi_ovens}, ${m.seating_area_expansion}, ${m.aluminium_patio_seating}, ${m.airconditioning}, ${m.art_soft_furnishings}, ${m.landscaping_plants}, ` +
    `${m.training_consulting}, ${m.cold_chain_facilities}, ${m.refrigerators}, ${m.building_improvements}, ${m.outstanding_creditors}, ${m.st_faiths}, ` +
    `${m.wood_furniture_replacements}, ${m.legal_retainer}, ${m.licensing})`
  );
  lines.push('INSERT INTO capex_entries (');
  lines.push('  month, year, created_by, icombi_ovens, seating_area_expansion, aluminium_patio_seating, airconditioning, art_soft_furnishings, landscaping_plants,');
  lines.push('  training_consulting, cold_chain_facilities, refrigerators, building_improvements, outstanding_creditors, st_faiths, wood_furniture_replacements, legal_retainer, licensing');
  lines.push(') VALUES');
  lines.push(capexValues.join(',\n'));
  lines.push('ON CONFLICT (year, month) DO NOTHING;');
  lines.push('');

  // Recompute monthly summary for each month
  lines.push('-- ============================================================================');
  lines.push('-- RECOMPUTE MONTHLY SUMMARY');
  lines.push('-- ============================================================================');
  for (const m of allMonthly) {
    lines.push(`SELECT recompute_monthly_summary(${m.month}, ${m.year});`);
  }

  const outPath = join(root, 'supabase', 'seed-historic.sql');
  writeFileSync(outPath, lines.join('\n'), 'utf8');
  console.log('Wrote', outPath);
  console.log('Months covered:', allMonthly.map(m => `${m.year}-${String(m.month).padStart(2, '0')}`).join(', '));
}

main();
