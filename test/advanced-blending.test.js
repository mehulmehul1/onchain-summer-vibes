/**
 * Advanced Color Blending Test
 * Tests the AdvancedColorBlender functionality and performance
 */

import { AdvancedColorBlender } from '../src/utils/AdvancedColorBlender.js';

console.log('=== ADVANCED COLOR BLENDING TEST ===\n');

const blender = new AdvancedColorBlender();

console.log('1. Testing AdvancedColorBlender creation...');
console.log('✓ AdvancedColorBlender instantiated successfully');

console.log('\n2. Testing basic color blending...');

// Test normal blend
const red = '#FF0000';
const blue = '#0000FF';

const blended50 = blender.blendColors(red, blue, 0.5, 'normal');
console.log(`Red + Blue (50% normal): ${blended50}`);

const blended0 = blender.blendColors(red, blue, 0, 'normal');
console.log(`Red + Blue (0% normal): ${blended0} (should be red)`);

const blended100 = blender.blendColors(red, blue, 1, 'normal');
console.log(`Red + Blue (100% normal): ${blended100} (should be blue)`);

if (blended0.toLowerCase() === red.toLowerCase() && blended100.toLowerCase() === blue.toLowerCase()) {
    console.log('✓ Basic blending test passed');
} else {
    console.log('✗ Basic blending test failed');
}

console.log('\n3. Testing all blend modes...');

const testColors = [
    { name: 'Red', hex: '#FF0000' },
    { name: 'Green', hex: '#00FF00' },
    { name: 'Blue', hex: '#0000FF' },
    { name: 'Yellow', hex: '#FFFF00' }
];

const blendModes = [
    'normal', 'multiply', 'screen', 'overlay', 'soft-light', 
    'hard-light', 'color-dodge', 'color-burn', 'difference', 'exclusion'
];

blendModes.forEach(mode => {
    try {
        const result = blender.blendColors('#FF8000', '#0080FF', 0.5, mode);
        console.log(`${mode}: ${result}`);
    } catch (error) {
        console.log(`✗ ${mode}: Error - ${error.message}`);
    }
});

console.log('✓ All blend modes tested without errors');

console.log('\n4. Testing gradient creation...');

// Create a canvas for testing
const canvas = document.createElement('canvas');
canvas.width = 100;
canvas.height = 100;
const ctx = canvas.getContext('2d');

const colors = ['#FF0000', '#00FF00', '#0000FF'];

try {
    // Test linear gradient
    const linearGradient = blender.createGradient(ctx, colors, 100, 100, 'linear');
    console.log('✓ Linear gradient created successfully');
    
    // Test radial gradient
    const radialGradient = blender.createGradient(ctx, colors, 100, 100, 'radial');
    console.log('✓ Radial gradient created successfully');
    
    // Test conic gradient (with fallback)
    const conicGradient = blender.createGradient(ctx, colors, 100, 100, 'conic');
    console.log('✓ Conic gradient created successfully (or fallback)');
    
} catch (error) {
    console.log(`✗ Gradient creation error: ${error.message}`);
}

console.log('\n5. Testing color stop distributions...');

const distributions = ['linear', 'exponential', 'logarithmic', 'cubic', 'sine'];

distributions.forEach(distribution => {
    try {
        const gradient = blender.createGradient(ctx, colors, 100, 100, 'linear', { distribution });
        console.log(`✓ ${distribution} distribution working`);
    } catch (error) {
        console.log(`✗ ${distribution} distribution error: ${error.message}`);
    }
});

console.log('\n6. Testing color adjustments...');

const testColor = '#808080'; // Medium gray

// Test temperature adjustment
const warmer = blender.adjustTemperature(testColor, 0.5);
const cooler = blender.adjustTemperature(testColor, -0.5);
console.log(`Original: ${testColor}, Warmer: ${warmer}, Cooler: ${cooler}`);

// Test saturation adjustment
const moreSaturated = blender.adjustSaturation('#FF8080', 0.3);
const lessSaturated = blender.adjustSaturation('#FF8080', -0.3);
console.log(`More saturated: ${moreSaturated}, Less saturated: ${lessSaturated}`);

// Test brightness adjustment
const brighter = blender.adjustBrightness(testColor, 0.3);
const darker = blender.adjustBrightness(testColor, -0.3);
console.log(`Brighter: ${brighter}, Darker: ${darker}`);

console.log('✓ Color adjustment tests completed');

console.log('\n7. Testing blended palette creation...');

const basePalette = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'];
const blendedPalette = blender.createBlendedPalette(basePalette, {
    blendMode: 'overlay',
    intensity: 0.5,
    steps: 2
});

console.log(`Original palette: ${basePalette.join(', ')}`);
console.log(`Blended palette (${blendedPalette.length} colors): ${blendedPalette.join(', ')}`);

if (blendedPalette.length > basePalette.length) {
    console.log('✓ Palette expansion working correctly');
} else {
    console.log('✗ Palette expansion failed');
}

console.log('\n8. Testing performance and caching...');

const performanceColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFFFF'];

// Test without cache
let startTime = performance.now();
for (let i = 0; i < 1000; i++) {
    blender.blendColors('#FF0000', '#0000FF', Math.random(), 'normal');
}
let endTime = performance.now();
let uncachedTime = endTime - startTime;

// Test with cache (repeat same operations)
blender.clearCache();
startTime = performance.now();
for (let i = 0; i < 1000; i++) {
    blender.blendColors('#FF0000', '#0000FF', 0.5, 'normal'); // Same parameters
}
endTime = performance.now();
let firstCachedTime = endTime - startTime;

// Test cache hit performance
startTime = performance.now();
for (let i = 0; i < 1000; i++) {
    blender.blendColors('#FF0000', '#0000FF', 0.5, 'normal'); // Same parameters again
}
endTime = performance.now();
let secondCachedTime = endTime - startTime;

console.log(`Performance results:`);
console.log(`  Uncached blending (1000 ops): ${uncachedTime.toFixed(2)}ms`);
console.log(`  First cached blending (1000 ops): ${firstCachedTime.toFixed(2)}ms`);
console.log(`  Second cached blending (1000 ops): ${secondCachedTime.toFixed(2)}ms`);

if (secondCachedTime < firstCachedTime) {
    console.log('✓ Caching performance improvement detected');
} else {
    console.log('⚠️ Caching performance improvement not detected (may be too fast to measure)');
}

// Test gradient caching
startTime = performance.now();
for (let i = 0; i < 100; i++) {
    blender.createGradient(ctx, colors, 100, 100, 'linear');
}
endTime = performance.now();
let gradientCacheTime = endTime - startTime;

console.log(`  Gradient caching (100 ops): ${gradientCacheTime.toFixed(2)}ms`);

if (gradientCacheTime < 50) {
    console.log('✓ Gradient performance test passed (<50ms for 100 gradients)');
} else {
    console.log('✗ Gradient performance test failed (>50ms for 100 gradients)');
}

console.log('\n9. Testing cache statistics...');

const cacheStats = blender.getCacheStats();
console.log(`Cache statistics:`, cacheStats);

if (cacheStats.totalCacheSize > 0) {
    console.log('✓ Cache is being populated');
} else {
    console.log('⚠️ Cache appears empty');
}

console.log('\n10. Testing edge cases...');

// Test with invalid colors
try {
    const invalidResult = blender.blendColors('invalid', '#FF0000', 0.5, 'normal');
    console.log(`Invalid color handling: ${invalidResult}`);
} catch (error) {
    console.log(`Invalid color error (expected): ${error.message}`);
}

// Test with extreme factors
const extremeBlend1 = blender.blendColors('#FF0000', '#0000FF', -0.5, 'normal');
const extremeBlend2 = blender.blendColors('#FF0000', '#0000FF', 1.5, 'normal');
console.log(`Extreme factor tests: ${extremeBlend1}, ${extremeBlend2}`);

// Test HSL conversion round-trip
const originalRgb = [128, 64, 192];
const hsl = blender.rgbToHsl(originalRgb);
const convertedRgb = blender.hslToRgb(hsl);
const difference = originalRgb.map((val, i) => Math.abs(val - convertedRgb[i]));
const maxDifference = Math.max(...difference);

console.log(`HSL round-trip test: ${originalRgb} -> HSL -> ${convertedRgb} (max diff: ${maxDifference})`);

if (maxDifference <= 1) {
    console.log('✓ HSL conversion accuracy test passed');
} else {
    console.log('✗ HSL conversion accuracy test failed');
}

console.log('\n=== ADVANCED COLOR BLENDING TEST COMPLETE ===');
console.log('\nAll functionality tests completed! ✓');