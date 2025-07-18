/**
 * themes.js - Theme Palettes and Randomization Weights
 * 
 * Define theme palettes and randomization weights for the application
 */

export const themes = {
    dawn: {
        name: 'Dawn',
        description: 'Soft morning colors with gentle blues and warm whites',
        mood: 'calm',
        colors: {
            primary: [27, 41, 81],      // Deep blue
            secondary: [74, 144, 164],   // Medium blue
            accent: [133, 193, 233],     // Light blue
            background: [248, 249, 250], // Almost white
            stroke: [200, 200, 200],     // Light gray
            fill: [133, 193, 233]        // Light blue
        },
        weight: 1.0,
        animated: true
    },

    sunrise: {
        name: 'Sunrise',
        description: 'Warm orange and gold tones with deep contrasts',
        mood: 'energetic',
        colors: {
            primary: [44, 62, 80],       // Dark blue-gray
            secondary: [230, 126, 34],   // Orange
            accent: [243, 156, 18],      // Gold
            background: [254, 249, 231], // Cream
            stroke: [180, 90, 20],       // Dark orange
            fill: [243, 156, 18]         // Gold
        },
        weight: 1.2,
        animated: true
    },

    ocean: {
        name: 'Ocean',
        description: 'Deep sea blues with aqua highlights',
        mood: 'tranquil',
        colors: {
            primary: [27, 79, 114],      // Deep blue
            secondary: [52, 152, 219],   // Ocean blue
            accent: [174, 214, 241],     // Light blue
            background: [235, 245, 251], // Very light blue
            stroke: [100, 150, 200],     // Medium blue
            fill: [174, 214, 241]        // Light blue
        },
        weight: 1.0,
        animated: true
    },

    forest: {
        name: 'Forest',
        description: 'Natural greens with earthy browns',
        mood: 'grounded',
        colors: {
            primary: [39, 74, 49],       // Forest green
            secondary: [88, 164, 176],   // Teal
            accent: [165, 214, 167],     // Light green
            background: [245, 248, 245], // Very light green
            stroke: [100, 120, 100],     // Medium green
            fill: [165, 214, 167]        // Light green
        },
        weight: 0.8,
        animated: true
    },

    sunset: {
        name: 'Sunset',
        description: 'Warm purples and pinks with golden accents',
        mood: 'romantic',
        colors: {
            primary: [74, 35, 90],       // Deep purple
            secondary: [155, 89, 182],   // Purple
            accent: [241, 196, 15],      // Gold
            background: [253, 242, 248], // Light pink
            stroke: [200, 150, 200],     // Light purple
            fill: [241, 196, 15]         // Gold
        },
        weight: 0.9,
        animated: true
    },

    midnight: {
        name: 'Midnight',
        description: 'Deep blacks and blues with silver accents',
        mood: 'mysterious',
        colors: {
            primary: [23, 32, 42],       // Very dark blue
            secondary: [52, 73, 94],     // Dark gray-blue
            accent: [149, 165, 166],     // Silver
            background: [44, 62, 80],    // Dark blue-gray
            stroke: [120, 120, 120],     // Gray
            fill: [149, 165, 166]        // Silver
        },
        weight: 0.7,
        animated: false
    },

    spring: {
        name: 'Spring',
        description: 'Fresh greens and bright yellows',
        mood: 'fresh',
        colors: {
            primary: [46, 125, 50],      // Green
            secondary: [139, 195, 74],   // Light green
            accent: [255, 235, 59],      // Yellow
            background: [248, 255, 248], // Very light green
            stroke: [100, 150, 100],     // Medium green
            fill: [255, 235, 59]         // Yellow
        },
        weight: 1.1,
        animated: true
    },

    autumn: {
        name: 'Autumn',
        description: 'Warm browns and oranges with deep reds',
        mood: 'warm',
        colors: {
            primary: [101, 67, 33],      // Brown
            secondary: [194, 125, 14],   // Orange-brown
            accent: [255, 152, 0],       // Orange
            background: [255, 248, 240], // Cream
            stroke: [150, 100, 50],      // Medium brown
            fill: [255, 152, 0]          // Orange
        },
        weight: 0.9,
        animated: true
    },

    arctic: {
        name: 'Arctic',
        description: 'Cool whites and ice blues',
        mood: 'cool',
        colors: {
            primary: [69, 90, 100],      // Steel blue
            secondary: [144, 164, 174],  // Light steel
            accent: [176, 190, 197],     // Very light blue
            background: [250, 250, 250], // Almost white
            stroke: [180, 180, 180],     // Light gray
            fill: [176, 190, 197]        // Very light blue
        },
        weight: 0.8,
        animated: false
    },

    desert: {
        name: 'Desert',
        description: 'Warm sands and terracotta with sunset hues',
        mood: 'warm',
        colors: {
            primary: [121, 85, 72],      // Brown
            secondary: [188, 143, 143],  // Dusty rose
            accent: [255, 213, 79],      // Sand yellow
            background: [255, 248, 225], // Cream
            stroke: [180, 140, 100],     // Medium brown
            fill: [255, 213, 79]         // Sand yellow
        },
        weight: 0.8,
        animated: true
    }
};

/**
 * Get weighted random theme
 * @param {Array} excludeThemes - Theme names to exclude
 * @returns {string} - Selected theme name
 */
export function getWeightedRandomTheme(excludeThemes = []) {
    const availableThemes = Object.entries(themes)
        .filter(([name]) => !excludeThemes.includes(name));
    
    if (availableThemes.length === 0) {
        return Object.keys(themes)[0]; // Fallback to first theme
    }
    
    // Calculate total weight
    const totalWeight = availableThemes.reduce((sum, [, theme]) => sum + theme.weight, 0);
    
    // Generate random number
    let random = Math.random() * totalWeight;
    
    // Select theme based on weight
    for (const [name, theme] of availableThemes) {
        random -= theme.weight;
        if (random <= 0) {
            return name;
        }
    }
    
    // Fallback to first available theme
    return availableThemes[0][0];
}

/**
 * Get theme categories
 * @returns {Object} - Themes grouped by mood
 */
export function getThemesByMood() {
    const grouped = {};
    
    for (const [name, theme] of Object.entries(themes)) {
        const mood = theme.mood || 'neutral';
        if (!grouped[mood]) {
            grouped[mood] = [];
        }
        grouped[mood].push(name);
    }
    
    return grouped;
}

/**
 * Get themes suitable for animation
 * @returns {Array} - Array of animated theme names
 */
export function getAnimatedThemes() {
    return Object.entries(themes)
        .filter(([, theme]) => theme.animated)
        .map(([name]) => name);
}

/**
 * Get color palette for a theme
 * @param {string} themeName - Theme name
 * @returns {Array} - Array of RGB colors
 */
export function getThemePalette(themeName) {
    const theme = themes[themeName];
    if (!theme) return [];
    
    return Object.values(theme.colors);
}

/**
 * Create custom theme
 * @param {string} name - Theme name
 * @param {Object} colors - Color definitions
 * @param {Object} options - Additional options
 * @returns {Object} - Created theme object
 */
export function createCustomTheme(name, colors, options = {}) {
    return {
        name,
        description: options.description || `Custom theme: ${name}`,
        mood: options.mood || 'custom',
        colors: {
            primary: colors.primary || [128, 128, 128],
            secondary: colors.secondary || [160, 160, 160],
            accent: colors.accent || [200, 200, 200],
            background: colors.background || [240, 240, 240],
            stroke: colors.stroke || [100, 100, 100],
            fill: colors.fill || [200, 200, 200]
        },
        weight: options.weight || 1.0,
        animated: options.animated !== false
    };
}

/**
 * Validate theme object
 * @param {Object} theme - Theme to validate
 * @returns {boolean} - True if valid
 */
export function validateTheme(theme) {
    const requiredColors = ['primary', 'secondary', 'accent', 'background'];
    
    if (!theme || typeof theme !== 'object') return false;
    if (!theme.colors || typeof theme.colors !== 'object') return false;
    
    // Check required colors
    for (const colorKey of requiredColors) {
        if (!theme.colors[colorKey] || !Array.isArray(theme.colors[colorKey])) {
            return false;
        }
        
        // Check RGB values
        const color = theme.colors[colorKey];
        if (color.length !== 3) return false;
        
        for (const channel of color) {
            if (typeof channel !== 'number' || channel < 0 || channel > 255) {
                return false;
            }
        }
    }
    
    return true;
}

// Export theme statistics
export const themeStats = {
    total: Object.keys(themes).length,
    animated: getAnimatedThemes().length,
    moods: Object.keys(getThemesByMood()),
    averageWeight: Object.values(themes).reduce((sum, theme) => sum + theme.weight, 0) / Object.keys(themes).length
};

export default themes;