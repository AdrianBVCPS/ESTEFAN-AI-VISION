-- ══════════════════════════════════════════════════════════════
-- SEED: configuración inicial de la aplicación
-- NOTA: Los usuarios (Estefan admin + Guillermo barber) se crean
--       manualmente en el Dashboard de Supabase Auth, luego sus
--       IDs se insertan en barber_profiles desde allí o via script.
-- ══════════════════════════════════════════════════════════════

INSERT INTO public.app_config (key, value) VALUES
  ('daily_limit',   '50'::jsonb),
  ('logo_enabled',  'true'::jsonb),
  ('app_version',   '"1.0.0"'::jsonb)
ON CONFLICT (key) DO NOTHING;
