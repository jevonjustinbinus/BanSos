import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  Loader2,
} from 'lucide-react';
import { ThemedTileLayer } from '../components/ThemedTileLayer';
import { useTheme } from '../context/ThemeContext';
import { MapContainer, CircleMarker, useMap, useMapEvents } from 'react-leaflet';
import { createReportWithMedia } from '../services/api';
import { supabase } from '../services/supabaseClient';

type LatLngTuple = [number, number];

type LocationResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  name?: string;
  type?: string;
};

type Severity = 'low' | 'medium' | 'critical';

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

async function createVideoThumbnail(videoFile: File): Promise<File | null> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const objectUrl = URL.createObjectURL(videoFile);

    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.src = objectUrl;

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
      video.removeAttribute('src');
      video.load();
    };

    video.onloadedmetadata = () => {
      const duration = video.duration;

      if (!Number.isFinite(duration) || duration <= 0) {
        cleanup();
        resolve(null);
        return;
      }

      video.currentTime = Math.min(1, duration / 2);
    };

    video.onseeked = () => {
      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');

      if (!ctx) {
        cleanup();
        resolve(null);
        return;
      }

      ctx.drawImage(video, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          cleanup();

          if (!blob) {
            resolve(null);
            return;
          }

          const thumbnailName =
            videoFile.name.replace(/\.[^/.]+$/, '') + '-thumbnail.jpg';

          const thumbnailFile = new File([blob], thumbnailName, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });

          resolve(thumbnailFile);
        },
        'image/jpeg',
        0.85,
      );
    };

    video.onerror = () => {
      cleanup();
      resolve(null);
    };
  });
}

async function prepareFilesWithVideoThumbnails(files: File[]): Promise<File[]> {
  const preparedFiles: File[] = [];

  for (const file of files) {
    if (file.type.startsWith('video/')) {
      const thumbnail = await createVideoThumbnail(file);

      if (thumbnail) {
        preparedFiles.push(thumbnail);
      }
    }

    preparedFiles.push(file);
  }

  return preparedFiles;
}

function LocationPicker({
  position,
  onPositionChange,
}: {
  position: LatLngTuple;
  onPositionChange: (pos: LatLngTuple) => void;
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

function FlyToSelected({ position }: { position: LatLngTuple }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, 15, {
      duration: 0.8,
    });
  }, [map, position]);

  return null;
}

function MapResizer() {
  const map = useMap();

  useEffect(() => {
    const resizeMap = () => {
      window.requestAnimationFrame(() => {
        map.invalidateSize({
          pan: false,
        });
      });
    };

    resizeMap();

    const timers = [
      window.setTimeout(resizeMap, 100),
      window.setTimeout(resizeMap, 300),
      window.setTimeout(resizeMap, 700),
    ];

    const mapContainer = map.getContainer();
    const parentContainer = mapContainer.parentElement;

    const observer = new ResizeObserver(() => {
      resizeMap();
    });

    observer.observe(mapContainer);

    if (parentContainer) {
      observer.observe(parentContainer);
    }

    window.addEventListener('resize', resizeMap);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      observer.disconnect();
      window.removeEventListener('resize', resizeMap);
    };
  }, [map]);

  return null;
}

export function CreateReportPage() {
  const { theme } = useTheme();
  const mapBackground = theme === 'light' ? '#eef2f7' : '#10131a';
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<Severity>('medium');
  const [position, setPosition] = useState<LatLngTuple>([-6.2088, 106.8456]);

  const [locationSearch, setLocationSearch] = useState('');
  const [suggestions, setSuggestions] = useState<LocationResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchAbortRef = useRef<AbortController | null>(null);
  const locationAlreadySelectedRef = useRef(false);
  const selectedQueryRef = useRef('');

  const [files, setFiles] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [checklistItems, setChecklistItems] = useState<boolean[]>([false, false, false]);

  const [fieldErrors, setFieldErrors] = useState<{
    title?: string;
    description?: string;
    locationSearch?: string;
    files?: string;
  }>({});

  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files],
  );

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  useEffect(() => {
    const query = locationSearch.trim();

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
          locationSearch.trim() !== query
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
  }, [locationSearch]);

  const selectLocation = (location: LocationResult) => {
    const selectedPosition: LatLngTuple = [Number(location.lat), Number(location.lon)];
    const name = shortLocationName(location);

    searchAbortRef.current?.abort();
    locationAlreadySelectedRef.current = true;
    selectedQueryRef.current = name;

    setLocationSearch(name);
    setPosition(selectedPosition);
    setSuggestions([]);
    setShowSuggestions(false);
    setSearching(false);
    setError('');
    setFieldErrors((prev) => ({
      ...prev,
      locationSearch: undefined,
    }));
  };

  const handleMapPositionChange = useCallback((pos: LatLngTuple) => {
    const name = `Titik dipilih (${formatCoordinate(pos[0])}, ${formatCoordinate(pos[1])})`;

    searchAbortRef.current?.abort();
    locationAlreadySelectedRef.current = true;
    selectedQueryRef.current = name;

    setPosition(pos);
    setLocationSearch(name);
    setSuggestions([]);
    setShowSuggestions(false);
    setSearching(false);
    setFieldErrors((prev) => ({
      ...prev,
      locationSearch: undefined,
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const errors: typeof fieldErrors = {};

    if (!title.trim()) errors.title = 'Judul laporan wajib diisi.';
    if (!description.trim()) errors.description = 'Deskripsi wajib diisi.';
    if (!locationSearch.trim()) errors.locationSearch = 'Nama lokasi / jalan wajib diisi.';
    if (files.length === 0) errors.files = 'Minimal 1 foto atau video bukti wajib diunggah.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setSubmitting(true);
    setChecklistItems([false, false, false]);

    try {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      const filesWithThumbnails = await prepareFilesWithVideoThumbnails(files);

      await createReportWithMedia(
        {
          title,
          description,
          category: 'BANJIR',
          severity,
          latitude: position[0],
          longitude: position[1],
          location_name: locationSearch || 'Lokasi dipilih dari peta',
          reporter_name: user?.user_metadata?.full_name ?? user?.email ?? 'User BanSos',
          user_id: user?.id,
        },
        filesWithThumbnails,
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
      (pos) => {
        const currentPosition: LatLngTuple = [pos.coords.latitude, pos.coords.longitude];
        const name = `Lokasi saya (${formatCoordinate(currentPosition[0])}, ${formatCoordinate(
          currentPosition[1],
        )})`;

        searchAbortRef.current?.abort();
        locationAlreadySelectedRef.current = true;
        selectedQueryRef.current = name;

        setPosition(currentPosition);
        setLocationSearch(name);
        setSuggestions([]);
        setShowSuggestions(false);
        setSearching(false);
        setFieldErrors((prev) => ({
          ...prev,
          locationSearch: undefined,
        }));
      },
      () => {
        const fallbackPosition: LatLngTuple = [-6.2088, 106.8456];
        const name = `Titik dipilih (${formatCoordinate(fallbackPosition[0])}, ${formatCoordinate(
          fallbackPosition[1],
        )})`;

        setPosition(fallbackPosition);
        setLocationSearch(name);
      },
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selected].slice(0, 5));
    e.target.value = '';
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
      color: 'text-[#4ade80]',
      activeBg: 'bg-[rgba(74,222,128,0.1)]',
      activeBorder: 'border-[#4ade80]',
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
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)]">
      <div
        className="sticky top-0 z-50 h-16 flex items-center gap-3 px-4 sm:px-6 backdrop-blur-sm border-b border-[rgba(255,255,255,0.5)]"
        style={{ background: 'rgba(240,240,240,0.5)' }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(15,23,42,0.4)] border border-[rgba(255,255,255,0.1)] text-white text-sm backdrop-blur-md hover:bg-[rgba(255,255,255,0.08)] transition-colors shrink-0"
        >
          <ArrowLeft size={13} />
          Back
        </button>

        <h1 className="text-[#4d7ff2] text-lg sm:text-2xl font-semibold truncate">
          Laporkan Kejadian
        </h1>
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
                  background:
                    'radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.04) 70%)',
                  border: '2px solid rgba(34,197,94,0.4)',
                }}
              >
                <CheckCircle2 size={44} className="text-[#22c55e]" />
              </div>

              <div className="text-center">
                <h3 className="text-[#e1e2ec] text-xl font-bold">Laporan Terkirim!</h3>
                <p className="text-[#8c909f] text-sm mt-1">
                  Laporan Anda berhasil disimpan ke Supabase.
                </p>
              </div>

              <div className="w-full space-y-2.5">
                {[
                  'Data laporan tersimpan',
                  'Koordinat lokasi dikonfirmasi',
                  'Bukti foto/video dikirim ke admin',
                ].map((item, i) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg"
                    style={{
                      background: checklistItems[i]
                        ? 'rgba(34,197,94,0.08)'
                        : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${
                        checklistItems[i] ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.06)'
                      }`,
                      transition: 'all 0.4s ease',
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: checklistItems[i]
                          ? 'rgba(34,197,94,0.2)'
                          : 'rgba(255,255,255,0.05)',
                        border: `1.5px solid ${
                          checklistItems[i] ? '#22c55e' : 'rgba(255,255,255,0.15)'
                        }`,
                      }}
                    >
                      {checklistItems[i] && <CheckCircle2 size={12} className="text-[#22c55e]" />}
                    </div>

                    <span
                      style={{ color: checklistItems[i] ? '#e1e2ec' : '#8c909f' }}
                      className="text-sm"
                    >
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

              <h2 className="text-[#e1e2ec] text-2xl font-semibold">Detail Kejadian</h2>
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="block text-[#c2c6d6] text-xs uppercase tracking-widest font-semibold">
                  Judul Laporan
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, title: undefined }));
                  }}
                  placeholder="e.g., Banjir di Halte Bus Pejompongan"
                  className={`w-full bg-[#32353c] border rounded-lg px-4 py-4 text-[#e1e2ec] placeholder-[#8c909f] text-base focus:outline-none focus:ring-1 transition-colors ${
                    fieldErrors.title
                      ? 'border-[#ef4444] focus:border-[#ef4444] focus:ring-[rgba(239,68,68,0.2)]'
                      : 'border-[#424754] focus:border-[rgba(173,198,255,0.5)] focus:ring-[rgba(173,198,255,0.2)]'
                  }`}
                />

                {fieldErrors.title && (
                  <p className="text-[#ef4444] text-xs mt-1">{fieldErrors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-[#c2c6d6] text-xs uppercase tracking-widest font-semibold">
                  Deskripsi
                </label>

                <textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, description: undefined }));
                  }}
                  placeholder="Jelaskan kondisi, perkiraan tinggi air, akses jalan, dan bahaya yang terlihat..."
                  rows={5}
                  className={`w-full bg-[#32353c] border rounded-lg px-4 py-4 text-[#e1e2ec] placeholder-[#8c909f] text-base focus:outline-none focus:ring-1 transition-colors resize-none ${
                    fieldErrors.description
                      ? 'border-[#ef4444] focus:border-[#ef4444] focus:ring-[rgba(239,68,68,0.2)]'
                      : 'border-[#424754] focus:border-[rgba(173,198,255,0.5)] focus:ring-[rgba(173,198,255,0.2)]'
                  }`}
                />

                {fieldErrors.description && (
                  <p className="text-[#ef4444] text-xs mt-1">{fieldErrors.description}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-[#c2c6d6] text-xs uppercase tracking-widest font-semibold">
                  Tingkat Keparahan
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
                          : `bg-[#32353c] border-[#424754] hover:border-[rgba(255,255,255,0.2)] ${option.color} opacity-60 hover:opacity-100`
                      }`}
                    >
                      <span className={`shrink-0 ${option.color} ${severity === option.value ? '' : 'opacity-70'}`}>
                        {option.icon}
                      </span>

                      <span className="text-xs sm:hidden font-medium leading-tight text-center">
                        {option.shortLabel}
                      </span>

                      <span className="hidden sm:inline text-sm whitespace-nowrap">
                        {option.label}
                      </span>
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
                <h2 className="text-[#e1e2ec] text-2xl font-semibold">Lokasi</h2>
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
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c909f] z-10" />

                <input
                  type="text"
                  value={locationSearch}
                  onChange={(e) => {
                    locationAlreadySelectedRef.current = false;
                    selectedQueryRef.current = '';

                    setLocationSearch(e.target.value);
                    setShowSuggestions(true);
                    setFieldErrors((prev) => ({ ...prev, locationSearch: undefined }));
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
                  placeholder="Nama jalan / area kejadian..."
                  className={`w-full bg-[#32353c] border rounded-lg pl-9 pr-10 py-3 text-[#e1e2ec] placeholder-[#8c909f] text-sm focus:outline-none transition-colors ${
                    fieldErrors.locationSearch
                      ? 'border-[#ef4444]'
                      : 'border-[#424754] focus:border-[rgba(173,198,255,0.5)]'
                  }`}
                />

                {searching && (
                  <Loader2
                    size={15}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#adc6ff] animate-spin"
                  />
                )}

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

                {fieldErrors.locationSearch && (
                  <p className="text-[#ef4444] text-xs mt-1 pl-1">
                    {fieldErrors.locationSearch}
                  </p>
                )}
              </div>

              <div className="rounded-lg overflow-hidden h-[220px] relative">
                <MapContainer
                  center={position}
                  zoom={11}
                  zoomControl={false}
                  style={{
                    height: '100%',
                    width: '100%',
                    background: mapBackground,
                  }}
                >
                  <MapResizer />
                  <FlyToSelected position={position} />
                  <ThemedTileLayer />
                  <LocationPicker position={position} onPositionChange={handleMapPositionChange} />
                </MapContainer>

                <div className="absolute bottom-3 left-3 z-[999] flex items-center gap-1.5 bg-[rgba(16,19,26,0.85)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)] rounded-full px-3 py-1">
                  <span className="text-[#c2c6d6] text-xs font-mono">
                    {Math.abs(position[0]).toFixed(4)}° {position[0] < 0 ? 'S' : 'N'},{' '}
                    {Math.abs(position[1]).toFixed(4)}° {position[1] > 0 ? 'E' : 'W'}
                  </span>
                </div>
              </div>

              <p className="text-[#8c909f] text-xs">
                Ketik lokasi untuk memilih dari dropdown, atau klik pada peta untuk memilih lokasi kejadian.
              </p>
            </div>
          </div>

          <div className="bg-[#1d2027] border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-[rgba(255,255,255,0.05)]">
              <Upload size={16} className="text-[#adc6ff]" />
              <h2 className="text-[#e1e2ec] text-2xl font-semibold">Bukti Foto / Video</h2>
            </div>

            <div className="p-6 space-y-4">
              <label
                className={`flex flex-col items-center justify-center gap-2 p-6 border border-dashed rounded-xl bg-[#10131a] cursor-pointer transition-colors ${
                  fieldErrors.files
                    ? 'border-[#ef4444]'
                    : 'border-[#424754] hover:border-[rgba(173,198,255,0.45)]'
                }`}
              >
                <Upload size={24} className={fieldErrors.files ? 'text-[#ef4444]' : 'text-[#adc6ff]'} />

                <span className="text-[#e1e2ec] text-sm font-semibold">
                  Upload bukti foto/video
                </span>

                <span className="text-[#8c909f] text-xs">
                  Maksimal 5 file. Jika upload video, thumbnail akan dibuat otomatis.
                </span>

                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    handleFileChange(e);
                    setFieldErrors((prev) => ({ ...prev, files: undefined }));
                  }}
                />
              </label>

              {fieldErrors.files && (
                <p className="text-[#ef4444] text-xs mt-1">{fieldErrors.files}</p>
              )}

              {previews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {previews.map((item, index) => (
                    <div
                      key={`${item.file.name}-${index}`}
                      className="relative rounded-lg overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[#10131a] aspect-video"
                    >
                      {item.file.type.startsWith('image/') ? (
                        <img
                          src={item.url}
                          alt={item.file.name}
                          className="w-full h-full object-cover"
                        />
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