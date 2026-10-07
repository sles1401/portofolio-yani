import React from 'react';
import { sound } from '../utils/audio';

export const RecruitModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleClose = () => {
    sound.playClose();
    onClose();
  };

  const handleAction = () => {
    sound.playSelect();
  };

  return (
    <div className="rpg-modal-backdrop" role="dialog" aria-modal="true">
      <div className="rpg-modal-box recruit-theme">
        
        {/* Header */}
        <div className="rpg-modal-header">
          <div className="modal-title-wrap">
            <span className="modal-icon">🌟</span>
            <h3 className="modal-title">[POIN C] RECRUIT PORTAL — PROFIL & KERJASAMA</h3>
          </div>
          <button className="rpg-close-btn" type="button" onClick={handleClose} aria-label="Tutup Dialog">✕</button>
        </div>

        {/* Body */}
        <div className="rpg-modal-body">
          <div className="recruit-card-profile">
            <div className="recruit-avatar-wrapper">
              <img 
                src="assets/images/suryani-avatar.jpg" 
                alt="Suryani Lestari" 
                className="recruit-avatar-img"
              />
              <span className="party-role-tag">ROLE: QA SPECIALIST</span>
            </div>

            <div className="recruit-main-info">
              <h4 className="recruit-name">Suryani Lestari</h4>
              <p className="recruit-title">Software Quality Assurance Engineer • S-Tier Bug Hunter</p>
              
              <div className="dedication-box">
                <span className="dedication-badge">⚔️ DEDIKASI KERJA PROFESIONAL</span>
                <p className="dedication-text">
                  "Berdedikasi untuk menciptakan perangkat lunak yang andal, aman, dan bebas dari cacat rilis melalui pengujian alur fungsional presisi, perancangan skenario kasus batas (edge cases), serta koordinasi cepat dan tangkas bersama tim developer dan manajer produk."
                </p>
              </div>

              {/* Highlights */}
              <div className="recruit-highlights-grid">
                <div className="highlight-pill">
                  <span className="hl-val">100%</span>
                  <span className="hl-lbl">Komitmen Zero Blocker</span>
                </div>
                <div className="highlight-pill">
                  <span className="hl-val">Full-Lifecycle</span>
                  <span className="hl-lbl">Manual & Automated QA</span>
                </div>
                <div className="highlight-pill">
                  <span className="hl-val">High Integrity</span>
                  <span className="hl-lbl">Logistik, Web & Enterprise</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="recruit-actions-panel">
            <h5 className="actions-panel-title">HUBUNGI & REKRUT SURYANI KE TIM ANDA:</h5>
            <div className="recruit-buttons-row">
              <a
                href="mailto:suryanilestari123@gmail.com?subject=Tawaran%20Kolaborasi%20QA%20-%20Suryani%20Lestari"
                className="rpg-action-btn primary"
                onClick={handleAction}
              >
                <span>✉️</span> Kirim Tawaran Kolaborasi
              </a>

              <a
                href="https://www.linkedin.com/in/suryani-lestari/"
                target="_blank"
                rel="noopener noreferrer"
                className="rpg-action-btn linkedin-btn"
                onClick={handleAction}
              >
                <span>🌐</span> Terhubung ke Profil LinkedIn
              </a>

              <a
                href="https://suryani-lestari.my.id"
                target="_blank"
                rel="noopener noreferrer"
                className="rpg-action-btn secondary"
                onClick={handleAction}
              >
                <span>🔗</span> Kunjungi Website Utama
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="rpg-modal-footer">
          <span className="modal-hint">Suryani siap bergabung untuk sprint dan proyek berikutnya</span>
          <button className="rpg-action-btn secondary" type="button" onClick={handleClose}>
            Tutup Portal
          </button>
        </div>

      </div>
    </div>
  );
};
