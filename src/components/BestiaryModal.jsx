import React, { useState } from 'react';
import { sound } from '../utils/audio';

const BESTIARY_DATA = [
  {
    id: 'anom-1',
    name: 'The Desync Poltergeist',
    threatLevel: 'CRITICAL',
    threatClass: 'sev-critical',
    icon: '👻',
    habitat: 'Antrean webhook integrasi modul Marketing menuju PPIC.',
    rootCause: 'Request ganda saat submit memicu event inventory deduction mendahului validasi payment.',
    exorcismScript: `// Exorcism: Idempotency Key & Promise Handshake
await page.waitForResponse(resp => 
  resp.url().includes("/api/ppic/sync") && resp.status() === 200
);`,
    impactNotes: 'Mencegah terjadinya status transaksi desinkronisasi yang berisiko membuat order inventaris ganda atau barang terpotong tanpa bukti bayar terverifikasi.'
  },
  {
    id: 'anom-2',
    name: 'The Hydrating Null-Parasite',
    threatLevel: 'HIGH SEV',
    threatClass: 'sev-high',
    icon: '🐛',
    habitat: 'Endpoint REST API dengan array bersarang opsional.',
    rootCause: 'Respon payload tanpa key opsional mengakibatkan white-screen crash pada client dashboard.',
    exorcismScript: `// Exorcism: Strict Contract Assertion
expect(responseBody).toHaveProperty("items");
expect(Array.isArray(responseBody.items)).toBeTruthy();`,
    impactNotes: 'Menjamin stabilitas konsumsi API di front-end dengan penegakan assertion kontrak skema JSON terstruktur.'
  },
  {
    id: 'anom-3',
    name: 'The Shifting DOM Spectre',
    threatLevel: 'MEDIUM',
    threatClass: 'sev-medium',
    icon: '👁️',
    habitat: 'Tabel data dinamis dengan re-rendering asinkron.',
    rootCause: 'Pengujian gagal palsu (flaky) akibat selector XPath absolut yang berubah saat render.',
    exorcismScript: `// Exorcism: Resilient Role-Based Locators
await expect(page.getByRole("button", {
  name: /konfirmasi/i
})).toBeVisible();`,
    impactNotes: 'Mengeliminasi flakiness pengujian Playwright hingga 0.2% dengan beralih ke accessible role locators yang tahan terhadap refaktor UI.'
  },
  {
    id: 'anom-4',
    name: 'The Boundary Breach Kraken',
    threatLevel: 'EDGE CASE',
    threatClass: 'sev-edge',
    icon: '🦑',
    habitat: 'Input field nama produk & catatan pengiriman.',
    rootCause: 'Input emoji dan karakter Unicode multibyte memotong data di database MySQL.',
    exorcismScript: `// Exorcism: UTF8MB4 Boundary Injection Testing
await inputField.fill("Test_Item_🔥__LongStringRepeat500Chars");`,
    impactNotes: 'Memvalidasi sanitasi input batas panjang karakter ekstrim dan encoding UTF-8 (utf8mb4) sebelum menyentuh lapisan database persistent.'
  }
];

export const BestiaryModal = ({ isOpen, onClose }) => {
  const [selectedMonster, setSelectedMonster] = useState(BESTIARY_DATA[0]);

  if (!isOpen) return null;

  const handleClose = () => {
    sound.playClose();
    onClose();
  };

  const handleSelectMonster = (monster) => {
    sound.playGlitch();
    setSelectedMonster(monster);
  };

  return (
    <div className="jrpg-modal-backdrop" role="dialog" aria-modal="true" onClick={handleClose}>
      <div className="jrpg-window bestiary-window" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="jrpg-window-header">
          <div className="jrpg-header-title">
            <span className="jrpg-pixel-icon">👾</span>
            <h3>ANOMALY BESTIARY: DEFECT LOG INVESTIGATIF SURYANI LESTARI</h3>
          </div>
          <div className="jrpg-header-badge">BAB 06 • ROOT CAUSE MASTERY</div>
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
              "Laporan bug berformat Seeker Haga memangkas waktu debat tim teknis karena menyertakan reproduksi skrip otomatis dan saran perbaikan langsung pada baris kode yang bermasalah."
            </p>
          </div>

          <div className="bestiary-layout-split">
            {/* Left: Monster List */}
            <aside className="bestiary-catalog">
              <h5 className="catalog-heading">SPESIMEN ANOMALI SISTEMIK ({BESTIARY_DATA.length})</h5>
              <div className="monster-list">
                {BESTIARY_DATA.map((monster) => (
                  <button
                    key={monster.id}
                    type="button"
                    className={`monster-card-nav ${selectedMonster.id === monster.id ? 'active' : ''}`}
                    onClick={() => handleSelectMonster(monster)}
                  >
                    <span className="monster-badge-icon">{monster.icon}</span>
                    <div className="monster-nav-info">
                      <span className="monster-nav-name">{monster.name}</span>
                      <span className={`monster-nav-sev ${monster.threatClass}`}>
                        {monster.threatLevel}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            {/* Right: Detailed Dossier */}
            <main className="bestiary-detail-sheet">
              <div className="monster-sheet-header">
                <div className="monster-sheet-title-group">
                  <span className="monster-giant-icon">{selectedMonster.icon}</span>
                  <div>
                    <h4 className="monster-main-title">{selectedMonster.name}</h4>
                    <span className={`severity-badge-large ${selectedMonster.threatClass}`}>
                      THREAT LEVEL: {selectedMonster.threatLevel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Habitat */}
              <div className="dossier-section-block">
                <h5 className="dossier-subtitle">
                  <span>🗺️</span> HABITAT KEMUNCULAN ANOMALI
                </h5>
                <p className="dossier-body-text">{selectedMonster.habitat}</p>
              </div>

              {/* Akar Masalah */}
              <div className="dossier-section-block root-cause-highlight">
                <h5 className="dossier-subtitle">
                  <span>🧬</span> AKAR MASALAH (ROOT-CAUSE ANALYSIS)
                </h5>
                <p className="dossier-body-text">{selectedMonster.rootCause}</p>
              </div>

              {/* Exorcism Script */}
              <div className="dossier-section-block exorcism-block">
                <h5 className="dossier-subtitle">
                  <span>✨</span> EXORCISM SCRIPT (SOLUSI PENYUCIAN KODE)
                </h5>
                <pre className="remediation-code-block">
                  <code>{selectedMonster.exorcismScript}</code>
                </pre>
              </div>

              {/* Impact Notes */}
              <div className="dossier-section-block">
                <h5 className="dossier-subtitle">
                  <span>🛡️</span> NILAI PERLINDUNGAN SISTEM
                </h5>
                <p className="dossier-body-text">{selectedMonster.impactNotes}</p>
              </div>
            </main>
          </div>
        </div>

        {/* Footer */}
        <div className="jrpg-window-footer">
          <span className="jrpg-footer-hint">Setiap anomali dilengkapi skrip uji otomatis Playwright / Postman reproduktif 100%.</span>
          <button type="button" className="jrpg-btn primary" onClick={handleClose}>
            [ESC] KEMBALI KE PENJELAJAHAN
          </button>
        </div>
      </div>
    </div>
  );
};
