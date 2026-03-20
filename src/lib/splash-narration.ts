/**
 * Splash Narration — Premium ElevenLabs voice during the UnifiedIntro splash screen.
 *
 * Primary: ElevenLabs API via empire-tts edge function (Arianna voice)
 * Fallback: Browser TTS (speechSynthesis) if API unavailable
 *
 * On mobile, audio requires a user gesture to unlock. We expose
 * `unlockAndStartSplashNarration()` which should be called from a tap/click handler.
 */

const HERO_SCRIPT =
  "Benvenuto in Empire AI Group — il sistema operativo che trasforma qualsiasi attività in un business digitale di nuova generazione.";

let splashNarrationStarted = false;
let splashNarrationCompleted = false;
let audioElement: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let audioUnlocked = false;
let safetyTimer: ReturnType<typeof setTimeout> | null = null;
let autoUnlockListenerAdded = false;
let premiumAudioCached: string | null = null;
let premiumFetchInProgress = false;
/** True while any narration source is actively producing sound */
let isCurrentlyPlaying = false;

// Safety: force-complete after 15s max
function armSafetyTimeout() {
  if (safetyTimer) clearTimeout(safetyTimer);
  safetyTimer = setTimeout(() => {
    if (!splashNarrationCompleted) {
      console.log("[SplashNarration] Safety timeout — completing");
      splashNarrationCompleted = true;
      isCurrentlyPlaying = false;
      audioElement = null;
      currentUtterance = null;
    }
  }, 15000);
}

// ─── Premium ElevenLabs TTS ───

async function fetchPremiumAudio(): Promise<string | null> {
  if (premiumAudioCached) return premiumAudioCached;
  if (premiumFetchInProgress) return null;

  premiumFetchInProgress = true;

  try {
    const supabaseUrl = (window as any).__VITE_SUPABASE_URL ||
      import.meta.env?.VITE_SUPABASE_URL ||
      document.querySelector('meta[name="supabase-url"]')?.getAttribute("content");

    const supabaseKey = (window as any).__VITE_SUPABASE_PUBLISHABLE_KEY ||
      import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY ||
      document.querySelector('meta[name="supabase-key"]')?.getAttribute("content");

    if (!supabaseUrl || !supabaseKey) {
      console.warn("[SplashNarration] Supabase config not found, falling back to browser TTS");
      return null;
    }

    console.log("[SplashNarration] Fetching premium ElevenLabs audio...");

    const resp = await fetch(`${supabaseUrl}/functions/v1/empire-tts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({ text: HERO_SCRIPT, voiceProfile: "splash" }),
    });

    if (!resp.ok) {
      console.warn("[SplashNarration] TTS API returned", resp.status);
      return null;
    }

    const data = await resp.json();

    if (data.fallback || data.error || !data.audioContent) {
      console.warn("[SplashNarration] TTS API fallback:", data.error);
      return null;
    }

    premiumAudioCached = data.audioContent;
    console.log("[SplashNarration] ✅ Premium audio cached");
    return data.audioContent;
  } catch (err) {
    console.warn("[SplashNarration] Premium fetch failed:", err);
    return null;
  } finally {
    premiumFetchInProgress = false;
  }
}

/** Stop any currently playing audio before starting a new one */
function stopAllCurrent() {
  if (audioElement) {
    try { audioElement.pause(); audioElement.currentTime = 0; } catch { /* noop */ }
    audioElement = null;
  }
  if (typeof window !== "undefined" && window.speechSynthesis) {
    try { window.speechSynthesis.cancel(); } catch { /* noop */ }
  }
  currentUtterance = null;
  isCurrentlyPlaying = false;
}

function playPremiumAudio(base64Audio: string): boolean {
  try {
    // Stop anything currently playing first
    stopAllCurrent();

    if (splashNarrationCompleted) return false;

    const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;
    const audio = new Audio(audioUrl);
    audio.volume = 1;
    audioElement = audio;
    isCurrentlyPlaying = true;

    audio.onended = () => {
      console.log("[SplashNarration] ✅ Premium speech ended");
      splashNarrationCompleted = true;
      isCurrentlyPlaying = false;
      audioElement = null;
    };

    audio.onerror = (e) => {
      console.warn("[SplashNarration] Premium playback error, falling back:", e);
      audioElement = null;
      isCurrentlyPlaying = false;
      doSpeakBrowserTTS();
    };

    audio.play().then(() => {
      console.log("[SplashNarration] ✅ Premium audio playing!");
    }).catch((playErr) => {
      console.warn("[SplashNarration] Premium play() blocked:", playErr);
      isCurrentlyPlaying = false;
      // Will retry on user gesture
    });

    return true;
  } catch (err) {
    console.warn("[SplashNarration] Premium play setup failed:", err);
    isCurrentlyPlaying = false;
    return false;
  }
}

// ─── Browser TTS Fallback ───

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

function doSpeakBrowserTTS() {
  if (splashNarrationCompleted || isCurrentlyPlaying) return;
  if (!window.speechSynthesis) {
    console.warn("[SplashNarration] No speechSynthesis available");
    return;
  }

  console.log("[SplashNarration] Using browser TTS fallback");
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(HERO_SCRIPT);
  const voice = getBestItalianVoice();
  if (voice) utterance.voice = voice;
  utterance.lang = "it-IT";
  utterance.rate = 0.95;
  utterance.pitch = 1.05;
  utterance.volume = 1;

  utterance.onstart = () => {
    console.log("[SplashNarration] Browser TTS started");
    isCurrentlyPlaying = true;
  };
  utterance.onend = () => {
    splashNarrationCompleted = true;
    isCurrentlyPlaying = false;
    currentUtterance = null;
  };
  utterance.onerror = (e) => {
    console.warn("[SplashNarration] Browser TTS error:", e.error);
    isCurrentlyPlaying = false;
    currentUtterance = null;
  };

  currentUtterance = utterance;
  isCurrentlyPlaying = true;
  try {
    window.speechSynthesis.speak(utterance);
  } catch {
    isCurrentlyPlaying = false;
    currentUtterance = null;
  }
}

// ─── Main orchestrator ───

async function doSpeak() {
  if (splashNarrationCompleted || isCurrentlyPlaying) return;

  armSafetyTimeout();

  // Try premium ElevenLabs first
  const premiumAudio = await fetchPremiumAudio();

  if (premiumAudio && !splashNarrationCompleted && !isCurrentlyPlaying) {
    const played = playPremiumAudio(premiumAudio);
    if (played) return;
  }

  // Fallback to browser TTS
  if (!splashNarrationCompleted && !isCurrentlyPlaying) {
    doSpeakBrowserTTS();
  }
}

// ─── Auto-unlock listener ───

function addAutoUnlockListener() {
  if (autoUnlockListenerAdded || typeof window === "undefined") return;
  autoUnlockListenerAdded = true;

  const handler = () => {
    console.log("[SplashNarration] User gesture detected, unlocking audio");
    removeListeners();
    unlockAndStartSplashNarration();
  };

  const removeListeners = () => {
    ["click", "touchstart", "pointerdown", "keydown", "scroll"].forEach(evt =>
      document.removeEventListener(evt, handler, { capture: true } as EventListenerOptions)
    );
  };

  ["click", "touchstart", "pointerdown", "keydown", "scroll"].forEach(evt =>
    document.addEventListener(evt, handler, { capture: true, once: false, passive: true })
  );

  setTimeout(removeListeners, 20000);
}

// ─── Exports ───

/** Start fetching premium audio + narration during splash. */
export function startSplashNarration(): void {
  if (splashNarrationStarted) return;
  if (typeof window === "undefined") return;

  splashNarrationStarted = true;

  // Pre-fetch premium audio immediately
  fetchPremiumAudio();

  // Add auto-unlock for first gesture
  addAutoUnlockListener();

  // On desktop, try to auto-play (may be blocked by browser policy)
  if (window.speechSynthesis) {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => { cachedVoice = null; };
    }
  }

  // Attempt autoplay — will succeed on desktop if policy allows
  doSpeak();

  console.log("[SplashNarration] Started — premium audio pre-fetching");
}

/**
 * Called from a user gesture handler (tap on splash screen).
 * Unlocks audio context and plays premium voice.
 * IDEMPOTENT: if audio is already playing, does nothing.
 */
export function unlockAndStartSplashNarration(): void {
  if (audioUnlocked) return;
  audioUnlocked = true;

  if (typeof window === "undefined") return;
  if (splashNarrationCompleted) return;

  console.log("[SplashNarration] Unlocking audio from user gesture");

  // If already playing successfully, just resume if paused — never restart
  if (isCurrentlyPlaying) {
    if (audioElement && audioElement.paused) {
      audioElement.play().catch(() => {});
    }
    return;
  }

  // If premium audio is cached and nothing is playing, play it
  if (premiumAudioCached) {
    playPremiumAudio(premiumAudioCached);
    return;
  }

  // If still fetching, wait and retry once
  if (premiumFetchInProgress) {
    const checkInterval = setInterval(() => {
      if (premiumAudioCached) {
        clearInterval(checkInterval);
        if (!splashNarrationCompleted && !isCurrentlyPlaying) {
          playPremiumAudio(premiumAudioCached);
        }
      } else if (!premiumFetchInProgress) {
        clearInterval(checkInterval);
        if (!splashNarrationCompleted && !isCurrentlyPlaying) {
          doSpeakBrowserTTS();
        }
      }
    }, 100);
    setTimeout(() => clearInterval(checkInterval), 5000);
    return;
  }

  // Nothing cached, nothing fetching — start fresh
  doSpeak();
}

export function isAudioUnlocked(): boolean {
  return audioUnlocked;
}

export function wasSplashNarrationStarted(): boolean {
  return splashNarrationStarted;
}

export function isSplashNarrationSpeaking(): boolean {
  return splashNarrationStarted && !splashNarrationCompleted && isCurrentlyPlaying;
}

export function isSplashNarrationDone(): boolean {
  return splashNarrationCompleted;
}

export function stopSplashNarration(): void {
  if (safetyTimer) {
    clearTimeout(safetyTimer);
    safetyTimer = null;
  }

  stopAllCurrent();
  splashNarrationCompleted = true;
}
