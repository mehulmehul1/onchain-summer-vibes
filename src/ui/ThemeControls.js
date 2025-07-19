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
        
        // Update app with all colors
        this.app.updateParameter('colors', this.currentColors);
        
        console.log(`Theme preset applied: ${presetKey}`, preset);
    }
    
    /**
     * Update individual color
     */
    updateColor(colorKey, value) {
        this.currentColors[colorKey] = value;
        
        // Update app with updated colors
        this.app.updateParameter('colors', this.currentColors);
        
        console.log(`Color updated: ${colorKey} = ${value}`);
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