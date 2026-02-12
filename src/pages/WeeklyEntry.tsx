import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useWeeklyData } from '@/hooks/useWeeklyData'
import { WeeklyEntryForm } from '@/components/forms/WeeklyEntryForm'
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
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency } from '@/lib/formatters'
import { formatWeekLabel } from '@/lib/dateUtils'
import type { WeeklyFormState } from '@/types/financial'

export function WeeklyEntry() {
  const { id } = useParams()
  const { create, update, getById, recentEntries, loading } = useWeeklyData()
  const { toast } = useToast()
  const [initialData, setInitialData] = useState<Partial<WeeklyFormState> & { id?: string } | null>(null)
  const [loadingEntry, setLoadingEntry] = useState(!!id)

  useEffect(() => {
    if (!id) {
      setInitialData(null)
      setLoadingEntry(false)
      return
    }
    let cancelled = false
    getById(id).then((entry) => {
      if (cancelled || !entry) return
      setInitialData({
        id: entry.id,
        week_start_date: new Date(entry.week_start_date),
        week_end_date: new Date(entry.week_end_date),
        revenue: {
          bowery_cafe: entry.bowery_cafe_revenue.toString(),
          hotel: entry.hotel_revenue.toString(),
          car_hire: entry.car_hire_revenue.toString(),
        },
        cogs: {
          meats: entry.meats.toString(),
          liquor: entry.liquor.toString(),
          beverages_and_mixes: entry.beverages_and_mixes.toString(),
          dairy_products: entry.dairy_products.toString(),
          condiments: entry.condiments.toString(),
          vegetables_and_fruits: entry.vegetables_and_fruits.toString(),
          starches_and_grains: entry.starches_and_grains.toString(),
          cereal_and_nuts: entry.cereal_and_nuts.toString(),
          baking_ingredients: entry.baking_ingredients.toString(),
          booking_com_commission: entry.booking_com_commission.toString(),
        },
      })
    }).finally(() => {
      if (!cancelled) setLoadingEntry(false)
    })
    return () => { cancelled = true }
  }, [id, getById])

  const handleSubmit = async (
    data: Parameters<typeof create>[0],
    status: 'draft' | 'submitted'
  ) => {
    try {
      if (id) {
        await update(id, data, status)
        toast({ title: 'Entry updated successfully', variant: 'default' })
      } else {
        await create(data, status)
        toast({ title: 'Entry saved successfully', variant: 'default' })
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to save',
        variant: 'destructive',
      })
      throw err
    }
  }

  if (loadingEntry) {
    return <Skeleton className="h-96 w-full" />
  }

  return (
    <div className="min-w-0 space-y-6">
      <div>
        <h2 className="text-xl font-bold sm:text-2xl">
          {id ? 'Edit Weekly Entry' : 'New Weekly Entry'}
        </h2>
        <p className="text-muted-foreground">
          Enter revenue and COGS data for the selected week.
        </p>
      </div>

      <WeeklyEntryForm
        initialData={initialData ?? undefined}
        onSubmit={handleSubmit}
      />

      <Card>
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
          <p className="text-sm text-muted-foreground">
            Last 8 weeks of entries
          </p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-48 w-full" />
          ) : recentEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground">No entries yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Week</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">COGS</TableHead>
                  <TableHead className="text-right">Gross Profit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {formatWeekLabel(entry.week_number, entry.week_start_date)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(entry.total_revenue)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(entry.total_cogs)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(entry.gross_profit)}
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">{entry.status}</span>
                    </TableCell>
                    <TableCell>
                      <Button variant="link" size="sm" asChild>
                        <Link to={`/weekly-entry/${entry.id}`}>Edit</Link>
                      </Button>
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
