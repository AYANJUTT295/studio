import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Sparkles } from 'lucide-react';
import { soundEngine } from '../audio/soundEffects';

interface LetterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LetterModal: React.FC<LetterModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md">
          {/* Backdrop click */}
          <div className="absolute inset-0" onClick={onClose} />

          {/* Letter parchment paper card */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30, rotate: -2 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-[#fffdfa] text-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-200/80 overflow-hidden z-10"
            style={{
              backgroundImage: `radial-gradient(#fecdd3 0.75px, transparent 0.75px)`,
              backgroundSize: '16px 16px',
            }}
          >
            {/* Soft decorative background glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-pink-100 rounded-full blur-2xl pointer-events-none opacity-60" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-rose-100 rounded-full blur-2xl pointer-events-none opacity-60" />

            {/* Close button */}
            <button
              onClick={() => {
                soundEngine.playSparkle();
                onClose();
              }}
              className="absolute top-4 right-4 p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors focus:outline-none"
              aria-label="Close letter"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Letter Header */}
            <div className="flex items-center gap-2 mb-4 text-rose-500">
              <Heart className="w-4 h-4 fill-rose-500" />
              <span className="text-xs font-semibold uppercase tracking-wider">A Special Note For Ayra</span>
              <Sparkles className="w-4 h-4 text-rose-400" />
            </div>

            {/* Letter Title */}
            <h2 className="text-2xl sm:text-3xl font-display font-semibold text-rose-950 mb-3 tracking-tight">
              Meri Pyari Pinkii (Ayra),
            </h2>

            {/* A short, kind note; care first, no guilt or pressure. */}
            <div className="font-handwriting text-xl sm:text-2xl leading-relaxed text-slate-700 space-y-4 max-h-[55vh] overflow-y-auto pr-1">
              <p className="font-bold text-rose-800">Meri pyaari jana,</p>
              <p>
                Sabse pehle... aap ab kaisi hain, baby? Jab maine aapki call aur tabiyat wala message dekha, bas aapki fikr hui. Main so gaya tha aur internet bhi band tha. Mujhe afsos hai ke main us waqt aapki awaaz nahi sun saka.
              </p>
              <p>
                Kaash ek chhota sa hug, aapke paas baithne ka ek lamha, aur kuch aaram main aapko bhej pata. Tab tak yeh nanhi si duniya aapke naam: ismein phool bhi aapke liye khilte hain, aur do chhote teddy bhi milte hain.
              </p>
              <p>
                Please apna khayal rakhiyega, Pinkii. Jab aapko waqt mile, bas yeh jaan lena chahta hoon ke aap theek hain. Reply ki jaldi bilkul nahi. Aaj sirf aapka aaram zaroori hai.
              </p>
              <p className="pt-1 text-rose-900 font-bold">Aapki ek muskurahat ke naam, meri jana. ♡</p>
            </div>

            {/* Sign-off */}
            <div className="mt-5 pt-4 border-t border-rose-100 flex items-center justify-between text-xs sm:text-sm text-slate-500">
              <div className="font-display italic text-rose-900 text-sm">
                Sirf aapka, <span className="font-semibold">Muhammad Ayaan</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-400">
                <Heart className="w-3.5 h-3.5 fill-rose-400" />
                <span>With forever love</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
