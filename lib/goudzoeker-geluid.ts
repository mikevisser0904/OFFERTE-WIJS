/** Zet op true om mompel- en bingo-geluid weer aan te zetten */
export const GOUDZOEKER_GELUID_AAN = false;

let audioCtx: AudioContext | null = null;
let audioKlaar = false;
let reducedMotion = false;
let laatsteMompel = 0;

const MOMPEL_COOLDOWN_MS = 1200;

function magGeluid(): boolean {
  if (typeof window === "undefined") return false;
  if (reducedMotion) return false;
  return audioKlaar && audioCtx !== null;
}

function envelope(g: GainNode, peak: number, attack: number, release: number, when: number, dur: number) {
  const ctx = audioCtx!;
  g.gain.setValueAtTime(0.0001, when);
  g.gain.exponentialRampToValueAtTime(peak, when + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, when + dur + release);
}

function speelToon(
  freq: number,
  when: number,
  dur: number,
  type: OscillatorType,
  peak: number,
  detune = 0
) {
  const ctx = audioCtx!;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, when);
  if (detune) osc.detune.setValueAtTime(detune, when);
  envelope(gain, peak, 0.02, 0.08, when, dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(when);
  osc.stop(when + dur + 0.12);
}

function speelRuis(when: number, dur: number, peak: number, freq: number) {
  const ctx = audioCtx!;
  const bufferSize = Math.floor(ctx.sampleRate * dur);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = freq;
  filter.Q.value = 2;
  const gain = ctx.createGain();
  envelope(gain, peak, 0.01, 0.06, when, dur);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  src.start(when);
  src.stop(when + dur + 0.1);
}

export async function initGoudzoekerGeluid(): Promise<boolean> {
  if (!GOUDZOEKER_GELUID_AAN) return false;
  if (typeof window === "undefined") return false;
  reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return false;
  if (!audioCtx) {
    try {
      audioCtx = new AudioContext();
    } catch {
      return false;
    }
  }
  if (audioCtx.state === "suspended") {
    try {
      await audioCtx.resume();
    } catch {
      return false;
    }
  }
  audioKlaar = audioCtx.state === "running";
  return audioKlaar;
}

async function zorgAudio(): Promise<boolean> {
  if (audioKlaar && audioCtx?.state === "running") return true;
  return initGoudzoekerGeluid();
}

export function koppelGoudzoekerGeluid() {
  if (!GOUDZOEKER_GELUID_AAN || typeof window === "undefined") return;
  const ontgrendel = () => {
    void initGoudzoekerGeluid();
  };
  window.addEventListener("pointerdown", ontgrendel, { once: true });
  window.addEventListener("keydown", ontgrendel, { once: true });
}

export function speelMompelGeluid(schreeuw = false) {
  if (!GOUDZOEKER_GELUID_AAN) return;
  void zorgAudio().then((ok) => {
    if (!ok) return;
    speelMompelGeluidNu(schreeuw);
  });
}

function speelMompelGeluidNu(schreeuw = false) {
  if (!magGeluid()) return;
  const nu = performance.now();
  if (nu - laatsteMompel < MOMPEL_COOLDOWN_MS) return;
  laatsteMompel = nu;

  const ctx = audioCtx!;
  const t0 = ctx.currentTime;
  const stappen = schreeuw ? 3 : 2 + Math.floor(Math.random() * 2);

  for (let i = 0; i < stappen; i++) {
    const offset = i * (schreeuw ? 0.07 : 0.11);
    const base = schreeuw ? 280 + Math.random() * 120 : 180 + Math.random() * 90;
    speelToon(base, t0 + offset, schreeuw ? 0.06 : 0.09, "triangle", schreeuw ? 0.09 : 0.05, (Math.random() - 0.5) * 40);
    if (Math.random() < 0.55) {
      speelRuis(t0 + offset + 0.02, schreeuw ? 0.05 : 0.07, schreeuw ? 0.04 : 0.025, 600 + Math.random() * 400);
    }
  }
}

export function speelBingoGeluid() {
  if (!GOUDZOEKER_GELUID_AAN) return;
  void zorgAudio().then((ok) => {
    if (!ok) return;
    speelBingoGeluidNu();
  });
}

function speelBingoGeluidNu() {
  if (!magGeluid()) return;
  const ctx = audioCtx!;
  const t0 = ctx.currentTime;

  const noten = [523.25, 659.25, 783.99, 1046.5, 1318.5];
  noten.forEach((freq, i) => {
    speelToon(freq, t0 + i * 0.09, 0.14, "sine", 0.11);
    speelToon(freq * 2, t0 + i * 0.09 + 0.02, 0.08, "triangle", 0.035);
  });

  speelRuis(t0 + 0.35, 0.25, 0.06, 2400);
  speelRuis(t0 + 0.45, 0.18, 0.05, 3200);

  speelToon(1567.98, t0 + 0.55, 0.35, "sine", 0.08);
}