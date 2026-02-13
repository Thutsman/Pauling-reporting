// ============================================================================
// TypeScript Types for Hotel Financial Management System
// ============================================================================

// ============================================================================
// WEEKLY ENTRIES
// ============================================================================
export interface WeeklyEntry {
  id: string;
  week_start_date: string;
  week_end_date: string;
  year: number;
  week_number: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  status: EntryStatus;

  bowery_cafe_revenue: number;
  hotel_revenue: number;
  car_hire_revenue: number;
  total_revenue: number;

  meats: number;
  liquor: number;
  beverages_and_mixes: number;
  dairy_products: number;
  condiments: number;
  vegetables_and_fruits: number;
  starches_and_grains: number;
  cereal_and_nuts: number;
  baking_ingredients: number;
  booking_com_commission: number;

  total_cogs: number;
  cogs_percentage: number;
  gross_profit: number;
}

export interface WeeklyEntryInput {
  week_start_date: string;
  week_end_date: string;
  bowery_cafe_revenue: number;
  hotel_revenue: number;
  car_hire_revenue: number;
  meats: number;
  liquor: number;
  beverages_and_mixes: number;
  dairy_products: number;
  condiments: number;
  vegetables_and_fruits: number;
  starches_and_grains: number;
  cereal_and_nuts: number;
  baking_ingredients: number;
  booking_com_commission: number;
}

// ============================================================================
// MONTHLY ENTRIES
// ============================================================================
export interface MonthlyEntry {
  id: string;
  month: number;
  year: number;
  created_at: string;
  updated_at: string;
  created_by: string;

  wages_cafe: number;
  wages_hotel: number;
  gas: number;
  fuel_vehicles_generator: number;
  council_rates_water: number;
  electricity_zesa: number;
  payee: number;
  vat_zimra: number;
  packaging: number;
  detergents_cleaning: number;
  stationery: number;
  marketing: number;
  staff_expenses: number;
  vehicle_maintenance: number;
  sundry_expenses: number;

  total_wages: number;
  total_utilities: number;
  total_taxes: number;
  total_other_expenses: number;
  total_expenses: number;
}

export interface MonthlyEntryInput {
  month: number;
  year: number;
  wages_cafe: number;
  wages_hotel: number;
  gas: number;
  fuel_vehicles_generator: number;
  council_rates_water: number;
  electricity_zesa: number;
  payee: number;
  vat_zimra: number;
  packaging: number;
  detergents_cleaning: number;
  stationery: number;
  marketing: number;
  staff_expenses: number;
  vehicle_maintenance: number;
  sundry_expenses: number;
}

// ============================================================================
// CAPEX ENTRIES
// ============================================================================
export interface CapexEntry {
  id: string;
  month: number;
  year: number;
  created_at: string;
  updated_at: string;
  created_by: string;

  icombi_ovens: number;
  seating_area_expansion: number;
  aluminium_patio_seating: number;
  airconditioning: number;
  art_soft_furnishings: number;
  landscaping_plants: number;
  training_consulting: number;
  cold_chain_facilities: number;
  refrigerators: number;
  building_improvements: number;
  outstanding_creditors: number;
  st_faiths: number;
  wood_furniture_replacements: number;
  legal_retainer: number;
  licensing: number;
  curtains: number;
  bathroom_stalls: number;

  total_capex: number;
}

export interface CapexEntryInput {
  month: number;
  year: number;
  icombi_ovens: number;
  seating_area_expansion: number;
  aluminium_patio_seating: number;
  airconditioning: number;
  art_soft_furnishings: number;
  landscaping_plants: number;
  training_consulting: number;
  cold_chain_facilities: number;
  refrigerators: number;
  building_improvements: number;
  outstanding_creditors: number;
  st_faiths: number;
  wood_furniture_replacements: number;
  legal_retainer: number;
  licensing: number;
  curtains: number;
  bathroom_stalls: number;
}

// ============================================================================
// MONTHLY SUMMARY
// ============================================================================
export interface MonthlySummary {
  id: string;
  month: number;
  year: number;
  total_revenue: number;
  total_cogs: number;
  gross_profit: number;
  cogs_percentage: number;
  total_expenses: number;
  net_profit: number;
  free_cashflow_brought_forward: number;
  total_free_cash: number;
  total_capex: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// USER ROLES
// ============================================================================
export type UserRole = 'branch_manager' | 'business_owner';
export type EntryStatus = 'draft' | 'submitted';

export interface UserRoleInfo {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}

// ============================================================================
// COMPARISON TYPES
// ============================================================================
export interface ChangeMetric {
  current_value: number;
  previous_value: number;
  absolute_change: number;
  percentage_change: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface WeekComparison {
  current_week: WeeklyEntry;
  previous_week: WeeklyEntry | null;
  changes: {
    total_revenue: ChangeMetric;
    cafe_revenue: ChangeMetric;
    hotel_revenue: ChangeMetric;
    car_hire_revenue: ChangeMetric;
    total_cogs: ChangeMetric;
    gross_profit: ChangeMetric;
    cogs_percentage: ChangeMetric;
  };
}

export interface MonthComparison {
  current_month: MonthlySummary;
  previous_month: MonthlySummary | null;
  changes: {
    total_revenue: ChangeMetric;
    total_cogs: ChangeMetric;
    gross_profit: ChangeMetric;
    total_expenses: ChangeMetric;
    net_profit: ChangeMetric;
  };
}

export interface QuarterSummary {
  quarter: number;
  year: number;
  total_revenue: number;
  total_cogs: number;
  gross_profit: number;
  total_expenses: number;
  net_profit: number;
  months: MonthlySummary[];
}

export interface QuarterComparison {
  current_quarter: QuarterSummary;
  previous_quarter: QuarterSummary | null;
  changes: {
    total_revenue: ChangeMetric;
    total_cogs: ChangeMetric;
    gross_profit: ChangeMetric;
    total_expenses: ChangeMetric;
    net_profit: ChangeMetric;
  };
}

// ============================================================================
// DASHBOARD TYPES
// ============================================================================
export interface DashboardSummary {
  current_week: {
    revenue: number;
    cogs: number;
    gross_profit: number;
    cogs_percentage: number;
  };
  current_month: {
    revenue: number;
    cogs: number;
    gross_profit: number;
    expenses: number;
    net_profit: number;
    cogs_percentage: number;
  };
  ytd: {
    revenue: number;
    cogs: number;
    gross_profit: number;
    expenses: number;
    net_profit: number;
  };
}

export interface RevenueBreakdown {
  date: string;
  cafe: number;
  hotel: number;
  car_hire: number;
  total: number;
}

export interface COGSBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface ExpenseTrend {
  month: string;
  wages: number;
  utilities: number;
  taxes: number;
  other: number;
  total: number;
}

export interface WaterfallData {
  name: string;
  value: number;
  type: 'positive' | 'negative' | 'total';
}

// ============================================================================
// FORM TYPES
// ============================================================================
export interface WeeklyFormState {
  week_start_date: Date | null;
  week_end_date: Date | null;
  revenue: {
    bowery_cafe: string;
    hotel: string;
    car_hire: string;
  };
  cogs: {
    meats: string;
    liquor: string;
    beverages_and_mixes: string;
    dairy_products: string;
    condiments: string;
    vegetables_and_fruits: string;
    starches_and_grains: string;
    cereal_and_nuts: string;
    baking_ingredients: string;
    booking_com_commission: string;
  };
}

export interface MonthlyFormState {
  month: number | null;
  year: number | null;
  wages: {
    cafe: string;
    hotel: string;
  };
  utilities: {
    gas: string;
    fuel: string;
    council_rates: string;
    electricity: string;
  };
  taxes: {
    payee: string;
    vat: string;
  };
  other_expenses: {
    packaging: string;
    detergents: string;
    stationery: string;
    marketing: string;
    staff_expenses: string;
    vehicle_maintenance: string;
    sundry: string;
  };
}

export interface CapexFormState {
  month: number | null;
  year: number | null;
  items: {
    icombi_ovens: string;
    seating_area_expansion: string;
    aluminium_patio_seating: string;
    airconditioning: string;
    art_soft_furnishings: string;
    landscaping_plants: string;
    training_consulting: string;
    cold_chain_facilities: string;
    refrigerators: string;
    building_improvements: string;
    outstanding_creditors: string;
    st_faiths: string;
    wood_furniture_replacements: string;
    legal_retainer: string;
    licensing: string;
    curtains: string;
    bathroom_stalls: string;
  };
}

// ============================================================================
// FILTER TYPES
// ============================================================================
export interface DateRangeFilter {
  start_date: Date;
  end_date: Date;
}

export type ComparisonPeriod = 'week' | 'month' | 'quarter' | 'year';
export type BusinessUnit = 'all' | 'cafe' | 'hotel' | 'car_hire';

export interface DashboardFilters {
  date_range: DateRangeFilter | null;
  business_unit: BusinessUnit;
  comparison_period: ComparisonPeriod;
  fiscal_year: number;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

// ============================================================================
// FIELD LABELS & METADATA
// ============================================================================
export const REVENUE_FIELDS = {
  bowery_cafe_revenue: { label: 'The Bowery Cafe', description: 'Cafe revenue', format: 'currency' },
  hotel_revenue: { label: 'Hotel', description: 'Hotel revenue', format: 'currency' },
  car_hire_revenue: { label: 'Car Hire', description: 'Car hire revenue', format: 'currency' },
} as const;

export const COGS_FIELDS = {
  meats: { label: 'Meats', category: 'Food' },
  liquor: { label: 'Liquor', category: 'Beverages' },
  beverages_and_mixes: { label: 'Beverages and Mixes', category: 'Beverages' },
  dairy_products: { label: 'Dairy Products', category: 'Food' },
  condiments: { label: 'Condiments', category: 'Food' },
  vegetables_and_fruits: { label: 'Vegetables & Fruits', category: 'Food' },
  starches_and_grains: { label: 'Starches & Grains', category: 'Food' },
  cereal_and_nuts: { label: 'Cereal and Nuts', category: 'Food' },
  baking_ingredients: { label: 'Baking Ingredients', category: 'Food' },
  booking_com_commission: { label: 'Booking.com Commission (30%)', category: 'Commission' },
} as const;

export const EXPENSE_FIELDS = {
  wages_cafe: { label: 'Cafe', category: 'Wages' },
  wages_hotel: { label: 'Hotel', category: 'Wages' },
  gas: { label: 'Gas', category: 'Utilities' },
  fuel_vehicles_generator: { label: 'Fuel (Vehicles and Generator)', category: 'Utilities' },
  council_rates_water: { label: 'Council Rates and Water', category: 'Utilities' },
  electricity_zesa: { label: 'Electricity (ZESA)', category: 'Utilities' },
  payee: { label: 'PAYEE', category: 'Taxes' },
  vat_zimra: { label: 'VAT - ZIMRA', category: 'Taxes' },
  packaging: { label: 'Packaging', category: 'Other' },
  detergents_cleaning: { label: 'Detergents and Cleaning Material', category: 'Other' },
  stationery: { label: 'Stationery', category: 'Other' },
  marketing: { label: 'Marketing', category: 'Other' },
  staff_expenses: { label: 'Staff Expenses (Uniforms and Supplies)', category: 'Other' },
  vehicle_maintenance: { label: 'Vehicle Maintenance', category: 'Other' },
  sundry_expenses: { label: 'Sundry Expenses', category: 'Other' },
} as const;

export const CAPEX_FIELDS = {
  icombi_ovens: { label: 'ICOMBI Ovens', category: 'Equipment' },
  seating_area_expansion: { label: 'Seating Area Expansion', category: 'Furniture' },
  aluminium_patio_seating: { label: 'Aluminium Patio and Expanded Seating', category: 'Furniture' },
  airconditioning: { label: 'Airconditioning', category: 'Equipment' },
  art_soft_furnishings: { label: 'Art and Soft Furnishings', category: 'Decor' },
  landscaping_plants: { label: 'Landscaping, Flowers and New Plants', category: 'Landscaping' },
  training_consulting: { label: 'Training and Consulting', category: 'Services' },
  cold_chain_facilities: { label: 'Cold Chain Facilities', category: 'Equipment' },
  refrigerators: { label: 'Refrigerators', category: 'Equipment' },
  building_improvements: { label: 'Building Improvements', category: 'Construction' },
  outstanding_creditors: { label: 'Outstanding Creditors', category: 'Payables' },
  st_faiths: { label: 'St Faiths', category: 'Other' },
  wood_furniture_replacements: { label: 'Wood and Furniture Replacements', category: 'Furniture' },
  legal_retainer: { label: 'Legal Retainer', category: 'Services' },
  licensing: { label: 'Licensing', category: 'Services' },
  curtains: { label: 'Curtains', category: 'Decor' },
  bathroom_stalls: { label: 'Bathroom Stalls', category: 'Construction' },
} as const;

// ============================================================================
// CONSTANTS
// ============================================================================
export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const;

export const QUARTERS = {
  Q1: [1, 2, 3],
  Q2: [4, 5, 6],
  Q3: [7, 8, 9],
  Q4: [10, 11, 12],
} as const;

export const PEAK_SEASON_MONTHS = [12, 1, 2, 3];
export const LOW_SEASON_MONTHS = [4, 5, 6, 7, 8, 9, 10, 11];

// ============================================================================
// UTILITY TYPES
// ============================================================================
export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};
