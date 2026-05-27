import { createBrowserRouter, Navigate } from 'react-router';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { MapPage } from './pages/MapPage';
import { IncidentReportsPage } from './pages/IncidentReportsPage';
import { ReportDetailPage } from './pages/ReportDetailPage';
import { CreateReportPage } from './pages/CreateReportPage';
import { RiskAnalysisPage } from './pages/RiskAnalysisPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminPortalPage } from './pages/AdminPortalPage';

export const router = createBrowserRouter([
  { path: '/', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/admin/login', element: <AdminLoginPage /> },
  { path: '/admin/portal', element: <AdminPortalPage /> },
  { path: '/dashboard/map', element: <MapPage /> },
  { path: '/dashboard/reports/create', element: <CreateReportPage /> },
  { path: '/dashboard/reports/:id', element: <ReportDetailPage /> },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'reports', element: <IncidentReportsPage /> },
      { path: 'risk-analysis', element: <RiskAnalysisPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);