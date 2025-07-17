import { useRef, useEffect, useCallback } from 'react';
import { updateCanvasSize, renderCompleteSVG, createClippingPath } from '../utils/canvasUtils';
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
import { PATTERN_TYPES, VECTOR_FIELD_CONFIG, SVG_CONFIG } from '../constants/patternConfig';
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
  // Cache for SVG image and clipping path
  const svgImageRef = useRef<HTMLImageElement | null>(null);
  const clippingPathRef = useRef<Path2D | null>(null);
  const svgSizeRef = useRef<{width: number, height: number} | null>(null);

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

  const initializeSVG = useCallback(async (width: number, height: number) => {
    // Check if we need to recreate SVG (size changed)
    if (svgSizeRef.current?.width === width && svgSizeRef.current?.height === height && svgImageRef.current) {
      return; // Already initialized for this size
    }

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", SVG_CONFIG.width.toString());
    svg.setAttribute("height", SVG_CONFIG.height.toString());
    svg.setAttribute("viewBox", SVG_CONFIG.viewBox);

    // Create black background path
    const backgroundPath = document.createElementNS(svgNS, "path");
    backgroundPath.setAttribute("d", SVG_CONFIG.backgroundPath);
    backgroundPath.setAttribute("fill", "black");
    svg.appendChild(backgroundPath);

    // Create white shape path
    const shapePath = document.createElementNS(svgNS, "path");
    shapePath.setAttribute("d", SVG_CONFIG.path);
    shapePath.setAttribute("fill", "white");
    svg.appendChild(shapePath);

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Clean up previous image
        if (svgImageRef.current) {
          const oldUrl = svgImageRef.current.src;
          if (oldUrl.startsWith('blob:')) {
            URL.revokeObjectURL(oldUrl);
          }
        }

        svgImageRef.current = img;
        svgSizeRef.current = { width, height };
        
        // Create clipping path
        clippingPathRef.current = createClippingPath({ getContext: () => null } as any, width, height);
        
        URL.revokeObjectURL(svgUrl);
        resolve();
      };
      img.src = svgUrl;
    });
  }, []);

  const animate = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const currentOptions = optionsRef.current;
    
    try {
      // Initialize SVG if needed
      await initializeSVG(width, height);
      
      // Check if SVG is ready
      if (!svgImageRef.current || !clippingPathRef.current) {
        // Schedule next frame and return
        animationFrameIdRef.current = requestAnimationFrame(animate);
        return;
      }
      
      // Clear the canvas
      ctx.clearRect(0, 0, width, height);
      
      // 1. Render the cached SVG image
      const svgAspectRatio = SVG_CONFIG.width / SVG_CONFIG.height;
      const maxSize = Math.min(width, height) * 0.7;

      let drawWidth, drawHeight, drawX, drawY;

      if (svgAspectRatio > width / height) {
        drawWidth = maxSize;
        drawHeight = maxSize / svgAspectRatio;
      } else {
        drawHeight = maxSize;
        drawWidth = maxSize * svgAspectRatio;
      }

      drawX = (width - drawWidth) / 2;
      drawY = (height - drawHeight) / 2;

      ctx.drawImage(svgImageRef.current, drawX, drawY, drawWidth, drawHeight);
      
      // 2. Save canvas state and create clipping mask for white letter areas
      ctx.save();
      ctx.clip(clippingPathRef.current);
      
      // 3. Create temporary canvas for pattern rendering
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext('2d')!;
      
      const tempImageData = tempCtx.createImageData(width, height);
      const sources = generateSources(currentOptions.sourceCount, width, height);
      
      // Create a simple mask that allows patterns everywhere (since clipping handles the masking)
      const simpleMask = tempCtx.createImageData(width, height);
      for (let i = 0; i < simpleMask.data.length; i += 4) {
        simpleMask.data[i] = 255;     // R
        simpleMask.data[i + 1] = 255; // G  
        simpleMask.data[i + 2] = 255; // B
        simpleMask.data[i + 3] = 255; // A - white everywhere
      }

      // Render stroke if enabled
      if (currentOptions.strokeEnabled) {
        const strokeColor = hexToRgb(currentOptions.strokeColor);
        if (strokeColor) {
          // For clipping approach, we don't need stroke mask - just render stroke pattern
          for (let i = 0; i < tempImageData.data.length; i += 4) {
            tempImageData.data[i] = strokeColor.r;
            tempImageData.data[i + 1] = strokeColor.g;
            tempImageData.data[i + 2] = strokeColor.b;
            tempImageData.data[i + 3] = 255;
          }
        }
      }

      // Render the selected pattern
      if (currentOptions.patternType === PATTERN_TYPES.INTERFERENCE) {
        renderInterferencePattern(tempImageData, simpleMask, width, height, timeRef.current, currentOptions.colors, {
          wavelength: currentOptions.wavelength,
          sources,
          gradientMode: currentOptions.gradientMode,
          threshold: currentOptions.threshold
        });
      } else if (currentOptions.patternType === PATTERN_TYPES.GENTLE) {
        renderGentlePattern(tempImageData, simpleMask, width, height, timeRef.current, currentOptions.colors, {
          wavelength: currentOptions.wavelength,
          lineDensity: currentOptions.lineDensity
        });
      } else if (currentOptions.patternType === PATTERN_TYPES.MANDALA) {
        renderMandalaPattern(tempImageData, simpleMask, width, height, timeRef.current, currentOptions.colors, {
          mandalaComplexity: currentOptions.mandalaComplexity,
          mandalaSpeed: currentOptions.mandalaSpeed
        });
      } else if (currentOptions.patternType === PATTERN_TYPES.VECTOR_FIELD) {
        renderVectorFieldPattern(tempImageData, simpleMask, width, height, timeRef.current, currentOptions.colors, {
          tileSize: currentOptions.tileSize,
          tileShiftAmplitude: currentOptions.tileShiftAmplitude,
          lines: linesRef.current || []
        });
      } else if (currentOptions.patternType === PATTERN_TYPES.SHELL_RIDGE) {
        renderShellRidgePattern(tempImageData, simpleMask, width, height, timeRef.current, currentOptions.colors, {
          shellRidgeRings: currentOptions.shellRidgeRings,
          shellRidgeDistortion: currentOptions.shellRidgeDistortion
        });
      }

      // 4. Draw the pattern to the clipped canvas (only visible in white letter areas)
      tempCtx.putImageData(tempImageData, 0, 0);
      ctx.drawImage(tempCanvas, 0, 0);
      
      // 5. Restore canvas state (removes clipping mask)
      ctx.restore();

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
  }, []);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = updateCanvasSize(canvas);
    initializeLines(width, height);
    
    // Clear cached SVG to force recreation with new size
    svgSizeRef.current = null;
    
    if (linesRef.current) {
      linesRef.current.forEach(line => 
        line.reset(width, height, optionsRef.current.colors.color1, optionsRef.current.colors.color2, optionsRef.current.tileSize)
      );
    }
  }, [initializeLines]);

  // Initialize canvas and start animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = updateCanvasSize(canvas);
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
      
      // Clean up SVG blob URL
      if (svgImageRef.current && svgImageRef.current.src.startsWith('blob:')) {
        URL.revokeObjectURL(svgImageRef.current.src);
      }
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


  return { canvasRef };
};