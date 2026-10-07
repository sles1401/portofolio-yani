import React, { useEffect } from 'react';
import { sound } from '../utils/audio';

export const TitleScreen = ({ onStartExpedition, onOpenDocket }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        sound.playSelect();
        onStartExpedition();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        sound.playSelect();
        onOpenDocket();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStartExpedition, onOpenDocket]);

  return (
    <div className="title-screen-overlay">
      <div className="retro-grid-bg" aria-hidden="true" />
      
      {/* Floating System Runes */}
      <div className="floating-runes" aria-hidden="true">
        <span className="rune" style={{ left: '8%', animationDelay: '0s' }}>[SURYANI_LESTARI_QA_SEEKER]</span>
        <span className="rune" style={{ left: '32%', animationDelay: '3.2s' }}>[PLAYWRIGHT_JS_PARALLEL_OK]</span>
        <span className="rune" style={{ left: '56%', animationDelay: '1.6s' }}>[MARKETING_PPIC_SYNC_ZERO_DESYNC]</span>
        <span className="rune" style={{ left: '80%', animationDelay: '4.5s' }}>[BANDUNG_HQ_SYSTEM_STABILITY]</span>
      </div>

      <div className="title-box">
        {/* Badge Header */}
        <div className="title-badge">
          <span>⚔️</span> COMMERCIAL OPEN-WORLD BLUEPRINT • SURYANI LESTARI EDITION
        </div>

        {/* Character Avatar Showcase */}
        <div className="title-avatar-showcase">
          <img
            src="assets/images/suryani-seeker-avatar.jpg"
            alt="Suryani Lestari Seeker"
            className="title-avatar-img"
          />
          <div className="avatar-meta-badge">
            <strong>SURYANI LESTARI</strong>
            <small>SYSTEM SEEKER &amp; STABILITY GUARDIAN • suryani-lestari.my.id</small>
          </div>
        </div>
        
        <h1 className="title-main">QA SEEKER MASTER BLUEPRINT</h1>
        <div className="title-subhead">OPEN-WORLD 2400×1800PX • RECRUITER DOCKET HYBRID SYSTEM</div>
        
        <p className="title-desc">
          "Menyatukan identitas riil Suryani Lestari (QA Engineer asal Bandung) dengan tema investigasi celah sistem ala Seeker Haga: pemotongan 85% durasi regresi via Playwright JS, 0 defect leak pada modul Marketing &amp; PPIC, dan audit endpoint API tanpa celah."
        </p>

        {/* Dual-View Entry Buttons (Bab 2) */}
        <div className="title-actions-dual">
          <button 
            className="press-play-btn primary-start" 
            type="button" 
            onClick={() => {
              sound.playSelect();
              onStartExpedition();
            }}
          >
            ▶ MODE A: OPEN-WORLD EXPEDITION (CANVAS 2400×1800)
          </button>

          <button 
            className="press-play-btn secondary-express" 
            type="button" 
            onClick={() => {
              sound.playSelect();
              onOpenDocket();
            }}
          >
            ⚡ MODE B: RECRUITER DOCKET (EKSEKUTIF &lt; 15 DETIK)
          </button>
        </div>

        <div className="title-controls-hint">
          <div className="hint-line">
            <span>Kontrol Karakter:</span>
            <span className="k-badge">W</span>
            <span className="k-badge">A</span>
            <span className="k-badge">S</span>
            <span className="k-badge">D</span>
            <span>/</span>
            <span className="k-badge">ARROWS</span>
            <span>• Interaksi:</span>
            <span className="k-badge">SPACE</span>
            <span>/</span>
            <span className="k-badge">E</span>
          </div>
          <div className="hint-line">
            <span>Shortcut Cepat:</span>
            <span className="k-badge">M</span>
            <span>Toggle Recruiter Docket</span>
            <span>•</span>
            <span className="k-badge">D</span>
            <span>Haga Debug Vision 2.0</span>
            <span>•</span>
            <span className="k-badge">ESC</span>
            <span>Reset View</span>
          </div>
        </div>
      </div>
    </div>
  );
};
