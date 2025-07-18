import { stateManager } from '../StateManager.js';

/**
 * AnimationEngine.js
 * Converts the logic from the `useCanvasAnimation` React hook into a standalone class.
 * It manages the main draw loop, time progression, and orchestrates the rendering
 * of patterns.
 */
export class AnimationEngine {
  /**
   * @param {object} q - The q5.js instance.
   * @param {object} patternFactory - An instance of PatternFactory to get renderers.
   * @param {object} themeManager - An instance of ThemeManager to get colors.
   */
  constructor(q, patternFactory, themeManager) {
    this.q = q;
    // These will be wired up in later tasks
    this.patternFactory = patternFactory;
    this.themeManager = themeManager;
    this.lastTime = 0;
  }

  /**
   * Initializes the engine. Call this in the q5.js setup() function.
   */
  setup() {
    this.lastTime = this.q.millis();
    stateManager.updateState({ time: 0 });
  }

  /**
   * The main run loop, called from q5.js's draw() function.
   */
  run() {
    const state = stateManager.getState();
    if (!state.isAnimating) return;

    this.updateTime();
    this.drawScene(state);
  }

  /**
   * Calculates delta time and updates the global time state.
   * This replaces the requestAnimationFrame time management.
   */
  updateTime() {
    const currentTime = this.q.millis();
    const deltaTime = (currentTime - this.lastTime) / 1000.0; // Time in seconds
    this.lastTime = currentTime;
    
    const newTime = stateManager.getState().time + deltaTime;
    stateManager.updateState({ time: newTime });
  }

  /**
   * Orchestrates the drawing of the current pattern and theme.
   * (This will be fully functional after the Pattern and Theme tasks).
   * @param {object} state - The current application state.
   */
  drawScene(state) {
    // Placeholder: Set a default background color
    this.q.background(20, 20, 30);
    // In future tasks, this will get the theme and pattern renderer
    // and call patternRenderer.render(...).
  }
}