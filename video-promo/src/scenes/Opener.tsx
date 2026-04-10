import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import { Background } from '../components/Background';
import { GoldParticles } from '../components/GoldParticles';
import { BRAND, textStyles } from '../components/Brand';

export const OpenerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo aparece con spring suave
  const logoSpring = spring({ frame: frame - 10, fps, config: { damping: 200 } });
  const logoScale = interpolate(logoSpring, [0, 1], [0.3, 1]);
  const logoOpacity = interpolate(logoSpring, [0, 1], [0, 1]);

  // Título aparece después
  const titleSpring = spring({ frame: frame - 40, fps, config: { damping: 200 } });
  const titleY = interpolate(titleSpring, [0, 1], [50, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

  // Subtítulo aún más tarde
  const subtitleSpring = spring({ frame: frame - 70, fps, config: { damping: 200 } });
  const subtitleY = interpolate(subtitleSpring, [0, 1], [30, 0]);
  const subtitleOpacity = interpolate(subtitleSpring, [0, 1], [0, 1]);

  // Línea dorada se extiende
  const lineSpring = spring({ frame: frame - 60, fps, config: { damping: 200 }, durationInFrames: 30 });
  const lineWidth = interpolate(lineSpring, [0, 1], [0, 300]);

  // Glow del logo pulsa suavemente
  const glowPulse = interpolate(
    Math.sin((frame / fps) * Math.PI * 2),
    [-1, 1],
    [0.4, 1]
  );

  // Fade out suave al final de la escena
  const fadeOut = interpolate(frame, [130, 150], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <Background videoSrc="generated/videos/barbershop-cinematic.mp4" overlayOpacity={0.68} />
      <GoldParticles intensity={0.6} />

      {/* Contenido central */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
        }}
      >
        {/* Logo EA */}
        <div
          style={{
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 180,
              height: 180,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(212,168,84,0.15) 0%, rgba(212,168,84,0) 70%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 ${60 * glowPulse}px rgba(212, 168, 84, 0.4)`,
              border: `2px solid rgba(212, 168, 84, 0.3)`,
            }}
          >
            <Img
              src={staticFile('logo-ea.png')}
              style={{ width: 120, height: 120, objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Línea dorada */}
        <div style={{ width: lineWidth, height: 2, background: `linear-gradient(90deg, transparent, ${BRAND.gold}, transparent)`, borderRadius: 2 }} />

        {/* Título principal */}
        <div
          style={{
            transform: `translateY(${titleY}px)`,
            opacity: titleOpacity,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              ...textStyles.titleLarge,
              background: `linear-gradient(135deg, #FFFFFF 0%, #E8C27A 50%, #D4A854 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: 88,
              letterSpacing: '-2px',
            }}
          >
            Estefan AI Vision
          </div>
        </div>

        {/* Subtítulo */}
        <div
          style={{
            transform: `translateY(${subtitleY}px)`,
            opacity: subtitleOpacity,
            textAlign: 'center',
          }}
        >
          <div style={{ ...textStyles.label, fontSize: 24 }}>
            La barbería del futuro · Lugo
          </div>
        </div>
      </AbsoluteFill>

      {/* Barras cinematográficas */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 80,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%)',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
        background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 100%)',
      }} />
    </AbsoluteFill>
  );
};
