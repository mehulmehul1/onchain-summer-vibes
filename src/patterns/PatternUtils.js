/**
 * PatternUtils.js - Color Blending and Utility Functions for q5.js
 * 
 * Converts color blending and utility functions to q5.js
 */

export class PatternUtils {
    constructor() {
        this.colorCache = new Map();
        this.blendModeCache = new Map();
    }

    /**
     * Color space conversion utilities
     */
    
    /**
     * Convert HSV to RGB
     * @param {number} h - Hue (0-360)
     * @param {number} s - Saturation (0-1)
     * @param {number} v - Value (0-1)
     * @returns {Array} - RGB array [r, g, b]
     */
    hsvToRgb(h, s, v) {
        const cacheKey = `hsv_${h}_${s}_${v}`;
        if (this.colorCache.has(cacheKey)) {
            return this.colorCache.get(cacheKey);
        }
        
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
        
        const result = [
            Math.floor((r + m) * 255),
            Math.floor((g + m) * 255),
            Math.floor((b + m) * 255)
        ];
        
        this.colorCache.set(cacheKey, result);
        return result;
    }

    /**
     * Convert RGB to HSV
     * @param {number} r - Red (0-255)
     * @param {number} g - Green (0-255)
     * @param {number} b - Blue (0-255)
     * @returns {Array} - HSV array [h, s, v]
     */
    rgbToHsv(r, g, b) {
        const cacheKey = `rgb_${r}_${g}_${b}`;
        if (this.colorCache.has(cacheKey)) {
            return this.colorCache.get(cacheKey);
        }
        
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;
        
        let h, s, v = max;
        
        if (delta === 0) {
            h = 0;
        } else if (max === r) {
            h = ((g - b) / delta) % 6;
        } else if (max === g) {
            h = (b - r) / delta + 2;
        } else {
            h = (r - g) / delta + 4;
        }
        
        h = Math.round(h * 60);
        if (h < 0) h += 360;
        
        s = max === 0 ? 0 : delta / max;
        
        const result = [h, s, v];
        this.colorCache.set(cacheKey, result);
        return result;
    }

    /**
     * Convert HSL to RGB
     * @param {number} h - Hue (0-360)
     * @param {number} s - Saturation (0-1)
     * @param {number} l - Lightness (0-1)
     * @returns {Array} - RGB array [r, g, b]
     */
    hslToRgb(h, s, l) {
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;
        
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
     * Blend mode implementations
     */
    
    /**
     * Normal blend mode
     * @param {Array} base - Base color [r, g, b, a]
     * @param {Array} overlay - Overlay color [r, g, b, a]
     * @param {number} opacity - Opacity (0-1)
     * @returns {Array} - Blended color [r, g, b, a]
     */
    blendNormal(base, overlay, opacity = 1) {
        const alpha = (overlay[3] / 255) * opacity;
        const invAlpha = 1 - alpha;
        
        return [
            Math.floor(base[0] * invAlpha + overlay[0] * alpha),
            Math.floor(base[1] * invAlpha + overlay[1] * alpha),
            Math.floor(base[2] * invAlpha + overlay[2] * alpha),
            Math.min(255, base[3] + overlay[3] * opacity)
        ];
    }

    /**
     * Multiply blend mode
     * @param {Array} base - Base color [r, g, b, a]
     * @param {Array} overlay - Overlay color [r, g, b, a]
     * @param {number} opacity - Opacity (0-1)
     * @returns {Array} - Blended color [r, g, b, a]
     */
    blendMultiply(base, overlay, opacity = 1) {
        const result = [
            Math.floor((base[0] * overlay[0]) / 255),
            Math.floor((base[1] * overlay[1]) / 255),
            Math.floor((base[2] * overlay[2]) / 255),
            base[3]
        ];
        
        return this.blendNormal(base, result, opacity);
    }

    /**
     * Screen blend mode
     * @param {Array} base - Base color [r, g, b, a]
     * @param {Array} overlay - Overlay color [r, g, b, a]
     * @param {number} opacity - Opacity (0-1)
     * @returns {Array} - Blended color [r, g, b, a]
     */
    blendScreen(base, overlay, opacity = 1) {
        const result = [
            255 - Math.floor(((255 - base[0]) * (255 - overlay[0])) / 255),
            255 - Math.floor(((255 - base[1]) * (255 - overlay[1])) / 255),
            255 - Math.floor(((255 - base[2]) * (255 - overlay[2])) / 255),
            base[3]
        ];
        
        return this.blendNormal(base, result, opacity);
    }

    /**
     * Overlay blend mode
     * @param {Array} base - Base color [r, g, b, a]
     * @param {Array} overlay - Overlay color [r, g, b, a]
     * @param {number} opacity - Opacity (0-1)
     * @returns {Array} - Blended color [r, g, b, a]
     */
    blendOverlay(base, overlay, opacity = 1) {
        const result = [
            base[0] < 128 ? 
                Math.floor((2 * base[0] * overlay[0]) / 255) :
                255 - Math.floor((2 * (255 - base[0]) * (255 - overlay[0])) / 255),
            base[1] < 128 ? 
                Math.floor((2 * base[1] * overlay[1]) / 255) :
                255 - Math.floor((2 * (255 - base[1]) * (255 - overlay[1])) / 255),
            base[2] < 128 ? 
                Math.floor((2 * base[2] * overlay[2]) / 255) :
                255 - Math.floor((2 * (255 - base[2]) * (255 - overlay[2])) / 255),
            base[3]
        ];
        
        return this.blendNormal(base, result, opacity);
    }

    /**
     * Add blend mode
     * @param {Array} base - Base color [r, g, b, a]
     * @param {Array} overlay - Overlay color [r, g, b, a]
     * @param {number} opacity - Opacity (0-1)
     * @returns {Array} - Blended color [r, g, b, a]
     */
    blendAdd(base, overlay, opacity = 1) {
        const result = [
            Math.min(255, base[0] + overlay[0]),
            Math.min(255, base[1] + overlay[1]),
            Math.min(255, base[2] + overlay[2]),
            base[3]
        ];
        
        return this.blendNormal(base, result, opacity);
    }

    /**
     * Subtract blend mode
     * @param {Array} base - Base color [r, g, b, a]
     * @param {Array} overlay - Overlay color [r, g, b, a]
     * @param {number} opacity - Opacity (0-1)
     * @returns {Array} - Blended color [r, g, b, a]
     */
    blendSubtract(base, overlay, opacity = 1) {
        const result = [
            Math.max(0, base[0] - overlay[0]),
            Math.max(0, base[1] - overlay[1]),
            Math.max(0, base[2] - overlay[2]),
            base[3]
        ];
        
        return this.blendNormal(base, result, opacity);
    }

    /**
     * Generic blend function
     * @param {Array} base - Base color [r, g, b, a]
     * @param {Array} overlay - Overlay color [r, g, b, a]
     * @param {string} mode - Blend mode name
     * @param {number} opacity - Opacity (0-1)
     * @returns {Array} - Blended color [r, g, b, a]
     */
    blend(base, overlay, mode = 'normal', opacity = 1) {
        const cacheKey = `${mode}_${base.join(',')}_${overlay.join(',')}_${opacity}`;
        if (this.blendModeCache.has(cacheKey)) {
            return this.blendModeCache.get(cacheKey);
        }
        
        let result;
        
        switch (mode.toLowerCase()) {
            case 'multiply':
                result = this.blendMultiply(base, overlay, opacity);
                break;
            case 'screen':
                result = this.blendScreen(base, overlay, opacity);
                break;
            case 'overlay':
                result = this.blendOverlay(base, overlay, opacity);
                break;
            case 'add':
                result = this.blendAdd(base, overlay, opacity);
                break;
            case 'subtract':
                result = this.blendSubtract(base, overlay, opacity);
                break;
            default:
                result = this.blendNormal(base, overlay, opacity);
        }
        
        this.blendModeCache.set(cacheKey, result);
        return result;
    }

    /**
     * Mathematical utility functions
     */
    
    /**
     * Linear interpolation
     * @param {number} a - Start value
     * @param {number} b - End value
     * @param {number} t - Interpolation factor (0-1)
     * @returns {number} - Interpolated value
     */
    lerp(a, b, t) {
        return a + (b - a) * t;
    }

    /**
     * Clamp value between min and max
     * @param {number} value - Value to clamp
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} - Clamped value
     */
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    /**
     * Map value from one range to another
     * @param {number} value - Input value
     * @param {number} inMin - Input minimum
     * @param {number} inMax - Input maximum
     * @param {number} outMin - Output minimum
     * @param {number} outMax - Output maximum
     * @returns {number} - Mapped value
     */
    map(value, inMin, inMax, outMin, outMax) {
        return outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin));
    }

    /**
     * Smooth step function
     * @param {number} edge0 - Lower edge
     * @param {number} edge1 - Upper edge
     * @param {number} x - Input value
     * @returns {number} - Smoothed value
     */
    smoothstep(edge0, edge1, x) {
        const t = this.clamp((x - edge0) / (edge1 - edge0), 0, 1);
        return t * t * (3 - 2 * t);
    }

    /**
     * Noise and randomization utilities
     */
    
    /**
     * Simple noise function (placeholder for more complex noise)
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate (optional)
     * @param {number} z - Z coordinate (optional)
     * @returns {number} - Noise value (-1 to 1)
     */
    noise(x, y = 0, z = 0) {
        // Simple pseudo-random noise
        let value = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
        return 2 * (value - Math.floor(value)) - 1;
    }

    /**
     * Fractal noise (multiple octaves)
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} octaves - Number of octaves
     * @param {number} persistence - Persistence value
     * @returns {number} - Fractal noise value
     */
    fractalNoise(x, y, octaves = 4, persistence = 0.5) {
        let value = 0;
        let amplitude = 1;
        let frequency = 1;
        let maxValue = 0;
        
        for (let i = 0; i < octaves; i++) {
            value += this.noise(x * frequency, y * frequency) * amplitude;
            maxValue += amplitude;
            amplitude *= persistence;
            frequency *= 2;
        }
        
        return value / maxValue;
    }

    /**
     * Utility functions for pattern creation
     */
    
    /**
     * Create color palette
     * @param {Array} colors - Array of RGB colors
     * @param {number} steps - Number of interpolation steps
     * @returns {Array} - Color palette array
     */
    createPalette(colors, steps = 256) {
        const palette = [];
        const segmentSize = (steps - 1) / (colors.length - 1);
        
        for (let i = 0; i < steps; i++) {
            const segment = Math.floor(i / segmentSize);
            const t = (i % segmentSize) / segmentSize;
            
            if (segment >= colors.length - 1) {
                palette.push([...colors[colors.length - 1]]);
            } else {
                const color1 = colors[segment];
                const color2 = colors[segment + 1];
                
                palette.push([
                    Math.floor(this.lerp(color1[0], color2[0], t)),
                    Math.floor(this.lerp(color1[1], color2[1], t)),
                    Math.floor(this.lerp(color1[2], color2[2], t))
                ]);
            }
        }
        
        return palette;
    }

    /**
     * Clear caches
     */
    clearCaches() {
        this.colorCache.clear();
        this.blendModeCache.clear();
    }

    /**
     * Get cache statistics
     * @returns {Object} - Cache statistics
     */
    getCacheStats() {
        return {
            colorCache: this.colorCache.size,
            blendModeCache: this.blendModeCache.size
        };
    }
}

// Export default instance
export default new PatternUtils();