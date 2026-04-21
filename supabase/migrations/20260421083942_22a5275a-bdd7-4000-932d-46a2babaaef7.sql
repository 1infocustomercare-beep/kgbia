
-- ============ TABLE: outreach_failures ============
CREATE TABLE IF NOT EXISTS public.outreach_failures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid,
  lead_id uuid,
  sequence_id uuid,
  touch_id uuid,
  channel text NOT NULL,
  recipient text,
  provider text,
  error_code text,
  error_message text NOT NULL,
  source_function text NOT NULL DEFAULT 'unknown',
  deploy_version text,
  http_status int,
  payload jsonb DEFAULT '{}'::jsonb,
  severity text NOT NULL DEFAULT 'error',
  resolved boolean NOT NULL DEFAULT false,
  resolved_at timestamptz,
  resolved_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_outreach_failures_created_at ON public.outreach_failures(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_outreach_failures_owner ON public.outreach_failures(owner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_outreach_failures_unresolved ON public.outreach_failures(resolved, created_at DESC) WHERE resolved = false;
CREATE INDEX IF NOT EXISTS idx_outreach_failures_source ON public.outreach_failures(source_function, created_at DESC);

ALTER TABLE public.outreach_failures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners view own outreach failures"
ON public.outreach_failures FOR SELECT
TO authenticated
USING (owner_id = auth.uid() OR public.is_super_admin());

CREATE POLICY "Super admin manages outreach failures"
ON public.outreach_failures FOR ALL
TO authenticated
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());

-- ============ TABLE: outreach_health_alerts ============
CREATE TABLE IF NOT EXISTS public.outreach_health_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_level text NOT NULL DEFAULT 'warning', -- info | warning | critical
  source_function text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  failures_count int NOT NULL DEFAULT 0,
  attempts_count int NOT NULL DEFAULT 0,
  failure_rate numeric NOT NULL DEFAULT 0,
  window_minutes int NOT NULL DEFAULT 30,
  deploy_version text,
  metadata jsonb DEFAULT '{}'::jsonb,
  acknowledged boolean NOT NULL DEFAULT false,
  acknowledged_at timestamptz,
  acknowledged_by uuid,
  resolved boolean NOT NULL DEFAULT false,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_outreach_alerts_created ON public.outreach_health_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_outreach_alerts_open ON public.outreach_health_alerts(resolved, alert_level, created_at DESC) WHERE resolved = false;

ALTER TABLE public.outreach_health_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admin views outreach alerts"
ON public.outreach_health_alerts FOR SELECT
TO authenticated
USING (public.is_super_admin());

CREATE POLICY "Super admin manages outreach alerts"
ON public.outreach_health_alerts FOR ALL
TO authenticated
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());

-- ============ RPC: log_outreach_failure ============
CREATE OR REPLACE FUNCTION public.log_outreach_failure(
  p_source_function text,
  p_channel text,
  p_error_message text,
  p_owner_id uuid DEFAULT NULL,
  p_lead_id uuid DEFAULT NULL,
  p_sequence_id uuid DEFAULT NULL,
  p_touch_id uuid DEFAULT NULL,
  p_recipient text DEFAULT NULL,
  p_provider text DEFAULT NULL,
  p_error_code text DEFAULT NULL,
  p_http_status int DEFAULT NULL,
  p_deploy_version text DEFAULT NULL,
  p_payload jsonb DEFAULT '{}'::jsonb,
  p_severity text DEFAULT 'error'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO public.outreach_failures (
    owner_id, lead_id, sequence_id, touch_id, channel, recipient,
    provider, error_code, error_message, source_function, deploy_version,
    http_status, payload, severity
  ) VALUES (
    p_owner_id, p_lead_id, p_sequence_id, p_touch_id, p_channel, p_recipient,
    p_provider, p_error_code, p_error_message, p_source_function, p_deploy_version,
    p_http_status, COALESCE(p_payload, '{}'::jsonb), COALESCE(p_severity, 'error')
  )
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.log_outreach_failure(
  text, text, text, uuid, uuid, uuid, uuid, text, text, text, int, text, jsonb, text
) TO authenticated, anon, service_role;

-- ============ RPC: check_outreach_health ============
-- Inspects the last `p_window_minutes` and raises an alert if failure rate
-- is above thresholds. Designed to be called after deploys / by cron.
CREATE OR REPLACE FUNCTION public.check_outreach_health(
  p_window_minutes int DEFAULT 30,
  p_min_attempts int DEFAULT 5,
  p_warn_rate numeric DEFAULT 0.5,
  p_critical_rate numeric DEFAULT 0.85,
  p_deploy_version text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_since timestamptz := now() - make_interval(mins => p_window_minutes);
  v_failures int := 0;
  v_attempts int := 0;
  v_rate numeric := 0;
  v_level text := 'info';
  v_alert_id uuid;
  v_existing_open uuid;
BEGIN
  -- Count failures from central log
  SELECT count(*) INTO v_failures
  FROM public.outreach_failures
  WHERE created_at >= v_since;

  -- Count attempts from touches table (sent OR failed)
  SELECT count(*) INTO v_attempts
  FROM public.lead_outreach_touches
  WHERE created_at >= v_since;

  IF v_attempts < p_min_attempts THEN
    RETURN jsonb_build_object(
      'status', 'insufficient_data',
      'window_minutes', p_window_minutes,
      'failures', v_failures,
      'attempts', v_attempts
    );
  END IF;

  v_rate := v_failures::numeric / GREATEST(v_attempts, 1);

  IF v_rate >= p_critical_rate THEN
    v_level := 'critical';
  ELSIF v_rate >= p_warn_rate THEN
    v_level := 'warning';
  ELSE
    v_level := 'ok';
  END IF;

  IF v_level = 'ok' THEN
    -- Auto-resolve any open alert
    UPDATE public.outreach_health_alerts
    SET resolved = true, resolved_at = now()
    WHERE resolved = false;
    RETURN jsonb_build_object(
      'status', 'healthy',
      'failure_rate', v_rate,
      'failures', v_failures,
      'attempts', v_attempts
    );
  END IF;

  -- Avoid duplicate alerts: reuse open alert at same/lower level within window
  SELECT id INTO v_existing_open
  FROM public.outreach_health_alerts
  WHERE resolved = false
    AND created_at >= v_since
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_existing_open IS NOT NULL THEN
    UPDATE public.outreach_health_alerts
    SET failures_count = v_failures,
        attempts_count = v_attempts,
        failure_rate = v_rate,
        alert_level = v_level,
        message = format('Outreach failure rate %.0f%% (%s/%s) over last %s min',
          v_rate * 100, v_failures, v_attempts, p_window_minutes),
        deploy_version = COALESCE(p_deploy_version, deploy_version)
    WHERE id = v_existing_open;
    v_alert_id := v_existing_open;
  ELSE
    INSERT INTO public.outreach_health_alerts (
      alert_level, source_function, title, message,
      failures_count, attempts_count, failure_rate,
      window_minutes, deploy_version
    ) VALUES (
      v_level,
      'outreach_health_monitor',
      CASE WHEN v_level = 'critical' THEN '🚨 Outreach non operativo' ELSE '⚠️ Outreach degradato' END,
      format('Outreach failure rate %.0f%% (%s/%s) over last %s min',
        v_rate * 100, v_failures, v_attempts, p_window_minutes),
      v_failures, v_attempts, v_rate,
      p_window_minutes, p_deploy_version
    )
    RETURNING id INTO v_alert_id;
  END IF;

  RETURN jsonb_build_object(
    'status', v_level,
    'alert_id', v_alert_id,
    'failure_rate', v_rate,
    'failures', v_failures,
    'attempts', v_attempts,
    'window_minutes', p_window_minutes
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_outreach_health(int, int, numeric, numeric, text)
  TO authenticated, service_role;
