-- ════════════════════════════════════════════════════════════════
-- SELLER DEMO VAULT — riutilizzo demo senza spendere crediti
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.seller_demo_vault (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Friendly identity
  display_name text NOT NULL,                  -- "Demo COTE Miami v1" (editabile dal venditore)
  original_lead_name text NOT NULL,            -- nome lead da cui è stata creata
  
  -- Sector & template ground-truth (per matching riutilizzo)
  sector text NOT NULL,                        -- "food", "beauty", ecc.
  sector_label text,                           -- label umana
  sub_sector text,                             -- "pizzeria", "sushi", "yacht"...
  template_variant text NOT NULL,              -- "cote-obsidian", "paperfish-sakura"...
  theme_hint text,                             -- "dark-gold" | "sakura"...
  
  -- Demo URLs
  tenant_id uuid,                              -- companies.id o restaurants.id
  tenant_kind text,                            -- "restaurant" | "company"
  tenant_slug text,
  preview_url text NOT NULL,                   -- /r/slug oppure /b/slug oppure /demo/slug
  admin_url text NOT NULL,                     -- /demo-admin/slug?variant=...
  magic_link text,
  admin_email text,
  admin_password text,                         -- credenziali demo (solo riutilizzo interno)
  
  -- Lead snapshot (per ricreare contesto)
  lead_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,   -- {name, phone, email, website, instagram, full_address, city, ...}
  
  -- Brand & content snapshot (palette, hero, immagini, menu generato)
  brand_payload jsonb NOT NULL DEFAULT '{}'::jsonb,   -- {tagline, description, palette, menuCount, ...}
  images_payload jsonb DEFAULT '{}'::jsonb,           -- {hero, gallery[], logo, totalReal}
  outreach_payload jsonb DEFAULT '{}'::jsonb,         -- {whatsappMessage, callScript, objections}
  full_result jsonb DEFAULT '{}'::jsonb,              -- intero DemoFactoryResult per re-render
  
  -- Vault management
  is_favorite boolean NOT NULL DEFAULT false,
  is_archived boolean NOT NULL DEFAULT false,
  reuse_count integer NOT NULL DEFAULT 0,
  last_reused_at timestamptz,
  last_reused_for_lead text,                   -- nome ultimo lead per cui è stata riusata
  tags text[] DEFAULT '{}',
  
  notes text,
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indici
CREATE INDEX IF NOT EXISTS idx_seller_demo_vault_owner ON public.seller_demo_vault(owner_id);
CREATE INDEX IF NOT EXISTS idx_seller_demo_vault_owner_created ON public.seller_demo_vault(owner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_seller_demo_vault_sector ON public.seller_demo_vault(owner_id, sector, sub_sector);
CREATE INDEX IF NOT EXISTS idx_seller_demo_vault_variant ON public.seller_demo_vault(owner_id, template_variant);
CREATE INDEX IF NOT EXISTS idx_seller_demo_vault_favorite ON public.seller_demo_vault(owner_id, is_favorite) WHERE is_favorite = true;

-- updated_at trigger
DROP TRIGGER IF EXISTS trg_seller_demo_vault_updated_at ON public.seller_demo_vault;
CREATE TRIGGER trg_seller_demo_vault_updated_at
  BEFORE UPDATE ON public.seller_demo_vault
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.seller_demo_vault ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view their vault"
  ON public.seller_demo_vault FOR SELECT
  USING (auth.uid() = owner_id OR public.is_super_admin());

CREATE POLICY "Owners can insert in their vault"
  ON public.seller_demo_vault FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their vault"
  ON public.seller_demo_vault FOR UPDATE
  USING (auth.uid() = owner_id OR public.is_super_admin());

CREATE POLICY "Owners can delete their vault"
  ON public.seller_demo_vault FOR DELETE
  USING (auth.uid() = owner_id OR public.is_super_admin());

-- ════════════════════════════════════════════════════════════════
-- COSTI: registriamo l'azione di riutilizzo (gratis = 0 crediti)
-- ════════════════════════════════════════════════════════════════
INSERT INTO public.seller_action_costs (action, label, credit_cost, cost_eur_estimate, description, is_active)
VALUES ('reuse_demo_from_vault', 'Riutilizzo Demo (Vault)', 0, 0.0000, 'Riutilizzo demo già generata su nuovo lead — gratis', true)
ON CONFLICT (action) DO NOTHING;

-- ════════════════════════════════════════════════════════════════
-- RPC: incrementa reuse_count e last_reused_at in modo atomico
-- ════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.touch_demo_vault_reuse(p_vault_id uuid, p_lead_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.seller_demo_vault
  SET reuse_count = reuse_count + 1,
      last_reused_at = now(),
      last_reused_for_lead = p_lead_name,
      updated_at = now()
  WHERE id = p_vault_id
    AND (owner_id = auth.uid() OR public.is_super_admin());
END;
$$;