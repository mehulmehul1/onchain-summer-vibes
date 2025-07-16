import React from 'react';

interface ThemeControlsProps {
  color1: string;
  color2: string;
  color3: string;
  color4: string;
  setColor1: (color: string) => void;
  setColor2: (color: string) => void;
  setColor3: (color: string) => void;
  setColor4: (color: string) => void;
  setDawnPreset: () => void;
  setSunrisePreset: () => void;
  setOceanPreset: () => void;
}

const ThemeControls: React.FC<ThemeControlsProps> = ({
  color1, color2, color3, color4,
  setColor1, setColor2, setColor3, setColor4,
  setDawnPreset, setSunrisePreset, setOceanPreset
}) => {
  const buttonStyle = {
    padding: '8px 12px',
    fontSize: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    backgroundColor: '#f8f9fa',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap' as const
  };

  return (
    <>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontWeight: 'bold' }}>
          Theme Presets
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={setDawnPreset} style={buttonStyle}>Dawn</button>
          <button onClick={setSunrisePreset} style={buttonStyle}>Sunrise</button>
          <button onClick={setOceanPreset} style={buttonStyle}>Ocean</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontSize: '12px' }}>
            Primary
          </label>
          <input
            type="color"
            value={color1}
            onChange={(e) => setColor1(e.target.value)}
            style={{ width: '100%', height: '35px', border: 'none', borderRadius: '6px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontSize: '12px' }}>
            Secondary
          </label>
          <input
            type="color"
            value={color2}
            onChange={(e) => setColor2(e.target.value)}
            style={{ width: '100%', height: '35px', border: 'none', borderRadius: '6px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontSize: '12px' }}>
            Accent
          </label>
          <input
            type="color"
            value={color3}
            onChange={(e) => setColor3(e.target.value)}
            style={{ width: '100%', height: '35px', border: 'none', borderRadius: '6px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontSize: '12px' }}>
            Background
          </label>
          <input
            type="color"
            value={color4}
            onChange={(e) => setColor4(e.target.value)}
            style={{ width: '100%', height: '35px', border: 'none', borderRadius: '6px' }}
          />
        </div>
      </div>
    </>
  );
};

export default ThemeControls;