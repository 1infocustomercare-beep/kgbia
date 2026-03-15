/**
 * Splash Narration — starts the hero voice during the UnifiedIntro splash screen.
 * Uses browser TTS (speechSynthesis) since no user gesture is needed on desktop,
 * and the audio context is already available.
 *
 * On mobile/touch devices the browser blocks speechSynthesis without a user gesture,
 * so we skip splash narration and let EmpireVoiceAgent handle it after the first tap.
 */

const HERO_SCRIPT =
  "Benvenuto in Empire — il sistema operativo che trasforma qualsiasi attività in un business digitale di nuova generazione. Pronto a scoprire come?";

let splashNarrationStarted = false;
let splashNarrationCompleted = false;
let currentUtterance: SpeechSynthesisUtterance | null = null;

// Best Italian voice finder (mirrors EmpireVoiceAgent logic)
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

/** Start the hero narration during splash. Safe to call multiple times. */
export function startSplashNarration(): void {
  if (splashNarrationStarted) return;
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  // On mobile, speechSynthesis requires a user gesture — skip splash narration
  // and let the voice agent handle it after the first touch interaction.
  if (IS_TOUCH_DEVICE) {
    splashNarrationStarted = false;
    splashNarrationCompleted = false;
    return;
  }

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
  window.speechSynthesis.speak(utterance);
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
