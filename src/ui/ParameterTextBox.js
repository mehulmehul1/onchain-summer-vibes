/**
 * ParameterTextBox.js - Real-time Parameter Display and Editor
 * 
 * Displays current pattern parameters in JSON format from PATTERN_PARAMETERS.md
 * Supports copy/paste, real-time updates, and parameter validation
 */

export class ParameterTextBox {
    constructor(app) {
        this.app = app;
        this.element = null;
        this.textArea = null;
        this.isCollapsed = true;
        this.lastParameterHash = '';
        
        this.initializeUI();
        this.bindEvents();
        this.updateParameters();
        
        console.log('ParameterTextBox initialized');
    }
    
    /**
     * Initialize the UI elements
     */
    initializeUI() {
        this.element = document.createElement('div');
        this.element.className = 'parameter-textbox';
        
        // Create header with toggle and controls
        this.createHeader();
        
        // Create content area
        this.createContent();
        
        // Apply styles
        this.applyStyles();
    }
    
    /**
     * Create header with toggle and action buttons
     */
    createHeader() {
        const header = document.createElement('div');
        header.className = 'parameter-header';
        
        // Toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'parameter-toggle';
        toggleBtn.innerHTML = '📊 Parameters';
        toggleBtn.title = 'Toggle parameter display';
        toggleBtn.addEventListener('click', () => this.toggleCollapse());
        
        // Copy button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'parameter-copy';
        copyBtn.innerHTML = '📋';
        copyBtn.title = 'Copy parameters to clipboard';
        copyBtn.addEventListener('click', () => this.copyParameters());
        
        // Paste button
        const pasteBtn = document.createElement('button');
        pasteBtn.className = 'parameter-paste';
        pasteBtn.innerHTML = '📥';
        pasteBtn.title = 'Paste and apply parameters';
        pasteBtn.addEventListener('click', () => this.pasteParameters());
        
        // Status indicator
        const status = document.createElement('span');
        status.className = 'parameter-status';
        status.id = 'parameterStatus';
        status.textContent = 'Live';
        
        header.appendChild(toggleBtn);
        header.appendChild(status);
        header.appendChild(copyBtn);
        header.appendChild(pasteBtn);
        
        this.element.appendChild(header);
    }
    
    /**
     * Create content area with text area
     */
    createContent() {
        const content = document.createElement('div');
        content.className = 'parameter-content';
        content.style.display = this.isCollapsed ? 'none' : 'block';
        
        // Text area for JSON display
        this.textArea = document.createElement('textarea');
        this.textArea.className = 'parameter-textarea';
        this.textArea.readOnly = false;
        this.textArea.spellcheck = false;
        this.textArea.placeholder = 'Parameter JSON will appear here...';
        
        // Info text
        const info = document.createElement('div');
        info.className = 'parameter-info';
        info.innerHTML = `
            <small>
                📝 <strong>Usage:</strong> Adjust sliders to see live updates | 
                📋 Copy current params | 
                📥 Paste & apply JSON
            </small>
        `;
        
        content.appendChild(this.textArea);
        content.appendChild(info);
        
        this.element.appendChild(content);
    }
    
    /**
     * Toggle collapse/expand state
     */
    toggleCollapse() {
        this.isCollapsed = !this.isCollapsed;
        const content = this.element.querySelector('.parameter-content');
        const toggle = this.element.querySelector('.parameter-toggle');
        
        if (this.isCollapsed) {
            content.style.display = 'none';
            toggle.innerHTML = '📊 Parameters';
        } else {
            content.style.display = 'block';
            toggle.innerHTML = '📊 Parameters ▲';
            this.updateParameters(); // Refresh when opening
        }
    }
    
    /**
     * Copy current parameters to clipboard
     */
    async copyParameters() {
        try {
            await navigator.clipboard.writeText(this.textArea.value);
            this.showStatus('Copied!', 'success');
        } catch (error) {
            // Fallback for older browsers
            this.textArea.select();
            document.execCommand('copy');
            this.showStatus('Copied!', 'success');
        }
    }
    
    /**
     * Paste and apply parameters from clipboard
     */
    async pasteParameters() {
        try {
            let jsonText;
            
            // Try to get from clipboard
            try {
                jsonText = await navigator.clipboard.readText();
            } catch (error) {
                // Fallback - use current textarea content
                jsonText = this.textArea.value;
            }
            
            // Validate and parse JSON
            const params = JSON.parse(jsonText);
            
            if (this.validateParameterJSON(params)) {
                this.applyParameters(params);
                this.showStatus('Applied!', 'success');
            } else {
                this.showStatus('Invalid format', 'error');
            }
            
        } catch (error) {
            console.error('Paste parameters error:', error);
            this.showStatus('Invalid JSON', 'error');
        }
    }
    
    /**
     * Validate parameter JSON structure
     */
    validateParameterJSON(params) {
        if (!params || typeof params !== 'object') return false;
        
        // Must have patternType
        if (!params.patternType) return false;
        
        // Must have baseParameters
        if (!params.baseParameters || typeof params.baseParameters !== 'object') return false;
        
        // baseParameters must have speed, wavelength, threshold
        const base = params.baseParameters;
        if (typeof base.speed !== 'number' || 
            typeof base.wavelength !== 'number' || 
            typeof base.threshold !== 'number') {
            return false;
        }
        
        return true;
    }
    
    /**
     * Apply parameters to the app
     */
    applyParameters(params) {
        const app = this.app;
        
        // Apply pattern type if different
        if (params.patternType && params.patternType !== app.patternType) {
            app.patternType = params.patternType;
            // Update pattern controls UI
            if (app.controlPanel && app.controlPanel.patternControls) {
                app.controlPanel.patternControls.selectPattern(params.patternType);
            }
        }
        
        // Apply base parameters
        if (params.baseParameters) {
            const base = params.baseParameters;
            if (base.speed !== undefined) app.speed = base.speed;
            if (base.wavelength !== undefined) app.wavelength = base.wavelength;
            if (base.threshold !== undefined) app.threshold = base.threshold;
        }
        
        // Apply pattern-specific parameters
        if (params.patternSpecific) {
            const specific = params.patternSpecific;
            
            // Apply all specific parameters to app
            Object.keys(specific).forEach(key => {
                if (app.hasOwnProperty(key)) {
                    app[key] = specific[key];
                }
            });
        }
        
        // Update UI controls to reflect new values
        this.updateControlsFromParameters();
    }
    
    /**
     * Update UI controls to reflect current parameter values
     */
    updateControlsFromParameters() {
        // Update sliders in pattern controls
        if (this.app.controlPanel && this.app.controlPanel.patternControls) {
            this.app.controlPanel.patternControls.updateControlValues();
        }
        
        // Trigger a refresh of the parameter display
        setTimeout(() => this.updateParameters(), 100);
    }
    
    /**
     * Update the parameter display with current values
     */
    updateParameters() {
        if (this.isCollapsed) return;
        
        const params = this.getCurrentParameters();
        const paramHash = JSON.stringify(params);
        
        // Only update if parameters changed
        if (paramHash !== this.lastParameterHash) {
            this.lastParameterHash = paramHash;
            this.textArea.value = JSON.stringify(params, null, 2);
            this.showStatus('Updated', 'info');
        }
    }
    
    /**
     * Get current parameters in the format from PATTERN_PARAMETERS.md
     */
    getCurrentParameters() {
        const app = this.app;
        
        const params = {
            patternType: app.patternType,
            baseParameters: {
                speed: parseFloat(app.speed.toFixed(6)),
                wavelength: parseFloat(app.wavelength.toFixed(1)),
                threshold: parseFloat(app.threshold.toFixed(3))
            },
            patternSpecific: {}
        };
        
        // Add pattern-specific parameters based on current pattern
        switch (app.patternType) {
            case 'mandala':
                params.patternSpecific = {
                    mandalaComplexity: app.mandalaComplexity || 8,
                    mandalaSpeed: parseFloat((app.mandalaSpeed || 1.0).toFixed(3)),
                    rotationSpeed: parseFloat((app.rotationSpeed || 0.2).toFixed(3)),
                    spiralArmFactor: parseFloat((app.spiralArmFactor || 0.5).toFixed(3)),
                    layerGrowthFactor: parseFloat((app.layerGrowthFactor || 0.6).toFixed(3))
                };
                break;
                
            case 'shellRidge':
                params.patternSpecific = {
                    shellRidgeRings: app.shellRidgeRings || 20,
                    shellRidgeDistortion: parseFloat((app.shellRidgeDistortion || 8).toFixed(1))
                };
                break;
                
            case 'flame':
                params.patternSpecific = {
                    flameHeight: parseFloat((app.flameHeight || 0.8).toFixed(3)),
                    flameSpeed: parseFloat((app.flameSpeed || 0.3).toFixed(3)),
                    flameIntensity: parseFloat((app.flameIntensity || 0.6).toFixed(3)),
                    flameComplexity: app.flameComplexity || 5,
                    flameFlicker: parseFloat((app.flameFlicker || 0.2).toFixed(3)),
                    flameTurbulence: parseFloat((app.flameTurbulence || 0.15).toFixed(3)),
                    flameLayerCount: app.flameLayerCount || 3
                };
                break;
                
            case 'risoprint':
                params.patternSpecific = {
                    risoComplexity: app.risoComplexity || 8,
                    risoSpeed: parseFloat((app.risoSpeed || 1.0).toFixed(3)),
                    halftoneSize: app.halftoneSize || 12,
                    gridIrregularity: parseFloat((app.gridIrregularity || 0.3).toFixed(3)),
                    shapeVariation: parseFloat((app.shapeVariation || 0.8).toFixed(3)),
                    dotDensity: parseFloat((app.dotDensity || 0.7).toFixed(3))
                };
                break;
                
            case 'vectorField':
                params.patternSpecific = {
                    vectorFieldStrength: parseFloat((app.vectorFieldStrength || 1.0).toFixed(3)),
                    noiseScale: parseFloat((app.noiseScale || 0.01).toFixed(5)),
                    flowSpeed: parseFloat((app.flowSpeed || 0.5).toFixed(3)),
                    lineLifespan: app.lineLifespan || 400,
                    numLines: app.numLines || 400
                };
                break;
                
            default:
                // Interference and other patterns
                params.patternSpecific = {
                    sourceCount: app.sourceCount || 6,
                    lineDensity: app.lineDensity || 30
                };
                break;
        }
        
        return params;
    }
    
    /**
     * Show temporary status message
     */
    showStatus(message, type = 'info') {
        const status = document.getElementById('parameterStatus');
        if (!status) return;
        
        status.textContent = message;
        status.className = `parameter-status ${type}`;
        
        // Reset after delay
        setTimeout(() => {
            status.textContent = 'Live';
            status.className = 'parameter-status';
        }, 2000);
    }
    
    /**
     * Bind event handlers
     */
    bindEvents() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'c' && this.textArea === document.activeElement) {
                    // Allow normal copy behavior
                    return;
                }
                if (e.key === 'v' && this.textArea === document.activeElement) {
                    // Trigger paste after normal paste
                    setTimeout(() => this.pasteParameters(), 100);
                }
            }
        });
        
        // Text area change detection
        this.textArea.addEventListener('input', () => {
            this.showStatus('Modified', 'warning');
        });
    }
    
    /**
     * Apply CSS styles
     */
    applyStyles() {
        const styles = `
            .parameter-textbox {
                border-top: 1px solid #444;
                background: #1a1a1a;
                margin-top: 20px;
            }
            
            .parameter-header {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 10px 15px;
                background: #2a2a2a;
                border-bottom: 1px solid #444;
            }
            
            .parameter-toggle {
                background: #3a3a3a;
                border: 1px solid #555;
                color: white;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 500;
                flex: 1;
                text-align: left;
            }
            
            .parameter-toggle:hover {
                background: #4a4a4a;
            }
            
            .parameter-copy, .parameter-paste {
                background: #3a3a3a;
                border: 1px solid #555;
                color: white;
                padding: 6px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            }
            
            .parameter-copy:hover, .parameter-paste:hover {
                background: #4a4a4a;
            }
            
            .parameter-status {
                font-size: 11px;
                color: #888;
                font-weight: 500;
                min-width: 50px;
                text-align: center;
            }
            
            .parameter-status.success {
                color: #4ade80;
            }
            
            .parameter-status.error {
                color: #f87171;
            }
            
            .parameter-status.warning {
                color: #fbbf24;
            }
            
            .parameter-status.info {
                color: #60a5fa;
            }
            
            .parameter-content {
                padding: 15px;
            }
            
            .parameter-textarea {
                width: 100%;
                height: 200px;
                background: #111;
                border: 1px solid #444;
                border-radius: 4px;
                color: #e5e5e5;
                font-family: 'Fira Code', 'Courier New', monospace;
                font-size: 12px;
                line-height: 1.4;
                padding: 10px;
                resize: vertical;
                min-height: 150px;
                max-height: 400px;
            }
            
            .parameter-textarea:focus {
                outline: none;
                border-color: #0ea5e9;
                box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.2);
            }
            
            .parameter-info {
                margin-top: 10px;
                padding: 8px 10px;
                background: #2a2a2a;
                border-radius: 4px;
                border-left: 3px solid #0ea5e9;
            }
            
            .parameter-info small {
                color: #888;
                font-size: 11px;
                line-height: 1.4;
            }
            
            .parameter-info strong {
                color: #e5e5e5;
            }
        `;
        
        // Add styles to document if not already added
        if (!document.getElementById('parameter-textbox-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'parameter-textbox-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
    }
    
    /**
     * Get the DOM element
     */
    getElement() {
        return this.element;
    }
    
    /**
     * Public method to trigger parameter update
     */
    refresh() {
        this.updateParameters();
    }
    
    /**
     * Cleanup and destroy component
     */
    destroy() {
        // Remove DOM elements
        this.element?.remove();
        
        console.log('ParameterTextBox destroyed');
    }
}