/**
 * QA Seeker Portfolio — Haga Edition
 * Web Audio API 8-Bit Chiptune Synthesizer (Zero External Audio File Dependency)
 * Reference: Blueprint Spesifikasi Bab 7 (Implementasi Inti Sintesis Frekuensi)
 */

class SoundSystem {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = true;
  }

  init() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleMute() {
    this.soundEnabled = !this.soundEnabled;
    return !this.soundEnabled; // returns isMuted
  }

  isMuted() {
    return !this.soundEnabled;
  }

  setMuted(muted) {
    this.soundEnabled = !muted;
  }

  // Section 7.1: Implementasi Inti Sintesis Frekuensi
  playChiptune(freq, waveType = 'square', duration = 0.1, volume = 0.08) {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = waveType; // 'square', 'sawtooth', 'triangle', 'sine'
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch {
      // AudioContext state error guard
    }
  }

  // Preset 1: Footstep — Nada pendek gelombang square pitch rendah (220 Hz, durasi 0.04 detik)
  playFootstep() {
    this.playChiptune(220, 'square', 0.04, 0.035);
  }

  // Preset 2: Menu Select — Nada harmonic ganda (440 Hz menuju 880 Hz)
  playMenuSelect() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const t = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.setValueAtTime(880, t + 0.06);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(t);
      osc.stop(t + 0.16);
    } catch {
      // safe fallback
    }
  }

  // Alias for compatibility
  playSelect() {
    this.playMenuSelect();
  }

  // Preset 3: Anomaly Glitch — Modulasi gelombang sawtooth dengan pitch turun cepat (150 Hz ke 95 Hz)
  playAnomalyGlitch() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const t = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.exponentialRampToValueAtTime(95, t + 0.22);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(t);
      osc.stop(t + 0.25);
    } catch {
      // safe fallback
    }
  }

  // Alias for compatibility
  playGlitch() {
    this.playAnomalyGlitch();
  }

  // Preset 4: Quest Clear / Fanfare — Arpeggio 4 nada segitiga berirama kemenangan (C5, E5, G5, C6)
  playFanfare() {
    if (!this.soundEnabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playChiptune(freq, 'triangle', 0.18, 0.1);
      }, idx * 110);
    });
  }

  // Section 9.1: Copy contact chirp (659.25 Hz triangle)
  playCopyChirp() {
    this.playChiptune(659.25, 'triangle', 0.15, 0.1);
  }

  // Window Close & Dialogue sounds
  playClose() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const t = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, t);
      osc.frequency.exponentialRampToValueAtTime(260, t + 0.1);

      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(t);
      osc.stop(t + 0.1);
    } catch {
      // safe fallback
    }
  }

  playDebugToggle(enabled) {
    if (enabled) {
      this.playChiptune(880, 'sawtooth', 0.12, 0.08);
      setTimeout(() => this.playChiptune(1320, 'square', 0.15, 0.07), 80);
    } else {
      this.playChiptune(440, 'triangle', 0.12, 0.06);
    }
  }
}

export const sound = new SoundSystem();
export const playChiptune = (freq, waveType, duration, volume) => sound.playChiptune(freq, waveType, duration, volume);
export const playFanfare = () => sound.playFanfare();
export const playFootstep = () => sound.playFootstep();
export const playMenuSelect = () => sound.playMenuSelect();
export const playAnomalyGlitch = () => sound.playAnomalyGlitch();
