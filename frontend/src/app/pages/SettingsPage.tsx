import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../services/supabaseClient';
import { useTheme } from '../context/ThemeContext';
import {
  fetchReports,
  fetchSavedLocations,
  createSavedLocation,
  updateSavedLocation,
  deleteSavedLocation,
  fetchNotificationPreferences,
  updateNotificationPreferences,
  type SavedLocation as APISavedLocation,
  type CommunityReport,
  type NotificationPreferences,
} from '../services/api';

import {
  DEFAULT_LAT,
  DEFAULT_LNG,
  getSessionLocation,
} from '../services/primaryLocation';

import {
  ChevronRight,
  Plus,
  Trash2,
  MapPin,
  Bell,
  Shield,
  Edit3,
  BarChart2,
  X,
  FileText,
  Lock,
  Camera,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  CheckCircle,
  XCircle,
  MapPinned,
} from 'lucide-react';
import imgMapView from '../../imports/ProfileProfessionalDarkTheme-2/95a1e6ef9cc5afd696639f1af1a49888c9223daf.png';

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

type SavedLocation = APISavedLocation;

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

export function SettingsPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [profileName, setProfileName] = useState('');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [joinedYear, setJoinedYear] = useState('');
  const [totalReports, setTotalReports] = useState<number | null>(null);
  const [userId, setUserId] = useState('');
  const [locations, setLocations] = useState<SavedLocation[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [locationError, setLocationError] = useState('');
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationSaving, setNotificationSaving] = useState(false);
  const [notificationError, setNotificationError] = useState('');
  const [notificationSuccess, setNotificationSuccess] = useState('');
  const [notificationPrefs, setNotificationPrefs] = useState<
    Omit<NotificationPreferences, 'user_id' | 'created_at' | 'updated_at'>
  >({
    approved_report: true,
    rejected_report: true,
    nearby_reports: true,
  });

  useEffect(() => {
  supabase.auth.getUser().then(async ({ data }) => {
    if (!data.user) return;

    const uid = data.user.id;

    setUserId(uid);

    const currentName =
      data.user.user_metadata?.full_name ?? data.user.email ?? '';

    const currentAvatar =
      data.user.user_metadata?.avatar_url ?? '';

    setUserName(currentName);
    setProfileName(currentName);
    setAvatarUrl(currentAvatar);
    setProfilePreview(currentAvatar);
    setUserEmail(data.user.email ?? '');
    setJoinedYear(new Date(data.user.created_at).getFullYear().toString());

    try {
      const [locResult, reportResult, prefResult] = await Promise.allSettled([
        fetchSavedLocations(uid),
        fetchReports('approved'),
        fetchNotificationPreferences(uid),
      ]);

      const savedLocations =
        locResult.status === 'fulfilled' ? locResult.value.data : [];

      const reports =
        reportResult.status === 'fulfilled' ? reportResult.value.data : [];

      if (prefResult.status === 'fulfilled') {
        const prefs = prefResult.value.data;

        setNotificationPrefs({
          approved_report: prefs.approved_report,
          rejected_report: prefs.rejected_report,
          nearby_reports: prefs.nearby_reports,
        });
      }

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
      setTotalReports(0);
    } finally {
      setLocationsLoading(false);
    }
  });
}, []);

  useEffect(() => {
    return () => {
      if (profilePreview && profilePreview.startsWith('blob:')) {
        URL.revokeObjectURL(profilePreview);
      }
    };
  }, [profilePreview]);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setProfileError('File harus berupa gambar.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setProfileError('Ukuran gambar maksimal 2MB.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setProfileImageFile(file);
    setProfilePreview(previewUrl);
    setProfileError('');
    setProfileSuccess('');
  };

  const uploadAvatar = async (file: File, uid: string) => {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const filePath = `${uid}/avatar-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSaveProfile = async () => {
    setProfileError('');
    setProfileSuccess('');

    if (!profileName.trim()) {
      setProfileError('Nama profile tidak boleh kosong.');
      return;
    }

    setProfileSaving(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      const user = authData.user;

      if (!user) {
        setProfileError('User belum login.');
        return;
      }

      let finalAvatarUrl = avatarUrl;

      if (profileImageFile) {
        finalAvatarUrl = await uploadAvatar(profileImageFile, user.id);
      }

      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: profileName.trim(),
          avatar_url: finalAvatarUrl,
        },
      });

      if (updateError) {
        throw updateError;
      }

      setUserName(profileName.trim());
      setAvatarUrl(finalAvatarUrl);
      setProfilePreview(finalAvatarUrl);
      setProfileImageFile(null);
      setProfileSuccess('Profile berhasil diperbarui.');

      window.dispatchEvent(new Event('bansos-profile-updated'));

    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setProfileError(message || 'Gagal memperbarui profile.');
    } finally {
      setProfileSaving(false);
    }
  };

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


  const notificationOptions = [
    {
      key: 'approved_report' as const,
      icon: CheckCircle,
      title: 'Approved / Verified Report',
      desc: 'Dapatkan notifikasi ketika laporan kamu disetujui atau diverifikasi oleh admin.',
    },
    {
      key: 'rejected_report' as const,
      icon: XCircle,
      title: 'Rejected Report',
      desc: 'Dapatkan notifikasi ketika laporan ditolak, termasuk alasan penolakan dari admin.',
    },
    {
      key: 'nearby_reports' as const,
      icon: MapPinned,
      title: 'Nearby Reports',
      desc: 'Dapatkan notifikasi ketika ada laporan baru di sekitar saved location kamu.',
    },
  ];

  const toggleNotificationPref = (key: keyof typeof notificationPrefs) => {
    setNotificationPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setNotificationError('');
    setNotificationSuccess('');
  };

  const openNotificationModal = () => {
    setNotificationError('');
    setNotificationSuccess('');
    setShowNotificationModal(true);
  };

  const handleSaveNotificationPreferences = async () => {
    if (!userId) {
      setNotificationError('User belum login.');
      return;
    }

    setNotificationSaving(true);
    setNotificationError('');
    setNotificationSuccess('');

    try {
      const result = await updateNotificationPreferences(userId, notificationPrefs);

      setNotificationPrefs({
        approved_report: result.data.approved_report,
        rejected_report: result.data.rejected_report,
        nearby_reports: result.data.nearby_reports,
      });

      setNotificationSuccess('Notification preferences berhasil disimpan.');

      window.setTimeout(() => {
        setShowNotificationModal(false);
        setNotificationSuccess('');
      }, 900);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setNotificationError(message || 'Gagal menyimpan notification preferences.');
    } finally {
      setNotificationSaving(false);
    }
  };

    const openSecurityModal = () => {
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
      setPasswordSuccess('');
      setShowSecurityModal(true);
    };

    const handleUpdatePassword = async () => {
      setPasswordError('');
      setPasswordSuccess('');

      if (!newPassword.trim() || !confirmPassword.trim()) {
        setPasswordError('Password baru dan konfirmasi password wajib diisi.');
        return;
      }

      if (newPassword.length < 6) {
        setPasswordError('Password minimal harus 6 karakter.');
        return;
      }

      if (newPassword !== confirmPassword) {
        setPasswordError('Konfirmasi password tidak sama.');
        return;
      }

      setPasswordLoading(true);

      try {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (error) {
          throw error;
        }

        setPasswordSuccess('Password berhasil diperbarui.');
        setNewPassword('');
        setConfirmPassword('');

        window.setTimeout(() => {
          setShowSecurityModal(false);
          setPasswordSuccess('');
        }, 1500);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setPasswordError(message || 'Gagal memperbarui password.');
      } finally {
        setPasswordLoading(false);
      }
    };

    const settingsRows = [
      {
        icon: <Bell size={20} className="text-[#94a3b8]" />,
        title: 'Notification Preferences',
        desc: 'Manage report status alerts and nearby report notifications.',
        action: openNotificationModal,
      },
      {
        icon: <Shield size={20} className="text-[#94a3b8]" />,
        title: 'Privacy & Security',
        desc: 'Reset your account password directly from settings.',
        action: openSecurityModal,
      },
    ];

  return (
    <div className="p-4 lg:p-6 text-[#e1e2ec] space-y-6">
      {/* Profile Header Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {/* User Info Card — spans 2 cols */}
        <div className="md:col-span-2 bg-[#191b23] border border-[#e1e2ec]/20 rounded-xl overflow-hidden relative shadow-[0px_4px_12px_0px_rgba(9,30,66,0.08)]">
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,82,204,0.1)] to-transparent pointer-events-none" />

          <div className="relative p-5 lg:p-6">
            <div className="flex flex-col lg:flex-row lg:items-start gap-5">
              <div className="relative shrink-0 w-fit">
                <div className="size-20 lg:size-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-[#10131a]">
                  {profilePreview ? (
                    <img
                      src={profilePreview}
                      alt={profileName || userName || 'Profile'}
                      className="size-full object-cover"
                      onError={() => setProfilePreview('')}
                    />
                  ) : (
                    <div className="size-full flex items-center justify-center text-[#adc6ff] text-3xl font-bold">
                      {(profileName || userName || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <label className="absolute bottom-0 right-0 w-8 h-8 bg-[#adc6ff] rounded-full flex items-center justify-center border border-[#e1e2ec] shadow-sm hover:bg-[#c7d9ff] transition-colors cursor-pointer">
                  <Camera size={14} className="text-[#002e6a]" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileImageChange}
                  />
                </label>
              </div>

              <div className="flex-1 min-w-0 space-y-3">
                <div>
                  <label className="block text-[#8c909f] text-xs uppercase tracking-widest font-medium mb-1.5">
                    Display Name
                  </label>

                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => {
                      setProfileName(e.target.value);
                      setProfileError('');
                      setProfileSuccess('');
                    }}
                    placeholder="Masukkan nama profile"
                    className="w-full bg-[#32353c] border border-[#424754] rounded-lg px-4 py-2.5 text-[#e1e2ec] placeholder-[#8c909f] text-sm focus:outline-none focus:border-[rgba(173,198,255,0.5)] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[#8c909f] text-xs uppercase tracking-widest font-medium mb-1.5">
                    Email
                  </label>

                  <input
                    type="email"
                    value={userEmail}
                    disabled
                    className="w-full bg-[#10131a] border border-[#32353c] rounded-lg px-4 py-2.5 text-[#8c909f] text-sm cursor-not-allowed"
                  />
                </div>
                  
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                      backgroundColor: theme === 'dark' ? 'rgba(52, 211, 153, 0.12)' : '#dcfce7',
                      border:
                        theme === 'dark'
                          ? '1px solid rgba(52, 211, 153, 0.35)'
                          : '1px solid #16a34a',
                      color: theme === 'dark' ? '#6ee7b7' : '#166534',
                    }}
                  >
                    <CheckCircle2 size={12} />
                    Verified Responder
                  </span>

                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                      backgroundColor: theme === 'dark' ? 'rgba(173, 198, 255, 0.12)' : '#dbeafe',
                      border:
                        theme === 'dark'
                          ? '1px solid rgba(173, 198, 255, 0.35)'
                          : '1px solid #2563eb',
                      color: theme === 'dark' ? '#adc6ff' : '#0f2f6f',
                    }}
                  >
                    {joinedYear ? `Joined ${joinedYear}` : '...'}
                  </span>
                </div>

                {profileError && (
                  <div className="flex items-start gap-2 rounded-lg border border-red-400/25 bg-red-500/10 px-3 py-2">
                    <AlertCircle size={14} className="text-red-300 mt-0.5 shrink-0" />
                    <p className="text-red-200 text-xs leading-relaxed">
                      {profileError}
                    </p>
                  </div>
                )}

                {profileSuccess && (
                  <div
                    className="flex items-start gap-2 rounded-lg px-3 py-2"
                    style={{
                      backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.12)' : '#dcfce7',
                      border:
                        theme === 'dark'
                          ? '1px solid rgba(74, 222, 128, 0.35)'
                          : '1px solid #16a34a',
                      color: theme === 'dark' ? '#bbf7d0' : '#166534',
                    }}
                  >
                    <CheckCircle2
                      size={14}
                      className="mt-0.5 shrink-0"
                      style={{
                        color: theme === 'dark' ? '#86efac' : '#15803d',
                      }}
                    />

                    <p className="text-xs font-medium leading-relaxed">
                      {profileSuccess}
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={profileSaving}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#adc6ff] hover:bg-[#c7d9ff] disabled:opacity-50 disabled:cursor-not-allowed text-[#002e6a] text-sm font-semibold transition-colors"
                >
                  {profileSaving ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={15} />
                      Save Profile
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats/Actions Card */}
        <div className="bg-[#191b23] border border-[#e1e2ec]/20 rounded-xl shadow-[0px_4px_6px_rgba(9,30,66,0.08)]">
          <div className="flex flex-col gap-4 p-5 lg:p-6 h-full justify-center">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#e1e2ec] text-xs uppercase tracking-widest font-medium">Laporan Sekitar</p>
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
            onClick={() => row.action?.()}
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


      {/* ── Notification Preferences Modal ─────────────────────── */}
      {showNotificationModal && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
          style={{
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-[rgba(255,255,255,0.1)] dark:bg-[#1d2027]">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-[rgba(255,255,255,0.07)]">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-blue-600 dark:text-[#adc6ff]" />
                <h3 className="font-semibold text-slate-900 dark:text-[#e1e2ec]">
                  Notification Preferences
                </h3>
              </div>

              <button
                onClick={() => setShowNotificationModal(false)}
                disabled={notificationSaving}
                className="text-slate-500 transition-colors hover:text-slate-900 disabled:opacity-50 dark:text-[#8c909f] dark:hover:text-[#e1e2ec]"
                aria-label="Close notification modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 px-5 py-5">
              <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 dark:border-[rgba(173,198,255,0.16)] dark:bg-[rgba(173,198,255,0.06)]">
                <p className="text-sm font-semibold text-slate-900 dark:text-[#e1e2ec]">
                  Manage what alerts you want to receive
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-[#8c909f]">
                  Aktifkan atau matikan jenis notifikasi sesuai kebutuhan kamu.
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-[#8c909f]">
                  Flood risk alert tetap aktif sebagai peringatan keselamatan utama dan tidak dapat dimatikan.
                </p>
              </div>

              {notificationOptions.map((option) => {
                const Icon = option.icon;
                const enabled = notificationPrefs[option.key];

                return (
                  <div
                    key={option.key}
                    className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 transition-colors sm:flex-row sm:items-center sm:justify-between dark:border-[rgba(255,255,255,0.08)] dark:bg-[rgba(255,255,255,0.04)]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm dark:bg-[rgba(173,198,255,0.1)] dark:text-[#adc6ff]">
                        <Icon size={18} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-[#e1e2ec]">
                          {option.title}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-[#8c909f]">
                          {option.desc}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={enabled}
                      disabled={notificationSaving}
                      onClick={() => toggleNotificationPref(option.key)}
                      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/40 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-[#adc6ff]/40 ${
                        enabled
                          ? 'border-blue-600 bg-blue-600 dark:border-[#adc6ff] dark:bg-[#adc6ff]'
                          : 'border-slate-300 bg-slate-300 dark:border-[rgba(255,255,255,0.14)] dark:bg-[#32353c]'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                          enabled
                            ? 'translate-x-6 dark:bg-[#002e6a]'
                            : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}

              {notificationError && (
                <div className="flex items-start gap-2 rounded-lg border border-red-300 bg-red-50 px-3 py-2 dark:border-red-400/25 dark:bg-red-500/10">
                  <AlertCircle size={14} className="mt-0.5 shrink-0 text-red-600 dark:text-red-300" />
                  <p className="text-xs leading-relaxed text-red-700 dark:text-red-200">
                    {notificationError}
                  </p>
                </div>
              )}

              {notificationSuccess && (
                <div className="flex items-start gap-2 rounded-lg border border-green-300 bg-green-50 px-3 py-2 dark:border-green-400/25 dark:bg-green-500/10">
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-green-600 dark:text-green-300" />
                  <p className="text-xs leading-relaxed text-green-700 dark:text-green-200">
                    {notificationSuccess}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 border-t border-slate-200 px-5 pb-5 pt-4 dark:border-[rgba(255,255,255,0.07)]">
              <button
                onClick={() => setShowNotificationModal(false)}
                disabled={notificationSaving}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-50 dark:border-[rgba(255,255,255,0.12)] dark:text-[#e1e2ec] dark:hover:bg-[rgba(255,255,255,0.05)]"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveNotificationPreferences}
                disabled={notificationSaving}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#adc6ff] dark:text-[#002e6a] dark:hover:bg-[#c7d9ff]"
              >
                {notificationSaving ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Preferences'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Privacy & Security Modal ───────────────────────────── */}
      {showSecurityModal && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
          style={{
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div className="w-full max-w-md bg-[#1d2027] border border-[rgba(255,255,255,0.1)] rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.07)]">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-[#adc6ff]" />
                <h3 className="text-[#e1e2ec] font-semibold">
                  Privacy & Security
                </h3>
              </div>

              <button
                onClick={() => setShowSecurityModal(false)}
                className="text-[#8c909f] hover:text-[#e1e2ec] transition-colors"
                aria-label="Close security modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-5 py-5 space-y-4">
              <div className="flex items-start gap-3 rounded-xl border border-[rgba(173,198,255,0.16)] bg-[rgba(173,198,255,0.06)] px-4 py-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(173,198,255,0.12)]">
                  <Lock size={15} className="text-[#adc6ff]" />
                </div>

                <div>
                  <p className="text-[#e1e2ec] text-sm font-semibold">
                    Reset Password
                  </p>
                  <p className="text-[#8c909f] text-xs mt-0.5 leading-relaxed">
                    Masukkan password baru untuk akun Anda. Password akan langsung diperbarui tanpa verifikasi email karena Anda sudah login.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-[#8c909f] text-xs font-medium mb-1.5 uppercase tracking-wide">
                  Password Baru
                </label>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordError('');
                    setPasswordSuccess('');
                  }}
                  placeholder="Minimal 6 karakter"
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2.5 text-[#e1e2ec] text-sm placeholder-[#8c909f] focus:outline-none focus:border-[rgba(173,198,255,0.4)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[#8c909f] text-xs font-medium mb-1.5 uppercase tracking-wide">
                  Konfirmasi Password Baru
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordError('');
                    setPasswordSuccess('');
                  }}
                  placeholder="Ulangi password baru"
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2.5 text-[#e1e2ec] text-sm placeholder-[#8c909f] focus:outline-none focus:border-[rgba(173,198,255,0.4)] transition-colors"
                />
              </div>

              {passwordError && (
                <div className="flex items-start gap-2 rounded-lg border border-red-400/25 bg-red-500/10 px-3 py-2">
                  <AlertCircle size={14} className="text-red-300 mt-0.5 shrink-0" />
                  <p className="text-red-200 text-xs leading-relaxed">
                    {passwordError}
                  </p>
                </div>
              )}

              {passwordSuccess && (
                <div className="flex items-start gap-2 rounded-lg border border-green-400/25 bg-green-500/10 px-3 py-2">
                  <CheckCircle2 size={14} className="text-green-300 mt-0.5 shrink-0" />
                  <p className="text-green-200 text-xs leading-relaxed">
                    {passwordSuccess}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 px-5 pb-5">
              <button
                onClick={() => setShowSecurityModal(false)}
                disabled={passwordLoading}
                className="flex-1 py-2.5 rounded-lg border border-[rgba(255,255,255,0.12)] text-[#e1e2ec] text-sm font-medium hover:bg-[rgba(255,255,255,0.05)] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdatePassword}
                disabled={passwordLoading || !newPassword.trim() || !confirmPassword.trim()}
                className="flex-1 py-2.5 rounded-lg bg-[#adc6ff] hover:bg-[#c7d9ff] text-[#002e6a] text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {passwordLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Update Password'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 pr-9 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-colors dark:bg-[rgba(255,255,255,0.05)] dark:border-[rgba(255,255,255,0.1)] dark:text-[#e1e2ec] dark:placeholder-[#8c909f] dark:focus:border-[rgba(173,198,255,0.4)]"
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
                  <ul className="absolute z-[3000] left-0 right-0 mt-1 max-h-52 overflow-y-auto rounded-xl border !border-slate-200 !bg-white shadow-2xl dark:!border-[rgba(255,255,255,0.12)] dark:!bg-[#252830]">
                    {addressSuggestions.map((s) => (
                      <li key={s.place_id}>
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSelectSuggestion(s);
                          }}
                          className="w-full flex items-start gap-2.5 px-4 py-2.5 text-left transition-colors border-b !border-slate-100 last:border-0 hover:!bg-blue-50 dark:!border-[rgba(255,255,255,0.05)] dark:hover:!bg-[rgba(173,198,255,0.08)]"
                        >
                          <MapPin
                            size={13}
                            className="!text-blue-600 dark:!text-[#adc6ff] shrink-0 mt-0.5"
                          />

                          <span className="!text-slate-800 dark:!text-[#e1e2ec] text-xs leading-relaxed line-clamp-2">
                            {s.display_name}
                          </span>
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
