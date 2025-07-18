/**
 * PerformanceProfiler.js - Detailed Performance Profiling Tools
 * 
 * Advanced performance monitoring and analysis for the Q5App
 * Compatible with Canvas 2D implementation
 */

export class PerformanceProfiler {
    constructor(app) {
        this.app = app;
        this.isEnabled = false;
        this.profiles = {};
        this.activeProfile = null;
        this.metrics = {
            fps: [],
            frameTime: [],
            renderTime: [],
            patternTime: [],
            maskingTime: [],
            memoryUsage: [],
            cpuUsage: []
        };
        
        // Performance thresholds
        this.thresholds = {
            fps: { warning: 45, critical: 30 },
            frameTime: { warning: 20, critical: 33 }, // ms
            renderTime: { warning: 10, critical: 16 }, // ms
            memoryUsage: { warning: 100, critical: 200 } // MB
        };
        
        // Sampling configuration
        this.sampleSize = 300; // Number of samples to keep
        this.sampleInterval = 100; // Sample every N frames
        this.frameCounter = 0;
        
        // Performance marks
        this.marks = new Map();
        
        console.log('PerformanceProfiler initialized');
    }
    
    /**
     * Start profiling
     * @param {string} profileName - Name of the profile
     */
    startProfile(profileName = 'default') {
        this.activeProfile = profileName;
        this.isEnabled = true;
        
        if (!this.profiles[profileName]) {
            this.profiles[profileName] = {
                startTime: performance.now(),
                endTime: null,
                samples: [],
                summary: null
            };
        }
        
        console.log(`Performance profiling started: ${profileName}`);
    }
    
    /**
     * Stop profiling
     * @param {string} profileName - Name of the profile
     */
    stopProfile(profileName = null) {
        const name = profileName || this.activeProfile;
        
        if (name && this.profiles[name]) {
            this.profiles[name].endTime = performance.now();
            this.profiles[name].summary = this.generateSummary(name);
            
            if (name === this.activeProfile) {
                this.activeProfile = null;
                this.isEnabled = false;
            }
            
            console.log(`Performance profiling stopped: ${name}`);
            return this.profiles[name];
        }
        
        return null;
    }
    
    /**
     * Mark the start of a performance measurement
     * @param {string} markName - Name of the mark
     */
    mark(markName) {
        if (!this.isEnabled) return;
        
        const timestamp = performance.now();
        
        if (!this.marks.has(markName)) {
            this.marks.set(markName, []);
        }
        
        this.marks.get(markName).push({
            type: 'start',
            timestamp,
            memory: this.getMemoryUsage()
        });
        
        // Use Performance API if available
        if (window.performance && window.performance.mark) {
            window.performance.mark(`${markName}-start`);
        }
    }
    
    /**
     * Mark the end of a performance measurement
     * @param {string} markName - Name of the mark
     * @returns {Object} - Measurement result
     */
    markEnd(markName) {
        if (!this.isEnabled) return null;
        
        const timestamp = performance.now();
        const marks = this.marks.get(markName);
        
        if (!marks || marks.length === 0) {
            console.warn(`No start mark found for: ${markName}`);
            return null;
        }
        
        const startMark = marks[marks.length - 1];
        const duration = timestamp - startMark.timestamp;
        const memoryDelta = this.getMemoryUsage() - startMark.memory;
        
        const measurement = {
            name: markName,
            duration,
            startTime: startMark.timestamp,
            endTime: timestamp,
            memoryDelta
        };
        
        // Add to current profile
        if (this.activeProfile && this.profiles[this.activeProfile]) {
            this.profiles[this.activeProfile].samples.push(measurement);
        }
        
        // Use Performance API if available
        if (window.performance && window.performance.measure) {
            try {
                window.performance.measure(markName, `${markName}-start`);
            } catch (e) {
                // Ignore if mark doesn't exist
            }
        }
        
        return measurement;
    }
    
    /**
     * Sample current performance metrics
     */
    sample() {
        if (!this.isEnabled) return;
        
        this.frameCounter++;
        
        // Sample every N frames
        if (this.frameCounter % this.sampleInterval !== 0) {
            return;
        }
        
        const now = performance.now();
        const memoryUsage = this.getMemoryUsage();
        
        // Calculate FPS from recent samples
        const fps = this.calculateFPS();
        
        // Sample all metrics
        const sample = {
            timestamp: now,
            fps,
            frameTime: this.getLastFrameTime(),
            renderTime: this.getLastRenderTime(),
            patternTime: this.getLastPatternTime(),
            maskingTime: this.getLastMaskingTime(),
            memoryUsage,
            cpuUsage: this.getCPUUsage()
        };
        
        // Add to metrics arrays
        Object.keys(this.metrics).forEach(metric => {
            if (sample[metric] !== undefined) {
                this.metrics[metric].push(sample[metric]);
                
                // Limit array size
                if (this.metrics[metric].length > this.sampleSize) {
                    this.metrics[metric].shift();
                }
            }
        });
        
        // Check thresholds
        this.checkThresholds(sample);
    }
    
    /**
     * Calculate current FPS
     * @returns {number} - Current FPS
     */
    calculateFPS() {
        const recentFrameTimes = this.metrics.frameTime.slice(-10);
        if (recentFrameTimes.length === 0) return 0;
        
        const avgFrameTime = recentFrameTimes.reduce((a, b) => a + b, 0) / recentFrameTimes.length;
        return avgFrameTime > 0 ? Math.round(1000 / avgFrameTime) : 0;
    }
    
    /**
     * Get memory usage in MB
     * @returns {number} - Memory usage in MB
     */
    getMemoryUsage() {
        if (performance.memory) {
            return Math.round(performance.memory.usedJSHeapSize / (1024 * 1024));
        }
        return 0;
    }
    
    /**
     * Get CPU usage estimate
     * @returns {number} - CPU usage percentage estimate
     */
    getCPUUsage() {
        // Simplified CPU usage estimation
        // In a real implementation, this would be more sophisticated
        const recentRenderTimes = this.metrics.renderTime.slice(-5);
        if (recentRenderTimes.length === 0) return 0;
        
        const avgRenderTime = recentRenderTimes.reduce((a, b) => a + b, 0) / recentRenderTimes.length;
        const targetFrameTime = 1000 / 60; // 60 FPS
        
        return Math.min(100, Math.round((avgRenderTime / targetFrameTime) * 100));
    }
    
    /**
     * Get last frame time
     * @returns {number} - Frame time in ms
     */
    getLastFrameTime() {
        // This would be provided by the app's frame timing
        return this.app.lastFrameTime || 16.67; // Default to 60 FPS
    }
    
    /**
     * Get last render time
     * @returns {number} - Render time in ms
     */
    getLastRenderTime() {
        // This would be measured by the app
        return this.app.lastRenderTime || 0;
    }
    
    /**
     * Get last pattern rendering time
     * @returns {number} - Pattern time in ms
     */
    getLastPatternTime() {
        return this.app.lastPatternTime || 0;
    }
    
    /**
     * Get last masking time
     * @returns {number} - Masking time in ms
     */
    getLastMaskingTime() {
        return this.app.lastMaskingTime || 0;
    }
    
    /**
     * Check performance thresholds
     * @param {Object} sample - Current sample
     */
    checkThresholds(sample) {
        Object.keys(this.thresholds).forEach(metric => {
            const value = sample[metric];
            const threshold = this.thresholds[metric];
            
            if (value !== undefined && threshold) {
                if (value < threshold.critical || value > threshold.critical) {
                    console.warn(`Performance critical: ${metric} = ${value}`);
                } else if (value < threshold.warning || value > threshold.warning) {
                    console.warn(`Performance warning: ${metric} = ${value}`);
                }
            }
        });
    }
    
    /**
     * Generate performance summary
     * @param {string} profileName - Profile name
     * @returns {Object} - Performance summary
     */
    generateSummary(profileName) {
        const profile = this.profiles[profileName];
        if (!profile) return null;
        
        const duration = profile.endTime - profile.startTime;
        const samples = profile.samples;
        
        const summary = {
            profileName,
            duration,
            totalSamples: samples.length,
            metrics: {}
        };
        
        // Calculate statistics for each metric
        Object.keys(this.metrics).forEach(metric => {
            const values = this.metrics[metric];
            if (values.length > 0) {
                summary.metrics[metric] = {
                    count: values.length,
                    min: Math.min(...values),
                    max: Math.max(...values),
                    avg: values.reduce((a, b) => a + b, 0) / values.length,
                    median: this.calculateMedian(values),
                    p95: this.calculatePercentile(values, 95),
                    p99: this.calculatePercentile(values, 99)
                };
            }
        });
        
        return summary;
    }
    
    /**
     * Calculate median value
     * @param {Array} values - Array of values
     * @returns {number} - Median value
     */
    calculateMedian(values) {
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        
        if (sorted.length % 2 === 0) {
            return (sorted[mid - 1] + sorted[mid]) / 2;
        } else {
            return sorted[mid];
        }
    }
    
    /**
     * Calculate percentile
     * @param {Array} values - Array of values
     * @param {number} percentile - Percentile (0-100)
     * @returns {number} - Percentile value
     */
    calculatePercentile(values, percentile) {
        const sorted = [...values].sort((a, b) => a - b);
        const index = Math.ceil((percentile / 100) * sorted.length) - 1;
        return sorted[Math.max(0, Math.min(index, sorted.length - 1))];
    }
    
    /**
     * Export performance data
     * @param {string} format - Export format (json, csv)
     * @returns {string} - Exported data
     */
    exportData(format = 'json') {
        const data = {
            timestamp: new Date().toISOString(),
            profiles: this.profiles,
            metrics: this.metrics,
            thresholds: this.thresholds,
            config: {
                sampleSize: this.sampleSize,
                sampleInterval: this.sampleInterval
            }
        };
        
        if (format === 'csv') {
            return this.convertToCSV(data);
        } else {
            return JSON.stringify(data, null, 2);
        }
    }
    
    /**
     * Convert data to CSV format
     * @param {Object} data - Data to convert
     * @returns {string} - CSV string
     */
    convertToCSV(data) {
        const headers = ['timestamp', 'fps', 'frameTime', 'renderTime', 'memoryUsage'];
        const rows = [];
        
        // Add header
        rows.push(headers.join(','));
        
        // Add data rows
        const maxLength = Math.max(...Object.values(data.metrics).map(arr => arr.length));
        
        for (let i = 0; i < maxLength; i++) {
            const row = headers.map(header => {
                const values = data.metrics[header] || [];
                return values[i] || '';
            });
            rows.push(row.join(','));
        }
        
        return rows.join('\n');
    }
    
    /**
     * Generate performance report
     * @returns {Object} - Performance report
     */
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalProfiles: Object.keys(this.profiles).length,
                activeProfile: this.activeProfile,
                totalSamples: this.frameCounter,
                isEnabled: this.isEnabled
            },
            currentMetrics: {},
            profiles: {},
            recommendations: []
        };
        
        // Current metrics
        Object.keys(this.metrics).forEach(metric => {
            const values = this.metrics[metric];
            if (values.length > 0) {
                report.currentMetrics[metric] = {
                    current: values[values.length - 1],
                    avg: values.reduce((a, b) => a + b, 0) / values.length,
                    trend: this.calculateTrend(values.slice(-10))
                };
            }
        });
        
        // Profile summaries
        Object.keys(this.profiles).forEach(profileName => {
            const profile = this.profiles[profileName];
            if (profile.summary) {
                report.profiles[profileName] = profile.summary;
            }
        });
        
        // Generate recommendations
        report.recommendations = this.generateRecommendations(report.currentMetrics);
        
        return report;
    }
    
    /**
     * Calculate trend for a series of values
     * @param {Array} values - Array of values
     * @returns {string} - Trend direction (up, down, stable)
     */
    calculateTrend(values) {
        if (values.length < 2) return 'stable';
        
        const first = values[0];
        const last = values[values.length - 1];
        const diff = last - first;
        const threshold = first * 0.1; // 10% threshold
        
        if (diff > threshold) return 'up';
        if (diff < -threshold) return 'down';
        return 'stable';
    }
    
    /**
     * Generate performance recommendations
     * @param {Object} metrics - Current metrics
     * @returns {Array} - Array of recommendations
     */
    generateRecommendations(metrics) {
        const recommendations = [];
        
        // FPS recommendations
        if (metrics.fps && metrics.fps.current < 45) {
            recommendations.push({
                type: 'performance',
                severity: 'high',
                message: 'Low FPS detected. Consider reducing visual complexity or optimizing rendering.',
                metric: 'fps',
                value: metrics.fps.current
            });
        }
        
        // Memory recommendations
        if (metrics.memoryUsage && metrics.memoryUsage.current > 100) {
            recommendations.push({
                type: 'memory',
                severity: 'medium',
                message: 'High memory usage. Consider optimizing memory allocation or implementing cleanup.',
                metric: 'memoryUsage',
                value: metrics.memoryUsage.current
            });
        }
        
        // Render time recommendations
        if (metrics.renderTime && metrics.renderTime.current > 16) {
            recommendations.push({
                type: 'rendering',
                severity: 'medium',
                message: 'High render time. Consider optimizing draw operations or using requestAnimationFrame.',
                metric: 'renderTime',
                value: metrics.renderTime.current
            });
        }
        
        return recommendations;
    }
    
    /**
     * Reset all performance data
     */
    reset() {
        this.profiles = {};
        this.activeProfile = null;
        this.frameCounter = 0;
        this.marks.clear();
        
        Object.keys(this.metrics).forEach(metric => {
            this.metrics[metric] = [];
        });
        
        console.log('Performance profiler reset');
    }
    
    /**
     * Update configuration
     * @param {Object} config - New configuration
     */
    updateConfig(config) {
        if (config.sampleSize !== undefined) {
            this.sampleSize = config.sampleSize;
        }
        if (config.sampleInterval !== undefined) {
            this.sampleInterval = config.sampleInterval;
        }
        if (config.thresholds !== undefined) {
            this.thresholds = { ...this.thresholds, ...config.thresholds };
        }
        
        console.log('Performance profiler config updated');
    }
    
    /**
     * Get current status
     * @returns {Object} - Current status
     */
    getStatus() {
        return {
            isEnabled: this.isEnabled,
            activeProfile: this.activeProfile,
            frameCounter: this.frameCounter,
            profileCount: Object.keys(this.profiles).length,
            sampleCount: Object.values(this.metrics).reduce((total, arr) => total + arr.length, 0)
        };
    }
    
    /**
     * Clean up resources
     */
    cleanup() {
        this.reset();
        this.isEnabled = false;
        console.log('Performance profiler cleaned up');
    }
}

export default PerformanceProfiler;