import { useState, useEffect, useMemo, useCallback, type MouseEvent } from 'react';
import { useNavigate } from 'react-router';
import {
  Filter,
  Plus,
  MapPin,
  CheckCircle,
  X,
  RefreshCw,
  AlertTriangle,
  Clock,
  LocateFixed,
} from 'lucide-react';
import { fetchReports, voteReport, type CommunityReport } from '../services/api';
import { supabase } from '../services/supabaseClient';
import { FilterSheet, DEFAULT_FILTERS, countActiveFilters } from '../components/FilterSheet';
import type { FilterState } from '../components/FilterSheet';
import { getCurrentUserLocation } from '../services/location';
import imgFloodDisaster from '../../assets/images/flood-disaster.png';

const severityStyle: Record<string, string> = {
  KRITIS:
    'bg-red-200/40 text-red-500 border border-red-100 dark:bg-[#93000a] dark:text-[#ffdad6] dark:border-[rgba(255,218,214,0.2)]',

  SEDANG:
    'bg-amber-200/40 text-amber-600 border border-amber-100 dark:bg-[#5c3c00] dark:text-[#ffb786] dark:border-[rgba(255,183,134,0.2)]',

  RENDAH:
    'bg-emerald-200/40 text-emerald-600 border border-emerald-100 dark:bg-[#002105] dark:text-[#7dd878] dark:border-[rgba(125,216,120,0.2)]',
};

const categoryStyle: Record<string, string> = {
  BANJIR:
    'bg-blue-200 text-blue-700 border border-blue-100 dark:bg-[#2444AB] dark:text-[#adc6ff] dark:border-[rgba(173,198,255,0.2)]',
};

const CHIP_LABEL: Record<string, string> = {
  BANJIR: 'Banjir',
  KRITIS: 'Kritis',
  SEDANG: 'Sedang',
  RENDAH: 'Aman',
  '30min': '30 menit lalu',
  '1hr': '1 jam lalu',
  '3hr': '3 jam lalu',
  '6hr': '6 jam lalu',
  valid: 'Valid',
  tidak: 'Belum Valid',
};

const WAKTU_MINS: Record<string, number> = {
  '30min': 30,
  '1hr': 60,
  '3hr': 180,
  '6hr': 360,
};

const USER_LOCATION_KEY = 'bansos_user_location';

type UserCoords = {
  lat: number;
  lng: number;
};

type ReportWithDistance = CommunityReport & {
  distance_km?: number;
};

function getSavedUserLocation(): UserCoords | null {
  try {
    const raw = sessionStorage.getItem(USER_LOCATION_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as UserCoords;

    if (
      typeof parsed.lat === 'number' &&
      typeof parsed.lng === 'number' &&
      Number.isFinite(parsed.lat) &&
      Number.isFinite(parsed.lng)
    ) {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}

function saveUserLocation(coords: UserCoords) {
  try {
    sessionStorage.setItem(USER_LOCATION_KEY, JSON.stringify(coords));
  } catch {
    // ignore storage error
  }
}

function getMinutesAgo(createdAt?: string): number {
  if (!createdAt) return 9999;

  const createdTime = new Date(createdAt).getTime();

  if (Number.isNaN(createdTime)) return 9999;

  return Math.max(0, (Date.now() - createdTime) / 60000);
}

function formatTimeAgo(createdAt?: string): string {
  const mins = getMinutesAgo(createdAt);

  if (mins < 1) return 'baru saja';
  if (mins < 60) return `${Math.floor(mins)} menit lalu`;

  const hours = Math.floor(mins / 60);

  if (hours < 24) return `${hours} jam lalu`;

  return `${Math.floor(hours / 24)} hari lalu`;
}

function getFirstImage(report: CommunityReport): string | null {
  const anyReport = report as any;

  const media =
    anyReport.report_media ??
    anyReport.media ??
    anyReport.reportMedia ??
    anyReport.attachments ??
    [];

  if (!Array.isArray(media) || media.length === 0) return null;

  const image = media.find((item: any) => {
    const type = String(item.media_type ?? item.type ?? item.mime_type ?? '').toLowerCase();
    return type.includes('image') || type === 'photo';
  });

  if (!image) return null;

  return (
    image?.media_url ??
    image?.url ??
    image?.file_url ??
    image?.public_url ??
    image?.path ??
    null
  );
}

function getFirstVideo(report: CommunityReport): string | null {
  const anyReport = report as any;

  const media =
    anyReport.report_media ??
    anyReport.media ??
    anyReport.reportMedia ??
    anyReport.attachments ??
    [];

  if (!Array.isArray(media) || media.length === 0) return null;

  const video = media.find((item: any) => {
    const type = String(item.media_type ?? item.type ?? item.mime_type ?? '').toLowerCase();
    return type.includes('video');
  });

  if (!video) return null;

  return (
    video?.media_url ??
    video?.url ??
    video?.file_url ??
    video?.public_url ??
    video?.path ??
    null
  );
}

function getReportCoordinates(report: CommunityReport): UserCoords | null {
  const lat = Number((report as any).latitude);
  const lng = Number((report as any).longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  return { lat, lng };
}

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

function parseRadiusKm(radius?: string | number | null): number | null {
  if (radius === null || radius === undefined || radius === '') return null;

  if (typeof radius === 'number') {
    return Number.isFinite(radius) && radius > 0 ? radius : null;
  }

  const value = String(radius).trim().toLowerCase();

  if (!value || value === 'all' || value === 'semua') return null;

  const numeric = Number(value.replace(',', '.').match(/[\d.]+/)?.[0]);

  if (!Number.isFinite(numeric) || numeric <= 0) return null;

  if (value.includes('m') && !value.includes('km')) {
    return numeric / 1000;
  }

  return numeric;
}

function formatRadiusLabel(radius?: string | number | null) {
  const km = parseRadiusKm(radius);

  if (!km) return '';

  if (km < 1) {
    return `Radius ${Math.round(km * 1000)} meter`;
  }

  return `Radius ${km} km`;
}

function formatDistance(distance?: number) {
  if (distance === undefined || distance === null || !Number.isFinite(distance)) {
    return 'Jarak tidak tersedia';
  }

  if (distance < 1) {
    return `${Math.round(distance * 1000)} m dari lokasi Anda`;
  }

  return `${distance.toFixed(2)} km dari lokasi Anda`;
}

function formatConfidence(score?: number | null) {
  const value = Number(score ?? 0);

  if (!Number.isFinite(value)) return '0%';

  return `${Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1)}%`;
}

function getCurrentUserVote(report: CommunityReport): 'confirm' | 'deny' | null {
  const anyReport = report as any;
  const vote = anyReport.current_user_vote ?? anyReport.user_vote ?? null;

  return vote === 'confirm' || vote === 'deny' ? vote : null;
}

function hasUserVoted(report: CommunityReport): boolean {
  return getCurrentUserVote(report) !== null;
}

function isReportVoteLocked(report: CommunityReport): boolean {
  return report.status !== 'pending' || hasUserVoted(report);
}

function SkeletonCard() {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-xl overflow-hidden animate-pulse">
      <div className="p-4 lg:p-5 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded-md bg-[var(--bg-soft)]" />
          <div className="h-5 w-20 rounded-md bg-[var(--bg-soft)]" />
        </div>

        <div className="h-5 w-3/4 rounded bg-[var(--bg-soft)]" />
        <div className="h-4 w-full rounded bg-[var(--bg-soft)]" />
        <div className="h-4 w-2/3 rounded bg-[var(--bg-soft)]" />
        <div className="h-24 rounded-lg bg-[var(--bg-soft)]" />

        <div className="flex justify-between pt-2 border-t border-[var(--border-soft)]">
          <div className="h-3 w-28 rounded bg-[var(--bg-soft)]" />
          <div className="h-3 w-20 rounded bg-[var(--bg-soft)]" />
        </div>
      </div>
    </div>
  );
}

export function IncidentReportsPage() {
  const navigate = useNavigate();

  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [userCoords, setUserCoords] = useState<UserCoords | null>(() => getSavedUserLocation());
  const [currentUserId, setCurrentUserId] = useState('');
  const [voteLoading, setVoteLoading] = useState<string | null>(null);

  const activeRadiusKm = parseRadiusKm((filters as any).radius);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data.user?.id ?? '');
    };

    loadCurrentUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUserId(session?.user?.id ?? '');
    });

    return () => subscription.unsubscribe();
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const result = await fetchReports(undefined, currentUserId || undefined);

      const visibleReports = (result.data || []).filter(
        (report) => report.status !== 'rejected'
      );

      setReports(visibleReports);
    } catch (err) {
      console.error(err);
      setError('Gagal mengambil laporan. Pastikan backend aktif dan Supabase terkonfigurasi.');
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  const loadUserLocation = useCallback(async () => {
    setLocationLoading(true);
    setLocationError('');

    try {
      const location = await getCurrentUserLocation();

      const coords = {
        lat: location.latitude,
        lng: location.longitude,
      };

      setUserCoords(coords);
      saveUserLocation(coords);
    } catch (err: any) {
      console.error('Failed to get user location:', err);
      setLocationError(
        err?.message ||
          'Gagal mengambil lokasi Anda. Aktifkan izin lokasi browser agar filter radius bisa berjalan.',
      );
    } finally {
      setLocationLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!userCoords) {
      loadUserLocation();
    }
  }, [loadUserLocation, userCoords]);

  useEffect(() => {
    if (activeRadiusKm && !userCoords && !locationLoading) {
      loadUserLocation();
    }
  }, [activeRadiusKm, userCoords, locationLoading, loadUserLocation]);

  const handleReportVote = async (
    event: MouseEvent<HTMLButtonElement>,
    reportId: string,
    vote: 'confirm' | 'deny',
  ) => {
    event.stopPropagation();

    if (!currentUserId) {
      alert('Silakan login terlebih dahulu untuk memberi konfirmasi laporan.');
      return;
    }

    const targetReport = reports.find((report) => report.id === reportId);

    if (!targetReport) return;

    if (isReportVoteLocked(targetReport)) {
      return;
    }

    const loadingKey = `${reportId}-${vote}`;
    setVoteLoading(loadingKey);

    try {
      const result = await voteReport(reportId, currentUserId, vote);

      setReports((prev) =>
        prev.map((report) =>
          report.id === reportId
            ? {
                ...report,
                ...result.data,
                current_user_vote: vote,
                user_vote: vote,
              }
            : report,
        ),
      );
    } catch (err) {
      console.error(err);
      alert(
        err instanceof Error
          ? err.message
          : 'Gagal mengirim konfirmasi laporan.',
      );
    } finally {
      setVoteLoading(null);
    }
  };

  const reportsWithDistance = useMemo<ReportWithDistance[]>(() => {
    return reports.map((report) => {
      const reportCoords = getReportCoordinates(report);

      if (!userCoords || !reportCoords) {
        return report;
      }

      return {
        ...report,
        distance_km: distanceKm(
          userCoords.lat,
          userCoords.lng,
          reportCoords.lat,
          reportCoords.lng,
        ),
      };
    });
  }, [reports, userCoords]);

  const filteredReports = useMemo(() => {
    return reportsWithDistance.filter((report) => {
      if (report.category !== 'BANJIR') {
        return false;
      }

      if (filters.urgency.length > 0 && !filters.urgency.includes(report.severity)) {
        return false;
      }

      if (filters.waktu) {
        const maxMins = WAKTU_MINS[filters.waktu] ?? 9999;

        if (getMinutesAgo(report.created_at) > maxMins) {
          return false;
        }
      }

      if (filters.validasi === 'valid' && report.status !== 'approved') {
        return false;
      }

      if (filters.validasi === 'tidak' && report.status === 'approved') {
        return false;
      }

      if (activeRadiusKm) {
        if (!userCoords) {
          return false;
        }

        const reportCoords = getReportCoordinates(report);

        if (!reportCoords) {
          return false;
        }

        const distance =
          typeof report.distance_km === 'number'
            ? report.distance_km
            : distanceKm(userCoords.lat, userCoords.lng, reportCoords.lat, reportCoords.lng);

        if (distance > activeRadiusKm) {
          return false;
        }
      }

      return true;
    });
  }, [reportsWithDistance, filters, activeRadiusKm, userCoords]);

  const activeCount = countActiveFilters(filters);

  const activeChips: { key: string; label: string }[] = [
    ...filters.urgency.map((value) => ({
      key: `urg-${value}`,
      label: CHIP_LABEL[value] ?? value,
    })),
    ...(filters.waktu
      ? [
          {
            key: 'waktu',
            label: CHIP_LABEL[filters.waktu] ?? filters.waktu,
          },
        ]
      : []),
    ...(filters.validasi
      ? [
          {
            key: 'validasi',
            label: CHIP_LABEL[filters.validasi] ?? filters.validasi,
          },
        ]
      : []),
    ...(activeRadiusKm
      ? [
          {
            key: 'radius',
            label: formatRadiusLabel((filters as any).radius),
          },
        ]
      : []),
  ];

  const removeChip = (key: string) => {
    if (key.startsWith('urg-')) {
      const value = key.replace('urg-', '');

      setFilters((current) => ({
        ...current,
        urgency: current.urgency.filter((urgency) => urgency !== value),
      }));
    } else if (key === 'waktu') {
      setFilters((current) => ({
        ...current,
        waktu: '',
      }));
    } else if (key === 'validasi') {
      setFilters((current) => ({
        ...current,
        validasi: '',
      }));
    } else if (key === 'radius') {
      setFilters((current) => ({
        ...current,
        radius: '',
      }));
    }
  };

  return (
    <div className="theme-page min-h-screen p-4 lg:p-6 text-[var(--text-main)]">
      <div className="space-y-2 mb-5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-[var(--text-main)] text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight">
              Community Report
            </h1>

            <p className="text-[var(--text-soft)] text-sm sm:text-base mt-1">
              Data lapangan real-time dari warga sekitar Anda
            </p>

            <div className="flex items-center gap-2 mt-2 text-xs text-[var(--text-muted)]">
              <LocateFixed size={13} className="text-[var(--accent)]" />

              {locationLoading ? (
                <span>Mengambil lokasi Anda...</span>
              ) : userCoords ? (
                <span>
                  Lokasi Anda: Lat {userCoords.lat.toFixed(5)} · Lng{' '}
                  {userCoords.lng.toFixed(5)}
                </span>
              ) : (
                <span>Lokasi belum aktif. Filter radius membutuhkan lokasi Anda.</span>
              )}

              <button
                type="button"
                onClick={loadUserLocation}
                disabled={locationLoading}
                className="text-[var(--accent)] hover:underline disabled:opacity-50"
              >
                Perbarui lokasi
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={load}
              disabled={loading}
              className="eye-button flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-soft)] text-[var(--accent)] text-sm hover:bg-[var(--accent-soft)] transition-colors disabled:opacity-40"
              title="Refresh"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            </button>

            <button
              onClick={() => setFilterOpen(true)}
              className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-soft)] text-[var(--text-main)] text-sm backdrop-blur-sm hover:bg-[var(--accent-soft)] transition-colors"
            >
              <Filter size={13} className="text-[var(--accent)] shrink-0" />

              <span className="hidden sm:inline">Filter</span>

              {activeCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[var(--accent)] text-[var(--text-inverse)] text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                  {activeCount}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate('/dashboard/reports/create')}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--text-inverse)] text-sm font-semibold transition-colors"
            >
              <Plus size={13} />

              <span className="hidden sm:inline">Lapor</span>
            </button>
          </div>
        </div>
      </div>

      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeChips.map((chip) => (
            <span
              key={chip.key}
              className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-[var(--accent-soft)] border border-[var(--border-soft)] rounded-full text-[var(--accent)] text-xs"
            >
              {chip.label}

              <button
                onClick={() => removeChip(chip.key)}
                className="hover:bg-[var(--accent-soft)] rounded-full p-0.5 transition-colors"
              >
                <X size={10} />
              </button>
            </span>
          ))}

          <button
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="text-[var(--text-muted)] text-xs hover:text-[var(--text-main)] transition-colors underline"
          >
            Reset semua
          </button>
        </div>
      )}

      {locationError && activeRadiusKm && (
        <div className="flex items-start gap-3 bg-[var(--warning-soft)] border border-[var(--border-soft)] rounded-xl px-4 py-3 mb-4 text-[var(--warning)] text-sm">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />

          <div>
            <p className="font-semibold">Filter radius belum bisa digunakan.</p>

            <p className="text-[var(--text-soft)] mt-0.5">{locationError}</p>
          </div>
        </div>
      )}

      {activeRadiusKm && userCoords && (
        <div className="flex items-start gap-3 bg-[var(--accent-soft)] border border-[var(--border-soft)] rounded-xl px-4 py-3 mb-4 text-[var(--accent)] text-sm">
          <MapPin size={16} className="shrink-0 mt-0.5" />

          <p>
            Menampilkan laporan dalam radius{' '}
            <span className="font-semibold">{formatRadiusLabel((filters as any).radius)}</span>{' '}
            dari lokasi Anda.
          </p>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 bg-[var(--danger-soft)] border border-[var(--border-soft)] rounded-xl px-4 py-3 mb-4 text-[var(--danger)] text-sm">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />

          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <SkeletonCard key={item} />
          ))}
        </div>
      )}

      {!loading && !error && filteredReports.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[var(--bg-card)] border border-[var(--border-soft)] flex items-center justify-center">
            <Filter size={20} className="text-[var(--text-muted)]" />
          </div>

          {activeCount > 0 ? (
            <>
              <p className="text-[var(--text-soft)]">
                Tidak ada laporan yang sesuai filter.
              </p>

              {activeRadiusKm && !userCoords && (
                <button
                  onClick={loadUserLocation}
                  disabled={locationLoading}
                  className="text-[var(--accent)] text-sm hover:underline transition-colors disabled:opacity-50"
                >
                  Aktifkan lokasi untuk filter radius
                </button>
              )}

              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="text-[var(--accent)] text-sm hover:underline transition-colors"
              >
                Reset filter
              </button>
            </>
          ) : (
            <>
              <p className="text-[var(--text-soft)]">Belum ada laporan yang masuk.</p>

              <button
                onClick={() => navigate('/dashboard/reports/create')}
                className="text-[var(--accent)] text-sm hover:underline transition-colors"
              >
                Buat laporan pertama
              </button>
            </>
          )}
        </div>
      )}

      {!loading && filteredReports.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredReports.map((report) => {
            const isApproved = report.status === 'approved';
            const isPending = report.status === 'pending';
            const firstImage = getFirstImage(report);
            const firstVideo = firstImage ? null : getFirstVideo(report);
            const reportCoords = getReportCoordinates(report);
            const confidence = isApproved ? 100 : Number(report.confidence_score ?? 0);
            const totalVotes = report.total_votes ?? 0;
            const confirmVotes = report.confirmation_count ?? 0;
            const denyVotes = report.denial_count ?? 0;
            const currentVote = getCurrentUserVote(report);
            const voteLocked = isReportVoteLocked(report);
            const hasVoted = hasUserVoted(report);
            const confirmLoading = voteLoading === `${report.id}-confirm`;
            const denyLoading = voteLoading === `${report.id}-deny`;

            return (
              <div
                key={report.id}
                className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-xl overflow-hidden cursor-pointer hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] transition-all"
                onClick={() => navigate(`/dashboard/reports/${report.id}`)}
              >
                <div className="p-4 lg:p-5">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-md uppercase whitespace-nowrap ${
                        severityStyle[report.severity] ??
                        'bg-[var(--bg-soft)] text-[var(--text-soft)]'
                      }`}
                    >
                      {report.severity}
                    </span>

                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-md uppercase truncate max-w-[130px] sm:max-w-none ${
                        categoryStyle[report.category] ??
                        'bg-[var(--bg-soft)] text-[var(--text-soft)] border border-[var(--border-soft)]'
                      }`}
                    >
                      {report.category}
                    </span>

                    {isApproved && (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-[#7dd878] bg-[rgba(125,216,120,0.1)] border border-[rgba(125,216,120,0.2)] px-1.5 py-0.5 rounded-full whitespace-nowrap">
                        <CheckCircle size={9} /> Terverifikasi
                      </span>
                    )}

                    {report.status === 'pending' && (
                      <span className="text-[10px] font-medium text-[#ffb786] bg-[rgba(255,183,134,0.1)] border border-[rgba(255,183,134,0.2)] px-1.5 py-0.5 rounded-full whitespace-nowrap">
                        Menunggu
                      </span>
                    )}

                    {typeof report.distance_km === 'number' && (
                      <span className="text-[10px] font-medium text-[var(--accent)] bg-[var(--accent-soft)] border border-[var(--border-soft)] px-1.5 py-0.5 rounded-full whitespace-nowrap">
                        {formatDistance(report.distance_km)}
                      </span>
                    )}
                  </div>

                  <h3 className="text-[var(--text-main)] text-base lg:text-lg font-semibold mb-2">
                    {report.title}
                  </h3>

                  <p className="text-[var(--text-soft)] text-sm line-clamp-2">
                    {report.description}
                  </p>

                  <div className="mt-3 h-24 lg:h-28 rounded-lg overflow-hidden bg-[var(--bg-soft)]">
                    {firstImage ? (
                      <img
                        src={firstImage}
                        alt={report.title}
                        className="w-full h-full object-cover"
                        onError={(event) => {
                          event.currentTarget.src = imgFloodDisaster;
                          event.currentTarget.classList.add('opacity-60');
                        }}
                      />
                    ) : firstVideo ? (
                      <video
                        src={firstVideo}
                        className="w-full h-full object-cover"
                        muted
                        preload="metadata"
                      />
                    ) : (
                      <img
                        src={imgFloodDisaster}
                        alt={report.title}
                        className="w-full h-full object-cover opacity-60"
                      />
                    )}
                  </div>

                  <div className="mt-3 rounded-lg border border-[var(--border-soft)] bg-[var(--bg-soft)] p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                          Confidence Score
                        </p>
                        <p className="text-[var(--text-main)] text-lg font-bold">
                          {formatConfidence(confidence)}
                        </p>
                      </div>

                      {isApproved ? (
                        <span className="flex items-center gap-1 rounded-full border border-[rgba(125,216,120,0.25)] bg-[rgba(125,216,120,0.1)] px-2 py-1 text-[10px] font-semibold text-[#7dd878]">
                          <CheckCircle size={11} /> Verified & Locked
                        </span>
                      ) : (
                        <span className="text-[10px] text-[var(--text-muted)]">
                          {totalVotes} vote · {confirmVotes} konfirmasi · {denyVotes} tidak
                        </span>
                      )}
                    </div>

                    <div className="mt-2 h-1.5 w-full rounded-full bg-[rgba(255,255,255,0.08)] dark:bg-[rgba(255,255,255,0.08)]">
                      <div
                        className="h-1.5 rounded-full bg-[var(--accent)] transition-all duration-300"
                        style={{ width: `${Math.min(Math.max(confidence, 0), 100)}%` }}
                      />
                    </div>

                    {isPending ? (
                      <>
                        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                          <button
                            type="button"
                            onClick={(event) => handleReportVote(event, report.id, 'confirm')}
                            disabled={voteLocked || confirmLoading || denyLoading}
                            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed ${
                              currentVote === 'confirm'
                                ? 'border-[#22c55e] bg-[rgba(34,197,94,0.18)] text-[#7dd878] opacity-80'
                                : voteLocked
                                  ? 'border-[rgba(34,197,94,0.12)] bg-[rgba(34,197,94,0.04)] text-[#7dd878] opacity-45'
                                  : 'border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.08)] text-[#7dd878] hover:bg-[rgba(34,197,94,0.14)]'
                            }`}
                          >
                            <CheckCircle size={13} />
                            {confirmLoading
                              ? 'Mengirim...'
                              : currentVote === 'confirm'
                                ? 'Sudah Konfirmasi'
                                : 'Konfirmasi'}
                          </button>

                          <button
                            type="button"
                            onClick={(event) => handleReportVote(event, report.id, 'deny')}
                            disabled={voteLocked || confirmLoading || denyLoading}
                            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed ${
                              currentVote === 'deny'
                                ? 'border-[#ef4444] bg-[rgba(239,68,68,0.18)] text-[#ffb4ab] opacity-80'
                                : voteLocked
                                  ? 'border-[rgba(239,68,68,0.12)] bg-[rgba(239,68,68,0.04)] text-[#ffb4ab] opacity-45'
                                  : 'border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.08)] text-[#ffb4ab] hover:bg-[rgba(239,68,68,0.14)]'
                            }`}
                          >
                            <X size={13} />
                            {denyLoading
                              ? 'Mengirim...'
                              : currentVote === 'deny'
                                ? 'Sudah Pilih Tidak'
                                : 'Tidak'}
                          </button>
                        </div>

                        {hasVoted && (
                          <p className="mt-2 text-[10px] text-[var(--text-muted)]">
                            Vote kamu sudah tercatat dan tidak bisa diubah.
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="mt-2 text-[10px] text-[var(--text-muted)]">
                        {isApproved
                          ? 'Laporan sudah diverifikasi admin, konfirmasi komunitas dikunci.'
                          : 'Konfirmasi komunitas dikunci karena status laporan sudah tidak pending.'}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-soft)]">
                    <div className="flex items-center gap-1.5 min-w-0 mr-2">
                      <MapPin size={11} className="text-[var(--text-muted)] shrink-0" />

                      <span className="text-[var(--text-muted)] text-xs truncate">
                        {report.location_name ??
                          (reportCoords
                            ? `${reportCoords.lat.toFixed(4)}, ${reportCoords.lng.toFixed(4)}`
                            : 'Lokasi tidak tersedia')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Clock size={11} className="text-[var(--text-muted)]" />

                      <span className="text-[var(--text-muted)] text-xs">
                        {formatTimeAgo(report.created_at)}
                      </span>
                    </div>
                  </div>

                  {typeof report.distance_km === 'number' && (
                    <p className="text-[var(--accent)] text-xs mt-2">
                      {formatDistance(report.distance_km)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <FilterSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onChange={setFilters}
      />

      <button
        onClick={() => navigate('/dashboard/reports/create')}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--text-inverse)] font-semibold text-sm rounded-full shadow-[0_4px_24px_rgba(96,165,250,0.35)] transition-colors"
      >
        <Plus size={16} />
        Report
      </button>
    </div>
  );
}