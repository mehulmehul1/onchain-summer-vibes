/**
 * Theme System Validation Script
 * Tests all 8 themes and rarity distribution
 */

import { THEME_PRESETS, THEME_RARITY } from '../src/constants/patternConfig.js';

console.log('=== THEME SYSTEM VALIDATION ===\n');

// Test 1: Verify all 8 themes exist
console.log('1. Testing theme definitions...');
const expectedThemes = ['dawn', 'ocean', 'forest', 'sunrise', 'sunset', 'midnight', 'monochrome', 'neon', 'pastel'];
const actualThemes = Object.keys(THEME_PRESETS);

console.log(`Expected: ${expectedThemes.length} themes`);
console.log(`Actual: ${actualThemes.length} themes`);

expectedThemes.forEach(theme => {
    if (THEME_PRESETS[theme]) {
        const themeData = THEME_PRESETS[theme];
        console.log(`✓ ${theme}: ${themeData.rarity} (weight: ${themeData.weight})`);
    } else {
        console.log(`✗ Missing theme: ${theme}`);
    }
});

// Test 2: Verify rarity distribution
console.log('\n2. Testing rarity distribution...');
const rarityTotals = {};
Object.values(THEME_PRESETS).forEach(theme => {
    if (!rarityTotals[theme.rarity]) {
        rarityTotals[theme.rarity] = 0;
    }
    rarityTotals[theme.rarity] += theme.weight;
});

console.log('Rarity weight totals:');
Object.entries(rarityTotals).forEach(([rarity, total]) => {
    const expected = THEME_RARITY[rarity].weight;
    console.log(`${rarity}: ${total} (expected: ${expected}) ${total === expected ? '✓' : '✗'}`);
});

// Test 3: Test theme selection function
console.log('\n3. Testing theme selection function...');

function selectThemeByRarity() {
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (const [rarity, config] of Object.entries(THEME_RARITY)) {
        cumulative += config.weight;
        if (random <= cumulative) {
            const themes = config.themes;
            return themes[Math.floor(Math.random() * themes.length)];
        }
    }
    return 'dawn'; // fallback
}

// Run selection test
const testRuns = 1000;
const results = {};
expectedThemes.forEach(theme => results[theme] = 0);

for (let i = 0; i < testRuns; i++) {
    const selected = selectThemeByRarity();
    results[selected]++;
}

console.log(`Theme selection results (${testRuns} runs):`);
Object.entries(results).forEach(([theme, count]) => {
    const percentage = (count / testRuns * 100).toFixed(1);
    const rarity = THEME_PRESETS[theme].rarity;
    console.log(`${theme} (${rarity}): ${count} times (${percentage}%)`);
});

// Test 4: Verify color format
console.log('\n4. Testing color formats...');
let colorErrors = 0;
Object.entries(THEME_PRESETS).forEach(([theme, data]) => {
    ['color1', 'color2', 'color3', 'color4'].forEach(colorKey => {
        const color = data[colorKey];
        if (!/^#[0-9A-F]{6}$/i.test(color)) {
            console.log(`✗ Invalid color format in ${theme}.${colorKey}: ${color}`);
            colorErrors++;
        }
    });
});

if (colorErrors === 0) {
    console.log('✓ All colors have valid hex format');
} else {
    console.log(`✗ Found ${colorErrors} color format errors`);
}

console.log('\n=== VALIDATION COMPLETE ===');