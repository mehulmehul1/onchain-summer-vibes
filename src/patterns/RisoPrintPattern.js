/**
 * RisoPrintPattern.js - RISO Print Style Pattern
 * 
 * Inspired by RISO printing aesthetics with CMYK halftone dots,
 * irregular grids, and geometric shapes with overprinting effects
 */

export class RisoPrintPattern {
    constructor() {
        this.name = 'RISO Print';
        this.type = 'risoprint';
        
        // Animation parameters for smooth parameter changes
        this.animationParams = {
            irregularitySpeed: 0.2,    // Speed of irregularity animation
            densitySpeed: 0.15,        // Speed of dot density animation
            halftoneSpeed: 0.25,       // Speed of halftone size animation
            timeOffset: Math.random() * Math.PI * 2  // Random offset for varied start
        };
    }
    
    /**
     * Update animated parameters for smooth oscillations
     */
    updateAnimatedParameters(time) {
        const offsetTime = time + this.animationParams.timeOffset;
        
        // Animate grid irregularity between 0.1 and 0.5 with smooth sine wave
        const irregularityCycle = Math.sin(offsetTime * this.animationParams.irregularitySpeed) * 0.5 + 0.5;
        const animatedIrregularity = 0.1 + (irregularityCycle * 0.4); // 0.1 to 0.5 range
        
        // Animate dot density between 0.2 and 0.9 with smooth sine wave
        const densityCycle = Math.sin(offsetTime * this.animationParams.densitySpeed + Math.PI * 0.4) * 0.5 + 0.5;
        const animatedDensity = 0.2 + (densityCycle * 0.7); // 0.2 to 0.9 range
        
        // Animate halftone size between 6 and 30 with smooth sine wave
        const halftoneCycle = Math.sin(offsetTime * this.animationParams.halftoneSpeed + Math.PI * 0.6) * 0.5 + 0.5;
        const animatedHalftoneSize = 6 + (halftoneCycle * 24); // 6 to 30 range
        
        return {
            irregularity: animatedIrregularity,
            density: animatedDensity,
            halftoneSize: animatedHalftoneSize
        };
    }
    
    /**
     * Render RISO print pattern with halftone dots and irregular grids
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} time - Animation time
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {Object} colors - Color theme
     * @param {Object} options - Pattern options
     */
    render(ctx, time, width, height, colors, options = {}) {
        const { 
            risoComplexity = 8,
            risoSpeed = 1.0,
            halftoneSize = 12,
            gridIrregularity = 0.3,
            shapeVariation = 0.8,
            colorSeparation = 0.4,
            overprint = true,
            dotDensity = 0.7,
            gridRotation = 0.1,
            printMisregistration = 2.0,
            animationSmoothing = 0.3
        } = options;
        
        // Clear canvas with background
        ctx.fillStyle = `rgb(${colors.background[0]}, ${colors.background[1]}, ${colors.background[2]})`;
        ctx.fillRect(0, 0, width, height);
        
        const animatedTime = time * risoSpeed * 0.1; // Much slower overall animation
        
        // Get smooth animated parameters (will be blended with user controls)
        const animatedParams = this.updateAnimatedParameters(time);
        
        // Create 4-color separations using all theme colors
        const cmykColors = this.createCMYKSeparations(colors, colorSeparation);
        
        // Render each color separation layer with slight misregistration
        cmykColors.forEach((colorLayer, index) => {
            ctx.save();
            
            // Apply slight misregistration offset (like real RISO printing) - very slow movement
            const offsetX = Math.sin(animatedTime * 0.0005 + index) * printMisregistration;
            const offsetY = Math.cos(animatedTime * 0.0005 + index) * printMisregistration;
            ctx.translate(offsetX, offsetY);
            
            // Set blend mode for overprinting effect (use lighter blend mode)
            if (overprint && index > 0) {
                ctx.globalCompositeOperation = 'screen';
            }
            
            // Render this color layer
            this.renderColorLayer(
                ctx, 
                width, 
                height, 
                colorLayer, 
                animatedTime, 
                {
                    risoComplexity,
                    halftoneSize: halftoneSize * (animatedParams.halftoneSize / 18), // Blend user control with animation
                    gridIrregularity: gridIrregularity * (animatedParams.irregularity / 0.3), // Blend user control with animation  
                    shapeVariation,
                    dotDensity: dotDensity * (animatedParams.density / 0.55), // Blend user control with animation
                    gridRotation,
                    layerIndex: index,
                    animationSmoothing
                }
            );
            
            ctx.restore();
        });
        
        // Add subtle texture overlay for RISO paper texture (only if explicitly enabled)
        if (options.risoTexture !== false) {
            this.addRisoTexture(ctx, width, height, animatedTime, 0.02);
        }
    }
    
    /**
     * Create 4-color separations from all theme colors
     */
    createCMYKSeparations(colors, separation) {
        const separations = [];
        
        // Use all 4 theme colors for ink layers
        const colorKeys = ['primary', 'secondary', 'accent', 'background'];
        
        colorKeys.forEach((key, index) => {
            const baseColor = colors[key];
            
            separations.push({
                color: baseColor, // Use original color directly
                opacity: 0.8, // Fixed opacity for stable layers
                offset: index * separation,
                toneVariation: 1.0
            });
        });
        
        return separations;
    }
    
    /**
     * Render a single color layer with halftone dots and shapes
     */
    renderColorLayer(ctx, width, height, colorLayer, time, options) {
        const {
            risoComplexity,
            halftoneSize,
            gridIrregularity,
            shapeVariation,
            dotDensity,
            gridRotation,
            layerIndex,
            animationSmoothing = 0.3
        } = options;
        
        const cellSize = halftoneSize * (1 + layerIndex * 0.2);
        const rotation = gridRotation * layerIndex;
        
        // Calculate grid dimensions with irregularity
        const gridCols = Math.floor(width / cellSize) + 2;
        const gridRows = Math.floor(height / cellSize) + 2;
        
        ctx.save();
        ctx.globalAlpha = colorLayer.opacity;
        
        // Apply grid rotation - very slow
        ctx.translate(width / 2, height / 2);
        ctx.rotate(rotation + Math.sin(time * 0.001) * 0.01);
        ctx.translate(-width / 2, -height / 2);
        
        for (let row = -1; row < gridRows; row++) {
            for (let col = -1; col < gridCols; col++) {
                // Base grid position
                let x = col * cellSize;
                let y = row * cellSize;
                
                // Add irregularity to grid - very slow movement
                const irregularityX = (Math.sin(col * 0.5 + row * 0.3 + time * 0.002) * gridIrregularity * cellSize);
                const irregularityY = (Math.cos(col * 0.3 + row * 0.5 + time * 0.002) * gridIrregularity * cellSize);
                
                x += irregularityX;
                y += irregularityY;
                
                // Calculate density based on position and time - deterministic
                const distanceFromCenter = Math.sqrt(
                    Math.pow(x - width / 2, 2) + Math.pow(y - height / 2, 2)
                );
                const densityFactor = 0.3 + Math.sin(distanceFromCenter * 0.01 + time * 0.003) * 0.7;
                
                // Use deterministic pattern instead of random for stable dots
                const dotPattern = Math.sin(col * 7.3 + row * 11.7 + layerIndex * 5.1) * 0.5 + 0.5;
                if (dotPattern < dotDensity * densityFactor) {
                    this.renderHalftoneElement(
                        ctx, 
                        x, 
                        y, 
                        cellSize, 
                        colorLayer, 
                        {
                            shapeVariation,
                            layerIndex,
                            gridPosition: { col, row },
                            time,
                            densityFactor,
                            animationSmoothing
                        }
                    );
                }
            }
        }
        
        ctx.restore();
    }
    
    /**
     * Render individual halftone elements (dots, squares, shapes)
     */
    renderHalftoneElement(ctx, x, y, cellSize, colorLayer, options) {
        const {
            shapeVariation,
            layerIndex,
            gridPosition,
            time,
            densityFactor,
            animationSmoothing = 0.3
        } = options;
        
        const { col, row } = gridPosition;
        
        // Determine shape type based on variation and position
        const shapeRandom = Math.sin(col * 13.7 + row * 17.3 + layerIndex * 23.1) * 0.5 + 0.5;
        const shapeType = shapeRandom < 0.3 ? 'circle' : 
                         shapeRandom < 0.6 ? 'square' :
                         shapeRandom < 0.8 ? 'rectangle' : 'diamond';
        
        // Calculate size with variation - very slow size changes
        const baseSize = cellSize * 0.3;
        const sizeVariation = Math.sin(col * 7.1 + row * 11.3 + time * 0.001) * shapeVariation;
        const size = baseSize * (0.5 + densityFactor * 0.5) * (1 + sizeVariation * 0.5);
        
        // Set color with slight variation
        const colorVariation = Math.sin(col * 5.7 + row * 8.9) * 0.1;
        const finalColor = [
            Math.max(0, Math.min(255, colorLayer.color[0] * (1 + colorVariation))),
            Math.max(0, Math.min(255, colorLayer.color[1] * (1 + colorVariation))),
            Math.max(0, Math.min(255, colorLayer.color[2] * (1 + colorVariation)))
        ];
        
        ctx.fillStyle = `rgb(${finalColor[0]}, ${finalColor[1]}, ${finalColor[2]})`;
        
        // Render shape
        ctx.save();
        ctx.translate(x, y);
        
        // Add slight rotation for organic feel - very slow
        const rotation = Math.sin(col * 3.7 + row * 5.3 + time * 0.0008) * 0.05;
        ctx.rotate(rotation);
        
        this.drawShape(ctx, shapeType, size);
        
        ctx.restore();
    }
    
    /**
     * Draw different halftone shapes
     */
    drawShape(ctx, shapeType, size) {
        ctx.beginPath();
        
        switch (shapeType) {
            case 'circle':
                ctx.arc(0, 0, size, 0, Math.PI * 2);
                break;
                
            case 'square':
                ctx.rect(-size, -size, size * 2, size * 2);
                break;
                
            case 'rectangle':
                // Use deterministic aspect ratio based on position to avoid flickering
                const aspectRatio = 0.6 + (Math.sin(size * 17.3) * 0.5 + 0.5) * 0.8;
                ctx.rect(-size, -size * aspectRatio, size * 2, size * aspectRatio * 2);
                break;
                
            case 'diamond':
                ctx.moveTo(0, -size);
                ctx.lineTo(size, 0);
                ctx.lineTo(0, size);
                ctx.lineTo(-size, 0);
                ctx.closePath();
                break;
        }
        
        ctx.fill();
    }
    
    /**
     * Add RISO paper texture overlay
     */
    addRisoTexture(ctx, width, height, time, intensity) {
        // Skip texture overlay for now to prevent black fill issue
        return;
        
        // Simple grain texture instead of full image data
        ctx.save();
        ctx.globalAlpha = intensity * 0.3;
        ctx.globalCompositeOperation = 'overlay';
        
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 2;
            const alpha = Math.random() * 0.1;
            
            ctx.globalAlpha = alpha;
            ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#000000';
            ctx.fillRect(x, y, size, size);
        }
        
        ctx.restore();
    }
    
    /**
     * Calculate pattern complexity
     */
    calculateComplexity(params = {}) {
        const {
            risoComplexity = 8,
            halftoneSize = 12,
            dotDensity = 0.7,
            gridIrregularity = 0.3,
            shapeVariation = 0.8
        } = params;
        
        let complexity = 35; // Base complexity for RISO printing
        
        complexity += Math.min(risoComplexity / 20, 1) * 30; // Pattern complexity
        complexity += (1 - Math.min(halftoneSize / 30, 1)) * 20; // Smaller dots = more complex
        complexity += dotDensity * 10; // Density affects complexity
        complexity += gridIrregularity * 5; // Irregularity adds complexity
        complexity += shapeVariation * 5; // Shape variation
        
        return Math.min(Math.max(Math.round(complexity), 1), 100);
    }
}

export default RisoPrintPattern;