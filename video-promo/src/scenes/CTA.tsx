import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import { Background } from '../components/Background';
import { GoldParticles } from '../components/GoldParticles';
import { BRAND, textStyles } from '../components/Brand';

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSpring = spring({ frame: frame - 10, fps, config: { damping: 200 } });
  const titleSpring = spring({ frame: frame - 35, fps, config: { damping: 200 } });
  const badgeSpring = spring({ frame: frame - 55, fps, config: { damping: 20, stiffness: 200 } });
  const statsSpring = spring({ frame: frame - 75, fps, config: { damping: 200 } });
  const contactSpring = spring({ frame: frame - 110, fps, config: { damping: 200 } });
  const footerSpring = spring({ frame: frame - 150, fps, config: { damping: 200 } });

  // Glow pulsante para el logo
  const glowPulse = interpolate(
    Math.sin((frame / fps) * Math.PI * 1.5),
    [-1, 1],
    [20, 60]
  );

  const stats = [
    { value: '< 15s', label: 'Resultado en pantalla' },
    { value: '3D', label: 'Ángulos fotorrealistas' },
    { value: '2', label: 'Barberos incluidos' },
    { value: '∞', label: 'Clientes por día' },
  ];

  return (
    <AbsoluteFill>
      <Background imageSrc={staticFile('generated/client-happy.jpeg')} overlayOpacity={0.82} />
      <GoldParticles intensity={1.5} />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0,
          padding: '40px 100px',
        }}
      >
        {/* Logo grande */}
        <div
          style={{
            transform: `scale(${interpolate(logoSpring, [0, 1], [0.5, 1])})`,
            opacity: interpolate(logoSpring, [0, 1], [0, 1]),
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(212,168,84,0.2) 0%, rgba(212,168,84,0) 70%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 ${glowPulse}px rgba(212, 168, 84, 0.5), 0 0 ${glowPulse * 2}px rgba(212, 168, 84, 0.2)`,
              border: `2px solid rgba(212, 168, 84, 0.5)`,
            }}
          >
            <Img
              src={staticFile('logo-ea.png')}
              style={{ width: 90, height: 90, objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Badge exclusividad */}
        <div
          style={{
            opacity: interpolate(badgeSpring, [0, 1], [0, 1]),
            transform: `scale(${interpolate(badgeSpring, [0, 1], [0.8, 1])})`,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: `linear-gradient(135deg, rgba(212,168,84,0.25), rgba(212,168,84,0.1))`,
              border: `1px solid ${BRAND.gold}`,
              borderRadius: 40,
              padding: '8px 28px',
              ...textStyles.label,
              fontSize: 20,
              boxShadow: `0 0 20px rgba(212, 168, 84, 0.2)`,
            }}
          >
            ✦ &nbsp; Primera barbería de Lugo con IA
          </div>
        </div>

        {/* Título principal */}
        <div
          style={{
            opacity: interpolate(titleSpring, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(titleSpring, [0, 1], [40, 0])}px)`,
            textAlign: 'center',
            marginBottom: 32,
          }}
        >
          <div
            style={{
              ...textStyles.titleLarge,
              fontSize: 80,
              lineHeight: 1.1,
              textShadow: `0 4px 30px rgba(0,0,0,0.5)`,
            }}
          >
            Estefan Acosta{' '}
            <span
              style={{
                background: `linear-gradient(135deg, ${BRAND.gold} 0%, ${BRAND.goldLight} 60%, #FFF5D6 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Barber Shop
            </span>
          </div>
          <div
            style={{
              ...textStyles.bodyLarge,
              fontSize: 30,
              marginTop: 8,
              color: 'rgba(245, 240, 235, 0.8)',
            }}
          >
            Ahora con inteligencia artificial integrada
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            opacity: interpolate(statsSpring, [0, 1], [0, 1]),
            display: 'flex',
            gap: 40,
            marginBottom: 36,
          }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              style={{
                textAlign: 'center',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(212, 168, 84, 0.2)',
                borderRadius: 12,
                padding: '16px 24px',
                minWidth: 130,
              }}
            >
              <div
                style={{
                  ...textStyles.titleSmall,
                  fontSize: 42,
                  background: `linear-gradient(135deg, ${BRAND.gold}, ${BRAND.goldLight})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {s.value}
              </div>
              <div style={{ ...textStyles.caption, fontSize: 17, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Contacto */}
        <div
          style={{
            opacity: interpolate(contactSpring, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(contactSpring, [0, 1], [20, 0])}px)`,
            display: 'flex',
            gap: 40,
            marginBottom: 24,
          }}
        >
          {[
            { icon: '🌐', text: 'estefanacostabarbershop.com' },
            { icon: '📸', text: '@estefanacostabarbershop' },
            { icon: '📍', text: 'Lugo, Galicia' },
          ].map((c, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                ...textStyles.caption,
                fontSize: 20,
              }}
            >
              <span>{c.icon}</span>
              <span>{c.text}</span>
            </div>
          ))}
        </div>

        {/* Footer con marca del desarrollo */}
        <div
          style={{
            opacity: interpolate(footerSpring, [0, 1], [0, 1]),
            ...textStyles.caption,
            fontSize: 16,
            color: 'rgba(245, 240, 235, 0.4)',
            textAlign: 'center',
          }}
        >
          Desarrollado por Estefan AI Vision Team · Stack: Next.js · Supabase · Google Gemini AI · Vercel
        </div>
      </AbsoluteFill>

      {/* Línea dorada inferior */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 6,
          background: `linear-gradient(90deg, transparent, ${BRAND.gold}, ${BRAND.goldLight}, ${BRAND.gold}, transparent)`,
        }}
      />
    </AbsoluteFill>
  );
};
