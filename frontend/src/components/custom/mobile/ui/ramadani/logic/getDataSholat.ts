import { formatDMY } from '@/lib/utils';

interface PrayerTimes {
  Asr: string;
  Dhuhr: string;
  Isha: string;
  Maghrib: string;
  Fajr: string;
}

export const getDataSholat = async (date: Date) => {
  try {
    const dat = formatDMY(date);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_TIME_SHOLAT}/v1/timingsByCity/${dat}?city=Blitar&country=Indonesia&method=20`
    );

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const json = await res.json();
    if (!json.data) throw new Error('No data received from API');

    return json.data.timings as PrayerTimes;
  } catch (err) {
    console.error('Failed to fetch prayer times:', err);
    return {
      Fajr: '05:00',
      Dhuhr: '12:00',
      Asr: '15:00',
      Maghrib: '18:00',
      Isha: '19:30',
      Sunrise: '06:15',
      Sunset: '17:45',
    };
  }
};
