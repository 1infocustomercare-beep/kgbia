-- Tabella per persistenza Branding Kit settings utente (Mockup Suite Generator)
-- Salva: brand_locked, palette colore selezionata e font pair scelto
CREATE TABLE IF NOT EXISTS public.user_branding_kit_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  brand_locked BOOLEAN NOT NULL DEFAULT false,
  primary_color TEXT,
  font_pair_key TEXT NOT NULL DEFAULT 'template',
  font_head TEXT,
  font_body TEXT,
  google_fonts_href TEXT,
  extra JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_branding_kit_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own branding kit settings"
  ON public.user_branding_kit_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own branding kit settings"
  ON public.user_branding_kit_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own branding kit settings"
  ON public.user_branding_kit_settings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own branding kit settings"
  ON public.user_branding_kit_settings FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_user_branding_kit_settings_updated_at
  BEFORE UPDATE ON public.user_branding_kit_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_user_branding_kit_settings_user_id
  ON public.user_branding_kit_settings(user_id);