-- 1) Aggiungi colonna category al listino azioni venditore
ALTER TABLE public.seller_action_costs
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'ai';

-- 2) Estendi trigger audit seller_action_costs per tracciare label, description, category
CREATE OR REPLACE FUNCTION public.audit_seller_action_costs()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.credit_cost IS DISTINCT FROM OLD.credit_cost THEN
    INSERT INTO public.cost_catalog_audit(table_name,row_id,action_code,field_changed,old_value,new_value,changed_by)
    VALUES('seller_action_costs',NEW.id,NEW.action,'credit_cost',OLD.credit_cost::text,NEW.credit_cost::text,auth.uid());
  END IF;
  IF NEW.cost_eur_estimate IS DISTINCT FROM OLD.cost_eur_estimate THEN
    INSERT INTO public.cost_catalog_audit(table_name,row_id,action_code,field_changed,old_value,new_value,changed_by)
    VALUES('seller_action_costs',NEW.id,NEW.action,'cost_eur_estimate',OLD.cost_eur_estimate::text,NEW.cost_eur_estimate::text,auth.uid());
  END IF;
  IF NEW.is_active IS DISTINCT FROM OLD.is_active THEN
    INSERT INTO public.cost_catalog_audit(table_name,row_id,action_code,field_changed,old_value,new_value,changed_by)
    VALUES('seller_action_costs',NEW.id,NEW.action,'is_active',OLD.is_active::text,NEW.is_active::text,auth.uid());
  END IF;
  IF NEW.label IS DISTINCT FROM OLD.label THEN
    INSERT INTO public.cost_catalog_audit(table_name,row_id,action_code,field_changed,old_value,new_value,changed_by)
    VALUES('seller_action_costs',NEW.id,NEW.action,'label',OLD.label,NEW.label,auth.uid());
  END IF;
  IF NEW.description IS DISTINCT FROM OLD.description THEN
    INSERT INTO public.cost_catalog_audit(table_name,row_id,action_code,field_changed,old_value,new_value,changed_by)
    VALUES('seller_action_costs',NEW.id,NEW.action,'description',OLD.description,NEW.description,auth.uid());
  END IF;
  IF NEW.category IS DISTINCT FROM OLD.category THEN
    INSERT INTO public.cost_catalog_audit(table_name,row_id,action_code,field_changed,old_value,new_value,changed_by)
    VALUES('seller_action_costs',NEW.id,NEW.action,'category',OLD.category,NEW.category,auth.uid());
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 3) Estendi trigger audit infrastructure_costs per tracciare label, category, notes, provider, unit, cost_model
CREATE OR REPLACE FUNCTION public.audit_infrastructure_costs()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.unit_cost_eur IS DISTINCT FROM OLD.unit_cost_eur THEN
    INSERT INTO public.cost_catalog_audit(table_name,row_id,action_code,field_changed,old_value,new_value,changed_by)
    VALUES('infrastructure_costs',NEW.id,NEW.code,'unit_cost_eur',OLD.unit_cost_eur::text,NEW.unit_cost_eur::text,auth.uid());
  END IF;
  IF NEW.monthly_estimate_eur IS DISTINCT FROM OLD.monthly_estimate_eur THEN
    INSERT INTO public.cost_catalog_audit(table_name,row_id,action_code,field_changed,old_value,new_value,changed_by)
    VALUES('infrastructure_costs',NEW.id,NEW.code,'monthly_estimate_eur',OLD.monthly_estimate_eur::text,NEW.monthly_estimate_eur::text,auth.uid());
  END IF;
  IF NEW.is_active IS DISTINCT FROM OLD.is_active THEN
    INSERT INTO public.cost_catalog_audit(table_name,row_id,action_code,field_changed,old_value,new_value,changed_by)
    VALUES('infrastructure_costs',NEW.id,NEW.code,'is_active',OLD.is_active::text,NEW.is_active::text,auth.uid());
  END IF;
  IF NEW.label IS DISTINCT FROM OLD.label THEN
    INSERT INTO public.cost_catalog_audit(table_name,row_id,action_code,field_changed,old_value,new_value,changed_by)
    VALUES('infrastructure_costs',NEW.id,NEW.code,'label',OLD.label,NEW.label,auth.uid());
  END IF;
  IF NEW.category IS DISTINCT FROM OLD.category THEN
    INSERT INTO public.cost_catalog_audit(table_name,row_id,action_code,field_changed,old_value,new_value,changed_by)
    VALUES('infrastructure_costs',NEW.id,NEW.code,'category',OLD.category,NEW.category,auth.uid());
  END IF;
  IF NEW.notes IS DISTINCT FROM OLD.notes THEN
    INSERT INTO public.cost_catalog_audit(table_name,row_id,action_code,field_changed,old_value,new_value,changed_by)
    VALUES('infrastructure_costs',NEW.id,NEW.code,'notes',OLD.notes,NEW.notes,auth.uid());
  END IF;
  IF NEW.provider IS DISTINCT FROM OLD.provider THEN
    INSERT INTO public.cost_catalog_audit(table_name,row_id,action_code,field_changed,old_value,new_value,changed_by)
    VALUES('infrastructure_costs',NEW.id,NEW.code,'provider',OLD.provider,NEW.provider,auth.uid());
  END IF;
  IF NEW.unit IS DISTINCT FROM OLD.unit THEN
    INSERT INTO public.cost_catalog_audit(table_name,row_id,action_code,field_changed,old_value,new_value,changed_by)
    VALUES('infrastructure_costs',NEW.id,NEW.code,'unit',OLD.unit,NEW.unit,auth.uid());
  END IF;
  IF NEW.cost_model IS DISTINCT FROM OLD.cost_model THEN
    INSERT INTO public.cost_catalog_audit(table_name,row_id,action_code,field_changed,old_value,new_value,changed_by)
    VALUES('infrastructure_costs',NEW.id,NEW.code,'cost_model',OLD.cost_model,NEW.cost_model,auth.uid());
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 4) Audit immutabile: blocca UPDATE/DELETE su cost_catalog_audit
DROP POLICY IF EXISTS "Audit append-only no update" ON public.cost_catalog_audit;
DROP POLICY IF EXISTS "Audit append-only no delete" ON public.cost_catalog_audit;

CREATE POLICY "Audit append-only no update"
  ON public.cost_catalog_audit
  FOR UPDATE
  USING (false);

CREATE POLICY "Audit append-only no delete"
  ON public.cost_catalog_audit
  FOR DELETE
  USING (false);