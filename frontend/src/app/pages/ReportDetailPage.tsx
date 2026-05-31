import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeft,
  Share2,
  MapPin,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  Flag,
  Image,
  Loader2,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import {
  fetchReportDetail,
  voteReport,
  type CommunityReport,
} from '../services/api';
import { supabase } from '../services/supabaseClient';
import { MapContainer, TileLayer, CircleMarker, useMap } from 'react-leaflet';
import imgFloodDamage from '../../assets/images/flood-damage.png';
import '../utils/leaflet-fix';

function MapResizer() {
  const map = useMap();

  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 150);
    return () => clearTimeout(t);
  }, [map]);

  return null;
}

const severityStyle: Record<string, { badge: string; glow: string; bg: string }> = {
  KRITIS: {
    badge: 'bg-[#93000a] text-[#ffdad6]',
    glow: 'drop-shadow-[0px_0px_7.5px_rgba(255,180,171,0.2)]',
    bg: 'bg-[#93000a]',
  },
  SEDANG: {
    badge: 'bg-[#5c3c00] text-[#ffb786]',
    glow: 'drop-shadow-[0px_0px_7.5px_rgba(255,183,134,0.2)]',
    bg: 'bg-[#5c3c00]',
  },
  RENDAH: {
    badge: 'bg-[#002105] text-[#7dd878]',
    glow: '',
    bg: 'bg-[#002105]',
  },
};

function formatDateTime(iso?: string): string {
  if (!iso) return '-';

  const d = new Date(iso);

  if (isNaN(d.getTime())) return iso;

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d);
}

function formatTimeAgo(iso?: string): string {
  if (!iso) return '-';

  const mins = Math.max(0, (Date.now() - new Date(iso).getTime()) / 60000);

  if (mins < 1) return 'baru saja';
  if (mins < 60) return `${Math.floor(mins)} menit lalu`;

  const hours = Math.floor(mins / 60);

  if (hours < 24) return `${hours} jam lalu`;

  return `${Math.floor(hours / 24)} hari lalu`;
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: 'Menunggu Verifikasi',
    approved: 'Terverifikasi',
    rejected: 'Ditolak',
    duplicate: 'Duplikat',
    need_review: 'Perlu Ditinjau',
    resolved: 'Selesai',
  };

  return map[status] ?? status;
}

function getStoredVote(reportId: string): 'confirm' | 'deny' | null {
  const actionValue = localStorage.getItem(`report_action_${reportId}`);
  const voteValue = localStorage.getItem(`report_vote_${reportId}`);

  if (voteValue === 'confirm' || voteValue === 'deny') return voteValue;
  if (actionValue === 'confirm') return 'confirm';
  if (actionValue === 'inaccurate' || actionValue === 'deny') return 'deny';

  return null;
}

function setStoredVote(reportId: string, vote: 'confirm' | 'deny') {
  localStorage.setItem(`report_vote_${reportId}`, vote);
  localStorage.setItem(`report_action_${reportId}`, vote === 'confirm' ? 'confirm' : 'inaccurate');
}

export function ReportDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [report, setReport] = useState<CommunityReport | null>(null);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [voteLoading, setVoteLoading] = useState(false);
  const [error, setError] = useState('');
  const [voteError, setVoteError] = useState('');
  const [feedbackType, setFeedbackType] = useState<'confirm' | 'inaccurate' | null>(null);
  const [hasActed, setHasActed] = useState(false);
  const [currentVote, setCurrentVote] = useState<'confirm' | 'deny' | null>(null);
  const [heroImageError, setHeroImageError] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.documentElement.classList.contains('dark'),
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id ?? '');
    };

    loadUser();
  }, []);

  useEffect(() => {
    if (!id) return;

    const storedVote = getStoredVote(id);

    setHasActed(!!storedVote);
    setCurrentVote(storedVote);
    setLoading(true);
    setError('');
    setVoteError('');

    fetchReportDetail(id)
      .then((res) => {
        const data = res.data;

        setReport({
          ...data,
          confidence_score:
            data.status === 'approved'
              ? 100
              : data.status === 'rejected'
                ? 0
                : data.confidence_score,
        });
      })
      .catch(() => setError('Laporan tidak ditemukan atau backend tidak aktif.'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!feedbackType) return;

    const timer = setTimeout(() => {
      setFeedbackType(null);
    }, 1800);

    return () => clearTimeout(timer);
  }, [feedbackType]);

  const handleVote = async (vote: 'confirm' | 'deny') => {
    if (!id || !report) return;

    const isVoteLocked = report.status !== 'pending';

    if (isVoteLocked || voteLoading) return;

    if (!userId) {
      setVoteError('User belum login. Silakan login ulang untuk memberi konfirmasi.');
      return;
    }

    setVoteLoading(true);
    setVoteError('');
    setFeedbackType(vote === 'confirm' ? 'confirm' : 'inaccurate');

    try {
      const result = await voteReport(id, userId, vote);

      if (result.data) {
        setReport({
          ...result.data,
          confidence_score:
            result.data.status === 'approved'
              ? 100
              : result.data.status === 'rejected'
                ? 0
                : result.data.confidence_score,
        });
      }

      setStoredVote(id, vote);
      setHasActed(true);
      setCurrentVote(vote);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setVoteError(message || 'Gagal menyimpan voting laporan.');
      setFeedbackType(null);
    } finally {
      setVoteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 dark:bg-[#10131a]">
        <Loader2 size={32} className="animate-spin text-blue-600 dark:text-[#adc6ff]" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-slate-50 p-6 text-center dark:bg-[#10131a]">
        <AlertTriangle size={36} className="text-red-500 dark:text-[#ffb4ab]" />

        <p className="font-semibold text-slate-950 dark:text-[#e1e2ec]">
          {error || 'Laporan tidak ditemukan.'}
        </p>

        <button
          onClick={() => navigate(-1)}
          className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:border-[rgba(173,198,255,0.2)] dark:bg-[rgba(173,198,255,0.1)] dark:text-[#adc6ff] dark:hover:bg-[rgba(173,198,255,0.15)]"
        >
          Kembali
        </button>
      </div>
    );
  }

  const style = severityStyle[report.severity] ?? severityStyle.SEDANG;
  const coords: [number, number] = [report.latitude, report.longitude];

  const mediaImages = (report.report_media ?? []).filter(
    (m) => m.media_type === 'image' || m.media_type?.startsWith('image'),
  );

  const mediaVideos = (report.report_media ?? []).filter(
    (m) => m.media_type === 'video' || m.media_type?.startsWith('video'),
  );

  const heroImage =
    !heroImageError && mediaImages[0]?.media_url
      ? mediaImages[0].media_url
      : imgFloodDamage;

  const isVerified = report.status === 'approved';
  const isRejected = report.status === 'rejected';
  const isVoteLocked = report.status !== 'pending';
  const confidenceScore = isVerified ? 100 : isRejected ? 0 : report.confidence_score ?? 0;

  const confirmButtonText = isVerified
    ? 'Laporan Terverifikasi'
    : currentVote === 'confirm'
      ? 'Sudah Dikonfirmasi'
      : isVoteLocked
        ? 'Voting Dikunci'
        : 'Konfirmasi Laporan';

  const denyButtonText = isVerified
    ? 'Tidak Dapat Dilaporkan'
    : currentVote === 'deny'
      ? 'Sudah Dilaporkan Tidak Akurat'
      : isVoteLocked
        ? 'Voting Dikunci'
        : 'Laporkan sebagai Tidak Akurat';

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-950 dark:bg-[#10131a] dark:text-[#e1e2ec]">
      <div className="relative mx-auto w-full max-w-[1440px] pb-8">
        {/* Hero Section */}
        <div
          className="relative overflow-hidden"
          style={{ height: 'clamp(260px, 40vw, 420px)' }}
        >
          <img
            src={heroImage}
            alt={report.title}
            className="absolute inset-0 h-full w-full object-cover"
            onError={() => setHeroImageError(true)}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/5" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />

          <div className="absolute bottom-4 left-4 flex max-w-[calc(100%-4rem)] flex-col gap-2 lg:bottom-6 lg:left-8 lg:gap-3">
            <div
              className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 ${style.bg} ${style.glow} border border-white/20 shadow-lg`}
            >
              <AlertTriangle size={11} className="text-white" />

              <span className="text-xs font-semibold uppercase tracking-widest text-white">
                {report.severity}
              </span>
            </div>

            <div className="w-fit max-w-3xl rounded-2xl bg-black/65 px-4 py-3 shadow-2xl backdrop-blur-[2px]">
              <h1
  className="max-w-3xl text-2xl font-black leading-tight sm:text-3xl lg:text-4xl"
  style={{
    color: '#eaf1ff',
    textShadow:
      '0 2px 4px rgba(0,0,0,0.95), 0 6px 18px rgba(0,0,0,0.85)',
  }}
>
  {report.title}
</h1>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="mt-4 flex flex-col gap-4 px-4 lg:mt-6 lg:grid lg:grid-cols-12 lg:gap-6 lg:px-8">
          {/* Main Column */}
          <div className="flex flex-col gap-4 lg:col-span-8 lg:gap-6">
            {/* Status Banner */}
            <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:items-center dark:border-[rgba(255,255,255,0.08)] dark:bg-[#1d2027]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 lg:h-12 lg:w-12 dark:bg-[rgba(173,198,255,0.16)] dark:text-[#adc6ff]">
                {isVerified ? (
                  <ShieldCheck size={22} />
                ) : isVoteLocked ? (
                  <Lock size={20} />
                ) : (
                  <svg width="14" height="18" viewBox="0 0 16 20" fill="none">
                    <path
                      d="M8 0L0 4v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V4L8 0z"
                      fill="currentColor"
                    />
                  </svg>
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-blue-700 dark:text-[#adc6ff]">
                  {statusLabel(report.status)}
                </p>

                <p className="mt-0.5 text-sm leading-relaxed text-slate-600 dark:text-[#c2c6d6]">
                  {isVerified
                    ? 'Laporan telah diverifikasi oleh tim admin. Confidence score dikunci pada 100%.'
                    : isRejected
                      ? 'Laporan ini telah ditolak oleh admin. Voting komunitas dikunci.'
                      : report.status === 'pending'
                        ? 'Laporan masih menunggu verifikasi. Komunitas dapat memberi konfirmasi atau menandai tidak akurat.'
                        : 'Laporan sedang dalam proses peninjauan. Voting komunitas dikunci.'}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:p-6 dark:border-[rgba(255,255,255,0.08)] dark:bg-[#1d2027]">
              <h2 className="mb-3 text-lg font-semibold text-slate-950 lg:text-2xl dark:text-[#e1e2ec]">
                Situation Overview
              </h2>

              <p className="text-sm leading-relaxed text-slate-700 lg:text-base dark:text-[#c2c6d6]">
                {report.description}
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
              {[
                {
                  label: 'Waktu Dilaporkan',
                  icon: <Clock size={13} className="text-blue-600 dark:text-[#adc6ff]" />,
                  value: formatDateTime(report.created_at),
                  sub: formatTimeAgo(report.created_at),
                },
                {
                  label: 'Reporter',
                  icon: <User size={12} className="text-blue-600 dark:text-[#adc6ff]" />,
                  value: report.reporter_name ?? 'Anonymous',
                },
                {
                  label: 'Kategori',
                  icon: <AlertTriangle size={13} className="text-orange-500 dark:text-[#ffb786]" />,
                  value: report.category,
                },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm dark:border-[rgba(255,255,255,0.08)] dark:bg-[#1d2027]"
                >
                  <p className="mb-2 text-[9px] font-semibold uppercase tracking-widest text-slate-500 lg:text-xs dark:text-[#8c909f]">
                    {m.label}
                  </p>

                  <div className="flex items-center gap-1.5">
                    {m.icon}
                    <span className="truncate text-sm text-slate-950 lg:text-base dark:text-[#e1e2ec]">
                      {m.value}
                    </span>
                  </div>

                  {'sub' in m && m.sub && (
                    <p className="mt-1 text-xs text-slate-500 dark:text-[#8c909f]">{m.sub}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Media Gallery */}
            {(mediaImages.length > 0 || mediaVideos.length > 0) && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:p-6 dark:border-[rgba(255,255,255,0.08)] dark:bg-[#1d2027]">
                <div className="mb-4 flex items-center gap-2">
                  <Image size={15} className="text-blue-600 dark:text-[#adc6ff]" />

                  <h2 className="text-base font-semibold text-slate-950 dark:text-[#e1e2ec]">
                    Bukti Foto/Video ({(report.report_media ?? []).length})
                  </h2>
                </div>

                {mediaImages.length > 0 && (
                  <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {mediaImages.map((media, i) => (
                      <a
                        key={media.id}
                        href={media.media_url}
                        target="_blank"
                        rel="noreferrer"
                        className="block aspect-video overflow-hidden rounded-lg border border-slate-200 bg-slate-100 transition-colors hover:border-blue-300 dark:border-[rgba(255,255,255,0.08)] dark:bg-[#10131a] dark:hover:border-[rgba(173,198,255,0.35)]"
                      >
                        <img
                          src={media.media_url}
                          alt={`Bukti ${i + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </a>
                    ))}
                  </div>
                )}

                {mediaVideos.map((media) => (
                  <video
                    key={media.id}
                    src={media.media_url}
                    controls
                    className="mt-2 w-full rounded-lg bg-slate-100 dark:bg-[#10131a]"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="flex flex-col gap-4 lg:col-span-4 lg:gap-6">
            {/* Map */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-[rgba(255,255,255,0.08)] dark:bg-[#1d2027]">
              <div style={{ height: '180px', position: 'relative' }}>
                <MapContainer
                  center={coords}
                  zoom={14}
                  zoomControl={false}
                  scrollWheelZoom={false}
                  dragging={false}
                  doubleClickZoom={false}
                  style={{
                    height: '100%',
                    width: '100%',
                    background: isDarkMode ? '#10131a' : '#f8fafc',
                  }}
                >
                  <MapResizer />

                  <TileLayer
                    key={isDarkMode ? 'dark-map' : 'light-map'}
                    url={
                      isDarkMode
                        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
                    }
                    attribution="&copy; CARTO"
                  />

                  <CircleMarker
                    center={coords}
                    radius={12}
                    pathOptions={{
                      color: isDarkMode ? '#ffb4ab' : '#dc2626',
                      fillColor: isDarkMode ? '#ffb4ab' : '#ef4444',
                      fillOpacity: 0.65,
                      weight: 3,
                    }}
                  />
                </MapContainer>
              </div>

              <div className="border-t border-slate-200 px-4 py-3 dark:border-[rgba(255,255,255,0.08)]">
                <div className="mb-1 flex items-center gap-2">
                  <MapPin size={14} className="shrink-0 text-blue-600 dark:text-[#adc6ff]" />

                  <span className="truncate text-sm text-slate-950 dark:text-[#e1e2ec]">
                    {report.location_name ?? 'Lokasi tidak diberi nama'}
                  </span>
                </div>

                <p className="pl-5 font-mono text-xs text-slate-500 dark:text-[#8c909f]">
                  {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
                </p>
              </div>
            </div>

            {/* Action Panel */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:p-6 dark:border-[rgba(255,255,255,0.08)] dark:bg-[#1d2027]">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-[#8c909f]">
                Tindakan Lapangan
              </p>

              <div className="mb-3 flex items-center gap-2 px-1">
                <CheckCircle size={13} className="shrink-0 text-blue-600 dark:text-[#adc6ff]" />

                <span className="text-xs text-slate-500 dark:text-[#8c909f]">
                  Confidence score:{' '}
                  <span className="font-semibold text-blue-700 dark:text-[#adc6ff]">
                    {confidenceScore}%
                  </span>
                </span>
              </div>

              <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-[rgba(255,255,255,0.08)]">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    confidenceScore >= 80
                      ? 'bg-emerald-500'
                      : confidenceScore >= 50
                        ? 'bg-orange-400'
                        : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.max(0, Math.min(100, confidenceScore))}%` }}
                />
              </div>

              {isVerified && (
                <div
                  className="mb-4 rounded-xl px-4 py-3 shadow-sm dark:border dark:border-emerald-400/30 dark:bg-emerald-500/10"
                  style={{
                    backgroundColor: '#ecfdf5',
                    border: '1px solid #6ee7b7',
                  }}
                >
                  <p
                    className="text-sm font-bold leading-relaxed dark:text-emerald-300"
                    style={{ color: '#047857' }}
                  >
                    Verified & Locked
                  </p>

                  <p
                    className="mt-1 text-sm font-semibold leading-relaxed dark:text-emerald-100/90"
                    style={{ color: '#065f46' }}
                  >
                    Laporan sudah diverifikasi admin, voting komunitas ditutup.
                  </p>
                </div>
              )}

              {!isVerified && isVoteLocked && (
                <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-[rgba(255,255,255,0.08)] dark:bg-[rgba(255,255,255,0.04)]">
                  <p className="text-xs font-semibold text-slate-700 dark:text-[#c2c6d6]">
                    Voting Dikunci
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500 dark:text-[#8c909f]">
                    Voting hanya tersedia ketika status laporan masih menunggu.
                  </p>
                </div>
              )}

              {hasActed && !isVoteLocked && (
                <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 dark:border-[rgba(173,198,255,0.16)] dark:bg-[rgba(173,198,255,0.06)]">
                  <p className="text-xs font-semibold text-blue-700 dark:text-[#adc6ff]">
                    Vote kamu sudah tercatat
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500 dark:text-[#8c909f]">
                    Pilihan kamu:{' '}
                    {currentVote === 'confirm'
                      ? 'Konfirmasi laporan'
                      : 'Laporan tidak akurat'}
                  </p>
                </div>
              )}

              {voteError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 dark:border-red-400/25 dark:bg-red-500/10">
                  <p className="text-xs leading-relaxed text-red-700 dark:text-red-200">
                    {voteError}
                  </p>
                </div>
              )}

              <button
                onClick={() => handleVote('confirm')}
                disabled={isVoteLocked || hasActed || voteLoading}
                className={`mb-3 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition-colors ${
                  isVoteLocked || hasActed || voteLoading
                    ? 'cursor-not-allowed bg-blue-100 text-blue-700 opacity-70 dark:bg-[rgba(173,198,255,0.22)] dark:text-[#adc6ff]'
                    : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-[#adc6ff] dark:text-[#002e6a] dark:hover:bg-[#c7d9ff]'
                }`}
              >
                {voteLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : isVerified ? (
                  <ShieldCheck size={14} />
                ) : (
                  <CheckCircle size={14} />
                )}

                {confirmButtonText}
              </button>

              <button
                onClick={() => handleVote('deny')}
                disabled={isVoteLocked || hasActed || voteLoading}
                className={`flex w-full items-center justify-center gap-2 rounded-lg border py-3 text-sm font-medium transition-colors ${
                  isVoteLocked || hasActed || voteLoading
                    ? 'cursor-not-allowed border-slate-200 text-slate-400 opacity-70 dark:border-[rgba(255,255,255,0.06)] dark:text-[#8c909f]'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-[#424754] dark:text-[#e1e2ec] dark:hover:bg-[rgba(255,255,255,0.05)]'
                }`}
              >
                {voteLoading ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : isVoteLocked ? (
                  <Lock size={13} />
                ) : (
                  <Flag size={13} />
                )}

                {denyButtonText}
              </button>
            </div>
          </div>
        </div>

        {/* Floating top bar */}
        <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-4 py-4 lg:px-8 lg:py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/90 text-slate-900 shadow-lg backdrop-blur-sm transition-colors hover:bg-white lg:h-10 lg:w-10 dark:border-white/15 dark:bg-[rgba(29,32,39,0.75)] dark:text-[#e1e2ec] dark:hover:bg-[rgba(173,198,255,0.15)]"
            aria-label="Kembali"
          >
            <ArrowLeft size={15} />
          </button>

          <button
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/90 text-slate-900 shadow-lg backdrop-blur-sm transition-colors hover:bg-white lg:h-10 lg:w-10 dark:border-white/15 dark:bg-[rgba(29,32,39,0.75)] dark:text-[#e1e2ec] dark:hover:bg-[rgba(255,255,255,0.1)]"
            aria-label="Share"
          >
            <Share2 size={14} />
          </button>
        </div>
      </div>

      {/* Feedback Popup */}
      {feedbackType && (
        <div
          className="fixed inset-0 z-[3000] flex items-center justify-center p-4"
          style={{
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(6px)',
          }}
        >
          <div className="flex w-full max-w-xs flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white px-8 py-8 text-center shadow-2xl dark:border-[rgba(255,255,255,0.1)] dark:bg-[#1d2027]">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full ${
                feedbackType === 'confirm'
                  ? 'bg-blue-50 dark:bg-[rgba(173,198,255,0.15)]'
                  : 'bg-slate-100 dark:bg-[rgba(255,255,255,0.06)]'
              }`}
            >
              {feedbackType === 'confirm' ? (
                <CheckCircle size={32} className="text-blue-600 dark:text-[#adc6ff]" />
              ) : (
                <Flag size={28} className="text-slate-500 dark:text-[#94a3b8]" />
              )}
            </div>

            <div>
              <p className="text-base font-semibold text-slate-950 dark:text-[#e1e2ec]">
                Terima kasih atas feedbacknya!
              </p>

              <p className="mt-1.5 text-sm text-slate-500 dark:text-[#8c909f]">
                {feedbackType === 'confirm'
                  ? 'Konfirmasi kamu telah berhasil dicatat.'
                  : 'Laporan ketidakakuratan kamu telah diterima.'}
              </p>
            </div>

            <div className="h-1 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-[rgba(255,255,255,0.08)]">
              <div
                className="h-full rounded-full"
                style={{
                  background: feedbackType === 'confirm' ? '#2563eb' : '#64748b',
                  animation: 'shrink-bar 1.8s linear forwards',
                }}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shrink-bar {
          from {
            width: 100%;
          }

          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
