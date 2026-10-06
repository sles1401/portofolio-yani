import React, { useState } from 'react';
import { sound, playFanfare } from '../utils/audio';

export const DispatchModal = ({ isOpen, onClose, onShowToast }) => {
  const [formData, setFormData] = useState({
    commissionScope: 'Full-time QA Automation Specialist',
    companyName: '',
    workEmail: '',
    projectScope: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    sound.playClose();
    onClose();
  };

  const copyEmailCoordinates = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.workEmail) {
      sound.playGlitch();
      onShowToast("MOHON LENGKAPI NAMA PERUSAHAAN DAN ALAMAT EMAIL!");
      return;
    }

    playFanfare();
    setFormSubmitted(true);
    onShowToast("QUEST CONTRACT TRANSMITTED TO SURYANI LESTARI!");

    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        commissionScope: 'Full-time QA Automation Specialist',
        companyName: '',
        workEmail: '',
        projectScope: ''
      });
      onClose();
    }, 2800);
  };

  return (
    <div className="jrpg-modal-backdrop" role="dialog" aria-modal="true" onClick={handleClose}>
      <div className="jrpg-window dispatch-window" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="jrpg-window-header">
          <div className="jrpg-header-title">
            <span className="jrpg-pixel-icon">📮</span>
            <h3>GUILD DISPATCH: CALL-TO-ACTION & JALUR KONVERSI RECRUITER</h3>
          </div>
          <div className="jrpg-header-badge">BAB 09 • RECRUITER PIPELINE</div>
          <button className="jrpg-close-btn" type="button" onClick={handleClose} aria-label="Tutup Dialog">
            [ESC] ✕
          </button>
        </div>

        {/* Body */}
        <div className="jrpg-window-body">
          {/* Seeker Operator Profile */}
          <div className="dispatch-hero-card">
            <div className="dispatch-avatar-box">
              <img src="assets/images/suryani-seeker-avatar.jpg" alt="Suryani Lestari" className="dispatch-avatar-img" />
              <span className="dispatch-online-pulse">● SEEKER ACTIVE</span>
            </div>

            <div className="dispatch-info">
              <div className="dispatch-title-row">
                <h4 className="dispatch-name">SURYANI LESTARI</h4>
                <span className="dispatch-role-tag">LEAD SYSTEM SEEKER & STABILITY GUARDIAN</span>
              </div>
              <p className="dispatch-role-sub">QA Automation Specialist & Mentor • Bandung, Indonesia (Remote / Hybrid)</p>

              {/* Status Ketersediaan */}
              <div className="availability-box">
                <span className="avail-label">STATUS KETERSEDIAAN:</span>
                <span className="avail-status-pill">
                  🟢 Open for High-Impact QA Roles
                </span>
              </div>

              {/* Copywriting Undangan Kerja (Bab 9) */}
              <p className="dispatch-quote">
                "Apakah sistem digital perusahaan Anda bersiap menghadapi rilis skala besar dan tidak boleh mengalami kegagalan transaksi? Berikan quest pengujian kepada Suryani Lestari untuk menjamin kestabilan alur pengguna dan kualitas software bebas cacat."
              </p>
            </div>
          </div>

          <div className="dispatch-grid-columns">
            {/* Left: Formulir Komisi Misi */}
            <div className="dispatch-form-panel">
              <h5 className="panel-subheading">
                <span>📜</span> FORMULIR PENUGASAN KOMISI (DIRECT COMMISSION)
              </h5>
              
              {formSubmitted ? (
                <div className="contract-success-banner">
                  <span className="banner-big-icon">🎉</span>
                  <h4>QUEST CONTRACT TRANSMITTED!</h4>
                  <p>Misi berhasil ditransmisikan ke jurnal pengujian Suryani Lestari. Konfirmasi dikirim ke email Anda.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="jrpg-form">
                  <div className="form-group">
                    <label htmlFor="commissionScope">Opsi Penugasan Komisi (Commission Scope):</label>
                    <select
                      id="commissionScope"
                      className="jrpg-input"
                      value={formData.commissionScope}
                      onChange={(e) => setFormData({ ...formData, commissionScope: e.target.value })}
                    >
                      <option value="Full-time QA Automation Specialist">Full-time QA Automation Specialist</option>
                      <option value="Playwright Test Suite Construction">Playwright Test Suite Construction</option>
                      <option value="QA Strategy & Advisory">QA Strategy & Advisory</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="companyName">Nama Perekrut / Perusahaan:</label>
                    <input
                      id="companyName"
                      type="text"
                      className="jrpg-input"
                      placeholder="e.g. Lead Talent Scout / Enterprise CTO Office"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="workEmail">Alamat Email Perusahaan:</label>
                    <input
                      id="workEmail"
                      type="email"
                      className="jrpg-input"
                      placeholder="e.g. talent@company.com"
                      value={formData.workEmail}
                      onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="projectScope">Cakupan Misi & Tantangan Sistem:</label>
                    <textarea
                      id="projectScope"
                      className="jrpg-textarea"
                      rows="3"
                      placeholder="Jelaskan kebutuhan pengujian sistem, modul integrasi, atau durasi penugasan..."
                      value={formData.projectScope}
                      onChange={(e) => setFormData({ ...formData, projectScope: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="jrpg-btn primary submit-btn">
                    <span>⚔️</span> TRANSMIT QUEST CONTRACT
                  </button>
                </form>
              )}
            </div>

            {/* Right: Quick Action Buttons & Verified Channels (Bab 9) */}
            <div className="dispatch-quick-panel">
              <h5 className="panel-subheading">
                <span>⚡</span> KANAL RESMI & TOMBOL CEPAT 1-KLIK
              </h5>

              {/* Quick Copy Email Coordinates */}
              <div className="quick-copy-card">
                <span className="card-label">KOORDINAT EMAIL RESMI:</span>
                <code className="email-display">contact@suryani-lestari.my.id</code>
                <button
                  type="button"
                  className="jrpg-btn secondary copy-coords-btn"
                  onClick={copyEmailCoordinates}
                >
                  <span>📋</span> COPY EMAIL COORDINATES
                </button>
              </div>

              {/* Verified External Links (Bab 9) */}
              <div className="formal-links-card">
                <span className="card-label">TAUTAN BERKAS & DIGITAL VAULT:</span>
                <div className="links-stack">
                  {/* (1) Download Seeker Resume (PDF) */}
                  <a
                    href="assets/docs/CV_Suryani_Lestari_QA_Automation.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="formal-link-row"
                    onClick={() => sound.playSelect()}
                    download
                  >
                    <span className="f-icon">📄</span>
                    <div className="f-meta">
                      <strong>(1) Download Seeker Resume (PDF)</strong>
                      <small>Format ATS-Friendly untuk Hiring Manager</small>
                    </div>
                    <span className="f-arrow">⬇</span>
                  </a>

                  {/* (2) Visit Digital Vault (suryani-lestari.my.id) */}
                  <a
                    href="https://suryani-lestari.my.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="formal-link-row"
                    onClick={() => sound.playSelect()}
                  >
                    <span className="f-icon">🌐</span>
                    <div className="f-meta">
                      <strong>(2) Visit Digital Vault (suryani-lestari.my.id)</strong>
                      <small>Basis Operasi & Dokumentasi Resmi</small>
                    </div>
                    <span className="f-arrow">↗</span>
                  </a>

                  {/* (3) Guild Network (LinkedIn) */}
                  <a
                    href="https://linkedin.com/in/suryani-lestari"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="formal-link-row"
                    onClick={() => sound.playSelect()}
                  >
                    <span className="f-icon">💼</span>
                    <div className="f-meta">
                      <strong>(3) Guild Network (LinkedIn)</strong>
                      <small>Profil Profesional linkedin.com/in/suryani-lestari</small>
                    </div>
                    <span className="f-arrow">↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="jrpg-window-footer">
          <span className="jrpg-footer-hint">Tersedia untuk peran Full-Time QA Automation Specialist, Lead SDET, dan QA Advisor.</span>
          <button type="button" className="jrpg-btn primary" onClick={handleClose}>
            [ESC] KEMBALI KE PENJELAJAHAN
          </button>
        </div>
      </div>
    </div>
  );
};
