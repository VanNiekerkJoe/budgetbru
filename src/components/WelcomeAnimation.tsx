import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingCoin {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
}

const COIN_COLORS = [
  'hsl(324, 58%, 55%)',   // primary/pink
  'hsl(199, 52%, 32%)',   // accent/teal
  'hsl(210, 70%, 30%)',   // secondary/navy
  'hsl(324, 58%, 65%)',   // lighter pink
  'hsl(199, 52%, 45%)',   // lighter teal
];

const WelcomeAnimation: React.FC = () => {
  const [show, setShow] = useState(true);
  const [showWordmark, setShowWordmark] = useState(false);
  const [showTagline, setShowTagline] = useState(false);

  const coins: FloatingCoin[] = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      size: 14 + Math.random() * 14,
      delay: 0.2 + Math.random() * 0.8,
      duration: 1.8 + Math.random() * 1.2,
      color: COIN_COLORS[i % COIN_COLORS.length],
    })), []
  );

  useEffect(() => {
    const t1 = setTimeout(() => setShowWordmark(true), 600);
    const t2 = setTimeout(() => setShowTagline(true), 1400);
    const t3 = setTimeout(() => setShow(false), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const wordmark = [
    { char: 'B', color: 'hsl(324, 58%, 55%)', bold: true },
    { char: 'u', color: 'hsl(210, 40%, 98%)', bold: false },
    { char: 'd', color: 'hsl(210, 40%, 98%)', bold: false },
    { char: 'g', color: 'hsl(210, 40%, 98%)', bold: false },
    { char: 'e', color: 'hsl(210, 40%, 98%)', bold: false },
    { char: 't', color: 'hsl(210, 40%, 98%)', bold: false },
    { char: 'B', color: 'hsl(199, 52%, 45%)', bold: true },
    { char: 'r', color: 'hsl(324, 58%, 55%)', bold: false },
    { char: 'u', color: 'hsl(324, 58%, 55%)', bold: false },
  ];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.08, filter: 'blur(12px)' }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
        >
          {/* Mesh gradient background */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 30% 20%, hsl(324, 58%, 20%) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, hsl(199, 52%, 18%) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, hsl(222, 47%, 9%) 0%, hsl(222, 47%, 7%) 100%)',
            }}
            animate={{
              background: [
                'radial-gradient(ellipse at 30% 20%, hsl(324, 58%, 20%) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, hsl(199, 52%, 18%) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, hsl(222, 47%, 9%) 0%, hsl(222, 47%, 7%) 100%)',
                'radial-gradient(ellipse at 60% 30%, hsl(324, 58%, 18%) 0%, transparent 50%), radial-gradient(ellipse at 30% 70%, hsl(199, 52%, 20%) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, hsl(222, 47%, 9%) 0%, hsl(222, 47%, 7%) 100%)',
              ],
            }}
            transition={{ duration: 3, ease: 'easeInOut' }}
          />

          {/* Floating R coins */}
          {coins.map((coin) => (
            <motion.div
              key={coin.id}
              className="absolute flex items-center justify-center rounded-full font-black select-none pointer-events-none"
              style={{
                left: `${coin.x}%`,
                bottom: '-10%',
                width: coin.size * 2,
                height: coin.size * 2,
                fontSize: coin.size,
                color: coin.color,
                border: `2px solid ${coin.color}`,
                opacity: 0,
              }}
              animate={{
                y: [0, -500 - Math.random() * 300],
                opacity: [0, 0.6, 0.3, 0],
                rotate: [0, 360],
              }}
              transition={{
                delay: coin.delay,
                duration: coin.duration,
                ease: 'easeOut',
              }}
            >
              R
            </motion.div>
          ))}

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* 3D coin-flip B logo */}
            {!showWordmark && (
              <motion.div
                className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, hsl(324, 58%, 55%), hsl(324, 58%, 40%))',
                  boxShadow: '0 0 60px hsl(324, 58%, 55% / 0.5), 0 0 120px hsl(324, 58%, 55% / 0.2)',
                  perspective: '800px',
                }}
                initial={{ scale: 0.3, rotateY: 180, opacity: 0 }}
                animate={{ scale: 1, rotateY: 0, opacity: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 150 }}
              >
                <span className="text-5xl font-black" style={{ color: 'hsl(210, 40%, 98%)' }}>B</span>
              </motion.div>
            )}

            {/* Full wordmark */}
            {showWordmark && (
              <motion.div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-3">
                  {/* Mini logo */}
                  <motion.div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, hsl(324, 58%, 55%), hsl(324, 58%, 40%))',
                      boxShadow: '0 0 30px hsl(324, 58%, 55% / 0.4)',
                    }}
                    initial={{ scale: 1.6, x: 0 }}
                    animate={{ scale: 1, x: 0 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                  >
                    <span className="text-2xl font-black" style={{ color: 'hsl(210, 40%, 98%)' }}>B</span>
                  </motion.div>

                  {/* Letters */}
                  <div className="flex">
                    {wordmark.map((w, i) => (
                      <motion.span
                        key={i}
                        className={`text-5xl md:text-6xl ${w.bold ? 'font-black' : 'font-bold'}`}
                        style={{ color: w.color }}
                        initial={{ y: 20, opacity: 0, scale: 0.8 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        transition={{
                          delay: i * 0.04,
                          duration: 0.25,
                          type: 'spring',
                          stiffness: 300,
                          damping: 18,
                        }}
                      >
                        {w.char}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Tagline with blur-to-sharp */}
                {showTagline && (
                  <motion.p
                    className="text-lg md:text-xl font-medium tracking-wide"
                    style={{ color: 'hsl(210, 40%, 98% / 0.7)' }}
                    initial={{ opacity: 0, filter: 'blur(8px)', y: 8 }}
                    animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  >
                    You must budget, bru!
                  </motion.p>
                )}
              </motion.div>
            )}
          </div>

          {/* Bottom accent line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{ background: 'linear-gradient(90deg, hsl(324, 58%, 55%), hsl(210, 70%, 30%), hsl(199, 52%, 32%))' }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.1, duration: 2.5, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeAnimation;
