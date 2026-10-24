import { cn } from "@/lib/utils";

/** "Maison Murano" set in blackletter, the brand's tattoo-lettering voice. */
export function Wordmark({ className, stacked = false }: { className?: string; stacked?: boolean }) {
  return (
    <span className={cn("font-display select-none leading-[0.85]", stacked ? "flex flex-col" : "", className)} aria-label="Maison Murano">
      <span aria-hidden>Maison</span>
      {stacked ? <span aria-hidden>Murano</span> : <span aria-hidden> Murano</span>}
    </span>
  );
}
