# Pattern Documentation and Variable Analysis PRP

## Goal
Create comprehensive documentation of all wave pattern generators in the onchain-summer-vibes project, catalog all controllable variables, analyze randomization potential, and establish a systematic approach for adding new patterns.

## Why
- **Pattern Library Management**: Need centralized documentation of all pattern types and their capabilities
- **Variable Control System**: Understanding all controllable parameters enables better randomization and user control
- **Development Workflow**: Standardized process for converting React TypeScript patterns to q5.js
- **NFT Generation**: Complete variable catalog enables sophisticated trait generation and rarity distribution
- **Future Expansion**: Documentation framework supports adding unlimited new patterns

## What - User-Visible Behavior
1. **Complete Pattern Catalog**: Documentation of all 5+ pattern types with visual examples
2. **Variable Reference Guide**: Comprehensive list of all controllable parameters with ranges and effects
3. **Randomization Matrix**: Analysis of which variables can be randomized for NFT generation
4. **Integration Workflow**: Step-by-step process for adding new patterns from React TypeScript files
5. **Theme Compatibility**: How each pattern responds to different color themes

## All Needed Context

### Current Codebase Architecture
```
src/
├── patterns/
│   ├── GentlePattern.js (✅ Implemented)
│   ├── MandalaPattern.js (✅ Implemented)
│   ├── VectorFieldPattern.js (✅ Implemented)
│   ├── ShellRidgePattern.js (✅ Implemented)
│   └── Q5App-minimal.js (interference pattern built-in)
├── ui/
│   ├── ControlPanel.js (✅ Apple-like side-by-side design)
│   ├── PatternControls.js (✅ Dynamic pattern switching)
│   └── ThemeControls.js (✅ 5 theme presets + custom colors)
├── constants/
│   └── patternConfig.js (✅ Configuration and defaults)
└── core/
    └── Q5App-minimal.js (✅ Main application with pattern switching)
```

### Pattern Architecture
- **Pattern Classes**: Each pattern is a JavaScript class with `render(ctx, time, width, height, colors, options)` method
- **Canvas 2D API**: All patterns use pure Canvas 2D for maximum compatibility
- **SVG Masking**: All patterns are clipped to the "Onchain Summer" logo shape
- **Theme Integration**: All patterns respond to 4-color themes (primary, secondary, accent, background)
- **Real-time Controls**: All parameters can be adjusted in real-time via UI controls

### Current Pattern Types
1. **Interference Pattern** (built into Q5App-minimal.js)
2. **Gentle Pattern** (flowing sinusoidal lines)
3. **Mandala Pattern** (geometric breathing mandala)
4. **Vector Field Pattern** (particle flow system)
5. **Shell Ridge Pattern** (concentric textured rings)

### Theme System
- **5 Theme Presets**: Dawn, Ocean, Forest, Sunset, Midnight
- **Custom Colors**: 4-color picker system (primary, secondary, accent, background)
- **Real-time Updates**: All patterns update instantly when themes change

### Configuration System
- **Central Config**: `src/constants/patternConfig.js` contains all defaults and ranges
- **Pattern Types**: Enum-based pattern type system
- **Default Values**: Standardized default values for all parameters
- **Theme Presets**: Pre-configured color palettes

## Implementation Blueprint

### Task 1: Complete Pattern Analysis
1. **Analyze Each Pattern Type**:
   ```javascript
   // For each pattern (Interference, Gentle, Mandala, VectorField, ShellRidge):
   - Document primary visual characteristics
   - List all controllable parameters with ranges
   - Identify randomization potential (high/medium/low impact)
   - Note theme responsiveness level
   - Catalog computational complexity
   ```

2. **Variable Classification System**:
   ```javascript
   // Classify each variable by:
   - Parameter Type: slider, checkbox, dropdown, color
   - Impact Level: high, medium, low (visual change magnitude)
   - Randomization Suitability: excellent, good, fair, poor
   - NFT Trait Potential: primary, secondary, modifier, technical
   - Performance Impact: heavy, moderate, light, none
   ```

3. **Create Parameter Matrix**:
   ```markdown
   | Pattern | Parameter | Type | Range | Default | Impact | Randomizable | NFT Trait |
   |---------|-----------|------|-------|---------|--------|--------------|-----------|
   | Interference | sourceCount | slider | 1-20 | 9 | high | excellent | primary |
   | Interference | wavelength | slider | 10-100 | 25 | high | excellent | primary |
   | Gentle | lineDensity | slider | 10-100 | 35 | high | excellent | primary |
   | Mandala | complexity | slider | 2-20 | 6 | high | excellent | primary |
   | ... | ... | ... | ... | ... | ... | ... | ... |
   ```

### Task 2: Pattern-to-Variable Mapping
1. **Document Variable Dependencies**:
   ```javascript
   // Map which patterns use which variables:
   patternVariableMap = {
     interference: ['sourceCount', 'wavelength', 'speed', 'threshold', 'gradientMode'],
     gentle: ['lineDensity', 'wavelength', 'speed'],
     mandala: ['mandalaComplexity', 'mandalaSpeed'],
     vectorfield: ['tileSize', 'tileShiftAmplitude'],
     shellridge: ['shellRidgeRings', 'shellRidgeDistortion']
   }
   ```

2. **Identify Cross-Pattern Variables**:
   ```javascript
   // Variables used by multiple patterns:
   universalVariables = ['speed', 'wavelength', 'gradientMode']
   patternSpecificVariables = ['sourceCount', 'lineDensity', 'mandalaComplexity', ...]
   ```

### Task 3: Randomization Analysis
1. **Randomization Impact Assessment**:
   ```javascript
   // For each variable, document:
   - Visual impact when randomized (dramatic/subtle/none)
   - Recommended randomization ranges (subset of full range)
   - Probability distributions (uniform/weighted/stepped)
   - Aesthetic quality thresholds (min/max for good output)
   ```

2. **NFT Trait Generation Strategy**:
   ```javascript
   // Define trait categories:
   primaryTraits = ['pattern_type', 'theme', 'complexity_level']
   secondaryTraits = ['animation_speed', 'density', 'texture']
   modifierTraits = ['special_effects', 'color_variations']
   technicalTraits = ['performance_mode', 'quality_level']
   ```

### Task 4: Pattern Conversion Workflow
1. **Standardized Conversion Process**:
   ```markdown
   ## Converting React TypeScript Pattern to q5.js

   ### Step 1: Analysis
   - Read original .tsx pattern file
   - Identify all React hooks and state dependencies
   - Map ImageData operations to Canvas 2D equivalents
   - Note any external library dependencies

   ### Step 2: Conversion
   - Create new .js file in src/patterns/
   - Convert React component to ES6 class
   - Replace React hooks with class properties
   - Convert ImageData to Canvas 2D operations
   - Update color handling to RGB arrays

   ### Step 3: Integration
   - Add pattern to Q5App-minimal.js patterns object
   - Update PatternControls.js with new controls
   - Add pattern type to patternConfig.js
   - Test with all theme presets

   ### Step 4: Validation
   - Verify pattern renders correctly
   - Test all parameter controls
   - Confirm theme responsiveness
   - Performance test (maintain 60fps)
   ```

2. **Code Template**:
   ```javascript
   // Template for new pattern classes:
   export class NewPattern {
     constructor() {
       this.name = 'New Pattern';
       this.type = 'newpattern';
     }
     
     render(ctx, time, width, height, colors, options = {}) {
       const { param1 = defaultValue1, param2 = defaultValue2 } = options;
       
       // Clear canvas
       ctx.fillStyle = `rgb(${colors.background[0]}, ${colors.background[1]}, ${colors.background[2]})`;
       ctx.fillRect(0, 0, width, height);
       
       // Pattern rendering logic here
       // Use colors.primary, colors.secondary, colors.accent for theming
     }
   }
   ```

### Task 5: Documentation Structure
1. **Create Pattern Documentation Template**:
   ```markdown
   # Pattern Name

   ## Visual Description
   Brief description of what the pattern looks like and its key characteristics.

   ## Parameters
   | Parameter | Type | Range | Default | Description | Randomization |
   |-----------|------|-------|---------|-------------|---------------|
   | param1 | slider | 1-100 | 25 | Controls X aspect | Excellent |

   ## Theme Responsiveness
   - Primary Color: Used for main elements
   - Secondary Color: Used for accents
   - Accent Color: Used for highlights
   - Background Color: Canvas background

   ## Performance Notes
   - Computational complexity: Low/Medium/High
   - Frame rate impact: Minimal/Moderate/Significant
   - Memory usage: Low/Medium/High

   ## NFT Traits
   - Primary Traits: List of main characteristics
   - Secondary Traits: Supporting variations
   - Rarity Factors: What makes outputs rare

   ## Code Location
   - Pattern Class: src/patterns/PatternName.js
   - Controls: Integrated in PatternControls.js
   - Config: src/constants/patternConfig.js
   ```

## Validation Loop

### Level 1: Documentation Completeness
```bash
# Verify all patterns documented
node -e "
const patterns = ['interference', 'gentle', 'mandala', 'vectorfield', 'shellridge'];
const docs = ['PRPs/patterns/'];
console.log('Documented patterns:', patterns.length);
console.log('Missing documentation:', patterns.filter(p => !docs.includes(p)));
"
```

### Level 2: Variable Catalog Accuracy
```bash
# Verify variable catalog matches implementation
node -e "
const config = require('./src/constants/patternConfig.js');
const documented = require('./PRPs/PATTERN_VARIABLES.json');
console.log('Config variables:', Object.keys(config.DEFAULT_VALUES).length);
console.log('Documented variables:', Object.keys(documented).length);
"
```

### Level 3: Pattern Integration Testing
```bash
# Test pattern switching and controls
npm run test-pattern
npm run build
npm run dev
# Manual verification: All 5 patterns switch correctly with all controls functional
```

### Level 4: Randomization Validation
```javascript
// Test randomization ranges produce good outputs
const testRandomization = () => {
  const patterns = ['interference', 'gentle', 'mandala', 'vectorfield', 'shellridge'];
  const results = patterns.map(pattern => {
    const randomParams = generateRandomParameters(pattern);
    return { pattern, quality: assessVisualQuality(randomParams) };
  });
  return results.every(r => r.quality >= 'acceptable');
};
```

## Checklist
- [ ] Complete visual analysis of all 5 pattern types
- [ ] Catalog all 25+ controllable variables with ranges and defaults
- [ ] Classify variables by impact level and randomization suitability
- [ ] Create pattern-to-variable mapping matrix
- [ ] Document NFT trait generation strategy for each pattern
- [ ] Establish standardized pattern conversion workflow
- [ ] Create code templates for new pattern integration
- [ ] Write comprehensive documentation for each pattern
- [ ] Test randomization ranges for aesthetic quality
- [ ] Validate all patterns work with all 5 theme presets
- [ ] Confirm 60fps performance across all patterns and devices
- [ ] Document computational complexity and performance characteristics

## Expected Deliverables
1. **`PRPs/PATTERN_LIBRARY.md`** - Complete pattern documentation
2. **`PRPs/VARIABLE_CATALOG.json`** - Machine-readable variable definitions
3. **`PRPs/RANDOMIZATION_MATRIX.md`** - NFT generation strategy
4. **`PRPs/PATTERN_CONVERSION_WORKFLOW.md`** - Developer guide
5. **`PRPs/patterns/`** - Individual pattern documentation files

## Success Criteria
- All current patterns fully documented with visual examples
- Complete variable catalog with 100% accuracy
- Randomization strategy produces high-quality outputs 95% of the time
- Pattern conversion workflow tested with new pattern addition
- Documentation supports unlimited pattern expansion
- Performance characteristics documented for all patterns
- NFT trait system ready for generative minting