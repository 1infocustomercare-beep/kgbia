
-- 1) demo_sites: drop public credential-exposing policy
DROP POLICY IF EXISTS "Public reads ready demo sites by slug" ON public.demo_sites;

-- 2) seller_custom_previews: drop public broad-read policy, expose via SECURITY DEFINER RPC
DROP POLICY IF EXISTS "public read by slug" ON public.seller_custom_previews;

CREATE OR REPLACE FUNCTION public.get_public_custom_preview(p_slug text)
RETURNS TABLE (preview_html text, generation_status text, lead_name text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT preview_html, generation_status, lead_name
  FROM public.seller_custom_previews
  WHERE public_slug = p_slug
    AND is_published = true
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_custom_preview(text) TO anon, authenticated;

-- 3) gdpr_consents: drop header-based UPDATE policy. Make consents append-only from clients.
DROP POLICY IF EXISTS "Anyone can update own consent by session" ON public.gdpr_consents;

-- 4) push_subscriptions: drop header-based DELETE policy; provide RPC requiring p256dh key proof.
DROP POLICY IF EXISTS "Users delete own push subscription" ON public.push_subscriptions;

CREATE OR REPLACE FUNCTION public.delete_push_subscription(p_endpoint text, p_p256dh text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted int;
BEGIN
  IF p_endpoint IS NULL OR p_p256dh IS NULL OR length(p_p256dh) < 16 THEN
    RETURN false;
  END IF;
  DELETE FROM public.push_subscriptions
  WHERE endpoint = p_endpoint
    AND p256dh = p_p256dh;
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted > 0;
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_push_subscription(text, text) TO anon, authenticated;
