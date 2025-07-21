# Pattern Parameter Ranges for Onchain Summer Vibes

## Format for Parameter Values

Use this format when providing parameter values for patterns:

```json
{
  "patternType": "PATTERN_NAME",
  "baseParameters": {
    "speed": 0.08,
    "wavelength": 45,
    "threshold": 1.2
  },
  "patternSpecific": {
    // Pattern-specific parameters here
  }
}
```

## 1. INTERFERENCE PATTERN
**Visual**: Rippling wave interference from multiple sources
```json
{
  "patternType": "interference",
  "baseParameters": {
    "speed": [0.005, 0.020],        // Animation speed
    "wavelength": [30, 70],         // Wave size
    "threshold": [0.10, 0.16]         // Wave visibility threshold
  },
  "patternSpecific": {
    "sourceCount": [3, 7],         // Number of wave sources
    "lineDensity": [20, 50]         // Line rendering density
  }
}
```

## 2. GENTLE PATTERN
**Visual**: Flowing sinusoidal lines // anyhting random works
```json
{
  "patternType": "gentle",
  "baseParameters": {
    "speed": [0.003, 0.015],        // Animation speed
    "wavelength": [10, 50],         // animate between
    "wavelength": [40, 90],         // Wave size
    "threshold": [0.6, 1.8]         // Wave visibility
  },
  "patternSpecific": {
    "lineDensity": [15, 40],        // Number of lines
    "flowAmplitude": [0.3, 0.8],    // Wave height
    "harmonics": [1, 3]             // Wave complexity
  }
}
```

## 3. MANDALA PATTERN
**Visual**: Geometric sacred mandala with breathing animation
```json
{
  "patternType": "mandala",
  "baseParameters": {
    "speed": [0.004, 0.018],        // Base animation speed
    "wavelength": [35, 75],         // Size scale
    "threshold": [0.7, 1.5]         // Visibility
  },
  "patternSpecific": {
    "mandalaComplexity": [8, 12],   // Number of layers/arms
    "mandalaSpeed": [0.2, 2.0],     // Mandala-specific speed
    "rotationSpeed": [6.0, 9.5],   // Rotation rate
    "spiralArmFactor": [0.4, 0.7],  // Spiral intensity
    "layerGrowthFactor": [0.2, 0.3], // Layer size progression
    "breathingIntensity": [0.1, 0.5] // Breathing effect
  }
}
```

## 4. VECTOR FIELD PATTERN
**Visual**: Particle flow following vector fields
```json
{
  "patternType": "vectorField",
  "baseParameters": {
    "speed": [0.006, 0.025],        // Animation speed
    "wavelength": [25, 60],         // Field scale
    "threshold": [0.5, 1.2]         // Line visibility
  },
  "patternSpecific": {
    "vectorFieldStrength": [0.5, 1.5], // Field force
    "noiseScale": [0.003, 0.020],    // Turbulence detail
    "flowSpeed": [0.2, 0.8],         // Particle speed
    "lineLifespan": [200, 600],      // Line duration (frames)
    "numLines": [500, 750],          // Number of particles
    "trailLength": [0.3, 0.9],       // Trail fade
    "curliness": [0.1, 0.7],          // Path curvature
    "fieldstrength": [2.5,3]
  }
}

fieldstrngth 2.5,3
tilesize 300
tileshift 32
spawnradius 200,280
flow speed 2
line opacity 0.75,1
line thickness 8,12
line count 75,100
animate between spiral, grid, circle
```

## 5. SHELL RIDGE PATTERN
**Visual**: Concentric organic rings with breathing
```json
{
  "patternType": "shellRidge",
  "baseParameters": {
    "speed": [0.002, 0.012],        // Very slow breathing
    "wavelength": [30, 70],         // Ring scale
    "threshold": [0.8, 1.6]         // Ring visibility
  },
  "patternSpecific": {
    "shellRidgeRings": [10, 35],     // Number of rings
    "shellRidgeDistortion": [3, 15], // Organic distortion
    "breathingSpeed": [0.1, 0.8],    // Breathing rate
    "textureDensity": [0.3, 0.8],    // Surface texture
    "organicFactor": [0.4, 1.0],     // Natural irregularity
    "ridgeSharpness": [0.2, 0.9]     // Ridge definition
  }
}
```

## 6. CONTOUR INTERFERENCE PATTERN
**Visual**: Topographic-style contour lines
```json
{
  "patternType": "contourInterference",
  "baseParameters": {
    "speed": [0.004, 0.016],        // Animation speed
    "wavelength": [25, 65],         // Contour spacing
    "threshold": [0.6, 1.4]         // Line visibility
  },
  "patternSpecific": {
    "contourLevels": [8, 20],        // Number of contour lines
    "elevationScale": [0.5, 2.0],    // Height variation
    "noiseIntensity": [0.2, 0.8],    // Terrain roughness
    "lineWeight": [0.3, 1.2],       // Line thickness variation
    "terrainComplexity": [0.4, 1.0]  // Landscape detail
  }
}
```

## 7. RISO PRINT PATTERN
**Visual**: CMYK halftone dots and printing artifacts
```json
{
  "patternType": "risoPrint",
  "baseParameters": {
    "speed": [0.001, 0.008],        // Very slow animation
    "wavelength": [20, 50],         // Pattern scale
    "threshold": [0.5, 1.2]         // Dot visibility
  },
  "patternSpecific": {
    "risoComplexity": [4, 12],       // Print complexity
    "risoSpeed": [0.3, 1.2],         // Print animation speed
    "halftoneSize": [6, 16],         // Dot size
    "gridIrregularity": [0.1, 0.5],  // Print misalignment
    "shapeVariation": [0.3, 1.0],    // Dot shape variety
    "dotDensity": [0.4, 0.9],        // Dot coverage
    "colorSeparation": [0.2, 0.6],   // CMYK separation
    "printMisregistration": [1, 4]   // Print offset errors
  }
}
halftone size - 12,30
grid irregularity 0.1, 0.5 // animates between
shape varition - 0.15,1.5
dot density 0.75,1





```

## 8. RADIAL GROWTH PATTERN
**Visual**: Growing radial organic structures
```json
{
  "patternType": "radialGrowth",
  "baseParameters": {
    "speed": [1, 3.0],        // Growth speed
    "wavelength": [80, 120],         // Structure scale
    "threshold": [0.7, 1.5]         // Growth visibility
  },
  "patternSpecific": {
    "growthCenters": [3, 8],         // Number of growth points
    "branchingFactor": [0.4, 0.9],   // Branch complexity
    "growthRate": [0.3, 1.2],        // Speed variation
    "organicness": [0.5, 1.0],       // Natural irregularity
    "maxGrowthRadius": [0.6, 1.0],   // Maximum size
    "branchDensity": [0.4, 0.8]      // Branch thickness
  }
}
max colonies - 100,140
lifespan - 1
opacity- 1
clustering - 0.5,1
size variety 2.5
density variety 2.2,2.7
spwan rate -100
growth speed - 2.2,2.5
```

## 9. FLAME PATTERN
**Visual**: Living flame simulation with multiple layers
```json
{
  "patternType": "flame",
  "baseParameters": {
    "speed": [0.1],        // Animation speed
    "wavelength": [20, 60],         // Flame scale
    "threshold": [0.4, 1.0]         // Flame visibility
  },
  "patternSpecific": {
    "flameHeight": [0.8],      // Flame reach (0-1)
    "flameSpeed": [0.1, 0.6],        // Movement speed
    "flameIntensity": [0.3, 0.6],    // Flame brightness
    "flameComplexity": [2, 6],       // Detail level
    "flameFlicker": 0.05,     // Flickering amount
    "flameTurbulence": [0.15, 0.3],  // Chaos factor
    "flameLayerCount": [3, 8],       // Flame layers
    "flameWidth": 0.3        // Base width
    "hotspotIntensity": [0.4, 0.9],  // Core heat
    "emberCount": [0, 20]            // Floating embers
  }
}
```

## Animation Speed Categories

For trait generation:
- **Slow**: speed < 0.01
- **Medium**: 0.01 ≤ speed < 0.015  
- **Fast**: speed ≥ 0.015

## Complexity Categories

For trait generation:
- **Simple**: < 40 complexity points
- **Medium**: 40-59 complexity points
- **Complex**: 60-79 complexity points
- **Intricate**: ≥ 80 complexity points

## Usage Examples

### Single Pattern Configuration
```json
{
  "patternType": "mandala",
  "baseParameters": {
    "speed": 0.012,
    "wavelength": 55,
    "threshold": 1.1
  },
  "patternSpecific": {
    "mandalaComplexity": 8,
    "mandalaSpeed": 1.2,
    "rotationSpeed": 0.15,
    "spiralArmFactor": 0.6,
    "layerGrowthFactor": 0.7,
    "breathingIntensity": 0.3
  }
}
```

### Multiple Pattern Batch
```json
[
  {
    "patternType": "flame",
    "baseParameters": { "speed": 0.018, "wavelength": 45, "threshold": 0.8 },
    "patternSpecific": { "flameHeight": 0.8, "flameComplexity": 5, "flameFlicker": 0.2 }
  },
  {
    "patternType": "risoPrint", 
    "baseParameters": { "speed": 0.004, "wavelength": 35, "threshold": 1.0 },
    "patternSpecific": { "halftoneSize": 10, "dotDensity": 0.7, "gridIrregularity": 0.3 }
  }
]
```

## Notes

- All speed values are in animation units per frame
- Wavelength values are in pixels
- Threshold values control visibility/intensity
- Pattern-specific parameters vary by pattern type
- Values should stay within specified ranges for best visual results
- Use ranges `[min, max]` for randomization or pick specific values