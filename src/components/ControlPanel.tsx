import React, { useState, useEffect } from 'react';
import PatternControls from './PatternControls';
import ThemeControls from './ThemeControls';
import StrokeControls from './StrokeControls';
import type { PatternType } from '../constants/patternConfig';

interface ControlPanelProps {
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
  strokeEnabled: boolean;
  setStrokeEnabled: (value: boolean) => void;
  strokeWidth: number;
  setStrokeWidth: (value: number) => void;
  strokeColor: string;
  setStrokeColor: (color: string) => void;
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

const ControlPanel: React.FC<ControlPanelProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  // Keyboard shortcut to toggle panel
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
      if (event.key === 'c' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        togglePanel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={togglePanel}
        title={isOpen ? "Close controls (Esc)" : "Open controls (Ctrl/Cmd + C)"}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          width: '50px',
          height: '50px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
          transition: 'all 0.3s ease',
          zIndex: 1001
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {isOpen ? '×' : '⚙️'}
      </button>

      {/* Sidebar Panel */}
      <div
        style={{
          position: 'fixed',
          top: '0',
          right: isOpen ? '0' : '-400px',
          width: '400px',
          height: '100vh',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          boxShadow: isOpen ? '-4px 0 20px rgba(0,0,0,0.15)' : 'none',
          transition: 'right 0.3s ease',
          zIndex: 1000,
          overflowY: 'auto',
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px'
        }}
      >
        <div style={{ padding: '80px 20px 20px 20px' }}>
          <h3 style={{ 
            margin: '0 0 20px 0', 
            color: '#333',
            fontSize: '20px',
            fontWeight: '600'
          }}>
            Pattern Controls
          </h3>
          
          <PatternControls
            patternType={props.patternType}
            setPatternType={props.setPatternType}
            wavelength={props.wavelength}
            setWavelength={props.setWavelength}
            speed={props.speed}
            setSpeed={props.setSpeed}
            threshold={props.threshold}
            setThreshold={props.setThreshold}
            gradientMode={props.gradientMode}
            setGradientMode={props.setGradientMode}
            sourceCount={props.sourceCount}
            setSourceCount={props.setSourceCount}
            lineDensity={props.lineDensity}
            setLineDensity={props.setLineDensity}
            mandalaComplexity={props.mandalaComplexity}
            setMandalaComplexity={props.setMandalaComplexity}
            mandalaSpeed={props.mandalaSpeed}
            setMandalaSpeed={props.setMandalaSpeed}
            tileSize={props.tileSize}
            setTileSize={props.setTileSize}
            tileShiftAmplitude={props.tileShiftAmplitude}
            setTileShiftAmplitude={props.setTileShiftAmplitude}
            shellRidgeRings={props.shellRidgeRings}
            setShellRidgeRings={props.setShellRidgeRings}
            shellRidgeDistortion={props.shellRidgeDistortion}
            setShellRidgeDistortion={props.setShellRidgeDistortion}
          />

          <StrokeControls
            strokeEnabled={props.strokeEnabled}
            setStrokeEnabled={props.setStrokeEnabled}
            strokeWidth={props.strokeWidth}
            setStrokeWidth={props.setStrokeWidth}
            strokeColor={props.strokeColor}
            setStrokeColor={props.setStrokeColor}
          />

          <ThemeControls
            color1={props.color1}
            color2={props.color2}
            color3={props.color3}
            color4={props.color4}
            setColor1={props.setColor1}
            setColor2={props.setColor2}
            setColor3={props.setColor3}
            setColor4={props.setColor4}
            setDawnPreset={props.setDawnPreset}
            setSunrisePreset={props.setSunrisePreset}
            setOceanPreset={props.setOceanPreset}
          />
        </div>
      </div>

      {/* Overlay when sidebar is open */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 999,
            transition: 'opacity 0.3s ease'
          }}
          onClick={togglePanel}
        />
      )}
    </>
  );
};

export default ControlPanel;