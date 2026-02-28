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

function loadRuffleScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.RufflePlayer) return Promise.resolve();
  if (rufflePromise) return rufflePromise;

  rufflePromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-ruffle="true"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Ruffle failed to load')), {
        once: true
      });
      return;
    }

    const script = document.createElement('script');
    script.src = '/ruffle/ruffle.js';
    script.async = true;
    script.dataset.ruffle = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Ruffle failed to load'));
    document.body.appendChild(script);
  });

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
        await (playerNode as HTMLElement & { load: (movie: string) => Promise<void> }).load(src);
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
