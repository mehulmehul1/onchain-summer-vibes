/**
 * InterferencePattern.js - Wave Interference Pattern for q5.js
 * 
 * Converts React interference pattern to q5.js with pixel operations
 */

import { PatternRenderer } from './PatternRenderer.js';
import PatternUtils from './PatternUtils.js';

export class InterferencePattern extends PatternRenderer {
    constructor(name = 'InterferencePattern') {
        super(name);
        
        // Pattern-specific parameters
        this.parameters = {
            ...this.parameters,
            wavelength: 50,
            sources: [
                { x: 200, y: 150 },
                { x: 600, y: 150 },
                { x: 400, y: 450 }
            ],
            gradientMode: true,
            threshold: 0.1,
            noiseAmount: 8,
            phaseOffset: 0
        };
        
        // Color configuration
        this.colors = {
            color1: [255, 100, 100], // Red
            color2: [100, 255, 100], // Green
            color3: [100, 100, 255], // Blue
            color4: [50, 50, 50]     // Background
        };
        
        this.timeOffset = 0;
        this.animationSpeed = 1.0;
    }

    /**
     * Initialize interference pattern with options
     * @param {Object} options - Pattern options
     */
    initialize(options = {}) {
        super.initialize(options);
        
        // Update pattern-specific parameters
        if (options.wavelength !== undefined) {
            this.parameters.wavelength = options.wavelength;
        }
        
        if (options.sources) {
            this.parameters.sources = options.sources;
        }
        
        if (options.colors) {
            this.colors = { ...this.colors, ...options.colors };
        }
        
        if (options.gradientMode !== undefined) {
            this.parameters.gradientMode = options.gradientMode;
        }
        
        if (options.threshold !== undefined) {
            this.parameters.threshold = options.threshold;
        }
        
        // Initialize wave sources based on canvas size
        this.initializeWaveSources();
        
        console.log(`${this.name} initialized with ${this.parameters.sources.length} wave sources`);
        return true;
    }

    /**
     * Initialize wave sources based on canvas dimensions
     */
    initializeWaveSources() {
        const currentWidth = width || 800;
        const currentHeight = height || 600;
        
        // Default wave sources in a triangular pattern
        this.parameters.sources = [
            { x: currentWidth * 0.25, y: currentHeight * 0.25 },
            { x: currentWidth * 0.75, y: currentHeight * 0.25 },
            { x: currentWidth * 0.5, y: currentHeight * 0.75 }
        ];
    }

    /**
     * Convert hex color to RGB
     * @param {string} hex - Hex color string
     * @returns {Array} - RGB array [r, g, b]
     */
    hexToRgb(hex) {
        if (Array.isArray(hex)) {
            return hex;
        }
        
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : [128, 128, 128];
    }

    /**
     * Render interference pattern
     * @param {number} time - Current time in seconds
     */
    renderPattern(time) {
        const currentWidth = width || 800;
        const currentHeight = height || 600;
        
        // Update time offset for animation
        this.timeOffset = time * this.animationSpeed;
        
        // Get pattern parameters
        const { wavelength, sources, gradientMode, threshold, noiseAmount } = this.parameters;
        
        // Convert colors to RGB if needed
        const rgb1 = this.hexToRgb(this.colors.color1);
        const rgb2 = this.hexToRgb(this.colors.color2);
        const rgb3 = this.hexToRgb(this.colors.color3);
        const rgb4 = this.hexToRgb(this.colors.color4);
        
        // Render the interference pattern
        for (let y = 0; y < currentHeight; y++) {
            for (let x = 0; x < currentWidth; x++) {
                const index = (y * currentWidth + x) * 4;
                
                // Calculate wave interference
                let amplitude = 0;
                
                sources.forEach((source, i) => {
                    const dx = x - source.x;
                    const dy = y - source.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const phase = i * Math.PI / 4; // Phase offset for each source
                    
                    amplitude += Math.sin((distance / wavelength - this.timeOffset) * 2 * Math.PI + phase);
                });
                
                // Normalize amplitude
                const normalized = amplitude / sources.length;
                
                let finalColor;
                
                if (gradientMode) {
                    // Gradient mode - smooth color transitions
                    const t = (normalized + 1) / 2; // Normalize to 0-1
                    
                    if (t < 0.33) {
                        const localT = t / 0.33;
                        finalColor = this.blendColors(rgb1, rgb2, localT);
                    } else if (t < 0.66) {
                        const localT = (t - 0.33) / 0.33;
                        finalColor = this.blendColors(rgb2, rgb3, localT);
                    } else {
                        const localT = (t - 0.66) / 0.34;
                        finalColor = this.blendColors(rgb3, rgb4, localT);
                    }
                    
                    // Add noise for texture
                    const noise = (Math.random() - 0.5) * noiseAmount;
                    finalColor = [
                        Math.max(0, Math.min(255, finalColor[0] + noise)),
                        Math.max(0, Math.min(255, finalColor[1] + noise)),
                        Math.max(0, Math.min(255, finalColor[2] + noise))
                    ];
                    
                } else {
                    // Line mode - discrete interference lines
                    const isLine = Math.abs(normalized) < threshold;
                    
                    if (isLine) {
                        finalColor = rgb1; // Interference line color
                    } else {
                        finalColor = rgb3; // Background color
                    }
                }
                
                // Set pixel color
                if (pixels && pixels.length > index + 3) {
                    pixels[index] = finalColor[0];     // R
                    pixels[index + 1] = finalColor[1]; // G
                    pixels[index + 2] = finalColor[2]; // B
                    pixels[index + 3] = 255;           // A
                }
            }
        }
        
        // Update performance metrics
        this.performance.pixelOperations = currentWidth * currentHeight;
    }

    /**
     * Blend two colors
     * @param {Array} color1 - First color [r, g, b]
     * @param {Array} color2 - Second color [r, g, b]
     * @param {number} t - Blend factor (0-1)
     * @returns {Array} - Blended color [r, g, b]
     */
    blendColors(color1, color2, t) {
        return [
            Math.floor(color1[0] * (1 - t) + color2[0] * t),
            Math.floor(color1[1] * (1 - t) + color2[1] * t),
            Math.floor(color1[2] * (1 - t) + color2[2] * t)
        ];
    }

    /**
     * Add wave source
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    addWaveSource(x, y) {
        this.parameters.sources.push({ x, y });
        console.log(`Wave source added at (${x}, ${y})`);
    }

    /**
     * Remove wave source
     * @param {number} index - Source index
     */
    removeWaveSource(index) {
        if (index >= 0 && index < this.parameters.sources.length) {
            this.parameters.sources.splice(index, 1);
            console.log(`Wave source ${index} removed`);
        }
    }

    /**
     * Update wave source position
     * @param {number} index - Source index
     * @param {number} x - New X position
     * @param {number} y - New Y position
     */
    updateWaveSource(index, x, y) {
        if (index >= 0 && index < this.parameters.sources.length) {
            this.parameters.sources[index] = { x, y };
            console.log(`Wave source ${index} updated to (${x}, ${y})`);
        }
    }

    /**
     * Set colors
     * @param {Object} colors - Color configuration
     */
    setColors(colors) {
        this.colors = { ...this.colors, ...colors };
        console.log('Colors updated:', this.colors);
    }

    /**
     * Toggle gradient mode
     */
    toggleGradientMode() {
        this.parameters.gradientMode = !this.parameters.gradientMode;
        console.log('Gradient mode:', this.parameters.gradientMode);
    }

    /**
     * Set wavelength
     * @param {number} wavelength - New wavelength
     */
    setWavelength(wavelength) {
        this.parameters.wavelength = Math.max(1, wavelength);
        console.log('Wavelength set to:', this.parameters.wavelength);
    }

    /**
     * Set threshold for line mode
     * @param {number} threshold - New threshold
     */
    setThreshold(threshold) {
        this.parameters.threshold = Math.max(0, Math.min(1, threshold));
        console.log('Threshold set to:', this.parameters.threshold);
    }

    /**
     * Set animation speed
     * @param {number} speed - Animation speed multiplier
     */
    setAnimationSpeed(speed) {
        this.animationSpeed = Math.max(0, speed);
        console.log('Animation speed set to:', this.animationSpeed);
    }

    /**
     * Get current wave sources
     * @returns {Array} - Array of wave source positions
     */
    getWaveSources() {
        return [...this.parameters.sources];
    }

    /**
     * Generate random wave sources
     * @param {number} count - Number of sources to generate
     */
    generateRandomSources(count = 3) {
        const currentWidth = width || 800;
        const currentHeight = height || 600;
        
        this.parameters.sources = [];
        
        for (let i = 0; i < count; i++) {
            this.parameters.sources.push({
                x: Math.random() * currentWidth,
                y: Math.random() * currentHeight
            });
        }
        
        console.log(`Generated ${count} random wave sources`);
    }

    /**
     * Get pattern-specific info
     * @returns {Object} - Pattern information
     */
    getInfo() {
        return {
            ...super.getInfo(),
            waveSources: this.parameters.sources.length,
            wavelength: this.parameters.wavelength,
            mode: this.parameters.gradientMode ? 'gradient' : 'line',
            threshold: this.parameters.threshold,
            animationSpeed: this.animationSpeed,
            colors: this.colors
        };
    }
}

export default InterferencePattern;