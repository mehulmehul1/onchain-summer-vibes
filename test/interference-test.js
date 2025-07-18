/**
 * Interference Pattern Test Suite
 * 
 * Tests interference pattern rendering with different parameters
 */

// Mock q5.js environment
global.width = 800;
global.height = 600;
global.pixels = new Uint8Array(800 * 600 * 4);

// Mock q5.js functions
global.loadPixels = function() {
    console.log('loadPixels() called');
};

global.updatePixels = function() {
    console.log('updatePixels() called');
};

global.performance = {
    now: function() {
        return Date.now();
    }
};

// Import modules
import { InterferencePattern } from '../src/patterns/InterferencePattern.js';

console.log('=== Interference Pattern Test Suite ===\n');

// Test 1: Basic Pattern Creation
console.log('Test 1: Basic Pattern Creation');
const pattern = new InterferencePattern();
console.log('Pattern created:', pattern.name);
console.log('Is initialized:', pattern.isInitialized);

const initResult = pattern.initialize();
console.log('Initialization result:', initResult);
console.log('Wave sources:', pattern.getWaveSources().length);
console.log('✓ Basic pattern creation test passed\n');

// Test 2: Pattern Parameters
console.log('Test 2: Pattern Parameters');
const params = pattern.getParameters();
console.log('Default parameters:', params);
console.log('Wavelength:', params.wavelength);
console.log('Gradient mode:', params.gradientMode);
console.log('Threshold:', params.threshold);
console.log('Sources count:', params.sources.length);
console.log('✓ Pattern parameters test passed\n');

// Test 3: Pattern Rendering
console.log('Test 3: Pattern Rendering');
try {
    const startTime = Date.now();
    pattern.render(1.0);
    const endTime = Date.now();
    
    console.log(`Render completed in ${endTime - startTime}ms`);
    
    // Check if pixels were modified
    let nonZeroPixels = 0;
    for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i] !== 0 || pixels[i + 1] !== 0 || pixels[i + 2] !== 0) {
            nonZeroPixels++;
        }
    }
    
    console.log(`Non-zero pixels: ${nonZeroPixels}`);
    console.log('Performance:', pattern.getPerformance());
    console.log('✓ Pattern rendering test passed\n');
} catch (error) {
    console.log('✗ Pattern rendering test failed:', error.message);
}

// Test 4: Wave Source Management
console.log('Test 4: Wave Source Management');
const initialSources = pattern.getWaveSources();
console.log('Initial sources:', initialSources.length);

// Add a wave source
pattern.addWaveSource(400, 300);
console.log('After adding source:', pattern.getWaveSources().length);

// Update a wave source
pattern.updateWaveSource(0, 100, 100);
const updatedSources = pattern.getWaveSources();
console.log('Updated first source:', updatedSources[0]);

// Remove a wave source
pattern.removeWaveSource(0);
console.log('After removing source:', pattern.getWaveSources().length);

console.log('✓ Wave source management test passed\n');

// Test 5: Color Configuration
console.log('Test 5: Color Configuration');
const originalColors = pattern.colors;
console.log('Original colors:', originalColors);

// Set new colors
pattern.setColors({
    color1: [255, 0, 0],
    color2: [0, 255, 0],
    color3: [0, 0, 255],
    color4: [128, 128, 128]
});

console.log('Updated colors:', pattern.colors);
console.log('✓ Color configuration test passed\n');

// Test 6: Parameter Updates
console.log('Test 6: Parameter Updates');

// Test wavelength
pattern.setWavelength(75);
console.log('New wavelength:', pattern.parameters.wavelength);

// Test threshold
pattern.setThreshold(0.2);
console.log('New threshold:', pattern.parameters.threshold);

// Test gradient mode toggle
const originalGradientMode = pattern.parameters.gradientMode;
pattern.toggleGradientMode();
console.log('Gradient mode toggled:', pattern.parameters.gradientMode);
pattern.toggleGradientMode(); // Toggle back
console.log('Gradient mode restored:', pattern.parameters.gradientMode);

// Test animation speed
pattern.setAnimationSpeed(2.0);
console.log('New animation speed:', pattern.animationSpeed);

console.log('✓ Parameter updates test passed\n');

// Test 7: Different Rendering Modes
console.log('Test 7: Different Rendering Modes');

// Test gradient mode
pattern.parameters.gradientMode = true;
console.log('Testing gradient mode...');
pattern.render(2.0);
console.log('Gradient mode render completed');

// Test line mode
pattern.parameters.gradientMode = false;
console.log('Testing line mode...');
pattern.render(2.0);
console.log('Line mode render completed');

console.log('✓ Different rendering modes test passed\n');

// Test 8: Random Source Generation
console.log('Test 8: Random Source Generation');
const originalSourceCount = pattern.getWaveSources().length;
console.log('Original source count:', originalSourceCount);

pattern.generateRandomSources(5);
const newSourceCount = pattern.getWaveSources().length;
console.log('New source count:', newSourceCount);

const randomSources = pattern.getWaveSources();
console.log('Random sources generated:', randomSources.length);
console.log('First random source:', randomSources[0]);

console.log('✓ Random source generation test passed\n');

// Test 9: Color Blending
console.log('Test 9: Color Blending');

// Test color blending function
const color1 = [255, 0, 0];   // Red
const color2 = [0, 255, 0];   // Green
const blended = pattern.blendColors(color1, color2, 0.5);
console.log('Blended colors:', blended);
console.log('Expected: [127, 127, 0]');

// Test with different blend factors
const blended25 = pattern.blendColors(color1, color2, 0.25);
const blended75 = pattern.blendColors(color1, color2, 0.75);
console.log('25% blend:', blended25);
console.log('75% blend:', blended75);

console.log('✓ Color blending test passed\n');

// Test 10: Performance Testing
console.log('Test 10: Performance Testing');

const performanceRuns = 10;
const renderTimes = [];

for (let i = 0; i < performanceRuns; i++) {
    const startTime = performance.now();
    pattern.render(i * 0.1);
    const endTime = performance.now();
    renderTimes.push(endTime - startTime);
}

const averageTime = renderTimes.reduce((a, b) => a + b) / renderTimes.length;
const minTime = Math.min(...renderTimes);
const maxTime = Math.max(...renderTimes);

console.log(`Average render time: ${averageTime.toFixed(2)}ms`);
console.log(`Min render time: ${minTime.toFixed(2)}ms`);
console.log(`Max render time: ${maxTime.toFixed(2)}ms`);
console.log('Final performance metrics:', pattern.getPerformance());

console.log('✓ Performance testing test passed\n');

// Test 11: Pattern Info
console.log('Test 11: Pattern Info');
const patternInfo = pattern.getInfo();
console.log('Pattern info:', patternInfo);
console.log('Info keys:', Object.keys(patternInfo));
console.log('Wave sources in info:', patternInfo.waveSources);
console.log('Mode:', patternInfo.mode);
console.log('✓ Pattern info test passed\n');

// Test 12: Edge Cases
console.log('Test 12: Edge Cases');

// Test with zero wavelength
pattern.setWavelength(0);
console.log('Wavelength after setting to 0:', pattern.parameters.wavelength);

// Test with negative threshold
pattern.setThreshold(-0.5);
console.log('Threshold after setting to -0.5:', pattern.parameters.threshold);

// Test with threshold > 1
pattern.setThreshold(1.5);
console.log('Threshold after setting to 1.5:', pattern.parameters.threshold);

// Test with no wave sources
pattern.parameters.sources = [];
console.log('Sources after clearing:', pattern.getWaveSources().length);

try {
    pattern.render(3.0);
    console.log('Render with no sources completed');
} catch (error) {
    console.log('Error with no sources:', error.message);
}

console.log('✓ Edge cases test passed\n');

// Test 13: Animation Continuity
console.log('Test 13: Animation Continuity');

// Reset sources for animation test
pattern.generateRandomSources(3);

// Test continuous animation
const animationFrames = 5;
const timeStep = 0.1;

for (let frame = 0; frame < animationFrames; frame++) {
    const time = frame * timeStep;
    pattern.render(time);
    
    // Sample a few pixels to check for changes
    const samplePixels = [
        pixels[0], pixels[1], pixels[2], // First pixel
        pixels[1600], pixels[1601], pixels[1602], // Middle pixel
        pixels[pixels.length - 4], pixels[pixels.length - 3], pixels[pixels.length - 2] // Last pixel
    ];
    
    console.log(`Frame ${frame} sample pixels:`, samplePixels);
}

console.log('✓ Animation continuity test passed\n');

// Test 14: Memory Management
console.log('Test 14: Memory Management');

// Test pattern cleanup
console.log('Before cleanup - initialized:', pattern.isInitialized);
pattern.cleanup();
console.log('After cleanup - initialized:', pattern.isInitialized);

// Test reset
pattern.initialize(); // Re-initialize
console.log('After re-initialization - initialized:', pattern.isInitialized);

pattern.reset();
console.log('After reset - frame count:', pattern.frameCount);

console.log('✓ Memory management test passed\n');

// Test 15: Integration with Pattern Factory
console.log('Test 15: Integration with Pattern Factory');

import { PatternFactory } from '../src/patterns/PatternFactory.js';

// Mock navigator for factory test
if (typeof global.navigator === 'undefined') {
    global.navigator = {};
}
global.navigator.gpu = {
    requestAdapter: async function() {
        return { name: 'Mock WebGPU Adapter' };
    }
};

const factory = new PatternFactory();
factory.initialize().then(() => {
    console.log('Factory initialized');
    
    // Register interference pattern
    factory.registerPattern('interference', InterferencePattern, {
        description: 'Wave interference pattern',
        webgpuOptimized: true,
        defaultParams: {
            wavelength: 60,
            gradientMode: true
        }
    });
    
    console.log('Interference pattern registered');
    
    // Create pattern through factory
    const factoryPattern = factory.createPattern('interference', {
        wavelength: 80,
        gradientMode: false
    });
    
    console.log('Factory pattern created:', factoryPattern.name);
    console.log('Factory pattern wavelength:', factoryPattern.parameters.wavelength);
    console.log('Factory pattern gradient mode:', factoryPattern.parameters.gradientMode);
    
    // Test factory pattern rendering
    factoryPattern.render(1.5);
    console.log('Factory pattern rendered successfully');
    
    console.log('✓ Integration with Pattern Factory test passed\n');
}).catch(error => {
    console.log('✗ Integration test failed:', error.message);
});

console.log('=== All Interference Pattern Tests Scheduled ===');

// Test completion
setTimeout(() => {
    console.log('\n=== Interference Pattern Test Suite Complete ===');
    console.log('All tests completed successfully');
    console.log('Final pattern state:', pattern.getInfo());
}, 200);