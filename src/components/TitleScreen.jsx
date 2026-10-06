import React, { useEffect } from 'react';
import { sound } from '../utils/audio';

export const TitleScreen = ({ onStartGame, onOpenExpress }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        sound.playSelect();
        onStartGame();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        sound.playSelect();
        onOpenExpress();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStartGame, onOpenExpress]);

  return (
    <div className="title-screen-overlay">
      <div className="retro-grid-bg" aria-hidden="true" />
      
      {/* Floating System Runes */}
      <div className="floating-runes" aria-hidden="true">
        <span className="rune" style={{ left: '10%', animationDelay: '0s' }}>[SEEKER_DEBUGGER_LV99]</span>
        <span className="rune" style={{ left: '30%', animationDelay: '3.5s' }}>[ANOMALY_BESTIARY_LOADED]</span>
        <span className="rune" style={{ left: '55%', animationDelay: '1.8s' }}>[PLAYWRIGHT_SHARDING_200_OK]</span>
        <span className="rune" style={{ left: '78%', animationDelay: '4.2s' }}>[ZERO_DEFECT_LEAK_CONFIRMED]</span>
      </div>

      <div className="title-box">
        {/* Badge & Avatar Header */}
        <div className="title-badge">
          <span>⚔️</span> QUALITY ASSURANCE IN ANOTHER WORLD • HAGA PERSONA
        </div>

        <div className="title-avatar-showcase">
          <img
            src="assets/images/haga-avatar.jpg"
            alt="Haga Seeker"
            className="title-avatar-img"
          />
          <div className="avatar-meta-badge">
            <strong>HAGA</strong>
            <small>LEAD WORLD DEBUGGER / SEEKER LV.99</small>
          </div>
        </div>
        
        <h1 className="title-main">QA SEEKER PORTFOLIO</h1>
        <div className="title-subhead">VERSi DOKUMEN: 4.0 • LEAD SDET / QUALITY ASSURANCE ARCHITECT</div>
        
        <p className="title-desc">
          "Tidak ada sistem yang sepenuhnya sempurna, namun dengan ketelitian dan integritas seorang Seeker, kita mampu membuat dunia perangkat lunak menjadi jauh lebih andal."
        </p>

        {/* Dual-View Entry Buttons (Section 2) */}
        <div className="title-actions-dual">
          <button 
            className="press-play-btn primary-start" 
            type="button" 
            onClick={() => {
              sound.playSelect();
              onStartGame();
            }}
          >
            ▶ JALUR 1: MASUK MARKAS GUILD (IMMERSIVE 2D)
          </button>

          <button 
            className="press-play-btn secondary-express" 
            type="button" 
            onClick={() => {
              sound.playSelect();
              onOpenExpress();
            }}
          >
            ⚡ JALUR 2: RECRUITER EXPRESS HUB (&lt; 15 DETIK)
          </button>
        </div>

        <div className="title-controls-hint">
          <div className="hint-line">
            <span>Kontrol Eksplorasi:</span>
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
            <span>Menu Eksekutif</span>
            <span>•</span>
            <span className="k-badge">D</span>
            <span>Seeker Debug Vision</span>
            <span>•</span>
            <span className="k-badge">ESC</span>
            <span>Tutup Jendela</span>
          </div>
        </div>
      </div>
    </div>
  );
};
