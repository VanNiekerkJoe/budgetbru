
import React, { useEffect, useRef } from 'react';

interface CursorParticleEffectProps {
  colors?: string[];
  size?: number;
  glowIntensity?: number;
}

const CursorParticleEffect: React.FC<CursorParticleEffectProps> = ({
  colors = ['#CA529A', '#106A94', '#304575'],
  size = 8,
  glowIntensity = 0.4
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePosition = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full window size
    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
      draw();
    };
    
    const draw = () => {
      if (!ctx || !canvas) return;
      
      // Clear previous frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const { x, y } = mousePosition.current;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Create radial gradient for soft glow
      const gradient = ctx.createRadialGradient(
        x, y, 0,
        x, y, size * 3
      );
      
      // Soft color transition
      gradient.addColorStop(0, `rgba(${hexToRgb(color)}, ${glowIntensity})`);
      gradient.addColorStop(1, `rgba(${hexToRgb(color)}, 0)`);
      
      // Draw glow effect
      ctx.beginPath();
      ctx.arc(x, y, size * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [colors, size, glowIntensity]);
  
  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  };
  
  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default CursorParticleEffect;

