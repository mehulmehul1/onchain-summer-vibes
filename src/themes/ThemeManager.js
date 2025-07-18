/**
 * ThemeManager.js - Theme Management for q5.js
 * 
 * Converts React theme management to q5.js with color switching
 */

import { themes } from './themes.js';
import { ColorUtils } from './ColorUtils.js';

export class ThemeManager {
    constructor() {
        this.currentTheme = null;
        this.themes = themes;
        this.colorUtils = new ColorUtils();
        this.transitionDuration = 1000; // ms
        this.isTransitioning = false;
        this.transitionStartTime = 0;
        this.previousTheme = null;
        
        // Default theme
        this.setTheme('dawn');
    }

    /**
     * Set current theme
     * @param {string} themeName - Name of theme to set
     * @param {boolean} animated - Whether to animate transition
     */
    setTheme(themeName, animated = false) {
        if (!this.themes[themeName]) {
            console.error(`Theme '${themeName}' not found`);
            return false;
        }

        if (animated && this.currentTheme) {
            this.startTransition(themeName);
        } else {
            this.currentTheme = { ...this.themes[themeName] };
            this.currentTheme.name = themeName;
            this.isTransitioning = false;
        }

        console.log(`Theme set to: ${themeName}`);
        return true;
    }

    /**
     * Start animated transition to new theme
     * @param {string} themeName - Target theme name
     */
    startTransition(themeName) {
        if (this.isTransitioning) {
            return; // Already transitioning
        }

        this.previousTheme = { ...this.currentTheme };
        this.targetTheme = { ...this.themes[themeName] };
        this.targetTheme.name = themeName;
        this.isTransitioning = true;
        this.transitionStartTime = Date.now();
    }

    /**
     * Update theme transition
     * @param {number} currentTime - Current time in ms
     */
    updateTransition(currentTime) {
        if (!this.isTransitioning) return;

        const elapsed = currentTime - this.transitionStartTime;
        const progress = Math.min(elapsed / this.transitionDuration, 1);
        
        // Smooth easing function
        const easeProgress = this.easeInOutCubic(progress);

        // Interpolate colors
        this.currentTheme = this.interpolateTheme(
            this.previousTheme,
            this.targetTheme,
            easeProgress
        );

        // Check if transition complete
        if (progress >= 1) {
            this.currentTheme = { ...this.targetTheme };
            this.isTransitioning = false;
            this.previousTheme = null;
            this.targetTheme = null;
            console.log(`Theme transition complete: ${this.currentTheme.name}`);
        }
    }

    /**
     * Interpolate between two themes
     * @param {Object} theme1 - Start theme
     * @param {Object} theme2 - End theme
     * @param {number} t - Interpolation factor (0-1)
     * @returns {Object} - Interpolated theme
     */
    interpolateTheme(theme1, theme2, t) {
        const interpolated = {
            name: theme2.name,
            colors: {}
        };

        // Interpolate each color
        for (const colorKey in theme2.colors) {
            if (theme1.colors[colorKey] && theme2.colors[colorKey]) {
                interpolated.colors[colorKey] = this.colorUtils.interpolateColor(
                    theme1.colors[colorKey],
                    theme2.colors[colorKey],
                    t
                );
            } else {
                interpolated.colors[colorKey] = theme2.colors[colorKey];
            }
        }

        return interpolated;
    }

    /**
     * Cubic easing function
     * @param {number} t - Input value (0-1)
     * @returns {number} - Eased value
     */
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    /**
     * Get current theme colors
     * @returns {Object} - Current theme colors
     */
    getColors() {
        return this.currentTheme ? { ...this.currentTheme.colors } : {};
    }

    /**
     * Get specific color from current theme
     * @param {string} colorKey - Color key name
     * @returns {Array|null} - RGB color array or null if not found
     */
    getColor(colorKey) {
        if (!this.currentTheme || !this.currentTheme.colors[colorKey]) {
            return null;
        }
        return [...this.currentTheme.colors[colorKey]];
    }

    /**
     * Get current theme name
     * @returns {string} - Current theme name
     */
    getCurrentThemeName() {
        return this.currentTheme ? this.currentTheme.name : null;
    }

    /**
     * Get all available theme names
     * @returns {Array} - Array of theme names
     */
    getAvailableThemes() {
        return Object.keys(this.themes);
    }

    /**
     * Get theme metadata
     * @param {string} themeName - Theme name
     * @returns {Object|null} - Theme metadata or null
     */
    getThemeMetadata(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return null;

        return {
            name: themeName,
            description: theme.description || '',
            mood: theme.mood || 'neutral',
            colorCount: Object.keys(theme.colors).length,
            isAnimated: theme.animated || false
        };
    }

    /**
     * Generate random theme
     * @param {Array} excludeThemes - Themes to exclude from selection
     * @returns {string} - Selected theme name
     */
    getRandomTheme(excludeThemes = []) {
        const availableThemes = this.getAvailableThemes()
            .filter(theme => !excludeThemes.includes(theme));
        
        if (availableThemes.length === 0) {
            return this.getAvailableThemes()[0]; // Fallback to first theme
        }

        const randomIndex = Math.floor(Math.random() * availableThemes.length);
        return availableThemes[randomIndex];
    }

    /**
     * Apply theme to pattern colors
     * @param {Object} pattern - Pattern object to apply theme to
     * @returns {Object} - Pattern with theme colors applied
     */
    applyThemeToPattern(pattern) {
        if (!this.currentTheme || !pattern) return pattern;

        const themedPattern = { ...pattern };
        
        // Map common pattern color keys to theme colors
        const colorMapping = {
            color1: 'primary',
            color2: 'secondary',
            color3: 'accent',
            color4: 'background',
            strokeColor: 'stroke',
            fillColor: 'fill'
        };

        // Apply theme colors to pattern
        if (themedPattern.colors) {
            for (const [patternKey, themeKey] of Object.entries(colorMapping)) {
                if (themedPattern.colors[patternKey] && this.currentTheme.colors[themeKey]) {
                    themedPattern.colors[patternKey] = [...this.currentTheme.colors[themeKey]];
                }
            }
        }

        return themedPattern;
    }

    /**
     * Create color variations based on current theme
     * @param {string} baseColorKey - Base color key from theme
     * @param {number} variations - Number of variations to create
     * @returns {Array} - Array of color variations
     */
    createColorVariations(baseColorKey, variations = 5) {
        const baseColor = this.getColor(baseColorKey);
        if (!baseColor) return [];

        const colorVariations = [];
        
        for (let i = 0; i < variations; i++) {
            const factor = (i + 1) / variations;
            
            // Create lighter and darker variations
            const lighter = this.colorUtils.adjustBrightness(baseColor, factor * 0.3);
            const darker = this.colorUtils.adjustBrightness(baseColor, -factor * 0.3);
            
            colorVariations.push(lighter, darker);
        }

        return colorVariations;
    }

    /**
     * Get complementary color for a theme color
     * @param {string} colorKey - Color key from theme
     * @returns {Array|null} - Complementary RGB color or null
     */
    getComplementaryColor(colorKey) {
        const color = this.getColor(colorKey);
        if (!color) return null;

        return this.colorUtils.getComplementaryColor(color);
    }

    /**
     * Update theme manager (call in draw loop)
     * @param {number} currentTime - Current time in ms
     */
    update(currentTime) {
        this.updateTransition(currentTime);
    }

    /**
     * Reset theme manager to default state
     */
    reset() {
        this.setTheme('dawn');
        this.isTransitioning = false;
        this.previousTheme = null;
        this.targetTheme = null;
    }

    /**
     * Get theme manager status
     * @returns {Object} - Status information
     */
    getStatus() {
        return {
            currentTheme: this.getCurrentThemeName(),
            isTransitioning: this.isTransitioning,
            availableThemes: this.getAvailableThemes().length,
            transitionDuration: this.transitionDuration
        };
    }
}

// Export default instance
export default new ThemeManager();