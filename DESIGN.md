---
name: Maison Murano
description: Streetwear storefront on the TIER CLUB structure, dressed in the Tiger Camo hoodie — varsity lettering, camo palette, chrome cross
colors:
  cream: "#eeebe3"
  secondary: "#e1ddd1"
  ink: "#151512"
  olive: "#3c4a2e"
  olive-deep: "#26301d"
  khaki: "#b4a47c"
  rust: "#8f3a1f"
  muted: "#5f5b52"
typography:
  display:
    fontFamily: "Graduate, serif"
    fontSize: "4.5rem"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "0.01em"
  subline:
    fontFamily: "Archivo, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "Archivo, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  nav:
    fontFamily: "Archivo, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.025em"
rounded:
  none: "0px"
spacing:
  section: "96px"
  section-mobile: "64px"
  gutter: "24px"
  gutter-mobile: "16px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.none}"
    height: "48px"
  button-on-dark:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    height: "48px"
  button-on-dark-hover:
    backgroundColor: "{colors.khaki}"
  product-card:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
---

## Overview
Built on Daniel's TIER CLUB storefront (same structure, components and rhythm) and dressed in Maison Murano's own Tiger Camo hoodie: the varsity felt lettering of its back becomes the display type, its camo sets the palette, and the brand's eight-facet cross is traced from their logo file and modelled in chrome. Real Shopify photography and the founder's own YouTube carry the content.

## Colors
Light bone ground (`cream`) with `ink` text and 1px ink borders, as in TIER CLUB. `olive` (camo green) takes TIER's red role: sublines, accents, the newsletter field. `khaki` is hover on dark buttons; `rust` is reserved for errors. Dark bands (`ink`) hold the hero videos and the chrome cross break.

## Typography
Graduate (varsity block, always uppercase) for display: section titles, wordmark, the arched hero lettering. Archivo italic 600 for the subline under each title (TIER's script line). Archivo for body, nav and product names.

## Layout
TIER CLUB's page order: marquee, sticky centred header, full-bleed video hero, featured grid, lookbook rail, logo break, reviews, founder vlogs, about collage, newsletter, footer. Max width 1280px, 16/24px gutters, 64/96px sections, grids 2 → 4 columns.

## Elevation & Depth
Flat. Depth only in the chrome cross (real 3D, WebGL) and the layered spinning cross used for the loader and newsletter.

## Shapes
Square corners, 1px ink borders on cards, photos and tiles. The cross mark is exact traced geometry (two facets × mirror × four rotations).

## Components
- Hero: three muted looping YouTube Shorts (one on mobile), arched varsity "MAISONMURANO", cross mark, subline, cream CTA.
- Product card: bordered frame, cut-out PNGs contained on `secondary`, photos fill, hover swaps to the second image, SOLD OUT badge.
- Chrome cross break: extruded, bevelled, metal cross turning on ink; flat-mark fallback without WebGL or with reduced motion.
- Vlogs: click-to-play YouTube tiles (no player loads until pressed).

## Do's and Don'ts
- Do keep every product fact, price and photo live from Shopify.
- Do set display type in Graduate uppercase only; never for body copy.
- Don't recolour the cross or distort its geometry; use `LogoMark`.
- Don't invent reviews or stats: only real Judge.me quotes.
