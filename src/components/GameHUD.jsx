import React from 'react';
import { sound } from '../utils/audio';

export const GameHUD = ({
  onToggleView,
  viewMode,
  onToggleMute,
  isMuted,
  nearbyPoint,
  debugVision,
  onToggleDebug,
  onOpenModal,
  diagnostics
}) => {
  return (
    <header className="game-hud-layer sticky-executive-controller">
      {/* Top Left: Suryani Lestari Seeker Card */}
      <div className="hud-player-card">
        <div className="hud-avatar-box">
          <img 
            src="assets/images/suryani-seeker-avatar.jpg" 
            alt="Suryani Lestari Seeker Avatar" 
            className="hud-mini-avatar"
          />
          <span className="hud-online-dot" title="Seeker Online" />
        </div>

        <div className="hud-meta">
          <div className="hud-row-top">
            <h2 className="hud-player-name">SURYANI LESTARI</h2>
            <span className="hud-level-pill">SYSTEM SEEKER</span>
            <span className="hud-sdet-pill">BANDUNG HQ</span>
          </div>

          {/* Vitals: HP 999/999 & MP 550/550 & Accuracy 99.8% (Bab 7) */}
          <div className="hud-vitals-bars-compact">
            <div className="hud-vital-mini" title="HP: 999/999 Ketahanan Pengujian Maraton">
              <span className="vital-mini-tag">HP</span>
              <div className="vital-mini-track">
                <div className="vital-mini-fill hp" style={{ width: '100%' }} />
              </div>
              <span className="vital-mini-val">999/999</span>
            </div>

            <div className="hud-vital-mini" title="MP: 550/550 Efisiensi Otomasi Modular">
              <span className="vital-mini-tag">MP</span>
              <div className="vital-mini-track">
                <div className="vital-mini-fill mp" style={{ width: '100%' }} />
              </div>
              <span className="vital-mini-val">550/550</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Nearby Landmark & Interaction Prompt */}
      {nearbyPoint ? (
        <div 
          className="interaction-prompt-banner"
          onClick={() => {
            sound.playSelect();
            onOpenModal(nearbyPoint.modalTarget || nearbyPoint.id);
          }}
          role="button"
          tabIndex={0}
        >
          <span className="blink-icon">⚡</span>
          <span>
            {nearbyPoint.district} — <strong>{nearbyPoint.label}</strong>: Tekan <strong>[SPACE]</strong> atau Klik untuk Inspeksi
          </span>
        </div>
      ) : null}

      {/* Top Right: Persistent Executive Controller Switch (Bab 2) & Audio */}
      <div className="hud-top-actions">
        {/* Toggle Debug Vision 2.0 [D] */}
        <button
          className={`hud-btn debug-btn ${debugVision ? 'active' : ''}`}
          type="button"
          onClick={() => {
            sound.playScan();
            onToggleDebug();
          }}
          title="Toggle Haga Debug Vision 2.0 [Shortcut: D]"
        >
          <span>👁️</span> DEBUG VISION 2.0: {debugVision ? 'ON' : 'OFF'} [D]
        </button>

        {/* Quick Launchers */}
        <button
          className="hud-btn quick-tool-btn"
          type="button"
          onClick={() => {
            sound.playNavTick();
            onOpenModal('TERMINAL');
          }}
          title="Buka Playwright Live Terminal Runner"
        >
          <span>💻</span> PLAYWRIGHT RUNNER
        </button>

        <button
          className="hud-btn quick-tool-btn"
          type="button"
          onClick={() => {
            sound.playNavTick();
            onOpenModal('ROI_CALC');
          }}
          title="Kalkulator ROI Otomasi"
        >
          <span>📈</span> ROI CALC
        </button>

        {/* Audio SFX Toggle */}
        <button 
          className="hud-btn audio-btn" 
          type="button" 
          onClick={onToggleMute}
          title="Toggle Synthesized Sound Engine"
        >
          {isMuted ? '🔇 AUDIO: OFF' : '🔊 AUDIO: ON'}
        </button>

        {/* Bab 2: Persistent Executive Controller Toggle View */}
        <button 
          className="hud-btn mode-switch-btn" 
          type="button" 
          onClick={() => {
            sound.playSelect();
            onToggleView();
          }}
          title="Toggle View: Open-World Expedition / Recruiter Docket [Shortcut: M]"
        >
          <span>📋</span> TOGGLE VIEW: {viewMode === 'GAME' ? 'RECRUITER DOCKET' : 'OPEN-WORLD'} [M]
        </button>
      </div>

      {/* Bab 4: Floating Diagnostics di pojok kiri atas saat Debug Vision 2.0 aktif */}
      {debugVision && diagnostics && (
        <div className="floating-diagnostics-box" aria-live="polite">
          <div className="diagnostics-header">
            <span>⚡</span> HAGA TELEMETRY & WIREFRAME SCANNER 2.0
          </div>
          <div className="diagnostics-grid">
            <div className="diag-row">
              <span className="diag-key">WORLD POS:</span>
              <span className="diag-val">X: {diagnostics.playerX} | Y: {diagnostics.playerY}</span>
            </div>
            <div className="diag-row">
              <span className="diag-key">TILE ID:</span>
              <span className="diag-val diag-code">{diagnostics.tileId} (32px)</span>
            </div>
            <div className="diag-row">
              <span className="diag-key">AKTIF DOM NODES:</span>
              <span className="diag-val">{diagnostics.domNodes} Nodes</span>
            </div>
            <div className="diag-row">
              <span className="diag-key">CANVAS FPS:</span>
              <span className="diag-val diag-fps">{diagnostics.fps} FPS (Target 60)</span>
            </div>
            <div className="diag-row">
              <span className="diag-key">SYSTEM INTEGRITY:</span>
              <span className="diag-val diag-integrity">{diagnostics.integrityIndex}</span>
            </div>
            {diagnostics.easterEgg && (
              <div className="diag-easter-egg">
                <span className="egg-icon">🔍</span>
                <span>{diagnostics.easterEgg}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
