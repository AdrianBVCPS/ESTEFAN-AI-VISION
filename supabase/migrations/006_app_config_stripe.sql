-- ══════════════════════════════════════════════════════════════
-- MIGRACIÓN 006: parámetros de configuración para Stripe y app
-- ══════════════════════════════════════════════════════════════

INSERT INTO public.app_config (key, value) VALUES
  ('daily_limit_mode_a',    '20'::jsonb),
  ('daily_limit_mode_b',    '60'::jsonb),
  ('subscription_price_eur','12.00'::jsonb),
  ('trial_days',            '15'::jsonb),
  ('qr_expiry_minutes',     '10'::jsonb),
  ('booksy_url',            '"https://booksy.com/es-es/dl/show-business/123965"'::jsonb),
  ('whatsapp_share_text',   '"Mira mi nuevo look con Estefan Acosta Barber Shop 💈"'::jsonb),
  ('app_name',              '"Estefan AI Vision"'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
