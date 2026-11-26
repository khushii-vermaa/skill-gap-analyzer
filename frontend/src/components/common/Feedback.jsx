import { Loader2, AlertCircle, CheckCircle2, Info, AlertTriangle, Inbox } from 'lucide-react';

export function LoadingSpinner({ label = 'Querying system telemetry...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <div className="relative">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
        <div className="absolute inset-0 rounded-full blur-md bg-cyan-400/30 animate-pulse" />
      </div>
      <p className="text-xs font-mono tracking-widest text-cyan-300 uppercase animate-pulse">
        &gt; {label}
      </p>
    </div>
  );
}

const ALERT_STYLES = {
  error: 'bg-rose-950/70 border-rose-500/50 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.15)]',
  success: 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200 shadow-[0_0_20px_rgba(34,197,94,0.15)]',
  warning: 'bg-amber-950/70 border-amber-500/50 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.15)]',
  info: 'bg-cyan-950/70 border-cyan-500/50 text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.15)]',
};

const ALERT_ICONS = {
  error: AlertCircle,
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
};

export function AlertBanner({ type = 'info', message, onDismiss, className = '' }) {
  const Icon = ALERT_ICONS[type] || Info;
  const style = ALERT_STYLES[type] || ALERT_STYLES.info;

  return (
    <div className={`p-3.5 rounded-lg border font-mono text-xs flex items-center justify-between gap-3 ${style} ${className}`}>
      <div className="flex items-center gap-2.5">
        <Icon className="w-4 h-4 shrink-0" />
        <span>{message}</span>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-xs opacity-70 hover:opacity-100 font-bold uppercase transition-opacity"
        >
          [dismiss]
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title = 'No data logs located', description, action, className = '' }) {
  return (
    <div className={`card-surface p-10 text-center flex flex-col items-center justify-center border-dashed border-slate-700 ${className}`}>
      <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mb-3 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        <Inbox className="w-6 h-6 text-cyan-400/80" />
      </div>
      <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">{title}</h3>
      {description && <p className="mt-1 text-xs font-mono text-slate-400 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
