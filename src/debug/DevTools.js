/**
 * DevTools.js - Development Controls for Parameter Testing
 * 
 * Provides UI controls for real-time parameter adjustment during development
 * Compatible with Canvas 2D Q5App implementation
 */

export class DevTools {
    constructor(app) {
        this.app = app;
        this.panel = null;
        this.isVisible = false;
        this.controls = {};
        this.isInitialized = false;
        
        // Default parameter ranges
        this.parameterRanges = {
            // Interference pattern parameters
            frequency: { min: 0.005, max: 0.1, step: 0.001, default: 0.02 },
            amplitude: { min: 0.1, max: 2.0, step: 0.1, default: 1.0 },
            sourceCount: { min: 2, max: 8, step: 1, default: 2 },
            wavelength: { min: 10, max: 100, step: 5, default: 50 },
            
            // Visual parameters
            logoScale: { min: 0.3, max: 1.2, step: 0.1, default: 0.7 },
            animationSpeed: { min: 0.1, max: 5.0, step: 0.1, default: 2.0 },
            
            // Color parameters
            colorIntensity: { min: 0.1, max: 2.0, step: 0.1, default: 1.0 },
            colorShift: { min: -180, max: 180, step: 10, default: 0 }
        };
        
        console.log('DevTools initialized');
    }
    
    /**
     * Initialize development tools UI
     */
    initialize() {
        if (this.isInitialized) return;
        
        try {
            this.createPanel();
            this.createControls();
            this.setupEventListeners();
            this.isInitialized = true;
            console.log('DevTools UI initialized successfully');
        } catch (error) {
            console.error('Failed to initialize DevTools:', error);
        }
    }
    
    /**
     * Create the main development panel
     */
    createPanel() {
        this.panel = document.createElement('div');
        this.panel.id = 'devtools-panel';
        this.panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 300px;
            max-height: 80vh;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            border: 1px solid #333;
            border-radius: 8px;
            padding: 15px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            z-index: 1000;
            overflow-y: auto;
            display: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;
        
        // Add header
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #333;
        `;
        
        const title = document.createElement('h3');
        title.textContent = 'Development Tools';
        title.style.cssText = 'margin: 0; color: #00ff00;';
        
        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.cssText = `
            background: none;
            border: none;
            color: #ff6b6b;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
        `;
        closeButton.onclick = () => this.hide();
        
        header.appendChild(title);
        header.appendChild(closeButton);
        this.panel.appendChild(header);
        
        document.body.appendChild(this.panel);
    }
    
    /**
     * Create parameter controls
     */
    createControls() {
        Object.entries(this.parameterRanges).forEach(([param, config]) => {
            const controlGroup = this.createControlGroup(param, config);
            this.panel.appendChild(controlGroup);
        });
        
        // Add action buttons
        this.createActionButtons();
    }
    
    /**
     * Create a control group for a parameter
     */
    createControlGroup(param, config) {
        const group = document.createElement('div');
        group.style.cssText = 'margin-bottom: 12px;';
        
        // Label
        const label = document.createElement('label');
        label.textContent = param.charAt(0).toUpperCase() + param.slice(1);
        label.style.cssText = `
            display: block;
            margin-bottom: 5px;
            color: #ccc;
            font-weight: bold;
        `;
        
        // Slider
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = config.min;
        slider.max = config.max;
        slider.step = config.step;
        slider.value = config.default;
        slider.style.cssText = `
            width: 100%;
            margin-bottom: 5px;
            accent-color: #00ff00;
        `;
        
        // Value display
        const valueDisplay = document.createElement('span');
        valueDisplay.textContent = config.default;
        valueDisplay.style.cssText = `
            color: #00ff00;
            font-weight: bold;
            float: right;
        `;
        
        // Update handler
        slider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            valueDisplay.textContent = value;
            this.updateParameter(param, value);
        });
        
        this.controls[param] = {
            slider,
            valueDisplay,
            currentValue: config.default
        };
        
        group.appendChild(label);
        group.appendChild(slider);
        group.appendChild(valueDisplay);
        group.appendChild(document.createElement('div')); // Clear float
        
        return group;
    }
    
    /**
     * Create action buttons
     */
    createActionButtons() {
        const buttonsGroup = document.createElement('div');
        buttonsGroup.style.cssText = `
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #333;
        `;
        
        const buttons = [
            { text: 'Reset All', action: () => this.resetAll() },
            { text: 'Randomize', action: () => this.randomizeAll() },
            { text: 'Export Settings', action: () => this.exportSettings() },
            { text: 'Screenshot', action: () => this.takeScreenshot() }
        ];
        
        buttons.forEach(({ text, action }) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.style.cssText = `
                background: #333;
                color: white;
                border: 1px solid #555;
                padding: 8px 12px;
                margin: 2px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
            `;
            button.onclick = action;
            button.onmouseover = () => button.style.background = '#555';
            button.onmouseout = () => button.style.background = '#333';
            
            buttonsGroup.appendChild(button);
        });
        
        this.panel.appendChild(buttonsGroup);
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Toggle with 'D' key
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'd' && e.ctrlKey) {
                e.preventDefault();
                this.toggle();
            }
        });
        
        // Click outside to close
        document.addEventListener('click', (e) => {
            if (this.isVisible && !this.panel.contains(e.target)) {
                this.hide();
            }
        });
    }
    
    /**
     * Update parameter in the application
     */
    updateParameter(param, value) {
        this.controls[param].currentValue = value;
        
        // Update application parameters based on the parameter type
        if (this.app && this.app.updateParameter) {
            this.app.updateParameter(param, value);
        } else {
            console.log(`Parameter updated: ${param} = ${value}`);
        }
    }
    
    /**
     * Reset all parameters to default
     */
    resetAll() {
        Object.entries(this.parameterRanges).forEach(([param, config]) => {
            if (this.controls[param]) {
                this.controls[param].slider.value = config.default;
                this.controls[param].valueDisplay.textContent = config.default;
                this.updateParameter(param, config.default);
            }
        });
    }
    
    /**
     * Randomize all parameters
     */
    randomizeAll() {
        Object.entries(this.parameterRanges).forEach(([param, config]) => {
            if (this.controls[param]) {
                const randomValue = Math.random() * (config.max - config.min) + config.min;
                const steppedValue = Math.round(randomValue / config.step) * config.step;
                
                this.controls[param].slider.value = steppedValue;
                this.controls[param].valueDisplay.textContent = steppedValue;
                this.updateParameter(param, steppedValue);
            }
        });
    }
    
    /**
     * Export current settings
     */
    exportSettings() {
        const settings = {};
        Object.keys(this.controls).forEach(param => {
            settings[param] = this.controls[param].currentValue;
        });
        
        const dataStr = JSON.stringify(settings, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'devtools-settings.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        console.log('Settings exported:', settings);
    }
    
    /**
     * Take screenshot of current canvas
     */
    takeScreenshot() {
        if (this.app && this.app.canvas) {
            try {
                const link = document.createElement('a');
                link.download = `onchain-summer-${Date.now()}.png`;
                link.href = this.app.canvas.toDataURL();
                link.click();
                
                console.log('Screenshot saved');
            } catch (error) {
                console.error('Failed to take screenshot:', error);
            }
        } else {
            console.warn('No canvas available for screenshot');
        }
    }
    
    /**
     * Show the development panel
     */
    show() {
        if (this.panel) {
            this.panel.style.display = 'block';
            this.isVisible = true;
        }
    }
    
    /**
     * Hide the development panel
     */
    hide() {
        if (this.panel) {
            this.panel.style.display = 'none';
            this.isVisible = false;
        }
    }
    
    /**
     * Toggle the development panel
     */
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
    
    /**
     * Clean up resources
     */
    cleanup() {
        if (this.panel && this.panel.parentNode) {
            this.panel.parentNode.removeChild(this.panel);
        }
        this.isInitialized = false;
        this.isVisible = false;
        this.controls = {};
    }
}

// Export default instance
export default DevTools;