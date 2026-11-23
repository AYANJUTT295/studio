import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Heart } from 'lucide-react';
import { soundEngine } from '../audio/soundEffects';

interface PolaroidModalProps {
  imageSrc: string | null;
  onClose: () => void;
}

export const PolaroidModal: React.FC<PolaroidModalProps> = ({ imageSrc, onClose }) => {
  if (!imageSrc) return null;

  const handleDownload = () => {
    soundEngine.playSparkle();
    const link = document.createElement('a');
    link.download = `pinkii-universe-memory-${Date.now()}.png`;
    link.href = imageSrc;
    link.click();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotate: -3 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative bg-white text-slate-800 rounded-2xl p-4 sm:p-5 pb-6 shadow-2xl max-w-sm w-full z-10 flex flex-col items-center border border-slate-100"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Polaroid Image */}
          <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-900 border border-slate-200 shadow-inner">
            <img src={imageSrc} alt="Snapshot from Pinkii's Little Universe" className="w-full h-full object-cover" />
          </div>

          {/* Handwritten Caption */}
          <div className="mt-4 text-center">
            <p className="font-handwriting text-2xl text-slate-800">
              Pinkii’s Little Universe
            </p>
            <p className="text-xs text-rose-500 font-medium flex items-center justify-center gap-1 mt-0.5">
              <span>Made with love by Ayaan for Ayra</span>
              <Heart className="w-3 h-3 fill-rose-500" />
            </p>
          </div>

          {/* Download button */}
          <button
            onClick={handleDownload}
            className="mt-4 w-full py-2.5 px-4 bg-rose-500 hover:bg-rose-600 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-rose-500/25 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Save Photo to Device</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
