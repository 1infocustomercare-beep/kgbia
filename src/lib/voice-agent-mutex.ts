/**
 * Global Voice Agent Mutex
 * Ensures only ONE voice agent speaks at a time across the entire app.
 * Each agent must claim() before speaking and release() when done.
 * If another agent claims, the previous one is forcefully stopped.
 */

type StopCallback = () => void;

interface VoiceAgentEntry {
  id: string;
  stop: StopCallback;
}

let activeAgent: VoiceAgentEntry | null = null;
const listeners = new Set<(agentId: string | null) => void>();

/**
 * Claim exclusive voice control. Stops any currently active agent first.
 * Returns true if claim was successful.
 */
export function claimVoiceAgent(id: string, stopFn: StopCallback): boolean {
  // If same agent re-claims, just update the stop function
  if (activeAgent?.id === id) {
    activeAgent.stop = stopFn;
    return true;
  }

  // Stop previous agent
  if (activeAgent) {
    console.log(`[VoiceMutex] Stopping "${activeAgent.id}" — "${id}" is taking over`);
    try {
      activeAgent.stop();
    } catch (e) {
      console.warn("[VoiceMutex] Error stopping previous agent:", e);
    }
  }

  // Also kill any stray browser TTS
  if (window.speechSynthesis) {
    try { window.speechSynthesis.cancel(); } catch { /* noop */ }
  }

  activeAgent = { id, stop: stopFn };
  notifyListeners(id);
  return true;
}

/**
 * Release voice control. Only releases if the calling agent is the current owner.
 */
export function releaseVoiceAgent(id: string): void {
  if (activeAgent?.id === id) {
    activeAgent = null;
    notifyListeners(null);
  }
}

/**
 * Check if a specific agent currently owns the voice channel.
 */
export function isVoiceAgentActive(id: string): boolean {
  return activeAgent?.id === id;
}

/**
 * Get the ID of the currently active voice agent, or null.
 */
export function getActiveVoiceAgent(): string | null {
  return activeAgent?.id ?? null;
}

/**
 * Force-stop whatever agent is active. Used for global cleanup.
 */
export function stopAllVoiceAgents(): void {
  if (activeAgent) {
    try { activeAgent.stop(); } catch { /* noop */ }
    activeAgent = null;
  }
  if (window.speechSynthesis) {
    try { window.speechSynthesis.cancel(); } catch { /* noop */ }
  }
  notifyListeners(null);
}

function notifyListeners(agentId: string | null) {
  listeners.forEach(fn => {
    try { fn(agentId); } catch { /* noop */ }
  });
}

export function onVoiceAgentChange(fn: (agentId: string | null) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
