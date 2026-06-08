import React, { useEffect, useRef, useState } from 'react';
import { whenYTReady, getOrCreatePlayerDiv } from '../utils/ytApi';

interface MemoryLanePageProps {
  onContinue: () => void;
  isPlaying: boolean;
  isMuted: boolean;
}

interface Stage {
  id: number;
  theme: string;
  image: string;
  videoId: string;
  emoji: string;
  color: string;
  description: string;
}

const stages: Stage[] = [
  {
    id: 1,
    theme: 'Engagement',
    image: '/engagement.jpeg',
    videoId: '7rAlDnJmi0w',
    emoji: '💍',
    color: 'from-[#2e0915] via-[#4d0c27] to-[#120006]',
    description: 'The beautiful beginning of our formal togetherness, pledging our hearts forever.',
  },
  {
    id: 2,
    theme: 'First Date',
    image: '/First date.jpeg',
    videoId: 'uED3f6_yFvk',
    emoji: '🌹',
    color: 'from-[#38060b] via-[#590e17] to-[#1a0004]',
    description: 'Where the sparks flew and we knew we found something magical.',
  },
  {
    id: 3,
    theme: 'Marriage',
    image: '/Marriage.jpeg',
    videoId: 'bDU65OMz66o',
    emoji: '👰‍♀️',
    color: 'from-[#330321] via-[#54073a] to-[#14000b]',
    description: 'Vowing to stand by each other through all walks of life, hand in hand.',
  },
  {
    id: 4,
    theme: 'Our First Baby',
    image: '/Hirithik.jpeg',
    videoId: 'bagzMke6yoo',
    emoji: '👶',
    color: 'from-[#361809] via-[#54280f] to-[#170500]',
    description: 'Welcoming our sweet firstborn, Hirithik, who brought infinite sunshine into our lives.',
  },
  {
    id: 5,
    theme: 'Our Second Baby',
    image: '/Rohit.jpeg',
    videoId: 'jErN2fE8q68',
    emoji: '🍼',
    color: 'from-[#07242d] via-[#10404e] to-[#010e13]',
    description: 'Completing our family with the arrival of our darling second son, Rohit.',
  },
  {
    id: 6,
    theme: 'Our Family',
    image: '/Family.jpeg',
    videoId: 'O5GyI71lXFM',
    emoji: '🏡',
    color: 'from-[#190a2e] via-[#321759] to-[#090214]',
    description: 'Building a home filled with warmth, endless laughter, and boundless affection.',
  },
  {
    id: 7,
    theme: 'Long Distance',
    image: '/long distance.jpeg',
    videoId: 'nwzZ-Ig8WPc',
    emoji: '✈️',
    color: 'from-[#181a2e] via-[#282a4c] to-[#090a16]',
    description: 'Bridging every physical mile with the strength and loyalty of our connection.',
  },
];

const stagePhrases = [
  'Our Forever',
  'Our Journey Continues',
  'The Story Goes On',
  'Our Beautiful Tomorrow',
  'A Lifetime Ahead',
  'The Road We Share',
  'Our Endless Love',
];

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
  type: 'mouse' | 'bg' | 'sparkle' | 'blast';
  waveAmplitude: number;
  waveSpeed: number;
  waveTime: number;
  startY: number;
}

export const MemoryLanePage: React.FC<MemoryLanePageProps> = ({ onContinue, isPlaying, isMuted }) => {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [imgVisible, setImgVisible] = useState(true);

  const playerRef = useRef<any>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const currentRef = useRef(current);
  const isPlayingRef = useRef(isPlaying);
  const isMutedRef = useRef(isMuted);
  const lastVideoIdRef = useRef<string>('');

  useEffect(() => { currentRef.current = current; }, [current]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mouseMoveDist = useRef<number>(0);

  const stage = stages[current];
  const isLast = current === stages.length - 1;

  // Single YouTube Player Setup
  useEffect(() => {
    let active = true;

    whenYTReady(() => {
      if (!active) return;
      getOrCreatePlayerDiv('yt-memory-lane-player');

      playerRef.current = new window.YT.Player('yt-memory-lane-player', {
        videoId: stages[currentRef.current].videoId,
        playerVars: {
          autoplay: isPlayingRef.current ? 1 : 0,
          controls: 0,
          loop: 1,
          playlist: stages[currentRef.current].videoId,
          rel: 0,
          iv_load_policy: 3,
        },
        events: {
          onReady: (event: any) => {
            if (!active) return;
            setIsPlayerReady(true);

            const targetVideoId = stages[currentRef.current].videoId;
            lastVideoIdRef.current = targetVideoId;
            event.target.loadVideoById({
              videoId: targetVideoId,
              suggestedQuality: 'default',
            });

            if (isMutedRef.current) {
              event.target.mute();
            } else {
              event.target.unMute();
            }

            if (isPlayingRef.current) {
              event.target.playVideo();
            } else {
              event.target.pauseVideo();
            }
          },
        },
      });
    });

    return () => {
      active = false;
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.error('Error destroying memory lane player:', e);
        }
        playerRef.current = null;
      }
      const el = document.getElementById('yt-memory-lane-player');
      if (el) el.remove();
    };
  }, []);

  // Sync playback/mute/video states
  useEffect(() => {
    if (!isPlayerReady || !playerRef.current) return;

    const targetVideoId = stages[current].videoId;

    if (isMuted) {
      playerRef.current.mute();
    } else {
      playerRef.current.unMute();
    }

    if (isPlaying) {
      if (lastVideoIdRef.current !== targetVideoId) {
        lastVideoIdRef.current = targetVideoId;
        playerRef.current.loadVideoById({
          videoId: targetVideoId,
          suggestedQuality: 'default',
        });
      } else {
        playerRef.current.playVideo();
      }
    } else {
      playerRef.current.pauseVideo();
    }
  }, [current, isPlaying, isMuted, isPlayerReady]);

  // Setup Canvas
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

  // Wavy Particles Update
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

    const drawSparkle = (c: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number) => {
      c.save();
      c.translate(x, y);
      c.globalAlpha = opacity;
      c.beginPath();
      for (let i = 0; i < 4; i++) {
        c.lineTo(0, -size);
        c.lineTo(size * 0.25, -size * 0.25);
        c.rotate(Math.PI / 2);
      }
      c.fillStyle = '#fbbf24'; // Golden Sparkle
      c.fill();
      c.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        p.y += p.vy;
        p.waveTime += p.waveSpeed;
        p.x += p.vx + Math.sin(p.waveTime) * p.waveAmplitude * 0.15;
        p.angle += p.spin;

        if (p.type === 'blast') {
          // Slow down blast particles gradually (air drag)
          p.vx *= 0.96;
          p.vy *= 0.96;
          p.opacity -= 0.012; // Blast fades relatively quick
        } else if (p.type === 'mouse') {
          p.opacity -= 0.008;
        } else {
          p.opacity -= 0.0015; // Slow background stars
        }

        if (p.opacity <= 0 || p.y < -50 || p.x < -50 || p.x > canvas.width + 50 || p.y > canvas.height + 50) {
          particles.splice(i, 1);
          continue;
        }

        if (p.type === 'sparkle') {
          drawSparkle(ctx, p.x, p.y, p.size, p.opacity);
        } else {
          drawHeart(ctx, p.x, p.y, p.size, p.color, p.opacity, p.angle);
        }
      }

      // Add gentle background ambient hearts
      if (Math.random() < 0.03 && particles.length < 160) {
        const bgColors = ['#f472b6', '#fda4af', '#f43f5e', '#ec4899', '#fce7f3'];
        particles.push({
          x: Math.random() * canvas.width,
          y: canvas.height + 25,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -(Math.random() * 0.8 + 0.4),
          size: Math.random() * 15 + 8,
          opacity: Math.random() * 0.12 + 0.03,
          color: bgColors[Math.floor(Math.random() * bgColors.length)],
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.01,
          type: 'bg',
          waveAmplitude: Math.random() * 6 + 3,
          waveSpeed: Math.random() * 0.03 + 0.01,
          waveTime: Math.random() * 100,
          startY: canvas.height,
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

  // Interactive Mouse Wave Spawner
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const dx = mouseX - lastMousePos.current.x;
    const dy = mouseY - lastMousePos.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    mouseMoveDist.current += dist;
    lastMousePos.current = { x: mouseX, y: mouseY };

    if (mouseMoveDist.current > 7) {
      mouseMoveDist.current = 0;
      const colors = ['#ff4476', '#ff789d', '#e11d48', '#ec4899', '#fda4af', '#fcd34d', '#ffedd5'];
      
      const count = Math.floor(Math.random() * 3) + 3; // High density waves
      for (let k = 0; k < count; k++) {
        const isSparkle = Math.random() < 0.22;
        particlesRef.current.push({
          x: mouseX + (Math.random() - 0.5) * 15,
          y: mouseY + (Math.random() - 0.5) * 15,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -(Math.random() * 1.5 + 0.8),
          size: isSparkle ? Math.random() * 7 + 4 : Math.random() * 9 + 6,
          opacity: Math.random() * 0.25 + 0.7,
          color: colors[Math.floor(Math.random() * colors.length)],
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.1,
          type: isSparkle ? 'sparkle' : 'mouse',
          waveAmplitude: Math.random() * 25 + 15, // Waves swing side-to-side
          waveSpeed: Math.random() * 0.08 + 0.03,
          waveTime: Math.random() * 20,
          startY: mouseY,
        });
      }
    }
  };

  // SUPER HEART BLAST transition physics
  const triggerSuperHeartBlast = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const colors = ['#ff0055', '#ff3385', '#ec4899', '#f43f5e', '#fda4af', '#fcd34d', '#ffedd5', '#ffffff'];

    // Spawn 130 particles exploding outward in all directions
    for (let i = 0; i < 130; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 4; // High speed blast
      const size = Math.random() * 15 + 8;
      const isSparkle = Math.random() < 0.35;

      particlesRef.current.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.0, // slight upward bias
        size: isSparkle ? Math.random() * 9 + 4 : size,
        opacity: 1.0,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.18,
        type: isSparkle ? 'sparkle' : 'blast',
        waveAmplitude: Math.random() * 15,
        waveSpeed: Math.random() * 0.05 + 0.02,
        waveTime: Math.random() * 10,
        startY: centerY,
      });
    }
  };

  const handleNext = () => {
    if (transitioning) return;
    setTransitioning(true);
    setImgVisible(false);

    // Blast hearts in background immediately on transition trigger!
    triggerSuperHeartBlast();

    setTimeout(() => {
      if (isLast) {
        playerRef.current?.pauseVideo();
        onContinue();
      } else {
        setCurrent(prev => prev + 1);
        setImgVisible(true);
        setTransitioning(false);
      }
    }, 600);
  };

  // Timeline progress percent
  const percent = (current / (stages.length - 1)) * 100;

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`relative w-full h-full flex flex-col items-center justify-start bg-gradient-to-br ${stage.color} overflow-y-auto md:overflow-hidden transition-all duration-1000 select-none`}
    >
      {/* Styles for dynamic floating nebulae and polaroid sheen */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(45px, -65px) scale(1.15); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translate(0, 0) scale(1.05); }
          50% { transform: translate(-55px, 45px) scale(0.9); }
        }
        @keyframes shimmer-sheen {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(250%) skewX(-15deg); }
        }
        .animate-float-slow {
          animation: float-slow 14s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float-slower 18s ease-in-out infinite;
        }
        .shimmer-overlay::after {
          content: '';
          position: absolute;
          top: 0; left: 0; width: 40%; height: 100%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.2) 50%, transparent);
          transform: translateX(-100%) skewX(-15deg);
          animation: shimmer-sheen 4s ease-in-out infinite;
        }
      `}</style>

      {/* Floating Nebula circles behind everything */}
      <div className="absolute top-1/4 left-[5%] w-96 h-96 rounded-full bg-pink-500/8 blur-3xl animate-float-slow pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-[5%] w-96 h-96 rounded-full bg-rose-500/8 blur-3xl animate-float-slower pointer-events-none z-0" />

      {/* High-density wavy Canvas overlay - fixed to support scrolling on short screens */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />

      {/* Header */}
      <div className="relative z-20 w-full flex items-center justify-between px-6 pt-6 select-none">
        <div>
          <p className="font-sans text-[10px] uppercase tracking-widest text-pink-300/60">Our Journey Together</p>
          <h2
            className="text-pink-100 text-2xl md:text-3xl font-bold font-serifElegant drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Memory Lane
          </h2>
        </div>

        <div className="bg-pink-950/40 border border-pink-500/20 px-3 py-1 rounded-full backdrop-blur-md">
          <span className="font-sans text-xs font-semibold text-pink-200">
            {current + 1} / {stages.length}
          </span>
        </div>
      </div>

      {/* Traveling Couple Roadmap timeline */}
      <div className="relative z-20 w-full max-w-2xl px-6 mt-4 md:mt-8 mb-2 md:mb-4 select-none">
        <div className="absolute inset-x-6 top-1/2 h-[3px] bg-pink-500/10 blur-xs rounded-full pointer-events-none" />

        <div className="relative flex items-center justify-between w-full h-10">
          {/* Track background */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[3px] bg-pink-950/60 rounded-full z-0">
            {/* Active completed track */}
            <div 
              className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-1000 ease-in-out shadow-[0_0_10px_rgba(236,72,153,0.6)]" 
              style={{ width: `${percent}%` }} 
            />
          </div>

          {/* Gliding Bouncing Couple */}
          <div 
            className="absolute -top-7 md:-top-9 transition-all duration-1000 ease-in-out -translate-x-1/2 flex flex-col items-center z-30 pointer-events-none"
            style={{ left: `${percent}%` }}
          >
            <div className="flex items-center justify-center bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full p-1.5 shadow-[0_0_15px_rgba(236,72,153,0.85)] border border-pink-300 animate-bounce">
              <span className="text-base md:text-xl leading-none">👩‍❤️‍👨</span>
            </div>
            <div className="w-1.5 h-1.5 bg-pink-500 rotate-45 -mt-0.5"></div>
          </div>

          {/* Nodes */}
          {stages.map((s, i) => {
            const isActive = i === current;
            const isCompleted = i < current;
            return (
              <button
                key={s.id}
                onClick={() => {
                  if (!transitioning && i !== current) {
                    setTransitioning(true);
                    setImgVisible(false);
                    triggerSuperHeartBlast(); // Burst when hopping stages manual
                    setTimeout(() => {
                      setCurrent(i);
                      setImgVisible(true);
                      setTransitioning(false);
                    }, 500);
                  }
                }}
                className="relative z-10 flex flex-col items-center focus:outline-none group"
              >
                <div
                  className={`flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full border-2 text-[10px] md:text-xs font-bold transition-all duration-700 ${
                    isCompleted
                      ? 'bg-rose-600 border-rose-400 text-white shadow-[0_0_8px_rgba(225,29,72,0.4)]'
                      : isActive
                      ? 'bg-pink-500 border-pink-200 text-white scale-115 shadow-[0_0_15px_rgba(236,72,153,0.7)] animate-pulse-slow'
                      : 'bg-[#120509] border-pink-900/60 text-pink-700/60 group-hover:border-pink-500 group-hover:text-pink-300'
                  }`}
                >
                  {isCompleted ? '✓' : s.emoji}
                </div>

                <span
                  className={`absolute top-8 text-[8px] font-bold tracking-wider uppercase whitespace-nowrap transition-colors duration-300 pointer-events-none ${
                    isActive ? 'text-pink-200 opacity-100' : 'text-pink-500/40 opacity-0 group-hover:opacity-100 group-hover:text-pink-400'
                  }`}
                >
                  {s.theme}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main image content card */}
      <div className="relative z-20 flex flex-col items-center w-full px-4 flex-1 justify-center max-w-lg mt-4 md:mt-8 select-none animate-fade-in">
        
        {/* Stage Description Text Box */}
        <div 
          className="text-center transition-all duration-500 mb-3 md:mb-6"
          style={{
            opacity: imgVisible ? 1 : 0,
            transform: imgVisible ? 'translateY(0)' : 'translateY(-12px)',
          }}
        >
          <div className="inline-block bg-pink-500/20 border border-pink-500/30 px-3 py-1 rounded-full text-[9px] uppercase tracking-widest text-pink-200 font-bold mb-2 md:mb-3">
            Chapter {stage.id} — {stage.theme}
          </div>

          <p className="font-serif text-sm md:text-base text-pink-200/80 px-6 italic max-w-sm mx-auto leading-relaxed">
            "{stage.description}"
          </p>
        </div>

        {/* Polaroid style image frame with sheen shimmer reflection */}
        <div 
          className="relative w-[260px] sm:w-[320px] md:w-full md:max-w-sm transition-all duration-500"
          style={{
            opacity: imgVisible ? 1 : 0,
            transform: imgVisible ? 'scale(1) translateY(0) rotate(-1.5deg)' : 'scale(0.95) translateY(20px) rotate(0deg)',
          }}
        >
          {/* Radiant back glow */}
          <div className="absolute -inset-3 rounded-2xl bg-gradient-to-tr from-pink-500/20 to-rose-500/10 blur-2xl pointer-events-none" />

          {/* Polaroid white frame container */}
          <div 
            className="relative bg-[#faf6ee] p-2 md:p-3.5 pb-6 md:pb-10 shadow-[0_25px_55px_rgba(0,0,0,0.6)] rounded-lg border border-[#ede3d0]"
            style={{ boxShadow: '0 25px 55px rgba(0,0,0,0.5), inset 0 0 40px rgba(139, 92, 26, 0.05)' }}
          >
            {/* Viewport frame container with shimmer sheen reflection class */}
            <div className="relative aspect-[4/3] bg-neutral-900 overflow-hidden border border-neutral-300 rounded-xs shimmer-overlay">
              <img
                src={stage.image}
                alt={stage.theme}
                className="w-full h-full object-cover transition-transform duration-[1200ms] hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
            </div>

            {/* Title bottom caption */}
            <div className="mt-2 md:mt-4 text-center">
              <p 
                className="font-romantic text-2xl md:text-4xl text-rose-800 font-semibold"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                {stage.theme}
              </p>
            </div>
          </div>
        </div>

        {/* Music visualizer bars */}
        <div className="flex items-center gap-2 mt-4 md:mt-6 select-none bg-black/30 border border-white/5 px-3 py-1.5 rounded-full backdrop-blur-sm">
          <div className="flex items-end gap-[3px] h-3.5">
            {[1, 2, 3, 4, 5].map(b => (
              <div
                key={b}
                className="w-[2.5px] bg-pink-400 rounded-full animate-pulse"
                style={{
                  height: `${[50, 100, 70, 90, 60][b - 1]}%`,
                  animationDelay: `${b * 0.12}s`,
                  animationDuration: `${0.5 + b * 0.1}s`,
                }}
              />
            ))}
          </div>
          <span className="text-pink-300/70 text-[9px] uppercase tracking-widest font-bold font-sans">
            Playing Chapter Soundtrack
          </span>
        </div>

      </div>

      {/* Bottom custom stage-phrase heart capsule button */}
      <div className="relative z-20 flex flex-col items-center gap-1.5 pb-4 md:pb-10 mt-4 md:mt-6 select-none">
        <button
          onClick={handleNext}
          disabled={transitioning}
          className="relative group transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2.5 md:px-8 md:py-3.5 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:to-pink-500 text-white font-bold rounded-full shadow-[0_0_22px_rgba(244,63,94,0.35)] border border-pink-300/30 flex items-center justify-center gap-2 md:gap-3 select-none z-30"
        >
          {/* Heart Glow */}
          <div className="absolute inset-0 bg-rose-500 rounded-full blur-xl opacity-40 group-hover:opacity-75 transition-opacity duration-300" />
          
          <span className="relative z-10 animate-bounce text-sm md:text-lg">❤️</span>
          <span className="relative z-10 font-sans text-[10px] md:text-xs uppercase tracking-wider font-extrabold text-rose-50 leading-none">
            {stagePhrases[current]}
          </span>
        </button>

        <span className="font-sans text-[9px] text-pink-300/40 uppercase tracking-widest">
          {isLast ? 'Read my anniversary note' : `${stages.length - current - 1} chapters remaining`}
        </span>
      </div>
    </div>
  );
};
