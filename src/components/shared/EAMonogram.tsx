interface EAMonogramProps {
  variant: 'watermark' | 'loading' | 'banner'
  size?: number
}

function EAMonogram({ variant, size = 40 }: EAMonogramProps) {
  if (variant === 'watermark') {
    return (
      <svg
        width={size}
        height={size * 0.6}
        viewBox="0 0 100 60"
        aria-hidden="true"
        style={{ display: 'block' }}
      >
        <text
          x="50%"
          y="90%"
          textAnchor="middle"
          fontFamily="var(--font-display), 'Playfair Display', serif"
          fontWeight="700"
          fontSize="56"
          fill="#1A1A2E"
          fillOpacity="0.05"
        >
          EA
        </text>
      </svg>
    )
  }

  if (variant === 'loading') {
    return (
      <svg
        width={size}
        height={size * 0.6}
        viewBox="0 0 100 60"
        aria-label="Estefan AI Vision"
      >
        <defs>
          <linearGradient id="shimmer-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D4A854" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#D4A854" stopOpacity="1" />
            <stop offset="100%" stopColor="#D4A854" stopOpacity="0.2" />
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              from="-1 0"
              to="1 0"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </linearGradient>
        </defs>
        <text
          x="50%"
          y="90%"
          textAnchor="middle"
          fontFamily="var(--font-display), 'Playfair Display', serif"
          fontWeight="700"
          fontSize="56"
          fill="url(#shimmer-grad)"
        >
          EA
        </text>
      </svg>
    )
  }

  /* variant === 'banner' */
  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 100 60"
      aria-label="EA"
    >
      <text
        x="50%"
        y="90%"
        textAnchor="middle"
        fontFamily="var(--font-display), 'Playfair Display', serif"
        fontWeight="700"
        fontSize="56"
        fill="#D4A854"
      >
        EA
      </text>
    </svg>
  )
}

export { EAMonogram }
export type { EAMonogramProps }
