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
  "Benvenuto in Empire — il sistema operativo che trasforma qualsiasi attività in un business digitale di nuova generazione. Pronto a scoprire come?";

let splashNarrationStarted = false;
let splashNarrationCompleted = false;
let audioElement: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let audioUnlocked = false;
let safetyTimer: ReturnType<typeof setTimeout> | null = null;
let autoUnlockListenerAdded = false;
let premiumAudioCached: string | null = null;
let premiumFetchInProgress = false;

// Safety: force-complete after 15s max
function armSafetyTimeout() {
  if (safetyTimer) clearTimeout(safetyTimer);
  safetyTimer = setTimeout(() => {
    if (!splashNarrationCompleted) {
      console.log("[SplashNarration] Safety timeout — completing");
      splashNarrationCompleted = true;
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

function playPremiumAudio(base64Audio: string): boolean {
  try {
    if (audioElement) {
      audioElement.pause();
      audioElement = null;
    }

    const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;
    const audio = new Audio(audioUrl);
    audio.volume = 1;
    audioElement = audio;

    audio.onended = () => {
      console.log("[SplashNarration] ✅ Premium speech ended");
      splashNarrationCompleted = true;
      audioElement = null;
    };

    audio.onerror = (e) => {
      console.warn("[SplashNarration] Premium playback error, falling back:", e);
      audioElement = null;
      doSpeakBrowserTTS();
    };

    audio.play().then(() => {
      console.log("[SplashNarration] ✅ Premium audio playing!");
    }).catch((playErr) => {
      console.warn("[SplashNarration] Premium play() blocked:", playErr);
      // Will retry on user gesture
    });

    return true;
  } catch (err) {
    console.warn("[SplashNarration] Premium play setup failed:", err);
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
  if (splashNarrationCompleted) return;
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

  utterance.onstart = () => console.log("[SplashNarration] Browser TTS started");
  utterance.onend = () => {
    splashNarrationCompleted = true;
    currentUtterance = null;
  };
  utterance.onerror = (e) => {
    console.warn("[SplashNarration] Browser TTS error:", e.error);
    currentUtterance = null;
  };

  currentUtterance = utterance;
  try {
    window.speechSynthesis.speak(utterance);
  } catch {
    currentUtterance = null;
  }
}

// ─── Main orchestrator ───

async function doSpeak() {
  if (splashNarrationCompleted) return;

  armSafetyTimeout();

  // Try premium ElevenLabs first
  const premiumAudio = await fetchPremiumAudio();

  if (premiumAudio && !splashNarrationCompleted) {
    const played = playPremiumAudio(premiumAudio);
    if (played) return;
  }

  // Fallback to browser TTS
  if (!splashNarrationCompleted) {
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
 */
export function unlockAndStartSplashNarration(): void {
  if (audioUnlocked) return;
  audioUnlocked = true;

  if (typeof window === "undefined") return;

  console.log("[SplashNarration] Unlocking audio from user gesture");

  // If premium audio is already cached and not yet playing, play it now
  if (premiumAudioCached && !splashNarrationCompleted) {
    if (audioElement) {
      // Re-attempt play in gesture context
      audioElement.play().catch(() => {
        doSpeakBrowserTTS();
      });
    } else {
      playPremiumAudio(premiumAudioCached);
    }
    return;
  }

  // If still fetching, wait and retry
  if (premiumFetchInProgress && !splashNarrationCompleted) {
    const checkInterval = setInterval(() => {
      if (premiumAudioCached) {
        clearInterval(checkInterval);
        if (!splashNarrationCompleted) {
          playPremiumAudio(premiumAudioCached);
        }
      } else if (!premiumFetchInProgress) {
        clearInterval(checkInterval);
        if (!splashNarrationCompleted) {
          doSpeakBrowserTTS();
        }
      }
    }, 100);
    setTimeout(() => clearInterval(checkInterval), 5000);
    return;
  }

  // If narration already playing via browser TTS, don't interrupt
  if (currentUtterance && window.speechSynthesis?.speaking) return;

  // Start fresh
  doSpeak();
}

export function isAudioUnlocked(): boolean {
  return audioUnlocked;
}

export function wasSplashNarrationStarted(): boolean {
  return splashNarrationStarted;
}

export function isSplashNarrationSpeaking(): boolean {
  return splashNarrationStarted && !splashNarrationCompleted &&
    (!!audioElement || !!currentUtterance);
}

export function isSplashNarrationDone(): boolean {
  return splashNarrationCompleted;
}

export function stopSplashNarration(): void {
  if (safetyTimer) {
    clearTimeout(safetyTimer);
    safetyTimer = null;
  }

  if (audioElement) {
    try { audioElement.pause(); } catch { /* noop */ }
    audioElement = null;
  }

  if (typeof window !== "undefined" && window.speechSynthesis) {
    try { window.speechSynthesis.cancel(); } catch { /* noop */ }
  }

  currentUtterance = null;
  splashNarrationCompleted = true;
}
