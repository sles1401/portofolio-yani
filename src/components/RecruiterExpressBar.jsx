import React from 'react';
import { sound } from '../utils/audio';

export const RecruiterExpressBar = ({ onOpenModal, activeModal, onToggleDebug, debugVision, onToggleView }) => {
  const navItems = [
    { id: 'QUESTS', label: 'Quests', sub: 'Case Studies', icon: '📜' },
    { id: 'TERMINAL', label: 'Playwright', sub: 'Live Runner', icon: '💻' },
    { id: 'BESTIARY', label: 'Bestiary', sub: 'Anomaly Logs', icon: '👾' },
    { id: 'VISUAL_REGRESSION', label: 'Visual Diff', sub: 'Regression Slider', icon: '🔍' },
    { id: 'ROI_CALC', label: 'ROI Calc', sub: 'Cost Preserved', icon: '📈' },
    { id: 'INTERVIEW', label: 'Interview', sub: 'NPC Scenarios', icon: '💬' },
    { id: 'LICENSE_CARD', label: 'Seeker ID', sub: 'Export PNG', icon: '🪪' },
    { id: 'DISPATCH', label: 'Dispatch', sub: 'Hire Suryani', icon: '📮' }
  ];

  return (
    <nav className="recruiter-express-bar" aria-label="Recruiter Express Fast Navigation">
      <div className="express-brand-chip">
        <span className="express-icon">⚡</span>
        <div className="express-brand-text">
          <strong>RECRUITER EXPRESS CONTROLLER</strong>
          <small>Akses Cepat 1-Klik Tools QA Seeker &amp; Dialog JRPG</small>
        </div>
      </div>

      <div className="express-buttons-group">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`express-nav-btn ${activeModal === item.id ? 'active' : ''}`}
            onClick={() => {
              sound.playSelect();
              onOpenModal(item.id);
            }}
          >
            <span className="btn-icon">{item.icon}</span>
            <div className="btn-text-wrap">
              <span className="btn-title">{item.label}</span>
              <span className="btn-sub">{item.sub}</span>
            </div>
          </button>
        ))}

        {/* Vision 2.0 Button */}
        <button
          type="button"
          className={`express-nav-btn debug-nav-btn ${debugVision ? 'debug-active' : ''}`}
          onClick={() => {
            sound.playScan();
            onToggleDebug();
          }}
          title="Toggle Haga Debug Vision 2.0 [Shortcut: D]"
        >
          <span className="btn-icon">👁️</span>
          <div className="btn-text-wrap">
            <span className="btn-title">Vision [D]</span>
            <span className="btn-sub">{debugVision ? 'ACTIVE' : 'OFF'}</span>
          </div>
        </button>

        {/* Toggle Docket */}
        <button
          type="button"
          className="express-nav-btn docket-nav-btn"
          onClick={() => {
            sound.playSelect();
            onToggleView();
          }}
          title="Toggle Mode B: Recruiter Docket [Shortcut: M]"
        >
          <span className="btn-icon">📋</span>
          <div className="btn-text-wrap">
            <span className="btn-title">Docket [M]</span>
            <span className="btn-sub">Eksekutif</span>
          </div>
        </button>
      </div>

      <div className="express-shortcuts-hint">
        <span>[M] Docket</span>
        <span>•</span>
        <span>[D] Vision 2.0</span>
        <span>•</span>
        <span>[ESC] Reset</span>
      </div>
    </nav>
  );
};
