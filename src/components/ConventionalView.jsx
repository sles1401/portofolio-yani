import React from 'react';
import { sound, playFanfare } from '../utils/audio';

export const ConventionalView = ({ onReturnToGame, onShowToast }) => {
  const copyGuildAddress = () => {
    const contactEmail = "haga.qa.seeker@domain.com";
    sound.playCopyChirp();

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(contactEmail)
        .then(() => {
          onShowToast("COORDINATES RECORDED ON SCROLL! (" + contactEmail + ")");
        })
        .catch(() => {
          fallbackCopy(contactEmail);
        });
    } else {
      fallbackCopy(contactEmail);
    }
  };

  const fallbackCopy = (text) => {
    try {
      const tempInput = document.createElement("input");
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      onShowToast("COORDINATES RECORDED ON SCROLL! (" + text + ")");
    } catch {
      onShowToast("Email: " + text);
    }
  };

  return (
    <div className="conventional-container">
      {/* Top Banner to Return to Game */}
      <div className="recruiter-action-banner">
        <div>
          <span className="banner-badge">RECRUITER EXPRESS HUB • EKSEKUTIF SUMMARY</span>
          <h2 className="banner-title">Evaluasi Kualifikasi Teknis (&lt; 15 Detik) — Lead QA / SDET</h2>
        </div>
        <button 
          className="return-to-game-btn" 
          type="button" 
          onClick={() => {
            sound.playSelect();
            onReturnToGame();
          }}
        >
          <span>🎮</span> Masuk ke Jalur 1 (Immersive 2D Guild Map)
        </button>
      </div>

      {/* Profile Header */}
      <header className="profile-header-card">
        <div className="profile-flex">
          <div className="profile-img-wrap">
            <img 
              src="assets/images/haga-avatar.jpg" 
              alt="Haga Seeker" 
              className="profile-img-large"
            />
            <span className="haga-level-tag">SEEKER LV. 99</span>
          </div>

          <div className="profile-text">
            <div className="candidate-header-row">
              <div>
                <h1 className="candidate-name">HAGA</h1>
                <div className="candidate-role">
                  Lead World Debugger / Seeker Level 99 • Senior SDET / QA Architect
                </div>
              </div>
              <div className="candidate-status-pill">
                🟢 Ready for Full-Time Remote / On-Site Quest
              </div>
            </div>

            <p className="candidate-summary">
              Investigator celah sistem dan penjaga stabilitas arsitektur perangkat lunak berskala masif. Terinspirasi dari serial <em>Quality Assurance in Another World (Kono Sekai wa Fukanzen Sugiru)</em>, saya memandang setiap aplikasi bukan sebagai lembar kerja monoton, melainkan ekosistem hukum komputasi terdistribusi yang wajib diteliti ketahanan batasnya. Spesialis dalam arsitektur Playwright E2E parallelism, stress testing microservice dengan k6, profil alokasi memori runtime browser, dan eliminasi cacat regresi kritis hingga 0% defect leak.
            </p>

            {/* Quick Stats Bento */}
            <div className="quick-stats-strip">
              <div className="stat-pill">
                <strong>HP 999/999</strong>
                <small>Stamina Pengujian Eksploratori</small>
              </div>
              <div className="stat-pill">
                <strong>MP 480/550</strong>
                <small>Kapasitas Otomasi & Skrip</small>
              </div>
              <div className="stat-pill">
                <strong>0% Defect Leak</strong>
                <small>Checkout Flow 6 Bulan</small>
              </div>
              <div className="stat-pill">
                <strong>82% Speedup</strong>
                <small>Pipeline CI Sharding</small>
              </div>
            </div>

            <div className="contact-quick-links">
              <button 
                type="button" 
                className="contact-pill copy-btn"
                onClick={copyGuildAddress}
              >
                <span>📋</span> Copy Coordinates (haga.qa.seeker@domain.com)
              </button>

              <a 
                href="https://linkedin.com/in/haga-qa-seeker" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="contact-pill"
              >
                <span>💼</span> LinkedIn Terverifikasi
              </a>

              <a 
                href="https://github.com/haga-seeker/qa-test-citadel" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="contact-pill"
              >
                <span>🐙</span> Repositori GitHub Pengujian
              </a>

              <button className="contact-pill" onClick={() => window.print()} type="button">
                <span>🖨️</span> Cetak / Simpan Ringkasan PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 1.1 Tabel Dekonstruksi: Menghilangkan Kesan Kaku */}
      <section className="section-block">
        <h3 className="section-heading">
          <span>🔄</span> 1.1 Tabel Dekonstruksi: Menghilangkan Kesan Kaku
        </h3>
        <p className="section-subtext">
          Mentransformasikan terminologi pengujian standar konvensional menjadi representasi penjelajah dunia digital (Seeker).
        </p>

        <div className="table-responsive-wrapper">
          <table className="deconstruct-table">
            <thead>
              <tr>
                <th>Aspek Portofolio</th>
                <th>Format Lama (Kaku / Membosankan)</th>
                <th>Format Baru (QA Seeker Haga)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Identitas</strong></td>
                <td>Tester perangkat lunak biasa</td>
                <td className="highlight-cell">Investigator Celah & Penjaga Stabilitas Dunia</td>
              </tr>
              <tr>
                <td><strong>Pengalaman Kerja</strong></td>
                <td>Daftar riwayat perusahaan</td>
                <td className="highlight-cell">Arsip Ekspedisi Pembersihan Dungeon Kode</td>
              </tr>
              <tr>
                <td><strong>Katalog Defect</strong></td>
                <td>Spreadsheet bug dengan ID Jira</td>
                <td className="highlight-cell">Ensiklopedia Anomali beserta Metode Exorcism</td>
              </tr>
              <tr>
                <td><strong>Keahlian Alat</strong></td>
                <td>Deretan ikon logo tanpa konteks</td>
                <td className="highlight-cell">Perlengkapan Tempur Utama & Tameng Pertahanan</td>
              </tr>
              <tr>
                <td><strong>Kesan Pengunjung</strong></td>
                <td>Lembar CV digital pasif</td>
                <td className="highlight-cell">Pengalaman eksplorasi dunia pixel interaktif</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 4: Kerangka Quest Board (Studi Kasus Berbasis Nilai Bisnis) */}
      <section className="section-block">
        <h3 className="section-heading">
          <span>📜</span> 4. Guild Quest Clearance Records: Studi Kasus Berbasis Nilai Bisnis
        </h3>

        <div className="case-studies-stack">
          {/* Quest 1: Rank S */}
          <article className="case-study-card">
            <div className="case-header">
              <div>
                <span className="case-rank-pill rank-s">[Rank S] MAIN QUEST</span>
                <h4 className="case-title">E-Commerce Checkout E2E Automation Citadel</h4>
              </div>
              <span className="case-status">STATUS: PRODUCTION VERIFIED</span>
            </div>

            <div className="case-grid-details">
              <div className="case-column">
                <h5 className="sub-header-narrative">⚠️ Tantangan Awal (Objective)</h5>
                <p>
                  Uji regresi manual memakan waktu 45 menit dan sering meloloskan bug kalkulasi kupon diskon ganda ke tahap produksi.
                </p>

                <h5 className="sub-header-narrative">🔍 Solusi Seeker</h5>
                <p>
                  Membangun arsitektur framework Playwright berbasis TypeScript dengan eksekusi paralel multi-worker dan integrasi GitHub Actions sharding.
                </p>
              </div>

              <div className="case-column">
                <h5 className="sub-header-narrative">📊 Hasil Terukur & Dampak Bisnis</h5>
                <ul className="measured-results-bullets">
                  <li><strong>Waktu Eksekusi:</strong> Terpangkas dari 45 menit menjadi 8 menit (Efisiensi 82%).</li>
                  <li><strong>Defect Leak:</strong> Turun menjadi 0% pada alur pembayaran selama 6 bulan berturut-turut.</li>
                  <li><strong>Test Flakiness:</strong> Ditekan di bawah 0.2% melalui mekanisme custom locator auto-retrying.</li>
                </ul>

                <div className="case-badges-footer">
                  <span className="badge-item">🛡️ Coverage: 94.6%</span>
                  <span className="badge-item">⚔️ Bugs Slain: 18 Fatal Bugs</span>
                  <span className="badge-item">⚡ Relics: Playwright, TypeScript, Docker, GitHub Actions, Allure</span>
                </div>
              </div>
            </div>
          </article>

          {/* Quest 2: Rank A */}
          <article className="case-study-card">
            <div className="case-header">
              <div>
                <span className="case-rank-pill rank-a">[Rank A] STRESS EXORCISM</span>
                <h4 className="case-title">Fintech Transaction Microservice Stress Exorcism</h4>
              </div>
              <span className="case-status">STATUS: HIGH LOAD STABILIZED</span>
            </div>

            <div className="case-grid-details">
              <div className="case-column">
                <h5 className="sub-header-narrative">⚠️ Tantangan Awal (Objective)</h5>
                <p>
                  Risiko kebocoran koneksi database dan kegagalan transaksi saat event promo dengan lonjakan 20.000 pengguna bersamaan.
                </p>

                <h5 className="sub-header-narrative">🔍 Solusi Seeker</h5>
                <p>
                  Merancang skenario load & stress test terdistribusi menggunakan k6 dan memetakan throughput endpoint via Grafana.
                </p>
              </div>

              <div className="case-column">
                <h5 className="sub-header-narrative">📊 Hasil Terukur & Dampak Bisnis</h5>
                <ul className="measured-results-bullets">
                  <li><strong>Database Deadlock:</strong> Menemukan 4 titik deadlock pada database pooling dan koneksi pool leak.</li>
                  <li><strong>P99 Latency:</strong> Mengoptimasi response time P99 dari 480ms menjadi 115ms (76% improvement).</li>
                  <li><strong>Reliability:</strong> Menjamin 99.99% transaksi berhasil pada simulasi 25.000 RPS.</li>
                </ul>

                <div className="case-badges-footer">
                  <span className="badge-item">🛡️ Coverage: 91.2% API Endpoints</span>
                  <span className="badge-item">⚔️ Bugs Slain: 4 Concurrency Deadlocks</span>
                  <span className="badge-item">⚡ Relics: k6, Postman, PostgreSQL, Grafana, Docker</span>
                </div>
              </div>
            </div>
          </article>

          {/* Quest 3: Rank A */}
          <article className="case-study-card">
            <div className="case-header">
              <div>
                <span className="case-rank-pill rank-a">[Rank A] MOBILE MATRIX</span>
                <h4 className="case-title">Mobile Banking Multi-Device Matrix Campaign</h4>
              </div>
              <span className="case-status">STATUS: CROSS-DEVICE CERTIFIED</span>
            </div>

            <div className="case-grid-details">
              <div className="case-column">
                <h5 className="sub-header-narrative">⚠️ Tantangan Awal (Objective)</h5>
                <p>
                  Fragmentasi OS dan resolusi layar pada 30+ tipe device Android & iOS menyebabkan inkonsistensi rendering UI pada alur otentikasi biometrik & transfer dana.
                </p>

                <h5 className="sub-header-narrative">🔍 Solusi Seeker</h5>
                <p>
                  Membangun Device Farm Matrix berbasis Appium & BrowserStack dengan skrip assertions dinamis terhadap berbagai DPI dan versi OS.
                </p>
              </div>

              <div className="case-column">
                <h5 className="sub-header-narrative">📊 Hasil Terukur & Dampak Bisnis</h5>
                <ul className="measured-results-bullets">
                  <li><strong>Validasi Paralel:</strong> Menguji 32 tipe perangkat secara simultan dalam 12 menit pipeline.</li>
                  <li><strong>Early Crash Prevention:</strong> Menemukan 9 crash spesifik vendor OS sebelum dirilis ke Store.</li>
                  <li><strong>Kompatibilitas:</strong> Meningkatkan tingkat keberhasilan transaksi lintas perangkat menjadi 99.8%.</li>
                </ul>

                <div className="case-badges-footer">
                  <span className="badge-item">🛡️ Coverage: 95.5% Device Matrix</span>
                  <span className="badge-item">⚔️ Bugs Slain: 9 Vendor Crashes, 14 UI Clips</span>
                  <span className="badge-item">⚡ Relics: Appium, Python, BrowserStack, GitHub Actions, Jira</span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Section 5: Anomaly Bestiary: Dokumentasi Defect Mendalam */}
      <section className="section-block">
        <h3 className="section-heading">
          <span>👾</span> 5. Anomaly Bestiary: Dokumentasi Defect Mendalam
        </h3>
        <p className="section-subtext">
          Ensiklopedia anomali sistemik nyata beserta skenario reproduksi, analisis akar masalah (root-cause), dan solusi penyucian sistemik (exorcism).
        </p>

        <div className="bestiary-grid-executive">
          {/* Anomaly 1 */}
          <div className="bestiary-card-exec">
            <div className="b-card-top">
              <span className="b-icon">🐉</span>
              <div>
                <span className="b-sev sev-critical">CRITICAL SEVERITY</span>
                <h4 className="b-name">The Race Condition Wyrm</h4>
                <small className="b-type">Critical Concurrency Issue</small>
              </div>
            </div>
            <p className="b-behavior">
              <strong>Perilaku Anomali:</strong> Voucher belanja bernilai terbatas dapat diklaim 2 kali apabila dua request HTTP POST dikirimkan secara serentak dalam rentang 15 milidetik.
            </p>
            <p className="b-root">
              <strong>Akar Masalah:</strong> Backend memeriksa validitas kupon dan mengurangi kuota pada baris query terpisah tanpa mengunci baris data (lack of atomic transaction).
            </p>
            <p className="b-exorcism">
              <strong>Metode Exorcism:</strong> Mengimplementasikan distributed lock berbasis Redis dan constraint transaksi atomic di level database.
            </p>
          </div>

          {/* Anomaly 2 */}
          <div className="bestiary-card-exec">
            <div className="b-card-top">
              <span className="b-icon">👻</span>
              <div>
                <span className="b-sev sev-high">HIGH SEVERITY</span>
                <h4 className="b-name">The Memory Leak Specter</h4>
                <small className="b-type">SPA Dashboard Garbage Retention</small>
              </div>
            </div>
            <p className="b-behavior">
              <strong>Perilaku Anomali:</strong> Dashboard monitoring analitik perlahan menaikkan konsumsi RAM browser dari 150 MB menjadi 1.7 GB setelah dibuka selama 1 jam.
            </p>
            <p className="b-root">
              <strong>Akar Masalah:</strong> Event listener pada chart WebSocket tidak dilepas (cleanup function unmount missing) saat komponen dirender ulang.
            </p>
            <p className="b-exorcism">
              <strong>Metode Exorcism:</strong> Menambahkan pembersihan listener otomatis dan memverifikasi siklus memori menggunakan Chrome Heap Allocation Profiler.
            </p>
          </div>

          {/* Anomaly 3 */}
          <div className="bestiary-card-exec">
            <div className="b-card-top">
              <span className="b-icon">👤</span>
              <div>
                <span className="b-sev sev-high">HIGH SEVERITY</span>
                <h4 className="b-name">Null-Pointer Doppelganger</h4>
                <small className="b-type">Payload Edge-Case Crash</small>
              </div>
            </div>
            <p className="b-behavior">
              <strong>Perilaku Anomali:</strong> Crash seketika pada layar checkout mobile saat payload kontak sekunder bernilai null / undefined dalam response backend.
            </p>
            <p className="b-root">
              <strong>Akar Masalah:</strong> Parser JSON di klien berasumsi seluruh nested field kontak selalu berwujud string tanpa melakukan optional chaining atau schema guard.
            </p>
            <p className="b-exorcism">
              <strong>Metode Exorcism:</strong> Menerapkan validasi skema runtime (Zod) di API gateway dan defensive optional chaining serta schema fallback di DTO klien.
            </p>
          </div>

          {/* Anomaly 4 */}
          <div className="bestiary-card-exec">
            <div className="b-card-top">
              <span className="b-icon">⏳</span>
              <div>
                <span className="b-sev sev-medium">MEDIUM SEVERITY</span>
                <h4 className="b-name">Timezone Discord Phantom</h4>
                <small className="b-type">UTC vs Local Offset Billing Shift</small>
              </div>
            </div>
            <p className="b-behavior">
              <strong>Perilaku Anomali:</strong> Pelanggan di wilayah waktu Pasifik (UTC-10) menerima tagihan langganan satu hari lebih cepat dari tanggal jatuh tempo.
            </p>
            <p className="b-root">
              <strong>Akar Masalah:</strong> Penggunaan fungsi new Date().getDate() lokal tanpa normalisasi format ISO 8601 di server.
            </p>
            <p className="b-exorcism">
              <strong>Metode Exorcism:</strong> Parameterisasi pengujian dengan mocking timezone melalui Playwright Clock API dan pembakuan parsing UTC.
            </p>
          </div>
        </div>
      </section>

      {/* Section 6: Armory Tech Stack: Pemetaan Perlengkapan Tempur */}
      <section className="section-block">
        <h3 className="section-heading">
          <span>⚔️</span> 6. Armory Tech Stack & Passive Buffs
        </h3>

        {/* 6.1 Matriks Perlengkapan Tempur Seeker */}
        <div className="armory-table-wrap">
          <table className="deconstruct-table">
            <thead>
              <tr>
                <th>Slot Gear</th>
                <th>Peralatan (Tech Stack)</th>
                <th>Level Kemahiran</th>
                <th>Peran Lapangan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Main Hand Weapon</strong></td>
                <td>Playwright, TypeScript, Python</td>
                <td><span className="lvl-badge-text">Lv. 99 (Mastery)</span></td>
                <td>Eksekusi E2E lintas platform & headless</td>
              </tr>
              <tr>
                <td><strong>Off-Hand Shield</strong></td>
                <td>Postman, REST Assured, k6</td>
                <td><span className="lvl-badge-text">Lv. 94 (Advanced)</span></td>
                <td>Uji beban, boundary data & audit kontrak API</td>
              </tr>
              <tr>
                <td><strong>Body Armor</strong></td>
                <td>Docker, GitHub Actions, AWS</td>
                <td><span className="lvl-badge-text">Lv. 88 (Proficient)</span></td>
                <td>Isolasi runner pengujian & otomatisasi CI/CD</td>
              </tr>
              <tr>
                <td><strong>Relics</strong></td>
                <td>Charles Proxy, Chrome Profiler</td>
                <td><span className="lvl-badge-text">Lv. 85 (Field Proven)</span></td>
                <td>Analisis packet data & memory allocation</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 6.2 Pohon Keterampilan Pasif (Passive Buffs) */}
        <h4 className="sub-section-title-exec">Pohon Keterampilan Pasif (Passive Buffs — Soft Skills):</h4>
        <div className="passive-buffs-exec-grid">
          <div className="buff-exec-card">
            <strong>🦅 Eagle-Eye Pattern Recognition:</strong>
            <p>Ketajaman mengenali anomali kecil yang kerap terlewat dalam pengujian rutin.</p>
          </div>
          <div className="buff-exec-card">
            <strong>🗣️ Cross-Realm Communication:</strong>
            <p>Kemampuan menyampaikan temuan bug kepada developer secara konstruktif dan solutif.</p>
          </div>
          <div className="buff-exec-card">
            <strong>💖 User Empathy Aura:</strong>
            <p>Menempatkan diri sebagai pengguna akhir untuk menguji alur aplikasi yang rentan memicu kebingungan.</p>
          </div>
        </div>
      </section>

      {/* Section 10.3: Epilog Penutup Petualang */}
      <section className="section-block epilogue-block">
        <h3 className="section-heading">
          <span>🌟</span> 10.3 Epilog Penutup Petualang
        </h3>
        <blockquote className="haga-creed">
          "Tidak ada sistem yang sepenuhnya sempurna, namun dengan ketelitian dan integritas seorang Seeker, kita mampu membuat dunia perangkat lunak menjadi jauh lebih andal."
        </blockquote>
        <p className="epilogue-cta-text">
          Siap berkolaborasi untuk mengamankan kualitas arsitektur sistem dan pipeline testing perusahaan Anda.
        </p>
        <div className="epilogue-actions">
          <button type="button" className="contact-pill copy-btn" onClick={copyGuildAddress}>
            <span>📋</span> Salin Koordinat Surel Resmi
          </button>
          <a href="mailto:haga.qa.seeker@domain.com" className="contact-pill mailto">
            <span>✉️</span> haga.qa.seeker@domain.com
          </a>
        </div>
      </section>
    </div>
  );
};
