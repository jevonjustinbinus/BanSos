import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Filter, Plus, MapPin, CheckCircle, X } from 'lucide-react';
import { reports } from '../data/reports';
import { FilterSheet, DEFAULT_FILTERS, countActiveFilters } from '../components/FilterSheet';
import type { FilterState } from '../components/FilterSheet';
import imgFloodDisaster from '../../imports/IncidentReportsProfessionalDarkTheme-1-1/29b25b748125cb7259bcf974fb07992b480291cc.png';

const severityStyle: Record<string, string> = {
  KRITIS: 'bg-[#93000a] text-[#ffdad6]',
  SEDANG: 'bg-[#5c3c00] text-[#ffb786]',
  RENDAH: 'bg-[#002105] text-[#7dd878]',
};

const categoryStyle: Record<string, string> = {
  BANJIR: 'bg-[#1d2a44] text-[#adc6ff] border border-[rgba(173,198,255,0.2)]',
  'POHON TUMBANG': 'bg-[#2a2320] text-[#ffb786] border border-[rgba(255,183,134,0.2)]',
  INFRASTRUKTUR: 'bg-[#2a2320] text-[#ffb786] border border-[rgba(255,183,134,0.2)]',
  GENANGAN: 'bg-[#1a2a1a] text-[#7dd878] border border-[rgba(125,216,120,0.2)]',
  KECELAKAAN: 'bg-[#2a1d2a] text-[#d0a0ff] border border-[rgba(208,160,255,0.2)]',
  KEBAKARAN: 'bg-[#2a1a1a] text-[#ff8a65] border border-[rgba(255,138,101,0.2)]',
};

const CHIP_LABEL: Record<string, string> = {
  BANJIR: 'Banjir', 'POHON TUMBANG': 'Pohon Tumbang', KECELAKAAN: 'Kecelakaan',
  KEBAKARAN: 'Kebakaran', KRITIS: 'Kritis', SEDANG: 'Sedang', RENDAH: 'Aman',
  '1km': '≤ 1 km', '2km': '≤ 2 km', '5km': '5 km +',
  '30min': '30 menit lalu', '1hr': '1 jam lalu', '3hr': '3 jam lalu', '6hr': '6 jam lalu',
  valid: 'Valid', tidak: 'Tidak Valid',
};

const getKm = (r: string) => parseFloat(r.replace(/[^0-9.]/g, '')) || 0;

const WAKTU_MINS: Record<string, number> = {
  '30min': 30, '1hr': 60, '3hr': 180, '6hr': 360,
};

export function IncidentReportsPage() {
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const activeCount = countActiveFilters(filters);

  const filteredReports = reports.filter((report) => {
    if (filters.categories.length > 0 && !filters.categories.includes(report.category)) return false;
    if (filters.urgency.length > 0 && !filters.urgency.includes(report.severity)) return false;
    if (filters.radius) {
      const km = getKm(report.radius);
      if (filters.radius === '1km' && km > 1) return false;
      if (filters.radius === '2km' && km > 2) return false;
      // '5km' means 5km+ – show only reports with radius >= 5km (or treat as "show all beyond 5km")
      // Here we interpret it as: show reports with radius >= 5km
      if (filters.radius === '5km' && km < 5) return false;
    }
    if (filters.waktu) {
      const maxMins = WAKTU_MINS[filters.waktu] ?? 9999;
      if (report.minutesAgo > maxMins) return false;
    }
    if (filters.validasi === 'valid' && !report.validated) return false;
    if (filters.validasi === 'tidak' && report.validated) return false;
    return true;
  });

  // Build active filter chips list
  const activeChips: { key: string; label: string }[] = [
    ...filters.categories.map((v) => ({ key: `cat-${v}`, label: CHIP_LABEL[v] ?? v })),
    ...filters.urgency.map((v) => ({ key: `urg-${v}`, label: CHIP_LABEL[v] ?? v })),
    ...(filters.radius ? [{ key: 'radius', label: CHIP_LABEL[filters.radius] }] : []),
    ...(filters.waktu ? [{ key: 'waktu', label: CHIP_LABEL[filters.waktu] }] : []),
    ...(filters.validasi ? [{ key: 'validasi', label: CHIP_LABEL[filters.validasi] }] : []),
  ];

  const removeChip = (key: string) => {
    if (key.startsWith('cat-')) {
      const v = key.replace('cat-', '');
      setFilters((f) => ({ ...f, categories: f.categories.filter((c) => c !== v) }));
    } else if (key.startsWith('urg-')) {
      const v = key.replace('urg-', '');
      setFilters((f) => ({ ...f, urgency: f.urgency.filter((u) => u !== v) }));
    } else if (key === 'radius') setFilters((f) => ({ ...f, radius: '' }));
    else if (key === 'waktu') setFilters((f) => ({ ...f, waktu: '' }));
    else if (key === 'validasi') setFilters((f) => ({ ...f, validasi: '' }));
  };

  return (
    <div className="p-4 lg:p-6 text-[#e1e2ec]">
      {/* Header — title + buttons on one row, description below */}
      <div className="space-y-2 mb-5">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-[#e1e2ec] text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight">
            Community Report
          </h1>
          <div className="flex items-center gap-2 shrink-0">
            {/* Filter button */}
            <button
              onClick={() => setFilterOpen(true)}
              className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg bg-[rgba(29,32,39,0.8)] border border-[rgba(255,255,255,0.1)] text-[#e1e2ec] text-sm backdrop-blur-sm hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              <Filter size={13} className="text-[#60a5fa] shrink-0" />
              <span className="hidden sm:inline">Filter</span>
              {activeCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#adc6ff] text-[#001d3d] text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                  {activeCount}
                </span>
              )}
            </button>

            {/* Create report */}
            <button
              onClick={() => navigate('/dashboard/reports/create')}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg bg-[#60a5fa] hover:bg-[#3b82f6] text-[#001d3d] text-sm font-semibold transition-colors"
            >
              <Plus size={13} />
              <span className="hidden sm:inline">Report</span>
            </button>
          </div>
        </div>

        {/* Description — full width below both title and buttons */}
        <p className="text-[#c2c6d6] text-sm sm:text-base">
          Data lapangan real-time dari warga sekitar Anda
        </p>
      </div>

      {/* Active filter chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeChips.map((chip) => (
            <span
              key={chip.key}
              className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-[rgba(173,198,255,0.1)] border border-[rgba(173,198,255,0.25)] rounded-full text-[#adc6ff] text-xs"
            >
              {chip.label}
              <button
                onClick={() => removeChip(chip.key)}
                className="hover:bg-[rgba(173,198,255,0.2)] rounded-full p-0.5 transition-colors"
              >
                <X size={10} />
              </button>
            </span>
          ))}
          <button
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="text-[#8c909f] text-xs hover:text-[#e1e2ec] transition-colors underline"
          >
            Reset semua
          </button>
        </div>
      )}

      {/* Empty state */}
      {filteredReports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center">
            <Filter size={20} className="text-[#8c909f]" />
          </div>
          <p className="text-[#c2c6d6]">Tidak ada laporan yang sesuai filter.</p>
          <button
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="text-[#adc6ff] text-sm hover:underline transition-colors"
          >
            Reset filter
          </button>
        </div>
      ) : (
        /* Reports Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-[#1d2027] border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden cursor-pointer hover:border-[rgba(173,198,255,0.25)] hover:bg-[rgba(29,32,39,0.8)] transition-all"
              onClick={() => navigate(`/dashboard/reports/${report.id}`)}
            >
              <div className="p-4 lg:p-5">
                {/* Badges */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-md uppercase whitespace-nowrap ${severityStyle[report.severity]}`}
                  >
                    {report.severity}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-md uppercase truncate max-w-[130px] sm:max-w-none ${
                      categoryStyle[report.category] ||
                      'bg-[#2a2d36] text-[#c2c6d6] border border-[rgba(255,255,255,0.1)]'
                    }`}
                  >
                    {report.category}
                  </span>
                  {report.validated && (
                    <span className="flex items-center gap-1 text-[10px] font-medium text-[#7dd878] bg-[rgba(125,216,120,0.1)] border border-[rgba(125,216,120,0.2)] px-1.5 py-0.5 rounded-full whitespace-nowrap">
                      <CheckCircle size={9} /> Valid
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-[#e1e2ec] text-base lg:text-lg font-semibold mb-2">
                  {report.title}
                </h3>

                {/* Description */}
                <p className="text-[#c2c6d6] text-sm line-clamp-2">{report.description}</p>

                {/* Report thumbnail */}
                <div className="mt-3 h-24 lg:h-28 rounded-lg overflow-hidden bg-[#2a2d36]">
                  <img
                    src={imgFloodDisaster}
                    alt=""
                    className="w-full h-full object-cover opacity-60"
                  />
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {report.tags.map((tag) => (
                    <span key={tag} className="text-xs text-[#60a5fa]">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[rgba(255,255,255,0.06)]">
                  <div className="flex items-center gap-1.5 min-w-0 mr-2">
                    <MapPin size={11} className="text-[#8c909f] shrink-0" />
                    <span className="text-[#8c909f] text-xs truncate">{report.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <CheckCircle size={11} className="text-[#adc6ff]" />
                    <span className="text-[#adc6ff] text-xs font-medium">
                      {report.confirmations} konfirmasi
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filter Sheet */}
      <FilterSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onChange={setFilters}
      />

      {/* Floating Report Button — fixed bottom-right */}
      <button
        onClick={() => navigate('/dashboard/reports/create')}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 bg-[#60a5fa] hover:bg-[#3b82f6] text-[#001d3d] font-semibold text-sm rounded-full shadow-[0_4px_24px_rgba(96,165,250,0.35)] transition-colors"
      >
        <Plus size={16} />
        Report
      </button>
    </div>
  );
}