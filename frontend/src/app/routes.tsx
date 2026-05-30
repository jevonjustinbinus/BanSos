import { createBrowserRouter, Navigate } from 'react-router';
import { useEffect, useState, type ReactNode } from 'react';
import { supabase } from './services/supabaseClient';

function AdminGuard({ children }: { children: ReactNode }) {
  if (!sessionStorage.getItem('admin_auth')) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'authed' | 'unauthed'>('loading');

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data.user) {
        supabase.auth.signOut();
        setStatus('unauthed');
      } else {
        setStatus('authed');
      }
    });
  }, []);

  if (status === 'loading') return null;
  if (status === 'unauthed') return <Navigate to="/" replace />;
  return <>{children}</>;
}

import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { MapPage } from './pages/MapPage';
import { IncidentReportsPage } from './pages/IncidentReportsPage';
import { ReportDetailPage } from './pages/ReportDetailPage';
import { CreateReportPage } from './pages/CreateReportPage';
import { RiskAnalysisPage } from './pages/RiskAnalysisPage';
import { MyReportsPage } from './pages/MyReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminPortalPage } from './pages/AdminPortalPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { OnboardingPage } from './pages/OnboardingPage';

export const router = createBrowserRouter([
  { path: '/', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/verify-email', element: <VerifyEmailPage /> },
  { path: '/auth/callback', element: <AuthCallbackPage /> },
  { path: '/onboarding', element: <ProtectedRoute><OnboardingPage /></ProtectedRoute> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
  { path: '/admin/login', element: <AdminLoginPage /> },
  { path: '/admin/portal', element: <AdminGuard><AdminPortalPage /></AdminGuard> },
  { path: '/dashboard/map', element: <ProtectedRoute><MapPage /></ProtectedRoute> },
  { path: '/dashboard/reports/create', element: <ProtectedRoute><CreateReportPage /></ProtectedRoute> },
  { path: '/dashboard/reports/:id', element: <ProtectedRoute><ReportDetailPage /></ProtectedRoute> },
  {
    path: '/dashboard',
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'reports', element: <IncidentReportsPage /> },
      { path: 'my-reports', element: <MyReportsPage /> },
      { path: 'risk-analysis', element: <RiskAnalysisPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
