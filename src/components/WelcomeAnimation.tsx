
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SYMBOLS = ['R', '₿', '◉', '◎', '⬡', 'R', '◉', 'R', '⬡', '◎', 'R', '₿', '◉', 'R', '◎'];

interface FloatingSymbol {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  symbol: string;
}

const WelcomeAnimation: React.FC = () => {
  const [show, setShow] = useState(true);
  const [phase, setPhase] = useState(1);

  const floatingSymbols: FloatingSymbol[] = useMemo(() =>
    SYMBOLS.map((symbol, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 60 + Math.random() * 40,
      size: 12 + Math.random() * 18,
      delay: Math.random() * 1.2,
      duration: 2 + Math.random() * 1.5,
      symbol,
    })), []
  );

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(2), 900);
    const t2 = setTimeout(() => setPhase(3), 2200);
    const t3 = setTimeout(() => setShow(false), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const wordmark = [
    { char: 'B', color: 'text-theme-pink', delay: 0 },
    { char: 'u', color: 'text-theme-indigo', delay: 0.05 },
    { char: 'd', color: 'text-theme-indigo', delay: 0.1 },
    { char: 'g', color: 'text-theme-indigo', delay: 0.15 },
    { char: 'e', color: 'text-theme-indigo', delay: 0.2 },
    { char: 't', color: 'text-theme-indigo', delay: 0.25 },
    { char: 'B', color: 'text-theme-teal', delay: 0.35 },
    { char: 'r', color: 'text-theme-pink', delay: 0.4 },
    { char: 'u', color: 'text-theme-pink', delay: 0.45 },
  ];

  const tagline = "You must budget, bru!";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
          style={{ background: 'radial-gradient(ellipse at center, #1a1f4e 0%, #0a0e27 60%, #0d1233 100%)' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.15 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Floating symbols */}
          {floatingSymbols.map((s) => (
            <motion.span
              key={s.id}
              className="absolute font-bold pointer-events-none select-none"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                fontSize: s.size,
                color: 'rgba(202, 82, 154, 0.15)',
              }}
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: -300 - Math.random() * 200, opacity: [0, 0.4, 0.2, 0] }}
              transition={{ delay: s.delay, duration: s.duration, ease: 'easeOut' }}
            >
              {s.symbol}
            </motion.span>
          ))}

          {/* Pulsing rings */}
          {phase >= 2 && [0, 1, 2].map((i) => (
            <motion.div
              key={`ring-${i}`}
              className="absolute rounded-full border border-theme-pink/20"
              initial={{ width: 40, height: 40, opacity: 0.6 }}
              animate={{ width: 400 + i * 100, height: 400 + i * 100, opacity: 0 }}
              transition={{ delay: i * 0.3, duration: 1.5, ease: 'easeOut' }}
              style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            />
          ))}

          {/* Phase 1: Glowing B */}
          {phase === 1 && (
            <motion.span
              className="text-8xl font-black text-theme-pink"
              style={{
                textShadow: '0 0 40px rgba(202,82,154,0.8), 0 0 80px rgba(202,82,154,0.4)',
              }}
              initial={{ y: -120, opacity: 0, scale: 0.5 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            >
              B
            </motion.span>
          )}

          {/* Phase 2+: Full wordmark */}
          {phase >= 2 && (
            <motion.div className="flex flex-col items-center">
              {/* Wordmark with shimmer */}
              <div className="relative">
                <div className="flex">
                  {wordmark.map((w, i) => (
                    <motion.span
                      key={i}
                      className={`text-6xl md:text-7xl font-black ${w.color}`}
                      style={{
                        textShadow: w.char === 'B'
                          ? '0 0 30px rgba(202,82,154,0.6), 0 0 60px rgba(202,82,154,0.3)'
                          : '0 2px 8px rgba(0,0,0,0.3)',
                      }}
                      initial={{ y: 30, opacity: 0, scale: 0.7 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      transition={{ delay: w.delay, duration: 0.3, type: 'spring', stiffness: 300, damping: 15 }}
                    >
                      {w.char}
                    </motion.span>
                  ))}
                </div>
                {/* Shimmer sweep */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)',
                    backgroundSize: '200% 100%',
                  }}
                  initial={{ backgroundPosition: '-100% 0' }}
                  animate={{ backgroundPosition: '200% 0' }}
                  transition={{ delay: 0.5, duration: 0.8, ease: 'easeInOut' }}
                />
              </div>

              {/* Tagline typewriter */}
              <motion.p
                className="mt-4 text-lg md:text-xl font-medium tracking-wide"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                {tagline.split('').map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 + i * 0.04, duration: 0.05 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.p>
            </motion.div>
          )}

          {/* Bottom accent line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{ background: 'linear-gradient(90deg, #CA529A, #304575, #106A94)' }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2, duration: 3, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeAnimation;
