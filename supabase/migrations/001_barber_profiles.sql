-- ══════════════════════════════════════════════════════════════
-- MIGRACIÓN 001: barber_profiles
-- Perfil del barbero vinculado a auth.users
-- ══════════════════════════════════════════════════════════════

CREATE TABLE public.barber_profiles (
  id           UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT        NOT NULL,
  role         TEXT        NOT NULL CHECK (role IN ('admin', 'barber')) DEFAULT 'barber',
  avatar_url   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.barber_profiles ENABLE ROW LEVEL SECURITY;

-- Cada barbero ve solo su propio perfil
CREATE POLICY "barber_select_own" ON public.barber_profiles
  FOR SELECT USING (auth.uid() = id);

-- Cada barbero puede actualizar solo su propio perfil
CREATE POLICY "barber_update_own" ON public.barber_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Solo admin puede insertar nuevos perfiles de barbero
CREATE POLICY "admin_insert" ON public.barber_profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.barber_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Función reutilizable para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER barber_profiles_updated_at
  BEFORE UPDATE ON public.barber_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
