// Web Audio API Sound Synthesizer (No external asset files needed!)
class SoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setEnabled(val) {
    this.enabled = val;
  }

  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.15, pitchBend = 0) {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const now = this.ctx.currentTime;
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      if (pitchBend !== 0) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, freq + pitchBend), now + duration);
      }

      gain.gain.setValueAtTime(gainVal, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  playClick() {
    this.playTone(600, 'triangle', 0.05, 0.08, -200);
  }

  playGuessLow() {
    // Ascending note indicating need to go higher
    this.playTone(320, 'sine', 0.18, 0.14, 120);
  }

  playGuessHigh() {
    // Descending note indicating need to go lower
    this.playTone(480, 'sine', 0.18, 0.14, -120);
  }

  playHot() {
    this.playTone(750, 'sawtooth', 0.12, 0.08, 150);
  }

  playCold() {
    this.playTone(220, 'sine', 0.2, 0.12, -40);
  }

  playHint() {
    if (!this.enabled) return;
    this.playTone(523.25, 'sine', 0.1, 0.1); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.12, 0.1), 80); // E5
    setTimeout(() => this.playTone(783.99, 'sine', 0.2, 0.12), 160); // G5
  }

  playWin() {
    if (!this.enabled) return;
    const notes = [440, 554.37, 659.25, 880]; // A major arpeggio
    notes.forEach((note, idx) => {
      setTimeout(() => {
        this.playTone(note, 'triangle', 0.35, 0.18, 50);
      }, idx * 120);
    });
  }

  playGameOver() {
    if (!this.enabled) return;
    const notes = [350, 300, 240, 180];
    notes.forEach((note, idx) => {
      setTimeout(() => {
        this.playTone(note, 'sawtooth', 0.25, 0.15, -30);
      }, idx * 140);
    });
  }

  playTick() {
    this.playTone(800, 'sine', 0.04, 0.06);
  }
}

export const sound = new SoundSynthesizer();
