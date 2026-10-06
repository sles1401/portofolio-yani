/**
 * Main Game Controller for Suryani's QA Quest
 * Handles Start Screen, Game Hub, Inventory Tooltips, Loot Modal, and Recruiter Mode.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const startScreen = document.getElementById('start-screen');
  const pressStartBtn = document.getElementById('press-start-trigger');
  const gameHub = document.getElementById('game-hub');
  const recruiterView = document.getElementById('recruiter-view');
  const recruiterToggleBtn = document.getElementById('recruiter-toggle-btn');
  const backToGameBtn = document.getElementById('back-to-game-btn');
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  
  // Loot Modal Elements
  const lootModal = document.getElementById('loot-modal');
  const inspectLootBtns = document.querySelectorAll('.inspect-loot-btn');
  const closeLootModalBtn = document.getElementById('close-loot-modal-btn');
  const modalCloseFooterBtn = document.getElementById('modal-close-footer-btn');

  // Inventory Tooltip Elements
  const inventorySlots = document.querySelectorAll('.slot-box');
  const inventoryTooltip = document.getElementById('inventory-tooltip');
  const tooltipTitle = document.getElementById('tooltip-title');
  const tooltipRarity = document.getElementById('tooltip-rarity');
  const tooltipDesc = document.getElementById('tooltip-desc');
  const tooltipStats = document.getElementById('tooltip-stats');

  // Filter Buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  const questCards = document.querySelectorAll('.quest-card');

  let hasStarted = false;
  let isRecruiterMode = false;

  // Inventory Data Catalog
  const inventoryData = {
    playwright: {
      title: "Playwright",
      rarity: "Legendary",
      rarityClass: "legendary",
      icon: "🎭",
      desc: "Senjata otomatisasi pengujian cross-browser modern. Digunakan Suryani untuk end-to-end regression scripting, dynamic wait handling, dan verifikasi alur kritis tanpa flakiness.",
      stats: [
        { label: "Automation Velocity", value: "+45% Sprint Speed" },
        { label: "Cross-Browser Parity", value: "Chromium • WebKit • Firefox" },
        { label: "Trace Viewer Mastery", value: "S-Tier Debugging" }
      ]
    },
    postman: {
      title: "Postman",
      rarity: "Epic",
      rarityClass: "epic",
      icon: "📡",
      desc: "Meriam pulsa verifikasi API. Menguji endpoint payload, schema JSON contracts, parameter query boundary, status code HTTP, dan regression automation collection.",
      stats: [
        { label: "Endpoint Precision", value: "99.8% Status 200/201" },
        { label: "Environment Chaining", value: "Dev • Staging • Prod" },
        { label: "Negative Payload Defense", value: "+30 Bug Discovery" }
      ]
    },
    devtools: {
      title: "Chrome DevTools",
      rarity: "Epic",
      rarityClass: "epic",
      icon: "🔍",
      desc: "Kacamata pemindai telemetri web. Memeriksa console logs, Network waterfall, payload REST, device emulation, dan tracking DOM states saat issue reproduction.",
      stats: [
        { label: "Network Throttling", value: "Slow 3G Edge Case Sync" },
        { label: "DOM State Analysis", value: "Instant Element Inspection" },
        { label: "Console Error Audit", value: "Zero Unhandled Exceptions" }
      ]
    },
    sheets: {
      title: "Google Sheets & Test Matrix",
      rarity: "Rare",
      rarityClass: "rare",
      icon: "📊",
      desc: "Grimoire dokumentasi pengujian. Menyusun skenario test case terstruktur, Boundary Value Analysis, checklist regresi, serta Requirements Traceability Matrix (RTM).",
      stats: [
        { label: "Test Cases Authored", value: "150+ Structured Scenarios" },
        { label: "Stakeholder Alignment", value: "Real-time Visibility" },
        { label: "Traceability Rating", value: "100% Requirements Mapped" }
      ]
    },
    github: {
      title: "GitHub & Version Control",
      rarity: "Rare",
      rarityClass: "rare",
      icon: "🐙",
      desc: "Portal kode dan repositori pengujian. Mengelola repository test automation, versioning test scripts, review Pull Requests, dan integrasi CI pipeline.",
      stats: [
        { label: "Version Control Discipline", value: "Clean Branching Strategy" },
        { label: "CI/CD Readiness", value: "Automated PR Triggers" },
        { label: "Script Maintainability", value: "Modular & Scalable" }
      ]
    },
    jira: {
      title: "Jira & Bug Tracker",
      rarity: "Uncommon",
      rarityClass: "uncommon",
      icon: "🐞",
      desc: "Buku catatan pemburu cacat perangkat lunak. Pelaporan bug komprehensif dengan severity/priority, expected vs actual behavior, evidence log, dan root cause analysis.",
      stats: [
        { label: "Bug Report Clarity", value: "100% Reproducibility" },
        { label: "Sprint Triage Speed", value: "Real-Time Dev Sync" },
        { label: "Critical Defects Prevented", value: "Zero Release Blockers" }
      ]
    }
  };

  // 1. START GAME INTRO
  function startGame() {
    if (hasStarted) return;
    hasStarted = true;

    // Play retro coin chime
    if (window.retroAudio) {
      window.retroAudio.playCoinChime();
    }

    // Visual portal/fade animation
    startScreen.classList.add('hidden');

    // Remove from tab flow after transition
    setTimeout(() => {
      startScreen.style.display = 'none';
    }, 850);
  }

  // Event Listeners for Start
  if (pressStartBtn) {
    pressStartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      startGame();
    });
  }

  if (startScreen) {
    startScreen.addEventListener('click', startGame);
  }

  // Keyboard shortcut for start (Enter or Space)
  document.addEventListener('keydown', (e) => {
    if (!hasStarted && (e.code === 'Enter' || e.code === 'Space')) {
      e.preventDefault();
      startGame();
    } else if (e.code === 'Escape') {
      if (lootModal && lootModal.classList.contains('open')) {
        closeLootModal();
      }
    }
  });

  // 2. AUDIO TOGGLE
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      if (!window.retroAudio) return;
      const isMuted = window.retroAudio.toggleMute();
      audioToggleBtn.innerHTML = isMuted 
        ? '<span>🔇</span> SFX: OFF' 
        : '<span>🔊</span> SFX: ON';
      
      if (!isMuted) {
        window.retroAudio.playHoverBlip();
      }
    });
  }

  // 3. RECRUITER MODE SWITCHER
  function toggleRecruiterMode() {
    isRecruiterMode = !isRecruiterMode;
    if (window.retroAudio) {
      window.retroAudio.playSelectTone();
    }

    if (isRecruiterMode) {
      // Ensure start screen is bypassed if recruiter skips directly
      if (!hasStarted) {
        hasStarted = true;
        startScreen.style.display = 'none';
      }
      gameHub.style.display = 'none';
      recruiterView.classList.add('active');
      recruiterToggleBtn.innerHTML = '<span>🎮</span> Return to Game Mode';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      recruiterView.classList.remove('active');
      gameHub.style.display = 'flex';
      recruiterToggleBtn.innerHTML = '<span>📋</span> Standard Portfolio / Skip Game UI';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  if (recruiterToggleBtn) {
    recruiterToggleBtn.addEventListener('click', toggleRecruiterMode);
  }

  if (backToGameBtn) {
    backToGameBtn.addEventListener('click', toggleRecruiterMode);
  }

  // 4. INVENTORY HOVER & TOOLTIP
  inventorySlots.forEach(slot => {
    slot.addEventListener('mouseenter', (e) => {
      const toolKey = slot.dataset.tool;
      const data = inventoryData[toolKey];
      if (!data) return;

      if (window.retroAudio) {
        window.retroAudio.playHoverBlip();
      }

      // Populate tooltip
      tooltipTitle.textContent = data.title;
      tooltipRarity.textContent = `[${data.rarity}]`;
      tooltipRarity.className = `tooltip-rarity ${data.rarityClass}`;
      tooltipDesc.textContent = data.desc;

      // Stats
      tooltipStats.innerHTML = data.stats.map(s => `
        <div class="tooltip-stat-row">
          <span class="stat-label">${s.label}:</span>
          <span class="stat-value">${s.value}</span>
        </div>
      `).join('');

      inventoryTooltip.classList.add('active');
      positionTooltip(e);
    });

    slot.addEventListener('mousemove', (e) => {
      positionTooltip(e);
    });

    slot.addEventListener('mouseleave', () => {
      inventoryTooltip.classList.remove('active');
    });

    slot.addEventListener('click', () => {
      if (window.retroAudio) {
        window.retroAudio.playSelectTone();
      }
    });
  });

  function positionTooltip(e) {
    const tooltipWidth = 320;
    const tooltipHeight = 200;
    const margin = 16;

    let left = e.clientX + margin;
    let top = e.clientY + margin;

    // Check right edge
    if (left + tooltipWidth > window.innerWidth) {
      left = e.clientX - tooltipWidth - margin;
    }

    // Check bottom edge
    if (top + tooltipHeight > window.innerHeight) {
      top = e.clientY - tooltipHeight - margin;
    }

    inventoryTooltip.style.left = `${Math.max(10, left)}px`;
    inventoryTooltip.style.top = `${Math.max(10, top)}px`;
  }

  // 5. LOOT INSPECTION MODAL (QUEST ARCHIVE)
  function openLootModal() {
    if (window.retroAudio) {
      window.retroAudio.playLootFanfare();
    }
    lootModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLootModal() {
    if (window.retroAudio) {
      window.retroAudio.playCloseTone();
    }
    lootModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  inspectLootBtns.forEach(btn => {
    btn.addEventListener('click', openLootModal);
  });

  if (closeLootModalBtn) {
    closeLootModalBtn.addEventListener('click', closeLootModal);
  }

  if (modalCloseFooterBtn) {
    modalCloseFooterBtn.addEventListener('click', closeLootModal);
  }

  if (lootModal) {
    lootModal.addEventListener('click', (e) => {
      if (e.target === lootModal) {
        closeLootModal();
      }
    });
  }

  // 6. QUEST FILTERING
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.retroAudio) {
        window.retroAudio.playSelectTone();
      }

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      questCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Sound effects on general interactive elements
  document.querySelectorAll('button, .filter-btn, .cv-pill-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      if (hasStarted && window.retroAudio) {
        window.retroAudio.playHoverBlip();
      }
    });
  });
});
