/**
 * performance-benchmark.js - Performance Benchmarking Tests
 * 
 * Comprehensive performance testing and benchmarking for the Q5App
 * Tests FPS, memory usage, render times, and optimization scenarios
 */

import { Q5App } from '../src/core/Q5App-minimal.js';
import { PerformanceProfiler } from '../src/debug/PerformanceProfiler.js';

class PerformanceBenchmark {
    constructor() {
        this.app = null;
        this.profiler = null;
        this.benchmarks = [];
        this.results = [];
        this.thresholds = {
            fps: { target: 60, minimum: 30, warning: 45 },
            frameTime: { target: 16.67, maximum: 33.33, warning: 20 },
            renderTime: { target: 10, maximum: 16, warning: 12 },
            memoryUsage: { target: 50, maximum: 200, warning: 100 }, // MB
            memoryLeakRate: { maximum: 1, warning: 0.5 }, // MB/sec
            initTime: { target: 1000, maximum: 3000, warning: 2000 } // ms
        };
        
        // Benchmark scenarios
        this.scenarios = [
            {
                name: 'initialization',
                description: 'Application initialization performance',
                test: this.benchmarkInitialization.bind(this)
            },
            {
                name: 'steady-state-fps',
                description: 'Steady state FPS performance',
                test: this.benchmarkSteadyStateFPS.bind(this)
            },
            {
                name: 'pattern-rendering',
                description: 'Interference pattern rendering performance',
                test: this.benchmarkPatternRendering.bind(this)
            },
            {
                name: 'svg-masking',
                description: 'SVG masking performance',
                test: this.benchmarkSVGMasking.bind(this)
            },
            {
                name: 'memory-usage',
                description: 'Memory usage and leak detection',
                test: this.benchmarkMemoryUsage.bind(this)
            },
            {
                name: 'canvas-resize',
                description: 'Canvas resize performance',
                test: this.benchmarkCanvasResize.bind(this)
            },
            {
                name: 'stress-test',
                description: 'High load stress test',
                test: this.benchmarkStressTest.bind(this)
            },
            {
                name: 'animation-smoothness',
                description: 'Animation smoothness and frame consistency',
                test: this.benchmarkAnimationSmoothness.bind(this)
            }
        ];
        
        console.log('Performance Benchmark initialized');
    }
    
    /**
     * Run all performance benchmarks
     * @param {Object} options - Benchmark options
     * @returns {Promise<Object>} - Benchmark results
     */
    async runBenchmarks(options = {}) {
        const config = {
            duration: 10000, // 10 seconds per test
            warmupDuration: 2000, // 2 seconds warmup
            iterations: 1,
            ...options
        };
        
        console.log('⚡ Starting performance benchmarks...');
        
        // Initialize app and profiler
        await this.initializeApp();
        
        // Run benchmarks
        for (const scenario of this.scenarios) {
            await this.runBenchmark(scenario, config);
        }
        
        // Generate summary
        const summary = this.generateSummary();
        
        // Clean up
        this.cleanup();
        
        console.log('⚡ Performance benchmarks completed:', summary);
        return summary;
    }
    
    /**
     * Initialize app and profiler
     */
    async initializeApp() {
        // Create test canvas
        const testCanvas = document.createElement('canvas');
        testCanvas.id = 'benchmarkCanvas';
        testCanvas.width = 1200;
        testCanvas.height = 800;
        testCanvas.style.display = 'none';
        document.body.appendChild(testCanvas);
        
        // Initialize app
        this.app = new Q5App({
            canvas: { targetFPS: 60 },
            debug: false
        });
        
        // Initialize profiler
        this.profiler = new PerformanceProfiler(this.app);
    }
    
    /**
     * Run a single benchmark
     * @param {Object} scenario - Benchmark scenario
     * @param {Object} config - Benchmark configuration
     */
    async runBenchmark(scenario, config) {
        console.log(`  ⏱️  Running benchmark: ${scenario.name}`);
        
        const result = {
            scenario: scenario.name,
            description: scenario.description,
            startTime: Date.now(),
            endTime: null,
            duration: null,
            status: 'running',
            metrics: {},
            passed: false,
            score: 0,
            grade: 'F',
            error: null
        };
        
        try {
            // Warmup
            await this.warmup(config.warmupDuration);
            
            // Start profiling
            this.profiler.startProfile(scenario.name);
            
            // Run benchmark
            const benchmarkResult = await scenario.test(config);
            
            // Stop profiling
            const profileResult = this.profiler.stopProfile(scenario.name);
            
            // Combine results
            result.metrics = {
                ...benchmarkResult.metrics,
                profile: profileResult ? profileResult.summary : null
            };
            
            result.status = 'completed';
            result.passed = benchmarkResult.passed;
            result.score = benchmarkResult.score || 0;
            result.grade = this.calculateGrade(result.score);
            
        } catch (error) {
            result.error = error.message;
            result.status = 'failed';
            console.error(`    ❌ Benchmark failed: ${scenario.name}`, error.message);
        }
        
        result.endTime = Date.now();
        result.duration = result.endTime - result.startTime;
        
        this.results.push(result);
        
        if (result.passed) {
            console.log(`    ✅ PASSED: ${scenario.name} (Score: ${result.score}, Grade: ${result.grade})`);
        } else {
            console.log(`    ❌ FAILED: ${scenario.name} (Score: ${result.score}, Grade: ${result.grade})`);
        }
    }
    
    /**
     * Warmup period to stabilize performance
     * @param {number} duration - Warmup duration in ms
     */
    async warmup(duration) {
        const startTime = Date.now();
        
        while (Date.now() - startTime < duration) {
            await new Promise(resolve => requestAnimationFrame(resolve));
        }
    }
    
    /**
     * Benchmark initialization performance
     */
    async benchmarkInitialization(config) {
        const metrics = {
            initTime: 0,
            firstFrameTime: 0,
            memoryAfterInit: 0
        };
        
        // Measure initialization time
        const initStart = performance.now();
        
        // Initialize fresh app
        const testApp = new Q5App({
            canvas: { targetFPS: 60 },
            debug: false
        });
        
        await testApp.initialize();
        
        const initEnd = performance.now();
        metrics.initTime = initEnd - initStart;
        
        // Measure first frame time
        const frameStart = performance.now();
        testApp.draw();
        const frameEnd = performance.now();
        metrics.firstFrameTime = frameEnd - frameStart;
        
        // Measure memory
        if (performance.memory) {
            metrics.memoryAfterInit = performance.memory.usedJSHeapSize / (1024 * 1024);
        }
        
        const passed = metrics.initTime < this.thresholds.initTime.maximum;
        const score = this.calculateScore('initTime', metrics.initTime);
        
        return {
            passed,
            score,
            metrics
        };
    }
    
    /**
     * Benchmark steady state FPS
     */
    async benchmarkSteadyStateFPS(config) {
        const metrics = {
            avgFPS: 0,
            minFPS: Infinity,
            maxFPS: 0,
            frameCount: 0,
            droppedFrames: 0,
            fpsStability: 0
        };
        
        const frameTimes = [];
        const startTime = performance.now();
        let lastFrameTime = startTime;
        
        // Wait for app to be ready
        await this.app.initialize();
        
        // Measure FPS for specified duration
        while (performance.now() - startTime < config.duration) {
            const frameStart = performance.now();
            
            // Trigger frame
            await new Promise(resolve => requestAnimationFrame(resolve));
            
            const frameEnd = performance.now();
            const frameTime = frameEnd - frameStart;
            const fps = 1000 / (frameEnd - lastFrameTime);
            
            frameTimes.push(frameTime);
            metrics.frameCount++;
            
            if (fps < metrics.minFPS) metrics.minFPS = fps;
            if (fps > metrics.maxFPS) metrics.maxFPS = fps;
            
            if (frameTime > 33.33) { // Dropped frame (below 30 FPS)
                metrics.droppedFrames++;
            }
            
            lastFrameTime = frameEnd;
        }
        
        // Calculate averages
        metrics.avgFPS = 1000 / (frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length);
        metrics.fpsStability = this.calculateStability(frameTimes);
        
        const passed = metrics.avgFPS >= this.thresholds.fps.minimum;
        const score = this.calculateScore('fps', metrics.avgFPS);
        
        return {
            passed,
            score,
            metrics
        };
    }
    
    /**
     * Benchmark pattern rendering performance
     */
    async benchmarkPatternRendering(config) {
        const metrics = {
            avgRenderTime: 0,
            minRenderTime: Infinity,
            maxRenderTime: 0,
            renderCount: 0,
            pixelsPerSecond: 0
        };
        
        const renderTimes = [];
        const startTime = performance.now();
        
        // Create test canvas
        const testCanvas = document.createElement('canvas');
        testCanvas.width = 800;
        testCanvas.height = 600;
        const testCtx = testCanvas.getContext('2d');
        
        while (performance.now() - startTime < config.duration) {
            const renderStart = performance.now();
            
            // Render interference pattern
            this.app.renderInterferencePattern(testCtx, (performance.now() - startTime) / 1000);
            
            const renderEnd = performance.now();
            const renderTime = renderEnd - renderStart;
            
            renderTimes.push(renderTime);
            metrics.renderCount++;
            
            if (renderTime < metrics.minRenderTime) metrics.minRenderTime = renderTime;
            if (renderTime > metrics.maxRenderTime) metrics.maxRenderTime = renderTime;
            
            // Small delay to prevent overwhelming
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        
        // Calculate metrics
        metrics.avgRenderTime = renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
        metrics.pixelsPerSecond = (testCanvas.width * testCanvas.height * metrics.renderCount) / (config.duration / 1000);
        
        const passed = metrics.avgRenderTime < this.thresholds.renderTime.maximum;
        const score = this.calculateScore('renderTime', metrics.avgRenderTime);
        
        return {
            passed,
            score,
            metrics
        };
    }
    
    /**
     * Benchmark SVG masking performance
     */
    async benchmarkSVGMasking(config) {
        const metrics = {
            avgMaskTime: 0,
            minMaskTime: Infinity,
            maxMaskTime: 0,
            maskCount: 0
        };
        
        const maskTimes = [];
        const startTime = performance.now();
        
        // Create test canvas
        const testCanvas = document.createElement('canvas');
        testCanvas.width = 800;
        testCanvas.height = 600;
        const testCtx = testCanvas.getContext('2d');
        
        // Fill with test pattern
        testCtx.fillStyle = '#ff0000';
        testCtx.fillRect(0, 0, testCanvas.width, testCanvas.height);
        
        while (performance.now() - startTime < config.duration) {
            const maskStart = performance.now();
            
            // Apply SVG mask
            this.app.applySVGMask(testCanvas);
            
            const maskEnd = performance.now();
            const maskTime = maskEnd - maskStart;
            
            maskTimes.push(maskTime);
            metrics.maskCount++;
            
            if (maskTime < metrics.minMaskTime) metrics.minMaskTime = maskTime;
            if (maskTime > metrics.maxMaskTime) metrics.maxMaskTime = maskTime;
            
            // Reset canvas for next test
            testCtx.fillStyle = '#ff0000';
            testCtx.fillRect(0, 0, testCanvas.width, testCanvas.height);
            
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        
        metrics.avgMaskTime = maskTimes.reduce((a, b) => a + b, 0) / maskTimes.length;
        
        const passed = metrics.avgMaskTime < 10; // 10ms threshold
        const score = this.calculateScore('maskTime', metrics.avgMaskTime);
        
        return {
            passed,
            score,
            metrics
        };
    }
    
    /**
     * Benchmark memory usage
     */
    async benchmarkMemoryUsage(config) {
        const metrics = {
            initialMemory: 0,
            finalMemory: 0,
            peakMemory: 0,
            memoryLeak: 0,
            memoryLeakRate: 0,
            gcCount: 0
        };
        
        // Initial memory
        if (performance.memory) {
            metrics.initialMemory = performance.memory.usedJSHeapSize / (1024 * 1024);
        }
        
        const startTime = performance.now();
        let lastGCTime = startTime;
        
        // Force initial GC if available
        if (window.gc) {
            window.gc();
        }
        
        // Run memory stress test
        while (performance.now() - startTime < config.duration) {
            // Create and destroy objects to test memory management
            const arrays = [];
            for (let i = 0; i < 1000; i++) {
                arrays.push(new Array(1000).fill(Math.random()));
            }
            
            // Check current memory
            if (performance.memory) {
                const currentMemory = performance.memory.usedJSHeapSize / (1024 * 1024);
                if (currentMemory > metrics.peakMemory) {
                    metrics.peakMemory = currentMemory;
                }
            }
            
            // Force GC periodically if available
            if (window.gc && performance.now() - lastGCTime > 1000) {
                window.gc();
                metrics.gcCount++;
                lastGCTime = performance.now();
            }
            
            // Clear arrays
            arrays.length = 0;
            
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        // Final memory
        if (performance.memory) {
            metrics.finalMemory = performance.memory.usedJSHeapSize / (1024 * 1024);
            metrics.memoryLeak = metrics.finalMemory - metrics.initialMemory;
            metrics.memoryLeakRate = metrics.memoryLeak / (config.duration / 1000);
        }
        
        const passed = metrics.memoryLeakRate < this.thresholds.memoryLeakRate.maximum;
        const score = this.calculateScore('memoryLeakRate', metrics.memoryLeakRate);
        
        return {
            passed,
            score,
            metrics
        };
    }
    
    /**
     * Benchmark canvas resize performance
     */
    async benchmarkCanvasResize(config) {
        const metrics = {
            avgResizeTime: 0,
            minResizeTime: Infinity,
            maxResizeTime: 0,
            resizeCount: 0
        };
        
        const resizeTimes = [];
        const startTime = performance.now();
        
        const sizes = [
            { width: 800, height: 600 },
            { width: 1200, height: 800 },
            { width: 1920, height: 1080 },
            { width: 400, height: 300 },
            { width: 1600, height: 900 }
        ];
        
        let sizeIndex = 0;
        
        while (performance.now() - startTime < config.duration) {
            const size = sizes[sizeIndex % sizes.length];
            
            const resizeStart = performance.now();
            
            // Resize canvas
            this.app.canvas.width = size.width;
            this.app.canvas.height = size.height;
            this.app.windowResized();
            
            const resizeEnd = performance.now();
            const resizeTime = resizeEnd - resizeStart;
            
            resizeTimes.push(resizeTime);
            metrics.resizeCount++;
            
            if (resizeTime < metrics.minResizeTime) metrics.minResizeTime = resizeTime;
            if (resizeTime > metrics.maxResizeTime) metrics.maxResizeTime = resizeTime;
            
            sizeIndex++;
            
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        metrics.avgResizeTime = resizeTimes.reduce((a, b) => a + b, 0) / resizeTimes.length;
        
        const passed = metrics.avgResizeTime < 50; // 50ms threshold
        const score = this.calculateScore('resizeTime', metrics.avgResizeTime);
        
        return {
            passed,
            score,
            metrics
        };
    }
    
    /**
     * Benchmark stress test
     */
    async benchmarkStressTest(config) {
        const metrics = {
            avgFPS: 0,
            minFPS: Infinity,
            frameDrops: 0,
            crashCount: 0,
            errorCount: 0
        };
        
        const frameTimes = [];
        const startTime = performance.now();
        let lastFrameTime = startTime;
        let errorCount = 0;
        
        // Increase rendering load
        const originalColors = this.app.colors;
        this.app.colors = {
            primary: [255, 0, 0],
            secondary: [0, 255, 0],
            accent: [0, 0, 255],
            background: [255, 255, 255]
        };
        
        // Add error handler
        const originalError = window.onerror;
        window.onerror = () => {
            errorCount++;
            return false;
        };
        
        try {
            while (performance.now() - startTime < config.duration) {
                const frameStart = performance.now();
                
                // Stress test with multiple operations
                for (let i = 0; i < 5; i++) {
                    this.app.draw();
                    await new Promise(resolve => requestAnimationFrame(resolve));
                }
                
                const frameEnd = performance.now();
                const frameTime = frameEnd - frameStart;
                const fps = 1000 / (frameEnd - lastFrameTime);
                
                frameTimes.push(frameTime);
                
                if (fps < metrics.minFPS) metrics.minFPS = fps;
                if (frameTime > 33.33) metrics.frameDrops++;
                
                lastFrameTime = frameEnd;
            }
            
        } catch (error) {
            metrics.crashCount++;
            console.error('Stress test error:', error);
        }
        
        // Restore
        this.app.colors = originalColors;
        window.onerror = originalError;
        
        metrics.avgFPS = 1000 / (frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length);
        metrics.errorCount = errorCount;
        
        const passed = metrics.crashCount === 0 && metrics.errorCount === 0 && metrics.avgFPS > 15;
        const score = this.calculateScore('stressTest', metrics.avgFPS);
        
        return {
            passed,
            score,
            metrics
        };
    }
    
    /**
     * Benchmark animation smoothness
     */
    async benchmarkAnimationSmoothness(config) {
        const metrics = {
            frameConsistency: 0,
            jitter: 0,
            smoothness: 0,
            frameTimeStdDev: 0
        };
        
        const frameTimes = [];
        const frameDeltas = [];
        const startTime = performance.now();
        let lastFrameTime = startTime;
        
        while (performance.now() - startTime < config.duration) {
            const frameStart = performance.now();
            
            await new Promise(resolve => requestAnimationFrame(resolve));
            
            const frameEnd = performance.now();
            const frameTime = frameEnd - frameStart;
            const frameDelta = frameEnd - lastFrameTime;
            
            frameTimes.push(frameTime);
            frameDeltas.push(frameDelta);
            
            lastFrameTime = frameEnd;
        }
        
        // Calculate smoothness metrics
        metrics.frameTimeStdDev = this.calculateStandardDeviation(frameTimes);
        metrics.jitter = this.calculateStandardDeviation(frameDeltas);
        metrics.frameConsistency = 1 - (metrics.frameTimeStdDev / 16.67); // Relative to 60fps
        metrics.smoothness = Math.max(0, 1 - (metrics.jitter / 16.67));
        
        const passed = metrics.smoothness > 0.8; // 80% smoothness threshold
        const score = Math.round(metrics.smoothness * 100);
        
        return {
            passed,
            score,
            metrics
        };
    }
    
    /**
     * Calculate stability metric
     * @param {Array} values - Array of values
     * @returns {number} - Stability score (0-1)
     */
    calculateStability(values) {
        if (values.length === 0) return 0;
        
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);
        
        return Math.max(0, 1 - (stdDev / mean));
    }
    
    /**
     * Calculate standard deviation
     * @param {Array} values - Array of values
     * @returns {number} - Standard deviation
     */
    calculateStandardDeviation(values) {
        if (values.length === 0) return 0;
        
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        
        return Math.sqrt(variance);
    }
    
    /**
     * Calculate score for a metric
     * @param {string} metric - Metric name
     * @param {number} value - Metric value
     * @returns {number} - Score (0-100)
     */
    calculateScore(metric, value) {
        const threshold = this.thresholds[metric];
        if (!threshold) return 50;
        
        switch (metric) {
            case 'fps':
                return Math.min(100, Math.max(0, (value / threshold.target) * 100));
            case 'initTime':
            case 'renderTime':
            case 'frameTime':
                return Math.min(100, Math.max(0, 100 - ((value / threshold.target) * 100)));
            case 'memoryLeakRate':
                return Math.min(100, Math.max(0, 100 - ((value / threshold.maximum) * 100)));
            case 'stressTest':
                return Math.min(100, Math.max(0, (value / 60) * 100));
            default:
                return 50;
        }
    }
    
    /**
     * Calculate grade from score
     * @param {number} score - Score (0-100)
     * @returns {string} - Grade letter
     */
    calculateGrade(score) {
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'F';
    }
    
    /**
     * Generate benchmark summary
     * @returns {Object} - Benchmark summary
     */
    generateSummary() {
        const totalTests = this.results.length;
        const passedTests = this.results.filter(r => r.passed).length;
        const failedTests = totalTests - passedTests;
        
        const avgScore = this.results.length > 0 
            ? this.results.reduce((sum, r) => sum + r.score, 0) / this.results.length
            : 0;
        
        const overallGrade = this.calculateGrade(avgScore);
        
        return {
            timestamp: new Date().toISOString(),
            totalTests,
            passed: passedTests,
            failed: failedTests,
            avgScore: Math.round(avgScore),
            overallGrade,
            results: this.results,
            thresholds: this.thresholds
        };
    }
    
    /**
     * Export benchmark results
     * @param {string} format - Export format (json, csv, html)
     * @returns {string} - Exported data
     */
    exportResults(format = 'json') {
        const summary = this.generateSummary();
        
        if (format === 'csv') {
            return this.generateCSVReport(summary);
        } else if (format === 'html') {
            return this.generateHTMLReport(summary);
        } else {
            return JSON.stringify(summary, null, 2);
        }
    }
    
    /**
     * Generate CSV report
     * @param {Object} summary - Benchmark summary
     * @returns {string} - CSV report
     */
    generateCSVReport(summary) {
        const headers = ['scenario', 'passed', 'score', 'grade', 'duration'];
        const rows = [headers.join(',')];
        
        summary.results.forEach(result => {
            rows.push([
                result.scenario,
                result.passed,
                result.score,
                result.grade,
                result.duration
            ].join(','));
        });
        
        return rows.join('\n');
    }
    
    /**
     * Generate HTML report
     * @param {Object} summary - Benchmark summary
     * @returns {string} - HTML report
     */
    generateHTMLReport(summary) {
        return `
<!DOCTYPE html>
<html>
<head>
    <title>Performance Benchmark Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f0f0f0; padding: 20px; border-radius: 5px; }
        .grade-A { color: #28a745; }
        .grade-B { color: #007bff; }
        .grade-C { color: #ffc107; }
        .grade-D { color: #fd7e14; }
        .grade-F { color: #dc3545; }
        .benchmark-result { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .passed { border-left: 5px solid green; }
        .failed { border-left: 5px solid red; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin: 10px 0; }
        .metric { background: #f9f9f9; padding: 10px; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Performance Benchmark Report</h1>
        <p>Generated: ${summary.timestamp}</p>
        <p>Total Tests: ${summary.totalTests} | Passed: ${summary.passed} | Failed: ${summary.failed}</p>
        <p>Average Score: ${summary.avgScore} | Overall Grade: <span class="grade-${summary.overallGrade}">${summary.overallGrade}</span></p>
    </div>
    
    <h2>Benchmark Results</h2>
    ${summary.results.map(result => `
        <div class="benchmark-result ${result.passed ? 'passed' : 'failed'}">
            <h3>${result.passed ? '✅' : '❌'} ${result.scenario}</h3>
            <p>${result.description}</p>
            <p><strong>Score:</strong> ${result.score} | <strong>Grade:</strong> <span class="grade-${result.grade}">${result.grade}</span> | <strong>Duration:</strong> ${result.duration}ms</p>
            ${result.error ? `<p style="color: red;">Error: ${result.error}</p>` : ''}
            
            <div class="metrics">
                ${Object.entries(result.metrics).map(([key, value]) => `
                    <div class="metric">
                        <strong>${key}:</strong> ${typeof value === 'number' ? value.toFixed(2) : value}
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('')}
</body>
</html>`;
    }
    
    /**
     * Clean up benchmark resources
     */
    cleanup() {
        // Remove test canvas
        const testCanvas = document.getElementById('benchmarkCanvas');
        if (testCanvas && testCanvas.parentNode) {
            testCanvas.parentNode.removeChild(testCanvas);
        }
        
        // Clean up profiler
        if (this.profiler) {
            this.profiler.cleanup();
        }
    }
}

// Export for use in other modules
export { PerformanceBenchmark };

// Browser global function
if (typeof window !== 'undefined') {
    window.runPerformanceBenchmarks = async function(options = {}) {
        const benchmark = new PerformanceBenchmark();
        return await benchmark.runBenchmarks(options);
    };
}

// Node.js export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceBenchmark;
}

export default PerformanceBenchmark;