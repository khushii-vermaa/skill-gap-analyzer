const TONE_MAP = {
  MATCHED:
    'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border-emerald-400 dark:border-emerald-500/40 font-semibold shadow-sm dark:shadow-[0_0_10px_rgba(34,197,94,0.15)]',
  COMPLETED:
    'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border-emerald-400 dark:border-emerald-500/40 font-semibold shadow-sm dark:shadow-[0_0_10px_rgba(34,197,94,0.15)]',
  ACTIVE:
    'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border-emerald-400 dark:border-emerald-500/40 font-semibold',
  success:
    'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border-emerald-400 dark:border-emerald-500/40 font-semibold shadow-sm dark:shadow-[0_0_10px_rgba(34,197,94,0.15)]',

  NEEDS_IMPROVEMENT:
    'bg-purple-100 dark:bg-purple-950/60 text-purple-900 dark:text-purple-300 border-purple-400 dark:border-purple-500/40 font-semibold shadow-sm dark:shadow-[0_0_10px_rgba(168,85,247,0.15)]',
  IN_PROGRESS:
    'bg-purple-100 dark:bg-purple-950/60 text-purple-900 dark:text-purple-300 border-purple-400 dark:border-purple-500/40 font-semibold',
  MEDIUM:
    'bg-purple-100 dark:bg-purple-950/60 text-purple-900 dark:text-purple-300 border-purple-400 dark:border-purple-500/40 font-semibold',
  warning:
    'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-amber-400 dark:border-amber-500/40 font-semibold',

  MISSING:
    'bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-300 border-rose-400 dark:border-rose-500/40 font-semibold shadow-sm dark:shadow-[0_0_10px_rgba(244,63,94,0.15)]',
  HIGH:
    'bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-300 border-rose-400 dark:border-rose-500/40 font-semibold shadow-sm dark:shadow-[0_0_10px_rgba(244,63,94,0.15)]',
  INACTIVE:
    'bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-300 border-rose-400 dark:border-rose-500/40 font-semibold',
  danger:
    'bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-300 border-rose-400 dark:border-rose-500/40 font-semibold',

  LOW: 'bg-slate-200 dark:bg-slate-800/80 text-slate-900 dark:text-slate-300 border-slate-300 dark:border-slate-700 font-semibold',
  PENDING: 'bg-slate-200 dark:bg-slate-800/80 text-slate-900 dark:text-slate-300 border-slate-300 dark:border-slate-700 font-semibold',
  neutral: 'bg-slate-200 dark:bg-slate-800/80 text-slate-900 dark:text-slate-300 border-slate-300 dark:border-slate-700 font-semibold',

  cyan: 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-900 dark:text-cyan-300 border-cyan-400 dark:border-cyan-500/40 font-semibold shadow-sm dark:shadow-[0_0_10px_rgba(34,211,238,0.15)]',
  teal: 'bg-teal-100 dark:bg-teal-950/60 text-teal-900 dark:text-teal-300 border-teal-400 dark:border-teal-500/40 font-semibold shadow-sm dark:shadow-[0_0_10px_rgba(34,211,238,0.15)]',
  purple: 'bg-purple-100 dark:bg-purple-950/60 text-purple-900 dark:text-purple-300 border-purple-400 dark:border-purple-500/40 font-semibold shadow-sm dark:shadow-[0_0_10px_rgba(168,85,247,0.15)]',
};

export default function Badge({ children, tone = 'neutral', className = '' }) {
  const styles = TONE_MAP[tone] || TONE_MAP.neutral;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-mono font-medium rounded-md border tracking-wide uppercase ${styles} ${className}`}
    >
      {children}
    </span>
  );
}
