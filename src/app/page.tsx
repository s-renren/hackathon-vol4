"use client";

import OpeningShutter from "@/components/Shutter/Shutter";
import { HomeContent } from "@/features/Home/Home";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function HomePage() {
  const [isShutterVisible, setIsShutterVisible] = useState(true);

  return (
    <div className="min-h-svh">
      <div className="flex min-h-svh items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          {isShutterVisible && (
            <OpeningShutter onFinish={() => setIsShutterVisible(false)} />
          )}
          <div style={{ display: isShutterVisible ? "none" : "block" }}>
            <AnimatePresence>
              {!isShutterVisible && (
                <motion.div
                  key="home-content"
                  initial={{ opacity: 0, y: 24, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{
                    duration: 0.35,
                    ease: "easeOut",
                  }}
                >
                  <HomeContent />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
