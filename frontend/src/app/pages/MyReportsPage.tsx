import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  MapPin,
  ShieldCheck,
  Star,
  XCircle,
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { fetchMyReports, type CommunityReport } from '../services/api';

function formatDateTime(iso?: string): string {
  if (!iso) return '-';

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function formatPercent(value?: number | null): string {
  const safeValue = typeof value === 'number' ? value : 0;
  return `${Math.round(safeValue * 10) / 10}%`;
}

function getStatusLabel(status: string): string {
  const normalized = status.toLowerCase();

  if (normalized === 'approved') return 'Verified';
  if (normalized === 'rejected') return 'Rejected';
  if (normalized === 'pending') return 'Pending';
  if (normalized === 'need_review') return 'Need Review';
  if (normalized === 'duplicate') return 'Duplicate';
  if (normalized === 'resolved') return 'Resolved';

  return status;
}

function getStatusStyle(status: string): string {
  const normalized = status.toLowerCase();

  if (normalized === 'approved') {
    return 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-500/10 dark:text-emerald-300';
  }

  if (normalized === 'rejected') {
    return 'border-rose-200 bg-rose-50/50 text-rose-700 dark:border-rose-400/25 dark:bg-rose-500/10 dark:text-rose-300';
  }

  if (normalized === 'pending') {
    return 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-400/25 dark:bg-amber-500/10 dark:text-amber-300';
  }

  return 'border-slate-300 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300';
}

function getStatusIcon(status: string) {
  const normalized = status.toLowerCase();

  if (normalized === 'approved') return <ShieldCheck size={14} />;
  if (normalized === 'rejected') return <XCircle size={14} />;
  if (normalized === 'pending') return <Clock size={14} />;

  return <FileText size={14} />;
}

function getLatestRejectReason(report: CommunityReport): string | null {
  const verifications = report.report_verifications ?? [];
  const rejected = verifications
    .filter((item) => item.decision === 'rejected')
    .sort((a, b) => {
      const aTime = new Date(a.created_at ?? 0).getTime();
      const bTime = new Date(b.created_at ?? 0).getTime();
      return bTime - aTime;
    })[0];

  return rejected?.reason || rejected?.admin_notes || null;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = rating >= index + 1;
        const partial = !filled && rating > index;

        return (
          <div key={index} className="relative h-5 w-5">
            <Star
              size={20}
              className="absolute inset-0 text-slate-300 dark:text-slate-600"
            />

            {(filled || partial) && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  width: filled
                    ? '100%'
                    : `${Math.max(0, Math.min(1, rating - index)) * 100}%`,
                }}
              >
                <Star size={20} className="fill-amber-400 text-amber-400" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function MyReportsPage() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState('');
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadReports = async (targetUserId: string) => {
    setLoading(true);
    setError('');

    try {
      const result = await fetchMyReports(targetUserId);
      setReports(result.data ?? []);
    } catch (err) {
      console.error(err);
      setError(
        'Gagal mengambil laporan kamu. Pastikan backend aktif dan endpoint reports sudah diperbarui.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      const { data, error: userError } = await supabase.auth.getUser();

      if (userError || !data.user) {
        setError('User belum login. Silakan login ulang.');
        setLoading(false);
        return;
      }

      setUserId(data.user.id);
      await loadReports(data.user.id);
    };

    loadUser();
  }, []);

  const stats = useMemo(() => {
    const total = reports.length;
    const approved = reports.filter((report) => report.status === 'approved').length;
    const rejected = reports.filter((report) => report.status === 'rejected').length;
    const pending = reports.filter((report) => report.status === 'pending').length;
    const needReview = reports.filter((report) => report.status === 'need_review').length;

    const reviewed = approved + rejected;
    const rating =
      reviewed > 0 ? Math.round((approved / reviewed) * 5 * 10) / 10 : 0;

    return {
      total,
      approved,
      rejected,
      pending,
      needReview,
      reviewed,
      rating,
    };
  }, [reports]);

  const sortedReports = useMemo(() => {
    return [...reports].sort((a, b) => {
      const aTime = new Date(a.created_at ?? 0).getTime();
      const bTime = new Date(b.created_at ?? 0).getTime();
      return bTime - aTime;
    });
  }, [reports]);

  return (
    <div className="min-h-full bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-[#e1e2ec]">
              Laporan Saya
            </h1>

            <p className="mt-1 text-sm text-slate-600 dark:text-[#8c909f]">
              Pantau laporan yang kamu buat dan lihat reputasi berdasarkan validasi admin.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/dashboard/reports/create')}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-[#adc6ff] dark:text-[#002e6a] dark:hover:bg-[#c7d9ff]"
          >
            <FileText size={16} />
            Buat Laporan Baru
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-700 dark:border-red-400/25 dark:bg-red-500/10 dark:text-red-200">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[rgba(255,255,255,0.08)] dark:bg-[#1d2027]">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-[#8c909f]">
                  User Rating
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <p className="text-5xl font-black text-slate-950 dark:text-[#e1e2ec]">
                    {stats.reviewed > 0 ? stats.rating.toFixed(1) : '-'}
                  </p>

                  <div>
                    <StarRating rating={stats.rating} />

                    <p className="mt-1 text-xs text-slate-500 dark:text-[#8c909f]">
                      {stats.reviewed > 0
                        ? `Berdasarkan ${stats.reviewed} laporan yang sudah dinilai admin`
                        : 'Belum ada laporan yang dinilai admin'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 dark:border-[rgba(173,198,255,0.16)] dark:bg-[rgba(173,198,255,0.06)]">
                <p className="text-xs font-semibold text-blue-700 dark:text-[#adc6ff]">
                  Formula rating
                </p>

                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-[#8c909f]">
                  Rating = laporan verified ÷ laporan verified/rejected × 5.
                  Laporan pending belum dihitung.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
            {[
              {
                label: 'Total',
                value: stats.total,
                icon: FileText,
                tone: 'text-blue-600 dark:text-[#adc6ff]',
              },
              {
                label: 'Verified',
                value: stats.approved,
                icon: ShieldCheck,
                tone: 'text-emerald-600 dark:text-emerald-300',
              },
              {
                label: 'Rejected',
                value: stats.rejected,
                icon: XCircle,
                tone: 'text-rose-600 dark:text-rose-300',
              },
              {
                label: 'Pending',
                value: stats.pending + stats.needReview,
                icon: Clock,
                tone: 'text-amber-600 dark:text-amber-300',
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[rgba(255,255,255,0.08)] dark:bg-[#1d2027]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-[#8c909f]">
                      {item.label}
                    </p>

                    <Icon size={16} className={item.tone} />
                  </div>

                  <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-[#e1e2ec]">
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[rgba(255,255,255,0.08)] dark:bg-[#1d2027]">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-[rgba(255,255,255,0.07)]">
            <div>
              <h2 className="text-base font-semibold text-slate-950 dark:text-[#e1e2ec]">
                Riwayat Laporan
              </h2>

              <p className="mt-0.5 text-xs text-slate-500 dark:text-[#8c909f]">
                Semua laporan yang pernah kamu kirim.
              </p>
            </div>

            {userId && (
              <button
                type="button"
                onClick={() => loadReports(userId)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-[rgba(255,255,255,0.12)] dark:text-[#e1e2ec] dark:hover:bg-[rgba(255,255,255,0.05)]"
              >
                Refresh
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 px-5 py-16 text-sm text-slate-500 dark:text-[#8c909f]">
              <Loader2 size={18} className="animate-spin" />
              Memuat laporan kamu...
            </div>
          ) : sortedReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
              <FileText size={42} className="text-slate-400 dark:text-[#8c909f]" />

              <p className="mt-4 text-sm font-semibold text-slate-950 dark:text-[#e1e2ec]">
                Belum ada laporan
              </p>

              <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-500 dark:text-[#8c909f]">
                Laporan yang kamu buat akan muncul di sini beserta status validasinya.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-[rgba(255,255,255,0.06)]">
              {sortedReports.map((report) => {
                const status = report.status.toLowerCase();
                const rejectReason =
                  status === 'rejected' ? getLatestRejectReason(report) : null;

                const firstImage = report.report_media?.find(
                  (media) =>
                    String(media.media_type).startsWith('image') ||
                    media.media_type === 'image',
                );

                const firstVideo = !firstImage
                  ? report.report_media?.find((media) => media.media_type === 'video')
                  : undefined;

                return (
                  <button
                    key={report.id}
                    type="button"
                    onClick={() => navigate(`/dashboard/reports/${report.id}`)}
                    className="block w-full px-5 py-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-[rgba(255,255,255,0.03)]"
                  >
                    <div className="flex gap-4">
                      <div className="hidden h-20 w-28 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 sm:block dark:border-[rgba(255,255,255,0.08)] dark:bg-[#10131a]">
                        {firstImage?.media_url ? (
                          <img
                            src={firstImage.media_url}
                            alt={report.title}
                            className="h-full w-full object-cover"
                          />
                        ) : firstVideo?.media_url ? (
                          <video
                            src={firstVideo.media_url}
                            className="h-full w-full object-cover"
                            preload="metadata"
                            muted
                            playsInline
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <FileText size={24} className="text-slate-400 dark:text-[#8c909f]" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getStatusStyle(
                              report.status,
                            )}`}
                          >
                            {getStatusIcon(report.status)}
                            {getStatusLabel(report.status)}
                          </span>

                          <span className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:border-[rgba(255,255,255,0.08)] dark:text-[#c2c6d6]">
                            {report.severity}
                          </span>

                          <span className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:border-[rgba(255,255,255,0.08)] dark:text-[#c2c6d6]">
                            {report.category}
                          </span>
                        </div>

                        <h3 className="mt-3 truncate text-base font-semibold text-slate-950 dark:text-[#e1e2ec]">
                          {report.title}
                        </h3>

                        <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-[#8c909f]">
                          {report.description}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-[#8c909f]">
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={12} />
                            {report.location_name ?? 'Lokasi tidak tersedia'}
                          </span>

                          <span className="inline-flex items-center gap-1">
                            <Clock size={12} />
                            {formatDateTime(report.created_at)}
                          </span>

                          <span className="inline-flex items-center gap-1">
                            <CheckCircle2 size={12} />
                            Confidence {formatPercent(report.confidence_score)}
                          </span>
                        </div>

                        {rejectReason && (
                          <div
                            className="mt-3 rounded-xl px-4 py-3 text-sm font-semibold leading-relaxed dark:bg-red-500/10 dark:border-red-400/30 dark:text-red-200"
                            style={{
                              backgroundColor: '#fff5f5',
                              border: '1px solid #ffb4b4',
                              color: '#ff6b6b',
                            }}
                          >
                            <p className="font-bold">
                              Alasan ditolak :
                            </p>

                            <p className="mt-1 font-semibold">
                              {rejectReason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}