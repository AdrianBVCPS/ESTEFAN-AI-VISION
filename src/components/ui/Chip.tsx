'use client'

interface ChipProps {
  label: string
  selected: boolean
  onClick: () => void
}

function Chip({ label, selected, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'inline-flex items-center justify-center',
        'min-h-[44px] px-4',
        'rounded-[22px]',
        'font-ui text-sm',
        'transition-colors duration-150',
        'select-none cursor-pointer',
        'active:scale-[0.97] transition-transform',
        selected
          ? 'bg-gold text-navy font-bold'
          : 'bg-surface text-text-secondary font-normal',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

export { Chip }
export type { ChipProps }
