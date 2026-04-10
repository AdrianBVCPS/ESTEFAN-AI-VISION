import { AbsoluteFill } from 'remotion';
import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { ReelsHookScene } from './scenes/ReelsHook';
import { ReelsBarbershopScene } from './scenes/ReelsBarbershop';
import { ReelsProblemScene } from './scenes/ReelsProblem';
import { ReelsSolutionScene } from './scenes/ReelsSolution';
import { ReelsAIScanScene } from './scenes/ReelsAIScan';
import { ReelsScissorsScene } from './scenes/ReelsScissors';
import { ReelsGaliciaScene } from './scenes/ReelsGalicia';
import { ReelsCTAScene } from './scenes/ReelsCTA';

export const REELS_CONFIG = {
  fps: 30,
  width: 1080,
  height: 1920,
  // Duraciones en frames
  hook: 75,         // 2.5s
  barbershop: 180,  // 6s — Veo 3
  problem: 105,     // 3.5s
  solution: 135,    // 4.5s
  aiScan: 180,      // 6s
  scissors: 150,    // 5s — Veo 3
  galicia: 150,     // 5s
  cta: 180,         // 6s
  transition: 15,
  get totalFrames() {
    const scenes = this.hook + this.barbershop + this.problem + this.solution +
      this.aiScan + this.scissors + this.galicia + this.cta;
    const transitions = this.transition * 7; // 7 transiciones entre 8 escenas
    return scenes - transitions;
  }
};

export const ReelsVideo = () => {
  const t = REELS_CONFIG.transition;
  return (
    <AbsoluteFill style={{ background: '#0D0D1A' }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={REELS_CONFIG.hook}>
          <ReelsHookScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: t })}
        />

        <TransitionSeries.Sequence durationInFrames={REELS_CONFIG.barbershop}>
          <ReelsBarbershopScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-bottom' })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: t })}
        />

        <TransitionSeries.Sequence durationInFrames={REELS_CONFIG.problem}>
          <ReelsProblemScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: t })}
        />

        <TransitionSeries.Sequence durationInFrames={REELS_CONFIG.solution}>
          <ReelsSolutionScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: 'from-top' })}
          timing={linearTiming({ durationInFrames: t })}
        />

        <TransitionSeries.Sequence durationInFrames={REELS_CONFIG.aiScan}>
          <ReelsAIScanScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-bottom' })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: t })}
        />

        <TransitionSeries.Sequence durationInFrames={REELS_CONFIG.scissors}>
          <ReelsScissorsScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: t })}
        />

        <TransitionSeries.Sequence durationInFrames={REELS_CONFIG.galicia}>
          <ReelsGaliciaScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: 'from-bottom' })}
          timing={linearTiming({ durationInFrames: t })}
        />

        <TransitionSeries.Sequence durationInFrames={REELS_CONFIG.cta}>
          <ReelsCTAScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
