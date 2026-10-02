'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const LogisticsBackground = dynamic(() => import('./LogisticsBackground'), { ssr: false });

let hasPlayedInMemory = false;

export default function HomepageOverlay({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Assume we need intro by default if we are on homepage to avoid flash of content
  const isHomepage = /^\/([a-z]{2})?$/.test(pathname);
  
  const [isClient, setIsClient] = useState(false);
  const [introComplete, setIntroComplete] = useState(!isHomepage);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (isHomepage) {
      const urlParams = new URLSearchParams(window.location.search);
      const isFromIntro = urlParams.get('fromIntro') === '1';

      if (isFromIntro) {
        // Just finished intro, clean up URL and mark as played in memory
        hasPlayedInMemory = true;
        urlParams.delete('fromIntro');
        const newUrl = window.location.pathname + (urlParams.toString() ? `?${urlParams.toString()}` : '');
        window.history.replaceState({}, '', newUrl);
        setIntroComplete(true);
      } else if (hasPlayedInMemory) {
        // User is navigating via client-side router (e.g. back button or logo click), don't replay
        setIntroComplete(true);
      } else {
        // Direct entry or hard reload, play the intro!
        setRedirecting(true);
        sessionStorage.setItem('introReturnTo', window.location.pathname + window.location.search);
        window.location.href = `/intro`;
      }
    } else {
      setIntroComplete(true);
    }
  }, [isHomepage, pathname]);

  // If we are redirecting to the intro, don't render the site at all
  if (redirecting) {
    return (
      <div className="fixed inset-0 bg-[#0a1628] z-50"></div>
    );
  }

  // If we are on the homepage and might redirect, hide to prevent flash.
  // Otherwise, render normally during SSR so the user sees content immediately.
  if (!isClient) {
    return (
      <div className={`relative z-10 w-full ${isHomepage ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </div>
    );
  }

  return (
    <>
      <LogisticsBackground 
        skipIntro={true} 
        onIntroComplete={() => {}} 
      />

      <div 
        className={`relative z-10 w-full transition-opacity duration-1000 ease-in-out opacity-100`}
      >
        {children}
      </div>
    </>
  );
}
