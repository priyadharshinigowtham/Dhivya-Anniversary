import React, { useState } from 'react';

interface LetterPageProps {
  onContinue: () => void;
}

export const LetterPage: React.FC<LetterPageProps> = ({ onContinue }) => {
  const [page, setPage] = useState<1 | 2>(1);

  const handleNext = () => {
    if (page === 1) {
      setPage(2);
      // Scroll parchment to top when page changes
      const scrollContainer = document.getElementById('parchment-scroll-container');
      if (scrollContainer) {
        scrollContainer.scrollTop = 0;
      }
    } else {
      onContinue();
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-950/70 via-purple-950/60 to-[#120509] p-4 overflow-y-auto">
      {/* Decorative background lights */}
      <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-pink-500/5 blur-xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-rose-500/5 blur-xl pointer-events-none" />

      {/* Frame overlay */}
      <div className="absolute inset-4 border border-pink-500/10 rounded-2xl pointer-events-none z-10" />

      {/* Scrollable Container for Parchment Letter */}
      <div 
        id="parchment-scroll-container"
        className="w-full max-w-2xl my-4 z-20 animate-fade-in overflow-y-auto max-h-[85vh] md:max-h-none"
      >
        {/* Ancient style parchment paper */}
        <div 
          className="parchment w-full p-6 md:p-10 rounded-lg shadow-2xl flex flex-col items-center text-amber-950 select-text"
          style={{ fontFamily: "'Times New Roman', Times, serif" }}
        >
          {/* Page Indicator */}
          <div className="w-full flex justify-between items-center text-xs md:text-sm font-semibold uppercase tracking-wider text-amber-900/60 font-sans mb-4 select-none">
            <span>A Love Story</span>
            <span>Page {page} of 2</span>
          </div>

          {page === 1 ? (
            /* PAGE 1 CONTENT */
            <div className="w-full flex flex-col items-center animate-fade-in">
              {/* Title */}
              <h1 className="text-3xl md:text-5xl text-center text-rose-800 font-bold tracking-wide drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] leading-tight">
                A Treasure Called Love
              </h1>
              
              {/* Subtitle */}
              <h3 className="text-base md:text-xl text-center text-amber-900/80 font-semibold italic mt-2 mb-6">
                Celebrating 7 Beautiful Years of Togetherness
              </h3>
              
              <div className="w-32 h-[1.5px] bg-amber-800/30 mb-6"></div>
              
              {/* Letter Body (Larger Font Size) */}
              <div className="w-full space-y-6 text-lg md:text-xl leading-relaxed text-amber-950/90 text-justify">
                <p className="font-bold text-rose-950 text-xl not-italic">
                  My Dearest Vishagan,
                </p>
                
                <p>
                  The day you came to see me, a new sunrise began in my life.
                </p>
                
                <p>
                  In your gentle smile, my heart found a place where it felt safe, loved, and truly at home. It felt as though destiny had quietly written our story long before we ever met.
                </p>
                
                <p>
                  One night, my father appeared in my dream and softly said, <span className="italic font-semibold">"He is your destiny."</span> In that precious moment, I felt a deep sense of peace. I knew that you were God's beautiful gift to me, sent to fill my life with love, happiness, and purpose.
                </p>
                
                <p>
                  From our engagement to our wedding day, every moment became a cherished memory. What began as a beautiful connection blossomed into a love story that continues to grow stronger with each passing year.
                </p>
                
                <p>
                  The greatest blessings of our journey are our two little boys — the sweetest reflections of our love. When I look at them, I see pieces of you and me, and my heart overflows with gratitude for the beautiful family we have created together.
                </p>
              </div>
            </div>
          ) : (
            /* PAGE 2 CONTENT */
            <div className="w-full flex flex-col items-center animate-fade-in">
              {/* Title Header for Page 2 */}
              <h2 className="text-2xl md:text-3xl text-center text-rose-800 font-bold tracking-wide mb-4">
                The Promise of Forever
              </h2>
              <div className="w-24 h-[1px] bg-amber-800/20 mb-6"></div>

              {/* Letter Body (Larger Font Size) */}
              <div className="w-full space-y-6 text-lg md:text-xl leading-relaxed text-amber-950/90 text-justify">
                <p>
                  Even when distance separates us, our hearts remain connected. The love we share continues to bridge every mile between us. The words you wrote with so much affection still live in my heart like timeless poetry, reminding me every day how blessed I am to have you.
                </p>
                
                <p>
                  I am endlessly proud of you — not only for what you do, but for who you are. Your kindness, compassion, and helping nature make you truly special. Your character shines brighter than any treasure, and your heart is rarer than the most precious gem.
                </p>
                
                <p>
                  Today, as we celebrate <span className="font-bold text-rose-900">our 7th Wedding Anniversary</span>, my heart is filled with gratitude for every laugh, every challenge we overcame, every dream we shared, and every beautiful memory we created together.
                </p>
                
                <p className="font-bold text-rose-900 text-xl md:text-2xl text-center my-6 py-2 border-y border-amber-800/10 select-none">
                  Happy 7th Anniversary, my love!
                </p>
                
                <p>
                  Thank you for being my partner, my strength, my best friend, and the most wonderful husband. These seven years have been filled with love, learning, growth, and countless blessings. If I had the chance to choose again, I would choose you every single time.
                </p>
                
                <p>
                  As we step into another chapter of our journey, I pray that our love continues to grow deeper, our bond stronger, and our hearts closer than ever before.
                </p>
                
                <p className="text-center italic">
                  You are not just my husband.
                </p>
                
                <p className="font-bold text-rose-950 text-center italic text-xl md:text-2xl my-4">
                  "You are my home, my happiness, my greatest blessing, and my forever treasure."
                </p>
                
                <p>
                  Here's to seven beautiful years behind us and a lifetime of love still ahead.
                </p>
                
                {/* Signature & Closing */}
                <div className="pt-6 flex flex-col items-end">
                  <p className="text-sm md:text-base text-amber-800/80 italic font-semibold">With all my love, always and forever,</p>
                  <p className="text-2xl md:text-3xl font-bold text-rose-800 mt-1">Dhivya ❤️</p>
                </div>
              </div>

              {/* Bottom decorative details */}
              <div className="w-full border-t border-amber-800/20 mt-8 pt-6 flex flex-col items-center text-center text-xs md:text-sm text-amber-800/80 italic space-y-1 select-none">
                <p className="font-semibold text-rose-900/90 not-italic">Vishagan ❤️ Dhivya</p>
                <p>A Love Written by Destiny</p>
                <p className="text-[11px] tracking-wide uppercase font-semibold text-amber-900/60 font-sans mt-1">
                  7 Years of Love • Trust • Togetherness • Forever
                </p>
              </div>

              {/* Wax Seal Decoration */}
              <div className="relative mt-6 flex flex-col items-center justify-center select-none">
                <div className="relative w-16 h-16 rounded-full bg-rose-700 shadow-md flex items-center justify-center border-2 border-rose-800/80 animate-pulse-slow">
                  <div className="w-12 h-12 rounded-full border border-dashed border-rose-500/40 flex items-center justify-center">
                    <svg className="w-6 h-6 text-rose-200 fill-current" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Heart Navigation Button */}
          <div className="mt-8 select-none flex flex-col items-center">
            <button 
              onClick={handleNext}
              className="relative group transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
            >
              {/* Glow */}
              <div className="absolute inset-0 bg-rose-600 rounded-full blur-md opacity-45 group-hover:opacity-75 transition-opacity duration-300"></div>
              
              {/* Continue button styled as heart */}
              <div className="relative flex items-center justify-center w-16 h-16 text-white">
                <svg 
                  className="absolute w-full h-full text-rose-700 fill-current group-hover:text-rose-600 transition-colors duration-300 drop-shadow-lg"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span className="relative z-10 font-sans text-[10px] uppercase font-bold tracking-wider text-rose-50 select-none">
                  {page === 1 ? "Next" : "Finish"}
                </span>
              </div>
            </button>
            <span className="font-sans text-[9px] uppercase tracking-widest text-amber-900/60 mt-1 select-none">
              {page === 1 ? "Read Page 2" : "View Memory Lane"}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
