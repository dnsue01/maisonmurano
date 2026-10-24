import { LogoMark } from "@/components/brand/logo-mark";
import { cn } from "@/lib/utils";

const LAYERS = 9;

/** The Maison Murano cross turning in 3D: stacked layers give it thickness. */
export function SpinningStar({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-block h-8 w-8 shrink-0 [container-type:size]", className)} aria-hidden="true">
      <span className="absolute inset-0 [perspective:400cqw]">
        <span className="animate-tc-spin absolute inset-0 [transform-style:preserve-3d]">
          {Array.from({ length: LAYERS }, (_, i) => {
            const face = i === 0 || i === LAYERS - 1;
            return (
              <LogoMark
                key={i}
                className="absolute inset-0 h-full w-full"
                style={{
                  transform: `translateZ(calc(${i - (LAYERS - 1) / 2} * 0.9cqw))`,
                  filter: face ? undefined : "brightness(0.55)",
                }}
              />
            );
          })}
        </span>
      </span>
    </span>
  );
}
