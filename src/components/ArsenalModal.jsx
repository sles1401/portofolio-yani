import React, { useState } from 'react';
import { sound } from '../utils/audio';

const GEAR_ITEMS = [
  {
    id: 'main-hand',
    slot: 'Main Hand Weapon',
    slotIcon: '⚔️',
    tech: 'Playwright, TypeScript, Python',
    level: 'Lv. 99 (Mastery)',
    levelClass: 'lvl-mastery',
    role: 'Eksekusi E2E lintas platform & headless automation',
    description: 'Senjata utama untuk menembus benteng regresi aplikasi. Mendukung eksekusi paralel multi-worker, auto-retrying locators yang kebal dari flakiness, serta sharding terdistribusi pada CI/CD pipeline.',
    buffAttributes: [
      { stat: 'Parallel Worker Speed', val: '+400% Concurrency' },
      { stat: 'Flakiness Nullification', val: '< 0.2% Flaky Tolerance' },
      { stat: 'Cross-Engine Penetration', val: 'Chromium, WebKit, Firefox' }
    ]
  },
  {
    id: 'off-hand',
    slot: 'Off-Hand Shield',
    slotIcon: '🛡️',
    tech: 'Postman, REST Assured, k6',
    level: 'Lv. 94 (Advanced)',
    levelClass: 'lvl-advanced',
    role: 'Uji beban, boundary data & audit kontrak API',
    description: 'Tameng pertahanan integritas pertukaran data microservice. Melindungi backend dari spike beban tiba-tiba, menegakkan validasi skema JSON kontrak ketat, dan memverifikasi idempotency token transaksi.',
    buffAttributes: [
      { stat: 'Load Spike Resistance', val: 'Up to 25,000 RPS' },
      { stat: 'Schema Contract Guard', val: '100% Type Safe Validation' },
      { stat: 'P99 Latency Reduction', val: 'Optimized from 480ms ➔ 115ms' }
    ]
  },
  {
    id: 'body-armor',
    slot: 'Body Armor',
    slotIcon: '🥋',
    tech: 'Docker, GitHub Actions, AWS',
    level: 'Lv. 88 (Proficient)',
    levelClass: 'lvl-proficient',
    role: 'Isolasi runner pengujian & otomatisasi CI/CD',
    description: 'Baju zirah lingkungan terisolasi. Memastikan seluruh rangkaian pengujian berjalan deterministik tanpa terpengaruh perbedaan environment lokal mesin developer (It Works on My Machine syndrome destroyed).',
    buffAttributes: [
      { stat: 'Environment Parity', val: '100% Containerized Isolation' },
      { stat: 'Pipeline Gatekeeper', val: 'Zero Defect Leak to Staging' },
      { stat: 'Matrix Sharding Cloud', val: 'Dynamic Spot Runners' }
    ]
  },
  {
    id: 'relics',
    slot: 'Relic Accessories',
    slotIcon: '🔮',
    tech: 'Charles Proxy, Chrome Profiler',
    level: 'Lv. 85 (Field Proven)',
    levelClass: 'lvl-proven',
    role: 'Analisis packet data & memory allocation profiling',
    description: 'Artefak penglihatan tembus pandang telemetri runtime. Membedah traffic SSL/TLS payload secara langsung, merekayasa respons lambat/kegagalan jaringan, dan melacak kebocoran detached DOM memori heap.',
    buffAttributes: [
      { stat: 'Packet Manipulation', val: 'Real-Time Throttle & Breakpoint' },
      { stat: 'Heap Leak Detection', val: '0.1 MB Delta Precision' },
      { stat: 'Console Log Trapper', val: 'Uncaught Exception Sentry' }
    ]
  }
];

const PASSIVE_BUFFS = [
  {
    id: 'buff-1',
    name: 'Eagle-Eye Pattern Recognition',
    icon: '🦅',
    type: 'Analytical Cognitive Buff',
    effect: 'Ketajaman mengenali anomali kecil yang kerap terlewat dalam pengujian rutin, inkonsistensi perilaku edge-case, dan pola regresi tersembunyi.'
  },
  {
    id: 'buff-2',
    name: 'Cross-Realm Communication',
    icon: '🗣️',
    type: 'Interdisciplinary Synergy Buff',
    effect: 'Kemampuan menyampaikan temuan bug kepada developer, devops, dan product owner secara konstruktif, diplomatis, dan berbasis data solusi teknis konkret.'
  },
  {
    id: 'buff-3',
    name: 'User Empathy Aura',
    icon: '💖',
    type: 'Human-Centered Sensory Buff',
    effect: 'Menempatkan diri secara utuh sebagai pengguna akhir untuk menguji alur aplikasi yang rentan memicu kebingungan, friksi checkout, atau kegagalan aksesibilitas.'
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
            <h3>ARMORY TECH STACK & PASSIVE BUFFS</h3>
          </div>
          <div className="jrpg-header-badge">HAGA INVENTORY • SECTION 6</div>
          <button className="jrpg-close-btn" type="button" onClick={handleClose} aria-label="Tutup Dialog">
            [ESC] ✕
          </button>
        </div>

        {/* Body */}
        <div className="jrpg-window-body">
          {/* Seeker Status Bar Summary */}
          <div className="seeker-status-summary-bar">
            <div className="seeker-stats-left">
              <div className="seeker-avatar-mini">
                <img src="assets/images/haga-avatar.jpg" alt="Haga Seeker" />
                <span>HAGA (LV.99)</span>
              </div>
              <div className="seeker-vitals-bars">
                <div className="vital-item">
                  <div className="vital-label-row">
                    <span className="vital-name">HP [Stamina Pengujian Eksploratori]</span>
                    <span className="vital-num">999 / 999</span>
                  </div>
                  <div className="vital-track">
                    <div className="vital-fill hp-fill" style={{ width: '100%' }} />
                  </div>
                </div>

                <div className="vital-item">
                  <div className="vital-label-row">
                    <span className="vital-name">MP [Kapasitas Otomasi & Skrip]</span>
                    <span className="vital-num">480 / 550</span>
                  </div>
                  <div className="vital-track">
                    <div className="vital-fill mp-fill" style={{ width: '87.2%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="seeker-stats-badge">
              <span className="role-tag">LEAD WORLD DEBUGGER</span>
              <span className="ready-tag">READY FOR FIELD DEPLOYMENT</span>
            </div>
          </div>

          {/* Section 6.1: Matriks Perlengkapan Tempur Seeker */}
          <div className="armory-grid-layout">
            {/* Gear Selector Slots */}
            <div className="gear-slots-column">
              <h5 className="sub-section-title">EQUIPMENT SLOTS (4 SLOTS)</h5>
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

            {/* Selected Gear Dossier */}
            <div className="gear-inspect-dossier">
              <div className="inspect-header">
                <div>
                  <span className="inspect-slot-category">{selectedGear.slot}</span>
                  <h4 className="inspect-tech-name">{selectedGear.tech}</h4>
                  <p className="inspect-field-role">
                    <strong>Peran Lapangan:</strong> {selectedGear.role}
                  </p>
                </div>
                <span className={`inspect-level-pill ${selectedGear.levelClass}`}>
                  {selectedGear.level}
                </span>
              </div>

              <div className="inspect-desc-box">
                <p>{selectedGear.description}</p>
              </div>

              <h6 className="buff-attributes-title">TACTICAL SYSTEM BUFFS:</h6>
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

          {/* Section 6.2: Pohon Keterampilan Pasif (Passive Buffs) */}
          <div className="passive-buffs-section">
            <h5 className="sub-section-title">
              <span>🌟</span> POHON KETERAMPILAN PASIF (PASSIVE BUFFS - SOFT SKILLS)
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
          <span className="jrpg-footer-hint">Tech stack teruji di lingkungan produksi skala tinggi dengan zero tolerance terhadap flakiness.</span>
          <button type="button" className="jrpg-btn primary" onClick={handleClose}>
            [ESC] KEMBALI KE MARKAS GUILD
          </button>
        </div>
      </div>
    </div>
  );
};
