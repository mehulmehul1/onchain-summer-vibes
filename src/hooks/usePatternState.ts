import { useState } from 'react';
import { DEFAULT_VALUES, PATTERN_TYPES, THEME_PRESETS } from '../constants/patternConfig';
import type { PatternType } from '../constants/patternConfig';

export const usePatternState = () => {
  const [wavelength, setWavelength] = useState(DEFAULT_VALUES.wavelength);
  const [speed, setSpeed] = useState(DEFAULT_VALUES.speed);
  const [threshold, setThreshold] = useState(DEFAULT_VALUES.threshold);
  const [gradientMode, setGradientMode] = useState(DEFAULT_VALUES.gradientMode);
  const [patternType, setPatternType] = useState<PatternType>(PATTERN_TYPES.INTERFERENCE);
  const [color1, setColor1] = useState(DEFAULT_VALUES.colors.color1);
  const [color2, setColor2] = useState(DEFAULT_VALUES.colors.color2);
  const [color3, setColor3] = useState(DEFAULT_VALUES.colors.color3);
  const [color4, setColor4] = useState(DEFAULT_VALUES.colors.color4);
  const [sourceCount, setSourceCount] = useState(DEFAULT_VALUES.sourceCount);
  const [lineDensity, setLineDensity] = useState(DEFAULT_VALUES.lineDensity);
  const [mandalaComplexity, setMandalaComplexity] = useState(DEFAULT_VALUES.mandalaComplexity);
  const [mandalaSpeed, setMandalaSpeed] = useState(DEFAULT_VALUES.mandalaSpeed);
  const [strokeEnabled, setStrokeEnabled] = useState(DEFAULT_VALUES.strokeEnabled);
  const [strokeWidth, setStrokeWidth] = useState(DEFAULT_VALUES.strokeWidth);
  const [strokeColor, setStrokeColor] = useState(DEFAULT_VALUES.strokeColor);
  const [tileSize, setTileSize] = useState(DEFAULT_VALUES.tileSize);
  const [tileShiftAmplitude, setTileShiftAmplitude] = useState(DEFAULT_VALUES.tileShiftAmplitude);
  const [shellRidgeRings, setShellRidgeRings] = useState(DEFAULT_VALUES.shellRidgeRings);
  const [shellRidgeDistortion, setShellRidgeDistortion] = useState(DEFAULT_VALUES.shellRidgeDistortion);

  const colors = { color1, color2, color3, color4 };

  const setDawnPreset = () => {
    setColor1(THEME_PRESETS.dawn.color1);
    setColor2(THEME_PRESETS.dawn.color2);
    setColor3(THEME_PRESETS.dawn.color3);
    setColor4(THEME_PRESETS.dawn.color4);
    setGradientMode(true);
  };

  const setSunrisePreset = () => {
    setColor1(THEME_PRESETS.sunrise.color1);
    setColor2(THEME_PRESETS.sunrise.color2);
    setColor3(THEME_PRESETS.sunrise.color3);
    setColor4(THEME_PRESETS.sunrise.color4);
    setGradientMode(true);
  };

  const setOceanPreset = () => {
    setColor1(THEME_PRESETS.ocean.color1);
    setColor2(THEME_PRESETS.ocean.color2);
    setColor3(THEME_PRESETS.ocean.color3);
    setColor4(THEME_PRESETS.ocean.color4);
    setGradientMode(true);
  };

  return {
    wavelength, setWavelength,
    speed, setSpeed,
    threshold, setThreshold,
    gradientMode, setGradientMode,
    patternType, setPatternType,
    color1, setColor1,
    color2, setColor2,
    color3, setColor3,
    color4, setColor4,
    colors,
    sourceCount, setSourceCount,
    lineDensity, setLineDensity,
    mandalaComplexity, setMandalaComplexity,
    mandalaSpeed, setMandalaSpeed,
    tileSize, setTileSize,
    tileShiftAmplitude, setTileShiftAmplitude,
    shellRidgeRings, setShellRidgeRings,
    shellRidgeDistortion, setShellRidgeDistortion,
    strokeEnabled, setStrokeEnabled,
    strokeWidth, setStrokeWidth,
    strokeColor, setStrokeColor,
    setDawnPreset,
    setSunrisePreset,
    setOceanPreset
  };
};