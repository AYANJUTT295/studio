/**
 * Web Audio API synthesizer for romantic ambient soundscapes and interaction effects.
 * 100% self-contained, no external MP3 dependencies, instant playback on user interaction.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  private musicInterval: number | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Soft sparkle / magical chime (e.g. for blooming roses or opened gift)
  playSparkle() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.65);
    });
  }

  // Gentle romantic music-box hug melody
  playHugMelody() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const chords = [
      { notes: [392.0, 493.88, 587.33, 783.99], time: 0 },       // G maj
      { notes: [440.0, 523.25, 659.25, 880.0], time: 0.35 },     // A min
      { notes: [493.88, 587.33, 739.99, 987.77], time: 0.7 },    // B min
      { notes: [523.25, 659.25, 783.99, 1046.5, 1318.5], time: 1.1 }, // C maj arpeggio
    ];

    const now = this.ctx.currentTime;
    chords.forEach(group => {
      group.notes.forEach((freq, nIdx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + group.time + nIdx * 0.05);

        gain.gain.setValueAtTime(0, now + group.time + nIdx * 0.05);
        gain.gain.linearRampToValueAtTime(0.1, now + group.time + nIdx * 0.05 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + group.time + nIdx * 0.05 + 0.9);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + group.time + nIdx * 0.05);
        osc.stop(now + group.time + nIdx * 0.05 + 1.0);
      });
    });
  }

  // Gift box pop / gentle spring lid sound
  playPop() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  // Coffee cup clink sound
  playCoffeeClink() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1760, now); // A6
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(2637, now); // E7

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.82);
    osc2.stop(now + 0.82);
  }

  // Paper letter unfolding rustle / delicate chime
  playLetterSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [659.25, 783.99, 987.77, 1174.66]; // E5, G5, B5, D6
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);

      gain.gain.setValueAtTime(0, now + idx * 0.09);
      gain.gain.linearRampToValueAtTime(0.1, now + idx * 0.09 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.55);
    });
  }

  // Soft ambient music box lullaby toggle
  toggleLullaby(enable: boolean) {
    if (!enable) {
      if (this.musicInterval) {
        clearInterval(this.musicInterval);
        this.musicInterval = null;
      }
      return;
    }

    if (this.musicInterval) return;
    this.initCtx();

    const lullabyScale = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
    let step = 0;

    const playNote = () => {
      if (this.isMuted || !this.ctx) return;
      const now = this.ctx.currentTime;
      const freq = lullabyScale[step % lullabyScale.length];
      step = (step + (Math.random() > 0.4 ? 1 : 2)) % lullabyScale.length;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.85);
    };

    this.musicInterval = window.setInterval(playNote, 1600);
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    return this.isMuted;
  }
}

export const soundEngine = new SoundEngine();
