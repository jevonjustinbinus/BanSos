import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Radio, RefreshCw, Send } from 'lucide-react';
import { createBroadcast, fetchBroadcasts } from '../services/api';

type BroadcastHistory = {
  id?: string;
  title?: string;
  message?: string;
  severity?: string;
  target_location?: string;
  radius_m?: number;
  created_at?: string;
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

const severityOptions = [
  { value: 'info', label: 'Info', className: 'text-[#adc6ff] border-[rgba(173,198,255,0.25)] bg-[rgba(173,198,255,0.08)]' },
  { value: 'warning', label: 'Warning', className: 'text-[#ffb786] border-[rgba(255,183,134,0.25)] bg-[rgba(255,183,134,0.08)]' },
  { value: 'critical', label: 'Critical', className: 'text-[#ffb4ab] border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.08)]' },
  { value: 'resolved', label: 'Resolved', className: 'text-[#22c55e] border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.08)]' },
];

export function BroadcastAlert() {
  const [title, setTitle] = useState('Peringatan Risiko Banjir');
  const [message, setMessage] = useState('Potensi banjir tinggi terdeteksi di area sekitar Anda. Hindari ruas jalan yang tergenang dan pantau pembaruan berikutnya.');
  const [severity, setSeverity] = useState('warning');
  const [targetLocation, setTargetLocation] = useState('Kemang, Jakarta Selatan');
  const [radius, setRadius] = useState(3000);
  const [history, setHistory] = useState<BroadcastHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const loadHistory = async () => {
    setLoading(true);
    try {
      const result = await fetchBroadcasts();
      setHistory(result.data as BroadcastHistory[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSent(false);
    setError('');

    try {
      await createBroadcast({
        title,
        message,
        severity,
        target_location: targetLocation,
        radius_m: radius,
      });
      setSent(true);
      await loadHistory();
    } catch (err) {
      console.error(err);
      setError('Gagal mengirim broadcast. Pastikan backend dan Supabase aktif.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSend} className="bg-[#1d2027] border border-[rgba(255,255,255,0.06)] rounded-xl p-5 space-y-5">
        <div className="flex items-center gap-2">
          <Radio size={16} className="text-[#adc6ff]" />
          <h3 className="text-[#e1e2ec] font-bold">Broadcast Alert ke User</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-[#8c909f] text-[10px] uppercase tracking-widest font-semibold">Judul Alert</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-[#10131a] border border-[#424754] rounded-lg px-4 py-3 text-[#e1e2ec] placeholder-[#4a5060] text-sm focus:outline-none focus:border-[rgba(173,198,255,0.4)]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[#8c909f] text-[10px] uppercase tracking-widest font-semibold">Target Area</label>
            <input
              value={targetLocation}
              onChange={(e) => setTargetLocation(e.target.value)}
              required
              className="w-full bg-[#10131a] border border-[#424754] rounded-lg px-4 py-3 text-[#e1e2ec] placeholder-[#4a5060] text-sm focus:outline-none focus:border-[rgba(173,198,255,0.4)]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[#8c909f] text-[10px] uppercase tracking-widest font-semibold">Severity</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {severityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSeverity(option.value)}
                className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                  severity === option.value
                    ? option.className
                    : 'bg-[#10131a] border-[rgba(255,255,255,0.08)] text-[#c2c6d6] hover:border-[rgba(255,255,255,0.18)]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[#8c909f] text-[10px] uppercase tracking-widest font-semibold">Pesan</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            required
            className="w-full bg-[#10131a] border border-[#424754] rounded-lg px-4 py-3 text-[#e1e2ec] placeholder-[#4a5060] text-sm focus:outline-none focus:border-[rgba(173,198,255,0.4)] resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-[#8c909f] text-[10px] uppercase tracking-widest font-semibold">Radius Broadcast: {radius} meter</label>
          <input
            type="range"
            min={500}
            max={10000}
            step={500}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {error && (
          <div className="rounded-lg bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.25)] px-4 py-3 text-[#ffb4ab] text-sm flex items-start gap-2">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" /> {error}
          </div>
        )}

        {sent && (
          <div className="rounded-lg bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.25)] px-4 py-3 text-[#22c55e] text-sm flex items-start gap-2">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> Broadcast tersimpan dan siap ditampilkan ke user.
          </div>
        )}

        <button
          type="submit"
          disabled={sending}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#adc6ff] hover:bg-[#c7d9ff] disabled:opacity-50 disabled:cursor-not-allowed text-[#002e6a] text-sm font-bold transition-colors"
        >
          <Send size={15} /> {sending ? 'Mengirim...' : 'Send Broadcast'}
        </button>
      </form>

      <div className="bg-[#1d2027] border border-[rgba(255,255,255,0.06)] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#e1e2ec] font-bold">Riwayat Broadcast</h3>
          <button onClick={loadHistory} className="flex items-center gap-2 text-[#adc6ff] text-sm hover:underline">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-[#8c909f] text-sm">Mengambil riwayat broadcast...</p>
        ) : history.length === 0 ? (
          <p className="text-[#8c909f] text-sm">Belum ada broadcast.</p>
        ) : (
          <div className="space-y-3">
            {history.map((item, index) => (
              <div key={item.id || index} className="border border-[rgba(255,255,255,0.06)] rounded-lg p-4 bg-[#10131a]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[#e1e2ec] text-sm font-semibold">{item.title}</p>
                    <p className="text-[#8c909f] text-xs mt-1">{item.target_location} • {formatTime(item.created_at)}</p>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-[rgba(173,198,255,0.1)] text-[#adc6ff]">
                    {item.severity}
                  </span>
                </div>
                <p className="text-[#c2c6d6] text-sm mt-3 line-clamp-2">{item.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
