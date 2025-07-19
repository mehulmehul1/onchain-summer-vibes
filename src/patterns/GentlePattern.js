/**
 * GentlePattern.js - Gentle Flowing Lines Pattern
 * 
 * JavaScript version of the gentle pattern with flowing sinusoidal lines
 * Converted from React TypeScript GentlePattern.ts
 */

export class GentlePattern {
    constructor() {
        this.name = 'Gentle';
        this.type = 'gentle';
    }
    
    /**
     * Render gentle flowing lines pattern
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} time - Animation time
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {Object} colors - Color theme
     * @param {Object} options - Pattern options
     */
    render(ctx, time, width, height, colors, options = {}) {
        const { wavelength = 25, lineDensity = 35 } = options;
        
        // Clear canvas with background color
        ctx.fillStyle = `rgb(${colors.background[0]}, ${colors.background[1]}, ${colors.background[2]})`;
        ctx.fillRect(0, 0, width, height);
        
        const stepSize = Math.max(4, Math.ceil(width / 300));
        
        // Draw horizontal flowing lines
        const numHorizontalLines = Math.min(lineDensity, Math.ceil(height / 20));
        for (let i = 0; i < numHorizontalLines; i++) {
            const yPos = (i / numHorizontalLines) * height;
            const amplitude = (35 + 20 * Math.sin(time * 0.2 + i * 0.1)) * (wavelength / 25);
            const frequency = (0.008 + 0.004 * Math.sin(time * 0.1 + i * 0.05)) * (25 / wavelength);
            const speedOffset = time * (0.5 + 0.3 * Math.sin(i * 0.1));
            const thickness = 1.5 + 1.0 * Math.sin(time + i * 0.2);
            const opacity = 0.4 + 0.3 * Math.abs(Math.sin(time * 0.3 + i * 0.15));
            
            ctx.beginPath();
            ctx.lineWidth = thickness;
            ctx.strokeStyle = `rgba(${colors.primary[0]}, ${colors.primary[1]}, ${colors.primary[2]}, ${opacity})`;
            
            let firstPoint = true;
            for (let x = 0; x < width; x += stepSize) {
                const y = yPos + amplitude * Math.sin(x * frequency + speedOffset);
                if (firstPoint) {
                    ctx.moveTo(x, y);
                    firstPoint = false;
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        }
        
        // Draw vertical flowing lines
        const numVerticalLines = Math.min(lineDensity, Math.ceil(width / 25));
        for (let i = 0; i < numVerticalLines; i++) {
            const xPos = (i / numVerticalLines) * width;
            const amplitude = (30 + 15 * Math.sin(time * 0.15 + i * 0.12)) * (wavelength / 25);
            const frequency = (0.009 + 0.004 * Math.cos(time * 0.12 + i * 0.07)) * (25 / wavelength);
            const speedOffset = time * (0.4 + 0.25 * Math.cos(i * 0.15));
            const thickness = 1.2 + 0.8 * Math.sin(time + i * 0.3);
            const opacity = 0.3 + 0.2 * Math.abs(Math.sin(time * 0.25 + i * 0.18));
            
            ctx.beginPath();
            ctx.lineWidth = thickness;
            ctx.strokeStyle = `rgba(${colors.secondary[0]}, ${colors.secondary[1]}, ${colors.secondary[2]}, ${opacity})`;
            
            let firstPoint = true;
            for (let y = 0; y < height; y += stepSize) {
                const x = xPos + amplitude * Math.sin(y * frequency + speedOffset);
                if (firstPoint) {
                    ctx.moveTo(x, y);
                    firstPoint = false;
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        }
        
        // Draw diagonal flowing lines
        const numDiagonalLines = Math.min(Math.ceil(lineDensity / 2), Math.ceil(width / 80));
        for (let i = 0; i < numDiagonalLines; i++) {
            const offset = (i / numDiagonalLines) * width * 1.5 - width * 0.25;
            const amplitude = (20 + 10 * Math.cos(time * 0.25 + i * 0.1)) * (wavelength / 25);
            const frequency = (0.01 + 0.005 * Math.sin(time * 0.15 + i * 0.08)) * (25 / wavelength);
            const phase = time * (0.3 + 0.2 * Math.sin(i * 0.1));
            const thickness = 1.0 + 0.5 * Math.sin(time + i * 0.25);
            const opacity = 0.2 + 0.15 * Math.abs(Math.sin(time * 0.2 + i * 0.1));
            
            ctx.beginPath();
            ctx.lineWidth = thickness;
            ctx.strokeStyle = `rgba(${colors.accent[0]}, ${colors.accent[1]}, ${colors.accent[2]}, ${opacity})`;
            
            const steps = Math.ceil(height / stepSize);
            let firstPoint = true;
            for (let j = 0; j <= steps; j++) {
                const progress = j / steps;
                const x = offset + progress * width;
                const y = progress * height + amplitude * Math.sin(progress * 8 + phase);
                
                if (x >= 0 && x <= width && y >= 0 && y <= height) {
                    if (firstPoint) {
                        ctx.moveTo(x, y);
                        firstPoint = false;
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
            }
            ctx.stroke();
        }
    }

    /**
     * Calculate pattern complexity based on parameters
     * @param {Object} params - Pattern parameters
     * @returns {number} - Complexity score (1-100)
     */
    calculateComplexity(params = {}) {
        const { wavelength = 25, lineDensity = 35 } = params;
        
        // Base complexity starts at 20
        let complexity = 20;
        
        // Line density contributes most to complexity (40 points max)
        const densityFactor = Math.min(lineDensity / 100, 1); // Normalize to 0-1
        complexity += densityFactor * 40;
        
        // Wavelength affects complexity inversely (smaller wavelength = more complex)
        const wavelengthFactor = Math.max(0, 1 - (wavelength / 100)); // Normalize inversely
        complexity += wavelengthFactor * 30;
        
        // Additional complexity from multiple line types (horizontal, vertical, diagonal)
        complexity += 10; // Fixed bonus for multi-directional lines
        
        return Math.min(Math.max(Math.round(complexity), 1), 100);
    }
}

export default GentlePattern;