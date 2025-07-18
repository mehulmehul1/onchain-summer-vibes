/**
 * Test suite for ContourInterferencePattern
 */

import { ContourInterferencePattern } from '../src/patterns/ContourInterferencePattern.js';

describe('ContourInterferencePattern', () => {
    let pattern;
    
    beforeEach(() => {
        pattern = new ContourInterferencePattern();
        // Mock canvas
        global.width = 800;
        global.height = 600;
    });

    test('initialization creates wave sources correctly', () => {
        pattern.initialize();
        
        // Check central source
        expect(pattern.sources[0]).toEqual({
            x: 400, // width/2
            y: 300, // height/2
            wavelength: 25,
            phase: 0,
            amplitude: 1.5
        });

        // Check number of sources
        const totalSources = 1 + (pattern.parameters.numRings * pattern.parameters.sourcesPerRing);
        expect(pattern.sources.length).toBe(totalSources);
    });

    test('field calculation produces valid values', () => {
        pattern.initialize();
        pattern.updateField(0);

        // Check field dimensions
        const rows = Math.floor(height / pattern.parameters.resolution);
        const cols = Math.floor(width / pattern.parameters.resolution);
        expect(pattern.field.length).toBe(rows);
        expect(pattern.field[0].length).toBe(cols);

        // Check field values are within expected range (-2 to 2)
        let allValid = true;
        pattern.field.forEach(row => {
            row.forEach(value => {
                if (value < -2 || value > 2 || isNaN(value)) {
                    allValid = false;
                }
            });
        });
        expect(allValid).toBe(true);
    });

    test('complexity calculation scales with parameters', () => {
        const lowComplexity = pattern.calculateComplexity({
            resolution: 6,
            numRings: 1,
            sourcesPerRing: 4
        });

        const highComplexity = pattern.calculateComplexity({
            resolution: 2,
            numRings: 4,
            sourcesPerRing: 12
        });

        expect(highComplexity).toBeGreaterThan(lowComplexity);
        expect(lowComplexity).toBeGreaterThanOrEqual(1);
        expect(highComplexity).toBeLessThanOrEqual(10);
    });

    test('performance meets target frame time', () => {
        pattern.initialize();
        
        const startTime = performance.now();
        pattern.renderPattern(0);
        const endTime = performance.now();
        
        const frameTime = endTime - startTime;
        expect(frameTime).toBeLessThan(16); // Target: 60fps = 16.67ms
    });
});
