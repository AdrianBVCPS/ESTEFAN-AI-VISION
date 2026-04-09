interface ProgressBarProps {
  total: number
  current: number
  className?: string
}

function ProgressBar({ total, current, className = '' }: ProgressBarProps) {
  return (
    <div
      className={`flex gap-1 ${className}`}
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`Paso ${current} de ${total}`}
    >
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={[
            'flex-1 h-1 rounded-full',
            'transition-colors duration-300',
            i < current ? 'bg-gold' : 'bg-surface',
          ].join(' ')}
        />
      ))}
    </div>
  )
}

export { ProgressBar }
export type { ProgressBarProps }
