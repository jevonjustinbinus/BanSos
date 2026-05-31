import { createBrowserRouter, Navigate } from 'react-router';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { AdminGuard, ProtectedRoute } from './guards';
import { pages } from './lazy';

const protectedPage = (element: JSX.Element) => <ProtectedRoute>{element}</ProtectedRoute>;
const adminPage = (element: JSX.Element) => <AdminGuard>{element}</AdminGuard>;

export const router = createBrowserRouter([
  { path: '/', element: pages.login },
  { path: '/register', element: pages.register },
  { path: '/verify-email', element: pages.verifyEmail },
  { path: '/auth/callback', element: pages.authCallback },
  { path: '/onboarding', element: protectedPage(pages.onboarding) },
  { path: '/reset-password', element: pages.resetPassword },
  { path: '/admin/login', element: pages.adminLogin },
  { path: '/admin/portal', element: adminPage(pages.adminPortal) },
  { path: '/dashboard/map', element: protectedPage(pages.map) },
  { path: '/dashboard/reports/create', element: protectedPage(pages.createReport) },
  { path: '/dashboard/reports/:id', element: protectedPage(pages.reportDetail) },
  {
    path: '/dashboard',
    element: protectedPage(<DashboardLayout />),
    children: [
      { index: true, element: pages.dashboard },
      { path: 'reports', element: pages.incidentReports },
      { path: 'my-reports', element: pages.myReports },
      { path: 'risk-analysis', element: pages.riskAnalysis },
      { path: 'settings', element: pages.settings },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
