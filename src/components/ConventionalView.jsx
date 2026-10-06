import React from 'react';
import { sound } from '../utils/audio';

export const ConventionalView = ({ onReturnToGame, onShowToast }) => {
  const copyCoordinates = () => {
    const contactEmail = "contact@suryani-lestari.my.id";
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
    <div className="conventional-container recruiter-docket-layout">
      {/* Sticky Executive Action Banner */}
      <div className="recruiter-action-banner">
        <div>
          <span className="banner-badge">MODE B: RECRUITER DOCKET (LEMBAR EKSEKUTIF BERDENSITAS TINGGI)</span>
          <h2 className="banner-title">Evaluasi Kualifikasi Teknis (&lt; 15 Detik) — Suryani Lestari</h2>
        </div>
        <button 
          className="return-to-game-btn" 
          type="button" 
          onClick={() => {
            sound.playSelect();
            onReturnToGame();
          }}
        >
          <span>🎮</span> Masuk ke Mode A (Open-World Expedition 2400×1800px)
        </button>
      </div>

      {/* Hero Profile Card */}
      <header className="profile-header-card">
        <div className="profile-flex">
          <div className="profile-img-wrap">
            <img 
              src="assets/images/suryani-seeker-avatar.jpg" 
              alt="Suryani Lestari" 
              className="profile-img-large"
            />
            <span className="haga-level-tag">SEEKER LV. 95+</span>
          </div>

          <div className="profile-text">
            <div className="candidate-header-row">
              <div>
                <h1 className="candidate-name">SURYANI LESTARI</h1>
                <div className="candidate-role">
                  Lead System Seeker & Cross-Module Stability Guardian • QA Automation Engineer
                </div>
              </div>
              <div className="candidate-status-pill">
                🟢 Open for High-Impact QA Roles (Remote / Hybrid)
              </div>
            </div>

            <p className="candidate-summary">
              QA Specialist & Test Automation Engineer asal Bandung dengan basis operasi di <strong>suryani-lestari.my.id</strong>. Memadukan tema investigasi celah sistem ala <em>Seeker Haga</em> dengan proposisi nilai komersial nyata: penghematan 85% durasi regresi via Playwright JS, 0 defect leak pada sinkronisasi lintas modul (Marketing & PPIC), dan audit endpoint API tanpa celah.
            </p>

            {/* Quick 1-Click Action Buttons (Bab 2 & 9) */}
            <div className="contact-quick-links">
              <a 
                href="assets/docs/CV_Suryani_Lestari_QA_Automation.pdf" 
                className="contact-pill highlight-btn"
                download
                onClick={() => sound.playSelect()}
              >
                <span>📄</span> Download Seeker Resume (PDF)
              </a>

              <button 
                type="button" 
                className="contact-pill copy-btn"
                onClick={copyCoordinates}
              >
                <span>📋</span> Copy Email Coordinates (contact@suryani-lestari.my.id)
              </button>

              <a 
                href="https://suryani-lestari.my.id" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="contact-pill"
                onClick={() => sound.playSelect()}
              >
                <span>🌐</span> Digital Vault (suryani-lestari.my.id)
              </a>

              <a 
                href="https://linkedin.com/in/suryani-lestari" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="contact-pill"
                onClick={() => sound.playSelect()}
              >
                <span>💼</span> Guild Network (LinkedIn)
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Bab 02: 4 Metrik Komersial Utama (Hero Metrics) */}
      <section className="section-block">
        <h3 className="section-heading">
          <span>⚡</span> 02. Spesifikasi 4 Metrik Komersial Utama (Hero Metrics)
        </h3>

        <div className="hero-metrics-quad-grid">
          {/* Metric 1 */}
          <div className="hero-metric-box">
            <span className="hero-metric-tag">REGRESSION VELOCITY</span>
            <div className="hero-metric-val">Terpangkas 85%</div>
            <div className="hero-metric-sub">Dari 2 hari kerja (16 jam) ke 18 menit</div>
            <p className="hero-metric-biz">
              <strong>Relevansi Bisnis:</strong> Mempercepat siklus rilis fitur baru tanpa menambah headcount tim tester.
            </p>
          </div>

          {/* Metric 2 */}
          <div className="hero-metric-box">
            <span className="hero-metric-tag">CROSS-MODULE ACCURACY</span>
            <div className="hero-metric-val">0 Data Desync</div>
            <div className="hero-metric-sub">Marketing vs PPIC Engine</div>
            <p className="hero-metric-biz">
              <strong>Relevansi Bisnis:</strong> Mencegah kerugian finansial akibat order inventaris ganda atau barang fiktif.
            </p>
          </div>

          {/* Metric 3 */}
          <div className="hero-metric-box">
            <span className="hero-metric-tag">CRITICAL DEFECT CATCH</span>
            <div className="hero-metric-val">100% Intersepsi</div>
            <div className="hero-metric-sub">12 Anomali Mutasi Dicegat di Staging</div>
            <p className="hero-metric-biz">
              <strong>Relevansi Bisnis:</strong> Menjaga reputasi produk dan mencegah downtime aplikasi fatal sebelum rilis production.
            </p>
          </div>

          {/* Metric 4 */}
          <div className="hero-metric-box">
            <span className="hero-metric-tag">API CONTRACT RESILIENCE</span>
            <div className="hero-metric-val">100% Schema Conformity</div>
            <div className="hero-metric-sub">Postman / Newman CI Test Suite</div>
            <p className="hero-metric-biz">
              <strong>Relevansi Bisnis:</strong> Menjamin stabilitas integrasi backend microservices dan frontend dashboard client.
            </p>
          </div>
        </div>
      </section>

      {/* Bab 01: Matriks Re-framing Nilai Jual Profesional */}
      <section className="section-block">
        <h3 className="section-heading">
          <span>🔄</span> 01. Matriks Re-framing Nilai Jual Profesional (Positioning Komersial)
        </h3>

        <div className="table-responsive-wrapper">
          <table className="deconstruct-table">
            <thead>
              <tr>
                <th>Komponen Profil</th>
                <th>Data Nyata (suryani-lestari.my.id)</th>
                <th>Formulasi Komersial Seeker Haga</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Identitas & Gelar</strong></td>
                <td>Suryani Lestari, QA Engineer & Mentor</td>
                <td className="highlight-cell">Lead System Seeker & Cross-Module Stability Guardian</td>
              </tr>
              <tr>
                <td><strong>Core Deliverable</strong></td>
                <td>Automasi Playwright JS, E2E, API Test</td>
                <td className="highlight-cell">Penyusunan harness mitigasi risiko rilis & sensor anomali</td>
              </tr>
              <tr>
                <td><strong>Proyek Unggulan</strong></td>
                <td>Integrasi sistem Marketing & modul PPIC</td>
                <td className="highlight-cell">Ekspedisi Penyelamatan Sinkronisasi Data Lintas Realm</td>
              </tr>
              <tr>
                <td><strong>Nilai Konversi</strong></td>
                <td>Eksekusi test case terstruktur</td>
                <td className="highlight-cell">85%+ pemotongan durasi siklus regresi & ROI pengujian nyata</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Bab 05: Guild Quest Board (Studi Kasus Proyek) */}
      <section className="section-block">
        <h3 className="section-heading">
          <span>📜</span> 05. Guild Quest Board: 4 Berkas Studi Kasus Proyek Suryani Lestari
        </h3>

        <div className="case-studies-stack">
          {/* Quest 1 */}
          <article className="case-study-card">
            <div className="case-header">
              <div>
                <span className="case-rank-pill rank-s">[Rank S Quest] PIPELINE EXORCISM</span>
                <h4 className="case-title">The Cross-Module Pipeline Exorcism (Marketing to PPIC)</h4>
              </div>
              <span className="case-status">STATUS: 100% VERIFIED</span>
            </div>

            <p className="case-desc">
              Tantangan Kritis: Risiko perbedaan status transaksi asinkron antara antarmuka Marketing dan modul PPIC (Production Planning & Inventory Control) yang rawan memicu order ganda atau inventaris fiktif.
            </p>

            <table className="quest-compare-table" style={{ margin: '8px 0' }}>
              <thead>
                <tr>
                  <th>Parameter Pengujian</th>
                  <th>Sebelum Audit Seeker</th>
                  <th>Hasil Pasca-Implementasi Suryani Lestari</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Integritas Data Lintas Modul</strong></td>
                  <td className="before-cell">Rentan desync saat data dikirim bersamaan</td>
                  <td className="after-cell">✔ 0 data discrepancy; 100% verifikasi handshake state</td>
                </tr>
                <tr>
                  <td><strong>Metodologi Verifikasi</strong></td>
                  <td className="before-cell">Pengecekan spreadsheet manual antar tim</td>
                  <td className="after-cell">✔ Skrip otomatis Playwright JS + skenario prompt.md terstruktur</td>
                </tr>
                <tr>
                  <td><strong>Edge Case Terisolasi</strong></td>
                  <td className="before-cell">Tidak terdeteksi sebelum masuk produksi</td>
                  <td className="after-cell">✔ 12 anomali mutasi status berhasil dicegat di staging</td>
                </tr>
              </tbody>
            </table>

            <div className="case-badges-footer">
              <span className="badge-item">🛡️ Arsenal: Playwright Test Framework, JavaScript, Headless Isolation, GitHub Actions CI</span>
            </div>
          </article>

          {/* Quest 2 */}
          <article className="case-study-card">
            <div className="case-header">
              <div>
                <span className="case-rank-pill rank-a">[Rank A Quest] AUTONOMOUS REGRESSION</span>
                <h4 className="case-title">The Citadel of Autonomous Playwright Regression</h4>
              </div>
              <span className="case-status">STATUS: CLEAR</span>
            </div>

            <p className="case-desc">
              Membangun framework otomasi regresi berbasis Playwright JS dari nol untuk menguji seluruh alur konversi pengguna end-to-end. Memangkas waktu uji regresi manual dari 2 hari kerja (16 jam) menjadi 18 menit dengan eksekusi paralel multi-browser, mencapai 92% cakupan alur pengguna kritikal tanpa flakiness.
            </p>

            <div className="case-badges-footer">
              <span className="badge-item">⚡ 85% Speedup: 16 Jam ➔ 18 Menit</span>
              <span className="badge-item">🛡️ Coverage: 92% Critical Conversion Paths</span>
              <span className="badge-item">🔧 Relics: Playwright JS, Multi-Browser Parallel, Allure Reports</span>
            </div>
          </article>

          {/* Quest 3 & 4 */}
          <div className="case-grid-details">
            <div className="case-study-card">
              <div className="case-header">
                <div>
                  <span className="case-rank-pill rank-a">[Rank A Quest] API INTEGRITY</span>
                  <h4 className="case-title">Sanitasi & Validasi Kontrak REST API</h4>
                </div>
                <span className="case-status">STATUS: VERIFIED</span>
              </div>
              <p className="case-desc">
                Audit menyeluruh dan otomasi pengujian REST API menggunakan Postman/Newman, menjamin validasi skema payload JSON, token handshake, dan boundary test 100% konformitas skema.
              </p>
            </div>

            <div className="case-study-card">
              <div className="case-header">
                <div>
                  <span className="case-rank-pill rank-b">[Rank B Quest] QA GOVERNANCE</span>
                  <h4 className="case-title">Lumina Studio QA SOP Advisory</h4>
                </div>
                <span className="case-status">STATUS: COMPLETED</span>
              </div>
              <p className="case-desc">
                Perancangan SOP pengujian standar, test case template terstruktur, dan mentoring tim QA internal untuk memastikan konsistensi rilis berkala dan zero-blocker delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bab 06: Anomaly Bestiary (Defect Log) */}
      <section className="section-block">
        <h3 className="section-heading">
          <span>👾</span> 06. Anomaly Bestiary: Defect Log Investigatif Suryani Lestari
        </h3>

        <div className="bestiary-grid-executive">
          {/* Anomaly 1 */}
          <div className="bestiary-card-exec">
            <div className="b-card-top">
              <span className="b-icon">👻</span>
              <div>
                <span className="b-sev sev-critical">CRITICAL THREAT</span>
                <h4 className="b-name">The Desync Poltergeist</h4>
                <small className="b-type">Habitat: Webhook Marketing ➔ PPIC</small>
              </div>
            </div>
            <p className="b-root">
              <strong>Akar Masalah:</strong> Request ganda saat submit memicu event inventory deduction mendahului validasi payment.
            </p>
            <pre className="remediation-code-block" style={{ margin: '4px 0' }}>
              <code>{`// Exorcism: Idempotency Key & Promise Handshake
await page.waitForResponse(resp => 
  resp.url().includes("/api/ppic/sync") && resp.status() === 200
);`}</code>
            </pre>
          </div>

          {/* Anomaly 2 */}
          <div className="bestiary-card-exec">
            <div className="b-card-top">
              <span className="b-icon">🐛</span>
              <div>
                <span className="b-sev sev-high">HIGH SEVERITY</span>
                <h4 className="b-name">The Hydrating Null-Parasite</h4>
                <small className="b-type">Habitat: REST API Nested Array</small>
              </div>
            </div>
            <p className="b-root">
              <strong>Akar Masalah:</strong> Respon payload tanpa key opsional mengakibatkan white-screen crash pada client dashboard.
            </p>
            <pre className="remediation-code-block" style={{ margin: '4px 0' }}>
              <code>{`// Exorcism: Strict Contract Assertion
expect(responseBody).toHaveProperty("items");
expect(Array.isArray(responseBody.items)).toBeTruthy();`}</code>
            </pre>
          </div>

          {/* Anomaly 3 */}
          <div className="bestiary-card-exec">
            <div className="b-card-top">
              <span className="b-icon">👁️</span>
              <div>
                <span className="b-sev sev-medium">MEDIUM THREAT</span>
                <h4 className="b-name">The Shifting DOM Spectre</h4>
                <small className="b-type">Habitat: Dynamic Table Re-render</small>
              </div>
            </div>
            <p className="b-root">
              <strong>Akar Masalah:</strong> Pengujian gagal palsu (flaky) akibat selector XPath absolut yang berubah saat render.
            </p>
            <pre className="remediation-code-block" style={{ margin: '4px 0' }}>
              <code>{`// Exorcism: Resilient Role-Based Locators
await expect(page.getByRole("button", { name: /konfirmasi/i })).toBeVisible();`}</code>
            </pre>
          </div>

          {/* Anomaly 4 */}
          <div className="bestiary-card-exec">
            <div className="b-card-top">
              <span className="b-icon">🦑</span>
              <div>
                <span className="b-sev sev-edge">EDGE CASE</span>
                <h4 className="b-name">The Boundary Breach Kraken</h4>
                <small className="b-type">Habitat: Product Name & Notes Field</small>
              </div>
            </div>
            <p className="b-root">
              <strong>Akar Masalah:</strong> Input emoji dan karakter Unicode multibyte memotong data di database MySQL.
            </p>
            <pre className="remediation-code-block" style={{ margin: '4px 0' }}>
              <code>{`// Exorcism: UTF8MB4 Boundary Injection Testing
await inputField.fill("Test_Item_🔥__LongStringRepeat500Chars");`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Bab 07: Armory & Skill Tree */}
      <section className="section-block">
        <h3 className="section-heading">
          <span>⚔️</span> 07. Armory & Skill Tree: Perlengkapan Tempur Suryani Lestari
        </h3>

        <div className="armory-table-wrap">
          <table className="deconstruct-table">
            <thead>
              <tr>
                <th>Slot Perlengkapan</th>
                <th>Teknologi Terverifikasi</th>
                <th>Tingkat Kemahiran</th>
                <th>Peran & Nilai Tambah di Lapangan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Main Hand Weapon</strong></td>
                <td>Playwright (JavaScript)</td>
                <td><span className="lvl-badge-text">Mastery (Lv. 95)</span></td>
                <td>Otomasi alur kritis, browser context isolation, parallel sharding.</td>
              </tr>
              <tr>
                <td><strong>Off-Hand Shield</strong></td>
                <td>Postman / REST API</td>
                <td><span className="lvl-badge-text">Advanced (Lv. 92)</span></td>
                <td>Validasi skema JSON, automated runner collection, boundary test.</td>
              </tr>
              <tr>
                <td><strong>Body Armor</strong></td>
                <td>GitHub Actions & Git</td>
                <td><span className="lvl-badge-text">Proficient (Lv. 88)</span></td>
                <td>Integrasi uji otomatis pada pull request, headless matrix runs.</td>
              </tr>
              <tr>
                <td><strong>Support Relic</strong></td>
                <td>DevTools & Network Log</td>
                <td><span className="lvl-badge-text">Field Tested (Lv. 90)</span></td>
                <td>Tracing payload gagal, profil memory leak, inspeksi state DOM.</td>
              </tr>
              <tr>
                <td><strong>Methodology Relic</strong></td>
                <td>Manual Exploratory & SOP</td>
                <td><span className="lvl-badge-text">Expert (Lv. 96)</span></td>
                <td>Penyusunan test plan komprehensif, mentoring, mitigasi edge-case.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 className="sub-section-title-exec">Passive Buffs (Karakteristik Unggulan):</h4>
        <div className="passive-buffs-exec-grid">
          <div className="buff-exec-card">
            <strong>🦅 Meticulous Edge-Pathfinding:</strong>
            <p>Kejelian menemukan celah tersembunyi, inkonsistensi asinkron, dan batas kondisi input ekstrim.</p>
          </div>
          <div className="buff-exec-card">
            <strong>🗣️ Cross-Department Diplomacy:</strong>
            <p>Komunikasi solutif dan konstruktif dengan tim engineer dan product owner berbasis bukti skrip objektif.</p>
          </div>
          <div className="buff-exec-card">
            <strong>💖 User Advocacy Lens:</strong>
            <p>Memastikan UX intuitif, alur konversi tanpa friksi, dan aksesibilitas ramah bagi seluruh pengguna awam.</p>
          </div>
        </div>
      </section>

      {/* Bab 10: Epilog Petualang Seeker */}
      <section className="section-block epilogue-block">
        <h3 className="section-heading">
          <span>🌟</span> 10. Epilog Petualang Seeker
        </h3>
        <blockquote className="haga-creed">
          "Dengan portofolio ini, profil Suryani Lestari tampil sebagai kandidat QA yang langka: memiliki penguasaan teknis Playwright dan API yang solid, pola pikir investigasi yang tekun, serta kreativitas rekayasa antarmuka kelas atas yang langsung memikat recruiter sejak detik pertama."
        </blockquote>
        <div className="epilogue-actions">
          <button type="button" className="contact-pill copy-btn" onClick={copyCoordinates}>
            <span>📋</span> Salin Email (contact@suryani-lestari.my.id)
          </button>
          <a href="https://suryani-lestari.my.id" target="_blank" rel="noopener noreferrer" className="contact-pill mailto">
            <span>🌐</span> Kunjungi Digital Vault (suryani-lestari.my.id)
          </a>
        </div>
      </section>
    </div>
  );
};
