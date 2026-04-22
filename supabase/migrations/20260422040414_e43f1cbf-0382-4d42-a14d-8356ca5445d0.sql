INSERT INTO public.seller_action_costs (action, credit_cost, cost_eur_estimate, label, is_active)
VALUES ('demo_factory_full', 25, 0.50, 'Sito Demo Completo da Mockup', true)
ON CONFLICT (action) DO UPDATE SET
  credit_cost = 25,
  cost_eur_estimate = 0.50,
  label = 'Sito Demo Completo da Mockup',
  is_active = true;