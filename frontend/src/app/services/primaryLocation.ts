/**
 * primaryLocation.ts
 * ─────────────────────────────────────────────────────────────────
 * Shared helper that resolves the best starting coordinates across
 * all pages (Dashboard, Risk Analysis, Map, etc.).
 *
 * Priority order:
 *   1. sessionStorage  — set by GPS use or Onboarding
 *   2. Primary saved location from Supabase API
 *   3. Jakarta fallback defaults
 */

import { supabase } from './supabaseClient';
import { fetchSavedLocations } from './api';

// ── Constants ─────────────────────────────────────────────────────
export const SESSION_LOCATION_KEY = 'bansos_user_location';

/** Fallback centre — Kemang, Jakarta Selatan */
export const DEFAULT_LAT = -6.1233;
export const DEFAULT_LNG = 106.8317;

// ── Types ─────────────────────────────────────────────────────────
export interface ResolvedLocation {
  lat: number;
  lng: number;
  /** Human-readable label of the saved location (if found) */
  name?: string;
  /** Saved-location row ID (if found) */
  id?: string;
  /** How the coordinate was resolved */
  source: 'session' | 'saved' | 'default';
}

// ── Helpers ───────────────────────────────────────────────────────

/**
 * Persist a coordinate pair to sessionStorage so every page in the
 * current session uses the same location reference.
 *
 * Call this whenever the user explicitly selects a new location
 * (GPS button, saved-location dropdown, or onboarding).
 */
export function saveSessionLocation(lat: number, lng: number): void {
  try {
    sessionStorage.setItem(SESSION_LOCATION_KEY, JSON.stringify({ lat, lng }));
  } catch {
    // sessionStorage unavailable (private browsing, storage full, etc.)
  }
}

/** Read the last-stored GPS / onboarding coords from sessionStorage. */
export function getSessionLocation(): { lat: number; lng: number } | null {
  try {
    const raw = sessionStorage.getItem(SESSION_LOCATION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { lat: number; lng: number };
    if (typeof parsed.lat === 'number' && typeof parsed.lng === 'number') {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Returns the best available location for the current user.
 *
 * Call this once per page and cache the result — it makes two
 * async calls (Supabase auth + saved-locations API) when
 * sessionStorage is empty.
 */
export async function resolvePrimaryLocation(): Promise<ResolvedLocation> {
  // ── 1. sessionStorage (fastest) ──────────────────────────────
  const session = getSessionLocation();
  if (session) return { ...session, source: 'session' };

  // ── 2. Primary saved location from API ───────────────────────
  try {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) return { lat: DEFAULT_LAT, lng: DEFAULT_LNG, source: 'default' };

    const primaryId: string | undefined =
      authData.user.user_metadata?.primary_location_id;

    const result = await fetchSavedLocations(authData.user.id);
    const withCoords = result.data.filter(
      (l) => l.latitude != null && l.longitude != null,
    );

    if (withCoords.length > 0) {
      const primary =
        (primaryId ? withCoords.find((l) => l.id === primaryId) : undefined) ??
        withCoords[0];

      if (primary.latitude != null && primary.longitude != null) {
        return {
          lat: primary.latitude,
          lng: primary.longitude,
          name: primary.name,
          id: primary.id,
          source: 'saved',
        };
      }
    }
  } catch {
    // fall through to defaults
  }

  // ── 3. Hard-coded Jakarta default ────────────────────────────
  return { lat: DEFAULT_LAT, lng: DEFAULT_LNG, source: 'default' };
}
