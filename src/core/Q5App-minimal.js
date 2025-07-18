/**
 * Q5App-minimal.js - Minimal Canvas 2D Application 
 * 
 * Simple working implementation with SVG masking and interference pattern
 * No external dependencies - pure Canvas 2D
 */

import { SVG_CONFIG, DEFAULT_VALUES, PATTERN_TYPES } from '../constants/patternConfig.js';
import { ControlPanel } from '../ui/ControlPanel.js';
import { GentlePattern } from '../patterns/GentlePattern.js';
import { MandalaPattern } from '../patterns/MandalaPattern.js';
import { VectorFieldPattern } from '../patterns/VectorFieldPattern.js';
import { ShellRidgePattern } from '../patterns/ShellRidgePattern.js';

export class Q5App {
    constructor(config = {}) {
        this.config = {
            canvas: {
                targetFPS: 60,
                ...config.canvas
            },
            debug: true,
            ...config
        };
        
        this.initialized = false;
        this.canvas = null;
        this.ctx = null;
        this.frameCount = 0;
        this.startTime = Date.now();
        this.logoPath2D = null;
        this.backgroundPath2D = null;
        this.controlPanel = null;
        
        // Pattern parameters (using defaults from config)
        this.patternType = PATTERN_TYPES.INTERFERENCE;
        this.wavelength = DEFAULT_VALUES.wavelength;
        this.speed = DEFAULT_VALUES.speed;
        this.threshold = DEFAULT_VALUES.threshold;
        this.gradientMode = DEFAULT_VALUES.gradientMode;
        this.sourceCount = DEFAULT_VALUES.sourceCount;
        this.lineDensity = DEFAULT_VALUES.lineDensity;
        this.mandalaComplexity = DEFAULT_VALUES.mandalaComplexity;
        this.mandalaSpeed = DEFAULT_VALUES.mandalaSpeed;
        this.tileSize = DEFAULT_VALUES.tileSize;
        this.tileShiftAmplitude = DEFAULT_VALUES.tileShiftAmplitude;
        this.shellRidgeRings = DEFAULT_VALUES.shellRidgeRings;
        this.shellRidgeDistortion = DEFAULT_VALUES.shellRidgeDistortion;
        
        // Theme colors (using defaults from config)
        this.colors = {
            primary: this.hexToRgb(DEFAULT_VALUES.colors.color1),
            secondary: this.hexToRgb(DEFAULT_VALUES.colors.color2),
            accent: this.hexToRgb(DEFAULT_VALUES.colors.color3),
            background: this.hexToRgb(DEFAULT_VALUES.colors.color4)
        };
        
        // Initialize pattern renderers
        this.patterns = {
            [PATTERN_TYPES.GENTLE]: new GentlePattern(),
            [PATTERN_TYPES.MANDALA]: new MandalaPattern(),
            [PATTERN_TYPES.VECTOR_FIELD]: new VectorFieldPattern(),
            [PATTERN_TYPES.SHELL_RIDGE]: new ShellRidgePattern()
        };
        
        console.log('Q5App initialized with config:', this.config);
    }
    
    async initialize() {
        console.log('Initializing Q5App...');
        
        try {
            // Find and set up canvas
            this.canvas = document.getElementById('artCanvas');
            if (!this.canvas) {
                throw new Error('Canvas element with id "artCanvas" not found');
            }
            
            console.log('Canvas found:', this.canvas);
            
            // Set up canvas size
            this.resizeCanvas();
            
            console.log('Canvas resized to:', this.canvas.width, 'x', this.canvas.height);
            
            // Get 2D context
            this.ctx = this.canvas.getContext('2d');
            if (!this.ctx) {
                throw new Error('Failed to get 2D context');
            }
            
            // Create SVG logo path
            this.createLogoPath();
            
            this.initialized = true;
            console.log('Q5App initialized successfully');
            
            // Make canvas visible
            this.canvas.style.display = 'block';
            
            // Initialize control panel
            this.initializeControls();
            
            // Start animation loop
            this.startAnimation();
            
        } catch (error) {
            console.error('Q5App initialization failed:', error);
            throw error;
        }
    }
    
    createLogoPath() {
        try {
            // Create Path2D objects for both paths
            this.logoPath2D = new Path2D(SVG_CONFIG.path);           // White letterforms for clipping
            this.backgroundPath2D = new Path2D(SVG_CONFIG.backgroundPath); // Black outline
            console.log('Logo Path2D objects created successfully');
        } catch (error) {
            console.warn('Failed to create Path2D, creating fallback rectangle:', error);
            // Fallback to simple rectangle
            this.logoPath2D = new Path2D();
            this.backgroundPath2D = new Path2D();
            const halfWidth = SVG_CONFIG.width / 2;
            const halfHeight = SVG_CONFIG.height / 2;
            
            this.logoPath2D.rect(-halfWidth, -halfHeight, SVG_CONFIG.width, SVG_CONFIG.height);
            this.backgroundPath2D.rect(-halfWidth - 10, -halfHeight - 10, SVG_CONFIG.width + 20, SVG_CONFIG.height + 20);
        }
    }
    
    /**
     * Initialize control panel
     */
    initializeControls() {
        console.log('Initializing control panel...');
        this.controlPanel = new ControlPanel(this);
        console.log('Control panel initialized');
    }
    
    /**
     * Update parameter from controls
     * @param {string} key - Parameter key
     * @param {any} value - Parameter value
     */
    updateParameter(key, value) {
        console.log(`Updating parameter: ${key} = ${value}`);
        
        // Handle color updates
        if (key === 'colors') {
            this.colors = {
                primary: this.hexToRgb(value.color1),
                secondary: this.hexToRgb(value.color2),
                accent: this.hexToRgb(value.color3),
                background: this.hexToRgb(value.color4)
            };
            return;
        }
        
        // Handle individual parameter updates
        if (this.hasOwnProperty(key)) {
            this[key] = value;
        } else {
            console.warn(`Unknown parameter: ${key}`);
        }
    }
    
    /**
     * Get parameter value
     * @param {string} key - Parameter key
     * @returns {any} - Parameter value
     */
    getParameter(key) {
        if (key === 'colors') {
            return {
                color1: this.rgbToHex(this.colors.primary),
                color2: this.rgbToHex(this.colors.secondary),
                color3: this.rgbToHex(this.colors.accent),
                color4: this.rgbToHex(this.colors.background)
            };
        }
        
        return this.hasOwnProperty(key) ? this[key] : undefined;
    }
    
    /**
     * Convert hex color to RGB array
     * @param {string} hex - Hex color string
     * @returns {Array} - RGB array [r, g, b]
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : [0, 0, 0];
    }
    
    /**
     * Convert RGB array to hex color
     * @param {Array} rgb - RGB array [r, g, b]
     * @returns {string} - Hex color string
     */
    rgbToHex(rgb) {
        return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
    }
    
    resizeCanvas() {
        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Set canvas size to fill most of the viewport
        const canvasWidth = Math.min(viewportWidth * 0.9, 1200);
        const canvasHeight = Math.min(viewportHeight * 0.8, 800);
        
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        
        console.log(`Canvas resized to ${canvasWidth}x${canvasHeight}`);
    }
    
    startAnimation() {
        const animate = () => {
            if (this.initialized) {
                this.draw();
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }
    
    draw() {
        if (!this.initialized || !this.ctx) return;
        
        this.frameCount++;
        const currentTime = Date.now();
        const elapsed = (currentTime - this.startTime) / 1000;
        
        // Debug: Log first few frames
        if (this.frameCount <= 5) {
            console.log(`Frame ${this.frameCount}: Canvas ${this.canvas.width}x${this.canvas.height}`);
        }
        
        // Clear canvas with white background
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Create off-screen canvas for pattern
        const patternCanvas = document.createElement('canvas');
        patternCanvas.width = this.canvas.width;
        patternCanvas.height = this.canvas.height;
        const patternCtx = patternCanvas.getContext('2d');
        
        // Render selected pattern to off-screen canvas
        this.renderPattern(patternCtx, elapsed, this.canvas.width, this.canvas.height);
        
        // Apply SVG mask to the pattern (using white letterforms only)
        this.applySVGMask(patternCanvas);
        
        // Draw the black outline background first
        this.drawLogoBackground();
        
        // Draw the masked pattern to main canvas (fills the white letterforms)
        this.ctx.drawImage(patternCanvas, 0, 0);
        
        // Draw frame info
        this.drawFrameInfo(elapsed);
    }
    
    /**
     * Render the selected pattern
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} time - Animation time
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     */
    renderPattern(ctx, time, width, height) {
        // Get pattern options based on current pattern type
        const options = this.getPatternOptions();
        
        // Render based on pattern type
        if (this.patternType === PATTERN_TYPES.INTERFERENCE) {
            this.renderInterferencePattern(ctx, time);
        } else if (this.patterns[this.patternType]) {
            this.patterns[this.patternType].render(ctx, time, width, height, this.colors, options);
        } else {
            // Fallback to interference pattern
            this.renderInterferencePattern(ctx, time);
        }
    }
    
    /**
     * Get pattern options based on current settings
     * @returns {Object} Pattern options
     */
    getPatternOptions() {
        return {
            wavelength: this.wavelength,
            speed: this.speed,
            threshold: this.threshold,
            gradientMode: this.gradientMode,
            sourceCount: this.sourceCount,
            lineDensity: this.lineDensity,
            mandalaComplexity: this.mandalaComplexity,
            mandalaSpeed: this.mandalaSpeed,
            tileSize: this.tileSize,
            tileShiftAmplitude: this.tileShiftAmplitude,
            shellRidgeRings: this.shellRidgeRings,
            shellRidgeDistortion: this.shellRidgeDistortion
        };
    }
    
    renderInterferencePattern(ctx, time) {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        
        // Create image data for pixel manipulation
        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;
        
        // Get current theme colors
        const color1 = this.colors.primary;
        const color2 = this.colors.secondary;
        
        // Interference pattern parameters (dynamic)
        const sources = [];
        for (let i = 0; i < this.sourceCount; i++) {
            const angle = (i / this.sourceCount) * Math.PI * 2;
            const radius = Math.min(width, height) * 0.3;
            const x = width * 0.5 + Math.cos(angle) * radius;
            const y = height * 0.5 + Math.sin(angle) * radius;
            sources.push({ x, y });
        }
        
        const wavelength = this.wavelength;
        const amplitude = 1.0;
        const frequency = 0.02;
        
        // Render interference pattern
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                
                // Calculate wave interference
                let totalWave = 0;
                for (const source of sources) {
                    const dx = x - source.x;
                    const dy = y - source.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const wave = Math.sin(distance * frequency + time * this.speed * 100) * amplitude;
                    totalWave += wave;
                }
                
                // Normalize wave value
                const normalizedWave = (totalWave + sources.length) / (sources.length * 2);
                
                // Interpolate between colors
                const r = Math.round(color1[0] * normalizedWave + color2[0] * (1 - normalizedWave));
                const g = Math.round(color1[1] * normalizedWave + color2[1] * (1 - normalizedWave));
                const b = Math.round(color1[2] * normalizedWave + color2[2] * (1 - normalizedWave));
                
                data[index] = r;
                data[index + 1] = g;
                data[index + 2] = b;
                data[index + 3] = 255; // Alpha
            }
        }
        
        // Put image data back to canvas
        ctx.putImageData(imageData, 0, 0);
    }
    
    drawLogoBackground() {
        // Draw the black outline background
        this.ctx.fillStyle = '#000000';
        
        // Position and scale the background
        const width = this.canvas.width;
        const height = this.canvas.height;
        const scale = Math.min(width / SVG_CONFIG.width, height / SVG_CONFIG.height) * 0.7;
        
        this.ctx.save();
        this.ctx.translate(width / 2, height / 2);
        this.ctx.scale(scale, scale);
        this.ctx.translate(-SVG_CONFIG.width / 2, -SVG_CONFIG.height / 2);
        
        // Draw the background path (black outline)
        this.ctx.fill(this.backgroundPath2D);
        this.ctx.restore();
    }
    
    applySVGMask(canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Create a temporary canvas for the mask
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = width;
        maskCanvas.height = height;
        const maskCtx = maskCanvas.getContext('2d');
        
        // Draw SVG letterforms as mask (white fill) - only the inner white shapes
        maskCtx.fillStyle = '#ffffff';
        
        // Position and scale the logo
        const scale = Math.min(width / SVG_CONFIG.width, height / SVG_CONFIG.height) * 0.7;
        maskCtx.save();
        maskCtx.translate(width / 2, height / 2);
        maskCtx.scale(scale, scale);
        maskCtx.translate(-SVG_CONFIG.width / 2, -SVG_CONFIG.height / 2);
        
        // Draw the letterform path (white shapes inside the black outline)
        maskCtx.fill(this.logoPath2D);
        maskCtx.restore();
        
        // Apply mask using composite operation
        ctx.globalCompositeOperation = 'destination-in';
        ctx.drawImage(maskCanvas, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
    }
    
    drawFrameInfo(elapsed) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(
            `Frame: ${this.frameCount} | Time: ${elapsed.toFixed(1)}s | Theme: Ocean`,
            10,
            25
        );
    }
    
    windowResized() {
        if (this.canvas) {
            this.resizeCanvas();
        }
    }
}