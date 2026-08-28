/**
 * Selettore unico della voce italiana FEMMINILE per il fallback Web Speech API.
 * Arianna è un personaggio femminile: nessun agente deve mai usare una voce maschile.
 */

// Voci italiane note maschili (da escludere sempre)
const MALE_VOICE_PATTERN =
  /(luca|paolo|cosimo|diego|giorgio|marco|roberto|carlo|male|uomo|man\b)/i;

// Voci italiane note femminili (in ordine di qualità percepita)
const FEMALE_PRIORITY = [
  /alice/i,
  /federica/i,
  /elsa/i,
  /isabella/i,
  /emma/i,
  /google.*ital/i,
  /(female|femminile|donna|woman)/i,
];

let cached: SpeechSynthesisVoice | null = null;

export function getItalianFemaleVoice(): SpeechSynthesisVoice | null {
  if (cached) return cached;
  if (typeof window === "undefined" || !window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices() || [];
  const italian = voices.filter((v) => v.lang?.toLowerCase().startsWith("it"));
  const notMale = italian.filter((v) => !MALE_VOICE_PATTERN.test(v.name));

  for (const pattern of FEMALE_PRIORITY) {
    const match = notMale.find((v) => pattern.test(v.name));
    if (match) {
      cached = match;
      return match;
    }
  }

  // Qualsiasi voce italiana non maschile, poi qualsiasi italiana
  const fallback = notMale[0] || italian[0] || null;
  cached = fallback;
  return fallback;
}

/** Applica voce femminile + parametri coerenti con Arianna a un'utterance. */
export function applyAriannaVoice(utterance: SpeechSynthesisUtterance, rate = 0.98) {
  const voice = getItalianFemaleVoice();
  if (voice) utterance.voice = voice;
  utterance.lang = "it-IT";
  utterance.rate = rate;
  // Pitch leggermente più alto: evita che una voce neutra suoni maschile
  utterance.pitch = 1.15;
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cached = null;
    getItalianFemaleVoice();
  };
}
