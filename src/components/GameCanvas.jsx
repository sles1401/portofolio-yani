import React, { useRef, useEffect } from 'react';
import { sound } from '../utils/audio';

const TILE_SIZE = 32;
const MAP_COLS = 75; // 75 * 32 = 2400
const MAP_ROWS = 56; // 56 * 32 = 1792 ~ 1800
const WORLD_WIDTH = 2400;
const WORLD_HEIGHT = 1800;

export const OPEN_WORLD_DISTRICTS = [
  {
    id: 'CENTRAL_PLAZA',
    modalTarget: 'QUESTS',
    label: 'Central Plaza',
    shortLabel: 'PLAZA',
    district: 'Distrik 1',
    subtitle: 'Kolam Geometris, Papan Pengumuman Kaca Modern & Studi Kasus',
    x: 1200,
    y: 900,
    w: 96,
    h: 76,
    color: '#06b6d4',
    icon: '🏛️',
    easterEgg: 'Central Archive: 150+ Structured Test Cases Verified'
  },
  {
    id: 'FOUNDRY',
    modalTarget: 'TERMINAL',
    label: 'Automation Foundry',
    shortLabel: 'FOUNDRY',
    district: 'Distrik 2',
    subtitle: 'Server Cluster Teal & Konsol Playwright Live Terminal Rig',
    x: 620,
    y: 520,
    w: 96,
    h: 76,
    color: '#10b981',
    icon: '💻',
    easterEgg: 'Playwright Headless Threads: 4 Active • Exit Code 0'
  },
  {
    id: 'DATA_SANCTUM',
    modalTarget: 'BESTIARY',
    label: 'Data Sanctum',
    shortLabel: 'SANCTUM',
    district: 'Distrik 3',
    subtitle: 'The Defect Archive: Ruang Anomaly Bestiary & Bug Containment',
    x: 1780,
    y: 520,
    w: 96,
    h: 76,
    color: '#a855f7',
    icon: '👾',
    easterEgg: 'Heap Memory Spike Warning (Poltergeist Contained)'
  },
  {
    id: 'GATEWAY_PIER',
    modalTarget: 'VISUAL_REGRESSION',
    label: 'Gateway Pier',
    shortLabel: 'GATEWAY',
    district: 'Distrik 4',
    subtitle: 'Saluran Transmisi REST API & Visual Regression Split Slider',
    x: 620,
    y: 1320,
    w: 96,
    h: 76,
    color: '#38bdf8',
    icon: '📡',
    easterEgg: 'PPIC Webhook Endpoint: Listening on Port 8080 (0 Desync)'
  },
  {
    id: 'ENVOY_LOUNGE',
    modalTarget: 'DISPATCH',
    label: 'Envoy Lounge',
    shortLabel: 'ENVOY',
    district: 'Distrik 5',
    subtitle: 'Meja Kontak Perekrut & Pengiriman Tawaran Kerja Formal',
    x: 1780,
    y: 1320,
    w: 96,
    h: 76,
    color: '#10b981',
    icon: '📮',
    easterEgg: 'Dispatch Scroll: contact@suryani-lestari.my.id'
  }
];

// World static collision obstacles (dinding teritori, bebatuan, pilar)
const WORLD_OBSTACLES = [
  // West boundary wall
  { x: 32, y: 32, w: 64, h: 1736 },
  // East boundary wall
  { x: 2304, y: 32, w: 64, h: 1736 },
  // North boundary wall
  { x: 32, y: 32, w: 2336, h: 64 },
  // South boundary wall
  { x: 32, y: 1704, w: 2336, h: 64 },
  // Foundry server clusters
  { x: 480, y: 420, w: 80, h: 80 },
  { x: 740, y: 420, w: 80, h: 80 },
  // Prompt Halaman 3: Simpul Retakan Dinding Terencana [X: 18, Y: 24] (576, 768)
  { x: 552, y: 744, w: 48, h: 48, isGlitchWall: true, label: 'Wall Glitch Node' },
  // Sanctum data vaults
  { x: 1640, y: 420, w: 70, h: 70 },
  { x: 1900, y: 440, w: 70, h: 70 },
  // Gateway Pier transmission pylons
  { x: 480, y: 1220, w: 80, h: 80 },
  { x: 740, y: 1240, w: 80, h: 80 },
  // Envoy lounge executive privacy screens
  { x: 1640, y: 1220, w: 70, h: 70 },
  { x: 1900, y: 1240, w: 70, h: 70 }
];

export const GameCanvas = ({
  onTriggerModal,
  activeModal,
  onNearbyChange,
  dpadState,
  debugVision,
  onDiagnosticsUpdate,
  isPaused
}) => {
  const canvasRef = useRef(null);

  // Player state: Suryani Lestari (Lead System Seeker)
  const playerRef = useRef({
    x: 1200,
    y: 980,
    speed: 4.2,
    facing: 'down',
    isMoving: false,
    walkFrame: 0,
    walkTimer: 0,
    targetX: null,
    targetY: null
  });

  // Camera state with Lerp tracking (Bab 3: 0.08)
  const cameraRef = useRef({ x: 1200 - 480, y: 980 - 300 });
  const keysPressed = useRef({});
  const nearbyRef = useRef(null);
  
  // Prompt Halaman 3: Ref untuk collision breach timer dan screen shake
  const wallContactTimerRef = useRef(0);
  const screenShakeRef = useRef(0);

  // Keyboard navigation & space interaction
  useEffect(() => {
    const handleKeyDown = (e) => {
      const code = e.code;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyE', 'Space'].includes(code)) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
        }
      }

      keysPressed.current[code] = true;

      // Interaction trigger when near landmark: [SPACE] or [E] or [Enter]
      if ((code === 'Space' || code === 'KeyE' || code === 'Enter') && !activeModal) {
        if (nearbyRef.current) {
          sound.playSelect();
          onTriggerModal(nearbyRef.current.modalTarget || nearbyRef.current.id);
        }
      }
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeModal, onTriggerModal]);

  // Main 60 FPS Canvas Game Loop
  useEffect(() => {
    // Bab 2: Hentikan requestAnimationFrame seketika jika Recruiter Docket dipilih untuk hemat CPU/Baterai!
    if (isPaused) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let tick = 0;
    let stepSoundTimer = 0;

    // Diagnostics telemetri
    let lastTime = performance.now();
    let frameCount = 0;
    let currentFps = 60;

    const gameLoop = (currentTime) => {
      tick++;

      // Telemetri calculation
      const delta = currentTime - lastTime;
      frameCount++;
      if (delta >= 1000) {
        currentFps = (frameCount * 1000) / delta;
        frameCount = 0;
        lastTime = currentTime;

        const tileX = Math.floor(playerRef.current.x / TILE_SIZE);
        const tileY = Math.floor(playerRef.current.y / TILE_SIZE);
        const tileId = `T_${tileX}_${tileY}`;

        // Count active DOM nodes in document
        const domNodesCount = typeof document !== 'undefined' ? document.getElementsByTagName('*').length : 142;

        if (onDiagnosticsUpdate) {
          onDiagnosticsUpdate({
            fps: currentFps.toFixed(1),
            tileId,
            domNodes: domNodesCount,
            playerX: Math.round(playerRef.current.x),
            playerY: Math.round(playerRef.current.y),
            integrityIndex: '99.96%',
            easterEgg: nearbyRef.current?.easterEgg || null
          });
        }
      }

      // Resize canvas to container
      const displayWidth = canvas.parentElement ? canvas.parentElement.clientWidth : 960;
      const displayHeight = canvas.parentElement ? canvas.parentElement.clientHeight : 600;
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }

      const p = playerRef.current;

      // 1. Movement Logic (hanya berjalan jika modal tidak aktif)
      if (!activeModal) {
        let dx = 0;
        let dy = 0;

        if (keysPressed.current['ArrowUp'] || keysPressed.current['KeyW']) dy -= 1;
        if (keysPressed.current['ArrowDown'] || keysPressed.current['KeyS']) dy += 1;
        if (keysPressed.current['ArrowLeft'] || keysPressed.current['KeyA']) dx -= 1;
        if (keysPressed.current['ArrowRight']) dx += 1;
        if (keysPressed.current['KeyD'] && !debugVision) dx += 1;

        // Virtual D-Pad
        if (dpadState) {
          if (dpadState.up) dy -= 1;
          if (dpadState.down) dy += 1;
          if (dpadState.left) dx -= 1;
          if (dpadState.right) dx += 1;
        }

        // Click-to-move
        if (p.targetX !== null && p.targetY !== null && dx === 0 && dy === 0) {
          const toTargetX = p.targetX - p.x;
          const toTargetY = p.targetY - p.y;
          const dist = Math.hypot(toTargetX, toTargetY);
          if (dist > 6) {
            dx = toTargetX / dist;
            dy = toTargetY / dist;
          } else {
            p.targetX = null;
            p.targetY = null;
          }
        }

        // Normalize diagonal
        if (dx !== 0 && dy !== 0 && p.targetX === null) {
          dx *= 0.70710678;
          dy *= 0.70710678;
        }

        if (dx !== 0 || dy !== 0) {
          p.isMoving = true;
          const nextX = p.x + dx * p.speed;
          const nextY = p.y + dy * p.speed;

          if (Math.abs(dx) > Math.abs(dy)) {
            p.facing = dx > 0 ? 'right' : 'left';
          } else {
            p.facing = dy > 0 ? 'down' : 'up';
          }

          p.walkTimer++;
          if (p.walkTimer > 8) {
            p.walkFrame = (p.walkFrame + 1) % 4;
            p.walkTimer = 0;
          }

          stepSoundTimer++;
          if (stepSoundTimer > 18) {
            sound.playFootstep();
            stepSoundTimer = 0;
          }

          // Prompt Halaman 3: Deteksi Penembusan Tembok Khas Haga (Collision Breach)
          // Pada koordinat [X: 18, Y: 24] di distrik Automation Foundry (576, 768)
          const glitchTileX = 18 * 32; // 576
          const glitchTileY = 24 * 32; // 768
          const isTouchingGlitch = Math.hypot(p.x - glitchTileX, p.y - glitchTileY) < 38;
          const isPushingWall = isTouchingGlitch && (dx !== 0 || dy !== 0);

          if (isTouchingGlitch && isPushingWall) {
            wallContactTimerRef.current += 16.6;
            if (wallContactTimerRef.current > 1800) { // 1.8 Detik Kontak
              screenShakeRef.current = 6; // 3-6 frame camera screen shake
              sound.playSynthesizedGlitchTone();
              onTriggerModal('SECRET_CHAMBER');
              wallContactTimerRef.current = 0;
            }
          } else {
            wallContactTimerRef.current = 0;
          }

          // Solid collision boundary & obstacle check (Bab 3)
          let collides = false;
          for (const obs of WORLD_OBSTACLES) {
            if (
              nextX > obs.x - 14 &&
              nextX < obs.x + obs.w + 14 &&
              nextY > obs.y - 14 &&
              nextY < obs.y + obs.h + 14
            ) {
              collides = true;
              break;
            }
          }

          if (!collides) {
            p.x = Math.max(110, Math.min(WORLD_WIDTH - 110, nextX));
            p.y = Math.max(110, Math.min(WORLD_HEIGHT - 110, nextY));
          }
        } else {
          p.isMoving = false;
          p.walkFrame = 0;
          stepSoundTimer = 0;
          wallContactTimerRef.current = 0;
        }
      }

      // 2. Proximity check for 5 districts (< 85 px radius)
      let foundNearby = null;
      for (const district of OPEN_WORLD_DISTRICTS) {
        const dist = Math.hypot(p.x - district.x, p.y - district.y);
        if (dist < 85) {
          foundNearby = district;
          break;
        }
      }

      if (nearbyRef.current?.id !== foundNearby?.id) {
        nearbyRef.current = foundNearby;
        if (onNearbyChange) {
          onNearbyChange(foundNearby);
        }
      }

      // 3. Sub-pixel Camera Tracking with Lerp Formula (Bab 3 & Prompt 9: Lerp 0.08)
      const targetCamX = p.x - canvas.width / 2;
      const targetCamY = p.y - canvas.height / 2;
      cameraRef.current.x += (targetCamX - cameraRef.current.x) * 0.08;
      cameraRef.current.y += (targetCamY - cameraRef.current.y) * 0.08;
      cameraRef.current.x = Math.max(0, Math.min(WORLD_WIDTH - canvas.width, cameraRef.current.x));
      cameraRef.current.y = Math.max(0, Math.min(WORLD_HEIGHT - canvas.height, cameraRef.current.y));

      const camX = Math.round(cameraRef.current.x);
      const camY = Math.round(cameraRef.current.y);

      // Prompt Halaman 3: Camera shake 3-frame saat breach
      let shakeX = 0;
      let shakeY = 0;
      if (screenShakeRef.current > 0) {
        screenShakeRef.current--;
        shakeX = (Math.random() - 0.5) * 8;
        shakeY = (Math.random() - 0.5) * 8;
      }

      // 4. Render Open-World Map
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(-camX + shakeX, -camY + shakeY);

      // 4.1 Render World Terrain (5 Distrik Open-World dengan Frustum Culling)
      renderOpenWorldTerrain(ctx, camX, camY, canvas.width, canvas.height, tick);

      // 4.2 Render Obstacles (batu batas, server cluster, simpul retakan dinding)
      renderObstacles(ctx, debugVision, camX, camY, canvas.width, canvas.height, tick);

      // 4.3 Render 5 District Landmarks (Frustum Culling)
      renderDistrictLandmarks(ctx, tick, debugVision, nearbyRef.current, camX, camY, canvas.width, canvas.height);

      // 4.4 Render Character Sprite Suryani Lestari (Lead System Seeker)
      drawSuryaniSprite(ctx, p.x, p.y, p.facing, p.walkFrame, p.isMoving, tick, debugVision);

      // 4.5 Haga Debug Vision 2.0 Overlay (Bab 4)
      if (debugVision) {
        renderDebugVision2Overlay(ctx, camX, camY, canvas.width, canvas.height, p.x, p.y, tick);
      }

      ctx.restore();

      // 4.6 Render Mini-Map HUD Radar (Prompt Halaman 9: Semi-transparan 160×120px dengan pin penanda lokasi aktif)
      renderMiniMapRadar(ctx, canvas.width, canvas.height, p.x, p.y, tick, nearbyRef.current);

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeModal, debugVision, dpadState, isPaused, onDiagnosticsUpdate, onNearbyChange, onTriggerModal]);

  // Click on canvas to move or inspect landmark directly
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const worldClickX = clickX + cameraRef.current.x;
    const worldClickY = clickY + cameraRef.current.y;

    // Check if clicked near landmark
    for (const d of OPEN_WORLD_DISTRICTS) {
      if (Math.hypot(worldClickX - d.x, worldClickY - d.y) <= 60) {
        sound.playSelect();
        onTriggerModal(d.modalTarget || d.id);
        return;
      }
    }

    // Move player
    playerRef.current.targetX = Math.max(120, Math.min(WORLD_WIDTH - 120, worldClickX));
    playerRef.current.targetY = Math.max(120, Math.min(WORLD_HEIGHT - 120, worldClickY));
  };

  return (
    <div className="canvas-container-root">
      <canvas
        ref={canvasRef}
        className={`game-2d-canvas ${debugVision ? 'debug-mode-active' : ''}`}
        onClick={handleCanvasClick}
        aria-label="Open-World 2400x1800 QA Seeker Canvas"
      />
    </div>
  );
};

// ==========================================
// RENDER TERRAIN & BIOMES (2400 × 1800 px)
// Clean-Tech Architecture: Porcelain Slate (#F8FAFC) & Obsidian Slate (#0F172A)
// ==========================================
function renderOpenWorldTerrain(ctx, camX, camY, viewW, viewH, tick) {
  // Tile bounds visible in viewport (Frustum Culling)
  const startCol = Math.max(0, Math.floor(camX / TILE_SIZE));
  const endCol = Math.min(MAP_COLS, Math.ceil((camX + viewW) / TILE_SIZE));
  const startRow = Math.max(0, Math.floor(camY / TILE_SIZE));
  const endRow = Math.min(MAP_ROWS, Math.ceil((camY + viewH) / TILE_SIZE));

  for (let r = startRow; r < endRow; r++) {
    for (let c = startCol; c < endCol; c++) {
      const tx = c * TILE_SIZE;
      const ty = r * TILE_SIZE;

      // Outer boundary wall (Obsidian Slate #0F172A with crisp micro-border)
      if (r < 2 || r >= MAP_ROWS - 2 || c < 2 || c >= MAP_COLS - 2) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        ctx.strokeRect(tx + 2, ty + 2, TILE_SIZE - 4, TILE_SIZE - 4);
      } else {
        // District Biomes coloring (Clean Tech Theme):
        // Northwest (Foundry): Deep industrial slate
        if (tx < 1000 && ty < 900) {
          ctx.fillStyle = (r + c) % 2 === 0 ? '#111827' : '#0f172a';
        }
        // Northeast (Data Sanctum): Cyber obsidian violet
        else if (tx >= 1400 && ty < 900) {
          ctx.fillStyle = (r + c) % 2 === 0 ? '#14142b' : '#0f172a';
        }
        // Southwest (Gateway Pier): Deep ocean network slate
        else if (tx < 1000 && ty >= 900) {
          ctx.fillStyle = (r + c) % 2 === 0 ? '#0b192c' : '#081220';
        }
        // Southeast (Envoy Lounge): Deep emerald executive slate
        else if (tx >= 1400 && ty >= 900) {
          ctx.fillStyle = (r + c) % 2 === 0 ? '#061d18' : '#041713';
        }
        // Central Plaza: Clean slate canvas (#1e293b / #334155)
        else {
          ctx.fillStyle = (r + c) % 2 === 0 ? '#1e293b' : '#1a2234';
        }
        ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);

        // Tile subtle micro-grid
        ctx.strokeStyle = 'rgba(226, 232, 240, 0.03)';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(tx, ty, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  // Paved Clean-Tech Porcelain Highways (#F8FAFC / #F1F5F9 with #E2E8F0 borders)
  // Horizontal transmission avenue
  ctx.fillStyle = 'rgba(248, 250, 252, 0.08)';
  ctx.fillRect(400, 860, 1600, 80);
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(400, 860, 1600, 80);

  // Vertical transmission avenue
  ctx.fillStyle = 'rgba(248, 250, 252, 0.08)';
  ctx.fillRect(1160, 400, 80, 1000);
  ctx.strokeRect(1160, 400, 80, 1000);

  // Optical data bus lines (Prompt Halaman 9)
  const busPulse = (tick * 4) % 1600;
  ctx.fillStyle = '#06b6d4';
  ctx.fillRect(400 + busPulse, 898, 24, 4);
  ctx.fillStyle = '#10b981';
  ctx.fillRect(1198, 400 + ((tick * 3) % 1000), 4, 24);

  // Central Grand Plaza Clean Slate Pavement with Geometric Pool
  ctx.fillStyle = 'rgba(241, 245, 249, 0.09)';
  ctx.fillRect(1080, 780, 240, 240);
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(1080, 780, 240, 240);

  // Geometric water pool (Prompt Halaman 9: kolam air geometris di Central Plaza)
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(1130, 820, 140, 70);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.strokeRect(1130, 820, 140, 70);

  // Water wavelets
  const wave = Math.sin(tick * 0.08) * 3;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fillRect(1145, 840 + wave, 50, 3);
  ctx.fillRect(1205, 860 - wave, 50, 3);
}

// Render Obstacles with Frustum Culling & Red Bounding Box in Debug Vision (Bab 4)
function renderObstacles(ctx, debugVision, camX, camY, viewW, viewH, tick) {
  for (const obs of WORLD_OBSTACLES) {
    // Frustum Culling (Prompt Halaman 9)
    if (obs.x + obs.w < camX || obs.x > camX + viewW || obs.y + obs.h < camY || obs.y > camY + viewH) {
      continue;
    }

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);

    // Prompt Halaman 3: Simpul retakan dinding berdenyut cyan halus di [X: 18, Y: 24] (576, 768)
    if (obs.isGlitchWall) {
      const pulse = Math.sin(tick * 0.1) * 0.35 + 0.65;
      ctx.save();
      ctx.strokeStyle = `rgba(6, 182, 212, ${pulse})`;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#06B6D4';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(obs.x + 12, obs.y + 10);
      ctx.lineTo(obs.x + 24, obs.y + 24);
      ctx.lineTo(obs.x + 18, obs.y + 34);
      ctx.lineTo(obs.x + 36, obs.y + 40);
      ctx.stroke();

      // Mini fracture branch
      ctx.beginPath();
      ctx.moveTo(obs.x + 24, obs.y + 24);
      ctx.lineTo(obs.x + 34, obs.y + 20);
      ctx.stroke();
      ctx.restore();
    }

    // Bab 4: Gambarkan bounding box AABB berwarna merah solid di sekeliling semua obyek rintangan
    if (debugVision) {
      ctx.strokeStyle = obs.isGlitchWall ? '#06b6d4' : '#ef4444';
      ctx.lineWidth = 2;
      ctx.strokeRect(obs.x - 2, obs.y - 2, obs.w + 4, obs.h + 4);
      if (obs.isGlitchWall) {
        ctx.fillStyle = '#06b6d4';
        ctx.font = 'bold 9px monospace';
        ctx.fillText('GLITCH WALL [18, 24]', obs.x - 12, obs.y - 6);
      }
    }
  }
}

// Render 5 District Landmarks with Frustum Culling & Blue Bounding Box in Debug Vision (Bab 4)
function renderDistrictLandmarks(ctx, tick, debugVision, nearbyLandmark, camX, camY, viewW, viewH) {
  for (const d of OPEN_WORLD_DISTRICTS) {
    // Frustum Culling (Prompt Halaman 9)
    if (d.x + 120 < camX || d.x - 120 > camX + viewW || d.y + 120 < camY || d.y - 120 > camY + viewH) {
      continue;
    }

    const isNearby = nearbyLandmark?.id === d.id;
    const bob = Math.sin(tick * 0.06 + d.x) * 4;

    ctx.save();

    // Floor Base Halo (Teal / Emerald)
    const haloAlpha = isNearby ? 0.45 + Math.sin(tick * 0.1) * 0.2 : 0.2;
    ctx.fillStyle = isNearby ? `rgba(16, 185, 129, ${haloAlpha})` : `rgba(6, 182, 212, ${haloAlpha})`;
    ctx.beginPath();
    ctx.ellipse(d.x, d.y + 20, 56, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // District Specific Visuals (Clean Tech Architecture)
    if (d.id === 'CENTRAL_PLAZA') {
      drawCleanNoticeBoard(ctx, d.x, d.y);
    } else if (d.id === 'FOUNDRY') {
      drawPlaywrightRigAndServer(ctx, d.x, d.y, tick);
    } else if (d.id === 'DATA_SANCTUM') {
      drawDataSanctumArchive(ctx, d.x, d.y, tick);
    } else if (d.id === 'GATEWAY_PIER') {
      drawGatewayPierAPI(ctx, d.x, d.y, tick);
    } else {
      drawEnvoyLoungeDesk(ctx, d.x, d.y);
    }

    // Floating Icon Bubble (12px rounded clean card)
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = d.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(d.x, d.y - 48 + bob, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.font = '18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(d.icon, d.x, d.y - 47 + bob);

    // Label Text
    ctx.font = 'bold 12px "Inter", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 4;
    ctx.fillText(d.label, d.x, d.y + 44);
    ctx.font = '10px "Inter", sans-serif';
    ctx.fillStyle = d.color;
    ctx.fillText(d.subtitle, d.x, d.y + 60);
    ctx.shadowBlur = 0;

    // Interaction Prompt [SPACE] INSPECT
    if (isNearby) {
      drawInspectPromptBubble(ctx, d.x, d.y - 84 + bob, d.shortLabel);
    }

    // Bab 4: Bounding box AABB biru di sekeliling landmark interaktif
    if (debugVision) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.8;
      ctx.strokeRect(d.x - 48, d.y - 50, 96, 85);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`ZONE: ${d.id} [${d.x},${d.y}]`, d.x, d.y - 54);
    }

    ctx.restore();
  }
}

function drawInspectPromptBubble(ctx, x, y, label) {
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 1.5;

  const w = 180;
  const h = 28;
  ctx.beginPath();
  ctx.roundRect(x - w / 2, y - h / 2, w, h, 8);
  ctx.fill();
  ctx.stroke();

  // Pointer
  ctx.beginPath();
  ctx.moveTo(x - 5, y + h / 2);
  ctx.lineTo(x, y + h / 2 + 5);
  ctx.lineTo(x + 5, y + h / 2);
  ctx.fill();

  ctx.font = 'bold 9px "JetBrains Mono", monospace';
  ctx.fillStyle = '#0f172a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`[SPACE] INSPECT ${label}`, x, y);

  ctx.restore();
}

// Landmark 1: Central Plaza - The Glass Notice Board
function drawCleanNoticeBoard(ctx, x, y) {
  // Glass stand
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x - 30, y - 10, 60, 24);
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x - 30, y - 10, 60, 24);

  // Glass board surface (frosted glass look)
  ctx.fillStyle = 'rgba(248, 250, 252, 0.25)';
  ctx.fillRect(x - 24, y - 26, 48, 20);
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.strokeRect(x - 24, y - 26, 48, 20);

  // Lines on board
  ctx.fillStyle = '#06b6d4';
  ctx.fillRect(x - 18, y - 22, 36, 2);
  ctx.fillRect(x - 18, y - 17, 28, 2);
  ctx.fillRect(x - 18, y - 12, 32, 2);
}

// Landmark 2: Automation Foundry - The Playwright Rig & Teal Server Cluster
function drawPlaywrightRigAndServer(ctx, x, y, tick) {
  // Server rack
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x - 32, y - 22, 64, 40);
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x - 32, y - 22, 64, 40);

  // Blinking teal & emerald LEDs (Prompt Halaman 9)
  const led1 = tick % 30 > 15;
  const led2 = (tick + 15) % 40 > 20;
  ctx.fillStyle = led1 ? '#10b981' : '#047857';
  ctx.fillRect(x - 26, y - 16, 6, 4);
  ctx.fillRect(x - 16, y - 16, 6, 4);
  ctx.fillStyle = led2 ? '#06b6d4' : '#0e7490';
  ctx.fillRect(x + 10, y - 16, 6, 4);
  ctx.fillRect(x + 20, y - 16, 6, 4);

  // Terminal screen on rig
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x - 24, y - 6, 48, 18);
  ctx.fillStyle = '#10b981';
  ctx.font = '7px monospace';
  ctx.fillText('> pw run', x - 18, y + 6);
}

// Landmark 3: Data Sanctum - The Defect Archive & Bug Containment Pod
function drawDataSanctumArchive(ctx, x, y, tick) {
  // Archive pedestal
  ctx.fillStyle = '#1e1b4b';
  ctx.fillRect(x - 28, y - 10, 56, 28);
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x - 28, y - 10, 56, 28);

  // Glass containment tube
  ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
  ctx.fillRect(x - 18, y - 28, 36, 20);
  ctx.strokeStyle = '#c084fc';
  ctx.lineWidth = 1;
  ctx.strokeRect(x - 18, y - 28, 36, 20);

  // Contained bug anomaly pulse
  const shift = Math.sin(tick * 0.15) * 4;
  ctx.fillStyle = '#06b6d4';
  ctx.fillRect(x - 8 + shift, y - 20, 16, 4);
}

// Landmark 4: Gateway Pier - REST API Transceiver & Optic Fiber Lines
function drawGatewayPierAPI(ctx, x, y, tick) {
  // Transceiver base
  ctx.fillStyle = '#0c4a6e';
  ctx.fillRect(x - 24, y - 12, 48, 30);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x - 24, y - 12, 48, 30);

  // Antenna pylon
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - 12);
  ctx.lineTo(x, y - 32);
  ctx.stroke();

  // Emitted signal ring
  const ringRadius = ((tick * 0.8) % 24);
  const ringAlpha = Math.max(0, 1 - ringRadius / 24) * 0.6;
  ctx.strokeStyle = `rgba(56, 189, 248, ${ringAlpha})`;
  ctx.beginPath();
  ctx.arc(x, y - 32, ringRadius, 0, Math.PI * 2);
  ctx.stroke();
}

// Landmark 5: Envoy Lounge - The Envoy Terminal & Recruiter Desk
function drawEnvoyLoungeDesk(ctx, x, y) {
  // Modern executive desk
  ctx.fillStyle = '#064e3b';
  ctx.fillRect(x - 30, y - 14, 60, 32);
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x - 30, y - 14, 60, 32);

  // Clean glass desk pad
  ctx.fillStyle = 'rgba(248, 250, 252, 0.35)';
  ctx.fillRect(x - 22, y - 8, 44, 20);

  // Holographic letter icon
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('✉️', x - 6, y + 6);
}

// ==========================================
// CHARACTER SPRITE: SURYANI LESTARI
// Lead System Seeker & Cross-Module Stability Guardian
// ==========================================
function drawSuryaniSprite(ctx, x, y, facing, walkFrame, isMoving, tick, debugVision) {
  ctx.save();

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(x, y + 17, 13, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Walk bounce
  const walkBob = isMoving ? (walkFrame % 2 === 0 ? 0 : -2) : 0;
  const legOffset = isMoving ? (walkFrame === 1 ? 4 : walkFrame === 3 ? -4 : 0) : 0;

  // Boots
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x - 7, y + 11 + walkBob + (legOffset > 0 ? 2 : 0), 5, 6);
  ctx.fillRect(x + 2, y + 11 + walkBob + (legOffset < 0 ? 2 : 0), 5, 6);

  // Seeker Traveler Cloak (Slate Gray)
  ctx.fillStyle = '#525b6c';
  ctx.beginPath();
  ctx.roundRect(x - 11, y - 6 + walkBob, 22, 18, 4);
  ctx.fill();

  // Utility vest with testing straps
  ctx.fillStyle = '#2d3748';
  ctx.fillRect(x - 6, y - 5 + walkBob, 12, 14);

  // Utility belt & tester toolbag at waist
  ctx.fillStyle = '#854d0e';
  ctx.fillRect(x - 11, y + 4 + walkBob, 22, 3);
  ctx.fillStyle = '#a16207';
  ctx.fillRect(x + 4, y + 2 + walkBob, 6, 7);

  // Skin
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(x, y - 12 + walkBob, 7.5, 0, Math.PI * 2);
  ctx.fill();

  // Observant dark eyes
  ctx.fillStyle = '#0f172a';
  if (facing === 'down') {
    ctx.fillRect(x - 4, y - 13 + walkBob, 2, 2.5);
    ctx.fillRect(x + 2, y - 13 + walkBob, 2, 2.5);
  } else if (facing === 'left') {
    ctx.fillRect(x - 5, y - 13 + walkBob, 2, 2.5);
  } else if (facing === 'right') {
    ctx.fillRect(x + 3, y - 13 + walkBob, 2, 2.5);
  }

  // Neat Dark Hair (Female Seeker hairstyle)
  ctx.fillStyle = '#1c1917';
  ctx.beginPath();
  ctx.arc(x, y - 15 + walkBob, 8.5, Math.PI, 0, false);
  ctx.fill();
  // Bangs
  ctx.beginPath();
  ctx.moveTo(x - 9, y - 15 + walkBob);
  ctx.lineTo(x - 5, y - 10 + walkBob);
  ctx.lineTo(x, y - 14 + walkBob);
  ctx.lineTo(x + 5, y - 10 + walkBob);
  ctx.lineTo(x + 9, y - 15 + walkBob);
  ctx.fill();

  // Side hair strands
  ctx.fillRect(x - 9, y - 14 + walkBob, 3, 10);
  ctx.fillRect(x + 6, y - 14 + walkBob, 3, 10);

  // Holographic stylus / Playwright debug beacon in hand
  const beaconGlow = Math.sin(tick * 0.15) * 0.3 + 0.7;
  ctx.fillStyle = `rgba(0, 240, 255, ${beaconGlow})`;
  ctx.beginPath();
  ctx.arc(x + 8, y + 1 + walkBob, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Bab 4: Radar ring berdenyut radius inspeksi 80px di sekeliling karakter Seeker
  const pulseRadius = ((tick * 1.5) % 80);
  const pulseAlpha = Math.max(0, 1 - pulseRadius / 80) * 0.5;
  ctx.strokeStyle = `rgba(0, 255, 136, ${pulseAlpha})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y, pulseRadius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

// ==========================================
// HAGA DEBUG VISION 2.0 OVERLAY (BAB 4)
// ==========================================
function renderDebugVision2Overlay(ctx, camX, camY, viewW, viewH, playerX, playerY, tick) {
  ctx.save();

  // (1) Grid koordinat 32x32 pixel hijau phosphor semi-transparan rgba(0, 255, 136, 0.15)
  ctx.strokeStyle = 'rgba(0, 255, 136, 0.15)';
  ctx.lineWidth = 1;

  const startX = Math.floor(camX / 32) * 32;
  const startY = Math.floor(camY / 32) * 32;

  ctx.beginPath();
  for (let x = startX; x < camX + viewW; x += 32) {
    ctx.moveTo(x, camY);
    ctx.lineTo(x, camY + viewH);
  }
  for (let y = startY; y < camY + viewH; y += 32) {
    ctx.moveTo(camX, y);
    ctx.lineTo(camX + viewW, y);
  }
  ctx.stroke();

  // Player reticle
  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(playerX - 20, playerY);
  ctx.lineTo(playerX + 20, playerY);
  ctx.moveTo(playerX, playerY - 20);
  ctx.lineTo(playerX, playerY + 20);
  ctx.stroke();

  ctx.fillStyle = '#00ff88';
  ctx.font = 'bold 9px monospace';
  ctx.fillText(`SEEKER_LOC: [${Math.round(playerX)}, ${Math.round(playerY)}]`, playerX + 16, playerY - 14);

  ctx.restore();
}

// ==========================================
// MINI-MAP HUD RADAR (PROMPT HALAMAN 9)
// Mini-map HUD radar semi-transparan 160×120px dengan pin penanda lokasi aktif
// ==========================================
function renderMiniMapRadar(ctx, viewW, viewH, playerX, playerY, tick, nearbyDistrict) {
  const mapW = 160;
  const mapH = 120;
  const mapX = viewW - mapW - 16;
  const mapY = viewH - mapH - 84; // Posisi di pojok kanan bawah di atas express bar

  ctx.save();

  // Glass Container 160×120px dengan sudut 10px rounded
  ctx.beginPath();
  ctx.roundRect(mapX, mapY, mapW, mapH, 10);
  ctx.clip();

  // Dark Semi-Transparent Obsidian Glass Background (#0F172A)
  ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
  ctx.fillRect(mapX, mapY, mapW, mapH);

  // Radar Grid Crosshairs
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.18)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(mapX + mapW / 2, mapY);
  ctx.lineTo(mapX + mapW / 2, mapY + mapH);
  ctx.moveTo(mapX, mapY + mapH / 2);
  ctx.lineTo(mapX + mapW, mapY + mapH / 2);
  ctx.stroke();

  // Radar Rings
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.18)';
  ctx.beginPath();
  ctx.arc(mapX + mapW / 2, mapY + mapH / 2, 24, 0, Math.PI * 2);
  ctx.arc(mapX + mapW / 2, mapY + mapH / 2, 48, 0, Math.PI * 2);
  ctx.stroke();

  // Radar Sweep Scan
  const sweepAngle = (tick * 0.04) % (Math.PI * 2);
  const cx = mapX + mapW / 2;
  const cy = mapY + mapH / 2;
  ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, 56, sweepAngle, sweepAngle + 0.45);
  ctx.closePath();
  ctx.fill();

  // World to Mini-Map Projection (Inner Bounds)
  const padX = 14;
  const padY = 16;
  const innerW = mapW - padX * 2;
  const innerH = mapH - padY * 2;

  // Render 5 District Location Pins (Prompt Halaman 9)
  for (const d of OPEN_WORLD_DISTRICTS) {
    const px = mapX + padX + (d.x / WORLD_WIDTH) * innerW;
    const py = mapY + padY + (d.y / WORLD_HEIGHT) * innerH;

    const isActive = nearbyDistrict?.id === d.id;

    // Pin Base
    ctx.fillStyle = d.color;
    ctx.beginPath();
    ctx.arc(px, py, isActive ? 4.5 : 3, 0, Math.PI * 2);
    ctx.fill();

    if (isActive) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Pin active label tooltip on radar
      ctx.font = 'bold 8px "Inter", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(d.shortLabel, px, py - 6);
    }
  }

  // Player Marker on Radar (Yellow / Emerald glowing pin with pulse)
  const playerMapX = mapX + padX + (playerX / WORLD_WIDTH) * innerW;
  const playerMapY = mapY + padY + (playerY / WORLD_HEIGHT) * innerH;

  // Pulse wave
  const pPulse = (tick * 0.8) % 10;
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(playerMapX, playerMapY, pPulse, 0, Math.PI * 2);
  ctx.stroke();

  // Player Point
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(playerMapX, playerMapY, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.restore();

  // Outer Crisp Micro-Border 1px Emerald (Prompt Halaman 1 & 9)
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(mapX, mapY, mapW, mapH, 10);
  ctx.stroke();

  // Header Title Text
  ctx.font = 'bold 8px "JetBrains Mono", monospace';
  ctx.fillStyle = '#10B981';
  ctx.textAlign = 'left';
  ctx.fillText('RADAR HUD [160×120]', mapX + 8, mapY - 4);
}
