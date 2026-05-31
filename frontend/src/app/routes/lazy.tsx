import { lazy, Suspense, type ComponentType } from 'react';

function page<T extends ComponentType<object>>(loader: () => Promise<{ [key: string]: T }>, exportName: string) {
  const Component = lazy(async () => {
    const mod = await loader();
    return { default: mod[exportName] };
  });

  return (
    <Suspense fallback={<div className="min-h-screen theme-page" />}>
      <Component />
    </Suspense>
  );
}

export const pages = {
  login: page(() => import('../pages/LoginPage'), 'LoginPage'),
  register: page(() => import('../pages/RegisterPage'), 'RegisterPage'),
  verifyEmail: page(() => import('../pages/VerifyEmailPage'), 'VerifyEmailPage'),
  authCallback: page(() => import('../pages/AuthCallbackPage'), 'AuthCallbackPage'),
  onboarding: page(() => import('../pages/OnboardingPage'), 'OnboardingPage'),
  resetPassword: page(() => import('../pages/ResetPasswordPage'), 'ResetPasswordPage'),
  adminLogin: page(() => import('../pages/AdminLoginPage'), 'AdminLoginPage'),
  adminPortal: page(() => import('../pages/AdminPortalPage'), 'AdminPortalPage'),
  dashboard: page(() => import('../pages/DashboardPage'), 'DashboardPage'),
  map: page(() => import('../pages/MapPage'), 'MapPage'),
  incidentReports: page(() => import('../pages/IncidentReportsPage'), 'IncidentReportsPage'),
  reportDetail: page(() => import('../pages/ReportDetailPage'), 'ReportDetailPage'),
  createReport: page(() => import('../pages/CreateReportPage'), 'CreateReportPage'),
  riskAnalysis: page(() => import('../pages/RiskAnalysisPage'), 'RiskAnalysisPage'),
  myReports: page(() => import('../pages/MyReportsPage'), 'MyReportsPage'),
  settings: page(() => import('../pages/SettingsPage'), 'SettingsPage'),
};
