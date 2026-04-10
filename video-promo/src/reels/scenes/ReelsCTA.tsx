import React from 'react';
import {
  AbsoluteFill, Img, interpolate, spring,
  useCurrentFrame, useVideoConfig, staticFile
} from 'remotion';
import { GoldParticles } from '../../components/GoldParticles';

const GOLD = '#D4A854';
const NAVY = '#1A1A2E';

export const ReelsCTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Logotipos aparecen
  const logo1In = spring({ frame: frame - 10, fps, config: { damping: 150, stiffness: 180 } });
  const logo1Scale = interpolate(logo1In, [0, 1], [0.2, 1]);
  const logo1Opacity = interpolate(logo1In, [0, 1], [0, 1]);

  const logo2In = spring({ frame: frame - 25, fps, config: { damping: 150, stiffness: 180 } });
  const logo2Scale = interpolate(logo2In, [0, 1], [0.2, 1]);
  const logo2Opacity = interpolate(logo2In, [0, 1], [0, 1]);

  // Línea divisoria
  const lineIn = spring({ frame: frame - 40, fps, config: { damping: 200 }, durationInFrames: 25 });
  const lineWidth = interpolate(lineIn, [0, 1], [0, 500]);

  // Nombre
  const nameIn = spring({ frame: frame - 50, fps, config: { damping: 200 } });
  const nameOpacity = interpolate(nameIn, [0, 1], [0, 1]);
  const nameY = interpolate(nameIn, [0, 1], [40, 0]);

  // Datos de contacto
  const contactIn = spring({ frame: frame - 70, fps, config: { damping: 200 } });
  const contactOpacity = interpolate(contactIn, [0, 1], [0, 1]);

  // CTA final
  const ctaIn = spring({ frame: frame - 95, fps, config: { damping: 200, stiffness: 200 } });
  const ctaOpacity = interpolate(ctaIn, [0, 1], [0, 1]);
  const ctaScale = interpolate(ctaIn, [0, 1], [0.8, 1]);

  // Glow pulsante para CTA
  const glowPulse = interpolate(Math.sin((frame / fps) * Math.PI * 2.5), [-1, 1], [0.6, 1.0]);

  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {/* Fondo navy premium */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 50% 30%, #1F1F3A 0%, #0D0D1A 65%)`,
      }} />

      <GoldParticles intensity={0.7} />

      {/* Rejilla sutil */}
      <AbsoluteFill style={{
        backgroundImage: `linear-gradient(rgba(212,168,84,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,84,0.03) 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
      }} />

      {/* Contenido */}
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 60px',
        gap: 36,
      }}>
        {/* Ambos logos lado a lado */}
        <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
          {/* Logo EA barbershop */}
          <div style={{
            transform: `scale(${logo1Scale})`,
            opacity: logo1Opacity,
          }}>
            <div style={{
              width: 160,
              height: 160,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `3px solid rgba(212,168,84,0.7)`,
              boxShadow: `0 0 30px rgba(212,168,84,0.3)`,
            }}>
              <Img
                src={staticFile('logo-ea.png')}
                style={{ width: 110, height: 110, objectFit: 'contain' }}
              />
            </div>
          </div>

          {/* Separador vertical */}
          <div style={{
            width: 2,
            height: 120,
            background: `linear-gradient(180deg, transparent, ${GOLD}, transparent)`,
            opacity: logo1Opacity,
          }} />

          {/* Logo AI Vision */}
          <div style={{
            transform: `scale(${logo2Scale})`,
            opacity: logo2Opacity,
          }}>
            <div style={{
              width: 160,
              height: 160,
              borderRadius: 24,
              overflow: 'hidden',
              border: `3px solid rgba(212,168,84,0.7)`,
              boxShadow: `0 0 30px rgba(212,168,84,0.3)`,
            }}>
              <Img
                src={staticFile('pwa-logo-gold.png')}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        {/* Línea dorada */}
        <div style={{
          width: lineWidth,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
        }} />

        {/* Nombre del negocio */}
        <div style={{
          transform: `translateY(${nameY}px)`,
          opacity: nameOpacity,
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'serif',
            fontSize: 60,
            fontWeight: 700,
            background: `linear-gradient(135deg, #FFFFFF 0%, #E8C27A 40%, ${GOLD} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '2px',
          }}>
            Estefan Barber Shop
          </div>
          <div style={{
            fontFamily: 'sans-serif',
            fontSize: 26,
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            marginTop: 8,
          }}>
            Lugo · Galicia
          </div>
        </div>

        {/* Info de contacto */}
        <div style={{ opacity: contactOpacity, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          {[
            { icon: '📸', text: '@estefanacostabarbershop' },
            { icon: '📍', text: 'Lugo, Galicia' },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 28 }}>{icon}</span>
              <div style={{
                fontFamily: 'sans-serif',
                fontSize: 28,
                color: GOLD,
                letterSpacing: '1px',
              }}>
                {text}
              </div>
            </div>
          ))}
        </div>

        {/* Botón CTA */}
        <div style={{
          transform: `scale(${ctaScale})`,
          opacity: ctaOpacity,
          marginTop: 10,
        }}>
          <div style={{
            padding: '28px 80px',
            background: `linear-gradient(135deg, ${GOLD}, #B8922A)`,
            borderRadius: 50,
            boxShadow: `0 0 ${50 * glowPulse}px rgba(212,168,84,0.5), 0 8px 30px rgba(0,0,0,0.5)`,
          }}>
            <div style={{
              fontFamily: 'sans-serif',
              fontSize: 36,
              fontWeight: 700,
              color: '#0D0D1A',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}>
              Reserva tu cita
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* Barra dorada final */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 5,
        background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
        boxShadow: `0 0 20px rgba(212,168,84,0.5)`,
      }} />
    </AbsoluteFill>
  );
};
