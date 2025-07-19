/**
 * main-new.js - Onchain Summer Vibes Main Application
 * 
 * Entry point for q5.js application with highlight.xyz integration
 * FRESH BUILD: No require statements - ES modules only
 */

import { Q5App } from './src/core/Q5App.js';

// Browser-compatible task logging functions
const startTask = (taskId) => console.log(`Starting task: ${taskId}`);
const completeTask = (taskId, details) => console.log(`Task completed: ${taskId}`, details);
const taskError = (taskId, error) => console.error(`Task error: ${taskId}`, error);

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

// WebGPU detection function
async function detectWebGPU() {
    if (!navigator.gpu) {
        return false;
    }
    
    try {
        const adapter = await navigator.gpu.requestAdapter();
        return adapter !== null;
    } catch (error) {
        return false;
    }
}

// Error display function
function showError(message) {
    const errorDiv = document.getElementById('error');
    if (errorDiv) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = message;
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await startTask('app-initialization');
        
        // Detect WebGPU support
        webgpuSupported = await detectWebGPU();
        console.log('WebGPU supported:', webgpuSupported);
        
        // Hide loading indicator
        const loadingDiv = document.getElementById('loading');
        if (loadingDiv) {
            loadingDiv.style.display = 'none';
        }
        
        // Initialize Q5App
        app = new Q5App(CONFIG);
        await app.initialize();
        
        await completeTask('app-initialization', 'Q5App initialized successfully');
        
    } catch (error) {
        await taskError('app-initialization', error);
        
        // Hide loading and show error
        const loadingDiv = document.getElementById('loading');
        if (loadingDiv) {
            loadingDiv.style.display = 'none';
        }
        
        showError('Application setup failed: ' + error.message);
    }
});

// Window resize handler
window.addEventListener('resize', () => {
    app?.windowResized();
});

// Global error handler
window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global error:', { message, source, lineno, colno, error });
    return false;
};

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CONFIG
    };
}