import React, { useEffect } from 'react';
import { sound } from '../utils/audio';

export const WelcomeModal = ({
  isOpen,
  onSelectMode,
  onClose,
  canClose = false,
  currentMode = null
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      // 1 or R: Recruiter Mode
      if (e.key === '1' || e.code === 'KeyR') {
        e.preventDefault();
        sound.playSelect();
        onSelectMode('recruiter');
      }
      // 2 or S or J: Seeker Mode
      else if (e.key === '2' || e.code === 'KeyS' || e.code === 'KeyJ') {
        e.preventDefault();
        sound.playSelect();
        onSelectMode('seeker');
      }
      // ESC: Close only if allowed
      else if (e.code === 'Escape' && canClose && onClose) {
        e.preventDefault();
        sound.playClose();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onSelectMode, onClose, canClose]);

  if (!isOpen) return null;

  return (
    <div className="welcome-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="welcome-headline">
      <div className="welcome-modal-grid-bg" aria-hidden="true" />

      <div className="welcome-modal-box">
        {/* Gateway Header Badge */}
        <div className="welcome-gateway-header">
          <div className="welcome-badge">
            <span className="welcome-badge-icon">⚡</span>
            <span>SYSTEM ACCESS GATEWAY • DUAL-TARGET AUDIENCE ROUTING</span>
          </div>

          {canClose && onClose && (
            <button
              type="button"
              className="welcome-dismiss-btn"
              onClick={() => {
                sound.playClose();
                onClose();
              }}
              title="Tutup dan tetap pada mode saat ini"
              aria-label="Tutup modal"
            >
              ✕
            </button>
          )}
        </div>

        {/* Avatar & Seeker Identity */}
        <div className="welcome-identity-row">
          <img
            src="public/assets/images/suryani-seeker-avatar.jpg"
            alt="Suryani Lestari Avatar"
            className="welcome-avatar-img"
          />
          <div className="welcome-identity-meta">
            <h3 className="welcome-identity-name">SURYANI LESTARI</h3>
            <span className="welcome-identity-role">
              System Seeker &amp; Cross-Module Stability Guardian • QA Engineer
            </span>
          </div>
        </div>

        {/* Headline */}
        <div className="welcome-headline-wrap">
          <h1 id="welcome-headline" className="welcome-main-headline">
            Select Your Exploration Mode
          </h1>
          <p className="welcome-subhead">
            Pilih metode navigasi portofolio yang paling sesuai dengan kebutuhan evaluasi Anda. 
            Mode dapat diubah kapan saja melalui tombol top bar atau shortcut <kbd>[M]</kbd>.
          </p>
        </div>

        {/* Dual Choice Cards */}
        <div className="welcome-modes-container">
          {/* Option 1: Primary - Recruiter Mode */}
          <div
            className={`welcome-choice-card recruiter-card primary ${currentMode === 'recruiter' ? 'is-active' : ''}`}
            onClick={() => {
              sound.playSelect();
              onSelectMode('recruiter');
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                sound.playSelect();
                onSelectMode('recruiter');
              }
            }}
          >
            <div className="card-top-banner">
              <span className="card-pill recommended">⚡ RECOMMENDED FOR HR &amp; HIRING MANAGERS</span>
              <span className="card-key-hint">Tekan [1] atau [R]</span>
            </div>

            <div className="card-title-row">
              <span className="card-emoji">📄</span>
              <div className="card-title-text">
                <h2 className="card-main-title">Recruiter Mode</h2>
                <span className="card-subtitle">(Quick Resume &amp; Case Studies)</span>
              </div>
            </div>

            <p className="card-description">
              Langsung trigger state <strong>Recruiter Docket [M]</strong> secara default tanpa render canvas map. Lembar eksekutif berdensitas tinggi untuk evaluasi kualifikasi dalam waktu kurang dari 15 detik.
            </p>

            <ul className="card-perks-list">
              <li>
                <span className="perk-check">✓</span>
                <span>Ringkasan CV Lengkap &amp; Download PDF Langsung</span>
              </li>
              <li>
                <span className="perk-check">✓</span>
                <span>Kalkulator ROI: Hemat 68 Jam/Bulan &amp; Efisiensi 85%</span>
              </li>
              <li>
                <span className="perk-check">✓</span>
                <span>Laporan Kasus Uji Nyata (Marketing &amp; PPIC Desync Zero)</span>
              </li>
              <li>
                <span className="perk-check">✓</span>
                <span>Performa Instan: Bebas Beban Canvas Map &amp; Ramah Mobile</span>
              </li>
            </ul>

            <button
              type="button"
              className="welcome-card-action-btn primary-action"
              onClick={(e) => {
                e.stopPropagation();
                sound.playSelect();
                onSelectMode('recruiter');
              }}
            >
              <span>📄 Masuk Recruiter Mode</span>
              <span className="action-arrow">➔</span>
            </button>
          </div>

          {/* Option 2: Secondary - Seeker / JRPG Mode */}
          <div
            className={`welcome-choice-card seeker-card secondary ${currentMode === 'seeker' ? 'is-active' : ''}`}
            onClick={() => {
              sound.playSelect();
              onSelectMode('seeker');
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                sound.playSelect();
                onSelectMode('seeker');
              }
            }}
          >
            <div className="card-top-banner">
              <span className="card-pill interactive">🎮 INTERACTIVE 2D OPEN-WORLD</span>
              <span className="card-key-hint">Tekan [2] atau [S]</span>
            </div>

            <div className="card-title-row">
              <span className="card-emoji">🎮</span>
              <div className="card-title-text">
                <h2 className="card-main-title">Seeker / JRPG Mode</h2>
                <span className="card-subtitle">(Interactive Map)</span>
              </div>
            </div>

            <p className="card-description">
              Tutup modal dan langsung masuk ke <strong>kontrol karakter di Central Plaza</strong> pada open-world tilemap skala 2400×1800px. Telusuri landmark pengujian, interaksi NPC, dan temukan anomali sistem secara dinamis.
            </p>

            <ul className="card-perks-list">
              <li>
                <span className="perk-check">✓</span>
                <span>Kontrol Karakter Langsung (WASD / Panah / Virtual D-Pad)</span>
              </li>
              <li>
                <span className="perk-check">✓</span>
                <span>5 Distrik Eksplorasi: Foundry, Sanctum, Pier, Plaza, Envoy</span>
              </li>
              <li>
                <span className="perk-check">✓</span>
                <span>Haga Debug Vision 2.0 Telemetry Scanner &amp; Wireframe</span>
              </li>
              <li>
                <span className="perk-check">✓</span>
                <span>Modern Web Audio Synthesizer Sound Engine</span>
              </li>
            </ul>

            <button
              type="button"
              className="welcome-card-action-btn secondary-action"
              onClick={(e) => {
                e.stopPropagation();
                sound.playSelect();
                onSelectMode('seeker');
              }}
            >
              <span>🎮 Masuk Seeker / JRPG Mode</span>
              <span className="action-arrow">➔</span>
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="welcome-modal-footer">
          <div className="storage-hint">
            <span className="storage-icon">💾</span>
            <span>
              Preferensi pilihan disimpan di <strong>localStorage</strong> browser Anda. Anda dapat berpindah mode kapan saja via tombol kontras di top bar atau tombol <kbd>[M]</kbd>.
            </span>
          </div>

          <div className="url-routing-hint">
            <span>Direct Link HRD: </span>
            <code>?view=recruiter</code>
            <span> atau </span>
            <code>#docket</code>
          </div>
        </div>
      </div>
    </div>
  );
};
