// Motor de Áudio Procedural (Web Audio API) — Zero dependências externas
// Respeita autoplay dos navegadores e preferências de acessibilidade

export interface AudioAndMotionSettings {
  mutedAll: boolean;
  sfxEnabled: boolean;
  sfxVolume: number; // 0 to 1
  ambientEnabled: boolean;
  ambientVolume: number; // 0 to 1
  reduceMotion: boolean;
}

const SETTINGS_KEY = 'ush_audio_motion_settings_v1';

const DEFAULT_SETTINGS: AudioAndMotionSettings = {
  mutedAll: false,
  sfxEnabled: true,
  sfxVolume: 0.45,
  ambientEnabled: false,
  ambientVolume: 0.25,
  reduceMotion: false,
};

class InvestigationSoundEngine {
  private ctx: AudioContext | null = null;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private settings: AudioAndMotionSettings = { ...DEFAULT_SETTINGS };

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(SETTINGS_KEY);
        if (saved) {
          this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
        } else if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
          this.settings.reduceMotion = true;
        }
      } catch {
        // Ignore storage errors
      }
    }
  }

  public getSettings(): AudioAndMotionSettings {
    return { ...this.settings };
  }

  public updateSettings(partial: Partial<AudioAndMotionSettings>): AudioAndMotionSettings {
    this.settings = { ...this.settings, ...partial };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
      } catch {
        // Ignore
      }
    }
    this.syncAmbientState();
    return { ...this.settings };
  }

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public syncAmbientState() {
    const shouldPlay = !this.settings.mutedAll && this.settings.ambientEnabled;
    if (!shouldPlay) {
      this.stopAmbient();
      return;
    }

    const ctx = this.ensureContext();
    if (!ctx) return;

    if (!this.ambientGain) {
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 180;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.value = 65.41; // C2 drone
      osc2.frequency.value = 98.0;  // G2 fifth

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        Math.max(0.01, this.settings.ambientVolume * 0.12),
        ctx.currentTime + 1.5
      );

      osc1.start();
      osc2.start();

      this.ambientOsc1 = osc1;
      this.ambientOsc2 = osc2;
      this.ambientGain = gain;
    } else {
      this.ambientGain.gain.setTargetAtTime(
        Math.max(0.005, this.settings.ambientVolume * 0.12),
        ctx.currentTime,
        0.3
      );
    }
  }

  private stopAmbient() {
    if (this.ambientGain && this.ctx) {
      try {
        this.ambientOsc1?.stop();
        this.ambientOsc2?.stop();
        this.ambientGain.disconnect();
      } catch {
        // Ignore
      }
    }
    this.ambientOsc1 = null;
    this.ambientOsc2 = null;
    this.ambientGain = null;
  }

  private canPlaySfx(): boolean {
    return !this.settings.mutedAll && this.settings.sfxEnabled && this.settings.sfxVolume > 0.01;
  }

  // Som sutil de abrir documento ou selecionar item
  public playDocumentOpen() {
    if (!this.canPlaySfx()) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(480, now + 0.07);

    gain.gain.setValueAtTime(this.settings.sfxVolume * 0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Assinatura sonora ao guardar pista no Arquivo Pessoal
  public playClueSaved(isContradiction = false) {
    if (!this.canPlaySfx()) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = isContradiction ? [440, 554.37, 659.25] : [523.25, 659.25];
    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + idx * 0.07);

      gain.gain.setValueAtTime(this.settings.sfxVolume * 0.12, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.23);
    });
  }

  // Som de validação de conexão / revelação de descoberta
  public playDiscoveryReveal() {
    if (!this.canPlaySfx()) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const chord = [392.0, 493.88, 587.33, 783.99]; // G major7
    chord.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + idx * 0.06);

      gain.gain.setValueAtTime(this.settings.sfxVolume * 0.11, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.46);
    });
  }

  // Pulso grave discreto quando uma conexão não se sustenta
  public playErrorPulse() {
    if (!this.canPlaySfx()) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(155, now);
    osc.frequency.linearRampToValueAtTime(115, now + 0.16);

    gain.gain.setValueAtTime(this.settings.sfxVolume * 0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  }
}

export const soundEngine = new InvestigationSoundEngine();
