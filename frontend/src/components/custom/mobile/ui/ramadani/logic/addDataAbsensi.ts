import { ApiFail, ApiResponse } from '@/lib/response';
import { NewAbsensi } from '../types/global';

interface Absensi {
  nama_lengkap: string;
  kelas: string;
  nis: string;
}

export const addDataAbsensi = async (payload: NewAbsensi): Promise<ApiResponse<Absensi>> => {
  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/absensi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ dtnew: payload }),
    });

    const dt: ApiResponse<Absensi> = await res.json();
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
