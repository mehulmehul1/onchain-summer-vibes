/**
 * ColorUtils.js - Color Manipulation Functions for q5.js
 * 
 * Implement color manipulation functions for q5.js theme system
 */

export class ColorUtils {
    constructor() {
        this.cache = new Map();
    }

    /**
     * Convert hex color to RGB array
     * @param {string} hex - Hex color string (#RRGGBB or #RGB)
     * @returns {Array} - RGB array [r, g, b]
     */
    hexToRgb(hex) {
        const cacheKey = `hex_${hex}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        // Remove # if present
        hex = hex.replace('#', '');
        
        // Handle 3-digit hex
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        }
        
        const result = [
            parseInt(hex.substring(0, 2), 16),
            parseInt(hex.substring(2, 4), 16),
            parseInt(hex.substring(4, 6), 16)
        ];
        
        this.cache.set(cacheKey, result);
        return result;
    }

    /**
     * Convert RGB array to hex string
     * @param {Array} rgb - RGB array [r, g, b]
     * @returns {string} - Hex color string
     */
    rgbToHex(rgb) {
        const [r, g, b] = rgb.map(c => Math.round(Math.max(0, Math.min(255, c))));
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    /**
     * Convert RGB to HSL
     * @param {Array} rgb - RGB array [r, g, b]
     * @returns {Array} - HSL array [h, s, l]
     */
    rgbToHsl(rgb) {
        const cacheKey = `rgb_hsl_${rgb.join(',')}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const [r, g, b] = rgb.map(c => c / 255);
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const diff = max - min;

        let h, s, l = (max + min) / 2;

        if (diff === 0) {
            h = s = 0; // achromatic
        } else {
            s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
            
            switch (max) {
                case r: h = (g - b) / diff + (g < b ? 6 : 0); break;
                case g: h = (b - r) / diff + 2; break;
                case b: h = (r - g) / diff + 4; break;
            }
            h /= 6;
        }

        const result = [h * 360, s, l];
        this.cache.set(cacheKey, result);
        return result;
    }

    /**
     * Convert HSL to RGB
     * @param {Array} hsl - HSL array [h, s, l]
     * @returns {Array} - RGB array [r, g, b]
     */
    hslToRgb(hsl) {
        const [h, s, l] = hsl;
        const hNorm = h / 360;

        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        let r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, hNorm + 1/3);
            g = hue2rgb(p, q, hNorm);
            b = hue2rgb(p, q, hNorm - 1/3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    /**
     * Interpolate between two colors
     * @param {Array} color1 - First color [r, g, b]
     * @param {Array} color2 - Second color [r, g, b]
     * @param {number} t - Interpolation factor (0-1)
     * @returns {Array} - Interpolated color [r, g, b]
     */
    interpolateColor(color1, color2, t) {
        const factor = Math.max(0, Math.min(1, t));
        return [
            Math.round(color1[0] + (color2[0] - color1[0]) * factor),
            Math.round(color1[1] + (color2[1] - color1[1]) * factor),
            Math.round(color1[2] + (color2[2] - color1[2]) * factor)
        ];
    }

    /**
     * Adjust color brightness
     * @param {Array} color - RGB color [r, g, b]
     * @param {number} factor - Brightness factor (-1 to 1)
     * @returns {Array} - Adjusted color [r, g, b]
     */
    adjustBrightness(color, factor) {
        const [r, g, b] = color;
        
        if (factor > 0) {
            // Lighten
            return [
                Math.round(r + (255 - r) * factor),
                Math.round(g + (255 - g) * factor),
                Math.round(b + (255 - b) * factor)
            ];
        } else {
            // Darken
            const absF = Math.abs(factor);
            return [
                Math.round(r * (1 - absF)),
                Math.round(g * (1 - absF)),
                Math.round(b * (1 - absF))
            ];
        }
    }

    /**
     * Adjust color saturation
     * @param {Array} color - RGB color [r, g, b]
     * @param {number} factor - Saturation factor (-1 to 1)
     * @returns {Array} - Adjusted color [r, g, b]
     */
    adjustSaturation(color, factor) {
        const [h, s, l] = this.rgbToHsl(color);
        const newS = Math.max(0, Math.min(1, s + factor));
        return this.hslToRgb([h, newS, l]);
    }

    /**
     * Adjust color hue
     * @param {Array} color - RGB color [r, g, b]
     * @param {number} degrees - Hue adjustment in degrees
     * @returns {Array} - Adjusted color [r, g, b]
     */
    adjustHue(color, degrees) {
        const [h, s, l] = this.rgbToHsl(color);
        let newH = (h + degrees) % 360;
        if (newH < 0) newH += 360;
        return this.hslToRgb([newH, s, l]);
    }

    /**
     * Get complementary color
     * @param {Array} color - RGB color [r, g, b]
     * @returns {Array} - Complementary color [r, g, b]
     */
    getComplementaryColor(color) {
        return this.adjustHue(color, 180);
    }

    /**
     * Get triadic colors
     * @param {Array} color - RGB color [r, g, b]
     * @returns {Array} - Array of triadic colors
     */
    getTriadicColors(color) {
        return [
            this.adjustHue(color, 120),
            this.adjustHue(color, 240)
        ];
    }

    /**
     * Get analogous colors
     * @param {Array} color - RGB color [r, g, b]
     * @param {number} angle - Angle between colors (default: 30)
     * @returns {Array} - Array of analogous colors
     */
    getAnalogousColors(color, angle = 30) {
        return [
            this.adjustHue(color, -angle),
            this.adjustHue(color, angle)
        ];
    }

    /**
     * Get monochromatic colors
     * @param {Array} color - RGB color [r, g, b]
     * @param {number} count - Number of variations
     * @returns {Array} - Array of monochromatic colors
     */
    getMonochromaticColors(color, count = 5) {
        const colors = [];
        for (let i = 0; i < count; i++) {
            const factor = (i / (count - 1)) * 0.8 - 0.4; // -0.4 to 0.4
            colors.push(this.adjustBrightness(color, factor));
        }
        return colors;
    }

    /**
     * Blend two colors using different blend modes
     * @param {Array} base - Base color [r, g, b]
     * @param {Array} overlay - Overlay color [r, g, b]
     * @param {string} mode - Blend mode
     * @param {number} opacity - Opacity (0-1)
     * @returns {Array} - Blended color [r, g, b]
     */
    blendColors(base, overlay, mode = 'normal', opacity = 1) {
        const [r1, g1, b1] = base;
        const [r2, g2, b2] = overlay;
        
        let result;
        
        switch (mode) {
            case 'multiply':
                result = [
                    (r1 * r2) / 255,
                    (g1 * g2) / 255,
                    (b1 * b2) / 255
                ];
                break;
                
            case 'screen':
                result = [
                    255 - ((255 - r1) * (255 - r2)) / 255,
                    255 - ((255 - g1) * (255 - g2)) / 255,
                    255 - ((255 - b1) * (255 - b2)) / 255
                ];
                break;
                
            case 'overlay':
                result = [
                    r1 < 128 ? (2 * r1 * r2) / 255 : 255 - (2 * (255 - r1) * (255 - r2)) / 255,
                    g1 < 128 ? (2 * g1 * g2) / 255 : 255 - (2 * (255 - g1) * (255 - g2)) / 255,
                    b1 < 128 ? (2 * b1 * b2) / 255 : 255 - (2 * (255 - b1) * (255 - b2)) / 255
                ];
                break;
                
            case 'soft-light':
                result = [
                    r2 < 128 ? r1 - (255 - 2 * r2) * r1 * (255 - r1) / (255 * 255) : r1 + (2 * r2 - 255) * (Math.sqrt(r1 / 255) * 255 - r1) / 255,
                    g2 < 128 ? g1 - (255 - 2 * g2) * g1 * (255 - g1) / (255 * 255) : g1 + (2 * g2 - 255) * (Math.sqrt(g1 / 255) * 255 - g1) / 255,
                    b2 < 128 ? b1 - (255 - 2 * b2) * b1 * (255 - b1) / (255 * 255) : b1 + (2 * b2 - 255) * (Math.sqrt(b1 / 255) * 255 - b1) / 255
                ];
                break;
                
            case 'hard-light':
                result = [
                    r2 < 128 ? (2 * r1 * r2) / 255 : 255 - (2 * (255 - r1) * (255 - r2)) / 255,
                    g2 < 128 ? (2 * g1 * g2) / 255 : 255 - (2 * (255 - g1) * (255 - g2)) / 255,
                    b2 < 128 ? (2 * b1 * b2) / 255 : 255 - (2 * (255 - b1) * (255 - b2)) / 255
                ];
                break;
                
            case 'normal':
            default:
                result = [r2, g2, b2];
        }
        
        // Apply opacity
        return [
            Math.round(r1 * (1 - opacity) + result[0] * opacity),
            Math.round(g1 * (1 - opacity) + result[1] * opacity),
            Math.round(b1 * (1 - opacity) + result[2] * opacity)
        ];
    }

    /**
     * Get color luminance
     * @param {Array} color - RGB color [r, g, b]
     * @returns {number} - Luminance value (0-1)
     */
    getLuminance(color) {
        const [r, g, b] = color.map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    /**
     * Get contrast ratio between two colors
     * @param {Array} color1 - First color [r, g, b]
     * @param {Array} color2 - Second color [r, g, b]
     * @returns {number} - Contrast ratio (1-21)
     */
    getContrastRatio(color1, color2) {
        const lum1 = this.getLuminance(color1);
        const lum2 = this.getLuminance(color2);
        const lighter = Math.max(lum1, lum2);
        const darker = Math.min(lum1, lum2);
        return (lighter + 0.05) / (darker + 0.05);
    }

    /**
     * Check if color combination has good contrast
     * @param {Array} color1 - First color [r, g, b]
     * @param {Array} color2 - Second color [r, g, b]
     * @param {string} level - WCAG level ('AA' or 'AAA')
     * @returns {boolean} - True if contrast is acceptable
     */
    hasGoodContrast(color1, color2, level = 'AA') {
        const ratio = this.getContrastRatio(color1, color2);
        return level === 'AAA' ? ratio >= 7 : ratio >= 4.5;
    }

    /**
     * Generate random color
     * @param {Object} options - Generation options
     * @returns {Array} - Random color [r, g, b]
     */
    generateRandomColor(options = {}) {
        const {
            hueMin = 0,
            hueMax = 360,
            saturationMin = 0.3,
            saturationMax = 0.9,
            lightnessMin = 0.3,
            lightnessMax = 0.7
        } = options;

        const h = Math.random() * (hueMax - hueMin) + hueMin;
        const s = Math.random() * (saturationMax - saturationMin) + saturationMin;
        const l = Math.random() * (lightnessMax - lightnessMin) + lightnessMin;

        return this.hslToRgb([h, s, l]);
    }

    /**
     * Generate color palette
     * @param {Array} baseColor - Base color [r, g, b]
     * @param {string} harmony - Color harmony type
     * @param {number} count - Number of colors
     * @returns {Array} - Array of colors
     */
    generateColorPalette(baseColor, harmony = 'complementary', count = 5) {
        switch (harmony) {
            case 'complementary':
                return [baseColor, this.getComplementaryColor(baseColor)];
            case 'triadic':
                return [baseColor, ...this.getTriadicColors(baseColor)];
            case 'analogous':
                return [baseColor, ...this.getAnalogousColors(baseColor)];
            case 'monochromatic':
                return this.getMonochromaticColors(baseColor, count);
            case 'split-complementary':
                const comp = this.getComplementaryColor(baseColor);
                return [baseColor, ...this.getAnalogousColors(comp, 30)];
            default:
                return [baseColor];
        }
    }

    /**
     * Clear color cache
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Get cache statistics
     * @returns {Object} - Cache statistics
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }
}

// Export default instance
export default new ColorUtils();