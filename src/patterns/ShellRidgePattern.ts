import { hexToRgb, rgbaToString } from '../utils/colorUtils';
import { PatternRenderer } from './types';

interface ShellRidgeOptions {
  shellRidgeRings: number;
  shellRidgeDistortion: number;
}

export const renderShellRidgePattern: PatternRenderer = (
  imageData: ImageData,
  svgMask: ImageData,
  width: number,
  height: number,
  timeRef: number,
  colors: any,
  options: ShellRidgeOptions
) => {
  const { shellRidgeRings, shellRidgeDistortion } = options;
  const data = imageData.data;
  const rgb1 = hexToRgb(colors.color1);
  const rgb2 = hexToRgb(colors.color2);
  const rgb3 = hexToRgb(colors.color3);
  const rgb4 = hexToRgb(colors.color4);

  // Clear with background color
  for (let i = 0; i < data.length; i += 4) {
    data[i] = rgb4.r;
    data[i + 1] = rgb4.g;
    data[i + 2] = rgb4.b;
    data[i + 3] = 255;
  }

  // Create temporary canvas for pattern
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d')!;

  // Set background
  tempCtx.fillStyle = `rgb(${rgb4.r}, ${rgb4.g}, ${rgb4.b})`;
  tempCtx.fillRect(0, 0, width, height);

  // The still point at the center of all motion
  const centerX = width / 2;
  const centerY = height / 2;
  const time = timeRef * 100; // Scale time for smoother animation

  // Without going outside, see the pattern of creation
  for (let r = 0; r < shellRidgeRings; r++) {
    const baseRadius = 10 + r * Math.min(width, height) / (shellRidgeRings * 2);  // Each circle a world within worlds
    
    tempCtx.beginPath();
    for (let a = 0; a <= Math.PI * 2; a += 0.05) {
      // The dance of form and emptiness
      const distortion = Math.sin(a * 8 + time * 0.75 + r * 0.5) * shellRidgeDistortion +  // Breath of life
                        Math.sin(a * 12 - time * 1 + r * 0.3) * (shellRidgeDistortion * 0.625);       // Pulse of being
      
      const radius = baseRadius + distortion;
      const x = centerX + Math.cos(a) * radius;
      const y = centerY + Math.sin(a) * radius;
      
      if (a === 0) {
        tempCtx.moveTo(x, y);
      } else {
        tempCtx.lineTo(x, y);
      }
    }
    tempCtx.closePath();
    
    // Seeing the subtle within the obvious
    tempCtx.lineWidth = 1.5 + Math.sin(r * 0.5 + time * 0.01) * 0.5;  // The way things change
    const opacity = 0.6 - r * 0.02;
    tempCtx.strokeStyle = rgbaToString(rgb1, Math.max(0.1, opacity));  // From form to formless
    tempCtx.stroke();
    
    // The infinite in the finite
    for (let t = 0; t < 60; t++) {  // Each point contains the whole
      const angle = (t / 60) * Math.PI * 2;
      const textureRadius = baseRadius + Math.sin(angle * 8 + time * 1.5 * 0.01) * 5;
      const tx = centerX + Math.cos(angle) * textureRadius;
      const ty = centerY + Math.sin(angle) * textureRadius;
      
      tempCtx.beginPath();
      tempCtx.arc(tx, ty, 0.5, 0, Math.PI * 2);
      const textureOpacity = 0.2 - r * 0.01;
      tempCtx.fillStyle = rgbaToString(rgb3, Math.max(0.05, textureOpacity));
      tempCtx.fill();
    }
  }

  // Apply SVG mask
  const tempImageData = tempCtx.getImageData(0, 0, width, height);
  const tempData = tempImageData.data;

  const sampleSize = Math.max(1, Math.ceil(Math.sqrt(width * height) / 1000));
  for (let y = 0; y < height; y += sampleSize) {
    for (let x = 0; x < width; x += sampleSize) {
      const maskIndex = (y * width + x) * 4;
      const isInsideLogo = svgMask.data[maskIndex] > 128;
      if (isInsideLogo) {
        for (let dy = 0; dy < sampleSize && y + dy < height; dy++) {
          for (let dx = 0; dx < sampleSize && x + dx < width; dx++) {
            const fillX = x + dx;
            const fillY = y + dy;
            const fillIndex = (fillY * width + fillX) * 4;
            const tempIndex = (fillY * width + fillX) * 4;
            data[fillIndex] = tempData[tempIndex];
            data[fillIndex + 1] = tempData[tempIndex + 1];
            data[fillIndex + 2] = tempData[tempIndex + 2];
            data[fillIndex + 3] = 255;
          }
        }
      }
    }
  }
};