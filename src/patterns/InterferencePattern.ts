import { hexToRgb, blendColors } from '../utils/colorUtils';
import { PatternRenderer, WaveSource } from './types';

interface InterferenceOptions {
  wavelength: number;
  sources: WaveSource[];
  gradientMode: boolean;
  threshold: number;
}

export const renderInterferencePattern: PatternRenderer = (
  imageData: ImageData,
  svgMask: ImageData,
  width: number,
  height: number,
  timeRef: number,
  colors: any,
  options: InterferenceOptions
) => {
  const { wavelength, sources, gradientMode, threshold } = options;
  const data = imageData.data;
  const rgb1 = hexToRgb(colors.color1);
  const rgb2 = hexToRgb(colors.color2);
  const rgb3 = hexToRgb(colors.color3);
  const rgb4 = hexToRgb(colors.color4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const maskIndex = (y * width + x) * 4;
      const isInsideLogo = svgMask.data[maskIndex] > 128;
      const index = (y * width + x) * 4;


      if (isInsideLogo) {
        let amplitude = 0;

        sources.forEach((source, i) => {
          const dx = x - source.x;
          const dy = y - source.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const phase = i * Math.PI / 4;
          amplitude += Math.sin((distance / wavelength - timeRef) * 2 * Math.PI + phase);
        });

        const normalized = amplitude / sources.length;

        if (gradientMode) {
          const t = (normalized + 1) / 2;
          let finalColor;
          if (t < 0.33) {
            const localT = t / 0.33;
            finalColor = blendColors(rgb1, rgb2, localT);
          } else if (t < 0.66) {
            const localT = (t - 0.33) / 0.33;
            finalColor = blendColors(rgb2, rgb3, localT);
          } else {
            const localT = (t - 0.66) / 0.34;
            finalColor = blendColors(rgb3, rgb4, localT);
          }

          const noise = (Math.random() - 0.5) * 8;
          data[index] = Math.max(0, Math.min(255, finalColor.r + noise));
          data[index + 1] = Math.max(0, Math.min(255, finalColor.g + noise));
          data[index + 2] = Math.max(0, Math.min(255, finalColor.b + noise));
          data[index + 3] = 255;
        } else {
          const isLine = Math.abs(normalized) < threshold;
          if (isLine) {
            data[index] = rgb1.r;
            data[index + 1] = rgb1.g;
            data[index + 2] = rgb1.b;
            data[index + 3] = 255;
          } else {
            data[index] = rgb3.r;
            data[index + 1] = rgb3.g;
            data[index + 2] = rgb3.b;
            data[index + 3] = 255;
          }
        }
      } else {
        data[index] = rgb4.r;
        data[index + 1] = rgb4.g;
        data[index + 2] = rgb4.b;
        data[index + 3] = 255;
      }
    }
  }
};