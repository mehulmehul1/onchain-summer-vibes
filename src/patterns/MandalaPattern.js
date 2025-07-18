/**
 * MandalaPattern.js - Geometric Mandala Pattern
 * 
 * JavaScript version of the mandala pattern with breathing animations
 * Converted from React TypeScript MandalaPattern.ts
 */

export class MandalaPattern {
    constructor() {
        this.name = 'Mandala';
        this.type = 'mandala';
    }
    
    /**
     * Render geometric mandala pattern
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} time - Animation time
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {Object} colors - Color theme
     * @param {Object} options - Pattern options
     */
    render(ctx, time, width, height, colors, options = {}) {
        const { mandalaComplexity = 6, mandalaSpeed = 1.0 } = options;
        
        // Clear canvas with background color
        ctx.fillStyle = `rgb(${colors.background[0]}, ${colors.background[1]}, ${colors.background[2]})`;
        ctx.fillRect(0, 0, width, height);
        
        const animatedTime = time * mandalaSpeed;
        const centerX = width / 2;
        const centerY = height / 2;
        const baseRadius = Math.min(width, height) / 8;
        
        // Draw center point
        const centerIntensity = (Math.sin(animatedTime * 0.025) + 1) / 2;
        const centerSize = 3 + centerIntensity * 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, centerSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${colors.primary[0]}, ${colors.primary[1]}, ${colors.primary[2]}, ${0.8 + centerIntensity * 0.2})`;
        ctx.fill();
        
        // Draw concentric layers
        for (let layer = 0; layer < mandalaComplexity; layer++) {
            const radius = baseRadius * (1 + layer * 0.7);
            const points = 6 + layer * 2;
            
            for (let i = 0; i < points; i++) {
                const angle = (i / points) * Math.PI * 2;
                const breathingFactor = 0.3 * Math.sin(animatedTime * 0.025 + layer * 0.5 + i * 0.2);
                const x = centerX + Math.cos(angle) * (radius + breathingFactor * radius);
                const y = centerY + Math.sin(angle) * (radius + breathingFactor * radius);
                
                const intensityPhase = (Math.sin(animatedTime * 0.015 + layer * 0.4 + i * 0.8) + 1) / 2;
                const opacity = 0.3 + intensityPhase * 0.6;
                const size = 2 + intensityPhase * (4 + layer);
                
                ctx.beginPath();
                if (layer % 3 === 0) {
                    // Circles
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${colors.primary[0]}, ${colors.primary[1]}, ${colors.primary[2]}, ${opacity})`;
                    ctx.fill();
                } else if (layer % 3 === 1) {
                    // Squares
                    ctx.rect(x - size, y - size, size * 2, size * 2);
                    ctx.fillStyle = `rgba(${colors.secondary[0]}, ${colors.secondary[1]}, ${colors.secondary[2]}, ${opacity})`;
                    ctx.fill();
                } else {
                    // Diamonds
                    ctx.moveTo(x, y - size);
                    ctx.lineTo(x + size, y);
                    ctx.lineTo(x, y + size);
                    ctx.lineTo(x - size, y);
                    ctx.closePath();
                    ctx.fillStyle = `rgba(${colors.accent[0]}, ${colors.accent[1]}, ${colors.accent[2]}, ${opacity})`;
                    ctx.fill();
                }
                
                // Draw secondary elements
                if (layer > 0 && i % 2 === 0) {
                    const secondaryRadius = radius * 0.6;
                    const x2 = centerX + Math.cos(angle + 0.3) * secondaryRadius;
                    const y2 = centerY + Math.sin(angle + 0.3) * secondaryRadius;
                    
                    const secondaryIntensity = (Math.sin(animatedTime * 0.02 + layer * 0.3 + i) + 1) / 2;
                    const secondaryOpacity = 0.2 + secondaryIntensity * 0.4;
                    const secondarySize = 1 + secondaryIntensity * 2;
                    
                    ctx.beginPath();
                    ctx.arc(x2, y2, secondarySize, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${colors.secondary[0]}, ${colors.secondary[1]}, ${colors.secondary[2]}, ${secondaryOpacity})`;
                    ctx.fill();
                }
            }
        }
        
        // Draw connecting lines
        const numConnections = Math.floor(mandalaComplexity * 8);
        for (let i = 0; i < numConnections; i++) {
            const angle = (i / numConnections) * Math.PI * 2;
            const radius1 = baseRadius * 0.5;
            const radius2 = baseRadius * (2 + mandalaComplexity * 0.5);
            
            const x1 = centerX + Math.cos(angle) * radius1;
            const y1 = centerY + Math.sin(angle) * radius1;
            const x2 = centerX + Math.cos(angle) * radius2;
            const y2 = centerY + Math.sin(angle) * radius2;
            
            const lineIntensity = (Math.sin(animatedTime * 0.01 + i * 0.2) + 1) / 2;
            const lineOpacity = 0.1 + lineIntensity * 0.2;
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = `rgba(${colors.primary[0]}, ${colors.primary[1]}, ${colors.primary[2]}, ${lineOpacity})`;
            ctx.lineWidth = 1 + lineIntensity;
            ctx.stroke();
        }
        
        // Draw concentric rings with dots
        for (let ring = 1; ring <= 3; ring++) {
            const ringRadius = baseRadius * (0.3 + ring * 0.4);
            const ringPoints = ring * 8;
            
            for (let i = 0; i < ringPoints; i++) {
                const angle = (i / ringPoints) * Math.PI * 2;
                const breathingOffset = Math.sin(animatedTime * 0.03 + ring * 0.8 + i * 0.1) * (ringRadius * 0.1);
                const x = centerX + Math.cos(angle) * (ringRadius + breathingOffset);
                const y = centerY + Math.sin(angle) * (ringRadius + breathingOffset);
                
                const dotIntensity = (Math.sin(animatedTime * 0.025 + ring * 0.5 + i * 0.3) + 1) / 2;
                const dotOpacity = 0.2 + dotIntensity * 0.5;
                const dotSize = 1 + dotIntensity * 2;
                
                ctx.beginPath();
                ctx.arc(x, y, dotSize, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${colors.accent[0]}, ${colors.accent[1]}, ${colors.accent[2]}, ${dotOpacity})`;
                ctx.fill();
            }
        }
    }
}

export default MandalaPattern;