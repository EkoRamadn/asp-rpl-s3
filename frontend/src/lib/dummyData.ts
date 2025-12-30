export interface Report {
    id: number;
    student: string;
    studentId: string;
    nis: string;
    class: string;
    category: 'biological' | 'admin' | 'system';
    type: string;
    time: string;
    status: 'pending' | 'resolved' | 'completed'; 
    details: string;
    unread: boolean;
}

// --- 1. DATA PENGGUNA (LOGIN) ---
export const usersData = [
    { id: "U001", nama_lengkap: "Handika Rado Arganata", username: "admin_rado", password: "$2b$10$EixZaYVK1fsbw1Zfb", role: "Admin", last_login: "Sunday, November 09, 2025 at 03:27 PM WIB" },
    { id: "U002", nama_lengkap: "Budi Santoso", username: "budi_s", password: "$2b$10/p/o/n/m.L.K.J.I", role: "Admin", last_login: "Monday, November 10, 2025 at 08:15 AM WIB" },
    { id: "U003", nama_lengkap: "Siti Aminah", username: "siti_aminah", password: "$2b$10$AbCdEfEfGhIjKlMnOp", role: "Pengawas", last_login: "Monday, November 10, 2025 at 09:30 AM WIB" },
    { id: "U004", nama_lengkap: "Reza Rahadian", username: "reza_r", password: "$2b$10$7d8sd9s7d8", role: "Pengawas", last_login: "Sunday, November 09, 2025 at 05:45 PM WIB" },
    { id: "U005", nama_lengkap: "Dewi Sartika", username: "dewi_sartika", password: "$2b$10$1a2v3w4x5y6", role: "Pengawas", last_login: "Tuesday, November 11, 2025 at 07:00 AM WIB" },
    { id: "U006", nama_lengkap: "Joko Anwar", username: "joko_anw", password: "$2b$10$9z8y77d6c5b4", role: "Pengawas", last_login: "Saturday, November 08, 2025 at 10:20 PM WIB" },
    { id: "U007", nama_lengkap: "Andi Wijaya", username: "andi_wijaya", password: "$2b$10$9f0g1h2i3j4k5l", role: "Pelaksana", last_login: "Tuesday, November 11, 2025 at 01:10 PM WIB" },
    { id: "U008", nama_lengkap: "Maya Putri", username: "maya_putri", password: "$2b$108c9d0e1f2g3h4i5j", role: "Pelaksana", last_login: "Monday, November 10, 2025 at 02:45 PM WIB" },
    { id: "U009", nama_lengkap: "Rina Nose", username: "rina_n", password: "$2b$109b0c1d2e3f4g5h", role: "Pelaksana", last_login: "Sunday, November 09, 2025 at 11:15 AM WIB" },
    { id: "U010", nama_lengkap: "Doni Tata", username: "doni_tata", password: "$2b$10$g1h0a1b2c3d4e5f", role: "Pelaksana", last_login: "Saturday, November 08, 2025 at 04:00 PM WIB" },
];

// --- 2. DATA KELAS LENGKAP ---
export const classesData = [
    // KELAS XII
    { id: "C01", name: "XII MIPA 1", wali: "Bapak Surya", total_siswi: 10, total_berhalangan: "12 Hari", total_suci: "288 Hari", attendance: "96%", angkatan: "2022" },
    { id: "C02", name: "XII MIPA 2", wali: "Bapak Joko", total_siswi: 10, total_berhalangan: "15 Hari", total_suci: "285 Hari", attendance: "95%", angkatan: "2022" },
    { id: "C03", name: "XII MIPA 3", wali: "Ibu Siti", total_siswi: 10, total_berhalangan: "20 Hari", total_suci: "280 Hari", attendance: "93%", angkatan: "2022" },
    { id: "C04", name: "XII MIPA 4", wali: "Bapak Budi", total_siswi: 10, total_berhalangan: "10 Hari", total_suci: "290 Hari", attendance: "97%", angkatan: "2022" },
    { id: "C05", name: "XII IPS 1", wali: "Ibu Rina", total_siswi: 10, total_berhalangan: "25 Hari", total_suci: "275 Hari", attendance: "91%", angkatan: "2022" },
    { id: "C06", name: "XII IPS 2", wali: "Bapak Yusron", total_siswi: 10, total_berhalangan: "18 Hari", total_suci: "282 Hari", attendance: "94%", angkatan: "2022" },
    
    // KELAS XI
    { id: "C13", name: "XI MIPA 1", wali: "Bapak Surya", total_siswi: 10, total_berhalangan: "14 Hari", total_suci: "286 Hari", attendance: "95%", angkatan: "2023" },
    { id: "C14", name: "XI MIPA 2", wali: "Bapak Firlian", total_siswi: 10, total_berhalangan: "19 Hari", total_suci: "281 Hari", attendance: "93%", angkatan: "2023" },
    { id: "C15", name: "XI MIPA 3", wali: "Ibu Maya", total_siswi: 10, total_berhalangan: "12 Hari", total_suci: "288 Hari", attendance: "96%", angkatan: "2023" },
    { id: "C17", name: "XI IPS 1", wali: "Ibu Rina", total_siswi: 10, total_berhalangan: "28 Hari", total_suci: "272 Hari", attendance: "90%", angkatan: "2023" },
    { id: "C18", name: "XI IPS 2", wali: "Bapak Yusron", total_siswi: 10, total_berhalangan: "15 Hari", total_suci: "285 Hari", attendance: "95%", angkatan: "2023" },
    
    // KELAS X
    { id: "C25", name: "X MIPA 1", wali: "Ibu Maya", total_siswi: 10, total_berhalangan: "12 Hari", total_suci: "288 Hari", attendance: "96%", angkatan: "2024" },
    { id: "C26", name: "X MIPA 2", wali: "Bapak Haryo", total_siswi: 10, total_berhalangan: "20 Hari", total_suci: "280 Hari", attendance: "93%", angkatan: "2024" },
    { id: "C27", name: "X MIPA 3", wali: "Ibu Siti", total_siswi: 10, total_berhalangan: "15 Hari", total_suci: "285 Hari", attendance: "95%", angkatan: "2024" },
    { id: "C29", name: "X IPS 1", wali: "Bapak Yusron", total_siswi: 10, total_berhalangan: "30 Hari", total_suci: "270 Hari", attendance: "90%", angkatan: "2024" },
    { id: "C30", name: "X IPS 2", wali: "Bapak Hendri", total_siswi: 10, total_berhalangan: "25 Hari", total_suci: "275 Hari", attendance: "91%", angkatan: "2024" },
];

// --- 3. DATA SISWA (MASTER 100 DATA) ---
export const studentsData = [
    { id: "001", nis: "0100000001", name: "Aldo Pramana", class: "XI MIPA 1", gender: "Male", qrCode: "QR Code", status: "Active", notes: "-" },
    { id: "002", nis: "0100000002", name: "Alya Rahmadani", class: "XI IPS 1", gender: "Female", qrCode: "QR Code", status: "Active", notes: "-" },
    { id: "003", nis: "0100000003", name: "Arga Mahendra", class: "XI MIPA 2", gender: "Male", qrCode: "QR Code", status: "Active", notes: "-" },
    { id: "004", nis: "0100000004", name: "Aulia Salsabila", class: "X IPA 1", gender: "Female", qrCode: "QR Code", status: "Active", notes: "-" },
    { id: "005", nis: "0100000005", name: "Afan Prasetyo", class: "X IPS 2", gender: "Male", qrCode: "QR Code", status: "Active", notes: "-" },
    { id: "006", nis: "0100000006", name: "Anisa Putri", class: "XI BAHASA", gender: "Female", qrCode: "QR Code", status: "Active", notes: "-" },
    { id: "007", nis: "0100000007", name: "Arlin Natasya", class: "XII MIPA 1", gender: "Female", qrCode: "QR Code", status: "Active", notes: "-" },
    { id: "008", nis: "0100000008", name: "Azhar Firmansyah", class: "X AGAMA 2", gender: "Male", qrCode: "QR Code", status: "Active", notes: "-" },
    { id: "009", nis: "0100000009", name: "Aqila Zahra", class: "X MIPA 3", gender: "Female", qrCode: "QR Code", status: "Active", notes: "-" },
    { id: "010", nis: "0100000010", name: "Arvino Pradipta", class: "XI IPS 3", gender: "Male", qrCode: "QR Code", status: "Active", notes: "-" },
    { id: "011", nis: "0100000011", name: "Bima Saputra", class: "XI MIPA 1", gender: "Male", qrCode: "QR Code", status: "Active", notes: "-" },
    { id: "012", nis: "0100000012", name: "Bilqis Amalia", class: "XI IPS 2", gender: "Female", qrCode: "QR Code", status: "Active", notes: "-" },
    { id: "013", nis: "0100000013", name: "Bagus Pradana", class: "XII IPS 1", gender: "Male", qrCode: "QR Code", status: "Active", notes: "-" },
    { id: "014", nis: "0100000014", name: "Bella Kristina", class: "XI BAHASA", gender: "Female", qrCode: "QR Code", status: "Active", notes: "-" },
    { id: "015", nis: "0100000015", name: "Brandon Alexander", class: "X MIPA 4", gender: "Male", qrCode: "QR Code", status: "Active", notes: "-" },
    { id: "021", nis: "0100000021", name: "Candra Wirawan", class: "XI MIPA 3", gender: "Male", qrCode: "QR Code", status: "Active", notes: "-" },
    { id: "022", nis: "0100000022", name: "Cindy Marlina", class: "XI IPS 1", gender: "Female", qrCode: "QR Code", status: "Active", notes: "-" },
    { id: "031", nis: "0100000031", name: "Daffa Pratama", class: "XI MIPA 1", gender: "Male", qrCode: "QR Code", status: "Active", notes: "-" },
    { id: "041", nis: "0100000041", name: "Eka Pratiwi", class: "XI MIPA 1", gender: "Female", qrCode: "QR Code", status: "Active", notes: "-" },
    { id: "053", nis: "0100000053", name: "Fikri Hidayat", class: "XII IPS 2", gender: "Male", qrCode: "QR Code", status: "Active", notes: "-" },
    { id: "054", nis: "0100000054", name: "Fiona Aurelia", class: "XI BAHASA", gender: "Female", qrCode: "QR Code", status: "Active", notes: "-" },
    { id: "062", nis: "0100000062", name: "Gita Anjani", class: "XI IPS 1", gender: "Female", qrCode: "QR Code", status: "Active", notes: "-" },
    { id: "071", nis: "0100000071", name: "Hadi Pratama", class: "XI MIPA 1", gender: "Male", qrCode: "QR Code", status: "Active", notes: "-" },
    { id: "091", nis: "0100000091", name: "Jaka Prasetyo", class: "XI MIPA 1", gender: "Male", qrCode: "QR Code", status: "Active", notes: "-" },
    // ... Data lainnya dari list sebelumnya bisa dianggap ada di sini (untuk mempersingkat display)
];


// --- 4. HISTORY DATA (REAL-TIME PRAYER LOGS) ---
// Data ini untuk tabel log scan QR di Dashboard/Live View
export const historyData = [
    { id: 1, name: 'Aldo Pramana', kelas: 'XI MIPA 1', nis: '0100000001', waktu: '12:05:15', sesi: 'Dhuhr' },
    { id: 2, name: 'Bima Saputra', kelas: 'XI MIPA 1', nis: '0100000011', waktu: '12:06:22', sesi: 'Dhuhr' },
    { id: 3, name: 'Daffa Pratama', kelas: 'XI MIPA 1', nis: '0100000031', waktu: '12:08:45', sesi: 'Dhuhr' },
    { id: 4, name: 'Eka Pratiwi', kelas: 'XI MIPA 1', nis: '0100000041', waktu: '12:10:11', sesi: 'Dhuhr' },
    { id: 5, name: 'Jaka Prasetyo', kelas: 'XI MIPA 1', nis: '0100000091', waktu: '12:12:30', sesi: 'Dhuhr' },
    { id: 6, name: 'Hadi Pratama', kelas: 'XI MIPA 1', nis: '0100000071', waktu: '12:14:05', sesi: 'Dhuhr' },
    
    // Sesi Berbeda (Asr)
    { id: 7, name: 'Arga Mahendra', kelas: 'XI MIPA 2', nis: '0100000003', waktu: '15:15:10', sesi: 'Asr' },
    { id: 8, name: 'Bagus Pradana', kelas: 'XII IPS 1', nis: '0100000013', waktu: '15:16:44', sesi: 'Asr' },
    { id: 9, name: 'Cindy Marlina', kelas: 'XI IPS 1', nis: '0100000022', waktu: '15:18:20', sesi: 'Asr' },
    { id: 10, name: 'Alya Rahmadani', kelas: 'XI IPS 1', nis: '0100000002', waktu: '15:20:05', sesi: 'Asr' },
    { id: 11, name: 'Gita Anjani', kelas: 'XI IPS 1', nis: '0100000062', waktu: '15:22:15', sesi: 'Asr' },
    
    // Campuran Waktu
    { id: 12, name: 'Fikri Hidayat', kelas: 'XII IPS 2', nis: '0100000053', waktu: '12:05:55', sesi: 'Dhuhr' },
    { id: 13, name: 'Arlin Natasya', kelas: 'XII MIPA 1', nis: '0100000007', waktu: '12:07:30', sesi: 'Dhuhr' },
    { id: 14, name: 'Bella Kristina', kelas: 'XI BAHASA', nis: '0100000014', waktu: '12:09:12', sesi: 'Dhuhr' },
    { id: 15, name: 'Fiona Aurelia', kelas: 'XI BAHASA', nis: '0100000054', waktu: '12:11:45', sesi: 'Dhuhr' },
    { id: 16, name: 'Anisa Putri', kelas: 'XI BAHASA', nis: '0100000006', waktu: '12:13:20', sesi: 'Dhuhr' },
    
    // Data Sore
    { id: 17, name: 'Brandon Alexander', kelas: 'X MIPA 4', nis: '0100000015', waktu: '15:30:10', sesi: 'Asr' },
    { id: 18, name: 'Candra Wirawan', kelas: 'XI MIPA 3', nis: '0100000021', waktu: '15:32:45', sesi: 'Asr' },
    { id: 19, name: 'Aqila Zahra', kelas: 'X MIPA 3', nis: '0100000009', waktu: '15:35:22', sesi: 'Asr' },
    { id: 20, name: 'Afan Prasetyo', kelas: 'X IPS 2', nis: '0100000005', waktu: '15:38:00', sesi: 'Asr' },
];

// --- 5. MOCK ATTENDANCE (HISTORY ABSENSI HARIAN) ---
// Data untuk Detail View Siswa (ClassDetailView)
// --- 5. MOCK ATTENDANCE (HISTORY LAPORAN MANUAL) ---
export const mockAttendance = [
    // 1. Aldo/Data 001 (Sedang Haid, Lapor manual karena kartu ketinggalan)
    { 
        id: 101, 
        student_id: "001", 
        no: 1, 
        ket: "Lupa Bawa Kartu", 
        awal: "2025-12-25 07:00", 
        akhir: "-", 
        status: "Haid" 
    },
    { 
        id: 102, 
        student_id: "001", 
        no: 2, 
        ket: "Kartu Tidak Terbaca", 
        awal: "2025-12-24 07:05", 
        akhir: "-", 
        status: "Haid" 
    },

    // 2. Alya/Data 002 (Sudah Suci, Lapor manual)
    { 
        id: 201, 
        student_id: "002", 
        no: 1, 
        ket: "Lapor Selesai (Mandi)", 
        awal: "2025-12-25 06:45", 
        akhir: "2025-12-25 07:00", 
        status: "Suci" 
    },
    { 
        id: 202, 
        student_id: "002", 
        no: 2, 
        ket: "Kartu Hilang", 
        awal: "2025-12-20 07:15", 
        akhir: "-", 
        status: "Haid" 
    },

    // 3. Arga/Data 003 (Haid)
    { 
        id: 301, 
        student_id: "003", 
        no: 1, 
        ket: "Mesin Error", 
        awal: "2025-12-25 07:30", 
        akhir: "-", 
        status: "Haid" 
    },

    // 4. Aulia/Data 004 (Haid)
    { 
        id: 401, 
        student_id: "004", 
        no: 1, 
        ket: "Input Admin", 
        awal: "2025-12-25 07:10", 
        akhir: "-", 
        status: "Haid" 
    },
    
    // 5. Afan/Data 005 (Suci)
    { 
        id: 501, 
        student_id: "005", 
        no: 1, 
        ket: "Lapor Selesai", 
        awal: "2025-12-25 07:00", 
        akhir: "2025-12-25 07:05", 
        status: "Suci" 
    },
];

export const notificationsData: Report[] = [
    { 
        id: 101, 
        student: "Auliya Nur Azizah", 
        studentId: "siswi-045",
        nis: "221045", 
        class: "X MIPA 2", 
        category: "biological", // Frontend: Render warna MERAH
        type: "Peringatan Hari ke-8", // Sesuai Laporan 
        time: "Detected: Hari ini, 06.00", 
        status: 'pending', 
        details: "CRITICAL: Hari ini adalah hari ke-8. Siswi belum melakukan konfirmasi 'Suci'. Sistem butuh verifikasi manual.",
        unread: true 
    },
    { 
        id: 102, 
        student: "Siti Aminah", 
        studentId: "siswi-088",
        nis: "221088", 
        class: "XI IPS 1", 
        category: "biological", // Frontend: Render warna MERAH
        type: "Haid Terlalu Singkat", 
        time: "Detected: Kemarin, 14.30", 
        status: 'pending', 
        details: "ANOMALI: Durasi haid tercatat hanya 2 hari. Batas minimal sistem adalah 3 hari.",
        unread: true 
    },
    { 
        id: 103, 
        student: "Rina Permata", 
        studentId: "siswi-099",
        nis: "221099", 
        class: "XII MIPA 1", 
        category: "system", // Frontend: Render warna ORANGE/BIRU
        type: "Inkonsistensi Data", 
        time: "Detected: Hari ini, 15.15", 
        status: 'pending', 
        details: "KEJANGGALAN: Zhuhur = Scan QR (Ada), Ashar = Manual (Lupa). Cek log aktivitas.",
        unread: false 
    },
    { 
        id: 105, 
        student: "Budiwati", 
        studentId: "siswi-105",
        nis: "221105", 
        class: "X AGAMA 1", 
        category: "admin", // Frontend: Render warna KUNING
        type: "Kelalaian Berulang", 
        time: "Detected: Hari ini, 12.00", 
        status: 'pending', 
        details: "DISIPLIN: Siswi tercatat beralasan 'Tidak Membawa Kartu' 3x berturut-turut. Perlu teguran.",
        unread: true 
    },
];

// --- 7. REPORT ACTIONS (SOLUSI SESUAI ROLE PEMANTAU/ADMIN) ---
// Mengacu pada kewenangan Pemantau di Bab III
export const reportActions: Record<string, string[]> = {
    "Haid Melebihi Batas Normal": [
        "Konfirmasi ke Siswi (Wawancara)", 
        "Paksa Selesai (Set Suci)", 
        "Tandai Perpanjangan (Istihadhah)",
        "Hubungi Wali Kelas"
    ],
    "Haid Terlalu Singkat": [
        "Batalkan Input Terakhir (Salah Pencet)", 
        "Konfirmasi Medis", 
        "Biarkan (Validasi User)",
        "Arsipkan Laporan"
    ],
    "Inkonsistensi Data (Zhuhur vs Ashar)": [
        "Panggil Siswi (Klarifikasi)",
        "Tandai Sebagai Kelalaian", 
        "Reset Absensi Ashar",
        "Selesaikan Laporan"
    ],
    "Administrasi (Kartu Hilang)": [
        "Konfirmasi Cetak Kartu Baru", 
        "Tolak (Kartu Sudah Ditemukan)", 
        "Hubungi Tata Usaha",
        "Selesaikan Kasus"
    ],
    "Kelalaian Berulang": [
        "Cetak Surat Peringatan",
        "Panggil ke Ruang Tatib",
        "Notifikasi ke Wali Kelas",
        "Reset Counter Peringatan"
    ]
};