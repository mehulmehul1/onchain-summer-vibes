/**
 * VectorFieldPattern.js - Vector Field Flow Pattern
 * 
 * JavaScript version of the vector field pattern with particle flow
 * Converted from React TypeScript VectorFieldPattern.ts
 */

import { VECTOR_FIELD_CONFIG } from '../constants/patternConfig.js';

export class Line {
    constructor(width, height, colors, tileSize) {
        this.x = 0;
        this.y = 0;
        this.points = [];
        this.age = 0;
        this.lifespan = 0;
        this.opacity = 0;
        this.width = 0;
        this.baseColor = { r: 0, g: 0, b: 0 };
        
        this.reset(width, height, colors, tileSize);
    }
    
    reset(width, height, colors, tileSize) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 150;
        this.x = width / 2 + Math.cos(angle) * distance;
        this.y = height / 2 + Math.sin(angle) * distance;
        this.points = [];
        this.age = 0;
        this.lifespan = 400 + Math.random() * 600;
        this.opacity = 0;
        this.width = 0.2 + Math.random() * 0.8;
        
        const tileX = Math.floor(this.x / tileSize);
        const tileY = Math.floor(this.y / tileSize);
        const colorT = (tileX + tileY) / 20;
        
        this.baseColor = {
            r: Math.round(colors.primary[0] + (colors.secondary[0] - colors.primary[0]) * colorT),
            g: Math.round(colors.primary[1] + (colors.secondary[1] - colors.primary[1]) * colorT),
            b: Math.round(colors.primary[2] + (colors.secondary[2] - colors.primary[2]) * colorT)
        };
    }
    
    update(time, vectorField, width, height, colors, tileSize) {
        this.age += 1;
        if (this.age >= this.lifespan) {
            this.reset(width, height, colors, tileSize);
            return;
        }
        
        const progress = this.age / this.lifespan;
        if (progress < 0.1) {
            this.opacity = progress / 0.1 * VECTOR_FIELD_CONFIG.lineAlpha;
        } else if (progress > 0.9) {
            this.opacity = (1 - (progress - 0.9) / 0.1) * VECTOR_FIELD_CONFIG.lineAlpha;
        } else {
            this.opacity = VECTOR_FIELD_CONFIG.lineAlpha;
        }
        
        const vector = vectorField(this.x, this.y, time);
        this.points.push({ x: this.x, y: this.y });
        
        if (this.points.length > VECTOR_FIELD_CONFIG.linePoints) {
            this.points.shift();
        }
        
        this.x += vector.x * 0.5;
        this.y += vector.y * 0.5;
        
        const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height || magnitude < 0.01) {
            this.reset(width, height, colors, tileSize);
        }
    }
    
    draw(ctx) {
        if (this.points.length < 2) return;
        
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${this.baseColor.r}, ${this.baseColor.g}, ${this.baseColor.b}, ${this.opacity})`;
        ctx.lineWidth = this.width * VECTOR_FIELD_CONFIG.lineWidth;
        ctx.moveTo(this.points[0].x, this.points[0].y);
        
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        
        ctx.stroke();
    }
}

export class VectorFieldPattern {
    constructor() {
        this.name = 'Vector Field';
        this.type = 'vectorfield';
        this.lines = [];
        this.initialized = false;
    }
    
    /**
     * Simple noise function
     */
    noise(x, y, z) {
        return Math.sin(x * 7 + z * 3) * 0.5 + Math.sin(y * 8 + z * 4) * 0.5;
    }
    
    /**
     * Get tile offset for shifting effect
     */
    getTileOffset(x, y, t, tileSize, tileShiftAmplitude) {
        const tileX = Math.floor(x / tileSize);
        const tileY = Math.floor(y / tileSize);
        const offsetX = tileShiftAmplitude * Math.sin(t * 0.01 + tileX * 0.5 + tileY * 0.3);
        const offsetY = tileShiftAmplitude * Math.cos(t * 0.01 + tileY * 0.5 + tileX * 0.3);
        return { offsetX, offsetY };
    }
    
    /**
     * Initialize lines if not already initialized
     */
    initializeLines(width, height, colors, tileSize) {
        if (!this.initialized) {
            this.lines = [];
            for (let i = 0; i < VECTOR_FIELD_CONFIG.numLines; i++) {
                this.lines.push(new Line(width, height, colors, tileSize));
            }
            this.initialized = true;
        }
    }
    
    /**
     * Render vector field pattern
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} time - Animation time
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {Object} colors - Color theme
     * @param {Object} options - Pattern options
     */
    render(ctx, time, width, height, colors, options = {}) {
        const { tileSize = 55, tileShiftAmplitude = 10 } = options;
        const noiseTimeScale = 0.000125;
        
        // Clear canvas with background color
        ctx.fillStyle = `rgb(${colors.background[0]}, ${colors.background[1]}, ${colors.background[2]})`;
        ctx.fillRect(0, 0, width, height);
        
        // Initialize lines if needed
        this.initializeLines(width, height, colors, tileSize);
        
        // Define vector field function
        const vectorField = (x, y, t) => {
            const { offsetX, offsetY } = this.getTileOffset(x, y, t, tileSize, tileShiftAmplitude);
            const adjustedX = x + offsetX;
            const adjustedY = y + offsetY;
            const nx = (adjustedX - width / 2) * 0.01;
            const ny = (adjustedY - height / 2) * 0.01;
            const n = this.noise(nx, ny, t * noiseTimeScale);
            const cx = adjustedX - width / 2;
            const cy = adjustedY - height / 2;
            const r = Math.sqrt(cx * cx + cy * cy);
            const mask = Math.max(0, 1 - r / 200);
            const angle = n * Math.PI * 4 + Math.atan2(cy, cx);
            return { x: Math.cos(angle) * mask, y: Math.sin(angle) * mask };
        };
        
        // Update and draw lines
        this.lines.forEach(line => {
            line.update(time, vectorField, width, height, colors, tileSize);
            line.draw(ctx);
        });
    }

    /**
     * Calculate pattern complexity based on parameters
     * @param {Object} params - Pattern parameters
     * @returns {number} - Complexity score (1-100)
     */
    calculateComplexity(params = {}) {
        const { tileSize = 55, tileShiftAmplitude = 10 } = params;
        
        // Base complexity starts at 40 (high due to particle system)
        let complexity = 40;
        
        // Tile size affects complexity inversely (smaller tiles = more computation)
        const tileFactor = Math.max(0, 1 - (tileSize / 100)); // Normalize inversely
        complexity += tileFactor * 35;
        
        // Tile shift amplitude adds dynamic complexity
        const shiftFactor = Math.min(tileShiftAmplitude / 20, 1); // Normalize to 0-1
        complexity += shiftFactor * 15;
        
        // Additional complexity from 400 animated lines with vector field calculations
        complexity += 10; // Fixed bonus for particle system complexity
        
        return Math.min(Math.max(Math.round(complexity), 1), 100);
    }
}

export default VectorFieldPattern;