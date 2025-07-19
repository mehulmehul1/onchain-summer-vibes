# TASK PRP: Phase 3 Enhanced Theme System Implementation

This document provides detailed task breakdown for implementing the enhanced theme system with rarity distribution, color harmony validation, and theme-pattern interactions for the `Onchain Summer Vibes` project.

## Context Section

```yaml
context:
  docs:
    - url: [WCAG Color Contrast Guidelines]
      focus: [contrast ratios, accessibility standards, AA compliance]
    - url: [Canvas 2D Context API]
      focus: [createLinearGradient, createRadialGradient, createConicGradient, globalCompositeOperation]
    - url: [CSS Color Theory]
      focus: [HSL color space, color harmony rules, blend modes]

  patterns:
    - file: src/constants/patternConfig.js
      copy: "The existing THEME_PRESETS structure with 5 themes is the template for expanding to 8 themes with rarity metadata."
    - file: src/core/Q5App-minimal.js
      copy: "The colors object and hexToRgb/rgbToHex methods show the current color management approach."
    - file: src/ui/ControlPanel.js  
      copy: "The theme selection UI demonstrates how to integrate new UI elements with existing controls."

  gotchas:
    - issue: "Canvas 2D createConicGradient() is not supported in all browsers"
      fix: "Always check feature availability with 'createConicGradient' in ctx before using, fallback to radial gradient"
    - issue: "Rarity distribution must be exact for NFT fairness"
      fix: "Use cumulative probability with precise integer math, validate with statistical tests over 10,000+ samples"
    - issue: "Theme changes during animation can cause performance drops"
      fix: "Cache theme-specific calculations, only recalculate on actual theme change, use RAF timing for updates"
    - issue: "Color contrast validation can be expensive in real-time"
      fix: "Pre-calculate contrast ratios for all theme combinations, store in lookup table, validate only on theme selection"
```

## Task Structure & Sequencing

### 1. Setup Tasks: Theme Collection Expansion (Task 16)
**Goal**: Add 3 new themes to expand from 5 to 8 total themes with rarity metadata

**ACTION** `c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/constants/patternConfig.js`:

**OPERATION**: Add 3 new themes (sunrise, monochrome, neon, pastel) to THEME_PRESETS object. Add rarity and weight properties to all themes including existing ones. Create THEME_RARITY configuration object for weighted selection.

**Implementation Details**:
```javascript
// Add to existing THEME_PRESETS
sunrise: {
  color1: "#FF6B35", color2: "#F7931E", color3: "#FFD23F", color4: "#FFF8DC",
  rarity: "common", weight: 20
},
monochrome: {
  color1: "#2C2C2C", color2: "#5A5A5A", color3: "#888888", color4: "#E0E0E0", 
  rarity: "rare", weight: 4
},
neon: {
  color1: "#FF0080", color2: "#00FF80", color3: "#8000FF", color4: "#FFFF00",
  rarity: "rare", weight: 4  
},
pastel: {
  color1: "#FFB3E6", color2: "#E6B3FF", color3: "#B3E6FF", color4: "#B3FFE6",
  rarity: "epic", weight: 1
}

// Add new export
export const THEME_RARITY = {
  common: { weight: 60, themes: ['dawn', 'ocean', 'forest', 'sunrise'] },
  uncommon: { weight: 25, themes: ['sunset', 'midnight'] },  
  rare: { weight: 12, themes: ['monochrome', 'neon'] },
  epic: { weight: 3, themes: ['pastel'] }
};
```

**VALIDATE**: Run `npm run dev`. Open UI controls panel. Verify all 8 themes appear in theme selector dropdown. Check console for any import/export errors. Verify theme switching works for all new themes.

**IF_FAIL**: Check for syntax errors (missing commas, brackets). Ensure theme names match exactly between THEME_PRESETS keys and THEME_RARITY arrays. Verify all color values are valid hex format. Check browser console for JavaScript errors.

**ROLLBACK**: `git checkout -- c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/constants/patternConfig.js`

---

**ACTION** `c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/core/Q5App-minimal.js`:

**OPERATION**: Import THEME_RARITY from patternConfig.js. Add weighted theme selection method selectThemeByRarity(). Update constructor to include rarity metadata in colors object.

**Implementation Details**:
```javascript
// Add import
import { SVG_CONFIG, DEFAULT_VALUES, PATTERN_TYPES, THEME_RARITY } from '../constants/patternConfig.js';

// Add method to Q5App class
selectThemeByRarity() {
  const random = Math.random() * 100;
  let cumulative = 0;
  
  for (const [rarity, config] of Object.entries(THEME_RARITY)) {
    cumulative += config.weight;
    if (random <= cumulative) {
      const themes = config.themes;
      return themes[Math.floor(Math.random() * themes.length)];
    }
  }
  return 'dawn'; // fallback
}

// Add rarity property to colors object in constructor
this.currentTheme = 'dawn';
this.themeRarity = 'common';
```

**VALIDATE**: Add console.log in selectThemeByRarity() method. Run the method 100 times in browser console. Verify distribution roughly matches: Common ~60%, Uncommon ~25%, Rare ~12%, Epic ~3%. Check that method returns valid theme names only.

**IF_FAIL**: Debug cumulative probability calculation. Check THEME_RARITY import is successful. Verify Math.random() is producing expected values. Test edge cases (random = 0, random = 0.999).

**ROLLBACK**: `git checkout -- c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/core/Q5App-minimal.js`

### 2. Core Changes: Color Harmony Validation System (Task 17)
**Goal**: Implement WCAG-compliant color harmony validation with accessibility checks

**ACTION** `c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/utils/ColorHarmonyValidator.js`:

**OPERATION**: Create new ColorHarmonyValidator class with methods for contrast checking, harmony validation, accessibility testing, and visual balance assessment.

**Implementation Details**:
```javascript
export class ColorHarmonyValidator {
  constructor() {
    this.wcagAAThreshold = 4.5;
    this.wcagAAAThreshold = 7.0;
  }
  
  validatePalette(colors) {
    return {
      contrast: this.checkContrast(colors),
      harmony: this.checkHarmony(colors), 
      accessibility: this.checkAccessibility(colors),
      balance: this.checkBalance(colors),
      score: this.calculateOverallScore(colors)
    };
  }
  
  checkContrast(colors) {
    // Calculate WCAG contrast ratios between all color pairs
    const ratios = [];
    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        ratios.push(this.calculateContrastRatio(colors[i], colors[j]));
      }
    }
    return {
      ratios,
      minRatio: Math.min(...ratios),
      maxRatio: Math.max(...ratios),
      avgRatio: ratios.reduce((a, b) => a + b) / ratios.length,
      wcagAA: Math.min(...ratios) >= this.wcagAAThreshold,
      wcagAAA: Math.min(...ratios) >= this.wcagAAAThreshold
    };
  }
  
  calculateContrastRatio(color1, color2) {
    const l1 = this.getRelativeLuminance(color1);
    const l2 = this.getRelativeLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }
  
  getRelativeLuminance(hexColor) {
    // Convert hex to RGB then calculate relative luminance per WCAG formula
    const rgb = this.hexToRgb(hexColor);
    const [r, g, b] = rgb.map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  
  checkHarmony(colors) {
    // Convert to HSL and check color wheel relationships
    const hslColors = colors.map(c => this.hexToHsl(c));
    const hues = hslColors.map(hsl => hsl.h);
    
    return {
      type: this.detectHarmonyType(hues),
      score: this.calculateHarmonyScore(hues),
      isHarmonious: this.isHarmoniousScheme(hues)
    };
  }
  
  checkAccessibility(colors) {
    // Simulate color blindness and check readability
    return {
      protanopia: this.simulateColorBlindness(colors, 'protanopia'),
      deuteranopia: this.simulateColorBlindness(colors, 'deuteranopia'), 
      tritanopia: this.simulateColorBlindness(colors, 'tritanopia'),
      readabilityScore: this.calculateReadabilityScore(colors)
    };
  }
  
  checkBalance(colors) {
    // Analyze saturation and brightness distribution
    const hslColors = colors.map(c => this.hexToHsl(c));
    const saturations = hslColors.map(hsl => hsl.s);
    const lightnesses = hslColors.map(hsl => hsl.l);
    
    return {
      saturationRange: Math.max(...saturations) - Math.min(...saturations),
      lightnessRange: Math.max(...lightnesses) - Math.min(...lightnesses),
      isBalanced: this.isVisuallyBalanced(hslColors)
    };
  }
  
  // Helper methods for color conversion
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16), 
      parseInt(result[3], 16)
    ] : [0, 0, 0];
  }
  
  hexToHsl(hex) {
    const [r, g, b] = this.hexToRgb(hex).map(c => c / 255);
    // HSL conversion algorithm
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    const sum = max + min;
    const l = sum / 2;
    
    if (diff === 0) {
      return { h: 0, s: 0, l };
    }
    
    const s = l > 0.5 ? diff / (2 - sum) : diff / sum;
    
    let h;
    switch (max) {
      case r: h = ((g - b) / diff + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / diff + 2) / 6; break;
      case b: h = ((r - g) / diff + 4) / 6; break;
    }
    
    return { h: h * 360, s, l };
  }
}
```

**VALIDATE**: Create test file `test/color-harmony.test.js`. Test all 8 theme palettes with ColorHarmonyValidator. Verify WCAG AA compliance for existing themes. Check that contrast ratios are calculated correctly using known good/bad color combinations. Verify accessibility simulation produces different results.

**IF_FAIL**: Debug color conversion functions with known hex/RGB/HSL values. Check WCAG contrast formula implementation against official calculator. Verify edge cases (pure black/white, identical colors).

**ROLLBACK**: `rm c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/utils/ColorHarmonyValidator.js`

---

**ACTION** `c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/core/Q5App-minimal.js`:

**OPERATION**: Import ColorHarmonyValidator. Add validation step in updateParameter method when colors are changed. Add getThemeValidation method for UI feedback.

**Implementation Details**:
```javascript
// Add import
import { ColorHarmonyValidator } from '../utils/ColorHarmonyValidator.js';

// Add to constructor
this.colorValidator = new ColorHarmonyValidator();
this.currentValidation = null;

// Add method
validateCurrentTheme() {
  const colorArray = [
    this.rgbToHex(this.colors.primary),
    this.rgbToHex(this.colors.secondary), 
    this.rgbToHex(this.colors.accent),
    this.rgbToHex(this.colors.background)
  ];
  
  this.currentValidation = this.colorValidator.validatePalette(colorArray);
  
  // Log warnings for accessibility issues
  if (!this.currentValidation.contrast.wcagAA) {
    console.warn(`Theme accessibility warning: Contrast ratio ${this.currentValidation.contrast.minRatio.toFixed(2)} below WCAG AA standard`);
  }
  
  return this.currentValidation;
}

// Update updateParameter method to include validation
updateParameter(key, value) {
  // ... existing code ...
  
  // Validate theme when colors change
  if (key === 'colors') {
    // ... existing color update code ...
    setTimeout(() => this.validateCurrentTheme(), 0); // Validate after state update
  }
}
```

**VALIDATE**: Switch between all 8 themes in UI. Check browser console for accessibility warnings. Verify validateCurrentTheme() returns complete validation object with contrast, harmony, accessibility, and balance properties. Test theme validation performance - should complete in <50ms.

**IF_FAIL**: Check ColorHarmonyValidator import path. Debug color format conversion between hex and RGB. Verify rgbToHex method produces valid hex strings. Check async timing of validation calls.

**ROLLBACK**: `git checkout -- c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/core/Q5App-minimal.js`

### 3. Integration: Advanced Color Blending System (Task 18)
**Goal**: Implement advanced color blending with multiple blend modes and GPU optimization

**ACTION** `c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/utils/AdvancedColorBlender.js`:

**OPERATION**: Create AdvancedColorBlender class with multiple gradient types, blend modes, and optimized color calculations.

**Implementation Details**:
```javascript
export class AdvancedColorBlender {
  constructor() {
    this.gradientCache = new Map();
    this.blendCache = new Map();
  }
  
  createGradient(ctx, colors, width, height, type = 'linear', options = {}) {
    const cacheKey = `${type}-${width}-${height}-${colors.join('-')}-${JSON.stringify(options)}`;
    
    if (this.gradientCache.has(cacheKey)) {
      return this.gradientCache.get(cacheKey);
    }
    
    let gradient;
    
    switch(type) {
      case 'radial':
        const centerX = options.centerX || width / 2;
        const centerY = options.centerY || height / 2;
        const radius = options.radius || Math.max(width, height) / 2;
        gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        break;
        
      case 'conic':
        if ('createConicGradient' in ctx) {
          const angle = options.angle || 0;
          const centerX = options.centerX || width / 2;
          const centerY = options.centerY || height / 2;
          gradient = ctx.createConicGradient(angle, centerX, centerY);
        } else {
          // Fallback to radial for unsupported browsers
          gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
        }
        break;
        
      default: // linear
        const x0 = options.x0 || 0;
        const y0 = options.y0 || 0;
        const x1 = options.x1 || width;
        const y1 = options.y1 || height;
        gradient = ctx.createLinearGradient(x0, y0, x1, y1);
    }
    
    // Calculate color stops with advanced distribution
    const stops = this.calculateColorStops(colors, type, options);
    stops.forEach(stop => {
      gradient.addColorStop(stop.position, stop.color);
    });
    
    this.gradientCache.set(cacheKey, gradient);
    return gradient;
  }
  
  calculateColorStops(colors, type, options) {
    const stops = [];
    const distribution = options.distribution || 'linear';
    
    colors.forEach((color, index) => {
      let position;
      
      switch(distribution) {
        case 'exponential':
          position = Math.pow(index / (colors.length - 1), 2);
          break;
        case 'logarithmic':
          position = index === 0 ? 0 : Math.log(index + 1) / Math.log(colors.length);
          break;
        case 'cubic':
          const t = index / (colors.length - 1);
          position = t * t * (3 - 2 * t); // Smooth step
          break;
        default: // linear
          position = index / (colors.length - 1);
      }
      
      stops.push({
        position: Math.max(0, Math.min(1, position)),
        color: this.formatColor(color)
      });
    });
    
    return stops;
  }
  
  blendColors(color1, color2, factor, mode = 'normal') {
    const cacheKey = `${color1}-${color2}-${factor}-${mode}`;
    
    if (this.blendCache.has(cacheKey)) {
      return this.blendCache.get(cacheKey);
    }
    
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    let result;
    
    switch(mode) {
      case 'multiply':
        result = this.multiplyBlend(rgb1, rgb2, factor);
        break;
      case 'screen':
        result = this.screenBlend(rgb1, rgb2, factor);
        break;
      case 'overlay':
        result = this.overlayBlend(rgb1, rgb2, factor);
        break;
      case 'soft-light':
        result = this.softLightBlend(rgb1, rgb2, factor);
        break;
      case 'hard-light':
        result = this.hardLightBlend(rgb1, rgb2, factor);
        break;
      case 'color-dodge':
        result = this.colorDodgeBlend(rgb1, rgb2, factor);
        break;
      case 'color-burn':
        result = this.colorBurnBlend(rgb1, rgb2, factor);
        break;
      default: // normal
        result = this.normalBlend(rgb1, rgb2, factor);
    }
    
    const hexResult = this.rgbToHex(result);
    this.blendCache.set(cacheKey, hexResult);
    return hexResult;
  }
  
  // Blend mode implementations
  normalBlend(rgb1, rgb2, factor) {
    return rgb1.map((c1, i) => 
      Math.round(c1 * (1 - factor) + rgb2[i] * factor)
    );
  }
  
  multiplyBlend(rgb1, rgb2, factor) {
    return rgb1.map((c1, i) => 
      Math.round(c1 * (1 - factor) + (c1 * rgb2[i] / 255) * factor)
    );
  }
  
  screenBlend(rgb1, rgb2, factor) {
    return rgb1.map((c1, i) => 
      Math.round(c1 * (1 - factor) + (255 - ((255 - c1) * (255 - rgb2[i]) / 255)) * factor)
    );
  }
  
  overlayBlend(rgb1, rgb2, factor) {
    return rgb1.map((c1, i) => {
      const c2 = rgb2[i];
      const overlay = c1 < 128 
        ? 2 * c1 * c2 / 255
        : 255 - 2 * (255 - c1) * (255 - c2) / 255;
      return Math.round(c1 * (1 - factor) + overlay * factor);
    });
  }
  
  softLightBlend(rgb1, rgb2, factor) {
    return rgb1.map((c1, i) => {
      const c2 = rgb2[i];
      const softLight = c2 < 128
        ? c1 - (255 - 2 * c2) * c1 * (255 - c1) / (255 * 255)
        : c1 + (2 * c2 - 255) * (Math.sqrt(c1 / 255) * 255 - c1) / 255;
      return Math.round(c1 * (1 - factor) + softLight * factor);
    });
  }
  
  // Utility methods
  formatColor(color) {
    if (Array.isArray(color)) {
      return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    }
    return color;
  }
  
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [0, 0, 0];
  }
  
  rgbToHex(rgb) {
    return "#" + rgb.map(c => 
      Math.max(0, Math.min(255, Math.round(c)))
        .toString(16).padStart(2, '0')
    ).join('');
  }
  
  clearCache() {
    this.gradientCache.clear();
    this.blendCache.clear();
  }
}
```

**VALIDATE**: Create test patterns using each blend mode. Verify gradients render correctly in all browsers. Test performance with 1000 blend operations - should complete in <100ms. Check memory usage with cache enabled vs disabled. Verify fallback works when createConicGradient is unavailable.

**IF_FAIL**: Debug blend mode calculations with known color combinations. Check gradient creation for syntax errors. Verify cache key generation is unique for different inputs. Test browser compatibility issues.

**ROLLBACK**: `rm c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/utils/AdvancedColorBlender.js`

### 4. Core Changes: Theme-Pattern Interaction System (Task 19)
**Goal**: Implement theme-specific pattern modifications and effects

**ACTION** `c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/utils/ThemePatternEnhancer.js`:

**OPERATION**: Create ThemePatternEnhancer class that applies theme-specific modifications to patterns based on theme rarity and characteristics.

**Implementation Details**:
```javascript
import { AdvancedColorBlender } from './AdvancedColorBlender.js';

export class ThemePatternEnhancer {
  constructor() {
    this.blender = new AdvancedColorBlender();
    this.effectsCache = new Map();
  }
  
  applyThemeEffects(patternType, theme, baseColors, options = {}) {
    const cacheKey = `${patternType}-${theme}-${JSON.stringify(baseColors)}`;
    
    if (this.effectsCache.has(cacheKey)) {
      return this.effectsCache.get(cacheKey);
    }
    
    const themeEffects = this.getThemeEffects(theme);
    const patternMods = this.getPatternModifications(patternType, theme);
    
    const enhancedColors = this.enhanceColors(baseColors, themeEffects);
    
    const result = {
      colors: enhancedColors,
      opacity: this.adjustOpacity(themeEffects.intensity, options.baseOpacity || 1.0),
      blending: themeEffects.blendMode,
      special: patternMods,
      performance: themeEffects.performance || {}
    };
    
    this.effectsCache.set(cacheKey, result);
    return result;
  }
  
  getThemeEffects(theme) {
    const themeEffects = {
      dawn: {
        colorShift: 0.1,
        intensity: 1.0,
        blendMode: 'normal',
        warmth: 0.2,
        brightness: 0.1
      },
      ocean: {
        colorShift: -0.1,
        intensity: 1.1,
        blendMode: 'multiply',
        coolness: 0.3,
        depth: 0.2
      },
      forest: {
        colorShift: 0.05,
        intensity: 0.9,
        blendMode: 'overlay',
        naturalness: 0.25,
        saturation: 0.15
      },
      sunset: {
        colorShift: 0.15,
        intensity: 1.2,
        blendMode: 'soft-light',
        warmth: 0.4,
        drama: 0.3
      },
      midnight: {
        colorShift: -0.2,
        intensity: 0.8,
        blendMode: 'multiply',
        darkness: 0.3,
        mystery: 0.25
      },
      sunrise: {
        colorShift: 0.2,
        intensity: 1.15,
        blendMode: 'screen',
        warmth: 0.35,
        energy: 0.3
      },
      monochrome: {
        colorShift: 0,
        intensity: 0.85,
        blendMode: 'luminosity',
        contrast: 0.4,
        simplicity: 0.5,
        performance: { useGrayscale: true }
      },
      neon: {
        colorShift: 0.3,
        intensity: 1.4,
        blendMode: 'screen',
        saturation: 0.6,
        glow: 0.5,
        performance: { useGlow: true }
      },
      pastel: {
        colorShift: -0.3,
        intensity: 0.7,
        blendMode: 'soft-light',
        softness: 0.4,
        delicacy: 0.3,
        performance: { useSoftening: true }
      }
    };
    
    return themeEffects[theme] || themeEffects.dawn;
  }
  
  getPatternModifications(patternType, theme) {
    const modifications = {
      interference: {
        neon: { glowRadius: 8, pulseIntensity: 0.3 },
        monochrome: { lineSharpness: 1.5, noiseReduction: 0.8 },
        pastel: { softening: 0.4, blurRadius: 2 }
      },
      gentle: {
        neon: { lineGlow: true, sparkleEffect: 0.2 },
        monochrome: { lineWeight: 1.3, contrastBoost: 0.3 },
        pastel: { flowSoftness: 0.5, dreamyEffect: true }
      },
      mandala: {
        neon: { centerGlow: true, ringPulse: 0.25 },
        monochrome: { geometricSharpness: 1.4, shadowDepth: 0.3 },
        pastel: { floralSoftness: 0.6, watercolorEffect: true }
      },
      vectorField: {
        neon: { particleGlow: true, trailIntensity: 0.4 },
        monochrome: { fieldContrast: 1.5, lineDefinition: 0.8 },
        pastel: { particleSoftness: 0.5, cloudyTrails: true }
      },
      shellRidge: {
        neon: { ridgeGlow: true, waveAmplification: 0.3 },
        monochrome: { ridgeSharpness: 1.6, depthEnhancement: 0.4 },
        pastel: { organicSoftness: 0.5, naturalBlending: true }
      },
      contourInterference: {
        neon: { contourGlow: true, levelBrightness: 0.4 },
        monochrome: { contourSharpness: 1.5, levelContrast: 0.5 },
        pastel: { contourSoftness: 0.4, smoothTransitions: true }
      }
    };
    
    return modifications[patternType]?.[theme] || {};
  }
  
  enhanceColors(baseColors, effects) {
    const enhanced = { ...baseColors };
    
    // Apply color shifts
    if (effects.colorShift !== 0) {
      enhanced.primary = this.shiftColor(enhanced.primary, effects.colorShift);
      enhanced.secondary = this.shiftColor(enhanced.secondary, effects.colorShift);
      enhanced.accent = this.shiftColor(enhanced.accent, effects.colorShift);
    }
    
    // Apply warmth/coolness
    if (effects.warmth) {
      enhanced.primary = this.adjustWarmth(enhanced.primary, effects.warmth);
      enhanced.secondary = this.adjustWarmth(enhanced.secondary, effects.warmth);
    }
    
    if (effects.coolness) {
      enhanced.primary = this.adjustCoolness(enhanced.primary, effects.coolness);
      enhanced.secondary = this.adjustCoolness(enhanced.secondary, effects.coolness);
    }
    
    // Apply saturation adjustments
    if (effects.saturation) {
      enhanced.primary = this.adjustSaturation(enhanced.primary, effects.saturation);
      enhanced.secondary = this.adjustSaturation(enhanced.secondary, effects.saturation);
      enhanced.accent = this.adjustSaturation(enhanced.accent, effects.saturation);
    }
    
    return enhanced;
  }
  
  shiftColor(rgbArray, shift) {
    // Convert to HSL, shift hue, convert back
    const hsl = this.rgbToHsl(rgbArray);
    hsl.h = (hsl.h + shift * 360) % 360;
    return this.hslToRgb(hsl);
  }
  
  adjustWarmth(rgbArray, warmth) {
    // Increase red/yellow components
    return [
      Math.min(255, rgbArray[0] + warmth * 30),
      Math.min(255, rgbArray[1] + warmth * 15),
      Math.max(0, rgbArray[2] - warmth * 10)
    ];
  }
  
  adjustCoolness(rgbArray, coolness) {
    // Increase blue components
    return [
      Math.max(0, rgbArray[0] - coolness * 15),
      Math.max(0, rgbArray[1] - coolness * 5),
      Math.min(255, rgbArray[2] + coolness * 25)
    ];
  }
  
  adjustSaturation(rgbArray, saturationBoost) {
    const hsl = this.rgbToHsl(rgbArray);
    hsl.s = Math.min(1, hsl.s + saturationBoost);
    return this.hslToRgb(hsl);
  }
  
  adjustOpacity(intensity, baseOpacity) {
    return Math.max(0.1, Math.min(1.0, baseOpacity * intensity));
  }
  
  // Color conversion utilities
  rgbToHsl(rgb) {
    const [r, g, b] = rgb.map(c => c / 255);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    const sum = max + min;
    const l = sum / 2;
    
    if (diff === 0) {
      return { h: 0, s: 0, l };
    }
    
    const s = l > 0.5 ? diff / (2 - sum) : diff / sum;
    
    let h;
    switch (max) {
      case r: h = ((g - b) / diff + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / diff + 2) / 6; break;
      case b: h = ((r - g) / diff + 4) / 6; break;
    }
    
    return { h: h * 360, s, l };
  }
  
  hslToRgb(hsl) {
    const { h, s, l } = hsl;
    const hNorm = h / 360;
    
    if (s === 0) {
      const gray = Math.round(l * 255);
      return [gray, gray, gray];
    }
    
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    return [
      Math.round(hue2rgb(p, q, hNorm + 1/3) * 255),
      Math.round(hue2rgb(p, q, hNorm) * 255),
      Math.round(hue2rgb(p, q, hNorm - 1/3) * 255)
    ];
  }
  
  clearCache() {
    this.effectsCache.clear();
  }
}
```

**VALIDATE**: Test theme effects on all 6 patterns. Verify neon theme adds glow effects. Check monochrome theme increases contrast. Confirm pastel theme adds softening. Measure performance impact - should add <5ms per frame. Verify color shifts produce visually distinct results.

**IF_FAIL**: Debug color conversion functions. Check effect calculations for mathematical errors. Verify cache is working to prevent recalculation. Test edge cases with extreme color values.

**ROLLBACK**: `rm c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/utils/ThemePatternEnhancer.js`

### 5. Integration: UI Rarity Indicators (Task 20)  
**Goal**: Add rarity badges and visual indicators to theme selection UI

**ACTION** `c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/ui/ControlPanel.js`:

**OPERATION**: Add rarity indicators to theme buttons, update theme selection UI with rarity badges, add theme statistics display.

**Implementation Details**:
```javascript
// Add import for rarity data
import { THEME_PRESETS, THEME_RARITY } from '../constants/patternConfig.js';

// In createThemeControls method, update theme button creation
createThemeButton(themeName, colors) {
  const button = document.createElement('button');
  button.className = 'theme-button';
  button.dataset.theme = themeName;
  
  // Determine theme rarity
  const rarity = this.getThemeRarity(themeName);
  button.classList.add(`rarity-${rarity}`);
  
  // Create theme preview
  const preview = document.createElement('div');
  preview.className = 'theme-preview';
  preview.style.background = `linear-gradient(45deg, ${colors.color1}, ${colors.color2}, ${colors.color3}, ${colors.color4})`;
  
  // Create rarity badge
  const rarityBadge = document.createElement('span');
  rarityBadge.className = 'rarity-badge';
  rarityBadge.textContent = this.formatRarity(rarity);
  rarityBadge.title = `${this.formatRarity(rarity)} - ${this.getRarityPercentage(rarity)}% chance`;
  
  // Create theme name label
  const label = document.createElement('span');
  label.className = 'theme-label';
  label.textContent = this.formatThemeName(themeName);
  
  button.appendChild(preview);
  button.appendChild(rarityBadge);
  button.appendChild(label);
  
  return button;
}

getThemeRarity(themeName) {
  for (const [rarity, config] of Object.entries(THEME_RARITY)) {
    if (config.themes.includes(themeName)) {
      return rarity;
    }
  }
  return 'common';
}

formatRarity(rarity) {
  const rarityLabels = {
    common: 'Common',
    uncommon: 'Uncommon', 
    rare: 'Rare',
    epic: 'Epic'
  };
  return rarityLabels[rarity] || 'Common';
}

getRarityPercentage(rarity) {
  return THEME_RARITY[rarity]?.weight || 0;
}

formatThemeName(themeName) {
  return themeName.charAt(0).toUpperCase() + themeName.slice(1);
}
```

**CSS Additions**:
```css
.theme-button {
  position: relative;
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 4px;
  min-width: 120px;
  text-align: center;
}

.theme-button.rarity-common {
  border-color: #6c757d;
}

.theme-button.rarity-uncommon {
  border-color: #28a745;
  box-shadow: 0 0 5px rgba(40, 167, 69, 0.3);
}

.theme-button.rarity-rare {
  border-color: #007bff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.4);
}

.theme-button.rarity-epic {
  border-color: #6f42c1;
  box-shadow: 0 0 12px rgba(111, 66, 193, 0.5);
  animation: epic-glow 2s infinite alternate;
}

@keyframes epic-glow {
  from { box-shadow: 0 0 12px rgba(111, 66, 193, 0.5); }
  to { box-shadow: 0 0 20px rgba(111, 66, 193, 0.8); }
}

.theme-preview {
  width: 100%;
  height: 40px;
  border-radius: 4px;
  margin-bottom: 4px;
}

.rarity-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(45deg, #333, #555);
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 12px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.rarity-badge.common { background: linear-gradient(45deg, #6c757d, #868e96); }
.rarity-badge.uncommon { background: linear-gradient(45deg, #28a745, #34ce57); }
.rarity-badge.rare { background: linear-gradient(45deg, #007bff, #0ea5e9); }
.rarity-badge.epic { background: linear-gradient(45deg, #6f42c1, #8b5cf6); }

.theme-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #333;
  margin-top: 4px;
}

.theme-button:hover {
  transform: translateY(-2px);
}

.theme-button.active {
  border-width: 3px;
  transform: scale(1.05);
}

/* Theme statistics panel */
.theme-stats {
  margin-top: 16px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  font-size: 12px;
}

.theme-stats h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #333;
}

.rarity-distribution {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.rarity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rarity-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  margin-right: 6px;
}
```

**VALIDATE**: Check that all 8 themes display with correct rarity badges. Verify rarity colors match the established color scheme. Test hover and active states. Confirm rarity percentages are displayed correctly in tooltips. Check responsive behavior on different screen sizes.

**IF_FAIL**: Debug CSS class assignments. Check rarity calculation logic. Verify color gradient generation for theme previews. Test border and shadow animations.

**ROLLBACK**: `git checkout -- c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/ui/ControlPanel.js`

### 6. Integration: Pattern Enhancement Integration (Task 21)
**Goal**: Integrate ThemePatternEnhancer into all pattern renderers

**ACTION** `c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/core/Q5App-minimal.js`:

**OPERATION**: Import and integrate ThemePatternEnhancer. Update renderPattern method to apply theme effects. Add theme-specific performance optimizations.

**Implementation Details**:
```javascript
// Add imports
import { ThemePatternEnhancer } from '../utils/ThemePatternEnhancer.js';
import { AdvancedColorBlender } from '../utils/AdvancedColorBlender.js';

// Add to constructor
this.themeEnhancer = new ThemePatternEnhancer();
this.colorBlender = new AdvancedColorBlender();
this.lastThemeChange = 0;

// Update renderPattern method
renderPattern(ctx, time, width, height) {
  // Get enhanced theme effects
  const enhancedTheme = this.themeEnhancer.applyThemeEffects(
    this.patternType, 
    this.currentTheme, 
    this.colors,
    { baseOpacity: 1.0 }
  );
  
  // Apply theme-specific canvas settings
  this.applyThemeCanvasEffects(ctx, enhancedTheme);
  
  // Get pattern options with theme enhancements
  const options = {
    ...this.getPatternOptions(),
    themeEffects: enhancedTheme.special,
    blendMode: enhancedTheme.blending,
    opacity: enhancedTheme.opacity
  };
  
  // Render based on pattern type with enhanced colors
  if (this.patternType === PATTERN_TYPES.INTERFERENCE) {
    this.renderInterferencePattern(ctx, time, enhancedTheme.colors);
  } else if (this.patternType === PATTERN_TYPES.GENTLE) {
    this.renderGentlePattern(ctx, time, width, height, enhancedTheme.colors, options);
  } else if (this.patterns[this.patternType]) {
    this.patterns[this.patternType].render(ctx, time, width, height, enhancedTheme.colors, options);
  } else {
    // Fallback to interference pattern
    this.renderInterferencePattern(ctx, time, enhancedTheme.colors);
  }
  
  // Apply post-processing effects
  this.applyPostProcessingEffects(ctx, enhancedTheme, width, height);
}

applyThemeCanvasEffects(ctx, enhancedTheme) {
  // Reset canvas effects
  ctx.globalCompositeOperation = 'source-over';
  ctx.shadowBlur = 0;
  ctx.filter = 'none';
  
  // Apply theme-specific effects
  if (enhancedTheme.special.useGlow || enhancedTheme.special.glowRadius) {
    ctx.shadowBlur = enhancedTheme.special.glowRadius || 5;
    ctx.shadowColor = `rgba(255, 255, 255, ${enhancedTheme.opacity * 0.5})`;
  }
  
  if (enhancedTheme.special.useGrayscale) {
    ctx.filter = 'grayscale(100%)';
  }
  
  if (enhancedTheme.special.useSoftening) {
    ctx.filter = (ctx.filter === 'none' ? '' : ctx.filter + ' ') + 
                 `blur(${enhancedTheme.special.blurRadius || 1}px)`;
  }
  
  // Set blend mode
  if (enhancedTheme.blending && enhancedTheme.blending !== 'normal') {
    ctx.globalCompositeOperation = this.mapBlendMode(enhancedTheme.blending);
  }
}

mapBlendMode(blendMode) {
  const blendModeMap = {
    'multiply': 'multiply',
    'screen': 'screen', 
    'overlay': 'overlay',
    'soft-light': 'soft-light',
    'hard-light': 'hard-light',
    'color-dodge': 'color-dodge',
    'color-burn': 'color-burn',
    'luminosity': 'luminosity'
  };
  return blendModeMap[blendMode] || 'source-over';
}

applyPostProcessingEffects(ctx, enhancedTheme, width, height) {
  // Apply epic theme special effects
  if (this.currentTheme === 'pastel' && enhancedTheme.special.watercolorEffect) {
    this.applyWatercolorEffect(ctx, width, height);
  }
  
  if (this.currentTheme === 'neon' && enhancedTheme.special.sparkleEffect) {
    this.applySparkleEffect(ctx, width, height, enhancedTheme.special.sparkleEffect);
  }
}

applyWatercolorEffect(ctx, width, height) {
  // Create subtle watercolor bleeding effect
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Apply subtle blur and color bleeding
  for (let i = 0; i < data.length; i += 4) {
    if (Math.random() < 0.1) { // 10% of pixels
      const r = data[i];
      const g = data[i + 1]; 
      const b = data[i + 2];
      const a = data[i + 3];
      
      // Slight color bleeding
      data[i] = Math.min(255, r + (Math.random() - 0.5) * 20);
      data[i + 1] = Math.min(255, g + (Math.random() - 0.5) * 20);
      data[i + 2] = Math.min(255, b + (Math.random() - 0.5) * 20);
      data[i + 3] = Math.max(200, a - Math.random() * 30); // Slight transparency
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}

applySparkleEffect(ctx, width, height, intensity) {
  // Add subtle sparkle points
  const sparkleCount = Math.floor(intensity * 100);
  
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  
  for (let i = 0; i < sparkleCount; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 3 + 1;
    const opacity = Math.random() * 0.8 + 0.2;
    
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.restore();
}

// Update updateParameter to clear caches when theme changes
updateParameter(key, value) {
  console.log(`Updating parameter: ${key} = ${value}`);
  
  // Handle theme changes
  if (key === 'currentTheme') {
    this.currentTheme = value;
    this.lastThemeChange = Date.now();
    
    // Clear caches to ensure fresh calculations
    this.themeEnhancer.clearCache();
    this.colorBlender.clearCache();
    
    // Update colors based on new theme
    if (THEME_PRESETS[value]) {
      this.colors = {
        primary: this.hexToRgb(THEME_PRESETS[value].color1),
        secondary: this.hexToRgb(THEME_PRESETS[value].color2),
        accent: this.hexToRgb(THEME_PRESETS[value].color3),
        background: this.hexToRgb(THEME_PRESETS[value].color4)
      };
    }
    
    // Validate new theme
    setTimeout(() => this.validateCurrentTheme(), 0);
    return;
  }
  
  // ... rest of existing updateParameter code
}
```

**VALIDATE**: Test all 8 themes with all 6 patterns. Verify neon theme shows glow effects on interference pattern. Check monochrome theme increases contrast on gentle pattern. Confirm pastel theme applies watercolor effect. Monitor performance - should maintain 60fps with all effects enabled.

**IF_FAIL**: Debug theme effect application. Check canvas effect reset between frames. Verify blend mode mapping is correct. Test post-processing performance impact.

**ROLLBACK**: `git checkout -- c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/core/Q5App-minimal.js`

### 7. Integration: TokenMetadata Enhancement (Task 22)
**Goal**: Add theme rarity to NFT metadata generation

**ACTION** `c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/core/TokenMetadata.js`:

**OPERATION**: Import theme rarity system. Add theme rarity to traits generation. Include color harmony scores in metadata.

**Implementation Details**:
```javascript
// Add imports
import { THEME_RARITY } from '../constants/patternConfig.js';
import { ColorHarmonyValidator } from '../utils/ColorHarmonyValidator.js';

// Add to constructor or as static methods
static colorValidator = new ColorHarmonyValidator();

// Update generateTraits method
static generateTraits(patternType, parameters, themeName, colors) {
  const traits = {
    "Pattern Type": patternType,
    "Theme": themeName,
    "Theme Rarity": this.getThemeRarity(themeName),
    "Color Harmony Score": this.getColorHarmonyScore(colors),
    "Complexity": this.calculateComplexity(patternType, parameters),
    "Animation Speed": this.categorizeSpeed(parameters.speed),
    "Color Temperature": this.analyzeColorTemperature(colors),
    "Visual Weight": this.calculateVisualWeight(parameters),
    "Accessibility Rating": this.getAccessibilityRating(colors)
  };
  
  // Add pattern-specific traits
  const patternTraits = this.getPatternSpecificTraits(patternType, parameters);
  Object.assign(traits, patternTraits);
  
  // Add theme-specific traits
  const themeTraits = this.getThemeSpecificTraits(themeName, colors);
  Object.assign(traits, themeTraits);
  
  return traits;
}

static getThemeRarity(themeName) {
  for (const [rarity, config] of Object.entries(THEME_RARITY)) {
    if (config.themes.includes(themeName)) {
      return this.formatRarity(rarity);
    }
  }
  return 'Common';
}

static formatRarity(rarity) {
  return rarity.charAt(0).toUpperCase() + rarity.slice(1);
}

static getColorHarmonyScore(colors) {
  const colorArray = [
    this.rgbToHex(colors.primary),
    this.rgbToHex(colors.secondary),
    this.rgbToHex(colors.accent),
    this.rgbToHex(colors.background)
  ];
  
  const validation = this.colorValidator.validatePalette(colorArray);
  const score = Math.round(validation.score || 50);
  
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Very Good';
  if (score >= 60) return 'Good';
  if (score >= 45) return 'Fair';
  return 'Poor';
}

static getAccessibilityRating(colors) {
  const colorArray = [
    this.rgbToHex(colors.primary),
    this.rgbToHex(colors.secondary),
    this.rgbToHex(colors.accent),
    this.rgbToHex(colors.background)
  ];
  
  const validation = this.colorValidator.validatePalette(colorArray);
  
  if (validation.contrast.wcagAAA) return 'AAA';
  if (validation.contrast.wcagAA) return 'AA';
  return 'A';
}

static analyzeColorTemperature(colors) {
  // Analyze RGB values to determine warm/cool
  const avgRed = (colors.primary[0] + colors.secondary[0] + colors.accent[0]) / 3;
  const avgBlue = (colors.primary[2] + colors.secondary[2] + colors.accent[2]) / 3;
  
  const warmthScore = avgRed - avgBlue;
  
  if (warmthScore > 30) return 'Very Warm';
  if (warmthScore > 10) return 'Warm';
  if (warmthScore > -10) return 'Neutral';
  if (warmthScore > -30) return 'Cool';
  return 'Very Cool';
}

static calculateVisualWeight(parameters) {
  // Calculate based on line density, complexity, etc.
  let weight = 0;
  
  if (parameters.lineDensity) weight += parameters.lineDensity / 100 * 30;
  if (parameters.sourceCount) weight += parameters.sourceCount / 20 * 25;
  if (parameters.mandalaComplexity) weight += parameters.mandalaComplexity / 20 * 35;
  if (parameters.shellRidgeRings) weight += parameters.shellRidgeRings / 50 * 25;
  
  const normalizedWeight = Math.min(100, weight);
  
  if (normalizedWeight >= 80) return 'Very Heavy';
  if (normalizedWeight >= 60) return 'Heavy';
  if (normalizedWeight >= 40) return 'Medium';
  if (normalizedWeight >= 20) return 'Light';
  return 'Very Light';
}

static getThemeSpecificTraits(themeName, colors) {
  const themeTraits = {};
  
  switch(themeName) {
    case 'neon':
      themeTraits['Glow Intensity'] = 'High';
      themeTraits['Saturation Level'] = 'Maximum';
      break;
    case 'monochrome':
      themeTraits['Contrast Level'] = 'High';
      themeTraits['Color Range'] = 'Grayscale';
      break;
    case 'pastel':
      themeTraits['Softness Level'] = 'High';
      themeTraits['Delicacy Rating'] = 'Maximum';
      break;
    case 'sunrise':
    case 'sunset':
      themeTraits['Warmth Level'] = 'High';
      themeTraits['Energy Rating'] = 'Dynamic';
      break;
    case 'ocean':
      themeTraits['Coolness Level'] = 'High';
      themeTraits['Depth Rating'] = 'Deep';
      break;
    case 'forest':
      themeTraits['Natural Rating'] = 'High';
      themeTraits['Organic Level'] = 'Maximum';
      break;
  }
  
  return themeTraits;
}

// Update complexity calculation to include theme influence
static calculateComplexity(patternType, parameters, themeName) {
  const baseComplexity = this.getBaseComplexity(patternType, parameters);
  
  // Theme complexity modifiers
  const themeModifiers = {
    neon: 1.2,      // Glow effects add complexity
    monochrome: 0.9, // Simpler color processing
    pastel: 1.1,    // Softening effects add some complexity
    epic: 1.15      // Any epic theme gets bonus complexity
  };
  
  const modifier = themeModifiers[themeName] || 1.0;
  const adjustedComplexity = Math.round(baseComplexity * modifier);
  
  return Math.min(100, Math.max(1, adjustedComplexity));
}

// Helper method for hex conversion
static rgbToHex(rgb) {
  return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
}
```

**VALIDATE**: Generate metadata for all theme-pattern combinations. Verify theme rarity appears correctly in traits. Check color harmony scores are reasonable. Confirm accessibility ratings match WCAG standards. Test edge cases with extreme parameter values.

**IF_FAIL**: Debug trait generation logic. Check color conversion accuracy. Verify harmony score calculation. Test accessibility rating against known good/bad color combinations.

**ROLLBACK**: `git checkout -- c:/Users/mehul/OneDrive/Desktop/Daily-Code/onchain-summer-vibes/src/core/TokenMetadata.js`

### 8. Validation: Performance & Testing (Task 23)
**Goal**: Ensure 60fps performance and create comprehensive test suite

**ACTION** `test/enhanced-theme-system.test.js`:

**OPERATION**: Create comprehensive test suite for theme system functionality, performance, and visual quality.

**Implementation Details**:
```javascript
import { ColorHarmonyValidator } from '../src/utils/ColorHarmonyValidator.js';
import { AdvancedColorBlender } from '../src/utils/AdvancedColorBlender.js';
import { ThemePatternEnhancer } from '../src/utils/ThemePatternEnhancer.js';
import { THEME_PRESETS, THEME_RARITY } from '../src/constants/patternConfig.js';

describe('Enhanced Theme System', () => {
  let validator, blender, enhancer;
  
  beforeEach(() => {
    validator = new ColorHarmonyValidator();
    blender = new AdvancedColorBlender();
    enhancer = new ThemePatternEnhancer();
  });
  
  describe('Theme Collection', () => {
    test('should have 8 total themes', () => {
      expect(Object.keys(THEME_PRESETS)).toHaveLength(8);
    });
    
    test('should include all required new themes', () => {
      const requiredThemes = ['dawn', 'ocean', 'forest', 'sunset', 'midnight', 'sunrise', 'monochrome', 'neon', 'pastel'];
      requiredThemes.forEach(theme => {
        expect(THEME_PRESETS).toHaveProperty(theme);
      });
    });
    
    test('should have valid color format for all themes', () => {
      Object.values(THEME_PRESETS).forEach(theme => {
        expect(theme.color1).toMatch(/^#[0-9A-F]{6}$/i);
        expect(theme.color2).toMatch(/^#[0-9A-F]{6}$/i);
        expect(theme.color3).toMatch(/^#[0-9A-F]{6}$/i);
        expect(theme.color4).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });
  });
  
  describe('Rarity Distribution', () => {
    test('should have correct rarity weights', () => {
      const totalWeight = Object.values(THEME_RARITY).reduce((sum, config) => sum + config.weight, 0);
      expect(totalWeight).toBe(100);
    });
    
    test('should distribute themes correctly by rarity', () => {
      expect(THEME_RARITY.common.themes).toHaveLength(4);
      expect(THEME_RARITY.uncommon.themes).toHaveLength(2);
      expect(THEME_RARITY.rare.themes).toHaveLength(2);
      expect(THEME_RARITY.epic.themes).toHaveLength(1);
    });
    
    test('should have statistical distribution within tolerance', () => {
      const selections = [];
      for (let i = 0; i < 10000; i++) {
        selections.push(selectThemeByRarity());
      }
      
      const rarityCount = { common: 0, uncommon: 0, rare: 0, epic: 0 };
      selections.forEach(theme => {
        const rarity = getThemeRarity(theme);
        rarityCount[rarity]++;
      });
      
      expect(rarityCount.common / 10000).toBeCloseTo(0.60, 1);
      expect(rarityCount.uncommon / 10000).toBeCloseTo(0.25, 1);
      expect(rarityCount.rare / 10000).toBeCloseTo(0.12, 1);
      expect(rarityCount.epic / 10000).toBeCloseTo(0.03, 1);
    });
  });
  
  describe('Color Harmony Validation', () => {
    test('should validate all theme palettes for WCAG compliance', () => {
      Object.entries(THEME_PRESETS).forEach(([themeName, colors]) => {
        const colorArray = [colors.color1, colors.color2, colors.color3, colors.color4];
        const validation = validator.validatePalette(colorArray);
        
        expect(validation).toHaveProperty('contrast');
        expect(validation).toHaveProperty('harmony');
        expect(validation).toHaveProperty('accessibility');
        expect(validation).toHaveProperty('balance');
        
        // At least AA compliance for readability
        expect(validation.contrast.minRatio).toBeGreaterThanOrEqual(3.0);
      });
    });
    
    test('should calculate contrast ratios correctly', () => {
      const whiteBlackRatio = validator.calculateContrastRatio('#FFFFFF', '#000000');
      expect(whiteBlackRatio).toBeCloseTo(21, 0);
      
      const sameColorRatio = validator.calculateContrastRatio('#FF0000', '#FF0000');
      expect(sameColorRatio).toBe(1);
    });
  });
  
  describe('Advanced Color Blending', () => {
    test('should create gradients without errors', () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const colors = ['#FF0000', '#00FF00', '#0000FF'];
      
      expect(() => {
        blender.createGradient(ctx, colors, 100, 100, 'linear');
      }).not.toThrow();
      
      expect(() => {
        blender.createGradient(ctx, colors, 100, 100, 'radial');
      }).not.toThrow();
    });
    
    test('should blend colors correctly', () => {
      const red = '#FF0000';
      const blue = '#0000FF';
      
      const blended50 = blender.blendColors(red, blue, 0.5, 'normal');
      expect(blended50).toMatch(/^#[0-9A-F]{6}$/i);
      
      const blended0 = blender.blendColors(red, blue, 0, 'normal');
      expect(blended0.toLowerCase()).toBe(red.toLowerCase());
      
      const blended100 = blender.blendColors(red, blue, 1, 'normal');
      expect(blended100.toLowerCase()).toBe(blue.toLowerCase());
    });
    
    test('should cache gradients for performance', () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const colors = ['#FF0000', '#00FF00'];
      
      const start = performance.now();
      for (let i = 0; i < 100; i++) {
        blender.createGradient(ctx, colors, 100, 100, 'linear');
      }
      const cached = performance.now() - start;
      
      blender.clearCache();
      
      const start2 = performance.now();
      for (let i = 0; i < 100; i++) {
        blender.createGradient(ctx, colors, 100, 100, 'linear');
      }
      const uncached = performance.now() - start2;
      
      expect(cached).toBeLessThan(uncached);
    });
  });
  
  describe('Theme-Pattern Enhancement', () => {
    test('should apply theme effects to all patterns', () => {
      const baseColors = {
        primary: [255, 0, 0],
        secondary: [0, 255, 0],
        accent: [0, 0, 255],
        background: [255, 255, 255]
      };
      
      const patterns = ['interference', 'gentle', 'mandala', 'vectorField', 'shellRidge', 'contourInterference'];
      const themes = Object.keys(THEME_PRESETS);
      
      patterns.forEach(pattern => {
        themes.forEach(theme => {
          const enhanced = enhancer.applyThemeEffects(pattern, theme, baseColors);
          
          expect(enhanced).toHaveProperty('colors');
          expect(enhanced).toHaveProperty('opacity');
          expect(enhanced).toHaveProperty('blending');
          expect(enhanced).toHaveProperty('special');
          
          expect(enhanced.opacity).toBeGreaterThan(0);
          expect(enhanced.opacity).toBeLessThanOrEqual(2);
        });
      });
    });
    
    test('should apply special effects for epic themes', () => {
      const baseColors = {
        primary: [128, 128, 128],
        secondary: [128, 128, 128],
        accent: [128, 128, 128],
        background: [255, 255, 255]
      };
      
      const neonEffects = enhancer.applyThemeEffects('interference', 'neon', baseColors);
      expect(neonEffects.special).toHaveProperty('glowRadius');
      
      const monochromeEffects = enhancer.applyThemeEffects('gentle', 'monochrome', baseColors);
      expect(monochromeEffects.special).toHaveProperty('lineSharpness');
      
      const pastelEffects = enhancer.applyThemeEffects('mandala', 'pastel', baseColors);
      expect(pastelEffects.special).toHaveProperty('floralSoftness');
    });
  });
  
  describe('Performance Tests', () => {
    test('should maintain fast color validation', () => {
      const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFFFF'];
      
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        validator.validatePalette(colors);
      }
      const duration = performance.now() - start;
      
      expect(duration).toBeLessThan(500); // 500ms for 1000 validations
    });
    
    test('should maintain fast theme enhancement', () => {
      const baseColors = {
        primary: [255, 0, 0],
        secondary: [0, 255, 0],
        accent: [0, 0, 255],
        background: [255, 255, 255]
      };
      
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        enhancer.applyThemeEffects('interference', 'neon', baseColors);
      }
      const duration = performance.now() - start;
      
      expect(duration).toBeLessThan(100); // 100ms for 1000 enhancements
    });
    
    test('should maintain fast color blending', () => {
      const start = performance.now();
      for (let i = 0; i < 10000; i++) {
        blender.blendColors('#FF0000', '#0000FF', Math.random(), 'normal');
      }
      const duration = performance.now() - start;
      
      expect(duration).toBeLessThan(200); // 200ms for 10000 blends
    });
  });
});

// Helper functions for tests
function selectThemeByRarity() {
  const random = Math.random() * 100;
  let cumulative = 0;
  
  for (const [rarity, config] of Object.entries(THEME_RARITY)) {
    cumulative += config.weight;
    if (random <= cumulative) {
      const themes = config.themes;
      return themes[Math.floor(Math.random() * themes.length)];
    }
  }
  return 'dawn';
}

function getThemeRarity(themeName) {
  for (const [rarity, config] of Object.entries(THEME_RARITY)) {
    if (config.themes.includes(themeName)) {
      return rarity;
    }
  }
  return 'common';
}
```

**VALIDATE**: Run complete test suite with `npm test enhanced-theme-system.test.js`. All tests should pass. Performance tests should complete within specified time limits. Visual inspection of all theme-pattern combinations should show distinct effects.

**IF_FAIL**: Debug failing tests individually. Check performance bottlenecks with profiler. Verify test expectations match actual implementation behavior.

**ROLLBACK**: `rm test/enhanced-theme-system.test.js`

---

**ACTION** Performance Validation:

**OPERATION**: Run comprehensive performance tests across all theme-pattern combinations to ensure 60fps target is maintained.

**Implementation Details**:
```javascript
// Add to main application for performance monitoring
class PerformanceMonitor {
  constructor() {
    this.frameTimings = [];
    this.memoryUsage = [];
    this.isMonitoring = false;
  }
  
  startMonitoring() {
    this.isMonitoring = true;
    this.frameTimings = [];
    this.memoryUsage = [];
    this.lastFrameTime = performance.now();
  }
  
  recordFrame() {
    if (!this.isMonitoring) return;
    
    const now = performance.now();
    const frameTime = now - this.lastFrameTime;
    this.frameTimings.push(frameTime);
    this.lastFrameTime = now;
    
    // Record memory usage every 60 frames
    if (this.frameTimings.length % 60 === 0 && performance.memory) {
      this.memoryUsage.push(performance.memory.usedJSHeapSize);
    }
    
    // Keep only last 300 frame timings (5 seconds at 60fps)
    if (this.frameTimings.length > 300) {
      this.frameTimings.shift();
    }
  }
  
  getStats() {
    if (this.frameTimings.length === 0) return null;
    
    const avgFrameTime = this.frameTimings.reduce((a, b) => a + b) / this.frameTimings.length;
    const maxFrameTime = Math.max(...this.frameTimings);
    const minFrameTime = Math.min(...this.frameTimings);
    const fps = 1000 / avgFrameTime;
    
    const framesBelowTarget = this.frameTimings.filter(t => t > 16.67).length;
    const performance60fps = (1 - framesBelowTarget / this.frameTimings.length) * 100;
    
    return {
      avgFrameTime: avgFrameTime.toFixed(2),
      maxFrameTime: maxFrameTime.toFixed(2),
      minFrameTime: minFrameTime.toFixed(2),
      fps: fps.toFixed(1),
      performance60fps: performance60fps.toFixed(1),
      memoryTrend: this.getMemoryTrend()
    };
  }
  
  getMemoryTrend() {
    if (this.memoryUsage.length < 2) return 'stable';
    
    const start = this.memoryUsage[0];
    const end = this.memoryUsage[this.memoryUsage.length - 1];
    const change = ((end - start) / start) * 100;
    
    if (change > 10) return 'increasing';
    if (change < -10) return 'decreasing';
    return 'stable';
  }
}
```

**VALIDATE**: Run performance monitoring for 5 minutes on each theme-pattern combination. Verify average FPS stays above 55. Check memory usage remains stable. Confirm no performance degradation over time.

**IF_FAIL**: Profile the specific theme-pattern combinations causing performance issues. Optimize color calculations or reduce effect intensity. Consider adaptive quality settings for lower-end devices.

**ROLLBACK**: Remove performance monitoring code if it impacts performance itself.

## Validation Strategy

### Unit Testing
- **ColorHarmonyValidator**: Test contrast calculations, WCAG compliance, accessibility simulation
- **AdvancedColorBlender**: Test gradient creation, blend modes, caching performance
- **ThemePatternEnhancer**: Test effect application, color modifications, special effects

### Integration Testing  
- **Theme Selection**: Test rarity distribution over large sample sizes
- **UI Integration**: Test theme switching, rarity display, visual feedback
- **Pattern Enhancement**: Test all theme-pattern combinations

### Performance Testing
- **Frame Rate**: Monitor 60fps maintenance across all combinations
- **Memory Usage**: Test for memory leaks over extended periods
- **Load Time**: Ensure new features don't significantly impact initialization
- **Cache Effectiveness**: Verify caching improves repeated operations

### Visual Testing
- **Color Accuracy**: Verify hex values match design specifications
- **Effect Quality**: Check glow, blur, and blend effects render correctly
- **Accessibility**: Test with color blindness simulation tools
- **Cross-browser**: Verify consistent appearance across browsers

## Quality Checklist

- [ ] All 8 themes implemented with correct color values
- [ ] Rarity distribution working (60/25/12/3% ±2% tolerance)
- [ ] WCAG AA color contrast compliance for all themes
- [ ] Theme-specific effects working (neon glow, monochrome contrast, pastel softening)
- [ ] Advanced color blending optimized and cached
- [ ] UI displays rarity indicators correctly
- [ ] Performance maintained at 60fps across all combinations
- [ ] Memory usage stable over 24+ hour periods
- [ ] TokenMetadata includes theme rarity and harmony scores
- [ ] Comprehensive test coverage (>90% code coverage)
- [ ] Cross-browser compatibility verified
- [ ] Accessibility features tested with screen readers
- [ ] Visual regression testing completed
- [ ] Performance benchmarks documented

## Success Metrics

**Quantitative Targets**:
- 8 total themes (baseline: 5) = **+60% theme variety**
- Rarity distribution accuracy: **±2% tolerance from target**
- WCAG AA compliance: **4.5:1 minimum contrast ratio**
- Performance: **60fps maintained, <100MB memory usage**
- Load time: **<3 seconds with all new features**

**Qualitative Targets**:
- Visually distinct theme personalities with recognizable characteristics
- Harmonious color relationships that feel professionally designed
- Accessible for color blind users with proper contrast
- Enhanced visual appeal significantly better than basic themes
- Smooth, polished user experience with rarity indicators

This comprehensive TASK PRP provides detailed, actionable steps for implementing the Phase 3 Enhanced Theme System with proper validation, performance considerations, and quality assurance measures.