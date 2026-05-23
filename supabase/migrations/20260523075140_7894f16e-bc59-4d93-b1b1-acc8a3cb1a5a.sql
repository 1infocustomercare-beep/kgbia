-- ============================================================
-- Empire Warehouse Module (food/restaurant)
-- ============================================================

-- 1) SUPPLIERS
CREATE TABLE IF NOT EXISTS public.suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name text NOT NULL,
  contact_name text,
  email text,
  phone text,
  address text,
  lead_time_days integer NOT NULL DEFAULT 2 CHECK (lead_time_days >= 0 AND lead_time_days <= 90),
  notes text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_suppliers_restaurant ON public.suppliers(restaurant_id);

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "suppliers_select" ON public.suppliers;
DROP POLICY IF EXISTS "suppliers_modify" ON public.suppliers;
CREATE POLICY "suppliers_select" ON public.suppliers FOR SELECT
  USING (public.is_super_admin() OR public.is_restaurant_owner(restaurant_id) OR public.is_restaurant_member(restaurant_id));
CREATE POLICY "suppliers_modify" ON public.suppliers FOR ALL
  USING (public.is_super_admin() OR public.is_restaurant_owner(restaurant_id) OR public.is_restaurant_member(restaurant_id))
  WITH CHECK (public.is_super_admin() OR public.is_restaurant_owner(restaurant_id) OR public.is_restaurant_member(restaurant_id));

CREATE TRIGGER suppliers_touch BEFORE UPDATE ON public.suppliers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2) INVENTORY ITEMS
CREATE TABLE IF NOT EXISTS public.inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  supplier_id uuid REFERENCES public.suppliers(id) ON DELETE SET NULL,
  sku text,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Generale',
  unit text NOT NULL DEFAULT 'pz', -- pz, kg, g, l, ml, ecc.
  stock_qty numeric(12,3) NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
  min_qty numeric(12,3) NOT NULL DEFAULT 0 CHECK (min_qty >= 0),
  par_qty numeric(12,3) NOT NULL DEFAULT 0 CHECK (par_qty >= 0),
  cost_per_unit numeric(12,4) NOT NULL DEFAULT 0 CHECK (cost_per_unit >= 0),
  last_restocked_at timestamptz,
  notes text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_inventory_items_restaurant ON public.inventory_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_supplier ON public.inventory_items(supplier_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_inventory_items_sku ON public.inventory_items(restaurant_id, sku) WHERE sku IS NOT NULL;

ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "inventory_items_select" ON public.inventory_items;
DROP POLICY IF EXISTS "inventory_items_modify" ON public.inventory_items;
CREATE POLICY "inventory_items_select" ON public.inventory_items FOR SELECT
  USING (public.is_super_admin() OR public.is_restaurant_owner(restaurant_id) OR public.is_restaurant_member(restaurant_id));
CREATE POLICY "inventory_items_modify" ON public.inventory_items FOR ALL
  USING (public.is_super_admin() OR public.is_restaurant_owner(restaurant_id) OR public.is_restaurant_member(restaurant_id))
  WITH CHECK (public.is_super_admin() OR public.is_restaurant_owner(restaurant_id) OR public.is_restaurant_member(restaurant_id));

CREATE TRIGGER inventory_items_touch BEFORE UPDATE ON public.inventory_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) INVENTORY MOVEMENTS
CREATE TABLE IF NOT EXISTS public.inventory_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  item_id uuid NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
  movement_type text NOT NULL CHECK (movement_type IN ('in','out','adjust','waste')),
  quantity numeric(12,3) NOT NULL CHECK (quantity > 0),
  unit_cost numeric(12,4),
  reason text,
  reference text, -- es. nr. fattura, ordine
  performed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_item ON public.inventory_movements(item_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_restaurant ON public.inventory_movements(restaurant_id, created_at DESC);

ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "inventory_movements_select" ON public.inventory_movements;
DROP POLICY IF EXISTS "inventory_movements_insert" ON public.inventory_movements;
CREATE POLICY "inventory_movements_select" ON public.inventory_movements FOR SELECT
  USING (public.is_super_admin() OR public.is_restaurant_owner(restaurant_id) OR public.is_restaurant_member(restaurant_id));
CREATE POLICY "inventory_movements_insert" ON public.inventory_movements FOR INSERT
  WITH CHECK (public.is_super_admin() OR public.is_restaurant_owner(restaurant_id) OR public.is_restaurant_member(restaurant_id));
-- intentionally no UPDATE/DELETE: movements are immutable ledger entries

-- Trigger: apply movement to stock & restock timestamp
CREATE OR REPLACE FUNCTION public.apply_inventory_movement()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_delta numeric(12,3);
BEGIN
  IF NEW.movement_type = 'in' THEN
    v_delta := NEW.quantity;
  ELSIF NEW.movement_type IN ('out','waste') THEN
    v_delta := -NEW.quantity;
  ELSIF NEW.movement_type = 'adjust' THEN
    -- adjust = set absolute stock; use NEW.quantity as new stock value
    UPDATE public.inventory_items
       SET stock_qty = NEW.quantity, updated_at = now()
     WHERE id = NEW.item_id;
    RETURN NEW;
  END IF;

  UPDATE public.inventory_items
     SET stock_qty = GREATEST(0, stock_qty + v_delta),
         last_restocked_at = CASE WHEN NEW.movement_type = 'in' THEN now() ELSE last_restocked_at END,
         updated_at = now()
   WHERE id = NEW.item_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS inventory_movements_apply ON public.inventory_movements;
CREATE TRIGGER inventory_movements_apply AFTER INSERT ON public.inventory_movements
  FOR EACH ROW EXECUTE FUNCTION public.apply_inventory_movement();

-- 4) RECIPES
CREATE TABLE IF NOT EXISTS public.recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  menu_item_id uuid REFERENCES public.menu_items(id) ON DELETE SET NULL,
  name text NOT NULL,
  yield_qty numeric(10,2) NOT NULL DEFAULT 1 CHECK (yield_qty > 0),
  yield_unit text NOT NULL DEFAULT 'porzione',
  notes text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_recipes_restaurant ON public.recipes(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_recipes_menu_item ON public.recipes(menu_item_id);

ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "recipes_select" ON public.recipes;
DROP POLICY IF EXISTS "recipes_modify" ON public.recipes;
CREATE POLICY "recipes_select" ON public.recipes FOR SELECT
  USING (public.is_super_admin() OR public.is_restaurant_owner(restaurant_id) OR public.is_restaurant_member(restaurant_id));
CREATE POLICY "recipes_modify" ON public.recipes FOR ALL
  USING (public.is_super_admin() OR public.is_restaurant_owner(restaurant_id) OR public.is_restaurant_member(restaurant_id))
  WITH CHECK (public.is_super_admin() OR public.is_restaurant_owner(restaurant_id) OR public.is_restaurant_member(restaurant_id));

CREATE TRIGGER recipes_touch BEFORE UPDATE ON public.recipes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5) RECIPE INGREDIENTS
CREATE TABLE IF NOT EXISTS public.recipe_ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  item_id uuid NOT NULL REFERENCES public.inventory_items(id) ON DELETE RESTRICT,
  quantity numeric(12,3) NOT NULL CHECK (quantity > 0),
  unit text NOT NULL DEFAULT 'pz',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe ON public.recipe_ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_item ON public.recipe_ingredients(item_id);

ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "recipe_ingredients_select" ON public.recipe_ingredients;
DROP POLICY IF EXISTS "recipe_ingredients_modify" ON public.recipe_ingredients;
CREATE POLICY "recipe_ingredients_select" ON public.recipe_ingredients FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.recipes r WHERE r.id = recipe_id
    AND (public.is_super_admin() OR public.is_restaurant_owner(r.restaurant_id) OR public.is_restaurant_member(r.restaurant_id))));
CREATE POLICY "recipe_ingredients_modify" ON public.recipe_ingredients FOR ALL
  USING (EXISTS (SELECT 1 FROM public.recipes r WHERE r.id = recipe_id
    AND (public.is_super_admin() OR public.is_restaurant_owner(r.restaurant_id) OR public.is_restaurant_member(r.restaurant_id))))
  WITH CHECK (EXISTS (SELECT 1 FROM public.recipes r WHERE r.id = recipe_id
    AND (public.is_super_admin() OR public.is_restaurant_owner(r.restaurant_id) OR public.is_restaurant_member(r.restaurant_id))));

-- 6) RESTOCK SUGGESTIONS VIEW
CREATE OR REPLACE VIEW public.restock_suggestions
WITH (security_invoker=on) AS
SELECT
  i.id AS item_id,
  i.restaurant_id,
  i.name,
  i.sku,
  i.category,
  i.unit,
  i.stock_qty,
  i.min_qty,
  i.par_qty,
  GREATEST(COALESCE(i.par_qty,0) - COALESCE(i.stock_qty,0), COALESCE(i.min_qty,0) - COALESCE(i.stock_qty,0)) AS suggested_order_qty,
  i.cost_per_unit,
  GREATEST(COALESCE(i.par_qty,0) - COALESCE(i.stock_qty,0), COALESCE(i.min_qty,0) - COALESCE(i.stock_qty,0)) * COALESCE(i.cost_per_unit,0) AS suggested_order_cost,
  i.last_restocked_at,
  s.id AS supplier_id,
  s.name AS supplier_name,
  s.email AS supplier_email,
  s.phone AS supplier_phone,
  s.lead_time_days,
  CASE
    WHEN i.stock_qty <= 0 THEN 'out_of_stock'
    WHEN i.stock_qty < i.min_qty THEN 'below_min'
    WHEN i.stock_qty < i.par_qty THEN 'below_par'
    ELSE 'ok'
  END AS urgency
FROM public.inventory_items i
LEFT JOIN public.suppliers s ON s.id = i.supplier_id
WHERE i.is_active = true
  AND (i.stock_qty < i.par_qty OR i.stock_qty < i.min_qty);

GRANT SELECT ON public.restock_suggestions TO authenticated;