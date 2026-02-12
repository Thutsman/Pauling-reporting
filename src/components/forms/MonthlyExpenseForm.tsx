import { useState } from 'react'
import { FormField } from './FormField'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { parseCurrencyInput } from '@/lib/formatters'
import { calculateTotalExpenses } from '@/lib/calculations'
import type { MonthlyFormState, MonthlyEntryInput } from '@/types/financial'
import { EXPENSE_FIELDS } from '@/lib/constants'

const initialFormState: MonthlyFormState = {
  month: null,
  year: null,
  wages: { cafe: '', hotel: '' },
  utilities: { gas: '', fuel: '', council_rates: '', electricity: '' },
  taxes: { payee: '', vat: '' },
  other_expenses: {
    packaging: '',
    detergents: '',
    stationery: '',
    marketing: '',
    staff_expenses: '',
    vehicle_maintenance: '',
    sundry: '',
  },
}

interface MonthlyExpenseFormProps {
  month: number
  year: number
  initialData?: Partial<MonthlyFormState>
  onSubmit: (data: MonthlyEntryInput) => Promise<void>
}

export function MonthlyExpenseForm({
  month,
  year,
  initialData,
  onSubmit,
}: MonthlyExpenseFormProps) {
  const [form, setForm] = useState<MonthlyFormState>(() => ({
    ...initialFormState,
    month,
    year,
    ...initialData,
  }))
  const [saving, setSaving] = useState(false)

  const totalWages =
    parseCurrencyInput(form.wages.cafe) + parseCurrencyInput(form.wages.hotel)
  const totalUtilities =
    parseCurrencyInput(form.utilities.gas) +
    parseCurrencyInput(form.utilities.fuel) +
    parseCurrencyInput(form.utilities.council_rates) +
    parseCurrencyInput(form.utilities.electricity)
  const totalTaxes =
    parseCurrencyInput(form.taxes.payee) + parseCurrencyInput(form.taxes.vat)
  const totalOther =
    parseCurrencyInput(form.other_expenses.packaging) +
    parseCurrencyInput(form.other_expenses.detergents) +
    parseCurrencyInput(form.other_expenses.stationery) +
    parseCurrencyInput(form.other_expenses.marketing) +
    parseCurrencyInput(form.other_expenses.staff_expenses) +
    parseCurrencyInput(form.other_expenses.vehicle_maintenance) +
    parseCurrencyInput(form.other_expenses.sundry)
  const totalExpenses = calculateTotalExpenses({
    wages_cafe: parseCurrencyInput(form.wages.cafe),
    wages_hotel: parseCurrencyInput(form.wages.hotel),
    gas: parseCurrencyInput(form.utilities.gas),
    fuel_vehicles_generator: parseCurrencyInput(form.utilities.fuel),
    council_rates_water: parseCurrencyInput(form.utilities.council_rates),
    electricity_zesa: parseCurrencyInput(form.utilities.electricity),
    payee: parseCurrencyInput(form.taxes.payee),
    vat_zimra: parseCurrencyInput(form.taxes.vat),
    packaging: parseCurrencyInput(form.other_expenses.packaging),
    detergents_cleaning: parseCurrencyInput(form.other_expenses.detergents),
    stationery: parseCurrencyInput(form.other_expenses.stationery),
    marketing: parseCurrencyInput(form.other_expenses.marketing),
    staff_expenses: parseCurrencyInput(form.other_expenses.staff_expenses),
    vehicle_maintenance: parseCurrencyInput(form.other_expenses.vehicle_maintenance),
    sundry_expenses: parseCurrencyInput(form.other_expenses.sundry),
  })

  const buildInput = (): MonthlyEntryInput => ({
    month,
    year,
    wages_cafe: parseCurrencyInput(form.wages.cafe),
    wages_hotel: parseCurrencyInput(form.wages.hotel),
    gas: parseCurrencyInput(form.utilities.gas),
    fuel_vehicles_generator: parseCurrencyInput(form.utilities.fuel),
    council_rates_water: parseCurrencyInput(form.utilities.council_rates),
    electricity_zesa: parseCurrencyInput(form.utilities.electricity),
    payee: parseCurrencyInput(form.taxes.payee),
    vat_zimra: parseCurrencyInput(form.taxes.vat),
    packaging: parseCurrencyInput(form.other_expenses.packaging),
    detergents_cleaning: parseCurrencyInput(form.other_expenses.detergents),
    stationery: parseCurrencyInput(form.other_expenses.stationery),
    marketing: parseCurrencyInput(form.other_expenses.marketing),
    staff_expenses: parseCurrencyInput(form.other_expenses.staff_expenses),
    vehicle_maintenance: parseCurrencyInput(form.other_expenses.vehicle_maintenance),
    sundry_expenses: parseCurrencyInput(form.other_expenses.sundry),
  })

  const handleSubmit = async () => {
    setSaving(true)
    try {
      await onSubmit(buildInput())
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expenses - {month}/{year}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="wages">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="wages">Wages</TabsTrigger>
            <TabsTrigger value="utilities">Utilities</TabsTrigger>
            <TabsTrigger value="taxes">Taxes</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>
          <TabsContent value="wages" className="space-y-4 pt-4">
            <FormField
              id="wages_cafe"
              label={EXPENSE_FIELDS.wages_cafe.label}
              value={form.wages.cafe}
              onChange={(v) =>
                setForm((prev) => ({
                  ...prev,
                  wages: { ...prev.wages, cafe: v },
                }))
              }
            />
            <FormField
              id="wages_hotel"
              label={EXPENSE_FIELDS.wages_hotel.label}
              value={form.wages.hotel}
              onChange={(v) =>
                setForm((prev) => ({
                  ...prev,
                  wages: { ...prev.wages, hotel: v },
                }))
              }
            />
            <FormField
              id="total_wages"
              label="Subtotal"
              value={totalWages.toString()}
              onChange={() => {}}
              readOnly
            />
          </TabsContent>
          <TabsContent value="utilities" className="space-y-4 pt-4">
            <FormField
              id="gas"
              label={EXPENSE_FIELDS.gas.label}
              value={form.utilities.gas}
              onChange={(v) =>
                setForm((prev) => ({
                  ...prev,
                  utilities: { ...prev.utilities, gas: v },
                }))
              }
            />
            <FormField
              id="fuel"
              label={EXPENSE_FIELDS.fuel_vehicles_generator.label}
              value={form.utilities.fuel}
              onChange={(v) =>
                setForm((prev) => ({
                  ...prev,
                  utilities: { ...prev.utilities, fuel: v },
                }))
              }
            />
            <FormField
              id="council_rates"
              label={EXPENSE_FIELDS.council_rates_water.label}
              value={form.utilities.council_rates}
              onChange={(v) =>
                setForm((prev) => ({
                  ...prev,
                  utilities: { ...prev.utilities, council_rates: v },
                }))
              }
            />
            <FormField
              id="electricity"
              label={EXPENSE_FIELDS.electricity_zesa.label}
              value={form.utilities.electricity}
              onChange={(v) =>
                setForm((prev) => ({
                  ...prev,
                  utilities: { ...prev.utilities, electricity: v },
                }))
              }
            />
            <FormField
              id="total_utilities"
              label="Subtotal"
              value={totalUtilities.toString()}
              onChange={() => {}}
              readOnly
            />
          </TabsContent>
          <TabsContent value="taxes" className="space-y-4 pt-4">
            <FormField
              id="payee"
              label={EXPENSE_FIELDS.payee.label}
              value={form.taxes.payee}
              onChange={(v) =>
                setForm((prev) => ({
                  ...prev,
                  taxes: { ...prev.taxes, payee: v },
                }))
              }
            />
            <FormField
              id="vat"
              label={EXPENSE_FIELDS.vat_zimra.label}
              value={form.taxes.vat}
              onChange={(v) =>
                setForm((prev) => ({
                  ...prev,
                  taxes: { ...prev.taxes, vat: v },
                }))
              }
            />
            <FormField
              id="total_taxes"
              label="Subtotal"
              value={totalTaxes.toString()}
              onChange={() => {}}
              readOnly
            />
          </TabsContent>
          <TabsContent value="other" className="space-y-4 pt-4">
            <FormField
              id="packaging"
              label={EXPENSE_FIELDS.packaging.label}
              value={form.other_expenses.packaging}
              onChange={(v) =>
                setForm((prev) => ({
                  ...prev,
                  other_expenses: { ...prev.other_expenses, packaging: v },
                }))
              }
            />
            <FormField
              id="detergents"
              label={EXPENSE_FIELDS.detergents_cleaning.label}
              value={form.other_expenses.detergents}
              onChange={(v) =>
                setForm((prev) => ({
                  ...prev,
                  other_expenses: { ...prev.other_expenses, detergents: v },
                }))
              }
            />
            <FormField
              id="stationery"
              label={EXPENSE_FIELDS.stationery.label}
              value={form.other_expenses.stationery}
              onChange={(v) =>
                setForm((prev) => ({
                  ...prev,
                  other_expenses: { ...prev.other_expenses, stationery: v },
                }))
              }
            />
            <FormField
              id="marketing"
              label={EXPENSE_FIELDS.marketing.label}
              value={form.other_expenses.marketing}
              onChange={(v) =>
                setForm((prev) => ({
                  ...prev,
                  other_expenses: { ...prev.other_expenses, marketing: v },
                }))
              }
            />
            <FormField
              id="staff_expenses"
              label={EXPENSE_FIELDS.staff_expenses.label}
              value={form.other_expenses.staff_expenses}
              onChange={(v) =>
                setForm((prev) => ({
                  ...prev,
                  other_expenses: { ...prev.other_expenses, staff_expenses: v },
                }))
              }
            />
            <FormField
              id="vehicle_maintenance"
              label={EXPENSE_FIELDS.vehicle_maintenance.label}
              value={form.other_expenses.vehicle_maintenance}
              onChange={(v) =>
                setForm((prev) => ({
                  ...prev,
                  other_expenses: { ...prev.other_expenses, vehicle_maintenance: v },
                }))
              }
            />
            <FormField
              id="sundry"
              label={EXPENSE_FIELDS.sundry_expenses.label}
              value={form.other_expenses.sundry}
              onChange={(v) =>
                setForm((prev) => ({
                  ...prev,
                  other_expenses: { ...prev.other_expenses, sundry: v },
                }))
              }
            />
            <FormField
              id="total_other"
              label="Subtotal"
              value={totalOther.toString()}
              onChange={() => {}}
              readOnly
            />
          </TabsContent>
        </Tabs>
        <div className="mt-6 border-t pt-4">
          <FormField
            id="total_expenses"
            label="Total Expenses"
            value={totalExpenses.toString()}
            onChange={() => {}}
            readOnly
          />
          <Button onClick={handleSubmit} disabled={saving} className="mt-4">
            {saving ? 'Saving...' : 'Save Monthly Expenses'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
