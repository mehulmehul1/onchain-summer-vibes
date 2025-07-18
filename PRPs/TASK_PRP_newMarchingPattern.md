# TASK PRP: New Pattern - Contour Interference

This document outlines the plan to convert a React-based "marching squares" wave interference component into a new, fully integrated `ContourInterferencePattern` class for the `Onchain Summer Vibes` q5.js application.

### Analysis & Deconstruction

The source `WaveInterferenceV5` React component operates by:
1.  **Setup (`useEffect`)**: Defining a set of radial wave sources and initializing canvas dimensions.
2.  **Animation Loop (`animate`)**:
    a. Calculating a 2D `field` of amplitude values based on the interference of all wave sources at a given `time`. This is done on a lower-resolution grid for performance.
    b. Using a "marching squares" algorithm to iterate through the `field` and draw lines (`ctx.moveTo`, `ctx.lineTo`) for specific `contourLevels`.
    c. Using `requestAnimationFrame` to drive the animation.

### Conversion Strategy

The conversion will map the React component's logic to our `PatternRenderer` class structure:

-   **New Class**: `src/patterns/ContourInterferencePattern.js` extending `PatternRenderer`.
-   **`useEffect` Logic**: Maps to the `constructor` and `initialize` methods for setting up default parameters and pre-calculating source positions.
-   **`animate` Logic**: Maps to the `renderPattern(time)` method.
-   **Canvas API (`ctx`)**: All `ctx` drawing commands will be replaced with their q5.js equivalents (e.g., `background()`, `stroke()`, `strokeWeight()`, `line()`).
-   **Parameters**: Key values like `resolution`, `numRings`, `lineWidth`, and colors will be extracted into the `parameters` configuration to make them controllable and randomizable.

---

### Task Structure & Sequencing

#### 1. Core Task: Create the Pattern Class

**Goal**: Create the new `ContourInterferencePattern.js` file and translate the core rendering logic from React/Canvas to q5.js.

**ACTION** Create a new file `c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/patterns/ContourInterferencePattern.js`:
  - **OPERATION**:
    1.  Create a new class `ContourInterferencePattern` that extends `PatternRenderer`.
    2.  In the `constructor`, define default parameters: `resolution: 3`, `numRings: 2`, `sourcesPerRing: 6`, `animationSpeed: 0.5`, `lineWidth: 0.8`. Define default colors for `lineColor` and `backgroundColor`.
    3.  In the `initialize()` method, translate the source generation logic from the React `useEffect` hook. This method should create and store the `this.sources` array based on canvas `width` and `height`. Pre-allocate the `this.field` array here to avoid re-allocation on every frame.
    4.  In the `renderPattern(time)` method, translate the logic from the React `animate` function:
        - Set the background using `background(this.colors.backgroundColor)`.
        - Set line styles using `stroke(this.colors.lineColor)` and `strokeWeight(this.parameters.lineWidth)`.
        - Implement the two main loops: one to calculate the `this.field` values, and the second (marching squares) to draw the contours.
        - **Crucially, replace all `ctx.moveTo`/`ctx.lineTo` pairs with a single `line(x1, y1, x2, y2)` q5.js call.**
  - **VALIDATE**: Temporarily modify `main.js` to instantiate and render *only* this new pattern. Run `npm run dev` and confirm that an animated contour pattern appears on the canvas without errors.
  - **IF_FAIL**:
    -   Check that all `ctx` methods have been replaced.
    -   Verify that the `lerp` and `safeDiv` helper functions were copied correctly into the class.
    -   Ensure `width` and `height` are being read correctly as global q5.js variables.
    -   Log the calculated `field` values to ensure they are not all `NaN` or `0`.
  - **ROLLBACK**: Delete the new file `c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/patterns/ContourInterferencePattern.js`.

---

#### 2. Integration Tasks: Configuration & Factory

**Goal**: Make the new pattern selectable and configurable within the application.

**ACTION** `c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/config/parameters.js`:
  - **OPERATION**: Add a new configuration object for `'ContourInterference'`. Include `slider` controls for `resolution` (with an inverted feel, e.g., low value is high quality), `numRings`, `sourcesPerRing`, and `lineWidth`. Add `color` controls for `lineColor` and `backgroundColor`.
  - **VALIDATE**: After completing the next step, run `npm run dev`, select the "ContourInterference" pattern, and verify its specific controls appear in the UI panel.
  - **IF_FAIL**: Check for syntax errors in the new object. Ensure the key `'ContourInterference'` is unique.
  - **ROLLBACK**: `git checkout -- c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/config/parameters.js`

**ACTION** `c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/patterns/PatternFactory.js`:
  - **OPERATION**: Add `import { ContourInterferencePattern } from './ContourInterferencePattern.js';` at the top of the file. Add a new `case 'ContourInterference':` to the factory's `switch` statement.
  - **VALIDATE**: Run `npm run dev`. Select the new pattern from the UI. The pattern should render, and adjusting its controls in the UI should change the visual output in real-time.
  - **IF_FAIL**: Check the import path. Ensure the `case` string exactly matches the key used in `config/parameters.js`.
  - **ROLLBACK**: `git checkout -- c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/patterns/PatternFactory.js`

---

#### 3. Finalization: Complexity & Performance

**Goal**: Fully integrate the pattern into the project's metadata system and ensure it meets performance standards.

**ACTION** `c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/patterns/ContourInterferencePattern.js`:
  - **OPERATION**: Implement the `calculateComplexity(params)` method. The complexity score should increase as `params.resolution` decreases (since a smaller resolution value means more calculations) and as `params.numRings` and `params.sourcesPerRing` increase.
  - **VALIDATE**: Add test cases to a `test/complexity.test.js` file that instantiate the pattern and assert that the complexity score changes logically with parameter adjustments.
  - **IF_FAIL**: Debug the formula within `calculateComplexity`. Log the input `params` and the output score to trace the logic.
  - **ROLLBACK**: `git checkout -- c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/patterns/ContourInterferencePattern.js`

**ACTION** `c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/patterns/ContourInterferencePattern.js`:
  - **OPERATION**: Conduct a final performance review. Use the browser's profiler to ensure the pattern maintains 60fps with default settings. Pay close attention to the two main loops in `renderPattern`. The performance optimizations from the original React code (low `resolution`, early exit in marching squares) are critical and should be preserved.
  - **VALIDATE**: The animation is smooth with no stuttering on a target machine. The profiler shows the frame time is consistently below 16ms.
  - **IF_FAIL**: The most likely bottleneck is the `resolution` parameter. Ensure its default value is high enough (e.g., 3 or 4) to limit calculations. If still slow, consider further optimizations in the marching squares logic.
  - **ROLLBACK**: Revert any optimization attempts that break the visual or fail to improve performance using `git`.
