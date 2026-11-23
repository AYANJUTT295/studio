import React from 'react';
import { WorldId } from '../types';
import { Sparkles, Flower2, Heart, Coffee } from 'lucide-react';
import { soundEngine } from '../audio/soundEffects';

interface WorldNavigatorProps {
  currentWorld: WorldId;
  onSelectWorld: (world: WorldId) => void;
}

export const WorldNavigator: React.FC<WorldNavigatorProps> = ({ currentWorld, onSelectWorld }) => {
  const worldItems: { id: WorldId; label: string; icon: React.ReactNode }[] = [
    {
      id: 'dollhouse',
      label: 'Dollhouse',
      icon: <Sparkles className="w-3.5 h-3.5" />,
    },
    {
      id: 'garden',
      label: 'Midnight Garden',
      icon: <Flower2 className="w-3.5 h-3.5" />,
    },
    {
      id: 'teddy',
      label: 'Cuddle Room',
      icon: <Heart className="w-3.5 h-3.5" />,
    },
    {
      id: 'cafe',
      label: 'Forever Café',
      icon: <Coffee className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <nav className="flex items-center gap-1.5 p-1.5 bg-black/50 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl shadow-rose-950/30 max-w-full overflow-x-auto scrollbar-none">
      {worldItems.map((item) => {
        const isActive = currentWorld === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              if (item.id !== currentWorld) {
                soundEngine.playSparkle();
                onSelectWorld(item.id);
              }
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all duration-300 ${
              isActive
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/40 font-semibold ring-1 ring-white/30 scale-[1.02]'
                : 'text-slate-200 hover:text-white hover:bg-white/10'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
