import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary:
    'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-semibold hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] border border-cyan-400/30',
  secondary:
    'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] border border-purple-400/30',
  outline:
    'bg-slate-900/60 border border-slate-700 text-slate-200 hover:border-cyan-400/60 hover:text-cyan-300 hover:bg-slate-800/80 shadow-sm transition-all',
  ghost:
    'bg-transparent text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60',
  danger:
    'bg-gradient-to-r from-rose-600 to-pink-600 text-white font-medium hover:from-rose-500 hover:to-pink-500 shadow-[0_0_20px_rgba(244,63,94,0.3)] border border-rose-500/30',
  success:
    'bg-gradient-to-r from-emerald-500 to-green-600 text-slate-950 font-semibold hover:from-emerald-400 hover:to-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)] border border-emerald-400/30',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-mono tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size] || SIZES.md} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin text-inherit" />}
      {children}
    </button>
  );
}
