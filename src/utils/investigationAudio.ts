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
    this.setupMobileTouchUnlock();
  }

  private setupMobileTouchUnlock() {
    if (typeof window === 'undefined') return;
    const unlock = () => {
      try {
        if (!this.settings.mutedAll) {
          const ctx = this.ensureContext();
          if (ctx && ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
          }
        }
      } catch {
        // Ignora bloqueio antes de gesto válido
      }
    };
    window.addEventListener('touchstart', unlock, { passive: true, once: true });
    window.addEventListener('pointerdown', unlock, { passive: true, once: true });
    window.addEventListener('click', unlock, { passive: true, once: true });
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

  // 7. Clique mecânico curto para cápsulas secundárias, abas e seletores (35ms)
  public playMechanicalClick() {
    if (!this.canPlaySfx()) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(920, now);
    osc.frequency.exponentialRampToValueAtTime(340, now + 0.032);

    gain.gain.setValueAtTime(this.settings.sfxVolume * 0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.036);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  // 8. Pressão física em botão metálico principal (130ms: impacto + brilho harmônico)
  public playBrassPress() {
    if (!this.canPlaySfx()) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const lowOsc = ctx.createOscillator();
    const lowGain = ctx.createGain();
    lowOsc.type = 'sine';
    lowOsc.frequency.setValueAtTime(165, now);
    lowOsc.frequency.exponentialRampToValueAtTime(92, now + 0.08);
    lowGain.gain.setValueAtTime(this.settings.sfxVolume * 0.14, now);
    lowGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    lowOsc.connect(lowGain);
    lowGain.connect(ctx.destination);
    lowOsc.start(now);
    lowOsc.stop(now + 0.095);

    const highOsc = ctx.createOscillator();
    const highGain = ctx.createGain();
    highOsc.type = 'triangle';
    highOsc.frequency.setValueAtTime(587.33, now + 0.02); // D5
    highOsc.frequency.exponentialRampToValueAtTime(880, now + 0.13); // A5
    highGain.gain.setValueAtTime(this.settings.sfxVolume * 0.09, now + 0.02);
    highGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    highOsc.connect(highGain);
    highGain.connect(ctx.destination);
    highOsc.start(now + 0.02);
    highOsc.stop(now + 0.16);
  }

  // 9. Manuseio de papel / pergaminho / pasta pericial (110ms ruído filtrado)
  public playPaperRustle() {
    if (!this.canPlaySfx()) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const duration = 0.11;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(1450, ctx.currentTime);
    bandpass.Q.setValueAtTime(1.4, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(this.settings.sfxVolume * 0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    noise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  }

  // 10. Carimbo / Selo de Chancelaria / Assinatura de Ordem (165ms)
  public playWaxStamp() {
    if (!this.canPlaySfx()) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Impacto grave na madeira da mesa
    const thud = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thud.type = 'sine';
    thud.frequency.setValueAtTime(118, now);
    thud.frequency.exponentialRampToValueAtTime(42, now + 0.14);
    thudGain.gain.setValueAtTime(this.settings.sfxVolume * 0.22, now);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    thud.connect(thudGain);
    thudGain.connect(ctx.destination);
    thud.start(now);
    thud.stop(now + 0.17);

    // Ressonância metálica de autenticação
    const chime = ctx.createOscillator();
    const chimeGain = ctx.createGain();
    chime.type = 'triangle';
    chime.frequency.setValueAtTime(440, now + 0.03);
    chime.frequency.setValueAtTime(659.25, now + 0.08);
    chimeGain.gain.setValueAtTime(this.settings.sfxVolume * 0.11, now + 0.03);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    chime.connect(chimeGain);
    chimeGain.connect(ctx.destination);
    chime.start(now + 0.03);
    chime.stop(now + 0.3);
  }

  // 11. Transição cinematográfica entre etapas da investigação
  public playStageTransition() {
    if (!this.canPlaySfx()) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(130.81, now); // C3
    osc.frequency.exponentialRampToValueAtTime(196.0, now + 0.34); // G3
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(this.settings.sfxVolume * 0.11, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
    this.playPaperRustle();
  }

  // 12. Som de pena/caneta assinando ordem no papel antes do carimbo (170ms)
  public playPenScratch() {
    if (!this.canPlaySfx()) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const duration = 0.17;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const t = i / bufferSize;
      // Dois traços rápidos de escrita a tinta
      const strokeEnv = Math.abs(Math.sin(t * Math.PI * 3.2));
      data[i] = (Math.random() * 2 - 1) * strokeEnv;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2600, ctx.currentTime);
    filter.Q.setValueAtTime(2.2, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(this.settings.sfxVolume * 0.11, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  }

  // 13. Toque físico de madeira e papel ao posicionar ficha/pino sobre a mesa (95ms)
  public playWoodDeskTap() {
    if (!this.canPlaySfx()) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const wood = ctx.createOscillator();
    const woodGain = ctx.createGain();
    wood.type = 'sine';
    wood.frequency.setValueAtTime(148, now);
    wood.frequency.exponentialRampToValueAtTime(58, now + 0.075);

    woodGain.gain.setValueAtTime(this.settings.sfxVolume * 0.16, now);
    woodGain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);

    wood.connect(woodGain);
    woodGain.connect(ctx.destination);
    wood.start(now);
    wood.stop(now + 0.09);

    this.playPaperRustle();
  }

  // 14. Atmosfera Sonora Específica por Cenário/Época + Silêncio Intencional na Etapa 4 (Decisão)
  public setCaseAtmosphere(caseId: string, activeStep: number) {
    if (!this.isAmbientPlaying || !this.ctx || !this.ambientOsc1 || !this.ambientOsc2 || !this.ambientGain) {
      return;
    }

    const now = this.ctx.currentTime;
    let f1 = 65.41; // Padrão C2
    let f2 = 98.0;  // Padrão G2

    if (caseId === 'julio_cesar' || caseId === 'cleopatra') {
      // Antiguidade Clássica: ressonância grave de pedra e biblioteca histórica (D2 + A2)
      f1 = 73.42;
      f2 = 110.0;
    } else if (caseId === 'napoleao') {
      // Waterloo 1815: tensão fria e sombria de tenda de campanha chuvosa (C2 + G2 menor)
      f1 = 65.41;
      f2 = 97.99;
    } else if (caseId === 'turing') {
      // Bletchley Park 1941: harmônico eletromecânico sutil de válvulas / Bombe (60Hz + 120Hz)
      f1 = 60.0;
      f2 = 120.0;
    } else if (caseId === 'jobs') {
      // São Francisco 2007: sala contemporânea noturna limpa (E2 + B2)
      f1 = 82.41;
      f2 = 123.47;
    }

    this.ambientOsc1.frequency.setTargetAtTime(f1, now, 0.9);
    this.ambientOsc2.frequency.setTargetAtTime(f2, now, 0.9);

    // Silêncio Narrativo Intencional na Etapa 4 (Ponto Crítico de Decisão):
    // Reduz a trilha em 82% para criar gravidade antes da assinatura da ordem.
    const baseGain = Math.max(0.005, this.settings.ambientVolume * 0.08);
    const targetGain = activeStep === 4 ? Math.max(0.0015, baseGain * 0.18) : baseGain;
    this.ambientGain.gain.setTargetAtTime(targetGain, now, 1.1);
  }

  // 15. Virada tátil de carta/ficha em 3D (frente e verso)
  public playCardFlip() {
    if (!this.canPlaySfx()) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.12);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(450, now + 0.12);

    gain.gain.setValueAtTime(this.settings.sfxVolume * 0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.13);
    this.playPaperRustle();
  }

  // 16. Tecla mecânica suave de telex/terminal para animação de digitação
  public playTypewriterClick() {
    if (!this.canPlaySfx()) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const baseFreq = 700 + Math.random() * 200;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.025);

    gain.gain.setValueAtTime(this.settings.sfxVolume * 0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.035);
  }

  // 17. Clique suave e harmônico para contadores progressivos (XP e porcentagens)
  public playCounterTick() {
    if (!this.canPlaySfx()) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.035);

    gain.gain.setValueAtTime(this.settings.sfxVolume * 0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.045);
  }

  // 18. Micro-motivo musical de transição cinematográfica por etapa (Assinatura Sonora)
  public playStageIntroMotif(step: 1 | 2 | 3 | 4 | 5) {
    if (!this.canPlaySfx()) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const notesByStep: Record<number, number[]> = {
      1: [130.81, 196.0, 293.66],          // C3 -> G3 -> D4 (Mistério e Arquivo)
      2: [146.83, 174.61, 220.0],          // D3 -> F3 -> A3 (Conexão e Tensão Menor)
      3: [98.0, 130.81, 155.56],           // G2 -> C3 -> Eb3 (Incerteza e Hipótese)
      4: [164.81, 246.94, 329.63],         // E3 -> B3 -> E4 (Urgência e Decisão)
      5: [130.81, 164.81, 196.0, 261.63],  // C3 -> E3 -> G3 -> C4 (Chancela e Revelação)
    };

    const notes = notesByStep[step] || notesByStep[1];
    const now = ctx.currentTime;
    const noteDuration = 0.22;

    notes.forEach((freq, idx) => {
      const start = now + idx * 0.16;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.exponentialRampToValueAtTime(this.settings.sfxVolume * 0.12, start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, start + noteDuration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + noteDuration + 0.05);
    });
  }
}

export const soundEngine = new InvestigationSoundEngine();
