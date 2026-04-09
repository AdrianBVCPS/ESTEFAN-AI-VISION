-- ══════════════════════════════════════════════════════════════
-- MIGRACIÓN 003: increment_gemini_usage
-- Función atómica para rate limiting de la API Gemini.
-- SECURITY DEFINER: se ejecuta con privilegios del owner para
-- poder hacer INSERT/UPDATE en app_config sin exponer los permisos
-- de la clave de servicio al cliente.
-- ══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.increment_gemini_usage(p_key TEXT, p_limit INT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INT;
BEGIN
  -- INSERT si no existe el registro del día.
  -- ON CONFLICT DO UPDATE solo actualiza si el contador está por debajo del límite.
  -- Si la condición WHERE falla (count >= limit), la fila no se modifica y
  -- RETURNING no devuelve nada → v_count queda NULL → retornamos FALSE.
  INSERT INTO public.app_config (key, value, updated_at)
  VALUES (p_key, '{"count": 1}'::jsonb, now())
  ON CONFLICT (key) DO UPDATE
    SET
      value      = jsonb_set(
                     app_config.value,
                     '{count}',
                     to_jsonb(COALESCE((app_config.value->>'count')::int, 0) + 1)
                   ),
      updated_at = now()
    WHERE COALESCE((app_config.value->>'count')::int, 0) < p_limit
  RETURNING (value->>'count')::int INTO v_count;

  RETURN v_count IS NOT NULL;
END;
$$;

-- Solo usuarios autenticados pueden ejecutar esta función.
-- El cuerpo opera con SECURITY DEFINER, así que la política RLS de app_config
-- no se aplica dentro de la función, pero sí al llamador.
REVOKE ALL ON FUNCTION public.increment_gemini_usage(TEXT, INT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_gemini_usage(TEXT, INT) TO authenticated;
