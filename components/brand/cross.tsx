import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/** Maison Murano cross (the "Logo Cross" motif): a flared Latin cross, drawn like flash linework. */
export function Cross({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 40 56" className={cn("h-8 w-6", className)} style={style} fill="currentColor" aria-hidden="true">
      <path d="M17 1h6l-.6 4.2a3 3 0 0 0 3 3.4l.6-.1L36 10v8l-9.5-1.3a3 3 0 0 0-3.4 3l.6 30L24 55h-8l.3-5.3.6-30a3 3 0 0 0-3.4-3L4 18v-8l10-1.4a3 3 0 0 0 2.6-3.4z" />
    </svg>
  );
}
