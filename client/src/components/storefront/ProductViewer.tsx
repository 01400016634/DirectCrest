'use client';

import React from 'react';

export default function ProductViewer({ 
  modelUrl, 
  interactive = true,
  className = "w-full h-full min-h-[400px] bg-gradient-to-tr from-[#09090b] to-[#18181b] rounded-2xl overflow-hidden border border-red-950 shadow-2xl relative cursor-grab active:cursor-grabbing",
  showBadge = true,
  poster
}: { 
  modelUrl?: string; 
  interactive?: boolean;
  className?: string;
  showBadge?: boolean;
  poster?: string;
}) {
  const absoluteModelUrl = modelUrl ? (modelUrl.startsWith('/') || modelUrl.startsWith('http') ? modelUrl : `/${modelUrl}`) : undefined;

  if (!absoluteModelUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#09090b] text-gray-500 border border-gray-800 rounded-2xl shadow-inner">
        <p>No 3D Model Available</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {showBadge && (
        <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-red-500 border border-red-900/50 flex items-center shadow-lg pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
          Interactive 3D View
        </div>
      )}
      
      {React.createElement('model-viewer', {
        src: absoluteModelUrl,
        poster: poster,
        alt: "3D product model",
        "auto-rotate": true,
        "camera-controls": interactive ? true : undefined,
        "interaction-prompt": "none",
        "shadow-intensity": "1",
        "environment-image": "neutral",
        reveal: "auto",
        loading: "lazy",
        style: { width: '100%', height: '100%', backgroundColor: 'transparent' }
      })}
    </div>
  );
}
