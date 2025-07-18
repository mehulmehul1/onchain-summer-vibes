/**
 * main.js - Onchain Summer Vibes Main Application
 * 
 * Entry point for q5.js application with highlight.xyz integration
 */

import { Q5App } from './src/core/Q5App.js';
import { startTask, completeTask, taskError } from './src/utils/taskUtils.js';

// Global application instance and configuration
let app = null;
let webgpuSupported = false;

const CONFIG = {
    canvas: {
        targetFPS: 60
    },
    webgpu: {
        enabled: true,
        fallbackTo2D: true
    },
    debug: true
};

// q5.js Global Setup Functions
window.setup = async () => {
    console.log('Setting up q5.js application...');
    try {
        // Mark setup task as in progress
        await startTask('2.1'); // Assuming task 2.1 is for Q5.js setup
        
        // Check WebGPU support
        webgpuSupported = await checkWebGPUSupport();
        console.log('WebGPU supported:', webgpuSupported);
        
        // Initialize application
        app = new Q5App(CONFIG);
        await app.initialize();
        
        // Mark setup task as complete
        await completeTask('2.1', `Q5.js setup complete. WebGPU: ${webgpuSupported}`);
        console.log('Application setup complete');
    } catch (error) {
        console.error('Setup failed:', error);
        await taskError('2.1', error);
        showError('Application setup failed: ' + error.message);
    }
};

window.draw = () => {
    app?.draw();
};

window.windowResized = () => {
    app?.windowResized();
};
    
// Utility function to detect WebGPU support
async function checkWebGPUSupport() {
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

// Error display helper
function showError(message) {
    console.error(message);
    const errorDiv = document.getElementById('error');
    if (errorDiv) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = message;
    }
}

// Global error handler
window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global error:', {message, source, lineno, colno, error});
    return false;
};

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG };
}

console.log('main.js loaded successfully');

// WebGPU support detection
async function checkWebGPUSupport() {
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

// Global error handler
window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global error:', {message, source, lineno, colno, error});
    return false;
};

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { OnchainSummerVibesApp, CONFIG };
}

console.log('main.js loaded successfully');