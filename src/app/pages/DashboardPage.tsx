import { useState, useEffect, useCallback, useRef } from 'react';
import { ThemedTileLayer } from '../components/ThemedTileLayer';
import { useNavigate } from 'react-router';
import {
  AlertTriangle,
  TrendingUp,
  CloudRain,
  FileText,
  ExternalLink,
  Loader2,
  WifiOff,
  MapPin,
  BookMarked,
  ChevronDown,
} from 'lucide-react';
import { MapContainer, CircleMarker, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { mapRiskPoints } from '../data/reports';
import '../utils/leaflet-fix';
import { getCurrentUserLocation } from '../services/location';
import {
  fetchFloodRisk,
  fetchReports,
  fetchSavedLocations,
  riskLevelToLabel,
  riskLevelColor,
  riskLevelProgress,
  trendToLabel,
  trendToArrow,
  type FloodRiskResponse,
  type CommunityReport,
  type SavedLocation,
} from '../services/api';
import { supabase } from '../services/supabaseClient';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import {
  DEFAULT_LAT,
  DEFAULT_LNG,
  getSessionLocation as getSavedUserLocation,
  saveSessionLocation,
} from '../services/primaryLocation';

const REPORT_RADIUS_KM = 5;

const userLocationIcon = L.divIcon({
  className: 'user-location-pin',
  html: `
    <div style="
      width: 26px;
      height: 26px;
      border-radius: 50% 50% 50% 0;
      background: #60a5fa;
      transform: rotate(-45deg);
      border: 3px solid #dbeafe;
      box-shadow: 0 0 18px rgba(96, 165, 250, 0.85);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: #0f172a;
      "></div>
    </div>
  `,
  iconSize: [26, 26],
  iconAnchor: [13, 26],
  popupAnchor: [0, -28],
});

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

function isToday(dateString?: string) {
  if (!dateString) return true;

  const date = new Date(dateString);
  const today = new Date();

  return date.toDateString() === today.toDateString();
}

function formatReportTime(dateString?: string) {
  if (!dateString) return '-';

  return new Date(dateString).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function MapResizer() {
  const map = useMap();

  useEffect(() => {
    const resizeMap = () => {
      window.requestAnimationFrame(() => {
        map.invalidateSize({
          pan: false,
        });
      });
    };

    resizeMap();

    const timers = [
      window.setTimeout(resizeMap, 100),
      window.setTimeout(resizeMap, 300),
      window.setTimeout(resizeMap, 700),
    ];

    const mapContainer = map.getContainer();
    const parentContainer = mapContainer.parentElement;

    const observer = new ResizeObserver(() => {
      resizeMap();
    });

    observer.observe(mapContainer);

    if (parentContainer) {
      observer.observe(parentContainer);
    }

    window.addEventListener('resize', resizeMap);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      observer.disconnect();
      window.removeEventListener('resize', resizeMap);
    };
  }, [map]);

  return null;
}

function MapCenterUpdater({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  const wib = new Date(time.getTime() + 7 * 60 * 60 * 1000);

  return (
    <span className="font-mono text-[var(--accent)] text-base font-semibold">
      {pad(wib.getUTCHours())}:{pad(wib.getUTCMinutes())}:{pad(wib.getUTCSeconds())} WIB
    </span>
  );
}

const severityBg: Record<string, string> = {
  KRITIS: 'bg-[#93000a] text-[#ffdad6]',
  SEDANG: 'bg-[#5c3c00] text-[#ffb786]',
  RENDAH: 'bg-[#002105] text-[#7dd878]',
  PERINGATAN: 'bg-[#5c3c00] text-[#ffb786]',
};

function getWaterLevelLabel(alertStatus?: string | null) {
  const status = alertStatus?.toUpperCase() ?? '';

  if (
    status.includes('SIAGA 1') ||
    status.includes('BAHAYA') ||
    status.includes('KRITIS')
  ) {
    return 'BAHAYA';
  }

  if (
    status.includes('SIAGA 2') ||
    status.includes('SIAGA 3') ||
    status.includes('WASPADA')
  ) {
    return 'SIAGA';
  }

  return 'NORMAL';
}

function getWaterLevelBadgeClass(label: string) {
  if (label === 'BAHAYA') {
    return 'bg-[#93000a] text-[#ffdad6] border border-[rgba(255,180,171,0.25)]';
  }

  if (label === 'SIAGA') {
    return 'bg-[#5c3c00] text-[#ffb786] border border-[rgba(255,183,134,0.25)]';
  }

  return 'bg-[#002105] text-[#7dd878] border border-[rgba(125,216,120,0.25)]';
}

function getWaterLevelTextColor(label: string) {
  if (label === 'BAHAYA') return 'text-[#ffb4ab]';
  if (label === 'SIAGA') return 'text-[#ffb786]';
  return 'text-[#e1e2ec]';
}

function formatWaterAlertStatus(alertStatus?: string | null) {
  const status = alertStatus?.toUpperCase() ?? '';

  if (status.includes('SIAGA 1')) return 'Siaga 1 — Bahaya';
  if (status.includes('SIAGA 2')) return 'Siaga 2 — Waspada';
  if (status.includes('SIAGA 3')) return 'Siaga 3 — Siaga';
  if (status.includes('BAHAYA')) return 'Bahaya';
  if (status.includes('WASPADA')) return 'Waspada';
  if (status.includes('NORMAL') || status.includes('AMAN')) return 'Normal';

  return alertStatus || 'Data dari sensor/pos air terdekat.';
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const mapBackground = theme === 'light' ? '#eef2f7' : '#10131a';

  const coordsRef = useRef(
    (() => {
      const saved = getSavedUserLocation();
      return saved ?? { lat: DEFAULT_LAT, lng: DEFAULT_LNG };
    })(),
  );

  const [acknowledged, setAcknowledged] = useState(false);

  const [riskData, setRiskData] = useState<FloodRiskResponse | null>(null);
  const [dashboardReports, setDashboardReports] = useState<CommunityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>(() => {
    const saved = getSavedUserLocation();
    return saved ?? { lat: DEFAULT_LAT, lng: DEFAULT_LNG };
  });

  const [usingUserLocation, setUsingUserLocation] = useState(() => getSavedUserLocation() !== null);

  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [showLocDropdown, setShowLocDropdown] = useState(false);
  const [activeLocationId, setActiveLocationId] = useState<string | null>(null);
  const locDropdownRef = useRef<HTMLDivElement>(null);

  // Controls whether the initial risk-data fetch is allowed to run.
  // We delay it until we've resolved which location to use (primary vs default).
  const [locationResolved, setLocationResolved] = useState(() => getSavedUserLocation() !== null);

  // Declared BEFORE the useEffect that depends on it to avoid Temporal Dead Zone error
  const updateCoords = useCallback((lat: number, lng: number) => {
    coordsRef.current = { lat, lng };

    setUserCoords((prev) => {
      if (prev.lat === lat && prev.lng === lng) return prev;
      return { lat, lng };
    });
  }, []);

  useEffect(() => {
    const hasCachedLocation = getSavedUserLocation() !== null;

    // If sessionStorage already has coords, risk-data can load immediately.
    // We still need to fetch saved locations so the dropdown appears.
    if (hasCachedLocation) {
      setLocationResolved(true);
    }

    // Always fetch saved locations — needed for the "Lokasi Tersimpan" dropdown
    // regardless of whether a session-cached location exists.
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        if (!hasCachedLocation) setLocationResolved(true);
        return;
      }

      const primaryId: string | undefined = data.user.user_metadata?.primary_location_id;

      try {
        const result = await fetchSavedLocations(data.user.id);
        const locsWithCoords = result.data.filter(
          (l): l is SavedLocation & { latitude: number; longitude: number } =>
            l.latitude != null && l.longitude != null,
        );

        // Always populate the dropdown list
        setSavedLocations(locsWithCoords);

        // Only override coordinates when sessionStorage has nothing
        if (!hasCachedLocation && locsWithCoords.length > 0) {
          const primary =
            (primaryId ? locsWithCoords.find((l) => l.id === primaryId) : undefined) ??
            locsWithCoords[0];

          coordsRef.current = { lat: primary.latitude, lng: primary.longitude };
          updateCoords(primary.latitude, primary.longitude);
          setActiveLocationId(primary.id);
          setUsingUserLocation(false);
        }
      } catch {
        // non-critical — fall back to coords already in coordsRef
      } finally {
        // Mark resolved only if we hadn't already done so above
        if (!hasCachedLocation) setLocationResolved(true);
      }
    });
  }, [updateCoords]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (locDropdownRef.current && !locDropdownRef.current.contains(e.target as Node)) {
        setShowLocDropdown(false);
      }
    };

    document.addEventListener('mousedown', handler);

    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const loadRiskData = useCallback(
    async (lat?: number, lng?: number) => {
      const targetLat = lat ?? coordsRef.current.lat;
      const targetLng = lng ?? coordsRef.current.lng;

      setLoading(true);
      setError(null);

      try {
        const data = await fetchFloodRisk(targetLat, targetLng);

        setRiskData(data);
        updateCoords(targetLat, targetLng);

        const reportsResult = await fetchReports();
        const allReports = reportsResult.data ?? [];

        const nearbyReports = allReports.filter((report) => {
          if (typeof report.latitude !== 'number' || typeof report.longitude !== 'number') {
            return false;
          }

          const reportDistance = distanceKm(
            targetLat,
            targetLng,
            report.latitude,
            report.longitude,
          );

          return reportDistance <= REPORT_RADIUS_KM;
        });

        setDashboardReports(nearbyReports);
      } catch (err: any) {
        console.error('Failed to load risk data:', err);
        setError(err.message || 'Failed to connect to backend.');
      } finally {
        setLoading(false);
      }
    },
    [updateCoords],
  );

  const handleSelectSavedLocation = async (loc: SavedLocation) => {
    if (loc.latitude == null || loc.longitude == null) return;

    setShowLocDropdown(false);
    setActiveLocationId(loc.id);
    setUsingUserLocation(false);
    setLocationLoading(true);

    // Persist the chosen location so Risk Analysis & Map pages use it too
    saveSessionLocation(loc.latitude, loc.longitude);

    try {
      await loadRiskData(loc.latitude, loc.longitude);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleUseMyLocation = async () => {
    setLocationLoading(true);
    setActiveLocationId(null);
    setError(null);

    try {
      const location = await getCurrentUserLocation();

      setUsingUserLocation(true);

      // Persist GPS coords so Risk Analysis & Map pages use the same location
      saveSessionLocation(location.latitude, location.longitude);

      await loadRiskData(location.latitude, location.longitude);
    } catch (err: any) {
      console.error('Failed to get user location:', err);
      setUsingUserLocation(false);
      setError(err.message || 'Gagal mengambil lokasi user.');
    } finally {
      setLocationLoading(false);
    }
  };

  // Only start fetching risk data once the primary location has been resolved
  useEffect(() => {
    if (!locationResolved) return;

    loadRiskData();

    // Refresh setiap 10 menit — selaras dengan cache TTL di api.ts (TTL_FLOOD_RISK).
    // Interval lebih pendek tidak akan mengirim request baru karena cache masih segar.
    const interval = window.setInterval(() => {
      loadRiskData();
    }, 10 * 60 * 1000);

    return () => window.clearInterval(interval);
  }, [locationResolved, loadRiskData]);

  const riskPointColors: Record<string, string> = {
    high: '#ef4444',
    moderate: '#fb923c',
    safe: '#22c55e',
  };

  const riskLevel = riskData?.risk.risk_level ?? 'LOW';
  const riskScore = riskData?.risk.final_score ?? 0;
  const trend = riskData?.risk.trend ?? 'STABLE';
  const probabilityPct = riskData?.risk.probability_percent ?? 0;
  const weatherScore = riskData?.components.weather_score ?? 0;
  const rainIntensity = riskData?.details.weather.rain_intensity_score ?? 0;

  const waterLevel = riskData?.details.water_station.water_level;
  const waterStationName = riskData?.details.water_station.station_name ?? 'Tidak tersedia';
  const waterDistance = riskData?.details.water_station.distance_km;
  const waterFreshnessWarning = riskData?.details.water_station.freshness.warning;

  const waterAlertStatus = riskData?.details.water_station.alert_status;
  const waterLevelLabel = getWaterLevelLabel(waterAlertStatus);
  const isDangerWaterLevel = waterLevelLabel === 'BAHAYA';

  const locationName = riskData
    ? `${riskData.location.kelurahan}, ${riskData.location.kota_administrasi}`
    : 'Kemang, Jakarta Selatan';

  const todayReports = dashboardReports.filter((report) => isToday(report.created_at));
  const recentReports = dashboardReports.slice(0, 8);

  const getIntensityLabel = (score: number) => {
    if (score >= 0.9) return 'Sangat Lebat';
    if (score >= 0.7) return 'Lebat';
    if (score >= 0.5) return 'Sedang';
    if (score >= 0.25) return 'Ringan';
    return 'Cerah';
  };

  const isHighRisk = riskLevel === 'HIGH';

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 text-[var(--text-main)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-[var(--text-main)] text-2xl lg:text-3xl font-semibold tracking-tight">
            Dashboard
          </h1>

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <div
              className={`w-2 h-2 rounded-full ${
                loading || locationLoading
                  ? 'bg-yellow-400 animate-pulse'
                  : error
                    ? 'bg-red-400'
                    : 'bg-[#adc6ff] animate-pulse'
              }`}
            />

            <span className="text-[var(--text-soft)] text-sm lg:text-base">
              {loading || locationLoading
                ? 'Memuat data...'
                : error
                  ? 'Lokasi/data belum tersedia'
                  : `${locationName} · ${
                      usingUserLocation ? 'Lokasi Anda' : 'Pemantauan Aktif'
                    }`}
            </span>

            <button
              type="button"
              onClick={handleUseMyLocation}
              disabled={loading || locationLoading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-strong)] px-2.5 py-1 text-xs font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {locationLoading ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <MapPin size={12} />
              )}
              Gunakan Lokasi Saya
            </button>

            {savedLocations.length > 0 && (
              <div className="relative" ref={locDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowLocDropdown((v) => !v)}
                  disabled={loading || locationLoading}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    activeLocationId
                      ? 'border-[#4ade80]/50 text-[#4ade80] bg-[rgba(74,222,128,0.08)]'
                      : 'border-[#adc6ff]/40 text-[#adc6ff] hover:bg-[rgba(173,198,255,0.12)]'
                  }`}
                >
                  <BookMarked size={12} />
                  {activeLocationId
                    ? (savedLocations.find((l) => l.id === activeLocationId)?.name ??
                      'Lokasi Tersimpan')
                    : 'Lokasi Tersimpan'}
                  <ChevronDown
                    size={11}
                    className={`transition-transform ${showLocDropdown ? 'rotate-180' : ''}`}
                  />
                </button>

                {showLocDropdown && (
                  <div className="absolute left-0 top-full mt-1.5 z-[500] w-64 bg-[#1d2027] border border-[rgba(255,255,255,0.1)] rounded-xl shadow-2xl overflow-hidden">
                    <p className="px-3 py-2 text-[10px] uppercase tracking-widest text-[#8c909f] border-b border-[rgba(255,255,255,0.06)]">
                      Pilih Lokasi Pantauan
                    </p>

                    <ul className="max-h-52 overflow-y-auto">
                      {savedLocations.map((loc) => {
                        const hasCoords = loc.latitude != null && loc.longitude != null;

                        return (
                          <li key={loc.id}>
                            <button
                              type="button"
                              onClick={() => hasCoords && handleSelectSavedLocation(loc)}
                              disabled={!hasCoords}
                              className={`w-full flex items-start gap-2.5 px-3 py-2.5 text-left transition-colors border-b border-[rgba(255,255,255,0.04)] last:border-0 ${
                                !hasCoords
                                  ? 'opacity-40 cursor-not-allowed'
                                  : activeLocationId === loc.id
                                    ? 'bg-[rgba(74,222,128,0.08)]'
                                    : 'hover:bg-[rgba(173,198,255,0.06)]'
                              }`}
                            >
                              <MapPin
                                size={13}
                                className={`shrink-0 mt-0.5 ${
                                  activeLocationId === loc.id
                                    ? 'text-[#4ade80]'
                                    : 'text-[#adc6ff]'
                                }`}
                              />

                              <div className="min-w-0">
                                <p
                                  className={`text-sm font-medium truncate ${
                                    activeLocationId === loc.id
                                      ? 'text-[#4ade80]'
                                      : 'text-[#e1e2ec]'
                                  }`}
                                >
                                  {loc.name}
                                </p>

                                <p className="text-[#8c909f] text-xs truncate">
                                  {loc.address}
                                </p>

                                {!hasCoords && (
                                  <p className="text-[#ffb786] text-[10px] mt-0.5">
                                    Koordinat belum ada — atur ulang di Settings
                                  </p>
                                )}
                              </div>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <p className="basis-full text-[var(--text-muted)] text-xs mt-1">
              Lat {userCoords.lat.toFixed(5)} · Lng {userCoords.lng.toFixed(5)}
            </p>
          </div>
        </div>

        <div className="flex w-full items-center justify-between gap-3 rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-card)] px-3 py-3 shadow-sm lg:w-auto lg:justify-end lg:bg-transparent lg:border-0 lg:p-0 lg:shadow-none">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--bg-soft)] text-[var(--accent)]">
              <CloudRain size={17} />
            </div>

            <div>
              <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                System Time
              </p>
              <LiveClock />
            </div>
          </div>

          <ThemeToggle compact />
        </div>
      </div>

      {error && (
        <div className="flex items-start justify-between gap-3 p-4 rounded-xl bg-[rgba(100,100,100,0.15)] border border-[rgba(255,255,255,0.15)]">
          <div className="flex items-start gap-3">
            <WifiOff size={18} className="text-[#8c909f] mt-0.5 shrink-0" />

            <div>
              <p className="text-[#e1e2ec] font-semibold text-sm lg:text-base">
                Data Tidak Tersambung
              </p>

              <p className="text-[#8c909f] text-xs lg:text-sm mt-0.5">
                Pastikan backend berjalan di{' '}
                <code className="text-[#adc6ff]">localhost:8000</code>. Jika masalah
                berasal dari lokasi, pastikan izin lokasi browser sudah aktif.
              </p>

              <p className="text-[#8c909f] text-[10px] mt-1 font-mono">
                {error}
              </p>
            </div>
          </div>

          <button
            onClick={() => loadRiskData()}
            className="px-3 py-1.5 rounded-lg border border-[#adc6ff] text-[#adc6ff] text-xs lg:text-sm hover:bg-[rgba(173,198,255,0.15)] transition-colors shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {waterFreshnessWarning && !loading && !error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[rgba(92,60,0,0.25)] border border-[rgba(255,183,134,0.25)]">
          <AlertTriangle size={18} className="text-[#ffb786] mt-0.5 shrink-0" />

          <div>
            <p className="text-[#ffb786] font-semibold text-sm lg:text-base">
              Peringatan Data Sensor
            </p>

            <p className="text-[#e1e2ec] text-xs lg:text-sm mt-0.5">
              {waterFreshnessWarning}
            </p>
          </div>
        </div>
      )}

      {isDangerWaterLevel && !loading && !error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[rgba(185,28,28,0.15)] border border-[rgba(255,68,68,0.3)]">
          <AlertTriangle size={18} className="text-[#ffb4ab] mt-0.5 shrink-0" />

          <div>
            <p className="text-[#ffb4ab] font-semibold text-sm lg:text-base">
              Peringatan Tinggi Muka Air
            </p>

            <p className="text-[#e1e2ec] text-xs lg:text-sm mt-0.5">
              Tinggi muka air di pos {waterStationName} berada pada level bahaya
              {waterLevel !== null && waterLevel !== undefined ? ` (${waterLevel} cm)` : ''}.
              Tetap waspada dan pantau laporan terbaru di sekitar lokasi Anda.
            </p>
          </div>
        </div>
      )}

      {!acknowledged && isHighRisk && !loading && !error && (
        <div className="flex items-start justify-between gap-3 p-4 rounded-xl bg-[rgba(185,28,28,0.15)] border border-[rgba(255,68,68,0.3)]">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="text-[#ffb4ab] mt-0.5 shrink-0" />

            <div>
              <p className="text-[#ffb4ab] font-semibold text-sm lg:text-base">
                RISIKO TINGGI:
              </p>

              <p className="text-[#e1e2ec] text-xs lg:text-sm mt-0.5">
                Potensi banjir di area {locationName} — probabilitas{' '}
                {probabilityPct.toFixed(1)}% berdasarkan data BMKG & model analisis.
              </p>
            </div>
          </div>

          <button
            onClick={() => setAcknowledged(true)}
            className="px-3 py-1.5 rounded-lg border border-[#ffb4ab] text-[#ffb4ab] text-xs lg:text-sm hover:bg-[rgba(255,180,171,0.15)] transition-colors shrink-0"
          >
            OK
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <div className="bg-[#1d2027] border border-[rgba(255,255,255,0.06)] rounded-xl p-3 lg:p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#8c909f] text-[10px] lg:text-xs uppercase tracking-widest">
              Level Risiko
            </p>

            {loading ? (
              <Loader2 size={14} className="text-[#8c909f] animate-spin" />
            ) : (
              <AlertTriangle size={14} style={{ color: riskLevelColor(riskLevel) }} />
            )}
          </div>

          <p
            className="text-2xl lg:text-3xl font-bold mt-1"
            style={{ color: loading ? '#8c909f' : riskLevelColor(riskLevel) }}
          >
            {loading ? '...' : riskLevelToLabel(riskLevel)}
          </p>

          <div className="mt-2 w-full h-1.5 rounded-full bg-[rgba(255,255,255,0.1)]">
            <div
              className="h-1.5 rounded-full transition-all duration-700"
              style={{
                width: loading ? '0%' : `${riskLevelProgress(riskScore)}%`,
                backgroundColor: riskLevelColor(riskLevel),
              }}
            />
          </div>
        </div>

        <div className="bg-[#1d2027] border border-[rgba(255,255,255,0.06)] rounded-xl p-3 lg:p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#8c909f] text-[10px] lg:text-xs uppercase tracking-widest">
              Tren Risiko
            </p>

            {loading ? (
              <Loader2 size={14} className="text-[#8c909f] animate-spin" />
            ) : (
              <TrendingUp size={14} className="text-[#adc6ff]" />
            )}
          </div>

          <p className="text-[#e1e2ec] text-xl lg:text-3xl font-bold mt-1">
            {loading ? '...' : trendToLabel(trend)}
          </p>

          <p className="text-[#adc6ff] text-xs mt-1">
            {loading ? '' : `${trendToArrow(trend)} ${probabilityPct.toFixed(1)}%`}
          </p>
        </div>

        <div className="bg-[#1d2027] border border-[rgba(255,255,255,0.06)] rounded-xl p-3 lg:p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#8c909f] text-[10px] lg:text-xs uppercase tracking-widest">
              Cuaca Aktif
            </p>

            {loading ? (
              <Loader2 size={14} className="text-[#8c909f] animate-spin" />
            ) : (
              <CloudRain size={14} className="text-[#adc6ff]" />
            )}
          </div>

          <p className="text-[#e1e2ec] text-xl lg:text-3xl font-bold mt-1">
            {loading ? '...' : `${(weatherScore * 100).toFixed(0)}%`}
          </p>

          <p className="text-[#60a5fa] text-xs mt-1">
            {loading ? '' : `Intensitas: ${getIntensityLabel(rainIntensity)}`}
          </p>
        </div>

        <div className="bg-[#1d2027] border border-[rgba(255,255,255,0.06)] rounded-xl p-3 lg:p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#8c909f] text-[10px] lg:text-xs uppercase tracking-widest">
              Laporan Sekitar
            </p>

            <FileText size={14} className="text-[#adc6ff]" />
          </div>

          <p className="text-[#e1e2ec] text-xl lg:text-3xl font-bold mt-1">
            {loading ? '...' : `${todayReports.length} Unit`}
          </p>

          <p className="text-[#8c909f] text-xs mt-1">
            {dashboardReports.filter((r) => r.status === 'pending').length} Perlu Verifikasi
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#1d2027] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
          <p className="text-[#8c909f] text-xs uppercase tracking-widest mb-2">
            Pos Air Terdekat
          </p>

          <p className="text-[#e1e2ec] font-semibold">
            {loading ? 'Memuat...' : waterStationName}
          </p>

          <p className="text-[#8c909f] text-xs mt-1">
            {loading
              ? ''
              : waterDistance !== undefined
                ? `Jarak sekitar ${waterDistance.toFixed(2)} km dari lokasi monitoring`
                : 'Jarak tidak tersedia'}
          </p>
        </div>

        <div className="bg-[#1d2027] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <p className="text-[#8c909f] text-xs uppercase tracking-widest">
              Tinggi Muka Air
            </p>

            {!loading && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${getWaterLevelBadgeClass(
                  waterLevelLabel,
                )}`}
              >
                {waterLevelLabel}
              </span>
            )}
          </div>

          <p className={`font-semibold text-xl ${getWaterLevelTextColor(waterLevelLabel)}`}>
            {loading
              ? 'Memuat...'
              : waterLevel !== null && waterLevel !== undefined
                ? `${waterLevel} cm`
                : 'Tidak tersedia'}
          </p>

          <p className="text-[#8c909f] text-xs mt-1">
            {loading ? '' : formatWaterAlertStatus(waterAlertStatus)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-stretch">
        <div
          className="lg:col-span-3 bg-[#1d2027] border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden cursor-pointer hover:border-[rgba(173,198,255,0.3)] transition-colors flex flex-col min-h-[420px] max-h-[620px]"
          style={{ isolation: 'isolate' }}
          onClick={() => navigate('/dashboard/map')}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.06)] shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#adc6ff] rounded-full animate-pulse" />

              <span className="text-[#8c909f] text-xs uppercase tracking-widest font-semibold">
                Jakarta Tactical Grid
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#8c909f] text-xs hidden sm:inline">
                LAT {userCoords.lat.toFixed(4)} | LNG {userCoords.lng.toFixed(4)}
              </span>

              <ExternalLink size={12} className="text-[#adc6ff]" />
            </div>
          </div>

          <div className="relative flex-1 min-h-[360px]">
            <MapContainer
              center={[userCoords.lat, userCoords.lng]}
              zoom={12}
              zoomControl={false}
              scrollWheelZoom={false}
              dragging={false}
              doubleClickZoom={false}
              style={{
                position: 'absolute',
                inset: 0,
                height: '100%',
                width: '100%',
                background: mapBackground,
              }}
            >
              <MapResizer />

              <MapCenterUpdater center={[userCoords.lat, userCoords.lng]} />

              <ThemedTileLayer />

              <Marker position={[userCoords.lat, userCoords.lng]} icon={userLocationIcon}>
                <Popup>
                  <div style={{ minWidth: 160 }}>
                    <strong>
                      {usingUserLocation ? 'Lokasi Anda' : 'Lokasi Monitoring Default'}
                    </strong>
                    <br />
                    <span>{locationName}</span>
                    <br />
                    <small>
                      Lat {userCoords.lat.toFixed(5)}, Lng {userCoords.lng.toFixed(5)}
                    </small>
                  </div>
                </Popup>
              </Marker>

              <CircleMarker
                center={[userCoords.lat, userCoords.lng]}
                radius={18}
                pathOptions={{
                  color: '#60a5fa',
                  fillColor: '#60a5fa',
                  fillOpacity: 0.12,
                  weight: 2,
                }}
              />

              {dashboardReports.map((report) => (
                <CircleMarker
                  key={report.id}
                  center={[report.latitude, report.longitude]}
                  radius={7}
                  pathOptions={{
                    color: riskLevelColor(
                      report.severity === 'KRITIS'
                        ? 'HIGH'
                        : report.severity === 'SEDANG'
                          ? 'MEDIUM'
                          : 'LOW',
                    ),
                    fillColor: riskLevelColor(
                      report.severity === 'KRITIS'
                        ? 'HIGH'
                        : report.severity === 'SEDANG'
                          ? 'MEDIUM'
                          : 'LOW',
                    ),
                    fillOpacity: 0.85,
                    weight: 2,
                  }}
                />
              ))}

              {mapRiskPoints.map((point) => (
                <CircleMarker
                  key={point.id}
                  center={point.coordinates}
                  radius={8}
                  pathOptions={{
                    color: riskPointColors[point.level] ?? '#adc6ff',
                    fillColor: riskPointColors[point.level] ?? '#adc6ff',
                    fillOpacity: 0.5,
                    weight: 2,
                  }}
                />
              ))}
            </MapContainer>

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center pointer-events-none z-[999]">
              <div className="bg-[rgba(16,19,26,0.8)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2">
                <p className="text-[#adc6ff] text-xs text-center font-medium">
                  Klik untuk membuka peta lengkap
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#1d2027] border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden flex flex-col min-h-[420px] max-h-[620px]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.06)] shrink-0">
            <div className="flex items-center gap-2">
              <FileText size={14} className="text-[#adc6ff]" />

              <span className="text-[#e1e2ec] text-sm font-semibold uppercase tracking-wide">
                Recent Activity
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigate('/dashboard/reports')}
              className="text-[#adc6ff] text-xs hover:underline"
            >
              View Log
            </button>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-[rgba(255,255,255,0.04)]">
            {recentReports.length === 0 ? (
              <div className="p-4">
                <p className="text-[#e1e2ec] text-sm font-medium">
                  Belum ada laporan di sekitar lokasi ini.
                </p>

                <p className="text-[#8c909f] text-xs mt-1">
                  Radius pemantauan saat ini: {REPORT_RADIUS_KM} km.
                </p>
              </div>
            ) : (
              recentReports.map((report) => (
                <div
                  key={report.id}
                  className="p-3 lg:p-4 hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/dashboard/reports/${report.id}`);
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-md uppercase ${
                        severityBg[report.severity] ?? severityBg.SEDANG
                      }`}
                    >
                      {report.severity}
                    </span>

                    <span className="text-[#8c909f] text-xs">
                      {formatReportTime(report.created_at)}
                    </span>
                  </div>

                  <p className="text-[#e1e2ec] text-sm font-medium mt-1.5 line-clamp-1">
                    {report.title}
                  </p>

                  <p className="text-[#8c909f] text-xs mt-1 line-clamp-2">
                    {report.description}
                  </p>

                  <p className="text-[#8c909f] text-xs mt-1 line-clamp-1">
                    {report.location_name ?? 'Lokasi tidak tersedia'}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}