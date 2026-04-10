import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

type AnimatedTextProps = {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
  animation?: 'fadeUp' | 'fadeIn' | 'slideRight' | 'scale';
};

/** Texto con animación de entrada cinematográfica */
export const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  delay = 0,
  style,
  animation = 'fadeUp',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);

  let transform = '';
  if (animation === 'fadeUp') {
    const y = interpolate(progress, [0, 1], [40, 0]);
    transform = `translateY(${y}px)`;
  } else if (animation === 'slideRight') {
    const x = interpolate(progress, [0, 1], [-60, 0]);
    transform = `translateX(${x}px)`;
  } else if (animation === 'scale') {
    const scale = interpolate(progress, [0, 1], [0.8, 1]);
    transform = `scale(${scale})`;
  }

  return (
    <div style={{ opacity, transform, ...style }}>
      {children}
    </div>
  );
};

type GoldLineProps = {
  delay?: number;
  width?: number;
};

/** Línea horizontal dorada que se expande */
export const GoldLine: React.FC<GoldLineProps> = ({ delay = 0, width = 200 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
    durationInFrames: 30,
  });

  const lineWidth = interpolate(progress, [0, 1], [0, width]);

  return (
    <div
      style={{
        height: 2,
        width: lineWidth,
        background: 'linear-gradient(90deg, #D4A854, #E8C27A)',
        borderRadius: 2,
        boxShadow: '0 0 8px rgba(212, 168, 84, 0.6)',
      }}
    />
  );
};

type TypewriterProps = {
  text: string;
  startFrame?: number;
  charsPerFrame?: number;
  style?: React.CSSProperties;
};

/** Efecto máquina de escribir */
export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  startFrame = 0,
  charsPerFrame = 2,
  style,
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);
  const charsVisible = Math.min(text.length, Math.floor(elapsed * charsPerFrame));
  const visibleText = text.slice(0, charsVisible);
  const showCursor = charsVisible < text.length || frame % 30 < 15;

  return (
    <span style={style}>
      {visibleText}
      {showCursor && (
        <span style={{ opacity: frame % 30 < 15 ? 1 : 0, color: '#D4A854' }}>|</span>
      )}
    </span>
  );
};
