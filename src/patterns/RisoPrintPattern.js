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
        
        const animatedTime = time * risoSpeed;
        
        // Create CMYK-style color separations
        const cmykColors = this.createCMYKSeparations(colors, colorSeparation);
        
        // Render each color separation layer with slight misregistration
        cmykColors.forEach((colorLayer, index) => {
            ctx.save();
            
            // Apply slight misregistration offset (like real RISO printing) - slower movement
            const offsetX = Math.sin(animatedTime * 0.003 * animationSmoothing + index) * printMisregistration;
            const offsetY = Math.cos(animatedTime * 0.003 * animationSmoothing + index) * printMisregistration;
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
                    halftoneSize,
                    gridIrregularity,
                    shapeVariation,
                    dotDensity,
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
     * Create CMYK-style color separations from theme colors
     */
    createCMYKSeparations(colors, separation) {
        const separations = [];
        
        // Simplified color separations - use main colors directly
        const colorKeys = ['primary', 'secondary', 'accent'];
        
        colorKeys.forEach((key, index) => {
            const baseColor = colors[key];
            
            separations.push({
                color: baseColor, // Use original color directly
                opacity: 0.7 + separation * 0.3,
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
        
        // Apply grid rotation - much slower
        ctx.translate(width / 2, height / 2);
        ctx.rotate(rotation + Math.sin(time * 0.001 * animationSmoothing) * 0.02);
        ctx.translate(-width / 2, -height / 2);
        
        for (let row = -1; row < gridRows; row++) {
            for (let col = -1; col < gridCols; col++) {
                // Base grid position
                let x = col * cellSize;
                let y = row * cellSize;
                
                // Add irregularity to grid - slower movement
                const irregularityX = (Math.sin(col * 0.5 + row * 0.3 + time * 0.002 * animationSmoothing) * gridIrregularity * cellSize);
                const irregularityY = (Math.cos(col * 0.3 + row * 0.5 + time * 0.002 * animationSmoothing) * gridIrregularity * cellSize);
                
                x += irregularityX;
                y += irregularityY;
                
                // Calculate density based on position and time
                const distanceFromCenter = Math.sqrt(
                    Math.pow(x - width / 2, 2) + Math.pow(y - height / 2, 2)
                );
                const densityFactor = 0.3 + Math.sin(distanceFromCenter * 0.01 + time * 0.005 * animationSmoothing) * 0.7;
                
                if (Math.random() < dotDensity * densityFactor) {
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
        
        // Calculate size with variation - slower size changes
        const baseSize = cellSize * 0.3;
        const sizeVariation = Math.sin(col * 7.1 + row * 11.3 + time * 0.008 * animationSmoothing) * shapeVariation;
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
        
        // Add slight rotation for organic feel - much slower
        const rotation = Math.sin(col * 3.7 + row * 5.3 + time * 0.005 * animationSmoothing) * 0.1;
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
                const aspectRatio = 0.6 + Math.random() * 0.8;
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