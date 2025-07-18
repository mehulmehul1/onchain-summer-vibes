/**
 * SVGMask.js - SVG Masking Implementation for q5.js
 * 
 * Converts Path2D clipping to q5.js beginClip/endClip system
 */

export class SVGMask {
    constructor() {
        this.maskPath = null;
        this.isInitialized = false;
        this.bounds = { x: 0, y: 0, width: 0, height: 0 };
    }

    /**
     * Initialize mask from SVG path data
     * @param {string} svgPath - SVG path data string
     * @param {Object} options - Configuration options
     */
    initialize(svgPath, options = {}) {
        try {
            this.maskPath = svgPath;
            this.isInitialized = true;
            
            // Calculate bounds for optimization
            this.calculateBounds(options);
            
            console.log('SVG mask initialized successfully');
            return true;
        } catch (error) {
            console.error('Failed to initialize SVG mask:', error);
            return false;
        }
    }

    /**
     * Calculate bounding box for the mask
     * @param {Object} options - Configuration options
     */
    calculateBounds(options) {
        // Default bounds for Onchain Summer logo
        this.bounds = {
            x: options.x || 0,
            y: options.y || 0,
            width: options.width || width,
            height: options.height || height
        };
    }

    /**
     * Apply mask using q5.js clipping
     * @param {Function} drawCallback - Function to draw masked content
     */
    applyMask(drawCallback) {
        if (!this.isInitialized || !this.maskPath) {
            console.warn('SVG mask not initialized, drawing without mask');
            drawCallback();
            return;
        }

        try {
            // Begin clipping path
            push();
            
            // Draw the clipping path
            this.drawClipPath();
            clip();
            
            // Execute the drawing callback
            drawCallback();
            
            // End clipping
            pop();
            
        } catch (error) {
            console.error('Error applying SVG mask:', error);
            // Fallback: draw without mask
            drawCallback();
        }
    }

    /**
     * Draw the clipping path using q5.js path commands
     */
    drawClipPath() {
        if (!this.maskPath) return;

        // For now, use a simplified approach with the Onchain Summer logo shape
        // This can be expanded to parse full SVG path data
        this.drawOnchainSummerLogo();
    }

    /**
     * Draw the Onchain Summer logo as clipping path
     */
    drawOnchainSummerLogo() {
        // Simplified version of the Onchain Summer logo
        // Center on canvas
        const centerX = width / 2;
        const centerY = height / 2;
        const scale = Math.min(width, height) * 0.7 / 400; // Scale to 70% of viewport

        beginShape();
        
        // Outer border approximation
        vertex(centerX - 180 * scale, centerY - 80 * scale);
        vertex(centerX + 180 * scale, centerY - 80 * scale);
        vertex(centerX + 180 * scale, centerY + 80 * scale);
        vertex(centerX - 180 * scale, centerY + 80 * scale);
        
        // Inner cutouts for letters (simplified)
        beginContour();
        vertex(centerX - 160 * scale, centerY - 60 * scale);
        vertex(centerX - 160 * scale, centerY + 60 * scale);
        vertex(centerX + 160 * scale, centerY + 60 * scale);
        vertex(centerX + 160 * scale, centerY - 60 * scale);
        endContour();
        
        endShape(CLOSE);
    }

    /**
     * Check if point is inside mask
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {boolean} - True if point is inside mask
     */
    isPointInMask(x, y) {
        if (!this.isInitialized) return true;

        // Simple bounds check for now
        return (
            x >= this.bounds.x &&
            x <= this.bounds.x + this.bounds.width &&
            y >= this.bounds.y &&
            y <= this.bounds.y + this.bounds.height
        );
    }

    /**
     * Get mask bounds
     * @returns {Object} - Bounds object with x, y, width, height
     */
    getBounds() {
        return { ...this.bounds };
    }

    /**
     * Update mask position and scale
     * @param {Object} transform - Transform parameters
     */
    updateTransform(transform) {
        if (transform.x !== undefined) this.bounds.x = transform.x;
        if (transform.y !== undefined) this.bounds.y = transform.y;
        if (transform.width !== undefined) this.bounds.width = transform.width;
        if (transform.height !== undefined) this.bounds.height = transform.height;
    }

    /**
     * Reset mask to default state
     */
    reset() {
        this.maskPath = null;
        this.isInitialized = false;
        this.bounds = { x: 0, y: 0, width: 0, height: 0 };
    }
}

// Export default instance
export default new SVGMask();