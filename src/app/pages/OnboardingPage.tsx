import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { MapPin, CheckCircle2, ArrowRight, Loader2, AlertCircle, X } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { createSavedLocation } from '../services/api';

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

// ── Step type ─────────────────────────────────────────────────────
type Step = 'welcome' | 'address' | 'done';

export function OnboardingPage() {
  const navigate = useNavigate();

  // Guard: if already onboarded, go straight to dashboard
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.user_metadata?.onboarding_complete) {
        navigate('/dashboard', { replace: true });
      }
    });
  }, [navigate]);

  const [step, setStep] = useState<Step>('welcome');
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');

  // Address form state
  const [address, setAddress]     = useState('');
  const [lat, setLat]             = useState<number | null>(null);
  const [lng, setLng]             = useState<number | null>(null);
  const [suggestions, setSuggestions]       = useState<NominatimResult[]>([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');

  const debounceRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestionRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
        setUserName(
          data.user.user_metadata?.full_name ??
          data.user.email?.split('@')[0] ??
          'Pengguna',
        );
      }
    });

    const handler = (e: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Address autocomplete ──────────────────────────────────────
  const handleAddressChange = (value: string) => {
    setAddress(value);
    setLat(null);
    setLng(null);
    setShowSuggestions(false);
    setError('');

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length < 3) { setSuggestions([]); return; }

    debounceRef.current = setTimeout(async () => {
      setAddressLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&addressdetails=1&limit=6&countrycodes=id`,
          { headers: { 'Accept-Language': 'id' } },
        );
        const data: NominatimResult[] = await res.json();
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setAddressLoading(false);
      }
    }, 400);
  };

  const handleSelectSuggestion = (s: NominatimResult) => {
    setAddress(s.display_name);
    setLat(parseFloat(s.lat));
    setLng(parseFloat(s.lon));
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // ── Save primary address ──────────────────────────────────────
  const handleSave = async () => {
    if (!address.trim() || !userId) return;
    setSaving(true);
    setError('');

    try {
      const result = await createSavedLocation({
        user_id: userId,
        name: 'Alamat Utama',
        address: address.trim(),
        latitude: lat,
        longitude: lng,
        status: 'clear',
        radius: 3,
      });

      // Store coords in sessionStorage so DashboardPage picks them up immediately
      if (lat !== null && lng !== null) {
        sessionStorage.setItem(
          'bansos_user_location',
          JSON.stringify({ lat, lng }),
        );
      }

      // Mark onboarding as complete and store primary location ID
      await supabase.auth.updateUser({
        data: {
          onboarding_complete: true,
          primary_location_id: result.data.id,
        },
      });

      setStep('done');
      setTimeout(() => navigate('/dashboard', { replace: true }), 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || 'Gagal menyimpan alamat. Coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  // ── Skip onboarding ───────────────────────────────────────────
  const handleSkip = async () => {
    await supabase.auth.updateUser({ data: { onboarding_complete: true } });
    navigate('/dashboard', { replace: true });
  };

  // ── Render helpers ────────────────────────────────────────────
  const canSave = address.trim().length > 0 && !saving;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: 'linear-gradient(135deg, #0a0d14 0%, #10131a 50%, #0f1520 100%)',
      }}
    >
      {/* Decorative blobs */}
      <div
        className="fixed top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-[0.07] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }}
      />
      <div
        className="fixed bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-[0.05] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #60a5fa 0%, transparent 70%)' }}
      />

      <div className="relative z-10 w-full max-w-[480px]">
        {/* ── Step: Welcome ─────────────────────────────────── */}
        {step === 'welcome' && (
          <div
            className="rounded-[28px] p-8 lg:p-10 text-center"
            style={{
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Logo */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <svg width="26" height="24" viewBox="0 0 31.5 30" fill="none">
                <path
                  d="M15.75 0L31.5 8.57143V21.4286L15.75 30L0 21.4286V8.57143L15.75 0Z"
                  fill="white"
                  opacity="0.9"
                />
              </svg>
              <span className="font-black text-white tracking-[1.6px] uppercase text-2xl">
                BANSOS
              </span>
            </div>

            {/* Welcome text */}
            <div className="mb-8">
              <div className="w-16 h-16 rounded-full bg-[rgba(96,165,250,0.15)] border border-[rgba(96,165,250,0.25)] flex items-center justify-center mx-auto mb-4">
                <MapPin size={28} className="text-[#60a5fa]" />
              </div>
              <h1 className="text-white text-2xl font-bold mb-3">
                Selamat Datang,<br />
                <span className="text-[#adc6ff]">{userName}!</span>
              </h1>
              <p className="text-[#c2c6d6] text-sm leading-relaxed">
                Untuk memulai, kami perlu mengetahui{' '}
                <strong className="text-white">alamat utama Anda</strong>. Informasi ini
                digunakan untuk memantau risiko banjir dan laporan di sekitar lokasi Anda.
              </p>
            </div>

            {/* Step indicators */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="w-8 h-1.5 rounded-full bg-[#3b82f6]" />
              <div className="w-8 h-1.5 rounded-full bg-[rgba(255,255,255,0.15)]" />
            </div>

            {/* CTA buttons */}
            <button
              onClick={() => setStep('address')}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold text-sm transition-colors shadow-lg mb-3"
            >
              Atur Alamat Sekarang
              <ArrowRight size={16} />
            </button>
            <button
              onClick={handleSkip}
              className="w-full py-3 rounded-xl text-[rgba(255,255,255,0.5)] text-sm hover:text-white transition-colors"
            >
              Lewati, atur nanti
            </button>
          </div>
        )}

        {/* ── Step: Address Form ─────────────────────────────── */}
        {step === 'address' && (
          <div
            className="rounded-[28px] p-8 lg:p-10"
            style={{
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setStep('welcome')}
                className="text-[#8c909f] hover:text-[#e1e2ec] transition-colors p-1"
              >
                <X size={18} />
              </button>
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-1.5 rounded-full bg-[rgba(255,255,255,0.15)]" />
                <div className="w-8 h-1.5 rounded-full bg-[#3b82f6]" />
              </div>
              {/* spacer */}
              <div className="w-7" />
            </div>

            <div className="mb-6">
              <h2 className="text-white text-xl font-bold mb-1">Isi Alamat Utama</h2>
              <p className="text-[#8c909f] text-sm">
                Alamat ini akan menjadi lokasi pemantauan default Anda.
              </p>
            </div>

            {/* Address input with autocomplete */}
            <div className="space-y-4">
              <div className="relative" ref={suggestionRef}>
                <label className="block text-[#8c909f] text-xs font-medium mb-1.5 uppercase tracking-wide">
                  Alamat Lengkap
                </label>
                <div className="relative">
                  <MapPin
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c909f] pointer-events-none"
                  />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => handleAddressChange(e.target.value)}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    autoComplete="off"
                    placeholder="Ketik nama jalan, kelurahan, kota..."
                    className="w-full bg-[rgba(255,255,255,0.07)] border border-[rgba(255,255,255,0.12)] rounded-xl pl-9 pr-10 py-3 text-[#e1e2ec] text-sm placeholder-[#8c909f] focus:outline-none focus:border-[rgba(96,165,250,0.5)] focus:bg-[rgba(255,255,255,0.1)] transition-all"
                  />
                  {addressLoading && (
                    <Loader2
                      size={14}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin text-[#8c909f]"
                    />
                  )}
                </div>

                {/* Coord confirmation */}
                {lat !== null && lng !== null && (
                  <p className="mt-1.5 text-[11px] text-[#4ade80] flex items-center gap-1">
                    <CheckCircle2 size={11} />
                    Koordinat tersimpan · {lat.toFixed(5)}, {lng.toFixed(5)}
                  </p>
                )}
                {address.trim() && lat === null && !addressLoading && (
                  <p className="mt-1.5 text-[11px] text-[#ffb786] flex items-center gap-1">
                    <AlertCircle size={11} />
                    Pilih dari daftar saran agar koordinat tersimpan
                  </p>
                )}

                {/* Autocomplete dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute z-[3000] left-0 right-0 mt-1.5 bg-[#1a1d26] border border-[rgba(255,255,255,0.12)] rounded-xl overflow-hidden shadow-2xl max-h-52 overflow-y-auto">
                    {suggestions.map((s) => (
                      <li key={s.place_id}>
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSelectSuggestion(s);
                          }}
                          className="w-full flex items-start gap-2.5 px-4 py-2.5 text-left hover:bg-[rgba(96,165,250,0.08)] transition-colors border-b border-[rgba(255,255,255,0.05)] last:border-0"
                        >
                          <MapPin size={13} className="text-[#adc6ff] shrink-0 mt-0.5" />
                          <span className="text-[#e1e2ec] text-xs leading-relaxed line-clamp-2">
                            {s.display_name}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Error */}
              {error && (
                <p className="flex items-center gap-1.5 text-[#ffb4ab] text-xs">
                  <AlertCircle size={12} className="shrink-0" />
                  {error}
                </p>
              )}

              {/* Save button */}
              <div className="pt-2">
                <button
                  onClick={handleSave}
                  disabled={!canSave}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors shadow-lg"
                >
                  {saving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      Simpan &amp; Mulai
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <button
                  onClick={handleSkip}
                  disabled={saving}
                  className="w-full mt-3 py-3 rounded-xl text-[rgba(255,255,255,0.4)] text-sm hover:text-[rgba(255,255,255,0.7)] transition-colors disabled:opacity-50"
                >
                  Lewati, atur nanti di Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Step: Done ─────────────────────────────────────── */}
        {step === 'done' && (
          <div
            className="rounded-[28px] p-8 lg:p-10 text-center"
            style={{
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
            }}
          >
            <div className="w-20 h-20 rounded-full bg-[rgba(74,222,128,0.15)] border border-[rgba(74,222,128,0.25)] flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 size={40} className="text-[#4ade80]" />
            </div>
            <h2 className="text-white text-2xl font-bold mb-2">Alamat Tersimpan!</h2>
            <p className="text-[#c2c6d6] text-sm leading-relaxed mb-2">
              Alamat utama Anda berhasil disimpan. Dashboard sekarang akan memantau
              risiko banjir di sekitar lokasi Anda.
            </p>
            <p className="text-[#8c909f] text-xs">Mengalihkan ke dashboard...</p>
            <div className="mt-5 flex justify-center">
              <Loader2 size={20} className="animate-spin text-[#adc6ff]" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
