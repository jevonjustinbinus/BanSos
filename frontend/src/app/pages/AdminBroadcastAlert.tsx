import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ThemedTileLayer } from '../components/ThemedTileLayer';
import { useTheme } from '../context/ThemeContext';
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  MapPin,
  Radio,
  RefreshCw,
  Search,
  Send,
} from 'lucide-react';
import {
  Circle,
  CircleMarker,
  MapContainer,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import { createBroadcast, fetchBroadcasts } from '../services/api';

type BroadcastHistory = {
  id?: string;
  title?: string;
  message?: string;
  severity?: string;
  target_location?: string;
  latitude?: number;
  longitude?: number;
  radius_m?: number;
  created_at?: string;
};

type LocationResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  name?: string;
  type?: string;
};

type LatLngTuple = [number, number];

const JAKARTA_CENTER: LatLngTuple = [-6.2, 106.816666];

function formatTime(value?: string) {
  if (!value) return '-';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function formatCoordinate(value: number) {
  return value.toFixed(6);
}

function shortLocationName(location: LocationResult) {
  const parts = location.display_name
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  return parts.slice(0, 4).join(', ');
}

const severityOptions = [
  {
    value: 'info',
    label: 'Info',
    className:
      'text-[#adc6ff] border-[rgba(173,198,255,0.25)] bg-[rgba(173,198,255,0.08)]',
  },
  {
    value: 'warning',
    label: 'Warning',
    className:
      'text-[#ffb786] border-[rgba(255,183,134,0.25)] bg-[rgba(255,183,134,0.08)]',
  },
  {
    value: 'critical',
    label: 'Critical',
    className:
      'text-[#ffb4ab] border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.08)]',
  },
  {
    value: 'resolved',
    label: 'Resolved',
    className:
      'text-[#22c55e] border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.08)]',
  },
];

function MapClickPicker({
  selectedPosition,
  radius,
  onSelect,
}: {
  selectedPosition: LatLngTuple | null;
  radius: number;
  onSelect: (position: LatLngTuple) => void;
}) {
  const map = useMapEvents({
    click(e) {
      onSelect([e.latlng.lat, e.latlng.lng]);
    },
  });

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      map.invalidateSize();
    }, 80);

    return () => window.clearTimeout(timeout);
  }, [map]);

  return selectedPosition ? (
    <>
      <Circle
        center={selectedPosition}
        radius={radius}
        pathOptions={{
          color: '#adc6ff',
          fillColor: '#adc6ff',
          fillOpacity: 0.16,
          weight: 2,
        }}
      />

      <CircleMarker
        center={selectedPosition}
        radius={8}
        pathOptions={{
          color: '#e1e2ec',
          fillColor: '#adc6ff',
          fillOpacity: 1,
          weight: 2,
        }}
      />
    </>
  ) : null;
}

function FlyToSelected({ position }: { position: LatLngTuple | null }) {
  const map = useMap();

  useEffect(() => {
    if (!position) return;

    map.flyTo(position, 15, { duration: 0.8 });
  }, [map, position]);

  return null;
}

export function BroadcastAlert() {
  const { theme } = useTheme();
  const mapBackground = theme === 'light' ? '#eef2f7' : '#10131a';
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('warning');

  const [searchQuery, setSearchQuery] = useState('');
  const [targetLocation, setTargetLocation] = useState('');
  const [targetPosition, setTargetPosition] = useState<LatLngTuple | null>(null);

  const [radius, setRadius] = useState(500);

  const [suggestions, setSuggestions] = useState<LocationResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [history, setHistory] = useState<BroadcastHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  /*
    Ref ini dipakai untuk mencegah dropdown muncul lagi
    setelah admin memilih salah satu lokasi.

    Masalah sebelumnya:
    - Admin klik lokasi.
    - searchQuery berubah.
    - Request search lama masih berjalan.
    - Response lama masuk lagi dan dropdown muncul lagi.

    Fix:
    - Semua request lama di-abort.
    - Saat lokasi sudah dipilih, query tersebut ditandai sebagai selected.
    - useEffect tidak akan fetch ulang untuk query yang sudah dipilih.
  */
  const searchAbortRef = useRef<AbortController | null>(null);
  const locationAlreadySelectedRef = useRef(false);
  const selectedQueryRef = useRef('');

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

  useEffect(() => {
    const query = searchQuery.trim();

    if (locationAlreadySelectedRef.current && query === selectedQueryRef.current) {
      searchAbortRef.current?.abort();
      setSuggestions([]);
      setShowSuggestions(false);
      setSearching(false);
      return;
    }

    if (query.length < 3) {
      searchAbortRef.current?.abort();
      setSuggestions([]);
      setShowSuggestions(false);
      setSearching(false);
      return;
    }

    searchAbortRef.current?.abort();

    const controller = new AbortController();
    searchAbortRef.current = controller;

    const timeout = window.setTimeout(async () => {
      setSearching(true);

      try {
        const params = new URLSearchParams({
          format: 'jsonv2',
          q: `${query}, Jakarta, Indonesia`,
          limit: '6',
          addressdetails: '1',
          countrycodes: 'id',
          'accept-language': 'id',
          viewbox: '106.68,-6.08,106.98,-6.38',
          bounded: '0',
        });

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?${params.toString()}`,
          {
            signal: controller.signal,
            headers: {
              Accept: 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error('Location search failed');
        }

        const data = (await response.json()) as LocationResult[];

        if (
          controller.signal.aborted ||
          locationAlreadySelectedRef.current ||
          searchQuery.trim() !== query
        ) {
          return;
        }

        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error(err);
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } finally {
        if (!controller.signal.aborted) {
          setSearching(false);
        }
      }
    }, 450);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [searchQuery]);

  const selectLocation = (location: LocationResult) => {
    const position: LatLngTuple = [Number(location.lat), Number(location.lon)];
    const name = shortLocationName(location);

    searchAbortRef.current?.abort();
    locationAlreadySelectedRef.current = true;
    selectedQueryRef.current = name;

    setSearchQuery(name);
    setTargetLocation(name);
    setTargetPosition(position);
    setSuggestions([]);
    setShowSuggestions(false);
    setSearching(false);
    setError('');
  };

  const selectMapPoint = (position: LatLngTuple) => {
    const name = `Titik dipilih (${formatCoordinate(position[0])}, ${formatCoordinate(
      position[1],
    )})`;

    searchAbortRef.current?.abort();
    locationAlreadySelectedRef.current = true;
    selectedQueryRef.current = name;

    setSearchQuery(name);
    setTargetLocation(name);
    setTargetPosition(position);
    setSuggestions([]);
    setShowSuggestions(false);
    setSearching(false);
    setError('');
  };

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();

    setSending(true);
    setSent(false);
    setError('');

    if (!targetPosition) {
      setSending(false);
      setError('Pilih target lokasi terlebih dahulu lewat search atau klik titik di map.');
      return;
    }

    try {
      await createBroadcast({
        title,
        message,
        severity,
        target_location: targetLocation || searchQuery,
        latitude: targetPosition[0],
        longitude: targetPosition[1],
        radius_m: radius,
      });

      await loadHistory();

      setTitle('');
      setMessage('');
      setSeverity('warning');
      setSearchQuery('');
      setTargetLocation('');
      setTargetPosition(null);
      setRadius(500);
      setSuggestions([]);
      setShowSuggestions(false);
      setSearching(false);

      searchAbortRef.current?.abort();
      locationAlreadySelectedRef.current = false;
      selectedQueryRef.current = '';

      setSent(true);

      window.setTimeout(() => {
        setSent(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      setError('Gagal mengirim broadcast. Pastikan backend dan Supabase aktif.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSend}
        className="bg-[#1d2027] border border-[rgba(255,255,255,0.06)] rounded-xl p-5 space-y-5"
      >
        <div className="flex items-center gap-2">
          <Radio size={16} className="text-[#adc6ff]" />
          <h3 className="text-[#e1e2ec] font-bold">Broadcast Alert ke User</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-[#8c909f] text-[10px] uppercase tracking-widest font-semibold">
              Judul Alert
            </label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Contoh: Peringatan Risiko Banjir"
              className="w-full bg-[#10131a] border border-[#424754] rounded-lg px-4 py-3 text-[#e1e2ec] placeholder-[#4a5060] text-sm focus:outline-none focus:border-[rgba(173,198,255,0.4)]"
            />
          </div>

          <div className="space-y-2 relative">
            <label className="block text-[#8c909f] text-[10px] uppercase tracking-widest font-semibold">
              Target Lokasi
            </label>

            <div className="relative">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6f7585]"
              />

              <input
                value={searchQuery}
                onChange={(e) => {
                  locationAlreadySelectedRef.current = false;
                  selectedQueryRef.current = '';

                  setSearchQuery(e.target.value);
                  setTargetLocation(e.target.value);
                  setTargetPosition(null);
                  setShowSuggestions(true);
                  setError('');
                }}
                onFocus={() => {
                  if (!locationAlreadySelectedRef.current && suggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                onBlur={() => {
                  window.setTimeout(() => {
                    setShowSuggestions(false);
                  }, 150);
                }}
                required
                placeholder="Cari lokasi... (contoh: Kemang, Manggarai, Tebet)"
                className="w-full bg-[#10131a] border border-[#424754] rounded-lg pl-11 pr-11 py-3 text-[#e1e2ec] placeholder-[#4a5060] text-sm focus:outline-none focus:border-[rgba(173,198,255,0.4)]"
              />

              {searching && (
                <Loader2
                  size={16}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#adc6ff] animate-spin"
                />
              )}
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-[9999] mt-2 w-full overflow-hidden rounded-xl border border-[#424754] bg-[#10131a] shadow-2xl">
                {suggestions.map((location) => (
                  <button
                    key={location.place_id}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectLocation(location)}
                    className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-[rgba(173,198,255,0.08)] border-b border-[rgba(255,255,255,0.05)] last:border-b-0 transition-colors"
                  >
                    <MapPin size={16} className="text-[#adc6ff] mt-0.5 shrink-0" />

                    <span>
                      <span className="block text-[#e1e2ec] text-sm font-semibold">
                        {location.name || shortLocationName(location)}
                      </span>

                      <span className="block text-[#8c909f] text-xs line-clamp-2">
                        {location.display_name}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[#8c909f] text-[10px] uppercase tracking-widest font-semibold">
            Map Picker & Radius
          </label>

          <div className="h-[260px] overflow-hidden rounded-xl border border-[var(--border-soft)] bg-[var(--bg-soft)] relative z-0">
            <MapContainer
              center={targetPosition || JAKARTA_CENTER}
              zoom={targetPosition ? 15 : 11}
              zoomControl={false}
              style={{
                height: '100%',
                width: '100%',
                background: mapBackground,
              }}
            >
              <ThemedTileLayer />

              <FlyToSelected position={targetPosition} />

              <MapClickPicker
                selectedPosition={targetPosition}
                radius={radius}
                onSelect={selectMapPoint}
              />
            </MapContainer>
          </div>

          <p className="text-[#8c909f] text-xs">
            Cari lokasi dari input, pilih hasil dropdown, atau klik langsung pada map untuk
            menentukan titik broadcast.
          </p>
        </div>

        {targetPosition && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#10131a] px-4 py-3">
              <p className="text-[#8c909f] uppercase tracking-widest text-[10px] font-semibold">
                Latitude
              </p>
              <p className="text-[#e1e2ec] mt-1">
                {formatCoordinate(targetPosition[0])}
              </p>
            </div>

            <div className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#10131a] px-4 py-3">
              <p className="text-[#8c909f] uppercase tracking-widest text-[10px] font-semibold">
                Longitude
              </p>
              <p className="text-[#e1e2ec] mt-1">
                {formatCoordinate(targetPosition[1])}
              </p>
            </div>

            <div className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#10131a] px-4 py-3">
              <p className="text-[#8c909f] uppercase tracking-widest text-[10px] font-semibold">
                Radius
              </p>
              <p className="text-[#e1e2ec] mt-1">
                {radius.toLocaleString('id-ID')} meter
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-[#8c909f] text-[10px] uppercase tracking-widest font-semibold">
            Severity
          </label>

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
          <label className="block text-[#8c909f] text-[10px] uppercase tracking-widest font-semibold">
            Pesan
          </label>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            required
            placeholder="Tulis isi pesan broadcast untuk user..."
            className="w-full bg-[#10131a] border border-[#424754] rounded-lg px-4 py-3 text-[#e1e2ec] placeholder-[#4a5060] text-sm focus:outline-none focus:border-[rgba(173,198,255,0.4)] resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-[#8c909f] text-[10px] uppercase tracking-widest font-semibold">
            Radius Broadcast: {radius.toLocaleString('id-ID')} meter
          </label>

          <input
            type="range"
            min={100}
            max={10000}
            step={100}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full"
          />

          <div className="flex justify-between text-[10px] text-[#6f7585]">
            <span>100 m</span>
            <span>10.000 m</span>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.25)] px-4 py-3 text-[#ffb4ab] text-sm flex items-start gap-2">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {sent && (
          <div className="rounded-lg bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.25)] px-4 py-3 text-[#22c55e] text-sm flex items-start gap-2">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            Broadcast tersimpan dan siap ditampilkan ke user.
          </div>
        )}

        <button
          type="submit"
          disabled={sending}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#adc6ff] hover:bg-[#c7d9ff] disabled:opacity-50 disabled:cursor-not-allowed text-[#002e6a] text-sm font-bold transition-colors"
        >
          <Send size={15} />
          {sending ? 'Mengirim...' : 'Send Broadcast'}
        </button>
      </form>

      <div className="bg-[#1d2027] border border-[rgba(255,255,255,0.06)] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#e1e2ec] font-bold">Riwayat Broadcast</h3>

          <button
            type="button"
            onClick={loadHistory}
            className="flex items-center gap-2 text-[#adc6ff] text-sm hover:underline"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-[#8c909f] text-sm">Mengambil riwayat broadcast...</p>
        ) : history.length === 0 ? (
          <p className="text-[#8c909f] text-sm">Belum ada broadcast.</p>
        ) : (
          <div className="space-y-3">
            {history.map((item, index) => (
              <div
                key={item.id || index}
                className="border border-[rgba(255,255,255,0.06)] rounded-lg p-4 bg-[#10131a]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[#e1e2ec] text-sm font-semibold">
                      {item.title}
                    </p>

                    <p className="text-[#8c909f] text-xs mt-1">
                      {item.target_location} •{' '}
                      {item.radius_m?.toLocaleString('id-ID') || '-'} m •{' '}
                      {formatTime(item.created_at)}
                    </p>
                  </div>

                  <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-[rgba(173,198,255,0.1)] text-[#adc6ff]">
                    {item.severity}
                  </span>
                </div>

                <p className="text-[#c2c6d6] text-sm mt-3 line-clamp-2">
                  {item.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}