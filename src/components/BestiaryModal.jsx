import React, { useState } from 'react';
import { sound } from '../utils/audio';

const BESTIARY_DATA = [
  {
    id: 'anom-1',
    name: 'The Race Condition Wyrm',
    monsterType: 'Critical Concurrency Anomaly',
    severity: 'CRITICAL',
    severityClass: 'sev-critical',
    icon: '🐉',
    threatLevel: 'Threat Level 99 • High Financial Hazard',
    behavior: 'Voucher belanja bernilai terbatas dapat diklaim 2 kali apabila dua request HTTP POST dikirimkan secara serentak dalam rentang 15 milidetik.',
    reproductionSteps: [
      'Siapkan 1 akun pengguna dengan saldo kupon promo aktif terbatas kuota.',
      'Gunakan script concurrency runner (k6 / Artillery) mengirim 2 request HTTP POST /api/v1/coupons/redeem secara paralel dengan timestamp offset delta < 15ms.',
      'Amati database ledger: kuota terpotong 1 kali namun saldo kredit ganda masuk ke wallet pengguna.'
    ],
    rootCause: 'Backend memeriksa validitas kupon dan mengurangi kuota pada baris query terpisah tanpa mengunci baris data (lack of atomic transaction / read-modify-write without row locks).',
    exorcism: 'Mengimplementasikan distributed lock berbasis Redis dan constraint transaksi atomic di level database menggunakan `SELECT ... FOR UPDATE` dan isolating level serializable.',
    remediationCode: `// EXORCISM: Redis Distributed Lock + DB Atomic Transaction
const lockKey = \`lock:coupon:\${couponId}:\${userId}\`;
const acquired = await redis.set(lockKey, 'locked', 'NX', 'PX', 2000);
if (!acquired) {
  throw new ConcurrencyConflictError("Operasi klaim sedang diproses secara simultan.");
}
try {
  await db.transaction(async (trx) => {
    const coupon = await trx('coupons').where({ id: couponId }).forUpdate().first();
    if (coupon.remaining_quota <= 0) throw new ExpiredCouponError();
    await trx('coupons').where({ id: couponId }).decrement('remaining_quota', 1);
    await trx('user_benefits').insert({ user_id: userId, coupon_id: couponId });
  });
} finally {
  await redis.del(lockKey);
}`
  },
  {
    id: 'anom-2',
    name: 'The Memory Leak Specter',
    monsterType: 'SPA Dashboard Garbage Retention Specter',
    severity: 'HIGH',
    severityClass: 'sev-high',
    icon: '👻',
    threatLevel: 'Threat Level 88 • Resource Starvation Hazard',
    behavior: 'Dashboard monitoring analitik perlahan menaikkan konsumsi RAM browser dari 150 MB menjadi 1.7 GB setelah dibuka selama 1 jam dalam sesi operasional non-stop.',
    reproductionSteps: [
      'Buka tab dashboard analitik real-time pada Chrome/Chromium browser.',
      'Simulasikan pergantian tab navigasi antara modul monitoring dan log viewer setiap 30 detik selama 1 jam.',
      'Buka DevTools Memory tab: amati heap snapshot berukuran bengkak dengan jutaan detached DOM nodes dan closure listeners.'
    ],
    rootCause: 'Event listener pada chart WebSocket tidak dilepas (cleanup function unmount missing) saat komponen dirender ulang atau berpindah halaman.',
    exorcism: 'Menambahkan pembersihan listener otomatis pada hook lifecycle unmount dan memverifikasi siklus memori menggunakan Chrome Heap Allocation Profiler hingga konsumsi heap stabil datar pada 140 MB.',
    remediationCode: `// EXORCISM: React useEffect Unsubscribe & Chart Cleanup
useEffect(() => {
  const socket = webSocketManager.connect('/stream/analytics');
  const handler = (metrics) => chartInstance.current?.append(metrics);
  socket.on('data_tick', handler);

  return () => {
    // Crucial Cleanup Exorcism: lepas listener & release memory
    socket.off('data_tick', handler);
    socket.disconnect();
    chartInstance.current?.destroy();
    chartInstance.current = null;
  };
}, []);`
  },
  {
    id: 'anom-3',
    name: 'Null-Pointer Doppelganger',
    monsterType: 'Payload Edge-Case Crash Entity',
    severity: 'HIGH',
    severityClass: 'sev-high',
    icon: '👤',
    threatLevel: 'Threat Level 85 • Fatal Client Termination',
    behavior: 'Layar checkout mobile mendadak crash (White Screen of Death / SIGSEGV) ketika pengguna beralih ke alamat pengiriman sekunder yang tidak memiliki nomor ekstensi telepon.',
    reproductionSteps: [
      'Pengguna mendaftarkan alamat sekunder tanpa menginput kolom "telepon_ekstensi" (nullable field).',
      'Masuk ke alur checkout lalu pilih alamat tersebut dari daftar drop-down.',
      'Klien mengeksekusi payload parser: aplikasi tertutup mendadak tanpa error dialog.'
    ],
    rootCause: 'Parser JSON klien berasumsi seluruh nested field kontak selalu berwujud string objek utuh tanpa optional chaining (`recipient.phone.ext.toUpperCase()`), sehingga melempar Cannot read property of undefined.',
    exorcism: 'Menerapkan validasi skema runtime ketat (Zod) di API Gateway, safe optional navigation pada DTO klien, dan penyediaan fallback default value di seluruh pipeline transformator.',
    remediationCode: `// EXORCISM: Zod Contract Validation & Safe Optional Access
const DeliveryAddressSchema = z.object({
  id: z.string().uuid(),
  street: z.string().min(1),
  phone: z.object({
    main: z.string(),
    extension: z.string().nullable().default(null)
  }).default({ main: '', extension: null })
});

// Safe Client Dereferencing:
const formattedExt = address?.phone?.extension?.trim() ?? 'N/A';`
  },
  {
    id: 'anom-4',
    name: 'Timezone Discord Phantom',
    monsterType: 'UTC vs Local Offset Billing Shift Entity',
    severity: 'MEDIUM',
    severityClass: 'sev-medium',
    icon: '⏳',
    threatLevel: 'Threat Level 75 • Business Logic Drift',
    behavior: 'Pelanggan di wilayah waktu Pasifik (UTC-10) menerima tagihan langganan satu hari lebih cepat dari tanggal jatuh tempo invoice resmi.',
    reproductionSteps: [
      'Set timezone mesin penguji atau browser ke Pacific/Honolulu (UTC-10).',
      'Buat invoice berlangganan bulanan dengan tanggal jatuh tempo 1 April 2026 00:00:00 UTC.',
      'Generate render invoice: sistem menampilkan tanggal jatuh tempo 31 Maret 2026, memicu auto-debit prematurely.'
    ],
    rootCause: 'Penggunaan fungsi new Date().getDate() lokal tanpa normalisasi format ISO 8601 di server backend maupun modul scheduler penagihan.',
    exorcism: 'Parameterisasi pengujian dengan mocking timezone melalui Playwright Clock API, standardisasi parsing format UTC (ISO 8601), dan penegasan boundary window billing berbasis UTC epoch time.',
    remediationCode: `// EXORCISM: Playwright Clock API Timezone Mocking Test
test('Invoice billing due date remains synchronized across UTC-10', async ({ page }) => {
  // Mock sistem ke zona waktu Honolulu (UTC-10)
  await page.emulateTimezone('Pacific/Honolulu');
  await page.clock.setFixedTime(new Date('2026-04-01T00:00:00Z'));
  
  await page.goto('/billing/invoices/INV-9021');
  const dueDateText = await page.locator('[data-testid="due-date"]').innerText();
  
  // Tegaskan tanggal terformat dalam UTC standar bisnis
  expect(dueDateText).toBe('01 Apr 2026 (UTC)');
});`
  }
];

export const BestiaryModal = ({ isOpen, onClose }) => {
  const [selectedMonster, setSelectedMonster] = useState(BESTIARY_DATA[0]);
  const [showCode, setShowCode] = useState(true);

  if (!isOpen) return null;

  const handleClose = () => {
    sound.playClose();
    onClose();
  };

  const handleSelectMonster = (monster) => {
    sound.playAnomalyGlitch();
    setSelectedMonster(monster);
  };

  return (
    <div className="jrpg-modal-backdrop" role="dialog" aria-modal="true" onClick={handleClose}>
      <div className="jrpg-window bestiary-window" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="jrpg-window-header">
          <div className="jrpg-header-title">
            <span className="jrpg-pixel-icon">👾</span>
            <h3>ANOMALY BESTIARY: ENSIKLOPEDIA DEFECT MENDALAM</h3>
          </div>
          <div className="jrpg-header-badge">HAGA RESEARCH LOGS • SECTION 5</div>
          <button className="jrpg-close-btn" type="button" onClick={handleClose} aria-label="Tutup Dialog">
            [ESC] ✕
          </button>
        </div>

        {/* Body */}
        <div className="jrpg-window-body">
          {/* Lore Banner */}
          <div className="jrpg-lore-notice">
            <div className="seeker-avatar-mini">
              <img src="assets/images/haga-avatar.jpg" alt="Haga Seeker" />
              <span>HAGA (LV.99)</span>
            </div>
            <p className="jrpg-lore-text">
              "Sebagai pengganti lampiran bug report standar yang membosankan, inilah catatan anomali sistemik nyata yang telah dibedah akar masalahnya dan dibersihkan tuntas melalui metode exorcism rekayasa perangkat lunak."
            </p>
          </div>

          <div className="bestiary-layout-split">
            {/* Left Column: Monster Catalog List */}
            <aside className="bestiary-catalog">
              <h5 className="catalog-heading">KATALOG SPESIMEN ANOMALI ({BESTIARY_DATA.length})</h5>
              <div className="monster-list">
                {BESTIARY_DATA.map((monster) => (
                  <button
                    key={monster.id}
                    type="button"
                    className={`monster-card-nav ${selectedMonster.id === monster.id ? 'active' : ''}`}
                    onClick={() => handleSelectMonster(monster)}
                  >
                    <span className="monster-badge-icon">{monster.icon}</span>
                    <div className="monster-nav-info">
                      <span className="monster-nav-name">{monster.name}</span>
                      <span className={`monster-nav-sev ${monster.severityClass}`}>
                        {monster.severity} SEVERITY
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            {/* Right Column: Detailed Anomaly Anatomical Breakdown */}
            <main className="bestiary-detail-sheet">
              <div className="monster-sheet-header">
                <div className="monster-sheet-title-group">
                  <span className="monster-giant-icon">{selectedMonster.icon}</span>
                  <div>
                    <div className="monster-threat-tag">{selectedMonster.threatLevel}</div>
                    <h4 className="monster-main-title">{selectedMonster.name}</h4>
                    <span className="monster-type-sub">{selectedMonster.monsterType}</span>
                  </div>
                </div>

                <span className={`severity-badge-large ${selectedMonster.severityClass}`}>
                  SEVERITY: {selectedMonster.severity}
                </span>
              </div>

              {/* Behavior / Anomaly manifestation */}
              <div className="dossier-section-block">
                <h5 className="dossier-subtitle">
                  <span>🩸</span> PERILAKU ANOMALI (MANIFESTASI DI SISTEM)
                </h5>
                <p className="dossier-body-text">{selectedMonster.behavior}</p>
              </div>

              {/* Reproduction Steps */}
              <div className="dossier-section-block">
                <h5 className="dossier-subtitle">
                  <span>🔬</span> SKENARIO REPRODUKSI LANGKAH DEMI LANGKAH
                </h5>
                <ol className="repro-steps-list">
                  {selectedMonster.reproductionSteps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>

              {/* Root Cause Analysis */}
              <div className="dossier-section-block root-cause-highlight">
                <h5 className="dossier-subtitle">
                  <span>🧬</span> ANALISIS AKAR MASALAH (ROOT-CAUSE ANATOMY)
                </h5>
                <p className="dossier-body-text">{selectedMonster.rootCause}</p>
              </div>

              {/* Exorcism & Code Remediation */}
              <div className="dossier-section-block exorcism-block">
                <div className="exorcism-header-row">
                  <h5 className="dossier-subtitle">
                    <span>✨</span> METODE EXORCISM (SOLUSI PENYUCIAN SISTEMIK)
                  </h5>
                  <button 
                    type="button" 
                    className="toggle-code-btn"
                    onClick={() => setShowCode(!showCode)}
                  >
                    {showCode ? 'Sembunyikan Remediation Code' : 'Lihat Remediation Code'}
                  </button>
                </div>
                <p className="dossier-body-text exorcism-text">{selectedMonster.exorcism}</p>

                {showCode && (
                  <pre className="remediation-code-block">
                    <code>{selectedMonster.remediationCode}</code>
                  </pre>
                )}
              </div>
            </main>
          </div>
        </div>

        {/* Footer */}
        <div className="jrpg-window-footer">
          <span className="jrpg-footer-hint">Setiap anomali memiliki dokumentasi reproduktifitas 100% dan tes verifikasi otomatis.</span>
          <button type="button" className="jrpg-btn primary" onClick={handleClose}>
            [ESC] KEMBALI KE MARKAS GUILD
          </button>
        </div>
      </div>
    </div>
  );
};
