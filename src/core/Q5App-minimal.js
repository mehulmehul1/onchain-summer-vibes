/**
 * Q5App-minimal.js - Minimal Canvas 2D Application 
 * 
 * Simple working implementation with SVG masking and interference pattern
 * No external dependencies - pure Canvas 2D
 */

import { SVG_CONFIG, DEFAULT_VALUES, PATTERN_TYPES } from '../constants/patternConfig.js';
import { ControlPanel } from '../ui/ControlPanel.js';
import { InterferencePattern } from '../patterns/InterferencePattern.js';
import { PatternRenderer } from '../patterns/PatternRenderer.js';
import { PatternFactory } from '../patterns/PatternFactory.js';
import { PatternUtils } from '../patterns/PatternUtils.js';
import { GentlePattern } from '../patterns/GentlePattern.js';
import { MandalaPattern } from '../patterns/MandalaPattern.js';
import { VectorFieldPattern } from '../patterns/VectorFieldPattern.js';
import { ShellRidgePattern } from '../patterns/ShellRidgePattern.js';
import { ContourInterferencePattern } from '../patterns/ContourInterferencePattern.js';

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
        this.baseLineWidth = DEFAULT_VALUES.baseLineWidth;
        this.lineWidthVariation = DEFAULT_VALUES.lineWidthVariation;
        this.visualStyle = DEFAULT_VALUES.visualStyle;
        this.directionInteraction = DEFAULT_VALUES.directionInteraction;
        this.textureIntensity = DEFAULT_VALUES.textureIntensity;
        this.useGradientStrokes = DEFAULT_VALUES.useGradientStrokes;
        this.mandalaComplexity = DEFAULT_VALUES.mandalaComplexity;
        this.mandalaSpeed = DEFAULT_VALUES.mandalaSpeed;
        this.tileSize = DEFAULT_VALUES.tileSize;
        this.tileShiftAmplitude = DEFAULT_VALUES.tileShiftAmplitude;
        this.shellRidgeRings = DEFAULT_VALUES.shellRidgeRings;
        this.shellRidgeDistortion = DEFAULT_VALUES.shellRidgeDistortion;
        this.resolution = DEFAULT_VALUES.resolution;
        this.numRings = DEFAULT_VALUES.numRings;
        this.sourcesPerRing = DEFAULT_VALUES.sourcesPerRing;
        this.lineWidth = DEFAULT_VALUES.lineWidth;
        
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
            [PATTERN_TYPES.SHELL_RIDGE]: new ShellRidgePattern(),
            [PATTERN_TYPES.CONTOUR_INTERFERENCE]: new ContourInterferencePattern()
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
            console.log('SVG_CONFIG dimensions:', SVG_CONFIG.width, 'x', SVG_CONFIG.height);
            console.log('Path data length:', SVG_CONFIG.path.length);
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
        
        // Clear canvas with white background so we can see clearly
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // First draw the black outline background (this stays solid black)
        this.drawLogoBackground();
        
        // Then apply SVG clipping and render pattern ONLY inside the white letterforms
        this.renderWithSVGClip(elapsed);
        
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
        } else if (this.patternType === PATTERN_TYPES.GENTLE) {
            this.renderGentlePattern(ctx, time, width, height);
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
            baseLineWidth: this.baseLineWidth,
            lineWidthVariation: this.lineWidthVariation,
            visualStyle: this.visualStyle,
            directionInteraction: this.directionInteraction,
            textureIntensity: this.textureIntensity,
            useGradientStrokes: this.useGradientStrokes,
            mandalaComplexity: this.mandalaComplexity,
            mandalaSpeed: this.mandalaSpeed,
            tileSize: this.tileSize,
            tileShiftAmplitude: this.tileShiftAmplitude,
            shellRidgeRings: this.shellRidgeRings,
            shellRidgeDistortion: this.shellRidgeDistortion,
            resolution: this.resolution,
            numRings: this.numRings,
            sourcesPerRing: this.sourcesPerRing,
            lineWidth: this.lineWidth
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
        const color3 = this.colors.accent;
        const color4 = this.colors.background;
        
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
                
                let r, g, b;
                
                if (this.gradientMode) {
                    // GRADIENT MODE: Smooth 4-color gradient
                    const t = Math.max(0, Math.min(1, normalizedWave)); // Clamp to 0-1
                    
                    if (t < 0.33) {
                        const localT = t / 0.33;
                        r = Math.round(color1[0] * (1 - localT) + color2[0] * localT);
                        g = Math.round(color1[1] * (1 - localT) + color2[1] * localT);
                        b = Math.round(color1[2] * (1 - localT) + color2[2] * localT);
                    } else if (t < 0.66) {
                        const localT = (t - 0.33) / 0.33;
                        r = Math.round(color2[0] * (1 - localT) + color3[0] * localT);
                        g = Math.round(color2[1] * (1 - localT) + color3[1] * localT);
                        b = Math.round(color2[2] * (1 - localT) + color3[2] * localT);
                    } else {
                        const localT = (t - 0.66) / 0.34;
                        r = Math.round(color3[0] * (1 - localT) + color4[0] * localT);
                        g = Math.round(color3[1] * (1 - localT) + color4[1] * localT);
                        b = Math.round(color3[2] * (1 - localT) + color4[2] * localT);
                    }
                } else {
                    // LINE MODE: Sharp interference lines
                    const isLine = Math.abs(normalizedWave - 0.5) < this.threshold;
                    
                    if (isLine) {
                        // Interference line color (primary)
                        r = color1[0];
                        g = color1[1];
                        b = color1[2];
                    } else {
                        // Background color (accent)
                        r = color3[0];
                        g = color3[1];
                        b = color3[2];
                    }
                }
                
                data[index] = r;
                data[index + 1] = g;
                data[index + 2] = b;
                data[index + 3] = 255; // Alpha
            }
        }
        
        // Put image data back to canvas
        ctx.putImageData(imageData, 0, 0);
    }
    
    renderGentlePattern(ctx, time, width, height) {
        const { 
            wavelength, 
            lineDensity, 
            baseLineWidth, 
            lineWidthVariation, 
            visualStyle, 
            directionInteraction, 
            textureIntensity, 
            useGradientStrokes 
        } = this;
        
        // Clear canvas with background color
        ctx.fillStyle = `rgb(${this.colors.background[0]}, ${this.colors.background[1]}, ${this.colors.background[2]})`;
        ctx.fillRect(0, 0, width, height);
        
        const stepSize = Math.max(4, Math.ceil(width / 300));
        const interactionStrength = directionInteraction / 100;
        const textureAmount = textureIntensity / 100;
        
        // Setup visual style effects
        this.setupVisualStyle(ctx, visualStyle);
        
        // Create interaction buffer for direction mixing
        let interactionField = [];
        if (interactionStrength > 0) {
            interactionField = this.createInteractionField(width, height, time);
        }
        
        // Draw horizontal flowing lines (primary color)
        const numHorizontalLines = Math.min(lineDensity, Math.ceil(height / 20));
        for (let i = 0; i < numHorizontalLines; i++) {
            const yPos = (i / numHorizontalLines) * height;
            const amplitude = (35 + 20 * Math.sin(time * 0.2 + i * 0.1)) * (wavelength / 25);
            const frequency = (0.008 + 0.004 * Math.sin(time * 0.1 + i * 0.05)) * (25 / wavelength);
            const speedOffset = time * (0.5 + 0.3 * Math.sin(i * 0.1));
            
            // Enhanced line width control
            const baseThickness = baseLineWidth + lineWidthVariation * Math.sin(time + i * 0.2);
            const thickness = Math.max(0.1, baseThickness + textureAmount * (Math.random() - 0.5) * 2);
            
            // Enhanced opacity with texture
            const baseOpacity = 0.4 + 0.3 * Math.abs(Math.sin(time * 0.3 + i * 0.15));
            const opacity = baseOpacity + textureAmount * (Math.random() - 0.5) * 0.3;
            
            this.drawFlowingLine(ctx, 'horizontal', i, {
                yPos, amplitude, frequency, speedOffset, thickness, opacity,
                width, height, stepSize, time, useGradientStrokes, 
                interactionField, interactionStrength, visualStyle
            });
        }
        
        // Draw vertical flowing lines (secondary color)
        const numVerticalLines = Math.min(lineDensity, Math.ceil(width / 25));
        for (let i = 0; i < numVerticalLines; i++) {
            const xPos = (i / numVerticalLines) * width;
            const amplitude = (30 + 15 * Math.sin(time * 0.15 + i * 0.12)) * (wavelength / 25);
            const frequency = (0.009 + 0.004 * Math.cos(time * 0.12 + i * 0.07)) * (25 / wavelength);
            const speedOffset = time * (0.4 + 0.25 * Math.cos(i * 0.15));
            
            // Enhanced line width control
            const baseThickness = baseLineWidth + lineWidthVariation * Math.sin(time + i * 0.3);
            const thickness = Math.max(0.1, baseThickness + textureAmount * (Math.random() - 0.5) * 2);
            
            // Enhanced opacity with texture
            const baseOpacity = 0.3 + 0.2 * Math.abs(Math.sin(time * 0.25 + i * 0.18));
            const opacity = baseOpacity + textureAmount * (Math.random() - 0.5) * 0.3;
            
            this.drawFlowingLine(ctx, 'vertical', i, {
                xPos, amplitude, frequency, speedOffset, thickness, opacity,
                width, height, stepSize, time, useGradientStrokes,
                interactionField, interactionStrength, visualStyle
            });
        }
        
        // Draw diagonal flowing lines (accent color)
        const numDiagonalLines = Math.min(Math.ceil(lineDensity / 2), Math.ceil(width / 80));
        for (let i = 0; i < numDiagonalLines; i++) {
            const offset = (i / numDiagonalLines) * width * 1.5 - width * 0.25;
            const amplitude = (20 + 10 * Math.cos(time * 0.25 + i * 0.1)) * (wavelength / 25);
            const frequency = (0.01 + 0.005 * Math.sin(time * 0.15 + i * 0.08)) * (25 / wavelength);
            const phase = time * (0.3 + 0.2 * Math.sin(i * 0.1));
            
            // Enhanced line width control
            const baseThickness = baseLineWidth + lineWidthVariation * Math.sin(time + i * 0.25);
            const thickness = Math.max(0.1, baseThickness + textureAmount * (Math.random() - 0.5) * 2);
            
            // Enhanced opacity with texture
            const baseOpacity = 0.2 + 0.15 * Math.abs(Math.sin(time * 0.2 + i * 0.1));
            const opacity = baseOpacity + textureAmount * (Math.random() - 0.5) * 0.3;
            
            this.drawFlowingLine(ctx, 'diagonal', i, {
                offset, amplitude, frequency, phase, thickness, opacity,
                width, height, stepSize, time, useGradientStrokes,
                interactionField, interactionStrength, visualStyle
            });
        }
    }
    
    setupVisualStyle(ctx, style) {
        switch(style) {
            case 'glow':
                ctx.shadowBlur = 8;
                ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
                break;
            case 'sketchy':
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                break;
            case 'dotted':
                ctx.setLineDash([5, 5]);
                break;
            default: // smooth
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.setLineDash([]);
                break;
        }
    }
    
    createInteractionField(width, height, time) {
        const field = [];
        const gridSize = 20;
        for (let y = 0; y < height; y += gridSize) {
            for (let x = 0; x < width; x += gridSize) {
                const influence = Math.sin(x * 0.01 + time) * Math.cos(y * 0.01 + time * 0.7);
                field.push({ x, y, influence });
            }
        }
        return field;
    }
    
    drawFlowingLine(ctx, direction, index, params) {
        const { 
            width, height, stepSize, time, thickness, opacity, 
            useGradientStrokes, interactionField, interactionStrength, visualStyle 
        } = params;
        
        ctx.beginPath();
        ctx.lineWidth = thickness;
        
        // Create gradient stroke if enabled
        if (useGradientStrokes) {
            const gradient = this.createLineGradient(ctx, direction, width, height);
            ctx.strokeStyle = gradient;
        } else {
            const colorKey = direction === 'horizontal' ? 'primary' : 
                           direction === 'vertical' ? 'secondary' : 'accent';
            ctx.strokeStyle = `rgba(${this.colors[colorKey][0]}, ${this.colors[colorKey][1]}, ${this.colors[colorKey][2]}, ${Math.max(0, Math.min(1, opacity))})`;
        }
        
        let firstPoint = true;
        
        if (direction === 'horizontal') {
            const { yPos, amplitude, frequency, speedOffset } = params;
            for (let x = 0; x < width; x += stepSize) {
                let y = yPos + amplitude * Math.sin(x * frequency + speedOffset);
                
                // Apply direction interaction
                if (interactionStrength > 0) {
                    const interaction = this.getInteractionInfluence(x, y, interactionField);
                    y += interaction * interactionStrength * 20;
                }
                
                // Apply texture noise for sketchy style
                if (visualStyle === 'sketchy') {
                    y += (Math.random() - 0.5) * 2;
                }
                
                if (firstPoint) {
                    ctx.moveTo(x, y);
                    firstPoint = false;
                } else {
                    ctx.lineTo(x, y);
                }
            }
        } else if (direction === 'vertical') {
            const { xPos, amplitude, frequency, speedOffset } = params;
            for (let y = 0; y < height; y += stepSize) {
                let x = xPos + amplitude * Math.sin(y * frequency + speedOffset);
                
                // Apply direction interaction
                if (interactionStrength > 0) {
                    const interaction = this.getInteractionInfluence(x, y, interactionField);
                    x += interaction * interactionStrength * 20;
                }
                
                // Apply texture noise for sketchy style
                if (visualStyle === 'sketchy') {
                    x += (Math.random() - 0.5) * 2;
                }
                
                if (firstPoint) {
                    ctx.moveTo(x, y);
                    firstPoint = false;
                } else {
                    ctx.lineTo(x, y);
                }
            }
        } else { // diagonal
            const { offset, amplitude, frequency, phase } = params;
            const steps = Math.ceil(height / stepSize);
            for (let j = 0; j <= steps; j++) {
                const progress = j / steps;
                let x = offset + progress * width;
                let y = progress * height + amplitude * Math.sin(progress * 8 + phase);
                
                // Apply direction interaction
                if (interactionStrength > 0) {
                    const interaction = this.getInteractionInfluence(x, y, interactionField);
                    x += interaction * interactionStrength * 15;
                    y += interaction * interactionStrength * 15;
                }
                
                // Apply texture noise for sketchy style
                if (visualStyle === 'sketchy') {
                    x += (Math.random() - 0.5) * 2;
                    y += (Math.random() - 0.5) * 2;
                }
                
                if (x >= 0 && x <= width && y >= 0 && y <= height) {
                    if (firstPoint) {
                        ctx.moveTo(x, y);
                        firstPoint = false;
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
            }
        }
        
        ctx.stroke();
    }
    
    createLineGradient(ctx, direction, width, height) {
        let gradient;
        if (direction === 'horizontal') {
            gradient = ctx.createLinearGradient(0, 0, width, 0);
        } else if (direction === 'vertical') {
            gradient = ctx.createLinearGradient(0, 0, 0, height);
        } else {
            gradient = ctx.createLinearGradient(0, 0, width, height);
        }
        
        const colorKey = direction === 'horizontal' ? 'primary' : 
                        direction === 'vertical' ? 'secondary' : 'accent';
        const color = this.colors[colorKey];
        
        gradient.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.1)`);
        gradient.addColorStop(0.5, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.8)`);
        gradient.addColorStop(1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.1)`);
        
        return gradient;
    }
    
    getInteractionInfluence(x, y, field) {
        if (!field.length) return 0;
        
        // Find nearest field point
        let minDist = Infinity;
        let influence = 0;
        for (const point of field) {
            const dist = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
            if (dist < minDist) {
                minDist = dist;
                influence = point.influence;
            }
        }
        
        return influence;
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
    
    renderWithSVGClip(elapsed) {
        if (!this.logoPath2D) {
            console.warn('Logo Path2D not available, rendering without clipping');
            this.renderPattern(this.ctx, elapsed, this.canvas.width, this.canvas.height);
            return;
        }
        
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Position and scale for logo rendering
        const scale = Math.min(width / SVG_CONFIG.width, height / SVG_CONFIG.height) * 0.7;
        
        // Create off-screen canvas for pattern
        const patternCanvas = document.createElement('canvas');
        patternCanvas.width = width;
        patternCanvas.height = height;
        const patternCtx = patternCanvas.getContext('2d');
        
        // Render pattern to off-screen canvas
        this.renderPattern(patternCtx, elapsed, width, height);
        
        // Now apply the clipping and draw the pattern
        this.ctx.save();
        
        // Set up clipping with the logo path (letterforms)
        this.ctx.translate(width / 2, height / 2);
        this.ctx.scale(scale, scale);
        this.ctx.translate(-SVG_CONFIG.width / 2, -SVG_CONFIG.height / 2);
        
        // Create clipping path using the logo letterforms
        this.ctx.clip(this.logoPath2D);
        
        // Reset transform while keeping the clip
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        // Draw the pre-rendered pattern - it will only show inside the clipped letterforms
        this.ctx.drawImage(patternCanvas, 0, 0);
        
        this.ctx.restore();
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