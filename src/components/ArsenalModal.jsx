import React, { useState } from 'react';
import { sound } from '../utils/audio';

const GEAR_ITEMS = [
  {
    id: 'main-hand',
    slot: 'Main Hand Weapon',
    slotIcon: '⚔️',
    tech: 'Playwright (JavaScript)',
    level: 'Mastery (Lv. 95)',
    levelClass: 'lvl-mastery',
    role: 'Otomasi alur kritis, browser context isolation, parallel sharding.',
    description: 'Senjata utama penembus siklus regresi. Mengotomasi alur checkout dan transaksi pengguna secara headless lintas browser (Chromium, Firefox, WebKit) dengan parallel worker sharding.',
    buffAttributes: [
      { stat: 'Parallel Sharding Boost', val: '+400% Concurrency' },
      { stat: 'Browser Context Parity', val: '100% Isolated Sessions' },
      { stat: 'Regression Speedup', val: 'Terpangkas 85% (18 Menit)' }
    ]
  },
  {
    id: 'off-hand',
    slot: 'Off-Hand Shield',
    slotIcon: '🛡️',
    tech: 'Postman / REST API',
    level: 'Advanced (Lv. 92)',
    levelClass: 'lvl-advanced',
    role: 'Validasi skema JSON, automated runner collection, boundary test.',
    description: 'Tameng penjaga integritas payload microservices. Memverifikasi validitas schema kontrak JSON, response code status, token authentication handshake, dan uji kasus batas negatif.',
    buffAttributes: [
      { stat: 'Contract Schema Safety', val: '100% Type Safe Assertions' },
      { stat: 'Idempotency Protection', val: 'Zero Double-Charge Risk' },
      { stat: 'Collection Runner', val: 'Newman CI Verification Runs' }
    ]
  },
  {
    id: 'body-armor',
    slot: 'Body Armor',
    slotIcon: '🥋',
    tech: 'GitHub Actions & Git',
    level: 'Proficient (Lv. 88)',
    levelClass: 'lvl-proficient',
    role: 'Integrasi uji otomatis pada pull request, headless matrix runs.',
    description: 'Baju zirah pipeline deployment. Menjadi gatekeeper rilis dengan mengeksekusi test runner secara otomatis pada setiap pull request branch staging dan release.',
    buffAttributes: [
      { stat: 'Continuous Testing Gate', val: 'Zero Defect Leak to Staging' },
      { stat: 'Matrix Workflow Parity', val: 'Multi-OS & Node Environment' },
      { stat: 'Branching Hygiene', val: 'Deterministic Test Verification' }
    ]
  },
  {
    id: 'support-relic',
    slot: 'Support Relic',
    slotIcon: '🔮',
    tech: 'DevTools & Network Log',
    level: 'Field Tested (Lv. 90)',
    levelClass: 'lvl-proven',
    role: 'Tracing payload gagal, profil memory leak, inspeksi state DOM.',
    description: 'Artefak observabilitas visual dan telemetri runtime browser. Membedah traffic network request/response, menelusuri unhandled exception konsol, dan profil memori heap.',
    buffAttributes: [
      { stat: 'Network Inspection', val: 'Sub-millisecond Timing Trace' },
      { stat: 'Heap Leak Diagnostic', val: 'DOM Node Leak Trapper' },
      { stat: 'Throttling Simulation', val: 'Slow 3G & Offline Emulation' }
    ]
  },
  {
    id: 'methodology-relic',
    slot: 'Methodology Relic',
    slotIcon: '📜',
    tech: 'Manual Exploratory & SOP',
    level: 'Expert (Lv. 96)',
    levelClass: 'lvl-mastery',
    role: 'Penyusunan test plan komprehensif, mentoring, mitigasi edge-case.',
    description: 'Grimoire metodologi rekayasa kualitas. Merancang Requirements Traceability Matrix (RTM), skenario uji positif/negatif, checklist regresi, serta standardisasi proses tim QA.',
    buffAttributes: [
      { stat: 'Test Plan Depth', val: '150+ Structured Test Cases' },
      { stat: 'User Story Traceability', val: '100% Acceptance Criteria Met' },
      { stat: 'Release Governance', val: 'Zero Blocker Production Delivery' }
    ]
  }
];

const PASSIVE_BUFFS = [
  {
    id: 'buff-1',
    name: 'Meticulous Edge-Pathfinding',
    icon: '🦅',
    type: 'Analytical Cognitive Buff',
    effect: 'Kejelian menemukan celah tersembunyi, inkonsistensi status asinkron, dan batas kondisi input ekstrim.'
  },
  {
    id: 'buff-2',
    name: 'Cross-Department Diplomacy',
    icon: '🗣️',
    type: 'Interdisciplinary Synergy Buff',
    effect: 'Komunikasi solutif dan konstruktif dengan tim engineer, DevOps, dan product owner berbasis bukti skrip objektif.'
  },
  {
    id: 'buff-3',
    name: 'User Advocacy Lens',
    icon: '💖',
    type: 'Human-Centered Sensory Buff',
    effect: 'Memastikan UX intuitif, alur konversi tanpa friksi, dan aksesibilitas ramah bagi seluruh pengguna awam.'
  }
];

export const ArsenalModal = ({ isOpen, onClose }) => {
  const [selectedGear, setSelectedGear] = useState(GEAR_ITEMS[0]);

  if (!isOpen) return null;

  const handleClose = () => {
    sound.playClose();
    onClose();
  };

  const handleSelectGear = (gear) => {
    sound.playSelect();
    setSelectedGear(gear);
  };

  return (
    <div className="jrpg-modal-backdrop" role="dialog" aria-modal="true" onClick={handleClose}>
      <div className="jrpg-window armory-window" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="jrpg-window-header">
          <div className="jrpg-header-title">
            <span className="jrpg-pixel-icon">⚔️</span>
            <h3>ARMORY & SKILL TREE: PERLENGKAPAN TEMPUR SURYANI LESTARI</h3>
          </div>
          <div className="jrpg-header-badge">BAB 07 • SKILLS LOADOUT</div>
          <button className="jrpg-close-btn" type="button" onClick={handleClose} aria-label="Tutup Dialog">
            [ESC] ✕
          </button>
        </div>

        {/* Body */}
        <div className="jrpg-window-body">
          {/* Seeker Vitals & Resources (Bab 7) */}
          <div className="seeker-status-summary-bar">
            <div className="seeker-stats-left">
              <div className="seeker-avatar-mini">
                <img src="assets/images/suryani-seeker-avatar.jpg" alt="Suryani Lestari" />
                <span>SURYANI</span>
              </div>
              <div className="seeker-vitals-bars">
                <div className="vital-item">
                  <div className="vital-label-row">
                    <span className="vital-name">HP [Ketahanan Pengujian Maraton]</span>
                    <span className="vital-num">999 / 999</span>
                  </div>
                  <div className="vital-track">
                    <div className="vital-fill hp-fill" style={{ width: '100%' }} />
                  </div>
                </div>

                <div className="vital-item">
                  <div className="vital-label-row">
                    <span className="vital-name">MP [Efisiensi Otomasi Scripting]</span>
                    <span className="vital-num">550 / 550</span>
                  </div>
                  <div className="vital-track">
                    <div className="vital-fill mp-fill" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="seeker-stats-badge">
              <span className="role-tag">ACCURACY: 99.8%</span>
              <span className="ready-tag">INTERSEPSI BUG KRITIS 100%</span>
            </div>
          </div>

          {/* 5 Gear Slots Grid */}
          <div className="armory-grid-layout">
            <div className="gear-slots-column">
              <h5 className="sub-section-title">EQUIPMENT SLOTS ({GEAR_ITEMS.length})</h5>
              <div className="gear-slot-buttons">
                {GEAR_ITEMS.map((gear) => (
                  <button
                    key={gear.id}
                    type="button"
                    className={`gear-slot-card ${selectedGear.id === gear.id ? 'active' : ''}`}
                    onClick={() => handleSelectGear(gear)}
                  >
                    <span className="gear-slot-icon">{gear.slotIcon}</span>
                    <div className="gear-slot-texts">
                      <span className="slot-name">{gear.slot}</span>
                      <strong className="gear-tech-title">{gear.tech}</strong>
                      <span className={`slot-lvl-badge ${gear.levelClass}`}>{gear.level}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Inspect Dossier */}
            <div className="gear-inspect-dossier">
              <div className="inspect-header">
                <div>
                  <span className="inspect-slot-category">{selectedGear.slot}</span>
                  <h4 className="inspect-tech-name">{selectedGear.tech}</h4>
                  <p className="inspect-field-role">
                    <strong>Peran & Nilai Tambah:</strong> {selectedGear.role}
                  </p>
                </div>
                <span className={`inspect-level-pill ${selectedGear.levelClass}`}>
                  {selectedGear.level}
                </span>
              </div>

              <div className="inspect-desc-box">
                <p>{selectedGear.description}</p>
              </div>

              <h6 className="buff-attributes-title">METRIK & UTILITAS OPERASIONAL:</h6>
              <div className="attributes-grid">
                {selectedGear.buffAttributes.map((attr, idx) => (
                  <div key={idx} className="attribute-pill">
                    <span className="attr-name">{attr.stat}:</span>
                    <span className="attr-val">{attr.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Passive Buffs (Bab 7) */}
          <div className="passive-buffs-section">
            <h5 className="sub-section-title">
              <span>🌟</span> PASSIVE BUFFS (KARAKTERISTIK UNGGULAN & SOFT SKILLS)
            </h5>
            <div className="passive-buffs-grid">
              {PASSIVE_BUFFS.map((buff) => (
                <div key={buff.id} className="passive-buff-card">
                  <div className="buff-card-top">
                    <span className="buff-icon-big">{buff.icon}</span>
                    <div>
                      <h6 className="buff-title">{buff.name}</h6>
                      <span className="buff-type-tag">{buff.type}</span>
                    </div>
                  </div>
                  <p className="buff-effect-desc">{buff.effect}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="jrpg-window-footer">
          <span className="jrpg-footer-hint">Seluruh teknologi siap pakai di lini produksi untuk menjamin zero-defect delivery.</span>
          <button type="button" className="jrpg-btn primary" onClick={handleClose}>
            [ESC] KEMBALI KE PENJELAJAHAN
          </button>
        </div>
      </div>
    </div>
  );
};
