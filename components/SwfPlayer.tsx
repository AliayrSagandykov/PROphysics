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

function appendScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-ruffle-src="${src}"]`);
    if (existing) {
      if (window.RufflePlayer) {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error(`Ruffle failed to load from ${src}`)), {
        once: true
      });
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.dataset.ruffleSrc = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Ruffle failed to load from ${src}`));
    document.body.appendChild(script);
  });
}

async function loadRuffleScript(): Promise<void> {
  if (typeof window === 'undefined') return;
  if (window.RufflePlayer) return;
  if (rufflePromise) return rufflePromise;

  rufflePromise = (async () => {
    const sources = ['/ruffle/ruffle.js', 'https://unpkg.com/@ruffle-rs/ruffle/ruffle.js'];
    let lastError: Error | null = null;

    for (const source of sources) {
      try {
        await appendScript(source);
        if (window.RufflePlayer) return;
      } catch (error) {
        lastError = error as Error;
      }
    }

    throw lastError ?? new Error('Ruffle is unavailable');
  })().catch((error) => {
    rufflePromise = null;
    throw error;
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
          setError('Не удалось запустить урок. Проверьте SWF-файл или подключение к Ruffle.');
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
