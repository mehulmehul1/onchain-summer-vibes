/**
 * Q5App.js - Core Q5.js Application Class
 * Handles WebGPU renderer initialization and fallback
 */

export class Q5App {
    constructor(config = {}) {
        this.config = {
            canvas: {
                targetFPS: 60,
                ...config.canvas
            },
            webgpu: {
                enabled: true,
                fallbackTo2D: true,
                ...config.webgpu
            },
            debug: true,
            ...config
        };
        
        this.canvas = null;
        this.webgpuSupported = false;
        this.isInitialized = false;
        this.performanceMonitor = null;
        this.device = null;
        this.context = null;
    }

    async initialize() {
        console.log('Initializing Q5App...');
        
        try {
            // Create canvas first
            this.setupCanvas();

            // Initialize WebGPU if enabled
            if (this.config.webgpu.enabled) {
                await this.initializeWebGPU();
            }

            // Set up performance monitoring
            this.performanceMonitor = new PerformanceMonitor();
            
            // Configure rendering
            this.setupRendering();
            
            // Load patterns
            await this.loadPatterns();
            
            this.isInitialized = true;
            console.log('Q5App initialized successfully');
            
        } catch (error) {
            console.error('Q5App initialization failed:', error);
            throw error;
        }
    }
    
    async initializeWebGPU() {
        try {
            if (!navigator.gpu) {
                throw new Error('WebGPU not supported');
            }

            const adapter = await navigator.gpu.requestAdapter();
            if (!adapter) {
                throw new Error('Couldn\'t request WebGPU adapter');
            }

            this.device = await adapter.requestDevice();
            this.context = this.canvas.getContext('webgpu');
            this.webgpuSupported = true;

            console.log('WebGPU initialized successfully');
            
        } catch (error) {
            console.warn('WebGPU initialization failed:', error);
            this.webgpuSupported = false;
            
            if (this.config.webgpu.fallbackTo2D) {
                console.log('Falling back to Canvas 2D context');
                this.context = this.canvas.getContext('2d');
            } else {
                throw error;
            }
        }
    }
    
    setupCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.display = 'block';
        
        document.body.appendChild(this.canvas);
        this.resizeCanvas();
        
        // Set up resize observer
        const resizeObserver = new ResizeObserver(() => this.resizeCanvas());
        resizeObserver.observe(this.canvas);
    }

    setupRendering() {
        if (this.config.canvas.targetFPS) {
            // Set animation frame timing
            this.frameInterval = 1000 / this.config.canvas.targetFPS;
            this.lastFrameTime = 0;
        }
        
        // Set initial background
        this.clear();
    }

    async loadPatterns() {
        const patterns = await import('../patterns/index.js');
        this.patterns = patterns;
        this.currentPattern = null;
        
        // Set initial pattern if specified in config
        if (this.config.initialPattern && patterns[this.config.initialPattern]) {
            this.setPattern(this.config.initialPattern);
        }
    }

    setPattern(patternName) {
        if (this.patterns?.[patternName]) {
            const PatternClass = this.patterns[patternName];
            this.currentPattern = new PatternClass(this.canvas, this.context);
            
            if (this.webgpuSupported && this.currentPattern.initWebGPU) {
                this.currentPattern.initWebGPU(this.device);
            }
        }
    }

    clear() {
        if (this.context instanceof GPUCanvasContext) {
            // WebGPU clear
            const commandEncoder = this.device.createCommandEncoder();
            const renderPass = commandEncoder.beginRenderPass({
                colorAttachments: [{
                    view: this.context.getCurrentTexture().createView(),
                    clearValue: { r: 0, g: 0, b: 0, a: 1.0 },
                    loadOp: 'clear',
                    storeOp: 'store',
                }]
            });
            renderPass.end();
            this.device.queue.submit([commandEncoder.finish()]);
        } else {
            // Canvas 2D clear
            this.context.fillStyle = 'black';
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    draw() {
        if (!this.isInitialized) return;

        const currentTime = performance.now();
        if (this.frameInterval) {
            // Skip frame if too early
            if (currentTime - this.lastFrameTime < this.frameInterval) {
                requestAnimationFrame(() => this.draw());
                return;
            }
            this.lastFrameTime = currentTime;
        }

        try {
            // Update performance metrics
            this.performanceMonitor?.update();
            
            // Clear canvas
            this.clear();
            
            // Draw current pattern if any
            if (this.currentPattern) {
                this.currentPattern.draw(currentTime);
            }
            
            // Draw debug info if enabled
            if (this.config.debug && this.performanceMonitor) {
                this.performanceMonitor.draw();
            }
            
        } catch (error) {
            console.error('Draw error:', error);
        }

        // Request next frame
        requestAnimationFrame(() => this.draw());
    }

    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        const width = rect.width * window.devicePixelRatio;
        const height = rect.height * window.devicePixelRatio;

        if (this.canvas.width !== width || this.canvas.height !== height) {
            this.canvas.width = width;
            this.canvas.height = height;
            
            if (this.context?.canvas) {
                this.context.canvas.width = width;
                this.context.canvas.height = height;
            }

            // Notify current pattern
            if (this.currentPattern?.onResize) {
                this.currentPattern.onResize(width, height);
            }
        }
    }

    cleanup() {
        // Clean up current pattern
        if (this.currentPattern?.cleanup) {
            this.currentPattern.cleanup();
        }
        
        // Clean up WebGPU resources
        if (this.device) {
            // WebGPU cleanup will be handled by the browser
            this.device = null;
        }
        
        // Clean up performance monitor
        if (this.performanceMonitor) {
            this.performanceMonitor.cleanup();
        }
        
        // Remove canvas
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        this.isInitialized = false;
    }
}
