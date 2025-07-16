import { useRef, useEffect, useCallback } from 'react';
import { updateCanvasSize } from '../utils/canvasUtils';
import { generateSources } from '../utils/mathUtils';

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};
import { 
  renderInterferencePattern, 
  renderGentlePattern, 
  renderMandalaPattern, 
  renderVectorFieldPattern,
  renderShellRidgePattern,
  Line
} from '../patterns';
import { PATTERN_TYPES, VECTOR_FIELD_CONFIG } from '../constants/patternConfig';
import { useSVGMask } from './useSVGMask';
import type { PatternType, PatternColors } from '../constants/patternConfig';

interface AnimationOptions {
  patternType: PatternType;
  wavelength: number;
  speed: number;
  threshold: number;
  gradientMode: boolean;
  colors: PatternColors;
  sourceCount: number;
  lineDensity: number;
  mandalaComplexity: number;
  mandalaSpeed: number;
  tileSize: number;
  tileShiftAmplitude: number;
  shellRidgeRings: number;
  shellRidgeDistortion: number;
  strokeEnabled: boolean;
  strokeWidth: number;
  strokeColor: string;
}

export const useCanvasAnimation = (options: AnimationOptions) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const linesRef = useRef<Line[] | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const optionsRef = useRef(options);
  const { createMask, getFillMask, getStrokeMask } = useSVGMask();

  // Update options ref when options change
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const initializeLines = useCallback((width: number, height: number) => {
    if (optionsRef.current.patternType === PATTERN_TYPES.VECTOR_FIELD && !linesRef.current) {
      linesRef.current = Array.from({ length: VECTOR_FIELD_CONFIG.numLines }, () => 
        new Line(width, height, optionsRef.current.colors.color1, optionsRef.current.colors.color2, optionsRef.current.tileSize)
      );
    }
  }, []);

  const animate = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const currentOptions = optionsRef.current;
    
    try {
      const fillMask = await getFillMask();
      const strokeMask = currentOptions.strokeEnabled ? await getStrokeMask() : null;
      const imageData = ctx.createImageData(width, height);
      const sources = generateSources(currentOptions.sourceCount, width, height);

      // First render stroke if enabled
      if (currentOptions.strokeEnabled && strokeMask) {
        console.log('Rendering stroke with color:', currentOptions.strokeColor);
        const strokeColor = hexToRgb(currentOptions.strokeColor);
        if (strokeColor) {
          let strokePixelCount = 0;
          for (let i = 0; i < imageData.data.length; i += 4) {
            const strokeAlpha = strokeMask.data[i];
            if (strokeAlpha > 0) {
              strokePixelCount++;
              // Make stroke fully opaque for better visibility
              imageData.data[i] = strokeColor.r;
              imageData.data[i + 1] = strokeColor.g;
              imageData.data[i + 2] = strokeColor.b;
              imageData.data[i + 3] = 255; // Full opacity
            }
          }
          console.log('Stroke pixels rendered:', strokePixelCount);
        }
      } else {
        console.log('Stroke not enabled or strokeMask is null:', {
          strokeEnabled: currentOptions.strokeEnabled,
          strokeMask: !!strokeMask
        });
      }

      // Then render pattern fill on top, but avoid overwriting stroke
      if (currentOptions.patternType === PATTERN_TYPES.INTERFERENCE) {
        renderInterferencePattern(imageData, fillMask, width, height, timeRef.current, currentOptions.colors, {
          wavelength: currentOptions.wavelength,
          sources,
          gradientMode: currentOptions.gradientMode,
          threshold: currentOptions.threshold
        }, strokeMask);
      } else if (currentOptions.patternType === PATTERN_TYPES.GENTLE) {
        renderGentlePattern(imageData, fillMask, width, height, timeRef.current, currentOptions.colors, {
          wavelength: currentOptions.wavelength,
          lineDensity: currentOptions.lineDensity
        }, strokeMask);
      } else if (currentOptions.patternType === PATTERN_TYPES.MANDALA) {
        renderMandalaPattern(imageData, fillMask, width, height, timeRef.current, currentOptions.colors, {
          mandalaComplexity: currentOptions.mandalaComplexity,
          mandalaSpeed: currentOptions.mandalaSpeed
        }, strokeMask);
      } else if (currentOptions.patternType === PATTERN_TYPES.VECTOR_FIELD) {
        renderVectorFieldPattern(imageData, fillMask, width, height, timeRef.current, currentOptions.colors, {
          tileSize: currentOptions.tileSize,
          tileShiftAmplitude: currentOptions.tileShiftAmplitude,
          lines: linesRef.current || []
        }, strokeMask);
      } else if (currentOptions.patternType === PATTERN_TYPES.SHELL_RIDGE) {
        renderShellRidgePattern(imageData, fillMask, width, height, timeRef.current, currentOptions.colors, {
          shellRidgeRings: currentOptions.shellRidgeRings,
          shellRidgeDistortion: currentOptions.shellRidgeDistortion
        }, strokeMask);
      }

      ctx.putImageData(imageData, 0, 0);
      timeRef.current += currentOptions.speed;
      animationFrameIdRef.current = requestAnimationFrame(animate);
    } catch (error) {
      console.error('Animation error:', error);
      // Retry after a short delay
      setTimeout(() => {
        if (animationFrameIdRef.current) {
          animationFrameIdRef.current = requestAnimationFrame(animate);
        }
      }, 100);
    }
  }, [getFillMask]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = updateCanvasSize(canvas);
    createMask(width, height, optionsRef.current.strokeEnabled, optionsRef.current.strokeWidth);
    initializeLines(width, height);
    
    if (linesRef.current) {
      linesRef.current.forEach(line => 
        line.reset(width, height, optionsRef.current.colors.color1, optionsRef.current.colors.color2, optionsRef.current.tileSize)
      );
    }
  }, [createMask, initializeLines]);

  // Initialize canvas and start animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = updateCanvasSize(canvas);
    createMask(width, height, optionsRef.current.strokeEnabled, optionsRef.current.strokeWidth);
    initializeLines(width, height);

    window.addEventListener('resize', handleResize);
    
    // Cancel any existing animation
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
    
    animate();

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      window.removeEventListener('resize', handleResize);
      linesRef.current = null;
    };
  }, []); // Empty dependency array - only run once on mount

  // Handle pattern type changes
  useEffect(() => {
    if (options.patternType === PATTERN_TYPES.VECTOR_FIELD && !linesRef.current) {
      const canvas = canvasRef.current;
      if (canvas) {
        const { width, height } = canvas;
        initializeLines(width, height);
      }
    }
  }, [options.patternType, initializeLines]);

  // Handle stroke changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const { width, height } = canvas;
      createMask(width, height, options.strokeEnabled, options.strokeWidth);
    }
  }, [options.strokeEnabled, options.strokeWidth, options.strokeColor, createMask]);

  return { canvasRef };
};