import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, Navigation, Zap, Clock, Menu } from 'lucide-react';

interface TutorialStep {
  targetId: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  position: 'top' | 'bottom';
}

interface TutorialGuideProps {
  onComplete: () => void;
  onSkip: () => void;
}

const STEPS: TutorialStep[] = [
  {
    targetId: 'tutorial-balance',
    icon: <Wallet size={18} />,
    title: 'Your Balance',
    description: 'See your income, spending, and what\'s left at a glance.',
    position: 'bottom',
  },
  {
    targetId: 'tutorial-quick-nav',
    icon: <Navigation size={18} />,
    title: 'Quick Access',
    description: 'Tap any icon to jump to expenses, savings, tips & more.',
    position: 'bottom',
  },
  {
    targetId: 'tutorial-quick-expense',
    icon: <Zap size={18} />,
    title: 'Add Expenses Fast',
    description: 'Track spending in seconds — pick a category and amount.',
    position: 'top',
  },
  {
    targetId: 'tutorial-recent-activity',
    icon: <Clock size={18} />,
    title: 'Recent Activity',
    description: 'All your latest transactions show up here automatically.',
    position: 'top',
  },
  {
    targetId: 'tutorial-bottom-nav',
    icon: <Menu size={18} />,
    title: 'Navigate the App',
    description: 'Use the bottom bar to move between sections. Tap + to add quickly!',
    position: 'top',
  },
];

const PADDING = 8;
const BORDER_RADIUS = 16;

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const TutorialGuide: React.FC<TutorialGuideProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<Rect | null>(null);
  const [windowSize, setWindowSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const overlayRef = useRef<HTMLDivElement>(null);

  const measureTarget = useCallback(() => {
    const step = STEPS[currentStep];
    const el = document.querySelector(`[data-tutorial="${step.targetId}"]`);
    if (el) {
      const r = el.getBoundingClientRect();
      setTargetRect({
        x: r.left - PADDING,
        y: r.top - PADDING,
        width: r.width + PADDING * 2,
        height: r.height + PADDING * 2,
      });
      // Scroll element into view if needed
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      setTargetRect(null);
    }
  }, [currentStep]);

  useEffect(() => {
    // Small delay to let page render
    const timer = setTimeout(measureTarget, 300);
    const handleResize = () => {
      setWindowSize({ w: window.innerWidth, h: window.innerHeight });
      measureTarget();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [measureTarget]);

  const next = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const step = STEPS[currentStep];
  const isLast = currentStep === STEPS.length - 1;

  // Tooltip positioning
  const getTooltipStyle = (): React.CSSProperties => {
    if (!targetRect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    const tooltipWidth = Math.min(280, windowSize.w - 32);
    let left = targetRect.x + targetRect.width / 2 - tooltipWidth / 2;
    left = Math.max(16, Math.min(left, windowSize.w - tooltipWidth - 16));

    if (step.position === 'bottom') {
      return { top: targetRect.y + targetRect.height + 12, left, width: tooltipWidth };
    }
    return { bottom: windowSize.h - targetRect.y + 12, left, width: tooltipWidth };
  };

  // SVG cutout mask
  const renderOverlay = () => {
    const { w, h } = windowSize;
    return (
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
        <defs>
          <mask id="spotlight-mask">
            <rect x="0" y="0" width={w} height={h} fill="white" />
            {targetRect && (
              <rect
                x={targetRect.x}
                y={targetRect.y}
                width={targetRect.width}
                height={targetRect.height}
                rx={BORDER_RADIUS}
                ry={BORDER_RADIUS}
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0" y="0" width={w} height={h}
          fill="rgba(0,0,0,0.7)"
          mask="url(#spotlight-mask)"
        />
        {/* Glow ring around cutout */}
        {targetRect && (
          <rect
            x={targetRect.x - 2}
            y={targetRect.y - 2}
            width={targetRect.width + 4}
            height={targetRect.height + 4}
            rx={BORDER_RADIUS + 2}
            ry={BORDER_RADIUS + 2}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            opacity="0.6"
            className="animate-pulse"
          />
        )}
      </svg>
    );
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100]"
      onClick={next}
    >
      {renderOverlay()}

      {/* Tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: step.position === 'bottom' ? -10 : 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          style={getTooltipStyle()}
          className="absolute z-[101]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-card border border-border rounded-2xl shadow-2xl p-4 relative">
            {/* Skip button */}
            <button
              onClick={(e) => { e.stopPropagation(); onSkip(); }}
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-muted/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={12} />
            </button>

            {/* Content */}
            <div className="flex items-center gap-2.5 mb-2 pr-6">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                {step.icon}
              </div>
              <h3 className="font-bold text-sm text-foreground">{step.title}</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              {step.description}
            </p>

            {/* Footer: dots + button */}
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentStep
                        ? 'w-4 bg-primary'
                        : i < currentStep
                        ? 'w-1.5 bg-primary/40'
                        : 'w-1.5 bg-muted-foreground/20'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold active:scale-95 transition-transform"
              >
                {isLast ? "Let's Go!" : 'Next'}
              </button>
            </div>

            {/* Tap hint */}
            <p className="text-center text-[10px] text-muted-foreground/50 mt-2">
              Tap anywhere to continue
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TutorialGuide;
