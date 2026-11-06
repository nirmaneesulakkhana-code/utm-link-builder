import type { ReactNode } from 'react'

interface FieldProps {
  id: string
  label: string
  required?: boolean
  hint?: ReactNode
  error?: string | null
  children: ReactNode
}

export function Field({ id, label, required, hint, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-gray-800">
        {label}
        {required ? <span className="ml-0.5 text-red-600">*</span> : <span className="ml-1.5 text-xs font-normal text-gray-400">Optional</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-gray-500">{hint}</p>
      ) : null}
    </div>
  )
}

export function inputClass(hasError?: boolean) {
  return [
    'w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400',
    'focus:outline-none focus:ring-2 focus:ring-blue-600/20',
    hasError ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-blue-600',
  ].join(' ')
}
