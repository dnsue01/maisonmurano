import { Cross } from "@/components/brand/cross";
import { cn } from "@/lib/utils";

const LAYERS = 9;

/** The cross turning in 3D: stacked layers give it thickness (same build as TIER CLUB's star). */
export function SpinningCross({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-block h-10 w-7 shrink-0 [container-type:size]", className)} aria-hidden="true">
      <span className="absolute inset-0 [perspective:400cqw]">
        <span className="animate-tc-spin absolute inset-0 [transform-style:preserve-3d]">
          {Array.from({ length: LAYERS }, (_, i) => {
            const face = i === 0 || i === LAYERS - 1;
            return (
              <Cross
                key={i}
                className="absolute inset-0 h-full w-full"
                style={{
                  transform: `translateZ(calc(${i - (LAYERS - 1) / 2} * 1.2cqw))`,
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
