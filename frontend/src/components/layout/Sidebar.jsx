import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Layers,
  Briefcase,
  BookOpen,
  ClipboardCheck,
  BarChart3,
  Settings,
  UserCircle,
  Code2,
  Target,
  Map,
  History,
  GraduationCap,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const ADMIN_LINKS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/students', label: 'Students', icon: Users },
  { to: '/admin/skills', label: 'Skills & Categories', icon: Layers },
  { to: '/admin/job-roles', label: 'Job Roles', icon: Briefcase },
  { to: '/admin/resources', label: 'Learning Resources', icon: BookOpen },
  { to: '/admin/assessments', label: 'Assessment History', icon: ClipboardCheck },
  { to: '/admin/reports', label: 'Reports & Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

const STUDENT_LINKS = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/student/profile', label: 'My Profile', icon: UserCircle },
  { to: '/student/skills', label: 'My Skills', icon: Code2 },
  { to: '/student/job-roles', label: 'Explore Job Roles', icon: Briefcase },
  { to: '/student/analysis', label: 'Skill Gap Analysis', icon: Target },
  { to: '/student/roadmap', label: 'Learning Roadmap', icon: Map },
  { to: '/student/history', label: 'Score History', icon: History },
  { to: '/student/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ open, onClose }) {
  const { isAdmin, user } = useAuth();
  const links = isAdmin ? ADMIN_LINKS : STUDENT_LINKS;
  const homePath = isAdmin ? '/admin/dashboard' : '/student/dashboard';

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden no-print"
          onClick={onClose}
        />
      )}
      <aside
        className={`no-print fixed lg:static inset-y-0 left-0 z-40 w-64 shrink-0 bg-white dark:bg-[#0F172A] border-r border-slate-200 dark:border-[#1E293B] flex flex-col transition-colors duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header / Brand Logo with Click to Retrace Back to Dashboard */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200 dark:border-[#1E293B]">
          <Link
            to={homePath}
            onClick={onClose}
            className="flex items-center gap-3 group cursor-pointer"
            title="Return to Home Dashboard"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-slate-950 font-bold shadow-[0_0_15px_rgba(34,211,238,0.4)] group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-slate-950" />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-wide text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                  SkillGap <span className="text-cyan-600 dark:text-cyan-400">Analyzer</span>
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              </div>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                Placement Readiness
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    isActive
                      ? 'bg-cyan-50 dark:bg-gradient-to-r dark:from-cyan-950/70 dark:to-slate-900 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/40 shadow-sm dark:shadow-[0_0_15px_rgba(34,211,238,0.15)] font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent font-medium'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                    {isActive && <Sparkles className="w-3.5 h-3.5 ml-auto text-cyan-600 dark:text-cyan-400 shrink-0" />}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Profile Block */}
        <div className="p-3 border-t border-slate-200 dark:border-[#1E293B]">
          <Link
            to={isAdmin ? '/admin/settings' : '/student/profile'}
            className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3 hover:border-cyan-400/50 hover:bg-slate-200/50 dark:hover:bg-slate-800/60 transition-all cursor-pointer block"
            title="View Account Profile"
          >
            <div className="w-8 h-8 rounded-md bg-purple-100 dark:bg-purple-950 border border-purple-300 dark:border-purple-500/40 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xs font-bold shrink-0">
              {(user?.fullName || user?.username || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                {user?.fullName || user?.username}
              </p>
              <p className="text-[11px] text-cyan-600 dark:text-cyan-400 truncate">
                {user?.role === 'ADMIN' ? 'Administrator' : 'Student Account'}
              </p>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}
