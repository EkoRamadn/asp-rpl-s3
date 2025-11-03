

# 🧩 Pedoman Kontribusi Proyek (CONTRIBUTING.md)

Dokumen ini berisi **aturan commit, push, dan kolaborasi Git/GitHub** untuk menjaga agar pengembangan proyek tetap rapi, terstruktur, dan mudah dikontrol oleh seluruh tim.

---

## 📁 Struktur Dasar Branch

Gunakan sistem branch berikut untuk pengembangan teratur:

```

main        → branch utama (stabil, siap deploy)
dev         → branch pengembangan (fitur diuji di sini)
feature/*   → branch untuk fitur baru
fix/*       → branch untuk perbaikan bug
hotfix/*    → branch untuk perbaikan mendesak di main

```

### Contoh:
```

feature/login-page
fix/navbar-overflow
hotfix/crash-on-start

```

---

## 🧠 Aturan Umum

* ❌ **Jangan langsung push ke `main` atau `dev`!**
* ✅ Gunakan branch masing-masing untuk mengembangkan fitur atau perbaikan.
* Setelah selesai:
  1. Commit dengan pesan yang jelas.
  2. Push ke branch kamu.
  3. Buat **Pull Request (PR)** ke `dev`.
* PR akan direview oleh anggota tim lain.
* Hanya **maintainer** yang boleh merge dari `dev` → `main`.

---

## 📝 Format Pesan Commit

Gunakan format **konvensional** agar histori commit mudah dibaca dan dilacak.

**Format:**
```

<type>: <pesan singkat dalam bahasa Indonesia atau Inggris>

```

### Jenis Commit

| Type     | Keterangan                                      |
| -------- | ----------------------------------------------- |
| feat     | Penambahan fitur baru                           |
| fix      | Perbaikan bug                                   |
| docs     | Perubahan dokumentasi                           |
| style    | Perubahan tampilan / format (tanpa ubah logika) |
| refactor | Refactor kode tanpa ubah fungsionalitas         |
| chore    | Update dependency / perubahan minor             |
| test     | Tambahan atau pembaruan testing                 |

### Contoh:
```

feat: (frontend) tambah halaman login user
fix: (frontend) perbaiki layout navbar di mobile
refactor: (frontend) pisahkan komponen button jadi reusable
docs: tambah panduan setup environment
feat: (backend) auth user login

````

---

## 🔄 Alur Kerja (Workflow) Harian

Langkah-langkah kerja harian agar kolaborasi tetap sinkron dan aman:

1. **Tarik update terbaru dari dev**
   ```bash
   git pull origin dev


2. **Buat branch baru**

   ```bash
   git checkout -b feature/nama-fitur
   ```

3. **Lakukan perubahan**

   ```bash
   git add .
   git commit -m "feat: deskripsi perubahan"
   ```

4. **Push branch ke GitHub**

   ```bash
   git push origin feature/nama-fitur
   ```

5. **Buat Pull Request (PR)** ke `dev` di GitHub.

---

## 🧩 Menyelesaikan Konflik (Conflict Resolution)

Jika muncul konflik saat merge:

1. Buka file konflik (biasanya ada tanda `<<<<<<<`, `=======`, `>>>>>>>`).

2. Pilih bagian kode yang benar atau gabungkan keduanya jika perlu.

3. Setelah diperbaiki:

   ```bash
   git add .
   git commit -m "fix: resolve conflict di <nama file>"
   git push origin <branch-kamu>
   ```

4. Setelah itu, lakukan ulang merge atau update PR kamu di GitHub.

---

## 🧼 Tips Tambahan

* Hindari commit file besar seperti:

  ```
  node_modules/
  dist/
  .env
  .next/
  build/
  ```
* Pastikan file `.gitignore` sudah benar untuk menghindari file tidak penting ikut ke repo.
* Jika kamu menambahkan library baru, informasikan tim.

---

## 🧭 Panduan Penamaan Branch & File

### 🔹 Penamaan Branch

Gunakan format berikut agar mudah dibaca dan dilacak:

```
feature/<nama-fitur>
fix/<nama-bug>
hotfix/<deskripsi-masalah>
```

**Contoh:**

```
feature/dashboard-analytics
fix/typo-on-footer
hotfix/deploy-error-vercel
```

### 🔹 Penamaan File / Folder

* Gunakan **kebab-case** untuk nama file dan folder.

  ```
  ✅ login-page.tsx
  ✅ user-profile-card.tsx
  ❌ LoginPage.tsx
  ❌ userProfileCard.tsx
  ```

---

## 🧩 Contoh Alur Lengkap (Real Case)

Misal kamu ingin menambahkan halaman login:

1. Pastikan branch `dev` up to date:

   ```bash
   git checkout dev
   git pull origin dev
   ```

2. Buat branch baru:

   ```bash
   git checkout -b feature/login-page
   ```

3. Kerjakan kodenya, lalu commit:

   ```bash
   git add .
   git commit -m "feat: tambah halaman login user"
   ```

4. Push branch:

   ```bash
   git push origin feature/login-page
   ```

5. Buka GitHub → buat Pull Request ke `dev`.

6. Tunggu review → jika disetujui, PR akan di-merge ke `dev`.

---

## ⚠️ Catatan Konflik Umum

Beberapa hal yang sering menyebabkan konflik:

* Tidak melakukan `git pull` sebelum mulai kerja.
* Mengedit file yang sedang dikerjakan orang lain tanpa koordinasi.
* Merge dari branch lama yang belum di-update.

**Solusi cepat:**

```bash
git fetch origin
git merge origin/dev
# perbaiki konflik jika ada
git add .
git commit -m "fix: resolve conflict setelah merge dev"
git push origin <branch-kamu>
```

---

## 🧑‍💻 Panduan Pull Request (PR)

Agar PR mudah direview:

1. Gunakan judul PR yang jelas:

   ```
   feat: tambah halaman dashboard admin
   ```
2. Isi deskripsi PR dengan poin-poin perubahan.
3. Tandai reviewer atau mention tim terkait.
4. Pastikan tidak ada error linting atau build.

---

## 🚀 Deployment & Release

1. Semua penggabungan ke `main` hanya dilakukan oleh maintainer.
2. Sebelum merge ke `main`, branch `dev` harus:

   * Sudah lulus testing.
   * Sudah direview.
   * Tidak ada konflik.
3. Setelah merge ke `main`, otomatis atau manual dilakukan **deployment** (misalnya ke Vercel, Netlify, atau server lain).

---

## 🧠 Etika Kolaborasi

* Hormati kode dan kontribusi tim lain.
* Jangan hapus atau ubah kode orang lain tanpa diskusi.
* Jika menemukan bug, buat issue atau PR dengan jelas.
* Gunakan komentar kode bila diperlukan untuk menjelaskan logika.

---

## 📣 Catatan Akhir

> Jangan gunakan Keyword `--force`, `-f` saat commit maupun push

> Selalu berkoordinasi dengan tim sebelum melakukan perubahan besar.


---

**Selamat berkontribusi dan semoga kolaborasi kita lancar 🚀**

