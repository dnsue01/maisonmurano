import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { PageLoader } from "@/components/loader/page-loader";
import { shopify } from "@/lib/shopify";
import type { SearchItem } from "@/lib/search";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const products = await shopify.getProducts().catch(() => []);
  const searchItems: SearchItem[] = products.map(({ handle, title, price, images, tags }) => ({
    handle,
    title,
    price,
    image: images[0],
    tags,
  }));

  return (
    <>
      <PageLoader />
      <AnnouncementBar />
      <Header searchItems={searchItems} />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}
