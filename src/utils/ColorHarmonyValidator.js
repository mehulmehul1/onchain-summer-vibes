/**
 * ColorHarmonyValidator.js - Advanced Color Harmony Validation System
 * 
 * Implements WCAG accessibility guidelines, color theory validation,
 * and visual balance analysis for theme palettes.
 */

export class ColorHarmonyValidator {
    constructor() {
        this.wcagAAThreshold = 4.5;  // WCAG AA standard
        this.wcagAAAThreshold = 7.0; // WCAG AAA standard
    }

    /**
     * Validate a complete color palette
     * @param {Object} colors - Color palette object {color1, color2, color3, color4}
     * @returns {Object} Validation results
     */
    validatePalette(colors) {
        const rgbColors = this.convertPaletteToRGB(colors);
        
        return {
            contrast: this.checkContrast(rgbColors),
            harmony: this.checkHarmony(rgbColors),
            accessibility: this.checkAccessibility(rgbColors),
            balance: this.checkBalance(rgbColors),
            overall: this.calculateOverallScore(rgbColors)
        };
    }

    /**
     * Convert hex palette to RGB format
     * @param {Object} colors - Hex color palette
     * @returns {Array} Array of RGB color arrays
     */
    convertPaletteToRGB(colors) {
        return Object.values(colors).map(hex => this.hexToRgb(hex));
    }

    /**
     * Check contrast ratios between all color combinations
     * @param {Array} rgbColors - Array of RGB color arrays
     * @returns {Object} Contrast analysis results
     */
    checkContrast(rgbColors) {
        const ratios = [];
        const wcagCompliant = [];
        
        // Check all color combinations
        for (let i = 0; i < rgbColors.length; i++) {
            for (let j = i + 1; j < rgbColors.length; j++) {
                const ratio = this.calculateContrastRatio(rgbColors[i], rgbColors[j]);
                ratios.push({
                    colors: [i, j],
                    ratio: ratio,
                    wcagAA: ratio >= this.wcagAAThreshold,
                    wcagAAA: ratio >= this.wcagAAAThreshold
                });
                
                if (ratio >= this.wcagAAThreshold) {
                    wcagCompliant.push({ colors: [i, j], ratio });
                }
            }
        }

        const avgRatio = ratios.reduce((sum, r) => sum + r.ratio, 0) / ratios.length;
        const minRatio = Math.min(...ratios.map(r => r.ratio));
        const maxRatio = Math.max(...ratios.map(r => r.ratio));
        
        return {
            ratios: ratios,
            average: avgRatio,
            minimum: minRatio,
            maximum: maxRatio,
            wcagAACompliant: wcagCompliant.length,
            wcagAAACompliant: ratios.filter(r => r.wcagAAA).length,
            score: Math.min(100, (avgRatio / this.wcagAAThreshold) * 100)
        };
    }

    /**
     * Check color harmony based on color theory principles
     * @param {Array} rgbColors - Array of RGB color arrays
     * @returns {Object} Harmony analysis results
     */
    checkHarmony(rgbColors) {
        const hslColors = rgbColors.map(rgb => this.rgbToHsl(rgb));
        
        // Analyze hue relationships
        const hues = hslColors.map(hsl => hsl[0]);
        const saturations = hslColors.map(hsl => hsl[1]);
        const lightnesses = hslColors.map(hsl => hsl[2]);
        
        // Check for common color schemes
        const schemes = {
            monochromatic: this.isMonochromatic(hues),
            analogous: this.isAnalogous(hues),
            complementary: this.isComplementary(hues),
            triadic: this.isTriadic(hues),
            tetradic: this.isTetradic(hues),
            splitComplementary: this.isSplitComplementary(hues)
        };
        
        // Calculate harmony score
        const hueVariance = this.calculateVariance(hues);
        const saturationBalance = this.calculateBalance(saturations);
        const lightnessBalance = this.calculateBalance(lightnesses);
        
        const schemeScore = Object.values(schemes).some(Boolean) ? 25 : 0;
        const balanceScore = (saturationBalance + lightnessBalance) / 2 * 75;
        
        return {
            schemes: schemes,
            hueVariance: hueVariance,
            saturationBalance: saturationBalance,
            lightnessBalance: lightnessBalance,
            score: schemeScore + balanceScore
        };
    }

    /**
     * Check accessibility compliance including color blindness simulation
     * @param {Array} rgbColors - Array of RGB color arrays
     * @returns {Object} Accessibility analysis results
     */
    checkAccessibility(rgbColors) {
        // Simulate different types of color blindness
        const protanopia = rgbColors.map(rgb => this.simulateProtanopia(rgb));
        const deuteranopia = rgbColors.map(rgb => this.simulateDeuteranopia(rgb));
        const tritanopia = rgbColors.map(rgb => this.simulateTritanopia(rgb));
        
        // Check if colors remain distinguishable under color blindness
        const protanopiaDistinct = this.checkDistinguishability(protanopia);
        const deuteranopiaDistinct = this.checkDistinguishability(deuteranopia);
        const tritanopiaDistinct = this.checkDistinguishability(tritanopia);
        
        // Calculate overall accessibility score
        const colorBlindnessScore = (protanopiaDistinct + deuteranopiaDistinct + tritanopiaDistinct) / 3 * 100;
        
        return {
            colorBlindness: {
                protanopia: protanopiaDistinct,
                deuteranopia: deuteranopiaDistinct,
                tritanopia: tritanopiaDistinct
            },
            score: colorBlindnessScore
        };
    }

    /**
     * Check visual balance of the color palette
     * @param {Array} rgbColors - Array of RGB color arrays
     * @returns {Object} Balance analysis results
     */
    checkBalance(rgbColors) {
        const weights = rgbColors.map(rgb => this.calculateVisualWeight(rgb));
        const temperatures = rgbColors.map(rgb => this.calculateColorTemperature(rgb));
        
        const weightBalance = this.calculateBalance(weights);
        const temperatureBalance = this.calculateBalance(temperatures);
        
        // Check for proper light/dark distribution
        const lightnesses = rgbColors.map(rgb => this.rgbToHsl(rgb)[2]);
        const hasLight = lightnesses.some(l => l > 0.7);
        const hasDark = lightnesses.some(l => l < 0.3);
        const lightDarkBalance = (hasLight && hasDark) ? 1.0 : 0.5;
        
        const overallBalance = (weightBalance + temperatureBalance + lightDarkBalance) / 3;
        
        return {
            visualWeight: {
                values: weights,
                balance: weightBalance
            },
            temperature: {
                values: temperatures,
                balance: temperatureBalance
            },
            lightDark: {
                hasLight: hasLight,
                hasDark: hasDark,
                balance: lightDarkBalance
            },
            score: overallBalance * 100
        };
    }

    /**
     * Calculate overall harmony score
     * @param {Array} rgbColors - Array of RGB color arrays
     * @returns {number} Overall score (0-100)
     */
    calculateOverallScore(rgbColors) {
        const contrast = this.checkContrast(rgbColors);
        const harmony = this.checkHarmony(rgbColors);
        const accessibility = this.checkAccessibility(rgbColors);
        const balance = this.checkBalance(rgbColors);
        
        // Weighted average of all factors
        return (
            contrast.score * 0.3 +
            harmony.score * 0.25 +
            accessibility.score * 0.25 +
            balance.score * 0.2
        );
    }

    // =================
    // UTILITY METHODS
    // =================

    /**
     * Convert hex color to RGB
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
        return [h * 360, s, l];
    }

    /**
     * Calculate relative luminance for contrast ratio
     */
    calculateLuminance([r, g, b]) {
        const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    /**
     * Calculate contrast ratio between two colors
     */
    calculateContrastRatio(color1, color2) {
        const lum1 = this.calculateLuminance(color1);
        const lum2 = this.calculateLuminance(color2);
        const lighter = Math.max(lum1, lum2);
        const darker = Math.min(lum1, lum2);
        return (lighter + 0.05) / (darker + 0.05);
    }

    /**
     * Check if hues form a monochromatic scheme
     */
    isMonochromatic(hues) {
        const tolerance = 15; // degrees
        const baseHue = hues[0];
        return hues.every(hue => Math.abs(hue - baseHue) <= tolerance);
    }

    /**
     * Check if hues form an analogous scheme
     */
    isAnalogous(hues) {
        const tolerance = 30; // degrees
        hues.sort((a, b) => a - b);
        return (hues[hues.length - 1] - hues[0]) <= tolerance;
    }

    /**
     * Check if hues form a complementary scheme
     */
    isComplementary(hues) {
        const tolerance = 15; // degrees
        for (let i = 0; i < hues.length; i++) {
            for (let j = i + 1; j < hues.length; j++) {
                const diff = Math.abs(hues[i] - hues[j]);
                if (Math.abs(diff - 180) <= tolerance || Math.abs(diff - 180 + 360) <= tolerance) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Check if hues form a triadic scheme
     */
    isTriadic(hues) {
        if (hues.length < 3) return false;
        const tolerance = 15; // degrees
        hues.sort((a, b) => a - b);
        
        for (let i = 0; i < hues.length - 2; i++) {
            const diff1 = hues[i + 1] - hues[i];
            const diff2 = hues[i + 2] - hues[i + 1];
            if (Math.abs(diff1 - 120) <= tolerance && Math.abs(diff2 - 120) <= tolerance) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if hues form a tetradic scheme
     */
    isTetradic(hues) {
        if (hues.length < 4) return false;
        const tolerance = 15; // degrees
        hues.sort((a, b) => a - b);
        
        const diff1 = hues[1] - hues[0];
        const diff2 = hues[2] - hues[1];
        const diff3 = hues[3] - hues[2];
        
        return Math.abs(diff1 - 90) <= tolerance && 
               Math.abs(diff2 - 90) <= tolerance && 
               Math.abs(diff3 - 90) <= tolerance;
    }

    /**
     * Check if hues form a split-complementary scheme
     */
    isSplitComplementary(hues) {
        if (hues.length < 3) return false;
        const tolerance = 15; // degrees
        
        for (let i = 0; i < hues.length; i++) {
            const baseHue = hues[i];
            const complement = (baseHue + 180) % 360;
            const split1 = (complement - 30 + 360) % 360;
            const split2 = (complement + 30) % 360;
            
            const hasSplit1 = hues.some(h => Math.abs(h - split1) <= tolerance);
            const hasSplit2 = hues.some(h => Math.abs(h - split2) <= tolerance);
            
            if (hasSplit1 && hasSplit2) return true;
        }
        return false;
    }

    /**
     * Calculate variance of a set of values
     */
    calculateVariance(values) {
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        return variance;
    }

    /**
     * Calculate balance score (1.0 = perfect balance, 0.0 = poor balance)
     */
    calculateBalance(values) {
        if (values.length === 0) return 0;
        
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance = this.calculateVariance(values);
        const coefficient = variance / (mean * mean); // Coefficient of variation
        
        // Convert to balance score (lower variance = better balance)
        return Math.max(0, 1 - coefficient);
    }

    /**
     * Calculate visual weight of a color
     */
    calculateVisualWeight([r, g, b]) {
        // Visual weight based on luminance and saturation
        const luminance = this.calculateLuminance([r, g, b]);
        const [h, s, l] = this.rgbToHsl([r, g, b]);
        
        // Darker colors and more saturated colors have higher visual weight
        return (1 - luminance) * 0.7 + s * 0.3;
    }

    /**
     * Calculate color temperature (warm vs cool)
     */
    calculateColorTemperature([r, g, b]) {
        // Simple temperature calculation based on red/blue balance
        const [h, s, l] = this.rgbToHsl([r, g, b]);
        
        // Hue-based temperature (0-180 = warm, 180-360 = cool)
        if (h >= 0 && h <= 60) return 1.0;      // Red-Yellow (warm)
        if (h >= 60 && h <= 120) return 0.5;    // Yellow-Green (neutral)
        if (h >= 120 && h <= 240) return 0.0;   // Green-Blue (cool)
        if (h >= 240 && h <= 300) return 0.2;   // Blue-Purple (cool)
        return 0.8;                             // Purple-Red (warm)
    }

    /**
     * Simulate protanopia (red-blind)
     */
    simulateProtanopia([r, g, b]) {
        return [
            Math.round(0.567 * r + 0.433 * g),
            Math.round(0.558 * r + 0.442 * g),
            Math.round(0.242 * g + 0.758 * b)
        ];
    }

    /**
     * Simulate deuteranopia (green-blind)
     */
    simulateDeuteranopia([r, g, b]) {
        return [
            Math.round(0.625 * r + 0.375 * g),
            Math.round(0.7 * r + 0.3 * g),
            Math.round(0.3 * g + 0.7 * b)
        ];
    }

    /**
     * Simulate tritanopia (blue-blind)
     */
    simulateTritanopia([r, g, b]) {
        return [
            Math.round(0.95 * r + 0.05 * g),
            Math.round(0.433 * g + 0.567 * b),
            Math.round(0.475 * g + 0.525 * b)
        ];
    }

    /**
     * Check if colors remain distinguishable
     */
    checkDistinguishability(colors) {
        const threshold = 50; // Minimum color distance
        
        for (let i = 0; i < colors.length; i++) {
            for (let j = i + 1; j < colors.length; j++) {
                const distance = this.calculateColorDistance(colors[i], colors[j]);
                if (distance < threshold) {
                    return 0.0; // Colors not distinguishable
                }
            }
        }
        return 1.0; // All colors distinguishable
    }

    /**
     * Calculate Euclidean distance between two RGB colors
     */
    calculateColorDistance([r1, g1, b1], [r2, g2, b2]) {
        return Math.sqrt(
            Math.pow(r2 - r1, 2) + 
            Math.pow(g2 - g1, 2) + 
            Math.pow(b2 - b1, 2)
        );
    }
}