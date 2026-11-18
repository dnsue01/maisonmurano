# Maison Murano

Propuesta de rediseño para una marca de streetwear. La web combina productos destacados, el relato de la marca y un lookbook. El checkout de la propuesta es de demostración.

[Visitar la web](https://maisonmurano-lovat.vercel.app)

Tienda en Next.js 16 + Tailwind 4 + next-intl, sobre la base de TIER CLUB.
El catálogo (productos, precios, stock y fotos) se lee en directo de la
tienda Shopify de la marca (`SHOPIFY_STORE_DOMAIN=maisonmurano.es`, endpoint
público `products.json`). El checkout es demo en la propuesta.

```bash
npm install
SHOPIFY_STORE_DOMAIN=maisonmurano.es npm run dev
```
