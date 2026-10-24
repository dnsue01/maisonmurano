import { useId } from "react";
import { cn } from "@/lib/utils";

/** MAISON MURANO in varsity block letters (the hoodie's back lettering). */
export function Wordmark({ className, stacked = false }: { className?: string; stacked?: boolean }) {
  return (
    <span
      className={cn("font-display select-none leading-[0.9]", stacked ? "flex flex-col" : "", className)}
      aria-label="Maison Murano"
    >
      <span aria-hidden>Maison</span>
      {stacked ? <span aria-hidden>Murano</span> : <span aria-hidden>&nbsp;Murano</span>}
    </span>
  );
}

/**
 * "MAISONMURANO" set on an arch, exactly like the felt letters sewn across
 * the back of the Tiger Camo hoodie.
 */
export function ArchedWordmark({ className, text = "MAISONMURANO" }: { className?: string; text?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 1000 400" className={cn("h-auto w-full", className)} role="img" aria-label="Maison Murano">
      <defs>
        <path id={`arch-${id}`} d="M 60 380 Q 500 -10 940 380" />
      </defs>
      <text
        fill="currentColor"
        fontFamily="var(--font-varsity), serif"
        fontSize="118"
        textAnchor="middle"
      >
        <textPath href={`#arch-${id}`} startOffset="50%" textLength="1010" lengthAdjust="spacingAndGlyphs">
          {text}
        </textPath>
      </text>
    </svg>
  );
}
