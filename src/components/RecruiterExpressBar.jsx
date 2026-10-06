import React from 'react';
import { sound } from '../utils/audio';

export const RecruiterExpressBar = ({ onOpenModal, activeModal, onToggleDebug, debugVision }) => {
  const navItems = [
    { id: 'QUESTS', label: 'Quests', sub: 'Project Records', icon: '📜' },
    { id: 'BESTIARY', label: 'Bestiary', sub: 'Anomaly Grimoire', icon: '👾' },
    { id: 'GEAR', label: 'Gear', sub: 'Armory Stack', icon: '⚔️' },
    { id: 'DISPATCH', label: 'Dispatch', sub: 'Hire & Contact', icon: '✉️' }
  ];

  return (
    <nav className="recruiter-express-bar" aria-label="Recruiter Express Fast Navigation">
      <div className="express-brand-chip">
        <span className="express-icon">⚡</span>
        <div className="express-brand-text">
          <strong>RECRUITER EXPRESS MODE</strong>
          <small>Akses Langsung Modal Dialog JRPG (1-Click)</small>
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

        <button
          type="button"
          className={`express-nav-btn debug-nav-btn ${debugVision ? 'debug-active' : ''}`}
          onClick={() => {
            sound.playDebugToggle(!debugVision);
            onToggleDebug();
          }}
          title="Toggle Seeker Debug Vision [Shortcut: D]"
        >
          <span className="btn-icon">👁️</span>
          <div className="btn-text-wrap">
            <span className="btn-title">Vision [D]</span>
            <span className="btn-sub">{debugVision ? 'ACTIVE' : 'TOGGLE'}</span>
          </div>
        </button>
      </div>

      <div className="express-shortcuts-hint">
        <span>[M] Menu</span>
        <span>•</span>
        <span>[D] Debug</span>
        <span>•</span>
        <span>[ESC] Tutup</span>
      </div>
    </nav>
  );
};
