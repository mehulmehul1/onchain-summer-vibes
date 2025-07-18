/**
 * PerformanceMonitor.js - Performance Monitoring System
 * Tracks FPS, memory usage, and frame timing
 */

export class PerformanceMonitor {
    constructor() {
        this.frameCount = 0;
        this.lastTime = 0;
        this.fps = 0;
        this.frameTime = 0;
        this.memoryUsage = 0;
        this.fpsHistory = new Array(60).fill(0);
        this.fpsIndex = 0;
    }

    update() {
        // Update frame count
        this.frameCount++;
        
        // Calculate FPS
        const currentTime = millis();
        if (currentTime - this.lastTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = currentTime;
            
            // Update FPS history
            this.fpsHistory[this.fpsIndex] = this.fps;
            this.fpsIndex = (this.fpsIndex + 1) % this.fpsHistory.length;
            
            // Update memory usage if available
            if (performance.memory) {
                this.memoryUsage = performance.memory.usedJSHeapSize / (1024 * 1024);
            }
        }
        
        // Calculate frame time
        this.frameTime = millis() - currentTime;
    }

    draw() {
        push();
        
        // Set up text display
        textAlign(LEFT, TOP);
        textSize(12);
        fill(255);
        noStroke();
        
        // Display metrics
        text(`FPS: ${this.fps}`, 10, 10);
        text(`Frame Time: ${this.frameTime.toFixed(2)}ms`, 10, 30);
        
        if (this.memoryUsage > 0) {
            text(`Memory: ${this.memoryUsage.toFixed(1)} MB`, 10, 50);
        }
        
        // Draw FPS graph
        this.drawFPSGraph();
        
        pop();
    }

    drawFPSGraph() {
        const graphHeight = 50;
        const graphWidth = 120;
        const x = 10;
        const y = 70;
        
        // Draw background
        fill(0, 100);
        rect(x, y, graphWidth, graphHeight);
        
        // Draw FPS history
        stroke(0, 255, 0);
        noFill();
        beginShape();
        for (let i = 0; i < this.fpsHistory.length; i++) {
            const px = x + (i * graphWidth / this.fpsHistory.length);
            const py = y + graphHeight - (this.fpsHistory[i] * graphHeight / 60);
            vertex(px, py);
        }
        endShape();
    }

    cleanup() {
        // Reset all values
        this.frameCount = 0;
        this.lastTime = 0;
        this.fps = 0;
        this.frameTime = 0;
        this.memoryUsage = 0;
        this.fpsHistory.fill(0);
        this.fpsIndex = 0;
    }
}
