import React, { useState } from 'react';
import { sound } from '../utils/audio';

const SCENARIOS = [
  {
    id: 'scen-1',
    title: 'Skenario 1: Krisis Rilis & Manajemen Risiko (Production Pressure)',
    npcName: 'Marcus Vance — Product Director',
    npcRole: 'Executive Stakeholder',
    situation: '"Rilis terjadwal 3 jam lagi, namun terdeteksi anomali minor pada sinkronisasi sekunder modul PPIC. Apa keputusan Anda sebagai Lead QA?"',
    options: [
      {
        id: 'A',
        label: '(A) Blokir total tanpa kompromi (Hard Stop)',
        text: 'Batalkan rilis secara sepihak sampai seluruh anomali 100% diperbaiki, abaikan jadwal bisnis dan peluncuran marketing.',
        isOptimal: false,
        feedback: 'Terlalu kaku dan mengabaikan nilai bisnis. Sebagai QA Lead, kita perlu menimbang dampak komersial dan menyajikan opsi mitigasi terukur, bukan sekadar menjadi penolak rilis pasif.'
      },
      {
        id: 'B',
        label: '(B) Pendekatan Analitis & Mitigasi Risiko (PILIHAN UNGGULAN)',
        text: 'Sajikan matriks risiko ke CTO, isolasi alur transaksi finansial dengan feature-flag proteksi, loloskan modul inti yang stabil, dan siapkan hotfix test suite otomatis dalam sprint patch.',
        isOptimal: true,
        feedback: 'Pilihan Sempurna! Menunjukkan kedewasaan kepemimpinan (Leadership & Crisis Diplomacy). Anda memproteksi integritas finansial pengguna tanpa mematikan momentum komersial perusahaan.'
      },
      {
        id: 'C',
        label: '(C) Rilis pasif dan pantau log nanti (Wishful Thinking)',
        text: 'Biarkan rilis berjalan sesuai jadwal, lalu pantau di Sentry apakah ada komplain pengguna di production.',
        isOptimal: false,
        feedback: 'Sangat berisiko! Mengorbankan integritas sistem dan membiarkan pengguna menjadi "kelinci percobaan". Hal ini melanggar etika seorang Seeker Quality Assurance.'
      }
    ]
  },
  {
    id: 'scen-2',
    title: 'Skenario 2: Mengatasi Flaky Test Otomasi (CI/CD Pipeline Health)',
    npcName: 'Elena Rostova — Principal Backend Architect',
    npcRole: 'Tech Lead',
    situation: '"Pipeline GitHub Actions kita sering merah palsu (flaky test) pada suite E2E saat load runner tinggi, membuat developer frustasi. Apa strategi perbaikan Anda?"',
    options: [
      {
        id: 'A',
        label: '(A) Tambahkan sleep() statis lebih lama',
        text: 'Tambahkan page.waitForTimeout(5000) di setiap step agar halaman punya waktu lebih lama untuk memuat.',
        isOptimal: false,
        feedback: 'Anti-pattern klasik! Hardcoded sleep memperlambat pipeline secara eksponensial dan tetap rentan gagal jika server mengalami network spike.'
      },
      {
        id: 'B',
        label: '(B) Arsitektur Resilient Locator & Auto-Waiting (PILIHAN UNGGULAN)',
        text: 'Hapus seluruh jeda tidur statis, manfaatkan native auto-waiting Playwright, gantikan selector rapuh (XPath/CSS) dengan accessible role locators (getByRole, getByTestId), dan pasang network idle polling.',
        isOptimal: true,
        feedback: 'Tepat Sekali! Membuktikan pemahaman mendalam tentang siklus event-loop browser. Hasilnya: flakiness ditekan di bawah 0.2% dan eksekusi berjalan 4x lebih cepat.'
      },
      {
        id: 'C',
        label: '(C) Nonaktifkan test yang sering gagal',
        text: 'Beri tag test.skip() pada test yang sering flaky agar pipeline selalu hijau dan developer tidak terganggu.',
        isOptimal: false,
        feedback: 'Menutupi masalah, bukan menyelesaikan. Menonaktifkan uji alur kritis akan meloloskan bug fatal ke production.'
      }
    ]
  }
];

export const InterviewSimulatorModal = ({ isOpen, onClose }) => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);

  if (!isOpen) return null;

  const currentScenario = SCENARIOS[currentScenarioIndex];
  const selectedOption = currentScenario.options.find((o) => o.id === selectedOptionId);

  const handleClose = () => {
    sound.playNavTick();
    onClose();
  };

  const handleSelectOption = (optId) => {
    sound.playNavTick();
    setSelectedOptionId(optId);
    const opt = currentScenario.options.find((o) => o.id === optId);
    if (opt?.isOptimal) {
      sound.playTerminalSuccess();
    } else {
      sound.playAnomalyPing();
    }
  };

  const handleNextScenario = () => {
    sound.playNavTick();
    setSelectedOptionId(null);
    setCurrentScenarioIndex((prev) => (prev + 1) % SCENARIOS.length);
  };

  return (
    <div className="jrpg-modal-backdrop" role="dialog" aria-modal="true" onClick={handleClose}>
      <div className="clean-tech-window interview-modal-window" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="macos-window-header">
          <div className="window-dots">
            <span className="dot dot-red" onClick={handleClose} />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </div>
          <div className="window-title-badge">
            <span>🗣️</span> BEHAVIORAL INTERVIEW SIMULATOR &amp; NPC DIALOGUE TREE (BAB 06)
          </div>
          <button className="window-close-text" type="button" onClick={handleClose}>
            TUTUP [ESC]
          </button>
        </div>

        {/* Body */}
        <div className="clean-modal-body interview-modal-body">
          {/* Scenario Selector Pill */}
          <div className="scenario-switcher-row">
            {SCENARIOS.map((sc, idx) => (
              <button
                key={sc.id}
                type="button"
                className={`scenario-pill-btn ${currentScenarioIndex === idx ? 'active' : ''}`}
                onClick={() => {
                  sound.playNavTick();
                  setCurrentScenarioIndex(idx);
                  setSelectedOptionId(null);
                }}
              >
                <span>Skenario {idx + 1}: {sc.title.split(':')[1]}</span>
              </button>
            ))}
          </div>

          {/* NPC Dialogue Prompt Card */}
          <div className="npc-dialogue-card">
            <div className="npc-avatar-wrap">
              <span className="npc-avatar-icon">👔</span>
              <div className="npc-meta">
                <strong className="npc-name">{currentScenario.npcName}</strong>
                <span className="npc-role-tag">{currentScenario.npcRole}</span>
              </div>
            </div>

            <div className="npc-speech-bubble">
              <p className="npc-quote">{currentScenario.situation}</p>
            </div>
          </div>

          {/* Options Tree */}
          <div className="interview-options-tree">
            <h5 className="options-tree-title">PILIH STRATEGI TANGGAPAN SURYANI LESTARI:</h5>
            <div className="options-buttons-stack">
              {currentScenario.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`interview-option-btn ${isSelected ? (opt.isOptimal ? 'selected-optimal' : 'selected-suboptimal') : ''}`}
                    onClick={() => handleSelectOption(opt.id)}
                  >
                    <div className="opt-label-badge">{opt.label}</div>
                    <div className="opt-text">{opt.text}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rational Analysis Feedback Card */}
          {selectedOption && (
            <div className={`rational-feedback-card ${selectedOption.isOptimal ? 'optimal' : 'suboptimal'}`}>
              <div className="feedback-header">
                <span className="feedback-icon">{selectedOption.isOptimal ? '🌟' : '⚠️'}</span>
                <strong>ANALISIS POLA PIKIR &amp; KELAYAKAN LEADERSHIP:</strong>
              </div>
              <p className="feedback-text">{selectedOption.feedback}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="clean-modal-footer">
          <button type="button" className="clean-btn secondary" onClick={handleNextScenario}>
            <span>⏭️</span> BERALIH SKENARIO WAWANCARA
          </button>
          <button type="button" className="clean-btn primary" onClick={handleClose}>
            KEMBALI KE PENJELAJAHAN [ESC]
          </button>
        </div>
      </div>
    </div>
  );
};
