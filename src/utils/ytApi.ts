// Singleton YouTube IFrame API loader — safe to call from multiple components

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

const callbacks: (() => void)[] = [];
let state: 'idle' | 'loading' | 'ready' = 'idle';

/**
 * Calls `callback` as soon as the YT IFrame API is ready.
 * Safe to call multiple times from multiple components.
 */
export const whenYTReady = (callback: () => void): void => {
  if (state === 'ready' && window.YT?.Player) {
    callback();
    return;
  }
  callbacks.push(callback);
  if (state === 'idle') {
    state = 'loading';
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      state = 'ready';
      if (prev) prev();
      callbacks.forEach(cb => cb());
      callbacks.length = 0;
    };
    if (!document.getElementById('yt-iframe-api-script')) {
      const script = document.createElement('script');
      script.id = 'yt-iframe-api-script';
      script.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(script);
    }
  }
};

/** Creates an off-screen div in the body and returns it. Skips if already exists. */
export const getOrCreatePlayerDiv = (id: string): HTMLDivElement => {
  const existing = document.getElementById(id);
  if (existing) return existing as HTMLDivElement;
  const div = document.createElement('div');
  div.id = id;
  div.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;';
  document.body.appendChild(div);
  return div;
};
