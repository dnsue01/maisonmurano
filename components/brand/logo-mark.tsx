import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Maison Murano's eight-facet cross, traced from the brand's own logo file
 * (logo_MM.png on their Shopify) and rebuilt as clean geometry: one arm half
 * is drawn, the other seven come from its mirror and three rotations.
 */
export const LOGO_FACETS = [
  // outer sliver: arm tip → curved cut to the centre → inner corner → outer edge
  "M -204 -448 Q -33.5 -236.5 -9 -19 L -71 -80 L -87 -96 L -197 -429 Z",
  // main blade: arm tip → notch on the axis → axis → curved cut back to the tip
  "M -188 -450 L -5 -339 L -6 -75 Q -39 -253.5 -188 -450 Z",
];

export const LOGO_TRANSFORMS = [0, 90, 180, 270].flatMap((r) => [
  `rotate(${r}) scale(1,1)`,
  `rotate(${r}) scale(-1,1)`,
]);

export function LogoMark({ className, style, title }: { className?: string; style?: CSSProperties; title?: string }) {
  return (
    <svg
      viewBox="-456 -456 912 912"
      className={cn("h-8 w-8", className)}
      style={style}
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {LOGO_TRANSFORMS.map((t) => (
        <g key={t} transform={t}>
          {LOGO_FACETS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      ))}
    </svg>
  );
}
