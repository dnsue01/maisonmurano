import { useTranslations } from "next-intl";
import { LogoMark } from "@/components/brand/logo-mark";

export function AnnouncementBar() {
  const t = useTranslations("announcement");
  const items = [t("national"), t("dreamers"), t("limited"), t("room"), t("international")];
  const loop = [...items, ...items];

  return (
    <div className="overflow-hidden border-b border-ink/15 bg-ink text-cream">
      <div className="animate-marquee flex w-max items-center gap-6 py-2 whitespace-nowrap [--marquee-duration:44s]">
        {loop.map((text, i) => (
          <span key={i} className="flex items-center gap-6 text-xs font-semibold tracking-wider uppercase" aria-hidden={i >= items.length}>
            {text}
            <LogoMark className="h-3 w-3 shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
}
