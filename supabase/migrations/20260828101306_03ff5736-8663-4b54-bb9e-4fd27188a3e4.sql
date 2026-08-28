DO $$
DECLARE r record; internal boolean; public_read boolean;
BEGIN
  FOR r IN
    SELECT p.oid::regprocedure AS sig, pg_get_function_result(p.oid) AS res, p.proname
    FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.prosecdef
  LOOP
    -- Start from a closed state: no implicit PUBLIC execute grant
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated', r.sig);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', r.sig);

    IF r.res = 'trigger' THEN
      CONTINUE; -- trigger functions run inside the trigger, never via the API
    END IF;

    public_read := r.proname LIKE 'get_public_%'
                   OR r.proname LIKE 'increment_%_view'
                   OR r.proname LIKE 'is_%'
                   OR r.proname = 'has_role';

    internal := r.proname LIKE 'audit_%'
                OR r.proname LIKE 'handle_%'
                OR r.proname IN (
                  'apply_inventory_movement','award_xp','calculate_monthly_bonus',
                  'check_outreach_health','check_overdue_payments','claim_stripe_event',
                  'compute_cost_reconciliation','consume_edge_quota','consume_seller_credits_for',
                  'generate_base_order_commission','grant_partner_demo_credits'
                );

    IF internal THEN
      CONTINUE; -- service_role / cron only
    END IF;

    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated', r.sig);
    IF public_read THEN
      EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO anon', r.sig);
    END IF;
  END LOOP;
END $$;