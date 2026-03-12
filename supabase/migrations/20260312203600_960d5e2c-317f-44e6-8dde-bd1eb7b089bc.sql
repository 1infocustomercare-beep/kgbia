-- Add restaurant_admin role to kevin so he can access /dashboard
INSERT INTO public.user_roles (user_id, role)
VALUES ('1da0ee45-094a-4728-996e-6143d55a7f9d', 'restaurant_admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Update profile name  
UPDATE public.profiles 
SET full_name = 'Kevin Bernardini'
WHERE user_id = '1da0ee45-094a-4728-996e-6143d55a7f9d';