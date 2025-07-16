export interface PatternColors {
  color1: string;
  color2: string;
  color3: string;
  color4: string;
}

export interface WaveSource {
  x: number;
  y: number;
}

export interface PatternRenderer {
  (
    imageData: ImageData,
    svgMask: ImageData,
    width: number,
    height: number,
    timeRef: number,
    colors: PatternColors,
    options?: any,
    strokeMask?: ImageData | null
  ): void;
}