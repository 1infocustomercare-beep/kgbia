
-- ============================================
-- EMPIRE RESTAURANT SUITE - DATABASE SCHEMA
-- ============================================

-- 1. ROLE ENUM
CREATE TYPE public.app_role AS ENUM ('super_admin', 'staff', 'restaurant_admin', 'customer');

-- 2. USER ROLES TABLE
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. PROFILES TABLE
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. RESTAURANTS TABLE (Tenants)
CREATE TABLE public.restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#C8963E',
  tagline TEXT DEFAULT 'Benvenuti nel nostro ristorante',
  address TEXT,
  phone TEXT,
  city TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  setup_paid BOOLEAN NOT NULL DEFAULT false,
  stripe_account_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

-- 5. MENU ITEMS
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'Altro',
  allergens TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_popular BOOLEAN NOT NULL DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- 6. ORDERS
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  order_type TEXT NOT NULL DEFAULT 'takeaway' CHECK (order_type IN ('delivery', 'takeaway', 'table')),
  table_number INT,
  items JSONB NOT NULL DEFAULT '[]',
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'delivered', 'cancelled')),
  notes TEXT,
  stripe_payment_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 7. REVIEWS
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 8. AI TOKENS
CREATE TABLE public.ai_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE NOT NULL UNIQUE,
  balance INT NOT NULL DEFAULT 5,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ai_tokens ENABLE ROW LEVEL SECURITY;

-- 9. AI TOKEN HISTORY
CREATE TABLE public.ai_token_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL,
  tokens INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ai_token_history ENABLE ROW LEVEL SECURITY;

-- 10. FISCO CONFIGS (BYOK)
CREATE TABLE public.fisco_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE NOT NULL UNIQUE,
  provider TEXT NOT NULL DEFAULT 'Scontrino.it',
  api_key_encrypted TEXT,
  configured BOOLEAN NOT NULL DEFAULT false,
  configured_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.fisco_configs ENABLE ROW LEVEL SECURITY;

-- 11. RESTAURANT MEMBERSHIPS
CREATE TABLE public.restaurant_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'restaurant_admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (restaurant_id, user_id)
);
ALTER TABLE public.restaurant_memberships ENABLE ROW LEVEL SECURITY;

-- 12. CHAT MESSAGES (Private Connect)
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  sender_name TEXT,
  message TEXT NOT NULL,
  is_from_restaurant BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- HELPER FUNCTIONS (SECURITY DEFINER)
-- ============================================

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'super_admin');
$$;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'staff');
$$;

CREATE OR REPLACE FUNCTION public.is_restaurant_member(_restaurant_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.restaurant_memberships
    WHERE restaurant_id = _restaurant_id AND user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.is_restaurant_owner(_restaurant_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.restaurants
    WHERE id = _restaurant_id AND owner_id = auth.uid()
  );
$$;

-- ============================================
-- RLS POLICIES
-- ============================================

-- USER ROLES
CREATE POLICY "Super admins manage all roles" ON public.user_roles FOR ALL USING (public.is_super_admin());
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- PROFILES
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Super admins manage profiles" ON public.profiles FOR ALL USING (public.is_super_admin());

-- RESTAURANTS
CREATE POLICY "Anyone can read active restaurants" ON public.restaurants FOR SELECT USING (is_active = true OR public.is_super_admin() OR public.is_staff() OR public.is_restaurant_owner(id));
CREATE POLICY "Super admins manage restaurants" ON public.restaurants FOR ALL USING (public.is_super_admin());
CREATE POLICY "Owners update own restaurant" ON public.restaurants FOR UPDATE USING (public.is_restaurant_owner(id));
CREATE POLICY "Authenticated users can create restaurants" ON public.restaurants FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- MENU ITEMS
CREATE POLICY "Public read active menu items" ON public.menu_items FOR SELECT USING (
  is_active = true OR public.is_super_admin() OR public.is_restaurant_member(restaurant_id) OR public.is_restaurant_owner(restaurant_id)
);
CREATE POLICY "Owners/admins manage menu items" ON public.menu_items FOR ALL USING (
  public.is_super_admin() OR public.is_restaurant_member(restaurant_id) OR public.is_restaurant_owner(restaurant_id)
);

-- ORDERS
CREATE POLICY "Restaurant sees own orders" ON public.orders FOR SELECT USING (
  public.is_super_admin() OR public.is_restaurant_member(restaurant_id) OR public.is_restaurant_owner(restaurant_id) OR customer_id = auth.uid()
);
CREATE POLICY "Customers create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Restaurant manages orders" ON public.orders FOR UPDATE USING (
  public.is_super_admin() OR public.is_restaurant_member(restaurant_id) OR public.is_restaurant_owner(restaurant_id)
);

-- REVIEWS
CREATE POLICY "Anyone reads public reviews" ON public.reviews FOR SELECT USING (
  is_public = true OR public.is_super_admin() OR public.is_restaurant_member(restaurant_id) OR public.is_restaurant_owner(restaurant_id) OR customer_id = auth.uid()
);
CREATE POLICY "Customers create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Restaurant manages reviews" ON public.reviews FOR UPDATE USING (
  public.is_super_admin() OR public.is_restaurant_owner(restaurant_id)
);

-- AI TOKENS
CREATE POLICY "Restaurant manages own tokens" ON public.ai_tokens FOR ALL USING (
  public.is_super_admin() OR public.is_restaurant_member(restaurant_id) OR public.is_restaurant_owner(restaurant_id)
);

-- AI TOKEN HISTORY
CREATE POLICY "Restaurant reads own token history" ON public.ai_token_history FOR SELECT USING (
  public.is_super_admin() OR public.is_restaurant_member(restaurant_id) OR public.is_restaurant_owner(restaurant_id)
);
CREATE POLICY "System inserts token history" ON public.ai_token_history FOR INSERT WITH CHECK (
  public.is_super_admin() OR public.is_restaurant_member(restaurant_id) OR public.is_restaurant_owner(restaurant_id)
);

-- FISCO CONFIGS
CREATE POLICY "Staff and super admin manage fisco" ON public.fisco_configs FOR ALL USING (
  public.is_super_admin() OR public.is_staff()
);
CREATE POLICY "Restaurant reads own fisco" ON public.fisco_configs FOR SELECT USING (
  public.is_restaurant_owner(restaurant_id)
);

-- RESTAURANT MEMBERSHIPS
CREATE POLICY "Super admin manages memberships" ON public.restaurant_memberships FOR ALL USING (public.is_super_admin());
CREATE POLICY "Members read own membership" ON public.restaurant_memberships FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Owners manage own restaurant memberships" ON public.restaurant_memberships FOR ALL USING (public.is_restaurant_owner(restaurant_id));

-- CHAT MESSAGES
CREATE POLICY "Chat participants read messages" ON public.chat_messages FOR SELECT USING (
  public.is_super_admin() OR public.is_restaurant_member(restaurant_id) OR public.is_restaurant_owner(restaurant_id) OR sender_id = auth.uid()
);
CREATE POLICY "Authenticated users send messages" ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- ============================================
-- TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON public.restaurants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-set review visibility based on rating
CREATE OR REPLACE FUNCTION public.auto_set_review_visibility()
RETURNS TRIGGER AS $$
BEGIN
  NEW.is_public = (NEW.rating >= 4);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER set_review_visibility
  BEFORE INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.auto_set_review_visibility();

-- Auto-create AI tokens and fisco config for new restaurant
CREATE OR REPLACE FUNCTION public.handle_new_restaurant()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.ai_tokens (restaurant_id, balance) VALUES (NEW.id, 5);
  INSERT INTO public.fisco_configs (restaurant_id) VALUES (NEW.id);
  INSERT INTO public.restaurant_memberships (restaurant_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'restaurant_admin');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_restaurant_created
  AFTER INSERT ON public.restaurants
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_restaurant();

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
