// Fix for Leaflet default icon URLs in Vite/ES module environments
import L from 'leaflet';

// Leaflet's default icon detection doesn't work with Vite's asset bundling.
// We manually delete the internal _getIconUrl method and provide our own URLs.
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)['_getIconUrl'];

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export {};
