import React from 'react';

interface StrokeControlsProps {
  strokeEnabled: boolean;
  setStrokeEnabled: (value: boolean) => void;
  strokeWidth: number;
  setStrokeWidth: (value: number) => void;
  strokeColor: string;
  setStrokeColor: (color: string) => void;
}

const StrokeControls: React.FC<StrokeControlsProps> = ({
  strokeEnabled,
  setStrokeEnabled,
  strokeWidth,
  setStrokeWidth,
  strokeColor,
  setStrokeColor
}) => {
  return (
    <div style={{ marginBottom: '30px' }}>
      <h4 style={{ 
        margin: '0 0 15px 0', 
        color: '#333',
        fontSize: '16px',
        fontWeight: '600'
      }}>
        Text Stroke
      </h4>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'flex', alignItems: 'center', color: '#666', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={strokeEnabled}
            onChange={(e) => setStrokeEnabled(e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          Show Stroke Outline
        </label>
      </div>

      {strokeEnabled && (
        <>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>
              Stroke Width: {strokeWidth}px
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>
              Stroke Color
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                style={{
                  width: '40px',
                  height: '30px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              />
              <span style={{ fontSize: '12px', color: '#666' }}>{strokeColor}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StrokeControls;