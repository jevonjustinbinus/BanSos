import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  RefreshCw,
  BarChart2,
  Droplets,
  Wind,
  Loader2,
  WifiOff,
  MapPin,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import {
  fetchFloodRisk,
  formatAlertStatus,
  type FloodRiskResponse,
} from '../services/api';
import { getCurrentUserLocation } from '../services/location';

// Default monitoring coordinates — Kemang, Jakarta Selatan
const DEFAULT_LAT = -6.1233;
const DEFAULT_LNG = 106.8317;

// 48 hours of simulated data because backend does not provide time-series yet.
// This version is influenced by current location-based risk data,
// so the chart also changes when the user's location changes.
const generateTrendData = (baseRainfall = 15, probability = 35) => {
  const data = [];

  const probabilityFactor = Math.min(Math.max(probability / 100, 0), 1);
  const peakRainfall = 22 + probabilityFactor * 35;

  for (let i = 0; i < 48; i++) {
    const hour = i % 24;
    const factor = i < 32 ? i / 32 : 1 - (i - 32) / 16;

    const rainfall =
      baseRainfall +
      factor * peakRainfall +
      Math.sin(i / 3) * 2 +
      Math.random() * 2;

    data.push({
      time: `${String(hour).padStart(2, '0')}:00`,
      index: i,
      label:
        i % 8 === 0
          ? `${Math.floor(i / 24)}d ${String(hour).padStart(2, '0')}h`
          : '',
      rainfall: Math.max(0, Math.round(rainfall * 10) / 10),
    });
  }

  return data;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1d2027] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-xs">
        <p className="text-[#8c909f] mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

export function RiskAnalysisPage() {
  const coordsRef = useRef({
    lat: DEFAULT_LAT,
    lng: DEFAULT_LNG,
  });

  const [riskData, setRiskData] = useState<FloodRiskResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [usingUserLocation, setUsingUserLocation] = useState(false);

  const [userCoords, setUserCoords] = useState({
    lat: DEFAULT_LAT,
    lng: DEFAULT_LNG,
  });

  const updateCoords = useCallback((lat: number, lng: number) => {
    coordsRef.current = { lat, lng };
    setUserCoords({ lat, lng });
  }, []);

  const loadRiskData = useCallback(
    async (lat?: number, lng?: number) => {
      const targetLat = lat ?? coordsRef.current.lat;
      const targetLng = lng ?? coordsRef.current.lng;

      setLoading(true);
      setError(null);

      try {
        const data = await fetchFloodRisk(targetLat, targetLng);

        console.log('RISK ANALYSIS REQUEST COORDS:', {
          lat: targetLat,
          lng: targetLng,
        });
        console.log('RISK ANALYSIS RESPONSE:', data);

        setRiskData(data);

        // Simpan koordinat asli user/request, bukan centroid polygon backend.
        updateCoords(targetLat, targetLng);
      } catch (err: any) {
        console.error('Failed to load risk data:', err);
        setError(err.message || 'Failed to connect to backend.');
      } finally {
        setLoading(false);
      }
    },
    [updateCoords]
  );

  const handleUseMyLocation = useCallback(async () => {
    setLocationLoading(true);
    setError(null);

    try {
      const location = await getCurrentUserLocation();

      setUsingUserLocation(true);
      await loadRiskData(location.latitude, location.longitude);
    } catch (err: any) {
      console.error('Failed to get user location:', err);

      setUsingUserLocation(false);
      setError(
        err.message ||
          'Gagal mengambil lokasi user. Menggunakan lokasi default.'
      );

      await loadRiskData(DEFAULT_LAT, DEFAULT_LNG);
    } finally {
      setLocationLoading(false);
    }
  }, [loadRiskData]);

  useEffect(() => {
    // Saat user masuk Risk Analysis, langsung minta lokasi.
    // Kalau user menolak, fallback ke lokasi default.
    handleUseMyLocation();
  }, [handleUseMyLocation]);

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      await loadRiskData();
    } finally {
      setRefreshing(false);
    }
  };

  const chartColor = '#60a5fa';

  const weatherScore = riskData?.components.weather_score ?? 0;
  const waterLevel = riskData?.details.water_station.water_level ?? 0;
  const previousWaterLevel =
    riskData?.details.water_station.previous_water_level ?? 0;
  const alertStatus =
    riskData?.details.water_station.alert_status ?? 'UNKNOWN';
  const probabilityPct = riskData?.risk.probability_percent ?? 0;
  const riskTrend = riskData?.risk.trend ?? 'STABLE';
  const waterTrend = riskData?.details.water_station.trend ?? 'UNKNOWN';

  const waterStationName =
    riskData?.details.water_station.station_name ?? 'Tidak tersedia';
  const waterStationDistance =
    riskData?.details.water_station.distance_km ?? 0;
  const waterFreshnessWarning =
    riskData?.details.water_station.freshness.warning;

  const locationName = riskData
    ? `${riskData.location.kelurahan}, ${riskData.location.kecamatan} — ${riskData.location.kota_administrasi}`
    : 'Mengambil lokasi...';

  const isCriticalWater =
    alertStatus.includes('SIAGA 1') || alertStatus.includes('SIAGA 2');

  const criticalThreshold = 40;

  const waterDelta =
    waterLevel && previousWaterLevel ? waterLevel - previousWaterLevel : 0;

  const waterDeltaLabel =
    waterDelta > 0
      ? `↑ +${waterDelta.toFixed(0)} cm vs sebelumnya`
      : waterDelta < 0
        ? `↓ ${waterDelta.toFixed(0)} cm vs sebelumnya`
        : '→ Stabil';

  const trendData = useMemo(() => {
    const baseRainfall = weatherScore * 30;
    return generateTrendData(baseRainfall, probabilityPct);
  }, [weatherScore, probabilityPct]);

  return (
    <div className="p-6 text-[#e1e2ec] space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-[#e1e2ec] text-2xl sm:text-3xl font-semibold tracking-tight">
            Risk Analysis
          </h1>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleUseMyLocation}
              disabled={refreshing || loading || locationLoading}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-[rgba(16,19,26,0.6)] border border-[rgba(173,198,255,0.35)] text-[#adc6ff] text-xs sm:text-sm backdrop-blur-sm hover:bg-[rgba(173,198,255,0.08)] disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              {locationLoading ? (
                <Loader2 size={11} className="animate-spin" />
              ) : (
                <MapPin size={11} />
              )}
              <span className="sm:hidden">Lokasi</span>
              <span className="hidden sm:inline">Gunakan Lokasi Saya</span>
            </button>

            <button
              onClick={handleRefresh}
              disabled={refreshing || loading || locationLoading}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-[#adc6ff] hover:bg-[#c7d9ff] text-[#002e6a] text-xs sm:text-sm font-medium transition-all shadow-[0px_0px_7.5px_rgba(59,130,246,0.2)] ${
                refreshing || loading || locationLoading
                  ? 'scale-95 opacity-75 cursor-not-allowed'
                  : 'hover:scale-[1.02]'
              }`}
            >
              <RefreshCw
                size={11}
                className={refreshing || loading ? 'animate-spin' : ''}
              />
              <span className="sm:hidden">
                {refreshing ? '...' : 'Refresh'}
              </span>
              <span className="hidden sm:inline">
                {refreshing ? 'Refreshing...' : 'Refresh Analysis'}
              </span>
            </button>
          </div>
        </div>

        <div>
          <p className="text-[#c2c6d6] text-sm sm:text-base">
            {loading || locationLoading
              ? 'Mengambil lokasi dan memuat analisis risiko...'
              : `Real-time monitoring for ${locationName}.`}
          </p>

          <p className="text-[#8c909f] text-xs mt-1">
            Lat {userCoords.lat.toFixed(5)} · Lng{' '}
            {userCoords.lng.toFixed(5)} ·{' '}
            {usingUserLocation ? 'Lokasi Anda' : 'Lokasi default'}
          </p>
        </div>
      </div>

      {/* Backend / Location Error Banner */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[rgba(100,100,100,0.15)] border border-[rgba(255,255,255,0.15)]">
          <WifiOff size={16} className="text-[#8c909f] mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-[#e1e2ec] font-semibold text-sm">
              Data Tidak Tersambung / Lokasi Tidak Tersedia
            </p>
            <p className="text-[#8c909f] text-xs mt-0.5">
              Pastikan backend berjalan di{' '}
              <code className="text-[#adc6ff]">localhost:8000</code> dan izin
              lokasi browser aktif. Jika lokasi ditolak, sistem memakai lokasi
              default.
            </p>
            <p className="text-[#8c909f] text-[10px] mt-1 font-mono">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Data freshness warning */}
      {waterFreshnessWarning && !loading && !locationLoading && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[rgba(92,60,0,0.25)] border border-[rgba(255,183,134,0.25)]">
          <BarChart2 size={16} className="text-[#ffb786] mt-0.5 shrink-0" />
          <div>
            <p className="text-[#ffb786] font-semibold text-sm">
              Peringatan Data Sensor
            </p>
            <p className="text-[#e1e2ec] text-xs mt-0.5">
              {waterFreshnessWarning}
            </p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Weather Score */}
        <div className="bg-[#1d2027] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 sm:p-5 relative overflow-hidden">
          <div className="flex items-start justify-between mb-1 gap-1">
            <p className="text-[#8c909f] text-[10px] sm:text-xs uppercase tracking-wide leading-snug">
              Weather Risk Score
            </p>
            {loading || locationLoading ? (
              <Loader2
                size={15}
                className="text-[#8c909f] animate-spin shrink-0 mt-0.5"
              />
            ) : (
              <Droplets
                size={15}
                className="text-[#adc6ff] opacity-40 shrink-0 mt-0.5"
              />
            )}
          </div>

          <p className="text-[#e1e2ec] text-3xl sm:text-4xl font-bold mt-2">
            {loading || locationLoading ? '...' : (weatherScore * 100).toFixed(0)}
          </p>

          <p className="text-[#8c909f] text-xs">/ 100</p>

          <p className="text-[#adc6ff] text-[10px] sm:text-xs mt-2 leading-snug">
            {loading || locationLoading
              ? ''
              : riskData
                ? `${riskData.details.weather.rainy_slots}/${riskData.details.weather.total_slots} slot hujan terdeteksi`
                : ''}
          </p>
        </div>

        {/* Water Level */}
        <div
          className={`bg-[#1d2027] border ${
            isCriticalWater && !loading && !locationLoading
              ? 'border-[rgba(255,68,68,0.4)]'
              : 'border-[rgba(255,255,255,0.06)]'
          } rounded-xl p-4 sm:p-5 relative overflow-hidden`}
        >
          <div className="flex flex-col items-start gap-1 mb-1">
            <p className="text-[#8c909f] text-[10px] sm:text-xs uppercase tracking-wide leading-snug">
              Water Level
            </p>

            {!loading && !locationLoading && (
              <span
                className={`text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase leading-none ${
                  isCriticalWater
                    ? 'bg-[#93000a] text-[#ffdad6]'
                    : alertStatus.includes('SIAGA 3')
                      ? 'bg-[#5c3c00] text-[#ffb786]'
                      : 'bg-[#002105] text-[#7dd878]'
                }`}
              >
                {formatAlertStatus(alertStatus)}
              </span>
            )}
          </div>

          <p
            className={`text-3xl sm:text-4xl font-bold mt-1 ${
              isCriticalWater && !loading && !locationLoading
                ? 'text-[#ef4444]'
                : 'text-[#e1e2ec]'
            }`}
          >
            {loading || locationLoading
              ? '...'
              : waterLevel !== null && waterLevel !== undefined
                ? waterLevel.toFixed(0)
                : 'N/A'}
          </p>

          <p className="text-[#8c909f] text-xs">cm</p>

          <p
            className={`text-[10px] sm:text-xs mt-2 leading-snug ${
              isCriticalWater && !loading && !locationLoading
                ? 'text-[#ffb786]'
                : 'text-[#8c909f]'
            }`}
          >
            {loading || locationLoading ? '' : waterDeltaLabel}
          </p>
        </div>

        {/* Flood Probability */}
        <div className="bg-[#1d2027] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 sm:p-5">
          <div className="flex items-start justify-between mb-1 gap-1">
            <p className="text-[#8c909f] text-[10px] sm:text-xs uppercase tracking-wide leading-snug">
              Flood Probability
            </p>
            {loading || locationLoading ? (
              <Loader2
                size={15}
                className="text-[#8c909f] animate-spin shrink-0 mt-0.5"
              />
            ) : (
              <Wind
                size={15}
                className="text-[#e1e2ec] opacity-40 shrink-0 mt-0.5"
              />
            )}
          </div>

          <p className="text-[#e1e2ec] text-3xl sm:text-4xl font-bold mt-2">
            {loading || locationLoading ? '...' : probabilityPct.toFixed(1)}
          </p>

          <p className="text-[#8c909f] text-xs">%</p>

          <p className="text-[#8c909f] text-[10px] sm:text-xs mt-2 leading-snug">
            {loading || locationLoading
              ? ''
              : riskTrend === 'RISING'
                ? '↗ Meningkat'
                : riskTrend === 'DECREASING'
                  ? '↘ Menurun'
                  : '→ Stabil'}
          </p>
        </div>
      </div>

      {/* Supporting Data */}
      {riskData && !loading && !locationLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-[#1d2027] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
            <p className="text-[#8c909f] text-[10px] uppercase tracking-wide">
              Pos Air Terdekat
            </p>
            <p className="text-[#e1e2ec] font-semibold mt-1">
              {waterStationName}
            </p>
            <p className="text-[#8c909f] text-xs mt-1">
              Jarak sekitar {waterStationDistance.toFixed(2)} km dari lokasi
              monitoring.
            </p>
          </div>

          <div className="bg-[#1d2027] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
            <p className="text-[#8c909f] text-[10px] uppercase tracking-wide">
              Tren Tinggi Air
            </p>
            <p className="text-[#e1e2ec] font-semibold mt-1">
              {waterTrend}
            </p>
            <p className="text-[#8c909f] text-xs mt-1">
              Berdasarkan perubahan data sensor terakhir.
            </p>
          </div>
        </div>
      )}

      {/* Component Breakdown */}
      {riskData && !loading && !locationLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: 'Weather',
              value: riskData.components.weather_score,
              weight: '35%',
            },
            {
              label: 'Water',
              value: riskData.components.water_score,
              weight: '30%',
            },
            {
              label: 'Baseline',
              value: riskData.components.baseline_score,
              weight: '20%',
            },
            {
              label: 'Historical',
              value: riskData.components.historical_score,
              weight: '15%',
            },
          ].map(({ label, value, weight }) => (
            <div
              key={label}
              className="bg-[#1d2027] border border-[rgba(255,255,255,0.06)] rounded-xl p-3"
            >
              <p className="text-[#8c909f] text-[10px] uppercase tracking-wide">
                {label} ({weight})
              </p>
              <p className="text-[#e1e2ec] text-lg font-bold mt-1">
                {(value * 100).toFixed(1)}%
              </p>
              <div className="mt-1.5 w-full h-1 rounded-full bg-[rgba(255,255,255,0.08)]">
                <div
                  className="h-1 rounded-full bg-[#adc6ff] transition-all duration-500"
                  style={{ width: `${Math.round(value * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 48-Hour Chart */}
      <div className="bg-[#1d2027] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5 sm:mb-6">
          <h2 className="text-[#e1e2ec] text-base sm:text-xl font-semibold">
            48-Hour Rainfall Trends
          </h2>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-1.5 rounded-lg text-xs sm:text-sm bg-[rgba(96,165,250,0.15)] border border-[#60a5fa] text-[#60a5fa] whitespace-nowrap">
              Rainfall
            </span>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={trendData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="colorGrad-rainfall"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
                vertical={false}
              />

              <XAxis
                dataKey="index"
                tick={{ fill: '#8c909f', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval={7}
                tickFormatter={(val: number) => trendData[val]?.label ?? ''}
              />

              <YAxis
                tick={{ fill: '#8c909f', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip content={<CustomTooltip />} />

              <ReferenceLine
                y={criticalThreshold}
                stroke="#ef4444"
                strokeDasharray="4 4"
                strokeOpacity={0.5}
                label={{
                  value: 'CRITICAL THRESHOLD',
                  fill: '#ef4444',
                  fontSize: 9,
                  position: 'insideTopLeft',
                }}
              />

              <Area
                type="monotone"
                dataKey="rainfall"
                stroke={chartColor}
                strokeWidth={2.5}
                fill="url(#colorGrad-rainfall)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: chartColor,
                  stroke: '#10131a',
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Disclaimer */}
      {riskData?.disclaimer && (
        <p className="text-[#8c909f] text-[10px] sm:text-xs italic text-center px-4">
          {riskData.disclaimer}
        </p>
      )}
    </div>
  );
}