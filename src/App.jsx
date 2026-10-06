import React, { useState, useEffect, useCallback } from 'react';
import { TitleScreen } from './components/TitleScreen';
import { GameCanvas } from './components/GameCanvas';
import { GameHUD } from './components/GameHUD';
import { VirtualDPad } from './components/VirtualDPad';
import { RecruiterExpressBar } from './components/RecruiterExpressBar';
import { QuestModal } from './components/QuestModal';
import { BestiaryModal } from './components/BestiaryModal';
import { ArsenalModal } from './components/ArsenalModal';
import { DispatchModal } from './components/DispatchModal';
import { ConventionalView } from './components/ConventionalView';
import { sound } from './utils/audio';

export const App = () => {
  const [viewMode, setViewMode] = useState('GAME'); // 'GAME' | 'CONVENTIONAL'
  const [gameStarted, setGameStarted] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'QUESTS' | 'BESTIARY' | 'GEAR' | 'DISPATCH' | null
  const [nearbyPoint, setNearbyPoint] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [debugVision, setDebugVision] = useState(false);
  const [dpadState, setDpadState] = useState({ up: false, down: false, left: false, right: false });
  const [toastMessage, setToastMessage] = useState(null);
  const [telemetry, setTelemetry] = useState({
    fps: '60.0',
    heapMB: '42.1 MB',
    playerX: 576,
    playerY: 440
  });

  // Global Toast Dispatcher
  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3200);
  }, []);

  // Keyboard Shortcuts: [M], [D], [ESC] (Section 2 & Section 3)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      const code = e.code;

      // [ESC]: Close all modal windows or return from conventional view
      if (code === 'Escape') {
        if (activeModal) {
          sound.playClose();
          setActiveModal(null);
        } else if (viewMode === 'CONVENTIONAL') {
          sound.playClose();
          setViewMode('GAME');
        }
      }

      // [D]: Toggle Seeker Debug Vision (Section 2 & 3)
      if (code === 'KeyD' && viewMode === 'GAME' && !activeModal) {
        // Only trigger toggle if not typing in an input
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setDebugVision((prev) => {
            const next = !prev;
            sound.playDebugToggle(next);
            showToast(next ? 'SEEKER DEBUG VISION: ACTIVE' : 'SEEKER DEBUG VISION: DEACTIVATED');
            return next;
          });
        }
      }

      // [M]: Toggle Recruiter Express Hub / Main Menu (Section 2)
      if (code === 'KeyM') {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          sound.playSelect();
          setViewMode((prev) => (prev === 'GAME' ? 'CONVENTIONAL' : 'GAME'));
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [activeModal, viewMode, showToast]);

  const handleStartGame = () => {
    setGameStarted(true);
    setViewMode('GAME');
  };

  const handleOpenExpressFromTitle = () => {
    setGameStarted(true);
    setViewMode('CONVENTIONAL');
  };

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sound.playSelect();
    }
  };

  const handleSwitchToConventional = () => {
    sound.playSelect();
    setViewMode('CONVENTIONAL');
  };

  const handleReturnToGame = () => {
    sound.playSelect();
    setViewMode('GAME');
  };

  const handleDpadDirection = (direction, isPressed) => {
    setDpadState((prev) => ({ ...prev, [direction]: isPressed }));
  };

  const handleDpadAction = () => {
    if (nearbyPoint && !activeModal) {
      sound.playSelect();
      setActiveModal(nearbyPoint.id);
    }
  };

  const handleOpenModal = (modalId) => {
    sound.playSelect();
    setActiveModal(modalId);
  };

  const handleToggleDebug = () => {
    setDebugVision((prev) => {
      const next = !prev;
      sound.playDebugToggle(next);
      showToast(next ? 'SEEKER DEBUG VISION: ACTIVE' : 'SEEKER DEBUG VISION: DEACTIVATED');
      return next;
    });
  };

  return (
    <div className={`app-root ${debugVision ? 'debug-theme-overlay' : ''}`}>
      {/* Subtle CRT Overlay */}
      <div className="crt-overlay" aria-hidden="true" />

      {/* Retro Toast Notification */}
      {toastMessage && (
        <div className="retro-toast-notification" role="status" aria-live="assertive">
          <span className="toast-icon">⚡</span>
          <span className="toast-text">{toastMessage}</span>
        </div>
      )}

      {/* Jalur 2: Recruiter Express Hub (Mode Konvensional / Dokumen Lengkap) */}
      {viewMode === 'CONVENTIONAL' ? (
        <ConventionalView 
          onReturnToGame={handleReturnToGame}
          onShowToast={showToast}
        />
      ) : (
        <div className="game-wrapper">
          {/* Layar Pembuka (Title Screen) */}
          {!gameStarted ? (
            <TitleScreen 
              onStartGame={handleStartGame} 
              onOpenExpress={handleOpenExpressFromTitle}
            />
          ) : (
            <>
              {/* Status Bar HUD & Persistent Header Controls */}
              <GameHUD
                onSwitchToConventional={handleSwitchToConventional}
                onToggleMute={handleToggleMute}
                isMuted={isMuted}
                nearbyPoint={nearbyPoint}
                debugVision={debugVision}
                onToggleDebug={handleToggleDebug}
                onOpenModal={handleOpenModal}
                telemetry={telemetry}
              />

              {/* Viewport Canvas 2D Interaktif (Jalur 1: Immersive Mode) */}
              <main className="game-stage">
                <GameCanvas
                  onTriggerModal={handleOpenModal}
                  activeModal={activeModal}
                  onNearbyChange={(pt) => setNearbyPoint(pt)}
                  dpadState={dpadState}
                  debugVision={debugVision}
                  onTelemetryUpdate={(data) => setTelemetry(data)}
                />
              </main>

              {/* Persistent Footer: Recruiter Express Bar (Section 2) */}
              <RecruiterExpressBar
                onOpenModal={handleOpenModal}
                activeModal={activeModal}
                onToggleDebug={handleToggleDebug}
                debugVision={debugVision}
              />

              {/* Virtual D-Pad for Mobile Touch Users (< 640px) */}
              <VirtualDPad
                onDirectionChange={handleDpadDirection}
                onAction={handleDpadAction}
              />

              {/* JRPG Dialog Windows (Section 2.2 Retro JRPG Window) */}
              <QuestModal
                isOpen={activeModal === 'QUESTS'}
                onClose={() => setActiveModal(null)}
              />

              <BestiaryModal
                isOpen={activeModal === 'BESTIARY'}
                onClose={() => setActiveModal(null)}
              />

              <ArsenalModal
                isOpen={activeModal === 'GEAR'}
                onClose={() => setActiveModal(null)}
              />

              <DispatchModal
                isOpen={activeModal === 'DISPATCH'}
                onClose={() => setActiveModal(null)}
                onShowToast={showToast}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};
