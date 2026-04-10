import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Background } from '../components/Background';
import { GoldParticles } from '../components/GoldParticles';
import { BRAND, textStyles } from '../components/Brand';

export const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Flash de revelación al inicio
  const flashOpacity = interpolate(frame, [0, 8, 20], [1, 0.3, 0], {
    extrapolateRight: 'clamp',
  });

  const labelSpring = spring({ frame: frame - 10, fps, config: { damping: 200 } });
  const labelOpacity = interpolate(labelSpring, [0, 1], [0, 1]);

  const mainSpring = spring({ frame: frame - 20, fps, config: { damping: 200 } });
  const mainScale = interpolate(mainSpring, [0, 1], [0.85, 1]);
  const mainOpacity = interpolate(mainSpring, [0, 1], [0, 1]);

  const subSpring = spring({ frame: frame - 50, fps, config: { damping: 200 } });
  const subOpacity = interpolate(subSpring, [0, 1], [0, 1]);
  const subY = interpolate(subSpring, [0, 1], [30, 0]);

  // Glow dorado que pulsa
  const glow = interpolate(
    Math.sin((frame / fps) * Math.PI * 1.5),
    [-1, 1],
    [20, 50]
  );

  return (
    <AbsoluteFill>
      <Background overlayOpacity={0} />
      <GoldParticles intensity={1.2} />

      {/* Flash de entrada */}
      <AbsoluteFill
        style={{
          background: 'white',
          opacity: flashOpacity,
          pointerEvents: 'none',
        }}
      />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          padding: '0 160px',
          textAlign: 'center',
        }}
      >
        {/* Etiqueta */}
        <div style={{ opacity: labelOpacity }}>
          <div style={{ ...textStyles.label }}>La solución</div>
        </div>

        {/* Texto principal con glow dorado */}
        <div
          style={{
            transform: `scale(${mainScale})`,
            opacity: mainOpacity,
          }}
        >
          <div
            style={{
              ...textStyles.titleLarge,
              fontSize: 80,
              textShadow: `0 0 ${glow}px rgba(212, 168, 84, 0.5)`,
              lineHeight: 1.15,
            }}
          >
            Visualiza tu look{' '}
            <br />
            <span
              style={{
                background: `linear-gradient(135deg, ${BRAND.gold} 0%, ${BRAND.goldLight} 50%, #FFF 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              antes de cortarte
            </span>
          </div>
        </div>

        {/* Subtítulo */}
        <div
          style={{
            transform: `translateY(${subY}px)`,
            opacity: subOpacity,
          }}
        >
          <div style={{ ...textStyles.bodyLarge, maxWidth: 800 }}>
            Inteligencia artificial que analiza tu rostro y genera imágenes
            fotorrealistas del resultado final
          </div>
        </div>

        {/* Indicador visual */}
        <div
          style={{
            opacity: subOpacity,
            marginTop: 16,
            display: 'flex',
            gap: 32,
            alignItems: 'center',
          }}
        >
          {['Análisis facial', 'IA generativa', 'Fotorrealismo 3D'].map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                ...textStyles.caption,
                fontSize: 22,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: BRAND.gold,
                  boxShadow: `0 0 8px ${BRAND.gold}`,
                }}
              />
              {item}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
