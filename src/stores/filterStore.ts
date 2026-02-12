import { create } from 'zustand'
import type { BusinessUnit, ComparisonPeriod, DateRangeFilter } from '@/types/financial'

interface FilterState {
  fiscalYear: number
  businessUnit: BusinessUnit
  comparisonPeriod: ComparisonPeriod
  dateRange: DateRangeFilter | null
  setFiscalYear: (year: number) => void
  setBusinessUnit: (unit: BusinessUnit) => void
  setComparisonPeriod: (period: ComparisonPeriod) => void
  setDateRange: (range: DateRangeFilter | null) => void
  reset: () => void
}

const currentYear = new Date().getFullYear()

export const useFilterStore = create<FilterState>((set) => ({
  fiscalYear: currentYear,
  businessUnit: 'all',
  comparisonPeriod: 'month',
  dateRange: null,
  setFiscalYear: (fiscalYear) => set({ fiscalYear }),
  setBusinessUnit: (businessUnit) => set({ businessUnit }),
  setComparisonPeriod: (comparisonPeriod) => set({ comparisonPeriod }),
  setDateRange: (dateRange) => set({ dateRange }),
  reset: () => set({
    fiscalYear: currentYear,
    businessUnit: 'all',
    comparisonPeriod: 'month',
    dateRange: null,
  }),
}))
