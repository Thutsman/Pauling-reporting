import { useState } from 'react'
import { FormField } from './FormField'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { parseCurrencyInput } from '@/lib/formatters'
import type { CapexFormState, CapexEntryInput } from '@/types/financial'
import { CAPEX_FIELDS } from '@/lib/constants'

const CAPEX_KEYS: (keyof CapexFormState['items'])[] = [
  'icombi_ovens',
  'seating_area_expansion',
  'aluminium_patio_seating',
  'airconditioning',
  'art_soft_furnishings',
  'landscaping_plants',
  'training_consulting',
  'cold_chain_facilities',
  'refrigerators',
  'building_improvements',
  'outstanding_creditors',
  'st_faiths',
  'wood_furniture_replacements',
  'legal_retainer',
  'licensing',
  'curtains',
  'bathroom_stalls',
]

const initialItems: CapexFormState['items'] = {
  icombi_ovens: '',
  seating_area_expansion: '',
  aluminium_patio_seating: '',
  airconditioning: '',
  art_soft_furnishings: '',
  landscaping_plants: '',
  training_consulting: '',
  cold_chain_facilities: '',
  refrigerators: '',
  building_improvements: '',
  outstanding_creditors: '',
  st_faiths: '',
  wood_furniture_replacements: '',
  legal_retainer: '',
  licensing: '',
  curtains: '',
  bathroom_stalls: '',
}

interface CapexFormProps {
  month: number
  year: number
  initialData?: Partial<CapexFormState>
  onSubmit: (data: CapexEntryInput) => Promise<void>
}

export function CapexForm({
  month,
  year,
  initialData,
  onSubmit,
}: CapexFormProps) {
  const [form, setForm] = useState<CapexFormState>(() => ({
    month,
    year,
    items: { ...initialItems, ...initialData?.items },
  }))
  const [saving, setSaving] = useState(false)

  const totalCapex = CAPEX_KEYS.reduce(
    (sum, key) => sum + parseCurrencyInput(form.items[key]),
    0
  )

  const buildInput = (): CapexEntryInput => ({
    month,
    year,
    icombi_ovens: parseCurrencyInput(form.items.icombi_ovens),
    seating_area_expansion: parseCurrencyInput(form.items.seating_area_expansion),
    aluminium_patio_seating: parseCurrencyInput(form.items.aluminium_patio_seating),
    airconditioning: parseCurrencyInput(form.items.airconditioning),
    art_soft_furnishings: parseCurrencyInput(form.items.art_soft_furnishings),
    landscaping_plants: parseCurrencyInput(form.items.landscaping_plants),
    training_consulting: parseCurrencyInput(form.items.training_consulting),
    cold_chain_facilities: parseCurrencyInput(form.items.cold_chain_facilities),
    refrigerators: parseCurrencyInput(form.items.refrigerators),
    building_improvements: parseCurrencyInput(form.items.building_improvements),
    outstanding_creditors: parseCurrencyInput(form.items.outstanding_creditors),
    st_faiths: parseCurrencyInput(form.items.st_faiths),
    wood_furniture_replacements: parseCurrencyInput(form.items.wood_furniture_replacements),
    legal_retainer: parseCurrencyInput(form.items.legal_retainer),
    licensing: parseCurrencyInput(form.items.licensing),
    curtains: parseCurrencyInput(form.items.curtains),
    bathroom_stalls: parseCurrencyInput(form.items.bathroom_stalls),
  })

  const handleSubmit = async () => {
    setSaving(true)
    try {
      await onSubmit(buildInput())
    } finally {
      setSaving(false)
    }
  }

  const updateItem = (key: keyof CapexFormState['items'], value: string) => {
    setForm((prev) => ({
      ...prev,
      items: { ...prev.items, [key]: value },
    }))
  }

  const byCategory = CAPEX_KEYS.reduce(
    (acc, key) => {
      const cat = CAPEX_FIELDS[key].category
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(key)
      return acc
    },
    {} as Record<string, (keyof CapexFormState['items'])[]>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>CAPEX - {month}/{year}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(byCategory).map(([category, keys]) => (
          <div key={category}>
            <h4 className="mb-3 text-sm font-medium text-muted-foreground">
              {category}
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              {keys.map((key) => (
                <FormField
                  key={key}
                  id={key}
                  label={CAPEX_FIELDS[key].label}
                  value={form.items[key]}
                  onChange={(v) => updateItem(key, v)}
                />
              ))}
            </div>
          </div>
        ))}
        <div className="border-t pt-4">
          <FormField
            id="total_capex"
            label="Total CAPEX"
            value={totalCapex.toString()}
            onChange={() => {}}
            readOnly
          />
          <Button onClick={handleSubmit} disabled={saving} className="mt-4">
            {saving ? 'Saving...' : 'Save CAPEX'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
