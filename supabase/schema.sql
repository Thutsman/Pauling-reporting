-- ============================================================================
-- Pauling Reporting — Database Schema
-- ============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USER ROLES
-- ============================================================================
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('branch_manager', 'business_owner')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- ============================================================================
-- WEEKLY ENTRIES
-- ============================================================================
CREATE TABLE weekly_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  year INTEGER NOT NULL,
  week_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted')),

  -- Revenue
  bowery_cafe_revenue NUMERIC(12,2) NOT NULL DEFAULT 0,
  hotel_revenue NUMERIC(12,2) NOT NULL DEFAULT 0,
  car_hire_revenue NUMERIC(12,2) NOT NULL DEFAULT 0,

  -- COGS
  meats NUMERIC(12,2) NOT NULL DEFAULT 0,
  liquor NUMERIC(12,2) NOT NULL DEFAULT 0,
  beverages_and_mixes NUMERIC(12,2) NOT NULL DEFAULT 0,
  dairy_products NUMERIC(12,2) NOT NULL DEFAULT 0,
  condiments NUMERIC(12,2) NOT NULL DEFAULT 0,
  vegetables_and_fruits NUMERIC(12,2) NOT NULL DEFAULT 0,
  starches_and_grains NUMERIC(12,2) NOT NULL DEFAULT 0,
  cereal_and_nuts NUMERIC(12,2) NOT NULL DEFAULT 0,
  baking_ingredients NUMERIC(12,2) NOT NULL DEFAULT 0,
  booking_com_commission NUMERIC(12,2) NOT NULL DEFAULT 0,

  -- Generated columns
  total_revenue NUMERIC(12,2) GENERATED ALWAYS AS (
    bowery_cafe_revenue + hotel_revenue + car_hire_revenue
  ) STORED,
  total_cogs NUMERIC(12,2) GENERATED ALWAYS AS (
    meats + liquor + beverages_and_mixes + dairy_products + condiments +
    vegetables_and_fruits + starches_and_grains + cereal_and_nuts +
    baking_ingredients + booking_com_commission
  ) STORED,
  cogs_percentage NUMERIC(8,2) GENERATED ALWAYS AS (
    CASE WHEN (bowery_cafe_revenue + hotel_revenue + car_hire_revenue) > 0
    THEN ROUND(
      (meats + liquor + beverages_and_mixes + dairy_products + condiments +
       vegetables_and_fruits + starches_and_grains + cereal_and_nuts +
       baking_ingredients + booking_com_commission) * 100.0 /
      (bowery_cafe_revenue + hotel_revenue + car_hire_revenue), 2)
    ELSE 0 END
  ) STORED,
  gross_profit NUMERIC(12,2) GENERATED ALWAYS AS (
    (bowery_cafe_revenue + hotel_revenue + car_hire_revenue) -
    (meats + liquor + beverages_and_mixes + dairy_products + condiments +
     vegetables_and_fruits + starches_and_grains + cereal_and_nuts +
     baking_ingredients + booking_com_commission)
  ) STORED,

  CONSTRAINT valid_week_dates CHECK (week_end_date >= week_start_date),
  CONSTRAINT unique_week UNIQUE (year, week_number)
);

CREATE INDEX idx_weekly_year_week ON weekly_entries(year, week_number);
CREATE INDEX idx_weekly_created_by ON weekly_entries(created_by);
CREATE INDEX idx_weekly_dates ON weekly_entries(week_start_date, week_end_date);

-- ============================================================================
-- MONTHLY ENTRIES
-- ============================================================================
CREATE TABLE monthly_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID NOT NULL REFERENCES auth.users(id),

  -- Wages
  wages_cafe NUMERIC(12,2) NOT NULL DEFAULT 0,
  wages_hotel NUMERIC(12,2) NOT NULL DEFAULT 0,

  -- Utilities
  gas NUMERIC(12,2) NOT NULL DEFAULT 0,
  fuel_vehicles_generator NUMERIC(12,2) NOT NULL DEFAULT 0,
  council_rates_water NUMERIC(12,2) NOT NULL DEFAULT 0,
  electricity_zesa NUMERIC(12,2) NOT NULL DEFAULT 0,

  -- Taxes
  payee NUMERIC(12,2) NOT NULL DEFAULT 0,
  vat_zimra NUMERIC(12,2) NOT NULL DEFAULT 0,

  -- Other Expenses
  packaging NUMERIC(12,2) NOT NULL DEFAULT 0,
  detergents_cleaning NUMERIC(12,2) NOT NULL DEFAULT 0,
  stationery NUMERIC(12,2) NOT NULL DEFAULT 0,
  marketing NUMERIC(12,2) NOT NULL DEFAULT 0,
  staff_expenses NUMERIC(12,2) NOT NULL DEFAULT 0,
  vehicle_maintenance NUMERIC(12,2) NOT NULL DEFAULT 0,
  sundry_expenses NUMERIC(12,2) NOT NULL DEFAULT 0,

  -- Generated columns
  total_wages NUMERIC(12,2) GENERATED ALWAYS AS (
    wages_cafe + wages_hotel
  ) STORED,
  total_utilities NUMERIC(12,2) GENERATED ALWAYS AS (
    gas + fuel_vehicles_generator + council_rates_water + electricity_zesa
  ) STORED,
  total_taxes NUMERIC(12,2) GENERATED ALWAYS AS (
    payee + vat_zimra
  ) STORED,
  total_other_expenses NUMERIC(12,2) GENERATED ALWAYS AS (
    packaging + detergents_cleaning + stationery + marketing +
    staff_expenses + vehicle_maintenance + sundry_expenses
  ) STORED,
  total_expenses NUMERIC(12,2) GENERATED ALWAYS AS (
    wages_cafe + wages_hotel +
    gas + fuel_vehicles_generator + council_rates_water + electricity_zesa +
    payee + vat_zimra +
    packaging + detergents_cleaning + stationery + marketing +
    staff_expenses + vehicle_maintenance + sundry_expenses
  ) STORED,

  CONSTRAINT unique_month UNIQUE (year, month)
);

CREATE INDEX idx_monthly_year_month ON monthly_entries(year, month);
CREATE INDEX idx_monthly_created_by ON monthly_entries(created_by);

-- ============================================================================
-- CAPEX ENTRIES
-- ============================================================================
CREATE TABLE capex_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID NOT NULL REFERENCES auth.users(id),

  -- CAPEX items
  icombi_ovens NUMERIC(12,2) NOT NULL DEFAULT 0,
  seating_area_expansion NUMERIC(12,2) NOT NULL DEFAULT 0,
  aluminium_patio_seating NUMERIC(12,2) NOT NULL DEFAULT 0,
  airconditioning NUMERIC(12,2) NOT NULL DEFAULT 0,
  art_soft_furnishings NUMERIC(12,2) NOT NULL DEFAULT 0,
  landscaping_plants NUMERIC(12,2) NOT NULL DEFAULT 0,
  training_consulting NUMERIC(12,2) NOT NULL DEFAULT 0,
  cold_chain_facilities NUMERIC(12,2) NOT NULL DEFAULT 0,
  refrigerators NUMERIC(12,2) NOT NULL DEFAULT 0,
  building_improvements NUMERIC(12,2) NOT NULL DEFAULT 0,
  outstanding_creditors NUMERIC(12,2) NOT NULL DEFAULT 0,
  st_faiths NUMERIC(12,2) NOT NULL DEFAULT 0,
  wood_furniture_replacements NUMERIC(12,2) NOT NULL DEFAULT 0,
  legal_retainer NUMERIC(12,2) NOT NULL DEFAULT 0,
  licensing NUMERIC(12,2) NOT NULL DEFAULT 0,
  curtains NUMERIC(12,2) NOT NULL DEFAULT 0,
  bathroom_stalls NUMERIC(12,2) NOT NULL DEFAULT 0,

  -- Generated column
  total_capex NUMERIC(12,2) GENERATED ALWAYS AS (
    icombi_ovens + seating_area_expansion + aluminium_patio_seating +
    airconditioning + art_soft_furnishings + landscaping_plants +
    training_consulting + cold_chain_facilities + refrigerators +
    building_improvements + outstanding_creditors + st_faiths +
    wood_furniture_replacements + legal_retainer + licensing +
    curtains + bathroom_stalls
  ) STORED,

  CONSTRAINT unique_capex_month UNIQUE (year, month)
);

CREATE INDEX idx_capex_year_month ON capex_entries(year, month);

-- ============================================================================
-- MONTHLY SUMMARY (materialized via RPC)
-- ============================================================================
CREATE TABLE monthly_summary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL,
  total_revenue NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_cogs NUMERIC(12,2) NOT NULL DEFAULT 0,
  gross_profit NUMERIC(12,2) NOT NULL DEFAULT 0,
  cogs_percentage NUMERIC(8,2) NOT NULL DEFAULT 0,
  total_expenses NUMERIC(12,2) NOT NULL DEFAULT 0,
  net_profit NUMERIC(12,2) NOT NULL DEFAULT 0,
  free_cashflow_brought_forward NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_free_cash NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_capex NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT unique_summary_month UNIQUE (year, month)
);

CREATE INDEX idx_summary_year_month ON monthly_summary(year, month);

-- ============================================================================
-- TRIGGER: auto-update updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_weekly
  BEFORE UPDATE ON weekly_entries
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at_monthly
  BEFORE UPDATE ON monthly_entries
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at_capex
  BEFORE UPDATE ON capex_entries
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at_summary
  BEFORE UPDATE ON monthly_summary
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================================
-- FUNCTION: get_user_role
-- ============================================================================
CREATE OR REPLACE FUNCTION get_user_role(p_user_id UUID)
RETURNS TEXT AS $$
  SELECT role FROM user_roles WHERE user_id = p_user_id LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================================
-- FUNCTION: recompute_monthly_summary
-- ============================================================================
CREATE OR REPLACE FUNCTION recompute_monthly_summary(p_month INTEGER, p_year INTEGER)
RETURNS void AS $$
DECLARE
  v_total_revenue NUMERIC(12,2) := 0;
  v_total_cogs NUMERIC(12,2) := 0;
  v_gross_profit NUMERIC(12,2) := 0;
  v_cogs_percentage NUMERIC(8,2) := 0;
  v_total_expenses NUMERIC(12,2) := 0;
  v_net_profit NUMERIC(12,2) := 0;
  v_total_capex NUMERIC(12,2) := 0;
  v_prev_free_cash NUMERIC(12,2) := 0;
  v_total_free_cash NUMERIC(12,2) := 0;
  v_prev_month INTEGER;
  v_prev_year INTEGER;
BEGIN
  -- Aggregate weekly entries for this month.
  -- Use week_end_date to determine which month a week belongs to,
  -- since weeks straddling month boundaries (e.g. Dec 29 - Jan 4)
  -- should be assigned to the month of their end date.
  SELECT
    COALESCE(SUM(total_revenue), 0),
    COALESCE(SUM(total_cogs), 0)
  INTO v_total_revenue, v_total_cogs
  FROM weekly_entries
  WHERE EXTRACT(MONTH FROM week_end_date) = p_month
    AND year = p_year;

  v_gross_profit := v_total_revenue - v_total_cogs;
  v_cogs_percentage := CASE WHEN v_total_revenue > 0
    THEN ROUND(v_total_cogs * 100.0 / v_total_revenue, 2)
    ELSE 0 END;

  -- Get monthly expenses
  SELECT COALESCE(total_expenses, 0)
  INTO v_total_expenses
  FROM monthly_entries
  WHERE month = p_month AND year = p_year
  LIMIT 1;

  v_net_profit := v_gross_profit - v_total_expenses;

  -- Get CAPEX
  SELECT COALESCE(total_capex, 0)
  INTO v_total_capex
  FROM capex_entries
  WHERE month = p_month AND year = p_year
  LIMIT 1;

  -- Get previous month's free cash
  IF p_month = 1 THEN
    v_prev_month := 12;
    v_prev_year := p_year - 1;
  ELSE
    v_prev_month := p_month - 1;
    v_prev_year := p_year;
  END IF;

  -- Use subquery with COALESCE to handle missing previous month
  v_prev_free_cash := COALESCE(
    (SELECT total_free_cash
     FROM monthly_summary
     WHERE month = v_prev_month AND year = v_prev_year
     LIMIT 1),
    0
  );

  v_total_free_cash := v_prev_free_cash + v_net_profit - v_total_capex;

  -- Upsert
  INSERT INTO monthly_summary (
    month, year, total_revenue, total_cogs, gross_profit, cogs_percentage,
    total_expenses, net_profit, free_cashflow_brought_forward,
    total_free_cash, total_capex
  ) VALUES (
    p_month, p_year, v_total_revenue, v_total_cogs, v_gross_profit,
    v_cogs_percentage, v_total_expenses, v_net_profit, v_prev_free_cash,
    v_total_free_cash, v_total_capex
  )
  ON CONFLICT (year, month) DO UPDATE SET
    total_revenue = EXCLUDED.total_revenue,
    total_cogs = EXCLUDED.total_cogs,
    gross_profit = EXCLUDED.gross_profit,
    cogs_percentage = EXCLUDED.cogs_percentage,
    total_expenses = EXCLUDED.total_expenses,
    net_profit = EXCLUDED.net_profit,
    free_cashflow_brought_forward = EXCLUDED.free_cashflow_brought_forward,
    total_free_cash = EXCLUDED.total_free_cash,
    total_capex = EXCLUDED.total_capex;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE capex_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_summary ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read everything
CREATE POLICY "Authenticated users can read user_roles"
  ON user_roles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read weekly_entries"
  ON weekly_entries FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read monthly_entries"
  ON monthly_entries FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read capex_entries"
  ON capex_entries FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read monthly_summary"
  ON monthly_summary FOR SELECT TO authenticated USING (true);

-- Branch managers can insert their own entries
CREATE POLICY "Branch managers can insert weekly_entries"
  ON weekly_entries FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = created_by AND
    get_user_role(auth.uid()) = 'branch_manager'
  );

CREATE POLICY "Branch managers can update own weekly_entries"
  ON weekly_entries FOR UPDATE TO authenticated
  USING (
    auth.uid() = created_by AND
    get_user_role(auth.uid()) = 'branch_manager'
  );

CREATE POLICY "Branch managers can insert monthly_entries"
  ON monthly_entries FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = created_by AND
    get_user_role(auth.uid()) = 'branch_manager'
  );

CREATE POLICY "Branch managers can update own monthly_entries"
  ON monthly_entries FOR UPDATE TO authenticated
  USING (
    auth.uid() = created_by AND
    get_user_role(auth.uid()) = 'branch_manager'
  );

CREATE POLICY "Branch managers can insert capex_entries"
  ON capex_entries FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = created_by AND
    get_user_role(auth.uid()) = 'branch_manager'
  );

CREATE POLICY "Branch managers can update own capex_entries"
  ON capex_entries FOR UPDATE TO authenticated
  USING (
    auth.uid() = created_by AND
    get_user_role(auth.uid()) = 'branch_manager'
  );

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE weekly_entries;
ALTER PUBLICATION supabase_realtime ADD TABLE monthly_entries;
ALTER PUBLICATION supabase_realtime ADD TABLE monthly_summary;
