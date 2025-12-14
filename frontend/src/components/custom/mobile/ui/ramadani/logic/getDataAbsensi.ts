import { ApiFail, ApiResponse } from '@/lib/response';
import { DataAbsensi } from '../types/global';

export const getDataAbsensi = async (
  date: string,
  sholat?: string
): Promise<ApiResponse<{ absensi: DataAbsensi[] }>> => {
  const token = localStorage.getItem('token');

  try {
    const params = new URLSearchParams();

    params.set('tanggal', date);
    if (sholat) params.set('sholat', sholat);

    const url = `${process.env.NEXT_PUBLIC_API_URL}/absensi?${params.toString()}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const dt: ApiResponse<{ absensi: DataAbsensi[] }> = await res.json();
    console.log(dt);

    if (dt.status === 'fail') {
      throw new ApiFail(dt.message, dt.error ?? dt.message, dt.code);
    }

    if (!dt.data) {
      return new ApiFail('Format response tidak sesuai', 'Missing field: data.siswi');
    }

    return dt;
  } catch (err) {
    if (err instanceof ApiFail) {
      return err;
    }

    if (err instanceof Error) {
      return new ApiFail(err.message, 'client-error', 400);
    }

    return new ApiFail('Unexpected error', 'unknown-error', 500);
  }
};
