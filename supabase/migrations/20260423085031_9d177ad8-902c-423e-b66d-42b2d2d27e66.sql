
-- ============================================================
-- COST RECONCILIATION: Stripe fees + AI tokens (real) + BYOK/Scontrini
-- ============================================================

-- 1) Snapshot ledger (append-only) per riconciliazioni periodiche
CREATE TABLE IF NOT EXISTS public.cost_reconciliation_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL DEFAULT now(),
  period_days INTEGER NOT NULL,
  source TEXT NOT NULL, -- 'stripe_fees' | 'ai_gateway_real' | 'ai_gateway_estimated' | 'byok_invoices' | 'token_purchases' | 'seller_actions_estimated'
  amount_eur NUMERIC(12,4) NOT NULL DEFAULT 0,
  amount_usd NUMERIC(12,4) DEFAULT 0,
  events_count INTEGER NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cost_recon_snapshots_period ON public.cost_reconciliation_snapshots(period_end DESC, source);

ALTER TABLE public.cost_reconciliation_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Super admin read recon snapshots" ON public.cost_reconciliation_snapshots;
CREATE POLICY "Super admin read recon snapshots" ON public.cost_reconciliation_snapshots
  FOR SELECT USING (public.is_super_admin());

DROP POLICY IF EXISTS "Super admin insert recon snapshots" ON public.cost_reconciliation_snapshots;
CREATE POLICY "Super admin insert recon snapshots" ON public.cost_reconciliation_snapshots
  FOR INSERT WITH CHECK (public.is_super_admin());

-- Append-only: nessun update / delete
DROP POLICY IF EXISTS "Recon snapshots no update" ON public.cost_reconciliation_snapshots;
CREATE POLICY "Recon snapshots no update" ON public.cost_reconciliation_snapshots
  FOR UPDATE USING (false);
DROP POLICY IF EXISTS "Recon snapshots no delete" ON public.cost_reconciliation_snapshots;
CREATE POLICY "Recon snapshots no delete" ON public.cost_reconciliation_snapshots
  FOR DELETE USING (false);

-- 2) Funzione di riconciliazione: aggrega tutte le sorgenti reali
CREATE OR REPLACE FUNCTION public.compute_cost_reconciliation(p_period_days INTEGER DEFAULT 30)
RETURNS JSONB
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_since TIMESTAMPTZ := now() - make_interval(days => p_period_days);
  v_eur_per_usd NUMERIC := 0.92;

  -- Stripe (fee processore + application fee)
  v_stripe_volume_cents BIGINT := 0;
  v_stripe_fee_cents BIGINT := 0;
  v_stripe_application_fee_cents BIGINT := 0;
  v_stripe_events INTEGER := 0;

  -- AI Gateway reale (cost_usd già emesso dal modello)
  v_ai_real_usd NUMERIC := 0;
  v_ai_real_tokens BIGINT := 0;
  v_ai_real_calls INTEGER := 0;

  -- AI Gateway stima (basata sul listino seller_action_costs)
  v_ai_estimated_eur NUMERIC := 0;
  v_ai_estimated_credits INTEGER := 0;

  -- BYOK / Scontrini (b2b_invoices)
  v_byok_total_eur NUMERIC := 0;
  v_byok_count INTEGER := 0;

  -- Top-up token (revenue)
  v_token_purchase_eur NUMERIC := 0;
  v_token_purchase_count INTEGER := 0;
BEGIN
  -- Stripe fees: estraiamo da payload_summary (popolato dal webhook)
  SELECT
    COALESCE(SUM((payload_summary->>'amount')::BIGINT), 0),
    COALESCE(SUM((payload_summary->>'stripe_fee_cents')::BIGINT), 0),
    COALESCE(SUM((payload_summary->>'application_fee_cents')::BIGINT), 0),
    COUNT(*) FILTER (WHERE event_type IN ('charge.succeeded','payment_intent.succeeded','invoice.paid','checkout.session.completed'))
  INTO v_stripe_volume_cents, v_stripe_fee_cents, v_stripe_application_fee_cents, v_stripe_events
  FROM public.stripe_webhook_events
  WHERE received_at >= v_since
    AND status IN ('processed','received');

  -- AI usage reale
  SELECT
    COALESCE(SUM(cost_usd), 0),
    COALESCE(SUM(COALESCE(input_tokens,0) + COALESCE(output_tokens,0)), 0),
    COUNT(*)
  INTO v_ai_real_usd, v_ai_real_tokens, v_ai_real_calls
  FROM public.ai_usage_logs
  WHERE created_at >= v_since;

  -- AI estimato (da consumi venditori)
  SELECT
    COALESCE(SUM(cost_eur_estimate), 0),
    COALESCE(SUM(GREATEST(credits_used,0)), 0)
  INTO v_ai_estimated_eur, v_ai_estimated_credits
  FROM public.demo_credit_usage
  WHERE created_at >= v_since;

  -- BYOK / Scontrini emessi
  SELECT
    COALESCE(SUM(total), 0),
    COUNT(*)
  INTO v_byok_total_eur, v_byok_count
  FROM public.b2b_invoices
  WHERE created_at >= v_since
    AND status = 'issued';

  -- Top-up token
  SELECT
    COALESCE(SUM(amount_cents)::NUMERIC / 100, 0),
    COUNT(*)
  INTO v_token_purchase_eur, v_token_purchase_count
  FROM public.ai_token_purchases
  WHERE created_at >= v_since
    AND status IN ('paid','succeeded','completed');

  RETURN jsonb_build_object(
    'period_days', p_period_days,
    'period_start', v_since,
    'period_end', now(),
    'eur_per_usd', v_eur_per_usd,
    'stripe', jsonb_build_object(
      'volume_eur', v_stripe_volume_cents::NUMERIC / 100,
      'processor_fee_eur', v_stripe_fee_cents::NUMERIC / 100,
      'application_fee_eur', v_stripe_application_fee_cents::NUMERIC / 100,
      'events_count', v_stripe_events
    ),
    'ai_gateway', jsonb_build_object(
      'real_usd', v_ai_real_usd,
      'real_eur', v_ai_real_usd * v_eur_per_usd,
      'estimated_eur', v_ai_estimated_eur,
      'tokens', v_ai_real_tokens,
      'calls', v_ai_real_calls,
      'credits', v_ai_estimated_credits,
      'delta_eur', (v_ai_real_usd * v_eur_per_usd) - v_ai_estimated_eur
    ),
    'byok_invoices', jsonb_build_object(
      'total_eur', v_byok_total_eur,
      'count', v_byok_count
    ),
    'token_purchases', jsonb_build_object(
      'revenue_eur', v_token_purchase_eur,
      'count', v_token_purchase_count
    ),
    'totals', jsonb_build_object(
      'real_costs_eur', (v_stripe_fee_cents::NUMERIC / 100) + (v_ai_real_usd * v_eur_per_usd),
      'estimated_costs_eur', v_ai_estimated_eur,
      'revenue_eur', (v_stripe_application_fee_cents::NUMERIC / 100) + v_token_purchase_eur + v_byok_total_eur
    )
  );
END;
$$;

-- 3) Funzione: salva snapshot manuale o schedulato
CREATE OR REPLACE FUNCTION public.snapshot_cost_reconciliation(p_period_days INTEGER DEFAULT 30)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_data JSONB;
  v_since TIMESTAMPTZ := now() - make_interval(days => p_period_days);
  v_user UUID := auth.uid();
BEGIN
  IF NOT public.is_super_admin() THEN
    RETURN jsonb_build_object('success', false, 'error', 'forbidden');
  END IF;

  v_data := public.compute_cost_reconciliation(p_period_days);

  -- Inserisci una riga per ogni sorgente (append-only ledger)
  INSERT INTO public.cost_reconciliation_snapshots(period_start, period_end, period_days, source, amount_eur, events_count, metadata, created_by)
  VALUES
    (v_since, now(), p_period_days, 'stripe_fees', (v_data->'stripe'->>'processor_fee_eur')::NUMERIC, (v_data->'stripe'->>'events_count')::INTEGER, v_data->'stripe', v_user),
    (v_since, now(), p_period_days, 'ai_gateway_real', (v_data->'ai_gateway'->>'real_eur')::NUMERIC, (v_data->'ai_gateway'->>'calls')::INTEGER, v_data->'ai_gateway', v_user),
    (v_since, now(), p_period_days, 'ai_gateway_estimated', (v_data->'ai_gateway'->>'estimated_eur')::NUMERIC, (v_data->'ai_gateway'->>'credits')::INTEGER, v_data->'ai_gateway', v_user),
    (v_since, now(), p_period_days, 'byok_invoices', (v_data->'byok_invoices'->>'total_eur')::NUMERIC, (v_data->'byok_invoices'->>'count')::INTEGER, v_data->'byok_invoices', v_user),
    (v_since, now(), p_period_days, 'token_purchases', (v_data->'token_purchases'->>'revenue_eur')::NUMERIC, (v_data->'token_purchases'->>'count')::INTEGER, v_data->'token_purchases', v_user);

  RETURN jsonb_build_object('success', true, 'data', v_data);
END;
$$;

GRANT EXECUTE ON FUNCTION public.compute_cost_reconciliation(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.snapshot_cost_reconciliation(INTEGER) TO authenticated;
