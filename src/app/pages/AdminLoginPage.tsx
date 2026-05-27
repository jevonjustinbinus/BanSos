import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Lock, Mail, Eye, EyeOff, Shield, ArrowLeft } from 'lucide-react';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // Simulate auth — accept admin@bansос.id / admin123
    setTimeout(() => {
      if (email === 'admin@bansos.id' && password === 'admin123') {
        navigate('/admin/portal');
      } else {
        setError('Email atau password tidak valid.');
        setLoading(false);
      }
    }, 900);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'linear-gradient(160deg, #0b0e15 0%, #10131a 60%, #0d1221 100%)' }}
    >
      {/* Back button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="absolute top-6 left-6 flex items-center gap-2 text-[#8c909f] hover:text-[#e1e2ec] text-sm transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Dashboard
      </button>

      {/* Card */}
      <div
        className="w-full max-w-sm bg-[#1d2027] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 shadow-2xl"
        style={{ boxShadow: '0 0 60px rgba(173,198,255,0.04), 0 24px 48px rgba(0,0,0,0.5)' }}
      >
        {/* Icon + Title */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: 'linear-gradient(135deg, rgba(173,198,255,0.15) 0%, rgba(96,165,250,0.08) 100%)',
              border: '1px solid rgba(173,198,255,0.2)',
              boxShadow: '0 0 20px rgba(173,198,255,0.08)',
            }}
          >
            <Shield size={28} className="text-[#adc6ff]" />
          </div>
          <h1 className="text-[#e1e2ec] text-2xl font-bold tracking-tight">Admin Portal</h1>
          <p className="text-[#8c909f] text-sm mt-1 text-center">
            Masuk dengan kredensial admin untuk mengakses portal.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[#c2c6d6] text-xs uppercase tracking-widest font-semibold">
              Email Admin
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c909f]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bansos.id"
                required
                className="w-full bg-[#10131a] border border-[#424754] rounded-xl pl-10 pr-4 py-3 text-[#e1e2ec] placeholder-[#4a5060] text-sm focus:outline-none focus:border-[rgba(173,198,255,0.5)] focus:ring-1 focus:ring-[rgba(173,198,255,0.15)] transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[#c2c6d6] text-xs uppercase tracking-widest font-semibold">
              Password
            </label>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c909f]" />
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#10131a] border border-[#424754] rounded-xl pl-10 pr-10 py-3 text-[#e1e2ec] placeholder-[#4a5060] text-sm focus:outline-none focus:border-[rgba(173,198,255,0.5)] focus:ring-1 focus:ring-[rgba(173,198,255,0.15)] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c909f] hover:text-[#e1e2ec] transition-colors"
              >
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-[#ffb4ab] text-xs bg-[rgba(255,68,68,0.08)] border border-[rgba(255,68,68,0.2)] rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#adc6ff] hover:bg-[#c7d9ff] text-[#002e6a] text-sm font-bold transition-all shadow-[0_0_20px_rgba(173,198,255,0.25)] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            style={{ transition: 'all 0.2s' }}
          >
            {loading ? 'Memverifikasi...' : 'Masuk ke Admin Portal'}
          </button>
        </form>

        {/* Hint */}
        <p className="text-[#4a5060] text-xs text-center mt-5">
          Demo: admin@bansos.id · admin123
        </p>
      </div>
    </div>
  );
}
