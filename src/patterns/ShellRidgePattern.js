/**
 * ShellRidgePattern.js - Shell Ridge Texture Pattern
 * 
 * JavaScript version of the shell ridge pattern with concentric rings
 * Converted from React TypeScript ShellRidgePattern.ts
 */

export class ShellRidgePattern {
    constructor() {
        this.name = 'Shell Ridge';
        this.type = 'shellridge';
    }
    
    /**
     * Render shell ridge pattern
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} time - Animation time
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {Object} colors - Color theme
     * @param {Object} options - Pattern options
     */
    render(ctx, time, width, height, colors, options = {}) {
        const { shellRidgeRings = 25, shellRidgeDistortion = 8 } = options;
        
        // Clear canvas with background color
        ctx.fillStyle = `rgb(${colors.background[0]}, ${colors.background[1]}, ${colors.background[2]})`;
        ctx.fillRect(0, 0, width, height);
        
        // The still point at the center of all motion
        const centerX = width / 2;
        const centerY = height / 2;
        const animatedTime = time * 100; // Scale time for smoother animation
        
        // Without going outside, see the pattern of creation
        for (let r = 0; r < shellRidgeRings; r++) {
            const baseRadius = 10 + r * Math.min(width, height) / (shellRidgeRings * 2);  // Each circle a world within worlds
            
            ctx.beginPath();
            for (let a = 0; a <= Math.PI * 2; a += 0.05) {
                // The dance of form and emptiness
                const distortion = Math.sin(a * 8 + animatedTime * 0.75 + r * 0.5) * shellRidgeDistortion +  // Breath of life
                                Math.sin(a * 12 - animatedTime * 1 + r * 0.3) * (shellRidgeDistortion * 0.625);       // Pulse of being
                
                const radius = baseRadius + distortion;
                const x = centerX + Math.cos(a) * radius;
                const y = centerY + Math.sin(a) * radius;
                
                if (a === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            
            // Seeing the subtle within the obvious
            ctx.lineWidth = 1.5 + Math.sin(r * 0.5 + animatedTime * 0.01) * 0.5;  // The way things change
            const opacity = 0.6 - r * 0.02;
            ctx.strokeStyle = `rgba(${colors.primary[0]}, ${colors.primary[1]}, ${colors.primary[2]}, ${Math.max(0.1, opacity)})`;  // From form to formless
            ctx.stroke();
            
            // The infinite in the finite
            for (let t = 0; t < 60; t++) {  // Each point contains the whole
                const angle = (t / 60) * Math.PI * 2;
                const textureRadius = baseRadius + Math.sin(angle * 8 + animatedTime * 1.5 * 0.01) * 5;
                const tx = centerX + Math.cos(angle) * textureRadius;
                const ty = centerY + Math.sin(angle) * textureRadius;
                
                ctx.beginPath();
                ctx.arc(tx, ty, 0.5, 0, Math.PI * 2);
                const textureOpacity = 0.2 - r * 0.01;
                ctx.fillStyle = `rgba(${colors.accent[0]}, ${colors.accent[1]}, ${colors.accent[2]}, ${Math.max(0.05, textureOpacity)})`;
                ctx.fill();
            }
        }
    }

    /**
     * Calculate pattern complexity based on parameters
     * @param {Object} params - Pattern parameters
     * @returns {number} - Complexity score (1-100)
     */
    calculateComplexity(params = {}) {
        const { shellRidgeRings = 25, shellRidgeDistortion = 8 } = params;
        
        // Base complexity starts at 30
        let complexity = 30;
        
        // Number of rings contributes most to complexity (45 points max)
        const ringsFactor = Math.min(shellRidgeRings / 50, 1); // Normalize to 0-1
        complexity += ringsFactor * 45;
        
        // Distortion adds computational complexity (20 points max)
        const distortionFactor = Math.min(shellRidgeDistortion / 15, 1); // Normalize to 0-1
        complexity += distortionFactor * 20;
        
        // Additional complexity from textured surfaces and breathing effects
        complexity += 5; // Fixed bonus for textural complexity
        
        return Math.min(Math.max(Math.round(complexity), 1), 100);
    }
}

export default ShellRidgePattern;