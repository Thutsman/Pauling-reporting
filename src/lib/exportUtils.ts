import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { MonthlySummary, WeeklyEntry, MonthlyEntry, CapexEntry } from '@/types/financial'
import { formatCurrency, formatPercentage } from './formatters'
import { getMonthName } from './dateUtils'

export async function exportToExcel(
  summaries: MonthlySummary[],
  weeklyByMonth: Map<string, WeeklyEntry[]>,
  monthlyEntries: MonthlyEntry[],
  capexEntries: CapexEntry[],
  year: number
) {
  const wb = XLSX.utils.book_new()

  const summaryRows = [
    ['Month', 'Revenue', 'COGS', 'Gross Profit', 'COGS %', 'Expenses', 'Net Profit', 'Free Cash', 'CAPEX'],
    ...summaries.map((s) => [
      `${getMonthName(s.month)} ${s.year}`,
      s.total_revenue,
      s.total_cogs,
      s.gross_profit,
      s.cogs_percentage,
      s.total_expenses,
      s.net_profit,
      s.total_free_cash,
      s.total_capex,
    ]),
  ]

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryRows)
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary')

  for (const s of summaries) {
    const key = `${s.year}-${s.month}`
    const weeks = weeklyByMonth.get(key) ?? []
    const monthly = monthlyEntries.find((e) => e.month === s.month && e.year === s.year)
    const capex = capexEntries.find((e) => e.month === s.month && e.year === s.year)

    const rows: (string | number)[][] = []

    rows.push([`${getMonthName(s.month)} ${s.year}`])
    rows.push([])
    rows.push(['Weekly Revenue'])
    weeks.forEach((w) => {
      rows.push([`Week ${w.week_number}`, w.total_revenue, w.total_cogs, w.gross_profit])
    })
    rows.push([])
    rows.push(['Monthly Expenses'])
    if (monthly) {
      rows.push(['Total', monthly.total_expenses])
    }
    rows.push([])
    rows.push(['CAPEX'])
    if (capex) {
      rows.push(['Total', capex.total_capex])
    }

    const sheet = XLSX.utils.aoa_to_sheet(rows)
    XLSX.utils.book_append_sheet(wb, sheet, `${getMonthName(s.month).slice(0, 3)} ${s.year}`)
  }

  XLSX.writeFile(wb, `Pauling-Reporting-${year}.xlsx`)
}

export async function exportToPDF(
  summaries: MonthlySummary[],
  year: number
) {
  const doc = new jsPDF()

  doc.setFontSize(18)
  doc.text('Pauling Reporting - Executive Summary', 14, 22)
  doc.setFontSize(12)
  doc.text(`Fiscal Year ${year}`, 14, 30)

  const ytd = summaries.reduce(
    (acc, s) => ({
      revenue: acc.revenue + s.total_revenue,
      cogs: acc.cogs + s.total_cogs,
      gross_profit: acc.gross_profit + s.gross_profit,
      expenses: acc.expenses + s.total_expenses,
      net_profit: acc.net_profit + s.net_profit,
    }),
    { revenue: 0, cogs: 0, gross_profit: 0, expenses: 0, net_profit: 0 }
  )

  const kpiData = [
    ['YTD Revenue', formatCurrency(ytd.revenue)],
    ['YTD COGS', formatCurrency(ytd.cogs)],
    ['YTD Gross Profit', formatCurrency(ytd.gross_profit)],
    ['YTD Expenses', formatCurrency(ytd.expenses)],
    ['YTD Net Profit', formatCurrency(ytd.net_profit)],
  ]

  autoTable(doc, {
    startY: 40,
    head: [['KPI', 'Value']],
    body: kpiData,
    theme: 'grid',
  })

  const summaryRows = summaries.map((s) => [
    `${getMonthName(s.month)} ${s.year}`,
    formatCurrency(s.total_revenue),
    formatCurrency(s.total_cogs),
    formatPercentage(s.cogs_percentage),
    formatCurrency(s.total_expenses),
    formatCurrency(s.net_profit),
  ])

  const table1End = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 0
  autoTable(doc, {
    startY: table1End + 20,
    head: [['Month', 'Revenue', 'COGS', 'COGS %', 'Expenses', 'Net Profit']],
    body: summaryRows,
    theme: 'grid',
  })

  doc.save(`Pauling-Reporting-${year}.pdf`)
}
