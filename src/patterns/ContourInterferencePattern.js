/**
 * ContourInterferencePattern - Wave interference visualization using marching squares
 * Converted from React component WaveInterferenceV5
 */

import { PatternRenderer } from './PatternRenderer.js';

export class ContourInterferencePattern extends PatternRenderer {
    constructor() {
        super();
        
        // Default parameters as defined in PRP
        this.parameters = {
            resolution: 3,      // Grid resolution (smaller = higher quality)
            numRings: 2,       // Number of concentric rings of sources
            sourcesPerRing: 6, // Number of sources per ring
            animationSpeed: 0.0015, // Animation speed (from React version)
            lineWidth: 0.8,     // Default line width for contours
            
            // Wave Physics Parameters
            wavelengthVariation: 0.2,   // Randomness in wavelength (0-1)
            amplitudeDecay: 0.2,        // How quickly amplitude decreases per ring
            phaseShift: 0,              // Global phase offset for all waves
            dampingFactor: 0.003,       // Distance-based damping coefficient
            contourThickness: 1.0,      // Multiplier for line thickness
            maxDistance: 400,           // Maximum influence distance for sources
            nonlinearity: 0,            // Non-linear wave interaction strength
            contourLevels: 5,           // Number of contour levels to draw
            fillRegions: true           // Whether to fill regions between contours
        };

        // Default colors
        this.colors = {
            backgroundColor: '#F0EEE6', // From React version
            lineColor: '#333'          // From React version
        };

        // Pre-computed constants
        this.TWO_PI = Math.PI * 2;
        this.INV_300 = 1 / 300;

        // Contour levels for marching squares (will be dynamically generated)
        this.contourLevelValues = [-0.8, -0.4, 0, 0.4, 0.8];

        // Arrays that will be initialized in initialize()
        this.sources = [];
        this.field = null;
    }

    initialize(width, height) {
        // Clear existing sources
        this.sources = [];

        // Use provided width/height or defaults
        const w = width || 800;
        const h = height || 600;

        // Add central source
        this.sources.push({
            x: w/2,
            y: h/2,
            wavelength: 25,
            phase: 0,
            amplitude: 1.5
        });

        // Add radial sources with physics parameters
        for (let ring = 1; ring <= this.parameters.numRings; ring++) {
            const radius = ring * 120; // Increased spacing from React version
            const numSources = this.parameters.sourcesPerRing;
            
            for (let i = 0; i < numSources; i++) {
                const angle = (i / numSources) * this.TWO_PI;
                const baseWavelength = 20 + ring * 5;
                const wavelengthVar = this.parameters.wavelengthVariation * 
                    (Math.random() - 0.5) * baseWavelength;
                
                this.sources.push({
                    x: w/2 + Math.cos(angle) * radius,
                    y: h/2 + Math.sin(angle) * radius,
                    wavelength: baseWavelength + wavelengthVar,
                    phase: (i / numSources) * Math.PI + this.parameters.phaseShift,
                    amplitude: (1.0 - ring * this.parameters.amplitudeDecay)
                });
            }
        }

        // Pre-allocate field array based on resolution
        const rows = Math.floor(h / this.parameters.resolution);
        const cols = Math.floor(w / this.parameters.resolution);
        this.field = new Array(rows).fill(0).map(() => new Array(cols).fill(0));
    }

    // Helper functions from React version
    lerp(a, b, t) {
        return a + t * (b - a);
    }

    safeDiv(a, b) {
        return b === 0 ? 0 : a / b;
    }

    // Calculate field values
    updateField(time, width, height) {
        const resolution = this.parameters.resolution;
        const rows = Math.floor(height / resolution);
        const cols = Math.floor(width / resolution);

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const x = j * resolution;
                const y = i * resolution;
                let amplitude = 0;

                for (const source of this.sources) {
                    const dx = x - source.x;
                    const dy = y - source.y;
                    const dist2 = dx * dx + dy * dy;
                    const distance = Math.sqrt(dist2);
                    
                    // Skip if too far from source (optimization)
                    if (distance > this.parameters.maxDistance) continue;
                    
                    // Apply amplitude falloff with damping
                    const falloff = Math.exp(-distance * this.parameters.dampingFactor * 100);
                    let waveValue = Math.sin((distance / source.wavelength - time) * this.TWO_PI + source.phase);
                    
                    // Apply nonlinearity
                    if (this.parameters.nonlinearity > 0) {
                        waveValue = waveValue + this.parameters.nonlinearity * Math.sin(3 * waveValue);
                    }
                    
                    amplitude += source.amplitude * falloff * waveValue;
                }

                this.field[i][j] = amplitude;
            }
        }
    }

    // Generate dynamic contour levels
    generateContourLevels() {
        const numLevels = this.parameters.contourLevels;
        const levels = [];
        for (let i = 0; i < numLevels; i++) {
            const level = -1.0 + (2.0 * i) / (numLevels - 1);
            levels.push(level);
        }
        return levels;
    }

    // Draw filled regions between contour levels using all 4 colors
    drawFilledRegions(ctx, colors) {
        const resolution = this.parameters.resolution;
        const rows = this.field.length;
        const cols = this.field[0].length;
        
        // Create image data for pixel-level filling
        const imageData = ctx.createImageData(cols * resolution, rows * resolution);
        const data = imageData.data;
        
        // Map field values to colors
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const fieldValue = this.field[i][j];
                const normalizedValue = (fieldValue + 2) / 4; // Normalize to 0-1
                
                // Map to 4 color regions based on field value
                let color;
                if (normalizedValue < 0.25) {
                    // Low values - primary color
                    color = colors.primary;
                } else if (normalizedValue < 0.5) {
                    // Low-mid values - secondary color  
                    color = colors.secondary;
                } else if (normalizedValue < 0.75) {
                    // High-mid values - accent color
                    color = colors.accent;
                } else {
                    // High values - background color (lightest)
                    color = colors.background;
                }
                
                // Fill the grid cell
                for (let dy = 0; dy < resolution; dy++) {
                    for (let dx = 0; dx < resolution; dx++) {
                        const x = j * resolution + dx;
                        const y = i * resolution + dy;
                        
                        if (x < imageData.width && y < imageData.height) {
                            const index = (y * imageData.width + x) * 4;
                            data[index] = color[0];     // Red
                            data[index + 1] = color[1]; // Green
                            data[index + 2] = color[2]; // Blue
                            data[index + 3] = 180;      // Alpha (semi-transparent)
                        }
                    }
                }
            }
        }
        
        // Apply the filled regions
        ctx.putImageData(imageData, 0, 0);
    }

    // Draw contours using marching squares algorithm
    drawContours(ctx, colors) {
        const resolution = this.parameters.resolution;
        const rows = this.field.length;
        const cols = this.field[0].length;
        const contourLevels = this.generateContourLevels();

        contourLevels.forEach((level, index) => {
            // Vary line weight based on contour level with thickness multiplier
            const baseWidth = this.parameters.lineWidth * this.parameters.contourThickness;
            ctx.lineWidth = index % 2 === 0 ? baseWidth : baseWidth * 0.625;
            
            // Vary line color based on contour level
            const colorIndex = index % 4;
            let lineColor;
            switch (colorIndex) {
                case 0: lineColor = colors.primary; break;
                case 1: lineColor = colors.secondary; break;
                case 2: lineColor = colors.accent; break;
                case 3: lineColor = colors.background; break;
            }
            ctx.strokeStyle = `rgb(${lineColor[0]}, ${lineColor[1]}, ${lineColor[2]})`;
            
            ctx.beginPath();

            for (let i = 0; i < rows - 1; i++) {
                for (let j = 0; j < cols - 1; j++) {
                    const x = j * resolution;
                    const y = i * resolution;
                    
                    // Get field values at corners
                    const v00 = this.field[i][j];
                    const v10 = this.field[i][j + 1];
                    const v11 = this.field[i + 1][j + 1];
                    const v01 = this.field[i + 1][j];
                    
                    // Early exit optimization
                    const allAbove = v00 > level && v10 > level && v11 > level && v01 > level;
                    const allBelow = v00 <= level && v10 <= level && v11 <= level && v01 <= level;
                    if (allAbove || allBelow) continue;
                    
                    // Calculate case number
                    const case4 = 
                        (v00 > level ? 8 : 0) +
                        (v10 > level ? 4 : 0) +
                        (v11 > level ? 2 : 0) +
                        (v01 > level ? 1 : 0);

                    // Draw appropriate line segments based on case
                    this.drawContourCase(ctx, case4, x, y, resolution, level, v00, v10, v11, v01);
                }
            }

            ctx.stroke();
        });
    }

    drawContourCase(ctx, case4, x, y, resolution, level, v00, v10, v11, v01) {
        let x1, y1, x2, y2;

        switch (case4) {
            case 1: case 14: {
                const t1 = this.safeDiv(level - v00, v01 - v00);
                const t2 = this.safeDiv(level - v01, v11 - v01);
                x1 = x;
                y1 = this.lerp(y, y + resolution, t1);
                x2 = this.lerp(x, x + resolution, t2);
                y2 = y + resolution;
                break;
            }
            case 2: case 13: {
                const t1 = this.safeDiv(level - v01, v11 - v01);
                const t2 = this.safeDiv(level - v11, v10 - v11);
                x1 = this.lerp(x, x + resolution, t1);
                y1 = y + resolution;
                x2 = x + resolution;
                y2 = this.lerp(y + resolution, y, t2);
                break;
            }
            case 3: case 12: {
                const t1 = this.safeDiv(level - v00, v01 - v00);
                const t2 = this.safeDiv(level - v10, v11 - v10);
                x1 = x;
                y1 = this.lerp(y, y + resolution, t1);
                x2 = x + resolution;
                y2 = this.lerp(y, y + resolution, t2);
                break;
            }
            case 4: case 11: {
                const t1 = this.safeDiv(level - v10, v11 - v10);
                const t2 = this.safeDiv(level - v10, v00 - v10);
                x1 = x + resolution;
                y1 = this.lerp(y, y + resolution, t1);
                x2 = this.lerp(x + resolution, x, t2);
                y2 = y;
                break;
            }
            case 6: case 9: {
                const t1 = this.safeDiv(level - v10, v00 - v10);
                const t2 = this.safeDiv(level - v11, v01 - v11);
                x1 = this.lerp(x + resolution, x, t1);
                y1 = y;
                x2 = this.lerp(x + resolution, x, t2);
                y2 = y + resolution;
                break;
            }
            case 7: case 8: {
                const t1 = this.safeDiv(level - v00, v01 - v00);
                const t2 = this.safeDiv(level - v00, v10 - v00);
                x1 = x;
                y1 = this.lerp(y, y + resolution, t1);
                x2 = this.lerp(x, x + resolution, t2);
                y2 = y;
                break;
            }
            case 5: case 10: {
                // Handle saddle points with two line segments
                const t1 = this.safeDiv(level - v00, v01 - v00);
                const t2 = this.safeDiv(level - v00, v10 - v00);
                ctx.moveTo(x, this.lerp(y, y + resolution, t1));
                ctx.lineTo(this.lerp(x, x + resolution, t2), y);

                const t3 = this.safeDiv(level - v11, v10 - v11);
                const t4 = this.safeDiv(level - v11, v01 - v11);
                ctx.moveTo(x + resolution, this.lerp(y + resolution, y, t3));
                ctx.lineTo(this.lerp(x + resolution, x, t4), y + resolution);
                return;
            }
            default:
                return;
        }

        // Draw the line segment
        if (x1 !== undefined) {
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
        }
    }

    render(ctx, time, width, height, colors, options = {}) {
        // Initialize if needed
        if (!this.field || this.field.length === 0) {
            this.initialize(width, height);
        }
        
        // Update parameters from options
        this.parameters = { ...this.parameters, ...options };
        
        // Clear background with provided colors
        ctx.fillStyle = `rgb(${colors.background[0]}, ${colors.background[1]}, ${colors.background[2]})`;
        ctx.fillRect(0, 0, width, height);
        
        // Update field values
        this.updateField(time * this.parameters.animationSpeed, width, height);
        
        // Conditionally draw filled regions using all 4 colors
        if (this.parameters.fillRegions) {
            this.drawFilledRegions(ctx, colors);
        }
        
        // Then draw contour lines on top
        this.drawContours(ctx, colors);
    }

    calculateComplexity(params = this.parameters) {
        // Base complexity on grid resolution and number of wave sources
        const gridPoints = (1 / params.resolution) * (1 / params.resolution);
        const numSources = 1 + (params.numRings * params.sourcesPerRing); // Including center source
        
        // Calculate raw complexity score
        let score = (gridPoints * 0.5) + // Grid resolution impact
                   (numSources * 0.3) +  // Number of sources impact
                   (params.contourLevels * 0.2); // Contour levels impact
        
        // Normalize to 1-10 range
        return Math.min(10, Math.max(1, Math.round(score)));
    }
}
