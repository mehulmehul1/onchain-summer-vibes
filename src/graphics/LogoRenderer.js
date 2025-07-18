/**
 * LogoRenderer.js - Canvas 2D Logo Rendering
 * 
 * Implements Canvas 2D compatible logo rendering for Onchain Summer logo
 * Converted from q5.js to Canvas 2D API for compatibility with Q5App-full.js
 */

import { SVG_CONFIG } from '../constants/patternConfig.js';

export class LogoRenderer {
    constructor() {
        this.logoPath2D = null;
        this.bounds = { x: 0, y: 0, width: 0, height: 0 };
        this.scaleFactor = 1;
        this.isInitialized = false;
        
        // Default Onchain Summer logo configuration
        this.defaultConfig = {
            scale: 0.7, // 70% of viewport
            aspectRatio: SVG_CONFIG.width / SVG_CONFIG.height,
            minScale: 0.3,
            maxScale: 1.0,
            padding: 20
        };
    }

    /**
     * Initialize logo renderer - auto-initializes for Canvas 2D
     * @param {Object} config - Configuration options
     */
    initialize(config = {}) {
        try {
            this.config = { ...this.defaultConfig, ...config };
            
            // Create Path2D from SVG path data
            this.createLogoPath();
            
            this.isInitialized = true;
            console.log('LogoRenderer initialized successfully for Canvas 2D');
            return true;
        } catch (error) {
            console.error('Failed to initialize logo renderer:', error);
            return false;
        }
    }

    /**
     * Create Canvas 2D Path2D from SVG path data
     */
    createLogoPath() {
        try {
            // Create Path2D object from SVG path string
            this.logoPath2D = new Path2D(SVG_CONFIG.path);
            console.log('Logo Path2D created successfully');
        } catch (error) {
            console.warn('Failed to create Path2D, creating fallback rectangle:', error);
            // Fallback to simple rectangle
            this.logoPath2D = new Path2D();
            const halfWidth = SVG_CONFIG.width / 2;
            const halfHeight = SVG_CONFIG.height / 2;
            
            this.logoPath2D.rect(-halfWidth, -halfHeight, SVG_CONFIG.width, SVG_CONFIG.height);
        }
    }

    /**
     * Update logo bounds based on canvas dimensions
     * @param {number} canvasWidth - Canvas width
     * @param {number} canvasHeight - Canvas height
     */
    updateBounds(canvasWidth, canvasHeight) {
        if (!this.isInitialized) return;

        // Use provided canvas dimensions or fallback to window
        const viewportWidth = canvasWidth || window.innerWidth;
        const viewportHeight = canvasHeight || window.innerHeight;
        
        // Determine scale based on viewport size
        const maxWidth = viewportWidth - this.config.padding * 2;
        const maxHeight = viewportHeight - this.config.padding * 2;
        
        // Calculate scale to fit within viewport using actual SVG dimensions
        const scaleForWidth = maxWidth / (SVG_CONFIG.width * this.config.scale);
        const scaleForHeight = maxHeight / (SVG_CONFIG.height * this.config.scale);
        
        this.scaleFactor = Math.min(
            scaleForWidth,
            scaleForHeight,
            this.config.maxScale
        );
        
        this.scaleFactor = Math.max(this.scaleFactor, this.config.minScale);
        
        // Calculate final dimensions using actual SVG dimensions
        const logoWidth = SVG_CONFIG.width * this.scaleFactor;
        const logoHeight = SVG_CONFIG.height * this.scaleFactor;
        
        // Center the logo
        this.bounds = {
            x: (viewportWidth - logoWidth) / 2,
            y: (viewportHeight - logoHeight) / 2,
            width: logoWidth,
            height: logoHeight
        };
    }

    /**
     * Render the logo using Canvas 2D context
     * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {Object} options - Rendering options
     */
    render(ctx, width, height, options = {}) {
        if (!this.isInitialized) {
            console.warn('Logo renderer not initialized');
            return;
        }

        if (!ctx) {
            console.error('Canvas context required for LogoRenderer.render()');
            return;
        }

        const {
            fill = true,
            stroke = false,
            fillColor = '#ffffff',
            strokeColor = '#000000',
            strokeWidth = 2
        } = options;

        // Update bounds based on canvas size
        this.updateBounds(width, height);

        ctx.save();
        
        try {
            // Transform to logo position and center
            ctx.translate(
                this.bounds.x + this.bounds.width / 2, 
                this.bounds.y + this.bounds.height / 2
            );
            ctx.scale(this.scaleFactor, this.scaleFactor);
            
            // Set fill style
            if (fill) {
                ctx.fillStyle = fillColor;
            }
            
            // Set stroke style
            if (stroke) {
                ctx.strokeStyle = strokeColor;
                ctx.lineWidth = strokeWidth;
            }
            
            // Draw the logo using Path2D
            if (fill) {
                ctx.fill(this.logoPath2D);
            }
            if (stroke) {
                ctx.stroke(this.logoPath2D);
            }
            
        } catch (error) {
            console.error('Error rendering logo:', error);
        } finally {
            ctx.restore();
        }
    }

    /**
     * Create a clipping mask from the logo for Canvas 2D
     * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     */
    createClippingMask(ctx, width, height) {
        if (!this.isInitialized) {
            console.warn('Logo renderer not initialized, no clipping applied');
            return false;
        }

        if (!ctx) {
            console.error('Canvas context required for createClippingMask()');
            return false;
        }

        try {
            // Update bounds
            this.updateBounds(width, height);
            
            ctx.save();
            
            // Transform to logo position and center
            ctx.translate(
                this.bounds.x + this.bounds.width / 2, 
                this.bounds.y + this.bounds.height / 2
            );
            ctx.scale(this.scaleFactor, this.scaleFactor);
            
            // Create clipping region using the logo path
            ctx.clip(this.logoPath2D);
            
            return true;
            
        } catch (error) {
            console.error('Error creating logo clipping mask:', error);
            ctx.restore();
            return false;
        }
    }

    /**
     * Restore context after clipping (call ctx.restore())
     * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
     */
    restoreClipping(ctx) {
        ctx.restore();
    }

    /**
     * Check if point is inside logo bounds
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {boolean} - True if point is inside logo
     */
    isPointInLogo(x, y) {
        if (!this.isInitialized) return false;

        return (
            x >= this.bounds.x &&
            x <= this.bounds.x + this.bounds.width &&
            y >= this.bounds.y &&
            y <= this.bounds.y + this.bounds.height
        );
    }

    /**
     * Get current logo bounds
     * @returns {Object} - Bounds object with x, y, width, height
     */
    getBounds() {
        return { ...this.bounds };
    }

    /**
     * Get current scale factor
     * @returns {number} - Current scale factor
     */
    getScaleFactor() {
        return this.scaleFactor;
    }

    /**
     * Handle canvas resize
     * @param {number} width - New canvas width
     * @param {number} height - New canvas height
     */
    handleResize(width, height) {
        this.updateBounds(width, height);
    }

    /**
     * Reset logo renderer
     */
    reset() {
        this.logoPath2D = null;
        this.bounds = { x: 0, y: 0, width: 0, height: 0 };
        this.scaleFactor = 1;
        this.isInitialized = false;
    }

    /**
     * Update logo configuration
     * @param {Object} newConfig - New configuration options
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
}