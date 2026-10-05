"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { X } from "lucide-react";

export default function RouteModal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleClose = () => {
    router.back();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      <div className="relative bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl z-10 flex flex-col transform transition-all animate-in fade-in zoom-in-95 duration-200 overflow-hidden border border-slate-700">
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={handleClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors shadow-lg border border-slate-600"
          >
            <X className="w-6 h-6 text-slate-300" />
          </button>
        </div>
        
        <div className="w-full h-full overflow-y-auto relative z-0">
          <div className="pt-4 pb-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
