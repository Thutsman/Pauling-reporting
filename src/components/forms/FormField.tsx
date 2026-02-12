import { useCallback, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { formatCurrencyInput, parseCurrencyInput } from '@/lib/formatters'

interface FormFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  readOnly?: boolean
  required?: boolean
  className?: string
}

export function FormField({
  id,
  label,
  value,
  onChange,
  error,
  readOnly = false,
  required = false,
  className,
}: FormFieldProps) {
  const [focused, setFocused] = useState(false)

  const handleFocus = useCallback(() => {
    setFocused(true)
    const num = parseCurrencyInput(value)
    onChange(num === 0 ? '' : num.toString())
  }, [value, onChange])

  const handleBlur = useCallback(() => {
    setFocused(false)
    const num = parseCurrencyInput(value)
    if (value !== '' || num !== 0) {
      onChange(num.toString())
    }
  }, [value, onChange])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9.]/g, '')
      const parts = raw.split('.')
      if (parts.length > 2) return
      if (parts[1]?.length > 2) return
      onChange(raw)
    },
    [onChange]
  )

  const displayValue = focused || readOnly
    ? value
    : value && !Number.isNaN(parseFloat(value))
      ? formatCurrencyInput(parseFloat(value))
      : value

  const numValue = parseCurrencyInput(value)
  const hasError = error !== undefined && error !== ''
  const invalidAmount = !readOnly && value !== '' && numValue < 0

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id} className={cn(required && 'after:content-["*"] after:ml-0.5 after:text-destructive')}>
        {label}
      </Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
        <Input
          id={id}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={readOnly}
          className={cn(
            'pl-7',
            (hasError || invalidAmount) && 'border-destructive',
            readOnly && 'bg-muted'
          )}
        />
      </div>
      {(error || invalidAmount) && (
        <p className="text-sm text-destructive">{error ?? 'Must be greater than or equal to 0'}</p>
      )}
    </div>
  )
}
