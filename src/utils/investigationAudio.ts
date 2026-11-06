// Sintetizador de Áudio Procedural & Adaptativo (Web Audio API)
// Nenhum som é reproduzido antes de interação explícita do jogador.

export interface AudioAndMotionSettings {
  ambientEnabled: boolean;
  ambientVolume: number; // 0.0 a 1.0
  sfxEnabled: boolean;
  sfxVolume: number; // 0.0 a 1.0
  mutedAll: boolean;
  reduceMotion: boolean;
}

export type AdaptiveAudioMode = 'exploracao' | 'investigacao';

const AUDIO_SETTINGS_KEY = 'ush_investigation_audio_settings_v1';

const getInitialReduceMotion = (): boolean => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
};

export const DEFAULT_AUDIO_SETTINGS: AudioAndMotionSettings = {
  ambientEnabled: false,
  ambientVolume: 0.25,
  sfxEnabled: true,
  sfxVolume: 0.45,
  mutedAll: false,
  reduceMotion: getInitialReduceMotion(),
};

type SettingsListener = (settings: AudioAndMotionSettings) => void;

class InvestigationSoundEngine {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private isAmbientPlaying = false;
  private currentMode: AdaptiveAudioMode = 'exploracao';
  private settings: AudioAndMotionSettings = DEFAULT_AUDIO_SETTINGS;
  private listeners: Set<SettingsListener> = new Set();

  constructor() {
    this.loadSettings();
  }

  private loadSettings() {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(AUDIO_SETTINGS_KEY);
      if (raw) {
        this.settings = { ...DEFAULT_AUDIO_SETTINGS, ...JSON.parse(raw) };
      } else {
        this.settings = {
          ...DEFAULT_AUDIO_SETTINGS,
          reduceMotion: getInitialReduceMotion(),
        };
      }
    } catch {
      this.settings = DEFAULT_AUDIO_SETTINGS;
    }
  }

  public getSettings(): AudioAndMotionSettings {
    return { ...this.settings };
  }

  public subscribe(listener: SettingsListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public updateSettings(partial: Partial<AudioAndMotionSettings>): AudioAndMotionSettings {
    this.settings = { ...this.settings, ...partial };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(AUDIO_SETTINGS_KEY, JSON.stringify(this.settings));
      } catch {
        // Ignora erro de quota
      }
    }
    this.syncAmbientState();
    this.listeners.forEach(fn => fn(this.getSettings()));
    return this.getSettings();
  }

  public setAdaptiveMode(mode: AdaptiveAudioMode) {
    if (this.currentMode === mode) return;
    this.currentMode = mode;
    if (this.isAmbientPlaying && this.ctx && this.ambientOsc1 && this.ambientOsc2) {
      const now = this.ctx.currentTime;
      if (mode === 'exploracao') {
        // Exploração: frequências graves abertas e serenas
        this.ambientOsc1.frequency.setTargetAtTime(55, now, 0.8);
        this.ambientOsc2.frequency.setTargetAtTime(82.41, now, 0.8);
      } else {
        // Investigação: tensão analítica sutil (intervalo de quarta/quinta suspensa)
        this.ambientOsc1.frequency.setTargetAtTime(65.41, now, 0.8);
        this.ambientOsc2.frequency.setTargetAtTime(98.0, now, 0.8);
      }
    }
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
    const shouldPlay = this.settings.ambientEnabled && !this.settings.mutedAll && this.settings.ambientVolume > 0;
    if (!shouldPlay) {
      this.stopAmbient();
      return;
    }

    const ctx = this.ensureContext();
    if (!ctx) return;

    if (!this.isAmbientPlaying) {
      try {
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          Math.max(0.005, this.settings.ambientVolume * 0.08),
          ctx.currentTime + 1.2
        );

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'sine';
        osc2.type = 'triangle';

        if (this.currentMode === 'exploracao') {
          osc1.frequency.setValueAtTime(55, ctx.currentTime);
          osc2.frequency.setValueAtTime(82.41, ctx.currentTime);
        } else {
          osc1.frequency.setValueAtTime(65.41, ctx.currentTime);
          osc2.frequency.setValueAtTime(98.0, ctx.currentTime);
        }

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(160, ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();

        this.ambientGain = gain;
        this.ambientOsc1 = osc1;
        this.ambientOsc2 = osc2;
        this.isAmbientPlaying = true;
      } catch {
        // Ignora bloqueio de autoplay
      }
    } else if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(
        Math.max(0.005, this.settings.ambientVolume * 0.08),
        this.ctx.currentTime,
        0.3
      );
    }
  }

  public stopAmbient() {
    if (!this.isAmbientPlaying) return;
    try {
      this.ambientOsc1?.stop();
      this.ambientOsc2?.stop();
      this.ambientOsc1?.disconnect();
      this.ambientOsc2?.disconnect();
      this.ambientGain?.disconnect();
    } catch {
      // Ignora
    }
    this.ambientOsc1 = null;
    this.ambientOsc2 = null;
    this.ambientGain = null;
    this.isAmbientPlaying = false;
  }

  private canPlaySfx(): boolean {
    return !this.settings.mutedAll && this.settings.sfxEnabled && this.settings.sfxVolume > 0;
  }

  // 1. Som discreto de abrir documento / alternar visualização
  public playDocumentOpen() {
    if (!this.canPlaySfx()) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(480, now + 0.09);

    gain.gain.setValueAtTime(this.settings.sfxVolume * 0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.11);
  }

  // 2. Nível 1: Som discreto de pista comum guardada
  public playClueSaved() {
    if (!this.canPlaySfx()) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.07); // E5

    gain.gain.setValueAtTime(this.settings.sfxVolume * 0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.24);
  }

  // 3. Nível 2: Som específico de contradição documental detectada
  public playContradictionAlert() {
    if (!this.canPlaySfx()) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.setValueAtTime(233.08, now + 0.1); // Segunda menor tensa

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, now);

    gain.gain.setValueAtTime(this.settings.sfxVolume * 0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.36);
  }

  // 4. Nível 3: Assinatura musical própria para Conexão Histórica Comprovada
  public playDiscoveryReveal() {
    if (!this.canPlaySfx()) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [293.66, 440.0, 554.37, 587.33]; // D4, A4, C#5, D5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.001, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(
        this.settings.sfxVolume * 0.14,
        now + idx * 0.06 + 0.05
      );
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + 1.0);
    });
  }

  // 5. Conclusão de Caso (Encerramento sonoro do relatório final)
  public playCaseConclusion() {
    if (!this.canPlaySfx()) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [261.63, 329.63, 392.0, 523.25]; // C4, E4, G4, C5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.001, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(
        this.settings.sfxVolume * 0.13,
        now + idx * 0.08 + 0.06
      );
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + 1.15);
    });
  }

  // 6. Pulso grave sutil de vínculo não validado
  public playErrorPulse() {
    if (!this.canPlaySfx()) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(95, now + 0.18);

    gain.gain.setValueAtTime(this.settings.sfxVolume * 0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }
}

export const soundEngine = new InvestigationSoundEngine();
