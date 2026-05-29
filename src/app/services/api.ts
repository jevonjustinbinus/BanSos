// ── BanSos Backend API Service ──────────────────────────────────
// Centralized service for calling the FastAPI backend.
// In dev, Vite's proxy rewrites /api/* → http://localhost:8000/*

const API_BASE = '/api';

<<<<<<< HEAD
=======
// ── Request Cache (rate-limit guard) ────────────────────────────
// External API (Open-Meteo, backend /risk) memiliki limit 60 req/menit per IP.
// Lapisan cache ini memastikan:
//   1. Request dengan koordinat & endpoint yang sama tidak dikirim ulang
//      selama data masih segar (TTL belum habis).
//   2. Request paralel untuk key yang sama hanya menghasilkan SATU network call
//      (deduplication via in-flight map).

interface CacheEntry<T> {
  data: T;
  expiresAt: number; // ms epoch
}

const _apiCache   = new Map<string, CacheEntry<unknown>>();
const _inFlight   = new Map<string, Promise<unknown>>();

/**
 * Jalankan `fetcher` dengan cache + deduplication otomatis.
 * @param key     Cache key unik, mis. "flood:-6.2088:106.8456"
 * @param ttlMs   Lama cache valid dalam milidetik
 * @param fetcher Fungsi async yang benar-benar memanggil API
 */
async function cachedFetch<T>(
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  // 1. Kembalikan cache jika masih segar
  const hit = _apiCache.get(key) as CacheEntry<T> | undefined;
  if (hit && Date.now() < hit.expiresAt) return hit.data;

  // 2. Request paralel → tunggu yang sedang berjalan
  if (_inFlight.has(key)) return _inFlight.get(key) as Promise<T>;

  // 3. Kirim request baru
  const promise = fetcher()
    .then((data) => {
      _apiCache.set(key, { data, expiresAt: Date.now() + ttlMs });
      _inFlight.delete(key);
      return data;
    })
    .catch((err) => {
      _inFlight.delete(key); // biarkan retry jika gagal
      throw err;
    });

  _inFlight.set(key, promise);
  return promise;
}

/** Bulatkan koordinat ke 4 desimal (~11 m) agar cache-hit lebih tinggi */
const toKey = (prefix: string, lat: number, lng: number) =>
  `${prefix}:${lat.toFixed(4)}:${lng.toFixed(4)}`;

// TTL per endpoint
const TTL_FLOOD_RISK = 10 * 60 * 1000; // 10 menit
const TTL_FORECAST   = 30 * 60 * 1000; // 30 menit (prakiraan cuaca berubah lambat)

>>>>>>> commit2-update
// ── Flood Risk Response Types ───────────────────────────────────

export interface FloodRiskLocation {
  lat: number;
  lng: number;
  kelurahan: string;
  kecamatan: string;
  kota_administrasi: string;
  kode_kelurahan: string;
  kode_kecamatan: string;
}

export interface FloodRiskScore {
  final_score: number;
  probability_percent: number;
  risk_level: 'HIGH' | 'MEDIUM' | 'LOW';
  trend: 'RISING' | 'STABLE' | 'DECREASING';
}

export interface FloodRiskComponents {
  weather_score: number;
  water_score: number;
  baseline_score: number;
  historical_score: number;
}

export interface WeatherDetails {
  weather_score: number;
  rain_intensity_score: number;
  duration_score: number;
  avg_humidity_score: number;
  avg_cloud_score: number;
  rainy_slots: number;
  total_slots: number;
  forecast_start: string;
  forecast_end: string;
}

export interface WaterStationFreshness {
  is_fresh: boolean;
  age_hours: number | null;
  warning: string | null;
}

export interface WaterStationDetails {
  station_id: string;
  station_name: string;
  location: string;
  latitude: number;
  longitude: number;
  water_level: number | null;
  previous_water_level: number | null;
  alert_status: string;
  trend: string;
  distance_km: number;
  raw_water_score: number;
  water_score: number;
  freshness: WaterStationFreshness;
  timestamp: string;
  last_updated: string;
}

export interface StaticDetails {
  historical_score: number;
  static_risk_score: number;
  message?: string;
}

export interface FloodRiskResponse {
  success: boolean;
  message?: string;
  location: FloodRiskLocation;
  risk: FloodRiskScore;
  components: FloodRiskComponents;
  details: {
    weather: WeatherDetails;
    water_station: WaterStationDetails;
    static: StaticDetails;
  };
  disclaimer: string;
}

// ── Database/API Types ──────────────────────────────────────────

export interface ReportMedia {
  id: string;
  report_id: string;
  media_url: string;
  media_type: 'image' | 'video' | string;
  storage_path?: string;
  created_at?: string;
}

export interface CommunityReport {
  id: string;
  user_id?: string | null;
  reporter_name?: string | null;
  title: string;
  description: string;
  category: string;
  severity: 'KRITIS' | 'SEDANG' | 'RENDAH' | string;
  latitude: number;
  longitude: number;
  location_name?: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'duplicate' | 'need_review' | 'resolved' | string;
  confidence_score?: number | null;
  created_at?: string;
  updated_at?: string;
  report_media?: ReportMedia[];
}

export interface ReportPayload {
  title: string;
  description: string;
  category: string;
  severity: string;
  latitude: number;
  longitude: number;
  location_name?: string;
  user_id?: string;
  reporter_name?: string;
}

export interface BroadcastPayload {
  title: string;
  message: string;
  severity: string;
  target_location?: string;
  latitude?: number;
  longitude?: number;
  radius_m?: number;
  admin_id?: string;
}

export interface BroadcastAlert {
  id: string;
  admin_id?: string | null;
  title: string;
  message: string;
  severity: string;
  target_location?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  radius_m?: number | null;
  created_at?: string;
}

export interface SavedLocation {
  id: string;
  user_id: string;
  name: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  status: 'clear' | 'alert';
  radius: number;
  created_at?: string;
  updated_at?: string;
}

export interface SavedLocationPayload {
  user_id: string;
  name: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  status: 'clear' | 'alert';
  radius: number;
}

export interface AdminOverview {
  pending_reports: number;
  approved_reports: number;
  rejected_reports: number;
  broadcast_alerts: number;
}

async function parseJsonResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`${fallbackMessage}: ${response.status} ${errorText}`);
  }
  return response.json() as Promise<T>;
}

// ── Risk API Functions ─────────────────────────────────────────

export async function fetchFloodRisk(lat: number, lng: number): Promise<FloodRiskResponse> {
<<<<<<< HEAD
  const response = await fetch(`${API_BASE}/risk?lat=${lat}&lng=${lng}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  const data = await parseJsonResponse<FloodRiskResponse>(response, 'Failed to fetch flood risk');

  if (!data.success) {
    throw new Error(data.message || 'Location not found in flood risk data.');
  }

  return data;
=======
  return cachedFetch(toKey('flood', lat, lng), TTL_FLOOD_RISK, async () => {
    const response = await fetch(`${API_BASE}/risk?lat=${lat}&lng=${lng}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    const data = await parseJsonResponse<FloodRiskResponse>(response, 'Failed to fetch flood risk');

    if (!data.success) {
      throw new Error(data.message || 'Location not found in flood risk data.');
    }

    return data;
  });
>>>>>>> commit2-update
}

export async function pingBackend(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    return response.ok;
  } catch {
    return false;
  }
}

// ── Report API Functions ───────────────────────────────────────

export async function createReport(payload: ReportPayload): Promise<{ success: boolean; data: CommunityReport }> {
  const response = await fetch(`${API_BASE}/reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse(response, 'Failed to create report');
}

export async function uploadReportMedia(reportId: string, file: File): Promise<{ success: boolean; data: ReportMedia }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/reports/${reportId}/media`, {
    method: 'POST',
    body: formData,
  });

  return parseJsonResponse(response, 'Failed to upload report media');
}

export async function createReportWithMedia(
  payload: ReportPayload,
  files: File[] = []
): Promise<{ success: boolean; data: CommunityReport }> {
  const created = await createReport(payload);

  if (created.data?.id && files.length > 0) {
    await Promise.all(files.map((file) => uploadReportMedia(created.data.id, file)));
  }

  return created;
}

export async function fetchReports(status?: string): Promise<{ success: boolean; data: CommunityReport[] }> {
  const url = status
    ? `${API_BASE}/reports?status=${encodeURIComponent(status)}`
    : `${API_BASE}/reports`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  return parseJsonResponse(response, 'Failed to fetch reports');
}

export async function fetchReportDetail(reportId: string): Promise<{ success: boolean; data: CommunityReport }> {
  const response = await fetch(`${API_BASE}/reports/${reportId}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  return parseJsonResponse(response, 'Failed to fetch report detail');
}

export async function confirmReport(reportId: string): Promise<{ success: boolean; data: CommunityReport }> {
  const response = await fetch(`${API_BASE}/reports/${reportId}/confirm`, {
    method: 'POST',
    headers: { Accept: 'application/json' },
  });

  return parseJsonResponse(response, 'Failed to confirm report');
}

export async function updateReportStatus(
  reportId: string,
  status: string,
  reason?: string,
  admin_notes?: string
): Promise<{ success: boolean; data: CommunityReport[] }> {
  const response = await fetch(`${API_BASE}/reports/${reportId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ status, reason, admin_notes }),
  });

  return parseJsonResponse(response, 'Failed to update report status');
}

// ── Admin/Broadcast API Functions ──────────────────────────────

export async function fetchAdminOverview(): Promise<{ success: boolean; data: AdminOverview }> {
  const response = await fetch(`${API_BASE}/admin/overview`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  return parseJsonResponse(response, 'Failed to fetch admin overview');
}

export async function createBroadcast(payload: BroadcastPayload): Promise<{ success: boolean; data: BroadcastAlert }> {
  const response = await fetch(`${API_BASE}/broadcasts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse(response, 'Failed to create broadcast');
}

export async function fetchBroadcasts(): Promise<{ success: boolean; data: BroadcastAlert[] }> {
  const response = await fetch(`${API_BASE}/broadcasts`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  return parseJsonResponse(response, 'Failed to fetch broadcasts');
}

// ── Saved Locations API Functions ──────────────────────────────

export async function fetchSavedLocations(userId: string): Promise<{ success: boolean; data: SavedLocation[] }> {
  const response = await fetch(`${API_BASE}/saved-locations?user_id=${encodeURIComponent(userId)}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  return parseJsonResponse(response, 'Failed to fetch saved locations');
}

export async function createSavedLocation(payload: SavedLocationPayload): Promise<{ success: boolean; data: SavedLocation }> {
  const response = await fetch(`${API_BASE}/saved-locations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  return parseJsonResponse(response, 'Failed to create saved location');
}

export async function updateSavedLocation(
  locationId: string,
  patch: Partial<Pick<SavedLocationPayload, 'name' | 'address' | 'status' | 'radius'>>
): Promise<{ success: boolean; data: SavedLocation }> {
  const response = await fetch(`${API_BASE}/saved-locations/${locationId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(patch),
  });
  return parseJsonResponse(response, 'Failed to update saved location');
}

export async function deleteSavedLocation(locationId: string): Promise<{ success: boolean; data: null }> {
  const response = await fetch(`${API_BASE}/saved-locations/${locationId}`, {
    method: 'DELETE',
    headers: { Accept: 'application/json' },
  });
  return parseJsonResponse(response, 'Failed to delete saved location');
}

<<<<<<< HEAD
=======
// ── Hourly Forecast (Open-Meteo) ───────────────────────────────

/**
 * Single data-point returned by fetchHourlyForecast.
 * `rainfall` is real accumulated precipitation in mm for that hour.
 */
export interface HourlyForecastPoint {
  /** Human-readable hour label, e.g. "06:00" */
  time: string;
  /** Sequential index 0-47 across 48 hours */
  index: number;
  /** Chart axis tick label shown every 8 hours, e.g. "0d 06h" */
  label: string;
  /** Precipitation in mm (= mm/hr for hourly data) */
  rainfall: number;
}

/**
 * Fetch real 48-hour hourly precipitation forecast from Open-Meteo.
 * Free API — no key required.
 * Throws if the network request fails.
 */
export async function fetchHourlyForecast(
  lat: number,
  lng: number
): Promise<HourlyForecastPoint[]> {
  return cachedFetch(toKey('forecast', lat, lng), TTL_FORECAST, async () => {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lng}` +
      `&hourly=precipitation` +
      `&forecast_days=2` +
      `&timezone=auto`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Gagal mengambil prakiraan cuaca: ${response.status}`);
    }

    const data = await response.json();
    const times: string[] = data.hourly?.time ?? [];
    const precipitation: number[] = data.hourly?.precipitation ?? [];

    return times.slice(0, 48).map((isoTime, i) => {
      const d = new Date(isoTime);
      const hour = d.getHours();
      const dayNum = Math.floor(i / 24);
      return {
        time: `${String(hour).padStart(2, '0')}:00`,
        index: i,
        label: i % 8 === 0 ? `${dayNum}d ${String(hour).padStart(2, '0')}h` : '',
        rainfall: Math.round((precipitation[i] ?? 0) * 10) / 10,
      };
    });
  });
}

>>>>>>> commit2-update
// ── Helper Formatters ───────────────────────────────────────────

export function riskLevelToLabel(level: string): string {
  switch (level) {
    case 'HIGH': return 'TINGGI';
    case 'MEDIUM': return 'SEDANG';
    case 'LOW': return 'RENDAH';
    default: return level;
  }
}

export function trendToLabel(trend: string): string {
  switch (trend) {
    case 'RISING': return 'Meningkat';
    case 'STABLE': return 'Stabil';
    case 'DECREASING': return 'Menurun';
    default: return trend;
  }
}

export function trendToArrow(trend: string): string {
  switch (trend) {
    case 'RISING': return '↗';
    case 'STABLE': return '→';
    case 'DECREASING': return '↘';
    default: return '→';
  }
}

export function riskLevelColor(level: string): string {
  switch (level) {
    case 'HIGH': return '#ef4444';
    case 'MEDIUM': return '#fb923c';
    case 'LOW': return '#22c55e';
    default: return '#8c909f';
  }
}

export function riskLevelProgress(score: number): number {
  return Math.round(score * 100);
}

export function formatAlertStatus(status: string): string {
  const s = status.toUpperCase();
  if (s.includes('SIAGA 1')) return 'Siaga 1 — Kritis';
  if (s.includes('SIAGA 2')) return 'Siaga 2 — Waspada';
  if (s.includes('SIAGA 3')) return 'Siaga 3 — Siaga';
  if (s.includes('NORMAL')) return 'Normal';
  return status;
}

export function severityToIndonesian(severity: string): 'KRITIS' | 'SEDANG' | 'RENDAH' {
  const s = severity.toLowerCase();
  if (s === 'critical' || s === 'high' || s === 'kritis') return 'KRITIS';
  if (s === 'low' || s === 'rendah') return 'RENDAH';
  return 'SEDANG';
}