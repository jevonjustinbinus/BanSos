import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AlertCircle } from 'lucide-react';
import imgDisasterReliefScene from '../../imports/RegisterModernTransparentStyle-1-1/382468de2bbae8dd38eb3457dfd55ddc4e30b40c.png';
import { supabase } from '../services/supabaseClient';

export function RegisterPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [registered, setRegistered] = useState(false);

  const validateEmail = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const newErrors: typeof errors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Nama lengkap wajib diisi.';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Nama minimal 2 karakter.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email wajib diisi.';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Format email tidak valid.';
    }

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
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName.trim() },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    setIsLoading(false);

    if (error) {
      setAuthError(error.message === 'User already registered'
        ? 'Email ini sudah terdaftar. Silakan login.'
        : error.message);
      return;
    }

    setRegistered(true);
  };

  const handleGoogleSignUp = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  };

  const clearError = (field: keyof typeof errors) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div
      className="relative min-h-screen"
      style={{
        background: 'linear-gradient(90deg, rgb(17, 24, 39) 0%, rgb(17, 24, 39) 100%)',
      }}
    >
      {/* Fixed Background — covers viewport at all scroll positions */}
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
                Buat Akun Baru
              </h2>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-4" noValidate>
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-white text-sm font-medium block">Nama Lengkap</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => { setFullName(e.target.value); clearError('fullName'); }}
                  placeholder="Masukkan nama lengkap"
                  className={`w-full bg-white rounded-lg px-4 py-3.5 text-gray-800 placeholder-gray-400 text-sm border shadow-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.fullName
                      ? 'border-2 border-red-400 focus:ring-red-300'
                      : 'border-gray-300 focus:ring-blue-400'
                  }`}
                />
                {errors.fullName && (
                  <p className="flex items-center gap-1.5 text-red-300 text-xs">
                    <AlertCircle size={12} className="shrink-0" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-white text-sm font-medium block">Alamat Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
                  placeholder="Masukkan email Anda"
                  className={`w-full bg-white rounded-lg px-4 py-3.5 text-gray-800 placeholder-gray-400 text-sm border shadow-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? 'border-2 border-red-400 focus:ring-red-300'
                      : 'border-gray-300 focus:ring-blue-400'
                  }`}
                />
                {errors.email && (
                  <p className="flex items-center gap-1.5 text-red-300 text-xs">
                    <AlertCircle size={12} className="shrink-0" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-white text-sm font-medium block">Password</label>
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
                {/* Password strength hint */}
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
                      {password.length < 8
                        ? 'Lemah'
                        : password.length < 12
                        ? 'Cukup'
                        : 'Kuat'}
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
                  placeholder="Ulangi password Anda"
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

              {/* Auth error */}
              {authError && (
                <p className="flex items-center gap-1.5 text-red-300 text-sm">
                  <AlertCircle size={14} className="shrink-0" />
                  {authError}
                </p>
              )}

              {/* Sukses registrasi */}
              {registered && (
                <div className="rounded-lg bg-green-500/20 border border-green-400/30 px-4 py-3 text-green-300 text-sm leading-relaxed">
                  Akun berhasil dibuat! Cek email Anda untuk verifikasi sebelum login.
                </div>
              )}

              {/* Create Account Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || registered}
                  className="w-full bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold uppercase tracking-wide py-3.5 rounded-lg transition-colors shadow-lg text-sm"
                >
                  {isLoading ? 'Membuat Akun...' : 'BUAT AKUN'}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-5">
              <div className="flex-1 h-px bg-[rgba(255,255,255,0.4)]" />
              <span className="text-white text-sm">atau</span>
              <div className="flex-1 h-px bg-[rgba(255,255,255,0.4)]" />
            </div>

            {/* Google Sign Up */}
            <button
              onClick={handleGoogleSignUp}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-lg border border-[rgba(255,255,255,0.5)] hover:bg-[rgba(255,255,255,0.1)] transition-colors text-white text-sm font-medium"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path
                  d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z"
                  fill="#4285F4"
                />
                <path
                  d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z"
                  fill="#34A853"
                />
                <path
                  d="M4.405 11.9A6.01 6.01 0 014.09 10c0-.664.114-1.308.314-1.9V5.51H1.064A9.997 9.997 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z"
                  fill="#FBBC05"
                />
                <path
                  d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.192 5.736 7.396 3.977 10 3.977z"
                  fill="#EA4335"
                />
              </svg>
              Daftar dengan Google
            </button>

            {/* Footer */}
            <div className="mt-5 text-center">
              <p className="text-[rgba(255,255,255,0.9)] text-sm">
                Sudah punya akun?{' '}
                <button
                  onClick={() => navigate('/')}
                  className="text-white font-medium underline decoration-[rgba(255,255,255,0.5)] hover:opacity-80 transition-opacity"
                >
                  Masuk
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
