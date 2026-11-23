import React from 'react';
import { WorldId, WORLDS } from '../types';
import { Heart, Sparkles, Mail } from 'lucide-react';

interface FallbackViewProps {
  currentWorld: WorldId;
  onOpenLetter: () => void;
}

export const FallbackView: React.FC<FallbackViewProps> = ({ currentWorld, onOpenLetter }) => {
  const meta = WORLDS[currentWorld];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-rose-950 via-slate-900 to-black text-white">
      <div className="w-20 h-20 rounded-3xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center mb-6 shadow-xl shadow-rose-500/20">
        <Heart className="w-10 h-10 text-rose-400 fill-rose-400 animate-pulse" />
      </div>

      <h1 className="text-3xl font-display font-bold text-white mb-2">
        {meta.name}
      </h1>
      <p className="text-sm text-rose-200/80 max-w-md mb-6">
        {meta.tagline} — Crafted with endless care by Muhammad Ayaan for Ayra (Pinkii).
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={onOpenLetter}
          className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-medium text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-rose-500/30 transition-all"
        >
          <Mail className="w-4 h-4" />
          <span>Read Ayaan’s Letter</span>
        </button>
      </div>

      <div className="mt-8 text-xs text-slate-400 flex items-center gap-1">
        <Sparkles className="w-3.5 h-3.5 text-rose-400" />
        <span>Hardware acceleration or WebGL view enabled for optimal 3D experience</span>
      </div>
    </div>
  );
};
