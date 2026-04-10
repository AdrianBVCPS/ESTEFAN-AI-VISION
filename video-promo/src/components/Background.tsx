import React from 'react';
import { AbsoluteFill, Img, OffthreadVideo, interpolate, useCurrentFrame, staticFile } from 'remotion';
import { BRAND, navyGradient } from './Brand';

type BackgroundProps = {
  imageSrc?: string;
  videoSrc?: string;
  overlayOpacity?: number;
};

/** Fondo cinematográfico con imagen/video Veo 3 y overlay navy */
export const Background: React.FC<BackgroundProps> = ({
  imageSrc,
  videoSrc,
  overlayOpacity = 0.75,
}) => {
  const frame = useCurrentFrame();

  // Ken Burns effect para imágenes estáticas
  const kenBurnsScale = interpolate(frame, [0, 150], [1.0, 1.08], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      {videoSrc ? (
        <>
          {/* Video clip generado por Veo 3 — OffthreadVideo para renderizado correcto en headless */}
          <OffthreadVideo
            src={staticFile(videoSrc)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            muted
            playbackRate={0.8}
          />
          {/* Overlay navy */}
          <AbsoluteFill
            style={{
              background: `linear-gradient(180deg, rgba(26,26,46,${overlayOpacity}) 0%, rgba(13,13,26,${overlayOpacity + 0.1}) 100%)`,
            }}
          />
        </>
      ) : imageSrc ? (
        <>
          <AbsoluteFill
            style={{
              transform: `scale(${kenBurnsScale})`,
              transformOrigin: 'center center',
            }}
          >
            <Img
              src={imageSrc}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </AbsoluteFill>
          <AbsoluteFill
            style={{
              background: `linear-gradient(180deg, rgba(26,26,46,${overlayOpacity}) 0%, rgba(13,13,26,${overlayOpacity + 0.1}) 100%)`,
            }}
          />
        </>
      ) : (
        <AbsoluteFill style={{ background: navyGradient }} />
      )}

      {/* Viñeta cinematográfica */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Barra inferior dorada */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, transparent, ${BRAND.gold}, transparent)`,
        }}
      />
    </AbsoluteFill>
  );
};
