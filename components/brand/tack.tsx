import { cn } from "@/lib/utils";

/** Thumbtack pinning a flash sheet to the parlour wall. */
export function Tack({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-6 w-6 drop-shadow-[0_3px_3px_rgba(0,0,0,0.6)]", className)} aria-hidden>
      <circle cx="12" cy="12" r="9" fill="#b8261b" stroke="#16110d" strokeWidth="2" />
      <circle cx="9" cy="9" r="2.5" fill="#f2a093" opacity="0.8" />
    </svg>
  );
}
