
import React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface BadgeGlowProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  glowColor?: string;
  className?: string;
}

export function BadgeGlow({
  children,
  className,
  glowColor = "rgba(202, 82, 154, 0.6)", // Default to theme-pink
  ...props
}: BadgeGlowProps) {
  return (
    <motion.div
      initial={{ opacity: 0.8, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative inline-flex items-center"
      {...props}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: glowColor,
          filter: "blur(8px)",
          opacity: 0.7,
          zIndex: -1,
        }}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />
      <div className={cn("relative z-10", className)}>{children}</div>
    </motion.div>
  );
}
