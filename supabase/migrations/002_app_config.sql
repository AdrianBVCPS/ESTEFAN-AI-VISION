-- ══════════════════════════════════════════════════════════════
-- MIGRACIÓN 002: app_config
-- Configuración clave-valor de la aplicación
-- ══════════════════════════════════════════════════════════════

CREATE TABLE public.app_config (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  key        TEXT        UNIQUE NOT NULL,
  value      JSONB       NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

-- Cualquier usuario autenticado puede leer la configuración
-- Nota: auth.role() está deprecado — usar auth.uid() IS NOT NULL
CREATE POLICY "authenticated_select" ON public.app_config
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Solo admin puede modificar la configuración
CREATE POLICY "admin_update" ON public.app_config
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.barber_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE TRIGGER app_config_updated_at
  BEFORE UPDATE ON public.app_config
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
