'use client'

import type { PhotoAngle } from '@/types/consultation'

interface CaptureGuideProps {
  angle: PhotoAngle
}

// Etiquetas de instrucción por ángulo
const INSTRUCCIONES: Record<PhotoAngle, string> = {
  frontal: 'Coloca el rostro de frente',
  lateral: 'Gira el rostro al lateral',
  trasera: 'Da la vuelta, parte trasera',
}

// Silueta frontal: óvalo vertical centrado representando la cabeza de frente
// Coordenadas en unidades del viewBox (0 0 100 100) — consistente con las demás siluetas
function SiluetaFrontal() {
  return (
    <g>
      {/* Cuello */}
      <rect x="46" y="61" width="8" height="10" rx="2"
        fill="none" stroke="#D4A854" strokeOpacity="0.4" strokeWidth="2" />
      {/* Cabeza — óvalo vertical */}
      <ellipse cx="50" cy="44" rx="18" ry="22"
        fill="none" stroke="#D4A854" strokeOpacity="0.4" strokeWidth="2" />
    </g>
  )
}

// Silueta lateral: perfil simple — arco trasero + frente con nariz
function SiluetaLateral() {
  return (
    <g>
      {/* Cuello lateral */}
      <path
        d="M 50% 67% L 50% 74% Q 53% 76% 57% 74%"
        fill="none" stroke="#D4A854" strokeOpacity="0.4" strokeWidth="2"
        strokeLinecap="round"
      />
      {/*
        Silueta de perfil: empezamos arriba (coronilla), bajamos por la frente,
        creamos una nariz pequeña, continuamos por el labio y barbilla,
        subimos por el cuello y cerramos por la parte trasera de la cabeza.
        Coordenadas en porcentaje del viewBox (0 0 100 100).
      */}
      <path
        d="
          M 50 22
          Q 44 23, 40 28
          Q 37 33, 37 40
          Q 37 46, 39 50
          Q 40 53, 41 54
          Q 39 55, 39 57
          L 40 60
          Q 42 63, 45 64
          Q 48 65, 50 64
          L 50 67
          M 50 22
          Q 54 22, 57 26
          Q 60 31, 60 38
          Q 60 46, 57 52
          Q 55 57, 52 62
          Q 51 64, 50 64
        "
        fill="none" stroke="#D4A854" strokeOpacity="0.4" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </g>
  )
}

// Silueta trasera: similar a la frontal pero con el contorno del cabello
function SiluetaTrasera() {
  return (
    <g>
      {/* Cuello */}
      <rect x="46%" y="61%" width="8%" height="10%" rx="2"
        fill="none" stroke="#D4A854" strokeOpacity="0.4" strokeWidth="2" />
      {/* Cabeza trasera — óvalo ligeramente más ancho arriba */}
      <path
        d="
          M 32 55
          Q 28 44, 28 40
          Q 28 22, 50 20
          Q 72 22, 72 40
          Q 72 44, 68 55
          Q 62 65, 50 66
          Q 38 65, 32 55
          Z
        "
        fill="none" stroke="#D4A854" strokeOpacity="0.4" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </g>
  )
}

function CaptureGuide({ angle }: CaptureGuideProps) {
  const instruccion = INSTRUCCIONES[angle]

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {/* Silueta según ángulo */}
        {angle === 'frontal' && <SiluetaFrontal />}
        {angle === 'lateral' && <SiluetaLateral />}
        {angle === 'trasera' && <SiluetaTrasera />}

        {/* Texto instrucción con sombra para legibilidad sobre cualquier fondo */}
        <text
          x="50%"
          y="88%"
          textAnchor="middle"
          fill="white"
          fontSize="4.5"
          fontFamily="var(--font-ui), DM Sans, system-ui, sans-serif"
          fontWeight="600"
          filter="url(#sombra-texto)"
        >
          {instruccion}
        </text>

        {/* Filtro de sombra para el texto */}
        <defs>
          <filter id="sombra-texto" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="black" floodOpacity="0.7" />
          </filter>
        </defs>
      </svg>
    </div>
  )
}

export { CaptureGuide }
export type { CaptureGuideProps }
