import { hexToRgb, rgbaToString } from '../utils/colorUtils';
import { noise, getTileOffset } from '../utils/mathUtils';
import { VECTOR_FIELD_CONFIG } from '../constants/patternConfig';
import { PatternRenderer } from './types';

interface VectorFieldOptions {
  tileSize: number;
  tileShiftAmplitude: number;
  lines: Line[];
}

export class Line {
  x: number = 0;
  y: number = 0;
  points: Array<{ x: number; y: number }> = [];
  age: number = 0;
  lifespan: number = 0;
  opacity: number = 0;
  width: number = 0;
  baseColor: { r: number; g: number; b: number } = { r: 0, g: 0, b: 0 };

  constructor(width: number, height: number, color1: string, color2: string, tileSize: number) {
    this.reset(width, height, color1, color2, tileSize);
  }

  reset(width: number, height: number, color1: string, color2: string, tileSize: number) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 150;
    this.x = width / 2 + Math.cos(angle) * distance;
    this.y = height / 2 + Math.sin(angle) * distance;
    this.points = [];
    this.age = 0;
    this.lifespan = 400 + Math.random() * 600;
    this.opacity = 0;
    this.width = 0.2 + Math.random() * 0.8;
    const tileX = Math.floor(this.x / tileSize);
    const tileY = Math.floor(this.y / tileSize);
    const colorT = (tileX + tileY) / 20;
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    this.baseColor = {
      r: Math.round(rgb1.r + (rgb2.r - rgb1.r) * colorT),
      g: Math.round(rgb1.g + (rgb2.g - rgb1.g) * colorT),
      b: Math.round(rgb1.b + (rgb2.b - rgb1.b) * colorT),
    };
  }

  update(t: number, vectorField: (x: number, y: number, t: number) => { x: number; y: number }, width: number, height: number, color1: string, color2: string, tileSize: number) {
    this.age += 1;
    if (this.age >= this.lifespan) {
      this.reset(width, height, color1, color2, tileSize);
      return;
    }
    const progress = this.age / this.lifespan;
    if (progress < 0.1) {
      this.opacity = progress / 0.1 * VECTOR_FIELD_CONFIG.lineAlpha;
    } else if (progress > 0.9) {
      this.opacity = (1 - (progress - 0.9) / 0.1) * VECTOR_FIELD_CONFIG.lineAlpha;
    } else {
      this.opacity = VECTOR_FIELD_CONFIG.lineAlpha;
    }
    const vector = vectorField(this.x, this.y, t);
    this.points.push({ x: this.x, y: this.y });
    if (this.points.length > VECTOR_FIELD_CONFIG.linePoints) {
      this.points.shift();
    }
    this.x += vector.x * 0.5;
    this.y += vector.y * 0.5;
    const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height || magnitude < 0.01) {
      this.reset(width, height, color1, color2, tileSize);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.points.length < 2) return;
    ctx.beginPath();
    ctx.strokeStyle = rgbaToString(this.baseColor, this.opacity);
    ctx.lineWidth = this.width * VECTOR_FIELD_CONFIG.lineWidth;
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.stroke();
  }
}

export const renderVectorFieldPattern: PatternRenderer = (
  imageData: ImageData,
  svgMask: ImageData,
  width: number,
  height: number,
  timeRef: number,
  colors: any,
  options: VectorFieldOptions,
  strokeMask?: ImageData | null
) => {
  const { tileSize, tileShiftAmplitude, lines } = options;
  const data = imageData.data;
  const rgb4 = hexToRgb(colors.color4);
  const noiseScale = 0.005;
  const noiseTimeScale = 0.000125;

  // Clear with background
  for (let i = 0; i < data.length; i += 4) {
    data[i] = rgb4.r;
    data[i + 1] = rgb4.g;
    data[i + 2] = rgb4.b;
    data[i + 3] = 255;
  }

  // Create temporary canvas
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d')!;
  tempCtx.fillStyle = `rgb(${rgb4.r}, ${rgb4.g}, ${rgb4.b})`;
  tempCtx.fillRect(0, 0, width, height);

  const vectorField = (x: number, y: number, t: number) => {
    const { offsetX, offsetY } = getTileOffset(x, y, t, tileSize, tileShiftAmplitude);
    const adjustedX = x + offsetX;
    const adjustedY = y + offsetY;
    const nx = (adjustedX - width / 2) * 0.01;
    const ny = (adjustedY - height / 2) * 0.01;
    const n = noise(nx, ny, t * noiseTimeScale);
    const cx = adjustedX - width / 2;
    const cy = adjustedY - height / 2;
    const r = Math.sqrt(cx * cx + cy * cy);
    const mask = Math.max(0, 1 - r / 200);
    const angle = n * Math.PI * 4 + Math.atan2(cy, cx);
    return { x: Math.cos(angle) * mask, y: Math.sin(angle) * mask };
  };

  if (lines) {
    lines.forEach(line => {
      line.update(timeRef, vectorField, width, height, colors.color1, colors.color2, tileSize);
      line.draw(tempCtx);
    });
  }

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