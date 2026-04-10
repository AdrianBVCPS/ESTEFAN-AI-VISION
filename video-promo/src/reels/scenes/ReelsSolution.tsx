import React from 'react';
import {
  AbsoluteFill, Img, interpolate, spring,
  useCurrentFrame, useVideoConfig, staticFile
} from 'remotion';
import { GoldParticles } from '../../components/GoldParticles';

const GOLD = '#D4A854';
const NAVY = '#1A1A2E';

export const ReelsSolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Logo AI Vision entra con pop
  const logoSpring = spring({ frame: frame - 10, fps, config: { damping: 150, stiffness: 180 } });
  const logoScale = interpolate(logoSpring, [0, 1], [0.3, 1]);
  const logoOpacity = interpolate(logoSpring, [0, 1], [0, 1]);

  // Texto "Estefan AI Vision" aparece
  const titleIn = spring({ frame: frame - 45, fps, config: { damping: 200 } });
  const titleY = interpolate(titleIn, [0, 1], [50, 0]);
  const titleOpacity = interpolate(titleIn, [0, 1], [0, 1]);

  // Subtexto explicativo
  const subIn = spring({ frame: frame - 65, fps, config: { damping: 200 } });
  const subOpacity = interpolate(subIn, [0, 1], [0, 1]);

  // Tags de características
  const tagsIn = spring({ frame: frame - 85, fps, config: { damping: 200 } });
  const tagsOpacity = interpolate(tagsIn, [0, 1], [0, 1]);

  // Glow pulsante del logo
  const glowPulse = interpolate(Math.sin((frame / fps) * Math.PI * 2), [-1, 1], [0.5, 1.0]);

  const fadeOut = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {/* Fondo navy con gradiente radial */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 50% 40%, #1F1F3A 0%, #0D0D1A 70%)`,
      }} />

      <GoldParticles intensity={0.9} />

      {/* Rejilla decorativa sutil */}
      <AbsoluteFill style={{
        backgroundImage: `linear-gradient(rgba(212,168,84,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,84,0.04) 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
      }} />

      {/* Contenido central */}
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 60px',
        gap: 36,
      }}>
        {/* Logo AI Vision con glow */}
        <div style={{
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
        }}>
          <div style={{
            width: 260,
            height: 260,
            borderRadius: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 ${100 * glowPulse}px rgba(212,168,84,0.5), 0 0 ${50 * glowPulse}px rgba(212,168,84,0.3), inset 0 0 30px rgba(212,168,84,0.05)`,
            border: `2px solid rgba(212,168,84,0.4)`,
            background: 'rgba(26,26,46,0.8)',
          }}>
            <Img
              src={staticFile('pwa-logo-gold.png')}
              style={{ width: 220, height: 220, objectFit: 'contain', borderRadius: 30 }}
            />
          </div>
        </div>

        {/* Título */}
        <div style={{
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'serif',
            fontSize: 68,
            fontWeight: 700,
            background: `linear-gradient(135deg, #FFFFFF 0%, #E8C27A 40%, ${GOLD} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '2px',
          }}>
            Estefan AI Vision
          </div>
        </div>

        {/* Subtexto */}
        <div style={{ opacity: subOpacity, textAlign: 'center' }}>
          <div style={{
            fontFamily: 'sans-serif',
            fontSize: 34,
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.5,
            fontWeight: 300,
          }}>
            La IA analiza tu rostro{'\n'}y te muestra el resultado
          </div>
        </div>

        {/* Tags de características */}
        <div style={{
          opacity: tagsOpacity,
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {['3 fotos', 'Análisis IA', 'Tu look preview'].map((tag) => (
            <div key={tag} style={{
              padding: '12px 28px',
              border: `1px solid rgba(212,168,84,0.5)`,
              borderRadius: 40,
              background: 'rgba(212,168,84,0.1)',
              color: GOLD,
              fontFamily: 'sans-serif',
              fontSize: 26,
              letterSpacing: '1px',
            }}>
              {tag}
            </div>
          ))}
        </div>
      </AbsoluteFill>

      {/* Barra dorada */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 5,
        background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
      }} />
    </AbsoluteFill>
  );
};
