-- Add paused_sectors column for runtime sector pause (separate from priority_rules.excluded_sectors which is permanent exclusion)
ALTER TABLE public.autopilot_config
  ADD COLUMN IF NOT EXISTS paused_sectors jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Helper function: returns true if a sector is paused or excluded for an owner
CREATE OR REPLACE FUNCTION public.is_autopilot_sector_paused(
  _owner_id uuid,
  _sector text
)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_paused jsonb;
  v_excluded jsonb;
  v_sector_lower text;
BEGIN
  IF _sector IS NULL OR _sector = '' THEN
    RETURN false;
  END IF;
  v_sector_lower := lower(trim(_sector));

  SELECT paused_sectors, COALESCE(priority_rules->'excluded_sectors', '[]'::jsonb)
    INTO v_paused, v_excluded
  FROM public.autopilot_config
  WHERE owner_id = _owner_id;

  IF v_paused IS NULL THEN v_paused := '[]'::jsonb; END IF;

  -- Check paused (case-insensitive)
  IF EXISTS (
    SELECT 1 FROM jsonb_array_elements_text(v_paused) AS s
    WHERE lower(trim(s)) = v_sector_lower
  ) THEN
    RETURN true;
  END IF;

  -- Check excluded (case-insensitive)
  IF EXISTS (
    SELECT 1 FROM jsonb_array_elements_text(v_excluded) AS s
    WHERE lower(trim(s)) = v_sector_lower
  ) THEN
    RETURN true;
  END IF;

  RETURN false;
END;
$$;

-- Toggle a sector in/out of paused list
CREATE OR REPLACE FUNCTION public.toggle_autopilot_sector_pause(
  _sector text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_current jsonb;
  v_next jsonb;
  v_was_paused boolean;
  v_sector_clean text;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'unauthorized');
  END IF;
  IF _sector IS NULL OR trim(_sector) = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'missing_sector');
  END IF;
  v_sector_clean := trim(_sector);

  -- Ensure config row
  INSERT INTO public.autopilot_config (owner_id) VALUES (v_uid)
  ON CONFLICT (owner_id) DO NOTHING;

  SELECT COALESCE(paused_sectors, '[]'::jsonb) INTO v_current
  FROM public.autopilot_config WHERE owner_id = v_uid;

  v_was_paused := EXISTS (
    SELECT 1 FROM jsonb_array_elements_text(v_current) AS s
    WHERE lower(trim(s)) = lower(v_sector_clean)
  );

  IF v_was_paused THEN
    -- Remove
    SELECT COALESCE(jsonb_agg(s), '[]'::jsonb) INTO v_next
    FROM jsonb_array_elements_text(v_current) AS s
    WHERE lower(trim(s)) <> lower(v_sector_clean);
  ELSE
    v_next := v_current || jsonb_build_array(v_sector_clean);
  END IF;

  UPDATE public.autopilot_config
    SET paused_sectors = v_next, updated_at = now()
  WHERE owner_id = v_uid;

  RETURN jsonb_build_object(
    'success', true,
    'sector', v_sector_clean,
    'is_paused', NOT v_was_paused,
    'paused_sectors', v_next
  );
END;
$$;