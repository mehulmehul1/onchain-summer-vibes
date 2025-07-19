/**
 * PatternFactory.js - Pattern Factory with WebGPU Optimizations
 * 
 * Implements pattern factory with WebGPU optimizations for q5.js
 */

import { PatternRenderer } from './PatternRenderer.js';
import { ContourInterferencePattern } from './ContourInterferencePattern.js';
import { GentlePattern } from './GentlePattern.js';
import { MandalaPattern } from './MandalaPattern.js';
import { VectorFieldPattern } from './VectorFieldPattern.js';
import { ShellRidgePattern } from './ShellRidgePattern.js';
import { PATTERN_TYPES } from '../constants/patternConfig.js';

export class PatternFactory {
    constructor() {
        this.registeredPatterns = new Map();
        this.patternInstances = new Map();
        this.webgpuSupported = false;
        this.activePattern = null;
        this.defaultConfig = {
            webgpuAcceleration: true,
            pixelDensity: 1,
            maxInstances: 10,
            enableCaching: true
        };
    }

    /**
     * Initialize pattern factory
     * @param {Object} config - Configuration options
     */
    async initialize(config = {}) {
        try {
            this.config = { ...this.defaultConfig, ...config };
            
            // Check WebGPU support
            this.webgpuSupported = await this.checkWebGPUSupport();
            
            // Register default patterns
            this.registerDefaultPatterns();
            
            console.log('Pattern factory initialized');
            console.log('WebGPU supported:', this.webgpuSupported);
            
            return true;
        } catch (error) {
            console.error('Failed to initialize pattern factory:', error);
            return false;
        }
    }

    /**
     * Check WebGPU support
     * @returns {boolean} - True if WebGPU is supported
     */
    async checkWebGPUSupport() {
        if (!navigator.gpu) {
            return false;
        }
        
        try {
            const adapter = await navigator.gpu.requestAdapter();
            return adapter !== null;
        } catch (error) {
            console.warn('WebGPU check failed:', error);
            return false;
        }
    }

    /**
     * Register a pattern class
     * @param {string} name - Pattern name
     * @param {Class} patternClass - Pattern class constructor
     * @param {Object} metadata - Pattern metadata
     */
    registerPattern(name, patternClass, metadata = {}) {
        if (!name || !patternClass) {
            throw new Error('Pattern name and class are required');
        }
        
        const patternInfo = {
            name,
            class: patternClass,
            metadata: {
                description: metadata.description || '',
                category: metadata.category || 'general',
                complexity: metadata.complexity || 'medium',
                webgpuOptimized: metadata.webgpuOptimized || false,
                defaultParams: metadata.defaultParams || {},
                ...metadata
            }
        };
        
        this.registeredPatterns.set(name, patternInfo);
        console.log(`Pattern registered: ${name}`);
    }

    /**
     * Create pattern instance
     * @param {string} name - Pattern name
     * @param {Object} options - Pattern options
     * @returns {PatternRenderer} - Pattern instance
     */
    createPattern(name, options = {}) {
        const patternInfo = this.registeredPatterns.get(name);
        
        if (!patternInfo) {
            throw new Error(`Pattern '${name}' not found`);
        }
        
        try {
            // Check if we should use cached instance
            if (this.config.enableCaching && this.patternInstances.has(name)) {
                const cachedInstance = this.patternInstances.get(name);
                cachedInstance.updateParameters(options);
                return cachedInstance;
            }
            
            // Create new instance
            const PatternClass = patternInfo.class;
            const instance = new PatternClass(name);
            
            // Apply WebGPU optimizations if supported
            if (this.webgpuSupported && patternInfo.metadata.webgpuOptimized) {
                instance.enableWebGPU = true;
                this.applyWebGPUOptimizations(instance);
            }
            
            // Initialize with merged options
            const initOptions = {
                ...patternInfo.metadata.defaultParams,
                ...options
            };
            
            instance.initialize(initOptions);
            
            // Cache instance if enabled
            if (this.config.enableCaching) {
                this.patternInstances.set(name, instance);
            }
            
            return instance;
            
        } catch (error) {
            console.error(`Failed to create pattern '${name}':`, error);
            throw error;
        }
    }

    /**
     * Apply WebGPU optimizations to pattern
     * @param {PatternRenderer} pattern - Pattern instance
     */
    applyWebGPUOptimizations(pattern) {
        try {
            // Add WebGPU-specific methods and properties
            pattern.webgpuEnabled = true;
            pattern.useGPUCompute = true;
            
            // Override render method for WebGPU
            const originalRender = pattern.render.bind(pattern);
            pattern.render = (time, params) => {
                if (this.webgpuSupported && pattern.webgpuEnabled) {
                    return this.renderWithWebGPU(pattern, time, params);
                } else {
                    return originalRender(time, params);
                }
            };
            
            console.log(`WebGPU optimizations applied to ${pattern.name}`);
            
        } catch (error) {
            console.error('Failed to apply WebGPU optimizations:', error);
            pattern.webgpuEnabled = false;
        }
    }

    /**
     * Render pattern with WebGPU acceleration
     * @param {PatternRenderer} pattern - Pattern instance
     * @param {number} time - Current time
     * @param {Object} params - Parameters
     */
    renderWithWebGPU(pattern, time, params) {
        try {
            // For now, fall back to regular rendering
            // This is where WebGPU compute shader integration would go
            console.log(`WebGPU rendering for ${pattern.name} (fallback to CPU)`);
            
            // Call original render method
            return pattern.renderPattern(time, params);
            
        } catch (error) {
            console.error('WebGPU rendering failed, falling back to CPU:', error);
            pattern.webgpuEnabled = false;
            return pattern.renderPattern(time, params);
        }
    }

    /**
     * Get pattern by name
     * @param {string} name - Pattern name
     * @returns {PatternRenderer|null} - Pattern instance or null
     */
    getPattern(name) {
        return this.patternInstances.get(name) || null;
    }

    /**
     * Get all registered pattern names
     * @returns {Array} - Array of pattern names
     */
    getPatternNames() {
        return Array.from(this.registeredPatterns.keys());
    }

    /**
     * Get pattern metadata
     * @param {string} name - Pattern name
     * @returns {Object|null} - Pattern metadata or null
     */
    getPatternMetadata(name) {
        const patternInfo = this.registeredPatterns.get(name);
        return patternInfo ? patternInfo.metadata : null;
    }

    /**
     * Set active pattern
     * @param {string} name - Pattern name
     * @param {Object} options - Pattern options
     * @returns {PatternRenderer} - Active pattern instance
     */
    setActivePattern(name, options = {}) {
        try {
            this.activePattern = this.createPattern(name, options);
            console.log(`Active pattern set to: ${name}`);
            return this.activePattern;
        } catch (error) {
            console.error(`Failed to set active pattern '${name}':`, error);
            throw error;
        }
    }

    /**
     * Get active pattern
     * @returns {PatternRenderer|null} - Active pattern instance
     */
    getActivePattern() {
        return this.activePattern;
    }

    /**
     * Render active pattern
     * @param {number} time - Current time
     * @param {Object} params - Parameters
     */
    renderActivePattern(time, params = {}) {
        if (!this.activePattern) {
            console.warn('No active pattern to render');
            return;
        }
        
        try {
            this.activePattern.render(time, params);
        } catch (error) {
            console.error('Failed to render active pattern:', error);
        }
    }

    /**
     * Clear pattern cache
     */
    clearCache() {
        this.patternInstances.forEach(pattern => {
            if (pattern.cleanup) {
                pattern.cleanup();
            }
        });
        
        this.patternInstances.clear();
        console.log('Pattern cache cleared');
    }

    /**
     * Register default patterns
     */
    registerDefaultPatterns() {
        // Register basic pattern renderer
        this.registerPattern('base', PatternRenderer, {
            description: 'Base pattern renderer',
            category: 'utility',
            complexity: 'low',
            webgpuOptimized: false
        });
        
        // Register ContourInterference pattern
        this.registerPattern('ContourInterference', ContourInterferencePattern, {
            description: 'Wave interference visualization using marching squares algorithm',
            category: 'waves',
            complexity: 'high',
            webgpuOptimized: true,
            defaultParams: {
                resolution: 3,
                numRings: 2,
                sourcesPerRing: 6,
                animationSpeed: 0.0015,
                lineWidth: 0.8,
                lineColor: '#333333',
                backgroundColor: '#F0EEE6'
            }
        });
        
        // Register Gentle pattern
        this.registerPattern(PATTERN_TYPES.GENTLE, GentlePattern, {
            description: 'Flowing sinusoidal lines pattern',
            category: 'waves',
            complexity: 'medium',
            webgpuOptimized: false,
            defaultParams: {
                wavelength: 25,
                lineDensity: 35,
                speed: 0.018
            }
        });

        // Register Mandala pattern
        this.registerPattern(PATTERN_TYPES.MANDALA, MandalaPattern, {
            description: 'Geometric mandala with breathing animations',
            category: 'geometric',
            complexity: 'medium',
            webgpuOptimized: false,
            defaultParams: {
                mandalaComplexity: 6,
                mandalaSpeed: 1.0
            }
        });

        // Register Vector Field pattern
        this.registerPattern(PATTERN_TYPES.VECTOR_FIELD, VectorFieldPattern, {
            description: 'Particle flow following vector fields',
            category: 'particles',
            complexity: 'high',
            webgpuOptimized: false,
            defaultParams: {
                tileSize: 55,
                tileShiftAmplitude: 10
            }
        });

        // Register Shell Ridge pattern
        this.registerPattern(PATTERN_TYPES.SHELL_RIDGE, ShellRidgePattern, {
            description: 'Concentric shell-like ridges with breathing effects',
            category: 'geometric',
            complexity: 'medium',
            webgpuOptimized: false,
            defaultParams: {
                shellRidgeRings: 25,
                shellRidgeDistortion: 8
            }
        });

        // Register test pattern
        this.registerPattern('test', class TestPattern extends PatternRenderer {
            constructor(name) {
                super(name || 'TestPattern');
            }
            
            renderPattern(time) {
                const currentWidth = width || 800;
                const currentHeight = height || 600;
                
                for (let y = 0; y < currentHeight; y++) {
                    for (let x = 0; x < currentWidth; x++) {
                        const index = (y * currentWidth + x) * 4;
                        const wave = Math.sin(time + x * 0.01) * 0.5 + 0.5;
                        
                        if (pixels && pixels.length > index + 3) {
                            pixels[index] = Math.floor(wave * 255);
                            pixels[index + 1] = Math.floor(wave * 128);
                            pixels[index + 2] = Math.floor(wave * 64);
                            pixels[index + 3] = 255;
                        }
                    }
                }
            }
        }, {
            description: 'Test pattern with animated wave',
            category: 'test',
            complexity: 'low',
            webgpuOptimized: true
        });
    }

    /**
     * Get factory status
     * @returns {Object} - Factory status information
     */
    getStatus() {
        return {
            registeredPatterns: this.registeredPatterns.size,
            cachedInstances: this.patternInstances.size,
            webgpuSupported: this.webgpuSupported,
            activePattern: this.activePattern ? this.activePattern.name : null,
            config: this.config
        };
    }

    /**
     * Cleanup factory resources
     */
    cleanup() {
        this.clearCache();
        this.activePattern = null;
        this.registeredPatterns.clear();
        console.log('Pattern factory cleaned up');
    }
}

// Export default instance
export default new PatternFactory();