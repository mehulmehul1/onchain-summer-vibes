import React from 'react';
import { PATTERN_TYPES } from '../constants/patternConfig';
import type { PatternType } from '../constants/patternConfig';

interface PatternControlsProps {
  patternType: PatternType;
  setPatternType: (type: PatternType) => void;
  wavelength: number;
  setWavelength: (value: number) => void;
  speed: number;
  setSpeed: (value: number) => void;
  threshold: number;
  setThreshold: (value: number) => void;
  gradientMode: boolean;
  setGradientMode: (value: boolean) => void;
  sourceCount: number;
  setSourceCount: (value: number) => void;
  lineDensity: number;
  setLineDensity: (value: number) => void;
  mandalaComplexity: number;
  setMandalaComplexity: (value: number) => void;
  mandalaSpeed: number;
  setMandalaSpeed: (value: number) => void;
  tileSize: number;
  setTileSize: (value: number) => void;
  tileShiftAmplitude: number;
  setTileShiftAmplitude: (value: number) => void;
  shellRidgeRings: number;
  setShellRidgeRings: (value: number) => void;
  shellRidgeDistortion: number;
  setShellRidgeDistortion: (value: number) => void;
}

const PatternControls: React.FC<PatternControlsProps> = ({
  patternType, setPatternType,
  wavelength, setWavelength,
  speed, setSpeed,
  threshold, setThreshold,
  gradientMode, setGradientMode,
  sourceCount, setSourceCount,
  lineDensity, setLineDensity,
  mandalaComplexity, setMandalaComplexity,
  mandalaSpeed, setMandalaSpeed,
  tileSize, setTileSize,
  tileShiftAmplitude, setTileShiftAmplitude,
  shellRidgeRings, setShellRidgeRings,
  shellRidgeDistortion, setShellRidgeDistortion
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

  const getWavelengthLabel = () => {
    switch (patternType) {
      case PATTERN_TYPES.INTERFERENCE:
        return 'Wavelength';
      case PATTERN_TYPES.GENTLE:
        return 'Flow Scale';
      case PATTERN_TYPES.MANDALA:
        return 'Base Size';
      case PATTERN_TYPES.VECTOR_FIELD:
        return 'Flow Scale';
      case PATTERN_TYPES.SHELL_RIDGE:
        return 'Base Scale';
      default:
        return 'Wavelength';
    }
  };

  return (
    <>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontWeight: 'bold' }}>
          Pattern Type
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setPatternType(PATTERN_TYPES.INTERFERENCE)}
            style={{
              ...buttonStyle,
              backgroundColor: patternType === PATTERN_TYPES.INTERFERENCE ? '#007ACC' : '#f8f9fa',
              color: patternType === PATTERN_TYPES.INTERFERENCE ? 'white' : '#333'
            }}
          >
            Interference (Paradox)
          </button>
          <button
            onClick={() => setPatternType(PATTERN_TYPES.GENTLE)}
            style={{
              ...buttonStyle,
              backgroundColor: patternType === PATTERN_TYPES.GENTLE ? '#007ACC' : '#f8f9fa',
              color: patternType === PATTERN_TYPES.GENTLE ? 'white' : '#333'
            }}
          >
            Gentle (Natural)
          </button>
          <button
            onClick={() => setPatternType(PATTERN_TYPES.MANDALA)}
            style={{
              ...buttonStyle,
              backgroundColor: patternType === PATTERN_TYPES.MANDALA ? '#007ACC' : '#f8f9fa',
              color: patternType === PATTERN_TYPES.MANDALA ? 'white' : '#333'
            }}
          >
            Mandala (Wisdom)
          </button>
          <button
            onClick={() => setPatternType(PATTERN_TYPES.VECTOR_FIELD)}
            style={{
              ...buttonStyle,
              backgroundColor: patternType === PATTERN_TYPES.VECTOR_FIELD ? '#007ACC' : '#f8f9fa',
              color: patternType === PATTERN_TYPES.VECTOR_FIELD ? 'white' : '#333'
            }}
          >
            Vector Field (Flow)
          </button>
          <button
            onClick={() => setPatternType(PATTERN_TYPES.SHELL_RIDGE)}
            style={{
              ...buttonStyle,
              backgroundColor: patternType === PATTERN_TYPES.SHELL_RIDGE ? '#007ACC' : '#f8f9fa',
              color: patternType === PATTERN_TYPES.SHELL_RIDGE ? 'white' : '#333'
            }}
          >
            Shell Ridge (Textured)
          </button>
        </div>
      </div>

      {patternType === PATTERN_TYPES.INTERFERENCE && (
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', color: '#666', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={gradientMode}
              onChange={(e) => setGradientMode(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            Gradient Mode
          </label>
        </div>
      )}

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>
          {getWavelengthLabel()}: {wavelength}
        </label>
        <input
          type="range"
          min="10"
          max="80"
          value={wavelength}
          onChange={(e) => setWavelength(Number(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>
          Speed: {speed.toFixed(3)}
        </label>
        <input
          type="range"
          min="0.001"
          max="0.1"
          step="0.001"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      {patternType === PATTERN_TYPES.INTERFERENCE && !gradientMode && (
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>
            Line Thickness: {threshold.toFixed(3)}
          </label>
          <input
            type="range"
            min="0.01"
            max="0.5"
            step="0.01"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      )}

      {patternType === PATTERN_TYPES.INTERFERENCE && (
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>
            Wave Sources: {sourceCount}
          </label>
          <input
            type="range"
            min="1"
            max="15"
            value={sourceCount}
            onChange={(e) => setSourceCount(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      )}

      {patternType === PATTERN_TYPES.GENTLE && (
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>
            Line Density: {lineDensity}
          </label>
          <input
            type="range"
            min="10"
            max="80"
            value={lineDensity}
            onChange={(e) => setLineDensity(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      )}

      {patternType === PATTERN_TYPES.MANDALA && (
        <>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>
              Mandala Complexity: {mandalaComplexity}
            </label>
            <input
              type="range"
              min="3"
              max="12"
              value={mandalaComplexity}
              onChange={(e) => setMandalaComplexity(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>
              Breathing Speed: {mandalaSpeed.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.2"
              max="3.0"
              step="0.1"
              value={mandalaSpeed}
              onChange={(e) => setMandalaSpeed(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </>
      )}

      {patternType === PATTERN_TYPES.VECTOR_FIELD && (
        <>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>
              Tile Size: {tileSize}
            </label>
            <input
              type="range"
              min="20"
              max="100"
              value={tileSize}
              onChange={(e) => setTileSize(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>
              Tile Shift Amplitude: {tileShiftAmplitude}
            </label>
            <input
              type="range"
              min="5"
              max="20"
              value={tileShiftAmplitude}
              onChange={(e) => setTileShiftAmplitude(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </>
      )}

      {patternType === PATTERN_TYPES.SHELL_RIDGE && (
        <>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>
              Ridge Rings: {shellRidgeRings}
            </label>
            <input
              type="range"
              min="3"
              max="15"
              value={shellRidgeRings}
              onChange={(e) => setShellRidgeRings(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>
              Texture Distortion: {shellRidgeDistortion.toFixed(1)}
            </label>
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.1"
              value={shellRidgeDistortion}
              onChange={(e) => setShellRidgeDistortion(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </>
      )}
    </>
  );
};

export default PatternControls;