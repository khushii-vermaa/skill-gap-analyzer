export default function StatCard({ title, value, subtitle, icon: Icon, trend, className = '' }) {
  return (
    <div className={`card-surface p-5 flex items-start justify-between gap-4 relative overflow-hidden group ${className}`}>
      {/* Subtle futuristic accent glow on top border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-purple-500 to-emerald-400 opacity-60 group-hover:opacity-100 transition-opacity" />

      <div className="min-w-0">
        <p className="text-xs font-mono font-medium uppercase tracking-wider text-slate-600 dark:text-slate-400">
          {title}
        </p>
        <p className="mt-2 text-3xl font-mono font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors truncate">
          {value}
        </p>
        {subtitle && (
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 truncate">{subtitle}</p>
        )}
        {trend !== undefined && trend !== null && (
          <p
            className={`mt-1.5 text-xs font-mono font-medium flex items-center gap-1 ${
              trend >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            <span>{trend >= 0 ? '▲' : '▼'}</span>
            <span>{trend >= 0 ? `+${Number(trend).toFixed(1)}%` : `${Number(trend).toFixed(1)}%`}</span>
            <span className="text-slate-500">vs prev</span>
          </p>
        )}
      </div>

      {Icon && (
        <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700/80 text-cyan-400 group-hover:text-cyan-300 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] shrink-0 transition-all">
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}
