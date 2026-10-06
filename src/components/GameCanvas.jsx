import React, { useRef, useEffect, useCallback } from 'react';
import { sound } from '../utils/audio';

const TILE_SIZE = 36;
const MAP_COLS = 32;
const MAP_ROWS = 24;
const MAP_WIDTH = MAP_COLS * TILE_SIZE; // 1152 px
const MAP_HEIGHT = MAP_ROWS * TILE_SIZE; // 864 px

export const GUILD_LANDMARKS = [
  {
    id: 'QUESTS',
    label: 'Guild Quest Board',
    shortLabel: 'QUESTS',
    subtitle: 'Catatan Misi Pengujian & Nilai Bisnis',
    x: 360,
    y: 310,
    width: 90,
    height: 70,
    color: '#ffb800',
    icon: '📜',
    shortcut: '1'
  },
  {
    id: 'BESTIARY',
    label: 'Anomaly Bestiary',
    shortLabel: 'BESTIARY',
    subtitle: 'Ensiklopedia Defect & Metode Exorcism',
    x: 792,
    y: 310,
    width: 90,
    height: 70,
    color: '#00f0ff',
    icon: '👾',
    shortcut: '2'
  },
  {
    id: 'GEAR',
    label: 'Armory Equipment & Buffs',
    shortLabel: 'GEAR',
    subtitle: 'Perlengkapan Tempur & Passive Buffs',
    x: 360,
    y: 560,
    width: 90,
    height: 70,
    color: '#ff2a85',
    icon: '⚔️',
    shortcut: '3'
  },
  {
    id: 'DISPATCH',
    label: 'Guild Dispatch Desk',
    shortLabel: 'DISPATCH',
    subtitle: 'Jalur Konversi & Kontak Recruiter',
    x: 792,
    y: 560,
    width: 90,
    height: 70,
    color: '#00ff88',
    icon: '✉️',
    shortcut: '4'
  }
];

export const GameCanvas = ({
  onTriggerModal,
  activeModal,
  onNearbyChange,
  dpadState,
  debugVision,
  onTelemetryUpdate
}) => {
  const canvasRef = useRef(null);

  // Player state: Haga (Section 2.1: Kecepatan 3.5 px/frame)
  const playerRef = useRef({
    x: 576,
    y: 440,
    speed: 3.5,
    facing: 'down',
    isMoving: false,
    walkFrame: 0,
    walkTimer: 0,
    targetX: null,
    targetY: null
  });

  const keysPressed = useRef({});
  const nearbyRef = useRef(null);

  // Keyboard navigation & interaction
  useEffect(() => {
    const handleKeyDown = (e) => {
      const code = e.code;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyE', 'Space', 'KeyM'].includes(code)) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
        }
      }

      keysPressed.current[code] = true;

      // Interaction trigger when near landmark: [SPACE] or [E] or [Enter]
      if ((code === 'Space' || code === 'KeyE' || code === 'Enter') && !activeModal) {
        if (nearbyRef.current) {
          sound.playSelect();
          onTriggerModal(nearbyRef.current.id);
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
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let tick = 0;
    let stepSoundTimer = 0;

    // Telemetry tracking (Section 3.1)
    let lastTime = performance.now();
    let frameCount = 0;
    let currentFps = 60;

    const gameLoop = (currentTime) => {
      tick++;

      // Telemetry calculation
      const delta = currentTime - lastTime;
      frameCount++;
      if (delta >= 1000) {
        currentFps = (frameCount * 1000) / delta;
        frameCount = 0;
        lastTime = currentTime;

        let heapMB = 0;
        if (window.performance && window.performance.memory) {
          heapMB = window.performance.memory.usedJSHeapSize / (1024 * 1024);
        }

        if (onTelemetryUpdate) {
          onTelemetryUpdate({
            fps: currentFps.toFixed(1),
            heapMB: heapMB > 0 ? heapMB.toFixed(2) + ' MB' : '38.4 MB (Allocated)',
            playerX: Math.round(playerRef.current.x),
            playerY: Math.round(playerRef.current.y)
          });
        }
      }

      // Update resolution
      const displayWidth = canvas.parentElement ? canvas.parentElement.clientWidth : 960;
      const displayHeight = canvas.parentElement ? canvas.parentElement.clientHeight : 600;
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }

      const p = playerRef.current;

      // 1. Movement logic (hanya bergerak jika MODAL_ACTIVE is false)
      if (!activeModal) {
        let dx = 0;
        let dy = 0;

        // Keyboard WASD & Arrows
        if (keysPressed.current['ArrowUp'] || keysPressed.current['KeyW']) dy -= 1;
        if (keysPressed.current['ArrowDown'] || keysPressed.current['KeyS']) dy += 1;
        if (keysPressed.current['ArrowLeft'] || keysPressed.current['KeyA']) dx -= 1;
        if (keysPressed.current['ArrowRight']) dx += 1;
        // Don't use KeyD for right move if it is reserved, but support both KeyD and ArrowRight
        if (keysPressed.current['KeyD'] && !debugVision) dx += 1;

        // Virtual D-Pad
        if (dpadState) {
          if (dpadState.up) dy -= 1;
          if (dpadState.down) dy += 1;
          if (dpadState.left) dx -= 1;
          if (dpadState.right) dx += 1;
        }

        // Click / Touch target interpolation
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

        // Normalize diagonal speed
        if (dx !== 0 && dy !== 0 && (p.targetX === null)) {
          const invSqrt2 = 0.70710678;
          dx *= invSqrt2;
          dy *= invSqrt2;
        }

        // Move player
        if (dx !== 0 || dy !== 0) {
          p.isMoving = true;
          const nextX = p.x + dx * p.speed;
          const nextY = p.y + dy * p.speed;

          // Facing direction
          if (Math.abs(dx) > Math.abs(dy)) {
            p.facing = dx > 0 ? 'right' : 'left';
          } else {
            p.facing = dy > 0 ? 'down' : 'up';
          }

          // Walk animation timer
          p.walkTimer++;
          if (p.walkTimer > 8) {
            p.walkFrame = (p.walkFrame + 1) % 4;
            p.walkTimer = 0;
          }

          // Audio footstep pulse (Section 7)
          stepSoundTimer++;
          if (stepSoundTimer > 20) {
            sound.playFootstep();
            stepSoundTimer = 0;
          }

          // Collision detection boundaries (Guild interior margins)
          const minX = 2 * TILE_SIZE + 16;
          const maxX = (MAP_COLS - 2) * TILE_SIZE - 16;
          const minY = 2 * TILE_SIZE + 24;
          const maxY = (MAP_ROWS - 2) * TILE_SIZE - 16;

          p.x = Math.max(minX, Math.min(maxX, nextX));
          p.y = Math.max(minY, Math.min(maxY, nextY));
        } else {
          p.isMoving = false;
          p.walkFrame = 0;
          stepSoundTimer = 0;
        }
      }

      // 2. Euclidean distance check for landmark proximity (Section 2.1: radius < 72 px)
      let foundNearby = null;
      for (const lm of GUILD_LANDMARKS) {
        const dist = Math.hypot(p.x - lm.x, p.y - lm.y);
        if (dist < 72) {
          foundNearby = lm;
          break;
        }
      }

      if (nearbyRef.current?.id !== foundNearby?.id) {
        nearbyRef.current = foundNearby;
        if (onNearbyChange) {
          onNearbyChange(foundNearby);
        }
      }

      // 3. Render World with Centered Dynamic Camera (Section 8.1)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cameraX = Math.round(p.x - canvas.width / 2);
      const cameraY = Math.round(p.y - canvas.height / 2);

      ctx.save();
      ctx.translate(-cameraX, -cameraY);

      // 3.1 Background Floor Tilemap (Section 8.1)
      for (let r = 0; r < MAP_ROWS; r++) {
        for (let c = 0; c < MAP_COLS; c++) {
          const tx = c * TILE_SIZE;
          const ty = r * TILE_SIZE;

          // Outer Wall Tiles
          if (r < 2 || r >= MAP_ROWS - 2 || c < 2 || c >= MAP_COLS - 2) {
            ctx.fillStyle = '#0a0e1c';
            ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);

            // Wall stone brick lines
            ctx.strokeStyle = '#182442';
            ctx.lineWidth = 1;
            ctx.strokeRect(tx + 2, ty + 2, TILE_SIZE - 4, TILE_SIZE - 4);
          } else {
            // Guild Floor Checker Pattern (#13203C and #162544)
            ctx.fillStyle = (r + c) % 2 === 0 ? '#13203C' : '#162544';
            ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);

            // Floor subtle stone grout
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 0.5;
            ctx.strokeRect(tx, ty, TILE_SIZE, TILE_SIZE);
          }
        }
      }

      // 3.2 Grand Red Carpet Corridor (Markas Guild Central Runner)
      const carpetStartX = 14 * TILE_SIZE;
      const carpetWidth = 4 * TILE_SIZE;
      const carpetStartY = 3 * TILE_SIZE;
      const carpetHeight = (MAP_ROWS - 6) * TILE_SIZE;

      // Carpet Gold Border
      ctx.fillStyle = '#c59b27';
      ctx.fillRect(carpetStartX - 4, carpetStartY, carpetWidth + 8, carpetHeight);

      // Carpet Velvet Crimson
      ctx.fillStyle = '#83182b';
      ctx.fillRect(carpetStartX, carpetStartY, carpetWidth, carpetHeight);

      // Carpet Inner Filigree Lines
      ctx.strokeStyle = 'rgba(218, 165, 32, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(carpetStartX + 6, carpetStartY + 6, carpetWidth - 12, carpetHeight - 12);

      // 3.3 Guild Banners & Wall Torches
      drawWallTorches(ctx, tick);

      // 3.4 Render Guild Landmarks
      renderGuildLandmarks(ctx, tick, debugVision, nearbyRef.current);

      // 3.5 Render Haga Sprite (Procedural Canvas Primitives: Gray cloak, dark hair, pouch)
      drawHagaSprite(ctx, p.x, p.y, p.facing, p.walkFrame, p.isMoving, tick);

      // 3.6 Seeker Debug Vision Overlay (Section 3)
      if (debugVision) {
        drawDebugVisionEngine(ctx, p.x, p.y, tick);
      }

      ctx.restore();

      // Request next frame
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeModal, debugVision, dpadState, onNearbyChange, onTelemetryUpdate]);

  // Handle canvas click to navigate or click landmark directly
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickScreenX = e.clientX - rect.left;
    const clickScreenY = e.clientY - rect.top;

    const p = playerRef.current;
    const cameraX = Math.round(p.x - canvas.width / 2);
    const cameraY = Math.round(p.y - canvas.height / 2);

    const worldClickX = clickScreenX + cameraX;
    const worldClickY = clickScreenY + cameraY;

    // Check if clicked directly on or near a landmark
    for (const lm of GUILD_LANDMARKS) {
      const dist = Math.hypot(worldClickX - lm.x, worldClickY - lm.y);
      if (dist <= 55) {
        sound.playSelect();
        onTriggerModal(lm.id);
        return;
      }
    }

    // Otherwise, move Haga towards target
    p.targetX = Math.max(2 * TILE_SIZE + 20, Math.min((MAP_COLS - 2) * TILE_SIZE - 20, worldClickX));
    p.targetY = Math.max(2 * TILE_SIZE + 28, Math.min((MAP_ROWS - 2) * TILE_SIZE - 20, worldClickY));
  };

  return (
    <div className="canvas-container-root">
      <canvas
        ref={canvasRef}
        className={`game-2d-canvas ${debugVision ? 'debug-mode-active' : ''}`}
        onClick={handleCanvasClick}
        aria-label="2D Guild Hall Interactive Canvas"
      />
    </div>
  );
};

// ==========================================
// PROCEDURAL CANVAS DRAWING HELPERS
// ==========================================

// Wall Torches & Guild Sconces
function drawWallTorches(ctx, tick) {
  const torchCoords = [
    { x: 5 * TILE_SIZE, y: 2 * TILE_SIZE },
    { x: 10 * TILE_SIZE, y: 2 * TILE_SIZE },
    { x: 21 * TILE_SIZE, y: 2 * TILE_SIZE },
    { x: 26 * TILE_SIZE, y: 2 * TILE_SIZE },
    { x: 5 * TILE_SIZE, y: (MAP_ROWS - 2) * TILE_SIZE },
    { x: 26 * TILE_SIZE, y: (MAP_ROWS - 2) * TILE_SIZE }
  ];

  for (const t of torchCoords) {
    // Sconce bracket
    ctx.fillStyle = '#4a5568';
    ctx.fillRect(t.x - 3, t.y - 10, 6, 12);

    // Torch flame with flicker animation
    const flicker = Math.sin(tick * 0.15 + t.x) * 3;
    const gradient = ctx.createRadialGradient(t.x, t.y - 12, 1, t.x, t.y - 12, 14 + flicker);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.3, '#ffcc00');
    gradient.addColorStop(0.7, '#ff4400');
    gradient.addColorStop(1, 'rgba(255, 68, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(t.x, t.y - 12, 14 + flicker, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 4 Interactive Guild Landmarks
function renderGuildLandmarks(ctx, tick, debugVision, nearbyLandmark) {
  for (const lm of GUILD_LANDMARKS) {
    const isNearby = nearbyLandmark?.id === lm.id;
    const bob = Math.sin(tick * 0.06 + lm.x) * 3;

    // Floor Pedestal / Platform Rug
    ctx.save();
    ctx.fillStyle = 'rgba(10, 16, 32, 0.7)';
    ctx.beginPath();
    ctx.ellipse(lm.x, lm.y + 16, 42, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pulse Halo on floor
    const haloAlpha = isNearby ? 0.35 + Math.sin(tick * 0.1) * 0.15 : 0.15;
    ctx.fillStyle = lm.id === 'QUESTS' ? `rgba(255, 184, 0, ${haloAlpha})`
      : lm.id === 'BESTIARY' ? `rgba(0, 240, 255, ${haloAlpha})`
      : lm.id === 'GEAR' ? `rgba(255, 42, 133, ${haloAlpha})`
      : `rgba(0, 255, 136, ${haloAlpha})`;
    ctx.beginPath();
    ctx.ellipse(lm.x, lm.y + 16, 48, 26, 0, 0, Math.PI * 2);
    ctx.fill();

    // Landmark Specific Object Illustrations
    if (lm.id === 'QUESTS') {
      // Wood Quest Board
      drawQuestBoardObject(ctx, lm.x, lm.y - 8);
    } else if (lm.id === 'BESTIARY') {
      // Anomaly Grimoire & Holographic Cage
      drawBestiaryCageObject(ctx, lm.x, lm.y - 8, tick);
    } else if (lm.id === 'GEAR') {
      // Armory Weapon Rack & Anvil
      drawArmoryAnvilObject(ctx, lm.x, lm.y - 8);
    } else {
      // Guild Reception Desk
      drawReceptionDeskObject(ctx, lm.x, lm.y - 8);
    }

    // Floating Icon Bubble
    ctx.fillStyle = '#0c1a3a';
    ctx.strokeStyle = lm.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(lm.x, lm.y - 48 + bob, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(lm.icon, lm.x, lm.y - 47 + bob);

    // Label Text
    ctx.font = 'bold 11px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 4;
    ctx.fillText(lm.shortLabel, lm.x, lm.y + 36);
    ctx.shadowBlur = 0;

    // Distance Inspection Prompt Bubble: Section 2.1 ("[SPACE] INSPECT OBJECT")
    if (isNearby) {
      drawInspectPromptBubble(ctx, lm.x, lm.y - 82 + bob);
    }

    // Section 3: Bounding box hijau dan label penanda di landmark jika Debug Vision aktif
    if (debugVision) {
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.strokeRect(lm.x - 45, lm.y - 55, 90, 85);
      ctx.setLineDash([]);

      ctx.fillStyle = '#00ff88';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`[ENTITY: ${lm.id}] (${Math.round(lm.x)}, ${Math.round(lm.y)})`, lm.x, lm.y - 60);
    }

    ctx.restore();
  }
}

// Prompt Bubble: [SPACE] INSPECT OBJECT
function drawInspectPromptBubble(ctx, x, y) {
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 2;
  
  // Capsule bubble
  const w = 150;
  const h = 24;
  ctx.beginPath();
  ctx.roundRect(x - w / 2, y - h / 2, w, h, 6);
  ctx.fill();
  ctx.stroke();

  // Pointer triangle
  ctx.beginPath();
  ctx.moveTo(x - 5, y + h / 2);
  ctx.lineTo(x, y + h / 2 + 6);
  ctx.lineTo(x + 5, y + h / 2);
  ctx.fill();

  ctx.font = 'bold 9px monospace';
  ctx.fillStyle = '#0b1633';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('[SPACE] INSPECT OBJECT', x, y);

  ctx.restore();
}

// Quest Board Canvas Primitive
function drawQuestBoardObject(ctx, x, y) {
  // Wooden frame
  ctx.fillStyle = '#5c3818';
  ctx.fillRect(x - 32, y - 24, 64, 44);
  ctx.fillStyle = '#7a4e25';
  ctx.fillRect(x - 28, y - 20, 56, 36);

  // Parchment paper notes pinned on board
  ctx.fillStyle = '#f5e8c7';
  ctx.fillRect(x - 22, y - 16, 18, 22);
  ctx.fillStyle = '#e8d5aa';
  ctx.fillRect(x + 2, y - 14, 20, 24);

  // Red wax seal & pins
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.arc(x - 13, y - 13, 2.5, 0, Math.PI * 2);
  ctx.arc(x + 12, y - 11, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Posts legs
  ctx.fillStyle = '#3a230f';
  ctx.fillRect(x - 26, y + 16, 6, 12);
  ctx.fillRect(x + 20, y + 16, 6, 12);
}

// Anomaly Bestiary Grimoire Object
function drawBestiaryCageObject(ctx, x, y, tick) {
  // Stone altar base
  ctx.fillStyle = '#2d3748';
  ctx.fillRect(x - 26, y - 4, 52, 22);
  ctx.fillStyle = '#1a202c';
  ctx.fillRect(x - 30, y + 14, 60, 6);

  // Holographic anomaly grimoire floating
  const floatY = y - 14 + Math.sin(tick * 0.1) * 4;
  ctx.fillStyle = '#4a154b';
  ctx.fillRect(x - 16, floatY, 32, 20);

  // Glowing energy rune core
  ctx.fillStyle = '#00f0ff';
  ctx.shadowColor = '#00f0ff';
  ctx.shadowBlur = 10;
  ctx.fillRect(x - 12, floatY + 3, 24, 14);
  ctx.shadowBlur = 0;

  // Arcane particle orbits
  const orbitX = x + Math.cos(tick * 0.08) * 22;
  const orbitY = floatY + 10 + Math.sin(tick * 0.08) * 8;
  ctx.fillStyle = '#ff2a85';
  ctx.beginPath();
  ctx.arc(orbitX, orbitY, 2.5, 0, Math.PI * 2);
  ctx.fill();
}

// Armory Anvil & Weapon Rack
function drawArmoryAnvilObject(ctx, x, y) {
  // Weapon rack frame
  ctx.fillStyle = '#4a3b32';
  ctx.fillRect(x - 28, y - 20, 56, 8);
  ctx.fillRect(x - 26, y - 12, 6, 26);
  ctx.fillRect(x + 20, y - 12, 6, 26);

  // Playwright blade / sword
  ctx.fillStyle = '#cbd5e0';
  ctx.fillRect(x - 14, y - 18, 4, 26);
  ctx.fillStyle = '#2b6cb0';
  ctx.fillRect(x - 17, y - 4, 10, 3); // Crossguard

  // Anvil steel body
  ctx.fillStyle = '#4a5568';
  ctx.beginPath();
  ctx.moveTo(x + 4, y);
  ctx.lineTo(x + 24, y);
  ctx.lineTo(x + 20, y + 10);
  ctx.lineTo(x + 22, y + 16);
  ctx.lineTo(x + 6, y + 16);
  ctx.lineTo(x + 8, y + 10);
  ctx.closePath();
  ctx.fill();
}

// Guild Receptionist Desk
function drawReceptionDeskObject(ctx, x, y) {
  // Polished mahogany guild counter
  ctx.fillStyle = '#652a0e';
  ctx.fillRect(x - 34, y - 10, 68, 26);
  ctx.fillStyle = '#823c19';
  ctx.fillRect(x - 32, y - 12, 64, 6);

  // Open ledger book & quill
  ctx.fillStyle = '#f7fafc';
  ctx.fillRect(x - 16, y - 8, 14, 10);
  ctx.fillRect(x - 2, y - 8, 14, 10);

  // Inkpot & feather quill
  ctx.fillStyle = '#1a202c';
  ctx.fillRect(x + 18, y - 7, 6, 7);
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x + 21, y - 7);
  ctx.lineTo(x + 26, y - 16);
  ctx.stroke();
}

// Section 8: HAGA SPRITE CANVAS PRIMITIVE
// Karakter sprite Haga: Jubah abu-abu (gray cloak), tas perlengkapan tester di pinggang (pouch), rambut gelap (dark hair)
function drawHagaSprite(ctx, x, y, facing, walkFrame, isMoving, tick) {
  ctx.save();

  // Shadow under character
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(x, y + 17, 13, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Walk bounce offset
  const walkBob = isMoving ? (walkFrame % 2 === 0 ? 0 : -2) : 0;
  const legOffset = isMoving ? (walkFrame === 1 ? 4 : walkFrame === 3 ? -4 : 0) : 0;

  // 1. Boots / Legs
  ctx.fillStyle = '#22252a'; // Dark leather boots
  if (facing === 'left' || facing === 'right') {
    ctx.fillRect(x - 5 + legOffset, y + 11 + walkBob, 5, 6);
    ctx.fillRect(x + 1 - legOffset, y + 11 + walkBob, 5, 6);
  } else {
    ctx.fillRect(x - 7, y + 11 + walkBob + (legOffset > 0 ? 2 : 0), 5, 6);
    ctx.fillRect(x + 2, y + 11 + walkBob + (legOffset < 0 ? 2 : 0), 5, 6);
  }

  // 2. Gray Cloak Body (Haga's Signature Cape & Traveler Cloak)
  ctx.fillStyle = '#596273'; // Slate gray cloak
  ctx.beginPath();
  ctx.roundRect(x - 11, y - 6 + walkBob, 22, 18, 4);
  ctx.fill();

  // Inner jacket / tunic
  ctx.fillStyle = '#2d333f';
  ctx.fillRect(x - 4, y - 5 + walkBob, 8, 14);

  // Tester Tool Bag / Belt Pouch at Waist (Section 8: Tas perlengkapan tester di pinggang)
  ctx.fillStyle = '#78431e'; // Leather belt
  ctx.fillRect(x - 11, y + 4 + walkBob, 22, 3);

  // Belt Pouch (Leather pouch with brass buckle)
  ctx.fillStyle = '#9c5b28';
  if (facing === 'left') {
    ctx.fillRect(x - 12, y + 2 + walkBob, 6, 7);
    ctx.fillStyle = '#e2b343';
    ctx.fillRect(x - 10, y + 4 + walkBob, 2, 3);
  } else if (facing === 'right') {
    ctx.fillRect(x + 6, y + 2 + walkBob, 6, 7);
    ctx.fillStyle = '#e2b343';
    ctx.fillRect(x + 8, y + 4 + walkBob, 2, 3);
  } else {
    // Front / Back facing: pouch at right hip
    ctx.fillRect(x + 4, y + 2 + walkBob, 6, 7);
    ctx.fillStyle = '#e2b343';
    ctx.fillRect(x + 6, y + 4 + walkBob, 2, 3);
  }

  // Cloak folds / Collar
  ctx.fillStyle = '#474e5d';
  ctx.fillRect(x - 9, y - 7 + walkBob, 18, 4);

  // 3. Head & Face
  ctx.fillStyle = '#fce5cd'; // Anime skin tone
  ctx.beginPath();
  ctx.arc(x, y - 12 + walkBob, 7.5, 0, Math.PI * 2);
  ctx.fill();

  // Face Features based on facing
  if (facing === 'down') {
    // Observant dark eyes
    ctx.fillStyle = '#1a202c';
    ctx.fillRect(x - 4, y - 13 + walkBob, 2, 2.5);
    ctx.fillRect(x + 2, y - 13 + walkBob, 2, 2.5);
  } else if (facing === 'left') {
    ctx.fillStyle = '#1a202c';
    ctx.fillRect(x - 5, y - 13 + walkBob, 2, 2.5);
  } else if (facing === 'right') {
    ctx.fillStyle = '#1a202c';
    ctx.fillRect(x + 3, y - 13 + walkBob, 2, 2.5);
  }

  // 4. Haga's Signature Dark Neat Hair (Section 8: Rambut gelap)
  ctx.fillStyle = '#181b22'; // Dark charcoal hair
  ctx.beginPath();
  // Hair cap
  ctx.arc(x, y - 15 + walkBob, 8, Math.PI, 0, false);
  ctx.fill();

  // Bangs / hair fringe
  ctx.beginPath();
  ctx.moveTo(x - 8, y - 15 + walkBob);
  ctx.lineTo(x - 5, y - 11 + walkBob);
  ctx.lineTo(x - 2, y - 14 + walkBob);
  ctx.lineTo(x + 1, y - 10 + walkBob);
  ctx.lineTo(x + 4, y - 13 + walkBob);
  ctx.lineTo(x + 8, y - 15 + walkBob);
  ctx.fill();

  // 5. Seeker Debug Stone glow in hand (Subtle cyan pulse)
  const stoneGlow = Math.sin(tick * 0.12) * 0.3 + 0.7;
  ctx.fillStyle = `rgba(0, 240, 255, ${stoneGlow})`;
  if (facing === 'left') {
    ctx.beginPath();
    ctx.arc(x - 9, y + 1 + walkBob, 2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(x + 9, y + 1 + walkBob, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// Section 3: SEEKER DEBUG VISION ENGINE
// Lapisi kanvas dengan grid semi-transparan hijau fosfor (#00FF88) 32x32
// Lingkaran pemindai berdenyut (radar ring) di sekeliling karakter sprite
function drawDebugVisionEngine(ctx, playerX, playerY, tick) {
  ctx.save();

  // 1. Phosphor Green 32x32 Wireframe Overlay
  ctx.strokeStyle = 'rgba(0, 255, 136, 0.18)';
  ctx.lineWidth = 1;

  const GRID_SIZE = 32;
  const startCol = 0;
  const endCol = MAP_COLS * TILE_SIZE;
  const startRow = 0;
  const endRow = MAP_ROWS * TILE_SIZE;

  ctx.beginPath();
  for (let x = startCol; x <= endCol; x += GRID_SIZE) {
    ctx.moveTo(x, startRow);
    ctx.lineTo(x, endRow);
  }
  for (let y = startRow; y <= endRow; y += GRID_SIZE) {
    ctx.moveTo(startCol, y);
    ctx.lineTo(endCol, y);
  }
  ctx.stroke();

  // 2. Pulsating Radar Scanner Wave around Player Sprite
  const pulseRadius1 = ((tick * 1.5) % 90) + 15;
  const alpha1 = Math.max(0, 1 - pulseRadius1 / 105) * 0.6;
  ctx.strokeStyle = `rgba(0, 255, 136, ${alpha1})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(playerX, playerY, pulseRadius1, 0, Math.PI * 2);
  ctx.stroke();

  const pulseRadius2 = (((tick * 1.5) + 45) % 90) + 15;
  const alpha2 = Math.max(0, 1 - pulseRadius2 / 105) * 0.5;
  ctx.strokeStyle = `rgba(0, 240, 255, ${alpha2})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(playerX, playerY, pulseRadius2, 0, Math.PI * 2);
  ctx.stroke();

  // 3. Player Coordinate Crosshair Reticle
  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  // Target reticle
  ctx.moveTo(playerX - 18, playerY);
  ctx.lineTo(playerX + 18, playerY);
  ctx.moveTo(playerX, playerY - 18);
  ctx.lineTo(playerX, playerY + 18);
  ctx.stroke();

  ctx.fillStyle = '#00ff88';
  ctx.font = 'bold 9px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`HAGA_POS: [${Math.round(playerX)}, ${Math.round(playerY)}]`, playerX + 14, playerY - 14);

  ctx.restore();
}
