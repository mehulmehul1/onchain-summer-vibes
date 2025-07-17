import React from 'react';
import WaveCanvas from './components/WaveCanvas';
import ControlPanel from './components/ControlPanel';
import { usePatternState } from './hooks/usePatternState';
import { useCanvasAnimation } from './hooks/useCanvasAnimation';

const OnchainSummerWaveText: React.FC = () => {
  const patternState = usePatternState();
  const { canvasRef } = useCanvasAnimation({
    patternType: patternState.patternType,
    wavelength: patternState.wavelength,
    speed: patternState.speed,
    threshold: patternState.threshold,
    gradientMode: patternState.gradientMode,
    colors: patternState.colors,
    sourceCount: patternState.sourceCount,
    lineDensity: patternState.lineDensity,
    mandalaComplexity: patternState.mandalaComplexity,
    mandalaSpeed: patternState.mandalaSpeed,
    tileSize: patternState.tileSize,
    tileShiftAmplitude: patternState.tileShiftAmplitude,
    shellRidgeRings: patternState.shellRidgeRings,
    shellRidgeDistortion: patternState.shellRidgeDistortion,
    strokeEnabled: patternState.strokeEnabled,
    strokeWidth: patternState.strokeWidth,
    strokeColor: patternState.strokeColor,
  });

  return (
    <>
      <WaveCanvas canvasRef={canvasRef} backgroundColor={patternState.color4} />
      <ControlPanel 
        patternType={patternState.patternType}
        setPatternType={patternState.setPatternType}
        wavelength={patternState.wavelength}
        setWavelength={patternState.setWavelength}
        speed={patternState.speed}
        setSpeed={patternState.setSpeed}
        threshold={patternState.threshold}
        setThreshold={patternState.setThreshold}
        gradientMode={patternState.gradientMode}
        setGradientMode={patternState.setGradientMode}
        sourceCount={patternState.sourceCount}
        setSourceCount={patternState.setSourceCount}
        lineDensity={patternState.lineDensity}
        setLineDensity={patternState.setLineDensity}
        mandalaComplexity={patternState.mandalaComplexity}
        setMandalaComplexity={patternState.setMandalaComplexity}
        mandalaSpeed={patternState.mandalaSpeed}
        setMandalaSpeed={patternState.setMandalaSpeed}
        tileSize={patternState.tileSize}
        setTileSize={patternState.setTileSize}
        tileShiftAmplitude={patternState.tileShiftAmplitude}
        setTileShiftAmplitude={patternState.setTileShiftAmplitude}
        shellRidgeRings={patternState.shellRidgeRings}
        setShellRidgeRings={patternState.setShellRidgeRings}
        shellRidgeDistortion={patternState.shellRidgeDistortion}
        setShellRidgeDistortion={patternState.setShellRidgeDistortion}
        color1={patternState.color1}
        color2={patternState.color2}
        color3={patternState.color3}
        color4={patternState.color4}
        setColor1={patternState.setColor1}
        setColor2={patternState.setColor2}
        setColor3={patternState.setColor3}
        setColor4={patternState.setColor4}
        setDawnPreset={patternState.setDawnPreset}
        setSunrisePreset={patternState.setSunrisePreset}
        setOceanPreset={patternState.setOceanPreset}
        strokeEnabled={patternState.strokeEnabled}
        setStrokeEnabled={patternState.setStrokeEnabled}
        strokeWidth={patternState.strokeWidth}
        setStrokeWidth={patternState.setStrokeWidth}
        strokeColor={patternState.strokeColor}
        setStrokeColor={patternState.setStrokeColor}
      />
    </>
  );
};

export default OnchainSummerWaveText;