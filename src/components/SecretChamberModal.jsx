import React from 'react';
import { sound } from '../utils/audio';

export const SecretChamberModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleClose = () => {
    sound.playNavTick();
    onClose();
  };

  return (
    <div className="jrpg-modal-backdrop secret-chamber-backdrop" role="dialog" aria-modal="true" onClick={handleClose}>
      <div className="clean-tech-window secret-chamber-window" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="macos-window-header secret-header">
          <div className="window-dots">
            <span className="dot dot-red" onClick={handleClose} />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </div>
          <div className="window-title-badge secret-badge">
            <span>🔓</span> THE QA ARCHITECT HIDDEN SANCTUARY (COLLISION BREACH SUCCESSFUL)
          </div>
          <button className="window-close-text" type="button" onClick={handleClose}>
            TUTUP [ESC]
          </button>
        </div>

        {/* Body */}
        <div className="clean-modal-body secret-body">
          <div className="secret-achievement-banner">
            <span className="secret-trophy-icon">🏆</span>
            <div>
              <h4>EASTER EGG ANOMALI: BOUNDARY COLLISION BREACH TERTEMBUS!</h4>
              <p>Anda berhasil menemukan celah tabrakan dinding khas Seeker Haga di Automation Foundry [X: 18, Y: 24]. Selamat datang di ruang arsip rahasia Suryani Lestari.</p>
            </div>
          </div>

          <div className="secret-content-grid">
            {/* Box 1: Filosofi Pengujian Proaktif vs Reaktif */}
            <div className="secret-card">
              <div className="secret-card-top">
                <span className="s-icon">🧭</span>
                <h5>1. FILOSOFI PENGUJIAN: PROAKTIF VS REAKTIF</h5>
              </div>
              <p>
                "QA sejati tidak sekadar menunggu rilis selesai dikerjakan lalu mencari-cari kesalahan di ujung pipeline. Pengujian berkelas dunia dimulai dari fase diskusi spesifikasi user story (Shift-Left Testing): membedah asumsi implisit, mempertegas boundary contracts sebelum sebaris kode pun ditulis, dan memastikan seluruh modul memiliki handshake deterministik."
              </p>
            </div>

            {/* Box 2: Panduan Komunikasi Diplomatik QA Terhadap Developer */}
            <div className="secret-card">
              <div className="secret-card-top">
                <span className="s-icon">🤝</span>
                <h5>2. PANDUAN KOMUNIKASI DIPLOMATIK LINTAS REALM</h5>
              </div>
              <p>
                "Ketika menemukan cacat kritis, hindari kalimat menyalahkan seperti <em>'kodenya error'</em>. Gantikan dengan penyajian bukti objektif: skrip Playwright yang mereproduksi isu secara otomatis, cuplikan log payload HTTP, serta usulan solusi kode konkrit. Komunikasi yang solutif menjaga ritme kerja tim tetap harmonis dan memangkas waktu debat teknis."
              </p>
            </div>

            {/* Box 3: Peti Dokumen & Unduh CV */}
            <div className="secret-card highlight-card">
              <div className="secret-card-top">
                <span className="s-icon">📜</span>
                <h5>3. PETI DOKUMEN RESMI SURYANI LESTARI</h5>
              </div>
              <p>
                Arsip kualifikasi lengkap, portfolio komersial Playwright JS, dan sertifikasi pengujian siap dipelajari oleh tim rekrutmen Anda.
              </p>
              <div className="secret-actions-row">
                <a
                  href="assets/docs/CV_Suryani_Lestari_QA_Automation.pdf"
                  download
                  className="clean-btn execute-btn"
                  onClick={() => sound.playTerminalSuccess()}
                >
                  <span>📥</span> UNDUH RESUME FORMAL (PDF)
                </a>

                <a
                  href="https://suryani-lestari.my.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="clean-btn secondary"
                  onClick={() => sound.playNavTick()}
                >
                  <span>🌐</span> BUKA DIGITAL VAULT
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="clean-modal-footer">
          <span className="footer-meta-pill">Koordinat Tersembunyi: Automation Foundry [X: 18, Y: 24] • Terverifikasi</span>
          <button type="button" className="clean-btn primary" onClick={handleClose}>
            KEMBALI KE PENJELAJAHAN [ESC]
          </button>
        </div>
      </div>
    </div>
  );
};
