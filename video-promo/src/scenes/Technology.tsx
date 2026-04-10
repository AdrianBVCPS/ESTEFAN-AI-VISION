import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Background } from '../components/Background';
import { GoldParticles } from '../components/GoldParticles';
import { BRAND, textStyles } from '../components/Brand';

export const TechnologyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame: frame - 10, fps, config: { damping: 200 } });
  const tech1Spring = spring({ frame: frame - 40, fps, config: { damping: 20, stiffness: 200 } });
  const tech2Spring = spring({ frame: frame - 60, fps, config: { damping: 20, stiffness: 200 } });
  const tech3Spring = spring({ frame: frame - 80, fps, config: { damping: 20, stiffness: 200 } });
  const tech4Spring = spring({ frame: frame - 100, fps, config: { damping: 20, stiffness: 200 } });

  const techCards = [
    {
      spring: tech1Spring,
      icon: '🤖',
      name: 'Google Gemini Vision',
      desc: 'Análisis facial con IA multimodal de última generación',
      color: '#4285F4',
    },
    {
      spring: tech2Spring,
      icon: '🎨',
      name: 'Imagen 3',
      desc: 'Generación de imágenes fotorrealistas Google',
      color: '#EA4335',
    },
    {
      spring: tech3Spring,
      icon: '⚡',
      name: 'Next.js + Vercel',
      desc: 'App web rápida, instalable como app nativa (PWA)',
      color: BRAND.white,
    },
    {
      spring: tech4Spring,
      icon: '🔒',
      name: 'Zero Data Retention',
      desc: 'Cumple GDPR/LOPDGDD. Fotos destruidas al terminar',
      color: BRAND.green,
    },
  ];

  return (
    <AbsoluteFill>
      <Background overlayOpacity={0} />
      <GoldParticles intensity={0.4} />

      <AbsoluteFill style={{ padding: '60px 100px' }}>
        {/* Título */}
        <div
          style={{
            opacity: interpolate(titleSpring, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(titleSpring, [0, 1], [30, 0])}px)`,
            marginBottom: 16,
          }}
        >
          <div style={{ ...textStyles.label, marginBottom: 12 }}>Tecnología de vanguardia</div>
          <div style={{ ...textStyles.titleMedium, fontSize: 56 }}>
            Powered by{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #4285F4, #EA4335, #FBBC05, #34A853)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Google AI
            </span>
          </div>
        </div>

        {/* Grid de tecnologías */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 24,
            marginTop: 32,
          }}
        >
          {techCards.map((card, i) => (
            <div
              key={i}
              style={{
                opacity: interpolate(card.spring, [0, 1], [0, 1]),
                transform: `scale(${interpolate(card.spring, [0, 1], [0.8, 1])})`,
              }}
            >
              <div
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid rgba(255,255,255,0.1)`,
                  borderRadius: 16,
                  padding: '24px 28px',
                  display: 'flex',
                  gap: 20,
                  alignItems: 'flex-start',
                  backdropFilter: 'blur(10px)',
                  borderLeft: `3px solid ${card.color}`,
                  transition: 'none',
                }}
              >
                <div style={{ fontSize: 40, lineHeight: 1, flexShrink: 0 }}>{card.icon}</div>
                <div>
                  <div
                    style={{
                      ...textStyles.bodyMedium,
                      fontSize: 24,
                      color: card.color,
                      marginBottom: 6,
                      fontWeight: 700,
                    }}
                  >
                    {card.name}
                  </div>
                  <div style={{ ...textStyles.caption, fontSize: 20 }}>{card.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tagline de costes */}
        <div
          style={{
            opacity: interpolate(
              spring({ frame: frame - 120, fps, config: { damping: 200 } }),
              [0, 1], [0, 1]
            ),
            marginTop: 32,
            textAlign: 'center',
            ...textStyles.bodyMedium,
            fontSize: 24,
            color: BRAND.gold,
          }}
        >
          ✦ &nbsp; ~€0.10 por consulta · 500+ consultas/día con free tier · 100% gratuito inicialmente
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
