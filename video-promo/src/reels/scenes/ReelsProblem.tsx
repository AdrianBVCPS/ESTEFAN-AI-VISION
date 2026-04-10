import React from 'react';
import {
  AbsoluteFill, Img, interpolate, spring,
  useCurrentFrame, useVideoConfig, staticFile
} from 'remotion';

const GOLD = '#D4A854';
const NAVY = '#1A1A2E';

export const ReelsProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Pregunta entra línea a línea
  const line1 = spring({ frame: frame - 5, fps, config: { damping: 180 } });
  const line1Y = interpolate(line1, [0, 1], [80, 0]);
  const line1O = interpolate(line1, [0, 1], [0, 1]);

  const line2 = spring({ frame: frame - 20, fps, config: { damping: 180 } });
  const line2Y = interpolate(line2, [0, 1], [80, 0]);
  const line2O = interpolate(line2, [0, 1], [0, 1]);

  const line3 = spring({ frame: frame - 35, fps, config: { damping: 180 } });
  const line3Y = interpolate(line3, [0, 1], [80, 0]);
  const line3O = interpolate(line3, [0, 1], [0, 1]);

  // Respuesta aparece
  const answerIn = spring({ frame: frame - 60, fps, config: { damping: 200 } });
  const answerOpacity = interpolate(answerIn, [0, 1], [0, 1]);
  const answerScale = interpolate(answerIn, [0, 1], [0.8, 1]);

  const fadeOut = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Fondo: imagen barbería con overlay muy oscuro
  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {/* Fondo con imagen barbería (muy oscuro) */}
      <AbsoluteFill>
        <Img
          src={staticFile('generated/reels/reels-barbershop-hero.jpeg')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* Overlay muy denso para legibilidad */}
      <AbsoluteFill style={{
        background: 'rgba(10, 10, 20, 0.88)',
      }} />

      {/* Contenido central */}
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 70px',
        gap: 0,
      }}>
        {/* Interrogante decorativo */}
        <div style={{
          fontSize: 120,
          color: GOLD,
          opacity: 0.15,
          fontFamily: 'serif',
          lineHeight: 1,
          marginBottom: 40,
        }}>
          ?
        </div>

        {/* Pregunta dramática */}
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          {[
            { text: '¿Cómo sabes', spring: { y: line1Y, o: line1O } },
            { text: 'si un corte', spring: { y: line2Y, o: line2O } },
            { text: 'te quedará bien?', spring: { y: line3Y, o: line3O } },
          ].map((line, i) => (
            <div
              key={i}
              style={{
                transform: `translateY(${line.spring.y}px)`,
                opacity: line.spring.o,
                fontFamily: 'serif',
                fontSize: 78,
                fontWeight: 700,
                color: '#FFFFFF',
                lineHeight: 1.15,
                textShadow: '0 4px 40px rgba(0,0,0,0.9)',
              }}
            >
              {line.text}
            </div>
          ))}
        </div>

        {/* Respuesta */}
        <div style={{
          transform: `scale(${answerScale})`,
          opacity: answerOpacity,
          textAlign: 'center',
          padding: '24px 48px',
          border: `2px solid rgba(212,168,84,0.5)`,
          borderRadius: 8,
          background: 'rgba(212,168,84,0.08)',
        }}>
          <div style={{
            fontFamily: 'sans-serif',
            fontSize: 34,
            color: GOLD,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            fontWeight: 400,
          }}>
            Hasta ahora, no podías.
          </div>
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
