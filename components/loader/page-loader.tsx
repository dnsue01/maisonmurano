"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SpinningCross } from "@/components/loader/spinning-cross";

/** Intro: the cross turning on the wall, once per session. */
export function PageLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("mm-loaded") === "1";
    } catch {}
    const t = setTimeout(() => {
      try {
        sessionStorage.setItem("mm-loaded", "1");
      } catch {}
      setVisible(false);
    }, seen ? 0 : 1300);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-wall"
        >
          <SpinningCross className="h-28 w-20 text-flash" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
