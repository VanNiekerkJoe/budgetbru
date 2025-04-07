
import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  life: number;
  maxLife: number;
}

interface CursorParticleEffectProps {
  count?: number;
  colors?: string[];
  size?: number;
  speed?: number;
  lifespan?: number;
}

const CursorParticleEffect: React.FC<CursorParticleEffectProps> = ({
  count = 15,
  colors = ['#CA529A', '#106A94', '#304575'],
  size = 6,
  speed = 1,
  lifespan = 30
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particles = useRef<Particle[]>([]);
  const mousePosition = useRef({ x: -100, y: -100 });
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
    
    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
      
      // Create particles on mouse move
      for (let i = 0; i < 2; i++) {
        createParticle();
      }
    };
    
    const createParticle = () => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const maxLife = lifespan + Math.random() * lifespan;
      
      const particle: Particle = {
        x: mousePosition.current.x,
        y: mousePosition.current.y,
        size: Math.random() * size + 1,
        speedX: (Math.random() - 0.5) * speed * 2,
        speedY: (Math.random() - 0.5) * speed * 2,
        color,
        life: 0,
        maxLife
      };
      
      particles.current.push(particle);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Update life
        particle.life++;
        
        // Calculate opacity based on life
        const opacity = 1 - particle.life / particle.maxLife;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        // Extract RGB from hex color
        const hex = particle.color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
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
  }, [colors, size, speed, lifespan, count]);
  
  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none"
      style={{ mixBlendMode: 'lighten' }}
    />
  );
};

export default CursorParticleEffect;
