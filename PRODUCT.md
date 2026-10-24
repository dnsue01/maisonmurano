# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Primary: young Spanish streetwear buyers (mostly men, ~16–28) arriving from Instagram/TikTok link-in-bio on their phone, deciding whether a limited drop is worth buying before it sells out.
Secondary (for this project): the Maison Murano founders, who will evaluate this site as a redesign proposal.

## Product Purpose
A storefront redesign proposal for Maison Murano (maisonmurano.es), presented by Daniel Nsue to win the project. It must make the brand look as premium and intentional as its garments, using the brand's real catalogue and photography. Success = the founders want it as their store.

## Positioning
Maison Murano is a small, emerging Spanish streetwear brand "born in a room": heavyweight garments (450 GSM French terry, 480 GSM jorts, 250 GSM tees), custom details (logo double zips, detachable pockets, tiger camo, acid-washed tartan, cross motif), very limited units, sold in drops. Mindset copy: for dreamers who work, the doers not the watchers.

## Operating Context
- Data comes live from their Shopify store (public products.json of maisonmurano.es), same architecture as Daniel's TIER CLUB site: Next.js 16, Tailwind 4, next-intl (es/en), zustand cart.
- Deployed on Daniel's Vercel as a proposal link.
- Checkout is demo-only for the proposal: cart works, no payment hand-off.

## Capabilities and Constraints
- Catalogue, prices, stock, images and descriptions read from Shopify; no hardcoded product data.
- Many products are sold out; drops are limited — sold-out state must look intentional, not broken.
- No admin token: newsletter cannot write to Shopify; it is presentational.
- Must look right primarily on mobile (traffic from IG/TikTok).

## Brand Commitments
- Name: Maison Murano. Logo files on their Shopify CDN (logo_png.png, logo_MM).
- Socials: instagram.com/maisonmurano_, tiktok.com/@maisonmurano_, youtube.com/@Pablomurano.
- Voice: Spanish, direct, aspirational ("a dream in motion", "from the room to the world").
- Binding brief from Daniel: structure similar to TIER CLUB, but with Maison Murano's own style.

## Evidence on Hand
- Real product photography and on-model shots via Shopify product images.
- Campaign banners: banner_shopi_camis.jpg, banner_shopi_movil_rebajas.jpg (Shopify files).
- Real customer reviews (Judge.me) — 44 reviews; quotes may be reused verbatim with first name/initial. No invented reviews, press or stats.
- About-us story (their blog post) for brand copy.

## Product Principles
1. Their photography carries the site; layout frames it, never competes.
2. Scarcity is the story: drops, limited units, sold out = desirable.
3. Mobile first: the IG link-in-bio visitor decides in one thumb scroll.
4. Real data only: everything from their Shopify, nothing faked.
