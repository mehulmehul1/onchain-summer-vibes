/**
 * ScreenshotCapture.js - Screenshot Capture for Testing
 * 
 * Provides functionality to capture screenshots of the canvas for testing and documentation
 * Compatible with Canvas 2D Q5App implementation
 */

export class ScreenshotCapture {
    constructor(app) {
        this.app = app;
        this.isCapturing = false;
        this.captureQueue = [];
        this.captureHistory = [];
        this.maxHistorySize = 50;
        
        // Screenshot settings
        this.settings = {
            format: 'png', // png, jpg, webp
            quality: 0.95, // for jpg/webp
            includeTimestamp: true,
            includeParameters: true,
            autoSave: true
        };
        
        console.log('ScreenshotCapture initialized');
    }
    
    /**
     * Capture a single screenshot
     * @param {Object} options - Capture options
     * @returns {Promise<string>} - Data URL of the captured image
     */
    async captureScreenshot(options = {}) {
        if (!this.app || !this.app.canvas) {
            throw new Error('No canvas available for screenshot');
        }
        
        const config = { ...this.settings, ...options };
        
        try {
            this.isCapturing = true;
            
            // Get canvas data
            const mimeType = this.getMimeType(config.format);
            const dataUrl = this.app.canvas.toDataURL(mimeType, config.quality);
            
            // Create capture metadata
            const metadata = this.createMetadata(config);
            
            // Create capture record
            const captureRecord = {
                id: this.generateId(),
                timestamp: Date.now(),
                dataUrl,
                metadata,
                format: config.format,
                size: this.getCanvasSize()
            };
            
            // Add to history
            this.addToHistory(captureRecord);
            
            // Auto-save if enabled
            if (config.autoSave) {
                this.downloadScreenshot(captureRecord);
            }
            
            console.log('Screenshot captured:', captureRecord.id);
            return dataUrl;
            
        } catch (error) {
            console.error('Failed to capture screenshot:', error);
            throw error;
        } finally {
            this.isCapturing = false;
        }
    }
    
    /**
     * Capture multiple screenshots with different parameters
     * @param {Array} parameterSets - Array of parameter configurations
     * @returns {Promise<Array>} - Array of captured screenshots
     */
    async captureParameterSeries(parameterSets) {
        if (!Array.isArray(parameterSets)) {
            throw new Error('Parameter sets must be an array');
        }
        
        const results = [];
        
        for (let i = 0; i < parameterSets.length; i++) {
            const paramSet = parameterSets[i];
            
            try {
                // Apply parameters to app
                if (this.app.updateParameters) {
                    this.app.updateParameters(paramSet.parameters);
                }
                
                // Wait for a few frames to ensure rendering
                await this.waitFrames(5);
                
                // Capture screenshot
                const screenshot = await this.captureScreenshot({
                    includeParameters: true,
                    autoSave: false,
                    metadata: {
                        seriesIndex: i,
                        seriesTotal: parameterSets.length,
                        parameterSet: paramSet
                    }
                });
                
                results.push({
                    index: i,
                    parameters: paramSet,
                    screenshot
                });
                
            } catch (error) {
                console.error(`Failed to capture screenshot ${i}:`, error);
                results.push({
                    index: i,
                    parameters: paramSet,
                    error: error.message
                });
            }
        }
        
        console.log(`Captured ${results.length} screenshots in series`);
        return results;
    }
    
    /**
     * Capture a time-lapse sequence
     * @param {Object} options - Time-lapse options
     * @returns {Promise<Array>} - Array of captured frames
     */
    async captureTimeLapse(options = {}) {
        const config = {
            duration: 10000, // 10 seconds
            interval: 500,   // 500ms between frames
            format: 'png',
            autoSave: false,
            ...options
        };
        
        const frames = [];
        const frameCount = Math.ceil(config.duration / config.interval);
        
        console.log(`Starting time-lapse capture: ${frameCount} frames`);
        
        for (let i = 0; i < frameCount; i++) {
            try {
                const screenshot = await this.captureScreenshot({
                    format: config.format,
                    autoSave: false,
                    metadata: {
                        timelapseFrame: i,
                        timelapseTotal: frameCount
                    }
                });
                
                frames.push({
                    frame: i,
                    timestamp: Date.now(),
                    screenshot
                });
                
                // Wait for next frame
                if (i < frameCount - 1) {
                    await this.sleep(config.interval);
                }
                
            } catch (error) {
                console.error(`Failed to capture frame ${i}:`, error);
            }
        }
        
        // Save as zip if requested
        if (config.autoSave) {
            await this.saveTimelapseAsZip(frames);
        }
        
        console.log(`Time-lapse capture complete: ${frames.length} frames`);
        return frames;
    }
    
    /**
     * Compare two screenshots
     * @param {string} dataUrl1 - First screenshot data URL
     * @param {string} dataUrl2 - Second screenshot data URL
     * @returns {Promise<Object>} - Comparison result
     */
    async compareScreenshots(dataUrl1, dataUrl2) {
        try {
            const img1 = await this.dataUrlToImageData(dataUrl1);
            const img2 = await this.dataUrlToImageData(dataUrl2);
            
            if (img1.width !== img2.width || img1.height !== img2.height) {
                throw new Error('Images must have the same dimensions');
            }
            
            let differentPixels = 0;
            let totalPixels = img1.width * img1.height;
            
            for (let i = 0; i < img1.data.length; i += 4) {
                const r1 = img1.data[i];
                const g1 = img1.data[i + 1];
                const b1 = img1.data[i + 2];
                const a1 = img1.data[i + 3];
                
                const r2 = img2.data[i];
                const g2 = img2.data[i + 1];
                const b2 = img2.data[i + 2];
                const a2 = img2.data[i + 3];
                
                if (r1 !== r2 || g1 !== g2 || b1 !== b2 || a1 !== a2) {
                    differentPixels++;
                }
            }
            
            const similarity = 1 - (differentPixels / totalPixels);
            
            return {
                similarity,
                differentPixels,
                totalPixels,
                percentDifferent: (differentPixels / totalPixels) * 100
            };
            
        } catch (error) {
            console.error('Failed to compare screenshots:', error);
            throw error;
        }
    }
    
    /**
     * Download a screenshot
     * @param {Object} captureRecord - Capture record to download
     */
    downloadScreenshot(captureRecord) {
        const link = document.createElement('a');
        link.download = this.generateFilename(captureRecord);
        link.href = captureRecord.dataUrl;
        link.click();
    }
    
    /**
     * Download all screenshots as a zip
     * @returns {Promise<void>}
     */
    async downloadAllAsZip() {
        if (this.captureHistory.length === 0) {
            console.warn('No screenshots to download');
            return;
        }
        
        try {
            // Create zip data (simplified - in real implementation would use JSZip)
            const zipData = {
                screenshots: this.captureHistory.map(record => ({
                    filename: this.generateFilename(record),
                    data: record.dataUrl,
                    metadata: record.metadata
                })),
                manifest: {
                    totalScreenshots: this.captureHistory.length,
                    createdAt: new Date().toISOString(),
                    app: 'Onchain Summer Vibes'
                }
            };
            
            const dataStr = JSON.stringify(zipData, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const link = document.createElement('a');
            link.download = `screenshots-${Date.now()}.json`;
            link.href = dataUri;
            link.click();
            
            console.log('Screenshots exported as JSON');
            
        } catch (error) {
            console.error('Failed to create zip:', error);
        }
    }
    
    /**
     * Get canvas size
     * @returns {Object} - Canvas dimensions
     */
    getCanvasSize() {
        if (!this.app || !this.app.canvas) {
            return { width: 0, height: 0 };
        }
        
        return {
            width: this.app.canvas.width,
            height: this.app.canvas.height
        };
    }
    
    /**
     * Create metadata for screenshot
     * @param {Object} config - Capture configuration
     * @returns {Object} - Metadata object
     */
    createMetadata(config) {
        const metadata = {
            timestamp: new Date().toISOString(),
            canvasSize: this.getCanvasSize(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        if (config.includeParameters && this.app.getCurrentParameters) {
            metadata.parameters = this.app.getCurrentParameters();
        }
        
        if (config.metadata) {
            Object.assign(metadata, config.metadata);
        }
        
        return metadata;
    }
    
    /**
     * Generate unique ID for screenshot
     * @returns {string} - Unique ID
     */
    generateId() {
        return `screenshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Generate filename for screenshot
     * @param {Object} captureRecord - Capture record
     * @returns {string} - Filename
     */
    generateFilename(captureRecord) {
        const timestamp = new Date(captureRecord.timestamp).toISOString().replace(/[:.]/g, '-');
        const extension = captureRecord.format === 'jpg' ? 'jpg' : 'png';
        return `onchain-summer-${timestamp}.${extension}`;
    }
    
    /**
     * Get MIME type for format
     * @param {string} format - Format (png, jpg, webp)
     * @returns {string} - MIME type
     */
    getMimeType(format) {
        switch (format.toLowerCase()) {
            case 'jpg':
            case 'jpeg':
                return 'image/jpeg';
            case 'webp':
                return 'image/webp';
            case 'png':
            default:
                return 'image/png';
        }
    }
    
    /**
     * Add capture to history
     * @param {Object} captureRecord - Capture record
     */
    addToHistory(captureRecord) {
        this.captureHistory.unshift(captureRecord);
        
        // Limit history size
        if (this.captureHistory.length > this.maxHistorySize) {
            this.captureHistory = this.captureHistory.slice(0, this.maxHistorySize);
        }
    }
    
    /**
     * Wait for specified number of frames
     * @param {number} frames - Number of frames to wait
     * @returns {Promise<void>}
     */
    async waitFrames(frames) {
        for (let i = 0; i < frames; i++) {
            await new Promise(resolve => requestAnimationFrame(resolve));
        }
    }
    
    /**
     * Sleep for specified duration
     * @param {number} ms - Duration in milliseconds
     * @returns {Promise<void>}
     */
    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Convert data URL to ImageData
     * @param {string} dataUrl - Data URL
     * @returns {Promise<ImageData>} - ImageData object
     */
    async dataUrlToImageData(dataUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                resolve(ctx.getImageData(0, 0, img.width, img.height));
            };
            img.onerror = reject;
            img.src = dataUrl;
        });
    }
    
    /**
     * Get capture history
     * @returns {Array} - Array of capture records
     */
    getHistory() {
        return [...this.captureHistory];
    }
    
    /**
     * Clear capture history
     */
    clearHistory() {
        this.captureHistory = [];
        console.log('Screenshot history cleared');
    }
    
    /**
     * Update settings
     * @param {Object} newSettings - New settings
     */
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        console.log('Screenshot settings updated:', this.settings);
    }
    
    /**
     * Clean up resources
     */
    cleanup() {
        this.clearHistory();
        this.captureQueue = [];
        this.isCapturing = false;
    }
}

export default ScreenshotCapture;