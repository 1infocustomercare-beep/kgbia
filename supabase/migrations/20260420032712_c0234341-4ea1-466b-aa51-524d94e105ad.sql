-- 1. Stato autopilot per venditore (singleton per user)
CREATE TABLE IF NOT EXISTS public.arianna_autopilot_state (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  is_running boolean NOT NULL DEFAULT false,
  current_city text,
  current_sector text,
  cycles_completed integer NOT NULL DEFAULT 0,
  hot_leads_found integer NOT NULL DEFAULT 0,
  last_cycle_at timestamptz,
  next_cycle_at timestamptz,
  -- Pesi adattivi: { "Roma|food": 1.5, "Milano|beauty": 0.8, ... }
  zone_sector_weights jsonb NOT NULL DEFAULT '{}'::jsonb,
  -- Anti-duplicati: città già viste nelle ultime 24h
  recently_scanned jsonb NOT NULL DEFAULT '[]'::jsonb,
  -- Filtri di qualità (configurabili dal venditore)
  quality_filters jsonb NOT NULL DEFAULT '{
    "require_no_website": true,
    "require_no_social": true,
    "min_rating": 4.0,
    "min_reviews": 20,
    "premium_sectors_only": true
  }'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.arianna_autopilot_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sellers manage own autopilot state"
  ON public.arianna_autopilot_state FOR ALL
  USING (user_id = auth.uid() OR public.is_super_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_super_admin());

-- 2. Log apprendimento (ogni ciclo, ogni decisione)
CREATE TABLE IF NOT EXISTS public.arianna_learning_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  cycle_number integer NOT NULL,
  city text NOT NULL,
  sector text NOT NULL,
  -- Numeri raw del ciclo
  leads_scanned integer NOT NULL DEFAULT 0,
  leads_passed_filters integer NOT NULL DEFAULT 0,
  leads_saved_to_pipeline integer NOT NULL DEFAULT 0,
  -- Esito (aggiornato dopo che il venditore lavora i lead)
  leads_contacted integer NOT NULL DEFAULT 0,
  leads_replied integer NOT NULL DEFAULT 0,
  leads_converted integer NOT NULL DEFAULT 0,
  -- Score adattivo: aggiornato in batch da edge function
  performance_score numeric NOT NULL DEFAULT 0,
  -- Decisione adattiva di Arianna
  decision_reasoning text,
  selected_weight numeric,
  -- Costi
  credits_spent integer NOT NULL DEFAULT 0,
  duration_ms integer,
  status text NOT NULL DEFAULT 'completed',
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.arianna_learning_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sellers view own learning log"
  ON public.arianna_learning_log FOR SELECT
  USING (user_id = auth.uid() OR public.is_super_admin());

CREATE POLICY "Service role inserts learning"
  ON public.arianna_learning_log FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role updates learning"
  ON public.arianna_learning_log FOR UPDATE
  USING (true);

CREATE INDEX IF NOT EXISTS idx_arianna_learning_user_created
  ON public.arianna_learning_log(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_arianna_learning_perf
  ON public.arianna_learning_log(user_id, city, sector, performance_score);

-- 3. Trigger updated_at
CREATE TRIGGER arianna_autopilot_state_updated_at
  BEFORE UPDATE ON public.arianna_autopilot_state
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Costi nuove azioni "Ricerca Estrema PRO" (markup invisibile per venditori)
INSERT INTO public.seller_action_costs (action, label, credit_cost, cost_eur_estimate, is_active, description)
VALUES
  ('lead_search_extreme', 'Ricerca Estrema PRO (Google + Firecrawl)', 3, 0.08, true, 'Ricerca avanzata con Google Places API + Firecrawl scraping per dati reali completi'),
  ('lead_enrich_social', 'Arricchimento Social (Instagram/Facebook)', 2, 0.05, true, 'Verifica presenza social del lead per filtrare attività senza presenza digitale'),
  ('lead_enrich_piva', 'Verifica P.IVA Italiana', 1, 0.02, true, 'Verifica dati camerali e P.IVA italiana del lead'),
  ('arianna_autopilot_cycle', 'Ciclo Autopilot Arianna', 5, 0.15, true, 'Ciclo completo Arianna autopilot adattivo: ricerca + filtri + arricchimento + salvataggio pipeline')
ON CONFLICT (action) DO UPDATE SET
  label = EXCLUDED.label,
  credit_cost = EXCLUDED.credit_cost,
  cost_eur_estimate = EXCLUDED.cost_eur_estimate,
  description = EXCLUDED.description,
  is_active = true;