import { useState } from 'react';
import {
  X,
  Phone,
  AlertOctagon,
  Bug,
  ChevronRight,
  CheckCircle,
  Send,
  Flame,
  Zap,
  ShieldAlert,
  Anchor,
  HeartPulse,
} from 'lucide-react';

interface SupportModalProps {
  open: boolean;
  onClose: () => void;
}

type Tab = 'emergency' | 'report';

interface IssueForm {
  type: string;
  description: string;
  email: string;
}

const emergencyContacts = [
  {
    id: 'police',
    label: 'Polisi',
    number: '110',
    icon: <ShieldAlert size={16} />,
    color: 'text-[#adc6ff]',
    bg: 'bg-[rgba(173,198,255,0.1)]',
    border: 'border-[rgba(173,198,255,0.2)]',
    desc: 'Darurat kepolisian nasional',
  },
  {
    id: 'ambulance',
    label: 'Ambulans',
    number: '118',
    icon: <HeartPulse size={16} />,
    color: 'text-[#f28b82]',
    bg: 'bg-[rgba(242,139,130,0.1)]',
    border: 'border-[rgba(242,139,130,0.2)]',
    desc: 'Layanan darurat medis',
  },
  {
    id: 'fire',
    label: 'Pemadam Kebakaran',
    number: '113',
    icon: <Flame size={16} />,
    color: 'text-[#ffb786]',
    bg: 'bg-[rgba(255,183,134,0.1)]',
    border: 'border-[rgba(255,183,134,0.2)]',
    desc: 'Dinas pemadam kebakaran',
  },
  {
    id: 'sar',
    label: 'SAR Nasional',
    number: '115',
    icon: <Anchor size={16} />,
    color: 'text-[#7dd878]',
    bg: 'bg-[rgba(125,216,120,0.1)]',
    border: 'border-[rgba(125,216,120,0.2)]',
    desc: 'Pencarian & penyelamatan',
  },
  {
    id: 'bpbd',
    label: 'BPBD Jakarta',
    number: '021-3458-5555',
    icon: <AlertOctagon size={16} />,
    color: 'text-[#d0a0ff]',
    bg: 'bg-[rgba(208,160,255,0.1)]',
    border: 'border-[rgba(208,160,255,0.2)]',
    desc: 'Badan Penanggulangan Bencana',
  },
  {
    id: 'pln',
    label: 'PLN (Listrik)',
    number: '123',
    icon: <Zap size={16} />,
    color: 'text-[#ffd966]',
    bg: 'bg-[rgba(255,217,102,0.1)]',
    border: 'border-[rgba(255,217,102,0.2)]',
    desc: 'Gangguan listrik & kedaruratan',
  },
];

const issueTypes = [
  'Bug Teknis',
  'Data Tidak Akurat',
  'Permintaan Fitur',
  'Laporan Tidak Terkirim',
  'Masalah Peta',
  'Lainnya',
];

export function SupportModal({ open, onClose }: SupportModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('emergency');
  const [form, setForm] = useState<IssueForm>({ type: '', description: '', email: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.type || !form.description) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm({ type: '', description: '', email: '' });
      }, 2500);
    }, 1000);
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-[70]" onClick={onClose} />

      {/* Sheet: bottom on mobile, centered on desktop */}
      <div className="fixed inset-x-0 bottom-0 z-[71] md:inset-0 md:flex md:items-center md:justify-center md:p-4">
        <div className="bg-[#1a1d24] border border-[rgba(255,255,255,0.1)] rounded-t-2xl md:rounded-2xl w-full md:max-w-[460px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">

          {/* Drag handle – mobile */}
          <div className="flex justify-center pt-3 pb-1 md:hidden">
            <div className="w-10 h-1 bg-[rgba(255,255,255,0.15)] rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-[rgba(255,255,255,0.07)]">
            <h3 className="text-[#e1e2ec] font-semibold">Pusat Bantuan</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8c909f] hover:text-[#e1e2ec] hover:bg-[rgba(255,255,255,0.06)] transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[rgba(255,255,255,0.07)]">
            <button
              onClick={() => setActiveTab('emergency')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'emergency'
                  ? 'text-[#adc6ff]'
                  : 'text-[#8c909f] hover:text-[#c2c6d6]'
              }`}
            >
              <Phone size={14} />
              Kontak Darurat
              {activeTab === 'emergency' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#adc6ff] rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'report'
                  ? 'text-[#adc6ff]'
                  : 'text-[#8c909f] hover:text-[#c2c6d6]'
              }`}
            >
              <Bug size={14} />
              Laporkan Masalah
              {activeTab === 'report' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#adc6ff] rounded-full" />
              )}
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">

            {/* ── Emergency Contacts Tab ── */}
            {activeTab === 'emergency' && (
              <div className="p-4 space-y-2.5">
                {/* Warning banner */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-[rgba(179,38,30,0.12)] border border-[rgba(179,38,30,0.3)]">
                  <AlertOctagon size={15} className="text-[#ffb4ab] shrink-0 mt-0.5" />
                  <p className="text-[#ffb4ab] text-xs leading-relaxed">
                    Gunakan nomor darurat ini hanya pada kondisi yang mengancam jiwa atau keselamatan. Hubungi sesuai situasi yang tepat.
                  </p>
                </div>

                {/* Contact cards */}
                {emergencyContacts.map((contact) => (
                  <a
                    key={contact.id}
                    href={`tel:${contact.number.replace(/-/g, '')}`}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border ${contact.bg} ${contact.border} hover:brightness-125 transition-all group cursor-pointer`}
                    onClick={(e) => e.preventDefault()} // demo: prevent actual call
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${contact.bg} border ${contact.border}`}>
                      <span className={contact.color}>{contact.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#e1e2ec] text-sm font-semibold">{contact.label}</p>
                      <p className="text-[#8c909f] text-xs">{contact.desc}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`text-base font-bold tracking-wide ${contact.color}`}>
                        {contact.number}
                      </span>
                      <ChevronRight size={14} className="text-[#424754] group-hover:text-[#8c909f] transition-colors" />
                    </div>
                  </a>
                ))}

                {/* Call tip */}
                <p className="text-center text-[#8c909f] text-xs pt-1 pb-2">
                  Ketuk kartu untuk menghubungi langsung
                </p>
              </div>
            )}

            {/* ── Report Issue Tab ── */}
            {activeTab === 'report' && (
              <div className="p-4">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3">
                    <div className="w-14 h-14 rounded-full bg-[rgba(125,216,120,0.12)] border border-[rgba(125,216,120,0.3)] flex items-center justify-center">
                      <CheckCircle size={26} className="text-[#7dd878]" />
                    </div>
                    <p className="text-[#e1e2ec] font-semibold">Laporan Terkirim!</p>
                    <p className="text-[#8c909f] text-sm text-center">
                      Tim kami akan menindaklanjuti laporan Anda dalam 1×24 jam.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Issue type */}
                    <div className="space-y-1.5">
                      <label className="block text-[#8c909f] text-xs font-semibold uppercase tracking-widest">
                        Jenis Masalah <span className="text-[#ffb4ab]">*</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {issueTypes.map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setForm((f) => ({ ...f, type }))}
                            className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                              form.type === type
                                ? 'bg-[rgba(173,198,255,0.15)] border-[#adc6ff] text-[#adc6ff]'
                                : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] text-[#c2c6d6] hover:border-[rgba(255,255,255,0.25)]'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                      <label className="block text-[#8c909f] text-xs font-semibold uppercase tracking-widest">
                        Deskripsi <span className="text-[#ffb4ab]">*</span>
                      </label>
                      <textarea
                        value={form.description}
                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                        placeholder="Jelaskan masalah yang Anda temui secara detail..."
                        rows={4}
                        className="w-full bg-[#24272f] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 text-[#e1e2ec] text-sm placeholder-[#424754] focus:outline-none focus:border-[rgba(173,198,255,0.4)] focus:ring-1 focus:ring-[rgba(173,198,255,0.1)] transition-colors resize-none"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="block text-[#8c909f] text-xs font-semibold uppercase tracking-widest">
                        Email (opsional)
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        placeholder="email@contoh.com"
                        className="w-full bg-[#24272f] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 text-[#e1e2ec] text-sm placeholder-[#424754] focus:outline-none focus:border-[rgba(173,198,255,0.4)] focus:ring-1 focus:ring-[rgba(173,198,255,0.1)] transition-colors"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={!form.type || !form.description || submitting}
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                        form.type && form.description && !submitting
                          ? 'bg-[#adc6ff] hover:bg-[#c7d9ff] text-[#002e6a] shadow-[0_0_16px_rgba(173,198,255,0.2)]'
                          : 'bg-[rgba(255,255,255,0.06)] text-[#424754] cursor-not-allowed'
                      }`}
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                          </svg>
                          Mengirim...
                        </>
                      ) : (
                        <>
                          <Send size={14} />
                          Kirim Laporan
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
