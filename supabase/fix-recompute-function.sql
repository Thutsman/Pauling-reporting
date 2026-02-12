-- ============================================================================
-- Fix recompute_monthly_summary to handle missing previous months
-- ============================================================================
-- When there's no previous month in monthly_summary, v_prev_free_cash should
-- default to 0 instead of NULL.
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
  -- Aggregate weekly entries for this month
  SELECT
    COALESCE(SUM(total_revenue), 0),
    COALESCE(SUM(total_cogs), 0)
  INTO v_total_revenue, v_total_cogs
  FROM weekly_entries
  WHERE EXTRACT(MONTH FROM week_start_date) = p_month
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
