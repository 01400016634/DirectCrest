'use client';

import { useState, useEffect } from 'react';

export default function IntroVideo({ onComplete }: { onComplete?: () => void }) {
  const [isIntroPlaying, setIsIntroPlaying] = useState(true);
  const [opacity, setOpacity] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const finishIntro = () => {
    setOpacity(0);
    setTimeout(() => {
      setIsIntroPlaying(false);
      if (onComplete) onComplete();
    }, 500); // 500ms matches the duration-500 tailwind class
  };

  if (!mounted || !isIntroPlaying) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-500`}
      style={{ opacity }}
    >
      <video
        src="/assets/intro.mp4"
        autoPlay
        muted
        playsInline
        onEnded={finishIntro}
        className="w-full h-full object-cover"
        controls={false}
      />
      
      <button 
        onClick={finishIntro}
        className="absolute bottom-8 right-8 text-white/50 hover:text-white text-sm font-medium tracking-widest uppercase transition-colors z-50 bg-black/20 hover:bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10"
      >
        Skip Intro
      </button>
    </div>
  );
}
