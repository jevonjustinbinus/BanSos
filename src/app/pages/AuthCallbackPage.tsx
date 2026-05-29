import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          setStatus('error');
          setErrorMessage('Link verifikasi tidak valid atau sudah kadaluarsa. Silakan minta link baru.');
        } else {
          setStatus('success');
          setTimeout(() => navigate('/dashboard', { replace: true }), 1500);
        }
      });
    } else {
      // Fallback: check if session already exists (implicit flow)
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          setStatus('success');
          setTimeout(() => navigate('/dashboard', { replace: true }), 1500);
        } else {
          setStatus('error');
          setErrorMessage('Verifikasi gagal. Link tidak valid atau sudah kadaluarsa.');
        }
      });
    }
  }, [navigate]);

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-6"
      style={{ background: 'linear-gradient(135deg, rgb(17,24,39) 0%, rgb(30,41,59) 100%)' }}
    >
      <div
        className="w-full max-w-[400px] rounded-[32px] p-8 text-center"
        style={{
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0px 25px 50px -12px rgba(0,0,0,0.4)',
        }}
      >
        {status === 'loading' && (
          <>
            <div className="flex justify-center mb-5">
              <Loader2 className="text-blue-400 animate-spin" size={48} />
            </div>
            <h1 className="text-white text-xl font-bold mb-2">Memverifikasi akun...</h1>
            <p className="text-gray-400 text-sm">Mohon tunggu sebentar.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-400/30 flex items-center justify-center">
                <CheckCircle2 className="text-green-400" size={36} />
              </div>
            </div>
            <h1 className="text-white text-xl font-bold mb-2">Email Terverifikasi!</h1>
            <p className="text-gray-300 text-sm">Akun Anda berhasil diverifikasi. Mengalihkan ke dashboard...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-400/30 flex items-center justify-center">
                <AlertCircle className="text-red-400" size={36} />
              </div>
            </div>
            <h1 className="text-white text-xl font-bold mb-2">Verifikasi Gagal</h1>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">{errorMessage}</p>
            <button
              onClick={() => navigate('/register')}
              className="w-full py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-colors mb-3"
            >
              Daftar ulang
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 rounded-lg border border-white/20 hover:bg-white/10 text-gray-300 text-sm transition-colors"
            >
              Kembali ke login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
