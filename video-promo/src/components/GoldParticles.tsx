import React from 'react';
import { useCurrentFrame, interpolate, random } from 'remotion';

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  delay: number;
};

const PARTICLE_COUNT = 40;

const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  x: random(`x-${i}`) * 100,
  y: random(`y-${i}`) * 100,
  size: random(`size-${i}`) * 4 + 1,
  speed: random(`speed-${i}`) * 0.3 + 0.1,
  opacity: random(`opacity-${i}`) * 0.5 + 0.1,
  delay: random(`delay-${i}`) * 60,
}));

export const GoldParticles: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map((p) => {
        const progress = (frame * p.speed + p.delay) % 100;
        const yPos = 100 - progress;
        const opacity = interpolate(
          progress,
          [0, 10, 80, 100],
          [0, p.opacity * intensity, p.opacity * intensity, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${yPos}%`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: '#D4A854',
              opacity,
              boxShadow: `0 0 ${p.size * 2}px #D4A854`,
            }}
          />
        );
      })}
    </div>
  );
};
