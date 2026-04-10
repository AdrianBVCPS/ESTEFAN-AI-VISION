import React from 'react';
import {
  AbsoluteFill, Img, interpolate, spring,
  useCurrentFrame, useVideoConfig, staticFile
} from 'remotion';

const GOLD = '#D4A854';

// Línea de escaneo animada
const ScanLine: React.FC<{ frame: number; fps: number; durationInFrames: number }> = ({ frame, fps, durationInFrames }) => {
  const scanProgress = interpolate(frame, [20, durationInFrames - 20], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const scanY = interpolate(scanProgress, [0, 1], [200, 1720]);

  return (
    <div style={{
      position: 'absolute',
      left: 0, right: 0,
      top: scanY,
      height: 3,
      background: `linear-gradient(90deg, transparent 0%, rgba(212,168,84,0.8) 20%, rgba(212,168,84,1) 50%, rgba(212,168,84,0.8) 80%, transparent 100%)`,
      boxShadow: `0 0 20px rgba(212,168,84,0.6), 0 0 40px rgba(212,168,84,0.3)`,
    }} />
  );
};

// Punto de dato flotante
const DataPoint: React.FC<{ x: number; y: number; label: string; frame: number; delay: number; fps: number }> = ({ x, y, label, frame, delay, fps }) => {
  const appear = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const opacity = interpolate(appear, [0, 1], [0, 1]);
  const scale = interpolate(appear, [0, 1], [0.5, 1]);

  return (
    <div style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `scale(${scale})`,
      opacity,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <div style={{
          width: 8, height: 8,
          borderRadius: '50%',
          background: GOLD,
          boxShadow: `0 0 10px ${GOLD}`,
        }} />
        <div style={{
          fontFamily: 'monospace',
          fontSize: 20,
          color: GOLD,
          whiteSpace: 'nowrap',
          textShadow: `0 0 10px rgba(212,168,84,0.5)`,
        }}>
          {label}
        </div>
      </div>
    </div>
  );
};

export const ReelsAIScanScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const titleIn = spring({ frame: frame - 15, fps, config: { damping: 200 } });
  const titleOpacity = interpolate(titleIn, [0, 1], [0, 1]);
  const titleY = interpolate(titleIn, [0, 1], [40, 0]);

  // Pasos del proceso
  const steps = [
    { label: '01. Foto frontal', delay: 30 },
    { label: '02. Análisis facial IA', delay: 60 },
    { label: '03. Tu nuevo look', delay: 90 },
  ];

  const fadeOut = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {/* Imagen AI scan de fondo */}
      <AbsoluteFill>
        <Img
          src={staticFile('generated/reels/reels-ai-scan-vertical.jpeg')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* Overlay navy */}
      <AbsoluteFill style={{
        background: 'linear-gradient(180deg, rgba(13,13,26,0.6) 0%, rgba(26,26,46,0.5) 50%, rgba(13,13,26,0.9) 100%)',
      }} />

      {/* Línea de escaneo */}
      <ScanLine frame={frame} fps={fps} durationInFrames={durationInFrames} />

      {/* Datos flotantes */}
      <DataPoint x={60} y={380} label="Forma: Oval" frame={frame} delay={40} fps={fps} />
      <DataPoint x={620} y={420} label="Textura: Media" frame={frame} delay={55} fps={fps} />
      <DataPoint x={80} y={820} label="Frente: Alta" frame={frame} delay={70} fps={fps} />
      <DataPoint x={600} y={860} label="Ángulo: 94°" frame={frame} delay={85} fps={fps} />
      <DataPoint x={120} y={1260} label="Compatibilidad: 97%" frame={frame} delay={100} fps={fps} />

      {/* Título arriba */}
      <div style={{
        position: 'absolute',
        top: 180,
        left: 0, right: 0,
        transform: `translateY(${titleY}px)`,
        opacity: titleOpacity,
        textAlign: 'center',
        padding: '0 60px',
      }}>
        <div style={{
          fontFamily: 'serif',
          fontSize: 66,
          fontWeight: 700,
          color: '#FFFFFF',
          textShadow: '0 4px 30px rgba(0,0,0,0.9)',
          lineHeight: 1.2,
        }}>
          La IA te lee{'\n'}el rostro
        </div>
      </div>

      {/* Pasos del proceso — zona inferior */}
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'stretch',
        padding: '0 60px 280px',
        gap: 20,
      }}>
        {steps.map(({ label, delay }) => {
          const stepIn = spring({ frame: frame - delay, fps, config: { damping: 200 } });
          const stepOpacity = interpolate(stepIn, [0, 1], [0, 1]);
          const stepX = interpolate(stepIn, [0, 1], [-80, 0]);

          return (
            <div key={label} style={{
              transform: `translateX(${stepX}px)`,
              opacity: stepOpacity,
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              padding: '18px 28px',
              background: 'rgba(26,26,46,0.8)',
              border: `1px solid rgba(212,168,84,0.4)`,
              borderRadius: 8,
              backdropFilter: 'blur(10px)',
            }}>
              <div style={{
                width: 10, height: 10,
                borderRadius: '50%',
                background: GOLD,
                flexShrink: 0,
              }} />
              <div style={{
                fontFamily: 'sans-serif',
                fontSize: 30,
                color: '#FFFFFF',
                fontWeight: 400,
              }}>
                {label}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>

      {/* Barra dorada */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 5,
        background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
      }} />
    </AbsoluteFill>
  );
};
