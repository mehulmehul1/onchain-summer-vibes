/**
 * MandalaPatternEnhanced.js - Galaxy Mandala Pattern
 * 
 * Enhanced mandala pattern with galaxy-like spiral arms, stellar formations,
 * and cosmic breathing animations for a more intricate and celestial appearance.
 */

export class MandalaPatternEnhanced {
    constructor() {
        this.name = 'Galaxy Mandala';
        this.type = 'mandala';
    }
    
    /**
     * Render enhanced galaxy mandala pattern
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} time - Animation time
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {Object} colors - Color theme
     * @param {Object} options - Pattern options
     */
    render(ctx, time, width, height, colors, options = {}) {
        const {
            // Core structure
            mandalaComplexity = 8,
            mandalaSpeed = 1.0,
            
            // Galaxy features
            spiralArms = 5,
            spiralTightness = 0.3,
            spiralLength = 2.5,
            
            // Stellar formations
            starDensity = 0.7,
            starSize = 1.5,
            starFlicker = 0.8,
            
            // Cosmic effects
            cosmicBreathing = 0.6,
            rotationSpeed = 0.2,
            pulseIntensity = 0.8,
            
            // Nebula effects
            nebulaLayers = 3,
            nebulaOpacity = 0.3,
            nebulaFlow = 0.4,
            
            // Ring systems
            ringCount = 5,
            ringVariation = 0.5,
            orbitalMotion = 0.3
        } = options;
        
        // Clear canvas with deep space background
        ctx.fillStyle = `rgb(${colors.background[0]}, ${colors.background[1]}, ${colors.background[2]})`;
        ctx.fillRect(0, 0, width, height);
        
        const animatedTime = time * mandalaSpeed;
        const centerX = width / 2;
        const centerY = height / 2;
        const maxRadius = Math.min(width, height) / 2.2;
        
        // Draw nebula background layers
        this.drawNebulaLayers(ctx, centerX, centerY, maxRadius, colors, animatedTime, nebulaLayers, nebulaOpacity, nebulaFlow);
        
        // Draw central galactic core
        this.drawGalacticCore(ctx, centerX, centerY, colors, animatedTime, pulseIntensity);
        
        // Draw spiral arms
        this.drawSpiralArms(ctx, centerX, centerY, maxRadius, colors, animatedTime, {
            spiralArms, spiralTightness, spiralLength, starDensity, starSize, starFlicker, rotationSpeed
        });
        
        // Draw concentric mandala layers
        this.drawMandalaLayers(ctx, centerX, centerY, maxRadius, colors, animatedTime, {
            mandalaComplexity, cosmicBreathing, rotationSpeed
        });
        
        // Draw orbital ring systems
        this.drawOrbitalRings(ctx, centerX, centerY, maxRadius, colors, animatedTime, {
            ringCount, ringVariation, orbitalMotion, starSize
        });
        
        // Draw cosmic connections (ley lines)
        this.drawCosmicConnections(ctx, centerX, centerY, maxRadius, colors, animatedTime, mandalaComplexity);
        
        // Draw stellar formations
        this.drawStellarFormations(ctx, centerX, centerY, maxRadius, colors, animatedTime, {
            starDensity, starSize, starFlicker
        });
    }
    
    /**
     * Draw nebula background layers for cosmic atmosphere
     */
    drawNebulaLayers(ctx, centerX, centerY, maxRadius, colors, time, layers, opacity, flow) {
        for (let layer = 0; layer < layers; layer++) {
            const radius = maxRadius * (0.3 + layer * 0.4);
            const points = 32 + layer * 8;
            const flowOffset = Math.sin(time * 0.01 + layer * 0.5) * flow * 50;
            
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            ctx.globalAlpha = opacity * (1 - layer * 0.2);
            
            // Create nebula gradient
            const gradient = ctx.createRadialGradient(
                centerX, centerY, radius * 0.5,
                centerX + flowOffset, centerY, radius
            );
            gradient.addColorStop(0, `rgba(${colors.accent[0]}, ${colors.accent[1]}, ${colors.accent[2]}, 0.6)`);
            gradient.addColorStop(0.5, `rgba(${colors.secondary[0]}, ${colors.secondary[1]}, ${colors.secondary[2]}, 0.3)`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(centerX + flowOffset, centerY, radius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }
    
    /**
     * Draw central galactic core with intense pulsing
     */
    drawGalacticCore(ctx, centerX, centerY, colors, time, intensity) {
        const corePulse = Math.sin(time * 0.02) * intensity;
        const coreSize = 8 + corePulse * 6;
        
        // Outer corona
        const coronaGradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, coreSize * 3
        );
        coronaGradient.addColorStop(0, `rgba(${colors.primary[0]}, ${colors.primary[1]}, ${colors.primary[2]}, 0.8)`);
        coronaGradient.addColorStop(0.3, `rgba(${colors.accent[0]}, ${colors.accent[1]}, ${colors.accent[2]}, 0.4)`);
        coronaGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = coronaGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, coreSize * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Inner core
        ctx.beginPath();
        ctx.arc(centerX, centerY, coreSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${colors.primary[0]}, ${colors.primary[1]}, ${colors.primary[2]}, ${0.9 + corePulse * 0.1})`;
        ctx.fill();
        
        // Core highlight
        ctx.beginPath();
        ctx.arc(centerX, centerY, coreSize * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + corePulse * 0.2})`;
        ctx.fill();
    }
    
    /**
     * Draw spiral galaxy arms with stars
     */
    drawSpiralArms(ctx, centerX, centerY, maxRadius, colors, time, config) {
        const { spiralArms, spiralTightness, spiralLength, starDensity, starSize, starFlicker, rotationSpeed } = config;
        
        for (let arm = 0; arm < spiralArms; arm++) {
            const armOffset = (arm / spiralArms) * Math.PI * 2;
            const rotation = time * rotationSpeed * 0.01;
            
            // Draw spiral curve
            ctx.save();
            ctx.strokeStyle = `rgba(${colors.secondary[0]}, ${colors.secondary[1]}, ${colors.secondary[2]}, 0.3)`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            for (let t = 0; t < spiralLength * Math.PI; t += 0.1) {
                const radius = (t / (spiralLength * Math.PI)) * maxRadius * 0.8;
                const angle = armOffset + t * spiralTightness + rotation;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                
                if (t === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
            ctx.restore();
            
            // Add stars along spiral arms
            const starCount = Math.floor(40 * starDensity);
            for (let i = 0; i < starCount; i++) {
                const t = (i / starCount) * spiralLength * Math.PI;
                const radius = (t / (spiralLength * Math.PI)) * maxRadius * 0.8;
                const angle = armOffset + t * spiralTightness + rotation;
                
                // Add some randomness to star positions
                const scatter = radius * 0.1;
                const x = centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * scatter;
                const y = centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * scatter;
                
                const flicker = Math.sin(time * 0.03 + i * 0.1) * starFlicker;
                const brightness = 0.3 + Math.abs(flicker) * 0.7;
                const size = starSize * (0.5 + Math.abs(flicker) * 0.5);
                
                this.drawStar(ctx, x, y, size, colors.accent, brightness);
            }
        }
    }
    
    /**
     * Draw concentric mandala layers with cosmic geometry
     */
    drawMandalaLayers(ctx, centerX, centerY, maxRadius, colors, time, config) {
        const { mandalaComplexity, cosmicBreathing, rotationSpeed } = config;
        
        for (let layer = 1; layer <= mandalaComplexity; layer++) {
            const radius = (layer / mandalaComplexity) * maxRadius * 0.7;
            const points = 6 + layer * 3;
            const layerRotation = time * rotationSpeed * 0.005 * (layer % 2 === 0 ? 1 : -1);
            
            for (let i = 0; i < points; i++) {
                const angle = (i / points) * Math.PI * 2 + layerRotation;
                const breathing = Math.sin(time * 0.02 + layer * 0.3 + i * 0.1) * cosmicBreathing;
                const adjustedRadius = radius * (1 + breathing * 0.2);
                
                const x = centerX + Math.cos(angle) * adjustedRadius;
                const y = centerY + Math.sin(angle) * adjustedRadius;
                
                const intensity = (Math.sin(time * 0.01 + layer * 0.5 + i * 0.2) + 1) / 2;
                const opacity = 0.4 + intensity * 0.5;
                const size = 2 + intensity * (3 + layer * 0.5);
                
                // Alternate between different cosmic shapes
                const shapeType = (layer + i) % 4;
                this.drawCosmicShape(ctx, x, y, size, shapeType, colors, opacity, layer);
            }
        }
    }
    
    /**
     * Draw orbital ring systems
     */
    drawOrbitalRings(ctx, centerX, centerY, maxRadius, colors, time, config) {
        const { ringCount, ringVariation, orbitalMotion, starSize } = config;
        
        for (let ring = 1; ring <= ringCount; ring++) {
            const baseRadius = (ring / ringCount) * maxRadius * 0.9;
            const orbitSpeed = orbitalMotion * 0.01 * (ring % 2 === 0 ? 1 : -1);
            const variation = Math.sin(time * 0.015 + ring * 0.8) * ringVariation;
            const radius = baseRadius * (1 + variation * 0.1);
            
            const ringPoints = 8 + ring * 4;
            const ringRotation = time * orbitSpeed;
            
            for (let i = 0; i < ringPoints; i++) {
                const angle = (i / ringPoints) * Math.PI * 2 + ringRotation;
                const orbitVariation = Math.sin(time * 0.02 + ring * 0.5 + i * 0.3) * 0.1;
                const adjustedRadius = radius * (1 + orbitVariation);
                
                const x = centerX + Math.cos(angle) * adjustedRadius;
                const y = centerY + Math.sin(angle) * adjustedRadius;
                
                const intensity = (Math.sin(time * 0.025 + ring * 0.7 + i * 0.4) + 1) / 2;
                const size = starSize * (0.8 + intensity * 0.7);
                const brightness = 0.3 + intensity * 0.6;
                
                this.drawStar(ctx, x, y, size, colors.accent, brightness);
            }
        }
    }
    
    /**
     * Draw cosmic connections (energy ley lines)
     */
    drawCosmicConnections(ctx, centerX, centerY, maxRadius, colors, time, complexity) {
        const connectionCount = complexity * 6;
        
        for (let i = 0; i < connectionCount; i++) {
            const angle = (i / connectionCount) * Math.PI * 2;
            const innerRadius = maxRadius * 0.2;
            const outerRadius = maxRadius * 0.8;
            
            const energy = Math.sin(time * 0.008 + i * 0.3);
            const opacity = 0.1 + Math.abs(energy) * 0.15;
            const width = 1 + Math.abs(energy) * 1.5;
            
            const x1 = centerX + Math.cos(angle) * innerRadius;
            const y1 = centerY + Math.sin(angle) * innerRadius;
            const x2 = centerX + Math.cos(angle) * outerRadius;
            const y2 = centerY + Math.sin(angle) * outerRadius;
            
            // Create energy gradient
            const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
            gradient.addColorStop(0, `rgba(${colors.primary[0]}, ${colors.primary[1]}, ${colors.primary[2]}, ${opacity})`);
            gradient.addColorStop(0.5, `rgba(${colors.accent[0]}, ${colors.accent[1]}, ${colors.accent[2]}, ${opacity * 0.8})`);
            gradient.addColorStop(1, `rgba(${colors.secondary[0]}, ${colors.secondary[1]}, ${colors.secondary[2]}, ${opacity * 0.3})`);
            
            ctx.save();
            ctx.strokeStyle = gradient;
            ctx.lineWidth = width;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.restore();
        }
    }
    
    /**
     * Draw stellar formations (constellation patterns)
     */
    drawStellarFormations(ctx, centerX, centerY, maxRadius, colors, time, config) {
        const { starDensity, starSize, starFlicker } = config;
        const starCount = Math.floor(80 * starDensity);
        
        for (let i = 0; i < starCount; i++) {
            const distance = Math.random() * maxRadius * 0.9;
            const angle = Math.random() * Math.PI * 2;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            const flicker = Math.sin(time * 0.02 + i * 0.15) * starFlicker;
            const brightness = 0.2 + Math.abs(flicker) * 0.6;
            const size = starSize * (0.3 + Math.abs(flicker) * 0.7) * (Math.random() * 0.5 + 0.5);
            
            // Use different colors for different star types
            const starType = i % 3;
            const starColor = starType === 0 ? colors.primary : 
                            starType === 1 ? colors.accent : colors.secondary;
            
            this.drawStar(ctx, x, y, size, starColor, brightness);
        }
    }
    
    /**
     * Draw a star with cross pattern
     */
    drawStar(ctx, x, y, size, color, brightness) {
        const opacity = brightness;
        
        // Star core
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;
        ctx.fill();
        
        // Star rays
        ctx.save();
        ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity * 0.6})`;
        ctx.lineWidth = size * 0.3;
        
        // Horizontal ray
        ctx.beginPath();
        ctx.moveTo(x - size * 2, y);
        ctx.lineTo(x + size * 2, y);
        ctx.stroke();
        
        // Vertical ray
        ctx.beginPath();
        ctx.moveTo(x, y - size * 2);
        ctx.lineTo(x, y + size * 2);
        ctx.stroke();
        
        ctx.restore();
    }
    
    /**
     * Draw cosmic shapes for mandala layers
     */
    drawCosmicShape(ctx, x, y, size, shapeType, colors, opacity, layer) {
        const colorIndex = layer % 3;
        const color = colorIndex === 0 ? colors.primary : 
                     colorIndex === 1 ? colors.secondary : colors.accent;
        
        ctx.save();
        ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;
        
        switch (shapeType) {
            case 0: // Star
                this.drawStar(ctx, x, y, size * 0.8, color, opacity);
                break;
            case 1: // Diamond
                ctx.beginPath();
                ctx.moveTo(x, y - size);
                ctx.lineTo(x + size, y);
                ctx.lineTo(x, y + size);
                ctx.lineTo(x - size, y);
                ctx.closePath();
                ctx.fill();
                break;
            case 2: // Hexagon
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2;
                    const hx = x + Math.cos(angle) * size;
                    const hy = y + Math.sin(angle) * size;
                    if (i === 0) ctx.moveTo(hx, hy);
                    else ctx.lineTo(hx, hy);
                }
                ctx.closePath();
                ctx.fill();
                break;
            case 3: // Circle
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
                break;
        }
        
        ctx.restore();
    }
    
    /**
     * Calculate pattern complexity
     */
    calculateComplexity(params = {}) {
        const {
            mandalaComplexity = 8,
            spiralArms = 5,
            starDensity = 0.7,
            nebulaLayers = 3,
            ringCount = 5
        } = params;
        
        let complexity = 30; // Base complexity
        
        complexity += Math.min(mandalaComplexity / 20, 1) * 25; // Mandala layers
        complexity += Math.min(spiralArms / 10, 1) * 20; // Spiral arms
        complexity += starDensity * 15; // Star density
        complexity += Math.min(nebulaLayers / 5, 1) * 5; // Nebula layers
        complexity += Math.min(ringCount / 10, 1) * 5; // Ring count
        
        return Math.min(Math.max(Math.round(complexity), 1), 100);
    }
}

export default MandalaPatternEnhanced;