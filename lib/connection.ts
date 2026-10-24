/**
 * True when the visitor asked to save data or is on a slow link (2G/3G).
 * Heavy media (YouTube player, WebGL logo) is skipped there; stills stay.
 */
export function isSlowConnection(): boolean {
  if (typeof navigator === "undefined") return false;
  const c = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string; downlink?: number };
  }).connection;
  if (!c) return false;
  if (c.saveData) return true;
  if (c.effectiveType && /(^|-)2g|3g/.test(c.effectiveType)) return true;
  return typeof c.downlink === "number" && c.downlink > 0 && c.downlink < 1.5;
}

/** Runs `fn` once the page has finished loading and the main thread is idle. */
export function whenIdle(fn: () => void): () => void {
  let idleId: number | undefined;
  let timeoutId: number | undefined;
  const schedule = () => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) idleId = w.requestIdleCallback(fn, { timeout: 2500 });
    else timeoutId = window.setTimeout(fn, 600);
  };
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });
  return () => {
    window.removeEventListener("load", schedule);
    const w = window as Window & { cancelIdleCallback?: (id: number) => void };
    if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
    if (timeoutId !== undefined) clearTimeout(timeoutId);
  };
}
