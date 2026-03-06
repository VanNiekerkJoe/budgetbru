
import React, { useEffect, useRef, memo } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
}

interface ParticleBackgroundProps {
  count?: number;
  theme?: 'finances' | 'jols' | 'default';
  className?: string;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = memo(({ 
  count = 15, 
  theme = 'default',
  className = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);
  
  const getThemeColors = () => {
    switch(theme) {
      case 'finances':
        return ['#CA529A', '#CA529A80'];
      case 'jols':
        return ['#106A94', '#106A9480'];
      default:
        return ['#CA529A', '#304575', '#106A94'];
    }
  };
  
  useEffect(() => {
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const handleResize = () => {
      if (canvas) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    const colors = getThemeColors();
    particles.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    
    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.current.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });
      
      animationFrameId.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [count, theme]);
  
  return (
    <canvas 
      ref={canvasRef}
      className={`absolute inset-0 z-0 ${className}`}
      style={{ willChange: 'auto', opacity: 0.6 }}
    />
  );
});

ParticleBackground.displayName = 'ParticleBackground';

export default ParticleBackground;
