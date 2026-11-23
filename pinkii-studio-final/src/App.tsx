/**
 * Pinkii's Little Universe
 * Made with love by Muhammad Ayaan for Ayra (Pinkii).
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { WorldId } from './types';
import { SceneManager } from './scenes/SceneManager';
import { HUDOverlay } from './components/HUDOverlay';
import { LetterModal } from './components/LetterModal';
import { PolaroidModal } from './components/PolaroidModal';
import { FallbackView } from './components/FallbackView';
import { soundEngine } from './audio/soundEffects';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneManagerRef = useRef<SceneManager | null>(null);

  const [currentWorld, setCurrentWorld] = useState<WorldId>('dollhouse');
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [polaroidImage, setPolaroidImage] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(soundEngine.isMuted);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [teddyState, setTeddyState] = useState<'idle' | 'walking' | 'embracing'>('idle');

  const feedbackTimerRef = useRef<number | null>(null);

  const showFeedback = useCallback((msg: string) => {
    setFeedback(msg);
    if (feedbackTimerRef.current) {
      window.clearTimeout(feedbackTimerRef.current);
    }
    feedbackTimerRef.current = window.setTimeout(() => {
      setFeedback(null);
    }, 2800);
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    // Check WebGL support
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    try {
      const sm = new SceneManager(containerRef.current);
      sceneManagerRef.current = sm;

      sm.onWorldInteract = (actionText) => {
        showFeedback(actionText);
      };

      sm.onLetterOpen = () => {
        setIsLetterOpen(true);
      };

      sm.teddyWorld.onHugStart = () => {
        setTeddyState('walking');
        showFeedback('Ayaan & Pinkii walking toward each other...');
        setTimeout(() => {
          setTeddyState('embracing');
          showFeedback('Warm hug for my Pinkii!');
        }, 1300);
      };

      return () => {
        sm.dispose();
      };
    } catch (err) {
      console.error('Failed to initialize 3D scene:', err);
      setHasWebGL(false);
    }
  }, [showFeedback]);

  const handleSelectWorld = (worldId: WorldId) => {
    setCurrentWorld(worldId);
    if (sceneManagerRef.current) {
      sceneManagerRef.current.setWorld(worldId);
      if (worldId === 'teddy') {
        setTeddyState(sceneManagerRef.current.teddyWorld.state);
      }
    }
  };

  const handleResetCamera = () => {
    soundEngine.playSparkle();
    sceneManagerRef.current?.resetCamera();
    showFeedback('Reset 3D camera angle');
  };

  const handleTakeSnapshot = () => {
    soundEngine.playSparkle();
    const dataUrl = sceneManagerRef.current?.captureSnapshot();
    if (dataUrl) {
      setPolaroidImage(dataUrl);
    }
  };

  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
    showFeedback(muted ? 'Sound Muted' : 'Sound Enabled');
  };

  const handleActionClick = () => {
    if (!sceneManagerRef.current) return;

    if (currentWorld === 'dollhouse') {
      sceneManagerRef.current.dollhouseWorld.toggleGift();
      showFeedback(
        sceneManagerRef.current.dollhouseWorld.isGiftOpen
          ? 'Surprise gift opened! ✨'
          : 'Gift closed'
      );
    } else if (currentWorld === 'garden') {
      sceneManagerRef.current.gardenWorld.toggleRose();
      showFeedback('Roses blooming under moonlight! 🌹✨');
    } else if (currentWorld === 'teddy') {
      sceneManagerRef.current.teddyWorld.triggerHug();
      showFeedback('Holding you tight, jana!');
    } else if (currentWorld === 'cafe') {
      sceneManagerRef.current.cafeWorld.triggerClink();
      showFeedback('Cheers, jana! Warm coffee date ☕');
    }
  };

  const handleToyClick = (toyId: string) => {
    if (!sceneManagerRef.current) return;
    const dh = sceneManagerRef.current.dollhouseWorld;

    if (toyId === 'dolls') {
      dh.waveDolls();
      showFeedback('Your tiny Ayaan & Pinkii dolls are waving!');
    } else if (toyId === 'gift') {
      dh.toggleGift();
      showFeedback(dh.isGiftOpen ? 'Opened the surprise gift! ✨' : 'Closed gift box');
    } else if (toyId === 'letter') {
      setIsLetterOpen(true);
    } else if (toyId === 'lamp') {
      dh.toggleLamp();
      showFeedback(dh.isLampOn ? 'Warm bedside lamp turned on 💡' : 'Bedside lamp turned off');
    } else if (toyId === 'window') {
      dh.toggleWindow();
      showFeedback(dh.isWindowOpen ? 'Window opened to the starry moon 🌙✨' : 'Curtains closed cozy');
    } else if (toyId === 'drawer') {
      dh.toggleDrawer();
      showFeedback(dh.isDrawerOpen ? 'Secret drawer opened! Found a glowing star 🌟' : 'Drawer closed');
    } else if (toyId === 'wardrobe') {
      dh.toggleWardrobe();
      showFeedback(dh.isWardrobeOpen ? 'Wardrobe opened! Cute pink outfits inside 👗' : 'Wardrobe closed');
    } else if (toyId === 'mirror') {
      dh.triggerMirror();
      showFeedback('Mirror glow: "Ayra, the prettiest girl in the universe ✨"');
    } else if (toyId === 'music_box') {
      dh.toggleMusicBox();
      showFeedback(dh.isMusicBoxPlaying ? 'Music box playing sweet melody for Ayra 🎶' : 'Music box paused');
    } else if (toyId === 'vase') {
      dh.triggerVase();
      showFeedback('Blossoms sent floating hearts to Ayra! 🌸💖');
    } else if (toyId === 'photo') {
      dh.togglePhotoFrame();
      showFeedback(dh.isPhotoFlipped ? 'Keepsake revealed: "Ayaan & Ayra Forever" 📸' : 'Portrait frame flipped');
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0d0f18] select-none">
      {/* 3D Canvas Viewport */}
      {hasWebGL ? (
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      ) : (
        <FallbackView currentWorld={currentWorld} onOpenLetter={() => setIsLetterOpen(true)} />
      )}

      {/* Floating HUD Layer */}
      <HUDOverlay
        currentWorld={currentWorld}
        onSelectWorld={handleSelectWorld}
        onResetCamera={handleResetCamera}
        onTakeSnapshot={handleTakeSnapshot}
        onOpenLetter={() => setIsLetterOpen(true)}
        onActionClick={handleActionClick}
        onToyClick={handleToyClick}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        interactionFeedback={feedback}
        teddyState={teddyState}
      />

      {/* Unfolded Handwritten Letter Modal */}
      <LetterModal isOpen={isLetterOpen} onClose={() => setIsLetterOpen(false)} />

      {/* Polaroid Snapshot Modal */}
      <PolaroidModal imageSrc={polaroidImage} onClose={() => setPolaroidImage(null)} />
    </div>
  );
}
