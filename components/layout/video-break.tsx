import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ChromeLogo } from "@/components/layout/chrome-logo";

/**
 * Brand break (TIER CLUB's spinning-logo section): the Maison Murano cross
 * modelled in chrome, turning on black, with a line from the brand.
 */
export function SpinningLogoSection({ title, cta }: { title: string; cta: string }) {
  return (
    <section className="relative flex min-h-[86vh] w-full flex-col items-center justify-center overflow-hidden bg-ink px-4 py-20 text-cream">
      <div className="relative flex flex-col items-center gap-6 text-center">
        <ChromeLogo className="h-[min(62vw,420px)] w-[min(62vw,420px)]" />
        <h2 className="font-display max-w-4xl text-5xl leading-[0.95] md:text-8xl">{title}</h2>
        <Button asChild size="lg" className="mt-2 h-12 bg-cream px-8 text-ink hover:bg-khaki hover:text-ink">
          <Link href="/productos">{cta}</Link>
        </Button>
      </div>
    </section>
  );
}
