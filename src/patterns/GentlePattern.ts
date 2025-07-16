import { hexToRgb, rgbaToString } from '../utils/colorUtils';
import { PatternRenderer } from './types';

interface GentleOptions {
  wavelength: number;
  lineDensity: number;
}

export const renderGentlePattern: PatternRenderer = (
  imageData: ImageData,
  svgMask: ImageData,
  width: number,
  height: number,
  timeRef: number,
  colors: any,
  options: GentleOptions,
  strokeMask?: ImageData | null
) => {
  const { wavelength, lineDensity } = options;
  const data = imageData.data;
  const rgb1 = hexToRgb(colors.color1);
  const rgb2 = hexToRgb(colors.color2);
  const rgb3 = hexToRgb(colors.color3);
  const rgb4 = hexToRgb(colors.color4);

  for (let i = 0; i < data.length; i += 4) {
    data[i] = rgb4.r;
    data[i + 1] = rgb4.g;
    data[i + 2] = rgb4.b;
    data[i + 3] = 255;
  }

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d')!;

  tempCtx.fillStyle = `rgb(${rgb4.r}, ${rgb4.g}, ${rgb4.b})`;
  tempCtx.fillRect(0, 0, width, height);

  const time = timeRef;
  const stepSize = Math.max(4, Math.ceil(width / 300));

  const numHorizontalLines = Math.min(lineDensity, Math.ceil(height / 20));
  for (let i = 0; i < numHorizontalLines; i++) {
    const yPos = (i / numHorizontalLines) * height;
    const amplitude = (35 + 20 * Math.sin(time * 0.2 + i * 0.1)) * (wavelength / 25);
    const frequency = (0.008 + 0.004 * Math.sin(time * 0.1 + i * 0.05)) * (25 / wavelength);
    const speedOffset = time * (0.5 + 0.3 * Math.sin(i * 0.1));
    const thickness = 1.5 + 1.0 * Math.sin(time + i * 0.2);
    const opacity = 0.4 + 0.3 * Math.abs(Math.sin(time * 0.3 + i * 0.15));

    tempCtx.beginPath();
    tempCtx.lineWidth = thickness;
    tempCtx.strokeStyle = rgbaToString(rgb1, opacity);

    let firstPoint = true;
    for (let x = 0; x < width; x += stepSize) {
      const y = yPos + amplitude * Math.sin(x * frequency + speedOffset);
      if (firstPoint) {
        tempCtx.moveTo(x, y);
        firstPoint = false;
      } else {
        tempCtx.lineTo(x, y);
      }
    }
    tempCtx.stroke();
  }

  const numVerticalLines = Math.min(lineDensity, Math.ceil(width / 25));
  for (let i = 0; i < numVerticalLines; i++) {
    const xPos = (i / numVerticalLines) * width;
    const amplitude = (30 + 15 * Math.sin(time * 0.15 + i * 0.12)) * (wavelength / 25);
    const frequency = (0.009 + 0.004 * Math.cos(time * 0.12 + i * 0.07)) * (25 / wavelength);
    const speedOffset = time * (0.4 + 0.25 * Math.cos(i * 0.15));
    const thickness = 1.2 + 0.8 * Math.sin(time + i * 0.3);
    const opacity = 0.3 + 0.2 * Math.abs(Math.sin(time * 0.25 + i * 0.18));

    tempCtx.beginPath();
    tempCtx.lineWidth = thickness;
    tempCtx.strokeStyle = rgbaToString(rgb2, opacity);

    let firstPoint = true;
    for (let y = 0; y < height; y += stepSize) {
      const x = xPos + amplitude * Math.sin(y * frequency + speedOffset);
      if (firstPoint) {
        tempCtx.moveTo(x, y);
        firstPoint = false;
      } else {
        tempCtx.lineTo(x, y);
      }
    }
    tempCtx.stroke();
  }

  const numDiagonalLines = Math.min(Math.ceil(lineDensity / 2), Math.ceil(width / 80));
  for (let i = 0; i < numDiagonalLines; i++) {
    const offset = (i / numDiagonalLines) * width * 1.5 - width * 0.25;
    const amplitude = (20 + 10 * Math.cos(time * 0.25 + i * 0.1)) * (wavelength / 25);
    const frequency = (0.01 + 0.005 * Math.sin(time * 0.15 + i * 0.08)) * (25 / wavelength);
    const phase = time * (0.3 + 0.2 * Math.sin(i * 0.1));
    const thickness = 1.0 + 0.5 * Math.sin(time + i * 0.25);
    const opacity = 0.2 + 0.15 * Math.abs(Math.sin(time * 0.2 + i * 0.1));

    tempCtx.beginPath();
    tempCtx.lineWidth = thickness;
    tempCtx.strokeStyle = rgbaToString(rgb3, opacity);

    const steps = Math.ceil(height / stepSize);
    let firstPoint = true;
    for (let j = 0; j <= steps; j++) {
      const progress = j / steps;
      const x = offset + progress * width;
      const y = progress * height + amplitude * Math.sin(progress * 8 + phase);

      if (x >= 0 && x <= width && y >= 0 && y <= height) {
        if (firstPoint) {
          tempCtx.moveTo(x, y);
          firstPoint = false;
        } else {
          tempCtx.lineTo(x, y);
        }
      }
    }
    tempCtx.stroke();
  }

  const tempImageData = tempCtx.getImageData(0, 0, width, height);
  const tempData = tempImageData.data;

  const sampleSize = Math.max(1, Math.ceil(Math.sqrt(width * height) / 1000));
  for (let y = 0; y < height; y += sampleSize) {
    for (let x = 0; x < width; x += sampleSize) {
      const maskIndex = (y * width + x) * 4;
      const isInsideLogo = svgMask.data[maskIndex] > 128;
      
      // Skip if this pixel is part of the stroke outline
      if (strokeMask && strokeMask.data[maskIndex] > 0) {
        continue;
      }
      
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