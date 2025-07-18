/**
 * Q5App-full.js - Full Canvas 2D Application with SVG Masking and Interference Pattern
 * 
 * Implements SVG masking and interference pattern rendering using Canvas 2D
 * (avoiding q5.js dependency issues)
 */

import { SVGMask } from '../graphics/SVGMask.js';
import { LogoRenderer } from '../graphics/LogoRenderer.js';
import { InterferencePattern } from '../patterns/InterferencePattern.js';
import { ThemeManager } from '../themes/ThemeManager.js';

export class Q5App {
    constructor(config = {}) {
        this.config = {
            canvas: {
                targetFPS: 60,
                ...config.canvas
            },
            webgpu: {
                enabled: true,
                fallbackTo2D: true,
                ...config.webgpu
            },
            debug: true,
            ...config
        };
        
        this.initialized = false;
        this.canvas = null;
        this.ctx = null;
        this.frameCount = 0;
        this.startTime = Date.now();
        
        // Pattern and rendering components
        this.svgMask = null;
        this.logoRenderer = null;
        this.interferencePattern = null;
        this.themeManager = null;
        
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
            
            // Initialize components
            this.svgMask = new SVGMask();
            this.logoRenderer = new LogoRenderer();
            this.logoRenderer.initialize(); // Initialize the Canvas 2D logo renderer
            this.interferencePattern = new InterferencePattern();
            this.themeManager = new ThemeManager();
            
            // Set up initial theme
            this.themeManager.setTheme('ocean');
            
            // Apply initial theme to pattern
            this.applyThemeToPattern();
            
            this.initialized = true;
            console.log('Q5App initialized successfully');
            
            // Make canvas visible
            this.canvas.style.display = 'block';
            
            // Start animation loop
            this.startAnimation();
            
        } catch (error) {
            console.error('Q5App initialization failed:', error);
            throw error;
        }
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
    
    applyThemeToPattern() {
        if (!this.themeManager || !this.interferencePattern) return;
        
        const colors = this.themeManager.getColors();
        if (colors) {
            // Apply theme colors to interference pattern
            this.interferencePattern.setColors({
                color1: colors.primary || [0, 255, 255],
                color2: colors.secondary || [255, 0, 255],
                color3: colors.accent || [255, 255, 0],
                color4: colors.background || [0, 0, 0]
            });
        }
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
        
        // Update theme manager (for animated transitions)
        this.themeManager.update(currentTime);
        
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Create off-screen canvas for pattern
        const patternCanvas = document.createElement('canvas');
        patternCanvas.width = this.canvas.width;
        patternCanvas.height = this.canvas.height;
        const patternCtx = patternCanvas.getContext('2d');
        
        // Render interference pattern to off-screen canvas
        this.renderInterferencePattern(patternCtx, elapsed);
        
        // Apply SVG mask
        this.applySVGMask(patternCanvas);
        
        // Draw the masked pattern to main canvas
        this.ctx.drawImage(patternCanvas, 0, 0);
        
        // Draw frame info
        this.drawFrameInfo(elapsed);
    }
    
    renderInterferencePattern(ctx, time) {
        if (!this.interferencePattern) return;
        
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        
        // Create image data for pixel manipulation
        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;
        
        // Get current theme colors
        const colors = this.themeManager.getColors();
        const color1 = colors.primary || [0, 255, 255];
        const color2 = colors.secondary || [255, 0, 255];
        
        // Interference pattern parameters
        const sources = [
            { x: width * 0.3, y: height * 0.5 },
            { x: width * 0.7, y: height * 0.5 }
        ];
        const wavelength = 50;
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
                    const wave = Math.sin(distance * frequency + time * 2) * amplitude;
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
    
    applySVGMask(canvas) {
        if (!this.svgMask) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Create a temporary canvas for the mask
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = width;
        maskCanvas.height = height;
        const maskCtx = maskCanvas.getContext('2d');
        
        // Draw SVG logo as mask
        this.logoRenderer.render(maskCtx, width, height);
        
        // Apply mask using composite operation
        ctx.globalCompositeOperation = 'destination-in';
        ctx.drawImage(maskCanvas, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
    }
    
    drawFrameInfo(elapsed) {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(
            `Frame: ${this.frameCount} | Time: ${elapsed.toFixed(1)}s | Theme: ${this.themeManager.getCurrentThemeName()}`,
            10,
            25
        );
    }
    
    windowResized() {
        if (this.canvas) {
            this.resizeCanvas();
        }
    }
    
    // Public methods for interaction
    setTheme(themeName) {
        if (this.themeManager) {
            this.themeManager.setTheme(themeName, true); // Animated transition
            this.applyThemeToPattern();
        }
    }
    
    getAvailableThemes() {
        return this.themeManager ? this.themeManager.getAvailableThemes() : [];
    }
    
    randomizeTheme() {
        if (this.themeManager) {
            const themes = this.themeManager.getAvailableThemes();
            const currentTheme = this.themeManager.getCurrentThemeName();
            const randomTheme = this.themeManager.getRandomTheme([currentTheme]);
            this.setTheme(randomTheme);
        }
    }
}