import { cn } from "@/lib/utils";

/** Old-school tattoo banner scroll with text set across it. */
export function Ribbon({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("relative inline-flex items-center justify-center px-12 py-2.5 md:px-16", className)}>
      <svg viewBox="0 0 400 60" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        {/* folded tails */}
        <path d="M0 14h46l-10 16 10 16H0l14-16z" fill="#7d1912" stroke="#16110d" strokeWidth="3" strokeLinejoin="round" />
        <path d="M400 14h-46l10 16-10 16h46l-14-16z" fill="#7d1912" stroke="#16110d" strokeWidth="3" strokeLinejoin="round" />
        <path d="M36 46l10 8V38z M364 46l-10 8V38z" fill="#16110d" />
        {/* body */}
        <path d="M36 6c60 6 268 6 328 0v40c-60 6-268 6-328 0z" fill="#b8261b" stroke="#16110d" strokeWidth="3" strokeLinejoin="round" />
      </svg>
      <span className="relative font-label text-sm tracking-[0.18em] text-paper md:text-base">{children}</span>
    </span>
  );
}
