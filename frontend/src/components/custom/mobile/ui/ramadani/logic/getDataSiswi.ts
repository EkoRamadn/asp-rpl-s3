import { ApiFail, ApiResponse } from '@/lib/response';

interface Siswi {
  id: string;
  nama_lengkap: string;
  nis: string;
  kelas: string;
}

export const getDataSiswi = async (src: string): Promise<ApiResponse<{ siswi: Siswi[] }>> => {
  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/siswi?prm=${src}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const dt: ApiResponse<{ siswi: Siswi[] }> = await res.json();

    if (dt.status === 'fail') {
      throw new ApiFail(dt.message, dt.error ?? dt.message, dt.code);
    }

    if (!dt.data || !dt.data.siswi) {
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
