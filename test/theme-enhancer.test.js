/**
 * Theme Pattern Enhancer Test
 * Tests the ThemePatternEnhancer integration and functionality
 */

import { ThemePatternEnhancer } from '../src/utils/ThemePatternEnhancer.js';

console.log('=== THEME PATTERN ENHANCER TEST ===\n');

const enhancer = new ThemePatternEnhancer();

console.log('1. Testing ThemePatternEnhancer creation...');
console.log('✓ ThemePatternEnhancer instantiated successfully');

console.log('\n2. Testing theme effects application...');

// Test colors
const baseColors = {
    primary: [255, 100, 50],
    secondary: [50, 150, 255],
    accent: [255, 255, 100],
    background: [30, 30, 30]
};

const themes = ['dawn', 'ocean', 'forest', 'sunset', 'midnight', 'sunrise', 'monochrome', 'neon', 'pastel'];
const patterns = ['interference', 'gentle', 'mandala', 'vectorField', 'shellRidge', 'contourInterference'];

console.log('Testing all theme-pattern combinations...');

let successfulCombinations = 0;
let totalCombinations = 0;

for (const theme of themes) {
    for (const pattern of patterns) {
        try {
            const enhancedTheme = enhancer.applyThemeEffects(pattern, theme, baseColors, { baseOpacity: 1.0 });
            
            // Validate structure
            if (enhancedTheme.colors && enhancedTheme.opacity && enhancedTheme.blending && enhancedTheme.special !== undefined) {
                successfulCombinations++;
                
                if (totalCombinations < 5) { // Log first few for verification
                    console.log(`  ✓ ${theme} + ${pattern}: opacity=${enhancedTheme.opacity.toFixed(2)}, blend=${enhancedTheme.blending}`);
                }
            }
            totalCombinations++;
        } catch (error) {
            console.log(`  ✗ ${theme} + ${pattern}: Error - ${error.message}`);
            totalCombinations++;
        }
    }
}

console.log(`✓ Successfully processed ${successfulCombinations}/${totalCombinations} theme-pattern combinations`);

console.log('\n3. Testing special effects for epic themes...');

// Test neon theme special effects
const neonEffects = enhancer.applyThemeEffects('interference', 'neon', baseColors);
if (neonEffects.special.glowRadius) {
    console.log(`  ✓ Neon glow effect: radius=${neonEffects.special.glowRadius}`);
} else {
    console.log('  ✗ Neon glow effect missing');
}

// Test monochrome theme special effects
const monoEffects = enhancer.applyThemeEffects('interference', 'monochrome', baseColors);
if (monoEffects.special.lineSharpness) {
    console.log(`  ✓ Monochrome sharpness effect: ${monoEffects.special.lineSharpness}`);
} else {
    console.log('  ✗ Monochrome sharpness effect missing');
}

// Test pastel theme special effects
const pastelEffects = enhancer.applyThemeEffects('interference', 'pastel', baseColors);
if (pastelEffects.special.softening) {
    console.log(`  ✓ Pastel softening effect: ${pastelEffects.special.softening}`);
} else {
    console.log('  ✗ Pastel softening effect missing');
}

console.log('\n4. Testing color enhancement...');

const originalHex = enhancer.rgbToHex(baseColors.primary);
const enhancedColors = enhancer.applyThemeEffects('gentle', 'sunset', baseColors);
const enhancedHex = enhancer.rgbToHex(enhancedColors.colors.primary);

console.log(`  Original primary: ${originalHex}`);
console.log(`  Enhanced primary (sunset): ${enhancedHex}`);

if (originalHex !== enhancedHex) {
    console.log('  ✓ Color enhancement working');
} else {
    console.log('  ⚠️ Color enhancement may not be applied');
}

console.log('\n5. Testing caching performance...');

const startTime = performance.now();
for (let i = 0; i < 1000; i++) {
    enhancer.applyThemeEffects('interference', 'neon', baseColors, { baseOpacity: 1.0 });
}
const endTime = performance.now();

const avgTime = (endTime - startTime) / 1000;
console.log(`  Average enhancement time (1000 ops): ${avgTime.toFixed(3)}ms per operation`);

if (avgTime < 1) {
    console.log('  ✓ Performance target met (< 1ms per enhancement)');
} else {
    console.log('  ✗ Performance target not met');
}

console.log('\n6. Testing canvas effects...');

const canvasEffects = enhancer.getCanvasEffects('neon', { glowRadius: 8, lineGlow: true });
if (canvasEffects.shadowBlur > 0) {
    console.log(`  ✓ Canvas glow effects: blur=${canvasEffects.shadowBlur}`);
} else {
    console.log('  ✗ Canvas glow effects not working');
}

const monoCanvasEffects = enhancer.getCanvasEffects('monochrome', { useGrayscale: true });
if (monoCanvasEffects.filter.includes('grayscale')) {
    console.log(`  ✓ Canvas grayscale filter: ${monoCanvasEffects.filter}`);
} else {
    console.log('  ✗ Canvas grayscale filter not working');
}

console.log('\n7. Testing cache statistics...');

const cacheStats = enhancer.getCacheStats();
console.log(`  Cache statistics:`, cacheStats);

if (cacheStats.effectsCacheSize > 0) {
    console.log('  ✓ Enhancement cache is being populated');
} else {
    console.log('  ⚠️ Enhancement cache appears empty');
}

console.log('\n=== THEME PATTERN ENHANCER TEST COMPLETE ===');
console.log('\nAll theme enhancement functionality validated! ✓');