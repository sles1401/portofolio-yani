/**
 * QA Seeker Master Blueprint: Suryani Lestari Edition (v5.2 FINAL)
 * Prompt Halaman 8: Synthesized Modern Sound Engine (Web Audio API 2.0)
 * Modern Crystalline Sound FX Engine (Zero File MP3/WAV Eksternal)
 * Principles: Calm Technology, delicate sine/triangle micro-interactions, sl_mute storage.
 */

class ModernSeekerAudio {
  constructor() {
    this.ctx = null;
    this.muted = typeof window !== 'undefined' && localStorage.getItem("sl_mute") === "true";
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem("sl_mute", this.muted ? "true" : "false");
    }
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  // (1) playNavTick(): klik kristalin lembut 40ms (gelombang sinus 800Hz meluruh cepat) saat ganti tab / klik tombol
  playNavTick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // guard
    }
  }

  // (2) playTerminalSuccess(): akor harmonik naik (523.25Hz -> 659.25Hz) saat tes Playwright lolos / aksi sukses
  playTerminalSuccess() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      // Note 1: C5 (523.25 Hz)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(523.25, t);
      gain1.gain.setValueAtTime(0.05, t);
      gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(t);
      osc1.stop(t + 0.18);

      // Note 2: E5 (659.25 Hz)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(659.25, t + 0.08);
      gain2.gain.setValueAtTime(0.06, t + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(t + 0.08);
      osc2.stop(t + 0.28);
    } catch {
      // guard
    }
  }

  // (3) playAnomalyPing(): nada peringatan 120ms lembut untuk deteksi bug
  playAnomalyPing() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.12);

      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.12);
    } catch {
      // guard
    }
  }

  // (4) playModalSwoop(): sapuan desah lembut berfilter saat modal dialog muncul
  playModalSwoop() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(260, t);
      osc.frequency.exponentialRampToValueAtTime(440, t + 0.09);

      gain.gain.setValueAtTime(0.03, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.1);
    } catch {
      // guard
    }
  }

  // Prompt Halaman 3: Distorsi statis Web Audio API untuk efek penembusan dinding / secret chamber
  playSynthesizedGlitchTone() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      // Multi-frequency static pulse
      [140, 95, 220].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, t + idx * 0.04);
        gain.gain.setValueAtTime(0.08, t + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.04 + 0.14);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + idx * 0.04);
        osc.stop(t + idx * 0.04 + 0.14);
      });
    } catch {
      // guard
    }
  }

  // Soft Footstep
  playFootstep() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(160, t);
      gain.gain.setValueAtTime(0.02, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.03);
    } catch {
      // guard
    }
  }

  // Backward-compatible aliases
  playSelect() {
    this.playNavTick();
  }

  playGlitch() {
    this.playAnomalyPing();
  }

  playFanfare() {
    this.playTerminalSuccess();
  }

  playScan() {
    this.playModalSwoop();
  }

  playClose() {
    this.playNavTick();
  }

  playCopyChirp() {
    this.playTerminalSuccess();
  }

  playChiptune(freq = 440, type = "triangle", duration = 0.05, vol = 0.05) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + duration);
    } catch {
      // guard
    }
  }
}

export const sound = new ModernSeekerAudio();
export const playNavTick = () => sound.playNavTick();
export const playTerminalSuccess = () => sound.playTerminalSuccess();
export const playAnomalyPing = () => sound.playAnomalyPing();
export const playModalSwoop = () => sound.playModalSwoop();
export const playSynthesizedGlitchTone = () => sound.playSynthesizedGlitchTone();
export const playFanfare = () => sound.playTerminalSuccess();
export const playSelect = () => sound.playNavTick();
export const playGlitch = () => sound.playAnomalyPing();
export const playScan = () => sound.playModalSwoop();
export const playClose = () => sound.playNavTick();
export const playCopyChirp = () => sound.playTerminalSuccess();
export const playFootstep = () => sound.playFootstep();
export const playChiptune = (freq, type, dur, vol) => sound.playChiptune(freq, type, dur, vol);

