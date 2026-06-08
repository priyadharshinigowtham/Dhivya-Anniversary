import React, { useState, useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';

interface QuizPageProps {
  onContinue: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  type: 'heart' | 'infinity' | 'sad';
  opacity: number;
  color: string;
  angle: number;
  spin: number;
}

export const QuizPage: React.FC<QuizPageProps> = ({ onContinue }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);

  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [answerType, setAnswerType] = useState<'yes' | 'no' | null>(null);
  const [noButtonOffset, setNoButtonOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [noCount, setNoCount] = useState<number>(0);

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
        p.opacity -= 0.005; // Fade slowly
        p.angle += p.spin;

        if (p.opacity <= 0 || p.y < -50 || p.x < -50 || p.x > canvas.width + 50) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = p.opacity;

        if (p.type === 'heart') {
          // Draw a filled path heart
          ctx.beginPath();
          const d = p.size;
          ctx.moveTo(0, -d / 4);
          ctx.bezierCurveTo(-d / 2, -d, -d, -d / 3, 0, d / 2);
          ctx.bezierCurveTo(d, -d / 3, d / 2, -d, 0, -d / 4);
          ctx.fillStyle = p.color;
          ctx.fill();
        } else if (p.type === 'infinity') {
          // Draw infinity symbol (∞)
          ctx.font = `bold ${p.size}px Arial`;
          ctx.fillStyle = p.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('∞', 0, 0);
        } else if (p.type === 'sad') {
          // Draw sad smiley or broken heart emojis
          ctx.font = `${p.size}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.color, 0, 0); // Here color stores the emoji character
        }

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

  // Spawn particles function
  const spawnParticles = (type: 'yes' | 'no') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const count = type === 'yes' ? 120 : 80;
    const colors = type === 'yes' 
      ? ['#f43f5e', '#ec4899', '#db2777', '#fb7185', '#fcd34d', '#ffffff'] // pinks, roses, white, gold
      : ['😢', '💔', '😞', '🥺', '😭', '🥀']; // Emoji chars for sad smiles

    for (let i = 0; i < count; i++) {
      const x = Math.random() * canvas.width;
      const y = canvas.height + 20 + Math.random() * 50; // spawn off-screen bottom
      
      const vx = (Math.random() - 0.5) * 3;
      const vy = -(Math.random() * 4 + 2); // Float up
      const size = Math.random() * 20 + 15;
      
      let pType: 'heart' | 'infinity' | 'sad' = 'heart';
      let color = colors[Math.floor(Math.random() * colors.length)];

      if (type === 'yes') {
        pType = Math.random() > 0.45 ? 'heart' : 'infinity';
      } else {
        pType = 'sad';
      }

      particlesRef.current.push({
        x,
        y,
        vx,
        vy,
        size,
        type: pType,
        opacity: Math.random() * 0.5 + 0.5,
        color,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.05,
      });
    }
  };

  // Continuous trickle of particles when "Yes" is checked to keep the atmosphere lively
  useEffect(() => {
    if (hasAnswered && answerType === 'yes') {
      const interval = setInterval(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const colors = ['#f43f5e', '#ec4899', '#db2777', '#fcd34d'];
        
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: canvas.height + 20,
          vx: (Math.random() - 0.5) * 2,
          vy: -(Math.random() * 3 + 1),
          size: Math.random() * 15 + 10,
          type: Math.random() > 0.5 ? 'heart' : 'infinity',
          opacity: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.03,
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [hasAnswered, answerType]);

  const handleYes = () => {
    setHasAnswered(true);
    setAnswerType('yes');
    spawnParticles('yes');
  };

  const handleNo = () => {
    setNoCount(prev => prev + 1);
    spawnParticles('no');

    if (noCount >= 2) {
      // Force "Yes" playfully after 3 rejections
      alert("Okay, I see you are playing hard to get! But I know you love me ❤️. Let me make it easy for you...");
      handleYes();
    } else {
      // Shift position dynamically to run away
      moveNoButton();
    }
  };

  const moveNoButton = () => {
    const maxX = 160;
    const maxY = 100;
    
    // Choose a random direction to jump
    const newX = (Math.random() - 0.5) * maxX * 2;
    const newY = (Math.random() - 0.5) * maxY * 2;

    setNoButtonOffset({ x: newX, y: newY });
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-tr from-pink-950 via-purple-950 to-slate-950 px-4 py-8 overflow-y-auto md:overflow-hidden">
      {/* Sparkles/Floating Particles Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

      {/* Romantic Ambient Lights */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-rose-500/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-pink-500/10 blur-3xl" />

      {/* Frame overlay */}
      <div className="absolute inset-4 border border-pink-500/10 rounded-2xl pointer-events-none z-10" />

      {/* Inner Content Card (Glassmorphic Modal) */}
      {!hasAnswered ? (
        <div className="relative z-20 w-full max-w-xl bg-pink-950/20 backdrop-blur-xl border border-pink-500/20 p-8 md:p-12 rounded-3xl shadow-2xl text-center select-none animate-fade-in my-auto">
          {/* Decorative Heart Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-900/40 border border-pink-500/20 mb-8 animate-pulse">
            <Heart className="w-8 h-8 text-pink-400 fill-pink-400/20" />
          </div>

          <h2 className="font-serifElegant text-2xl md:text-4xl font-semibold text-pink-100 leading-snug mb-10">
            "Will you love me the same way till the very end, just as you do today?"
          </h2>

          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-6 min-h-[80px]">
            {/* YES BUTTON */}
            <button
              onClick={handleYes}
              className="relative w-40 py-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold rounded-full shadow-lg shadow-rose-900/40 border border-pink-300/30 hover:scale-105 active:scale-95 transition-all duration-300 z-20 group"
            >
              <span className="flex items-center justify-center gap-2">
                Yes, always! <Heart className="w-4 h-4 fill-white" />
              </span>
              <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>

            {/* NO BUTTON (moves around on click/hover) */}
            <button
              onClick={handleNo}
              onMouseEnter={moveNoButton}
              style={{
                transform: `translate(${noButtonOffset.x}px, ${noButtonOffset.y}px)`,
              }}
              className="w-40 py-3.5 bg-slate-800/80 hover:bg-slate-700/80 text-pink-200 font-semibold rounded-full border border-pink-500/10 shadow-md transition-all duration-200 cursor-pointer select-none active:scale-95 z-20"
            >
              {noCount === 0 ? "No" : noCount === 1 ? "Are you sure? 🥺" : "Wait, no! 💔"}
            </button>
          </div>
        </div>
      ) : (
        /* YES CONFIRMATION MODAL */
        <div className="relative z-20 w-full max-w-lg select-none animate-fade-in flex flex-col items-center my-auto">
          {/* Main Heart Container / Modal */}
          <div className="relative w-[280px] h-[280px] sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center text-center p-6 sm:p-8">
            {/* Backdrop Glow */}
            <div className="absolute inset-0 bg-rose-500/20 blur-2xl rounded-full"></div>

            {/* SVG Heart Shaped Card */}
            <svg 
              className="absolute inset-0 w-full h-full text-pink-900/90 fill-current drop-shadow-[0_10px_35px_rgba(219,39,119,0.4)] border border-pink-500/20 rounded-full" 
              viewBox="0 0 24 24"
              style={{ clipPath: 'path("M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z")' }}
            >
              {/* This draws a beautiful gradient fill internally */}
              <defs>
                <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#881337" /> {/* Rose-950 */}
                  <stop offset="50%" stopColor="#4c0519" /> {/* Rose-950 deeper */}
                  <stop offset="100%" stopColor="#1c0006" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#heartGrad)" />
            </svg>

            {/* Glowing borders around clipPath */}
            <div 
              className="absolute inset-0 w-full h-full pointer-events-none opacity-40 bg-gradient-to-tr from-pink-500 to-rose-400"
              style={{ 
                clipPath: 'path("M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z")',
                padding: '2px'
              }}
            />

            {/* Text & Content overlay on top of Heart shape */}
            <div className="relative z-10 flex flex-col items-center justify-center p-4 sm:p-6 text-pink-100 max-w-xs md:max-w-sm mt-[-10px]">
              <div className="animate-bounce mb-2 sm:mb-3">
                <span className="text-3xl sm:text-4xl">💖</span>
              </div>
              <h3 className="font-romantic text-3xl sm:text-4xl md:text-5xl text-rose-300 font-semibold mb-1 sm:mb-2">
                My Heart is Yours
              </h3>
              <p className="font-sans text-[10px] sm:text-xs md:text-sm text-pink-200/80 leading-relaxed mb-3 sm:mb-4">
                Thank you for choosing YES. You make my world infinitely brighter. Let's write our forever together, starting today.
              </p>

              {/* Heart Shape Continue Button */}
              <button 
                onClick={onContinue}
                className="relative group transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
              >
                {/* Glow */}
                <div className="absolute inset-0 bg-rose-500 rounded-full blur-md opacity-45 group-hover:opacity-75 transition-opacity duration-300"></div>
                
                {/* The continue button styled as a mini heart */}
                <div className="relative flex items-center justify-center w-14 h-14 text-white">
                  <svg 
                    className="absolute w-full h-full text-rose-600 fill-current group-hover:text-rose-500 transition-colors duration-300 drop-shadow-md"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <span className="relative z-10 font-sans text-[9px] uppercase font-bold tracking-wider text-rose-50">
                    Next
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
