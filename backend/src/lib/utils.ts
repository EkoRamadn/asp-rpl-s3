import { IError } from '@/types/response.type';
import QRCode from 'qrcode';
import { supabase } from './supabase';
import { Asul } from 'next/font/google';

export function isIError(err: unknown): err is IError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    'status' in err &&
    'error' in err &&
    'message' in err
  );
}

// export async function generateQRCode(
//   nis: string,
//   nama: string,
//   kelas: string
// ): Promise<string> {
//   const data = generateDataQrcode(nis, nama, kelas);

//   try {
//     // Tunggu QR code dibuat (karena toDataURL() adalah async)
//     const qrData = await QRCode.toDataURL(data);

//     const jsonResult = JSON.stringify({
//       qrData,
//       createdAt: new Date().toISOString(),
//     });

//     return jsonResult; // hasil string JSON
//   } catch (error) {
//     console.error('Gagal generate QR:', error);
//     throw new Error('Gagal generate QR Code');
//   }
// }


export const addAbsensiBulan = async (
  id: number,
  tgl: string,
  waktu: string,
  ctn?: string,
) => {
  try {
    // cek data existing
    const { data: ab, error: eab } = await supabase
      .from('tbl_absensibulan')
      .select('id, absenwaktu')
      .eq('id_siswi', id)
      .eq('tanggal', tgl)
      .maybeSingle();

    if (eab && eab.code !== 'PGRST116') {
      throw new Error(eab.message);
    }

    const isAlreadyExists = !!ab;

    let result;

    if (!isAlreadyExists) {
      const { data, error } = await supabase
        .from('tbl_absensibulan')
        .insert({
          id_siswi: id,
          status: 'haid',
          absenwaktu: 1,
          tanggal: tgl,
          catatan: ctn,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      result = data;
    } else {
      const { data, error } = await supabase
        .from('tbl_absensibulan')
        .update({
          absenwaktu: Number(ab.absenwaktu) + 1,
          catatan: ctn,
        })
        .eq('id', ab.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      result = data;
    }

    return {
      message: isAlreadyExists
        ? 'Absensi berhasil diperbarui '
        : 'Absensi berhasil ditambahkan ',
      data: result,
      error: null,
    };
  } catch (err) {
    return {
      message: 'Terjadi kesalahan ',
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
};
