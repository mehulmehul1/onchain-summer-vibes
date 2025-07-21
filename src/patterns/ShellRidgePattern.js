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
        const { 
            shellRidgeRings = 25, 
            shellRidgeDistortion = 8,
            shellRidgeColorMode = false // false = gradient mode, true = distinct colors mode
        } = options;
        
        // The still point at the center of all motion
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Choose background based on color mode
        if (shellRidgeColorMode) {
            // Distinct colors mode - gradient background using multiple theme colors
            const gradient = ctx.createRadialGradient(
                centerX, centerY, 0,
                centerX, centerY, Math.max(width, height) * 0.6
            );
            
            // Multi-color gradient using all 4 colors
            gradient.addColorStop(0, `rgba(${colors.background[0]}, ${colors.background[1]}, ${colors.background[2]}, 1.0)`);
            gradient.addColorStop(0.3, `rgba(${colors.accent[0]}, ${colors.accent[1]}, ${colors.accent[2]}, 0.8)`);
            gradient.addColorStop(0.7, `rgba(${colors.secondary[0]}, ${colors.secondary[1]}, ${colors.secondary[2]}, 0.6)`);
            gradient.addColorStop(1, `rgba(${colors.primary[0]}, ${colors.primary[1]}, ${colors.primary[2]}, 0.4)`);
            
            ctx.fillStyle = gradient;
        } else {
            // Gradient mode - simple background color
            ctx.fillStyle = `rgb(${colors.background[0]}, ${colors.background[1]}, ${colors.background[2]})`;
        }
        ctx.fillRect(0, 0, width, height);
        const animatedTime = time * 5; // Much slower breathing animation
        
        // Create all ring paths first for filling between rings
        const ringPaths = [];
        for (let r = 0; r < shellRidgeRings; r++) {
            const baseRadius = 10 + r * Math.min(width, height) / (shellRidgeRings * 2);
            
            const path = new Path2D();
            for (let a = 0; a <= Math.PI * 2; a += 0.05) {
                const distortion = Math.sin(a * 8 + animatedTime * 0.75 + r * 0.5) * shellRidgeDistortion +
                                Math.sin(a * 12 - animatedTime * 1 + r * 0.3) * (shellRidgeDistortion * 0.625);
                
                const radius = baseRadius + distortion;
                const x = centerX + Math.cos(a) * radius;
                const y = centerY + Math.sin(a) * radius;
                
                if (a === 0) {
                    path.moveTo(x, y);
                } else {
                    path.lineTo(x, y);
                }
            }
            path.closePath();
            ringPaths.push(path);
        }
        
        // Fill rings based on color mode
        if (shellRidgeColorMode) {
            // Distinct colors mode - all 4 colors cycling
            for (let r = shellRidgeRings - 1; r >= 0; r--) {
                // Cycle through all 4 colors based on ring index
                const colorIndex = r % 4;
                let fillColor;
                switch (colorIndex) {
                    case 0: fillColor = colors.primary; break;
                    case 1: fillColor = colors.secondary; break;
                    case 2: fillColor = colors.accent; break;
                    case 3: fillColor = colors.background; break;
                }
                
                // High opacity for strong color visibility
                const fillOpacity = 0.8 - r * 0.015; 
                
                ctx.fillStyle = `rgba(${fillColor[0]}, ${fillColor[1]}, ${fillColor[2]}, ${Math.max(0.3, fillOpacity)})`;
                ctx.fill(ringPaths[r]);
            }
        } else {
            // Gradient mode - subtle alternating fills between rings
            for (let r = 0; r < shellRidgeRings - 1; r++) {
                ctx.save();
                
                // Alternate between secondary/accent colors with subtle gradient
                const isEvenRing = r % 2 === 0;
                const fillColor = isEvenRing ? colors.secondary : colors.accent;
                const fillOpacity = 0.3 - r * 0.01; // Subtle fills
                
                // Create gradient fill for each ring
                const ringGradient = ctx.createRadialGradient(
                    centerX, centerY, 10 + r * Math.min(width, height) / (shellRidgeRings * 2),
                    centerX, centerY, 10 + (r + 1) * Math.min(width, height) / (shellRidgeRings * 2)
                );
                
                ringGradient.addColorStop(0, `rgba(${fillColor[0]}, ${fillColor[1]}, ${fillColor[2]}, ${Math.max(0.1, fillOpacity)})`);
                ringGradient.addColorStop(1, `rgba(${fillColor[0]}, ${fillColor[1]}, ${fillColor[2]}, ${Math.max(0.05, fillOpacity * 0.5)})`);
                
                ctx.fillStyle = ringGradient;
                
                // Fill between rings
                ctx.globalCompositeOperation = 'source-over';
                ctx.fill(ringPaths[r + 1]);
                ctx.globalCompositeOperation = 'destination-out';
                ctx.fill(ringPaths[r]);
                ctx.globalCompositeOperation = 'source-over';
                
                ctx.restore();
            }
        }
        
        // Draw ring outlines based on color mode
        for (let r = 0; r < shellRidgeRings; r++) {
            if (shellRidgeColorMode) {
                // Distinct colors mode - all 4 colors cycling for outlines
                ctx.lineWidth = 2.0 + Math.sin(r * 0.5 + animatedTime * 0.002) * 0.5;
                
                // Cycle through all 4 colors for outline
                const outlineColorIndex = (r + 2) % 4; // Offset by 2 to contrast with fill
                let outlineColor;
                switch (outlineColorIndex) {
                    case 0: outlineColor = colors.primary; break;
                    case 1: outlineColor = colors.secondary; break;
                    case 2: outlineColor = colors.accent; break;
                    case 3: outlineColor = colors.background; break;
                }
                
                const opacity = 0.9 - r * 0.02; // Higher opacity for better visibility
                ctx.strokeStyle = `rgba(${outlineColor[0]}, ${outlineColor[1]}, ${outlineColor[2]}, ${Math.max(0.4, opacity)})`;
            } else {
                // Gradient mode - primary color outlines with varying thickness
                ctx.lineWidth = 1.5 + Math.sin(r * 0.5 + animatedTime * 0.002) * 0.5;
                const opacity = 0.8 - r * 0.02;
                ctx.strokeStyle = `rgba(${colors.primary[0]}, ${colors.primary[1]}, ${colors.primary[2]}, ${Math.max(0.2, opacity)})`;
            }
            
            ctx.stroke(ringPaths[r]);
            
            // The infinite in the finite - texture dots for each ring with color mode awareness
            const currentBaseRadius = 10 + r * Math.min(width, height) / (shellRidgeRings * 2);
            for (let t = 0; t < 60; t++) {  // Each point contains the whole
                const angle = (t / 60) * Math.PI * 2;
                const textureRadius = currentBaseRadius + Math.sin(angle * 8 + animatedTime * 0.003) * 5;
                const tx = centerX + Math.cos(angle) * textureRadius;
                const ty = centerY + Math.sin(angle) * textureRadius;
                
                let dotColor, textureOpacity;
                
                if (shellRidgeColorMode) {
                    // Distinct colors mode - cycle through all 4 colors for texture dots
                    const dotColorIndex = (r + t) % 4;
                    switch (dotColorIndex) {
                        case 0: dotColor = colors.primary; break;
                        case 1: dotColor = colors.secondary; break;
                        case 2: dotColor = colors.accent; break;
                        case 3: dotColor = colors.background; break;
                    }
                    textureOpacity = 0.4 - r * 0.015;
                } else {
                    // Gradient mode - use accent color for subtle texture
                    dotColor = colors.accent;
                    textureOpacity = 0.2 - r * 0.01;
                }
                
                ctx.beginPath();
                ctx.arc(tx, ty, 0.8 + Math.sin(t * 0.1 + animatedTime * 0.001) * 0.3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${dotColor[0]}, ${dotColor[1]}, ${dotColor[2]}, ${Math.max(0.05, textureOpacity)})`;
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