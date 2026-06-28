import { useQuery } from '@tanstack/react-query'
import { LayoutDashboard, CheckCircle2, AlertTriangle, TrendingUp, ArrowRight, Zap } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Link } from 'react-router-dom'
import api from '../../lib/api.js'
import { timeAgo, getStatusConfig } from '../../lib/utils.js'
import { DashboardSkeleton } from '../../components/common/Skeleton.jsx'
import useAuthStore from '../../stores/authStore.js'

const ACTION_LABELS = {
  created_board: 'created board', updated_board: 'updated board', deleted_board: 'deleted board',
  created_task: 'added task', updated_task: 'updated task', deleted_task: 'removed task',
  moved_task: 'moved task', completed_task: 'completed task',
  archived_task: 'archived task', ai_suggestion_used: 'used AI',
}

const PIE_COLORS = ['#5B50F8', '#3B82F6', '#EF4444', '#10B981']

function MetricCard({ icon: Icon, label, value, color, delay = '' }) {
  return (
    <div className={`metric-card animate-fade-up ${delay}`} style={{ cursor: 'default' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
        <span className="t-label" style={{ color: 'var(--text-3)' }}>{label}</span>
        <div style={{
          width: 32, height: 32, borderRadius: 'var(--radius)',
          background: color + '18',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={15} style={{ color }} strokeWidth={2} />
        </div>
      </div>
      <div style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.03em', lineHeight: 1 }}>
        {value ?? '—'}
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.5rem 0.75rem', boxShadow: 'var(--shadow-md)', fontSize: '0.8125rem' }}>
        <div style={{ fontWeight: 600, color: 'var(--text-1)' }}>{label}</div>
        <div style={{ color: 'var(--brand)', marginTop: 2 }}>{payload[0].value} tasks</div>
      </div>
    )
  }
  return null
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get('/user/dashboard-stats').then(r => r.data.data),
  })
  const { data: actData } = useQuery({
    queryKey: ['activities'],
    queryFn: () => api.get('/activities?limit=8').then(r => r.data.data),
  })
  const { data: boardsData } = useQuery({
    queryKey: ['boards'],
    queryFn: () => api.get('/boards').then(r => r.data.data),
  })

  if (isLoading) return <DashboardSkeleton />

  const barData = (boardsData?.boards || []).slice(0, 6).map(b => ({
    name: b.title.length > 12 ? b.title.slice(0, 12) + '…' : b.title,
    tasks: b.totalTasks || 0,
  }))

  const pieData = [
    { name: 'Active',  value: stats?.activeTasks    || 0 },
    { name: 'Done',    value: stats?.completedTasks  || 0 },
    { name: 'Overdue', value: stats?.overdueTasks    || 0 },
  ].filter(d => d.value > 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Greeting banner */}
      <div className="animate-fade-up" style={{
        background: 'linear-gradient(135deg, var(--brand) 0%, #A855F7 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: 'clamp(1.25rem, 3vw, 1.75rem)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '1rem', flexWrap: 'wrap',
        boxShadow: 'var(--shadow-brand)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', top: -60, right: -30 }} />
        <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', bottom: -40, right: 120 }} />

        <div style={{ position: 'relative' }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>{greeting} 👋</p>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.25rem, 3vw, 1.625rem)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.2 }}>
            {user?.name?.split(' ')[0]}, here's your overview
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.8125rem', marginTop: '0.375rem' }}>
            {stats?.totalBoards || 0} boards · {stats?.totalTasks || 0} total tasks
          </p>
        </div>
        <Link to="/boards" className="btn" style={{
          background: 'rgba(255,255,255,0.18)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.25)',
          backdropFilter: 'blur(8px)',
          flexShrink: 0,
        }}>
          View boards <ArrowRight size={14} />
        </Link>
      </div>

      {/* Metrics grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
        <MetricCard icon={LayoutDashboard} label="Total Boards"   value={stats?.totalBoards}    color="#5B50F8" delay="delay-1" />
        <MetricCard icon={TrendingUp}      label="Active Tasks"   value={stats?.activeTasks}    color="#3B82F6" delay="delay-2" />
        <MetricCard icon={CheckCircle2}    label="Completed"      value={stats?.completedTasks}  color="#10B981" delay="delay-3" />
        <MetricCard icon={AlertTriangle}   label="Overdue"        value={stats?.overdueTasks}    color="#EF4444" delay="delay-4" />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {/* Bar chart */}
        <div className="card animate-fade-up delay-2" style={{ padding: '1.25rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h2 className="t-h3" style={{ color: 'var(--text-1)' }}>Tasks per board</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: 2 }}>Distribution across your boards</p>
          </div>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={barData} barSize={22} margin={{ left: -20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--brand-light)', radius: 6 }} />
                <Bar dataKey="tasks" fill="var(--brand)" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', fontSize: '0.8125rem' }}>
              No boards yet
            </div>
          )}
        </div>

        {/* Pie chart */}
        <div className="card animate-fade-up delay-3" style={{ padding: '1.25rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h2 className="t-h3" style={{ color: 'var(--text-1)' }}>Task status</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: 2 }}>Breakdown by completion</p>
          </div>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={130}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={4} dataKey="value" strokeWidth={0}>
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', boxShadow: 'var(--shadow-md)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
                {pieData.map((d, i) => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: PIE_COLORS[i], flexShrink: 0 }} />
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-2)' }}>{d.name}</span>
                    </div>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-1)' }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', fontSize: '0.8125rem' }}>
              No tasks yet
            </div>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {/* Recent boards */}
        <div className="card animate-fade-up delay-4" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 className="t-h3" style={{ color: 'var(--text-1)' }}>Recent boards</h2>
            <Link to="/boards" style={{ fontSize: '0.75rem', color: 'var(--brand)', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {boardsData?.boards?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {boardsData.boards.slice(0, 4).map(board => (
                <Link key={board._id} to={`/boards/${board._id}/kanban`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.625rem 0.75rem', borderRadius: 'var(--radius)',
                    transition: 'background 0.12s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: 'var(--radius-sm)',
                      background: board.color + '22',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.9375rem', flexShrink: 0,
                    }}>
                      {board.emoji || '📋'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {board.title}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-3)', marginTop: 1 }}>
                        {board.totalTasks || 0} tasks
                      </div>
                    </div>
                    <ArrowRight size={13} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ padding: '2rem 0', textAlign: 'center' }}>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)', marginBottom: '0.75rem' }}>No boards yet</p>
              <Link to="/boards" className="btn btn-secondary btn-sm">Create your first board</Link>
            </div>
          )}
        </div>

        {/* Activity feed */}
        <div className="card animate-fade-up delay-5" style={{ padding: '1.25rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h2 className="t-h3" style={{ color: 'var(--text-1)' }}>Recent activity</h2>
          </div>
          {actData?.activities?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {actData.activities.map((act, i) => (
                <div key={act._id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}
                  className={`animate-fade-up`} style2={{ animationDelay: `${i * 0.04}s` }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: 'var(--brand-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: 1,
                  }}>
                    <Zap size={11} style={{ color: 'var(--brand)' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-1)', lineHeight: 1.4 }}>
                      <span style={{ fontWeight: 600 }}>{act.user?.name || 'You'}</span>
                      {' '}{ACTION_LABELS[act.action] || act.action}
                      {act.meta?.title && (
                        <span style={{ color: 'var(--text-2)' }}> "{act.meta.title}"</span>
                      )}
                    </p>
                    <p style={{ fontSize: '0.6875rem', color: 'var(--text-3)', marginTop: 2 }}>{timeAgo(act.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-3)', fontSize: '0.8125rem' }}>
              No activity yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
