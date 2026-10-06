import React, { useState } from 'react';
import { sound } from '../utils/audio';

export const RoiCalculatorModal = ({ isOpen, onClose, onOpenDispatch }) => {
  const [manualHours, setManualHours] = useState(20); // 5 - 60 jam
  const [hourlyRate, setHourlyRate] = useState(45); // USD per hour (or convert to IDR)
  const [currency, setCurrency] = useState('USD'); // 'USD' | 'IDR'

  if (!isOpen) return null;

  const handleClose = () => {
    sound.playNavTick();
    onClose();
  };

  // Formula Algoritma (Prompt Halaman 5)
  const efficiencyGain = 0.85; // 85% Pemotongan Waktu
  const weeklyHoursSaved = manualHours * efficiencyGain;
  const monthlyHoursSaved = Math.round(weeklyHoursSaved * 4.2);
  const rateMultiplier = currency === 'IDR' ? hourlyRate * 15000 : hourlyRate;
  const monthlyBudgetPreserved = Math.round(monthlyHoursSaved * rateMultiplier);

  const formattedBudget = currency === 'IDR'
    ? `Rp ${monthlyBudgetPreserved.toLocaleString('id-ID')}`
    : `$${monthlyBudgetPreserved.toLocaleString('en-US')}`;

  const handleSliderChange = (setter, val) => {
    sound.playNavTick();
    setter(Number(val));
  };

  const handleConvert = () => {
    sound.playTerminalSuccess();
    onClose();
    if (onOpenDispatch) {
      onOpenDispatch();
    }
  };

  return (
    <div className="jrpg-modal-backdrop" role="dialog" aria-modal="true" onClick={handleClose}>
      <div className="clean-tech-window roi-modal-window" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="macos-window-header">
          <div className="window-dots">
            <span className="dot dot-red" onClick={handleClose} />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </div>
          <div className="window-title-badge">
            <span>📈</span> HIRING ROI &amp; EFFICIENCY CALCULATOR WIDGET (BAB 05)
          </div>
          <button className="window-close-text" type="button" onClick={handleClose}>
            TUTUP [ESC]
          </button>
        </div>

        {/* Body */}
        <div className="clean-modal-body roi-modal-body">
          <div className="roi-intro-banner">
            <div>
              <span className="roi-tag">BUSINESS CONVERSION CALCULATOR</span>
              <h4>Ubah Biaya QA Menjadi Investasi Strategis</h4>
              <p>Hitung penghematan anggaran operasional dan percepatan rilis saat Suryani Lestari membangun harness otomasi Playwright JS untuk tim Anda.</p>
            </div>
            <div className="currency-toggle">
              <button
                type="button"
                className={`curr-btn ${currency === 'USD' ? 'active' : ''}`}
                onClick={() => { sound.playNavTick(); setCurrency('USD'); }}
              >
                USD ($)
              </button>
              <button
                type="button"
                className={`curr-btn ${currency === 'IDR' ? 'active' : ''}`}
                onClick={() => { sound.playNavTick(); setCurrency('IDR'); }}
              >
                IDR (Rp)
              </button>
            </div>
          </div>

          <div className="roi-calculator-grid">
            {/* Left: Input Sliders */}
            <div className="roi-sliders-pane">
              {/* Slider 1: Jam Uji Regresi Manual Mingguan */}
              <div className="slider-group">
                <div className="slider-label-row">
                  <label htmlFor="manualHoursSlider">1. Jam Uji Regresi Manual Mingguan:</label>
                  <span className="slider-value-display">{manualHours} Jam / Minggu</span>
                </div>
                <input
                  id="manualHoursSlider"
                  type="range"
                  min="5"
                  max="60"
                  step="1"
                  value={manualHours}
                  onChange={(e) => handleSliderChange(setManualHours, e.target.value)}
                  className="clean-slider"
                />
                <div className="slider-minmax">
                  <span>5 Jam</span>
                  <span>Default: 20 Jam</span>
                  <span>60 Jam</span>
                </div>
              </div>

              {/* Slider 2: Estimasi Biaya Per Jam */}
              <div className="slider-group">
                <div className="slider-label-row">
                  <label htmlFor="hourlyRateSlider">2. Estimasi Biaya Per Jam Tim Engineer ({currency}):</label>
                  <span className="slider-value-display">
                    {currency === 'USD' ? `$${hourlyRate}/jam` : `Rp ${(hourlyRate * 15000).toLocaleString('id-ID')}/jam`}
                  </span>
                </div>
                <input
                  id="hourlyRateSlider"
                  type="range"
                  min="20"
                  max="120"
                  step="5"
                  value={hourlyRate}
                  onChange={(e) => handleSliderChange(setHourlyRate, e.target.value)}
                  className="clean-slider"
                />
                <div className="slider-minmax">
                  <span>{currency === 'USD' ? '$20' : 'Rp 300rb'}</span>
                  <span>{currency === 'USD' ? '$45 (Rata-rata)' : 'Rp 675rb'}</span>
                  <span>{currency === 'USD' ? '$120' : 'Rp 1.8jt'}</span>
                </div>
              </div>

              {/* Visual Bar Comparison: Sebelum vs Sesudah */}
              <div className="release-duration-comparison">
                <h5 className="comp-title">DURASI SIKLUS RILIS SPRINT: SEBELUM VS SESUDAH</h5>
                <div className="duration-bars">
                  <div className="d-bar-row">
                    <span className="d-bar-label">Sebelum (Manual):</span>
                    <div className="d-bar-track">
                      <div className="d-bar-fill before" style={{ width: '100%' }}>
                        <span>2 Hari Kerja (16 Jam)</span>
                      </div>
                    </div>
                  </div>
                  <div className="d-bar-row">
                    <span className="d-bar-label">Sesudah (Playwright JS):</span>
                    <div className="d-bar-track">
                      <div className="d-bar-fill after" style={{ width: '15%' }}>
                        <span>18 Menit (Terpangkas 85%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Calculated Metrics Output Bento */}
            <div className="roi-results-pane">
              <h5 className="results-pane-title">HASIL ESTIMASI PENGHEMATAN:</h5>

              <div className="roi-result-card highlight">
                <span className="r-label">PENGHEMATAN ANGGARAN BULANAN</span>
                <div className="r-value big">{formattedBudget}</div>
                <small className="r-sub">Dihitung dari formula: {monthlyHoursSaved} jam hemat × tarif tim × 4.2 minggu</small>
              </div>

              <div className="roi-metrics-pair">
                <div className="roi-result-card">
                  <span className="r-label">JAM KERJA DISELAMATKAN</span>
                  <div className="r-value">{monthlyHoursSaved} Jam / Bulan</div>
                  <small className="r-sub">Dapat dialihkan ke fitur baru</small>
                </div>

                <div className="roi-result-card">
                  <span className="r-label">KECEPATAN BALIK MODAL (PAYBACK)</span>
                  <div className="r-value">3.5 Sprint Cycles</div>
                  <small className="r-sub">ROI positif dalam 1-2 bulan</small>
                </div>
              </div>

              {/* Call-to-Action Convert Button (Prompt Halaman 5) */}
              <button
                type="button"
                className="clean-btn execute-btn hire-convert-btn"
                onClick={handleConvert}
              >
                <span>⚔️</span> REKRUT SURYANI LESTARI UNTUK MEMBANGUN OTOMASI
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="clean-modal-footer">
          <span className="footer-meta-pill">Formula Terverifikasi: 85% Pemotongan Waktu Regresi via Playwright Parallel Runner</span>
          <button type="button" className="clean-btn secondary" onClick={handleClose}>
            TUTUP KALKULATOR [ESC]
          </button>
        </div>
      </div>
    </div>
  );
};
