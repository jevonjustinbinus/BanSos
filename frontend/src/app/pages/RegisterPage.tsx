import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AlertCircle, CheckCircle } from 'lucide-react';
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
        data: {
          full_name: fullName.trim(),
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setIsLoading(false);

    if (error) {
      setAuthError(
        error.message === 'User already registered'
          ? 'Email ini sudah terdaftar. Silakan masuk.'
          : error.message,
      );
      return;
    }

    navigate('/verify-email', {
      state: { email },
    });
  };

  const handleGoogleSignUp = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const clearError = (field: keyof typeof errors) => {
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }

    if (authError) {
      setAuthError('');
    }
  };

  const passwordStrength =
    password.length >= 12 ? 'Kuat' : password.length >= 8 ? 'Cukup' : 'Lemah';

  const passwordStrengthColor =
    password.length >= 12
      ? 'bg-green-400'
      : password.length >= 8
        ? 'bg-blue-400'
        : 'bg-orange-400';

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#f6f9ff] px-4 py-6 sm:px-6 lg:px-10">
      {/* Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.28),transparent_34%),radial-gradient(circle_at_top_right,rgba(191,219,254,0.55),transparent_32%),linear-gradient(135deg,#f8fbff_0%,#eef5ff_45%,#ffffff_100%)]" />

        <div className="absolute -left-28 top-16 h-72 w-72 rounded-full bg-blue-300/40 blur-3xl sm:h-80 sm:w-80" />
        <div className="absolute right-[-140px] top-24 h-80 w-80 rounded-full bg-sky-200/60 blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute bottom-[-160px] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-white blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute bottom-24 right-1/4 h-48 w-48 rounded-full bg-blue-100/80 blur-2xl sm:h-56 sm:w-56" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40" />
      </div>

      {/* Content */}
      <div className="relative z-10 grid w-full max-w-[1120px] grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_480px] lg:gap-14">
        {/* Left Content */}
        <div className="hidden lg:block">
          <div className="mb-8 flex items-center gap-2">
            <LogoMark size={32} />

            <span className="text-[32px] font-black uppercase tracking-[1.6px] text-slate-950">
              BANSOS
            </span>
          </div>

          <h1 className="text-[60px] font-black uppercase leading-[1.08] tracking-[-1.6px] text-slate-950">
            Mulai
            <br />
            Pantau Wilayah
          </h1>

          <div className="mt-7 max-w-md space-y-4">
            <p className="text-xl leading-[1.5] text-slate-700">
              Buat akun untuk memantau risiko banjir, menyimpan lokasi penting,
              dan mengirim laporan kejadian di sekitar Anda.
            </p>

            <p className="text-base leading-relaxed text-slate-500">
              Sistem ini membantu masyarakat mendapatkan informasi risiko secara
              lebih cepat, berbasis lokasi, dan berbasis laporan komunitas.
            </p>
          </div>

          <div className="mt-10 grid max-w-lg grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/70 bg-white/50 p-4 shadow-sm backdrop-blur-xl">
              <p className="text-sm font-semibold text-slate-900">
                Simpan Lokasi
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Pantau lokasi rumah, kampus, kantor, atau area yang penting bagi Anda.
              </p>
            </div>

            <div className="rounded-2xl border border-white/70 bg-white/50 p-4 shadow-sm backdrop-blur-xl">
              <p className="text-sm font-semibold text-slate-900">
                Lapor Kejadian
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Bantu orang di sekitar Anda dengan mengirim laporan kejadian banjir secara
                cepat.
              </p>
            </div>
          </div>
        </div>

        {/* Register Card */}
        <div className="mx-auto w-full max-w-[460px] lg:max-w-none">
          <div className="relative rounded-[26px] border border-white/70 bg-white/65 p-5 shadow-[0_24px_80px_rgba(37,99,235,0.16)] backdrop-blur-2xl sm:rounded-[32px] sm:p-8 lg:p-10">
            {/* Mobile Header */}
            <div className="mb-6 flex flex-col items-center text-center lg:hidden">
              <div className="mb-2 flex items-center gap-2">
                <LogoMark size={26} />

                <span className="text-[24px] font-black uppercase tracking-[1.4px] text-slate-200">
                  BANSOS
                </span>
              </div>

              <h1 className="mt-4 text-2xl font-black uppercase leading-tight tracking-tight text-slate-300 sm:text-3xl">
                Buat Akun
              </h1>

              <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-400">
                Daftar untuk memantau risiko banjir dan laporan masyarakat di
                sekitar Anda.
              </p>
            </div>

            {/* Desktop Header */}
            <div className="mb-6 hidden lg:block">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
                Daftar akun
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-200">
                Buat akun baru
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Isi data di bawah untuk mulai menggunakan dashboard pemantauan.
              </p>
            </div>

            <form
              onSubmit={handleCreateAccount}
              className="space-y-4"
              noValidate
            >
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-300 sm:text-base">
                  Nama lengkap
                </label>

                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    clearError('fullName');
                  }}
                  placeholder="Masukkan nama lengkap"
                  className={`w-full rounded-xl bg-white/85 px-4 py-3.5 text-sm text-slate-800 shadow-sm outline-none transition-all placeholder:text-slate-400 sm:text-base ${
                    errors.fullName
                      ? 'border-2 border-red-300 focus:ring-4 focus:ring-red-100'
                      : 'border border-blue-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-100'
                  }`}
                />

                {errors.fullName && (
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-red-500 sm:text-sm">
                    <AlertCircle size={14} className="shrink-0" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-300 sm:text-base">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError('email');
                  }}
                  placeholder="Masukkan email Anda"
                  className={`w-full rounded-xl bg-white/85 px-4 py-3.5 text-sm text-slate-800 shadow-sm outline-none transition-all placeholder:text-slate-400 sm:text-base ${
                    errors.email
                      ? 'border-2 border-red-300 focus:ring-4 focus:ring-red-100'
                      : 'border border-blue-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-100'
                  }`}
                />

                {errors.email && (
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-red-500 sm:text-sm">
                    <AlertCircle size={14} className="shrink-0" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-300 sm:text-base">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearError('password');
                  }}
                  placeholder="Minimal 8 karakter"
                  className={`w-full rounded-xl bg-white/85 px-4 py-3.5 text-sm text-slate-800 shadow-sm outline-none transition-all placeholder:text-slate-400 sm:text-base ${
                    errors.password
                      ? 'border-2 border-red-300 focus:ring-4 focus:ring-red-100'
                      : 'border border-blue-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-100'
                  }`}
                />

                {errors.password && (
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-red-500 sm:text-sm">
                    <AlertCircle size={14} className="shrink-0" />
                    {errors.password}
                  </p>
                )}

                {password && !errors.password && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="grid flex-1 grid-cols-4 gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 rounded-full transition-colors ${
                            password.length >= i * 3
                              ? passwordStrengthColor
                              : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>

                    <span className="text-[10px] font-medium text-slate-500">
                      {passwordStrength}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-300 sm:text-base">
                  Konfirmasi password
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    clearError('confirmPassword');
                  }}
                  placeholder="Ulangi password Anda"
                  className={`w-full rounded-xl bg-white/85 px-4 py-3.5 text-sm text-slate-800 shadow-sm outline-none transition-all placeholder:text-slate-400 sm:text-base ${
                    errors.confirmPassword
                      ? 'border-2 border-red-300 focus:ring-4 focus:ring-red-100'
                      : confirmPassword && confirmPassword === password
                        ? 'border-2 border-green-300 focus:ring-4 focus:ring-green-100'
                        : 'border border-blue-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-100'
                  }`}
                />

                {errors.confirmPassword && (
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-red-500 sm:text-sm">
                    <AlertCircle size={14} className="shrink-0" />
                    {errors.confirmPassword}
                  </p>
                )}

                {!errors.confirmPassword &&
                  confirmPassword &&
                  confirmPassword === password && (
                    <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-green-600 sm:text-sm">
                      <CheckCircle size={14} className="shrink-0" />
                      Password cocok
                    </p>
                  )}
              </div>

              {/* Auth error */}
              {authError && (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2">
                  <AlertCircle
                    size={14}
                    className="mt-0.5 shrink-0 text-red-500"
                  />
                  <p className="text-xs leading-relaxed text-red-600 sm:text-sm">
                    {authError}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-4 w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {isLoading ? 'Membuat akun...' : 'Buat akun'}
              </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-sm text-slate-400">atau</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Google Sign Up */}
            <button
              onClick={handleGoogleSignUp}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-blue-100 bg-white/70 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-white sm:text-base"
            >
              <GoogleIcon />
              Daftar dengan Google
            </button>

            {/* Footer */}
            <div className="mt-5 text-center">
              <p className="text-sm text-slate-500 sm:text-base">
                Sudah punya akun?{' '}
                <button
                  onClick={() => navigate('/')}
                  className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
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

function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={(size * 30) / 31.5}
      viewBox="0 0 31.5 30"
      fill="none"
      className="shrink-0"
    >
      <path
        d="M15.75 0L31.5 8.57143V21.4286L15.75 30L0 21.4286V8.57143L15.75 0Z"
        fill="#2563eb"
        opacity="0.95"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className="shrink-0"
    >
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
  );
}