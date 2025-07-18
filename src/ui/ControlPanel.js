/**
 * ControlPanel.js - Main Control Panel Container
 * 
 * JavaScript implementation of the collapsible sidebar control panel
 * Based on the original React TypeScript ControlPanel component
 */

import { PatternControls } from './PatternControls.js';
import { ThemeControls } from './ThemeControls.js';

export class ControlPanel {
    constructor(app) {
        this.app = app;
        this.isOpen = false;
        this.panel = null;
        this.toggleButton = null;
        this.backdrop = null;
        this.patternControls = null;
        this.themeControls = null;
        
        this.initializeUI();
        this.bindEvents();
        
        console.log('ControlPanel initialized');
    }
    
    /**
     * Initialize the UI elements
     */
    initializeUI() {
        // Create toggle button
        this.createToggleButton();
        
        // Create backdrop
        this.createBackdrop();
        
        // Create main panel
        this.createMainPanel();
        
        // Create sub-components
        this.createSubComponents();
        
        // Apply initial styles
        this.applyStyles();
    }
    
    /**
     * Create toggle button (simplified for side-by-side layout)
     */
    createToggleButton() {
        // For side-by-side layout, we don't need a toggle button
        // The panel will always be visible
        this.toggleButton = document.createElement('div');
        this.toggleButton.id = 'controlToggle';
        this.toggleButton.style.display = 'none';
    }
    
    /**
     * Create backdrop overlay (not needed for side-by-side layout)
     */
    createBackdrop() {
        this.backdrop = document.createElement('div');
        this.backdrop.id = 'controlBackdrop';
        this.backdrop.style.display = 'none';
    }
    
    /**
     * Create main panel (side-by-side layout)
     */
    createMainPanel() {
        this.panel = document.createElement('div');
        this.panel.id = 'controlPanel';
        this.panel.setAttribute('role', 'complementary');
        this.panel.setAttribute('aria-label', 'Pattern Controls');
        
        // Create header
        const header = document.createElement('div');
        header.className = 'control-header';
        
        const title = document.createElement('h1');
        title.textContent = 'Controls';
        title.className = 'control-title';
        
        header.appendChild(title);
        
        // Create content area
        const content = document.createElement('div');
        content.className = 'control-content';
        content.id = 'controlContent';
        
        this.panel.appendChild(header);
        this.panel.appendChild(content);
        
        document.body.appendChild(this.panel);
    }
    
    /**
     * Create sub-components
     */
    createSubComponents() {
        const content = document.getElementById('controlContent');
        
        // Pattern Controls Section
        const patternSection = document.createElement('div');
        patternSection.className = 'control-section';
        
        const patternHeader = document.createElement('h3');
        patternHeader.textContent = 'Pattern Type';
        patternHeader.className = 'section-header';
        
        patternSection.appendChild(patternHeader);
        
        this.patternControls = new PatternControls(this.app);
        patternSection.appendChild(this.patternControls.getElement());
        
        // Theme Controls Section
        const themeSection = document.createElement('div');
        themeSection.className = 'control-section';
        
        const themeHeader = document.createElement('h3');
        themeHeader.textContent = 'Color Theme';
        themeHeader.className = 'section-header';
        
        themeSection.appendChild(themeHeader);
        
        this.themeControls = new ThemeControls(this.app);
        themeSection.appendChild(this.themeControls.getElement());
        
        // Add sections to content
        content.appendChild(patternSection);
        content.appendChild(themeSection);
    }
    
    /**
     * Apply CSS styles (Apple-like minimal design)
     */
    applyStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Global Layout */
            body {
                margin: 0;
                padding: 0;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
                background: #f5f5f7;
                display: flex;
                height: 100vh;
                overflow: hidden;
            }
            
            /* Canvas Container */
            #artCanvas {
                flex: 1;
                border: none;
                background: white;
                border-radius: 12px;
                margin: 16px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                display: block !important;
            }
            
            /* Side Panel */
            #controlPanel {
                width: 320px;
                height: 100vh;
                background: rgba(255, 255, 255, 0.8);
                backdrop-filter: blur(40px);
                -webkit-backdrop-filter: blur(40px);
                border-left: 1px solid rgba(255, 255, 255, 0.2);
                overflow-y: auto;
                overflow-x: hidden;
                display: flex;
                flex-direction: column;
                position: relative;
                z-index: 1000;
            }
            
            /* Header */
            .control-header {
                padding: 32px 24px 24px 24px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.05);
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(40px);
                -webkit-backdrop-filter: blur(40px);
                position: sticky;
                top: 0;
                z-index: 10;
            }
            
            .control-title {
                margin: 0;
                color: #1d1d1f;
                font-size: 28px;
                font-weight: 600;
                letter-spacing: -0.5px;
            }
            
            /* Content */
            .control-content {
                padding: 0 24px 24px 24px;
                flex: 1;
            }
            
            .control-section {
                margin-bottom: 32px;
                padding: 0;
                background: none;
                border-radius: 0;
                backdrop-filter: none;
            }
            
            .section-header {
                margin: 0 0 16px 0;
                color: #1d1d1f;
                font-size: 20px;
                font-weight: 600;
                text-transform: none;
                letter-spacing: -0.3px;
            }
            
            /* Scrollbar styling */
            #controlPanel::-webkit-scrollbar {
                width: 6px;
            }
            
            #controlPanel::-webkit-scrollbar-track {
                background: transparent;
            }
            
            #controlPanel::-webkit-scrollbar-thumb {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 3px;
            }
            
            #controlPanel::-webkit-scrollbar-thumb:hover {
                background: rgba(0, 0, 0, 0.3);
            }
            
            /* Responsive Design */
            @media (max-width: 768px) {
                body {
                    flex-direction: column;
                }
                
                #controlPanel {
                    width: 100%;
                    height: auto;
                    max-height: 50vh;
                    border-left: none;
                    border-top: 1px solid rgba(255, 255, 255, 0.2);
                    order: 2;
                }
                
                #artCanvas {
                    margin: 8px;
                    border-radius: 8px;
                    order: 1;
                }
                
                .control-header {
                    padding: 16px 20px 12px 20px;
                }
                
                .control-title {
                    font-size: 24px;
                }
                
                .control-content {
                    padding: 0 20px 20px 20px;
                }
                
                .control-section {
                    margin-bottom: 24px;
                }
                
                .section-header {
                    font-size: 18px;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    /**
     * Bind event listeners (simplified for side-by-side layout)
     */
    bindEvents() {
        // Panel is always visible in side-by-side layout
        // No toggle functionality needed
        this.isOpen = true;
    }
    
    /**
     * Toggle panel open/closed (not needed for side-by-side layout)
     */
    toggle() {
        // Panel is always visible
    }
    
    /**
     * Open panel (not needed for side-by-side layout)
     */
    open() {
        // Panel is always visible
    }
    
    /**
     * Close panel (not needed for side-by-side layout)
     */
    close() {
        // Panel is always visible
    }
    
    /**
     * Update controls based on app state
     */
    updateControls() {
        if (this.patternControls) {
            this.patternControls.update();
        }
        if (this.themeControls) {
            this.themeControls.update();
        }
    }
    
    /**
     * Get current panel state
     */
    getState() {
        return {
            isOpen: this.isOpen,
            patternControls: this.patternControls?.getState(),
            themeControls: this.themeControls?.getState()
        };
    }
    
    /**
     * Cleanup
     */
    destroy() {
        // Remove event listeners
        this.toggleButton?.removeEventListener('click', this.toggle);
        this.backdrop?.removeEventListener('click', this.close);
        
        // Remove elements
        this.toggleButton?.remove();
        this.backdrop?.remove();
        this.panel?.remove();
        
        // Cleanup sub-components
        this.patternControls?.destroy();
        this.themeControls?.destroy();
        
        console.log('ControlPanel destroyed');
    }
}

export default ControlPanel;