ALTER TABLE public.lead_intelligence_reports
ADD COLUMN IF NOT EXISTS brand_video_frames jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.lead_intelligence_reports.brand_video_frames IS
'Array di URL frame/thumbnail estratti dai video del lead (YouTube/Vimeo/poster) usati come reference image per il mockup AI';