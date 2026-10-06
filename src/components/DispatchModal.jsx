import React, { useState } from 'react';
import { sound, playFanfare } from '../utils/audio';

export const DispatchModal = ({ isOpen, onClose, onShowToast }) => {
  const [formData, setFormData] = useState({
    recruiterName: '',
    companyEmail: '',
    projectScope: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    sound.playClose();
    onClose();
  };

  const copyGuildAddress = () => {
    const contactEmail = "haga.qa.seeker@domain.com";
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
    if (!formData.recruiterName || !formData.companyEmail) {
      sound.playAnomalyGlitch();
      onShowToast("MOHON LENGKAPI NAMA DAN EMAIL PERUSAHAAN!");
      return;
    }

    playFanfare();
    setFormSubmitted(true);
    onShowToast("CONTRACT TRANSMITTED TO HAGA!");

    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ recruiterName: '', companyEmail: '', projectScope: '' });
      onClose();
    }, 2800);
  };

  return (
    <div className="jrpg-modal-backdrop" role="dialog" aria-modal="true" onClick={handleClose}>
      <div className="jrpg-window dispatch-window" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="jrpg-window-header">
          <div className="jrpg-header-title">
            <span className="jrpg-pixel-icon">✉️</span>
            <h3>GUILD DISPATCH: JALUR KONVERSI & KONTAK RECRUITER</h3>
          </div>
          <div className="jrpg-header-badge">RECEPTION DESK • SECTION 9</div>
          <button className="jrpg-close-btn" type="button" onClick={handleClose} aria-label="Tutup Dialog">
            [ESC] ✕
          </button>
        </div>

        {/* Body */}
        <div className="jrpg-window-body">
          {/* Seeker Profile Callout */}
          <div className="dispatch-hero-card">
            <div className="dispatch-avatar-box">
              <img src="assets/images/haga-avatar.jpg" alt="Haga Seeker" className="dispatch-avatar-img" />
              <span className="dispatch-online-pulse">● ACTIVE ON SERVER</span>
            </div>

            <div className="dispatch-info">
              <div className="dispatch-title-row">
                <h4 className="dispatch-name">HAGA</h4>
                <span className="dispatch-role-tag">LEAD WORLD DEBUGGER / SEEKER LV. 99</span>
              </div>
              <p className="dispatch-role-sub">Quality Assurance Engineer / SDET • Global Systems Specialist</p>

              {/* Status Ketersediaan Kerja */}
              <div className="availability-box">
                <span className="avail-label">STATUS KETERSEDIAAN MISI:</span>
                <span className="avail-status-pill">
                  🟢 Ready for Full-Time Remote / On-Site Quest
                </span>
              </div>

              {/* Epilog Moto */}
              <p className="dispatch-quote">
                "Tidak ada sistem yang sepenuhnya sempurna, namun dengan ketelitian dan integritas seorang Seeker, kita mampu membuat dunia perangkat lunak menjadi jauh lebih andal."
              </p>
            </div>
          </div>

          <div className="dispatch-grid-columns">
            {/* Left: Formulir Kontrak Misi */}
            <div className="dispatch-form-panel">
              <h5 className="panel-subheading">
                <span>📜</span> FORMULIR KONTRAK MISI (HIRE / DISPATCH FORM)
              </h5>
              
              {formSubmitted ? (
                <div className="contract-success-banner">
                  <span className="banner-big-icon">🎉</span>
                  <h4>CONTRACT TRANSMITTED TO HAGA!</h4>
                  <p>Misi berhasil didaftarkan ke jurnal penjelajah Haga. Konfirmasi transmisi dikirim ke email Anda.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="jrpg-form">
                  <div className="form-group">
                    <label htmlFor="recruiterName">Nama Perekrut / Perusahaan:</label>
                    <input
                      id="recruiterName"
                      type="text"
                      className="jrpg-input"
                      placeholder="e.g. Lead Talent Scout / Tech Enterprise Corp"
                      value={formData.recruiterName}
                      onChange={(e) => setFormData({ ...formData, recruiterName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="companyEmail">Alamat Email Perusahaan:</label>
                    <input
                      id="companyEmail"
                      type="email"
                      className="jrpg-input"
                      placeholder="e.g. hiring.team@enterprise.com"
                      value={formData.companyEmail}
                      onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="projectScope">Cakupan Proyek & Detail Misi (Scope of Quest):</label>
                    <textarea
                      id="projectScope"
                      className="jrpg-textarea"
                      rows="3"
                      placeholder="Jelaskan kebutuhan pengujian sistem, durasi kontrak, tech stack, atau tantangan arsitektur..."
                      value={formData.projectScope}
                      onChange={(e) => setFormData({ ...formData, projectScope: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="jrpg-btn primary submit-btn">
                    <span>⚔️</span> TRANSMIT CONTRACT TO HAGA
                  </button>
                </form>
              )}
            </div>

            {/* Right: Quick Action Coordinates & Official Artifacts */}
            <div className="dispatch-quick-panel">
              <h5 className="panel-subheading">
                <span>⚡</span> AKSES CEPAT KOORDINAT & BERKAS FORMAL
              </h5>

              {/* Quick Copy Coordinates Button */}
              <div className="quick-copy-card">
                <span className="card-label">KOORDINAT SURAT RESMI:</span>
                <code className="email-display">haga.qa.seeker@domain.com</code>
                <button
                  type="button"
                  className="jrpg-btn secondary copy-coords-btn"
                  onClick={copyGuildAddress}
                >
                  <span>📋</span> COPY COORDINATES
                </button>
              </div>

              {/* Formal Files Download / Verified Profiles */}
              <div className="formal-links-card">
                <span className="card-label">TAUTAN BERKAS FORMAL REKRUTER:</span>
                <div className="links-stack">
                  <a
                    href="assets/docs/CV_Haga_Lead_QA_Seeker.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="formal-link-row"
                    onClick={() => sound.playSelect()}
                    download
                  >
                    <span className="f-icon">📄</span>
                    <div className="f-meta">
                      <strong>Unduh CV Formal (PDF Standar)</strong>
                      <small>Format ATS Friendly untuk Hiring Manager</small>
                    </div>
                    <span className="f-arrow">⬇</span>
                  </a>

                  <a
                    href="https://linkedin.com/in/haga-qa-seeker"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="formal-link-row"
                    onClick={() => sound.playSelect()}
                  >
                    <span className="f-icon">💼</span>
                    <div className="f-meta">
                      <strong>Profil LinkedIn Terverifikasi</strong>
                      <small>Endorsement & Professional Network</small>
                    </div>
                    <span className="f-arrow">↗</span>
                  </a>

                  <a
                    href="https://github.com/haga-seeker/qa-test-citadel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="formal-link-row"
                    onClick={() => sound.playSelect()}
                  >
                    <span className="f-icon">🐙</span>
                    <div className="f-meta">
                      <strong>Repositori GitHub Pengujian</strong>
                      <small>Playwright CI Specs, k6 Load Tests & Allure Reports</small>
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
          <span className="jrpg-footer-hint">Tersedia untuk peran Full-Time QA Lead, Senior SDET, dan QA Architect Global.</span>
          <button type="button" className="jrpg-btn primary" onClick={handleClose}>
            [ESC] KEMBALI KE MARKAS GUILD
          </button>
        </div>
      </div>
    </div>
  );
};
