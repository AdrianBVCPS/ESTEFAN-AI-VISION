import { Composition } from 'remotion';
import { PromoVideo, VIDEO_CONFIG } from './PromoVideo';
import { ReelsVideo, REELS_CONFIG } from './reels/ReelsVideo';

export const RemotionRoot = () => {
  return (
    <>
      {/* Video promocional 16:9 — YouTube/Web */}
      <Composition
        id="PromoVideo"
        component={PromoVideo}
        durationInFrames={VIDEO_CONFIG.totalFrames}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />

      {/* Reels de Instagram 9:16 — Redes sociales */}
      <Composition
        id="ReelsVideo"
        component={ReelsVideo}
        durationInFrames={REELS_CONFIG.totalFrames}
        fps={REELS_CONFIG.fps}
        width={REELS_CONFIG.width}
        height={REELS_CONFIG.height}
      />
    </>
  );
};
