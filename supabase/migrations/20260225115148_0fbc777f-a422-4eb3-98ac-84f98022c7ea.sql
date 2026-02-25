
-- Add notification tracking columns to restaurant_payments
ALTER TABLE public.restaurant_payments
ADD COLUMN IF NOT EXISTS warning_sent_at timestamp with time zone DEFAULT NULL,
ADD COLUMN IF NOT EXISTS block_notice_sent_at timestamp with time zone DEFAULT NULL,
ADD COLUMN IF NOT EXISTS reactivation_sent_at timestamp with time zone DEFAULT NULL;
