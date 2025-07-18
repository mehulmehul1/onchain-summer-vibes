/**
 * AppState.js
 * Defines the initial state of the application. This object holds all the
 * dynamic properties of the generative art piece. It's the "single source of truth"
 * that will be managed by the StateManager.
 */
export const AppState = {
  // General artwork properties
  pattern: 'interference', // The currently active pattern
  theme: 'ocean',          // The currently active color theme

  // Animation properties
  isAnimating: true,
  time: 0,
  frameRate: 60,

  // Pattern-specific parameters. These will be dynamically populated
  // by the StateManager based on the selected pattern.
  params: {
    sources: 3,
    wavelength: 60,
    gradientMode: false
  }
};