import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Background } from '../components/Background';
import { BRAND, textStyles } from '../components/Brand';

export const PrivacyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame: frame - 10, fps, config: { damping: 200 } });

  const features = [
    { icon: '🚫', text: 'Fotos NUNCA almacenadas en servidor', delay: 30 },
    { icon: '💾', text: 'Todo vive en memoria local · Se destruye automáticamente', delay: 50 },
    { icon: '⚖️', text: 'Cumple GDPR y LOPDGDD', delay: 70 },
    { icon: '🛡️', text: 'API key Gemini protegida en servidor', delay: 90 },
  ];

  // Escudo animado
  const shieldSpring = spring({ frame: frame - 20, fps, config: { damping: 20, stiffness: 150 } });
  const shieldScale = interpolate(shieldSpring, [0, 1], [0, 1]);
  const shieldRotate = interpolate(shieldSpring, [0, 1], [-15, 0]);

  // Pulso del escudo
  const shieldGlow = interpolate(
    Math.sin((frame / fps) * Math.PI * 2),
    [-1, 1],
    [10, 30]
  );

  return (
    <AbsoluteFill>
      <Background overlayOpacity={0} />

      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 100px',
          gap: 80,
        }}
      >
        {/* Escudo de privacidad */}
        <div
          style={{
            transform: `scale(${shieldScale}) rotate(${shieldRotate}deg)`,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 240,
              height: 280,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: `radial-gradient(circle at center, rgba(78,205,196,0.15) 0%, transparent 70%)`,
              position: 'relative',
            }}
          >
            <div
              style={{
                fontSize: 140,
                filter: `drop-shadow(0 0 ${shieldGlow}px rgba(78, 205, 196, 0.6))`,
                lineHeight: 1,
              }}
            >
              🛡️
            </div>
            <div
              style={{
                ...textStyles.label,
                fontSize: 20,
                color: BRAND.green,
                marginTop: 16,
                textAlign: 'center',
              }}
            >
              Privacy First
            </div>
          </div>
        </div>

        {/* Contenido de privacidad */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              opacity: interpolate(titleSpring, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(titleSpring, [0, 1], [30, 0])}px)`,
              marginBottom: 36,
            }}
          >
            <div style={{ ...textStyles.label, marginBottom: 12 }}>Tu privacidad</div>
            <div style={{ ...textStyles.titleSmall, fontSize: 52 }}>
              Tus fotos son{' '}
              <span
                style={{
                  background: `linear-gradient(135deg, ${BRAND.green}, #6EDDDA)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                invisibles para nosotros
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {features.map((f, i) => {
              const featureSpring = spring({ frame: frame - f.delay, fps, config: { damping: 200 } });
              return (
                <div
                  key={i}
                  style={{
                    opacity: interpolate(featureSpring, [0, 1], [0, 1]),
                    transform: `translateX(${interpolate(featureSpring, [0, 1], [-30, 0])}px)`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    background: 'rgba(78,205,196,0.06)',
                    border: '1px solid rgba(78,205,196,0.2)',
                    borderRadius: 12,
                    padding: '14px 20px',
                  }}
                >
                  <span style={{ fontSize: 28, flexShrink: 0 }}>{f.icon}</span>
                  <span style={{ ...textStyles.bodyMedium, fontSize: 22 }}>{f.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
