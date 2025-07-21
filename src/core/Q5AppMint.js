/**
 * Q5AppMint.js - Mint-Ready Canvas 2D Application for Highlight.xyz
 * 
 * Clean implementation without controls for generative NFT minting
 * Includes random pattern/theme selection and Highlight integration
 */

import { SVG_CONFIG, DEFAULT_VALUES, PATTERN_TYPES, THEME_RARITY, THEME_PRESETS } from '../constants/patternConfig.js';
import { ColorHarmonyValidator } from '../utils/ColorHarmonyValidator.js';
import { ThemePatternEnhancer } from '../utils/ThemePatternEnhancer.js';
import { AdvancedColorBlender } from '../utils/AdvancedColorBlender.js';
import { hlGen } from './HLGenIntegration.js';

// Pattern imports
import { InterferencePattern } from '../patterns/InterferencePattern.js';
import { GentlePattern } from '../patterns/GentlePattern.js';
import { MandalaPattern } from '../patterns/MandalaPattern.js';
import { VectorFieldPattern } from '../patterns/VectorFieldPattern.js';
import { ShellRidgePattern } from '../patterns/ShellRidgePattern.js';
import { ContourInterferencePattern } from '../patterns/ContourInterferencePattern.js';
import { RisoPrintPattern } from '../patterns/RisoPrintPattern.js';
import { RadialGrowthPattern } from '../patterns/RadialGrowthPattern.js';
import { FlamePattern } from '../patterns/FlamePattern.js';

export class Q5AppMint {
    constructor(config = {}) {
        this.config = {
            canvas: {
                targetFPS: 60,
                ...config.canvas
            },
            debug: false, // Disabled for mint version
            mint: true,   // Enable mint mode
            ...config
        };
        
        this.initialized = false;
        this.canvas = null;
        this.ctx = null;
        this.frameCount = 0;
        this.startTime = Date.now();
        this.logoPath2D = null;
        this.backgroundPath2D = null;
        
        // Mint-specific properties
        this.tokenTraits = {};
        this.generatedAt = Date.now();
        
        // Initialize randomized parameters for minting
        this.initializeMintParameters();
        
        // No theme enhancement for mint - use pure colors
        
        // Initialize pattern renderers
        this.patterns = {
            [PATTERN_TYPES.INTERFERENCE]: new InterferencePattern(),
            [PATTERN_TYPES.GENTLE]: new GentlePattern(),
            [PATTERN_TYPES.MANDALA]: new MandalaPattern(),
            [PATTERN_TYPES.VECTOR_FIELD]: new VectorFieldPattern(),
            [PATTERN_TYPES.SHELL_RIDGE]: new ShellRidgePattern(),
            [PATTERN_TYPES.CONTOUR_INTERFERENCE]: new ContourInterferencePattern(),
            [PATTERN_TYPES.RISO_PRINT]: new RisoPrintPattern(),
            [PATTERN_TYPES.RADIAL_GROWTH]: new RadialGrowthPattern(),
            [PATTERN_TYPES.FLAME]: new FlamePattern()
        };
        
        // Bind keyboard events
        this.bindKeyboardEvents();
    }
    
    /**
     * Get a random color from the current theme (selected once at initialization)
     */
    getRandomThemeColor() {
        return this.canvasBackgroundColor;
    }
    
    /**
     * Bind keyboard events for save functionality
     */
    bindKeyboardEvents() {
        document.addEventListener('keydown', (event) => {
            // Check if 'S' key is pressed
            if (event.key.toLowerCase() === 's') {
                event.preventDefault(); // Prevent browser default save dialog
                this.saveAsPNG();
            }
        });
    }
    
    /**
     * Save current canvas as PNG
     */
    saveAsPNG() {
        if (!this.canvas) return;
        
        try {
            // Generate filename with pattern and theme info
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
            const patternName = this.tokenTraits?.Pattern || 'Unknown';
            const themeName = this.tokenTraits?.Theme || 'Unknown';
            const filename = `OnchainSummerVibes_${patternName}_${themeName}_${timestamp}.png`;
            
            // Create download link
            const link = document.createElement('a');
            link.download = filename;
            link.href = this.canvas.toDataURL('image/png', 1.0);
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            console.log(`✅ Saved: ${filename}`);
            
        } catch (error) {
            console.error('Failed to save PNG:', error);
        }
    }
    
    /**
     * Initialize randomized parameters for minting using Highlight's random system
     */
    initializeMintParameters() {
        // Randomly select pattern with equal distribution
        const availablePatterns = Object.values(PATTERN_TYPES);
        this.patternType = hlGen.randomElement(availablePatterns);
        
        // Randomly select theme based on rarity weights
        this.currentTheme = this.selectRandomTheme();
        
        // Set colors from selected theme
        const themeData = this.getThemeData(this.currentTheme);
        this.colors = {
            primary: this.hexToRgb(themeData.color1),
            secondary: this.hexToRgb(themeData.color2),
            accent: this.hexToRgb(themeData.color3),
            background: this.hexToRgb(themeData.color4)
        };
        this.themeRarity = themeData.rarity;
        
        // Randomize pattern-specific parameters
        this.randomizePatternParameters();
        
        // Select a random canvas background color from theme (once at initialization)
        const allColors = [this.colors.primary, this.colors.secondary, this.colors.accent, this.colors.background];
        this.canvasBackgroundColor = hlGen.randomElement(allColors);
        
        // Generate token traits for Highlight
        this.generateTokenTraits();
    }
    
    /**
     * Select random theme based on rarity distribution
     */
    selectRandomTheme() {
        const rarityRoll = hlGen.random() * 100;
        
        let currentWeight = 0;
        for (const [rarity, config] of Object.entries(THEME_RARITY)) {
            currentWeight += config.weight;
            if (rarityRoll <= currentWeight) {
                return hlGen.randomElement(config.themes);
            }
        }
        
        // Fallback to common theme
        return hlGen.randomElement(THEME_RARITY.common.themes);
    }
    
    /**
     * Randomize pattern-specific parameters within sensible ranges
     */
    randomizePatternParameters() {
        // Base animation parameters
        this.speed = DEFAULT_VALUES.speed * (0.5 + hlGen.random() * 1.0);
        this.wavelength = DEFAULT_VALUES.wavelength * (0.7 + hlGen.random() * 0.6);
        this.threshold = DEFAULT_VALUES.threshold * (0.8 + hlGen.random() * 0.4);
        
        // Pattern-specific randomization
        switch (this.patternType) {
            case PATTERN_TYPES.INTERFERENCE:
                // Wavelength: 10-100 with step 10
                this.wavelength = 10 + hlGen.randomInt(0, 10) * 10; // Creates values: 10, 20, 30, ..., 100
                
                // Animation speed: 0.5-1.5 with step 0.25  
                this.speed = 0.01 + hlGen.randomInt(0, 0.25) ; // Creates values: 0.5, 0.75, 1.0, 1.25, 1.5
                
                // Wave sources: interpolate smoothly from 2 to 9
                this.sourceCount = 2 + hlGen.randomInt(0, 8); // Creates values: 2, 3, 4, 5, 6, 7, 8, 9
                
                // Initialize options object if not exists
                this.options = this.options || {};
                
                // Randomly toggle gradient mode
                this.options.gradientMode = hlGen.random() > 0.5;
                
                // // Existing parameters
                // this.noiseAmount = 8 + hlGen.randomInt(0, 12);
                // this.phaseOffset = hlGen.random() * Math.PI * 2;
                break;

            case PATTERN_TYPES.MANDALA:
                // Layer spacing: 0.2-0.5
                this.layerGrowthFactor = 0.2 + hlGen.random() * 0.3;
                
                // Complexity: 15-20 with step 1
                this.mandalaComplexity = 15 + hlGen.randomInt(0, 6);
                
                // Rotation speed: 10-16
                this.rotationSpeed = 10 + hlGen.random() * 6;
                
                // Animation speed: 2.5-4
                this.mandalaSpeed = 2.5 + hlGen.random() * 1.5;
                
                // Galaxy rotation: fixed at 1.5
                this.galaxyRotation = 1.5;
                
                // Spiral arms: 1.2-1.6
                this.spiralArmFactor = 1.2 + hlGen.random() * 0.4;
                break;
                
            case PATTERN_TYPES.SHELL_RIDGE:
                this.shellRidgeRings = 15 + hlGen.randomInt(0, 20);
                this.shellRidgeDistortion = 5 + hlGen.random() * 10;
                this.shellRidgeColorMode = hlGen.random() > 0.5; // Random boolean for dual color mode
                break;
                
            case PATTERN_TYPES.FLAME:
                // Flame height: 0.7-0.95 (taller flames)
                this.flameHeight = 0.7 + hlGen.random() * 0.25;
                
                // Flame speed: 1.5-3.0 (much faster animation)
                this.flameSpeed = 1.5 + hlGen.random() * 1.5;
                
                // Flame intensity: 0.8-1.0 (always high intensity)
                this.flameIntensity = 0.8 + hlGen.random() * 0.2;
                
                // Flame complexity: 6-12 (more flames)
                this.flameComplexity = 6 + hlGen.randomInt(0, 7);
                
                // Flame flicker: 0.4-0.8 (more dynamic)
                this.flameFlicker = 0.4 + hlGen.random() * 0.4;
                
                // Flame turbulence: 0.3-0.6 (more organic movement)
                this.flameTurbulence = 0.3 + hlGen.random() * 0.3;
                
                // Flame layer count: 3-6 (more depth)
                this.flameLayerCount = 3 + hlGen.randomInt(0, 4);
                
                // Flame opacity: 0.9-1.0 (always visible)
                this.flameOpacity = 0.9 + hlGen.random() * 0.1;
                
                // Flame curl: 0.4-0.8 (more dramatic curves)
                this.flameCurl = 0.4 + hlGen.random() * 0.4;
                
                // Flame width: 0.3-0.7 (varied widths)
                this.flameWidth = 0.3 + hlGen.random() * 0.4;
                
                // Flame spread: 0.3-0.6 (controlled spread)
                this.flameSpread = 0.3 + hlGen.random() * 0.3;
                
                // Flame gradient steps: 10-16 (smoother gradients)
                this.flameGradientSteps = 10 + hlGen.randomInt(0, 7);
                break;
                
            case PATTERN_TYPES.RISO_PRINT:
                this.risoComplexity = 6 + hlGen.randomInt(0, 6);
                this.risoSpeed = 0.8 + hlGen.random() * 0.4;
                this.halftoneSize = 8 + hlGen.randomInt(0, 8);
                this.gridIrregularity = 0.2 + hlGen.random() * 0.3;
                this.shapeVariation = 0.5 + hlGen.random() * 0.5;
                this.dotDensity = 0.5 + hlGen.random() * 0.4;
                break;
                
            case PATTERN_TYPES.VECTOR_FIELD:
                // Field strength: 2.5-3
                this.vectorFieldStrength = 2.5 + hlGen.random() * 0.5;
                
                // Tile size: fixed at 300
                this.tileSize = 300;
                
                // Tile shift: fixed at 32
                this.tileShiftAmplitude = 32;
                
                // Spawn radius: 200-280
                this.spawnRadius = 200 + hlGen.random() * 80;
                
                // Flow speed: fixed at 2
                this.flowSpeed = 2;
                
                // Line opacity: 0.75-1
                this.lineOpacity = 0.75 + hlGen.random() * 0.25;
                
                // Line thickness: 8-12
                this.lineThickness = 12 + hlGen.random() * 8;
                
                // Line count: 75-100
                this.numLines = 75 + hlGen.randomInt(0, 26);
                
                // Animate between spiral, grid, circle
                this.vectorFieldType = hlGen.randomElement(['spiral', 'grid', 'circle']);
                
                // Color blending mode: tile, position, velocity, age
                this.colorBlending = hlGen.randomElement(['tile', 'position', 'velocity', 'age']);
                
                // Keep existing noise scale
                this.noiseScale = 0.005 + hlGen.random() * 0.01;
                this.lineLifespan = 300 + hlGen.randomInt(0, 200);
                break;
                
            case PATTERN_TYPES.GENTLE:
                this.lineDensity = 25 + hlGen.randomInt(0, 20);
                this.sourceCount = 6 + hlGen.randomInt(0, 6);
                this.baseLineWidth =  hlGen.randomInt(3,7) * 2.0;
                this.lineWidthVariation = 3.0 + hlGen.random() * 1.0;
                this.visualStyle = hlGen.randomElement(['smooth', 'dotted']);
                break;
                
            case PATTERN_TYPES.CONTOUR_INTERFERENCE:
                this.numRings = 2 + hlGen.randomInt(0, 3);
                this.sourcesPerRing = 4 + hlGen.randomInt(3, 6);
                this.lineWidth = 1 + hlGen.random() * 1.0;
                this.animationSpeed = 0.001 + hlGen.random() * 0.002;
                this.wavelengthVariation = 0.1 + hlGen.random() * 0.3;
                this.amplitudeDecay = 0.1 + hlGen.random() * 0.3;
                this.phaseShift = hlGen.random() * Math.PI * 2;
                this.dampingFactor = 0.1 + hlGen.random() * 0.04;
                this.contourThickness = 0.8 + hlGen.random() * 1.2;
                this.maxDistance = 300 + hlGen.randomInt(0, 200);
                this.nonlinearity = hlGen.random() * 0.5;
                this.contourLevels = 3 + hlGen.randomInt(0, 4);
                this.fillRegions = hlGen.random() > 0.5;
                break;
                
            case PATTERN_TYPES.RADIAL_GROWTH:
                // Max colonies: 100-140 (dense populations)
                this.maxColonies = 100 + hlGen.randomInt(0, 41);
                
                // Lifespan: 0.3-0.8 (shorter for faster turnover)
                this.lifespan = 0.3 + hlGen.random() * 0.5;
                
                // Opacity: fixed at 1 (fully visible)
                this.opacity = 1;
                
                // Clustering/clusterTendency: 0.7-0.9 (high clustering)
                this.clusterTendency = 0.7 + hlGen.random() * 0.2;
                
                // Size variety: 1.5-3.0 (more variation)
                this.sizeVariation = 1.5 + hlGen.random() * 1.5;
                
                // Density variety: 2.0-3.0 (very dense)
                this.densityVariation = 2.0 + hlGen.random() * 1.0;
                
                // Spawn rate: 5-15 frames (very fast spawning)
                this.spawnRate = 5 + hlGen.randomInt(0, 11);
                
                // Growth speed: 1.8-2.5 (fast growth)
                this.growthSpeed = 1.8 + hlGen.random() * 0.7;
                
                // Center bias: 0.6-1.0 (spawn near center)
                this.centerBias = 0.6 + hlGen.random() * 0.4;
                
                // Irregularity: 0.2-0.6 (organic variation)
                this.irregularity = 0.2 + hlGen.random() * 0.4;
                
                // Keep existing parameters for compatibility
                this.radialComplexity = 6 + hlGen.randomInt(0, 6);
                this.radialSpeed = this.growthSpeed;
                break;
                
            // Add default values for other patterns  
            default:
                this.lineDensity = 25 + hlGen.randomInt(0, 20);
                this.sourceCount = 6 + hlGen.randomInt(0, 6);
                break;
        }
    }
    
    /**
     * Generate token traits for Highlight metadata
     */
    generateTokenTraits() {
        const patternNames = {
            [PATTERN_TYPES.INTERFERENCE]: 'Interference',
            [PATTERN_TYPES.GENTLE]: 'Gentle Waves',
            [PATTERN_TYPES.MANDALA]: 'Sacred Mandala',
            [PATTERN_TYPES.VECTOR_FIELD]: 'Vector Flow',
            [PATTERN_TYPES.SHELL_RIDGE]: 'Shell Ridges',
            [PATTERN_TYPES.CONTOUR_INTERFERENCE]: 'Contour Waves',
            [PATTERN_TYPES.VORONOI]: 'Voronoi Cells',
            [PATTERN_TYPES.RISO_PRINT]: 'RISO Print',
            [PATTERN_TYPES.RADIAL_GROWTH]: 'Radial Growth',
            [PATTERN_TYPES.FLAME]: 'Living Flames'
        };
        
        this.tokenTraits = {
            'Pattern': patternNames[this.patternType] || 'Unknown',
            'Theme': this.capitalizeWords(this.currentTheme),
            'Rarity': this.capitalizeWords(this.themeRarity),
            'Animation Speed': this.speed > 0.015 ? 'Fast' : this.speed > 0.01 ? 'Medium' : 'Slow',
            'Complexity': this.calculateComplexityLevel(),
            'Generation': Date.now() // Timestamp for uniqueness
        };
        
        // Set token metadata in Highlight
        hlGen.token.setName(`Onchain Summer Vibes #${hlGen.tx.tokenId}`);
        hlGen.token.setDescription(`A generative art piece featuring ${this.tokenTraits.Pattern} pattern with ${this.tokenTraits.Theme} colors, showcasing the vibrant energy of onchain summer.`);
        hlGen.token.setTraits(this.tokenTraits);
    }
    
    /**
     * Calculate complexity level based on pattern parameters
     */
    calculateComplexityLevel() {
        let complexity = 0;
        
        // Base complexity from pattern type
        const patternComplexity = {
            [PATTERN_TYPES.GENTLE]: 30,
            [PATTERN_TYPES.INTERFERENCE]: 40,
            [PATTERN_TYPES.MANDALA]: 50,
            [PATTERN_TYPES.SHELL_RIDGE]: 45,
            [PATTERN_TYPES.VECTOR_FIELD]: 70,
            [PATTERN_TYPES.RISO_PRINT]: 65,
            [PATTERN_TYPES.FLAME]: 75,
            [PATTERN_TYPES.RADIAL_GROWTH]: 60,
            [PATTERN_TYPES.CONTOUR_INTERFERENCE]: 80
        };
        
        complexity = patternComplexity[this.patternType] || 50;
        
        // Adjust based on parameters
        if (this.mandalaComplexity > 8) complexity += 10;
        if (this.flameLayerCount > 3) complexity += 10;
        if (this.numLines > 400) complexity += 10;
        
        if (complexity < 40) return 'Simple';
        if (complexity < 60) return 'Medium';
        if (complexity < 80) return 'Complex';
        return 'Intricate';
    }
    
    /**
     * Capitalize words for display
     */
    capitalizeWords(str) {
        return str.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
    
    /**
     * Get theme data by name
     */
    getThemeData(themeName) {
        return THEME_PRESETS[themeName] || THEME_PRESETS.dawn;
    }
    
    /**
     * Convert hex color to RGB array
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
     * Initialize the application
     */
    async initialize(canvasSelector = 'canvas') {
        try {
            // Get canvas element
            this.canvas = typeof canvasSelector === 'string' 
                ? document.querySelector(canvasSelector)
                : canvasSelector;
                
            if (!this.canvas) {
                throw new Error(`Canvas element not found: ${canvasSelector}`);
            }
            
            // Get 2D context
            this.ctx = this.canvas.getContext('2d');
            if (!this.ctx) {
                throw new Error('Failed to get 2D rendering context');
            }
            
            // Set canvas size
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            
            // Create SVG paths
            await this.createSVGPaths();
            
            // Validate theme colors
            this.validateCurrentTheme();
            
            this.initialized = true;
            
            // Start animation
            this.animate();
            
            // Capture preview for Highlight after a short delay
            setTimeout(() => {
                hlGen.capturePreview();
            }, 1000);
            
            console.log('Q5AppMint initialized successfully');
            console.log('Pattern:', this.tokenTraits.Pattern);
            console.log('Theme:', this.tokenTraits.Theme);
            console.log('Rarity:', this.tokenTraits.Rarity);
            
        } catch (error) {
            console.error('Failed to initialize Q5AppMint:', error);
            throw error;
        }
    }
    
    /**
     * Create SVG paths for masking
     */
    async createSVGPaths() {
        try {
            // Create logo path (where patterns fill)
            this.logoPath2D = new Path2D(SVG_CONFIG.path);
            
            // Create background path (black border)
            this.backgroundPath2D = new Path2D(SVG_CONFIG.backgroundPath);
            
        } catch (error) {
            console.error('Failed to create SVG paths:', error);
            throw error;
        }
    }
    
    /**
     * Validate current theme colors
     */
    validateCurrentTheme() {
        try {
            // Simple validation without external validator
            const hasValidColors = this.colors && 
                this.colors.primary && 
                this.colors.secondary && 
                this.colors.accent && 
                this.colors.background;
            
            if (!hasValidColors) {
                console.warn('Theme validation failed, but continuing with current colors');
            }
        } catch (error) {
            console.warn('Theme validation error:', error);
        }
    }
    
    /**
     * Main animation loop
     */
    animate() {
        if (!this.initialized) return;
        
        const currentTime = Date.now();
        const elapsed = (currentTime - this.startTime) / 1000;
        
        // Clear and render
        this.draw(elapsed);
        
        this.frameCount++;
        
        // Continue animation
        requestAnimationFrame(() => this.animate());
    }
    
    /**
     * Main draw method
     */
    draw(elapsed) {
        if (!this.ctx || !this.canvas) return;
        
        const { width, height } = this.canvas;
        
        // White background first
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, width, height);
        
        // Draw black border (backgroundPath) - SOLID BLACK, NO PATTERN
        this.drawLogoBackground();
        
        // Render pattern ONLY inside white letterforms (path)
        this.renderWithSVGClip(elapsed);
    }
    
    /**
     * Draw logo background (black border)
     */
    drawLogoBackground() {
        if (!this.backgroundPath2D) return;
        
        const { width, height } = this.canvas;
        const scale = Math.min(width, height) * 0.85 / Math.max(SVG_CONFIG.width, SVG_CONFIG.height);
        
        this.ctx.save();
        this.ctx.translate(width / 2, height / 2);
        this.ctx.scale(scale, scale);
        this.ctx.translate(-SVG_CONFIG.width / 2, -SVG_CONFIG.height / 2);
        
        this.ctx.fillStyle = '#000000';
        this.ctx.fill(this.backgroundPath2D);
        
        this.ctx.restore();
    }
    
    /**
     * Render pattern with SVG clipping
     */
    renderWithSVGClip(elapsed) {
        if (!this.logoPath2D) return;
        
        const { width, height } = this.canvas;
        const scale = Math.min(width, height) * 0.85 / Math.max(SVG_CONFIG.width, SVG_CONFIG.height);
        
        // Render pattern to off-screen canvas
        const patternCanvas = document.createElement('canvas');
        patternCanvas.width = width;
        patternCanvas.height = height;
        const patternCtx = patternCanvas.getContext('2d');
        
        this.renderPattern(patternCtx, elapsed, width, height);
        
        // Apply clipping
        this.ctx.save();
        this.ctx.translate(width / 2, height / 2);
        this.ctx.scale(scale, scale);
        this.ctx.translate(-SVG_CONFIG.width / 2, -SVG_CONFIG.height / 2);
        this.ctx.clip(this.logoPath2D);
        
        // Reset transform but KEEP clip active
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        // Draw pattern through clip
        this.ctx.drawImage(patternCanvas, 0, 0);
        this.ctx.restore();
    }
    
    /**
     * Render the selected pattern
     */
    renderPattern(ctx, time, width, height) {
        // Use colors directly without theme enhancer for mint version
        const finalColors = this.colors;
        const options = this.getPatternOptions();
        
        // Render based on pattern type
        if (this.patterns[this.patternType]) {
            this.patterns[this.patternType].render(ctx, time, width, height, finalColors, options);
        } else {
            // Fallback to interference pattern (using standard interface)
            this.patterns[PATTERN_TYPES.INTERFERENCE].render(ctx, time, width, height, finalColors, options);
        }
    }
    
    /**
     * Get pattern options based on current settings
     */
    getPatternOptions() {
        return {
            // Base options
            wavelength: this.wavelength,
            speed: this.speed,
            threshold: this.threshold,
            lineDensity: this.lineDensity,
            sourceCount: this.sourceCount,
            baseLineWidth: this.baseLineWidth,
            lineWidthVariation: this.lineWidthVariation,
            visualStyle: this.visualStyle,
            
            // Interference options
            gradientMode: this.options?.gradientMode,
            noiseAmount: this.noiseAmount,
            phaseOffset: this.phaseOffset,
            // Gentle Waves options
            gentleLineDensity: this.lineDensity,
            gentleSourceCount: this.sourceCount,    
            gentleBaseLineWidth: this.baseLineWidth,
            gentleLineWidthVariation: this.lineWidthVariation,
            gentleVisualStyle: this.visualStyle,
            // Vector Field options
            vectorFieldStrength: this.vectorFieldStrength,
            noiseScale: this.noiseScale,
            flowSpeed: this.flowSpeed,
            lineLifespan: this.lineLifespan,
            numLines: this.numLines,
            tileSize: this.tileSize,
            tileShiftAmplitude: this.tileShiftAmplitude,
            spawnRadius: this.spawnRadius,
            lineOpacity: this.lineOpacity,
            lineThickness: this.lineThickness,
            vectorFieldType: this.vectorFieldType,
            colorBlending: this.colorBlending,

            // Mandala options
            mandalaComplexity: this.mandalaComplexity,
            mandalaSpeed: this.mandalaSpeed,
            rotationSpeed: this.rotationSpeed,
            spiralArmFactor: this.spiralArmFactor,
            layerGrowthFactor: this.layerGrowthFactor,
            galaxyRotation: this.galaxyRotation,
            
            // Shell Ridge options
            shellRidgeRings: this.shellRidgeRings,
            shellRidgeDistortion: this.shellRidgeDistortion,
            shellRidgeColorMode: this.shellRidgeColorMode,
            
            // Flame options
            flameHeight: this.flameHeight,
            flameSpeed: this.flameSpeed,
            flameIntensity: this.flameIntensity,
            flameComplexity: this.flameComplexity,
            flameFlicker: this.flameFlicker,
            flameTurbulence: this.flameTurbulence,
            flameLayerCount: this.flameLayerCount,
            flameOpacity: this.flameOpacity,
            flameCurl: this.flameCurl,
            flameWidth: this.flameWidth,
            flameSpread: this.flameSpread,
            flameGradientSteps: this.flameGradientSteps,
            
            // RISO Print options
            risoComplexity: this.risoComplexity,
            risoSpeed: this.risoSpeed,
            halftoneSize: this.halftoneSize,
            gridIrregularity: this.gridIrregularity,
            shapeVariation: this.shapeVariation,
            dotDensity: this.dotDensity,
            
            // Vector Field options
            vectorFieldStrength: this.vectorFieldStrength,
            noiseScale: this.noiseScale,
            flowSpeed: this.flowSpeed,
            lineLifespan: this.lineLifespan,
            numLines: this.numLines,
            tileSize: this.tileSize,
            tileShiftAmplitude: this.tileShiftAmplitude,
            spawnRadius: this.spawnRadius,
            lineOpacity: this.lineOpacity,
            lineThickness: this.lineThickness,
            vectorFieldType: this.vectorFieldType,
            colorBlending: this.colorBlending,
            
            // Contour Interference options
            numRings: this.numRings,
            sourcesPerRing: this.sourcesPerRing,
            lineWidth: this.lineWidth,
            animationSpeed: this.animationSpeed,
            wavelengthVariation: this.wavelengthVariation,
            amplitudeDecay: this.amplitudeDecay,
            phaseShift: this.phaseShift,
            dampingFactor: this.dampingFactor,
            contourThickness: this.contourThickness,
            maxDistance: this.maxDistance,
            nonlinearity: this.nonlinearity,
            contourLevels: this.contourLevels,
            fillRegions: this.fillRegions,
            
            // Radial Growth options
            radialComplexity: this.radialComplexity,
            radialSpeed: this.radialSpeed,
            maxColonies: this.maxColonies,
            lifespan: this.lifespan,
            opacity: this.opacity,
            clusterTendency: this.clusterTendency,
            sizeVariation: this.sizeVariation,
            densityVariation: this.densityVariation,
            spawnRate: this.spawnRate,
            growthSpeed: this.growthSpeed,
            centerBias: this.centerBias,
            irregularity: this.irregularity
        };
    }
    
    /**
     * Render interference pattern (fallback)
     */
    renderInterferencePattern(ctx, time, colors) {
        // 4-color interference pattern with wave intensity zones
        const sources = [];
        for (let i = 0; i < this.sourceCount; i++) {
            const angle = (i / this.sourceCount) * Math.PI * 2;
            const radius = Math.min(this.canvas.width, this.canvas.height) * 0.3;
            sources.push({
                x: this.canvas.width / 2 + Math.cos(angle) * radius,
                y: this.canvas.height / 2 + Math.sin(angle) * radius,
                phase: time * this.speed + i * Math.PI / 3
            });
        }
        
        const imageData = ctx.createImageData(this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        for (let y = 0; y < this.canvas.height; y += 2) {
            for (let x = 0; x < this.canvas.width; x += 2) {
                let wave = 0;
                
                sources.forEach(source => {
                    const dx = x - source.x;
                    const dy = y - source.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    wave += Math.sin(distance / this.wavelength + source.phase);
                });
                
                // Normalize wave (-sourceCount to +sourceCount) to (0 to 1)
                const normalizedWave = (wave + this.sourceCount) / (2 * this.sourceCount);
                const index = (y * this.canvas.width + x) * 4;
                
                let finalColor;
                
                // Use all 4 colors based on wave intensity
                if (normalizedWave < 0.25) {
                    // Background color for lowest intensity
                    finalColor = colors.background;
                } else if (normalizedWave < 0.5) {
                    // Blend background to secondary
                    const t = (normalizedWave - 0.25) / 0.25;
                    finalColor = [
                        Math.floor(colors.background[0] * (1 - t) + colors.secondary[0] * t),
                        Math.floor(colors.background[1] * (1 - t) + colors.secondary[1] * t),
                        Math.floor(colors.background[2] * (1 - t) + colors.secondary[2] * t)
                    ];
                } else if (normalizedWave < 0.75) {
                    // Blend secondary to accent
                    const t = (normalizedWave - 0.5) / 0.25;
                    finalColor = [
                        Math.floor(colors.secondary[0] * (1 - t) + colors.accent[0] * t),
                        Math.floor(colors.secondary[1] * (1 - t) + colors.accent[1] * t),
                        Math.floor(colors.secondary[2] * (1 - t) + colors.accent[2] * t)
                    ];
                } else {
                    // Blend accent to primary for highest intensity
                    const t = (normalizedWave - 0.75) / 0.25;
                    finalColor = [
                        Math.floor(colors.accent[0] * (1 - t) + colors.primary[0] * t),
                        Math.floor(colors.accent[1] * (1 - t) + colors.primary[1] * t),
                        Math.floor(colors.accent[2] * (1 - t) + colors.primary[2] * t)
                    ];
                }
                
                data[index] = finalColor[0];
                data[index + 1] = finalColor[1];
                data[index + 2] = finalColor[2];
                data[index + 3] = 255;
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
    }
}

export default Q5AppMint;