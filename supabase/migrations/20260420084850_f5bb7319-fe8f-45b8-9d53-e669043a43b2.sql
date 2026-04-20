-- Diagnostica: attivo l'agente Aurora di Kevin per validare il nuovo pipeline HTML
UPDATE public.sales_agent_config
SET is_active = true,
    autonomy_mode = 'semi_auto',
    updated_at = now()
WHERE user_id = 'd81cfdd7-3da8-463a-be3a-6e05474ba1ac';

-- Se non esiste, lo creo
INSERT INTO public.sales_agent_config (user_id, is_active, autonomy_mode)
SELECT 'd81cfdd7-3da8-463a-be3a-6e05474ba1ac', true, 'semi_auto'
WHERE NOT EXISTS (
  SELECT 1 FROM public.sales_agent_config WHERE user_id = 'd81cfdd7-3da8-463a-be3a-6e05474ba1ac'
);