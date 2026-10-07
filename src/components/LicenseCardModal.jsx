import React, { useRef, useEffect } from 'react';
import { sound } from '../utils/audio';

const STATS = {
  Playwright: 95,
  API: 92,
  'Edge-Case': 96,
  'CI/CD': 88,
  Mentoring: 90
};

export const LicenseCardModal = ({ isOpen, onClose }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // 800 x 500 px
    canvas.width = 800;
    canvas.height = 500;

    // 1. Background Obsidian Dark #0F172A
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, 800, 500);

    // Subtle modern grid pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 800; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 500);
      ctx.stroke();
    }
    for (let y = 0; y < 500; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(800, y);
      ctx.stroke();
    }

    // 2. Emerald Accent Micro-border 1px + Outer Frame
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 2;
    ctx.strokeRect(16, 16, 768, 468);

    // Corner decorative accents
    const corners = [
      [16, 16], [784, 16], [16, 484], [784, 484]
    ];
    ctx.fillStyle = '#06B6D4';
    corners.forEach(([cx, cy]) => {
      ctx.fillRect(cx - 4, cy - 4, 8, 8);
    });

    // 3. Top Header Badge
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.fillRect(36, 36, 728, 44);
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.strokeRect(36, 36, 728, 44);

    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillStyle = '#10B981';
    ctx.fillText('OFFICIAL CREDENTIAL • CERTIFIED QA SYSTEM SEEKER', 54, 63);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText('SERIAL: SL-QA-SEEKER-0099', 746, 63);
    ctx.textAlign = 'left';

    // 4. Operator Identification
    ctx.font = 'bold 28px "Inter", sans-serif';
    ctx.fillStyle = '#F8FAFC';
    ctx.fillText('Suryani Lestari', 54, 130);

    ctx.font = '14px "Inter", sans-serif';
    ctx.fillStyle = '#06B6D4';
    ctx.fillText('System Seeker & Quality Architect', 54, 155);

    ctx.font = '12px "Inter", sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('Basis Operasi: Bandung, Indonesia • suryani-lestari.my.id', 54, 180);

    // 5. Hero Metrics Strip on Card
    const metricsY = 220;
    const miniMetrics = [
      { label: 'Regression Speedup', val: '+85% (18m)' },
      { label: 'Defect Leak', val: '0 Desync' },
      { label: 'E2E Coverage', val: '92% Paths' }
    ];
    miniMetrics.forEach((m, idx) => {
      const mx = 54 + idx * 130;
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(mx, metricsY, 120, 56);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.strokeRect(mx, metricsY, 120, 56);

      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 13px "JetBrains Mono", monospace';
      ctx.fillText(m.val, mx + 10, metricsY + 26);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px "Inter", sans-serif';
      ctx.fillText(m.label, mx + 10, metricsY + 44);
    });

    // 6. Draw Radar Polygon Chart 5-Sumbu (Centered on Right Side)
    drawRadarAttributes(ctx, 608, 245, 95, STATS);

    // 7. Visual QR Code Box (Left Bottom: x: 54, y: 325, w: 100, h: 100)
    const qrX = 54;
    const qrY = 325;
    const qrSize = 100;
    drawVisualQrCode(ctx, qrX, qrY, qrSize, qrSize);

    // Text Beside QR Code (Clean, Left-aligned, No Collision)
    ctx.save();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 11px "Inter", sans-serif';
    ctx.fillText('SCAN VERIFIKASI RESMI:', 168, 344);

    // Pill badge for URL
    ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
    ctx.fillRect(168, 355, 260, 26);
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
    ctx.strokeRect(168, 355, 260, 26);

    ctx.fillStyle = '#06B6D4';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.fillText('https://suryani-lestari.my.id', 178, 372);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px "Inter", sans-serif';
    ctx.fillText('Terkoneksi langsung ke Digital Vault.', 168, 400);
    ctx.fillText('Zero Defect Leak • Playwright JS Suite Verified.', 168, 416);
    ctx.restore();

    // 8. Right Bottom Symmetrical Card: Certified Status & Seal Stamp (x: 470, y: 325, w: 276, h: 100)
    ctx.save();
    const credX = 470;
    const credY = 325;
    const credW = 276;
    const credH = 100;

    ctx.fillStyle = '#1E293B';
    ctx.fillRect(credX, credY, credW, credH);
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
    ctx.strokeRect(credX, credY, credW, credH);

    // Credential details
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.fillText('SEEKER HAGA CERTIFICATION', credX + 14, credY + 28);

    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 12px "Inter", sans-serif';
    ctx.fillText('Status: Active & Verified', credX + 14, credY + 48);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px "Inter", sans-serif';
    ctx.fillText('Role: QA Specialist', credX + 14, credY + 68);
    ctx.fillText('Handshake & API Contract Audited', credX + 14, credY + 84);

    // Double-ring Seal Stamp at Right of the card
    const sealX = credX + credW - 46;
    const sealY = credY + 50;

    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(sealX, sealY, 28, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(sealX, sealY, 23, 0, Math.PI * 2);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 8px "JetBrains Mono", monospace';
    ctx.fillText('VERIFIED', sealX, sealY - 5);
    ctx.fillText('QA AUDIT', sealX, sealY + 6);
    ctx.restore();

  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    sound.playNavTick();
    onClose();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    sound.playTerminalSuccess();
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'Suryani_Lestari_QA_Seeker_License.png';
    a.click();
  };

  return (
    <div className="jrpg-modal-backdrop" role="dialog" aria-modal="true" onClick={handleClose}>
      <div className="clean-tech-window license-modal-window" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="macos-window-header">
          <div className="window-dots">
            <span className="dot dot-red" onClick={handleClose} />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </div>
          <div className="window-title-badge">
            <span>🪪</span> PROCEDURAL SEEKER LICENSE CARD GENERATOR 800×500PX (BAB 07)
          </div>
          <button className="window-close-text" type="button" onClick={handleClose}>
            TUTUP [ESC]
          </button>
        </div>

        {/* Body Canvas View */}
        <div className="clean-modal-body license-canvas-body">
          <div className="license-canvas-wrapper">
            <canvas ref={canvasRef} className="procedural-id-canvas" />
          </div>

          <div className="license-download-toolbar">
            <button
              type="button"
              className="clean-btn execute-btn"
              onClick={handleDownload}
            >
              <span>📥</span> DOWNLOAD LICENSE CARD (.PNG)
            </button>
            <span className="license-viral-note">
              Kartu PNG resolusi tinggi siap dilampirkan ke berkas pelamar kerja atau dibagikan ke LinkedIn.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="clean-modal-footer">
          <span className="footer-meta-pill">Canvas toDataURL Engine • 800×500px Pixel Perfect</span>
          <button type="button" className="clean-btn secondary" onClick={handleClose}>
            KEMBALI KE PENJELAJAHAN [ESC]
          </button>
        </div>
      </div>
    </div>
  );
};

// Radar Polygon Chart 5-Sumbu (Prompt Halaman 7)
function drawRadarAttributes(ctx, centerX, centerY, radius, stats) {
  ctx.save();
  const axes = Object.keys(stats);
  const totalAxes = axes.length;

  // Background concentric polygons
  [0.33, 0.66, 1].forEach((level) => {
    ctx.beginPath();
    axes.forEach((axis, i) => {
      const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
      const x = centerX + Math.cos(angle) * (radius * level);
      const y = centerY + Math.sin(angle) * (radius * level);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.stroke();
  });

  // Axis spokes & labels
  axes.forEach((axis, i) => {
    const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.stroke();

    // Axis label
    const labelX = centerX + Math.cos(angle) * (radius + 18);
    const labelY = centerY + Math.sin(angle) * (radius + 18);
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#06B6D4';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${axis} ${stats[axis]}`, labelX, labelY);
  });

  // Filled Stats Polygon
  ctx.beginPath();
  axes.forEach((axis, i) => {
    const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
    const value = stats[axis] / 100;
    const x = centerX + Math.cos(angle) * (radius * value);
    const y = centerY + Math.sin(angle) * (radius * value);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(16, 185, 129, 0.35)';
  ctx.fill();
  ctx.strokeStyle = '#10B981';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

// Procedural Visual QR Code simulation
function drawVisualQrCode(ctx, x, y, w, h) {
  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(x, y, w, h);

  // Position markers
  ctx.fillStyle = '#0F172A';
  // Top-left
  ctx.fillRect(x + 8, y + 8, 28, 28);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(x + 14, y + 14, 16, 16);
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(x + 18, y + 18, 8, 8);

  // Top-right
  ctx.fillRect(x + w - 36, y + 8, 28, 28);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(x + w - 30, y + 14, 16, 16);
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(x + w - 26, y + 18, 8, 8);

  // Bottom-left
  ctx.fillRect(x + 8, y + h - 36, 28, 28);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(x + 14, y + h - 30, 16, 16);
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(x + 18, y + h - 26, 8, 8);

  // Random pixel bits for realism
  ctx.fillStyle = '#0F172A';
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if ((r * 7 + c * 13) % 3 === 0) {
        ctx.fillRect(x + 44 + c * 4, y + 44 + r * 4, 3, 3);
      }
    }
  }
  ctx.restore();
}
