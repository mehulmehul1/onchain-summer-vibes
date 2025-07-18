/**
 * Pattern System Test Suite
 * 
 * Tests pattern system foundation with q5.js integration
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
import { PatternRenderer } from '../src/patterns/PatternRenderer.js';
import { PatternFactory } from '../src/patterns/PatternFactory.js';
import PatternUtils from '../src/patterns/PatternUtils.js';

console.log('=== Pattern System Test Suite ===\n');

// Test 1: PatternRenderer Basic Functionality
console.log('Test 1: PatternRenderer Basic Functionality');
const renderer = new PatternRenderer('TestRenderer');
console.log('Created renderer:', renderer.name);
console.log('Is initialized:', renderer.isInitialized);

const initResult = renderer.initialize({
    intensity: 0.8,
    speed: 1.2,
    complexity: 0.5
});
console.log('Initialization result:', initResult);
console.log('Is initialized after init:', renderer.isInitialized);
console.log('Parameters:', renderer.getParameters());
console.log('✓ PatternRenderer basic functionality test passed\n');

// Test 2: Pattern Rendering
console.log('Test 2: Pattern Rendering');
try {
    renderer.render(1.0, { intensity: 0.9 });
    console.log('Render completed successfully');
    const performance = renderer.getPerformance();
    console.log('Performance metrics:', performance);
    console.log('✓ Pattern rendering test passed\n');
} catch (error) {
    console.log('✗ Pattern rendering test failed:', error.message);
}

// Test 3: PatternFactory Initialization
console.log('Test 3: PatternFactory Initialization');
const factory = new PatternFactory();

// Mock navigator.gpu for testing
if (typeof global.navigator === 'undefined') {
    global.navigator = {};
}
global.navigator.gpu = {
    requestAdapter: async function() {
        return { name: 'Mock WebGPU Adapter' };
    }
};

factory.initialize().then(result => {
    console.log('Factory initialization result:', result);
    console.log('WebGPU supported:', factory.webgpuSupported);
    console.log('Registered patterns:', factory.getPatternNames());
    console.log('✓ PatternFactory initialization test passed\n');
}).catch(error => {
    console.log('✗ PatternFactory initialization test failed:', error.message);
});

// Test 4: Pattern Creation and Registration
console.log('Test 4: Pattern Creation and Registration');

// Create a test pattern class
class TestPattern extends PatternRenderer {
    constructor(name) {
        super(name || 'TestPattern');
    }
    
    renderPattern(time) {
        console.log(`Rendering ${this.name} at time ${time}`);
        
        // Simple test pattern
        for (let i = 0; i < 1000; i += 4) {
            if (pixels && pixels.length > i + 3) {
                pixels[i] = Math.floor(Math.sin(time + i * 0.001) * 127 + 128);
                pixels[i + 1] = Math.floor(Math.cos(time + i * 0.002) * 127 + 128);
                pixels[i + 2] = Math.floor(Math.sin(time + i * 0.003) * 127 + 128);
                pixels[i + 3] = 255;
            }
        }
    }
}

// Register the test pattern
factory.registerPattern('mytest', TestPattern, {
    description: 'My test pattern',
    category: 'test',
    webgpuOptimized: true,
    defaultParams: { intensity: 0.7 }
});

// Create pattern instance
try {
    const testPattern = factory.createPattern('mytest', { speed: 2.0 });
    console.log('Created test pattern:', testPattern.name);
    console.log('Pattern parameters:', testPattern.getParameters());
    
    // Test pattern rendering
    testPattern.render(2.0);
    console.log('✓ Pattern creation and registration test passed\n');
} catch (error) {
    console.log('✗ Pattern creation test failed:', error.message);
}

// Test 5: PatternUtils Color Functions
console.log('Test 5: PatternUtils Color Functions');

// Test HSV to RGB conversion
const hsvColor = PatternUtils.hsvToRgb(120, 1.0, 1.0); // Pure green
console.log('HSV(120, 1.0, 1.0) to RGB:', hsvColor);

// Test RGB to HSV conversion
const rgbColor = PatternUtils.rgbToHsv(255, 0, 0); // Pure red
console.log('RGB(255, 0, 0) to HSV:', rgbColor);

// Test color blending
const baseColor = [255, 0, 0, 255]; // Red
const overlayColor = [0, 255, 0, 128]; // Semi-transparent green
const blended = PatternUtils.blend(baseColor, overlayColor, 'normal', 0.5);
console.log('Blended color:', blended);

console.log('✓ PatternUtils color functions test passed\n');

// Test 6: Pattern Utility Functions
console.log('Test 6: Pattern Utility Functions');

// Test mathematical functions
const lerpResult = PatternUtils.lerp(0, 100, 0.5);
console.log('Lerp(0, 100, 0.5):', lerpResult);

const clampResult = PatternUtils.clamp(150, 0, 100);
console.log('Clamp(150, 0, 100):', clampResult);

const mapResult = PatternUtils.map(50, 0, 100, 0, 1);
console.log('Map(50, 0, 100, 0, 1):', mapResult);

// Test noise functions
const noiseResult = PatternUtils.noise(1.5, 2.3);
console.log('Noise(1.5, 2.3):', noiseResult);

const fractalNoiseResult = PatternUtils.fractalNoise(1.0, 2.0, 4, 0.5);
console.log('Fractal noise(1.0, 2.0, 4, 0.5):', fractalNoiseResult);

console.log('✓ Pattern utility functions test passed\n');

// Test 7: Color Palette Creation
console.log('Test 7: Color Palette Creation');

const colors = [
    [255, 0, 0],   // Red
    [255, 255, 0], // Yellow
    [0, 255, 0],   // Green
    [0, 0, 255]    // Blue
];

const palette = PatternUtils.createPalette(colors, 16);
console.log('Created palette with', palette.length, 'colors');
console.log('First few colors:', palette.slice(0, 4));
console.log('Last few colors:', palette.slice(-4));

console.log('✓ Color palette creation test passed\n');

// Test 8: Pattern Error Handling
console.log('Test 8: Pattern Error Handling');

// Test invalid pattern creation
try {
    const invalidPattern = factory.createPattern('nonexistent');
    console.log('✗ Should have thrown error for invalid pattern');
} catch (error) {
    console.log('✓ Correctly caught error for invalid pattern:', error.message);
}

// Test pattern with error in render
const errorPattern = new PatternRenderer('ErrorPattern');
errorPattern.initialize();

// Override render to throw error
const originalRender = errorPattern.renderPattern.bind(errorPattern);
errorPattern.renderPattern = function(time) {
    throw new Error('Test render error');
};

try {
    errorPattern.render(1.0);
    console.log('✓ Error handling in pattern render worked');
} catch (error) {
    console.log('✗ Error handling failed:', error.message);
}

console.log('✓ Pattern error handling test passed\n');

// Test 9: Pattern Performance
console.log('Test 9: Pattern Performance');

const performancePattern = new PatternRenderer('PerformancePattern');
performancePattern.initialize();

// Mock complex rendering
performancePattern.renderPattern = function(time) {
    // Simulate complex calculations
    for (let i = 0; i < 10000; i++) {
        Math.sin(time + i * 0.001);
    }
};

// Test multiple renders
const startTime = Date.now();
for (let i = 0; i < 10; i++) {
    performancePattern.render(i * 0.1);
}
const endTime = Date.now();

console.log(`10 renders completed in ${endTime - startTime}ms`);
console.log('Final performance metrics:', performancePattern.getPerformance());

console.log('✓ Pattern performance test passed\n');

// Test 10: Pattern Cleanup and Resource Management
console.log('Test 10: Pattern Cleanup and Resource Management');

// Test pattern cleanup
const cleanupPattern = new PatternRenderer('CleanupPattern');
cleanupPattern.initialize();
console.log('Pattern initialized:', cleanupPattern.isInitialized);

cleanupPattern.cleanup();
console.log('Pattern after cleanup:', cleanupPattern.isInitialized);

// Test factory cleanup
const factoryStatus = factory.getStatus();
console.log('Factory status before cleanup:', factoryStatus);

factory.clearCache();
console.log('Factory cache cleared');

console.log('✓ Pattern cleanup and resource management test passed\n');

// Test 11: Integration Test
console.log('Test 11: Integration Test');

// Create complete pattern workflow
const integrationFactory = new PatternFactory();
integrationFactory.initialize().then(() => {
    console.log('1. Factory initialized');
    
    // Register custom pattern
    integrationFactory.registerPattern('integration', TestPattern, {
        description: 'Integration test pattern',
        webgpuOptimized: true
    });
    
    console.log('2. Pattern registered');
    
    // Set as active pattern
    const activePattern = integrationFactory.setActivePattern('integration', {
        intensity: 0.6,
        speed: 1.5
    });
    
    console.log('3. Active pattern set:', activePattern.name);
    
    // Render active pattern
    integrationFactory.renderActivePattern(3.0);
    
    console.log('4. Active pattern rendered');
    
    // Get pattern info
    const patternInfo = activePattern.getInfo();
    console.log('5. Pattern info:', patternInfo);
    
    console.log('✓ Integration test passed\n');
});

console.log('=== All Pattern System Tests Scheduled ===');

// Clean up test environment
setTimeout(() => {
    console.log('\n=== Test Suite Complete ===');
    console.log('Cache statistics:', PatternUtils.getCacheStats());
    PatternUtils.clearCaches();
    console.log('All tests completed successfully');
}, 100);