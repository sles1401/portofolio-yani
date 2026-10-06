# 🛡️ QA Seeker Portfolio — Haga Edition (Versi 4.0)

> **Konsep Interaktif Bertema *Quality Assurance in Another World* (*Kono Sekai wa Fukanzen Sugiru*)**  
> **Persona:** **Haga**, Lead World Debugger / Seeker Level 99  
> **Fokus Karir:** Senior Quality Assurance Engineer / SDET / QA Architect  
> **Target:** Recruiter Global & Engineering Hiring Manager

---

## 1. Ikhtisar Eksekutif & Konsep Dasar

Platform portofolio penguji perangkat lunak (QA/SDET) interaktif bergaya penjelajah dunia digital (**Seeker**), di mana karakter Haga memandang setiap sistem aplikasi bukan sebagai dokumen kerja monoton, melainkan dunia virtual berisikan hukum fisika komputasi dan celah anomali yang harus diteliti secara tekun.

### 1.1 Tabel Dekonstruksi Karakter & Pengujian

| Aspek Portofolio | Format Lama (Kaku/Membosankan) | Format Baru (QA Seeker Haga) |
| :--- | :--- | :--- |
| **Identitas** | Tester perangkat lunak biasa | Investigator Celah & Penjaga Stabilitas Dunia |
| **Pengalaman Kerja** | Daftar riwayat perusahaan | Arsip Ekspedisi Pembersihan Dungeon Kode |
| **Katalog Defect** | Spreadsheet bug dengan ID Jira | Ensiklopedia Anomali beserta Metode Exorcism |
| **Keahlian Alat** | Deretan ikon logo tanpa konteks | Perlengkapan Tempur Utama & Tameng Pertahanan |
| **Kesan Pengunjung** | Lembar CV digital pasif | Pengalaman eksplorasi dunia pixel interaktif |

---

## 2. Arsitektur Kontrol Dual-View (Dual-View Mechanism)

Navigasi dua jalur yang bekerja secara paralel untuk kenyamanan eksplorasi maupun audit cepat:

1. **Jalur 1 (Immersive Mode):**  
   Viewport Canvas 2D interaktif tempat karakter Haga dapat berjalan menyusuri markas guild menggunakan WASD / Panah / Virtual D-pad / Klik navigasi.
2. **Jalur 2 (Recruiter Express Mode):**  
   Persistent navigation bar di header dan footer dengan tombol langsung (*Quests*, *Bestiary*, *Gear*, *Dispatch*) yang meluncurkan modal dialog JRPG secara instan tanpa harus menggerakkan karakter, memungkinkan HR mengekstrak kualifikasi dalam waktu kurang dari 15 detik.

### Shortcut Keyboard Global
- **`[M]`** : Buka Recruiter Express Hub / Menu Utama
- **`[D]`** : Toggle *Seeker Debug Vision*
- **`[ESC]`** : Menutup semua jendela modal dialog
- **`[SPACE]` / `[E]`** : Berinteraksi (*Inspect Object*) saat berada dalam radius < 72 px dari landmark
- **`WASD / Arrows`** : Pergerakan karakter (kecepatan 3.5 px/frame)

---

## 3. Fitur Tanda Khas: Seeker Debug Vision

Fitur adaptasi dari batu debug misterius Haga untuk melihat susunan sistem runtime:
1. **Phosphor Green Wireframe Grid:** Lapisan overlay kisi 32×32 pixel berwarna hijau fosfor (`#00FF88`).
2. **Telemetry Box Sudut Kanan Atas:**
   - *Target Environment:* Production (v4.0-Live)
   - *Current Coordinates:* X & Y real-time
   - *Frame Rate (FPS):* Penghitung FPS presisi berbasis delta-time
   - *Heap Memory Allocation:* Memori runtime MB melalui `performance.memory`
   - *Status Glitch Listener:* ACTIVE / SCANNING
3. **Bounding Box & Label Landmark:** Penanda koordinat entitas di setiap landmark interaktif.
4. **Radar Ring Pemindai:** Gelombang radar berdenyut di sekeliling sprite Haga.

---

## 4. Guild Quest Clearance Records (Studi Kasus Bisnis)

1. **[Rank S] E-Commerce Checkout E2E Automation Citadel**
   - *Tantangan:* Uji regresi manual memakan waktu 45 menit dan meloloskan bug diskon ganda ke produksi.
   - *Solusi:* Framework Playwright TypeScript dengan paralel multi-worker dan GitHub Actions sharding.
   - *Hasil Terukur:* Waktu uji terpangkas 45m ➔ 8m (82%), defect leak turun ke 0% selama 6 bulan, flakiness < 0.2%.
   - *Relics:* Playwright, TypeScript, Docker, GitHub Actions, Allure Report.
2. **[Rank A] Fintech Transaction Microservice Stress Exorcism**
   - *Tantangan:* Risiko database pool exhaustion & deadlock saat lonjakan 20.000 pengguna serentak.
   - *Solusi:* Skenario load & stress test terdistribusi k6 dengan telemetri endpoint Grafana.
   - *Hasil Terukur:* Menemukan 4 titik deadlock pooling, latency P99 turun dari 480ms ➔ 115ms (76%), availability 99.99%.
   - *Relics:* k6, Postman, PostgreSQL, Grafana, Docker.
3. **[Rank A] Mobile Banking Multi-Device Matrix Campaign**
   - *Tantangan:* Fragmentasi 30+ tipe device menyebabkan glitch layout & kegagalan otentikasi biometrik.
   - *Solusi:* Device Farm Matrix berbasis Appium & BrowserStack dengan dynamic assertions.
   - *Hasil Terukur:* Validasi 32 tipe device dalam 12 menit, mengeliminasi 9 vendor crashes sebelum rilis, kompatibilitas 99.8%.
   - *Relics:* Appium, Python, BrowserStack, GitHub Actions, Jira.

---

## 5. Anomaly Bestiary (Dokumentasi Defect Mendalam)

Katalog 4 spesimen anomali sistemik nyata beserta skenario reproduksi, analisis akar masalah (*root cause*), dan metode *exorcism* (*code remediation*):
1. **The Race Condition Wyrm** `[CRITICAL]` : Klaim voucher ganda akibat pembacaan tanpa lock database atomic. Remediasi: Redis distributed lock & row lock.
2. **The Memory Leak Specter** `[HIGH]` : RAM bengkak 150 MB ➔ 1.7 GB akibat listener WebSocket tak dilepas saat unmount. Remediasi: Pembersihan otomatis & Chrome Heap Profiler.
3. **Null-Pointer Doppelganger** `[HIGH]` : Crash checkout mobile akibat field opsional kontak null tanpa schema guard. Remediasi: Zod schema contract & optional chaining.
4. **Timezone Discord Phantom** `[MEDIUM]` : Tagihan prematur di zona Pasifik (UTC-10) karena `new Date().getDate()` lokal. Remediasi: Playwright Clock API mocking & standardisasi UTC.

---

## 6. Armory Tech Stack & Passive Buffs

- **Vitals Bar:** HP 999/999 (Stamina Pengujian Eksploratori) & MP 480/550 (Kapasitas Otomasi & Skrip).
- **Perlengkapan Tempur:**
  - *Main Hand Weapon:* Playwright, TypeScript, Python (Lv. 99 Mastery — E2E Cross-Platform)
  - *Off-Hand Shield:* Postman, REST Assured, k6 (Lv. 94 Advanced — Load & API Contracts)
  - *Body Armor:* Docker, GitHub Actions, AWS (Lv. 88 Proficient — Isolated CI/CD Runner)
  - *Relics:* Charles Proxy, Chrome Profiler (Lv. 85 Field Proven — Packet Data & Memory Allocation)
- **Passive Buffs (Soft Skills):**
  - *Eagle-Eye Pattern Recognition:* Ketajaman mendeteksi cacat tersembunyi.
  - *Cross-Realm Communication:* Komunikasi solutif & konstruktif lintas dev/product.
  - *User Empathy Aura:* Pengujian berbasis perspektif pengguna akhir.

---

## 7. Mesin Audio 8-Bit Native (Web Audio API)

Sintesis suara chiptune tanpa dependensi file audio fisik (.mp3/.wav):
1. **Footstep:** Square wave rendah (220 Hz, durasi 0.04s).
2. **Menu Select:** Nada harmonik ganda (440 Hz ➔ 880 Hz).
3. **Anomaly Glitch:** Sawtooth wave pitch modulation cepat (150 Hz ➔ 95 Hz).
4. **Quest Clear / Fanfare:** Arpeggio 4 nada segitiga kemenangan (C5, E5, G5, C6).
- Toggle audio instan via tombol HUD.

---

## 8. Guild Dispatch (Resepsionis Kontak Recruiter)

- **Formulir Kontrak Misi:** Input nama perekrut, email perusahaan, dan cakupan proyek dengan konfirmasi toast "*CONTRACT TRANSMITTED TO HAGA*" dan audio fanfare.
- **Copy Coordinates:** Salin instan alamat email resmi `haga.qa.seeker@domain.com` dengan fallback clipboard & audio feedback.
- **Tautan Berkas Formal:** Unduh CV PDF standar, LinkedIn terverifikasi, Repositori GitHub.
- **Status Ketersediaan:** "*Ready for Full-Time Remote / On-Site Quest*".

---

## 9. Cara Menjalankan & Build

```bash
# Instalasi dependensi (jika diperlukan)
npm install

# Build bundle produksi
npm run build

# Mode Watcher saat pengembangan
npm run dev
```

Buka `index.html` langsung di browser, atau jalankan melalui local server:
```bash
npx serve .
```

---

## 10. Epilog Penutup

> *"Tidak ada sistem yang sepenuhnya sempurna, namun dengan ketelitian dan integritas seorang Seeker, kita mampu membuat dunia perangkat lunak menjadi jauh lebih andal."*
