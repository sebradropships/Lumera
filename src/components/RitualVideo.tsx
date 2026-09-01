"use client";

import { useEffect, useRef, useState } from "react";
import type { ProductVideo } from "@/data/media";
import { PauseIcon, PlayIcon } from "@/components/Icons";

/**
 * Ambient clip for the "how it works" panel.
 *
 * Muted, looping and inline, which is also what iOS requires before it will
 * autoplay at all. Playback is started from an effect rather than the autoplay
 * attribute so it can be skipped under prefers-reduced-motion, and a pause
 * control is always present: WCAG 2.2.2 requires a way to stop any motion that
 * starts on its own, runs past five seconds and sits alongside other content.
 */
export default function RitualVideo({ video }: { video: ProductVideo }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Autoplay can still be refused (low power mode, browser policy); the poster
    // then stays up and the button offers playback rather than the panel dying.
    el.play().then(
      () => setPlaying(true),
      () => setPlaying(false),
    );
  }, []);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused)
      el.play().then(
        () => setPlaying(true),
        () => {},
      );
    else {
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <video
        ref={ref}
        src={video.src}
        poster={video.poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={video.alt}
        className="absolute inset-0 h-full w-full object-cover"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute bottom-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/75 text-ink backdrop-blur-sm transition-colors duration-300 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink"
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>
    </>
  );
}
