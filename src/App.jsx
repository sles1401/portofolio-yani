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
  const [viewMode, setViewMode] = useState('GAME'); // 'GAME' (Mode A) | 'CONVENTIONAL' (Mode B: Recruiter Docket)
  const [gameStarted, setGameStarted] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'QUESTS' | 'BESTIARY' | 'GEAR' | 'DISPATCH' | null
  const [nearbyPoint, setNearbyPoint] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [debugVision, setDebugVision] = useState(false);
  const [dpadState, setDpadState] = useState({ up: false, down: false, left: false, right: false });
  const [toastMessage, setToastMessage] = useState(null);
  const [diagnostics, setDiagnostics] = useState({
    fps: '60.0',
    tileId: 'T_37_30',
    domNodes: 140,
    playerX: 1200,
    playerY: 980,
    integrityIndex: '99.96%',
    easterEgg: null
  });

  // Global Toast Dispatcher
  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3200);
  }, []);

  // Global Keyboard Shortcuts (Bab 2 & 4: [M], [D], [ESC])
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      const code = e.code;

      // [ESC]: Close all modal windows or reset view (Bab 2)
      if (code === 'Escape') {
        if (activeModal) {
          sound.playClose();
          setActiveModal(null);
        } else if (viewMode === 'CONVENTIONAL') {
          sound.playClose();
          setViewMode('GAME');
        }
      }

      // [D]: Toggle Haga Debug Vision 2.0 (Bab 4)
      if (code === 'KeyD' && viewMode === 'GAME' && !activeModal) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setDebugVision((prev) => {
            const next = !prev;
            sound.playScan();
            showToast(next ? 'HAGA DEBUG VISION 2.0: ACTIVE' : 'DEBUG VISION 2.0: DEACTIVATED');
            return next;
          });
        }
      }

      // [M]: Toggle View between Mode A (Expedition) & Mode B (Recruiter Docket) (Bab 2)
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

  const handleStartExpedition = () => {
    setGameStarted(true);
    setViewMode('GAME');
  };

  const handleOpenDocketFromTitle = () => {
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

  const handleToggleView = () => {
    sound.playSelect();
    setViewMode((prev) => (prev === 'GAME' ? 'CONVENTIONAL' : 'GAME'));
  };

  const handleDpadDirection = (direction, isPressed) => {
    setDpadState((prev) => ({ ...prev, [direction]: isPressed }));
  };

  const handleDpadAction = () => {
    if (nearbyPoint && !activeModal) {
      sound.playSelect();
      setActiveModal(nearbyPoint.modalTarget || nearbyPoint.id);
    }
  };

  const handleOpenModal = (modalId) => {
    sound.playSelect();
    setActiveModal(modalId);
  };

  const handleToggleDebug = () => {
    setDebugVision((prev) => {
      const next = !prev;
      sound.playScan();
      showToast(next ? 'HAGA DEBUG VISION 2.0: ACTIVE' : 'DEBUG VISION 2.0: DEACTIVATED');
      return next;
    });
  };

  return (
    <div className={`app-root ${debugVision ? 'debug-theme-overlay' : ''}`}>
      {/* CRT Scanline Overlay */}
      <div className="crt-overlay" aria-hidden="true" />

      {/* Retro Toast Feedback */}
      {toastMessage && (
        <div className="retro-toast-notification" role="status" aria-live="assertive">
          <span className="toast-icon">⚡</span>
          <span className="toast-text">{toastMessage}</span>
        </div>
      )}

      {/* Mode B: Recruiter Docket (Eksekutif) */}
      {viewMode === 'CONVENTIONAL' ? (
        <ConventionalView 
          onReturnToGame={() => setViewMode('GAME')}
          onShowToast={showToast}
        />
      ) : (
        <div className="game-wrapper">
          {/* Layar Pembuka (Title Screen) */}
          {!gameStarted ? (
            <TitleScreen 
              onStartExpedition={handleStartExpedition} 
              onOpenDocket={handleOpenDocketFromTitle}
            />
          ) : (
            <>
              {/* Persistent Executive Controller Header (Bab 2) */}
              <GameHUD
                onToggleView={handleToggleView}
                viewMode={viewMode}
                onToggleMute={handleToggleMute}
                isMuted={isMuted}
                nearbyPoint={nearbyPoint}
                debugVision={debugVision}
                onToggleDebug={handleToggleDebug}
                onOpenModal={handleOpenModal}
                diagnostics={diagnostics}
              />

              {/* Mode A: Open-World Expedition Canvas 2400×1800 (Bab 3) */}
              <main className="game-stage">
                <GameCanvas
                  onTriggerModal={handleOpenModal}
                  activeModal={activeModal}
                  onNearbyChange={(pt) => setNearbyPoint(pt)}
                  dpadState={dpadState}
                  debugVision={debugVision}
                  onDiagnosticsUpdate={(diag) => setDiagnostics(diag)}
                  isPaused={viewMode === 'CONVENTIONAL'}
                />
              </main>

              {/* Persistent Recruiter Express Bar (Footer) */}
              <RecruiterExpressBar
                onOpenModal={handleOpenModal}
                activeModal={activeModal}
                onToggleDebug={handleToggleDebug}
                debugVision={debugVision}
                onToggleView={handleToggleView}
              />

              {/* Virtual D-Pad for Mobile (< 640px) */}
              <VirtualDPad
                onDirectionChange={handleDpadDirection}
                onAction={handleDpadAction}
              />

              {/* JRPG Retro Modals */}
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
