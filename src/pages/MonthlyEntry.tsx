import { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { useMonthlyData } from '@/hooks/useMonthlyData'
import { useCapexData } from '@/hooks/useCapexData'
import { MonthlyExpenseForm } from '@/components/forms/MonthlyExpenseForm'
import { CapexForm } from '@/components/forms/CapexForm'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency } from '@/lib/formatters'
import { getMonthName } from '@/lib/dateUtils'
import { MONTHS } from '@/lib/constants'

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

export function MonthlyEntry() {
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(currentYear)
  const { entries: monthlyEntries, create: createMonthly, update: updateMonthly, getByMonthYear: getMonthly, loading: monthlyLoading } = useMonthlyData()
  const { create: createCapex, update: updateCapex, getByMonthYear: getCapex } = useCapexData()
  const { toast } = useToast()
  const [monthlyData, setMonthlyData] = useState<ReturnType<typeof useMonthlyData>['entries'][0] | null>(null)
  const [capexData, setCapexData] = useState<ReturnType<typeof useCapexData>['entries'][0] | null>(null)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoadingData(true)
    Promise.all([getMonthly(month, year), getCapex(month, year)]).then(
      ([m, c]) => {
        if (!cancelled) {
          setMonthlyData(m ?? null)
          setCapexData(c ?? null)
          setLoadingData(false)
        }
      }
    ).catch(() => {
      if (!cancelled) setLoadingData(false)
    })
    return () => { cancelled = true }
  }, [month, year, getMonthly, getCapex])

  const handleMonthlySubmit = async (data: Parameters<typeof createMonthly>[0]) => {
    try {
      if (monthlyData) {
        await updateMonthly(monthlyData.id, data)
        toast({ title: 'Monthly expenses updated', variant: 'default' })
      } else {
        await createMonthly(data)
        toast({ title: 'Monthly expenses saved', variant: 'default' })
      }
      const updated = await getMonthly(month, year)
      setMonthlyData(updated ?? null)
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to save',
        variant: 'destructive',
      })
      throw err
    }
  }

  const handleCapexSubmit = async (data: Parameters<typeof createCapex>[0]) => {
    try {
      if (capexData) {
        await updateCapex(capexData.id, data)
        toast({ title: 'CAPEX updated', variant: 'default' })
      } else {
        await createCapex(data)
        toast({ title: 'CAPEX saved', variant: 'default' })
      }
      const updated = await getCapex(month, year)
      setCapexData(updated ?? null)
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to save',
        variant: 'destructive',
      })
      throw err
    }
  }

  const monthlyInitialData = monthlyData
    ? {
        wages: { cafe: monthlyData.wages_cafe.toString(), hotel: monthlyData.wages_hotel.toString() },
        utilities: {
          gas: monthlyData.gas.toString(),
          fuel: monthlyData.fuel_vehicles_generator.toString(),
          council_rates: monthlyData.council_rates_water.toString(),
          electricity: monthlyData.electricity_zesa.toString(),
        },
        taxes: { payee: monthlyData.payee.toString(), vat: monthlyData.vat_zimra.toString() },
        other_expenses: {
          packaging: monthlyData.packaging.toString(),
          detergents: monthlyData.detergents_cleaning.toString(),
          stationery: monthlyData.stationery.toString(),
          marketing: monthlyData.marketing.toString(),
          staff_expenses: monthlyData.staff_expenses.toString(),
          vehicle_maintenance: monthlyData.vehicle_maintenance.toString(),
          sundry: monthlyData.sundry_expenses.toString(),
        },
      }
    : undefined

  const capexInitialData = capexData
    ? {
        items: {
          icombi_ovens: capexData.icombi_ovens.toString(),
          seating_area_expansion: capexData.seating_area_expansion.toString(),
          aluminium_patio_seating: capexData.aluminium_patio_seating.toString(),
          airconditioning: capexData.airconditioning.toString(),
          art_soft_furnishings: capexData.art_soft_furnishings.toString(),
          landscaping_plants: capexData.landscaping_plants.toString(),
          training_consulting: capexData.training_consulting.toString(),
          cold_chain_facilities: capexData.cold_chain_facilities.toString(),
          refrigerators: capexData.refrigerators.toString(),
          building_improvements: capexData.building_improvements.toString(),
          outstanding_creditors: capexData.outstanding_creditors.toString(),
          st_faiths: capexData.st_faiths.toString(),
          wood_furniture_replacements: capexData.wood_furniture_replacements.toString(),
          legal_retainer: capexData.legal_retainer.toString(),
          licensing: capexData.licensing.toString(),
          curtains: capexData.curtains.toString(),
          bathroom_stalls: capexData.bathroom_stalls.toString(),
        },
      }
    : undefined

  const pastMonths = monthlyEntries.slice(0, 12)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold sm:text-2xl">Monthly Entry</h2>
        <p className="text-muted-foreground">
          Enter monthly expenses and CAPEX for the selected month.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <div className="min-w-0 flex-1 sm:w-40">
              <Select value={month.toString()} onValueChange={(v) => setMonth(parseInt(v, 10))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((name, i) => (
                    <SelectItem key={i} value={String(i + 1)}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-0 flex-1 sm:w-40">
              <Select value={year.toString()} onValueChange={(v) => setYear(parseInt(v, 10))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {loadingData ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <MonthlyExpenseForm
            month={month}
            year={year}
            initialData={monthlyInitialData}
            onSubmit={handleMonthlySubmit}
          />
          <CapexForm
            month={month}
            year={year}
            initialData={capexInitialData}
            onSubmit={handleCapexSubmit}
          />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Past Months</CardTitle>
        </CardHeader>
        <CardContent>
          {monthlyLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : pastMonths.length === 0 ? (
            <p className="text-sm text-muted-foreground">No entries yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Total Expenses</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pastMonths.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>{getMonthName(e.month)} {e.year}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(e.total_expenses)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
