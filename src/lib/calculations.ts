import type {
  WeeklyEntry,
  MonthlySummary,
  ChangeMetric,
  QuarterSummary,
  RevenueBreakdown,
  COGSBreakdown,
  WaterfallData,
  ExpenseTrend,
  MonthlyEntry,
} from '@/types/financial'

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100
}

export function calculateTotalRevenue(cafe: number, hotel: number, carHire: number): number {
  return roundMoney(cafe + hotel + carHire)
}

export function calculateTotalCOGS(values: {
  meats: number
  liquor: number
  beverages_and_mixes: number
  dairy_products: number
  condiments: number
  vegetables_and_fruits: number
  starches_and_grains: number
  cereal_and_nuts: number
  baking_ingredients: number
  booking_com_commission: number
}): number {
  return roundMoney(
    values.meats + values.liquor + values.beverages_and_mixes +
    values.dairy_products + values.condiments + values.vegetables_and_fruits +
    values.starches_and_grains + values.cereal_and_nuts +
    values.baking_ingredients + values.booking_com_commission
  )
}

export function calculateCOGSPercentage(totalCOGS: number, totalRevenue: number): number {
  if (totalRevenue === 0) return 0
  return roundMoney((totalCOGS / totalRevenue) * 100)
}

export function calculateGrossProfit(totalRevenue: number, totalCOGS: number): number {
  return roundMoney(totalRevenue - totalCOGS)
}

export function calculateTotalExpenses(values: {
  wages_cafe: number
  wages_hotel: number
  gas: number
  fuel_vehicles_generator: number
  council_rates_water: number
  electricity_zesa: number
  payee: number
  vat_zimra: number
  packaging: number
  detergents_cleaning: number
  stationery: number
  marketing: number
  staff_expenses: number
  vehicle_maintenance: number
  sundry_expenses: number
}): number {
  return roundMoney(
    values.wages_cafe + values.wages_hotel +
    values.gas + values.fuel_vehicles_generator +
    values.council_rates_water + values.electricity_zesa +
    values.payee + values.vat_zimra +
    values.packaging + values.detergents_cleaning +
    values.stationery + values.marketing +
    values.staff_expenses + values.vehicle_maintenance +
    values.sundry_expenses
  )
}

export function calculateNetProfit(grossProfit: number, totalExpenses: number): number {
  return roundMoney(grossProfit - totalExpenses)
}

export function calculateTotalFreeCash(
  freeCashBroughtForward: number,
  netProfit: number,
  totalCapex: number
): number {
  return roundMoney(freeCashBroughtForward + netProfit - totalCapex)
}

export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) {
    if (current === 0) return 0
    return 100
  }
  return roundMoney(((current - previous) / Math.abs(previous)) * 100)
}

export function buildChangeMetric(current: number, previous: number): ChangeMetric {
  const absoluteChange = roundMoney(current - previous)
  const percentageChange = calculatePercentageChange(current, previous)
  const trend: ChangeMetric['trend'] =
    absoluteChange > 0 ? 'up' : absoluteChange < 0 ? 'down' : 'neutral'
  return {
    current_value: current,
    previous_value: previous,
    absolute_change: absoluteChange,
    percentage_change: percentageChange,
    trend,
  }
}

export function aggregateWeeklyToMonthly(entries: WeeklyEntry[]): {
  totalRevenue: number
  totalCOGS: number
  grossProfit: number
  cafeRevenue: number
  hotelRevenue: number
  carHireRevenue: number
} {
  const totals = entries.reduce(
    (acc, e) => ({
      totalRevenue: acc.totalRevenue + e.total_revenue,
      totalCOGS: acc.totalCOGS + e.total_cogs,
      grossProfit: acc.grossProfit + e.gross_profit,
      cafeRevenue: acc.cafeRevenue + e.bowery_cafe_revenue,
      hotelRevenue: acc.hotelRevenue + e.hotel_revenue,
      carHireRevenue: acc.carHireRevenue + e.car_hire_revenue,
    }),
    { totalRevenue: 0, totalCOGS: 0, grossProfit: 0, cafeRevenue: 0, hotelRevenue: 0, carHireRevenue: 0 }
  )
  return {
    totalRevenue: roundMoney(totals.totalRevenue),
    totalCOGS: roundMoney(totals.totalCOGS),
    grossProfit: roundMoney(totals.grossProfit),
    cafeRevenue: roundMoney(totals.cafeRevenue),
    hotelRevenue: roundMoney(totals.hotelRevenue),
    carHireRevenue: roundMoney(totals.carHireRevenue),
  }
}

export function buildQuarterSummary(months: MonthlySummary[], quarter: number, year: number): QuarterSummary {
  return {
    quarter,
    year,
    total_revenue: roundMoney(months.reduce((s, m) => s + m.total_revenue, 0)),
    total_cogs: roundMoney(months.reduce((s, m) => s + m.total_cogs, 0)),
    gross_profit: roundMoney(months.reduce((s, m) => s + m.gross_profit, 0)),
    total_expenses: roundMoney(months.reduce((s, m) => s + m.total_expenses, 0)),
    net_profit: roundMoney(months.reduce((s, m) => s + m.net_profit, 0)),
    months,
  }
}

export function weeklyToRevenueBreakdown(entries: WeeklyEntry[]): RevenueBreakdown[] {
  return entries.map(e => ({
    date: `W${e.week_number}`,
    cafe: e.bowery_cafe_revenue,
    hotel: e.hotel_revenue,
    car_hire: e.car_hire_revenue,
    total: e.total_revenue,
  }))
}

export function monthlySummaryToRevenueBreakdown(
  summaries: MonthlySummary[],
  weeklyByMonth: Map<number, WeeklyEntry[]>
): RevenueBreakdown[] {
  return summaries.map(s => {
    const weeks = weeklyByMonth.get(s.month) || []
    const agg = aggregateWeeklyToMonthly(weeks)
    return {
      date: `M${s.month}`,
      cafe: agg.cafeRevenue,
      hotel: agg.hotelRevenue,
      car_hire: agg.carHireRevenue,
      total: s.total_revenue,
    }
  })
}

export function buildCOGSBreakdown(entry: WeeklyEntry): COGSBreakdown[] {
  const items = [
    { category: 'Meats', amount: entry.meats },
    { category: 'Liquor', amount: entry.liquor },
    { category: 'Beverages & Mixes', amount: entry.beverages_and_mixes },
    { category: 'Dairy Products', amount: entry.dairy_products },
    { category: 'Condiments', amount: entry.condiments },
    { category: 'Vegetables & Fruits', amount: entry.vegetables_and_fruits },
    { category: 'Starches & Grains', amount: entry.starches_and_grains },
    { category: 'Cereal & Nuts', amount: entry.cereal_and_nuts },
    { category: 'Baking Ingredients', amount: entry.baking_ingredients },
    { category: 'Booking.com Commission', amount: entry.booking_com_commission },
  ]
  const total = items.reduce((s, i) => s + i.amount, 0)
  return items.map(i => ({
    category: i.category,
    amount: i.amount,
    percentage: total > 0 ? roundMoney((i.amount / total) * 100) : 0,
  }))
}

export function buildWaterfallData(summary: MonthlySummary): WaterfallData[] {
  return [
    { name: 'Revenue', value: summary.total_revenue, type: 'positive' },
    { name: 'COGS', value: -summary.total_cogs, type: 'negative' },
    { name: 'Gross Profit', value: summary.gross_profit, type: 'total' },
    { name: 'Expenses', value: -summary.total_expenses, type: 'negative' },
    { name: 'Net Profit', value: summary.net_profit, type: 'total' },
  ]
}

export function buildExpenseTrends(entries: MonthlyEntry[]): ExpenseTrend[] {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return entries.map(e => ({
    month: monthNames[e.month - 1],
    wages: e.total_wages,
    utilities: e.total_utilities,
    taxes: e.total_taxes,
    other: e.total_other_expenses,
    total: e.total_expenses,
  }))
}
