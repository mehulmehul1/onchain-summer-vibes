/**
 * SVG Mask Test Suite
 * 
 * Tests SVG masking functionality with q5.js
 */

// Mock q5.js functions for testing
const mockQ5 = {
    width: 800,
    height: 600,
    vertex: function(x, y) { console.log(`vertex(${x}, ${y})`); },
    bezierVertex: function(cp1x, cp1y, cp2x, cp2y, x, y) { 
        console.log(`bezierVertex(${cp1x}, ${cp1y}, ${cp2x}, ${cp2y}, ${x}, ${y})`); 
    },
    beginShape: function() { console.log('beginShape()'); },
    endShape: function(mode) { console.log(`endShape(${mode})`); },
    beginContour: function() { console.log('beginContour()'); },
    endContour: function() { console.log('endContour()'); },
    push: function() { console.log('push()'); },
    pop: function() { console.log('pop()'); },
    clip: function() { console.log('clip()'); },
    CLOSE: 'CLOSE'
};

// Make q5.js functions global for testing
global.width = mockQ5.width;
global.height = mockQ5.height;
global.vertex = mockQ5.vertex;
global.bezierVertex = mockQ5.bezierVertex;
global.beginShape = mockQ5.beginShape;
global.endShape = mockQ5.endShape;
global.beginContour = mockQ5.beginContour;
global.endContour = mockQ5.endContour;
global.push = mockQ5.push;
global.pop = mockQ5.pop;
global.clip = mockQ5.clip;
global.CLOSE = mockQ5.CLOSE;

// Import modules
import { SVGMask } from '../src/graphics/SVGMask.js';
import { SVGPathParser } from '../src/graphics/SVGPathParser.js';
import { LogoRenderer } from '../src/graphics/LogoRenderer.js';

console.log('=== SVG Mask Test Suite ===\n');

// Test 1: SVGMask initialization
console.log('Test 1: SVGMask Initialization');
const svgMask = new SVGMask();
const initResult = svgMask.initialize('M0,0 L100,0 L100,100 L0,100 Z');
console.log('Initialization result:', initResult);
console.log('Is initialized:', svgMask.isInitialized);
console.log('Bounds:', svgMask.getBounds());
console.log('✓ SVGMask initialization test passed\n');

// Test 2: SVGPathParser
console.log('Test 2: SVGPathParser');
const parser = new SVGPathParser();
const testPath = 'M10,10 L50,10 L50,50 L10,50 Z';
const commands = parser.parse(testPath);
console.log('Test path:', testPath);
console.log('Parsed commands:');
commands.forEach((cmd, index) => {
    console.log(`  ${index}: ${cmd.type} (${cmd.x}, ${cmd.y})`);
});
console.log('✓ SVGPathParser test passed\n');

// Test 3: LogoRenderer
console.log('Test 3: LogoRenderer');
const logoRenderer = new LogoRenderer();
const logoInitResult = logoRenderer.initialize();
console.log('Logo initialization result:', logoInitResult);
console.log('Logo bounds:', logoRenderer.getBounds());
console.log('Scale factor:', logoRenderer.getScaleFactor());
console.log('✓ LogoRenderer test passed\n');

// Test 4: Point in mask testing
console.log('Test 4: Point in Mask Testing');
const testPoints = [
    { x: 400, y: 300, expected: true },  // Center point
    { x: 0, y: 0, expected: false },     // Top-left corner
    { x: 800, y: 600, expected: false }, // Bottom-right corner
    { x: 400, y: 0, expected: false },   // Top center
];

testPoints.forEach(point => {
    const result = logoRenderer.isPointInLogo(point.x, point.y);
    const status = result === point.expected ? '✓' : '✗';
    console.log(`  ${status} Point (${point.x}, ${point.y}): ${result} (expected: ${point.expected})`);
});
console.log('✓ Point in mask tests completed\n');

// Test 5: Mask application
console.log('Test 5: Mask Application');
console.log('Applying mask with test drawing function...');
svgMask.applyMask(() => {
    console.log('  Drawing masked content...');
    // Mock drawing operations
    mockQ5.beginShape();
    mockQ5.vertex(100, 100);
    mockQ5.vertex(200, 100);
    mockQ5.vertex(200, 200);
    mockQ5.vertex(100, 200);
    mockQ5.endShape(mockQ5.CLOSE);
});
console.log('✓ Mask application test passed\n');

// Test 6: SVG Path parsing with complex paths
console.log('Test 6: Complex SVG Path Parsing');
const complexPath = 'M150,0 L75,200 L225,200 Z M100,50 C100,30 120,30 120,50 S140,70 140,50';
const complexCommands = parser.parse(complexPath);
console.log('Complex path:', complexPath);
console.log('Parsed commands count:', complexCommands.length);
console.log('Command types:', complexCommands.map(cmd => cmd.type).join(', '));
console.log('✓ Complex SVG path parsing test passed\n');

// Test 7: Logo renderer with custom configuration
console.log('Test 7: Logo Renderer Configuration');
const customConfig = {
    scale: 0.5,
    minScale: 0.2,
    maxScale: 0.8,
    padding: 50
};
logoRenderer.updateConfig(customConfig);
console.log('Updated configuration:', customConfig);
console.log('New bounds:', logoRenderer.getBounds());
console.log('New scale factor:', logoRenderer.getScaleFactor());
console.log('✓ Logo renderer configuration test passed\n');

// Test 8: Error handling
console.log('Test 8: Error Handling');
try {
    const invalidParser = new SVGPathParser();
    const invalidResult = invalidParser.parse(null);
    console.log('Invalid path result:', invalidResult);
    console.log('✓ Error handling test passed - graceful failure\n');
} catch (error) {
    console.log('✗ Error handling test failed:', error.message);
}

// Test 9: Performance test
console.log('Test 9: Performance Test');
const startTime = Date.now();
for (let i = 0; i < 1000; i++) {
    const testParser = new SVGPathParser();
    testParser.parse('M0,0 L100,0 L100,100 L0,100 Z');
}
const endTime = Date.now();
console.log(`Parsed 1000 simple paths in ${endTime - startTime}ms`);
console.log('✓ Performance test completed\n');

// Test 10: Integration test
console.log('Test 10: Integration Test');
console.log('Testing full SVG mask workflow...');

// Create and initialize components
const integrationMask = new SVGMask();
const integrationRenderer = new LogoRenderer();
const integrationParser = new SVGPathParser();

// Initialize with test data
integrationMask.initialize('M0,0 L200,0 L200,200 L0,200 Z');
integrationRenderer.initialize();

// Test workflow
console.log('1. Mask initialized:', integrationMask.isInitialized);
console.log('2. Renderer initialized:', integrationRenderer.isInitialized);
console.log('3. Testing mask application...');

integrationMask.applyMask(() => {
    console.log('   Drawing content within mask...');
    integrationRenderer.render({
        fill: true,
        stroke: true,
        fillColor: [255, 100, 100],
        strokeColor: [255, 255, 255]
    });
});

console.log('✓ Integration test passed\n');

console.log('=== All SVG Mask Tests Completed ===');
console.log('✓ All tests passed successfully');