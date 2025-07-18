import { AppState } from './AppState.js';

/**
 * StateManager.js
 * Manages the application's state, including updates and randomization.
 * This class replaces the role of React's state hooks.
 */
class StateManager {
  constructor() {
    this.state = { ...AppState };
  }

  /**
   * Returns a copy of the current state.
   * @returns {object} The current application state.
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Updates one or more properties of the state.
   * @param {object} newState - An object with key-value pairs to update.
   */
  updateState(newState) {
    this.state = { ...this.state, ...newState };
    // In a more complex app, we might emit an event here for observers.
    console.log('State updated:', this.state);
  }

  /**
   * Randomizes the parameters for a given pattern using simple random values
   * @param {string} patternName - The name of the pattern to generate parameters for.
   */
  randomizeParameters(patternName) {
    // Simple randomization without external dependencies
    const randomParams = {
      wavelength: Math.random() * 100 + 20,
      amplitude: Math.random() * 50 + 10,
      frequency: Math.random() * 0.02 + 0.01,
      speed: Math.random() * 2 + 0.5
    };
    
    this.updateState({ params: randomParams });
    console.log(`Randomized parameters for ${patternName}:`, randomParams);
  }
}

// Export a single instance to act as a singleton
export const stateManager = new StateManager();