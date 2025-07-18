/**
 * parameters.js
 * Centralized configuration for all generative parameters.
 * This file defines the possible range and properties for each parameter
 * of every pattern, which is essential for deterministic random generation.
 */
export const parameterConfig = {
  interference: {
    sources: {
      type: 'int',
      min: 2,
      max: 6,
      step: 1,
      label: 'Wave Sources'
    },
    wavelength: {
      type: 'int',
      min: 20,
      max: 100,
      step: 1,
      label: 'Wavelength'
    },
    speed: {
      type: 'float',
      min: 0.1,
      max: 2.0,
      step: 0.1,
      label: 'Animation Speed'
    },
    gradientMode: {
      type: 'boolean',
      label: 'Gradient Mode'
    }
  },
  // Future patterns will be added here, e.g.:
  // gentle: { ... },
  // mandala: { ... },
};

/**
 * Returns the default parameters for a given pattern.
 * @param {string} patternName - The name of the pattern.
 * @returns {object} An object with default parameter values.
 */
export function getDefaultParams(patternName) {
  const config = parameterConfig[patternName];
  if (!config) return {};

  const defaults = {};
  for (const key in config) {
    // Use the middle of the range as a default for numbers, or false for booleans
    defaults[key] = config[key].type === 'boolean' ? false : (config[key].min + config[key].max) / 2;
    if (config[key].type === 'int') defaults[key] = Math.round(defaults[key]);
  }
  return defaults;
}