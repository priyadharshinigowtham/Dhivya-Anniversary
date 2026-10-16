import React from 'react';

interface LandingPageProps {
  onBegin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onBegin }) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between py-6 md:py-12 px-4 overflow-y-auto md:overflow-hidden">
      {/* Background Image with warm/dark overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{ backgroundImage: `url('/animated_bg.gif')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-pink-950/40" />

      {/* Elegant Frame overlay */}
      <div className="absolute inset-4 border border-pink-500/20 rounded-2xl pointer-events-none z-10" />
      <div className="absolute inset-6 border border-pink-500/10 rounded-2xl pointer-events-none z-10" />

      {/* Top spacing */}
      <div className="h-4 md:h-10 z-20"></div>

      {/* Main Title Center */}
      <div className="z-20 text-center flex flex-col items-center max-w-2xl select-none animate-fade-in">
        <h1 className="font-romantic text-5xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-pink-100 via-rose-300 to-rose-400 drop-shadow-[0_4px_12px_rgba(219,39,119,0.5)] leading-tight filter text-center">
          Celebration
        </h1>
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-pink-400 to-transparent my-4 md:my-6"></div>
        <p className="font-serifElegant italic text-pink-200/80 text-base md:text-xl tracking-wide max-w-md">
          "A journey that started with a spark, growing more beautiful with every passing moment."
        </p>
      </div>

      {/* Heart-Shaped Begin Button at Bottom */}
      <div className="z-20 flex flex-col items-center gap-2 md:gap-4 animate-fade-in [animation-delay:600ms] pb-2">
        <button 
          onClick={onBegin} 
          className="relative group transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
        >
          {/* Heart Glow Shadow */}
          <div className="absolute inset-0 bg-pink-600 rounded-full blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-300"></div>
          
          {/* Main Heart Button Container */}
          <div className="relative flex items-center justify-center w-24 h-24 md:w-28 md:h-28 text-white font-bold text-center text-xs md:text-sm p-3 md:p-4 animate-heartbeat">
            <svg 
              className="absolute w-full h-full text-rose-600 fill-current drop-shadow-[0_4px_10px_rgba(190,24,74,0.6)] group-hover:text-rose-500 transition-colors duration-300"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span className="relative z-10 font-sans text-[10px] md:text-xs tracking-wider uppercase font-semibold leading-tight text-rose-50 select-none">
              Click Here<br/>To Begin
            </span>
          </div>
        </button>
        <span className="font-sans text-[10px] md:text-xs text-pink-300/60 uppercase tracking-widest animate-pulse mt-1">
          Click the heart to enter
        </span>
      </div>
    </div>
  );
};
