import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Mail, RefreshCw, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email ?? '';

  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [resendMessage, setResendMessage] = useState('');

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    setResendStatus('idle');

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    setResending(false);
    if (error) {
      setResendStatus('error');
      setResendMessage(error.message);
    } else {
      setResendStatus('success');
      setResendMessage('Email verifikasi telah dikirim ulang. Cek inbox Anda.');
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-6"
      style={{ background: 'linear-gradient(135deg, rgb(17,24,39) 0%, rgb(30,41,59) 100%)' }}
    >
      <div
        className="w-full max-w-[440px] rounded-[32px] p-8 lg:p-10 text-center"
        style={{
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0px 25px 50px -12px rgba(0,0,0,0.4)',
        }}
      >
        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
            <Mail className="text-blue-400" size={32} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-white text-2xl font-bold mb-2">Verifikasi Email Anda</h1>
        <p className="text-gray-300 text-sm leading-relaxed mb-1">
          Kami telah mengirim link verifikasi ke:
        </p>
        {email && (
          <p className="text-blue-300 font-semibold text-sm mb-5 break-all">{email}</p>
        )}
        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          Buka email tersebut dan klik tombol <strong className="text-white">Verifikasi Email</strong> untuk mengaktifkan akun Anda.
        </p>

        {/* Resend status */}
        {resendStatus === 'success' && (
          <div className="flex items-center gap-2 bg-green-500/20 border border-green-400/30 rounded-lg px-4 py-3 text-green-300 text-sm mb-4">
            <CheckCircle2 size={16} className="shrink-0" />
            {resendMessage}
          </div>
        )}
        {resendStatus === 'error' && (
          <div className="flex items-center gap-2 bg-red-500/20 border border-red-400/30 rounded-lg px-4 py-3 text-red-300 text-sm mb-4">
            <AlertCircle size={16} className="shrink-0" />
            {resendMessage}
          </div>
        )}

        {/* Resend button */}
        {email && (
          <button
            onClick={handleResend}
            disabled={resending}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-white/30 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors mb-3"
          >
            <RefreshCw size={15} className={resending ? 'animate-spin' : ''} />
            {resending ? 'Mengirim ulang...' : 'Kirim ulang email verifikasi'}
          </button>
        )}

        {/* Back to login */}
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-gray-400 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft size={15} />
          Kembali ke halaman login
        </button>

        {/* Help text */}
        <p className="mt-5 text-gray-500 text-xs">
          Tidak menerima email? Cek folder spam atau klik tombol kirim ulang di atas.
        </p>
      </div>
    </div>
  );
}
