import React, { useState } from 'react';
import { sound } from '../utils/audio';

const QUEST_DATA = [
  {
    id: 'quest-1',
    rank: 'Rank S',
    rankClass: 'rank-s',
    title: 'E-Commerce Checkout E2E Automation Citadel',
    status: 'CLEARED & PRODUCTION VERIFIED',
    summary: 'Membangun arsitektur otomasi E2E berskala besar dengan eksekusi paralel multi-worker dan sharding CI/CD, mengeliminasi defect leak finansial.',
    initialChallenge: 'Uji regresi manual memakan waktu 45 menit dan sering meloloskan bug kalkulasi kupon diskon ganda ke tahap produksi.',
    seekerSolution: 'Membangun arsitektur framework Playwright berbasis TypeScript dengan eksekusi paralel multi-worker dan integrasi GitHub Actions sharding.',
    measurableResults: [
      'Waktu eksekusi terpangkas drastis dari 45 menit menjadi 8 menit (Efisiensi 82%).',
      'Defect leak pada alur pembayaran turun menjadi 0% selama 6 bulan berturut-turut.',
      'Test flakiness ditekan di bawah 0.2% dengan mekanisme custom locator auto-retrying & dynamic assertions.'
    ],
    anomaliesSlain: '18 Bug Fatal Dimusnahkan (Termasuk Double Coupon Exploits & Checkout Race Conditions)',
    testCoverage: '94.6% E2E Flow Coverage',
    speedup: '45m ➔ 8m (82% Pipeline Speedup)',
    relicsDeployed: ['Playwright', 'TypeScript', 'Docker', 'GitHub Actions', 'Allure Report'],
    artifacts: [
      { name: 'TestSuite_Checkout_E2E.ts', size: '14.2 KB', type: 'Playwright Spec' },
      { name: 'matrix-sharding.yml', size: '3.8 KB', type: 'GitHub Actions' },
      { name: 'Allure_Trend_Report.html', size: '2.1 MB', type: 'Test Telemetry' }
    ]
  },
  {
    id: 'quest-2',
    rank: 'Rank A',
    rankClass: 'rank-a',
    title: 'Fintech Transaction Microservice Stress Exorcism',
    status: 'CLEARED & HIGH LOAD STABILIZED',
    summary: 'Simulasi beban ekstrem terdistribusi pada cluster microservice ledger finansial guna mendeteksi bottleneck koneksi database di bawah traffic lonjakan tinggi.',
    initialChallenge: 'Risiko kebocoran koneksi database (connection pool exhaustion) dan kegagalan transaksi saat event promo dengan lonjakan 20.000 pengguna bersamaan.',
    seekerSolution: 'Merancang skenario load & stress test terdistribusi menggunakan k6 dan memetakan throughput endpoint via Grafana.',
    measurableResults: [
      'Menemukan 4 titik deadlock pada database pooling dan mengoptimasi latency P99 dari 480ms menjadi 115ms.',
      'Menjamin ketersediaan sistem 99.99% pada lonjakan trafik 25.000 requests per detik.',
      'Mencegah kegagalan settlement saldo dengan skenario verifikasi rollback otomatis.'
    ],
    anomaliesSlain: '4 Deadlock Concurrency Bugs & 2 Connection Leak Bottlenecks',
    testCoverage: '91.2% API Endpoints & Stress Scenarios',
    speedup: 'P99 Latency: 480ms ➔ 115ms (76% Latency Reduction)',
    relicsDeployed: ['k6', 'Postman', 'PostgreSQL', 'Grafana', 'Docker'],
    artifacts: [
      { name: 'k6-distributed-spike.js', size: '8.4 KB', type: 'k6 Script' },
      { name: 'pgpool_tuning_matrix.json', size: '4.1 KB', type: 'Config' },
      { name: 'Grafana_Throughput_Snapshot.png', size: '850 KB', type: 'Metrics' }
    ]
  },
  {
    id: 'quest-3',
    rank: 'Rank A',
    rankClass: 'rank-a',
    title: 'Mobile Banking Multi-Device Matrix Campaign',
    status: 'CLEARED & CROSS-DEVICE CERTIFIED',
    summary: 'Eksekusi pengujian otomatis matriks kompatibilitas lintas varian Android dan iOS untuk mengamankan otentikasi biometrik dan transfer dana.',
    initialChallenge: 'Fragmentasi OS dan resolusi layar pada 30+ tipe device Android & iOS menyebabkan inkonsistensi rendering UI pada alur otentikasi biometrik & transfer dana.',
    seekerSolution: 'Membangun Device Farm Matrix berbasis Appium & BrowserStack dengan skrip assertions dinamis terhadap berbagai DPI dan versi OS.',
    measurableResults: [
      'Memvalidasi 32 tipe perangkat secara simultan dalam 12 menit pipeline otomatis.',
      'Menemukan 9 crash spesifik vendor OS sebelum dirilis ke Google Play Store & Apple App Store.',
      'Kompatibilitas alur transaksi lintas perangkat melonjak menjadi 99.8% lulus uji.'
    ],
    anomaliesSlain: '9 Device-Specific Vendor Crashes & 14 UI Layout Clip Defects',
    testCoverage: '95.5% Multi-Device Matrix Coverage',
    speedup: 'Eksekusi Farm Paralel memangkas siklus uji rilis sebesar 85%',
    relicsDeployed: ['Appium', 'Python', 'BrowserStack', 'GitHub Actions', 'Jira'],
    artifacts: [
      { name: 'matrix_device_runner.py', size: '11.5 KB', type: 'Appium Runner' },
      { name: 'biometric_fallback_test.py', size: '6.2 KB', type: 'Test Case' },
      { name: 'device_compat_report.pdf', size: '1.4 MB', type: 'Audit Log' }
    ]
  }
];

export const QuestModal = ({ isOpen, onClose }) => {
  const [selectedQuest, setSelectedQuest] = useState(QUEST_DATA[0]);
  const [showArtifacts, setShowArtifacts] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    sound.playClose();
    setShowArtifacts(false);
    onClose();
  };

  const handleSelectQuest = (quest) => {
    sound.playSelect();
    setSelectedQuest(quest);
    setShowArtifacts(false);
  };

  const handleToggleArtifacts = () => {
    sound.playSelect();
    setShowArtifacts(!showArtifacts);
  };

  return (
    <div className="jrpg-modal-backdrop" role="dialog" aria-modal="true" onClick={handleClose}>
      <div className="jrpg-window quest-window" onClick={(e) => e.stopPropagation()}>
        
        {/* Retro JRPG Window Header */}
        <div className="jrpg-window-header">
          <div className="jrpg-header-title">
            <span className="jrpg-pixel-icon">📜</span>
            <h3>GUILD QUEST CLEARANCE RECORDS</h3>
          </div>
          <div className="jrpg-header-badge">HAGA ARCHIVES • SECTION 4</div>
          <button className="jrpg-close-btn" type="button" onClick={handleClose} aria-label="Tutup Dialog">
            [ESC] ✕
          </button>
        </div>

        {/* Modal Window Content */}
        <div className="jrpg-window-body">
          {/* Subheading / Lore Notice */}
          <div className="jrpg-lore-notice">
            <div className="seeker-avatar-mini">
              <img src="assets/images/haga-avatar.jpg" alt="Haga Seeker" />
              <span>HAGA (LV.99)</span>
            </div>
            <p className="jrpg-lore-text">
              "Setiap sistem aplikasi bukanlah dokumen kerjaan biasa, melainkan dunia virtual berisikan hukum komputasi. Inilah catatan misi pembersihan anomali berbasis nilai bisnis terukur."
            </p>
          </div>

          {/* Quest Selector Tabs */}
          <div className="quest-tabs-bar">
            {QUEST_DATA.map((quest) => (
              <button
                key={quest.id}
                type="button"
                className={`quest-tab-btn ${selectedQuest.id === quest.id ? 'active' : ''}`}
                onClick={() => handleSelectQuest(quest)}
              >
                <span className={`quest-rank-pill ${quest.rankClass}`}>{quest.rank}</span>
                <span className="quest-tab-name">{quest.title.split(' ')[0]} {quest.title.split(' ')[1]}</span>
              </button>
            ))}
          </div>

          {/* Selected Quest Dossier */}
          <div className="quest-dossier-card">
            <div className="dossier-headline-row">
              <div>
                <span className={`quest-rank-tag ${selectedQuest.rankClass}`}>{selectedQuest.rank} RECORD</span>
                <h4 className="dossier-title">{selectedQuest.title}</h4>
              </div>
              <span className="dossier-status-stamp">{selectedQuest.status}</span>
            </div>

            <p className="dossier-summary">{selectedQuest.summary}</p>

            {/* Core Metrics Bento */}
            <div className="quest-metrics-grid">
              <div className="quest-metric-card">
                <span className="q-metric-icon">⚔️</span>
                <span className="q-metric-label">Anomalies Slain</span>
                <strong className="q-metric-val">{selectedQuest.anomaliesSlain}</strong>
              </div>
              <div className="quest-metric-card">
                <span className="q-metric-icon">🛡️</span>
                <span className="q-metric-label">Test Coverage Shield</span>
                <strong className="q-metric-val">{selectedQuest.testCoverage}</strong>
              </div>
              <div className="quest-metric-card">
                <span className="q-metric-icon">⚡</span>
                <span className="q-metric-label">Execution Speedup</span>
                <strong className="q-metric-val">{selectedQuest.speedup}</strong>
              </div>
            </div>

            {/* Technical Narrative: Tantangan & Solusi */}
            <div className="narrative-split">
              <div className="narrative-box challenge">
                <h5 className="narrative-label">
                  <span>⚠️</span> TANTANGAN AWAL (OBJECTIVE)
                </h5>
                <p>{selectedQuest.initialChallenge}</p>
              </div>

              <div className="narrative-box solution">
                <h5 className="narrative-label">
                  <span>🔍</span> SOLUSI SEEKER (IMPLEMENTASI)
                </h5>
                <p>{selectedQuest.seekerSolution}</p>
              </div>
            </div>

            {/* Hasil Terukur */}
            <div className="results-box">
              <h5 className="results-label">
                <span>📊</span> HASIL TERUKUR & DAMPAK BISNIS
              </h5>
              <ul className="results-list">
                {selectedQuest.measurableResults.map((item, idx) => (
                  <li key={idx}>
                    <span className="check-icon">✔</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Relics Deployed (Arsenal Teknologi) */}
            <div className="relics-footer-row">
              <span className="relics-title">RELICS DEPLOYED:</span>
              <div className="relics-tag-group">
                {selectedQuest.relicsDeployed.map((tech, idx) => (
                  <span key={idx} className="relic-chip">{tech}</span>
                ))}
              </div>
            </div>

            {/* Toggle Artifacts */}
            <div className="artifacts-toggle-bar">
              <button 
                type="button" 
                className="jrpg-btn secondary"
                onClick={handleToggleArtifacts}
              >
                <span>📁</span> {showArtifacts ? 'Tutup Berkas Artefak Uji' : 'Buka Bukti Artefak & Skrip Uji'}
              </button>
            </div>

            {showArtifacts && (
              <div className="artifacts-drawer">
                <h5 className="drawer-title">BUKTI KELAYAKAN AUDIT QA & TEST REPOSITORY:</h5>
                <div className="artifacts-list">
                  {selectedQuest.artifacts.map((art, idx) => (
                    <div key={idx} className="artifact-item">
                      <span className="art-icon">📄</span>
                      <div className="art-info">
                        <strong>{art.name}</strong>
                        <small>{art.type} • {art.size}</small>
                      </div>
                      <span className="art-verified">VERIFIED BY SEEKER</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* JRPG Footer */}
        <div className="jrpg-window-footer">
          <span className="jrpg-footer-hint">Gunakan tombol di atas atau klik tab untuk meninjau studi kasus lain.</span>
          <button type="button" className="jrpg-btn primary" onClick={handleClose}>
            [ESC] KEMBALI KE MARKAS GUILD
          </button>
        </div>
      </div>
    </div>
  );
};
