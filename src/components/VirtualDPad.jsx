import React from 'react';
import { sound } from '../utils/audio';

export const VirtualDPad = ({ onDirectionChange, onAction }) => {
  const handleTouchStart = (dir) => (e) => {
    e.preventDefault();
    onDirectionChange(dir, true);
    sound.playBlip();
  };

  const handleTouchEnd = (dir) => (e) => {
    e.preventDefault();
    onDirectionChange(dir, false);
  };

  const handleAction = (e) => {
    e.preventDefault();
    sound.playSelect();
    onAction();
  };

  return (
    <div className="virtual-dpad-container" aria-label="Kontrol D-Pad Layar Sentuh">
      {/* Direction Cross */}
      <div className="dpad-cross">
        <button
          className="dpad-btn dpad-up"
          type="button"
          onTouchStart={handleTouchStart('up')}
          onTouchEnd={handleTouchEnd('up')}
          onMouseDown={() => onDirectionChange('up', true)}
          onMouseUp={() => onDirectionChange('up', false)}
          aria-label="Bergerak ke Atas"
        >
          ▲
        </button>

        <div className="dpad-middle-row">
          <button
            className="dpad-btn dpad-left"
            type="button"
            onTouchStart={handleTouchStart('left')}
            onTouchEnd={handleTouchEnd('left')}
            onMouseDown={() => onDirectionChange('left', true)}
            onMouseUp={() => onDirectionChange('left', false)}
            aria-label="Bergerak ke Kiri"
          >
            ◀
          </button>
          
          <div className="dpad-center-hub" />

          <button
            className="dpad-btn dpad-right"
            type="button"
            onTouchStart={handleTouchStart('right')}
            onTouchEnd={handleTouchEnd('right')}
            onMouseDown={() => onDirectionChange('right', true)}
            onMouseUp={() => onDirectionChange('right', false)}
            aria-label="Bergerak ke Kanan"
          >
            ▶
          </button>
        </div>

        <button
          className="dpad-btn dpad-down"
          type="button"
          onTouchStart={handleTouchStart('down')}
          onTouchEnd={handleTouchEnd('down')}
          onMouseDown={() => onDirectionChange('down', true)}
          onMouseUp={() => onDirectionChange('down', false)}
          aria-label="Bergerak ke Bawah"
        >
          ▼
        </button>
      </div>

      {/* Action / Interact Button */}
      <div className="dpad-action-wrapper">
        <button
          className="dpad-action-btn"
          type="button"
          onTouchStart={handleAction}
          onClick={handleAction}
          aria-label="Tombol Aksi Interaksi"
        >
          <span>E</span>
          <small>ACTION</small>
        </button>
      </div>
    </div>
  );
};
