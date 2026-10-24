"use client";

import { useEffect, useRef, useState } from "react";
import { HERO_CLIP } from "@/lib/videos";
import { isSlowConnection, whenIdle } from "@/lib/connection";

type YTPlayer = {
  mute(): void;
  playVideo(): void;
  seekTo(s: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  destroy(): void;
};
type YTNamespace = {
  Player: new (
    el: HTMLElement,
    opts: {
      host?: string;
      videoId: string;
      playerVars: Record<string, string | number>;
      events: { onReady?: (e: { target: YTPlayer }) => void; onStateChange?: (e: { data: number; target: YTPlayer }) => void };
    }
  ) => YTPlayer;
};
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YTNamespace> | null = null;
function loadYouTubeApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!apiPromise) {
    apiPromise = new Promise((resolve) => {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        resolve(window.YT!);
      };
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      s.async = true;
      document.head.appendChild(s);
    });
  }
  return apiPromise;
}

/**
 * Full-bleed hero clip: the brand's stand at ScrapWorld, muted and looping a
 * fixed segment of the vlog. Starts on its own (muted autoplay, forced again
 * on ready); the YouTube still covers the frame until the first frame plays.
 */
export function HeroVideos() {
  const mount = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const { id, start, end, title } = HERO_CLIP;

  useEffect(() => {
    // Slow link, data saver or reduced motion: keep the still, never load the player.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || isSlowConnection()) return;
    let player: YTPlayer | null = null;
    let timer = 0;
    let cancelled = false;

    // The player (~1 MB of YouTube JS) only loads after the page has painted.
    const cancelIdle = whenIdle(() => loadYouTubeApi().then((YT) => {
      if (cancelled || !mount.current) return;
      const el = document.createElement("div");
      mount.current.appendChild(el);
      player = new YT.Player(el, {
        host: "https://www.youtube-nocookie.com",
        videoId: id,
        playerVars: {
          autoplay: 1,
          mute: 1,
          start,
          end,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: (e) => {
            e.target.mute();
            e.target.seekTo(start, true);
            e.target.playVideo();
          },
          onStateChange: (e) => {
            // 1 = playing, 0 = ended: loop the segment rather than the whole video
            if (e.data === 1) setPlaying(true);
            if (e.data === 0) {
              e.target.seekTo(start, true);
              e.target.playVideo();
            }
          },
        },
      });
      timer = window.setInterval(() => {
        try {
          if (player && player.getCurrentTime() >= end - 0.4) player.seekTo(start, true);
        } catch {}
      }, 400);
    }));

    return () => {
      cancelled = true;
      cancelIdle();
      clearInterval(timer);
      try {
        player?.destroy();
      } catch {}
    };
  }, [id, start, end]);

  return (
    <div className="absolute inset-0 overflow-hidden [container-type:size]">
      {/* Still from YouTube's CDN: ~25 KB on phones, ~90 KB on desktop. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
        srcSet={`https://i.ytimg.com/vi/${id}/hqdefault.jpg 480w, https://i.ytimg.com/vi/${id}/maxresdefault.jpg 1280w`}
        sizes="100vw"
        alt=""
        fetchPriority="high"
        decoding="async"
        className={`absolute inset-0 h-full w-full scale-105 object-cover blur-[2px] transition-opacity duration-700 ${playing ? "opacity-0" : "opacity-70"}`}
      />
      <div
        ref={mount}
        title={title}
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000 [&>iframe]:h-full [&>iframe]:w-full ${playing ? "opacity-100" : "opacity-0"}`}
        style={{ width: "max(100cqw, 177.78cqh)", height: "max(100cqh, 56.25cqw)" }}
      />
    </div>
  );
}
