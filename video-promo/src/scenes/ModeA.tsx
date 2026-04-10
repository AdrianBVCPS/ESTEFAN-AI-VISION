import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import { Background } from '../components/Background';
import { BRAND, textStyles } from '../components/Brand';

/** Escena Modo A: La IA sugiere tu look */
export const ModeAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeSpring = spring({ frame: frame - 5, fps, config: { damping: 200 } });
  const titleSpring = spring({ frame: frame - 20, fps, config: { damping: 200 } });
  const card1Spring = spring({ frame: frame - 50, fps, config: { damping: 200 } });
  const card2Spring = spring({ frame: frame - 70, fps, config: { damping: 200 } });
  const scanSpring = spring({ frame: frame - 40, fps, config: { damping: 200 } });

  // Animación de escáner de IA
  const scanY = interpolate(frame, [40, 120], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scanOpacity = interpolate(frame, [40, 50, 100, 120], [0, 0.8, 0.8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <Background imageSrc={staticFile('generated/ai-face-scan.jpeg')} overlayOpacity={0.72} />

      <AbsoluteFill style={{ padding: '60px 100px' }}>
        {/* Badge modo */}
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
              background: `linear-gradient(135deg, rgba(212,168,84,0.2), rgba(212,168,84,0.1))`,
              border: `1px solid ${BRAND.gold}`,
              borderRadius: 40,
              padding: '8px 24px',
              ...textStyles.label,
              fontSize: 18,
            }}
          >
            <span>✦</span>
            Modo A · La IA sugiere
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
            La IA analiza tu rostro
            <br />
            <span
              style={{
                background: `linear-gradient(135deg, ${BRAND.gold}, ${BRAND.goldLight})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              y sugiere el corte ideal
            </span>
          </div>
        </div>

        {/* Panel de demostración */}
        <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>

          {/* Panel izquierdo: análisis facial */}
          <div
            style={{
              opacity: interpolate(scanSpring, [0, 1], [0, 1]),
              width: 380,
              flexShrink: 0,
            }}
          >
            {/* Simulación de pantalla de análisis */}
            <div
              style={{
                background: 'rgba(26, 26, 46, 0.8)',
                border: `1px solid rgba(212, 168, 84, 0.4)`,
                borderRadius: 16,
                padding: 24,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ ...textStyles.label, fontSize: 14, marginBottom: 16 }}>
                🔍 Análisis facial activo
              </div>

              {/* Grid de análisis simulado */}
              <div
                style={{
                  height: 200,
                  background: 'linear-gradient(135deg, rgba(212,168,84,0.05), rgba(78,205,196,0.05))',
                  borderRadius: 8,
                  border: '1px solid rgba(212, 168, 84, 0.2)',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gridTemplateRows: '1fr 1fr',
                  gap: 2,
                  position: 'relative',
                  marginBottom: 16,
                }}
              >
                {/* Líneas de escaneo */}
                <div
                  style={{
                    position: 'absolute',
                    top: `${scanY}%`,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: `linear-gradient(90deg, transparent, ${BRAND.gold}, transparent)`,
                    opacity: scanOpacity,
                    boxShadow: `0 0 8px ${BRAND.gold}`,
                  }}
                />
                {['Forma: Ovalado', 'Textura: Liso', 'Mandíbula: Angular', 'Frente: Media'].map((d, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '8px 12px',
                      ...textStyles.caption,
                      fontSize: 14,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span style={{ color: BRAND.gold, fontSize: 10 }}>●</span>
                    {d}
                  </div>
                ))}
              </div>

              <div style={{ ...textStyles.caption, fontSize: 14 }}>
                IA analizando proporciones y características...
              </div>
            </div>
          </div>

          {/* Panel derecho: resultados */}
          <div style={{ flex: 1, display: 'flex', gap: 24 }}>
            {/* Resultado 1 */}
            <div
              style={{
                opacity: interpolate(card1Spring, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(card1Spring, [0, 1], [40, 0])}px)`,
                flex: 1,
              }}
            >
              <div
                style={{
                  background: 'rgba(26, 26, 46, 0.85)',
                  border: `2px solid ${BRAND.gold}`,
                  borderRadius: 16,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: 200,
                    background: `linear-gradient(135deg, rgba(212,168,84,0.1), rgba(26,26,46,0.9))`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 64,
                  }}
                >
                  💈
                </div>
                <div style={{ padding: '16px 20px' }}>
                  <div
                    style={{
                      ...textStyles.label,
                      fontSize: 14,
                      marginBottom: 6,
                    }}
                  >
                    Opción A
                  </div>
                  <div style={{ ...textStyles.bodyMedium, fontSize: 20, marginBottom: 4 }}>
                    Fade Moderno
                  </div>
                  <div style={{ ...textStyles.caption, fontSize: 14 }}>
                    Favorece tu mandíbula angular
                  </div>
                </div>
              </div>
            </div>

            {/* Resultado 2 */}
            <div
              style={{
                opacity: interpolate(card2Spring, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(card2Spring, [0, 1], [40, 0])}px)`,
                flex: 1,
              }}
            >
              <div
                style={{
                  background: 'rgba(26, 26, 46, 0.7)',
                  border: `1px solid rgba(212, 168, 84, 0.4)`,
                  borderRadius: 16,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: 200,
                    background: `linear-gradient(135deg, rgba(78,205,196,0.1), rgba(26,26,46,0.9))`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 64,
                  }}
                >
                  ✂️
                </div>
                <div style={{ padding: '16px 20px' }}>
                  <div style={{ ...textStyles.label, fontSize: 14, marginBottom: 6, color: BRAND.green }}>
                    Opción B
                  </div>
                  <div style={{ ...textStyles.bodyMedium, fontSize: 20, marginBottom: 4 }}>
                    Texturizado Clásico
                  </div>
                  <div style={{ ...textStyles.caption, fontSize: 14 }}>
                    Realza tu frente media
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer con pasos */}
        <div style={{ marginTop: 32, display: 'flex', gap: 24, alignItems: 'center' }}>
          {['📸 3 fotos', '🤖 Análisis IA', '✨ 2 opciones', '⬇️ Descarga'].map((step, i) => (
            <div
              key={i}
              style={{
                opacity: interpolate(
                  spring({ frame: frame - (80 + i * 15), fps, config: { damping: 200 } }),
                  [0, 1], [0, 1]
                ),
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                ...textStyles.caption,
                fontSize: 20,
              }}
            >
              {i > 0 && <span style={{ color: BRAND.gold, opacity: 0.5 }}>→</span>}
              {step}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
