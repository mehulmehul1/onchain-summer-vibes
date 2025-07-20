/**
 * ThemePatternEnhancer.js - Theme-Pattern Interaction System
 * 
 * Applies theme-specific modifications and effects to patterns based on
 * theme rarity and characteristics.
 */

import { AdvancedColorBlender } from './AdvancedColorBlender.js';

export class ThemePatternEnhancer {
    constructor() {
        this.blender = new AdvancedColorBlender();
        this.effectsCache = new Map();
    }
    
    /**
     * Apply theme effects to a pattern
     * @param {string} patternType - Type of pattern
     * @param {string} theme - Theme name
     * @param {Object} baseColors - Base color object {primary, secondary, accent, background}
     * @param {Object} options - Additional options
     * @returns {Object} Enhanced theme effects
     */
    applyThemeEffects(patternType, theme, baseColors, options = {}) {
        const cacheKey = `${patternType}-${theme}-${JSON.stringify(baseColors)}-${JSON.stringify(options)}`;
        
        if (this.effectsCache.has(cacheKey)) {
            return this.effectsCache.get(cacheKey);
        }
        
        const themeEffects = this.getThemeEffects(theme);
        const patternMods = this.getPatternModifications(patternType, theme);
        
        const enhancedColors = this.enhanceColors(baseColors, themeEffects);
        
        const result = {
            colors: enhancedColors,
            opacity: this.adjustOpacity(themeEffects.intensity, options.baseOpacity || 1.0),
            blending: themeEffects.blendMode,
            special: patternMods,
            performance: themeEffects.performance || {}
        };
        
        this.effectsCache.set(cacheKey, result);
        return result;
    }
    
    /**
     * Get theme-specific effects and characteristics
     * @param {string} theme - Theme name
     * @returns {Object} Theme effects configuration
     */
    getThemeEffects(theme) {
        const themeEffects = {
            dawn: {
                colorShift: 0.1,
                intensity: 1.0,
                blendMode: 'normal',
                warmth: 0.2,
                brightness: 0.1,
                saturation: 0.0
            },
            ocean: {
                colorShift: -0.1,
                intensity: 1.1,
                blendMode: 'multiply',
                coolness: 0.3,
                depth: 0.2,
                saturation: 0.1
            },
            forest: {
                colorShift: 0.05,
                intensity: 0.9,
                blendMode: 'overlay',
                naturalness: 0.25,
                saturation: 0.15,
                brightness: -0.05
            },
            sunset: {
                colorShift: 0.15,
                intensity: 1.2,
                blendMode: 'soft-light',
                warmth: 0.4,
                drama: 0.3,
                brightness: 0.1
            },
            midnight: {
                colorShift: -0.2,
                intensity: 0.8,
                blendMode: 'multiply',
                darkness: 0.3,
                mystery: 0.25,
                brightness: -0.2
            },
            sunrise: {
                colorShift: 0.2,
                intensity: 1.15,
                blendMode: 'screen',
                warmth: 0.35,
                energy: 0.3,
                saturation: 0.2
            },
            monochrome: {
                colorShift: 0,
                intensity: 0.85,
                blendMode: 'luminosity',
                contrast: 0.4,
                simplicity: 0.5,
                saturation: -0.8,
                performance: { useGrayscale: true }
            },
            neon: {
                colorShift: 0.3,
                intensity: 1.4,
                blendMode: 'screen',
                saturation: 0.6,
                glow: 0.5,
                brightness: 0.3,
                performance: { useGlow: true }
            },
            pastel: {
                colorShift: -0.3,
                intensity: 0.7,
                blendMode: 'soft-light',
                softness: 0.4,
                delicacy: 0.3,
                saturation: -0.2,
                brightness: 0.2,
                performance: { useSoftening: true }
            }
        };
        
        return themeEffects[theme] || themeEffects.dawn;
    }
    
    /**
     * Get pattern-specific modifications for themes
     * @param {string} patternType - Pattern type
     * @param {string} theme - Theme name
     * @returns {Object} Pattern modifications
     */
    getPatternModifications(patternType, theme) {
        const modifications = {
            interference: {
                neon: { 
                    glowRadius: 8, 
                    pulseIntensity: 0.3,
                    lineGlow: true,
                    glowColor: 'rgba(255, 255, 255, 0.6)' 
                },
                monochrome: { 
                    lineSharpness: 1.5, 
                    noiseReduction: 0.8,
                    contrastBoost: 0.4,
                    edgeEnhancement: true 
                },
                pastel: { 
                    softening: 0.4, 
                    blurRadius: 2,
                    dreamyEffect: true,
                    colorBleeding: 0.3 
                }
            },
            gentle: {
                neon: { 
                    lineGlow: true, 
                    sparkleEffect: 0.2,
                    trailIntensity: 0.4,
                    electricEffect: true 
                },
                monochrome: { 
                    lineWeight: 1.3, 
                    contrastBoost: 0.3,
                    lineDefinition: 0.8,
                    grayscaleOptimization: true 
                },
                pastel: { 
                    flowSoftness: 0.5, 
                    dreamyEffect: true,
                    watercolorBlending: true,
                    softEdges: 0.6 
                }
            },
            mandala: {
                neon: { 
                    centerGlow: true, 
                    ringPulse: 0.25,
                    symmetryGlow: true,
                    cosmicEffect: 0.4 
                },
                monochrome: { 
                    geometricSharpness: 1.4, 
                    shadowDepth: 0.3,
                    lineClarity: 1.2,
                    structuralEmphasis: true 
                },
                pastel: { 
                    floralSoftness: 0.6, 
                    watercolorEffect: true,
                    organicBlending: 0.5,
                    delicateDetails: true 
                }
            },
            vectorField: {
                neon: { 
                    particleGlow: true, 
                    trailIntensity: 0.4,
                    energyField: true,
                    lightningEffect: 0.3 
                },
                monochrome: { 
                    fieldContrast: 1.5, 
                    lineDefinition: 0.8,
                    vectorClarity: 1.3,
                    minimalistApproach: true 
                },
                pastel: { 
                    particleSoftness: 0.5, 
                    cloudyTrails: true,
                    atmosphericEffect: 0.4,
                    gentleFlow: true 
                }
            },
            shellRidge: {
                neon: { 
                    ridgeGlow: true, 
                    waveAmplification: 0.3,
                    bioluminescence: 0.5,
                    energyRipples: true 
                },
                monochrome: { 
                    ridgeSharpness: 1.6, 
                    depthEnhancement: 0.4,
                    textureClarity: 1.4,
                    architecturalFocus: true 
                },
                pastel: { 
                    organicSoftness: 0.5, 
                    naturalBlending: true,
                    seashellDelicacy: 0.6,
                    gentleTextures: true 
                }
            },
            contourInterference: {
                neon: { 
                    contourGlow: true, 
                    levelBrightness: 0.4,
                    topographicGlow: true,
                    electricContours: 0.5 
                },
                monochrome: { 
                    contourSharpness: 1.5, 
                    levelContrast: 0.5,
                    mapClarity: 1.3,
                    technicalPrecision: true 
                },
                pastel: { 
                    contourSoftness: 0.4, 
                    smoothTransitions: true,
                    landscapeDreaming: 0.5,
                    gentleElevation: true 
                }
            }
        };
        
        return modifications[patternType]?.[theme] || {};
    }
    
    /**
     * Enhance colors based on theme effects
     * @param {Object} baseColors - Base color object
     * @param {Object} effects - Theme effects
     * @returns {Object} Enhanced colors
     */
    enhanceColors(baseColors, effects) {
        const enhanced = { ...baseColors };
        
        // Convert RGB arrays to hex for processing
        const hexColors = {
            primary: this.rgbToHex(enhanced.primary),
            secondary: this.rgbToHex(enhanced.secondary),
            accent: this.rgbToHex(enhanced.accent),
            background: this.rgbToHex(enhanced.background)
        };
        
        // Apply color shifts
        if (effects.colorShift !== 0) {
            Object.keys(hexColors).forEach(key => {
                hexColors[key] = this.shiftHue(hexColors[key], effects.colorShift);
            });
        }
        
        // Apply warmth/coolness
        if (effects.warmth) {
            Object.keys(hexColors).forEach(key => {
                hexColors[key] = this.blender.adjustTemperature(hexColors[key], effects.warmth);
            });
        }
        
        if (effects.coolness) {
            Object.keys(hexColors).forEach(key => {
                hexColors[key] = this.blender.adjustTemperature(hexColors[key], -effects.coolness);
            });
        }
        
        // Apply saturation adjustments
        if (effects.saturation !== undefined) {
            Object.keys(hexColors).forEach(key => {
                hexColors[key] = this.blender.adjustSaturation(hexColors[key], effects.saturation);
            });
        }
        
        // Apply brightness adjustments
        if (effects.brightness !== undefined) {
            Object.keys(hexColors).forEach(key => {
                hexColors[key] = this.blender.adjustBrightness(hexColors[key], effects.brightness);
            });
        }
        
        // Apply contrast adjustments (for monochrome theme)
        if (effects.contrast) {
            hexColors.primary = this.adjustContrast(hexColors.primary, effects.contrast);
            hexColors.accent = this.adjustContrast(hexColors.accent, effects.contrast);
        }
        
        // Convert back to RGB arrays
        Object.keys(enhanced).forEach(key => {
            enhanced[key] = this.hexToRgb(hexColors[key]);
        });
        
        return enhanced;
    }
    
    /**
     * Shift hue of a color
     * @param {string} hexColor - Hex color string
     * @param {number} shift - Hue shift (-1 to 1)
     * @returns {string} Shifted hex color
     */
    shiftHue(hexColor, shift) {
        const rgb = this.hexToRgb(hexColor);
        const hsl = this.rgbToHsl(rgb);
        
        hsl.h = (hsl.h + shift * 360 + 360) % 360;
        
        const newRgb = this.hslToRgb(hsl);
        return this.rgbToHex(newRgb);
    }
    
    /**
     * Adjust contrast of a color
     * @param {string} hexColor - Hex color string
     * @param {number} contrast - Contrast adjustment (0 to 1)
     * @returns {string} Adjusted hex color
     */
    adjustContrast(hexColor, contrast) {
        const rgb = this.hexToRgb(hexColor);
        const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));
        
        const adjusted = rgb.map(c => {
            const newC = factor * (c - 128) + 128;
            return Math.max(0, Math.min(255, Math.round(newC)));
        });
        
        return this.rgbToHex(adjusted);
    }
    
    /**
     * Adjust opacity based on intensity
     * @param {number} intensity - Intensity factor
     * @param {number} baseOpacity - Base opacity
     * @returns {number} Adjusted opacity
     */
    adjustOpacity(intensity, baseOpacity) {
        return Math.max(0.1, Math.min(2.0, baseOpacity * intensity));
    }
    
    /**
     * Get canvas effects for theme
     * @param {string} theme - Theme name
     * @param {Object} special - Special effects object
     * @returns {Object} Canvas effects configuration
     */
    getCanvasEffects(theme, special) {
        const effects = {
            shadowBlur: 0,
            shadowColor: 'transparent',
            filter: 'none',
            globalCompositeOperation: 'source-over'
        };
        
        // Apply glow effects for neon theme
        if (special.glowRadius || special.lineGlow || special.centerGlow) {
            effects.shadowBlur = special.glowRadius || 5;
            effects.shadowColor = special.glowColor || 'rgba(255, 255, 255, 0.6)';
        }
        
        // Apply grayscale for monochrome theme
        if (special.useGrayscale || theme === 'monochrome') {
            effects.filter = 'grayscale(100%)';
        }
        
        // Apply softening for pastel theme
        if (special.useSoftening || special.blurRadius) {
            const blur = special.blurRadius || 1;
            effects.filter = effects.filter === 'none' 
                ? `blur(${blur}px)` 
                : `${effects.filter} blur(${blur}px)`;
        }
        
        return effects;
    }
    
    /**
     * Apply post-processing effects
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {string} theme - Theme name
     * @param {Object} special - Special effects
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     */
    applyPostProcessingEffects(ctx, theme, special, width, height) {
        // Apply epic theme special effects
        if (theme === 'pastel' && special.watercolorEffect) {
            this.applyWatercolorEffect(ctx, width, height, special.colorBleeding || 0.3);
        }
        
        if (theme === 'neon' && special.sparkleEffect) {
            this.applySparkleEffect(ctx, width, height, special.sparkleEffect);
        }
        
        if (theme === 'monochrome' && special.edgeEnhancement) {
            this.applyEdgeEnhancement(ctx, width, height);
        }
    }
    
    /**
     * Apply watercolor bleeding effect
     */
    applyWatercolorEffect(ctx, width, height, intensity = 0.3) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        // Apply subtle color bleeding
        for (let i = 0; i < data.length; i += 4) {
            if (Math.random() < intensity * 0.1) {
                const bleedAmount = intensity * 20;
                data[i] = Math.min(255, data[i] + (Math.random() - 0.5) * bleedAmount);
                data[i + 1] = Math.min(255, data[i + 1] + (Math.random() - 0.5) * bleedAmount);
                data[i + 2] = Math.min(255, data[i + 2] + (Math.random() - 0.5) * bleedAmount);
                data[i + 3] = Math.max(200, data[i + 3] - Math.random() * 30);
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
    }
    
    /**
     * Apply sparkle effect for neon theme
     */
    applySparkleEffect(ctx, width, height, intensity) {
        const sparkleCount = Math.floor(intensity * 100);
        
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        
        for (let i = 0; i < sparkleCount; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 3 + 1;
            const opacity = Math.random() * 0.8 + 0.2;
            
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    /**
     * Apply edge enhancement for monochrome theme
     */
    applyEdgeEnhancement(ctx, width, height) {
        // Simple edge detection and enhancement
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const newData = new Uint8ClampedArray(data);
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const idx = (y * width + x) * 4;
                
                // Simple edge detection kernel
                const current = data[idx];
                const right = data[idx + 4];
                const bottom = data[(y + 1) * width * 4 + x * 4];
                
                const edgeIntensity = Math.abs(current - right) + Math.abs(current - bottom);
                
                if (edgeIntensity > 20) {
                    newData[idx] = Math.min(255, newData[idx] + edgeIntensity * 0.5);
                    newData[idx + 1] = Math.min(255, newData[idx + 1] + edgeIntensity * 0.5);
                    newData[idx + 2] = Math.min(255, newData[idx + 2] + edgeIntensity * 0.5);
                }
            }
        }
        
        const enhancedImageData = new ImageData(newData, width, height);
        ctx.putImageData(enhancedImageData, 0, 0);
    }
    
    // =================
    // UTILITY METHODS
    // =================
    
    /**
     * Convert RGB array to hex
     */
    rgbToHex(rgb) {
        return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
    }
    
    /**
     * Convert hex to RGB array
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
     * Clear effects cache
     */
    clearCache() {
        this.effectsCache.clear();
    }
    
    /**
     * Get cache statistics
     */
    getCacheStats() {
        return {
            effectsCacheSize: this.effectsCache.size,
            blenderStats: this.blender.getCacheStats()
        };
    }
}