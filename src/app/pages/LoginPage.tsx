import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { X, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import imgDisasterReliefScene from '../../imports/LoginModernTransparentStyle-1-1/382468de2bbae8dd38eb3457dfd55ddc4e30b40c.png';
import { supabase } from '../services/supabaseClient';

type ModalType = 'none' | 'forgotPassword';

export function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (!error && data.user) navigate('/dashboard', { replace: true });
    });
  }, [navigate]);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Validation errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Auth state
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Modal state
  const [modal, setModal] = useState<ModalType>('none');

  // Forgot password
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
    const { data: signInData, error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);

    if (error) {
      if (error.message === 'Invalid login credentials') {
        setAuthError('Email atau password salah.');
      } else if (error.message.toLowerCase().includes('email not confirmed')) {
        setAuthError('Email belum diverifikasi. Cek inbox email Anda dan klik link verifikasi.');
      } else {
        setAuthError(error.message);
      }
      return;
    }

    // First-time user → onboarding; returning user → dashboard
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
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <>
      <div
        className="relative flex items-start justify-center w-full min-h-screen"
        style={{
          background: 'linear-gradient(90deg, rgb(17, 24, 39) 0%, rgb(17, 24, 39) 100%)',
        }}
      >
        {/* Fixed Background */}
        <div className="fixed inset-0 z-0">
          <img
            src={imgDisasterReliefScene}
            alt=""
            className="w-full h-full object-cover opacity-80"
          />
          {/* Mobile: uniform dark overlay; Desktop: left-to-right gradient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.75) 50%, rgba(0,0,0,0.65) 100%)',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center max-w-[1280px] w-full min-h-screen px-4 sm:px-6 lg:px-24 py-8 sm:py-12">
          {/* Left Content — desktop only */}
          <div className="flex-1 flex-col items-start justify-center pr-8 hidden lg:flex">
            <div className="flex items-center gap-2 mb-8">
              <svg width="32" height="30" viewBox="0 0 31.5 30" fill="none">
                <path
                  d="M15.75 0L31.5 8.57143V21.4286L15.75 30L0 21.4286V8.57143L15.75 0Z"
                  fill="white"
                  opacity="0.9"
                />
              </svg>
              <span className="font-black text-white tracking-[1.6px] uppercase text-[32px]">
                BANSOS
              </span>
            </div>

            <div className="mb-8">
              <h1 className="text-white text-[64px] font-black leading-[1.1] tracking-[-1.6px] uppercase">
                BANJIR
                <br />
                &amp; SOSMED
              </h1>
            </div>

            <div className="max-w-md space-y-4">
              <p className="text-white text-xl leading-[1.5]">
                Empowering communities through reliable emergency reporting and transparent social
                assistance distribution.
              </p>
              <p className="text-[rgba(255,255,255,0.9)] text-base">
                Join us in making a difference where it matters most.
              </p>
            </div>
          </div>

          {/* Right Glass Card */}
          <div className="w-full lg:w-[480px] shrink-0">
            <div
              className="relative rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 lg:p-12"
              style={{
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0px 25px 50px -12px rgba(0,0,0,0.4)',
              }}
            >
              {/* ── Mobile-only branding header ── */}
              <div className="flex flex-col items-center gap-1 mb-6 lg:hidden">
                <div className="flex items-center gap-2 mb-1">
                  <svg width="26" height="24" viewBox="0 0 31.5 30" fill="none">
                    <path
                      d="M15.75 0L31.5 8.57143V21.4286L15.75 30L0 21.4286V8.57143L15.75 0Z"
                      fill="white"
                      opacity="0.9"
                    />
                  </svg>
                  <span className="font-black text-white tracking-[1.6px] uppercase text-[22px] sm:text-[26px]">
                    BANSOS
                  </span>
                </div>
                <h1 className="text-white text-2xl sm:text-3xl font-black uppercase tracking-tight text-center leading-tight">
                  BANJIR &amp; SOSMED
                </h1>
                <p className="text-white/70 text-xs sm:text-sm text-center max-w-xs mt-1">
                  Empowering communities through emergency reporting
                </p>
              </div>

              <form onSubmit={handleSignIn} className="space-y-5" noValidate>
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-white text-base font-medium block">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    placeholder="Enter your email"
                    className={`w-full bg-white rounded-lg px-4 py-4 text-gray-800 placeholder-gray-400 text-base shadow-sm focus:outline-none focus:ring-2 transition-all ${
                      emailError
                        ? 'border-2 border-red-400 focus:ring-red-300'
                        : 'border border-gray-400 focus:ring-blue-400'
                    }`}
                  />
                  {emailError && (
                    <p className="flex items-center gap-1.5 text-red-300 text-sm mt-1">
                      <AlertCircle size={14} className="shrink-0" />
                      {emailError}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-white text-base font-medium block">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    placeholder="••••••••••"
                    className={`w-full bg-white rounded-lg px-4 py-4 text-gray-800 placeholder-gray-400 text-base shadow-sm focus:outline-none focus:ring-2 transition-all ${
                      passwordError
                        ? 'border-2 border-red-400 focus:ring-red-300'
                        : 'border border-gray-400 focus:ring-blue-400'
                    }`}
                  />
                  {passwordError && (
                    <p className="flex items-center gap-1.5 text-red-300 text-sm mt-1">
                      <AlertCircle size={14} className="shrink-0" />
                      {passwordError}
                    </p>
                  )}
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setModal('forgotPassword')}
                      className="text-white text-sm underline decoration-[rgba(255,255,255,0.5)] hover:opacity-80 transition-opacity"
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>

                {/* Auth error */}
                {authError && (
                  <p className="flex items-center gap-1.5 text-red-300 text-sm">
                    <AlertCircle size={14} className="shrink-0" />
                    {authError}
                  </p>
                )}

                {/* Sign In Button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold uppercase tracking-wide py-4 rounded-lg transition-colors shadow-lg text-sm"
                  >
                    {isLoading ? 'Masuk...' : 'SIGN IN'}
                  </button>
                </div>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-5">
                <div className="flex-1 h-px bg-[rgba(255,255,255,0.4)]" />
                <span className="text-white text-base">or</span>
                <div className="flex-1 h-px bg-[rgba(255,255,255,0.4)]" />
              </div>

              {/* Google Sign In */}
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-lg border border-[rgba(255,255,255,0.5)] hover:bg-[rgba(255,255,255,0.1)] transition-colors text-white text-base font-medium"
              >
                <GoogleIcon />
                Sign in with Google
              </button>

              {/* Footer */}
              <div className="mt-5 text-center">
                <p className="text-[rgba(255,255,255,0.9)] text-base">
                  Are you new?{' '}
                  <button
                    onClick={() => navigate('/register')}
                    className="text-white font-medium underline decoration-[rgba(255,255,255,0.5)] hover:opacity-80 transition-opacity"
                  >
                    Create an Account
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Forgot Password Modal ── */}
      {modal === 'forgotPassword' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-2xl p-8 relative"
            style={{
              background: 'rgba(17, 24, 39, 0.95)',
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            }}
          >
            <button
              onClick={closeForgotPassword}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1"
            >
              <X size={20} />
            </button>

            {resetSent ? (
              <div className="flex flex-col items-center text-center gap-4 py-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle size={32} className="text-green-400" />
                </div>
                <div>
                  <h3 className="text-white text-xl font-semibold mb-2">Email Terkirim!</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Link reset password telah dikirim ke{' '}
                    <span className="text-blue-400 font-medium">{resetEmail}</span>.
                    Periksa inbox atau folder spam Anda.
                  </p>
                </div>
                <button
                  onClick={closeForgotPassword}
                  className="mt-2 w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold py-3 rounded-lg transition-colors text-sm"
                >
                  Kembali ke Login
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                    <Mail size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-semibold">Lupa Password?</h3>
                    <p className="text-gray-400 text-sm">Masukkan email untuk reset password</p>
                  </div>
                </div>

                <div className="space-y-1.5 mb-6">
                  <label className="text-gray-300 text-sm font-medium block">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => {
                      setResetEmail(e.target.value);
                      if (resetEmailError) setResetEmailError('');
                    }}
                    placeholder="Masukkan email Anda"
                    className={`w-full bg-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 text-sm border focus:outline-none focus:ring-2 transition-all ${
                      resetEmailError
                        ? 'border-red-400 focus:ring-red-400/30'
                        : 'border-white/20 focus:ring-blue-400/30'
                    }`}
                  />
                  {resetEmailError && (
                    <p className="flex items-center gap-1.5 text-red-400 text-xs mt-1">
                      <AlertCircle size={12} className="shrink-0" />
                      {resetEmailError}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={closeForgotPassword}
                    className="flex-1 py-3 rounded-lg border border-white/20 text-gray-300 hover:bg-white/5 transition-colors text-sm font-medium"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleForgotPasswordSubmit}
                    className="flex-1 py-3 rounded-lg bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold transition-colors text-sm"
                  >
                    Kirim Link Reset
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

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
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