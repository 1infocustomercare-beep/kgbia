ALTER TABLE public.seller_custom_previews
  ADD COLUMN IF NOT EXISTS is_favorite boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS saved_to_portfolio boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS portfolio_label text,
  ADD COLUMN IF NOT EXISTS portfolio_notes text,
  ADD COLUMN IF NOT EXISTS saved_to_portfolio_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_custom_previews_portfolio
  ON public.seller_custom_previews(owner_id, saved_to_portfolio)
  WHERE saved_to_portfolio = true;

CREATE INDEX IF NOT EXISTS idx_custom_previews_favorite
  ON public.seller_custom_previews(owner_id, is_favorite)
  WHERE is_favorite = true;

COMMENT ON COLUMN public.seller_custom_previews.is_favorite IS 'Preview marcata come preferita dal venditore';
COMMENT ON COLUMN public.seller_custom_previews.saved_to_portfolio IS 'Preview salvata nel Portfolio Partner come riferimento permanente';
COMMENT ON COLUMN public.seller_custom_previews.portfolio_label IS 'Etichetta personalizzata data dal venditore al momento del salvataggio';
COMMENT ON COLUMN public.seller_custom_previews.portfolio_notes IS 'Note personali del venditore per ricordare il motivo del salvataggio';