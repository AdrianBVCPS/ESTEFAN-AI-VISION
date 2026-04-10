import React from 'react';
import {
  AbsoluteFill, Img, interpolate, spring,
  useCurrentFrame, useVideoConfig, staticFile
} from 'remotion';
import { GoldParticles } from '../../components/GoldParticles';

const GOLD = '#D4A854';

export const ReelsGaliciaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Fondo entra con zoom suave (Ken Burns)
  const kenBurns = interpolate(frame, [0, durationInFrames], [1.05, 1.0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Trofeo / icono impacto
  const trophyIn = spring({ frame: frame - 10, fps, config: { damping: 120, stiffness: 250 } });
  const trophyScale = interpolate(trophyIn, [0, 1], [0, 1.1]);
  const trophyOpacity = interpolate(trophyIn, [0, 1], [0, 1]);
  // Rebote suave tras el pop
  const trophyFinal = spring({ frame: frame - 20, fps, config: { damping: 300 } });
  const trophyScaleFinal = interpolate(trophyFinal, [0, 1], [1.1, 1.0]);

  // Primera línea
  const line1In = spring({ frame: frame - 30, fps, config: { damping: 200 } });
  const line1O = interpolate(line1In, [0, 1], [0, 1]);
  const line1Y = interpolate(line1In, [0, 1], [50, 0]);

  // Segunda línea
  const line2In = spring({ frame: frame - 48, fps, config: { damping: 200 } });
  const line2O = interpolate(line2In, [0, 1], [0, 1]);
  const line2Y = interpolate(line2In, [0, 1], [50, 0]);

  // Línea dorada
  const lineIn = spring({ frame: frame - 40, fps, config: { damping: 200 }, durationInFrames: 30 });
  const lineWidth = interpolate(lineIn, [0, 1], [0, 600]);

  // Subtexto
  const subIn = spring({ frame: frame - 70, fps, config: { damping: 200 } });
  const subOpacity = interpolate(subIn, [0, 1], [0, 1]);

  // Sellos laterales
  const sealsIn = spring({ frame: frame - 90, fps, config: { damping: 200 } });
  const sealsOpacity = interpolate(sealsIn, [0, 1], [0, 1]);

  const fadeOut = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const trophyScaleCombined = frame < 20 ? trophyScale : trophyScaleFinal;

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {/* Fondo: imagen de Lugo/Galicia */}
      <AbsoluteFill style={{ transform: `scale(${kenBurns})`, transformOrigin: 'center center' }}>
        <Img
          src={staticFile('generated/reels/reels-galicia-night.jpeg')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* Overlay muy denso para impacto del texto */}
      <AbsoluteFill style={{
        background: 'linear-gradient(180deg, rgba(10,10,20,0.75) 0%, rgba(10,10,20,0.6) 40%, rgba(10,10,20,0.92) 80%)',
      }} />

      <GoldParticles intensity={0.5} />

      {/* Contenido central */}
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 50px',
        gap: 28,
      }}>
        {/* Trofeo con pop */}
        <div style={{
          transform: `scale(${trophyScaleCombined})`,
          opacity: trophyOpacity,
          fontSize: 110,
          lineHeight: 1,
        }}>
          🏆
        </div>

        {/* "PRIMERA BARBERÍA CON IA" */}
        <div style={{
          transform: `translateY(${line1Y}px)`,
          opacity: line1O,
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'sans-serif',
            fontSize: 52,
            fontWeight: 900,
            color: GOLD,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            lineHeight: 1.2,
            textShadow: `0 0 40px rgba(212,168,84,0.6)`,
          }}>
            PRIMERA{'\n'}BARBERÍA CON IA
          </div>
        </div>

        {/* Línea dorada */}
        <div style={{
          width: lineWidth,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
          boxShadow: `0 0 20px rgba(212,168,84,0.4)`,
        }} />

        {/* "DE TODA GALICIA" — título más grande y épico */}
        <div style={{
          transform: `translateY(${line2Y}px)`,
          opacity: line2O,
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'serif',
            fontSize: 96,
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '-1px',
            lineHeight: 1.05,
            textShadow: '0 4px 40px rgba(0,0,0,0.9)',
          }}>
            DE TODA{'\n'}GALICIA
          </div>
        </div>

        {/* Subtexto */}
        <div style={{ opacity: subOpacity, textAlign: 'center' }}>
          <div style={{
            fontFamily: 'sans-serif',
            fontSize: 28,
            color: 'rgba(255,255,255,0.7)',
            letterSpacing: '3px',
            fontWeight: 300,
          }}>
            Estefan Barber Shop · Lugo
          </div>
        </div>

        {/* Sellos horizontales */}
        <div style={{
          opacity: sealsOpacity,
          display: 'flex',
          gap: 20,
          marginTop: 10,
        }}>
          {['IA Generativa', 'Fotorrealista', 'Exclusivo'].map((seal) => (
            <div key={seal} style={{
              padding: '10px 22px',
              border: `1px solid rgba(212,168,84,0.6)`,
              borderRadius: 40,
              background: 'rgba(212,168,84,0.12)',
              color: GOLD,
              fontFamily: 'sans-serif',
              fontSize: 22,
              letterSpacing: '1px',
            }}>
              {seal}
            </div>
          ))}
        </div>
      </AbsoluteFill>

      {/* Barra dorada inferior */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 5,
        background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
      }} />
    </AbsoluteFill>
  );
};
