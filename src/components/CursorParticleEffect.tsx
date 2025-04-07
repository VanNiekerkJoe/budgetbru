
import React, { useEffect, useRef } from 'react';

interface CursorParticleEffectProps {
  count?: number;
  colors?: string[];
  size?: number;
  speed?: number;
  lifespan?: number;
  glowIntensity?: number;
}

const CursorParticleEffect: React.FC<CursorParticleEffectProps> = ({
  count = 15,
  colors = ['#CA529A', '#106A94', '#304575'],
  size = 12,
  speed = 0.8,
  lifespan = 40,
  glowIntensity = 0.7
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particles = useRef<Array<{
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    color: string;
    life: number;
    maxLife: number;
  }>>([]);
  const mousePosition = useRef({ x: -100, y: -100 });
  const prevMousePosition = useRef({ x: -100, y: -100 });
  const animationFrameId = useRef<number | null>(null);

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
    
    // Track mouse position and create trail effect
    const handleMouseMove = (e: MouseEvent) => {
      prevMousePosition.current = { ...mousePosition.current };
      mousePosition.current = { x: e.clientX, y: e.clientY };
      
      // Create particles on mouse move with interpolation for smoother trails
      const dx = mousePosition.current.x - prevMousePosition.current.x;
      const dy = mousePosition.current.y - prevMousePosition.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Create more particles when moving faster
      const particleCount = Math.min(Math.max(1, Math.floor(distance / 5)), 3);
      
      for (let i = 0; i < particleCount; i++) {
        // Interpolate position for smoother trails
        const ratio = i / particleCount;
        const x = prevMousePosition.current.x + dx * ratio;
        const y = prevMousePosition.current.y + dy * ratio;
        
        createParticle(x, y);
      }
    };
    
    const createParticle = (x: number, y: number) => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const maxLife = lifespan + Math.random() * lifespan * 0.5;
      
      particles.current.push({
        x,
        y,
        size: Math.random() * size + size * 0.5,
        speedX: (Math.random() - 0.5) * speed,
        speedY: (Math.random() - 0.5) * speed,
        color,
        life: 0,
        maxLife
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.current.forEach((particle, index) => {
        // Update position with slight gravity effect
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Update life
        particle.life++;
        
        // Calculate opacity based on life
        const progress = particle.life / particle.maxLife;
        const opacity = 1 - progress;
        
        // Extract RGB from hex color
        const hex = particle.color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        // Draw glow effect (multiple layered circles with decreasing opacity)
        const glowRadius = particle.size * 2;
        
        // Create radial gradient for glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, glowRadius
        );
        
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity * glowIntensity})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Core of the particle (smaller, more opaque)
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        ctx.fill();
        
        // Remove particles when they're dead
        if (particle.life >= particle.maxLife) {
          particles.current.splice(index, 1);
        }
      });
      
      animationFrameId.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [colors, size, speed, lifespan, glowIntensity, count]);
  
  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default CursorParticleEffect;
