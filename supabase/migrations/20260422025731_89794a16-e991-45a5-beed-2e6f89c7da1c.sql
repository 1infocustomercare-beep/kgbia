-- ═══════════════════════════════════════════════════════════════════════
-- Stripe Webhook Idempotency + Order Tracking
-- Garantisce che ogni evento Stripe venga processato UNA SOLA volta
-- e che ogni ordine/pagamento sia collegato a user_id e tenant_id.
-- ═══════════════════════════════════════════════════════════════════════

-- 1) Tabella idempotenza eventi Stripe
CREATE TABLE IF NOT EXISTS public.stripe_webhook_events (
  event_id text PRIMARY KEY,
  event_type text NOT NULL,
  livemode boolean NOT NULL DEFAULT false,
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  status text NOT NULL DEFAULT 'received' CHECK (status IN ('received','processed','failed','skipped')),
  error_message text,
  payload_summary jsonb DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_type_received
  ON public.stripe_webhook_events (event_type, received_at DESC);

ALTER TABLE public.stripe_webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins view webhook events"
  ON public.stripe_webhook_events FOR SELECT
  USING (public.is_super_admin());

-- 2) Tabella log ordini PWA (collegamento user ↔ restaurant ↔ ordine ↔ session)
CREATE TABLE IF NOT EXISTS public.pwa_orders_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  customer_user_id uuid,
  customer_email text,
  amount_cents integer NOT NULL,
  fee_cents integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'eur',
  stripe_session_id text UNIQUE,
  stripe_payment_intent_id text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','failed','refunded')),
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_pwa_orders_log_order
  ON public.pwa_orders_log (order_id);
CREATE INDEX IF NOT EXISTS idx_pwa_orders_log_restaurant
  ON public.pwa_orders_log (restaurant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pwa_orders_log_user
  ON public.pwa_orders_log (customer_user_id, created_at DESC);

ALTER TABLE public.pwa_orders_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Restaurant owners view their PWA orders"
  ON public.pwa_orders_log FOR SELECT
  USING (
    public.is_super_admin()
    OR public.is_restaurant_owner(restaurant_id)
    OR (customer_user_id IS NOT NULL AND customer_user_id = auth.uid())
  );

-- 3) Tabella log acquisti AI tokens (idempotente per session)
CREATE TABLE IF NOT EXISTS public.ai_token_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL,
  buyer_user_id uuid,
  credits integer NOT NULL,
  amount_cents integer NOT NULL,
  currency text NOT NULL DEFAULT 'eur',
  stripe_session_id text UNIQUE,
  stripe_payment_intent_id text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','failed','refunded')),
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_token_purchases_restaurant
  ON public.ai_token_purchases (restaurant_id, created_at DESC);

ALTER TABLE public.ai_token_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Restaurant owners view their token purchases"
  ON public.ai_token_purchases FOR SELECT
  USING (
    public.is_super_admin()
    OR public.is_restaurant_owner(restaurant_id)
    OR (buyer_user_id IS NOT NULL AND buyer_user_id = auth.uid())
  );

-- 4) Indice univoco su setup_payment_log.stripe_session_id per idempotenza
CREATE UNIQUE INDEX IF NOT EXISTS idx_setup_payment_log_session_unique
  ON public.setup_payment_log (stripe_session_id)
  WHERE stripe_session_id IS NOT NULL;

-- 5) Helper RPC: registra evento webhook con lock idempotente
-- Ritorna true se è il primo processamento, false se duplicato
CREATE OR REPLACE FUNCTION public.claim_stripe_event(
  p_event_id text,
  p_event_type text,
  p_livemode boolean DEFAULT false,
  p_summary jsonb DEFAULT '{}'::jsonb
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_inserted boolean := false;
BEGIN
  INSERT INTO public.stripe_webhook_events (event_id, event_type, livemode, payload_summary)
  VALUES (p_event_id, p_event_type, COALESCE(p_livemode, false), COALESCE(p_summary, '{}'::jsonb))
  ON CONFLICT (event_id) DO NOTHING;

  GET DIAGNOSTICS v_inserted = ROW_COUNT;
  RETURN v_inserted;
END;
$$;

CREATE OR REPLACE FUNCTION public.mark_stripe_event_processed(
  p_event_id text,
  p_status text DEFAULT 'processed',
  p_error text DEFAULT NULL
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.stripe_webhook_events
  SET status = COALESCE(p_status, 'processed'),
      processed_at = now(),
      error_message = p_error
  WHERE event_id = p_event_id;
$$;