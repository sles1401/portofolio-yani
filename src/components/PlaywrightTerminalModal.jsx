import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/audio';

const TEST_SUITES = {
  ppic: {
    id: 'ppic',
    name: '(1) Cross-Module Handshake (Marketing-PPIC)',
    file: 'e2e/ppic-marketing-sync.spec.ts',
    totalTime: '3.42',
    inspectorSteps: [
      { step: 1, action: 'page.goto("/orders/dispatch")', locator: 'url', state: 'Loaded 200 OK' },
      { step: 2, action: 'page.locator("[data-testid=submit-order]").dblclick()', locator: 'button[submit]', state: 'Trigger 10ms burst' },
      { step: 3, action: 'page.waitForResponse("**/api/ppic/sync")', locator: 'network', state: 'Handshake 200' },
      { step: 4, action: 'expect(orderCount).toBe(1)', locator: 'state-assertion', state: 'PASSED (0 Duplication)' }
    ],
    logs: [
      { file: 'ppic-marketing-sync.spec.ts', line: 14, desc: 'Setup isolated browser context & mock session', duration: 120 },
      { file: 'ppic-marketing-sync.spec.ts', line: 28, desc: 'Dispatch parallel checkout requests (delta: 10ms)', duration: 310 },
      { file: 'ppic-marketing-sync.spec.ts', line: 42, desc: 'Verify idempotency token in webhook headers', duration: 180 },
      { file: 'ppic-marketing-sync.spec.ts', line: 67, desc: 'Assert stock deduction atomic lock [status: 200]', duration: 240 }
    ]
  },
  auth: {
    id: 'auth',
    name: '(2) User Auth Boundary & Session Expiry',
    file: 'e2e/auth-boundary.spec.ts',
    totalTime: '2.18',
    inspectorSteps: [
      { step: 1, action: 'page.goto("/dashboard/operator")', locator: 'viewport', state: 'Authenticated' },
      { step: 2, action: 'page.evaluate(() => localStorage.setItem("jwt", "expired"))', locator: 'storage', state: 'Token manipulated' },
      { step: 3, action: 'page.getByRole("button", { name: "Proses Data" }).click()', locator: 'button', state: 'Intercepted 401' },
      { step: 4, action: 'expect(page).toHaveURL(/\\/login/)', locator: 'router', state: 'PASSED (Redirect Guard)' }
    ],
    logs: [
      { file: 'auth-boundary.spec.ts', line: 12, desc: 'Seed test operator credentials into staging DB', duration: 95 },
      { file: 'auth-boundary.spec.ts', line: 26, desc: 'Simulate JWT token tamper & expiry in LocalStorage', duration: 150 },
      { file: 'auth-boundary.spec.ts', line: 49, desc: 'Execute restricted API action via UI click', duration: 210 },
      { file: 'auth-boundary.spec.ts', line: 71, desc: 'Verify defensive fallback redirection to /login', duration: 190 }
    ]
  },
  api: {
    id: 'api',
    name: '(3) REST API Schema Contract & Null Defense',
    file: 'api/schema-contract.spec.ts',
    totalTime: '1.85',
    inspectorSteps: [
      { step: 1, action: 'request.get("/api/v2/inventory/items")', locator: 'api-client', state: '200 OK Response' },
      { step: 2, action: 'expect(body).toHaveProperty("items")', locator: 'schema-guard', state: 'Property exists' },
      { step: 3, action: 'expect(Array.isArray(body.items)).toBeTruthy()', locator: 'type-check', state: 'Array validated' },
      { step: 4, action: 'request.post("/api/v2/inventory", { body: nullPayload })', locator: 'boundary-check', state: 'Defensive 400 Caught' }
    ],
    logs: [
      { file: 'schema-contract.spec.ts', line: 9, desc: 'Fetch inventory endpoint with schema validator', duration: 80 },
      { file: 'schema-contract.spec.ts', line: 22, desc: 'Assert nested keys and non-null guarantees', duration: 140 },
      { file: 'schema-contract.spec.ts', line: 38, desc: 'Inject boundary edge-case payload with empty arrays', duration: 175 },
      { file: 'schema-contract.spec.ts', line: 55, desc: 'Validate error schema conformity (RFC 7807)', duration: 130 }
    ]
  }
};

export const PlaywrightTerminalModal = ({ isOpen, onClose }) => {
  const [selectedSuiteKey, setSelectedSuiteKey] = useState('ppic');
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [isCompleted, setIsCompleted] = useState(false);
  const terminalEndRef = useRef(null);

  if (!isOpen) return null;

  const currentSuite = TEST_SUITES[selectedSuiteKey];

  const handleClose = () => {
    sound.playNavTick();
    onClose();
  };

  const handleExecute = () => {
    if (isRunning) return;
    setIsRunning(true);
    setIsCompleted(false);
    setActiveStepIndex(-1);
    sound.playNavTick();

    const initialLine = `> playwright test --project=chromium --headed --spec=${currentSuite.file}`;
    setTerminalOutput([initialLine, `Running 4 tests using 2 workers\n`]);

    const steps = currentSuite.logs;
    steps.forEach((log, index) => {
      setTimeout(() => {
        sound.playNavTick();
        setActiveStepIndex(index);
        setTerminalOutput((prev) => [
          ...prev,
          `  ✓ [chromium] › ${log.file}:${log.line} › ${log.desc} (${log.duration}ms)`
        ]);

        if (index === steps.length - 1) {
          setTimeout(() => {
            sound.playTerminalSuccess();
            setTerminalOutput((prev) => [
              ...prev,
              `\n======================================================`,
              `  4 passed (${currentSuite.totalTime}s) | Exit Code: 0 (SUCCESS)`,
              `  Trace Artifact: ./artifacts/traces/${selectedSuiteKey}-trace.zip`,
              `  Allure Report:  ./reports/allure-results/index.html`
            ]);
            setIsRunning(false);
            setIsCompleted(true);
          }, 350);
        }
      }, (index + 1) * 450);
    });
  };

  return (
    <div className="jrpg-modal-backdrop" role="dialog" aria-modal="true" onClick={handleClose}>
      <div className="clean-tech-window terminal-modal-window" onClick={(e) => e.stopPropagation()}>
        
        {/* macOS / Linux Window Header */}
        <div className="macos-window-header">
          <div className="window-dots">
            <span className="dot dot-red" onClick={handleClose} />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </div>
          <div className="window-title-badge">
            <span>⚡</span> PLAYWRIGHT TEST RUNNER &amp; STEP INSPECTOR (LIVE BROWSER SIMULATION)
          </div>
          <button className="window-close-text" type="button" onClick={handleClose}>
            TUTUP [ESC]
          </button>
        </div>

        {/* Top Controls Toolbar */}
        <div className="terminal-controls-toolbar">
          <div className="suite-selector-wrap">
            <label htmlFor="testSuiteSelect">PILIH TEST SUITE:</label>
            <select
              id="testSuiteSelect"
              className="clean-select"
              value={selectedSuiteKey}
              onChange={(e) => {
                sound.playNavTick();
                setSelectedSuiteKey(e.target.value);
                setTerminalOutput([]);
                setActiveStepIndex(-1);
                setIsCompleted(false);
              }}
              disabled={isRunning}
            >
              <option value="ppic">1. Cross-Module Handshake (Marketing-PPIC)</option>
              <option value="auth">2. User Auth Boundary &amp; Session Expiry</option>
              <option value="api">3. REST API Schema Contract &amp; Null Defense</option>
            </select>
          </div>

          <button
            type="button"
            className={`clean-btn execute-btn ${isRunning ? 'running' : ''}`}
            onClick={handleExecute}
            disabled={isRunning}
          >
            <span>{isRunning ? '⏳ RUNNING...' : '▶ EXECUTE SUITE'}</span>
          </button>
        </div>

        {/* Split View: Terminal & Step Inspector */}
        <div className="terminal-split-layout">
          {/* Left: Terminal Output */}
          <div className="terminal-output-pane">
            <div className="terminal-pane-label">TERMINAL CLI STREAM (STDOUT)</div>
            <pre className="terminal-code-view">
              {terminalOutput.length === 0 ? (
                <span className="terminal-placeholder">
                  Pilih suite di atas dan tekan <strong>[▶ EXECUTE SUITE]</strong> untuk mensimulasikan eksekusi Playwright JS secara real-time.
                </span>
              ) : (
                terminalOutput.map((line, idx) => (
                  <div key={idx} className={line.includes('✓') ? 'log-pass' : line.includes('Exit Code') ? 'log-success' : 'log-info'}>
                    {line}
                  </div>
                ))
              )}
              <div ref={terminalEndRef} />
            </pre>
          </div>

          {/* Right: DOM Step Inspector */}
          <div className="inspector-output-pane">
            <div className="terminal-pane-label">STEP INSPECTOR &amp; DOM LOCATOR ACTIONS</div>
            <div className="inspector-steps-list">
              {currentSuite.inspectorSteps.map((st, idx) => {
                const isActive = activeStepIndex === idx;
                const isPassed = activeStepIndex > idx || isCompleted;

                return (
                  <div key={st.step} className={`inspector-step-item ${isActive ? 'active' : isPassed ? 'passed' : 'pending'}`}>
                    <div className="step-num-badge">
                      {isPassed ? '✓' : isActive ? '▶' : st.step}
                    </div>
                    <div className="step-meta">
                      <code className="step-action">{st.action}</code>
                      <div className="step-sub">
                        <span className="step-loc">Target: {st.locator}</span>
                        <span className="step-state">{st.state}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="inspector-footer-note">
              <span>Membuktikan penguasaan: Headless context isolation, data-testid query resilience, dan trace artifacts.</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="clean-modal-footer">
          <div className="footer-meta-pill">
            <span>Framework: Playwright JS v1.42</span>
            <span>•</span>
            <span>Reporter: Allure &amp; Trace Viewer</span>
          </div>
          <button type="button" className="clean-btn secondary" onClick={handleClose}>
            KEMBALI KE PENJELAJAHAN
          </button>
        </div>
      </div>
    </div>
  );
};
