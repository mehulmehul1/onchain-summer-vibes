/**
 * PatternRenderer.js - Base Pattern Renderer Class for q5.js
 * 
 * Creates base pattern renderer class with q5.js integration
 */

export class PatternRenderer {
    constructor(name = 'BasePattern') {
        this.name = name;
        this.isInitialized = false;
        this.pixelBuffer = null;
        this.bufferSize = 0;
        this.lastFrameTime = 0;
        this.frameCount = 0;
        
        // Default parameters
        this.parameters = {
            intensity: 1.0,
            speed: 1.0,
            complexity: 1.0,
            colorShift: 0.0,
            scale: 1.0
        };
        
        // Performance tracking
        this.performance = {
            renderTime: 0,
            pixelOperations: 0,
            frameRate: 60
        };
    }

    /**
     * Initialize pattern renderer
     * @param {Object} options - Configuration options
     */
    initialize(options = {}) {
        try {
            this.parameters = { ...this.parameters, ...options };
            this.setupPixelBuffer();
            this.isInitialized = true;
            
            console.log(`${this.name} pattern renderer initialized`);
            return true;
        } catch (error) {
            console.error(`Failed to initialize ${this.name} pattern:`, error);
            return false;
        }
    }

    /**
     * Setup pixel buffer for pattern rendering
     */
    setupPixelBuffer() {
        if (typeof width === 'undefined' || typeof height === 'undefined') {
            console.warn('Canvas dimensions not available, using defaults');
            this.bufferSize = 800 * 600 * 4; // Default size
        } else {
            this.bufferSize = width * height * 4;
        }
        
        this.pixelBuffer = new Uint8Array(this.bufferSize);
    }

    /**
     * Main render function - should be overridden by subclasses
     * @param {number} time - Current time in seconds
     * @param {Object} params - Additional parameters
     */
    render(time, params = {}) {
        if (!this.isInitialized) {
            console.warn(`${this.name} pattern not initialized`);
            return;
        }

        const startTime = performance.now();
        
        try {
            // Update parameters
            this.updateParameters(params);
            
            // Load pixel data
            loadPixels();
            
            // Render pattern
            this.renderPattern(time);
            
            // Update pixel data
            updatePixels();
            
            // Update performance metrics
            this.updatePerformance(startTime);
            
        } catch (error) {
            console.error(`Error rendering ${this.name} pattern:`, error);
            this.handleRenderError(error);
        }
    }

    /**
     * Pattern-specific rendering logic - override in subclasses
     * @param {number} time - Current time in seconds
     */
    renderPattern(time) {
        // Default implementation - solid color
        const currentWidth = width || 800;
        const currentHeight = height || 600;
        
        for (let y = 0; y < currentHeight; y++) {
            for (let x = 0; x < currentWidth; x++) {
                const index = (y * currentWidth + x) * 4;
                
                if (pixels && pixels.length > index + 3) {
                    pixels[index] = 128;     // R
                    pixels[index + 1] = 128; // G
                    pixels[index + 2] = 128; // B
                    pixels[index + 3] = 255; // A
                }
            }
        }
    }

    /**
     * Update pattern parameters
     * @param {Object} params - New parameters
     */
    updateParameters(params) {
        this.parameters = { ...this.parameters, ...params };
    }

    /**
     * Get current parameters
     * @returns {Object} - Current parameters
     */
    getParameters() {
        return { ...this.parameters };
    }

    /**
     * Update performance metrics
     * @param {number} startTime - Start time of render
     */
    updatePerformance(startTime) {
        this.performance.renderTime = performance.now() - startTime;
        this.frameCount++;
        
        const currentTime = Date.now();
        if (currentTime - this.lastFrameTime >= 1000) {
            this.performance.frameRate = this.frameCount;
            this.frameCount = 0;
            this.lastFrameTime = currentTime;
        }
    }

    /**
     * Get performance metrics
     * @returns {Object} - Performance data
     */
    getPerformance() {
        return { ...this.performance };
    }

    /**
     * Handle rendering errors
     * @param {Error} error - Error object
     */
    handleRenderError(error) {
        console.error(`Render error in ${this.name}:`, error);
        
        // Fallback to basic rendering
        try {
            this.renderFallback();
        } catch (fallbackError) {
            console.error('Fallback rendering also failed:', fallbackError);
        }
    }

    /**
     * Fallback rendering when main render fails
     */
    renderFallback() {
        // Simple gradient fallback
        const currentWidth = width || 800;
        const currentHeight = height || 600;
        
        if (pixels && pixels.length >= currentWidth * currentHeight * 4) {
            for (let y = 0; y < currentHeight; y++) {
                for (let x = 0; x < currentWidth; x++) {
                    const index = (y * currentWidth + x) * 4;
                    const intensity = (x + y) / (currentWidth + currentHeight);
                    
                    pixels[index] = Math.floor(intensity * 255);     // R
                    pixels[index + 1] = Math.floor(intensity * 128); // G
                    pixels[index + 2] = Math.floor(intensity * 64);  // B
                    pixels[index + 3] = 255;                         // A
                }
            }
        }
    }

    /**
     * Utility function to set pixel color
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {Array} color - Color array [r, g, b, a]
     */
    setPixel(x, y, color) {
        const currentWidth = width || 800;
        const currentHeight = height || 600;
        
        if (x < 0 || x >= currentWidth || y < 0 || y >= currentHeight) {
            return;
        }
        
        const index = (y * currentWidth + x) * 4;
        
        if (pixels && pixels.length > index + 3) {
            pixels[index] = color[0];     // R
            pixels[index + 1] = color[1]; // G
            pixels[index + 2] = color[2]; // B
            pixels[index + 3] = color[3] || 255; // A
        }
    }

    /**
     * Utility function to get pixel color
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {Array} - Color array [r, g, b, a]
     */
    getPixel(x, y) {
        const currentWidth = width || 800;
        const currentHeight = height || 600;
        
        if (x < 0 || x >= currentWidth || y < 0 || y >= currentHeight) {
            return [0, 0, 0, 0];
        }
        
        const index = (y * currentWidth + x) * 4;
        
        if (pixels && pixels.length > index + 3) {
            return [
                pixels[index],
                pixels[index + 1],
                pixels[index + 2],
                pixels[index + 3]
            ];
        }
        
        return [0, 0, 0, 0];
    }

    /**
     * Color blending utility
     * @param {Array} color1 - First color [r, g, b, a]
     * @param {Array} color2 - Second color [r, g, b, a]
     * @param {number} factor - Blend factor (0-1)
     * @returns {Array} - Blended color
     */
    blendColors(color1, color2, factor) {
        const f = Math.max(0, Math.min(1, factor));
        const invF = 1 - f;
        
        return [
            Math.floor(color1[0] * invF + color2[0] * f),
            Math.floor(color1[1] * invF + color2[1] * f),
            Math.floor(color1[2] * invF + color2[2] * f),
            Math.floor(color1[3] * invF + color2[3] * f)
        ];
    }

    /**
     * HSV to RGB conversion
     * @param {number} h - Hue (0-360)
     * @param {number} s - Saturation (0-1)
     * @param {number} v - Value (0-1)
     * @returns {Array} - RGB color [r, g, b]
     */
    hsvToRgb(h, s, v) {
        const c = v * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = v - c;
        
        let r, g, b;
        
        if (h >= 0 && h < 60) {
            r = c; g = x; b = 0;
        } else if (h >= 60 && h < 120) {
            r = x; g = c; b = 0;
        } else if (h >= 120 && h < 180) {
            r = 0; g = c; b = x;
        } else if (h >= 180 && h < 240) {
            r = 0; g = x; b = c;
        } else if (h >= 240 && h < 300) {
            r = x; g = 0; b = c;
        } else {
            r = c; g = 0; b = x;
        }
        
        return [
            Math.floor((r + m) * 255),
            Math.floor((g + m) * 255),
            Math.floor((b + m) * 255)
        ];
    }

    /**
     * Reset pattern to initial state
     */
    reset() {
        this.frameCount = 0;
        this.lastFrameTime = 0;
        this.performance = {
            renderTime: 0,
            pixelOperations: 0,
            frameRate: 60
        };
        
        console.log(`${this.name} pattern reset`);
    }

    /**
     * Cleanup pattern resources
     */
    cleanup() {
        this.pixelBuffer = null;
        this.isInitialized = false;
        console.log(`${this.name} pattern cleaned up`);
    }

    /**
     * Calculate pattern complexity based on parameters - override in subclasses
     * @param {Object} params - Pattern parameters
     * @returns {number} - Complexity score (1-100)
     */
    calculateComplexity(params = {}) {
        throw new Error('calculateComplexity method must be implemented by subclasses');
    }

    /**
     * Get pattern info
     * @returns {Object} - Pattern information
     */
    getInfo() {
        return {
            name: this.name,
            isInitialized: this.isInitialized,
            parameters: this.getParameters(),
            performance: this.getPerformance()
        };
    }
}

export default PatternRenderer;