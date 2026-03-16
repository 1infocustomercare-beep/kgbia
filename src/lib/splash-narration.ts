/**
 * Splash Narration — starts the hero voice during the UnifiedIntro splash screen.
 * Uses browser TTS (speechSynthesis).
 *
 * On mobile, speechSynthesis requires a user gesture to unlock. We expose
 * `unlockAndStartSplashNarration()` which should be called from a tap/click handler
 * during the splash screen to unlock audio and immediately start narration.
 */

const HERO_SCRIPT =
  "Benvenuto in Empire — il sistema operativo che trasforma qualsiasi attività in un business digitale di nuova generazione. Pronto a scoprire come?";

let splashNarrationStarted = false;
let splashNarrationCompleted = false;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let audioUnlocked = false;
let safetyTimer: ReturnType<typeof setTimeout> | null = null;

// Safety: force-complete after 12s max so Arianna is never permanently blocked
function armSafetyTimeout() {
  if (safetyTimer) clearTimeout(safetyTimer);
  safetyTimer = setTimeout(() => {
    if (!splashNarrationCompleted) {
      splashNarrationCompleted = true;
      currentUtterance = null;
    }
  }, 12000);
}

// Best Italian voice finder
let cachedVoice: SpeechSynthesisVoice | null = null;

function getBestItalianVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis?.getVoices() || [];
  const priorities = [
    (v: SpeechSynthesisVoice) => v.lang.startsWith("it") && /alice/i.test(v.name),
    (v: SpeechSynthesisVoice) => v.lang.startsWith("it") && /federica/i.test(v.name),
    (v: SpeechSynthesisVoice) => v.lang.startsWith("it") && /elsa/i.test(v.name),
    (v: SpeechSynthesisVoice) => v.lang.startsWith("it") && /google/i.test(v.name),
    (v: SpeechSynthesisVoice) => v.lang.startsWith("it"),
  ];
  for (const test of priorities) {
    const match = voices.find(test);
    if (match) { cachedVoice = match; return match; }
  }
  return null;
}

function doSpeak() {
  if (splashNarrationCompleted) return;
  if (!window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(HERO_SCRIPT);
  const voice = getBestItalianVoice();
  if (voice) utterance.voice = voice;
  utterance.lang = "it-IT";
  utterance.rate = 0.95;
  utterance.pitch = 1.05;
  utterance.volume = 1;

  utterance.onend = () => {
    splashNarrationCompleted = true;
    currentUtterance = null;
  };
  utterance.onerror = () => {
    currentUtterance = null;
  };

  currentUtterance = utterance;
  armSafetyTimeout();
  try {
    window.speechSynthesis.speak(utterance);
  } catch {
    currentUtterance = null;
    splashNarrationCompleted = true;
  }
}

/** Start the hero narration during splash (desktop auto-call). */
export function startSplashNarration(): void {
  if (splashNarrationStarted) return;
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  splashNarrationStarted = true;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoice = null;
      doSpeak();
    };
    setTimeout(doSpeak, 200);
  } else {
    doSpeak();
  }
}

/**
 * Called from a user gesture handler (tap on splash screen).
 * Unlocks the audio context with a silent utterance, then starts real narration.
 */
export function unlockAndStartSplashNarration(): void {
  if (audioUnlocked) return;
  audioUnlocked = true;

  if (typeof window === "undefined" || !window.speechSynthesis) return;

  // If narration is already playing (desktop), don't interrupt
  if (currentUtterance && window.speechSynthesis.speaking) return;

  // Unlock with a silent utterance inside gesture context
  try {
    const silent = new SpeechSynthesisUtterance("");
    silent.volume = 0;
    silent.lang = "it-IT";
    window.speechSynthesis.speak(silent);
  } catch {
    // noop
  }

  // Now start the real narration
  window.setTimeout(() => {
    if (splashNarrationCompleted) return;
    splashNarrationStarted = true;

    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        cachedVoice = null;
        doSpeak();
      };
      setTimeout(doSpeak, 150);
    } else {
      doSpeak();
    }
  }, 100);
}

export function isAudioUnlocked(): boolean {
  return audioUnlocked;
}

export function wasSplashNarrationStarted(): boolean {
  return splashNarrationStarted;
}

export function isSplashNarrationSpeaking(): boolean {
  return splashNarrationStarted && !splashNarrationCompleted && !!currentUtterance;
}

export function isSplashNarrationDone(): boolean {
  return splashNarrationCompleted;
}

export function stopSplashNarration(): void {
  if (safetyTimer) {
    clearTimeout(safetyTimer);
    safetyTimer = null;
  }

  if (typeof window !== "undefined" && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // noop
    }
  }

  currentUtterance = null;
  splashNarrationCompleted = true;
}
