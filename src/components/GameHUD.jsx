import React from 'react';
import { sound } from '../utils/audio';

export const GameHUD = ({
  onSwitchToConventional,
  onToggleMute,
  isMuted,
  nearbyPoint,
  debugVision,
  onToggleDebug,
  onOpenModal,
  telemetry
}) => {
  return (
    <header className="game-hud-layer">
      {/* Top Left: Haga Lead World Debugger Player Card */}
      <div className="hud-player-card">
        <div className="hud-avatar-box">
          <img 
            src="assets/images/haga-avatar.jpg" 
            alt="Haga Seeker Avatar" 
            className="hud-mini-avatar"
          />
          <span className="hud-online-dot" title="Seeker Online" />
        </div>

        <div className="hud-meta">
          <div className="hud-row-top">
            <h2 className="hud-player-name">HAGA</h2>
            <span className="hud-level-pill">SEEKER LV. 99</span>
            <span className="hud-sdet-pill">LEAD SDET</span>
          </div>

          {/* Dual HP / MP Vitals */}
          <div className="hud-vitals-bars-compact">
            <div className="hud-vital-mini" title="HP: 999/999 Stamina Pengujian Eksploratori">
              <span className="vital-mini-tag">HP</span>
              <div className="vital-mini-track">
                <div className="vital-mini-fill hp" style={{ width: '100%' }} />
              </div>
              <span className="vital-mini-val">999/999</span>
            </div>

            <div className="hud-vital-mini" title="MP: 480/550 Kapasitas Otomasi & Skrip">
              <span className="vital-mini-tag">MP</span>
              <div className="vital-mini-track">
                <div className="vital-mini-fill mp" style={{ width: '87.2%' }} />
              </div>
              <span className="vital-mini-val">480/550</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center Top: Proximity Banner (State NEAR_LANDMARK: Section 2.1) */}
      {nearbyPoint ? (
        <div 
          className="interaction-prompt-banner"
          onClick={() => {
            sound.playSelect();
            onOpenModal(nearbyPoint.id);
          }}
          role="button"
          tabIndex={0}
        >
          <span className="blink-icon">⚡</span>
          <span>
            Dekat {nearbyPoint.label}: Tekan <strong>[SPACE]</strong> atau Klik untuk INSPECT OBJECT
          </span>
        </div>
      ) : null}

      {/* Top Right: Actions Bar & Debug Toggle */}
      <div className="hud-top-actions">
        {/* Debug Vision Button [D] */}
        <button
          className={`hud-btn debug-btn ${debugVision ? 'active' : ''}`}
          type="button"
          onClick={() => {
            sound.playDebugToggle(!debugVision);
            onToggleDebug();
          }}
          title="Toggle Seeker Debug Vision [Shortcut: D]"
        >
          <span>👁️</span> DEBUG VISION: {debugVision ? 'ACTIVE' : 'OFF'} [D]
        </button>

        {/* Audio Toggle */}
        <button 
          className="hud-btn audio-btn" 
          type="button" 
          onClick={onToggleMute}
          title="Toggle Efek Suara Chiptune 8-Bit Native"
        >
          {isMuted ? '🔇 SFX: OFF' : '🔊 SFX: ON'}
        </button>

        {/* Recruiter Express / Conventional View Switcher */}
        <button 
          className="hud-btn mode-switch-btn" 
          type="button" 
          onClick={() => {
            sound.playSelect();
            onSwitchToConventional();
          }}
          title="Akses Cepat Dokumen Rekruter Eksekutif (< 15 Detik)"
        >
          <span>📋</span> RECRUITER EXPRESS HUB
        </button>
      </div>

      {/* Seeker Debug Vision Telemetry Box (Section 3) */}
      {debugVision && (
        <div className="debug-telemetry-hud-box" aria-live="polite">
          <div className="telemetry-hud-title">
            <span>⚡</span> SEEKER DEBUG TELEMETRY (LIVE)
          </div>
          <div className="telemetry-hud-rows">
            <div className="telemetry-row">
              <span className="t-key">TARGET ENV:</span>
              <span className="t-val t-env">Production (v4.0-Live)</span>
            </div>
            <div className="telemetry-row">
              <span className="t-key">COORDINATES:</span>
              <span className="t-val">X: {telemetry.playerX} | Y: {telemetry.playerY}</span>
            </div>
            <div className="telemetry-row">
              <span className="t-key">FRAME RATE:</span>
              <span className="t-val" id="hud-fps">{telemetry.fps} FPS</span>
            </div>
            <div className="telemetry-row">
              <span className="t-key">HEAP MEMORY:</span>
              <span className="t-val" id="hud-memory">{telemetry.heapMB}</span>
            </div>
            <div className="telemetry-row">
              <span className="t-key">GLITCH LISTENER:</span>
              <span className="t-val t-active">ACTIVE / SCANNING</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
