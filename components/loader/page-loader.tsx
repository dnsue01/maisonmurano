"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SpinningStar } from "@/components/loader/spinning-star";

/**
 * Full-screen intro loader: only the spinning Maison Murano cross.
 * Shows once per session on first paint, then fades out.
 */
export function PageLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const alreadyLoaded = sessionStorage.getItem("mm-loaded");
    const done = () => {
      sessionStorage.setItem("mm-loaded", "1");
      setVisible(false);
    };
    const t = setTimeout(done, alreadyLoaded ? 0 : 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
        >
          <SpinningStar className="h-28 w-28 text-cream" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
