/**
 * Parameter configurations for all patterns
 */

export const parameters = {
    'ContourInterference': {
        resolution: {
            type: 'slider',
            label: 'Grid Resolution',
            min: 2,      // Higher quality
            max: 6,      // Lower quality
            step: 0.5,
            default: 3,
            inverted: true, // Display inverted so lower values = higher quality
        },
        numRings: {
            type: 'slider',
            label: 'Wave Source Rings',
            min: 1,
            max: 4,
            step: 1,
            default: 2
        },
        sourcesPerRing: {
            type: 'slider',
            label: 'Sources per Ring',
            min: 4,
            max: 12,
            step: 2,
            default: 6
        },
        animationSpeed: {
            type: 'slider',
            label: 'Animation Speed',
            min: 0.0005,
            max: 0.005,
            step: 0.0005,
            default: 0.0015
        },
        lineWidth: {
            type: 'slider',
            label: 'Line Weight',
            min: 0.5,
            max: 2.0,
            step: 0.1,
            default: 0.8
        },
        lineColor: {
            type: 'color',
            label: 'Line Color',
            default: '#333333'
        },
        backgroundColor: {
            type: 'color',
            label: 'Background',
            default: '#F0EEE6'
        }
    }
};
