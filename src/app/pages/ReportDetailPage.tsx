import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Share2, MapPin, Clock, User, AlertTriangle, CheckCircle, Flag, Image, Loader2 } from 'lucide-react';
import { fetchReportDetail, updateReportStatus, confirmReport, type CommunityReport } from '../services/api';
import { MapContainer, TileLayer, CircleMarker, useMap } from 'react-leaflet';
import imgFloodDamage from '../../imports/ReportDetailProfessionalDarkTheme-1-1/e63331a1de007fe4f014f49a2054fad1ec65d562.png';
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

export function ReportDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [report, setReport] = useState<CommunityReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedbackType, setFeedbackType] = useState<'confirm' | 'inaccurate' | null>(null);
  const [hasActed, setHasActed] = useState(() => {
    if (!id) return false;
    return !!localStorage.getItem(`report_action_${id}`);
  });
  const [heroImageError, setHeroImageError] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError('');
    fetchReportDetail(id)
      .then((res) => setReport(res.data))
      .catch(() => setError('Laporan tidak ditemukan atau backend tidak aktif.'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!feedbackType) return;
    const timer = setTimeout(() => navigate(-1), 2500);
    return () => clearTimeout(timer);
  }, [feedbackType, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#10131a] flex items-center justify-center">
        <Loader2 size={32} className="text-[#adc6ff] animate-spin" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen w-full bg-[#10131a] flex flex-col items-center justify-center gap-4 p-6 text-center">
        <AlertTriangle size={36} className="text-[#ffb4ab]" />
        <p className="text-[#e1e2ec] font-semibold">{error || 'Laporan tidak ditemukan.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-lg bg-[rgba(173,198,255,0.1)] border border-[rgba(173,198,255,0.2)] text-[#adc6ff] text-sm hover:bg-[rgba(173,198,255,0.15)] transition-colors"
        >
          Kembali
        </button>
      </div>
    );
  }

  const style = severityStyle[report.severity] ?? severityStyle.SEDANG;
  const coords: [number, number] = [report.latitude, report.longitude];
  const mediaImages = (report.report_media ?? []).filter(
    (m) => m.media_type === 'image' || m.media_type?.startsWith('image')
  );
  const mediaVideos = (report.report_media ?? []).filter(
    (m) => m.media_type === 'video' || m.media_type?.startsWith('video')
  );
  const heroImage = !heroImageError && mediaImages[0]?.media_url
    ? mediaImages[0].media_url
    : imgFloodDamage;

  return (
    <div className="min-h-screen w-full bg-[#10131a] text-[#e1e2ec]">
      <div className="relative w-full max-w-[1440px] mx-auto pb-8">

        {/* Hero Section */}
        <div className="relative overflow-hidden" style={{ height: 'clamp(260px, 40vw, 420px)' }}>
          <img
            src={heroImage}
            alt={report.title}
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setHeroImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10131a] via-[rgba(16,19,26,0.6)] to-[rgba(16,19,26,0.1)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(16,19,26,0.7)] via-transparent to-transparent" />

          <div className="absolute bottom-4 lg:bottom-6 left-4 lg:left-8 flex flex-col gap-2 lg:gap-3 max-w-[calc(100%-4rem)]">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${style.bg} ${style.glow} border border-[rgba(255,180,171,0.3)] w-fit`}>
              <AlertTriangle size={11} className="text-[#ffdad6]" />
              <span className="text-[#ffdad6] text-xs font-semibold tracking-widest uppercase">
                {report.severity}
              </span>
            </div>
            <h1 className="text-white text-xl sm:text-2xl lg:text-4xl font-semibold leading-tight">
              {report.title}
            </h1>
          </div>
        </div>

        {/* Content Grid */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-6 px-4 lg:px-8 mt-4 lg:mt-6">

          {/* Main Column */}
          <div className="lg:col-span-8 flex flex-col gap-4 lg:gap-6">

            {/* Status Banner */}
            <div
              className="rounded-xl border border-[rgba(255,255,255,0.1)] p-4 flex items-start lg:items-center gap-4"
              style={{ background: 'rgba(29,32,39,0.8)' }}
            >
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[rgba(173,198,255,0.2)] flex items-center justify-center shrink-0">
                <svg width="14" height="18" viewBox="0 0 16 20" fill="none">
                  <path d="M8 0L0 4v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V4L8 0z" fill="#ADC6FF" />
                </svg>
              </div>
              <div>
                <p className="text-[#adc6ff] text-sm font-medium">{statusLabel(report.status)}</p>
                <p className="text-[#c2c6d6] text-sm mt-0.5">
                  {report.status === 'approved'
                    ? 'Laporan telah diverifikasi oleh tim admin dan dikonfirmasi valid.'
                    : 'Laporan sedang dalam proses verifikasi oleh tim admin.'}
                </p>
              </div>
            </div>

            {/* Description */}
            <div
              className="rounded-xl border border-[rgba(255,255,255,0.1)] p-4 lg:p-6"
              style={{ background: 'rgba(29,32,39,0.8)' }}
            >
              <h2 className="text-[#e1e2ec] text-lg lg:text-2xl font-semibold mb-3">Situation Overview</h2>
              <p className="text-[#c2c6d6] text-sm lg:text-base leading-relaxed">{report.description}</p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                {
                  label: 'Waktu Dilaporkan',
                  icon: <Clock size={13} className="text-[#adc6ff]" />,
                  value: formatDateTime(report.created_at),
                  sub: formatTimeAgo(report.created_at),
                },
                {
                  label: 'Reporter',
                  icon: <User size={12} className="text-[#adc6ff]" />,
                  value: report.reporter_name ?? 'Anonymous',
                },
                {
                  label: 'Kategori',
                  icon: <AlertTriangle size={13} className="text-[#ffb786]" />,
                  value: report.category,
                },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl border border-[rgba(255,255,255,0.1)] px-3 py-3"
                  style={{ background: 'rgba(29,32,39,0.8)' }}
                >
                  <p className="text-[#8c909f] text-[9px] lg:text-xs uppercase tracking-widest font-semibold mb-2">
                    {m.label}
                  </p>
                  <div className="flex items-center gap-1.5">
                    {m.icon}
                    <span className="text-sm lg:text-base text-[#e1e2ec] truncate">{m.value}</span>
                  </div>
                  {'sub' in m && m.sub && (
                    <p className="text-[#8c909f] text-xs mt-1">{m.sub}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Media Gallery */}
            {(mediaImages.length > 0 || mediaVideos.length > 0) && (
              <div
                className="rounded-xl border border-[rgba(255,255,255,0.1)] p-4 lg:p-6"
                style={{ background: 'rgba(29,32,39,0.8)' }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Image size={15} className="text-[#adc6ff]" />
                  <h2 className="text-[#e1e2ec] text-base font-semibold">
                    Bukti Foto/Video ({(report.report_media ?? []).length})
                  </h2>
                </div>
                {mediaImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                    {mediaImages.map((media, i) => (
                      <a
                        key={media.id}
                        href={media.media_url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg overflow-hidden aspect-video bg-[#10131a] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(173,198,255,0.35)] transition-colors block"
                      >
                        <img
                          src={media.media_url}
                          alt={`Bukti ${i + 1}`}
                          className="w-full h-full object-cover"
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
                    className="w-full rounded-lg mt-2 bg-[#10131a]"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 flex flex-col gap-4 lg:gap-6">

            {/* Map */}
            <div
              className="rounded-xl border border-[rgba(255,255,255,0.1)] overflow-hidden"
              style={{ background: 'rgba(29,32,39,0.8)' }}
            >
              <div style={{ height: '180px', position: 'relative' }}>
                <MapContainer
                  center={coords}
                  zoom={14}
                  zoomControl={false}
                  scrollWheelZoom={false}
                  dragging={false}
                  doubleClickZoom={false}
                  style={{ height: '100%', width: '100%', background: '#10131a' }}
                >
                  <MapResizer />
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; CARTO'
                  />
                  <CircleMarker
                    center={coords}
                    radius={12}
                    pathOptions={{ color: '#ffb4ab', fillColor: '#ffb4ab', fillOpacity: 0.7, weight: 3 }}
                  />
                </MapContainer>
              </div>
              <div className="px-4 py-3 border-t border-[rgba(255,255,255,0.1)]">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={14} className="text-[#adc6ff] shrink-0" />
                  <span className="text-[#e1e2ec] text-sm truncate">
                    {report.location_name ?? 'Lokasi tidak diberi nama'}
                  </span>
                </div>
                <p className="text-[#8c909f] text-xs font-mono pl-5">
                  {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
                </p>
              </div>
            </div>

            {/* Action Panel */}
            <div
              className="rounded-xl border border-[rgba(255,255,255,0.1)] p-4 lg:p-6"
              style={{ background: 'rgba(29,32,39,0.8)' }}
            >
              <p className="text-[#8c909f] text-xs uppercase tracking-widest font-semibold mb-4">
                Tindakan Lapangan
              </p>

              {report.confidence_score != null && (
                <div className="flex items-center gap-2 mb-3 px-1">
                  <CheckCircle size={13} className="text-[#adc6ff] shrink-0" />
                  <span className="text-[#8c909f] text-xs">
                    Confidence score:{' '}
                    <span className="text-[#adc6ff] font-semibold">{report.confidence_score}%</span>
                  </span>
                </div>
              )}

              <button
                onClick={async () => {
                  if (hasActed || !id) return;
                  setFeedbackType('confirm');
                  setHasActed(true);
                  localStorage.setItem(`report_action_${id}`, 'confirm');
                  try {
                    const res = await confirmReport(id);
                    if (res.data) setReport((prev) => prev ? { ...prev, confidence_score: res.data.confidence_score } : prev);
                  } catch { /* non-blocking */ }
                }}
                disabled={hasActed}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-colors mb-3 shadow-[0px_0px_7.5px_rgba(173,198,255,0.2)] ${
                  hasActed
                    ? 'bg-[rgba(173,198,255,0.3)] text-[#adc6ff] cursor-not-allowed'
                    : 'bg-[#adc6ff] hover:bg-[#c7d9ff] text-[#002e6a]'
                }`}
              >
                <CheckCircle size={14} />
                Konfirmasi Laporan
              </button>
              <button
                onClick={async () => {
                  if (hasActed || !id) return;
                  setFeedbackType('inaccurate');
                  setHasActed(true);
                  localStorage.setItem(`report_action_${id}`, 'inaccurate');
                  try { await updateReportStatus(id, 'need_review'); } catch { /* non-blocking */ }
                }}
                disabled={hasActed}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg border text-sm font-medium transition-colors ${
                  hasActed
                    ? 'border-[rgba(255,255,255,0.06)] text-[#8c909f] cursor-not-allowed'
                    : 'border-[#424754] text-[#e1e2ec] hover:bg-[rgba(255,255,255,0.05)]'
                }`}
              >
                <Flag size={13} />
                Laporkan sebagai Tidak Akurat
              </button>
            </div>

          </div>
        </div>

        {/* Floating top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 lg:px-8 py-4 lg:py-6 z-10">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 lg:w-10 lg:h-10 flex items-center justify-center backdrop-blur-sm bg-[rgba(29,32,39,0.7)] border border-[rgba(255,255,255,0.15)] rounded-full text-[#e1e2ec] hover:bg-[rgba(173,198,255,0.15)] transition-colors shadow-lg"
          >
            <ArrowLeft size={15} />
          </button>
          <button className="w-9 h-9 lg:w-10 lg:h-10 flex items-center justify-center backdrop-blur-sm bg-[rgba(29,32,39,0.7)] border border-[rgba(255,255,255,0.15)] rounded-full text-[#e1e2ec] hover:bg-[rgba(255,255,255,0.1)] transition-colors">
            <Share2 size={14} />
          </button>
        </div>
      </div>

      {/* Feedback Popup */}
      {feedbackType && (
        <div
          className="fixed inset-0 z-[3000] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
        >
          <div
            className="flex flex-col items-center gap-4 px-8 py-8 rounded-2xl border shadow-2xl text-center max-w-xs w-full"
            style={{ background: 'rgba(29,32,39,0.97)', borderColor: feedbackType === 'confirm' ? 'rgba(173,198,255,0.25)' : 'rgba(255,255,255,0.1)' }}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${feedbackType === 'confirm' ? 'bg-[rgba(173,198,255,0.15)]' : 'bg-[rgba(255,255,255,0.06)]'}`}>
              {feedbackType === 'confirm'
                ? <CheckCircle size={32} className="text-[#adc6ff]" />
                : <Flag size={28} className="text-[#94a3b8]" />}
            </div>
            <div>
              <p className="text-[#e1e2ec] font-semibold text-base">Terima kasih atas feedbacknya!</p>
              <p className="text-[#8c909f] text-sm mt-1.5">
                {feedbackType === 'confirm'
                  ? 'Konfirmasi kamu telah berhasil dicatat.'
                  : 'Laporan ketidakakuratan kamu telah diterima.'}
              </p>
            </div>
            <div className="w-full h-1 rounded-full bg-[rgba(255,255,255,0.08)] overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ background: feedbackType === 'confirm' ? '#adc6ff' : '#64748b', animation: 'shrink-bar 2.5s linear forwards' }}
              />
            </div>
            <p className="text-[#8c909f] text-xs -mt-2">Kembali ke halaman sebelumnya...</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shrink-bar { from { width: 100%; } to { width: 0%; } }
      `}</style>
    </div>
  );
}
