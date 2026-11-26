import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Terminal, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import { AlertBanner } from '../components/common/Feedback';
import { ACADEMIC_YEARS } from '../utils/constants';
import { extractErrorMessage } from '../utils/formatters';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    college: '',
    department: '',
    academicYear: '4th Year',
    graduationYear: new Date().getFullYear() + 1,
    cgpa: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        graduationYear: Number(form.graduationYear),
        cgpa: form.cgpa ? Number(form.cgpa) : null,
      };
      await register(payload);
      navigate('/student/dashboard', { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to initialize profile. Verify inputs.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-[#0B1120]">
      {/* Background radial glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1px] shadow-[0_0_25px_rgba(34,211,238,0.3)] mb-3">
            <div className="w-full h-full bg-[#0B1120] rounded-xl flex items-center justify-center">
              <Terminal className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-2xl font-mono font-bold tracking-tight text-white">
            INITIALIZE DEVELOPER PROFILE
          </h1>
          <p className="mt-1 text-xs font-mono text-slate-400">
            Provision candidate account for Placement Readiness Analysis
          </p>
        </div>

        <div className="card-surface p-7 border border-slate-700/80 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
          {error && (
            <div className="mb-5">
              <AlertBanner type="error" message={error} onDismiss={() => setError('')} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Full Name *
              </label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                placeholder="Aarav Sharma"
                className="w-full px-3.5 py-2 text-xs font-mono rounded-lg border border-slate-700 bg-slate-900/90 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Username Identifier *
              </label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                placeholder="aarav_dev"
                className="w-full px-3.5 py-2 text-xs font-mono rounded-lg border border-slate-700 bg-slate-900/90 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Email / Academic Handle *
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="aarav@university.edu"
                className="w-full px-3.5 py-2 text-xs font-mono rounded-lg border border-slate-700 bg-slate-900/90 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Security Key / Passphrase *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Min 6 characters"
                  className="w-full px-3.5 py-2 pr-10 text-xs font-mono rounded-lg border border-slate-700 bg-slate-900/90 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-2 text-slate-400 hover:text-cyan-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Phone Number
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full px-3.5 py-2 text-xs font-mono rounded-lg border border-slate-700 bg-slate-900/90 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                College / University *
              </label>
              <input
                name="college"
                value={form.college}
                onChange={handleChange}
                required
                placeholder="Indian Institute of Technology"
                className="w-full px-3.5 py-2 text-xs font-mono rounded-lg border border-slate-700 bg-slate-900/90 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Department / Discipline *
              </label>
              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                required
                placeholder="Computer Science &amp; Engineering"
                className="w-full px-3.5 py-2 text-xs font-mono rounded-lg border border-slate-700 bg-slate-900/90 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Academic Standing *
              </label>
              <select
                name="academicYear"
                value={form.academicYear}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-xs font-mono rounded-lg border border-slate-700 bg-slate-900/90 text-slate-100 focus:outline-none focus:border-cyan-400 transition-all"
              >
                {ACADEMIC_YEARS.map((y) => (
                  <option key={y} value={y} className="bg-slate-900 text-slate-100">
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Graduation Cohort Year *
              </label>
              <input
                type="number"
                name="graduationYear"
                value={form.graduationYear}
                onChange={handleChange}
                required
                min={2020}
                max={2035}
                className="w-full px-3.5 py-2 text-xs font-mono rounded-lg border border-slate-700 bg-slate-900/90 text-slate-100 focus:outline-none focus:border-cyan-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                CGPA Benchmark (Optional)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                name="cgpa"
                value={form.cgpa}
                onChange={handleChange}
                placeholder="8.75"
                className="w-full px-3.5 py-2 text-xs font-mono rounded-lg border border-slate-700 bg-slate-900/90 text-slate-100 focus:outline-none focus:border-cyan-400 transition-all"
              />
            </div>

            <div className="sm:col-span-2 pt-3">
              <Button type="submit" variant="primary" loading={loading} className="w-full py-3">
                <ShieldCheck className="w-4 h-4" />
                CREATE ACCOUNT &amp; ENTER ARENA
              </Button>
            </div>
          </form>

          <p className="mt-5 text-center text-xs font-mono text-slate-400">
            Already verified?{' '}
            <Link
              to="/login"
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 font-semibold"
            >
              Sign into session &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
