"use client";

import { useEffect, useState } from "react";
import { HERO_SHORTS, embedUrl } from "@/lib/videos";

function Clip({ id, title, className = "" }: { id: string; title: string; className?: string }) {
  return (
    <div className={`relative h-full w-full overflow-hidden [container-type:size] ${className}`}>
      <iframe
        src={embedUrl(id, true)}
        title={title}
        tabIndex={-1}
        allow="autoplay; encrypted-media; picture-in-picture"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-0 opacity-85"
        style={{ width: "max(100cqw, 56.25cqh)", height: "max(100cqh, 177.78cqw)" }}
      />
    </div>
  );
}

/** One Short on mobile; the side clips only mount on desktop so phones never load them. */
export function HeroVideos() {
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const [a, b, c] = HERO_SHORTS;
  return (
    <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-3">
      {wide && <Clip id={b.id} title={b.title} className="md:col-start-1 md:row-start-1" />}
      <Clip id={a.id} title={a.title} className="md:col-start-2 md:row-start-1" />
      {wide && <Clip id={c.id} title={c.title} className="md:col-start-3 md:row-start-1" />}
    </div>
  );
}
