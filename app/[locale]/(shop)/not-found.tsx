import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { SpinningStar } from "@/components/loader/spinning-star";

export default async function NotFound() {
  const t = await getTranslations("nav");
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <SpinningStar className="h-16 w-16 text-ink" />
      <h1 className="font-display text-6xl uppercase md:text-8xl">404</h1>
      <Button asChild>
        <Link href="/">{t("shop")}</Link>
      </Button>
    </div>
  );
}
