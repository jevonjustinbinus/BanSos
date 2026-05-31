import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { AlertCircle } from 'lucide-react';
import imgDisasterReliefScene from '../../assets/images/disaster-relief-scene.png';
import { supabase } from '../services/supabaseClient';

type PageState = 'loading' | 'form' | 'success' | 'invalid';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>('loading');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setPageState('form');
      }
    });

    const timer = setTimeout(() => {
      setPageState((prev) => (prev === 'loading' ? 'invalid' : prev));
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const clearError = (field: keyof typeof errors) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    const newErrors: typeof errors = {};

    if (!password) {
      newErrors.password = 'Password wajib diisi.';
    } else if (password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password wajib diisi.';
    } else if (password && confirmPassword !== password) {
      newErrors.confirmPassword = 'Password tidak cocok.';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsLoading(false);

    if (error) {
      setSubmitError(error.message);
      return;
    }

    setPageState('success');
  };

  return (
    <div
      className="relative min-h-screen"
      style={{ background: 'linear-gradient(90deg, rgb(17, 24, 39) 0%, rgb(17, 24, 39) 100%)' }}
    >
      {/* Fixed Background */}
      <div className="fixed inset-0 z-0">
        <img
          src={imgDisasterReliefScene}
          alt=""
          className="w-full h-full object-cover opacity-80"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.3) 100%)',
          }}
        />
      </div>

      {/* Scrollable content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 lg:px-24 py-12">
        <div className="w-full max-w-[480px]">
          <div
            className="relative rounded-[32px] p-8 lg:p-12"
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0px 25px 50px -12px rgba(0,0,0,0.25)',
            }}
          >
            {/* Header */}
            <div className="flex flex-col items-center gap-2 mb-6">
              <div className="flex items-center gap-2">
                <svg width="28" height="26" viewBox="0 0 31.5 30" fill="none">
                  <path
                    d="M15.75 0L31.5 8.57143V21.4286L15.75 30L0 21.4286V8.57143L15.75 0Z"
                    fill="white"
                    opacity="0.9"
                  />
                </svg>
                <span className="font-black text-white tracking-[1.6px] uppercase text-[28px]">
                  BANSOS
                </span>
              </div>
              <h2 className="text-white text-xl font-semibold text-center drop-shadow-sm">
                {pageState === 'success' ? 'Password Berhasil Diubah' : 'Buat Password Baru'}
              </h2>
            </div>

            {/* Loading */}
            {pageState === 'loading' && (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="w-10 h-10 border-2 border-white/20 border-t-blue-400 rounded-full animate-spin" />
                <p className="text-white/70 text-sm">Memverifikasi link reset password...</p>
              </div>
            )}

            {/* Invalid link */}
            {pageState === 'invalid' && (
              <div className="flex flex-col items-center text-center gap-4 py-4">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertCircle size={32} className="text-red-300" />
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Link Tidak Valid</p>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Link reset password sudah kadaluarsa atau tidak valid. Silakan minta link baru.
                  </p>
                </div>
                <div className="pt-2 w-full">
                  <button
                    onClick={() => navigate('/')}
                    className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold uppercase tracking-wide py-3.5 rounded-lg transition-colors shadow-lg text-sm"
                  >
                    KEMBALI KE LOGIN
                  </button>
                </div>
              </div>
            )}

            {/* Form */}
            {pageState === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-white text-sm font-medium block">Password Baru</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
                    placeholder="Minimal 8 karakter"
                    className={`w-full bg-white rounded-lg px-4 py-3.5 text-gray-800 placeholder-gray-400 text-sm border shadow-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.password
                        ? 'border-2 border-red-400 focus:ring-red-300'
                        : 'border-gray-300 focus:ring-blue-400'
                    }`}
                  />
                  {errors.password && (
                    <p className="flex items-center gap-1.5 text-red-300 text-xs">
                      <AlertCircle size={12} className="shrink-0" />
                      {errors.password}
                    </p>
                  )}
                  {/* Password strength */}
                  {password && !errors.password && (
                    <div className="flex gap-1 mt-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            password.length >= i * 3
                              ? password.length < 8
                                ? 'bg-orange-400'
                                : 'bg-green-400'
                              : 'bg-white/20'
                          }`}
                        />
                      ))}
                      <span className="text-[10px] text-gray-300 ml-1 self-center">
                        {password.length < 8 ? 'Lemah' : password.length < 12 ? 'Cukup' : 'Kuat'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-white text-sm font-medium block">Konfirmasi Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); clearError('confirmPassword'); }}
                    placeholder="Ulangi password baru"
                    className={`w-full bg-white rounded-lg px-4 py-3.5 text-gray-800 placeholder-gray-400 text-sm border shadow-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.confirmPassword
                        ? 'border-2 border-red-400 focus:ring-red-300'
                        : confirmPassword && confirmPassword === password
                        ? 'border-2 border-green-400 focus:ring-green-300'
                        : 'border-gray-300 focus:ring-blue-400'
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="flex items-center gap-1.5 text-red-300 text-xs">
                      <AlertCircle size={12} className="shrink-0" />
                      {errors.confirmPassword}
                    </p>
                  )}
                  {!errors.confirmPassword && confirmPassword && confirmPassword === password && (
                    <p className="flex items-center gap-1.5 text-green-300 text-xs">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
                        <path d="M2 6l2.5 3L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Password cocok
                    </p>
                  )}
                </div>

                {/* Submit error */}
                {submitError && (
                  <p className="flex items-center gap-1.5 text-red-300 text-sm">
                    <AlertCircle size={14} className="shrink-0" />
                    {submitError}
                  </p>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold uppercase tracking-wide py-3.5 rounded-lg transition-colors shadow-lg text-sm"
                  >
                    {isLoading ? 'Menyimpan...' : 'SIMPAN PASSWORD BARU'}
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="text-white/70 text-sm hover:text-white transition-opacity underline decoration-white/30"
                  >
                    Kembali ke Login
                  </button>
                </div>
              </form>
            )}

            {/* Success */}
            {pageState === 'success' && (
              <div className="flex flex-col items-center text-center gap-4 py-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Password Anda telah berhasil diperbarui. Silakan masuk dengan password baru.
                  </p>
                </div>
                <div className="pt-2 w-full">
                  <button
                    onClick={() => navigate('/')}
                    className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold uppercase tracking-wide py-3.5 rounded-lg transition-colors shadow-lg text-sm"
                  >
                    MASUK SEKARANG
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
