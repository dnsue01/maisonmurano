import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { SpinningCross } from "@/components/loader/spinning-cross";

export default async function NotFound() {
  const t = await getTranslations("nav");
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <SpinningCross className="h-20 w-14 text-flash" />
      <h1 className="font-display text-6xl md:text-8xl">404</h1>
      <Button asChild>
        <Link href="/">{t("shop")}</Link>
      </Button>
    </div>
  );
}
