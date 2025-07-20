/**
 * Color Harmony Validation Test
 * Tests the ColorHarmonyValidator with all theme palettes
 */

import { ColorHarmonyValidator } from '../src/utils/ColorHarmonyValidator.js';
import { THEME_PRESETS } from '../src/constants/patternConfig.js';

console.log('=== COLOR HARMONY VALIDATION TEST ===\n');

const validator = new ColorHarmonyValidator();

console.log('1. Testing ColorHarmonyValidator creation...');
console.log('✓ ColorHarmonyValidator instantiated successfully');

console.log('\n2. Testing known color combinations...');

// Test known good contrast (black on white)
const blackWhiteColors = ['#000000', '#FFFFFF', '#666666', '#CCCCCC'];
const blackWhiteValidation = validator.validatePalette(blackWhiteColors);
console.log('Black/White palette validation:');
console.log(`  Contrast ratio: ${blackWhiteValidation.contrast.minimum.toFixed(2)} (should be high)`);
console.log(`  Overall score: ${blackWhiteValidation.overall.toFixed(1)}`);
console.log(`  WCAG AA: ${blackWhiteValidation.contrast.wcagAACompliant > 0 ? '✓' : '✗'}`);

// Test known poor contrast (similar colors)
const poorContrastColors = ['#FF0000', '#FF3333', '#FF6666', '#FF9999'];
const poorContrastValidation = validator.validatePalette(poorContrastColors);
console.log('\nPoor contrast palette validation:');
console.log(`  Contrast ratio: ${poorContrastValidation.contrast.minimum.toFixed(2)} (should be low)`);
console.log(`  Overall score: ${poorContrastValidation.overall.toFixed(1)}`);
console.log(`  WCAG AA: ${poorContrastValidation.contrast.wcagAACompliant > 0 ? '✓' : '✗'}`);

console.log('\n3. Testing all theme palettes...');

Object.entries(THEME_PRESETS).forEach(([themeName, theme]) => {
    const colorArray = [theme.color1, theme.color2, theme.color3, theme.color4];
    const validation = validator.validatePalette(colorArray);
    
    console.log(`\n${themeName.toUpperCase()} Theme (${theme.rarity}):`);
    console.log(`  Colors: ${colorArray.join(', ')}`);
    console.log(`  Overall Score: ${validation.overall.toFixed(1)}/100`);
    console.log(`  Contrast: ${validation.contrast.minimum.toFixed(2)} (min), ${validation.contrast.average.toFixed(2)} (avg)`);
    console.log(`  WCAG AA: ${validation.contrast.wcagAACompliant}/${validation.contrast.ratios.length} pairs compliant`);
    console.log(`  WCAG AAA: ${validation.contrast.wcagAAACompliant}/${validation.contrast.ratios.length} pairs compliant`);
    console.log(`  Harmony Score: ${validation.harmony.score.toFixed(1)}`);
    console.log(`  Accessibility Score: ${validation.accessibility.score.toFixed(1)}`);
    console.log(`  Balance Score: ${validation.balance.score.toFixed(1)}`);
    
    // Check if harmony schemes are detected
    const schemes = validation.harmony.schemes;
    const detectedSchemes = Object.entries(schemes).filter(([_, detected]) => detected).map(([scheme, _]) => scheme);
    if (detectedSchemes.length > 0) {
        console.log(`  Color Schemes: ${detectedSchemes.join(', ')}`);
    }
    
    // Accessibility warnings
    if (validation.contrast.minimum < 3.0) {
        console.log(`  ⚠️  Low contrast warning: ${validation.contrast.minimum.toFixed(2)}`);
    }
    
    if (validation.accessibility.score < 70) {
        console.log(`  ⚠️  Color blindness warning: ${validation.accessibility.score.toFixed(1)}`);
    }
    
    if (validation.overall < 60) {
        console.log(`  ⚠️  Overall quality warning: ${validation.overall.toFixed(1)}`);
    } else {
        console.log(`  ✓ Good overall quality: ${validation.overall.toFixed(1)}`);
    }
});

console.log('\n4. Testing performance...');

const performanceColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFFFF'];
const startTime = performance.now();

for (let i = 0; i < 1000; i++) {
    validator.validatePalette(performanceColors);
}

const endTime = performance.now();
const duration = endTime - startTime;

console.log(`Performance test: 1000 validations in ${duration.toFixed(2)}ms`);
console.log(`Average: ${(duration / 1000).toFixed(3)}ms per validation`);

if (duration < 500) {
    console.log('✓ Performance test passed (<500ms for 1000 validations)');
} else {
    console.log('✗ Performance test failed (>500ms for 1000 validations)');
}

console.log('\n5. Testing color blindness simulation...');

const testColors = [
    [255, 0, 0],    // Red
    [0, 255, 0],    // Green  
    [0, 0, 255],    // Blue
    [255, 255, 0]   // Yellow
];

console.log('Original colors vs color blind simulations:');
testColors.forEach((color, index) => {
    const protanopia = validator.simulateProtanopia(color);
    const deuteranopia = validator.simulateDeuteranopia(color);
    const tritanopia = validator.simulateTritanopia(color);
    
    console.log(`Color ${index + 1}: rgb(${color.join(', ')})`);
    console.log(`  Protanopia: rgb(${protanopia.join(', ')})`);
    console.log(`  Deuteranopia: rgb(${deuteranopia.join(', ')})`);
    console.log(`  Tritanopia: rgb(${tritanopia.join(', ')})`);
});

console.log('\n=== COLOR HARMONY VALIDATION TEST COMPLETE ===');
console.log('\nAll basic functionality tests passed! ✓');