import { useState, useRef, useEffect } from 'react';
import { Bell, Search, Menu, X, AlertTriangle, CheckCircle, Info, User } from 'lucide-react';
import { useNavigate } from 'react-router';
import imgSystemAdministrator from '../../../imports/Dashboard-1-1/0eaa054e4d1460477cef8d1f4484a3a4900ab059.png';

interface TopNavProps {
  onMenuToggle?: () => void;
}

const notifications = [
  {
    id: '1',
    type: 'critical',
    title: 'Risiko Banjir Tinggi Terdeteksi',
    desc: 'Potensi banjir di area Kemang dalam 6 jam ke depan.',
    time: '2 menit lalu',
    read: false,
  },
  {
    id: '2',
    type: 'warning',
    title: 'Laporan Baru: Pohon Tumbang',
    desc: 'Pohon tumbang di Kebon Jeruk menutup 2 lajur jalan.',
    time: '14 menit lalu',
    read: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'Update Cuaca BMKG',
    desc: 'Intensitas hujan meningkat: 42 mm/hr di Jakarta Selatan.',
    time: '1 jam lalu',
    read: true,
  },
  {
    id: '4',
    type: 'success',
    title: 'Laporan #001 Dikonfirmasi',
    desc: '12 anggota komunitas telah mengkonfirmasi laporan Anda.',
    time: '2 jam lalu',
    read: true,
  },
  {
    id: '5',
    type: 'info',
    title: 'Evakuasi: Cilandak Update',
    desc: 'Genangan air mulai surut, akses jalan kembali normal.',
    time: '3 jam lalu',
    read: true,
  },
];

const notifIcon = (type: string) => {
  switch (type) {
    case 'critical': return <AlertTriangle size={14} className="text-red-400" />;
    case 'warning': return <AlertTriangle size={14} className="text-orange-400" />;
    case 'success': return <CheckCircle size={14} className="text-green-400" />;
    default: return <Info size={14} className="text-blue-400" />;
  }
};

const notifDot = (type: string) => {
  switch (type) {
    case 'critical': return 'bg-red-500';
    case 'warning': return 'bg-orange-400';
    case 'success': return 'bg-green-500';
    default: return 'bg-blue-400';
  }
};

export function TopNav({ onMenuToggle }: TopNavProps) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifList, setNotifList] = useState(notifications);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifList.filter((n) => !n.read).length;

  // Close panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = () => {
    setNotifList((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="h-[56px] lg:h-[60px] shrink-0 flex items-center justify-between px-4 lg:px-6 bg-[#10131a] border-b border-[rgba(255,255,255,0.06)] z-30">
      {/* Left: Hamburger + Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-[#94a3b8] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-[#60a5fa] text-xl font-black tracking-tighter hover:opacity-80 transition-opacity"
        >
          BanSos
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1 lg:gap-3">
        {/* Search — desktop only */}
        <div className="relative hidden md:flex items-center">
          <Search size={14} className="absolute left-3 text-[#8c909f]" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-[#1d2027] border border-[rgba(255,255,255,0.08)] rounded-full pl-8 pr-4 py-1.5 text-sm text-[#e1e2ec] placeholder-[#8c909f] focus:outline-none focus:border-[rgba(173,198,255,0.3)] w-44"
          />
        </div>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications((v) => !v)}
            className="relative p-2 rounded-full text-[#94a3b8] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Panel */}
          {showNotifications && (
            <div className="fixed top-[56px] lg:top-[60px] left-2 right-2 sm:left-auto sm:right-2 sm:w-[340px] bg-[#1d2027] border border-[rgba(255,255,255,0.1)] rounded-xl shadow-2xl overflow-hidden z-50">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-2">
                  <Bell size={14} className="text-[#adc6ff]" />
                  <span className="text-[#e1e2ec] text-sm font-semibold">Notifikasi</span>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[#adc6ff] text-xs hover:underline transition-colors"
                    >
                      Tandai semua dibaca
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-[#8c909f] hover:text-[#e1e2ec] p-0.5"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Notification items */}
              <div className="max-h-[360px] overflow-y-auto divide-y divide-[rgba(255,255,255,0.04)]">
                {notifList.map((n) => (
                  <div
                    key={n.id}
                    className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-[rgba(255,255,255,0.03)] transition-colors ${
                      !n.read ? 'bg-[rgba(173,198,255,0.04)]' : ''
                    }`}
                    onClick={() => {
                      setNotifList((prev) =>
                        prev.map((x) => (x.id === n.id ? { ...x, read: true } : x))
                      );
                    }}
                  >
                    {/* Icon */}
                    <div className="mt-0.5 shrink-0">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center ${
                          n.type === 'critical'
                            ? 'bg-red-500/15'
                            : n.type === 'warning'
                            ? 'bg-orange-400/15'
                            : n.type === 'success'
                            ? 'bg-green-500/15'
                            : 'bg-blue-400/15'
                        }`}
                      >
                        {notifIcon(n.type)}
                      </div>
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-xs font-semibold leading-tight ${!n.read ? 'text-[#e1e2ec]' : 'text-[#c2c6d6]'}`}>
                          {n.title}
                        </p>
                        {!n.read && (
                          <div className={`w-2 h-2 rounded-full shrink-0 mt-0.5 ${notifDot(n.type)}`} />
                        )}
                      </div>
                      <p className="text-[#8c909f] text-xs mt-0.5 line-clamp-2">{n.desc}</p>
                      <p className="text-[#8c909f] text-[10px] mt-1">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-[rgba(255,255,255,0.06)] flex justify-center">
                <button className="text-[#adc6ff] text-xs hover:underline transition-colors">
                  Lihat semua notifikasi
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <button
          onClick={() => navigate('/dashboard/settings')}
          className="relative rounded-full size-9 overflow-hidden border border-[#424754] hover:border-[#adc6ff] transition-colors focus:outline-none focus:ring-2 focus:ring-[#adc6ff] focus:ring-offset-2 focus:ring-offset-[#10131a] shrink-0"
          title="Profile & Settings"
        >
          <img src={imgSystemAdministrator} alt="Profile" className="size-full object-cover" />
        </button>
      </div>
    </header>
  );
}