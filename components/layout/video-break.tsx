import { Link } from "@/i18n/navigation";
import { SpinningCross } from "@/components/loader/spinning-cross";

/** Brand break on a red field: the cross turning, the manifesto in tattoo lettering. */
export function BrandBreak({ line1, line2, cta }: { line1: string; line2: string; cta: string }) {
  return (
    <section className="relative flex min-h-[78svh] w-full flex-col items-center justify-center overflow-hidden bg-flash px-4 py-24 text-paper">
      <SpinningCross className="pointer-events-none absolute h-[120vw] w-[86vw] text-ink opacity-[0.13] md:h-[70vw] md:w-[50vw]" />
      <div className="relative flex flex-col items-center gap-9 text-center">
        <SpinningCross className="h-24 w-16 text-ink" />
        <h2 className="font-display text-[clamp(3.25rem,10vw,6rem)] leading-[0.95]">
          <span className="block">{line1}</span>
          <span className="block text-ink">{line2}</span>
        </h2>
        <Link
          href="/productos"
          className="font-label inline-flex h-13 items-center border-2 border-ink bg-ink px-8 text-[14px] text-paper transition-colors hover:bg-paper hover:text-ink"
        >
          {cta}
        </Link>
      </div>
    </section>
  );
}
