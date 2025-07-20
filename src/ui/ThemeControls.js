/**
 * ThemeControls.js - Color Theme Management
 * 
 * JavaScript implementation of theme controls with color pickers and presets
 * Based on the original React TypeScript ThemeControls component
 */

import { THEME_PRESETS, DEFAULT_VALUES } from '../constants/patternConfig.js';

export class ThemeControls {
    constructor(app) {
        this.app = app;
        this.element = null;
        this.colorInputs = {};
        this.currentColors = { ...DEFAULT_VALUES.colors };
        
        this.initializeUI();
        this.bindEvents();
        
        console.log('ThemeControls initialized');
    }
    
    /**
     * Initialize the UI elements
     */
    initializeUI() {
        this.element = document.createElement('div');
        this.element.className = 'theme-controls';
        
        // Create theme preset buttons
        this.createThemePresets();
        
        // Create color pickers
        this.createColorPickers();
        
        // Create theme effects display
        this.createThemeEffectsDisplay();
        
        // Create advanced blending controls
        this.createAdvancedBlendingControls();
        
        // Apply styles
        this.applyStyles();
    }
    
    /**
     * Create theme preset buttons
     */
    createThemePresets() {
        const presetsContainer = document.createElement('div');
        presetsContainer.className = 'theme-presets';
        
        const presetsLabel = document.createElement('h4');
        presetsLabel.textContent = 'Theme Presets';
        presetsLabel.className = 'presets-label';
        
        const presetsGrid = document.createElement('div');
        presetsGrid.className = 'presets-grid';
        
        // Define preset buttons with emojis and colors (all 8 themes)
        const presets = [
            { key: 'dawn', label: 'Dawn', emoji: '🌅', colors: THEME_PRESETS.dawn, rarity: 'common' },
            { key: 'ocean', label: 'Ocean', emoji: '🌊', colors: THEME_PRESETS.ocean, rarity: 'common' },
            { key: 'forest', label: 'Forest', emoji: '🌲', colors: THEME_PRESETS.forest, rarity: 'common' },
            { key: 'sunrise', label: 'Sunrise', emoji: '🌄', colors: THEME_PRESETS.sunrise, rarity: 'common' },
            { key: 'sunset', label: 'Sunset', emoji: '🌇', colors: THEME_PRESETS.sunset, rarity: 'uncommon' },
            { key: 'midnight', label: 'Midnight', emoji: '🌙', colors: THEME_PRESETS.midnight, rarity: 'uncommon' },
            { key: 'monochrome', label: 'Mono', emoji: '⚫', colors: THEME_PRESETS.monochrome, rarity: 'rare' },
            { key: 'neon', label: 'Neon', emoji: '💡', colors: THEME_PRESETS.neon, rarity: 'rare' },
            { key: 'pastel', label: 'Pastel', emoji: '🎨', colors: THEME_PRESETS.pastel, rarity: 'epic' }
        ];
        
        presets.forEach(preset => {
            const button = document.createElement('button');
            button.className = `preset-button rarity-${preset.rarity}`;
            button.innerHTML = `
                <span class="preset-emoji">${preset.emoji}</span>
                <span class="preset-label">${preset.label}</span>
                <span class="preset-rarity">${preset.rarity}</span>
            `;
            button.title = `Apply ${preset.label} theme (${preset.rarity})`;
            button.dataset.preset = preset.key;
            button.dataset.rarity = preset.rarity;
            
            // Create color preview
            const preview = document.createElement('div');
            preview.className = 'preset-preview';
            preview.style.background = `linear-gradient(45deg, ${preset.colors.color1}, ${preset.colors.color2}, ${preset.colors.color3}, ${preset.colors.color4})`;
            
            button.appendChild(preview);
            
            button.addEventListener('click', () => {
                this.applyThemePreset(preset.key);
            });
            
            presetsGrid.appendChild(button);
        });
        
        presetsContainer.appendChild(presetsLabel);
        presetsContainer.appendChild(presetsGrid);
        this.element.appendChild(presetsContainer);
    }
    
    /**
     * Create color picker controls
     */
    createColorPickers() {
        const pickersContainer = document.createElement('div');
        pickersContainer.className = 'color-pickers';
        
        const pickersLabel = document.createElement('h4');
        pickersLabel.textContent = 'Custom Colors';
        pickersLabel.className = 'pickers-label';
        
        const pickersGrid = document.createElement('div');
        pickersGrid.className = 'pickers-grid';
        
        // Define color inputs
        const colorDefinitions = [
            { key: 'color1', label: 'Primary', position: 'top-left' },
            { key: 'color2', label: 'Secondary', position: 'top-right' },
            { key: 'color3', label: 'Accent', position: 'bottom-left' },
            { key: 'color4', label: 'Background', position: 'bottom-right' }
        ];
        
        colorDefinitions.forEach(colorDef => {
            const colorControl = document.createElement('div');
            colorControl.className = 'color-control';
            
            const label = document.createElement('label');
            label.className = 'color-label';
            label.textContent = colorDef.label;
            
            const inputContainer = document.createElement('div');
            inputContainer.className = 'color-input-container';
            
            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.className = 'color-input';
            colorInput.value = this.currentColors[colorDef.key];
            colorInput.title = `Select ${colorDef.label} color`;
            
            const colorValue = document.createElement('span');
            colorValue.className = 'color-value';
            colorValue.textContent = this.currentColors[colorDef.key];
            
            colorInput.addEventListener('input', (e) => {
                const value = e.target.value;
                colorValue.textContent = value;
                this.updateColor(colorDef.key, value);
            });
            
            inputContainer.appendChild(colorInput);
            inputContainer.appendChild(colorValue);
            
            colorControl.appendChild(label);
            colorControl.appendChild(inputContainer);
            
            pickersGrid.appendChild(colorControl);
            
            // Store reference
            this.colorInputs[colorDef.key] = {
                input: colorInput,
                value: colorValue,
                control: colorControl
            };
        });
        
        pickersContainer.appendChild(pickersLabel);
        pickersContainer.appendChild(pickersGrid);
        this.element.appendChild(pickersContainer);
    }
    
    /**
     * Create theme effects display
     */
    createThemeEffectsDisplay() {
        const effectsContainer = document.createElement('div');
        effectsContainer.className = 'theme-effects';
        
        // Header with toggle
        const effectsHeader = document.createElement('div');
        effectsHeader.className = 'effects-header';
        
        const effectsLabel = document.createElement('h4');
        effectsLabel.textContent = 'Theme Enhancement';
        effectsLabel.className = 'effects-label';
        
        // Enhancement toggle switch
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'enhancement-toggle-container';
        
        const toggleSwitch = document.createElement('label');
        toggleSwitch.className = 'enhancement-toggle-switch';
        
        const toggleInput = document.createElement('input');
        toggleInput.type = 'checkbox';
        toggleInput.checked = true; // Default enabled
        toggleInput.className = 'enhancement-toggle-input';
        toggleInput.id = 'enhancementToggle';
        
        const toggleSlider = document.createElement('span');
        toggleSlider.className = 'enhancement-toggle-slider';
        
        const toggleLabel = document.createElement('span');
        toggleLabel.className = 'enhancement-toggle-label';
        toggleLabel.textContent = 'Enhanced';
        
        toggleInput.addEventListener('change', (e) => {
            const isEnabled = e.target.checked;
            toggleLabel.textContent = isEnabled ? 'Enhanced' : 'Original';
            this.toggleThemeEnhancement(isEnabled);
        });
        
        toggleSwitch.appendChild(toggleInput);
        toggleSwitch.appendChild(toggleSlider);
        
        toggleContainer.appendChild(toggleSwitch);
        toggleContainer.appendChild(toggleLabel);
        
        effectsHeader.appendChild(effectsLabel);
        effectsHeader.appendChild(toggleContainer);
        
        effectsContainer.appendChild(effectsHeader);
        
        // Current theme info
        const currentThemeInfo = document.createElement('div');
        currentThemeInfo.className = 'current-theme-info';
        currentThemeInfo.id = 'currentThemeInfo';
        
        // Color harmony validation
        const validationInfo = document.createElement('div');
        validationInfo.className = 'validation-info';
        validationInfo.id = 'validationInfo';
        
        // Special effects indicator
        const specialEffects = document.createElement('div');
        specialEffects.className = 'special-effects';
        specialEffects.id = 'specialEffects';
        
        effectsContainer.appendChild(effectsLabel);
        effectsContainer.appendChild(currentThemeInfo);
        effectsContainer.appendChild(validationInfo);
        effectsContainer.appendChild(specialEffects);
        
        this.element.appendChild(effectsContainer);
        
        // Initialize with default values
        this.updateThemeEffectsDisplay();
    }
    
    /**
     * Update theme effects display
     */
    updateThemeEffectsDisplay() {
        const currentTheme = this.app.currentTheme || 'dawn';
        const themeRarity = this.app.themeRarity || 'common';
        const validation = this.app.currentValidation;
        
        // Update current theme info
        const themeInfo = document.getElementById('currentThemeInfo');
        if (themeInfo) {
            themeInfo.innerHTML = `
                <div class="theme-status">
                    <span class="current-theme">${currentTheme}</span>
                    <span class="theme-rarity rarity-${themeRarity}">${themeRarity}</span>
                </div>
                <div class="blend-mode">Blend: ${this.getBlendModeForTheme(currentTheme)}</div>
            `;
        }
        
        // Update validation info
        const validationEl = document.getElementById('validationInfo');
        if (validationEl && validation) {
            const contrastScore = validation.contrast?.minimum || 0;
            const harmonyScore = validation.harmony?.score || 0;
            const overallScore = validation.overall || 0;
            
            validationEl.innerHTML = `
                <div class="validation-scores">
                    <div class="score-item">
                        <span class="score-label">Contrast</span>
                        <span class="score-value ${contrastScore >= 4.5 ? 'good' : 'warning'}">${contrastScore.toFixed(1)}</span>
                    </div>
                    <div class="score-item">
                        <span class="score-label">Harmony</span>
                        <span class="score-value ${harmonyScore >= 70 ? 'good' : 'warning'}">${harmonyScore.toFixed(0)}</span>
                    </div>
                    <div class="score-item">
                        <span class="score-label">Overall</span>
                        <span class="score-value ${overallScore >= 70 ? 'good' : 'warning'}">${overallScore.toFixed(0)}</span>
                    </div>
                </div>
            `;
        }
        
        // Update special effects
        const effectsEl = document.getElementById('specialEffects');
        if (effectsEl) {
            const effects = this.getSpecialEffectsForTheme(currentTheme);
            effectsEl.innerHTML = `
                <div class="effects-list">
                    ${effects.map(effect => `<span class="effect-tag">${effect}</span>`).join('')}
                </div>
            `;
        }
    }
    
    /**
     * Get blend mode for theme
     */
    getBlendModeForTheme(theme) {
        const blendModes = {
            dawn: 'normal',
            ocean: 'multiply', 
            forest: 'overlay',
            sunset: 'soft-light',
            midnight: 'multiply',
            sunrise: 'screen',
            monochrome: 'luminosity',
            neon: 'screen',
            pastel: 'soft-light'
        };
        return blendModes[theme] || 'normal';
    }
    
    /**
     * Get special effects for theme
     */
    getSpecialEffectsForTheme(theme) {
        const effects = {
            dawn: ['Warm Shift', 'Brightness'],
            ocean: ['Cool Shift', 'Depth'],
            forest: ['Natural Tones', 'Saturation'],
            sunset: ['Dramatic', 'Warmth'],
            midnight: ['Mystery', 'Darkness'],
            sunrise: ['Energy', 'Vibrance'],
            monochrome: ['Grayscale', 'Contrast', 'Edge Enhancement'],
            neon: ['Glow', 'Sparkle', 'High Saturation'],
            pastel: ['Softening', 'Watercolor', 'Delicate']
        };
        return effects[theme] || [];
    }
    
    /**
     * Create advanced blending controls
     */
    createAdvancedBlendingControls() {
        const blendingContainer = document.createElement('div');
        blendingContainer.className = 'advanced-blending';
        
        const blendingLabel = document.createElement('h4');
        blendingLabel.textContent = 'Advanced Color Blending';
        blendingLabel.className = 'blending-label';
        
        // Blend mode selector
        const blendModeContainer = document.createElement('div');
        blendModeContainer.className = 'control-row';
        
        const blendModeLabel = document.createElement('label');
        blendModeLabel.textContent = 'Blend Mode';
        blendModeLabel.className = 'control-label';
        
        const blendModeSelect = document.createElement('select');
        blendModeSelect.className = 'blend-mode-select';
        blendModeSelect.id = 'blendModeSelect';
        
        const blendModes = [
            { value: 'normal', label: 'Normal' },
            { value: 'multiply', label: 'Multiply' },
            { value: 'screen', label: 'Screen' },
            { value: 'overlay', label: 'Overlay' },
            { value: 'soft-light', label: 'Soft Light' },
            { value: 'hard-light', label: 'Hard Light' },
            { value: 'color-dodge', label: 'Color Dodge' },
            { value: 'color-burn', label: 'Color Burn' },
            { value: 'difference', label: 'Difference' },
            { value: 'exclusion', label: 'Exclusion' }
        ];
        
        blendModes.forEach(mode => {
            const option = document.createElement('option');
            option.value = mode.value;
            option.textContent = mode.label;
            blendModeSelect.appendChild(option);
        });
        
        blendModeSelect.addEventListener('change', (e) => {
            this.app.updateParameter('blendMode', e.target.value);
        });
        
        blendModeContainer.appendChild(blendModeLabel);
        blendModeContainer.appendChild(blendModeSelect);
        
        // Color temperature slider
        const temperatureContainer = document.createElement('div');
        temperatureContainer.className = 'control-row';
        
        const temperatureLabel = document.createElement('label');
        temperatureLabel.textContent = 'Temperature';
        temperatureLabel.className = 'control-label';
        
        const temperatureSlider = document.createElement('input');
        temperatureSlider.type = 'range';
        temperatureSlider.min = '-100';
        temperatureSlider.max = '100';
        temperatureSlider.value = '0';
        temperatureSlider.className = 'range-input';
        temperatureSlider.id = 'temperatureSlider';
        
        const temperatureValue = document.createElement('span');
        temperatureValue.className = 'value-display';
        temperatureValue.textContent = '0';
        
        temperatureSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            temperatureValue.textContent = value;
            this.app.updateParameter('colorTemperature', value / 100);
        });
        
        temperatureContainer.appendChild(temperatureLabel);
        temperatureContainer.appendChild(temperatureSlider);
        temperatureContainer.appendChild(temperatureValue);
        
        // Saturation slider
        const saturationContainer = document.createElement('div');
        saturationContainer.className = 'control-row';
        
        const saturationLabel = document.createElement('label');
        saturationLabel.textContent = 'Saturation';
        saturationLabel.className = 'control-label';
        
        const saturationSlider = document.createElement('input');
        saturationSlider.type = 'range';
        saturationSlider.min = '-100';
        saturationSlider.max = '100';
        saturationSlider.value = '0';
        saturationSlider.className = 'range-input';
        saturationSlider.id = 'saturationSlider';
        
        const saturationValue = document.createElement('span');
        saturationValue.className = 'value-display';
        saturationValue.textContent = '0';
        
        saturationSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            saturationValue.textContent = value;
            this.app.updateParameter('colorSaturation', value / 100);
        });
        
        saturationContainer.appendChild(saturationLabel);
        saturationContainer.appendChild(saturationSlider);
        saturationContainer.appendChild(saturationValue);
        
        // Brightness slider
        const brightnessContainer = document.createElement('div');
        brightnessContainer.className = 'control-row';
        
        const brightnessLabel = document.createElement('label');
        brightnessLabel.textContent = 'Brightness';
        brightnessLabel.className = 'control-label';
        
        const brightnessSlider = document.createElement('input');
        brightnessSlider.type = 'range';
        brightnessSlider.min = '-100';
        brightnessSlider.max = '100';
        brightnessSlider.value = '0';
        brightnessSlider.className = 'range-input';
        brightnessSlider.id = 'brightnessSlider';
        
        const brightnessValue = document.createElement('span');
        brightnessValue.className = 'value-display';
        brightnessValue.textContent = '0';
        
        brightnessSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            brightnessValue.textContent = value;
            this.app.updateParameter('colorBrightness', value / 100);
        });
        
        brightnessContainer.appendChild(brightnessLabel);
        brightnessContainer.appendChild(brightnessSlider);
        brightnessContainer.appendChild(brightnessValue);
        
        // Effect intensity slider
        const intensityContainer = document.createElement('div');
        intensityContainer.className = 'control-row';
        
        const intensityLabel = document.createElement('label');
        intensityLabel.textContent = 'Effect Intensity';
        intensityLabel.className = 'control-label';
        
        const intensitySlider = document.createElement('input');
        intensitySlider.type = 'range';
        intensitySlider.min = '0';
        intensitySlider.max = '200';
        intensitySlider.value = '100';
        intensitySlider.className = 'range-input';
        intensitySlider.id = 'intensitySlider';
        
        const intensityValue = document.createElement('span');
        intensityValue.className = 'value-display';
        intensityValue.textContent = '100%';
        
        intensitySlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            intensityValue.textContent = value + '%';
            this.app.updateParameter('effectIntensity', value / 100);
        });
        
        intensityContainer.appendChild(intensityLabel);
        intensityContainer.appendChild(intensitySlider);
        intensityContainer.appendChild(intensityValue);
        
        // Performance display
        const performanceContainer = document.createElement('div');
        performanceContainer.className = 'performance-info';
        performanceContainer.id = 'performanceInfo';
        
        const performanceLabel = document.createElement('h4');
        performanceLabel.textContent = 'Performance';
        performanceLabel.className = 'performance-label';
        
        const cacheStats = document.createElement('div');
        cacheStats.className = 'cache-stats';
        cacheStats.id = 'cacheStats';
        
        const clearCacheBtn = document.createElement('button');
        clearCacheBtn.textContent = 'Clear Cache';
        clearCacheBtn.className = 'clear-cache-btn';
        clearCacheBtn.addEventListener('click', () => {
            if (this.app.themeEnhancer) {
                this.app.themeEnhancer.clearCache();
            }
            if (this.app.colorBlender) {
                this.app.colorBlender.clearCache();
            }
            this.updatePerformanceInfo();
        });
        
        performanceContainer.appendChild(performanceLabel);
        performanceContainer.appendChild(cacheStats);
        performanceContainer.appendChild(clearCacheBtn);
        
        // Assemble everything
        blendingContainer.appendChild(blendingLabel);
        blendingContainer.appendChild(blendModeContainer);
        blendingContainer.appendChild(temperatureContainer);
        blendingContainer.appendChild(saturationContainer);
        blendingContainer.appendChild(brightnessContainer);
        blendingContainer.appendChild(intensityContainer);
        blendingContainer.appendChild(performanceContainer);
        
        this.element.appendChild(blendingContainer);
        
        // Initialize performance info
        this.updatePerformanceInfo();
    }
    
    /**
     * Update performance information display
     */
    updatePerformanceInfo() {
        const cacheStatsEl = document.getElementById('cacheStats');
        if (cacheStatsEl && this.app.themeEnhancer && this.app.colorBlender) {
            const enhancerStats = this.app.themeEnhancer.getCacheStats();
            const blenderStats = this.app.colorBlender.getCacheStats();
            
            cacheStatsEl.innerHTML = `
                <div class="stat-row">
                    <span>Theme Cache:</span>
                    <span>${enhancerStats.effectsCacheSize} items</span>
                </div>
                <div class="stat-row">
                    <span>Color Cache:</span>
                    <span>${blenderStats.totalCacheSize} items</span>
                </div>
                <div class="stat-row">
                    <span>Frame Rate:</span>
                    <span id="fpsCounter">60 FPS</span>
                </div>
            `;
        }
    }
    
    /**
     * Apply CSS styles (Apple-like minimal design)
     */
    applyStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .theme-controls {
                color: #1d1d1f;
            }
            
            .presets-label,
            .pickers-label {
                margin: 0 0 16px 0;
                font-size: 17px;
                font-weight: 600;
                color: #1d1d1f;
                text-transform: none;
                letter-spacing: -0.2px;
            }
            
            /* Theme Presets */
            .theme-presets {
                margin-bottom: 28px;
            }
            
            .presets-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 8px;
            }
            
            .preset-button {
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 12px 8px;
                background: rgba(0, 0, 0, 0.03);
                border: 1px solid rgba(0, 0, 0, 0.08);
                border-radius: 8px;
                color: #1d1d1f;
                cursor: pointer;
                transition: all 0.2s ease;
                overflow: hidden;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            }
            
            .preset-button:hover {
                background: rgba(0, 0, 0, 0.05);
                border-color: rgba(0, 0, 0, 0.12);
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            }
            
            .preset-button:active {
                transform: translateY(0);
            }
            
            .preset-emoji {
                font-size: 18px;
                margin-bottom: 4px;
            }
            
            .preset-label {
                font-size: 12px;
                font-weight: 500;
                text-align: center;
                position: relative;
                z-index: 1;
            }
            
            .preset-rarity {
                font-size: 9px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                position: relative;
                z-index: 1;
                margin-top: 2px;
                opacity: 0.7;
            }
            
            /* Rarity-based styling */
            .rarity-common {
                border-color: rgba(76, 175, 80, 0.3);
            }
            
            .rarity-common:hover {
                border-color: rgba(76, 175, 80, 0.5);
                box-shadow: 0 2px 8px rgba(76, 175, 80, 0.2);
            }
            
            .rarity-uncommon {
                border-color: rgba(255, 152, 0, 0.3);
            }
            
            .rarity-uncommon:hover {
                border-color: rgba(255, 152, 0, 0.5);
                box-shadow: 0 2px 8px rgba(255, 152, 0, 0.2);
            }
            
            .rarity-rare {
                border-color: rgba(156, 39, 176, 0.3);
            }
            
            .rarity-rare:hover {
                border-color: rgba(156, 39, 176, 0.5);
                box-shadow: 0 2px 8px rgba(156, 39, 176, 0.2);
            }
            
            .rarity-epic {
                border-color: rgba(244, 67, 54, 0.3);
                position: relative;
            }
            
            .rarity-epic::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(45deg, rgba(244, 67, 54, 0.1), rgba(156, 39, 176, 0.1));
                border-radius: 7px;
                z-index: 0;
            }
            
            .rarity-epic:hover {
                border-color: rgba(244, 67, 54, 0.5);
                box-shadow: 0 2px 12px rgba(244, 67, 54, 0.3);
            }
            
            .preset-preview {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 3px;
                opacity: 0.8;
                transition: all 0.2s ease;
            }
            
            .preset-button:hover .preset-preview {
                opacity: 1;
                height: 4px;
            }
            
            /* Color Pickers */
            .color-pickers {
                margin-bottom: 20px;
            }
            
            .pickers-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
            }
            
            .color-control {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            
            .color-label {
                font-size: 13px;
                font-weight: 500;
                color: #1d1d1f;
            }
            
            .color-input-container {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .color-input {
                width: 44px;
                height: 44px;
                border: 1px solid rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                cursor: pointer;
                background: none;
                transition: all 0.2s ease;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            
            .color-input:hover {
                border-color: rgba(0, 0, 0, 0.2);
                transform: scale(1.05);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            }
            
            .color-input::-webkit-color-swatch-wrapper {
                padding: 4px;
            }
            
            .color-input::-webkit-color-swatch {
                border: none;
                border-radius: 4px;
            }
            
            .color-input::-moz-color-swatch {
                border: none;
                border-radius: 4px;
            }
            
            .color-value {
                font-size: 11px;
                font-family: -apple-system, BlinkMacSystemFont, 'SF Mono', Monaco, monospace;
                color: #86868b;
                background: rgba(0, 0, 0, 0.03);
                padding: 6px 8px;
                border-radius: 6px;
                flex: 1;
                text-align: center;
                text-transform: uppercase;
                font-weight: 500;
                border: 1px solid rgba(0, 0, 0, 0.05);
            }
            
            /* Theme Effects Display */
            .theme-effects {
                margin-bottom: 20px;
                padding: 16px;
                background: rgba(0, 0, 0, 0.02);
                border: 1px solid rgba(0, 0, 0, 0.06);
                border-radius: 12px;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            }
            
            .effects-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 16px;
            }
            
            .effects-label {
                margin: 0;
                font-size: 17px;
                font-weight: 600;
                color: #1d1d1f;
                text-transform: none;
                letter-spacing: -0.2px;
            }
            
            /* Enhancement Toggle Switch */
            .enhancement-toggle-container {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .enhancement-toggle-switch {
                position: relative;
                display: inline-block;
                width: 44px;
                height: 24px;
                cursor: pointer;
            }
            
            .enhancement-toggle-input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            
            .enhancement-toggle-slider {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.1);
                border-radius: 24px;
                transition: all 0.3s ease;
                border: 1px solid rgba(0, 0, 0, 0.08);
            }
            
            .enhancement-toggle-slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 2px;
                bottom: 2px;
                background-color: white;
                border-radius: 50%;
                transition: all 0.3s ease;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
            }
            
            .enhancement-toggle-input:checked + .enhancement-toggle-slider {
                background-color: #007aff;
                border-color: #007aff;
            }
            
            .enhancement-toggle-input:checked + .enhancement-toggle-slider:before {
                transform: translateX(20px);
            }
            
            .enhancement-toggle-label {
                font-size: 13px;
                font-weight: 500;
                color: #1d1d1f;
                min-width: 60px;
            }
            
            /* Disabled state for theme sections */
            .theme-effects.disabled,
            .advanced-blending.disabled {
                opacity: 0.5;
                pointer-events: none;
            }
            
            .theme-effects.disabled .effects-header .enhancement-toggle-container {
                pointer-events: auto;
            }
            
            .current-theme-info {
                margin-bottom: 12px;
            }
            
            .theme-status {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 8px;
            }
            
            .current-theme {
                font-size: 16px;
                font-weight: 600;
                color: #1d1d1f;
                text-transform: capitalize;
            }
            
            .theme-rarity {
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                padding: 4px 8px;
                border-radius: 4px;
                border: 1px solid;
            }
            
            .rarity-common.theme-rarity {
                color: #4caf50;
                background: rgba(76, 175, 80, 0.1);
                border-color: rgba(76, 175, 80, 0.3);
            }
            
            .rarity-uncommon.theme-rarity {
                color: #ff9800;
                background: rgba(255, 152, 0, 0.1);
                border-color: rgba(255, 152, 0, 0.3);
            }
            
            .rarity-rare.theme-rarity {
                color: #9c27b0;
                background: rgba(156, 39, 176, 0.1);
                border-color: rgba(156, 39, 176, 0.3);
            }
            
            .rarity-epic.theme-rarity {
                color: #f44336;
                background: linear-gradient(45deg, rgba(244, 67, 54, 0.1), rgba(156, 39, 176, 0.1));
                border-color: rgba(244, 67, 54, 0.3);
            }
            
            .blend-mode {
                font-size: 12px;
                color: #86868b;
                font-family: -apple-system, BlinkMacSystemFont, 'SF Mono', Monaco, monospace;
                text-transform: uppercase;
                font-weight: 500;
            }
            
            .validation-info {
                margin-bottom: 12px;
            }
            
            .validation-scores {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 8px;
            }
            
            .score-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 8px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 8px;
                border: 1px solid rgba(0, 0, 0, 0.05);
            }
            
            .score-label {
                font-size: 10px;
                font-weight: 500;
                color: #86868b;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 4px;
            }
            
            .score-value {
                font-size: 14px;
                font-weight: 600;
                font-family: -apple-system, BlinkMacSystemFont, 'SF Mono', Monaco, monospace;
            }
            
            .score-value.good {
                color: #4caf50;
            }
            
            .score-value.warning {
                color: #ff9800;
            }
            
            .special-effects {
                margin-top: 8px;
            }
            
            .effects-list {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
            }
            
            .effect-tag {
                font-size: 10px;
                font-weight: 500;
                color: #1d1d1f;
                background: rgba(0, 0, 0, 0.05);
                padding: 4px 8px;
                border-radius: 4px;
                border: 1px solid rgba(0, 0, 0, 0.08);
                text-transform: uppercase;
                letter-spacing: 0.3px;
            }
            
            /* Advanced Blending Controls */
            .advanced-blending {
                margin-bottom: 20px;
                padding: 16px;
                background: rgba(0, 0, 0, 0.02);
                border: 1px solid rgba(0, 0, 0, 0.06);
                border-radius: 12px;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            }
            
            .blending-label {
                margin: 0 0 16px 0;
                font-size: 17px;
                font-weight: 600;
                color: #1d1d1f;
                text-transform: none;
                letter-spacing: -0.2px;
            }
            
            .control-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 12px;
                padding: 8px 0;
                border-bottom: 1px solid rgba(0, 0, 0, 0.03);
            }
            
            .control-row:last-child {
                border-bottom: none;
                margin-bottom: 0;
            }
            
            .control-row .control-label {
                font-size: 14px;
                font-weight: 500;
                color: #1d1d1f;
                min-width: 80px;
                margin: 0;
            }
            
            .blend-mode-select {
                background: rgba(255, 255, 255, 0.8);
                border: 1px solid rgba(0, 0, 0, 0.1);
                border-radius: 6px;
                padding: 6px 8px;
                font-size: 13px;
                color: #1d1d1f;
                cursor: pointer;
                outline: none;
                transition: all 0.2s ease;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            }
            
            .blend-mode-select:hover {
                border-color: rgba(0, 0, 0, 0.2);
                background: rgba(255, 255, 255, 0.9);
            }
            
            .blend-mode-select:focus {
                border-color: #007aff;
                box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
            }
            
            .control-row .range-input {
                width: 100px;
                margin-right: 8px;
            }
            
            .control-row .value-display {
                font-size: 12px;
                color: #86868b;
                min-width: 35px;
                text-align: right;
                font-family: -apple-system, BlinkMacSystemFont, 'SF Mono', Monaco, monospace;
                font-weight: 500;
            }
            
            /* Performance Info */
            .performance-info {
                margin-top: 16px;
                padding-top: 16px;
                border-top: 1px solid rgba(0, 0, 0, 0.06);
            }
            
            .performance-label {
                margin: 0 0 12px 0;
                font-size: 15px;
                font-weight: 600;
                color: #1d1d1f;
                text-transform: none;
                letter-spacing: -0.2px;
            }
            
            .cache-stats {
                margin-bottom: 12px;
            }
            
            .stat-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 4px 0;
                font-size: 12px;
            }
            
            .stat-row span:first-child {
                color: #86868b;
                font-weight: 500;
            }
            
            .stat-row span:last-child {
                color: #1d1d1f;
                font-family: -apple-system, BlinkMacSystemFont, 'SF Mono', Monaco, monospace;
                font-weight: 600;
            }
            
            .clear-cache-btn {
                background: rgba(255, 59, 48, 0.1);
                border: 1px solid rgba(255, 59, 48, 0.3);
                border-radius: 6px;
                color: #ff3b30;
                padding: 6px 12px;
                font-size: 12px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .clear-cache-btn:hover {
                background: rgba(255, 59, 48, 0.15);
                border-color: rgba(255, 59, 48, 0.5);
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(255, 59, 48, 0.2);
            }
            
            .clear-cache-btn:active {
                transform: translateY(0);
            }
            
            /* Responsive Design */
            @media (max-width: 768px) {
                .presets-grid {
                    grid-template-columns: repeat(3, 1fr);
                    gap: 6px;
                }
                
                .preset-button {
                    padding: 10px 6px;
                }
                
                .preset-emoji {
                    font-size: 16px;
                }
                
                .preset-label {
                    font-size: 11px;
                }
                
                .pickers-grid {
                    grid-template-columns: 1fr;
                    gap: 12px;
                }
                
                .color-input-container {
                    flex-direction: row;
                    align-items: center;
                }
                
                .color-input {
                    width: 36px;
                    height: 36px;
                }
                
                .color-value {
                    font-size: 10px;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    /**
     * Bind event listeners
     */
    bindEvents() {
        // Events are handled in the create methods
    }
    
    /**
     * Apply theme preset
     */
    applyThemePreset(presetKey) {
        const preset = THEME_PRESETS[presetKey];
        if (!preset) {
            console.warn(`Theme preset not found: ${presetKey}`);
            return;
        }
        
        // Update current colors
        this.currentColors = { ...preset };
        
        // Update color inputs
        Object.entries(preset).forEach(([key, color]) => {
            if (this.colorInputs[key]) {
                this.colorInputs[key].input.value = color;
                this.colorInputs[key].value.textContent = color;
            }
        });
        
        // Update app with theme name for enhanced effects
        this.app.updateParameter('currentTheme', presetKey);
        
        // Update app with all colors
        this.app.updateParameter('colors', this.currentColors);
        
        // Update theme effects display
        setTimeout(() => {
            this.updateThemeEffectsDisplay();
            this.updatePerformanceInfo();
        }, 100);
        
        console.log(`Theme preset applied: ${presetKey}`, preset);
    }
    
    /**
     * Update individual color
     */
    updateColor(colorKey, value) {
        this.currentColors[colorKey] = value;
        
        // Update app with updated colors
        this.app.updateParameter('colors', this.currentColors);
        
        // Update theme effects display
        setTimeout(() => {
            this.updateThemeEffectsDisplay();
            this.updatePerformanceInfo();
        }, 100);
        
        console.log(`Color updated: ${colorKey} = ${value}`);
    }
    
    /**
     * Toggle theme enhancement on/off
     */
    toggleThemeEnhancement(isEnabled) {
        // Update app parameter to enable/disable theme enhancement
        this.app.updateParameter('themeEnhancementEnabled', isEnabled);
        
        // Update visual indicators
        const effectsContainer = document.querySelector('.theme-effects');
        const advancedContainer = document.querySelector('.advanced-blending');
        
        if (effectsContainer) {
            effectsContainer.classList.toggle('disabled', !isEnabled);
        }
        
        if (advancedContainer) {
            advancedContainer.classList.toggle('disabled', !isEnabled);
        }
        
        // Re-render pattern with new enhancement state
        if (this.app.renderPattern) {
            // Force a re-render to apply the enhancement toggle
            this.app.updateParameter('forceRender', Date.now());
        }
        
        console.log(`Theme enhancement ${isEnabled ? 'enabled' : 'disabled'}`);
    }
    
    /**
     * Update controls from app state
     */
    update() {
        const appColors = this.app.getParameter('colors');
        if (appColors) {
            this.currentColors = { ...appColors };
            
            // Update color inputs
            Object.entries(this.currentColors).forEach(([key, color]) => {
                if (this.colorInputs[key]) {
                    this.colorInputs[key].input.value = color;
                    this.colorInputs[key].value.textContent = color;
                }
            });
            
            // Update theme effects display
            this.updateThemeEffectsDisplay();
            this.updatePerformanceInfo();
        }
    }
    
    /**
     * Get current state
     */
    getState() {
        return {
            currentColors: { ...this.currentColors }
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
        
        console.log('ThemeControls destroyed');
    }
}

export default ThemeControls;