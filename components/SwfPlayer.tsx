'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  src: string;
};

declare global {
  interface Window {
    RufflePlayer?: {
      newest: () => {
        createPlayer: () => HTMLElement & { load: (movie: string) => Promise<void> };
      };
    };
  }
}

let rufflePromise: Promise<void> | null = null;

async function injectScript(src: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

function loadRuffleScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.RufflePlayer) return Promise.resolve();
  if (rufflePromise) return rufflePromise;

  rufflePromise = (async () => {
    const localScript = '/ruffle/ruffle.js';
    try {
      await injectScript(localScript);
      if (!window.RufflePlayer) {
        throw new Error('Local ruffle script loaded, but window.RufflePlayer is unavailable');
      }
      return;
    } catch {
      const fallbackScript = 'https://unpkg.com/@ruffle-rs/ruffle/ruffle.js';
      await injectScript(fallbackScript);
      if (!window.RufflePlayer) {
        throw new Error('Fallback ruffle script loaded, but window.RufflePlayer is unavailable');
      }
    }
  })();

  return rufflePromise;
}

export default function SwfPlayer({ src }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let playerNode: HTMLElement | null = null;

    async function init() {
      try {
        setError(null);
        await loadRuffleScript();
        if (!window.RufflePlayer || !containerRef.current) {
          throw new Error('Ruffle is unavailable');
        }

        const ruffle = window.RufflePlayer.newest();
        playerNode = ruffle.createPlayer();
        playerNode.style.width = '100%';
        playerNode.style.height = '100%';
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(playerNode);
        await playerNode.load(src);
      } catch {
        if (mounted) {
          setError('Урок не поддерживается в браузере, попробуйте другой.');
        }
      }
    }

    init();

    return () => {
      mounted = false;
      if (playerNode?.parentElement) {
        playerNode.parentElement.removeChild(playerNode);
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [src]);

  if (error) {
    return (
      <div className="card" style={{ marginTop: 12 }}>
        <p>{error}</p>
        <a href={src} download>
          <button>Скачать SWF</button>
        </a>
      </div>
    );
  }

  return <div ref={containerRef} className="player-frame" aria-label="SWF player" />;
}
