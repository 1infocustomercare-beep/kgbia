DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT p.oid::regprocedure AS sig, pg_get_function_result(p.oid) AS res, p.proname
    FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.prosecdef
  LOOP
    -- Trigger functions are never meant to be called through the API
    IF r.res = 'trigger' THEN
      EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM anon, authenticated', r.sig);
      CONTINUE;
    END IF;

    -- Keep anonymous access only for the explicitly public read helpers
    -- and for helpers used inside RLS policy expressions.
    IF r.proname LIKE 'get_public_%'
       OR r.proname LIKE 'increment_%_view'
       OR r.proname LIKE 'is_%'
       OR r.proname = 'has_role'
    THEN
      CONTINUE;
    END IF;

    EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM anon', r.sig);
  END LOOP;
END $$;