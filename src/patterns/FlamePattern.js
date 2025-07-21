/**
 * FlamePattern.js - Flowing Flame Pattern
 * 
 * Creates organic, flowing flames with layered colors, turbulence effects,
 * and animated flickering inspired by Japanese artistic flame imagery
 */

export class FlamePattern {
    constructor() {
        this.name = 'Flame';
        this.type = 'flame';
        this.flames = [];
        this.noiseOffset = 0;
    }
    
    /**
     * Render flowing flame pattern with organic shapes and color gradients
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} time - Animation time
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {Object} colors - Color theme
     * @param {Object} options - Pattern options
     */
    render(ctx, time, width, height, colors, options = {}) {
        const { 
            flameHeight = 0.8,
            flameSpeed = 1.0,
            flameIntensity = 0.7,
            flameComplexity = 6,
            flameFlicker = 0.5,
            flameTurbulence = 0.3,
            flameGradientSteps = 8,
            flameLayerCount = 4,
            flameOpacity = 0.8,
            flameCurl = 0.6,
            flameWidth = 0.5,
            flameSpread = 0.4
        } = options;
        
        // Clear canvas with background color (distinct background)
        ctx.fillStyle = `rgb(${colors.background[0]}, ${colors.background[1]}, ${colors.background[2]})`;
        ctx.fillRect(0, 0, width, height);
        
        // Faster animation timing for visible flame motion
        const animatedTime = time * flameSpeed * 0.001; // Much faster time progression
        this.noiseOffset += flameSpeed * 0.01; // Faster noise evolution
        
        // Simplified lifecycle: always visible flames with gentle pulsing
        const pulseCycle = 5.0; // 5 second pulse cycles
        const pulsePhase = (time * 0.1) % pulseCycle;
        const pulseIntensity = 0.8 + 0.2 * Math.sin(pulsePhase * Math.PI * 2 / pulseCycle); // Pulse between 0.8-1.0
        
        // Always keep flames visible - no ignition/fade cycles
        const ignitionProgress = 1.0; // Always fully ignited
        const fadeProgress = 1.0; // Never fade
        
        // Create flame color palette from theme colors
        const flameColors = this.createFlameColorPalette(colors, flameGradientSteps);
        
        // Apply pulsing effects instead of lifecycle
        const lifecycleOpacity = pulseIntensity; // Use pulse instead of lifecycle
        const lifecycleIntensity = flameIntensity * pulseIntensity;
        const lifecycleHeight = flameHeight; // Always full height
        
        // Render flame layers from back to front for depth
        for (let layer = flameLayerCount - 1; layer >= 0; layer--) {
            const layerOpacity = flameOpacity * (0.3 + 0.7 * (layer / flameLayerCount)) * lifecycleOpacity;
            const layerScale = 0.6 + 0.4 * (layer / flameLayerCount);
            const layerOffset = layer * 0.1;
            
            this.renderFlameLayer(
                ctx, 
                width, 
                height, 
                flameColors, 
                animatedTime + layerOffset,
                {
                    flameHeight: lifecycleHeight * layerScale,
                    flameIntensity: lifecycleIntensity,
                    flameComplexity: flameComplexity + layer,
                    flameFlicker: flameFlicker * (0.5 + 0.5 * (layer / flameLayerCount)), // Remove ignition dependency
                    flameTurbulence: flameTurbulence * layerScale,
                    flameCurl: flameCurl * layerScale,
                    flameWidth: flameWidth * layerScale,
                    flameSpread: flameSpread * layerScale,
                    opacity: layerOpacity,
                    layer,
                    originalColors: colors, // Pass original colors for borders/details
                    ignitionProgress // Pass ignition progress for flickering effects
                }
            );
        }
    }
    
    /**
     * Create flame color palette focused on flame body gradient (primary to secondary)
     */
    createFlameColorPalette(colors, steps) {
        const palette = [];
        
        // Create gradient from flame base (primary) to flame tips (secondary)
        for (let i = 0; i < steps; i++) {
            const t = i / (steps - 1);
            
            // Interpolate between primary (base) and secondary (tips)
            const interpolatedColor = [
                Math.round(colors.primary[0] * (1 - t) + colors.secondary[0] * t),
                Math.round(colors.primary[1] * (1 - t) + colors.secondary[1] * t),
                Math.round(colors.primary[2] * (1 - t) + colors.secondary[2] * t)
            ];
            
            palette.push(interpolatedColor);
        }
        
        return palette;
    }
    
    /**
     * Render a single flame layer
     */
    renderFlameLayer(ctx, width, height, colors, time, options) {
        const {
            flameHeight,
            flameIntensity,
            flameComplexity,
            flameFlicker,
            flameTurbulence,
            flameCurl,
            flameWidth,
            flameSpread,
            opacity,
            layer,
            originalColors,
            ignitionProgress = 1
        } = options;
        
        ctx.save();
        ctx.globalAlpha = opacity;
        
        // Generate flame anchor points across the bottom - ensure minimum visibility
        const numFlames = Math.max(5, Math.floor(flameComplexity * 2));
        const flameAnchors = [];
        
        for (let i = 0; i < numFlames; i++) {
            const baseX = (i / (numFlames - 1)) * width;
            const flickerX = (this.noise(baseX * 0.01, time * 0.2, layer) - 0.5) * flameSpread * width * 0.2;
            const flickerIntensity = this.noise(baseX * 0.02, time * 0.3, layer) * flameFlicker;
            
            // Randomize individual flame height (0.3 to 1.0 of max flame height)
            const heightVariation = 0.3 + this.noise(baseX * 0.05, time * 0.1, layer + 1000) * 0.7;
            const individualFlameHeight = flameHeight * heightVariation;
            
            flameAnchors.push({
                x: baseX + flickerX,
                y: height,
                intensity: 0.5 + flickerIntensity * 0.5,
                width: flameWidth * width * (0.5 + flickerIntensity * 0.5),
                height: individualFlameHeight // Individual height for this flame
            });
        }
        
        // Render each flame tongue
        flameAnchors.forEach((anchor, flameIndex) => {
            this.renderFlameTongue(
                ctx, 
                width, 
                height, 
                colors, 
                anchor, 
                time, 
                {
                    flameHeight: anchor.height, // Use individual flame height
                    flameIntensity,
                    flameTurbulence,
                    flameCurl,
                    flameIndex: flameIndex + layer * 100,
                    layer,
                    originalColors
                }
            );
        });
        
        ctx.restore();
    }
    
    /**
     * Render individual flame tongue with organic curves
     */
    renderFlameTongue(ctx, width, height, colors, anchor, time, options) {
        const {
            flameHeight,
            flameIntensity,
            flameTurbulence,
            flameCurl,
            flameIndex,
            layer,
            originalColors
        } = options;
        
        const flameTop = height * (1 - flameHeight);
        const segments = 30;
        
        // Generate proper flame shape: two base points converging to single tip
        const leftPoints = [];
        const rightPoints = [];
        
        // Define flame base points (wide base for conical shape)
        const baseSpread = anchor.width * 0.6; // Wider base for dramatic cone
        const leftBaseX = anchor.x - baseSpread;
        const rightBaseX = anchor.x + baseSpread;
        
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const y = height - (height - flameTop) * this.easeOutQuart(t);
            
            // Conical flame: lines converge quickly from wide base to narrow tip
            const convergenceEase = Math.pow(t, 2.5); // Rapid convergence for conical shape
            const widthAtHeight = baseSpread * (1 - convergenceEase);
            
            // Add very slow organic turbulence to the flame curves
            const turbulenceX = this.noise(anchor.x * 0.005, y * 0.01 + time * 0.1, flameIndex) * flameTurbulence * (widthAtHeight + 10);
            const curlOffset = Math.sin(t * Math.PI * 2 + time * 0.3) * flameCurl * widthAtHeight * t;
            
            // Calculate curve positions - converge from two base points to center tip
            const centerX = anchor.x + turbulenceX + curlOffset;
            
            // Left curve: starts at leftBaseX, curves toward centerX
            const leftCurveX = leftBaseX * (1 - t) + centerX * t + 
                this.noise(y * 0.01, time * 0.1, flameIndex) * flameTurbulence * widthAtHeight * 0.5;
            
            // Right curve: starts at rightBaseX, curves toward centerX  
            const rightCurveX = rightBaseX * (1 - t) + centerX * t + 
                this.noise(y * 0.01, time * 0.1, flameIndex + 500) * flameTurbulence * widthAtHeight * 0.5;
            
            leftPoints.push({ x: leftCurveX, y });
            rightPoints.push({ x: rightCurveX, y });
        }
        
        // Create proper flame path: two base points converging to single tip
        const flamePath = new Path2D();
        
        // Start at left base point
        flamePath.moveTo(leftBaseX, height);
        
        // Draw left curve up to tip
        leftPoints.forEach((point, i) => {
            if (i === 0) {
                flamePath.lineTo(point.x, point.y);
            } else {
                // Use quadratic curves for smooth organic flame shape
                const prevPoint = leftPoints[i - 1];
                const controlX = (prevPoint.x + point.x) / 2;
                const controlY = (prevPoint.y + point.y) / 2;
                flamePath.quadraticCurveTo(controlX, controlY, point.x, point.y);
            }
        });
        
        // At the tip, both curves should converge to same point
        const tipPoint = leftPoints[leftPoints.length - 1];
        
        // Draw right curve down from tip
        for (let i = rightPoints.length - 1; i >= 0; i--) {
            const point = rightPoints[i];
            if (i === rightPoints.length - 1) {
                // Connect tip to right curve
                flamePath.lineTo(point.x, point.y);
            } else {
                // Use quadratic curves for smooth organic shape
                const nextPoint = rightPoints[i + 1];
                const controlX = (nextPoint.x + point.x) / 2;
                const controlY = (nextPoint.y + point.y) / 2;
                flamePath.quadraticCurveTo(controlX, controlY, point.x, point.y);
            }
        }
        
        // Close path back to right base point and left base point
        flamePath.lineTo(rightBaseX, height);
        flamePath.closePath();
        
        // Fill with gradient based on height
        const gradient = this.createFlameGradient(
            ctx, 
            anchor.x, 
            height, 
            anchor.x, 
            flameTop, 
            colors, 
            flameIntensity
        );
        
        ctx.fillStyle = gradient;
        ctx.fill(flamePath);
        
        // Add flame border using accent color for distinction
        if (originalColors && originalColors.accent) {
            ctx.strokeStyle = `rgba(${originalColors.accent[0]}, ${originalColors.accent[1]}, ${originalColors.accent[2]}, ${0.6 + flameIntensity * 0.4})`;
            ctx.lineWidth = 2 + layer * 0.5; // Vary border thickness by layer
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke(flamePath);
        }
        
        // Add inner flame details with accent color for contrast
        this.renderInnerFlameDetails(ctx, leftPoints, rightPoints, originalColors || colors, time, options);
    }
    
    /**
     * Render inner flame spirals and details
     */
    renderInnerFlameDetails(ctx, leftPoints, rightPoints, colors, time, options) {
        const { flameIndex, layer } = options;
        
        // Add spiral elements - ensure at least 3 spirals
        const spiralCount = 3 + Math.floor(Math.random() * 3);
        
        for (let s = 0; s < spiralCount; s++) {
            const spiralT = 0.2 + (s / spiralCount) * 0.6;
            const spiralIndex = Math.floor(spiralT * leftPoints.length);
            
            if (spiralIndex < leftPoints.length && spiralIndex < rightPoints.length) {
                const leftPoint = leftPoints[spiralIndex];
                const rightPoint = rightPoints[spiralIndex];
                const centerX = (leftPoint.x + rightPoint.x) / 2;
                const centerY = (leftPoint.y + rightPoint.y) / 2;
                const spiralRadius = Math.abs(rightPoint.x - leftPoint.x) * 0.3;
                
                this.renderFlameSpiral(
                    ctx, 
                    centerX, 
                    centerY, 
                    spiralRadius, 
                    colors, 
                    time, 
                    flameIndex + s * 1000
                );
            }
        }
    }
    
    /**
     * Render flame spiral elements
     */
    renderFlameSpiral(ctx, centerX, centerY, radius, colors, time, spiralIndex) {
        ctx.save();
        
        const spiralTurns = 2 + Math.sin(time * 0.1 + spiralIndex) * 0.5;
        const points = 20;
        
        ctx.beginPath();
        
        for (let i = 0; i <= points; i++) {
            const t = i / points;
            const angle = t * spiralTurns * Math.PI * 2 + time * 0.2;
            const spiralRadius = radius * (1 - t * 0.8) * (0.5 + 0.5 * Math.sin(time * 0.3 + spiralIndex));
            
            const x = centerX + Math.cos(angle) * spiralRadius;
            const y = centerY + Math.sin(angle) * spiralRadius;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        // Use accent color for spiral details (4th color usage)
        if (colors && colors.accent) {
            ctx.strokeStyle = `rgba(${colors.accent[0]}, ${colors.accent[1]}, ${colors.accent[2]}, 0.8)`;
            ctx.lineWidth = 2;
            ctx.stroke();
        } else {
            // Fallback if accent color not available
            const brightColor = Array.isArray(colors) ? colors[colors.length - 1] : [255, 255, 255];
            ctx.strokeStyle = `rgba(${brightColor[0]}, ${brightColor[1]}, ${brightColor[2]}, 0.6)`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    /**
     * Create flame gradient from base to tip
     */
    createFlameGradient(ctx, x1, y1, x2, y2, colors, intensity) {
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        
        colors.forEach((color, index) => {
            const position = index / (colors.length - 1);
            const alpha = 0.3 + intensity * 0.7 * (1 - position * 0.5);
            gradient.addColorStop(
                position, 
                `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`
            );
        });
        
        return gradient;
    }
    
    /**
     * Ease out quart function for natural flame shape
     */
    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }
    
    /**
     * Simple noise function for organic movement
     */
    noise(x, y, z = 0) {
        const n = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
        return n - Math.floor(n);
    }
    
    /**
     * Calculate pattern complexity
     */
    calculateComplexity(params = {}) {
        const {
            flameComplexity = 6,
            flameLayerCount = 4,
            flameGradientSteps = 8,
            flameTurbulence = 0.3,
            flameCurl = 0.6
        } = params;
        
        let complexity = 40; // Base complexity for flame rendering
        
        complexity += Math.min(flameComplexity / 10, 1) * 25; // Pattern complexity
        complexity += Math.min(flameLayerCount / 8, 1) * 20; // Layer complexity
        complexity += Math.min(flameGradientSteps / 12, 1) * 10; // Gradient complexity
        complexity += flameTurbulence * 10; // Turbulence adds complexity
        complexity += flameCurl * 5; // Curl effects
        
        return Math.min(Math.max(Math.round(complexity), 1), 100);
    }
}

export default FlamePattern;