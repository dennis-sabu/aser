-- Safe migration: Add optional WhatsApp contact fields to profiles
-- Target table: public.profiles

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS phone_number text,
  ADD COLUMN IF NOT EXISTS whatsapp_enabled boolean DEFAULT false NOT NULL;

-- Comment for schema documentation
COMMENT ON COLUMN public.profiles.phone_number IS 'Normalized phone number for optional WhatsApp contact';
COMMENT ON COLUMN public.profiles.whatsapp_enabled IS 'Controls whether other students can see WhatsApp contact button';
