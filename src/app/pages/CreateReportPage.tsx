import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft,
  MapPin,
  Search,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  Upload,
  X,
} from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, useMapEvents } from 'react-leaflet';
import { createReportWithMedia } from '../services/api';

function LocationPicker({
  position,
  onPositionChange,
}: {
  position: [number, number];
  onPositionChange: (pos: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      onPositionChange([e.latlng.lat, e.latlng.lng]);
    },
  });

  return (
    <CircleMarker
      center={position}
      radius={10}
      pathOptions={{
        color: '#ffb4ab',
        fillColor: '#ffb4ab',
        fillOpacity: 0.7,
        weight: 2,
      }}
    />
  );
}

type Severity = 'low' | 'medium' | 'critical';

export function CreateReportPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<Severity>('medium');
  const [position, setPosition] = useState<[number, number]>([-6.2088, 106.8456]);
  const [locationSearch, setLocationSearch] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [checklistItems, setChecklistItems] = useState<boolean[]>([false, false, false]);

  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    setChecklistItems([false, false, false]);

    try {
      await createReportWithMedia(
        {
          title,
          description,
          category: 'BANJIR',
          severity,
          latitude: position[0],
          longitude: position[1],
          location_name: locationSearch || 'Lokasi dipilih dari peta',
          reporter_name: 'User BanSos',
          tags: severity === 'critical' ? ['#banjir', '#darurat'] : ['#banjir'],
        },
        files
      );

      setSubmitted(true);
      [0, 1, 2].forEach((i) => {
        setTimeout(() => {
          setChecklistItems((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, 400 + i * 350);
      });
      setTimeout(() => navigate('/dashboard/reports'), 3000);
    } catch (err) {
      console.error(err);
      setError('Gagal mengirim laporan. Pastikan backend aktif dan Supabase sudah dikonfigurasi.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUseCurrent = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
      () => setPosition([-6.2088, 106.8456])
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selected].slice(0, 5));
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const severityOptions: {
    value: Severity;
    label: string;
    shortLabel: string;
    icon: React.ReactNode;
    color: string;
    activeBg: string;
    activeBorder: string;
  }[] = [
    {
      value: 'low',
      label: 'Low / Routine',
      shortLabel: 'Low',
      icon: <Info size={14} />,
      color: 'text-[#c2c6d6]',
      activeBg: 'bg-[rgba(255,255,255,0.08)]',
      activeBorder: 'border-[rgba(255,255,255,0.3)]',
    },
    {
      value: 'medium',
      label: 'Medium / Alert',
      shortLabel: 'Medium',
      icon: <AlertTriangle size={14} />,
      color: 'text-[#ffb786]',
      activeBg: 'bg-[rgba(255,183,134,0.1)]',
      activeBorder: 'border-[#ffb786]',
    },
    {
      value: 'critical',
      label: 'Critical / Emergency',
      shortLabel: 'Critical',
      icon: <AlertCircle size={14} />,
      color: 'text-[#ffb4ab]',
      activeBg: 'bg-[rgba(255,180,171,0.1)]',
      activeBorder: 'border-[#ffb4ab]',
    },
  ];

  return (
    <div
      className="min-h-screen text-[#e1e2ec]"
      style={{ background: 'linear-gradient(180deg, rgb(11,14,21) 0%, rgb(16,19,26) 100%)' }}
    >
      <div
        className="sticky top-0 z-50 h-16 flex items-center gap-3 px-4 sm:px-6 backdrop-blur-xl border-b border-[rgba(255,255,255,0.05)]"
        style={{ background: 'rgba(11,14,21,0.8)' }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(15,23,42,0.4)] border border-[rgba(255,255,255,0.1)] text-white text-sm backdrop-blur-md hover:bg-[rgba(255,255,255,0.08)] transition-colors shrink-0"
        >
          <ArrowLeft size={13} />
          Back
        </button>
        <h1 className="text-[#adc6ff] text-lg sm:text-2xl font-semibold truncate">Incident Report</h1>
      </div>

      <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
        {submitted && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ background: 'rgba(10,13,20,0.85)', backdropFilter: 'blur(6px)' }}
          >
            <div
              className="bg-[#1d2027] border border-[rgba(34,197,94,0.3)] rounded-2xl p-8 flex flex-col items-center gap-5 shadow-2xl"
              style={{
                animation: 'successPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
                maxWidth: '340px',
                width: '90%',
              }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.04) 70%)',
                  border: '2px solid rgba(34,197,94,0.4)',
                }}
              >
                <CheckCircle2 size={44} className="text-[#22c55e]" />
              </div>

              <div className="text-center">
                <h3 className="text-[#e1e2ec] text-xl font-bold">Laporan Terkirim!</h3>
                <p className="text-[#8c909f] text-sm mt-1">Laporan Anda berhasil disimpan ke Supabase.</p>
              </div>

              <div className="w-full space-y-2.5">
                {['Data laporan tersimpan', 'Koordinat lokasi dikonfirmasi', 'Bukti foto dikirim ke admin'].map((item, i) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg"
                    style={{
                      background: checklistItems[i] ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${checklistItems[i] ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.06)'}`,
                      transition: 'all 0.4s ease',
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: checklistItems[i] ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)',
                        border: `1.5px solid ${checklistItems[i] ? '#22c55e' : 'rgba(255,255,255,0.15)'}`,
                      }}
                    >
                      {checklistItems[i] && <CheckCircle2 size={12} className="text-[#22c55e]" />}
                    </div>
                    <span className="text-sm" style={{ color: checklistItems[i] ? '#e1e2ec' : '#8c909f' }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-[#8c909f] text-xs">Mengalihkan ke halaman laporan...</p>
            </div>

            <style>{`
              @keyframes successPop {
                from { opacity: 0; transform: scale(0.85); }
                to { opacity: 1; transform: scale(1); }
              }
            `}</style>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[#1d2027] border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-[rgba(255,255,255,0.05)]">
              <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                <path
                  d="M14 2H6l-4 4v12h12V2zM6 2v4H2M9 8H5M11 12H5M11 16H5"
                  stroke="#ADC6FF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h2 className="text-[#e1e2ec] text-2xl font-semibold">Incident Details</h2>
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="block text-[#c2c6d6] text-xs uppercase tracking-widest font-semibold">
                  Report Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Banjir di Jalan Kemang Raya"
                  required
                  className="w-full bg-[#32353c] border border-[#424754] rounded-lg px-4 py-4 text-[#e1e2ec] placeholder-[#8c909f] text-base focus:outline-none focus:border-[rgba(173,198,255,0.5)] focus:ring-1 focus:ring-[rgba(173,198,255,0.2)] transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[#c2c6d6] text-xs uppercase tracking-widest font-semibold">
                  Detailed Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan kondisi, perkiraan tinggi air, akses jalan, dan bahaya yang terlihat..."
                  rows={5}
                  required
                  className="w-full bg-[#32353c] border border-[#424754] rounded-lg px-4 py-4 text-[#e1e2ec] placeholder-[#8c909f] text-base focus:outline-none focus:border-[rgba(173,198,255,0.5)] focus:ring-1 focus:ring-[rgba(173,198,255,0.2)] transition-colors resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[#c2c6d6] text-xs uppercase tracking-widest font-semibold">
                  Severity Level
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {severityOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSeverity(option.value)}
                      className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3 px-2 sm:px-3 rounded-lg border transition-all ${
                        severity === option.value
                          ? `${option.activeBg} ${option.activeBorder} ${option.color}`
                          : 'bg-[#32353c] border-[#424754] text-[#c2c6d6] hover:border-[rgba(255,255,255,0.2)]'
                      }`}
                    >
                      <span className={`shrink-0 ${severity === option.value ? option.color : 'text-[#8c909f]'}`}>
                        {option.icon}
                      </span>
                      <span className="text-xs sm:hidden font-medium leading-tight text-center">{option.shortLabel}</span>
                      <span className="hidden sm:inline text-sm whitespace-nowrap">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1d2027] border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.05)]">
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-[#adc6ff]" />
                <h2 className="text-[#e1e2ec] text-2xl font-semibold">Location & Coordination</h2>
              </div>
              <button
                type="button"
                onClick={handleUseCurrent}
                className="flex items-center gap-1.5 text-[#adc6ff] text-xs font-medium hover:opacity-80 transition-opacity"
              >
                USE CURRENT
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c909f]" />
                <input
                  type="text"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  placeholder="Nama jalan / area kejadian..."
                  className="w-full bg-[#32353c] border border-[#424754] rounded-lg pl-9 pr-4 py-3 text-[#e1e2ec] placeholder-[#8c909f] text-sm focus:outline-none focus:border-[rgba(173,198,255,0.5)] transition-colors"
                />
              </div>

              <div className="rounded-lg overflow-hidden h-[220px] relative">
                <MapContainer center={position} zoom={11} zoomControl={false} style={{ height: '100%', width: '100%', background: '#10131a' }}>
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution="&copy; CARTO" />
                  <LocationPicker position={position} onPositionChange={setPosition} />
                </MapContainer>

                <div className="absolute bottom-3 left-3 z-[999] flex items-center gap-1.5 bg-[rgba(16,19,26,0.85)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)] rounded-full px-3 py-1">
                  <span className="text-[#c2c6d6] text-xs font-mono">
                    {Math.abs(position[0]).toFixed(4)}° {position[0] < 0 ? 'S' : 'N'},{' '}
                    {Math.abs(position[1]).toFixed(4)}° {position[1] > 0 ? 'E' : 'W'}
                  </span>
                </div>
              </div>

              <p className="text-[#8c909f] text-xs">Klik pada peta untuk memilih lokasi kejadian.</p>
            </div>
          </div>

          <div className="bg-[#1d2027] border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-[rgba(255,255,255,0.05)]">
              <Upload size={16} className="text-[#adc6ff]" />
              <h2 className="text-[#e1e2ec] text-2xl font-semibold">Evidence Photo / Video</h2>
            </div>

            <div className="p-6 space-y-4">
              <label className="flex flex-col items-center justify-center gap-2 p-6 border border-dashed border-[#424754] rounded-xl bg-[#10131a] cursor-pointer hover:border-[rgba(173,198,255,0.45)] transition-colors">
                <Upload size={24} className="text-[#adc6ff]" />
                <span className="text-[#e1e2ec] text-sm font-semibold">Upload bukti foto/video</span>
                <span className="text-[#8c909f] text-xs">Maksimal 5 file. Bukti ini akan terlihat oleh admin saat verifikasi.</span>
                <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleFileChange} />
              </label>

              {previews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {previews.map((item, index) => (
                    <div key={`${item.file.name}-${index}`} className="relative rounded-lg overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[#10131a] aspect-video">
                      {item.file.type.startsWith('image/') ? (
                        <img src={item.url} alt={item.file.name} className="w-full h-full object-cover" />
                      ) : (
                        <video src={item.url} className="w-full h-full object-cover" />
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[rgba(0,0,0,0.65)] flex items-center justify-center text-white hover:bg-[rgba(239,68,68,0.9)]"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.08)] px-4 py-3 text-[#ffb4ab] text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3 rounded-xl border border-[#424754] text-[#e1e2ec] text-sm font-medium hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 rounded-xl bg-[#adc6ff] hover:bg-[#c7d9ff] disabled:opacity-50 disabled:cursor-not-allowed text-[#002e6a] text-sm font-semibold transition-colors shadow-[0px_0px_15px_rgba(173,198,255,0.3)]"
            >
              {submitting ? 'Mengirim...' : 'Kirim Laporan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
