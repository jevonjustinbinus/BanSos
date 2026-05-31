import { useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router';
import { supabase } from '../services/supabaseClient';

export function AdminGuard({ children }: { children: ReactNode }) {
  const hasAdminSession = sessionStorage.getItem('admin_auth');
  return hasAdminSession ? <>{children}</> : <Navigate to="/admin/login" replace />;
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'authed' | 'unauthed'>('loading');

  useEffect(() => {
    let mounted = true;

    supabase.auth.getUser().then(({ data, error }) => {
      if (!mounted) return;

      if (error || !data.user) {
        void supabase.auth.signOut();
        setStatus('unauthed');
        return;
      }

      setStatus('authed');
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (status === 'loading') return null;
  if (status === 'unauthed') return <Navigate to="/" replace />;

  return <>{children}</>;
}
