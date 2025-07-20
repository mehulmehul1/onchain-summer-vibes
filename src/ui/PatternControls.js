/**
 * PatternControls.js - Pattern-Specific Controls
 * 
 * JavaScript implementation of pattern controls with dynamic UI
 * Based on the original React TypeScript PatternControls component
 */

import { PATTERN_TYPES, DEFAULT_VALUES } from '../constants/patternConfig.js';

export class PatternControls {
    constructor(app) {
        this.app = app;
        this.element = null;
        this.currentPattern = PATTERN_TYPES.INTERFERENCE;
        this.controls = {};
        
        this.initializeUI();
        this.bindEvents();
        
        console.log('PatternControls initialized');
    }
    
    /**
     * Initialize the UI elements
     */
    initializeUI() {
        this.element = document.createElement('div');
        this.element.className = 'pattern-controls';
        
        // Create pattern type selector
        this.createPatternSelector();
        
        // Create parameter controls
        this.createParameterControls();
        
        // Apply styles
        this.applyStyles();
        
        // Update initial state
        this.updateControlsVisibility();
    }
    
    /**
     * Create pattern type selector buttons
     */
    createPatternSelector() {
        const selectorContainer = document.createElement('div');
        selectorContainer.className = 'pattern-selector';
        
        const patterns = [
            { type: PATTERN_TYPES.INTERFERENCE, label: 'Interference', emoji: '🌊' },
            { type: PATTERN_TYPES.GENTLE, label: 'Gentle', emoji: '🌸' },
            { type: PATTERN_TYPES.MANDALA, label: 'Mandala', emoji: '🔮' },
            { type: PATTERN_TYPES.VECTOR_FIELD, label: 'Vector Field', emoji: '🌀' },
            { type: PATTERN_TYPES.SHELL_RIDGE, label: 'Shell Ridge', emoji: '🐚' },
            { type: PATTERN_TYPES.CONTOUR_INTERFERENCE, label: 'Contour Interference', emoji: '🎯' },
            { type: PATTERN_TYPES.RADIAL_GROWTH, label: 'Radial Growth', emoji: '🍄' },
            { type: PATTERN_TYPES.RISO_PRINT, label: 'RISO Print', emoji: '🖨️' },
            { type: PATTERN_TYPES.FLAME, label: 'Flame', emoji: '🔥' }
        ];
        
        patterns.forEach(pattern => {
            const button = document.createElement('button');
            button.className = 'pattern-button';
            button.innerHTML = `${pattern.emoji} ${pattern.label}`;
            button.dataset.pattern = pattern.type;
            button.title = `Switch to ${pattern.label} pattern`;
            
            if (pattern.type === this.currentPattern) {
                button.classList.add('active');
            }
            
            button.addEventListener('click', () => {
                this.selectPattern(pattern.type);
            });
            
            selectorContainer.appendChild(button);
        });
        
        this.element.appendChild(selectorContainer);
    }
    
    /**
     * Create parameter controls
     */
    createParameterControls() {
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'parameter-controls';

        
        // Define all possible controls
        const controlDefinitions = [
            {
                key: 'wavelength',
                label: 'Wavelength',
                type: 'range',
                min: 10,
                max: 100,
                step: 1,
                patterns: [PATTERN_TYPES.INTERFERENCE, PATTERN_TYPES.GENTLE, PATTERN_TYPES.SHELL_RIDGE]
            },
            {
                key: 'speed',
                label: 'Animation Speed',
                type: 'range',
                min: 0.5,
                max: 3,
                step: 0.5,
                patterns: [PATTERN_TYPES.INTERFERENCE, PATTERN_TYPES.GENTLE, PATTERN_TYPES.MANDALA, PATTERN_TYPES.VECTOR_FIELD, PATTERN_TYPES.SHELL_RIDGE, PATTERN_TYPES.CONTOUR_INTERFERENCE]
            },
            {
                key: 'threshold',
                label: 'Threshold',
                type: 'range',
                min: 0.01,
                max: 0.5,
                step: 0.01,
                patterns: [PATTERN_TYPES.INTERFERENCE, PATTERN_TYPES.GENTLE]
            },
            {
                key: 'gradientMode',
                label: 'Gradient Mode',
                type: 'checkbox',
                patterns: [PATTERN_TYPES.INTERFERENCE, PATTERN_TYPES.GENTLE, PATTERN_TYPES.SHELL_RIDGE]
            },
            {
                key: 'sourceCount',
                label: 'Wave Sources',
                type: 'range',
                min: 1,
                max: 20,
                step: 1,
                patterns: [PATTERN_TYPES.INTERFERENCE]
            },
            {
                key: 'lineDensity',
                label: 'Line Density',
                type: 'range',
                min: 10,
                max: 100,
                step: 1,
                patterns: [PATTERN_TYPES.GENTLE]
            },
            {
                key: 'baseLineWidth',
                label: 'Base Line Width',
                type: 'range',
                min: 0.5,
                max: 8.0,
                step: 0.1,
                patterns: [PATTERN_TYPES.GENTLE]
            },
            {
                key: 'lineWidthVariation',
                label: 'Width Variation',
                type: 'range',
                min: 0,
                max: 5.0,
                step: 0.1,
                patterns: [PATTERN_TYPES.GENTLE]
            },
            {
                key: 'visualStyle',
                label: 'Visual Style',
                type: 'select',
                options: ['smooth', 'sketchy', 'glow', 'dotted'],
                patterns: [PATTERN_TYPES.GENTLE]
            },
            {
                key: 'directionInteraction',
                label: 'Direction Mixing',
                type: 'range',
                min: 0,
                max: 100,
                step: 1,
                patterns: [PATTERN_TYPES.GENTLE]
            },
            {
                key: 'textureIntensity',
                label: 'Texture',
                type: 'range',
                min: 0,
                max: 100,
                step: 1,
                patterns: [PATTERN_TYPES.GENTLE]
            },
            {
                key: 'useGradientStrokes',
                label: 'Gradient Strokes',
                type: 'checkbox',
                patterns: [PATTERN_TYPES.GENTLE]
            },
            {
                key: 'mandalaComplexity',
                label: 'Complexity',
                type: 'range',
                min: 2,
                max: 20,
                step: 1,
                patterns: [PATTERN_TYPES.MANDALA]
            },
            {
                key: 'mandalaSpeed',
                label: 'Rotation Speed',
                type: 'range',
                min: 1.0,
                max: 10.0,
                step: 0.5,
                patterns: [PATTERN_TYPES.MANDALA]
            },
            {
                key: 'rotationSpeed',
                label: 'Galaxy Rotation',
                type: 'range',
                min: -2.0,
                max: 2.0,
                step: 0.1,
                patterns: [PATTERN_TYPES.MANDALA]
            },
            {
                key: 'spiralArmFactor',
                label: 'Spiral Arms',
                type: 'range',
                min: -2.0,
                max: 2.0,
                step: 0.1,
                patterns: [PATTERN_TYPES.MANDALA]
            },
            {
                key: 'layerGrowthFactor',
                label: 'Layer Spacing',
                type: 'range',
                min: 0.2,
                max: 1.5,
                step: 0.05,
                patterns: [PATTERN_TYPES.MANDALA]
            },
            {
                key: 'tileSize',
                label: 'Tile Size',
                type: 'range',
                min: 50,
                max: 600,
                step: 30,
                patterns: [PATTERN_TYPES.VECTOR_FIELD]
            },
            {
                key: 'tileShiftAmplitude',
                label: 'Tile Shift',
                type: 'range',
                min: 0,
                max: 50,
                step: 1,
                patterns: [PATTERN_TYPES.VECTOR_FIELD]
            },
            {
                key: 'vectorFieldStrength',
                label: 'Field Strength',
                type: 'range',
                min: 0.1,
                max: 3.0,
                step: 0.1,
                patterns: [PATTERN_TYPES.VECTOR_FIELD]
            },
            {
                key: 'noiseScale',
                label: 'Noise Scale',
                type: 'range',
                min: 0.005,
                max: 0.05,
                step: 0.005,
                patterns: [PATTERN_TYPES.VECTOR_FIELD]
            },
            {
                key: 'flowSpeed',
                label: 'Flow Speed',
                type: 'range',
                min: 0.1,
                max: 2.0,
                step: 0.1,
                patterns: [PATTERN_TYPES.VECTOR_FIELD]
            },
            {
                key: 'lineLifespan',
                label: 'Line Lifespan',
                type: 'range',
                min: 200,
                max: 1500,
                step: 50,
                patterns: [PATTERN_TYPES.VECTOR_FIELD]
            },
            {
                key: 'spawnRadius',
                label: 'Spawn Radius',
                type: 'range',
                min: 30,
                max: 300,
                step: 10,
                patterns: [PATTERN_TYPES.VECTOR_FIELD]
            },
            {
                key: 'vectorFieldType',
                label: 'Field Type',
                type: 'select',
                options: ['radial', 'turbulent', 'spiral', 'grid'],
                patterns: [PATTERN_TYPES.VECTOR_FIELD]
            },
            {
                key: 'colorBlending',
                label: 'Color Blending',
                type: 'select',
                options: ['tile', 'velocity', 'age', 'position'],
                patterns: [PATTERN_TYPES.VECTOR_FIELD]
            },
            {
                key: 'lineOpacity',
                label: 'Line Opacity',
                type: 'range',
                min: 0.1,
                max: 1.0,
                step: 0.1,
                patterns: [PATTERN_TYPES.VECTOR_FIELD]
            },
            {
                key: 'lineThickness',
                label: 'Line Thickness',
                type: 'range',
                min: 0.5,
                max: 10.0,
                step: 0.5,
                patterns: [PATTERN_TYPES.VECTOR_FIELD]
            },
            {
                key: 'numLines',
                label: 'Line Count',
                type: 'range',
                min: 50,
                max: 800,
                step: 50,
                patterns: [PATTERN_TYPES.VECTOR_FIELD]
            },
            {
                key: 'shellRidgeRings',
                label: 'Ridge Rings',
                type: 'range',
                min: 5,
                max: 50,
                step: 1,
                patterns: [PATTERN_TYPES.SHELL_RIDGE]
            },
            {
                key: 'shellRidgeDistortion',
                label: 'Distortion',
                type: 'range',
                min: 1,
                max: 20,
                step: 1,
                patterns: [PATTERN_TYPES.SHELL_RIDGE]
            },
            {
                key: 'resolution',
                label: 'Grid Resolution',
                type: 'range',
                min: 2,
                max: 20,
                step: 0.5,
                patterns: [PATTERN_TYPES.CONTOUR_INTERFERENCE]
            },
            {
                key: 'numRings',
                label: 'Wave Rings',
                type: 'range',
                min: 1,
                max: 15,
                step: 1,
                patterns: [PATTERN_TYPES.CONTOUR_INTERFERENCE]
            },
            {
                key: 'sourcesPerRing',
                label: 'Sources per Ring',
                type: 'range',
                min: 3,
                max: 12,
                step: 1,
                patterns: [PATTERN_TYPES.CONTOUR_INTERFERENCE]
            },
            {
                key: 'lineWidth',
                label: 'Line Width',
                type: 'range',
                min: 0.2,
                max: 2.0,
                step: 0.1,
                patterns: [PATTERN_TYPES.CONTOUR_INTERFERENCE]
            },
            {
                key: 'animationSpeed',
                label: 'Wave Speed',
                type: 'range',
                min: 0.0005,
                max: 0.005,
                step: 0.0001,
                patterns: [PATTERN_TYPES.CONTOUR_INTERFERENCE]
            },
            {
                key: 'wavelengthVariation',
                label: 'Wavelength Variation',
                type: 'range',
                min: 0,
                max: 0.5,
                step: 0.05,
                patterns: [PATTERN_TYPES.CONTOUR_INTERFERENCE]
            },
            {
                key: 'amplitudeDecay',
                label: 'Amplitude Decay',
                type: 'range',
                min: 0.1,
                max: 0.5,
                step: 0.05,
                patterns: [PATTERN_TYPES.CONTOUR_INTERFERENCE]
            },
            {
                key: 'phaseShift',
                label: 'Phase Shift',
                type: 'range',
                min: 0,
                max: 6.28,
                step: 0.1,
                patterns: [PATTERN_TYPES.CONTOUR_INTERFERENCE]
            },
            {
                key: 'dampingFactor',
                label: 'Wave Damping',
                type: 'range',
                min: 0.001,
                max: 0.01,
                step: 0.0005,
                patterns: [PATTERN_TYPES.CONTOUR_INTERFERENCE]
            },
            {
                key: 'contourThickness',
                label: 'Contour Thickness',
                type: 'range',
                min: 0.5,
                max: 2.0,
                step: 0.1,
                patterns: [PATTERN_TYPES.CONTOUR_INTERFERENCE]
            },
            {
                key: 'maxDistance',
                label: 'Wave Range',
                type: 'range',
                min: 200,
                max: 800,
                step: 50,
                patterns: [PATTERN_TYPES.CONTOUR_INTERFERENCE]
            },
            {
                key: 'nonlinearity',
                label: 'Wave Nonlinearity',
                type: 'range',
                min: 0,
                max: 0.3,
                step: 0.01,
                patterns: [PATTERN_TYPES.CONTOUR_INTERFERENCE]
            },
            {
                key: 'contourLevels',
                label: 'Contour Levels',
                type: 'range',
                min: 3,
                max: 9,
                step: 1,
                patterns: [PATTERN_TYPES.CONTOUR_INTERFERENCE]
            },
            {
                key: 'fillRegions',
                label: 'Fill Regions',
                type: 'checkbox',
                patterns: [PATTERN_TYPES.CONTOUR_INTERFERENCE]
            },
            {
                key: 'risoComplexity',
                label: 'RISO Complexity',
                type: 'range',
                min: 2,
                max: 20,
                step: 1,
                patterns: [PATTERN_TYPES.RISO_PRINT]
            },
            {
                key: 'risoSpeed',
                label: 'Animation Speed',
                type: 'range',
                min: 0.1,
                max: 2.0,
                step: 0.1,
                patterns: [PATTERN_TYPES.RISO_PRINT]
            },
            {
                key: 'halftoneSize',
                label: 'Halftone Size',
                type: 'range',
                min: 6,
                max: 30,
                step: 2,
                patterns: [PATTERN_TYPES.RISO_PRINT]
            },
            {
                key: 'gridIrregularity',
                label: 'Grid Irregularity',
                type: 'range',
                min: 0,
                max: 1.0,
                step: 0.05,
                patterns: [PATTERN_TYPES.RISO_PRINT]
            },
            {
                key: 'shapeVariation',
                label: 'Shape Variation',
                type: 'range',
                min: 0,
                max: 1.5,
                step: 0.05,
                patterns: [PATTERN_TYPES.RISO_PRINT]
            },
            {
                key: 'colorSeparation',
                label: 'Color Separation',
                type: 'range',
                min: 0.1,
                max: 0.8,
                step: 0.05,
                patterns: [PATTERN_TYPES.RISO_PRINT]
            },
            {
                key: 'overprint',
                label: 'Overprint Effect',
                type: 'checkbox',
                patterns: [PATTERN_TYPES.RISO_PRINT]
            },
            {
                key: 'dotDensity',
                label: 'Dot Density',
                type: 'range',
                min: 0.2,
                max: 1.0,
                step: 0.05,
                patterns: [PATTERN_TYPES.RISO_PRINT]
            },
            {
                key: 'gridRotation',
                label: 'Grid Rotation',
                type: 'range',
                min: -0.5,
                max: 0.5,
                step: 0.05,
                patterns: [PATTERN_TYPES.RISO_PRINT]
            },
            {
                key: 'printMisregistration',
                label: 'Misregistration',
                type: 'range',
                min: 0,
                max: 5.0,
                step: 0.1,
                patterns: [PATTERN_TYPES.RISO_PRINT]
            },
            {
                key: 'animationSmoothing',
                label: 'Animation Smoothing',
                type: 'range',
                min: 0.1,
                max: 1.0,
                step: 0.1,
                patterns: [PATTERN_TYPES.RISO_PRINT]
            },
            {
                key: 'growthSpeed',
                label: 'Growth Speed',
                type: 'range',
                min: 0.1,
                max: 3.0,
                step: 0.1,
                patterns: [PATTERN_TYPES.RADIAL_GROWTH]
            },
            {
                key: 'spawnRate',
                label: 'Spawn Rate',
                type: 'range',
                min: 10,
                max: 120,
                step: 5,
                patterns: [PATTERN_TYPES.RADIAL_GROWTH]
            },
            {
                key: 'densityVariation',
                label: 'Density Variety',
                type: 'range',
                min: 0.1,
                max: 3.0,
                step: 0.1,
                patterns: [PATTERN_TYPES.RADIAL_GROWTH]
            },
            {
                key: 'sizeVariation',
                label: 'Size Variety',
                type: 'range',
                min: 0.3,
                max: 2.5,
                step: 0.1,
                patterns: [PATTERN_TYPES.RADIAL_GROWTH]
            },
            {
                key: 'irregularity',
                label: 'Organic Irregularity',
                type: 'range',
                min: 0.0,
                max: 1.0,
                step: 0.05,
                patterns: [PATTERN_TYPES.RADIAL_GROWTH]
            },
            {
                key: 'clusterTendency',
                label: 'Clustering',
                type: 'range',
                min: 0.0,
                max: 1.0,
                step: 0.05,
                patterns: [PATTERN_TYPES.RADIAL_GROWTH]
            },
            {
                key: 'centerBias',
                label: 'Center Bias',
                type: 'range',
                min: 0.1,
                max: 1.0,
                step: 0.05,
                patterns: [PATTERN_TYPES.RADIAL_GROWTH]
            },
            {
                key: 'opacity',
                label: 'Opacity',
                type: 'range',
                min: 0.1,
                max: 1.0,
                step: 0.05,
                patterns: [PATTERN_TYPES.RADIAL_GROWTH]
            },
            {
                key: 'lifespan',
                label: 'Lifespan',
                type: 'range',
                min: 0.3,
                max: 3.0,
                step: 0.1,
                patterns: [PATTERN_TYPES.RADIAL_GROWTH]
            },
            {
                key: 'maxColonies',
                label: 'Max Colonies',
                type: 'range',
                min: 10,
                max: 150,
                step: 5,
                patterns: [PATTERN_TYPES.RADIAL_GROWTH]
            },
            {
                key: 'flameHeight',
                label: 'Flame Height',
                type: 'range',
                min: 0.3,
                max: 1.0,
                step: 0.05,
                patterns: [PATTERN_TYPES.FLAME]
            },
            {
                key: 'flameSpeed',
                label: 'Animation Speed',
                type: 'range',
                min: 0.1,
                max: 3.0,
                step: 0.1,
                patterns: [PATTERN_TYPES.FLAME]
            },
            {
                key: 'flameIntensity',
                label: 'Flame Intensity',
                type: 'range',
                min: 0.2,
                max: 1.0,
                step: 0.05,
                patterns: [PATTERN_TYPES.FLAME]
            },
            {
                key: 'flameComplexity',
                label: 'Flame Complexity',
                type: 'range',
                min: 2,
                max: 12,
                step: 1,
                patterns: [PATTERN_TYPES.FLAME]
            },
            {
                key: 'flameFlicker',
                label: 'Flickering',
                type: 'range',
                min: 0.0,
                max: 1.0,
                step: 0.05,
                patterns: [PATTERN_TYPES.FLAME]
            },
            {
                key: 'flameTurbulence',
                label: 'Turbulence',
                type: 'range',
                min: 0.0,
                max: 0.8,
                step: 0.05,
                patterns: [PATTERN_TYPES.FLAME]
            },
            {
                key: 'flameGradientSteps',
                label: 'Color Gradients',
                type: 'range',
                min: 4,
                max: 16,
                step: 1,
                patterns: [PATTERN_TYPES.FLAME]
            },
            {
                key: 'flameLayerCount',
                label: 'Flame Layers',
                type: 'range',
                min: 1,
                max: 8,
                step: 1,
                patterns: [PATTERN_TYPES.FLAME]
            },
            {
                key: 'flameOpacity',
                label: 'Opacity',
                type: 'range',
                min: 0.3,
                max: 1.0,
                step: 0.05,
                patterns: [PATTERN_TYPES.FLAME]
            },
            {
                key: 'flameCurl',
                label: 'Flame Curl',
                type: 'range',
                min: 0.0,
                max: 1.0,
                step: 0.05,
                patterns: [PATTERN_TYPES.FLAME]
            },
            {
                key: 'flameWidth',
                label: 'Flame Width',
                type: 'range',
                min: 0.2,
                max: 1.0,
                step: 0.05,
                patterns: [PATTERN_TYPES.FLAME]
            },
            {
                key: 'flameSpread',
                label: 'Flame Spread',
                type: 'range',
                min: 0.0,
                max: 0.8,
                step: 0.05,
                patterns: [PATTERN_TYPES.FLAME]
            }
        ];
        
        // Create controls for each parameter
        controlDefinitions.forEach(def => {
            const control = this.createControl(def);
            controlsContainer.appendChild(control);
            
            // Store reference for easy access
            this.controls[def.key] = {
                element: control,
                definition: def,
                input: control.querySelector('input'),
                valueDisplay: control.querySelector('.value-display')
            };
        });
        
        this.element.appendChild(controlsContainer);
    }
    
    /**
     * Create individual control element
     */
    createControl(definition) {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'parameter-control';
        controlDiv.dataset.parameter = definition.key;
        
        const label = document.createElement('label');
        label.className = 'control-label';
        label.textContent = definition.label;
        
        const inputContainer = document.createElement('div');
        inputContainer.className = 'input-container';
        
        let input;
        let valueDisplay;
        
        if (definition.type === 'range') {
            input = document.createElement('input');
            input.type = 'range';
            input.min = definition.min;
            input.max = definition.max;
            input.step = definition.step;
            input.value = DEFAULT_VALUES[definition.key] || definition.min;
            input.className = 'range-input';
            
            valueDisplay = document.createElement('span');
            valueDisplay.className = 'value-display';
            valueDisplay.textContent = input.value;
            
            input.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                valueDisplay.textContent = value;
                this.updateParameter(definition.key, value);
            });
            
            inputContainer.appendChild(input);
            inputContainer.appendChild(valueDisplay);
            
        } else if (definition.type === 'checkbox') {
            input = document.createElement('input');
            input.type = 'checkbox';
            input.checked = DEFAULT_VALUES[definition.key] || false;
            input.className = 'checkbox-input';
            
            input.addEventListener('change', (e) => {
                this.updateParameter(definition.key, e.target.checked);
            });
            
            inputContainer.appendChild(input);
        }
        
        controlDiv.appendChild(label);
        controlDiv.appendChild(inputContainer);
        
        return controlDiv;
    }
    
    /**
     * Apply CSS styles (Apple-like minimal design)
     */
    applyStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .pattern-controls {
                color: #1d1d1f;
            }
            
            /* Pattern Selector */
            .pattern-selector {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-bottom: 24px;
            }
            
            .pattern-button {
                padding: 12px 16px;
                background: rgba(0, 0, 0, 0.03);
                border: 1px solid rgba(0, 0, 0, 0.08);
                border-radius: 8px;
                color: #1d1d1f;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 15px;
                font-weight: 500;
                text-align: left;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            }
            
            .pattern-button:hover {
                background: rgba(0, 0, 0, 0.05);
                border-color: rgba(0, 0, 0, 0.12);
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            }
            
            .pattern-button.active {
                background: rgba(0, 122, 255, 0.1);
                border-color: rgba(0, 122, 255, 0.3);
                color: #007aff;
                box-shadow: 0 2px 12px rgba(0, 122, 255, 0.2);
            }
            
            /* Parameter Controls */
            .parameter-controls {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
            
            .parameter-control {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 0;
                border-bottom: 1px solid rgba(0, 0, 0, 0.05);
                transition: opacity 0.3s ease;
            }
            
            .parameter-control.hidden {
                display: none;
            }
            
            .control-label {
                font-size: 15px;
                font-weight: 500;
                color: #1d1d1f;
                min-width: 100px;
                margin-right: 16px;
            }
            
            .input-container {
                display: flex;
                align-items: center;
                gap: 12px;
                flex: 1;
                justify-content: flex-end;
            }
            
            /* Range Input */
            .range-input {
                width: 120px;
                height: 4px;
                background: rgba(0, 0, 0, 0.1);
                border-radius: 2px;
                outline: none;
                appearance: none;
                cursor: pointer;
            }
            
            .range-input::-webkit-slider-thumb {
                appearance: none;
                width: 20px;
                height: 20px;
                background: white;
                border: 2px solid #007aff;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
                transition: all 0.2s ease;
            }
            
            .range-input::-webkit-slider-thumb:hover {
                transform: scale(1.1);
                box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
            }
            
            .range-input::-moz-range-thumb {
                width: 20px;
                height: 20px;
                background: white;
                border: 2px solid #007aff;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
            }
            
            .value-display {
                font-size: 13px;
                color: #86868b;
                min-width: 40px;
                text-align: right;
                font-family: -apple-system, BlinkMacSystemFont, 'SF Mono', Monaco, monospace;
                font-weight: 500;
            }
            
            /* Checkbox Input */
            .checkbox-input {
                width: 20px;
                height: 20px;
                accent-color: #007aff;
                cursor: pointer;
                border-radius: 4px;
            }
            
            /* Responsive Design */
            @media (max-width: 768px) {
                .pattern-selector {
                    gap: 6px;
                }
                
                .pattern-button {
                    padding: 10px 14px;
                    font-size: 14px;
                }
                
                .parameter-control {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 8px;
                    padding: 10px 0;
                }
                
                .input-container {
                    width: 100%;
                    justify-content: space-between;
                }
                
                .range-input {
                    width: 150px;
                }
                
                .control-label {
                    font-size: 14px;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    /**
     * Bind event listeners
     */
    bindEvents() {
        // Pattern selection events are handled in createPatternSelector
        // Parameter change events are handled in createControl
    }
    
    /**
     * Select pattern type
     */
    selectPattern(patternType) {
        this.currentPattern = patternType;
        
        // Update button states
        const buttons = this.element.querySelectorAll('.pattern-button');
        buttons.forEach(button => {
            button.classList.toggle('active', button.dataset.pattern === patternType);
        });
        
        // Update controls visibility
        this.updateControlsVisibility();
        
        // Update app
        this.app.updateParameter('patternType', patternType);
        
        console.log(`Pattern selected: ${patternType}`);
    }
    
    /**
     * Update parameter value
     */
    updateParameter(key, value) {
        // Update app
        this.app.updateParameter(key, value);
        
        console.log(`Parameter updated: ${key} = ${value}`);
    }
    
    /**
     * Update controls visibility based on selected pattern
     */
    updateControlsVisibility() {
        Object.entries(this.controls).forEach(([key, control]) => {
            const isVisible = control.definition.patterns.includes(this.currentPattern);
            control.element.classList.toggle('hidden', !isVisible);
        });
    }
    
    /**
     * Update control values from app state
     */
    update() {
        // Update pattern selection
        const currentPattern = this.app.getParameter('patternType') || PATTERN_TYPES.INTERFERENCE;
        if (currentPattern !== this.currentPattern) {
            this.selectPattern(currentPattern);
        }
        
        // Update parameter values
        Object.entries(this.controls).forEach(([key, control]) => {
            const value = this.app.getParameter(key);
            if (value !== undefined) {
                if (control.input.type === 'range') {
                    control.input.value = value;
                    if (control.valueDisplay) {
                        control.valueDisplay.textContent = value;
                    }
                } else if (control.input.type === 'checkbox') {
                    control.input.checked = value;
                }
            }
        });
    }
    
    /**
     * Get current state
     */
    getState() {
        return {
            currentPattern: this.currentPattern,
            parameters: Object.fromEntries(
                Object.entries(this.controls).map(([key, control]) => [
                    key,
                    control.input.type === 'checkbox' ? control.input.checked : parseFloat(control.input.value)
                ])
            )
        };
    }
    
    /**
     * Get the main element
     */
    getElement() {
        return this.element;
    }
    
    /**
     * Cleanup
     */
    destroy() {
        // Remove event listeners (they're on elements that will be removed)
        this.element?.remove();
        
        console.log('PatternControls destroyed');
    }
}

export default PatternControls;