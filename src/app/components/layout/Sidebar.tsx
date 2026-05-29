import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  HelpCircle,
  LogOut,
  X,
  Settings,
  Lock,
} from 'lucide-react';
import imgSystemAdministrator from '../../../imports/Dashboard-1-1/0eaa054e4d1460477cef8d1f4484a3a4900ab059.png';
import { SupportModal } from '../SupportModal';
import { supabase } from '../../services/supabaseClient';

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
  { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
  { label: 'Incident Reports', icon: <FileText size={18} />, path: '/dashboard/reports' },
  { label: 'Risk Analysis', icon: <BarChart3 size={18} />, path: '/dashboard/risk-analysis' },
];

const adminItem: NavItem = { label: 'Admin Portal', icon: <Lock size={18} />, path: '/admin/login' };

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [supportOpen, setSupportOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserName(data.user.user_metadata?.full_name ?? data.user.email ?? '');
        setUserEmail(data.user.email ?? '');
      }
    });
  }, []);

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const handleNav = (path: string) => {
    navigate(path);
    onClose?.();
  };

  return (
    <>
      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
          w-[240px] lg:w-[220px] shrink-0
          flex flex-col bg-[#10131a] border-r border-[rgba(255,255,255,0.06)] h-full
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Mobile close button */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
          <span className="text-[#60a5fa] text-lg font-black tracking-tighter">BanSos</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94a3b8] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* User profile */}
        <div className="px-4 py-4 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNav('/dashboard/settings')}
              className="relative rounded-full shrink-0 size-10 overflow-hidden border border-[#424754] hover:border-[#adc6ff] transition-colors focus:outline-none focus:ring-2 focus:ring-[#adc6ff] focus:ring-offset-2 focus:ring-offset-[#10131a]"
              title="Go to Settings"
            >
              <img src={imgSystemAdministrator} alt="User" className="size-full object-cover" />
            </button>
            <div className="min-w-0">
              <p className="text-[#e1e2ec] text-sm font-medium leading-tight truncate">{userName || 'Pengguna'}</p>
              <p className="text-[#8c909f] text-xs truncate">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                isActive(item.path)
                  ? 'bg-[#1a2744] text-[#adc6ff]'
                  : 'text-[#8c909f] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#e1e2ec]'
              }`}
            >
              <span className={isActive(item.path) ? 'text-[#adc6ff]' : 'text-[#8c909f]'}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}

          {/* Divider */}
          <div className="my-2 border-t border-[rgba(255,255,255,0.05)]" />

          {/* Admin Portal */}
          <button
            onClick={() => handleNav(adminItem.path)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left group"
            style={{ background: 'rgba(173,198,255,0.04)', border: '1px solid rgba(173,198,255,0.08)' }}
          >
            <span className="text-[#adc6ff] opacity-70 group-hover:opacity-100 transition-opacity">
              {adminItem.icon}
            </span>
            <span className="text-[#adc6ff] opacity-70 group-hover:opacity-100 transition-opacity font-medium">
              {adminItem.label}
            </span>
          </button>
        </nav>

        {/* Bottom links */}
        <div className="px-3 py-4 border-t border-[rgba(255,255,255,0.06)] space-y-1">
          <button
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              isActive('/dashboard/settings')
                ? 'bg-[#1a2744] text-[#adc6ff]'
                : 'text-[#8c909f] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#e1e2ec]'
            }`}
            onClick={() => handleNav('/dashboard/settings')}
          >
            <Settings size={18} />
            Settings
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#8c909f] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#e1e2ec] transition-colors"
            onClick={() => setSupportOpen(true)}
          >
            <HelpCircle size={18} />
            Support
          </button>
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#8c909f] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#e1e2ec] transition-colors"
            onClick={async () => { await supabase.auth.signOut(); navigate('/'); onClose?.(); }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Support Modal */}
      <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />
    </>
  );
}