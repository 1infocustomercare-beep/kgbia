
-- Retry queue for failed autopilot steps (Pain Detection, ROI, Conversation)
CREATE TABLE IF NOT EXISTS public.autopilot_retry_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  step_type TEXT NOT NULL CHECK (step_type IN ('pain_scan', 'roi_calculation', 'conversation_advance', 'lead_outreach')),
  target_id UUID,
  target_table TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'succeeded', 'failed', 'abandoned', 'cancelled')),
  attempt_count INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 5,
  next_retry_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_attempt_at TIMESTAMPTZ,
  last_error TEXT,
  last_error_code TEXT,
  backoff_seconds INTEGER NOT NULL DEFAULT 60,
  priority INTEGER NOT NULL DEFAULT 5,
  source_function TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  succeeded_at TIMESTAMPTZ,
  abandoned_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_autopilot_retry_queue_owner ON public.autopilot_retry_queue(owner_id);
CREATE INDEX IF NOT EXISTS idx_autopilot_retry_queue_status_next ON public.autopilot_retry_queue(status, next_retry_at) WHERE status IN ('pending','in_progress');
CREATE INDEX IF NOT EXISTS idx_autopilot_retry_queue_step ON public.autopilot_retry_queue(step_type, status);

ALTER TABLE public.autopilot_retry_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can view own retries"
  ON public.autopilot_retry_queue FOR SELECT
  USING (owner_id = auth.uid() OR public.is_super_admin());

CREATE POLICY "Owner can insert own retries"
  ON public.autopilot_retry_queue FOR INSERT
  WITH CHECK (owner_id = auth.uid() OR public.is_super_admin());

CREATE POLICY "Owner can update own retries"
  ON public.autopilot_retry_queue FOR UPDATE
  USING (owner_id = auth.uid() OR public.is_super_admin());

CREATE POLICY "Owner can delete own retries"
  ON public.autopilot_retry_queue FOR DELETE
  USING (owner_id = auth.uid() OR public.is_super_admin());

CREATE TRIGGER trg_autopilot_retry_queue_updated
  BEFORE UPDATE ON public.autopilot_retry_queue
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Helper: enqueue a retry with exponential backoff
CREATE OR REPLACE FUNCTION public.enqueue_autopilot_retry(
  p_owner_id UUID,
  p_step_type TEXT,
  p_target_id UUID,
  p_target_table TEXT,
  p_payload JSONB DEFAULT '{}'::jsonb,
  p_error TEXT DEFAULT NULL,
  p_error_code TEXT DEFAULT NULL,
  p_source TEXT DEFAULT NULL,
  p_priority INTEGER DEFAULT 5,
  p_max_attempts INTEGER DEFAULT 5
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
  v_existing RECORD;
  v_new_attempt INTEGER;
  v_new_backoff INTEGER;
  v_next TIMESTAMPTZ;
BEGIN
  -- Look for existing active retry on same target+step
  SELECT id, attempt_count, max_attempts INTO v_existing
  FROM public.autopilot_retry_queue
  WHERE owner_id = p_owner_id
    AND step_type = p_step_type
    AND target_id = p_target_id
    AND status IN ('pending','in_progress','failed')
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_existing.id IS NOT NULL THEN
    v_new_attempt := COALESCE(v_existing.attempt_count, 0) + 1;
    -- Exponential backoff: 60s, 2m, 5m, 15m, 30m, capped at 60m
    v_new_backoff := LEAST(3600, 60 * POWER(2, GREATEST(v_new_attempt - 1, 0))::INTEGER);
    v_next := now() + make_interval(secs => v_new_backoff);

    IF v_new_attempt >= COALESCE(v_existing.max_attempts, p_max_attempts) THEN
      UPDATE public.autopilot_retry_queue
      SET status = 'abandoned',
          attempt_count = v_new_attempt,
          last_attempt_at = now(),
          last_error = p_error,
          last_error_code = p_error_code,
          abandoned_at = now()
      WHERE id = v_existing.id;
    ELSE
      UPDATE public.autopilot_retry_queue
      SET status = 'pending',
          attempt_count = v_new_attempt,
          backoff_seconds = v_new_backoff,
          next_retry_at = v_next,
          last_attempt_at = now(),
          last_error = p_error,
          last_error_code = p_error_code,
          payload = COALESCE(p_payload, payload),
          source_function = COALESCE(p_source, source_function)
      WHERE id = v_existing.id;
    END IF;
    RETURN v_existing.id;
  END IF;

  INSERT INTO public.autopilot_retry_queue (
    owner_id, step_type, target_id, target_table, payload,
    last_error, last_error_code, source_function, priority, max_attempts,
    next_retry_at, backoff_seconds, attempt_count
  ) VALUES (
    p_owner_id, p_step_type, p_target_id, p_target_table, COALESCE(p_payload,'{}'::jsonb),
    p_error, p_error_code, p_source, COALESCE(p_priority,5), COALESCE(p_max_attempts,5),
    now() + interval '60 seconds', 60, 1
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- Mark a retry as succeeded
CREATE OR REPLACE FUNCTION public.mark_autopilot_retry_success(p_id UUID)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.autopilot_retry_queue
  SET status = 'succeeded',
      succeeded_at = now(),
      last_attempt_at = now()
  WHERE id = p_id;
$$;
