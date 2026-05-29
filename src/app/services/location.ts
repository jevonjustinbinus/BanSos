export interface UserLocation {
  latitude: number;
  longitude: number;
}

export function getCurrentUserLocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Browser tidak mendukung akses lokasi.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(new Error('Izin lokasi ditolak. Aktifkan izin lokasi di browser.'));
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          reject(new Error('Lokasi tidak tersedia.'));
        } else if (error.code === error.TIMEOUT) {
          reject(new Error('Pengambilan lokasi terlalu lama.'));
        } else {
          reject(new Error('Gagal mengambil lokasi.'));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}