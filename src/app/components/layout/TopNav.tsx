<<<<<<< HEAD
import { useState, useRef, useEffect } from 'react';
import { Bell, Search, Menu, X, AlertTriangle, CheckCircle, Info, User } from 'lucide-react';
import { useNavigate } from 'react-router';
import imgSystemAdministrator from '../../../imports/Dashboard-1-1/0eaa054e4d1460477cef8d1f4484a3a4900ab059.png';
=======
import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bell,
  Menu,
  X,
  AlertTriangle,
  CheckCircle,
  Info,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import imgSystemAdministrator from '../../../imports/Dashboard-1-1/0eaa054e4d1460477cef8d1f4484a3a4900ab059.png';
import {
  fetchBroadcasts,
  fetchReports,
  type BroadcastAlert,
  type CommunityReport,
} from '../../services/api';
import {
  DEFAULT_LAT,
  DEFAULT_LNG,
  getSessionLocation,
} from '../../services/primaryLocation';
>>>>>>> commit2-update

interface TopNavProps {
  onMenuToggle?: () => void;
}

<<<<<<< HEAD
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
=======
type NotificationType = 'critical' | 'warning' | 'success' | 'info';

interface DashboardNotification {
  id: string;
  type: NotificationType;
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

const NOTIFICATION_RADIUS_KM = 5;

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const earthRadiusKm = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

function formatRelativeTime(dateString?: string) {
  if (!dateString) return 'Baru saja';

  const created = new Date(dateString).getTime();
  const now = Date.now();
  const diffMinutes = Math.max(0, Math.floor((now - created) / 60000));

  if (diffMinutes < 1) return 'Baru saja';
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) return `${diffHours} jam lalu`;

  const diffDays = Math.floor(diffHours / 24);

  return `${diffDays} hari lalu`;
}

function notificationTypeFromSeverity(severity?: string): NotificationType {
  const value = severity?.toUpperCase();

  if (value === 'KRITIS' || value === 'CRITICAL' || value === 'HIGH') {
    return 'critical';
  }

  if (value === 'SEDANG' || value === 'WARNING' || value === 'MEDIUM') {
    return 'warning';
  }

  if (value === 'RENDAH' || value === 'LOW') {
    return 'info';
  }

  return 'info';
}

function notifIcon(type: NotificationType) {
  switch (type) {
    case 'critical':
      return <AlertTriangle size={14} className="text-red-400" />;
    case 'warning':
      return <AlertTriangle size={14} className="text-orange-400" />;
    case 'success':
      return <CheckCircle size={14} className="text-green-400" />;
    default:
      return <Info size={14} className="text-blue-400" />;
  }
}

function notifDot(type: NotificationType) {
  switch (type) {
    case 'critical':
      return 'bg-red-500';
    case 'warning':
      return 'bg-orange-400';
    case 'success':
      return 'bg-green-500';
    default:
      return 'bg-blue-400';
  }
}

function buildReportNotification(report: CommunityReport): DashboardNotification {
  const type = notificationTypeFromSeverity(report.severity);

  return {
    id: `report-${report.id}`,
    type,
    title:
      type === 'critical'
        ? `Laporan Kritis: ${report.category}`
        : `Laporan Sekitar: ${report.category}`,
    desc: `${report.title} — ${report.location_name ?? 'Lokasi tidak tersedia'}`,
    time: formatRelativeTime(report.created_at),
    read: false,
  };
}

function buildBroadcastNotification(alert: BroadcastAlert): DashboardNotification {
  const type = notificationTypeFromSeverity(alert.severity);

  return {
    id: `broadcast-${alert.id}`,
    type,
    title: alert.title,
    desc: alert.message,
    time: formatRelativeTime(alert.created_at),
    read: false,
  };
}

export function TopNav({ onMenuToggle }: TopNavProps) {
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifList, setNotifList] = useState<DashboardNotification[]>([]);
  const [notificationLoading, setNotificationLoading] = useState(false);
>>>>>>> commit2-update
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifList.filter((n) => !n.read).length;

<<<<<<< HEAD
  // Close panel on outside click
=======
  const loadNotifications = useCallback(async () => {
    const savedLocation = getSessionLocation();

    const userLat = savedLocation?.lat ?? DEFAULT_LAT;
    const userLng = savedLocation?.lng ?? DEFAULT_LNG;

    setNotificationLoading(true);

    try {
      const [reportsResult, broadcastsResult] = await Promise.all([
        fetchReports('approved'),
        fetchBroadcasts(),
      ]);

      const reports = reportsResult.data ?? [];
      const broadcasts = broadcastsResult.data ?? [];

      const nearbyReports = reports
        .filter((report) => {
          if (typeof report.latitude !== 'number' || typeof report.longitude !== 'number') {
            return false;
          }

          const distance = distanceKm(
            userLat,
            userLng,
            report.latitude,
            report.longitude,
          );

          return distance <= NOTIFICATION_RADIUS_KM;
        })
        .slice(0, 5)
        .map(buildReportNotification);

      const nearbyBroadcasts = broadcasts
        .filter((alert) => {
          if (typeof alert.latitude !== 'number' || typeof alert.longitude !== 'number') {
            return false;
          }

          const radiusKm = alert.radius_m ? alert.radius_m / 1000 : NOTIFICATION_RADIUS_KM;

          const distance = distanceKm(
            userLat,
            userLng,
            alert.latitude,
            alert.longitude,
          );

          return distance <= radiusKm;
        })
        .slice(0, 5)
        .map(buildBroadcastNotification);

      const mergedNotifications = [...nearbyBroadcasts, ...nearbyReports].slice(0, 8);

      setNotifList((prev) => {
        const readMap = new Map(prev.map((item) => [item.id, item.read]));

        return mergedNotifications.map((item) => ({
          ...item,
          read: readMap.get(item.id) ?? false,
        }));
      });
    } catch (error) {
      console.error('Gagal mengambil notifikasi:', error);
      setNotifList([]);
    } finally {
      setNotificationLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();

    const interval = window.setInterval(() => {
      loadNotifications();
    }, 60 * 1000);

    const onLocationUpdated = () => {
      loadNotifications();
    };

    window.addEventListener('bansos-location-updated', onLocationUpdated);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('bansos-location-updated', onLocationUpdated);
    };
  }, [loadNotifications]);

>>>>>>> commit2-update
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
<<<<<<< HEAD
    document.addEventListener('mousedown', handler);
=======

    document.addEventListener('mousedown', handler);

>>>>>>> commit2-update
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = () => {
    setNotifList((prev) => prev.map((n) => ({ ...n, read: true })));
  };

<<<<<<< HEAD
  return (
    <header className="h-[56px] lg:h-[60px] shrink-0 flex items-center justify-between px-4 lg:px-6 bg-[#10131a] border-b border-[rgba(255,255,255,0.06)] z-30">
      {/* Left: Hamburger + Logo */}
=======
  const handleOpenNotifications = () => {
    setShowNotifications((value) => !value);
    loadNotifications();
  };

  return (
    <header className="h-[56px] lg:h-[60px] shrink-0 flex items-center justify-between px-4 lg:px-6 bg-[#10131a] border-b border-[rgba(255,255,255,0.06)] z-30">
>>>>>>> commit2-update
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-[#94a3b8] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
<<<<<<< HEAD
=======

>>>>>>> commit2-update
        <button
          onClick={() => navigate('/dashboard')}
          className="text-[#60a5fa] text-xl font-black tracking-tighter hover:opacity-80 transition-opacity"
        >
          BanSos
        </button>
      </div>

<<<<<<< HEAD
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
=======
      <div className="flex items-center gap-1 lg:gap-3">
        <div className="relative" ref={notifRef}>
          <button
            onClick={handleOpenNotifications}
            className="relative p-2 rounded-full text-[#94a3b8] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            aria-label="Buka notifikasi"
          >
            <Bell size={18} />

>>>>>>> commit2-update
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

<<<<<<< HEAD
          {/* Notification Panel */}
          {showNotifications && (
            <div className="fixed top-[56px] lg:top-[60px] left-2 right-2 sm:left-auto sm:right-2 sm:w-[340px] bg-[#1d2027] border border-[rgba(255,255,255,0.1)] rounded-xl shadow-2xl overflow-hidden z-50">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-2">
                  <Bell size={14} className="text-[#adc6ff]" />
                  <span className="text-[#e1e2ec] text-sm font-semibold">Notifikasi</span>
=======
          {showNotifications && (
            <div className="fixed top-[56px] lg:top-[60px] left-2 right-2 sm:left-auto sm:right-2 sm:w-[360px] bg-[#1d2027] border border-[rgba(255,255,255,0.1)] rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-2">
                  <Bell size={14} className="text-[#adc6ff]" />

                  <span className="text-[#e1e2ec] text-sm font-semibold">
                    Notifikasi Lokasi
                  </span>

>>>>>>> commit2-update
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
<<<<<<< HEAD
=======

>>>>>>> commit2-update
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[#adc6ff] text-xs hover:underline transition-colors"
                    >
<<<<<<< HEAD
                      Tandai semua dibaca
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-[#8c909f] hover:text-[#e1e2ec] p-0.5"
=======
                      Tandai dibaca
                    </button>
                  )}

                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-[#8c909f] hover:text-[#e1e2ec] p-0.5"
                    aria-label="Tutup notifikasi"
>>>>>>> commit2-update
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

<<<<<<< HEAD
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
=======
              <div className="max-h-[360px] overflow-y-auto divide-y divide-[rgba(255,255,255,0.04)]">
                {notificationLoading && (
                  <div className="px-4 py-4">
                    <p className="text-[#8c909f] text-xs">
                      Memuat notifikasi berdasarkan lokasi Anda...
                    </p>
                  </div>
                )}

                {!notificationLoading && notifList.length === 0 && (
                  <div className="px-4 py-4">
                    <p className="text-[#e1e2ec] text-sm font-medium">
                      Belum ada notifikasi di sekitar lokasi Anda.
                    </p>

                    <p className="text-[#8c909f] text-xs mt-1">
                      Sistem hanya menampilkan laporan dan broadcast dalam radius sekitar{' '}
                      {NOTIFICATION_RADIUS_KM} km dari lokasi aktif.
                    </p>
                  </div>
                )}

                {!notificationLoading &&
                  notifList.map((n) => (
                    <div
                      key={n.id}
                      className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-[rgba(255,255,255,0.03)] transition-colors ${
                        !n.read ? 'bg-[rgba(173,198,255,0.04)]' : ''
                      }`}
                      onClick={() => {
                        setNotifList((prev) =>
                          prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)),
                        );
                      }}
                    >
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

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-xs font-semibold leading-tight ${
                              !n.read ? 'text-[#e1e2ec]' : 'text-[#c2c6d6]'
                            }`}
                          >
                            {n.title}
                          </p>

                          {!n.read && (
                            <div
                              className={`w-2 h-2 rounded-full shrink-0 mt-0.5 ${notifDot(
                                n.type,
                              )}`}
                            />
                          )}
                        </div>

                        <p className="text-[#8c909f] text-xs mt-0.5 line-clamp-2">
                          {n.desc}
                        </p>

                        <p className="text-[#8c909f] text-[10px] mt-1">
                          {n.time}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="px-4 py-2.5 border-t border-[rgba(255,255,255,0.06)] flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/dashboard/map');
                  }}
                  className="text-[#adc6ff] text-xs hover:underline transition-colors"
                >
                  Lihat di peta
>>>>>>> commit2-update
                </button>
              </div>
            </div>
          )}
        </div>

<<<<<<< HEAD
        {/* Profile Avatar */}
=======
>>>>>>> commit2-update
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