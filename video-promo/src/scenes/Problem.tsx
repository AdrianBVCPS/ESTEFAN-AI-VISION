import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import { Background } from '../components/Background';
import { BRAND, textStyles } from '../components/Brand';

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelSpring = spring({ frame: frame - 5, fps, config: { damping: 200 } });
  const labelY = interpolate(labelSpring, [0, 1], [-30, 0]);
  const labelOpacity = interpolate(labelSpring, [0, 1], [0, 1]);

  const questionSpring = spring({ frame: frame - 20, fps, config: { damping: 200 } });
  const questionY = interpolate(questionSpring, [0, 1], [50, 0]);
  const questionOpacity = interpolate(questionSpring, [0, 1], [0, 1]);

  const iconSpring = spring({ frame: frame - 40, fps, config: { damping: 20, stiffness: 200 } });
  const iconScale = interpolate(iconSpring, [0, 1], [0, 1]);

  const subSpring = spring({ frame: frame - 70, fps, config: { damping: 200 } });
  const subOpacity = interpolate(subSpring, [0, 1], [0, 1]);
  const subY = interpolate(subSpring, [0, 1], [30, 0]);

  // Puntos de dolor aparecen secuencialmente
  const pain1Spring = spring({ frame: frame - 80, fps, config: { damping: 200 } });
  const pain2Spring = spring({ frame: frame - 95, fps, config: { damping: 200 } });
  const pain3Spring = spring({ frame: frame - 110, fps, config: { damping: 200 } });

  const painPoints = [
    { text: '"No sé si me quedará bien..."', spring: pain1Spring },
    { text: '"Y si me corto demasiado?"', spring: pain2Spring },
    { text: '"¿Cómo se lo explico al barbero?"', spring: pain3Spring },
  ];

  return (
    <AbsoluteFill>
      <Background videoSrc="generated/videos/barbershop-cinematic.mp4" overlayOpacity={0.82} />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 160px',
        }}
      >
        {/* Etiqueta superior */}
        <div
          style={{
            transform: `translateY(${labelY}px)`,
            opacity: labelOpacity,
            marginBottom: 32,
          }}
        >
          <div style={{ ...textStyles.label }}>El problema de siempre</div>
        </div>

        {/* Pregunta principal */}
        <div
          style={{
            transform: `translateY(${questionY}px)`,
            opacity: questionOpacity,
            textAlign: 'center',
            marginBottom: 48,
          }}
        >
          <div
            style={{
              ...textStyles.titleMedium,
              fontSize: 72,
              lineHeight: 1.15,
            }}
          >
            ¿Cómo te quedará{' '}
            <span
              style={{
                background: `linear-gradient(135deg, ${BRAND.gold}, ${BRAND.goldLight})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              el corte?
            </span>
          </div>
        </div>

        {/* Icono de interrogación animado */}
        <div
          style={{
            transform: `scale(${iconScale})`,
            fontSize: 80,
            marginBottom: 48,
          }}
        >
          🤔
        </div>

        {/* Sub-dudas de los clientes */}
        <div
          style={{
            transform: `translateY(${subY}px)`,
            opacity: subOpacity,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            alignItems: 'center',
          }}
        >
          {painPoints.map((p, i) => (
            <div
              key={i}
              style={{
                opacity: interpolate(p.spring, [0, 1], [0, 1]),
                transform: `translateX(${interpolate(p.spring, [0, 1], [-40, 0])}px)`,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(212, 168, 84, 0.2)',
                borderRadius: 12,
                padding: '14px 28px',
                ...textStyles.bodyMedium,
                fontSize: 26,
                color: 'rgba(245, 240, 235, 0.85)',
                fontStyle: 'italic',
              }}
            >
              {p.text}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
