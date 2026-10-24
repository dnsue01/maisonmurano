"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine, Product, ProductVariant } from "@/lib/shopify";

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  addLine: (product: Product, variant: ProductVariant) => void;
  removeLine: (variantId: string) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
};

export const FREE_SHIPPING_THRESHOLD = 70;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      addLine: (product, variant) =>
        set((s) => {
          const existing = s.lines.find((l) => l.variantId === variant.id);
          if (existing) {
            return {
              isOpen: true,
              lines: s.lines.map((l) =>
                l.variantId === variant.id
                  ? { ...l, quantity: l.quantity + 1 }
                  : l
              ),
            };
          }
          const line: CartLine = {
            variantId: variant.id,
            productHandle: product.handle,
            title: product.title,
            variantTitle: variant.title,
            image: product.images[0],
            price: variant.price,
            quantity: 1,
            isGiftCard: product.isGiftCard,
          };
          return { isOpen: true, lines: [...s.lines, line] };
        }),
      removeLine: (variantId) =>
        set((s) => ({ lines: s.lines.filter((l) => l.variantId !== variantId) })),
      setQuantity: (variantId, quantity) =>
        set((s) => ({
          lines: s.lines
            .map((l) =>
              l.variantId === variantId ? { ...l, quantity } : l
            )
            .filter((l) => l.quantity > 0),
        })),
      clear: () => set({ lines: [] }),
    }),
    // skipHydration: the persisted cart is restored after mount (see Header)
    // so server HTML and first client render match.
    { name: "tc-cart", skipHydration: true }
  )
);

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.price.amount * l.quantity, 0);
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}
