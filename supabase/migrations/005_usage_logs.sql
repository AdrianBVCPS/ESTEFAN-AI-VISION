-- ══════════════════════════════════════════════════════════════
-- MIGRACIÓN 005: tabla usage_logs para analytics de uso de IA
-- ══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.usage_logs (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode       TEXT        NOT NULL CHECK (mode IN ('mode_a', 'mode_b')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para consultas rápidas por fecha y usuario
CREATE INDEX IF NOT EXISTS idx_usage_logs_created ON public.usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user    ON public.usage_logs(user_id);

ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

-- Cada barbero ve solo sus propios registros de uso
CREATE POLICY "users_select_own_logs" ON public.usage_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Superadmin ve todos los registros (para analytics)
CREATE POLICY "superadmin_select_all_logs" ON public.usage_logs
  FOR SELECT USING (public.is_superadmin());

-- Cada usuario puede insertar su propio registro
CREATE POLICY "users_insert_own_logs" ON public.usage_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
