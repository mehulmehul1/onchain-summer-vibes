# TASK PRP: Phase 2 Pattern System Conversion & Expansion

This document provides a detailed task breakdown for integrating the remaining original patterns, implementing a complexity system, and ensuring performance for the `Onchain Summer Vibes` project.

### Context Section

```yaml
context:
  docs:
    - url: [q5.js documentation]
      focus: [draw(), setup(), rendering modes (P2D/WEBGL)]
    - url: [highlight.xyz creator documentation]
      focus: [hl-gen.js, token features/traits]

  patterns:
    - file: src/patterns/InterferencePattern.js
      copy: "The existing implementation of InterferencePattern is the template for all other pattern classes."
    - file: config/parameters.js
      copy: "The configuration for 'Interference' is the template for all other pattern parameter definitions."

  gotchas:
    - issue: "q5.js performance can degrade with many objects or complex calculations in the draw() loop."
      fix: "Pre-calculate values in the constructor or on parameter change. Minimize work done per frame. Use WEBGL mode for GPU acceleration where appropriate."
    - issue: "Parameter changes from the UI must trigger a re-render or reset of the pattern state."
      fix: "Ensure the StateManager correctly notifies the AnimationEngine to re-initialize the pattern with new parameters."


Task Structure & Sequencing
1. Setup Tasks: Original Patterns Integration (Task 13)
Goal: Integrate the 4 remaining original patterns into the application's configuration and factory.

ACTION c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/config/parameters.js:

OPERATION: For each of the 4 remaining patterns (Gentle, Mandala, VectorField, ShellRidge), add a new configuration object. This object should define the parameter ranges, types (e.g., 'slider', 'color'), and default values, mirroring the existing 'Interference' pattern's structure.
VALIDATE: Run npm run dev. Open the UI controls panel. Verify that when you select a new pattern, its specific controls appear and are functional.
IF_FAIL: Check for syntax errors (e.g., missing commas) in parameters.js. Ensure the pattern name key matches the one used in PatternFactory.js.
ROLLBACK: git checkout -- c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/config/parameters.js
ACTION c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/patterns/PatternFactory.js:

OPERATION: Add import statements at the top of the file for the GentlePattern, MandalaPattern, VectorFieldPattern, and ShellRidgePattern classes. Add a case for each of the 4 new patterns within the factory's switch statement to enable their instantiation.
VALIDATE: Run npm run dev. Use the UI to switch to each of the 5 patterns. Confirm that each pattern renders on the canvas without throwing console errors.
IF_FAIL: Verify the file paths in the import statements are correct. Double-check that the case string (e.g., 'Mandala') exactly matches the key used in config/parameters.js.
ROLLBACK: git checkout -- c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/patterns/PatternFactory.js
2. Core Changes: Pattern Complexity System (Task 21)
Goal: Implement a system to calculate pattern complexity and expose it as an NFT trait.

ACTION c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/patterns/PatternRenderer.js:

OPERATION: Add a new abstract method calculateComplexity(params) to the PatternRenderer base class. The base implementation should throw an Error('Method not implemented.') to enforce implementation in subclasses.
VALIDATE: After this change, run existing project tests. Expect tests related to pattern instantiation to fail if they don't mock this new method, or for the application to throw the error if a pattern is rendered. This is an expected intermediate failure.
IF_FAIL: This change should be straightforward. A failure likely indicates a syntax error.
ROLLBACK: git checkout -- c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/patterns/PatternRenderer.js
ACTION All pattern files in c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/patterns/:

OPERATION: Implement the calculateComplexity(params) method in all 5 pattern classes (and any others). The method should return a numeric value (e.g., 1-100) based on the computational or visual complexity derived from the params argument. For example, more lines, higher iterations, or smaller particles could increase the complexity score.
VALIDATE: Create a new test file test/complexity.test.js. For each pattern, instantiate it and call calculateComplexity with various parameter sets. Assert that the returned value is a number and changes logically with parameter adjustments.
IF_FAIL: Debug the logic within the specific pattern's calculateComplexity method. Log the input params and the intermediate calculations to trace the source of the incorrect score.
ROLLBACK: git checkout -- c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/patterns/
ACTION c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/blockchain/TokenMetadata.js:

OPERATION: Modify the metadata generation logic. After generating parameters for a token, call the calculateComplexity(params) method on the selected pattern instance. Map the returned numeric score to a descriptive string ('Low', 'Medium', 'High', 'Very High') and add it as a "Complexity" trait to the token's features.
VALIDATE: Update test/complexity.test.js or a metadata-specific test. Generate token metadata and assert that the features object contains a "Complexity" key with one of the expected string values.
IF_FAIL: Ensure the pattern instance and its parameters are correctly retrieved before calling the method. Debug the number-to-string mapping logic to confirm the thresholds are correct.
ROLLBACK: git checkout -- c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/blockchain/TokenMetadata.js
3. Validation: Final Integration & Performance Tuning (Task 22)
Goal: Ensure all patterns perform at 60fps and are visually polished.

ACTION All pattern files in c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/patterns/ and c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/main.js:

OPERATION: Sequentially review and benchmark each of the 5 patterns. Use the browser's performance profiler (Performance tab in DevTools) to record and analyze the frame rate and identify bottlenecks in the draw() loop of any underperforming patterns. Optimize by reducing calculations per frame, pre-calculating values, or simplifying geometry.
VALIDATE: Run a performance test suite (npm run test-performance if it exists) or manually verify in-browser that all patterns maintain a stable 60fps on a target machine.
IF_FAIL: For a slow pattern, analyze the profiler's flame chart to find the most time-consuming function calls. Refactor that specific code. For example, replace new Vector() inside a loop with vector reuse.
ROLLBACK: Use git to manage optimization attempts. If an optimization does not yield significant improvement or introduces visual bugs, revert the specific change.
Validation Strategy
Unit Test: After each file modification, run relevant unit tests. The new test/complexity.test.js will be critical.
Integration Test: After completing Task 13, run npm run dev and manually test the full UI-to-renderer flow for all 5 patterns.
Performance Test: Task 22 is a dedicated performance validation step.
Visual Review: A final visual check of all pattern and theme combinations should be performed before concluding the phase.
Quality Checklist
[x] All 5 original patterns identified for integration.
[x] Dependencies between parameters.js and PatternFactory.js are mapped.
[x] Each task has a specific VALIDATE command or procedure.
[x] ROLLBACK steps using git checkout are included for each action.
[x] IF_FAIL debug strategies are provided for each action.
[x] Performance impact is the central focus of Task 22.
[ ] Security checked (N/A for these specific changes, but good practice).
[ ] No missing edge cases (e.g., what if a pattern has no parameters?).



This detailed plan should guide the development for Phase 2, ensuring each change is focused, validated, and aligned with the project's goals.

<!--
[PROMPT_SUGGESTION]Create the `test/complexity.test.js` file with a basic structure for testing the `InterferencePattern`.[/PROMPT_SUGGESTION]
[PROMPT_SUGGESTION]Show me how to add the `Gentle` pattern to `config/parameters.js` and `PatternFactory.js` as an example.[/PROMPT_SUGGESTION]
-->
```



