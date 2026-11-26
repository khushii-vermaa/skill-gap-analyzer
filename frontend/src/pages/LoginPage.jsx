import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, GraduationCap, Shield, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import { AlertBanner } from '../components/common/Feedback';
import { extractErrorMessage } from '../utils/formatters';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const user = await login({ email: email.trim(), password });
      navigate(user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard', {
        replace: true,
      });
    } catch (err) {
      setError(extractErrorMessage(err, 'Invalid email or password.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-[#0B1120]">
      {/* Background ambient glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1px] shadow-[0_0_30px_rgba(34,211,238,0.3)] mb-4">
            <div className="w-full h-full bg-[#0B1120] rounded-2xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            Skill-Gap <span className="text-cyan-400">Analyzer</span>
          </h1>
          <p className="mt-2 text-xs text-slate-400">
            Compare your skills with industry requirements &amp; prepare for placements
          </p>
        </div>

        {/* Card Form */}
        <div className="card-surface p-7 border border-slate-700/80 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
          {error && (
            <div className="mb-5">
              <AlertBanner type="error" message={error} onDismiss={() => setError('')} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@student.edu"
                  className="w-full pl-3.5 pr-3.5 py-2.5 text-xs rounded-lg border border-slate-700 bg-slate-900/90 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.25)] transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 pr-10 text-xs rounded-lg border border-slate-700 bg-slate-900/90 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.25)] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-cyan-300 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="primary" loading={loading} className="w-full mt-2 py-3">
              <Shield className="w-4 h-4" />
              Sign In
            </Button>
          </form>

          <p className="mt-5 text-center text-xs text-slate-400">
            New student?{' '}
            <Link
              to="/register"
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 font-semibold"
            >
              Create an account &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
