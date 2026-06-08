import React, { useEffect, useRef, useState } from 'react';
import { Music, Music4, Volume2, VolumeX } from 'lucide-react';
import { whenYTReady, getOrCreatePlayerDiv } from '../utils/ytApi';

interface BackgroundMusicProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  page: 'landing' | 'quiz' | 'letter' | 'polaroid' | 'memorylane' | 'ending';
}

export const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ isPlaying, setIsPlaying, isMuted, setIsMuted, page }) => {
  const player1Ref = useRef<any>(null); // Song 1: Landing / Quiz / Ending
  const player2Ref = useRef<any>(null); // Song 2: Letter
  const player3Ref = useRef<any>(null); // Song 3: Polaroid
  const [isPlayer1Ready, setIsPlayer1Ready] = useState(false);

  // Keep refs in sync with latest props so YT onReady callbacks see fresh values
  const isPlayingRef = useRef(isPlaying);
  const pageRef = useRef(page);
  const isMutedRef = useRef(isMuted);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { pageRef.current = page; }, [page]);
  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);

  const safePlay = (p: any) => {
    if (!p || typeof p.playVideo !== 'function') return;
    if (isMutedRef.current) p.mute(); else p.unMute();
    p.playVideo();
  };
  const safePause = (p: any) => {
    if (!p || typeof p.pauseVideo !== 'function') return;
    p.pauseVideo();
  };

  const applyPlayback = () => {
    const p1 = player1Ref.current;
    const p2 = player2Ref.current;
    const p3 = player3Ref.current;
    const playing = isPlayingRef.current;
    const pg = pageRef.current;

    if (!playing) {
      safePause(p1); safePause(p2); safePause(p3);
      return;
    }
    if (pg === 'letter') {
      safePause(p1); safePlay(p2); safePause(p3);
    } else if (pg === 'polaroid') {
      safePause(p1); safePause(p2); safePlay(p3);
    } else if (pg === 'landing' || pg === 'quiz' || pg === 'ending') {
      safePlay(p1); safePause(p2); safePause(p3);
    } else if (pg === 'memorylane') {
      safePause(p1); safePause(p2); safePause(p3);
    }
  };

  // Create YT players once the API is ready
  useEffect(() => {
    whenYTReady(() => {
      getOrCreatePlayerDiv('yt-bg-p1');
      getOrCreatePlayerDiv('yt-bg-p2');
      getOrCreatePlayerDiv('yt-bg-p3');

      player1Ref.current = new window.YT.Player('yt-bg-p1', {
        videoId: 'nIx0yAMT6o8',
        playerVars: { autoplay: 0, controls: 0, loop: 1, playlist: 'nIx0yAMT6o8', rel: 0, iv_load_policy: 3 },
        events: {
          onReady: () => {
            setIsPlayer1Ready(true);
            applyPlayback();
          },
        },
      });
      player2Ref.current = new window.YT.Player('yt-bg-p2', {
        videoId: '-smdhF_9Hvw',
        playerVars: { autoplay: 0, controls: 0, loop: 1, playlist: '-smdhF_9Hvw', rel: 0, iv_load_policy: 3 },
        events: { onReady: applyPlayback },
      });
      player3Ref.current = new window.YT.Player('yt-bg-p3', {
        videoId: 'G4epKa11ets',
        playerVars: { autoplay: 0, controls: 0, loop: 1, playlist: 'G4epKa11ets', rel: 0, iv_load_policy: 3 },
        events: { onReady: applyPlayback },
      });
    });

    return () => {
      // Destroy players when component unmounts
      [player1Ref, player2Ref, player3Ref].forEach(ref => {
        try { ref.current?.destroy(); } catch { /* ignore */ }
        ref.current = null;
      });
      ['yt-bg-p1', 'yt-bg-p2', 'yt-bg-p3'].forEach(id => {
        document.getElementById(id)?.remove();
      });
    };
  }, []);

  // Listen for initial user interaction to trigger autoplay synchronously
  useEffect(() => {
    if (!isPlayer1Ready) return;

    const startAutoplay = () => {
      const p1 = player1Ref.current;
      if (p1 && typeof p1.playVideo === 'function' && isPlayingRef.current && pageRef.current === 'landing') {
        if (isMutedRef.current) p1.mute(); else p1.unMute();
        p1.playVideo();
      }
      // Remove listeners after first interaction
      window.removeEventListener('click', startAutoplay);
      window.removeEventListener('touchstart', startAutoplay);
    };

    window.addEventListener('click', startAutoplay);
    window.addEventListener('touchstart', startAutoplay);

    return () => {
      window.removeEventListener('click', startAutoplay);
      window.removeEventListener('touchstart', startAutoplay);
    };
  }, [isPlayer1Ready]);

  // React to page/isPlaying changes after players are already created
  useEffect(() => {
    applyPlayback();
  }, [isPlaying, page]);

  // React to mute toggle
  useEffect(() => {
    [player1Ref, player2Ref, player3Ref].forEach(ref => {
      const p = ref.current;
      if (!p || typeof p.mute !== 'function') return;
      if (isMuted) p.mute(); else p.unMute();
    });
  }, [isMuted]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <div className="flex items-center gap-2 bg-pink-950/80 backdrop-blur-md border border-pink-500/30 px-3 py-2 rounded-full shadow-lg hover:shadow-pink-500/20 transition-all duration-300">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="relative flex items-center justify-center w-10 h-10 rounded-full bg-pink-600 hover:bg-pink-500 text-white shadow-md transition-all duration-300 hover:scale-110 active:scale-95"
          title={isPlaying ? 'Pause Music' : 'Play Music'}
        >
          {isPlaying ? (
            <Music4 className="w-5 h-5 animate-pulse text-pink-100" />
          ) : (
            <Music className="w-5 h-5 text-pink-200" />
          )}
          {isPlaying && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500" />
            </span>
          )}
        </button>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-900/60 hover:bg-pink-900 text-pink-200 hover:text-white transition-all duration-300"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
