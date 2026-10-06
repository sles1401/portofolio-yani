import React, { useState } from 'react';
import { sound } from '../utils/audio';

const QUEST_DOSSIERS = [
  {
    id: 'quest-1',
    rank: 'Rank S',
    rankClass: 'rank-s',
    title: 'The Cross-Module Pipeline Exorcism (Marketing to PPIC)',
    status: '100% VERIFIED',
    summary: 'Penyelamatan sinkronisasi data transaksi asinkron antara modul Marketing dan PPIC (Production Planning & Inventory Control) untuk mengeliminasi order ganda dan inventaris fiktif.',
    criticalChallenge: 'Risiko perbedaan status transaksi asinkron antara antarmuka Marketing dan modul PPIC yang rawan memicu order ganda atau inventaris fiktif.',
    comparisonTable: [
      {
        param: 'Integritas Data Lintas Modul',
        before: 'Rentan desync saat data dikirim bersamaan',
        after: '0 data discrepancy; 100% verifikasi handshake state'
      },
      {
        param: 'Metodologi Verifikasi',
        before: 'Pengecekan spreadsheet manual antar tim',
        after: 'Skrip otomatis Playwright JS + skenario prompt.md terstruktur'
      },
      {
        param: 'Edge Case Terisolasi',
        before: 'Tidak terdeteksi sebelum masuk produksi',
        after: '12 anomali mutasi status berhasil dicegat di staging'
      }
    ],
    weaponry: ['Playwright Test Framework', 'JavaScript', 'Headless Context Isolation', 'GitHub Actions CI'],
    measurableMetrics: [
      { label: 'Data Discrepancy', val: '0 Defect (Zero Desync)' },
      { label: 'Stage Interceptions', val: '12 Critical Anomalies Caught' },
      { label: 'Verification Protocol', val: 'Automated Promise Handshake' }
    ]
  },
  {
    id: 'quest-2',
    rank: 'Rank A',
    rankClass: 'rank-a',
    title: 'The Citadel of Autonomous Playwright Regression',
    status: 'CLEAR',
    summary: 'Membangun framework otomasi regresi berbasis Playwright JS dari nol untuk menguji seluruh alur konversi pengguna end-to-end secara headless dan paralel.',
    criticalChallenge: 'Siklus pengujian regresi manual yang memakan waktu 2 hari kerja (16 jam), rentan human error, dan memperlambat jadwal sprint rilis.',
    strategy: 'Membangun arsitektur framework Playwright JS modular dengan browser context isolation, parallel sharding, dan locator berbasis peranan (role-based queries).',
    measurableMetrics: [
      { label: 'Regression Velocity', val: '2 Hari (16 Jam) ➔ 18 Menit' },
      { label: 'Critical Flow Coverage', val: '92% Alur Konversi End-to-End' },
      { label: 'Flakiness Tolerance', val: '0% Flaky Runs via Auto-Retry' }
    ],
    weaponry: ['Playwright JS', 'Chromium/Firefox/WebKit', 'Allure Reports', 'GitHub Actions']
  },
  {
    id: 'quest-3',
    rank: 'Rank A',
    rankClass: 'rank-a',
    title: 'Sanitasi & Validasi Kontrak REST API',
    status: 'VERIFIED',
    summary: 'Pengujian ketahanan kontrak endpoint REST API microservices, memastikan validasi schema JSON, idempotency token, dan boundary data terproteksi.',
    criticalChallenge: 'Perubahan skema backend asinkron tanpa dokumentasi yang kerap memicu white-screen crash mendadak di sisi client dashboard.',
    strategy: 'Menyusun automated API test collection via Postman & Newman CI, menerapkan validasi tipe data ketat, dan negative testing boundary case.',
    measurableMetrics: [
      { label: 'Schema Conformity', val: '100% Contract Conformance' },
      { label: 'Endpoint Resilience', val: '50+ Critical Endpoints Audited' },
      { label: 'Pipeline Automation', val: 'Automated Newman CI Regression' }
    ],
    weaponry: ['Postman', 'Newman CLI', 'JSON Schema Assertions', 'REST Assured']
  },
  {
    id: 'quest-4',
    rank: 'Rank B',
    rankClass: 'rank-b',
    title: 'Lumina Studio QA Standard Operating Procedure Advisory',
    status: 'COMPLETED',
    summary: 'Perancangan SOP pengujian standar, test case template terstruktur, dan mentoring tim QA internal untuk memastikan rilis bebas blocker.',
    criticalChallenge: 'Tidak adanya standarisasi dokumentasi pengujian dan matriks penelusuran persyaratan (RTM), mengakibatkan pengujian sporadis antar tester.',
    strategy: 'Menyusun Comprehensive QA SOP, merancang template test plan terstruktur, dan melatih tim engineering dalam reproduksi bug objektif.',
    measurableMetrics: [
      { label: 'Test Scenarios Authored', val: '150+ Structured Cases' },
      { label: 'Traceability Index', val: '100% Story Acceptance Covered' },
      { label: 'Delivery Integrity', val: 'Zero Release Blocker on Launch' }
    ],
    weaponry: ['RTM Matrix', 'Jira QA Workflows', 'Test Plan Templates', 'Exploratory Charters']
  }
];

export const QuestModal = ({ isOpen, onClose }) => {
  const [selectedQuest, setSelectedQuest] = useState(QUEST_DOSSIERS[0]);

  if (!isOpen) return null;

  const handleClose = () => {
    sound.playClose();
    onClose();
  };

  const handleSelect = (q) => {
    sound.playSelect();
    setSelectedQuest(q);
  };

  return (
    <div className="jrpg-modal-backdrop" role="dialog" aria-modal="true" onClick={handleClose}>
      <div className="jrpg-window quest-window" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="jrpg-window-header">
          <div className="jrpg-header-title">
            <span className="jrpg-pixel-icon">📜</span>
            <h3>GUILD QUEST BOARD: STUDI KASUS PROYEK SURYANI LESTARI</h3>
          </div>
          <div className="jrpg-header-badge">BAB 05 • COMMERCIAL CASE STUDIES</div>
          <button className="jrpg-close-btn" type="button" onClick={handleClose} aria-label="Tutup Dialog">
            [ESC] ✕
          </button>
        </div>

        {/* Body */}
        <div className="jrpg-window-body">
          {/* Seeker Note */}
          <div className="jrpg-lore-notice">
            <div className="seeker-avatar-mini">
              <img src="assets/images/suryani-seeker-avatar.jpg" alt="Suryani Lestari" />
              <span>SURYANI</span>
            </div>
            <p className="jrpg-lore-text">
              "Fokus narasi diarahkan pada tantangan sistemik, mitigasi risiko data lintas modul (Marketing & PPIC), dan metrik efisiensi bisnis nyata yang dirasakan langsung oleh pemangku kepentingan."
            </p>
          </div>

          {/* Quest Selector Tabs */}
          <div className="quest-tabs-bar">
            {QUEST_DOSSIERS.map((q) => (
              <button
                key={q.id}
                type="button"
                className={`quest-tab-btn ${selectedQuest.id === q.id ? 'active' : ''}`}
                onClick={() => handleSelect(q)}
              >
                <span className={`quest-rank-pill ${q.rankClass}`}>{q.rank}</span>
                <span className="quest-tab-name">{q.title.split(' ')[0]} {q.title.split(' ')[1]}</span>
              </button>
            ))}
          </div>

          {/* Dossier Card */}
          <div className="quest-dossier-card">
            <div className="dossier-headline-row">
              <div>
                <span className={`quest-rank-tag ${selectedQuest.rankClass}`}>{selectedQuest.rank} DOSSIER</span>
                <h4 className="dossier-title">{selectedQuest.title}</h4>
              </div>
              <span className="dossier-status-stamp">{selectedQuest.status}</span>
            </div>

            <p className="dossier-summary">{selectedQuest.summary}</p>

            {/* Metrics Grid */}
            <div className="quest-metrics-grid">
              {selectedQuest.measurableMetrics.map((m, idx) => (
                <div key={idx} className="quest-metric-card">
                  <span className="q-metric-label">{m.label}</span>
                  <strong className="q-metric-val">{m.val}</strong>
                </div>
              ))}
            </div>

            {/* Critical Challenge Narrative */}
            <div className="narrative-box challenge">
              <h5 className="narrative-label">
                <span>⚠️</span> TANTANGAN KRITIS (PROBLEM STATEMENT)
              </h5>
              <p>{selectedQuest.criticalChallenge}</p>
            </div>

            {/* Quest 1 Specific Before / After Comparison Table (Page 5) */}
            {selectedQuest.comparisonTable && (
              <div className="comparison-table-wrapper">
                <h5 className="table-heading-prompt">
                  <span>📊</span> PARAMETER PENGUJIAN: SEBELUM VS PASCA-IMPLEMENTASI
                </h5>
                <table className="quest-compare-table">
                  <thead>
                    <tr>
                      <th>Parameter Pengujian</th>
                      <th>Sebelum Audit Seeker</th>
                      <th>Hasil Pasca-Implementasi Suryani Lestari</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedQuest.comparisonTable.map((row, idx) => (
                      <tr key={idx}>
                        <td><strong>{row.param}</strong></td>
                        <td className="before-cell">{row.before}</td>
                        <td className="after-cell">✔ {row.after}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Strategy if available */}
            {selectedQuest.strategy && (
              <div className="narrative-box solution">
                <h5 className="narrative-label">
                  <span>🔍</span> STRATEGI SEEKER & IMPLEMENTASI
                </h5>
                <p>{selectedQuest.strategy}</p>
              </div>
            )}

            {/* Weaponry / Arsenal */}
            <div className="relics-footer-row">
              <span className="relics-title">WEAPONRY / ARSENAL:</span>
              <div className="relics-tag-group">
                {selectedQuest.weaponry.map((w, idx) => (
                  <span key={idx} className="relic-chip">{w}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="jrpg-window-footer">
          <span className="jrpg-footer-hint">Setiap studi kasus dapat diverifikasi pada basis operasi suryani-lestari.my.id.</span>
          <button type="button" className="jrpg-btn primary" onClick={handleClose}>
            [ESC] KEMBALI KE PENJELAJAHAN
          </button>
        </div>
      </div>
    </div>
  );
};
