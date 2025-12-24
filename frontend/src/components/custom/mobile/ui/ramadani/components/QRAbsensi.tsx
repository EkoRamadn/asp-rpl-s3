'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeCameraScanConfig } from 'html5-qrcode';
import { Camera, CameraOff } from 'lucide-react';
import { Icon } from '@iconify/react';
import { AbsesiStatus, NewAbsensi, Sholat } from '../types/global';
import { addDataAbsensi } from '../logic/addDataAbsensi';
import { ApiSuccess } from '@/lib/response';
import { useError } from '@/hooks/useError';

interface ScannerQRProps {
  setPick: (siswi: AbsesiStatus) => void;
  setNAbsen: (value: boolean) => void;
  sholat: Sholat;
}

function checkTimeShoolat(sholat: Sholat): string {
  if (sholat === 'Dhuhr') return 'dzuhur';
  if (sholat === 'Asr') return 'ashar';
  return 'NaV';
}

export default function QRAbsensi({ setNAbsen, setPick, sholat }: ScannerQRProps) {
  const [cameraId, setCameraId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const { showError } = useError();

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (!devices || devices.length === 0) return;

        const backCam =
          devices.find((d) => d.label.toLowerCase().includes('back')) ||
          devices.find((d) => d.label.toLowerCase().includes('environment'));

        setCameraId(backCam ? backCam.id : devices[0].id);
      } catch (err) {
        console.error('Camera load error:', err);
      }
    };

    init();

    return () => {
      stopScannerNoAwait();
    };
  }, []);

  const validateQR = (text: string) => {
    try {
      const result = JSON.parse(text);
      return !!result?.id;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const sendData = async (id: string) => {
    const sholatTime = checkTimeShoolat(sholat);
    if (sholatTime === 'NaV') {
      showError('Sesi Sholat Tidak Tersedia');
      return;
    }
    const data: NewAbsensi = {
      id_siswi: Number(id),
      status: 'haid',
      keterangan: '',
      waktu: 'dzuhur',
      tanggal: new Date(),
      waktu_input: new Date(),
    };

    addDataAbsensi(data).then((result) => {
      setNAbsen(false);
      setNAbsen(true);
      if (result instanceof ApiSuccess)
        setPick({
          id: result.data.nis,
          nama_lengkap: result.data.nama_lengkap,
          nis: result.data.nis,
          kelas: result.data.kelas,
          status: result.status,
          message: result.message,
        });
    });
  };

  const startScanner = async () => {
    if (!cameraId) return;

    if (html5QrCodeRef.current) await stopScanner();

    const html5QrCode = new Html5Qrcode('reader');
    html5QrCodeRef.current = html5QrCode;

    setFadeIn(true);
    setFadeOut(false);
    setIsScanning(true);

    const config: Html5QrcodeCameraScanConfig = {
      fps: 10,
      qrbox: 250,
    };

    try {
      await html5QrCode.start(
        { deviceId: { exact: cameraId } },
        config,
        async (text) => {
          const scanned = text.trim();

          if (!validateQR(scanned)) {
            showError('QR salah! ini bukan format yang benar.');
            return;
          }

          await sendData(scanned);
          stopScanner();
        },
        () => { }
      );

      const video = document.querySelector('#reader video') as HTMLVideoElement | null;

      if (video) {
        video.style.objectFit = 'cover';
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.position = 'absolute';
        video.style.top = '0';
        video.style.left = '0';
      }

      // === FIX QR BOX SELALU CENTER ===
      setTimeout(() => {
        const qrBox = document.querySelector('#qr-shaded-region') as HTMLElement | null;

        if (qrBox) {
          qrBox.style.position = 'absolute';
          qrBox.style.top = '50%';
          qrBox.style.left = '50%';
          qrBox.style.transform = 'translate(-50%, -50%)';
          qrBox.style.width = '250px';
          qrBox.style.height = '250px';
          qrBox.style.boxSizing = 'content-box';
        }
      }, 150);
    } catch (err) {
      console.error('Start scanner error:', err);
      alert('Tidak dapat mengakses kamera.');
      stopScanner();
    }
  };

  const stopScannerNoAwait = () => stopScanner();

  const stopScanner = async () => {
    setFadeIn(false);
    setFadeOut(true);

    if (html5QrCodeRef.current) {
      try {
        if ('isScanning' in html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
      } catch (err) {
        console.warn('Stop scanner error:', err);
      }

      html5QrCodeRef.current = null;
    }

    setIsScanning(false);
    setTimeout(() => setFadeOut(false), 250);
  };

  const [isScan, setIsScan] = useState<boolean>();

  return (
    <div className="relative w-full h-full flex-1  overflow-hidden dark:bg-[rgb(21,20,25)]">
      {!isScanning && (
        <>
          <div className="dark:text-white/60 w-full h-full flex flex-col pt-[35%] items-center">
            <Icon icon="mdi:camera-off-outline" width="34%" height="34%" />
            <p className="font-mono text-md">The camera is turned off</p>
          </div>
        </>
      )}
      <div
        id="reader"
        className={`
                    absolute top-0 left-0 w-full h-full 
                    transition-opacity duration-300
                    ${fadeIn ? 'opacity-100' : 'opacity-0'}
                    ${fadeOut ? 'opacity-0' : ''}
                `}
      ></div>

      <div className="absolute bottom-6 w-full flex justify-center z-20">
        {!isScanning ? (
          <button
            onClick={() => {
              setIsScan(true);
              startScanner();
            }}
            className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center text-white shadow-lg"
          >
            <Camera size={26} />
          </button>
        ) : (
          <button
            onClick={() => {
              setIsScan(false);
              stopScanner();
            }}
            className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg"
          >
            <CameraOff size={26} />
          </button>
        )}
      </div>

      {isScanning && (
        <div className="absolute top-6 w-full text-center text-green-400 font-semibold animate-pulse">
          Scanning...
        </div>
      )}
    </div>
  );
}
