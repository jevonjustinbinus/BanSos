import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Image,
  MapPin,
  MessageSquare,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import { MapContainer, CircleMarker } from 'react-leaflet';
import { ThemedTileLayer } from '../components/ThemedTileLayer';
import { useTheme } from '../context/ThemeContext';
import { CommunityReport, fetchReports, updateReportStatus } from '../services/api';

const rejectReasons = [
  'Foto tidak jelas',
  'Lokasi tidak sesuai',
  'Laporan duplikat/sama',
  'Informasi tidak cukup',
  'Terindikasi laporan palsu',
  'Lainnya',
];

const sevColor: Record<string, string> = {
  KRITIS: 'bg-[#93000a] text-[#ffdad6]',
  SEDANG: 'bg-[#5c3c00] text-[#ffb786]',
  RENDAH: 'bg-[#002105] text-[#7dd878]',
};

const confidenceColor = (score: number) => {
  if (score >= 80) return 'text-[#22c55e]';
  if (score >= 60) return 'text-[#ffb786]';
  return 'text-[#ef4444]';
};

function formatTime(value?: string) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function timeAgo(value?: string) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.max(0, Math.floor(diffMs / 60000));
  if (diffMin < 1) return 'baru saja';
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const hours = Math.floor(diffMin / 60);
  if (hours < 24) return `${hours} jam lalu`;
  return `${Math.floor(hours / 24)} hari lalu`;
}

function getPhotos(report: CommunityReport) {
  return (report.report_media || [])
    .filter((media) => media.media_type !== 'video')
    .map((media) => media.media_url);
}

export function VerifyReports() {
  const { theme } = useTheme();
  const mapBackground = theme === 'light' ? '#eef2f7' : '#10131a';
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewing, setViewing] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const viewReport = useMemo(
    () => reports.find((report) => report.id === viewing) || null,
    [reports, viewing]
  );

  const loadReports = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchReports();
      const filtered = (result.data || []).filter(
        (r) => r.status === 'pending' || r.status === 'need_review'
      );
      setReports(filtered);
    } catch (err) {
      console.error(err);
      setError('Gagal mengambil laporan. Pastikan backend dan Supabase aktif.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const approve = async (id: string) => {
    setActionLoading(id);
    try {
      await updateReportStatus(id, 'approved', undefined, notes[id]);
      setReports((prev) => prev.filter((report) => report.id !== id));
      setViewing(null);
    } catch (err) {
      console.error(err);
      alert('Gagal approve laporan.');
    } finally {
      setActionLoading(null);
    }
  };

  const startReject = (id: string) => {
    setRejectTarget(id);
    setSelectedReason('');
    setCustomReason('');
  };

  const confirmReject = async () => {
    if (!rejectTarget) return;
    const reason = selectedReason === 'Lainnya' ? customReason : selectedReason;
    if (!reason) {
      alert('Pilih atau tulis alasan penolakan.');
      return;
    }

    setActionLoading(rejectTarget);
    try {
      await updateReportStatus(rejectTarget, 'rejected', reason, notes[rejectTarget]);
      setReports((prev) => prev.filter((report) => report.id !== rejectTarget));
      setRejectTarget(null);
      setViewing(null);
    } catch (err) {
      console.error(err);
      alert('Gagal reject laporan.');
    } finally {
      setActionLoading(null);
    }
  };

  const renderRejectModal = () => {
    if (!rejectTarget) return null;

    return (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        style={{ background: 'rgba(10,13,20,0.85)', backdropFilter: 'blur(6px)' }}
      >
        <div className="bg-[#1d2027] border border-[rgba(239,68,68,0.2)] rounded-2xl p-6 w-[90%] max-w-md shadow-2xl space-y-4">
          <h3 className="text-[#e1e2ec] text-lg font-bold">Alasan Penolakan</h3>
          <p className="text-[#8c909f] text-sm">Alasan ini akan disimpan ke audit verifikasi admin.</p>

          <div className="space-y-2">
            {rejectReasons.map((reason) => (
              <button
                key={reason}
                type="button"
                onClick={() => setSelectedReason(reason)}
                className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-colors ${
                  selectedReason === reason
                    ? 'bg-[rgba(239,68,68,0.12)] border-[rgba(239,68,68,0.35)] text-[#ffb4ab]'
                    : 'bg-[#10131a] border-[rgba(255,255,255,0.08)] text-[#c2c6d6] hover:border-[rgba(255,255,255,0.18)]'
                }`}
              >
                {reason}
              </button>
            ))}
          </div>

          {selectedReason === 'Lainnya' && (
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              rows={3}
              placeholder="Tulis alasan lain..."
              className="w-full bg-[#10131a] border border-[#424754] rounded-lg px-4 py-3 text-[#e1e2ec] placeholder-[#4a5060] text-sm focus:outline-none focus:border-[rgba(239,68,68,0.4)] resize-none"
            />
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setRejectTarget(null)}
              className="flex-1 py-2.5 rounded-xl border border-[#424754] text-[#e1e2ec] text-sm font-medium hover:bg-[rgba(255,255,255,0.05)]"
            >
              Batal
            </button>
            <button
              onClick={confirmReject}
              disabled={actionLoading === rejectTarget}
              className="flex-1 py-2.5 rounded-xl bg-[rgba(239,68,68,0.16)] border border-[rgba(239,68,68,0.35)] text-[#ef4444] text-sm font-semibold hover:bg-[rgba(239,68,68,0.22)] disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (viewReport) {
    const photos = getPhotos(viewReport);
    const coords: [number, number] = [viewReport.latitude, viewReport.longitude];
    const confidence = viewReport.confidence_score ?? 0;

    return (
      <div className="space-y-5">
        <button onClick={() => setViewing(null)} className="flex items-center gap-2 text-[#adc6ff] text-sm hover:underline">
          <ArrowLeft size={14} /> Kembali ke daftar
        </button>

        <div className="bg-[#1d2027] border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.06)] flex items-start justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[#8c909f] text-xs font-mono">{viewReport.id}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${sevColor[viewReport.severity] || sevColor.SEDANG}`}>
                  {viewReport.severity}
                </span>
                <span className={`text-xs font-semibold ${confidenceColor(confidence)}`}>Confidence: {confidence}%</span>
                {viewReport.status === 'need_review' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[rgba(239,68,68,0.12)] border border-[rgba(239,68,68,0.3)] text-[#ffb4ab]">
                    ⚑ Flagged Komunitas — dilaporkan tidak akurat oleh pengguna
                  </span>
                )}
              </div>
              <h3 className="text-[#e1e2ec] text-lg font-bold">{viewReport.title}</h3>
              <p className="text-[#8c909f] text-xs mt-0.5 flex items-center gap-1">
                <MapPin size={11} /> {viewReport.location_name || 'Lokasi belum diberi nama'}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[#8c909f] text-xs">
              <Clock size={11} /> {timeAgo(viewReport.created_at)}
            </div>
          </div>

          <div className="p-5 space-y-5">
            <div>
              <p className="text-[#8c909f] text-[10px] uppercase tracking-widest font-semibold mb-1">Deskripsi</p>
              <p className="text-[#c2c6d6] text-sm leading-relaxed">{viewReport.description}</p>
            </div>

            <div className="flex gap-6 flex-wrap text-xs">
              <div>
                <span className="text-[#8c909f]">Pelapor: </span>
                <span className="text-[#e1e2ec] font-medium">{viewReport.reporter_name || 'Anonymous User'}</span>
              </div>
              <div>
                <span className="text-[#8c909f]">Waktu: </span>
                <span className="text-[#e1e2ec] font-medium">{formatTime(viewReport.created_at)}</span>
              </div>
              <div>
                <span className="text-[#8c909f]">Kategori: </span>
                <span className="text-[#e1e2ec] font-medium">{viewReport.category}</span>
              </div>
            </div>

            <div>
              <p className="text-[#8c909f] text-[10px] uppercase tracking-widest font-semibold mb-2 flex items-center gap-1.5">
                <Image size={12} /> Bukti Foto ({photos.length})
              </p>
              {photos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {photos.map((src, i) => (
                    <a
                      key={src}
                      href={src}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg overflow-hidden border border-[rgba(255,255,255,0.08)] aspect-video bg-[#10131a] hover:border-[rgba(173,198,255,0.4)]"
                    >
                      <img src={src} alt={`Bukti ${i + 1}`} className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-[rgba(255,255,255,0.12)] bg-[#10131a] p-5 text-[#8c909f] text-sm">
                  Tidak ada foto/video yang diunggah.
                </div>
              )}
            </div>

            <div>
              <p className="text-[#8c909f] text-[10px] uppercase tracking-widest font-semibold mb-2 flex items-center gap-1.5">
                <MapPin size={12} /> Lokasi Kejadian
              </p>
              <div className="rounded-lg overflow-hidden h-[240px] border border-[rgba(255,255,255,0.08)]">
                <MapContainer center={coords} zoom={14} zoomControl={false} style={{ height: '100%', width: '100%', background: mapBackground }}>
                  <ThemedTileLayer />
                  <CircleMarker center={coords} radius={10} pathOptions={{ color: '#ffb4ab', fillColor: '#ffb4ab', fillOpacity: 0.7, weight: 2 }} />
                </MapContainer>
              </div>
              <p className="text-[#8c909f] text-xs mt-1 font-mono">
                LAT {viewReport.latitude.toFixed(6)} | LNG {viewReport.longitude.toFixed(6)}
              </p>
            </div>

            <div>
              <p className="text-[#8c909f] text-[10px] uppercase tracking-widest font-semibold mb-2 flex items-center gap-1.5">
                <MessageSquare size={12} /> Catatan Admin
              </p>
              <textarea
                value={notes[viewReport.id] || ''}
                onChange={(e) => setNotes((prev) => ({ ...prev, [viewReport.id]: e.target.value }))}
                rows={3}
                placeholder="Tulis catatan untuk laporan ini..."
                className="w-full bg-[#10131a] border border-[#424754] rounded-lg px-4 py-3 text-[#e1e2ec] placeholder-[#4a5060] text-sm focus:outline-none focus:border-[rgba(173,198,255,0.4)] resize-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => approve(viewReport.id)}
                disabled={actionLoading === viewReport.id}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[rgba(34,197,94,0.12)] border border-[rgba(34,197,94,0.3)] text-[#22c55e] text-sm font-semibold hover:bg-[rgba(34,197,94,0.2)] disabled:opacity-50"
              >
                <CheckCircle2 size={15} /> Approve Laporan
              </button>
              <button
                onClick={() => startReject(viewReport.id)}
                disabled={actionLoading === viewReport.id}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.25)] text-[#ef4444] text-sm font-semibold hover:bg-[rgba(239,68,68,0.15)] disabled:opacity-50"
              >
                <XCircle size={15} /> Reject Laporan
              </button>
            </div>
          </div>
        </div>

        {renderRejectModal()}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[#c2c6d6] text-sm">
          {reports.length} laporan menunggu verifikasi
          {reports.filter((r) => r.status === 'need_review').length > 0 && (
            <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[rgba(239,68,68,0.12)] border border-[rgba(239,68,68,0.3)] text-[#ffb4ab]">
              {reports.filter((r) => r.status === 'need_review').length} flagged komunitas
            </span>
          )}
        </p>
        <button
          onClick={loadReports}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1d2027] border border-[rgba(255,255,255,0.08)] text-[#adc6ff] text-sm hover:bg-[rgba(173,198,255,0.08)]"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {loading && (
        <div className="bg-[#1d2027] border border-[rgba(255,255,255,0.06)] rounded-xl p-6 text-[#8c909f] text-sm">
          Mengambil laporan dari Supabase...
        </div>
      )}

      {error && (
        <div className="bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.25)] rounded-xl p-4 text-[#ffb4ab] text-sm">
          {error}
        </div>
      )}

      {!loading && !error && reports.length === 0 && (
        <div className="bg-[#1d2027] border border-[rgba(255,255,255,0.06)] rounded-xl p-8 text-center">
          <CheckCircle2 size={32} className="text-[#22c55e] mx-auto mb-3" />
          <p className="text-[#e1e2ec] font-semibold">Tidak ada laporan pending</p>
          <p className="text-[#8c909f] text-sm mt-1">Semua laporan user sudah diverifikasi.</p>
        </div>
      )}

      {reports.map((report) => {
        const confidence = report.confidence_score ?? 0;
        const photoCount = getPhotos(report).length;
        return (
          <div key={report.id} className="bg-[#1d2027] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 hover:border-[rgba(173,198,255,0.2)] transition-colors">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[#8c909f] text-xs font-mono">{report.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${sevColor[report.severity] || sevColor.SEDANG}`}>
                    {report.severity}
                  </span>
                  {report.status === 'need_review' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[rgba(239,68,68,0.12)] border border-[rgba(239,68,68,0.3)] text-[#ffb4ab]">
                      ⚑ Flagged Komunitas
                    </span>
                  )}
                </div>
                <h3 className="text-[#e1e2ec] text-sm font-bold">{report.title}</h3>
                <p className="text-[#8c909f] text-xs mt-0.5">{report.location_name || 'Lokasi belum diberi nama'}</p>
                <div className="flex items-center gap-4 mt-2 flex-wrap text-xs">
                  <span className={confidenceColor(confidence)}>↗ Confidence: {confidence}%</span>
                  <span className="text-[#8c909f] flex items-center gap-1"><Clock size={11} /> {timeAgo(report.created_at)}</span>
                  <span className="text-[#8c909f] flex items-center gap-1"><Image size={11} /> {photoCount} foto</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setViewing(report.id)}
                  className="eye-button w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--bg-card)] text-[var(--accent)] border border-[var(--border-soft)] hover:bg-[var(--accent-soft)] transition-colors"
                  title="Lihat detail"
                  aria-label="Lihat detail laporan"
                >
                  <Image size={14} />
                </button>
                <button
                  onClick={() => approve(report.id)}
                  disabled={actionLoading === report.id}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.25)] text-[#22c55e] text-xs font-semibold hover:bg-[rgba(34,197,94,0.16)] disabled:opacity-50"
                >
                  <CheckCircle2 size={13} /> Approve
                </button>
                <button
                  onClick={() => startReject(report.id)}
                  disabled={actionLoading === report.id}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.25)] text-[#ef4444] text-xs font-semibold hover:bg-[rgba(239,68,68,0.14)] disabled:opacity-50"
                >
                  <XCircle size={13} /> Reject
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {renderRejectModal()}
    </div>
  );
}