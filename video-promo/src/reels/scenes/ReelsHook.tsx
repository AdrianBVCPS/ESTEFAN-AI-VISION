import React from 'react';
import {
  AbsoluteFill, Img, interpolate, spring,
  useCurrentFrame, useVideoConfig, staticFile
} from 'remotion';
import { GoldParticles } from '../../components/GoldParticles';

const GOLD = '#D4A854';
const NAVY = '#1A1A2E';
const CREAM = '#F5F0EB';

export const ReelsHookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Barras de apertura cinematic
  const barsOpen = spring({ frame: frame - 0, fps, config: { damping: 200 }, durationInFrames: 20 });
  const barHeight = interpolate(barsOpen, [0, 1], [200, 0]);

  // Logo entra con spring impactante
  const logoSpring = spring({ frame: frame - 8, fps, config: { damping: 150, stiffness: 200 } });
  const logoScale = interpolate(logoSpring, [0, 1], [0, 1]);
  const logoOpacity = interpolate(logoSpring, [0, 1], [0, 1]);

  // Línea dorada se extiende
  const lineSpring = spring({ frame: frame - 25, fps, config: { damping: 200 }, durationInFrames: 25 });
  const lineWidth = interpolate(lineSpring, [0, 1], [0, 500]);

  // Nombre principal aparece
  const nameSpring = spring({ frame: frame - 35, fps, config: { damping: 180 } });
  const nameY = interpolate(nameSpring, [0, 1], [60, 0]);
  const nameOpacity = interpolate(nameSpring, [0, 1], [0, 1]);

  // Subtítulo aparece
  const subSpring = spring({ frame: frame - 50, fps, config: { damping: 200 } });
  const subOpacity = interpolate(subSpring, [0, 1], [0, 1]);

  // Pulso del glow
  const glowPulse = interpolate(Math.sin((frame / fps) * Math.PI * 1.5), [-1, 1], [0.5, 1.0]);

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, #1A1A2E 0%, #0D0D1A 100%)` }}>
      <GoldParticles intensity={0.8} />

      {/* Contenido central */}
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
        padding: '0 60px',
      }}>
        {/* Logo EA con círculo dorado */}
        <div style={{
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
        }}>
          <div style={{
            width: 240,
            height: 240,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 ${80 * glowPulse}px rgba(212,168,84,0.6), 0 0 ${40 * glowPulse}px rgba(212,168,84,0.4)`,
            border: `3px solid rgba(212,168,84,0.8)`,
          }}>
            <Img
              src={staticFile('logo-ea.png')}
              style={{ width: 160, height: 160, objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Línea dorada */}
        <div style={{
          width: lineWidth,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
          borderRadius: 2,
        }} />

        {/* Nombre barbería */}
        <div style={{
          transform: `translateY(${nameY}px)`,
          opacity: nameOpacity,
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'serif',
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            background: `linear-gradient(135deg, #FFFFFF 0%, #E8C27A 40%, ${GOLD} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1.1,
          }}>
            ESTEFAN{'\n'}BARBER SHOP
          </div>
        </div>

        {/* Separador */}
        <div style={{
          opacity: subOpacity,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}>
          <div style={{ width: 60, height: 1, background: GOLD, opacity: 0.6 }} />
          <div style={{
            fontFamily: 'sans-serif',
            fontSize: 28,
            letterSpacing: '6px',
            textTransform: 'uppercase',
            color: GOLD,
            fontWeight: 300,
          }}>
            LUGO · GALICIA
          </div>
          <div style={{ width: 60, height: 1, background: GOLD, opacity: 0.6 }} />
        </div>
      </AbsoluteFill>

      {/* Barras cinematográficas de apertura */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: barHeight,
        background: '#000000',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: barHeight,
        background: '#000000',
      }} />

      {/* Barra dorada inferior */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 5,
        background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
      }} />
    </AbsoluteFill>
  );
};
