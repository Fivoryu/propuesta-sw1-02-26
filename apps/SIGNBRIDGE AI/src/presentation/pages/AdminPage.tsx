import { Settings, Activity, TrendingUp, AlertTriangle, Clock, Cpu, CheckCircle2 } from 'lucide-react'
import { cn } from '../../utils/cn'
import {
  dashboardStats,
  vocabularyStats,
  signStats,
  modelInfo,
} from '../../data/mockStatistics'

interface StatCardProps {
  label: string
  value: string | number
  icon: React.FC<{ className?: string }>
  trend?: string
  color?: string
}

function StatCard({ label, value, icon: Icon, trend, color = 'text-primary' }: StatCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-surface p-5 ring-1 ring-inset ring-line/60">
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted">{label}</p>
        <span className={cn('flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10', color.replace('text-', 'bg-').replace('primary', 'primary/10'))}>
          <Icon className={cn('h-4.5 w-4.5 h-5 w-5', color)} aria-hidden="true" />
        </span>
      </div>
      <p className="text-3xl font-extrabold text-ink">{value}</p>
      {trend && <p className="text-xs text-muted">{trend}</p>}
    </div>
  )
}

export function AdminPage() {
  return (
    <div className="min-h-full bg-paper">
      <div className="mx-auto max-w-5xl px-4 py-6 lg:px-6">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" aria-hidden="true" />
            <h1 className="text-xl font-bold text-ink">Panel administrativo</h1>
          </div>
          <p className="text-sm text-muted">Visión general del sistema SignBridge AI. Datos de demostración.</p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <StatCard
            label="Sesiones hoy"
            value={dashboardStats.sessionsToday.toLocaleString()}
            icon={Activity}
            trend="+12% vs. ayer"
            color="text-primary"
          />
          <StatCard
            label="Señas reconocidas"
            value={dashboardStats.signsRecognized.toLocaleString()}
            icon={CheckCircle2}
            trend="En sesión actual"
            color="text-success"
          />
          <StatCard
            label="Precisión promedio"
            value={`${dashboardStats.averageAccuracy}%`}
            icon={TrendingUp}
            trend="↑ 1.2% esta semana"
            color="text-success"
          />
          <StatCard
            label="Resultados inciertos"
            value={dashboardStats.uncertainResults}
            icon={AlertTriangle}
            trend="5.7% del total"
            color="text-warning"
          />
          <StatCard
            label="Latencia promedio"
            value={`${dashboardStats.averageLatencyMs} ms`}
            icon={Clock}
            trend="Última hora"
            color="text-info"
          />
        </div>

        <div className="mb-6 grid gap-5 lg:grid-cols-[1fr_320px]">
          <div className="rounded-xl bg-surface p-5 ring-1 ring-inset ring-line/60">
            <h2 className="mb-4 font-bold text-ink">Vocabularios activos</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {vocabularyStats.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between rounded-lg bg-paper p-3 ring-1 ring-inset ring-line/60"
                >
                  <div>
                    <p className="text-sm font-semibold text-ink">{v.name}</p>
                    <p className="text-xs text-muted">{v.totalSigns} señas · {v.usageCount} usos</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-bold text-ink">{v.accuracy.toFixed(1)}%</span>
                    <span
                      className={cn(
                        'rounded-full px-1.5 py-0.5 text-[9px] font-bold',
                        v.status === 'active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning',
                      )}
                    >
                      {v.status === 'active' ? 'Activo' : 'Revisar'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-xl bg-surface p-5 ring-1 ring-inset ring-line/60">
              <h2 className="mb-3 font-bold text-ink">Modelo activo</h2>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Cpu className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-bold text-ink">{modelInfo.name} {modelInfo.version}</p>
                  <p className="text-xs text-muted">Actualizado: {modelInfo.lastUpdated}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Precisión global</span>
                  <span className="font-bold text-ink">{modelInfo.accuracy}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-line/60">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${modelInfo.accuracy}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Señas totales</span>
                  <span className="font-bold text-ink">{modelInfo.totalSigns}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Vocabularios</span>
                  <span className="font-bold text-ink">{modelInfo.supportedVocabularies}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Estado</span>
                  <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-bold text-success">
                    Activo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-surface ring-1 ring-inset ring-line/60 overflow-hidden">
          <div className="border-b border-line/60 px-5 py-4">
            <h2 className="font-bold text-ink">Rendimiento por seña</h2>
          </div>
          <div className="hidden grid-cols-[1fr_100px_80px_120px_80px] gap-4 border-b border-line/40 px-5 py-3 sm:grid">
            {['Seña', 'Vocabulario', 'Precisión', 'Usos', 'Estado'].map((h) => (
              <span key={h} className="text-[10px] font-bold uppercase tracking-wider text-muted">
                {h}
              </span>
            ))}
          </div>
          <div className="divide-y divide-line/40">
            {signStats.map((sign) => (
              <div
                key={sign.sign}
                className="flex flex-col gap-1 px-5 py-3.5 sm:grid sm:grid-cols-[1fr_100px_80px_120px_80px] sm:items-center sm:gap-4"
              >
                <span className="font-semibold text-ink">{sign.sign}</span>
                <span className="text-sm text-muted">{sign.vocabulary}</span>
                <span className="text-sm font-bold text-ink">{sign.accuracy}%</span>
                <span className="text-sm text-muted">{sign.usageCount.toLocaleString()}</span>
                <span
                  className={cn(
                    'w-fit rounded-full px-2 py-0.5 text-[10px] font-bold',
                    sign.status === 'active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning',
                  )}
                >
                  {sign.status === 'active' ? 'Activa' : 'Revisar'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
