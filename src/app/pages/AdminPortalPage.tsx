import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Clock,
  LayoutDashboard,
  LogOut,
  Radio,
  RefreshCw,
  Shield,
  Users,
} from 'lucide-react';
import { BroadcastAlert } from './AdminBroadcastAlert';
import { VerifyReports } from './AdminVerifyReports';
import { AdminOverview, CommunityReport, fetchAdminOverview, fetchReports, updateReportStatus } from '../services/api';

const severityColor: Record<string, string> = {
  KRITIS: 'bg-[#93000a] text-[#ffdad6]',
  SEDANG: 'bg-[#5c3c00] text-[#ffb786]',
  RENDAH: 'bg-[#002105] text-[#7dd878]',
  PERINGATAN: 'bg-[#5c3c00] text-[#ffb786]',
};

function Overview() {
  const [summary, setSummary] = useState<AdminOverview | null>(null);
  const [recent, setRecent] = useState<CommunityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [overviewResult, reportsResult] = await Promise.all([
        fetchAdminOverview(),
        fetchReports(),
      ]);
      setSummary(overviewResult.data);
      setRecent((reportsResult.data || []).slice(0, 5));
    } catch (err) {
      console.error(err);
      setError('Gagal mengambil overview dari Supabase. Cek backend dan environment variable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cards = [
    { label: 'Laporan Pending', value: summary?.pending_reports ?? 0, icon: <Clock size={16} />, color: '#ffb786' },
    { label: 'Terverifikasi', value: summary?.approved_reports ?? 0, icon: <CheckCircle2 size={16} />, color: '#22c55e' },
    { label: 'Ditolak', value: summary?.rejected_reports ?? 0, icon: <AlertTriangle size={16} />, color: '#ef4444' },
    { label: 'Broadcast Alert', value: summary?.broadcast_alerts ?? 0, icon: <Radio size={16} />, color: '#adc6ff' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-3">
        <div>
          <p className="text-[#e1e2ec] font-semibold">Admin Overview</p>
          <p className="text-[#8c909f] text-sm">Ringkasan data real dari Supabase.</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1d2027] border border-[rgba(255,255,255,0.08)] text-[#adc6ff] text-sm hover:bg-[rgba(173,198,255,0.08)]"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {error && (
        <div className="bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.25)] rounded-xl p-4 text-[#ffb4ab] text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((s) => (
          <div key={s.label} className="bg-[#1d2027] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#8c909f] text-[10px] uppercase tracking-widest">{s.label}</p>
              <span style={{ color: s.color }}>{s.icon}</span>
            </div>
            <p className="text-[#e1e2ec] text-3xl font-bold" style={{ color: s.color }}>
              {loading ? '...' : s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-[#1d2027] border border-[rgba(255,255,255,0.06)] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={15} className="text-[#adc6ff]" />
          <h3 className="text-[#e1e2ec] font-semibold">Laporan Terbaru</h3>
        </div>

        {loading ? (
          <p className="text-[#8c909f] text-sm">Mengambil laporan...</p>
        ) : recent.length === 0 ? (
          <p className="text-[#8c909f] text-sm">Belum ada laporan.</p>
        ) : (
          <div className="space-y-2">
            {recent.map((inc) => (
              <div key={inc.id} className="flex items-center justify-between py-2.5 border-b border-[rgba(255,255,255,0.04)] gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${severityColor[inc.severity] || severityColor.SEDANG}`}>
                    {inc.severity}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[#e1e2ec] text-sm font-medium truncate">{inc.title}</p>
                    <p className="text-[#8c909f] text-xs truncate">{inc.location_name || '-'}</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[rgba(173,198,255,0.1)] text-[#adc6ff] shrink-0">
                  {inc.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-[#1d2027] border border-[rgba(255,183,134,0.18)] rounded-xl p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="text-[#ffb786] mt-0.5" />
          <div>
            <p className="text-[#e1e2ec] font-semibold">Catatan Data Freshness</p>
            <p className="text-[#8c909f] text-sm mt-1">
              Untuk prediksi banjir, admin tetap perlu cek freshness BMKG dan Posko Banjir. Jika data sensor terlalu lama, confidence prediksi harus diturunkan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const riskStatusOptions = [
  { value: 'pending', label: 'Menunggu' },
  { value: 'need_review', label: 'Perlu Ditinjau' },
  { value: 'approved', label: 'Terverifikasi' },
  { value: 'resolved', label: 'Selesai' },
  { value: 'rejected', label: 'Ditolak' },
];

const riskStatusColor: Record<string, string> = {
  pending: 'text-[#ffb786] bg-[rgba(255,183,134,0.1)] border-[rgba(255,183,134,0.25)]',
  need_review: 'text-[#adc6ff] bg-[rgba(173,198,255,0.1)] border-[rgba(173,198,255,0.25)]',
  approved: 'text-[#22c55e] bg-[rgba(34,197,94,0.1)] border-[rgba(34,197,94,0.25)]',
  resolved: 'text-[#22c55e] bg-[rgba(34,197,94,0.1)] border-[rgba(34,197,94,0.25)]',
  rejected: 'text-[#8c909f] bg-[rgba(140,144,159,0.1)] border-[rgba(140,144,159,0.2)]',
  duplicate: 'text-[#8c909f] bg-[rgba(140,144,159,0.1)] border-[rgba(140,144,159,0.2)]',
};

function timeAgo(iso?: string) {
  if (!iso) return '-';
  const mins = Math.max(0, (Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'baru saja';
  if (mins < 60) return `${Math.floor(mins)} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  return `${Math.floor(hours / 24)} hari lalu`;
}

function RiskControl() {
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchReports();
      setReports(result.data || []);
    } catch (err) {
      console.error(err);
      setError('Gagal mengambil data laporan dari backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const changeStatus = async (id: string, newStatus: string) => {
    setSavingId(id);
    try {
      await updateReportStatus(id, newStatus);
      setReports((prev) => prev.map((r) => r.id === id ? { ...r, status: newStatus } : r));
    } catch (err) {
      console.error(err);
      alert('Gagal mengubah status laporan.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-3">
        <p className="text-[#8c909f] text-sm">Kelola status laporan insiden dari database.</p>
        <button
          onClick={load}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1d2027] border border-[rgba(255,255,255,0.08)] text-[#adc6ff] text-sm hover:bg-[rgba(173,198,255,0.08)]"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {error && (
        <div className="bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.25)] rounded-xl p-4 text-[#ffb4ab] text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-[#1d2027] border border-[rgba(255,255,255,0.06)] rounded-xl p-6 text-[#8c909f] text-sm">
          Mengambil data laporan...
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-[#1d2027] border border-[rgba(255,255,255,0.06)] rounded-xl p-8 text-center">
          <p className="text-[#8c909f] text-sm">Belum ada laporan.</p>
        </div>
      ) : (
        reports.map((inc) => (
          <div key={inc.id} className="bg-[#1d2027] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[#8c909f] text-xs font-mono truncate max-w-[140px]">{inc.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${severityColor[inc.severity] || severityColor.SEDANG}`}>
                    {inc.severity}
                  </span>
                </div>
                <p className="text-[#e1e2ec] text-sm font-semibold">{inc.title}</p>
                <p className="text-[#8c909f] text-xs mt-0.5">{inc.location_name || '-'}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <RefreshCw size={11} className="text-[#8c909f]" />
                  <span className="text-[#8c909f] text-xs">
                    Diperbarui: {timeAgo(inc.updated_at || inc.created_at)}
                  </span>
                </div>
              </div>
              <div className="shrink-0">
                <label className="text-[#8c909f] text-[10px] uppercase tracking-widest block mb-1">Status</label>
                <select
                  value={inc.status}
                  onChange={(e) => changeStatus(inc.id, e.target.value)}
                  disabled={savingId === inc.id}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border bg-[#10131a] focus:outline-none cursor-pointer disabled:opacity-50 ${riskStatusColor[inc.status] || 'text-[#8c909f] border-[rgba(255,255,255,0.08)]'}`}
                >
                  {riskStatusOptions.map((s) => (
                    <option key={s.value} value={s.value} className="bg-[#1d2027] text-[#e1e2ec]">
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

type Tab = 'overview' | 'verify' | 'risk' | 'broadcast';

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={15} /> },
  { id: 'verify', label: 'Verify Reports', icon: <ClipboardList size={15} /> },
  { id: 'risk', label: 'Risk Control', icon: <BarChart3 size={15} /> },
  { id: 'broadcast', label: 'Broadcast Alert', icon: <Radio size={15} /> },
];

export function AdminPortalPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  return (
    <div className="min-h-screen text-[#e1e2ec]" style={{ background: 'linear-gradient(160deg, #0b0e15 0%, #10131a 100%)' }}>
      <header className="h-14 flex items-center justify-between px-4 lg:px-6 border-b border-[rgba(255,255,255,0.06)] bg-[#10131a]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[rgba(173,198,255,0.12)] border border-[rgba(173,198,255,0.2)] flex items-center justify-center">
            <Shield size={15} className="text-[#adc6ff]" />
          </div>
          <div>
            <p className="text-[#e1e2ec] text-sm font-bold leading-tight">Admin Portal</p>
            <p className="text-[#8c909f] text-[10px]">BanSos Control Center</p>
          </div>
        </div>
        <button
          onClick={() => { sessionStorage.removeItem('admin_auth'); navigate('/dashboard'); }}
          className="flex items-center gap-1.5 text-[#8c909f] hover:text-[#e1e2ec] text-xs transition-colors"
        >
          <LogOut size={13} /> Keluar
        </button>
      </header>

      <div className="border-b border-[rgba(255,255,255,0.06)] bg-[#10131a] px-4 lg:px-6">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === t.id
                  ? 'border-[#adc6ff] text-[#adc6ff]'
                  : 'border-transparent text-[#8c909f] hover:text-[#e1e2ec]'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-4xl mx-auto p-4 lg:p-6">
        {activeTab === 'overview' && <Overview />}
        {activeTab === 'verify' && <VerifyReports />}
        {activeTab === 'risk' && <RiskControl />}
        {activeTab === 'broadcast' && <BroadcastAlert />}
      </main>
    </div>
  );
}
