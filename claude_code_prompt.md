# Hotel Financial Management Web Application - Development Prompt

## Project Overview
Build a comprehensive financial management web application for a hotel business with café and car hire operations. The system requires weekly revenue and COGS data entry, monthly expense tracking, and an executive dashboard with comparative analytics.

## Tech Stack
- **Frontend**: React with TypeScript
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **UI Framework**: Use Shadcn/ui with Tailwind CSS
- **Charts**: Recharts or similar React charting library
- **State Management**: React Context or Zustand

## Database Schema (Supabase)

### Table: `weekly_entries`
```sql
- id (uuid, primary key)
- week_start_date (date, not null)
- week_end_date (date, not null)
- year (integer)
- week_number (integer)
- created_at (timestamp)
- updated_at (timestamp)
- created_by (uuid, foreign key to auth.users)

-- Revenue fields
- bowery_cafe_revenue (decimal)
- hotel_revenue (decimal)
- car_hire_revenue (decimal)
- total_revenue (decimal, computed)

-- COGS & Inventory fields
- meats (decimal)
- liquor (decimal)
- beverages_and_mixes (decimal)
- dairy_products (decimal)
- condiments (decimal)
- vegetables_and_fruits (decimal)
- starches_and_grains (decimal)
- cereal_and_nuts (decimal)
- baking_ingredients (decimal)
- booking_com_commission (decimal)
- total_cogs (decimal, computed)
- cogs_percentage (decimal, computed)
- gross_profit (decimal, computed)
```

### Table: `monthly_entries`
```sql
- id (uuid, primary key)
- month (integer, 1-12)
- year (integer)
- created_at (timestamp)
- updated_at (timestamp)
- created_by (uuid, foreign key to auth.users)

-- Wages and Salaries
- wages_cafe (decimal)
- wages_hotel (decimal)

-- Utilities
- gas (decimal)
- fuel_vehicles_generator (decimal)
- council_rates_water (decimal)
- electricity_zesa (decimal)

-- Taxes
- payee (decimal)
- vat_zimra (decimal)

-- Other Expenses
- packaging (decimal)
- detergents_cleaning (decimal)
- stationery (decimal)
- marketing (decimal)
- staff_expenses (decimal)
- vehicle_maintenance (decimal)
- sundry_expenses (decimal)

-- Computed fields
- total_utilities (decimal)
- total_taxes (decimal)
- total_other_expenses (decimal)
- total_expenses (decimal)
```

### Table: `capex_entries`
```sql
- id (uuid, primary key)
- month (integer)
- year (integer)
- created_at (timestamp)
- updated_at (timestamp)

-- CAPEX Items
- icombi_ovens (decimal)
- seating_area_expansion (decimal)
- aluminium_patio_seating (decimal)
- airconditioning (decimal)
- art_soft_furnishings (decimal)
- landscaping_plants (decimal)
- training_consulting (decimal)
- cold_chain_facilities (decimal)
- refrigerators (decimal)
- building_improvements (decimal)
- outstanding_creditors (decimal)
- st_faiths (decimal)
- wood_furniture_replacements (decimal)
- legal_retainer (decimal)
- licensing (decimal)
- total_capex (decimal, computed)
```

### Table: `monthly_summary`
```sql
- id (uuid, primary key)
- month (integer)
- year (integer)
- total_revenue (decimal)
- total_cogs (decimal)
- gross_profit (decimal)
- total_expenses (decimal)
- net_profit (decimal)
- free_cashflow_brought_forward (decimal)
- total_free_cash (decimal)
- total_capex (decimal)
- created_at (timestamp)
```

## Core Features & User Roles

### 1. Branch Manager Portal
**Purpose**: Weekly and monthly data entry

**Weekly Data Entry Form**:
- Date range picker (week start and end)
- Grouped input sections:
  - **Revenue Section**:
    - The Bowery Café (USD input)
    - Hotel (USD input)
    - Car Hire (USD input)
    - Total Revenue (auto-calculated, read-only)
  
  - **COGS & Inventory Section**:
    - Meats
    - Liquor
    - Beverages and mixes
    - Dairy products
    - Condiments
    - Vegetables & fruits
    - Starches & grains
    - Cereal and nuts
    - Baking Ingredients
    - Booking.com Commission (30%)
    - Total COGS (auto-calculated)
    - COGS % of Revenue (auto-calculated, show as %)
    - Gross Profit (auto-calculated)

**Monthly Data Entry Form**:
- Month and year selector
- Tabbed or accordion sections:
  - **Wages and Salaries**
  - **Utilities** (Gas, Fuel, Council Rates, Electricity)
  - **Taxes** (PAYEE, VAT-ZIMRA)
  - **Other Expenses** (all other expense items)
  - **CAPEX** (all capital expenditure items)

**Features**:
- Form validation (required fields, positive numbers only)
- Save as draft functionality
- Submit functionality
- Edit previous entries (with audit trail)
- View submission history

### 2. Business Owner Dashboard
**Purpose**: Comprehensive financial overview and analytics

**Dashboard Components**:

1. **Summary Cards** (Top of dashboard):
   - Current Week Revenue
   - Current Month Revenue
   - Current Month Net Profit
   - Current Month COGS %
   - YTD Revenue
   - YTD Net Profit

2. **Revenue Breakdown Chart**:
   - Stacked bar chart showing Café, Hotel, and Car Hire revenue
   - Toggle between weekly, monthly, quarterly views
   - Date range selector

3. **COGS Analysis**:
   - Pie chart showing COGS breakdown by category
   - Line chart showing COGS % trend over time
   - Month selector for detailed view

4. **Profit & Loss Chart**:
   - Waterfall chart showing: Revenue → COGS → Gross Profit → Expenses → Net Profit
   - Monthly view with comparison selector

5. **Comparison Dashboard** (Critical Feature):
   
   **Week-over-Week Comparison**:
   - Table showing current week vs previous week
   - Percentage change indicators (green/red)
   - Metrics: Revenue (total + by category), COGS, Gross Profit
   - Trend sparklines
   
   **Month-over-Month Comparison**:
   - Current month vs previous month
   - All key metrics
   - Visual variance indicators
   
   **Quarter-over-Quarter Comparison**:
   - Q1, Q2, Q3, Q4 comparison table
   - Revenue trends by business unit
   - Expense trends
   - Profitability analysis

6. **Expense Trends**:
   - Line chart showing expense categories over time
   - Ability to toggle categories on/off
   - Month-over-month comparison

7. **CAPEX Tracker**:
   - Progress bars for major CAPEX items
   - Budget vs actual (if budget feature is added)
   - Timeline view

8. **Data Export**:
   - Export to Excel (matching original format)
   - Export to PDF reports
   - Date range selection for exports

9. **Filters & Controls**:
   - Global date range picker
   - Business unit filter (All, Café, Hotel, Car Hire)
   - Comparison period selector
   - Fiscal year selector

## Technical Requirements

### Frontend Structure
```
src/
├── components/
│   ├── ui/ (shadcn components)
│   ├── forms/
│   │   ├── WeeklyEntryForm.tsx
│   │   ├── MonthlyExpenseForm.tsx
│   │   └── FormField.tsx
│   ├── dashboard/
│   │   ├── SummaryCards.tsx
│   │   ├── RevenueChart.tsx
│   │   ├── COGSAnalysis.tsx
│   │   ├── ComparisonTable.tsx
│   │   ├── ExpensesTrend.tsx
│   │   └── CapexTracker.tsx
│   └── layout/
│       ├── Sidebar.tsx
│       └── Header.tsx
├── lib/
│   ├── supabase.ts (Supabase client)
│   ├── calculations.ts (all financial calculations)
│   ├── dateUtils.ts
│   └── exportUtils.ts
├── hooks/
│   ├── useWeeklyData.ts
│   ├── useMonthlyData.ts
│   └── useComparisons.ts
├── pages/
│   ├── Dashboard.tsx
│   ├── WeeklyEntry.tsx
│   ├── MonthlyEntry.tsx
│   └── Reports.tsx
└── types/
    └── financial.ts
```

### Key Calculations (Implement in calculations.ts)
```typescript
// Auto-calculations needed:
1. Total Revenue = Bowery Café + Hotel + Car Hire
2. Total COGS = Sum of all COGS items
3. COGS % = (Total COGS / Total Revenue) × 100
4. Gross Profit = Total Revenue - Total COGS
5. Total Utilities = Sum of all utility items
6. Total Taxes = PAYEE + VAT
7. Total Other Expenses = Sum of other expense items
8. Total Expenses = Wages + Utilities + Taxes + Other Expenses
9. Net Profit = Gross Profit - Total Expenses
10. Total Free Cash = Free Cashflow Brought Forward + Net Profit - Total CAPEX

// Comparison calculations:
- Week-over-Week % Change = ((Current - Previous) / Previous) × 100
- Month-over-Month % Change
- Quarter-over-Quarter % Change
- Average weekly revenue per month
- Moving averages (4-week, 13-week)
```

### Supabase Setup
1. **Row Level Security (RLS)**:
   - Branch managers can only INSERT/UPDATE their own entries
   - Business owner can READ all data
   - Implement policies for each table

2. **Database Functions**:
   - Create SQL functions for complex aggregations
   - Monthly summary generation (triggered after month-end)
   - Quarterly aggregations

3. **Real-time Subscriptions**:
   - Subscribe to weekly_entries for live dashboard updates
   - Subscribe to monthly_entries

### UI/UX Requirements
1. **Responsive Design**: Mobile-friendly for data entry on tablets
2. **Dark Mode Support**: Toggle in settings
3. **Loading States**: Skeleton screens for all data fetching
4. **Error Handling**: Toast notifications for errors
5. **Validation**: Real-time form validation with helpful error messages
6. **Date Handling**: 
   - Week picker: Select week start date, auto-calculate week end (Sunday-Saturday)
   - Month picker: Dropdown with fiscal year awareness
   - Clear date displays throughout

### Authentication
- Use Supabase Auth
- Two user roles:
  - `branch_manager` (can enter data)
  - `business_owner` (read-only, dashboard access)
- Role-based navigation and feature access

### Performance Considerations
1. Implement pagination for data tables (50 rows per page)
2. Cache dashboard aggregations
3. Lazy load charts
4. Optimize Supabase queries with proper indexes
5. Use React.memo for expensive components

### Data Validation Rules
- All monetary values must be >= 0
- Week dates cannot overlap with existing entries
- Monthly entries: One entry per month/year combination
- Required fields must be filled before submission
- Date ranges must be valid (end >= start)

### Export Features
**Excel Export**:
- Match the original Excel format exactly
- Include formulas in exported file
- Support multi-sheet export (one sheet per month)
- Add summary sheet with YTD totals

**PDF Export**:
- Executive summary format
- Include key charts and metrics
- Professional branding

## Development Checklist

### Phase 1: Setup & Database
- [ ] Initialize React + TypeScript project with Vite
- [ ] Setup Supabase project and configure
- [ ] Create all database tables with proper types
- [ ] Implement RLS policies
- [ ] Setup Supabase Auth
- [ ] Create seed data for testing

### Phase 2: Core Forms
- [ ] Build WeeklyEntryForm with all fields
- [ ] Implement auto-calculations for weekly form
- [ ] Build MonthlyExpenseForm with tabbed sections
- [ ] Add form validation
- [ ] Implement save/submit functionality
- [ ] Add edit capability with audit trail

### Phase 3: Dashboard - Basic
- [ ] Create dashboard layout
- [ ] Implement summary cards
- [ ] Build revenue breakdown chart
- [ ] Add COGS analysis chart
- [ ] Create P&L waterfall chart

### Phase 4: Dashboard - Comparisons
- [ ] Build week-over-week comparison table
- [ ] Implement month-over-month comparison
- [ ] Create quarter-over-quarter view
- [ ] Add trend indicators and sparklines
- [ ] Implement variance calculations

### Phase 5: Additional Features
- [ ] Build expense trends chart
- [ ] Create CAPEX tracker
- [ ] Implement data export (Excel + PDF)
- [ ] Add global filters
- [ ] Build reports page

### Phase 6: Polish
- [ ] Responsive design testing
- [ ] Dark mode implementation
- [ ] Loading states and error handling
- [ ] Performance optimization
- [ ] User testing and refinements

## Critical Notes
1. **Weekly aggregation**: When displaying monthly data, aggregate all weeks within that month
2. **Fiscal year**: Clarify if fiscal year = calendar year or different
3. **Currency**: All amounts in USD
4. **Decimal precision**: 2 decimal places for all monetary values
5. **Week definition**: Sunday to Saturday (confirm with client)
6. **Free cashflow**: Implement rollover logic from month to month
7. **Audit trail**: Track who created/updated each entry and when

## Success Criteria
- Branch manager can complete weekly entry in under 5 minutes
- Dashboard loads in under 2 seconds
- All calculations match Excel formulas exactly
- Comparison views clearly show trends and variances
- Export matches original Excel format
- Mobile-responsive for iPad use
- Zero data loss with proper validation

## Additional Enhancements (Optional)
- Budget vs Actual tracking
- Alerts for unusual variances (>20% change)
- Predictive analytics for revenue forecasting
- Multi-currency support
- Automated report scheduling via email
- Mobile app (React Native)
- Integration with accounting software

---

**Start by setting up the database schema in Supabase, then build the weekly entry form, followed by the dashboard. Test each component thoroughly before moving to the next.**
