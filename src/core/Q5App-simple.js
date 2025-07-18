/**
 * Q5App-simple.js - Simplified Q5.js Application Class
 * Minimal implementation without external dependencies
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
        
        this.initialized = false;
        this.canvas = null;
        this.frameCount = 0;
        this.startTime = Date.now();
        
        console.log('Q5App initialized with config:', this.config);
    }
    
    async initialize() {
        console.log('Initializing Q5App...');
        
        try {
            // Find canvas element
            this.canvas = document.getElementById('artCanvas');
            if (!this.canvas) {
                throw new Error('Canvas element with id "artCanvas" not found');
            }
            
            // Set up canvas
            this.canvas.width = 800;
            this.canvas.height = 600;
            
            // Get context
            this.ctx = this.canvas.getContext('2d');
            if (!this.ctx) {
                throw new Error('Failed to get 2D context');
            }
            
            this.initialized = true;
            console.log('Q5App initialized successfully');
            
            // Start simple animation
            this.startAnimation();
            
        } catch (error) {
            console.error('Q5App initialization failed:', error);
            throw error;
        }
    }
    
    startAnimation() {
        const animate = () => {
            if (this.initialized) {
                this.draw();
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }
    
    draw() {
        if (!this.initialized || !this.ctx) return;
        
        this.frameCount++;
        const currentTime = Date.now();
        const elapsed = (currentTime - this.startTime) / 1000;
        
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw simple animation
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            'Onchain Summer Vibes', 
            this.canvas.width / 2, 
            this.canvas.height / 2 - 50
        );
        
        this.ctx.fillStyle = '#0ff';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(
            `Frame: ${this.frameCount} | Time: ${elapsed.toFixed(1)}s`, 
            this.canvas.width / 2, 
            this.canvas.height / 2
        );
        
        // Draw simple wave
        this.ctx.strokeStyle = '#0ff';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        for (let x = 0; x < this.canvas.width; x++) {
            const y = this.canvas.height / 2 + 50 + Math.sin(x * 0.01 + elapsed * 2) * 30;
            if (x === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        this.ctx.stroke();
    }
    
    windowResized() {
        if (this.canvas) {
            // Simple resize handling
            const container = this.canvas.parentElement;
            if (container) {
                this.canvas.width = Math.min(container.clientWidth, 800);
                this.canvas.height = Math.min(container.clientHeight, 600);
            }
        }
    }
}