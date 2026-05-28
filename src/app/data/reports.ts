// Mock data for incident reports
export interface Report {
  id: string;
  title: string;
  description: string;
  severity: 'KRITIS' | 'SEDANG' | 'RENDAH';
  category: string;
  location: string;
  coordinates: [number, number];
  time: string;
  minutesAgo: number;
  reporter: string;
  radius: string;
  trend: string;
  confirmations: number;
  image?: string;
  riskLevel: 'high' | 'moderate' | 'safe';
  validated: boolean;
}

export const reports: Report[] = [
  {
    id: '1',
    title: 'Banjir di Jl. Kemang Raya',
    description:
      'Ketinggian air mencapai 80cm dan terus meningkat. Arus deras membuat kendaraan tidak dapat melintas. Akses menuju Prapanca terputus total.',
    severity: 'KRITIS',
    category: 'BANJIR',
    location: 'Mampang Prapatan, Jakarta Selatan',
    coordinates: [-6.2615, 106.8106],
    time: '14:23 PST',
    minutesAgo: 12,
    reporter: 'Unit 7-Alpha',
    radius: '~2.4 km',
    trend: 'Meningkat',
    confirmations: 12,
    riskLevel: 'high',
    validated: true,
  },
  {
    id: '2',
    title: 'Pohon Tumbang Menutup Jalan',
    description:
      'Pohon beringin besar tumbang di depan RS Medika. Menutup 2 lajur jalan utama. Sedang dalam penanganan petugas PPSU setempat.',
    severity: 'SEDANG',
    category: 'POHON TUMBANG',
    location: 'Kebon Jeruk, Jakarta Barat',
    coordinates: [-6.1944, 106.7629],
    time: '13:51 PST',
    minutesAgo: 32,
    reporter: 'Warga Setempat',
    radius: '~0.5 km',
    trend: 'Stabil',
    confirmations: 45,
    riskLevel: 'moderate',
    validated: true,
  },
  {
    id: '3',
    title: 'Tiang Listrik Miring Berbahaya',
    description:
      'Satu tiang listrik di pemukiman warga miring akibat tanah amblas pasca hujan semalam. Kabel menjuntai rendah ke arah jalan warga.',
    severity: 'SEDANG',
    category: 'INFRASTRUKTUR',
    location: 'Ciracas, Jakarta Timur',
    coordinates: [-6.3049, 106.8761],
    time: '12:30 PST',
    minutesAgo: 90,
    reporter: 'Unit 3-Beta',
    radius: '~0.3 km',
    trend: 'Stabil',
    confirmations: 8,
    riskLevel: 'moderate',
    validated: false,
  },
  {
    id: '4',
    title: 'Genangan Air Pasca Hujan',
    description:
      'Genangan air setinggi mata kaki (10-15cm) di sekitar TPU Jeruk Purut. Masih bisa dilewati kendaraan roda 2 dan roda 4.',
    severity: 'RENDAH',
    category: 'GENANGAN',
    location: 'Cilandak, Jakarta Selatan',
    coordinates: [-6.2988, 106.8014],
    time: '11:15 PST',
    minutesAgo: 168,
    reporter: 'Warga RT 05',
    radius: '~1.2 km',
    trend: 'Menurun',
    confirmations: 3,
    riskLevel: 'safe',
    validated: false,
  },
  {
    id: '5',
    title: 'Kecelakaan Beruntun Jl. TB Simatupang',
    description:
      'Tabrakan beruntun 3 kendaraan akibat jalan licin pasca hujan deras. 2 korban luka ringan sudah dievakuasi. Arus lalu lintas tersendat.',
    severity: 'KRITIS',
    category: 'KECELAKAAN',
    location: 'TB Simatupang, Jakarta Selatan',
    coordinates: [-6.2901, 106.8148],
    time: '13:40 PST',
    minutesAgo: 45,
    reporter: 'Unit 5-Delta',
    radius: '~0.8 km',
    trend: 'Membaik',
    confirmations: 27,
    riskLevel: 'high',
    validated: true,
  },
  {
    id: '6',
    title: 'Kebakaran Gudang Kayu Penjaringan',
    description:
      'Kebakaran melanda gudang kayu di kawasan industri Penjaringan. Api berhasil dikuasai setelah 2 unit damkar diterjunkan. Status kondusif.',
    severity: 'SEDANG',
    category: 'KEBAKARAN',
    location: 'Penjaringan, Jakarta Utara',
    coordinates: [-6.1265, 106.8062],
    time: '14:05 PST',
    minutesAgo: 20,
    reporter: 'Unit 2-Gamma',
    radius: '~1.5 km',
    trend: 'Menurun',
    confirmations: 19,
    riskLevel: 'moderate',
    validated: false,
  },
];

export const mapRiskPoints = [
  { id: 'r1', coordinates: [-6.2615, 106.8106] as [number, number], level: 'high' },
  { id: 'r2', coordinates: [-6.2088, 106.8456] as [number, number], level: 'moderate' },
  { id: 'r3', coordinates: [-6.1725, 106.8219] as [number, number], level: 'moderate' },
  { id: 'r4', coordinates: [-6.2988, 106.8014] as [number, number], level: 'high' },
  { id: 'r5', coordinates: [-6.2355, 106.8655] as [number, number], level: 'high' },
  { id: 'r6', coordinates: [-6.3049, 106.8761] as [number, number], level: 'safe' },
  { id: 'r7', coordinates: [-6.1517, 106.8933] as [number, number], level: 'safe' },
];
