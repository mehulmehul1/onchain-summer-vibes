import React from 'react';

interface StrokeControlsProps {
  strokeEnabled: boolean;
  setStrokeEnabled: (enabled: boolean) => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
  strokeColor: string;
  setStrokeColor: (color: string) => void;
}

const StrokeControls: React.FC<StrokeControlsProps> = ({
  strokeEnabled,
  setStrokeEnabled,
  strokeWidth,
  setStrokeWidth,
  strokeColor,
  setStrokeColor,
}) => {
  return (
    <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
      <h4 style={{ 
        margin: '0 0 15px 0', 
        color: '#333',
        fontSize: '14px',
        fontWeight: '600'
      }}>
        Stroke Settings
      </h4>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          color: '#666', 
          cursor: 'pointer',
          userSelect: 'none'
        }}>
          <input
            type="checkbox"
            checked={strokeEnabled}
            onChange={(e) => setStrokeEnabled(e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          Show Outline Stroke
        </label>
      </div>

      {strokeEnabled && (
        <>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>
              Stroke Width: {strokeWidth}
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
            <input
              type="color"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              style={{ width: '100%', height: '35px', border: 'none', borderRadius: '6px' }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default StrokeControls;
