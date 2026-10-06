import React, { useState } from 'react';
import { sound } from '../utils/audio';

const TEST_MATRIX_DATA = [
  {
    tcId: 'TC-PPIC-01',
    priority: 'P0 - CRITICAL',
    flow: 'Sinkronisasi Stok Marketing ➔ PPIC',
    condition: 'Submit order bersamaan (10ms burst)',
    expected: 'Idempotency key menolak duplikasi manifest',
    outcome: 'Idempotency aktif, order kedua dibatalkan (409 Conflict)',
    assertion: 'expect(status).toBe(409)'
  },
  {
    tcId: 'TC-API-04',
    priority: 'P1 - HIGH',
    flow: 'Payload Kontrak REST API',
    condition: 'Array item bernilai kosong / null',
    expected: 'Schema validation menangkap null payload',
    outcome: 'Respon defensif 400 Bad Request / 422 Unprocessable',
    assertion: 'expect(body).toHaveProperty("error")'
  },
  {
    tcId: 'TC-AUTH-09',
    priority: 'P1 - HIGH',
    flow: 'Sesi Operator & Pembatasan Akses',
    condition: 'Manipulasi token JWT kadaluarsa di LocalStorage',
    expected: 'Middleware auth memblokir akses rute privat',
    outcome: 'Otomatis redirect ke halaman /login tanpa data leak',
    assertion: 'expect(page).toHaveURL(/\\/login/)'
  },
  {
    tcId: 'TC-REG-15',
    priority: 'P2 - MEDIUM',
    flow: 'Form Checkout Multi-Device',
    condition: 'Viewport resizing 375px (iPhone) ke 1440px Desktop',
    expected: 'Button aksi konfirmasi tetap terlihat dalam viewport',
    outcome: 'Layout responsif sempurna, zero visual clipping',
    assertion: 'expect(submitBtn).toBeVisible()'
  }
];

export const VisualRegressionModal = ({ isOpen, onClose }) => {
  const [sliderPos, setSliderPos] = useState(50); // percentage
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeTab, setActiveTab] = useState('slider'); // 'slider' | 'matrix' | 'network'

  if (!isOpen) return null;

  const handleClose = () => {
    sound.playNavTick();
    onClose();
  };

  const filteredMatrix = TEST_MATRIX_DATA.filter((row) => {
    const q = searchKeyword.toLowerCase();
    return (
      row.tcId.toLowerCase().includes(q) ||
      row.flow.toLowerCase().includes(q) ||
      row.condition.toLowerCase().includes(q) ||
      row.assertion.toLowerCase().includes(q)
    );
  });

  return (
    <div className="jrpg-modal-backdrop" role="dialog" aria-modal="true" onClick={handleClose}>
      <div className="clean-tech-window visual-regression-window" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="macos-window-header">
          <div className="window-dots">
            <span className="dot dot-red" onClick={handleClose} />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </div>
          <div className="window-title-badge">
            <span>🔍</span> VISUAL REGRESSION &amp; TRACE ARTIFACT INSPECTOR (BAB 04)
          </div>
          <button className="window-close-text" type="button" onClick={handleClose}>
            TUTUP [ESC]
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="clean-subnav-bar">
          <button
            type="button"
            className={`subnav-tab ${activeTab === 'slider' ? 'active' : ''}`}
            onClick={() => { sound.playNavTick(); setActiveTab('slider'); }}
          >
            <span>🖼️</span> 1. Visual Regression Split-View Slider
          </button>

          <button
            type="button"
            className={`subnav-tab ${activeTab === 'matrix' ? 'active' : ''}`}
            onClick={() => { sound.playNavTick(); setActiveTab('matrix'); }}
          >
            <span>📊</span> 2. Matriks Pengujian Terverifikasi ({filteredMatrix.length})
          </button>

          <button
            type="button"
            className={`subnav-tab ${activeTab === 'network' ? 'active' : ''}`}
            onClick={() => { sound.playNavTick(); setActiveTab('network'); }}
          >
            <span>📡</span> 3. Network Payload Drawer (HTTP 200 vs 409/422)
          </button>
        </div>

        {/* Tab 1: Visual Regression Split-View Slider */}
        {activeTab === 'slider' && (
          <div className="clean-modal-body">
            <div className="slider-instruction-row">
              <span className="s-instruct">Geser tuas pembagi emerald di tengah untuk membandingkan tampilan:</span>
              <span className="s-badge-red">KIRI: DEFECT STATE (SEBELUM)</span>
              <span className="s-badge-green">KANAN: VERIFIED PRODUCTION (PASCA-AUDIT)</span>
            </div>

            {/* Split View Container */}
            <div className="visual-diff-container">
              {/* Before View (Defect State) */}
              <div className="diff-view defect-state">
                <div className="state-watermark defect">DEFECT STATE (MISALIGNED DOM &amp; OVERFLOW)</div>
                <div className="mock-ui-card defect-mock">
                  <div className="mock-header defect-head">
                    <span className="mock-badge-error">ERR: DUPLICATE_SYNC_PENDING</span>
                    <span className="mock-title-clipped">Pesanan #9821 - PPIC Status: Unconfirmed!</span>
                  </div>
                  <div className="mock-body-broken">
                    <div className="broken-box-1">❌ Tombol Tertutup Dropdown</div>
                    <div className="broken-box-2">⚠️ Data Stok: NaN (Desync)</div>
                  </div>
                </div>
              </div>

              {/* After View (Verified Production) with clip-path based on sliderPos */}
              <div 
                className="diff-view verified-state"
                style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
              >
                <div className="state-watermark verified">VERIFIED PRODUCTION (PLAYWRIGHT ASSERTION PASSED)</div>
                <div className="mock-ui-card verified-mock">
                  <div className="mock-header verified-head">
                    <span className="mock-badge-success">STATUS: 200 HANDSHAKE VERIFIED</span>
                    <span className="mock-title-clean">Pesanan #9821 - PPIC Status: Synchronized</span>
                  </div>
                  <div className="mock-body-clean">
                    <div className="clean-box-1">✔ Idempotency Key Active</div>
                    <div className="clean-box-2">✔ Data Stok: 100% Konsisten</div>
                  </div>
                </div>
              </div>

              {/* Drag Handle emerald #10B981 */}
              <div 
                className="diff-slider-divider"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="slider-handle-pill">
                  <span>◀</span>
                  <span>▶</span>
                </div>
              </div>

              {/* Native range slider for accessible smooth drag */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="diff-range-input"
                aria-label="Visual regression split slider"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Test Matrix */}
        {activeTab === 'matrix' && (
          <div className="clean-modal-body">
            <div className="matrix-search-bar">
              <input
                type="text"
                placeholder="Filter matriks uji berdasarkan kata kunci (e.g. PPIC, Schema, 409, Login)..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="clean-input"
              />
            </div>

            <div className="table-responsive-wrapper">
              <table className="clean-table">
                <thead>
                  <tr>
                    <th>TC ID</th>
                    <th>Prioritas</th>
                    <th>Alur Pengguna</th>
                    <th>Kondisi Pengujian</th>
                    <th>Hasil Terverifikasi</th>
                    <th>Playwright Assertion</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMatrix.map((row) => (
                    <tr key={row.tcId}>
                      <td><code className="tc-code">{row.tcId}</code></td>
                      <td><span className="priority-pill">{row.priority}</span></td>
                      <td><strong>{row.flow}</strong></td>
                      <td>{row.condition}</td>
                      <td className="after-cell">✔ {row.outcome}</td>
                      <td><code className="assert-code">{row.assertion}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Network Payload Drawer */}
        {activeTab === 'network' && (
          <div className="clean-modal-body">
            <div className="network-drawer-grid">
              {/* Payload 1: HTTP 200 OK */}
              <div className="network-card pass-card">
                <div className="network-card-header">
                  <span className="net-badge success">POST /api/ppic/sync ➔ 200 OK</span>
                  <small>Verified Handshake Response</small>
                </div>
                <pre className="network-code">
{`{
  "status": "synchronized",
  "idempotency_key": "IDEMP-8921-9901",
  "ledger_timestamp": "2026-10-06T15:00:00Z",
  "order_count": 1,
  "stock_reserved": true
}`}
                </pre>
              </div>

              {/* Payload 2: HTTP 409 / 422 Conflict Intercepted */}
              <div className="network-card error-card">
                <div className="network-card-header">
                  <span className="net-badge error">POST /api/ppic/sync ➔ 409 CONFLICT</span>
                  <small>Defensive Duplicate Intercepted</small>
                </div>
                <pre className="network-code">
{`{
  "error": "DUPLICATE_ORDER_DISPATCH_BLOCKED",
  "detail": "Request with identical key already in processing.",
  "mitigation": "Idempotency handshake preserved.",
  "financial_loss_prevented": true
}`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="clean-modal-footer">
          <span className="footer-meta-pill">Evidence Artifact: Playwright Trace Viewer Verified • 0 Visual Regression</span>
          <button type="button" className="clean-btn primary" onClick={handleClose}>
            KEMBALI KE PENJELAJAHAN [ESC]
          </button>
        </div>
      </div>
    </div>
  );
};
