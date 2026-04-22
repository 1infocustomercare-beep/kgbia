DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'seller_demo_vault'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.seller_demo_vault;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'seller_mockup_suites'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.seller_mockup_suites;
  END IF;
END $$;

ALTER TABLE public.seller_demo_vault REPLICA IDENTITY FULL;
ALTER TABLE public.seller_mockup_suites REPLICA IDENTITY FULL;