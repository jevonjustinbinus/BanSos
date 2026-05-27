import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import type { Map as LeafletMap } from 'leaflet';
import { ArrowLeft, Plus, Minus, Search, ChevronUp, ChevronDown, Bell, Settings, X, AlertTriangle, CheckCircle, Info, SlidersHorizontal, MapPin, Loader2 } from 'lucide-react';
import { reports, mapRiskPoints } from '../data/reports';
import imgFloodedStreet from '../../imports/BanSosImmersiveMapDashboard-1-1/eceb2ccdba1950d9889fd09510cc1f0d660cdce5.png';
import '../utils/leaflet-fix';
import { fetchFloodRisk, riskLevelToLabel, riskLevelColor, trendToLabel, formatAlertStatus, type FloodRiskResponse } from '../services/api';

const riskPointColors: Record<string, string> = {
  high: '#ef4444',
  moderate: '#fb923c',
  safe: '#22c55e',
};

const notificationsData = [
  { id: '1', type: 'critical', title: 'Risiko Banjir Tinggi Terdeteksi', desc: 'Potensi banjir di area Kemang dalam 6 jam ke depan.', time: '2 menit lalu', read: false },
  { id: '2', type: 'warning', title: 'Laporan Baru: Pohon Tumbang', desc: 'Pohon tumbang di Kebon Jeruk menutup 2 lajur jalan.', time: '14 menit lalu', read: false },
  { id: '3', type: 'info', title: 'Update Cuaca BMKG', desc: 'Intensitas hujan meningkat: 42 mm/hr di Jakarta Selatan.', time: '1 jam lalu', read: true },
  { id: '4', type: 'success', title: 'Laporan #001 Dikonfirmasi', desc: '12 anggota komunitas telah mengkonfirmasi laporan Anda.', time: '2 jam lalu', read: true },
  { id: '5', type: 'info', title: 'Evakuasi: Cilandak Update', desc: 'Genangan air mulai surut, akses jalan kembali normal.', time: '3 jam lalu', read: true },
];

function NotifIcon({ type }: { type: string }) {
  if (type === 'critical') return <AlertTriangle size={13} className="text-red-400" />;
  if (type === 'warning') return <AlertTriangle size={13} className="text-orange-400" />;
  if (type === 'success') return <CheckCircle size={13} className="text-green-400" />;
  return <Info size={13} className="text-blue-400" />;
}

export function MapPage() {
  const navigate = useNavigate();
  const mapRef = useRef<LeafletMap | null>(null);

  // Map controls
  const [showRiskZones, setShowRiskZones] = useState(true);
  const [showActiveReports, setShowActiveReports] = useState(true);
  const [showReliefCenters, setShowReliefCenters] = useState(false);
  const [mapControlOpen, setMapControlOpen] = useState(true);
  const [showNearby, setShowNearby] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // ── Click-to-query risk state ────────────────────────────────
  const [clickRiskData, setClickRiskData] = useState<FloodRiskResponse | null>(null);
  const [clickRiskLoading, setClickRiskLoading] = useState(false);
  const [clickRiskError, setClickRiskError] = useState<string | null>(null);
  const [clickCoords, setClickCoords] = useState<[number, number] | null>(null);

  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    setClickCoords([lat, lng]);
    setClickRiskLoading(true);
    setClickRiskError(null);
    setClickRiskData(null);
    try {
      const data = await fetchFloodRisk(lat, lng);
      setClickRiskData(data);
    } catch (err: any) {
      setClickRiskError(err.message || 'Risk query failed');
    } finally {
      setClickRiskLoading(false);
    }
  }, []);

  const clearClickRisk = () => {
    setClickRiskData(null);
    setClickRiskError(null);
    setClickCoords(null);
  };

  // Notification panel
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifList, setNotifList] = useState(notificationsData);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifList.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();

  const activeReportPoints = reports.map((r) => ({
    id: r.id, coordinates: r.coordinates, level: r.riskLevel, title: r.title,
  }));

  const reliefCenters = [
    { id: 'rc1', coordinates: [-6.1744, 106.8294] as [number, number], name: 'Pusat Bantuan Jakarta Pusat' },
    { id: 'rc2', coordinates: [-6.2615, 106.7909] as [number, number], name: 'Pusat Bantuan Jakarta Selatan' },
  ];

  // ── Search state ────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchPin, setSearchPin] = useState<{ coords: [number, number]; label: string } | null>(null);
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null);
  const [showDropMobile, setShowDropMobile] = useState(false);
  const [showDropDesktop, setShowDropDesktop] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = useCallback((value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length < 2) { setSuggestions([]); setSearchLoading(false); return; }
    setSearchLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value + ' Jakarta')}&format=json&limit=7&countrycodes=id&accept-language=id`;
        const res = await fetch(url, { headers: { 'User-Agent': 'BanSos-App/1.0' } });
        const data: NominatimResult[] = await res.json();
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      } finally {
        setSearchLoading(false);
      }
    }, 420);
  }, []);

  const handleSearchInput = (v: string) => {
    setSearchQuery(v);
    fetchSuggestions(v);
  };

  const handleSelectSuggestion = (s: NominatimResult) => {
    const coords: [number, number] = [parseFloat(s.lat), parseFloat(s.lon)];
    const label = formatDisplayName(s.display_name);
    setSearchQuery(label);
    setSearchPin({ coords, label });
    setFlyTarget(coords);
    setSuggestions([]);
    setShowDropMobile(false);
    setShowDropDesktop(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setSearchPin(null);
    setFlyTarget(null);
    setShowDropMobile(false);
    setShowDropDesktop(false);
  };
  // ────────────────────────────────────────────────────────────

  const sharedInputClassBase = 'w-full bg-[rgba(29,32,39,0.92)] border border-[rgba(255,255,255,0.1)] rounded-full pl-9 pr-8 text-[#e1e2ec] text-sm placeholder-[#8c909f] focus:outline-none focus:border-[rgba(173,198,255,0.4)] backdrop-blur-sm transition-colors';

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#10131a]">
      {/* Top Alert Banner */}
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-[#b3261e] flex items-center justify-center gap-2 py-2 px-4">
        <span className="text-[#ffb4ab] text-sm">⚠</span>
        <span className="text-white text-sm font-medium text-center">High flood risk detected in your area</span>
      </div>

      {/* ── Top Nav Bar ─ */}
      <div
        className="absolute top-[36px] left-0 right-0 z-[1001] flex items-center justify-between px-4 lg:px-8 py-2"
        style={{ background: 'rgba(16,19,26,0.7)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <button
          onClick={() => navigate('/dashboard')}
          className="text-[#60a5fa] text-xl font-black tracking-tighter hover:opacity-80 transition-opacity"
        >
          BanSos
        </button>

        <div className="flex items-center gap-1">
          {/* Bell with notification dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications((v) => !v)}
              className="relative p-2 rounded-full text-[#94a3b8] hover:bg-[rgba(255,255,255,0.08)] transition-colors"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="fixed top-[84px] left-2 right-2 sm:left-auto sm:right-2 sm:w-[320px] bg-[#1d2027] border border-[rgba(255,255,255,0.1)] rounded-xl shadow-2xl overflow-hidden z-[1002]">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
                  <div className="flex items-center gap-2">
                    <Bell size={13} className="text-[#adc6ff]" />
                    <span className="text-[#e1e2ec] text-sm font-semibold">Notifikasi</span>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={() => setNotifList((p) => p.map((n) => ({ ...n, read: true })))}
                        className="text-[#adc6ff] text-xs hover:underline"
                      >
                        Tandai dibaca
                      </button>
                    )}
                    <button onClick={() => setShowNotifications(false)} className="text-[#8c909f] hover:text-[#e1e2ec]">
                      <X size={14} />
                    </button>
                  </div>
                </div>
                <div className="max-h-[320px] overflow-y-auto divide-y divide-[rgba(255,255,255,0.04)]">
                  {notifList.map((n) => (
                    <div
                      key={n.id}
                      className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-[rgba(255,255,255,0.03)] ${!n.read ? 'bg-[rgba(173,198,255,0.04)]' : ''}`}
                      onClick={() => setNotifList((p) => p.map((x) => x.id === n.id ? { ...x, read: true } : x))}
                    >
                      <div className={`mt-0.5 shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                        n.type === 'critical' ? 'bg-red-500/15' : n.type === 'warning' ? 'bg-orange-400/15' : n.type === 'success' ? 'bg-green-500/15' : 'bg-blue-400/15'
                      }`}>
                        <NotifIcon type={n.type} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-xs font-semibold leading-tight ${!n.read ? 'text-[#e1e2ec]' : 'text-[#c2c6d6]'}`}>{n.title}</p>
                          {!n.read && <div className={`w-2 h-2 rounded-full shrink-0 mt-0.5 ${n.type === 'critical' ? 'bg-red-500' : n.type === 'warning' ? 'bg-orange-400' : 'bg-blue-400'}`} />}
                        </div>
                        <p className="text-[#8c909f] text-xs mt-0.5 line-clamp-2">{n.desc}</p>
                        <p className="text-[#8c909f] text-[10px] mt-1">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-[rgba(255,255,255,0.06)] flex justify-center">
                  <button className="text-[#adc6ff] text-xs hover:underline">Lihat semua notifikasi</button>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <button
            onClick={() => navigate('/dashboard/settings')}
            className="p-2 rounded-full text-[#94a3b8] hover:bg-[rgba(255,255,255,0.08)] transition-colors"
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* ── MOBILE: Row 1 → [← Back] [Search] [Reports] ── */}
      <div className="absolute top-[96px] left-4 right-4 z-[999] md:hidden flex flex-col gap-2">
        {/* Row 1 */}
        <div className="relative z-10 flex items-center gap-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 px-3 py-2 bg-[rgba(29,32,39,0.85)] border border-[rgba(255,255,255,0.1)] rounded-full text-[#e1e2ec] text-sm backdrop-blur-sm hover:bg-[rgba(173,198,255,0.15)] transition-colors shrink-0"
          >
            <ArrowLeft size={14} />
            Back
          </button>

          {/* Search mobile */}
          <SearchBox
            inputClass={`${sharedInputClassBase} py-2`}
            dropdownClass="absolute top-full mt-1.5 left-0 right-0 bg-[rgba(16,19,26,0.97)] border border-[rgba(255,255,255,0.12)] rounded-xl overflow-hidden backdrop-blur-sm shadow-xl z-20 max-h-[240px] overflow-y-auto"
            query={searchQuery}
            suggestions={suggestions}
            loading={searchLoading}
            showDrop={showDropMobile}
            onInput={handleSearchInput}
            onSelect={handleSelectSuggestion}
            onClear={handleClearSearch}
            onFocus={() => setShowDropMobile(true)}
            onBlur={() => setTimeout(() => setShowDropMobile(false), 150)}
          />

          {/* Reports toggle */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowNearby(!showNearby)}
              className="px-3 py-2 bg-[rgba(16,19,26,0.92)] border border-[rgba(255,255,255,0.1)] rounded-full text-[#e1e2ec] text-sm backdrop-blur-sm hover:bg-[rgba(173,198,255,0.15)] transition-colors"
            >
              Reports
            </button>
            {showNearby && (
              <div className="absolute top-10 right-0 w-[260px] bg-[rgba(16,19,26,0.95)] border border-[rgba(255,255,255,0.1)] rounded-xl overflow-hidden backdrop-blur-sm">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
                  <span className="text-[#e1e2ec] text-sm font-semibold">Nearby Reports</span>
                  <button onClick={() => navigate('/dashboard/reports')} className="text-[#adc6ff] text-xs hover:underline">All</button>
                </div>
                {reports.slice(0, 2).map((report) => (
                  <div
                    key={report.id}
                    className="p-3 flex gap-3 cursor-pointer hover:bg-[rgba(255,255,255,0.03)]"
                    onClick={() => navigate(`/dashboard/reports/${report.id}`)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[#e1e2ec] text-xs font-medium truncate">{report.title}</p>
                      <p className="text-[#8c909f] text-xs mt-0.5">{report.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Row 2 — Filters button */}
        <div className="relative self-start">
          <button
            onClick={() => setShowMobileFilters((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium backdrop-blur-sm border transition-colors ${
              showMobileFilters
                ? 'bg-[rgba(173,198,255,0.2)] border-[#adc6ff] text-[#adc6ff]'
                : 'bg-[rgba(29,32,39,0.92)] border-[rgba(255,255,255,0.1)] text-[#e1e2ec]'
            }`}
          >
            <SlidersHorizontal size={13} />
            Filters
          </button>

          {showMobileFilters && (
            <div className="absolute top-full mt-2 left-0 w-52 bg-[rgba(16,19,26,0.95)] border border-[rgba(255,255,255,0.12)] rounded-xl overflow-hidden backdrop-blur-sm z-10">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-[rgba(255,255,255,0.06)]">
                <span className="text-[#e1e2ec] text-sm font-semibold">Map Layers</span>
                <button onClick={() => setShowMobileFilters(false)} className="text-[#8c909f] hover:text-[#e1e2ec]">
                  <X size={14} />
                </button>
              </div>
              <div className="px-4 py-3 space-y-3">
                {[
                  { label: 'Risk Zones', value: showRiskZones, setter: setShowRiskZones },
                  { label: 'Active Reports', value: showActiveReports, setter: setShowActiveReports },
                  { label: 'Relief Centers', value: showReliefCenters, setter: setShowReliefCenters },
                ].map(({ label, value, setter }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-[#e1e2ec] text-sm">{label}</span>
                    <button
                      onClick={() => setter(!value)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${value ? 'bg-[#adc6ff] border-[#adc6ff]' : 'bg-transparent border-[#424754]'}`}
                    >
                      {value && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l2.5 3L9 1" stroke="#002E6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Back Button — desktop only */}
      <div className="absolute top-[96px] left-8 z-[999] hidden md:block">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-4 py-2 bg-[rgba(29,32,39,0.85)] border border-[rgba(255,255,255,0.1)] rounded-full text-[#e1e2ec] text-sm backdrop-blur-sm hover:bg-[rgba(173,198,255,0.15)] transition-colors"
        >
          <ArrowLeft size={14} />
          Back
        </button>
      </div>

      {/* Search Bar — desktop only */}
      <div className="absolute top-[148px] left-8 z-[1002] w-[270px] hidden md:block">
        <SearchBox
          inputClass={`${sharedInputClassBase} py-2.5`}
          dropdownClass="absolute top-full mt-1.5 left-0 right-0 bg-[rgba(16,19,26,0.97)] border border-[rgba(255,255,255,0.12)] rounded-xl overflow-hidden backdrop-blur-sm shadow-xl z-20 max-h-[280px] overflow-y-auto"
          query={searchQuery}
          suggestions={suggestions}
          loading={searchLoading}
          showDrop={showDropDesktop}
          onInput={handleSearchInput}
          onSelect={handleSelectSuggestion}
          onClear={handleClearSearch}
          onFocus={() => setShowDropDesktop(true)}
          onBlur={() => setTimeout(() => setShowDropDesktop(false), 150)}
        />

        {/* Active search pill */}
        {searchPin && (
          <div className="mt-2 flex items-center gap-2 bg-[rgba(173,198,255,0.12)] border border-[rgba(173,198,255,0.25)] rounded-full px-3 py-1.5">
            <MapPin size={11} className="text-[#adc6ff] shrink-0" />
            <span className="text-[#adc6ff] text-xs flex-1 truncate">{searchPin.label}</span>
            <button onClick={handleClearSearch} className="text-[#adc6ff] hover:text-white transition-colors">
              <X size={11} />
            </button>
          </div>
        )}
      </div>

      {/* Map Control Panel — desktop only */}
      <div className="absolute top-[200px] left-8 z-[999] w-[270px] hidden md:block" style={{ marginTop: searchPin ? '32px' : '0' }}>
        <div className="bg-[rgba(16,19,26,0.92)] border border-[rgba(255,255,255,0.1)] rounded-xl overflow-hidden backdrop-blur-sm">
          <button
            className="w-full flex items-center justify-between px-4 py-3 text-[#e1e2ec]"
            onClick={() => setMapControlOpen(!mapControlOpen)}
          >
            <span className="font-semibold text-sm">Map Control</span>
            {mapControlOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {mapControlOpen && (
            <div className="border-t border-[rgba(255,255,255,0.06)] px-4 py-3 space-y-3">
              {[
                { label: 'Risk Zones', value: showRiskZones, setter: setShowRiskZones },
                { label: 'Active Reports', value: showActiveReports, setter: setShowActiveReports },
                { label: 'Relief Centers', value: showReliefCenters, setter: setShowReliefCenters },
              ].map(({ label, value, setter }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[#e1e2ec] text-sm">{label}</span>
                  <button
                    onClick={() => setter(!value)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${value ? 'bg-[#adc6ff] border-[#adc6ff]' : 'bg-transparent border-[#424754]'}`}
                  >
                    {value && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4l2.5 3L9 1" stroke="#002E6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Nearby Reports Panel — desktop */}
      <div className="absolute top-[96px] right-4 lg:right-8 z-[999] w-[260px] lg:w-[290px] hidden md:block">
        <div className="bg-[rgba(16,19,26,0.92)] border border-[rgba(255,255,255,0.1)] rounded-xl overflow-hidden backdrop-blur-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
            <span className="text-[#e1e2ec] text-sm font-semibold">Nearby Reports</span>
            <button onClick={() => navigate('/dashboard/reports')} className="text-[#adc6ff] text-xs hover:underline">View All</button>
          </div>
          <div className="divide-y divide-[rgba(255,255,255,0.04)]">
            {reports.slice(0, 2).map((report) => (
              <div
                key={report.id}
                className="p-3 flex gap-3 hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer"
                onClick={() => navigate(`/dashboard/reports/${report.id}`)}
              >
                <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-[#2a2d36]">
                  <img src={imgFloodedStreet} alt="" className="w-full h-full object-cover opacity-80" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#e1e2ec] text-sm font-medium truncate">{report.title}</p>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase ${report.severity === 'KRITIS' ? 'bg-[#93000a] text-[#ffdad6]' : 'bg-[#5c3c00] text-[#ffb786]'}`}>
                    {report.severity === 'KRITIS' ? 'CRITICAL' : 'WARNING'}
                  </span>
                  <p className="text-[#8c909f] text-xs mt-0.5">{report.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Left: Zoom + Risk Legend */}
      <div className="absolute bottom-8 left-4 lg:left-8 z-[999] flex flex-col gap-2 lg:gap-3 items-start">
        <div className="flex flex-col gap-1">
          <button onClick={handleZoomIn} className="w-8 h-8 lg:w-9 lg:h-9 flex items-center justify-center bg-[rgba(29,32,39,0.9)] border border-[rgba(255,255,255,0.1)] rounded-lg text-[#e1e2ec] hover:bg-[rgba(173,198,255,0.15)] transition-colors backdrop-blur-sm">
            <Plus size={14} />
          </button>
          <button onClick={handleZoomOut} className="w-8 h-8 lg:w-9 lg:h-9 flex items-center justify-center bg-[rgba(29,32,39,0.9)] border border-[rgba(255,255,255,0.1)] rounded-lg text-[#e1e2ec] hover:bg-[rgba(173,198,255,0.15)] transition-colors backdrop-blur-sm">
            <Minus size={14} />
          </button>
        </div>

        <div className="bg-[rgba(16,19,26,0.92)] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 lg:px-4 py-2 lg:py-3 backdrop-blur-sm">
          <p className="text-[#e1e2ec] text-xs font-semibold mb-1.5">Risk Levels</p>
          <div className="space-y-1">
            {[['#ef4444','High Risk'],['#fb923c','Moderate'],['#22c55e','Safe']].map(([color, label]) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-[#e1e2ec] text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Report Button */}
      <div className="absolute bottom-8 right-4 lg:right-8 z-[999]">
        <button
          onClick={() => navigate('/dashboard/reports/create')}
          className="flex items-center gap-2 px-4 lg:px-5 py-2.5 lg:py-3 bg-[#60a5fa] hover:bg-[#3b82f6] text-[#001d3d] font-semibold text-sm rounded-full shadow-lg transition-colors"
        >
          <Plus size={15} />
          Report
        </button>
      </div>

      {/* Click Risk Result Panel */}
      {(clickCoords) && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[1001] w-[320px] max-w-[calc(100vw-2rem)] bg-[rgba(16,19,26,0.95)] border border-[rgba(255,255,255,0.12)] rounded-xl overflow-hidden backdrop-blur-sm shadow-2xl">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center gap-2">
              <MapPin size={12} className="text-[#adc6ff]" />
              <span className="text-[#e1e2ec] text-xs font-semibold">Flood Risk Query</span>
            </div>
            <button onClick={clearClickRisk} className="text-[#8c909f] hover:text-[#e1e2ec] transition-colors"><X size={14} /></button>
          </div>
          <div className="px-4 py-3">
            {clickRiskLoading && (
              <div className="flex items-center gap-2 py-2">
                <Loader2 size={14} className="text-[#adc6ff] animate-spin" />
                <span className="text-[#8c909f] text-xs">Analyzing risk for ({clickCoords[0].toFixed(4)}, {clickCoords[1].toFixed(4)})...</span>
              </div>
            )}
            {clickRiskError && (
              <div className="py-2">
                <p className="text-[#8c909f] text-xs">({clickCoords[0].toFixed(4)}, {clickCoords[1].toFixed(4)})</p>
                <p className="text-[#ffb4ab] text-xs mt-1">{clickRiskError}</p>
              </div>
            )}
            {clickRiskData && (
              <div className="space-y-2">
                <p className="text-[#8c909f] text-[10px]">{clickRiskData.location.kelurahan}, {clickRiskData.location.kecamatan}</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-[10px] text-[#8c909f] uppercase">Risk Level</p>
                    <p className="text-lg font-bold" style={{ color: riskLevelColor(clickRiskData.risk.risk_level) }}>{riskLevelToLabel(clickRiskData.risk.risk_level)}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-[#8c909f] uppercase">Probability</p>
                    <p className="text-lg font-bold text-[#e1e2ec]">{clickRiskData.risk.probability_percent.toFixed(1)}%</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-[#8c909f] uppercase">Trend</p>
                    <p className="text-sm font-semibold text-[#adc6ff]">{trendToLabel(clickRiskData.risk.trend)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="bg-[rgba(255,255,255,0.03)] rounded-lg px-2.5 py-1.5">
                    <p className="text-[9px] text-[#8c909f] uppercase">Weather</p>
                    <p className="text-xs font-bold text-[#e1e2ec]">{(clickRiskData.components.weather_score * 100).toFixed(0)}%</p>
                  </div>
                  <div className="bg-[rgba(255,255,255,0.03)] rounded-lg px-2.5 py-1.5">
                    <p className="text-[9px] text-[#8c909f] uppercase">Water Level</p>
                    <p className="text-xs font-bold text-[#e1e2ec]">{clickRiskData.details.water_station.water_level?.toFixed(0) ?? 'N/A'} cm</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full Screen Map */}
      <MapContainer
        ref={mapRef}
        center={[-6.2088, 106.8456]}
        zoom={12}
        zoomControl={false}
        style={{ height: '100vh', width: '100vw', background: '#10131a' }}
      >
        <FlyTo target={flyTarget} />
        <MapClickHandler onMapClick={handleMapClick} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        {showRiskZones && mapRiskPoints.map((point) => (
          <CircleMarker key={point.id} center={point.coordinates} radius={10}
            pathOptions={{ color: riskPointColors[point.level], fillColor: riskPointColors[point.level], fillOpacity: 0.7, weight: 2 }}>
            <Tooltip><span>{point.level === 'high' ? '🔴 High Risk' : point.level === 'moderate' ? '🟠 Moderate' : '🟢 Safe'}</span></Tooltip>
          </CircleMarker>
        ))}
        {showActiveReports && activeReportPoints.map((point) => (
          <CircleMarker key={`report-${point.id}`} center={point.coordinates} radius={5}
            pathOptions={{ color: '#adc6ff', fillColor: '#adc6ff', fillOpacity: 0.5, weight: 1.5 }}>
            <Tooltip><span>{point.title}</span></Tooltip>
          </CircleMarker>
        ))}
        {showReliefCenters && reliefCenters.map((center) => (
          <CircleMarker key={center.id} center={center.coordinates} radius={10}
            pathOptions={{ color: '#4ade80', fillColor: '#4ade80', fillOpacity: 0.8, weight: 2 }}>
            <Tooltip><span>{center.name}</span></Tooltip>
          </CircleMarker>
        ))}

        {/* Search result highlight */}
        {searchPin && (
          <>
            <CircleMarker center={searchPin.coords} radius={28}
              pathOptions={{ color: '#adc6ff', fillColor: '#adc6ff', fillOpacity: 0.1, weight: 2, dashArray: '6 4' }} />
            <CircleMarker center={searchPin.coords} radius={14}
              pathOptions={{ color: '#adc6ff', fillColor: '#adc6ff', fillOpacity: 0.2, weight: 2 }} />
            <CircleMarker center={searchPin.coords} radius={7}
              pathOptions={{ color: '#ffffff', fillColor: '#adc6ff', fillOpacity: 1, weight: 2 }}>
              <Tooltip permanent direction="top" offset={[0, -12]}>
                <span style={{ fontWeight: 600, color: '#002e6a' }}>{searchPin.label}</span>
              </Tooltip>
            </CircleMarker>
          </>
        )}

        {/* Click query marker */}
        {clickCoords && (
          <>
            <CircleMarker center={clickCoords} radius={20}
              pathOptions={{ color: clickRiskData ? riskLevelColor(clickRiskData.risk.risk_level) : '#adc6ff', fillColor: clickRiskData ? riskLevelColor(clickRiskData.risk.risk_level) : '#adc6ff', fillOpacity: 0.15, weight: 2, dashArray: '4 4' }} />
            <CircleMarker center={clickCoords} radius={6}
              pathOptions={{ color: '#fff', fillColor: clickRiskData ? riskLevelColor(clickRiskData.risk.risk_level) : '#adc6ff', fillOpacity: 1, weight: 2 }}>
              <Tooltip permanent direction="top" offset={[0, -10]}>
                <span style={{ fontWeight: 600, color: '#002e6a', fontSize: 11 }}>
                  {clickRiskLoading ? '⏳ Analyzing...' : clickRiskData ? `${riskLevelToLabel(clickRiskData.risk.risk_level)} — ${clickRiskData.risk.probability_percent.toFixed(1)}%` : clickRiskError ? '⚠ Error' : 'Querying...'}
                </span>
              </Tooltip>
            </CircleMarker>
          </>
        )}
      </MapContainer>
    </div>
  );
}

// ── Fly-to helper component (runs inside MapContainer context) ──
interface FlyToProps { target: [number, number] | null }
function FlyTo({ target }: FlyToProps) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, 16, { duration: 1.4 });
  }, [target, map]);
  return null;
}

// ── Map click handler (runs inside MapContainer context) ──
interface MapClickHandlerProps { onMapClick: (lat: number, lng: number) => void }
function MapClickHandler({ onMapClick }: MapClickHandlerProps) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// ── Nominatim result shape ──────────────────────────────────────
interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

function formatDisplayName(raw: string): string {
  const parts = raw.split(', ');
  return parts.slice(0, 3).join(', ');
}

// ── Shared Search Box ───────────────────────────────────────────
interface SearchBoxProps {
  inputClass: string;
  dropdownClass: string;
  query: string;
  suggestions: NominatimResult[];
  loading: boolean;
  showDrop: boolean;
  onInput: (v: string) => void;
  onSelect: (r: NominatimResult) => void;
  onClear: () => void;
  onFocus: () => void;
  onBlur: () => void;
}
function SearchBox({ inputClass, dropdownClass, query, suggestions, loading, showDrop, onInput, onSelect, onClear, onFocus, onBlur }: SearchBoxProps) {
  return (
    <div className="relative w-full">
      <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c909f] z-10 pointer-events-none" />
      <input
        type="text"
        value={query}
        placeholder="Search area... (e.g. Kayu Putih)"
        onChange={(e) => onInput(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        className={inputClass}
      />
      {loading && (
        <Loader2 size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c909f] animate-spin" />
      )}
      {!loading && query && (
        <button
          onMouseDown={(e) => { e.preventDefault(); onClear(); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c909f] hover:text-[#e1e2ec] transition-colors"
        >
          <X size={12} />
        </button>
      )}

      {/* Autocomplete Dropdown */}
      {showDrop && (suggestions.length > 0 || (query.length >= 2 && !loading)) && (
        <div className={dropdownClass}>
          {suggestions.length === 0 && query.length >= 2 && !loading ? (
            <div className="px-4 py-3 text-[#8c909f] text-xs text-center">Lokasi tidak ditemukan</div>
          ) : (
            suggestions.map((s) => (
              <button
                key={s.place_id}
                onMouseDown={(e) => { e.preventDefault(); onSelect(s); }}
                className="w-full flex items-start gap-2.5 px-4 py-2.5 hover:bg-[rgba(173,198,255,0.08)] transition-colors text-left"
              >
                <MapPin size={12} className="text-[#adc6ff] shrink-0 mt-0.5" />
                <span className="text-[#e1e2ec] text-xs leading-snug">{formatDisplayName(s.display_name)}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}