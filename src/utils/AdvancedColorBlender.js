/**
 * AdvancedColorBlender.js - Advanced Color Blending System
 * 
 * Implements multiple gradient types, blend modes, and GPU-optimized color calculations
 * with caching for performance optimization.
 */

export class AdvancedColorBlender {
    constructor() {
        this.gradientCache = new Map();
        this.blendCache = new Map();
    }
    
    /**
     * Create gradient with caching support
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Array} colors - Array of color strings
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {string} type - Gradient type ('linear', 'radial', 'conic')
     * @param {Object} options - Additional options
     * @returns {CanvasGradient} Canvas gradient object
     */
    createGradient(ctx, colors, width, height, type = 'linear', options = {}) {
        const cacheKey = `${type}-${width}-${height}-${colors.join('-')}-${JSON.stringify(options)}`;
        
        if (this.gradientCache.has(cacheKey)) {
            return this.gradientCache.get(cacheKey);
        }
        
        let gradient;
        
        switch(type) {
            case 'radial':
                const centerX = options.centerX || width / 2;
                const centerY = options.centerY || height / 2;
                const radius = options.radius || Math.max(width, height) / 2;
                gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
                break;
                
            case 'conic':
                if ('createConicGradient' in ctx) {
                    const angle = options.angle || 0;
                    const centerX = options.centerX || width / 2;
                    const centerY = options.centerY || height / 2;
                    gradient = ctx.createConicGradient(angle, centerX, centerY);
                } else {
                    // Fallback to radial for unsupported browsers
                    console.warn('Conic gradients not supported, falling back to radial');
                    gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
                }
                break;
                
            default: // linear
                const x0 = options.x0 || 0;
                const y0 = options.y0 || 0;
                const x1 = options.x1 || width;
                const y1 = options.y1 || height;
                gradient = ctx.createLinearGradient(x0, y0, x1, y1);
        }
        
        // Calculate color stops with advanced distribution
        const stops = this.calculateColorStops(colors, type, options);
        stops.forEach(stop => {
            gradient.addColorStop(stop.position, stop.color);
        });
        
        this.gradientCache.set(cacheKey, gradient);
        return gradient;
    }
    
    /**
     * Calculate color stops with different distribution algorithms
     * @param {Array} colors - Array of colors
     * @param {string} type - Gradient type
     * @param {Object} options - Additional options
     * @returns {Array} Array of color stop objects
     */
    calculateColorStops(colors, type, options) {
        const stops = [];
        const distribution = options.distribution || 'linear';
        
        colors.forEach((color, index) => {
            let position;
            
            switch(distribution) {
                case 'exponential':
                    position = Math.pow(index / (colors.length - 1), 2);
                    break;
                case 'logarithmic':
                    position = index === 0 ? 0 : Math.log(index + 1) / Math.log(colors.length);
                    break;
                case 'cubic':
                    const t = index / (colors.length - 1);
                    position = t * t * (3 - 2 * t); // Smooth step
                    break;
                case 'sine':
                    const sineT = index / (colors.length - 1);
                    position = Math.sin(sineT * Math.PI / 2);
                    break;
                default: // linear
                    position = index / (colors.length - 1);
            }
            
            stops.push({
                position: Math.max(0, Math.min(1, position)),
                color: this.formatColor(color)
            });
        });
        
        return stops;
    }
    
    /**
     * Blend two colors with specified mode and factor
     * @param {string} color1 - First color (hex)
     * @param {string} color2 - Second color (hex)
     * @param {number} factor - Blend factor (0-1)
     * @param {string} mode - Blend mode
     * @returns {string} Blended color (hex)
     */
    blendColors(color1, color2, factor, mode = 'normal') {
        const cacheKey = `${color1}-${color2}-${factor}-${mode}`;
        
        if (this.blendCache.has(cacheKey)) {
            return this.blendCache.get(cacheKey);
        }
        
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);
        
        let result;
        
        switch(mode) {
            case 'multiply':
                result = this.multiplyBlend(rgb1, rgb2, factor);
                break;
            case 'screen':
                result = this.screenBlend(rgb1, rgb2, factor);
                break;
            case 'overlay':
                result = this.overlayBlend(rgb1, rgb2, factor);
                break;
            case 'soft-light':
                result = this.softLightBlend(rgb1, rgb2, factor);
                break;
            case 'hard-light':
                result = this.hardLightBlend(rgb1, rgb2, factor);
                break;
            case 'color-dodge':
                result = this.colorDodgeBlend(rgb1, rgb2, factor);
                break;
            case 'color-burn':
                result = this.colorBurnBlend(rgb1, rgb2, factor);
                break;
            case 'difference':
                result = this.differenceBlend(rgb1, rgb2, factor);
                break;
            case 'exclusion':
                result = this.exclusionBlend(rgb1, rgb2, factor);
                break;
            default: // normal
                result = this.normalBlend(rgb1, rgb2, factor);
        }
        
        const hexResult = this.rgbToHex(result);
        this.blendCache.set(cacheKey, hexResult);
        return hexResult;
    }
    
    // =================
    // BLEND MODE IMPLEMENTATIONS
    // =================
    
    /**
     * Normal blend mode (linear interpolation)
     */
    normalBlend(rgb1, rgb2, factor) {
        return rgb1.map((c1, i) => 
            Math.round(c1 * (1 - factor) + rgb2[i] * factor)
        );
    }
    
    /**
     * Multiply blend mode
     */
    multiplyBlend(rgb1, rgb2, factor) {
        return rgb1.map((c1, i) => 
            Math.round(c1 * (1 - factor) + (c1 * rgb2[i] / 255) * factor)
        );
    }
    
    /**
     * Screen blend mode
     */
    screenBlend(rgb1, rgb2, factor) {
        return rgb1.map((c1, i) => 
            Math.round(c1 * (1 - factor) + (255 - ((255 - c1) * (255 - rgb2[i]) / 255)) * factor)
        );
    }
    
    /**
     * Overlay blend mode
     */
    overlayBlend(rgb1, rgb2, factor) {
        return rgb1.map((c1, i) => {
            const c2 = rgb2[i];
            const overlay = c1 < 128 
                ? 2 * c1 * c2 / 255
                : 255 - 2 * (255 - c1) * (255 - c2) / 255;
            return Math.round(c1 * (1 - factor) + overlay * factor);
        });
    }
    
    /**
     * Soft light blend mode
     */
    softLightBlend(rgb1, rgb2, factor) {
        return rgb1.map((c1, i) => {
            const c2 = rgb2[i];
            const softLight = c2 < 128
                ? c1 - (255 - 2 * c2) * c1 * (255 - c1) / (255 * 255)
                : c1 + (2 * c2 - 255) * (Math.sqrt(c1 / 255) * 255 - c1) / 255;
            return Math.round(c1 * (1 - factor) + Math.max(0, Math.min(255, softLight)) * factor);
        });
    }
    
    /**
     * Hard light blend mode
     */
    hardLightBlend(rgb1, rgb2, factor) {
        return rgb1.map((c1, i) => {
            const c2 = rgb2[i];
            const hardLight = c2 < 128
                ? 2 * c1 * c2 / 255
                : 255 - 2 * (255 - c1) * (255 - c2) / 255;
            return Math.round(c1 * (1 - factor) + hardLight * factor);
        });
    }
    
    /**
     * Color dodge blend mode
     */
    colorDodgeBlend(rgb1, rgb2, factor) {
        return rgb1.map((c1, i) => {
            const c2 = rgb2[i];
            const dodge = c2 === 255 ? 255 : Math.min(255, c1 * 255 / (255 - c2));
            return Math.round(c1 * (1 - factor) + dodge * factor);
        });
    }
    
    /**
     * Color burn blend mode
     */
    colorBurnBlend(rgb1, rgb2, factor) {
        return rgb1.map((c1, i) => {
            const c2 = rgb2[i];
            const burn = c2 === 0 ? 0 : Math.max(0, 255 - (255 - c1) * 255 / c2);
            return Math.round(c1 * (1 - factor) + burn * factor);
        });
    }
    
    /**
     * Difference blend mode
     */
    differenceBlend(rgb1, rgb2, factor) {
        return rgb1.map((c1, i) => {
            const difference = Math.abs(c1 - rgb2[i]);
            return Math.round(c1 * (1 - factor) + difference * factor);
        });
    }
    
    /**
     * Exclusion blend mode
     */
    exclusionBlend(rgb1, rgb2, factor) {
        return rgb1.map((c1, i) => {
            const c2 = rgb2[i];
            const exclusion = c1 + c2 - 2 * c1 * c2 / 255;
            return Math.round(c1 * (1 - factor) + exclusion * factor);
        });
    }
    
    // =================
    // UTILITY METHODS
    // =================
    
    /**
     * Format color for canvas gradient
     */
    formatColor(color) {
        if (Array.isArray(color)) {
            return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        }
        return color;
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
     * Convert RGB array to hex color
     */
    rgbToHex(rgb) {
        return "#" + rgb.map(c => 
            Math.max(0, Math.min(255, Math.round(c)))
                .toString(16).padStart(2, '0')
        ).join('');
    }
    
    /**
     * Create color palette with advanced blending
     * @param {Array} baseColors - Base color palette
     * @param {Object} options - Blending options
     * @returns {Array} Enhanced color palette
     */
    createBlendedPalette(baseColors, options = {}) {
        const {
            blendMode = 'normal',
            intensity = 0.5,
            harmonyType = 'analogous',
            steps = 4
        } = options;
        
        const palette = [];
        
        // Generate intermediate colors
        for (let i = 0; i < baseColors.length - 1; i++) {
            palette.push(baseColors[i]);
            
            // Create intermediate steps
            for (let step = 1; step < steps; step++) {
                const factor = step / steps;
                const blended = this.blendColors(
                    baseColors[i], 
                    baseColors[i + 1], 
                    factor, 
                    blendMode
                );
                palette.push(blended);
            }
        }
        
        // Add final color
        palette.push(baseColors[baseColors.length - 1]);
        
        return palette;
    }
    
    /**
     * Apply color temperature adjustment
     * @param {string} color - Hex color
     * @param {number} temperature - Temperature (-1 to 1, negative = cooler, positive = warmer)
     * @returns {string} Adjusted hex color
     */
    adjustTemperature(color, temperature) {
        const rgb = this.hexToRgb(color);
        const factor = Math.abs(temperature);
        
        if (temperature > 0) {
            // Warmer - increase red/yellow
            rgb[0] = Math.min(255, rgb[0] + factor * 30);
            rgb[1] = Math.min(255, rgb[1] + factor * 15);
            rgb[2] = Math.max(0, rgb[2] - factor * 10);
        } else {
            // Cooler - increase blue
            rgb[0] = Math.max(0, rgb[0] - factor * 15);
            rgb[1] = Math.max(0, rgb[1] - factor * 5);
            rgb[2] = Math.min(255, rgb[2] + factor * 25);
        }
        
        return this.rgbToHex(rgb);
    }
    
    /**
     * Apply saturation adjustment
     * @param {string} color - Hex color
     * @param {number} saturation - Saturation adjustment (-1 to 1)
     * @returns {string} Adjusted hex color
     */
    adjustSaturation(color, saturation) {
        const rgb = this.hexToRgb(color);
        const hsl = this.rgbToHsl(rgb);
        
        hsl.s = Math.max(0, Math.min(1, hsl.s + saturation));
        
        const adjustedRgb = this.hslToRgb(hsl);
        return this.rgbToHex(adjustedRgb);
    }
    
    /**
     * Apply brightness adjustment
     * @param {string} color - Hex color
     * @param {number} brightness - Brightness adjustment (-1 to 1)
     * @returns {string} Adjusted hex color
     */
    adjustBrightness(color, brightness) {
        const rgb = this.hexToRgb(color);
        const hsl = this.rgbToHsl(rgb);
        
        hsl.l = Math.max(0, Math.min(1, hsl.l + brightness));
        
        const adjustedRgb = this.hslToRgb(hsl);
        return this.rgbToHex(adjustedRgb);
    }
    
    /**
     * Convert RGB to HSL
     */
    rgbToHsl([r, g, b]) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: h * 360, s, l };
    }
    
    /**
     * Convert HSL to RGB
     */
    hslToRgb({ h, s, l }) {
        const hNorm = h / 360;
        
        if (s === 0) {
            const gray = Math.round(l * 255);
            return [gray, gray, gray];
        }
        
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        return [
            Math.round(hue2rgb(p, q, hNorm + 1/3) * 255),
            Math.round(hue2rgb(p, q, hNorm) * 255),
            Math.round(hue2rgb(p, q, hNorm - 1/3) * 255)
        ];
    }
    
    /**
     * Clear all caches to free memory
     */
    clearCache() {
        this.gradientCache.clear();
        this.blendCache.clear();
    }
    
    /**
     * Get cache statistics
     */
    getCacheStats() {
        return {
            gradientCacheSize: this.gradientCache.size,
            blendCacheSize: this.blendCache.size,
            totalCacheSize: this.gradientCache.size + this.blendCache.size
        };
    }
}