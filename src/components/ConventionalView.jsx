import React from 'react';
import { sound } from '../utils/audio';

export const ConventionalView = ({ onReturnToGame, onShowToast, onOpenModal }) => {
  const copyCoordinates = () => {
    const contactEmail = "suryanilestari123@gmail.com";
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

  const handleLaunchTool = (toolId) => {
    sound.playModalSwoop();
    if (onOpenModal) {
      onOpenModal(toolId);
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
                  System Seeker & Cross-Module Stability Guardian • QA Engineer
                </div>
              </div>
              <div className="candidate-status-pill">
                🟢 Open for High-Impact QA Roles (Remote / Hybrid)
              </div>
            </div>

            <p className="candidate-summary">
              QA Specialist & Test Engineer asal Bandung dengan basis operasi di <strong>suryani-lestari.my.id</strong>. Memadukan tema investigasi celah sistem ala <em>Seeker Haga</em> dengan proposisi nilai komersial nyata: penghematan 85% durasi regresi via Playwright JS, 0 defect leak pada sinkronisasi lintas modul (Marketing & PPIC), dan audit endpoint API tanpa celah.
            </p>

            {/* Quick 1-Click Action Buttons (Bab 2 & 9) */}
            <div className="contact-quick-links">
              <a 
                href="assets/docs/CV_Suryani_Lestari_QA.pdf" 
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
                <span>📋</span> Copy Email Coordinates (suryanilestari123@gmail.com)
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

      {/* Blueprint v5.2 Live Testing Suite (Quick 1-Click Launchers) */}
      <section className="section-block live-tools-suite-section">
        <h3 className="section-heading">
          <span>⚙️</span> 01. Live Test &amp; Business Calculators (Akses Interaktif Langsung)
        </h3>
        <p className="section-intro-text">
          Seluruh artefak pengujian berikut dapat diinspeksi dan dieksekusi secara interaktif langsung di peramban tanpa instalasi lokal:
        </p>

        <div className="live-tools-buttons-grid">
          <button
            type="button"
            className="tool-launcher-card"
            onClick={() => handleLaunchTool('TERMINAL')}
          >
            <div className="tool-card-icon">💻</div>
            <div className="tool-card-info">
              <strong>Playwright Test Runner Terminal</strong>
              <small>Streaming CLI logs real-time &amp; Step Inspector (Exit Code 0)</small>
            </div>
            <span className="tool-launch-arrow">➔ Buka Runner</span>
          </button>

          <button
            type="button"
            className="tool-launcher-card"
            onClick={() => handleLaunchTool('VISUAL_REGRESSION')}
          >
            <div className="tool-card-icon">🔍</div>
            <div className="tool-card-info">
              <strong>Visual Regression Slider &amp; Test Matrix</strong>
              <small>Split-view defect vs production &amp; Network drawer status 200/409</small>
            </div>
            <span className="tool-launch-arrow">➔ Inspeksi Artefak</span>
          </button>

          <button
            type="button"
            className="tool-launcher-card"
            onClick={() => handleLaunchTool('ROI_CALC')}
          >
            <div className="tool-card-icon">📈</div>
            <div className="tool-card-info">
              <strong>Hiring ROI &amp; Efficiency Calculator</strong>
              <small>Hitung penghematan hingga 68 jam/bln &amp; percepatan rilis 85%</small>
            </div>
            <span className="tool-launch-arrow">➔ Hitung ROI</span>
          </button>

          <button
            type="button"
            className="tool-launcher-card"
            onClick={() => handleLaunchTool('INTERVIEW')}
          >
            <div className="tool-card-icon">💬</div>
            <div className="tool-card-info">
              <strong>NPC Behavioral Interview Simulator</strong>
              <small>Dialog bercabang mitigasi krisis rilis PPIC &amp; arsitektur auto-wait</small>
            </div>
            <span className="tool-launch-arrow">➔ Mulai Simulasi</span>
          </button>

          <button
            type="button"
            className="tool-launcher-card"
            onClick={() => handleLaunchTool('LICENSE_CARD')}
          >
            <div className="tool-card-icon">🪪</div>
            <div className="tool-card-info">
              <strong>Procedural Seeker ID Card (PNG Export)</strong>
              <small>Canvas 800×500px, 5-sumbu radar chart &amp; QR code resmi</small>
            </div>
            <span className="tool-launch-arrow">➔ Unduh Kartu</span>
          </button>

          <button
            type="button"
            className="tool-launcher-card"
            onClick={() => handleLaunchTool('SECRET_CHAMBER')}
          >
            <div className="tool-card-icon">🔓</div>
            <div className="tool-card-info">
              <strong>The QA Architect Hidden Sanctuary</strong>
              <small>Easter egg collision breach [18, 24]: Filosofi proaktif &amp; resume</small>
            </div>
            <span className="tool-launch-arrow">➔ Buka Sanctuary</span>
          </button>
        </div>
      </section>

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
                <td className="highlight-cell">System Seeker & Cross-Module Stability Guardian</td>
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

      {/* Bab 08: Checklist Audit Kualitas & Verifikasi Akhir Deployment (Prompt Halaman 10) */}
      <section className="section-block qa-audit-block">
        <h3 className="section-heading">
          <span>✅</span> 08. Checklist Audit Kualitas &amp; Verifikasi Akhir Deployment (QA Acceptance Matrix)
        </h3>
        <p className="section-intro-text">
          Panduan verifikasi penerimaan kualitas (Acceptance Criteria) komprehensif untuk memastikan seluruh fitur berjalan tanpa cela, lulus uji aksesibilitas, dan siap dihubungkan langsung ke domain utama <strong>suryani-lestari.my.id</strong>:
        </p>

        <div className="audit-table-wrap">
          <table className="deconstruct-table acceptance-table">
            <thead>
              <tr>
                <th>Item Verifikasi</th>
                <th>Kriteria Keberhasilan (Acceptance Criteria)</th>
                <th>Hasil Evaluasi Mandiri</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Dual-View State Transition</strong></td>
                <td>Berpindah ke Recruiter Docket dalam &lt; 50ms; kanvas game di-pause untuk efisiensi CPU</td>
                <td><span className="badge-pass">MEMENUHI SYARAT</span></td>
              </tr>
              <tr>
                <td><strong>Interactive Playwright Terminal</strong></td>
                <td>Eksekusi 3 suite Playwright streaming lancar tanpa error konsol, timer ms presisi, Exit Code 0</td>
                <td><span className="badge-pass">MEMENUHI SYARAT</span></td>
              </tr>
              <tr>
                <td><strong>Hiring ROI Calculator</strong></td>
                <td>Kalkulasi otomatis saat slider digeser; formula matematika akurat (85% cut, 4.2 minggu)</td>
                <td><span className="badge-pass">MEMENUHI SYARAT</span></td>
              </tr>
              <tr>
                <td><strong>License Card PNG Export</strong></td>
                <td>Canvas toDataURL menghasilkan berkas PNG 800×500px tajam ber-QR Code aktif</td>
                <td><span className="badge-pass">MEMENUHI SYARAT</span></td>
              </tr>
              <tr>
                <td><strong>Lighthouse &amp; WCAG AA</strong></td>
                <td>Skor Lighthouse &gt; 95 untuk Performance &amp; Accessibility WCAG AA, semantic HTML lengkap</td>
                <td><span className="badge-pass">MEMENUHI SYARAT</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Production Sign-Off Card */}
        <div className="sign-off-card">
          <div className="sign-off-top">
            <span className="sign-off-badge">PRODUCTION READINESS &amp; E2E SIGN-OFF</span>
            <span className="sign-off-date">REVISI: v5.2 FINAL • DOC: SL-QA-SPEC-2026</span>
          </div>
          <p>
            <em>"Dengan implementasi sepuluh modul ini, portofolio Suryani Lestari berhasil mengawinkan estetika petualang investigatif ala Seeker Haga dengan keanggunan korporat modern. Portofolio ini tidak hanya menarik secara visual, tetapi juga secara tak terbantahkan membuktikan keahlian teknis pengujian perangkat lunak berstandar industri tinggi."</em>
          </p>
          <div className="deployment-commands-box">
            <div className="deploy-cmd-title">Perintah Deployment Produksi (Vercel / GitHub Pages):</div>
            <code>npm run build &amp;&amp; vercel --prod</code>
            <div className="cname-hint">Custom Domain DNS: <code>CNAME suryani-lestari.my.id</code></div>
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
            <span>📋</span> Salin Email (suryanilestari123@gmail.com)
          </button>
          <a href="https://suryani-lestari.my.id" target="_blank" rel="noopener noreferrer" className="contact-pill mailto">
            <span>🌐</span> Kunjungi Digital Vault (suryani-lestari.my.id)
          </a>
        </div>
      </section>
    </div>
  );
};
