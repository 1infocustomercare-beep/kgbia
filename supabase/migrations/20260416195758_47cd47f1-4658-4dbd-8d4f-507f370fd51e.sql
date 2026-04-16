
-- 1) Migra stati legacy a stati pipeline canonici
UPDATE public.leads SET status = 'negotiating' WHERE status = 'qualified';
UPDATE public.leads SET status = 'won', outcome = 'won' WHERE status = 'converted';

-- 2) Rendi il trigger di validazione retro-compatibile (mappa alias legacy)
CREATE OR REPLACE FUNCTION public.validate_lead_outcome()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Backward-compatible aliases for legacy data
  IF NEW.status = 'qualified' THEN NEW.status := 'negotiating'; END IF;
  IF NEW.status = 'converted' THEN NEW.status := 'won'; END IF;

  IF NEW.outcome NOT IN ('in_progress', 'won', 'lost', 'paused') THEN
    NEW.outcome := 'in_progress';
  END IF;
  IF NEW.status NOT IN ('new', 'contacted', 'replied', 'demo_booked', 'negotiating', 'won', 'lost') THEN
    NEW.status := 'new';
  END IF;

  -- Auto-sync outcome with terminal states
  IF NEW.status = 'won' THEN NEW.outcome := 'won'; END IF;
  IF NEW.status = 'lost' THEN NEW.outcome := 'lost'; END IF;

  RETURN NEW;
END;
$function$;
