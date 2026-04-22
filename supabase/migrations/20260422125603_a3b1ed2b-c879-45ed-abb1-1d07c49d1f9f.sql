CREATE TABLE IF NOT EXISTS public.lead_whatsapp_ab_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL DEFAULT auth.uid(),
  lead_id uuid,
  lead_name text NOT NULL,
  lead_phone text,
  variant_a_label text NOT NULL DEFAULT 'A',
  variant_a_message text NOT NULL,
  variant_a_short_id text NOT NULL DEFAULT substr(md5(random()::text || clock_timestamp()::text), 1, 10),
  variant_a_clicks integer NOT NULL DEFAULT 0,
  variant_a_replies integer NOT NULL DEFAULT 0,
  variant_a_first_clicked_at timestamptz,
  variant_a_last_clicked_at timestamptz,
  variant_b_label text NOT NULL DEFAULT 'B',
  variant_b_message text NOT NULL,
  variant_b_short_id text NOT NULL DEFAULT substr(md5(random()::text || clock_timestamp()::text), 1, 10),
  variant_b_clicks integer NOT NULL DEFAULT 0,
  variant_b_replies integer NOT NULL DEFAULT 0,
  variant_b_first_clicked_at timestamptz,
  variant_b_last_clicked_at timestamptz,
  status text NOT NULL DEFAULT 'active',
  winner text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_wa_ab_short_a ON public.lead_whatsapp_ab_tests(variant_a_short_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_wa_ab_short_b ON public.lead_whatsapp_ab_tests(variant_b_short_id);
CREATE INDEX IF NOT EXISTS idx_wa_ab_owner ON public.lead_whatsapp_ab_tests(owner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wa_ab_lead ON public.lead_whatsapp_ab_tests(lead_id);

ALTER TABLE public.lead_whatsapp_ab_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_select_wa_ab" ON public.lead_whatsapp_ab_tests
  FOR SELECT USING (owner_id = auth.uid() OR public.is_super_admin());
CREATE POLICY "owner_insert_wa_ab" ON public.lead_whatsapp_ab_tests
  FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "owner_update_wa_ab" ON public.lead_whatsapp_ab_tests
  FOR UPDATE USING (owner_id = auth.uid() OR public.is_super_admin());
CREATE POLICY "owner_delete_wa_ab" ON public.lead_whatsapp_ab_tests
  FOR DELETE USING (owner_id = auth.uid() OR public.is_super_admin());

CREATE TRIGGER trg_wa_ab_updated
  BEFORE UPDATE ON public.lead_whatsapp_ab_tests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.track_wa_ab_click(p_short_id text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_test record;
  v_variant text;
  v_message text;
  v_phone text;
BEGIN
  SELECT * INTO v_test
  FROM public.lead_whatsapp_ab_tests
  WHERE variant_a_short_id = p_short_id OR variant_b_short_id = p_short_id
  LIMIT 1;

  IF v_test.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_found');
  END IF;

  IF v_test.variant_a_short_id = p_short_id THEN
    v_variant := 'A';
    v_message := v_test.variant_a_message;
    UPDATE public.lead_whatsapp_ab_tests
      SET variant_a_clicks = variant_a_clicks + 1,
          variant_a_first_clicked_at = COALESCE(variant_a_first_clicked_at, now()),
          variant_a_last_clicked_at = now()
      WHERE id = v_test.id;
  ELSE
    v_variant := 'B';
    v_message := v_test.variant_b_message;
    UPDATE public.lead_whatsapp_ab_tests
      SET variant_b_clicks = variant_b_clicks + 1,
          variant_b_first_clicked_at = COALESCE(variant_b_first_clicked_at, now()),
          variant_b_last_clicked_at = now()
      WHERE id = v_test.id;
  END IF;

  v_phone := v_test.lead_phone;

  RETURN jsonb_build_object(
    'success', true,
    'variant', v_variant,
    'message', v_message,
    'phone', v_phone,
    'lead_name', v_test.lead_name
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.mark_wa_ab_reply(p_test_id uuid, p_variant text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_variant NOT IN ('A','B') THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_variant');
  END IF;

  IF p_variant = 'A' THEN
    UPDATE public.lead_whatsapp_ab_tests
      SET variant_a_replies = variant_a_replies + 1
      WHERE id = p_test_id AND (owner_id = auth.uid() OR public.is_super_admin());
  ELSE
    UPDATE public.lead_whatsapp_ab_tests
      SET variant_b_replies = variant_b_replies + 1
      WHERE id = p_test_id AND (owner_id = auth.uid() OR public.is_super_admin());
  END IF;

  UPDATE public.lead_whatsapp_ab_tests
    SET winner = CASE
      WHEN variant_a_replies > variant_b_replies AND variant_a_replies >= 2 THEN 'A'
      WHEN variant_b_replies > variant_a_replies AND variant_b_replies >= 2 THEN 'B'
      ELSE winner
    END
  WHERE id = p_test_id;

  RETURN jsonb_build_object('success', true);
END;
$$;