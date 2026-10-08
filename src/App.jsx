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
import { PlaywrightTerminalModal } from './components/PlaywrightTerminalModal';
import { SecretChamberModal } from './components/SecretChamberModal';
import { VisualRegressionModal } from './components/VisualRegressionModal';
import { RoiCalculatorModal } from './components/RoiCalculatorModal';
import { InterviewSimulatorModal } from './components/InterviewSimulatorModal';
import { LicenseCardModal } from './components/LicenseCardModal';
import { ConventionalView } from './components/ConventionalView';
import { WelcomeModal } from './components/WelcomeModal';
import { sound } from './utils/audio';

const STORAGE_KEY = 'qa_seeker_exploration_mode';

// Helper to inspect URL parameters and hash for Dual-Target Routing
const checkUrlMode = () => {
  if (typeof window === 'undefined') return null;
  const searchParams = new URLSearchParams(window.location.search);
  const view = searchParams.get('view')?.toLowerCase();
  const hash = window.location.hash.toLowerCase();

  if (view === 'recruiter' || hash === '#docket' || hash === '#recruiter') {
    return 'recruiter';
  }
  if (view === 'seeker' || view === 'game' || view === 'jrpg' || hash === '#seeker' || hash === '#game') {
    return 'seeker';
  }
  return null;
};

export const App = () => {
  // Initialize state based on URL params and localStorage persistence
  const [initialRouting] = useState(() => {
    const urlMode = checkUrlMode();
    if (urlMode === 'recruiter') {
      return { viewMode: 'CONVENTIONAL', gameStarted: true, showWelcome: false, hasPreference: true };
    }
    if (urlMode === 'seeker') {
      return { viewMode: 'GAME', gameStarted: true, showWelcome: false, hasPreference: true };
    }

    const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved === 'recruiter') {
      return { viewMode: 'CONVENTIONAL', gameStarted: true, showWelcome: false, hasPreference: true };
    }
    if (saved === 'seeker') {
      return { viewMode: 'GAME', gameStarted: true, showWelcome: false, hasPreference: true };
    }

    // First visit without URL param: Show Welcome Modal
    return { viewMode: 'CONVENTIONAL', gameStarted: false, showWelcome: true, hasPreference: false };
  });

  const [viewMode, setViewMode] = useState(initialRouting.viewMode); // 'GAME' (Mode A) | 'CONVENTIONAL' (Mode B: Recruiter Docket)
  const [gameStarted, setGameStarted] = useState(initialRouting.gameStarted);
  const [showWelcomeModal, setShowWelcomeModal] = useState(initialRouting.showWelcome);
  const [activeModal, setActiveModal] = useState(null); // 'QUESTS' | 'BESTIARY' | 'GEAR' | 'DISPATCH' | 'TERMINAL' | 'SECRET_CHAMBER' | 'VISUAL_REGRESSION' | 'ROI_CALC' | 'INTERVIEW' | 'LICENSE_CARD' | null
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

  // Update browser URL query/hash when switching views for easy sharing & bookmarking
  const syncUrlForMode = useCallback((mode) => {
    if (typeof window === 'undefined') return;
    try {
      const url = new URL(window.location.href);
      if (mode === 'recruiter') {
        url.searchParams.set('view', 'recruiter');
        url.hash = 'docket';
      } else {
        url.searchParams.delete('view');
        if (url.hash === '#docket' || url.hash === '#recruiter') {
          url.hash = '';
        }
      }
      window.history.replaceState(null, '', url.toString());
    } catch {
      // guard
    }
  }, []);

  // Mode Selection Handler (from Welcome Modal or Mode Switchers)
  const handleSelectExplorationMode = useCallback((mode) => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // guard for private browsing
    }

    setShowWelcomeModal(false);
    setGameStarted(true);

    if (mode === 'recruiter') {
      setViewMode('CONVENTIONAL');
      syncUrlForMode('recruiter');
      showToast('RECRUITER MODE ACTIVE: Clean Docket & Technical Case Studies');
    } else {
      setViewMode('GAME');
      syncUrlForMode('seeker');
      showToast('JRPG MODE ACTIVE: Welcome to Central Plaza (2400×1800px)');
    }
  }, [syncUrlForMode, showToast]);

  // URL Query Param & Hash Listener
  useEffect(() => {
    const handleUrlRouting = () => {
      const routeMode = checkUrlMode();
      if (routeMode === 'recruiter') {
        setShowWelcomeModal(false);
        setGameStarted(true);
        setViewMode('CONVENTIONAL');
      } else if (routeMode === 'seeker') {
        setShowWelcomeModal(false);
        setGameStarted(true);
        setViewMode('GAME');
      }
    };

    window.addEventListener('popstate', handleUrlRouting);
    window.addEventListener('hashchange', handleUrlRouting);
    return () => {
      window.removeEventListener('popstate', handleUrlRouting);
      window.removeEventListener('hashchange', handleUrlRouting);
    };
  }, []);

  // Global Keyboard Shortcuts (Bab 2 & 4: [M], [D], [ESC])
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      const code = e.code;

      // [ESC]: Close all modal windows or reset view (Bab 2)
      if (code === 'Escape') {
        if (showWelcomeModal && gameStarted) {
          sound.playClose();
          setShowWelcomeModal(false);
        } else if (activeModal) {
          sound.playClose();
          setActiveModal(null);
        } else if (viewMode === 'CONVENTIONAL') {
          sound.playClose();
          setViewMode('GAME');
          syncUrlForMode('seeker');
        }
      }

      // [D]: Toggle Haga Debug Vision 2.0 (Bab 4)
      if (code === 'KeyD' && viewMode === 'GAME' && !activeModal && !showWelcomeModal) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          sound.playScan();
          setDebugVision((prev) => {
            const next = !prev;
            showToast(next ? 'HAGA DEBUG VISION 2.0: ACTIVE' : 'DEBUG VISION 2.0: DEACTIVATED');
            return next;
          });
        }
      }

      // [M]: Toggle View between Mode A (Expedition) & Mode B (Recruiter Docket) (Bab 2)
      if (code === 'KeyM' && !showWelcomeModal) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          sound.playSelect();
          setViewMode((prev) => {
            const next = prev === 'GAME' ? 'CONVENTIONAL' : 'GAME';
            const nextModeName = next === 'CONVENTIONAL' ? 'recruiter' : 'seeker';
            try {
              localStorage.setItem(STORAGE_KEY, nextModeName);
            } catch {
              // guard
            }
            syncUrlForMode(nextModeName);
            showToast(next === 'CONVENTIONAL' ? 'VIEW SWITCHED: Recruiter Docket' : 'VIEW SWITCHED: JRPG Interactive Map');
            return next;
          });
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [activeModal, viewMode, showWelcomeModal, gameStarted, syncUrlForMode, showToast]);

  const handleStartExpedition = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'seeker');
    } catch {
      // guard
    }
    setGameStarted(true);
    setViewMode('GAME');
    syncUrlForMode('seeker');
  };

  const handleOpenDocketFromTitle = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'recruiter');
    } catch {
      // guard
    }
    setGameStarted(true);
    setViewMode('CONVENTIONAL');
    syncUrlForMode('recruiter');
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
    setViewMode((prev) => {
      const next = prev === 'GAME' ? 'CONVENTIONAL' : 'GAME';
      const nextModeName = next === 'CONVENTIONAL' ? 'recruiter' : 'seeker';
      try {
        localStorage.setItem(STORAGE_KEY, nextModeName);
      } catch {
        // guard
      }
      syncUrlForMode(nextModeName);
      showToast(next === 'CONVENTIONAL' ? 'VIEW SWITCHED: Recruiter Docket' : 'VIEW SWITCHED: JRPG Interactive Map');
      return next;
    });
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
    sound.playModalSwoop();
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

  const handleOpenWelcomeGate = () => {
    sound.playNavTick();
    setShowWelcomeModal(true);
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
          onReturnToGame={() => {
            sound.playSelect();
            setViewMode('GAME');
            syncUrlForMode('seeker');
          }}
          onShowToast={showToast}
          onOpenModal={handleOpenModal}
          onOpenWelcomeModal={handleOpenWelcomeGate}
        />
      ) : (
        <div className="game-wrapper">
          {/* Layar Pembuka (Title Screen) - Only shown if game has not started yet */}
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
                onOpenWelcomeModal={handleOpenWelcomeGate}
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
            </>
          )}
        </div>
      )}

      {/* 1. Welcome Modal Gateway (Dual-Target Audience Routing) */}
      <WelcomeModal
        isOpen={showWelcomeModal}
        onSelectMode={handleSelectExplorationMode}
        onClose={() => setShowWelcomeModal(false)}
        canClose={gameStarted}
        currentMode={viewMode === 'CONVENTIONAL' ? 'recruiter' : 'seeker'}
      />

      {/* Global Modals (Accessible in both Mode A & Mode B) */}
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

      {/* Blueprint v5.2 Clean-Tech Modals */}
      <PlaywrightTerminalModal
        isOpen={activeModal === 'TERMINAL' || activeModal === 'PLAYWRIGHT_TERMINAL'}
        onClose={() => setActiveModal(null)}
      />

      <SecretChamberModal
        isOpen={activeModal === 'SECRET_CHAMBER'}
        onClose={() => setActiveModal(null)}
      />

      <VisualRegressionModal
        isOpen={activeModal === 'VISUAL_REGRESSION'}
        onClose={() => setActiveModal(null)}
      />

      <RoiCalculatorModal
        isOpen={activeModal === 'ROI_CALC'}
        onClose={() => setActiveModal(null)}
        onOpenDispatch={() => setActiveModal('DISPATCH')}
      />

      <InterviewSimulatorModal
        isOpen={activeModal === 'INTERVIEW'}
        onClose={() => setActiveModal(null)}
      />

      <LicenseCardModal
        isOpen={activeModal === 'LICENSE_CARD'}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
};
