import { SVG_CONFIG } from '../constants/patternConfig';

export const createSVGMask = (width: number, height: number, type: 'fill' | 'stroke' = 'fill', strokeWidth: number = 0): Promise<ImageData> => {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", SVG_CONFIG.width.toString());
  svg.setAttribute("height", SVG_CONFIG.height.toString());
  svg.setAttribute("viewBox", SVG_CONFIG.viewBox);

  const path = document.createElementNS(svgNS, "path");
  path.setAttribute("d", SVG_CONFIG.path);
  
  if (type === 'stroke') {
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "white");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    // Scale stroke width more aggressively for better visibility
    const scaledStrokeWidth = strokeWidth * 30; // Increase stroke width more significantly
    path.setAttribute("stroke-width", scaledStrokeWidth.toString());
    console.log('Creating stroke mask with width:', scaledStrokeWidth);
  } else {
    path.setAttribute("fill", "white");
  }

  svg.appendChild(path);

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d')!;

  const svgData = new XMLSerializer().serializeToString(svg);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
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

      tempCtx.fillStyle = 'black';
      tempCtx.fillRect(0, 0, width, height);
      tempCtx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

      const imageData = tempCtx.getImageData(0, 0, width, height);
      URL.revokeObjectURL(svgUrl);
      resolve(imageData);
    };
    img.src = svgUrl;
  });
};

export const updateCanvasSize = (canvas: HTMLCanvasElement) => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  return { width, height };
};