import { AbsoluteFill } from 'remotion';
import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { OpenerScene } from './scenes/Opener';
import { ProblemScene } from './scenes/Problem';
import { SolutionScene } from './scenes/Solution';
import { ModeAScene } from './scenes/ModeA';
import { ModeBScene } from './scenes/ModeB';
import { TechnologyScene } from './scenes/Technology';
import { PrivacyScene } from './scenes/Privacy';
import { CTAScene } from './scenes/CTA';

export const VIDEO_CONFIG = {
  fps: 30,
  width: 1920,
  height: 1080,
  // Duraciones de cada escena en frames
  opener: 150,       // 5s
  problem: 150,      // 5s
  solution: 120,     // 4s
  modeA: 180,        // 6s
  modeB: 150,        // 5s
  technology: 150,   // 5s
  privacy: 120,      // 4s
  cta: 210,          // 7s
  // Duración de transiciones
  transition: 20,
  get totalFrames() {
    const scenes = this.opener + this.problem + this.solution + this.modeA +
      this.modeB + this.technology + this.privacy + this.cta;
    const transitions = this.transition * 7; // 7 transiciones entre 8 escenas
    return scenes - transitions;
  }
};

export const PromoVideo = () => {
  const t = VIDEO_CONFIG.transition;
  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={VIDEO_CONFIG.opener}>
          <OpenerScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: t })}
        />

        <TransitionSeries.Sequence durationInFrames={VIDEO_CONFIG.problem}>
          <ProblemScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-right' })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: t })}
        />

        <TransitionSeries.Sequence durationInFrames={VIDEO_CONFIG.solution}>
          <SolutionScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: 'from-left' })}
          timing={linearTiming({ durationInFrames: t })}
        />

        <TransitionSeries.Sequence durationInFrames={VIDEO_CONFIG.modeA}>
          <ModeAScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-right' })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: t })}
        />

        <TransitionSeries.Sequence durationInFrames={VIDEO_CONFIG.modeB}>
          <ModeBScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: t })}
        />

        <TransitionSeries.Sequence durationInFrames={VIDEO_CONFIG.technology}>
          <TechnologyScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: 'from-right' })}
          timing={linearTiming({ durationInFrames: t })}
        />

        <TransitionSeries.Sequence durationInFrames={VIDEO_CONFIG.privacy}>
          <PrivacyScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: t })}
        />

        <TransitionSeries.Sequence durationInFrames={VIDEO_CONFIG.cta}>
          <CTAScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
