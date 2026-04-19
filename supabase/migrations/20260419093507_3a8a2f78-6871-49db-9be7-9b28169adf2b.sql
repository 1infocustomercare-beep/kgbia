-- Estensioni per cron + http
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Tracking dell'ultima esecuzione automatica
ALTER TABLE public.sales_agent_config
  ADD COLUMN IF NOT EXISTS last_auto_run_at timestamptz,
  ADD COLUMN IF NOT EXISTS continuous_mode boolean NOT NULL DEFAULT true;

-- Funzione che invoca l'orchestrator per ogni agente attivo
CREATE OR REPLACE FUNCTION public.tick_arianna_continuous()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cfg record;
  v_url text := 'https://gypnxirzmhpapmhjguaj.supabase.co/functions/v1/sales-agent-orchestrator';
  v_anon text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5cG54aXJ6bWhwYXBtaGpndWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NTY4ODcsImV4cCI6MjA4NzMzMjg4N30.h9QGwHHsi8HbgRXDML7j0yYKSfICJD-rghrEGBgMD0A';
BEGIN
  FOR v_cfg IN
    SELECT user_id
    FROM public.sales_agent_config
    WHERE is_active = true
      AND COALESCE(continuous_mode, true) = true
      AND (last_auto_run_at IS NULL OR last_auto_run_at < now() - interval '2 minutes')
  LOOP
    PERFORM net.http_post(
      url := v_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || v_anon,
        'apikey', v_anon
      ),
      body := jsonb_build_object(
        'owner_id', v_cfg.user_id,
        'job_type', 'hunt_and_outreach',
        'trigger_source', 'cron_continuous'
      )
    );

    UPDATE public.sales_agent_config
      SET last_auto_run_at = now()
      WHERE user_id = v_cfg.user_id;
  END LOOP;
END;
$$;

-- Rimuovi job precedente se esiste
DO $$
BEGIN
  PERFORM cron.unschedule('arianna-continuous-tick');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Schedula tick ogni 3 minuti
SELECT cron.schedule(
  'arianna-continuous-tick',
  '*/3 * * * *',
  $$ SELECT public.tick_arianna_continuous(); $$
);