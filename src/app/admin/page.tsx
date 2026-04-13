'use client'

import { useEffect, useState, useCallback } from 'react'
import { RefreshCw, ExternalLink, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import type { BarberProfile, SubscriptionStatus, Json } from '@/types/database'

// ─── Tipos locales ────────────────────────────────────────────────────────────

type Tab = 'dashboard' | 'usuarios' | 'config'

interface AdminStats {
  total_users: number
  active_users: number
  trialing_users: number
  pending_users: number
  revenue_this_month: number
  usage_today: number
  usage_this_month: number
  daily_usage_last_30: Record<string, number>
}

interface UserWithStats extends BarberProfile {
  usage_total: number
  usage_this_month: number
  email?: string
}

interface AppConfigRow {
  id: string
  key: string
  value: Json
  updated_at: string
}

// ─── Helpers visuales ─────────────────────────────────────────────────────────

const BADGE_COLORS: Record<SubscriptionStatus, { bg: string; text: string; label: string }> = {
  active: { bg: 'rgba(78,205,196,0.15)', text: '#4ECDC4', label: 'Activo' },
  trialing: { bg: 'rgba(212,168,84,0.15)', text: '#D4A854', label: 'Trial' },
  past_due: { bg: 'rgba(245,158,11,0.15)', text: '#F59E0B', label: 'Vencido' },
  canceled: { bg: 'rgba(239,68,68,0.15)', text: '#EF4444', label: 'Cancelado' },
  pending: { bg: 'rgba(107,114,128,0.15)', text: '#6B7280', label: 'Pendiente' },
}

function Badge({ status }: { status: SubscriptionStatus }) {
  const { bg, text, label } = BADGE_COLORS[status] ?? BADGE_COLORS.pending
  return (
    <span
      className="inline-block font-mono text-xs px-2 py-0.5 rounded-full font-bold"
      style={{ background: bg, color: text }}
    >
      {label}
    </span>
  )
}

// Skeleton de tarjeta para el dashboard
function StatCardSkeleton() {
  return (
    <div
      className="rounded-2xl p-5 animate-pulse"
      style={{ background: 'rgba(26,26,46,0.06)', height: 88 }}
    />
  )
}

// Skeleton de fila de tabla
function RowSkeleton() {
  return (
    <tr>
      {Array.from({ length: 9 }).map((_, i) => (
        <td key={i} className="px-3 py-3">
          <div className="h-4 rounded animate-pulse" style={{ background: 'rgba(26,26,46,0.08)', width: i === 0 ? 96 : 64 }} />
        </td>
      ))}
    </tr>
  )
}

// ─── Pestaña Dashboard ────────────────────────────────────────────────────────

function TabDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargarStats = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/stats')
      if (!res.ok) throw new Error('Error al cargar estadísticas')
      const data: AdminStats = await res.json()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => { cargarStats() }, [cargarStats])

  const tarjetas = stats
    ? [
        { label: 'Total usuarios', valor: stats.total_users, mono: true },
        { label: 'Activos', valor: stats.active_users, mono: true },
        { label: 'En trial', valor: stats.trialing_users, mono: true },
        { label: 'Pendientes', valor: stats.pending_users, mono: true },
        { label: 'Ingresos mes', valor: `${stats.revenue_this_month} €`, mono: true },
        { label: 'Consultas hoy', valor: stats.usage_today, mono: true },
        { label: 'Consultas este mes', valor: stats.usage_this_month, mono: true },
      ]
    : []

  // Construir array de 30 días para el gráfico
  const dias30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (29 - i))
    return d.toISOString().slice(0, 10)
  })

  const valoresDiarios = dias30.map(d => stats?.daily_usage_last_30?.[d] ?? 0)
  const maxValor = Math.max(...valoresDiarios, 1)

  return (
    <div className="px-4 py-6 max-w-5xl mx-auto">
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-xl" style={{ color: '#1A1A2E' }}>
          Dashboard
        </h2>
        <button
          onClick={cargarStats}
          className="flex items-center gap-1.5 font-ui text-xs transition-opacity hover:opacity-70 cursor-pointer"
          style={{ color: '#6B7280' }}
        >
          <RefreshCw size={13} strokeWidth={1.5} />
          Actualizar
        </button>
      </div>

      {error && (
        <p className="font-ui text-sm mb-4" style={{ color: '#EF4444' }}>{error}</p>
      )}

      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 mb-8">
        {cargando
          ? Array.from({ length: 7 }).map((_, i) => <StatCardSkeleton key={i} />)
          : tarjetas.map(({ label, valor, mono }) => (
              <div
                key={label}
                className="rounded-2xl p-5"
                style={{
                  background: '#fff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                }}
              >
                <p className="font-ui text-xs mb-1" style={{ color: '#6B7280' }}>{label}</p>
                <p
                  className={mono ? 'font-mono font-bold text-2xl' : 'font-ui font-bold text-2xl'}
                  style={{ color: '#1A1A2E' }}
                >
                  {valor}
                </p>
              </div>
            ))}
      </div>

      {/* Gráfico de barras — últimos 30 días */}
      <div
        className="rounded-2xl p-5"
        style={{ background: '#1A1A2E', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
      >
        <p className="font-ui text-xs mb-4 font-bold tracking-widest uppercase" style={{ color: 'rgba(245,240,235,0.4)' }}>
          Uso últimos 30 días
        </p>

        {cargando ? (
          <div className="h-32 rounded animate-pulse" style={{ background: 'rgba(245,240,235,0.06)' }} />
        ) : (
          <div className="flex flex-col gap-2">
            {/* Barras */}
            <div className="flex items-end gap-[2px]" style={{ height: 80 }}>
              {valoresDiarios.map((v, i) => {
                const altura = maxValor > 0 ? (v / maxValor) * 100 : 0
                return (
                  <div
                    key={i}
                    title={`${dias30[i]}: ${v} consultas`}
                    className="flex-1 rounded-sm transition-opacity hover:opacity-80 cursor-default"
                    style={{
                      height: `${Math.max(altura, v > 0 ? 4 : 1)}%`,
                      background: v > 0 ? '#D4A854' : 'rgba(245,240,235,0.08)',
                      minHeight: 2,
                    }}
                  />
                )
              })}
            </div>

            {/* Eje X — solo cada 7 días */}
            <div className="flex items-end gap-[2px]">
              {dias30.map((d, i) => {
                const mostrar = i % 7 === 0 || i === 29
                return (
                  <div key={i} className="flex-1 text-center">
                    {mostrar && (
                      <span
                        className="font-mono text-[8px] block truncate"
                        style={{ color: 'rgba(245,240,235,0.3)' }}
                      >
                        {d.slice(5)} {/* MM-DD */}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Pestaña Usuarios ─────────────────────────────────────────────────────────

function TabUsuarios() {
  const [usuarios, setUsuarios] = useState<UserWithStats[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [accionando, setAccionando] = useState<string | null>(null) // user_id en curso

  const cargarUsuarios = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/users')
      if (!res.ok) throw new Error('Error al cargar usuarios')
      const { users } = await res.json()
      setUsuarios(users ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => { cargarUsuarios() }, [cargarUsuarios])

  const darTrial = async (userId: string) => {
    setAccionando(userId)
    try {
      const res = await fetch('/api/admin/create-trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_user_id: userId }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error ?? 'Error al crear trial')
      }
      await cargarUsuarios()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al crear trial')
    } finally {
      setAccionando(null)
    }
  }

  const desactivar = async (userId: string, nombre: string) => {
    const confirmar = confirm(`¿Desactivar la cuenta de "${nombre}"? Esta acción cancelará su suscripción en Stripe.`)
    if (!confirmar) return
    setAccionando(userId)
    try {
      const res = await fetch('/api/admin/deactivate-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_user_id: userId }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error ?? 'Error al desactivar')
      }
      await cargarUsuarios()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al desactivar')
    } finally {
      setAccionando(null)
    }
  }

  const formatFecha = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }) : '—'

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-xl" style={{ color: '#1A1A2E' }}>
          Usuarios
        </h2>
        <Button variant="secondary" size="sm" onClick={cargarUsuarios}>
          <RefreshCw size={13} strokeWidth={1.5} />
          Actualizar
        </Button>
      </div>

      {error && (
        <p className="font-ui text-sm mb-4" style={{ color: '#EF4444' }}>{error}</p>
      )}

      {/* Tabla — scroll horizontal en móvil */}
      <div
        className="rounded-2xl overflow-hidden overflow-x-auto"
        style={{ background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
      >
        <table className="w-full text-sm" style={{ minWidth: 760 }}>
          <thead>
            <tr style={{ background: '#F5F0EB' }}>
              {['Nombre', 'Rol', 'Estado', 'Fin trial', 'Último pago', 'Mes', 'Total', 'Acciones'].map(col => (
                <th
                  key={col}
                  className="px-3 py-3 text-left font-ui font-bold text-xs tracking-wide uppercase"
                  style={{ color: '#6B7280' }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cargando
              ? Array.from({ length: 4 }).map((_, i) => <RowSkeleton key={i} />)
              : usuarios.map(u => (
                  <tr
                    key={u.id}
                    className="border-t"
                    style={{ borderColor: 'rgba(26,26,46,0.06)' }}
                  >
                    <td className="px-3 py-3">
                      <p className="font-ui font-bold text-sm" style={{ color: '#1A1A2E' }}>{u.display_name}</p>
                    </td>
                    <td className="px-3 py-3">
                      <span className="font-mono text-xs" style={{ color: '#6B7280' }}>{u.role}</span>
                    </td>
                    <td className="px-3 py-3">
                      <Badge status={u.subscription_status} />
                    </td>
                    <td className="px-3 py-3">
                      <span className="font-mono text-xs" style={{ color: '#6B7280' }}>
                        {formatFecha(u.trial_ends_at)}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="font-mono text-xs" style={{ color: '#6B7280' }}>
                        {formatFecha(u.last_payment_at)}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="font-mono text-sm font-bold" style={{ color: '#1A1A2E' }}>
                        {u.usage_this_month}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="font-mono text-sm" style={{ color: '#6B7280' }}>
                        {u.usage_total}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Trial 15d — solo si no está activo */}
                        {u.subscription_status !== 'active' && (
                          <button
                            onClick={() => darTrial(u.id)}
                            disabled={accionando === u.id}
                            className="font-ui text-xs px-2 py-1 rounded-lg transition-opacity hover:opacity-70 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                            style={{ background: 'rgba(212,168,84,0.15)', color: '#D4A854' }}
                          >
                            {accionando === u.id ? '...' : 'Trial 15d'}
                          </button>
                        )}

                        {/* Desactivar — no para superadmin */}
                        {u.role !== 'superadmin' && (
                          <button
                            onClick={() => desactivar(u.id, u.display_name)}
                            disabled={accionando === u.id}
                            className="font-ui text-xs px-2 py-1 rounded-lg transition-opacity hover:opacity-70 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                            style={{ background: 'rgba(239,68,68,0.10)', color: '#EF4444' }}
                          >
                            {accionando === u.id ? '...' : 'Desactivar'}
                          </button>
                        )}

                        {/* Ver en Stripe */}
                        {u.stripe_customer_id && (
                          <a
                            href={`https://dashboard.stripe.com/customers/${u.stripe_customer_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 font-ui text-xs transition-opacity hover:opacity-70"
                            style={{ color: '#6B7280' }}
                          >
                            <ExternalLink size={12} strokeWidth={1.5} />
                            Stripe
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

            {/* Sin usuarios */}
            {!cargando && usuarios.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center">
                  <p className="font-ui text-sm" style={{ color: '#6B7280' }}>No hay usuarios registrados</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Pestaña Configuración ────────────────────────────────────────────────────

function TabConfiguracion() {
  const supabase = createClient()
  const [config, setConfig] = useState<AppConfigRow[]>([])
  const [cargando, setCargando] = useState(true)
  const [valores, setValores] = useState<Record<string, string>>({})
  const [guardando, setGuardando] = useState<string | null>(null) // key en curso
  const [toasts, setToasts] = useState<Record<string, string>>({}) // key -> mensaje

  const cargarConfig = useCallback(async () => {
    setCargando(true)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('app_config')
      .select('*')
      .order('key', { ascending: true }) as { data: AppConfigRow[] | null; error: unknown }

    if (!error && data) {
      setConfig(data)
      // Inicializar valores editables como string
      const mapa: Record<string, string> = {}
      data.forEach(row => {
        mapa[row.key] = typeof row.value === 'object' ? JSON.stringify(row.value) : String(row.value ?? '')
      })
      setValores(mapa)
    }
    setCargando(false)
  }, [supabase]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { cargarConfig() }, [cargarConfig])

  const mostrarToast = (key: string, msg: string) => {
    setToasts(prev => ({ ...prev, [key]: msg }))
    setTimeout(() => {
      setToasts(prev => {
        const copia = { ...prev }
        delete copia[key]
        return copia
      })
    }, 3000)
  }

  const guardar = async (row: AppConfigRow) => {
    setGuardando(row.key)
    try {
      // Intentar parsear como JSON; si falla, guardar como string
      let nuevoValor: Json
      try {
        nuevoValor = JSON.parse(valores[row.key])
      } catch {
        nuevoValor = valores[row.key]
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('app_config')
        .update({ value: nuevoValor })
        .eq('key', row.key) as { error: { message: string } | null }

      if (error) throw new Error(error.message)
      mostrarToast(row.key, 'Guardado correctamente')
    } catch (err) {
      mostrarToast(row.key, err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setGuardando(null)
    }
  }

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <h2 className="font-display font-bold text-xl mb-6" style={{ color: '#1A1A2E' }}>
        Configuración
      </h2>

      {cargando ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 rounded-2xl animate-pulse" style={{ background: 'rgba(26,26,46,0.06)' }} />
          ))}
        </div>
      ) : config.length === 0 ? (
        <p className="font-ui text-sm" style={{ color: '#6B7280' }}>No hay configuración disponible</p>
      ) : (
        <div className="flex flex-col gap-3">
          {config.map(row => (
            <div
              key={row.key}
              className="rounded-2xl px-4 py-3"
              style={{ background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
            >
              <div className="flex items-center gap-3">
                {/* Clave — readonly */}
                <span
                  className="font-mono text-xs shrink-0 w-40 truncate"
                  style={{ color: '#6B7280' }}
                  title={row.key}
                >
                  {row.key}
                </span>

                {/* Valor editable */}
                <input
                  type="text"
                  value={valores[row.key] ?? ''}
                  onChange={e => setValores(prev => ({ ...prev, [row.key]: e.target.value }))}
                  className="flex-1 font-mono text-sm rounded-lg px-3 py-1.5 outline-none transition-colors"
                  style={{
                    background: 'rgba(26,26,46,0.04)',
                    color: '#1A1A2E',
                    border: '1px solid rgba(26,26,46,0.10)',
                  }}
                />

                {/* Botón guardar */}
                <button
                  onClick={() => guardar(row)}
                  disabled={guardando === row.key}
                  className="shrink-0 font-ui text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-70 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                  style={{ background: 'rgba(212,168,84,0.15)', color: '#D4A854' }}
                >
                  {guardando === row.key ? '...' : 'Guardar'}
                </button>
              </div>

              {/* Toast de feedback */}
              {toasts[row.key] && (
                <p
                  className="font-ui text-xs mt-1.5 ml-40 pl-3"
                  style={{ color: toasts[row.key].includes('Error') ? '#EF4444' : '#4ECDC4' }}
                >
                  {toasts[row.key]}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Componente raíz — gestiona pestañas ──────────────────────────────────────

const TABS: { id: Tab; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'usuarios', label: 'Usuarios' },
  { id: 'config', label: 'Configuración' },
]

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('dashboard')

  return (
    <div>
      {/* Pestañas — desktop: fila, móvil: select */}
      <div
        className="sticky top-0 z-10 px-4 pt-4 pb-0"
        style={{ background: '#F5F0EB' }}
      >
        {/* Select en móvil */}
        <div className="relative sm:hidden mb-4">
          <select
            value={tab}
            onChange={e => setTab(e.target.value as Tab)}
            className="w-full appearance-none font-ui font-bold text-sm rounded-xl px-4 py-3 pr-10 outline-none cursor-pointer"
            style={{
              background: '#1A1A2E',
              color: '#F5F0EB',
              border: 'none',
            }}
          >
            {TABS.map(t => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
          <ChevronDown
            size={16}
            strokeWidth={1.5}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: 'rgba(245,240,235,0.5)' }}
          />
        </div>

        {/* Tabs en desktop */}
        <div
          className="hidden sm:flex gap-1 rounded-xl p-1"
          style={{ background: 'rgba(26,26,46,0.08)' }}
        >
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 font-ui font-bold text-sm rounded-lg py-2 transition-all duration-150 cursor-pointer"
              style={
                tab === t.id
                  ? { background: '#1A1A2E', color: '#F5F0EB' }
                  : { background: 'transparent', color: '#6B7280' }
              }
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido de la pestaña activa */}
      <div>
        {tab === 'dashboard' && <TabDashboard />}
        {tab === 'usuarios' && <TabUsuarios />}
        {tab === 'config' && <TabConfiguracion />}
      </div>
    </div>
  )
}
