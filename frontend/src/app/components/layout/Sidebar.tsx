import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  LayoutDashboard, FileText, BarChart3, HelpCircle,
  LogOut, X, Settings, Lock, MapPin, Star,
} from 'lucide-react';
import { SupportModal } from '../SupportModal';
import { supabase } from '../../services/supabaseClient';
import { fetchSavedLocations } from '../../services/api';
import { getSessionLocationName } from '../../services/primaryLocation';
import './sidebar.css';
interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}
interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}
const navItems: NavItem[] = [
  { label: 'Dashboard',        icon: <LayoutDashboard size={18} />, path: '/dashboard' },
  { label: 'Incident Reports', icon: <FileText size={18} />,        path: '/dashboard/reports' },
  { label: 'My Reports',       icon: <Star size={18} />,            path: '/dashboard/my-reports' },
  { label: 'Risk Analysis',    icon: <BarChart3 size={18} />,       path: '/dashboard/risk-analysis' },
];
const adminItem: NavItem = {
  label: 'Admin Portal',
  icon: <Lock size={18} />,
  path: '/admin/login',
};
export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  // ── User profile ─────────────────────────────────────────────────────────
  const [supportOpen,    setSupportOpen]    = useState(false);
  const [avatarUrl,      setAvatarUrl]      = useState('');
  const [userName,       setUserName]       = useState('');
  const [userEmail,      setUserEmail]      = useState('');
  const [primaryAddress, setPrimaryAddress] = useState('');
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      const user = data.user;
      setAvatarUrl(user.user_metadata?.avatar_url ?? '');
      setUserName(user.user_metadata?.full_name ?? user.email ?? 'Pengguna');
      setUserEmail(user.email ?? '');
      const primaryId: string | undefined = user.user_metadata?.primary_location_id;
      try {
        const res = await fetchSavedLocations(user.id);
        if (res.data.length > 0) {
          const primary =
            (primaryId ? res.data.find((l) => l.id === primaryId) : undefined) ??
            res.data[0];
          setPrimaryAddress(primary.name || primary.address || '');
        }
      } catch { /* non-critical */ }
    };
    load();
    window.addEventListener('bansos-profile-updated', load);

    const onLocationUpdated = () => {
      const name = getSessionLocationName();
      if (name) setPrimaryAddress(name);
    };
    window.addEventListener('bansos-location-updated', onLocationUpdated);

    return () => {
      window.removeEventListener('bansos-profile-updated', load);
      window.removeEventListener('bansos-location-updated', onLocationUpdated);
    };
  }, []);
  // ── Helpers ──────────────────────────────────────────────────────────────
  const isActive = (path: string) =>
    path === '/dashboard'
      ? location.pathname === '/dashboard'
      : location.pathname.startsWith(path);
  const handleNav = (path: string) => { navigate(path); onClose?.(); };
  const activeNavClass = 'bansos-sidebar__nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left';
  return (
    <>
      <aside
        className={`
          bansos-sidebar fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
          w-[240px] lg:w-[220px] shrink-0 flex flex-col h-full
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* ── Mobile header ─────────────────────────────────────── */}
        <div
          className="lg:hidden flex items-center justify-between px-4 py-3 border-b bansos-sidebar__section"
        >
          <span className="text-[#60a5fa] text-lg font-black tracking-tighter">BanSos</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bansos-sidebar__nav-item transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        {/* ── User profile ──────────────────────────────────────── */}
        <div className="px-4 py-4 border-b bansos-sidebar__section" >
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard/settings')}
              className="relative rounded-full size-9 overflow-hidden transition-colors focus:outline-none shrink-0 border theme-border"
              title="Profile & Settings"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={userName || 'Profile'}
                  className="size-full object-cover"
                  onError={() => setAvatarUrl('')}
                />
              ) : (
                <div
                  className="bansos-sidebar__avatar size-full flex items-center justify-center text-xs font-bold"
                >
                  {(userName || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </button>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight truncate" >
                {userName || 'Pengguna'}
              </p>
              <p className="text-xs truncate" >
                {userEmail}
              </p>
              {primaryAddress && (
                <p className="flex items-center gap-1 text-[10px] truncate mt-0.5 text-[#60a5fa]">
                  <MapPin size={9} className="shrink-0" />
                  {primaryAddress}
                </p>
              )}
            </div>
          </div>
        </div>
        {/* ── Navigation ────────────────────────────────────────── */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={activeNavClass}
                data-active={active}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
          <div className="my-2 border-t theme-border" />
          {/* Admin Portal */}
          <button
            onClick={() => handleNav(adminItem.path)}
            className="bansos-sidebar__admin w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-opacity text-left group"
          >
            <span
              className="group-hover:opacity-100 transition-opacity"
              style={{ opacity: 0.7 }}
            >
              {adminItem.icon}
            </span>
            <span
              className="group-hover:opacity-100 transition-opacity"
              style={{ opacity: 0.7 }}
            >
              {adminItem.label}
            </span>
          </button>
        </nav>
        {/* ── Bottom actions ────────────────────────────────────── */}
        <div className="px-3 py-4 space-y-1 border-t bansos-sidebar__section">
          {(() => {
            const active = isActive('/dashboard/settings');
            return (
              <button
                className={activeNavClass}
                data-active={active}
                onClick={() => handleNav('/dashboard/settings')}
              >
                <span><Settings size={18} /></span>
                Settings
              </button>
            );
          })()}
          <button
            className="bansos-sidebar__nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
            onClick={() => setSupportOpen(true)}
          >
            <HelpCircle size={18} />
            Support
          </button>
          <button
            className="bansos-sidebar__nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
            onClick={async () => { await supabase.auth.signOut(); navigate('/'); onClose?.(); }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
      <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />
    </>
  );
}
