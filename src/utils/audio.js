/**
 * QA Seeker Master Blueprint: Suryani Lestari Edition
 * Web Audio API Synthesizer Mandiri untuk Efek Retro Seeker (Bab 8)
 * Zero external audio assets (.mp3/.wav), < 2 KB, 0ms network latency.
 */

class SoundSystem {
  constructor() {
    this.audioCtx = null;
    this.isMuted = typeof window !== 'undefined' && localStorage.getItem("seeker_muted") === "true";
  }

  initAudioContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem("seeker_muted", this.isMuted ? "true" : "false");
    }
    return this.isMuted;
  }

  playSynthesizedTone(freq, type = "square", duration = 0.1, gainVal = 0.08) {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch {
      // AudioContext fallback guard
    }
  }

  // (1) playFootstep(): modulasi noise pendek saat Seeker melangkah
  playFootstep() {
    this.playSynthesizedTone(220, "square", 0.04, 0.035);
  }

  // (2) playSelect(): nada tinggi square wave ganda 440Hz -> 880Hz
  playSelect() {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    try {
      const t = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.setValueAtTime(880, t + 0.06);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(t);
      osc.stop(t + 0.16);
    } catch {
      // guard
    }
  }

  // (3) playGlitch(): osilator sawtooth 160Hz -> 90Hz saat mendeteksi anomali
  playGlitch() {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    try {
      const t = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.exponentialRampToValueAtTime(90, t + 0.22);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(t);
      osc.stop(t + 0.25);
    } catch {
      // guard
    }
  }

  // (4) playFanfare(): 4-tone victory arpeggio saat quest dibuka / diselesaikan
  playFanfare() {
    if (this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playSynthesizedTone(freq, "triangle", 0.18, 0.1);
      }, idx * 110);
    });
  }

  // Scan frequency pulse for Debug Vision 2.0
  playScan() {
    if (this.isMuted) return;
    this.playSynthesizedTone(920, "sawtooth", 0.12, 0.07);
    setTimeout(() => this.playSynthesizedTone(1380, "square", 0.15, 0.06), 70);
  }

  // Close modal chirp
  playClose() {
    if (this.isMuted) return;
    this.playSynthesizedTone(520, "sine", 0.08, 0.06);
  }

  // Copy email chirp
  playCopyChirp() {
    this.playSynthesizedTone(659.25, "triangle", 0.14, 0.1);
  }
}

export const sound = new SoundSystem();
export const playFootstep = () => sound.playFootstep();
export const playSelect = () => sound.playSelect();
export const playGlitch = () => sound.playGlitch();
export const playFanfare = () => sound.playFanfare();
