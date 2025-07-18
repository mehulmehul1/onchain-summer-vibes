/**
 * visual-regression-test.js - Visual Output Validation Tests
 * 
 * Tests visual output against baseline images to detect regressions
 * Compatible with Canvas 2D Q5App implementation
 */

import { Q5App } from '../src/core/Q5App-minimal.js';
import { ScreenshotCapture } from '../src/debug/ScreenshotCapture.js';

class VisualRegressionTester {
    constructor() {
        this.app = null;
        this.screenshotCapture = null;
        this.baselines = new Map();
        this.testResults = [];
        this.tolerance = 0.05; // 5% difference tolerance
        this.pixelTolerance = 10; // Pixel color difference tolerance
        
        // Test scenarios
        this.scenarios = [
            {
                name: 'initial-load',
                description: 'Initial application load state',
                setup: this.setupInitialLoad.bind(this)
            },
            {
                name: 'ocean-theme',
                description: 'Ocean theme interference pattern',
                setup: this.setupOceanTheme.bind(this)
            },
            {
                name: 'animation-frame-1',
                description: 'Animation at 1 second',
                setup: this.setupAnimationFrame1.bind(this)
            },
            {
                name: 'animation-frame-5',
                description: 'Animation at 5 seconds',
                setup: this.setupAnimationFrame5.bind(this)
            },
            {
                name: 'logo-background-only',
                description: 'Logo background without pattern',
                setup: this.setupLogoBackgroundOnly.bind(this)
            },
            {
                name: 'pattern-only',
                description: 'Interference pattern without logo',
                setup: this.setupPatternOnly.bind(this)
            }
        ];
        
        console.log('Visual Regression Tester initialized');
    }
    
    /**
     * Run visual regression tests
     * @param {Object} options - Test options
     * @returns {Promise<Object>} - Test results
     */
    async runTests(options = {}) {
        const config = {
            generateBaselines: false,
            updateBaselines: false,
            tolerance: this.tolerance,
            ...options
        };
        
        console.log('🎨 Starting visual regression tests...');
        
        // Initialize app
        await this.initializeApp();
        
        // Load baselines if not generating
        if (!config.generateBaselines) {
            await this.loadBaselines();
        }
        
        // Run tests for each scenario
        for (const scenario of this.scenarios) {
            await this.runScenarioTest(scenario, config);
        }
        
        // Generate summary
        const summary = this.generateSummary();
        
        // Clean up
        this.cleanup();
        
        console.log('🎨 Visual regression tests completed:', summary);
        return summary;
    }
    
    /**
     * Initialize the application for testing
     */
    async initializeApp() {
        // Create test canvas
        const testCanvas = document.createElement('canvas');
        testCanvas.id = 'visualTestCanvas';
        testCanvas.width = 800;
        testCanvas.height = 600;
        testCanvas.style.display = 'none';
        document.body.appendChild(testCanvas);
        
        // Initialize app
        this.app = new Q5App({
            canvas: { targetFPS: 60 },
            debug: false
        });
        
        await this.app.initialize();
        
        // Initialize screenshot capture
        this.screenshotCapture = new ScreenshotCapture(this.app);
    }
    
    /**
     * Load baseline images
     */
    async loadBaselines() {
        // In a real implementation, this would load from a baseline directory
        // For now, we'll simulate with stored data
        const baselineData = this.getStoredBaselines();
        
        for (const [key, data] of Object.entries(baselineData)) {
            this.baselines.set(key, data);
        }
        
        console.log(`Loaded ${this.baselines.size} baseline images`);
    }
    
    /**
     * Run test for a specific scenario
     * @param {Object} scenario - Test scenario
     * @param {Object} config - Test configuration
     */
    async runScenarioTest(scenario, config) {
        console.log(`  🖼️  Testing scenario: ${scenario.name}`);
        
        const result = {
            scenario: scenario.name,
            description: scenario.description,
            timestamp: Date.now(),
            passed: false,
            similarity: 0,
            differencePercentage: 0,
            details: {},
            error: null
        };
        
        try {
            // Set up scenario
            await scenario.setup();
            
            // Wait for rendering to settle
            await this.waitForStableRendering();
            
            // Capture current image
            const currentImage = await this.screenshotCapture.captureScreenshot({
                autoSave: false,
                format: 'png'
            });
            
            if (config.generateBaselines) {
                // Generate baseline
                this.baselines.set(scenario.name, {
                    image: currentImage,
                    timestamp: Date.now(),
                    description: scenario.description
                });
                
                result.passed = true;
                result.details.action = 'baseline-generated';
                
            } else {
                // Compare with baseline
                const baseline = this.baselines.get(scenario.name);
                
                if (!baseline) {
                    throw new Error(`No baseline found for scenario: ${scenario.name}`);
                }
                
                const comparison = await this.compareImages(currentImage, baseline.image);
                
                result.similarity = comparison.similarity;
                result.differencePercentage = comparison.percentDifferent;
                result.passed = comparison.similarity >= (1 - config.tolerance);
                result.details = comparison;
                
                if (config.updateBaselines && !result.passed) {
                    // Update baseline if requested
                    this.baselines.set(scenario.name, {
                        image: currentImage,
                        timestamp: Date.now(),
                        description: scenario.description
                    });
                    result.details.action = 'baseline-updated';
                }
            }
            
        } catch (error) {
            result.error = error.message;
            console.error(`    ❌ Error in scenario ${scenario.name}:`, error.message);
        }
        
        this.testResults.push(result);
        
        if (result.passed) {
            console.log(`    ✅ PASSED: ${scenario.name} (${(result.similarity * 100).toFixed(1)}% similarity)`);
        } else {
            console.log(`    ❌ FAILED: ${scenario.name} (${(result.similarity * 100).toFixed(1)}% similarity)`);
        }
    }
    
    /**
     * Compare two images
     * @param {string} image1 - First image data URL
     * @param {string} image2 - Second image data URL
     * @returns {Promise<Object>} - Comparison result
     */
    async compareImages(image1, image2) {
        try {
            const img1Data = await this.imageToCanvas(image1);
            const img2Data = await this.imageToCanvas(image2);
            
            if (img1Data.width !== img2Data.width || img1Data.height !== img2Data.height) {
                throw new Error('Images must have the same dimensions');
            }
            
            const pixels1 = img1Data.getContext('2d').getImageData(0, 0, img1Data.width, img1Data.height);
            const pixels2 = img2Data.getContext('2d').getImageData(0, 0, img2Data.width, img2Data.height);
            
            let differentPixels = 0;
            let totalDifference = 0;
            const totalPixels = pixels1.width * pixels1.height;
            
            for (let i = 0; i < pixels1.data.length; i += 4) {
                const r1 = pixels1.data[i];
                const g1 = pixels1.data[i + 1];
                const b1 = pixels1.data[i + 2];
                const a1 = pixels1.data[i + 3];
                
                const r2 = pixels2.data[i];
                const g2 = pixels2.data[i + 1];
                const b2 = pixels2.data[i + 2];
                const a2 = pixels2.data[i + 3];
                
                const rDiff = Math.abs(r1 - r2);
                const gDiff = Math.abs(g1 - g2);
                const bDiff = Math.abs(b1 - b2);
                const aDiff = Math.abs(a1 - a2);
                
                const pixelDiff = (rDiff + gDiff + bDiff + aDiff) / 4;
                totalDifference += pixelDiff;
                
                if (pixelDiff > this.pixelTolerance) {
                    differentPixels++;
                }
            }
            
            const avgDifference = totalDifference / (totalPixels * 255);
            const similarity = 1 - avgDifference;
            const percentDifferent = (differentPixels / totalPixels) * 100;
            
            return {
                similarity,
                percentDifferent,
                differentPixels,
                totalPixels,
                avgDifference,
                dimensions: {
                    width: pixels1.width,
                    height: pixels1.height
                }
            };
            
        } catch (error) {
            console.error('Failed to compare images:', error);
            throw error;
        }
    }
    
    /**
     * Convert image data URL to canvas
     * @param {string} dataUrl - Image data URL
     * @returns {Promise<HTMLCanvasElement>} - Canvas element
     */
    async imageToCanvas(dataUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                resolve(canvas);
            };
            img.onerror = reject;
            img.src = dataUrl;
        });
    }
    
    /**
     * Wait for rendering to stabilize
     */
    async waitForStableRendering() {
        // Wait for several frames to ensure stable rendering
        for (let i = 0; i < 10; i++) {
            await new Promise(resolve => requestAnimationFrame(resolve));
        }
    }
    
    /**
     * Setup scenarios
     */
    async setupInitialLoad() {
        // Reset to initial state
        this.app.frameCount = 0;
        this.app.startTime = Date.now();
        
        // Wait for initial render
        await this.waitForStableRendering();
    }
    
    async setupOceanTheme() {
        // Set ocean theme colors
        this.app.colors = {
            primary: [0, 150, 255],
            secondary: [0, 200, 255],
            accent: [255, 255, 255],
            background: [0, 0, 0]
        };
        
        await this.waitForStableRendering();
    }
    
    async setupAnimationFrame1() {
        // Set animation to 1 second
        this.app.startTime = Date.now() - 1000;
        this.app.frameCount = 60; // Simulate 60 frames
        
        await this.waitForStableRendering();
    }
    
    async setupAnimationFrame5() {
        // Set animation to 5 seconds
        this.app.startTime = Date.now() - 5000;
        this.app.frameCount = 300; // Simulate 300 frames
        
        await this.waitForStableRendering();
    }
    
    async setupLogoBackgroundOnly() {
        // Temporarily disable pattern rendering
        const originalRenderPattern = this.app.renderInterferencePattern;
        this.app.renderInterferencePattern = () => {}; // No-op
        
        await this.waitForStableRendering();
        
        // Restore original function
        this.app.renderInterferencePattern = originalRenderPattern;
    }
    
    async setupPatternOnly() {
        // Temporarily disable logo rendering
        const originalDrawBackground = this.app.drawLogoBackground;
        this.app.drawLogoBackground = () => {}; // No-op
        
        await this.waitForStableRendering();
        
        // Restore original function
        this.app.drawLogoBackground = originalDrawBackground;
    }
    
    /**
     * Generate test summary
     * @returns {Object} - Test summary
     */
    generateSummary() {
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.passed).length;
        const failedTests = totalTests - passedTests;
        const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
        
        const avgSimilarity = this.testResults.length > 0 
            ? this.testResults.reduce((sum, r) => sum + r.similarity, 0) / this.testResults.length
            : 0;
        
        return {
            timestamp: new Date().toISOString(),
            totalTests,
            passed: passedTests,
            failed: failedTests,
            successRate: Math.round(successRate),
            avgSimilarity: Math.round(avgSimilarity * 100),
            tolerance: this.tolerance,
            pixelTolerance: this.pixelTolerance,
            results: this.testResults
        };
    }
    
    /**
     * Generate visual report
     * @returns {string} - HTML report
     */
    generateVisualReport() {
        const summary = this.generateSummary();
        
        return `
<!DOCTYPE html>
<html>
<head>
    <title>Visual Regression Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f0f0f0; padding: 20px; border-radius: 5px; }
        .test-result { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .passed { border-left: 5px solid green; }
        .failed { border-left: 5px solid red; }
        .similarity { font-weight: bold; color: #333; }
        .image-comparison { display: flex; gap: 20px; margin: 10px 0; }
        .image-container { text-align: center; }
        .image-container img { max-width: 300px; border: 1px solid #ccc; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin: 10px 0; }
        .stat { background: #f9f9f9; padding: 10px; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Visual Regression Test Report</h1>
        <p>Generated: ${summary.timestamp}</p>
        <p>Total Tests: ${summary.totalTests} | Passed: ${summary.passed} | Failed: ${summary.failed}</p>
        <p>Success Rate: ${summary.successRate}% | Average Similarity: ${summary.avgSimilarity}%</p>
        <p>Tolerance: ${(summary.tolerance * 100).toFixed(1)}% | Pixel Tolerance: ${summary.pixelTolerance}</p>
    </div>
    
    <h2>Test Results</h2>
    ${summary.results.map(result => `
        <div class="test-result ${result.passed ? 'passed' : 'failed'}">
            <h3>${result.passed ? '✅' : '❌'} ${result.scenario}</h3>
            <p>${result.description}</p>
            <div class="similarity">
                Similarity: ${(result.similarity * 100).toFixed(2)}% | 
                Difference: ${result.differencePercentage.toFixed(2)}%
            </div>
            ${result.error ? `<p style="color: red;">Error: ${result.error}</p>` : ''}
            
            <div class="stats">
                <div class="stat">
                    <strong>Different Pixels:</strong> ${result.details.differentPixels || 0}
                </div>
                <div class="stat">
                    <strong>Total Pixels:</strong> ${result.details.totalPixels || 0}
                </div>
                <div class="stat">
                    <strong>Avg Difference:</strong> ${((result.details.avgDifference || 0) * 100).toFixed(2)}%
                </div>
                <div class="stat">
                    <strong>Dimensions:</strong> ${result.details.dimensions ? `${result.details.dimensions.width}x${result.details.dimensions.height}` : 'N/A'}
                </div>
            </div>
        </div>
    `).join('')}
</body>
</html>`;
    }
    
    /**
     * Save baselines to storage
     */
    saveBaselines() {
        const baselineData = {};
        
        for (const [key, data] of this.baselines) {
            baselineData[key] = data;
        }
        
        // In a real implementation, this would save to a file or database
        localStorage.setItem('visualTestBaselines', JSON.stringify(baselineData));
        
        console.log(`Saved ${this.baselines.size} baselines to storage`);
    }
    
    /**
     * Get stored baselines
     * @returns {Object} - Stored baseline data
     */
    getStoredBaselines() {
        try {
            const stored = localStorage.getItem('visualTestBaselines');
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.warn('Failed to load stored baselines:', error);
            return {};
        }
    }
    
    /**
     * Export test results
     * @param {string} format - Export format (json, html)
     * @returns {string} - Exported data
     */
    exportResults(format = 'json') {
        if (format === 'html') {
            return this.generateVisualReport();
        } else {
            return JSON.stringify(this.generateSummary(), null, 2);
        }
    }
    
    /**
     * Clean up test resources
     */
    cleanup() {
        // Remove test canvas
        const testCanvas = document.getElementById('visualTestCanvas');
        if (testCanvas && testCanvas.parentNode) {
            testCanvas.parentNode.removeChild(testCanvas);
        }
        
        // Save baselines
        this.saveBaselines();
        
        // Clean up app if needed
        if (this.app) {
            // Don't cleanup if app is still being used
        }
    }
}

// Export for use in other modules
export { VisualRegressionTester };

// Browser global function
if (typeof window !== 'undefined') {
    window.runVisualRegressionTests = async function(options = {}) {
        const tester = new VisualRegressionTester();
        return await tester.runTests(options);
    };
}

// Node.js export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VisualRegressionTester;
}

export default VisualRegressionTester;