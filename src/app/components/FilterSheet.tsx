import { useEffect } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';

export interface FilterState {
  categories: string[];
  urgency: string[];
  radius: string;
  waktu: string;
  validasi: string;
}

export const DEFAULT_FILTERS: FilterState = {
  categories: [],
  urgency: [],
  radius: '',
  waktu: '',
  validasi: '',
};

export const countActiveFilters = (f: FilterState) =>
  f.categories.length +
  f.urgency.length +
  (f.radius ? 1 : 0) +
  (f.waktu ? 1 : 0) +
  (f.validasi ? 1 : 0);

const CATEGORIES = [
  { value: 'BANJIR', label: 'Banjir' },
  { value: 'POHON TUMBANG', label: 'Pohon Tumbang' },
  { value: 'KECELAKAAN', label: 'Kecelakaan' },
  { value: 'KEBAKARAN', label: 'Kebakaran' },
];

const URGENCY = [
  { value: 'KRITIS', label: 'Kritis', color: '#ffdad6', bg: 'rgba(147,0,10,0.85)' },
  { value: 'SEDANG', label: 'Sedang', color: '#ffb786', bg: 'rgba(92,60,0,0.85)' },
  { value: 'RENDAH', label: 'Aman', color: '#7dd878', bg: 'rgba(0,33,5,0.85)' },
];

const RADIUS_OPTIONS = [
  { value: '1km', label: '≤ 1 km' },
  { value: '2km', label: '≤ 2 km' },
  { value: '5km', label: '5 km +' },
];

const WAKTU_OPTIONS = [
  { value: '30min', label: '30 menit lalu' },
  { value: '1hr', label: '1 jam lalu' },
  { value: '3hr', label: '3 jam lalu' },
  { value: '6hr', label: '6 jam lalu' },
];

const VALIDASI_OPTIONS = [
  { value: 'valid', label: 'Valid' },
  { value: 'tidak', label: 'Tidak Valid' },
];

interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (f: FilterState) => void;
}

export function FilterSheet({ open, onClose, filters, onChange }: FilterSheetProps) {
  const activeCount = countActiveFilters(filters);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const toggleMulti = (key: 'categories' | 'urgency', val: string) => {
    const arr = filters[key];
    onChange({
      ...filters,
      [key]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val],
    });
  };

  const toggleSingle = (key: 'radius' | 'waktu' | 'validasi', val: string) => {
    onChange({ ...filters, [key]: filters[key] === val ? '' : val });
  };

  const reset = () => onChange({ ...DEFAULT_FILTERS });

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-[60]"
        onClick={onClose}
      />

      {/* Sheet: slides up from bottom on mobile, centered modal on desktop */}
      <div className="fixed inset-x-0 bottom-0 z-[61] md:inset-0 md:flex md:items-center md:justify-center md:p-4">
        <div className="bg-[#1d2027] border border-[rgba(255,255,255,0.1)] rounded-t-2xl md:rounded-2xl w-full md:max-w-[480px] max-h-[88vh] flex flex-col shadow-2xl">

          {/* Drag handle – mobile only */}
          <div className="flex justify-center pt-3 pb-1 md:hidden">
            <div className="w-10 h-1 bg-[rgba(255,255,255,0.15)] rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={15} className="text-[#adc6ff]" />
              <h3 className="text-[#e1e2ec] font-semibold">Filter Laporan</h3>
              {activeCount > 0 && (
                <span className="bg-[#adc6ff] text-[#001d3d] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {activeCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-[#8c909f] hover:text-[#e1e2ec] p-1 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">

            {/* Kategori */}
            <div>
              <p className="text-[#8c909f] text-xs font-semibold uppercase tracking-widest mb-3">
                Kategori
              </p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const active = filters.categories.includes(cat.value);
                  return (
                    <button
                      key={cat.value}
                      onClick={() => toggleMulti('categories', cat.value)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                        active
                          ? 'bg-[rgba(173,198,255,0.15)] border-[#adc6ff] text-[#adc6ff]'
                          : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] text-[#c2c6d6] hover:border-[rgba(255,255,255,0.25)]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Urgensi */}
            <div>
              <p className="text-[#8c909f] text-xs font-semibold uppercase tracking-widest mb-3">
                Urgensi
              </p>
              <div className="flex flex-wrap gap-2">
                {URGENCY.map((u) => {
                  const active = filters.urgency.includes(u.value);
                  return (
                    <button
                      key={u.value}
                      onClick={() => toggleMulti('urgency', u.value)}
                      className="px-3 py-1.5 rounded-full text-sm border transition-all"
                      style={
                        active
                          ? { backgroundColor: u.bg, color: u.color, borderColor: 'transparent' }
                          : { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)', color: '#c2c6d6' }
                      }
                    >
                      {u.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lokasi (Radius) */}
            <div>
              <p className="text-[#8c909f] text-xs font-semibold uppercase tracking-widest mb-3">
                Lokasi (Radius)
              </p>
              <div className="flex flex-wrap gap-2">
                {RADIUS_OPTIONS.map((r) => {
                  const active = filters.radius === r.value;
                  return (
                    <button
                      key={r.value}
                      onClick={() => toggleSingle('radius', r.value)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                        active
                          ? 'bg-[rgba(173,198,255,0.15)] border-[#adc6ff] text-[#adc6ff]'
                          : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] text-[#c2c6d6] hover:border-[rgba(255,255,255,0.25)]'
                      }`}
                    >
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Waktu */}
            <div>
              <p className="text-[#8c909f] text-xs font-semibold uppercase tracking-widest mb-3">
                Waktu
              </p>
              <div className="flex flex-wrap gap-2">
                {WAKTU_OPTIONS.map((w) => {
                  const active = filters.waktu === w.value;
                  return (
                    <button
                      key={w.value}
                      onClick={() => toggleSingle('waktu', w.value)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                        active
                          ? 'bg-[rgba(173,198,255,0.15)] border-[#adc6ff] text-[#adc6ff]'
                          : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] text-[#c2c6d6] hover:border-[rgba(255,255,255,0.25)]'
                      }`}
                    >
                      {w.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status Validasi */}
            <div>
              <p className="text-[#8c909f] text-xs font-semibold uppercase tracking-widest mb-3">
                Status Validasi
              </p>
              <div className="flex flex-wrap gap-2">
                {VALIDASI_OPTIONS.map((v) => {
                  const active = filters.validasi === v.value;
                  return (
                    <button
                      key={v.value}
                      onClick={() => toggleSingle('validasi', v.value)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                        active
                          ? 'bg-[rgba(173,198,255,0.15)] border-[#adc6ff] text-[#adc6ff]'
                          : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] text-[#c2c6d6] hover:border-[rgba(255,255,255,0.25)]'
                      }`}
                    >
                      {v.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-[rgba(255,255,255,0.06)] flex gap-3">
            <button
              onClick={reset}
              className="flex-1 py-2.5 rounded-lg border border-[rgba(255,255,255,0.12)] text-[#c2c6d6] text-sm hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg bg-[#adc6ff] hover:bg-[#c7d9ff] text-[#002e6a] text-sm font-semibold transition-colors"
            >
              Terapkan
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
