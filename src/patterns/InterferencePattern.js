/**
 * InterferencePattern.js - Modern Wave Interference Pattern
 * 
 * Updated to use modern Canvas 2D rendering with standard render() signature
 * Creates wave interference effects with multiple sources
 */

export class InterferencePattern {
    constructor() {
        this.name = 'Interference';
        this.type = 'interference';
    }
    
    /**
     * Render interference pattern with multiple wave sources
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} time - Animation time
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {Object} colors - Color theme
     * @param {Object} options - Pattern options
     */
    render(ctx, time, width, height, colors, options = {}) {
        const {
            wavelength = 25,
            speed = 0.018,
            threshold = 0.12,
            gradientMode = true,
            sourceCount = 9,
            noiseAmount = 8,
            phaseOffset = 0
        } = options;
        
        // Clear canvas with background
        ctx.fillStyle = `rgb(${colors.background[0]}, ${colors.background[1]}, ${colors.background[2]})`;
        ctx.fillRect(0, 0, width, height);
        
        // Generate wave sources in circular arrangement
        const sources = this.generateWaveSources(sourceCount, width, height);
        
        // Create image data for pixel manipulation
        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;
        
        // Calculate wave interference for each pixel (with sampling for performance)
        const sampleRate = 2; // Sample every 2nd pixel for performance
        
        for (let y = 0; y < height; y += sampleRate) {
            for (let x = 0; x < width; x += sampleRate) {
                // Calculate wave interference at this point
                let amplitude = 0;
                
                sources.forEach((source, i) => {
                    const dx = x - source.x;
                    const dy = y - source.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const phase = i * Math.PI / 4 + phaseOffset; // Phase offset for each source
                    
                    amplitude += Math.sin((distance / wavelength - time * speed * 100) * 2 * Math.PI + phase);
                });
                
                // Normalize amplitude
                const normalized = amplitude / sources.length;
                
                let finalColor;
                
                if (gradientMode) {
                    // Gradient mode - smooth color transitions
                    const t = (normalized + 1) / 2; // Normalize to 0-1
                    
                    if (t < 0.33) {
                        const localT = t / 0.33;
                        finalColor = this.blendColors(colors.background, colors.secondary, localT);
                    } else if (t < 0.66) {
                        const localT = (t - 0.33) / 0.33;
                        finalColor = this.blendColors(colors.secondary, colors.accent, localT);
                    } else {
                        const localT = (t - 0.66) / 0.34;
                        finalColor = this.blendColors(colors.accent, colors.primary, localT);
                    }
                    
                    // Add noise for texture
                    if (noiseAmount > 0) {
                        const noise = (Math.random() - 0.5) * noiseAmount;
                        finalColor = [
                            Math.max(0, Math.min(255, finalColor[0] + noise)),
                            Math.max(0, Math.min(255, finalColor[1] + noise)),
                            Math.max(0, Math.min(255, finalColor[2] + noise))
                        ];
                    }
                    
                } else {
                    // Line mode - discrete interference lines
                    const isLine = Math.abs(normalized) < threshold;
                    
                    if (isLine) {
                        finalColor = colors.primary; // Interference line color
                    } else {
                        finalColor = colors.background; // Background color
                    }
                }
                
                // Fill sampled area (2x2 block for performance)
                for (let sy = 0; sy < sampleRate && y + sy < height; sy++) {
                    for (let sx = 0; sx < sampleRate && x + sx < width; sx++) {
                        const index = ((y + sy) * width + (x + sx)) * 4;
                        if (index < data.length) {
                            data[index] = finalColor[0];     // R
                            data[index + 1] = finalColor[1]; // G
                            data[index + 2] = finalColor[2]; // B
                            data[index + 3] = 255;           // A
                        }
                    }
                }
            }
        }
        
        // Put image data back to canvas
        ctx.putImageData(imageData, 0, 0);
        
        // Add optional enhancement effects
        if (gradientMode && options.glowEffect) {
            this.addGlowEffect(ctx, width, height, colors);
        }
    }
    
    /**
     * Generate wave sources in circular arrangement
     */
    generateWaveSources(count, width, height) {
        const sources = [];
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.3;
        
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            sources.push({
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius
            });
        }
        
        return sources;
    }
    
    /**
     * Blend two colors
     * @param {Array} color1 - First color [r, g, b]
     * @param {Array} color2 - Second color [r, g, b]
     * @param {number} t - Blend factor (0-1)
     * @returns {Array} - Blended color [r, g, b]
     */
    blendColors(color1, color2, t) {
        return [
            Math.floor(color1[0] * (1 - t) + color2[0] * t),
            Math.floor(color1[1] * (1 - t) + color2[1] * t),
            Math.floor(color1[2] * (1 - t) + color2[2] * t)
        ];
    }
    
    /**
     * Add subtle glow effect for enhanced visual appeal
     */
    addGlowEffect(ctx, width, height, colors) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 0.1;
        
        // Create radial gradient for glow
        const gradient = ctx.createRadialGradient(
            width / 2, height / 2, 0,
            width / 2, height / 2, Math.min(width, height) / 2
        );
        
        gradient.addColorStop(0, `rgb(${colors.primary[0]}, ${colors.primary[1]}, ${colors.primary[2]})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        ctx.restore();
    }
    
    /**
     * Calculate pattern complexity for performance optimization
     */
    calculateComplexity(params = {}) {
        const {
            sourceCount = 9,
            gradientMode = true,
            noiseAmount = 8
        } = params;
        
        let complexity = 25; // Base complexity for interference
        
        complexity += sourceCount * 2; // Each source adds complexity
        complexity += gradientMode ? 15 : 5; // Gradient mode is more complex
        complexity += noiseAmount > 0 ? 10 : 0; // Noise adds texture complexity
        
        return Math.min(Math.max(Math.round(complexity), 1), 100);
    }
}

export default InterferencePattern;