import { IError } from '@/types/response.type';
import QRCode from 'qrcode';

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
