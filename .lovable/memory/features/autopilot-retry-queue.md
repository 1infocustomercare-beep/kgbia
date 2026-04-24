---
name: autopilot-retry-queue
description: Coda retry con backoff esponenziale per i passaggi Pain/ROI/Conversation/Outreach falliti, processata da edge function ogni 2 min via cron e visibile nel cockpit Empire Autopilot
type: feature
---
Tabella `autopilot_retry_queue` con stati pending/in_progress/succeeded/failed/abandoned/cancelled.
Backoff esponenziale: 60s → 2m → 5m → 15m → 30m → max 60m. Default max_attempts=5.

**Funzioni DB:**
- `enqueue_autopilot_retry(owner, step_type, target_id, target_table, payload, error, error_code, source, priority, max_attempts)` — upsert sulla stessa tupla (owner+step+target), incrementa attempt e schedula next_retry_at; oltre max_attempts marca `abandoned`.
- `mark_autopilot_retry_success(id)` — chiude il retry come completato.

**Edge function `autopilot-retry-processor`:**
- Schedulata via pg_cron `*/2 * * * *` (job id 7), max 20 voci/run.
- Esegue solo voci `pending` con `next_retry_at <= now()`.
- Mappatura step_type → edge function: pain_scan→autopilot-pain-detector, roi_calculation→autopilot-roi-calculator, conversation_advance→autopilot-conversation-engine (action: advance_conversation), lead_outreach→arianna-multichannel-outreach.
- Su errore richiama `enqueue_autopilot_retry` (incrementa attempt + ricalcola backoff).

**Hook in edge function esistenti:**
- `autopilot-pain-detector` e `autopilot-conversation-engine` (solo per `advance_conversation`) chiamano `enqueue_autopilot_retry` automaticamente nel catch globale (best-effort, non-blocking).

**UI:**
- `AutopilotRetryPanel` in `/partner/autopilot` (Fase 4) mostra: stats per stato, tabs Attivi/Abbandonati/Tutti, ogni riga con tentativi/N max, prossima esecuzione, backoff, errore, azioni "Ora" (forza retry immediato) e "Annulla". Polling 15s + bottone "Esegui ora" per trigger manuale del processor.
- Hook `useAutopilotRetryQueue`, `useTriggerRetryProcessor`, `useCancelRetry`, `useRescheduleRetryNow`, `useRetryQueueStats` in `src/hooks/useAutopilotRetryQueue.ts`.

RLS: ogni owner vede/gestisce solo le proprie voci; super_admin vede tutto.
