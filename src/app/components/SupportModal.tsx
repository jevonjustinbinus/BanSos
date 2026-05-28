import { useState } from 'react';
import { Bug, ChevronRight, Flame, HeartPulse, LifeBuoy, Phone, Send, Shield, X, Zap } from 'lucide-react';

type SupportPanelProps = {
  open: boolean;
  onClose: () => void;
};

const emergencyContacts = [
  { title: 'Polisi', desc: 'Darurat kepolisian nasional', number: '110', icon: Shield, tone: 'blue' },
  { title: 'Ambulans', desc: 'Layanan darurat medis', number: '118', icon: HeartPulse, tone: 'red' },
  { title: 'Pemadam Kebakaran', desc: 'Dinas pemadam kebakaran', number: '113', icon: Flame, tone: 'orange' },
  { title: 'SAR Nasional', desc: 'Pencarian & penyelamatan', number: '115', icon: LifeBuoy, tone: 'green' },
  { title: 'BPBD Jakarta', desc: 'Badan Penanggulangan Bencana', number: '021-3458-5555', icon: Shield, tone: 'purple' },
  { title: 'PLN (Listrik)', desc: 'Gangguan listrik & kedaruratan', number: '123', icon: Zap, tone: 'yellow' },
];

const problemTypes = [
  'Bug Teknis',
  'Data Tidak Akurat',
  'Permintaan Fitur',
  'Laporan Tidak Terkirim',
  'Masalah Peta',
  'Lainnya',
];

function toneClass(tone: string) {
  const map: Record<string, string> = {
    blue: 'bg-blue-500/10 border-blue-500/25 text-blue-600 dark:text-blue-300',
    red: 'bg-red-500/10 border-red-500/25 text-red-600 dark:text-red-300',
    orange: 'bg-orange-500/10 border-orange-500/25 text-orange-600 dark:text-orange-300',
    green: 'bg-green-500/10 border-green-500/25 text-green-600 dark:text-green-300',
    purple: 'bg-purple-500/10 border-purple-500/25 text-purple-600 dark:text-purple-300',
    yellow: 'bg-yellow-500/10 border-yellow-500/25 text-yellow-700 dark:text-yellow-300',
  };

  return map[tone] ?? map.blue;
}

export function SupportPanel({ open, onClose }: SupportPanelProps) {
  const [tab, setTab] = useState<'emergency' | 'problem'>('emergency');
  const [selectedType, setSelectedType] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');

  if (!open) return null;

  const canSubmit = selectedType.trim() && description.trim();

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end bg-black/45">
      <div className="support-panel h-full w-full max-w-[430px] overflow-y-auto border-l border-[var(--border-soft)] bg-[var(--bg-card)] text-[var(--text-main)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border-soft)] px-5 py-4">
          <h2 className="text-lg font-bold text-[var(--text-main)]">Pusat Bantuan</h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--text-muted)] hover:bg-[var(--accent-soft)] hover:text-[var(--text-main)]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 border-b border-[var(--border-soft)]">
          <button
            type="button"
            onClick={() => setTab('emergency')}
            className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-colors ${
              tab === 'emergency'
                ? 'border-b-2 border-[var(--accent)] text-[var(--accent)]'
                : 'text-[var(--text-muted)] hover:bg-[var(--accent-soft)]'
            }`}
          >
            <Phone size={15} />
            Kontak Darurat
          </button>

          <button
            type="button"
            onClick={() => setTab('problem')}
            className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-colors ${
              tab === 'problem'
                ? 'border-b-2 border-[var(--accent)] text-[var(--accent)]'
                : 'text-[var(--text-muted)] hover:bg-[var(--accent-soft)]'
            }`}
          >
            <Bug size={15} />
            Laporkan Masalah
          </button>
        </div>

        {tab === 'emergency' ? (
          <div className="space-y-3 p-4">
            <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-200">
              Gunakan nomor darurat ini hanya pada kondisi yang mengancam jiwa atau keselamatan.
              Hubungi sesuai situasi yang tepat.
            </div>

            {emergencyContacts.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.title}
                  href={`tel:${item.number}`}
                  className={`flex items-center gap-3 rounded-xl border p-4 transition-transform hover:scale-[1.01] ${toneClass(item.tone)}`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-current/20 bg-current/10">
                    <Icon size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[var(--text-main)]">{item.title}</p>
                    <p className="text-xs text-[var(--text-muted)]">{item.desc}</p>
                  </div>

                  <div className="flex items-center gap-2 font-bold">
                    {item.number}
                    <ChevronRight size={16} />
                  </div>
                </a>
              );
            })}

            <p className="pt-2 text-center text-xs text-[var(--text-muted)]">
              Ketuk kartu untuk menghubungi langsung.
            </p>
          </div>
        ) : (
          <div className="space-y-5 p-4">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
                Jenis Masalah *
              </label>

              <div className="flex flex-wrap gap-2">
                {problemTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`rounded-full px-3 py-2 text-sm transition-colors ${
                      selectedType === type
                        ? 'bg-[var(--accent)] text-[var(--text-inverse)]'
                        : 'bg-[var(--bg-soft)] text-[var(--text-soft)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
                Deskripsi *
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Jelaskan masalah yang Anda temui secara detail..."
                className="w-full resize-none rounded-xl border border-[var(--border-strong)] bg-[var(--bg-input)] px-4 py-3 text-[var(--text-main)] placeholder:text-[var(--text-faint)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
                Email (Opsional)
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@contoh.com"
                className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--bg-input)] px-4 py-3 text-[var(--text-main)] placeholder:text-[var(--text-faint)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>

            <button
              type="button"
              disabled={!canSubmit}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-3 font-bold text-[var(--text-inverse)] transition-colors hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Send size={16} />
              Kirim Laporan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export const SupportModal = SupportPanel;
