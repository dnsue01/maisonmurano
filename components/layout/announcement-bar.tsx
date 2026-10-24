import { useTranslations } from "next-intl";
import { Cross } from "@/components/brand/cross";

export function AnnouncementBar() {
  const t = useTranslations("announcement");
  const items = [t("national"), t("dreamers"), t("limited"), t("room"), t("international")];
  const loop = [...items, ...items];

  return (
    <div className="overflow-hidden border-b border-paper/10 bg-flash text-paper">
      <div className="animate-marquee flex w-max items-center gap-7 py-2 whitespace-nowrap [--marquee-duration:46s]">
        {loop.map((text, i) => (
          <span key={i} className="font-label flex items-center gap-7 text-[11px] tracking-[0.16em]" aria-hidden={i >= items.length}>
            {text}
            <Cross className="h-3 w-2 shrink-0 text-ink" />
          </span>
        ))}
      </div>
    </div>
  );
}
