import React from 'react';
import {
  AbsoluteFill, OffthreadVideo, interpolate, spring,
  useCurrentFrame, useVideoConfig, staticFile
} from 'remotion';

const GOLD = '#D4A854';

export const ReelsScissorsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const titleIn = spring({ frame: frame - 25, fps, config: { damping: 200 } });
  const titleOpacity = interpolate(titleIn, [0, 1], [0, 1]);
  const titleY = interpolate(titleIn, [0, 1], [60, 0]);

  const subIn = spring({ frame: frame - 50, fps, config: { damping: 200 } });
  const subOpacity = interpolate(subIn, [0, 1], [0, 1]);

  const lineIn = spring({ frame: frame - 40, fps, config: { damping: 200 }, durationInFrames: 30 });
  const lineWidth = interpolate(lineIn, [0, 1], [0, 380]);

  const badgeIn = spring({ frame: frame - 70, fps, config: { damping: 180 } });
  const badgeOpacity = interpolate(badgeIn, [0, 1], [0, 1]);
  const badgeScale = interpolate(badgeIn, [0, 1], [0.7, 1]);

  const fadeOut = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {/* Clip Veo 3 vertical — tijeras */}
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile('generated/reels/videos/reels-scissors-vertical.mp4')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          muted
          playbackRate={0.7}
          onError={() => {}}
        />
      </AbsoluteFill>

      {/* Overlay dramático */}
      <AbsoluteFill style={{
        background: 'linear-gradient(180deg, rgba(13,13,26,0.2) 0%, rgba(13,13,26,0.4) 40%, rgba(13,13,26,0.92) 80%)',
      }} />

      {/* Viñeta */}
      <AbsoluteFill style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Contenido zona inferior */}
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '0 60px 240px',
        gap: 24,
      }}>
        <div style={{
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'serif',
            fontSize: 80,
            fontWeight: 700,
            color: '#FFFFFF',
            lineHeight: 1.1,
            textShadow: '0 4px 30px rgba(0,0,0,0.9)',
          }}>
            Precisión{'\n'}artesanal
          </div>
        </div>

        <div style={{
          width: lineWidth,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
        }} />

        <div style={{ opacity: subOpacity, textAlign: 'center' }}>
          <div style={{
            fontFamily: 'sans-serif',
            fontSize: 34,
            color: GOLD,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            textShadow: '0 2px 15px rgba(0,0,0,0.8)',
          }}>
            Potenciada con IA
          </div>
        </div>
      </AbsoluteFill>

      {/* Badge "IA" en esquina superior */}
      <div style={{
        position: 'absolute',
        top: 160,
        right: 50,
        transform: `scale(${badgeScale})`,
        opacity: badgeOpacity,
      }}>
        <div style={{
          padding: '16px 28px',
          background: `linear-gradient(135deg, rgba(212,168,84,0.25), rgba(212,168,84,0.1))`,
          border: `2px solid rgba(212,168,84,0.7)`,
          borderRadius: 40,
          backdropFilter: 'blur(10px)',
        }}>
          <div style={{
            fontFamily: 'sans-serif',
            fontSize: 28,
            color: GOLD,
            fontWeight: 700,
            letterSpacing: '2px',
          }}>
            AI POWERED
          </div>
        </div>
      </div>

      {/* Barra dorada */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 5,
        background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
      }} />
    </AbsoluteFill>
  );
};
