UPDATE public.sales_agent_config
SET is_active = false, updated_at = now()
WHERE user_id = 'd81cfdd7-3da8-463a-be3a-6e05474ba1ac';