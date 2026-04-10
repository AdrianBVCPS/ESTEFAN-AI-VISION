/**
 * Tokens de la marca Estefan AI Vision
 * Colores, fuentes y utilidades visuales
 */

export const BRAND = {
  navy: '#1A1A2E',
  navyLight: '#2D2D3A',
  gold: '#D4A854',
  goldLight: '#E8C27A',
  cream: '#F5F0EB',
  white: '#FFFFFF',
  green: '#4ECDC4',
  darkOverlay: 'rgba(26, 26, 46, 0.85)',
} as const;

/** Fondo degradado navy principal */
export const navyGradient = `linear-gradient(135deg, #0D0D1A 0%, #1A1A2E 50%, #1A1820 100%)`;

/** Degradado dorado para textos o acentos */
export const goldGradient = `linear-gradient(135deg, #B8923E 0%, #D4A854 50%, #E8C27A 100%)`;

/** Estilos de texto comunes */
export const textStyles = {
  titleLarge: {
    fontFamily: '"Playfair Display", serif',
    fontWeight: 700,
    fontSize: 96,
    color: BRAND.white,
    lineHeight: 1.1,
  },
  titleMedium: {
    fontFamily: '"Playfair Display", serif',
    fontWeight: 700,
    fontSize: 64,
    color: BRAND.white,
    lineHeight: 1.2,
  },
  titleSmall: {
    fontFamily: '"Playfair Display", serif',
    fontWeight: 700,
    fontSize: 48,
    color: BRAND.white,
    lineHeight: 1.3,
  },
  bodyLarge: {
    fontFamily: '"DM Sans", sans-serif',
    fontWeight: 400,
    fontSize: 36,
    color: BRAND.cream,
    lineHeight: 1.5,
  },
  bodyMedium: {
    fontFamily: '"DM Sans", sans-serif',
    fontWeight: 400,
    fontSize: 28,
    color: BRAND.cream,
    lineHeight: 1.5,
  },
  label: {
    fontFamily: '"DM Sans", sans-serif',
    fontWeight: 600,
    fontSize: 22,
    color: BRAND.gold,
    letterSpacing: '0.15em',
    textTransform: 'uppercase' as const,
  },
  caption: {
    fontFamily: '"DM Sans", sans-serif',
    fontWeight: 400,
    fontSize: 20,
    color: 'rgba(245, 240, 235, 0.7)',
    lineHeight: 1.6,
  },
} as const;
