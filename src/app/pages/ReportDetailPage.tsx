import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Share2, MoreVertical, MapPin, Clock, User, AlertTriangle, CheckCircle, Flag } from 'lucide-react';
import { reports } from '../data/reports';
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

export function ReportDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const report = reports.find((r) => r.id === id) || reports[0];
  const style = severityStyle[report.severity] || severityStyle.SEDANG;

  // ── Tindakan Lapangan state ──────────────────────────────
  const [localConfirmations, setLocalConfirmations] = useState(report.confirmations);
  const [feedbackType, setFeedbackType] = useState<'confirm' | 'inaccurate' | null>(null);
  const [hasActed, setHasActed] = useState(false);

  const handleKonfirmasi = () => {
    if (hasActed) return;
    setLocalConfirmations((n) => n + 1);
    setFeedbackType('confirm');
    setHasActed(true);
  };

  const handleTidakAkurat = () => {
    if (hasActed) return;
    setFeedbackType('inaccurate');
    setHasActed(true);
  };

  // Auto-navigate back after 2.5 s when feedback is shown
  useEffect(() => {
    if (!feedbackType) return;
    const timer = setTimeout(() => navigate(-1), 2500);
    return () => clearTimeout(timer);
  }, [feedbackType, navigate]);
  // ────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen w-full bg-[#10131a] text-[#e1e2ec]">
      <div className="relative w-full max-w-[1440px] mx-auto pb-8">

        {/* Hero Section */}
        <div className="relative overflow-hidden" style={{ height: 'clamp(260px, 40vw, 420px)' }}>
          <img
            src={imgFloodDamage}
            alt={report.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#10131a] via-[rgba(16,19,26,0.6)] to-[rgba(16,19,26,0.1)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(16,19,26,0.7)] via-transparent to-transparent" />

          {/* Badges at bottom */}
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
            {/* Confidence Banner */}
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
                <p className="text-[#adc6ff] text-sm font-medium">High Confidence Report</p>
                <p className="text-[#c2c6d6] text-sm mt-0.5">
                  Diverifikasi oleh {report.confirmations} anggota komunitas dan dikuatkan oleh data sensor lokal.
                </p>
              </div>
            </div>

            {/* Description Card */}
            <div
              className="rounded-xl border border-[rgba(255,255,255,0.1)] p-4 lg:p-6"
              style={{ background: 'rgba(29,32,39,0.8)' }}
            >
              <h2 className="text-[#e1e2ec] text-lg lg:text-2xl font-semibold mb-3">Situation Overview</h2>
              <p className="text-[#c2c6d6] text-sm lg:text-base leading-relaxed">{report.description}</p>
            </div>

            {/* Metadata Grid — 2x2 on mobile, 4 cols on lg */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  label: 'Waktu Dilaporkan',
                  icon: <Clock size={13} className="text-[#adc6ff]" />,
                  value: report.time,
                },
                {
                  label: 'Reporter',
                  icon: <User size={12} className="text-[#adc6ff]" />,
                  value: report.reporter,
                },
                {
                  label: 'Radius Terpengaruh',
                  icon: <MapPin size={13} className="text-[#ffb786]" />,
                  value: report.radius,
                },
                {
                  label: 'Tingkat Keparahan',
                  icon: (
                    <svg width="12" height="8" viewBox="0 0 15 9" fill="none">
                      <path d="M7.5 0L15 9H0L7.5 0Z" fill="#FFB4AB" />
                    </svg>
                  ),
                  value: report.trend,
                  valueColor: 'text-[#ffb4ab]',
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
                    <span className={`text-sm lg:text-base ${m.valueColor ?? 'text-[#e1e2ec]'}`}>
                      {m.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 flex flex-col gap-4 lg:gap-6">
            {/* Map Snippet */}
            <div
              className="rounded-xl border border-[rgba(255,255,255,0.1)] overflow-hidden"
              style={{ background: 'rgba(29,32,39,0.8)' }}
            >
              <div style={{ height: '180px', position: 'relative' }}>
                <MapContainer
                  center={report.coordinates}
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
                    center={report.coordinates}
                    radius={12}
                    pathOptions={{
                      color: '#ffb4ab',
                      fillColor: '#ffb4ab',
                      fillOpacity: 0.7,
                      weight: 3,
                    }}
                  />
                </MapContainer>
              </div>
              <div className="px-4 py-3 border-t border-[rgba(255,255,255,0.1)] flex items-center gap-3">
                <MapPin size={14} className="text-[#adc6ff] shrink-0" />
                <span className="text-[#e1e2ec] text-sm truncate">{report.location}</span>
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

              {/* Confirmation count */}
              <div className="flex items-center gap-2 mb-3 px-1">
                <CheckCircle size={13} className="text-[#adc6ff] shrink-0" />
                <span className="text-[#8c909f] text-xs">
                  <span className="text-[#adc6ff] font-semibold">{localConfirmations}</span> anggota komunitas telah mengkonfirmasi
                </span>
              </div>

              <button
                onClick={handleKonfirmasi}
                disabled={hasActed}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-colors mb-3 shadow-[0px_0px_7.5px_rgba(173,198,255,0.2)] ${
                  hasActed
                    ? 'bg-[rgba(173,198,255,0.3)] text-[#adc6ff] cursor-not-allowed'
                    : 'bg-[#adc6ff] hover:bg-[#c7d9ff] text-[#002e6a]'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 0L9.5 6h6L10.5 9.5l2 6L8 12l-4.5 3.5 2-6L0.5 6h6z" fill="currentColor" />
                </svg>
                Konfirmasi Laporan
              </button>
              <button
                onClick={handleTidakAkurat}
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

            {/* Tags */}
            <div
              className="rounded-xl border border-[rgba(255,255,255,0.1)] p-4"
              style={{ background: 'rgba(29,32,39,0.8)' }}
            >
              <p className="text-[#8c909f] text-xs uppercase tracking-widest font-semibold mb-3">Tags</p>
              <div className="flex flex-wrap gap-2">
                {report.tags.map((tag) => (
                  <span key={tag} className="text-xs text-[#60a5fa] bg-[rgba(96,165,250,0.1)] px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Back Navigation & Actions — floating top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 lg:px-8 py-4 lg:py-6 z-10">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 lg:w-10 lg:h-10 flex items-center justify-center backdrop-blur-sm bg-[rgba(29,32,39,0.7)] border border-[rgba(255,255,255,0.15)] rounded-full text-[#e1e2ec] hover:bg-[rgba(173,198,255,0.15)] transition-colors shadow-lg"
          >
            <ArrowLeft size={15} />
          </button>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 lg:w-10 lg:h-10 flex items-center justify-center backdrop-blur-sm bg-[rgba(29,32,39,0.7)] border border-[rgba(255,255,255,0.15)] rounded-full text-[#e1e2ec] hover:bg-[rgba(255,255,255,0.1)] transition-colors">
              <Share2 size={14} />
            </button>
            <button className="w-9 h-9 lg:w-10 lg:h-10 flex items-center justify-center backdrop-blur-sm bg-[rgba(29,32,39,0.7)] border border-[rgba(255,255,255,0.15)] rounded-full text-[#e1e2ec] hover:bg-[rgba(255,255,255,0.1)] transition-colors">
              <MoreVertical size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Thank-you Feedback Popup ─────────────────────── */}
      {feedbackType && (
        <div
          className="fixed inset-0 z-[3000] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
        >
          <div
            className="flex flex-col items-center gap-4 px-8 py-8 rounded-2xl border shadow-2xl text-center max-w-xs w-full"
            style={{ background: 'rgba(29,32,39,0.97)', borderColor: feedbackType === 'confirm' ? 'rgba(173,198,255,0.25)' : 'rgba(255,255,255,0.1)' }}
          >
            {/* Icon */}
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                feedbackType === 'confirm' ? 'bg-[rgba(173,198,255,0.15)]' : 'bg-[rgba(255,255,255,0.06)]'
              }`}
            >
              {feedbackType === 'confirm' ? (
                <CheckCircle size={32} className="text-[#adc6ff]" />
              ) : (
                <Flag size={28} className="text-[#94a3b8]" />
              )}
            </div>

            {/* Text */}
            <div>
              <p className="text-[#e1e2ec] font-semibold text-base">
                Terima kasih atas feedbacknya!
              </p>
              <p className="text-[#8c909f] text-sm mt-1.5">
                {feedbackType === 'confirm'
                  ? 'Konfirmasi kamu telah berhasil dicatat.'
                  : 'Laporan ketidakakuratan kamu telah diterima.'}
              </p>
            </div>

            {/* Auto-close progress bar */}
            <div className="w-full h-1 rounded-full bg-[rgba(255,255,255,0.08)] overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  background: feedbackType === 'confirm' ? '#adc6ff' : '#64748b',
                  animation: 'shrink-bar 2.5s linear forwards',
                }}
              />
            </div>
            <p className="text-[#8c909f] text-xs -mt-2">Kembali ke halaman sebelumnya...</p>
          </div>
        </div>
      )}

      {/* shrink-bar keyframe */}
      <style>{`
        @keyframes shrink-bar {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
}