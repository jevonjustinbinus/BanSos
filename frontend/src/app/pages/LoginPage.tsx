import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { X, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

type ModalType = 'none' | 'forgotPassword';

export function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (!error && data.user) navigate('/dashboard', { replace: true });
    });
  }, [navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const [modal, setModal] = useState<ModalType>('none');

  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailError, setResetEmailError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const validateEmail = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    setAuthError('');

    let valid = true;

    if (!email.trim()) {
      setEmailError('Email wajib diisi.');
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Format email tidak valid.');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password.trim()) {
      setPasswordError('Password wajib diisi.');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password minimal 6 karakter.');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (!valid) return;

    setIsLoading(true);

    const { data: signInData, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    setIsLoading(false);

    if (error) {
      if (error.message === 'Invalid login credentials') {
        setAuthError('Email atau password salah.');
      } else if (error.message.toLowerCase().includes('email not confirmed')) {
        setAuthError(
          'Email belum diverifikasi. Silakan cek inbox email Anda dan klik tautan verifikasi.',
        );
      } else {
        setAuthError(error.message);
      }

      return;
    }

    const onboarded = signInData.user?.user_metadata?.onboarding_complete;

    navigate(onboarded ? '/dashboard' : '/onboarding');
  };

  const handleForgotPasswordSubmit = async () => {
    if (!resetEmail.trim()) {
      setResetEmailError('Email wajib diisi.');
      return;
    }

    if (!validateEmail(resetEmail)) {
      setResetEmailError('Format email tidak valid.');
      return;
    }

    setResetEmailError('');

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setResetEmailError(error.message);
      return;
    }

    setResetSent(true);
  };

  const closeForgotPassword = () => {
    setModal('none');
    setResetEmail('');
    setResetEmailError('');
    setResetSent(false);
  };

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <>
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
        <div className="relative z-10 grid w-full max-w-[1120px] grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_460px] lg:gap-14">
          {/* Left Content */}
          <div className="hidden lg:block">
            <div className="mb-8 flex items-center gap-2">
              <LogoMark size={32} />

              <span className="text-[32px] font-black uppercase tracking-[1.6px] text-slate-950">
                BANSOS
              </span>
            </div>

            <h1 className="text-[60px] font-black uppercase leading-[1.08] tracking-[-1.6px] text-slate-950">
              Banjir
              <br />
              &amp; Sosmed
            </h1>

            <div className="mt-7 max-w-md space-y-4">
              <p className="text-xl leading-[1.5] text-slate-700">
                Pantau risiko banjir, laporan masyarakat, dan informasi bantuan
                sosial dalam satu sistem yang mudah digunakan.
              </p>

              <p className="text-base leading-relaxed text-slate-500">
                Masuk untuk melihat kondisi wilayah, memantau laporan sekitar,
                dan mengelola lokasi pantauan Anda.
              </p>
            </div>

            <div className="mt-10 grid max-w-lg grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/70 bg-white/50 p-4 shadow-sm backdrop-blur-xl">
                <p className="text-sm font-semibold text-slate-900">
                  Laporan Real-time
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Pantau laporan banjir dari masyarakat secara cepat dan
                  terstruktur.
                </p>
              </div>

              <div className="rounded-2xl border border-white/40 bg-white/50 p-4 shadow-sm backdrop-blur-xl">
                <p className="text-sm font-semibold text-slate-900">
                  Analisis Risiko
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Lihat risiko banjir berdasarkan lokasi yang Anda pilih.
                </p>
              </div>
            </div>
          </div>

          {/* Login Card */}
          <div className="mx-auto w-full max-w-[440px] lg:max-w-none">
            <div className="relative rounded-[26px] border border-white/70 bg-white/65 p-5 shadow-[0_24px_80px_rgba(37,99,235,0.16)] backdrop-blur-2xl sm:rounded-[32px] sm:p-8 lg:p-10">
              {/* Mobile Header */}
              <div className="mb-6 flex flex-col items-center text-center lg:hidden">
                <div className="mb-2 flex items-center gap-2">
                  <LogoMark size={26} />

                  <span className="text-[30px] font-black uppercase tracking-[1.4px] text-slate-200">
                    BANSOS
                  </span>
                </div>

                <p className=" max-w-xs text-sm leading-relaxed text-slate-400">
                  Pantau risiko banjir dan laporan masyarakat di sekitar Anda.
                </p>
              </div>

              {/* Desktop Card Header */}
              <div className="mb-6 hidden lg:block">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
                  Selamat datang
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-200">
                  Masuk ke akun Anda
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Akses dashboard pemantauan banjir dan laporan masyarakat.
                </p>
              </div>

              <form onSubmit={handleSignIn} className="space-y-4 sm:space-y-5" noValidate>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-200 sm:text-base">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    placeholder="Masukkan email Anda"
                    className={`w-full rounded-xl bg-white/85 px-4 py-3.5 text-sm text-slate-800 shadow-sm outline-none transition-all placeholder:text-slate-400 sm:py-4 sm:text-base ${
                      emailError
                        ? 'border-2 border-red-300 focus:ring-4 focus:ring-red-100'
                        : 'border border-blue-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-100'
                    }`}
                  />

                  {emailError && (
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-red-500 sm:text-sm">
                      <AlertCircle size={14} className="shrink-0" />
                      {emailError}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-200 sm:text-base">
                    Password
                  </label>

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    placeholder="Masukkan password Anda"
                    className={`w-full rounded-xl bg-white/85 px-4 py-3.5 text-sm text-slate-800 shadow-sm outline-none transition-all placeholder:text-slate-400 sm:py-4 sm:text-base ${
                      passwordError
                        ? 'border-2 border-red-300 focus:ring-4 focus:ring-red-100'
                        : 'border border-blue-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-100'
                    }`}
                  />

                  {passwordError && (
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-red-500 sm:text-sm">
                      <AlertCircle size={14} className="shrink-0" />
                      {passwordError}
                    </p>
                  )}

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setModal('forgotPassword')}
                      className="text-xs font-semibold text-blue-600 transition-opacity hover:opacity-80 sm:text-sm"
                    >
                      Lupa password?
                    </button>
                  </div>
                </div>

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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:py-4"
                >
                  {isLoading ? 'Memproses...' : 'Masuk'}
                </button>
              </form>

              <div className="my-5 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-sm text-slate-400">atau</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <button
                onClick={handleGoogleSignIn}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-blue-100 bg-white/70 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-white sm:py-4 sm:text-base"
              >
                <GoogleIcon />
                Masuk dengan Google
              </button>

              <div className="mt-5 text-center">
                <p className="text-sm text-slate-500 sm:text-base">
                  Belum punya akun?{' '}
                  <button
                    onClick={() => navigate('/register')}
                    className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
                  >
                    Daftar sekarang
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {modal === 'forgotPassword' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-[440px] rounded-[26px] border border-white/70 bg-white/70 p-5 shadow-[0_24px_80px_rgba(37,99,235,0.18)] backdrop-blur-2xl sm:rounded-[32px] sm:p-8">
            <button
              onClick={closeForgotPassword}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 transition-colors hover:bg-white/70 hover:text-slate-900"
              aria-label="Tutup modal lupa password"
            >
              <X size={20} />
            </button>

            {resetSent ? (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle size={32} className="text-green-500" />
                </div>

                <div>
                  <h3 className="mb-2 text-xl font-bold text-slate-950">
                    Email reset terkirim
                  </h3>

                  <p className="text-sm leading-relaxed text-slate-600">
                    Tautan reset password telah dikirim ke{' '}
                    <span className="font-semibold text-blue-600">
                      {resetEmail}
                    </span>
                    . Silakan cek inbox atau folder spam Anda.
                  </p>
                </div>

                <button
                  onClick={closeForgotPassword}
                  className="mt-2 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Kembali ke halaman masuk
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6 pr-8">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-blue-100">
                    <Mail size={21} className="text-blue-600" />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-200">
                    Lupa password?
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    Masukkan email akun Anda. Kami akan mengirimkan tautan untuk
                    mengatur ulang password.
                  </p>
                </div>

                <div className="mb-6 space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-200">
                    Email
                  </label>

                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => {
                      setResetEmail(e.target.value);
                      if (resetEmailError) setResetEmailError('');
                    }}
                    placeholder="Masukkan email Anda"
                    className={`w-full rounded-xl bg-white/85 px-4 py-3.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 ${
                      resetEmailError
                        ? 'border border-red-300 focus:ring-4 focus:ring-red-100'
                        : 'border border-blue-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-100'
                    }`}
                  />

                  {resetEmailError && (
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-red-500">
                      <AlertCircle size={12} className="shrink-0" />
                      {resetEmailError}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    onClick={closeForgotPassword}
                    className="rounded-xl border border-slate-100/60 bg-white/60 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-white"
                  >
                    Batal
                  </button>

                  <button
                    onClick={handleForgotPasswordSubmit}
                    className="rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                  >
                    Kirim tautan reset
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
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