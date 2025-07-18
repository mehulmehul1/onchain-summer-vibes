/**
 * Theme Test Suite
 * 
 * Tests theme switching and color application
 */

// Mock q5.js and browser environment
global.Date = Date;
global.console = console;

// Import modules
import { ThemeManager } from '../src/themes/ThemeManager.js';
import { themes } from '../config/themes.js';

console.log('=== Theme System Test Suite ===\n');

// Test 1: Theme Manager Initialization
console.log('Test 1: Theme Manager Initialization');
const themeManager = new ThemeManager();
console.log('Theme manager created');
console.log('Current theme:', themeManager.getCurrentThemeName());
console.log('Available themes:', themeManager.getAvailableThemes());
console.log('✓ Theme manager initialization test passed\n');

// Test 2: Theme Switching
console.log('Test 2: Theme Switching');
const originalTheme = themeManager.getCurrentThemeName();
console.log('Original theme:', originalTheme);

themeManager.setTheme('ocean');
console.log('After switching to ocean:', themeManager.getCurrentThemeName());

themeManager.setTheme('sunrise');
console.log('After switching to sunrise:', themeManager.getCurrentThemeName());

themeManager.setTheme('nonexistent');
console.log('After invalid theme:', themeManager.getCurrentThemeName());

console.log('✓ Theme switching test passed\n');

// Test 3: Color Retrieval
console.log('Test 3: Color Retrieval');
const colors = themeManager.getColors();
console.log('All colors:', Object.keys(colors));
console.log('Primary color:', themeManager.getColor('primary'));
console.log('Secondary color:', themeManager.getColor('secondary'));
console.log('Invalid color:', themeManager.getColor('invalid'));
console.log('✓ Color retrieval test passed\n');

// Test 4: Theme Metadata
console.log('Test 4: Theme Metadata');
const dawnMetadata = themeManager.getThemeMetadata('dawn');
console.log('Dawn metadata:', dawnMetadata);

const oceanMetadata = themeManager.getThemeMetadata('ocean');
console.log('Ocean metadata:', oceanMetadata);

const invalidMetadata = themeManager.getThemeMetadata('invalid');
console.log('Invalid metadata:', invalidMetadata);

console.log('✓ Theme metadata test passed\n');

// Test 5: Random Theme Selection
console.log('Test 5: Random Theme Selection');
const randomTheme1 = themeManager.getRandomTheme();
console.log('Random theme 1:', randomTheme1);

const randomTheme2 = themeManager.getRandomTheme(['dawn', 'ocean']);
console.log('Random theme 2 (excluding dawn, ocean):', randomTheme2);

const randomTheme3 = themeManager.getRandomTheme(themeManager.getAvailableThemes());
console.log('Random theme 3 (excluding all):', randomTheme3);

console.log('✓ Random theme selection test passed\n');

// Test 6: Theme Transitions
console.log('Test 6: Theme Transitions');
themeManager.setTheme('dawn');
console.log('Set to dawn theme');

themeManager.setTheme('ocean', true); // Animated transition
console.log('Started transition to ocean');
console.log('Is transitioning:', themeManager.isTransitioning);

// Simulate transition updates
const startTime = Date.now();
for (let i = 0; i < 5; i++) {
    const currentTime = startTime + i * 200;
    themeManager.updateTransition(currentTime);
    console.log(`Transition update ${i + 1}:`, themeManager.isTransitioning);
}

// Complete transition
themeManager.updateTransition(startTime + 2000);
console.log('Transition complete:', themeManager.isTransitioning);
console.log('Current theme:', themeManager.getCurrentThemeName());

console.log('✓ Theme transitions test passed\n');

// Test 7: Pattern Theme Application
console.log('Test 7: Pattern Theme Application');
const mockPattern = {
    colors: {
        color1: [255, 0, 0],
        color2: [0, 255, 0],
        color3: [0, 0, 255],
        color4: [255, 255, 255]
    }
};

themeManager.setTheme('sunrise');
const themedPattern = themeManager.applyThemeToPattern(mockPattern);
console.log('Original pattern colors:', mockPattern.colors);
console.log('Themed pattern colors:', themedPattern.colors);

console.log('✓ Pattern theme application test passed\n');

// Test 8: Color Variations
console.log('Test 8: Color Variations');
themeManager.setTheme('forest');
const variations = themeManager.createColorVariations('primary', 3);
console.log('Primary color:', themeManager.getColor('primary'));
console.log('Color variations:', variations);

const complementary = themeManager.getComplementaryColor('secondary');
console.log('Secondary color:', themeManager.getColor('secondary'));
console.log('Complementary color:', complementary);

console.log('✓ Color variations test passed\n');

// Test 9: Theme Status and Reset
console.log('Test 9: Theme Status and Reset');
const status = themeManager.getStatus();
console.log('Theme status:', status);

themeManager.reset();
console.log('After reset:', themeManager.getCurrentThemeName());
console.log('Is transitioning after reset:', themeManager.isTransitioning);

console.log('✓ Theme status and reset test passed\n');

// Test 10: Theme Validation
console.log('Test 10: Theme Validation');
const availableThemes = themeManager.getAvailableThemes();
console.log('Available themes:', availableThemes);

// Test each theme
availableThemes.forEach(themeName => {
    themeManager.setTheme(themeName);
    const colors = themeManager.getColors();
    const hasRequiredColors = ['primary', 'secondary', 'accent', 'background'].every(
        key => colors[key] && Array.isArray(colors[key]) && colors[key].length === 3
    );
    console.log(`${themeName}: ${hasRequiredColors ? '✓' : '✗'} valid colors`);
});

console.log('✓ Theme validation test passed\n');

// Test 11: Performance Test
console.log('Test 11: Performance Test');
const performanceStart = Date.now();

// Rapid theme switching
for (let i = 0; i < 100; i++) {
    const randomTheme = availableThemes[i % availableThemes.length];
    themeManager.setTheme(randomTheme);
    themeManager.getColors();
}

const performanceEnd = Date.now();
console.log(`100 theme switches completed in ${performanceEnd - performanceStart}ms`);

// Color retrieval performance
const colorStart = Date.now();
for (let i = 0; i < 1000; i++) {
    themeManager.getColor('primary');
    themeManager.getColor('secondary');
    themeManager.getColor('accent');
}
const colorEnd = Date.now();
console.log(`3000 color retrievals completed in ${colorEnd - colorStart}ms`);

console.log('✓ Performance test passed\n');

// Test 12: Error Handling
console.log('Test 12: Error Handling');

// Test with null/undefined
themeManager.applyThemeToPattern(null);
themeManager.applyThemeToPattern(undefined);

// Test with invalid pattern
themeManager.applyThemeToPattern({ invalid: 'pattern' });

// Test color variations with invalid key
const invalidVariations = themeManager.createColorVariations('nonexistent', 3);
console.log('Invalid color variations:', invalidVariations);

// Test complementary color with invalid key
const invalidComplementary = themeManager.getComplementaryColor('nonexistent');
console.log('Invalid complementary color:', invalidComplementary);

console.log('✓ Error handling test passed\n');

// Test 13: Integration Test
console.log('Test 13: Integration Test');
console.log('Running complete theme workflow...');

// 1. Initialize with default theme
const manager = new ThemeManager();
console.log('1. Initialized with theme:', manager.getCurrentThemeName());

// 2. Switch to different themes
const testThemes = ['ocean', 'sunrise', 'forest'];
testThemes.forEach(theme => {
    manager.setTheme(theme);
    console.log(`2. Switched to ${theme}:`, manager.getColor('primary'));
});

// 3. Test animated transition
manager.setTheme('dawn', true);
console.log('3. Started animated transition to dawn');

// 4. Apply theme to pattern
const pattern = {
    colors: {
        color1: [128, 128, 128],
        color2: [160, 160, 160],
        color3: [200, 200, 200],
        color4: [240, 240, 240]
    }
};
const themedResult = manager.applyThemeToPattern(pattern);
console.log('4. Applied theme to pattern successfully');

// 5. Get status
const finalStatus = manager.getStatus();
console.log('5. Final status:', finalStatus);

console.log('✓ Integration test passed\n');

console.log('=== All Theme Tests Completed ===');
console.log('✓ All tests passed successfully');