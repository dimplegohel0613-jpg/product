"use client";

import { motion, AnimatePresence } from "framer-motion";

interface FloatingPanelProps {
  num: string;
  title: string;
  desc: string;
}

export default function FloatingPanel({ num, title, desc }: FloatingPanelProps) {
  return (
    <div className="fixed bottom-[15%] right-6 lg:right-10 z-50">
      <AnimatePresence mode="wait">
        <motion.div
          key={num}
          className="w-72 lg:w-80 overflow-hidden"
          style={{ borderRadius: "20px" }}
          initial={{ opacity: 0, x: 32, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 32, scale: 0.9 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 22,
            mass: 0.9,
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.6)",
              backdropFilter: "blur(30px)",
              WebkitBackdropFilter: "blur(30px)",
              border: "1.5px solid rgba(200,164,109,0.45)",
              boxShadow: "0 16px 56px rgba(200,164,109,0.18), inset 0 1px 0 rgba(255,255,255,0.6)",
              borderRadius: "20px",
              padding: "24px 28px",
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <motion.span
                className="w-2 h-2 rounded-full bg-gold inline-block"
                initial={{ scale: 0.6, opacity: 0.3 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
              <span className="text-gold text-[11px] tracking-[0.35em] uppercase font-medium">
                {num}
              </span>
            </div>

            <motion.h2
              key={`t-${num}`}
              className="font-serif text-2xl md:text-3xl leading-tight"
              style={{ color: "#1a1510" }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              {title}
            </motion.h2>

            <div className="w-10 h-[1.5px] bg-gold mt-4 mb-4" />

            <motion.p
              key={`d-${num}`}
              className="text-xs leading-relaxed tracking-wide font-light line-clamp-3"
              style={{ color: "#3a3028" }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {desc}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
