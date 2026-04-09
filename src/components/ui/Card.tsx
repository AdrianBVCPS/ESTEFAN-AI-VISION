import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  variant?: 'default' | 'ai'
  className?: string
}

function Card({ children, variant = 'default', className = '' }: CardProps) {
  return (
    <div
      className={[
        'relative overflow-hidden',
        'bg-surface',
        'rounded-xl',
        className,
      ].join(' ')}
      style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
    >
      {children}

      {/* Watermark EA — solo en variante ai */}
      {variant === 'ai' && (
        <span
          aria-hidden="true"
          className="absolute bottom-2 right-3 font-display font-bold select-none pointer-events-none leading-none"
          style={{
            fontSize: 80,
            color: '#1A1A2E',
            opacity: 0.05,
            lineHeight: 1,
          }}
        >
          EA
        </span>
      )}
    </div>
  )
}

export { Card }
export type { CardProps }
