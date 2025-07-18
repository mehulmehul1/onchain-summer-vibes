/**
 * integration-test.js - Comprehensive Integration Testing
 * 
 * Tests the complete application flow from initialization to rendering
 * Compatible with Canvas 2D Q5App implementation
 */

import { Q5App } from '../src/core/Q5App-minimal.js';
import { SVG_CONFIG } from '../src/constants/patternConfig.js';

class IntegrationTester {
    constructor() {
        this.tests = [];
        this.results = [];
        this.app = null;
        this.testCanvas = null;
        this.passCount = 0;
        this.failCount = 0;
        this.startTime = null;
        this.endTime = null;
        
        console.log('Integration Tester initialized');
    }
    
    /**
     * Run all integration tests
     * @returns {Promise<Object>} - Test results
     */
    async runTests() {
        console.log('🧪 Starting integration tests...');
        this.startTime = Date.now();
        
        // Create test canvas
        this.createTestCanvas();
        
        // Define test suite
        this.defineTests();
        
        // Run tests sequentially
        for (const test of this.tests) {
            await this.runTest(test);
        }
        
        // Clean up
        this.cleanup();
        
        this.endTime = Date.now();
        const summary = this.generateSummary();
        
        console.log('🧪 Integration tests completed:', summary);
        return summary;
    }
    
    /**
     * Create test canvas
     */
    createTestCanvas() {
        // Create a hidden canvas for testing
        this.testCanvas = document.createElement('canvas');
        this.testCanvas.id = 'testCanvas';
        this.testCanvas.width = 800;
        this.testCanvas.height = 600;
        this.testCanvas.style.display = 'none';
        document.body.appendChild(this.testCanvas);
    }
    
    /**
     * Define test suite
     */
    defineTests() {
        this.tests = [
            {
                name: 'Application Initialization',
                description: 'Test Q5App initialization and basic setup',
                test: this.testAppInitialization.bind(this)
            },
            {
                name: 'Canvas Setup',
                description: 'Test canvas creation and context setup',
                test: this.testCanvasSetup.bind(this)
            },
            {
                name: 'SVG Path Creation',
                description: 'Test SVG path creation and validation',
                test: this.testSVGPathCreation.bind(this)
            },
            {
                name: 'Interference Pattern Rendering',
                description: 'Test interference pattern generation',
                test: this.testInterferencePatternRendering.bind(this)
            },
            {
                name: 'SVG Masking',
                description: 'Test SVG masking functionality',
                test: this.testSVGMasking.bind(this)
            },
            {
                name: 'Logo Background Rendering',
                description: 'Test logo background rendering',
                test: this.testLogoBackgroundRendering.bind(this)
            },
            {
                name: 'Animation Loop',
                description: 'Test animation loop functionality',
                test: this.testAnimationLoop.bind(this)
            },
            {
                name: 'Performance Metrics',
                description: 'Test performance monitoring',
                test: this.testPerformanceMetrics.bind(this)
            },
            {
                name: 'Canvas Resize',
                description: 'Test canvas resize handling',
                test: this.testCanvasResize.bind(this)
            },
            {
                name: 'Frame Rate Stability',
                description: 'Test frame rate stability over time',
                test: this.testFrameRateStability.bind(this)
            }
        ];
    }
    
    /**
     * Run a single test
     * @param {Object} test - Test object
     */
    async runTest(test) {
        console.log(`  🔍 Running: ${test.name}`);
        
        const result = {
            name: test.name,
            description: test.description,
            startTime: Date.now(),
            endTime: null,
            passed: false,
            error: null,
            details: {}
        };
        
        try {
            const testResult = await test.test();
            result.passed = testResult.passed;
            result.details = testResult.details || {};
            
            if (result.passed) {
                this.passCount++;
                console.log(`    ✅ PASSED: ${test.name}`);
            } else {
                this.failCount++;
                console.log(`    ❌ FAILED: ${test.name}`, testResult.error);
                result.error = testResult.error;
            }
            
        } catch (error) {
            result.passed = false;
            result.error = error.message;
            this.failCount++;
            console.log(`    ❌ ERROR: ${test.name}`, error.message);
        }
        
        result.endTime = Date.now();
        result.duration = result.endTime - result.startTime;
        
        this.results.push(result);
    }
    
    /**
     * Test application initialization
     */
    async testAppInitialization() {
        // Mock DOM elements
        const mockCanvas = document.createElement('canvas');
        mockCanvas.id = 'artCanvas';
        mockCanvas.style.display = 'none';
        document.body.appendChild(mockCanvas);
        
        const config = {
            canvas: { targetFPS: 60 },
            debug: false
        };
        
        this.app = new Q5App(config);
        
        // Test initialization
        await this.app.initialize();
        
        const passed = this.app.initialized && this.app.canvas && this.app.ctx;
        
        // Clean up
        if (mockCanvas.parentNode) {
            mockCanvas.parentNode.removeChild(mockCanvas);
        }
        
        return {
            passed,
            details: {
                initialized: this.app.initialized,
                hasCanvas: !!this.app.canvas,
                hasContext: !!this.app.ctx,
                hasLogoPath: !!this.app.logoPath2D,
                hasBackgroundPath: !!this.app.backgroundPath2D
            }
        };
    }
    
    /**
     * Test canvas setup
     */
    async testCanvasSetup() {
        if (!this.app) {
            throw new Error('App not initialized');
        }
        
        const canvas = this.app.canvas;
        const ctx = this.app.ctx;
        
        const passed = canvas && ctx && canvas.width > 0 && canvas.height > 0;
        
        return {
            passed,
            details: {
                width: canvas ? canvas.width : 0,
                height: canvas ? canvas.height : 0,
                hasContext: !!ctx,
                contextType: ctx ? ctx.constructor.name : 'none'
            }
        };
    }
    
    /**
     * Test SVG path creation
     */
    async testSVGPathCreation() {
        if (!this.app) {
            throw new Error('App not initialized');
        }
        
        const hasLogoPath = this.app.logoPath2D instanceof Path2D;
        const hasBackgroundPath = this.app.backgroundPath2D instanceof Path2D;
        
        // Test SVG config
        const hasValidSVGConfig = SVG_CONFIG.path && SVG_CONFIG.backgroundPath && 
                                  SVG_CONFIG.width > 0 && SVG_CONFIG.height > 0;
        
        const passed = hasLogoPath && hasBackgroundPath && hasValidSVGConfig;
        
        return {
            passed,
            details: {
                hasLogoPath,
                hasBackgroundPath,
                hasValidSVGConfig,
                svgWidth: SVG_CONFIG.width,
                svgHeight: SVG_CONFIG.height
            }
        };
    }
    
    /**
     * Test interference pattern rendering
     */
    async testInterferencePatternRendering() {
        if (!this.app) {
            throw new Error('App not initialized');
        }
        
        // Create test canvas
        const testCanvas = document.createElement('canvas');
        testCanvas.width = 400;
        testCanvas.height = 300;
        const testCtx = testCanvas.getContext('2d');
        
        // Test pattern rendering
        this.app.renderInterferencePattern(testCtx, 0);
        
        // Check if pixels were drawn
        const imageData = testCtx.getImageData(0, 0, testCanvas.width, testCanvas.height);
        const pixels = imageData.data;
        
        let hasNonZeroPixels = false;
        for (let i = 0; i < pixels.length; i += 4) {
            if (pixels[i] !== 0 || pixels[i + 1] !== 0 || pixels[i + 2] !== 0) {
                hasNonZeroPixels = true;
                break;
            }
        }
        
        const passed = hasNonZeroPixels;
        
        return {
            passed,
            details: {
                canvasSize: { width: testCanvas.width, height: testCanvas.height },
                hasNonZeroPixels,
                pixelDataLength: pixels.length
            }
        };
    }
    
    /**
     * Test SVG masking
     */
    async testSVGMasking() {
        if (!this.app) {
            throw new Error('App not initialized');
        }
        
        // Create test canvas with pattern
        const testCanvas = document.createElement('canvas');
        testCanvas.width = 400;
        testCanvas.height = 300;
        const testCtx = testCanvas.getContext('2d');
        
        // Fill with test pattern
        testCtx.fillStyle = '#ff0000';
        testCtx.fillRect(0, 0, testCanvas.width, testCanvas.height);
        
        // Apply SVG mask
        this.app.applySVGMask(testCanvas);
        
        // Check if masking was applied (should have reduced the red pixels)
        const imageData = testCtx.getImageData(0, 0, testCanvas.width, testCanvas.height);
        const pixels = imageData.data;
        
        let redPixelCount = 0;
        for (let i = 0; i < pixels.length; i += 4) {
            if (pixels[i] === 255 && pixels[i + 1] === 0 && pixels[i + 2] === 0) {
                redPixelCount++;
            }
        }
        
        const totalPixels = testCanvas.width * testCanvas.height;
        const maskingApplied = redPixelCount < totalPixels;
        
        const passed = maskingApplied;
        
        return {
            passed,
            details: {
                totalPixels,
                redPixelCount,
                maskingApplied,
                maskedPixelRatio: redPixelCount / totalPixels
            }
        };
    }
    
    /**
     * Test logo background rendering
     */
    async testLogoBackgroundRendering() {
        if (!this.app) {
            throw new Error('App not initialized');
        }
        
        // Create test canvas
        const testCanvas = document.createElement('canvas');
        testCanvas.width = 400;
        testCanvas.height = 300;
        const testCtx = testCanvas.getContext('2d');
        
        // Set up app canvas for testing
        const originalCanvas = this.app.canvas;
        const originalCtx = this.app.ctx;
        
        this.app.canvas = testCanvas;
        this.app.ctx = testCtx;
        
        // Clear canvas
        testCtx.fillStyle = '#ffffff';
        testCtx.fillRect(0, 0, testCanvas.width, testCanvas.height);
        
        // Render logo background
        this.app.drawLogoBackground();
        
        // Check if black pixels were drawn
        const imageData = testCtx.getImageData(0, 0, testCanvas.width, testCanvas.height);
        const pixels = imageData.data;
        
        let hasBlackPixels = false;
        for (let i = 0; i < pixels.length; i += 4) {
            if (pixels[i] === 0 && pixels[i + 1] === 0 && pixels[i + 2] === 0) {
                hasBlackPixels = true;
                break;
            }
        }
        
        // Restore original canvas
        this.app.canvas = originalCanvas;
        this.app.ctx = originalCtx;
        
        const passed = hasBlackPixels;
        
        return {
            passed,
            details: {
                hasBlackPixels,
                canvasSize: { width: testCanvas.width, height: testCanvas.height }
            }
        };
    }
    
    /**
     * Test animation loop
     */
    async testAnimationLoop() {
        if (!this.app) {
            throw new Error('App not initialized');
        }
        
        const initialFrameCount = this.app.frameCount;
        
        // Wait for a few frames
        await this.waitForFrames(10);
        
        const finalFrameCount = this.app.frameCount;
        const framesRendered = finalFrameCount - initialFrameCount;
        
        const passed = framesRendered > 0;
        
        return {
            passed,
            details: {
                initialFrameCount,
                finalFrameCount,
                framesRendered,
                animationRunning: this.app.initialized
            }
        };
    }
    
    /**
     * Test performance metrics
     */
    async testPerformanceMetrics() {
        if (!this.app) {
            throw new Error('App not initialized');
        }
        
        const startTime = Date.now();
        
        // Wait for several frames
        await this.waitForFrames(30);
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        const frameCount = this.app.frameCount;
        
        const estimatedFPS = frameCount > 0 ? (frameCount / duration) * 1000 : 0;
        const passed = estimatedFPS > 10; // At least 10 FPS
        
        return {
            passed,
            details: {
                duration,
                frameCount,
                estimatedFPS,
                targetFPS: 60
            }
        };
    }
    
    /**
     * Test canvas resize
     */
    async testCanvasResize() {
        if (!this.app) {
            throw new Error('App not initialized');
        }
        
        const originalWidth = this.app.canvas.width;
        const originalHeight = this.app.canvas.height;
        
        // Trigger resize
        this.app.windowResized();
        
        // Canvas dimensions should be recalculated
        const newWidth = this.app.canvas.width;
        const newHeight = this.app.canvas.height;
        
        const passed = newWidth > 0 && newHeight > 0;
        
        return {
            passed,
            details: {
                originalSize: { width: originalWidth, height: originalHeight },
                newSize: { width: newWidth, height: newHeight },
                sizeChanged: newWidth !== originalWidth || newHeight !== originalHeight
            }
        };
    }
    
    /**
     * Test frame rate stability
     */
    async testFrameRateStability() {
        if (!this.app) {
            throw new Error('App not initialized');
        }
        
        const frameTimes = [];
        const startFrameCount = this.app.frameCount;
        const startTime = Date.now();
        
        // Measure frame times
        for (let i = 0; i < 30; i++) {
            const frameStart = Date.now();
            await this.waitForFrames(1);
            const frameEnd = Date.now();
            frameTimes.push(frameEnd - frameStart);
        }
        
        const endTime = Date.now();
        const totalDuration = endTime - startTime;
        const framesRendered = this.app.frameCount - startFrameCount;
        
        const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
        const frameTimeVariance = this.calculateVariance(frameTimes);
        const estimatedFPS = framesRendered > 0 ? (framesRendered / totalDuration) * 1000 : 0;
        
        // Frame rate is stable if variance is low and FPS is reasonable
        const passed = frameTimeVariance < 100 && estimatedFPS > 15;
        
        return {
            passed,
            details: {
                framesRendered,
                totalDuration,
                avgFrameTime,
                frameTimeVariance,
                estimatedFPS,
                frameTimes: frameTimes.slice(0, 5) // First 5 frame times
            }
        };
    }
    
    /**
     * Calculate variance of an array
     * @param {Array} values - Array of values
     * @returns {number} - Variance
     */
    calculateVariance(values) {
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
        return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
    }
    
    /**
     * Wait for specified number of frames
     * @param {number} frames - Number of frames to wait
     */
    async waitForFrames(frames) {
        for (let i = 0; i < frames; i++) {
            await new Promise(resolve => requestAnimationFrame(resolve));
        }
    }
    
    /**
     * Generate test summary
     * @returns {Object} - Test summary
     */
    generateSummary() {
        const totalTests = this.tests.length;
        const duration = this.endTime - this.startTime;
        const successRate = totalTests > 0 ? (this.passCount / totalTests) * 100 : 0;
        
        return {
            timestamp: new Date().toISOString(),
            totalTests,
            passed: this.passCount,
            failed: this.failCount,
            successRate: Math.round(successRate),
            duration,
            results: this.results
        };
    }
    
    /**
     * Export test results
     * @param {string} format - Export format (json, html)
     * @returns {string} - Exported data
     */
    exportResults(format = 'json') {
        const summary = this.generateSummary();
        
        if (format === 'html') {
            return this.generateHTMLReport(summary);
        } else {
            return JSON.stringify(summary, null, 2);
        }
    }
    
    /**
     * Generate HTML report
     * @param {Object} summary - Test summary
     * @returns {string} - HTML report
     */
    generateHTMLReport(summary) {
        const passed = summary.results.filter(r => r.passed);
        const failed = summary.results.filter(r => !r.passed);
        
        return `
<!DOCTYPE html>
<html>
<head>
    <title>Integration Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f0f0f0; padding: 20px; border-radius: 5px; }
        .passed { color: green; }
        .failed { color: red; }
        .test-result { margin: 10px 0; padding: 10px; border: 1px solid #ddd; }
        .details { margin-top: 10px; font-size: 0.9em; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Integration Test Report</h1>
        <p>Generated: ${summary.timestamp}</p>
        <p>Total Tests: ${summary.totalTests} | Passed: ${summary.passed} | Failed: ${summary.failed}</p>
        <p>Success Rate: ${summary.successRate}% | Duration: ${summary.duration}ms</p>
    </div>
    
    <h2>Test Results</h2>
    ${summary.results.map(result => `
        <div class="test-result">
            <h3 class="${result.passed ? 'passed' : 'failed'}">
                ${result.passed ? '✅' : '❌'} ${result.name}
            </h3>
            <p>${result.description}</p>
            <p>Duration: ${result.duration}ms</p>
            ${result.error ? `<p style="color: red;">Error: ${result.error}</p>` : ''}
            <div class="details">
                <pre>${JSON.stringify(result.details, null, 2)}</pre>
            </div>
        </div>
    `).join('')}
</body>
</html>`;
    }
    
    /**
     * Clean up test resources
     */
    cleanup() {
        if (this.testCanvas && this.testCanvas.parentNode) {
            this.testCanvas.parentNode.removeChild(this.testCanvas);
        }
        
        if (this.app) {
            // Don't cleanup the app if it's still running
        }
    }
}

// Export for use in other modules
export { IntegrationTester };

// Auto-run tests if this file is executed directly
if (typeof window !== 'undefined' && window.location) {
    // Browser environment - create global test function
    window.runIntegrationTests = async function() {
        const tester = new IntegrationTester();
        return await tester.runTests();
    };
}

// Node.js environment export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IntegrationTester;
}

export default IntegrationTester;