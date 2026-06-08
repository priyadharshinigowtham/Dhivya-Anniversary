import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw } from 'lucide-react';

interface EndingPageProps {
  onRestart: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  angle: number;
  spin: number;
}

export const EndingPage: React.FC<EndingPageProps> = ({ onRestart }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const [clickCount, setClickCount] = useState(0);

  // Setup canvas size
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Particle animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.opacity -= 0.003; // Fade out slowly
        p.angle += p.spin;

        if (p.opacity <= 0 || p.y < -50 || p.x < -50 || p.x > canvas.width + 50) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = p.opacity;

        // Draw a heart path
        ctx.beginPath();
        const d = p.size;
        ctx.moveTo(0, -d / 4);
        ctx.bezierCurveTo(-d / 2, -d, -d, -d / 3, 0, d / 2);
        ctx.bezierCurveTo(d, -d / 3, d / 2, -d, 0, -d / 4);
        ctx.fillStyle = p.color;
        ctx.fill();

        ctx.restore();
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

  // Spawn dynamic heart particles
  const spawnHearts = (x: number, y: number, count = 25) => {
    const colors = ['#f43f5e', '#ec4899', '#db2777', '#fb7185', '#fcd34d', '#fda4af', '#ffffff'];
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: -(Math.random() * 4 + 2), // Go upwards
        size: Math.random() * 15 + 10,
        opacity: Math.random() * 0.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.06,
      });
    }
  };

  // Auto-spawn some initial hearts on load
  useEffect(() => {
    const interval = setInterval(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        // Spawn from bottom corners and center
        const spawnX = Math.random() * canvas.width;
        const spawnY = canvas.height + 20;
        spawnHearts(spawnX, spawnY, 3);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  const handleHeartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setClickCount(prev => prev + 1);
    spawnHearts(e.clientX, e.clientY, 40);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1a050d] via-rose-950/60 to-[#120206] px-4 py-4 md:py-8 overflow-y-auto select-none">
      {/* Sparkles/Floating Hearts Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

      {/* Warm Ambient Lights */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      {/* Frame overlay */}
      <div className="absolute inset-4 border border-pink-500/10 rounded-2xl pointer-events-none z-10" />

      {/* Note Card Container */}
      <div className="relative z-20 w-full max-w-xl my-2 md:my-4 animate-fade-in">
        {/* Ivory Style Premium Letter Box */}
        <div 
          className="bg-[#faf6ee] p-4 md:p-10 rounded-2xl shadow-2xl border border-[#ede3d0] text-amber-950 text-center relative overflow-hidden"
          style={{ 
            boxShadow: '0 25px 60px rgba(0,0,0,0.6), inset 0 0 40px rgba(139, 92, 26, 0.15)',
          }}
        >
          {/* Top Decorative Header */}
          <div className="flex justify-between items-center text-[10px] md:text-xs tracking-widest text-amber-800/60 font-sans uppercase mb-3 md:mb-6 pb-2 border-b border-amber-800/10">
            <span>To My Forever Love</span>
            <span>7 Years & Counting</span>
          </div>

          {/* Letter Body */}
          <div className="space-y-3 md:space-y-6 text-justify leading-relaxed">
            <h2 
              className="font-romantic text-4xl md:text-6xl text-rose-800 text-center font-bold mb-2 md:mb-4 select-text drop-shadow-[0_1px_0px_rgba(255,255,255,0.8)]"
              style={{ fontFamily: "'Great Vibes', cursive" }}
            >
              My Dearest Vishagan,
            </h2>

            <div className="text-sm md:text-lg text-amber-900/95 font-serif space-y-3 md:space-y-4 select-text">
              <p>
                These 7 years have been the most beautiful chapters of my life. From our first date, to the day we said "I do", to holding our precious boys, <strong>Hirithik</strong> and <strong>Rohit</strong>, and through every mile of distance we've crossed—every single moment has been a blessing because of you.
              </p>
              
              <p>
                Thank you for being my home, my strength, and my greatest adventure. I would choose you in every lifetime, over and over again.
              </p>

              <p>
                Here's to us, our beautiful family, and the infinite chapters yet to be written.
              </p>
            </div>

            <p className="font-romantic text-3xl md:text-4xl text-center text-rose-700 font-bold select-text mt-3 md:mt-6">
              Happy 7th Anniversary, my love!
            </p>

            {/* Signature */}
            <div className="pt-3 md:pt-6 flex flex-col items-end select-text">
              <p className="text-xs md:text-sm text-amber-800/80 italic font-semibold font-serif">With all my heart, always & forever,</p>
              <p className="text-2xl md:text-3xl font-romantic font-bold text-rose-800 mt-1" style={{ fontFamily: "'Great Vibes', cursive" }}>Dhivya ❤️</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interaction Bar */}
      <div className="relative z-20 flex flex-col items-center gap-6 mt-4 select-none">
        <div className="flex items-center gap-4">
          {/* Dynamic Confetti Shower Trigger Heart */}
          <button
            onClick={handleHeartClick}
            className="relative group transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
            title="Send Love"
          >
            {/* Glow */}
            <div className="absolute inset-0 bg-rose-500 rounded-full blur-md opacity-45 group-hover:opacity-75 transition-opacity duration-300"></div>

            {/* Heart shape */}
            <div className="relative flex items-center justify-center w-16 h-16 text-white animate-heartbeat">
              <svg
                className="absolute w-full h-full text-rose-600 fill-current group-hover:text-rose-500 transition-colors duration-300 drop-shadow-md"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="relative z-10 text-[10px] font-bold tracking-wider uppercase text-rose-50">
                {clickCount === 0 ? 'Tap Me' : '❤️'}
              </span>
            </div>
          </button>

          {/* Restart Button */}
          <button
            onClick={onRestart}
            className="relative group transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
            title="Restart Journey"
          >
            <div className="absolute inset-0 bg-pink-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-900/60 border border-pink-500/30 hover:border-pink-500/50 hover:bg-slate-900 transition-all duration-300 text-pink-300 hover:text-pink-100">
              <RotateCcw className="w-5 h-5" />
            </div>
          </button>
        </div>

        <span className="font-sans text-[10px] text-pink-300/40 uppercase tracking-widest">
          {clickCount === 0 ? 'Tap the heart for a surprise' : `Showered with love ${clickCount}x`}
        </span>
      </div>
    </div>
  );
};
