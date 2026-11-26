import { Shield, Info, User, Mail, Sparkles, Monitor, Sun, Moon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

export default function SettingsPage() {
  const { user } = useAuth();
  const { isDark, setTheme } = useTheme();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          Account &amp; System Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage your account profile details, appearance &amp; theme preferences, and environment configuration
        </p>
      </div>

      {/* Account Info Card */}
      <div className="card-surface p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
          <User className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          User Profile Details
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400">FULL NAME</p>
            <p className="font-semibold text-slate-900 dark:text-white text-sm mt-1">{user?.fullName || '—'}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400">USERNAME</p>
            <p className="font-semibold text-slate-900 dark:text-white text-sm mt-1">{user?.username || '—'}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400">EMAIL ADDRESS</p>
            <p className="font-semibold text-cyan-600 dark:text-cyan-400 text-sm mt-1">{user?.email || '—'}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400">ACCOUNT ROLE</p>
            <p className="font-semibold text-purple-600 dark:text-purple-400 text-sm mt-1">
              {user?.role === 'ADMIN' ? 'Administrator' : 'Student'}
            </p>
          </div>
        </div>
      </div>

      {/* Theme & Display Card */}
      <div className="card-surface p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Monitor className="w-4 h-4 text-purple-500 dark:text-purple-400" />
              Theme &amp; Appearance
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Switch between Light Mode and Cyber Dark Mode anytime
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-mono px-3 py-1.5 rounded-lg flex items-center gap-1.5 border ${
                isDark
                  ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800'
                  : 'bg-amber-50 text-amber-800 border-amber-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              {isDark ? 'Cyber Dark Active' : 'Light Mode Active'}
            </span>
          </div>
        </div>

        {/* Theme Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
              !isDark
                ? 'border-cyan-500 bg-cyan-50/60 ring-2 ring-cyan-400/30 text-slate-900'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-100 text-amber-700">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-slate-200">Light Mode</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Clean, crisp daylight palette</p>
              </div>
            </div>
            {!isDark && <span className="w-2.5 h-2.5 rounded-full bg-cyan-600 shadow-sm" />}
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
              isDark
                ? 'border-cyan-500 bg-slate-900 ring-2 ring-cyan-500/30 text-white'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-600 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">Cyber Dark Mode</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Deep space blue with neon accents</p>
              </div>
            </div>
            {isDark && <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />}
          </button>
        </div>
      </div>

      {/* Application Specs Card */}
      <div className="card-surface p-6 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
          <Info className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          Technical Stack &amp; Architecture
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500">BACKEND ENGINE</p>
            <p className="text-slate-800 dark:text-slate-200 mt-1 font-semibold">Java 21 + Spring Boot 3.2</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500">DATABASE</p>
            <p className="text-slate-800 dark:text-slate-200 mt-1 font-semibold">MySQL 8.0 (InnoDB)</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500">FRONTEND SPA</p>
            <p className="text-slate-800 dark:text-slate-200 mt-1 font-semibold">React 18 + Vite + Tailwind</p>
          </div>
        </div>
      </div>
    </div>
  );
}
