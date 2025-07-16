import { hexToRgb, rgbaToString } from '../utils/colorUtils';
import { PatternRenderer } from './types';

interface MandalaOptions {
  mandalaComplexity: number;
  mandalaSpeed: number;
}

export const renderMandalaPattern: PatternRenderer = (
  imageData: ImageData,
  svgMask: ImageData,
  width: number,
  height: number,
  timeRef: number,
  colors: any,
  options: MandalaOptions,
  strokeMask?: ImageData | null
) => {
  const { mandalaComplexity, mandalaSpeed } = options;
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

  const time = timeRef * mandalaSpeed;
  const centerX = width / 2;
  const centerY = height / 2;
  const baseRadius = Math.min(width, height) / 8;

  const centerIntensity = (Math.sin(time * 0.025) + 1) / 2;
  const centerSize = 3 + centerIntensity * 3;
  tempCtx.beginPath();
  tempCtx.arc(centerX, centerY, centerSize, 0, Math.PI * 2);
  tempCtx.fillStyle = rgbaToString(rgb1, 0.8 + centerIntensity * 0.2);
  tempCtx.fill();

  for (let layer = 0; layer < mandalaComplexity; layer++) {
    const radius = baseRadius * (1 + layer * 0.7);
    const points = 6 + layer * 2;

    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const breathingFactor = 0.3 * Math.sin(time * 0.025 + layer * 0.5 + i * 0.2);
      const x = centerX + Math.cos(angle) * (radius + breathingFactor * radius);
      const y = centerY + Math.sin(angle) * (radius + breathingFactor * radius);

      const intensityPhase = (Math.sin(time * 0.015 + layer * 0.4 + i * 0.8) + 1) / 2;
      const opacity = 0.3 + intensityPhase * 0.6;
      const size = 2 + intensityPhase * (4 + layer);

      tempCtx.beginPath();
      if (layer % 3 === 0) {
        tempCtx.arc(x, y, size, 0, Math.PI * 2);
        tempCtx.fillStyle = rgbaToString(rgb1, opacity);
        tempCtx.fill();
      } else if (layer % 3 === 1) {
        tempCtx.rect(x - size, y - size, size * 2, size * 2);
        tempCtx.fillStyle = rgbaToString(rgb2, opacity);
        tempCtx.fill();
      } else {
        tempCtx.moveTo(x, y - size);
        tempCtx.lineTo(x + size, y);
        tempCtx.lineTo(x, y + size);
        tempCtx.lineTo(x - size, y);
        tempCtx.closePath();
        tempCtx.fillStyle = rgbaToString(rgb3, opacity);
        tempCtx.fill();
      }

      if (layer > 0 && i % 2 === 0) {
        const secondaryRadius = radius * 0.6;
        const x2 = centerX + Math.cos(angle + 0.3) * secondaryRadius;
        const y2 = centerY + Math.sin(angle + 0.3) * secondaryRadius;

        const secondaryIntensity = (Math.sin(time * 0.02 + layer * 0.3 + i) + 1) / 2;
        const secondaryOpacity = 0.2 + secondaryIntensity * 0.4;
        const secondarySize = 1 + secondaryIntensity * 2;

        tempCtx.beginPath();
        tempCtx.arc(x2, y2, secondarySize, 0, Math.PI * 2);
        tempCtx.fillStyle = rgbaToString(rgb2, secondaryOpacity);
        tempCtx.fill();
      }
    }
  }

  const numConnections = Math.floor(mandalaComplexity * 8);
  for (let i = 0; i < numConnections; i++) {
    const angle = (i / numConnections) * Math.PI * 2;
    const radius1 = baseRadius * 0.5;
    const radius2 = baseRadius * (2 + mandalaComplexity * 0.5);

    const x1 = centerX + Math.cos(angle) * radius1;
    const y1 = centerY + Math.sin(angle) * radius1;
    const x2 = centerX + Math.cos(angle) * radius2;
    const y2 = centerY + Math.sin(angle) * radius2;

    const lineIntensity = (Math.sin(time * 0.01 + i * 0.2) + 1) / 2;
    const lineOpacity = 0.1 + lineIntensity * 0.2;

    tempCtx.beginPath();
    tempCtx.moveTo(x1, y1);
    tempCtx.lineTo(x2, y2);
    tempCtx.strokeStyle = rgbaToString(rgb1, lineOpacity);
    tempCtx.lineWidth = 1 + lineIntensity;
    tempCtx.stroke();
  }

  for (let ring = 1; ring <= 3; ring++) {
    const ringRadius = baseRadius * (0.3 + ring * 0.4);
    const ringPoints = ring * 8;

    for (let i = 0; i < ringPoints; i++) {
      const angle = (i / ringPoints) * Math.PI * 2;
      const breathingOffset = Math.sin(time * 0.03 + ring * 0.8 + i * 0.1) * (ringRadius * 0.1);
      const x = centerX + Math.cos(angle) * (ringRadius + breathingOffset);
      const y = centerY + Math.sin(angle) * (ringRadius + breathingOffset);

      const dotIntensity = (Math.sin(time * 0.025 + ring * 0.5 + i * 0.3) + 1) / 2;
      const dotOpacity = 0.2 + dotIntensity * 0.5;
      const dotSize = 1 + dotIntensity * 2;

      tempCtx.beginPath();
      tempCtx.arc(x, y, dotSize, 0, Math.PI * 2);
      tempCtx.fillStyle = rgbaToString(rgb3, dotOpacity);
      tempCtx.fill();
    }
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