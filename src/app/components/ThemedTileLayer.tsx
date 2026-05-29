import { TileLayer } from 'react-leaflet';
import { useTheme } from '../context/ThemeContext';

export function ThemedTileLayer() {
  const { theme } = useTheme();

  const tileUrl =
    theme === 'light'
      ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

  return (
    <TileLayer
      key={theme}
      url={tileUrl}
      attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
    />
  );
}