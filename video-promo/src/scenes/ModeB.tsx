import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import { Background } from '../components/Background';
import { Typewriter } from '../components/AnimatedText';
import { BRAND, textStyles } from '../components/Brand';

/** Escena Modo B: Prueba cualquier corte */
export const ModeBScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeSpring = spring({ frame: frame - 5, fps, config: { damping: 200 } });
  const titleSpring = spring({ frame: frame - 20, fps, config: { damping: 200 } });
  const inputSpring = spring({ frame: frame - 45, fps, config: { damping: 200 } });
  const resultSpring = spring({ frame: frame - 80, fps, config: { damping: 200 } });

  const descriptionText = 'modern mullet con degradado bajo y barba perfilada';

  return (
    <AbsoluteFill>
      <Background videoSrc="generated/videos/barber-scissors.mp4" imageSrc={staticFile('generated/barber-tablet.jpeg')} overlayOpacity={0.78} />

      <AbsoluteFill style={{ padding: '60px 100px' }}>
        {/* Badge */}
        <div
          style={{
            opacity: interpolate(badgeSpring, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(badgeSpring, [0, 1], [-20, 0])}px)`,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: `linear-gradient(135deg, rgba(78,205,196,0.2), rgba(78,205,196,0.1))`,
              border: `1px solid ${BRAND.green}`,
              borderRadius: 40,
              padding: '8px 24px',
              ...textStyles.label,
              fontSize: 18,
              color: BRAND.green,
            }}
          >
            <span>⚡</span>
            Modo B · Prueba un corte
          </div>
        </div>

        {/* Título */}
        <div
          style={{
            opacity: interpolate(titleSpring, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(titleSpring, [0, 1], [30, 0])}px)`,
            marginBottom: 48,
          }}
        >
          <div style={{ ...textStyles.titleMedium, fontSize: 60, lineHeight: 1.2 }}>
            Describe el corte{' '}
            <br />
            <span
              style={{
                background: `linear-gradient(135deg, ${BRAND.green}, #6EDDDA)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              que tienes en mente
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 60, alignItems: 'flex-start' }}>
          {/* Input del barbero */}
          <div
            style={{
              opacity: interpolate(inputSpring, [0, 1], [0, 1]),
              transform: `translateX(${interpolate(inputSpring, [0, 1], [-40, 0])}px)`,
              flex: 1,
            }}
          >
            <div style={{ ...textStyles.label, fontSize: 16, marginBottom: 12 }}>
              💬 El barbero escribe:
            </div>

            {/* Simulación de input */}
            <div
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: `2px solid ${BRAND.green}`,
                borderRadius: 12,
                padding: '20px 24px',
                marginBottom: 24,
                boxShadow: `0 0 20px rgba(78, 205, 196, 0.2)`,
              }}
            >
              <Typewriter
                text={descriptionText}
                startFrame={50}
                charsPerFrame={1.5}
                style={{
                  ...textStyles.bodyLarge,
                  fontSize: 28,
                  color: BRAND.white,
                  fontStyle: 'italic',
                }}
              />
            </div>

            {/* Botón de generar */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                background: `linear-gradient(135deg, ${BRAND.green}, #3BB8B4)`,
                borderRadius: 12,
                padding: '16px 32px',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: 24 }}>🪄</span>
              <span style={{ ...textStyles.bodyMedium, fontSize: 24, color: BRAND.navy, fontWeight: 700 }}>
                Generar visualización
              </span>
            </div>

            {/* Stats */}
            <div style={{ marginTop: 24, ...textStyles.caption, fontSize: 20 }}>
              ⚡ Resultado en ~15 segundos · Sin repetir fotos
            </div>
          </div>

          {/* Resultado visual */}
          <div
            style={{
              opacity: interpolate(resultSpring, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(resultSpring, [0, 1], [40, 0])}px)`,
              width: 400,
              flexShrink: 0,
            }}
          >
            <div style={{ ...textStyles.label, fontSize: 16, marginBottom: 12 }}>
              ✨ Resultado generado:
            </div>

            {/* Mockup de resultado */}
            <div
              style={{
                background: 'rgba(26, 26, 46, 0.85)',
                border: `2px solid ${BRAND.green}`,
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: `0 0 30px rgba(78, 205, 196, 0.25)`,
              }}
            >
              {/* Vista de 3 ángulos */}
              <div
                style={{
                  height: 220,
                  background: `linear-gradient(135deg, rgba(78,205,196,0.1) 0%, rgba(26,26,46,0.9) 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 16,
                  padding: 20,
                }}
              >
                {['👤 Frontal', '👤 Lateral', '👤 Trasera'].map((angle, i) => (
                  <div
                    key={i}
                    style={{
                      width: 100,
                      height: 120,
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: 8,
                      border: '1px solid rgba(78,205,196,0.3)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      fontSize: 24,
                    }}
                  >
                    <span>👤</span>
                    <span style={{ ...textStyles.caption, fontSize: 10 }}>
                      {['Frontal', 'Lateral', 'Trasera'][i]}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ padding: '12px 20px' }}>
                <div style={{ ...textStyles.bodyMedium, fontSize: 18, marginBottom: 4 }}>
                  Modern Mullet + Degradado
                </div>
                <div style={{ ...textStyles.caption, fontSize: 14 }}>
                  Imagen fotorrealista · Descargable con logo
                </div>
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
