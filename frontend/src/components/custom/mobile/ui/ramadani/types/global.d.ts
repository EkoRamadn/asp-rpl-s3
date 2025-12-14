export type Status = 'fail' | 'succes';
export type SholatTimes = 'dzuhur' | 'ashar';
export type StatusPlayer = 'haid' | 'n';

export interface AbsesiStatus {
  id: string;
  nama_lengkap: string;
  nis: string;
  kelas: string;
  status: Status;
  message: string;
}

export interface Siswi {
  id: string;
  nama_lengkap: string;
  nis: string;
  kelas: string;
}

export interface NewAbsensi {
  id_siswi: number;
  tanggal: Date;
  waktu: string;
  status: StatusPlayer;
  keterangan: string;
  waktu_input: Date;
}

export interface Absensi {
  nama_lengkap: string;
  kelas: string;
  nis: string;
}

export interface PrayerTimes {
  Asr: string;
  Dhuhr: string;
  Isha: string;
  Maghrib: string;
  Fajr: string;
}

export type Sholat = 'Asr' | 'Dhuhr' | 'Isha' | 'Maghrib' | 'Fajr';

export interface DataAbsensi {
  id: number;
  tanggal: Date;
  waktu: SholatTimes;
  status: Status;
  keterangan: string | null;
  waktu_input: string;
  tbl_siswi: Absensi;
}

export type Role = 'admin' | 'pengawas' | 'petugas';

export interface LoginData {
  token: string;
  name: string;
  role: Role;
}
