'use client'

import { InputHTMLAttributes, useId } from 'react'
import { AlertCircle } from 'lucide-react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  /** Si se omite, se genera un id automático */
  id?: string
}

function Input({ label, error, id: idProp, className = '', ...props }: InputProps) {
  const generatedId = useId()
  const id = idProp ?? generatedId

  return (
    <div className={`relative w-full ${className}`}>
      {/* Campo */}
      <div className="relative">
        <input
          id={id}
          placeholder=" "
          className={[
            'peer w-full min-h-[56px] pt-5 pb-2 px-4',
            'bg-surface',
            'font-ui text-base text-text-primary',
            'outline-none',
            'border-b-2 transition-colors duration-150',
            error
              ? 'border-error'
              : 'border-transparent focus:border-gold focus:bg-background',
            'rounded-t-lg',
          ].join(' ')}
          {...props}
        />

        {/* Label flotante */}
        <label
          htmlFor={id}
          className={[
            'absolute left-4 top-4',
            'font-ui text-base text-text-secondary',
            'pointer-events-none',
            'transition-all duration-150 origin-left',
            /* Cuando peer tiene valor o está en foco: sube y encoge */
            'peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100',
            'peer-focus:-translate-y-2.5 peer-focus:scale-75',
            'peer-[&:not(:placeholder-shown)]:-translate-y-2.5 peer-[&:not(:placeholder-shown)]:scale-75',
            error ? 'text-error' : 'peer-focus:text-gold',
          ].join(' ')}
        >
          {label}
        </label>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="flex items-center gap-1.5 mt-1 px-4">
          <AlertCircle size={14} className="text-error shrink-0" strokeWidth={1.5} />
          <span className="font-ui text-sm text-error">{error}</span>
        </div>
      )}
    </div>
  )
}

export { Input }
export type { InputProps }
