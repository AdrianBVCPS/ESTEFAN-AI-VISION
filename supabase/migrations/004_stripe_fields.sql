-- ══════════════════════════════════════════════════════════════
-- MIGRACIÓN 004: campos Stripe + rol superadmin en barber_profiles
-- ══════════════════════════════════════════════════════════════

-- 1. Cambiar CHECK constraint de role: admin → superadmin
ALTER TABLE public.barber_profiles DROP CONSTRAINT IF EXISTS barber_profiles_role_check;
ALTER TABLE public.barber_profiles ADD CONSTRAINT barber_profiles_role_check
  CHECK (role IN ('superadmin', 'barber'));

-- 2. Migrar el valor 'admin' existente a 'superadmin'
UPDATE public.barber_profiles SET role = 'superadmin' WHERE role = 'admin';

-- 3. Añadir columnas de suscripción Stripe
ALTER TABLE public.barber_profiles
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'pending'
    CHECK (subscription_status IN ('active', 'trialing', 'past_due', 'canceled', 'pending')),
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_payment_at TIMESTAMPTZ;

-- 4. El superadmin tiene acceso permanente — marcar como activo
UPDATE public.barber_profiles SET subscription_status = 'active'
  WHERE role = 'superadmin';

-- 5. Función auxiliar para evitar recursión en políticas RLS
--    SECURITY DEFINER: se ejecuta con permisos del propietario, no del caller
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.barber_profiles
    WHERE id = auth.uid() AND role = 'superadmin'
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE;

-- 6. Actualizar política admin_insert en barber_profiles (admin → superadmin)
DROP POLICY IF EXISTS "admin_insert" ON public.barber_profiles;
CREATE POLICY "admin_insert" ON public.barber_profiles
  FOR INSERT WITH CHECK (public.is_superadmin());

-- 7. Política para que superadmin vea todos los perfiles (para panel admin)
DROP POLICY IF EXISTS "superadmin_select_all" ON public.barber_profiles;
CREATE POLICY "superadmin_select_all" ON public.barber_profiles
  FOR SELECT USING (public.is_superadmin());

-- 8. Política para que superadmin pueda actualizar cualquier perfil
DROP POLICY IF EXISTS "superadmin_update_all" ON public.barber_profiles;
CREATE POLICY "superadmin_update_all" ON public.barber_profiles
  FOR UPDATE USING (public.is_superadmin());

-- 9. Actualizar política admin_update en app_config (admin → superadmin)
DROP POLICY IF EXISTS "admin_update" ON public.app_config;
CREATE POLICY "admin_update" ON public.app_config
  FOR UPDATE USING (public.is_superadmin());

-- 10. Añadir política INSERT en app_config para superadmin
DROP POLICY IF EXISTS "admin_insert_config" ON public.app_config;
CREATE POLICY "admin_insert_config" ON public.app_config
  FOR INSERT WITH CHECK (public.is_superadmin());
