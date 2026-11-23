import React from 'react';
import { WorldId, WORLDS } from '../types';
import { WorldNavigator } from './WorldNavigator';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Camera,
  Mail,
  Heart,
  Sparkles,
  Flower2,
  Coffee,
  Gift,
  Lamp,
  AppWindow,
  Archive,
  Shirt,
  Sparkle,
  Music,
  Image,
  Smile,
} from 'lucide-react';

interface HUDOverlayProps {
  currentWorld: WorldId;
  onSelectWorld: (world: WorldId) => void;
  onResetCamera: () => void;
  onTakeSnapshot: () => void;
  onOpenLetter: () => void;
  onActionClick: () => void;
  onToyClick?: (toyId: string) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  interactionFeedback: string | null;
  teddyState?: 'idle' | 'walking' | 'embracing';
}

export const HUDOverlay: React.FC<HUDOverlayProps> = ({
  currentWorld,
  onSelectWorld,
  onResetCamera,
  onTakeSnapshot,
  onOpenLetter,
  onActionClick,
  onToyClick,
  isMuted,
  onToggleMute,
  interactionFeedback,
  teddyState,
}) => {
  const meta = WORLDS[currentWorld];

  let actionLabel = 'Explore';
  let actionIcon = <Sparkles className="w-4 h-4" />;

  if (currentWorld === 'dollhouse') {
    actionLabel = 'Open Surprise Gift';
    actionIcon = <Gift className="w-4 h-4 text-pink-200" />;
  } else if (currentWorld === 'garden') {
    actionLabel = 'Bloom Blue Roses';
    actionIcon = <Flower2 className="w-4 h-4 text-cyan-200" />;
  } else if (currentWorld === 'teddy') {
    actionLabel = teddyState === 'embracing' ? 'Cuddle Closer, jana' : 'Hug me, jana';
    actionIcon = <Heart className="w-4 h-4 text-rose-200 fill-rose-200 animate-pulse" />;
  } else if (currentWorld === 'cafe') {
    actionLabel = 'Cheers, jana!';
    actionIcon = <Coffee className="w-4 h-4 text-amber-200" />;
  }

  // 10 Interactive Dollhouse Toys (Directly inspired by Reference Board Panel 1)
  const dollhouseToys = [
    { id: 'dolls', label: 'Play with dolls', icon: <Smile className="w-3.5 h-3.5 text-rose-300" /> },
    { id: 'gift', label: 'Gift Box', icon: <Gift className="w-3.5 h-3.5 text-pink-400" /> },
    { id: 'letter', label: 'Love Letter', icon: <Mail className="w-3.5 h-3.5 text-rose-400" /> },
    { id: 'lamp', label: 'Bed Lamp', icon: <Lamp className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'window', label: 'Window', icon: <AppWindow className="w-3.5 h-3.5 text-sky-400" /> },
    { id: 'drawer', label: 'Drawer', icon: <Archive className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'wardrobe', label: 'Wardrobe', icon: <Shirt className="w-3.5 h-3.5 text-purple-400" /> },
    { id: 'mirror', label: 'Mirror', icon: <Sparkle className="w-3.5 h-3.5 text-pink-300" /> },
    { id: 'music_box', label: 'Music Box', icon: <Music className="w-3.5 h-3.5 text-indigo-400" /> },
    { id: 'vase', label: 'Flowers', icon: <Flower2 className="w-3.5 h-3.5 text-rose-300" /> },
    { id: 'photo', label: 'Keepsake', icon: <Image className="w-3.5 h-3.5 text-amber-300" /> },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2.5 sm:p-5 z-20 overflow-hidden select-none" style={{paddingTop:'max(.65rem, env(safe-area-inset-top))',paddingBottom:'max(.7rem, env(safe-area-inset-bottom))'}}>
      {/* TOP BAR: Storybook Navigation (Reference 5) */}
      <header className="flex items-center justify-between gap-2.5 pointer-events-auto">
        {/* Brand */}
        <div className="flex flex-col bg-[#261629]/65 backdrop-blur-lg rounded-2xl border border-white/15 px-3 py-2 shadow-lg max-w-[164px] sm:max-w-none">
          <div className="flex items-center gap-1.5 drop-shadow-md">
            <span className="font-display font-semibold text-sm sm:text-xl tracking-tight text-white drop-shadow">
              Pinkii’s Little Universe
            </span>
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400 animate-pulse" />
          </div>
          <span className="text-[10px] sm:text-[11px] text-rose-200/90 tracking-wide font-medium">
            Crafted with all my love for Ayra
          </span>
        </div>

        {/* Center Desktop Navigation */}
        <div className="hidden md:flex">
          <WorldNavigator currentWorld={currentWorld} onSelectWorld={onSelectWorld} />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Handwritten letter button */}
          <button
            onClick={onOpenLetter}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-medium rounded-full shadow-lg shadow-rose-500/25 border border-white/20 backdrop-blur-md transition-all active:scale-95 whitespace-nowrap"
            title="Read Ayaan’s letter"
          >
            <Mail className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ayaan’s Letter</span>
          </button>

          {/* Polaroid Snapshot Camera */}
          <button
            onClick={onTakeSnapshot}
            className="p-2 sm:p-2.5 text-slate-100 hover:text-white bg-black/50 hover:bg-black/70 border border-white/20 rounded-full backdrop-blur-xl shadow-lg transition-all active:scale-95"
            title="Take keepsake photo"
            aria-label="Capture snapshot"
          >
            <Camera className="w-4 h-4" />
          </button>

          {/* Reset Camera Orbit Angle */}
          <button
            onClick={onResetCamera}
            className="p-2 sm:p-2.5 text-slate-100 hover:text-white bg-black/50 hover:bg-black/70 border border-white/20 rounded-full backdrop-blur-xl shadow-lg transition-all active:scale-95"
            title="Reset viewing angle"
            aria-label="Reset camera"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            className={`p-2 sm:p-2.5 rounded-full backdrop-blur-xl border transition-all active:scale-95 shadow-lg ${
              isMuted
                ? 'text-slate-300 bg-black/50 border-white/20 hover:text-white'
                : 'text-rose-200 bg-rose-950/60 border-rose-500/40 hover:bg-rose-900/60'
            }`}
            title={isMuted ? 'Turn Sound On' : 'Mute Sound'}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* MOBILE NAV (Storybook pills on top for phones) */}
      <div className="flex md:hidden justify-center pointer-events-auto mt-1.5">
        <WorldNavigator currentWorld={currentWorld} onSelectWorld={onSelectWorld} />
      </div>

      {/* FLOATING INTERACTION FEEDBACK */}
      <div className="flex flex-col items-center pointer-events-none transition-all my-auto">
        {interactionFeedback && (
          <div className="py-2 px-5 rounded-full bg-black/75 backdrop-blur-xl border border-rose-300/30 text-xs sm:text-sm text-rose-100 shadow-2xl flex items-center gap-2 transform animate-bounce">
            <Sparkles className="w-4 h-4 text-rose-300" />
            <span className="font-medium tracking-wide">{interactionFeedback}</span>
          </div>
        )}
      </div>

      {/* BOTTOM CONTROL DOCK */}
      <footer className="flex flex-col items-center gap-1.5 sm:gap-2.5 pointer-events-auto mb-1">
        {/* DOLLHOUSE 10-TOY INTERACTIVE BAR (Matches Reference Board Panel 1) */}
        {currentWorld === 'dollhouse' && (
          <div className="w-full max-w-xl overflow-x-auto scrollbar-none py-1 px-2 flex items-center gap-1.5 justify-start sm:justify-center bg-black/45 backdrop-blur-xl rounded-2xl border border-white/15 shadow-xl">
            {dollhouseToys.map(toy => (
              <button
                key={toy.id}
                onClick={() => onToyClick?.(toy.id)}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white text-[11px] font-medium rounded-xl border border-white/10 whitespace-nowrap transition-all shadow-sm"
              >
                {toy.icon}
                <span>{toy.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* World Subtitle & Warm Hint */}
        <div className="text-center bg-black/45 backdrop-blur-md py-1.5 px-4 rounded-full border border-white/15 shadow-lg">
          <p className="text-xs sm:text-sm font-semibold text-rose-100 drop-shadow">
            {meta.tagline}
          </p>
          <p className="text-[11px] text-slate-200/90 drop-shadow">
            {meta.hint}
          </p>
        </div>

        {/* Primary Storybook Action Pill (Reference 5) */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onActionClick}
            className="flex items-center gap-2 px-6 sm:px-8 py-3 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:to-pink-600 active:scale-95 text-white font-medium text-xs sm:text-sm rounded-full shadow-2xl shadow-rose-500/40 border border-white/30 transition-all cursor-pointer ring-2 ring-rose-300/30"
          >
            {actionIcon}
            <span className="tracking-wide font-semibold">{actionLabel}</span>
          </button>

          {currentWorld === 'dollhouse' && (
            <button
              onClick={onOpenLetter}
              className="flex items-center gap-1.5 px-5 py-3 bg-black/60 hover:bg-black/80 active:scale-95 text-rose-200 text-xs sm:text-sm rounded-full backdrop-blur-xl border border-white/20 transition-all shadow-lg"
            >
              <Mail className="w-4 h-4 text-rose-300" />
              <span>Ayaan’s Letter</span>
            </button>
          )}
        </div>

        {/* Minimal exploration hint */}
        <p className="text-[10px] text-slate-300/80 drop-shadow tracking-wide">
          Drag to explore · Pinch to zoom · Tap the little surprises
        </p>
      </footer>
    </div>
  );
};
