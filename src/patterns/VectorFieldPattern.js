/**
 * VectorFieldPattern.js - Vector Field Flow Pattern
 * 
 * JavaScript version of the vector field pattern with particle flow
 * Converted from React TypeScript VectorFieldPattern.ts
 */

import { VECTOR_FIELD_CONFIG } from '../constants/patternConfig.js';

export class Line {
    constructor(width, height, colors, tileSize, options = {}) {
        this.x = 0;
        this.y = 0;
        this.points = [];
        this.age = 0;
        this.lifespan = 0;
        this.opacity = 0;
        this.width = 0;
        this.baseColor = { r: 0, g: 0, b: 0 };
        
        this.reset(width, height, colors, tileSize, options);
    }
    
    reset(width, height, colors, tileSize, options = {}) {
        // More distributed spawning - random positions across canvas
        const spawnMode = Math.random();
        if (spawnMode < 0.3) {
            // Edge spawning
            const edge = Math.floor(Math.random() * 4);
            switch(edge) {
                case 0: this.x = Math.random() * width; this.y = 0; break;           // Top
                case 1: this.x = width; this.y = Math.random() * height; break;     // Right
                case 2: this.x = Math.random() * width; this.y = height; break;     // Bottom
                case 3: this.x = 0; this.y = Math.random() * height; break;        // Left
            }
        } else if (spawnMode < 0.6) {
            // Random positions across canvas
            this.x = Math.random() * width;
            this.y = Math.random() * height;
        } else {
            // Original circular spawning (but more varied)
            const angle = Math.random() * Math.PI * 2;
            const spawnRadius = (options.spawnRadius || 100) + Math.random() * 200;
            this.x = width / 2 + Math.cos(angle) * spawnRadius;
            this.y = height / 2 + Math.sin(angle) * spawnRadius;
        }
        this.points = [];
        this.age = 0;
        this.lifespan = (options.lineLifespan || 400) + Math.random() * 600;
        this.opacity = 0;
        this.width = 0.2 + Math.random() * (options.lineThickness || 0.8);
        
        // Enhanced 4-color system based on colorBlending mode
        this.baseColor = this.calculateColor(colors, tileSize, options.colorBlending || 'tile');
    }
    
    calculateColor(colors, tileSize, colorBlending) {
        let colorIndex = 0;
        
        switch (colorBlending) {
            case 'tile':
                // Tile-based coloring using all 4 colors
                const tileX = Math.floor(this.x / tileSize);
                const tileY = Math.floor(this.y / tileSize);
                colorIndex = (tileX + tileY) % 4;
                break;
            case 'position':
                // Position-based coloring (quadrants)
                const centerX = this.x > window.innerWidth / 2;
                const centerY = this.y > window.innerHeight / 2;
                colorIndex = centerX ? (centerY ? 3 : 1) : (centerY ? 2 : 0);
                break;
            case 'age':
                // Age-based coloring (will be updated in update method)
                colorIndex = Math.floor(Math.random() * 4);
                break;
            case 'velocity':
                // Random for initial spawn, will be updated based on velocity
                colorIndex = Math.floor(Math.random() * 4);
                break;
        }
        
        const colorArrays = [colors.primary, colors.secondary, colors.accent, colors.background];
        const selectedColor = colorArrays[colorIndex];
        
        return {
            r: selectedColor[0],
            g: selectedColor[1],
            b: selectedColor[2]
        };
    }
    
    update(time, vectorField, width, height, colors, tileSize, options = {}) {
        this.age += 1;
        if (this.age >= this.lifespan) {
            this.reset(width, height, colors, tileSize, options);
            return;
        }
        
        const progress = this.age / this.lifespan;
        const lineOpacity = options.lineOpacity || VECTOR_FIELD_CONFIG.lineAlpha;
        
        if (progress < 0.1) {
            this.opacity = progress / 0.1 * lineOpacity;
        } else if (progress > 0.9) {
            this.opacity = (1 - (progress - 0.9) / 0.1) * lineOpacity;
        } else {
            this.opacity = lineOpacity;
        }
        
        const vector = vectorField(this.x, this.y, time);
        this.points.push({ x: this.x, y: this.y });
        
        if (this.points.length > VECTOR_FIELD_CONFIG.linePoints) {
            this.points.shift();
        }
        
        const flowSpeed = options.flowSpeed || 0.5;
        this.x += vector.x * flowSpeed;
        this.y += vector.y * flowSpeed;
        
        const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        
        // Update color based on colorBlending mode
        const colorBlending = options.colorBlending || 'tile';
        if (colorBlending === 'velocity') {
            // Color based on velocity magnitude (0-4 speed mapped to 4 colors)
            const colorIndex = Math.min(3, Math.floor(magnitude * 4));
            const colorArrays = [colors.primary, colors.secondary, colors.accent, colors.background];
            const selectedColor = colorArrays[colorIndex];
            this.baseColor = {
                r: selectedColor[0],
                g: selectedColor[1],
                b: selectedColor[2]
            };
        } else if (colorBlending === 'age') {
            // Color based on age progression (4 life stages)
            const colorIndex = Math.min(3, Math.floor(progress * 4));
            const colorArrays = [colors.primary, colors.secondary, colors.accent, colors.background];
            const selectedColor = colorArrays[colorIndex];
            this.baseColor = {
                r: selectedColor[0],
                g: selectedColor[1],
                b: selectedColor[2]
            };
        }
        
        // More lenient boundary conditions - allow some overflow
        const margin = 50;
        if (this.x < -margin || this.x > width + margin || 
            this.y < -margin || this.y > height + margin || 
            magnitude < 0.005) {
            this.reset(width, height, colors, tileSize, options);
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
    initializeLines(width, height, colors, tileSize, options = {}) {
        const numLines = options.numLines || VECTOR_FIELD_CONFIG.numLines;
        
        if (!this.initialized || this.lines.length !== numLines) {
            this.lines = [];
            for (let i = 0; i < numLines; i++) {
                this.lines.push(new Line(width, height, colors, tileSize, options));
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
        const { 
            tileSize = 55, 
            tileShiftAmplitude = 10,
            vectorFieldStrength = 1.0,
            noiseScale = 0.01,
            vectorFieldType = 'radial'
        } = options;
        
        const noiseTimeScale = noiseScale * 0.0125;
        
        // Enhanced background with subtle gradient using accent and background colors
        this.drawEnhancedBackground(ctx, width, height, colors, options);
        
        // Initialize lines if needed
        this.initializeLines(width, height, colors, tileSize, options);
        
        // Define vector field function based on field type
        const vectorField = this.getVectorField(vectorFieldType, tileSize, tileShiftAmplitude, 
                                               vectorFieldStrength, noiseTimeScale, width, height);
        
        // Update and draw lines
        this.lines.forEach(line => {
            line.update(time, vectorField, width, height, colors, tileSize, options);
            line.draw(ctx);
        });
    }

    /**
     * Draw enhanced background using multiple colors
     */
    drawEnhancedBackground(ctx, width, height, colors, options) {
        // Base background
        ctx.fillStyle = `rgb(${colors.background[0]}, ${colors.background[1]}, ${colors.background[2]})`;
        ctx.fillRect(0, 0, width, height);
        
        // Add subtle radial gradient overlay using accent color
        const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
        gradient.addColorStop(0, `rgba(${colors.accent[0]}, ${colors.accent[1]}, ${colors.accent[2]}, 0.05)`);
        gradient.addColorStop(1, `rgba(${colors.accent[0]}, ${colors.accent[1]}, ${colors.accent[2]}, 0.02)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }

    /**
     * Get vector field function based on type
     */
    getVectorField(type, tileSize, tileShiftAmplitude, strength, noiseTimeScale, width, height) {
        switch(type) {
            case 'spiral':
                return (x, y, t) => {
                    const { offsetX, offsetY } = this.getTileOffset(x, y, t, tileSize, tileShiftAmplitude);
                    const cx = x + offsetX - width / 2;
                    const cy = y + offsetY - height / 2;
                    const r = Math.sqrt(cx * cx + cy * cy);
                    const angle = Math.atan2(cy, cx) + r * 0.01 + t * 0.001;
                    // Remove restrictive mask, add gentle falloff
                    const falloff = 0.3 + 0.7 / (1 + r * 0.001);
                    return { 
                        x: Math.cos(angle) * falloff * strength, 
                        y: Math.sin(angle) * falloff * strength 
                    };
                };
            
            case 'turbulent':
                return (x, y, t) => {
                    const { offsetX, offsetY } = this.getTileOffset(x, y, t, tileSize, tileShiftAmplitude);
                    const adjustedX = x + offsetX;
                    const adjustedY = y + offsetY;
                    const nx = adjustedX * 0.01;
                    const ny = adjustedY * 0.01;
                    const n1 = this.noise(nx, ny, t * noiseTimeScale);
                    const n2 = this.noise(nx * 2, ny * 2, t * noiseTimeScale * 0.5);
                    const angle = (n1 + n2 * 0.5) * Math.PI * 4;
                    return { 
                        x: Math.cos(angle) * strength, 
                        y: Math.sin(angle) * strength 
                    };
                };
            
            case 'grid':
                return (x, y, t) => {
                    const { offsetX, offsetY } = this.getTileOffset(x, y, t, tileSize, tileShiftAmplitude);
                    const gridX = Math.floor((x + offsetX) / 100);
                    const gridY = Math.floor((y + offsetY) / 100);
                    const angle = (gridX + gridY + t * 0.001) * Math.PI * 0.5;
                    return { 
                        x: Math.cos(angle) * strength, 
                        y: Math.sin(angle) * strength 
                    };
                };
            
            case 'circle':
                return (x, y, t) => {
                    const { offsetX, offsetY } = this.getTileOffset(x, y, t, tileSize, tileShiftAmplitude);
                    const cx = x + offsetX - width / 2;
                    const cy = y + offsetY - height / 2;
                    const r = Math.sqrt(cx * cx + cy * cy);
                    const angle = Math.atan2(cy, cx) + t * 0.002;
                    // Circular flow around center
                    return { 
                        x: -Math.sin(angle) * strength, 
                        y: Math.cos(angle) * strength 
                    };
                };
            
            default: // 'radial'
                return (x, y, t) => {
                    const { offsetX, offsetY } = this.getTileOffset(x, y, t, tileSize, tileShiftAmplitude);
                    const adjustedX = x + offsetX;
                    const adjustedY = y + offsetY;
                    const nx = (adjustedX - width / 2) * 0.01;
                    const ny = (adjustedY - height / 2) * 0.01;
                    const n = this.noise(nx, ny, t * noiseTimeScale);
                    const cx = adjustedX - width / 2;
                    const cy = adjustedY - height / 2;
                    const r = Math.sqrt(cx * cx + cy * cy);
                    // Much gentler falloff, ensure flow everywhere
                    const falloff = 0.5 + 0.5 / (1 + r * 0.002);
                    const angle = n * Math.PI * 4 + Math.atan2(cy, cx);
                    return { 
                        x: Math.cos(angle) * falloff * strength, 
                        y: Math.sin(angle) * falloff * strength 
                    };
                };
        }
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