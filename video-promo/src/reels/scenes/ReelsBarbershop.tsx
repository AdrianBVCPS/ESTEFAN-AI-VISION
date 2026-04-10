import React from 'react';
import {
  AbsoluteFill, OffthreadVideo, Img, interpolate, spring,
  useCurrentFrame, useVideoConfig, staticFile
} from 'remotion';

const GOLD = '#D4A854';

export const ReelsBarbershopScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const textIn = spring({ frame: frame - 30, fps, config: { damping: 200 } });
  const textY = interpolate(textIn, [0, 1], [80, 0]);
  const textOpacity = interpolate(textIn, [0, 1], [0, 1]);

  const subIn = spring({ frame: frame - 55, fps, config: { damping: 200 } });
  const subOpacity = interpolate(subIn, [0, 1], [0, 1]);

  const lineIn = spring({ frame: frame - 45, fps, config: { damping: 200 }, durationInFrames: 30 });
  const lineWidth = interpolate(lineIn, [0, 1], [0, 400]);

  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {/* Video Veo 3 vertical de fondo — fallback a imagen si no existe */}
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile('generated/reels/videos/reels-barbershop-vertical.mp4')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          muted
          playbackRate={0.75}
          onError={() => {}}
        />
      </AbsoluteFill>

      {/* Overlay navy gradiente */}
      <AbsoluteFill style={{
        background: 'linear-gradient(180deg, rgba(13,13,26,0.3) 0%, rgba(26,26,46,0.55) 50%, rgba(13,13,26,0.85) 100%)',
      }} />

      {/* Viñeta cinematográfica */}
      <AbsoluteFill style={{
        background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.65) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Texto en zona inferior — zona de seguridad Reels */}
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '0 60px 260px',
        gap: 20,
      }}>
        <div style={{ transform: `translateY(${textY}px)`, opacity: textOpacity, textAlign: 'center' }}>
          <div style={{
            fontFamily: 'serif',
            fontSize: 74,
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '2px',
            lineHeight: 1.1,
            textShadow: '0 4px 30px rgba(0,0,0,0.8)',
          }}>
            La barbería{'\n'}de lujo
          </div>
        </div>

        {/* Línea dorada */}
        <div style={{
          width: lineWidth,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
        }} />

        <div style={{ opacity: subOpacity, textAlign: 'center' }}>
          <div style={{
            fontFamily: 'sans-serif',
            fontSize: 32,
            color: GOLD,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            fontWeight: 300,
            textShadow: '0 2px 20px rgba(0,0,0,0.8)',
          }}>
            Ahora con inteligencia artificial
          </div>
        </div>
      </AbsoluteFill>

      {/* Barras cinematográficas */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 120,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 100%)',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 5,
        background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
      }} />
    </AbsoluteFill>
  );
};
