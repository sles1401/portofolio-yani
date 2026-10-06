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
    label: 'Central Guild Plaza',
    shortLabel: 'PLAZA',
    district: 'Distrik 1',
    subtitle: 'Titik Awal, Papan Misi & Arsip Seeker',
    x: 1200,
    y: 900,
    w: 96,
    h: 76,
    color: '#ffb800',
    icon: '🏛️',
    easterEgg: 'Central Archive: 150+ Structured Test Cases Verified'
  },
  {
    id: 'FOUNDRY',
    modalTarget: 'GEAR',
    label: 'Automation Foundry',
    shortLabel: 'FOUNDRY',
    district: 'Distrik 2',
    subtitle: 'Pabrik Roda Gigi Steampunk (Playwright Core)',
    x: 620,
    y: 520,
    w: 96,
    h: 76,
    color: '#00f0ff',
    icon: '⚙️',
    easterEgg: 'Playwright Headless Threads: 4 Active'
  },
  {
    id: 'SWAMP',
    modalTarget: 'BESTIARY',
    label: 'Anomaly Swamp / Ruins',
    shortLabel: 'SWAMP',
    district: 'Distrik 3',
    subtitle: 'Rawa Terglitch Berisi Anomaly Bestiary',
    x: 1780,
    y: 520,
    w: 96,
    h: 76,
    color: '#a855f7',
    icon: '👾',
    easterEgg: 'Heap Memory Spike Warning (Poltergeist Detected)'
  },
  {
    id: 'LIGHTHOUSE',
    modalTarget: 'QUESTS',
    label: 'Integration Lighthouse',
    shortLabel: 'LIGHTHOUSE',
    district: 'Distrik 4',
    subtitle: 'Mercusuar Pantai (API & PPIC Sync)',
    x: 620,
    y: 1320,
    w: 96,
    h: 76,
    color: '#38bdf8',
    icon: '🗼',
    easterEgg: 'PPIC Webhook Endpoint: Listening on Port 8080 (0 Desync)'
  },
  {
    id: 'ENVOY_POST',
    modalTarget: 'DISPATCH',
    label: 'Envoy Post',
    shortLabel: 'ENVOY',
    district: 'Distrik 5',
    subtitle: 'Kuil Pengiriman Surat Dispatch Kontak Suryani',
    x: 1780,
    y: 1320,
    w: 96,
    h: 76,
    color: '#00ff88',
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
  // Foundry gears yard
  { x: 480, y: 420, w: 80, h: 80 },
  { x: 740, y: 420, w: 80, h: 80 },
  // Swamp ruins stones
  { x: 1640, y: 420, w: 70, h: 70 },
  { x: 1900, y: 440, w: 70, h: 70 },
  // Lighthouse coastal reef
  { x: 480, y: 1220, w: 80, h: 80 },
  { x: 740, y: 1240, w: 80, h: 80 },
  // Envoy post garden shrines
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

  // Camera state with Lerp tracking (Bab 3)
  const cameraRef = useRef({ x: 1200 - 480, y: 980 - 300 });
  const keysPressed = useRef({});
  const nearbyRef = useRef(null);

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

      // 3. Sub-pixel Camera Tracking with Lerp Formula (Bab 3: Lerp 0.08)
      const targetCamX = p.x - canvas.width / 2;
      const targetCamY = p.y - canvas.height / 2;
      cameraRef.current.x += (targetCamX - cameraRef.current.x) * 0.08;
      cameraRef.current.y += (targetCamY - cameraRef.current.y) * 0.08;
      cameraRef.current.x = Math.max(0, Math.min(WORLD_WIDTH - canvas.width, cameraRef.current.x));
      cameraRef.current.y = Math.max(0, Math.min(WORLD_HEIGHT - canvas.height, cameraRef.current.y));

      const camX = Math.round(cameraRef.current.x);
      const camY = Math.round(cameraRef.current.y);

      // 4. Render Open-World Map
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(-camX, -camY);

      // 4.1 Render World Terrain (5 Distrik Open-World)
      renderOpenWorldTerrain(ctx, camX, camY, canvas.width, canvas.height, tick);

      // 4.2 Render Obstacles (batu batas, reruntuhan)
      renderObstacles(ctx, debugVision);

      // 4.3 Render 5 District Landmarks
      renderDistrictLandmarks(ctx, tick, debugVision, nearbyRef.current);

      // 4.4 Render Character Sprite Suryani Lestari (Lead System Seeker)
      drawSuryaniSprite(ctx, p.x, p.y, p.facing, p.walkFrame, p.isMoving, tick, debugVision);

      // 4.5 Haga Debug Vision 2.0 Overlay (Bab 4)
      if (debugVision) {
        renderDebugVision2Overlay(ctx, camX, camY, canvas.width, canvas.height, p.x, p.y, tick);
      }

      ctx.restore();

      // 4.6 Render Mini-Map HUD Radar (Bab 3: 110px circle in bottom-right)
      renderMiniMapRadar(ctx, canvas.width, canvas.height, p.x, p.y, tick);

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeModal, debugVision, dpadState, isPaused, onDiagnosticsUpdate, onNearbyChange]);

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
// ==========================================
function renderOpenWorldTerrain(ctx, camX, camY, viewW, viewH, tick) {
  // Tile bounds visible in viewport
  const startCol = Math.max(0, Math.floor(camX / TILE_SIZE));
  const endCol = Math.min(MAP_COLS, Math.ceil((camX + viewW) / TILE_SIZE));
  const startRow = Math.max(0, Math.floor(camY / TILE_SIZE));
  const endRow = Math.min(MAP_ROWS, Math.ceil((camY + viewH) / TILE_SIZE));

  for (let r = startRow; r < endRow; r++) {
    for (let c = startCol; c < endCol; c++) {
      const tx = c * TILE_SIZE;
      const ty = r * TILE_SIZE;

      // Outer boundary wall
      if (r < 2 || r >= MAP_ROWS - 2 || c < 2 || c >= MAP_COLS - 2) {
        ctx.fillStyle = '#070b18';
        ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
        ctx.strokeStyle = '#141d36';
        ctx.lineWidth = 1;
        ctx.strokeRect(tx + 2, ty + 2, TILE_SIZE - 4, TILE_SIZE - 4);
      } else {
        // District Biomes coloring:
        // Northwest (Foundry): Steampunk bronze stone
        if (tx < 1000 && ty < 900) {
          ctx.fillStyle = (r + c) % 2 === 0 ? '#1b1a29' : '#151422';
        }
        // Northeast (Anomaly Swamp): Glitched violet-swamp
        else if (tx >= 1400 && ty < 900) {
          ctx.fillStyle = (r + c) % 2 === 0 ? '#131e24' : '#10171d';
        }
        // Southwest (Lighthouse Coast): Deep coastal navy
        else if (tx < 1000 && ty >= 900) {
          ctx.fillStyle = (r + c) % 2 === 0 ? '#0d1d33' : '#0a1729';
        }
        // Southeast (Envoy Garden): Emerald forest stone
        else if (tx >= 1400 && ty >= 900) {
          ctx.fillStyle = (r + c) % 2 === 0 ? '#0f231e' : '#0c1b18';
        }
        // Central Plaza: Guild polished checkerboard (#13203C and #162544)
        else {
          ctx.fillStyle = (r + c) % 2 === 0 ? '#13203c' : '#162544';
        }
        ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);

        // Tile subtle grout
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(tx, ty, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  // Cross highways / connecting paved cobblestone paths
  // Horizontal path from Foundry to Swamp
  ctx.fillStyle = 'rgba(218, 165, 32, 0.12)';
  ctx.fillRect(400, 860, 1600, 80);
  // Vertical path from Lighthouse to Envoy
  ctx.fillRect(1160, 400, 80, 1000);

  // Central Grand Plaza Crimson Carpet
  ctx.fillStyle = '#83182b';
  ctx.fillRect(1100, 780, 200, 240);
  ctx.strokeStyle = '#c59b27';
  ctx.lineWidth = 3;
  ctx.strokeRect(1100, 780, 200, 240);
}

// Render Obstacles with Red Bounding Box in Debug Vision (Bab 4)
function renderObstacles(ctx, debugVision) {
  for (const obs of WORLD_OBSTACLES) {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);

    // Bab 4: Gambarkan bounding box AABB berwarna merah solid di sekeliling semua obyek rintangan
    if (debugVision) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.strokeRect(obs.x - 2, obs.y - 2, obs.w + 4, obs.h + 4);
    }
  }
}

// Render 5 District Landmarks with Blue Bounding Box in Debug Vision (Bab 4)
function renderDistrictLandmarks(ctx, tick, debugVision, nearbyLandmark) {
  for (const d of OPEN_WORLD_DISTRICTS) {
    const isNearby = nearbyLandmark?.id === d.id;
    const bob = Math.sin(tick * 0.06 + d.x) * 4;

    ctx.save();

    // Floor Base Halo
    const haloAlpha = isNearby ? 0.4 + Math.sin(tick * 0.1) * 0.2 : 0.18;
    ctx.fillStyle = `rgba(0, 240, 255, ${haloAlpha})`;
    ctx.beginPath();
    ctx.ellipse(d.x, d.y + 20, 52, 28, 0, 0, Math.PI * 2);
    ctx.fill();

    // District Specific Visuals
    if (d.id === 'CENTRAL_PLAZA') {
      drawPlazaAltar(ctx, d.x, d.y);
    } else if (d.id === 'FOUNDRY') {
      drawFoundryGears(ctx, d.x, d.y, tick);
    } else if (d.id === 'SWAMP') {
      drawSwampGlitches(ctx, d.x, d.y, tick);
    } else if (d.id === 'LIGHTHOUSE') {
      drawLighthouseBeacon(ctx, d.x, d.y, tick);
    } else {
      drawEnvoyShrine(ctx, d.x, d.y);
    }

    // Floating Icon Bubble
    ctx.fillStyle = '#0b1633';
    ctx.strokeStyle = d.color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(d.x, d.y - 48 + bob, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.font = '18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(d.icon, d.x, d.y - 47 + bob);

    // Label Text
    ctx.font = 'bold 11px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 4;
    ctx.fillText(d.label, d.x, d.y + 44);
    ctx.font = '9px sans-serif';
    ctx.fillStyle = d.color;
    ctx.fillText(d.subtitle, d.x, d.y + 58);
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
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 2;

  const w = 170;
  const h = 26;
  ctx.beginPath();
  ctx.roundRect(x - w / 2, y - h / 2, w, h, 6);
  ctx.fill();
  ctx.stroke();

  // Pointer
  ctx.beginPath();
  ctx.moveTo(x - 5, y + h / 2);
  ctx.lineTo(x, y + h / 2 + 5);
  ctx.lineTo(x + 5, y + h / 2);
  ctx.fill();

  ctx.font = 'bold 9px monospace';
  ctx.fillStyle = '#0b1633';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`[SPACE] INSPECT ${label}`, x, y);

  ctx.restore();
}

function drawPlazaAltar(ctx, x, y) {
  ctx.fillStyle = '#5c3818';
  ctx.fillRect(x - 34, y - 20, 68, 40);
  ctx.fillStyle = '#d4af37';
  ctx.strokeRect(x - 34, y - 20, 68, 40);
  ctx.fillStyle = '#f5e8c7';
  ctx.fillRect(x - 22, y - 12, 44, 24);
}

function drawFoundryGears(ctx, x, y, tick) {
  ctx.fillStyle = '#475569';
  ctx.fillRect(x - 30, y - 10, 60, 30);
  // Gear rotation
  ctx.save();
  ctx.translate(x, y - 15);
  ctx.rotate(tick * 0.05);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  ctx.strokeRect(-12, -12, 24, 24);
  ctx.restore();
}

function drawSwampGlitches(ctx, x, y, tick) {
  ctx.fillStyle = '#2e1065';
  ctx.fillRect(x - 28, y - 10, 56, 30);
  // Glitch particles
  const shift = Math.sin(tick * 0.2) * 6;
  ctx.fillStyle = '#a855f7';
  ctx.fillRect(x - 16 + shift, y - 22, 32, 10);
  ctx.fillStyle = '#00ff88';
  ctx.fillRect(x - 8 - shift, y - 26, 16, 4);
}

function drawLighthouseBeacon(ctx, x, y, tick) {
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.moveTo(x - 18, y + 20);
  ctx.lineTo(x - 10, y - 25);
  ctx.lineTo(x + 10, y - 25);
  ctx.lineTo(x + 18, y + 20);
  ctx.closePath();
  ctx.fill();

  // Lighthouse light beam
  const beamAngle = tick * 0.04;
  ctx.save();
  ctx.translate(x, y - 25);
  ctx.rotate(beamAngle);
  ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, 60, -0.3, 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawEnvoyShrine(ctx, x, y) {
  ctx.fillStyle = '#065f46';
  ctx.fillRect(x - 26, y - 16, 52, 36);
  ctx.fillStyle = '#10b981';
  ctx.fillRect(x - 22, y - 12, 44, 28);
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
// MINI-MAP HUD RADAR (BAB 3)
// Lingkaran diameter 110px di pojok kanan bawah kanvas.
// Skala 0.045x dari dunia riil. Cyan radar sweep & 5 distrik.
// ==========================================
function renderMiniMapRadar(ctx, viewW, viewH, playerX, playerY, tick) {
  const mapRadius = 55; // Diameter 110px
  const mapCenterX = viewW - mapRadius - 16;
  const mapCenterY = viewH - mapRadius - 80; // slightly above bottom express bar
  const scale = 0.045;

  ctx.save();

  // Circular Mask
  ctx.beginPath();
  ctx.arc(mapCenterX, mapCenterY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  // Dark Map Background
  ctx.fillStyle = 'rgba(5, 12, 28, 0.9)';
  ctx.fillRect(mapCenterX - mapRadius, mapCenterY - mapRadius, mapRadius * 2, mapRadius * 2);

  // Radar Grid Rings
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(mapCenterX, mapCenterY, mapRadius * 0.4, 0, Math.PI * 2);
  ctx.arc(mapCenterX, mapCenterY, mapRadius * 0.75, 0, Math.PI * 2);
  ctx.stroke();

  // Radar Sweep Beam
  const sweepAngle = (tick * 0.04) % (Math.PI * 2);
  const sweepGradient = ctx.createRadialGradient(mapCenterX, mapCenterY, 2, mapCenterX, mapCenterY, mapRadius);
  sweepGradient.addColorStop(0, 'rgba(0, 240, 255, 0.4)');
  sweepGradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
  ctx.fillStyle = sweepGradient;
  ctx.beginPath();
  ctx.moveTo(mapCenterX, mapCenterY);
  ctx.arc(mapCenterX, mapCenterY, mapRadius, sweepAngle, sweepAngle + 0.4);
  ctx.closePath();
  ctx.fill();

  // World Offset Relative to map center
  // Player is at center of radar
  for (const d of OPEN_WORLD_DISTRICTS) {
    const relX = (d.x - playerX) * scale;
    const relY = (d.y - playerY) * scale;
    const dotX = mapCenterX + relX;
    const dotY = mapCenterY + relY;

    // Landmark Dot
    ctx.fillStyle = d.color;
    ctx.beginPath();
    ctx.arc(dotX, dotY, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Yellow Player Dot at Center
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(mapCenterX, mapCenterY, 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // Radar Outer Ring & Label
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(mapCenterX, mapCenterY, mapRadius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.font = 'bold 8px monospace';
  ctx.fillStyle = '#00f0ff';
  ctx.textAlign = 'center';
  ctx.fillText('MINI-MAP [0.045x]', mapCenterX, mapCenterY - mapRadius - 4);
}
