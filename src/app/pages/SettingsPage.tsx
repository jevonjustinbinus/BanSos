import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../services/supabaseClient';
import {
  fetchReports,
  fetchSavedLocations,
  createSavedLocation,
  updateSavedLocation,
  deleteSavedLocation,
  type SavedLocation as APISavedLocation,
<<<<<<< HEAD
} from '../services/api';
=======
  type CommunityReport,
} from '../services/api';

import {
  DEFAULT_LAT,
  DEFAULT_LNG,
  getSessionLocation,
} from '../services/primaryLocation';

>>>>>>> commit2-update
import { ChevronRight, Plus, Trash2, MapPin, Bell, Shield, Database, Edit3, BarChart2, X, FileText } from 'lucide-react';
import imgProfilePicture from '../../imports/ProfileProfessionalDarkTheme-2/05bf566309a931f21d624caab9298ae2c690b994.png';
import imgMapView from '../../imports/ProfileProfessionalDarkTheme-2/95a1e6ef9cc5afd696639f1af1a49888c9223daf.png';

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

type SavedLocation = APISavedLocation;

<<<<<<< HEAD
=======
const DEFAULT_REPORT_RADIUS_KM = 5;

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const earthRadiusKm = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

function countNearbyReports(
  reports: CommunityReport[],
  lat: number,
  lng: number,
  radiusKm: number,
) {
  return reports.filter((report) => {
    if (report.status !== 'approved') return false;

    if (
      typeof report.latitude !== 'number' ||
      typeof report.longitude !== 'number'
    ) {
      return false;
    }

    const distance = distanceKm(
      lat,
      lng,
      report.latitude,
      report.longitude,
    );

    return distance <= radiusKm;
  }).length;
}

>>>>>>> commit2-update
export function SettingsPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [joinedYear, setJoinedYear] = useState('');
  const [totalReports, setTotalReports] = useState<number | null>(null);
  const [userId, setUserId] = useState('');
  const [locations, setLocations] = useState<SavedLocation[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;

      const uid = data.user.id;
<<<<<<< HEAD
=======

>>>>>>> commit2-update
      setUserId(uid);
      setUserName(data.user.user_metadata?.full_name ?? data.user.email ?? '');
      setUserEmail(data.user.email ?? '');
      setJoinedYear(new Date(data.user.created_at).getFullYear().toString());

      try {
        const [locResult, reportResult] = await Promise.allSettled([
          fetchSavedLocations(uid),
<<<<<<< HEAD
          fetchReports(),
        ]);
        if (locResult.status === 'fulfilled') setLocations(locResult.value.data);
        setTotalReports(reportResult.status === 'fulfilled' ? reportResult.value.data.length : 0);
      } catch {
=======
          fetchReports('approved'),
        ]);

        const savedLocations =
          locResult.status === 'fulfilled' ? locResult.value.data : [];

        const reports =
          reportResult.status === 'fulfilled' ? reportResult.value.data : [];

        setLocations(savedLocations);

        const sessionLocation = getSessionLocation();

        const primarySavedLocation = savedLocations.find(
          (loc) =>
            typeof loc.latitude === 'number' &&
            typeof loc.longitude === 'number',
        );

        const activeLocation = sessionLocation
          ? {
              lat: sessionLocation.lat,
              lng: sessionLocation.lng,
              radiusKm: primarySavedLocation?.radius ?? DEFAULT_REPORT_RADIUS_KM,
            }
          : primarySavedLocation
            ? {
                lat: primarySavedLocation.latitude as number,
                lng: primarySavedLocation.longitude as number,
                radiusKm: primarySavedLocation.radius ?? DEFAULT_REPORT_RADIUS_KM,
              }
            : {
                lat: DEFAULT_LAT,
                lng: DEFAULT_LNG,
                radiusKm: DEFAULT_REPORT_RADIUS_KM,
              };

        const nearbyTotal = countNearbyReports(
          reports,
          activeLocation.lat,
          activeLocation.lng,
          activeLocation.radiusKm,
        );

        setTotalReports(nearbyTotal);
      } catch (error) {
        console.error('Gagal mengambil data settings:', error);
>>>>>>> commit2-update
        setTotalReports(0);
      } finally {
        setLocationsLoading(false);
      }
    });
  }, []);

  // ── Add Location modal ──────────────────────────────────────
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newLat, setNewLat] = useState<number | null>(null);
  const [newLng, setNewLng] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState<'clear' | 'alert'>('clear');
  const [newRadius, setNewRadius] = useState(3);
  const [addressSuggestions, setAddressSuggestions] = useState<NominatimResult[]>([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestionBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionBoxRef.current && !suggestionBoxRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddressChange = (value: string) => {
    setNewAddress(value);
    setNewLat(null);
    setNewLng(null);
    setShowSuggestions(false);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length < 3) {
      setAddressSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setAddressLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&addressdetails=1&limit=6&countrycodes=id`,
          { headers: { 'Accept-Language': 'id' } }
        );
        const data: NominatimResult[] = await res.json();
        setAddressSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch {
        setAddressSuggestions([]);
      } finally {
        setAddressLoading(false);
      }
    }, 400);
  };

  const handleSelectSuggestion = (suggestion: NominatimResult) => {
    setNewAddress(suggestion.display_name);
    setNewLat(parseFloat(suggestion.lat));
    setNewLng(parseFloat(suggestion.lon));
    setAddressSuggestions([]);
    setShowSuggestions(false);
  };

  const openAddModal = () => {
    setNewName('');
    setNewAddress('');
    setNewLat(null);
    setNewLng(null);
    setNewStatus('clear');
    setNewRadius(3);
    setAddressSuggestions([]);
    setShowSuggestions(false);
    setLocationError('');
    setShowAddModal(true);
  };

  const [addingLocation, setAddingLocation] = useState(false);

  const handleAddLocation = async () => {
    if (!newName.trim() || !newAddress.trim() || !userId) return;
    setAddingLocation(true);
    setLocationError('');
    try {
      const result = await createSavedLocation({
        user_id: userId,
        name: newName.trim(),
        address: newAddress.trim(),
        latitude: newLat,
        longitude: newLng,
        status: newStatus,
        radius: newRadius,
      });
      setLocations((prev) => [...prev, result.data]);
      setShowAddModal(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[AddLocation]', msg);
      setLocationError(msg || 'Gagal menyimpan lokasi.');
    } finally {
      setAddingLocation(false);
    }
  };

  // ── Edit Radius modal ───────────────────────────────────────
  const [editingLocation, setEditingLocation] = useState<SavedLocation | null>(null);
  const [editRadius, setEditRadius] = useState(3);

  const openEditRadius = (loc: SavedLocation) => {
    setEditingLocation(loc);
    setEditRadius(loc.radius);
  };

  const [savingRadius, setSavingRadius] = useState(false);

  const handleSaveRadius = async () => {
    if (!editingLocation) return;
    setSavingRadius(true);
    try {
      await updateSavedLocation(editingLocation.id, { radius: editRadius });
      setLocations((prev) =>
        prev.map((l) => (l.id === editingLocation.id ? { ...l, radius: editRadius } : l))
      );
      setEditingLocation(null);
    } catch {
      setLocationError('Gagal memperbarui radius. Coba lagi.');
    } finally {
      setSavingRadius(false);
    }
  };

  const removeLocation = async (id: string) => {
    setLocations((prev) => prev.filter((l) => l.id !== id));
    try {
      await deleteSavedLocation(id);
    } catch {
      const result = await fetchSavedLocations(userId).catch(() => null);
      if (result) setLocations(result.data);
    }
  };

  const settingsRows = [
    {
      icon: <Bell size={20} className="text-[#94a3b8]" />,
      title: 'Notification Preferences',
      desc: 'Manage critical alert channels and frequency.',
    },
    {
      icon: <Shield size={20} className="text-[#94a3b8]" />,
      title: 'Privacy & Security',
      desc: 'Two-factor authentication and biometric locks.',
    },
    {
      icon: <Database size={20} className="text-[#94a3b8]" />,
      title: 'Data Management',
      desc: 'Clear local cache and export mission logs.',
    },
  ];

  return (
    <div className="p-4 lg:p-6 text-[#e1e2ec] space-y-6">
      {/* Profile Header Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {/* User Info Card — spans 2 cols */}
        <div className="md:col-span-2 bg-[#191b23] border border-[#e1e2ec]/20 rounded-xl overflow-hidden relative shadow-[0px_4px_12px_0px_rgba(9,30,66,0.08)]">
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,82,204,0.1)] to-transparent pointer-events-none" />
          <div className="relative flex items-center gap-4 lg:gap-6 p-5 lg:p-6">
            <div className="relative shrink-0">
              <div className="size-16 lg:size-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                <img src={imgProfilePicture} alt={userName} className="size-full object-cover" />
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full flex items-center justify-center border border-[#e1e2ec] shadow-sm hover:bg-gray-100 transition-colors">
                <Edit3 size={11} className="text-gray-700" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[#e1e2ec] text-2xl lg:text-[32px] font-semibold tracking-tight">{userName || '...'}</h2>
              <p className="text-[#e1e2ec] text-sm lg:text-base mt-0.5">{userEmail}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="flex items-center gap-1.5 bg-[rgba(130,249,190,0.2)] text-[#00734c] text-xs font-medium px-3 py-1 rounded-full">
                  <svg width="11" height="11" viewBox="0 0 13 12" fill="none">
                    <path d="M4.43333 12.25L3.325 10.3833L1.225 9.91667L1.42917 7.75833L0 6.125L1.42917 4.49167L1.225 2.33333L3.325 1.86667L4.43333 0L6.41667 0.845833L8.4 0L9.50833 1.86667L11.6083 2.33333L11.4042 4.49167L12.8333 6.125L11.4042 7.75833L11.6083 9.91667L9.50833 10.3833L8.4 12.25L6.41667 11.4042L4.43333 12.25ZM5.80417 8.19583L9.1 4.9L8.28333 4.05417L5.80417 6.53333L4.55 5.30833L3.73333 6.125L5.80417 8.19583Z" fill="#00734C"/>
                  </svg>
                  Verified Responder
                </span>
                <span className="bg-[#e7e7f2] text-black text-xs font-medium px-3 py-1 rounded-full">
                  {joinedYear ? `Joined ${joinedYear}` : '...'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats/Actions Card */}
        <div className="bg-[#191b23] border border-[#e1e2ec]/20 rounded-xl shadow-[0px_4px_6px_rgba(9,30,66,0.08)]">
          <div className="flex flex-col gap-4 p-5 lg:p-6 h-full justify-center">
            <div className="flex items-center justify-between">
              <div>
<<<<<<< HEAD
                <p className="text-[#e1e2ec] text-xs uppercase tracking-widest font-medium">TOTAL REPORTS</p>
=======
                <p className="text-[#e1e2ec] text-xs uppercase tracking-widest font-medium">Laporan Sekitar</p>
>>>>>>> commit2-update
                <p className="text-[#003d9b] text-2xl font-semibold mt-1">
                  {totalReports === null ? '...' : totalReports}
                </p>
              </div>
              <BarChart2 size={28} className="text-[#e1e2ec] opacity-80" />
            </div>
            <div className="h-px bg-[#e1e2ec]/30" />
            {/* View Reports button */}
            <button
              onClick={() => navigate('/dashboard/reports')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#e1e2ec] hover:bg-[#c5c8d6] text-[#191b23] text-sm font-semibold transition-colors"
            >
              <FileText size={14} />
              View Reports
            </button>
          </div>
        </div>
      </div>

      {/* Saved Locations */}
      <div>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-[#e1e2ec] text-xl lg:text-2xl font-semibold">Saved Locations</h3>
            <p className="text-[#e1e2ec] text-sm mt-0.5 opacity-70">Manage areas you are currently monitoring for alerts.</p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3 lg:px-4 py-2 rounded-lg bg-[#ef4444] hover:bg-[#dc2626] text-white text-sm font-medium transition-colors shrink-0 ml-3"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Add Location</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {locationsLoading && (
            <div className="col-span-full py-8 text-center text-[#8c909f] text-sm">
              Memuat lokasi tersimpan...
            </div>
          )}
          {!locationsLoading && locations.map((loc) => (
            <div
              key={loc.id}
              className="bg-[#1d2027] border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden"
            >
              {/* Map preview */}
              <div className="relative h-32 overflow-hidden bg-[#2a2d36]">
                <img src={imgMapView} alt="" className="w-full h-full object-cover opacity-70" />
                <div className="absolute top-3 right-3">
                  <span
                    className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                      loc.status === 'clear' ? 'bg-black/50 text-green-400' : 'bg-black/50 text-red-400'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${loc.status === 'clear' ? 'bg-green-400' : 'bg-red-400'}`} />
                    {loc.status === 'clear' ? 'Clear' : 'Alert'}
                  </span>
                </div>
                {/* Radius badge */}
                <div className="absolute bottom-2 left-3">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/60 text-[#adc6ff]">
                    {loc.radius} km radius
                  </span>
                </div>
              </div>
              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#94a3b8] shrink-0" />
                    <p className="text-[#e1e2ec] text-sm font-medium">{loc.name}</p>
                  </div>
                  <button
                    onClick={() => removeLocation(loc.id)}
                    className="text-[#94a3b8] hover:text-red-400 transition-colors p-0.5 shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="text-[#8c909f] text-xs mb-3">{loc.address}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditRadius(loc)}
                    className="flex-1 py-1.5 rounded-lg border border-[rgba(255,255,255,0.15)] text-[#e1e2ec] text-xs font-medium hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                  >
                    Edit Radius
                  </button>
                  <button
                    onClick={() => navigate('/dashboard/map')}
                    className="flex-1 py-1.5 rounded-lg border border-[rgba(255,255,255,0.15)] text-[#e1e2ec] text-xs font-medium hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                  >
                    View Map
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Location card */}
          {!locationsLoading && (
            <button
              onClick={openAddModal}
              className="bg-[#1d2027] border-2 border-dashed border-[rgba(255,255,255,0.15)] rounded-xl flex flex-col items-center justify-center gap-2 p-8 hover:border-[rgba(173,198,255,0.3)] hover:bg-[rgba(173,198,255,0.03)] transition-all min-h-[180px]"
            >
              <div className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.06)] flex items-center justify-center">
                <Plus size={18} className="text-[#94a3b8]" />
              </div>
              <div className="text-center">
                <p className="text-[#e1e2ec] text-sm font-medium">Add New Location</p>
                <p className="text-[#8c909f] text-xs mt-0.5">Monitor a new area</p>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Settings Rows */}
      <div className="bg-[#1d2027] border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden">
        {settingsRows.map((row, i) => (
          <button
            key={row.title}
            onClick={() => {}}
            className={`w-full flex items-center justify-between px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-colors text-left ${
              i < settingsRows.length - 1 ? 'border-b border-[rgba(255,255,255,0.06)]' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center shrink-0">
                {row.icon}
              </div>
              <div>
                <p className="text-[#e1e2ec] text-sm font-medium">{row.title}</p>
                <p className="text-[#8c909f] text-xs mt-0.5">{row.desc}</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-[#8c909f] shrink-0" />
          </button>
        ))}
      </div>

      {/* ── Add Location Modal ─────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-md bg-[#1d2027] border border-[rgba(255,255,255,0.1)] rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.07)]">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[#adc6ff]" />
                <h3 className="text-[#e1e2ec] font-semibold">Add New Location</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-[#8c909f] hover:text-[#e1e2ec] transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-5 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-[#8c909f] text-xs font-medium mb-1.5 uppercase tracking-wide">Location Name</label>
                <input
                  type="text"
                  placeholder="e.g. Home, Office, School..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2.5 text-[#e1e2ec] text-sm placeholder-[#8c909f] focus:outline-none focus:border-[rgba(173,198,255,0.4)] transition-colors"
                />
              </div>

              {/* Address */}
              <div className="relative" ref={suggestionBoxRef}>
                <label className="block text-[#8c909f] text-xs font-medium mb-1.5 uppercase tracking-wide">Address</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Jl. Kebon Jeruk No. 12, Jakarta"
                    value={newAddress}
                    onChange={(e) => handleAddressChange(e.target.value)}
                    onFocus={() => addressSuggestions.length > 0 && setShowSuggestions(true)}
                    autoComplete="off"
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2.5 pr-9 text-[#e1e2ec] text-sm placeholder-[#8c909f] focus:outline-none focus:border-[rgba(173,198,255,0.4)] transition-colors"
                  />
                  {addressLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg className="animate-spin h-4 w-4 text-[#8c909f]" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    </div>
                  )}
                </div>

                {newLat !== null && newLng !== null && (
                  <p className="mt-1.5 text-[10px] text-[#4ade80] flex items-center gap-1">
                    <MapPin size={10} />
                    Koordinat: {newLat.toFixed(5)}, {newLng.toFixed(5)}
                  </p>
                )}
                {newAddress.trim() && newLat === null && !addressLoading && (
                  <p className="mt-1.5 text-[10px] text-[#ffb786]">
                    Pilih alamat dari dropdown agar koordinat tersimpan
                  </p>
                )}

                {showSuggestions && addressSuggestions.length > 0 && (
                  <ul className="absolute z-[3000] left-0 right-0 mt-1 bg-[#252830] border border-[rgba(255,255,255,0.12)] rounded-xl overflow-hidden shadow-2xl max-h-52 overflow-y-auto">
                    {addressSuggestions.map((s) => (
                      <li key={s.place_id}>
                        <button
                          type="button"
                          onMouseDown={(e) => { e.preventDefault(); handleSelectSuggestion(s); }}
                          className="w-full flex items-start gap-2.5 px-4 py-2.5 text-left hover:bg-[rgba(173,198,255,0.08)] transition-colors border-b border-[rgba(255,255,255,0.05)] last:border-0"
                        >
                          <MapPin size={13} className="text-[#adc6ff] shrink-0 mt-0.5" />
                          <span className="text-[#e1e2ec] text-xs leading-relaxed line-clamp-2">{s.display_name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Monitoring Radius */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[#8c909f] text-xs font-medium uppercase tracking-wide">Monitoring Radius</label>
                  <span className="text-[#adc6ff] text-sm font-semibold">{newRadius} km</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={15}
                  step={1}
                  value={newRadius}
                  onChange={(e) => setNewRadius(Number(e.target.value))}
                  className="w-full accent-[#adc6ff] h-1.5 rounded-full cursor-pointer"
                />
                <div className="flex justify-between text-[#8c909f] text-[10px] mt-1">
                  <span>1 km</span>
                  <span>15 km</span>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-[#8c909f] text-xs font-medium mb-1.5 uppercase tracking-wide">Initial Status</label>
                <div className="flex gap-2">
                  {(['clear', 'alert'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setNewStatus(s)}
                      className={`flex-1 py-2 rounded-lg border text-xs font-medium capitalize transition-colors ${
                        newStatus === s
                          ? s === 'clear'
                            ? 'bg-green-500/15 border-green-500/50 text-green-400'
                            : 'bg-red-500/15 border-red-500/50 text-red-400'
                          : 'border-[rgba(255,255,255,0.1)] text-[#8c909f] hover:bg-[rgba(255,255,255,0.05)]'
                      }`}
                    >
                      <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${s === 'clear' ? 'bg-green-400' : 'bg-red-400'}`} />
                      {s === 'clear' ? 'Clear' : 'Alert'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Error */}
            {locationError && (
              <p className="px-5 pb-2 text-[#ffb4ab] text-xs">{locationError}</p>
            )}

            {/* Footer */}
            <div className="flex gap-3 px-5 pb-5">
              <button
                onClick={() => { setShowAddModal(false); setLocationError(''); }}
                className="flex-1 py-2.5 rounded-lg border border-[rgba(255,255,255,0.12)] text-[#e1e2ec] text-sm font-medium hover:bg-[rgba(255,255,255,0.05)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLocation}
                disabled={!newName.trim() || !newAddress.trim() || addingLocation}
                className="flex-1 py-2.5 rounded-lg bg-[#adc6ff] hover:bg-[#c7d9ff] text-[#002e6a] text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {addingLocation ? 'Menyimpan...' : 'Add Location'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Radius Modal ──────────────────────────────────── */}
      {editingLocation && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-sm bg-[#1d2027] border border-[rgba(255,255,255,0.1)] rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.07)]">
              <div className="flex items-center gap-2">
                <Edit3 size={15} className="text-[#adc6ff]" />
                <h3 className="text-[#e1e2ec] font-semibold">Edit Radius</h3>
              </div>
              <button onClick={() => setEditingLocation(null)} className="text-[#8c909f] hover:text-[#e1e2ec] transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-5 space-y-5">
              {/* Location name */}
              <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.04)] rounded-lg px-4 py-3">
                <MapPin size={14} className="text-[#adc6ff] shrink-0" />
                <div className="min-w-0">
                  <p className="text-[#e1e2ec] text-sm font-medium truncate">{editingLocation.name}</p>
                  <p className="text-[#8c909f] text-xs truncate">{editingLocation.address}</p>
                </div>
              </div>

              {/* Radius slider */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[#8c909f] text-xs font-medium uppercase tracking-wide">Monitoring Radius</p>
                  <span className="text-[#adc6ff] text-xl font-bold">{editRadius} km</span>
                </div>

                <input
                  type="range"
                  min={1}
                  max={15}
                  step={1}
                  value={editRadius}
                  onChange={(e) => setEditRadius(Number(e.target.value))}
                  className="w-full accent-[#adc6ff] h-1.5 rounded-full cursor-pointer"
                />

                <div className="flex justify-between text-[#8c909f] text-[10px] mt-1.5">
                  <span>1 km</span>
                  <span>5 km</span>
                  <span>10 km</span>
                  <span>15 km</span>
                </div>

                {/* Visual radius ticks */}
                <div className="mt-4 grid grid-cols-5 gap-1.5">
                  {[1, 3, 5, 10, 15].map((v) => (
                    <button
                      key={v}
                      onClick={() => setEditRadius(v)}
                      className={`py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        editRadius === v
                          ? 'bg-[rgba(173,198,255,0.15)] border-[#adc6ff] text-[#adc6ff]'
                          : 'border-[rgba(255,255,255,0.1)] text-[#8c909f] hover:bg-[rgba(255,255,255,0.05)]'
                      }`}
                    >
                      {v} km
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-5 pb-5">
              <button
                onClick={() => setEditingLocation(null)}
                className="flex-1 py-2.5 rounded-lg border border-[rgba(255,255,255,0.12)] text-[#e1e2ec] text-sm font-medium hover:bg-[rgba(255,255,255,0.05)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRadius}
                disabled={savingRadius}
                className="flex-1 py-2.5 rounded-lg bg-[#adc6ff] hover:bg-[#c7d9ff] text-[#002e6a] text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {savingRadius ? 'Menyimpan...' : 'Save Radius'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
