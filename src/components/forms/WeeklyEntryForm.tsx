import { useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormField } from './FormField'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { getWeekRange, getWeekNumber, formatDateISO } from '@/lib/dateUtils'
import { parseCurrencyInput } from '@/lib/formatters'
import {
  calculateTotalRevenue,
  calculateTotalCOGS,
  calculateCOGSPercentage,
  calculateGrossProfit,
} from '@/lib/calculations'
import type { WeeklyFormState, WeeklyEntryInput } from '@/types/financial'
import { REVENUE_FIELDS, COGS_FIELDS } from '@/lib/constants'

const initialFormState: WeeklyFormState = {
  week_start_date: null,
  week_end_date: null,
  revenue: {
    bowery_cafe: '',
    hotel: '',
    car_hire: '',
  },
  cogs: {
    meats: '',
    liquor: '',
    beverages_and_mixes: '',
    dairy_products: '',
    condiments: '',
    vegetables_and_fruits: '',
    starches_and_grains: '',
    cereal_and_nuts: '',
    baking_ingredients: '',
    booking_com_commission: '',
  },
}

interface WeeklyEntryFormProps {
  initialData?: Partial<WeeklyFormState> & { id?: string }
  onSubmit: (data: WeeklyEntryInput, status: 'draft' | 'submitted') => Promise<void>
}

export function WeeklyEntryForm({
  initialData,
  onSubmit,
}: WeeklyEntryFormProps) {
  const [form, setForm] = useState<WeeklyFormState>(() => ({
    ...initialFormState,
    ...initialData,
  }))
  const [saving, setSaving] = useState(false)

  const weekStart = form.week_start_date
  const { end } = weekStart ? getWeekRange(weekStart) : { end: null }

  const totalRevenue = calculateTotalRevenue(
    parseCurrencyInput(form.revenue.bowery_cafe),
    parseCurrencyInput(form.revenue.hotel),
    parseCurrencyInput(form.revenue.car_hire)
  )
  const totalCOGS = calculateTotalCOGS({
    meats: parseCurrencyInput(form.cogs.meats),
    liquor: parseCurrencyInput(form.cogs.liquor),
    beverages_and_mixes: parseCurrencyInput(form.cogs.beverages_and_mixes),
    dairy_products: parseCurrencyInput(form.cogs.dairy_products),
    condiments: parseCurrencyInput(form.cogs.condiments),
    vegetables_and_fruits: parseCurrencyInput(form.cogs.vegetables_and_fruits),
    starches_and_grains: parseCurrencyInput(form.cogs.starches_and_grains),
    cereal_and_nuts: parseCurrencyInput(form.cogs.cereal_and_nuts),
    baking_ingredients: parseCurrencyInput(form.cogs.baking_ingredients),
    booking_com_commission: parseCurrencyInput(form.cogs.booking_com_commission),
  })
  const cogsPercentage = calculateCOGSPercentage(totalCOGS, totalRevenue)
  const grossProfit = calculateGrossProfit(totalRevenue, totalCOGS)

  const updateRevenue = (key: keyof WeeklyFormState['revenue'], value: string) => {
    setForm((prev) => ({
      ...prev,
      revenue: { ...prev.revenue, [key]: value },
    }))
  }

  const updateCogs = (key: keyof WeeklyFormState['cogs'], value: string) => {
    setForm((prev) => ({
      ...prev,
      cogs: { ...prev.cogs, [key]: value },
    }))
  }

  const handleWeekSelect = (date: Date | undefined) => {
    if (!date) return
    const { start: s, end: e } = getWeekRange(date)
    setForm((prev) => ({
      ...prev,
      week_start_date: s,
      week_end_date: e,
    }))
  }

  const buildInput = (): WeeklyEntryInput | null => {
    if (!weekStart || !end) return null
    return {
      week_start_date: formatDateISO(weekStart),
      week_end_date: formatDateISO(end),
      bowery_cafe_revenue: parseCurrencyInput(form.revenue.bowery_cafe),
      hotel_revenue: parseCurrencyInput(form.revenue.hotel),
      car_hire_revenue: parseCurrencyInput(form.revenue.car_hire),
      meats: parseCurrencyInput(form.cogs.meats),
      liquor: parseCurrencyInput(form.cogs.liquor),
      beverages_and_mixes: parseCurrencyInput(form.cogs.beverages_and_mixes),
      dairy_products: parseCurrencyInput(form.cogs.dairy_products),
      condiments: parseCurrencyInput(form.cogs.condiments),
      vegetables_and_fruits: parseCurrencyInput(form.cogs.vegetables_and_fruits),
      starches_and_grains: parseCurrencyInput(form.cogs.starches_and_grains),
      cereal_and_nuts: parseCurrencyInput(form.cogs.cereal_and_nuts),
      baking_ingredients: parseCurrencyInput(form.cogs.baking_ingredients),
      booking_com_commission: parseCurrencyInput(form.cogs.booking_com_commission),
    }
  }

  const isValid = weekStart !== null && end !== null

  const handleSubmit = async (status: 'draft' | 'submitted') => {
    const input = buildInput()
    if (!input) return
    setSaving(true)
    try {
      await onSubmit(input, status)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Week Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !weekStart && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {weekStart && end
                  ? `${format(weekStart, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')} (Week ${getWeekNumber(weekStart)})`
                  : 'Select week start date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                value={weekStart ?? undefined}
                onChange={handleWeekSelect}
              />
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            id="bowery_cafe"
            label={REVENUE_FIELDS.bowery_cafe_revenue.label}
            value={form.revenue.bowery_cafe}
            onChange={(v) => updateRevenue('bowery_cafe', v)}
          />
          <FormField
            id="hotel"
            label={REVENUE_FIELDS.hotel_revenue.label}
            value={form.revenue.hotel}
            onChange={(v) => updateRevenue('hotel', v)}
          />
          <FormField
            id="car_hire"
            label={REVENUE_FIELDS.car_hire_revenue.label}
            value={form.revenue.car_hire}
            onChange={(v) => updateRevenue('car_hire', v)}
          />
          <FormField
            id="total_revenue"
            label="Total Revenue"
            value={totalRevenue.toString()}
            onChange={() => {}}
            readOnly
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>COGS & Inventory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(Object.keys(COGS_FIELDS) as Array<keyof typeof COGS_FIELDS>).map((key) => {
            const cogsKey = key as keyof WeeklyFormState['cogs']
            return (
              <FormField
                key={key}
                id={key}
                label={COGS_FIELDS[key].label}
                value={form.cogs[cogsKey]}
                onChange={(v) => updateCogs(cogsKey, v)}
              />
            )
          })}
          <FormField
            id="total_cogs"
            label="Total COGS"
            value={totalCOGS.toString()}
            onChange={() => {}}
            readOnly
          />
          <FormField
            id="cogs_percentage"
            label="COGS % of Revenue"
            value={cogsPercentage.toString()}
            onChange={() => {}}
            readOnly
          />
          <FormField
            id="gross_profit"
            label="Gross Profit"
            value={grossProfit.toString()}
            onChange={() => {}}
            readOnly
          />
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button
          onClick={() => handleSubmit('draft')}
          disabled={!isValid || saving}
          variant="outline"
        >
          {saving ? 'Saving...' : 'Save Draft'}
        </Button>
        <Button
          onClick={() => handleSubmit('submitted')}
          disabled={!isValid || saving}
        >
          {saving ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </div>
  )
}
