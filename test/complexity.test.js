/**
 * complexity.test.js - Pattern Complexity Testing
 * 
 * Tests for pattern complexity calculation across all patterns
 * Created as per TASK PRP Phase 2 requirements
 */

import { GentlePattern } from '../src/patterns/GentlePattern.js';
import { MandalaPattern } from '../src/patterns/MandalaPattern.js';
import { VectorFieldPattern } from '../src/patterns/VectorFieldPattern.js';
import { ShellRidgePattern } from '../src/patterns/ShellRidgePattern.js';
import { Q5App } from '../src/core/Q5App-minimal.js';
import { TokenMetadata } from '../src/core/TokenMetadata.js';

/**
 * Test complexity calculation for all patterns
 */
function runComplexityTests() {
    console.log('Starting Pattern Complexity Tests...\n');
    
    let testsPass = 0;
    let totalTests = 0;
    
    // Test 1: Gentle Pattern Complexity
    console.log('=== Testing Gentle Pattern Complexity ===');
    try {
        const gentlePattern = new GentlePattern();
        
        // Test with default parameters
        const defaultComplexity = gentlePattern.calculateComplexity();
        console.log(`Default complexity: ${defaultComplexity}`);
        assert(typeof defaultComplexity === 'number', 'Default complexity should be a number');
        assert(defaultComplexity >= 1 && defaultComplexity <= 100, 'Complexity should be between 1-100');
        testsPass++; totalTests++;
        
        // Test with high density parameters
        const highDensity = gentlePattern.calculateComplexity({ lineDensity: 80, wavelength: 10 });
        console.log(`High density complexity: ${highDensity}`);
        assert(highDensity > defaultComplexity, 'Higher density should increase complexity');
        testsPass++; totalTests++;
        
        // Test with low density parameters
        const lowDensity = gentlePattern.calculateComplexity({ lineDensity: 10, wavelength: 80 });
        console.log(`Low density complexity: ${lowDensity}`);
        assert(lowDensity < defaultComplexity, 'Lower density should decrease complexity');
        testsPass++; totalTests++;
        
        console.log('✓ Gentle Pattern tests passed\n');
    } catch (error) {
        console.error('✗ Gentle Pattern test failed:', error.message);
        totalTests += 3;
    }
    
    // Test 2: Mandala Pattern Complexity
    console.log('=== Testing Mandala Pattern Complexity ===');
    try {
        const mandalaPattern = new MandalaPattern();
        
        // Test with default parameters
        const defaultComplexity = mandalaPattern.calculateComplexity();
        console.log(`Default complexity: ${defaultComplexity}`);
        assert(typeof defaultComplexity === 'number', 'Default complexity should be a number');
        assert(defaultComplexity >= 1 && defaultComplexity <= 100, 'Complexity should be between 1-100');
        testsPass++; totalTests++;
        
        // Test with high complexity parameters
        const highComplexity = mandalaPattern.calculateComplexity({ mandalaComplexity: 15, mandalaSpeed: 2.5 });
        console.log(`High complexity: ${highComplexity}`);
        assert(highComplexity > defaultComplexity, 'Higher complexity should increase score');
        testsPass++; totalTests++;
        
        // Test with low complexity parameters
        const lowComplexity = mandalaPattern.calculateComplexity({ mandalaComplexity: 2, mandalaSpeed: 0.5 });
        console.log(`Low complexity: ${lowComplexity}`);
        assert(lowComplexity < defaultComplexity, 'Lower complexity should decrease score');
        testsPass++; totalTests++;
        
        console.log('✓ Mandala Pattern tests passed\n');
    } catch (error) {
        console.error('✗ Mandala Pattern test failed:', error.message);
        totalTests += 3;
    }
    
    // Test 3: Vector Field Pattern Complexity
    console.log('=== Testing Vector Field Pattern Complexity ===');
    try {
        const vectorFieldPattern = new VectorFieldPattern();
        
        // Test with default parameters
        const defaultComplexity = vectorFieldPattern.calculateComplexity();
        console.log(`Default complexity: ${defaultComplexity}`);
        assert(typeof defaultComplexity === 'number', 'Default complexity should be a number');
        assert(defaultComplexity >= 1 && defaultComplexity <= 100, 'Complexity should be between 1-100');
        testsPass++; totalTests++;
        
        // Test with small tile size (more complex)
        const smallTileComplexity = vectorFieldPattern.calculateComplexity({ tileSize: 20, tileShiftAmplitude: 15 });
        console.log(`Small tile complexity: ${smallTileComplexity}`);
        assert(smallTileComplexity > defaultComplexity, 'Smaller tiles should increase complexity');
        testsPass++; totalTests++;
        
        // Test with large tile size (less complex)
        const largeTileComplexity = vectorFieldPattern.calculateComplexity({ tileSize: 100, tileShiftAmplitude: 5 });
        console.log(`Large tile complexity: ${largeTileComplexity}`);
        assert(largeTileComplexity < defaultComplexity, 'Larger tiles should decrease complexity');
        testsPass++; totalTests++;
        
        console.log('✓ Vector Field Pattern tests passed\n');
    } catch (error) {
        console.error('✗ Vector Field Pattern test failed:', error.message);
        totalTests += 3;
    }
    
    // Test 4: Shell Ridge Pattern Complexity
    console.log('=== Testing Shell Ridge Pattern Complexity ===');
    try {
        const shellRidgePattern = new ShellRidgePattern();
        
        // Test with default parameters
        const defaultComplexity = shellRidgePattern.calculateComplexity();
        console.log(`Default complexity: ${defaultComplexity}`);
        assert(typeof defaultComplexity === 'number', 'Default complexity should be a number');
        assert(defaultComplexity >= 1 && defaultComplexity <= 100, 'Complexity should be between 1-100');
        testsPass++; totalTests++;
        
        // Test with many rings and high distortion
        const highComplexity = shellRidgePattern.calculateComplexity({ shellRidgeRings: 40, shellRidgeDistortion: 12 });
        console.log(`High complexity: ${highComplexity}`);
        assert(highComplexity > defaultComplexity, 'More rings and distortion should increase complexity');
        testsPass++; totalTests++;
        
        // Test with few rings and low distortion
        const lowComplexity = shellRidgePattern.calculateComplexity({ shellRidgeRings: 10, shellRidgeDistortion: 3 });
        console.log(`Low complexity: ${lowComplexity}`);
        assert(lowComplexity < defaultComplexity, 'Fewer rings and distortion should decrease complexity');
        testsPass++; totalTests++;
        
        console.log('✓ Shell Ridge Pattern tests passed\n');
    } catch (error) {
        console.error('✗ Shell Ridge Pattern test failed:', error.message);
        totalTests += 3;
    }
    
    // Test 5: Interference Pattern Complexity (via Q5App)
    console.log('=== Testing Interference Pattern Complexity ===');
    try {
        const app = new Q5App();
        
        // Test with default parameters
        const defaultComplexity = app.calculateInterferenceComplexity();
        console.log(`Default complexity: ${defaultComplexity}`);
        assert(typeof defaultComplexity === 'number', 'Default complexity should be a number');
        assert(defaultComplexity >= 1 && defaultComplexity <= 100, 'Complexity should be between 1-100');
        testsPass++; totalTests++;
        
        // Test with many sources
        const manySources = app.calculateInterferenceComplexity({ sourceCount: 15, wavelength: 15 });
        console.log(`Many sources complexity: ${manySources}`);
        assert(manySources > defaultComplexity, 'More sources should increase complexity');
        testsPass++; totalTests++;
        
        // Test with few sources
        const fewSources = app.calculateInterferenceComplexity({ sourceCount: 3, wavelength: 60 });
        console.log(`Few sources complexity: ${fewSources}`);
        assert(fewSources < defaultComplexity, 'Fewer sources should decrease complexity');
        testsPass++; totalTests++;
        
        console.log('✓ Interference Pattern tests passed\n');
    } catch (error) {
        console.error('✗ Interference Pattern test failed:', error.message);
        totalTests += 3;
    }
    
    // Test 6: Token Metadata Integration
    console.log('=== Testing Token Metadata Integration ===');
    try {
        // Test gentle pattern metadata
        const gentleComplexity = TokenMetadata.calculateComplexity('gentle', { lineDensity: 50, wavelength: 20 });
        console.log(`Gentle metadata complexity: ${gentleComplexity}`);
        assert(['Low', 'Medium', 'High', 'Very High'].includes(gentleComplexity), 'Should return valid complexity string');
        testsPass++; totalTests++;
        
        // Test mandala pattern metadata
        const mandalaComplexity = TokenMetadata.calculateComplexity('mandala', { mandalaComplexity: 12 });
        console.log(`Mandala metadata complexity: ${mandalaComplexity}`);
        assert(['Low', 'Medium', 'High', 'Very High'].includes(mandalaComplexity), 'Should return valid complexity string');
        testsPass++; totalTests++;
        
        // Test unknown pattern fallback
        const unknownComplexity = TokenMetadata.calculateComplexity('unknown', { param1: 50 });
        console.log(`Unknown pattern complexity: ${unknownComplexity}`);
        assert(['Low', 'Medium', 'High', 'Very High'].includes(unknownComplexity), 'Should handle unknown patterns gracefully');
        testsPass++; totalTests++;
        
        console.log('✓ Token Metadata tests passed\n');
    } catch (error) {
        console.error('✗ Token Metadata test failed:', error.message);
        totalTests += 3;
    }
    
    // Results summary
    console.log('=== Test Results ===');
    console.log(`Tests passed: ${testsPass}/${totalTests}`);
    console.log(`Success rate: ${((testsPass / totalTests) * 100).toFixed(1)}%`);
    
    if (testsPass === totalTests) {
        console.log('🎉 All complexity tests passed!');
        return true;
    } else {
        console.log('❌ Some complexity tests failed');
        return false;
    }
}

/**
 * Simple assertion helper
 */
function assert(condition, message) {
    if (!condition) {
        throw new Error(`Assertion failed: ${message}`);
    }
}

/**
 * Run performance test on complexity calculations
 */
function runPerformanceTest() {
    console.log('\n=== Performance Test ===');
    
    const gentlePattern = new GentlePattern();
    const iterations = 1000;
    
    const startTime = performance.now();
    
    for (let i = 0; i < iterations; i++) {
        gentlePattern.calculateComplexity({
            lineDensity: Math.random() * 100,
            wavelength: Math.random() * 100
        });
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    const avgTime = duration / iterations;
    
    console.log(`Performed ${iterations} complexity calculations`);
    console.log(`Total time: ${duration.toFixed(2)}ms`);
    console.log(`Average time per calculation: ${avgTime.toFixed(4)}ms`);
    
    if (avgTime < 1) {
        console.log('✓ Performance test passed (< 1ms per calculation)');
        return true;
    } else {
        console.log('❌ Performance test failed (> 1ms per calculation)');
        return false;
    }
}

/**
 * Main test runner
 */
export function runComplexityTestSuite() {
    console.log('Pattern Complexity Test Suite\n');
    console.log('=============================\n');
    
    const functionalTestsPass = runComplexityTests();
    const performanceTestsPass = runPerformanceTest();
    
    const allTestsPass = functionalTestsPass && performanceTestsPass;
    
    console.log('\n=== Final Results ===');
    if (allTestsPass) {
        console.log('🎉 All complexity tests completed successfully!');
        console.log('The pattern complexity system is working correctly.');
    } else {
        console.log('❌ Some tests failed. Please review the output above.');
    }
    
    return allTestsPass;
}

// Export for use in other test files
export { runComplexityTests, runPerformanceTest };

// If running directly in Node.js
if (typeof window === 'undefined' && typeof process !== 'undefined') {
    runComplexityTestSuite();
}