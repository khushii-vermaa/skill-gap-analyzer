import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  LogOut,
  User,
  ChevronRight,
  GraduationCap,
  ArrowLeft,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

const ROUTE_TITLES = {
  '/admin/dashboard': 'Admin Dashboard',
  '/admin/students': 'Student Directory',
  '/admin/skills': 'Manage Skills',
  '/admin/job-roles': 'Manage Job Roles',
  '/admin/resources': 'Learning Resources',
  '/admin/assessments': 'Assessment History',
  '/admin/reports': 'Reports & Analytics',
  '/admin/settings': 'Settings',
  '/student/dashboard': 'Dashboard',
  '/student/profile': 'My Profile',
  '/student/skills': 'My Skills',
  '/student/job-roles': 'Explore Job Roles',
  '/student/analysis': 'Skill Gap Analysis',
  '/student/results': 'Analysis Results',
  '/student/roadmap': 'My Learning Roadmap',
  '/student/history': 'Score History',
  '/student/settings': 'Settings',
};

export default function TopNav({ onMenuClick }) {
  const { user, logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotif, setShowNotif] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfileMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const matchedKey = Object.keys(ROUTE_TITLES).find((key) =>
    location.pathname.startsWith(key)
  );
  const pageTitle = ROUTE_TITLES[matchedKey] || 'Dashboard';
  const homePath = isAdmin ? '/admin/dashboard' : '/student/dashboard';
  const isAtDashboard = location.pathname === homePath;

  const handleBack = () => {
    // If there is browser history state, go back exactly 1 step to the previously viewed page
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      // Fallback if opened directly in a new tab
      navigate(homePath);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (isAdmin) {
      navigate(`/admin/skills?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate(`/student/job-roles?q=${encodeURIComponent(searchQuery.trim())}`);
    }
    setSearchQuery('');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="no-print h-16 px-4 lg:px-6 bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-200 dark:border-[#1E293B] flex items-center justify-between gap-4 shrink-0 sticky top-0 z-20 transition-colors duration-200">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Back navigation button retraces exactly to previously viewed page */}
        {!isAtDashboard && (
          <button
            onClick={handleBack}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700/90 bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-cyan-500/60 hover:text-cyan-600 dark:hover:text-cyan-300 text-slate-500 dark:text-slate-400 flex items-center justify-center cursor-pointer transition-all shadow-sm group"
            title="Go back to previous page"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </button>
        )}

        {/* Breadcrumb Navigation */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Link
              to={homePath}
              className="text-cyan-600 dark:text-cyan-400 font-semibold hover:text-cyan-700 dark:hover:text-cyan-300 hover:underline transition-colors cursor-pointer"
              title={`Go to ${isAdmin ? 'Admin' : 'Student'} Dashboard`}
            >
              {isAdmin ? 'Admin' : 'Student'}
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-600" />
            <span className="truncate text-slate-700 dark:text-slate-300">{pageTitle}</span>
          </div>

          <h1 className="text-sm lg:text-base font-bold text-slate-900 dark:text-white truncate flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>{pageTitle}</span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAdmin ? 'Search skills...' : 'Search job roles...'}
            className="pl-9 pr-3 py-1.5 w-48 lg:w-60 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all"
          />
        </form>

        {/* Theme Toggle Button (Light / Dark Mode) */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 hover:border-cyan-400/50 cursor-pointer transition-all shadow-sm"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400 animate-spin-once" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotif((prev) => !prev)}
            className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 cursor-pointer relative transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          </button>
          {showNotif && (
            <div className="absolute right-0 mt-2 w-80 card-surface shadow-2xl p-4 z-50 border border-slate-700">
              <div className="flex items-center justify-between mb-3 border-b border-slate-700/80 pb-2">
                <p className="text-xs font-semibold text-white uppercase tracking-wider">
                  Notifications
                </p>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Active
                </span>
              </div>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                  <p className="text-cyan-300 font-semibold mb-1">⚡ Quick Navigation</p>
                  <p className="text-[11px] text-slate-400">
                    Use the back arrow to retrace to whatever page you were just on.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/70 hover:border-cyan-400/60 cursor-pointer transition-all"
          >
            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-cyan-500 to-purple-600 text-slate-950 flex items-center justify-center text-xs font-bold shadow-[0_0_10px_rgba(34,211,238,0.3)]">
              {(user?.fullName || user?.username || 'U').charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:inline text-xs font-medium text-slate-200 max-w-[120px] truncate">
              {user?.fullName || user?.username}
            </span>
          </button>
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 card-surface shadow-2xl py-1 z-50 border border-slate-700">
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="text-xs font-bold text-white truncate">{user?.fullName || user?.username}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
              <Link
                to={isAdmin ? '/admin/settings' : '/student/profile'}
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-cyan-300 hover:bg-slate-800/80 transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                {isAdmin ? 'Settings' : 'My Profile'}
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
