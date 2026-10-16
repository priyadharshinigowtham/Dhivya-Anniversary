import React, { useState, useEffect, useRef } from 'react';

interface PolaroidPageProps {
  onContinue: () => void;
}

interface Slide {
  src: string;
  quote: string;
}

const slides: Slide[] = [
  {
    src: '/bg_generic.png',
    quote: 'Time may change many things, but my heart still chooses you today with the same love, trust, and excitement as the day we began.',
  },
  {
    src: '/bg_generic.png',
    quote: 'I love you with the breath, smiles, and tears of all my life.',
  },
  {
    src: '/bg_generic.png',
    quote: 'Love is composed of a single soul inhabiting two bodies.',
  },
  {
    src: '/bg_generic.png',
    quote: 'One day you will ask me which is more important? My life or yours? I will say mine and you will walk away not knowing that you are my life.',
  },
  {
    src: '/bg_generic.png',
    quote: 'I love you without knowing how, or when, or from where. I love you simply, without problems or pride.',
  },
  {
    src: '/bg_generic.png',
    quote: 'If I could live my life a thousand times, I would still search for your hand in every lifetime and fall in love with you all over again.',
  },
  {
    src: '/bg_generic.png',
    quote: 'The day you entered my life, you turned my ordinary world into a beautiful love story that I never want to end.',
  },
];

interface HeartParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  angle: number;
  spin: number;
  type: 'mouse' | 'bg';
  growth?: number;
}

export const PolaroidPage: React.FC<PolaroidPageProps> = ({ onContinue }) => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<HeartParticle[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mouseMoveDist = useRef<number>(0);

  const isLast = current === slides.length - 1;

  const goNext = () => {
    if (animating) return;
    setAnimating(true);
    setVisible(false);
    setTimeout(() => {
      if (isLast) {
        onContinue();
      } else {
        setCurrent(prev => prev + 1);
        setVisible(true);
        setAnimating(false);
      }
    }, 500);
  };

  // Reset visibility after slide change
  useEffect(() => {
    setVisible(true);
  }, [current]);

  // Setup Canvas Size & Event Listeners
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle Particle Updates & Drawings
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawHeart = (c: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, opacity: number, angle: number) => {
      c.save();
      c.translate(x, y);
      c.rotate(angle);
      c.globalAlpha = opacity;
      c.beginPath();
      c.moveTo(0, -size / 4);
      c.bezierCurveTo(-size / 2, -size, -size, -size / 3, 0, size / 2);
      c.bezierCurveTo(size, -size / 3, size / 2, -size, 0, -size / 4);
      c.fillStyle = color;
      c.fill();
      c.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      // Update and draw existing particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.spin;

        if (p.type === 'mouse') {
          p.opacity -= 0.015; // Mouse trail fades relatively quickly
        } else {
          // Slow floating background hearts
          p.opacity -= 0.002;
        }

        // Remove dead particles
        if (p.opacity <= 0 || p.y < -50 || p.x < -50 || p.x > canvas.width + 50) {
          particles.splice(i, 1);
          continue;
        }

        drawHeart(ctx, p.x, p.y, p.size, p.color, p.opacity, p.angle);
      }

      // Periodically spawn slow floating background hearts (warm pink, rose, light peach)
      if (Math.random() < 0.03 && particles.length < 120) {
        const bgColors = ['#fda4af', '#f43f5e', '#ec4899', '#fcd34d', '#ffedd5'];
        particles.push({
          x: Math.random() * canvas.width,
          y: canvas.height + 25,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -(Math.random() * 1.2 + 0.6), // Slow upward drift
          size: Math.random() * 20 + 10,
          opacity: Math.random() * 0.15 + 0.05, // Subtle, transparent background feel
          color: bgColors[Math.floor(Math.random() * bgColors.length)],
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.01,
          type: 'bg',
        });
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  // Track mouse movements to spawn small trail hearts
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const dx = mouseX - lastMousePos.current.x;
    const dy = mouseY - lastMousePos.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    mouseMoveDist.current += dist;
    lastMousePos.current = { x: mouseX, y: mouseY };

    // Spawn a small heart every 15 pixels of movement to prevent overcrowding
    if (mouseMoveDist.current > 12) {
      mouseMoveDist.current = 0;
      const trailColors = ['#f43f5e', '#ec4899', '#db2777', '#fcd34d', '#fb7185', '#ffe4e6', '#fdba74'];
      particlesRef.current.push({
        x: mouseX,
        y: mouseY,
        vx: (Math.random() - 0.5) * 2,
        vy: -(Math.random() * 1.5 + 0.8), // Float up
        size: Math.random() * 6 + 6, // Small delicate hearts
        opacity: Math.random() * 0.3 + 0.6, // Bright visible trail
        color: trailColors[Math.floor(Math.random() * trailColors.length)],
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.08,
        type: 'mouse',
      });
    }
  };

  const slide = slides[current];

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#24060b] via-[#3a0d13] to-[#120104] overflow-y-auto md:overflow-hidden px-4 py-4 md:py-8"
    >
      {/* Dynamic Love Canvas Background (Slow floating hearts + mouse trail) - fixed for scrolling */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />

      {/* Radiant warm ambient sunset glows */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Frame border overlay */}
      <div className="absolute inset-4 border border-pink-500/10 rounded-2xl pointer-events-none z-10" />

      {/* Slide counter dots */}
      <div className="relative z-20 flex gap-2 mb-4 md:mb-8 select-none">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
              i === current
                ? 'bg-rose-400 scale-125 shadow-[0_0_10px_rgba(251,113,133,0.8)]'
                : i < current
                ? 'bg-pink-700/60'
                : 'bg-pink-900/40'
            }`}
          />
        ))}
      </div>

      {/* Polaroid Card */}
      <div
        className="relative z-20 flex flex-col items-center w-[260px] sm:w-[320px] md:w-full md:max-w-md transition-all duration-500 my-auto"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)',
        }}
      >
        {/* Polaroid Frame */}
        <div
          className="bg-white shadow-2xl p-2.5 pb-8 md:p-4 md:pb-16 w-full flex flex-col items-center transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-[0_25px_60px_rgba(0,0,0,0.6)] cursor-default"
          style={{
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)',
            transform: `rotate(${(current % 2 === 0 ? -1.5 : 1.5)}deg)`,
          }}
        >
          {/* Photo inside the polaroid */}
          <div className="w-full aspect-[4/3] overflow-hidden bg-neutral-900 border border-neutral-100 rounded-xs">
            <img
              key={slide.src}
              src={slide.src}
              alt={`Memory ${current + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600';
              }}
            />
          </div>

          {/* Polaroid handwritten chapter label */}
          <div className="mt-3 md:mt-6 px-2 text-center select-none">
            <p
              className="text-rose-800/80 text-[10px] md:text-[11px] tracking-widest uppercase font-bold"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Chapter {current + 1} of {slides.length}
            </p>
          </div>
        </div>

        {/* Romantic Quote styled beautifully */}
        <div className="mt-4 md:mt-8 text-center px-4 max-w-sm md:max-w-md select-text">
          <p
            className="text-pink-100 text-base md:text-xl font-bold leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            "{slide.quote}"
          </p>
        </div>
      </div>

      {/* Heart-shaped Next / Continue Button */}
      <div className="relative z-20 flex flex-col items-center gap-1.5 mt-4 md:mt-10 select-none">
        <button
          onClick={goNext}
          disabled={animating}
          className="relative group transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* Heart Glow */}
          <div className="absolute inset-0 bg-rose-500 rounded-full blur-xl opacity-50 group-hover:opacity-85 transition-opacity duration-300" />

          {/* Heart Button */}
          <div className="relative flex items-center justify-center w-16 h-16 md:w-22 md:h-22 text-white animate-heartbeat">
            <svg
              className="absolute w-full h-full text-rose-600 fill-current group-hover:text-rose-500 transition-colors duration-300 drop-shadow-[0_4px_12px_rgba(190,24,74,0.5)]"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="relative z-10 font-sans text-[9px] md:text-xs uppercase font-bold tracking-wider text-rose-50">
              {isLast ? 'Journey' : 'Next'}
            </span>
          </div>
        </button>

        <span className="font-sans text-[9px] text-pink-300/50 uppercase tracking-widest">
          {isLast ? 'View our journey roadmap' : `${slides.length - current - 1} more memories`}
        </span>
      </div>
    </div>
  );
};
