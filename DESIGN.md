---
name: Maison Murano
description: Streetwear storefront as a tattoo flash sheet pinned to a parlour wall
colors:
  wall: "#0e0c0b"
  wall-2: "#191513"
  paper: "#ebe2cc"
  paper-2: "#ddd2b8"
  ink: "#16110d"
  flash: "#b8261b"
  bottle: "#1f5a3e"
  mustard: "#dca52b"
  smoke: "#a39a8f"
typography:
  display:
    fontFamily: "Pirata One, serif"
    fontSize: "clamp(3rem, 8vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: "0em"
  label:
    fontFamily: "Archivo Narrow, Archivo, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.08em"
  body:
    fontFamily: "Archivo, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  none: "0px"
spacing:
  section: "112px"
  section-mobile: "80px"
  gutter: "24px"
  gutter-mobile: "16px"
components:
  button-primary:
    backgroundColor: "{colors.flash}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  button-ghost-paper:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    height: "48px"
  size-chip:
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    height: "36px"
  size-chip-selected:
    backgroundColor: "{colors.mustard}"
    textColor: "{colors.ink}"
  flash-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
---

## Overview
The site is a tattoo parlour wall at night: a near-black wall (`wall`) carrying pinned flash sheets on paper. Every garment is a numbered flash design (Nº = its place in the brand's release history, oldest = 01). The drop is the sheet you pick from; sold-out designs live in a quieter archive. Real Shopify photography carries the page; the world frames it.

## Colors
Full palette with named jobs. `wall`/`wall-2` own the ground and quiet bands. `paper` is reserved for flash material: sheets, framed designs, review notes, thumbnails. `flash` red carries the announcement bar, the brand break field, primary actions, design numbers and sold-out stamps. `bottle` green owns the newsletter field and the "picked" stamp. `mustard` is prices on the wall, focus rings, hover fills and selection states. `smoke` is secondary text on the wall (≥6:1 on `wall`).

## Typography
Pirata One (blackletter, tattoo lettering) for display only, never uppercase, max 6rem. Archivo Narrow 700 uppercase tracked for labels, buttons, numbers and chips. Archivo for body and product names. Numbers use tabular figures.

## Layout
Max width 1280px with 16px / 24px gutters. Sections 80px mobile, 112px desktop. Product grids: 2 columns mobile, 4 on the sheet, 6 in the archive. Horizontal snap rails for lookbook and reviews. Mobile first: the first viewport shows the campaign, the wordmark and the top of the flash sheet.

## Elevation & Depth
Only pinned sheets lift off the wall: soft, offset, blurred shadow (`.sheet-shadow`) plus a slight tilt (−0.5° home, +0.4° about). Everything else is flat.

## Shapes
Square corners everywhere. Flash frames are a 2px ink border with an inner paper gap and 1px ink hairline (`.flash-frame`). Brand marks are authored SVG: the flared cross, the banner ribbon, thumbtacks.

## Components
- Flash card: paper frame, cut-out PNGs contained with multiply blend on paper, photos fill; Nº tag top-left on paper; hover swaps to the on-model photo; sold-out gets a rotated red stamp; optional quick-add size grid (4 columns) that stamps "Elegida" and opens the cart.
- Flash sheet: paper panel with two thumbtacks, blackletter title, ink rule, pinned-in entrance animation (`.animate-pin`).
- Brand break: red field, slowly spinning 3D cross, two-line manifesto, ink button.
- Announcement marquee: red band, label type, ink crosses.

## Do's and Don'ts
- Do pull every product fact, price and photo from Shopify; never hardcode catalogue data.
- Do keep paper for flash material only; the page ground stays the wall.
- Don't set blackletter in uppercase or below 2rem.
- Don't add eyebrows/kickers above headings, gradient text or rounded corners.
- Don't invent reviews or stats: only real Judge.me quotes.
