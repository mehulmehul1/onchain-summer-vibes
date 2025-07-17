import { SVG_CONFIG } from '../constants/patternConfig';

export const createSVGMask = (width: number, height: number, type: 'fill' | 'stroke' = 'fill'): Promise<ImageData> => {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", SVG_CONFIG.width.toString());
  svg.setAttribute("height", SVG_CONFIG.height.toString());
  svg.setAttribute("viewBox", SVG_CONFIG.viewBox);

  // Only create the white shape path (where patterns will fill)
  const shapePath = document.createElementNS(svgNS, "path");
  shapePath.setAttribute("d", SVG_CONFIG.path);
  
  if (type === 'stroke') {
    shapePath.setAttribute("fill", "none");
    shapePath.setAttribute("stroke", "white");
    shapePath.setAttribute("stroke-width", "30");
    shapePath.setAttribute("stroke-linecap", "round");
    shapePath.setAttribute("stroke-linejoin", "round");
  } else {
    shapePath.setAttribute("fill", "white");
  }

  svg.appendChild(shapePath);

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

      // Fill background with black for mask
      tempCtx.fillStyle = 'black';
      tempCtx.fillRect(0, 0, width, height);
      
      // Draw only the white shape for masking
      tempCtx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

      const imageData = tempCtx.getImageData(0, 0, width, height);
      URL.revokeObjectURL(svgUrl);
      resolve(imageData);
    };
    img.src = svgUrl;
  });
};

export const createSVGBackgroundLayer = (width: number, height: number): Promise<ImageData> => {
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

      // Clear canvas (transparent background)
      tempCtx.clearRect(0, 0, width, height);
      
      // Draw the complete SVG (black background + white shape)
      tempCtx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

      const imageData = tempCtx.getImageData(0, 0, width, height);
      URL.revokeObjectURL(svgUrl);
      resolve(imageData);
    };
    img.src = svgUrl;
  });
};

export const renderCompleteSVG = (ctx: CanvasRenderingContext2D, width: number, height: number): Promise<void> => {
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

      // Draw the complete SVG to canvas
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      
      URL.revokeObjectURL(svgUrl);
      resolve();
    };
    img.src = svgUrl;
  });
};

export const createClippingPath = (ctx: CanvasRenderingContext2D, width: number, height: number): Path2D => {
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

  // Calculate scale factors
  const scaleX = drawWidth / SVG_CONFIG.width;
  const scaleY = drawHeight / SVG_CONFIG.height;

  // Create Path2D from the white letter path
  const path = new Path2D();
  
  // Scale and translate the SVG path to match canvas coordinates
  const transform = new DOMMatrix();
  transform.translateSelf(drawX, drawY);
  transform.scaleSelf(scaleX, scaleY);
  
  // Add the white letter path with transform
  const letterPath = new Path2D(SVG_CONFIG.path);
  path.addPath(letterPath, transform);
  
  return path;
};

export const updateCanvasSize = (canvas: HTMLCanvasElement) => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  return { width, height };
};